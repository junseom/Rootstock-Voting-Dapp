// components/ConnectWallet.js
'use client'

import { useWallet } from '../app/context/WalletContext'

export default function ConnectWallet() {
  const { account, connectWallet } = useWallet()

  return (
    <div>
      {account ? (
        <p>Connected: {account}</p>
      ) : (
        <button 
          onClick={connectWallet}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Connect Wallet
        </button>
      )}
    </div>
  )
}