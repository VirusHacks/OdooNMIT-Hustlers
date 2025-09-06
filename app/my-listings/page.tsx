"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Eye, Trash2, MoreHorizontal, TrendingUp, DollarSign } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Navigation } from "@/components/ui/navigation"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface Listing {
  id: string
  title: string
  price: number
  condition: string
  images: string[]
  isActive: boolean
  isSold: boolean
  createdAt: string
  category: {
    name: string
  }
}

export default function MyListingsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMyListings()
  }, [user, router])

  const fetchMyListings = async () => {
    try {
      const response = await fetch("/api/my-listings")
      if (response.ok) {
        const data = await response.json()
        setListings(
          data.listings.map((listing: any) => ({
            ...listing,
            isActive: listing.is_active,
            isSold: listing.is_sold,
            createdAt: listing.created_at,
            category: listing.categories || { name: "Unknown" },
            images: listing.images || [],
          })),
        )
      }
    } catch (error) {
      console.error("Failed to fetch listings:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: !isActive }),
      })

      if (response.ok) {
        setListings((prev) =>
          prev.map((listing) => (listing.id === id ? { ...listing, isActive: !isActive } : listing)),
        )
        toast({
          title: isActive ? "Listing deactivated" : "Listing activated",
          description: `Your listing is now ${!isActive ? "active" : "inactive"}.`,
        })
      }
    } catch (error) {
      toast({
        title: "Failed to update listing",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this listing? This action cannot be undone.")) {
      return
    }

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setListings((prev) => prev.filter((listing) => listing.id !== id))
        toast({
          title: "Listing deleted",
          description: "Your listing has been permanently removed.",
        })
      }
    } catch (error) {
      toast({
        title: "Failed to delete listing",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (listing: Listing) => {
    if (listing.isSold) {
      return (
        <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200">Sold</Badge>
      )
    }
    if (!listing.isActive) {
      return (
        <Badge className="bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-200">Inactive</Badge>
      )
    }
    return <Badge className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200">Active</Badge>
  }

  if (!user) {
    return null
  }

  const activeListings = listings.filter((l) => l.isActive && !l.isSold).length
  const soldListings = listings.filter((l) => l.isSold).length
  const totalRevenue = listings.filter((l) => l.isSold).reduce((sum, l) => sum + l.price, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2"
            >
              My Listings
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-slate-600"
            >
              Manage your products and track their performance
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              asChild
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Link href="/add-product">
                <Plus className="h-4 w-4 mr-2" />
                Add New Listing
              </Link>
            </Button>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 p-6 shadow-lg"
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Active Listings</p>
                <p className="text-2xl font-bold text-slate-800">{activeListings}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 p-6 shadow-lg"
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Items Sold</p>
                <p className="text-2xl font-bold text-slate-800">{soldListings}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 p-6 shadow-lg"
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Total Revenue</p>
                <p className="text-2xl font-bold text-slate-800">${totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : listings.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {listings.map((listing, index) => (
                <motion.div
                  key={listing.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <motion.img
                      src={listing.images[0] || "/placeholder.svg?height=300&width=300"}
                      alt={listing.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-3 left-3">{getStatusBadge(listing)}</div>
                    <div className="absolute top-3 right-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="secondary"
                            size="icon"
                            className="h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-200"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="backdrop-blur-sm bg-white/95 border-slate-200/50">
                          <DropdownMenuItem asChild>
                            <Link href={`/products/${listing.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/edit-product/${listing.id}`}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleActive(listing.id, listing.isActive)}>
                            {listing.isActive ? "Deactivate" : "Activate"}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(listing.id)} className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-lg text-slate-800 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                        {listing.title}
                      </h3>
                      <p className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent ml-2">
                        ${listing.price}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-sm text-slate-600">
                      <span className="px-3 py-1 rounded-full bg-gradient-to-r from-slate-100 to-blue-50 text-xs font-medium">
                        {listing.category.name}
                      </span>
                      <span>{new Date(listing.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center space-x-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        asChild
                        className="flex-1 bg-transparent hover:bg-blue-50 border-slate-200 hover:border-blue-300 transition-all duration-200"
                      >
                        <Link href={`/products/${listing.id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        asChild
                        className="flex-1 bg-transparent hover:bg-blue-50 border-slate-200 hover:border-blue-300 transition-all duration-200"
                      >
                        <Link href={`/edit-product/${listing.id}`}>
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Link>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
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
              <h3 className="text-2xl font-semibold text-slate-800 mb-3">No listings yet</h3>
              <p className="text-slate-600 mb-8 max-w-md mx-auto">
                Start selling by creating your first listing and reach thousands of potential buyers
              </p>
              <Button
                asChild
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Link href="/add-product">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Listing
                </Link>
              </Button>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  )
}
