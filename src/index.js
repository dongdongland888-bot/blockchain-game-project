import { ethers } from 'ethers';
import './styles.css';

class BlockchainGame {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.gameTokenContract = null;
    this.gameLogicContract = null;
    this.gameStarted = false;
    this.gameLoopId = null;
    this.playerInfo = null;
    this.playerAchievements = [];
    this.guildInfo = null;
    this.marketItems = [];
    this.playerStakes = [];
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
    this.createGuildButton = document.getElementById('createGuild');
    this.joinGuildButton = document.getElementById('joinGuild');
    this.leaveGuildButton = document.getElementById('leaveGuild');
    this.challengePlayerButton = document.getElementById('challengePlayer');
    this.listItemButton = document.getElementById('listItem');
    this.buyItemButton = document.getElementById('buyItem');
    this.stakeNFTButton = document.getElementById('stakeNFT');
    this.unstakeNFTButton = document.getElementById('unstakeNFT');
    this.playerAssets = document.getElementById('playerAssets');
    this.gameStateDisplay = document.getElementById('gameState');
    this.gameStats = document.getElementById('gameStats');
    this.achievementsPanel = document.getElementById('achievementsPanel');
    this.inventoryPanel = document.getElementById('inventoryPanel');
    this.guildPanel = document.getElementById('guildPanel');
    this.marketplacePanel = document.getElementById('marketplacePanel');
    this.battlesPanel = document.getElementById('battlesPanel');
    this.stakingPanel = document.getElementById('stakingPanel');
    
    // Create additional UI elements if they don't exist
    this.createAdditionalUI();
  }
  
  createAdditionalUI() {
    // Add new buttons if they don't exist
    if (!this.createGuildButton) {
      const controlsDiv = document.querySelector('.controls');
      if (controlsDiv) {
        this.createGuildButton = document.createElement('button');
        this.createGuildButton.id = 'createGuild';
        this.createGuildButton.textContent = 'Create Guild';
        this.createGuildButton.onclick = () => this.createGuild();
        controlsDiv.appendChild(this.createGuildButton);
      }
    }
    
    if (!this.joinGuildButton) {
      const controlsDiv = document.querySelector('.controls');
      if (controlsDiv) {
        this.joinGuildButton = document.createElement('button');
        this.joinGuildButton.id = 'joinGuild';
        this.joinGuildButton.textContent = 'Join Guild';
        this.joinGuildButton.onclick = () => this.joinGuild();
        controlsDiv.appendChild(this.joinGuildButton);
      }
    }
    
    if (!this.leaveGuildButton) {
      const controlsDiv = document.querySelector('.controls');
      if (controlsDiv) {
        this.leaveGuildButton = document.createElement('button');
        this.leaveGuildButton.id = 'leaveGuild';
        this.leaveGuildButton.textContent = 'Leave Guild';
        this.leaveGuildButton.onclick = () => this.leaveGuild();
        controlsDiv.appendChild(this.leaveGuildButton);
      }
    }
    
    if (!this.challengePlayerButton) {
      const controlsDiv = document.querySelector('.controls');
      if (controlsDiv) {
        this.challengePlayerButton = document.createElement('button');
        this.challengePlayerButton.id = 'challengePlayer';
        this.challengePlayerButton.textContent = 'Challenge Player';
        this.challengePlayerButton.onclick = () => this.challengePlayer();
        controlsDiv.appendChild(this.challengePlayerButton);
      }
    }
    
    if (!this.listItemButton) {
      const controlsDiv = document.querySelector('.controls');
      if (controlsDiv) {
        this.listItemButton = document.createElement('button');
        this.listItemButton.id = 'listItem';
        this.listItemButton.textContent = 'List Item';
        this.listItemButton.onclick = () => this.listItem();
        controlsDiv.appendChild(this.listItemButton);
      }
    }
    
    if (!this.buyItemButton) {
      const controlsDiv = document.querySelector('.controls');
      if (controlsDiv) {
        this.buyItemButton = document.createElement('button');
        this.buyItemButton.id = 'buyItem';
        this.buyItemButton.textContent = 'Buy Item';
        this.buyItemButton.onclick = () => this.buyItem();
        controlsDiv.appendChild(this.buyItemButton);
      }
    }
    
    if (!this.stakeNFTButton) {
      const controlsDiv = document.querySelector('.controls');
      if (controlsDiv) {
        this.stakeNFTButton = document.createElement('button');
        this.stakeNFTButton.id = 'stakeNFT';
        this.stakeNFTButton.textContent = 'Stake NFT';
        this.stakeNFTButton.onclick = () => this.stakeNFT();
        controlsDiv.appendChild(this.stakeNFTButton);
      }
    }
    
    if (!this.unstakeNFTButton) {
      const controlsDiv = document.querySelector('.controls');
      if (controlsDiv) {
        this.unstakeNFTButton = document.createElement('button');
        this.unstakeNFTButton.id = 'unstakeNFT';
        this.unstakeNFTButton.textContent = 'Unstake NFT';
        this.unstakeNFTButton.onclick = () => this.unstakeNFT();
        controlsDiv.appendChild(this.unstakeNFTButton);
      }
    }
    
    // Add guild panel if it doesn't exist
    if (!this.guildPanel) {
      const gameSection = document.querySelector('.game-section');
      if (gameSection) {
        this.guildPanel = document.createElement('div');
        this.guildPanel.id = 'guildPanel';
        this.guildPanel.className = 'guild-panel';
        this.guildPanel.innerHTML = '<h3>Guild</h3><div id="guildInfo"></div>';
        gameSection.appendChild(this.guildPanel);
      }
    }
    
    // Add marketplace panel if it doesn't exist
    if (!this.marketplacePanel) {
      const gameSection = document.querySelector('.game-section');
      if (gameSection) {
        this.marketplacePanel = document.createElement('div');
        this.marketplacePanel.id = 'marketplacePanel';
        this.marketplacePanel.className = 'marketplace-panel';
        this.marketplacePanel.innerHTML = '<h3>Marketplace</h3><div id="marketplaceItems"></div>';
        gameSection.appendChild(this.marketplacePanel);
      }
    }
    
    // Add battles panel if it doesn't exist
    if (!this.battlesPanel) {
      const gameSection = document.querySelector('.game-section');
      if (gameSection) {
        this.battlesPanel = document.createElement('div');
        this.battlesPanel.id = 'battlesPanel';
        this.battlesPanel.className = 'battles-panel';
        this.battlesPanel.innerHTML = '<h3>Battles</h3><div id="battleHistory"></div>';
        gameSection.appendChild(this.battlesPanel);
      }
    }
    
    // Add staking panel if it doesn't exist
    if (!this.stakingPanel) {
      const gameSection = document.querySelector('.game-section');
      if (gameSection) {
        this.stakingPanel = document.createElement('div');
        this.stakingPanel.id = 'stakingPanel';
        this.stakingPanel.className = 'staking-panel';
        this.stakingPanel.innerHTML = '<h3>Staking</h3><div id="stakingInfo"></div>';
        gameSection.appendChild(this.stakingPanel);
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
    if (this.createGuildButton) this.createGuildButton.addEventListener('click', () => this.createGuild());
    if (this.joinGuildButton) this.joinGuildButton.addEventListener('click', () => this.joinGuild());
    if (this.leaveGuildButton) this.leaveGuildButton.addEventListener('click', () => this.leaveGuild());
    if (this.challengePlayerButton) this.challengePlayerButton.addEventListener('click', () => this.challengePlayer());
    if (this.listItemButton) this.listItemButton.addEventListener('click', () => this.listItem());
    if (this.buyItemButton) this.buyItemButton.addEventListener('click', () => this.buyItem());
    if (this.stakeNFTButton) this.stakeNFTButton.addEventListener('click', () => this.stakeNFT());
    if (this.unstakeNFTButton) this.unstakeNFTButton.addEventListener('click', () => this.unstakeNFT());
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
        console.log('Contract info loaded:', this.contractInfo);
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
      
      // Connect to the deployed contracts if available
      if (this.contractInfo) {
        const gameTokenABI = this.contractInfo.gameToken.abi;
        const gameTokenAddress = this.contractInfo.gameToken.address;
        const gameLogicABI = this.contractInfo.gameLogic.abi;
        const gameLogicAddress = this.contractInfo.gameLogic.address;
        
        this.gameTokenContract = new ethers.Contract(gameTokenAddress, gameTokenABI, this.signer);
        this.gameLogicContract = new ethers.Contract(gameLogicAddress, gameLogicABI, this.signer);
        console.log('Connected to contracts:');
        console.log('  GameToken:', gameTokenAddress);
        console.log('  GameLogic:', gameLogicAddress);
      }
      
      // Update UI
      this.walletStatus.innerHTML = `Connected: ${window.ethereum.selectedAddress.substring(0, 6)}...${window.ethereum.selectedAddress.substring(window.ethereum.selectedAddress.length - 4)}`;
      if (this.connectButton) this.connectButton.disabled = true;
      
      // Update player stats
      await this.updatePlayerStats();
      this.updatePlayerAssets();
      this.updateAchievements();
      this.updateGuildInfo();
      this.updateMarketplace();
      this.updateStakingInfo();
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
        
        // Connect to the deployed contracts if available
        if (this.contractInfo) {
          const gameTokenABI = this.contractInfo.gameToken.abi;
          const gameTokenAddress = this.contractInfo.gameToken.address;
          const gameLogicABI = this.contractInfo.gameLogic.abi;
          const gameLogicAddress = this.contractInfo.gameLogic.address;
          
          this.gameTokenContract = new ethers.Contract(gameTokenAddress, gameTokenABI, this.signer);
          this.gameLogicContract = new ethers.Contract(gameLogicAddress, gameLogicABI, this.signer);
          console.log('Connected to contracts:');
          console.log('  GameToken:', gameTokenAddress);
          console.log('  GameLogic:', gameLogicAddress);
        }
        
        // Update UI
        this.walletStatus.innerHTML = `Connected: ${accounts[0].substring(0, 6)}...${accounts[0].substring(accounts[0].length - 4)}`;
        if (this.connectButton) this.connectButton.disabled = true;
        
        // Approve spending for marketplace
        await this.approveTokenSpending();
        
        // Register player if not already registered
        await this.registerPlayer();
        
        // Update player stats
        await this.updatePlayerStats();
        this.updatePlayerAssets();
        this.updateAchievements();
        this.updateGuildInfo();
        this.updateMarketplace();
        this.updateStakingInfo();
        
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
  
  async approveTokenSpending() {
    if (!this.gameTokenContract || !this.gameLogicContract) return;
    
    try {
      // Approve infinite spending for marketplace and other functions
      const maxApproval = ethers.MaxUint256; // This represents the maximum possible value
      const approvalTx = await this.gameTokenContract.approve(
        await this.gameLogicContract.getAddress(), 
        maxApproval
      );
      await approvalTx.wait();
      console.log('Token spending approved for marketplace');
    } catch (error) {
      console.error('Error approving token spending:', error);
      // This might fail if already approved, which is okay
    }
  }
  
  async registerPlayer() {
    if (!this.gameLogicContract) {
      console.log('Contract not available, skipping registration');
      return;
    }
    
    try {
      // Check if player is already registered
      const playerInfo = await this.gameLogicContract.getPlayerInfo(await this.signer.getAddress());
      if (playerInfo[8]) { // The 9th element (index 8) is 'exists' boolean
        console.log('Player already registered');
        return;
      }
      
      // Register the player
      this.gameStateDisplay.innerHTML = 'Registering player...';
      const tx = await this.gameLogicContract.registerPlayer();
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
    
    if (!this.gameLogicContract) {
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
      
      const tx = await this.gameLogicContract.mintNFT(metadataUri);
      await tx.wait();
      
      this.gameStateDisplay.innerHTML = 'NFT minted successfully!';
      await this.updatePlayerStats();
      this.updatePlayerAssets();
      this.updateAchievements();
      this.updateInventoryPanel();
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
    
    if (!this.gameLogicContract) {
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
      
      const tx = await this.gameLogicContract.upgradeNFT(tokenId);
      await tx.wait();
      
      this.gameStateDisplay.innerHTML = 'NFT upgraded successfully!';
      await this.updatePlayerStats();
      this.updatePlayerAssets();
      this.updateInventoryPanel();
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
    
    if (!this.gameLogicContract) {
      alert('Contract not deployed yet');
      return;
    }
    
    try {
      this.gameStateDisplay.innerHTML = 'Claiming daily reward...';
      
      const tx = await this.gameLogicContract.claimDailyReward();
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
  
  async createGuild() {
    if (!this.signer) {
      alert('Please connect wallet first');
      return;
    }
    
    if (!this.gameLogicContract) {
      alert('Contract not deployed yet');
      return;
    }
    
    const name = prompt('Enter guild name:');
    if (!name || name.trim() === '') {
      alert('Guild name cannot be empty');
      return;
    }
    
    const description = prompt('Enter guild description:');
    if (!description || description.trim() === '') {
      alert('Guild description cannot be empty');
      return;
    }
    
    try {
      this.gameStateDisplay.innerHTML = 'Creating guild...';
      
      const tx = await this.gameLogicContract.createGuild(name, description);
      await tx.wait();
      
      this.gameStateDisplay.innerHTML = 'Guild created successfully!';
      await this.updatePlayerStats();
      this.updateGuildInfo();
      this.showNotification('Guild created successfully!', 'success');
      
      console.log('Guild created successfully');
    } catch (error) {
      console.error('Error creating guild:', error);
      this.gameStateDisplay.innerHTML = 'Error creating guild';
      alert('Error creating guild: ' + error.message);
    }
  }
  
  async joinGuild() {
    if (!this.signer) {
      alert('Please connect wallet first');
      return;
    }
    
    if (!this.gameLogicContract) {
      alert('Contract not deployed yet');
      return;
    }
    
    const guildId = prompt('Enter guild ID to join:');
    if (!guildId) {
      alert('Please enter a valid guild ID');
      return;
    }
    
    try {
      this.gameStateDisplay.innerHTML = `Joining guild ${guildId}...`;
      
      const tx = await this.gameLogicContract.joinGuild(Number(guildId));
      await tx.wait();
      
      this.gameStateDisplay.innerHTML = 'Guild joined successfully!';
      await this.updatePlayerStats();
      this.updateGuildInfo();
      this.showNotification('Joined guild successfully!', 'success');
      
      console.log('Guild joined successfully');
    } catch (error) {
      console.error('Error joining guild:', error);
      this.gameStateDisplay.innerHTML = 'Error joining guild';
      alert('Error joining guild: ' + error.message);
    }
  }
  
  async leaveGuild() {
    if (!this.signer) {
      alert('Please connect wallet first');
      return;
    }
    
    if (!this.gameLogicContract) {
      alert('Contract not deployed yet');
      return;
    }
    
    if (!confirm('Are you sure you want to leave your guild?')) {
      return;
    }
    
    try {
      this.gameStateDisplay.innerHTML = 'Leaving guild...';
      
      const tx = await this.gameLogicContract.leaveGuild();
      await tx.wait();
      
      this.gameStateDisplay.innerHTML = 'Guild left successfully!';
      await this.updatePlayerStats();
      this.updateGuildInfo();
      this.showNotification('Left guild successfully!', 'success');
      
      console.log('Guild left successfully');
    } catch (error) {
      console.error('Error leaving guild:', error);
      this.gameStateDisplay.innerHTML = 'Error leaving guild';
      alert('Error leaving guild: ' + error.message);
    }
  }
  
  async challengePlayer() {
    if (!this.signer) {
      alert('Please connect wallet first');
      return;
    }
    
    if (!this.gameLogicContract) {
      alert('Contract not deployed yet');
      return;
    }
    
    const opponent = prompt('Enter opponent address:');
    if (!opponent) {
      alert('Please enter a valid opponent address');
      return;
    }
    
    const betAmount = prompt('Enter bet amount in game tokens:');
    if (!betAmount || isNaN(betAmount) || Number(betAmount) <= 0) {
      alert('Please enter a valid bet amount');
      return;
    }
    
    try {
      this.gameStateDisplay.innerHTML = 'Challenging player...';
      
      const tx = await this.gameLogicContract.challengePlayer(opponent, ethers.parseEther(betAmount.toString()));
      await tx.wait();
      
      this.gameStateDisplay.innerHTML = 'Challenge issued successfully!';
      await this.updatePlayerStats();
      this.showNotification('Challenge issued successfully!', 'success');
      
      console.log('Challenge issued successfully');
    } catch (error) {
      console.error('Error challenging player:', error);
      this.gameStateDisplay.innerHTML = 'Error issuing challenge';
      alert('Error issuing challenge: ' + error.message);
    }
  }
  
  async listItem() {
    if (!this.signer) {
      alert('Please connect wallet first');
      return;
    }
    
    if (!this.gameLogicContract) {
      alert('Contract not deployed yet');
      return;
    }
    
    if (!this.playerInfo || this.playerInfo.nfts.length === 0) {
      alert('You have no NFTs to list');
      return;
    }
    
    const tokenId = prompt(`Enter NFT ID to list (your NFTs: ${this.playerInfo.nfts.join(', ')}):`);
    if (!tokenId || !this.playerInfo.nfts.includes(Number(tokenId))) {
      alert('Please enter a valid NFT ID from your collection');
      return;
    }
    
    const price = prompt('Enter price in game tokens:');
    if (!price || isNaN(price) || Number(price) <= 0) {
      alert('Please enter a valid price');
      return;
    }
    
    try {
      this.gameStateDisplay.innerHTML = 'Listing item...';
      
      const tx = await this.gameLogicContract.listItem(Number(tokenId), ethers.parseEther(price.toString()));
      await tx.wait();
      
      this.gameStateDisplay.innerHTML = 'Item listed successfully!';
      await this.updatePlayerStats();
      this.updateInventoryPanel();
      this.updateMarketplace();
      this.showNotification('Item listed successfully!', 'success');
      
      console.log('Item listed successfully');
    } catch (error) {
      console.error('Error listing item:', error);
      this.gameStateDisplay.innerHTML = 'Error listing item';
      alert('Error listing item: ' + error.message);
    }
  }
  
  async buyItem() {
    if (!this.signer) {
      alert('Please connect wallet first');
      return;
    }
    
    if (!this.gameLogicContract) {
      alert('Contract not deployed yet');
      return;
    }
    
    if (this.marketItems.length === 0) {
      alert('No items available in marketplace');
      return;
    }
    
    const tokenId = prompt(`Enter NFT ID to buy (available items: ${this.marketItems.map(item => item.tokenId).join(', ')}):`);
    if (!tokenId) {
      alert('Please enter a valid NFT ID');
      return;
    }
    
    try {
      this.gameStateDisplay.innerHTML = 'Buying item...';
      
      const tx = await this.gameLogicContract.buyItem(Number(tokenId));
      await tx.wait();
      
      this.gameStateDisplay.innerHTML = 'Item purchased successfully!';
      await this.updatePlayerStats();
      this.updateInventoryPanel();
      this.updateMarketplace();
      this.showNotification('Item purchased successfully!', 'success');
      
      console.log('Item purchased successfully');
    } catch (error) {
      console.error('Error buying item:', error);
      this.gameStateDisplay.innerHTML = 'Error purchasing item';
      alert('Error purchasing item: ' + error.message);
    }
  }
  
  async stakeNFT() {
    if (!this.signer) {
      alert('Please connect wallet first');
      return;
    }
    
    if (!this.gameLogicContract) {
      alert('Contract not deployed yet');
      return;
    }
    
    if (!this.playerInfo || this.playerInfo.nfts.length === 0) {
      alert('You have no NFTs to stake');
      return;
    }
    
    const tokenId = prompt(`Enter NFT ID to stake (your NFTs: ${this.playerInfo.nfts.join(', ')}):`);
    if (!tokenId || !this.playerInfo.nfts.includes(Number(tokenId))) {
      alert('Please enter a valid NFT ID from your collection');
      return;
    }
    
    try {
      this.gameStateDisplay.innerHTML = 'Staking NFT...';
      
      const tx = await this.gameLogicContract.stakeNFT(Number(tokenId));
      await tx.wait();
      
      this.gameStateDisplay.innerHTML = 'NFT staked successfully!';
      await this.updatePlayerStats();
      this.updateInventoryPanel();
      this.updateStakingInfo();
      this.showNotification('NFT staked successfully!', 'success');
      
      console.log('NFT staked successfully');
    } catch (error) {
      console.error('Error staking NFT:', error);
      this.gameStateDisplay.innerHTML = 'Error staking NFT';
      alert('Error staking NFT: ' + error.message);
    }
  }
  
  async unstakeNFT() {
    if (!this.signer) {
      alert('Please connect wallet first');
      return;
    }
    
    if (!this.gameLogicContract) {
      alert('Contract not deployed yet');
      return;
    }
    
    if (!this.playerStakes || this.playerStakes.length === 0) {
      alert('You have no staked NFTs');
      return;
    }
    
    const tokenId = prompt(`Enter NFT ID to unstake (your staked NFTs: ${this.playerStakes.join(', ')}):`);
    if (!tokenId || !this.playerStakes.includes(Number(tokenId))) {
      alert('Please enter a valid NFT ID from your staked NFTs');
      return;
    }
    
    try {
      this.gameStateDisplay.innerHTML = 'Unstaking NFT...';
      
      const tx = await this.gameLogicContract.unstakeNFT(Number(tokenId));
      await tx.wait();
      
      this.gameStateDisplay.innerHTML = 'NFT unstaked successfully!';
      await this.updatePlayerStats();
      this.updateInventoryPanel();
      this.updateStakingInfo();
      this.showNotification('NFT unstaked successfully!', 'success');
      
      console.log('NFT unstaked successfully');
    } catch (error) {
      console.error('Error unstaking NFT:', error);
      this.gameStateDisplay.innerHTML = 'Error unstaking NFT';
      alert('Error unstaking NFT: ' + error.message);
    }
  }
  
  async performAction() {
    if (!this.signer) {
      alert('Please connect wallet first');
      return;
    }
    
    if (!this.gameLogicContract) {
      alert('Contract not deployed yet');
      return;
    }
    
    try {
      this.gameStateDisplay.innerHTML = 'Performing action...';
      
      const tx = await this.gameLogicContract.performAction();
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
    if (!this.gameLogicContract || !this.signer) {
      return;
    }
    
    try {
      const playerAddr = await this.signer.getAddress();
      const playerData = await this.gameLogicContract.getPlayerInfo(playerAddr);
      
      // Convert BigNumber values to regular numbers
      this.playerInfo = {
        nfts: Array.from(playerData[0]),
        level: Number(playerData[1]),
        experience: Number(playerData[2]),
        lastActionTime: Number(playerData[3]),
        lastClaimTime: Number(playerData[4]),
        totalRewards: Number(playerData[5]),
        achievementPoints: Number(playerData[6]),
        nftCount: Number(playerData[7]),
        gameTokens: Number(playerData[8]),
        reputation: Number(playerData[9]),
        guildId: Number(playerData[10])
      };
      
      this.gameStats.innerHTML = `
        <div class="stats-row">
          <span>Level: ${this.playerInfo.level}</span>
          <span>XP: ${this.playerInfo.experience}</span>
          <span>AP: ${this.playerInfo.achievementPoints}</span>
        </div>
        <div class="stats-row">
          <span>NFTs: ${this.playerInfo.nftCount}</span>
          <span>Tokens: ${this.playerInfo.gameTokens}</span>
          <span>Rep: ${this.playerInfo.reputation}</span>
        </div>
        <div class="stats-row">
          <span>Guild: ${this.playerInfo.guildId || 'None'}</span>
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
    if (!this.gameLogicContract || !this.signer) {
      this.playerAssets.innerHTML = 'Player Assets: Connect wallet to see assets';
      return;
    }
    
    if (this.playerInfo) {
      this.playerAssets.innerHTML = `
        Player Assets: 
        <span title="Number of NFTs">${this.playerInfo.nftCount} NFTs</span> | 
        <span title="Player Level">Level: ${this.playerInfo.level}</span> | 
        <span title="Achievement Points">AP: ${this.playerInfo.achievementPoints}</span> | 
        <span title="Game Tokens">Tokens: ${this.playerInfo.gameTokens}</span> | 
        <span title="Reputation">Rep: ${this.playerInfo.reputation}</span>
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
              <span title="Achievement Points">AP: ${this.playerInfo.achievementPoints}</span> | 
              <span title="Game Tokens">Tokens: ${this.playerInfo.gameTokens}</span> | 
              <span title="Reputation">Rep: ${this.playerInfo.reputation}</span>
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
    if (!this.gameLogicContract || !this.signer) return;
    
    try {
      const playerAddr = await this.signer.getAddress();
      const unlockedAchievements = await this.gameLogicContract.getPlayerAchievements(playerAddr);
      
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
          case 4:
            achName = "Social Butterfly";
            achDesc = "Joined a guild";
            break;
          case 5:
            achName = "Battle Master";
            achDesc = "Won 5 battles";
            break;
          case 6:
            achName = "Market Maker";
            achDesc = "Sold 3 items";
            break;
          case 7:
            achName = "Staking Champion";
            achDesc = "Staked 5 NFTs";
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
  
  async updateGuildInfo() {
    if (!this.gameLogicContract || !this.signer || !this.playerInfo) return;
    
    if (this.playerInfo.guildId > 0) {
      try {
        const guildData = await this.gameLogicContract.getGuildInfo(this.playerInfo.guildId);
        
        let guildHtml = `<h3>Guild: ${guildData[0]}</h3>`; // Name
        guildHtml += `<p>${guildData[1]}</p>`; // Description
        guildHtml += `<p>Members: ${Number(guildData[3])}</p>`; // Member count
        guildHtml += `<p>Level: ${Number(guildData[4])}</p>`; // Guild level
        guildHtml += `<p>Total XP: ${Number(guildData[5])}</p>`; // Total XP
        
        document.getElementById('guildInfo').innerHTML = guildHtml;
      } catch (error) {
        console.error('Error fetching guild info:', error);
        document.getElementById('guildInfo').innerHTML = '<p>Error loading guild info</p>';
      }
    } else {
      document.getElementById('guildInfo').innerHTML = '<p>No guild. Join or create one!</p>';
    }
  }
  
  async updateMarketplace() {
    if (!this.gameLogicContract) return;
    
    try {
      const activeItems = await this.gameLogicContract.getActiveMarketItems();
      this.marketItems = Array.from(activeItems).map(id => Number(id));
      
      let marketHtml = '<h3>Marketplace</h3>';
      
      if (this.marketItems.length > 0) {
        marketHtml += '<div class="market-grid">';
        
        for (const tokenId of this.marketItems) {
          // In a real app, we would get more details about the item
          marketHtml += `
            <div class="market-item">
              <div class="nft-image">🏷️</div>
              <div class="item-info">
                <div>ID: ${tokenId}</div>
                <div>Price: TBD tokens</div>
              </div>
              <button onclick="gameInstance.buyItemPrompt(${tokenId})" class="buy-btn">Buy</button>
            </div>
          `;
        }
        
        marketHtml += '</div>';
        marketHtml += `<p>Available Items: ${this.marketItems.length}</p>`;
      } else {
        marketHtml += '<p>No items available in marketplace. List your own!</p>';
      }
      
      document.getElementById('marketplaceItems').innerHTML = marketHtml;
    } catch (error) {
      console.error('Error fetching marketplace items:', error);
      document.getElementById('marketplaceItems').innerHTML = '<p>Error loading marketplace</p>';
    }
  }
  
  // Helper function for buying items
  buyItemPrompt(tokenId) {
    if (confirm(`Buy NFT #${tokenId}?`)) {
      this.buyItemDirect(tokenId);
    }
  }
  
  async buyItemDirect(tokenId) {
    if (!this.signer) {
      alert('Please connect wallet first');
      return;
    }
    
    if (!this.gameLogicContract) {
      alert('Contract not deployed yet');
      return;
    }
    
    try {
      this.gameStateDisplay.innerHTML = 'Buying item...';
      
      const tx = await this.gameLogicContract.buyItem(Number(tokenId));
      await tx.wait();
      
      this.gameStateDisplay.innerHTML = 'Item purchased successfully!';
      await this.updatePlayerStats();
      this.updateInventoryPanel();
      this.updateMarketplace();
      this.showNotification('Item purchased successfully!', 'success');
      
      console.log('Item purchased successfully');
    } catch (error) {
      console.error('Error buying item:', error);
      this.gameStateDisplay.innerHTML = 'Error purchasing item';
      alert('Error purchasing item: ' + error.message);
    }
  }
  
  async updateStakingInfo() {
    if (!this.gameLogicContract || !this.signer) return;
    
    try {
      const stakes = await this.gameLogicContract.getPlayerStakes(await this.signer.getAddress());
      this.playerStakes = Array.from(stakes).map(id => Number(id));
      
      let stakingHtml = '<h3>Staking</h3>';
      
      if (this.playerStakes.length > 0) {
        stakingHtml += '<div class="staking-grid">';
        
        for (const tokenId of this.playerStakes) {
          // In a real app, we would get more details about the stake
          stakingHtml += `
            <div class="stake-item">
              <div class="nft-image">🔒</div>
              <div class="stake-info">
                <div>ID: ${tokenId}</div>
                <div>Status: Staked</div>
              </div>
              <button onclick="gameInstance.unstakePrompt(${tokenId})" class="unstake-btn">Unstake</button>
            </div>
          `;
        }
        
        stakingHtml += '</div>';
        stakingHtml += `<p>Staked NFTs: ${this.playerStakes.length}</p>`;
      } else {
        stakingHtml += '<p>No NFTs staked. Stake NFTs to earn passive income!</p>';
      }
      
      document.getElementById('stakingInfo').innerHTML = stakingHtml;
    } catch (error) {
      console.error('Error fetching staking info:', error);
      document.getElementById('stakingInfo').innerHTML = '<p>Error loading staking info</p>';
    }
  }
  
  // Helper function for unstaking
  unstakePrompt(tokenId) {
    if (confirm(`Unstake NFT #${tokenId}?`)) {
      this.unstakeNFTDirect(tokenId);
    }
  }
  
  async unstakeNFTDirect(tokenId) {
    if (!this.signer) {
      alert('Please connect wallet first');
      return;
    }
    
    if (!this.gameLogicContract) {
      alert('Contract not deployed yet');
      return;
    }
    
    try {
      this.gameStateDisplay.innerHTML = 'Unstaking NFT...';
      
      const tx = await this.gameLogicContract.unstakeNFT(Number(tokenId));
      await tx.wait();
      
      this.gameStateDisplay.innerHTML = 'NFT unstaked successfully!';
      await this.updatePlayerStats();
      this.updateInventoryPanel();
      this.updateStakingInfo();
      this.showNotification('NFT unstaked successfully!', 'success');
      
      console.log('NFT unstaked successfully');
    } catch (error) {
      console.error('Error unstaking NFT:', error);
      this.gameStateDisplay.innerHTML = 'Error unstaking NFT';
      alert('Error unstaking NFT: ' + error.message);
    }
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
      this.ctx.fillText(`Level: ${this.playerInfo.level} | XP: ${this.playerInfo.experience} | Tokens: ${this.playerInfo.gameTokens}`, 10, this.canvas.height - 30);
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
        if (this.gameLogicContract && this.signer && Math.random() > 0.7) { // 30% chance to perform action
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
  window.gameInstance = new BlockchainGame();
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