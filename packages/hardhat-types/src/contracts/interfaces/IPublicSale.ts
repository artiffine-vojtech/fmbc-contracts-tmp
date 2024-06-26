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
  PayableOverrides,
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

export interface IPublicSaleInterface extends utils.Interface {
  functions: {
    "buy(uint256)": FunctionFragment;
    "getAvailableAmount()": FunctionFragment;
    "getPrice(uint256)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic: "buy" | "getAvailableAmount" | "getPrice"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "buy",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "getAvailableAmount",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getPrice",
    values: [PromiseOrValue<BigNumberish>]
  ): string;

  decodeFunctionResult(functionFragment: "buy", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getAvailableAmount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getPrice", data: BytesLike): Result;

  events: {
    "TokensBought(address,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "TokensBought"): EventFragment;
}

export interface TokensBoughtEventObject {
  _buyer: string;
  amount_: BigNumber;
}
export type TokensBoughtEvent = TypedEvent<
  [string, BigNumber],
  TokensBoughtEventObject
>;

export type TokensBoughtEventFilter = TypedEventFilter<TokensBoughtEvent>;

export interface IPublicSale extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IPublicSaleInterface;

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
    buy(
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    getAvailableAmount(overrides?: CallOverrides): Promise<[BigNumber]>;

    getPrice(
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;
  };

  buy(
    _amount: PromiseOrValue<BigNumberish>,
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  getAvailableAmount(overrides?: CallOverrides): Promise<BigNumber>;

  getPrice(
    _amount: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  callStatic: {
    buy(
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    getAvailableAmount(overrides?: CallOverrides): Promise<BigNumber>;

    getPrice(
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  filters: {
    "TokensBought(address,uint256)"(
      _buyer?: PromiseOrValue<string> | null,
      amount_?: PromiseOrValue<BigNumberish> | null
    ): TokensBoughtEventFilter;
    TokensBought(
      _buyer?: PromiseOrValue<string> | null,
      amount_?: PromiseOrValue<BigNumberish> | null
    ): TokensBoughtEventFilter;
  };

  estimateGas: {
    buy(
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    getAvailableAmount(overrides?: CallOverrides): Promise<BigNumber>;

    getPrice(
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    buy(
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    getAvailableAmount(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getPrice(
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
