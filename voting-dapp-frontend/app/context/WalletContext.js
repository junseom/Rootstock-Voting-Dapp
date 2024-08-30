// app/context/WalletContext.js
'use client'

import { createContext, useState, useContext, useEffect } from 'react'
import { ethers } from 'ethers'

const WalletContext = createContext()

export function WalletProvider({ children }) {
  const [account, setAccount] = useState(null)
  const [provider, setProvider] = useState(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
      const ethProvider = new ethers.providers.Web3Provider(window.ethereum)
      setProvider(ethProvider)

      // Check if already connected
      ethProvider.listAccounts().then(accounts => {
        if (accounts.length > 0) {
          setAccount(accounts[0])
        }
      })

      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts) => {
        setAccount(accounts[0] || null)
      })
    }
  }, [])

  const connectWallet = async () => {
    if (provider) {
      try {
        const accounts = await provider.send('eth_requestAccounts', [])
        setAccount(accounts[0])
      } catch (error) {
        console.error('Failed to connect wallet:', error)
      }
    }
  }

  return (
    <WalletContext.Provider value={{ account, connectWallet, provider }}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  return useContext(WalletContext)
}