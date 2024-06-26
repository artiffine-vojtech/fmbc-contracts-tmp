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
  "0x608060405234801561001057600080fd5b50604051610b6f380380610b6f83398101604081905261002f916100ad565b6100383361005d565b600280546001600160a01b0319166001600160a01b03929092169190911790556100dd565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6000602082840312156100bf57600080fd5b81516001600160a01b03811681146100d657600080fd5b9392505050565b610a83806100ec6000396000f3fe608060405234801561001057600080fd5b50600436106100835760003560e01c806301ffc9a7146100885780631785f53c146100c157806324d7806c146100d65780634a41d1ac146100e95780636c19e783146100fc578063704802751461010f578063715018a6146101225780638da5cb5b1461012a578063f2fde38b14610143575b600080fd5b6100ac610096366004610831565b6001600160e01b031916631290746b60e21b1490565b60405190151581526020015b60405180910390f35b6100d46100cf366004610877565b610156565b005b6100ac6100e4366004610877565b610212565b6100ac6100f7366004610892565b61024c565b6100d461010a366004610877565b610356565b6100d461011d366004610877565b610381565b6100d461043b565b6000546001600160a01b03166040516100b89190610915565b6100d4610151366004610877565b61044f565b61015e6104c8565b6001600160a01b0381166101855760405163274338ef60e11b815260040160405180910390fd5b6001600160a01b03811660009081526001602052604090205460ff166101c95780604051630ed580c760e41b81526004016101c09190610915565b60405180910390fd5b6001600160a01b038116600081815260016020526040808220805460ff19169055517fa3b62bc36326052d97ea62d63c3d60308ed4c3ea8ac079dd8499f1e9c4f80c0f9190a250565b6001600160a01b03811660009081526001602052604081205460ff168061024657506000546001600160a01b038381169116145b92915050565b600080808061025d8587018761093f565b6040517f19457468657265756d205369676e6564204d6573736167653a0a32350000000060208201526bffffffffffffffffffffffff1960608c901b16603c8201526001600160d81b031960d885901b16605082015292955090935091506000906055016040516020818303038152906040528051906020012090508083146102ed57600094505050505061034f565b6002546001600160a01b03166103038484610522565b6001600160a01b03161461031e57600094505050505061034f565b61032b6201518042610a16565b8464ffffffffff16101561034657600094505050505061034f565b60019450505050505b9392505050565b61035f33610546565b600280546001600160a01b0319166001600160a01b0392909216919091179055565b6103896104c8565b6001600160a01b0381166103b05760405163274338ef60e11b815260040160405180910390fd5b6001600160a01b03811660009081526001602052604090205460ff16156103ec578060405163f646f2cd60e01b81526004016101c09190610915565b6001600160a01b0381166000818152600160208190526040808320805460ff1916909217909155517f44d6d25963f097ad14f29f06854a01f575648a1ef82f30e562ccd3889717e3399190a250565b6104436104c8565b61044d600061059d565b565b6104576104c8565b6001600160a01b0381166104bc5760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b60648201526084016101c0565b6104c58161059d565b50565b6000546001600160a01b0316331461044d5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064016101c0565b600080600061053185856105ed565b9150915061053e81610632565b509392505050565b6001600160a01b03811660009081526001602052604090205460ff1615801561057d57506000546001600160a01b03828116911614155b156104c55780604051636d3f049f60e01b81526004016101c09190610915565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b60008082516041036106235760208301516040840151606085015160001a61061787828585610777565b9450945050505061062b565b506000905060025b9250929050565b600081600481111561064657610646610a37565b0361064e5750565b600181600481111561066257610662610a37565b036106aa5760405162461bcd60e51b815260206004820152601860248201527745434453413a20696e76616c6964207369676e617475726560401b60448201526064016101c0565b60028160048111156106be576106be610a37565b0361070b5760405162461bcd60e51b815260206004820152601f60248201527f45434453413a20696e76616c6964207369676e6174757265206c656e6774680060448201526064016101c0565b600381600481111561071f5761071f610a37565b036104c55760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202773272076616c604482015261756560f01b60648201526084016101c0565b6000806fa2a8918ca85bafe22016d0b997e4df60600160ff1b038311156107a45750600090506003610828565b6040805160008082526020820180845289905260ff881692820192909252606081018690526080810185905260019060a0016020604051602081039080840390855afa1580156107f8573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b03811661082157600060019250925050610828565b9150600090505b94509492505050565b60006020828403121561084357600080fd5b81356001600160e01b03198116811461034f57600080fd5b80356001600160a01b038116811461087257600080fd5b919050565b60006020828403121561088957600080fd5b61034f8261085b565b6000806000604084860312156108a757600080fd5b6108b08461085b565b9250602084013567ffffffffffffffff808211156108cd57600080fd5b818601915086601f8301126108e157600080fd5b8135818111156108f057600080fd5b87602082850101111561090257600080fd5b6020830194508093505050509250925092565b6001600160a01b0391909116815260200190565b634e487b7160e01b600052604160045260246000fd5b60008060006060848603121561095457600080fd5b833564ffffffffff8116811461096957600080fd5b925060208401359150604084013567ffffffffffffffff8082111561098d57600080fd5b818601915086601f8301126109a157600080fd5b8135818111156109b3576109b3610929565b604051601f8201601f19908116603f011681019083821181831017156109db576109db610929565b816040528281528960208487010111156109f457600080fd5b8260208601602083013760006020848301015280955050505050509250925092565b8181038181111561024657634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052602160045260246000fdfea2646970667358221220a7f1ecd96b10895f8d9c96732d1c048da7597db4a1a8dd31fec5a22f59cb2f2364736f6c63430008170033";

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
