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

export interface IOAppCoreInterface extends utils.Interface {
  functions: {
    "endpoint()": FunctionFragment;
    "oAppVersion()": FunctionFragment;
    "peers(uint32)": FunctionFragment;
    "setDelegate(address)": FunctionFragment;
    "setPeer(uint32,bytes32)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "endpoint"
      | "oAppVersion"
      | "peers"
      | "setDelegate"
      | "setPeer"
  ): FunctionFragment;

  encodeFunctionData(functionFragment: "endpoint", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "oAppVersion",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "peers",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "setDelegate",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "setPeer",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BytesLike>]
  ): string;

  decodeFunctionResult(functionFragment: "endpoint", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "oAppVersion",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "peers", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setDelegate",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setPeer", data: BytesLike): Result;

  events: {
    "PeerSet(uint32,bytes32)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "PeerSet"): EventFragment;
}

export interface PeerSetEventObject {
  eid: number;
  peer: string;
}
export type PeerSetEvent = TypedEvent<[number, string], PeerSetEventObject>;

export type PeerSetEventFilter = TypedEventFilter<PeerSetEvent>;

export interface IOAppCore extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IOAppCoreInterface;

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
    endpoint(
      overrides?: CallOverrides
    ): Promise<[string] & { iEndpoint: string }>;

    oAppVersion(
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & {
        senderVersion: BigNumber;
        receiverVersion: BigNumber;
      }
    >;

    peers(
      _eid: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[string] & { peer: string }>;

    setDelegate(
      _delegate: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setPeer(
      _eid: PromiseOrValue<BigNumberish>,
      _peer: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  endpoint(overrides?: CallOverrides): Promise<string>;

  oAppVersion(
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber] & {
      senderVersion: BigNumber;
      receiverVersion: BigNumber;
    }
  >;

  peers(
    _eid: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<string>;

  setDelegate(
    _delegate: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setPeer(
    _eid: PromiseOrValue<BigNumberish>,
    _peer: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    endpoint(overrides?: CallOverrides): Promise<string>;

    oAppVersion(
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & {
        senderVersion: BigNumber;
        receiverVersion: BigNumber;
      }
    >;

    peers(
      _eid: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<string>;

    setDelegate(
      _delegate: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    setPeer(
      _eid: PromiseOrValue<BigNumberish>,
      _peer: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "PeerSet(uint32,bytes32)"(eid?: null, peer?: null): PeerSetEventFilter;
    PeerSet(eid?: null, peer?: null): PeerSetEventFilter;
  };

  estimateGas: {
    endpoint(overrides?: CallOverrides): Promise<BigNumber>;

    oAppVersion(overrides?: CallOverrides): Promise<BigNumber>;

    peers(
      _eid: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    setDelegate(
      _delegate: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setPeer(
      _eid: PromiseOrValue<BigNumberish>,
      _peer: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    endpoint(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    oAppVersion(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    peers(
      _eid: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    setDelegate(
      _delegate: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setPeer(
      _eid: PromiseOrValue<BigNumberish>,
      _peer: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
