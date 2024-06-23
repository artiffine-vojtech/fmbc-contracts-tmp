# Cyberscope audit fixes

## PPI - Potential Precision Issue

Fix commit: `2ef4d208466945109f64294427fbc107f41f9af0`

## APW - Admin Privileged Withdrawals

Note: withdrawingAdmin is supposed to be either TokenProxy contract or Launchpad contract, it's settable only once, and it's address can be inspected before interacting with the contracts.

## CCR - Contract Centralization Risk

Note: For launchpad, most parameters settable by the owner, are saved locally in the LaunchConfig for each token launch, so changing these parameters affects only future token launches. For vesting contract owner has right to cancel KOL vesting positions (which is known to KOLs), and for staking contract only owner can control who can add additional rewards. Owner account will be secured properly.

## DPI - Decimals Precision Inconsistency

Fix commit: `71709049368b231e179d694b002c109d2a2637c3`

## DAU - Direct Address Usage

Fix commit: `d76b9fc5a60c522cb7413a3ef0e15be39d8d4750`

## MEM - Misleading Error Messages

Note: We ackowledge. 

## MEE - Missing Events Emission

Fix commit: `4c34ecab0acc7f39216def5eaa02b9e6f1c64104`
Note: Added event to Launchpad contract. We acknowledge the rest.

## MSC - Missing Sanity Check

Note: We ackowledge. 

## PEVE - Potential Early Vesting Exit

Note: We acknowledge. It works as intended, parties with vesting tokens know in advance of cancellation possibility.

## PRAV - Potential Replay Attack Vector

Note: We acknowledge, 24h window serves the purpose of implemented verification scheme, especially that signature is tied to the specific address, and it can be reused, even on different blockchains.

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



