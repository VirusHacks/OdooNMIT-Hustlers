"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Navigation } from "@/components/ui/navigation"
import { PageHeader } from "@/components/ui/page-header"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, ShoppingBag } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"

interface Order {
  id: string
  orderNumber: string
  status: string
  totalAmount: number
  shippingAddress: string
  createdAt: string
  seller: {
    id: string
    name: string
    location?: string
  }
  orderItems: {
    id: string
    quantity: number
    price: number
    listing: {
      id: string
      title: string
      images: string[]
    }
  }[]
}

export default function OrdersPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }
    fetchOrders()
  }, [user, router])

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders")
      if (response.ok) {
        const data = await response.json()
        // Map backend orders to expected frontend structure
        setOrders(
          data.orders.map((order: any) => ({
            ...order,
            orderNumber: order.order_number,
            status: order.status,
            totalAmount: order.total_amount,
            shippingAddress: order.shipping_address,
            createdAt: order.created_at,
            seller: order.users_orders_seller_idTousers || { id: "", name: "Unknown" },
            orderItems: (order.order_items || []).map((item: any) => ({
              ...item,
              price: item.price,
              quantity: item.quantity,
              listing: item.listings || { id: "", title: "Unknown", images: [] },
            })),
          }))
        )
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { label: "Pending", className: "bg-yellow-100 text-yellow-800" },
      CONFIRMED: { label: "Confirmed", className: "bg-blue-100 text-blue-800" },
      SHIPPED: { label: "Shipped", className: "bg-purple-100 text-purple-800" },
      DELIVERED: { label: "Delivered", className: "bg-green-100 text-green-800" },
      CANCELLED: { label: "Cancelled", className: "bg-red-100 text-red-800" },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING

    return <Badge className={config.className}>{config.label}</Badge>
  }

  if (!user) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader title="Order History" description="Track your purchases and view order details" />

        <div className="mt-8">
          {orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="luxury-card"
                >
                  {/* Order Header */}
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                    <div>
                      <h3 className="font-heading font-semibold text-lg text-foreground">Order #{order.orderNumber}</h3>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>Sold by {order.seller.name}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(order.status)}
                      <p className="font-heading font-bold text-xl text-primary mt-2">${order.totalAmount}</p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-4">
                    {order.orderItems.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4">
                        <div className="relative w-16 h-16 overflow-hidden rounded-lg bg-card">
                          <Image
                            src={item.listing.images[0] || "/placeholder.svg?height=64&width=64"}
                            alt={item.listing.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/products/${item.listing.id}`}
                            className="font-medium text-foreground hover:text-primary transition-colors line-clamp-2"
                          >
                            {item.listing.title}
                          </Link>
                          <p className="text-sm text-muted-foreground mt-1">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${(Number(item.price) * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Address */}
                  <div className="mt-6 pt-4 border-t border-border">
                    <h4 className="font-medium text-foreground mb-2">Shipping Address</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">{order.shippingAddress}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="font-heading font-semibold text-2xl text-foreground mb-2">No orders yet</h3>
              <p className="text-muted-foreground mb-6">Start shopping to see your order history here</p>
              <Button asChild className="luxury-button">
                <Link href="/browse">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Start Shopping
                </Link>
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
