// SPDX-License-Identifier: MIT

pragma solidity 0.8.23;

/**
 * @title DexProvider interface
 * @notice Contract that provides operations on specific DEX LPs
 */
interface IDexProvider {
    /**
     * @notice Create a new LP
     * @notice First send the tokens to the contract
     * @param _tokenA Token A address
     * @param _tokenB Token B address
     * @param _amountA Amount of Token A
     * @param _amountB Amount of Token B
     */
    function createLP(address _tokenA, address _tokenB, uint256 _amountA, uint256 _amountB) external returns (address);

    /**
     * @notice Break LP into underlying tokens
     * @notice First send the LP tokens to the contract
     * @param _pair LP pair address
     * @return Amounts of Token A and Token B send back to msg.sender
     */
    function breakLP(address _pair) external returns (uint256, uint256);

    /**
     * @notice Get the balance of a token in a pool
     * @param _pair LP pair address
     * @param _token Token address
     * @return Balance of the token in the pool
     */
    function getPoolBalance(address _pair, address _token) external view returns (uint256);
}
