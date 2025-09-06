"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Minus, Plus, Trash2, ShoppingBag, Shield, Truck, CreditCard } from "lucide-react"
import { Navigation } from "@/components/ui/navigation"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"

interface CartItem {
  id: string
  quantity: number
  listing: {
    id: string
    title: string
    price: number
    images: string[]
    condition: string
    seller: {
      id: string
      name: string
      location?: string
    }
    category: {
      name: string
    }
  }
}

export default function CartPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [total, setTotal] = useState("0.00")

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }
    fetchCart()
  }, [user, router])

  const fetchCart = async () => {
    try {
      const response = await fetch("/api/cart")
      if (response.ok) {
        const data = await response.json()
        setCartItems(
          data.cartItems.map((item: any) => {
            const category = item.listings?.categories || { name: "Unknown" }
            const seller = item.listings?.users || { id: "", name: "Unknown" }
            return {
              ...item,
              listing: {
                ...item.listings,
                seller,
                category,
              },
            }
          }),
        )
        setTotal(data.total)
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return

    setUpdating(itemId)
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity: newQuantity }),
      })

      if (response.ok) {
        setCartItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item)))
        const newTotal = cartItems.reduce((sum, item) => {
          const quantity = item.id === itemId ? newQuantity : item.quantity
          return sum + Number(item.listing.price) * quantity
        }, 0)
        setTotal(newTotal.toFixed(2))
      }
    } catch (error) {
      toast({
        title: "Failed to update quantity",
        description: "Please try again.",
        variant: "destructive",
      })
    } finally {
      setUpdating(null)
    }
  }

  const removeItem = async (itemId: string) => {
    setUpdating(itemId)
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setCartItems((prev) => prev.filter((item) => item.id !== itemId))
        const newTotal = cartItems
          .filter((item) => item.id !== itemId)
          .reduce((sum, item) => sum + Number(item.listing.price) * item.quantity, 0)
        setTotal(newTotal.toFixed(2))

        toast({
          title: "Item removed",
          description: "Item has been removed from your cart.",
        })
      }
    } catch (error) {
      toast({
        title: "Failed to remove item",
        description: "Please try again.",
        variant: "destructive",
      })
    } finally {
      setUpdating(null)
    }
  }

  const handleCheckout = () => {
    if (cartItems.length === 0) return
    router.push("/checkout")
  }

  if (!user) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <Navigation />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
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
            Shopping Cart
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-600"
          >
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in your cart
          </motion.p>
        </div>

        <div>
          {cartItems.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-lg p-6"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="relative w-24 h-24 overflow-hidden rounded-xl bg-white shadow-sm">
                        <Image
                          src={item.listing.images[0] || "/placeholder.svg?height=96&width=96"}
                          alt={item.listing.title}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/products/${item.listing.id}`}
                          className="font-semibold text-lg text-slate-800 hover:text-blue-600 transition-colors line-clamp-2 block mb-2"
                        >
                          {item.listing.title}
                        </Link>
                        <div className="flex items-center space-x-2 text-sm text-slate-600 mb-2">
                          <span className="px-2 py-1 rounded-full bg-gradient-to-r from-slate-100 to-blue-50 text-xs font-medium">
                            {item.listing.category.name}
                          </span>
                          <span>•</span>
                          <span>{item.listing.condition.replace("_", " ")}</span>
                        </div>
                        <p className="text-sm text-slate-600">Sold by {item.listing.seller.name}</p>
                        <p className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mt-2">
                          ${item.listing.price}
                        </p>
                      </div>

                      <div className="flex flex-col items-end space-y-3">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 bg-white hover:bg-slate-50 border-slate-200"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={updating === item.id || item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>

                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, Number.parseInt(e.target.value) || 1)}
                            className="w-16 text-center border-slate-200"
                            disabled={updating === item.id}
                          />

                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 bg-white hover:bg-slate-50 border-slate-200"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={updating === item.id}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          disabled={updating === item.id}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          {updating === item.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-lg p-6 sticky top-24"
                >
                  <h2 className="text-xl font-semibold text-slate-800 mb-6">Order Summary</h2>

                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Subtotal</span>
                      <span className="font-medium text-slate-800">${total}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-600">Shipping</span>
                      <span className="font-medium text-slate-800">Calculated at checkout</span>
                    </div>

                    <div className="border-t border-slate-200 pt-4">
                      <div className="flex justify-between">
                        <span className="text-lg font-semibold text-slate-800">Total</span>
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          ${total}
                        </span>
                      </div>
                    </div>

                    <Button
                      onClick={handleCheckout}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl mt-6"
                      disabled={cartItems.length === 0}
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Proceed to Checkout
                    </Button>

                    <div className="mt-6 pt-6 border-t border-slate-200">
                      <div className="space-y-3 text-sm text-slate-600">
                        <div className="flex items-center space-x-2">
                          <Shield className="h-4 w-4 text-green-600" />
                          <span>Secure checkout</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Truck className="h-4 w-4 text-blue-600" />
                          <span>Fast shipping</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16 bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50"
            >
              <div className="text-8xl mb-6 opacity-60">🛒</div>
              <h3 className="text-2xl font-semibold text-slate-800 mb-3">Your cart is empty</h3>
              <p className="text-slate-600 mb-8">Discover unique items in our marketplace</p>
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
