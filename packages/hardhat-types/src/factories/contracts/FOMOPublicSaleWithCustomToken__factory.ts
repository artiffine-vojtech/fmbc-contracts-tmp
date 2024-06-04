/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Signer,
  utils,
  Contract,
  ContractFactory,
  BigNumberish,
  Overrides,
} from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type {
  FOMOPublicSaleWithCustomToken,
  FOMOPublicSaleWithCustomTokenInterface,
} from "../../contracts/FOMOPublicSaleWithCustomToken";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_price",
        type: "uint256",
      },
      {
        internalType: "contract IERC20",
        name: "_fomoTokenAddress",
        type: "address",
      },
      {
        internalType: "contract IVesting",
        name: "_vesting",
        type: "address",
      },
      {
        internalType: "contract IERC20",
        name: "_paymentToken",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "AmountExceedsAllocation",
    type: "error",
  },
  {
    inputs: [],
    name: "AmountTooSmall",
    type: "error",
  },
  {
    inputs: [],
    name: "ArgumentIsAddressZero",
    type: "error",
  },
  {
    inputs: [],
    name: "ArgumentIsZero",
    type: "error",
  },
  {
    inputs: [],
    name: "IncorrectEtherValueSent",
    type: "error",
  },
  {
    inputs: [],
    name: "WrongTokenIdOwner",
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
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Paused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_buyer",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "amount_",
        type: "uint256",
      },
    ],
    name: "TokensBought",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Unpaused",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "buy",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "fomoToken",
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
    inputs: [],
    name: "getAvailableAmount",
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
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "getPrice",
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
    name: "paused",
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
    name: "paymentToken",
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
    inputs: [],
    name: "price",
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
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "togglePause",
    outputs: [],
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
    inputs: [],
    name: "vesting",
    outputs: [
      {
        internalType: "contract IVesting",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "withdraw",
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
      {
        internalType: "contract IERC20",
        name: "_token",
        type: "address",
      },
    ],
    name: "withdrawTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x61010060405234801561001157600080fd5b5060405162000f3438038062000f3483398101604081905261003291610167565b61003b336100ff565b6000805460ff60a01b191681558490036100685760405163821f9e4f60e01b815260040160405180910390fd5b6001600160a01b03831661008f5760405163f106f2bd60e01b815260040160405180910390fd5b6001600160a01b0382166100b65760405163f106f2bd60e01b815260040160405180910390fd5b6001600160a01b0381166100dd5760405163f106f2bd60e01b815260040160405180910390fd5b6080939093526001600160a01b0391821660a052811660c0521660e0526101bc565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6001600160a01b038116811461016457600080fd5b50565b6000806000806080858703121561017d57600080fd5b84519350602085015161018f8161014f565b60408601519093506101a08161014f565b60608601519092506101b18161014f565b939692955090935050565b60805160a05160c05160e051610d156200021f60003960008181610138015261040701526000818161017c0152818161044601526104ff01526000818160f40152818161031601526104750152600081816101ef01526105ce0152610d156000f3fe608060405234801561001057600080fd5b50600436106100ea5760003560e01c80637bb476f51161008c578063c4ae316811610066578063c4ae316814610211578063d96a094a14610219578063e75722301461022c578063f2fde38b1461023f57600080fd5b80637bb476f5146101c35780638da5cb5b146101d9578063a035b1fe146101ea57600080fd5b80633ccfd60b116100c85780633ccfd60b1461016f57806344c63eec146101775780635c975abb1461019e578063715018a6146101bb57600080fd5b80630cb12b61146100ef5780633013ce2914610133578063398d92bb1461015a575b600080fd5b6101167f000000000000000000000000000000000000000000000000000000000000000081565b6040516001600160a01b0390911681526020015b60405180910390f35b6101167f000000000000000000000000000000000000000000000000000000000000000081565b61016d610168366004610b7d565b610252565b005b61016d6102a5565b6101167f000000000000000000000000000000000000000000000000000000000000000081565b600054600160a01b900460ff16604051901515815260200161012a565b61016d6102ea565b6101cb6102fe565b60405190815260200161012a565b6000546001600160a01b0316610116565b6101cb7f000000000000000000000000000000000000000000000000000000000000000081565b61016d61038e565b61016d610227366004610bad565b6103b8565b6101cb61023a366004610bad565b610595565b61016d61024d366004610bc6565b610603565b61025a61067e565b8160000361027b5760405163821f9e4f60e01b815260040160405180910390fd5b6102a16102906000546001600160a01b031690565b6001600160a01b03831690846106d8565b5050565b6102ad61067e565b600080546040516001600160a01b03909116914780156108fc02929091818181858888f193505050501580156102e7573d6000803e3d6000fd5b50565b6102f261067e565b6102fc6000610740565b565b6040516370a0823160e01b81523060048201526000907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316906370a0823190602401602060405180830381865afa158015610365573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906103899190610bea565b905090565b61039661067e565b600054600160a01b900460ff16156103b0576102fc610790565b6102fc6107e5565b6103c0610828565b60006103ca6102fe565b9050808211156103ed576040516317ba2feb60e01b815260040160405180910390fd5b60006103f883610595565b905061042f6001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016333084610875565b60405163095ea7b360e01b81526001600160a01b037f000000000000000000000000000000000000000000000000000000000000000081166004830152602482018590527f0000000000000000000000000000000000000000000000000000000000000000169063095ea7b3906044016020604051808303816000875af11580156104be573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104e29190610c03565b5060405163df7bb46f60e01b8152600481018490523360248201527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03169063df7bb46f90604401600060405180830381600087803b15801561054b57600080fd5b505af115801561055f573d6000803e3d6000fd5b50506040518592503391507f745f661b8143944fb883f50694ebed3a871e43c451d9d4bf4648a9d551d7e47a90600090a3505050565b6000670de0b6b3a76400008210156105c05760405163617ab12d60e11b815260040160405180910390fd5b670de0b6b3a76400006105f37f000000000000000000000000000000000000000000000000000000000000000084610c25565b6105fd9190610c4a565b92915050565b61060b61067e565b6001600160a01b0381166106755760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b60648201526084015b60405180910390fd5b6102e781610740565b6000546001600160a01b031633146102fc5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015260640161066c565b6040516001600160a01b03831660248201526044810182905261073b90849063a9059cbb60e01b906064015b60408051601f198184030181529190526020810180516001600160e01b03166001600160e01b0319909316929092179091526108b3565b505050565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b610798610988565b6000805460ff60a01b191690557f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa335b6040516001600160a01b03909116815260200160405180910390a1565b6107ed610828565b6000805460ff60a01b1916600160a01b1790557f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a2586107c83390565b600054600160a01b900460ff16156102fc5760405162461bcd60e51b815260206004820152601060248201526f14185d5cd8589b194e881c185d5cd95960821b604482015260640161066c565b6040516001600160a01b03808516602483015283166044820152606481018290526108ad9085906323b872dd60e01b90608401610704565b50505050565b6000610908826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b03166109d89092919063ffffffff16565b90508051600014806109295750808060200190518101906109299190610c03565b61073b5760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b606482015260840161066c565b600054600160a01b900460ff166102fc5760405162461bcd60e51b815260206004820152601460248201527314185d5cd8589b194e881b9bdd081c185d5cd95960621b604482015260640161066c565b60606109e784846000856109ef565b949350505050565b606082471015610a505760405162461bcd60e51b815260206004820152602660248201527f416464726573733a20696e73756666696369656e742062616c616e636520666f6044820152651c8818d85b1b60d21b606482015260840161066c565b600080866001600160a01b03168587604051610a6c9190610c90565b60006040518083038185875af1925050503d8060008114610aa9576040519150601f19603f3d011682016040523d82523d6000602084013e610aae565b606091505b5091509150610abf87838387610aca565b979650505050505050565b60608315610b39578251600003610b32576001600160a01b0385163b610b325760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e7472616374000000604482015260640161066c565b50816109e7565b6109e78383815115610b4e5781518083602001fd5b8060405162461bcd60e51b815260040161066c9190610cac565b6001600160a01b03811681146102e757600080fd5b60008060408385031215610b9057600080fd5b823591506020830135610ba281610b68565b809150509250929050565b600060208284031215610bbf57600080fd5b5035919050565b600060208284031215610bd857600080fd5b8135610be381610b68565b9392505050565b600060208284031215610bfc57600080fd5b5051919050565b600060208284031215610c1557600080fd5b81518015158114610be357600080fd5b80820281158282048414176105fd57634e487b7160e01b600052601160045260246000fd5b600082610c6757634e487b7160e01b600052601260045260246000fd5b500490565b60005b83811015610c87578181015183820152602001610c6f565b50506000910152565b60008251610ca2818460208701610c6c565b9190910192915050565b6020815260008251806020840152610ccb816040850160208701610c6c565b601f01601f1916919091016040019291505056fea26469706673582212203cb56b3ea2fc60dda95627aa3572d6590c2d7d88ea59547f65a71e7944d7158164736f6c63430008170033";

type FOMOPublicSaleWithCustomTokenConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: FOMOPublicSaleWithCustomTokenConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class FOMOPublicSaleWithCustomToken__factory extends ContractFactory {
  constructor(...args: FOMOPublicSaleWithCustomTokenConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    _price: PromiseOrValue<BigNumberish>,
    _fomoTokenAddress: PromiseOrValue<string>,
    _vesting: PromiseOrValue<string>,
    _paymentToken: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<FOMOPublicSaleWithCustomToken> {
    return super.deploy(
      _price,
      _fomoTokenAddress,
      _vesting,
      _paymentToken,
      overrides || {}
    ) as Promise<FOMOPublicSaleWithCustomToken>;
  }
  override getDeployTransaction(
    _price: PromiseOrValue<BigNumberish>,
    _fomoTokenAddress: PromiseOrValue<string>,
    _vesting: PromiseOrValue<string>,
    _paymentToken: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      _price,
      _fomoTokenAddress,
      _vesting,
      _paymentToken,
      overrides || {}
    );
  }
  override attach(address: string): FOMOPublicSaleWithCustomToken {
    return super.attach(address) as FOMOPublicSaleWithCustomToken;
  }
  override connect(signer: Signer): FOMOPublicSaleWithCustomToken__factory {
    return super.connect(signer) as FOMOPublicSaleWithCustomToken__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): FOMOPublicSaleWithCustomTokenInterface {
    return new utils.Interface(_abi) as FOMOPublicSaleWithCustomTokenInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): FOMOPublicSaleWithCustomToken {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as FOMOPublicSaleWithCustomToken;
  }
}