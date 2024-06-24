// SPDX-License-Identifier: MIT

pragma solidity ^0.8.22;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol';
import './utils/Adminable.sol';
import './interfaces/INFTWithLevel.sol';
import './ERC721BatchEnumerable.sol';

/**
 * @title FomoBullClub NFT contract.
 */
contract FomoBullClubNFT is ERC721, Adminable, ERC721Royalty, INFTWithLevel {
    /// @dev URI to contract-level metadata.
    string private contractUri;
    /// @dev URI to token-level metadata.
    string private baseUri;

    /// @dev Whether sale is active.
    bool public isSaleActive = false;

    /**
     * @notice Tier stores information about one token level.
     *
     * @param price Price of the NFT.
     * @param totalSupply Number of NFTs already minted.
     * @param maxSupply Maximum number of NFTs that can be minted.
     * @param startingIndex Starting index of the level.
     */
    struct Tier {
        uint256 price;
        uint256 totalSupply;
        uint256 maxSupply;
        uint256 startingIndex;
    }

    uint256 public constant NO_TIERS = 5;
    Tier[NO_TIERS] public tiers;

    error MintIsClosed();
    error TokenIdDoesNotExist(uint256 tokenId);
    error MintingSupplyOfLevelExceeded();
    error EtherValueSentNotExact();
    error ArgumentIsAddressZero();
    error ContractBalanceIsZero();
    error TransferFailed();
    error ZeroTokensToMint();
    error TierDoesNotExist();

    /**
     * @param _name Name of the collection.
     * @param _symbol Symbol of the collection.
     * @param _baseUri URI of the collection metadata folder.
     * @param _contractUri URI of contract-metadata json.
     */
    constructor(
        string memory _name,
        string memory _symbol,
        string memory _baseUri,
        string memory _contractUri
    ) ERC721(_name, _symbol) {
        baseUri = _baseUri;
        contractUri = _contractUri;
        tiers[0] = Tier({price: 0.0000000625 ether, totalSupply: 0, maxSupply: 100, startingIndex: 0});
        tiers[1] = Tier({price: 0.00000005 ether, totalSupply: 0, maxSupply: 500, startingIndex: 100});
        tiers[2] = Tier({price: 0.0000000375 ether, totalSupply: 0, maxSupply: 1000, startingIndex: 600});
        tiers[3] = Tier({price: 0.000000025 ether, totalSupply: 0, maxSupply: 2500, startingIndex: 1600});
        tiers[4] = Tier({price: 0.000000019 ether, totalSupply: 0, maxSupply: 5000, startingIndex: 4100});
    }

    /**
     * @dev Adds support for `ERC721Royalty` interface.
     *
     * @param interfaceId Interface id.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ERC721Royalty, IERC165) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    /**
     * @dev Adds support for `ERC721Royalty` interface.
     *
     * @param tokenId Token id.
     */
    function _burn(uint256 tokenId) internal virtual override(ERC721, ERC721Royalty) {
        super._burn(tokenId);
    }

    /**
     * @dev Base URI for computing {tokenURI}. If set, the resulting URI for each
     * token will be the concatenation of the `baseURI` and the `tokenId`. Empty
     * by default, can be overridden in child contracts.
     */
    function _baseURI() internal view virtual override returns (string memory) {
        return baseUri;
    }

    /* External Functions */

    /**
     * @notice Mints token by paying exact price in ETH.
     *
     * @dev Token id needs to be lesser than `maxSupply()`.
     *
     * @param _tokens Array of tiers.length values, each corresponding to an amount of tokens
     * to mint at the level of an array index of that value.
     * @param _to Address to mint tokens to.
     */
    function mint(uint256[NO_TIERS] calldata _tokens, address _to) external payable {
        if (!isSaleActive) revert MintIsClosed();
        if (_to == address(0)) revert ArgumentIsAddressZero();

        uint256 totalPrice = 0;
        uint256 numberOfTokens = 0;
        for (uint256 i = 0; i < NO_TIERS; i++) {
            totalPrice += tiers[i].price * _tokens[i];
            numberOfTokens += _tokens[i];
        }

        if (numberOfTokens == 0) revert ZeroTokensToMint();
        if (msg.value != totalPrice) revert EtherValueSentNotExact();

        _mintTokens(_tokens, _to);
    }

    /**
     * @notice Returns URI of contract-level metadata.
     */
    function contractURI() external view returns (string memory) {
        return contractUri;
    }

    /**
     * @notice Returns total minted supply.
     */
    function totalSupply() external view returns (uint256) {
        uint256 _totalSupply = 0;
        for (uint256 i = 0; i < NO_TIERS; i++) {
            _totalSupply += tiers[i].totalSupply;
        }
        return _totalSupply;
    }

    /**
     * @notice Returns level of the specified token.
     *
     * @param _tokenId Token id.
     *
     * @return level_ Level of the token.
     */
    function getLevelOfTokenById(uint256 _tokenId) public view returns (uint256 level_) {
        _requireMinted(_tokenId);

        for (uint256 i = 0; i < NO_TIERS; i++) {
            Tier memory tier = tiers[i];
            if (_tokenId >= tier.startingIndex && _tokenId < tier.startingIndex + tier.maxSupply) {
                return i;
            }
        }

        revert TokenIdDoesNotExist(_tokenId);
    }

    /* Admin Functions */

    /**
     * @notice Mints token for free, only callable by an admin/owner.
     *
     * @dev Token id needs to be lesser than `maxSupply()`.
     *
     * @param _tokens Array of tiers.length values, each corresponding to an amount of tokens
     * to mint at the level of an array index of that value.
     * @param _to Address to mint tokens to.
     */
    function freeMint(uint256[NO_TIERS] calldata _tokens, address _to) external onlyAdmin {
        if (_to == address(0)) revert ArgumentIsAddressZero();

        uint256 numberOfTokens = 0;
        for (uint256 i = 0; i < NO_TIERS; i++) {
            numberOfTokens += _tokens[i];
        }

        if (numberOfTokens == 0) revert ZeroTokensToMint();
        _mintTokens(_tokens, _to);
    }

    /**
     * @notice Mints multiple tokens for free, only callable by an admin/owner.
     *
     * @dev Token id needs to be lesser than `maxSupply()`.
     *
     * @param _tokens Array of tiers.length values, each corresponding to an amount of tokens
     * to mint at the level of an array index of that value.
     * @param _to Array of addresses to mint tokens to. Each wallet will receive all the tokens defined in _tokens.
     */
    function freeMintBatch(uint256[NO_TIERS] calldata _tokens, address[] calldata _to) external onlyAdmin {
        uint256 numberOfTokens = 0;
        for (uint256 i = 0; i < NO_TIERS; i++) {
            numberOfTokens += _tokens[i];
        }
        if (numberOfTokens == 0) revert ZeroTokensToMint();

        for (uint256 i = 0; i < _to.length; i++) {
            address to = _to[i];
            if (to == address(0)) revert ArgumentIsAddressZero();
            _mintTokens(_tokens, to);
        }
    }

    /**
     * @notice Sets URI of contract-level metadata.
     *
     * @param _URI URI of contract-level metadata.
     */
    function setContractURI(string calldata _URI) external onlyAdmin {
        contractUri = _URI;
    }

    /**
     * @notice Sets URI metadata for a given token id.
     *
     * @param _baseUri Token id.
     */
    function setBaseURI(string calldata _baseUri) external onlyAdmin {
        baseUri = _baseUri;
    }

    /**
     * @notice Sets price per tier.
     *
     * @param _tierId Token id.
     * @param _newPrice New price.
     */
    function setPricePerTier(uint256 _tierId, uint256 _newPrice) external onlyAdmin {
        if (_tierId >= NO_TIERS) revert TierDoesNotExist();
        tiers[_tierId].price = _newPrice;
    }

    /**
     * @notice Sets if sale is active.
     *
     * @param _isActive Whether sale is active.
     */
    function setIsSaleActive(bool _isActive) public onlyAdmin {
        isSaleActive = _isActive;
    }

    /**
     * @notice Sets Royalty info for the collection.
     *
     * @param _recipient Address to receive royalty.
     * @param _fraction Fraction of royalty.
     */
    function setDefaultRoyalty(address _recipient, uint96 _fraction) external onlyAdmin {
        _setDefaultRoyalty(_recipient, _fraction);
    }

    /* Owner Functions */

    /**
     * @notice Transfers all native currency to the owner, callable only by the owner.
     */
    function withdrawAll() external onlyOwner {
        uint256 balance = address(this).balance;
        if (balance == 0) revert ContractBalanceIsZero();
        (bool success, ) = msg.sender.call{value: balance}('');
        if (!success) revert TransferFailed();
    }

    /**
     * @notice Recovers ERC20 token back to the owner, callable only by the owner.
     *
     * @param _token IERC20 token address to recover.
     */
    function recoverToken(IERC20 _token) external onlyOwner {
        if (address(_token) == address(0)) revert ArgumentIsAddressZero();
        uint256 balance = _token.balanceOf(address(this));
        if (balance == 0) revert ContractBalanceIsZero();
        _token.transfer(owner(), balance);
    }

    /* Internal Functions */

    /**
     * @dev Mints tokens and asserts that max supply was not breached.
     * Contracts calling mint function should implement IERC721Receiver interface.
     */
    function _mintTokens(uint256[NO_TIERS] memory _tokens, address _to) internal {
        for (uint256 i = 0; i < NO_TIERS; i++) {
            Tier storage tier = tiers[i];
            uint256 mintedPerLevel = tier.totalSupply;
            uint256 maxSupplyPerLevel = tier.maxSupply;
            if (mintedPerLevel + _tokens[i] > maxSupplyPerLevel) revert MintingSupplyOfLevelExceeded();

            tier.totalSupply += _tokens[i];
            for (uint256 j = 0; j < _tokens[i]; j++) {
                uint256 nextTokenId = tier.startingIndex + mintedPerLevel + j;
                _safeMint(_to, nextTokenId);
            }
            assert(tier.totalSupply <= tier.maxSupply);
        }
    }
}
