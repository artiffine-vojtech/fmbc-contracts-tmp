// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import '@openzeppelin/contracts/utils/introspection/IERC165.sol';

interface IIdentityVerifier is IERC165 {
    /**
     *  @dev Verify that the buyer can purchase/bid
     *
     *  @param identity       The identity to verify
     *  @param data           Additional data needed to verify
     *
     */
    function verify(address identity, bytes calldata data) external returns (bool);
}
