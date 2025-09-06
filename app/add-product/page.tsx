"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Navigation } from "@/components/ui/navigation"
import { PageHeader } from "@/components/ui/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { X, Plus } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"

interface Category {
  id: string
  name: string
  slug: string
}

export default function AddProductPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [images, setImages] = useState<string[]>([])

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    condition: "",
    brand: "",
    size: "",
    color: "",
    categoryId: "",
  })

  const conditions = [
    { value: "EXCELLENT", label: "Excellent - Like new, no visible wear" },
    { value: "VERY_GOOD", label: "Very Good - Minor signs of wear" },
    { value: "GOOD", label: "Good - Some wear but fully functional" },
    { value: "FAIR", label: "Fair - Noticeable wear but still usable" },
    { value: "POOR", label: "Poor - Significant wear or damage" },
  ]

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }
    fetchCategories()
  }, [user, router])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      const data = await response.json()
      setCategories(data.categories)
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const addImagePlaceholder = () => {
    if (images.length < 5) {
      setImages((prev) => [...prev, `/placeholder.svg?height=300&width=300&text=Product+Image+${prev.length + 1}`])
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.description || !formData.price || !formData.condition || !formData.categoryId) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          images: images.length > 0 ? images : ["/placeholder.svg?height=400&width=400&text=No+Image"],
        }),
      })

      if (response.ok) {
        const data = await response.json()
        toast({
          title: "Product listed successfully!",
          description: "Your item is now live on the marketplace.",
        })
        router.push(`/products/${data.product.id}`)
      } else {
        const error = await response.json()
        throw new Error(error.error || "Failed to create product")
      }
    } catch (error) {
      toast({
        title: "Failed to create listing",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader
          title="List Your Item"
          description="Share your pre-loved treasures with our sustainable community"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-8"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="luxury-card">
              <h2 className="font-heading font-semibold text-2xl text-foreground mb-6">Basic Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Label htmlFor="title" className="text-sm font-medium text-foreground">
                    Title *
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Vintage Hermès Silk Scarf"
                    required
                    className="mt-1"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="description" className="text-sm font-medium text-foreground">
                    Description *
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your item's condition, history, and any special features..."
                    rows={4}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="price" className="text-sm font-medium text-foreground">
                    Price (USD) *
                  </Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="categoryId" className="text-sm font-medium text-foreground">
                    Category *
                  </Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) => handleSelectChange("categoryId", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="luxury-card">
              <h2 className="font-heading font-semibold text-2xl text-foreground mb-6">Product Details</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Label htmlFor="condition" className="text-sm font-medium text-foreground">
                    Condition *
                  </Label>
                  <Select value={formData.condition} onValueChange={(value) => handleSelectChange("condition", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      {conditions.map((condition) => (
                        <SelectItem key={condition.value} value={condition.value}>
                          {condition.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="brand" className="text-sm font-medium text-foreground">
                    Brand
                  </Label>
                  <Input
                    id="brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    placeholder="e.g., Hermès, Apple, IKEA"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="size" className="text-sm font-medium text-foreground">
                    Size
                  </Label>
                  <Input
                    id="size"
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    placeholder="e.g., Medium, 32GB, 10x8 inches"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="color" className="text-sm font-medium text-foreground">
                    Color
                  </Label>
                  <Input
                    id="color"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    placeholder="e.g., Navy Blue, Silver, Natural"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="luxury-card">
              <h2 className="font-heading font-semibold text-2xl text-foreground mb-6">Product Images</h2>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-square bg-card rounded-lg overflow-hidden border border-border"
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}

                {images.length < 5 && (
                  <Button
                    type="button"
                    variant="outline"
                    className="aspect-square border-dashed border-2 luxury-button bg-transparent"
                    onClick={addImagePlaceholder}
                  >
                    <div className="text-center">
                      <Plus className="h-6 w-6 mx-auto mb-2" />
                      <span className="text-sm">Add Image</span>
                    </div>
                  </Button>
                )}
              </div>

              <p className="text-sm text-muted-foreground mt-4">
                Add up to 5 high-quality images. The first image will be your main product photo.
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => router.back()} className="luxury-button">
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="luxury-button">
                {isLoading ? <LoadingSpinner size="sm" className="mr-2" /> : null}
                {isLoading ? "Creating Listing..." : "List Item"}
              </Button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  )
}
