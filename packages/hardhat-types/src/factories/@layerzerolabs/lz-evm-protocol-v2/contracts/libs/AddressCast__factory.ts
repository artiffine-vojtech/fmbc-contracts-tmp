/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../../common";
import type {
  AddressCast,
  AddressCastInterface,
} from "../../../../../@layerzerolabs/lz-evm-protocol-v2/contracts/libs/AddressCast";

const _abi = [
  {
    inputs: [],
    name: "AddressCast_InvalidAddress",
    type: "error",
  },
  {
    inputs: [],
    name: "AddressCast_InvalidSizeForAddress",
    type: "error",
  },
] as const;

const _bytecode =
  "0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea2646970667358221220f5f84b1ab037c4d4d9e04e70ee1871ca5840c3e5613002d5dac2c603f39ee4b564736f6c63430008170033";

type AddressCastConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: AddressCastConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class AddressCast__factory extends ContractFactory {
  constructor(...args: AddressCastConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<AddressCast> {
    return super.deploy(overrides || {}) as Promise<AddressCast>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): AddressCast {
    return super.attach(address) as AddressCast;
  }
  override connect(signer: Signer): AddressCast__factory {
    return super.connect(signer) as AddressCast__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): AddressCastInterface {
    return new utils.Interface(_abi) as AddressCastInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): AddressCast {
    return new Contract(address, _abi, signerOrProvider) as AddressCast;
  }
}
