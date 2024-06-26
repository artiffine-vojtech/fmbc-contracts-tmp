/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  IMEMEVesting,
  IMEMEVestingInterface,
} from "../../../../contracts/launchpad/interfaces/IMEMEVesting";

const _abi = [
  {
    inputs: [],
    name: "AmountExceedsAllocation",
    type: "error",
  },
  {
    inputs: [],
    name: "AmountTooSmall",
    type: "error",
  },
  {
    inputs: [],
    name: "ArgumentIsAddressZero",
    type: "error",
  },
  {
    inputs: [],
    name: "ArgumentIsZero",
    type: "error",
  },
  {
    inputs: [],
    name: "IncorrectEtherValueSent",
    type: "error",
  },
  {
    inputs: [],
    name: "TgeTimestampInPast",
    type: "error",
  },
  {
    inputs: [],
    name: "TokensNotUnlocked",
    type: "error",
  },
  {
    inputs: [],
    name: "WrongTokenIdOwner",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_buyer",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "positionIndex",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "amount_",
        type: "uint256",
      },
    ],
    name: "TokensClaimed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_buyer",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "positionIndex",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "amount_",
        type: "uint256",
      },
    ],
    name: "TokensVested",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_positionIndex",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_timestamp",
        type: "uint256",
      },
    ],
    name: "availableToClaim",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_account",
        type: "address",
      },
    ],
    name: "cancelVesting",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "_positionIndexes",
        type: "uint256[]",
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
        internalType: "address",
        name: "_account",
        type: "address",
      },
    ],
    name: "getVestingPositions",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "amountClaimed",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "startTimestamp",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "cancelled",
            type: "bool",
          },
        ],
        internalType: "struct IMEMEVesting.VestingPosition[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_positionIndex",
        type: "uint256",
      },
    ],
    name: "getVestingSchedule",
    outputs: [
      {
        internalType: "uint256[7]",
        name: "timestamps",
        type: "uint256[7]",
      },
      {
        internalType: "uint256[7]",
        name: "amounts",
        type: "uint256[7]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
    ],
    name: "vestTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export class IMEMEVesting__factory {
  static readonly abi = _abi;
  static createInterface(): IMEMEVestingInterface {
    return new utils.Interface(_abi) as IMEMEVestingInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IMEMEVesting {
    return new Contract(address, _abi, signerOrProvider) as IMEMEVesting;
  }
}
