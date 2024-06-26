/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  IBalancerFactory,
  IBalancerFactoryInterface,
} from "../../../../../contracts/launchpad/interfaces/balancer/IBalancerFactory";

const _abi = [
  {
    anonymous: false,
    inputs: [],
    name: "PoolCreate",
    type: "event",
  },
  {
    inputs: [
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
        internalType: "contract IERC20[]",
        name: "tokens",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "normalizedWeights",
        type: "uint256[]",
      },
      {
        internalType: "address[]",
        name: "rateProviders",
        type: "address[]",
      },
      {
        internalType: "uint256",
        name: "swapFeePercentage",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "salt",
        type: "bytes32",
      },
    ],
    name: "create",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export class IBalancerFactory__factory {
  static readonly abi = _abi;
  static createInterface(): IBalancerFactoryInterface {
    return new utils.Interface(_abi) as IBalancerFactoryInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IBalancerFactory {
    return new Contract(address, _abi, signerOrProvider) as IBalancerFactory;
  }
}
