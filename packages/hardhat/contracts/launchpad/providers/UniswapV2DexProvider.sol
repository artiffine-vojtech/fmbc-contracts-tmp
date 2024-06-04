// SPDX-License-Identifier: MIT

pragma solidity 0.8.23;

import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol';
import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol';
import '@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import '../interfaces/IDexProvider.sol';

/**
 * @title UniswapV2DexProvider
 * @notice Contract that provides operations on UniswapV2 LPs
 */
contract UniswapV2DexProvider is IDexProvider {
    using SafeERC20 for IERC20;

    address public immutable FACTORY;
    address public immutable ROUTER;

    constructor(address _router, address _factory) {
        ROUTER = _router;
        FACTORY = _factory;
    }

    /**
     * @inheritdoc IDexProvider
     */
    function createLP(
        address _tokenA,
        address _tokenB,
        uint256 _amountA,
        uint256 _amountB
    ) external override returns (address pool) {
        // Approve necessary tokens
        IERC20(_tokenA).safeApprove(ROUTER, _amountA);
        IERC20(_tokenB).safeApprove(ROUTER, _amountB);
        // Create USDC-MEME LP
        IUniswapV2Router02(ROUTER).addLiquidity(_tokenA, _tokenB, _amountA, _amountB, 1, 1, msg.sender, block.timestamp);
        // Transfer LP tokens to dead address
        return IUniswapV2Factory(FACTORY).getPair(_tokenA, _tokenB);
    }

    /**
     * @inheritdoc IDexProvider
     */
    function getPoolBalance(address _pair, address _token) external view override returns (uint256) {
        return IERC20(_token).balanceOf(_pair);
    }

    /**
     * @inheritdoc IDexProvider
     */
    function breakLP(address _pair) external override returns (uint256, uint256) {
        // Remove liquidity
        uint256 lpAmount = IERC20(_pair).balanceOf(address(this));
        IERC20(_pair).safeApprove(ROUTER, lpAmount);
        (uint256 amountA, uint256 amountB) = IUniswapV2Router02(ROUTER).removeLiquidity(
            IUniswapV2Pair(_pair).token0(),
            IUniswapV2Pair(_pair).token1(),
            lpAmount,
            1,
            1,
            address(this),
            block.timestamp
        );
        // Transfer tokens to msg.sender
        IERC20(IUniswapV2Pair(_pair).token0()).safeTransfer(msg.sender, amountA);
        IERC20(IUniswapV2Pair(_pair).token1()).safeTransfer(msg.sender, amountB);
        return (amountA, amountB);
    }
}
