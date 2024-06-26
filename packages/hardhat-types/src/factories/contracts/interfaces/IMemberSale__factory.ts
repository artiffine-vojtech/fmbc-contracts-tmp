/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  IMemberSale,
  IMemberSaleInterface,
} from "../../../contracts/interfaces/IMemberSale";

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
        name: "tokenId_",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "amount_",
        type: "uint256",
      },
    ],
    name: "TokensBought",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
    ],
    name: "buy",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
    ],
    name: "getAvailableAmount",
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
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "getPrice",
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
] as const;

export class IMemberSale__factory {
  static readonly abi = _abi;
  static createInterface(): IMemberSaleInterface {
    return new utils.Interface(_abi) as IMemberSaleInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IMemberSale {
    return new Contract(address, _abi, signerOrProvider) as IMemberSale;
  }
}
