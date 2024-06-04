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
} from "../common";

export declare namespace IIncentivesController {
  export type RewardDataStruct = {
    token: PromiseOrValue<string>;
    amount: PromiseOrValue<BigNumberish>;
  };

  export type RewardDataStructOutput = [string, BigNumber] & {
    token: string;
    amount: BigNumber;
  };
}

export interface IncentivesControllerInterface extends utils.Interface {
  functions: {
    "addReward(address)": FunctionFragment;
    "balances(address)": FunctionFragment;
    "boosterNFT()": FunctionFragment;
    "claimableRewards(address)": FunctionFragment;
    "deposit(uint256,address)": FunctionFragment;
    "getReward(address[])": FunctionFragment;
    "lastTimeRewardApplicable(address)": FunctionFragment;
    "notifyReward(address[],uint256[])": FunctionFragment;
    "owner()": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "rewardData(address)": FunctionFragment;
    "rewardTokens(uint256)": FunctionFragment;
    "rewards(address,address)": FunctionFragment;
    "rewardsDuration()": FunctionFragment;
    "setRewardsDuration(uint256)": FunctionFragment;
    "stakeNFT(uint256)": FunctionFragment;
    "stakingToken()": FunctionFragment;
    "totalScaled()": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "unstakeNFT()": FunctionFragment;
    "withdraw(uint256)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "addReward"
      | "balances"
      | "boosterNFT"
      | "claimableRewards"
      | "deposit"
      | "getReward"
      | "lastTimeRewardApplicable"
      | "notifyReward"
      | "owner"
      | "renounceOwnership"
      | "rewardData"
      | "rewardTokens"
      | "rewards"
      | "rewardsDuration"
      | "setRewardsDuration"
      | "stakeNFT"
      | "stakingToken"
      | "totalScaled"
      | "transferOwnership"
      | "unstakeNFT"
      | "withdraw"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "addReward",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "balances",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "boosterNFT",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "claimableRewards",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "deposit",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "getReward",
    values: [PromiseOrValue<string>[]]
  ): string;
  encodeFunctionData(
    functionFragment: "lastTimeRewardApplicable",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "notifyReward",
    values: [PromiseOrValue<string>[], PromiseOrValue<BigNumberish>[]]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "rewardData",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "rewardTokens",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "rewards",
    values: [PromiseOrValue<string>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "rewardsDuration",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setRewardsDuration",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "stakeNFT",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "stakingToken",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "totalScaled",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "unstakeNFT",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "withdraw",
    values: [PromiseOrValue<BigNumberish>]
  ): string;

  decodeFunctionResult(functionFragment: "addReward", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "balances", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "boosterNFT", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "claimableRewards",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "deposit", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getReward", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "lastTimeRewardApplicable",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "notifyReward",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "rewardData", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "rewardTokens",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "rewards", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "rewardsDuration",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setRewardsDuration",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "stakeNFT", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "stakingToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "totalScaled",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "unstakeNFT", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;

  events: {
    "Deposited(address,uint256,uint256)": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
    "RewardPaid(address,address,uint256)": EventFragment;
    "Withdrawn(address,uint256,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Deposited"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RewardPaid"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Withdrawn"): EventFragment;
}

export interface DepositedEventObject {
  user: string;
  amount: BigNumber;
  scaled: BigNumber;
}
export type DepositedEvent = TypedEvent<
  [string, BigNumber, BigNumber],
  DepositedEventObject
>;

export type DepositedEventFilter = TypedEventFilter<DepositedEvent>;

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

export interface RewardPaidEventObject {
  user: string;
  rewardsToken: string;
  reward: BigNumber;
}
export type RewardPaidEvent = TypedEvent<
  [string, string, BigNumber],
  RewardPaidEventObject
>;

export type RewardPaidEventFilter = TypedEventFilter<RewardPaidEvent>;

export interface WithdrawnEventObject {
  user: string;
  amount: BigNumber;
  scaled: BigNumber;
}
export type WithdrawnEvent = TypedEvent<
  [string, BigNumber, BigNumber],
  WithdrawnEventObject
>;

export type WithdrawnEventFilter = TypedEventFilter<WithdrawnEvent>;

export interface IncentivesController extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IncentivesControllerInterface;

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
    addReward(
      _rewardToken: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    balances(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber, boolean] & {
        staked: BigNumber;
        scaled: BigNumber;
        nftId: BigNumber;
        boosted: boolean;
      }
    >;

    boosterNFT(overrides?: CallOverrides): Promise<[string]>;

    claimableRewards(
      _account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<
      [IIncentivesController.RewardDataStructOutput[]] & {
        claimable: IIncentivesController.RewardDataStructOutput[];
      }
    >;

    deposit(
      _amount: PromiseOrValue<BigNumberish>,
      _onBehalfOf: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    getReward(
      _rewardTokens: PromiseOrValue<string>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    lastTimeRewardApplicable(
      _rewardsToken: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    notifyReward(
      _rewardTokens: PromiseOrValue<string>[],
      _amounts: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    rewardData(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber] & {
        periodFinish: BigNumber;
        rewardRate: BigNumber;
        lastUpdateTime: BigNumber;
        rewardPerTokenStored: BigNumber;
        balance: BigNumber;
      }
    >;

    rewardTokens(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    rewards(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    rewardsDuration(overrides?: CallOverrides): Promise<[BigNumber]>;

    setRewardsDuration(
      _newRewardsDuration: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    stakeNFT(
      _tokenId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    stakingToken(overrides?: CallOverrides): Promise<[string]>;

    totalScaled(overrides?: CallOverrides): Promise<[BigNumber]>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    unstakeNFT(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    withdraw(
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  addReward(
    _rewardToken: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  balances(
    arg0: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber, BigNumber, boolean] & {
      staked: BigNumber;
      scaled: BigNumber;
      nftId: BigNumber;
      boosted: boolean;
    }
  >;

  boosterNFT(overrides?: CallOverrides): Promise<string>;

  claimableRewards(
    _account: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<IIncentivesController.RewardDataStructOutput[]>;

  deposit(
    _amount: PromiseOrValue<BigNumberish>,
    _onBehalfOf: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  getReward(
    _rewardTokens: PromiseOrValue<string>[],
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  lastTimeRewardApplicable(
    _rewardsToken: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  notifyReward(
    _rewardTokens: PromiseOrValue<string>[],
    _amounts: PromiseOrValue<BigNumberish>[],
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  owner(overrides?: CallOverrides): Promise<string>;

  renounceOwnership(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  rewardData(
    arg0: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber] & {
      periodFinish: BigNumber;
      rewardRate: BigNumber;
      lastUpdateTime: BigNumber;
      rewardPerTokenStored: BigNumber;
      balance: BigNumber;
    }
  >;

  rewardTokens(
    arg0: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<string>;

  rewards(
    arg0: PromiseOrValue<string>,
    arg1: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  rewardsDuration(overrides?: CallOverrides): Promise<BigNumber>;

  setRewardsDuration(
    _newRewardsDuration: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  stakeNFT(
    _tokenId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  stakingToken(overrides?: CallOverrides): Promise<string>;

  totalScaled(overrides?: CallOverrides): Promise<BigNumber>;

  transferOwnership(
    newOwner: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  unstakeNFT(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  withdraw(
    _amount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    addReward(
      _rewardToken: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    balances(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber, boolean] & {
        staked: BigNumber;
        scaled: BigNumber;
        nftId: BigNumber;
        boosted: boolean;
      }
    >;

    boosterNFT(overrides?: CallOverrides): Promise<string>;

    claimableRewards(
      _account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<IIncentivesController.RewardDataStructOutput[]>;

    deposit(
      _amount: PromiseOrValue<BigNumberish>,
      _onBehalfOf: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    getReward(
      _rewardTokens: PromiseOrValue<string>[],
      overrides?: CallOverrides
    ): Promise<void>;

    lastTimeRewardApplicable(
      _rewardsToken: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    notifyReward(
      _rewardTokens: PromiseOrValue<string>[],
      _amounts: PromiseOrValue<BigNumberish>[],
      overrides?: CallOverrides
    ): Promise<void>;

    owner(overrides?: CallOverrides): Promise<string>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    rewardData(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber] & {
        periodFinish: BigNumber;
        rewardRate: BigNumber;
        lastUpdateTime: BigNumber;
        rewardPerTokenStored: BigNumber;
        balance: BigNumber;
      }
    >;

    rewardTokens(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<string>;

    rewards(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    rewardsDuration(overrides?: CallOverrides): Promise<BigNumber>;

    setRewardsDuration(
      _newRewardsDuration: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    stakeNFT(
      _tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    stakingToken(overrides?: CallOverrides): Promise<string>;

    totalScaled(overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    unstakeNFT(overrides?: CallOverrides): Promise<void>;

    withdraw(
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "Deposited(address,uint256,uint256)"(
      user?: PromiseOrValue<string> | null,
      amount?: null,
      scaled?: null
    ): DepositedEventFilter;
    Deposited(
      user?: PromiseOrValue<string> | null,
      amount?: null,
      scaled?: null
    ): DepositedEventFilter;

    "OwnershipTransferred(address,address)"(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null
    ): OwnershipTransferredEventFilter;

    "RewardPaid(address,address,uint256)"(
      user?: PromiseOrValue<string> | null,
      rewardsToken?: PromiseOrValue<string> | null,
      reward?: null
    ): RewardPaidEventFilter;
    RewardPaid(
      user?: PromiseOrValue<string> | null,
      rewardsToken?: PromiseOrValue<string> | null,
      reward?: null
    ): RewardPaidEventFilter;

    "Withdrawn(address,uint256,uint256)"(
      user?: PromiseOrValue<string> | null,
      amount?: null,
      scaled?: null
    ): WithdrawnEventFilter;
    Withdrawn(
      user?: PromiseOrValue<string> | null,
      amount?: null,
      scaled?: null
    ): WithdrawnEventFilter;
  };

  estimateGas: {
    addReward(
      _rewardToken: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    balances(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    boosterNFT(overrides?: CallOverrides): Promise<BigNumber>;

    claimableRewards(
      _account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    deposit(
      _amount: PromiseOrValue<BigNumberish>,
      _onBehalfOf: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    getReward(
      _rewardTokens: PromiseOrValue<string>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    lastTimeRewardApplicable(
      _rewardsToken: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    notifyReward(
      _rewardTokens: PromiseOrValue<string>[],
      _amounts: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    rewardData(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    rewardTokens(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    rewards(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    rewardsDuration(overrides?: CallOverrides): Promise<BigNumber>;

    setRewardsDuration(
      _newRewardsDuration: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    stakeNFT(
      _tokenId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    stakingToken(overrides?: CallOverrides): Promise<BigNumber>;

    totalScaled(overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    unstakeNFT(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    withdraw(
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    addReward(
      _rewardToken: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    balances(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    boosterNFT(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    claimableRewards(
      _account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    deposit(
      _amount: PromiseOrValue<BigNumberish>,
      _onBehalfOf: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    getReward(
      _rewardTokens: PromiseOrValue<string>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    lastTimeRewardApplicable(
      _rewardsToken: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    notifyReward(
      _rewardTokens: PromiseOrValue<string>[],
      _amounts: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    rewardData(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    rewardTokens(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    rewards(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    rewardsDuration(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    setRewardsDuration(
      _newRewardsDuration: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    stakeNFT(
      _tokenId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    stakingToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    totalScaled(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    unstakeNFT(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    withdraw(
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}