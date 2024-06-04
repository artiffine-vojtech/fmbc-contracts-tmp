/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Signer,
  utils,
  Contract,
  ContractFactory,
  BytesLike,
  Overrides,
} from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type {
  MerkleProofVerifier,
  MerkleProofVerifierInterface,
} from "../../contracts/MerkleProofVerifier";

const _abi = [
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_merkleRoot",
        type: "bytes32",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "ArgumentIsAddressZero",
    type: "error",
  },
  {
    inputs: [],
    name: "ArgumentIsIndexOutOfBound",
    type: "error",
  },
  {
    inputs: [],
    name: "CallerIsNotVerifyee",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidProof",
    type: "error",
  },
  {
    inputs: [],
    name: "VerifyeeDoesNotExist",
    type: "error",
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
        name: "_verifyee",
        type: "address",
      },
    ],
    name: "addVerifyee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "isVerifyee",
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
    name: "merkleRoot",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
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
        name: "identity",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "requestId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "previewVerify",
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
        name: "_verifyee",
        type: "address",
      },
    ],
    name: "removeVerifyee",
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
        internalType: "bytes32",
        name: "_merkleRoot",
        type: "bytes32",
      },
    ],
    name: "setMerkleRoot",
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
    stateMutability: "pure",
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
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "requestId",
        type: "uint256",
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
        internalType: "bytes32[]",
        name: "proof",
        type: "bytes32[]",
      },
    ],
    name: "verifyMerkleProof",
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
  "0x608060405234801561001057600080fd5b5060405161091438038061091483398101604081905261002f91610090565b61003833610040565b6001556100a9565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6000602082840312156100a257600080fd5b5051919050565b61085c806100b86000396000f3fe608060405234801561001057600080fd5b50600436106100b45760003560e01c8063715018a611610071578063715018a6146101465780637cb647591461014e5780638da5cb5b14610161578063aa4f4a741461017c578063d1cc01511461018f578063f2fde38b146101b257600080fd5b806301ffc9a7146100b95780630deea608146100e15780632da7ff00146100f45780632eb4a7ab1461010757806337705ff91461011e57806360eb674b14610133575b600080fd5b6100cc6100c73660046105ce565b6101c5565b60405190151581526020015b60405180910390f35b6100cc6100ef366004610614565b6101fc565b6100cc610102366004610614565b61027d565b61011060015481565b6040519081526020016100d8565b61013161012c3660046106a8565b61028c565b005b6100cc61014136600461076c565b6102ee565b61013161034f565b61013161015c3660046107ba565b610363565b6000546040516001600160a01b0390911681526020016100d8565b61013161018a3660046106a8565b610370565b6100cc61019d3660046106a8565b60026020526000908152604090205460ff1681565b6101316101c03660046106a8565b6103c3565b60006001600160e01b031982166304092b2160e31b14806101f657506001600160e01b031982166301ffc9a760e01b145b92915050565b3360009081526002602052604081205460ff1661022c576040516304a904af60e11b815260040160405180910390fd5b600061023b8787878787610441565b905080156102715760008581526003602090815260408083206001600160a01b038b1684529091529020805460ff191660011790555b90505b95945050505050565b60006102718686868686610441565b610294610499565b6001600160a01b03811660009081526002602052604090205460ff166102cd5760405163caa3041f60e01b815260040160405180910390fd5b6001600160a01b03166000908152600260205260409020805460ff19169055565b6040516bffffffffffffffffffffffff19606084901b166020820152600090819060340160405160208183030381529060405280519060200120905061033783600154836104f3565b6103455760009150506101f6565b5060019392505050565b610357610499565b6103616000610509565b565b61036b610499565b600155565b610378610499565b6001600160a01b03811661039f5760405163f106f2bd60e01b815260040160405180910390fd5b6001600160a01b03166000908152600260205260409020805460ff19166001179055565b6103cb610499565b6001600160a01b0381166104355760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b60648201526084015b60405180910390fd5b61043e81610509565b50565b60008381526003602090815260408083206001600160a01b038916845290915281205460ff161561047457506000610274565b6000610482838501856107d3565b905061048e87826102ee565b979650505050505050565b6000546001600160a01b031633146103615760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015260640161042c565b6000826105008584610559565b14949350505050565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b600081815b84518110156105945761058a8286838151811061057d5761057d610810565b602002602001015161059c565b915060010161055e565b509392505050565b60008183106105b85760008281526020849052604090206105c7565b60008381526020839052604090205b9392505050565b6000602082840312156105e057600080fd5b81356001600160e01b0319811681146105c757600080fd5b80356001600160a01b038116811461060f57600080fd5b919050565b60008060008060006080868803121561062c57600080fd5b610635866105f8565b94506020860135935060408601359250606086013567ffffffffffffffff8082111561066057600080fd5b818801915088601f83011261067457600080fd5b81358181111561068357600080fd5b89602082850101111561069557600080fd5b9699959850939650602001949392505050565b6000602082840312156106ba57600080fd5b6105c7826105f8565b634e487b7160e01b600052604160045260246000fd5b600082601f8301126106ea57600080fd5b8135602067ffffffffffffffff80831115610707576107076106c3565b8260051b604051601f19603f8301168101818110848211171561072c5761072c6106c3565b604052938452602081870181019490810192508785111561074c57600080fd5b6020870191505b8482101561048e57813583529183019190830190610753565b6000806040838503121561077f57600080fd5b610788836105f8565b9150602083013567ffffffffffffffff8111156107a457600080fd5b6107b0858286016106d9565b9150509250929050565b6000602082840312156107cc57600080fd5b5035919050565b6000602082840312156107e557600080fd5b813567ffffffffffffffff8111156107fc57600080fd5b610808848285016106d9565b949350505050565b634e487b7160e01b600052603260045260246000fdfea264697066735822122013e856c2ad7f34c3f8d748afe8745d27ff43b838037f0a657e9f1961f7c7e1a664736f6c63430008170033";

type MerkleProofVerifierConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: MerkleProofVerifierConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class MerkleProofVerifier__factory extends ContractFactory {
  constructor(...args: MerkleProofVerifierConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    _merkleRoot: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<MerkleProofVerifier> {
    return super.deploy(
      _merkleRoot,
      overrides || {}
    ) as Promise<MerkleProofVerifier>;
  }
  override getDeployTransaction(
    _merkleRoot: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_merkleRoot, overrides || {});
  }
  override attach(address: string): MerkleProofVerifier {
    return super.attach(address) as MerkleProofVerifier;
  }
  override connect(signer: Signer): MerkleProofVerifier__factory {
    return super.connect(signer) as MerkleProofVerifier__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MerkleProofVerifierInterface {
    return new utils.Interface(_abi) as MerkleProofVerifierInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MerkleProofVerifier {
    return new Contract(address, _abi, signerOrProvider) as MerkleProofVerifier;
  }
}
