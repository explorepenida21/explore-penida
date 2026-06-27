#!/bin/bash

# ============================================================
# Quick Setup Script - Explore Penida
# Jalankan di server setelah upload project
# ============================================================

set -e

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "\n${CYAN}========================================${NC}"
echo -e "${CYAN}  Explore Penida - Quick Setup${NC}"
echo -e "${CYAN}========================================${NC}\n"

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found!${NC}"
    echo -e "${YELLOW}   Copy .env.example to .env and configure it first.${NC}\n"
    exit 1
fi

echo -e "${GREEN}✓ .env file found${NC}\n"

# Step 1: Install dependencies
echo -e "${CYAN}Step 1/5: Installing dependencies...${NC}"
npm install
echo -e "${GREEN}✓ Dependencies installed${NC}\n"

# Step 2: Generate Prisma Client
echo -e "${CYAN}Step 2/5: Generating Prisma client...${NC}"
npx prisma generate
echo -e "${GREEN}✓ Prisma client generated${NC}\n"

# Step 3: Push database schema
echo -e "${CYAN}Step 3/5: Pushing database schema...${NC}"
npx prisma db push
echo -e "${GREEN}✓ Database schema pushed${NC}\n"

# Step 4: Create admin user
echo -e "${CYAN}Step 4/5: Creating admin user...${NC}"
echo -e "${YELLOW}   Default credentials will be created:${NC}"
echo -e "   Email: admin@explorepenida.com"
echo -e "   Password: admin123"
echo -e "   ${RED}⚠️  CHANGE THIS IMMEDIATELY AFTER LOGIN!${NC}\n"

npx tsx scripts/create-admin.ts
echo -e "${GREEN}✓ Admin user created${NC}\n"

# Step 5: Build application
echo -e "${CYAN}Step 5/5: Building application...${NC}"
npm run build
echo -e "${GREEN}✓ Application built${NC}\n"

# Create logs directory
mkdir -p logs

# Success message
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Setup Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${CYAN}Next steps:${NC}"
echo "  1. Start the app:       pm2 start ecosystem.config.js"
echo "  2. Check status:        pm2 status"
echo "  3. View logs:           pm2 logs explore-penida"
echo "  4. Setup startup:       pm2 startup"
echo "  5. Save PM2 state:      pm2 save"
echo ""
echo -e "${CYAN}Admin Login:${NC}"
echo "  URL:      https://your-domain.com/admin/login"
echo "  Email:    admin@explorepenida.com"
echo "  Password: admin123"
echo ""
echo -e "${RED}⚠️  IMPORTANT:${NC}"
echo "  1. Edit .env and update all API keys"
echo "  2. Set MIDTRANS_IS_PRODUCTION=true for real payments"
echo "  3. Change admin password immediately!"
echo "  4. Test booking flow before going live"
echo ""
