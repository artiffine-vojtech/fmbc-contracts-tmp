// SPDX-License-Identifier: MIT

pragma solidity ^0.8.22;

/// @title IFomoProxy
/// @notice Interface for FOMO single-staking proxy.
interface ITokenProxy {
    function deposit(uint _amount, address _onBehalfOf) external;

    function withdraw(uint _amount) external;
}
