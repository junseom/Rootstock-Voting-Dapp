Decentralized Voting Application
Overview

The Decentralized Voting Application is a blockchain-based voting system designed to ensure transparency, security, and integrity in the voting process. Built using Solidity smart contracts and integrated with a Next.js frontend, this project allows users to create voting sessions, add proposals, and cast or remove votes in a decentralized manner.
Features

    Create Voting Sessions: Initiate new voting sessions.
    Add and Remove Proposals: Manage proposals within each session.
    Cast and Remove Votes: Vote for or remove votes from proposals.
    Transparency: All transactions are recorded immutably on the blockchain.

Prerequisites

Before you begin, ensure you have the following installed:

    Node.js (version 14.x or later)
    npm (usually comes with Node.js)
    Hardhat (for Ethereum development)
    Git (for version control)

Installation
1. Clone the Repository

First, clone the repository to your local machine:

bash

git clone git@github.com:Pulsator01/Decentralised-Voting-Application.git
cd Decentralised-Voting-Application

2. Set Up the Backend

Navigate to the backend directory and install the dependencies:

bash

cd backend
npm install

3. Configure Hardhat

    Install Dependencies:

    Install Hardhat and its required packages:

    bash

npm install --save-dev hardhat @nomiclabs/hardhat-ethers ethers

Configure Hardhat:

Create a .env file in the backend directory to store your environment variables. This file should include your RSK Testnet or Mainnet credentials:

env

    RSK_API_URL=<your-rsk-api-url>
    PRIVATE_KEY=<your-private-key>

    Ensure you update the hardhat.config.js file with your network settings.

4. Deploy the Smart Contract

    Compile the Contract:

    Compile your smart contracts using Hardhat:

    bash

npx hardhat compile

Deploy the Contract:

Run the deployment script to deploy your smart contract to the blockchain:

bash

    npx hardhat run scripts/deploy.js --network <network>

    Replace <network> with your target network (e.g., rskTestnet).

5. Set Up the Frontend

Navigate to the frontend directory and install the dependencies:

bash

cd ../frontend
npm install

6. Configure Environment Variables

Create a .env file in the frontend directory and add your smart contract address and ABI:

env

NEXT_PUBLIC_CONTRACT_ADDRESS=<your-deployed-contract-address>
NEXT_PUBLIC_CONTRACT_ABI=<your-contract-abi>

7. Run the Application

Start the Next.js development server:

bash

npm run dev

The application should now be running at http://localhost:3000.
Usage

    Access the Application:
        Open your browser and navigate to http://localhost:3000.

    Interact with the Voting Interface:
        Create a Voting Session: Click on "Create Session" to start a new voting session.
        Add Proposals: Add new proposals to the active session.
        Vote: Select a proposal and cast your vote.
        Remove Votes: Remove votes from a proposal if needed.
        Remove Proposals: Remove proposals from the session if required.

Troubleshooting

    Contract Deployment Issues:
        Ensure you have sufficient gas for deployment.
        Verify your network configuration in hardhat.config.js.

    Frontend Issues:
        Check that your .env variables are correctly configured.
        Ensure the smart contract ABI and address are correct in the .env file.

Contributing

Contributions are welcome! Please follow these steps to contribute:

    Fork the repository.
    Create a new branch (git checkout -b feature/your-feature).
    Make your changes.
    Commit your changes (git commit -am 'Add new feature').
    Push to the branch (git push origin feature/your-feature).
    Open a pull request.

License

This project is licensed under the MIT License – see the LICENSE file for details.
