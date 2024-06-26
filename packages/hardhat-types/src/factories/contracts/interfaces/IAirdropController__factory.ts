/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  IAirdropController,
  IAirdropControllerInterface,
} from "../../../contracts/interfaces/IAirdropController";

const _abi = [
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
    name: "VerificationFailed",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_identity",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "TokensClaimed",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "identity",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "claim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export class IAirdropController__factory {
  static readonly abi = _abi;
  static createInterface(): IAirdropControllerInterface {
    return new utils.Interface(_abi) as IAirdropControllerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IAirdropController {
    return new Contract(address, _abi, signerOrProvider) as IAirdropController;
  }
}
