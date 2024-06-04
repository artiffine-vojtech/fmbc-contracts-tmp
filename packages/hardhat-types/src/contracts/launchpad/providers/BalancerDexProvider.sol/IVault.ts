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
  PayableOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../../../common";

export declare namespace IVault {
  export type ExitPoolRequestStruct = {
    assets: PromiseOrValue<string>[];
    minAmountsOut: PromiseOrValue<BigNumberish>[];
    userData: PromiseOrValue<BytesLike>;
    toInternalBalance: PromiseOrValue<boolean>;
  };

  export type ExitPoolRequestStructOutput = [
    string[],
    BigNumber[],
    string,
    boolean
  ] & {
    assets: string[];
    minAmountsOut: BigNumber[];
    userData: string;
    toInternalBalance: boolean;
  };

  export type JoinPoolRequestStruct = {
    assets: PromiseOrValue<string>[];
    maxAmountsIn: PromiseOrValue<BigNumberish>[];
    userData: PromiseOrValue<BytesLike>;
    fromInternalBalance: PromiseOrValue<boolean>;
  };

  export type JoinPoolRequestStructOutput = [
    string[],
    BigNumber[],
    string,
    boolean
  ] & {
    assets: string[];
    maxAmountsIn: BigNumber[];
    userData: string;
    fromInternalBalance: boolean;
  };

  export type SingleSwapStruct = {
    poolId: PromiseOrValue<BytesLike>;
    kind: PromiseOrValue<BigNumberish>;
    assetIn: PromiseOrValue<string>;
    assetOut: PromiseOrValue<string>;
    amount: PromiseOrValue<BigNumberish>;
    userData: PromiseOrValue<BytesLike>;
  };

  export type SingleSwapStructOutput = [
    string,
    number,
    string,
    string,
    BigNumber,
    string
  ] & {
    poolId: string;
    kind: number;
    assetIn: string;
    assetOut: string;
    amount: BigNumber;
    userData: string;
  };

  export type FundManagementStruct = {
    sender: PromiseOrValue<string>;
    fromInternalBalance: PromiseOrValue<boolean>;
    recipient: PromiseOrValue<string>;
    toInternalBalance: PromiseOrValue<boolean>;
  };

  export type FundManagementStructOutput = [
    string,
    boolean,
    string,
    boolean
  ] & {
    sender: string;
    fromInternalBalance: boolean;
    recipient: string;
    toInternalBalance: boolean;
  };
}

export interface IVaultInterface extends utils.Interface {
  functions: {
    "exitPool(bytes32,address,address,(address[],uint256[],bytes,bool))": FunctionFragment;
    "getPoolTokens(bytes32)": FunctionFragment;
    "joinPool(bytes32,address,address,(address[],uint256[],bytes,bool))": FunctionFragment;
    "swap((bytes32,uint8,address,address,uint256,bytes),(address,bool,address,bool),uint256,uint256)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic: "exitPool" | "getPoolTokens" | "joinPool" | "swap"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "exitPool",
    values: [
      PromiseOrValue<BytesLike>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      IVault.ExitPoolRequestStruct
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "getPoolTokens",
    values: [PromiseOrValue<BytesLike>]
  ): string;
  encodeFunctionData(
    functionFragment: "joinPool",
    values: [
      PromiseOrValue<BytesLike>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      IVault.JoinPoolRequestStruct
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "swap",
    values: [
      IVault.SingleSwapStruct,
      IVault.FundManagementStruct,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;

  decodeFunctionResult(functionFragment: "exitPool", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getPoolTokens",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "joinPool", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "swap", data: BytesLike): Result;

  events: {};
}

export interface IVault extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IVaultInterface;

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
    exitPool(
      poolId: PromiseOrValue<BytesLike>,
      sender: PromiseOrValue<string>,
      recipient: PromiseOrValue<string>,
      request: IVault.ExitPoolRequestStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    getPoolTokens(
      poolId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<
      [string[], BigNumber[], BigNumber] & {
        tokens: string[];
        balances: BigNumber[];
        lastChangeBlock: BigNumber;
      }
    >;

    joinPool(
      poolId: PromiseOrValue<BytesLike>,
      sender: PromiseOrValue<string>,
      recipient: PromiseOrValue<string>,
      request: IVault.JoinPoolRequestStruct,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    swap(
      singleSwap: IVault.SingleSwapStruct,
      funds: IVault.FundManagementStruct,
      limit: PromiseOrValue<BigNumberish>,
      deadline: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  exitPool(
    poolId: PromiseOrValue<BytesLike>,
    sender: PromiseOrValue<string>,
    recipient: PromiseOrValue<string>,
    request: IVault.ExitPoolRequestStruct,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  getPoolTokens(
    poolId: PromiseOrValue<BytesLike>,
    overrides?: CallOverrides
  ): Promise<
    [string[], BigNumber[], BigNumber] & {
      tokens: string[];
      balances: BigNumber[];
      lastChangeBlock: BigNumber;
    }
  >;

  joinPool(
    poolId: PromiseOrValue<BytesLike>,
    sender: PromiseOrValue<string>,
    recipient: PromiseOrValue<string>,
    request: IVault.JoinPoolRequestStruct,
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  swap(
    singleSwap: IVault.SingleSwapStruct,
    funds: IVault.FundManagementStruct,
    limit: PromiseOrValue<BigNumberish>,
    deadline: PromiseOrValue<BigNumberish>,
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    exitPool(
      poolId: PromiseOrValue<BytesLike>,
      sender: PromiseOrValue<string>,
      recipient: PromiseOrValue<string>,
      request: IVault.ExitPoolRequestStruct,
      overrides?: CallOverrides
    ): Promise<void>;

    getPoolTokens(
      poolId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<
      [string[], BigNumber[], BigNumber] & {
        tokens: string[];
        balances: BigNumber[];
        lastChangeBlock: BigNumber;
      }
    >;

    joinPool(
      poolId: PromiseOrValue<BytesLike>,
      sender: PromiseOrValue<string>,
      recipient: PromiseOrValue<string>,
      request: IVault.JoinPoolRequestStruct,
      overrides?: CallOverrides
    ): Promise<void>;

    swap(
      singleSwap: IVault.SingleSwapStruct,
      funds: IVault.FundManagementStruct,
      limit: PromiseOrValue<BigNumberish>,
      deadline: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  filters: {};

  estimateGas: {
    exitPool(
      poolId: PromiseOrValue<BytesLike>,
      sender: PromiseOrValue<string>,
      recipient: PromiseOrValue<string>,
      request: IVault.ExitPoolRequestStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    getPoolTokens(
      poolId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    joinPool(
      poolId: PromiseOrValue<BytesLike>,
      sender: PromiseOrValue<string>,
      recipient: PromiseOrValue<string>,
      request: IVault.JoinPoolRequestStruct,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    swap(
      singleSwap: IVault.SingleSwapStruct,
      funds: IVault.FundManagementStruct,
      limit: PromiseOrValue<BigNumberish>,
      deadline: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    exitPool(
      poolId: PromiseOrValue<BytesLike>,
      sender: PromiseOrValue<string>,
      recipient: PromiseOrValue<string>,
      request: IVault.ExitPoolRequestStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    getPoolTokens(
      poolId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    joinPool(
      poolId: PromiseOrValue<BytesLike>,
      sender: PromiseOrValue<string>,
      recipient: PromiseOrValue<string>,
      request: IVault.JoinPoolRequestStruct,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    swap(
      singleSwap: IVault.SingleSwapStruct,
      funds: IVault.FundManagementStruct,
      limit: PromiseOrValue<BigNumberish>,
      deadline: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
