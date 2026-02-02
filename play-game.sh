#!/bin/bash

echo " ________________________________________________________"
echo "|                                                        |"
echo "|            🎮 BLOCKCHAIN GAME DAPP LAUNCHER             |"
echo "|                                                        |"
echo "|  Welcome to the Blockchain Game DApp!                  |"
echo "|  This game combines smart contracts with interactive   |"
echo "|  gameplay for a true decentralized gaming experience.  |"
echo "|________________________________________________________|"
echo ""

echo "📋 Project Status:"
echo "   • Smart contracts: GameNFT.sol, GameLogic.sol"
echo "   • Interactive canvas game with player movement"
echo "   • Wallet integration (MetaMask)"
echo "   • NFT minting functionality"
echo "   • Player progression system"
echo ""

echo "🎮 Choose an option:"
echo "   1) Quick Start - Play the game right away (recommended)"
echo "   2) Full Setup - Deploy to local blockchain (advanced)"
echo "   3) View project information"
echo ""
echo -n "Enter your choice (1-3): "
read choice

case $choice in
    1)
        echo ""
        echo "🚀 Quick Start - Preparing game..."
        cd /root/clawd/blockchain-game
        node simple-deploy.js
        echo ""
        echo "🎉 Ready to play!"
        echo "   The game will now start in your browser"
        echo "   Use WASD or arrow keys to move your character"
        echo "   Collect coins to earn XP and mint NFTs!"
        echo ""
        ./start-frontend.sh
        ;;
    2)
        echo ""
        echo "⚙️  Full Setup - This requires proper Hardhat installation"
        echo "   Make sure you have Hardhat and related tools installed"
        echo ""
        echo "Prerequisites:"
        echo "   • Node.js and npm"
        echo "   • Hardhat (npm install -g hardhat)"
        echo "   • MetaMask browser extension"
        echo ""
        echo "Commands to run (in separate terminals):"
        echo "   Terminal 1: npx hardhat node"
        echo "   Terminal 2: npx hardhat run scripts/deploy.js --network localhost"
        echo "   Terminal 3: cd src && python -m http.server 8000"
        echo ""
        echo "After running these commands, visit http://localhost:8000"
        echo ""
        ;;
    3)
        echo ""
        echo "📖 Project Information:"
        echo ""
        cat /root/clawd/blockchain-game/FINAL_SUMMARY.md
        echo ""
        ;;
    *)
        echo ""
        echo "❌ Invalid choice. Please run the script again and select 1, 2, or 3."
        echo ""
        ;;
esac