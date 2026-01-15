'use client'

import { useState, useEffect } from 'react'
import { useWriteContract, useWaitForTransactionReceipt, useAccount, useSwitchChain } from 'wagmi'
import { abi, contractAddress } from '../config'

interface CreateBetFormProps {
  onSuccess: () => void
}

export function CreateBetForm({ onSuccess }: CreateBetFormProps) {
  const { chain } = useAccount()
  const { switchChain } = useSwitchChain()
  const [formData, setFormData] = useState({
    opponent: '',
    wagerAmount: '',
    terms: '',
    judges: [''],
    requiredVotes: 1
  })

  const { writeContract, data: hash, isPending, error } = useWriteContract({
    mutation: {
      onError: (error) => {
        console.error('Transaction error:', error)
        console.error('Error details:', {
          message: error.message,
          cause: error.cause,
          stack: error.stack
        })
      },
      onSuccess: (hash) => {
        console.log('Transaction submitted successfully with hash:', hash)
        console.log('MantleScan link:', `https://sepolia.mantlescan.xyz/tx/${hash}`)
      }
    }
  })
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  // Log transaction hash when available
  useEffect(() => {
    if (hash) {
      console.log('Transaction submitted! Hash:', hash)
      console.log('View on MantleScan:', `https://sepolia.mantlescan.xyz/tx/${hash}`)
    }
  }, [hash])

  useEffect(() => {
    if (isPending) {
      console.log('Transaction is pending...')
    }
  }, [isPending])

  useEffect(() => {
    if (isConfirming) {
      console.log('Transaction is being confirmed...')
    }
  }, [isConfirming])

  useEffect(() => {
    if (error) {
      console.error('Transaction failed with error:', error)
    }
  }, [error])

  useEffect(() => {
    if (isSuccess && hash) {
      console.log('Transaction confirmed! Hash:', hash)
      onSuccess()
    }
  }, [isSuccess, hash, onSuccess])

  const isOnCorrectNetwork = chain?.id === 5003 // Mantle Sepolia

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    console.log('Form submitted with data:', formData)

    if (!isOnCorrectNetwork) {
      alert('Please switch to Mantle Sepolia network in MetaMask')
      switchChain({ chainId: 5003 })
      return
    }

    // Validate required fields...
    if (!formData.opponent || !formData.opponent.startsWith('0x')) {
      alert('Please enter a valid opponent address')
      return
    }

    if (!formData.wagerAmount || parseFloat(formData.wagerAmount) <= 0) {
      alert('Please enter a valid wager amount')
      return
    }

    if (!formData.terms.trim()) {
      alert('Please enter bet terms')
      return
    }

    const validJudges = formData.judges.filter(j => j.trim() !== '' && j.startsWith('0x'))
    if (validJudges.length < 1) {
      alert('Please add at least one valid judge address')
      return
    }

    if (formData.requiredVotes < 1 || formData.requiredVotes > validJudges.length) {
      alert('Required votes must be between 1 and the number of judges')
      return
    }

    try {
      // Convert MNT amount to wei (18 decimals)
      const wagerAmountWei = BigInt(Math.floor(parseFloat(formData.wagerAmount) * 10 ** 18))

      console.log('Creating bet with params:', {
        opponent: formData.opponent,
        judges: validJudges,
        requiredVotes: formData.requiredVotes,
        terms: formData.terms,
        wagerAmountWei: wagerAmountWei.toString(),
        contractAddress
      })

      const contractCall = {
        address: contractAddress as `0x${string}`,
        abi,
        functionName: 'createBet',
        args: [
          formData.opponent as `0x${string}`,
          validJudges.map(j => j as `0x${string}`),
          BigInt(formData.requiredVotes),
          formData.terms
        ],
        value: wagerAmountWei // Send wager amount in wei
      }

      console.log('Contract call details:', contractCall)

      console.log('Calling writeContract...')
      writeContract(contractCall)
      console.log('writeContract called successfully')
    } catch (error) {
      console.error('Error creating bet:', error)
      alert(`Error creating bet: ${error}`)
    }
  }

  const addJudge = () => {
    setFormData(prev => ({
      ...prev,
      judges: [...prev.judges, '']
    }))
  }

  const updateJudge = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      judges: prev.judges.map((judge, i) => i === index ? value : judge)
    }))
  }

  const removeJudge = (index: number) => {
    setFormData(prev => ({
      ...prev,
      judges: prev.judges.filter((_, i) => i !== index)
    }))
  }

  if (isSuccess) {
    return (
      <div className="bg-green-800 border border-green-600 p-4 rounded-lg">
        <p className="text-green-200">Bet created successfully!</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
      <h2 className="text-xl font-bold mb-6">Create New Bet</h2>

      {!isOnCorrectNetwork && (
        <div className="bg-yellow-800 border border-yellow-600 p-4 rounded-lg mb-6">
          <p className="text-yellow-200">
            ⚠️ Please switch to Mantle Sepolia network to create bets.
            <button
              onClick={() => switchChain({ chainId: 5003 })}
              className="ml-2 underline hover:no-underline"
            >
              Switch Network
            </button>
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Opponent Address</label>
          <input
            type="text"
            value={formData.opponent}
            onChange={(e) => setFormData(prev => ({ ...prev, opponent: e.target.value }))}
            placeholder="0x..."
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Wager Amount (MNT)</label>
          <input
            type="number"
            step="0.01"
            value={formData.wagerAmount}
            onChange={(e) => setFormData(prev => ({ ...prev, wagerAmount: e.target.value }))}
            placeholder="10"
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Bet Terms</label>
          <textarea
            value={formData.terms}
            onChange={(e) => setFormData(prev => ({ ...prev, terms: e.target.value }))}
            placeholder="Describe the bet conditions..."
            rows={3}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Judges</label>
          {formData.judges.map((judge, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={judge}
                onChange={(e) => updateJudge(index, e.target.value)}
                placeholder="Judge address 0x..."
                className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400"
                required
              />
              {formData.judges.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeJudge(index)}
                  className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg text-sm"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addJudge}
            className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded-lg text-sm"
          >
            Add Judge
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Required Votes</label>
          <input
            type="number"
            min="1"
            value={formData.requiredVotes}
            onChange={(e) => setFormData(prev => ({ ...prev, requiredVotes: parseInt(e.target.value) || 1 }))}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isPending || isConfirming}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-medium transition-colors"
        >
          {isPending ? 'Creating Bet...' : isConfirming ? 'Confirming...' : 'Create Bet'}
        </button>
      </form>
    </div>
  )
}