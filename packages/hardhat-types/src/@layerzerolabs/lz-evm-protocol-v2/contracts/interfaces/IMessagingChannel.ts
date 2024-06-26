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
} from "../../../../common";

export interface IMessagingChannelInterface extends utils.Interface {
  functions: {
    "burn(address,uint32,bytes32,uint64,bytes32)": FunctionFragment;
    "eid()": FunctionFragment;
    "inboundNonce(address,uint32,bytes32)": FunctionFragment;
    "inboundPayloadHash(address,uint32,bytes32,uint64)": FunctionFragment;
    "lazyInboundNonce(address,uint32,bytes32)": FunctionFragment;
    "nextGuid(address,uint32,bytes32)": FunctionFragment;
    "nilify(address,uint32,bytes32,uint64,bytes32)": FunctionFragment;
    "outboundNonce(address,uint32,bytes32)": FunctionFragment;
    "skip(address,uint32,bytes32,uint64)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "burn"
      | "eid"
      | "inboundNonce"
      | "inboundPayloadHash"
      | "lazyInboundNonce"
      | "nextGuid"
      | "nilify"
      | "outboundNonce"
      | "skip"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "burn",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BytesLike>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BytesLike>
    ]
  ): string;
  encodeFunctionData(functionFragment: "eid", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "inboundNonce",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BytesLike>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "inboundPayloadHash",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BytesLike>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "lazyInboundNonce",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BytesLike>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "nextGuid",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BytesLike>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "nilify",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BytesLike>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BytesLike>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "outboundNonce",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BytesLike>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "skip",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BytesLike>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;

  decodeFunctionResult(functionFragment: "burn", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "eid", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "inboundNonce",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "inboundPayloadHash",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "lazyInboundNonce",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "nextGuid", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "nilify", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "outboundNonce",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "skip", data: BytesLike): Result;

  events: {
    "InboundNonceSkipped(uint32,bytes32,address,uint64)": EventFragment;
    "PacketBurnt(uint32,bytes32,address,uint64,bytes32)": EventFragment;
    "PacketNilified(uint32,bytes32,address,uint64,bytes32)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "InboundNonceSkipped"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "PacketBurnt"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "PacketNilified"): EventFragment;
}

export interface InboundNonceSkippedEventObject {
  srcEid: number;
  sender: string;
  receiver: string;
  nonce: BigNumber;
}
export type InboundNonceSkippedEvent = TypedEvent<
  [number, string, string, BigNumber],
  InboundNonceSkippedEventObject
>;

export type InboundNonceSkippedEventFilter =
  TypedEventFilter<InboundNonceSkippedEvent>;

export interface PacketBurntEventObject {
  srcEid: number;
  sender: string;
  receiver: string;
  nonce: BigNumber;
  payloadHash: string;
}
export type PacketBurntEvent = TypedEvent<
  [number, string, string, BigNumber, string],
  PacketBurntEventObject
>;

export type PacketBurntEventFilter = TypedEventFilter<PacketBurntEvent>;

export interface PacketNilifiedEventObject {
  srcEid: number;
  sender: string;
  receiver: string;
  nonce: BigNumber;
  payloadHash: string;
}
export type PacketNilifiedEvent = TypedEvent<
  [number, string, string, BigNumber, string],
  PacketNilifiedEventObject
>;

export type PacketNilifiedEventFilter = TypedEventFilter<PacketNilifiedEvent>;

export interface IMessagingChannel extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IMessagingChannelInterface;

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
    burn(
      _oapp: PromiseOrValue<string>,
      _srcEid: PromiseOrValue<BigNumberish>,
      _sender: PromiseOrValue<BytesLike>,
      _nonce: PromiseOrValue<BigNumberish>,
      _payloadHash: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    eid(overrides?: CallOverrides): Promise<[number]>;

    inboundNonce(
      _receiver: PromiseOrValue<string>,
      _srcEid: PromiseOrValue<BigNumberish>,
      _sender: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    inboundPayloadHash(
      _receiver: PromiseOrValue<string>,
      _srcEid: PromiseOrValue<BigNumberish>,
      _sender: PromiseOrValue<BytesLike>,
      _nonce: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    lazyInboundNonce(
      _receiver: PromiseOrValue<string>,
      _srcEid: PromiseOrValue<BigNumberish>,
      _sender: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    nextGuid(
      _sender: PromiseOrValue<string>,
      _dstEid: PromiseOrValue<BigNumberish>,
      _receiver: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    nilify(
      _oapp: PromiseOrValue<string>,
      _srcEid: PromiseOrValue<BigNumberish>,
      _sender: PromiseOrValue<BytesLike>,
      _nonce: PromiseOrValue<BigNumberish>,
      _payloadHash: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    outboundNonce(
      _sender: PromiseOrValue<string>,
      _dstEid: PromiseOrValue<BigNumberish>,
      _receiver: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    skip(
      _oapp: PromiseOrValue<string>,
      _srcEid: PromiseOrValue<BigNumberish>,
      _sender: PromiseOrValue<BytesLike>,
      _nonce: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  burn(
    _oapp: PromiseOrValue<string>,
    _srcEid: PromiseOrValue<BigNumberish>,
    _sender: PromiseOrValue<BytesLike>,
    _nonce: PromiseOrValue<BigNumberish>,
    _payloadHash: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  eid(overrides?: CallOverrides): Promise<number>;

  inboundNonce(
    _receiver: PromiseOrValue<string>,
    _srcEid: PromiseOrValue<BigNumberish>,
    _sender: PromiseOrValue<BytesLike>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  inboundPayloadHash(
    _receiver: PromiseOrValue<string>,
    _srcEid: PromiseOrValue<BigNumberish>,
    _sender: PromiseOrValue<BytesLike>,
    _nonce: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<string>;

  lazyInboundNonce(
    _receiver: PromiseOrValue<string>,
    _srcEid: PromiseOrValue<BigNumberish>,
    _sender: PromiseOrValue<BytesLike>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  nextGuid(
    _sender: PromiseOrValue<string>,
    _dstEid: PromiseOrValue<BigNumberish>,
    _receiver: PromiseOrValue<BytesLike>,
    overrides?: CallOverrides
  ): Promise<string>;

  nilify(
    _oapp: PromiseOrValue<string>,
    _srcEid: PromiseOrValue<BigNumberish>,
    _sender: PromiseOrValue<BytesLike>,
    _nonce: PromiseOrValue<BigNumberish>,
    _payloadHash: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  outboundNonce(
    _sender: PromiseOrValue<string>,
    _dstEid: PromiseOrValue<BigNumberish>,
    _receiver: PromiseOrValue<BytesLike>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  skip(
    _oapp: PromiseOrValue<string>,
    _srcEid: PromiseOrValue<BigNumberish>,
    _sender: PromiseOrValue<BytesLike>,
    _nonce: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    burn(
      _oapp: PromiseOrValue<string>,
      _srcEid: PromiseOrValue<BigNumberish>,
      _sender: PromiseOrValue<BytesLike>,
      _nonce: PromiseOrValue<BigNumberish>,
      _payloadHash: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<void>;

    eid(overrides?: CallOverrides): Promise<number>;

    inboundNonce(
      _receiver: PromiseOrValue<string>,
      _srcEid: PromiseOrValue<BigNumberish>,
      _sender: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    inboundPayloadHash(
      _receiver: PromiseOrValue<string>,
      _srcEid: PromiseOrValue<BigNumberish>,
      _sender: PromiseOrValue<BytesLike>,
      _nonce: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<string>;

    lazyInboundNonce(
      _receiver: PromiseOrValue<string>,
      _srcEid: PromiseOrValue<BigNumberish>,
      _sender: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    nextGuid(
      _sender: PromiseOrValue<string>,
      _dstEid: PromiseOrValue<BigNumberish>,
      _receiver: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<string>;

    nilify(
      _oapp: PromiseOrValue<string>,
      _srcEid: PromiseOrValue<BigNumberish>,
      _sender: PromiseOrValue<BytesLike>,
      _nonce: PromiseOrValue<BigNumberish>,
      _payloadHash: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<void>;

    outboundNonce(
      _sender: PromiseOrValue<string>,
      _dstEid: PromiseOrValue<BigNumberish>,
      _receiver: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    skip(
      _oapp: PromiseOrValue<string>,
      _srcEid: PromiseOrValue<BigNumberish>,
      _sender: PromiseOrValue<BytesLike>,
      _nonce: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "InboundNonceSkipped(uint32,bytes32,address,uint64)"(
      srcEid?: null,
      sender?: null,
      receiver?: null,
      nonce?: null
    ): InboundNonceSkippedEventFilter;
    InboundNonceSkipped(
      srcEid?: null,
      sender?: null,
      receiver?: null,
      nonce?: null
    ): InboundNonceSkippedEventFilter;

    "PacketBurnt(uint32,bytes32,address,uint64,bytes32)"(
      srcEid?: null,
      sender?: null,
      receiver?: null,
      nonce?: null,
      payloadHash?: null
    ): PacketBurntEventFilter;
    PacketBurnt(
      srcEid?: null,
      sender?: null,
      receiver?: null,
      nonce?: null,
      payloadHash?: null
    ): PacketBurntEventFilter;

    "PacketNilified(uint32,bytes32,address,uint64,bytes32)"(
      srcEid?: null,
      sender?: null,
      receiver?: null,
      nonce?: null,
      payloadHash?: null
    ): PacketNilifiedEventFilter;
    PacketNilified(
      srcEid?: null,
      sender?: null,
      receiver?: null,
      nonce?: null,
      payloadHash?: null
    ): PacketNilifiedEventFilter;
  };

  estimateGas: {
    burn(
      _oapp: PromiseOrValue<string>,
      _srcEid: PromiseOrValue<BigNumberish>,
      _sender: PromiseOrValue<BytesLike>,
      _nonce: PromiseOrValue<BigNumberish>,
      _payloadHash: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    eid(overrides?: CallOverrides): Promise<BigNumber>;

    inboundNonce(
      _receiver: PromiseOrValue<string>,
      _srcEid: PromiseOrValue<BigNumberish>,
      _sender: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    inboundPayloadHash(
      _receiver: PromiseOrValue<string>,
      _srcEid: PromiseOrValue<BigNumberish>,
      _sender: PromiseOrValue<BytesLike>,
      _nonce: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    lazyInboundNonce(
      _receiver: PromiseOrValue<string>,
      _srcEid: PromiseOrValue<BigNumberish>,
      _sender: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    nextGuid(
      _sender: PromiseOrValue<string>,
      _dstEid: PromiseOrValue<BigNumberish>,
      _receiver: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    nilify(
      _oapp: PromiseOrValue<string>,
      _srcEid: PromiseOrValue<BigNumberish>,
      _sender: PromiseOrValue<BytesLike>,
      _nonce: PromiseOrValue<BigNumberish>,
      _payloadHash: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    outboundNonce(
      _sender: PromiseOrValue<string>,
      _dstEid: PromiseOrValue<BigNumberish>,
      _receiver: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    skip(
      _oapp: PromiseOrValue<string>,
      _srcEid: PromiseOrValue<BigNumberish>,
      _sender: PromiseOrValue<BytesLike>,
      _nonce: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    burn(
      _oapp: PromiseOrValue<string>,
      _srcEid: PromiseOrValue<BigNumberish>,
      _sender: PromiseOrValue<BytesLike>,
      _nonce: PromiseOrValue<BigNumberish>,
      _payloadHash: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    eid(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    inboundNonce(
      _receiver: PromiseOrValue<string>,
      _srcEid: PromiseOrValue<BigNumberish>,
      _sender: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    inboundPayloadHash(
      _receiver: PromiseOrValue<string>,
      _srcEid: PromiseOrValue<BigNumberish>,
      _sender: PromiseOrValue<BytesLike>,
      _nonce: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    lazyInboundNonce(
      _receiver: PromiseOrValue<string>,
      _srcEid: PromiseOrValue<BigNumberish>,
      _sender: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    nextGuid(
      _sender: PromiseOrValue<string>,
      _dstEid: PromiseOrValue<BigNumberish>,
      _receiver: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    nilify(
      _oapp: PromiseOrValue<string>,
      _srcEid: PromiseOrValue<BigNumberish>,
      _sender: PromiseOrValue<BytesLike>,
      _nonce: PromiseOrValue<BigNumberish>,
      _payloadHash: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    outboundNonce(
      _sender: PromiseOrValue<string>,
      _dstEid: PromiseOrValue<BigNumberish>,
      _receiver: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    skip(
      _oapp: PromiseOrValue<string>,
      _srcEid: PromiseOrValue<BigNumberish>,
      _sender: PromiseOrValue<BytesLike>,
      _nonce: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
