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

    const orders = await prisma.order.findMany({
      where: { buyer_id: user.id },
      include: {
        users_orders_seller_idTousers: {
          select: { id: true, name: true, location: true },
        },
        order_items: {
          include: {
            listings: {
              select: { id: true, title: true, images: true, price: true },
            },
          },
        },
      },
      orderBy: { created_at: "desc" },
    })

    return NextResponse.json({ orders })
  } catch (error) {
    console.error("Orders fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
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

    const { shippingAddress, paymentMethod, cartItemIds } = await request.json()

    if (!shippingAddress || !cartItemIds || cartItemIds.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get cart items
    const cartItems = await prisma.cartItem.findMany({
      where: {
        id: { in: cartItemIds },
        user_id: user.id,
      },
      include: {
        listings: {
          include: {
            users: true,
          },
        },
      },
    })

    if (cartItems.length === 0) {
      return NextResponse.json({ error: "No valid cart items found" }, { status: 400 })
    }

    // Group cart items by seller
    const itemsBySeller = cartItems.reduce(
      (acc, item) => {
        const sellerId = item.listings.seller_id
        if (!acc[sellerId]) {
          acc[sellerId] = []
        }
        acc[sellerId].push(item)
        return acc
      },
      {} as Record<string, typeof cartItems>,
    )

    const orders = []

    // Create separate orders for each seller
    for (const [sellerId, items] of Object.entries(itemsBySeller)) {
      const totalAmount = items.reduce((sum, item) => sum + Number(item.listings.price) * (item.quantity ?? 1), 0)
      const orderNumber = `ECO-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

      const order = await prisma.order.create({
        data: {
          order_number: orderNumber,
          seller_id: sellerId,
          buyer_id: user.id,
          total_amount: totalAmount,
          shipping_address: shippingAddress,
          payment_method: paymentMethod,
          status: "PENDING",
          order_items: {
            create: items.map((item) => ({
              listing_id: item.listing_id,
              quantity: item.quantity,
              price: item.listings.price,
            })),
          },
        },
        include: {
          users_orders_seller_idTousers: {
            select: { id: true, name: true, location: true },
          },
          order_items: {
            include: {
              listings: {
                select: { id: true, title: true, images: true, price: true },
              },
            },
          },
        },
      })

      orders.push(order)

      // Mark listings as sold
      await prisma.listing.updateMany({
        where: {
          id: { in: items.map((item) => item.listing_id) },
        },
        data: { is_sold: true },
      })
    }

    // Clear cart items
    await prisma.cartItem.deleteMany({
      where: {
        id: { in: cartItemIds },
      },
    })

    return NextResponse.json({ orders })
  } catch (error) {
    console.error("Order creation error:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
