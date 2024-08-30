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
  const [voteCount, setVoteCount] = useState(1)
  const [removeVoteCount, setRemoveVoteCount] = useState(1)
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

  const handleError = (message) => {
    setError(message)
    setIsLoading(false)
  }

  const addProposal = async (e) => {
    e.preventDefault()
    if (!account) {
      handleError("Please connect your wallet first")
      return
    }
    if (proposalName.trim() === '') {
      handleError("Proposal name cannot be empty")
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
      fetchProposals()
    } catch (error) {
      handleError('Failed to add proposal. Please try again.')
    }
  }

  const vote = async (e) => {
    e.preventDefault()
    if (!account) {
      handleError("Please connect your wallet first")
      return
    }
    if (selectedProposal === '') {
      handleError("Please select a proposal to vote for")
      return
    }
    if (voteCount <= 0) {
      handleError("Number of votes must be greater than 0")
      return
    }
  
    setIsLoading(true)
    setError(null)
    try {
      const signer = provider.getSigner()
      const contract = new ethers.Contract(VOTING_CONTRACT_ADDRESS, VOTING_ABI, signer)
      const transaction = await contract.vote(selectedProposal, voteCount, {
        gasLimit: 1000000, // Adjust this value as needed
      })
      await transaction.wait()
      setSelectedProposal('')
      fetchProposals()
    } catch (error) {
      handleError('Failed to cast vote. Please ensure you are connected to the correct network and have sufficient gas.')
    }
  }
  
  const removeVote = async (e) => {
    e.preventDefault()
    if (!account) {
      handleError("Please connect your wallet first")
      return
    }
    if (selectedProposal === '') {
      handleError("Please select a proposal to remove votes from")
      return
    }
    setIsLoading(true)
    setError(null)
    try {
      const signer = provider.getSigner()
      const contract = new ethers.Contract(VOTING_CONTRACT_ADDRESS, VOTING_ABI, signer)
      const transaction = await contract.removeVote(selectedProposal, removeVoteCount)
      await transaction.wait()
      setSelectedProposal('')
      fetchProposals()
    } catch (error) {
      handleError('Failed to remove vote. Please try again.')
    }
  }

  const removeProposal = async (e) => {
    e.preventDefault()
    if (!account) {
      handleError("Please connect your wallet first")
      return
    }
    if (selectedProposal === '') {
      handleError("Please select a proposal to remove")
      return
    }
    setIsLoading(true)
    setError(null)
    try {
      const signer = provider.getSigner()
      const contract = new ethers.Contract(VOTING_CONTRACT_ADDRESS, VOTING_ABI, signer)
      const transaction = await contract.removeProposal(selectedProposal)
      await transaction.wait()
      setSelectedProposal('')
      fetchProposals()
    } catch (error) {
      handleError('Failed to remove proposal. Please try again.')
    }
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-200 via-purple-300 to-pink-300">
      <div className="max-w-5xl mx-auto p-8 bg-white shadow-2xl rounded-3xl relative z-10">
        <h1 className="text-6xl font-extrabold text-gray-900 mb-12 text-center">🗳️ Voting Interface</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          {/* Add Proposal Form */}
          <form onSubmit={addProposal} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-300">
            <h2 className="text-4xl font-semibold text-gray-800 mb-8">Add a New Proposal</h2>
            <div className="flex flex-col space-y-6">
              <input
                type="text"
                value={proposalName}
                onChange={(e) => setProposalName(e.target.value)}
                placeholder="Enter proposal name"
                className="border border-gray-400 p-5 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                disabled={!account || isLoading}
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-4 rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-800 transition duration-200 disabled:opacity-50"
                disabled={!account || isLoading}
              >
                {isLoading ? <span className="loader" /> : 'Add Proposal'}
              </button>
            </div>
          </form>

          {/* Voting Form */}
          <form onSubmit={vote} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-300">
            <h2 className="text-4xl font-semibold text-gray-800 mb-8">Vote for a Proposal</h2>
            <div className="flex flex-col space-y-6">
              <select 
                value={selectedProposal} 
                onChange={(e) => setSelectedProposal(e.target.value)}
                className="border border-gray-400 p-5 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
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
                className="border border-gray-400 p-5 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                disabled={!account || isLoading}
                min="1"
              />
              <button 
                type="submit" 
                className="bg-gradient-to-r from-green-600 to-teal-700 text-white py-4 rounded-lg shadow-lg hover:from-green-700 hover:to-teal-800 transition duration-200 disabled:opacity-50"
                disabled={!account || isLoading || selectedProposal === ''}
              >
                {isLoading ? <span className="loader" /> : 'Cast Vote'}
              </button>
            </div>
          </form>

          {/* Remove Vote Form */}
          <form onSubmit={removeVote} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-300">
            <h2 className="text-4xl font-semibold text-gray-800 mb-8">Remove Votes from a Proposal</h2>
            <div className="flex flex-col space-y-6">
              <select 
                value={selectedProposal} 
                onChange={(e) => setSelectedProposal(e.target.value)}
                className="border border-gray-400 p-5 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200"
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
                className="border border-gray-400 p-5 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200"
                disabled={!account || isLoading}
                min="1"
              />
              <button 
                type="submit" 
                className="bg-gradient-to-r from-red-600 to-pink-700 text-white py-4 rounded-lg shadow-lg hover:from-red-700 hover:to-pink-800 transition duration-200 disabled:opacity-50"
                disabled={!account || isLoading || selectedProposal === ''}
              >
                {isLoading ? <span className="loader" /> : 'Remove Vote'}
              </button>
            </div>
          </form>

          {/* Remove Proposal Form */}
          <form onSubmit={removeProposal} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-300">
            <h2 className="text-4xl font-semibold text-gray-800 mb-8">Remove a Proposal</h2>
            <div className="flex flex-col space-y-6">
              <select 
                value={selectedProposal} 
                onChange={(e) => setSelectedProposal(e.target.value)}
                className="border border-gray-400 p-5 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200"
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
                className="bg-gradient-to-r from-red-600 to-pink-700 text-white py-4 rounded-lg shadow-lg hover:from-red-700 hover:to-pink-800 transition duration-200 disabled:opacity-50"
                disabled={!account || isLoading || selectedProposal === ''}
              >
                {isLoading ? <span className="loader" /> : 'Remove Proposal'}
              </button>
            </div>
          </form>
        </div>

        {/* Display Error Message */}
        {error && <div className="text-red-700 text-center mt-8 text-lg font-semibold">{error}</div>}

        {/* Proposals List */}
        <div className="mt-12">
          <h2 className="text-4xl font-semibold text-gray-800 mb-8">Proposals</h2>
          <ul className="space-y-6">
            {proposals.map((proposal, index) => (
              <li key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-300">
                <h3 className="text-2xl font-semibold text-gray-800">{proposal.name}</h3>
                <p className="text-gray-700">Votes: {proposal.voteCount}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
