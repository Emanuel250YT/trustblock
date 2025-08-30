# 🧠 TrueBlock Mini-App for Base

## 🎯 Track: Base Mini-Apps

**Goal**: Build and deploy mini apps on Base that are simple, snappy, and fun!

**TrueBlock Mini-App** is a simplified, fun truth-checking application that lets users verify news, memes, quotes, and facts through community voting on the Base blockchain.

## ✨ What Makes This Perfect for Base Mini-Apps

- **🚀 Simple & Fun**: Users can instantly submit content and vote on truthfulness
- **⚡ Snappy**: Quick interactions with immediate feedback
- **🎮 Gamified**: Reputation system and leaderboards
- **🔗 Base Native**: Built specifically for Base network
- **📱 Mobile Friendly**: Works perfectly in Base App
- **🎨 Beautiful UI**: Modern, engaging interface

## 🎮 How It Works

1. **Submit Content**: Users submit news, memes, quotes, or facts
2. **Community Voting**: Other users vote on truthfulness (0-100 scale)
3. **Verification**: Content gets verified after 5 votes
4. **Reputation**: Users build reputation through accurate voting
5. **Leaderboards**: Top truth-checkers get recognition

## 🚀 Quick Start

### 1. Deploy to Base

```bash
# Deploy to Base Sepolia (testnet)
npx hardhat run scripts/deploy-base-miniapp.js --network base-sepolia

# Deploy to Base Mainnet
npx hardhat run scripts/deploy-base-miniapp.js --network base
```

### 2. Update Contract Address

After deployment, update the contract address in `src/mini-app/config.js`:

```javascript
contracts: {
    base: {
        mainnet: "YOUR_DEPLOYED_CONTRACT_ADDRESS",
        testnet: "YOUR_DEPLOYED_CONTRACT_ADDRESS"
    }
}
```

### 3. Test in Base App

1. Open Base App
2. Navigate to your mini-app
3. Connect wallet
4. Start truth-checking!

## 🏗️ Architecture

### Smart Contract (`TrueBlockMiniApp.sol`)

- **Simple Structure**: Easy to understand and audit
- **Gas Optimized**: Efficient for Base network
- **Community Driven**: Voting and reputation system
- **No Complex Dependencies**: Pure Solidity implementation

### Frontend (`src/mini-app/`)

- **Single Page App**: Fast loading and navigation
- **Wallet Integration**: Seamless Base wallet connection
- **Real-time Updates**: Live data from blockchain
- **Responsive Design**: Works on all devices

## 🎯 Hackathon Features

### Core Functionality ✅
- [x] Submit truth checks
- [x] Vote on content
- [x] Community verification
- [x] User reputation
- [x] Real-time stats

### Demo Ready ✅
- [x] Beautiful UI/UX
- [x] Instant interactions
- [x] Clear value proposition
- [x] Base network integration
- [x] Mobile optimized

## 🧪 Testing Your Mini-App

### 1. Local Testing

```bash
# Start local blockchain
npx hardhat node

# Deploy locally
npx hardhat run scripts/deploy-base-miniapp.js --network localhost

# Open mini-app
open src/mini-app/index.html
```

### 2. Base Testnet Testing

```bash
# Deploy to Base Sepolia
npx hardhat run scripts/deploy-base-miniapp.js --network base-sepolia

# Get testnet ETH from Base faucet
# Test all functionality
```

### 3. Base Mainnet Deployment

```bash
# Deploy to Base mainnet
npx hardhat run scripts/deploy-base-miniapp.js --network base

# Verify contract on Basescan
# Test in Base App
```

## 🎨 Customization Ideas

### For Hackathon Judges

1. **Add Categories**: More content types (videos, images, links)
2. **Gamification**: Badges, achievements, daily challenges
3. **Social Features**: Comments, sharing, following
4. **AI Integration**: Basic fact-checking suggestions
5. **Rewards**: Token incentives for accurate voting

### Quick Wins

- Change colors and branding
- Add more emojis and fun elements
- Implement dark mode
- Add sound effects
- Create mobile-specific features

## 📱 Base App Integration

### Requirements

- ✅ Deployed on Base network
- ✅ Mobile-responsive design
- ✅ Fast loading (< 3 seconds)
- ✅ Clear user value
- ✅ Working functionality

### Best Practices

- Keep interactions simple
- Provide immediate feedback
- Use familiar UI patterns
- Optimize for mobile
- Test with real users

## 🚀 Deployment Checklist

### Pre-Deployment
- [ ] Contract compiled successfully
- [ ] Tests passing
- [ ] Gas optimization checked
- [ ] Security review completed

### Base Network
- [ ] Contract deployed to Base
- [ ] Contract verified on Basescan
- [ ] Frontend updated with contract address
- [ ] Tested on Base network

### Base App Ready
- [ ] Mini-app accessible via URL
- [ ] Wallet connection working
- [ ] All functions tested
- [ ] Mobile UI verified
- [ ] Performance optimized

## 🎉 Hackathon Success Tips

1. **Start Simple**: Get basic functionality working first
2. **Test Early**: Deploy to testnet and test thoroughly
3. **User Experience**: Focus on making it fun and easy to use
4. **Demo Prep**: Have a clear demo flow ready
5. **Documentation**: Keep track of what you built

## 🔗 Useful Links

- **Base Network**: https://base.org
- **Base App**: Get invite from hackathon organizers
- **Basescan**: https://basescan.org
- **Base Sepolia**: https://sepolia.base.org
- **Hardhat**: https://hardhat.org

## 🆘 Need Help?

- Check the main README.md for project details
- Review smart contract code in `contracts/TrueBlockMiniApp.sol`
- Test deployment scripts in `scripts/deploy-base-miniapp.js`
- Verify frontend in `src/mini-app/`

---

**🎯 Remember**: This is a mini-app! Keep it simple, snappy, and fun. The goal is to demonstrate a working, engaging application on Base that users can interact with instantly.

**Good luck with your Base Mini-App! 🚀✨**
