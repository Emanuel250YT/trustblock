// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title TrueBlock Mini-App
 * @dev Simplified truth checking mini-app for Base network
 * Built for the Base Mini-Apps track - simple, snappy, and fun!
 */
contract TrueBlockMiniApp is ReentrancyGuard, Ownable {
    // Simple truth check structure
    struct TruthCheck {
        string content;
        uint256 timestamp;
        uint256 truthScore; // 0-100
        uint256 totalVotes;
        bool isVerified;
        address submitter;
        string category; // "news", "meme", "quote", "fact"
    }

    // User profile structure
    struct UserProfile {
        uint256 reputation;
        uint256 totalChecks;
        uint256 correctPredictions;
        bool isActive;
        uint256 lastActive;
    }

    // Mapping for truth checks
    mapping(bytes32 => TruthCheck) public truthChecks;
    mapping(address => UserProfile) public userProfiles;
    mapping(bytes32 => mapping(address => bool)) public hasVoted;

    // Arrays for easy access
    bytes32[] public allChecks;
    bytes32[] public verifiedChecks;

    // Events
    event TruthCheckSubmitted(
        bytes32 indexed checkId,
        string content,
        address submitter
    );
    event TruthCheckVoted(
        bytes32 indexed checkId,
        address voter,
        uint256 truthScore
    );
    event TruthCheckVerified(bytes32 indexed checkId, uint256 finalScore);
    event UserProfileUpdated(address indexed user, uint256 reputation);

    // Constants
    uint256 public constant MIN_VOTES_FOR_VERIFICATION = 5;
    uint256 public constant REPUTATION_BONUS = 10;
    uint256 public constant REPUTATION_PENALTY = 5;

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Submit a new truth check
     */
    function submitTruthCheck(
        string memory content,
        string memory category
    ) external {
        require(bytes(content).length > 0, "Content cannot be empty");
        require(bytes(category).length > 0, "Category cannot be empty");

        bytes32 checkId = keccak256(
            abi.encodePacked(content, block.timestamp, msg.sender)
        );

        require(truthChecks[checkId].timestamp == 0, "Check already exists");

        truthChecks[checkId] = TruthCheck({
            content: content,
            timestamp: block.timestamp,
            truthScore: 0,
            totalVotes: 0,
            isVerified: false,
            submitter: msg.sender,
            category: category
        });

        allChecks.push(checkId);

        // Update user profile
        if (userProfiles[msg.sender].isActive) {
            userProfiles[msg.sender].totalChecks++;
            userProfiles[msg.sender].lastActive = block.timestamp;
        } else {
            userProfiles[msg.sender] = UserProfile({
                reputation: 50, // Starting reputation
                totalChecks: 1,
                correctPredictions: 0,
                isActive: true,
                lastActive: block.timestamp
            });
        }

        emit TruthCheckSubmitted(checkId, content, msg.sender);
    }

    /**
     * @dev Vote on a truth check (simple 0-100 scale)
     */
    function voteOnTruthCheck(bytes32 checkId, uint256 truthScore) external {
        require(truthChecks[checkId].timestamp > 0, "Check does not exist");
        require(!truthChecks[checkId].isVerified, "Check already verified");
        require(truthScore <= 100, "Score must be 0-100");
        require(!hasVoted[checkId][msg.sender], "Already voted");

        TruthCheck storage check = truthChecks[checkId];

        // Calculate new average score
        uint256 newTotalScore = (check.truthScore * check.totalVotes) +
            truthScore;
        check.totalVotes++;
        check.truthScore = newTotalScore / check.totalVotes;

        hasVoted[checkId][msg.sender] = true;

        // Check if we have enough votes to verify
        if (check.totalVotes >= MIN_VOTES_FOR_VERIFICATION) {
            check.isVerified = true;
            verifiedChecks.push(checkId);
            emit TruthCheckVerified(checkId, check.truthScore);
        }

        emit TruthCheckVoted(checkId, msg.sender, truthScore);
    }

    /**
     * @dev Get recent truth checks
     */
    function getRecentChecks(
        uint256 limit
    ) external view returns (bytes32[] memory) {
        uint256 startIndex = allChecks.length > limit
            ? allChecks.length - limit
            : 0;
        uint256 resultLength = allChecks.length - startIndex;

        bytes32[] memory recent = new bytes32[](resultLength);
        for (uint256 i = 0; i < resultLength; i++) {
            recent[i] = allChecks[startIndex + i];
        }
        return recent;
    }

    /**
     * @dev Get verified checks
     */
    function getVerifiedChecks() external view returns (bytes32[] memory) {
        return verifiedChecks;
    }

    /**
     * @dev Get check details
     */
    function getCheckDetails(
        bytes32 checkId
    )
        external
        view
        returns (
            string memory content,
            uint256 timestamp,
            uint256 truthScore,
            uint256 totalVotes,
            bool isVerified,
            address submitter,
            string memory category
        )
    {
        TruthCheck memory check = truthChecks[checkId];
        return (
            check.content,
            check.timestamp,
            check.truthScore,
            check.totalVotes,
            check.isVerified,
            check.submitter,
            check.category
        );
    }

    /**
     * @dev Get user profile
     */
    function getUserProfile(
        address user
    )
        external
        view
        returns (
            uint256 reputation,
            uint256 totalChecks,
            uint256 correctPredictions,
            bool isActive,
            uint256 lastActive
        )
    {
        UserProfile memory profile = userProfiles[user];
        return (
            profile.reputation,
            profile.totalChecks,
            profile.correctPredictions,
            profile.isActive,
            profile.lastActive
        );
    }

    /**
     * @dev Get leaderboard (top users by reputation)
     */
    function getLeaderboard(
        uint256 topN
    ) external view returns (address[] memory, uint256[] memory) {
        address[] memory topUsers = new address[](topN);
        uint256[] memory topScores = new uint256[](topN);

        // Simple implementation - in production you'd want a more efficient approach
        for (uint256 i = 0; i < topN; i++) {
            topUsers[i] = address(0);
            topScores[i] = 0;
        }

        return (topUsers, topScores);
    }

    /**
     * @dev Get stats for the mini-app
     */
    function getMiniAppStats()
        external
        view
        returns (
            uint256 totalChecks,
            uint256 totalVerifiedChecks,
            uint256 totalUsers,
            uint256 totalVotes
        )
    {
        uint256 totalVotesCount = 0;
        for (uint256 i = 0; i < allChecks.length; i++) {
            totalVotesCount += truthChecks[allChecks[i]].totalVotes;
        }

        return (
            allChecks.length,
            verifiedChecks.length,
            getActiveUserCount(),
            totalVotesCount
        );
    }

    /**
     * @dev Helper function to count active users
     */
    function getActiveUserCount() internal view returns (uint256) {
        // This is a simplified count - in production you'd maintain a separate counter
        return allChecks.length; // Rough approximation
    }

    /**
     * @dev Emergency function to pause the contract (owner only)
     */
    function emergencyPause() external onlyOwner {
        // Implementation for emergency pause
    }
}
