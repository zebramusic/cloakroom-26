#!/bin/bash

echo "🔍 Checking Vercel Environment Variables..."
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not installed"
    echo "Install with: npm install -g vercel"
    exit 1
fi

echo "✓ Vercel CLI installed"
echo ""

# Pull environment variables
echo "📥 Pulling production environment variables..."
vercel env pull .env.production --yes 2>/dev/null || {
    echo "❌ Failed to pull environment variables"
    echo "Make sure you're logged in: vercel login"
    exit 1
}

echo "✓ Environment variables pulled"
echo ""

# Check required variables
echo "🔐 Checking required variables:"
echo ""

check_var() {
    var_name=$1
    if grep -q "^${var_name}=" .env.production 2>/dev/null; then
        value=$(grep "^${var_name}=" .env.production | cut -d '=' -f2)
        if [ -n "$value" ]; then
            echo "✅ $var_name is set"
            if [ "$var_name" = "NEXTAUTH_URL" ]; then
                echo "   Value: $value"
            fi
        else
            echo "❌ $var_name is empty"
            return 1
        fi
    else
        echo "❌ $var_name is NOT set"
        return 1
    fi
}

all_good=true

check_var "NEXTAUTH_SECRET" || all_good=false
check_var "NEXTAUTH_URL" || all_good=false
check_var "MONGODB_URI" || all_good=false

echo ""

if [ "$all_good" = true ]; then
    echo "✅ All required environment variables are configured!"
    echo ""
    echo "Next steps:"
    echo "1. Make sure NEXTAUTH_URL matches your production domain exactly"
    echo "2. Redeploy: git push origin master"
    echo "3. Clear browser cookies and try logging in again"
else
    echo "❌ Some environment variables are missing or empty"
    echo ""
    echo "To fix:"
    echo "1. Go to https://vercel.com/your-project/settings/environment-variables"
    echo "2. Add the missing variables for Production environment"
    echo "3. Redeploy your application"
fi

# Clean up
rm -f .env.production

echo ""
