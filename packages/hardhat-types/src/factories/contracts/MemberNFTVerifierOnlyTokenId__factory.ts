/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type {
  MemberNFTVerifierOnlyTokenId,
  MemberNFTVerifierOnlyTokenIdInterface,
} from "../../contracts/MemberNFTVerifierOnlyTokenId";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_collection",
        type: "address",
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
        name: "_controller",
        type: "address",
      },
    ],
    name: "addIncentivesController",
    outputs: [],
    stateMutability: "nonpayable",
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
    name: "addVerifyee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "collection",
    outputs: [
      {
        internalType: "contract IERC721",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getIncentivesControllersCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
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
        name: "user",
        type: "address",
      },
    ],
    name: "getStakedNFTIds",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "incentivesControllers",
    outputs: [
      {
        internalType: "contract IncentivesController",
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
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "removeIncentivesController",
    outputs: [],
    stateMutability: "nonpayable",
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
] as const;

const _bytecode =
  "0x60a06040523480156200001157600080fd5b5060405162000f5b38038062000f5b8339810160408190526200003491620001aa565b6200003f336200006e565b62000052816380ac58cd60e01b620000be565b6200005c57600080fd5b6001600160a01b0316608052620001d5565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6000620000cb83620000e6565b8015620000df5750620000df83836200011f565b9392505050565b6000620000fb826301ffc9a760e01b6200011f565b801562000119575062000117826001600160e01b03196200011f565b155b92915050565b604080516001600160e01b03198316602480830191909152825180830390910181526044909101909152602080820180516001600160e01b03166301ffc9a760e01b178152825160009392849283928392918391908a617530fa92503d9150600051905082801562000192575060208210155b80156200019f5750600081115b979650505050505050565b600060208284031215620001bd57600080fd5b81516001600160a01b0381168114620000df57600080fd5b608051610d63620001f8600039600081816101d901526107ed0152610d636000f3fe608060405234801561001057600080fd5b50600436106100f55760003560e01c8063715018a611610097578063aa4f4a7411610066578063aa4f4a741461020c578063d1cc01511461021f578063e9763f0e14610242578063f2fde38b1461025557600080fd5b8063715018a6146101ac5780637301d2c2146101b45780637de1e536146101d45780638da5cb5b146101fb57600080fd5b80632da7ff00116100d35780632da7ff001461016057806332465b711461017357806337705ff914610188578063676eda551461019b57600080fd5b806301ffc9a7146100fa5780630deea6081461012257806315a1553914610135575b600080fd5b61010d610108366004610a20565b610268565b60405190151581526020015b60405180910390f35b61010d610130366004610a5f565b61029f565b610148610143366004610af5565b610313565b6040516001600160a01b039091168152602001610119565b61010d61016e366004610b24565b61033d565b610186610181366004610af5565b610353565b005b610186610196366004610bfb565b61042c565b600154604051908152602001610119565b61018661048e565b6101c76101c2366004610bfb565b6104a2565b6040516101199190610c18565b6101487f000000000000000000000000000000000000000000000000000000000000000081565b6000546001600160a01b0316610148565b61018661021a366004610bfb565b610666565b61010d61022d366004610bfb565b60026020526000908152604090205460ff1681565b610186610250366004610bfb565b6106b9565b610186610263366004610bfb565b610739565b60006001600160e01b031982166304092b2160e31b148061029957506001600160e01b031982166301ffc9a760e01b145b92915050565b3360009081526002602052604081205460ff166102cf576040516304a904af60e11b815260040160405180910390fd5b60006102dc8787876107b7565b905080156103095760008581526003602090815260408083208984529091529020805460ff191660011790555b9695505050505050565b6001818154811061032357600080fd5b6000918252602090912001546001600160a01b0316905081565b600061034a8585856107b7565b95945050505050565b61035b6108a4565b600154811061037d57604051636d9317c560e01b815260040160405180910390fd5b6001805461038c908290610c72565b8154811061039c5761039c610c85565b600091825260209091200154600180546001600160a01b0390921691839081106103c8576103c8610c85565b9060005260206000200160006101000a8154816001600160a01b0302191690836001600160a01b03160217905550600180548061040757610407610c9b565b600082815260209020810160001990810180546001600160a01b031916905501905550565b6104346108a4565b6001600160a01b03811660009081526002602052604090205460ff1661046d5760405163caa3041f60e01b815260040160405180910390fd5b6001600160a01b03166000908152600260205260409020805460ff19169055565b6104966108a4565b6104a060006108fe565b565b60015460609060009067ffffffffffffffff8111156104c3576104c3610b0e565b6040519080825280602002602001820160405280156104ec578160200160208202803683370190505b5090506000805b6001548110156105cb576000806001838154811061051357610513610c85565b6000918252602090912001546040516327e235e360e01b81526001600160a01b038981166004830152909116906327e235e390602401608060405180830381865afa158015610566573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061058a9190610cb1565b93509350505080156105c1578185856105a281610cf7565b9650815181106105b4576105b4610c85565b6020026020010181815250505b50506001016104f3565b5060008167ffffffffffffffff8111156105e7576105e7610b0e565b604051908082528060200260200182016040528015610610578160200160208202803683370190505b50905060005b8281101561065d5783818151811061063057610630610c85565b602002602001015182828151811061064a5761064a610c85565b6020908102919091010152600101610616565b50949350505050565b61066e6108a4565b6001600160a01b0381166106955760405163f106f2bd60e01b815260040160405180910390fd5b6001600160a01b03166000908152600260205260409020805460ff19166001179055565b6106c16108a4565b6001600160a01b0381166106e85760405163f106f2bd60e01b815260040160405180910390fd5b6001805480820182556000919091527fb10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cf60180546001600160a01b0319166001600160a01b0392909216919091179055565b6107416108a4565b6001600160a01b0381166107ab5760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b60648201526084015b60405180910390fd5b6107b4816108fe565b50565b600081815260036020908152604080832085845290915281205460ff16156107e15750600061089d565b836001600160a01b03167f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316636352211e856040518263ffffffff1660e01b815260040161083991815260200190565b602060405180830381865afa158015610856573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061087a9190610d10565b6001600160a01b0316036108905750600161089d565b61089a848461094e565b90505b9392505050565b6000546001600160a01b031633146104a05760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064016107a2565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6000805b600154811015610a16576000806001838154811061097257610972610c85565b6000918252602090912001546040516327e235e360e01b81526001600160a01b038881166004830152909116906327e235e390602401608060405180830381865afa1580156109c5573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906109e99190610cb1565b9350935050508080156109fb57508482145b15610a0c5760019350505050610299565b5050600101610952565b5060009392505050565b600060208284031215610a3257600080fd5b81356001600160e01b03198116811461089d57600080fd5b6001600160a01b03811681146107b457600080fd5b600080600080600060808688031215610a7757600080fd5b8535610a8281610a4a565b94506020860135935060408601359250606086013567ffffffffffffffff80821115610aad57600080fd5b818801915088601f830112610ac157600080fd5b813581811115610ad057600080fd5b896020828501011115610ae257600080fd5b9699959850939650602001949392505050565b600060208284031215610b0757600080fd5b5035919050565b634e487b7160e01b600052604160045260246000fd5b60008060008060808587031215610b3a57600080fd5b8435610b4581610a4a565b93506020850135925060408501359150606085013567ffffffffffffffff80821115610b7057600080fd5b818701915087601f830112610b8457600080fd5b813581811115610b9657610b96610b0e565b604051601f8201601f19908116603f01168101908382118183101715610bbe57610bbe610b0e565b816040528281528a6020848701011115610bd757600080fd5b82602086016020830137600060208483010152809550505050505092959194509250565b600060208284031215610c0d57600080fd5b813561089d81610a4a565b6020808252825182820181905260009190848201906040850190845b81811015610c5057835183529284019291840191600101610c34565b50909695505050505050565b634e487b7160e01b600052601160045260246000fd5b8181038181111561029957610299610c5c565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052603160045260246000fd5b60008060008060808587031215610cc757600080fd5b84519350602085015192506040850151915060608501518015158114610cec57600080fd5b939692955090935050565b600060018201610d0957610d09610c5c565b5060010190565b600060208284031215610d2257600080fd5b815161089d81610a4a56fea26469706673582212203b5e1e76930802c7269e85c18a533c36ca8da33724a0ae571df60c75fd03c35864736f6c63430008170033";

type MemberNFTVerifierOnlyTokenIdConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: MemberNFTVerifierOnlyTokenIdConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class MemberNFTVerifierOnlyTokenId__factory extends ContractFactory {
  constructor(...args: MemberNFTVerifierOnlyTokenIdConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    _collection: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<MemberNFTVerifierOnlyTokenId> {
    return super.deploy(
      _collection,
      overrides || {}
    ) as Promise<MemberNFTVerifierOnlyTokenId>;
  }
  override getDeployTransaction(
    _collection: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_collection, overrides || {});
  }
  override attach(address: string): MemberNFTVerifierOnlyTokenId {
    return super.attach(address) as MemberNFTVerifierOnlyTokenId;
  }
  override connect(signer: Signer): MemberNFTVerifierOnlyTokenId__factory {
    return super.connect(signer) as MemberNFTVerifierOnlyTokenId__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MemberNFTVerifierOnlyTokenIdInterface {
    return new utils.Interface(_abi) as MemberNFTVerifierOnlyTokenIdInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MemberNFTVerifierOnlyTokenId {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as MemberNFTVerifierOnlyTokenId;
  }
}