import { PrismaClient } from "@prisma/client"
import { hashPassword } from "../lib/auth"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "fashion" },
      update: {},
      create: {
        name: "Fashion",
        slug: "fashion",
        description: "Clothing, shoes, and accessories",
      },
    }),
    prisma.category.upsert({
      where: { slug: "electronics" },
      update: {},
      create: {
        name: "Electronics",
        slug: "electronics",
        description: "Phones, laptops, and gadgets",
      },
    }),
    prisma.category.upsert({
      where: { slug: "home-garden" },
      update: {},
      create: {
        name: "Home & Garden",
        slug: "home-garden",
        description: "Furniture, decor, and garden items",
      },
    }),
    prisma.category.upsert({
      where: { slug: "books" },
      update: {},
      create: {
        name: "Books",
        slug: "books",
        description: "Fiction, non-fiction, and textbooks",
      },
    }),
  ])

  // Create users with hashed passwords
  const hashedPassword = await hashPassword("password123")

  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: "alice@example.com" },
      update: {},
      create: {
        email: "alice@example.com",
        name: "Alice Johnson",
        password: hashedPassword,
        bio: "Sustainable fashion enthusiast",
        location: "San Francisco, CA",
      },
    }),
    prisma.user.upsert({
      where: { email: "bob@example.com" },
      update: {},
      create: {
        email: "bob@example.com",
        name: "Bob Smith",
        password: hashedPassword,
        bio: "Tech lover and minimalist",
        location: "Austin, TX",
      },
    }),
  ])

  // Create sample listings
  await Promise.all([
    prisma.listing.upsert({
      where: { id: "listing_1" },
      update: {},
      create: {
        id: "listing_1",
        title: "Vintage Leather Jacket",
        description: "Beautiful vintage leather jacket in excellent condition. Perfect for fall and winter.",
        price: 89.99,
        condition: "EXCELLENT",
        brand: "Vintage",
        size: "M",
        color: "Black",
        images: ["/vintage-black-leather-jacket.jpg"],
        sellerId: users[0].id,
        categoryId: categories[0].id,
      },
    }),
    prisma.listing.upsert({
      where: { id: "listing_2" },
      update: {},
      create: {
        id: "listing_2",
        title: "iPhone 13 Pro",
        description: "Gently used iPhone 13 Pro with original box and accessories. No scratches or damage.",
        price: 699.99,
        condition: "VERY_GOOD",
        brand: "Apple",
        size: "128GB",
        color: "Graphite",
        images: ["/iphone-13-pro-graphite.jpg"],
        sellerId: users[1].id,
        categoryId: categories[1].id,
      },
    }),
  ])

  console.log("✅ Database seeded successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
