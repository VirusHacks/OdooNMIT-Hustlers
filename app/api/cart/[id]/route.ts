import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

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

    const { quantity } = await request.json()

    if (quantity < 1) {
      return NextResponse.json({ error: "Quantity must be at least 1" }, { status: 400 })
    }


    const cartItem = await prisma.cartItem.update({
      where: {
        id: params.id,
        user_id: user.id, // Ensure user owns this cart item
      },
      data: { quantity },
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
  } catch (error) {
    console.error("Update cart item error:", error)
    return NextResponse.json({ error: "Failed to update cart item" }, { status: 500 })
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

    await prisma.cartItem.delete({
      where: {
        id: params.id,
        user_id: user.id, // Ensure user owns this cart item
      },
    })

    return NextResponse.json({ message: "Item removed from cart" })
  } catch (error) {
    console.error("Remove cart item error:", error)
    return NextResponse.json({ error: "Failed to remove cart item" }, { status: 500 })
  }
}
