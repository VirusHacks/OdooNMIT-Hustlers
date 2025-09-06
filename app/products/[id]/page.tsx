"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Image from "next/image"
import { Navigation } from "@/components/ui/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Heart, ShoppingCart, Share2, MapPin, Calendar, Package, Shield } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"

interface Product {
  id: string
  title: string
  description: string
  price: number
  condition: string
  brand?: string
  size?: string
  color?: string
  images: string[]
  createdAt: string
  seller: {
    id: string
    name: string
    location?: string
    avatar?: string
    bio?: string
  }
  category: {
    id: string
    name: string
    slug: string
  }
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchProduct()
    }
  }, [params.id])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setProduct(data.product)
      } else {
        router.push("/browse")
      }
    } catch (error) {
      console.error("Failed to fetch product:", error)
      router.push("/browse")
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    if (!user) {
      router.push("/login")
      return
    }

    setIsAddingToCart(true)
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId: product?.id, quantity: 1 }),
      })
      if (!response.ok) {
        throw new Error("Failed to add to cart")
      }
      toast({
        title: "Added to cart!",
        description: "Item has been added to your cart.",
      })
    } catch (error) {
      toast({
        title: "Failed to add to cart",
        description: "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.title,
          text: product?.description,
          url: window.location.href,
        })
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied!",
        description: "Product link has been copied to clipboard.",
      })
    }
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

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="text-center py-20">
          <h1 className="font-heading font-bold text-2xl text-foreground">Product not found</h1>
        </div>
      </div>
    )
  }

  const conditionColors = {
    EXCELLENT: "bg-green-100 text-green-800",
    VERY_GOOD: "bg-blue-100 text-blue-800",
    GOOD: "bg-yellow-100 text-yellow-800",
    FAIR: "bg-orange-100 text-orange-800",
    POOR: "bg-red-100 text-red-800",
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="aspect-square overflow-hidden rounded-lg bg-card"
            >
              <Image
                src={product.images[selectedImageIndex] || "/placeholder.svg?height=600&width=600"}
                alt={product.title}
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                      selectedImageIndex === index ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.title} ${index + 1}`}
                      width={150}
                      height={150}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary" className="mb-2">
                  {product.category.name}
                </Badge>
                <Button variant="ghost" size="icon" onClick={handleShare} className="luxury-button">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>

              <h1 className="font-heading font-bold text-4xl text-foreground mb-4">{product.title}</h1>

              <div className="flex items-center space-x-4 mb-4">
                <span className="font-heading font-bold text-3xl text-primary">${product.price}</span>
                <Badge className={conditionColors[product.condition as keyof typeof conditionColors]}>
                  {product.condition.replace("_", " ")}
                </Badge>
              </div>

              {product.brand && (
                <p className="text-lg text-muted-foreground mb-4">
                  <strong>Brand:</strong> {product.brand}
                </p>
              )}
            </div>

            {/* Product Specifications */}
            <div className="luxury-card">
              <h3 className="font-heading font-semibold text-lg mb-4">Product Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {product.size && (
                  <div className="flex items-center space-x-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span>
                      <strong>Size:</strong> {product.size}
                    </span>
                  </div>
                )}
                {product.color && (
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-4 h-4 rounded-full border border-border"
                      style={{ backgroundColor: product.color.toLowerCase() }}
                    />
                    <span>
                      <strong>Color:</strong> {product.color}
                    </span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span>
                    <strong>Condition:</strong> {product.condition.replace("_", " ")}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    <strong>Listed:</strong> {new Date(product.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-heading font-semibold text-lg mb-3">Description</h3>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            {/* Seller Info */}
            <div className="luxury-card">
              <h3 className="font-heading font-semibold text-lg mb-4">Seller Information</h3>
              <div className="flex items-start space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-secondary text-secondary-foreground">
                    {product.seller.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{product.seller.name}</h4>
                  {product.seller.location && (
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground mt-1">
                      <MapPin className="h-3 w-3" />
                      <span>{product.seller.location}</span>
                    </div>
                  )}
                  {product.seller.bio && <p className="text-sm text-muted-foreground mt-2">{product.seller.bio}</p>}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <Button
                onClick={handleAddToCart}
                disabled={isAddingToCart || product.seller.id === user?.id}
                className="flex-1 luxury-button"
              >
                {isAddingToCart ? (
                  <LoadingSpinner size="sm" className="mr-2" />
                ) : (
                  <ShoppingCart className="h-4 w-4 mr-2" />
                )}
                {product.seller.id === user?.id ? "Your Listing" : "Add to Cart"}
              </Button>

              <Button variant="outline" size="icon" className="luxury-button bg-transparent">
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
