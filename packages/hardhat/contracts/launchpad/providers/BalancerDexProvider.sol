// SPDX-License-Identifier: MIT

pragma solidity 0.8.23;

import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import '../interfaces/IDexProvider.sol';
import '../interfaces/balancer/IBalancerFactory.sol';
import '../interfaces/balancer/IWeightedPool.sol';
import '../interfaces/balancer/IVault.sol';

/**
 * @title BalancerDexProvider
 * @notice Contract that provides operations on Balancer LPs
 */
contract BalancerDexProvider is IDexProvider {
    using SafeERC20 for IERC20;

    address public constant FACTORY = 0x4C32a8a8fDa4E24139B51b456B42290f51d6A1c4;
    address public constant VAULT = 0xBA12222222228d8Ba445958a75a0704d566BF2C8;

    address public lastPool;
    bytes32 public lastPoolId;

    /**
     * @inheritdoc IDexProvider
     */
    function createLP(
        address _tokenA,
        address _tokenB,
        uint256 _amountA,
        uint256 _amountB
    ) external override returns (address pool) {
        // Create balancer pool
        IERC20[] memory tokens = new IERC20[](2);
        tokens[0] = IERC20(_tokenA) < IERC20(_tokenB) ? IERC20(_tokenA) : IERC20(_tokenB);
        tokens[1] = IERC20(_tokenA) < IERC20(_tokenB) ? IERC20(_tokenB) : IERC20(_tokenA);

        address[] memory zeroes = new address[](2);
        zeroes[0] = address(0);
        zeroes[1] = address(0);

        uint256[] memory weights = new uint256[](2);
        weights[0] = 5e17;
        weights[1] = 5e17;

        pool = IBalancerFactory(FACTORY).create(
            'MEME LPasf',
            'MEME-LPasf',
            tokens,
            weights,
            zeroes,
            3e15,
            address(this),
            bytes32(0)
        );

        // Create userData
        weights[0] = tokens[0] == IERC20(_tokenB) ? _amountB : _amountA;
        weights[1] = tokens[1] == IERC20(_tokenB) ? _amountB : _amountA;
        bytes memory userData = abi.encode(0, weights);

        IERC20(_tokenA).safeApprove(VAULT, _amountA);
        IERC20(_tokenB).safeApprove(VAULT, _amountB);
        IVault.JoinPoolRequest memory request = IVault.JoinPoolRequest({
            assets: _convertERC20sToAssets(tokens),
            maxAmountsIn: weights,
            userData: userData,
            fromInternalBalance: false
        });
        lastPoolId = IWeightedPool(pool).getPoolId();
        IVault(VAULT).joinPool(lastPoolId, address(this), msg.sender, request);
        lastPool = pool;
    }

    /**
     * @inheritdoc IDexProvider
     */
    function breakLP(address _pair) external returns (uint256, uint256) {
        (IERC20[] memory tokens, , ) = IVault(VAULT).getPoolTokens(IWeightedPool(_pair).getPoolId());
        bytes memory userData = abi.encode(1, IERC20(_pair).balanceOf(address(this)));
        IVault.ExitPoolRequest memory request = IVault.ExitPoolRequest({
            assets: _convertERC20sToAssets(tokens),
            minAmountsOut: new uint256[](2),
            userData: userData,
            toInternalBalance: false
        });
        IVault(VAULT).exitPool(IWeightedPool(_pair).getPoolId(), address(this), payable(address(this)), request);
        uint256 usdcBalance = IERC20(tokens[0]).balanceOf(address(this));
        uint256 fomoBalance = IERC20(tokens[1]).balanceOf(address(this));
        tokens[0].safeTransfer(msg.sender, usdcBalance);
        tokens[1].safeTransfer(msg.sender, fomoBalance);
        return (usdcBalance, fomoBalance);
    }

    /**
     * @inheritdoc IDexProvider
     */
    function getPoolBalance(address _pair, address _token) external view returns (uint256) {
        (IERC20[] memory tokens, uint256[] memory balances, ) = IVault(VAULT).getPoolTokens(IWeightedPool(_pair).getPoolId());
        for (uint256 i = 0; i < tokens.length; i++) {
            if (address(tokens[i]) == _token) {
                return balances[i];
            }
        }
        return 0;
    }

    function _convertERC20sToAssets(IERC20[] memory tokens) internal pure returns (IAsset[] memory assets) {
        // solhint-disable-next-line no-inline-assembly
        assembly {
            assets := tokens
        }
    }
}
