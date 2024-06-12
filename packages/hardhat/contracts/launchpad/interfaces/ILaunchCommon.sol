// SPDX-License-Identifier: MIT

pragma solidity 0.8.23;

/// @title ILaunchCommon
/// @notice Launchpad related structs, enum, errors and events.
interface ILaunchCommon {
    enum LaunchStatus {
        PENDING,
        SOFT_CAP_REACHED,
        HARD_CAP_REACHED,
        FAILED,
        LAUNCHED
    }

    struct User {
        uint256 minPledge;
        uint256 maxPledge;
    }

    struct Pledge {
        // Amount of LP tokens pledged
        uint256 lp;
        // Amount of value pledged in USDC
        uint256 usdc;
        // If user has claimed the pledge
        bool claimed;
    }

    struct LaunchConfigVars {
        // Token name
        string name;
        // Token symbol
        string symbol;
        // Token total supply (in Ether, not in wei)
        uint256 totalSupply;
        // Token hard cap in DOLLAR value (1000 = 1000 USDC)
        uint256 hardCap;
        // Token team address
        address team;
        // Additional address to send some MEME allocation to (if set)
        address x;
        /**
         * [0] - Token Team
         * [1] - KOL
         * [2] - Rewards
         * [3] - Liquidity
         * [4] - Sale
         * [5] - x
         */
        uint256[6] allocations;
        /**
         * [0] - USDC/MEME
         * [1] - FOMO/MEME
         * [2] - MEME
         * [3] - STEAK (USDC/FOMO)
         * [4] - FOMO
         */
        uint256[5] rewardsAllocations;
        /**
         * [0] - KOL Round length
         * [1] - NFT Round length
         * [2] - User Round length
         */
        uint256[3] rounds;
        // Dex provider index to use for LP creation
        uint256 dexIndex;
        // steak LP fee for the token team
        uint256 steakTeamFee;
    }

    struct LaunchConfig {
        // Token name
        string name;
        // Token symbol
        string symbol;
        // Dex provider for LP creation
        address dexProvider;
        // Token team address
        address team;
        // Additional address to send some MEME allocation to (if set)
        address x;
        /**
         * [0] - Token Team
         * [1] - KOL
         * [2] - Rewards
         * [3] - Liquidity
         * [4] - Sale
         * [5] - x
         * [6] - Platform
         */
        uint256[7] allocations;
        /**
         * [0] - USDC/MEME
         * [1] - FOMO/MEME
         * [2] - MEME
         * [3] - STEAK (USDC/FOMO)
         * [4] - FOMO
         */
        uint256[5] rewardsAllocations;
        /**
         * [0] - KOL Round length
         * [1] - NFT Round length
         * [2] - User Round length
         * [3] - totalSupply
         * [4] - softCap
         * [5] - hardCap
         * [6] - minPledge
         * [7] - maxPledge
         * [8] - startTime
         * [9] - raisedLP
         * [10] - raisedLPKOL
         * [11] - SteakTeamFee
         * [12] - SteakPlatformFee
         * [13] - minPledgeKOL
         * [14] - maxPledgeKOL
         */
        uint256[15] values;
        // Launch status
        LaunchStatus status;
    }

    /**
     * @notice Structure with all token-related addresses.
     */
    struct TokenAddressess {
        // Amount of USDC raised after breaking LP
        uint256 usdc;
        // Amount of FOMO raised after breaking LP
        uint256 fomo;
        // Address of the launched MEME token
        address token;
        // Address of the launched MEME-FOMO LP pair
        address fomoLP;
        // Address of the launched MEME-USDC LP pair
        address usdcLP;
        // Address of the MEME incetive controller
        address tokenIC;
        // Address of the MEME incetive controller proxy for deposit/withdraw
        address tokenICProxy;
        // Address of the MEME-FOMO LP incetive controller
        address fomoLPIC;
        // Address of the MEME-USDC LP incetive controller
        address usdcLPIC;
        // Addres of the MEME vesting contract
        address vesting;
    }

    error InvalidAllocations();
    error InvalidRewardsAllocations();
    error InvalidRounds();
    error VerificationFailed();
    error LaunchIsNotPending();
    error LaunchIsNotFailed();
    error LaunchIsNotLaunched();
    error LaunchFailed();
    error AlreadyLaunched();
    error AlreadyClaimed();
    error ArraysLengthMismatch();
    error UserIsKOL();
    error UserIsNotKOL();
    error UserSaleNotStarted();
    error PledgeLimitReached();
    error MinPledgeNotReached();
    error UserNotNFTOwner();
    error InvalidTotalSupply();
    error InvalidHardCap();
    error InvalidSteakTeamFee();
    error XIsAddressZero();
    error TeamIsAddressZero();
    error LiquidityAllocationIsZero();

    event LaunchCreated(string indexed name, string indexed symbol, uint256 indexed launchId);
    event HardCapReached(uint256 indexed launchId);
    event Pledged(uint256 indexed launchId, address indexed user, uint256 amountLP, uint256 amountUsdc);
    event PledgedWithNFT(
        uint256 indexed launchId,
        address indexed user,
        uint256 amountLP,
        uint256 amountUsdc,
        uint256 indexed nftId
    );
}
