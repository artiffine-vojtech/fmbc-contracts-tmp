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
} from "../../common";

export interface NFTCheckerInterface extends utils.Interface {
  functions: {
    "addAdmin(address)": FunctionFragment;
    "addIncentivesController(address)": FunctionFragment;
    "collection()": FunctionFragment;
    "getIncentivesControllersCount()": FunctionFragment;
    "getStakedNFTIds(address)": FunctionFragment;
    "incentivesControllers(uint256)": FunctionFragment;
    "isAdmin(address)": FunctionFragment;
    "isIncentivesController(address)": FunctionFragment;
    "isNftStaked(address,uint256,address)": FunctionFragment;
    "owner()": FunctionFragment;
    "removeAdmin(address)": FunctionFragment;
    "removeIncentivesController(uint256)": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "addAdmin"
      | "addIncentivesController"
      | "collection"
      | "getIncentivesControllersCount"
      | "getStakedNFTIds"
      | "incentivesControllers"
      | "isAdmin"
      | "isIncentivesController"
      | "isNftStaked"
      | "owner"
      | "removeAdmin"
      | "removeIncentivesController"
      | "renounceOwnership"
      | "transferOwnership"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "addAdmin",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "addIncentivesController",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "collection",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getIncentivesControllersCount",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getStakedNFTIds",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "incentivesControllers",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "isAdmin",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "isIncentivesController",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "isNftStaked",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>
    ]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "removeAdmin",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "removeIncentivesController",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [PromiseOrValue<string>]
  ): string;

  decodeFunctionResult(functionFragment: "addAdmin", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "addIncentivesController",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "collection", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getIncentivesControllersCount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getStakedNFTIds",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "incentivesControllers",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "isAdmin", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "isIncentivesController",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isNftStaked",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "removeAdmin",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "removeIncentivesController",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;

  events: {
    "AdminAdded(address)": EventFragment;
    "AdminRemoved(address)": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "AdminAdded"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "AdminRemoved"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
}

export interface AdminAddedEventObject {
  admin: string;
}
export type AdminAddedEvent = TypedEvent<[string], AdminAddedEventObject>;

export type AdminAddedEventFilter = TypedEventFilter<AdminAddedEvent>;

export interface AdminRemovedEventObject {
  admin: string;
}
export type AdminRemovedEvent = TypedEvent<[string], AdminRemovedEventObject>;

export type AdminRemovedEventFilter = TypedEventFilter<AdminRemovedEvent>;

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

export interface NFTChecker extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: NFTCheckerInterface;

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
    addAdmin(
      _admin: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    addIncentivesController(
      _controller: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    collection(overrides?: CallOverrides): Promise<[string]>;

    getIncentivesControllersCount(
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getStakedNFTIds(
      user: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[BigNumber[]]>;

    incentivesControllers(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    isAdmin(
      _admin: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    isIncentivesController(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    isNftStaked(
      _identity: PromiseOrValue<string>,
      _tokenId: PromiseOrValue<BigNumberish>,
      _incentivesController: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    removeAdmin(
      _admin: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    removeIncentivesController(
      index: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  addAdmin(
    _admin: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  addIncentivesController(
    _controller: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  collection(overrides?: CallOverrides): Promise<string>;

  getIncentivesControllersCount(overrides?: CallOverrides): Promise<BigNumber>;

  getStakedNFTIds(
    user: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<BigNumber[]>;

  incentivesControllers(
    arg0: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<string>;

  isAdmin(
    _admin: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  isIncentivesController(
    arg0: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  isNftStaked(
    _identity: PromiseOrValue<string>,
    _tokenId: PromiseOrValue<BigNumberish>,
    _incentivesController: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  owner(overrides?: CallOverrides): Promise<string>;

  removeAdmin(
    _admin: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  removeIncentivesController(
    index: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  renounceOwnership(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    addAdmin(
      _admin: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    addIncentivesController(
      _controller: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    collection(overrides?: CallOverrides): Promise<string>;

    getIncentivesControllersCount(
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getStakedNFTIds(
      user: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber[]>;

    incentivesControllers(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<string>;

    isAdmin(
      _admin: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    isIncentivesController(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    isNftStaked(
      _identity: PromiseOrValue<string>,
      _tokenId: PromiseOrValue<BigNumberish>,
      _incentivesController: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    owner(overrides?: CallOverrides): Promise<string>;

    removeAdmin(
      _admin: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    removeIncentivesController(
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "AdminAdded(address)"(
      admin?: PromiseOrValue<string> | null
    ): AdminAddedEventFilter;
    AdminAdded(admin?: PromiseOrValue<string> | null): AdminAddedEventFilter;

    "AdminRemoved(address)"(
      admin?: PromiseOrValue<string> | null
    ): AdminRemovedEventFilter;
    AdminRemoved(
      admin?: PromiseOrValue<string> | null
    ): AdminRemovedEventFilter;

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
    addAdmin(
      _admin: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    addIncentivesController(
      _controller: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    collection(overrides?: CallOverrides): Promise<BigNumber>;

    getIncentivesControllersCount(
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getStakedNFTIds(
      user: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    incentivesControllers(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isAdmin(
      _admin: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isIncentivesController(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isNftStaked(
      _identity: PromiseOrValue<string>,
      _tokenId: PromiseOrValue<BigNumberish>,
      _incentivesController: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    removeAdmin(
      _admin: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    removeIncentivesController(
      index: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    addAdmin(
      _admin: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    addIncentivesController(
      _controller: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    collection(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getIncentivesControllersCount(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getStakedNFTIds(
      user: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    incentivesControllers(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isAdmin(
      _admin: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isIncentivesController(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isNftStaked(
      _identity: PromiseOrValue<string>,
      _tokenId: PromiseOrValue<BigNumberish>,
      _incentivesController: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    removeAdmin(
      _admin: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    removeIncentivesController(
      index: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}