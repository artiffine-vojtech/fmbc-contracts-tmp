// SPDX-License-Identifier: MIT

pragma solidity ^0.8.22;

/// @title ITokenProxy
/// @notice Proxy for FOMO single-staking proxy.
interface ITokenProxy {
    /**
     * @notice Deposit tokens to token controller via proxy
     * @param _amount Amount to deposit
     * @param _onBehalfOf Address to deposit on behalf of
     */
    function deposit(uint _amount, address _onBehalfOf) external;

    /**
     * @notice Withdraw tokens from the token controller via proxy
     * @param _amount Amount to withdraw
     */
    function withdraw(uint _amount) external;
}
