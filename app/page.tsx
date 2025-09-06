import { Navigation } from "@/components/ui/navigation"
import { HeroSection } from "@/components/ui/hero-section"
import { ProductCard } from "@/components/ui/product-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Star, Users, ShoppingBag, Leaf } from "lucide-react"
import Link from "next/link"

// Sample featured products data
const featuredProducts = [
  {
    id: "1",
    title: "Vintage Hermès Silk Scarf",
    price: 299.99,
    condition: "EXCELLENT",
    brand: "Hermès",
    images: ["/placeholder.svg?height=400&width=400&text=Hermes+Scarf"],
    seller: { name: "Sophie M.", location: "Paris, France" },
  },
  {
    id: "2",
    title: 'MacBook Pro 14" M2',
    price: 1899.99,
    condition: "VERY_GOOD",
    brand: "Apple",
    images: ["/placeholder.svg?height=400&width=400&text=MacBook+Pro"],
    seller: { name: "Alex K.", location: "San Francisco, CA" },
  },
  {
    id: "3",
    title: "Mid-Century Eames Chair",
    price: 1299.99,
    condition: "GOOD",
    brand: "Herman Miller",
    images: ["/placeholder.svg?height=400&width=400&text=Eames+Chair"],
    seller: { name: "Design Studio", location: "New York, NY" },
  },
  {
    id: "4",
    title: "Chanel Classic Flap Bag",
    price: 3999.99,
    condition: "EXCELLENT",
    brand: "Chanel",
    images: ["/placeholder.svg?height=400&width=400&text=Chanel+Bag"],
    seller: { name: "Luxury Consign", location: "Beverly Hills, CA" },
  },
]

const categories = [
  { name: "Fashion", count: "2.3k items", icon: "👗" },
  { name: "Electronics", count: "1.8k items", icon: "📱" },
  { name: "Home & Garden", count: "1.2k items", icon: "🏠" },
  { name: "Books", count: "890 items", icon: "📚" },
  { name: "Sports", count: "650 items", icon: "⚽" },
  { name: "Beauty", count: "420 items", icon: "💄" },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main>
        <HeroSection />

        {/* Featured Products Section */}
        <section className="py-20 bg-card/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4">
                <Star className="h-4 w-4 mr-1" />
                Featured Items
              </Badge>
              <h2 className="font-heading font-bold text-4xl lg:text-5xl text-foreground mb-4">Curated for You</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Discover handpicked luxury items from trusted sellers around the world
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>

            <div className="text-center">
              <Button size="lg" asChild className="luxury-button">
                <Link href="/browse">
                  View All Items
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-heading font-bold text-4xl lg:text-5xl text-foreground mb-4">Shop by Category</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Find exactly what you're looking for in our carefully organized collections
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href={`/categories/${category.name.toLowerCase()}`}
                  className="luxury-card text-center group"
                >
                  <div className="text-4xl mb-4">{category.icon}</div>
                  <h3 className="font-heading font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{category.count}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div className="space-y-2">
                <div className="flex justify-center mb-4">
                  <Users className="h-12 w-12" />
                </div>
                <div className="font-heading font-bold text-4xl">50K+</div>
                <div className="text-primary-foreground/80">Happy Customers</div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-center mb-4">
                  <ShoppingBag className="h-12 w-12" />
                </div>
                <div className="font-heading font-bold text-4xl">100K+</div>
                <div className="text-primary-foreground/80">Items Sold</div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-center mb-4">
                  <Leaf className="h-12 w-12" />
                </div>
                <div className="font-heading font-bold text-4xl">2M+</div>
                <div className="text-primary-foreground/80">CO2 Saved (lbs)</div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-center mb-4">
                  <Star className="h-12 w-12" />
                </div>
                <div className="font-heading font-bold text-4xl">4.9</div>
                <div className="text-primary-foreground/80">Average Rating</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="luxury-card bg-gradient-to-br from-secondary/10 to-primary/5">
              <h2 className="font-heading font-bold text-4xl lg:text-5xl text-foreground mb-6">
                Ready to Start Your Sustainable Journey?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of conscious consumers who are making a difference, one purchase at a time.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild className="luxury-button">
                  <Link href="/signup">Get Started Today</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="luxury-button bg-transparent">
                  <Link href="/how-it-works">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Leaf className="h-8 w-8" />
                <span className="font-heading font-bold text-2xl">EcoFinds</span>
              </div>
              <p className="text-primary-foreground/80">Sustainable luxury marketplace for conscious consumers.</p>
            </div>

            <div className="space-y-4">
              <h3 className="font-heading font-semibold text-lg">Shop</h3>
              <div className="space-y-2 text-primary-foreground/80">
                <Link href="/browse" className="block hover:text-primary-foreground transition-colors">
                  Browse All
                </Link>
                <Link href="/categories" className="block hover:text-primary-foreground transition-colors">
                  Categories
                </Link>
                <Link href="/new-arrivals" className="block hover:text-primary-foreground transition-colors">
                  New Arrivals
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-heading font-semibold text-lg">Sell</h3>
              <div className="space-y-2 text-primary-foreground/80">
                <Link href="/add-product" className="block hover:text-primary-foreground transition-colors">
                  List an Item
                </Link>
                <Link href="/seller-guide" className="block hover:text-primary-foreground transition-colors">
                  Seller Guide
                </Link>
                <Link href="/pricing" className="block hover:text-primary-foreground transition-colors">
                  Pricing
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-heading font-semibold text-lg">Support</h3>
              <div className="space-y-2 text-primary-foreground/80">
                <Link href="/help" className="block hover:text-primary-foreground transition-colors">
                  Help Center
                </Link>
                <Link href="/contact" className="block hover:text-primary-foreground transition-colors">
                  Contact Us
                </Link>
                <Link href="/about" className="block hover:text-primary-foreground transition-colors">
                  About
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center text-primary-foreground/60">
            <p>&copy; 2024 EcoFinds. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
