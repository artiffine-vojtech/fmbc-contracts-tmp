// SPDX-License-Identifier: MIT

pragma solidity 0.8.23;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol';
import '@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol';
import '../interfaces/IControllerFactory.sol';
import '../interfaces/IIdentityVerifier.sol';
import '../../interfaces/INFTWithLevel.sol';
import './../interfaces/ILaunchControl.sol';
import '../ERC20MEME.sol';

interface ITokenIncentivesController {
    struct EmissionPoint {
        uint256 duration;
        uint256 amount;
    }

    /**
     * Deposit staking tokens.
     * @param _amount Amount of staking token to deposit.
     * @param _onBehalfOf Receiver of the staked tokens.
     */
    function deposit(uint _amount, address _onBehalfOf) external;

    /**
     * Withdraw staking tokens while claiming rewards.
     * @param _amount Amount of staking token to withdraw.
     */
    function withdraw(uint _amount, address _onBehalfOf) external;

    function notifyReward(address[] memory _rewardTokens, uint[] memory _amounts) external;

    /**
     * Register token as a reward.
     * @param _rewardToken Address of the reward token.
     */
    function addReward(address _rewardToken) external;

    function startEmissions(EmissionPoint[] memory _emissions) external;
}

interface IVesting {
    function vestTokens(uint256 _amount, address _beneficiary) external;
}

/// @title Launchpad
/// @notice Meme-token launchpad.
library LaunchControl {
    using SafeERC20 for IERC20;

    uint256 private constant DEN = 1e4;

    struct AddressesA {
        address controllerFactory;
        address identityVerifier;
        address maverickIC;
        address univ2Factory;
        address univ2router;
        address memberNFT;
        address fomo;
        address usdc;
        address owner;
    }

    /***** EXTERNAL *****/

    function launch(
        ILaunchCommon.LaunchConfig storage _launchConfig,
        ILaunchCommon.Allocation storage _alloc,
        AddressesA memory _vars
    ) external {
        // Check launch criteria
        _launchConfig.status = ILaunchCommon.LaunchStatus.LAUNCHED;

        // Crate MEME token
        ERC20 meme = new ERC20MEME(_launchConfig.name, _launchConfig.symbol, _launchConfig.totalSupply);
        _alloc.token = address(meme);

        // Create LP and send it to dead address
        _createLP(meme, _alloc, _launchConfig.allocations[3], _vars);

        // Create IncentivesControllers and vesting contracts
        {
            address[5] memory controllers = IControllerFactory(_vars.controllerFactory).createNewTokenControllers(
                address(meme),
                _alloc.usdcLP,
                _alloc.fomoLP,
                address(_vars.memberNFT),
                address(this),
                _vars.owner
            );
            _alloc.usdcLPIC = controllers[0]; // usdcLPIC;
            _alloc.fomoLPIC = controllers[1]; // fomoLPIC;
            _alloc.tokenIC = controllers[2]; // tokenIC;
            _alloc.tokenICProxy = controllers[3]; // tokenProxy;
            _alloc.vesting = controllers[4]; // vesting;
        }

        // Start emissions in incentive controllers
        _startEmissions((meme.totalSupply() * _launchConfig.allocations[2]) / DEN, _alloc, meme);

        // Notify Maverick with 10% of rewards allocation
        address[] memory tokenArray = new address[](1);
        tokenArray[0] = address(meme);
        uint256[] memory rewardArray = new uint256[](1);
        rewardArray[0] = (meme.totalSupply() * _launchConfig.allocations[2]) / 1e5;
        IERC20(address(meme)).safeApprove(_vars.maverickIC, rewardArray[0]);
        ITokenIncentivesController(_vars.maverickIC).addReward(address(meme));
        ITokenIncentivesController(_vars.maverickIC).notifyReward(tokenArray, rewardArray);

        IERC20(address(meme)).safeApprove(_alloc.vesting, (meme.totalSupply() * _launchConfig.allocations[0]) / DEN);

        // vest MEME to the token team
        IVesting(_alloc.vesting).vestTokens((meme.totalSupply() * _launchConfig.allocations[0]) / DEN, _launchConfig.team);

        // Send % MEME to the protocol
        uint256 platformAllocationInMEME = (meme.totalSupply() * _launchConfig.allocations[5]) / DEN;
        IERC20(address(meme)).safeTransfer(_vars.owner, platformAllocationInMEME);

        // Send X% MEME to the "other" if set
        if (_launchConfig.allocations[6] > 0) {
            IERC20(address(meme)).safeTransfer(_launchConfig.x, (meme.totalSupply() * _launchConfig.allocations[6]) / DEN);
        }
    }

    /***** INTERNAL *****/

    function _createLP(
        IERC20 _meme,
        ILaunchCommon.Allocation storage _alloc,
        uint256 _liquidityAlloc,
        AddressesA memory _vars
    ) internal {
        uint256 liquidityAlloc = (_meme.totalSupply() * _liquidityAlloc) / DEN;
        // Approve necessary tokens
        IERC20(_vars.usdc).safeApprove(_vars.univ2router, _alloc.usdc);
        IERC20(_vars.fomo).safeApprove(_vars.univ2router, _alloc.fomo);
        _meme.safeApprove(_vars.univ2router, liquidityAlloc);
        // Create USDC-MEME LP
        IUniswapV2Router02(_vars.univ2router).addLiquidity(
            address(_vars.usdc),
            address(_meme),
            _alloc.usdc,
            liquidityAlloc / 2,
            1,
            1,
            address(this),
            block.timestamp
        );
        // Create FOMO-MEME LP
        IUniswapV2Router02(_vars.univ2router).addLiquidity(
            _vars.fomo,
            address(_meme),
            _alloc.fomo,
            liquidityAlloc / 2,
            1,
            1,
            address(this),
            block.timestamp
        );
        // Transfer LP tokens to dead address
        _alloc.usdcLP = IUniswapV2Factory(_vars.univ2Factory).getPair(address(_vars.usdc), address(_meme));
        _alloc.fomoLP = IUniswapV2Factory(_vars.univ2Factory).getPair(_vars.fomo, address(_meme));
        IERC20(_alloc.usdcLP).safeTransfer(
            0x000000000000000000000000000000000000dEaD,
            IERC20(_alloc.usdcLP).balanceOf(address(this))
        );
        IERC20(_alloc.fomoLP).safeTransfer(
            0x000000000000000000000000000000000000dEaD,
            IERC20(_alloc.fomoLP).balanceOf(address(this))
        );
    }

    function _startEmissions(uint256 _rewardsAmount, ILaunchCommon.Allocation storage _alloc, IERC20 _meme) internal {
        ITokenIncentivesController.EmissionPoint[] memory emissionPoints = new ITokenIncentivesController.EmissionPoint[](4);
        emissionPoints[0] = ITokenIncentivesController.EmissionPoint(45 days, (_rewardsAmount * 2) / 10);
        emissionPoints[1] = ITokenIncentivesController.EmissionPoint(45 days, _rewardsAmount / 10);
        emissionPoints[2] = ITokenIncentivesController.EmissionPoint(45 days, (_rewardsAmount * 5) / 100);
        emissionPoints[3] = emissionPoints[2];
        _meme.safeApprove(_alloc.fomoLPIC, (_rewardsAmount * 4) / 10);
        ITokenIncentivesController(_alloc.fomoLPIC).startEmissions(emissionPoints);
        _meme.safeApprove(_alloc.usdcLPIC, (_rewardsAmount * 4) / 10);
        ITokenIncentivesController(_alloc.usdcLPIC).startEmissions(emissionPoints);
        emissionPoints[0].amount = (_rewardsAmount * 5) / 100;
        emissionPoints[1].amount = (_rewardsAmount * 25) / 1000;
        emissionPoints[2].amount = (_rewardsAmount * 125) / 10000;
        emissionPoints[3].amount = emissionPoints[2].amount;
        _meme.safeApprove(_alloc.tokenIC, _rewardsAmount / 10);
        ITokenIncentivesController(_alloc.tokenIC).startEmissions(emissionPoints);
    }
}
