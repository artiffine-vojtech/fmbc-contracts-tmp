// SPDX-License-Identifier: MIT

pragma solidity 0.8.23;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

interface IWeightedPool {
    function getPoolId() external view returns (bytes32);
}
