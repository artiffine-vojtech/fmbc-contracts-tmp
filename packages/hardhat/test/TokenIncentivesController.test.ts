import { ethers } from 'hardhat'
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { expect } from 'chai'
import { parseEther } from 'ethers/lib/utils'

import {
  FomoBullClubNFT__factory,
  bin,
} from '../../hardhat-types/src/factories/contracts'
import { BigNumber } from 'ethers'
import { TokenIncentivesController__factory } from '../../hardhat-types/src'
const { FMBCTokenERC20__factory } = bin

const K100_TOKENS = parseEther(`${100_000}`)
const K1_TOKENS = parseEther(`${1_000}`)
const ONE_DAY = 24 * 60 * 60

describe('TokenIncentivesController', function () {
  async function deployContractFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, user, user2, user3] = await ethers.getSigners()

    // deploy the ERC20 contract
    const erc20ContractFactory = new FMBCTokenERC20__factory(owner)
    const stakingToken = await erc20ContractFactory.deploy(
      parseEther(`${100_000_000_000}`)
    )
    await stakingToken.deployed()

    const rewardToken = await erc20ContractFactory.deploy(
      parseEther(`${100_000_000_000}`)
    )
    await rewardToken.deployed()

    // deploy the NFT contract
    const nftContractFactory = new FomoBullClubNFT__factory(owner)
    const nftContract = await nftContractFactory.deploy(
      'Fomo Bull Club',
      'FMBC',
      'ipfs/hash/',
      'contractURI'
    )
    await nftContract.deployed()

    // deploy the vesting contract
    const incentivesConttrollerFactory = new TokenIncentivesController__factory(
      owner
    )
    const incentivesController = await incentivesConttrollerFactory.deploy(
      stakingToken.address,
      nftContract.address,
      rewardToken.address
    )
    await incentivesController.deployed()

    const ownerBalance = await stakingToken.balanceOf(owner.address)
    console.log('owner balance before transfer', ownerBalance.toString())

    // transfer 100k FMBC to user
    const res = await stakingToken
      .connect(owner)
      .transfer(user.address, K100_TOKENS)
    await res.wait()

    // transfer 100k FMBC to user2
    const res2 = await stakingToken
      .connect(owner)
      .transfer(user2.address, K100_TOKENS)
    await res2.wait()

    // Approve 100k FMBC to user2
    const res3 = await stakingToken
      .connect(user)
      .approve(incentivesController.address, K100_TOKENS)
    await res3.wait()

    // Approve 100k FMBC to user2
    const res4 = await stakingToken
      .connect(user2)
      .approve(incentivesController.address, K100_TOKENS)
    await res4.wait()

    const ownerBalanceAfter = await stakingToken.balanceOf(owner.address)
    console.log('owner balance after transfer', ownerBalanceAfter.toString())

    await nftContract.connect(owner).freeMint([1, 1, 1, 1, 1], user.address)
    await nftContract.connect(owner).freeMint([1, 1, 1, 1, 1], user2.address)

    return {
      // contracts
      stakingToken,
      nftContract,
      incentivesController,
      rewardToken,
      // accounts
      owner,
      user,
      user2,
      user3,
    }
  }

  async function deployContractFixtureWithUserStaked() {
    const {
      stakingToken,
      nftContract,
      incentivesController,
      rewardToken,
      // accounts
      owner,
      user,
      user2,
      user3,
    } = await loadFixture(deployContractFixture)
    await incentivesController.connect(user).deposit(K1_TOKENS, user.address)
    return {
      stakingToken,
      nftContract,
      incentivesController,
      rewardToken,
      // accounts
      owner,
      user,
      user2,
      user3,
    }
  }

  describe('Deployment', () => {
    it('Should be the right set staking token', async () => {
      const { incentivesController, stakingToken } = await loadFixture(
        deployContractFixture
      )
      const tokenAddress: string = await incentivesController.stakingToken()
      expect(stakingToken.address).to.be.equals(tokenAddress)
    })
    it('Should be the right set booster nft', async () => {
      const { incentivesController, nftContract } = await loadFixture(
        deployContractFixture
      )
      const boosterNftAddress: string = await incentivesController.boosterNFT()
      expect(nftContract.address).to.be.equals(boosterNftAddress)
    })
  })

  describe('Deposit', () => {
    it('Should revert on amount zero', async () => {
      const { incentivesController, user } = await loadFixture(
        deployContractFixture
      )
      let action = incentivesController.connect(user).deposit(0, user.address)
      await expect(action).to.be.revertedWith('Amount is zero')
    })

    it('Should transfer proper amount', async () => {
      const { incentivesController, user, stakingToken } = await loadFixture(
        deployContractFixture
      )
      let balanceBefore = await stakingToken.balanceOf(user.address)
      await incentivesController.connect(user).deposit(K1_TOKENS, user.address)
      expect(await stakingToken.balanceOf(user.address)).to.be.equals(
        balanceBefore.sub(K1_TOKENS)
      )
    })

    it('Should set staked and scaled balances properly', async () => {
      const { incentivesController, user } = await loadFixture(
        deployContractFixture
      )
      await incentivesController.connect(user).deposit(K1_TOKENS, user.address)
      let balance = await incentivesController.balances(user.address)
      expect(balance.boosted).to.be.false
      expect(balance.staked).to.be.eq(K1_TOKENS)
      expect(balance.scaled).to.be.eq(K1_TOKENS)
      expect(await incentivesController.totalScaled()).to.be.eq(K1_TOKENS)
    })

    it('Should emit Deposited event with _amount == scaled', async () => {
      const { incentivesController, user } = await loadFixture(
        deployContractFixture
      )
      let action = incentivesController
        .connect(user)
        .deposit(K1_TOKENS, user.address)
      await expect(action)
        .to.emit(incentivesController, 'Deposited')
        .withArgs(user.address, K1_TOKENS, K1_TOKENS)
    })

    // TODO add all NFT cases
    describe('After staked NFT', async () => {
      it('Should set staked and scaled balances properly', async () => {
        const { incentivesController, user, nftContract } = await loadFixture(
          deployContractFixture
        )
        await nftContract.connect(user).approve(incentivesController.address, 0)
        await incentivesController.connect(user).stakeNFT(0)
        await incentivesController
          .connect(user)
          .deposit(K1_TOKENS, user.address)
        let balance = await incentivesController.balances(user.address)
        expect(balance.boosted).to.be.true
        expect(balance.staked).to.be.eq(K1_TOKENS)
        expect(balance.scaled).to.be.eq(K1_TOKENS.mul(15).div(10))
        expect(await incentivesController.totalScaled()).to.be.eq(
          K1_TOKENS.mul(15).div(10)
        )
      })

      it('Should emit Deposited event with scaled == _amount * 1.5', async () => {
        const { incentivesController, user, nftContract } = await loadFixture(
          deployContractFixture
        )
        await nftContract.connect(user).approve(incentivesController.address, 0)
        await incentivesController.connect(user).stakeNFT(0)
        let action = incentivesController
          .connect(user)
          .deposit(K1_TOKENS, user.address)
        await expect(action)
          .to.emit(incentivesController, 'Deposited')
          .withArgs(user.address, K1_TOKENS, K1_TOKENS.mul(15).div(10))
      })
    })
  })

  describe('Withdraw', () => {
    it('Should revert on amount greater than staked', async () => {
      const { incentivesController, user } = await loadFixture(
        deployContractFixtureWithUserStaked
      )
      let action = incentivesController
        .connect(user)
        .withdraw(K1_TOKENS.add(1), user.address)
      await expect(action).to.be.revertedWith('Amount greater than staked')
    })

    it('Should transfer proper amount', async () => {
      const { incentivesController, user, stakingToken } = await loadFixture(
        deployContractFixtureWithUserStaked
      )
      let balanceBefore = await stakingToken.balanceOf(user.address)
      await incentivesController
        .connect(user)
        .withdraw(K1_TOKENS.div(2), user.address)
      expect(await stakingToken.balanceOf(user.address)).to.be.equals(
        balanceBefore.add(K1_TOKENS.div(2))
      )
    })

    it('Should set staked and scaled balances properly', async () => {
      const { incentivesController, user } = await loadFixture(
        deployContractFixtureWithUserStaked
      )
      await incentivesController
        .connect(user)
        .withdraw(K1_TOKENS.div(2), user.address)
      let balance = await incentivesController.balances(user.address)
      expect(balance.boosted).to.be.false
      expect(balance.staked).to.be.eq(K1_TOKENS.div(2))
      expect(balance.scaled).to.be.eq(K1_TOKENS.div(2))
      expect(await incentivesController.totalScaled()).to.be.eq(
        K1_TOKENS.div(2)
      )
    })

    it('Should emit Withdrawn event with _amount == scaled', async () => {
      const { incentivesController, user } = await loadFixture(
        deployContractFixtureWithUserStaked
      )
      let action = incentivesController
        .connect(user)
        .withdraw(K1_TOKENS.div(2), user.address)
      await expect(action)
        .to.emit(incentivesController, 'Withdrawn')
        .withArgs(user.address, K1_TOKENS.div(2), K1_TOKENS.div(2))
    })

    // TODO add all NFT cases
    describe('After staked NFT', async () => {
      it('Should transfer proper amount', async () => {
        const { incentivesController, user, stakingToken, nftContract } =
          await loadFixture(deployContractFixtureWithUserStaked)
        await nftContract.connect(user).approve(incentivesController.address, 0)
        await incentivesController.connect(user).stakeNFT(0)
        let balanceBefore = await stakingToken.balanceOf(user.address)
        await incentivesController
          .connect(user)
          .withdraw(K1_TOKENS.div(2), user.address)
        expect(await stakingToken.balanceOf(user.address)).to.be.equals(
          balanceBefore.add(K1_TOKENS.div(2))
        )
      })

      it('Should set staked and scaled balances properly', async () => {
        const { incentivesController, user, nftContract } = await loadFixture(
          deployContractFixtureWithUserStaked
        )
        await nftContract.connect(user).approve(incentivesController.address, 0)
        await incentivesController.connect(user).stakeNFT(0)
        await incentivesController
          .connect(user)
          .withdraw(K1_TOKENS.div(2), user.address)
        let balance = await incentivesController.balances(user.address)
        expect(balance.boosted).to.be.true
        expect(balance.staked).to.be.eq(K1_TOKENS.div(2))
        expect(balance.scaled).to.be.eq(K1_TOKENS.mul(15).div(20))
        expect(await incentivesController.totalScaled()).to.be.eq(
          K1_TOKENS.mul(15).div(20)
        )
      })

      it('Should emit Withdrawn event with scaled == _amount * 5', async () => {
        const { incentivesController, user, nftContract } = await loadFixture(
          deployContractFixtureWithUserStaked
        )
        await nftContract.connect(user).approve(incentivesController.address, 0)
        await incentivesController.connect(user).stakeNFT(0)
        let action = incentivesController
          .connect(user)
          .withdraw(K1_TOKENS.div(2), user.address)
        await expect(action)
          .to.emit(incentivesController, 'Withdrawn')
          .withArgs(user.address, K1_TOKENS.div(2), K1_TOKENS.mul(15).div(20))
      })
    })
  })

  describe('StakeNFT', () => {
    it('Should revert if position is already boosted', async () => {
      const { incentivesController, user, nftContract } = await loadFixture(
        deployContractFixture
      )
      await nftContract.connect(user).approve(incentivesController.address, 0)
      await incentivesController.connect(user).stakeNFT(0)
      await nftContract.connect(user).approve(incentivesController.address, 100)
      let action = incentivesController.connect(user).stakeNFT(100)
      await expect(action).to.be.revertedWith('Balance already boosted')
    })

    it('Should transfer NFT properly', async () => {
      const { incentivesController, user, nftContract } = await loadFixture(
        deployContractFixture
      )
      let balanceBefore = await nftContract.balanceOf(user.address)
      expect(await nftContract.ownerOf(0)).to.be.eq(user.address)
      await nftContract.connect(user).approve(incentivesController.address, 0)
      await incentivesController.connect(user).stakeNFT(0)
      expect(await nftContract.balanceOf(user.address)).to.be.equals(
        balanceBefore.sub(1)
      )
      expect(await nftContract.ownerOf(0)).to.be.eq(
        incentivesController.address
      )
    })

    it('Should set staked and scaled balances properly before depositing for id 0', async () => {
      const { incentivesController, user, nftContract } = await loadFixture(
        deployContractFixture
      )
      await nftContract.connect(user).approve(incentivesController.address, 0)
      await incentivesController.connect(user).stakeNFT(0)
      let balance = await incentivesController.balances(user.address)
      expect(balance.boosted).to.be.true
      expect(balance.staked).to.be.eq(0)
      expect(balance.scaled).to.be.eq(0)
      expect(balance.nftId).to.be.eq(0)
      expect(await incentivesController.totalScaled()).to.be.eq(0)
    })

    it('Should set staked and scaled balances properly before depositing for id 100', async () => {
      const { incentivesController, user, nftContract } = await loadFixture(
        deployContractFixture
      )
      await nftContract.connect(user).approve(incentivesController.address, 100)
      await incentivesController.connect(user).stakeNFT(100)
      let balance = await incentivesController.balances(user.address)
      expect(balance.boosted).to.be.true
      expect(balance.staked).to.be.eq(0)
      expect(balance.scaled).to.be.eq(0)
      expect(balance.nftId).to.be.eq(100)
      expect(await incentivesController.totalScaled()).to.be.eq(0)
    })

    it('Should emit Deposited event with _amount == scaled == 0', async () => {
      const { incentivesController, user, nftContract } = await loadFixture(
        deployContractFixture
      )
      await nftContract.connect(user).approve(incentivesController.address, 0)
      let action = await incentivesController.connect(user).stakeNFT(0)
      await expect(action)
        .to.emit(incentivesController, 'Deposited')
        .withArgs(user.address, 0, 0)
    })

    describe('After depositing tokens', async () => {
      it('Should set staked and scaled balances properly', async () => {
        const { incentivesController, user, nftContract } = await loadFixture(
          deployContractFixtureWithUserStaked
        )
        await nftContract.connect(user).approve(incentivesController.address, 0)
        await incentivesController.connect(user).stakeNFT(0)
        let balance = await incentivesController.balances(user.address)
        expect(balance.boosted).to.be.true
        expect(balance.staked).to.be.eq(K1_TOKENS)
        expect(balance.scaled).to.be.eq(K1_TOKENS.mul(15).div(10))
        expect(await incentivesController.totalScaled()).to.be.eq(
          K1_TOKENS.mul(15).div(10)
        )
      })

      it('Should emit Deposited event with _amount == 0 and scaled == _amount * 0.5', async () => {
        const { incentivesController, user, nftContract } = await loadFixture(
          deployContractFixtureWithUserStaked
        )
        await nftContract.connect(user).approve(incentivesController.address, 0)
        let action = incentivesController.connect(user).stakeNFT(0)
        await expect(action)
          .to.emit(incentivesController, 'Deposited')
          .withArgs(user.address, 0, K1_TOKENS.mul(5).div(10))
      })
    })
  })

  describe('UnstakeNFT', () => {
    it('Should revert if NFT is not staked', async () => {
      const { incentivesController, user } = await loadFixture(
        deployContractFixture
      )
      let action = incentivesController.connect(user).unstakeNFT()
      await expect(action).to.be.revertedWith('NFT not staked')
    })

    it('Should transfer NFT properly id 0', async () => {
      const { incentivesController, user, nftContract } = await loadFixture(
        deployContractFixture
      )
      await nftContract.connect(user).approve(incentivesController.address, 0)
      await incentivesController.connect(user).stakeNFT(0)
      let balanceBefore = await nftContract.balanceOf(user.address)
      expect(await nftContract.ownerOf(0)).to.be.eq(
        incentivesController.address
      )
      await incentivesController.connect(user).unstakeNFT()
      expect(await nftContract.balanceOf(user.address)).to.be.equals(
        balanceBefore.add(1)
      )
      expect(await nftContract.ownerOf(0)).to.be.eq(user.address)
    })

    it('Should transfer NFT properly id 100', async () => {
      const { incentivesController, user, nftContract } = await loadFixture(
        deployContractFixture
      )
      await nftContract.connect(user).approve(incentivesController.address, 100)
      await incentivesController.connect(user).stakeNFT(100)
      let balanceBefore = await nftContract.balanceOf(user.address)
      expect(await nftContract.ownerOf(100)).to.be.eq(
        incentivesController.address
      )
      await incentivesController.connect(user).unstakeNFT()
      expect(await nftContract.balanceOf(user.address)).to.be.equals(
        balanceBefore.add(1)
      )
      expect(await nftContract.ownerOf(100)).to.be.eq(user.address)
    })

    it('Should set staked and scaled balances properly', async () => {
      const { incentivesController, user, nftContract } = await loadFixture(
        deployContractFixture
      )
      await nftContract.connect(user).approve(incentivesController.address, 0)
      await incentivesController.connect(user).stakeNFT(0)
      await incentivesController.connect(user).unstakeNFT()
      let balance = await incentivesController.balances(user.address)
      expect(balance.boosted).to.be.false
      expect(balance.staked).to.be.eq(0)
      expect(balance.scaled).to.be.eq(0)
      expect(await incentivesController.totalScaled()).to.be.eq(0)
    })

    it('Should emit Withdrawn event with _amount == scaled', async () => {
      const { incentivesController, user, nftContract } = await loadFixture(
        deployContractFixture
      )
      await nftContract.connect(user).approve(incentivesController.address, 0)
      await incentivesController.connect(user).stakeNFT(0)
      let action = await incentivesController.connect(user).unstakeNFT()
      await expect(action)
        .to.emit(incentivesController, 'Withdrawn')
        .withArgs(user.address, 0, 0)
    })

    // TODO add all NFT cases
    describe('After staked NFT', async () => {
      it('Should set staked and scaled balances properly', async () => {
        const { incentivesController, user, nftContract } = await loadFixture(
          deployContractFixtureWithUserStaked
        )
        await nftContract.connect(user).approve(incentivesController.address, 0)
        await incentivesController.connect(user).stakeNFT(0)
        await incentivesController.connect(user).unstakeNFT()
        let balance = await incentivesController.balances(user.address)
        expect(balance.boosted).to.be.false
        expect(balance.staked).to.be.eq(K1_TOKENS)
        expect(balance.scaled).to.be.eq(K1_TOKENS)
        expect(await incentivesController.totalScaled()).to.be.eq(K1_TOKENS)
      })

      it('Should emit Withdrawn event with scaled == _amount * 0.5', async () => {
        const { incentivesController, user, nftContract } = await loadFixture(
          deployContractFixtureWithUserStaked
        )
        await nftContract.connect(user).approve(incentivesController.address, 0)
        await incentivesController.connect(user).stakeNFT(0)
        let action = incentivesController.connect(user).unstakeNFT()
        await expect(action)
          .to.emit(incentivesController, 'Withdrawn')
          .withArgs(user.address, 0, K1_TOKENS.mul(5).div(10))
      })
    })
  })

  describe('getReward', () => {
    it('Should get all rewards if is the only one staked', async () => {
      const { incentivesController, owner, user, rewardToken } =
        await loadFixture(deployContractFixtureWithUserStaked)
      await rewardToken
        .connect(owner)
        .approve(incentivesController.address, K100_TOKENS)
      await incentivesController
        .connect(owner)
        .notifyReward([rewardToken.address], [K1_TOKENS], ONE_DAY * 45)
      const currentTimestmap = BigNumber.from(
        (await ethers.provider.getBlock('latest')).timestamp
      )
      await ethers.provider.send('evm_setNextBlockTimestamp', [
        currentTimestmap.add(BigNumber.from(45).mul('86400')).toNumber(),
      ])
      expect(await rewardToken.balanceOf(user.address)).to.be.eq(0)
      await incentivesController.connect(user).getReward([rewardToken.address])
      expect(await rewardToken.balanceOf(user.address)).to.be.gte(
        K1_TOKENS.sub(1)
      )
    })

    it('Should get 1/3 of all rewards if is the only one staked after 15 days', async () => {
      const { incentivesController, user, rewardToken } = await loadFixture(
        deployContractFixtureWithUserStaked
      )
      await rewardToken.approve(incentivesController.address, K100_TOKENS)
      await incentivesController.notifyReward(
        [rewardToken.address],
        [K1_TOKENS],
        ONE_DAY * 45
      )
      const currentTimestmap = BigNumber.from(
        (await ethers.provider.getBlock('latest')).timestamp
      )
      await ethers.provider.send('evm_setNextBlockTimestamp', [
        currentTimestmap.add(BigNumber.from(15).mul('86400')).toNumber(),
      ])
      expect(await rewardToken.balanceOf(user.address)).to.be.eq(0)
      await incentivesController.connect(user).getReward([rewardToken.address])
      expect(await rewardToken.balanceOf(user.address)).to.be.eq(
        K1_TOKENS.div(3)
      )
    })

    it('Should get 2/3 of all rewards if is the only one staked after 30 days', async () => {
      const { incentivesController, user, rewardToken } = await loadFixture(
        deployContractFixtureWithUserStaked
      )
      await rewardToken.approve(incentivesController.address, K100_TOKENS)
      await incentivesController.notifyReward(
        [rewardToken.address],
        [K1_TOKENS],
        ONE_DAY * 45
      )
      const currentTimestmap = BigNumber.from(
        (await ethers.provider.getBlock('latest')).timestamp
      )
      await ethers.provider.send('evm_setNextBlockTimestamp', [
        currentTimestmap.add(BigNumber.from(30).mul('86400')).toNumber(),
      ])
      expect(await rewardToken.balanceOf(user.address)).to.be.eq(0)
      await incentivesController.connect(user).getReward([rewardToken.address])
      expect(await rewardToken.balanceOf(user.address)).to.be.eq(
        K1_TOKENS.div(3).mul(2)
      )
    })

    it('Should distribute rewards evenly between depositors', async () => {
      const { incentivesController, user, user2, rewardToken } =
        await loadFixture(deployContractFixtureWithUserStaked)
      await rewardToken.approve(incentivesController.address, K100_TOKENS)
      await incentivesController
        .connect(user2)
        .deposit(K1_TOKENS, user2.address)
      await incentivesController.notifyReward(
        [rewardToken.address],
        [K1_TOKENS],
        ONE_DAY * 45
      )
      const currentTimestmap = BigNumber.from(
        (await ethers.provider.getBlock('latest')).timestamp
      )
      await ethers.provider.send('evm_setNextBlockTimestamp', [
        currentTimestmap.add(BigNumber.from(45).mul('86400')).toNumber(),
      ])
      expect(await rewardToken.balanceOf(user.address)).to.be.eq(0)
      expect(await rewardToken.balanceOf(user2.address)).to.be.eq(0)
      await incentivesController.connect(user).getReward([rewardToken.address])
      await incentivesController.connect(user2).getReward([rewardToken.address])
      expect(await rewardToken.balanceOf(user.address)).to.be.gte(
        K1_TOKENS.div(2).sub(1)
      )
      expect(await rewardToken.balanceOf(user2.address)).to.be.gte(
        K1_TOKENS.div(2).sub(1)
      )
    })

    it('Should distribute properly when new user deposits during rewards distribution', async () => {
      const { incentivesController, user, user2, rewardToken } =
        await loadFixture(deployContractFixtureWithUserStaked)
      await rewardToken.approve(incentivesController.address, K100_TOKENS)
      await incentivesController.notifyReward(
        [rewardToken.address],
        [K1_TOKENS],
        ONE_DAY * 45
      )
      const currentTimestmap = BigNumber.from(
        (await ethers.provider.getBlock('latest')).timestamp
      )
      await ethers.provider.send('evm_setNextBlockTimestamp', [
        currentTimestmap.add(BigNumber.from(15).mul('86400')).toNumber(),
      ])
      await incentivesController
        .connect(user2)
        .deposit(K1_TOKENS, user2.address)
      await ethers.provider.send('evm_setNextBlockTimestamp', [
        currentTimestmap.add(BigNumber.from(45).mul('86400')).toNumber(),
      ])
      expect(await rewardToken.balanceOf(user.address)).to.be.eq(0)
      expect(await rewardToken.balanceOf(user2.address)).to.be.eq(0)
      await incentivesController.connect(user).getReward([rewardToken.address])
      await incentivesController.connect(user2).getReward([rewardToken.address])
      expect(await rewardToken.balanceOf(user.address)).to.be.gte(
        K1_TOKENS.div(3).mul(2).sub(1)
      )
      expect(await rewardToken.balanceOf(user2.address)).to.be.gte(
        K1_TOKENS.div(3).sub(1)
      )
    })

    it('Should distribute properly when new user deposits and old one withdraw', async () => {
      const { incentivesController, user, user2, rewardToken } =
        await loadFixture(deployContractFixtureWithUserStaked)
      await rewardToken.approve(incentivesController.address, K100_TOKENS)
      await incentivesController.notifyReward(
        [rewardToken.address],
        [K1_TOKENS],
        ONE_DAY * 45
      )
      const currentTimestmap = BigNumber.from(
        (await ethers.provider.getBlock('latest')).timestamp
      )
      await ethers.provider.send('evm_setNextBlockTimestamp', [
        currentTimestmap.add(BigNumber.from(15).mul('86400')).toNumber(),
      ])
      await incentivesController
        .connect(user2)
        .deposit(K1_TOKENS, user2.address)
      expect(await rewardToken.balanceOf(user.address)).to.be.eq(0)
      await ethers.provider.send('evm_setNextBlockTimestamp', [
        currentTimestmap.add(BigNumber.from(30).mul('86400')).toNumber(),
      ])
      await incentivesController.connect(user).withdraw(K1_TOKENS, user.address)
      await ethers.provider.send('evm_setNextBlockTimestamp', [
        currentTimestmap.add(BigNumber.from(45).mul('86400')).toNumber(),
      ])
      expect(await rewardToken.balanceOf(user2.address)).to.be.eq(0)
      await incentivesController.connect(user).getReward([rewardToken.address])
      await incentivesController.connect(user2).getReward([rewardToken.address])
      expect(await rewardToken.balanceOf(user.address)).to.be.gte(
        K1_TOKENS.div(2).sub(1)
      )
      expect(await rewardToken.balanceOf(user2.address)).to.be.gte(
        K1_TOKENS.div(2).sub(1)
      )
    })

    it('Should distribute properly when both users have NFTs staked', async () => {
      const { incentivesController, user, user2, rewardToken, nftContract } =
        await loadFixture(deployContractFixtureWithUserStaked)
      await rewardToken.approve(incentivesController.address, K100_TOKENS)
      await nftContract.connect(user).approve(incentivesController.address, 0)
      await incentivesController.connect(user).stakeNFT(0)
      await nftContract.connect(user2).approve(incentivesController.address, 1)
      await incentivesController.connect(user2).stakeNFT(1)
      await incentivesController
        .connect(user2)
        .deposit(K1_TOKENS, user2.address)
      await incentivesController.notifyReward(
        [rewardToken.address],
        [K1_TOKENS],
        ONE_DAY * 45
      )
      const currentTimestmap = BigNumber.from(
        (await ethers.provider.getBlock('latest')).timestamp
      )
      await ethers.provider.send('evm_setNextBlockTimestamp', [
        currentTimestmap.add(BigNumber.from(45).mul('86400')).toNumber(),
      ])
      expect(await rewardToken.balanceOf(user.address)).to.be.eq(0)
      expect(await rewardToken.balanceOf(user2.address)).to.be.eq(0)
      await incentivesController.connect(user).getReward([rewardToken.address])
      await incentivesController.connect(user2).getReward([rewardToken.address])
      expect(await rewardToken.balanceOf(user.address)).to.be.gte(
        K1_TOKENS.div(2).sub(1)
      )
      expect(await rewardToken.balanceOf(user2.address)).to.be.gte(
        K1_TOKENS.div(2).sub(1)
      )
    })

    it('Should distribute properly when both users have NFTs staked and one unstakes NFT', async () => {
      const { incentivesController, user, user2, rewardToken, nftContract } =
        await loadFixture(deployContractFixtureWithUserStaked)
      await rewardToken.approve(incentivesController.address, K100_TOKENS)
      await nftContract.connect(user).approve(incentivesController.address, 0)
      await incentivesController.connect(user).stakeNFT(0)
      await nftContract.connect(user2).approve(incentivesController.address, 1)
      await incentivesController.connect(user2).stakeNFT(1)
      await incentivesController
        .connect(user2)
        .deposit(K1_TOKENS, user2.address)
      await incentivesController.notifyReward(
        [rewardToken.address],
        [K1_TOKENS],
        ONE_DAY * 45
      )
      const currentTimestmap = BigNumber.from(
        (await ethers.provider.getBlock('latest')).timestamp
      )
      await ethers.provider.send('evm_setNextBlockTimestamp', [
        currentTimestmap.add(BigNumber.from(15).mul('86400')).toNumber(),
      ])
      expect(await rewardToken.balanceOf(user2.address)).to.be.eq(0)
      await incentivesController.connect(user2).unstakeNFT()
      await ethers.provider.send('evm_setNextBlockTimestamp', [
        currentTimestmap.add(BigNumber.from(45).mul('86400')).toNumber(),
      ])
      expect(await rewardToken.balanceOf(user2.address)).to.be.gte(
        K1_TOKENS.div(6).sub(1)
      )
      expect(await rewardToken.balanceOf(user.address)).to.be.eq(0)
      await incentivesController.connect(user).getReward([rewardToken.address])
      await incentivesController.connect(user2).getReward([rewardToken.address])
      expect(
        await rewardToken.balanceOf(incentivesController.address)
      ).to.be.lte(10)
      expect(await rewardToken.balanceOf(user.address)).to.be.gte(
        K1_TOKENS.mul(5).div(9).sub(1)
      )
      expect(await rewardToken.balanceOf(user2.address)).to.be.gte(
        K1_TOKENS.mul(1).div(9).add(K1_TOKENS.div(6)).sub(1)
      )
    })

    it('Should distribute properly when both users have NFTs staked notifyRewards changes distribution', async () => {
      const { incentivesController, user, user2, rewardToken, nftContract } =
        await loadFixture(deployContractFixtureWithUserStaked)
      await rewardToken.approve(incentivesController.address, K100_TOKENS)
      await nftContract.connect(user).approve(incentivesController.address, 0)
      await incentivesController.connect(user).stakeNFT(0)
      await nftContract.connect(user2).approve(incentivesController.address, 1)
      await incentivesController.connect(user2).stakeNFT(1)
      await incentivesController
        .connect(user2)
        .deposit(K1_TOKENS, user2.address)
      await incentivesController.notifyReward(
        [rewardToken.address],
        [K1_TOKENS],
        ONE_DAY * 45
      )
      const currentTimestmap = BigNumber.from(
        (await ethers.provider.getBlock('latest')).timestamp
      )
      await ethers.provider.send('evm_setNextBlockTimestamp', [
        currentTimestmap.add(BigNumber.from(15).mul('86400')).toNumber(),
      ])
      await incentivesController.notifyReward(
        [rewardToken.address],
        [K1_TOKENS],
        ONE_DAY * 45
      )
      expect(await rewardToken.balanceOf(user2.address)).to.be.eq(0)
      expect(await rewardToken.balanceOf(user.address)).to.be.eq(0)
      await ethers.provider.send('evm_setNextBlockTimestamp', [
        currentTimestmap.add(BigNumber.from(30).mul('86400')).toNumber(),
      ])
      await incentivesController.connect(user).getReward([rewardToken.address])
      expect(await rewardToken.balanceOf(user.address)).to.be.gte(
        K1_TOKENS.mul(5).div(18).add(K1_TOKENS.div(6)).sub(1)
      )
      await ethers.provider.send('evm_setNextBlockTimestamp', [
        currentTimestmap.add(BigNumber.from(60).mul('86400')).toNumber(),
      ])
      await incentivesController.connect(user2).getReward([rewardToken.address])
      expect(await rewardToken.balanceOf(user2.address)).to.be.gte(
        K1_TOKENS.sub(1)
      )
      await incentivesController.connect(user).getReward([rewardToken.address])
      expect(await rewardToken.balanceOf(user.address)).to.be.gte(
        K1_TOKENS.sub(1)
      )
    })

    it('Should distribute properly when notify rewards is called after period', async () => {
      const { incentivesController, user, user2, rewardToken, nftContract } =
        await loadFixture(deployContractFixtureWithUserStaked)
      await rewardToken.approve(incentivesController.address, K100_TOKENS)
      await nftContract.connect(user).approve(incentivesController.address, 0)
      await incentivesController.connect(user).stakeNFT(0)
      await nftContract.connect(user2).approve(incentivesController.address, 1)
      await incentivesController.connect(user2).stakeNFT(1)
      await incentivesController
        .connect(user2)
        .deposit(K1_TOKENS, user2.address)
      await incentivesController.notifyReward(
        [rewardToken.address],
        [K1_TOKENS],
        ONE_DAY * 45
      )
      const currentTimestmap = BigNumber.from(
        (await ethers.provider.getBlock('latest')).timestamp
      )
      await ethers.provider.send('evm_setNextBlockTimestamp', [
        currentTimestmap.add(BigNumber.from(45).mul('86400')).toNumber(),
      ])
      await incentivesController.connect(user2).getReward([rewardToken.address])
      await incentivesController.notifyReward(
        [rewardToken.address],
        [K1_TOKENS],
        ONE_DAY * 45
      )
      expect(await rewardToken.balanceOf(user2.address)).to.be.eq(
        K1_TOKENS.div(2).sub(1)
      )
      expect(await rewardToken.balanceOf(user.address)).to.be.eq(0)
      await ethers.provider.send('evm_setNextBlockTimestamp', [
        currentTimestmap.add(BigNumber.from(100).mul('86400')).toNumber(),
      ])
      await incentivesController.connect(user).getReward([rewardToken.address])
      await incentivesController.connect(user2).getReward([rewardToken.address])
      await incentivesController.connect(user2).getReward([rewardToken.address])
      expect(await rewardToken.balanceOf(user2.address)).to.be.gte(
        K1_TOKENS.sub(2)
      )
      await incentivesController.connect(user).getReward([rewardToken.address])
      expect(await rewardToken.balanceOf(user.address)).to.be.gte(
        K1_TOKENS.sub(2)
      )
    })

    // distribute without stakers
    it('Should distribute into the void if no one is staked', async () => {
      const { incentivesController, user, user2, rewardToken, nftContract } =
        await loadFixture(deployContractFixture)
      await rewardToken.approve(incentivesController.address, K100_TOKENS)
      await incentivesController.notifyReward(
        [rewardToken.address],
        [K1_TOKENS],
        ONE_DAY * 45
      )
      const currentTimestmap = BigNumber.from(
        (await ethers.provider.getBlock('latest')).timestamp
      )
      await ethers.provider.send('evm_setNextBlockTimestamp', [
        currentTimestmap.add(BigNumber.from(15).mul('86400')).toNumber(),
      ])
      await incentivesController
        .connect(user2)
        .deposit(K1_TOKENS, user2.address)
      expect(await rewardToken.balanceOf(user2.address)).to.be.eq(0)
      // expect(await rewardToken.balanceOf(user.address)).to.be.eq(0);
      await ethers.provider.send('evm_setNextBlockTimestamp', [
        currentTimestmap.add(BigNumber.from(45).mul('86400')).toNumber(),
      ])
      await incentivesController.connect(user2).getReward([rewardToken.address])
      expect(await rewardToken.balanceOf(user2.address)).to.be.gte(
        K1_TOKENS.mul(2).div(3)
      )
    })
  })
})
