import { ethers } from 'hardhat'
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { expect } from 'chai'

import {
  FMBCMemberNFTVerifier__factory,
  FomoBullClubNFT__factory,
  IncentivesController__factory,
  MemberNFTVerifierOnlyTokenId__factory,
  bin,
} from '../../hardhat-types/src/factories/contracts'
import { parseEther } from 'ethers/lib/utils'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { BigNumber } from 'ethers'
const { FMBCTokenERC20__factory } = bin

const ERROR_ADDRESS_ZERO = 'ArgumentIsAddressZero'
const OWNABLE_REVERT_STRING = 'Ownable: caller is not the owner'
const ERROR_ARGUMENT_IS_OUT_OF_BOUND = 'ArgumentIsIndexOutOfBound'
const ERROR_VERIFYEE_DOES_NOT_EXIST = 'VerifyeeDoesNotExist'
const ERROR_CALLER_IS_NOT_VERIFYEE = 'CallerIsNotVerifyee'

describe('MemberNFTVerifierOnlyTokenId', () => {
  async function deployContractFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, user, user2, user3] = await ethers.getSigners()

    // deploy Member NFT collection
    const name = 'FOMO BULL CLUB MEMBER NFT'
    const symbol = 'FMBCMEMBER'
    const baseURI = 'ipfs/hash/'
    const contractURI = 'contractURI'
    const nftContractFactory = new FomoBullClubNFT__factory(owner)
    const nftContract = await nftContractFactory.deploy(
      name,
      symbol,
      baseURI,
      contractURI
    )
    await nftContract.deployed()
    const ERC721_COLLECTION_ADDRESS = nftContract.address
    await nftContract.freeMint([1, 1, 1, 1, 1], user.address)
    await nftContract.freeMint([1, 1, 1, 1, 1], user2.address)
    const OWNED_TOKEN_IDS_BY_USER = [0, 100, 600, 1600, 4100]
    const OWNED_TOKEN_IDS_BY_USER2 = [1, 101, 601, 1601, 4101]

    // deploy incentives controller
    const erc20ContractFactory = new FMBCTokenERC20__factory(owner)
    const stakingToken = await erc20ContractFactory.deploy(
      parseEther(`${100_000_000_000}`)
    )
    await stakingToken.deployed()
    const incentivesControllerFactory = new IncentivesController__factory(owner)
    const incentivesController = await incentivesControllerFactory.deploy(
      stakingToken.address,
      nftContract.address
    )

    // deploy verifier contract
    const contractFactory = new MemberNFTVerifierOnlyTokenId__factory(owner)
    const contract = await contractFactory.deploy(ERC721_COLLECTION_ADDRESS)
    await contract.deployed()

    return {
      // factories
      contractFactory,
      // main Verifier contract
      contract,
      // NFT contract
      nftContract,
      ERC721_COLLECTION_ADDRESS,
      OWNED_TOKEN_IDS_BY_USER,
      OWNED_TOKEN_IDS_BY_USER2,
      // staking
      incentivesController,
      // others
      owner,
      user,
      user2,
      user3,
    }
  }

  describe('Deployment', async () => {
    it('Print out gas needed', async () => {
      const { contract } = await loadFixture(deployContractFixture)
      console.log(
        'Gas used for deployment',
        (await contract.deployTransaction.wait()).gasUsed.toNumber()
      )
    })

    it('Should set owner correctly', async () => {
      const { contract, owner } = await loadFixture(deployContractFixture)
      expect(await contract.owner()).to.be.eq(owner.address)
    })

    it('Should set collection correctly', async () => {
      const { contract, ERC721_COLLECTION_ADDRESS } = await loadFixture(
        deployContractFixture
      )
      expect(await contract.collection()).to.be.eq(ERC721_COLLECTION_ADDRESS)
    })

    it('Should start with empty incentives controllers', async () => {
      const { contract } = await loadFixture(deployContractFixture)
      expect(await contract.getIncentivesControllersCount()).to.be.eq(0)
      const action = contract.removeIncentivesController(0)
      await expect(action).to.be.revertedWith(ERROR_ARGUMENT_IS_OUT_OF_BOUND)
    })
  })

  describe('addVerifyee', () => {
    it('Should not add address zero as', async () => {
      const { contract, user } = await loadFixture(deployContractFixture)
      const action = contract.addVerifyee(ethers.constants.AddressZero)
      await expect(action).to.be.revertedWith(ERROR_ADDRESS_ZERO)
    })

    it('Should add correctly', async () => {
      const { contract, user } = await loadFixture(deployContractFixture)
      const VERIFYEE_ADDRESS = user.address
      expect(await contract.isVerifyee(VERIFYEE_ADDRESS)).to.be.eq(false)
      await contract.addVerifyee(VERIFYEE_ADDRESS)
      expect(await contract.isVerifyee(VERIFYEE_ADDRESS)).to.be.eq(true)
    })

    it('Should be callable only by the admin/owner', async () => {
      const { contract, user } = await loadFixture(deployContractFixture)
      const VERIFYEE_ADDRESS = user.address
      // asct as user
      const userAction = contract.connect(user).addVerifyee(VERIFYEE_ADDRESS)
      await expect(userAction).to.be.revertedWith(OWNABLE_REVERT_STRING)
      // act as owner
      const ownerAction = contract.addVerifyee(VERIFYEE_ADDRESS)
      await expect(ownerAction).to.not.be.reverted
    })
  })

  describe('removeVerifyee', () => {
    it('Should fail if no verifyee is set', async () => {
      const { contract, user } = await loadFixture(deployContractFixture)
      const VERIFYEE_ADDRESS = user.address

      const action = contract.removeVerifyee(VERIFYEE_ADDRESS)
      await expect(action).to.be.revertedWith(ERROR_VERIFYEE_DOES_NOT_EXIST)
    })

    it('Should remove correctly', async () => {
      const { contract, user } = await loadFixture(deployContractFixture)
      const VERIFYEE_ADDRESS = user.address
      expect(await contract.isVerifyee(VERIFYEE_ADDRESS)).to.be.eq(false)
      await contract.addVerifyee(VERIFYEE_ADDRESS)
      expect(await contract.isVerifyee(VERIFYEE_ADDRESS)).to.be.eq(true)
      await contract.removeVerifyee(VERIFYEE_ADDRESS)
      expect(await contract.isVerifyee(VERIFYEE_ADDRESS)).to.be.eq(false)
    })

    it('Should be callable only by the admin/owner', async () => {
      const { contract, user } = await loadFixture(deployContractFixture)
      const VERIFYEE_ADDRESS = user.address
      await contract.addVerifyee(VERIFYEE_ADDRESS)

      // act as user
      const userAction = contract.connect(user).removeVerifyee(VERIFYEE_ADDRESS)
      await expect(userAction).to.be.revertedWith(OWNABLE_REVERT_STRING)
      // act as owner
      const ownerAction = contract.removeVerifyee(VERIFYEE_ADDRESS)
      await expect(ownerAction).to.not.be.reverted
    })
  })

  describe('addIncentivesController', () => {
    it('Should not add address zero', async () => {
      const { contract, user } = await loadFixture(deployContractFixture)
      const action = contract.addIncentivesController(
        ethers.constants.AddressZero
      )
      await expect(action).to.be.revertedWith(ERROR_ADDRESS_ZERO)
    })

    it('Should add correctly', async () => {
      const { contract, ERC721_COLLECTION_ADDRESS, user } = await loadFixture(
        deployContractFixture
      )
      await expect(contract.incentivesControllers(0)).to.be.revertedWith('')
      await contract.addIncentivesController(ERC721_COLLECTION_ADDRESS)
      expect(await contract.getIncentivesControllersCount()).to.be.eq(1)
      expect(await contract.incentivesControllers(0)).to.be.eq(
        ERC721_COLLECTION_ADDRESS
      )
    })

    it('Should be callable only by the admin/owner', async () => {
      const { contract, ERC721_COLLECTION_ADDRESS, user } = await loadFixture(
        deployContractFixture
      )
      // asct as user
      const userAction = contract
        .connect(user)
        .addIncentivesController(ERC721_COLLECTION_ADDRESS)
      await expect(userAction).to.be.revertedWith(OWNABLE_REVERT_STRING)
      // act as owner
      const ownerAction = contract.addIncentivesController(
        ERC721_COLLECTION_ADDRESS
      )
      await expect(ownerAction).to.not.be.reverted
    })
  })

  describe('removeIncentivesController', () => {
    it('Should fail if no controller is set', async () => {
      const { contract, user } = await loadFixture(deployContractFixture)
      const action = contract.removeIncentivesController(0)
      await expect(action).to.be.revertedWith(ERROR_ARGUMENT_IS_OUT_OF_BOUND)
    })

    it('Should remove correctly', async () => {
      const { contract, user, user2, user3 } = await loadFixture(
        deployContractFixture
      )
      // prepare
      await contract.addIncentivesController(user.address)
      await contract.addIncentivesController(user2.address)
      await contract.addIncentivesController(user3.address)
      expect(await contract.getIncentivesControllersCount()).to.be.eq(3)
      // act
      await contract.removeIncentivesController(1)
      // assert
      expect(await contract.incentivesControllers(0)).to.be.eq(user.address)
      expect(await contract.incentivesControllers(1)).to.be.eq(user3.address)
      await expect(contract.incentivesControllers(2)).to.be.revertedWith('')
      expect(await contract.getIncentivesControllersCount()).to.be.eq(2)
    })

    it('Should be callable only by the admin/owner', async () => {
      const { contract, ERC721_COLLECTION_ADDRESS, user } = await loadFixture(
        deployContractFixture
      )
      // prepare
      await contract.addIncentivesController(ERC721_COLLECTION_ADDRESS)

      // asct as user
      const userAction = contract.connect(user).removeIncentivesController(0)
      await expect(userAction).to.be.revertedWith(OWNABLE_REVERT_STRING)
      // act as owner
      const ownerAction = contract.removeIncentivesController(0)
      await expect(ownerAction).to.not.be.reverted
    })
  })

  describe('previewVerify', async () => {
    it('Should return true if user is owner of the token', async () => {
      const { contract, OWNED_TOKEN_IDS_BY_USER, user } = await loadFixture(
        deployContractFixture
      )
      const action = contract.previewVerify(
        user.address,
        OWNED_TOKEN_IDS_BY_USER[0],
        0,
        []
      )
      expect(await action).to.be.eq(true)
    })

    it('Should return false if user is not owner of the token', async () => {
      const { contract, OWNED_TOKEN_IDS_BY_USER2, user, user2 } =
        await loadFixture(deployContractFixture)
      const action = contract.previewVerify(
        user.address,
        OWNED_TOKEN_IDS_BY_USER2[0],
        0,
        []
      )
      expect(await action).to.be.eq(false)
      const action2 = contract.previewVerify(
        user2.address,
        OWNED_TOKEN_IDS_BY_USER2[0],
        0,
        []
      )
      expect(await action2).to.be.eq(true)
    })
  })

  describe('verify', async () => {
    it('Should return true if user is owner of the token', async () => {
      const { contract, OWNED_TOKEN_IDS_BY_USER, owner, user } =
        await loadFixture(deployContractFixture)
      await contract.addVerifyee(owner.address)

      const action = contract.callStatic.verify(
        user.address,
        OWNED_TOKEN_IDS_BY_USER[0],
        0,
        []
      )
      await contract.verify(user.address, OWNED_TOKEN_IDS_BY_USER[0], 0, [])
      expect(await action).to.be.eq(true)
    })

    it('Each address can be used multiple times per ACTION ID', async () => {
      const { contract, OWNED_TOKEN_IDS_BY_USER, owner, user } =
        await loadFixture(deployContractFixture)
      await contract.addVerifyee(owner.address)

      const ACTION_ID = 10 // random action id

      // first try
      const action = contract.callStatic.verify(
        user.address,
        OWNED_TOKEN_IDS_BY_USER[1],
        ACTION_ID,
        []
      )
      await contract.verify(
        user.address,
        OWNED_TOKEN_IDS_BY_USER[1],
        ACTION_ID,
        []
      )
      expect(await action).to.be.eq(true)

      // second try
      const action2 = contract.callStatic.verify(
        user.address,
        OWNED_TOKEN_IDS_BY_USER[0],
        ACTION_ID,
        []
      )
      await contract.verify(
        user.address,
        OWNED_TOKEN_IDS_BY_USER[0],
        ACTION_ID,
        []
      )
      expect(await action2).to.be.eq(true)

      // next request
      const action3 = contract.callStatic.verify(
        user.address,
        OWNED_TOKEN_IDS_BY_USER[0],
        ACTION_ID + 1,
        []
      )
      await contract.verify(
        user.address,
        OWNED_TOKEN_IDS_BY_USER[0],
        ACTION_ID + 1,
        []
      )
      expect(await action3).to.be.eq(true)

      // next request second try, should fail
      const action4 = contract.callStatic.verify(
        user.address,
        OWNED_TOKEN_IDS_BY_USER[0],
        ACTION_ID + 1,
        []
      )
      await contract.verify(
        user.address,
        OWNED_TOKEN_IDS_BY_USER[0],
        ACTION_ID + 1,
        []
      )
      expect(await action4).to.be.eq(false)
    })

    it('Each token can be used only once per ACTION ID', async () => {
      const {
        contract,
        nftContract,
        OWNED_TOKEN_IDS_BY_USER,
        owner,
        user,
        user2,
      } = await loadFixture(deployContractFixture)
      await contract.addVerifyee(owner.address)

      const ACTION_ID = 10 // random action id
      const TOKEN_ID = OWNED_TOKEN_IDS_BY_USER[0]

      // first try
      const action = contract.callStatic.verify(
        user.address,
        TOKEN_ID,
        ACTION_ID,
        []
      )
      await contract.verify(user.address, TOKEN_ID, ACTION_ID, [])
      expect(await action).to.be.eq(true)

      // transfer token to user2
      await nftContract
        .connect(user)
      ['safeTransferFrom(address,address,uint256)'](
        user.address,
        user2.address,
        OWNED_TOKEN_IDS_BY_USER[0]
      )
      expect(await nftContract.ownerOf(TOKEN_ID)).to.be.eq(user2.address)

      // second try, should fail
      const action2 = contract.callStatic.verify(
        user2.address,
        TOKEN_ID,
        ACTION_ID,
        []
      )
      await contract.verify(user2.address, TOKEN_ID, ACTION_ID, [])
      expect(await action2).to.be.eq(false)
    })

    it('Should return false if user is not owner of the token', async () => {
      const { contract, OWNED_TOKEN_IDS_BY_USER2, owner, user, user2 } =
        await loadFixture(deployContractFixture)
      await contract.addVerifyee(owner.address)

      const action = contract.callStatic.verify(
        user.address,
        OWNED_TOKEN_IDS_BY_USER2[0],
        0,
        []
      )
      expect(await action).to.be.eq(false)
      const action2 = contract.callStatic.verify(
        user2.address,
        OWNED_TOKEN_IDS_BY_USER2[0],
        0,
        []
      )
      expect(await action2).to.be.eq(true)
    })

    it('Should be callable only by verifyee', async () => {
      const { contract, OWNED_TOKEN_IDS_BY_USER, owner, user, user2 } =
        await loadFixture(deployContractFixture)

      const action = contract.callStatic.verify(
        user.address,
        OWNED_TOKEN_IDS_BY_USER[0],
        0,
        []
      )
      await expect(action).to.be.revertedWith(ERROR_CALLER_IS_NOT_VERIFYEE)
    })
  })

  describe('verify() for staked tokens', async () => {
    it('Should return true for staked token by the user', async () => {
      const {
        contract,
        OWNED_TOKEN_IDS_BY_USER,
        nftContract,
        incentivesController,
        owner,
        user,
        user2,
      } = await loadFixture(deployContractFixture)
      await contract.addVerifyee(owner.address)

      const TOKEN_ID = OWNED_TOKEN_IDS_BY_USER[0]

      // stake NFT
      await nftContract
        .connect(user)
        .approve(incentivesController.address, TOKEN_ID)
      await incentivesController.connect(user).stakeNFT(TOKEN_ID)
      expect(await nftContract.ownerOf(TOKEN_ID)).to.be.eq(
        incentivesController.address
      )

      const actionBeforeReg = contract.callStatic.verify(
        user.address,
        TOKEN_ID,
        0,
        []
      )
      expect(await actionBeforeReg).to.be.eq(false)

      // register incentives controller
      await contract.addIncentivesController(incentivesController.address)

      // should be true for the staker
      expect(
        await contract.callStatic.verify(user.address, TOKEN_ID, 0, [])
      ).to.be.eq(true)

      // should be false for another user
      expect(
        await contract.callStatic.verify(user2.address, TOKEN_ID, 0, [])
      ).to.be.eq(false)
    })
  })

  describe('getStakedNFTIds() for staked tokens', async () => {
    it('Should return empty array if no token is staked', async () => {
      const { contract, incentivesController, owner, user } = await loadFixture(
        deployContractFixture
      )
      await contract.addVerifyee(owner.address)
      await contract.addIncentivesController(incentivesController.address)

      const stakedNFTs = await contract.getStakedNFTIds(user.address)
      expect(stakedNFTs).to.have.same.members([])
    })

    it('Should return empty array if no incentive controller is registered', async () => {
      const {
        contract,
        incentivesController,
        nftContract,
        OWNED_TOKEN_IDS_BY_USER,
        owner,
        user,
      } = await loadFixture(deployContractFixture)
      const TOKEN_ID = OWNED_TOKEN_IDS_BY_USER[0]

      // prepare
      await contract.addVerifyee(owner.address)

      // act
      await nftContract
        .connect(user)
        .approve(incentivesController.address, TOKEN_ID)
      await incentivesController.connect(user).stakeNFT(TOKEN_ID)
      expect(await nftContract.ownerOf(TOKEN_ID)).to.be.eq(
        incentivesController.address
      )

      // assert
      const stakedNFTs = await contract.getStakedNFTIds(user.address)
      expect(stakedNFTs).to.have.same.members([])
    })

    it('Should return all staked tokens for the user', async () => {
      const {
        contract,
        OWNED_TOKEN_IDS_BY_USER,
        OWNED_TOKEN_IDS_BY_USER2,
        nftContract,
        incentivesController,
        owner,
        user,
        user2,
      } = await loadFixture(deployContractFixture)
      await contract.addVerifyee(owner.address)

      // stake NFTs
      const stakeNFT = async (signer: SignerWithAddress, tokenId: number) => {
        await nftContract
          .connect(signer)
          .approve(incentivesController.address, tokenId)
        await incentivesController.connect(signer).stakeNFT(tokenId)
        expect(await nftContract.ownerOf(tokenId)).to.be.eq(
          incentivesController.address
        )
      }
      await stakeNFT(user, OWNED_TOKEN_IDS_BY_USER[0])
      await stakeNFT(user2, OWNED_TOKEN_IDS_BY_USER2[1])

      // register incentives controller
      await contract.addIncentivesController(incentivesController.address)

      // should be true for the staker
      const stakedNFTs = await contract.getStakedNFTIds(user.address)
      expect(stakedNFTs.map((id) => id.toString())).to.have.same.members([
        BigNumber.from(OWNED_TOKEN_IDS_BY_USER[0]).toString(),
      ])

      const stakedNFTs2 = await contract.getStakedNFTIds(user2.address)
      expect(stakedNFTs2.map((id) => id.toString())).to.have.same.members([
        BigNumber.from(OWNED_TOKEN_IDS_BY_USER2[1]).toString(),
      ])
    })
  })
})
