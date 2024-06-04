/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../common";
import type {
  UniswapV2DexProvider,
  UniswapV2DexProviderInterface,
} from "../../../../contracts/launchpad/providers/UniswapV2DexProvider";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_router",
        type: "address",
      },
      {
        internalType: "address",
        name: "_factory",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "FACTORY",
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
    name: "ROUTER",
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
        name: "_pair",
        type: "address",
      },
    ],
    name: "breakLP",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_tokenA",
        type: "address",
      },
      {
        internalType: "address",
        name: "_tokenB",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amountA",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_amountB",
        type: "uint256",
      },
    ],
    name: "createLP",
    outputs: [
      {
        internalType: "address",
        name: "pool",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_pair",
        type: "address",
      },
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
    ],
    name: "getPoolBalance",
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
] as const;

const _bytecode =
  "0x60c060405234801561001057600080fd5b50604051610cb6380380610cb683398101604081905261002f91610062565b6001600160a01b0391821660a05216608052610095565b80516001600160a01b038116811461005d57600080fd5b919050565b6000806040838503121561007557600080fd5b61007e83610046565b915061008c60208401610046565b90509250929050565b60805160a051610bd46100e26000396000818160a5015281816101a3015281816101cd0152818161049e015281816104d20152610545015260008181606101526105dc0152610bd46000f3fe608060405234801561001057600080fd5b50600436106100575760003560e01c80632dd310001461005c57806332fe7b26146100a0578063c9b72ce5146100c7578063e2fa36b5146100ef578063fb8ef43014610110575b600080fd5b6100837f000000000000000000000000000000000000000000000000000000000000000081565b6040516001600160a01b0390911681526020015b60405180910390f35b6100837f000000000000000000000000000000000000000000000000000000000000000081565b6100da6100d53660046109e5565b610123565b60408051928352602083019190915201610097565b6101026100fd366004610a02565b610418565b604051908152602001610097565b61008361011e366004610a3b565b61048d565b6040516370a0823160e01b8152306004820152600090819081906001600160a01b038516906370a0823190602401602060405180830381865afa15801561016e573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906101929190610a81565b90506101c86001600160a01b0385167f000000000000000000000000000000000000000000000000000000000000000083610653565b6000807f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663baa2abde876001600160a01b0316630dfe16816040518163ffffffff1660e01b8152600401602060405180830381865afa158015610238573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061025c9190610a9a565b886001600160a01b031663d21220a76040518163ffffffff1660e01b8152600401602060405180830381865afa15801561029a573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102be9190610a9a565b6040516001600160e01b031960e085901b1681526001600160a01b039283166004820152911660248201526044810186905260016064820181905260848201523060a48201524260c482015260e40160408051808303816000875af115801561032b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061034f9190610ab7565b915091506103ca3383886001600160a01b0316630dfe16816040518163ffffffff1660e01b8152600401602060405180830381865afa158015610396573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906103ba9190610a9a565b6001600160a01b031691906107a5565b61040d3382886001600160a01b031663d21220a76040518163ffffffff1660e01b8152600401602060405180830381865afa158015610396573d6000803e3d6000fd5b909590945092505050565b6040516370a0823160e01b81526001600160a01b038381166004830152600091908316906370a0823190602401602060405180830381865afa158015610462573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104869190610a81565b9392505050565b60006104c36001600160a01b0386167f000000000000000000000000000000000000000000000000000000000000000085610653565b6104f76001600160a01b0385167f000000000000000000000000000000000000000000000000000000000000000084610653565b60405162e8e33760e81b81526001600160a01b0386811660048301528581166024830152604482018590526064820184905260016084830181905260a48301523360c48301524260e48301527f0000000000000000000000000000000000000000000000000000000000000000169063e8e3370090610104016060604051808303816000875af115801561058f573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105b39190610adb565b505060405163e6a4390560e01b81526001600160a01b03878116600483015286811660248301527f000000000000000000000000000000000000000000000000000000000000000016915063e6a4390590604401602060405180830381865afa158015610624573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106489190610a9a565b90505b949350505050565b8015806106cd5750604051636eb1769f60e11b81523060048201526001600160a01b03838116602483015284169063dd62ed3e90604401602060405180830381865afa1580156106a7573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106cb9190610a81565b155b61073d5760405162461bcd60e51b815260206004820152603660248201527f5361666545524332303a20617070726f76652066726f6d206e6f6e2d7a65726f60448201527520746f206e6f6e2d7a65726f20616c6c6f77616e636560501b60648201526084015b60405180910390fd5b6040516001600160a01b0383166024820152604481018290526107a090849063095ea7b360e01b906064015b60408051601f198184030181529190526020810180516001600160e01b03166001600160e01b0319909316929092179091526107d5565b505050565b6040516001600160a01b0383166024820152604481018290526107a090849063a9059cbb60e01b90606401610769565b600061082a826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b03166108aa9092919063ffffffff16565b905080516000148061084b57508080602001905181019061084b9190610b09565b6107a05760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b6064820152608401610734565b606061064b848460008585600080866001600160a01b031685876040516108d19190610b4f565b60006040518083038185875af1925050503d806000811461090e576040519150601f19603f3d011682016040523d82523d6000602084013e610913565b606091505b50915091506109248783838761092f565b979650505050505050565b6060831561099e578251600003610997576001600160a01b0385163b6109975760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152606401610734565b508161064b565b61064b83838151156109b35781518083602001fd5b8060405162461bcd60e51b81526004016107349190610b6b565b6001600160a01b03811681146109e257600080fd5b50565b6000602082840312156109f757600080fd5b8135610486816109cd565b60008060408385031215610a1557600080fd5b8235610a20816109cd565b91506020830135610a30816109cd565b809150509250929050565b60008060008060808587031215610a5157600080fd5b8435610a5c816109cd565b93506020850135610a6c816109cd565b93969395505050506040820135916060013590565b600060208284031215610a9357600080fd5b5051919050565b600060208284031215610aac57600080fd5b8151610486816109cd565b60008060408385031215610aca57600080fd5b505080516020909101519092909150565b600080600060608486031215610af057600080fd5b8351925060208401519150604084015190509250925092565b600060208284031215610b1b57600080fd5b8151801515811461048657600080fd5b60005b83811015610b46578181015183820152602001610b2e565b50506000910152565b60008251610b61818460208701610b2b565b9190910192915050565b6020815260008251806020840152610b8a816040850160208701610b2b565b601f01601f1916919091016040019291505056fea264697066735822122020481a6aa3396ba3cca75bc63a777be6fe11aaa76aa4e869f74b7a73f25ebcd764736f6c63430008170033";

type UniswapV2DexProviderConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: UniswapV2DexProviderConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class UniswapV2DexProvider__factory extends ContractFactory {
  constructor(...args: UniswapV2DexProviderConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    _router: PromiseOrValue<string>,
    _factory: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<UniswapV2DexProvider> {
    return super.deploy(
      _router,
      _factory,
      overrides || {}
    ) as Promise<UniswapV2DexProvider>;
  }
  override getDeployTransaction(
    _router: PromiseOrValue<string>,
    _factory: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_router, _factory, overrides || {});
  }
  override attach(address: string): UniswapV2DexProvider {
    return super.attach(address) as UniswapV2DexProvider;
  }
  override connect(signer: Signer): UniswapV2DexProvider__factory {
    return super.connect(signer) as UniswapV2DexProvider__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): UniswapV2DexProviderInterface {
    return new utils.Interface(_abi) as UniswapV2DexProviderInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): UniswapV2DexProvider {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as UniswapV2DexProvider;
  }
}
