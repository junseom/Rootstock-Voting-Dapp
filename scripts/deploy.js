// const hre = require("hardhat");

// async function main() {
//   const initialProposals = ["Proposal 1", "Proposal 2", "Proposal 3"];

//   const Voting = await hre.ethers.getContractFactory("Voting");
//   const voting = await Voting.deploy(initialProposals);

//   await voting.deployed();

//   console.log("Voting contract deployed to:", voting.address);
// }

// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });

const hre = require("hardhat");

async function main() {
  // Define initial proposals
  const initialProposals = ["Proposal 1", "Proposal 2", "Proposal 3"];

  // Get contract factory
  const Voting = await hre.ethers.getContractFactory("Voting");

  // Deploy contract
  const voting = await Voting.deploy(initialProposals);

  // Wait for deployment to finish
  await voting.deployed();

  // Log the contract address
  console.log("Voting contract deployed to:", voting.address);
}

// Run the deployment script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
