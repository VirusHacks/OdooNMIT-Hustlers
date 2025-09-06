"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "./button"
import { Avatar, AvatarFallback } from "./avatar"
import { Search, Heart, ShoppingCart, Plus, Menu, X, Leaf } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu"

export function Navigation() {
  const { user, logout } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="p-2 bg-primary rounded-lg"
            >
              <Leaf className="h-6 w-6 text-primary-foreground" />
            </motion.div>
            <span className="font-heading font-bold text-2xl text-primary group-hover:text-secondary transition-colors">
              EcoFinds
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/browse" className="text-foreground hover:text-primary transition-colors font-medium">
              Browse
            </Link>
            <Link href="/categories" className="text-foreground hover:text-primary transition-colors font-medium">
              Categories
            </Link>
            <Link href="/how-it-works" className="text-foreground hover:text-primary transition-colors font-medium">
              How It Works
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search for items..."
                className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Button variant="ghost" size="icon" className="luxury-button">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="luxury-button">
                    <Link href="/cart"> <ShoppingCart className="h-5 w-5" /></Link>
                </Button>
                <Button asChild className="luxury-button hidden md:flex">
                  <Link href="/add-product">
                    <Plus className="h-4 w-4 mr-2" />
                    Sell Item
                  </Link>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="luxury-button">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-secondary text-secondary-foreground">
                          {user.name?.[0] || user.email[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/my-listings">My Listings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/orders">Orders</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>Sign Out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild className="luxury-button">
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild className="luxury-button">
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden luxury-button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-background border-t border-border"
          >
            <div className="px-4 py-4 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search for items..."
                  className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
              </div>

              <div className="space-y-2">
                <Link
                  href="/browse"
                  className="block py-2 text-foreground hover:text-primary transition-colors font-medium"
                >
                  Browse
                </Link>
                <Link
                  href="/categories"
                  className="block py-2 text-foreground hover:text-primary transition-colors font-medium"
                >
                  Categories
                </Link>
                <Link
                  href="/how-it-works"
                  className="block py-2 text-foreground hover:text-primary transition-colors font-medium"
                >
                  How It Works
                </Link>
              </div>

              {user && (
                <Button asChild className="w-full luxury-button">
                  <Link href="/add-product">
                    <Plus className="h-4 w-4 mr-2" />
                    Sell Item
                  </Link>
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
