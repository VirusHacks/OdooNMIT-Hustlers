"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Navigation } from "@/components/ui/navigation"
import {
  Search,
  Zap,
  Compass,
  ShoppingBag,
  ShoppingCart,
  Gift,
  Lightbulb,
  Plus,
  Users,
  ChevronLeft,
  ChevronRight,
  Heart,
  ArrowUpRight,
  TrendingUp,
  Star,
  Clock,
  Package,
  CreditCard,
  Settings,
  Bell,
  BarChart3,
  DollarSign,
  Filter,
} from "lucide-react"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

interface Product {
  id: string
  title: string
  description: string
  price: number
  condition: string
  brand: string | null
  size: string | null
  color: string | null
  images: string[]
  created_at: string
  users: {
    id: string
  name: string | null
  location: string | null
  }
  categories: {
    id: string
    name: string
    slug: string
  }
}

interface Listing {
  id: string
  title: string
  description: string
  price: number
  condition: string
  brand: string | null
  size: string | null
  color: string | null
  images: string[]
  created_at: string
  is_active: boolean
  is_sold: boolean
}

interface Order {
  id: string
  order_number: string
  total_amount: number
  status: string
  created_at: string
  shipping_address: any
  payment_method: string
  users_orders_seller_idTousers: {
    id: string
    name: string | null
    location: string | null
  }
  order_items: {
    id: string
    quantity: number
    price: number
    listings: {
      id: string
      title: string
      images: string[]
      price: number
    }
  }[]
}

export default function DashboardPage() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [activeSection, setActiveSection] = useState("explore")
  const [products, setProducts] = useState<Product[]>([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)
  const [productsError, setProductsError] = useState<string | null>(null)
  
  const [listings, setListings] = useState<Listing[]>([])
  const [isLoadingListings, setIsLoadingListings] = useState(false)
  const [listingsError, setListingsError] = useState<string | null>(null)
  
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoadingOrders, setIsLoadingOrders] = useState(false)
  const [ordersError, setOrdersError] = useState<string | null>(null)

  const handleSidebarClick = (section: string) => {
    setActiveSection(section)
    
    // Fetch data when switching to specific sections
    if (section === "listings" && listings.length === 0) {
      fetchListings()
    } else if (section === "orders" && orders.length === 0) {
      fetchOrders()
    }
  }

  const fetchProducts = async () => {
    try {
      setIsLoadingProducts(true)
      setProductsError(null)
      
      const response = await fetch('/api/products?limit=8')
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }
      
        const data = await response.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error('Error fetching products:', error)
      setProductsError('Failed to load products')
    } finally {
      setIsLoadingProducts(false)
    }
  }

  const fetchListings = async () => {
    try {
      setIsLoadingListings(true)
      setListingsError(null)
      
      const response = await fetch('/api/my-listings')
      if (!response.ok) {
        throw new Error('Failed to fetch listings')
      }
      
        const data = await response.json()
        setListings(data.listings || [])
    } catch (error) {
      console.error('Error fetching listings:', error)
      setListingsError('Failed to load listings')
    } finally {
      setIsLoadingListings(false)
    }
  }

  const fetchOrders = async () => {
    try {
      setIsLoadingOrders(true)
      setOrdersError(null)
      
      const response = await fetch('/api/orders')
      if (!response.ok) {
        throw new Error('Failed to fetch orders')
      }
      
        const data = await response.json()
        setOrders(data.orders || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
      setOrdersError('Failed to load orders')
    } finally {
      setIsLoadingOrders(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

    return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/30 via-white to-slate-50">
        <Navigation />
      <main className="max-w-7xl mx-auto p-6">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
          {/* Dashboard Stats Header */}
          <motion.div variants={cardVariants} className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">Welcome back! Here's your marketplace overview.</p>
        </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-3xl font-bold">{products.length}</span>
                <div className="text-muted-foreground">
                  <div>Products</div>
                  <div>Available now</div>
      </div>
        </div>
      </div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar */}
            <motion.div variants={cardVariants} className="space-y-6">
              {/* Navigation Menu */}
              <Card className="p-6 bg-white/80 backdrop-blur-sm">
                <div className="space-y-2">
                  <Button
                    variant={activeSection === "popular" ? "default" : "ghost"}
                    className={`w-full justify-start ${activeSection === "popular" ? "bg-blue-600 hover:bg-blue-700 text-white" : "text-muted-foreground"}`}
                    onClick={() => handleSidebarClick("popular")}
                  >
                    <Zap className="h-4 w-4 mr-3" />
                    Popular Products
                  </Button>
                  <Button
                    variant={activeSection === "explore" ? "default" : "ghost"}
                    className={`w-full justify-start ${activeSection === "explore" ? "bg-blue-600 hover:bg-blue-700 text-white" : "text-muted-foreground"}`}
                    onClick={() => handleSidebarClick("explore")}
                  >
                    <Compass className="h-4 w-4 mr-3" />
                    Explore New
                  </Button>
                  <Button
                    variant={activeSection === "clothing" ? "default" : "ghost"}
                    className={`w-full justify-start ${activeSection === "clothing" ? "bg-blue-600 hover:bg-blue-700 text-white" : "text-muted-foreground"}`}
                    onClick={() => handleSidebarClick("clothing")}
                  >
                    <ShoppingCart className="h-4 w-4 mr-3" />
                    Clothing and Shoes
                  </Button>
                  <Button
                    variant={activeSection === "gifts" ? "default" : "ghost"}
                    className={`w-full justify-start ${activeSection === "gifts" ? "bg-blue-600 hover:bg-blue-700 text-white" : "text-muted-foreground"}`}
                    onClick={() => handleSidebarClick("gifts")}
                  >
                    <Gift className="h-4 w-4 mr-3" />
                    Gifts and Living
                  </Button>
                  <Button
                    variant={activeSection === "inspiration" ? "default" : "ghost"}
                    className={`w-full justify-start ${activeSection === "inspiration" ? "bg-blue-600 hover:bg-blue-700 text-white" : "text-muted-foreground"}`}
                    onClick={() => handleSidebarClick("inspiration")}
                  >
                    <Lightbulb className="h-4 w-4 mr-3" />
                    Inspiration
                  </Button>
                  <Button
                    variant={activeSection === "analytics" ? "default" : "ghost"}
                    className={`w-full justify-start ${activeSection === "analytics" ? "bg-blue-600 hover:bg-blue-700 text-white" : "text-muted-foreground"}`}
                    onClick={() => handleSidebarClick("analytics")}
                  >
                    <BarChart3 className="h-4 w-4 mr-3" />
                    Analytics
                  </Button>
                  <Button
                    variant={activeSection === "listings" ? "default" : "ghost"}
                    className={`w-full justify-start ${activeSection === "listings" ? "bg-blue-600 hover:bg-blue-700 text-white" : "text-muted-foreground"}`}
                    onClick={() => handleSidebarClick("listings")}
                  >
                    <Package className="h-4 w-4 mr-3" />
                    My Listings
                  </Button>
                  <Button
                    variant={activeSection === "orders" ? "default" : "ghost"}
                    className={`w-full justify-start ${activeSection === "orders" ? "bg-blue-600 hover:bg-blue-700 text-white" : "text-muted-foreground"}`}
                    onClick={() => handleSidebarClick("orders")}
                  >
                    <ShoppingCart className="h-4 w-4 mr-3" />
                    My Orders
                  </Button>
                  <Button
                    variant={activeSection === "settings" ? "default" : "ghost"}
                    className={`w-full justify-start ${activeSection === "settings" ? "bg-blue-600 hover:bg-blue-700 text-white" : "text-muted-foreground"}`}
                    onClick={() => handleSidebarClick("settings")}
                  >
                    <Settings className="h-4 w-4 mr-3" />
                    Settings
                  </Button>
                  </div>
              </Card>

              {/* Quick Actions */}
              <Card className="p-6 bg-white/80 backdrop-blur-sm">
                <h3 className="font-medium text-muted-foreground mb-4">Quick actions</h3>
                <div className="space-y-3">
                  <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                    <Plus className="h-4 w-4 mr-3" />
                    Request for product
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                    <Users className="h-4 w-4 mr-3" />
                    Add member
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                    <Bell className="h-4 w-4 mr-3" />
                    Send notification
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                    <CreditCard className="h-4 w-4 mr-3" />
                    Process payment
                  </Button>
                </div>
              </Card>

              {/* Recent Orders */}
              <Card className="p-6 bg-white/80 backdrop-blur-sm">
                <h3 className="font-medium mb-4">Recent Products ({products.length})</h3>
                <div className="space-y-3">
                  {isLoadingProducts ? (
                    <>
                      <div className="flex items-center gap-3 animate-pulse">
                        <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                      <div className="flex items-center gap-3 animate-pulse">
                        <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
                  </div>
                    </>
                  ) : products.length > 0 ? (
                    products.slice(0, 2).map((product) => (
                      <div key={product.id} className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage 
                            src={product.images && product.images.length > 0 ? product.images[0] : "/placeholder.jpg"} 
                          />
                          <AvatarFallback>{product.title.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{product.title}</p>
                          <p className="text-xs text-muted-foreground">${product.price}</p>
                </div>
                        <Button variant="ghost" size="sm">
                          <ArrowUpRight className="h-4 w-4" />
                        </Button>
              </div>
                    ))
                  ) : (
                    <div className="text-center text-muted-foreground text-sm py-4">
                      No products available
                    </div>
                  )}
                  <Button variant="ghost" className="w-full text-sm text-muted-foreground">
                    See all
                  </Button>
                </div>

                <div className="mt-6 pt-4 border-t">
                  <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Log out
                  </Button>
                </div>
              </Card>
          </motion.div>

            {/* Main Content */}
            <motion.div variants={cardVariants} className="lg:col-span-3 space-y-6">
              {activeSection === "explore" && (
                <>
                  {/* Category Filters */}
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Explore</h2>
                    <div className="flex items-center gap-4">
                      <div className="flex gap-2">
                        {["All", "Men", "Women"].map((category) => (
                          <Button
                            key={category}
                            variant={activeCategory === category ? "default" : "ghost"}
                            size="sm"
                            className="rounded-full"
                            onClick={() => setActiveCategory(category)}
                          >
                            {category === "Men" && <Users className="h-4 w-4 mr-1" />}
                            {category === "Women" && <Users className="h-4 w-4 mr-1" />}
                            {category}
                          </Button>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="rounded-full bg-transparent">
                          Filters
                        </Button>
                        <Button variant="outline" size="sm" className="rounded-full w-10 h-10 p-0 bg-transparent">
                          <Search className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
            </div>

                  {/* Promotional Banners */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Main Promo Banner */}
                    <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-200 to-teal-300 p-8 text-black">
                      <div className="relative z-10">
                        <h3 className="text-2xl font-bold mb-2">GET UP TO 50% OFF</h3>
                        <p className="mb-4 opacity-80">Get Discount</p>
                        <Button className="bg-white text-black hover:bg-gray-100 rounded-full">Get Discount</Button>
                      </div>
                      <div className="absolute right-0 top-0 w-32 h-32 opacity-30">
                        <img
                          src="/iphone-13-pro-graphite.jpg"
                          alt="Fashion model"
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                    </Card>

                    {/* Secondary Banner */}
                    <Card className="relative overflow-hidden bg-gradient-to-br from-yellow-200 to-orange-300 p-8 text-black">
                      <div className="relative z-10">
                        <h3 className="text-xl font-bold mb-2">Winter's weekend</h3>
                        <p className="mb-4 opacity-80">keep it casual</p>
                        <Button
                          variant="outline"
                          className="border-black text-black hover:bg-black hover:text-white rounded-full bg-transparent"
                        >
                          <ArrowUpRight className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="absolute right-0 top-0 w-24 h-24 opacity-30">
                        <img
                          src="/vintage-black-leather-jacket.jpg"
                          alt="Winter outfit"
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                    </Card>
                  </div>

                  {/* Featured Products */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {isLoadingProducts ? (
                      <>
                        {/* Loading Skeleton */}
                        <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm">
                          <div className="aspect-square relative overflow-hidden bg-gray-100 animate-pulse">
                            <div className="w-full h-full bg-gray-200"></div>
                          </div>
                        </Card>
                        <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm">
                          <div className="aspect-square relative overflow-hidden bg-gray-100 animate-pulse">
                            <div className="w-full h-full bg-gray-200"></div>
                          </div>
                        </Card>
                      </>
                    ) : productsError ? (
                      <div className="col-span-2 text-center py-8">
                        <p className="text-muted-foreground">{productsError}</p>
                        <Button onClick={fetchProducts} className="mt-4">
                          Try Again
                        </Button>
                      </div>
                    ) : products.length > 0 ? (
                      products.slice(0, 2).map((product, index) => (
                        <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm">
                          <div className="aspect-square relative overflow-hidden bg-gray-100">
                            <img
                              src={product.images && product.images.length > 0 ? product.images[0] : "/placeholder.jpg"}
                              alt={product.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-3 right-3">
                              <Button size="sm" variant="ghost" className="rounded-full w-8 h-8 p-0 bg-white/80">
                                <Heart className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  {index === 0 ? "Our Picks" : "Your Choice"}
                                </p>
                                <h3 className="font-semibold line-clamp-1">{product.title}</h3>
                              </div>
                              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 rounded-full">
                                ${product.price}
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))
                    ) : (
                      <div className="col-span-2 text-center py-8">
                        <p className="text-muted-foreground">No products available</p>
                      </div>
                    )}
                  </div>

                  {/* Additional Product Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Avail Offer Card */}
                    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm">
                      <div className="aspect-square relative overflow-hidden bg-orange-200">
                        <img
                          src="/iphone-13-pro-graphite.jpg"
                          alt="Woman in orange hoodie"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 right-3">
                          <Button size="sm" variant="ghost" className="rounded-full w-8 h-8 p-0 bg-white/80">
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="absolute bottom-3 left-3">
                          <Button className="bg-orange-600 hover:bg-orange-700 rounded-full">Avail Offer</Button>
                        </div>
                      </div>
                    </Card>

                    {/* Fashion Banner */}
                    <Card className="relative overflow-hidden bg-slate-800 text-white p-8">
                      <div className="relative z-10">
                        <h3 className="text-2xl font-bold mb-2 text-white">Bring Bold Fashion</h3>
                        <p className="text-white/80 mb-4">Layers on Layers</p>
                        <Button
                          variant="outline"
                          className="border-white text-white hover:bg-white hover:text-slate-800 rounded-full bg-transparent"
                        >
                          <ArrowUpRight className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="absolute right-0 top-0 w-32 h-32 opacity-30">
                        <img
                          src="/vintage-black-leather-jacket.jpg"
                          alt="Fashion model"
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                    </Card>
                  </div>

                  {/* Favourites Section */}
                  <Card className="p-6 bg-white/80 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Favourites</h3>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="rounded-full w-8 h-8 p-0 bg-transparent">
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="rounded-full w-8 h-8 p-0 bg-transparent">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex gap-4 overflow-x-auto">
                      {isLoadingProducts ? (
                        <>
                          <div className="flex-shrink-0 w-16 h-16 rounded-full overflow-hidden bg-gray-200 animate-pulse"></div>
                          <div className="flex-shrink-0 w-16 h-16 rounded-full overflow-hidden bg-gray-200 animate-pulse"></div>
                          <div className="flex-shrink-0 w-16 h-16 rounded-full overflow-hidden bg-gray-200 animate-pulse"></div>
                        </>
                      ) : products.length > 0 ? (
                        products.slice(2, 5).map((product) => (
                          <div key={product.id} className="flex-shrink-0 w-16 h-16 rounded-full overflow-hidden bg-gray-100">
                            <img 
                              src={product.images && product.images.length > 0 ? product.images[0] : "/placeholder.jpg"} 
                              alt={product.title} 
                              className="w-full h-full object-cover" 
                            />
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-muted-foreground text-sm">
                          No products available
                        </div>
                      )}
                      <Button variant="outline" className="flex-shrink-0 rounded-full bg-transparent">
                        See All
                            </Button>
                    </div>
                  </Card>
                </>
              )}

              {activeSection === "popular" && (
                <>
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Popular Products</h2>
                    <Button variant="outline" size="sm" className="rounded-full bg-transparent">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      View Trends
                    </Button>
                        </div>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                          <TrendingUp className="h-6 w-6 text-white" />
                            </div>
                        <div>
                          <p className="text-2xl font-bold">{products.length}</p>
                          <p className="text-sm text-muted-foreground">Total Products</p>
                            </div>
                          </div>
                    </Card>
                    <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                          <Star className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">
                            {products.length > 0 ? (products.reduce((sum, product) => sum + product.price, 0) / products.length).toFixed(0) : '0'}
                          </p>
                          <p className="text-sm text-muted-foreground">Avg Price</p>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                          <Users className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">
                            {products.length > 0 ? new Set(products.map(p => p.users.id)).size : '0'}
                          </p>
                          <p className="text-sm text-muted-foreground">Active Sellers</p>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Top Products Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoadingProducts ? (
                      // Loading skeleton
                      Array.from({ length: 6 }).map((_, index) => (
                        <Card
                          key={index}
                          className="group overflow-hidden hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm"
                        >
                          <div className="aspect-square relative overflow-hidden bg-gray-100 animate-pulse">
                            <div className="w-full h-full bg-gray-200"></div>
                          </div>
                          <div className="p-4 space-y-2">
                            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                            <div className="flex items-center justify-between">
                              <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
                              <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
                            </div>
                          </div>
                        </Card>
                      ))
                    ) : productsError ? (
                      <div className="col-span-full text-center py-12">
                        <p className="text-muted-foreground mb-4">{productsError}</p>
                        <Button onClick={fetchProducts}>
                          Try Again
                        </Button>
                      </div>
                    ) : products.length > 0 ? (
                      products.slice(0, 6).map((product, index) => (
                        <Card
                          key={product.id}
                          className="group overflow-hidden hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm"
                        >
                          <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                            {product.images && product.images.length > 0 ? (
                              <img
                                src={product.images[0]}
                                alt={product.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                              <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                                <ShoppingBag className="h-16 w-16 text-gray-400" />
                              </div>
                            )}
                            <div className="absolute top-3 right-3">
                              <Button size="sm" variant="ghost" className="rounded-full w-8 h-8 p-0 bg-white/80">
                                <Heart className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="absolute top-3 left-3">
                              <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                #{index + 1}
                              </div>
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold mb-1 line-clamp-1">{product.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                              {product.categories?.name || 'Best seller this month'}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-lg">${product.price}</span>
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm">4.{Math.floor(Math.random() * 5) + 3}</span>
                              </div>
                            </div>
                            {product.brand && (
                              <p className="text-xs text-muted-foreground mt-1">by {product.brand}</p>
                            )}
                                </div>
                        </Card>
                      ))
                              ) : (
                      <div className="col-span-full text-center py-12">
                        <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-muted-foreground">No popular products available</p>
                      </div>
                              )}
                            </div>
                </>
              )}

              {activeSection === "analytics" && (
                <>
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="rounded-full bg-transparent">
                        <Clock className="h-4 w-4 mr-2" />
                        Last 30 days
                      </Button>
                    </div>
                      </div>

                  {/* Analytics Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="p-6 bg-gradient-to-br from-emerald-50 to-emerald-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Revenue</p>
                          <p className="text-2xl font-bold">$12,847</p>
                          <p className="text-xs text-emerald-600">+12.5% from last month</p>
                        </div>
                        <BarChart3 className="h-8 w-8 text-emerald-600" />
                      </div>
                    </Card>
                    <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Orders</p>
                          <p className="text-2xl font-bold">1,247</p>
                          <p className="text-xs text-blue-600">+8.2% from last month</p>
                        </div>
                        <Package className="h-8 w-8 text-blue-600" />
                      </div>
                    </Card>
                    <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Customers</p>
                          <p className="text-2xl font-bold">892</p>
                          <p className="text-xs text-orange-600">+15.3% from last month</p>
                        </div>
                        <Users className="h-8 w-8 text-orange-600" />
                      </div>
                    </Card>
                    <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Conversion</p>
                          <p className="text-2xl font-bold">3.2%</p>
                          <p className="text-xs text-purple-600">+0.8% from last month</p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-purple-600" />
                      </div>
                    </Card>
                  </div>

                  {/* Chart Placeholder */}
                  <Card className="p-6 bg-white/80 backdrop-blur-sm">
                    <h3 className="text-lg font-semibold mb-4">Sales Overview</h3>
                    <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">Interactive chart would go here</p>
                      </div>
                    </div>
                  </Card>
                </>
              )}

              {activeSection === "listings" && (
                <>
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">My Listings</h2>
                    <Button className="bg-blue-600 hover:bg-blue-700 rounded-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Listing
                    </Button>
                  </div>

                  {/* Listing Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                          <Package className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{listings.length}</p>
                          <p className="text-sm text-muted-foreground">Total Listings</p>
                        </div>
                      </div>
                  </Card>
                    <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                          <TrendingUp className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">
                            {listings.filter(l => l.is_active && !l.is_sold).length}
                          </p>
                          <p className="text-sm text-muted-foreground">Active</p>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                          <ShoppingCart className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">
                            {listings.filter(l => l.is_sold).length}
                          </p>
                          <p className="text-sm text-muted-foreground">Sold</p>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                          <DollarSign className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">
                            ${listings.reduce((sum, listing) => sum + listing.price, 0).toFixed(0)}
                          </p>
                          <p className="text-sm text-muted-foreground">Total Value</p>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Listings Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {isLoadingListings ? (
                      // Loading skeleton
                      Array.from({ length: 6 }).map((_, index) => (
                        <Card
                          key={index}
                          className="group overflow-hidden hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm"
                        >
                          <div className="aspect-square relative overflow-hidden bg-gray-100 animate-pulse">
                            <div className="w-full h-full bg-gray-200"></div>
                          </div>
                          <div className="p-4 space-y-2">
                            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                            <div className="flex items-center justify-between">
                              <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
                              <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
                            </div>
                          </div>
                        </Card>
                      ))
                    ) : listingsError ? (
                      <div className="col-span-full text-center py-12">
                        <p className="text-muted-foreground mb-4">{listingsError}</p>
                        <Button onClick={fetchListings}>
                          Try Again
                        </Button>
                        </div>
                      ) : listings.length > 0 ? (
                      listings.map((listing) => (
                        <Card
                              key={listing.id}
                          className="group overflow-hidden hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm"
                            >
                          <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                                {listing.images && listing.images.length > 0 ? (
                                  <img
                                src={listing.images[0]}
                                    alt={listing.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                ) : (
                              <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                                <Package className="h-16 w-16 text-gray-400" />
                                  </div>
                                )}
                            <div className="absolute top-3 right-3">
                              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                listing.is_sold 
                                  ? 'bg-red-500 text-white' 
                                  : listing.is_active 
                                    ? 'bg-green-500 text-white' 
                                    : 'bg-gray-500 text-white'
                              }`}>
                                {listing.is_sold ? 'Sold' : listing.is_active ? 'Active' : 'Inactive'}
                                  </div>
                            </div>
                            <div className="absolute top-3 left-3">
                              <Button size="sm" variant="ghost" className="rounded-full w-8 h-8 p-0 bg-white/80">
                                <Heart className="h-4 w-4" />
                              </Button>
                            </div>
                              </div>
                              <div className="p-4">
                            <h3 className="font-semibold mb-1 line-clamp-1">{listing.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{listing.description}</p>
                                <div className="flex items-center justify-between">
                              <span className="font-bold text-lg">${listing.price}</span>
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-muted-foreground">{listing.condition}</span>
                                </div>
                              </div>
                            {listing.brand && (
                              <p className="text-xs text-muted-foreground mt-1">by {listing.brand}</p>
                            )}
                            <div className="flex gap-2 mt-3">
                              <Button size="sm" variant="outline" className="flex-1">
                                Edit
                              </Button>
                              <Button size="sm" variant="outline" className="flex-1">
                                View
                              </Button>
                        </div>
                            </div>
                        </Card>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-12">
                        <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-muted-foreground">No listings found</p>
                        <Button className="mt-4">
                          <Plus className="h-4 w-4 mr-2" />
                          Create Your First Listing
                          </Button>
                        </div>
                      )}
                  </div>
                </>
              )}

              {activeSection === "orders" && (
                <>
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">My Orders</h2>
                    <Button className="bg-blue-600 hover:bg-blue-700 rounded-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Track Order
                    </Button>
                        </div>

                  {/* Order Status Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card className="p-4 bg-yellow-50 border-yellow-200">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-yellow-600">
                          {orders.filter(o => o.status === 'PENDING').length}
                        </p>
                        <p className="text-sm text-yellow-700">Pending</p>
                                    </div>
                    </Card>
                    <Card className="p-4 bg-blue-50 border-blue-200">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">
                          {orders.filter(o => o.status === 'PROCESSING').length}
                        </p>
                        <p className="text-sm text-blue-700">Processing</p>
                                    </div>
                    </Card>
                    <Card className="p-4 bg-green-50 border-green-200">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">
                          {orders.filter(o => o.status === 'SHIPPED').length}
                        </p>
                        <p className="text-sm text-green-700">Shipped</p>
                                  </div>
                    </Card>
                    <Card className="p-4 bg-gray-50 border-gray-200">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-600">
                          {orders.filter(o => o.status === 'DELIVERED').length}
                        </p>
                        <p className="text-sm text-gray-700">Delivered</p>
                                </div>
                    </Card>
                  </div>

                  {/* Recent Orders Table */}
                  <Card className="p-6 bg-white/80 backdrop-blur-sm">
                    <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
                    {isLoadingOrders ? (
                      <div className="space-y-4">
                        {Array.from({ length: 3 }).map((_, index) => (
                          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg animate-pulse">
                                <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                              <div>
                                <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-24"></div>
                                    </div>
                                  </div>
                            <div className="text-right">
                              <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
                              <div className="h-3 bg-gray-200 rounded w-20"></div>
                                </div>
                              </div>
                        ))}
                                        </div>
                    ) : ordersError ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground mb-4">{ordersError}</p>
                        <Button onClick={fetchOrders}>
                          Try Again
                        </Button>
                                    </div>
                    ) : orders.length > 0 ? (
                      <div className="space-y-4">
                        {orders.slice(0, 5).map((order) => (
                          <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Package className="h-6 w-6 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-medium">{order.order_number}</p>
                                <p className="text-sm text-muted-foreground">
                                  {order.users_orders_seller_idTousers.name || 'Unknown Seller'}
                                      </p>
                                    </div>
                                  </div>
                            <div className="text-right">
                              <p className="font-medium">${order.total_amount}</p>
                              <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                                order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                order.status === 'PROCESSING' ? 'bg-blue-100 text-blue-800' :
                                order.status === 'SHIPPED' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {order.status}
                              </div>
                            </div>
                          </div>
                          ))}
                        </div>
                      ) : (
                      <div className="text-center py-8">
                        <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-muted-foreground">No orders found</p>
                        <Button className="mt-4">
                          <Compass className="h-4 w-4 mr-2" />
                          Start Shopping
                          </Button>
                        </div>
                      )}
                  </Card>
                </>
              )}

              {activeSection === "settings" && (
                <>
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Settings</h2>
                          </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Account Settings */}
                    <Card className="p-6 bg-white/80 backdrop-blur-sm">
                      <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span>Email Notifications</span>
                          <Button variant="outline" size="sm">
                            Enable
                          </Button>
                          </div>
                        <div className="flex items-center justify-between">
                          <span>Two-Factor Auth</span>
                          <Button variant="outline" size="sm">
                            Setup
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Privacy Settings</span>
                          <Button variant="outline" size="sm">
                            Configure
                          </Button>
                        </div>
                      </div>
                    </Card>

                    {/* Store Settings */}
                    <Card className="p-6 bg-white/80 backdrop-blur-sm">
                      <h3 className="text-lg font-semibold mb-4">Store Settings</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span>Payment Methods</span>
                          <Button variant="outline" size="sm">
                            Manage
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Shipping Options</span>
                          <Button variant="outline" size="sm">
                            Configure
                          </Button>
                      </div>
                        <div className="flex items-center justify-between">
                          <span>Tax Settings</span>
                          <Button variant="outline" size="sm">
                            Update
                          </Button>
                        </div>
                      </div>
                  </Card>
                  </div>
                </>
              )}

              {activeSection === "clothing" && (
                <>
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Clothing & Shoes</h2>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="rounded-full bg-transparent">
                        <Filter className="h-4 w-4 mr-2" />
                        Filters
                      </Button>
                      <Button variant="outline" size="sm" className="rounded-full w-10 h-10 p-0 bg-transparent">
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Category Tabs */}
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {["All", "Men's", "Women's", "Kids", "Shoes", "Accessories", "Vintage", "Designer"].map((category) => (
                      <Button
                        key={category}
                        variant={activeCategory === category ? "default" : "ghost"}
                        size="sm"
                        className="rounded-full whitespace-nowrap"
                        onClick={() => setActiveCategory(category)}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>

                  {/* Featured Collections */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Men's Collection */}
                    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-slate-800 to-slate-900 text-white">
                      <div className="aspect-[4/5] relative overflow-hidden">
                        <img
                          src="/vintage-black-leather-jacket.jpg"
                          alt="Men's Collection"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-xl font-bold mb-2">Men's Collection</h3>
                          <p className="text-sm opacity-90 mb-3">Discover the latest trends</p>
                          <Button size="sm" className="bg-white text-black hover:bg-gray-100 rounded-full">
                            Shop Now
                          </Button>
                        </div>
                      </div>
                    </Card>

                    {/* Women's Collection */}
                    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-pink-100 to-purple-200">
                      <div className="aspect-[4/5] relative overflow-hidden">
                        <img
                          src="/iphone-13-pro-graphite.jpg"
                          alt="Women's Collection"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-xl font-bold mb-2 text-white">Women's Fashion</h3>
                          <p className="text-sm opacity-90 mb-3 text-white">Elegant & Stylish</p>
                          <Button size="sm" className="bg-white text-black hover:bg-gray-100 rounded-full">
                            Explore
                          </Button>
                        </div>
                      </div>
                    </Card>

                    {/* Shoes Collection */}
                    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-amber-100 to-orange-200">
                      <div className="aspect-[4/5] relative overflow-hidden">
                        <img
                          src="/placeholder.jpg"
                          alt="Shoes Collection"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-xl font-bold mb-2 text-white">Shoes & Sneakers</h3>
                          <p className="text-sm opacity-90 mb-3 text-white">Step in style</p>
                          <Button size="sm" className="bg-white text-black hover:bg-gray-100 rounded-full">
                            Browse
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Product Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {isLoadingProducts ? (
                      Array.from({ length: 8 }).map((_, index) => (
                        <Card key={index} className="group overflow-hidden hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm">
                          <div className="aspect-square relative overflow-hidden bg-gray-100 animate-pulse">
                            <div className="w-full h-full bg-gray-200"></div>
                          </div>
                          <div className="p-4 space-y-2">
                            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                            <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
                          </div>
                        </Card>
                      ))
                    ) : products.length > 0 ? (
                      products.slice(0, 8).map((product) => (
                        <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm">
                          <div className="aspect-square relative overflow-hidden bg-gray-100">
                            {product.images && product.images.length > 0 ? (
                              <img
                                src={product.images[0]}
                                alt={product.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                <ShoppingBag className="h-16 w-16 text-gray-400" />
                              </div>
                            )}
                            <div className="absolute top-3 right-3">
                              <Button size="sm" variant="ghost" className="rounded-full w-8 h-8 p-0 bg-white/80">
                                <Heart className="h-4 w-4" />
                              </Button>
                            </div>
                            {product.condition === 'NEW' && (
                              <div className="absolute top-3 left-3">
                                <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                  New
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold mb-1 line-clamp-1">{product.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                              {product.categories?.name || 'Fashion'}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-lg">${product.price}</span>
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm">4.{Math.floor(Math.random() * 5) + 3}</span>
                              </div>
                            </div>
                            {product.brand && (
                              <p className="text-xs text-muted-foreground mt-1">by {product.brand}</p>
                            )}
                          </div>
                        </Card>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-12">
                        <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-muted-foreground">No clothing items available</p>
                      </div>
                    )}
                  </div>
                </>
              )}

              {activeSection === "gifts" && (
                <>
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Gifts & Living</h2>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="rounded-full bg-transparent">
                        <Filter className="h-4 w-4 mr-2" />
                        Filters
                      </Button>
                      <Button variant="outline" size="sm" className="rounded-full w-10 h-10 p-0 bg-transparent">
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Gift Categories */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-pink-50 to-rose-100">
                      <Gift className="h-12 w-12 text-pink-600 mx-auto mb-3" />
                      <h3 className="font-semibold mb-1">Birthday Gifts</h3>
                      <p className="text-sm text-muted-foreground">Perfect for celebrations</p>
                    </Card>
                    <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-blue-50 to-cyan-100">
                      <Heart className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                      <h3 className="font-semibold mb-1">Romantic Gifts</h3>
                      <p className="text-sm text-muted-foreground">Express your love</p>
                    </Card>
                    <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-green-50 to-emerald-100">
                      <Lightbulb className="h-12 w-12 text-green-600 mx-auto mb-3" />
                      <h3 className="font-semibold mb-1">Home Decor</h3>
                      <p className="text-sm text-muted-foreground">Beautify your space</p>
                    </Card>
                    <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-purple-50 to-violet-100">
                      <Star className="h-12 w-12 text-purple-600 mx-auto mb-3" />
                      <h3 className="font-semibold mb-1">Luxury Items</h3>
                      <p className="text-sm text-muted-foreground">Premium selections</p>
                    </Card>
                  </div>

                  {/* Featured Gift Ideas */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-red-50 to-pink-100">
                      <div className="aspect-[16/9] relative overflow-hidden">
                        <img
                          src="/iphone-13-pro-graphite.jpg"
                          alt="Valentine's Collection"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-2xl font-bold text-white mb-2">Valentine's Collection</h3>
                          <p className="text-white/90 mb-3">Show your love with special gifts</p>
                          <Button size="sm" className="bg-white text-black hover:bg-gray-100 rounded-full">
                            Shop Gifts
                          </Button>
                        </div>
                      </div>
                    </Card>

                    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-green-50 to-teal-100">
                      <div className="aspect-[16/9] relative overflow-hidden">
                        <img
                          src="/vintage-black-leather-jacket.jpg"
                          alt="Home & Living"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-2xl font-bold text-white mb-2">Home & Living</h3>
                          <p className="text-white/90 mb-3">Transform your space</p>
                          <Button size="sm" className="bg-white text-black hover:bg-gray-100 rounded-full">
                            Explore
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Gift Products Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {isLoadingProducts ? (
                      Array.from({ length: 8 }).map((_, index) => (
                        <Card key={index} className="group overflow-hidden hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm">
                          <div className="aspect-square relative overflow-hidden bg-gray-100 animate-pulse">
                            <div className="w-full h-full bg-gray-200"></div>
                          </div>
                          <div className="p-4 space-y-2">
                            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                            <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
                          </div>
                        </Card>
                      ))
                    ) : products.length > 0 ? (
                      products.slice(0, 8).map((product) => (
                        <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm">
                          <div className="aspect-square relative overflow-hidden bg-gray-100">
                            {product.images && product.images.length > 0 ? (
                              <img
                                src={product.images[0]}
                                alt={product.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                                <Gift className="h-16 w-16 text-gray-400" />
                              </div>
                            )}
                            <div className="absolute top-3 right-3">
                              <Button size="sm" variant="ghost" className="rounded-full w-8 h-8 p-0 bg-white/80">
                                <Heart className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="absolute top-3 left-3">
                              <div className="bg-pink-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                Gift
                              </div>
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold mb-1 line-clamp-1">{product.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                              {product.categories?.name || 'Gift Item'}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-lg">${product.price}</span>
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm">4.{Math.floor(Math.random() * 5) + 3}</span>
                              </div>
                            </div>
                            {product.brand && (
                              <p className="text-xs text-muted-foreground mt-1">by {product.brand}</p>
                            )}
                          </div>
                        </Card>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-12">
                        <Gift className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-muted-foreground">No gift items available</p>
                      </div>
                    )}
                  </div>
                </>
              )}

              {activeSection === "inspiration" && (
                <>
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Inspiration</h2>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="rounded-full bg-transparent">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Trending
                      </Button>
                      <Button variant="outline" size="sm" className="rounded-full bg-transparent">
                        <Star className="h-4 w-4 mr-2" />
                        Featured
                      </Button>
                    </div>
                  </div>

                  {/* Style Guides */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-indigo-900 to-purple-900 text-white">
                      <div className="aspect-[4/5] relative overflow-hidden">
                        <img
                          src="/vintage-black-leather-jacket.jpg"
                          alt="Street Style Guide"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-xl font-bold mb-2">Street Style Guide</h3>
                          <p className="text-sm opacity-90 mb-3">Urban fashion inspiration</p>
                          <Button size="sm" className="bg-white text-black hover:bg-gray-100 rounded-full">
                            View Guide
                          </Button>
                        </div>
                      </div>
                    </Card>

                    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-rose-100 to-pink-200">
                      <div className="aspect-[4/5] relative overflow-hidden">
                        <img
                          src="/iphone-13-pro-graphite.jpg"
                          alt="Minimalist Style"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-xl font-bold mb-2 text-white">Minimalist Style</h3>
                          <p className="text-sm opacity-90 mb-3 text-white">Less is more</p>
                          <Button size="sm" className="bg-white text-black hover:bg-gray-100 rounded-full">
                            Explore
                          </Button>
                        </div>
                      </div>
                    </Card>

                    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-amber-100 to-orange-200">
                      <div className="aspect-[4/5] relative overflow-hidden">
                        <img
                          src="/vintage-black-leather-jacket.jpg"
                          alt="Vintage Vibes"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-xl font-bold mb-2 text-white">Vintage Vibes</h3>
                          <p className="text-sm opacity-90 mb-3 text-white">Retro fashion trends</p>
                          <Button size="sm" className="bg-white text-black hover:bg-gray-100 rounded-full">
                            Discover
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Trend Categories */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-blue-50 to-cyan-100">
                      <TrendingUp className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                      <h3 className="font-semibold mb-1">Trending Now</h3>
                      <p className="text-sm text-muted-foreground">What's hot this season</p>
                    </Card>
                    <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-green-50 to-emerald-100">
                      <Lightbulb className="h-12 w-12 text-green-600 mx-auto mb-3" />
                      <h3 className="font-semibold mb-1">Style Tips</h3>
                      <p className="text-sm text-muted-foreground">Expert fashion advice</p>
                    </Card>
                    <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-purple-50 to-violet-100">
                      <Star className="h-12 w-12 text-purple-600 mx-auto mb-3" />
                      <h3 className="font-semibold mb-1">Editor's Picks</h3>
                      <p className="text-sm text-muted-foreground">Curated selections</p>
                    </Card>
                    <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-pink-50 to-rose-100">
                      <Heart className="h-12 w-12 text-pink-600 mx-auto mb-3" />
                      <h3 className="font-semibold mb-1">Favorites</h3>
                      <p className="text-sm text-muted-foreground">Community loved</p>
                    </Card>
                  </div>

                  {/* Featured Products */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {isLoadingProducts ? (
                      Array.from({ length: 8 }).map((_, index) => (
                        <Card key={index} className="group overflow-hidden hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm">
                          <div className="aspect-square relative overflow-hidden bg-gray-100 animate-pulse">
                            <div className="w-full h-full bg-gray-200"></div>
                          </div>
                          <div className="p-4 space-y-2">
                            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                            <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
                          </div>
                        </Card>
                      ))
                    ) : products.length > 0 ? (
                      products.slice(0, 8).map((product) => (
                        <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm">
                          <div className="aspect-square relative overflow-hidden bg-gray-100">
                            {product.images && product.images.length > 0 ? (
                              <img
                                src={product.images[0]}
                                alt={product.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                                <Lightbulb className="h-16 w-16 text-gray-400" />
                              </div>
                            )}
                            <div className="absolute top-3 right-3">
                              <Button size="sm" variant="ghost" className="rounded-full w-8 h-8 p-0 bg-white/80">
                                <Heart className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="absolute top-3 left-3">
                              <div className="bg-indigo-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                Featured
                              </div>
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold mb-1 line-clamp-1">{product.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                              {product.categories?.name || 'Inspiration'}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-lg">${product.price}</span>
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm">4.{Math.floor(Math.random() * 5) + 3}</span>
                              </div>
                            </div>
                            {product.brand && (
                              <p className="text-xs text-muted-foreground mt-1">by {product.brand}</p>
                            )}
                          </div>
                        </Card>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-12">
                        <Lightbulb className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-muted-foreground">No inspiration items available</p>
                      </div>
                    )}
                  </div>
                </>
              )}
                </motion.div>
            </div>
        </motion.div>
      </main>
    </div>
  )
}
