// SPDX-License-Identifier: MIT

pragma solidity 0.8.23;

/// @title IIncentivesController
/// @notice Interface for staking contract with multiple token rewards.
interface ITokenIncentivesController {
    struct Reward {
        // Timestamp of the end of current rewards distribution.
        uint periodFinish;
        // Rewards distributed per second.
        uint rewardRate;
        // Timestamp of last update.
        uint lastUpdateTime;
        // Current snapshot of reward tokens per staked token.
        uint rewardPerTokenStored;
        // Current accounted for balance of reward tokens.
        uint balance;
    }

    struct Balances {
        // Staked tokens of the user.
        uint staked;
        // Staked tokens muplitplied by NFT multiplier.
        uint scaled;
        // Staked NFT token id.
        uint nftId;
        // If position is boosted.
        bool boosted;
    }

    struct RewardData {
        // Address of the reward token.
        address token;
        // Amount of the reward token.
        uint amount;
    }

    /**
     * Deposited event.
     * @param user Address of the user.
     * @param amount Amount of tokens deposited.
     * @param scaled Scaled amount of tokens withdrawn (NFT multiplier).
     */
    event Deposited(address indexed user, uint amount, uint scaled);

    /**
     * Withdrawn event.
     * @param user Address of the user.
     * @param amount Amount of tokens withdrawn.
     * @param scaled Scaled amount of tokens withdrawn (NFT multiplier).
     */
    event Withdrawn(address indexed user, uint amount, uint scaled);

    /**
     * RewardPaid event.
     * @param user Address of the user.
     * @param rewardsToken Address of the reward token.
     * @param reward Amount of the reward paid.
     */
    event RewardPaid(address indexed user, address indexed rewardsToken, uint reward);

    /**
     * Deposit staking tokens.
     * @param _amount Amount of staking token to deposit.
     * @param _onBehalfOf Receiver of the staked tokens.
     */
    function deposit(uint _amount, address _onBehalfOf) external;

    /**
     * Withdraw staking tokens while claiming rewards.
     * @param _amount Amount of staking token to withdraw.
     */
    function withdraw(uint _amount, address _onBehalfOf) external;

    /**
     * Get rewards accumulated for deposited tokens.
     * @param _rewardTokens Array of reward tokens to get reward for.
     */
    function getReward(address[] calldata _rewardTokens) external;

    /**
     * Get user claimable rewards.
     * @param _account Address of the user.
     * @return claimable Array of rewards claimable by the user.
     */
    function claimableRewards(address _account) external view returns (RewardData[] memory claimable);

    /**
     * Stake NFT to boost deposited staking tokens.
     * @param _tokenId NFT token if to stake.
     */
    function stakeNFT(uint _tokenId) external;

    /**
     * Unstake NFT loosing the boost.
     */
    function unstakeNFT() external;

    function notifyReward(address[] memory _rewardTokens, uint[] memory _amounts) external;

    /**
     * Register token as a reward.
     * @param _rewardToken Address of the reward token.
     */
    function addReward(address _rewardToken) external;
}
