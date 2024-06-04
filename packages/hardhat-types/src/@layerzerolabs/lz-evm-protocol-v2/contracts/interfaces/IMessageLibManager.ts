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

export type SetConfigParamStruct = {
  eid: PromiseOrValue<BigNumberish>;
  configType: PromiseOrValue<BigNumberish>;
  config: PromiseOrValue<BytesLike>;
};

export type SetConfigParamStructOutput = [number, number, string] & {
  eid: number;
  configType: number;
  config: string;
};

export interface IMessageLibManagerInterface extends utils.Interface {
  functions: {
    "defaultReceiveLibrary(uint32)": FunctionFragment;
    "defaultReceiveLibraryTimeout(uint32)": FunctionFragment;
    "defaultSendLibrary(uint32)": FunctionFragment;
    "getConfig(address,address,uint32,uint32)": FunctionFragment;
    "getReceiveLibrary(address,uint32)": FunctionFragment;
    "getRegisteredLibraries()": FunctionFragment;
    "getSendLibrary(address,uint32)": FunctionFragment;
    "isDefaultSendLibrary(address,uint32)": FunctionFragment;
    "isRegisteredLibrary(address)": FunctionFragment;
    "isSupportedEid(uint32)": FunctionFragment;
    "isValidReceiveLibrary(address,uint32,address)": FunctionFragment;
    "receiveLibraryTimeout(address,uint32)": FunctionFragment;
    "registerLibrary(address)": FunctionFragment;
    "setConfig(address,address,(uint32,uint32,bytes)[])": FunctionFragment;
    "setDefaultReceiveLibrary(uint32,address,uint256)": FunctionFragment;
    "setDefaultReceiveLibraryTimeout(uint32,address,uint256)": FunctionFragment;
    "setDefaultSendLibrary(uint32,address)": FunctionFragment;
    "setReceiveLibrary(address,uint32,address,uint256)": FunctionFragment;
    "setReceiveLibraryTimeout(address,uint32,address,uint256)": FunctionFragment;
    "setSendLibrary(address,uint32,address)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "defaultReceiveLibrary"
      | "defaultReceiveLibraryTimeout"
      | "defaultSendLibrary"
      | "getConfig"
      | "getReceiveLibrary"
      | "getRegisteredLibraries"
      | "getSendLibrary"
      | "isDefaultSendLibrary"
      | "isRegisteredLibrary"
      | "isSupportedEid"
      | "isValidReceiveLibrary"
      | "receiveLibraryTimeout"
      | "registerLibrary"
      | "setConfig"
      | "setDefaultReceiveLibrary"
      | "setDefaultReceiveLibraryTimeout"
      | "setDefaultSendLibrary"
      | "setReceiveLibrary"
      | "setReceiveLibraryTimeout"
      | "setSendLibrary"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "defaultReceiveLibrary",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "defaultReceiveLibraryTimeout",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "defaultSendLibrary",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "getConfig",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "getReceiveLibrary",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "getRegisteredLibraries",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getSendLibrary",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "isDefaultSendLibrary",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "isRegisteredLibrary",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "isSupportedEid",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "isValidReceiveLibrary",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "receiveLibraryTimeout",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "registerLibrary",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "setConfig",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      SetConfigParamStruct[]
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "setDefaultReceiveLibrary",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "setDefaultReceiveLibraryTimeout",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "setDefaultSendLibrary",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "setReceiveLibrary",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "setReceiveLibraryTimeout",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "setSendLibrary",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>
    ]
  ): string;

  decodeFunctionResult(
    functionFragment: "defaultReceiveLibrary",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "defaultReceiveLibraryTimeout",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "defaultSendLibrary",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getConfig", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getReceiveLibrary",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getRegisteredLibraries",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getSendLibrary",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isDefaultSendLibrary",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isRegisteredLibrary",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isSupportedEid",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isValidReceiveLibrary",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "receiveLibraryTimeout",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "registerLibrary",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setConfig", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setDefaultReceiveLibrary",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setDefaultReceiveLibraryTimeout",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setDefaultSendLibrary",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setReceiveLibrary",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setReceiveLibraryTimeout",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setSendLibrary",
    data: BytesLike
  ): Result;

  events: {
    "DefaultReceiveLibrarySet(uint32,address)": EventFragment;
    "DefaultReceiveLibraryTimeoutSet(uint32,address,uint256)": EventFragment;
    "DefaultSendLibrarySet(uint32,address)": EventFragment;
    "LibraryRegistered(address)": EventFragment;
    "ReceiveLibrarySet(address,uint32,address)": EventFragment;
    "ReceiveLibraryTimeoutSet(address,uint32,address,uint256)": EventFragment;
    "SendLibrarySet(address,uint32,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "DefaultReceiveLibrarySet"): EventFragment;
  getEvent(
    nameOrSignatureOrTopic: "DefaultReceiveLibraryTimeoutSet"
  ): EventFragment;
  getEvent(nameOrSignatureOrTopic: "DefaultSendLibrarySet"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "LibraryRegistered"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ReceiveLibrarySet"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ReceiveLibraryTimeoutSet"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SendLibrarySet"): EventFragment;
}

export interface DefaultReceiveLibrarySetEventObject {
  eid: number;
  newLib: string;
}
export type DefaultReceiveLibrarySetEvent = TypedEvent<
  [number, string],
  DefaultReceiveLibrarySetEventObject
>;

export type DefaultReceiveLibrarySetEventFilter =
  TypedEventFilter<DefaultReceiveLibrarySetEvent>;

export interface DefaultReceiveLibraryTimeoutSetEventObject {
  eid: number;
  oldLib: string;
  expiry: BigNumber;
}
export type DefaultReceiveLibraryTimeoutSetEvent = TypedEvent<
  [number, string, BigNumber],
  DefaultReceiveLibraryTimeoutSetEventObject
>;

export type DefaultReceiveLibraryTimeoutSetEventFilter =
  TypedEventFilter<DefaultReceiveLibraryTimeoutSetEvent>;

export interface DefaultSendLibrarySetEventObject {
  eid: number;
  newLib: string;
}
export type DefaultSendLibrarySetEvent = TypedEvent<
  [number, string],
  DefaultSendLibrarySetEventObject
>;

export type DefaultSendLibrarySetEventFilter =
  TypedEventFilter<DefaultSendLibrarySetEvent>;

export interface LibraryRegisteredEventObject {
  newLib: string;
}
export type LibraryRegisteredEvent = TypedEvent<
  [string],
  LibraryRegisteredEventObject
>;

export type LibraryRegisteredEventFilter =
  TypedEventFilter<LibraryRegisteredEvent>;

export interface ReceiveLibrarySetEventObject {
  receiver: string;
  eid: number;
  newLib: string;
}
export type ReceiveLibrarySetEvent = TypedEvent<
  [string, number, string],
  ReceiveLibrarySetEventObject
>;

export type ReceiveLibrarySetEventFilter =
  TypedEventFilter<ReceiveLibrarySetEvent>;

export interface ReceiveLibraryTimeoutSetEventObject {
  receiver: string;
  eid: number;
  oldLib: string;
  timeout: BigNumber;
}
export type ReceiveLibraryTimeoutSetEvent = TypedEvent<
  [string, number, string, BigNumber],
  ReceiveLibraryTimeoutSetEventObject
>;

export type ReceiveLibraryTimeoutSetEventFilter =
  TypedEventFilter<ReceiveLibraryTimeoutSetEvent>;

export interface SendLibrarySetEventObject {
  sender: string;
  eid: number;
  newLib: string;
}
export type SendLibrarySetEvent = TypedEvent<
  [string, number, string],
  SendLibrarySetEventObject
>;

export type SendLibrarySetEventFilter = TypedEventFilter<SendLibrarySetEvent>;

export interface IMessageLibManager extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IMessageLibManagerInterface;

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
    defaultReceiveLibrary(
      _eid: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    defaultReceiveLibraryTimeout(
      _eid: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[string, BigNumber] & { lib: string; expiry: BigNumber }>;

    defaultSendLibrary(
      _eid: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    getConfig(
      _oapp: PromiseOrValue<string>,
      _lib: PromiseOrValue<string>,
      _eid: PromiseOrValue<BigNumberish>,
      _configType: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[string] & { config: string }>;

    getReceiveLibrary(
      _receiver: PromiseOrValue<string>,
      _eid: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[string, boolean] & { lib: string; isDefault: boolean }>;

    getRegisteredLibraries(overrides?: CallOverrides): Promise<[string[]]>;

    getSendLibrary(
      _sender: PromiseOrValue<string>,
      _eid: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[string] & { lib: string }>;

    isDefaultSendLibrary(
      _sender: PromiseOrValue<string>,
      _eid: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    isRegisteredLibrary(
      _lib: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    isSupportedEid(
      _eid: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    isValidReceiveLibrary(
      _receiver: PromiseOrValue<string>,
      _eid: PromiseOrValue<BigNumberish>,
      _lib: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    receiveLibraryTimeout(
      _receiver: PromiseOrValue<string>,
      _eid: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[string, BigNumber] & { lib: string; expiry: BigNumber }>;

    registerLibrary(
      _lib: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setConfig(
      _oapp: PromiseOrValue<string>,
      _lib: PromiseOrValue<string>,
      _params: SetConfigParamStruct[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setDefaultReceiveLibrary(
      _eid: PromiseOrValue<BigNumberish>,
      _newLib: PromiseOrValue<string>,
      _timeout: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setDefaultReceiveLibraryTimeout(
      _eid: PromiseOrValue<BigNumberish>,
      _lib: PromiseOrValue<string>,
      _expiry: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setDefaultSendLibrary(
      _eid: PromiseOrValue<BigNumberish>,
      _newLib: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setReceiveLibrary(
      _oapp: PromiseOrValue<string>,
      _eid: PromiseOrValue<BigNumberish>,
      _newLib: PromiseOrValue<string>,
      _gracePeriod: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setReceiveLibraryTimeout(
      _oapp: PromiseOrValue<string>,
      _eid: PromiseOrValue<BigNumberish>,
      _lib: PromiseOrValue<string>,
      _gracePeriod: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setSendLibrary(
      _oapp: PromiseOrValue<string>,
      _eid: PromiseOrValue<BigNumberish>,
      _newLib: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  defaultReceiveLibrary(
    _eid: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<string>;

  defaultReceiveLibraryTimeout(
    _eid: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<[string, BigNumber] & { lib: string; expiry: BigNumber }>;

  defaultSendLibrary(
    _eid: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<string>;

  getConfig(
    _oapp: PromiseOrValue<string>,
    _lib: PromiseOrValue<string>,
    _eid: PromiseOrValue<BigNumberish>,
    _configType: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<string>;

  getReceiveLibrary(
    _receiver: PromiseOrValue<string>,
    _eid: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<[string, boolean] & { lib: string; isDefault: boolean }>;

  getRegisteredLibraries(overrides?: CallOverrides): Promise<string[]>;

  getSendLibrary(
    _sender: PromiseOrValue<string>,
    _eid: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<string>;

  isDefaultSendLibrary(
    _sender: PromiseOrValue<string>,
    _eid: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  isRegisteredLibrary(
    _lib: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  isSupportedEid(
    _eid: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  isValidReceiveLibrary(
    _receiver: PromiseOrValue<string>,
    _eid: PromiseOrValue<BigNumberish>,
    _lib: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  receiveLibraryTimeout(
    _receiver: PromiseOrValue<string>,
    _eid: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<[string, BigNumber] & { lib: string; expiry: BigNumber }>;

  registerLibrary(
    _lib: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setConfig(
    _oapp: PromiseOrValue<string>,
    _lib: PromiseOrValue<string>,
    _params: SetConfigParamStruct[],
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setDefaultReceiveLibrary(
    _eid: PromiseOrValue<BigNumberish>,
    _newLib: PromiseOrValue<string>,
    _timeout: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setDefaultReceiveLibraryTimeout(
    _eid: PromiseOrValue<BigNumberish>,
    _lib: PromiseOrValue<string>,
    _expiry: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setDefaultSendLibrary(
    _eid: PromiseOrValue<BigNumberish>,
    _newLib: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setReceiveLibrary(
    _oapp: PromiseOrValue<string>,
    _eid: PromiseOrValue<BigNumberish>,
    _newLib: PromiseOrValue<string>,
    _gracePeriod: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setReceiveLibraryTimeout(
    _oapp: PromiseOrValue<string>,
    _eid: PromiseOrValue<BigNumberish>,
    _lib: PromiseOrValue<string>,
    _gracePeriod: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setSendLibrary(
    _oapp: PromiseOrValue<string>,
    _eid: PromiseOrValue<BigNumberish>,
    _newLib: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    defaultReceiveLibrary(
      _eid: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<string>;

    defaultReceiveLibraryTimeout(
      _eid: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[string, BigNumber] & { lib: string; expiry: BigNumber }>;

    defaultSendLibrary(
      _eid: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<string>;

    getConfig(
      _oapp: PromiseOrValue<string>,
      _lib: PromiseOrValue<string>,
      _eid: PromiseOrValue<BigNumberish>,
      _configType: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<string>;

    getReceiveLibrary(
      _receiver: PromiseOrValue<string>,
      _eid: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[string, boolean] & { lib: string; isDefault: boolean }>;

    getRegisteredLibraries(overrides?: CallOverrides): Promise<string[]>;

    getSendLibrary(
      _sender: PromiseOrValue<string>,
      _eid: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<string>;

    isDefaultSendLibrary(
      _sender: PromiseOrValue<string>,
      _eid: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    isRegisteredLibrary(
      _lib: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    isSupportedEid(
      _eid: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    isValidReceiveLibrary(
      _receiver: PromiseOrValue<string>,
      _eid: PromiseOrValue<BigNumberish>,
      _lib: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    receiveLibraryTimeout(
      _receiver: PromiseOrValue<string>,
      _eid: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[string, BigNumber] & { lib: string; expiry: BigNumber }>;

    registerLibrary(
      _lib: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    setConfig(
      _oapp: PromiseOrValue<string>,
      _lib: PromiseOrValue<string>,
      _params: SetConfigParamStruct[],
      overrides?: CallOverrides
    ): Promise<void>;

    setDefaultReceiveLibrary(
      _eid: PromiseOrValue<BigNumberish>,
      _newLib: PromiseOrValue<string>,
      _timeout: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    setDefaultReceiveLibraryTimeout(
      _eid: PromiseOrValue<BigNumberish>,
      _lib: PromiseOrValue<string>,
      _expiry: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    setDefaultSendLibrary(
      _eid: PromiseOrValue<BigNumberish>,
      _newLib: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    setReceiveLibrary(
      _oapp: PromiseOrValue<string>,
      _eid: PromiseOrValue<BigNumberish>,
      _newLib: PromiseOrValue<string>,
      _gracePeriod: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    setReceiveLibraryTimeout(
      _oapp: PromiseOrValue<string>,
      _eid: PromiseOrValue<BigNumberish>,
      _lib: PromiseOrValue<string>,
      _gracePeriod: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    setSendLibrary(
      _oapp: PromiseOrValue<string>,
      _eid: PromiseOrValue<BigNumberish>,
      _newLib: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "DefaultReceiveLibrarySet(uint32,address)"(
      eid?: null,
      newLib?: null
    ): DefaultReceiveLibrarySetEventFilter;
    DefaultReceiveLibrarySet(
      eid?: null,
      newLib?: null
    ): DefaultReceiveLibrarySetEventFilter;

    "DefaultReceiveLibraryTimeoutSet(uint32,address,uint256)"(
      eid?: null,
      oldLib?: null,
      expiry?: null
    ): DefaultReceiveLibraryTimeoutSetEventFilter;
    DefaultReceiveLibraryTimeoutSet(
      eid?: null,
      oldLib?: null,
      expiry?: null
    ): DefaultReceiveLibraryTimeoutSetEventFilter;

    "DefaultSendLibrarySet(uint32,address)"(
      eid?: null,
      newLib?: null
    ): DefaultSendLibrarySetEventFilter;
    DefaultSendLibrarySet(
      eid?: null,
      newLib?: null
    ): DefaultSendLibrarySetEventFilter;

    "LibraryRegistered(address)"(newLib?: null): LibraryRegisteredEventFilter;
    LibraryRegistered(newLib?: null): LibraryRegisteredEventFilter;

    "ReceiveLibrarySet(address,uint32,address)"(
      receiver?: null,
      eid?: null,
      newLib?: null
    ): ReceiveLibrarySetEventFilter;
    ReceiveLibrarySet(
      receiver?: null,
      eid?: null,
      newLib?: null
    ): ReceiveLibrarySetEventFilter;

    "ReceiveLibraryTimeoutSet(address,uint32,address,uint256)"(
      receiver?: null,
      eid?: null,
      oldLib?: null,
      timeout?: null
    ): ReceiveLibraryTimeoutSetEventFilter;
    ReceiveLibraryTimeoutSet(
      receiver?: null,
      eid?: null,
      oldLib?: null,
      timeout?: null
    ): ReceiveLibraryTimeoutSetEventFilter;

    "SendLibrarySet(address,uint32,address)"(
      sender?: null,
      eid?: null,
      newLib?: null
    ): SendLibrarySetEventFilter;
    SendLibrarySet(
      sender?: null,
      eid?: null,
      newLib?: null
    ): SendLibrarySetEventFilter;
  };

  estimateGas: {
    defaultReceiveLibrary(
      _eid: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    defaultReceiveLibraryTimeout(
      _eid: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    defaultSendLibrary(
      _eid: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getConfig(
      _oapp: PromiseOrValue<string>,
      _lib: PromiseOrValue<string>,
      _eid: PromiseOrValue<BigNumberish>,
      _configType: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getReceiveLibrary(
      _receiver: PromiseOrValue<string>,
      _eid: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getRegisteredLibraries(overrides?: CallOverrides): Promise<BigNumber>;

    getSendLibrary(
      _sender: PromiseOrValue<string>,
      _eid: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isDefaultSendLibrary(
      _sender: PromiseOrValue<string>,
      _eid: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isRegisteredLibrary(
      _lib: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isSupportedEid(
      _eid: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isValidReceiveLibrary(
      _receiver: PromiseOrValue<string>,
      _eid: PromiseOrValue<BigNumberish>,
      _lib: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    receiveLibraryTimeout(
      _receiver: PromiseOrValue<string>,
      _eid: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    registerLibrary(
      _lib: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setConfig(
      _oapp: PromiseOrValue<string>,
      _lib: PromiseOrValue<string>,
      _params: SetConfigParamStruct[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setDefaultReceiveLibrary(
      _eid: PromiseOrValue<BigNumberish>,
      _newLib: PromiseOrValue<string>,
      _timeout: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setDefaultReceiveLibraryTimeout(
      _eid: PromiseOrValue<BigNumberish>,
      _lib: PromiseOrValue<string>,
      _expiry: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setDefaultSendLibrary(
      _eid: PromiseOrValue<BigNumberish>,
      _newLib: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setReceiveLibrary(
      _oapp: PromiseOrValue<string>,
      _eid: PromiseOrValue<BigNumberish>,
      _newLib: PromiseOrValue<string>,
      _gracePeriod: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setReceiveLibraryTimeout(
      _oapp: PromiseOrValue<string>,
      _eid: PromiseOrValue<BigNumberish>,
      _lib: PromiseOrValue<string>,
      _gracePeriod: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setSendLibrary(
      _oapp: PromiseOrValue<string>,
      _eid: PromiseOrValue<BigNumberish>,
      _newLib: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    defaultReceiveLibrary(
      _eid: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    defaultReceiveLibraryTimeout(
      _eid: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    defaultSendLibrary(
      _eid: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getConfig(
      _oapp: PromiseOrValue<string>,
      _lib: PromiseOrValue<string>,
      _eid: PromiseOrValue<BigNumberish>,
      _configType: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getReceiveLibrary(
      _receiver: PromiseOrValue<string>,
      _eid: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getRegisteredLibraries(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getSendLibrary(
      _sender: PromiseOrValue<string>,
      _eid: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isDefaultSendLibrary(
      _sender: PromiseOrValue<string>,
      _eid: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isRegisteredLibrary(
      _lib: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isSupportedEid(
      _eid: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isValidReceiveLibrary(
      _receiver: PromiseOrValue<string>,
      _eid: PromiseOrValue<BigNumberish>,
      _lib: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    receiveLibraryTimeout(
      _receiver: PromiseOrValue<string>,
      _eid: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    registerLibrary(
      _lib: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setConfig(
      _oapp: PromiseOrValue<string>,
      _lib: PromiseOrValue<string>,
      _params: SetConfigParamStruct[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setDefaultReceiveLibrary(
      _eid: PromiseOrValue<BigNumberish>,
      _newLib: PromiseOrValue<string>,
      _timeout: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setDefaultReceiveLibraryTimeout(
      _eid: PromiseOrValue<BigNumberish>,
      _lib: PromiseOrValue<string>,
      _expiry: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setDefaultSendLibrary(
      _eid: PromiseOrValue<BigNumberish>,
      _newLib: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setReceiveLibrary(
      _oapp: PromiseOrValue<string>,
      _eid: PromiseOrValue<BigNumberish>,
      _newLib: PromiseOrValue<string>,
      _gracePeriod: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setReceiveLibraryTimeout(
      _oapp: PromiseOrValue<string>,
      _eid: PromiseOrValue<BigNumberish>,
      _lib: PromiseOrValue<string>,
      _gracePeriod: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setSendLibrary(
      _oapp: PromiseOrValue<string>,
      _eid: PromiseOrValue<BigNumberish>,
      _newLib: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}