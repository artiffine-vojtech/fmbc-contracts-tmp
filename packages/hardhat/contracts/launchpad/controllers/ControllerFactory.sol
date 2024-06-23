// SPDX-License-Identifier: MIT

pragma solidity 0.8.23;

import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import '@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol';
import './TokenEmissionsController.sol';
import './TokenProxy.sol';
import '../interfaces/IControllerFactory.sol';
import '../MEMEVesting.sol';

/**
 * @title ControllerFactory
 * @notice Conrtact that creates emissiosn controllers and vesting contracts
 */
contract ControllerFactory is IControllerFactory {
    using SafeERC20 for IERC20;

    address constant DEAD = 0x000000000000000000000000000000000000dEaD;

    /**
     *
     * @inheritdoc IControllerFactory
     */
    function createNewTokenControllers(
        address _token,
        address _usdcLP,
        address _fomoLP,
        address _memberNFT,
        address _admin,
        address _owner
    ) external returns (address[5] memory controllers) {
        TokenEmissionsController usdcLPController = new TokenEmissionsController(
            IERC20(_usdcLP),
            INFTWithLevel(_memberNFT),
            _token,
            DEAD
        );

        TokenEmissionsController fomoLPController = new TokenEmissionsController(
            IERC20(_fomoLP),
            INFTWithLevel(_memberNFT),
            _token,
            DEAD
        );

        TokenProxy tokenProxy = new TokenProxy(
            string.concat('staked', IERC20Metadata(_token).name()),
            string.concat('s', IERC20Metadata(_token).symbol()),
            _token
        );

        TokenEmissionsController tokenProxyController = new TokenEmissionsController(
            IERC20(address(tokenProxy)),
            INFTWithLevel(_memberNFT),
            _token,
            address(tokenProxy)
        );

        MEMEVesting vesting = new MEMEVesting(block.timestamp, IERC20(_token));
        vesting.transferOwnership(_owner);

        tokenProxy.setController(address(tokenProxyController));
        tokenProxyController.transferOwnership(_admin);
        fomoLPController.transferOwnership(_admin);
        usdcLPController.transferOwnership(_admin);

        controllers[0] = address(usdcLPController);
        controllers[1] = address(fomoLPController);
        controllers[2] = address(tokenProxyController);
        controllers[3] = address(tokenProxy);
        controllers[4] = address(vesting);
    }
}
