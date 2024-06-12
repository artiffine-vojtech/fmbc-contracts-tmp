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
} from "../../../common";

export declare namespace ILaunchCommon {
  export type LaunchConfigVarsStruct = {
    name: PromiseOrValue<string>;
    symbol: PromiseOrValue<string>;
    totalSupply: PromiseOrValue<BigNumberish>;
    hardCap: PromiseOrValue<BigNumberish>;
    team: PromiseOrValue<string>;
    x: PromiseOrValue<string>;
    allocations: PromiseOrValue<BigNumberish>[];
    rewardsAllocations: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>
    ];
    rounds: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>
    ];
    dexIndex: PromiseOrValue<BigNumberish>;
    steakTeamFee: PromiseOrValue<BigNumberish>;
  };

  export type LaunchConfigVarsStructOutput = [
    string,
    string,
    BigNumber,
    BigNumber,
    string,
    string,
    BigNumber[],
    [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber],
    [BigNumber, BigNumber, BigNumber],
    BigNumber,
    BigNumber
  ] & {
    name: string;
    symbol: string;
    totalSupply: BigNumber;
    hardCap: BigNumber;
    team: string;
    x: string;
    allocations: BigNumber[];
    rewardsAllocations: [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber];
    rounds: [BigNumber, BigNumber, BigNumber];
    dexIndex: BigNumber;
    steakTeamFee: BigNumber;
  };
}

export interface ILaunchpadInterface extends utils.Interface {
  functions: {
    "addDexProvider(address)": FunctionFragment;
    "claimTokens(uint256)": FunctionFragment;
    "createLaunch((string,string,uint256,uint256,address,address,uint256[6],uint256[5],uint256[3],uint256,uint256),bool,bytes)": FunctionFragment;
    "getFundsBack(uint256,bool)": FunctionFragment;
    "launch(uint256)": FunctionFragment;
    "pledge(uint256,uint256,bool,bytes)": FunctionFragment;
    "pledgeWithNFT(uint256,uint256,bool,uint256,address,bytes)": FunctionFragment;
    "setControllerFactory(address)": FunctionFragment;
    "setFomoIC(address)": FunctionFragment;
    "setKolAddresses(address[],bool[])": FunctionFragment;
    "setMemePlatformFee(uint256)": FunctionFragment;
    "setPledgeLimits(uint256,uint256)": FunctionFragment;
    "setPledgeLimitsForKOLs(uint256,uint256)": FunctionFragment;
    "setSoftCapAndFees(uint256,uint256)": FunctionFragment;
    "setSteakIC(address)": FunctionFragment;
    "setSteakPlatformFee(uint256)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "addDexProvider"
      | "claimTokens"
      | "createLaunch"
      | "getFundsBack"
      | "launch"
      | "pledge"
      | "pledgeWithNFT"
      | "setControllerFactory"
      | "setFomoIC"
      | "setKolAddresses"
      | "setMemePlatformFee"
      | "setPledgeLimits"
      | "setPledgeLimitsForKOLs"
      | "setSoftCapAndFees"
      | "setSteakIC"
      | "setSteakPlatformFee"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "addDexProvider",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "claimTokens",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "createLaunch",
    values: [
      ILaunchCommon.LaunchConfigVarsStruct,
      PromiseOrValue<boolean>,
      PromiseOrValue<BytesLike>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "getFundsBack",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<boolean>]
  ): string;
  encodeFunctionData(
    functionFragment: "launch",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "pledge",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<boolean>,
      PromiseOrValue<BytesLike>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "pledgeWithNFT",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<boolean>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
      PromiseOrValue<BytesLike>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "setControllerFactory",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "setFomoIC",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "setKolAddresses",
    values: [PromiseOrValue<string>[], PromiseOrValue<boolean>[]]
  ): string;
  encodeFunctionData(
    functionFragment: "setMemePlatformFee",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "setPledgeLimits",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "setPledgeLimitsForKOLs",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "setSoftCapAndFees",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "setSteakIC",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "setSteakPlatformFee",
    values: [PromiseOrValue<BigNumberish>]
  ): string;

  decodeFunctionResult(
    functionFragment: "addDexProvider",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "claimTokens",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "createLaunch",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getFundsBack",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "launch", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "pledge", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "pledgeWithNFT",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setControllerFactory",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setFomoIC", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setKolAddresses",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setMemePlatformFee",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setPledgeLimits",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setPledgeLimitsForKOLs",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setSoftCapAndFees",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setSteakIC", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setSteakPlatformFee",
    data: BytesLike
  ): Result;

  events: {
    "HardCapReached(uint256)": EventFragment;
    "LaunchCreated(string,string,uint256)": EventFragment;
    "Pledged(uint256,address,uint256,uint256)": EventFragment;
    "PledgedWithNFT(uint256,address,uint256,uint256,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "HardCapReached"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "LaunchCreated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Pledged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "PledgedWithNFT"): EventFragment;
}

export interface HardCapReachedEventObject {
  launchId: BigNumber;
}
export type HardCapReachedEvent = TypedEvent<
  [BigNumber],
  HardCapReachedEventObject
>;

export type HardCapReachedEventFilter = TypedEventFilter<HardCapReachedEvent>;

export interface LaunchCreatedEventObject {
  name: string;
  symbol: string;
  launchId: BigNumber;
}
export type LaunchCreatedEvent = TypedEvent<
  [string, string, BigNumber],
  LaunchCreatedEventObject
>;

export type LaunchCreatedEventFilter = TypedEventFilter<LaunchCreatedEvent>;

export interface PledgedEventObject {
  launchId: BigNumber;
  user: string;
  amountLP: BigNumber;
  amountUsdc: BigNumber;
}
export type PledgedEvent = TypedEvent<
  [BigNumber, string, BigNumber, BigNumber],
  PledgedEventObject
>;

export type PledgedEventFilter = TypedEventFilter<PledgedEvent>;

export interface PledgedWithNFTEventObject {
  launchId: BigNumber;
  user: string;
  amountLP: BigNumber;
  amountUsdc: BigNumber;
  nftId: BigNumber;
}
export type PledgedWithNFTEvent = TypedEvent<
  [BigNumber, string, BigNumber, BigNumber, BigNumber],
  PledgedWithNFTEventObject
>;

export type PledgedWithNFTEventFilter = TypedEventFilter<PledgedWithNFTEvent>;

export interface ILaunchpad extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: ILaunchpadInterface;

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
    addDexProvider(
      _dexProvider: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    claimTokens(
      _launchId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    createLaunch(
      _config: ILaunchCommon.LaunchConfigVarsStruct,
      _staked: PromiseOrValue<boolean>,
      _data: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    getFundsBack(
      _launchId: PromiseOrValue<BigNumberish>,
      _stake: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    launch(
      _launchId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    pledge(
      _launchId: PromiseOrValue<BigNumberish>,
      _amount: PromiseOrValue<BigNumberish>,
      _staked: PromiseOrValue<boolean>,
      _data: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    pledgeWithNFT(
      _launchId: PromiseOrValue<BigNumberish>,
      _amount: PromiseOrValue<BigNumberish>,
      _staked: PromiseOrValue<boolean>,
      _nftId: PromiseOrValue<BigNumberish>,
      _controllerWithNFT: PromiseOrValue<string>,
      _data: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setControllerFactory(
      _controllerFactory: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setFomoIC(
      _fomoIC: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setKolAddresses(
      _kolAddresses: PromiseOrValue<string>[],
      _isKol: PromiseOrValue<boolean>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setMemePlatformFee(
      _fee: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setPledgeLimits(
      _min: PromiseOrValue<BigNumberish>,
      _max: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setPledgeLimitsForKOLs(
      _min: PromiseOrValue<BigNumberish>,
      _max: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setSoftCapAndFees(
      _softCap: PromiseOrValue<BigNumberish>,
      _launchFee: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setSteakIC(
      _steakIC: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setSteakPlatformFee(
      _fee: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  addDexProvider(
    _dexProvider: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  claimTokens(
    _launchId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  createLaunch(
    _config: ILaunchCommon.LaunchConfigVarsStruct,
    _staked: PromiseOrValue<boolean>,
    _data: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  getFundsBack(
    _launchId: PromiseOrValue<BigNumberish>,
    _stake: PromiseOrValue<boolean>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  launch(
    _launchId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  pledge(
    _launchId: PromiseOrValue<BigNumberish>,
    _amount: PromiseOrValue<BigNumberish>,
    _staked: PromiseOrValue<boolean>,
    _data: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  pledgeWithNFT(
    _launchId: PromiseOrValue<BigNumberish>,
    _amount: PromiseOrValue<BigNumberish>,
    _staked: PromiseOrValue<boolean>,
    _nftId: PromiseOrValue<BigNumberish>,
    _controllerWithNFT: PromiseOrValue<string>,
    _data: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setControllerFactory(
    _controllerFactory: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setFomoIC(
    _fomoIC: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setKolAddresses(
    _kolAddresses: PromiseOrValue<string>[],
    _isKol: PromiseOrValue<boolean>[],
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setMemePlatformFee(
    _fee: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setPledgeLimits(
    _min: PromiseOrValue<BigNumberish>,
    _max: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setPledgeLimitsForKOLs(
    _min: PromiseOrValue<BigNumberish>,
    _max: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setSoftCapAndFees(
    _softCap: PromiseOrValue<BigNumberish>,
    _launchFee: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setSteakIC(
    _steakIC: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setSteakPlatformFee(
    _fee: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    addDexProvider(
      _dexProvider: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    claimTokens(
      _launchId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    createLaunch(
      _config: ILaunchCommon.LaunchConfigVarsStruct,
      _staked: PromiseOrValue<boolean>,
      _data: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<void>;

    getFundsBack(
      _launchId: PromiseOrValue<BigNumberish>,
      _stake: PromiseOrValue<boolean>,
      overrides?: CallOverrides
    ): Promise<void>;

    launch(
      _launchId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    pledge(
      _launchId: PromiseOrValue<BigNumberish>,
      _amount: PromiseOrValue<BigNumberish>,
      _staked: PromiseOrValue<boolean>,
      _data: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<void>;

    pledgeWithNFT(
      _launchId: PromiseOrValue<BigNumberish>,
      _amount: PromiseOrValue<BigNumberish>,
      _staked: PromiseOrValue<boolean>,
      _nftId: PromiseOrValue<BigNumberish>,
      _controllerWithNFT: PromiseOrValue<string>,
      _data: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<void>;

    setControllerFactory(
      _controllerFactory: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    setFomoIC(
      _fomoIC: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    setKolAddresses(
      _kolAddresses: PromiseOrValue<string>[],
      _isKol: PromiseOrValue<boolean>[],
      overrides?: CallOverrides
    ): Promise<void>;

    setMemePlatformFee(
      _fee: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    setPledgeLimits(
      _min: PromiseOrValue<BigNumberish>,
      _max: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    setPledgeLimitsForKOLs(
      _min: PromiseOrValue<BigNumberish>,
      _max: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    setSoftCapAndFees(
      _softCap: PromiseOrValue<BigNumberish>,
      _launchFee: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    setSteakIC(
      _steakIC: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    setSteakPlatformFee(
      _fee: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "HardCapReached(uint256)"(
      launchId?: PromiseOrValue<BigNumberish> | null
    ): HardCapReachedEventFilter;
    HardCapReached(
      launchId?: PromiseOrValue<BigNumberish> | null
    ): HardCapReachedEventFilter;

    "LaunchCreated(string,string,uint256)"(
      name?: PromiseOrValue<string> | null,
      symbol?: PromiseOrValue<string> | null,
      launchId?: PromiseOrValue<BigNumberish> | null
    ): LaunchCreatedEventFilter;
    LaunchCreated(
      name?: PromiseOrValue<string> | null,
      symbol?: PromiseOrValue<string> | null,
      launchId?: PromiseOrValue<BigNumberish> | null
    ): LaunchCreatedEventFilter;

    "Pledged(uint256,address,uint256,uint256)"(
      launchId?: PromiseOrValue<BigNumberish> | null,
      user?: PromiseOrValue<string> | null,
      amountLP?: null,
      amountUsdc?: null
    ): PledgedEventFilter;
    Pledged(
      launchId?: PromiseOrValue<BigNumberish> | null,
      user?: PromiseOrValue<string> | null,
      amountLP?: null,
      amountUsdc?: null
    ): PledgedEventFilter;

    "PledgedWithNFT(uint256,address,uint256,uint256,uint256)"(
      launchId?: PromiseOrValue<BigNumberish> | null,
      user?: PromiseOrValue<string> | null,
      amountLP?: null,
      amountUsdc?: null,
      nftId?: PromiseOrValue<BigNumberish> | null
    ): PledgedWithNFTEventFilter;
    PledgedWithNFT(
      launchId?: PromiseOrValue<BigNumberish> | null,
      user?: PromiseOrValue<string> | null,
      amountLP?: null,
      amountUsdc?: null,
      nftId?: PromiseOrValue<BigNumberish> | null
    ): PledgedWithNFTEventFilter;
  };

  estimateGas: {
    addDexProvider(
      _dexProvider: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    claimTokens(
      _launchId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    createLaunch(
      _config: ILaunchCommon.LaunchConfigVarsStruct,
      _staked: PromiseOrValue<boolean>,
      _data: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    getFundsBack(
      _launchId: PromiseOrValue<BigNumberish>,
      _stake: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    launch(
      _launchId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    pledge(
      _launchId: PromiseOrValue<BigNumberish>,
      _amount: PromiseOrValue<BigNumberish>,
      _staked: PromiseOrValue<boolean>,
      _data: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    pledgeWithNFT(
      _launchId: PromiseOrValue<BigNumberish>,
      _amount: PromiseOrValue<BigNumberish>,
      _staked: PromiseOrValue<boolean>,
      _nftId: PromiseOrValue<BigNumberish>,
      _controllerWithNFT: PromiseOrValue<string>,
      _data: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setControllerFactory(
      _controllerFactory: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setFomoIC(
      _fomoIC: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setKolAddresses(
      _kolAddresses: PromiseOrValue<string>[],
      _isKol: PromiseOrValue<boolean>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setMemePlatformFee(
      _fee: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setPledgeLimits(
      _min: PromiseOrValue<BigNumberish>,
      _max: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setPledgeLimitsForKOLs(
      _min: PromiseOrValue<BigNumberish>,
      _max: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setSoftCapAndFees(
      _softCap: PromiseOrValue<BigNumberish>,
      _launchFee: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setSteakIC(
      _steakIC: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setSteakPlatformFee(
      _fee: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    addDexProvider(
      _dexProvider: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    claimTokens(
      _launchId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    createLaunch(
      _config: ILaunchCommon.LaunchConfigVarsStruct,
      _staked: PromiseOrValue<boolean>,
      _data: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    getFundsBack(
      _launchId: PromiseOrValue<BigNumberish>,
      _stake: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    launch(
      _launchId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    pledge(
      _launchId: PromiseOrValue<BigNumberish>,
      _amount: PromiseOrValue<BigNumberish>,
      _staked: PromiseOrValue<boolean>,
      _data: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    pledgeWithNFT(
      _launchId: PromiseOrValue<BigNumberish>,
      _amount: PromiseOrValue<BigNumberish>,
      _staked: PromiseOrValue<boolean>,
      _nftId: PromiseOrValue<BigNumberish>,
      _controllerWithNFT: PromiseOrValue<string>,
      _data: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setControllerFactory(
      _controllerFactory: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setFomoIC(
      _fomoIC: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setKolAddresses(
      _kolAddresses: PromiseOrValue<string>[],
      _isKol: PromiseOrValue<boolean>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setMemePlatformFee(
      _fee: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setPledgeLimits(
      _min: PromiseOrValue<BigNumberish>,
      _max: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setPledgeLimitsForKOLs(
      _min: PromiseOrValue<BigNumberish>,
      _max: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setSoftCapAndFees(
      _softCap: PromiseOrValue<BigNumberish>,
      _launchFee: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setSteakIC(
      _steakIC: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setSteakPlatformFee(
      _fee: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
