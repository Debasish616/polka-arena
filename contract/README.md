# DotCade Game Registry Smart Contract

ink! smart contract for decentralized game uploads on Polkadot.

## Features

- Upload games with metadata (title, description, category)
- Store game files via IPFS hash
- Track play counts
- Owner-based game retrieval

## Contract Functions

### `upload_game(title, description, ipfs_hash, thumbnail_ipfs, category) -> u64`
Upload a new game. Returns game ID.

### `get_game(game_id) -> Option<Game>`
Get game details by ID.

### `increment_play_count(game_id)`
Track when a game is played.

### `get_total_games() -> u64`
Get total number of games.

### `get_games_by_owner(owner) -> Vec<u64>`
Get all game IDs uploaded by an owner.

## Build & Deploy

```bash
# Install cargo-contract
cargo install cargo-contract --force

# Build contract
cd contracts_new
cargo contract build --release

# Deploy to local node
cargo contract instantiate \
  --constructor new \
  --suri //Alice \
  --skip-confirm

# Or deploy to testnet (Rococo Contracts)
cargo contract instantiate \
  --constructor new \
  --suri "your mnemonic" \
  --url wss://rococo-contracts-rpc.polkadot.io \
  --skip-confirm
```

## Frontend Integration

### Upload Game Flow
1. Upload game file (.swf) to IPFS using services like Pinata/Web3.Storage
2. Upload thumbnail to IPFS
3. Call `upload_game` with IPFS hashes
4. Store returned game_id

### Display Games
1. Call `get_total_games` to get count
2. Loop through IDs calling `get_game(id)`
3. Fetch game files from IPFS using hash: `https://ipfs.io/ipfs/{ipfs_hash}`

### Track Plays
Call `increment_play_count(game_id)` when user starts playing

## IPFS Integration

### Option 1: Pinata (Easiest)
```javascript
const pinata = require('@pinata/sdk');
const pinataClient = pinata(apiKey, secretKey);
const result = await pinataClient.pinFileToIPFS(fileStream);
// Use result.IpfsHash in contract
```

### Option 2: Web3.Storage
```javascript
import { Web3Storage } from 'web3.storage';
const client = new Web3Storage({ token: apiToken });
const cid = await client.put([file]);
// Use cid in contract
```

### Option 3: Local IPFS Node
```bash
ipfs add game.swf
# Returns hash to use in contract
```

## Polkadot.js Integration

```javascript
import { ContractPromise } from '@polkadot/api-contract';

// Connect to node
const wsProvider = new WsProvider('ws://127.0.0.1:9944');
const api = await ApiPromise.create({ provider: wsProvider });

// Load contract
const contract = new ContractPromise(api, abi, contractAddress);

// Upload game
await contract.tx.uploadGame(
  { gasLimit, storageDepositLimit: null },
  title,
  description,
  ipfsHash,
  thumbnailIpfs,
  category
).signAndSend(account);

// Get game
const { output } = await contract.query.getGame(
  account.address,
  { gasLimit: -1 },
  gameId
);
```

## Alternative: EVM Contract (Moonbeam)

For EVM compatibility on Polkadot, deploy to Moonbeam/Moonriver. Use Solidity contract in `evm_contract.sol` with similar functionality.
