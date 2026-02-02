#!/bin/bash

echo "Blockchain Game DApp - Build and Run Script"

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check for required tools
if ! command_exists node; then
    echo "Error: Node.js is not installed. Please install Node.js first."
    exit 1
fi

if ! command_exists npm; then
    echo "Error: npm is not installed. Please install npm first."
    exit 1
fi

if ! command_exists npx; then
    echo "Installing hardhat globally..."
    npm install -g hardhat
fi

echo "Installing project dependencies..."
npm install --legacy-peer-deps

if [ $? -ne 0 ]; then
    echo "Failed to install dependencies"
    exit 1
fi

echo "Compiling smart contracts..."
npx hardhat compile

if [ $? -ne 0 ]; then
    echo "Failed to compile smart contracts"
    exit 1
fi

echo "Setup complete!"
echo ""
echo "To run the full application:"
echo "1. In a new terminal, start the local blockchain: npx hardhat node"
echo "2. In another terminal, deploy the contracts: npx hardhat run scripts/deploy.js --network localhost"
echo "3. Serve the frontend (using your preferred method, e.g. python -m http.server or live-server)"
echo ""
echo "Alternatively, you can run the automated deployment script to start everything at once."