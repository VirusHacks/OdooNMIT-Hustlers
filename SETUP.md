# EcoFinds Marketplace Setup Guide

## Prerequisites
- Node.js 18+ installed
- A Neon PostgreSQL database

## Quick Setup

### 1. Environment Variables
Create a `.env` file in the root directory:

\`\`\`env
DATABASE_URL="postgresql://username:password@host/database?sslmode=require"
JWT_SECRET="your-super-secret-jwt-key-here"
\`\`\`

### 2. Database Setup (Neon)
1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new database project
3. Copy the connection string from the dashboard
4. Paste it as `DATABASE_URL` in your `.env` file

### 3. Run Setup
Choose one of these methods:

#### Option A: Automatic Setup (Recommended)
\`\`\`bash
npm run setup
\`\`\`

#### Option B: Manual Setup
\`\`\`bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# Seed database with sample data
npx prisma db seed
\`\`\`

### 4. Start Development Server
\`\`\`bash
npm run dev
\`\`\`

Visit [http://localhost:3000](http://localhost:3000) to see your app!

## Test Accounts
After seeding, you can login with:
- **Email:** alice@example.com
- **Password:** password123

Or:
- **Email:** bob@example.com  
- **Password:** password123

## Troubleshooting

### Prisma Client Issues
If you get Prisma client errors:
\`\`\`bash
npx prisma generate
\`\`\`

### Database Connection Issues
1. Verify your `DATABASE_URL` is correct
2. Ensure your Neon database is active
3. Check that the connection string includes `?sslmode=require`

### Reset Database
To start fresh:
\`\`\`bash
npm run db:reset
\`\`\`

## Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run setup` - Complete setup process
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:seed` - Seed database with sample data
- `npm run db:reset` - Reset database (careful!)

## Features Included
✅ User authentication (signup/login)  
✅ User dashboard and profile management  
✅ Database schema for marketplace  
✅ Luxury UI design with animations  
✅ Route protection and middleware  
✅ Sample data seeding  

Ready to build your sustainable marketplace! 🌱
