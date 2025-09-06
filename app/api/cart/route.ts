import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const user = await getCurrentUser(token)
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { user_id: user.id },
      include: {
        listings: {
          include: {
            users: {
              select: { id: true, name: true, location: true },
            },
          },
        },
      },
    })

    const total = cartItems.reduce((sum, item) => sum + Number(item.listings.price) * (item.quantity ?? 1), 0)

    return NextResponse.json({
      cartItems,
      total: total.toFixed(2),
      count: cartItems.length,
    })
  } catch (error) {
    console.error("Cart fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const user = await getCurrentUser(token)
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { listingId, quantity = 1 } = await request.json()

    if (!listingId) {
      return NextResponse.json({ error: "Listing ID is required" }, { status: 400 })
    }

    // Check if listing exists and is available
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      select: { id: true, seller_id: true, is_active: true, is_sold: true },
    })

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 })
    }

    if (!listing.is_active || listing.is_sold) {
      return NextResponse.json({ error: "Listing is not available" }, { status: 400 })
    }

    if (listing.seller_id === user.id) {
      return NextResponse.json({ error: "Cannot add your own listing to cart" }, { status: 400 })
    }

    // Check if item already in cart
    const existingCartItem = await prisma.cartItem.findUnique({
      where: {
        user_id_listing_id: {
          user_id: user.id,
          listing_id: listingId,
        },
      },
    })

    if (existingCartItem) {
      // Update quantity
      const cartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: (existingCartItem.quantity ?? 1) + quantity },
        include: {
          listings: {
            include: {
              users: {
                select: { id: true, name: true, location: true },
              },
            },
          },
        },
      })
      return NextResponse.json({ cartItem })
    } else {
      // Create new cart item
      const cartItem = await prisma.cartItem.create({
        data: {
          user_id: user.id,
          listing_id: listingId,
          quantity: quantity,
        },
        include: {
          listings: {
            include: {
              users: {
                select: { id: true, name: true, location: true },
              },
            },
          },
        },
      })
      return NextResponse.json({ cartItem })
    }
  } catch (error) {
    console.error("Add to cart error:", error)
    return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 })
  }
}
