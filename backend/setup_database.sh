#!/bin/bash

# MySQL Database Setup Script for Ramay Humour Academy

echo "Setting up SQLite database..."

# Create database file if it doesn't exist
touch database/database.sqlite

# Run migrations
php artisan migrate

echo "Database setup complete!"
echo ""
echo "Database: SQLite (database/database.sqlite)"
echo ""

