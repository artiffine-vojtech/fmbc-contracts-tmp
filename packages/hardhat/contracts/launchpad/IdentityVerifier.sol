// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';
import './interfaces/IIdentityVerifier.sol';
import '../utils/Adminable.sol';

/**
 * @title IdentityVerifier
 * @notice Verifies the identity of a user
 */
contract IdentityVerifier is Adminable, IIdentityVerifier {
    using ECDSA for bytes32;

    address private _signer;

    constructor(address signer) {
        _signer = signer;
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual returns (bool) {
        return interfaceId == type(IIdentityVerifier).interfaceId;
    }

    function setSigner(address signer) public onlyAdmin {
        _signer = signer;
    }

    /**
     *
     * @inheritdoc IIdentityVerifier
     */
    function verify(address identity, bytes calldata data) external view override returns (bool) {
        (uint40 sigTimestamp, bytes32 message, bytes memory signature) = abi.decode(data, (uint40, bytes32, bytes));
        bytes32 expectedMessage = keccak256(abi.encodePacked('\x19Ethereum Signed Message:\n25', identity, sigTimestamp));
        if (message != expectedMessage) return false;
        if (message.recover(signature) != _signer) return false;
        if (uint256(sigTimestamp) < block.timestamp - 1 days) return false;
        return true;
    }
}
