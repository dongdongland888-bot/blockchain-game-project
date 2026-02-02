# 区块链游戏项目 - 玩赚型 NFT 游戏

## 项目概述
这是一个基于区块链的玩赚型（Play-to-Earn）游戏项目，结合了 NFT 和智能合约技术。玩家可以通过玩游戏获得代币奖励和独特的 NFT 收藏品。

## 技术架构
- **智能合约**: 使用 Solidity 编写的以太坊智能合约
- **开发框架**: Hardhat 用于合约开发、测试和部署
- **前端**: HTML/CSS/JavaScript 构建的游戏界面
- **区块链**: 以太坊及其测试网（如 Sepolia）或 Binance Smart Chain

## 核心功能

### 1. 智能合约
- **GameNFT.sol**: NFT 合约，代表游戏中的独特资产
- **GameLogic.sol**: 游戏逻辑合约，处理游戏规则和奖励机制

### 2. 游戏机制
- 玩家可以通过完成挑战获得代币奖励
- 稀有 NFT 可通过特殊活动或成就获得
- 玩家可以交易和收藏 NFT 资产

### 3. 经济模型
- **代币系统**: 游戏内原生代币，可用于购买道具、升级等
- **NFT 市场**: 玩家可以自由交易游戏资产
- **质押系统**: 玩家可以质押代币或 NFT 获得额外收益

## 项目结构
```
blockchain-game-project/
├── contracts/           # 智能合约
│   ├── GameLogic.sol    # 游戏逻辑合约
│   └── GameNFT.sol      # NFT 合约
├── src/                 # 前端源码
│   ├── index.html       # 游戏主界面
│   ├── index.js         # 前端逻辑
│   └── styles.css       # 样式文件
├── scripts/             # 部署脚本
│   └── deploy.js        # 合约部署脚本
├── dist/                # 构建输出
├── hardhat.config.js    # Hardhat 配置文件
├── package.json         # 项目依赖
└── README.md            # 项目说明
```

## 开发环境设置

### 前提条件
- Node.js (版本 >= 14)
- npm 或 yarn
- MetaMask 钱包（用于与 DApp 交互）

### 安装步骤
1. 克隆项目：
   ```bash
   git clone https://github.com/dongdongland888-bot/blockchain-game-project.git
   cd blockchain-game-project
   ```

2. 安装依赖：
   ```bash
   npm install
   ```

3. 编译智能合约：
   ```bash
   npx hardhat compile
   ```

4. 运行本地节点：
   ```bash
   npx hardhat node
   ```

5. 部署合约到本地网络：
   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```

## 部署到测试网

1. 配置钱包密钥：
   ```bash
   export PRIVATE_KEY="你的私钥"
   export INFURA_PROJECT_ID="你的 Infura 项目ID"
   ```

2. 部署到测试网（例如 Sepolia）：
   ```bash
   npx hardhat run scripts/deploy.js --network sepolia
   ```

## 前端开发

前端部分位于 `src/` 目录，提供用户界面与智能合约交互：

1. 启动前端开发服务器：
   ```bash
   # 使用 Python 简单服务器
   python -m http.server 8000
   
   # 或使用 Live Server 扩展（VSCode）
   ```

2. 连接 MetaMask 钱包进行交互

## 安全注意事项

1. **私钥安全**: 切勿将私钥或助记词提交到代码库
2. **合约审计**: 在主网上线前务必进行专业的智能合约审计
3. **测试**: 充分测试所有功能，特别是在测试网上
4. **Gas 优化**: 优化合约代码以降低交易费用

## 未来发展

- 添加更多游戏模式和挑战
- 引入 DAO 治理机制
- 扩展到多链支持
- 增加社交功能和公会系统
- 与 DeFi 协议集成

## 贡献

欢迎贡献代码！请遵循以下步骤：
1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 发起 Pull Request

## 许可证

本项目采用 MIT 许可证 - 详见 LICENSE 文件

## 联系方式

如有问题或建议，请通过 GitHub Issues 联系我们。

---

**免责声明**: 本项目仅供学习和实验目的。加密货币和区块链技术存在风险，请在参与前充分了解相关风险。