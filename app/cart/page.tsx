"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Navigation } from "@/components/ui/navigation"
import { PageHeader } from "@/components/ui/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
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
        // Map backend cartItems to expected frontend structure
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
          })
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
        // Recalculate total
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
        // Recalculate total
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
        <PageHeader
          title="Shopping Cart"
          description={`${cartItems.length} ${cartItems.length === 1 ? "item" : "items"} in your cart`}
        />

        <div className="mt-8">
          {cartItems.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="luxury-card"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="relative w-24 h-24 overflow-hidden rounded-lg bg-card">
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
                          className="font-heading font-semibold text-lg text-foreground hover:text-primary transition-colors line-clamp-2"
                        >
                          {item.listing.title}
                        </Link>
                        <p className="text-sm text-muted-foreground mt-1">
                          {item.listing.category.name} • {item.listing.condition.replace("_", " ")}
                        </p>
                        <p className="text-sm text-muted-foreground">Sold by {item.listing.seller.name}</p>
                        <p className="font-heading font-bold text-xl text-primary mt-2">${item.listing.price}</p>
                      </div>

                      <div className="flex flex-col items-end space-y-2">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 bg-transparent"
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
                            className="w-16 text-center"
                            disabled={updating === item.id}
                          />

                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 bg-transparent"
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
                          className="text-destructive hover:text-destructive"
                        >
                          {updating === item.id ? <LoadingSpinner size="sm" /> : <Trash2 className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="luxury-card sticky top-8">
                  <h2 className="font-heading font-semibold text-xl text-foreground mb-6">Order Summary</h2>

                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">${total}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-medium">Calculated at checkout</span>
                    </div>

                    <div className="border-t border-border pt-4">
                      <div className="flex justify-between">
                        <span className="font-heading font-semibold text-lg">Total</span>
                        <span className="font-heading font-bold text-xl text-primary">${total}</span>
                      </div>
                    </div>

                    <Button
                      onClick={handleCheckout}
                      className="w-full luxury-button mt-6"
                      disabled={cartItems.length === 0}
                    >
                      Proceed to Checkout
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🛒</div>
              <h3 className="font-heading font-semibold text-2xl text-foreground mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground mb-6">Discover unique items in our marketplace</p>
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
