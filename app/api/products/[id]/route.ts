import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = await prisma.listing.findUnique({
      where: { id: params.id },
      include: {
        users: {
          select: { id: true, name: true, location: true, avatar: true, bio: true },
        },
        categories: {
          select: { id: true, name: true, slug: true },
        },
      },
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Map to expected frontend structure
    const mappedProduct = {
      ...product,
      seller: product.users,
      category: product.categories,
      createdAt: product.created_at,
    }

    return NextResponse.json({ product: mappedProduct })
  } catch (error) {
    console.error("Product fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const user = await getCurrentUser(token)
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Check if user owns the product
    const existingProduct = await prisma.listing.findUnique({
      where: { id: params.id },
      select: { seller_id: true },
    })

    if (!existingProduct || existingProduct.seller_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const data = await request.json()
    const { title, description, price, condition, brand, size, color, images, categoryId, isActive } = data

    const product = await prisma.listing.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(price && { price: Number.parseFloat(price) }),
        ...(condition && { condition }),
        ...(brand !== undefined && { brand }),
        ...(size !== undefined && { size }),
        ...(color !== undefined && { color }),
        ...(images && { images }),
        ...(categoryId && { categoryId }),
        ...(isActive !== undefined && { isActive }),
      },
    })

    return NextResponse.json({ product })
  } catch (error) {
    console.error("Product update error:", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const user = await getCurrentUser(token)
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Check if user owns the product
    const existingProduct = await prisma.listing.findUnique({
      where: { id: params.id },
      select: { seller_id: true },
    })

    if (!existingProduct || existingProduct.seller_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    await prisma.listing.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("Product deletion error:", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
