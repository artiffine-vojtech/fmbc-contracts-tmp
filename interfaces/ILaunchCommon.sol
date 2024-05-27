// SPDX-License-Identifier: MIT

pragma solidity 0.8.23;

/// @title ILaunchpad
/// @notice Interface for meme-token launchpad.
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
        uint256 lp;
        uint256 usdc;
        bool claimed;
    }

    enum TotalSupply {
        B1,
        B10,
        B100
    }

    enum HardCap {
        K250,
        K500,
        M1
    }

    struct LaunchConfigVars {
        string name;
        string symbol;
        TotalSupply totalSupply;
        HardCap hardCap;
        address team;
        address x;
        /**
         * [0] - Token Team
         * [1] - KOL
         * [2] - Rewards
         * [3] - Liquidity
         * [4] - Sale
         * [5] - Platform
         * [6] - Other
         */
        uint256[7] allocations;
        uint256[3] rounds;
    }

    struct LaunchConfig {
        string name;
        string symbol;
        uint256 totalSupply;
        uint256 hardCap;
        address team;
        address x;
        uint256 startTime;
        uint256 raisedLP;
        uint256 raisedLPKOL;
        /**
         * [0] - Token Team
         * [1] - KOL
         * [2] - Rewards
         * [3] - Liquidity
         * [4] - Sale
         * [5] - Platform
         * [6] - Other
         */
        uint256[7] allocations;
        uint256[3] rounds;
        LaunchStatus status;
    }

    struct Allocation {
        uint256 usdc;
        uint256 fomo;
        address token;
        address fomoLP;
        address usdcLP;
        address tokenIC;
        address tokenICProxy;
        address fomoLPIC;
        address usdcLPIC;
        address vesting;
    }

    error InvalidAllocations();
    error InalidRounds();
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

    // function createLaunch(LaunchConfigVars memory _config, bool _staked, bytes calldata _data) external;

    // function pledge(uint256 _launchId, uint256 _amount, bool _staked, bytes calldata _data) external;

    // function pledgeWithNFT(uint256 _launchId, uint256 _amount, bool _staked, uint256 _nftId, bytes calldata data) external;

    // function getFundsBack(uint256 _launchId, bool _stake) external;

    // function launch(uint256 _launchId) external;

    // function claimTokens(uint256 _launchId) external;

    // function setKolAddresses(address[] memory _kolAddresses, bool[] memory _isKol) external;
}
