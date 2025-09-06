"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, ShoppingBag, Package, Truck, CheckCircle, XCircle, Clock } from "lucide-react"
import { Navigation } from "@/components/ui/navigation"
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
    fetchOrders()
  }, [user, router])

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders")
      if (response.ok) {
        const data = await response.json()
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
          })),
        )
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusConfig = (status: string) => {
    const configs = {
      PENDING: {
        label: "Pending",
        className: "bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border-yellow-200",
        icon: Clock,
      },
      CONFIRMED: {
        label: "Confirmed",
        className: "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200",
        icon: CheckCircle,
      },
      SHIPPED: {
        label: "Shipped",
        className: "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border-purple-200",
        icon: Truck,
      },
      DELIVERED: {
        label: "Delivered",
        className: "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200",
        icon: Package,
      },
      CANCELLED: {
        label: "Cancelled",
        className: "bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-red-200",
        icon: XCircle,
      },
    }
    return configs[status as keyof typeof configs] || configs.PENDING
  }

  if (!user) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <Navigation />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center items-center py-20"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Navigation />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2"
          >
            Order History
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-600"
          >
            Track your purchases and view detailed order information
          </motion.p>
        </div>

        <div className="space-y-6">
          {orders.length > 0 ? (
            orders.map((order, index) => {
              const statusConfig = getStatusConfig(order.status)
              const StatusIcon = statusConfig.icon

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300 p-6"
                >
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200/50">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-800 mb-2">Order #{order.orderNumber}</h3>
                      <div className="flex items-center space-x-4 text-sm text-slate-600">
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
                      <div
                        className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium border ${statusConfig.className}`}
                      >
                        <StatusIcon className="h-4 w-4" />
                        <span>{statusConfig.label}</span>
                      </div>
                      <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mt-2">
                        ${order.totalAmount}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    {order.orderItems.map((item, itemIndex) => (
                      <motion.div
                        key={item.id}
                        className="flex items-center space-x-4 p-4 rounded-xl bg-gradient-to-r from-slate-50/50 to-blue-50/30 hover:from-slate-50/80 hover:to-blue-50/50 transition-all duration-200"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + itemIndex * 0.05 + 0.3 }}
                      >
                        <div className="relative w-16 h-16 overflow-hidden rounded-xl bg-white shadow-sm">
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
                            className="font-medium text-slate-800 hover:text-blue-600 transition-colors line-clamp-2 block"
                          >
                            {item.listing.title}
                          </Link>
                          <p className="text-sm text-slate-600 mt-1">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-slate-800">
                            ${(Number(item.price) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="bg-gradient-to-r from-slate-50/50 to-blue-50/30 rounded-xl p-4">
                    <h4 className="font-medium text-slate-800 mb-2 flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>Shipping Address</span>
                    </h4>
                    <p className="text-sm text-slate-600 whitespace-pre-line">{order.shippingAddress}</p>
                  </div>
                </motion.div>
              )
            })
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center py-16 bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                className="text-8xl mb-6 opacity-60"
              >
                📦
              </motion.div>
              <h3 className="text-2xl font-semibold text-slate-800 mb-3">No orders yet</h3>
              <p className="text-slate-600 mb-8 max-w-md mx-auto">
                Start shopping to see your order history here and track your purchases
              </p>
              <Button
                asChild
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Link href="/browse">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Start Shopping
                </Link>
              </Button>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  )
}
