// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import '@openzeppelin/contracts/utils/math/SafeMath.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import './interfaces/ITokenProxy.sol';
import './interfaces/ITokenIncentivesController.sol';

/// @title IncentivesController
/// @notice Staking contract with multiple token rewards.
contract TokenProxy is ERC20, Ownable, ITokenProxy {
    using SafeERC20 for IERC20;
    ITokenIncentivesController public controller;
    IERC20 public immutable fomo;

    constructor(string memory _name, string memory _symbol, address _token) ERC20(_name, _symbol) {
        fomo = IERC20(_token);
    }

    function deposit(uint _amount, address _onBehalfOf) external {
        fomo.safeTransferFrom(msg.sender, address(this), _amount);
        _mint(address(controller), _amount);
        controller.deposit(_amount, _onBehalfOf);
    }

    function withdraw(uint _amount) external {
        controller.withdraw(_amount, msg.sender);
        _burn(address(this), _amount);
        fomo.safeTransfer(msg.sender, _amount);
    }

    function addController(address _controller) external onlyOwner {
        require(address(controller) == address(0), 'Already initialized');
        controller = ITokenIncentivesController(_controller);
    }
}
