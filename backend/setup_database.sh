#!/bin/bash

# MySQL Database Setup Script for Ramay Humour Academy

echo "Setting up MySQL database and user..."

# Create SQL commands file
cat > /tmp/setup_db.sql << 'EOF'
-- Create database
CREATE DATABASE IF NOT EXISTS ramay_humour_academy CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user (if not exists)
CREATE USER IF NOT EXISTS 'ramay_user'@'localhost' IDENTIFIED BY 'ramay_password_2025';

-- Grant privileges
GRANT ALL PRIVILEGES ON ramay_humour_academy.* TO 'ramay_user'@'localhost';

-- Flush privileges
FLUSH PRIVILEGES;

-- Show databases
SHOW DATABASES LIKE 'ramay%';
EOF

# Execute SQL commands
sudo mysql < /tmp/setup_db.sql

# Clean up
rm /tmp/setup_db.sql

echo "Database setup complete!"
echo ""
echo "Database: ramay_humour_academy"
echo "Username: ramay_user"
echo "Password: ramay_password_2025"
echo ""
echo "Please update your backend/.env file with these credentials."
