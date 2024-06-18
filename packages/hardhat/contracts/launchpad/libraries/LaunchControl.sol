// SPDX-License-Identifier: MIT

pragma solidity 0.8.23;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import './../interfaces/ILaunchCommon.sol';
import '../../utils/Adminable.sol';
import '../interfaces/IControllerFactory.sol';
import '../interfaces/IMEMEVesting.sol';
import '../interfaces/IDexProvider.sol';
import '../interfaces/ITokenEmissionsController.sol';
import '../interfaces/ITokenIncentivesController.sol';
import '../ERC20MEME.sol';
import '../../utils/Adminable.sol';

/// @title LaunchControl
/// @notice Library to perform token launch.
library LaunchControl {
    using SafeERC20 for IERC20;

    address public constant DEAD = 0x000000000000000000000000000000000000dEaD;

    uint256 private constant DEN = 1e4;

    struct Vars {
        // Address of the controller factory.
        address controllerFactory;
        // Address of the identity verifier.
        address identityVerifier;
        // Address of the Steak Incentives Controller.
        address steakIC;
        // Address of the FOMO Incentives Controller.
        address fomoIC;
        // Address of the Steak LP provider.
        address steakLpProvider;
        // Address of the DEX provider.
        address dexProvider;
        // Address of the Member NFT.
        address memberNFT;
        // Address of the FOMO token.
        address fomo;
        // Address of the FOMO-USDC LP.
        address fomoUsdcLp;
        // Address of the USDC token.
        address usdc;
        // Address of the platform owner.
        address owner;
    }

    /***** EXTERNAL *****/

    /**
     * @notice Launch a token.
     * @param _launchConfig Launch configuration
     * @param _addrs Token addresses
     * @param _vars variables
     */
    function launch(
        ILaunchCommon.LaunchConfig storage _launchConfig,
        ILaunchCommon.TokenAddressess storage _addrs,
        Vars memory _vars
    ) external {
        // Set launch status
        _launchConfig.status = ILaunchCommon.LaunchStatus.LAUNCHED;

        // Crate MEME token
        ERC20 meme = new ERC20MEME(_launchConfig.name, _launchConfig.symbol, _launchConfig.values[3]);
        _addrs.token = address(meme);

        // Create LP and send it to dead address
        uint256 liquidityAllocInMeme = (meme.totalSupply() * _launchConfig.allocations[3]) / DEN;
        if (liquidityAllocInMeme / 2 > 0) {
            _createLP(meme, _addrs, liquidityAllocInMeme, _vars);
        }

        // Create IncentivesControllers and vesting contracts
        {
            address[5] memory controllers = IControllerFactory(_vars.controllerFactory).createNewTokenControllers(
                address(meme),
                _addrs.usdcLP,
                _addrs.fomoLP,
                address(_vars.memberNFT),
                address(this),
                _vars.owner
            );
            _addrs.usdcLPIC = controllers[0]; // usdcLPIC;
            _addrs.fomoLPIC = controllers[1]; // fomoLPIC;
            _addrs.tokenIC = controllers[2]; // tokenIC;
            _addrs.tokenICProxy = controllers[3]; // tokenProxy;
            _addrs.vesting = controllers[4]; // vesting;
        }

        // Start emissions in incentive controllers
        uint256 rewardsAmount = (meme.totalSupply() * _launchConfig.allocations[2]) / DEN;
        if (rewardsAmount > 0) {
            _startEmissions(rewardsAmount, _launchConfig, _addrs, meme);
        }

        // Transfer ownership to platform owner
        Adminable(_addrs.usdcLPIC).transferOwnership(_vars.owner);
        Adminable(_addrs.fomoLPIC).transferOwnership(_vars.owner);
        Adminable(_addrs.tokenIC).transferOwnership(_vars.owner);

        // Notify Steak controller with X% of rewards allocation
        address[] memory tokenArray = new address[](1);
        tokenArray[0] = address(meme);
        uint256[] memory rewardArray = new uint256[](1);
        rewardArray[0] = (rewardsAmount * _launchConfig.rewardsAllocations[3]) / DEN;
        if (rewardArray[0] > 0) {
            IERC20(address(meme)).safeApprove(_vars.steakIC, rewardArray[0]);
            ITokenIncentivesController(_vars.steakIC).addReward(address(meme));
            ITokenIncentivesController(_vars.steakIC).notifyReward(tokenArray, rewardArray, 120 days);
        }
        // Notify FOMO controller with X% of rewards allocation
        rewardArray[0] = (rewardsAmount * _launchConfig.rewardsAllocations[4]) / DEN;
        if (rewardArray[0] > 0) {
            IERC20(address(meme)).safeApprove(_vars.fomoIC, rewardArray[0]);
            ITokenControllerCommons(_vars.fomoIC).addReward(address(meme));
            ITokenControllerCommons(_vars.fomoIC).notifyReward(tokenArray, rewardArray, 120 days);
        }

        // vest % MEME to the token team
        uint256 teamMemeAlloc = (meme.totalSupply() * _launchConfig.allocations[0]) / DEN;
        if (teamMemeAlloc > 0) {
            IERC20(address(meme)).safeApprove(_addrs.vesting, teamMemeAlloc);
            IMEMEVesting(_addrs.vesting).vestTokens(teamMemeAlloc, _launchConfig.team);
        }

        // Send % MEME to the X address if set
        if (_launchConfig.allocations[5] > 0) {
            IERC20(address(meme)).safeTransfer(_launchConfig.x, (meme.totalSupply() * _launchConfig.allocations[5]) / DEN);
        }

        // Send % MEME to the protocol
        if (_launchConfig.allocations[6] > 0) {
            IERC20(address(meme)).safeTransfer(_vars.owner, (meme.totalSupply() * _launchConfig.allocations[6]) / DEN);
        }
    }

    /**
     * @notice Check Launch criteria and break and distribute pledged Steak LP if succesfull.
     * @param _launchConfig Launch configuration
     * @param _addrs Token addresses
     * @param _vars Variables
     * @return totalUsdc Total USDC in the Steak LP pair
     * @return totalLP Total Steak LP tokens
     * @return raisedUsdc Total raised/pledged value in USDC
     * @return status New launch status
     */
    function tryToEndLaunch(
        ILaunchCommon.LaunchConfig storage _launchConfig,
        ILaunchCommon.TokenAddressess storage _addrs,
        Vars memory _vars
    ) external returns (uint256 totalUsdc, uint256 totalLP, uint256 raisedUsdc, ILaunchCommon.LaunchStatus status) {
        // Calculate raised amount (usdc value of LP tokens).
        totalUsdc = IDexProvider(_vars.steakLpProvider).getPoolBalance(address(_vars.fomoUsdcLp), _vars.usdc);
        totalLP = IERC20(_vars.fomoUsdcLp).totalSupply();
        raisedUsdc = ((_launchConfig.values[9] * 2 * totalUsdc * 1e12) / totalLP) / 1e12;
        // Check hard cap
        if (raisedUsdc >= _launchConfig.values[5] - _launchConfig.values[6]) {
            status = ILaunchCommon.LaunchStatus.HARD_CAP_REACHED;
        }
        // Check soft cap
        else if (
            block.timestamp >=
            _launchConfig.values[8] + _launchConfig.values[0] + _launchConfig.values[1] + _launchConfig.values[2]
        ) {
            if (raisedUsdc >= _launchConfig.values[4] - _launchConfig.values[6]) {
                status = ILaunchCommon.LaunchStatus.SOFT_CAP_REACHED;
            } else {
                status = ILaunchCommon.LaunchStatus.FAILED;
            }
        } else {
            status = ILaunchCommon.LaunchStatus.PENDING;
        }
        _launchConfig.status = status;
        if (status == ILaunchCommon.LaunchStatus.HARD_CAP_REACHED || status == ILaunchCommon.LaunchStatus.SOFT_CAP_REACHED) {
            uint256 toBreak = (_launchConfig.values[9] * (DEN - _launchConfig.values[11])) / DEN;
            uint256 toTeam = _launchConfig.values[9] - toBreak;
            // Send % LP to the token team
            IERC20(_vars.fomoUsdcLp).safeTransfer(_launchConfig.team, toTeam);
            // LP is broken
            IERC20(_vars.fomoUsdcLp).safeTransfer(_vars.steakLpProvider, toBreak);
            (uint256 usdcAmount, uint256 fomoAmount) = IDexProvider(_vars.steakLpProvider).breakLP(_vars.fomoUsdcLp);
            // % FOMO is burned
            uint256 platformFeePercent = (_launchConfig.values[12] * DEN) / (DEN - _launchConfig.values[11]);
            uint256 fomoToBurn = (fomoAmount * platformFeePercent) / DEN;
            IERC20(_vars.fomo).safeTransfer(DEAD, fomoToBurn);
            // % USDC is sent to protocol
            uint256 usdcForTeam = (usdcAmount * platformFeePercent) / DEN;
            IERC20(_vars.usdc).safeTransfer(_vars.owner, usdcForTeam);
            // Save raised token amounts
            _addrs.usdc = usdcAmount - usdcForTeam;
            _addrs.fomo = fomoAmount - fomoToBurn;
        }
    }

    /***** INTERNAL *****/

    /**
     * @notice Create LP tokens and send them to dEaD address.
     * @param _meme MEME token
     * @param _addrs Token addresses
     * @param _liquidityAlloc Amount of MEME tokens for LP creation
     * @param _vars Variables
     */
    function _createLP(
        IERC20 _meme,
        ILaunchCommon.TokenAddressess storage _addrs,
        uint256 _liquidityAlloc,
        Vars memory _vars
    ) internal {
        // Transfer tokens to dex provider
        IERC20(_vars.usdc).safeTransfer(_vars.dexProvider, _addrs.usdc);
        IERC20(_vars.fomo).safeTransfer(_vars.dexProvider, _addrs.fomo);
        _meme.safeTransfer(_vars.dexProvider, _liquidityAlloc);

        // Create liquidity pools
        _addrs.usdcLP = IDexProvider(_vars.dexProvider).createLP(_vars.usdc, address(_meme), _addrs.usdc, _liquidityAlloc / 2);
        _addrs.fomoLP = IDexProvider(_vars.dexProvider).createLP(_vars.fomo, address(_meme), _addrs.fomo, _liquidityAlloc / 2);

        // Transfer LP tokens to dead address
        IERC20(_addrs.usdcLP).safeTransfer(DEAD, IERC20(_addrs.usdcLP).balanceOf(address(this)));
        IERC20(_addrs.fomoLP).safeTransfer(DEAD, IERC20(_addrs.fomoLP).balanceOf(address(this)));
    }

    /**
     * @notice Start emissions in incentive controllers.
     * @param _rewardsAmount Amount of MEME token rewards allocations
     * @param _addrs Token addresses
     * @param _meme Meme token
     */
    function _startEmissions(
        uint256 _rewardsAmount,
        ILaunchCommon.LaunchConfig storage _launchConfig,
        ILaunchCommon.TokenAddressess storage _addrs,
        IERC20 _meme
    ) internal {
        // Notify MEME-USDC LP controller with X% of rewards allocation
        uint256 usdcLPAlloc = (_rewardsAmount * _launchConfig.rewardsAllocations[0]) / DEN;
        ITokenControllerCommons.EmissionPoint[] memory emissionPoints = new ITokenControllerCommons.EmissionPoint[](4);
        emissionPoints[0] = ITokenControllerCommons.EmissionPoint(45 days, (usdcLPAlloc / 2));
        emissionPoints[1] = ITokenControllerCommons.EmissionPoint(45 days, (usdcLPAlloc / 4));
        emissionPoints[2] = ITokenControllerCommons.EmissionPoint(45 days, (usdcLPAlloc / 8));
        emissionPoints[3] = ITokenControllerCommons.EmissionPoint(90 days, (usdcLPAlloc / 8));
        if (usdcLPAlloc > 0) {
            _meme.safeApprove(_addrs.usdcLPIC, usdcLPAlloc);
            ITokenEmissionsController(_addrs.usdcLPIC).startEmissions(emissionPoints);
        }

        // Notify MEME-FOMO LP controller with X% of rewards allocation
        uint256 fomoLPAlloc = (_rewardsAmount * _launchConfig.rewardsAllocations[1]) / DEN;
        if (fomoLPAlloc > 0) {
            emissionPoints[0].amount = (fomoLPAlloc / 2);
            emissionPoints[1].amount = (fomoLPAlloc / 4);
            emissionPoints[2].amount = (fomoLPAlloc / 8);
            emissionPoints[3].amount = emissionPoints[2].amount;
            _meme.safeApprove(_addrs.fomoLPIC, fomoLPAlloc);
            ITokenEmissionsController(_addrs.fomoLPIC).startEmissions(emissionPoints);
        }

        // Notify MEME controller with X% of rewards allocation
        uint256 memeAlloc = (_rewardsAmount * _launchConfig.rewardsAllocations[2]) / DEN;
        if (memeAlloc > 0) {
            emissionPoints[0].amount = (memeAlloc / 2);
            emissionPoints[1].amount = (memeAlloc / 4);
            emissionPoints[2].amount = (memeAlloc / 8);
            emissionPoints[3].amount = emissionPoints[2].amount;
            _meme.safeApprove(_addrs.tokenIC, memeAlloc);
            ITokenEmissionsController(_addrs.tokenIC).startEmissions(emissionPoints);
        }
    }
}
