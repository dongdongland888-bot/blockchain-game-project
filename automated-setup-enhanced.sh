#!/bin/bash

# Enhanced Automated Setup Script for Blockchain Game DApp
# This script automates the complete setup process for the blockchain game

set -e  # Exit immediately if a command exits with a non-zero status

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║              ADVANCED BLOCKCHAIN GAME SETUP                ║"
echo "║                Automated Installation Script               ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    print_warning "This script should not be run as root. Continuing anyway..."
fi

# Check if Node.js is installed
print_step "Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
else
    NODE_VERSION=$(node --version)
    print_status "Node.js version: $NODE_VERSION"
    
    # Check if version is sufficient (>=14)
    if [[ $(node -v | cut -d'v' -f2 | cut -d'.' -f1) -lt 14 ]]; then
        print_error "Node.js version is too old. Please upgrade to Node.js 14 or higher."
        exit 1
    fi
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
else
    NPM_VERSION=$(npm --version)
    print_status "npm version: $NPM_VERSION"
fi

# Check if git is installed
print_step "Checking Git installation..."
if ! command -v git &> /dev/null; then
    print_error "Git is not installed. Please install Git first."
    exit 1
else
    GIT_VERSION=$(git --version)
    print_status "Git version: $GIT_VERSION"
fi

# Check if jq is installed (for JSON processing)
print_step "Checking jq installation..."
if ! command -v jq &> /dev/null; then
    print_warning "jq is not installed. Installing jq..."
    if command -v apt-get &> /dev/null; then
        sudo apt-get update && sudo apt-get install -y jq
    elif command -v yum &> /dev/null; then
        sudo yum install -y jq
    elif command -v brew &> /dev/null; then
        brew install jq
    else
        print_error "Could not install jq. Please install jq manually."
        exit 1
    fi
fi

# Check if Hardhat is installed globally
print_step "Checking Hardhat installation..."
if ! command -v npx &> /dev/null || ! npx hardhat --version &> /dev/null; then
    print_warning "Hardhat is not installed globally. Installing Hardhat locally..."
    if [ ! -f "package.json" ]; then
        print_status "Initializing npm project..."
        npm init -y
    fi
fi

# Install project dependencies
print_step "Installing project dependencies..."
npm install

# Check if contracts directory exists
if [ ! -d "contracts" ]; then
    print_error "contracts directory not found. Make sure you're running this script from the project root."
    exit 1
fi

# Compile contracts
print_step "Compiling smart contracts..."
npx hardhat compile

# Check if compilation was successful
if [ $? -eq 0 ]; then
    print_status "Smart contracts compiled successfully!"
else
    print_error "Smart contract compilation failed!"
    exit 1
fi

# Check if src directory exists
if [ ! -d "src" ]; then
    print_error "src directory not found. Make sure you're running this script from the project root."
    exit 1
fi

# Check if MetaMask is recommended to be installed
print_warning "Please make sure MetaMask browser extension is installed."

# Check for Hardhat node availability
print_step "Setting up local blockchain environment..."

# Start a local Hardhat node in the background
print_status "Starting local Hardhat node..."
npx hardhat node &
HARDHAT_PID=$!

# Wait a moment for the node to start
sleep 3

# Check if the node is running
if ps -p $HARDHAT_PID > /dev/null; then
    print_status "Local Hardhat node is running (PID: $HARDHAT_PID)"
else
    print_error "Failed to start Hardhat node"
    exit 1
fi

# Deploy contracts to local network
print_step "Deploying contracts to local network..."
npx hardhat run scripts/deploy-full.js --network localhost

# Wait for deployment to complete
sleep 5

# Kill the Hardhat node
if ps -p $HARDHAT_PID > /dev/null; then
    kill $HARDHAT_PID
    print_status "Local Hardhat node stopped."
fi

# Verify contractInfo.json was created
if [ -f "src/contractInfo.json" ]; then
    print_status "Contract information generated successfully!"
    CONTRACT_ADDR=$(jq -r '.address' src/contractInfo.json 2>/dev/null || echo "Not found")
    print_status "Contract deployed at: $CONTRACT_ADDR"
else
    print_error "Contract information file not found!"
    exit 1
fi

# Check if server.js exists and offer to start the frontend
if [ -f "server.js" ]; then
    print_step "Blockchain Game DApp is ready to run!"
    echo
    print_status "To start the game:"
    echo "  1. Make sure MetaMask is installed and set to Localhost 8545"
    echo "  2. Run: node server.js"
    echo "  3. Visit: http://localhost:8000"
    echo "  4. Import one of the HardHat test accounts into MetaMask"
    echo
    print_status "Alternatively, you can use a simple HTTP server:"
    echo "  cd src && npx http-server"
    echo
else
    print_warning "server.js not found, but you can still run the frontend with:"
    echo "  cd src && npx http-server"
fi

# Show project structure
print_step "Project setup completed! Here's the project structure:"
echo
tree -L 2 . 2>/dev/null || ls -la

echo
print_status "🎉 Advanced Blockchain Game DApp setup completed successfully!"
echo
print_status "💡 Tips:"
print_status "   - Check the ENHANCED_README.md for detailed documentation"
print_status "   - Review GUIDE.md for step-by-step instructions"
print_status "   - The game includes achievements, NFT upgrades, and reward systems"
print_status "   - Connect to the game using MetaMask on Localhost 8545"

# Offer to start the server
echo
read -p "Would you like to start the game server now? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Starting the game server..."
    node server.js
fi