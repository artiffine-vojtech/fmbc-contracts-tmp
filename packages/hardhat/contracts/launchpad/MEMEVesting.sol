// SPDX-License-Identifier: MIT

pragma solidity 0.8.23;

import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import './interfaces/IMEMEVesting.sol';

/**
 * @title MEMEVesting
 * @notice Contract to create vesting streams for tokens with monthly unlocks.
 */
contract MEMEVesting is IMEMEVesting, Ownable {
    using SafeERC20 for IERC20;

    /// @notice Mapping of account to vesting positions.
    mapping(address => VestingPosition[]) public vestingPositions;

    /// @notice Token Generation Event timestamp.
    uint256 public immutable tgeTimestamp;

    /// @notice FMBC token.
    IERC20 public immutable memeToken;

    /// @dev Percent of tokens unlocked at TGE.
    uint256 constant UNLOCKED_AT_TGE = 0;
    /// @dev Percent of tokens unlocked monthly.
    uint256 constant UNLOCKED_MONTHLY = 1666;
    /// @dev Precision for percentage calculations.
    uint256 constant PRECISION = 10000;
    /// @dev Number of monthly unlocks.
    uint256 constant NO_MONTHLY_UNLOCKS = 6;

    /**
     * @notice Constructor.
     * @param _tgeTimestamp Token Generation Event timestamp.
     * @param _memeTokenAddress FMBC token address.
     */
    constructor(uint256 _tgeTimestamp, IERC20 _memeTokenAddress) {
        if (_tgeTimestamp < block.timestamp) revert TgeTimestampInPast();
        if (address(_memeTokenAddress) == address(0)) revert ArgumentIsAddressZero();

        memeToken = _memeTokenAddress;
        tgeTimestamp = _tgeTimestamp;
    }

    /**
     * @inheritdoc IMEMEVesting
     */
    function vestTokens(uint256 _amount, address _to) external {
        if (_amount == 0) revert ArgumentIsZero();

        memeToken.safeTransferFrom(msg.sender, address(this), _amount);
        uint256 positionIndex = vestingPositions[_to].length;

        if (positionIndex == 1 && block.timestamp < tgeTimestamp) {
            // Update vesting position
            VestingPosition storage vestingPosition = vestingPositions[_to][0];
            vestingPosition.amount += _amount;
            positionIndex = 0;
        } else {
            // Add new vesting position
            uint256 startTimestamp = tgeTimestamp;
            uint256 unlockedAmount = 0;
            if (block.timestamp >= tgeTimestamp) {
                startTimestamp = block.timestamp;
                unlockedAmount = (_amount * UNLOCKED_AT_TGE) / PRECISION;
                memeToken.safeTransfer(_to, unlockedAmount);
                emit TokensClaimed(_to, positionIndex, unlockedAmount);
            }
            vestingPositions[_to].push(VestingPosition(_amount, unlockedAmount, startTimestamp, false));
        }
        emit TokensVested(_to, positionIndex, _amount);
    }

    /**
     * @inheritdoc IMEMEVesting
     */
    function claimTokens(uint256[] calldata _positionIndexes) external {
        uint256 length = _positionIndexes.length;
        for (uint256 i = 0; i < length; i++) {
            if (block.timestamp < tgeTimestamp) revert TokensNotUnlocked();
            VestingPosition storage vestingPosition = vestingPositions[msg.sender][_positionIndexes[i]];
            if (vestingPosition.cancelled) continue;
            uint256 amountToClaim = availableToClaim(msg.sender, _positionIndexes[i], block.timestamp);
            vestingPosition.amountClaimed += amountToClaim;
            memeToken.safeTransfer(msg.sender, amountToClaim);
            emit TokensClaimed(msg.sender, _positionIndexes[i], amountToClaim);
        }
    }

    /**
     * @inheritdoc IMEMEVesting
     */
    function availableToClaim(address _account, uint256 _positionIndex, uint256 _timestamp) public view returns (uint256) {
        if (_timestamp < tgeTimestamp) return 0;
        VestingPosition storage vestingPosition = vestingPositions[_account][_positionIndex];
        if (vestingPosition.cancelled) return 0;
        uint256 timeSinceStart = _timestamp - vestingPosition.startTimestamp;
        uint256 numberOfUnlocks = timeSinceStart / 30 days;
        uint256 amountUnlocked = (vestingPosition.amount * (UNLOCKED_AT_TGE + (numberOfUnlocks * UNLOCKED_MONTHLY))) / PRECISION;
        if (amountUnlocked > vestingPosition.amount) amountUnlocked = vestingPosition.amount;
        uint256 amountToClaim = amountUnlocked - vestingPosition.amountClaimed;
        return amountToClaim;
    }

    /**
     * @inheritdoc IMEMEVesting
     */
    function getVestingPositions(address _account) external view returns (VestingPosition[] memory) {
        return vestingPositions[_account];
    }

    /**
     * @inheritdoc IMEMEVesting
     */
    function getVestingSchedule(
        address _account,
        uint256 _positionIndex
    ) external view returns (uint256[NO_MONTHLY_UNLOCKS + 1] memory timestamps, uint256[NO_MONTHLY_UNLOCKS + 1] memory amounts) {
        VestingPosition storage vestingPosition = vestingPositions[_account][_positionIndex];
        uint256 amountUnlocked = 0;
        timestamps[0] = vestingPosition.startTimestamp;
        amounts[0] = (vestingPosition.amount * UNLOCKED_AT_TGE) / PRECISION;
        for (uint256 i = 1; i < NO_MONTHLY_UNLOCKS + 1; ) {
            amountUnlocked += amounts[i - 1];
            timestamps[i] = timestamps[i - 1] + 30 days;
            uint256 tmp = ((vestingPosition.amount * (UNLOCKED_AT_TGE + (i * UNLOCKED_MONTHLY))) / PRECISION);
            amounts[i] = i == NO_MONTHLY_UNLOCKS ? vestingPosition.amount - amountUnlocked : tmp - amountUnlocked;
            unchecked {
                ++i;
            }
        }
    }

    /**
     * @inheritdoc IMEMEVesting
     */
    function cancelVesting(address _account) external onlyOwner {
        VestingPosition[] storage positions = vestingPositions[_account];
        for (uint256 i = 0; i < positions.length; i++) {
            if (positions[i].cancelled) continue;
            positions[i].cancelled = true;
            uint256 cancelledAmount = positions[i].amount - positions[i].amountClaimed;
            positions[i].amountClaimed = positions[i].amount;
            memeToken.safeTransfer(owner(), cancelledAmount);
        }
    }
}
