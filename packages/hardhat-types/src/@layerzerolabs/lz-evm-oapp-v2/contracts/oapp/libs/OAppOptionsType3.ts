/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../../../../common";

export type EnforcedOptionParamStruct = {
  eid: PromiseOrValue<BigNumberish>;
  msgType: PromiseOrValue<BigNumberish>;
  options: PromiseOrValue<BytesLike>;
};

export type EnforcedOptionParamStructOutput = [number, number, string] & {
  eid: number;
  msgType: number;
  options: string;
};

export interface OAppOptionsType3Interface extends utils.Interface {
  functions: {
    "combineOptions(uint32,uint16,bytes)": FunctionFragment;
    "enforcedOptions(uint32,uint16)": FunctionFragment;
    "owner()": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "setEnforcedOptions((uint32,uint16,bytes)[])": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "combineOptions"
      | "enforcedOptions"
      | "owner"
      | "renounceOwnership"
      | "setEnforcedOptions"
      | "transferOwnership"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "combineOptions",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BytesLike>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "enforcedOptions",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setEnforcedOptions",
    values: [EnforcedOptionParamStruct[]]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [PromiseOrValue<string>]
  ): string;

  decodeFunctionResult(
    functionFragment: "combineOptions",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "enforcedOptions",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setEnforcedOptions",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;

  events: {
    "EnforcedOptionSet(tuple[])": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "EnforcedOptionSet"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
}

export interface EnforcedOptionSetEventObject {
  _enforcedOptions: EnforcedOptionParamStructOutput[];
}
export type EnforcedOptionSetEvent = TypedEvent<
  [EnforcedOptionParamStructOutput[]],
  EnforcedOptionSetEventObject
>;

export type EnforcedOptionSetEventFilter =
  TypedEventFilter<EnforcedOptionSetEvent>;

export interface OwnershipTransferredEventObject {
  previousOwner: string;
  newOwner: string;
}
export type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  OwnershipTransferredEventObject
>;

export type OwnershipTransferredEventFilter =
  TypedEventFilter<OwnershipTransferredEvent>;

export interface OAppOptionsType3 extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: OAppOptionsType3Interface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    combineOptions(
      _eid: PromiseOrValue<BigNumberish>,
      _msgType: PromiseOrValue<BigNumberish>,
      _extraOptions: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    enforcedOptions(
      eid: PromiseOrValue<BigNumberish>,
      msgType: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[string] & { enforcedOption: string }>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setEnforcedOptions(
      _enforcedOptions: EnforcedOptionParamStruct[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  combineOptions(
    _eid: PromiseOrValue<BigNumberish>,
    _msgType: PromiseOrValue<BigNumberish>,
    _extraOptions: PromiseOrValue<BytesLike>,
    overrides?: CallOverrides
  ): Promise<string>;

  enforcedOptions(
    eid: PromiseOrValue<BigNumberish>,
    msgType: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<string>;

  owner(overrides?: CallOverrides): Promise<string>;

  renounceOwnership(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setEnforcedOptions(
    _enforcedOptions: EnforcedOptionParamStruct[],
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    combineOptions(
      _eid: PromiseOrValue<BigNumberish>,
      _msgType: PromiseOrValue<BigNumberish>,
      _extraOptions: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<string>;

    enforcedOptions(
      eid: PromiseOrValue<BigNumberish>,
      msgType: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<string>;

    owner(overrides?: CallOverrides): Promise<string>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    setEnforcedOptions(
      _enforcedOptions: EnforcedOptionParamStruct[],
      overrides?: CallOverrides
    ): Promise<void>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "EnforcedOptionSet(tuple[])"(
      _enforcedOptions?: null
    ): EnforcedOptionSetEventFilter;
    EnforcedOptionSet(_enforcedOptions?: null): EnforcedOptionSetEventFilter;

    "OwnershipTransferred(address,address)"(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null
    ): OwnershipTransferredEventFilter;
  };

  estimateGas: {
    combineOptions(
      _eid: PromiseOrValue<BigNumberish>,
      _msgType: PromiseOrValue<BigNumberish>,
      _extraOptions: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    enforcedOptions(
      eid: PromiseOrValue<BigNumberish>,
      msgType: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setEnforcedOptions(
      _enforcedOptions: EnforcedOptionParamStruct[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    combineOptions(
      _eid: PromiseOrValue<BigNumberish>,
      _msgType: PromiseOrValue<BigNumberish>,
      _extraOptions: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    enforcedOptions(
      eid: PromiseOrValue<BigNumberish>,
      msgType: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setEnforcedOptions(
      _enforcedOptions: EnforcedOptionParamStruct[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}