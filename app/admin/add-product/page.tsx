"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { supabase } from '@/services/supabase'
import * as z from "zod"
import {
  Plus,
  Trash2,
  Loader2,
  ArrowLeft,
  ArrowRight,
  Info,
  Image as ImageIcon,
  Film,
  Settings,
  Layers,
  Upload,
  X,
  Check,
  AlertCircle
} from "lucide-react"

import { ProductService } from "@/services/product-service"
import type { Brand, Category, ProductAttribute } from "@/models/product"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

// Zod schema for Tab 1 (Basic Info) + general validation parameters
const productFormSchema = z.object({
  name: z.string().min(1, { message: "Product name is required" }),
  slug: z.string().min(1, { message: "Slug is required" }).regex(/^[a-z0-9-_]*$/, { message: "Slug must contain only lowercase letters, numbers, hyphens, and underscores" }),
  sku: z.string().optional(),
  description: z.string().optional(),
  base_price: z.coerce.number().min(0, { message: "Base price must be 0 or greater" }),
  sale_price: z.coerce.number().optional().nullable(),
  stock_quantity: z.coerce.number().int().min(0, { message: "Stock must be 0 or greater" }).default(0),
  status: z.enum(["active", "inactive"]).default("active"),
  brand_id: z.coerce.number().nullable().optional(),
  category_id: z.coerce.number().nullable().optional(),
}).refine(data => {
  if (data.sale_price !== null && data.sale_price !== undefined && data.sale_price >= 0) {
    return data.sale_price <= data.base_price;
  }
  return true;
}, {
  message: "Sale price must be less than or equal to base price",
  path: ["sale_price"]
});

type ProductFormValues = z.infer<typeof productFormSchema>

// Tab Identifiers
type TabType = "basic" | "images" | "attributes" | "variants"

interface AttributeRow {
  id: string // unique row client ID
  attribute_id: number | null
  value: string
}

interface VariantRow {
  id: string // unique row client ID
  variant_sku: string
  variant_price: number | ""
  variant_stock: number | ""
}

export default function AddProductPage() {
  const router = useRouter()
  const { toast } = useToast()

  // Tabs Navigation State
  const [activeTab, setActiveTab] = useState<TabType>("basic")

  // Master Lists loaded from database
  const [brands, setBrands] = useState<Brand[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [attributesList, setAttributesList] = useState<ProductAttribute[]>([])
  const [loadingOptions, setLoadingOptions] = useState(true)

  // Dynamic States for Tabs 2, 3, 4
  const [uploadedMedia, setUploadedMedia] = useState<{ url: string; type: "image" | "video" }[]>([])
  const [draggedImageIdx, setDraggedImageIdx] = useState<number | null>(null)
  const [attributes, setAttributes] = useState<AttributeRow[]>([])
  const [variants, setVariants] = useState<VariantRow[]>([])

  // UI state managers
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Setup form using React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      sku: "",
      description: "",
      base_price: 0,
      sale_price: null,
      stock_quantity: 0,
      status: "active",
      brand_id: null,
      category_id: null,
    },
  })

  const productName = watch("name")
  const productSKU = watch("sku")

  // Auto-generate slug from name (lowercase, hyphenated)
  useEffect(() => {
    if (productName) {
      const generatedSlug = productName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-") // replace special chars/spaces with hyphen
        .replace(/(^-|-$)/g, "") // trim starting/ending hyphens
      setValue("slug", generatedSlug)
    }
  }, [productName, setValue])

  // Load Categories, Brands, and Attributes from server
  useEffect(() => {
    async function loadFormDependencies() {
      try {
        const [brandsData, categoriesData, attributesData] = await Promise.all([
          ProductService.getAllBrands(),
          ProductService.getAllCategories(),
          ProductService.getAllAttributes(),
        ])
        setBrands(brandsData || [])
        setCategories(categoriesData || [])
        setAttributesList(attributesData || [])
      } catch (err) {
        console.error("Failed to load options:", err)
        toast({
          title: "Database Error",
          description: "Could not retrieve brands, categories, or attributes.",
          variant: "destructive"
        })
      } finally {
        setLoadingOptions(false)
      }
    }
    loadFormDependencies()
  }, [toast])

  // Handle image/video files upload
  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    const newItems: { url: string; type: "image" | "video" }[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      // Generate a safe filename
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()
      const ext = file.type.startsWith("image/") ? (file.name.includes('.') ? "." + file.name.split('.').pop() : ".jpg") : (file.name.includes('.') ? "." + file.name.split('.').pop() : ".mp4")
      const uniqueFilename = `${nameWithoutExt}-${Date.now()}${ext}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('products')
        .upload(uniqueFilename, file, { contentType: file.type })

      console.log("Print the data uploaded after the supabase ", uploadData)

      if (uploadError) {
        console.error('Supabase upload error:', uploadError)
        toast({
          title: 'Upload Error',
          description: uploadError.message || `Could not upload "${file.name}"`,
          variant: 'destructive',
        })
        continue
      }

      const { data: publicData } = supabase.storage.from('products').getPublicUrl(uniqueFilename)

      const fileUrl = publicData?.publicUrl ?? ''
      const mediaType: "image" | "video" = file.type.startsWith("video/") ? "video" : "image"
      newItems.push({ url: fileUrl, type: mediaType })
    }
    console.log("Uploaded media: ", newItems)
    if (newItems.length > 0) setUploadedMedia(prev => [...prev, ...newItems])
    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // Remove media item
  const handleRemoveMedia = (indexToRemove: number) => {
    setUploadedMedia(prev => prev.filter((_, idx) => idx !== indexToRemove))
  }

  // Shift media positions manually (fallback for mobile/buttons)
  const moveMedia = (index: number, direction: "left" | "right") => {
    if (direction === "left" && index === 0) return
    if (direction === "right" && index === uploadedMedia.length - 1) return

    const newIdx = direction === "left" ? index - 1 : index + 1
    const newItems = [...uploadedMedia]
    const temp = newItems[index]
    newItems[index] = newItems[newIdx]
    newItems[newIdx] = temp
    setUploadedMedia(newItems)
  }

  // HTML5 Drag and Drop for Image Reordering
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedImageIdx(index)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedImageIdx === null || draggedImageIdx === index) return

    // Reorder array on hover for smooth feedback
    const reorderedMedia = [...uploadedMedia]
    const draggedItem = reorderedMedia[draggedImageIdx]
    reorderedMedia.splice(draggedImageIdx, 1)
    reorderedMedia.splice(index, 0, draggedItem)

    setDraggedImageIdx(index)
    setUploadedMedia(reorderedMedia)
  }

  const handleDragEnd = () => {
    setDraggedImageIdx(null)
  }

  // Add Dynamic Attribute Row
  const handleAddAttribute = () => {
    setAttributes(prev => [
      ...prev,
      { id: Math.random().toString(), attribute_id: null, value: "" }
    ])
  }

  // Update Dynamic Attribute Row Data
  const handleUpdateAttribute = (id: string, field: "attribute_id" | "value", value: any) => {
    setAttributes(prev => prev.map(row => {
      if (row.id !== id) return row

      // If changing attribute selection, reset value
      if (field === "attribute_id") {
        return { ...row, attribute_id: value ? Number(value) : null, value: "" }
      }
      return { ...row, value }
    }))
  }

  // Remove Dynamic Attribute Row
  const handleRemoveAttribute = (id: string) => {
    setAttributes(prev => prev.filter(row => row.id !== id))
  }

  // Add Dynamic Variant Row
  const handleAddVariant = () => {
    setVariants(prev => [
      ...prev,
      { id: Math.random().toString(), variant_sku: "", variant_price: "", variant_stock: "" }
    ])
  }

  // Update Dynamic Variant Row Data
  const handleUpdateVariant = (id: string, field: keyof VariantRow, value: any) => {
    setVariants(prev => prev.map(row => {
      if (row.id !== id) return row
      return { ...row, [field]: value }
    }))
  }

  // Remove Dynamic Variant Row
  const handleRemoveVariant = (id: string) => {
    setVariants(prev => prev.filter(row => row.id !== id))
  }

  // Perform full cross-tab verification
  const validateFormIntegrity = (basicValues: ProductFormValues): boolean => {
    const errorsList: string[] = []

    // 1. Basic Fields validation (done by Zod mostly, but double checked here)
    if (basicValues.base_price < 0) {
      errorsList.push("Base price must be greater than or equal to 0.")
    }
    if (basicValues.stock_quantity < 0) {
      errorsList.push("Stock quantity must be greater than or equal to 0.")
    }

    // 2. Dynamic Attributes verification
    attributes.forEach((attr, idx) => {
      if (!attr.attribute_id) {
        errorsList.push(`Attributes Tab: Row ${idx + 1} has no attribute selected.`)
      } else if (!attr.value.trim()) {
        errorsList.push(`Attributes Tab: Row ${idx + 1} is missing a value.`)
      }
    })

    // 3. Dynamic Variants validation
    const variantSKUs = new Set<string>()
    variants.forEach((v, idx) => {
      const label = `Variants Tab: Row ${idx + 1}`

      if (!v.variant_sku.trim()) {
        errorsList.push(`${label} is missing its SKU.`)
      } else {
        const cleanSKU = v.variant_sku.trim().toLowerCase()
        // Check uniqueness within variants
        if (variantSKUs.has(cleanSKU)) {
          errorsList.push(`${label} has a duplicate SKU "${v.variant_sku}". SKUs must be unique.`)
        }
        variantSKUs.add(cleanSKU)

        // Check uniqueness against parent SKU
        if (productSKU && cleanSKU === productSKU.trim().toLowerCase()) {
          errorsList.push(`${label} SKU matches the parent product SKU. Variant SKUs must be distinct from the parent product SKU.`)
        }
      }

      const price = Number(v.variant_price)
      if (v.variant_price === "" || isNaN(price) || price < 0) {
        errorsList.push(`${label} price must be a valid number greater than or equal to 0.`)
      }

      const stock = Number(v.variant_stock)
      if (v.variant_stock === "" || isNaN(stock) || stock < 0 || !Number.isInteger(stock)) {
        errorsList.push(`${label} stock must be a valid integer greater than or equal to 0.`)
      }
    })

    setValidationErrors(errorsList)
    return errorsList.length === 0
  }

  // Handle full multi-table flat submission
  const handleSaveProduct = async (basicValues: ProductFormValues) => {
    // Run cross-tab validations
    const isValid = validateFormIntegrity(basicValues)
    if (!isValid) {
      toast({
        title: "Validation Error",
        description: "Please check your form inputs in all tabs.",
        variant: "destructive"
      })
      return
    }

    setSubmitting(true)

    try {
      // 1. Prepare images block (only image-type media go to product_images)
      const imagesPayload = uploadedMedia
        .filter(m => m.type === "image")
        .map((m, index) => ({
          image_url: m.url,
          is_primary: index === 0, // First image slot is primary
          sort_order: index
        }))

      // 2. Prepare attributes block
      const attributesPayload = attributes.map(row => {
        const definition = attributesList.find(a => a.id === row.attribute_id)
        const isNumberType = definition?.input_type === "number"

        return {
          attribute_id: row.attribute_id!,
          value_text: isNumberType ? undefined : row.value,
          value_number: isNumberType ? Number(row.value) : undefined
        }
      })

      // 3. Prepare variants block
      const variantsPayload = variants.map(row => ({
        variant_sku: row.variant_sku.trim(),
        variant_price: Number(row.variant_price),
        variant_stock: Number(row.variant_stock)
      }))

      // 4. Save to supabase with client rollback sequence
      const createdProduct = await ProductService.createProduct({
        ...basicValues,
        images: imagesPayload,
        attributes: attributesPayload,
        variants: variantsPayload
      })

      if (createdProduct) {
        toast({
          title: "Created Successfully",
          description: `Product "${createdProduct.name}" has been successfully added to catalog.`
        })
        setTimeout(() => {
          router.push(`/products/${createdProduct.slug}`)
        }, 1500)
      }
    } catch (err: any) {
      console.error(err)
      toast({
        title: "Database Insert Failure",
        description: err.message || "Failed to commit transaction in Supabase.",
        variant: "destructive"
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-10 px-4 md:px-10 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Navigation Banner */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight uppercase">Product Catalog Manager</h1>
            <p className="text-xs text-muted-foreground mt-1">Flat design, clean layout, absolute database transactional safety.</p>
          </div>
          <Button
            type="button"
            variant="outline"
            className="rounded-none border border-border h-9 text-xs uppercase shadow-none hover:bg-muted"
            onClick={() => router.push("/shop")}
          >
            <ArrowLeft className="h-3 w-3 mr-1.5" /> Back to Shop
          </Button>
        </div>

        {/* Global Validation Warning Box */}
        {validationErrors.length > 0 && (
          <div className="border border-destructive bg-destructive/5 p-4 rounded-none space-y-2">
            <div className="flex items-center gap-2 text-destructive font-bold text-sm uppercase">
              <AlertCircle className="h-4 w-4" /> Form Submission Blocked (Fix {validationErrors.length} issues)
            </div>
            <ul className="list-disc pl-5 text-xs text-destructive/90 space-y-1">
              {validationErrors.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Outer Tab Container - Flat styling, strictly border, no shadows */}
        <div className="border border-border bg-card rounded-none shadow-none">

          {/* Tab Selection Header - Clean flat blocks */}
          <div className="grid grid-cols-4 border-b border-border bg-muted/30">
            {[
              { id: "basic", label: "1. Basic Info", icon: Info },
              { id: "images", label: "2. Images", icon: ImageIcon },
              { id: "attributes", label: "3. Specs", icon: Settings },
              { id: "variants", label: "4. Variants", icon: Layers },
            ].map(tab => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex flex-col md:flex-row items-center justify-center gap-2 py-3 px-1 text-center md:text-left text-xs font-semibold border-r border-border last:border-r-0 transition-colors uppercase select-none rounded-none outline-none ${isActive ? 'bg-background text-primary border-b-2 border-b-primary' : 'text-muted-foreground hover:bg-muted/65 hover:text-foreground'}`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>

          {/* Tab Contents */}
          <div className="p-6">

            {/* ==================== TAB 1: BASIC INFO ==================== */}
            {activeTab === "basic" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold uppercase text-foreground mb-1">Basic Product Information</h3>
                  <p className="text-xs text-muted-foreground">General identity parameters and standard inventory price definitions.</p>
                </div>

                {/* Product Name & Slug */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-foreground/80 flex justify-between">
                      <span>Product Name *</span>
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. ErgoZenix Adjustable Desk"
                      className={`h-10 rounded-none border border-input bg-background/50 shadow-none focus-visible:ring-0 focus-visible:border-primary ${errors.name ? 'border-destructive' : ''}`}
                      {...register("name")}
                    />
                    {errors.name && (
                      <p className="text-[10px] text-destructive uppercase tracking-wide font-medium flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3" /> {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-foreground/80">Slug *</label>
                    <Input
                      type="text"
                      placeholder="auto-generated-slug"
                      className={`h-10 rounded-none border border-input bg-background/30 text-muted-foreground shadow-none focus-visible:ring-0 ${errors.slug ? 'border-destructive' : ''}`}
                      {...register("slug")}
                    />
                    {errors.slug && (
                      <p className="text-[10px] text-destructive uppercase tracking-wide font-medium flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3" /> {errors.slug.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* SKU & Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-foreground/80">SKU (Part Number)</label>
                    <Input
                      type="text"
                      placeholder="e.g. EZ-SD-205"
                      className="h-10 rounded-none border border-input bg-background/50 shadow-none focus-visible:ring-0 focus-visible:border-primary"
                      {...register("sku")}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-foreground/80">Catalog Status</label>
                    <select
                      className="w-full h-10 px-3 rounded-none border border-input bg-background/50 shadow-none text-xs font-semibold focus:outline-none focus:border-primary"
                      {...register("status")}
                    >
                      <option value="active">Active (Visible)</option>
                      <option value="inactive">Inactive (Hidden Draft)</option>
                    </select>
                  </div>
                </div>

                {/* Category & Brand */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-foreground/80">Brand Manufacturer</label>
                    {loadingOptions ? (
                      <div className="h-10 border border-border bg-muted/40 flex items-center justify-center text-xs text-muted-foreground rounded-none">
                        Loading brands...
                      </div>
                    ) : (
                      <select
                        className="w-full h-10 px-3 rounded-none border border-input bg-background/50 shadow-none text-xs font-semibold focus:outline-none focus:border-primary"
                        {...register("brand_id")}
                      >
                        <option value="">No Brand (Generic Product)</option>
                        {brands.map(b => (
                          <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                      </select>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-foreground/80">Catalog Category</label>
                    {loadingOptions ? (
                      <div className="h-10 border border-border bg-muted/40 flex items-center justify-center text-xs text-muted-foreground rounded-none">
                        Loading categories...
                      </div>
                    ) : (
                      <select
                        className="w-full h-10 px-3 rounded-none border border-input bg-background/50 shadow-none text-xs font-semibold focus:outline-none focus:border-primary"
                        {...register("category_id")}
                      >
                        <option value="">Uncategorized</option>
                        {categories.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>

                {/* Pricing & Stock */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-foreground/80">Base Price (NPR) *</label>
                    <Input
                      type="number"
                      placeholder="0"
                      className={`h-10 rounded-none border border-input bg-background/50 shadow-none focus-visible:ring-0 focus-visible:border-primary ${errors.base_price ? 'border-destructive' : ''}`}
                      {...register("base_price")}
                    />
                    {errors.base_price && (
                      <p className="text-[10px] text-destructive uppercase tracking-wide font-medium flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3" /> {errors.base_price.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-foreground/80">Sale Price (Optional)</label>
                    <Input
                      type="number"
                      placeholder="0"
                      className={`h-10 rounded-none border border-input bg-background/50 shadow-none focus-visible:ring-0 focus-visible:border-primary ${errors.sale_price ? 'border-destructive' : ''}`}
                      {...register("sale_price")}
                    />
                    {errors.sale_price && (
                      <p className="text-[10px] text-destructive uppercase tracking-wide font-medium flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3" /> {errors.sale_price.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-foreground/80">Stock Quantity</label>
                    <Input
                      type="number"
                      placeholder="0"
                      className={`h-10 rounded-none border border-input bg-background/50 shadow-none focus-visible:ring-0 focus-visible:border-primary ${errors.stock_quantity ? 'border-destructive' : ''}`}
                      {...register("stock_quantity")}
                    />
                    {errors.stock_quantity && (
                      <p className="text-[10px] text-destructive uppercase tracking-wide font-medium flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3" /> {errors.stock_quantity.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-foreground/80">Product Description</label>
                  <Textarea
                    placeholder="Provide detailed description regarding features and benefits..."
                    rows={5}
                    className="rounded-none border border-input bg-background/50 shadow-none focus-visible:ring-0 focus-visible:border-primary resize-y text-xs font-medium"
                    {...register("description")}
                  />
                </div>
              </div>
            )}

            {/* ==================== TAB 2: IMAGES & VIDEOS ==================== */}
            {activeTab === "images" && (
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-bold uppercase text-foreground mb-1">Product Gallery Media</h3>
                    <p className="text-xs text-muted-foreground">Upload images and short videos for the catalog. First image is auto-designated as primary. Drag thumbnails to reorder.</p>
                  </div>
                  <Button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-none border border-primary text-primary hover:bg-primary/5 bg-transparent h-9 px-4 text-xs font-bold uppercase shrink-0"
                  >
                    {uploading ? (
                      <Loader2 className="h-3 w-3 animate-spin mr-1.5" />
                    ) : (
                      <Upload className="h-3 w-3 mr-1.5" />
                    )}
                    Upload Media
                  </Button>
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    ref={fileInputRef}
                    onChange={handleMediaUpload}
                    className="hidden"
                  />
                </div>

                {/* Drag and Drop Container */}
                {uploadedMedia.length === 0 ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border border-dashed border-border/80 bg-background/25 py-12 px-6 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-muted/15"
                  >
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <span className="text-xs font-bold uppercase text-muted-foreground">Click to upload images or videos</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 border border-border bg-background/25">
                    {uploadedMedia.map((media, idx) => (
                      <div
                        key={idx}
                        draggable
                        onDragStart={(e) => handleDragStart(e, idx)}
                        onDragOver={(e) => handleDragOver(e, idx)}
                        onDragEnd={handleDragEnd}
                        className={`group relative aspect-square border bg-card select-none flex flex-col justify-between overflow-hidden cursor-move transition-transform ${draggedImageIdx === idx ? 'border-primary opacity-50 scale-95' : 'border-border hover:border-foreground/50'}`}
                      >
                        {/* Media Preview — image or video */}
                        {media.type === "video" ? (
                          <video
                            src={media.url}
                            controls
                            muted
                            playsInline
                            preload="metadata"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={media.url}
                            alt={`Upload Preview ${idx}`}
                            className="h-full w-full object-cover pointer-events-none"
                          />
                        )}

                        {/* Type Badge */}
                        {media.type === "video" && (
                          <div className="absolute top-2 left-2 px-1.5 py-0.5 text-[8px] font-extrabold uppercase bg-foreground text-background select-none pointer-events-none">
                            <span className="flex items-center gap-0.5"><Film className="h-2.5 w-2.5" /> Video</span>
                          </div>
                        )}

                        {/* Primary Badge — only for the first image-type item */}
                        {media.type === "image" && uploadedMedia.filter(m => m.type === "image").indexOf(media) === 0 && (
                          <div className="absolute top-2 left-2 px-1.5 py-0.5 text-[8px] font-extrabold uppercase bg-primary text-primary-foreground select-none pointer-events-none">
                            <span className="flex items-center gap-0.5"><Check className="h-2.5 w-2.5" /> Primary</span>
                          </div>
                        )}

                        {/* Flat Delete Button */}
                        <button
                          type="button"
                          onClick={() => handleRemoveMedia(idx)}
                          className="absolute top-2 right-2 h-6 w-6 bg-destructive text-destructive-foreground hover:bg-destructive flex items-center justify-center shadow-none rounded-none opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>

                        {/* Reordering manual controls */}
                        <div className="absolute bottom-0 left-0 right-0 bg-background/95 border-t border-border flex justify-between items-center px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => moveMedia(idx, "left")}
                            disabled={idx === 0}
                            className="text-[9px] font-bold uppercase tracking-wider hover:text-primary disabled:opacity-30 disabled:hover:text-foreground cursor-pointer flex items-center gap-0.5"
                          >
                            <ArrowLeft className="h-2.5 w-2.5" /> L
                          </button>
                          <span className="text-[9px] font-bold text-muted-foreground">Pos {idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => moveMedia(idx, "right")}
                            disabled={idx === uploadedMedia.length - 1}
                            className="text-[9px] font-bold uppercase tracking-wider hover:text-primary disabled:opacity-30 disabled:hover:text-foreground cursor-pointer flex items-center gap-0.5"
                          >
                            R <ArrowRight className="h-2.5 w-2.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ==================== TAB 3: ATTRIBUTES ==================== */}
            {activeTab === "attributes" && (
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-bold uppercase text-foreground mb-1">Product Specifications (Attributes)</h3>
                    <p className="text-xs text-muted-foreground">Attach dynamic custom attribute properties. Text / Numeric fields adjust dynamically.</p>
                  </div>
                  <Button
                    type="button"
                    onClick={handleAddAttribute}
                    className="rounded-none border border-primary text-primary hover:bg-primary/5 bg-transparent h-9 px-4 text-xs font-bold uppercase shrink-0"
                  >
                    <Plus className="h-3 w-3 mr-1.5" /> Add Row
                  </Button>
                </div>

                {attributes.length === 0 ? (
                  <div className="border border-border bg-background/25 py-8 text-center text-xs text-muted-foreground uppercase font-semibold">
                    No attributes selected yet. Click &quot;Add Row&quot; to configure.
                  </div>
                ) : (
                  <div className="border border-border overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-muted border-b border-border uppercase font-bold text-foreground">
                          <th className="p-3 w-1/3">Specification Field</th>
                          <th className="p-3 w-1/2">Value</th>
                          <th className="p-3 w-16 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attributes.map((row, idx) => {
                          const definition = attributesList.find(a => a.id === row.attribute_id)
                          const isNumberInput = definition?.input_type === "number"

                          return (
                            <tr key={row.id} className="border-b border-border last:border-b-0 hover:bg-muted/10">

                              {/* Attribute Dropdown Selection */}
                              <td className="p-2">
                                {loadingOptions ? (
                                  <div className="h-10 flex items-center px-3 border border-border bg-muted/20 text-muted-foreground font-semibold">
                                    Loading...
                                  </div>
                                ) : (
                                  <select
                                    value={row.attribute_id || ""}
                                    onChange={(e) => handleUpdateAttribute(row.id, "attribute_id", e.target.value)}
                                    className="w-full h-10 px-2 rounded-none border border-input bg-background/50 text-xs font-medium focus:outline-none focus:border-primary"
                                  >
                                    <option value="">Select Attribute...</option>
                                    {attributesList.map(a => (
                                      <option key={a.id} value={a.id}>{a.name} ({a.input_type})</option>
                                    ))}
                                  </select>
                                )}
                              </td>

                              {/* Attribute Value Input Field */}
                              <td className="p-2">
                                <Input
                                  type={isNumberInput ? "number" : "text"}
                                  placeholder={
                                    row.attribute_id
                                      ? `Enter ${definition?.name} value ${definition?.unit ? `(${definition.unit})` : ""}`
                                      : "Select attribute first..."
                                  }
                                  disabled={!row.attribute_id}
                                  value={row.value}
                                  onChange={(e) => handleUpdateAttribute(row.id, "value", e.target.value)}
                                  className="h-10 rounded-none border border-input bg-background/50 shadow-none focus-visible:ring-0 focus-visible:border-primary text-xs"
                                />
                              </td>

                              {/* Remove Button */}
                              <td className="p-2 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveAttribute(row.id)}
                                  className="h-9 w-9 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground flex items-center justify-center rounded-none transition-colors mx-auto"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ==================== TAB 4: VARIANTS ==================== */}
            {activeTab === "variants" && (
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-bold uppercase text-foreground mb-1">Product Variants Matrix</h3>
                    <p className="text-xs text-muted-foreground">Add SKU variants for this parent product. SKU must be completely unique.</p>
                  </div>
                  <Button
                    type="button"
                    onClick={handleAddVariant}
                    className="rounded-none border border-primary text-primary hover:bg-primary/5 bg-transparent h-9 px-4 text-xs font-bold uppercase shrink-0"
                  >
                    <Plus className="h-3 w-3 mr-1.5" /> Add Variant
                  </Button>
                </div>

                {variants.length === 0 ? (
                  <div className="border border-border bg-background/25 py-8 text-center text-xs text-muted-foreground uppercase font-semibold">
                    No variants mapped yet. Click &quot;Add Variant&quot; to configure.
                  </div>
                ) : (
                  <div className="border border-border overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-muted border-b border-border uppercase font-bold text-foreground">
                          <th className="p-3 w-2/5">Variant SKU *</th>
                          <th className="p-3 w-1/4">Price (NPR) *</th>
                          <th className="p-3 w-1/4">Stock *</th>
                          <th className="p-3 w-16 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {variants.map((row, idx) => (
                          <tr key={row.id} className="border-b border-border last:border-b-0 hover:bg-muted/10">

                            {/* Variant SKU */}
                            <td className="p-2">
                              <Input
                                type="text"
                                placeholder="e.g. EZ-SD-205-BLACK"
                                value={row.variant_sku}
                                onChange={(e) => handleUpdateVariant(row.id, "variant_sku", e.target.value)}
                                className="h-10 rounded-none border border-input bg-background/50 shadow-none focus-visible:ring-0 focus-visible:border-primary text-xs"
                              />
                            </td>

                            {/* Variant Price */}
                            <td className="p-2">
                              <Input
                                type="number"
                                placeholder="0"
                                value={row.variant_price}
                                onChange={(e) => handleUpdateVariant(row.id, "variant_price", e.target.value === "" ? "" : Number(e.target.value))}
                                className="h-10 rounded-none border border-input bg-background/50 shadow-none focus-visible:ring-0 focus-visible:border-primary text-xs"
                              />
                            </td>

                            {/* Variant Stock */}
                            <td className="p-2">
                              <Input
                                type="number"
                                placeholder="0"
                                value={row.variant_stock}
                                onChange={(e) => handleUpdateVariant(row.id, "variant_stock", e.target.value === "" ? "" : Number(e.target.value))}
                                className="h-10 rounded-none border border-input bg-background/50 shadow-none focus-visible:ring-0 focus-visible:border-primary text-xs"
                              />
                            </td>

                            {/* Remove Row */}
                            <td className="p-2 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveVariant(row.id)}
                                className="h-9 w-9 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground flex items-center justify-center rounded-none transition-colors mx-auto"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </td>

                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Form Actions Footer Bar */}
          <div className="border-t border-border p-6 flex justify-between bg-muted/15">
            {/* Step navigation fallbacks */}
            <div className="flex gap-2">
              {activeTab !== "basic" && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const seq: TabType[] = ["basic", "images", "attributes", "variants"]
                    const idx = seq.indexOf(activeTab)
                    setActiveTab(seq[idx - 1])
                  }}
                  className="rounded-none border border-border h-10 text-xs font-bold uppercase shadow-none"
                >
                  <ArrowLeft className="h-3 w-3 mr-1.5" /> Previous Tab
                </Button>
              )}

              {activeTab !== "variants" && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const seq: TabType[] = ["basic", "images", "attributes", "variants"]
                    const idx = seq.indexOf(activeTab)
                    setActiveTab(seq[idx + 1])
                  }}
                  className="rounded-none border border-border h-10 text-xs font-bold uppercase shadow-none"
                >
                  Next Tab <ArrowRight className="h-3 w-3 ml-1.5" />
                </Button>
              )}
            </div>

            {/* Main Action Submit Trigger */}
            <Button
              type="button"
              disabled={submitting || uploading}
              onClick={handleSubmit(handleSaveProduct)}
              className="rounded-none bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-8 text-xs font-bold uppercase shadow-none disabled:opacity-60 transition-colors active:scale-[0.98]"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" /> Saving Product...
                </>
              ) : (
                "Save & Upload Product"
              )}
            </Button>
          </div>

        </div>

      </div>
    </div>
  )
}
