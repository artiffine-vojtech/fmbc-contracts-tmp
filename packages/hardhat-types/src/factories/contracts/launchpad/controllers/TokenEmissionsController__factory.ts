/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../common";
import type {
  TokenEmissionsController,
  TokenEmissionsControllerInterface,
} from "../../../../contracts/launchpad/controllers/TokenEmissionsController";

const _abi = [
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "_stakingToken",
        type: "address",
      },
      {
        internalType: "contract INFTWithLevel",
        name: "_boosterNFT",
        type: "address",
      },
      {
        internalType: "address",
        name: "_rewardToken",
        type: "address",
      },
      {
        internalType: "address",
        name: "_withdrawingAdmin",
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
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "scaled",
        type: "uint256",
      },
    ],
    name: "Deposited",
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
        name: "user",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "rewardsToken",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "reward",
        type: "uint256",
      },
    ],
    name: "RewardPaid",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "scaled",
        type: "uint256",
      },
    ],
    name: "Withdrawn",
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
        name: "_rewardToken",
        type: "address",
      },
    ],
    name: "addReward",
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
    name: "balances",
    outputs: [
      {
        internalType: "uint256",
        name: "staked",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "lockScaled",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "scaled",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "nftId",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "boosted",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "lockBoost",
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
        name: "_account",
        type: "address",
      },
    ],
    name: "claimableRewards",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "token",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
        ],
        internalType: "struct ITokenControllerCommons.RewardData[]",
        name: "claimable",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "currentEmissionsIndex",
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
      {
        internalType: "enum ITokenControllerCommons.LockTime",
        name: "_lock",
        type: "uint8",
      },
    ],
    name: "deposit",
    outputs: [],
    stateMutability: "nonpayable",
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
    name: "emissions",
    outputs: [
      {
        internalType: "uint256",
        name: "duration",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "emissionsStart",
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
        internalType: "address[]",
        name: "_rewardTokens",
        type: "address[]",
      },
    ],
    name: "getReward",
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
    inputs: [
      {
        internalType: "address",
        name: "_rewardsToken",
        type: "address",
      },
    ],
    name: "lastTimeRewardApplicable",
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
        internalType: "address[]",
        name: "_rewardTokens",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "_amounts",
        type: "uint256[]",
      },
      {
        internalType: "uint256",
        name: "_rewardsDuration",
        type: "uint256",
      },
    ],
    name: "notifyReward",
    outputs: [],
    stateMutability: "nonpayable",
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
        name: "",
        type: "address",
      },
    ],
    name: "rewardData",
    outputs: [
      {
        internalType: "uint256",
        name: "periodFinish",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "rewardRate",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "lastUpdateTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "rewardPerTokenStored",
        type: "uint256",
      },
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
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "rewardTokens",
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
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "rewards",
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
    name: "rewardsDuration",
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
        name: "_tokenId",
        type: "uint256",
      },
    ],
    name: "stakeNFT",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "stakingToken",
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
        components: [
          {
            internalType: "uint256",
            name: "duration",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
        ],
        internalType: "struct ITokenControllerCommons.EmissionPoint[]",
        name: "_emissions",
        type: "tuple[]",
      },
    ],
    name: "startEmissions",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "totalScaled",
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
    name: "unstakeNFT",
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
    name: "userLockTime",
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
      {
        internalType: "address",
        name: "_onBehalfOf",
        type: "address",
      },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "withdrawingAdmin",
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
] as const;

const _bytecode =
  "0x60e06040523480156200001157600080fd5b5060405162002d7438038062002d748339810160408190526200003491620001cf565b6200003f3362000073565b6001600160a01b03808516608052831660c0526200005d82620000c3565b6001600160a01b031660a0525062000237915050565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6080516001600160a01b0316816001600160a01b0316036200012b5760405162461bcd60e51b815260206004820152601b60248201527f5374616b696e6720746f6b656e206973206e6f74207265776172640000000000604482015260640160405180910390fd5b6001600160a01b038116600090815260086020526040902060020154156200015257600080fd5b600a8054600181019091557fc65a7bb8d6351c1cf70c95a316cc6a92839c986682d98bc35f958f4883f9d2a80180546001600160a01b039092166001600160a01b031990921682179055600090815260086020526040902042600282018190559055565b6001600160a01b0381168114620001cc57600080fd5b50565b60008060008060808587031215620001e657600080fd5b8451620001f381620001b6565b60208601519094506200020681620001b6565b60408601519093506200021981620001b6565b60608601519092506200022c81620001b6565b939692955090935050565b60805160a05160c051612ad56200029f6000396000818161041a01528181610eb2015281816110e80152818161193d0152611e01015260008181610441015261054e0152600081816103ac0152818161081301528181610e3401526121520152612ad56000f3fe608060405234801561001057600080fd5b50600436106101ce5760003560e01c806372f702f3116101045780639c9b2e21116100a2578063e0a747fe11610071578063e0a747fe146104e2578063e5acbe21146104ea578063e70b9e27146104f3578063f2fde38b1461051e57600080fd5b80639c9b2e2114610474578063a36cfb6d14610487578063cb6da6701461049a578063dc01f60d146104c257600080fd5b80637fd7d062116100de5780637fd7d06214610402578063821c4043146104155780638d2a876a1461043c5780638da5cb5b1461046357600080fd5b806372f702f3146103a757806373feac2a146103e65780637bb7bed1146103ef57600080fd5b806348e5d9f811610171578063654cfdff1161014b578063654cfdff146103665780636eb604e014610379578063704802751461038c578063715018a61461039f57600080fd5b806348e5d9f8146102ce5780635a9a93fc14610333578063638634ee1461035357600080fd5b80631785f53c116101ad5780631785f53c1461021757806324d7806c1461022a57806327e235e31461024d578063386a9525146102c557600080fd5b8062f714ce146101d35780630a3136d0146101e85780630b3562dc14610204575b600080fd5b6101e66101e13660046125d1565b610531565b005b6101f160035481565b6040519081526020015b60405180910390f35b6101e6610212366004612671565b610885565b6101e6610225366004612733565b610b6a565b61023d610238366004612733565b610c26565b60405190151581526020016101fb565b61029661025b366004612733565b600960205260009081526040902080546001820154600283015460038401546004850154600590950154939492939192909160ff9091169086565b6040805196875260208701959095529385019290925260608401521515608083015260a082015260c0016101fb565b6101f160065481565b61030b6102dc366004612733565b600860205260009081526040902080546001820154600283015460038401546004909401549293919290919085565b604080519586526020860194909452928401919091526060830152608082015260a0016101fb565b6101f1610341366004612733565b60056020526000908152604090205481565b6101f1610361366004612733565b610c60565b6101e6610374366004612750565b610c8f565b6101e6610387366004612779565b610e9c565b6101e661039a366004612733565b611187565b6101e661124a565b6103ce7f000000000000000000000000000000000000000000000000000000000000000081565b6040516001600160a01b0390911681526020016101fb565b6101f160045481565b6103ce6103fd366004612779565b61125e565b6101e66104103660046127de565b611288565b6103ce7f000000000000000000000000000000000000000000000000000000000000000081565b6103ce7f000000000000000000000000000000000000000000000000000000000000000081565b6000546001600160a01b03166103ce565b6101e6610482366004612733565b61134d565b6101e6610495366004612820565b611361565b6104ad6104a8366004612779565b6115e5565b604080519283526020830191909152016101fb565b6104d56104d0366004612733565b611613565b6040516101fb9190612894565b6101e66117a9565b6101f1600b5481565b6101f16105013660046128ec565b600760209081526000928352604080842090915290825290205481565b6101e661052c366004612733565b6119e1565b336001600160a01b03821614806105705750336001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016145b6105b95760405162461bcd60e51b81526020600482015260156024820152742737ba103bb4ba34323930bbb4b7339030b236b4b760591b60448201526064015b60405180910390fd5b6001600160a01b03811660009081526005602052604090205442101561060a5760405162461bcd60e51b8152602060048201526006602482015265131bd8dad95960d21b60448201526064016105b0565b6001600160a01b038116600090815260096020526040902080548311156106735760405162461bcd60e51b815260206004820152601a60248201527f416d6f756e742067726561746572207468616e207374616b656400000000000060448201526064016105b0565b6106d782600a8054806020026020016040519081016040528092919081815260200182805480156106cd57602002820191906000526020600020905b81546001600160a01b031681526001909101906020018083116106af575b5050505050611a57565b6001600160a01b038216330361074a5761074a600a80548060200260200160405190810160405280929190818152602001828054801561074057602002820191906000526020600020905b81546001600160a01b03168152600190910190602001808311610722575b5050505050611ca2565b600061076e600a610768846005015487611dc690919063ffffffff16565b90611dd2565b600483015490915060ff16156107a257600061078d8360030154611dde565b905061079e600a6107688484611dc6565b9150505b815484036107b857506002810154600060058301555b81546107c49085611f01565b80835560058301546107dd91600a916107689190611dc6565b600183015560028201546107f19082611f01565b6002830155600b546108039082611f01565b600b5561083a6001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000163386611f0d565b60408051858152602081018390526001600160a01b038516917f92ccf450a286a957af52509bc1c9939d1a6a481783e142e41e2499f0bb66ebc691015b60405180910390a250505050565b600254156108d55760405162461bcd60e51b815260206004820152601960248201527f456d697373696f6e7320616c726561647920737461727465640000000000000060448201526064016105b0565b60008151116109155760405162461bcd60e51b815260206004820152600c60248201526b4e6f20656d697373696f6e7360a01b60448201526064016105b0565b80516000805b82811015610a215760008482815181106109375761093761291a565b60200260200101516000015111801561096d5750600084828151811061095f5761095f61291a565b602002602001015160200151115b6109ac5760405162461bcd60e51b815260206004820152601060248201526f24b73b30b634b21032b6b4b9b9b4b7b760811b60448201526064016105b0565b8381815181106109be576109be61291a565b602002602001015160200151826109d59190612946565b915060028482815181106109eb576109eb61291a565b6020908102919091018101518254600181810185556000948552938390208251600290920201908155910151908201550161091b565b5042600481905550610a60333083600a600081548110610a4357610a4361291a565b6000918252602090912001546001600160a01b0316929190611f70565b610a8f600260035481548110610a7857610a7861291a565b906000526020600020906002020160000154611fa8565b600060086000600a600081548110610aa957610aa961291a565b60009182526020808320909101546001600160a01b03168352820192909252604001902060035460028054929350918110610ae657610ae661291a565b9060005260206000209060020201600101548160040181905550610b64600a600081548110610b1757610b1761291a565b9060005260206000200160009054906101000a90046001600160a01b0316600260035481548110610b4a57610b4a61291a565b906000526020600020906002020160010154600654611ff0565b50505050565b610b7261209a565b6001600160a01b038116610b995760405163274338ef60e11b815260040160405180910390fd5b6001600160a01b03811660009081526001602052604090205460ff16610bdd57604051630ed580c760e41b81526001600160a01b03821660048201526024016105b0565b6001600160a01b038116600081815260016020526040808220805460ff19169055517fa3b62bc36326052d97ea62d63c3d60308ed4c3ea8ac079dd8499f1e9c4f80c0f9190a250565b6001600160a01b03811660009081526001602052604081205460ff1680610c5a57506000546001600160a01b038381169116145b92915050565b6001600160a01b038116600090815260086020526040812054428111610c865780610c88565b425b9392505050565b60008211610cd05760405162461bcd60e51b815260206004820152600e60248201526d416d6f756e74206973207a65726f60901b60448201526064016105b0565b610d3233600a8054806020026020016040519081016040528092919081815260200182805480156106cd576020028201919060005260206000209081546001600160a01b031681526001909101906020018083116106af575050505050611a57565b3360009081526009602052604090208054610d4d90846120f4565b8155610d77600a610d716005856002811115610d6b57610d6b612959565b90611dc6565b906120f4565b600582018190558154610d9091600a9161076891611dc6565b60018201819055600482015460ff1615610dc8576000610db38360030154611dde565b9050610dc4600a6107688484611dc6565b9150505b610de581610d718460020154600b54611f0190919063ffffffff16565b600b556002808301829055610e1b90610e0e9062278d00908690811115610d6b57610d6b612959565b610d7142624f1a006120f4565b33600081815260056020526040902091909155610e64907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316903087611f70565b604080518581526020810183905233917f73a19dd210f1a7f902193214c0ee91dd35ee5b4d920cba8d519eca65a7b488ca9101610877565b6040516331a9108f60e11b8152600481018290527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031690636352211e90602401602060405180830381865afa158015610f01573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610f25919061296f565b6001600160a01b0316336001600160a01b031614610f795760405162461bcd60e51b815260206004820152601160248201527026bab9ba1031329027232a1037bbb732b960791b60448201526064016105b0565b610fdb33600a8054806020026020016040519081016040528092919081815260200182805480156106cd576020028201919060005260206000209081546001600160a01b031681526001909101906020018083116106af575050505050611a57565b336000908152600960205260409020600481015460ff161561103f5760405162461bcd60e51b815260206004820152601760248201527f42616c616e636520616c726561647920626f6f7374656400000000000000000060448201526064016105b0565b600061104a83611dde565b9050600061106a600a610768848660010154611dc690919063ffffffff16565b9050600083600101548261107e919061298c565b600b5490915061108e90826120f4565b600b5560028401546110a090826120f4565b6002850155600384018590556004808501805460ff191660011790556040516323b872dd60e01b81523391810191909152306024820152604481018690526001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016906323b872dd90606401600060405180830381600087803b15801561112c57600080fd5b505af1158015611140573d6000803e3d6000fd5b50506040805160008152602081018590523393507f73a19dd210f1a7f902193214c0ee91dd35ee5b4d920cba8d519eca65a7b488ca92500160405180910390a25050505050565b61118f61209a565b6001600160a01b0381166111b65760405163274338ef60e11b815260040160405180910390fd5b6001600160a01b03811660009081526001602052604090205460ff16156111fb5760405163f646f2cd60e01b81526001600160a01b03821660048201526024016105b0565b6001600160a01b0381166000818152600160208190526040808320805460ff1916909217909155517f44d6d25963f097ad14f29f06854a01f575648a1ef82f30e562ccd3889717e3399190a250565b61125261209a565b61125c6000612100565b565b600a818154811061126e57600080fd5b6000918252602090912001546001600160a01b0316905081565b336000908152600560205260409020544210156112d05760405162461bcd60e51b8152602060048201526006602482015265131bd8dad95960d21b60448201526064016105b0565b61130d33838380806020026020016040519081016040528093929190818152602001838360200280828437600092019190915250611a5792505050565b611349828280806020026020016040519081016040528093929190818152602001838360200280828437600092019190915250611ca292505050565b5050565b61135561209a565b61135e81612150565b50565b61136a3361225b565b600081116113ad5760405162461bcd60e51b815260206004820152601060248201526f4475726174696f6e206973207a65726f60801b60448201526064016105b0565b8382146113ec5760405162461bcd60e51b815260206004820152600d60248201526c125b9d985b1a59081a5b9c1d5d609a1b60448201526064016105b0565b61142930868680806020026020016040519081016040528093929190818152602001838360200280828437600092019190915250611a5792505050565b8360005b818110156115dc5760008787838181106114495761144961291a565b905060200201602081019061145e9190612733565b9050600a6000815481106114745761147461291a565b6000918252602090912001546001600160a01b039081169082160361149957506115d4565b6001600160a01b038116600090815260086020526040902080546114f65760405162461bcd60e51b81526020600482015260146024820152732ab735b737bbb7103932bbb0b932103a37b5b2b760611b60448201526064016105b0565b61152e333089898781811061150d5761150d61291a565b90506020020135856001600160a01b0316611f70909392919063ffffffff16565b6004808201546040516370a0823160e01b815230928101929092526000916115ac91906001600160a01b038616906370a0823190602401602060405180830381865afa158015611582573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906115a6919061299f565b90611f01565b90506115b9838288611ff0565b60048201546115c890826120f4565b82600401819055505050505b60010161142d565b50505050505050565b600281815481106115f557600080fd5b60009182526020909120600290910201805460019091015490915082565b600a5460609067ffffffffffffffff81111561163157611631612601565b60405190808252806020026020018201604052801561167657816020015b604080518082019091526000808252602082015281526020019060019003908161164f5790505b50905060005b81518110156117a357600a81815481106116985761169861291a565b9060005260206000200160009054906101000a90046001600160a01b03168282815181106116c8576116c861291a565b6020026020010151600001906001600160a01b031690816001600160a01b03168152505061177b64e8d4a510006107688585858151811061170b5761170b61291a565b60200260200101516000015160096000896001600160a01b03166001600160a01b0316815260200190815260200160002060020154611776600a88815481106117565761175661291a565b600091825260209091200154600b546001600160a01b03909116906122bb565b612353565b82828151811061178d5761178d61291a565b602090810291909101810151015260010161167c565b50919050565b61180b33600a8054806020026020016040519081016040528092919081815260200182805480156106cd576020028201919060005260206000209081546001600160a01b031681526001909101906020018083116106af575050505050611a57565b33600090815260056020526040902054421061188257611882600a805480602002602001604051908101604052809291908181526020018280548015610740576020028201919060005260206000209081546001600160a01b03168152600190910190602001808311610722575050505050611ca2565b336000908152600960205260409020600481015460ff166118d65760405162461bcd60e51b815260206004820152600e60248201526d139195081b9bdd081cdd185ad95960921b60448201526064016105b0565b6000816001015482600201546118ec919061298c565b600b549091506118fc9082611f01565b600b55600182015460028301556004808301805460ff1916905560038301546040516323b872dd60e01b8152309281019290925233602483015260448201527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316906323b872dd90606401600060405180830381600087803b15801561198957600080fd5b505af115801561199d573d6000803e3d6000fd5b50506040805160008152602081018590523393507f92ccf450a286a957af52509bc1c9939d1a6a481783e142e41e2499f0bb66ebc692500160405180910390a25050565b6119e961209a565b6001600160a01b038116611a4e5760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b60648201526084016105b0565b61135e81612100565b805160005b81811015610b64576000838281518110611a7857611a7861291a565b6020908102919091018101516001600160a01b038116600090815260089092526040909120805491925090611ae65760405162461bcd60e51b81526020600482015260146024820152732ab735b737bbb7103932bbb0b932103a37b5b2b760611b60448201526064016105b0565b6000611af483600b546122bb565b600383018190559050611b0683610c60565b60028301556001600160a01b0387163014611b86576001600160a01b038716600090815260096020526040902060020154611b45908890859084612353565b6001600160a01b03808916600081815260076020908152604080832094891680845294825280832095909555918152600c8252838120928152919052208190555b600a600081548110611b9a57611b9a61291a565b6000918252602090912001546001600160a01b038481169116148015611bc1575060025415155b15611c97576000600260035481548110611bdd57611bdd61291a565b90600052602060002090600202019050611c0681600001546004546120f490919063ffffffff16565b4210611c955760038054906000611c1c836129b8565b90915550506002546003541015611c9557600260035481548110611c4257611c4261291a565b9060005260206000209060020201905042600481905550611c74816001015484600401546120f490919063ffffffff16565b60048401558054611c8490611fa8565b611c95848260010154600654611ff0565b505b505050600101611a5c565b805160005b81811015611dc1576000838281518110611cc357611cc361291a565b6020908102919091018101513360009081526007835260408082206001600160a01b038416835290935291822054909250611d039064e8d4a51000611dd2565b6001600160a01b0383166000908152600860205260409020600481015491925090611d2e9083611f01565b60048201556000829003611d4457505050611db9565b3360008181526007602090815260408083206001600160a01b0388168085529252822091909155611d759184611f0d565b6040518281526001600160a01b0384169033907f540798df468d7b23d11f156fdb954cb19ad414d150722a7b6d55ba369dea792e9060200160405180910390a35050505b600101611ca7565b505050565b6000610c8882846129d1565b6000610c8882846129e8565b604051630284a7a560e51b81526004810182905260009081906001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001690635094f4a090602401602060405180830381865afa158015611e48573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611e6c919061299f565b905080600003611e7f5750600f92915050565b80600103611e905750600e92915050565b80600203611ea15750600d92915050565b80600303611eb25750600c92915050565b80600403611ec35750600b92915050565b60405162461bcd60e51b8152602060048201526013602482015272125b9d985b1a59081d1bdad95b881b195d995b606a1b60448201526064016105b0565b6000610c88828461298c565b6040516001600160a01b038316602482015260448101829052611dc190849063a9059cbb60e01b906064015b60408051601f198184030181529190526020810180516001600160e01b03166001600160e01b0319909316929092179091526123c4565b6040516001600160a01b0380851660248301528316604482015260648101829052610b649085906323b872dd60e01b90608401611f39565b60008111611feb5760405162461bcd60e51b815260206004820152601060248201526f4475726174696f6e206973207a65726f60801b60448201526064016105b0565b600655565b6001600160a01b03831660009081526008602052604090208054421061202d57612023826107688564e8d4a51000611dc6565b6001820155612081565b805460009061203c9042611f01565b9050600061206064e8d4a51000610768856001015485611dc690919063ffffffff16565b90506120798461076864e8d4a51000610d6b89866120f4565b600184015550505b426002820181905561209390836120f4565b9055505050565b6000546001600160a01b0316331461125c5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064016105b0565b6000610c888284612946565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316816001600160a01b0316036121d15760405162461bcd60e51b815260206004820152601b60248201527f5374616b696e6720746f6b656e206973206e6f7420726577617264000000000060448201526064016105b0565b6001600160a01b038116600090815260086020526040902060020154156121f757600080fd5b600a8054600181019091557fc65a7bb8d6351c1cf70c95a316cc6a92839c986682d98bc35f958f4883f9d2a80180546001600160a01b039092166001600160a01b031990921682179055600090815260086020526040902042600282018190559055565b6001600160a01b03811660009081526001602052604090205460ff1615801561229257506000546001600160a01b03828116911614155b1561135e57604051636d3f049f60e01b81526001600160a01b03821660048201526024016105b0565b6000816000036122e757506001600160a01b038216600090815260086020526040902060030154610c5a565b6001600160a01b03831660009081526008602052604090206001810154600290910154610c889161233191859161076891670de0b6b3a764000091610d6b9182906115a68c610c60565b6001600160a01b038516600090815260086020526040902060030154906120f4565b6001600160a01b03808516600081815260076020908152604080832094881680845294825280832054938352600c8252808320948352939052918220546123b99190610d7190670de0b6b3a764000090610768906123b2908890611f01565b8890611dc6565b90505b949350505050565b6000612419826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b03166124999092919063ffffffff16565b905080516000148061243a57508080602001905181019061243a9190612a0a565b611dc15760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b60648201526084016105b0565b60606123bc848460008585600080866001600160a01b031685876040516124c09190612a50565b60006040518083038185875af1925050503d80600081146124fd576040519150601f19603f3d011682016040523d82523d6000602084013e612502565b606091505b50915091506125138783838761251e565b979650505050505050565b6060831561258d578251600003612586576001600160a01b0385163b6125865760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e747261637400000060448201526064016105b0565b50816123bc565b6123bc83838151156125a25781518083602001fd5b8060405162461bcd60e51b81526004016105b09190612a6c565b6001600160a01b038116811461135e57600080fd5b600080604083850312156125e457600080fd5b8235915060208301356125f6816125bc565b809150509250929050565b634e487b7160e01b600052604160045260246000fd5b6040805190810167ffffffffffffffff8111828210171561263a5761263a612601565b60405290565b604051601f8201601f1916810167ffffffffffffffff8111828210171561266957612669612601565b604052919050565b6000602080838503121561268457600080fd5b823567ffffffffffffffff8082111561269c57600080fd5b818501915085601f8301126126b057600080fd5b8135818111156126c2576126c2612601565b6126d0848260051b01612640565b818152848101925060069190911b8301840190878211156126f057600080fd5b928401925b81841015612513576040848903121561270e5760008081fd5b612716612617565b8435815285850135868201528352604090930192918401916126f5565b60006020828403121561274557600080fd5b8135610c88816125bc565b6000806040838503121561276357600080fd5b823591506020830135600381106125f657600080fd5b60006020828403121561278b57600080fd5b5035919050565b60008083601f8401126127a457600080fd5b50813567ffffffffffffffff8111156127bc57600080fd5b6020830191508360208260051b85010111156127d757600080fd5b9250929050565b600080602083850312156127f157600080fd5b823567ffffffffffffffff81111561280857600080fd5b61281485828601612792565b90969095509350505050565b60008060008060006060868803121561283857600080fd5b853567ffffffffffffffff8082111561285057600080fd5b61285c89838a01612792565b9097509550602088013591508082111561287557600080fd5b5061288288828901612792565b96999598509660400135949350505050565b602080825282518282018190526000919060409081850190868401855b828110156128df57815180516001600160a01b031685528601518685015292840192908501906001016128b1565b5091979650505050505050565b600080604083850312156128ff57600080fd5b823561290a816125bc565b915060208301356125f6816125bc565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b80820180821115610c5a57610c5a612930565b634e487b7160e01b600052602160045260246000fd5b60006020828403121561298157600080fd5b8151610c88816125bc565b81810381811115610c5a57610c5a612930565b6000602082840312156129b157600080fd5b5051919050565b6000600182016129ca576129ca612930565b5060010190565b8082028115828204841417610c5a57610c5a612930565b600082612a0557634e487b7160e01b600052601260045260246000fd5b500490565b600060208284031215612a1c57600080fd5b81518015158114610c8857600080fd5b60005b83811015612a47578181015183820152602001612a2f565b50506000910152565b60008251612a62818460208701612a2c565b9190910192915050565b6020815260008251806020840152612a8b816040850160208701612a2c565b601f01601f1916919091016040019291505056fea2646970667358221220f84dea519f07322b87cd6b86a5a5352b04817956f2b327322424ca1c28aa5fdf64736f6c63430008170033";

type TokenEmissionsControllerConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: TokenEmissionsControllerConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class TokenEmissionsController__factory extends ContractFactory {
  constructor(...args: TokenEmissionsControllerConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    _stakingToken: PromiseOrValue<string>,
    _boosterNFT: PromiseOrValue<string>,
    _rewardToken: PromiseOrValue<string>,
    _withdrawingAdmin: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<TokenEmissionsController> {
    return super.deploy(
      _stakingToken,
      _boosterNFT,
      _rewardToken,
      _withdrawingAdmin,
      overrides || {}
    ) as Promise<TokenEmissionsController>;
  }
  override getDeployTransaction(
    _stakingToken: PromiseOrValue<string>,
    _boosterNFT: PromiseOrValue<string>,
    _rewardToken: PromiseOrValue<string>,
    _withdrawingAdmin: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      _stakingToken,
      _boosterNFT,
      _rewardToken,
      _withdrawingAdmin,
      overrides || {}
    );
  }
  override attach(address: string): TokenEmissionsController {
    return super.attach(address) as TokenEmissionsController;
  }
  override connect(signer: Signer): TokenEmissionsController__factory {
    return super.connect(signer) as TokenEmissionsController__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): TokenEmissionsControllerInterface {
    return new utils.Interface(_abi) as TokenEmissionsControllerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): TokenEmissionsController {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as TokenEmissionsController;
  }
}