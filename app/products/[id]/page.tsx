"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Navigation } from "@/components/ui/navigation"
import {
  Heart,
  ShoppingCart,
  Share2,
  MapPin,
  Calendar,
  Package,
  Shield,
  Star,
  ArrowLeft,
  Truck,
  RotateCcw,
  MessageCircle,
} from "lucide-react"
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
  created_at: string
  users: {
    id: string
    name: string
    location?: string
    avatar?: string
    bio?: string
  }
  categories: {
    id: string
    name: string
    slug: string
  }
  // Mapped fields for compatibility
  seller?: {
    id: string
    name: string
    location?: string
    avatar?: string
    bio?: string
    rating?: number
    totalSales?: number
  }
  category?: {
    id: string
    name: string
    slug: string
  }
  createdAt?: string
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/products/${params.id}`)
        
        if (response.ok) {
          const data = await response.json()
          // Map API response to frontend format
          const mappedProduct: Product = {
            ...data.product,
            seller: data.product.users,
            category: data.product.categories,
            createdAt: data.product.created_at,
          }
          setProduct(mappedProduct)
        } else if (response.status === 404) {
          setProduct(null) // Product not found
        } else {
          console.error('Failed to fetch product')
          toast({
            title: "Error",
            description: "Failed to load product details. Please try again.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error('Error fetching product:', error)
        toast({
          title: "Error",
          description: "Failed to load product details. Please check your connection.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchProduct()
    }
  }, [params.id, toast])

  const handleAddToCart = async () => {
    setIsAddingToCart(true)
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
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
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied!",
        description: "Product link has been copied to clipboard.",
      })
    }
  }

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited)
    toast({
      title: isFavorited ? "Removed from favorites" : "Added to favorites",
      description: isFavorited ? "Item removed from your favorites." : "Item added to your favorites.",
    })
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

  if (!loading && !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <Navigation />
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <div className="text-6xl mb-6">🔍</div>
            <h1 className="font-bold text-3xl text-slate-800 mb-4">Product Not Found</h1>
            <p className="text-slate-600 mb-8 max-w-md">
              The product you're looking for doesn't exist or may have been removed.
            </p>
            <Button
              onClick={() => router.push('/browse')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl"
            >
              Browse Products
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const conditionColors = {
    EXCELLENT: "bg-emerald-100 text-emerald-700 border-emerald-200",
    VERY_GOOD: "bg-blue-100 text-blue-700 border-blue-200",
    GOOD: "bg-amber-100 text-amber-700 border-amber-200",
    FAIR: "bg-orange-100 text-orange-700 border-orange-200",
    POOR: "bg-red-100 text-red-700 border-red-200",
  }

  if (!product) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button and Actions */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="text-slate-600 hover:text-slate-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFavorite}
              className={isFavorited ? "text-red-500" : "text-slate-600"}
            >
              <Heart className={`h-4 w-4 mr-2 ${isFavorited ? "fill-current" : ""}`} />
              {isFavorited ? "Favorited" : "Favorite"}
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="aspect-square overflow-hidden rounded-2xl bg-white shadow-xl border border-slate-200/50"
            >
              <Image
                src={product.images?.[selectedImageIndex] || "/placeholder.jpg"}
                alt={product.title}
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square overflow-hidden rounded-xl border-2 transition-all hover:scale-105 ${
                      selectedImageIndex === index
                        ? "border-blue-500 shadow-lg"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <Image
                      src={image || "/placeholder.jpg"}
                      alt={`${product.title} ${index + 1}`}
                      width={150}
                      height={150}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Trust Badges */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50">
              <h3 className="font-semibold text-slate-800 mb-4">Why shop with confidence</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800 text-sm">Buyer Protection</p>
                    <p className="text-xs text-slate-600">Full refund guarantee</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <Truck className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800 text-sm">Fast Shipping</p>
                    <p className="text-xs text-slate-600">2-3 business days</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <RotateCcw className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800 text-sm">Easy Returns</p>
                    <p className="text-xs text-slate-600">30-day return policy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Product Header */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50">
              <div className="flex items-start justify-between mb-4">
                <Badge
                  variant="secondary"
                  className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-blue-200"
                >
                  {product.category?.name || product.categories?.name}
                </Badge>
                <Badge className={`border ${conditionColors[product.condition as keyof typeof conditionColors]}`}>
                  {product.condition.replace("_", " ")}
                </Badge>
              </div>

              <h1 className="font-bold text-3xl text-slate-800 mb-4 leading-tight">{product.title}</h1>

              <div className="flex items-center space-x-4 mb-6">
                <span className="font-bold text-4xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ${product.price}
                </span>
                {product.brand && (
                  <div className="text-slate-600">
                    <span className="text-sm">by </span>
                    <span className="font-semibold">{product.brand}</span>
                  </div>
                )}
              </div>

              <p className="text-slate-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Product Specifications */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50">
              <h3 className="font-semibold text-slate-800 text-lg mb-4">Product Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {product.size && (
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-slate-100 to-slate-200 rounded-lg flex items-center justify-center">
                      <Package className="h-4 w-4 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Size</p>
                      <p className="font-medium text-slate-800">{product.size}</p>
                    </div>
                  </div>
                )}
                {product.color && (
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center">
                      <div
                        className="w-4 h-4 rounded-full border border-slate-300"
                        style={{ backgroundColor: product.color.toLowerCase() }}
                      />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Color</p>
                      <p className="font-medium text-slate-800">{product.color}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-slate-100 to-slate-200 rounded-lg flex items-center justify-center">
                    <Shield className="h-4 w-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Condition</p>
                    <p className="font-medium text-slate-800">{product.condition.replace("_", " ")}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-slate-100 to-slate-200 rounded-lg flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Listed</p>
                    <p className="font-medium text-slate-800">{new Date(product.createdAt || product.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Seller Info */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50">
              <h3 className="font-semibold text-slate-800 text-lg mb-4">Seller Information</h3>
              <div className="flex items-start space-x-4">
                <Avatar className="h-14 w-14 border-2 border-white shadow-lg">
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold">
                    {(product.seller?.name || product.users?.name || 'U')[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold text-slate-800">{product.seller?.name || product.users?.name || 'Unknown Seller'}</h4>
                    {(product.seller?.rating || 4.5) && (
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-slate-700">{product.seller?.rating || 4.5}</span>
                      </div>
                    )}
                  </div>
                  {(product.seller?.location || product.users?.location) && (
                    <div className="flex items-center space-x-1 text-sm text-slate-500 mb-2">
                      <MapPin className="h-3 w-3" />
                      <span>{product.seller?.location || product.users?.location}</span>
                    </div>
                  )}
                  {(product.seller?.totalSales || 0) > 0 && (
                    <p className="text-sm text-slate-600 mb-2">{product.seller?.totalSales || 0} successful sales</p>
                  )}
                  {(product.seller?.bio || product.users?.bio) && (
                    <p className="text-sm text-slate-600">{product.seller?.bio || product.users?.bio}</p>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200">
                <Button variant="outline" className="w-full bg-transparent">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact Seller
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isAddingToCart ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                ) : (
                  <ShoppingCart className="h-5 w-5 mr-2" />
                )}
                Add to Cart - ${product.price}
              </Button>

              <Button
                variant="outline"
                className="w-full h-12 border-2 border-slate-200 hover:border-slate-300 rounded-xl font-semibold bg-transparent"
              >
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
