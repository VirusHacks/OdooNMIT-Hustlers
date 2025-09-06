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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`group luxury-card ${className}`}
    >
      <Link href={`/products/${id}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-lg mb-4">
          <Image
            src={images[0] || "/placeholder.svg?height=300&width=300"}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="text-xs font-medium">
              {condition.replace("_", " ")}
            </Badge>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="font-heading font-semibold text-lg text-foreground line-clamp-2 group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="font-heading font-bold text-xl text-primary ml-2">${price}</p>
          </div>

          {brand && <p className="text-sm text-muted-foreground font-medium">{brand}</p>}

          <div className="flex items-center justify-between pt-2">
            <div className="text-sm text-muted-foreground">
              <p className="font-medium">{seller.name}</p>
              {seller.location && <p className="text-xs">{seller.location}</p>}
            </div>

            <Button
              size="sm"
              className="luxury-button opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              Add to Cart
            </Button>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
