const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Deploying Game contracts...");

  // Deploy GameLogic contract (which inherits from GameNFT)
  const GameLogic = await ethers.getContractFactory("GameLogic");
  const gameLogic = await GameLogic.deploy();

  await gameLogic.waitForDeployment();
  
  const gameLogicAddress = await gameLogic.getAddress();
  console.log(`GameLogic contract deployed to: ${gameLogicAddress}`);

  // Save the contract address to a file for frontend use
  const contractInfo = {
    address: gameLogicAddress,
    abi: [
      {
        "inputs": [],
        "name": "registerPlayer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "performAction",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "uri",
            "type": "string"
          }
        ],
        "name": "mintNFT",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "playerAddr",
            "type": "address"
          }
        ],
        "name": "getPlayerInfo",
        "outputs": [
          {
            "internalType": "uint256[]",
            "name": "nfts",
            "type": "uint256[]"
          },
          {
            "internalType": "uint256",
            "name": "level",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "experience",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "lastActionTime",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "name": "players",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "level",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "experience",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "lastActionTime",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "exists",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ],
    network: "localhost",
    chainId: 31337
  };

  const outputPath = path.join(__dirname, "../src/contractInfo.json");
  fs.writeFileSync(outputPath, JSON.stringify(contractInfo, null, 2));

  console.log("Contract info saved to src/contractInfo.json");

  // Also save to dist for backup
  const distPath = path.join(__dirname, "../dist/contractInfo.json");
  const distDir = path.dirname(distPath);
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }
  fs.writeFileSync(distPath, JSON.stringify(contractInfo, null, 2));
  
  console.log("Contract info also saved to dist/contractInfo.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });