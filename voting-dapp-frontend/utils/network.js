import { ethers } from 'ethers'

export const connectToRootstock = async () => {
  if (typeof window.ethereum !== 'undefined') {
    await window.ethereum.request({ method: 'eth_requestAccounts' })
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    
    // Request network change to Rootstock
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x1e' }], // chainId for Rootstock Mainnet
      })
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x1e',
              chainName: 'RSK Mainnet',
              nativeCurrency: {
                name: 'RSK BTC',
                symbol: 'RBTC',
                decimals: 18
              },
              rpcUrls: ['https://public-node.rsk.co'],
              blockExplorerUrls: ['https://explorer.rsk.co']
            }],
          })
        } catch (addError) {
          throw addError
        }
      }
      throw switchError
    }
    
    return provider
  } else {
    throw new Error('Please install MetaMask!')
  }
}