// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./GameNFT.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract GameLogic is GameNFT, Pausable, AccessControl {
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant GAME_MASTER_ROLE = keccak256("GAME_MASTER_ROLE");
    
    struct Player {
        uint256[] nfts;           // Player's NFT tokens
        uint256 level;            // Player's level
        uint256 experience;       // Player's experience points
        uint256 lastActionTime;   // Last time player performed an action
        bool exists;              // Whether the player exists
    }
    
    mapping(address => Player) public players;
    mapping(uint256 => uint256) public nftLevels; // NFT ID to level mapping
    
    uint256 public constant ACTION_COOLDOWN = 1 minutes; // Cooldown between actions
    uint256 public constant XP_PER_ACTION = 10;         // XP earned per action
    uint256 public constant LEVEL_UP_THRESHOLD = 100;   // XP needed to level up
    
    event PlayerRegistered(address indexed player);
    event PlayerLeveledUp(address indexed player, uint256 newLevel);
    event NFTMinted(address indexed player, uint256 tokenId);
    event ActionPerformed(address indexed player, uint256 xpGained);
    
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(GAME_MASTER_ROLE, msg.sender);
    }
    
    function registerPlayer() public {
        require(!players[msg.sender].exists, "Player already registered");
        
        players[msg.sender] = Player({
            nfts: new uint256[](0),
            level: 1,
            experience: 0,
            lastActionTime: 0,
            exists: true
        });
        
        emit PlayerRegistered(msg.sender);
    }
    
    function performAction() public whenNotPaused {
        require(players[msg.sender].exists, "Player not registered");
        require(
            block.timestamp >= players[msg.sender].lastActionTime + ACTION_COOLDOWN,
            "Action still on cooldown"
        );
        
        players[msg.sender].lastActionTime = block.timestamp;
        players[msg.sender].experience += XP_PER_ACTION;
        
        // Check for level up
        uint256 newLevel = calculateLevel(players[msg.sender].experience);
        if (newLevel > players[msg.sender].level) {
            players[msg.sender].level = newLevel;
            emit PlayerLeveledUp(msg.sender, newLevel);
        }
        
        emit ActionPerformed(msg.sender, XP_PER_ACTION);
    }
    
    function mintNFT(string memory uri) public whenNotPaused returns(uint256) {
        require(players[msg.sender].exists, "Player not registered");
        
        uint256 tokenId = safeMint(msg.sender, uri);
        
        players[msg.sender].nfts.push(tokenId);
        nftLevels[tokenId] = players[msg.sender].level; // New NFT gets player's current level
        
        emit NFTMinted(msg.sender, tokenId);
        
        return tokenId;
    }
    
    function getPlayerInfo(address playerAddr) public view returns (
        uint256[] memory nfts,
        uint256 level,
        uint256 experience,
        uint256 lastActionTime
    ) {
        Player memory player = players[playerAddr];
        return (
            player.nfts,
            player.level,
            player.experience,
            player.lastActionTime
        );
    }
    
    function getNFTLevel(uint256 tokenId) public view returns(uint256) {
        return nftLevels[tokenId];
    }
    
    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }
    
    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }
    
    function calculateLevel(uint256 experience) public pure returns(uint256) {
        return (experience / LEVEL_UP_THRESHOLD) + 1;
    }
}