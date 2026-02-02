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

# Check if the node is running properly
if ps -p $HARDHAT_PID > /dev/null; then
    echo "Hardhat node is running with PID: $HARDHAT_PID"
    
    # Wait a bit more to ensure the node is fully initialized
    sleep 3
    
    # Deploy the contracts to the local node
    echo "Deploying contracts to the local Hardhat node..."
    npx hardhat run scripts/deploy.js --network localhost
    
    if [ $? -eq 0 ]; then
        echo "Deployment completed successfully!"
    else
        echo "Deployment failed!"
    fi
else
    echo "Failed to start Hardhat node"
fi

# Save the Hardhat node PID to a file for potential cleanup later
echo $HARDHAT_PID > hardhat-node.pid

echo "Hardhat node is running in the background with PID: $HARDHAT_PID"
echo "Check hardhat-output.log for node logs"