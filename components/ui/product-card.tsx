"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart } from "lucide-react"
import { Button } from "./button"
import { Badge } from "./badge"

interface ProductCardProps {
  id: string
  title: string
  price: number
  condition: string
  brand?: string
  images: string[]
  seller: {
    name: string
    location?: string
  }
  className?: string
}

export function ProductCard({ id, title, price, condition, brand, images, seller, className = "" }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
      className={`group relative ${className}`}
    >
      <Link href={`/products/${id}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-sm mb-6 bg-neutral-50">
          <Image
            src={images[0] || "/placeholder.svg?height=400&width=320"}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
          />
          
          {/* Condition Badge */}
          <div className="absolute top-4 left-4">
            <Badge 
              variant="secondary" 
              className="text-[10px] font-medium tracking-wide uppercase px-2.5 py-1 bg-white/90 text-neutral-700 border-0 backdrop-blur-sm"
            >
              {condition.replace("_", " ")}
            </Badge>
          </div>

          {/* Wishlist Button */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out">
            <Button 
              size="icon" 
              variant="secondary" 
              className="h-9 w-9 rounded-full bg-white/90 hover:bg-white border-0 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200"
            >
              <Heart className="h-4 w-4 text-neutral-600" />
            </Button>
          </div>

          {/* Quick Add Button - appears on hover */}
          <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out transform translate-y-2 group-hover:translate-y-0">
            <Button
              className="w-full h-11 bg-neutral-900 hover:bg-neutral-800 text-white border-0 rounded-sm font-medium text-sm tracking-wide transition-all duration-200"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Quick Add
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-3">
          {/* Brand */}
          {brand && (
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-widest">
              {brand}
            </p>
          )}

          {/* Title and Price */}
          <div className="space-y-2">
            <h3 className="font-normal text-base text-neutral-900 leading-tight line-clamp-2 group-hover:text-neutral-700 transition-colors duration-200">
              {title}
            </h3>
            <p className="font-medium text-lg text-neutral-900">
              ${price.toLocaleString()}
            </p>
          </div>

          {/* Seller Info */}
          <div className="pt-1 border-t border-neutral-100">
            <div className="flex items-center justify-between">
              <div className="text-xs text-neutral-500 space-y-0.5">
                <p className="font-medium">{seller.name}</p>
                {seller.location && (
                  <p className="text-neutral-400">{seller.location}</p>
                )}
              </div>
              
              {/* Secondary CTA */}
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-3 text-xs font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out"
              >
                View Details
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}