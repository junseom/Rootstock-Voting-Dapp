// components/Results.js
'use client'

import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { useWallet } from '../app/context/WalletContext'
import { VOTING_ABI, VOTING_CONTRACT_ADDRESS } from '../utils/contracts'

export default function Results() {
  const [results, setResults] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const { provider } = useWallet()

  const fetchResults = async () => {
    setIsLoading(true)
    setError(null)

    if (provider) {
      try {
        const contract = new ethers.Contract(VOTING_CONTRACT_ADDRESS, VOTING_ABI, provider)

        // Assuming your contract has a method to get all candidates and their vote counts
        const candidates = await contract.getCandidates()
        const voteCounts = await Promise.all(candidates.map(c => contract.getVotes(c)))
        
        const resultsObj = candidates.reduce((acc, candidate, index) => {
          acc[candidate] = voteCounts[index].toNumber()
          return acc
        }, {})

        setResults(resultsObj)
      } catch (error) {
        console.error('Error fetching results:', error)
        setError('Failed to fetch voting results')
      } finally {
        setIsLoading(false)
      }
    }
  }

  useEffect(() => {
    if (provider) {
      fetchResults()
    }
  }, [provider])

  if (isLoading) return <div>Loading results...</div>
  if (error) return <div className="text-red-500">{error}</div>

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4">Voting Results</h2>
      {Object.keys(results).length > 0 ? (
        <ul>
          {Object.entries(results).map(([candidate, votes]) => (
            <li key={candidate} className="mb-2">
              {candidate}: {votes} votes
            </li>
          ))}
        </ul>
      ) : (
        <p>No voting results available.</p>
      )}
      <button 
        onClick={fetchResults} 
        className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Refresh Results
      </button>
    </div>
  )
}