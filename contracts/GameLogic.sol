// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./GameNFT.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract GameLogic is GameNFT, Pausable, AccessControl {
    using EnumerableSet for EnumerableSet.UintSet;
    
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant GAME_MASTER_ROLE = keccak256("GAME_MASTER_ROLE");
    bytes32 public constant REWARDS_MANAGER_ROLE = keccak256("REWARDS_MANAGER_ROLE");
    
    struct Player {
        uint256[] nfts;           // Player's NFT tokens
        EnumerableSet.UintSet nftSet; // More efficient NFT tracking
        uint256 level;            // Player's level
        uint256 experience;       // Player's experience points
        uint256 lastActionTime;   // Last time player performed an action
        uint256 lastClaimTime;    // Last time player claimed rewards
        uint256 totalRewards;     // Total rewards claimed
        uint256 achievementPoints;// Points for achievements
        bool exists;              // Whether the player exists
    }
    
    mapping(address => Player) public players;
    mapping(uint256 => uint256) public nftLevels; // NFT ID to level mapping
    mapping(uint256 => uint256) public nftExperience; // NFT ID to experience
    mapping(uint256 => address) public nftOwners; // Track original owner
    
    // Game configuration
    uint256 public constant ACTION_COOLDOWN = 1 minutes; // Cooldown between actions
    uint256 public constant XP_PER_ACTION = 10;         // XP earned per action
    uint256 public constant LEVEL_UP_THRESHOLD = 100;   // XP needed to level up
    uint256 public constant BASE_REWARD = 0.001 ether;  // Base reward amount
    uint256 public constant DAILY_CLAIM_INTERVAL = 24 hours; // Interval for daily claims
    
    // Achievement system
    struct Achievement {
        string name;
        string description;
        uint256 requirement;
        bool active;
    }
    
    mapping(uint256 => Achievement) public achievements;
    mapping(address => mapping(uint256 => bool)) public playerAchievements;
    uint256 public achievementCount = 0;
    
    // Events
    event PlayerRegistered(address indexed player);
    event PlayerLeveledUp(address indexed player, uint256 newLevel);
    event NFTMinted(address indexed player, uint256 tokenId, string uri);
    event ActionPerformed(address indexed player, uint256 xpGained);
    event RewardClaimed(address indexed player, uint256 amount);
    event AchievementUnlocked(address indexed player, uint256 achievementId);
    event NFTUpgraded(uint256 indexed tokenId, uint256 newLevel);
    event PlayerRewarded(address indexed player, uint256 amount);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(GAME_MASTER_ROLE, msg.sender);
        _grantRole(REWARDS_MANAGER_ROLE, msg.sender);
        
        // Initialize achievements
        _addAchievement("First Steps", "Register to the game", 1, true);
        _addAchievement("Active Player", "Reach level 5", 5, true);
        _addAchievement("NFT Collector", "Own 10 NFTs", 10, true);
        _addAchievement("Marathon Player", "Perform 50 actions", 50, true);
    }
    
    function _addAchievement(string memory name, string memory description, uint256 requirement, bool active) internal returns (uint256) {
        uint256 id = achievementCount;
        achievements[id] = Achievement(name, description, requirement, active);
        achievementCount++;
        return id;
    }
    
    // Add a new achievement (only callable by game master)
    function addAchievement(string memory name, string memory description, uint256 requirement) public onlyRole(GAME_MASTER_ROLE) {
        _addAchievement(name, description, requirement, true);
    }
    
    // Register a new player
    function registerPlayer() public {
        require(!players[msg.sender].exists, "Player already registered");
        
        Player storage player = players[msg.sender];
        player.nfts = new uint256[](0);
        player.level = 1;
        player.experience = 0;
        player.lastActionTime = 0;
        player.lastClaimTime = 0;
        player.totalRewards = 0;
        player.achievementPoints = 0;
        player.exists = true;
        
        emit PlayerRegistered(msg.sender);
        
        // Unlock first achievement
        _checkAndUnlockAchievement(msg.sender, 0); // "First Steps"
    }
    
    // Perform an action in the game
    function performAction() public whenNotPaused {
        require(players[msg.sender].exists, "Player not registered");
        require(
            block.timestamp >= players[msg.sender].lastActionTime + ACTION_COOLDOWN,
            "Action still on cooldown"
        );
        
        Player storage player = players[msg.sender];
        player.lastActionTime = block.timestamp;
        player.experience += XP_PER_ACTION;
        
        // Check for level up
        uint256 newLevel = calculateLevel(player.experience);
        if (newLevel > player.level) {
            player.level = newLevel;
            emit PlayerLeveledUp(msg.sender, newLevel);
        }
        
        // Check achievement for actions performed
        _checkAndUnlockAchievement(msg.sender, 3); // "Marathon Player"
        
        emit ActionPerformed(msg.sender, XP_PER_ACTION);
    }
    
    // Mint a new NFT
    function mintNFT(string memory uri) public whenNotPaused returns(uint256) {
        require(players[msg.sender].exists, "Player not registered");
        
        uint256 tokenId = safeMint(msg.sender, uri);
        
        Player storage player = players[msg.sender];
        player.nfts.push(tokenId);
        player.nftSet.add(tokenId);
        nftLevels[tokenId] = player.level; // New NFT gets player's current level
        nftExperience[tokenId] = player.experience; // Associate with player's XP
        nftOwners[tokenId] = msg.sender; // Track original owner
        
        // Check achievement for NFT ownership
        if (player.nftSet.length() >= 10) {
            _checkAndUnlockAchievement(msg.sender, 2); // "NFT Collector"
        }
        
        emit NFTMinted(msg.sender, tokenId, uri);
        
        return tokenId;
    }
    
    // Upgrade an NFT's level
    function upgradeNFT(uint256 tokenId) public whenNotPaused {
        require(players[msg.sender].exists, "Player not registered");
        require(ownerOf(tokenId) == msg.sender, "Not owner of this NFT");
        require(players[msg.sender].experience >= 50, "Insufficient experience to upgrade");
        
        nftLevels[tokenId] += 1;
        players[msg.sender].experience -= 50; // Cost to upgrade
        
        // Update player level if needed
        uint256 newLevel = calculateLevel(players[msg.sender].experience);
        if (newLevel > players[msg.sender].level) {
            players[msg.sender].level = newLevel;
            emit PlayerLeveledUp(msg.sender, newLevel);
        }
        
        emit NFTUpgraded(tokenId, nftLevels[tokenId]);
    }
    
    // Claim daily reward
    function claimDailyReward() public whenNotPaused {
        require(players[msg.sender].exists, "Player not registered");
        require(
            block.timestamp >= players[msg.sender].lastClaimTime + DAILY_CLAIM_INTERVAL,
            "Can only claim once per day"
        );
        
        uint256 rewardAmount = BASE_REWARD * players[msg.sender].level; // Reward scales with level
        
        Player storage player = players[msg.sender];
        player.lastClaimTime = block.timestamp;
        player.totalRewards += rewardAmount;
        
        // In a real implementation, you would transfer actual tokens here
        // payable(msg.sender).transfer(rewardAmount);
        
        emit RewardClaimed(msg.sender, rewardAmount);
        emit PlayerRewarded(msg.sender, rewardAmount);
    }
    
    // Get detailed player info
    function getPlayerInfo(address playerAddr) public view returns (
        uint256[] memory nfts,
        uint256 level,
        uint256 experience,
        uint256 lastActionTime,
        uint256 lastClaimTime,
        uint256 totalRewards,
        uint256 achievementPoints,
        uint256 nftCount
    ) {
        Player memory player = players[playerAddr];
        return (
            player.nfts,
            player.level,
            player.experience,
            player.lastActionTime,
            player.lastClaimTime,
            player.totalRewards,
            player.achievementPoints,
            player.nftSet.length()
        );
    }
    
    // Get NFT details
    function getNFTDetails(uint256 tokenId) public view returns (
        uint256 level,
        uint256 exp,
        address owner
    ) {
        return (
            nftLevels[tokenId],
            nftExperience[tokenId],
            nftOwners[tokenId]
        );
    }
    
    // Check if player has unlocked an achievement
    function hasPlayerAchievement(address playerAddr, uint256 achievementId) public view returns (bool) {
        return playerAchievements[playerAddr][achievementId];
    }
    
    // Get player's unlocked achievements
    function getPlayerAchievements(address playerAddr) public view returns (uint256[] memory) {
        uint256[] memory unlocked = new uint256[](achievementCount);
        uint256 count = 0;
        
        for (uint256 i = 0; i < achievementCount; i++) {
            if (playerAchievements[playerAddr][i]) {
                unlocked[count] = i;
                count++;
            }
        }
        
        // Create result array of correct size
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = unlocked[i];
        }
        
        return result;
    }
    
    // Internal function to check and unlock achievements
    function _checkAndUnlockAchievement(address playerAddr, uint256 achievementId) internal {
        if (playerAchievements[playerAddr][achievementId]) {
            return; // Already unlocked
        }
        
        Achievement memory achievement = achievements[achievementId];
        if (!achievement.active) {
            return; // Achievement not active
        }
        
        bool unlocked = false;
        Player storage player = players[playerAddr];
        
        if (achievementId == 0) { // "First Steps" - just need to register
            unlocked = player.exists;
        } else if (achievementId == 1) { // "Active Player" - reach level 5
            unlocked = player.level >= achievement.requirement;
        } else if (achievementId == 2) { // "NFT Collector" - own 10 NFTs
            unlocked = player.nftSet.length() >= achievement.requirement;
        } else if (achievementId == 3) { // "Marathon Player" - perform 50 actions (1 action = 10 XP, so 500 XP)
            unlocked = player.experience >= achievement.requirement * XP_PER_ACTION;
        }
        
        if (unlocked) {
            playerAchievements[playerAddr][achievementId] = true;
            player.achievementPoints += 10; // Award achievement points
            
            emit AchievementUnlocked(playerAddr, achievementId);
        }
    }
    
    // Calculate player level from experience
    function calculateLevel(uint256 experience) public pure returns(uint256) {
        return (experience / LEVEL_UP_THRESHOLD) + 1;
    }
    
    // Admin functions
    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }
    
    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }
    
    // Get the contract's balance
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
}