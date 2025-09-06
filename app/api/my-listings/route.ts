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

    const listings = await prisma.listing.findMany({
      where: { seller_id: user.id },
      
      orderBy: { created_at: "desc" },
    })

    return NextResponse.json({ listings })
  } catch (error) {
    console.error("My listings fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch listings" }, { status: 500 })
  }
}
