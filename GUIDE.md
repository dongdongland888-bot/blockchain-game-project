# 区块链游戏新手入门指南

## 一、准备工作

### 1. 安装必要软件
- **Node.js**: 访问 https://nodejs.org 下载并安装 (版本 >= 14)
- **MetaMask**: 安装浏览器扩展 (Chrome/Firefox/Edge)
- **代码编辑器**: VS Code 或你喜欢的编辑器

### 2. 获取项目代码
```bash
# 克隆项目
git clone https://github.com/dongdongland888-bot/blockchain-game-project.git
cd blockchain-game-project
```

## 二、本地开发环境设置

### 1. 安装依赖
```bash
# 安装项目依赖
npm install
```

### 2. 编译合约
```bash
# 编译智能合约
npx hardhat compile
```

## 三、本地测试部署

### 1. 启动本地区块链节点
```bash
# 在第一个终端窗口运行
npx hardhat node
```
这将启动一个本地区块链网络，默认在 http://127.0.0.1:8545 运行

### 2. 部署合约
打开第二个终端窗口：
```bash
# 部署合约到本地网络
npx hardhat run scripts/deploy-full.js --network localhost
```

### 3. 启动前端
```bash
# 进入 src 目录
cd src

# 启动前端服务器
python -m http.server 8000
```

## 四、游戏操作指南

### 1. 连接钱包
1. 打开浏览器访问 http://localhost:8000
2. 点击 "Connect Wallet" 按钮
3. 选择 MetaMask 钱包
4. 授权连接（使用 Hardhat 提供的测试账户）

### 2. 游戏玩法
1. **开始游戏**: 点击 "Start Game" 激活游戏界面
2. **控制角色**: 使用 WASD 或方向键移动
3. **收集金币**: 触碰金币获得奖励
4. **执行操作**: 点击 "Perform Action" 获得经验值
5. **铸造 NFT**: 点击 "Mint NFT" 创建游戏 NFT

### 3. 玩家发展
- **经验值**: 每次行动获得 10 XP
- **等级**: 每 100 XP 升一级
- **冷却**: 每次行动有 1 分钟冷却时间

## 五、部署到测试网（可选）

### 1. 获取测试网 ETH
- 访问 Sepolia 测试网水龙头获取测试币
- 或其他测试网的水龙头

### 2. 配置环境变量
```bash
# 设置私钥（从你的钱包导出）
export PRIVATE_KEY="你的钱包私钥"

# 设置 RPC URL（使用 Infura 或 Alchemy）
export RPC_URL="https://sepolia.infura.io/v3/你的项目ID"
```

### 3. 修改配置文件
编辑 `hardhat.config.js` 添加网络配置：
```javascript
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  networks: {
    sepolia: {
      url: process.env.RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  solidity: "0.8.19",
};
```

### 4. 部署到测试网
```bash
npx hardhat run scripts/deploy-full.js --network sepolia
```

## 六、高级功能

### 1. 智能合约开发
- 合约位置: `contracts/` 目录
- GameNFT.sol: NFT 基础合约
- GameLogic.sol: 游戏逻辑合约

### 2. 前端开发
- 文件位置: `src/` 目录
- index.html: 游戏界面
- index.js: 游戏逻辑和区块链交互
- styles.css: 样式文件

### 3. 测试合约
```bash
# 运行合约测试
npx hardhat test
```

## 七、常见问题解答

### Q: MetaMask 未检测到钱包？
A: 确保 MetaMask 扩展已安装并解锁

### Q: 合约部署失败？
A: 检查本地节点是否运行，账户是否有足够余额

### Q: 游戏无法连接合约？
A: 确认部署脚本成功运行，contractInfo.json 文件已生成

### Q: 遇到 Gas 费用问题？
A: 在本地网络或测试网中不会产生真实费用

## 八、安全提示

1. **私钥安全**: 绝不在代码中暴露私钥
2. **测试网优先**: 在主网部署前充分测试
3. **代码审计**: 部署前进行安全审计
4. **备份重要**: 定期备份代码和配置

## 九、下一步学习

1. 学习 Solidity 智能合约开发
2. 了解 DeFi 和 NFT 标准
3. 探索 Layer 2 解决方案
4. 学习前端 Web3 集成

## 十、社区支持

- GitHub Issues: 提交 bug 和功能请求
- Discord: 加入开发者社区
- 文档: 查看详细技术文档

---

**提示**: 在开始前，建议先在本地环境中熟悉整个流程，然后再尝试部署到测试网。享受你的区块链游戏开发之旅！