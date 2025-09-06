"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, MapPin } from "lucide-react"
import { useState } from "react"

interface ProductCardProps {
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

export function ProductCard({ id, title, price, condition, brand, images, seller, category }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const conditionColors = {
    EXCELLENT: "bg-emerald-100 text-emerald-800 border-emerald-200",
    VERY_GOOD: "bg-blue-100 text-blue-800 border-blue-200",
    GOOD: "bg-yellow-100 text-yellow-800 border-yellow-200",
    FAIR: "bg-orange-100 text-orange-800 border-orange-200",
    POOR: "bg-red-100 text-red-800 border-red-200",
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group luxury-card overflow-hidden cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        {!imageLoaded && <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />}
        <img
          src={images[0] || `/placeholder.svg?height=300&width=300&query=${encodeURIComponent(title)}`}
          alt={title}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
        />

        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300">
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <Button
              size="sm"
              variant="secondary"
              className="h-8 w-8 p-0 bg-white/90 hover:bg-white backdrop-blur-sm"
              onClick={(e) => {
                e.stopPropagation()
                setIsLiked(!isLiked)
              }}
            >
              <Heart className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
            </Button>
          </div>
        </div>

        {/* Condition Badge */}
        <div className="absolute top-3 left-3">
          <Badge
            variant="secondary"
            className={`text-xs font-medium backdrop-blur-sm ${conditionColors[condition as keyof typeof conditionColors] || conditionColors.GOOD}`}
          >
            {condition.replace("_", " ")}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Category */}
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs text-muted-foreground">
            {category.name}
          </Badge>
          {brand && <span className="text-xs font-medium text-muted-foreground">{brand}</span>}
        </div>

        {/* Title */}
        <h3 className="font-heading font-semibold text-lg text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>

        {/* Price */}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-foreground">${price.toLocaleString()}</span>
        </div>

        {/* Seller Info */}
        <div className="flex items-center gap-2 pt-2 border-t border-border/50">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{seller.name}</p>
            {seller.location && (
              <div className="flex items-center gap-1 mt-1">
                <MapPin className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground truncate">{seller.location}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
