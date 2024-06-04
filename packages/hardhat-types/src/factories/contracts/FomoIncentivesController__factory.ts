/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type {
  FomoIncentivesController,
  FomoIncentivesControllerInterface,
} from "../../contracts/FomoIncentivesController";

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
        internalType: "struct IIncentivesController.RewardData[]",
        name: "claimable",
        type: "tuple[]",
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
    name: "deposit",
    outputs: [],
    stateMutability: "nonpayable",
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
        name: "_account",
        type: "address",
      },
    ],
    name: "getUserLocks",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "unlockTime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
        ],
        internalType: "struct IFomoIncentivesController.Lock[]",
        name: "",
        type: "tuple[]",
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
    inputs: [],
    name: "lockDuration",
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
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "locks",
    outputs: [
      {
        internalType: "uint256",
        name: "unlockTime",
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
        name: "_newRewardsDuration",
        type: "uint256",
      },
    ],
    name: "setRewardsDuration",
    outputs: [],
    stateMutability: "nonpayable",
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
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "unlocked",
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
    name: "unstakeNFT",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_index",
        type: "uint256",
      },
    ],
    name: "updateLock",
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
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "withdrawWithoutUpdate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60c060405262ed4e006002556276a7006003553480156200001f57600080fd5b50604051620029c3380380620029c38339810160408190526200004291620000ce565b6200004d3362000065565b6001600160a01b039182166080521660a0526200010d565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6001600160a01b0381168114620000cb57600080fd5b50565b60008060408385031215620000e257600080fd5b8251620000ef81620000b5565b60208401519092506200010281620000b5565b809150509250929050565b60805160a05161285f62000164600039600081816103ec0152818161095001528181610b7d0152818161159c0152611b540152600081816103870152818161070101528181610dad0152611955015261285f6000f3fe608060405234801561001057600080fd5b50600436106101da5760003560e01c80637fd7d06211610104578063cc1a378f116100a2578063e0a747fe11610071578063e0a747fe146104e6578063e5acbe21146104ee578063e70b9e27146104f7578063f2fde38b1461052257600080fd5b8063cc1a378f14610480578063d1846d0c14610493578063dc01f60d146104b3578063e09fb3a0146104d357600080fd5b80639c9b2e21116100de5780639c9b2e211461041f578063a4598d7014610432578063aec1321a14610445578063b425f8021461045857600080fd5b80637fd7d062146103d4578063821c4043146103e75780638da5cb5b1461040e57600080fd5b806348e5d9f81161017c578063704802751161014b5780637048027514610367578063715018a61461037a57806372f702f3146103825780637bb7bed1146103c157600080fd5b806348e5d9f8146102c9578063638634ee1461032e5780636e553f65146103415780636eb604e01461035457600080fd5b806324d7806c116101b857806324d7806c1461023057806327e235e3146102535780632e1a7d4d146102ad578063386a9525146102c057600080fd5b806304554443146101df5780631785f53c146101fb57806323a35de914610210575b600080fd5b6101e860035481565b6040519081526020015b60405180910390f35b61020e610209366004612423565b610535565b005b61022361021e366004612423565b6105f6565b6040516101f29190612440565b61024361023e366004612423565b61067f565b60405190151581526020016101f2565b61028b610261366004612423565b60066020526000908152604090208054600182015460028301546003909301549192909160ff1684565b60408051948552602085019390935291830152151560608201526080016101f2565b61020e6102bb36600461248f565b6106b9565b6101e860025481565b6103066102d7366004612423565b600560205260009081526040902080546001820154600283015460038401546004909401549293919290919085565b604080519586526020860194909452928401919091526060830152608082015260a0016101f2565b6101e861033c366004612423565b6106c7565b61020e61034f3660046124a8565b6106f6565b61020e61036236600461248f565b61093a565b61020e610375366004612423565b610c24565b61020e610ce7565b6103a97f000000000000000000000000000000000000000000000000000000000000000081565b6040516001600160a01b0390911681526020016101f2565b6103a96103cf36600461248f565b610cfb565b61020e6103e2366004612524565b610d25565b6103a97f000000000000000000000000000000000000000000000000000000000000000081565b6000546001600160a01b03166103a9565b61020e61042d366004612423565b610da2565b61020e610440366004612566565b610eb6565b61020e6104533660046125d2565b61107e565b61046b6104663660046125d2565b6111f5565b604080519283526020830191909152016101f2565b61020e61048e36600461248f565b611231565b6101e86104a1366004612423565b60076020526000908152604090205481565b6104c66104c1366004612423565b611281565b6040516101f291906125fe565b61020e6104e136600461248f565b611417565b61020e611422565b6101e8600a5481565b6101e8610505366004612649565b600460209081526000928352604080842090915290825290205481565b61020e610530366004612423565b611640565b61053d6116b6565b6001600160a01b0381166105645760405163274338ef60e11b815260040160405180910390fd5b6001600160a01b03811660009081526001602052604090205460ff166105ad57604051630ed580c760e41b81526001600160a01b03821660048201526024015b60405180910390fd5b6001600160a01b038116600081815260016020526040808220805460ff19169055517fa3b62bc36326052d97ea62d63c3d60308ed4c3ea8ac079dd8499f1e9c4f80c0f9190a250565b6001600160a01b0381166000908152600860209081526040808320805482518185028101850190935280835260609492939192909184015b828210156106745783829060005260206000209060020201604051806040016040529081600082015481526020016001820154815250508152602001906001019061062e565b505050509050919050565b6001600160a01b03811660009081526001602052604081205460ff16806106b357506000546001600160a01b038381169116145b92915050565b6106c4816001611710565b50565b6001600160a01b0381166000908152600560205260408120544281116106ed57806106ef565b425b9392505050565b336001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016146107635760405162461bcd60e51b815260206004820152601260248201527127b7363c9039ba30b5b4b733903a37b5b2b760711b60448201526064016105a4565b600082116107a45760405162461bcd60e51b815260206004820152600e60248201526d416d6f756e74206973207a65726f60901b60448201526064016105a4565b6108088160098054806020026020016040519081016040528092919081815260200182805480156107fe57602002820191906000526020600020905b81546001600160a01b031681526001909101906020018083116107e0575b50505050506119f1565b6001600160a01b03811660009081526006602052604090206003810154839060ff161561085957600061083e8360020154611b31565b9050610855600a61084f8784611c54565b90611c60565b9150505b600a546108669082611c6c565b600a5581546108759085611c6c565b825560018201546108869082611c6c565b60018301556001600160a01b03831660009081526008602052604090819020815180830190925260035490919081906108c0904290611c6c565b815260209081018790528254600180820185556000948552938290208351600290920201908155918101519190920155604080518681529182018390526001600160a01b038516917f73a19dd210f1a7f902193214c0ee91dd35ee5b4d920cba8d519eca65a7b488ca91015b60405180910390a250505050565b6040516331a9108f60e11b8152600481018290527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031690636352211e90602401602060405180830381865afa15801561099f573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906109c39190612677565b6001600160a01b0316336001600160a01b031614610a175760405162461bcd60e51b815260206004820152601160248201527026bab9ba1031329027232a1037bbb732b960791b60448201526064016105a4565b610a793360098054806020026020016040519081016040528092919081815260200182805480156107fe576020028201919060005260206000209081546001600160a01b031681526001909101906020018083116107e05750505050506119f1565b336000908152600660205260409020600381015460ff1615610add5760405162461bcd60e51b815260206004820152601760248201527f42616c616e636520616c726561647920626f6f7374656400000000000000000060448201526064016105a4565b6000610ae883611b31565b90506000610b08600a61084f848660000154611c5490919063ffffffff16565b8354909150600090610b1a90836126aa565b600a54909150610b2a9082611c6c565b600a556001840154610b3c9082611c6c565b6001858101919091556002850186905560038501805460ff191690911790556040516323b872dd60e01b8152336004820152306024820152604481018690527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316906323b872dd90606401600060405180830381600087803b158015610bc957600080fd5b505af1158015610bdd573d6000803e3d6000fd5b50506040805160008152602081018590523393507f73a19dd210f1a7f902193214c0ee91dd35ee5b4d920cba8d519eca65a7b488ca92500160405180910390a25050505050565b610c2c6116b6565b6001600160a01b038116610c535760405163274338ef60e11b815260040160405180910390fd5b6001600160a01b03811660009081526001602052604090205460ff1615610c985760405163f646f2cd60e01b81526001600160a01b03821660048201526024016105a4565b6001600160a01b0381166000818152600160208190526040808320805460ff1916909217909155517f44d6d25963f097ad14f29f06854a01f575648a1ef82f30e562ccd3889717e3399190a250565b610cef6116b6565b610cf96000611c78565b565b60098181548110610d0b57600080fd5b6000918252602090912001546001600160a01b0316905081565b610d62338383808060200260200160405190810160405280939291908181526020018383602002808284376000920191909152506119f192505050565b610d9e828280806020026020016040519081016040528093929190818152602001838360200280828437600092019190915250611cc892505050565b5050565b610dab33611de7565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316816001600160a01b031603610e2c5760405162461bcd60e51b815260206004820152601b60248201527f5374616b696e6720746f6b656e206973206e6f7420726577617264000000000060448201526064016105a4565b6001600160a01b03811660009081526005602052604090206002015415610e5257600080fd5b60098054600181019091557f6e1540171b6c0c960b71a7020d9f60077f6af931a8bbf590da0223dacf75c7af0180546001600160a01b039092166001600160a01b031990921682179055600090815260056020526040902042600282018190559055565b610ebf33611de7565b610efc308585808060200260200160405190810160405280939291908181526020018383602002808284376000920191909152506119f192505050565b8260005b81811015611076576000868683818110610f1c57610f1c6126bd565b9050602002016020810190610f319190612423565b6001600160a01b0381166000908152600560205260409020805491925090610f925760405162461bcd60e51b81526020600482015260146024820152732ab735b737bbb7103932bbb0b932103a37b5b2b760611b60448201526064016105a4565b610fca3330888887818110610fa957610fa96126bd565b90506020020135856001600160a01b0316611e47909392919063ffffffff16565b6004808201546040516370a0823160e01b8152309281019290925260009161104891906001600160a01b038616906370a0823190602401602060405180830381865afa15801561101e573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061104291906126d3565b90611eb2565b90506110548382611ebe565b60048201546110639082611c6c565b6004909201919091555050600101610f00565b505050505050565b6001600160a01b0382166000908152600860205260409020805482106110db5760405162461bcd60e51b8152602060048201526012602482015271092dcecc2d8d2c840d8dec6d640d2dcc8caf60731b60448201526064016105a4565b8082815481106110ed576110ed6126bd565b90600052602060002090600202016000015442106111f057808281548110611117576111176126bd565b90600052602060002090600202016001015460076000856001600160a01b03166001600160a01b03168152602001908152602001600020600082825461115d91906126ec565b909155505080548190611172906001906126aa565b81548110611182576111826126bd565b90600052602060002090600202018183815481106111a2576111a26126bd565b60009182526020909120825460029092020190815560019182015491015580548190806111d1576111d16126ff565b6000828152602081206002600019909301928302018181556001015590555b505050565b6008602052816000526040600020818154811061121157600080fd5b600091825260209091206002909102018054600190910154909250905082565b6112396116b6565b6000811161127c5760405162461bcd60e51b815260206004820152601060248201526f4475726174696f6e206973207a65726f60801b60448201526064016105a4565b600255565b60095460609067ffffffffffffffff81111561129f5761129f612715565b6040519080825280602002602001820160405280156112e457816020015b60408051808201909152600080825260208201528152602001906001900390816112bd5790505b50905060005b81518110156114115760098181548110611306576113066126bd565b9060005260206000200160009054906101000a90046001600160a01b0316828281518110611336576113366126bd565b6020026020010151600001906001600160a01b031690816001600160a01b0316815250506113e964e8d4a5100061084f85858581518110611379576113796126bd565b60200260200101516000015160066000896001600160a01b03166001600160a01b03168152602001908152602001600020600101546113e4600988815481106113c4576113c46126bd565b600091825260209091200154600a546001600160a01b0390911690611f76565b61200e565b8282815181106113fb576113fb6126bd565b60209081029190910181015101526001016112ea565b50919050565b6106c4816000611710565b6114843360098054806020026020016040519081016040528092919081815260200182805480156107fe576020028201919060005260206000209081546001600160a01b031681526001909101906020018083116107e05750505050506119f1565b6114e760098054806020026020016040519081016040528092919081815260200182805480156114dd57602002820191906000526020600020905b81546001600160a01b031681526001909101906020018083116114bf575b5050505050611cc8565b336000908152600660205260409020600381015460ff1661153b5760405162461bcd60e51b815260206004820152600e60248201526d139195081b9bdd081cdd185ad95960921b60448201526064016105a4565b8054600182015460009161154e916126aa565b600a5490915061155e9082611eb2565b600a558154600183015560038201805460ff1916905560028201546040516323b872dd60e01b815230600482015233602482015260448101919091527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316906323b872dd90606401600060405180830381600087803b1580156115e857600080fd5b505af11580156115fc573d6000803e3d6000fd5b50506040805160008152602081018590523393507f92ccf450a286a957af52509bc1c9939d1a6a481783e142e41e2499f0bb66ebc692500160405180910390a25050565b6116486116b6565b6001600160a01b0381166116ad5760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b60648201526084016105a4565b6106c481611c78565b6000546001600160a01b03163314610cf95760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064016105a4565b33600090815260066020526040902080548311156117705760405162461bcd60e51b815260206004820152601a60248201527f416d6f756e742067726561746572207468616e207374616b656400000000000060448201526064016105a4565b811561177f5761177f33612085565b336000908152600760205260409020548311156117de5760405162461bcd60e51b815260206004820152601c60248201527f416d6f756e742067726561746572207468616e20756e6c6f636b65640000000060448201526064016105a4565b6118403360098054806020026020016040519081016040528092919081815260200182805480156107fe576020028201919060005260206000209081546001600160a01b031681526001909101906020018083116107e05750505050506119f1565b6118a160098054806020026020016040519081016040528092919081815260200182805480156114dd576020028201919060005260206000209081546001600160a01b031681526001909101906020018083116114bf575050505050611cc8565b6003810154839060ff16156118d45760006118bf8360020154611b31565b90506118d0600a61084f8784611c54565b9150505b815484036118e3575060018101545b81546118ef9085611eb2565b825560018201546119009082611eb2565b6001830155600a546119129082611eb2565b600a5533600090815260076020526040812080548692906119349084906126aa565b9091555050604051637647691d60e01b8152600481018590523360248201527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031690637647691d90604401600060405180830381600087803b1580156119a157600080fd5b505af11580156119b5573d6000803e3d6000fd5b505060408051878152602081018590523393507f92ccf450a286a957af52509bc1c9939d1a6a481783e142e41e2499f0bb66ebc692500161092c565b805160005b81811015611b2b576000838281518110611a1257611a126126bd565b6020908102919091018101516001600160a01b038116600090815260059092526040909120805491925090611a805760405162461bcd60e51b81526020600482015260146024820152732ab735b737bbb7103932bbb0b932103a37b5b2b760611b60448201526064016105a4565b6000611a8e83600a54611f76565b600383018190559050611aa0836106c7565b60028301556001600160a01b0387163014611b20576001600160a01b038716600090815260066020526040902060010154611adf90889085908461200e565b6001600160a01b03808916600081815260046020908152604080832094891680845294825280832095909555918152600b8252838120928152919052208190555b5050506001016119f6565b50505050565b604051630284a7a560e51b81526004810182905260009081906001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001690635094f4a090602401602060405180830381865afa158015611b9b573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611bbf91906126d3565b905080600003611bd25750600f92915050565b80600103611be35750600e92915050565b80600203611bf45750600d92915050565b80600303611c055750600c92915050565b80600403611c165750600b92915050565b60405162461bcd60e51b8152602060048201526013602482015272125b9d985b1a59081d1bdad95b881b195d995b606a1b60448201526064016105a4565b60006106ef828461272b565b60006106ef8284612742565b60006106ef82846126ec565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b805160005b818110156111f0576000838281518110611ce957611ce96126bd565b6020908102919091018101513360009081526004835260408082206001600160a01b038416835290935291822054909250611d299064e8d4a51000611c60565b6001600160a01b0383166000908152600560205260409020600481015491925090611d549083611eb2565b60048201556000829003611d6a57505050611ddf565b3360008181526004602090815260408083206001600160a01b0388168085529252822091909155611d9b91846121e6565b6040518281526001600160a01b0384169033907f540798df468d7b23d11f156fdb954cb19ad414d150722a7b6d55ba369dea792e9060200160405180910390a35050505b600101611ccd565b6001600160a01b03811660009081526001602052604090205460ff16158015611e1e57506000546001600160a01b03828116911614155b156106c457604051636d3f049f60e01b81526001600160a01b03821660048201526024016105a4565b6040516001600160a01b0380851660248301528316604482015260648101829052611b2b9085906323b872dd60e01b906084015b60408051601f198184030181529190526020810180516001600160e01b03166001600160e01b031990931692909217909152612216565b60006106ef82846126aa565b6001600160a01b038216600090815260056020526040902080544210611efe57600254611ef49061084f8464e8d4a51000611c54565b6001820155611f5c565b8054600090611f0d9042611eb2565b90506000611f3164e8d4a5100061084f856001015485611c5490919063ffffffff16565b600254909150611f549061084f64e8d4a51000611f4e8886611c6c565b90611c54565b600184015550505b42600280830182905554611f709190611c6c565b90555050565b600081600003611fa257506001600160a01b0382166000908152600560205260409020600301546106b3565b6001600160a01b038316600090815260056020526040902060018101546002909101546106ef91611fec91859161084f91670de0b6b3a764000091611f4e9182906110428c6106c7565b6001600160a01b03851660009081526005602052604090206003015490611c6c565b6001600160a01b03808516600081815260046020908152604080832094881680845294825280832054938352600b82528083209483529390529182205461207a919061207490670de0b6b3a76400009061084f9061206d908890611eb2565b8890611c54565b90611c6c565b90505b949350505050565b6001600160a01b0381166000908152600860205260408120805490915b81811015611b2b578281815481106120bc576120bc6126bd565b90600052602060002090600202016000015442106121d4578281815481106120e6576120e66126bd565b90600052602060002090600202016001015460076000866001600160a01b03166001600160a01b03168152602001908152602001600020600082825461212c91906126ec565b9091555083905061213e6001846126aa565b8154811061214e5761214e6126bd565b906000526020600020906002020183828154811061216e5761216e6126bd565b600091825260209091208254600290920201908155600191820154910155825483908061219d5761219d6126ff565b60008281526020812060026000199093019283020181815560010155905581156121cf57816121cb81612764565b9250505b6120a2565b806121de8161277b565b9150506120a2565b6040516001600160a01b0383166024820152604481018290526111f090849063a9059cbb60e01b90606401611e7b565b600061226b826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b03166122eb9092919063ffffffff16565b905080516000148061228c57508080602001905181019061228c9190612794565b6111f05760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b60648201526084016105a4565b606061207d848460008585600080866001600160a01b0316858760405161231291906127da565b60006040518083038185875af1925050503d806000811461234f576040519150601f19603f3d011682016040523d82523d6000602084013e612354565b606091505b509150915061236587838387612370565b979650505050505050565b606083156123df5782516000036123d8576001600160a01b0385163b6123d85760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e747261637400000060448201526064016105a4565b508161207d565b61207d83838151156123f45781518083602001fd5b8060405162461bcd60e51b81526004016105a491906127f6565b6001600160a01b03811681146106c457600080fd5b60006020828403121561243557600080fd5b81356106ef8161240e565b602080825282518282018190526000919060409081850190868401855b828110156124825781518051855286015186850152928401929085019060010161245d565b5091979650505050505050565b6000602082840312156124a157600080fd5b5035919050565b600080604083850312156124bb57600080fd5b8235915060208301356124cd8161240e565b809150509250929050565b60008083601f8401126124ea57600080fd5b50813567ffffffffffffffff81111561250257600080fd5b6020830191508360208260051b850101111561251d57600080fd5b9250929050565b6000806020838503121561253757600080fd5b823567ffffffffffffffff81111561254e57600080fd5b61255a858286016124d8565b90969095509350505050565b6000806000806040858703121561257c57600080fd5b843567ffffffffffffffff8082111561259457600080fd5b6125a0888389016124d8565b909650945060208701359150808211156125b957600080fd5b506125c6878288016124d8565b95989497509550505050565b600080604083850312156125e557600080fd5b82356125f08161240e565b946020939093013593505050565b602080825282518282018190526000919060409081850190868401855b8281101561248257815180516001600160a01b0316855286015186850152928401929085019060010161261b565b6000806040838503121561265c57600080fd5b82356126678161240e565b915060208301356124cd8161240e565b60006020828403121561268957600080fd5b81516106ef8161240e565b634e487b7160e01b600052601160045260246000fd5b818103818111156106b3576106b3612694565b634e487b7160e01b600052603260045260246000fd5b6000602082840312156126e557600080fd5b5051919050565b808201808211156106b3576106b3612694565b634e487b7160e01b600052603160045260246000fd5b634e487b7160e01b600052604160045260246000fd5b80820281158282048414176106b3576106b3612694565b60008261275f57634e487b7160e01b600052601260045260246000fd5b500490565b60008161277357612773612694565b506000190190565b60006001820161278d5761278d612694565b5060010190565b6000602082840312156127a657600080fd5b815180151581146106ef57600080fd5b60005b838110156127d15781810151838201526020016127b9565b50506000910152565b600082516127ec8184602087016127b6565b9190910192915050565b60208152600082518060208401526128158160408501602087016127b6565b601f01601f1916919091016040019291505056fea26469706673582212203618983c52b6a8a21a8edbdf6b7e6daae970ff2a31a0328b1a7a52a33c9c165264736f6c63430008170033";

type FomoIncentivesControllerConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: FomoIncentivesControllerConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class FomoIncentivesController__factory extends ContractFactory {
  constructor(...args: FomoIncentivesControllerConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    _stakingToken: PromiseOrValue<string>,
    _boosterNFT: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<FomoIncentivesController> {
    return super.deploy(
      _stakingToken,
      _boosterNFT,
      overrides || {}
    ) as Promise<FomoIncentivesController>;
  }
  override getDeployTransaction(
    _stakingToken: PromiseOrValue<string>,
    _boosterNFT: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      _stakingToken,
      _boosterNFT,
      overrides || {}
    );
  }
  override attach(address: string): FomoIncentivesController {
    return super.attach(address) as FomoIncentivesController;
  }
  override connect(signer: Signer): FomoIncentivesController__factory {
    return super.connect(signer) as FomoIncentivesController__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): FomoIncentivesControllerInterface {
    return new utils.Interface(_abi) as FomoIncentivesControllerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): FomoIncentivesController {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as FomoIncentivesController;
  }
}