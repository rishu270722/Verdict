'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { metaMask } from 'wagmi/connectors'
import { createPublicClient, http } from 'viem'
import Link from 'next/link'
import { CreateBetForm } from '../components/CreateBetForm'
import { BetCard } from '../components/BetCard'
import { abi, contractAddress } from '../config'

interface Bet {
  id: number
  creator: string
  opponent: string
  wagerAmount: string
  terms: string
  judges: string[]
  requiredVotes: number
  status: 'pending' | 'active' | 'resolved'
  winner?: string
}

export default function Dashboard() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [userBets, setUserBets] = useState<Bet[]>([])
  const [isLoadingBets, setIsLoadingBets] = useState(false)
  const isFetchingRef = useRef(false)

  // Create public client for reading contract data
  const publicClient = useMemo(() => createPublicClient({
    chain: {
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
    },
    transport: http('https://rpc.sepolia.mantle.xyz'),
  }), [])

  // Fetch user bets from contract
  useEffect(() => {
    if (!isConnected || !address) {
      setUserBets([])
      setIsLoadingBets(false)
      isFetchingRef.current = false
      return
    }

    if (isFetchingRef.current) return // Prevent concurrent fetches

    const fetchUserBets = async () => {
      isFetchingRef.current = true
      setIsLoadingBets(true)
      try {
        // Get total bet count
        const betCount = await publicClient.readContract({
          address: contractAddress as `0x${string}`,
          abi,
          functionName: 'betCount',
        }) as bigint

        console.log('Total bet count:', betCount.toString())

        const count = Number(betCount)
        
        if (count === 0) {
          setUserBets([])
          setIsLoadingBets(false)
          return
        }

        const bets: Bet[] = []

        // Fetch last 10 bets only (reduce load)
        const startIndex = Math.max(0, count - 10)

        for (let i = startIndex; i < count; i++) {
          try {
            // Get bet details
            const betData = await publicClient.readContract({
              address: contractAddress as `0x${string}`,
              abi,
              functionName: 'bets',
              args: [BigInt(i)],
            }) as readonly [string, string, bigint, bigint, string, bigint, string, bigint, bigint]

            const [creator, opponent, requiredVotes, wagerAmount, terms, status, winner] = betData

            // Get judges for this bet
            const judges = await publicClient.readContract({
              address: contractAddress as `0x${string}`,
              abi,
              functionName: 'getJudges',
              args: [BigInt(i)],
            }) as readonly string[]

            console.log(`Bet ${i}:`, {
              creator,
              opponent,
              requiredVotes: requiredVotes.toString(),
              wagerAmount: wagerAmount.toString(),
              terms,
              status: status.toString(),
              winner,
              judges
            })

            // Check if user is involved in this bet
            const userAddressLower = address.toLowerCase()
            const isCreator = creator.toLowerCase() === userAddressLower
            const isOpponent = opponent.toLowerCase() === userAddressLower
            const isJudge = judges.some(judge => judge.toLowerCase() === userAddressLower)

            if (isCreator || isOpponent || isJudge) {
              console.log(`User ${address} is involved in bet ${i}:`, {
                role: isCreator ? 'creator' : isOpponent ? 'opponent' : 'judge',
                betId: i,
                status: Number(status) === 0 ? 'pending' : Number(status) === 1 ? 'active' : 'resolved'
              })

              bets.push({
                id: i,
                creator,
                opponent,
                wagerAmount: (Number(wagerAmount) / 10**18).toFixed(2), // Convert from wei to MNT
                terms,
                judges: [...judges],
                requiredVotes: Number(requiredVotes),
                status: Number(status) === 0 ? 'pending' : Number(status) === 1 ? 'active' : 'resolved',
                winner: winner === '0x0000000000000000000000000000000000000000' ? undefined : winner
              })
            }

            // Add small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 100))
          } catch (error) {
            console.error(`Error fetching bet ${i}:`, error)
          }
        }

        setUserBets(bets)
        console.log(`Found ${bets.length} bets for user ${address}:`, bets)
      } catch (error) {
        console.error('Error fetching user bets:', error)
        setUserBets([])
      } finally {
        setIsLoadingBets(false)
        isFetchingRef.current = false
      }
    }

    fetchUserBets()
  }, [isConnected, address, publicClient])

  // TODO: Implement contract data fetching
  // const { data: betCount } = useReadContract({
  //   address: contractAddress as `0x${string}`,
  //   abi,
  //   functionName: 'betCount',
  // })

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-8">Connect Your Wallet</h1>
          <button
            onClick={() => connect({ connector: metaMask() })}
            className="bg-orange-600 hover:bg-orange-700 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Connect MetaMask
          </button>
          <Link href="/" className="block mt-8 text-yellow-400 hover:text-yellow-300">
            ← Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-yellow-600/20 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-3xl font-bold text-yellow-400 hover:text-yellow-300 transition-colors">
              Verdict
            </Link>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-sm text-gray-400">Connected Wallet</div>
                <div className="text-sm font-mono text-yellow-400">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </div>
              </div>
              <button
                onClick={() => disconnect()}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105"
              >
                Disconnect
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome to Your Dashboard</h1>
          <p className="text-gray-400 text-lg">Manage your bets, accept challenges, and oversee resolutions</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900 p-4 rounded-xl border border-yellow-600/20">
            <div className="text-2xl font-bold text-yellow-400">
              {userBets.filter(bet => bet.creator === address).length}
            </div>
            <div className="text-sm text-gray-400">Bets Created</div>
          </div>
          <div className="bg-gray-900 p-4 rounded-xl border border-yellow-600/20">
            <div className="text-2xl font-bold text-green-400">
              {userBets.filter(bet => bet.creator === address && bet.status === 'active').length}
            </div>
            <div className="text-sm text-gray-400">Active Bets</div>
          </div>
          <div className="bg-gray-900 p-4 rounded-xl border border-yellow-600/20">
            <div className="text-2xl font-bold text-yellow-400">
              {userBets.filter(bet => bet.opponent === address && bet.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-400">Pending Invites</div>
          </div>
          <div className="bg-gray-900 p-4 rounded-xl border border-yellow-600/20">
            <div className="text-2xl font-bold text-purple-400">
              {userBets.filter(bet => bet.judges.includes(address!)).length}
            </div>
            <div className="text-sm text-gray-400">Judging</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-yellow-600/10 to-yellow-600/5 p-6 rounded-xl border border-yellow-600/20 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-yellow-400">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-yellow-600 hover:bg-yellow-500 px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 text-black shadow-lg hover:shadow-yellow-600/25"
            >
              {showCreateForm ? 'Cancel' : 'Create New Bet'}
            </button>
            <button
              onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
              className="border-2 border-yellow-600 hover:border-yellow-500 px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:bg-yellow-600 hover:text-black"
            >
              View All Bets
            </button>
          </div>
        </div>

        {/* Create Bet Form */}
        {showCreateForm && (
          <div className="mb-8 bg-gray-900 p-6 rounded-xl border border-yellow-600/20">
            <h3 className="text-2xl font-bold mb-4 text-yellow-400">Create New Bet</h3>
            <CreateBetForm onSuccess={() => setShowCreateForm(false)} />
          </div>
        )}

        {/* Bets Sections */}
        <div className="space-y-8">
          {/* Urgent Actions */}
          <section className="bg-red-900/20 p-6 rounded-xl border border-red-600/30">
            <h2 className="text-2xl font-bold mb-4 text-yellow-400">
              Urgent Actions Required
            </h2>
            <div className="space-y-4">
              {/* Pending Invitations */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-red-300">Bet Invitations Awaiting Your Response</h3>
                <div className="grid gap-4">
                  {isLoadingBets ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
                    </div>
                  ) : userBets.filter(bet => bet.opponent === address && bet.status === 'pending').length > 0 ? (
                    userBets.filter(bet => bet.opponent === address && bet.status === 'pending').map((bet) => (
                      <BetCard key={bet.id} bet={bet} userAddress={address!} />
                    ))
                  ) : (
                    <p className="text-gray-400 text-center py-4 bg-gray-800/50 rounded-lg">No pending invitations. You&apos;re all caught up!</p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Your Bets */}
          <section className="bg-gray-900/50 p-6 rounded-xl border border-gray-700">
            <h2 className="text-2xl font-bold mb-4 text-yellow-400">
              Your Bets
            </h2>
            <div className="space-y-6">
              {/* Created Bets */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-yellow-400">Bets You&apos;ve Created</h3>
                <div className="grid gap-4">
                  {isLoadingBets ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
                    </div>
                  ) : userBets.filter(bet => bet.creator === address).length > 0 ? (
                    userBets.filter(bet => bet.creator === address).map((bet) => (
                      <BetCard key={bet.id} bet={bet} userAddress={address!} />
                    ))
                  ) : (
                    <p className="text-gray-400 text-center py-4 bg-gray-800/50 rounded-lg">No bets created yet. Create your first bet above!</p>
                  )}
                </div>
              </div>

              {/* Active Created Bets */}
              {userBets.filter(bet => bet.creator === address && bet.status === 'active').length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-yellow-400">Active Bets (Opponents Accepted)</h3>
                  <div className="grid gap-4">
                    {userBets.filter(bet => bet.creator === address && bet.status === 'active').map((bet) => (
                      <BetCard key={bet.id} bet={bet} userAddress={address!} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Participating Bets */}
          <section className="bg-gray-900/50 p-6 rounded-xl border border-gray-700">
            <h2 className="text-2xl font-bold mb-4 text-yellow-400">
              Bets You&apos;re Participating In
            </h2>
            <div className="space-y-6">
              {/* Active Participation */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-green-300">Active Bets as Opponent</h3>
                <div className="grid gap-4">
                  {isLoadingBets ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
                    </div>
                  ) : userBets.filter(bet => bet.opponent === address && bet.status === 'active').length > 0 ? (
                    userBets.filter(bet => bet.opponent === address && bet.status === 'active').map((bet) => (
                      <BetCard key={bet.id} bet={bet} userAddress={address!} />
                    ))
                  ) : (
                    <p className="text-gray-400 text-center py-4 bg-gray-800/50 rounded-lg">No active bets you&apos;re participating in.</p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Judging */}
          <section className="bg-gray-900/50 p-6 rounded-xl border border-gray-700">
            <h2 className="text-2xl font-bold mb-4 text-yellow-400">
              Bets You&apos;re Judging
            </h2>
            <div className="grid gap-4">
              {isLoadingBets ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
                </div>
              ) : userBets.filter(bet => bet.judges.includes(address!)).length > 0 ? (
                userBets.filter(bet => bet.judges.includes(address!)).map((bet) => (
                  <BetCard key={bet.id} bet={bet} userAddress={address!} />
                ))
              ) : (
                <p className="text-gray-400 text-center py-4 bg-gray-800/50 rounded-lg">No bets assigned to you for judging.</p>
              )}
            </div>
          </section>

          {/* Resolved Bets */}
          <section className="bg-gray-900/50 p-6 rounded-xl border border-gray-700">
            <h2 className="text-2xl font-bold mb-4 text-yellow-400">
              Resolved Bets History
            </h2>
            <div className="grid gap-4">
              {isLoadingBets ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
                </div>
              ) : userBets.filter(bet => (bet.creator === address || bet.opponent === address || bet.judges.includes(address!)) && bet.status === 'resolved').length > 0 ? (
                userBets.filter(bet => (bet.creator === address || bet.opponent === address || bet.judges.includes(address!)) && bet.status === 'resolved').map((bet) => (
                  <BetCard key={bet.id} bet={bet} userAddress={address!} />
                ))
              ) : (
                <p className="text-gray-400 text-center py-4 bg-gray-800/50 rounded-lg">No resolved bets in your history.</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}