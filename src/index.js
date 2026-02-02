import { ethers } from 'ethers';
import './styles.css';

class BlockchainGame {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.gameStarted = false;
    this.gameLoopId = null;
    this.playerInfo = null;
    
    this.initializeElements();
    this.setupEventListeners();
    this.loadContractInfo();
    this.checkWalletConnection();
  }
  
  initializeElements() {
    this.connectButton = document.getElementById('connectWallet');
    this.walletStatus = document.getElementById('walletStatus');
    this.mintButton = document.getElementById('mintNFT');
    this.playButton = document.getElementById('playGame');
    this.performActionButton = document.getElementById('performAction');
    this.playerAssets = document.getElementById('playerAssets');
    this.gameState = document.getElementById('gameState');
    this.gameStats = document.getElementById('gameStats');
  }
  
  setupEventListeners() {
    this.connectButton.addEventListener('click', () => this.connectWallet());
    this.mintButton.addEventListener('click', () => this.mintNFT());
    this.playButton.addEventListener('click', () => this.toggleGame());
    this.performActionButton.addEventListener('click', () => this.performAction());
  }
  
  async loadContractInfo() {
    try {
      // Load contract info from the deployed contract
      const response = await fetch('./contractInfo.json');
      if (response.ok) {
        this.contractInfo = await response.json();
        console.log('Contract info loaded:', this.contractInfo.address);
      } else {
        console.log('No deployed contract info found');
      }
    } catch (error) {
      console.error('Error loading contract info:', error);
    }
  }
  
  async checkWalletConnection() {
    // Check if user already has a wallet connected
    if (typeof window.ethereum !== 'undefined' && window.ethereum.selectedAddress) {
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();
      
      // Connect to the deployed contract if available
      if (this.contractInfo) {
        const contractABI = this.contractInfo.abi;
        const contractAddress = this.contractInfo.address;
        
        this.contract = new ethers.Contract(contractAddress, contractABI, this.signer);
        console.log('Connected to contract:', contractAddress);
      }
      
      // Update UI
      this.walletStatus.innerHTML = `Connected: ${window.ethereum.selectedAddress.substring(0, 6)}...${window.ethereum.selectedAddress.substring(window.ethereum.selectedAddress.length - 4)}`;
      this.connectButton.disabled = true;
      
      // Update player stats
      await this.updatePlayerStats();
      this.updatePlayerAssets();
    }
  }
  
  async connectWallet() {
    try {
      if (typeof window.ethereum !== 'undefined') {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        // Initialize provider and signer
        this.provider = new ethers.BrowserProvider(window.ethereum);
        this.signer = await this.provider.getSigner();
        
        // Connect to the deployed contract if available
        if (this.contractInfo) {
          const contractABI = this.contractInfo.abi;
          const contractAddress = this.contractInfo.address;
          
          this.contract = new ethers.Contract(contractAddress, contractABI, this.signer);
          console.log('Connected to contract:', contractAddress);
        }
        
        // Update UI
        this.walletStatus.innerHTML = `Connected: ${accounts[0].substring(0, 6)}...${accounts[0].substring(accounts[0].length - 4)}`;
        this.connectButton.disabled = true;
        
        // Register player if not already registered
        await this.registerPlayer();
        
        // Update player stats
        await this.updatePlayerStats();
        this.updatePlayerAssets();
        
        console.log('Wallet connected:', accounts[0]);
      } else {
        alert('Please install MetaMask!');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Error connecting wallet');
    }
  }
  
  async registerPlayer() {
    if (!this.contract) {
      console.log('Contract not available, skipping registration');
      return;
    }
    
    try {
      // Check if player is already registered
      const playerInfo = await this.contract.getPlayerInfo(await this.signer.getAddress());
      if (playerInfo.exists) {
        console.log('Player already registered');
        return;
      }
      
      // Register the player
      this.gameState.innerHTML = 'Registering player...';
      const tx = await this.contract.registerPlayer();
      await tx.wait();
      this.gameState.innerHTML = 'Player registered successfully!';
      console.log('Player registered successfully');
    } catch (error) {
      console.error('Error registering player:', error);
      // This might fail if player is already registered, which is okay
    }
  }
  
  async mintNFT() {
    if (!this.signer) {
      alert('Please connect wallet first');
      return;
    }
    
    if (!this.contract) {
      alert('Contract not deployed yet');
      return;
    }
    
    try {
      this.gameState.innerHTML = 'Minting NFT...';
      
      // Create metadata for the NFT (in a real app, this would be uploaded to IPFS)
      const metadata = {
        name: `Game Character #${Math.floor(Math.random() * 10000)}`,
        description: 'A unique character in the blockchain game',
        image: 'https://via.placeholder.com/300x300/4CAF50/white?text=NFT',
        attributes: [
          { trait_type: 'level', value: this.playerInfo ? this.playerInfo.level : 1 },
          { trait_type: 'rarity', value: 'common' },
          { trait_type: 'experience', value: this.playerInfo ? this.playerInfo.experience : 0 }
        ]
      };
      
      // In a real app, we would upload metadata to IPFS and use the hash
      // For demo purposes, we'll use a data URI
      const metadataUri = `data:application/json,${encodeURIComponent(JSON.stringify(metadata))}`;
      
      const tx = await this.contract.mintNFT(metadataUri);
      await tx.wait();
      
      this.gameState.innerHTML = 'NFT minted successfully!';
      await this.updatePlayerStats();
      this.updatePlayerAssets();
      
      console.log('NFT minted successfully');
    } catch (error) {
      console.error('Error minting NFT:', error);
      this.gameState.innerHTML = 'Error minting NFT';
      alert('Error minting NFT: ' + error.message);
    }
  }
  
  async performAction() {
    if (!this.signer) {
      alert('Please connect wallet first');
      return;
    }
    
    if (!this.contract) {
      alert('Contract not deployed yet');
      return;
    }
    
    try {
      this.gameState.innerHTML = 'Performing action...';
      
      const tx = await this.contract.performAction();
      await tx.wait();
      
      this.gameState.innerHTML = 'Action completed!';
      await this.updatePlayerStats();
      this.updatePlayerAssets();
      
      console.log('Action performed successfully');
    } catch (error) {
      console.error('Error performing action:', error);
      this.gameState.innerHTML = 'Error performing action';
      if (error.message.includes('cooldown')) {
        alert('Action still on cooldown. Please wait before trying again.');
      } else {
        alert('Error performing action: ' + error.message);
      }
    }
  }
  
  async updatePlayerStats() {
    if (!this.contract || !this.signer) {
      return;
    }
    
    try {
      const playerAddr = await this.signer.getAddress();
      const playerData = await this.contract.getPlayerInfo(playerAddr);
      
      // Convert BigNumber values to regular numbers
      this.playerInfo = {
        nfts: Array.from(playerData.nfts),
        level: Number(playerData.level),
        experience: Number(playerData.experience),
        lastActionTime: Number(playerData.lastActionTime)
      };
      
      this.gameStats.innerHTML = `
        <div class="stats-row">
          <span>Level: ${this.playerInfo.level}</span>
          <span>XP: ${this.playerInfo.experience}</span>
        </div>
        <div class="stats-row">
          <span>Last Action: ${this.playerInfo.lastActionTime > 0 ? new Date(this.playerInfo.lastActionTime * 1000).toLocaleTimeString() : 'Never'}</span>
        </div>
      `;
    } catch (error) {
      console.error('Error updating player stats:', error);
    }
  }
  
  updatePlayerAssets() {
    if (!this.contract || !this.signer) {
      this.playerAssets.innerHTML = 'Player Assets: Connect wallet to see assets';
      return;
    }
    
    if (this.playerInfo) {
      this.playerAssets.innerHTML = `Player Assets: ${this.playerInfo.nfts.length} NFTs | Level: ${this.playerInfo.level}`;
    } else {
      // Fallback: try to get balance directly
      this.playerAssets.innerHTML = 'Player Assets: Loading...';
      
      setTimeout(async () => {
        try {
          // This is a simplified approach - in a real contract we'd have a different method
          // For now, we'll just show the NFT count from player info if available
          if (this.playerInfo) {
            this.playerAssets.innerHTML = `Player Assets: ${this.playerInfo.nfts.length} NFTs | Level: ${this.playerInfo.level}`;
          }
        } catch (err) {
          console.error('Error getting asset count:', err);
          this.playerAssets.innerHTML = 'Player Assets: Error loading';
        }
      }, 1000);
    }
  }
  
  toggleGame() {
    if (!this.gameStarted) {
      this.gameStarted = true;
      this.gameState.innerHTML = 'Game started!';
      this.playButton.textContent = 'Pause Game';
      
      // Initialize game canvas
      this.initGameCanvas();
      
      // Start game loop
      this.startGameLoop();
    } else {
      this.gameStarted = false;
      this.gameState.innerHTML = 'Game paused!';
      this.playButton.textContent = 'Resume Game';
      
      // Stop game loop
      if (this.gameLoopId) {
        clearInterval(this.gameLoopId);
        this.gameLoopId = null;
      }
    }
  }
  
  startGameLoop() {
    if (this.gameLoopId) {
      clearInterval(this.gameLoopId);
    }
    
    this.gameLoopId = setInterval(() => {
      if (this.gameStarted) {
        this.drawGameFrame();
      }
    }, 1000 / 30); // 30 FPS
  }
  
  initGameCanvas() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    
    // Initialize game objects
    this.player = {
      x: 50,
      y: 50,
      width: 50,
      height: 50,
      color: '#4CAF50',
      speed: 5
    };
    
    this.enemies = [
      { x: 200, y: 150, width: 30, height: 30, color: '#2196F3' },
      { x: 300, y: 250, width: 30, height: 30, color: '#2196F3' }
    ];
    
    this.coins = [
      { x: 350, y: 100, width: 25, height: 25, color: '#FF9800', collected: false },
      { x: 150, y: 200, width: 25, height: 25, color: '#FF9800', collected: false },
      { x: 400, y: 300, width: 25, height: 25, color: '#FF9800', collected: false }
    ];
    
    // Setup keyboard controls
    this.keys = {};
    document.addEventListener('keydown', (e) => {
      this.keys[e.key] = true;
    });
    
    document.addEventListener('keyup', (e) => {
      this.keys[e.key] = false;
    });
    
    // Initial draw
    this.drawGameFrame();
  }
  
  drawGameFrame() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Handle player movement based on keys pressed
    if (this.keys['ArrowLeft'] || this.keys['a']) {
      this.player.x = Math.max(0, this.player.x - this.player.speed);
    }
    if (this.keys['ArrowRight'] || this.keys['d']) {
      this.player.x = Math.min(this.canvas.width - this.player.width, this.player.x + this.player.speed);
    }
    if (this.keys['ArrowUp'] || this.keys['w']) {
      this.player.y = Math.min(this.canvas.height - this.player.height, this.player.y - this.player.speed);
    }
    if (this.keys['ArrowDown'] || this.keys['s']) {
      this.player.y = Math.max(0, this.player.y + this.player.speed);
    }
    
    // Draw player
    this.ctx.fillStyle = this.player.color;
    this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
    
    // Draw enemies
    this.enemies.forEach(enemy => {
      this.ctx.fillStyle = enemy.color;
      this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });
    
    // Draw coins (only if not collected)
    this.coins.forEach(coin => {
      if (!coin.collected) {
        this.ctx.fillStyle = coin.color;
        this.ctx.fillRect(coin.x, coin.y, coin.width, coin.height);
      }
    });
    
    // Draw game instructions
    this.ctx.fillStyle = 'black';
    this.ctx.font = '14px Arial';
    this.ctx.fillText('Blockchain Game - WASD or Arrow Keys to move', 10, 20);
    
    // Draw player info on canvas
    if (this.playerInfo) {
      this.ctx.fillText(`Level: ${this.playerInfo.level} | XP: ${this.playerInfo.experience}`, 10, this.canvas.height - 10);
    }
    
    // Check for collisions
    this.checkCollisions();
  }
  
  checkCollisions() {
    // Check for coin collection
    this.coins.forEach(coin => {
      if (!coin.collected && 
          this.player.x < coin.x + coin.width &&
          this.player.x + this.player.width > coin.x &&
          this.player.y < coin.y + coin.height &&
          this.player.y + this.player.height > coin.y) {
        coin.collected = true;
        console.log('Coin collected!');
        
        // Perform an action in the game when collecting a coin
        if (this.contract && this.signer) {
          this.performAction();
        }
      }
    });
  }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
  new BlockchainGame();
});

// Add a helper function to handle wallet disconnection
window.addEventListener('ethereum#disconnect', () => {
  console.log('Wallet disconnected');
  const gameInstance = new BlockchainGame(); // This would need to be handled differently in a real app
});