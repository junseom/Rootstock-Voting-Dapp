

'use client'
import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { useWallet } from '../app/context/WalletContext'
import { VOTING_ABI, VOTING_CONTRACT_ADDRESS } from '../utils/contracts'

export default function VotingForm() {
  const [selectedProposal, setSelectedProposal] = useState('')
  const [proposals, setProposals] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const { account, provider } = useWallet()

  useEffect(() => {
    if (account && provider) {
      fetchProposals()
    }
  }, [account, provider])

  const fetchProposals = async () => {
    try {
      const contract = new ethers.Contract(VOTING_CONTRACT_ADDRESS, VOTING_ABI, provider)
      const proposalCount = await contract.getProposalsCount()
      const fetchedProposals = []
      for (let i = 0; i < proposalCount.toNumber(); i++) {
        const [name, voteCount] = await contract.getProposal(i)
        fetchedProposals.push({ name, voteCount: voteCount.toNumber() })
      }
      setProposals(fetchedProposals)
    } catch (error) {
      console.error('Error fetching proposals:', error)
      setError('Failed to fetch proposals. Please try again.')
    }
  }

  const submitVote = async (e) => {
    e.preventDefault()
    if (!account) {
      setError("Please connect your wallet first")
      return
    }
    if (selectedProposal === '') {
      setError("Please select a proposal to vote for")
      return
    }
    setIsLoading(true)
    setError(null)
    try {
      const signer = provider.getSigner()
      const contract = new ethers.Contract(VOTING_CONTRACT_ADDRESS, VOTING_ABI, signer)
      const transaction = await contract.vote(selectedProposal)
      await transaction.wait()
      
      setSelectedProposal('')
      console.log('Vote submitted successfully')
      fetchProposals() // Refresh proposals after voting
    } catch (error) {
      console.error('Error submitting vote:', error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="my-4">
      <h2 className="text-xl font-semibold mb-4">Cast Your Vote</h2>
      <form onSubmit={submitVote}>
        <select 
          value={selectedProposal} 
          onChange={(e) => setSelectedProposal(e.target.value)}
          className="border p-2 mr-2 w-full mb-2"
          disabled={!account || isLoading}
        >
          <option value="">Select a proposal</option>
          {proposals.map((proposal, index) => (
            <option key={index} value={index}>
              {proposal.name} ({proposal.voteCount} votes)
            </option>
          ))}
        </select>
        <button 
          type="submit" 
          className="bg-green-500 text-white p-2 rounded disabled:bg-gray-400 w-full"
          disabled={!account || isLoading || selectedProposal === ''}
        >
          {isLoading ? 'Submitting...' : 'Submit Vote'}
        </button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2">Current Proposals</h3>
        {proposals.length === 0 ? (
          <p>No proposals available.</p>
        ) : (
          <ul className="list-disc pl-5">
            {proposals.map((proposal, index) => (
              <li key={index}>
                {proposal.name}: {proposal.voteCount} votes
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}