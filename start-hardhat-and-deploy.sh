#!/bin/bash

# Script to start a local Hardhat node in the background and deploy contracts

echo "Starting Hardhat node in the background..."

# Change to the project directory
cd /root/clawd/blockchain-game

# Start the Hardhat node in the background and save the PID
npx hardhat node > hardhat-output.log 2>&1 &
HARDHAT_PID=$!

# Wait a moment for the node to start
sleep 5

echo "Hardhat node started with PID: $HARDHAT_PID"

# Deploy the contracts to the local node
echo "Deploying contracts to the local Hardhat node..."
npx hardhat run scripts/deploy.js --network localhost

# Save the Hardhat node PID to a file for potential cleanup later
echo $HARDHAT_PID > hardhat-node.pid

echo "Deployment completed!"
echo "Hardhat node is running in the background with PID: $HARDHAT_PID"
echo "Contract information has been saved to src/contractInfo.json"