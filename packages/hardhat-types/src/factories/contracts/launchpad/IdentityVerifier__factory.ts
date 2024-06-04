/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../common";
import type {
  IdentityVerifier,
  IdentityVerifierInterface,
} from "../../../contracts/launchpad/IdentityVerifier";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "signer",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "admin",
        type: "address",
      },
    ],
    name: "AdminAlreadyExists",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "admin",
        type: "address",
      },
    ],
    name: "AdminDoesNotExist",
    type: "error",
  },
  {
    inputs: [],
    name: "AdminIsAddressZero",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "caller",
        type: "address",
      },
    ],
    name: "CallerIsNotTheAdmin",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "admin",
        type: "address",
      },
    ],
    name: "AdminAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "admin",
        type: "address",
      },
    ],
    name: "AdminRemoved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_admin",
        type: "address",
      },
    ],
    name: "addAdmin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_admin",
        type: "address",
      },
    ],
    name: "isAdmin",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_admin",
        type: "address",
      },
    ],
    name: "removeAdmin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "signer",
        type: "address",
      },
    ],
    name: "setSigner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "identity",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "verify",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b50604051610b93380380610b9383398101604081905261002f916100ad565b6100383361005d565b600280546001600160a01b0319166001600160a01b03929092169190911790556100dd565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6000602082840312156100bf57600080fd5b81516001600160a01b03811681146100d657600080fd5b9392505050565b610aa7806100ec6000396000f3fe608060405234801561001057600080fd5b50600436106100935760003560e01c80636c19e783116100665780636c19e7831461010c578063704802751461011f578063715018a6146101325780638da5cb5b1461013a578063f2fde38b1461015557600080fd5b806301ffc9a7146100985780631785f53c146100d157806324d7806c146100e65780634a41d1ac146100f9575b600080fd5b6100bc6100a6366004610869565b6001600160e01b031916631290746b60e21b1490565b60405190151581526020015b60405180910390f35b6100e46100df3660046108af565b610168565b005b6100bc6100f43660046108af565b610229565b6100bc6101073660046108ca565b610263565b6100e461011a3660046108af565b61036d565b6100e461012d3660046108af565b610398565b6100e461045b565b6000546040516001600160a01b0390911681526020016100c8565b6100e46101633660046108af565b61046f565b6101706104e8565b6001600160a01b0381166101975760405163274338ef60e11b815260040160405180910390fd5b6001600160a01b03811660009081526001602052604090205460ff166101e057604051630ed580c760e41b81526001600160a01b03821660048201526024015b60405180910390fd5b6001600160a01b038116600081815260016020526040808220805460ff19169055517fa3b62bc36326052d97ea62d63c3d60308ed4c3ea8ac079dd8499f1e9c4f80c0f9190a250565b6001600160a01b03811660009081526001602052604081205460ff168061025d57506000546001600160a01b038381169116145b92915050565b600080808061027485870187610963565b6040517f19457468657265756d205369676e6564204d6573736167653a0a32350000000060208201526bffffffffffffffffffffffff1960608c901b16603c8201526001600160d81b031960d885901b1660508201529295509093509150600090605501604051602081830303815290604052805190602001209050808314610304576000945050505050610366565b6002546001600160a01b031661031a8484610542565b6001600160a01b031614610335576000945050505050610366565b6103426201518042610a3a565b8464ffffffffff16101561035d576000945050505050610366565b60019450505050505b9392505050565b61037633610566565b600280546001600160a01b0319166001600160a01b0392909216919091179055565b6103a06104e8565b6001600160a01b0381166103c75760405163274338ef60e11b815260040160405180910390fd5b6001600160a01b03811660009081526001602052604090205460ff161561040c5760405163f646f2cd60e01b81526001600160a01b03821660048201526024016101d7565b6001600160a01b0381166000818152600160208190526040808320805460ff1916909217909155517f44d6d25963f097ad14f29f06854a01f575648a1ef82f30e562ccd3889717e3399190a250565b6104636104e8565b61046d60006105c6565b565b6104776104e8565b6001600160a01b0381166104dc5760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b60648201526084016101d7565b6104e5816105c6565b50565b6000546001600160a01b0316331461046d5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064016101d7565b60008060006105518585610616565b9150915061055e8161065b565b509392505050565b6001600160a01b03811660009081526001602052604090205460ff1615801561059d57506000546001600160a01b03828116911614155b156104e557604051636d3f049f60e01b81526001600160a01b03821660048201526024016101d7565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b600080825160410361064c5760208301516040840151606085015160001a610640878285856107a5565b94509450505050610654565b506000905060025b9250929050565b600081600481111561066f5761066f610a5b565b036106775750565b600181600481111561068b5761068b610a5b565b036106d85760405162461bcd60e51b815260206004820152601860248201527f45434453413a20696e76616c6964207369676e6174757265000000000000000060448201526064016101d7565b60028160048111156106ec576106ec610a5b565b036107395760405162461bcd60e51b815260206004820152601f60248201527f45434453413a20696e76616c6964207369676e6174757265206c656e6774680060448201526064016101d7565b600381600481111561074d5761074d610a5b565b036104e55760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202773272076616c604482015261756560f01b60648201526084016101d7565b6000807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a08311156107dc5750600090506003610860565b6040805160008082526020820180845289905260ff881692820192909252606081018690526080810185905260019060a0016020604051602081039080840390855afa158015610830573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b03811661085957600060019250925050610860565b9150600090505b94509492505050565b60006020828403121561087b57600080fd5b81356001600160e01b03198116811461036657600080fd5b80356001600160a01b03811681146108aa57600080fd5b919050565b6000602082840312156108c157600080fd5b61036682610893565b6000806000604084860312156108df57600080fd5b6108e884610893565b9250602084013567ffffffffffffffff8082111561090557600080fd5b818601915086601f83011261091957600080fd5b81358181111561092857600080fd5b87602082850101111561093a57600080fd5b6020830194508093505050509250925092565b634e487b7160e01b600052604160045260246000fd5b60008060006060848603121561097857600080fd5b833564ffffffffff8116811461098d57600080fd5b925060208401359150604084013567ffffffffffffffff808211156109b157600080fd5b818601915086601f8301126109c557600080fd5b8135818111156109d7576109d761094d565b604051601f8201601f19908116603f011681019083821181831017156109ff576109ff61094d565b81604052828152896020848701011115610a1857600080fd5b8260208601602083013760006020848301015280955050505050509250925092565b8181038181111561025d57634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052602160045260246000fdfea26469706673582212204928a012f7b5f84f37c5234fc45d7483bd197eb92b05dbc2dc6b58cec15a720064736f6c63430008170033";

type IdentityVerifierConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: IdentityVerifierConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class IdentityVerifier__factory extends ContractFactory {
  constructor(...args: IdentityVerifierConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    signer: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<IdentityVerifier> {
    return super.deploy(signer, overrides || {}) as Promise<IdentityVerifier>;
  }
  override getDeployTransaction(
    signer: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(signer, overrides || {});
  }
  override attach(address: string): IdentityVerifier {
    return super.attach(address) as IdentityVerifier;
  }
  override connect(signer: Signer): IdentityVerifier__factory {
    return super.connect(signer) as IdentityVerifier__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): IdentityVerifierInterface {
    return new utils.Interface(_abi) as IdentityVerifierInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IdentityVerifier {
    return new Contract(address, _abi, signerOrProvider) as IdentityVerifier;
  }
}