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
  AirdropNFTHolders,
  AirdropNFTHoldersInterface,
} from "../../contracts/AirdropNFTHolders";

const _abi = [
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "_fomoTokenAddress",
        type: "address",
      },
      {
        internalType: "contract IIdentityVerifier",
        name: "_verifier",
        type: "address",
      },
      {
        internalType: "contract INFTAirdropVesting",
        name: "_vesting",
        type: "address",
      },
      {
        internalType: "contract INFTWithLevel",
        name: "_boosterNFT",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_baseAmount",
        type: "uint256",
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
    name: "ArgumentIsZero",
    type: "error",
  },
  {
    inputs: [],
    name: "VerificationFailed",
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
        name: "_identity",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "TokensClaimed",
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
    inputs: [],
    name: "baseAmount",
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
    name: "boosterNFT",
    outputs: [
      {
        internalType: "contract INFTWithLevel",
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
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "claim",
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
    name: "verifier",
    outputs: [
      {
        internalType: "contract IIdentityVerifier",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "vesting",
    outputs: [
      {
        internalType: "contract INFTAirdropVesting",
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
  "0x6101206040523480156200001257600080fd5b50604051620010db380380620010db8339810160408190526200003591620001a2565b620000403362000139565b6000805460ff60a01b191690556001600160a01b038516620000755760405163f106f2bd60e01b815260040160405180910390fd5b6001600160a01b0384166200009d5760405163f106f2bd60e01b815260040160405180910390fd5b6001600160a01b038316620000c55760405163f106f2bd60e01b815260040160405180910390fd5b6001600160a01b038216620000ed5760405163f106f2bd60e01b815260040160405180910390fd5b806000036200010f5760405163821f9e4f60e01b815260040160405180910390fd5b6001600160a01b0394851660805292841660a05290831660c05290911660e0526101005262000216565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6001600160a01b03811681146200019f57600080fd5b50565b600080600080600060a08688031215620001bb57600080fd5b8551620001c88162000189565b6020870151909550620001db8162000189565b6040870151909450620001ee8162000189565b6060870151909350620002018162000189565b80925050608086015190509295509295909350565b60805160a05160c05160e05161010051610e576200028460003960008181610188015261074a0152600081816101e2015261090f015260008181610161015281816103d601526104a501526000818161011d015261031101526000818160d901526104080152610e576000f3fe608060405234801561001057600080fd5b50600436106100cf5760003560e01c80635c975abb1161008c5780638da5cb5b116100665780638da5cb5b146102045780638f0bc15214610215578063c4ae316814610228578063f2fde38b1461023057600080fd5b80635c975abb146101b8578063715018a6146101d5578063821c4043146101dd57600080fd5b80630cb12b61146100d45780632b7ac3f314610118578063398d92bb1461013f5780633ccfd60b1461015457806344c63eec1461015c5780634864d14014610183575b600080fd5b6100fb7f000000000000000000000000000000000000000000000000000000000000000081565b6040516001600160a01b0390911681526020015b60405180910390f35b6100fb7f000000000000000000000000000000000000000000000000000000000000000081565b61015261014d366004610c04565b610243565b005b610152610296565b6100fb7f000000000000000000000000000000000000000000000000000000000000000081565b6101aa7f000000000000000000000000000000000000000000000000000000000000000081565b60405190815260200161010f565b600054600160a01b900460ff16604051901515815260200161010f565b6101526102db565b6100fb7f000000000000000000000000000000000000000000000000000000000000000081565b6000546001600160a01b03166100fb565b610152610223366004610c34565b6102ef565b610152610541565b61015261023e366004610cbd565b61056b565b61024b6105e6565b8160000361026c5760405163821f9e4f60e01b815260040160405180910390fd5b6102926102816000546001600160a01b031690565b6001600160a01b0383169084610640565b5050565b61029e6105e6565b600080546040516001600160a01b03909116914780156108fc02929091818181858888f193505050501580156102d8573d6000803e3d6000fd5b50565b6102e36105e6565b6102ed6000610697565b565b6102f76106e7565b6040516301bdd4c160e31b81526000906001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001690630deea6089061035190889088906201869f9089908990600401610cda565b6020604051808303816000875af1158015610370573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906103949190610d26565b9050806103b45760405163439cc0cd60e01b815260040160405180910390fd5b60006103bf85610734565b60405163095ea7b360e01b81526001600160a01b037f000000000000000000000000000000000000000000000000000000000000000081166004830152602482018390529192507f00000000000000000000000000000000000000000000000000000000000000009091169063095ea7b3906044016020604051808303816000875af1158015610453573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104779190610d26565b50604051631b7e947560e21b8152600481018290526001600160a01b038781166024830152604482018790527f00000000000000000000000000000000000000000000000000000000000000001690636dfa51d490606401600060405180830381600087803b1580156104e957600080fd5b505af11580156104fd573d6000803e3d6000fd5b505050508085876001600160a01b03167f9923b4306c6c030f2bdfbf156517d5983b87e15b96176da122cd4f2effa4ba7b60405160405180910390a4505050505050565b6105496105e6565b600054600160a01b900460ff1615610563576102ed61077f565b6102ed6107d4565b6105736105e6565b6001600160a01b0381166105dd5760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b60648201526084015b60405180910390fd5b6102d881610697565b6000546001600160a01b031633146102ed5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064016105d4565b604080516001600160a01b038416602482015260448082018490528251808303909101815260649091019091526020810180516001600160e01b031663a9059cbb60e01b179052610692908490610817565b505050565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b600054600160a01b900460ff16156102ed5760405162461bcd60e51b815260206004820152601060248201526f14185d5cd8589b194e881c185d5cd95960821b60448201526064016105d4565b600080610740836108ec565b9050600a61076e827f0000000000000000000000000000000000000000000000000000000000000000610d48565b6107789190610d73565b9392505050565b610787610a0f565b6000805460ff60a01b191690557f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa335b6040516001600160a01b03909116815260200160405180910390a1565b6107dc6106e7565b6000805460ff60a01b1916600160a01b1790557f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a2586107b73390565b600061086c826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b0316610a5f9092919063ffffffff16565b905080516000148061088d57508080602001905181019061088d9190610d26565b6106925760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b60648201526084016105d4565b604051630284a7a560e51b81526004810182905260009081906001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001690635094f4a090602401602060405180830381865afa158015610956573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061097a9190610d95565b90508060000361098d5750603292915050565b8060010361099e5750602892915050565b806002036109af5750601e92915050565b806003036109c05750601492915050565b806004036109d15750600f92915050565b60405162461bcd60e51b8152602060048201526013602482015272125b9d985b1a59081d1bdad95b881b195d995b606a1b60448201526064016105d4565b600054600160a01b900460ff166102ed5760405162461bcd60e51b815260206004820152601460248201527314185d5cd8589b194e881b9bdd081c185d5cd95960621b60448201526064016105d4565b6060610a6e8484600085610a76565b949350505050565b606082471015610ad75760405162461bcd60e51b815260206004820152602660248201527f416464726573733a20696e73756666696369656e742062616c616e636520666f6044820152651c8818d85b1b60d21b60648201526084016105d4565b600080866001600160a01b03168587604051610af39190610dd2565b60006040518083038185875af1925050503d8060008114610b30576040519150601f19603f3d011682016040523d82523d6000602084013e610b35565b606091505b5091509150610b4687838387610b51565b979650505050505050565b60608315610bc0578251600003610bb9576001600160a01b0385163b610bb95760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e747261637400000060448201526064016105d4565b5081610a6e565b610a6e8383815115610bd55781518083602001fd5b8060405162461bcd60e51b81526004016105d49190610dee565b6001600160a01b03811681146102d857600080fd5b60008060408385031215610c1757600080fd5b823591506020830135610c2981610bef565b809150509250929050565b60008060008060608587031215610c4a57600080fd5b8435610c5581610bef565b935060208501359250604085013567ffffffffffffffff80821115610c7957600080fd5b818701915087601f830112610c8d57600080fd5b813581811115610c9c57600080fd5b886020828501011115610cae57600080fd5b95989497505060200194505050565b600060208284031215610ccf57600080fd5b813561077881610bef565b60018060a01b038616815284602082015283604082015260806060820152816080820152818360a0830137600081830160a090810191909152601f909201601f19160101949350505050565b600060208284031215610d3857600080fd5b8151801515811461077857600080fd5b8082028115828204841417610d6d57634e487b7160e01b600052601160045260246000fd5b92915050565b600082610d9057634e487b7160e01b600052601260045260246000fd5b500490565b600060208284031215610da757600080fd5b5051919050565b60005b83811015610dc9578181015183820152602001610db1565b50506000910152565b60008251610de4818460208701610dae565b9190910192915050565b6020815260008251806020840152610e0d816040850160208701610dae565b601f01601f1916919091016040019291505056fea26469706673582212205f429dca249c06a16f781cf004e8c037a50252af2afbd0b38164d5030303066264736f6c63430008170033";

type AirdropNFTHoldersConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: AirdropNFTHoldersConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class AirdropNFTHolders__factory extends ContractFactory {
  constructor(...args: AirdropNFTHoldersConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    _fomoTokenAddress: PromiseOrValue<string>,
    _verifier: PromiseOrValue<string>,
    _vesting: PromiseOrValue<string>,
    _boosterNFT: PromiseOrValue<string>,
    _baseAmount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<AirdropNFTHolders> {
    return super.deploy(
      _fomoTokenAddress,
      _verifier,
      _vesting,
      _boosterNFT,
      _baseAmount,
      overrides || {}
    ) as Promise<AirdropNFTHolders>;
  }
  override getDeployTransaction(
    _fomoTokenAddress: PromiseOrValue<string>,
    _verifier: PromiseOrValue<string>,
    _vesting: PromiseOrValue<string>,
    _boosterNFT: PromiseOrValue<string>,
    _baseAmount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      _fomoTokenAddress,
      _verifier,
      _vesting,
      _boosterNFT,
      _baseAmount,
      overrides || {}
    );
  }
  override attach(address: string): AirdropNFTHolders {
    return super.attach(address) as AirdropNFTHolders;
  }
  override connect(signer: Signer): AirdropNFTHolders__factory {
    return super.connect(signer) as AirdropNFTHolders__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): AirdropNFTHoldersInterface {
    return new utils.Interface(_abi) as AirdropNFTHoldersInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): AirdropNFTHolders {
    return new Contract(address, _abi, signerOrProvider) as AirdropNFTHolders;
  }
}
