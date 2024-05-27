// SPDX-License-Identifier: MIT

pragma solidity 0.8.23;

import '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import './interfaces/INFTChecker.sol';
import './interfaces/IBalanceController.sol';

/**
 * @title NFT Holding or Staking Verifier for FOMO Bull Club Ecosystem
 */
contract NFTChecker is INFTChecker, Ownable {
    /// @dev ERC721 collection to verify against.
    IERC721 public immutable collection;
    /// @dev Array of Incentives controllers to check if the NFT is staked.
    IBalanceController[] public incentivesControllers;

    /**
     * @dev Constructor
     *
     * @param _collection     The ERC721 collection to verify against
     */
    constructor(address _collection) {
        collection = IERC721(_collection);
    }

    /* External Functions */

    /**
     * @dev Add an IncentivesController to the array
     *
     * @param _controller The address of the IncentivesController to add
     */
    function addIncentivesController(address _controller) external onlyOwner {
        if (_controller == address(0)) revert ArgumentIsAddressZero();
        incentivesControllers.push(IBalanceController(_controller));
    }

    /**
     * @dev Remove an IncentivesController from the array
     *
     * @param index The index of the IncentivesController to remove
     */
    function removeIncentivesController(uint index) external onlyOwner {
        if (index >= incentivesControllers.length) revert ArgumentIsIndexOutOfBound();
        incentivesControllers[index] = incentivesControllers[incentivesControllers.length - 1];
        incentivesControllers.pop();
    }

    /**
     * @dev Get the count of IncentivesControllers
     */
    function getIncentivesControllersCount() external view returns (uint256) {
        return incentivesControllers.length;
    }

    /**
     *  @dev Preview {verify} function result.
     *
     */
    function isNftStaked(address _identity, uint256 _tokenId) external view returns (bool) {
        return _verify(_identity, _tokenId);
    }

    /**
     * @dev Get the staked NFT ids for a user in all IncentivesControllers
     *
     * @param user The user to get the staked NFT ids for
     */
    function getStakedNFTIds(address user) public view returns (uint256[] memory) {
        uint256[] memory tempStakedIds = new uint256[](incentivesControllers.length);
        uint256 count = 0;

        for (uint256 i = 0; i < incentivesControllers.length; i++) {
            IBalanceController.Balances memory bal = incentivesControllers[i].balances(user);
            if (bal.boosted) {
                tempStakedIds[count++] = bal.nftId;
            }
        }

        uint256[] memory stakedIds = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            stakedIds[i] = tempStakedIds[i];
        }

        return stakedIds;
    }

    /* Internal Functions */

    /**
     * @dev Verify that the NFT buyer is an owner of specific ERC721 {collection}
     * and can be used for this Request.
     *
     *  @param identity       The identity to verify.
     *  @param tokenId        The NFT to use to verify.
     */
    function _verify(address identity, uint256 tokenId) internal view returns (bool) {
        if (collection.ownerOf(tokenId) == identity) {
            return true;
        }
        return _isNftStaked(identity, tokenId);
    }

    /**
     * @dev Check if the NFT is staked in any of the IncentivesControllers
     *
     * @param identity        The identity to check
     * @param tokenId         The NFT to check
     */
    function _isNftStaked(address identity, uint256 tokenId) internal view returns (bool) {
        for (uint i = 0; i < incentivesControllers.length; i++) {
            IBalanceController.Balances memory bal = incentivesControllers[i].balances(identity);
            if (bal.boosted && bal.nftId == tokenId) {
                return true;
            }
        }
        return false;
    }
}
