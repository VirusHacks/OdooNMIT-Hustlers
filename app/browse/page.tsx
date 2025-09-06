"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Navigation } from "@/components/ui/navigation"
import { ProductCard } from "@/components/ui/product-card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Search, Grid3X3, List, X, Filter } from "lucide-react"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

interface Product {
  id: string
  title: string
  price: number
  condition: string
  brand?: string
  images: string[]
  seller: {
    id: string
    name: string
    location?: string
  }
  category: {
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
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedCondition, setSelectedCondition] = useState("")
  const [sortBy, setSortBy] = useState("created_at")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const gridRef = useRef<HTMLDivElement>(null)
  const sidebarRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [searchTerm, selectedCategory, selectedCondition, sortBy, currentPage, priceRange])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      const data = await response.json()
      setCategories(data.categories)
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    }
  }

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "12",
        ...(searchTerm && { search: searchTerm }),
        ...(selectedCategory && { category: selectedCategory }),
        ...(selectedCondition && { condition: selectedCondition }),
        sortBy,
        sortOrder: sortBy === "price" ? "asc" : "desc",
        minPrice: priceRange[0].toString(),
        maxPrice: priceRange[1].toString(),
      })

      const response = await fetch(`/api/products?${params}`)
      const data = await response.json()
      setProducts(
        data.products.map((p: any) => ({
          ...p,
          seller: p.users,
          category: p.categories,
        })),
      )
      setTotalPages(data.pagination.pages)
    } catch (error) {
      console.error("Failed to fetch products:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchProducts()
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("")
    setSelectedCondition("")
    setSortBy("created_at")
    setPriceRange([0, 10000])
    setCurrentPage(1)
  }

  const activeFiltersCount =
    [searchTerm, selectedCategory, selectedCondition].filter(Boolean).length +
    (priceRange[0] > 0 || priceRange[1] < 10000 ? 1 : 0)

  useEffect(() => {
    if (typeof window !== "undefined" && gridRef.current) {
      const cards = gridRef.current.querySelectorAll(".product-card")

      gsap.fromTo(
        cards,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      )
    }
  }, [products])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/50">
      <Navigation />

      <div className="flex">
        <motion.aside
          ref={sidebarRef}
          className="hidden lg:block w-80 min-h-screen bg-white/80 backdrop-blur-xl border-r border-slate-200/60 sticky top-0"
          initial={{ x: -320, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="p-8 space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 mb-2">Filters</h2>
              <p className="text-sm text-slate-600">Refine your search</p>
            </div>

            {/* Category Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-3"
            >
              <label className="text-sm font-semibold text-slate-700">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="h-12 border-slate-200 bg-white/60 backdrop-blur-sm hover:bg-white transition-all duration-200 focus:ring-2 focus:ring-slate-900/10">
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
            </motion.div>

            {/* Price Range Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <label className="text-sm font-semibold text-slate-700">Price Range</label>
              <div className="px-2">
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={10000}
                  min={0}
                  step={50}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-2">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
            </motion.div>

            {/* Condition Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-3"
            >
              <label className="text-sm font-semibold text-slate-700">Condition</label>
              <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                <SelectTrigger className="h-12 border-slate-200 bg-white/60 backdrop-blur-sm hover:bg-white transition-all duration-200 focus:ring-2 focus:ring-slate-900/10">
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
            </motion.div>

            {/* Sort Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-3"
            >
              <label className="text-sm font-semibold text-slate-700">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-12 border-slate-200 bg-white/60 backdrop-blur-sm hover:bg-white transition-all duration-200 focus:ring-2 focus:ring-slate-900/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
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
                transition={{ delay: 0.5 }}
              >
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="w-full h-12 border-slate-200 hover:bg-slate-50 transition-all duration-200 bg-transparent"
                >
                  Clear All Filters
                </Button>
              </motion.div>
            )}
          </div>
        </motion.aside>

        <main className="flex-1 min-h-screen">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
            {/* Header */}
            <motion.div
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
                Discover Premium Products
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
                Explore our curated collection of luxury, pre-loved items from trusted sellers
              </p>
            </motion.div>

            <motion.div
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <form onSubmit={handleSearch} className="relative max-w-2xl">
                <div className="flex gap-4">
                  <motion.div
                    className="flex-1 relative group"
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-slate-600 transition-colors duration-200" />
                    <Input
                      type="text"
                      placeholder="Search for luxury items, brands, or collections..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-14 pr-12 h-16 text-lg bg-white/80 backdrop-blur-sm border-slate-200 rounded-2xl focus:bg-white focus:shadow-2xl focus:shadow-slate-900/10 focus:border-slate-300 transition-all duration-300"
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
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      type="submit"
                      size="lg"
                      className="h-16 px-8 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      Search
                    </Button>
                  </motion.div>
                </div>
              </form>
            </motion.div>

            <div className="lg:hidden mb-8">
              <Button
                variant="outline"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="h-12 px-6 border-slate-200 bg-white/80 backdrop-blur-sm relative"
              >
                <Filter className="h-5 w-5 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-slate-900">
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
                    {/* Mobile filter controls - same as sidebar but in grid layout */}
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-slate-700">Category</label>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="h-12 border-slate-200">
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
                        <SelectTrigger className="h-12 border-slate-200">
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
                <span className="text-slate-600">{loading ? "Loading..." : `${products.length} products found`}</span>
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                    {activeFiltersCount} filter{activeFiltersCount > 1 ? "s" : ""} applied
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-10 w-10 p-0"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="h-10 w-10 p-0"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>

            <div ref={gridRef}>
              {loading ? (
                <div className="flex justify-center py-20">
                  <LoadingSpinner size="lg" />
                </div>
              ) : products.length > 0 ? (
                <>
                  <div
                    className={`grid gap-8 ${
                      viewMode === "grid"
                        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                        : "grid-cols-1 max-w-4xl"
                    }`}
                  >
                    {products.map((product, index) => (
                      <div key={product.id} className="product-card">
                        <ProductCard {...product} />
                      </div>
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
                        className="h-12 px-6 border-slate-200 hover:bg-slate-50"
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
                            className="h-12 w-12 border-slate-200 hover:bg-slate-50"
                          >
                            {page}
                          </Button>
                        )
                      })}

                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="h-12 px-6 border-slate-200 hover:bg-slate-50"
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
                      className="bg-slate-900 hover:bg-slate-800 text-white h-12 px-8 rounded-xl"
                    >
                      Explore All Products
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
