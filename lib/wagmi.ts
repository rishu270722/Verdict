import { http, createConfig } from 'wagmi'
import { metaMask } from 'wagmi/connectors'
import { defineChain } from 'viem'

const mantleSepolia = defineChain({
  id: 5003,
  name: 'Mantle Sepolia',
  network: 'mantle-sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Mantle',
    symbol: 'MNT',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.sepolia.mantle.xyz'],
    },
  },
  blockExplorers: {
    default: { name: 'MantleScan', url: 'https://sepolia.mantlescan.xyz' },
  },
  testnet: true,
})

export const config = createConfig({
  chains: [mantleSepolia],
  connectors: [
    metaMask(),
  ],
  transports: {
    [mantleSepolia.id]: http('https://rpc.sepolia.mantle.xyz'),
  },
})