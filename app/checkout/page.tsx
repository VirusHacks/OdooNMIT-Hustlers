"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Navigation } from "@/components/ui/navigation"
import { PageHeader } from "@/components/ui/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { CreditCard, MapPin, Package } from "lucide-react"
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
    seller: {
      name: string
    }
  }
}

export default function CheckoutPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [total, setTotal] = useState("0.00")

  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.name || "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  })

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: user?.name || "",
  })

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
        if (data.cartItems.length === 0) {
          router.push("/cart")
          return
        }
        // Map backend cartItems to expected frontend structure
        setCartItems(
          data.cartItems.map((item: any) => {
            const seller = item.listings?.users || { name: "Unknown" }
            return {
              ...item,
              listing: {
                ...item.listings,
                seller,
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

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setShippingInfo((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentInfo((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    const requiredShippingFields = ["fullName", "address", "city", "state", "zipCode"]
    const requiredPaymentFields = ["cardNumber", "expiryDate", "cvv", "cardholderName"]

    for (const field of requiredShippingFields) {
      if (!shippingInfo[field as keyof typeof shippingInfo]) {
        toast({
          title: "Missing shipping information",
          description: "Please fill in all shipping fields.",
          variant: "destructive",
        })
        return
      }
    }

    for (const field of requiredPaymentFields) {
      if (!paymentInfo[field as keyof typeof paymentInfo]) {
        toast({
          title: "Missing payment information",
          description: "Please fill in all payment fields.",
          variant: "destructive",
        })
        return
      }
    }

    setProcessing(true)

    try {
      const shippingAddress = `${shippingInfo.fullName}\n${shippingInfo.address}\n${shippingInfo.city}, ${shippingInfo.state} ${shippingInfo.zipCode}\n${shippingInfo.country}`

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shippingAddress,
          paymentMethod: `**** **** **** ${paymentInfo.cardNumber.slice(-4)}`,
          cartItemIds: cartItems.map((item) => item.id),
        }),
      })

      if (response.ok) {
        const data = await response.json()
        toast({
          title: "Order placed successfully!",
          description: "You will receive a confirmation email shortly.",
        })
        router.push("/orders")
      } else {
        const error = await response.json()
        throw new Error(error.error || "Failed to place order")
      }
    } catch (error) {
      toast({
        title: "Failed to place order",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      })
    } finally {
      setProcessing(false)
    }
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

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader title="Checkout" description="Complete your purchase securely" />

        <form onSubmit={handleSubmit} className="mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Checkout Form */}
            <div className="space-y-8">
              {/* Shipping Information */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="luxury-card">
                <div className="flex items-center space-x-2 mb-6">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h2 className="font-heading font-semibold text-xl text-foreground">Shipping Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={shippingInfo.fullName}
                      onChange={handleShippingChange}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleShippingChange}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      name="city"
                      value={shippingInfo.city}
                      onChange={handleShippingChange}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      name="state"
                      value={shippingInfo.state}
                      onChange={handleShippingChange}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="zipCode">ZIP Code *</Label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      value={shippingInfo.zipCode}
                      onChange={handleShippingChange}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="country">Country *</Label>
                    <Input
                      id="country"
                      name="country"
                      value={shippingInfo.country}
                      onChange={handleShippingChange}
                      required
                      className="mt-1"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Payment Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="luxury-card"
              >
                <div className="flex items-center space-x-2 mb-6">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <h2 className="font-heading font-semibold text-xl text-foreground">Payment Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="cardholderName">Cardholder Name *</Label>
                    <Input
                      id="cardholderName"
                      name="cardholderName"
                      value={paymentInfo.cardholderName}
                      onChange={handlePaymentChange}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="cardNumber">Card Number *</Label>
                    <Input
                      id="cardNumber"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={paymentInfo.cardNumber}
                      onChange={handlePaymentChange}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="expiryDate">Expiry Date *</Label>
                    <Input
                      id="expiryDate"
                      name="expiryDate"
                      placeholder="MM/YY"
                      value={paymentInfo.expiryDate}
                      onChange={handlePaymentChange}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="cvv">CVV *</Label>
                    <Input
                      id="cvv"
                      name="cvv"
                      placeholder="123"
                      value={paymentInfo.cvv}
                      onChange={handlePaymentChange}
                      required
                      className="mt-1"
                    />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Order Summary */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="luxury-card sticky top-8"
              >
                <div className="flex items-center space-x-2 mb-6">
                  <Package className="h-5 w-5 text-primary" />
                  <h2 className="font-heading font-semibold text-xl text-foreground">Order Summary</h2>
                </div>

                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <div className="relative w-12 h-12 overflow-hidden rounded-lg bg-card">
                        <Image
                          src={item.listing.images[0] || "/placeholder.svg?height=48&width=48"}
                          alt={item.listing.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm line-clamp-2">{item.listing.title}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium">${(Number(item.listing.price) * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">${total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">Free</span>
                  </div>
                  <div className="flex justify-between font-heading font-bold text-lg pt-2 border-t border-border">
                    <span>Total</span>
                    <span className="text-primary">${total}</span>
                  </div>
                </div>

                <Button type="submit" disabled={processing} className="w-full luxury-button mt-6">
                  {processing ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Processing...
                    </>
                  ) : (
                    "Place Order"
                  )}
                </Button>
              </motion.div>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}
