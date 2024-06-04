// SPDX-License-Identifier: MIT

pragma solidity 0.8.23;

interface IControllerFactory {
    /**
     *
     * @param _token Token address (reward and pair token)
     * @param _usdcLP Address of the TOKEN-USDC LP token
     * @param _fomoLP Address of the TOKEN-FOMO LP token
     * @param _memberNFT Address of the Fomo Bull Club Member NFT
     * @param _admin Address of the admin to transfer controllers ownership to
     * @param _owner Address of the owner to transfer vesting ownership to
     */
    function createNewTokenControllers(
        address _token,
        address _usdcLP,
        address _fomoLP,
        address _memberNFT,
        address _admin,
        address _owner
    ) external returns (address[5] memory controllers);
}
