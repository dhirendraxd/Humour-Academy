#!/bin/bash
# Security check script - Run before committing

echo "🔍 Checking for credentials in git..."
echo ""

# Check for .env files
if git ls-files | grep -E "\.env$" > /dev/null; then
    echo "❌ ERROR: .env files found in git!"
    git ls-files | grep -E "\.env$"
    exit 1
fi

# Check for database files
if git ls-files | grep -E "\.sqlite$|\.db$" > /dev/null; then
    echo "❌ ERROR: Database files found in git!"
    git ls-files | grep -E "\.sqlite$|\.db$"
    exit 1
fi

# Check for key files
if git ls-files | grep -E "\.pem$|\.key$|oauth-" > /dev/null; then
    echo "❌ ERROR: Private keys found in git!"
    git ls-files | grep -E "\.pem$|\.key$|oauth-"
    exit 1
fi

echo "✅ No credentials found in git - safe to commit!"
exit 0
