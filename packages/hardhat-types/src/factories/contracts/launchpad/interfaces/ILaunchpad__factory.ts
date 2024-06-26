/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  ILaunchpad,
  ILaunchpadInterface,
} from "../../../../contracts/launchpad/interfaces/ILaunchpad";

const _abi = [
  {
    inputs: [],
    name: "AlreadyClaimed",
    type: "error",
  },
  {
    inputs: [],
    name: "AlreadyLaunched",
    type: "error",
  },
  {
    inputs: [],
    name: "ArraysLengthMismatch",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidAllocations",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidDexIndex",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidHardCap",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidRewardsAllocations",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidRounds",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidSteakTeamFee",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidTotalSupply",
    type: "error",
  },
  {
    inputs: [],
    name: "LaunchFailed",
    type: "error",
  },
  {
    inputs: [],
    name: "LaunchIsNotFailed",
    type: "error",
  },
  {
    inputs: [],
    name: "LaunchIsNotLaunched",
    type: "error",
  },
  {
    inputs: [],
    name: "LaunchIsNotPending",
    type: "error",
  },
  {
    inputs: [],
    name: "LiquidityAllocationIsZero",
    type: "error",
  },
  {
    inputs: [],
    name: "MinPledgeNotReached",
    type: "error",
  },
  {
    inputs: [],
    name: "PledgeLimitReached",
    type: "error",
  },
  {
    inputs: [],
    name: "TeamIsAddressZero",
    type: "error",
  },
  {
    inputs: [],
    name: "UserIsKOL",
    type: "error",
  },
  {
    inputs: [],
    name: "UserIsNotKOL",
    type: "error",
  },
  {
    inputs: [],
    name: "UserNotNFTOwner",
    type: "error",
  },
  {
    inputs: [],
    name: "UserSaleNotStarted",
    type: "error",
  },
  {
    inputs: [],
    name: "VerificationFailed",
    type: "error",
  },
  {
    inputs: [],
    name: "XIsAddressZero",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "factory",
        type: "address",
      },
    ],
    name: "ControllerFactorySet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "provider",
        type: "address",
      },
    ],
    name: "DexProviderAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "ic",
        type: "address",
      },
    ],
    name: "FomoICSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "launchId",
        type: "uint256",
      },
    ],
    name: "HardCapReached",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        indexed: true,
        internalType: "string",
        name: "symbol",
        type: "string",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "launchId",
        type: "uint256",
      },
    ],
    name: "LaunchCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "launchId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amountLP",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amountUsdc",
        type: "uint256",
      },
    ],
    name: "Pledged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "launchId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amountLP",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amountUsdc",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "nftId",
        type: "uint256",
      },
    ],
    name: "PledgedWithNFT",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "ic",
        type: "address",
      },
    ],
    name: "SteakICSet",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_dexProvider",
        type: "address",
      },
    ],
    name: "addDexProvider",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_launchId",
        type: "uint256",
      },
    ],
    name: "claimTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "symbol",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "totalSupply",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "hardCap",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "team",
            type: "address",
          },
          {
            internalType: "address",
            name: "x",
            type: "address",
          },
          {
            internalType: "uint16[6]",
            name: "allocations",
            type: "uint16[6]",
          },
          {
            internalType: "uint16[5]",
            name: "rewardsAllocations",
            type: "uint16[5]",
          },
          {
            internalType: "uint256[3]",
            name: "rounds",
            type: "uint256[3]",
          },
          {
            internalType: "uint256",
            name: "dexIndex",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "steakTeamFee",
            type: "uint256",
          },
        ],
        internalType: "struct ILaunchCommon.LaunchConfigVars",
        name: "_config",
        type: "tuple",
      },
      {
        internalType: "bool",
        name: "_staked",
        type: "bool",
      },
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
    ],
    name: "createLaunch",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_launchId",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "_stake",
        type: "bool",
      },
    ],
    name: "getFundsBack",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_launchId",
        type: "uint256",
      },
    ],
    name: "launch",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_launchId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "_staked",
        type: "bool",
      },
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
    ],
    name: "pledge",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_launchId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "_staked",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "_nftId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_controllerWithNFT",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
    ],
    name: "pledgeWithNFT",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_controllerFactory",
        type: "address",
      },
    ],
    name: "setControllerFactory",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_fomoIC",
        type: "address",
      },
    ],
    name: "setFomoIC",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "_kolAddresses",
        type: "address[]",
      },
      {
        internalType: "bool[]",
        name: "_isKol",
        type: "bool[]",
      },
    ],
    name: "setKolAddresses",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint16",
        name: "_fee",
        type: "uint16",
      },
    ],
    name: "setMemePlatformFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_min",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_max",
        type: "uint256",
      },
    ],
    name: "setPledgeLimits",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_min",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_max",
        type: "uint256",
      },
    ],
    name: "setPledgeLimitsForKOLs",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_softCap",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_launchFee",
        type: "uint256",
      },
    ],
    name: "setSoftCapAndFees",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_steakIC",
        type: "address",
      },
    ],
    name: "setSteakIC",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint16",
        name: "_fee",
        type: "uint16",
      },
    ],
    name: "setSteakPlatformFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export class ILaunchpad__factory {
  static readonly abi = _abi;
  static createInterface(): ILaunchpadInterface {
    return new utils.Interface(_abi) as ILaunchpadInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ILaunchpad {
    return new Contract(address, _abi, signerOrProvider) as ILaunchpad;
  }
}
