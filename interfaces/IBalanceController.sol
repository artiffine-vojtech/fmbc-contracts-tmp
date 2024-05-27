// SPDX-License-Identifier: MIT

pragma solidity 0.8.23;

interface IBalanceController {
    struct Balances {
        // Staked tokens of the user.
        uint staked;
        // Staked tokens muplitplied by NFT multiplier.
        uint scaled;
        // Staked NFT token id.
        uint nftId;
        // If position is boosted.
        bool boosted;
    }

    function balances(address _account) external view returns (Balances memory);
}
