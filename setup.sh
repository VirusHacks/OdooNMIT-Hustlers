#!/bin/bash

echo "🚀 Setting up EcoFinds Marketplace..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "Please create a .env file with:"
    echo "DATABASE_URL=\"your-neon-postgres-connection-string\""
    echo "JWT_SECRET=\"your-secret-key-here\""
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Push database schema
echo "🗄️ Pushing database schema..."
npx prisma db push

# Seed database
echo "🌱 Seeding database..."
npx prisma db seed

echo "✅ Setup complete! Run 'npm run dev' to start the development server."
