import { ethers, network } from 'hardhat'
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { expect } from 'chai'
import { parseEther, parseUnits } from 'ethers/lib/utils'
import env from 'hardhat'

import { FomoBullClubNFT__factory } from '../../hardhat-types/src/factories/contracts'
import { BigNumber, Contract, Signer, constants } from 'ethers'
import {
  BalancerDexProvider__factory,
  ControllerFactory__factory,
  ERC20,
  IVault,
  IdentityVerifier__factory,
  Launchpad,
  MEMEVesting,
  NFTChecker__factory,
  TokenEmissionsController,
  TokenIncentivesController,
  TokenIncentivesController__factory,
  Launchpad__factory,
  UniswapV2DexProvider__factory,
  TokenProxy__factory,
  TokenEmissionsController__factory,
} from '../../hardhat-types/src'
import { HttpNetworkHDAccountsConfig } from 'hardhat/types'
import { ILaunchCommon } from '../../hardhat-types/src/contracts/launchpad/Launchpad'

// const LP_5K = BigNumber.from("4999999999999899993731")  // $5k LP
// const LP_1K = BigNumber.from("999999999999979998746")   // $1k LP
// const LP_500 = BigNumber.from("499999999999989999373")  // $500 LP
// const LP_100 = BigNumber.from("99999999999997999874")   // $100 LP
// const LP_50 = BigNumber.from("49999999999998999937")    // $50 LP
// const LP_AMOUNT = LP_5K.mul(5) //
// const DEAD_ADDRESS = "0x000000000000000000000000000000000000dEaD"
const LP_AMOUNT = parseUnits('1000', 14)
const LP_1K = parseUnits('5', 14) // $1k LP
const LP_5K = parseUnits('25', 14) // $5k LP
const LP_500 = parseUnits('25', 13) // $500 LP
const LP_100 = parseUnits('5', 13) // $500 LP
const LP_50 = parseUnits('25', 12) // $50 LP
const DEAD_ADDRESS = '0x000000000000000000000000000000000000dEaD'
const ONE_DAY = 24 * 60 * 60

const ERROR = {
  InvalidAllocations: 'InvalidAllocations',
  InvalidRounds: 'InvalidRounds',
  VerificationFailed: 'VerificationFailed',
  LaunchIsNotPending: 'LaunchIsNotPending',
  LaunchIsNotFailed: 'LaunchIsNotFailed',
  LaunchIsNotLaunched: 'LaunchIsNotLaunched',
  LaunchFailed: 'LaunchFailed',
  AlreadyLaunched: 'AlreadyLaunched',
  AlreadyClaimed: 'AlreadyClaimed',
  InvalidDexIndex: `InvalidDexIndex`,
  ArraysLengthMismatch: 'ArraysLengthMismatch',
  UserIsKOL: 'UserIsKOL',
  UserIsNotKOL: 'UserIsNotKOL',
  UserSaleNotStarted: 'UserSaleNotStarted',
  PledgeLimitReached: 'PledgeLimitReached',
  MinPledgeNotREached: 'MinPledgeNotReached',
  UserNotNFTOwner: 'UserNotNFTOwner',
  InvalidTotalSupply: 'InvalidTotalSupply',
  InvalidHardCap: 'InvalidHardCap',
  LiquidityAllocationIsZero: 'LiquidityAllocationIsZero',
}

describe('Launchpad-Uniswap', function () {
  before('Fork Base Mainnet', async function () {
    await network.provider.request({
      method: 'hardhat_reset',
      params: [
        {
          forking: {
            jsonRpcUrl:
              'https://rpc.tenderly.co/fork/fadc336c-dfc6-4d12-9900-56ea5abbfc75',
          },
        },
      ],
    })
  })

  async function deployContractFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, user, user2, user3, team] = await ethers.getSigners()
    console.log(owner.address)

    // deploy Member NFT collection
    const name = 'FOMO BULL CLUB MEMBER NFT'
    const symbol = 'FMBCMEMBER'
    const baseURI = 'ipfs/hash/'
    const contractURI = 'contractURI'
    const nftContractFactory = new FomoBullClubNFT__factory(owner)
    const nft = await nftContractFactory.deploy(
      name,
      symbol,
      baseURI,
      contractURI
    )
    await nft.deployed()

    const usdc = (await ethers.getContractAt(
      'IERC20',
      '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      owner
    )) as ERC20
    const fomo = (await ethers.getContractAt(
      'IERC20',
      '0x9A86980D3625b4A6E69D8a4606D51cbc019e2002',
      owner
    )) as ERC20
    //  impersonating vitalik's account
    await network.provider.request({
      method: 'hardhat_impersonateAccount',
      params: ['0xD34EA7278e6BD48DefE656bbE263aEf11101469c'],
    })

    // Transfer USDC from whale to owner
    const usdcWhale = await ethers.getSigner(
      '0xD34EA7278e6BD48DefE656bbE263aEf11101469c'
    )
    await usdc
      .connect(usdcWhale)
      .transfer(owner.address, parseUnits(`${10_000_000}`, 6))

    await network.provider.request({
      method: 'hardhat_impersonateAccount',
      params: ['0x43F0A94F7939c410A3896b007Ad5B79B3630586a'],
    })

    // FOMO deployer
    const fomoWhale = await ethers.getSigner(
      '0x43F0A94F7939c410A3896b007Ad5B79B3630586a'
    )
    await fomo
      .connect(fomoWhale)
      .transfer(owner.address, parseEther(`${10_000_000}`))

    const identityVerifierFactory = new IdentityVerifier__factory(owner)
    const identityVerifier = await identityVerifierFactory.deploy(owner.address)
    await identityVerifier.deployed()

    const balancerDexProviderFactory = new BalancerDexProvider__factory(owner)
    const balancerDexProvider = await balancerDexProviderFactory.deploy()
    await balancerDexProvider.deployed()

    // Deploy UniV2 FOMO-USDC LP
    await env.uniswapV2.deploy(owner)
    const router = await env.uniswapV2.getRouter()
    const factory = await env.uniswapV2.getFactory()
    await usdc.approve(router.address, constants.MaxInt256)
    await fomo.approve(router.address, constants.MaxInt256)
    const options = {
      tokenA: fomo.address,
      tokenB: usdc.address,
      amountTokenA: BigNumber.from('400000000000000000000000'),
      amountTokenB: BigNumber.from('400000000000'),
    }
    await router
      .connect(owner)
      .addLiquidity(
        options.tokenA,
        options.tokenB,
        options.amountTokenA,
        options.amountTokenB,
        1,
        1,
        owner.address,
        9678825033
      )

    const fomoUsdcLpAddress = await factory.getPair(fomo.address, usdc.address)
    console.log(fomoUsdcLpAddress)
    const fomoUsdcLp = (await ethers.getContractAt(
      'IERC20',
      fomoUsdcLpAddress,
      owner
    )) as ERC20
    console.log(fomoUsdcLp.address)

    const uniswapDexProviderFactory = new UniswapV2DexProvider__factory(owner)
    const uniswapDexProvider = await uniswapDexProviderFactory.deploy(
      router.address,
      factory.address
    )
    await uniswapDexProvider.deployed()

    // await usdc.transfer(balancerDexProvider.address, BigNumber.from("400000000000"))
    // await fomo.transfer(balancerDexProvider.address, BigNumber.from("400000000000000000000000"))
    // await balancerDexProvider.createLP(usdc.address, fomo.address, BigNumber.from("400000000000"), BigNumber.from("400000000000000000000000"))
    // const fomoUsdcLp = await ethers.getContractAt("ERC20", await balancerDexProvider.lastPool(), owner) as ERC20;
    // const poolId = await balancerDexProvider.lastPoolId()
    const balancerVaultAddress = '0xBA12222222228d8Ba445958a75a0704d566BF2C8'

    const usdcTotal = await uniswapDexProvider.getPoolBalance(
      fomoUsdcLp.address,
      usdc.address
    )
    const feePercent = parseUnits('25', 6).mul(parseEther('1')).div(usdcTotal)
    const totalSupply = await fomoUsdcLp.totalSupply()
    console.log(totalSupply.toString())
    console.log(feePercent.mul(totalSupply).div(parseEther('1')).toString())

    // Deploy SteakController
    const steakControllerFactory = new TokenIncentivesController__factory(owner)
    const steakController = await steakControllerFactory.deploy(
      fomoUsdcLp.address,
      nft.address,
      fomo.address
    )
    await steakController.deployed()

    // Deploy FOMO proxy
    const fomoProxy = new TokenProxy__factory(owner)
    const fomoProxyInstance = await fomoProxy.deploy(
      'Staked FOMO',
      'sFOMO',
      fomo.address
    )
    await fomoProxyInstance.deployed()

    // Deploy FOMOController
    const fomoControllerFactory = new TokenEmissionsController__factory(owner)
    const fomoController = await fomoControllerFactory.deploy(
      fomoUsdcLp.address,
      nft.address,
      fomo.address,
      fomoProxyInstance.address
    )
    await fomoController.deployed()

    // Deploy NFTChecker
    const nftCheckerFactory = new NFTChecker__factory(owner)
    const nftChecker = await nftCheckerFactory.deploy(nft.address)
    await nftChecker.deployed()

    // Deploy ControllerFactory
    const conrtollerFactoryFactory = new ControllerFactory__factory(owner)
    const controllerFactory = await conrtollerFactoryFactory.deploy()
    await controllerFactory.deployed()

    // Deploy LaunchControl library
    const lib = await env.ethers.getContractFactory('LaunchControl', owner)
    const libInstance = await lib.deploy()
    await libInstance.deployed()

    // Deploy Launhcpad contract
    const launchpadFactory = (await env.ethers.getContractFactory('Launchpad', {
      signer: owner,
      libraries: { LaunchControl: libInstance.address },
    })) as Launchpad__factory
    const launchpad = await launchpadFactory.deploy(
      '0x9A86980D3625b4A6E69D8a4606D51cbc019e2002',
      '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      fomoUsdcLp.address,
      steakController.address,
      fomoController.address,
      nft.address,
      nftChecker.address,
      controllerFactory.address,
      identityVerifier.address,
      uniswapDexProvider.address
    )
    await launchpad.deployed()
    await steakController.addAdmin(launchpad.address)
    await fomoController.addAdmin(launchpad.address)
    await nftChecker.addAdmin(launchpad.address)
    await nftChecker.addIncentivesController(steakController.address)
    await nftChecker.addIncentivesController(fomoController.address)
    await launchpad.addDexProvider(balancerDexProvider.address)

    const res0 = await steakController.setWithdrawingAdmin(launchpad.address)
    await res0.wait()

    // Setup ERC20 and NFTs
    const ownerBalance = await fomoUsdcLp.balanceOf(owner.address)
    console.log('owner balance before transfer', ownerBalance.toString())

    // Mint NFTs
    await nft.freeMint([1, 1, 1, 1, 1], user2.address)
    await nft.freeMint([1, 1, 1, 1, 1], user.address)
    await nft.freeMint([1, 1, 1, 1, 1], user3.address)
    const OWNED_TOKEN_IDS_BY_USER2 = [0, 100, 600, 1600, 4100]
    const OWNED_TOKEN_IDS_BY_USER = [1, 101, 601, 1601, 4101]
    const OWNED_TOKEN_IDS_BY_USER3 = [2, 102, 602, 1602, 4102]

    // transfer 100k fomo usdc LP to user
    const res = await fomoUsdcLp
      .connect(owner)
      .transfer(user.address, LP_AMOUNT)
    await res.wait()

    // deposit 100k fomo usdc LP to steak for user2
    const res2 = await fomoUsdcLp
      .connect(owner)
      .approve(steakController.address, LP_AMOUNT)
    await res2.wait()
    const res3 = await steakController.deposit(LP_AMOUNT, user2.address)
    await res3.wait()

    const ownerBalanceAfter = await fomoUsdcLp.balanceOf(owner.address)
    console.log('owner balance after transfer', ownerBalanceAfter.toString())

    var SIGNED_DATA = []
    const signers = await getSigners(250)
    for (let i = 0; i < 250; i++) {
      SIGNED_DATA.push(await getUserVerificationData(signers[i].address, owner))
    }

    return {
      // tokens
      nft,
      fomo,
      usdc,
      fomoUsdcLp,
      launchpad,
      nftChecker,
      steakController,
      fomoController,
      controllerFactory,
      balancerVaultAddress,
      // accounts
      owner,
      user,
      user2,
      user3,
      team,
      // other
      OWNED_TOKEN_IDS_BY_USER,
      OWNED_TOKEN_IDS_BY_USER2,
      SIGNED_DATA,
    }
  }

  async function deployContractFixtureWithLaunchAfter1Days() {
    const {
      // tokens
      nft,
      fomo,
      usdc,
      fomoUsdcLp,
      launchpad,
      nftChecker,
      steakController,
      controllerFactory,
      // accounts
      owner,
      user,
      user2,
      user3,
      team,
      // other
      OWNED_TOKEN_IDS_BY_USER,
      OWNED_TOKEN_IDS_BY_USER2,
    } = await loadFixture(deployContractFixture)
    await fomoUsdcLp
      .connect(owner)
      .approve(launchpad.address, constants.MaxUint256)
    const config = createLaunchConfig(1e9, 250000, team.address, user3.address)
    await launchpad
      .connect(owner)
      .createLaunch(
        config,
        false,
        await getUserVerificationData(owner.address, owner)
      )
    const launch = await getLaunchConfig(launchpad, 0)
    const blockTimestamp = launch.startTime
      .add(BigNumber.from('86400'))
      .toNumber()
    var SIGNED_DATA = []
    const signers = await getSigners(250)
    for (let i = 0; i < 250; i++) {
      SIGNED_DATA.push(
        await getUserVerificationData(signers[i].address, owner, blockTimestamp)
      )
    }
    await ethers.provider.send('evm_setNextBlockTimestamp', [
      launch.startTime.add(BigNumber.from('86400')).toNumber(),
    ])
    return {
      // tokens
      nft,
      fomo,
      usdc,
      fomoUsdcLp,
      launchpad,
      nftChecker,
      steakController,
      controllerFactory,
      // accounts
      owner,
      user,
      user2,
      user3,
      team,
      // other
      OWNED_TOKEN_IDS_BY_USER,
      OWNED_TOKEN_IDS_BY_USER2,
      SIGNED_DATA,
    }
  }

  async function deployContractFixtureWithLaunchAfter8Days() {
    const {
      // tokens
      nft,
      fomo,
      usdc,
      fomoUsdcLp,
      launchpad,
      nftChecker,
      steakController,
      controllerFactory,
      // accounts
      owner,
      user,
      user2,
      user3,
      team,
      // other
      OWNED_TOKEN_IDS_BY_USER,
      OWNED_TOKEN_IDS_BY_USER2,
    } = await loadFixture(deployContractFixture)
    await fomoUsdcLp
      .connect(owner)
      .approve(launchpad.address, constants.MaxUint256)
    const config = createLaunchConfig(1e9, 250000, team.address, user3.address)
    await launchpad
      .connect(owner)
      .createLaunch(
        config,
        false,
        await getUserVerificationData(owner.address, owner)
      )
    const launch = await getLaunchConfig(launchpad, 0)
    const blockTimestamp = launch.startTime
      .add(BigNumber.from('86400').mul(8))
      .toNumber()
    var SIGNED_DATA = []
    const signers = await getSigners(250)
    for (let i = 0; i < 250; i++) {
      SIGNED_DATA.push(
        await getUserVerificationData(signers[i].address, owner, blockTimestamp)
      )
    }
    await ethers.provider.send('evm_setNextBlockTimestamp', [
      launch.startTime.add(BigNumber.from(8).mul('86400')).toNumber(),
    ])
    return {
      // tokens
      nft,
      fomo,
      usdc,
      fomoUsdcLp,
      launchpad,
      nftChecker,
      steakController,
      controllerFactory,
      // accounts
      owner,
      user,
      user2,
      user3,
      team,
      // other
      OWNED_TOKEN_IDS_BY_USER,
      OWNED_TOKEN_IDS_BY_USER2,
      SIGNED_DATA,
    }
  }

  async function deployContractFixtureWithLaunch() {
    const {
      // tokens
      nft,
      fomo,
      usdc,
      fomoUsdcLp,
      launchpad,
      nftChecker,
      steakController,
      controllerFactory,
      // accounts
      owner,
      user,
      user2,
      user3,
      team,
      // other
      OWNED_TOKEN_IDS_BY_USER,
      OWNED_TOKEN_IDS_BY_USER2,
      SIGNED_DATA,
    } = await loadFixture(deployContractFixture)
    await fomoUsdcLp
      .connect(owner)
      .approve(launchpad.address, constants.MaxUint256)
    const config = createLaunchConfig(1e9, 250000, team.address, user3.address)
    await launchpad
      .connect(owner)
      .createLaunch(
        config,
        false,
        await getUserVerificationData(owner.address, owner)
      )
    return {
      // tokens
      nft,
      fomo,
      usdc,
      fomoUsdcLp,
      launchpad,
      nftChecker,
      steakController,
      controllerFactory,
      // accounts
      owner,
      user,
      user2,
      user3,
      team,
      // other
      OWNED_TOKEN_IDS_BY_USER,
      OWNED_TOKEN_IDS_BY_USER2,
      SIGNED_DATA,
    }
  }

  async function deployContractFixtureWithHardCapReached() {
    const {
      // tokens
      nft,
      fomo,
      usdc,
      fomoUsdcLp,
      launchpad,
      nftChecker,
      steakController,
      fomoController,
      controllerFactory,
      balancerVaultAddress,
      // accounts
      owner,
      user,
      user2,
      user3,
      team,
      // other
      OWNED_TOKEN_IDS_BY_USER,
      OWNED_TOKEN_IDS_BY_USER2,
      SIGNED_DATA,
    } = await loadFixture(deployContractFixture)
    await fomoUsdcLp
      .connect(owner)
      .approve(launchpad.address, constants.MaxUint256)
    const config = createLaunchConfig(1e9, 250000, team.address, user3.address)
    await launchpad
      .connect(owner)
      .createLaunch(
        config,
        false,
        await getUserVerificationData(owner.address, owner)
      )
    const pledgers = await getSigners(54)
    // Pledge $245k (+ $5k deposit) = $250k in total
    for (let i = 5; i < 54; i++) {
      await owner.sendTransaction({
        to: pledgers[i].address,
        value: parseEther('1.0'),
      })
      await fomoUsdcLp.connect(owner).transfer(pledgers[i].address, LP_5K)
      await launchpad.connect(owner).addKOL(pledgers[i].address)
      await fomoUsdcLp
        .connect(pledgers[i])
        .approve(launchpad.address, constants.MaxUint256)
      await launchpad
        .connect(pledgers[i])
        .pledge(0, LP_5K, false, SIGNED_DATA[i])
    }
    return {
      // tokens
      nft,
      fomo,
      usdc,
      fomoUsdcLp,
      launchpad,
      nftChecker,
      steakController,
      fomoController,
      controllerFactory,
      balancerVaultAddress,
      // accounts
      owner,
      user,
      user2,
      user3,
      team,
      // other
      OWNED_TOKEN_IDS_BY_USER,
      OWNED_TOKEN_IDS_BY_USER2,
      SIGNED_DATA,
    }
  }

  async function deployContractFixtureWithHardCapReachedFromKOLCreator() {
    const {
      // tokens
      nft,
      fomo,
      usdc,
      fomoUsdcLp,
      launchpad,
      nftChecker,
      steakController,
      fomoController,
      controllerFactory,
      balancerVaultAddress,
      // accounts
      owner,
      user,
      user2,
      user3,
      team,
      // other
      OWNED_TOKEN_IDS_BY_USER,
      OWNED_TOKEN_IDS_BY_USER2,
      SIGNED_DATA,
    } = await loadFixture(deployContractFixture)
    await fomoUsdcLp
      .connect(user)
      .approve(launchpad.address, constants.MaxUint256)
    const config = createLaunchConfig(1e9, 250000, team.address, user3.address)
    await launchpad.addKOL(user.address)
    await launchpad
      .connect(user)
      .createLaunch(
        config,
        false,
        await getUserVerificationData(user.address, owner)
      )
    const pledgers = await getSigners(54)
    // Pledge $245k (+ $5k deposit) = $250k in total
    for (let i = 5; i < 54; i++) {
      await owner.sendTransaction({
        to: pledgers[i].address,
        value: parseEther('1.0'),
      })
      await fomoUsdcLp.connect(owner).transfer(pledgers[i].address, LP_5K)
      await launchpad.connect(owner).addKOL(pledgers[i].address)
      await fomoUsdcLp
        .connect(pledgers[i])
        .approve(launchpad.address, constants.MaxUint256)
      await launchpad
        .connect(pledgers[i])
        .pledge(0, LP_5K, false, SIGNED_DATA[i])
    }
    return {
      // tokens
      nft,
      fomo,
      usdc,
      fomoUsdcLp,
      launchpad,
      nftChecker,
      steakController,
      fomoController,
      controllerFactory,
      balancerVaultAddress,
      // accounts
      owner,
      user,
      user2,
      user3,
      team,
      // other
      OWNED_TOKEN_IDS_BY_USER,
      OWNED_TOKEN_IDS_BY_USER2,
      SIGNED_DATA,
    }
  }

  interface IVerifyIdentityRequestDto {
    identity: string
    timestamp: number
  }

  async function getUserVerificationData(
    userId: string,
    signer: Signer,
    blockTime: number = 0
  ): Promise<string> {
    const blockTimestamp = BigNumber.from(
      (await ethers.provider.getBlock('latest')).timestamp
    )
    const dto = {
      identity: userId, // user public address
      timestamp: blockTime == 0 ? blockTimestamp.toNumber() : blockTime, // unix timestamp
    }
    const message = constructMessage(dto)
    const signature = await constructSignature(signer, dto)
    const identityVerifierData = await encodeDataForSmartContractCall(
      message,
      signature,
      dto.timestamp
    )

    return identityVerifierData
  }

  function constructMessage(dto: IVerifyIdentityRequestDto): string {
    const payload = ethers.utils.solidityPack(
      ['address', 'uint40'],
      [dto.identity, dto.timestamp]
    )
    return ethers.utils.hashMessage(ethers.utils.arrayify(payload))
  }

  async function constructSignature(
    signer: Signer,
    dto: IVerifyIdentityRequestDto
  ): Promise<string> {
    const payload = ethers.utils.solidityPack(
      ['address', 'uint40'],
      [dto.identity, dto.timestamp]
    )
    return await signer.signMessage(ethers.utils.arrayify(payload))
  }

  async function encodeDataForSmartContractCall(
    message: string,
    signature: string,
    dtoTImestamp: number
  ): Promise<string> {
    return ethers.utils.defaultAbiCoder.encode(
      ['uint40', 'bytes32', 'bytes'],
      [dtoTImestamp, message, signature]
    )
  }

  async function getSigners(amount = 40) {
    // getting seed phrase and derivation path from the hardhat config
    const { mnemonic, path } = env.network.config
      .accounts as HttpNetworkHDAccountsConfig
    return [...Array(amount).keys()].map((i) =>
      env.ethers.Wallet.fromMnemonic(mnemonic, `${path}/${i}`).connect(
        env.ethers.provider
      )
    )
  }

  function createLaunchConfig(ts: number, hc: number, team: string, x: string) {
    const config: ILaunchCommon.LaunchConfigVarsStruct = {
      name: 'MEME',
      symbol: 'MEME',
      totalSupply: ts,
      hardCap: hc,
      team: team,
      x: x,
      allocations: [500, 500, 500, 3525, 4700, 0],
      rewardsAllocations: [3500, 3500, 1000, 1000, 1000],
      rounds: [
        BigNumber.from(1 * ONE_DAY),
        BigNumber.from(7 * ONE_DAY),
        BigNumber.from(7 * ONE_DAY),
      ],
      dexIndex: 0,
      steakTeamFee: BigNumber.from(2000),
    }
    return config
  }

  async function getLaunchConfig(launchpad: Contract, index: number) {
    const launch = await (launchpad as Launchpad).getLaunchConfig(index)
    return {
      name: launch.name,
      symbol: launch.symbol,
      dexProvider: launch.dexProvider,
      team: launch.team,
      x: launch.x,
      totalSupply: launch[7][3],
      softCap: launch[7][4],
      hardCap: launch[7][5],
      minPledge: launch[7][6],
      maxPladge: launch[7][7],
      startTime: launch[7][8],
      raisedLP: launch[7][9],
      raisedLPKOL: launch[7][10],
      allocations: launch.allocations,
      rewardsAllocations: launch.rewardsAllocations,
      rounds: [launch[7][0], launch[7][1], launch[7][2]],
      status: launch.status,
      steakTeamFee: launch[7][11],
      steakPlatformFee: launch[7][12],
      minPledgeKOLs: launch[7][13],
      maxPledgeKOLs: launch[7][14],
    }
  }

  describe('Deployment', async () => {
    it('Print out gas needed', async () => {
      const { launchpad } = await loadFixture(deployContractFixture)
      console.log(
        'Gas used for deployment',
        (await launchpad.deployTransaction.wait()).gasUsed.toNumber()
      )
    })

    it('Works on base blockcain', async () => {
      const test = (await ethers.getContractAt(
        'ERC20',
        '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'
      )) as ERC20
      expect(await test.symbol()).to.be.eq('USDC')
    })
  })

  describe('CreateLaunch', async () => {
    it('Should revert if user is not verified', async () => {
      const { launchpad, user2, user3, user, team, owner } = await loadFixture(
        deployContractFixture
      )
      const config = createLaunchConfig(
        1e9,
        250000,
        team.address,
        user3.address
      )
      console.log(config)
      const action = launchpad
        .connect(user2)
        .createLaunch(
          config,
          true,
          await getUserVerificationData(user.address, owner)
        )
      await expect(action).to.be.revertedWith(ERROR.VerificationFailed)
    })

    it('Should revert if some rounds are zero', async () => {
      const { launchpad, user2, user3, team, owner } = await loadFixture(
        deployContractFixture
      )
      var config = {
        name: 'MEME',
        symbol: 'MEME',
        totalSupply: 1e9,
        hardCap: 250000,
        team: team.address,
        x: user3.address,
        allocations: [500, 500, 500, 3525, 4700, 1],
        rewardsAllocations: [3500, 3500, 1000, 1000, 1000] as [
          number,
          number,
          number,
          number,
          number
        ],
        rounds: [1 * ONE_DAY, 0, 7 * ONE_DAY] as [number, number, number],
        dexIndex: 0,
        steakTeamFee: 2000,
      }
      var action = launchpad
        .connect(user2)
        .createLaunch(
          config,
          true,
          await getUserVerificationData(user2.address, owner)
        )
      await expect(action).to.be.revertedWith(ERROR.InvalidRounds)
      config = {
        name: 'MEME',
        symbol: 'MEME',
        totalSupply: 1e9,
        hardCap: 250000,
        team: team.address,
        x: user3.address,
        allocations: [500, 500, 500, 3525, 4700, 0],
        rewardsAllocations: [3500, 3500, 1000, 1000, 1000],
        rounds: [1 * ONE_DAY, 7 * ONE_DAY, 0],
        dexIndex: 0,
        steakTeamFee: 2000,
      }
      action = launchpad
        .connect(user2)
        .createLaunch(
          config,
          true,
          await getUserVerificationData(user2.address, owner)
        )
      await expect(action).to.be.revertedWith(ERROR.InvalidRounds)
      config = {
        name: 'MEME',
        symbol: 'MEME',
        totalSupply: 1e9,
        hardCap: 250000,
        team: team.address,
        x: user3.address,
        allocations: [500, 500, 500, 3525, 4700, 0],
        rewardsAllocations: [3500, 3500, 1000, 1000, 1000] as [
          number,
          number,
          number,
          number,
          number
        ],
        rounds: [0, 7 * ONE_DAY, 7 * ONE_DAY],
        dexIndex: 0,
        steakTeamFee: 2000,
      }
      action = launchpad
        .connect(user2)
        .createLaunch(
          config,
          true,
          await getUserVerificationData(user2.address, owner)
        )
      await expect(action).to.be.revertedWith(ERROR.InvalidRounds)
    })

    it('Should revert if alllocations do not sum up to 100%', async () => {
      const { launchpad, user2, user3, team, owner } = await loadFixture(
        deployContractFixture
      )
      var config = {
        name: 'MEME',
        symbol: 'MEME',
        totalSupply: 1e9,
        hardCap: 250000,
        team: team.address,
        x: user3.address,
        allocations: [500, 500, 500, 3525, 4700, 1],
        rewardsAllocations: [3500, 3500, 1000, 1000, 1000] as [
          number,
          number,
          number,
          number,
          number
        ],
        rounds: [1 * ONE_DAY, 7 * ONE_DAY, 7 * ONE_DAY] as [
          number,
          number,
          number
        ],
        dexIndex: 0,
        steakTeamFee: 2000,
      }
      var action = launchpad
        .connect(user2)
        .createLaunch(
          config,
          true,
          await getUserVerificationData(user2.address, owner)
        )
      await expect(action).to.be.revertedWith(ERROR.InvalidAllocations)
      config = {
        name: 'MEME',
        symbol: 'MEME',
        totalSupply: 1e9,
        hardCap: 250000,
        team: team.address,
        x: user3.address,
        allocations: [500, 500, 500, 3524, 4700, 0],
        rewardsAllocations: [3500, 3500, 1000, 1000, 1000] as [
          number,
          number,
          number,
          number,
          number
        ],
        rounds: [1 * ONE_DAY, 7 * ONE_DAY, 7 * ONE_DAY],
        dexIndex: 0,
        steakTeamFee: 2000,
      }
      action = launchpad
        .connect(user2)
        .createLaunch(
          config,
          true,
          await getUserVerificationData(user2.address, owner)
        )
      await expect(action).to.be.revertedWith(ERROR.InvalidAllocations)
    })

    it('Should revert if total supply is zero', async () => {
      const { launchpad, user2, user3, team, owner } = await loadFixture(
        deployContractFixture
      )
      var config = {
        name: 'MEME',
        symbol: 'MEME',
        totalSupply: 0,
        hardCap: 250000,
        team: team.address,
        x: user3.address,
        allocations: [500, 500, 500, 3525, 4700, 0],
        rewardsAllocations: [3500, 3500, 1000, 1000, 1000] as [
          number,
          number,
          number,
          number,
          number
        ],
        rounds: [1 * ONE_DAY, 7 * ONE_DAY, 7 * ONE_DAY] as [
          number,
          number,
          number
        ],
        dexIndex: 0,
        steakTeamFee: 2000,
      }
      var action = launchpad
        .connect(user2)
        .createLaunch(
          config,
          true,
          await getUserVerificationData(user2.address, owner)
        )
      await expect(action).to.be.revertedWith(ERROR.InvalidTotalSupply)
    })

    it('Should revert if hard cap is lower or equal than soft cap', async () => {
      const { launchpad, user2, user3, team, owner } = await loadFixture(
        deployContractFixture
      )
      var config = {
        name: 'MEME',
        symbol: 'MEME',
        totalSupply: 1e9,
        hardCap: 100000,
        team: team.address,
        x: user3.address,
        allocations: [500, 500, 500, 3525, 4700, 0],
        rewardsAllocations: [3500, 3500, 1000, 1000, 1000] as [
          number,
          number,
          number,
          number,
          number
        ],
        rounds: [1 * ONE_DAY, 7 * ONE_DAY, 7 * ONE_DAY] as [
          number,
          number,
          number
        ],
        dexIndex: 0,
        steakTeamFee: 2000,
      }
      var action = launchpad
        .connect(user2)
        .createLaunch(
          config,
          true,
          await getUserVerificationData(user2.address, owner)
        )
      await expect(action).to.be.revertedWith(ERROR.InvalidHardCap)
      config = {
        name: 'MEME',
        symbol: 'MEME',
        totalSupply: 1e9,
        hardCap: 100000 - 1,
        team: team.address,
        x: user3.address,
        allocations: [500, 500, 500, 3525, 4700, 0],
        rewardsAllocations: [3500, 3500, 1000, 1000, 1000],
        rounds: [1 * ONE_DAY, 7 * ONE_DAY, 7 * ONE_DAY],
        dexIndex: 0,
        steakTeamFee: 2000,
      }
      action = launchpad
        .connect(user2)
        .createLaunch(
          config,
          true,
          await getUserVerificationData(user2.address, owner)
        )
      await expect(action).to.be.revertedWith(ERROR.InvalidHardCap)
    })

    it('Should revert if debt index is out of bounds', async () => {
      const { launchpad, fomoUsdcLp, user3, team, owner } = await loadFixture(
        deployContractFixture
      )
      const config = createLaunchConfig(
        1e9,
        250000,
        team.address,
        user3.address
      )
      config.dexIndex = 2
      await fomoUsdcLp
        .connect(user3)
        .approve(launchpad.address, constants.MaxUint256)
      const action = launchpad
        .connect(user3)
        .createLaunch(
          config,
          false,
          await getUserVerificationData(user3.address, owner)
        )
      await expect(action).to.be.revertedWith(ERROR.InvalidDexIndex)
    })

    it('Should revert if user has too little lpt', async () => {
      const { launchpad, fomoUsdcLp, user3, team, owner } = await loadFixture(
        deployContractFixture
      )
      const config = createLaunchConfig(
        1e9,
        250000,
        team.address,
        user3.address
      )
      await fomoUsdcLp
        .connect(user3)
        .approve(launchpad.address, constants.MaxUint256)
      const action = launchpad
        .connect(user3)
        .createLaunch(
          config,
          false,
          await getUserVerificationData(user3.address, owner)
        )
      await expect(action).to.be.revertedWith('ds-math-sub-underflow')
    })

    it('Should revert if user has too little lpt in steak', async () => {
      const { launchpad, fomoUsdcLp, user3, team, owner } = await loadFixture(
        deployContractFixture
      )
      const config = createLaunchConfig(
        1e9,
        250000,
        team.address,
        user3.address
      )
      await fomoUsdcLp
        .connect(user3)
        .approve(launchpad.address, constants.MaxUint256)
      const action = launchpad
        .connect(user3)
        .createLaunch(
          config,
          true,
          await getUserVerificationData(user3.address, owner)
        )
      await expect(action).to.be.revertedWith('Amount greater than staked')
    })

    it('Should transfer correct lpt amounts', async () => {
      const { launchpad, fomoUsdcLp, user, user3, team, owner } =
        await loadFixture(deployContractFixture)
      const config = createLaunchConfig(
        1e9,
        250000,
        team.address,
        user3.address
      )
      await fomoUsdcLp
        .connect(user)
        .approve(launchpad.address, constants.MaxUint256)
      const balanceBefore = await fomoUsdcLp.balanceOf(launchpad.address)
      const userBalanceBefore = await fomoUsdcLp.balanceOf(user.address)
      await launchpad
        .connect(user)
        .createLaunch(
          config,
          false,
          await getUserVerificationData(user.address, owner)
        )
      expect(balanceBefore).to.be.eq(0)
      expect(await fomoUsdcLp.balanceOf(launchpad.address)).to.be.eq(LP_5K)
      expect(await fomoUsdcLp.balanceOf(user.address)).to.be.eq(
        userBalanceBefore.sub(LP_5K)
      )
    })

    it('Should transfer correct lpt amounts from steak', async () => {
      const {
        launchpad,
        steakController,
        fomoUsdcLp,
        user2,
        user3,
        team,
        owner,
      } = await loadFixture(deployContractFixture)
      const config = createLaunchConfig(
        1e9,
        250000,
        team.address,
        user3.address
      )
      const balanceBefore = await fomoUsdcLp.balanceOf(launchpad.address)
      const userBalanceBefore = await fomoUsdcLp.balanceOf(user2.address)
      const steakBalanceBefore = await fomoUsdcLp.balanceOf(
        steakController.address
      )
      await launchpad
        .connect(user2)
        .createLaunch(
          config,
          true,
          await getUserVerificationData(user2.address, owner)
        )
      expect(balanceBefore).to.be.eq(0)
      expect(userBalanceBefore).to.be.eq(0)
      expect(await fomoUsdcLp.balanceOf(user2.address)).to.be.eq(0)
      expect(await fomoUsdcLp.balanceOf(launchpad.address)).to.be.eq(LP_5K)
      expect(await fomoUsdcLp.balanceOf(steakController.address)).to.be.eq(
        steakBalanceBefore.sub(LP_5K)
      )
    })

    it('Should add launch index to activeLaunches', async () => {
      const { launchpad, fomoUsdcLp, user, user3, team, owner } =
        await loadFixture(deployContractFixture)
      const config = createLaunchConfig(
        1e9,
        250000,
        team.address,
        user3.address
      )
      await fomoUsdcLp
        .connect(user)
        .approve(launchpad.address, constants.MaxUint256)
      await launchpad
        .connect(user)
        .createLaunch(
          config,
          false,
          await getUserVerificationData(user.address, owner)
        )

      expect(await launchpad.activeLaunches(0)).to.be.eq(0)
    })

    it('Should add x2, remove, add launch indexes correclty to active launches', async () => {
      const { launchpad, fomoUsdcLp, user, user3, team, owner } =
        await loadFixture(deployContractFixture)
      const config = createLaunchConfig(
        1e9,
        250000,
        team.address,
        user3.address
      )
      await fomoUsdcLp
        .connect(user)
        .approve(launchpad.address, constants.MaxUint256)
      await launchpad
        .connect(user)
        .createLaunch(
          config,
          false,
          await getUserVerificationData(user.address, owner)
        )
      await launchpad
        .connect(user)
        .createLaunch(
          config,
          false,
          await getUserVerificationData(user.address, owner)
        )

      expect(await launchpad.activeLaunches(0)).to.be.eq(0)
      expect(await launchpad.activeLaunches(1)).to.be.eq(1)

      await launchpad.connect(owner).emergencyFailLaunch(0)
      expect(await launchpad.activeLaunches(0)).to.be.eq(1)
      await launchpad
        .connect(user)
        .createLaunch(
          config,
          false,
          await getUserVerificationData(user.address, owner)
        )

      expect(await launchpad.activeLaunches(0)).to.be.eq(1)
      expect(await launchpad.activeLaunches(1)).to.be.eq(2)
    })

    it('Should add Allocations with zero values', async () => {
      const { launchpad, fomoUsdcLp, user, user3, team, owner } =
        await loadFixture(deployContractFixture)
      const config = createLaunchConfig(
        1e9,
        250000,
        team.address,
        user3.address
      )
      await fomoUsdcLp
        .connect(user)
        .approve(launchpad.address, constants.MaxUint256)
      await launchpad
        .connect(user)
        .createLaunch(
          config,
          false,
          await getUserVerificationData(user.address, owner)
        )

      const alloc = await launchpad.tokenAddresses(0)
      expect(alloc.usdc).to.be.eq(0)
      expect(alloc.fomo).to.be.eq(0)
      expect(alloc.token).to.be.eq(constants.AddressZero)
      expect(alloc.tokenIC).to.be.eq(constants.AddressZero)
      expect(alloc.fomoLPIC).to.be.eq(constants.AddressZero)
      expect(alloc.fomoLP).to.be.eq(constants.AddressZero)
      expect(alloc.usdcLPIC).to.be.eq(constants.AddressZero)
      expect(alloc.usdcLP).to.be.eq(constants.AddressZero)
      expect(alloc.vesting).to.be.eq(constants.AddressZero)
    })

    it('Should add LaunchConfig correctly', async () => {
      const { launchpad, fomoUsdcLp, user, team, user3, owner } =
        await loadFixture(deployContractFixture)
      var config = createLaunchConfig(1e9, 250000, team.address, user3.address)
      await fomoUsdcLp
        .connect(user)
        .approve(launchpad.address, constants.MaxUint256)
      await launchpad
        .connect(user)
        .createLaunch(
          config,
          false,
          await getUserVerificationData(user.address, owner)
        )
      var timestamp = (await ethers.provider.getBlock('latest')).timestamp

      var launch = await getLaunchConfig(launchpad, 0)
      expect(launch.name).to.be.eq('MEME')
      expect(launch.symbol).to.be.eq('MEME')
      expect(launch.totalSupply).to.be.eq('1000000000')
      expect(launch.softCap).to.be.eq(parseUnits('100000', 6))
      expect(launch.hardCap).to.be.eq(parseUnits('250000', 6))
      expect(launch.team).to.be.eq(team.address)
      expect(launch.startTime).to.be.eq(timestamp)
      expect(launch.raisedLP).to.be.eq(LP_5K)
      expect(launch.raisedLPKOL).to.be.eq(0)
      expect(launch.status).to.be.eq(0)

      config = createLaunchConfig(1e10, 500000, team.address, user3.address)
      await launchpad
        .connect(user)
        .createLaunch(
          config,
          false,
          await getUserVerificationData(user.address, owner)
        )

      timestamp = (await ethers.provider.getBlock('latest')).timestamp
      launch = await getLaunchConfig(launchpad, 1)
      expect(launch.name).to.be.eq('MEME')
      expect(launch.symbol).to.be.eq('MEME')
      expect(launch.totalSupply).to.be.eq('10000000000')
      expect(launch.softCap).to.be.eq(parseUnits('100000', 6))
      expect(launch.hardCap).to.be.eq(parseUnits('500000', 6))
      expect(launch.team).to.be.eq(team.address)
      expect(launch.startTime).to.be.eq(timestamp)
      expect(launch.raisedLP).to.be.eq(LP_5K)
      expect(launch.raisedLPKOL).to.be.eq(0)
      expect(launch.status).to.be.eq(0)

      config = createLaunchConfig(1e11, 1000000, team.address, user3.address)
      await launchpad
        .connect(user)
        .createLaunch(
          config,
          false,
          await getUserVerificationData(user.address, owner)
        )

      timestamp = (await ethers.provider.getBlock('latest')).timestamp
      launch = await getLaunchConfig(launchpad, 2)
      expect(launch.name).to.be.eq('MEME')
      expect(launch.symbol).to.be.eq('MEME')
      expect(launch.totalSupply).to.be.eq('100000000000')
      expect(launch.softCap).to.be.eq(parseUnits('100000', 6))
      expect(launch.hardCap).to.be.eq(parseUnits('1000000', 6))
      expect(launch.team).to.be.eq(team.address)
      expect(launch.startTime).to.be.eq(timestamp)
      expect(launch.raisedLP).to.be.eq(LP_5K)
      expect(launch.raisedLPKOL).to.be.eq(0)
      expect(launch.status).to.be.eq(0)
    })

    it('Should add LaunchConfig with correct values', async () => {
      const { launchpad, fomoUsdcLp, user, team, user3, owner } =
        await loadFixture(deployContractFixture)
      var config = createLaunchConfig(1e9, 250000, team.address, user3.address)
      await fomoUsdcLp
        .connect(user)
        .approve(launchpad.address, constants.MaxUint256)
      await launchpad
        .connect(user)
        .createLaunch(
          config,
          false,
          await getUserVerificationData(user.address, owner)
        )
      var timestamp = (await ethers.provider.getBlock('latest')).timestamp
      config.allocations.push(0)
      config.allocations[6] = await launchpad.PLATFORM_MEME_FEE()
      var launch = await getLaunchConfig(launchpad, 0)
      expect(launch.name).to.be.eq(config.name)
      expect(launch.symbol).to.be.eq(config.symbol)
      expect(launch.dexProvider).to.be.eq(
        await launchpad.dexProviders(config.dexIndex)
      )
      expect(launch.team).to.be.eq(team.address)
      expect(launch.x).to.be.eq(user3.address)
      expect(launch.totalSupply).to.be.eq(config.totalSupply)
      expect(launch.softCap).to.be.eq(await launchpad.USDC_SOFT_CAP())
      expect(launch.hardCap).to.be.eq(
        BigNumber.from(await config.hardCap).mul(1e6)
      )
      expect(launch.minPledge).to.be.eq(await launchpad.USDC_MIN())
      expect(launch.maxPladge).to.be.eq(await launchpad.USDC_MAX())
      expect(launch.minPledgeKOLs).to.be.eq(await launchpad.USDC_KOL_MIN())
      expect(launch.maxPledgeKOLs).to.be.eq(await launchpad.USDC_KOL_MAX())
      expect(launch.startTime).to.be.eq(timestamp)
      expect(launch.raisedLP).to.be.eq(LP_5K)
      expect(launch.raisedLPKOL).to.be.eq(0)
      expect(launch.allocations).to.be.deep.eq(config.allocations)
      expect(launch.rewardsAllocations).to.be.deep.eq(config.rewardsAllocations)
      expect(launch.rounds).to.be.deep.eq(config.rounds)
      expect(launch.status).to.be.eq(0)
      expect(launch.steakTeamFee).to.be.eq(config.steakTeamFee)
      expect(launch.steakPlatformFee).to.be.eq(
        await launchpad.PLATFORM_STEAK_FEE()
      )
    })

    it('Should add LaunchConfig correctly for KOL', async () => {
      const { launchpad, fomoUsdcLp, user, team, user3, owner } =
        await loadFixture(deployContractFixture)
      var config = createLaunchConfig(1e9, 250000, team.address, user3.address)
      await launchpad.connect(owner).addKOL(user.address)
      await fomoUsdcLp
        .connect(user)
        .approve(launchpad.address, constants.MaxUint256)
      await launchpad
        .connect(user)
        .createLaunch(
          config,
          false,
          await getUserVerificationData(user.address, owner)
        )
      var timestamp = (await ethers.provider.getBlock('latest')).timestamp

      var launch = await getLaunchConfig(launchpad, 0)
      expect(launch.name).to.be.eq('MEME')
      expect(launch.symbol).to.be.eq('MEME')
      expect(launch.totalSupply).to.be.eq('1000000000')
      expect(launch.softCap).to.be.eq(parseUnits('100000', 6))
      expect(launch.hardCap).to.be.eq(parseUnits('250000', 6))
      expect(launch.team).to.be.eq(team.address)
      expect(launch.startTime).to.be.eq(timestamp)
      expect(launch.raisedLP).to.be.eq(LP_5K)
      expect(launch.raisedLPKOL).to.be.eq(LP_5K)
      expect(launch.status).to.be.eq(0)

      config = createLaunchConfig(1e10, 500000, team.address, user3.address)
      await launchpad
        .connect(user)
        .createLaunch(
          config,
          false,
          await getUserVerificationData(user.address, owner)
        )

      timestamp = (await ethers.provider.getBlock('latest')).timestamp
      launch = await getLaunchConfig(launchpad, 1)
      expect(launch.name).to.be.eq('MEME')
      expect(launch.symbol).to.be.eq('MEME')
      expect(launch.totalSupply).to.be.eq('10000000000')
      expect(launch.softCap).to.be.eq(parseUnits('100000', 6))
      expect(launch.hardCap).to.be.eq(parseUnits('500000', 6))
      expect(launch.team).to.be.eq(team.address)
      expect(launch.startTime).to.be.eq(timestamp)
      expect(launch.raisedLP).to.be.eq(LP_5K)
      expect(launch.raisedLPKOL).to.be.eq(LP_5K)
      expect(launch.status).to.be.eq(0)

      config = createLaunchConfig(1e11, 1000000, team.address, user3.address)
      await launchpad
        .connect(user)
        .createLaunch(
          config,
          false,
          await getUserVerificationData(user.address, owner)
        )

      timestamp = (await ethers.provider.getBlock('latest')).timestamp
      launch = await getLaunchConfig(launchpad, 2)
      expect(launch.name).to.be.eq('MEME')
      expect(launch.symbol).to.be.eq('MEME')
      expect(launch.totalSupply).to.be.eq('100000000000')
      expect(launch.softCap).to.be.eq(parseUnits('100000', 6))
      expect(launch.hardCap).to.be.eq(parseUnits('1000000', 6))
      expect(launch.team).to.be.eq(team.address)
      expect(launch.startTime).to.be.eq(timestamp)
      expect(launch.raisedLP).to.be.eq(LP_5K)
      expect(launch.raisedLPKOL).to.be.eq(LP_5K)
      expect(launch.status).to.be.eq(0)
    })

    it('Should add LaunchConfig with correct values for KOL', async () => {
      const { launchpad, fomoUsdcLp, user, team, user3, owner } =
        await loadFixture(deployContractFixture)
      var config = createLaunchConfig(1e9, 250000, team.address, user3.address)
      await launchpad.connect(owner).addKOL(user.address)
      await fomoUsdcLp
        .connect(user)
        .approve(launchpad.address, constants.MaxUint256)
      await launchpad
        .connect(user)
        .createLaunch(
          config,
          false,
          await getUserVerificationData(user.address, owner)
        )
      var timestamp = (await ethers.provider.getBlock('latest')).timestamp
      config.allocations.push(0)
      config.allocations[6] = await launchpad.PLATFORM_MEME_FEE()
      var launch = await getLaunchConfig(launchpad, 0)
      expect(launch.name).to.be.eq(config.name)
      expect(launch.symbol).to.be.eq(config.symbol)
      expect(launch.dexProvider).to.be.eq(
        await launchpad.dexProviders(config.dexIndex)
      )
      expect(launch.team).to.be.eq(team.address)
      expect(launch.x).to.be.eq(user3.address)
      expect(launch.totalSupply).to.be.eq(config.totalSupply)
      expect(launch.softCap).to.be.eq(await launchpad.USDC_SOFT_CAP())
      expect(launch.hardCap).to.be.eq(
        BigNumber.from(await config.hardCap).mul(1e6)
      )
      expect(launch.minPledge).to.be.eq(await launchpad.USDC_MIN())
      expect(launch.maxPladge).to.be.eq(await launchpad.USDC_MAX())
      expect(launch.minPledgeKOLs).to.be.eq(await launchpad.USDC_KOL_MIN())
      expect(launch.maxPledgeKOLs).to.be.eq(await launchpad.USDC_KOL_MAX())
      expect(launch.startTime).to.be.eq(timestamp)
      expect(launch.raisedLP).to.be.eq(LP_5K)
      expect(launch.raisedLPKOL).to.be.eq(LP_5K)
      expect(launch.allocations).to.be.deep.eq(config.allocations)
      expect(launch.rewardsAllocations).to.be.deep.eq(config.rewardsAllocations)
      expect(launch.rounds).to.be.deep.eq(config.rounds)
      expect(launch.status).to.be.eq(0)
      expect(launch.steakTeamFee).to.be.eq(config.steakTeamFee)
      expect(launch.steakPlatformFee).to.be.eq(
        await launchpad.PLATFORM_STEAK_FEE()
      )
    })

    it('Should update user pledge correctly', async () => {
      const { launchpad, fomoUsdcLp, user, user3, team, owner } =
        await loadFixture(deployContractFixture)
      const config = createLaunchConfig(
        1e9,
        250000,
        team.address,
        user3.address
      )
      await fomoUsdcLp
        .connect(user)
        .approve(launchpad.address, constants.MaxUint256)
      await launchpad
        .connect(user)
        .createLaunch(
          config,
          false,
          await getUserVerificationData(user.address, owner)
        )
      const userPledge = await launchpad.launchToUserPledge(0, user.address)
      expect(userPledge.lp).to.be.eq(LP_5K)
      expect(userPledge.usdc).to.be.eq(parseUnits('5000', 6))
    })

    it('Should emit LaunchCreated event', async () => {
      const { launchpad, fomoUsdcLp, user, user3, team, owner } =
        await loadFixture(deployContractFixture)
      const config = createLaunchConfig(
        1e9,
        250000,
        team.address,
        user3.address
      )
      await fomoUsdcLp
        .connect(user)
        .approve(launchpad.address, constants.MaxUint256)
      const action = launchpad
        .connect(user)
        .createLaunch(
          config,
          false,
          await getUserVerificationData(user.address, owner)
        )

      await expect(action)
        .to.emit(launchpad, 'LaunchCreated')
        .withArgs('MEME', 'MEME', 0)
    })
  })

  describe('Pledge', async () => {
    it('Should revert if user is not verified', async () => {
      const { launchpad, fomoUsdcLp, user, SIGNED_DATA } = await loadFixture(
        deployContractFixtureWithLaunch
      )
      await launchpad.addKOL(user.address)
      await fomoUsdcLp
        .connect(user)
        .approve(launchpad.address, constants.MaxUint256)
      const action = launchpad
        .connect(user)
        .pledge(0, LP_500, false, SIGNED_DATA[0])
      await expect(action).to.be.revertedWith(ERROR.VerificationFailed)
    })

    it('Should revert if launch is not in PENDING state', async () => {
      const { launchpad, fomoUsdcLp, user, owner } = await loadFixture(
        deployContractFixtureWithLaunch
      )
      await launchpad.addKOL(user.address)
      const launch = await getLaunchConfig(launchpad, 0)
      const blockTimestamp = launch.startTime
        .add(BigNumber.from('86400').mul(15))
        .toNumber()
      await ethers.provider.send('evm_setNextBlockTimestamp', [blockTimestamp])
      await fomoUsdcLp
        .connect(user)
        .approve(launchpad.address, constants.MaxUint256)
      await launchpad
        .connect(user)
        .pledge(
          0,
          LP_500,
          false,
          await getUserVerificationData(user.address, owner, blockTimestamp)
        )
      const action = launchpad
        .connect(user)
        .pledge(
          0,
          LP_500,
          false,
          await getUserVerificationData(user.address, owner, blockTimestamp)
        )
      await expect(action).to.be.revertedWith(ERROR.LaunchIsNotPending)
    })

    it('Should fail if user has too little lpt', async () => {
      const { launchpad, fomoUsdcLp, user3, SIGNED_DATA } = await loadFixture(
        deployContractFixtureWithLaunch
      )
      await launchpad.addKOL(user3.address)
      await fomoUsdcLp
        .connect(user3)
        .approve(launchpad.address, constants.MaxUint256)
      const action = launchpad
        .connect(user3)
        .pledge(0, LP_500, false, SIGNED_DATA[3])
      await expect(action).to.be.revertedWith('ds-math-sub-underflow')
    })

    it('Should fail if user has too little lpt in steak', async () => {
      const { launchpad, fomoUsdcLp, user3, SIGNED_DATA } = await loadFixture(
        deployContractFixtureWithLaunch
      )
      await launchpad.addKOL(user3.address)
      await fomoUsdcLp
        .connect(user3)
        .approve(launchpad.address, constants.MaxUint256)
      const action = launchpad
        .connect(user3)
        .pledge(0, LP_500, true, SIGNED_DATA[3])
      await expect(action).to.be.revertedWith('Amount greater than staked')
    })

    it('Should end raise if hard cap is already reached before pledge', async () => {
      const {
        launchpad,
        fomoUsdcLp,
        user,
        team,
        owner,
        usdc,
        fomo,
        SIGNED_DATA,
      } = await loadFixture(deployContractFixtureWithLaunch)
      const pledgers = await getSigners(53)
      // Pledge $240k (+ $5k deposit) = $245k in total
      for (let i = 5; i < 53; i++) {
        await owner.sendTransaction({
          to: pledgers[i].address,
          value: parseEther('1.0'),
        })
        await fomoUsdcLp.connect(owner).transfer(pledgers[i].address, LP_5K)
        await launchpad.connect(owner).addKOL(pledgers[i].address)
        await fomoUsdcLp
          .connect(pledgers[i])
          .approve(launchpad.address, constants.MaxUint256)
        await launchpad
          .connect(pledgers[i])
          .pledge(0, LP_5K, false, SIGNED_DATA[i])
      }
      // Inflate FOMO token price
      const options = {
        signer: owner,
        amountIn: parseUnits('10000', 6),
        inputToken: usdc.address,
        outputToken: fomo.address,
      }
      await env.uniswapV2.swap(options)

      // Try to pledge when raised value is $251,125 (above hard cap)
      // const RAISED_USDC = BigNumber.from("251125000000").div(2)
      // const RAISED_FOMO = BigNumber.from("119520940556626094592287")
      await launchpad.connect(owner).addKOL(user.address)
      await fomoUsdcLp
        .connect(user)
        .approve(launchpad.address, constants.MaxUint256)
      const userBalanceBefore = await fomoUsdcLp.balanceOf(user.address)
      // const ownerBalanceBefore = await usdc.balanceOf(owner.address)
      await launchpad.connect(user).pledge(0, LP_5K, false, SIGNED_DATA[1])
      // Check end raise and conditions
      expect(await fomoUsdcLp.balanceOf(user.address)).to.be.eq(
        userBalanceBefore
      )
      const userPledge = await launchpad.launchToUserPledge(0, user.address)
      expect(userPledge.lp).to.be.eq(0)
      expect(userPledge.usdc).to.be.eq(0)
      // const alloc = await launchpad.tokenAddresses(0)
      // expect(alloc.usdc).to.be.eq(RAISED_USDC.mul(75).div(100))
      // expect(alloc.fomo).to.be.eq(RAISED_FOMO.mul(75).div(100))

      const launch = await getLaunchConfig(launchpad, 0)
      expect(launch.status).to.be.eq(2)
      expect(launch.raisedLP).to.be.eq(LP_5K.mul(49))
      expect(await launchpad.activeLaunches(0)).to.be.eq(0)
      // expect(await fomoUsdcLp.balanceOf(team.address)).to.be.eq(launch.raisedLP.mul(20).div(100))
      // expect(await usdc.balanceOf(owner.address)).to.be.eq(RAISED_USDC.mul(5).div(100).add(ownerBalanceBefore))
      // expect(await usdc.balanceOf(launchpad.address)).to.be.eq(RAISED_USDC.mul(75).div(100))
      // expect(await fomo.balanceOf(launchpad.address)).to.be.eq(alloc.fomo)
      // expect(await fomo.balanceOf(DEAD_ADDRESS)).to.be.eq(RAISED_FOMO.mul(5).div(100))
    })

    it('Should end raise if hard cap is already reached after pledge', async () => {
      const {
        launchpad,
        fomoUsdcLp,
        user,
        team,
        owner,
        usdc,
        fomo,
        SIGNED_DATA,
      } = await loadFixture(deployContractFixtureWithLaunch)
      const pledgers = await getSigners(53)
      // Pledge $240k (+ $5k deposit) = $245k in total
      for (let i = 5; i < 53; i++) {
        await owner.sendTransaction({
          to: pledgers[i].address,
          value: parseEther('1.0'),
        })
        await fomoUsdcLp.connect(owner).transfer(pledgers[i].address, LP_5K)
        await launchpad.connect(owner).addKOL(pledgers[i].address)
        await fomoUsdcLp
          .connect(pledgers[i])
          .approve(launchpad.address, constants.MaxUint256)
        await launchpad
          .connect(pledgers[i])
          .pledge(0, LP_5K, false, SIGNED_DATA[i])
      }
      // Try to pledge when raised value is $250,000 (above hard cap)
      // const RAISED_USDC = BigNumber.from("250000000000").div(2)
      // const RAISED_FOMO = BigNumber.from("125000000000000000000000")
      await launchpad.connect(owner).addKOL(user.address)
      await fomoUsdcLp
        .connect(user)
        .approve(launchpad.address, constants.MaxUint256)
      const userBalanceBefore = await fomoUsdcLp.balanceOf(user.address)
      // const ownerBalanceBefore = await usdc.balanceOf(owner.address)
      await launchpad.connect(user).pledge(0, LP_5K, false, SIGNED_DATA[1])
      // Check end raise and conditions
      expect(await fomoUsdcLp.balanceOf(user.address)).to.be.eq(
        userBalanceBefore.sub(LP_5K)
      )
      const userPledge = await launchpad.launchToUserPledge(0, user.address)
      expect(userPledge.lp).to.be.eq(LP_5K)
      expect(userPledge.usdc).to.be.eq(parseUnits('5000', 6))
      // const alloc = await launchpad.tokenAddresses(0)
      // expect(alloc.usdc).to.be.eq(RAISED_USDC.mul(75).div(100))
      // expect(alloc.fomo).to.be.eq(RAISED_FOMO.mul(75).div(100))
      const launch = await getLaunchConfig(launchpad, 0)
      expect(launch.status).to.be.eq(2)
      expect(launch.raisedLP).to.be.eq(LP_5K.mul(50))
      expect(await launchpad.activeLaunches(0)).to.be.eq(0)
      // expect(await fomoUsdcLp.balanceOf(team.address)).to.be.eq(launch.raisedLP.mul(20).div(100))
      // expect(await usdc.balanceOf(launchpad.address)).to.be.eq(RAISED_USDC.mul(75).div(100))
      // expect(await usdc.balanceOf(owner.address)).to.be.eq(RAISED_USDC.mul(5).div(100).add(ownerBalanceBefore))
      // expect((await fomo.balanceOf(DEAD_ADDRESS))).to.be.eq(RAISED_FOMO.mul(5).div(100))
      // expect((await fomo.balanceOf(launchpad.address))).to.be.eq(RAISED_FOMO.mul(75).div(100))
    })

    it('Should end raise after 15 days as soft cap reached', async () => {
      const {
        launchpad,
        fomoUsdcLp,
        user,
        team,
        owner,
        usdc,
        fomo,
        SIGNED_DATA,
      } = await loadFixture(deployContractFixtureWithLaunch)
      const pledgers = await getSigners(24)
      // Pledge $95k (+ $5k deposit) = $100k in total
      for (let i = 5; i < 24; i++) {
        await owner.sendTransaction({
          to: pledgers[i].address,
          value: parseEther('1.0'),
        })
        await fomoUsdcLp.connect(owner).transfer(pledgers[i].address, LP_5K)
        await launchpad.connect(owner).addKOL(pledgers[i].address)
        await fomoUsdcLp
          .connect(pledgers[i])
          .approve(launchpad.address, constants.MaxUint256)
        await launchpad
          .connect(pledgers[i])
          .pledge(0, LP_5K, false, SIGNED_DATA[i])
      }
      // Try to pledge when raised value is $100,000 (soft cap & after deadline)
      // const RAISED_USDC = BigNumber.from("100000000000").div(2)
      // const RAISED_FOMO = BigNumber.from("100000000000000000000000").div(2)
      await fomoUsdcLp
        .connect(user)
        .approve(launchpad.address, constants.MaxUint256)
      const userBalanceBefore = await fomoUsdcLp.balanceOf(user.address)
      // const ownerBalanceBefore = await usdc.balanceOf(owner.address)
      const launchBefore = await getLaunchConfig(launchpad, 0)
      const blockTimestamp = launchBefore.startTime
        .add(BigNumber.from('86400').mul(15))
        .toNumber()
      await ethers.provider.send('evm_setNextBlockTimestamp', [blockTimestamp])
      await launchpad
        .connect(user)
        .pledge(
          0,
          LP_5K,
          false,
          await getUserVerificationData(user.address, owner, blockTimestamp)
        )
      // Check end raise and conditions
      expect(await fomoUsdcLp.balanceOf(user.address)).to.be.eq(
        userBalanceBefore
      )
      const userPledge = await launchpad.launchToUserPledge(0, user.address)
      expect(userPledge.lp).to.be.eq(0)
      expect(userPledge.usdc).to.be.eq(0)
      const launch = await getLaunchConfig(launchpad, 0)
      expect(launch.status).to.be.eq(1)
      expect(launch.raisedLP).to.be.eq(LP_5K.mul(20))
      expect(await launchpad.activeLaunches(0)).to.be.eq(0)
      // expect(await fomoUsdcLp.balanceOf(team.address)).to.be.eq(launch.raisedLP.mul(20).div(100))
      // expect(await usdc.balanceOf(launchpad.address)).to.be.eq(RAISED_USDC.mul(75).div(100))
      // expect(await usdc.balanceOf(owner.address)).to.be.eq(RAISED_USDC.mul(5).div(100).add(ownerBalanceBefore))
      // expect(await fomo.balanceOf(launchpad.address)).to.be.eq(RAISED_FOMO.mul(75).div(100))
      // expect(await fomo.balanceOf(DEAD_ADDRESS)).to.be.eq(RAISED_FOMO.mul(5).div(100))
      // const alloc = await launchpad.tokenAddresses(0)
      // expect(alloc.usdc).to.be.eq(RAISED_USDC.mul(75).div(100))
      // expect(alloc.fomo).to.be.eq(RAISED_FOMO.mul(75).div(100))
    })

    it('Should end raise after 15 days as failed', async () => {
      const { launchpad, fomoUsdcLp, user, user3, team, owner, SIGNED_DATA } =
        await loadFixture(deployContractFixtureWithLaunch)
      const config = createLaunchConfig(
        1e9,
        250000,
        team.address,
        user3.address
      )
      await fomoUsdcLp.approve(launchpad.address, constants.MaxUint256)
      await launchpad.createLaunch(
        config,
        false,
        await getUserVerificationData(owner.address, owner)
      )
      expect(await launchpad.activeLaunches(0)).to.be.eq(0)
      expect(await launchpad.activeLaunches(1)).to.be.eq(1)
      const launch = await getLaunchConfig(launchpad, 0)
      const pledgers = await getSigners(23)
      // Pledge $90k (+ $5k deposit) = $95k in total
      for (let i = 5; i < 23; i++) {
        await owner.sendTransaction({
          to: pledgers[i].address,
          value: parseEther('1.0'),
        })
        await fomoUsdcLp.connect(owner).transfer(pledgers[i].address, LP_5K)
        await launchpad.connect(owner).addKOL(pledgers[i].address)
        await fomoUsdcLp
          .connect(pledgers[i])
          .approve(launchpad.address, constants.MaxUint256)
        await launchpad
          .connect(pledgers[i])
          .pledge(0, LP_5K, false, SIGNED_DATA[i])
      }
      const balanceBefore = await fomoUsdcLp.balanceOf(launchpad.address)
      await fomoUsdcLp
        .connect(user)
        .approve(launchpad.address, constants.MaxUint256)
      const blockTimestamp = launch.startTime
        .add(BigNumber.from('86400').mul(15))
        .toNumber()
      await ethers.provider.send('evm_setNextBlockTimestamp', [blockTimestamp])
      await launchpad
        .connect(user)
        .pledge(
          0,
          LP_500,
          false,
          await getUserVerificationData(user.address, owner, blockTimestamp)
        )
      expect((await getLaunchConfig(launchpad, 0)).status).to.be.eq(3)
      expect(await fomoUsdcLp.balanceOf(launchpad.address)).to.be.eq(
        balanceBefore
      )
      expect(await launchpad.activeLaunches(0)).to.be.eq(1)
    })

    describe('IN KOL Phase', async () => {
      it('Should revert if non-KOL tries to pledge', async () => {
        const { launchpad, fomoUsdcLp, user2, SIGNED_DATA } = await loadFixture(
          deployContractFixtureWithLaunch
        )
        await fomoUsdcLp
          .connect(user2)
          .approve(launchpad.address, constants.MaxUint256)
        const action = launchpad
          .connect(user2)
          .pledge(0, LP_5K, true, SIGNED_DATA[2])
        await expect(action).to.be.revertedWith(ERROR.UserIsNotKOL)
      })

      it('Should revert if pledge is below min pledge', async () => {
        const { launchpad, fomoUsdcLp, user, SIGNED_DATA } = await loadFixture(
          deployContractFixtureWithLaunch
        )
        await launchpad.addKOL(user.address)
        await fomoUsdcLp
          .connect(user)
          .approve(launchpad.address, constants.MaxUint256)
        const action = launchpad
          .connect(user)
          .pledge(0, LP_500.sub(1), false, SIGNED_DATA[1])
        await expect(action).to.be.revertedWith(ERROR.MinPledgeNotREached)
      })

      it('Should transfer min pledge tokens succesfully', async () => {
        const { launchpad, fomoUsdcLp, user, SIGNED_DATA } = await loadFixture(
          deployContractFixtureWithLaunch
        )
        await launchpad.addKOL(user.address)
        const balanceBefore = await fomoUsdcLp.balanceOf(launchpad.address)
        await fomoUsdcLp
          .connect(user)
          .approve(launchpad.address, constants.MaxUint256)
        const action = launchpad
          .connect(user)
          .pledge(0, LP_500, false, SIGNED_DATA[1])
        await expect(action).not.to.be.reverted

        expect(await fomoUsdcLp.balanceOf(launchpad.address)).to.be.eq(
          balanceBefore.add(LP_500)
        )
      })

      it('Should transfer min pledge tokens succesfully using steak', async () => {
        const { launchpad, user2, fomoUsdcLp, SIGNED_DATA } = await loadFixture(
          deployContractFixtureWithLaunch
        )
        await launchpad.addKOL(user2.address)
        const balanceBefore = await fomoUsdcLp.balanceOf(launchpad.address)
        const action = launchpad
          .connect(user2)
          .pledge(0, LP_500, true, SIGNED_DATA[2])
        await expect(action).not.to.be.reverted

        expect(await fomoUsdcLp.balanceOf(launchpad.address)).to.be.eq(
          balanceBefore.add(LP_500)
        )
      })

      it('Should transfer max pledge tokens', async () => {
        const { launchpad, user, fomoUsdcLp, SIGNED_DATA } = await loadFixture(
          deployContractFixtureWithLaunch
        )
        await launchpad.addKOL(user.address)
        const balanceBefore = await fomoUsdcLp.balanceOf(launchpad.address)
        await fomoUsdcLp
          .connect(user)
          .approve(launchpad.address, constants.MaxUint256)
        const action = launchpad
          .connect(user)
          .pledge(0, LP_5K, false, SIGNED_DATA[1])
        await expect(action).not.to.be.reverted

        expect(await fomoUsdcLp.balanceOf(launchpad.address)).to.be.eq(
          balanceBefore.add(LP_5K)
        )
      })

      it('Should transfer min pledge tokens succesfully using steak', async () => {
        const { launchpad, user2, fomoUsdcLp, SIGNED_DATA } = await loadFixture(
          deployContractFixtureWithLaunch
        )
        await launchpad.addKOL(user2.address)
        const balanceBefore = await fomoUsdcLp.balanceOf(launchpad.address)
        const action = launchpad
          .connect(user2)
          .pledge(0, LP_5K, true, SIGNED_DATA[2])
        await expect(action).not.to.be.reverted

        expect(await fomoUsdcLp.balanceOf(launchpad.address)).to.be.eq(
          balanceBefore.add(LP_5K)
        )
      })

      it('Should update user pledge info correctly', async () => {
        const { launchpad, user, fomoUsdcLp, SIGNED_DATA } = await loadFixture(
          deployContractFixtureWithLaunch
        )
        await launchpad.addKOL(user.address)
        await fomoUsdcLp
          .connect(user)
          .approve(launchpad.address, constants.MaxUint256)
        await launchpad.connect(user).pledge(0, LP_500, false, SIGNED_DATA[1])

        const userPledge = await launchpad.launchToUserPledge(0, user.address)
        expect(userPledge.lp).to.be.eq(LP_500)
        expect(userPledge.usdc).to.be.eq(parseUnits('500', 6))
      })

      it('Should update raisedLP correctly', async () => {
        const { launchpad, user, fomoUsdcLp, SIGNED_DATA } = await loadFixture(
          deployContractFixtureWithLaunch
        )
        await launchpad.addKOL(user.address)
        await fomoUsdcLp
          .connect(user)
          .approve(launchpad.address, constants.MaxUint256)
        await launchpad.connect(user).pledge(0, LP_500, false, SIGNED_DATA[1])

        const launch = await getLaunchConfig(launchpad, 0)
        expect(launch.raisedLP).to.be.eq(LP_5K.add(LP_500))
      })

      it('Should update raisedLPKOL correctly', async () => {
        const { launchpad, user, fomoUsdcLp, SIGNED_DATA } = await loadFixture(
          deployContractFixtureWithLaunch
        )
        await launchpad.addKOL(user.address)
        await fomoUsdcLp
          .connect(user)
          .approve(launchpad.address, constants.MaxUint256)
        await launchpad.connect(user).pledge(0, LP_500, false, SIGNED_DATA[1])

        const launch = await getLaunchConfig(launchpad, 0)
        expect(launch.raisedLPKOL).to.be.eq(LP_500)
      })

      it('Should emit Pledged event correctly', async () => {
        const { launchpad, user, fomoUsdcLp, SIGNED_DATA } = await loadFixture(
          deployContractFixtureWithLaunch
        )
        await launchpad.addKOL(user.address)
        await fomoUsdcLp
          .connect(user)
          .approve(launchpad.address, constants.MaxUint256)
        const action = launchpad
          .connect(user)
          .pledge(0, LP_500, false, SIGNED_DATA[1])
        await expect(action)
          .to.emit(launchpad, 'Pledged')
          .withArgs(0, user.address, LP_500, parseUnits('500', 6))
      })

      it('Should update user pledge info correctly on consecutive pledge', async () => {
        const { launchpad, user, fomoUsdcLp, SIGNED_DATA } = await loadFixture(
          deployContractFixtureWithLaunch
        )
        await launchpad.addKOL(user.address)
        await fomoUsdcLp
          .connect(user)
          .approve(launchpad.address, constants.MaxUint256)
        await launchpad.connect(user).pledge(0, LP_1K, false, SIGNED_DATA[1])
        await launchpad.connect(user).pledge(0, LP_1K, false, SIGNED_DATA[1])
        await launchpad.connect(user).pledge(0, LP_1K, false, SIGNED_DATA[1])
        await launchpad.connect(user).pledge(0, LP_1K, false, SIGNED_DATA[1])

        const userPledge = await launchpad.launchToUserPledge(0, user.address)
        expect(userPledge.lp).to.be.eq(LP_1K.mul(4))
        expect(userPledge.usdc).to.be.eq(parseUnits('1000', 6).mul(4))
      })

      it('Should revert if max pledge is reached', async () => {
        const { launchpad, user, fomoUsdcLp, SIGNED_DATA } = await loadFixture(
          deployContractFixtureWithLaunch
        )
        await launchpad.addKOL(user.address)
        await fomoUsdcLp
          .connect(user)
          .approve(launchpad.address, constants.MaxUint256)
        await launchpad.connect(user).pledge(0, LP_5K, false, SIGNED_DATA[1])
        const action = launchpad
          .connect(user)
          .pledge(0, LP_5K, false, SIGNED_DATA[1])
        await expect(action).to.be.revertedWith(ERROR.PledgeLimitReached)
      })
    })

    describe('In Member Phase', async () => {
      it('Should revert if non-KOL tries to pledge', async () => {
        const { launchpad, user, SIGNED_DATA } = await loadFixture(
          deployContractFixtureWithLaunchAfter1Days
        )
        const action = launchpad
          .connect(user)
          .pledge(0, LP_500, false, SIGNED_DATA[1])
        await expect(action).to.be.revertedWith(ERROR.UserSaleNotStarted)
      })

      it('Should not revert if KOL tries to pledge', async () => {
        const { launchpad, user, fomoUsdcLp, SIGNED_DATA } = await loadFixture(
          deployContractFixtureWithLaunchAfter1Days
        )
        await launchpad.addKOL(user.address)
        await fomoUsdcLp
          .connect(user)
          .approve(launchpad.address, constants.MaxUint256)
        const action = launchpad
          .connect(user)
          .pledge(0, LP_500, false, SIGNED_DATA[1])
        await expect(action).not.to.be.reverted
      })

      it('Should transfer max pledge tokens', async () => {
        const { launchpad, user, fomoUsdcLp, SIGNED_DATA } = await loadFixture(
          deployContractFixtureWithLaunchAfter1Days
        )
        const balanceBefore = await fomoUsdcLp.balanceOf(launchpad.address)
        await launchpad.addKOL(user.address)
        await fomoUsdcLp
          .connect(user)
          .approve(launchpad.address, constants.MaxUint256)
        const action = launchpad
          .connect(user)
          .pledge(0, LP_5K, false, SIGNED_DATA[1])
        await expect(action).not.to.be.reverted

        expect(await fomoUsdcLp.balanceOf(launchpad.address)).to.be.eq(
          balanceBefore.add(LP_5K)
        )
      })
    })

    describe('In User Phase', async () => {
      it('Should not revert if KOL tries to pledge', async () => {
        const { launchpad, fomoUsdcLp, user, SIGNED_DATA } = await loadFixture(
          deployContractFixtureWithLaunchAfter8Days
        )
        await launchpad.addKOL(user.address)
        await fomoUsdcLp
          .connect(user)
          .approve(launchpad.address, constants.MaxUint256)
        const action = launchpad
          .connect(user)
          .pledge(0, LP_500, false, SIGNED_DATA[1])
        await expect(action).not.to.be.reverted
      })

      it('Should revert if pledge is below min pledge', async () => {
        const { launchpad, fomoUsdcLp, user, SIGNED_DATA } = await loadFixture(
          deployContractFixtureWithLaunchAfter8Days
        )
        await fomoUsdcLp
          .connect(user)
          .approve(launchpad.address, constants.MaxUint256)
        const action = launchpad
          .connect(user)
          .pledge(0, LP_50.sub(1), false, SIGNED_DATA[1])
        await expect(action).to.be.revertedWith(ERROR.MinPledgeNotREached)
      })

      it('Should transfer min pledge tokens succesfully', async () => {
        const { launchpad, fomoUsdcLp, user, SIGNED_DATA } = await loadFixture(
          deployContractFixtureWithLaunchAfter8Days
        )
        const balanceBefore = await fomoUsdcLp.balanceOf(launchpad.address)
        await fomoUsdcLp
          .connect(user)
          .approve(launchpad.address, constants.MaxUint256)
        const action = launchpad
          .connect(user)
          .pledge(0, LP_50, false, SIGNED_DATA[1])
        await expect(action).not.to.be.reverted

        expect(await fomoUsdcLp.balanceOf(launchpad.address)).to.be.eq(
          balanceBefore.add(LP_50)
        )
      })

      it('Should transfer min pledge tokens succesfully using steak', async () => {
        const { launchpad, user2, fomoUsdcLp, SIGNED_DATA } = await loadFixture(
          deployContractFixtureWithLaunchAfter8Days
        )
        const balanceBefore = await fomoUsdcLp.balanceOf(launchpad.address)
        const action = launchpad
          .connect(user2)
          .pledge(0, LP_50, true, SIGNED_DATA[2])
        await expect(action).not.to.be.reverted

        expect(await fomoUsdcLp.balanceOf(launchpad.address)).to.be.eq(
          balanceBefore.add(LP_50)
        )
      })

      it('Should transfer max pledge tokens', async () => {
        const { launchpad, user, fomoUsdcLp, SIGNED_DATA } = await loadFixture(
          deployContractFixtureWithLaunchAfter8Days
        )
        const balanceBefore = await fomoUsdcLp.balanceOf(launchpad.address)
        await fomoUsdcLp
          .connect(user)
          .approve(launchpad.address, constants.MaxUint256)
        const action = launchpad
          .connect(user)
          .pledge(0, LP_5K, false, SIGNED_DATA[1])
        await expect(action).not.to.be.reverted

        expect(await fomoUsdcLp.balanceOf(launchpad.address)).to.be.eq(
          balanceBefore.add(LP_1K)
        )
      })

      it('Should transfer min pledge tokens succesfully using steak', async () => {
        const { launchpad, user2, fomoUsdcLp, SIGNED_DATA } = await loadFixture(
          deployContractFixtureWithLaunchAfter8Days
        )
        const balanceBefore = await fomoUsdcLp.balanceOf(launchpad.address)
        const action = launchpad
          .connect(user2)
          .pledge(0, LP_5K, true, SIGNED_DATA[2])
        await expect(action).not.to.be.reverted

        expect(await fomoUsdcLp.balanceOf(launchpad.address)).to.be.eq(
          balanceBefore.add(LP_1K)
        )
      })

      it('Should update user pledge info correctly', async () => {
        const { launchpad, user, fomoUsdcLp, SIGNED_DATA } = await loadFixture(
          deployContractFixtureWithLaunchAfter8Days
        )
        await fomoUsdcLp
          .connect(user)
          .approve(launchpad.address, constants.MaxUint256)
        await launchpad.connect(user).pledge(0, LP_50, false, SIGNED_DATA[1])

        const userPledge = await launchpad.launchToUserPledge(0, user.address)
        expect(userPledge.lp).to.be.eq(LP_50)
        expect(userPledge.usdc).to.be.eq(parseUnits('50', 6))
      })

      it('Should update raisedLP correctly', async () => {
        const { launchpad, user, fomoUsdcLp, SIGNED_DATA } = await loadFixture(
          deployContractFixtureWithLaunchAfter8Days
        )
        await fomoUsdcLp
          .connect(user)
          .approve(launchpad.address, constants.MaxUint256)
        await launchpad.connect(user).pledge(0, LP_50, false, SIGNED_DATA[1])

        const launch = await getLaunchConfig(launchpad, 0)
        expect(launch.raisedLP).to.be.eq(LP_5K.add(LP_50))
      })

      it('Should not update raisedLPKOL', async () => {
        const { launchpad, user, fomoUsdcLp, SIGNED_DATA } = await loadFixture(
          deployContractFixtureWithLaunchAfter8Days
        )
        await fomoUsdcLp
          .connect(user)
          .approve(launchpad.address, constants.MaxUint256)
        const launchBefore = await getLaunchConfig(launchpad, 0)
        await launchpad.connect(user).pledge(0, LP_500, false, SIGNED_DATA[1])

        const launch = await getLaunchConfig(launchpad, 0)
        expect(launch.raisedLPKOL).to.be.eq(launchBefore.raisedLPKOL)
      })

      it('Should emit Pledged event correctly', async () => {
        const { launchpad, user, fomoUsdcLp, SIGNED_DATA } = await loadFixture(
          deployContractFixtureWithLaunchAfter8Days
        )
        await fomoUsdcLp
          .connect(user)
          .approve(launchpad.address, constants.MaxUint256)
        const action = launchpad
          .connect(user)
          .pledge(0, LP_500, false, SIGNED_DATA[1])
        await expect(action)
          .to.emit(launchpad, 'Pledged')
          .withArgs(0, user.address, LP_500, parseUnits('500', 6))
      })

      it('Should update user pledge info correctly on consecutive pledge', async () => {
        const { launchpad, user, fomoUsdcLp, SIGNED_DATA } = await loadFixture(
          deployContractFixtureWithLaunchAfter8Days
        )
        await fomoUsdcLp
          .connect(user)
          .approve(launchpad.address, constants.MaxUint256)
        await launchpad.connect(user).pledge(0, LP_100, false, SIGNED_DATA[1])
        await launchpad.connect(user).pledge(0, LP_100, false, SIGNED_DATA[1])
        await launchpad.connect(user).pledge(0, LP_100, false, SIGNED_DATA[1])
        await launchpad.connect(user).pledge(0, LP_100, false, SIGNED_DATA[1])

        const userPledge = await launchpad.launchToUserPledge(0, user.address)
        expect(userPledge.lp).to.be.eq(LP_100.mul(4))
        expect(userPledge.usdc).to.be.eq(parseUnits('100', 6).mul(4))
      })

      it('Should revert if max pledge is reached', async () => {
        const { launchpad, user, fomoUsdcLp, SIGNED_DATA } = await loadFixture(
          deployContractFixtureWithLaunchAfter8Days
        )
        await fomoUsdcLp
          .connect(user)
          .approve(launchpad.address, constants.MaxUint256)
        await launchpad.connect(user).pledge(0, LP_1K, false, SIGNED_DATA[1])
        const action = launchpad
          .connect(user)
          .pledge(0, 1, false, SIGNED_DATA[1])
        await expect(action).to.be.revertedWith(ERROR.PledgeLimitReached)
      })
    })
  })

  describe('PledgeWithNFT', async () => {
    it('Should revert if user is not verified', async () => {
      const { launchpad, user, fomoUsdcLp, SIGNED_DATA } = await loadFixture(
        deployContractFixtureWithLaunchAfter8Days
      )
      await fomoUsdcLp
        .connect(user)
        .approve(launchpad.address, constants.MaxUint256)
      const action = launchpad
        .connect(user)
        .pledgeWithNFT(
          0,
          LP_500,
          false,
          1,
          constants.AddressZero,
          SIGNED_DATA[2]
        )
      await expect(action).to.be.revertedWith(ERROR.VerificationFailed)
    })

    it('Should revert if user is not NFT owner', async () => {
      const { launchpad, user, SIGNED_DATA } = await loadFixture(
        deployContractFixtureWithLaunchAfter1Days
      )
      const action = launchpad
        .connect(user)
        .pledgeWithNFT(
          0,
          LP_500,
          false,
          0,
          constants.AddressZero,
          SIGNED_DATA[1]
        )
      await expect(action).to.be.revertedWith(ERROR.UserNotNFTOwner)
    })

    it('Should revert if is in KOL phase', async () => {
      const { launchpad, user, SIGNED_DATA } = await loadFixture(
        deployContractFixtureWithLaunch
      )
      const action = launchpad
        .connect(user)
        .pledgeWithNFT(
          0,
          LP_500,
          false,
          1,
          constants.AddressZero,
          SIGNED_DATA[1]
        )
      await expect(action).to.be.revertedWith(ERROR.UserIsNotKOL)
    })

    it('Should not revert if is in common phase', async () => {
      const { launchpad, user, fomoUsdcLp, SIGNED_DATA } = await loadFixture(
        deployContractFixtureWithLaunchAfter8Days
      )
      await fomoUsdcLp
        .connect(user)
        .approve(launchpad.address, constants.MaxUint256)
      const action = launchpad
        .connect(user)
        .pledgeWithNFT(
          0,
          LP_500,
          false,
          1,
          constants.AddressZero,
          SIGNED_DATA[1]
        )
      await expect(action).not.to.be.reverted
    })

    it('Should revert if user is KOL', async () => {
      const { launchpad, user, SIGNED_DATA } = await loadFixture(
        deployContractFixtureWithLaunchAfter1Days
      )
      await launchpad.addKOL(user.address)
      const action = launchpad
        .connect(user)
        .pledgeWithNFT(
          0,
          LP_500,
          false,
          1,
          constants.AddressZero,
          SIGNED_DATA[1]
        )
      await expect(action).to.be.revertedWith(ERROR.UserIsKOL)
    })

    it('Should revert if user has too little lpt', async () => {
      const { launchpad, user3, fomoUsdcLp, SIGNED_DATA } = await loadFixture(
        deployContractFixtureWithLaunchAfter1Days
      )
      await fomoUsdcLp
        .connect(user3)
        .approve(launchpad.address, constants.MaxUint256)
      const action = launchpad
        .connect(user3)
        .pledgeWithNFT(
          0,
          LP_500,
          false,
          2,
          constants.AddressZero,
          SIGNED_DATA[3]
        )
      await expect(action).to.be.revertedWith('ds-math-sub-underflow')
    })

    it('Should revert if user has too little lpt in steak', async () => {
      const { launchpad, user, fomoUsdcLp, SIGNED_DATA } = await loadFixture(
        deployContractFixtureWithLaunchAfter1Days
      )
      await fomoUsdcLp
        .connect(user)
        .approve(launchpad.address, constants.MaxUint256)
      const action = launchpad
        .connect(user)
        .pledgeWithNFT(0, LP_50, true, 1, constants.AddressZero, SIGNED_DATA[1])
      await expect(action).to.be.revertedWith('Amount greater than staked')
    })

    it('Should revert if pledge is below min pledge', async () => {
      const { launchpad, user, fomoUsdcLp, SIGNED_DATA } = await loadFixture(
        deployContractFixtureWithLaunchAfter1Days
      )
      await fomoUsdcLp
        .connect(user)
        .approve(launchpad.address, constants.MaxUint256)
      const action = launchpad
        .connect(user)
        .pledgeWithNFT(
          0,
          LP_50.sub(1),
          false,
          1,
          constants.AddressZero,
          SIGNED_DATA[1]
        )
      await expect(action).to.be.revertedWith(ERROR.MinPledgeNotREached)
    })

    it('Should revert if max pledge is reached', async () => {
      const {
        launchpad,
        user,
        fomoUsdcLp,
        OWNED_TOKEN_IDS_BY_USER,
        SIGNED_DATA,
      } = await loadFixture(deployContractFixtureWithLaunchAfter1Days)
      await fomoUsdcLp
        .connect(user)
        .approve(launchpad.address, constants.MaxUint256)
      await launchpad
        .connect(user)
        .pledgeWithNFT(
          0,
          LP_5K,
          false,
          OWNED_TOKEN_IDS_BY_USER[0],
          constants.AddressZero,
          SIGNED_DATA[1]
        )
      const action = launchpad
        .connect(user)
        .pledgeWithNFT(
          0,
          LP_5K,
          false,
          OWNED_TOKEN_IDS_BY_USER[0],
          constants.AddressZero,
          SIGNED_DATA[1]
        )
      await expect(action).to.be.revertedWith(ERROR.PledgeLimitReached)
    })

    it('Should end raise if hard cap is already reached before pledge', async () => {
      const {
        launchpad,
        fomoUsdcLp,
        user,
        team,
        owner,
        usdc,
        fomo,
        SIGNED_DATA,
      } = await loadFixture(deployContractFixtureWithLaunch)
      const pledgers = await getSigners(53)
      // Pledge $240k (+ $5k deposit) = $245k in total
      for (let i = 5; i < 53; i++) {
        await owner.sendTransaction({
          to: pledgers[i].address,
          value: parseEther('1.0'),
        })
        await fomoUsdcLp.connect(owner).transfer(pledgers[i].address, LP_5K)
        await launchpad.connect(owner).addKOL(pledgers[i].address)
        await fomoUsdcLp
          .connect(pledgers[i])
          .approve(launchpad.address, constants.MaxUint256)
        await launchpad
          .connect(pledgers[i])
          .pledge(0, LP_5K, false, SIGNED_DATA[i])
      }
      // Inflate FOMO token price
      const options = {
        signer: owner,
        amountIn: parseUnits('10000', 6),
        inputToken: usdc.address,
        outputToken: fomo.address,
      }
      await env.uniswapV2.swap(options)

      // Try to pledge when raised value is $251,125 (above hard cap)
      // const RAISED_USDC = BigNumber.from("251125000000").div(2)
      // const RAISED_FOMO = BigNumber.from("119520940556626094592287")
      await fomoUsdcLp
        .connect(user)
        .approve(launchpad.address, constants.MaxUint256)
      const userBalanceBefore = await fomoUsdcLp.balanceOf(user.address)
      // const ownerBalanceBefore = await usdc.balanceOf(owner.address)
      var launch = await getLaunchConfig(launchpad, 0)
      const blockTimestamp = launch.startTime
        .add(BigNumber.from('86400'))
        .toNumber()
      await ethers.provider.send('evm_setNextBlockTimestamp', [blockTimestamp])
      await launchpad
        .connect(user)
        .pledgeWithNFT(
          0,
          LP_5K,
          false,
          1,
          constants.AddressZero,
          await getUserVerificationData(user.address, owner, blockTimestamp)
        )
      // Check end raise and conditions
      const nftPledge = await launchpad.launchToNFTPledge(0, 1)
      expect(nftPledge.lp).to.be.eq(0)
      expect(nftPledge.usdc).to.be.eq(0)
      expect(await fomoUsdcLp.balanceOf(user.address)).to.be.eq(
        userBalanceBefore
      )
      const userPledge = await launchpad.launchToUserPledge(0, user.address)
      expect(userPledge.lp).to.be.eq(0)
      expect(userPledge.usdc).to.be.eq(0)
      // const alloc = await launchpad.tokenAddresses(0)
      // expect(alloc.usdc).to.be.eq(RAISED_USDC.mul(75).div(100))
      // expect(alloc.fomo).to.be.eq(RAISED_FOMO.mul(75).div(100))

      launch = await getLaunchConfig(launchpad, 0)
      expect(launch.status).to.be.eq(2)
      expect(launch.raisedLP).to.be.eq(LP_5K.mul(49))
      expect(await launchpad.activeLaunches(0)).to.be.eq(0)
      // expect(await fomoUsdcLp.balanceOf(team.address)).to.be.eq(launch.raisedLP.mul(20).div(100))
      // expect(await usdc.balanceOf(owner.address)).to.be.eq(RAISED_USDC.mul(5).div(100).add(ownerBalanceBefore))
      // expect(await usdc.balanceOf(launchpad.address)).to.be.eq(RAISED_USDC.mul(75).div(100))
      // expect(await fomo.balanceOf(launchpad.address)).to.be.eq(alloc.fomo)
      // expect(await fomo.balanceOf(DEAD_ADDRESS)).to.be.eq(RAISED_FOMO.mul(5).div(100))
    })

    it('Should end raise if hard cap is already reached after pledge', async () => {
      const {
        launchpad,
        fomoUsdcLp,
        user,
        team,
        owner,
        usdc,
        fomo,
        SIGNED_DATA,
      } = await loadFixture(deployContractFixtureWithLaunch)
      const pledgers = await getSigners(53)
      // Pledge $240k (+ $5k deposit) = $245k in total
      for (let i = 5; i < 53; i++) {
        await owner.sendTransaction({
          to: pledgers[i].address,
          value: parseEther('1.0'),
        })
        await fomoUsdcLp.connect(owner).transfer(pledgers[i].address, LP_5K)
        await launchpad.connect(owner).addKOL(pledgers[i].address)
        await fomoUsdcLp
          .connect(pledgers[i])
          .approve(launchpad.address, constants.MaxUint256)
        await launchpad
          .connect(pledgers[i])
          .pledge(0, LP_5K, false, SIGNED_DATA[i])
      }
      // Try to pledge when raised value is $250,000 (above hard cap)
      // const RAISED_USDC = BigNumber.from("250000000000").div(2)
      // const RAISED_FOMO = BigNumber.from("125000000000000000000000")
      await fomoUsdcLp
        .connect(user)
        .approve(launchpad.address, constants.MaxUint256)
      const userBalanceBefore = await fomoUsdcLp.balanceOf(user.address)
      // const ownerBalanceBefore = await usdc.balanceOf(owner.address)
      var launch = await getLaunchConfig(launchpad, 0)
      const blockTimestamp = launch.startTime
        .add(BigNumber.from('86400'))
        .toNumber()
      await ethers.provider.send('evm_setNextBlockTimestamp', [blockTimestamp])
      await launchpad
        .connect(user)
        .pledgeWithNFT(
          0,
          LP_5K,
          false,
          1,
          constants.AddressZero,
          await getUserVerificationData(user.address, owner, blockTimestamp)
        )
      // Check end raise and conditions
      const nftPledge = await launchpad.launchToNFTPledge(0, 1)
      expect(nftPledge.lp).to.be.eq(LP_5K)
      expect(nftPledge.usdc).to.be.eq(parseUnits('5000', 6))
      expect(await fomoUsdcLp.balanceOf(user.address)).to.be.eq(
        userBalanceBefore.sub(LP_5K)
      )
      const userPledge = await launchpad.launchToUserPledge(0, user.address)
      expect(userPledge.lp).to.be.eq(LP_5K)
      expect(userPledge.usdc).to.be.eq(parseUnits('5000', 6))
      // const alloc = await launchpad.tokenAddresses(0)
      // expect(alloc.usdc).to.be.eq(RAISED_USDC.mul(75).div(100))
      // expect(alloc.fomo).to.be.eq(RAISED_FOMO.mul(75).div(100))
      launch = await getLaunchConfig(launchpad, 0)
      expect(launch.status).to.be.eq(2)
      expect(launch.raisedLP).to.be.eq(LP_5K.mul(50))
      expect(await launchpad.activeLaunches(0)).to.be.eq(0)
      // expect(await fomoUsdcLp.balanceOf(team.address)).to.be.eq(launch.raisedLP.mul(20).div(100))
      // expect(await usdc.balanceOf(launchpad.address)).to.be.eq(RAISED_USDC.mul(75).div(100))
      // expect(await usdc.balanceOf(owner.address)).to.be.eq(RAISED_USDC.mul(5).div(100).add(ownerBalanceBefore))
      // expect((await fomo.balanceOf(DEAD_ADDRESS))).to.be.eq(RAISED_FOMO.mul(5).div(100))
      // expect((await fomo.balanceOf(launchpad.address))).to.be.eq(RAISED_FOMO.mul(75).div(100))
    })

    it('Should end raise after 15 days as soft cap reached', async () => {
      const {
        launchpad,
        fomoUsdcLp,
        user2,
        team,
        owner,
        usdc,
        fomo,
        SIGNED_DATA,
      } = await loadFixture(deployContractFixtureWithLaunchAfter1Days)
      const pledgers = await getSigners(24)
      // Pledge $95k (+ $5k deposit) = $100k in total
      for (let i = 5; i < 24; i++) {
        await owner.sendTransaction({
          to: pledgers[i].address,
          value: parseEther('1.0'),
        })
        await fomoUsdcLp.connect(owner).transfer(pledgers[i].address, LP_5K)
        await launchpad.connect(owner).addKOL(pledgers[i].address)
        await fomoUsdcLp
          .connect(pledgers[i])
          .approve(launchpad.address, constants.MaxUint256)
        await launchpad
          .connect(pledgers[i])
          .pledge(0, LP_5K, false, SIGNED_DATA[i])
      }
      // Try to pledge when raised value is $100,000 (soft cap & after deadline)
      // const RAISED_USDC = BigNumber.from("100000000000").div(2)
      // const RAISED_FOMO = BigNumber.from("100000000000000000000000").div(2)
      const userBalanceBefore = await fomoUsdcLp.balanceOf(user2.address)
      // const ownerBalanceBefore = await usdc.balanceOf(owner.address)
      const launchBefore = await getLaunchConfig(launchpad, 0)
      const blockTimestamp = launchBefore.startTime
        .add(BigNumber.from('86400').mul(15))
        .toNumber()
      await ethers.provider.send('evm_setNextBlockTimestamp', [blockTimestamp])
      await launchpad
        .connect(user2)
        .pledgeWithNFT(
          0,
          LP_5K,
          false,
          0,
          constants.AddressZero,
          await getUserVerificationData(user2.address, owner, blockTimestamp)
        )
      // Check end raise and conditions
      expect(await fomoUsdcLp.balanceOf(user2.address)).to.be.eq(
        userBalanceBefore
      )
      const userPledge = await launchpad.launchToUserPledge(0, user2.address)
      expect(userPledge.lp).to.be.eq(0)
      expect(userPledge.usdc).to.be.eq(0)
      const launch = await getLaunchConfig(launchpad, 0)
      expect(launch.status).to.be.eq(1)
      expect(launch.raisedLP).to.be.eq(LP_5K.mul(20))
      expect(await launchpad.activeLaunches(0)).to.be.eq(0)
      // expect(await fomoUsdcLp.balanceOf(team.address)).to.be.eq(launch.raisedLP.mul(20).div(100))
      // expect(await usdc.balanceOf(launchpad.address)).to.be.eq(RAISED_USDC.mul(75).div(100))
      // expect(await usdc.balanceOf(owner.address)).to.be.eq(RAISED_USDC.mul(5).div(100).add(ownerBalanceBefore))
      // expect(await fomo.balanceOf(launchpad.address)).to.be.eq(RAISED_FOMO.mul(75).div(100))
      // expect(await fomo.balanceOf(DEAD_ADDRESS)).to.be.eq(RAISED_FOMO.mul(5).div(100))
      // const alloc = await launchpad.tokenAddresses(0)
      // expect(alloc.usdc).to.be.eq(RAISED_USDC.mul(75).div(100))
      // expect(alloc.fomo).to.be.eq(RAISED_FOMO.mul(75).div(100))
    })

    it('Should end raise after 15 days as failed', async () => {
      const { launchpad, fomoUsdcLp, user2, user3, team, owner, SIGNED_DATA } =
        await loadFixture(deployContractFixtureWithLaunch)
      const config = createLaunchConfig(
        1e9,
        250000,
        team.address,
        user3.address
      )
      await fomoUsdcLp.approve(launchpad.address, constants.MaxUint256)
      await launchpad.createLaunch(
        config,
        false,
        await getUserVerificationData(owner.address, owner)
      )
      expect(await launchpad.activeLaunches(0)).to.be.eq(0)
      expect(await launchpad.activeLaunches(1)).to.be.eq(1)
      const launch = await getLaunchConfig(launchpad, 0)
      const pledgers = await getSigners(23)
      // Pledge $90k (+ $5k deposit) = $95k in total
      for (let i = 5; i < 23; i++) {
        await owner.sendTransaction({
          to: pledgers[i].address,
          value: parseEther('1.0'),
        })
        await fomoUsdcLp.connect(owner).transfer(pledgers[i].address, LP_5K)
        await launchpad.connect(owner).addKOL(pledgers[i].address)
        await fomoUsdcLp
          .connect(pledgers[i])
          .approve(launchpad.address, constants.MaxUint256)
        await launchpad
          .connect(pledgers[i])
          .pledge(0, LP_5K, false, SIGNED_DATA[i])
      }
      const balanceBefore = await fomoUsdcLp.balanceOf(launchpad.address)
      const blockTimestamp = launch.startTime
        .add(BigNumber.from('86400').mul(15))
        .toNumber()
      await ethers.provider.send('evm_setNextBlockTimestamp', [blockTimestamp])
      await launchpad
        .connect(user2)
        .pledgeWithNFT(
          0,
          LP_500,
          false,
          0,
          constants.AddressZero,
          await getUserVerificationData(user2.address, owner, blockTimestamp)
        )
      expect((await getLaunchConfig(launchpad, 0)).status).to.be.eq(3)
      expect(await fomoUsdcLp.balanceOf(launchpad.address)).to.be.eq(
        balanceBefore
      )
      expect(await launchpad.activeLaunches(0)).to.be.eq(1)
    })

    it('Should transfer min pledge tokens succesfully', async () => {
      const { launchpad, fomoUsdcLp, user, SIGNED_DATA } = await loadFixture(
        deployContractFixtureWithLaunchAfter1Days
      )
      const balanceBefore = await fomoUsdcLp.balanceOf(launchpad.address)
      await fomoUsdcLp
        .connect(user)
        .approve(launchpad.address, constants.MaxUint256)
      await launchpad
        .connect(user)
        .pledgeWithNFT(
          0,
          LP_50,
          false,
          1,
          constants.AddressZero,
          SIGNED_DATA[1]
        )

      expect(await fomoUsdcLp.balanceOf(launchpad.address)).to.be.eq(
        balanceBefore.add(LP_50)
      )
    })

    it('Should transfer min pledge tokens succesfully using steak', async () => {
      const { launchpad, fomoUsdcLp, user2, SIGNED_DATA } = await loadFixture(
        deployContractFixtureWithLaunchAfter1Days
      )
      const balanceBefore = await fomoUsdcLp.balanceOf(launchpad.address)
      await launchpad
        .connect(user2)
        .pledgeWithNFT(0, LP_50, true, 0, constants.AddressZero, SIGNED_DATA[2])

      expect(await fomoUsdcLp.balanceOf(launchpad.address)).to.be.eq(
        balanceBefore.add(LP_50)
      )
    })

    it('Should transfer max pledge tokens', async () => {
      const { launchpad, user, fomoUsdcLp, SIGNED_DATA } = await loadFixture(
        deployContractFixtureWithLaunchAfter1Days
      )
      const balanceBefore = await fomoUsdcLp.balanceOf(launchpad.address)
      await fomoUsdcLp
        .connect(user)
        .approve(launchpad.address, constants.MaxUint256)
      await launchpad
        .connect(user)
        .pledgeWithNFT(
          0,
          LP_5K.mul(2),
          false,
          1,
          constants.AddressZero,
          SIGNED_DATA[1]
        )

      expect(await fomoUsdcLp.balanceOf(launchpad.address)).to.be.eq(
        balanceBefore.add(LP_5K)
      )
    })

    it('Should calculate correct multiplier and pledge max tokens', async () => {
      const {
        launchpad,
        user,
        fomoUsdcLp,
        OWNED_TOKEN_IDS_BY_USER,
        SIGNED_DATA,
      } = await loadFixture(deployContractFixtureWithLaunchAfter1Days)
      var balanceBefore = await fomoUsdcLp.balanceOf(launchpad.address)
      await fomoUsdcLp
        .connect(user)
        .approve(launchpad.address, constants.MaxUint256)
      await launchpad
        .connect(user)
        .pledgeWithNFT(
          0,
          LP_5K,
          false,
          OWNED_TOKEN_IDS_BY_USER[0],
          constants.AddressZero,
          SIGNED_DATA[1]
        )
      var newBalance = await fomoUsdcLp.balanceOf(launchpad.address)
      expect(newBalance).to.be.eq(balanceBefore.add(LP_5K))

      balanceBefore = newBalance
      await launchpad
        .connect(user)
        .pledgeWithNFT(
          0,
          LP_5K,
          false,
          OWNED_TOKEN_IDS_BY_USER[1],
          constants.AddressZero,
          SIGNED_DATA[1]
        )
      newBalance = await fomoUsdcLp.balanceOf(launchpad.address)
      expect(newBalance).to.be.eq(balanceBefore.add(LP_1K.mul(4)))

      balanceBefore = newBalance
      await launchpad
        .connect(user)
        .pledgeWithNFT(
          0,
          LP_5K,
          false,
          OWNED_TOKEN_IDS_BY_USER[2],
          constants.AddressZero,
          SIGNED_DATA[1]
        )
      newBalance = await fomoUsdcLp.balanceOf(launchpad.address)
      expect(newBalance).to.be.eq(balanceBefore.add(LP_1K.mul(3)))

      balanceBefore = newBalance
      await launchpad
        .connect(user)
        .pledgeWithNFT(
          0,
          LP_5K,
          false,
          OWNED_TOKEN_IDS_BY_USER[3],
          constants.AddressZero,
          SIGNED_DATA[1]
        )
      newBalance = await fomoUsdcLp.balanceOf(launchpad.address)
      expect(newBalance).to.be.eq(balanceBefore.add(LP_1K.mul(2)))

      balanceBefore = newBalance
      await launchpad
        .connect(user)
        .pledgeWithNFT(
          0,
          LP_5K,
          false,
          OWNED_TOKEN_IDS_BY_USER[4],
          constants.AddressZero,
          SIGNED_DATA[1]
        )
      newBalance = await fomoUsdcLp.balanceOf(launchpad.address)
      expect(newBalance).to.be.eq(balanceBefore.add(LP_1K.mul(15).div(10)))
    })

    it('Should update user pledge info correctly', async () => {
      const {
        launchpad,
        user,
        fomoUsdcLp,
        OWNED_TOKEN_IDS_BY_USER,
        SIGNED_DATA,
      } = await loadFixture(deployContractFixtureWithLaunchAfter1Days)
      await fomoUsdcLp
        .connect(user)
        .approve(launchpad.address, constants.MaxUint256)
      await launchpad
        .connect(user)
        .pledgeWithNFT(
          0,
          LP_1K,
          false,
          OWNED_TOKEN_IDS_BY_USER[0],
          constants.AddressZero,
          SIGNED_DATA[1]
        )

      const userPledge = await launchpad.launchToUserPledge(0, user.address)
      expect(userPledge.lp).to.be.eq(LP_1K)
      expect(userPledge.usdc).to.be.eq(parseUnits('1000', 6))
    })

    it('Should update nft pledge info correctly', async () => {
      const {
        launchpad,
        user,
        fomoUsdcLp,
        OWNED_TOKEN_IDS_BY_USER,
        SIGNED_DATA,
      } = await loadFixture(deployContractFixtureWithLaunchAfter1Days)
      await fomoUsdcLp
        .connect(user)
        .approve(launchpad.address, constants.MaxUint256)
      await launchpad
        .connect(user)
        .pledgeWithNFT(
          0,
          LP_1K,
          false,
          OWNED_TOKEN_IDS_BY_USER[0],
          constants.AddressZero,
          SIGNED_DATA[1]
        )

      const userPledge = await launchpad.launchToNFTPledge(
        0,
        OWNED_TOKEN_IDS_BY_USER[0]
      )
      expect(userPledge.lp).to.be.eq(LP_1K)
      expect(userPledge.usdc).to.be.eq(parseUnits('1000', 6))
    })

    it('Should update raisedLP correctly', async () => {
      const {
        launchpad,
        user,
        fomoUsdcLp,
        OWNED_TOKEN_IDS_BY_USER,
        SIGNED_DATA,
      } = await loadFixture(deployContractFixtureWithLaunchAfter1Days)
      await fomoUsdcLp
        .connect(user)
        .approve(launchpad.address, constants.MaxUint256)
      await launchpad
        .connect(user)
        .pledgeWithNFT(
          0,
          LP_1K,
          false,
          OWNED_TOKEN_IDS_BY_USER[0],
          constants.AddressZero,
          SIGNED_DATA[1]
        )

      const launch = await getLaunchConfig(launchpad, 0)
      expect(launch.raisedLP).to.be.eq(LP_5K.add(LP_1K))
    })

    it('Should not update raisedLPKOL', async () => {
      const {
        launchpad,
        user,
        fomoUsdcLp,
        OWNED_TOKEN_IDS_BY_USER,
        SIGNED_DATA,
      } = await loadFixture(deployContractFixtureWithLaunchAfter1Days)
      await fomoUsdcLp
        .connect(user)
        .approve(launchpad.address, constants.MaxUint256)
      const launchBefore = await getLaunchConfig(launchpad, 0)
      await launchpad
        .connect(user)
        .pledgeWithNFT(
          0,
          LP_5K,
          false,
          OWNED_TOKEN_IDS_BY_USER[0],
          constants.AddressZero,
          SIGNED_DATA[1]
        )
      const launch = await getLaunchConfig(launchpad, 0)
      expect(launch.raisedLPKOL).to.be.eq(launchBefore.raisedLPKOL)
    })

    it('Should emit PledgedWithNFT event correctly', async () => {
      const {
        launchpad,
        user,
        fomoUsdcLp,
        OWNED_TOKEN_IDS_BY_USER,
        SIGNED_DATA,
      } = await loadFixture(deployContractFixtureWithLaunchAfter1Days)
      await fomoUsdcLp
        .connect(user)
        .approve(launchpad.address, constants.MaxUint256)
      const action = launchpad
        .connect(user)
        .pledgeWithNFT(
          0,
          LP_5K,
          false,
          OWNED_TOKEN_IDS_BY_USER[0],
          constants.AddressZero,
          SIGNED_DATA[1]
        )
      await expect(action)
        .to.emit(launchpad, 'PledgedWithNFT')
        .withArgs(
          0,
          user.address,
          LP_5K,
          parseUnits('5000', 6),
          OWNED_TOKEN_IDS_BY_USER[0]
        )
    })

    it('Should update user pledge info correctly on consecutive pledge', async () => {
      const {
        launchpad,
        user,
        fomoUsdcLp,
        OWNED_TOKEN_IDS_BY_USER,
        SIGNED_DATA,
      } = await loadFixture(deployContractFixtureWithLaunchAfter1Days)
      await fomoUsdcLp
        .connect(user)
        .approve(launchpad.address, constants.MaxUint256)
      await launchpad
        .connect(user)
        .pledgeWithNFT(
          0,
          LP_1K,
          false,
          OWNED_TOKEN_IDS_BY_USER[0],
          constants.AddressZero,
          SIGNED_DATA[1]
        )
      await launchpad
        .connect(user)
        .pledgeWithNFT(
          0,
          LP_1K,
          false,
          OWNED_TOKEN_IDS_BY_USER[0],
          constants.AddressZero,
          SIGNED_DATA[1]
        )
      await launchpad
        .connect(user)
        .pledgeWithNFT(
          0,
          LP_1K,
          false,
          OWNED_TOKEN_IDS_BY_USER[0],
          constants.AddressZero,
          SIGNED_DATA[1]
        )
      await launchpad
        .connect(user)
        .pledgeWithNFT(
          0,
          LP_1K,
          false,
          OWNED_TOKEN_IDS_BY_USER[0],
          constants.AddressZero,
          SIGNED_DATA[1]
        )

      const userPledge = await launchpad.launchToUserPledge(0, user.address)
      expect(userPledge.lp).to.be.eq(LP_1K.mul(4))
      expect(userPledge.usdc).to.be.eq(parseUnits('1000', 6).mul(4))
    })

    it('Should update nft pledge info correctly on consecutive pledge', async () => {
      const {
        launchpad,
        user,
        fomoUsdcLp,
        OWNED_TOKEN_IDS_BY_USER,
        SIGNED_DATA,
      } = await loadFixture(deployContractFixtureWithLaunchAfter1Days)
      await fomoUsdcLp
        .connect(user)
        .approve(launchpad.address, constants.MaxUint256)
      await launchpad
        .connect(user)
        .pledgeWithNFT(
          0,
          LP_5K,
          false,
          OWNED_TOKEN_IDS_BY_USER[0],
          constants.AddressZero,
          SIGNED_DATA[1]
        )
      await launchpad
        .connect(user)
        .pledgeWithNFT(
          0,
          LP_5K,
          false,
          OWNED_TOKEN_IDS_BY_USER[1],
          constants.AddressZero,
          SIGNED_DATA[1]
        )
      await launchpad
        .connect(user)
        .pledgeWithNFT(
          0,
          LP_5K,
          false,
          OWNED_TOKEN_IDS_BY_USER[2],
          constants.AddressZero,
          SIGNED_DATA[1]
        )
      await launchpad
        .connect(user)
        .pledgeWithNFT(
          0,
          LP_5K,
          false,
          OWNED_TOKEN_IDS_BY_USER[3],
          constants.AddressZero,
          SIGNED_DATA[1]
        )
      await launchpad
        .connect(user)
        .pledgeWithNFT(
          0,
          LP_5K,
          false,
          OWNED_TOKEN_IDS_BY_USER[4],
          constants.AddressZero,
          SIGNED_DATA[1]
        )

      const nftPledge0 = await launchpad.launchToNFTPledge(
        0,
        String(OWNED_TOKEN_IDS_BY_USER[0])
      )
      expect(nftPledge0.lp).to.be.eq(LP_1K.mul(5))
      expect(nftPledge0.usdc).to.be.eq(parseUnits('1000', 6).mul(5))

      const nftPledge1 = await launchpad.launchToNFTPledge(
        0,
        String(OWNED_TOKEN_IDS_BY_USER[1])
      )
      expect(nftPledge1.lp).to.be.eq(LP_1K.mul(4))
      expect(nftPledge1.usdc).to.be.eq(parseUnits('1000', 6).mul(4))

      const nftPledge2 = await launchpad.launchToNFTPledge(
        0,
        String(OWNED_TOKEN_IDS_BY_USER[2])
      )
      expect(nftPledge2.lp).to.be.eq(LP_1K.mul(3))
      expect(nftPledge2.usdc).to.be.eq(parseUnits('1000', 6).mul(3))

      const nftPledge3 = await launchpad.launchToNFTPledge(
        0,
        String(OWNED_TOKEN_IDS_BY_USER[3])
      )
      expect(nftPledge3.lp).to.be.eq(LP_1K.mul(2))
      expect(nftPledge3.usdc).to.be.eq(parseUnits('1000', 6).mul(2))

      const nftPledge4 = await launchpad.launchToNFTPledge(
        0,
        String(OWNED_TOKEN_IDS_BY_USER[4])
      )
      expect(nftPledge4.lp).to.be.eq(LP_1K.mul(15).div(10))
      expect(nftPledge4.usdc).to.be.eq(parseUnits('1500', 6))
    })
  })

  describe('Launch', async () => {
    it('Estimage gas', async () => {
      const { launchpad, user } = await loadFixture(
        deployContractFixtureWithHardCapReached
      )
      const launchBefore = await getLaunchConfig(launchpad, 0)
      expect(launchBefore.status).to.be.eq(2)
      const tx = await launchpad.connect(user).launch(0)
      console.log('Gas used:', (await tx.wait()).gasUsed.toString())
    })

    it('Should revert if launchpad is in failed state', async () => {
      const { launchpad, user, owner } = await loadFixture(
        deployContractFixtureWithLaunch
      )
      const launchBefore = await getLaunchConfig(launchpad, 0)
      const blockTimestamp = launchBefore.startTime
        .add(BigNumber.from(15).mul('86400'))
        .toNumber()
      await ethers.provider.send('evm_setNextBlockTimestamp', [blockTimestamp])
      await launchpad
        .connect(user)
        .pledge(
          0,
          LP_500,
          false,
          await getUserVerificationData(user.address, owner, blockTimestamp)
        )
      const launch = await getLaunchConfig(launchpad, 0)
      expect(launch.status).to.be.eq(3)
    })

    it('Should revert if launchpad is in launched state', async () => {
      const { launchpad, user } = await loadFixture(
        deployContractFixtureWithHardCapReached
      )
      const launchBefore = await getLaunchConfig(launchpad, 0)
      expect(launchBefore.status).to.be.eq(2)
      await launchpad.connect(user).launch(0)
      const action = launchpad.connect(user).launch(0)
      const launc = await getLaunchConfig(launchpad, 0)
      expect(launc.status).to.be.eq(4)
      await expect(action).to.be.revertedWith(ERROR.AlreadyLaunched)
    })

    it('Should break LP correctly after soft cap reached', async () => {
      const {
        launchpad,
        fomoUsdcLp,
        user,
        team,
        owner,
        usdc,
        fomo,
        SIGNED_DATA,
      } = await loadFixture(deployContractFixtureWithLaunchAfter1Days)
      const pledgers = await getSigners(24)
      // Pledge $95k (+ $5k deposit) = $100k in total
      for (let i = 5; i < 24; i++) {
        await owner.sendTransaction({
          to: pledgers[i].address,
          value: parseEther('1.0'),
        })
        await fomoUsdcLp.connect(owner).transfer(pledgers[i].address, LP_5K)
        await launchpad.connect(owner).addKOL(pledgers[i].address)
        await fomoUsdcLp
          .connect(pledgers[i])
          .approve(launchpad.address, constants.MaxUint256)
        await launchpad
          .connect(pledgers[i])
          .pledge(0, LP_5K, false, SIGNED_DATA[i])
      }
      const launchBefore = await getLaunchConfig(launchpad, 0)
      const blockTimestamp = launchBefore.startTime
        .add(BigNumber.from('86400').mul(15))
        .toNumber()
      await ethers.provider.send('evm_setNextBlockTimestamp', [blockTimestamp])
      // Try to pledge when raised value is $100,000 (soft cap & after deadline)
      const RAISED_USDC = BigNumber.from('100000000000').div(2)
      const RAISED_FOMO = BigNumber.from('100000000000000000000000').div(2)
      const ownerBalanceBefore = await usdc.balanceOf(owner.address)
      await launchpad.connect(user).launch(0)
      const launch = await getLaunchConfig(launchpad, 0)
      expect(launch.status).to.be.eq(4)
      expect(await fomoUsdcLp.balanceOf(team.address)).to.be.eq(
        launch.raisedLP.mul(20).div(100)
      )
      expect(await usdc.balanceOf(launchpad.address)).to.be.eq(0)
      expect(await usdc.balanceOf(owner.address)).to.be.eq(
        RAISED_USDC.mul(5).div(100).add(ownerBalanceBefore)
      )
      expect(await fomo.balanceOf(launchpad.address)).to.be.eq(0)
      expect(await fomo.balanceOf(DEAD_ADDRESS)).to.be.eq(
        RAISED_FOMO.mul(5).div(100)
      )
      const alloc = await launchpad.tokenAddresses(0)
      expect(alloc.usdc).to.be.eq(RAISED_USDC.mul(75).div(100))
      expect(alloc.fomo).to.be.eq(RAISED_FOMO.mul(75).div(100))
    })

    it('Should break LP correctly after hard cap reached', async () => {
      const { launchpad, team, user, fomoUsdcLp, fomo, usdc, owner } =
        await loadFixture(deployContractFixtureWithHardCapReached)
      const ownerBalanceBefore = await usdc.balanceOf(owner.address)
      await launchpad.connect(user).launch(0)
      const RAISED_USDC = BigNumber.from('250000000000').div(2)
      const RAISED_FOMO = BigNumber.from('125000000000000000000000')
      const launch = await getLaunchConfig(launchpad, 0)
      expect(launch.status).to.be.eq(4)
      expect(await fomoUsdcLp.balanceOf(team.address)).to.be.eq(
        launch.raisedLP.mul(20).div(100)
      )
      expect(await usdc.balanceOf(launchpad.address)).to.be.eq(0)
      expect(await usdc.balanceOf(owner.address)).to.be.eq(
        RAISED_USDC.mul(5).div(100).add(ownerBalanceBefore)
      )
      expect(await fomo.balanceOf(launchpad.address)).to.be.eq(0)
      expect(await fomo.balanceOf(DEAD_ADDRESS)).to.be.eq(
        RAISED_FOMO.mul(5).div(100)
      )
      const alloc = await launchpad.tokenAddresses(0)
      expect(alloc.usdc).to.be.eq(RAISED_USDC.mul(75).div(100))
      expect(alloc.fomo).to.be.eq(RAISED_FOMO.mul(75).div(100))
    })

    it('Should create meme-fomo LP with correct amounts', async () => {
      const { launchpad, user, fomo } = await loadFixture(
        deployContractFixtureWithHardCapReached
      )
      await launchpad.connect(user).launch(0)
      const alloc = await launchpad.tokenAddresses(0)
      const memeFomoLP = (await env.ethers.getContractAt(
        'ERC20',
        alloc.fomoLP
      )) as ERC20
      const meme = (await env.ethers.getContractAt(
        'ERC20',
        alloc.token
      )) as ERC20
      expect(await fomo.balanceOf(memeFomoLP.address)).to.be.eq(alloc.fomo)
      expect(await meme.balanceOf(memeFomoLP.address)).to.be.eq(
        (await meme.totalSupply()).mul(3525).div(20000)
      )
    })

    it('Should create meme-usdc LP with correct amounts', async () => {
      const { launchpad, user, usdc } = await loadFixture(
        deployContractFixtureWithHardCapReached
      )
      await launchpad.connect(user).launch(0)
      const alloc = await launchpad.tokenAddresses(0)
      const memeUsdcLP = (await env.ethers.getContractAt(
        'ERC20',
        alloc.usdcLP
      )) as ERC20
      const meme = (await env.ethers.getContractAt(
        'ERC20',
        alloc.token
      )) as ERC20
      expect(await usdc.balanceOf(memeUsdcLP.address)).to.be.eq(alloc.usdc)
      expect(await meme.balanceOf(memeUsdcLP.address)).to.be.eq(
        (await meme.totalSupply()).mul(3525).div(20000)
      )
    })

    it('Should send both LPs to DEAD address', async () => {
      const { launchpad, user } = await loadFixture(
        deployContractFixtureWithHardCapReached
      )
      await launchpad.connect(user).launch(0)
      const alloc = await launchpad.tokenAddresses(0)
      const memeUsdcLP = (await env.ethers.getContractAt(
        'ERC20',
        alloc.usdcLP
      )) as ERC20
      const memeFomoLP = (await env.ethers.getContractAt(
        'ERC20',
        alloc.fomoLP
      )) as ERC20
      expect(await memeFomoLP.balanceOf(DEAD_ADDRESS)).to.be.eq(
        (await memeFomoLP.totalSupply()).sub(1000)
      )
      expect(await memeUsdcLP.balanceOf(DEAD_ADDRESS)).to.be.eq(
        (await memeUsdcLP.totalSupply()).sub(1000)
      )
      expect(await memeFomoLP.balanceOf(constants.AddressZero)).to.be.eq(1000)
      expect(await memeUsdcLP.balanceOf(constants.AddressZero)).to.be.eq(1000)
    })

    it('Should create 3 incentives controllers', async () => {
      const { launchpad, user } = await loadFixture(
        deployContractFixtureWithHardCapReached
      )
      await launchpad.connect(user).launch(0)
      const alloc = await launchpad.tokenAddresses(0)
      const usdcLPIC = (await env.ethers.getContractAt(
        'TokenIncentivesController',
        alloc.usdcLPIC
      )) as TokenIncentivesController
      const fomoLPIC = (await env.ethers.getContractAt(
        'TokenIncentivesController',
        alloc.fomoLPIC
      )) as TokenIncentivesController
      const memeIC = (await env.ethers.getContractAt(
        'TokenIncentivesController',
        alloc.tokenIC
      )) as TokenIncentivesController

      expect(await usdcLPIC.stakingToken()).to.be.eq(alloc.usdcLP)
      expect(await fomoLPIC.stakingToken()).to.be.eq(alloc.fomoLP)
      expect(await memeIC.stakingToken()).to.be.eq(alloc.tokenICProxy)
    })

    it('Should create vesting contract and set owner properly', async () => {
      const { launchpad, user, owner } = await loadFixture(
        deployContractFixtureWithHardCapReached
      )
      await launchpad.connect(user).launch(0)
      const blockTimestamp = (await ethers.provider.getBlock('latest'))
        .timestamp
      const alloc = await launchpad.tokenAddresses(0)
      const vesting = (await env.ethers.getContractAt(
        'MEMEVesting',
        alloc.vesting
      )) as MEMEVesting
      expect(await vesting.owner()).to.be.eq(owner.address)
      expect(await vesting.tgeTimestamp()).to.be.eq(blockTimestamp)
    })

    it('Should notify lp incentives controllers for 1.75% of meme supply each', async () => {
      const { launchpad, user } = await loadFixture(
        deployContractFixtureWithHardCapReached
      )
      await launchpad.connect(user).launch(0)
      const alloc = await launchpad.tokenAddresses(0)
      const meme = (await env.ethers.getContractAt(
        'ERC20',
        alloc.token
      )) as ERC20
      const usdcLPIC = (await env.ethers.getContractAt(
        'TokenIncentivesController',
        alloc.usdcLPIC
      )) as TokenIncentivesController
      const fomoLPIC = (await env.ethers.getContractAt(
        'TokenIncentivesController',
        alloc.fomoLPIC
      )) as TokenIncentivesController

      expect(await meme.balanceOf(usdcLPIC.address)).to.be.eq(
        (await meme.totalSupply()).mul(175).div(10_000)
      )
      expect(await meme.balanceOf(fomoLPIC.address)).to.be.eq(
        (await meme.totalSupply()).mul(175).div(10_000)
      )
    })

    it('Should notify steak, meme and fomo controller for 0.5% of meme supply each', async () => {
      const { launchpad, user, steakController, fomoController } =
        await loadFixture(deployContractFixtureWithHardCapReached)
      await launchpad.connect(user).launch(0)
      const alloc = await launchpad.tokenAddresses(0)
      const meme = (await env.ethers.getContractAt(
        'ERC20',
        alloc.token
      )) as ERC20
      const memeIC = (await env.ethers.getContractAt(
        'TokenIncentivesController',
        alloc.tokenIC
      )) as TokenIncentivesController

      expect(await meme.balanceOf(memeIC.address)).to.be.eq(
        (await meme.totalSupply()).mul(50).div(10_000)
      )
      expect(await meme.balanceOf(fomoController.address)).to.be.eq(
        (await meme.totalSupply()).mul(50).div(10_000)
      )
      expect(await meme.balanceOf(steakController.address)).to.be.eq(
        (await meme.totalSupply()).mul(50).div(10_000)
      )
    })

    it('Should start emissions on incentivesControllers', async () => {
      const { launchpad, user } = await loadFixture(
        deployContractFixtureWithHardCapReached
      )
      await launchpad.connect(user).launch(0)
      const blockTimestamp = (await ethers.provider.getBlock('latest'))
        .timestamp
      const alloc = await launchpad.tokenAddresses(0)
      const meme = (await env.ethers.getContractAt(
        'ERC20',
        alloc.token
      )) as ERC20
      const usdcLPIC = (await env.ethers.getContractAt(
        'TokenEmissionsController',
        alloc.usdcLPIC
      )) as TokenEmissionsController
      const fomoLPIC = (await env.ethers.getContractAt(
        'TokenEmissionsController',
        alloc.fomoLPIC
      )) as TokenEmissionsController
      const memeIC = (await env.ethers.getContractAt(
        'TokenEmissionsController',
        alloc.tokenIC
      )) as TokenEmissionsController

      expect(await usdcLPIC.emissionsStart()).to.be.eq(blockTimestamp)
      expect(await fomoLPIC.emissionsStart()).to.be.eq(blockTimestamp)
      expect(await memeIC.emissionsStart()).to.be.eq(blockTimestamp)
      const usdcLPICEmission = await usdcLPIC.emissions(
        await usdcLPIC.currentEmissionsIndex()
      )
      expect(usdcLPICEmission.amount).to.be.eq(
        (await meme.totalSupply()).mul(5).mul(35).div(2).div(10000)
      )
      expect(usdcLPICEmission.duration).to.be.eq(
        BigNumber.from('86400').mul(45)
      )
      const fomoLPICEmission = await fomoLPIC.emissions(
        await fomoLPIC.currentEmissionsIndex()
      )
      expect(fomoLPICEmission.amount).to.be.eq(
        (await meme.totalSupply()).mul(5).mul(35).div(2).div(10000)
      )
      expect(fomoLPICEmission.duration).to.be.eq(
        BigNumber.from('86400').mul(45)
      )
      const memeICEmission = await memeIC.emissions(
        await memeIC.currentEmissionsIndex()
      )
      expect(memeICEmission.amount).to.be.eq(
        (await meme.totalSupply()).mul(5).mul(10).div(2).div(10000)
      )
      expect(memeICEmission.duration).to.be.eq(BigNumber.from('86400').mul(45))
    })

    it('Should send 2.75% to the protocol owner', async () => {
      const { launchpad, user, owner } = await loadFixture(
        deployContractFixtureWithHardCapReached
      )
      await launchpad.connect(user).launch(0)
      const alloc = await launchpad.tokenAddresses(0)
      const meme = (await env.ethers.getContractAt(
        'ERC20',
        alloc.token
      )) as ERC20
      expect(await meme.balanceOf(owner.address)).to.be.eq(
        (await meme.totalSupply()).mul(275).div(10000)
      )
    })

    it('Should not send MEME to X address if not set', async () => {
      const { launchpad, user, user3 } = await loadFixture(
        deployContractFixtureWithHardCapReached
      )
      await launchpad.connect(user).launch(0)
      const alloc = await launchpad.tokenAddresses(0)
      const meme = (await env.ethers.getContractAt(
        'ERC20',
        alloc.token
      )) as ERC20
      expect(await meme.balanceOf(user3.address)).to.be.eq(0)
    })

    it('Should Send MEME to the X address if set', async () => {
      const { launchpad, owner, fomoUsdcLp, user, team, user3, SIGNED_DATA } =
        await loadFixture(deployContractFixture)
      await fomoUsdcLp
        .connect(owner)
        .approve(launchpad.address, constants.MaxUint256)
      var config = {
        name: 'MEME',
        symbol: 'MEME',
        totalSupply: 1e9,
        hardCap: 250000,
        team: team.address,
        x: user3.address,
        allocations: [500, 500, 500, 3525, 4600, 100],
        rewardsAllocations: [3500, 3500, 1000, 1000, 1000] as [
          number,
          number,
          number,
          number,
          number
        ],
        rounds: [1 * ONE_DAY, 7 * ONE_DAY, 7 * ONE_DAY] as [
          number,
          number,
          number
        ],
        dexIndex: 0,
        steakTeamFee: 2000,
      }
      await launchpad
        .connect(owner)
        .createLaunch(
          config,
          false,
          await getUserVerificationData(owner.address, owner)
        )
      const pledgers = await getSigners(54)
      // Pledge $245k (+ $5k deposit) = $250k in total
      for (let i = 5; i < 54; i++) {
        await owner.sendTransaction({
          to: pledgers[i].address,
          value: parseEther('1.0'),
        })
        await fomoUsdcLp.connect(owner).transfer(pledgers[i].address, LP_5K)
        await launchpad.connect(owner).addKOL(pledgers[i].address)
        await fomoUsdcLp
          .connect(pledgers[i])
          .approve(launchpad.address, constants.MaxUint256)
        await launchpad
          .connect(pledgers[i])
          .pledge(0, LP_5K, false, SIGNED_DATA[i])
      }
      await launchpad.connect(user).launch(0)
      const alloc = await launchpad.tokenAddresses(0)
      const meme = (await env.ethers.getContractAt(
        'ERC20',
        alloc.token
      )) as ERC20
      expect(await meme.balanceOf(user3.address)).to.be.eq(
        (await meme.totalSupply()).div(100)
      )
    })

    it('Should leave correct number of MEME in launchpad contract', async () => {
      const { launchpad, user, owner } = await loadFixture(
        deployContractFixtureWithHardCapReached
      )
      await launchpad.connect(user).launch(0)
      const alloc = await launchpad.tokenAddresses(0)
      const meme = (await env.ethers.getContractAt(
        'ERC20',
        alloc.token
      )) as ERC20
      expect(await meme.balanceOf(launchpad.address)).to.be.gte(
        (await meme.totalSupply()).mul(4700).div(10000)
      )
      expect(await meme.balanceOf(launchpad.address)).to.be.lte(
        (await meme.totalSupply()).mul(4700).div(10000).add(100)
      )
    })

    it('Should vest 5% to the meme token team in vesting contract', async () => {
      const { launchpad, user, team } = await loadFixture(
        deployContractFixtureWithHardCapReached
      )
      await launchpad.connect(user).launch(0)
      const alloc = await launchpad.tokenAddresses(0)
      const vesting = (await env.ethers.getContractAt(
        'MEMEVesting',
        alloc.vesting
      )) as MEMEVesting
      const meme = (await env.ethers.getContractAt(
        'ERC20',
        alloc.token
      )) as ERC20

      const teamVesting = await vesting.getVestingPositions(team.address)
      expect(teamVesting[0].amount).to.be.eq(
        (await meme.totalSupply()).mul(500).div(10000)
      )
    })

    it('Should vest KOL bonuses in vesting contract', async () => {
      const { launchpad, user } = await loadFixture(
        deployContractFixtureWithHardCapReached
      )
      await launchpad.connect(user).launch(0)
      const alloc = await launchpad.tokenAddresses(0)
      const vesting = (await env.ethers.getContractAt(
        'MEMEVesting',
        alloc.vesting
      )) as MEMEVesting
      const meme = (await env.ethers.getContractAt(
        'ERC20',
        alloc.token
      )) as ERC20
      const pledgers = await getSigners(54)
      const launch = await getLaunchConfig(launchpad, 0)
      for (let i = 5; i < 54; i++) {
        const pledge = await launchpad.launchToUserPledge(
          0,
          pledgers[i].address
        )
        const vestingPos = await vesting.getVestingPositions(
          pledgers[i].address
        )
        expect(vestingPos[0].amount).to.be.eq(
          (await meme.totalSupply())
            .mul(500)
            .div(10000)
            .mul(pledge.lp)
            .div(launch.raisedLPKOL)
        )
      }
    })

    it('Should vest KOL bonuses in vesting contract for KOL launch creator', async () => {
      const { launchpad, user } = await loadFixture(
        deployContractFixtureWithHardCapReachedFromKOLCreator
      )
      await launchpad.connect(user).launch(0)
      const alloc = await launchpad.tokenAddresses(0)
      const vesting = (await env.ethers.getContractAt(
        'MEMEVesting',
        alloc.vesting
      )) as MEMEVesting
      const meme = (await env.ethers.getContractAt(
        'ERC20',
        alloc.token
      )) as ERC20
      const pledgers = await getSigners(54)
      const launch = await getLaunchConfig(launchpad, 0)
      for (let i = 5; i < 54; i++) {
        const pledge = await launchpad.launchToUserPledge(
          0,
          pledgers[i].address
        )
        const vestingPos = await vesting.getVestingPositions(
          pledgers[i].address
        )
        expect(vestingPos[0].amount).to.be.eq(
          (await meme.totalSupply())
            .mul(500)
            .div(10000)
            .mul(pledge.lp)
            .div(launch.raisedLPKOL)
        )
      }
      const pledge = await launchpad.launchToUserPledge(0, user.address)
      const vestingPos = await vesting.getVestingPositions(user.address)
      expect(vestingPos[0].amount).to.be.eq(
        (await meme.totalSupply())
          .mul(500)
          .div(10000)
          .mul(pledge.lp)
          .div(launch.raisedLPKOL)
      )
    })

    it('Should send MEME to vesting contract correctly', async () => {
      const { launchpad, user } = await loadFixture(
        deployContractFixtureWithHardCapReached
      )
      await launchpad.connect(user).launch(0)
      const alloc = await launchpad.tokenAddresses(0)
      const vesting = (await env.ethers.getContractAt(
        'MEMEVesting',
        alloc.vesting
      )) as MEMEVesting
      const meme = (await env.ethers.getContractAt(
        'ERC20',
        alloc.token
      )) as ERC20
      const pledgers = await getSigners(54)
      const launch = await getLaunchConfig(launchpad, 0)
      var bonusKOLAmount = BigNumber.from(0)
      for (let i = 5; i < 54; i++) {
        const pledge = await launchpad.launchToUserPledge(
          0,
          pledgers[i].address
        )
        bonusKOLAmount = bonusKOLAmount.add(
          (await meme.totalSupply())
            .mul(500)
            .div(10000)
            .mul(pledge.lp)
            .div(launch.raisedLPKOL)
        )
      }
      expect(await meme.balanceOf(vesting.address)).to.be.eq(
        bonusKOLAmount.add((await meme.totalSupply()).mul(500).div(10000))
      )
    })

    it('Should send KOL allocation to platform if no KOL participates', async () => {
      const { launchpad, fomoUsdcLp, owner, user, team, SIGNED_DATA } =
        await loadFixture(deployContractFixtureWithLaunchAfter8Days)
      const pledgers = await getSigners(250)
      // Pledge $245k (+ $5k deposit) = $250k in total
      for (let i = 5; i < 250; i++) {
        await owner.sendTransaction({
          to: pledgers[i].address,
          value: parseEther('1.0'),
        })
        await fomoUsdcLp.connect(owner).transfer(pledgers[i].address, LP_1K)
        await fomoUsdcLp
          .connect(pledgers[i])
          .approve(launchpad.address, constants.MaxUint256)
        await launchpad
          .connect(pledgers[i])
          .pledge(0, LP_1K, false, SIGNED_DATA[i])
      }
      await launchpad.connect(user).launch(0)
      const alloc = await launchpad.tokenAddresses(0)
      const meme = (await env.ethers.getContractAt(
        'ERC20',
        alloc.token
      )) as ERC20
      expect(await meme.balanceOf(owner.address)).to.be.eq(
        (await meme.totalSupply()).mul(775).div(10000)
      )
    })

    it('Should set launch status to LAUNCHED ', async () => {
      const { launchpad, user } = await loadFixture(
        deployContractFixtureWithHardCapReached
      )
      await launchpad.connect(user).launch(0)
      const launch = await getLaunchConfig(launchpad, 0)
      expect(launch.status).to.be.eq(4)
    })

    describe('In Pending state', async () => {
      it('Should just leave launch pending before 15 days', async () => {
        const { launchpad, user } = await loadFixture(
          deployContractFixtureWithLaunch
        )
        const beforeLaunch = await getLaunchConfig(launchpad, 0)
        await launchpad.connect(user).launch(0)
        const launch = await getLaunchConfig(launchpad, 0)
        expect(launch.status).to.be.eq(0)
        expect(launch.status).to.be.eq(beforeLaunch.status)
        expect(await launchpad.activeLaunches(0)).to.be.eq(0)
      })

      it('Should just set launchpad to failed if soft cap is not reached after 15 days', async () => {
        const { launchpad, user } = await loadFixture(
          deployContractFixtureWithLaunch
        )
        const beforeLaunch = await getLaunchConfig(launchpad, 0)
        await ethers.provider.send('evm_setNextBlockTimestamp', [
          beforeLaunch.startTime
            .add(BigNumber.from('86400').mul(15))
            .toNumber(),
        ])
        await launchpad.connect(user).launch(0)
        const launch = await getLaunchConfig(launchpad, 0)
        expect(launch.status).to.be.eq(3)
        await expect(launchpad.activeLaunches(0)).to.be.reverted
      })
    })

    describe('Meme allocations', async () => {
      it('With zero team allocation', async () => {
        const {
          launchpad,
          fomoUsdcLp,
          owner,
          user,
          user2,
          team,
          user3,
          SIGNED_DATA,
          balancerVaultAddress,
        } = await loadFixture(deployContractFixture)
        // create config
        var config = {
          name: 'MEME',
          symbol: 'MEME',
          totalSupply: 1e9,
          hardCap: 250000,
          team: team.address,
          x: user3.address,
          allocations: [0, 500, 500, 3525, 4700, 500],
          rewardsAllocations: [3500, 3500, 1000, 1000, 1000] as [
            number,
            number,
            number,
            number,
            number
          ],
          rounds: [1 * ONE_DAY, 7 * ONE_DAY, 7 * ONE_DAY] as [
            number,
            number,
            number
          ],
          dexIndex: 0,
          steakTeamFee: 2000,
        }
        await launchpad
          .connect(user2)
          .createLaunch(
            config,
            true,
            await getUserVerificationData(user2.address, owner)
          )

        // reach hard cap
        const pledgers = await getSigners(54)
        // Pledge $245k (+ $5k deposit) = $250k in total
        for (let i = 5; i < 54; i++) {
          await owner.sendTransaction({
            to: pledgers[i].address,
            value: parseEther('1.0'),
          })
          await fomoUsdcLp.connect(owner).transfer(pledgers[i].address, LP_5K)
          await launchpad.connect(owner).addKOL(pledgers[i].address)
          await fomoUsdcLp
            .connect(pledgers[i])
            .approve(launchpad.address, constants.MaxUint256)
          await launchpad
            .connect(pledgers[i])
            .pledge(0, LP_5K, false, SIGNED_DATA[i])
        }

        // Check allocations
        await launchpad.connect(user).launch(0)
        const launch = await getLaunchConfig(launchpad, 0)
        const alloc = await launchpad.tokenAddresses(0)
        const vesting = (await env.ethers.getContractAt(
          'MEMEVesting',
          alloc.vesting
        )) as MEMEVesting
        const meme = (await env.ethers.getContractAt(
          'ERC20',
          alloc.token
        )) as ERC20

        expect(await vesting.getVestingPositions(team.address)).to.be.empty
        expect(await meme.balanceOf(alloc.vesting)).to.be.eq(
          (await meme.totalSupply())
            .mul(config.allocations[1] + config.allocations[0])
            .div(10000)
            .sub(29)
        )
        expect(await meme.balanceOf(await launchpad.steakIC())).to.be.eq(
          (await meme.totalSupply())
            .mul(config.allocations[2])
            .div(10)
            .div(10000)
        )
        expect(await meme.balanceOf(await launchpad.fomoIC())).to.be.eq(
          (await meme.totalSupply())
            .mul(config.allocations[2])
            .div(10)
            .div(10000)
        )
        expect(await meme.balanceOf(alloc.tokenIC)).to.be.eq(
          (await meme.totalSupply())
            .mul(config.allocations[2])
            .div(10)
            .div(10000)
        )
        expect(await meme.balanceOf(alloc.fomoLPIC)).to.be.eq(
          (await meme.totalSupply())
            .mul(config.allocations[2])
            .mul(35)
            .div(100)
            .div(10000)
        )
        expect(await meme.balanceOf(alloc.usdcLPIC)).to.be.eq(
          (await meme.totalSupply())
            .mul(config.allocations[2])
            .mul(35)
            .div(100)
            .div(10000)
        )
        expect(await meme.balanceOf(await launchpad.owner())).to.be.eq(
          (await meme.totalSupply())
            .mul(await launchpad.PLATFORM_MEME_FEE())
            .div(10000)
        )
        expect(await meme.balanceOf(launch.x)).to.be.eq(
          (await meme.totalSupply()).mul(config.allocations[5]).div(10000)
        )
        expect(await meme.balanceOf(launchpad.address)).to.be.eq(
          (await meme.totalSupply())
            .mul(config.allocations[4])
            .div(10000)
            .add(29)
        )
        const memeUsdcLP = (await env.ethers.getContractAt(
          'ERC20',
          alloc.usdcLP
        )) as ERC20
        const memeFomoLP = (await env.ethers.getContractAt(
          'ERC20',
          alloc.fomoLP
        )) as ERC20
        expect(await meme.balanceOf(memeUsdcLP.address)).to.be.eq(
          (await meme.totalSupply()).mul(config.allocations[3]).div(20000)
        )
        expect(await meme.balanceOf(memeFomoLP.address)).to.be.eq(
          (await meme.totalSupply()).mul(config.allocations[3]).div(20000)
        )
      })

      it('With zero KOL allocation', async () => {
        const {
          launchpad,
          fomoUsdcLp,
          owner,
          user,
          user2,
          team,
          user3,
          SIGNED_DATA,
          balancerVaultAddress,
        } = await loadFixture(deployContractFixture)
        // create config
        var config = {
          name: 'MEME',
          symbol: 'MEME',
          totalSupply: 1e9,
          hardCap: 250000,
          team: team.address,
          x: user3.address,
          allocations: [500, 0, 500, 3525, 4700, 500],
          rewardsAllocations: [3500, 3500, 1000, 1000, 1000] as [
            number,
            number,
            number,
            number,
            number
          ],
          rounds: [1 * ONE_DAY, 7 * ONE_DAY, 7 * ONE_DAY] as [
            number,
            number,
            number
          ],
          dexIndex: 0,
          steakTeamFee: 2000,
        }
        await launchpad
          .connect(user2)
          .createLaunch(
            config,
            true,
            await getUserVerificationData(user2.address, owner)
          )

        // reach hard cap
        const pledgers = await getSigners(54)
        // Pledge $245k (+ $5k deposit) = $250k in total
        for (let i = 5; i < 54; i++) {
          await owner.sendTransaction({
            to: pledgers[i].address,
            value: parseEther('1.0'),
          })
          await fomoUsdcLp.connect(owner).transfer(pledgers[i].address, LP_5K)
          await launchpad.connect(owner).addKOL(pledgers[i].address)
          await fomoUsdcLp
            .connect(pledgers[i])
            .approve(launchpad.address, constants.MaxUint256)
          await launchpad
            .connect(pledgers[i])
            .pledge(0, LP_5K, false, SIGNED_DATA[i])
        }

        // Check allocations
        await launchpad.connect(user).launch(0)
        const launch = await getLaunchConfig(launchpad, 0)
        const alloc = await launchpad.tokenAddresses(0)
        const vesting = (await env.ethers.getContractAt(
          'MEMEVesting',
          alloc.vesting
        )) as MEMEVesting
        const meme = (await env.ethers.getContractAt(
          'ERC20',
          alloc.token
        )) as ERC20

        expect(
          (await vesting.getVestingPositions(team.address))[0].amount
        ).to.be.eq(
          (await meme.totalSupply()).mul(config.allocations[0]).div(10000)
        )
        expect(await meme.balanceOf(alloc.vesting)).to.be.eq(
          (await meme.totalSupply()).mul(config.allocations[0]).div(10000)
        )
        expect(await meme.balanceOf(await launchpad.steakIC())).to.be.eq(
          (await meme.totalSupply())
            .mul(config.allocations[2])
            .div(10)
            .div(10000)
        )
        expect(await meme.balanceOf(await launchpad.fomoIC())).to.be.eq(
          (await meme.totalSupply())
            .mul(config.allocations[2])
            .div(10)
            .div(10000)
        )
        expect(await meme.balanceOf(alloc.tokenIC)).to.be.eq(
          (await meme.totalSupply())
            .mul(config.allocations[2])
            .div(10)
            .div(10000)
        )
        expect(await meme.balanceOf(alloc.fomoLPIC)).to.be.eq(
          (await meme.totalSupply())
            .mul(config.allocations[2])
            .mul(35)
            .div(100)
            .div(10000)
        )
        expect(await meme.balanceOf(alloc.usdcLPIC)).to.be.eq(
          (await meme.totalSupply())
            .mul(config.allocations[2])
            .mul(35)
            .div(100)
            .div(10000)
        )
        expect(await meme.balanceOf(await launchpad.owner())).to.be.eq(
          (await meme.totalSupply())
            .mul(await launchpad.PLATFORM_MEME_FEE())
            .div(10000)
        )
        expect(await meme.balanceOf(launch.x)).to.be.eq(
          (await meme.totalSupply()).mul(config.allocations[5]).div(10000)
        )
        expect(await meme.balanceOf(launchpad.address)).to.be.eq(
          (await meme.totalSupply()).mul(config.allocations[4]).div(10000)
        )
        const memeUsdcLP = (await env.ethers.getContractAt(
          'ERC20',
          alloc.usdcLP
        )) as ERC20
        const memeFomoLP = (await env.ethers.getContractAt(
          'ERC20',
          alloc.fomoLP
        )) as ERC20
        expect(await meme.balanceOf(memeUsdcLP.address)).to.be.eq(
          (await meme.totalSupply()).mul(config.allocations[3]).div(20000)
        )
        expect(await meme.balanceOf(memeFomoLP.address)).to.be.eq(
          (await meme.totalSupply()).mul(config.allocations[3]).div(20000)
        )
      })

      it('With zero Rewards allocation', async () => {
        const {
          launchpad,
          fomoUsdcLp,
          owner,
          user,
          user2,
          team,
          user3,
          SIGNED_DATA,
          balancerVaultAddress,
        } = await loadFixture(deployContractFixture)
        // create config
        var config = {
          name: 'MEME',
          symbol: 'MEME',
          totalSupply: 1e9,
          hardCap: 250000,
          team: team.address,
          x: user3.address,
          allocations: [500, 500, 0, 3525, 4700, 500],
          rewardsAllocations: [3500, 3500, 1000, 1000, 1000] as [
            number,
            number,
            number,
            number,
            number
          ],
          rounds: [1 * ONE_DAY, 7 * ONE_DAY, 7 * ONE_DAY] as [
            number,
            number,
            number
          ],
          dexIndex: 0,
          steakTeamFee: 2000,
        }
        await launchpad
          .connect(user2)
          .createLaunch(
            config,
            true,
            await getUserVerificationData(user2.address, owner)
          )

        // reach hard cap
        const pledgers = await getSigners(54)
        // Pledge $245k (+ $5k deposit) = $250k in total
        for (let i = 5; i < 54; i++) {
          await owner.sendTransaction({
            to: pledgers[i].address,
            value: parseEther('1.0'),
          })
          await fomoUsdcLp.connect(owner).transfer(pledgers[i].address, LP_5K)
          await launchpad.connect(owner).addKOL(pledgers[i].address)
          await fomoUsdcLp
            .connect(pledgers[i])
            .approve(launchpad.address, constants.MaxUint256)
          await launchpad
            .connect(pledgers[i])
            .pledge(0, LP_5K, false, SIGNED_DATA[i])
        }

        // Check allocations
        await launchpad.connect(user).launch(0)
        const launch = await getLaunchConfig(launchpad, 0)
        const alloc = await launchpad.tokenAddresses(0)
        const vesting = (await env.ethers.getContractAt(
          'MEMEVesting',
          alloc.vesting
        )) as MEMEVesting
        const meme = (await env.ethers.getContractAt(
          'ERC20',
          alloc.token
        )) as ERC20

        expect(
          (await vesting.getVestingPositions(team.address))[0].amount
        ).to.be.eq(
          (await meme.totalSupply()).mul(config.allocations[0]).div(10000)
        )
        expect(await meme.balanceOf(alloc.vesting)).to.be.eq(
          (await meme.totalSupply())
            .mul(config.allocations[1] + config.allocations[0])
            .div(10000)
            .sub(29)
        )
        expect(await meme.balanceOf(await launchpad.steakIC())).to.be.eq(0)
        expect(await meme.balanceOf(alloc.tokenIC)).to.be.eq(0)
        expect(await meme.balanceOf(alloc.fomoLPIC)).to.be.eq(0)
        expect(await meme.balanceOf(alloc.usdcLPIC)).to.be.eq(0)
        expect(await meme.balanceOf(await launchpad.owner())).to.be.eq(
          (await meme.totalSupply())
            .mul(await launchpad.PLATFORM_MEME_FEE())
            .div(10000)
        )
        expect(await meme.balanceOf(launch.x)).to.be.eq(
          (await meme.totalSupply()).mul(config.allocations[5]).div(10000)
        )
        expect(await meme.balanceOf(launchpad.address)).to.be.eq(
          (await meme.totalSupply())
            .mul(config.allocations[4])
            .div(10000)
            .add(29)
        )
        const memeUsdcLP = (await env.ethers.getContractAt(
          'ERC20',
          alloc.usdcLP
        )) as ERC20
        const memeFomoLP = (await env.ethers.getContractAt(
          'ERC20',
          alloc.fomoLP
        )) as ERC20
        expect(await meme.balanceOf(memeUsdcLP.address)).to.be.eq(
          (await meme.totalSupply()).mul(config.allocations[3]).div(20000)
        )
        expect(await meme.balanceOf(memeFomoLP.address)).to.be.eq(
          (await meme.totalSupply()).mul(config.allocations[3]).div(20000)
        )
      })

      it('With zero Sale allocation', async () => {
        const {
          launchpad,
          fomoUsdcLp,
          owner,
          user,
          user2,
          team,
          user3,
          SIGNED_DATA,
          balancerVaultAddress,
        } = await loadFixture(deployContractFixture)
        // create config
        var config = {
          name: 'MEME',
          symbol: 'MEME',
          totalSupply: 1e9,
          hardCap: 250000,
          team: team.address,
          x: user3.address,
          allocations: [500, 500, 3525, 4700, 0, 500],
          rewardsAllocations: [3500, 3500, 1000, 1000, 1000] as [
            number,
            number,
            number,
            number,
            number
          ],
          rounds: [1 * ONE_DAY, 7 * ONE_DAY, 7 * ONE_DAY] as [
            number,
            number,
            number
          ],
          dexIndex: 0,
          steakTeamFee: 2000,
        }
        await launchpad
          .connect(user2)
          .createLaunch(
            config,
            true,
            await getUserVerificationData(user2.address, owner)
          )

        // reach hard cap
        const pledgers = await getSigners(54)
        // Pledge $245k (+ $5k deposit) = $250k in total
        for (let i = 5; i < 54; i++) {
          await owner.sendTransaction({
            to: pledgers[i].address,
            value: parseEther('1.0'),
          })
          await fomoUsdcLp.connect(owner).transfer(pledgers[i].address, LP_5K)
          await launchpad.connect(owner).addKOL(pledgers[i].address)
          await fomoUsdcLp
            .connect(pledgers[i])
            .approve(launchpad.address, constants.MaxUint256)
          await launchpad
            .connect(pledgers[i])
            .pledge(0, LP_5K, false, SIGNED_DATA[i])
        }

        // Check allocations
        await launchpad.connect(user).launch(0)
        const launch = await getLaunchConfig(launchpad, 0)
        const alloc = await launchpad.tokenAddresses(0)
        const vesting = (await env.ethers.getContractAt(
          'MEMEVesting',
          alloc.vesting
        )) as MEMEVesting
        const meme = (await env.ethers.getContractAt(
          'ERC20',
          alloc.token
        )) as ERC20

        expect(
          (await vesting.getVestingPositions(team.address))[0].amount
        ).to.be.eq(
          (await meme.totalSupply()).mul(config.allocations[0]).div(10000)
        )
        expect(await meme.balanceOf(alloc.vesting)).to.be.eq(
          (await meme.totalSupply())
            .mul(config.allocations[1] + config.allocations[0])
            .div(10000)
            .sub(29)
        )
        expect(await meme.balanceOf(await launchpad.steakIC())).to.be.eq(
          (await meme.totalSupply())
            .mul(config.allocations[2])
            .div(10)
            .div(10000)
        )
        expect(await meme.balanceOf(await launchpad.fomoIC())).to.be.eq(
          (await meme.totalSupply())
            .mul(config.allocations[2])
            .div(10)
            .div(10000)
        )
        expect(await meme.balanceOf(alloc.tokenIC)).to.be.eq(
          (await meme.totalSupply())
            .mul(config.allocations[2])
            .div(10)
            .div(10000)
        )
        expect(await meme.balanceOf(alloc.fomoLPIC)).to.be.eq(
          (await meme.totalSupply())
            .mul(config.allocations[2])
            .mul(35)
            .div(100)
            .div(10000)
        )
        expect(await meme.balanceOf(alloc.usdcLPIC)).to.be.eq(
          (await meme.totalSupply())
            .mul(config.allocations[2])
            .mul(35)
            .div(100)
            .div(10000)
        )
        expect(await meme.balanceOf(await launchpad.owner())).to.be.eq(
          (await meme.totalSupply())
            .mul(await launchpad.PLATFORM_MEME_FEE())
            .div(10000)
        )
        expect(await meme.balanceOf(launch.x)).to.be.eq(
          (await meme.totalSupply()).mul(config.allocations[5]).div(10000)
        )
        expect(await meme.balanceOf(launchpad.address)).to.be.eq(29)
        const memeUsdcLP = (await env.ethers.getContractAt(
          'ERC20',
          alloc.usdcLP
        )) as ERC20
        const memeFomoLP = (await env.ethers.getContractAt(
          'ERC20',
          alloc.fomoLP
        )) as ERC20
        expect(await meme.balanceOf(memeUsdcLP.address)).to.be.eq(
          (await meme.totalSupply()).mul(config.allocations[3]).div(20000)
        )
        expect(await meme.balanceOf(memeFomoLP.address)).to.be.eq(
          (await meme.totalSupply()).mul(config.allocations[3]).div(20000)
        )
      })

      it('With zero Liquidity allocation (should revert)', async () => {
        const {
          launchpad,
          fomoUsdcLp,
          owner,
          user,
          user2,
          team,
          user3,
          SIGNED_DATA,
          balancerVaultAddress,
        } = await loadFixture(deployContractFixture)
        // create config
        var config = {
          name: 'MEME',
          symbol: 'MEME',
          totalSupply: 1e9,
          hardCap: 250000,
          team: team.address,
          x: user3.address,
          allocations: [500, 500, 3525, 0, 4700, 500],
          rewardsAllocations: [3500, 3500, 1000, 1000, 1000] as [
            number,
            number,
            number,
            number,
            number
          ],
          rounds: [1 * ONE_DAY, 7 * ONE_DAY, 7 * ONE_DAY] as [
            number,
            number,
            number
          ],
          dexIndex: 0,
          steakTeamFee: 2000,
        }
        const action = launchpad
          .connect(user2)
          .createLaunch(
            config,
            true,
            await getUserVerificationData(user2.address, owner)
          )
        await expect(action).to.be.revertedWith(ERROR.LiquidityAllocationIsZero)
      })

      it('With zero platform allocation', async () => {
        const {
          launchpad,
          fomoUsdcLp,
          owner,
          user,
          user2,
          team,
          user3,
          SIGNED_DATA,
          balancerVaultAddress,
        } = await loadFixture(deployContractFixture)
        // create config
        var config = {
          name: 'MEME',
          symbol: 'MEME',
          totalSupply: 1e9,
          hardCap: 250000,
          team: team.address,
          x: user3.address,
          allocations: [500, 500, 500, 3525, 4700, 275],
          rewardsAllocations: [3500, 3500, 1000, 1000, 1000] as [
            number,
            number,
            number,
            number,
            number
          ],
          rounds: [1 * ONE_DAY, 7 * ONE_DAY, 7 * ONE_DAY] as [
            number,
            number,
            number
          ],
          dexIndex: 0,
          steakTeamFee: 2000,
        }
        await launchpad.setMemePlatformFee(0)
        await launchpad
          .connect(user2)
          .createLaunch(
            config,
            true,
            await getUserVerificationData(user2.address, owner)
          )

        // reach hard cap
        const pledgers = await getSigners(54)
        // Pledge $245k (+ $5k deposit) = $250k in total
        for (let i = 5; i < 54; i++) {
          await owner.sendTransaction({
            to: pledgers[i].address,
            value: parseEther('1.0'),
          })
          await fomoUsdcLp.connect(owner).transfer(pledgers[i].address, LP_5K)
          await launchpad.connect(owner).addKOL(pledgers[i].address)
          await fomoUsdcLp
            .connect(pledgers[i])
            .approve(launchpad.address, constants.MaxUint256)
          await launchpad
            .connect(pledgers[i])
            .pledge(0, LP_5K, false, SIGNED_DATA[i])
        }

        // Check allocations
        await launchpad.connect(user).launch(0)
        const launch = await getLaunchConfig(launchpad, 0)
        const alloc = await launchpad.tokenAddresses(0)
        const vesting = (await env.ethers.getContractAt(
          'MEMEVesting',
          alloc.vesting
        )) as MEMEVesting
        const meme = (await env.ethers.getContractAt(
          'ERC20',
          alloc.token
        )) as ERC20

        expect(
          (await vesting.getVestingPositions(team.address))[0].amount
        ).to.be.eq(
          (await meme.totalSupply()).mul(config.allocations[0]).div(10000)
        )
        expect(await meme.balanceOf(alloc.vesting)).to.be.eq(
          (await meme.totalSupply())
            .mul(config.allocations[1] + config.allocations[0])
            .div(10000)
            .sub(29)
        )
        expect(await meme.balanceOf(await launchpad.steakIC())).to.be.eq(
          (await meme.totalSupply())
            .mul(config.allocations[2])
            .div(10)
            .div(10000)
        )
        expect(await meme.balanceOf(await launchpad.fomoIC())).to.be.eq(
          (await meme.totalSupply())
            .mul(config.allocations[2])
            .div(10)
            .div(10000)
        )
        expect(await meme.balanceOf(alloc.tokenIC)).to.be.eq(
          (await meme.totalSupply())
            .mul(config.allocations[2])
            .div(10)
            .div(10000)
        )
        expect(await meme.balanceOf(alloc.fomoLPIC)).to.be.eq(
          (await meme.totalSupply())
            .mul(config.allocations[2])
            .mul(35)
            .div(100)
            .div(10000)
        )
        expect(await meme.balanceOf(alloc.usdcLPIC)).to.be.eq(
          (await meme.totalSupply())
            .mul(config.allocations[2])
            .mul(35)
            .div(100)
            .div(10000)
        )
        expect(await meme.balanceOf(await launchpad.owner())).to.be.eq(0)
        expect(await meme.balanceOf(launch.x)).to.be.eq(
          (await meme.totalSupply()).mul(config.allocations[5]).div(10000)
        )
        expect(await meme.balanceOf(launchpad.address)).to.be.eq(
          (await meme.totalSupply())
            .mul(config.allocations[4])
            .div(10000)
            .add(29)
        )
        const memeUsdcLP = (await env.ethers.getContractAt(
          'ERC20',
          alloc.usdcLP
        )) as ERC20
        const memeFomoLP = (await env.ethers.getContractAt(
          'ERC20',
          alloc.fomoLP
        )) as ERC20
        expect(await meme.balanceOf(memeUsdcLP.address)).to.be.eq(
          (await meme.totalSupply()).mul(config.allocations[3]).div(20000)
        )
        expect(await meme.balanceOf(memeFomoLP.address)).to.be.eq(
          (await meme.totalSupply()).mul(config.allocations[3]).div(20000)
        )
      })

      it('With zero X allocation', async () => {
        const {
          launchpad,
          fomoUsdcLp,
          owner,
          user,
          user2,
          team,
          user3,
          SIGNED_DATA,
          balancerVaultAddress,
        } = await loadFixture(deployContractFixture)
        // create config
        var config = {
          name: 'MEME',
          symbol: 'MEME',
          totalSupply: 1e9,
          hardCap: 250000,
          team: team.address,
          x: user3.address,
          allocations: [500, 500, 3525, 500, 4700, 0],
          rewardsAllocations: [3500, 3500, 1000, 1000, 1000] as [
            number,
            number,
            number,
            number,
            number
          ],
          rounds: [1 * ONE_DAY, 7 * ONE_DAY, 7 * ONE_DAY] as [
            number,
            number,
            number
          ],
          dexIndex: 0,
          steakTeamFee: 2000,
        }
        await launchpad
          .connect(user2)
          .createLaunch(
            config,
            true,
            await getUserVerificationData(user2.address, owner)
          )

        // reach hard cap
        const pledgers = await getSigners(54)
        // Pledge $245k (+ $5k deposit) = $250k in total
        for (let i = 5; i < 54; i++) {
          await owner.sendTransaction({
            to: pledgers[i].address,
            value: parseEther('1.0'),
          })
          await fomoUsdcLp.connect(owner).transfer(pledgers[i].address, LP_5K)
          await launchpad.connect(owner).addKOL(pledgers[i].address)
          await fomoUsdcLp
            .connect(pledgers[i])
            .approve(launchpad.address, constants.MaxUint256)
          await launchpad
            .connect(pledgers[i])
            .pledge(0, LP_5K, false, SIGNED_DATA[i])
        }

        // Check allocations
        await launchpad.connect(user).launch(0)
        const launch = await getLaunchConfig(launchpad, 0)
        const alloc = await launchpad.tokenAddresses(0)
        const vesting = (await env.ethers.getContractAt(
          'MEMEVesting',
          alloc.vesting
        )) as MEMEVesting
        const meme = (await env.ethers.getContractAt(
          'ERC20',
          alloc.token
        )) as ERC20

        expect(
          (await vesting.getVestingPositions(team.address))[0].amount
        ).to.be.eq(
          (await meme.totalSupply()).mul(config.allocations[0]).div(10000)
        )
        expect(await meme.balanceOf(alloc.vesting)).to.be.eq(
          (await meme.totalSupply())
            .mul(config.allocations[1] + config.allocations[0])
            .div(10000)
            .sub(29)
        )
        expect(await meme.balanceOf(await launchpad.steakIC())).to.be.eq(
          (await meme.totalSupply())
            .mul(config.allocations[2])
            .div(10)
            .div(10000)
        )
        expect(await meme.balanceOf(await launchpad.fomoIC())).to.be.eq(
          (await meme.totalSupply())
            .mul(config.allocations[2])
            .div(10)
            .div(10000)
        )
        expect(await meme.balanceOf(alloc.tokenIC)).to.be.eq(
          (await meme.totalSupply())
            .mul(config.allocations[2])
            .div(10)
            .div(10000)
        )
        expect(await meme.balanceOf(alloc.fomoLPIC)).to.be.eq(
          (await meme.totalSupply())
            .mul(config.allocations[2])
            .mul(35)
            .div(100)
            .div(10000)
        )
        expect(await meme.balanceOf(alloc.usdcLPIC)).to.be.eq(
          (await meme.totalSupply())
            .mul(config.allocations[2])
            .mul(35)
            .div(100)
            .div(10000)
        )
        expect(await meme.balanceOf(await launchpad.owner())).to.be.eq(
          (await meme.totalSupply())
            .mul(await launchpad.PLATFORM_MEME_FEE())
            .div(10000)
        )
        expect(await meme.balanceOf(launch.x)).to.be.eq(0)
        expect(await meme.balanceOf(launchpad.address)).to.be.eq(
          (await meme.totalSupply())
            .mul(config.allocations[4])
            .div(10000)
            .add(29)
        )
        const memeUsdcLP = (await env.ethers.getContractAt(
          'ERC20',
          alloc.usdcLP
        )) as ERC20
        const memeFomoLP = (await env.ethers.getContractAt(
          'ERC20',
          alloc.fomoLP
        )) as ERC20
        expect(await meme.balanceOf(memeUsdcLP.address)).to.be.eq(
          (await meme.totalSupply()).mul(config.allocations[3]).div(20000)
        )
        expect(await meme.balanceOf(memeFomoLP.address)).to.be.eq(
          (await meme.totalSupply()).mul(config.allocations[3]).div(20000)
        )
      })
    })
  })

  describe('ClaimTokens', async () => {
    it('Should revert if launchpad is not in LAUNCHED state', async () => {
      const { launchpad, user } = await loadFixture(
        deployContractFixtureWithHardCapReached
      )
      const action = launchpad.connect(user).claimTokens(0)
      await expect(action).to.be.revertedWith(ERROR.LaunchIsNotLaunched)
    })

    it('Should revert if user already claimed', async () => {
      const { launchpad, user } = await loadFixture(
        deployContractFixtureWithHardCapReached
      )
      await launchpad.connect(user).launch(0)
      const pledgers = await getSigners(7)
      await launchpad.connect(pledgers[6]).claimTokens(0)
      const action = launchpad.connect(pledgers[6]).claimTokens(0)
      await expect(action).to.be.revertedWith(ERROR.AlreadyClaimed)
    })

    it('Should transfer correct token amount', async () => {
      const { launchpad, fomoUsdcLp, owner, user2, SIGNED_DATA } =
        await loadFixture(deployContractFixtureWithLaunchAfter8Days)
      const pledgers = await getSigners(249)
      // Pledge $245k (+ $5k deposit) = $250k in total
      for (let i = 5; i < 249; i++) {
        await owner.sendTransaction({
          to: pledgers[i].address,
          value: parseEther('1.0'),
        })
        await fomoUsdcLp.connect(owner).transfer(pledgers[i].address, LP_1K)
        await fomoUsdcLp
          .connect(pledgers[i])
          .approve(launchpad.address, constants.MaxUint256)
        await launchpad
          .connect(pledgers[i])
          .pledge(0, LP_5K, false, SIGNED_DATA[i])
      }
      await fomoUsdcLp
        .connect(user2)
        .approve(launchpad.address, constants.MaxUint256)
      await launchpad.connect(user2).pledge(0, LP_5K, true, SIGNED_DATA[2])
      const launchBefore = await getLaunchConfig(launchpad, 0)
      expect(launchBefore.status).to.be.eq(2)
      await launchpad.launch(0)
      const alloc = await launchpad.tokenAddresses(0)
      const meme = (await env.ethers.getContractAt(
        'ERC20',
        alloc.token
      )) as ERC20
      const ownerBalanceBefore = await meme.balanceOf(owner.address)
      await launchpad.connect(user2).claimTokens(0)
      const userPledge = await launchpad.launchToUserPledge(0, user2.address)
      const ownerPledge = await launchpad.launchToUserPledge(0, owner.address)
      const launch = await getLaunchConfig(launchpad, 0)
      const memeTotalSupply = await meme.totalSupply()
      const userMemeTokensAmount = userPledge.lp
        .mul(memeTotalSupply)
        .mul(47)
        .div(launch.raisedLP)
        .div(100)
      expect(await meme.balanceOf(user2.address)).to.be.eq(userMemeTokensAmount)
      for (let i = 5; i < 249; i++) {
        await launchpad.connect(pledgers[i]).claimTokens(0)
        expect(await meme.balanceOf(pledgers[i].address)).to.be.eq(
          userMemeTokensAmount
        )
      }
      await launchpad.connect(owner).claimTokens(0)
      expect(await meme.balanceOf(owner.address)).to.be.eq(
        ownerBalanceBefore.add(
          ownerPledge.lp
            .mul(memeTotalSupply)
            .mul(47)
            .div(launch.raisedLP)
            .div(100)
        )
      )
      expect(await meme.balanceOf(launchpad.address)).to.be.eq(0)
    })

    it('Should set user pledge claimed amunt properly', async () => {
      const { launchpad } = await loadFixture(
        deployContractFixtureWithHardCapReached
      )
      await launchpad.launch(0)
      const signers = await getSigners(6)
      const user = signers[5]
      await launchpad.connect(user).claimTokens(0)
      const launch = await getLaunchConfig(launchpad, 0)
      const userPledge = await launchpad.launchToUserPledge(0, user.address)
      expect(userPledge.claimed).to.be.eq(
        userPledge.lp
          .mul(launch.totalSupply)
          .mul(1e12)
          .mul(1e6)
          .mul(47)
          .div(launch.raisedLP)
          .div(100)
      )
    })
  })

  describe('GetFundsBack', async () => {
    it('Should revert if launchpad is not in failed state', async () => {
      const { launchpad, user2, SIGNED_DATA } = await loadFixture(
        deployContractFixtureWithLaunchAfter1Days
      )
      await launchpad
        .connect(user2)
        .pledgeWithNFT(
          0,
          LP_500,
          true,
          0,
          constants.AddressZero,
          SIGNED_DATA[2]
        )
      const action = launchpad.connect(user2).getFundsBack(0, false)
      await expect(action).to.be.revertedWith(ERROR.LaunchIsNotFailed)
    })

    it("Should not transfer any tokens if user doesn't have any pledge", async () => {
      const { launchpad, user2, fomoUsdcLp } = await loadFixture(
        deployContractFixtureWithLaunchAfter1Days
      )
      const launchBefore = await getLaunchConfig(launchpad, 0)
      await ethers.provider.send('evm_setNextBlockTimestamp', [
        launchBefore.startTime.add(BigNumber.from('86400').mul(15)).toNumber(),
      ])
      await launchpad.connect(user2).launch(0)
      await launchpad.connect(user2).getFundsBack(0, false)
      expect(await fomoUsdcLp.balanceOf(user2.address)).to.be.eq(0)
    })

    it('Should transfer tokens back correctly', async () => {
      const { launchpad, user2, fomoUsdcLp, SIGNED_DATA } = await loadFixture(
        deployContractFixtureWithLaunchAfter1Days
      )
      const launchBefore = await getLaunchConfig(launchpad, 0)
      await launchpad
        .connect(user2)
        .pledgeWithNFT(
          0,
          LP_500,
          true,
          0,
          constants.AddressZero,
          SIGNED_DATA[2]
        )
      await ethers.provider.send('evm_setNextBlockTimestamp', [
        launchBefore.startTime.add(BigNumber.from('86400').mul(15)).toNumber(),
      ])
      await launchpad.connect(user2).launch(0)
      const balanceBefore = await fomoUsdcLp.balanceOf(user2.address)
      await launchpad.connect(user2).getFundsBack(0, false)
      expect(await fomoUsdcLp.balanceOf(user2.address)).to.be.eq(
        balanceBefore.add(LP_500)
      )
    })

    it('Should deposit tokens to steak correctly', async () => {
      const { launchpad, user2, fomoUsdcLp, steakController, SIGNED_DATA } =
        await loadFixture(deployContractFixtureWithLaunchAfter1Days)
      const launchBefore = await getLaunchConfig(launchpad, 0)
      await launchpad
        .connect(user2)
        .pledgeWithNFT(
          0,
          LP_500,
          true,
          0,
          constants.AddressZero,
          SIGNED_DATA[2]
        )
      await ethers.provider.send('evm_setNextBlockTimestamp', [
        launchBefore.startTime.add(BigNumber.from('86400').mul(15)).toNumber(),
      ])
      await launchpad.connect(user2).launch(0)
      const balanceBefore = await fomoUsdcLp.balanceOf(steakController.address)
      const stakedBefore = await steakController.balances(user2.address)
      await launchpad.connect(user2).getFundsBack(0, true)
      const balance = await steakController.balances(user2.address)
      expect(await fomoUsdcLp.balanceOf(steakController.address)).to.be.eq(
        balanceBefore.add(LP_500)
      )
      expect(balance.staked).to.be.eq(stakedBefore.staked.add(LP_500))
    })

    it('Should reset user pledge to 0', async () => {
      const { launchpad, user2, SIGNED_DATA } = await loadFixture(
        deployContractFixtureWithLaunchAfter1Days
      )
      const launchBefore = await getLaunchConfig(launchpad, 0)
      await launchpad
        .connect(user2)
        .pledgeWithNFT(
          0,
          LP_500,
          true,
          0,
          constants.AddressZero,
          SIGNED_DATA[2]
        )
      await ethers.provider.send('evm_setNextBlockTimestamp', [
        launchBefore.startTime.add(BigNumber.from('86400').mul(15)).toNumber(),
      ])
      await launchpad.connect(user2).launch(0)
      await launchpad.connect(user2).getFundsBack(0, false)
      const userPledge = await launchpad.launchToUserPledge(0, user2.address)
      expect(userPledge.lp).to.be.eq(0)
    })
  })

  describe('EmergencyFailLaunch', async () => {
    it('Should revert if launchpad is in LAUNCHED state', async () => {
      const { launchpad, user, owner } = await loadFixture(
        deployContractFixtureWithHardCapReached
      )
      await launchpad.connect(user).launch(0)
      const action = launchpad.connect(owner).emergencyFailLaunch(0)
      await expect(action).to.be.revertedWith(ERROR.AlreadyLaunched)
    })

    it('Should revert if not an owner', async () => {
      const { launchpad, user } = await loadFixture(
        deployContractFixtureWithHardCapReached
      )
      await launchpad.connect(user).launch(0)
      const action = launchpad.connect(user).emergencyFailLaunch(0)
      await expect(action).to.be.revertedWith(
        'Ownable: caller is not the owner'
      )
    })

    it('Should set launch status to FAILED from PENDING', async () => {
      const { launchpad, owner, fomoUsdcLp, user, SIGNED_DATA } =
        await loadFixture(deployContractFixtureWithLaunchAfter8Days)
      await fomoUsdcLp
        .connect(user)
        .approve(launchpad.address, constants.MaxUint256)
      await launchpad.connect(user).pledge(0, LP_5K, false, SIGNED_DATA[1])
      const launchBefore = await getLaunchConfig(launchpad, 0)
      expect(launchBefore.status).to.be.eq(0)
      await launchpad.connect(owner).emergencyFailLaunch(0)
      const launch = await getLaunchConfig(launchpad, 0)
      expect(launch.status).to.be.eq(3)
    })

    it('Should set launch status to FAILED from SOFT_CAP_REACHED', async () => {
      const {
        launchpad,
        fomoUsdcLp,
        user,
        team,
        owner,
        usdc,
        fomo,
        SIGNED_DATA,
      } = await loadFixture(deployContractFixtureWithLaunch)
      const pledgers = await getSigners(24)
      // Pledge $95k (+ $5k deposit) = $100k in total
      for (let i = 5; i < 24; i++) {
        await owner.sendTransaction({
          to: pledgers[i].address,
          value: parseEther('1.0'),
        })
        await fomoUsdcLp.connect(owner).transfer(pledgers[i].address, LP_5K)
        await launchpad.connect(owner).addKOL(pledgers[i].address)
        await fomoUsdcLp
          .connect(pledgers[i])
          .approve(launchpad.address, constants.MaxUint256)
        await launchpad
          .connect(pledgers[i])
          .pledge(0, LP_5K, false, SIGNED_DATA[i])
      }
      await fomoUsdcLp
        .connect(user)
        .approve(launchpad.address, constants.MaxUint256)
      const launchBefore = await getLaunchConfig(launchpad, 0)
      const blockTimestamp = launchBefore.startTime
        .add(BigNumber.from('86400').mul(15))
        .toNumber()
      await ethers.provider.send('evm_setNextBlockTimestamp', [blockTimestamp])
      await launchpad
        .connect(user)
        .pledge(
          0,
          LP_5K,
          false,
          await getUserVerificationData(user.address, owner, blockTimestamp)
        )
      const launchBefore2 = await getLaunchConfig(launchpad, 0)
      expect(launchBefore2.status).to.be.eq(1)
      await launchpad.connect(owner).emergencyFailLaunch(0)
      const launch = await getLaunchConfig(launchpad, 0)
      expect(launch.status).to.be.eq(3)
    })

    it('Should set launch status to FAILED from HARD_CAP_REACHED', async () => {
      const { launchpad, owner } = await loadFixture(
        deployContractFixtureWithHardCapReached
      )
      const launchBefore = await getLaunchConfig(launchpad, 0)
      expect(launchBefore.status).to.be.eq(2)
      await launchpad.connect(owner).emergencyFailLaunch(0)
      const launch = await getLaunchConfig(launchpad, 0)
      expect(launch.status).to.be.eq(3)
    })

    it('Should get funds back after emergency fail', async () => {
      const { launchpad, owner } = await loadFixture(
        deployContractFixtureWithHardCapReached
      )
      const launchBefore = await getLaunchConfig(launchpad, 0)
      expect(launchBefore.status).to.be.eq(2)
      await launchpad.connect(owner).emergencyFailLaunch(0)
      const launch = await getLaunchConfig(launchpad, 0)
      expect(launch.status).to.be.eq(3)
      const pledgers = await getSigners(54)
      const a1 = launchpad.connect(pledgers[10]).getFundsBack(0, false)
      const a2 = launchpad.connect(pledgers[11]).getFundsBack(0, false)
      const a3 = launchpad.connect(pledgers[12]).getFundsBack(0, false)
      await expect(a1).not.to.be.reverted
      await expect(a2).not.to.be.reverted
      await expect(a3).not.to.be.reverted
    })
  })

  describe('KOL Addresses', async () => {
    describe('AddKOL', async () => {
      it('Should revert if not an owner', async () => {
        const { launchpad, user } = await loadFixture(deployContractFixture)
        const action = launchpad.connect(user).addKOL(user.address)
        await expect(action).to.be.revertedWith(
          'Ownable: caller is not the owner'
        )
      })

      it('Should revert if user is KOL', async () => {
        const { launchpad, owner, user } = await loadFixture(
          deployContractFixture
        )
        await launchpad.connect(owner).addKOL(user.address)
        const action = launchpad.connect(owner).addKOL(user.address)
        await expect(action).to.be.revertedWith(ERROR.UserIsKOL)
      })

      it('Should set KOL addresses correctly', async () => {
        const { launchpad, owner, user, user2, user3 } = await loadFixture(
          deployContractFixture
        )
        await launchpad.connect(owner).addKOL(user.address)
        await launchpad.connect(owner).addKOL(user3.address)
        await launchpad.connect(owner).addKOL(user2.address)
        expect(await launchpad.isKOL(user.address)).to.be.eq(true)
        expect(await launchpad.isKOL(user2.address)).to.be.eq(true)
        expect(await launchpad.isKOL(user3.address)).to.be.eq(true)
        expect(await launchpad.kolAddresses(0)).to.be.eq(user.address)
        expect(await launchpad.kolAddresses(1)).to.be.eq(user3.address)
        expect(await launchpad.kolAddresses(2)).to.be.eq(user2.address)
      })

      it('Should launch correctly after addKOL', async () => {
        const { launchpad, fomoUsdcLp, owner, user, team, SIGNED_DATA } =
          await loadFixture(deployContractFixtureWithLaunchAfter8Days)
        const pledgers = await getSigners(250)
        // Pledge $245k (+ $5k deposit) = $250k in total
        for (let i = 5; i < 250; i++) {
          await owner.sendTransaction({
            to: pledgers[i].address,
            value: parseEther('1.0'),
          })
          await fomoUsdcLp.connect(owner).transfer(pledgers[i].address, LP_1K)
          await fomoUsdcLp
            .connect(pledgers[i])
            .approve(launchpad.address, constants.MaxUint256)
          await launchpad
            .connect(pledgers[i])
            .pledge(0, LP_1K, false, SIGNED_DATA[i])
        }
        const launchBefore = await getLaunchConfig(launchpad, 0)
        expect(launchBefore.raisedLPKOL).to.be.eq(0)
        for (let i = 5; i < 55; i++) {
          await launchpad.connect(owner).addKOL(pledgers[i].address)
        }
        const action = launchpad.connect(user).launch(0, { gasLimit: 30000000 })
        await expect(action).not.to.be.reverted
        await expect(launchpad.activeLaunches(0)).to.be.reverted

        const launch = await getLaunchConfig(launchpad, 0)

        expect(launch.raisedLPKOL).to.be.eq(LP_1K.mul(50))
        expect(launch.raisedLP).to.be.eq(launchBefore.raisedLP)
      })

      it('Should launch correctly after addKOL and remove KOL', async () => {
        const { launchpad, fomoUsdcLp, owner, user, team, SIGNED_DATA } =
          await loadFixture(deployContractFixtureWithLaunchAfter8Days)
        const pledgers = await getSigners(250)
        // Pledge $245k (+ $5k deposit) = $250k in total
        for (let i = 5; i < 250; i++) {
          await owner.sendTransaction({
            to: pledgers[i].address,
            value: parseEther('1.0'),
          })
          await fomoUsdcLp.connect(owner).transfer(pledgers[i].address, LP_1K)
          await fomoUsdcLp
            .connect(pledgers[i])
            .approve(launchpad.address, constants.MaxUint256)
          await launchpad
            .connect(pledgers[i])
            .pledge(0, LP_1K, false, SIGNED_DATA[i])
        }
        const launchBefore = await getLaunchConfig(launchpad, 0)
        expect(launchBefore.raisedLPKOL).to.be.eq(0)
        for (let i = 5; i < 250; i++) {
          await launchpad.connect(owner).addKOL(pledgers[i].address)
        }
        for (let i = 5; i < 250; i++) {
          await launchpad.connect(owner).removeKOL(pledgers[i].address)
        }
        const action = launchpad.connect(user).launch(0, { gasLimit: 30000000 })
        await expect(action).not.to.be.reverted
        await expect(launchpad.activeLaunches(0)).to.be.reverted

        const launch = await getLaunchConfig(launchpad, 0)

        expect(launch.raisedLPKOL).to.be.eq(LP_1K.mul(0))
        expect(launch.raisedLP).to.be.eq(launchBefore.raisedLP)
      })
    })

    describe('RemoveKOL', async () => {
      it('Should revert if not an owner', async () => {
        const { launchpad, user, owner } = await loadFixture(
          deployContractFixture
        )
        await launchpad.connect(owner).addKOL(user.address)
        const action = launchpad.connect(user).removeKOL(user.address)
        await expect(action).to.be.revertedWith(
          'Ownable: caller is not the owner'
        )
      })

      it('Should revert if user is not KOL', async () => {
        const { launchpad, owner, user } = await loadFixture(
          deployContractFixture
        )
        const action = launchpad.connect(owner).removeKOL(user.address)
        await expect(action).to.be.revertedWith(ERROR.UserIsNotKOL)
      })

      it('Should remove KOL addresses correctly', async () => {
        const { launchpad, owner, user, user2, user3 } = await loadFixture(
          deployContractFixture
        )
        await launchpad.connect(owner).addKOL(user.address)
        await launchpad.connect(owner).addKOL(user2.address)
        await launchpad.connect(owner).addKOL(user3.address)
        await launchpad.connect(owner).removeKOL(user.address)
        expect(await launchpad.isKOL(user.address)).to.be.eq(false)
        expect(await launchpad.isKOL(user2.address)).to.be.eq(true)
        expect(await launchpad.isKOL(user3.address)).to.be.eq(true)
        expect(await launchpad.kolAddresses(0)).to.be.eq(user3.address)
        expect(await launchpad.kolAddresses(1)).to.be.eq(user2.address)
        const action = launchpad.kolAddresses(2)
        await expect(action).to.be.reverted
      })

      it('Should launch correctly after remove KOL', async () => {
        const { launchpad, owner, user } = await loadFixture(
          deployContractFixtureWithHardCapReached
        )
        const launchBefore = await getLaunchConfig(launchpad, 0)
        expect(launchBefore.raisedLPKOL).to.be.eq(LP_5K.mul(49))
        const pledgers = await getSigners(54)
        for (let i = 5; i < 54; i++) {
          await launchpad.connect(owner).removeKOL(pledgers[i].address)
        }
        const launch = await getLaunchConfig(launchpad, 0)
        expect(launch.raisedLPKOL).to.be.eq(0)
        expect(launch.raisedLP).to.be.eq(launchBefore.raisedLP)

        const action = launchpad.connect(user).launch(0)
        await expect(action).not.to.be.reverted
        await expect(launchpad.activeLaunches(0)).to.be.reverted
      })

      it('Should launch correctly after remove KOL and readd KOL', async () => {
        const { launchpad, owner, user } = await loadFixture(
          deployContractFixtureWithHardCapReached
        )
        const launchBefore = await getLaunchConfig(launchpad, 0)
        expect(launchBefore.raisedLPKOL).to.be.eq(LP_5K.mul(49))
        const pledgers = await getSigners(54)
        for (let i = 5; i < 54; i++) {
          await launchpad.connect(owner).removeKOL(pledgers[i].address)
        }
        for (let i = 5; i < 54; i++) {
          await launchpad.connect(owner).addKOL(pledgers[i].address)
        }
        const launch = await getLaunchConfig(launchpad, 0)
        expect(launch.raisedLPKOL).to.be.eq(launchBefore.raisedLPKOL)
        expect(launch.raisedLP).to.be.eq(launchBefore.raisedLP)
        expect(launch).to.deep.eq(launchBefore)

        const action = launchpad.connect(user).launch(0)
        await expect(action).not.to.be.reverted
        await expect(launchpad.activeLaunches(0)).to.be.reverted
      })
    })
  })

  describe('setSoftCapAndFees', async () => {
    // TODO: Add tests
  })

  describe('setPledgeLimits', async () => {
    // TODO: Add tests
  })

  describe('setSteakPlatformFee', async () => {
    // TODO: Add tests
  })

  describe('setMemePlatformFee', async () => {
    // TODO: Add tests
  })

  describe('setControllerFactory', async () => {
    // TODO: Add tests
  })

  describe('setSteakIC', async () => {
    // TODO: Add tests
  })

  describe('setSteakIC', async () => {
    // TODO: Add tests
  })
})
