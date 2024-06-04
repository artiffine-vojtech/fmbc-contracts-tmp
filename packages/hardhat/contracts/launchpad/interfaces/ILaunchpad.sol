// SPDX-License-Identifier: MIT

pragma solidity 0.8.23;

import './ILaunchCommon.sol';

/// @title ILaunchpad
/// @notice Interface for meme-token launchpad.
interface ILaunchpad is ILaunchCommon {
    /**
     * @notice Create a new launch.
     * @param _config Launch configuration
     * @param _staked If Steak LP should be taken out from controller
     * @param _data KYC data
     */
    function createLaunch(LaunchConfigVars memory _config, bool _staked, bytes calldata _data) external;

    /**
     * @notice Pledge Steak LP to a token launch proposal
     * @notice If launch failes (soft cap not reached until deadline), user can get funds back
     * @param _launchId Launch id (array index)
     * @param _amount Amount of Steak LP to pledge
     * @param _staked If Steak LP should be taken out from controller
     * @param _data KYC data
     */
    function pledge(uint256 _launchId, uint256 _amount, bool _staked, bytes calldata _data) external;

    /**
     * @notice Pledge Steak LP to a token launch proposal using Fomo Bull Club Member NFT
     * @notice If launch failes (soft cap not reached until deadline), user can get funds back
     * @notice Each NFT has it's own limit of Steak LP that can be pledged.
     * @param _launchId Launch id (array index)
     * @param _amount Amount of Steak LP to pledge
     * @param _staked If Steak LP should be taken out from controller
     * @param _nftId NFT token id
     * @param _controllerWithNFT Address of the controller with staked NFT (or address zero)
     * @param _data KYC data
     */
    function pledgeWithNFT(
        uint256 _launchId,
        uint256 _amount,
        bool _staked,
        uint256 _nftId,
        address _controllerWithNFT,
        bytes calldata _data
    ) external;

    /**
     * @notice Get steak LP back from a failed token launch proposal
     * @param _launchId Launch id (array index)
     * @param _stake If Steak LP should be deposited in the controller (on behalf of user)
     */
    function getFundsBack(uint256 _launchId, bool _stake) external;

    /**
     * @notice Launch a token.
     * 0 - Create MEME ERC20 token
     * 1 - Break pledged Steak LP into USDC and FOMO
     * 2 - Create MEME-USDC LP and send it to dEaD address
     * 3 - Create MEME-FOMO LP and send it to dEaD address
     * 4 - Create incentives controllers with MEME rewards
     * 5 - Add MEME rewards to Steak LP controller
     * 6 - Create vesting MEME positions for KOL pledgers
     * 7 - Create vesting MEME position for MEM token team
     * 8 - Send MEME allocation to the platform owner
     * 9 - Send MEME allocation to X address (if set)
     * @param _launchId Launch id (array index)
     */
    function launch(uint256 _launchId) external;

    /**
     * @notice Claim tokens from a successful token launch proposal
     * @param _launchId Launch id (array index)
     */
    function claimTokens(uint256 _launchId) external;

    /***** OWNER FUNCTIONS *****/

    /**
     * @notice Set KOL addresses
     * @dev onlyOwner
     * @param _kolAddresses Array of KOL addressess
     * @param _isKol Array of boolean values indicating if address is KOL
     */
    function setKolAddresses(address[] memory _kolAddresses, bool[] memory _isKol) external;

    /**
     * @notice Set the soft cap and launch fees
     * @dev onlyOwner
     * @param _softCap The soft cap amount in DOLLAR VALUE (1000 = 1000 USDC)
     * @param _launchFee The launch fee amount
     */
    function setSoftCapAndFees(uint256 _softCap, uint256 _launchFee) external;

    /**
     * @notice Set the minimum and maximum pledge limits
     * @notice KOLs have 5x higher max limit, and 10x higher min limit
     * @dev onlyOwner
     * @param _min The minimum pledge limit in DOLLAR VALUE (1000 = 1000 USDC)
     * @param _max The maximum pledge limit in DOLLAR VALUE (1000 = 1000 USDC)
     */
    function setPledgeLimits(uint256 _min, uint256 _max) external;

    /**
     * @notice Set the platform fee for Steak LP
     * @dev onlyOwner
     * @param _fee The platform fee amount
     */
    function setSteakPlatformFee(uint256 _fee) external;

    /**
     * @notice Set the platform fee for MEME token
     * @dev onlyOwner
     * @param _fee The platform fee amount
     */
    function setMemePlatformFee(uint256 _fee) external;

    /**
     * @notice Set the controller factory address
     * @dev onlyOwner
     * @param _controllerFactory Address of the controller factory
     */
    function setControllerFactory(address _controllerFactory) external;

    /**
     * @notice Set the Steak LP incentives controller address
     * @dev onlyOwner
     * @param _steakIC Address of the Steak LP incentives controller
     */
    function setSteakIC(address _steakIC) external;

    /**
     * @notice Set the FOMO LP incentives controller address
     * @dev onlyOwner
     * @param _fomoIC Address of the FOMO LP incentives controller
     */
    function setFomoIC(address _fomoIC) external;

    /**
     * @notice Add DEX provider to list of available providers
     * @dev onlyOwner
     * @param _dexProvider Dex provider address
     */
    function addDexProvider(address _dexProvider) external;
}
