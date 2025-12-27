#!/bin/bash

# Ramay Humour Academy - Complete Setup Script
# This script sets up both frontend and backend for development

set -e  # Exit on error

echo "🎭 Ramay Humour Academy - Setup Script"
echo "======================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if PHP is installed
if ! command -v php &> /dev/null; then
    echo "❌ PHP is not installed. Please install PHP 8.3+ first."
    exit 1
fi

# Check if Composer is installed
if ! command -v composer &> /dev/null; then
    echo "❌ Composer is not installed. Please install Composer first."
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo "✅ PHP version: $(php -v | head -n 1)"
echo "✅ Composer installed"
echo ""

# Frontend Setup
echo "📦 Setting up Frontend..."
npm install
if [ -f ".env.local" ]; then
    echo "   ℹ️  .env.local already exists"
else
    cp .env.example .env.local
    echo "   ✅ Created .env.local from .env.example"
fi
echo ""

# Backend Setup
echo "🔧 Setting up Backend..."
cd backend

# Check if .env exists
if [ -f ".env" ]; then
    echo "   ℹ️  .env already exists"
else
    cp .env.example .env
    echo "   ✅ Created .env from .env.example"
    echo ""
    echo "   ⚠️  IMPORTANT: Update backend/.env with your database credentials:"
    echo "      - DB_DATABASE=ramay_humour_academy"
    echo "      - DB_USERNAME=root"
    echo "      - DB_PASSWORD=your_password"
    echo ""
fi

# Install dependencies
composer install
echo "   ✅ Composer dependencies installed"

# Generate app key
if ! grep -q "APP_KEY=base64:" .env || grep "APP_KEY=$" .env; then
    php artisan key:generate
    echo "   ✅ Generated APP_KEY"
fi

# Run migrations
echo ""
echo "🗄️  Setting up Database..."
php artisan migrate --force
echo "   ✅ Migrations completed"

# Seed database
php artisan db:seed
echo "   ✅ Database seeded with test data"
echo ""

cd ..

echo "✨ Setup Complete!"
echo ""
echo "📝 Next Steps:"
echo "1. Update backend/.env with your database credentials if needed"
echo "2. Start the backend:    cd backend && php artisan serve"
echo "3. Start the frontend:   npm run dev"
echo "4. Visit:                http://localhost:5173"
echo ""
echo "🔐 Default Credentials:"
echo "   BOD:       bod@academy.com / password123"
echo "   Faculty 1: sarah@academy.com / password123"
echo "   Faculty 2: james@academy.com / password123"
echo "   Student 1: alex@student.com / password123"
echo ""
echo "📚 Documentation:"
echo "   - README.md for project overview"
echo "   - TROUBLESHOOTING.md for common issues"
echo "   - backend/SETUP_GUIDE.md for backend details"
echo "   - backend/API_DOCUMENTATION.md for API reference"
echo ""
