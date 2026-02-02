const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const projectDir = '/root/clawd/blockchain-game';

console.log('Starting Hardhat node in the background...');

// Start Hardhat node
const hardhatNode = spawn('npx', ['hardhat', 'node'], {
  cwd: projectDir,
  stdio: ['pipe', 'pipe', 'pipe']
});

let hardhatPid;
if (hardhatNode.pid) {
  hardhatPid = hardhatNode.pid;
  console.log(`Hardhat node started with PID: ${hardhatPid}`);
  
  // Save PID to file
  fs.writeFileSync(path.join(projectDir, 'hardhat-node.pid'), hardhatPid.toString());
  
  // Log Hardhat output
  hardhatNode.stdout.on('data', (data) => {
    console.log(`Hardhat: ${data}`);
    fs.appendFileSync(path.join(projectDir, 'hardhat-output.log'), data);
  });
  
  hardhatNode.stderr.on('data', (data) => {
    console.error(`Hardhat Error: ${data}`);
    fs.appendFileSync(path.join(projectDir, 'hardhat-output.log'), data);
  });
  
  // Wait for node to start
  setTimeout(() => {
    console.log('Deploying contracts to the local Hardhat node...');
    
    const deployProcess = spawn('npx', ['hardhat', 'run', 'scripts/deploy.js', '--network', 'localhost'], {
      cwd: projectDir,
      stdio: 'inherit'
    });
    
    deployProcess.on('close', (code) => {
      console.log(`Deployment process exited with code: ${code}`);
      
      if (code === 0) {
        console.log('Contract deployment completed!');
      } else {
        console.log('Contract deployment may have failed.');
      }
      
      console.log('Hardhat node is running in the background.');
      console.log('To stop the node, run: kill $(cat hardhat-node.pid)');
    });
  }, 5000); // Wait 5 seconds for node to start
} else {
  console.error('Failed to start Hardhat node');
}