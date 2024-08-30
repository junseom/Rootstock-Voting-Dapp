// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Voting {
    struct Proposal {
        string name;
        uint voteCount;
    }

    mapping(address => mapping(uint => uint)) public voterVotes; // Mapping to keep track of user votes per proposal
    Proposal[] public proposals;
    address public owner;

    event VoteCast(address voter, uint proposalIndex);
    event ProposalAdded(string name, address proposer);
    event VoteRemoved(address voter, uint proposalIndex);
    event ProposalRemoved(uint proposalIndex, string name);

    constructor(string[] memory initialProposals) {
        owner = msg.sender;
        for (uint i = 0; i < initialProposals.length; i++) {
            addProposal(initialProposals[i]);
        }
    }

    function addProposal(string memory name) public {
        proposals.push(Proposal({
            name: name,
            voteCount: 0
        }));
        emit ProposalAdded(name, msg.sender);
    }

    function removeProposal(uint proposalIndex) public {
        require(msg.sender == owner, "Only the owner can remove proposals");
        require(proposalIndex < proposals.length, "Invalid proposal index");

        // Emit the event before removing the proposal to ensure accurate data is recorded
        emit ProposalRemoved(proposalIndex, proposals[proposalIndex].name);

        // If the proposal to be removed is not the last one
        if (proposalIndex < proposals.length - 1) {
            // Move the last proposal to the slot of the proposal to be removed
            proposals[proposalIndex] = proposals[proposals.length - 1];
        }
        proposals.pop(); // Remove the last proposal (which is now duplicated)
    }

    function vote(uint proposalIndex, uint numberOfVotes) public {
        require(proposalIndex < proposals.length, "Invalid proposal index");
        require(numberOfVotes > 0, "Number of votes must be greater than 0");

        uint currentVotes = voterVotes[msg.sender][proposalIndex];
        proposals[proposalIndex].voteCount += numberOfVotes;
        voterVotes[msg.sender][proposalIndex] = currentVotes + numberOfVotes; // Track votes per user per proposal

        emit VoteCast(msg.sender, proposalIndex);
    }

    function removeVote(uint proposalIndex, uint numberOfVotes) public {
        require(proposalIndex < proposals.length, "Invalid proposal index");
        require(voterVotes[msg.sender][proposalIndex] >= numberOfVotes, "You have not voted enough times to remove this many votes");

        proposals[proposalIndex].voteCount -= numberOfVotes;
        voterVotes[msg.sender][proposalIndex] -= numberOfVotes;

        emit VoteRemoved(msg.sender, proposalIndex);
    }

    function getProposalsCount() public view returns (uint) {
        return proposals.length;
    }

    function getProposal(uint index) public view returns (string memory, uint) {
        require(index < proposals.length, "Invalid proposal index");
        return (proposals[index].name, proposals[index].voteCount);
    }

    function getVotesByUserForProposal(address user, uint proposalIndex) public view returns (uint) {
        require(proposalIndex < proposals.length, "Invalid proposal index");
        return voterVotes[user][proposalIndex];
    }
}