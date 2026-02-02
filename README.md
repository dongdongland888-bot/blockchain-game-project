# Blockchain Game DApp

This is a blockchain-based game DApp that demonstrates the integration of smart contracts with a web-based game interface.

## Features
- NFT minting functionality
- Interactive game with player progression
- Web-based game interface with canvas rendering
- Blockchain integration with smart contracts
- Wallet connection capability
- Player statistics tracking (level, XP)

## Technologies Used
- Solidity (for smart contracts)
- JavaScript (for frontend)
- Ethers.js (for blockchain interaction)
- HTML/CSS (for user interface)
- Hardhat (for development environment)
- OpenZeppelin (for secure smart contract patterns)

## Project Structure
- `contracts/` - Smart contract source files
- `src/` - Frontend source files
- `scripts/` - Deployment scripts
- `test/` - Contract tests (to be implemented)

## Quick Start

### Option 1: Run the frontend directly (recommended for testing)
1. Generate contract info: `node simple-deploy.js`
2. Start the frontend: `./start-frontend.sh`
3. Visit `http://localhost:8000` in your browser

### Option 2: Full development setup
1. Install dependencies: `npm install --legacy-peer-deps`
2. Compile contracts: `npx hardhat compile`
3. In a separate terminal, start local node: `npx hardhat node`
4. Deploy contracts: `npx hardhat run scripts/deploy.js --network localhost`
5. Start frontend: `npm run dev`

## Game Features
- Connect your crypto wallet
- Mint unique NFTs representing game assets
- Play an interactive canvas-based game
- Collect coins to earn XP and level up
- Perform actions to gain experience points
- Track your player stats (level, XP, last action time)
- Manage your NFT collection

## Smart Contract Features
- GameNFT.sol: Standard ERC-721 NFT contract with metadata support
- GameLogic.sol: Advanced game mechanics with player registration, progression, and action management
- Player statistics tracking (level, XP, cooldowns)
- NFT minting with dynamic metadata
- Role-based access control for game administration

## Available Scripts
- `./build-and-run.sh` - Install dependencies and prepare the project
- `./simple-deploy.js` - Generate contract information for frontend
- `./start-frontend.sh` - Start the game frontend server
- `./automated-setup.sh` - Fully automated setup (Hardhat node + deployment + frontend)