"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useInView } from "framer-motion"
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
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      duration: 0.6,
    },
  },
}

const statsVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 12,
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

  const heroRef = useRef(null)
  const statsRef = useRef(null)
  const cardsRef = useRef(null)
  const heroInView = useInView(heroRef, { once: true, threshold: 0.3 })
  const statsInView = useInView(statsRef, { once: true, threshold: 0.3 })
  const cardsInView = useInView(cardsRef, { once: true, threshold: 0.1 })

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

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
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
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
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.p className="text-muted-foreground text-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
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

  const stats = [
    { label: "Total Views", value: "2,847", icon: Eye, change: "+12.5%", trend: "up" },
    { label: "Active Listings", value: "8", icon: Package, change: "+2", trend: "up" },
    { label: "Total Sales", value: "$3,240", icon: TrendingUp, change: "+18.2%", trend: "up" },
    { label: "Saved Items", value: "24", icon: Heart, change: "+5", trend: "up" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        <motion.div
          ref={heroRef}
          initial={{ opacity: 0, y: 40 }}
          animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 rounded-3xl blur-3xl" />
          <div className="relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-3xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={heroInView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <Avatar className="h-24 w-24 md:h-32 md:w-32 ring-4 ring-primary/10 shadow-2xl">
                  <AvatarImage src={profile.avatar || undefined} />
                  <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-primary to-accent text-primary-foreground">
                    {profile.name?.charAt(0)?.toUpperCase() || profile.email.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </motion.div>

              <div className="flex-1 space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={heroInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent leading-tight">
                    Welcome back, {profile.name || "there"}!
                  </h1>
                  <p className="text-muted-foreground text-lg md:text-xl mt-3 leading-relaxed">
                    Manage your profile, listings, and orders from your luxury dashboard
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground"
                >
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {profile.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Member since {memberSince}
                  </div>
                  {profile.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {profile.location}
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          ref={statsRef}
          variants={containerVariants}
          initial="hidden"
          animate={statsInView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => (
            <motion.div key={stat.label} variants={statsVariants}>
              <Card className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardContent className="relative p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                      <div className="flex items-center gap-1 text-sm">
                        <TrendingUp className="h-3 w-3 text-emerald-500" />
                        <span className="text-emerald-500 font-medium">{stat.change}</span>
                      </div>
                    </div>
                    <div className="p-3 rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                      <stat.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          ref={cardsRef}
          initial={{ opacity: 0, y: 20 }}
          animate={cardsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <Tabs defaultValue="profile" className="space-y-8">
            <TabsList className="grid w-full grid-cols-4 lg:w-[500px] h-14 p-1 bg-muted/50 backdrop-blur-sm border border-border/50">
              <TabsTrigger
                value="profile"
                className="flex items-center gap-2 h-12 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-lg transition-all duration-300"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger
                value="listings"
                className="flex items-center gap-2 h-12 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-lg transition-all duration-300"
              >
                <Package className="h-4 w-4" />
                <span className="hidden sm:inline">Listings</span>
              </TabsTrigger>
              <TabsTrigger
                value="orders"
                className="flex items-center gap-2 h-12 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-lg transition-all duration-300"
              >
                <ShoppingBag className="h-4 w-4" />
                <span className="hidden sm:inline">Orders</span>
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="flex items-center gap-2 h-12 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-lg transition-all duration-300"
              >
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Settings</span>
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <motion.div variants={cardVariants} initial="hidden" animate="visible">
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500">
                  <CardHeader className="flex flex-row items-center justify-between pb-8">
                    <div className="space-y-2">
                      <CardTitle className="text-2xl font-bold">Profile Information</CardTitle>
                      <CardDescription className="text-base">
                        Manage your personal information and public profile
                      </CardDescription>
                    </div>
                    {!isEditing ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                        className="h-10 px-6 bg-background/50 backdrop-blur-sm border-border/50 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
                      >
                        <Edit3 className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    ) : (
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsEditing(false)}
                          className="h-10 px-6 bg-background/50 backdrop-blur-sm border-border/50 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-all duration-300"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleSaveProfile}
                          disabled={isSaving}
                          className="h-10 px-6 bg-primary hover:bg-primary/90 transition-all duration-300"
                        >
                          {isSaving ? <LoadingSpinner size="sm" className="mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                          Save
                        </Button>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <Label htmlFor="name" className="text-sm font-medium">
                          Full Name
                        </Label>
                        {isEditing ? (
                          <Input
                            id="name"
                            value={editForm.name}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                            placeholder="Enter your full name"
                            className="h-12 bg-background/50 border-border/50 focus:border-primary transition-all duration-300"
                          />
                        ) : (
                          <p className="text-foreground py-3 text-lg">{profile.name || "Not provided"}</p>
                        )}
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="location" className="text-sm font-medium">
                          Location
                        </Label>
                        {isEditing ? (
                          <Input
                            id="location"
                            value={editForm.location}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, location: e.target.value }))}
                            placeholder="Enter your location"
                            className="h-12 bg-background/50 border-border/50 focus:border-primary transition-all duration-300"
                          />
                        ) : (
                          <div className="flex items-center py-3">
                            {profile.location ? (
                              <>
                                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span className="text-lg">{profile.location}</span>
                              </>
                            ) : (
                              <span className="text-muted-foreground text-lg">Not provided</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="bio" className="text-sm font-medium">
                        Bio
                      </Label>
                      {isEditing ? (
                        <Textarea
                          id="bio"
                          value={editForm.bio}
                          onChange={(e) => setEditForm((prev) => ({ ...prev, bio: e.target.value }))}
                          placeholder="Tell us about yourself..."
                          rows={4}
                          className="bg-background/50 border-border/50 focus:border-primary transition-all duration-300 resize-none"
                        />
                      ) : (
                        <p className="text-foreground py-3 min-h-[120px] text-lg leading-relaxed">
                          {profile.bio || "No bio provided yet."}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Listings Tab */}
            <TabsContent value="listings" className="space-y-6">
              <motion.div variants={cardVariants} initial="hidden" animate="visible">
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold">Your Listings</CardTitle>
                    <CardDescription className="text-base">Manage your active and sold items</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-16">
                      <div className="p-6 rounded-full bg-muted/50 w-fit mx-auto mb-6">
                        <Package className="h-12 w-12 text-muted-foreground" />
                      </div>
                      <h3 className="font-bold text-xl mb-3">No listings yet</h3>
                      <p className="text-muted-foreground mb-8 text-lg">Start selling by creating your first listing</p>
                      <Button asChild className="h-12 px-8 bg-primary hover:bg-primary/90 transition-all duration-300">
                        <Link href="/add-product">Create Listing</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-6">
              <motion.div variants={cardVariants} initial="hidden" animate="visible">
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold">Order History</CardTitle>
                    <CardDescription className="text-base">View your purchase history and order status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-16">
                      <div className="p-6 rounded-full bg-muted/50 w-fit mx-auto mb-6">
                        <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                      </div>
                      <h3 className="font-bold text-xl mb-3">No orders yet</h3>
                      <p className="text-muted-foreground mb-8 text-lg">Start shopping to see your orders here</p>
                      <Button asChild className="h-12 px-8 bg-primary hover:bg-primary/90 transition-all duration-300">
                        <Link href="/browse">Browse Items</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <motion.div variants={cardVariants} initial="hidden" animate="visible">
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold">Account Settings</CardTitle>
                    <CardDescription className="text-base">
                      Manage your account preferences and security
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-6 border border-border/50 rounded-2xl bg-background/30 backdrop-blur-sm hover:bg-background/50 transition-all duration-300">
                        <div className="space-y-1">
                          <h4 className="font-semibold text-lg">Email Address</h4>
                          <p className="text-muted-foreground">{profile.email}</p>
                        </div>
                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-emerald-200">
                          Verified
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between p-6 border border-border/50 rounded-2xl bg-background/30 backdrop-blur-sm hover:bg-background/50 transition-all duration-300">
                        <div className="space-y-1">
                          <h4 className="font-semibold text-lg">Password</h4>
                          <p className="text-muted-foreground">Last updated recently</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-10 px-6 bg-background/50 border-border/50 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
                        >
                          Change Password
                        </Button>
                      </div>

                      <div className="pt-8 border-t border-border/50">
                        <Button
                          variant="destructive"
                          onClick={handleLogout}
                          className="h-12 px-8 bg-destructive hover:bg-destructive/90 transition-all duration-300"
                        >
                          Sign Out
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  )
}
