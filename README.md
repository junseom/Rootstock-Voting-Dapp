# Decentralized Voting Application

A decentralized voting application built on Rootstock (RSK), allowing users to create secure polls or elections and vote using RSK tokens. The application ensures transparency and immutability of votes on the blockchain, empowering users to participate in decentralized decision-making.

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Setup](#setup)
- [Usage](#usage)
- [Smart Contract Methods](#smart-contract-methods)
- [Contributing](#contributing)
- [License](#license)

## Features
- Add or remove proposals within a voting session.
- Cast votes and remove votes for proposals.
- View proposal details, including vote counts.
- Easily track votes by users per proposal.

## Installation

Follow these steps to set up the project on your local machine:

### Prerequisites
- [Node.js](https://nodejs.org/) (v14 or later)
- [Hardhat](https://hardhat.org/)
- [MetaMask](https://metamask.io/) browser extension
- [Git](https://git-scm.com/) installed on your machine
- An account on [RSK Testnet Faucet](https://faucet.rsk.co/) to get test tokens

### Steps
**Compiling and deploying the contract is not required, as the contract as already been deployed on the Rootstock Testnet**

1. **Clone the repository:**
    ```bash
    git clone git@github.com:Pulsator01/Decentralised-Voting-Application.git
    cd Decentralised-Voting-Application
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Create a `.env` file** in the root directory and add the following:
    ```bash
    PRIVATE_KEY=<your_private_key>
    RSK_TESTNET_URL=https://public-node.testnet.rsk.co
    ```
   Replace `<your_private_key>` with your RSK testnet account private key.

4. **Compile the smart contracts:**
    ```bash
    npx hardhat compile
    ```

5. **Deploy the smart contract to the RSK Testnet:**
    ```bash
    npx hardhat run scripts/deploy.js --network testnet
    ```

6. **Run the frontend:**
   **Navigate to the frontend folder and run the dev script**
    ```bash
    cd voting-dapp-frontend
    npm install
    npm run dev
    ```
   Open your browser and navigate to `http://localhost:3000`.

## Setup

To interact with the smart contract through the frontend:

1. **Connect your MetaMask wallet** [to the RSK Testnet](https://dev.rootstock.io/dev-tools/wallets/metamask/#connect-with-metamask).
2. **Get test RSK tokens** from the [RSK Testnet Faucet](https://faucet.rsk.co/).
3. **Deploy the contract** as mentioned in the installation steps.
4. **Start creating sessions and casting votes!**

## Usage

- **Add Proposals:** Add proposals to a session.
- **Vote:** Cast votes on the proposals.
- **Remove Votes:** Remove votes if needed.
- **View Proposals and Votes:** Check the status of the proposals and votes at any time.

## Smart Contract Methods

The `Voting` smart contract includes the following methods:

### 1. `createSession()`
Creates a new voting session. Only the user who creates the session can add or remove proposals.

### 2. `addProposal(uint sessionId, string memory name)`
Adds a proposal to a specific session. Only the session creator can add proposals.

- **Parameters:**
  - `sessionId`: The ID of the session.
  - `name`: The name of the proposal.

### 3. `removeProposal(uint sessionId, uint proposalIndex)`
Removes a proposal from a specific session. Only the session creator can remove proposals.

- **Parameters:**
  - `sessionId`: The ID of the session.
  - `proposalIndex`: The index of the proposal to remove.

### 4. `vote(uint sessionId, uint proposalIndex, uint numberOfVotes)`
Allows users to cast votes for a proposal in a session.

- **Parameters:**
  - `sessionId`: The ID of the session.
  - `proposalIndex`: The index of the proposal.
  - `numberOfVotes`: The number of votes to cast.

### 5. `removeVote(uint sessionId, uint proposalIndex, uint numberOfVotes)`
Allows users to remove their votes from a proposal in a session.

- **Parameters:**
  - `sessionId`: The ID of the session.
  - `proposalIndex`: The index of the proposal.
  - `numberOfVotes`: The number of votes to remove.

### 6. `getProposalsCount(uint sessionId) public view returns (uint)`
Returns the number of proposals in a specific session.

- **Parameters:**
  - `sessionId`: The ID of the session.

### 7. `getProposal(uint sessionId, uint index) public view returns (string memory, uint)`
Returns the details of a specific proposal (name and vote count).

- **Parameters:**
  - `sessionId`: The ID of the session.
  - `index`: The index of the proposal.

### 8. `getVotesByUserForProposal(uint sessionId, address user, uint proposalIndex) public view returns (uint)`
Returns the number of votes a user has cast for a specific proposal.

- **Parameters:**
  - `sessionId`: The ID of the session.
  - `user`: The address of the user.
  - `proposalIndex`: The index of the proposal.

## Contributing
Contributions are welcome! Please fork this repository and open a pull request with your improvements.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
