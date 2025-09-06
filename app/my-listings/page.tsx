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
    if (!user) {
      router.push("/login")
      return
    }
    fetchMyListings()
  }, [user, router])

  const fetchMyListings = async () => {
    try {
      const response = await fetch("/api/my-listings")
      if (response.ok) {
        const data = await response.json()
        setListings(data.listings)
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
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader title="My Listings" description="Manage your products and track their performance">
          <Button asChild className="luxury-button">
            <Link href="/add-product">
              <Plus className="h-4 w-4 mr-2" />
              Add New Listing
            </Link>
          </Button>
        </PageHeader>

        <div className="mt-8">
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : listings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <motion.div
                  key={listing.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="luxury-card"
                >
                  <div className="relative aspect-square overflow-hidden rounded-lg mb-4">
                    <img
                      src={listing.images[0] || "/placeholder.svg?height=300&width=300"}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">{getStatusBadge(listing)}</div>
                    <div className="absolute top-3 right-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
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

                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 className="font-heading font-semibold text-lg text-foreground line-clamp-2">
                        {listing.title}
                      </h3>
                      <p className="font-heading font-bold text-xl text-primary ml-2">${listing.price}</p>
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{listing.category.name}</span>
                      <span>{new Date(listing.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center space-x-2 pt-2">
                      <Button size="sm" variant="outline" asChild className="flex-1 luxury-button bg-transparent">
                        <Link href={`/products/${listing.id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Link>
                      </Button>
                      <Button size="sm" variant="outline" asChild className="flex-1 luxury-button bg-transparent">
                        <Link href={`/edit-product/${listing.id}`}>
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Link>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="font-heading font-semibold text-2xl text-foreground mb-2">No listings yet</h3>
              <p className="text-muted-foreground mb-6">Start selling by creating your first listing</p>
              <Button asChild className="luxury-button">
                <Link href="/add-product">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Listing
                </Link>
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
