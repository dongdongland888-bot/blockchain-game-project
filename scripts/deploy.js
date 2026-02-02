const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Deploying GameNFT contract...");
  
  const GameNFT = await ethers.getContractFactory("GameNFT");
  const gameNFT = await GameNFT.deploy();
  
  await gameNFT.waitForDeployment();
  
  const address = await gameNFT.getAddress();
  console.log(`GameNFT contract deployed to: ${address}`);
  
  // Save the contract address to a file for frontend use
  const contractInfo = {
    address: address,
    network: "localhost",
    chainId: 31337
  };
  
  const outputPath = path.join(__dirname, "../src/contractInfo.json");
  fs.writeFileSync(outputPath, JSON.stringify(contractInfo, null, 2));
  
  console.log("Contract info saved to src/contractInfo.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
