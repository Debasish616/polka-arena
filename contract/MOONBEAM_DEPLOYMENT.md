# Moonbeam Deployment Guide

## Quick Deploy to Moonbase Alpha (Testnet)

### 1. Setup MetaMask

1. Add Moonbase Alpha network to MetaMask:
   - Network Name: `Moonbase Alpha`
   - RPC URL: `https://rpc.api.moonbase.moonbeam.network`
   - Chain ID: `1287`
   - Currency Symbol: `DEV`
   - Block Explorer: `https://moonbase.moonscan.io/`

2. Get testnet tokens:
   - Faucet: https://faucet.moonbeam.network/
   - Connect wallet and request DEV tokens

### 2. Deploy Contract via Remix

1. Go to https://remix.ethereum.org

2. Create new file: `DotcadeGameRegistry.sol`

3. Copy contract from: `contracts/evm_contract.sol`

4. Compile:
   - Select Solidity 0.8.0+ compiler
   - Click "Compile DotcadeGameRegistry.sol"

5. Deploy:
   - Go to "Deploy & Run Transactions" tab
   - Environment: Select "Injected Provider - MetaMask"
   - Make sure MetaMask is on Moonbase Alpha network
   - Click "Deploy"
   - Confirm transaction in MetaMask

6. Copy deployed contract address

### 3. Configure Frontend

```bash
cd frontend

# Edit .env file
NEXT_PUBLIC_EVM_CONTRACT_ADDRESS=0xYourContractAddress
```

### 4. Test Upload

1. Start frontend: `npm run dev`
2. Visit: `http://localhost:3000/upload`
3. Connect MetaMask (must be on Moonbase Alpha)
4. Upload game with IPFS hash
5. Confirm transaction in MetaMask

## Deploy to Moonbeam Mainnet

Same process as above, but use:
- Network Name: `Moonbeam`
- RPC URL: `https://rpc.api.moonbeam.network`
- Chain ID: `1284`
- Currency Symbol: `GLMR`
- Block Explorer: `https://moonscan.io/`

Note: Requires real GLMR tokens for gas fees.

## Contract Functions

After deployment, you can interact with:

- `uploadGame(title, description, ipfsHash, thumbnailIpfs, category)` - Upload new game
- `getGame(gameId)` - Get game by ID
- `getAllGames(start, limit)` - Get games with pagination
- `gameCount()` - Total games uploaded

## Verify Contract (Optional)

On Moonscan:
1. Go to your contract address
2. Click "Contract" > "Verify and Publish"
3. Select compiler version (0.8.0+)
4. Paste contract code
5. Submit

This makes your contract source code public and readable on the explorer.
