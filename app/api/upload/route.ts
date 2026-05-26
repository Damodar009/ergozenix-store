import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      )
    }

    // Validate type
    const contentType = file.type
    const isImage = contentType.startsWith("image/")
    const isVideo = contentType.startsWith("video/")

    if (!isImage && !isVideo) {
      return NextResponse.json(
        { error: "Only image and video files are allowed" },
        { status: 400 }
      )
    }

    // Set limits (10MB for images, 50MB for videos)
    const limit = isImage ? 10 * 1024 * 1024 : 50 * 1024 * 1024
    if (file.size > limit) {
      return NextResponse.json(
        { error: `File size exceeds the limit of ${isImage ? "10MB" : "50MB"}` },
        { status: 400 }
      )
    }

    // Convert file to arrayBuffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Ensure the uploads directory exists
    const uploadDir = path.join(process.cwd(), "public", "uploads", "products")
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    // Generate a unique filename to prevent overwrites
    const ext = path.extname(file.name) || (isImage ? ".jpg" : ".mp4")
    const cleanName = path
      .basename(file.name, ext)
      .replace(/[^a-zA-Z0-9]/g, "-")
      .toLowerCase()
    const uniqueFilename = `${cleanName}-${Date.now()}${ext}`
    const filePath = path.join(uploadDir, uniqueFilename)

    // Write file to disk
    await fs.promises.writeFile(filePath, buffer)

    // Return the publicly accessible URL path
    const fileUrl = `/uploads/products/${uniqueFilename}`

    return NextResponse.json({
      success: true,
      url: fileUrl,
      name: file.name,
      size: file.size,
      type: file.type,
    })
  } catch (error: any) {
    console.error("Error in upload API:", error)
    return NextResponse.json(
      { error: "Internal server error occurred during upload" },
      { status: 500 }
    )
  }
}
