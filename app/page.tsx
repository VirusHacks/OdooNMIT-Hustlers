"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  Star,
  Users,
  ShoppingBag,
  Leaf,
  Recycle,
  Award,
  Shield,
  Sparkles,
  Heart,
  Globe,
  Quote,
  CheckCircle,
  TrendingUp,
  Zap,
  Download,
  ChevronLeft,
  ChevronRight,
  Search,
  User,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

const useScrollAnimation = () => {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view")
        }
      })
    }, observerOptions)

    const animatedElements = document.querySelectorAll(
      ".scroll-fade-in, .scroll-slide-left, .scroll-slide-right, .scroll-scale-in",
    )
    animatedElements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])
}

const Navigation = () => {
  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">B</span>
            </div>
            <span className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              BuyMore
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/browse" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Browse
            </Link>
            <Link href="/categories" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Categories
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              About
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="hidden md:flex">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <User className="h-4 w-4" />
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <Badge className="mb-8 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-blue-200/50 px-6 py-3 text-lg">
          <Sparkles className="h-5 w-5 mr-2" />
          Welcome to BuyMore
        </Badge>
        <h1 className="font-bold text-6xl lg:text-8xl text-gray-900 mb-8 text-balance">
          Where Luxury Meets
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
            Purpose
          </span>
        </h1>
        <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-12">
          Discover authentic luxury items while making a positive impact on our planet. Every purchase tells a story of
          sustainability and conscious consumption.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-6 text-xl"
          >
            Start Shopping
            <ArrowRight className="h-6 w-6 ml-3" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-gray-300 hover:bg-gray-50 px-12 py-6 text-xl bg-transparent"
          >
            Learn More
          </Button>
        </div>
      </div>
    </section>
  )
}

const ProductCard = ({ title, price, condition, brand, images, seller }: any) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden hover:shadow-xl transition-all duration-300 group">
      <div className="aspect-square overflow-hidden">
        <img
          src={images[0] || "/placeholder.svg?height=300&width=300"}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary" className="text-xs">
            {condition}
          </Badge>
          <span className="text-sm text-gray-500">{brand}</span>
        </div>
        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">{title}</h3>
        <div className="flex items-center justify-between">
          <span className="font-bold text-2xl text-blue-600">${price.toLocaleString()}</span>
          <div className="text-sm text-gray-500">by {seller.name}</div>
        </div>
      </div>
    </div>
  )
}

const ProductCarousel = ({ products }: { products: any[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (isAutoPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % Math.ceil(products.length / 2))
      }, 4000)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isAutoPlaying, products.length])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.ceil(products.length / 2))
    setIsAutoPlaying(false)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.ceil(products.length / 2)) % Math.ceil(products.length / 2))
    setIsAutoPlaying(false)
  }

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-2xl">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {Array.from({ length: Math.ceil(products.length / 2) }).map((_, slideIndex) => (
            <div key={slideIndex} className="w-full flex-shrink-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
                {products.slice(slideIndex * 2, slideIndex * 2 + 2).map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-300 z-10"
      >
        <ChevronLeft className="h-6 w-6 mx-auto text-gray-700" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-300 z-10"
      >
        <ChevronRight className="h-6 w-6 mx-auto text-gray-700" />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {Array.from({ length: Math.ceil(products.length / 2) }).map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index)
              setIsAutoPlaying(false)
            }}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex ? "bg-blue-600 scale-125" : "bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </div>
  )
}

const featuredProducts = [
  {
    id: "1",
    title: "Vintage Hermès Birkin 35cm",
    price: 12999.99,
    condition: "EXCELLENT",
    brand: "Hermès",
    images: ["/luxury-hermes-birkin-bag-orange-leather.jpg"],
    seller: { name: "Sophie M.", location: "Paris, France" },
  },
  {
    id: "2",
    title: 'MacBook Pro 16" M3 Max',
    price: 2899.99,
    condition: "LIKE_NEW",
    brand: "Apple",
    images: ["/macbook-pro-16-inch-space-gray-laptop.jpg"],
    seller: { name: "Alex K.", location: "San Francisco, CA" },
  },
  {
    id: "3",
    title: "Eames Lounge Chair & Ottoman",
    price: 4299.99,
    condition: "VERY_GOOD",
    brand: "Herman Miller",
    images: ["/eames-lounge-chair-walnut-black-leather.jpg"],
    seller: { name: "Design Studio", location: "New York, NY" },
  },
  {
    id: "4",
    title: "Chanel Classic Flap Medium",
    price: 6999.99,
    condition: "EXCELLENT",
    brand: "Chanel",
    images: ["/chanel-classic-flap-bag-black-quilted-leather.jpg"],
    seller: { name: "Luxury Consign", location: "Beverly Hills, CA" },
  },
]

const categories = [
  { name: "Designer Fashion", count: "3.2k items", icon: "✨", color: "bg-rose-50 border-rose-200 hover:bg-rose-100" },
  { name: "Premium Tech", count: "2.1k items", icon: "📱", color: "bg-blue-50 border-blue-200 hover:bg-blue-100" },
  {
    name: "Luxury Home",
    count: "1.8k items",
    icon: "🏡",
    color: "bg-emerald-50 border-emerald-200 hover:bg-emerald-100",
  },
  { name: "Rare Books", count: "1.2k items", icon: "📖", color: "bg-amber-50 border-amber-200 hover:bg-amber-100" },
  {
    name: "Sports & Outdoor",
    count: "890 items",
    icon: "🏔️",
    color: "bg-orange-50 border-orange-200 hover:bg-orange-100",
  },
  {
    name: "Beauty & Wellness",
    count: "650 items",
    icon: "🌿",
    color: "bg-purple-50 border-purple-200 hover:bg-purple-100",
  },
]

const testimonials = [
  {
    id: 1,
    name: "Sarah Chen",
    location: "San Francisco, CA",
    avatar: "/professional-woman-asian-smiling.jpg",
    rating: 5,
    text: "I found my dream Hermès bag at 40% off retail! The authentication process was thorough, and knowing I'm supporting sustainability makes every purchase feel meaningful. BuyMore has completely transformed how I think about luxury shopping.",
    verified: true,
  },
  {
    id: 2,
    name: "Marcus Johnson",
    location: "Austin, TX",
    avatar: "/professional-man-african-american-smiling.jpg",
    rating: 5,
    text: "As a tech entrepreneur, I've sold over $15k worth of electronics on BuyMore. The platform makes it incredibly easy, and I love that I'm helping extend product lifecycles. The community here truly cares about making a difference.",
    verified: true,
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    location: "Miami, FL",
    avatar: "/young-woman-latina-designer-smiling.jpg",
    rating: 5,
    text: "I've furnished my entire apartment with stunning mid-century pieces from BuyMore. Each item has character and history, and I've saved over $8,000 compared to buying new. It's luxury with a conscience.",
    verified: true,
  },
]

export default function HomePage() {
  useScrollAnimation()

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main>
        <HeroSection />

        <section className="py-32 bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-20 scroll-fade-in">
              <Badge
                variant="secondary"
                className="mb-8 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-blue-200/50 px-8 py-4 text-lg backdrop-blur-sm"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                The BuyMore Difference
              </Badge>
              <h2 className="font-bold text-6xl lg:text-8xl text-foreground mb-8 text-balance bg-gradient-to-br from-gray-900 via-gray-800 to-blue-800 bg-clip-text text-transparent">
                Where Luxury Meets Purpose
              </h2>
              <p className="text-2xl text-muted-foreground max-w-5xl mx-auto leading-relaxed text-pretty">
                We're not just another marketplace — we're a movement. Every transaction creates ripples of positive
                change, proving that conscious consumption can be both luxurious and transformative.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
              <div className="lg:col-span-2 bg-gradient-to-br from-blue-50 via-blue-25 to-purple-50 border-blue-200/50 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mb-8 shadow-lg shadow-blue-500/25">
                  <Leaf className="h-12 w-12 text-white" />
                </div>
                <h3 className="font-bold text-4xl text-foreground mb-6 bg-gradient-to-r from-blue-800 to-purple-700 bg-clip-text text-transparent">
                  Planet-First Impact
                </h3>
                <p className="text-muted-foreground leading-relaxed text-xl mb-8">
                  Every purchase prevents waste, reduces carbon emissions by up to 80%, and supports the circular
                  economy. You're not just buying luxury — you're investing in our planet's future.
                </p>
                <div className="flex items-center text-blue-600 font-semibold text-lg bg-blue-50 rounded-2xl px-6 py-3 w-fit">
                  <Globe className="h-6 w-6 mr-3" />
                  2.3M+ lbs CO₂ saved this year
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 via-purple-25 to-pink-50 border-purple-200/50 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/25">
                  <TrendingUp className="h-10 w-10 text-white" />
                </div>
                <h3 className="font-bold text-2xl text-foreground mb-4 bg-gradient-to-r from-purple-800 to-pink-700 bg-clip-text text-transparent">
                  Unbeatable Value
                </h3>
                <p className="text-muted-foreground leading-relaxed text-lg mb-6">
                  Authentic luxury at 40-70% off retail. Smart shopping that doesn't compromise on quality or style.
                </p>
                <div className="flex items-center text-purple-600 font-semibold bg-purple-50 rounded-xl px-4 py-2 w-fit">
                  <Heart className="h-5 w-5 mr-2" />
                  Average 65% savings
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 via-emerald-25 to-teal-50 border-emerald-200/50 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/25">
                  <Shield className="h-10 w-10 text-white" />
                </div>
                <h3 className="font-bold text-2xl text-foreground mb-4 bg-gradient-to-r from-emerald-800 to-teal-700 bg-clip-text text-transparent">
                  Guaranteed Authentic
                </h3>
                <p className="text-muted-foreground leading-relaxed text-lg mb-6">
                  Every item verified by certified experts using advanced authentication technology.
                </p>
                <div className="flex items-center text-emerald-600 font-semibold bg-emerald-50 rounded-xl px-4 py-2 w-fit">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  99.9% accuracy rate
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 via-amber-25 to-orange-50 border-amber-200/50 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-amber-500/25">
                  <Zap className="h-10 w-10 text-white" />
                </div>
                <h3 className="font-bold text-2xl text-foreground mb-4 bg-gradient-to-r from-amber-800 to-orange-700 bg-clip-text text-transparent">
                  Lightning Experience
                </h3>
                <p className="text-muted-foreground leading-relaxed text-lg mb-6">
                  Same-day shipping, instant notifications, and seamless transactions that feel magical.
                </p>
                <div className="flex items-center text-amber-600 font-semibold bg-amber-50 rounded-xl px-4 py-2 w-fit">
                  <Sparkles className="h-5 w-5 mr-2" />
                  24hr delivery available
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-32 bg-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 via-transparent to-blue-50/30"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-24 scroll-fade-in">
              <Badge
                variant="secondary"
                className="mb-8 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-blue-200/50 px-8 py-4 text-lg backdrop-blur-sm"
              >
                <Star className="h-5 w-5 mr-2" />
                Curated Excellence
              </Badge>
              <h2 className="font-bold text-6xl lg:text-8xl text-foreground mb-8 text-balance bg-gradient-to-br from-gray-900 via-gray-800 to-blue-800 bg-clip-text text-transparent">
                Handpicked Treasures
              </h2>
              <p className="text-2xl text-muted-foreground max-w-5xl mx-auto leading-relaxed text-pretty">
                Discover extraordinary pieces with stories to tell. Each item is carefully selected, authenticated, and
                ready to begin its next chapter in your life.
              </p>
            </div>

            <div className="scroll-scale-in mb-20">
              <ProductCarousel products={featuredProducts} />
            </div>

            <div className="text-center scroll-fade-in">
              <Button
                size="lg"
                asChild
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-16 py-8 text-xl shadow-lg shadow-blue-500/25"
              >
                <Link href="/browse">
                  Explore All Treasures
                  <ArrowRight className="h-6 w-6 ml-3" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-32 bg-gradient-to-br from-blue-50 via-purple-25 to-pink-50 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-24 scroll-fade-in">
              <Badge
                variant="secondary"
                className="mb-8 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-blue-200/50 px-8 py-4 text-lg backdrop-blur-sm"
              >
                <Users className="h-5 w-5 mr-2" />
                Community Stories
              </Badge>
              <h2 className="font-bold text-6xl lg:text-8xl text-foreground mb-8 text-balance bg-gradient-to-br from-gray-900 via-gray-800 to-blue-800 bg-clip-text text-transparent">
                Voices of Change
              </h2>
              <p className="text-2xl text-muted-foreground max-w-5xl mx-auto leading-relaxed text-pretty">
                Real stories from real people who are making a difference. Join a community that believes luxury and
                sustainability can beautifully coexist.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-blue-100/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500"
                >
                  <div className="flex items-center mb-6">
                    <img
                      src={testimonial.avatar || "/placeholder.svg?height=64&width=64"}
                      alt={`${testimonial.name} - BuyMore community member`}
                      className="w-16 h-16 rounded-full mr-4 ring-2 ring-blue-200/50"
                    />
                    <div>
                      <div className="flex items-center mb-1">
                        <h4 className="font-bold text-lg text-foreground mr-2">{testimonial.name}</h4>
                        {testimonial.verified && <CheckCircle className="h-5 w-5 text-blue-500" />}
                      </div>
                      <p className="text-muted-foreground text-sm">{testimonial.location}</p>
                    </div>
                  </div>

                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-amber-400 fill-current" />
                    ))}
                  </div>

                  <Quote className="h-8 w-8 text-blue-200 mb-4" />
                  <p className="text-muted-foreground leading-relaxed text-lg italic">"{testimonial.text}"</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { icon: Shield, label: "Bank-Level Security", desc: "256-bit SSL encryption" },
                { icon: Award, label: "Expert Authentication", desc: "Certified professionals" },
                { icon: Users, label: "75K+ Happy Members", desc: "Growing daily" },
                { icon: Star, label: "4.9/5 Trust Score", desc: "Verified reviews" },
              ].map((badge, index) => (
                <div key={index} className="group">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-500/10">
                    <badge.icon className="h-10 w-10 text-blue-600" />
                  </div>
                  <h4 className="font-bold text-lg text-foreground mb-2 group-hover:text-blue-700 transition-colors duration-300">
                    {badge.label}
                  </h4>
                  <p className="text-muted-foreground">{badge.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-32 bg-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 via-transparent to-blue-50/30"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-24 scroll-fade-in">
              <Badge
                variant="secondary"
                className="mb-8 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-blue-200/50 px-8 py-4 text-lg backdrop-blur-sm"
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                Discover Collections
              </Badge>
              <h2 className="font-bold text-6xl lg:text-8xl text-foreground mb-8 text-balance bg-gradient-to-br from-gray-900 via-gray-800 to-blue-800 bg-clip-text text-transparent">
                Curated Categories
              </h2>
              <p className="text-2xl text-muted-foreground max-w-5xl mx-auto leading-relaxed text-pretty">
                From haute couture to cutting-edge technology, explore our carefully organized collections of
                authenticated luxury items, each with its own story to tell.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
              {categories.map((category, index) => (
                <Link
                  key={category.name}
                  href={`/categories/${category.name.toLowerCase().replace(/\s+/g, "-")}`}
                  className={`${category.color} border rounded-3xl p-10 text-center group hover:shadow-xl transition-all duration-500 backdrop-blur-sm`}
                >
                  <div className="text-6xl mb-8 group-hover:scale-125 transition-all duration-500 group-hover:rotate-12 filter group-hover:drop-shadow-lg">
                    {category.icon}
                  </div>
                  <h3 className="font-bold text-xl text-foreground group-hover:text-blue-600 transition-colors duration-300 mb-3">
                    {category.name}
                  </h3>
                  <p className="text-muted-foreground text-lg font-medium">{category.count}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-32 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-purple-900/20"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-20 scroll-fade-in">
              <h2 className="font-bold text-6xl lg:text-8xl mb-8 text-balance">Our Collective Impact</h2>
              <p className="text-2xl text-blue-100 max-w-5xl mx-auto leading-relaxed text-pretty">
                Together, we're not just changing how people shop — we're transforming the future of consumption. Every
                transaction creates ripples of positive change across our planet.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center">
              {[
                { icon: Users, value: "75K+", label: "Global Community", desc: "Conscious consumers worldwide" },
                { icon: ShoppingBag, value: "250K+", label: "Items Rescued", desc: "Given new purpose" },
                { icon: Recycle, value: "2.3M+", label: "CO₂ Prevented (lbs)", desc: "Environmental impact" },
                { icon: Star, value: "4.9", label: "Trust Rating", desc: "Verified satisfaction" },
              ].map((stat, index) => (
                <div key={index} className="space-y-6 group">
                  <div className="flex justify-center mb-8">
                    <div className="w-28 h-28 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300 shadow-2xl shadow-white/10">
                      <stat.icon className="h-14 w-14" />
                    </div>
                  </div>
                  <div className="font-bold text-7xl lg:text-8xl mb-3 group-hover:scale-110 transition-transform duration-300 bg-gradient-to-br from-white to-blue-100 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-blue-100 text-2xl font-semibold mb-2">{stat.label}</div>
                  <div className="text-blue-200 text-lg">{stat.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-32 bg-gradient-to-br from-gray-50 via-blue-25 to-purple-50 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-16 lg:p-24 shadow-2xl border border-blue-100/50 scroll-scale-in">
              <h2 className="font-bold text-6xl lg:text-8xl text-foreground mb-10 text-balance bg-gradient-to-br from-gray-900 via-gray-800 to-blue-800 bg-clip-text text-transparent">
                Begin Your Conscious Journey
              </h2>
              <p className="text-2xl text-muted-foreground mb-16 max-w-4xl mx-auto leading-relaxed text-pretty">
                Join a movement where every purchase tells a story of sustainability, authenticity, and conscious
                luxury. Your next treasure is waiting — and so is a better future for our planet.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16 max-w-2xl mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email for exclusive access"
                  className="flex-1 px-8 py-6 rounded-2xl border border-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xl hover:border-blue-300 transition-colors duration-300 bg-white/80 backdrop-blur-sm"
                />
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-6 text-xl shadow-lg shadow-blue-500/25 border-0">
                  Join Waitlist
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-blue-200 hover:bg-blue-50 bg-white/80 backdrop-blur-sm px-8 py-4 text-lg flex items-center shadow-lg"
                >
                  <Download className="h-6 w-6 mr-3" />
                  Download for iOS
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-blue-200 hover:bg-blue-50 bg-white/80 backdrop-blur-sm px-8 py-4 text-lg flex items-center shadow-lg"
                >
                  <Download className="h-6 w-6 mr-3" />
                  Download for Android
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row gap-8 justify-center">
                <Button
                  size="lg"
                  asChild
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-16 py-8 text-xl shadow-lg shadow-blue-500/25"
                >
                  <Link href="/signup">Start Shopping Consciously</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="border-blue-200 hover:bg-blue-50 bg-white/80 backdrop-blur-sm px-16 py-8 text-xl shadow-lg"
                >
                  <Link href="/how-it-works">Discover Our Story</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
            <div className="space-y-8">
              <div className="flex items-center space-x-4 group">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-500/25">
                  <span className="text-white font-bold text-2xl">B</span>
                </div>
                <span className="font-bold text-4xl bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  BuyMore
                </span>
              </div>
              <p className="text-gray-300 text-xl leading-relaxed">
                Where conscious luxury meets sustainable living. Building a better future, one authentic purchase at a
                time.
              </p>
            </div>

            {[
              {
                title: "Discover",
                links: [
                  { name: "Browse Collections", href: "/browse" },
                  { name: "New Arrivals", href: "/new-arrivals" },
                  { name: "Trending Now", href: "/trending" },
                ],
              },
              {
                title: "Sell",
                links: [
                  { name: "List Your Items", href: "/sell" },
                  { name: "Seller Resources", href: "/seller-guide" },
                  { name: "Authentication", href: "/authentication" },
                ],
              },
              {
                title: "Community",
                links: [
                  { name: "Help Center", href: "/help" },
                  { name: "Our Story", href: "/about" },
                  { name: "Sustainability", href: "/sustainability" },
                ],
              },
            ].map((section, index) => (
              <div key={section.title} className="space-y-8">
                <h3 className="font-bold text-2xl text-blue-100">{section.title}</h3>
                <div className="space-y-4 text-gray-300 text-lg">
                  {section.links.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="block hover:text-blue-200 transition-all duration-300 hover:translate-x-2"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-700/50 mt-20 pt-16 text-center text-gray-300 text-xl">
            <p>&copy; 2024 BuyMore. All rights reserved. Made with 💙 for conscious consumers and our planet.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
