# 区块链游戏项目 - 增强版说明

## 项目概述

这是一个基于区块链的玩赚型（Play-to-Earn）游戏项目，结合了 NFT 和智能合约技术。玩家可以通过玩游戏获得代币奖励和独特的 NFT 收藏品。

## 核心特性

### 1. 游戏玩法
- **实时游戏**: 基于 Canvas 的 2D 游戏界面，支持键盘控制
- **NFT 铸造**: 玩家可以铸造独特的游戏 NFT
- **等级系统**: 通过游戏行为提升等级
- **经验系统**: 完成任务获得经验值
- **冷却机制**: 防止刷取奖励

### 2. 智能合约功能
- **GameNFT 合约**: 管理游戏内的 NFT 资产
- **GameLogic 合约**: 核心游戏逻辑和玩家状态管理
- **访问控制**: 基于角色的访问控制
- **暂停机制**: 安全暂停功能

### 3. 前端功能
- **钱包连接**: 支持 MetaMask 钱包连接
- **玩家状态**: 实时显示玩家等级、经验、资产
- **游戏界面**: 交互式游戏画布
- **NFT 管理**: 显示玩家拥有的 NFT

## 技术架构

- **前端**: HTML5, CSS3, JavaScript (ES6+), Web3.js
- **智能合约**: Solidity (v0.8.19+)
- **开发框架**: Hardhat, Ethers.js
- **标准**: ERC-721 (NFT), OpenZeppelin 安全合约
- **区块链**: 以太坊兼容网络

## 项目结构

```
blockchain-game-project/
├── contracts/              # 智能合约
│   ├── GameLogic.sol       # 游戏逻辑合约 (继承自 GameNFT)
│   └── GameNFT.sol         # NFT 合约 (基础 ERC721)
├── src/                    # 前端源码
│   ├── index.html          # 游戏主界面
│   ├── index.js            # 游戏逻辑和区块链交互
│   ├── styles.css          # 样式文件
│   └── contractInfo.json   # 合约部署信息
├── scripts/                # 部署脚本
│   └── deploy-full.js      # 完整部署脚本
├── dist/                   # 构建输出
├── node_modules/           # 依赖包
├── hardhat.config.js       # Hardhat 配置
├── package.json            # 项目配置
└── README.md               # 项目说明
```

## 开发环境设置

### 前提条件
- Node.js (版本 >= 14)
- npm 或 yarn
- MetaMask 钱包
- Docker (可选，用于本地节点)

### 安装步骤

1. **克隆项目**
   ```bash
   git clone https://github.com/dongdongland888-bot/blockchain-game-project.git
   cd blockchain-game-project
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **编译智能合约**
   ```bash
   npx hardhat compile
   ```

## 部署到本地网络

1. **启动本地节点**
   ```bash
   npx hardhat node
   ```
   这将在 http://127.0.0.1:8545 启动一个本地区块链节点

2. **在新终端中部署合约**
   ```bash
   npx hardhat run scripts/deploy-full.js --network localhost
   ```

3. **启动前端开发服务器**
   ```bash
   # 使用 Python 简单服务器
   cd src
   python -m http.server 8000
   ```
   
   或者使用其他静态文件服务器

4. **访问游戏**
   打开浏览器访问 http://localhost:8000

## 部署到测试网

1. **配置钱包密钥**
   ```bash
   export PRIVATE_KEY="你的钱包私钥"
   export RPC_URL="你的区块链 RPC URL"  # 如 Infura 或 Alchemy
   ```

2. **修改 hardhat.config.js 添加网络配置**
   ```javascript
   module.exports = {
     networks: {
       sepolia: {
         url: process.env.RPC_URL,
         accounts: [process.env.PRIVATE_KEY]
       }
     },
     // ... 其他配置
   };
   ```

3. **部署到测试网**
   ```bash
   npx hardhat run scripts/deploy-full.js --network sepolia
   ```

## 游戏玩法

### 1. 连接钱包
- 点击 "Connect Wallet" 按钮
- 授权 MetaMask 访问
- 系统自动注册玩家

### 2. 开始游戏
- 点击 "Start Game" 开始游戏
- 使用 WASD 或方向键控制角色移动
- 收集金币获得奖励

### 3. 游戏互动
- **Mint NFT**: 铸造独特的游戏 NFT
- **Perform Action**: 执行游戏动作获得经验
- **游戏内收集**: 在游戏中收集金币自动触发游戏动作

### 4. 玩家发展
- 等级随经验增长
- NFT 数量反映游戏进度
- 冷却机制平衡游戏经济

## 智能合约详解

### GameNFT.sol
- 基础 ERC721 NFT 合约
- 支持元数据存储
- 安全的铸币功能

### GameLogic.sol
- 玩家状态管理
- 等级和经验系统
- 冷却时间机制
- NFT 铸造与关联

## 安全考虑

1. **访问控制**: 使用 OpenZeppelin AccessControl
2. **暂停机制**: 可紧急暂停合约
3. **输入验证**: 防止重入攻击
4. **数值溢出**: 使用 SafeMath (OpenZeppelin 内置)
5. **权限分离**: 管理员与普通用户权限分离

## 经济模型

- **经验获取**: 每次行动获得 10 XP
- **等级计算**: 每 100 XP 升一级
- **冷却时间**: 1 分钟冷却防止刷取
- **NFT 关联**: NFT 与玩家等级关联

## 扩展功能

### 未来开发计划
- **多链支持**: 支持 Polygon、BSC 等网络
- **DeFi 集成**: 质押和流动性挖矿
- **治理代币**: DAO 治理机制
- **PvP 模式**: 玩家对战功能
- **市场功能**: NFT 交易市场

### 可能的改进
- **IPFS 集成**: NFT 元数据存储到 IPFS
- **预言机集成**: 现实世界数据
- **Layer 2 解决方案**: 降低 Gas 费用
- **移动适配**: 响应式设计

## 故障排除

### 常见问题
1. **MetaMask 未检测**: 检查浏览器扩展
2. **合约未连接**: 确认部署脚本已运行
3. **权限错误**: 检查钱包账户余额
4. **网络问题**: 确认 RPC 端点配置

### 调试技巧
- 查看浏览器开发者控制台
- 检查 Hardhat 节点日志
- 验证合约 ABI 与地址匹配

## 贡献

欢迎贡献代码！请遵循以下步骤：
1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 联系方式

如有问题或建议，请通过 GitHub Issues 联系我们。

---

**免责声明**: 本项目仅供学习和实验目的。加密货币和区块链技术存在风险，请在参与前充分了解相关风险。