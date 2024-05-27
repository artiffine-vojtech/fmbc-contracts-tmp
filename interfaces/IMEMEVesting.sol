// SPDX-License-Identifier: MIT

pragma solidity ^0.8.22;

interface IMEMEVesting {
    /**
     * @notice Vesting position.
     * @param amount Amount of tokens vested.
     * @param amountClaimed Amount of tokens claimed.
     * @param startTimestamp Vesting start timestamp.
     */
    struct VestingPosition {
        uint256 amount;
        uint256 amountClaimed;
        uint256 startTimestamp;
        bool cancelled;
    }

    /**
     * @notice Vest tokens.
     * @param _amount Amount of tokens to vest.
     * @param _to Address to vest tokens to.
     */
    function vestTokens(uint256 _amount, address _to) external;

    /**
     * @notice Claim tokens.
     * @param _positionIndexes Array of position indexes to claim tokens from.
     */
    function claimTokens(uint256[] calldata _positionIndexes) external;

    /**
     * @notice Get amount of tokens available to claim at given timestamp.
     * @param _account Address to check.
     * @param _positionIndex Position index to check.
     * @param _timestamp Timestamp to check.
     * @return Amount of tokens available to claim.
     */
    function availableToClaim(address _account, uint256 _positionIndex, uint256 _timestamp) external view returns (uint256);

    /**
     * @notice Get vesting positions for the given address.
     * @param _account Address to get vesting positions for.
     * @return Array of vesting positions.
     */
    function getVestingPositions(address _account) external view returns (VestingPosition[] memory);

    function cancelVesting(address _account) external;

    /**
     * @notice Get vesting schedule for the given address and position index.
     * @param _account Address to get vesting schedule for.
     * @param _positionIndex Position index to get vesting schedule for.
     * @return timestamps Array of timestamps of token unlock times.
     * @return amounts Array of amounts at token unlocks.
     */
    function getVestingSchedule(
        address _account,
        uint256 _positionIndex
    ) external view returns (uint256[7] memory timestamps, uint256[7] memory amounts);

    error WrongTokenIdOwner();
    error AmountTooSmall();
    error AmountExceedsAllocation();
    error IncorrectEtherValueSent();
    error ArgumentIsZero();
    error ArgumentIsAddressZero();
    error TgeTimestampInPast();
    error TokensNotUnlocked();

    event TokensVested(address indexed _buyer, uint256 indexed positionIndex, uint256 indexed amount_);
    event TokensClaimed(address indexed _buyer, uint256 indexed positionIndex, uint256 indexed amount_);
}
