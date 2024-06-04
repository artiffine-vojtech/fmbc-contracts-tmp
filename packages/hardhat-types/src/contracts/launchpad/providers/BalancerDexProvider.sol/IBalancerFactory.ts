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

export interface IBalancerFactoryInterface extends utils.Interface {
  functions: {
    "create(string,string,address[],uint256[],address[],uint256,address,bytes32)": FunctionFragment;
  };

  getFunction(nameOrSignatureOrTopic: "create"): FunctionFragment;

  encodeFunctionData(
    functionFragment: "create",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<string>[],
      PromiseOrValue<BigNumberish>[],
      PromiseOrValue<string>[],
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
      PromiseOrValue<BytesLike>
    ]
  ): string;

  decodeFunctionResult(functionFragment: "create", data: BytesLike): Result;

  events: {
    "PoolCreate()": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "PoolCreate"): EventFragment;
}

export interface PoolCreateEventObject {}
export type PoolCreateEvent = TypedEvent<[], PoolCreateEventObject>;

export type PoolCreateEventFilter = TypedEventFilter<PoolCreateEvent>;

export interface IBalancerFactory extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IBalancerFactoryInterface;

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
    create(
      name: PromiseOrValue<string>,
      symbol: PromiseOrValue<string>,
      tokens: PromiseOrValue<string>[],
      normalizedWeights: PromiseOrValue<BigNumberish>[],
      rateProviders: PromiseOrValue<string>[],
      swapFeePercentage: PromiseOrValue<BigNumberish>,
      owner: PromiseOrValue<string>,
      salt: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  create(
    name: PromiseOrValue<string>,
    symbol: PromiseOrValue<string>,
    tokens: PromiseOrValue<string>[],
    normalizedWeights: PromiseOrValue<BigNumberish>[],
    rateProviders: PromiseOrValue<string>[],
    swapFeePercentage: PromiseOrValue<BigNumberish>,
    owner: PromiseOrValue<string>,
    salt: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    create(
      name: PromiseOrValue<string>,
      symbol: PromiseOrValue<string>,
      tokens: PromiseOrValue<string>[],
      normalizedWeights: PromiseOrValue<BigNumberish>[],
      rateProviders: PromiseOrValue<string>[],
      swapFeePercentage: PromiseOrValue<BigNumberish>,
      owner: PromiseOrValue<string>,
      salt: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<string>;
  };

  filters: {
    "PoolCreate()"(): PoolCreateEventFilter;
    PoolCreate(): PoolCreateEventFilter;
  };

  estimateGas: {
    create(
      name: PromiseOrValue<string>,
      symbol: PromiseOrValue<string>,
      tokens: PromiseOrValue<string>[],
      normalizedWeights: PromiseOrValue<BigNumberish>[],
      rateProviders: PromiseOrValue<string>[],
      swapFeePercentage: PromiseOrValue<BigNumberish>,
      owner: PromiseOrValue<string>,
      salt: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    create(
      name: PromiseOrValue<string>,
      symbol: PromiseOrValue<string>,
      tokens: PromiseOrValue<string>[],
      normalizedWeights: PromiseOrValue<BigNumberish>[],
      rateProviders: PromiseOrValue<string>[],
      swapFeePercentage: PromiseOrValue<BigNumberish>,
      owner: PromiseOrValue<string>,
      salt: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
