"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Navigation } from "@/components/ui/navigation"
import { PageHeader } from "@/components/ui/page-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Plus, Edit, Eye, Trash2, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
        // Map backend listings to expected frontend structure
        setListings(
          data.listings.map((listing: any) => ({
            ...listing,
            isActive: listing.is_active,
            isSold: listing.is_sold,
            createdAt: listing.created_at,
            category: listing.categories || { name: "Unknown" },
            images: listing.images || [],
          }))
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

  if (!user) {
    return null
  }

  const getStatusBadge = (listing: Listing) => {
    if (listing.isSold) {
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          Sold
        </Badge>
      )
    }
    if (!listing.isActive) {
      return (
        <Badge variant="secondary" className="bg-gray-100 text-gray-800">
          Inactive
        </Badge>
      )
    }
    return (
      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
        Active
      </Badge>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader title="My Listings" description="Manage your products and track their performance">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              asChild
              className="luxury-button bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Link href="/add-product">
                <Plus className="h-4 w-4 mr-2" />
                Add New Listing
              </Link>
            </Button>
          </motion.div>
        </PageHeader>

        <div className="mt-8">
          {loading ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </motion.div>
          ) : listings.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {listings.map((listing, index) => (
                <motion.div
                  key={listing.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className="luxury-card group hover:shadow-2xl transition-all duration-300 backdrop-blur-sm bg-card/80 border border-border/50"
                >
                  <div className="relative aspect-square overflow-hidden rounded-lg mb-4">
                    <motion.img
                      src={listing.images[0] || "/placeholder.svg?height=300&width=300"}
                      alt={listing.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                      className="absolute top-3 left-3"
                    >
                      {getStatusBadge(listing)}
                    </motion.div>
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
                        <DropdownMenuContent align="end" className="backdrop-blur-sm bg-card/95 border-border/50">
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
                          <DropdownMenuItem onClick={() => handleDelete(listing.id)} className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="font-heading font-semibold text-lg text-foreground line-clamp-2 group-hover:text-primary transition-colors duration-200">
                        {listing.title}
                      </h3>
                      <motion.p
                        className="font-heading font-bold text-xl text-primary ml-2"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        ${listing.price}
                      </motion.p>
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span className="px-2 py-1 rounded-full bg-muted/50 text-xs font-medium">
                        {listing.category.name}
                      </span>
                      <span>{new Date(listing.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center space-x-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        asChild
                        className="flex-1 luxury-button bg-transparent hover:bg-primary/5 border-border/50"
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
                        className="flex-1 luxury-button bg-transparent hover:bg-primary/5 border-border/50"
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
              className="text-center py-16"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                className="text-8xl mb-6 opacity-60"
              >
                📦
              </motion.div>
              <h3 className="font-heading font-semibold text-2xl text-foreground mb-3">No listings yet</h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
                Start selling by creating your first listing and reach thousands of potential buyers
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  asChild
                  className="luxury-button bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl"
                >
                  <Link href="/add-product">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Listing
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  )
}
