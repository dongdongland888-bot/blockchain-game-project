#!/bin/bash

echo "🚀 Starting Blockchain Game DApp Frontend..."

# Check if Python is available
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
elif command -v python &> /dev/null; then
    PYTHON_CMD="python"
else
    echo "❌ Python is not installed. Please install Python to serve the frontend."
    exit 1
fi

# Navigate to the src directory
cd /root/clawd/blockchain-game/src

echo "🌐 Serving the game on http://localhost:8000"
echo ""
echo "🎮 How to play:"
echo "   1. Open your browser and go to http://localhost:8000"
echo "   2. Connect your MetaMask wallet"
echo "   3. Click 'Register Player' (happens automatically on wallet connection)"
echo "   4. Move your character with WASD or arrow keys"
echo "   5. Collect gold coins to earn XP"
echo "   6. Click 'Perform Action' to gain experience"
echo "   7. Click 'Mint NFT' to create your game NFT"
echo ""
echo "ℹ️  Note: This uses mock contract addresses. In a real deployment,"
echo "    you would connect to an actual blockchain network."
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the HTTP server
$PYTHON_CMD -m http.server 8000