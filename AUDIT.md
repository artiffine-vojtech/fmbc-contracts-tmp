# Cyberscope audit fixes

## ITAT - Improper Token Allocation Tracking

Fix commit: `d690acdf7bb0249c27b80ef8330cccb5e07ad75e`

## PIB - Potential Incorrect Burning

Note: This function first withdraws proxy tokens from IncentivesController, so they are sent from controller to the ProxyToken contract, then it burns them, and transfers equivalent amount of deposited tokens back to msg.sender. It works as intended.

## PIM - Potential Incorrect Minting

Fix commit: `275fc2eff8f50122362fd81296f7b444c593dcea`
Note: This function mints and deposits tokens into IncentivesController. It works as intended.

## PPI - Potential Precision Issue

Note: The boundary check already exists, when the last monthly unlock tiem is passed, it sets `amountUnlocked` to `vestingPosition.amount` at line 102.

## IID - Improper Interface Declaration

Fix commit: `c9c3d48d3f8007d817a5bb632fa6b67a35c3f0bc`

## APW - Admin Privileged Withdrawals

Note: withdrawingAdmin is supposed to be either TokenProxy contract or Launchpad contract, it's settable only once, and it's address can be inspected before interacting with the contracts.

## APIT - Allocation Parameter Inefficient Type

Fix commit: `1a42a4f8aa5db1ae3706ad10ccab914b2edb1482`

## CCR - Contract Centralization Risk

Note: For launchpad, most parameters settable by the owner, are saved locally in the LaunchConfig for each token launch, so changing these parameters affects only future token launches. For vesting owner has right to cancel KOL vesting positions, and for staking only owner can control who can add additional rewards. Owner account will be secured properly.

## DAU - Direct Address Usage

Fix commit: `a8dcc5f018ca2d1b80ae554d15c99b5230526654`

## HD - Hardcoded Decimals

Fix commit: `ee886c5cefd3c8fbc6e98e9538a1c447a729006d`
Note: We kept initial values with hardcoded decimals, but future changes use token decimals now.

## IDH - Improper dexIndex Handling

Fix commit: `a2c4e91fd347586bb33a0d44ae0303524e4b12ed`

## MEM - Misleading Error Messages

Note: We ackowledge. 

## MEE - Missing Events Emission

Fix commit: `4c34ecab0acc7f39216def5eaa02b9e6f1c64104`
Note: Added event to Launchpad contract. We acknowledge the rest.

## MSC - Missing Sanity Check

Note: We ackowledge. 

## PEVE - Potential Early Vesting Exit

Note: We acknowledge. It works as intended, parties with vesting tokens know in advance of cancellation possibility.

## PIAA - Potential Invalid Array Access

Fix commit: `32b2d05415aee7686e45701bc61194a4f0ef478d`
Note: We acknowledge that, owner can call function again with just one address to set in case any mismatch happens.

## PRAV - Potential Replay Attack Vector

Note: We acknowledge, 24h window serves the purpose of implemented verification scheme, especially that signatures are tied to the address.

## RSML - Redundant SafeMath Library

Note: We acknowledge.

## USEA - Unrestricted Start Emissions Access

Note: startEmission() is called in atomic transaction during launch() function of the Launchpad. It works as intended.

## L04 - Conformance to Solidity Naming Conventions

Note: We acknowledge.

## L07 - Missing Events Arithmetic

Note: We acknowledge.

## L13 - Divide before Multiply Operation

Note: We acknowledge.

## L16 - Validate Variable Setters

Note: We acknowledge.

## L18 - Multiple Pragma Directives

Fix commit: `7113172249643463d9201fcfd9795416d1737aff`





