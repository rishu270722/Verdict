# Verdict - Decentralized Peer-to-Peer Betting Protocol

> **Trustless betting with multi-judge resolution on blockchain**

Verdict is a decentralized peer-to-peer betting platform built on Mantle Sepolia that enables users to create and participate in bets with complete transparency and trustlessness. No platform custody, instant payouts, and fair resolution through community judges.

## Problem Statement

Traditional betting platforms suffer from fundamental trust issues:

- **Platform Custody Risk**: Users must trust platforms with their funds
- **Single Point of Failure**: Centralized resolution systems can be manipulated
- **Lack of Transparency**: No visibility into how bets are resolved
- **High Fees**: Platforms take significant cuts from every bet
- **Limited Accessibility**: Geographic and regulatory restrictions
- **Counterparty Risk**: Users must trust other participants

These issues create barriers to fair, transparent, and accessible betting experiences.

## Solution Overview

Verdict provides a **completely decentralized betting ecosystem** where:

- **Smart contracts hold all funds** - No platform custody
- **Multi-judge resolution system** - Fair and transparent outcomes
- **On-chain transparency** - Every action is verifiable
- **Zero platform fees** - Direct peer-to-peer transactions
- **Instant payouts** - Automatic fund distribution upon resolution
- **Global accessibility** - No geographic restrictions

## Key Features

### Core Betting Features
- **Peer-to-Peer Betting**: Direct bets between users without intermediaries
- **Flexible Wager Amounts**: Bet any amount in MNT tokens
- **Custom Bet Terms**: Define your own bet conditions and rules
- **Multi-Judge Resolution**: Choose multiple judges for fair resolution

### Resolution System
- **Judge Selection**: Choose trusted judges for each bet
- **Voting Threshold**: Set required votes for resolution
- **Transparent Voting**: All votes recorded on-chain
- **Automatic Payouts**: Funds released instantly upon consensus

### Security & Trust
- **Smart Contract Escrow**: Funds locked in immutable contracts
- **No Platform Custody**: Users control their own funds
- **On-Chain Auditability**: Every transaction is verifiable
- **Decentralized Resolution**: No single point of failure

### User Experience
- **Modern Web Interface**: Clean, responsive design
- **Real-time Updates**: Live bet status tracking
- **Wallet Integration**: Seamless MetaMask connection
- **Dashboard Analytics**: Comprehensive bet management

## Technical Architecture

### Frontend Stack
- **Framework**: Next.js 16.1.1 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS with custom animations
- **Web3 Integration**: Wagmi + Viem for blockchain interaction
- **State Management**: React Query for server state

### Blockchain Integration
- **Network**: Mantle Sepolia Testnet
- **Wallet**: MetaMask integration
- **RPC**: `https://rpc.sepolia.mantle.xyz`
- **Chain ID**: 5003
- **Token**: MNT (Mantle native token)

## Smart Contract Deep Dive

The Verdict smart contract (`contract/verdict.sol`) implements a comprehensive betting system with the following key components:

### Core Data Structures

```solidity
enum BetStatus {
    Created,    // Bet created, waiting for opponent
    Accepted,   // Opponent accepted, judges can vote
    Resolved,   // Bet resolved, winner paid
    Cancelled   // Bet cancelled by creator
}

struct Bet {
    address creator;           // Bet creator address
    address opponent;          // Opponent address
    address[] judges;          // Array of judge addresses
    uint256 requiredVotes;     // Votes needed for resolution
    uint256 wagerAmount;       // Amount wagered (in wei)
    string terms;             // Bet terms and conditions
    BetStatus status;         // Current bet status
    address winner;           // Winner address (after resolution)
    uint256 creatorVotes;     // Votes for creator
    uint256 opponentVotes;    // Votes for opponent
}
```

### Key Functions

#### `createBet()`
- **Purpose**: Creates a new bet with specified parameters
- **Parameters**:
  - `_opponent`: Address of the opponent
  - `_judges`: Array of judge addresses
  - `_requiredVotes`: Minimum votes needed for resolution
  - `_terms`: String describing bet conditions
- **Value**: Wager amount sent with transaction
- **Validation**: Ensures valid opponent, sufficient judges, and positive wager

#### `acceptBet()`
- **Purpose**: Opponent accepts the bet and matches the wager
- **Requirements**: Only opponent can call, exact wager amount required
- **Effect**: Changes status to `Accepted`, enables voting

#### `vote()`
- **Purpose**: Judges vote on the bet outcome
- **Parameters**: `betId` and `winner` address
- **Validation**: Only assigned judges can vote, only once per judge
- **Resolution**: Automatically resolves when vote threshold is reached

#### `cancelBet()`
- **Purpose**: Creator can cancel unaccepted bets
- **Requirements**: Only creator, bet must be in `Created` status
- **Effect**: Returns wager to creator

### Security Features

- **Access Control**: Modifiers ensure only authorized users can perform actions
- **State Validation**: Functions check appropriate bet states before execution
- **Fund Safety**: Funds locked in contract until resolution
- **Vote Integrity**: One vote per judge, transparent voting record

## Business Model

### Revenue Streams

#### 1. **Protocol Fee Structure**
- **0% Platform Fees**: No fees on bets (initial phase)
- **Future Consideration**: Optional 0.5-1% protocol fee for advanced features

#### 2. **Premium Features** (Future)
- **Priority Resolution**: Faster judge assignment for fee
- **Advanced Analytics**: Premium dashboard features
- **Custom Judge Pools**: Curated judge networks

#### 3. **Ecosystem Growth**
- **Governance Token**: Potential VERDICT token for protocol governance
- **Liquidity Mining**: Rewards for providing judging services
- **Referral Program**: Incentives for bringing new users

### Value Proposition

- **For Bettors**: Trustless, fee-free betting with fair resolution
- **For Judges**: Earn reputation and potential rewards for service
- **For Ecosystem**: Sustainable growth through network effects

## Roadmap (3 Phases)

### Phase 1: Foundation (Current)
**Goal**: Establish core betting functionality and user base

#### Completed Features:
- Smart contract deployment on Mantle Sepolia
- Basic bet creation and acceptance
- Multi-judge voting system
- Web3 wallet integration (MetaMask)
- Responsive web interface
- Real-time bet tracking

#### Key Metrics:
- Smart contract security audit
- 100+ test bets executed
- 50+ active users
- Stable frontend deployment

### Phase 2: Enhancement (Q2 2026)
**Goal**: Improve user experience and expand features

#### Planned Features:
- Real-time Notifications: WebSocket integration for live updates
- Advanced Analytics: Detailed betting statistics and history
- Judge Reputation System: Rating and ranking for judges
- Bet Templates: Pre-defined bet types for common scenarios
- Bet Discovery: Search and filter bets by category
- Mobile Optimization: Enhanced mobile experience
- Multi-language Support: Internationalization

#### Technical Improvements:
- Contract optimization for gas efficiency
- Enhanced error handling and user feedback
- Performance monitoring and analytics
- Automated testing suite expansion

### Phase 3: Ecosystem Expansion (Q3-Q4 2026)
**Goal**: Build a comprehensive betting ecosystem

#### Major Features:
- Tournament System: Multi-round betting competitions
- Liquidity Pools: Automated market making for bet odds
- Prediction Markets: Expand beyond peer-to-peer betting
- DAO Governance: Community-driven protocol decisions
- Cross-chain Support: Multi-network deployment
- AI Judge Assistance: AI-powered judge recommendations
- Yield Farming: Rewards for protocol participation

### Smart Contract Deployment

The contract is deployed on Mantle Sepolia at:
```
Contract Address: 0xCeAdbb12EEF1df1a8f2b03B3B6b635094eB70CaE
Network: Mantle Sepolia (Chain ID: 5003)
Block Explorer: https://sepolia.mantlescan.xyz
```
## Images

<img width="2940" height="5418" alt="screencapture-localhost-3000-2026-01-15-13_21_33" src="https://github.com/user-attachments/assets/6127b9f4-619a-4538-a6fc-2e61d10850ed" />

<img width="2940" height="4326" alt="screencapture-localhost-3000-dashboard-2026-01-15-13_21_10" src="https://github.com/user-attachments/assets/3b439b93-0d0a-4162-91e6-7f09812dda66" />

## Disclaimer

Verdict is a decentralized betting protocol. Users participate at their own risk. While the smart contracts are designed with security in mind, blockchain transactions carry inherent risks. Always bet responsibly and never wager more than you can afford to lose.

---

**Built with love on Mantle Sepolia**
