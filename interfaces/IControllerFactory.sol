// SPDX-License-Identifier: MIT

pragma solidity 0.8.23;

interface IControllerFactory {
    function createNewTokenControllers(
        address _token,
        address _usdcLP,
        address _fomoLP,
        address _memberNFT,
        address _admin,
        address _owner
    ) external returns (address[5] memory controllers);
}
