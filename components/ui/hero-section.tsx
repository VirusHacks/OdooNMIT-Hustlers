"use client"

import { motion } from "framer-motion"
import { Button } from "./button"
import { Search, Sparkles, Recycle, Heart } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-card to-background py-20 lg:py-32">
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1200')] opacity-5 bg-cover bg-center" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-6"
          >
            <div className="flex justify-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
                className="flex items-center space-x-2 bg-secondary/10 px-4 py-2 rounded-full"
              >
                <Sparkles className="h-5 w-5 text-secondary" />
                <span className="text-secondary font-medium">Sustainable Luxury</span>
              </motion.div>
            </div>

            <h1 className="font-heading font-bold text-5xl lg:text-7xl text-foreground leading-tight">
              Discover{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Unique</span>
              <br />
              Pre-Loved Treasures
            </h1>

            <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Give luxury items a second life while reducing environmental impact. Shop sustainably, sell responsibly,
              live beautifully.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button size="lg" asChild className="luxury-button text-lg px-8 py-4">
              <Link href="/browse">
                <Search className="h-5 w-5 mr-2" />
                Start Shopping
              </Link>
            </Button>

            <Button size="lg" variant="outline" asChild className="luxury-button text-lg px-8 py-4 bg-transparent">
              <Link href="/add-product">
                <Recycle className="h-5 w-5 mr-2" />
                Sell Your Items
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto">
                <Heart className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="font-heading font-semibold text-lg">Curated Quality</h3>
              <p className="text-muted-foreground">Every item is carefully vetted for authenticity and condition</p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto">
                <Recycle className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="font-heading font-semibold text-lg">Eco-Friendly</h3>
              <p className="text-muted-foreground">Reduce waste by giving luxury items a second chance</p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="font-heading font-semibold text-lg">Premium Experience</h3>
              <p className="text-muted-foreground">Luxury shopping experience with white-glove service</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
