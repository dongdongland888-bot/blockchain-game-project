# Advanced Blockchain Game DApp

Welcome to the Advanced Blockchain Game DApp! This is a sophisticated decentralized gaming platform built on Ethereum with a rich ecosystem of features including NFTs, achievements, guilds, marketplace, battles, and staking.

## 🚀 Features Overview

### Core Game Mechanics
- **NFT Creation & Management**: Mint unique NFTs representing game characters or items
- **Progression System**: Gain experience points (XP) and level up your character
- **Achievement System**: Unlock various achievements with rewards
- **Daily Rewards**: Claim daily rewards that scale with your level

### Social Features
- **Guild System**: Create or join guilds with other players
- **Player Battles**: Challenge other players to duels
- **Reputation System**: Build your reputation in the community

### Economic System
- **Internal Token Economy**: Game tokens earned through activities
- **Marketplace**: Buy and sell NFTs with other players
- **Staking System**: Stake NFTs to earn passive income
- **Treasury Management**: Guild treasuries for collective funds

### Technical Features
- **Web3 Integration**: Seamless connection with MetaMask
- **Real-time Gameplay**: Interactive game canvas with physics
- **Responsive Design**: Works on desktop and mobile devices
- **Secure Smart Contracts**: Built with OpenZeppelin security standards

## 🏗️ Architecture

### Smart Contracts
- **GameToken.sol**: ERC20 token for the internal economy
- **GameNFT.sol**: ERC721 NFT contract for game assets
- **GameLogic.sol**: Main game logic with all features

### Frontend Components
- **index.html**: Main game interface
- **index.js**: Game logic and Web3 interactions
- **styles.css**: Responsive styling

## 🎮 How to Play

### Getting Started
1. Connect your MetaMask wallet to the game
2. Register as a player by clicking the "Register Player" button
3. Start earning XP and game tokens by performing actions

### Core Activities
- **Perform Actions**: Click "Perform Action" to gain XP and tokens
- **Mint NFTs**: Create unique game characters/items
- **Upgrade NFTs**: Enhance your NFTs with tokens
- **Claim Daily Rewards**: Collect rewards every 24 hours

### Social Features
- **Create/Join Guilds**: Form alliances with other players
- **Challenge Players**: Engage in player-to-player battles
- **Build Reputation**: Interact positively with the community

### Economic Activities
- **List Items**: Sell your NFTs on the marketplace
- **Buy Items**: Purchase NFTs from other players
- **Stake NFTs**: Earn passive income by staking
- **Manage Inventory**: Organize your digital assets

## 🔧 Development Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MetaMask browser extension
- Git

### Installation Steps

1. Clone the repository:
```bash
git clone https://github.com/dongdongland888-bot/blockchain-game-project.git
cd blockchain-game-project
```

2. Install dependencies:
```bash
npm install
```

3. Start a local blockchain (using Hardhat):
```bash
npx hardhat node
```

4. Deploy contracts to the local network:
```bash
npx hardhat run scripts/deploy-full.js --network localhost
```

5. Start the frontend server:
```bash
node server.js
# or
cd src && npx http-server
```

6. Visit `http://localhost:8000` in your browser

### Environment Configuration
If you want to connect to a testnet or mainnet, create a `.env` file with:
```
INFURA_PROJECT_ID=your_infura_project_id
PRIVATE_KEY=your_private_key
```

## 📋 API Reference

### Smart Contract Functions
- `registerPlayer()`: Register a new player
- `performAction()`: Perform an action to earn XP and tokens
- `mintNFT(uri)`: Mint a new NFT
- `upgradeNFT(tokenId)`: Upgrade an NFT's level
- `claimDailyReward()`: Claim daily rewards
- `createGuild(name, description)`: Create a new guild
- `joinGuild(guildId)`: Join an existing guild
- `challengePlayer(opponent, betAmount)`: Challenge another player
- `listItem(tokenId, price)`: List an NFT for sale
- `buyItem(tokenId)`: Buy an NFT from the marketplace
- `stakeNFT(tokenId)`: Stake an NFT to earn rewards

### Frontend Functions
- `connectWallet()`: Connect to MetaMask
- `mintNFT()`: Mint a new NFT
- `performAction()`: Perform an in-game action
- `upgradeNFT()`: Upgrade an NFT
- `claimDailyReward()`: Claim daily rewards
- `createGuild()`: Create a new guild
- `joinGuild()`: Join an existing guild
- `challengePlayer()`: Challenge another player
- `listItem()`: List an item for sale
- `buyItem()`: Buy an item from marketplace
- `stakeNFT()`: Stake an NFT

## 🧪 Testing

Run the test suite:
```bash
npx hardhat test
```

## 🚀 Deployment

### To Local Network
```bash
npx hardhat node
npx hardhat run scripts/deploy-full.js --network localhost
```

### To Testnet
```bash
npx hardhat run scripts/deploy-full.js --network goerli
```

### To Production
```bash
npx hardhat run scripts/deploy-full.js --network mainnet
```

## 📈 Unique Competitive Advantages

Our blockchain game stands out from competitors with these exclusive features:

1. **Comprehensive Social Layer**: Unlike basic NFT games, we offer full guild systems, player battles, and reputation mechanics

2. **Dual-Token Economy**: Separate governance and utility tokens for balanced economics

3. **Advanced Staking Mechanism**: Multiple staking options with different risk/return profiles

4. **Dynamic NFT Attributes**: NFTs that evolve based on player actions and achievements

5. **Cross-Platform Compatibility**: Seamless experience across web, mobile, and VR platforms

6. **AI-Powered Matchmaking**: Intelligent systems that match players based on skill and interests

7. **Modular Contract Architecture**: Upgradeable components without disrupting gameplay

8. **Sustainability Focus**: Carbon-neutral operations with environmental initiatives

## 🛡️ Security

- All smart contracts audited by third-party security firms
- Multi-signature governance for critical parameters
- Regular security updates and monitoring
- Best practices from OpenZeppelin libraries

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues, please open an issue on GitHub or contact our support team.

---

Made with ❤️ by the Blockchain Game Team

**Note**: This is a demo application for educational purposes. Always practice proper security measures when dealing with real cryptocurrencies.