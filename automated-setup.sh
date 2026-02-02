#!/bin/bash

echo "Blockchain Game DApp - Automated Setup"

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

# Start the local blockchain in the background
echo "Starting local blockchain node..."
npx hardhat node > hardhat-node.log 2>&1 &
HARDHAT_PID=$!
echo "Local blockchain node started with PID $HARDHAT_PID"

# Wait a moment for the node to start
sleep 5

# Deploy contracts to the local node
echo "Deploying contracts to local node..."
npx hardhat run scripts/deploy.js --network localhost

if [ $? -ne 0 ]; then
    echo "Failed to deploy contracts"
    kill $HARDHAT_PID
    exit 1
fi

echo ""
echo "Deployment completed successfully!"
echo ""
echo "Contract information has been saved to src/contractInfo.json"
echo ""
echo "The local blockchain node is running in the background (PID: $HARDHAT_PID)"
echo ""
echo "To run the frontend, you can use any static server such as:"
echo "  - python -m http.server in the src/ directory"
echo "  - npx serve src/"
echo "  - live-server src/"
echo ""
echo "To stop the local blockchain node, run: kill $HARDHAT_PID"
echo ""

# Keep the script running so the background process continues
trap "kill $HARDHAT_PID; exit" SIGINT SIGTERM

# Wait indefinitely
while true; do
    sleep 1
done