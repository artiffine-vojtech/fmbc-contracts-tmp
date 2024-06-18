// SPDX-License-Identifier: MIT

pragma solidity 0.8.23;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import '@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol';
import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol';
import '@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol';
import '../interfaces/INFTWithLevel.sol';
import './interfaces/INFTChecker.sol';
import './interfaces/IDexProvider.sol';
import './interfaces/ILaunchpad.sol';
import './interfaces/IIdentityVerifier.sol';
import './ERC20MEME.sol';
import './libraries/LaunchControl.sol';

/**
 * @title Launchpad
 * @notice Launchpad contract for meme-token creation and fair fund-raising.
 */
contract Launchpad is ILaunchpad, Ownable {
    using SafeERC20 for IERC20;

    address public immutable FOMO;
    address public immutable USDC;
    uint256 public immutable USDC_DECIMALS;

    /// @notice Soft cap value of all pledges in USDC
    uint256 public USDC_SOFT_CAP = 100_000 * 1e6;
    /// @notice Steak LP value in USDC for launch creation (not forfeited if launch fails)
    uint256 public LAUNCH_FEE = 5_000 * 1e6;
    /// @notice Minimum pledge value in USDC
    uint256 public USDC_MIN = 50 * 1e6;
    /// @notice Maximum pledge value in USDC
    uint256 public USDC_MAX = 1_000 * 1e6;
    /// @notice Minimum pledge value in USDC for KOLs
    uint256 public USDC_KOL_MIN = 500 * 1e6;
    /// @notice Maximum pledge value in USDC for KOLs
    uint256 public USDC_KOL_MAX = 5_000 * 1e6;
    /// @notice Fee taken by the contract owner in Steak LP tokens
    uint16 public PLATFORM_STEAK_FEE = 500;
    /// @notice Fee taken by the contract owner in MEME tokens
    uint16 public PLATFORM_MEME_FEE = 275;
    /// @notice Helper contract to create token controllers
    address public CONTROLLER_FACTORY;

    uint256 private constant DEN = 1e4;
    uint256 private constant MAX_INT = 2 ** 255 - 1;

    /// @notice Steak LP pair (Balancer LP token)
    IERC20 public immutable fomoUsdcLp;
    /// @notice Steak LP incentives controller
    ITokenIncentivesController public steakIC;
    /// @notice FOMO incentives controller
    ITokenControllerCommons public fomoIC;

    /// @notice FOMO Bull Club Member NFT collection
    INFTWithLevel public immutable memberNFT;
    /// @notice Helper contract to check NFT ownership
    INFTChecker public immutable nftChecker;
    /// @notice Helper contract to verify user identity (KYC)
    IIdentityVerifier public immutable identityVerifier;

    /// @notice List of all launches
    LaunchConfig[] public launches;
    /// @notice List of all allocations
    TokenAddressess[] public tokenAddresses;
    /// @notice List of all DEX providers
    /// @dev index 0 is Balancer DEX Provider
    IDexProvider[] public dexProviders;

    /// @notice List of all KOL addresses
    address[] public kolAddresses;
    /// @notice Map of KOL addresses
    mapping(address => bool) public isKOL;
    /// @notice Launch -> User pledge amounts
    mapping(uint256 => mapping(address => Pledge)) public launchToUserPledge;
    /// @notice Launch -> NFT pledge amounts
    mapping(uint256 => mapping(uint256 => Pledge)) public launchToNFTPledge;

    constructor(
        address _fomo,
        address _usdc,
        address _fomoUsdcLp,
        address _steakIC,
        address _fomoIC,
        address _memberNFT,
        address _nftChecker,
        address _controllerFactory,
        address _identityVerifier,
        address _dexProvider
    ) {
        FOMO = _fomo;
        USDC = _usdc;
        USDC_DECIMALS = 10 ** IERC20Metadata(_usdc).decimals();
        fomoUsdcLp = IERC20(_fomoUsdcLp);
        steakIC = ITokenIncentivesController(_steakIC);
        fomoIC = ITokenControllerCommons(_fomoIC);
        memberNFT = INFTWithLevel(_memberNFT);
        nftChecker = INFTChecker(_nftChecker);
        identityVerifier = IIdentityVerifier(_identityVerifier);
        dexProviders.push(IDexProvider(_dexProvider));
        CONTROLLER_FACTORY = _controllerFactory;
    }

    /***** EXTERNAL *****/

    /**
     * @inheritdoc ILaunchpad
     */
    function createLaunch(LaunchConfigVars memory _config, bool _staked, bytes calldata _data) external {
        if (!identityVerifier.verify(msg.sender, _data)) revert VerificationFailed();
        uint256 totalUsdc = dexProviders[0].getPoolBalance(address(fomoUsdcLp), USDC);
        uint256 feePercent = ((LAUNCH_FEE / 2) * 1e12) / totalUsdc;
        uint256 totalLP = fomoUsdcLp.totalSupply();
        uint256 lpAmount = (feePercent * totalLP) / 1e12;
        assert(lpAmount > 0);
        if (_config.allocations[3] == 0) revert LiquidityAllocationIsZero();
        if (_config.allocations[5] > 0 && _config.x == address(0)) revert XIsAddressZero();
        if (_config.team == address(0)) revert TeamIsAddressZero();
        if (_config.steakTeamFee >= DEN - PLATFORM_STEAK_FEE) revert InvalidSteakTeamFee();
        if (_config.totalSupply == 0) revert InvalidTotalSupply();
        if (_config.hardCap * USDC_DECIMALS <= USDC_SOFT_CAP) revert InvalidHardCap();
        if (_config.rounds[0] == 0 || _config.rounds[1] == 0 || _config.rounds[2] == 0) revert InvalidRounds();
        if (_config.dexIndex >= dexProviders.length) revert InvalidDexIndex();
        if (
            _config.allocations[0] +
                _config.allocations[1] +
                _config.allocations[2] +
                _config.allocations[3] +
                _config.allocations[4] +
                _config.allocations[5] +
                PLATFORM_MEME_FEE !=
            DEN
        ) revert InvalidAllocations();
        if (
            _config.rewardsAllocations[0] +
                _config.rewardsAllocations[1] +
                _config.rewardsAllocations[2] +
                _config.rewardsAllocations[3] +
                _config.rewardsAllocations[4] !=
            DEN
        ) revert InvalidRewardsAllocations();

        // Transfer LP tokens
        if (_staked) {
            steakIC.withdraw(lpAmount, msg.sender);
        } else {
            fomoUsdcLp.safeTransferFrom(msg.sender, address(this), lpAmount);
        }

        // Create empty Allocatios struct
        tokenAddresses.push(
            TokenAddressess({
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
                dexProvider: address(dexProviders[_config.dexIndex]),
                team: _config.team,
                x: _config.x,
                allocations: [
                    _config.allocations[0],
                    _config.allocations[1],
                    _config.allocations[2],
                    _config.allocations[3],
                    _config.allocations[4],
                    _config.allocations[5],
                    PLATFORM_MEME_FEE
                ],
                rewardsAllocations: [
                    _config.rewardsAllocations[0],
                    _config.rewardsAllocations[1],
                    _config.rewardsAllocations[2],
                    _config.rewardsAllocations[3],
                    _config.rewardsAllocations[4]
                ],
                values: [
                    _config.rounds[0],
                    _config.rounds[1],
                    _config.rounds[2],
                    _config.totalSupply,
                    USDC_SOFT_CAP,
                    _config.hardCap * USDC_DECIMALS,
                    USDC_MIN,
                    USDC_MAX,
                    block.timestamp,
                    lpAmount,
                    0,
                    _config.steakTeamFee,
                    PLATFORM_STEAK_FEE,
                    USDC_KOL_MIN,
                    USDC_KOL_MAX
                ],
                status: LaunchStatus.PENDING
            })
        );
        Pledge storage userPledge = launchToUserPledge[launches.length - 1][msg.sender];
        userPledge.lp += lpAmount;
        userPledge.usdc += LAUNCH_FEE;
        emit LaunchCreated(_config.name, _config.symbol, launches.length - 1);
    }

    /**
     * @inheritdoc ILaunchpad
     */
    function pledge(uint256 _launchId, uint256 _amount, bool _staked, bytes calldata _data) external {
        if (!identityVerifier.verify(msg.sender, _data)) revert VerificationFailed();
        _pledge(_launchId, _amount, _staked, MAX_INT);
    }

    /**
     * @inheritdoc ILaunchpad
     */
    function pledgeWithNFT(
        uint256 _launchId,
        uint256 _amount,
        bool _staked,
        uint256 _nftId,
        address _controllerWithNFT,
        bytes calldata _data
    ) external {
        if (!identityVerifier.verify(msg.sender, _data)) revert VerificationFailed();
        if (!nftChecker.isNftStaked(msg.sender, _nftId, _controllerWithNFT)) revert UserNotNFTOwner();
        _pledge(_launchId, _amount, _staked, _nftId);
    }

    /**
     * @inheritdoc ILaunchpad
     */
    function getFundsBack(uint256 _launchId, bool _stake) external {
        LaunchConfig storage launchConfig = launches[_launchId];
        if (launchConfig.status != LaunchStatus.FAILED) revert LaunchIsNotFailed();
        Pledge storage userPledge = launchToUserPledge[_launchId][msg.sender];
        if (userPledge.lp > 0) {
            uint256 amount = userPledge.lp;
            userPledge.lp = 0;
            if (_stake) {
                fomoUsdcLp.safeApprove(address(steakIC), amount);
                steakIC.deposit(amount, msg.sender);
            } else {
                fomoUsdcLp.safeTransfer(msg.sender, amount);
            }
        }
    }

    /**
     * @inheritdoc ILaunchpad
     */
    function launch(uint256 _launchId) external {
        // Check launch criteria
        LaunchConfig storage launchConfig = launches[_launchId];
        if (launchConfig.status == LaunchStatus.FAILED) revert LaunchFailed();
        if (launchConfig.status == LaunchStatus.LAUNCHED) revert AlreadyLaunched();
        TokenAddressess storage addrs = tokenAddresses[_launchId];
        LaunchControl.Vars memory vars = LaunchControl.Vars({
            controllerFactory: CONTROLLER_FACTORY,
            identityVerifier: address(identityVerifier),
            steakIC: address(steakIC),
            fomoIC: address(fomoIC),
            steakLpProvider: address(dexProviders[0]),
            memberNFT: address(memberNFT),
            fomoUsdcLp: address(fomoUsdcLp),
            usdc: USDC,
            fomo: FOMO,
            owner: owner(),
            dexProvider: launchConfig.dexProvider
        });
        if (launchConfig.status == LaunchStatus.PENDING) {
            (, , , LaunchStatus status) = LaunchControl.tryToEndLaunch(launchConfig, addrs, vars);
            if (status == LaunchStatus.PENDING || status == LaunchStatus.FAILED) {
                return;
            }
        }
        // Launch the token
        LaunchControl.launch(launchConfig, addrs, vars);
        IERC20 meme = IERC20(addrs.token);

        // Register incentives controllers
        nftChecker.addIncentivesController(addrs.tokenIC);
        nftChecker.addIncentivesController(addrs.fomoLPIC);
        nftChecker.addIncentivesController(addrs.usdcLPIC);

        // // start vesting for KOL addresses
        uint256 kolAllocationInMEME = (meme.totalSupply() * launchConfig.allocations[1]) / DEN;
        if (launchConfig.values[10] > 0 && kolAllocationInMEME > 0) {
            meme.safeApprove(addrs.vesting, kolAllocationInMEME);
            uint256 kolAddressesLength = kolAddresses.length;
            for (uint i = 0; i < kolAddressesLength; i++) {
                Pledge storage kolPledge = launchToUserPledge[_launchId][kolAddresses[i]];
                uint256 kolMemeAmount = (kolPledge.lp * kolAllocationInMEME) / launchConfig.values[10];
                if (kolMemeAmount > 0) {
                    IMEMEVesting(addrs.vesting).vestTokens(kolMemeAmount, kolAddresses[i]);
                }
            }
        } else {
            // Transfer KOL allocation to the owner if no KOL pledged
            meme.safeTransfer(owner(), kolAllocationInMEME);
        }
    }

    /**
     * @inheritdoc ILaunchpad
     */
    function claimTokens(uint256 _launchId) external {
        LaunchConfig storage launchConfig = launches[_launchId];
        if (launchConfig.status != LaunchStatus.LAUNCHED) revert LaunchIsNotLaunched();
        TokenAddressess storage addrs = tokenAddresses[_launchId];
        Pledge storage userPledge = launchToUserPledge[_launchId][msg.sender];

        // User allocation % multiplied by % of total sale allocation
        uint256 tokenAlloc = ((launchConfig.values[3] * 1e18 * launchConfig.allocations[4] * userPledge.lp) /
            launchConfig.values[9]) / DEN;

        // Check if user already claimed
        if (userPledge.claimed >= tokenAlloc) revert AlreadyClaimed();

        // subtract already claimed tokens
        tokenAlloc -= userPledge.claimed;

        // Check if contract has enough tokens to send
        uint256 launchpadBalance = IERC20(addrs.token).balanceOf(address(this));
        if (launchpadBalance < tokenAlloc) {
            tokenAlloc = launchpadBalance;
        }

        // Update user claimed amount
        userPledge.claimed += tokenAlloc;

        // Transfer tokens
        IERC20(addrs.token).safeTransfer(msg.sender, tokenAlloc);
    }

    /***** VIEW *****/

    function getLaunchConfig(uint256 _launchId) external view returns (LaunchConfig memory) {
        return launches[_launchId];
    }

    /***** OWNER *****/

    /**
     * @inheritdoc ILaunchpad
     */
    function setKolAddresses(address[] memory _kolAddresses, bool[] memory _isKol) external onlyOwner {
        if (_kolAddresses.length != _isKol.length) revert ArraysLengthMismatch();
        for (uint256 i = 0; i < _kolAddresses.length; i++) {
            if (isKOL[_kolAddresses[i]] != _isKol[i]) {
                isKOL[_kolAddresses[i]] = _isKol[i];
                if (_isKol[i]) {
                    kolAddresses.push(_kolAddresses[i]);
                } else {
                    for (uint256 j = 0; j < kolAddresses.length; j++) {
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

    /**
     * @inheritdoc ILaunchpad
     */
    function setSoftCapAndFees(uint256 _softCap, uint256 _launchFee) external onlyOwner {
        if (_softCap > 0) USDC_SOFT_CAP = _softCap * USDC_DECIMALS;
        require(_launchFee < USDC_SOFT_CAP);
        LAUNCH_FEE = _launchFee * USDC_DECIMALS;
    }

    /**
     * @inheritdoc ILaunchpad
     */
    function setPledgeLimits(uint256 _min, uint256 _max) external onlyOwner {
        if (_min > 0) USDC_MIN = _min * USDC_DECIMALS;
        if (_max > 0) USDC_MAX = _max * USDC_DECIMALS;
    }

    /**
     * @inheritdoc ILaunchpad
     */
    function setPledgeLimitsForKOLs(uint256 _min, uint256 _max) external onlyOwner {
        if (_min > 0) USDC_KOL_MIN = _min * USDC_DECIMALS;
        if (_max > 0) USDC_KOL_MAX = _max * USDC_DECIMALS;
    }

    /**
     * @inheritdoc ILaunchpad
     */
    function setSteakPlatformFee(uint16 _fee) external onlyOwner {
        require(_fee <= 2000); // 20%
        PLATFORM_STEAK_FEE = _fee;
    }

    /**
     * @inheritdoc ILaunchpad
     */
    function setMemePlatformFee(uint16 _fee) external onlyOwner {
        require(_fee <= 2000); // 20%
        PLATFORM_MEME_FEE = _fee;
    }

    /**
     * @inheritdoc ILaunchpad
     */
    function setControllerFactory(address _controllerFactory) external onlyOwner {
        CONTROLLER_FACTORY = _controllerFactory;
        emit ControllerFactorySet(_controllerFactory);
    }

    /**
     * @inheritdoc ILaunchpad
     */
    function setSteakIC(address _steakIC) external onlyOwner {
        steakIC = ITokenIncentivesController(_steakIC);
        emit SteakICSet(_steakIC);
    }

    /**
     * @inheritdoc ILaunchpad
     */
    function setFomoIC(address _fomoIC) external onlyOwner {
        fomoIC = ITokenControllerCommons(_fomoIC);
        emit FomoICSet(_fomoIC);
    }

    /**
     * @inheritdoc ILaunchpad
     */
    function addDexProvider(address _dexProvider) external onlyOwner {
        require(_dexProvider != address(0));
        dexProviders.push(IDexProvider(_dexProvider));
        emit DexProviderAdded(dexProviders.length - 1, _dexProvider);
    }

    /***** INTERNAL *****/

    function _pledge(uint256 _launchId, uint256 _amount, bool _staked, uint256 _nftId) internal {
        LaunchConfig storage launchConfig = launches[_launchId];
        if (launchConfig.status != LaunchStatus.PENDING) revert LaunchIsNotPending();
        uint256 totalUsdc;
        uint256 totalLP;
        uint256 raisedUsdc;
        {
            LaunchStatus status;
            (totalUsdc, totalLP, raisedUsdc, status) = LaunchControl.tryToEndLaunch(
                launchConfig,
                tokenAddresses[_launchId],
                LaunchControl.Vars({
                    controllerFactory: CONTROLLER_FACTORY,
                    identityVerifier: address(identityVerifier),
                    steakIC: address(steakIC),
                    fomoIC: address(fomoIC),
                    steakLpProvider: address(dexProviders[0]),
                    dexProvider: launchConfig.dexProvider,
                    memberNFT: address(memberNFT),
                    fomoUsdcLp: address(fomoUsdcLp),
                    usdc: USDC,
                    fomo: FOMO,
                    owner: owner()
                })
            );
            if (status != LaunchStatus.PENDING) {
                return;
            }
        }
        uint256 maxPledgeLP;
        uint256 usdcPledgeValue;
        // Get user pledge limits
        {
            User memory user = User({minPledge: launchConfig.values[6], maxPledge: launchConfig.values[7]});
            if (block.timestamp < launchConfig.values[8] + launchConfig.values[0]) {
                if (!isKOL[msg.sender]) revert UserIsNotKOL();
                user.minPledge = launchConfig.values[13];
                user.maxPledge = launchConfig.values[14];
            } else if (_nftId != MAX_INT) {
                if (isKOL[msg.sender]) revert UserIsKOL();
                user.maxPledge = (user.maxPledge * _getMultiplier(_nftId)) / 10;
            } else if (!isKOL[msg.sender]) {
                if (block.timestamp < launchConfig.values[8] + launchConfig.values[0] + launchConfig.values[1])
                    revert UserSaleNotStarted();
            } else {
                user.minPledge = launchConfig.values[13];
                user.maxPledge = launchConfig.values[14];
            }
            Pledge storage userPledge = _nftId != MAX_INT
                ? launchToNFTPledge[_launchId][_nftId]
                : launchToUserPledge[_launchId][msg.sender];
            if (userPledge.usdc >= user.maxPledge) revert PledgeLimitReached();
            user.maxPledge -= userPledge.usdc;
            // Check if max pledge exceeds hard cap
            if (raisedUsdc + user.maxPledge > launchConfig.values[5]) {
                user.maxPledge = launchConfig.values[5] - raisedUsdc;
            }
            maxPledgeLP = ((((user.maxPledge * 1e12) / 2) / totalUsdc) * totalLP) / 1e12;
            usdcPledgeValue = user.maxPledge;
            if (maxPledgeLP > _amount) {
                maxPledgeLP = _amount;
                usdcPledgeValue = (maxPledgeLP * totalUsdc * 2) / totalLP;
            }
            if (maxPledgeLP < (((((user.minPledge * 1e12) / 2) / totalUsdc) * totalLP) / 1e12)) revert MinPledgeNotReached();
            if (_staked) {
                steakIC.withdraw(maxPledgeLP, msg.sender);
            } else {
                fomoUsdcLp.safeTransferFrom(msg.sender, address(this), maxPledgeLP);
            }
            userPledge.lp += maxPledgeLP;
            userPledge.usdc += usdcPledgeValue;
            launchConfig.values[9] += maxPledgeLP;
        }
        if (isKOL[msg.sender]) {
            launchConfig.values[10] += maxPledgeLP;
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
        LaunchControl.tryToEndLaunch(
            launchConfig,
            tokenAddresses[_launchId],
            LaunchControl.Vars({
                controllerFactory: CONTROLLER_FACTORY,
                identityVerifier: address(identityVerifier),
                steakIC: address(steakIC),
                fomoIC: address(fomoIC),
                steakLpProvider: address(dexProviders[0]),
                dexProvider: launchConfig.dexProvider,
                memberNFT: address(memberNFT),
                fomoUsdcLp: address(fomoUsdcLp),
                usdc: USDC,
                fomo: FOMO,
                owner: owner()
            })
        );
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
}
