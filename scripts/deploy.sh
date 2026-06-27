#!/bin/bash

# ============================================================
# Explore Penida - Deployment Script for Rumahweb
# ============================================================
# Usage: ./deploy.sh [production|staging]
# ============================================================

set -e  # Exit on error
set -u  # Exit on undefined variable

# ============================================================
# Configuration
# ============================================================
APP_NAME="explore-penida"
APP_DIR="$HOME/${APP_NAME}"
REPO_URL=""  # Set your Git repository URL
BRANCH="main"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ============================================================
# Functions
# ============================================================
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# ============================================================
# Pre-deployment Checks
# ============================================================
echo -e "\n${BLUE}============================================${NC}"
echo -e "${BLUE}  Explore Penida Deployment Script${NC}"
echo -e "${BLUE}============================================${NC}\n"

# Check Node.js version
log_info "Checking Node.js version..."
NODE_VERSION=$(node -v)
NPM_VERSION=$(npm -v)
log_success "Node.js $NODE_VERSION, npm $NPM_VERSION"

# Check if .env file exists
if [ ! -f "$APP_DIR/.env" ]; then
    log_error ".env file not found in $APP_DIR"
    log_info "Copy .env.example to .env and configure it first"
    exit 1
fi

# ============================================================
# Stop existing PM2 process
# ============================================================
log_info "Stopping existing PM2 process..."
pm2 stop $APP_NAME 2>/dev/null || true
pm2 delete $APP_NAME 2>/dev/null || true

# ============================================================
# Navigate to app directory
# ============================================================
cd $APP_DIR
log_info "Working directory: $(pwd)"

# ============================================================
# Update code from Git (if repo is set)
# ============================================================
if [ -n "$REPO_URL" ]; then
    log_info "Pulling latest code from Git..."
    git fetch origin
    git checkout $BRANCH
    git pull origin $BRANCH
    log_success "Code updated from Git"
else
    log_warning "REPO_URL not set, skipping git pull"
    log_info "Make sure to manually update code before running this script"
fi

# ============================================================
# Install dependencies
# ============================================================
log_info "Installing dependencies..."
npm ci --only=production --no-audit --no-fund || npm install --production --no-audit --no-fund
log_success "Dependencies installed"

# ============================================================
# Generate Prisma Client
# ============================================================
log_info "Generating Prisma client..."
npx prisma generate
log_success "Prisma client generated"

# ============================================================
# Build application
# ============================================================
log_info "Building application..."
npm run build
log_success "Application built"

# ============================================================
# Run database migrations
# ============================================================
log_info "Running database migrations..."
npx prisma migrate deploy
log_success "Database migrations completed"

# ============================================================
# Create logs directory
# ============================================================
mkdir -p logs
log_info "Logs directory created"

# ============================================================
# Start application with PM2
# ============================================================
log_info "Starting application with PM2..."
pm2 start ecosystem.config.js --env production
log_success "Application started"

# ============================================================
# Save PM2 process list
# ============================================================
log_info "Saving PM2 configuration..."
pm2 save

# ============================================================
# Setup PM2 startup script
# ============================================================
log_info "Setting up PM2 startup script..."
pm2 startup 2>/dev/null || log_warning "PM2 startup setup may require sudo"

# ============================================================
# Final status
# ============================================================
echo -e "\n${GREEN}============================================${NC}"
echo -e "${GREEN}  Deployment Complete!${NC}"
echo -e "${GREEN}============================================${NC}\n"

echo -e "${BLUE}Application:${NC} $APP_NAME"
echo -e "${BLUE}Status:${NC}"
pm2 status $APP_NAME

echo -e "\n${BLUE}Useful Commands:${NC}"
echo "  pm2 logs $APP_NAME      - View logs"
echo "  pm2 restart $APP_NAME   - Restart app"
echo "  pm2 monit               - Monitor processes"
echo ""

# Open firewall port if needed
log_info "Opening firewall for port 3000..."
sudo ufw allow 3000/tcp 2>/dev/null || log_warning "UFW not available, manual firewall config may be needed"

log_success "Deployment finished!"
