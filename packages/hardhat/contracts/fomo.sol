// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import '@layerzerolabs/lz-evm-oapp-v2/contracts/oft/OFT.sol';
import {Ownable} from '@openzeppelin/contracts/access/Ownable.sol';

contract FOMOToken is OFT {
    constructor(
        address _layerZeroEndpoint, // local endpoint address
        address _owner, // token owner used as a delegate in LayerZero Endpoint
        uint256 initialSupply // initial supply of the token
    ) OFT('FomoBullClub', 'FOMO', _layerZeroEndpoint, _owner) Ownable() {
        _mint(msg.sender, initialSupply); // mints tokens to the deployer
    }
}
