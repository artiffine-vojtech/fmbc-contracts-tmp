// SPDX-License-Identifier: MIT

pragma solidity 0.8.23;

import '@openzeppelin/contracts/token/ERC721/IERC721.sol';

/**
 * @title INFTChecker
 * @notice Interface for NFT checker contract.
 */
interface INFTChecker {
    /**
     * @notice Returns level of the specified token.
     * @param _identity Token id.
     * @param _tokenId Token id.
     * @param _incentivesController Incentives controller address (or zero if none).
     * @return _nftId Level of the token
     */
    function isNftStaked(address _identity, uint256 _tokenId, address _incentivesController) external view returns (bool);

    /**
     * @notice Add an IncentivesController to the array
     * @param _controller The address of the IncentivesController to add
     */
    function addIncentivesController(address _controller) external;

    error ArgumentIsIndexOutOfBound();
    error ArgumentIsAddressZero();
}
