/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  IPreCrime,
  IPreCrimeInterface,
} from "../../../../../../@layerzerolabs/lz-evm-oapp-v2/contracts/precrime/interfaces/IPreCrime";

const _abi = [
  {
    inputs: [
      {
        internalType: "bytes",
        name: "crime",
        type: "bytes",
      },
    ],
    name: "CrimeFound",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint32",
        name: "eid",
        type: "uint32",
      },
      {
        internalType: "bytes",
        name: "reason",
        type: "bytes",
      },
    ],
    name: "InvalidSimulationResult",
    type: "error",
  },
  {
    inputs: [],
    name: "OnlyOffChain",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "max",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "actual",
        type: "uint256",
      },
    ],
    name: "PacketOversize",
    type: "error",
  },
  {
    inputs: [],
    name: "PacketUnsorted",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "reason",
        type: "bytes",
      },
    ],
    name: "SimulationFailed",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint32",
        name: "eid",
        type: "uint32",
      },
    ],
    name: "SimulationResultNotFound",
    type: "error",
  },
  {
    inputs: [],
    name: "buildSimulationResult",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes[]",
        name: "_packets",
        type: "bytes[]",
      },
      {
        internalType: "uint256[]",
        name: "_packetMsgValues",
        type: "uint256[]",
      },
    ],
    name: "getConfig",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes[]",
        name: "_packets",
        type: "bytes[]",
      },
      {
        internalType: "uint256[]",
        name: "_packetMsgValues",
        type: "uint256[]",
      },
      {
        internalType: "bytes[]",
        name: "_simulations",
        type: "bytes[]",
      },
    ],
    name: "preCrime",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes[]",
        name: "_packets",
        type: "bytes[]",
      },
      {
        internalType: "uint256[]",
        name: "_packetMsgValues",
        type: "uint256[]",
      },
    ],
    name: "simulate",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "version",
    outputs: [
      {
        internalType: "uint64",
        name: "major",
        type: "uint64",
      },
      {
        internalType: "uint8",
        name: "minor",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export class IPreCrime__factory {
  static readonly abi = _abi;
  static createInterface(): IPreCrimeInterface {
    return new utils.Interface(_abi) as IPreCrimeInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IPreCrime {
    return new Contract(address, _abi, signerOrProvider) as IPreCrime;
  }
}
