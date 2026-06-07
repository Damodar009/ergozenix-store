"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ProductService } from "@/services/product-service"
import type { ProductCard } from "@/models/product"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Loader2, ArrowLeft, Check, AlertCircle, Sparkles } from "lucide-react"

export default function EditorsPickPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [products, setProducts] = useState<ProductCard[]>([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [saving, setSaving] = useState(false)

  // Form states
  const [selectedProductId, setSelectedProductId] = useState<string>("")
  const [customTitle, setCustomTitle] = useState("")
  const [badgeText, setBadgeText] = useState("EDITOR'S PICK")
  const [description1, setDescription1] = useState("")
  const [description2, setDescription2] = useState("")
  const [frameSpec, setFrameSpec] = useState("Forest Green Steel")
  const [surfaceSpec, setSurfaceSpec] = useState("Solid European Oak")
  const [warrantySpec, setWarrantySpec] = useState("10 Years")
  const [isActive, setIsActive] = useState(true)

  // Load existing products and active editor's pick
  useEffect(() => {
    async function loadData() {
      try {
        const [productsData, activePickData] = await Promise.all([
          ProductService.getProducts({ status: 'active' }),
          ProductService.getActiveEditorsPick()
        ])

        setProducts(productsData || [])

        if (activePickData && activePickData.editorsPick) {
          const ep = activePickData.editorsPick
          setSelectedProductId(ep.product_id.toString())
          setCustomTitle(ep.custom_title || "")
          setBadgeText(ep.badge_text || "EDITOR'S PICK")
          setDescription1(ep.description_1 || "")
          setDescription2(ep.description_2 || "")
          setFrameSpec(ep.frame_spec || "Forest Green Steel")
          setSurfaceSpec(ep.surface_spec || "Solid European Oak")
          setWarrantySpec(ep.warranty_spec || "10 Years")
          setIsActive(ep.is_active ?? true)
        }
      } catch (err) {
        console.error("Failed to load options or active editor's pick:", err)
        toast({
          title: "Database Error",
          description: "Could not retrieve options. Make sure the table exists.",
          variant: "destructive"
        })
      } finally {
        setLoadingProducts(false)
      }
    }
    loadData()
  }, [toast])

  // Fill in default placeholders when product selection changes
  const handleProductChange = (productId: string) => {
    setSelectedProductId(productId)
    const matchedProduct = products.find(p => p.id.toString() === productId)
    if (matchedProduct) {
      setCustomTitle(matchedProduct.name)
      // Attempt to split current product description if available
      const desc = matchedProduct.description || ""
      if (desc.includes(". ")) {
        const parts = desc.split(". ")
        setDescription1(parts[0] + ".")
        setDescription2(parts.slice(1).join(". "))
      } else {
        setDescription1(desc)
        setDescription2("")
      }
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProductId) {
      toast({
        title: "Validation Error",
        description: "Please select a product first.",
        variant: "destructive"
      })
      return
    }

    setSaving(true)

    try {
      await ProductService.saveEditorsPick({
        product_id: parseInt(selectedProductId),
        custom_title: customTitle || null,
        badge_text: badgeText || "EDITOR'S PICK",
        description_1: description1 || null,
        description_2: description2 || null,
        frame_spec: frameSpec || "Forest Green Steel",
        surface_spec: surfaceSpec || "Solid European Oak",
        warranty_spec: warrantySpec || "10 Years",
        is_active: isActive
      })

      toast({
        title: "Saved successfully",
        description: "The Editor's Pick has been updated in the database."
      })

      router.push("/")
    } catch (err: any) {
      console.error(err)
      toast({
        title: "Database Error",
        description: err.message || "Failed to save Editor's Pick to Supabase.",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-10 px-4 md:px-10 font-sans">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Navigation Banner */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight uppercase flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" /> Editor's Pick Manager
            </h1>
            <p className="text-xs text-muted-foreground mt-1">Configure and manage the featured spotlight item shown on the homepage.</p>
          </div>
          <Button
            type="button"
            variant="outline"
            className="rounded-none border border-border h-9 text-xs uppercase shadow-none hover:bg-muted"
            onClick={() => router.push("/")}
          >
            <ArrowLeft className="h-3 w-3 mr-1.5" /> Back to Home
          </Button>
        </div>

        {loadingProducts ? (
          <Card className="border-border rounded-none shadow-none">
            <CardContent className="p-12 flex flex-col items-center justify-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-xs uppercase font-bold text-muted-foreground tracking-wider">Loading product list...</p>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-border rounded-none shadow-none bg-card">
            <CardHeader className="border-b border-border bg-muted/10">
              <CardTitle className="text-sm font-bold uppercase">Configure Editor's Spotlight</CardTitle>
              <CardDescription className="text-xs">Link a catalog product and personalize the highlight contents.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSave} className="space-y-6">

                {/* Select Product */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-foreground/85">Select spotlight product *</label>
                  <select
                    className="w-full h-10 px-3 rounded-none border border-input bg-background/50 shadow-none text-xs font-semibold focus:outline-none focus:border-primary"
                    value={selectedProductId}
                    onChange={(e) => handleProductChange(e.target.value)}
                    required
                  >
                    <option value="">-- Choose a Product --</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name} (Rs {p.base_price})</option>
                    ))}
                  </select>
                </div>

                {selectedProductId && (
                  <div className="space-y-6 pt-4 border-t border-border">
                    {/* Custom Title & Badge */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-foreground/80">Custom spotlight title</label>
                        <Input
                          type="text"
                          placeholder="e.g. The Double Motor Adjustable Desk"
                          value={customTitle}
                          onChange={(e) => setCustomTitle(e.target.value)}
                          className="h-10 rounded-none border border-input bg-background/50 shadow-none focus-visible:ring-0 focus-visible:border-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-foreground/80">Badge text</label>
                        <Input
                          type="text"
                          placeholder="EDITOR'S PICK"
                          value={badgeText}
                          onChange={(e) => setBadgeText(e.target.value)}
                          className="h-10 rounded-none border border-input bg-background/50 shadow-none focus-visible:ring-0 focus-visible:border-primary"
                        />
                      </div>
                    </div>

                    {/* Descriptions */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-foreground/80">Description paragraph 1</label>
                        <Textarea
                          placeholder="First paragraph describing the build, top surface quality, or main selling points..."
                          value={description1}
                          onChange={(e) => setDescription1(e.target.value)}
                          rows={3}
                          className="rounded-none border border-input bg-background/50 shadow-none focus-visible:ring-0 focus-visible:border-primary resize-y text-xs font-medium"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-foreground/80">Description paragraph 2</label>
                        <Textarea
                          placeholder="Second paragraph describing the motor capability, noise level, or ergonomics..."
                          value={description2}
                          onChange={(e) => setDescription2(e.target.value)}
                          rows={3}
                          className="rounded-none border border-input bg-background/50 shadow-none focus-visible:ring-0 focus-visible:border-primary resize-y text-xs font-medium"
                        />
                      </div>
                    </div>

                    {/* Specifications */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-foreground/80">Frame spec</label>
                        <Input
                          type="text"
                          placeholder="e.g. Forest Green Steel"
                          value={frameSpec}
                          onChange={(e) => setFrameSpec(e.target.value)}
                          className="h-10 rounded-none border border-input bg-background/50 shadow-none focus-visible:ring-0 focus-visible:border-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-foreground/80">Surface spec</label>
                        <Input
                          type="text"
                          placeholder="e.g. Solid European Oak"
                          value={surfaceSpec}
                          onChange={(e) => setSurfaceSpec(e.target.value)}
                          className="h-10 rounded-none border border-input bg-background/50 shadow-none focus-visible:ring-0 focus-visible:border-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-foreground/80">Warranty spec</label>
                        <Input
                          type="text"
                          placeholder="e.g. 10 Years"
                          value={warrantySpec}
                          onChange={(e) => setWarrantySpec(e.target.value)}
                          className="h-10 rounded-none border border-input bg-background/50 shadow-none focus-visible:ring-0 focus-visible:border-primary"
                        />
                      </div>
                    </div>

                    {/* Is Active status */}
                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                        className="h-4 w-4 border-input accent-primary bg-background focus:ring-0"
                      />
                      <label htmlFor="isActive" className="text-xs font-bold uppercase text-foreground/85 cursor-pointer">
                        Set as active homepage spotlight item
                      </label>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4 flex justify-end">
                      <Button
                        type="submit"
                        disabled={saving}
                        className="rounded-none h-10 px-6 text-xs font-bold uppercase tracking-wider shadow-none"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="h-3 w-3 animate-spin mr-1.5" /> Saving spotlight...
                          </>
                        ) : (
                          <>
                            <Check className="h-3 w-3 mr-1.5" /> Save Spotlight Pick
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
