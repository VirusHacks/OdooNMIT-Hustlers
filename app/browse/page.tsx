"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Navigation } from "@/components/ui/navigation"
import { useToast } from "@/hooks/use-toast"
import {
  Search,
  Grid3X3,
  List,
  X,
  Filter,
  Heart,
  Star,
  ShoppingBag,
  ArrowLeft,
  Sparkles,
  TrendingUp,
  Clock,
  MapPin,
  Shield,
  Zap,
} from "lucide-react"

interface Product {
  id: string
  title: string
  price: number
  condition: string
  brand?: string
  images: string[]
  users: {
    id: string
    name: string
    location?: string
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
  }
  category?: {
    id: string
    name: string
    slug: string
  }
}

interface Category {
  id: string
  name: string
  slug: string
}

export default function BrowsePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedCondition, setSelectedCondition] = useState("")
  const [sortBy, setSortBy] = useState("created_at")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [addingToCart, setAddingToCart] = useState<string | null>(null)

  // Array of images from public folder
  const publicImages = [
    "/vintage-black-leather-jacket.jpg",
    "/iphone-13-pro-graphite.jpg",
    "/chanel-classic-flap-bag-black-quilted-leather.jpg",
    "/luxury-watch.jpg",
    "/macbook-pro-16-inch-space-gray-laptop.jpg",
    "/nike.jpg",
    "/premium-sneakers.png",
    "/wireless-headphones.png",
    "/luxury-handbag.png",
    "/eames-lounge-chair-walnut-black-leather.jpg",
    "/casual-winter-outfit.jpg",
    "/fashion-model-hoodie.jpg",
    "/green-jacket.jpg",
    "/outerwear.jpg",
    "/ryana.jpg",
    "/supper-skiny-jogger-brown.jpg",
    "/wmx-rubber-zebra-sandal.jpg",
    "/woman-orange-hoodie-smiling.jpg",
    "/winter-fashion-model.jpg",
    "/young-woman-latina-designer-smiling.jpg",
    "/professional-man-african-american-smiling.jpg",
    "/professional-woman-asian-smiling.jpg",
    "/luxury-hermes-birkin-bag-orange-leather.jpg",
    "/abstract-geometric-shapes.png",
    "/blue-shirt.png"
  ]

  // Function to get a random image from public images array
  const getRandomImage = (index: number) => {
    return publicImages[index % publicImages.length]
  }

  const brands = [
    { value: "gucci", label: "Gucci" },
    { value: "rolex", label: "Rolex" },
    { value: "nike", label: "Nike" },
    { value: "sony", label: "Sony" },
    { value: "apple", label: "Apple" },
    { value: "chanel", label: "Chanel" },
    { value: "louis-vuitton", label: "Louis Vuitton" },
    { value: "prada", label: "Prada" },
  ]

  const [selectedBrand, setSelectedBrand] = useState("")
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [showOnlyVerified, setShowOnlyVerified] = useState(false)
  const [showOnlyFreeShipping, setShowOnlyFreeShipping] = useState(false)

  const sizes = [
    { value: "xs", label: "XS" },
    { value: "s", label: "S" },
    { value: "m", label: "M" },
    { value: "l", label: "L" },
    { value: "xl", label: "XL" },
    { value: "xxl", label: "XXL" },
  ]

  const colors = [
    { value: "black", label: "Black", color: "#000000" },
    { value: "white", label: "White", color: "#FFFFFF" },
    { value: "red", label: "Red", color: "#EF4444" },
    { value: "blue", label: "Blue", color: "#3B82F6" },
    { value: "green", label: "Green", color: "#10B981" },
    { value: "brown", label: "Brown", color: "#A3A3A3" },
  ]

  const conditions = [
    { value: "EXCELLENT", label: "Excellent" },
    { value: "VERY_GOOD", label: "Very Good" },
    { value: "GOOD", label: "Good" },
    { value: "FAIR", label: "Fair" },
    { value: "POOR", label: "Poor" },
  ]

  const sortOptions = [
    { value: "created_at", label: "Newest First" },
    { value: "price", label: "Price: Low to High" },
    { value: "title", label: "Alphabetical" },
  ]

  // Fetch products and categories from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch products
        const productsResponse = await fetch('/api/products?limit=50')
        if (productsResponse.ok) {
          const productsData = await productsResponse.json()
          // Map API response to frontend format and assign images from public folder
          const mappedProducts = (productsData.products || []).map((product: any, index: number) => ({
            ...product,
            seller: product.users,
            category: product.categories,
            images: [getRandomImage(index)] // Cycle through public images
          }))
          setAllProducts(mappedProducts)
          setFilteredProducts(mappedProducts)
        } else {
          console.error('Failed to fetch products')
          // Add some sample products for demo purposes
          const sampleProducts = [
            {
              id: 'sample-1',
              title: 'Vintage Hermès Silk Scarf',
              price: 450,
              condition: 'EXCELLENT',
              brand: 'Hermès',
              images: [publicImages[0]],
              users: { id: '1', name: 'LuxuryCollector', location: 'Paris, France' },
              categories: { id: '1', name: 'Fashion', slug: 'fashion' },
              seller: { id: '1', name: 'LuxuryCollector', location: 'Paris, France' },
              category: { id: '1', name: 'Fashion', slug: 'fashion' }
            },
            {
              id: 'sample-2',
              title: 'iPhone 13 Pro Max 256GB',
              price: 899,
              condition: 'VERY_GOOD',
              brand: 'Apple',
              images: [publicImages[1]],
              users: { id: '2', name: 'TechSeller', location: 'San Francisco, CA' },
              categories: { id: '2', name: 'Electronics', slug: 'electronics' },
              seller: { id: '2', name: 'TechSeller', location: 'San Francisco, CA' },
              category: { id: '2', name: 'Electronics', slug: 'electronics' }
            },
            {
              id: 'sample-3',
              title: 'Designer Leather Handbag',
              price: 320,
              condition: 'GOOD',
              brand: 'Louis Vuitton',
              images: [publicImages[2]],
              users: { id: '3', name: 'FashionLover', location: 'New York, NY' },
              categories: { id: '1', name: 'Fashion', slug: 'fashion' },
              seller: { id: '3', name: 'FashionLover', location: 'New York, NY' },
              category: { id: '1', name: 'Fashion', slug: 'fashion' }
            },
            {
              id: 'sample-4',
              title: 'Vintage Rolex Watch',
              price: 2500,
              condition: 'EXCELLENT',
              brand: 'Rolex',
              images: [publicImages[3]],
              users: { id: '4', name: 'WatchCollector', location: 'London, UK' },
              categories: { id: '5', name: 'Jewelry & Watches', slug: 'jewelry-watches' },
              seller: { id: '4', name: 'WatchCollector', location: 'London, UK' },
              category: { id: '5', name: 'Jewelry & Watches', slug: 'jewelry-watches' }
            },
            {
              id: 'sample-5',
              title: 'Sony WH-1000XM4 Headphones',
              price: 180,
              condition: 'VERY_GOOD',
              brand: 'Sony',
              images: [publicImages[7]],
              users: { id: '5', name: 'AudioEnthusiast', location: 'Tokyo, Japan' },
              categories: { id: '2', name: 'Electronics', slug: 'electronics' },
              seller: { id: '5', name: 'AudioEnthusiast', location: 'Tokyo, Japan' },
              category: { id: '2', name: 'Electronics', slug: 'electronics' }
            },
            {
              id: 'sample-6',
              title: 'Nike Air Jordan 1 Retro',
              price: 150,
              condition: 'GOOD',
              brand: 'Nike',
              images: [publicImages[5]],
              users: { id: '6', name: 'SneakerHead', location: 'Los Angeles, CA' },
              categories: { id: '4', name: 'Sports', slug: 'sports' },
              seller: { id: '6', name: 'SneakerHead', location: 'Los Angeles, CA' },
              category: { id: '4', name: 'Sports', slug: 'sports' }
            },
            {
              id: 'sample-7',
              title: 'MacBook Pro 16-inch',
              price: 2200,
              condition: 'EXCELLENT',
              brand: 'Apple',
              images: [publicImages[4]],
              users: { id: '7', name: 'TechGuru', location: 'Seattle, WA' },
              categories: { id: '2', name: 'Electronics', slug: 'electronics' },
              seller: { id: '7', name: 'TechGuru', location: 'Seattle, WA' },
              category: { id: '2', name: 'Electronics', slug: 'electronics' }
            },
            {
              id: 'sample-8',
              title: 'Eames Lounge Chair',
              price: 1200,
              condition: 'VERY_GOOD',
              brand: 'Herman Miller',
              images: [publicImages[9]],
              users: { id: '8', name: 'FurnitureExpert', location: 'Chicago, IL' },
              categories: { id: '3', name: 'Home & Living', slug: 'home-living' },
              seller: { id: '8', name: 'FurnitureExpert', location: 'Chicago, IL' },
              category: { id: '3', name: 'Home & Living', slug: 'home-living' }
            }
          ]
          setAllProducts(sampleProducts)
          setFilteredProducts(sampleProducts)
        }

        // Fetch categories
        const categoriesResponse = await fetch('/api/categories')
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json()
          setCategories(categoriesData.categories || [])
        } else {
          console.error('Failed to fetch categories')
          // Fallback categories
          setCategories([
            { id: "1", name: "Fashion", slug: "fashion" },
            { id: "2", name: "Electronics", slug: "electronics" },
            { id: "3", name: "Home & Living", slug: "home-living" },
            { id: "4", name: "Sports", slug: "sports" },
            { id: "5", name: "Jewelry & Watches", slug: "jewelry-watches" },
            { id: "6", name: "Art & Collectibles", slug: "art-collectibles" },
          ])
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        // Add sample products even on error for demo purposes
        const sampleProducts = [
          {
            id: 'sample-1',
            title: 'Vintage Hermès Silk Scarf',
            price: 450,
            condition: 'EXCELLENT',
            brand: 'Hermès',
            images: [publicImages[0]],
            users: { id: '1', name: 'LuxuryCollector', location: 'Paris, France' },
            categories: { id: '1', name: 'Fashion', slug: 'fashion' },
            seller: { id: '1', name: 'LuxuryCollector', location: 'Paris, France' },
            category: { id: '1', name: 'Fashion', slug: 'fashion' }
          },
          {
            id: 'sample-2',
            title: 'iPhone 13 Pro Max 256GB',
            price: 899,
            condition: 'VERY_GOOD',
            brand: 'Apple',
            images: [publicImages[1]],
            users: { id: '2', name: 'TechSeller', location: 'San Francisco, CA' },
            categories: { id: '2', name: 'Electronics', slug: 'electronics' },
            seller: { id: '2', name: 'TechSeller', location: 'San Francisco, CA' },
            category: { id: '2', name: 'Electronics', slug: 'electronics' }
          }
        ]
        setAllProducts(sampleProducts)
        setFilteredProducts(sampleProducts)
        setCategories([
          { id: "1", name: "Fashion", slug: "fashion" },
          { id: "2", name: "Electronics", slug: "electronics" },
          { id: "3", name: "Home & Living", slug: "home-living" },
          { id: "4", name: "Sports", slug: "sports" },
          { id: "5", name: "Jewelry & Watches", slug: "jewelry-watches" },
          { id: "6", name: "Art & Collectibles", slug: "art-collectibles" },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Filter products based on search criteria
  useEffect(() => {
    let filtered = [...allProducts]

    // Search term filter
    if (debouncedSearchTerm.trim()) {
      const searchLower = debouncedSearchTerm.toLowerCase()
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchLower) ||
        product.brand?.toLowerCase().includes(searchLower) ||
        product.category?.name.toLowerCase().includes(searchLower) ||
        product.seller?.name.toLowerCase().includes(searchLower)
      )
    }

    // Category filter
    if (selectedCategory && selectedCategory !== "all") {
      filtered = filtered.filter(product => product.category?.slug === selectedCategory)
    }

    // Condition filter
    if (selectedCondition && selectedCondition !== "all") {
      filtered = filtered.filter(product => product.condition === selectedCondition)
    }

    // Brand filter
    if (selectedBrand && selectedBrand !== "all") {
      filtered = filtered.filter(product => product.brand?.toLowerCase() === selectedBrand.toLowerCase())
    }

    // Price range filter
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    )

    // Size filter (if applicable - for now we'll skip as we don't have size data)
    // Color filter (if applicable - for now we'll skip as we don't have color data)

    // Verified sellers filter
    if (showOnlyVerified) {
      // For demo purposes, we'll consider some products as verified
      filtered = filtered.filter((_, index) => index % 3 === 0)
    }

    // Free shipping filter (if applicable - for now we'll skip as we don't have shipping data)

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price":
          return a.price - b.price
        case "title":
          return a.title.localeCompare(b.title)
        case "created_at":
        default:
          return 0 // Keep original order for demo
      }
    })

    setFilteredProducts(filtered)
    setTotalPages(Math.ceil(filtered.length / 12)) // 12 products per page
  }, [allProducts, debouncedSearchTerm, selectedCategory, selectedCondition, selectedBrand, priceRange, showOnlyVerified, sortBy])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
  }

  const handleProductClick = (productId: string) => {
    router.push(`/products/${productId}`)
  }

  const handleAddToCart = async (productId: string) => {
    try {
      setAddingToCart(productId)
      
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listingId: productId,
          quantity: 1
        })
      })

      if (response.ok) {
        const product = allProducts.find(p => p.id === productId)
        toast({
          title: "Added to cart!",
          description: `${product?.title || 'Product'} has been added to your cart.`,
        })
      } else {
        const errorData = await response.json()
        toast({
          title: "Failed to add to cart",
          description: errorData.error || "Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error adding product to cart:', error)
      toast({
        title: "Error",
        description: "Failed to add product to cart. Please try again.",
        variant: "destructive",
      })
    } finally {
      setAddingToCart(null)
    }
  }

  const clearFilters = () => {
    setSearchTerm("")
    setDebouncedSearchTerm("")
    setSelectedCategory("")
    setSelectedCondition("")
    setSelectedBrand("")
    setSelectedSize("")
    setSelectedColor("")
    setSortBy("created_at")
    setPriceRange([0, 10000])
    setShowOnlyVerified(false)
    setShowOnlyFreeShipping(false)
    setCurrentPage(1)
  }

  const activeFiltersCount =
    [searchTerm, selectedCategory, selectedCondition, selectedBrand, selectedSize, selectedColor].filter(Boolean)
      .length +
    (priceRange[0] > 0 || priceRange[1] < 10000 ? 1 : 0) +
    (showOnlyVerified ? 1 : 0) +
    (showOnlyFreeShipping ? 1 : 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <Navigation />
      
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex gap-6">
        {/* Sidebar */}
        <motion.aside
          className="hidden lg:block w-80 bg-white/70 backdrop-blur-xl border-r border-slate-200/60 sticky top-[73px] self-start"
          initial={{ x: -320, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="p-6 space-y-6">
            <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-6 border border-blue-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Smart Filters</h2>
                  <p className="text-xs text-slate-600">Find exactly what you need</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-white/80 rounded-xl p-3 text-center">
                  <div className="text-lg font-bold text-blue-600">2.4K</div>
                  <div className="text-xs text-slate-600">Items</div>
                </div>
                <div className="bg-white/80 rounded-xl p-3 text-center">
                  <div className="text-lg font-bold text-green-600">98%</div>
                  <div className="text-xs text-slate-600">Verified</div>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-4 border border-orange-100"
            >
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-semibold text-slate-700">Trending Now</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Vintage Watches</span>
                  <Badge variant="secondary" className="bg-orange-100 text-orange-700 text-xs">
                    +24%
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Designer Bags</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                    +18%
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Sneakers</span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                    +12%
                  </Badge>
                </div>
              </div>
            </motion.div>

            {/* Category Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-3"
            >
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                Category
              </label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="h-12 border-slate-200 bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 rounded-xl shadow-sm">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200">
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.slug}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="space-y-3"
            >
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                Brand
              </label>
              <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                <SelectTrigger className="h-12 border-slate-200 bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-200 focus:ring-2 focus:ring-purple-500/20 rounded-xl shadow-sm">
                  <SelectValue placeholder="All Brands" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200">
                  <SelectItem value="all">All Brands</SelectItem>
                  {brands.map((brand) => (
                    <SelectItem key={brand.value} value={brand.value}>
                      {brand.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>

            {/* Price Range Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                Price Range
              </label>
              <div className="bg-white/90 rounded-xl p-4 border border-slate-200 shadow-sm">
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={10000}
                  min={0}
                  step={50}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-slate-600 mt-3">
                  <span className="bg-slate-100 px-3 py-1 rounded-lg font-medium">(₹){priceRange[0]}</span>
                  <span className="bg-slate-100 px-3 py-1 rounded-lg font-medium">(₹){priceRange[1]}</span>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="space-y-3"
              >
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                  Size
                </label>
                <Select value={selectedSize} onValueChange={setSelectedSize}>
                  <SelectTrigger className="h-12 border-slate-200 bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-200 focus:ring-2 focus:ring-yellow-500/20 rounded-xl shadow-sm">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-200">
                    <SelectItem value="all">Any Size</SelectItem>
                    {sizes.map((size) => (
                      <SelectItem key={size.value} value={size.value}>
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-3"
              >
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-pink-500"></div>
                  Color
                </label>
                <Select value={selectedColor} onValueChange={setSelectedColor}>
                  <SelectTrigger className="h-12 border-slate-200 bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-200 focus:ring-2 focus:ring-pink-500/20 rounded-xl shadow-sm">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-200">
                    <SelectItem value="all">Any Color</SelectItem>
                    {colors.map((color) => (
                      <SelectItem key={color.value} value={color.value}>
                        <div className="flex items-center gap-2">
                          <div
                            className="h-3 w-3 rounded-full border border-slate-300"
                            style={{ backgroundColor: color.color }}
                          ></div>
                          {color.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </motion.div>
            </div>

            {/* Condition Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="space-y-3"
            >
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
                Condition
              </label>
              <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                <SelectTrigger className="h-12 border-slate-200 bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-200 focus:ring-2 focus:ring-indigo-500/20 rounded-xl shadow-sm">
                  <SelectValue placeholder="All Conditions" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200">
                  <SelectItem value="all">All Conditions</SelectItem>
                  {conditions.map((condition) => (
                    <SelectItem key={condition.value} value={condition.value}>
                      {condition.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-4"
            >
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                Special Filters
              </label>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={showOnlyVerified}
                    onChange={(e) => setShowOnlyVerified(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-slate-700 group-hover:text-slate-900">Verified Sellers Only</span>
                  </div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={showOnlyFreeShipping}
                    onChange={(e) => setShowOnlyFreeShipping(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-green-600 focus:ring-green-500"
                  />
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-slate-700 group-hover:text-slate-900">Free Shipping</span>
                  </div>
                </label>
              </div>
            </motion.div>

            {/* Sort Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="space-y-3"
            >
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-red-500"></div>
                Sort By
              </label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-12 border-slate-200 bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-200 focus:ring-2 focus:ring-red-500/20 rounded-xl shadow-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200">
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>

            {/* Clear Filters */}
            {activeFiltersCount > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="w-full h-12 border-slate-200 hover:bg-slate-50 transition-all duration-200 bg-white/90 rounded-xl shadow-sm"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear All Filters ({activeFiltersCount})
                </Button>
              </motion.div>
            )}
          </div>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="py-8">
            {/* Header */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
                  Explore Premium Collection
                </h1>
                <Badge className="bg-blue-600 text-white border-0 px-3 py-1">New</Badge>
              </div>
              <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
                Discover luxury, pre-loved items from trusted sellers worldwide. Every item is authenticated and
                verified for quality.
              </p>
            </motion.div>

            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <form onSubmit={handleSearch} className="relative max-w-3xl">
                <div className="flex gap-4">
                  <motion.div
                    className="flex-1 relative group"
                    whileFocus={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative">
                      <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors duration-200" />
                      <Input
                        type="text"
                        placeholder="Search for luxury items, brands, or collections..."
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value)
                          setCurrentPage(1) // Reset to first page when searching
                        }}
                        className="pl-14 pr-12 h-16 text-lg bg-white/90 backdrop-blur-sm border-slate-200 rounded-2xl focus:bg-white focus:shadow-2xl focus:shadow-blue-500/10 focus:border-blue-300 transition-all duration-300 shadow-sm"
                      />
                      {searchTerm && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setSearchTerm("")}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-slate-100 rounded-full"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      type="submit"
                      size="lg"
                      className="h-16 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 border-0"
                    >
                      <Search className="h-5 w-5 mr-2" />
                      Search
                    </Button>
                  </motion.div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="text-sm text-slate-500">Popular searches:</span>
                  {["Vintage Watches", "Designer Bags", "Sneakers", "Electronics"].map((suggestion) => (
                    <Button
                      key={suggestion}
                      variant="ghost"
                      size="sm"
                      onClick={() => setSearchTerm(suggestion)}
                      className="text-sm text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg px-3 py-1 h-auto"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </form>
            </motion.div>

            {/* Mobile Filters Button */}
            <div className="lg:hidden mb-8">
              <Button
                variant="outline"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="h-12 px-6 border-slate-200 bg-white/80 backdrop-blur-sm relative rounded-xl"
              >
                <Filter className="h-5 w-5 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-blue-600">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </div>

            {/* Mobile Filters Panel */}
            <AnimatePresence>
              {showMobileFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="lg:hidden mb-8 bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200 p-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-slate-700">Category</label>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="h-12 border-slate-200 rounded-xl">
                          <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.slug}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-slate-700">Condition</label>
                      <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                        <SelectTrigger className="h-12 border-slate-200 rounded-xl">
                          <SelectValue placeholder="All Conditions" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Conditions</SelectItem>
                          {conditions.map((condition) => (
                            <SelectItem key={condition.value} value={condition.value}>
                              {condition.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Results Header */}
            <motion.div
              className="flex items-center justify-between mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-4">
                <span className="text-slate-600 font-medium">
                  {loading ? "Loading..." : `${filteredProducts.length} products found`}
                </span>
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                    {activeFiltersCount} filter{activeFiltersCount > 1 ? "s" : ""} applied
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-10 w-10 p-0 rounded-xl"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="h-10 w-10 p-0 rounded-xl"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>

            {/* Products Grid */}
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <motion.div
                className="text-center py-20"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-red-200 p-12 max-w-md mx-auto">
                  <div className="text-6xl mb-6">⚠️</div>
                  <h3 className="font-semibold text-2xl text-slate-900 mb-3">Error Loading Products</h3>
                  <p className="text-slate-600 mb-8 leading-relaxed">
                    {error}
                  </p>
                  <Button
                    onClick={() => window.location.reload()}
                    className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-8 rounded-xl"
                  >
                    Try Again
                  </Button>
                </div>
              </motion.div>
            ) : filteredProducts.length > 0 ? (
              <>
                <div
                  className={`grid gap-6 ${
                    viewMode === "grid"
                      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                      : "grid-cols-1 max-w-4xl"
                  }`}
                >
                  {filteredProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      className="group bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200 overflow-hidden hover:shadow-2xl hover:shadow-slate-900/10 transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => handleProductClick(product.id)}
                    >
                      <div className="relative aspect-square overflow-hidden">
                        <img
                          src={product.images?.[0] || "/placeholder.jpg"}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            // Fallback to placeholder if image fails to load
                            e.currentTarget.src = "/placeholder.jpg"
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute top-3 right-3 flex flex-col gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full shadow-sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              // Add to wishlist functionality can be implemented here
                              console.log('Add to wishlist:', product.id)
                            }}
                          >
                            <Heart className="h-4 w-4" />
                          </Button>
                          <Badge className="bg-white/90 text-slate-700 border-0 text-xs px-2 py-1">
                            <Clock className="h-3 w-3 mr-1" />
                            2h ago
                          </Badge>
                        </div>
                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                          <Badge
                            className={`${
                              product.condition === "EXCELLENT"
                                ? "bg-green-100 text-green-700 border-green-200"
                                : product.condition === "VERY_GOOD"
                                  ? "bg-blue-100 text-blue-700 border-blue-200"
                                  : product.condition === "GOOD"
                                    ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                                    : "bg-orange-100 text-orange-700 border-orange-200"
                            }`}
                          >
                            {product.condition.replace("_", " ")}
                          </Badge>
                          {index % 3 === 0 && (
                            <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs">
                              <Shield className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Button
                            size="sm"
                            className="w-full bg-white/90 text-slate-900 hover:bg-white rounded-xl backdrop-blur-sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleProductClick(product.id)
                            }}
                          >
                            Quick View
                          </Button>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {product.title}
                          </h3>
                          <div className="flex items-center gap-1 ml-2">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm text-slate-600 font-medium">4.8</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          {product.brand && (
                          <Badge variant="secondary" className="bg-slate-100 text-slate-700 text-xs">
                            {product.brand}
                          </Badge>
                          )}
                          {product.category && (
                          <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs">
                            {product.category.name}
                          </Badge>
                          )}
                        </div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex flex-col">
                            <span className="text-2xl font-bold text-slate-900">₹{product.price}</span>
                            <span className="text-sm text-slate-500 line-through">
                            ₹{Math.round(product.price * 1.3)}
                            </span>
                          </div>
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm border-0"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleAddToCart(product.id)
                            }}
                            disabled={addingToCart === product.id}
                          >
                            {addingToCart === product.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
                            ) : (
                            <ShoppingBag className="h-4 w-4 mr-1" />
                            )}
                            {addingToCart === product.id ? 'Adding...' : 'Add to Cart'}
                          </Button>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center">
                              <span className="text-white text-xs font-bold">{product.seller?.name?.[0] || 'U'}</span>
                            </div>
                            <span className="text-sm text-slate-600 font-medium">{product.seller?.name || 'Unknown'}</span>
                          </div>
                          {product.seller?.location && (
                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            <MapPin className="h-3 w-3" />
                            {product.seller.location}
                          </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <motion.div
                    className="flex justify-center mt-16 space-x-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="h-12 px-6 border-slate-200 hover:bg-slate-50 rounded-xl"
                    >
                      Previous
                    </Button>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          onClick={() => setCurrentPage(page)}
                          className="h-12 w-12 border-slate-200 hover:bg-slate-50 rounded-xl"
                        >
                          {page}
                        </Button>
                      )
                    })}

                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="h-12 px-6 border-slate-200 hover:bg-slate-50 rounded-xl"
                    >
                      Next
                    </Button>
                  </motion.div>
                )}
              </>
            ) : (
              <motion.div
                className="text-center py-20"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200 p-12 max-w-md mx-auto">
                  <div className="text-6xl mb-6">🔍</div>
                  <h3 className="font-semibold text-2xl text-slate-900 mb-3">No products found</h3>
                  <p className="text-slate-600 mb-8 leading-relaxed">
                    We couldn't find any products matching your criteria. Try adjusting your filters or explore our
                    featured collections.
                  </p>
                  <Button
                    onClick={clearFilters}
                    className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-8 rounded-xl"
                  >
                    Explore All Products
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </main>
        </div>
      </div>
    </div>
  )
}
