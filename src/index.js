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
    this.playerAchievements = [];
    this.gameState = {
      score: 0,
      coinsCollected: 0,
      enemiesDefeated: 0
    };
    
    this.initializeElements();
    this.setupEventListeners();
    this.loadContractInfo();
    this.checkWalletConnection();
    this.setupAchievementNotifications();
  }
  
  initializeElements() {
    this.connectButton = document.getElementById('connectWallet');
    this.walletStatus = document.getElementById('walletStatus');
    this.mintButton = document.getElementById('mintNFT');
    this.playButton = document.getElementById('playGame');
    this.performActionButton = document.getElementById('performAction');
    this.upgradeNFTButton = document.getElementById('upgradeNFT');
    this.claimRewardButton = document.getElementById('claimReward');
    this.playerAssets = document.getElementById('playerAssets');
    this.gameStateDisplay = document.getElementById('gameState');
    this.gameStats = document.getElementById('gameStats');
    this.achievementsPanel = document.getElementById('achievementsPanel');
    this.inventoryPanel = document.getElementById('inventoryPanel');
    
    // Create additional UI elements if they don't exist
    this.createAdditionalUI();
  }
  
  createAdditionalUI() {
    // Add new buttons if they don't exist
    if (!this.upgradeNFTButton) {
      const controlsDiv = document.querySelector('.controls');
      if (controlsDiv) {
        this.upgradeNFTButton = document.createElement('button');
        this.upgradeNFTButton.id = 'upgradeNFT';
        this.upgradeNFTButton.textContent = 'Upgrade NFT';
        this.upgradeNFTButton.onclick = () => this.upgradeNFT();
        controlsDiv.appendChild(this.upgradeNFTButton);
      }
    }
    
    if (!this.claimRewardButton) {
      const controlsDiv = document.querySelector('.controls');
      if (controlsDiv) {
        this.claimRewardButton = document.createElement('button');
        this.claimRewardButton.id = 'claimReward';
        this.claimRewardButton.textContent = 'Claim Daily Reward';
        this.claimRewardButton.onclick = () => this.claimDailyReward();
        controlsDiv.appendChild(this.claimRewardButton);
      }
    }
    
    // Add achievements panel if it doesn't exist
    if (!this.achievementsPanel) {
      const gameSection = document.querySelector('.game-section');
      if (gameSection) {
        this.achievementsPanel = document.createElement('div');
        this.achievementsPanel.id = 'achievementsPanel';
        this.achievementsPanel.className = 'achievements-panel';
        this.achievementsPanel.innerHTML = '<h3>Achievements</h3><div id="achievementsList"></div>';
        gameSection.appendChild(this.achievementsPanel);
      }
    }
    
    // Add inventory panel if it doesn't exist
    if (!this.inventoryPanel) {
      const gameSection = document.querySelector('.game-section');
      if (gameSection) {
        this.inventoryPanel = document.createElement('div');
        this.inventoryPanel.id = 'inventoryPanel';
        this.inventoryPanel.className = 'inventory-panel';
        this.inventoryPanel.innerHTML = '<h3>Inventory</h3><div id="inventoryList"></div>';
        gameSection.appendChild(this.inventoryPanel);
      }
    }
  }
  
  setupEventListeners() {
    if (this.connectButton) this.connectButton.addEventListener('click', () => this.connectWallet());
    if (this.mintButton) this.mintButton.addEventListener('click', () => this.mintNFT());
    if (this.playButton) this.playButton.addEventListener('click', () => this.toggleGame());
    if (this.performActionButton) this.performActionButton.addEventListener('click', () => this.performAction());
    if (this.upgradeNFTButton) this.upgradeNFTButton.addEventListener('click', () => this.upgradeNFT());
    if (this.claimRewardButton) this.claimRewardButton.addEventListener('click', () => this.claimDailyReward());
  }
  
  setupAchievementNotifications() {
    // Create a notification area for achievements
    if (!document.getElementById('notificationArea')) {
      const notificationArea = document.createElement('div');
      notificationArea.id = 'notificationArea';
      notificationArea.style.position = 'fixed';
      notificationArea.style.top = '20px';
      notificationArea.style.right = '20px';
      notificationArea.style.zIndex = '1000';
      notificationArea.style.display = 'flex';
      notificationArea.style.flexDirection = 'column';
      notificationArea.style.alignItems = 'flex-end';
      document.body.appendChild(notificationArea);
    }
  }
  
  showNotification(message, type = 'info') {
    const notificationArea = document.getElementById('notificationArea');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.background = type === 'success' ? '#4CAF50' : type === 'warning' ? '#FF9800' : '#2196F3';
    notification.style.color = 'white';
    notification.style.padding = '10px 15px';
    notification.style.margin = '5px';
    notification.style.borderRadius = '4px';
    notification.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
    notification.style.minWidth = '200px';
    notification.style.textAlign = 'center';
    
    notificationArea.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
      notification.remove();
    }, 3000);
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
      if (this.connectButton) this.connectButton.disabled = true;
      
      // Update player stats
      await this.updatePlayerStats();
      this.updatePlayerAssets();
      this.updateAchievements();
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
        if (this.connectButton) this.connectButton.disabled = true;
        
        // Register player if not already registered
        await this.registerPlayer();
        
        // Update player stats
        await this.updatePlayerStats();
        this.updatePlayerAssets();
        this.updateAchievements();
        
        console.log('Wallet connected:', accounts[0]);
        this.showNotification('Wallet connected successfully!', 'success');
      } else {
        alert('Please install MetaMask!');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Error connecting wallet: ' + error.message);
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
      this.gameStateDisplay.innerHTML = 'Registering player...';
      const tx = await this.contract.registerPlayer();
      await tx.wait();
      this.gameStateDisplay.innerHTML = 'Player registered successfully!';
      console.log('Player registered successfully');
      this.showNotification('Player registered successfully!', 'success');
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
      this.gameStateDisplay.innerHTML = 'Minting NFT...';
      
      // Create metadata for the NFT (in a real app, this would be uploaded to IPFS)
      const timestamp = Date.now();
      const randomId = Math.floor(Math.random() * 10000);
      const metadata = {
        name: `Game Character #${randomId}`,
        description: 'A unique character in the blockchain game',
        image: `https://api.dicebear.com/6.x/avataaars/svg?seed=${randomId}&backgroundColor=b6e3f4,c0aede,d1d4f9`,
        attributes: [
          { trait_type: 'level', value: this.playerInfo ? this.playerInfo.level : 1 },
          { trait_type: 'rarity', value: 'common' },
          { trait_type: 'experience', value: this.playerInfo ? this.playerInfo.experience : 0 },
          { trait_type: 'timestamp', value: timestamp }
        ]
      };
      
      // In a real app, we would upload metadata to IPFS and use the hash
      // For demo purposes, we'll use a data URI
      const metadataUri = `data:application/json,${encodeURIComponent(JSON.stringify(metadata))}`;
      
      const tx = await this.contract.mintNFT(metadataUri);
      await tx.wait();
      
      this.gameStateDisplay.innerHTML = 'NFT minted successfully!';
      await this.updatePlayerStats();
      this.updatePlayerAssets();
      this.updateAchievements();
      this.showNotification('NFT minted successfully!', 'success');
      
      console.log('NFT minted successfully');
    } catch (error) {
      console.error('Error minting NFT:', error);
      this.gameStateDisplay.innerHTML = 'Error minting NFT';
      alert('Error minting NFT: ' + error.message);
    }
  }
  
  async upgradeNFT() {
    if (!this.signer) {
      alert('Please connect wallet first');
      return;
    }
    
    if (!this.contract) {
      alert('Contract not deployed yet');
      return;
    }
    
    // For simplicity, let's upgrade the first NFT in the player's collection
    if (!this.playerInfo || this.playerInfo.nfts.length === 0) {
      alert('You have no NFTs to upgrade');
      return;
    }
    
    try {
      this.gameStateDisplay.innerHTML = 'Upgrading NFT...';
      
      // Select the first NFT for upgrade (in a real game, user would select)
      const tokenId = this.playerInfo.nfts[0];
      
      const tx = await this.contract.upgradeNFT(tokenId);
      await tx.wait();
      
      this.gameStateDisplay.innerHTML = 'NFT upgraded successfully!';
      await this.updatePlayerStats();
      this.updatePlayerAssets();
      this.showNotification('NFT upgraded successfully!', 'success');
      
      console.log('NFT upgraded successfully');
    } catch (error) {
      console.error('Error upgrading NFT:', error);
      this.gameStateDisplay.innerHTML = 'Error upgrading NFT';
      alert('Error upgrading NFT: ' + error.message);
    }
  }
  
  async claimDailyReward() {
    if (!this.signer) {
      alert('Please connect wallet first');
      return;
    }
    
    if (!this.contract) {
      alert('Contract not deployed yet');
      return;
    }
    
    try {
      this.gameStateDisplay.innerHTML = 'Claiming daily reward...';
      
      const tx = await this.contract.claimDailyReward();
      await tx.wait();
      
      this.gameStateDisplay.innerHTML = 'Daily reward claimed successfully!';
      await this.updatePlayerStats();
      this.updatePlayerAssets();
      this.showNotification('Daily reward claimed successfully!', 'success');
      
      console.log('Daily reward claimed successfully');
    } catch (error) {
      console.error('Error claiming daily reward:', error);
      this.gameStateDisplay.innerHTML = 'Error claiming reward';
      if (error.message.includes('once per day')) {
        alert('You can only claim daily reward once per day.');
      } else {
        alert('Error claiming daily reward: ' + error.message);
      }
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
      this.gameStateDisplay.innerHTML = 'Performing action...';
      
      const tx = await this.contract.performAction();
      await tx.wait();
      
      this.gameStateDisplay.innerHTML = 'Action completed!';
      await this.updatePlayerStats();
      this.updatePlayerAssets();
      this.updateAchievements();
      this.showNotification('Action completed successfully!', 'success');
      
      console.log('Action performed successfully');
    } catch (error) {
      console.error('Error performing action:', error);
      this.gameStateDisplay.innerHTML = 'Error performing action';
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
        lastActionTime: Number(playerData.lastActionTime),
        lastClaimTime: Number(playerData.lastClaimTime),
        totalRewards: Number(playerData.totalRewards),
        achievementPoints: Number(playerData.achievementPoints),
        nftCount: Number(playerData.nftCount)
      };
      
      this.gameStats.innerHTML = `
        <div class="stats-row">
          <span>Level: ${this.playerInfo.level}</span>
          <span>XP: ${this.playerInfo.experience}</span>
          <span>AP: ${this.playerInfo.achievementPoints}</span>
        </div>
        <div class="stats-row">
          <span>NFTs: ${this.playerInfo.nftCount}</span>
          <span>Rewards: ${(this.playerInfo.totalRewards / 1e18).toFixed(4)} ETH</span>
        </div>
        <div class="stats-row">
          <span>Last Action: ${this.playerInfo.lastActionTime > 0 ? new Date(this.playerInfo.lastActionTime * 1000).toLocaleTimeString() : 'Never'}</span>
          <span>Last Claim: ${this.playerInfo.lastClaimTime > 0 ? new Date(this.playerInfo.lastClaimTime * 1000).toLocaleTimeString() : 'Never'}</span>
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
      this.playerAssets.innerHTML = `
        Player Assets: 
        <span title="Number of NFTs">${this.playerInfo.nftCount} NFTs</span> | 
        <span title="Player Level">Level: ${this.playerInfo.level}</span> | 
        <span title="Achievement Points">AP: ${this.playerInfo.achievementPoints}</span>
      `;
      
      // Update inventory panel
      this.updateInventoryPanel();
    } else {
      this.playerAssets.innerHTML = 'Player Assets: Loading...';
      
      setTimeout(async () => {
        try {
          if (this.playerInfo) {
            this.playerAssets.innerHTML = `
              Player Assets: 
              <span title="Number of NFTs">${this.playerInfo.nftCount} NFTs</span> | 
              <span title="Player Level">Level: ${this.playerInfo.level}</span> | 
              <span title="Achievement Points">AP: ${this.playerInfo.achievementPoints}</span>
            `;
            this.updateInventoryPanel();
          }
        } catch (err) {
          console.error('Error getting asset count:', err);
          this.playerAssets.innerHTML = 'Player Assets: Error loading';
        }
      }, 1000);
    }
  }
  
  updateInventoryPanel() {
    if (!this.inventoryPanel || !this.playerInfo) return;
    
    let inventoryHtml = '<h3>Inventory</h3>';
    
    if (this.playerInfo.nfts.length > 0) {
      inventoryHtml += '<div class="inventory-grid">';
      
      // Show up to 9 NFTs in the inventory
      const nftsToShow = this.playerInfo.nfts.slice(0, 9);
      
      for (const tokenId of nftsToShow) {
        inventoryHtml += `
          <div class="nft-item" title="NFT #${tokenId}">
            <div class="nft-image">?</div>
            <div class="nft-info">
              <div>ID: ${tokenId}</div>
              <div>Lvl: ${this.playerInfo.level}</div>
            </div>
          </div>
        `;
      }
      
      inventoryHtml += '</div>';
      inventoryHtml += `<p>Total NFTs: ${this.playerInfo.nftCount}</p>`;
    } else {
      inventoryHtml += '<p>No NFTs in inventory yet. Mint some NFTs!</p>';
    }
    
    document.getElementById('inventoryList').innerHTML = inventoryHtml;
  }
  
  async updateAchievements() {
    if (!this.contract || !this.signer) return;
    
    try {
      const playerAddr = await this.signer.getAddress();
      const unlockedAchievements = await this.contract.getPlayerAchievements(playerAddr);
      
      // Convert to regular array
      this.playerAchievements = Array.from(unlockedAchievements).map(id => Number(id));
      
      // Display achievements
      this.displayAchievements();
    } catch (error) {
      console.error('Error fetching achievements:', error);
    }
  }
  
  displayAchievements() {
    if (!this.achievementsPanel) return;
    
    let achievementsHtml = '<h3>Achievements</h3>';
    
    if (this.playerAchievements.length > 0) {
      achievementsHtml += '<div class="achievements-grid">';
      
      for (const achievementId of this.playerAchievements) {
        // In a real app, we would fetch achievement details from the contract
        // For now, we'll use placeholder names
        let achName, achDesc;
        
        switch(achievementId) {
          case 0:
            achName = "First Steps";
            achDesc = "Registered to the game";
            break;
          case 1:
            achName = "Active Player";
            achDesc = "Reached level 5";
            break;
          case 2:
            achName = "NFT Collector";
            achDesc = "Own 10 NFTs";
            break;
          case 3:
            achName = "Marathon Player";
            achDesc = "Performed 50 actions";
            break;
          default:
            achName = `Achievement ${achievementId}`;
            achDesc = `Unlocked achievement #${achievementId}`;
        }
        
        achievementsHtml += `
          <div class="achievement-item unlocked">
            <div class="achievement-icon">🏆</div>
            <div class="achievement-details">
              <div class="achievement-title">${achName}</div>
              <div class="achievement-desc">${achDesc}</div>
            </div>
          </div>
        `;
      }
      
      achievementsHtml += '</div>';
      achievementsHtml += `<p>Unlocked: ${this.playerAchievements.length} of ?</p>`;
    } else {
      achievementsHtml += '<p>No achievements unlocked yet. Keep playing to unlock achievements!</p>';
    }
    
    document.getElementById('achievementsList').innerHTML = achievementsHtml;
  }
  
  toggleGame() {
    if (!this.gameStarted) {
      this.gameStarted = true;
      this.gameStateDisplay.innerHTML = 'Game started!';
      if (this.playButton) this.playButton.textContent = 'Pause Game';
      
      // Initialize game canvas
      this.initGameCanvas();
      
      // Start game loop
      this.startGameLoop();
    } else {
      this.gameStarted = false;
      this.gameStateDisplay.innerHTML = 'Game paused!';
      if (this.playButton) this.playButton.textContent = 'Resume Game';
      
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
    if (!this.canvas) {
      // Create canvas if it doesn't exist
      this.canvas = document.createElement('canvas');
      this.canvas.id = 'gameCanvas';
      this.canvas.width = 600;
      this.canvas.height = 400;
      
      const gameSection = document.querySelector('.game-section');
      if (gameSection) {
        gameSection.appendChild(this.canvas);
      }
    }
    
    this.ctx = this.canvas.getContext('2d');
    
    // Initialize game objects
    this.player = {
      x: 50,
      y: 50,
      width: 50,
      height: 50,
      color: '#4CAF50',
      speed: 5,
      health: 100
    };
    
    this.enemies = [
      { x: 200, y: 150, width: 30, height: 30, color: '#2196F3', speed: 1 },
      { x: 300, y: 250, width: 30, height: 30, color: '#2196F3', speed: 1 },
      { x: 400, y: 100, width: 30, height: 30, color: '#F44336', speed: 1.5 } // Faster enemy
    ];
    
    this.coins = [
      { x: 350, y: 100, width: 25, height: 25, color: '#FF9800', collected: false },
      { x: 150, y: 200, width: 25, height: 25, color: '#FF9800', collected: false },
      { x: 400, y: 300, width: 25, height: 25, color: '#FF9800', collected: false },
      { x: 100, y: 350, width: 25, height: 25, color: '#FFD700', collected: false, value: 2 } // Special coin
    ];
    
    // Power-ups
    this.powerUps = [
      { x: 500, y: 200, width: 20, height: 20, color: '#9C27B0', type: 'speed', active: false, duration: 0 }
    ];
    
    // Setup keyboard controls
    this.keys = {};
    document.addEventListener('keydown', (e) => {
      this.keys[e.key.toLowerCase()] = true;
    });
    
    document.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false;
    });
    
    // Initial draw
    this.drawGameFrame();
  }
  
  drawGameFrame() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Handle player movement based on keys pressed
    if (this.keys['arrowleft'] || this.keys['a']) {
      this.player.x = Math.max(0, this.player.x - this.player.speed);
    }
    if (this.keys['arrowright'] || this.keys['d']) {
      this.player.x = Math.min(this.canvas.width - this.player.width, this.player.x + this.player.speed);
    }
    if (this.keys['arrowup'] || this.keys['w']) {
      this.player.y = Math.min(this.canvas.height - this.player.height, this.player.y - this.player.speed);
    }
    if (this.keys['arrowdown'] || this.keys['s']) {
      this.player.y = Math.max(0, this.player.y + this.player.speed);
    }
    
    // Move enemies (simple AI)
    this.enemies.forEach(enemy => {
      // Simple AI: move towards player
      if (enemy.x < this.player.x) enemy.x += enemy.speed;
      else enemy.x -= enemy.speed;
      
      if (enemy.y < this.player.y) enemy.y += enemy.speed;
      else enemy.y -= enemy.speed;
      
      // Keep enemy in bounds
      enemy.x = Math.max(0, Math.min(this.canvas.width - enemy.width, enemy.x));
      enemy.y = Math.max(0, Math.min(this.canvas.height - enemy.height, enemy.y));
    });
    
    // Draw player
    this.ctx.fillStyle = this.player.color;
    this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
    
    // Draw player health bar
    this.ctx.fillStyle = 'red';
    this.ctx.fillRect(this.player.x, this.player.y - 10, this.player.width, 5);
    this.ctx.fillStyle = 'green';
    this.ctx.fillRect(this.player.x, this.player.y - 10, this.player.width * (this.player.health / 100), 5);
    
    // Draw enemies
    this.enemies.forEach(enemy => {
      this.ctx.fillStyle = enemy.color;
      this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });
    
    // Draw coins (only if not collected)
    this.coins.forEach(coin => {
      if (!coin.collected) {
        this.ctx.fillStyle = coin.color;
        this.ctx.beginPath();
        this.ctx.arc(coin.x + coin.width/2, coin.y + coin.height/2, coin.width/2, 0, Math.PI * 2);
        this.ctx.fill();
      }
    });
    
    // Draw power-ups
    this.powerUps.forEach(powerUp => {
      if (!powerUp.active) {
        this.ctx.fillStyle = powerUp.color;
        this.ctx.beginPath();
        this.ctx.arc(powerUp.x + powerUp.width/2, powerUp.y + powerUp.height/2, powerUp.width/2, 0, Math.PI * 2);
        this.ctx.fill();
      }
    });
    
    // Draw game instructions
    this.ctx.fillStyle = 'black';
    this.ctx.font = '14px Arial';
    this.ctx.fillText('Blockchain Game - WASD or Arrow Keys to move', 10, 20);
    
    // Draw player info on canvas
    if (this.playerInfo) {
      this.ctx.fillText(`Level: ${this.playerInfo.level} | XP: ${this.playerInfo.experience} | AP: ${this.playerInfo.achievementPoints}`, 10, this.canvas.height - 30);
    }
    
    // Draw game state
    this.ctx.fillText(`Coins: ${this.gameState.coinsCollected} | Score: ${this.gameState.score}`, 10, this.canvas.height - 10);
    
    // Check for collisions
    this.checkCollisions();
  }
  
  checkCollisions() {
    // Check for coin collection
    this.coins.forEach((coin, index) => {
      if (!coin.collected && 
          this.player.x < coin.x + coin.width &&
          this.player.x + this.player.width > coin.x &&
          this.player.y < coin.y + coin.height &&
          this.player.y + this.player.height > coin.y) {
        coin.collected = true;
        this.gameState.coinsCollected += (coin.value || 1);
        this.gameState.score += (coin.value || 1) * 10;
        
        // Visual feedback
        console.log(`Coin collected! Total: ${this.gameState.coinsCollected}`);
        
        // Perform an action in the game when collecting a coin
        if (this.contract && this.signer && Math.random() > 0.7) { // 30% chance to perform action
          setTimeout(() => {
            this.performAction();
          }, 1000);
        }
      }
    });
    
    // Check for power-up collection
    this.powerUps.forEach((powerUp, index) => {
      if (!powerUp.active && 
          this.player.x < powerUp.x + powerUp.width &&
          this.player.x + this.player.width > powerUp.x &&
          this.player.y < powerUp.y + powerUp.height &&
          this.player.y + this.player.height > powerUp.y) {
        powerUp.active = true;
        powerUp.duration = 300; // 10 seconds at 30fps
        
        // Apply power-up effect
        if (powerUp.type === 'speed') {
          this.player.speed += 2;
          console.log('Speed boost activated!');
          this.showNotification('Speed Boost Activated!', 'success');
          
          // Remove boost after duration
          setTimeout(() => {
            this.player.speed = 5; // Back to normal speed
            console.log('Speed boost ended');
            powerUp.active = false; // Reset for respawn
          }, 10000);
        }
      }
    });
    
    // Check for enemy collision
    this.enemies.forEach(enemy => {
      if (this.player.x < enemy.x + enemy.width &&
          this.player.x + this.player.width > enemy.x &&
          this.player.y < enemy.y + enemy.height &&
          this.player.y + this.player.height > enemy.y) {
        // Player hit by enemy
        this.player.health -= 10;
        console.log(`Hit by enemy! Health: ${this.player.health}`);
        
        if (this.player.health <= 0) {
          // Game over
          this.gameStateDisplay.innerHTML = 'GAME OVER! Health depleted.';
          this.gameStarted = false;
          if (this.playButton) this.playButton.textContent = 'Start Game';
          
          // Reset player
          this.player.health = 100;
          this.player.x = 50;
          this.player.y = 50;
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
  // Update UI to reflect disconnected state
  const walletStatus = document.getElementById('walletStatus');
  if (walletStatus) {
    walletStatus.innerHTML = 'Not connected';
  }
  
  const connectButton = document.getElementById('connectWallet');
  if (connectButton) {
    connectButton.disabled = false;
  }
});