// SPDX-License-Identifier: MIT

pragma solidity 0.8.23;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol';
import '@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol';
import '../interfaces/INFTWithLevel.sol';
import './interfaces/ILaunchpad.sol';
import './interfaces/ILaunchControl.sol';
import './interfaces/IControllerFactory.sol';
import './interfaces/IIdentityVerifier.sol';
import './ERC20MEME.sol';
import './libraries/LaunchControl.sol';

interface INFTChecker {
    function isNftStaked(address _identity, uint256 _nftId) external view returns (bool);
}

/// @title Launchpad
/// @notice Meme-token launchpad.
contract Launchpad is ILaunchpad, Ownable {
    using SafeERC20 for IERC20;

    uint256 public constant USDC_SOFT_CAP = 100_000 * 1e6;
    uint256 public constant USDC_MIN = 50 * 1e6;
    uint256 public constant USDC_MAX = 1_000 * 1e6;
    uint256 public constant LAUNCH_FEE = 5_000 * 1e6;

    uint256 private constant DEN = 1e4;
    uint256 private constant MAX_INT = 2 ** 255 - 1;

    address public immutable univ2router;
    IUniswapV2Factory public immutable univ2Factory;
    address public immutable FOMO;
    IERC20 public immutable USDC;
    IERC20 public immutable fomoUsdcLp;
    ITokenIncentivesController public immutable maverick;
    INFTWithLevel public immutable memberNFT;
    INFTChecker public immutable nftChecker;
    IControllerFactory public immutable controllerFactory;
    IIdentityVerifier public immutable identityVerifier;

    LaunchConfig[] public launches;
    Allocation[] public allocations;

    address[] public kolAddresses;
    mapping(address => bool) public isKOL;
    mapping(uint256 => mapping(address => Pledge)) public launchToUserPledge;
    mapping(uint256 => mapping(uint256 => Pledge)) public launchToNFTPledge;

    constructor(
        address _fomoUsdcLp,
        address _maverick,
        address _memberNFT,
        address _nftChecker,
        address _controllerFactory,
        address _identityVerifier,
        address _fomo,
        address _usdc,
        address _univ2router,
        address _univ2Factory
    ) {
        fomoUsdcLp = IERC20(_fomoUsdcLp);
        maverick = ITokenIncentivesController(_maverick);
        memberNFT = INFTWithLevel(_memberNFT);
        univ2router = _univ2router;
        univ2Factory = IUniswapV2Factory(_univ2Factory);
        nftChecker = INFTChecker(_nftChecker);
        controllerFactory = IControllerFactory(_controllerFactory);
        USDC = IERC20(_usdc);
        FOMO = _fomo;
        identityVerifier = IIdentityVerifier(_identityVerifier);
    }

    /***** EXTERNAL *****/

    function createLaunch(LaunchConfigVars memory _config, bool _staked, bytes calldata _data) external {
        if (!identityVerifier.verify(msg.sender, _data)) revert VerificationFailed();
        uint256 totalUsdc = USDC.balanceOf(address(fomoUsdcLp));
        uint256 feePercent = ((LAUNCH_FEE / 2) * 1e12) / totalUsdc;
        uint256 totalLP = fomoUsdcLp.totalSupply();
        uint256 lpAmount = (feePercent * totalLP) / 1e12;
        assert(lpAmount > 0);
        if (_config.rounds[0] == 0 || _config.rounds[1] == 0 || _config.rounds[2] == 0) revert InalidRounds();
        if (
            _config.allocations[0] +
                _config.allocations[1] +
                _config.allocations[2] +
                _config.allocations[3] +
                _config.allocations[4] +
                _config.allocations[5] +
                _config.allocations[6] !=
            DEN
        ) revert InvalidAllocations();

        if (_staked) {
            maverick.withdraw(lpAmount, msg.sender);
        } else {
            fomoUsdcLp.safeTransferFrom(msg.sender, address(this), lpAmount);
        }

        allocations.push(
            Allocation({
                usdc: 0,
                fomo: 0,
                token: address(0),
                fomoLP: address(0),
                usdcLP: address(0),
                tokenIC: address(0),
                tokenICProxy: address(0),
                fomoLPIC: address(0),
                usdcLPIC: address(0),
                vesting: address(0)
            })
        );
        launches.push(
            LaunchConfig({
                name: _config.name,
                symbol: _config.symbol,
                totalSupply: _config.totalSupply == TotalSupply.B1 ? 1e9 : _config.totalSupply == TotalSupply.B10 ? 1e10 : 1e11,
                hardCap: _config.hardCap == HardCap.K250 ? 250 * USDC_MAX : _config.hardCap == HardCap.K500
                    ? 500 * USDC_MAX
                    : 1000 * USDC_MAX,
                team: _config.team,
                x: _config.x,
                startTime: block.timestamp,
                raisedLP: lpAmount,
                raisedLPKOL: 0,
                allocations: _config.allocations,
                rounds: _config.rounds,
                status: LaunchStatus.PENDING
            })
        );
        Pledge storage userPledge = launchToUserPledge[launches.length - 1][msg.sender];
        userPledge.lp += lpAmount;
        userPledge.usdc += LAUNCH_FEE;
        emit LaunchCreated(_config.name, _config.symbol, launches.length - 1);
    }

    function pledge(uint256 _launchId, uint256 _amount, bool _staked, bytes calldata _data) external {
        if (!identityVerifier.verify(msg.sender, _data)) revert VerificationFailed();
        _pledge(_launchId, _amount, _staked, MAX_INT);
    }

    function pledgeWithNFT(uint256 _launchId, uint256 _amount, bool _staked, uint256 _nftId, bytes calldata _data) external {
        if (!identityVerifier.verify(msg.sender, _data)) revert VerificationFailed();
        if (!nftChecker.isNftStaked(msg.sender, _nftId)) revert UserNotNFTOwner();
        _pledge(_launchId, _amount, _staked, _nftId);
    }

    function getFundsBack(uint256 _launchId, bool _stake) external {
        LaunchConfig storage launchConfig = launches[_launchId];
        if (launchConfig.status != LaunchStatus.FAILED) revert LaunchIsNotFailed();
        Pledge storage userPledge = launchToUserPledge[_launchId][msg.sender];
        if (userPledge.lp > 0) {
            if (_stake) {
                fomoUsdcLp.safeApprove(address(maverick), userPledge.lp);
                maverick.deposit(userPledge.lp, msg.sender);
            } else {
                fomoUsdcLp.safeTransfer(msg.sender, userPledge.lp);
            }
            userPledge.lp = 0;
        }
    }

    function launch(uint256 _launchId) external {
        // Check launch criteria
        LaunchConfig storage launchConfig = launches[_launchId];
        if (launchConfig.status == LaunchStatus.FAILED) revert LaunchFailed();
        if (launchConfig.status == LaunchStatus.LAUNCHED) revert AlreadyLaunched();
        if (launchConfig.status == LaunchStatus.PENDING) {
            (, , , LaunchStatus status) = _tryToEndLaunch(_launchId);
            if (status == LaunchStatus.PENDING || status == LaunchStatus.FAILED) {
                return;
            }
        }
        launchConfig.status = LaunchStatus.LAUNCHED;
        Allocation storage alloc = allocations[_launchId];
        LaunchControl.AddressesA memory vars = LaunchControl.AddressesA({
            controllerFactory: address(controllerFactory),
            identityVerifier: address(identityVerifier),
            maverickIC: address(maverick),
            univ2router: univ2router,
            univ2Factory: address(univ2Factory),
            memberNFT: address(memberNFT),
            usdc: address(USDC),
            fomo: FOMO,
            owner: owner()
        });
        LaunchControl.launch(launchConfig, alloc, vars);

        IERC20 meme = IERC20(alloc.token);

        // // start vesting for KOL addresses
        uint256 kolAllocationInMEME = (meme.totalSupply() * launchConfig.allocations[1]) / DEN;
        uint256 kolAddressesLength = kolAddresses.length;
        if (launchConfig.raisedLPKOL > 0) {
            IERC20(address(meme)).safeApprove(
                alloc.vesting,
                kolAllocationInMEME + (meme.totalSupply() * launchConfig.allocations[0]) / DEN
            );
            for (uint i = 0; i < kolAddressesLength; i++) {
                Pledge storage kolPledge = launchToUserPledge[_launchId][kolAddresses[i]];
                if (kolPledge.lp > 0) {
                    IVesting(alloc.vesting).vestTokens(
                        (kolPledge.lp * kolAllocationInMEME) / launchConfig.raisedLPKOL,
                        kolAddresses[i]
                    );
                }
            }
        } else {
            IERC20(address(meme)).safeTransfer(owner(), kolAllocationInMEME);
        }
    }

    function claimTokens(uint256 _launchId) external {
        LaunchConfig storage launchConfig = launches[_launchId];
        if (launchConfig.status != LaunchStatus.LAUNCHED) revert LaunchIsNotLaunched();
        Allocation storage alloc = allocations[_launchId];
        Pledge storage userPledge = launchToUserPledge[_launchId][msg.sender];
        if (userPledge.claimed) revert AlreadyClaimed();

        // User allocation % multiplied by % of total sale allocation
        uint256 tokenAlloc = ((IERC20(alloc.token).totalSupply() * launchConfig.allocations[4] * userPledge.lp) /
            launchConfig.raisedLP) / DEN;
        if (IERC20(alloc.token).balanceOf(address(this)) <= tokenAlloc) {
            tokenAlloc = IERC20(alloc.token).balanceOf(address(this));
        }
        IERC20(alloc.token).safeTransfer(msg.sender, tokenAlloc);
        userPledge.claimed = true;
    }

    /***** OWNER *****/

    function setKolAddresses(address[] memory _kolAddresses, bool[] memory _isKol) external onlyOwner {
        if (_kolAddresses.length != _isKol.length) revert ArraysLengthMismatch();
        for (uint256 i = 0; i < _kolAddresses.length; i++) {
            if (isKOL[_kolAddresses[i]] != _isKol[i]) {
                isKOL[_kolAddresses[i]] = _isKol[i];
                if (_isKol[i]) {
                    kolAddresses.push(_kolAddresses[i]);
                } else {
                    for (uint256 j = 0; j < _kolAddresses.length; j++) {
                        if (kolAddresses[j] == _kolAddresses[i]) {
                            kolAddresses[j] = kolAddresses[kolAddresses.length - 1];
                            kolAddresses.pop();
                            break;
                        }
                    }
                }
            }
        }
    }

    /***** INTERNAL *****/

    function _pledge(uint256 _launchId, uint256 _amount, bool _staked, uint256 _nftId) internal {
        LaunchConfig storage launchConfig = launches[_launchId];
        if (launchConfig.status != LaunchStatus.PENDING) revert LaunchIsNotPending();
        (uint256 totalUsdc, uint256 totalLP, uint256 raisedUsdc, LaunchStatus status) = _tryToEndLaunch(_launchId);
        if (status != LaunchStatus.PENDING) {
            return;
        }
        // Get user pledge limits
        User memory user = User({minPledge: USDC_MIN, maxPledge: USDC_MAX});
        if (block.timestamp < launchConfig.startTime + launchConfig.rounds[0] * 1 days) {
            if (!isKOL[msg.sender]) revert UserIsNotKOL();
            user.minPledge = USDC_MIN * 10;
            user.maxPledge = USDC_MAX * 5;
        } else if (_nftId != MAX_INT) {
            if (isKOL[msg.sender]) revert UserIsKOL();
            user.maxPledge = (user.maxPledge * _getMultiplier(_nftId)) / 10;
        } else if (!isKOL[msg.sender]) {
            if (block.timestamp < launchConfig.startTime + (launchConfig.rounds[0] + launchConfig.rounds[1]) * 1 days)
                revert UserSaleNotStarted();
        } else {
            user.minPledge = USDC_MIN * 10;
            user.maxPledge = USDC_MAX * 5;
        }
        Pledge storage userPledge = _nftId != MAX_INT
            ? launchToNFTPledge[_launchId][_nftId]
            : launchToUserPledge[_launchId][msg.sender];
        if (userPledge.usdc >= user.maxPledge) revert PledgeLimitReached();
        user.maxPledge -= userPledge.usdc;
        // Check if max pledge exceeds hard cap
        if (raisedUsdc + user.maxPledge > launchConfig.hardCap) {
            user.maxPledge = launchConfig.hardCap - raisedUsdc;
        }
        uint256 maxPledgeLP = ((((user.maxPledge * 1e12) / 2) / totalUsdc) * totalLP) / 1e12;
        uint256 usdcPledgeValue = user.maxPledge;
        if (maxPledgeLP > _amount) {
            maxPledgeLP = _amount;
            usdcPledgeValue = (maxPledgeLP * totalUsdc * 2) / totalLP;
        }
        if (maxPledgeLP < (((((user.minPledge * 1e12) / 2) / totalUsdc) * totalLP) / 1e12)) revert MinPledgeNotReached();
        if (_staked) {
            maverick.withdraw(maxPledgeLP, msg.sender);
        } else {
            fomoUsdcLp.safeTransferFrom(msg.sender, address(this), maxPledgeLP);
        }
        userPledge.lp += maxPledgeLP;
        userPledge.usdc += usdcPledgeValue;
        launchConfig.raisedLP += maxPledgeLP;
        if (isKOL[msg.sender]) {
            launchConfig.raisedLPKOL += maxPledgeLP;
        }
        if (_nftId != MAX_INT) {
            // it's actually user plege, not nft pledge, but var name is taken
            Pledge storage nftPledge = launchToUserPledge[_launchId][msg.sender];
            nftPledge.lp += maxPledgeLP;
            nftPledge.usdc += usdcPledgeValue;
            emit PledgedWithNFT(_launchId, msg.sender, maxPledgeLP, usdcPledgeValue, _nftId);
        } else {
            emit Pledged(_launchId, msg.sender, maxPledgeLP, usdcPledgeValue);
        }
        // Check hard cap
        if (raisedUsdc + usdcPledgeValue >= launchConfig.hardCap) {
            _tryToEndLaunch(_launchId);
        }
    }

    /**
     * @notice Get multiplier for the given NFT token.
     * @param _tokenId NFT token id.
     */
    function _getMultiplier(uint256 _tokenId) internal view returns (uint256) {
        uint256 level = memberNFT.getLevelOfTokenById(_tokenId);

        if (level == 0) {
            // Diamond
            return 50; // 5 * SCALING_FACTOR
        } else if (level == 1) {
            // Platinum
            return 40; // 4 * SCALING_FACTOR
        } else if (level == 2) {
            // Gold
            return 30; // 3 * SCALING_FACTOR
        } else if (level == 3) {
            // Silver
            return 20; // 2 * SCALING_FACTOR
        } else if (level == 4) {
            // Bronze
            return 15; // 1.5 * SCALING_FACTOR
        } else {
            revert('Invalid token level');
        }
    }

    function _tryToEndLaunch(
        uint256 _launchId
    ) internal returns (uint256 totalUsdc, uint256 totalLP, uint256 raisedUsdc, LaunchStatus status) {
        LaunchConfig storage launchConfig = launches[_launchId];
        // Calculate raised amount (usdc value of LP tokens).
        totalUsdc = USDC.balanceOf(address(fomoUsdcLp));
        totalLP = fomoUsdcLp.totalSupply();
        raisedUsdc = ((launchConfig.raisedLP * 2 * totalUsdc * 1e12) / totalLP) / 1e12;
        // Check hard cap
        if (raisedUsdc >= launchConfig.hardCap) {
            status = LaunchStatus.HARD_CAP_REACHED;
        }
        // Check soft cap
        else if (
            block.timestamp >=
            launchConfig.startTime + (launchConfig.rounds[0] + launchConfig.rounds[1] + launchConfig.rounds[2]) * 1 days
        ) {
            if (raisedUsdc >= USDC_SOFT_CAP) {
                status = LaunchStatus.SOFT_CAP_REACHED;
            } else {
                status = LaunchStatus.FAILED;
            }
        } else {
            status = LaunchStatus.PENDING;
        }
        launchConfig.status = status;
        if (status == LaunchStatus.HARD_CAP_REACHED || status == LaunchStatus.SOFT_CAP_REACHED) {
            uint256 toBreak = (launchConfig.raisedLP * 80) / 100;
            uint256 toTeam = launchConfig.raisedLP - toBreak;
            // 20% LP to the token team
            fomoUsdcLp.safeTransfer(launchConfig.team, toTeam);
            // 80% LP is broken
            fomoUsdcLp.safeApprove(univ2router, toBreak);
            (uint256 usdcAmount, uint256 fomoAmount) = IUniswapV2Router02(univ2router).removeLiquidity(
                address(USDC),
                FOMO,
                toBreak,
                1,
                1,
                address(this),
                block.timestamp
            );
            // 5% FOMO is burned (6.25% of `fomoAmount`)
            uint256 fomoToBurn = (fomoAmount * 625) / DEN;
            IERC20(FOMO).safeTransfer(0x000000000000000000000000000000000000dEaD, fomoToBurn);
            // 5% USDC is sent to protocol (6.25% of `usdcAmount`)
            uint256 usdcForTeam = (usdcAmount * 625) / DEN;
            USDC.safeTransfer(owner(), usdcForTeam);
            // Save rest tokens allocations
            Allocation storage alloc = allocations[_launchId];
            alloc.usdc = usdcAmount - usdcForTeam;
            alloc.fomo = fomoAmount - fomoToBurn;
        }
    }

    // function _createLP(IERC20 _meme, Allocation storage _alloc, uint256 _liquidityAlloc) internal {
    //     uint256 liquidityAlloc = (_meme.totalSupply() * _liquidityAlloc) / DEN;
    //     // Approve necessary tokens
    //     USDC.safeApprove(univ2router, _alloc.usdc);
    //     IERC20(FOMO).safeApprove(univ2router, _alloc.fomo);
    //     _meme.safeApprove(univ2router, liquidityAlloc);
    //     // Create USDC-MEME LP
    //     IUniswapV2Router02(univ2router).addLiquidity(
    //         address(USDC),
    //         address(_meme),
    //         _alloc.usdc,
    //         liquidityAlloc / 2,
    //         1,
    //         1,
    //         address(this),
    //         block.timestamp
    //     );
    //     // Create FOMO-MEME LP
    //     IUniswapV2Router02(univ2router).addLiquidity(
    //         FOMO,
    //         address(_meme),
    //         _alloc.fomo,
    //         liquidityAlloc / 2,
    //         1,
    //         1,
    //         address(this),
    //         block.timestamp
    //     );
    //     // Transfer LP tokens to dead address
    //     _alloc.usdcLP = univ2Factory.getPair(address(USDC), address(_meme));
    //     _alloc.fomoLP = univ2Factory.getPair(FOMO, address(_meme));
    //     IERC20(_alloc.usdcLP).safeTransfer(
    //         0x000000000000000000000000000000000000dEaD,
    //         IERC20(_alloc.usdcLP).balanceOf(address(this))
    //     );
    //     IERC20(_alloc.fomoLP).safeTransfer(
    //         0x000000000000000000000000000000000000dEaD,
    //         IERC20(_alloc.fomoLP).balanceOf(address(this))
    //     );
    // }

    // function _startEmissions(uint256 _rewardsAmount, Allocation storage _alloc, IERC20 _meme) internal {
    //     ITokenIncentivesController.EmissionPoint[] memory emissionPoints = new ITokenIncentivesController.EmissionPoint[](4);
    //     emissionPoints[0] = ITokenIncentivesController.EmissionPoint(45 days, (_rewardsAmount * 2) / 10);
    //     emissionPoints[1] = ITokenIncentivesController.EmissionPoint(45 days, _rewardsAmount / 10);
    //     emissionPoints[2] = ITokenIncentivesController.EmissionPoint(45 days, (_rewardsAmount * 5) / 100);
    //     emissionPoints[3] = emissionPoints[2];
    //     _meme.safeApprove(_alloc.fomoLPIC, (_rewardsAmount * 4) / 10);
    //     ITokenIncentivesController(_alloc.fomoLPIC).startEmissions(emissionPoints);
    //     _meme.safeApprove(_alloc.usdcLPIC, (_rewardsAmount * 4) / 10);
    //     ITokenIncentivesController(_alloc.usdcLPIC).startEmissions(emissionPoints);
    //     emissionPoints[0].amount = (_rewardsAmount * 5) / 100;
    //     emissionPoints[1].amount = (_rewardsAmount * 25) / 1000;
    //     emissionPoints[2].amount = (_rewardsAmount * 125) / 10000;
    //     emissionPoints[3].amount = emissionPoints[2].amount;
    //     _meme.safeApprove(_alloc.tokenIC, _rewardsAmount / 10);
    //     ITokenIncentivesController(_alloc.tokenIC).startEmissions(emissionPoints);
    // }
}
