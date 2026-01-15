'use client'

import { useState } from 'react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
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

interface BetCardProps {
  bet: Bet
  userAddress: string
}

export function BetCard({ bet, userAddress }: BetCardProps) {
  const [voteFor, setVoteFor] = useState<'creator' | 'opponent'>('creator')

  const { writeContract: acceptContract, data: acceptHash, isPending: isAcceptPending } = useWriteContract()
  const { isLoading: isAcceptConfirming, isSuccess: isAcceptSuccess } = useWaitForTransactionReceipt({
    hash: acceptHash,
  })

  const { writeContract: voteContract, data: voteHash, isPending: isVotePending } = useWriteContract()
  const { isLoading: isVoteConfirming, isSuccess: isVoteSuccess } = useWaitForTransactionReceipt({
    hash: voteHash,
  })

  const isCreator = bet.creator === userAddress
  const isOpponent = bet.opponent === userAddress
  const isJudge = bet.judges.includes(userAddress)

  const handleAcceptBet = async () => {
    try {
      // Convert display amount back to wei (multiply by 10^18)
      const wagerAmountWei = BigInt(Math.floor(parseFloat(bet.wagerAmount) * 10 ** 18))

      console.log('Accepting bet with params:', {
        betId: bet.id,
        wagerAmount: bet.wagerAmount,
        wagerAmountWei: wagerAmountWei.toString()
      })

      acceptContract({
        address: contractAddress as `0x${string}`,
        abi,
        functionName: 'acceptBet',
        args: [BigInt(bet.id)],
        value: wagerAmountWei // Send the wager amount in wei
      })
    } catch (error) {
      console.error('Error accepting bet:', error)
    }
  }

  const handleVote = async () => {
    try {
      const winnerAddress = voteFor === 'creator' ? bet.creator : bet.opponent
      voteContract({
        address: contractAddress as `0x${string}`,
        abi,
        functionName: 'vote',
        args: [BigInt(bet.id), winnerAddress as `0x${string}`]
      })
    } catch (error) {
      console.error('Error voting:', error)
    }
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Bet #{bet.id}</h3>
          <p className="text-gray-300 mb-2">{bet.terms}</p>
          <p className="text-sm text-gray-400">
            Wager: {bet.wagerAmount} MNT • Judges: {bet.judges.length} • Required: {bet.requiredVotes}
          </p>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          bet.status === 'pending' ? 'bg-yellow-600' :
          bet.status === 'active' ? 'bg-green-600' : 'bg-blue-600'
        }`}>
          {bet.status}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-400">
          {isCreator ? 'You created this bet' :
           isOpponent ? 'You\'re invited to accept' :
           isJudge ? 'You\'re a judge' : ''}
        </div>

        {bet.status === 'pending' && isOpponent && (
          <button
            onClick={handleAcceptBet}
            disabled={isAcceptPending || isAcceptConfirming}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {isAcceptPending ? 'Accepting...' : isAcceptConfirming ? 'Confirming...' : isAcceptSuccess ? 'Accepted!' : 'Accept Bet'}
          </button>
        )}

        {bet.status === 'active' && isJudge && (
          <div className="flex gap-2">
            <select
              value={voteFor}
              onChange={(e) => setVoteFor(e.target.value as 'creator' | 'opponent')}
              className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-sm"
            >
              <option value="creator">Creator</option>
              <option value="opponent">Opponent</option>
            </select>
            <button
              onClick={handleVote}
              disabled={isVotePending || isVoteConfirming}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              {isVotePending ? 'Voting...' : isVoteConfirming ? 'Confirming...' : isVoteSuccess ? 'Voted!' : 'Vote'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}