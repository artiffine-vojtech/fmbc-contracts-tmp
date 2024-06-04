/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type {
  FomoBullClubPFPMinter,
  FomoBullClubPFPMinterInterface,
} from "../../contracts/FomoBullClubPFPMinter";

const _abi = [
  {
    inputs: [
      {
        internalType: "contract IIdentityVerifier",
        name: "_verifier",
        type: "address",
      },
      {
        internalType: "contract IFreeMintable",
        name: "_mintable",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "VerificationFailed",
    type: "error",
  },
  {
    inputs: [],
    name: "mintable",
    outputs: [
      {
        internalType: "contract IFreeMintable",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
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
    name: "verifyAndMint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60c060405234801561001057600080fd5b5060405161041038038061041083398101604081905261002f9161005e565b6001600160a01b039182166080521660a052610098565b6001600160a01b038116811461005b57600080fd5b50565b6000806040838503121561007157600080fd5b825161007c81610046565b602084015190925061008d81610046565b809150509250929050565b60805160a0516103486100c86000396000818160a301526101a50152600081816060015260df01526103486000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c80631426dc02146100465780632b7ac3f31461005b5780634bf365df1461009e575b600080fd5b610059610054366004610208565b6100c5565b005b6100827f000000000000000000000000000000000000000000000000000000000000000081565b6040516001600160a01b03909116815260200160405180910390f35b6100827f000000000000000000000000000000000000000000000000000000000000000081565b6040516301bdd4c160e31b81526000906001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001690630deea6089061011c908890889086908990899060040161029d565b6020604051808303816000875af115801561013b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061015f91906102e9565b90508061017f5760405163439cc0cd60e01b815260040160405180910390fd5b6040516334861c7560e01b8152600160048201526001600160a01b0386811660248301527f000000000000000000000000000000000000000000000000000000000000000016906334861c7590604401600060405180830381600087803b1580156101e957600080fd5b505af11580156101fd573d6000803e3d6000fd5b505050505050505050565b6000806000806060858703121561021e57600080fd5b84356001600160a01b038116811461023557600080fd5b935060208501359250604085013567ffffffffffffffff8082111561025957600080fd5b818701915087601f83011261026d57600080fd5b81358181111561027c57600080fd5b88602082850101111561028e57600080fd5b95989497505060200194505050565b60018060a01b038616815284602082015283604082015260806060820152816080820152818360a0830137600081830160a090810191909152601f909201601f19160101949350505050565b6000602082840312156102fb57600080fd5b8151801515811461030b57600080fd5b939250505056fea2646970667358221220da77c7d02c4dc98a9781ea6cf81c51c2d3e273743f8effc1679fb3952673a19464736f6c63430008170033";

type FomoBullClubPFPMinterConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: FomoBullClubPFPMinterConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class FomoBullClubPFPMinter__factory extends ContractFactory {
  constructor(...args: FomoBullClubPFPMinterConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    _verifier: PromiseOrValue<string>,
    _mintable: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<FomoBullClubPFPMinter> {
    return super.deploy(
      _verifier,
      _mintable,
      overrides || {}
    ) as Promise<FomoBullClubPFPMinter>;
  }
  override getDeployTransaction(
    _verifier: PromiseOrValue<string>,
    _mintable: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_verifier, _mintable, overrides || {});
  }
  override attach(address: string): FomoBullClubPFPMinter {
    return super.attach(address) as FomoBullClubPFPMinter;
  }
  override connect(signer: Signer): FomoBullClubPFPMinter__factory {
    return super.connect(signer) as FomoBullClubPFPMinter__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): FomoBullClubPFPMinterInterface {
    return new utils.Interface(_abi) as FomoBullClubPFPMinterInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): FomoBullClubPFPMinter {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as FomoBullClubPFPMinter;
  }
}