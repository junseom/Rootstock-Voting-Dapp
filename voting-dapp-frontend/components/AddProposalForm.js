'use client'
import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { useWallet } from '../app/context/WalletContext'
import { VOTING_ABI, VOTING_CONTRACT_ADDRESS } from '../utils/contracts'

export default function VotingInterface() {
  const [proposalName, setProposalName] = useState('')
  const [selectedProposal, setSelectedProposal] = useState('')
  const [proposals, setProposals] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasVoted, setHasVoted] = useState(false)
  const [voteCount, setVoteCount] = useState(1) // State to track the number of votes
  const [removeVoteCount, setRemoveVoteCount] = useState(1) // State to track the number of votes to remove
  const [error, setError] = useState(null)
  const { account, provider } = useWallet()

  useEffect(() => {
    if (account && provider) {
      fetchProposals()
      checkIfUserHasVoted()
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

  const checkIfUserHasVoted = async () => {
    try {
      const contract = new ethers.Contract(VOTING_CONTRACT_ADDRESS, VOTING_ABI, provider)
      const userVoteCount = await contract.getVotesByUserForProposal(account, selectedProposal) // Assuming getVotesByUserForProposal is a function in the contract
      setHasVoted(userVoteCount.toNumber() > 0)
    } catch (error) {
      console.error('Error checking voting status:', error)
    }
  }

  const addProposal = async (e) => {
    e.preventDefault()
    if (!account) {
      setError("Please connect your wallet first")
      return
    }
    setIsLoading(true)
    setError(null)
    try {
      const signer = provider.getSigner()
      const contract = new ethers.Contract(VOTING_CONTRACT_ADDRESS, VOTING_ABI, signer)
      const transaction = await contract.addProposal(proposalName)
      await transaction.wait()
      setProposalName('')
      console.log('Proposal added successfully')
      fetchProposals()
    } catch (error) {
      console.error('Error adding proposal:', error)
      setError('Failed to add proposal. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const vote = async (e) => {
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
      const transaction = await contract.vote(selectedProposal, voteCount) // Modified to pass voteCount
      await transaction.wait()
      setSelectedProposal('')
      console.log('Vote cast successfully')
      fetchProposals()
      checkIfUserHasVoted()
    } catch (error) {
      console.error('Error casting vote:', error)
      setError('Failed to cast vote. You might have already voted.')
    } finally {
      setIsLoading(false)
    }
  }

  const removeVote = async (e) => {
    e.preventDefault()
    if (!account) {
      setError("Please connect your wallet first")
      return
    }
    if (selectedProposal === '') {
      setError("Please select a proposal to remove votes from")
      return
    }
    setIsLoading(true)
    setError(null)
    try {
      const signer = provider.getSigner()
      const contract = new ethers.Contract(VOTING_CONTRACT_ADDRESS, VOTING_ABI, signer)
      const transaction = await contract.removeVote(selectedProposal, removeVoteCount) // Call the removeVote function
      await transaction.wait()
      setSelectedProposal('')
      console.log('Vote removed successfully')
      fetchProposals()
      checkIfUserHasVoted()
    } catch (error) {
      console.error('Error removing vote:', error)
      setError('Failed to remove vote. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-xl rounded-lg">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">🗳️ Voting Interface</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Add Proposal Form */}
        <form onSubmit={addProposal} className="bg-gray-50 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Add a New Proposal</h2>
          <div className="flex flex-col space-y-4">
            <input
              type="text"
              value={proposalName}
              onChange={(e) => setProposalName(e.target.value)}
              placeholder="Enter proposal name"
              className="border border-gray-300 p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              disabled={!account || isLoading}
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 rounded-md hover:from-blue-600 hover:to-indigo-600 transition duration-200 disabled:opacity-50"
              disabled={!account || isLoading}
            >
              {isLoading ? <span className="loader" /> : 'Add Proposal'}
            </button>
          </div>
        </form>

        {/* Voting Form */}
        <form onSubmit={vote} className="bg-gray-50 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Vote for a Proposal</h2>
          <div className="flex flex-col space-y-4">
            <select 
              value={selectedProposal} 
              onChange={(e) => setSelectedProposal(e.target.value)}
              className="border border-gray-300 p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
              disabled={!account || isLoading}
            >
              <option value="">Select a proposal</option>
              {proposals.map((proposal, index) => (
                <option key={index} value={index}>
                  {proposal.name} ({proposal.voteCount} votes)
                </option>
              ))}
            </select>
            <input
              type="number"
              value={voteCount}
              onChange={(e) => setVoteCount(Number(e.target.value))}
              placeholder="Number of votes"
              className="border border-gray-300 p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
              disabled={!account || isLoading}
              min="1"
            />
            <button 
              type="submit" 
              className="bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 rounded-md hover:from-green-600 hover:to-teal-600 transition duration-200 disabled:opacity-50"
              disabled={!account || isLoading || selectedProposal === ''}
            >
              {isLoading ? <span className="loader" /> : 'Cast Vote'}
            </button>
          </div>
        </form>

        {/* Remove Vote Form */}
        <form onSubmit={removeVote} className="bg-gray-50 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Remove Votes from a Proposal</h2>
          <div className="flex flex-col space-y-4">
            <select 
              value={selectedProposal} 
              onChange={(e) => setSelectedProposal(e.target.value)}
              className="border border-gray-300 p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200"
              disabled={!account || isLoading}
            >
              <option value="">Select a proposal</option>
              {proposals.map((proposal, index) => (
                <option key={index} value={index}>
                  {proposal.name} ({proposal.voteCount} votes)
                </option>
              ))}
            </select>
            <input
              type="number"
              value={removeVoteCount}
              onChange={(e) => setRemoveVoteCount(Number(e.target.value))}
              placeholder="Number of votes to remove"
              className="border border-gray-300 p-4 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200"
              disabled={!account || isLoading}
              min="1"
            />
            <button 
              type="submit" 
              className="bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 rounded-md hover:from-red-600 hover:to-pink-600 transition duration-200 disabled:opacity-50"
              disabled={!account || isLoading || selectedProposal === ''}
            >
              {isLoading ? <span className="loader" /> : 'Remove Vote'}
            </button>
          </div>
        </form>
      </div>

      {error && <p className="text-red-600 font-semibold mb-8 text-center">{error}</p>}

      <h2 className="text-3xl font-bold text-gray-700 mb-6">Current Proposals</h2>
      {proposals.length === 0 ? (
        <p className="text-gray-500 text-center">No proposals yet. Be the first to add one!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {proposals.map((proposal, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
              <h3 className="text-xl font-bold text-gray-800">{proposal.name}</h3>
              <p className="text-gray-600 mt-2">{proposal.voteCount} votes</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}