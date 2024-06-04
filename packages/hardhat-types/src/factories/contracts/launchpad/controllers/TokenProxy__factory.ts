/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../common";
import type {
  TokenProxy,
  TokenProxyInterface,
} from "../../../../contracts/launchpad/controllers/TokenProxy";

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "string",
        name: "_symbol",
        type: "string",
      },
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
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
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
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
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
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
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
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
    inputs: [],
    name: "controller",
    outputs: [
      {
        internalType: "contract ITokenIncentivesController",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
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
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_onBehalfOf",
        type: "address",
      },
    ],
    name: "deposit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "fomo",
    outputs: [
      {
        internalType: "contract IERC20",
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
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
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
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
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
        name: "_controller",
        type: "address",
      },
    ],
    name: "setController",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
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
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
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
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
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
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60a06040523480156200001157600080fd5b50604051620015af380380620015af8339810160408190526200003491620001a3565b82826003620000448382620002c1565b506004620000538282620002c1565b505050620000706200006a6200008560201b60201c565b62000089565b6001600160a01b0316608052506200038d9050565b3390565b600580546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b634e487b7160e01b600052604160045260246000fd5b600082601f8301126200010357600080fd5b81516001600160401b0380821115620001205762000120620000db565b604051601f8301601f19908116603f011681019082821181831017156200014b576200014b620000db565b81604052838152602092508660208588010111156200016957600080fd5b600091505b838210156200018d57858201830151818301840152908201906200016e565b6000602085830101528094505050505092915050565b600080600060608486031215620001b957600080fd5b83516001600160401b0380821115620001d157600080fd5b620001df87838801620000f1565b94506020860151915080821115620001f657600080fd5b506200020586828701620000f1565b604086015190935090506001600160a01b03811681146200022557600080fd5b809150509250925092565b600181811c908216806200024557607f821691505b6020821081036200026657634e487b7160e01b600052602260045260246000fd5b50919050565b601f821115620002bc576000816000526020600020601f850160051c81016020861015620002975750805b601f850160051c820191505b81811015620002b857828155600101620002a3565b5050505b505050565b81516001600160401b03811115620002dd57620002dd620000db565b620002f581620002ee845462000230565b846200026c565b602080601f8311600181146200032d5760008415620003145750858301515b600019600386901b1c1916600185901b178555620002b8565b600085815260208120601f198616915b828110156200035e578886015182559484019460019091019084016200033d565b50858210156200037d5787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b6080516111f8620003b76000396000818161027201528181610416015261046f01526111f86000f3fe608060405234801561001057600080fd5b50600436106101215760003560e01c8063715018a6116100ad578063a9059cbb11610071578063a9059cbb1461025a578063d9fca70e1461026d578063dd62ed3e14610294578063f2fde38b146102a7578063f77c4791146102ba57600080fd5b8063715018a6146101ff5780638da5cb5b1461020757806392eefe9b1461022c57806395d89b411461023f578063a457c2d71461024757600080fd5b80632e1a7d4d116100f45780632e1a7d4d1461018c578063313ce567146101a157806339509351146101b05780636e553f65146101c357806370a08231146101d657600080fd5b806306fdde0314610126578063095ea7b31461014457806318160ddd1461016757806323b872dd14610179575b600080fd5b61012e6102cd565b60405161013b9190610fe3565b60405180910390f35b610157610152366004611032565b61035f565b604051901515815260200161013b565b6002545b60405190815260200161013b565b61015761018736600461105c565b610379565b61019f61019a366004611098565b61039d565b005b6040516012815260200161013b565b6101576101be366004611032565b610440565b61019f6101d13660046110b1565b610462565b61016b6101e43660046110dd565b6001600160a01b031660009081526020819052604090205490565b61019f610517565b6005546001600160a01b03165b6040516001600160a01b03909116815260200161013b565b61019f61023a3660046110dd565b61052b565b61012e6105a9565b610157610255366004611032565b6105b8565b610157610268366004611032565b610633565b6102147f000000000000000000000000000000000000000000000000000000000000000081565b61016b6102a23660046110ff565b610641565b61019f6102b53660046110dd565b61066c565b600654610214906001600160a01b031681565b6060600380546102dc90611129565b80601f016020809104026020016040519081016040528092919081815260200182805461030890611129565b80156103555780601f1061032a57610100808354040283529160200191610355565b820191906000526020600020905b81548152906001019060200180831161033857829003601f168201915b5050505050905090565b60003361036d8185856106e2565b60019150505b92915050565b600033610387858285610807565b610392858585610881565b506001949350505050565b600654604051627b8a6760e11b8152600481018390523360248201526001600160a01b039091169062f714ce90604401600060405180830381600087803b1580156103e757600080fd5b505af11580156103fb573d6000803e3d6000fd5b505050506104093082610a25565b61043d6001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000163383610b54565b50565b60003361036d8185856104538383610641565b61045d9190611163565b6106e2565b6104976001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016333085610bb7565b6006546104ad906001600160a01b031683610bef565b600654604051636e553f6560e01b8152600481018490526001600160a01b03838116602483015290911690636e553f6590604401600060405180830381600087803b1580156104fb57600080fd5b505af115801561050f573d6000803e3d6000fd5b505050505050565b61051f610cae565b6105296000610d08565b565b610533610cae565b6006546001600160a01b0316156105875760405162461bcd60e51b8152602060048201526013602482015272105b1c9958591e481a5b9a5d1a585b1a5e9959606a1b60448201526064015b60405180910390fd5b600680546001600160a01b0319166001600160a01b0392909216919091179055565b6060600480546102dc90611129565b600033816105c68286610641565b9050838110156106265760405162461bcd60e51b815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f77604482015264207a65726f60d81b606482015260840161057e565b61039282868684036106e2565b60003361036d818585610881565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205490565b610674610cae565b6001600160a01b0381166106d95760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b606482015260840161057e565b61043d81610d08565b6001600160a01b0383166107445760405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646044820152637265737360e01b606482015260840161057e565b6001600160a01b0382166107a55760405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604482015261737360f01b606482015260840161057e565b6001600160a01b0383811660008181526001602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92591015b60405180910390a3505050565b60006108138484610641565b9050600019811461087b578181101561086e5760405162461bcd60e51b815260206004820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e6365000000604482015260640161057e565b61087b84848484036106e2565b50505050565b6001600160a01b0383166108e55760405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f206164604482015264647265737360d81b606482015260840161057e565b6001600160a01b0382166109475760405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201526265737360e81b606482015260840161057e565b6001600160a01b038316600090815260208190526040902054818110156109bf5760405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e7420657863656564732062604482015265616c616e636560d01b606482015260840161057e565b6001600160a01b03848116600081815260208181526040808320878703905593871680835291849020805487019055925185815290927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef910160405180910390a361087b565b6001600160a01b038216610a855760405162461bcd60e51b815260206004820152602160248201527f45524332303a206275726e2066726f6d20746865207a65726f206164647265736044820152607360f81b606482015260840161057e565b6001600160a01b03821660009081526020819052604090205481811015610af95760405162461bcd60e51b815260206004820152602260248201527f45524332303a206275726e20616d6f756e7420657863656564732062616c616e604482015261636560f01b606482015260840161057e565b6001600160a01b0383166000818152602081815260408083208686039055600280548790039055518581529192917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91016107fa565b505050565b6040516001600160a01b038316602482015260448101829052610b4f90849063a9059cbb60e01b906064015b60408051601f198184030181529190526020810180516001600160e01b03166001600160e01b031990931692909217909152610d5a565b6040516001600160a01b038085166024830152831660448201526064810182905261087b9085906323b872dd60e01b90608401610b80565b6001600160a01b038216610c455760405162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f206164647265737300604482015260640161057e565b8060026000828254610c579190611163565b90915550506001600160a01b038216600081815260208181526040808320805486019055518481527fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef910160405180910390a35050565b6005546001600160a01b031633146105295760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015260640161057e565b600580546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b6000610daf826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b0316610e2f9092919063ffffffff16565b9050805160001480610dd0575080806020019051810190610dd09190611184565b610b4f5760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b606482015260840161057e565b6060610e3e8484600085610e46565b949350505050565b606082471015610ea75760405162461bcd60e51b815260206004820152602660248201527f416464726573733a20696e73756666696369656e742062616c616e636520666f6044820152651c8818d85b1b60d21b606482015260840161057e565b600080866001600160a01b03168587604051610ec391906111a6565b60006040518083038185875af1925050503d8060008114610f00576040519150601f19603f3d011682016040523d82523d6000602084013e610f05565b606091505b5091509150610f1687838387610f21565b979650505050505050565b60608315610f90578251600003610f89576001600160a01b0385163b610f895760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e7472616374000000604482015260640161057e565b5081610e3e565b610e3e8383815115610fa55781518083602001fd5b8060405162461bcd60e51b815260040161057e9190610fe3565b60005b83811015610fda578181015183820152602001610fc2565b50506000910152565b6020815260008251806020840152611002816040850160208701610fbf565b601f01601f19169190910160400192915050565b80356001600160a01b038116811461102d57600080fd5b919050565b6000806040838503121561104557600080fd5b61104e83611016565b946020939093013593505050565b60008060006060848603121561107157600080fd5b61107a84611016565b925061108860208501611016565b9150604084013590509250925092565b6000602082840312156110aa57600080fd5b5035919050565b600080604083850312156110c457600080fd5b823591506110d460208401611016565b90509250929050565b6000602082840312156110ef57600080fd5b6110f882611016565b9392505050565b6000806040838503121561111257600080fd5b61111b83611016565b91506110d460208401611016565b600181811c9082168061113d57607f821691505b60208210810361115d57634e487b7160e01b600052602260045260246000fd5b50919050565b8082018082111561037357634e487b7160e01b600052601160045260246000fd5b60006020828403121561119657600080fd5b815180151581146110f857600080fd5b600082516111b8818460208701610fbf565b919091019291505056fea264697066735822122084a709cb88ad67876808e799c0e01815cfb3af7cf073477b20a2eef884e941d064736f6c63430008170033";

type TokenProxyConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: TokenProxyConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class TokenProxy__factory extends ContractFactory {
  constructor(...args: TokenProxyConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    _name: PromiseOrValue<string>,
    _symbol: PromiseOrValue<string>,
    _token: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<TokenProxy> {
    return super.deploy(
      _name,
      _symbol,
      _token,
      overrides || {}
    ) as Promise<TokenProxy>;
  }
  override getDeployTransaction(
    _name: PromiseOrValue<string>,
    _symbol: PromiseOrValue<string>,
    _token: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_name, _symbol, _token, overrides || {});
  }
  override attach(address: string): TokenProxy {
    return super.attach(address) as TokenProxy;
  }
  override connect(signer: Signer): TokenProxy__factory {
    return super.connect(signer) as TokenProxy__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): TokenProxyInterface {
    return new utils.Interface(_abi) as TokenProxyInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): TokenProxy {
    return new Contract(address, _abi, signerOrProvider) as TokenProxy;
  }
}