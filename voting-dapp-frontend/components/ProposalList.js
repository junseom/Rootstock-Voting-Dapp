// components/ProposalList.js
'use client'

import { useState } from 'react'

export default function ProposalList({ proposals }) {
  if (!proposals.length) {
    return <p>No proposals available.</p>
  }

  return (
    <div className="my-4">
      <h2 className="text-2xl font-semibold mb-4">Proposals</h2>
      <ul>
        {proposals.map((proposal, index) => (
          <li key={index} className="border p-2 mb-2">
            <span className="font-bold">{proposal.name}</span> - {proposal.voteCount} votes
          </li>
        ))}
      </ul>
    </div>
  )
}
