const { ethers, run } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🔍 Starting advanced deployment process...");
  
  // Verify contracts compile correctly
  console.log("📝 Compiling contracts...");
  await run('compile');
  console.log("✅ Compilation successful!");
  
  // Get signers
  const [deployer] = await ethers.getSigners();
  console.log(`💼 Deploying contracts with account: ${await deployer.getAddress()}`);
  console.log(`💰 Account balance: ${(await deployer.provider.getBalance(await deployer.getAddress())).toString()} wei`);

  // Deploy GameLogic contract (which inherits from GameNFT)
  console.log("🚀 Deploying GameLogic contract...");
  const GameLogic = await ethers.getContractFactory("GameLogic");
  const gameLogic = await GameLogic.deploy();

  await gameLogic.waitForDeployment();
  
  const gameLogicAddress = await gameLogic.getAddress();
  console.log(`✅ GameLogic contract deployed to: ${gameLogicAddress}`);

  // Get the contract's ABI
  const contractArtifact = require("../artifacts/contracts/GameLogic.sol/GameLogic.json");
  const contractABI = contractArtifact.abi;

  // Save the contract address and ABI to a file for frontend use
  const contractInfo = {
    address: gameLogicAddress,
    abi: contractABI,
    network: "localhost",
    chainId: 31337,
    deployedAt: new Date().toISOString(),
    deployer: await deployer.getAddress(),
    version: "2.0.0"
  };

  // Ensure src directory exists
  const srcDir = path.join(__dirname, "../src");
  if (!fs.existsSync(srcDir)) {
    fs.mkdirSync(srcDir, { recursive: true });
  }
  
  // Write the contract info to the src directory for the frontend
  const outputPath = path.join(srcDir, "contractInfo.json");
  fs.writeFileSync(outputPath, JSON.stringify(contractInfo, null, 2));
  console.log(`💾 Contract info saved to ${outputPath}`);

  // Also save to dist for backup
  const distDir = path.join(__dirname, "../dist");
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }
  const distPath = path.join(distDir, "contractInfo.json");
  fs.writeFileSync(distPath, JSON.stringify(contractInfo, null, 2));
  console.log(`💾 Contract info also saved to ${distPath}`);

  // Verify contract on Etherscan (optional, requires API key)
  console.log("🔍 Waiting for block confirmations...");
  await gameLogic.deploymentTransaction().wait(3); // Wait for 3 confirmations

  console.log("\n🎉 Deployment completed successfully!");
  console.log("\n📋 Contract Information:");
  console.log(`   Address: ${gameLogicAddress}`);
  console.log(`   Network: localhost (Chain ID: 31337)`);
  console.log(`   File: src/contractInfo.json updated`);
  
  console.log("\n🎮 Next Steps:");
  console.log("   1. Run the frontend: cd src && npx http-server");
  console.log("   2. Or start with node: node ../server.js");
  console.log("   3. Visit http://localhost:8000 in your browser");
  console.log("   4. Connect MetaMask to Localhost 8545");
  console.log("   5. Import one of the HardHat accounts");
  
  console.log("\n🧪 Testing:");
  console.log("   Run tests with: npx hardhat test");
  
  console.log("\n📖 Documentation:");
  console.log("   Full documentation available in ENHANCED_README.md");
  
  return { gameLogicAddress, contractInfo };
}

// Handle errors properly
main()
  .then(() => {
    console.log("\n✅ Deployment process finished successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });

// Export for potential reuse
module.exports = { main };