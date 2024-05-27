// SPDX-License-Identifier: MIT

pragma solidity 0.8.23;

import '@openzeppelin/contracts/token/ERC721/IERC721.sol';

interface INFTChecker {
    /**
     * @notice Returns level of the specified token.
     * @param _identity Token id.
     * @return _nftId Level of the token.
     */
    function isNftStaked(address _identity, uint256 _nftId) external view returns (bool);

    error ArgumentIsIndexOutOfBound();
    error ArgumentIsAddressZero();
}
