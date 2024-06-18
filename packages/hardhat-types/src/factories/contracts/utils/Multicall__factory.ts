/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../common";
import type {
  Multicall,
  MulticallInterface,
} from "../../../contracts/utils/Multicall";

const _abi = [
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "target",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "callData",
            type: "bytes",
          },
        ],
        internalType: "struct Multicall.Call[]",
        name: "calls",
        type: "tuple[]",
      },
    ],
    name: "aggregate",
    outputs: [
      {
        internalType: "uint256",
        name: "blockNumber",
        type: "uint256",
      },
      {
        internalType: "bytes[]",
        name: "returnData",
        type: "bytes[]",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "blockNumber",
        type: "uint256",
      },
    ],
    name: "getBlockHash",
    outputs: [
      {
        internalType: "bytes32",
        name: "blockHash",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getCurrentBlockCoinbase",
    outputs: [
      {
        internalType: "address",
        name: "coinbase",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getCurrentBlockDifficulty",
    outputs: [
      {
        internalType: "uint256",
        name: "difficulty",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getCurrentBlockGasLimit",
    outputs: [
      {
        internalType: "uint256",
        name: "gaslimit",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getCurrentBlockTimestamp",
    outputs: [
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "addr",
        type: "address",
      },
    ],
    name: "getEthBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "balance",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getLastBlockHash",
    outputs: [
      {
        internalType: "bytes32",
        name: "blockHash",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b506105a4806100206000396000f3fe608060405234801561001057600080fd5b50600436106100785760003560e01c80630f28c97d1461007d578063252dba421461009257806327e86d6e146100b35780634d2301cc146100bb57806372425d9d146100d657806386d516e8146100dc578063a8b0574e146100e2578063ee82ac5e146100f0575b600080fd5b425b6040519081526020015b60405180910390f35b6100a56100a03660046102d6565b610102565b604051610089929190610458565b61007f610237565b61007f6100c93660046104da565b6001600160a01b03163190565b4461007f565b4561007f565b604051418152602001610089565b61007f6100fe3660046104fc565b4090565b8051439060609067ffffffffffffffff8111156101215761012161024a565b60405190808252806020026020018201604052801561015457816020015b606081526020019060019003908161013f5790505b50905060005b83518110156102315760008085838151811061017857610178610515565b6020026020010151600001516001600160a01b031686848151811061019f5761019f610515565b6020026020010151602001516040516101b8919061052b565b6000604051808303816000865af19150503d80600081146101f5576040519150601f19603f3d011682016040523d82523d6000602084013e6101fa565b606091505b50915091508161020957600080fd5b8084848151811061021c5761021c610515565b6020908102919091010152505060010161015a565b50915091565b6000610244600143610547565b40905090565b634e487b7160e01b600052604160045260246000fd5b6040805190810167ffffffffffffffff811182821017156102835761028361024a565b60405290565b604051601f8201601f1916810167ffffffffffffffff811182821017156102b2576102b261024a565b604052919050565b80356001600160a01b03811681146102d157600080fd5b919050565b600060208083850312156102e957600080fd5b823567ffffffffffffffff8082111561030157600080fd5b818501915085601f83011261031557600080fd5b8135818111156103275761032761024a565b8060051b610336858201610289565b918252838101850191858101908984111561035057600080fd5b86860192505b838310156104275782358581111561036e5760008081fd5b86016040601f19828d0381018213156103875760008081fd5b61038f610260565b61039a8b85016102ba565b815282840135898111156103ae5760008081fd5b8085019450508d603f8501126103c45760008081fd5b8a840135898111156103d8576103d861024a565b6103e88c84601f84011601610289565b92508083528e848287010111156103ff5760008081fd5b808486018d85013760009083018c0152808b0191909152845250509186019190860190610356565b9998505050505050505050565b60005b8381101561044f578181015183820152602001610437565b50506000910152565b600060408201848352602060408185015281855180845260608601915060608160051b870101935082870160005b828110156104cc57878603605f19018452815180518088526104ad81888a01898501610434565b601f01601f191696909601850195509284019290840190600101610486565b509398975050505050505050565b6000602082840312156104ec57600080fd5b6104f5826102ba565b9392505050565b60006020828403121561050e57600080fd5b5035919050565b634e487b7160e01b600052603260045260246000fd5b6000825161053d818460208701610434565b9190910192915050565b8181038181111561056857634e487b7160e01b600052601160045260246000fd5b9291505056fea2646970667358221220bb98c6148ce73d84317f34e561e5d661193d3ab41391877247557fae9ba2704764736f6c63430008170033";

type MulticallConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: MulticallConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Multicall__factory extends ContractFactory {
  constructor(...args: MulticallConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<Multicall> {
    return super.deploy(overrides || {}) as Promise<Multicall>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): Multicall {
    return super.attach(address) as Multicall;
  }
  override connect(signer: Signer): Multicall__factory {
    return super.connect(signer) as Multicall__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MulticallInterface {
    return new utils.Interface(_abi) as MulticallInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Multicall {
    return new Contract(address, _abi, signerOrProvider) as Multicall;
  }
}
