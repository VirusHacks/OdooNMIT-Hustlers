"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Navigation } from "@/components/ui/navigation"
import {
  User,
  Settings,
  Package,
  ShoppingBag,
  MapPin,
  Mail,
  Calendar,
  Edit3,
  Save,
  X,
  TrendingUp,
  Eye,
  Heart,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

interface UserProfile {
  id: string
  email: string
  name: string | null
  avatar: string | null
  bio: string | null
  location: string | null
  createdAt: string
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

const statsVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
}

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [editForm, setEditForm] = useState({
    name: "",
    bio: "",
    location: "",
  })

  const heroRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  useEffect(() => {
    if (!isLoading && profile) {
      const ctx = gsap.context(() => {
        // Hero section animation
        gsap.fromTo(
          heroRef.current,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
          },
        )

        // Stats cards stagger animation
        gsap.fromTo(
          ".stat-card",
          { opacity: 0, y: 30, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "back.out(1.7)",
            delay: 0.3,
          },
        )

        // Main cards scroll trigger
        gsap.fromTo(
          ".main-card",
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse",
            },
          },
        )
      })

      return () => ctx.revert()
    }
  }, [isLoading, profile])

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/user/profile")
      if (response.ok) {
        const data = await response.json()
        setProfile(data.profile)
        setEditForm({
          name: data.profile.name || "",
          bio: data.profile.bio || "",
          location: data.profile.location || "",
        })
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    setIsSaving(true)
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      })

      if (response.ok) {
        const data = await response.json()
        setProfile(data.profile)
        setIsEditing(false)
        toast({
          title: "Profile updated",
          description: "Your profile has been successfully updated.",
        })
      } else {
        throw new Error("Failed to update profile")
      }
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update your profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <LoadingSpinner size="lg" />
          </motion.div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-slate-600 dark:text-slate-400 text-lg"
          >
            Failed to load profile
          </motion.p>
        </div>
      </div>
    )
  }

  const memberSince = new Date(profile.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-12">
          <motion.div ref={heroRef} variants={cardVariants} className="text-center space-y-6">
            <div className="relative">
              <motion.h1
                className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-slate-900 dark:text-white mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                Welcome back,
              </motion.h1>
              <motion.span
                className="text-5xl md:text-6xl lg:text-7xl font-semibold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                {profile.name || "there"}
              </motion.span>
            </div>
            <motion.p
              className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Your personalized dashboard for managing listings, orders, and profile settings
            </motion.p>
          </motion.div>

          <motion.div ref={statsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <motion.div
              variants={statsVariants}
              className="stat-card group relative overflow-hidden rounded-2xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 p-8 hover:shadow-2xl hover:shadow-slate-900/10 dark:hover:shadow-slate-100/5 transition-all duration-500 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-blue-500/10 dark:bg-blue-400/10">
                    <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">0</h3>
                <p className="text-slate-600 dark:text-slate-400 font-medium">Active Listings</p>
              </div>
            </motion.div>

            <motion.div
              variants={statsVariants}
              className="stat-card group relative overflow-hidden rounded-2xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 p-8 hover:shadow-2xl hover:shadow-slate-900/10 dark:hover:shadow-slate-100/5 transition-all duration-500 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-green-500/10 dark:bg-green-400/10">
                    <ShoppingBag className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <Eye className="h-5 w-5 text-slate-400" />
                </div>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">0</h3>
                <p className="text-slate-600 dark:text-slate-400 font-medium">Total Orders</p>
              </div>
            </motion.div>

            <motion.div
              variants={statsVariants}
              className="stat-card group relative overflow-hidden rounded-2xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 p-8 hover:shadow-2xl hover:shadow-slate-900/10 dark:hover:shadow-slate-100/5 transition-all duration-500 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-purple-500/10 dark:bg-purple-400/10">
                    <Heart className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <Calendar className="h-5 w-5 text-slate-400" />
                </div>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{memberSince}</h3>
                <p className="text-slate-600 dark:text-slate-400 font-medium">Member Since</p>
              </div>
            </motion.div>
          </motion.div>

          <Tabs defaultValue="profile" className="space-y-8">
            <div className="flex justify-center">
              <TabsList className="grid w-full max-w-2xl grid-cols-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-2">
                <TabsTrigger
                  value="profile"
                  className="flex items-center gap-2 rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-lg transition-all duration-300"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Profile</span>
                </TabsTrigger>
                <TabsTrigger
                  value="listings"
                  className="flex items-center gap-2 rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-lg transition-all duration-300"
                >
                  <Package className="h-4 w-4" />
                  <span className="hidden sm:inline">Listings</span>
                </TabsTrigger>
                <TabsTrigger
                  value="orders"
                  className="flex items-center gap-2 rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-lg transition-all duration-300"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span className="hidden sm:inline">Orders</span>
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className="flex items-center gap-2 rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-lg transition-all duration-300"
                >
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">Settings</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <div ref={cardsRef}>
              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-6">
                <motion.div variants={cardVariants}>
                  <Card className="main-card relative overflow-hidden rounded-3xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-white/50 dark:from-slate-800/50 dark:to-slate-900/50" />
                    <CardHeader className="relative flex flex-row items-center justify-between pb-8">
                      <div>
                        <CardTitle className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">
                          Profile Information
                        </CardTitle>
                        <CardDescription className="text-slate-600 dark:text-slate-400">
                          Manage your personal information and public profile
                        </CardDescription>
                      </div>
                      <AnimatePresence mode="wait">
                        {!isEditing ? (
                          <motion.div
                            key="edit"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setIsEditing(true)}
                              className="rounded-xl border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-700 transition-all duration-300"
                            >
                              <Edit3 className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="save"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                            className="flex gap-3"
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setIsEditing(false)}
                              className="rounded-xl border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-700 transition-all duration-300"
                            >
                              <X className="h-4 w-4 mr-2" />
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              onClick={handleSaveProfile}
                              disabled={isSaving}
                              className="rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition-all duration-300"
                            >
                              {isSaving ? (
                                <LoadingSpinner size="sm" className="mr-2" />
                              ) : (
                                <Save className="h-4 w-4 mr-2" />
                              )}
                              Save
                            </Button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardHeader>
                    <CardContent className="relative space-y-8">
                      <motion.div
                        className="flex flex-col sm:flex-row items-center sm:items-start space-y-6 sm:space-y-0 sm:space-x-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <div className="relative group">
                          <Avatar className="h-32 w-32 ring-4 ring-white dark:ring-slate-700 shadow-xl">
                            <AvatarImage src={profile.avatar || undefined} />
                            <AvatarFallback className="text-3xl font-semibold bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 text-slate-700 dark:text-slate-200">
                              {profile.name?.charAt(0)?.toUpperCase() || profile.email.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <div className="space-y-4 text-center sm:text-left">
                          <h3 className="text-3xl font-semibold text-slate-900 dark:text-white">
                            {profile.name || "Anonymous User"}
                          </h3>
                          <div className="space-y-3">
                            <div className="flex items-center justify-center sm:justify-start text-slate-600 dark:text-slate-400">
                              <Mail className="h-5 w-5 mr-3" />
                              <span className="font-medium">{profile.email}</span>
                            </div>
                            <div className="flex items-center justify-center sm:justify-start text-slate-600 dark:text-slate-400">
                              <Calendar className="h-5 w-5 mr-3" />
                              <span>Member since {memberSince}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <motion.div
                          className="space-y-3"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <Label htmlFor="name" className="text-slate-700 dark:text-slate-300 font-medium">
                            Full Name
                          </Label>
                          {isEditing ? (
                            <Input
                              id="name"
                              value={editForm.name}
                              onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                              placeholder="Enter your full name"
                              className="rounded-xl border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm focus:bg-white dark:focus:bg-slate-800 transition-all duration-300"
                            />
                          ) : (
                            <p className="text-slate-900 dark:text-white py-3 px-4 rounded-xl bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50">
                              {profile.name || "Not provided"}
                            </p>
                          )}
                        </motion.div>

                        <motion.div
                          className="space-y-3"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          <Label htmlFor="location" className="text-slate-700 dark:text-slate-300 font-medium">
                            Location
                          </Label>
                          {isEditing ? (
                            <Input
                              id="location"
                              value={editForm.location}
                              onChange={(e) => setEditForm((prev) => ({ ...prev, location: e.target.value }))}
                              placeholder="Enter your location"
                              className="rounded-xl border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm focus:bg-white dark:focus:bg-slate-800 transition-all duration-300"
                            />
                          ) : (
                            <div className="py-3 px-4 rounded-xl bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50">
                              {profile.location ? (
                                <div className="flex items-center text-slate-900 dark:text-white">
                                  <MapPin className="h-4 w-4 mr-2 text-slate-500 dark:text-slate-400" />
                                  {profile.location}
                                </div>
                              ) : (
                                <span className="text-slate-500 dark:text-slate-400">Not provided</span>
                              )}
                            </div>
                          )}
                        </motion.div>
                      </div>

                      <motion.div
                        className="space-y-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <Label htmlFor="bio" className="text-slate-700 dark:text-slate-300 font-medium">
                          Bio
                        </Label>
                        {isEditing ? (
                          <Textarea
                            id="bio"
                            value={editForm.bio}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, bio: e.target.value }))}
                            placeholder="Tell us about yourself..."
                            rows={4}
                            className="rounded-xl border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm focus:bg-white dark:focus:bg-slate-800 transition-all duration-300 resize-none"
                          />
                        ) : (
                          <p className="text-slate-900 dark:text-white py-4 px-4 rounded-xl bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 min-h-[120px] leading-relaxed">
                            {profile.bio || "No bio provided yet."}
                          </p>
                        )}
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* Listings Tab */}
              <TabsContent value="listings" className="space-y-6">
                <motion.div variants={cardVariants}>
                  <Card className="main-card relative overflow-hidden rounded-3xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-white/50 dark:from-slate-800/50 dark:to-slate-900/50" />
                    <CardHeader className="relative">
                      <CardTitle className="text-2xl font-semibold text-slate-900 dark:text-white">
                        Your Listings
                      </CardTitle>
                      <CardDescription className="text-slate-600 dark:text-slate-400">
                        Manage your active and sold items
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="relative">
                      <div className="text-center py-16">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2, duration: 0.5 }}
                          className="mb-6"
                        >
                          <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-400/10 dark:to-purple-400/10 flex items-center justify-center mb-6">
                            <Package className="h-12 w-12 text-slate-400 dark:text-slate-500" />
                          </div>
                        </motion.div>
                        <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">No listings yet</h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto leading-relaxed">
                          Start selling by creating your first listing and reach thousands of potential buyers
                        </p>
                        <Button
                          asChild
                          className="rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 px-8 py-3 transition-all duration-300 hover:shadow-lg"
                        >
                          <Link href="/add-product">Create Listing</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* Orders Tab */}
              <TabsContent value="orders" className="space-y-6">
                <motion.div variants={cardVariants}>
                  <Card className="main-card relative overflow-hidden rounded-3xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-white/50 dark:from-slate-800/50 dark:to-slate-900/50" />
                    <CardHeader className="relative">
                      <CardTitle className="text-2xl font-semibold text-slate-900 dark:text-white">
                        Order History
                      </CardTitle>
                      <CardDescription className="text-slate-600 dark:text-slate-400">
                        View your purchase history and order status
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="relative">
                      <div className="text-center py-16">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2, duration: 0.5 }}
                          className="mb-6"
                        >
                          <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 dark:from-green-400/10 dark:to-emerald-400/10 flex items-center justify-center mb-6">
                            <ShoppingBag className="h-12 w-12 text-slate-400 dark:text-slate-500" />
                          </div>
                        </motion.div>
                        <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">No orders yet</h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto leading-relaxed">
                          Start shopping to see your orders here and track your purchases
                        </p>
                        <Button
                          asChild
                          className="rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 px-8 py-3 transition-all duration-300 hover:shadow-lg"
                        >
                          <Link href="/browse">Browse Items</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-6">
                <motion.div variants={cardVariants}>
                  <Card className="main-card relative overflow-hidden rounded-3xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-white/50 dark:from-slate-800/50 dark:to-slate-900/50" />
                    <CardHeader className="relative">
                      <CardTitle className="text-2xl font-semibold text-slate-900 dark:text-white">
                        Account Settings
                      </CardTitle>
                      <CardDescription className="text-slate-600 dark:text-slate-400">
                        Manage your account preferences and security
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="relative space-y-6">
                      <div className="space-y-4">
                        <motion.div
                          className="flex items-center justify-between p-6 border border-slate-200/50 dark:border-slate-700/50 rounded-2xl bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all duration-300"
                          whileHover={{ scale: 1.02 }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                          <div>
                            <h4 className="font-semibold text-slate-900 dark:text-white mb-1">Email Address</h4>
                            <p className="text-slate-600 dark:text-slate-400">{profile.email}</p>
                          </div>
                          <Badge
                            variant="secondary"
                            className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800"
                          >
                            Verified
                          </Badge>
                        </motion.div>

                        <motion.div
                          className="flex items-center justify-between p-6 border border-slate-200/50 dark:border-slate-700/50 rounded-2xl bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all duration-300"
                          whileHover={{ scale: 1.02 }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                          <div>
                            <h4 className="font-semibold text-slate-900 dark:text-white mb-1">Password</h4>
                            <p className="text-slate-600 dark:text-slate-400">Last updated recently</p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-xl border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-700 transition-all duration-300"
                          >
                            Change Password
                          </Button>
                        </motion.div>

                        <div className="pt-8 border-t border-slate-200/50 dark:border-slate-700/50">
                          <Button
                            variant="destructive"
                            onClick={handleLogout}
                            className="rounded-xl bg-red-500 hover:bg-red-600 text-white transition-all duration-300 hover:shadow-lg"
                          >
                            Sign Out
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            </div>
          </Tabs>
        </motion.div>
      </main>
    </div>
  )
}
