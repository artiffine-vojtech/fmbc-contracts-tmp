import { ethers } from 'hardhat'
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { expect } from 'chai'
import { parseEther } from 'ethers/lib/utils'
import itParam from 'mocha-param'

import {
  FomoBullClubNFT__factory,
  bin,
} from '../../hardhat-types/src/factories/contracts'
import { BigNumber } from 'ethers'
import { TokenEmissionsController__factory, TokenProxy__factory } from '../../hardhat-types/src'
const { FMBCTokenERC20__factory } = bin

const K100_TOKENS = parseEther(`${100_000}`)
const K1_TOKENS = parseEther(`${1_000}`)
const ONE_DAY = 24 * 60 * 60

describe('TokenEmissionsController', function () {
  async function deployContractFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, user, user2, user3, withdrawingAdmin] = await ethers.getSigners()

    // deploy the ERC20 contract
    const erc20ContractFactory = new FMBCTokenERC20__factory(owner)
    const realToken = await erc20ContractFactory.deploy(
      parseEther(`${100_000_000_000}`)
    )
    await realToken.deployed()

    const proxyFactory = new TokenProxy__factory(owner)
    const stakingToken = await proxyFactory.deploy("PROXY NAME", "PROXY SYMBOL", realToken.address)
    await stakingToken.deployed()

    const rewardToken = await erc20ContractFactory.deploy(
      parseEther(`${100_000_000_000}`)
    )
    await rewardToken.deployed()

    const rewardToken2 = await erc20ContractFactory.deploy(
      parseEther(`${100_000_000_000}`)
    )
    await rewardToken2.deployed()

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
    const incentivesConttrollerFactory = new TokenEmissionsController__factory(
      owner
    )
    const incentivesController = await incentivesConttrollerFactory.deploy(
      stakingToken.address,
      nftContract.address,
      rewardToken.address,
      stakingToken.address
    )
    await incentivesController.deployed()

    // await incentivesController.set
    await stakingToken.setController(incentivesController.address)
    await rewardToken.approve(incentivesController.address, K100_TOKENS.add(K100_TOKENS))
    await rewardToken2.approve(incentivesController.address, K100_TOKENS.add(K100_TOKENS))

    const ownerBalance = await realToken.balanceOf(owner.address)
    console.log('owner balance before transfer', ownerBalance.toString())

    // transfer 100k FMBC to user
    const res = await realToken
      .connect(owner)
      .transfer(user.address, K100_TOKENS)
    await res.wait()

    // transfer 100k FMBC to user2
    const res2 = await realToken
      .connect(owner)
      .transfer(user2.address, K100_TOKENS)
    await res2.wait()

    // Approve 100k FMBC to user2
    const res3 = await realToken
      .connect(user)
      .approve(stakingToken.address, K100_TOKENS)
    await res3.wait()

    // Approve 100k FMBC to user2
    const res4 = await realToken
      .connect(user2)
      .approve(stakingToken.address, K100_TOKENS)
    await res4.wait()

    const ownerBalanceAfter = await realToken.balanceOf(owner.address)
    console.log('owner balance after transfer', ownerBalanceAfter.toString())

    await nftContract.connect(owner).freeMint([1, 1, 1, 1, 1], user.address)
    await nftContract.connect(owner).freeMint([1, 1, 1, 1, 1], user2.address)

    return {
      // contracts
      realToken,
      stakingToken,
      nftContract,
      incentivesController,
      rewardToken,
      rewardToken2,
      // accounts
      owner,
      user,
      user2,
      user3,
      withdrawingAdmin,
    }
  }

  async function deployContractFixtureWithEmissionsStarted() {
    const {
      realToken,
      stakingToken,
      nftContract,
      incentivesController,
      rewardToken,
      rewardToken2,
      // accounts
      owner,
      user,
      user2,
      user3,
      withdrawingAdmin
    } = await loadFixture(deployContractFixture)
    const emission0 = {
      duration: 45 * ONE_DAY,
      amount: K1_TOKENS.mul(4),
    }
    const emission1 = {
      duration: 45 * ONE_DAY,
      amount: K1_TOKENS.mul(2),
    }
    const emission2 = {
      duration: 45 * ONE_DAY,
      amount: K1_TOKENS,
    }
    const emission3 = {
      duration: 90 * ONE_DAY,
      amount: K1_TOKENS,
    }
    await incentivesController.startEmissions([emission0, emission1, emission2, emission3])
    return {
      realToken,
      stakingToken,
      nftContract,
      incentivesController,
      rewardToken,
      rewardToken2,
      emission0,
      emission1,
      // accounts
      owner,
      user,
      user2,
      user3,
      withdrawingAdmin
    }
  }

  async function deployContractFixtureWithUserStakedFor60Days() {
    const {
      realToken,
      stakingToken,
      nftContract,
      incentivesController,
      rewardToken,
      rewardToken2,
      // accounts
      owner,
      user,
      user2,
      user3,
    } = await loadFixture(deployContractFixtureWithEmissionsStarted)
    const currentTimestmap = await incentivesController.emissionsStart()
    await ethers.provider.send('evm_setNextBlockTimestamp', [
      currentTimestmap.toNumber(),
    ])
    await stakingToken.connect(user).deposit(K1_TOKENS, 0)
    return {
      realToken,
      stakingToken,
      nftContract,
      incentivesController,
      rewardToken,
      rewardToken2,
      // accounts
      owner,
      user,
      user2,
      user3,
    }
  }

  async function deployContractFixtureWithUserStakedFor60DaysAfter60Days() {
    const {
      realToken,
      stakingToken,
      nftContract,
      incentivesController,
      rewardToken,
      // accounts
      owner,
      user,
      user2,
      user3,
      withdrawingAdmin
    } = await loadFixture(deployContractFixtureWithEmissionsStarted)
    await stakingToken.connect(user).deposit(K1_TOKENS, 0)
    const currentTimestmap = BigNumber.from(
      (await ethers.provider.getBlock('latest')).timestamp
    )
    await ethers.provider.send('evm_setNextBlockTimestamp', [
      currentTimestmap.add(BigNumber.from(60).mul('86400')).toNumber(),
    ])
    return {
      realToken,
      stakingToken,
      nftContract,
      incentivesController,
      rewardToken,
      // accounts
      owner,
      user,
      user2,
      user3,
      withdrawingAdmin
    }
  }

  async function deployContractFixtureWithUserStakedFor90Days() {
    const {
      realToken,
      stakingToken,
      nftContract,
      incentivesController,
      rewardToken,
      // accounts
      owner,
      user,
      user2,
      user3,
    } = await loadFixture(deployContractFixtureWithEmissionsStarted)
    await stakingToken.connect(user).deposit(K1_TOKENS, 1)
    return {
      realToken,
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

  async function deployContractFixtureWithUserStakedFor90DaysAfter90Days() {
    const {
      realToken,
      stakingToken,
      nftContract,
      incentivesController,
      rewardToken,
      // accounts
      owner,
      user,
      user2,
      user3,
    } = await loadFixture(deployContractFixtureWithEmissionsStarted)
    await stakingToken.connect(user).deposit(K1_TOKENS, 1)
    const currentTimestmap = BigNumber.from(
      (await ethers.provider.getBlock('latest')).timestamp
    )
    await ethers.provider.send('evm_setNextBlockTimestamp', [
      currentTimestmap.add(BigNumber.from(90).mul('86400')).toNumber(),
    ])
    return {
      realToken,
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

  async function deployContractFixtureWithUserStakedFor120Days() {
    const {
      realToken,
      stakingToken,
      nftContract,
      incentivesController,
      rewardToken,
      // accounts
      owner,
      user,
      user2,
      user3,
    } = await loadFixture(deployContractFixtureWithEmissionsStarted)
    await stakingToken.connect(user).deposit(K1_TOKENS, 2)
    return {
      realToken,
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

  async function deployContractFixtureWithUserStakedFor120DaysAfter120Days() {
    const {
      realToken,
      stakingToken,
      nftContract,
      incentivesController,
      rewardToken,
      // accounts
      owner,
      user,
      user2,
      user3,
    } = await loadFixture(deployContractFixtureWithEmissionsStarted)
    await stakingToken.connect(user).deposit(K1_TOKENS, 2)
    const currentTimestmap = BigNumber.from(
      (await ethers.provider.getBlock('latest')).timestamp
    )
    await ethers.provider.send('evm_setNextBlockTimestamp', [
      currentTimestmap.add(BigNumber.from(120).mul('86400')).toNumber(),
    ])
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
      const { incentivesController, stakingToken } = await loadFixture(deployContractFixture)
      const tokenAddress: string = await incentivesController.stakingToken()
      expect(stakingToken.address).to.be.eq(tokenAddress)
    })
    it('Should be the right set booster nft', async () => {
      const { incentivesController, nftContract } = await loadFixture(deployContractFixture)
      const boosterNftAddress: string = await incentivesController.boosterNFT()
      expect(nftContract.address).to.be.eq(boosterNftAddress)
    })

    it("Should have the right reward token", async function () {
      const { incentivesController, rewardToken } = await loadFixture(deployContractFixture)
      expect(await incentivesController.rewardTokens(0)).to.equal(rewardToken.address);
    });

    it("Should have the right withdrawing admin", async function () {
      const { incentivesController, stakingToken } = await loadFixture(deployContractFixture)
      expect(await incentivesController.withdrawingAdmin()).to.equal(stakingToken.address);
    });
  })

  describe("startEmissions", function () {
    it("Should revert if an emission has already started", async function () {
      const { incentivesController } = await loadFixture(deployContractFixture)
      const emissions = [
        { duration: ONE_DAY * 90, amount: 100 },
      ];

      // Try to call the startEmissions function with invalid parameters.
      await expect(incentivesController.startEmissions(emissions)).not.to.be.reverted;
      await expect(incentivesController.startEmissions(emissions)).to.be.revertedWith("Emissions already started");
    });

    it("Should revert if an emission has invalid parameters", async function () {
      const { incentivesController } = await loadFixture(
        deployContractFixture
      )
      const emissions = [
        { duration: 0, amount: 100 },
      ];

      // Try to call the startEmissions function with invalid parameters.
      await expect(incentivesController.startEmissions(emissions)).to.be.revertedWith("Invalid emission");
    });

    it("Should revert if there are no emissions", async function () {
      const { incentivesController } = await loadFixture(
        deployContractFixture
      )
      const emissions: any[] = [];

      // Try to call the startEmissions function with invalid parameters.
      await expect(incentivesController.startEmissions(emissions)).to.be.revertedWith("No emissions");
    });

    it("Should start emissions with the correct parameters", async function () {
      const { incentivesController, rewardToken } = await loadFixture(
        deployContractFixture
      )
      const emissions = [
        { duration: 1000, amount: 100 },
        { duration: 2000, amount: 200 },
      ];
      const totalAmount = emissions.reduce((sum, emission) => sum + emission.amount, 0);

      // Transfer reward tokens to the contract.
      await rewardToken.transfer(incentivesController.address, totalAmount);

      // Call the startEmissions function.
      await incentivesController.startEmissions(emissions);
      const latestBlock = await ethers.provider.getBlock('latest');

      // Check that the emissions were started correctly.
      expect((await incentivesController.emissions(0)).duration).to.equal(emissions[0].duration);
      expect((await incentivesController.emissions(0)).amount).to.equal(emissions[0].amount);
      expect((await incentivesController.emissions(1)).duration).to.equal(emissions[1].duration);
      expect((await incentivesController.emissions(1)).amount).to.equal(emissions[1].amount);
      expect(await incentivesController.emissionsStart()).to.equal(latestBlock.timestamp);
      expect(await incentivesController.currentEmissionsIndex()).to.equal(0);
      expect(await incentivesController.rewardsDuration()).to.equal(emissions[0].duration);
      expect((await incentivesController.rewardData(rewardToken.address)).balance).to.equal(emissions[0].amount);
    });
  });

  describe('Deposit (Proxy)', () => {
    it('Should revert on amount zero', async () => {
      const { stakingToken, user } = await loadFixture(
        deployContractFixtureWithEmissionsStarted
      )
      let action = stakingToken.connect(user).deposit(0, 0)
      await expect(action).to.be.revertedWith('Amount is zero')
    })

    it('Should set up lock time correctly', async () => {
      const { incentivesController, stakingToken, user } = await loadFixture(
        deployContractFixtureWithEmissionsStarted
      )
      await stakingToken.connect(user).deposit(K1_TOKENS, 1)
      var latestBlock = await ethers.provider.getBlock('latest')
      expect(await incentivesController.userLockTime(user.address)).to.be.eq(latestBlock.timestamp + ONE_DAY * 90)

      await stakingToken.connect(user).deposit(K1_TOKENS, 0)
      latestBlock = await ethers.provider.getBlock('latest')
      expect(await incentivesController.userLockTime(user.address)).to.be.eq(latestBlock.timestamp + ONE_DAY * 60)

      await stakingToken.connect(user).deposit(K1_TOKENS, 2)
      latestBlock = await ethers.provider.getBlock('latest')
      expect(await incentivesController.userLockTime(user.address)).to.be.eq(latestBlock.timestamp + ONE_DAY * 120)
    })

    it('Should transfer correct amount', async () => {
      const { realToken, user, incentivesController, stakingToken } = await loadFixture(
        deployContractFixtureWithEmissionsStarted
      )
      let balanceBefore = await realToken.balanceOf(user.address)
      await stakingToken.connect(user).deposit(K1_TOKENS, 0)
      expect(await realToken.balanceOf(user.address)).to.be.eq(
        balanceBefore.sub(K1_TOKENS)
      )
      expect(await realToken.balanceOf(stakingToken.address)).to.be.eq(
        K1_TOKENS
      )
      expect(await stakingToken.balanceOf(incentivesController.address)).to.be.eq(
        K1_TOKENS
      )
    })

    it('Should set balances correctly for 60 day lock', async () => {
      const { incentivesController, user, stakingToken } = await loadFixture(
        deployContractFixtureWithEmissionsStarted
      )
      await stakingToken.connect(user).deposit(K1_TOKENS, 0)
      let balance = await incentivesController.balances(user.address)
      expect(balance.boosted).to.be.false
      expect(balance.staked).to.be.eq(K1_TOKENS)
      expect(balance.scaled).to.be.eq(K1_TOKENS)
      expect(balance.lockScaled).to.be.eq(K1_TOKENS)
      expect(balance.lockBoost).to.be.eq(10)
      expect(await incentivesController.totalScaled()).to.be.eq(K1_TOKENS)
    })

    it('Should set balances correctly for 90 day lock', async () => {
      const { incentivesController, user, stakingToken } = await loadFixture(
        deployContractFixtureWithEmissionsStarted
      )
      await stakingToken.connect(user).deposit(K1_TOKENS, 1)
      let balance = await incentivesController.balances(user.address)
      expect(balance.boosted).to.be.false
      expect(balance.staked).to.be.eq(K1_TOKENS)
      expect(balance.scaled).to.be.eq(K1_TOKENS.mul(15).div(10))
      expect(balance.lockScaled).to.be.eq(K1_TOKENS.mul(15).div(10))
      expect(balance.lockBoost).to.be.eq(15)
      expect(await incentivesController.totalScaled()).to.be.eq(K1_TOKENS.mul(15).div(10))
    })

    it('Should set balances correctly for 120 day lock', async () => {
      const { incentivesController, user, stakingToken } = await loadFixture(
        deployContractFixtureWithEmissionsStarted
      )
      await stakingToken.connect(user).deposit(K1_TOKENS, 2)
      let balance = await incentivesController.balances(user.address)
      expect(balance.boosted).to.be.false
      expect(balance.staked).to.be.eq(K1_TOKENS)
      expect(balance.scaled).to.be.eq(K1_TOKENS.mul(2))
      expect(balance.lockScaled).to.be.eq(K1_TOKENS.mul(2))
      expect(balance.lockBoost).to.be.eq(20)
      expect(await incentivesController.totalScaled()).to.be.eq(K1_TOKENS.mul(2))
    })

    it('Should set balances correctly for consecutive lock', async () => {
      const { incentivesController, stakingToken, user } = await loadFixture(
        deployContractFixtureWithEmissionsStarted
      )
      await stakingToken.connect(user).deposit(K1_TOKENS, 2)
      await stakingToken.connect(user).deposit(K1_TOKENS, 1)
      let balance = await incentivesController.balances(user.address)
      expect(balance.boosted).to.be.false
      expect(balance.staked).to.be.eq(K1_TOKENS.mul(2))
      expect(balance.scaled).to.be.eq(K1_TOKENS.mul(3))
      expect(balance.lockScaled).to.be.eq(K1_TOKENS.mul(3))
      expect(balance.lockBoost).to.be.eq(15)
      expect(await incentivesController.totalScaled()).to.be.eq(K1_TOKENS.mul(3))
    })

    it('Should emit Deposited event with _amount == scaled', async () => {
      const { incentivesController, user, stakingToken } = await loadFixture(
        deployContractFixtureWithEmissionsStarted
      )
      var action = stakingToken
        .connect(user)
        .deposit(K1_TOKENS, 0)
      await expect(action)
        .to.emit(incentivesController, 'Deposited')
        .withArgs(user.address, K1_TOKENS, K1_TOKENS)

      var action = stakingToken
        .connect(user)
        .deposit(K1_TOKENS, 1)
      await expect(action)
        .to.emit(incentivesController, 'Deposited')
        .withArgs(user.address, K1_TOKENS, K1_TOKENS.mul(3))

      var action = stakingToken
        .connect(user)
        .deposit(K1_TOKENS, 2)
      await expect(action)
        .to.emit(incentivesController, 'Deposited')
        .withArgs(user.address, K1_TOKENS, K1_TOKENS.mul(6))
    })

    // TODO add all NFT cases
    describe('After staked NFT', async () => {
      it('Should set balances correctly for 60 day lock', async () => {
        const { incentivesController, user, nftContract, stakingToken } = await loadFixture(
          deployContractFixtureWithEmissionsStarted
        )
        await nftContract.connect(user).approve(incentivesController.address, 0)
        await incentivesController.connect(user).stakeNFT(0)
        await stakingToken
          .connect(user)
          .deposit(K1_TOKENS, 0)
        let balance = await incentivesController.balances(user.address)
        expect(balance.boosted).to.be.true
        expect(balance.staked).to.be.eq(K1_TOKENS)
        expect(balance.scaled).to.be.eq(K1_TOKENS.mul(15).div(10))
        expect(balance.lockScaled).to.be.eq(K1_TOKENS)
        expect(balance.lockBoost).to.be.eq(10)
        expect(await incentivesController.totalScaled()).to.be.eq(
          K1_TOKENS.mul(15).div(10)
        )
      })

      it('Should set balances correctly for 90 day lock', async () => {
        const { incentivesController, user, nftContract, stakingToken } = await loadFixture(
          deployContractFixtureWithEmissionsStarted
        )
        await nftContract.connect(user).approve(incentivesController.address, 0)
        await incentivesController.connect(user).stakeNFT(0)
        await stakingToken
          .connect(user)
          .deposit(K1_TOKENS, 1)
        let balance = await incentivesController.balances(user.address)
        expect(balance.boosted).to.be.true
        expect(balance.staked).to.be.eq(K1_TOKENS)
        expect(balance.lockScaled).to.be.eq(K1_TOKENS.mul(15).div(10))
        expect(balance.scaled).to.be.eq(K1_TOKENS.mul(15).div(10).mul(15).div(10))
        expect(balance.lockBoost).to.be.eq(15)
        expect(await incentivesController.totalScaled()).to.be.eq(
          K1_TOKENS.mul(15).div(10).mul(15).div(10)
        )
      })

      it('Should set balances correctly for 120 day lock', async () => {
        const { incentivesController, user, nftContract, stakingToken } = await loadFixture(
          deployContractFixtureWithEmissionsStarted
        )
        await nftContract.connect(user).approve(incentivesController.address, 0)
        await incentivesController.connect(user).stakeNFT(0)
        await stakingToken
          .connect(user)
          .deposit(K1_TOKENS, 2)
        let balance = await incentivesController.balances(user.address)
        expect(balance.boosted).to.be.true
        expect(balance.staked).to.be.eq(K1_TOKENS)
        expect(balance.lockScaled).to.be.eq(K1_TOKENS.mul(2))
        expect(balance.scaled).to.be.eq(K1_TOKENS.mul(2).mul(15).div(10))
        expect(balance.lockBoost).to.be.eq(20)
        expect(await incentivesController.totalScaled()).to.be.eq(
          K1_TOKENS.mul(2).mul(15).div(10)
        )
      })

      it('Should set balances correctly for consecutive lock', async () => {
        const { incentivesController, user, nftContract, stakingToken } = await loadFixture(
          deployContractFixtureWithEmissionsStarted
        )
        await nftContract.connect(user).approve(incentivesController.address, 0)
        await incentivesController.connect(user).stakeNFT(0)
        await stakingToken.connect(user).deposit(K1_TOKENS, 2)
        await stakingToken.connect(user).deposit(K1_TOKENS, 1)
        let balance = await incentivesController.balances(user.address)
        expect(balance.boosted).to.be.true
        expect(balance.staked).to.be.eq(K1_TOKENS.mul(2))
        expect(balance.scaled).to.be.eq(K1_TOKENS.mul(45).div(10))
        expect(balance.lockScaled).to.be.eq(K1_TOKENS.mul(3))
        expect(balance.lockBoost).to.be.eq(15)
        expect(await incentivesController.totalScaled()).to.be.eq(K1_TOKENS.mul(45).div(10))
      })

      it('Should emit Deposited events correctly', async () => {
        const { incentivesController, user, nftContract, stakingToken } = await loadFixture(
          deployContractFixtureWithEmissionsStarted
        )
        await nftContract.connect(user).approve(incentivesController.address, 0)
        await incentivesController.connect(user).stakeNFT(0)
        var action = stakingToken
          .connect(user)
          .deposit(K1_TOKENS, 0)
        await expect(action)
          .to.emit(incentivesController, 'Deposited')
          .withArgs(user.address, K1_TOKENS, K1_TOKENS.mul(15).div(10))

        var action = stakingToken
          .connect(user)
          .deposit(K1_TOKENS, 1)
        await expect(action)
          .to.emit(incentivesController, 'Deposited')
          .withArgs(user.address, K1_TOKENS, K1_TOKENS.mul(30).div(10).mul(15).div(10))

        var action = stakingToken
          .connect(user)
          .deposit(K1_TOKENS, 2)
        await expect(action)
          .to.emit(incentivesController, 'Deposited')
          .withArgs(user.address, K1_TOKENS, K1_TOKENS.mul(6).mul(15).div(10))
      })
    })
  })

  describe('Withdraw (Proxy)', () => {
    it('Should revert withdrawing different user stake if no withdrawing admin', async () => {
      const { incentivesController, user, user2 } = await loadFixture(
        deployContractFixtureWithUserStakedFor60Days
      )
      let action = incentivesController.connect(user).withdraw(K1_TOKENS.add(1), user2.address)
      await expect(action).to.be.revertedWith('Not withdrawing admin')
    })

    it('Should revert before lock time', async () => {
      const { incentivesController, user, stakingToken } = await loadFixture(
        deployContractFixtureWithUserStakedFor60Days
      )
      await ethers.provider.send('evm_setNextBlockTimestamp', [
        (await incentivesController.userLockTime(user.address)).sub(1).toNumber(),
      ])
      let action = stakingToken.connect(user).withdraw(K1_TOKENS.add(1))
      await expect(action).to.be.revertedWith('Locked')
    })

    it('Should revert on amount greater than staked', async () => {
      const { incentivesController, user, stakingToken } = await loadFixture(
        deployContractFixtureWithUserStakedFor60DaysAfter60Days
      )
      let action = stakingToken.connect(user).withdraw(K1_TOKENS.add(1))
      await expect(action).to.be.revertedWith('Amount greater than staked')
    })

    it('Should transfer correct amount', async () => {
      const { incentivesController, user, realToken, stakingToken } = await loadFixture(
        deployContractFixtureWithUserStakedFor60DaysAfter60Days
      )
      let balanceBefore = await realToken.balanceOf(user.address)
      let controllerBalanceBefore = await stakingToken.balanceOf(incentivesController.address)
      await stakingToken.connect(user).withdraw(K1_TOKENS.div(2))
      expect(await realToken.balanceOf(user.address)).to.be.eq(
        balanceBefore.add(K1_TOKENS.div(2))
      )
      expect(await realToken.balanceOf(stakingToken.address)).to.be.eq(
        K1_TOKENS.div(2)
      )
      expect(await stakingToken.balanceOf(incentivesController.address)).to.be.eq(
        controllerBalanceBefore.sub(K1_TOKENS.div(2))
      )
      expect(await stakingToken.totalSupply()).to.be.eq(
        K1_TOKENS.div(2)
      )
    })

    it('Should transfer correct  triggered by withdrawing admin', async () => {
      const { incentivesController, user, stakingToken, realToken } = await loadFixture(
        deployContractFixtureWithUserStakedFor60DaysAfter60Days
      )
      let balanceBefore = await stakingToken.balanceOf(user.address)
      let admiBbalanceBefore = await realToken.balanceOf(stakingToken.address)
      let controllerBalanceBefore = await stakingToken.balanceOf(incentivesController.address)
      await stakingToken.connect(user).withdraw(K1_TOKENS.div(2))
      expect(await stakingToken.balanceOf(user.address)).to.be.eq(balanceBefore)
      expect(await realToken.balanceOf(stakingToken.address)).to.be.eq(admiBbalanceBefore.sub(K1_TOKENS.div(2)))
      expect(await stakingToken.balanceOf(incentivesController.address)).to.be.eq(
        controllerBalanceBefore.sub(K1_TOKENS.div(2))
      )
    })

    it('Should set balances correctly triggered by withdrawing admin', async () => {
      const { incentivesController, user, stakingToken } = await loadFixture(
        deployContractFixtureWithUserStakedFor60DaysAfter60Days
      )
      await stakingToken.connect(user).withdraw(K1_TOKENS.div(2))
      let balance = await incentivesController.balances(user.address)
      expect(balance.boosted).to.be.false
      expect(balance.staked).to.be.eq(K1_TOKENS.div(2))
      expect(balance.scaled).to.be.eq(K1_TOKENS.div(2))
      expect(balance.lockScaled).to.be.eq(K1_TOKENS.div(2))
      expect(balance.lockBoost).to.be.eq(10)
      expect(await incentivesController.totalScaled()).to.be.eq(
        K1_TOKENS.div(2)
      )
    })

    it('Should set balances correctly withdrawing all', async () => {
      const { incentivesController, user, stakingToken, realToken } = await loadFixture(
        deployContractFixtureWithUserStakedFor60DaysAfter60Days
      )
      let balanceBefore = await realToken.balanceOf(user.address)
      let controllerBalanceBefore = await stakingToken.balanceOf(incentivesController.address)
      await stakingToken.connect(user).withdraw(K1_TOKENS)
      let balance = await incentivesController.balances(user.address)
      expect(balance.boosted).to.be.false
      expect(balance.staked).to.be.eq(0)
      expect(balance.scaled).to.be.eq(0)
      expect(balance.lockScaled).to.be.eq(0)
      expect(balance.lockBoost).to.be.eq(0)
      expect(await incentivesController.totalScaled()).to.be.eq(
        0
      )
      expect(await realToken.balanceOf(user.address)).to.be.eq(
        balanceBefore.add(K1_TOKENS)
      )
      expect(await stakingToken.balanceOf(incentivesController.address)).to.be.eq(
        controllerBalanceBefore.sub(K1_TOKENS)
      )
    })

    it('Should set balances correctly for 60 days lock', async () => {
      const { incentivesController, user, stakingToken } = await loadFixture(
        deployContractFixtureWithUserStakedFor60DaysAfter60Days
      )
      await stakingToken.connect(user).withdraw(K1_TOKENS.div(2))
      let balance = await incentivesController.balances(user.address)
      expect(balance.boosted).to.be.false
      expect(balance.staked).to.be.eq(K1_TOKENS.div(2))
      expect(balance.scaled).to.be.eq(K1_TOKENS.div(2))
      expect(balance.lockScaled).to.be.eq(K1_TOKENS.div(2))
      expect(balance.lockBoost).to.be.eq(10)
      expect(await incentivesController.totalScaled()).to.be.eq(
        K1_TOKENS.div(2)
      )
    })

    it('Should set balances correctly for 90 days lock', async () => {
      const { incentivesController, user, stakingToken } = await loadFixture(
        deployContractFixtureWithUserStakedFor90DaysAfter90Days
      )
      await stakingToken.connect(user).withdraw(K1_TOKENS.div(2))
      let balance = await incentivesController.balances(user.address)
      expect(balance.boosted).to.be.false
      expect(balance.staked).to.be.eq(K1_TOKENS.div(2))
      expect(balance.scaled).to.be.eq(K1_TOKENS.mul(15).div(20))
      expect(balance.lockScaled).to.be.eq(K1_TOKENS.mul(15).div(20))
      expect(balance.lockBoost).to.be.eq(15)
      expect(await incentivesController.totalScaled()).to.be.eq(
        K1_TOKENS.mul(15).div(20)
      )
    })

    it('Should set balances correctly for 120 days lock', async () => {
      const { incentivesController, user, stakingToken } = await loadFixture(
        deployContractFixtureWithUserStakedFor120DaysAfter120Days
      )
      await stakingToken.connect(user).withdraw(K1_TOKENS.div(2))
      let balance = await incentivesController.balances(user.address)
      expect(balance.boosted).to.be.false
      expect(balance.staked).to.be.eq(K1_TOKENS.div(2))
      expect(balance.scaled).to.be.eq(K1_TOKENS)
      expect(balance.lockScaled).to.be.eq(K1_TOKENS)
      expect(balance.lockBoost).to.be.eq(20)
      expect(await incentivesController.totalScaled()).to.be.eq(
        K1_TOKENS
      )
    })

    it('Should emit Withdrawn event with _amount == scaled', async () => {
      const { incentivesController, user, stakingToken } = await loadFixture(
        deployContractFixtureWithUserStakedFor90DaysAfter90Days
      )
      var action = stakingToken.connect(user).withdraw(K1_TOKENS.div(3))
      await expect(action)
        .to.emit(incentivesController, 'Withdrawn')
        .withArgs(user.address, K1_TOKENS.div(3), K1_TOKENS.div(2).sub(1))

      action = stakingToken.connect(user).withdraw(K1_TOKENS.div(3))
      await expect(action)
        .to.emit(incentivesController, 'Withdrawn')
        .withArgs(user.address, K1_TOKENS.div(3), K1_TOKENS.div(2).sub(1))

      action = stakingToken.connect(user).withdraw(K1_TOKENS.div(3))
      await expect(action)
        .to.emit(incentivesController, 'Withdrawn')
        .withArgs(user.address, K1_TOKENS.div(3), K1_TOKENS.div(2).sub(1))
    })

    // TODO add all NFT cases
    describe('After staked NFT', async () => {
      it('Should transfer correct amount', async () => {
        const { incentivesController, user, stakingToken, nftContract, realToken } =
          await loadFixture(deployContractFixtureWithUserStakedFor60DaysAfter60Days)
        await nftContract.connect(user).approve(incentivesController.address, 0)
        await incentivesController.connect(user).stakeNFT(0)
        let balanceBefore = await realToken.balanceOf(user.address)
        await stakingToken.connect(user).withdraw(K1_TOKENS.div(2))
        expect(await realToken.balanceOf(user.address)).to.be.eq(
          balanceBefore.add(K1_TOKENS.div(2))
        )
      })

      it('Should transfer correct triggered by withdrawing admin', async () => {
        const { incentivesController, user, stakingToken, nftContract, withdrawingAdmin, realToken } = await loadFixture(
          deployContractFixtureWithUserStakedFor60DaysAfter60Days
        )
        let balanceBefore = await stakingToken.balanceOf(user.address)
        let admiBbalanceBefore = await realToken.balanceOf(stakingToken.address)
        let controllerBalanceBefore = await stakingToken.balanceOf(incentivesController.address)
        await nftContract.connect(user).approve(incentivesController.address, 0)
        await incentivesController.connect(user).stakeNFT(0)
        await stakingToken.connect(user).withdraw(K1_TOKENS.div(2))
        expect(await stakingToken.balanceOf(user.address)).to.be.eq(balanceBefore)
        expect(await realToken.balanceOf(stakingToken.address)).to.be.eq(admiBbalanceBefore.sub(K1_TOKENS.div(2)))
        expect(await stakingToken.balanceOf(incentivesController.address)).to.be.eq(
          controllerBalanceBefore.sub(K1_TOKENS.div(2))
        )
      })

      it('Should set balances correctly for 60 days lock', async () => {
        const { incentivesController, user, nftContract, stakingToken } = await loadFixture(
          deployContractFixtureWithUserStakedFor60DaysAfter60Days
        )
        await nftContract.connect(user).approve(incentivesController.address, 0)
        await incentivesController.connect(user).stakeNFT(0)
        await stakingToken.connect(user).withdraw(K1_TOKENS.div(2))
        let balance = await incentivesController.balances(user.address)
        expect(balance.boosted).to.be.true
        expect(balance.staked).to.be.eq(K1_TOKENS.div(2))
        expect(balance.scaled).to.be.eq(K1_TOKENS.mul(15).div(20))
        expect(balance.lockScaled).to.be.eq(K1_TOKENS.div(2))
        expect(balance.lockBoost).to.be.eq(10)
        expect(await incentivesController.totalScaled()).to.be.eq(
          K1_TOKENS.mul(15).div(20)
        )
      })

      it('Should set balances correctly for 90 days lock', async () => {
        const { incentivesController, user, nftContract, stakingToken } = await loadFixture(
          deployContractFixtureWithUserStakedFor90DaysAfter90Days
        )
        await nftContract.connect(user).approve(incentivesController.address, 0)
        await incentivesController.connect(user).stakeNFT(0)
        await stakingToken.connect(user).withdraw(K1_TOKENS.div(2))
        let balance = await incentivesController.balances(user.address)
        expect(balance.boosted).to.be.true
        expect(balance.staked).to.be.eq(K1_TOKENS.div(2))
        expect(balance.scaled).to.be.eq(K1_TOKENS.mul(15).div(20).mul(15).div(10))
        expect(balance.lockScaled).to.be.eq(K1_TOKENS.mul(15).div(20))
        expect(balance.lockBoost).to.be.eq(15)
        expect(await incentivesController.totalScaled()).to.be.eq(
          K1_TOKENS.mul(15).div(20).mul(15).div(10)
        )
      })

      it('Should set balances correctly for 120 days lock', async () => {
        const { incentivesController, user, nftContract, stakingToken } = await loadFixture(
          deployContractFixtureWithUserStakedFor120DaysAfter120Days
        )
        await nftContract.connect(user).approve(incentivesController.address, 0)
        await incentivesController.connect(user).stakeNFT(0)
        await stakingToken.connect(user).withdraw(K1_TOKENS.div(2))
        let balance = await incentivesController.balances(user.address)
        expect(balance.boosted).to.be.true
        expect(balance.staked).to.be.eq(K1_TOKENS.div(2))
        expect(balance.scaled).to.be.eq(K1_TOKENS.mul(15).div(10))
        expect(balance.lockScaled).to.be.eq(K1_TOKENS)
        expect(balance.lockBoost).to.be.eq(20)
        expect(await incentivesController.totalScaled()).to.be.eq(
          K1_TOKENS.mul(15).div(10)
        )
      })

      it('Should emit Withdrawn event with scaled == _amount * 5', async () => {
        const { incentivesController, user, nftContract } = await loadFixture(
          deployContractFixtureWithUserStakedFor60DaysAfter60Days
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
        deployContractFixtureWithEmissionsStarted
      )
      await nftContract.connect(user).approve(incentivesController.address, 0)
      await incentivesController.connect(user).stakeNFT(0)
      await nftContract.connect(user).approve(incentivesController.address, 100)
      let action = incentivesController.connect(user).stakeNFT(100)
      await expect(action).to.be.revertedWith('Balance already boosted')
    })

    it('Should transfer NFT correctly', async () => {
      const { incentivesController, user, nftContract } = await loadFixture(
        deployContractFixtureWithEmissionsStarted
      )
      let balanceBefore = await nftContract.balanceOf(user.address)
      expect(await nftContract.ownerOf(0)).to.be.eq(user.address)
      await nftContract.connect(user).approve(incentivesController.address, 0)
      await incentivesController.connect(user).stakeNFT(0)
      expect(await nftContract.balanceOf(user.address)).to.be.eq(
        balanceBefore.sub(1)
      )
      expect(await nftContract.ownerOf(0)).to.be.eq(
        incentivesController.address
      )
    })

    it('Should set balances correctly before depositing for id 0', async () => {
      const { incentivesController, user, nftContract } = await loadFixture(
        deployContractFixtureWithEmissionsStarted
      )
      await nftContract.connect(user).approve(incentivesController.address, 0)
      await incentivesController.connect(user).stakeNFT(0)
      let balance = await incentivesController.balances(user.address)
      expect(balance.boosted).to.be.true
      expect(balance.staked).to.be.eq(0)
      expect(balance.scaled).to.be.eq(0)
      expect(balance.nftId).to.be.eq(0)
      expect(balance.lockScaled).to.be.eq(0)
      expect(balance.lockBoost).to.be.eq(0)
      expect(await incentivesController.totalScaled()).to.be.eq(0)
    })

    it('Should set balances correctly before depositing for id 100', async () => {
      const { incentivesController, user, nftContract } = await loadFixture(
        deployContractFixtureWithEmissionsStarted
      )
      await nftContract.connect(user).approve(incentivesController.address, 100)
      await incentivesController.connect(user).stakeNFT(100)
      let balance = await incentivesController.balances(user.address)
      expect(balance.boosted).to.be.true
      expect(balance.staked).to.be.eq(0)
      expect(balance.scaled).to.be.eq(0)
      expect(balance.nftId).to.be.eq(100)
      expect(balance.lockScaled).to.be.eq(0)
      expect(balance.lockBoost).to.be.eq(0)
      expect(await incentivesController.totalScaled()).to.be.eq(0)
    })

    it('Should emit Deposited event with _amount == scaled == 0', async () => {
      const { incentivesController, user, nftContract } = await loadFixture(
        deployContractFixtureWithEmissionsStarted
      )
      await nftContract.connect(user).approve(incentivesController.address, 0)
      let action = await incentivesController.connect(user).stakeNFT(0)
      await expect(action)
        .to.emit(incentivesController, 'Deposited')
        .withArgs(user.address, 0, 0)
    })

    describe('After depositing tokens', async () => {
      it('Should set balances correctly for 60 days lock', async () => {
        const { incentivesController, user, nftContract } = await loadFixture(
          deployContractFixtureWithUserStakedFor60Days
        )
        await nftContract.connect(user).approve(incentivesController.address, 0)
        await incentivesController.connect(user).stakeNFT(0)
        let balance = await incentivesController.balances(user.address)
        expect(balance.boosted).to.be.true
        expect(balance.staked).to.be.eq(K1_TOKENS)
        expect(balance.scaled).to.be.eq(K1_TOKENS.mul(15).div(10))
        expect(balance.lockScaled).to.be.eq(K1_TOKENS)
        expect(balance.lockBoost).to.be.eq(10)
        expect(await incentivesController.totalScaled()).to.be.eq(
          K1_TOKENS.mul(15).div(10)
        )
      })

      it('Should set balances correctly for 90 days lock', async () => {
        const { incentivesController, user, nftContract } = await loadFixture(
          deployContractFixtureWithUserStakedFor90Days
        )
        await nftContract.connect(user).approve(incentivesController.address, 0)
        await incentivesController.connect(user).stakeNFT(0)
        let balance = await incentivesController.balances(user.address)
        expect(balance.boosted).to.be.true
        expect(balance.staked).to.be.eq(K1_TOKENS)
        expect(balance.scaled).to.be.eq(K1_TOKENS.mul(15).div(10).mul(15).div(10))
        expect(balance.lockScaled).to.be.eq(K1_TOKENS.mul(15).div(10))
        expect(balance.lockBoost).to.be.eq(15)
        expect(await incentivesController.totalScaled()).to.be.eq(
          K1_TOKENS.mul(15).div(10).mul(15).div(10)
        )
      })

      it('Should set balances correctly for 120 days lock', async () => {
        const { incentivesController, user, nftContract } = await loadFixture(
          deployContractFixtureWithUserStakedFor120Days
        )
        await nftContract.connect(user).approve(incentivesController.address, 0)
        await incentivesController.connect(user).stakeNFT(0)
        let balance = await incentivesController.balances(user.address)
        expect(balance.boosted).to.be.true
        expect(balance.staked).to.be.eq(K1_TOKENS)
        expect(balance.scaled).to.be.eq(K1_TOKENS.mul(2).mul(15).div(10))
        expect(balance.lockScaled).to.be.eq(K1_TOKENS.mul(2))
        expect(balance.lockBoost).to.be.eq(20)
        expect(await incentivesController.totalScaled()).to.be.eq(
          K1_TOKENS.mul(2).mul(15).div(10)
        )
      })

      it('Should emit Deposited event with _amount == 0 and scaled == _amount * 0.5', async () => {
        const { incentivesController, user, nftContract } = await loadFixture(
          deployContractFixtureWithUserStakedFor60Days
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
        deployContractFixtureWithEmissionsStarted
      )
      let action = incentivesController.connect(user).unstakeNFT()
      await expect(action).to.be.revertedWith('NFT not staked')
    })

    it('Should transfer NFT correctly id 0', async () => {
      const { incentivesController, user, nftContract } = await loadFixture(
        deployContractFixtureWithEmissionsStarted
      )
      await nftContract.connect(user).approve(incentivesController.address, 0)
      await incentivesController.connect(user).stakeNFT(0)
      let balanceBefore = await nftContract.balanceOf(user.address)
      expect(await nftContract.ownerOf(0)).to.be.eq(
        incentivesController.address
      )
      await incentivesController.connect(user).unstakeNFT()
      expect(await nftContract.balanceOf(user.address)).to.be.eq(
        balanceBefore.add(1)
      )
      expect(await nftContract.ownerOf(0)).to.be.eq(user.address)
    })

    it('Should transfer NFT correctly id 100', async () => {
      const { incentivesController, user, nftContract } = await loadFixture(
        deployContractFixtureWithEmissionsStarted
      )
      await nftContract.connect(user).approve(incentivesController.address, 100)
      await incentivesController.connect(user).stakeNFT(100)
      let balanceBefore = await nftContract.balanceOf(user.address)
      expect(await nftContract.ownerOf(100)).to.be.eq(
        incentivesController.address
      )
      await incentivesController.connect(user).unstakeNFT()
      expect(await nftContract.balanceOf(user.address)).to.be.eq(
        balanceBefore.add(1)
      )
      expect(await nftContract.ownerOf(100)).to.be.eq(user.address)
    })

    it('Should set staked and scaled balances correctly', async () => {
      const { incentivesController, user, nftContract } = await loadFixture(
        deployContractFixtureWithEmissionsStarted
      )
      await nftContract.connect(user).approve(incentivesController.address, 0)
      await incentivesController.connect(user).stakeNFT(0)
      await incentivesController.connect(user).unstakeNFT()
      let balance = await incentivesController.balances(user.address)
      expect(balance.boosted).to.be.false
      expect(balance.staked).to.be.eq(0)
      expect(balance.scaled).to.be.eq(0)
      expect(balance.lockScaled).to.be.eq(0)
      expect(balance.lockBoost).to.be.eq(0)
      expect(await incentivesController.totalScaled()).to.be.eq(0)
    })

    it('Should emit Withdrawn event with _amount == scaled', async () => {
      const { incentivesController, user, nftContract } = await loadFixture(
        deployContractFixtureWithEmissionsStarted
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
      it('Should set balances correctly for 60 days lock', async () => {
        const { incentivesController, user, nftContract } = await loadFixture(
          deployContractFixtureWithUserStakedFor60Days
        )
        await nftContract.connect(user).approve(incentivesController.address, 0)
        await incentivesController.connect(user).stakeNFT(0)
        await incentivesController.connect(user).unstakeNFT()
        let balance = await incentivesController.balances(user.address)
        expect(balance.boosted).to.be.false
        expect(balance.staked).to.be.eq(K1_TOKENS)
        expect(balance.scaled).to.be.eq(K1_TOKENS)
        expect(balance.lockScaled).to.be.eq(K1_TOKENS)
        expect(balance.lockBoost).to.be.eq(10)
        expect(await incentivesController.totalScaled()).to.be.eq(K1_TOKENS)
      })

      it('Should set balances correctly for 90 days lock', async () => {
        const { incentivesController, user, nftContract } = await loadFixture(
          deployContractFixtureWithUserStakedFor90Days
        )
        await nftContract.connect(user).approve(incentivesController.address, 0)
        await incentivesController.connect(user).stakeNFT(0)
        await incentivesController.connect(user).unstakeNFT()
        let balance = await incentivesController.balances(user.address)
        expect(balance.boosted).to.be.false
        expect(balance.staked).to.be.eq(K1_TOKENS)
        expect(balance.scaled).to.be.eq(K1_TOKENS.mul(15).div(10))
        expect(balance.lockScaled).to.be.eq(K1_TOKENS.mul(15).div(10))
        expect(balance.lockBoost).to.be.eq(15)
        expect(await incentivesController.totalScaled()).to.be.eq(K1_TOKENS.mul(15).div(10))
      })

      it('Should set balances correctly for 120 days lock', async () => {
        const { incentivesController, user, nftContract } = await loadFixture(
          deployContractFixtureWithUserStakedFor120Days
        )
        await nftContract.connect(user).approve(incentivesController.address, 0)
        await incentivesController.connect(user).stakeNFT(0)
        await incentivesController.connect(user).unstakeNFT()
        let balance = await incentivesController.balances(user.address)
        expect(balance.boosted).to.be.false
        expect(balance.staked).to.be.eq(K1_TOKENS)
        expect(balance.scaled).to.be.eq(K1_TOKENS.mul(2))
        expect(balance.lockScaled).to.be.eq(K1_TOKENS.mul(2))
        expect(balance.lockBoost).to.be.eq(20)
        expect(await incentivesController.totalScaled()).to.be.eq(K1_TOKENS.mul(2))
      })

      it('Should emit Withdrawn event with scaled == _amount * 0.5', async () => {
        const { incentivesController, user, nftContract } = await loadFixture(
          deployContractFixtureWithUserStakedFor60Days
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
    describe('Emissions', () => {
      it('Should get all rewards if is the only one staked', async () => {
        const { incentivesController, user, rewardToken } = await loadFixture(
          deployContractFixtureWithUserStakedFor60Days
        )
        const currentTimestmap = await incentivesController.emissionsStart()
        await ethers.provider.send('evm_setNextBlockTimestamp', [
          currentTimestmap.add(BigNumber.from(231).mul('86400')).toNumber(),
        ])
        expect(await rewardToken.balanceOf(user.address)).to.be.eq(0)
        await incentivesController.connect(user).getReward([rewardToken.address])
        expect(await rewardToken.balanceOf(user.address)).to.be.eq(
          K1_TOKENS.mul(4).sub(1)
        )
      })

      it('Should distribute into the void if no one is staked', async () => {
        const { incentivesController, user2, rewardToken, stakingToken } =
          await loadFixture(deployContractFixtureWithEmissionsStarted)
        var currentTimestmap = await incentivesController.emissionsStart()
        await ethers.provider.send('evm_setNextBlockTimestamp', [
          currentTimestmap.add(BigNumber.from(15).mul('86400')).toNumber(),
        ])
        await stakingToken
          .connect(user2)
          .deposit(K1_TOKENS, 0)
        currentTimestmap = BigNumber.from(
          (await ethers.provider.getBlock('latest')).timestamp
        )
        expect(await rewardToken.balanceOf(user2.address)).to.be.eq(0)
        // expect(await rewardToken.balanceOf(user.address)).to.be.eq(0);
        await ethers.provider.send('evm_setNextBlockTimestamp', [
          currentTimestmap.add(BigNumber.from(60).mul('86400')).toNumber(),
        ])
        await incentivesController.connect(user2).getReward([rewardToken.address])
        expect(await rewardToken.balanceOf(user2.address)).to.be.eq(
          K1_TOKENS.mul(8).div(3)
        )
      })

      it('Should update emissions after rewards duration correctly', async () => {
        const { incentivesController, user, rewardToken } = await loadFixture(
          deployContractFixtureWithUserStakedFor60Days
        )
        const currentTimestmap = await incentivesController.emissionsStart()
        await ethers.provider.send('evm_setNextBlockTimestamp', [
          currentTimestmap.add(BigNumber.from(60).mul('86400')).toNumber(),
        ])
        expect(await rewardToken.balanceOf(user.address)).to.be.eq(0)
        await incentivesController.connect(user).getReward([rewardToken.address])
        expect(await rewardToken.balanceOf(user.address)).to.be.eq(
          K1_TOKENS.mul(4).sub(1)
        )
        await ethers.provider.send('evm_setNextBlockTimestamp', [
          currentTimestmap.add(BigNumber.from(60 + 45).mul('86400')).toNumber(),
        ])
        await incentivesController.connect(user).getReward([rewardToken.address])
        expect(await rewardToken.balanceOf(user.address)).to.be.eq(
          K1_TOKENS.mul(4).add(K1_TOKENS.mul(2)).sub(2)
        )
        await ethers.provider.send('evm_setNextBlockTimestamp', [
          currentTimestmap.add(BigNumber.from(60 + 90).mul('86400')).toNumber(),
        ])
        await incentivesController.connect(user).getReward([rewardToken.address])
        expect(await rewardToken.balanceOf(user.address)).to.be.eq(
          K1_TOKENS.mul(4).add(K1_TOKENS.mul(2)).add(K1_TOKENS).sub(3)
        )
        await ethers.provider.send('evm_setNextBlockTimestamp', [
          currentTimestmap.add(BigNumber.from(60 + 180).mul('86400')).toNumber(),
        ])
        await incentivesController.connect(user).getReward([rewardToken.address])
        expect(await rewardToken.balanceOf(user.address)).to.be.eq(
          K1_TOKENS.mul(4).add(K1_TOKENS.mul(2)).add(K1_TOKENS).add(K1_TOKENS).sub(4)
        )
      })

      it('Should distribute rewards evenly between depositors', async () => {
        const { incentivesController, user, user2, rewardToken, stakingToken } =
          await loadFixture(deployContractFixtureWithUserStakedFor60Days)
        await rewardToken.approve(incentivesController.address, K100_TOKENS)
        var currentTimestmap = await incentivesController.emissionsStart()
        await ethers.provider.send('evm_setNextBlockTimestamp', [
          currentTimestmap.toNumber(),
        ])
        await stakingToken
          .connect(user2)
          .deposit(K1_TOKENS, 2)
        currentTimestmap = BigNumber.from(
          (await ethers.provider.getBlock('latest')).timestamp
        )
        await ethers.provider.send('evm_setNextBlockTimestamp', [
          currentTimestmap.add(BigNumber.from(130).mul('86400')).toNumber(),
        ])
        expect(await rewardToken.balanceOf(user.address)).to.be.eq(0)
        expect(await rewardToken.balanceOf(user2.address)).to.be.eq(0)
        await incentivesController.connect(user).getReward([rewardToken.address])
        await incentivesController.connect(user2).getReward([rewardToken.address])
        expect(await rewardToken.balanceOf(user.address)).to.be.eq(
          K1_TOKENS.mul(4).div(3)
        )
        expect(await rewardToken.balanceOf(user2.address)).to.be.eq(
          K1_TOKENS.mul(8).div(3)
        )
      })

      it('Should distribute correctly when new user deposits during rewards distribution', async () => {
        const { incentivesController, nftContract, user, user2, rewardToken, stakingToken } =
          await loadFixture(deployContractFixtureWithUserStakedFor60Days)
        await nftContract.connect(user2).approve(incentivesController.address, 1)
        await incentivesController.connect(user2).stakeNFT(1)
        const currentTimestmap = BigNumber.from(
          (await ethers.provider.getBlock('latest')).timestamp
        )
        await ethers.provider.send('evm_setNextBlockTimestamp', [
          currentTimestmap.add(BigNumber.from(15).mul('86400')).toNumber(),
        ])
        await stakingToken
          .connect(user2)
          .deposit(K1_TOKENS, 2)
        await ethers.provider.send('evm_setNextBlockTimestamp', [
          currentTimestmap.add(BigNumber.from(150).mul('86400')).toNumber(),
        ])
        expect(await rewardToken.balanceOf(user.address)).to.be.eq(0)
        expect(await rewardToken.balanceOf(user2.address)).to.be.eq(0)
        await incentivesController.connect(user).getReward([rewardToken.address])
        await incentivesController.connect(user2).getReward([rewardToken.address])
        expect(await rewardToken.balanceOf(user2.address)).to.be.eq(
          await rewardToken.balanceOf(user.address)
        )
        expect(await rewardToken.balanceOf(user.address)).to.be.eq(
          K1_TOKENS.mul(4).div(2).sub(1)
        )
        expect(await rewardToken.balanceOf(user2.address)).to.be.eq(
          K1_TOKENS.mul(4).div(2).sub(1)
        )
      })

      // it('Should distribute correctly when new user deposits and old one withdraws', async () => {
      //   const { incentivesController, user, user2, rewardToken } =
      //     await loadFixture(deployContractFixtureWithUserStakedFor60Days)
      //   await rewardToken.approve(incentivesController.address, K100_TOKENS)
      //   const currentTimestmap = BigNumber.from(
      //     (await ethers.provider.getBlock('latest')).timestamp
      //   )
      //   await ethers.provider.send('evm_setNextBlockTimestamp', [
      //     currentTimestmap.add(BigNumber.from(15).mul('86400')).toNumber(),
      //   ])
      //   await incentivesController
      //     .connect(user2)
      //     .deposit(K1_TOKENS, 0)
      //   expect(await rewardToken.balanceOf(user.address)).to.be.eq(0)
      //   await ethers.provider.send('evm_setNextBlockTimestamp', [
      //     currentTimestmap.add(BigNumber.from(30).mul('86400')).toNumber(),
      //   ])
      //   await stakingToken.connect(user).withdraw(K1_TOKENS, user.address)
      //   await ethers.provider.send('evm_setNextBlockTimestamp', [
      //     currentTimestmap.add(BigNumber.from(45).mul('86400')).toNumber(),
      //   ])
      //   expect(await rewardToken.balanceOf(user2.address)).to.be.eq(0)
      //   await incentivesController.connect(user).getReward([rewardToken.address])
      //   await incentivesController.connect(user2).getReward([rewardToken.address])
      //   expect(await rewardToken.balanceOf(user.address)).to.be.eq(
      //     K1_TOKENS.div(2).sub(1)
      //   )
      //   expect(await rewardToken.balanceOf(user2.address)).to.be.eq(
      //     K1_TOKENS.div(2).sub(1)
      //   )
      // })

      // it('Should distribute correctly when both users have NFTs staked', async () => {
      //   const { incentivesController, user, user2, rewardToken, nftContract } =
      //     await loadFixture(deployContractFixtureWithUserStakedFor60Days)
      //   await rewardToken.approve(incentivesController.address, K100_TOKENS)
      //   await nftContract.connect(user).approve(incentivesController.address, 0)
      //   await incentivesController.connect(user).stakeNFT(0)
      //   await nftContract.connect(user2).approve(incentivesController.address, 1)
      //   await incentivesController.connect(user2).stakeNFT(1)
      //   await incentivesController
      //     .connect(user2)
      //     .deposit(K1_TOKENS, user2.address)
      //   await incentivesController.notifyReward(
      //     [rewardToken.address],
      //     [K1_TOKENS],
      //     45 * ONE_DAY
      //   )
      //   const currentTimestmap = BigNumber.from(
      //     (await ethers.provider.getBlock('latest')).timestamp
      //   )
      //   await ethers.provider.send('evm_setNextBlockTimestamp', [
      //     currentTimestmap.add(BigNumber.from(45).mul('86400')).toNumber(),
      //   ])
      //   expect(await rewardToken.balanceOf(user.address)).to.be.eq(0)
      //   expect(await rewardToken.balanceOf(user2.address)).to.be.eq(0)
      //   await incentivesController.connect(user).getReward([rewardToken.address])
      //   await incentivesController.connect(user2).getReward([rewardToken.address])
      //   expect(await rewardToken.balanceOf(user.address)).to.be.eq(
      //     K1_TOKENS.div(2).sub(1)
      //   )
      //   expect(await rewardToken.balanceOf(user2.address)).to.be.eq(
      //     K1_TOKENS.div(2).sub(1)
      //   )
      // })

      // it('Should distribute correctly when both users have NFTs staked and one unstakes NFT', async () => {
      //   const { incentivesController, user, user2, rewardToken, nftContract } =
      //     await loadFixture(deployContractFixtureWithUserStakedFor60Days)
      //   await rewardToken.approve(incentivesController.address, K100_TOKENS)
      //   await nftContract.connect(user).approve(incentivesController.address, 0)
      //   await incentivesController.connect(user).stakeNFT(0)
      //   await nftContract.connect(user2).approve(incentivesController.address, 1)
      //   await incentivesController.connect(user2).stakeNFT(1)
      //   await incentivesController
      //     .connect(user2)
      //     .deposit(K1_TOKENS, user2.address)
      //   await incentivesController.notifyReward(
      //     [rewardToken.address],
      //     [K1_TOKENS],
      //     45 * ONE_DAY
      //   )
      //   const currentTimestmap = BigNumber.from(
      //     (await ethers.provider.getBlock('latest')).timestamp
      //   )
      //   await ethers.provider.send('evm_setNextBlockTimestamp', [
      //     currentTimestmap.add(BigNumber.from(15).mul('86400')).toNumber(),
      //   ])
      //   expect(await rewardToken.balanceOf(user2.address)).to.be.eq(0)
      //   await incentivesController.connect(user2).unstakeNFT()
      //   await ethers.provider.send('evm_setNextBlockTimestamp', [
      //     currentTimestmap.add(BigNumber.from(45).mul('86400')).toNumber(),
      //   ])
      //   expect(await rewardToken.balanceOf(user2.address)).to.be.eq(
      //     K1_TOKENS.div(6).sub(1)
      //   )
      //   expect(await rewardToken.balanceOf(user.address)).to.be.eq(0)
      //   await incentivesController.connect(user).getReward([rewardToken.address])
      //   await incentivesController.connect(user2).getReward([rewardToken.address])
      //   expect(
      //     await rewardToken.balanceOf(incentivesController.address)
      //   ).to.be.lte(10)
      //   expect(await rewardToken.balanceOf(user.address)).to.be.eq(
      //     K1_TOKENS.mul(5).div(9).sub(1)
      //   )
      //   expect(await rewardToken.balanceOf(user2.address)).to.be.eq(
      //     K1_TOKENS.mul(1).div(9).add(K1_TOKENS.div(6)).sub(1)
      //   )
      // })

      // it('Should distribute correctly when both users have NFTs staked notifyRewards changes distribution', async () => {
      //   const { incentivesController, user, user2, rewardToken, nftContract } =
      //     await loadFixture(deployContractFixtureWithUserStakedFor60Days)
      //   await rewardToken.approve(incentivesController.address, K100_TOKENS)
      //   await nftContract.connect(user).approve(incentivesController.address, 0)
      //   await incentivesController.connect(user).stakeNFT(0)
      //   await nftContract.connect(user2).approve(incentivesController.address, 1)
      //   await incentivesController.connect(user2).stakeNFT(1)
      //   await incentivesController
      //     .connect(user2)
      //     .deposit(K1_TOKENS, user2.address)
      //   await incentivesController.notifyReward(
      //     [rewardToken.address],
      //     [K1_TOKENS],
      //     45 * ONE_DAY
      //   )
      //   const currentTimestmap = BigNumber.from(
      //     (await ethers.provider.getBlock('latest')).timestamp
      //   )
      //   await ethers.provider.send('evm_setNextBlockTimestamp', [
      //     currentTimestmap.add(BigNumber.from(15).mul('86400')).toNumber(),
      //   ])
      //   await incentivesController.notifyReward(
      //     [rewardToken.address],
      //     [K1_TOKENS],
      //     45 * ONE_DAY
      //   )
      //   expect(await rewardToken.balanceOf(user2.address)).to.be.eq(0)
      //   expect(await rewardToken.balanceOf(user.address)).to.be.eq(0)
      //   await ethers.provider.send('evm_setNextBlockTimestamp', [
      //     currentTimestmap.add(BigNumber.from(30).mul('86400')).toNumber(),
      //   ])
      //   await incentivesController.connect(user).getReward([rewardToken.address])
      //   expect(await rewardToken.balanceOf(user.address)).to.be.eq(
      //     K1_TOKENS.mul(5).div(18).add(K1_TOKENS.div(6)).sub(1)
      //   )
      //   await ethers.provider.send('evm_setNextBlockTimestamp', [
      //     currentTimestmap.add(BigNumber.from(60).mul('86400')).toNumber(),
      //   ])
      //   await incentivesController.connect(user2).getReward([rewardToken.address])
      //   expect(await rewardToken.balanceOf(user2.address)).to.be.eq(
      //     K1_TOKENS.sub(1)
      //   )
      //   await incentivesController.connect(user).getReward([rewardToken.address])
      //   expect(await rewardToken.balanceOf(user.address)).to.be.eq(
      //     K1_TOKENS.sub(1)
      //   )
      // })

      // it('Should distribute correctly when notify rewards is called after period', async () => {
      //   const { incentivesController, user, user2, rewardToken, nftContract } =
      //     await loadFixture(deployContractFixtureWithUserStakedFor60Days)
      //   await rewardToken.approve(incentivesController.address, K100_TOKENS)
      //   await nftContract.connect(user).approve(incentivesController.address, 0)
      //   await incentivesController.connect(user).stakeNFT(0)
      //   await nftContract.connect(user2).approve(incentivesController.address, 1)
      //   await incentivesController.connect(user2).stakeNFT(1)
      //   await incentivesController
      //     .connect(user2)
      //     .deposit(K1_TOKENS, user2.address)
      //   await incentivesController.notifyReward(
      //     [rewardToken.address],
      //     [K1_TOKENS],
      //     45 * ONE_DAY
      //   )
      //   const currentTimestmap = BigNumber.from(
      //     (await ethers.provider.getBlock('latest')).timestamp
      //   )
      //   await ethers.provider.send('evm_setNextBlockTimestamp', [
      //     currentTimestmap.add(BigNumber.from(45).mul('86400')).toNumber(),
      //   ])
      //   await incentivesController.connect(user2).getReward([rewardToken.address])
      //   await incentivesController.notifyReward(
      //     [rewardToken.address],
      //     [K1_TOKENS],
      //     45 * ONE_DAY
      //   )
      //   expect(await rewardToken.balanceOf(user2.address)).to.be.eq(
      //     K1_TOKENS.div(2).sub(1)
      //   )
      //   expect(await rewardToken.balanceOf(user.address)).to.be.eq(0)
      //   await ethers.provider.send('evm_setNextBlockTimestamp', [
      //     currentTimestmap.add(BigNumber.from(100).mul('86400')).toNumber(),
      //   ])
      //   await incentivesController.connect(user).getReward([rewardToken.address])
      //   await incentivesController.connect(user2).getReward([rewardToken.address])
      //   await incentivesController.connect(user2).getReward([rewardToken.address])
      //   expect(await rewardToken.balanceOf(user2.address)).to.be.eq(
      //     K1_TOKENS.sub(2)
      //   )
      //   await incentivesController.connect(user).getReward([rewardToken.address])
      //   expect(await rewardToken.balanceOf(user.address)).to.be.eq(
      //     K1_TOKENS.sub(2)
      //   )
      // })
    })

    describe('Other rewards', () => {
      it('Should get 1/3 of all rewards if is the only one staked after 15 days', async () => {
        const { incentivesController, user, rewardToken2 } = await loadFixture(
          deployContractFixtureWithUserStakedFor60Days
        )
        await rewardToken2.approve(incentivesController.address, K100_TOKENS)
        await incentivesController.addReward(rewardToken2.address)
        await incentivesController.notifyReward(
          [rewardToken2.address],
          [K1_TOKENS],
          180 * ONE_DAY
        )
        const currentTimestmap = BigNumber.from(
          (await ethers.provider.getBlock('latest')).timestamp
        )
        await ethers.provider.send('evm_setNextBlockTimestamp', [
          currentTimestmap.add(BigNumber.from(60).mul('86400')).toNumber(),
        ])
        expect(await rewardToken2.balanceOf(user.address)).to.be.eq(0)
        await incentivesController.connect(user).getReward([rewardToken2.address])
        expect(await rewardToken2.balanceOf(user.address)).to.be.eq(
          K1_TOKENS.div(3)
        )
      })

      it('Should get 2/3 of all rewards if is the only one staked after 30 days', async () => {
        const { incentivesController, user, rewardToken2 } = await loadFixture(
          deployContractFixtureWithUserStakedFor60Days
        )
        await rewardToken2.approve(incentivesController.address, K100_TOKENS)
        await incentivesController.addReward(rewardToken2.address)
        await incentivesController.notifyReward(
          [rewardToken2.address],
          [K1_TOKENS],
          180 * ONE_DAY
        )
        const currentTimestmap = BigNumber.from(
          (await ethers.provider.getBlock('latest')).timestamp
        )
        await ethers.provider.send('evm_setNextBlockTimestamp', [
          currentTimestmap.add(BigNumber.from(120).mul('86400')).toNumber(),
        ])
        expect(await rewardToken2.balanceOf(user.address)).to.be.eq(0)
        await incentivesController.connect(user).getReward([rewardToken2.address])
        expect(await rewardToken2.balanceOf(user.address)).to.be.eq(
          K1_TOKENS.div(3).mul(2)
        )
      })

      it('Should distribute rewards evenly between depositors', async () => {
        const { incentivesController, user, user2, rewardToken2, stakingToken } =
          await loadFixture(deployContractFixtureWithUserStakedFor60Days)
        await rewardToken2.approve(incentivesController.address, K100_TOKENS)
        await incentivesController.addReward(rewardToken2.address)
        await stakingToken
          .connect(user2)
          .deposit(K1_TOKENS, 0)
        await incentivesController.notifyReward(
          [rewardToken2.address],
          [K1_TOKENS],
          180 * ONE_DAY
        )
        const currentTimestmap = BigNumber.from(
          (await ethers.provider.getBlock('latest')).timestamp
        )
        await ethers.provider.send('evm_setNextBlockTimestamp', [
          currentTimestmap.add(BigNumber.from(180).mul('86400')).toNumber(),
        ])
        expect(await rewardToken2.balanceOf(user.address)).to.be.eq(0)
        expect(await rewardToken2.balanceOf(user2.address)).to.be.eq(0)
        await incentivesController.connect(user).getReward([rewardToken2.address])
        await incentivesController.connect(user2).getReward([rewardToken2.address])
        expect(await rewardToken2.balanceOf(user.address)).to.be.eq(
          K1_TOKENS.div(2).sub(1)
        )
        expect(await rewardToken2.balanceOf(user2.address)).to.be.eq(
          K1_TOKENS.div(2).sub(1)
        )
      })

      it('Should distribute correctly when new user deposits during rewards distribution', async () => {
        const { incentivesController, user, user2, rewardToken2, stakingToken } =
          await loadFixture(deployContractFixtureWithUserStakedFor60Days)
        await rewardToken2.approve(incentivesController.address, K100_TOKENS)
        await incentivesController.addReward(rewardToken2.address)
        await incentivesController.notifyReward(
          [rewardToken2.address],
          [K1_TOKENS],
          180 * ONE_DAY
        )
        const currentTimestmap = BigNumber.from(
          (await ethers.provider.getBlock('latest')).timestamp
        )
        await ethers.provider.send('evm_setNextBlockTimestamp', [
          currentTimestmap.add(BigNumber.from(60).mul('86400')).toNumber(),
        ])
        await stakingToken
          .connect(user2)
          .deposit(K1_TOKENS, 0)
        await ethers.provider.send('evm_setNextBlockTimestamp', [
          currentTimestmap.add(BigNumber.from(180).mul('86400')).toNumber(),
        ])
        expect(await rewardToken2.balanceOf(user.address)).to.be.eq(0)
        expect(await rewardToken2.balanceOf(user2.address)).to.be.eq(0)
        await incentivesController.connect(user).getReward([rewardToken2.address])
        await incentivesController.connect(user2).getReward([rewardToken2.address])
        expect(await rewardToken2.balanceOf(user.address)).to.be.eq(
          K1_TOKENS.div(3).mul(2)
        )
        expect(await rewardToken2.balanceOf(user2.address)).to.be.eq(
          K1_TOKENS.div(3)
        )
      })

      it('Should distribute correctly when new user deposits and old one withdraw', async () => {
        const { incentivesController, user, user2, rewardToken2, stakingToken } =
          await loadFixture(deployContractFixtureWithUserStakedFor60Days)
        await rewardToken2.approve(incentivesController.address, K100_TOKENS)
        await incentivesController.addReward(rewardToken2.address)
        await incentivesController.notifyReward(
          [rewardToken2.address],
          [K1_TOKENS],
          180 * ONE_DAY
        )
        const currentTimestmap = BigNumber.from(
          (await ethers.provider.getBlock('latest')).timestamp
        )
        await ethers.provider.send('evm_setNextBlockTimestamp', [
          currentTimestmap.add(BigNumber.from(60).mul('86400')).toNumber(),
        ])
        await stakingToken
          .connect(user2)
          .deposit(K1_TOKENS, 0)
        expect(await rewardToken2.balanceOf(user.address)).to.be.eq(0)
        await ethers.provider.send('evm_setNextBlockTimestamp', [
          currentTimestmap.add(BigNumber.from(120).mul('86400')).toNumber(),
        ])
        await stakingToken.connect(user).withdraw(K1_TOKENS)
        await ethers.provider.send('evm_setNextBlockTimestamp', [
          currentTimestmap.add(BigNumber.from(180).mul('86400')).toNumber(),
        ])
        expect(await rewardToken2.balanceOf(user2.address)).to.be.eq(0)
        await incentivesController.connect(user).getReward([rewardToken2.address])
        await incentivesController.connect(user2).getReward([rewardToken2.address])
        expect(await rewardToken2.balanceOf(user.address)).to.be.eq(
          K1_TOKENS.div(2).sub(1)
        )
        expect(await rewardToken2.balanceOf(user2.address)).to.be.eq(
          K1_TOKENS.div(2).sub(1)
        )
      })

      it('Should distribute correctly when both users have NFTs staked', async () => {
        const { incentivesController, user, user2, rewardToken2, nftContract, stakingToken } =
          await loadFixture(deployContractFixtureWithUserStakedFor60Days)
        await incentivesController.addReward(rewardToken2.address)
        await rewardToken2.approve(incentivesController.address, K100_TOKENS)
        await nftContract.connect(user).approve(incentivesController.address, 0)
        await incentivesController.connect(user).stakeNFT(0)
        await nftContract.connect(user2).approve(incentivesController.address, 1)
        await incentivesController.connect(user2).stakeNFT(1)
        await stakingToken
          .connect(user2)
          .deposit(K1_TOKENS, 0)
        await incentivesController.notifyReward(
          [rewardToken2.address],
          [K1_TOKENS],
          180 * ONE_DAY
        )
        const currentTimestmap = BigNumber.from(
          (await ethers.provider.getBlock('latest')).timestamp
        )
        await ethers.provider.send('evm_setNextBlockTimestamp', [
          currentTimestmap.add(BigNumber.from(180).mul('86400')).toNumber(),
        ])
        expect(await rewardToken2.balanceOf(user.address)).to.be.eq(0)
        expect(await rewardToken2.balanceOf(user2.address)).to.be.eq(0)
        await incentivesController.connect(user).getReward([rewardToken2.address])
        await incentivesController.connect(user2).getReward([rewardToken2.address])
        expect(await rewardToken2.balanceOf(user.address)).to.be.eq(
          K1_TOKENS.div(2).sub(1)
        )
        expect(await rewardToken2.balanceOf(user2.address)).to.be.eq(
          K1_TOKENS.div(2).sub(1)
        )
      })

      it('Should distribute correctly when both users have NFTs staked and one unstakes NFT', async () => {
        const { incentivesController, user, user2, rewardToken2, nftContract, stakingToken } =
          await loadFixture(deployContractFixtureWithUserStakedFor60Days)
        await rewardToken2.approve(incentivesController.address, K100_TOKENS)
        await incentivesController.addReward(rewardToken2.address)
        await nftContract.connect(user).approve(incentivesController.address, 0)
        await incentivesController.connect(user).stakeNFT(0)
        await nftContract.connect(user2).approve(incentivesController.address, 1)
        await incentivesController.connect(user2).stakeNFT(1)
        await stakingToken
          .connect(user2)
          .deposit(K1_TOKENS, 0)
        await incentivesController.notifyReward(
          [rewardToken2.address],
          [K1_TOKENS],
          180 * ONE_DAY
        )
        const currentTimestmap = BigNumber.from(
          (await ethers.provider.getBlock('latest')).timestamp
        )
        expect(await rewardToken2.balanceOf(user2.address)).to.be.eq(0)
        await ethers.provider.send('evm_setNextBlockTimestamp', [
          currentTimestmap.add(BigNumber.from(60).mul('86400')).toNumber(),
        ])
        await incentivesController.connect(user2).unstakeNFT()
        await ethers.provider.send('evm_setNextBlockTimestamp', [
          currentTimestmap.add(BigNumber.from(180).mul('86400')).toNumber(),
        ])
        expect(await rewardToken2.balanceOf(user2.address)).to.be.eq(
          K1_TOKENS.div(6)
        )
        expect(await rewardToken2.balanceOf(user.address)).to.be.eq(0)
        await incentivesController.connect(user).getReward([rewardToken2.address])
        await incentivesController.connect(user2).getReward([rewardToken2.address])
        expect(
          await rewardToken2.balanceOf(incentivesController.address)
        ).to.be.lte(10)
        expect(await rewardToken2.balanceOf(user.address)).to.be.eq(
          K1_TOKENS.mul(12).div(30).add(K1_TOKENS.div(6))
        )
        expect(await rewardToken2.balanceOf(user2.address)).to.be.eq(
          K1_TOKENS.div(6).add(K1_TOKENS.mul(8).div(30))
        )
      })

      it('Should distribute correctly when both users have NFTs staked notifyRewards changes distribution', async () => {
        const { incentivesController, user, user2, rewardToken2, nftContract, stakingToken } =
          await loadFixture(deployContractFixtureWithUserStakedFor60Days)
        await incentivesController.addReward(rewardToken2.address)
        await rewardToken2.approve(incentivesController.address, K100_TOKENS)
        await nftContract.connect(user).approve(incentivesController.address, 0)
        await incentivesController.connect(user).stakeNFT(0)
        await nftContract.connect(user2).approve(incentivesController.address, 1)
        await incentivesController.connect(user2).stakeNFT(1)
        await stakingToken
          .connect(user2)
          .deposit(K1_TOKENS, 0)
        await incentivesController.notifyReward(
          [rewardToken2.address],
          [K1_TOKENS],
          180 * ONE_DAY
        )
        const currentTimestmap = BigNumber.from(
          (await ethers.provider.getBlock('latest')).timestamp
        )
        await ethers.provider.send('evm_setNextBlockTimestamp', [
          currentTimestmap.add(BigNumber.from(60).mul('86400')).toNumber(),
        ])
        await incentivesController.notifyReward(
          [rewardToken2.address],
          [K1_TOKENS],
          180 * ONE_DAY
        )
        expect(await rewardToken2.balanceOf(user2.address)).to.be.eq(0)
        expect(await rewardToken2.balanceOf(user.address)).to.be.eq(0)
        await ethers.provider.send('evm_setNextBlockTimestamp', [
          currentTimestmap.add(BigNumber.from(120).mul('86400')).toNumber(),
        ])
        await incentivesController.connect(user).getReward([rewardToken2.address])
        expect(await rewardToken2.balanceOf(user.address)).to.be.eq(
          K1_TOKENS.mul(5).div(18).add(K1_TOKENS.div(6)).add(1)
        )
        await ethers.provider.send('evm_setNextBlockTimestamp', [
          currentTimestmap.add(BigNumber.from(240).mul('86400')).toNumber(),
        ])
        await incentivesController.connect(user2).getReward([rewardToken2.address])
        expect(await rewardToken2.balanceOf(user2.address)).to.be.eq(
          K1_TOKENS.sub(1)
        )
        await incentivesController.connect(user).getReward([rewardToken2.address])
        expect(await rewardToken2.balanceOf(user.address)).to.be.eq(
          K1_TOKENS.sub(1)
        )
      })

      it('Should distribute correctly when notify rewards is called after period', async () => {
        const { incentivesController, user, user2, rewardToken2, nftContract, stakingToken } =
          await loadFixture(deployContractFixtureWithUserStakedFor60Days)
        await incentivesController.addReward(rewardToken2.address)
        await rewardToken2.approve(incentivesController.address, K100_TOKENS)
        await nftContract.connect(user).approve(incentivesController.address, 0)
        await incentivesController.connect(user).stakeNFT(0)
        await nftContract.connect(user2).approve(incentivesController.address, 1)
        await incentivesController.connect(user2).stakeNFT(1)
        await stakingToken
          .connect(user2)
          .deposit(K1_TOKENS, 0)
        await incentivesController.notifyReward(
          [rewardToken2.address],
          [K1_TOKENS],
          180 * ONE_DAY
        )
        const currentTimestmap = BigNumber.from(
          (await ethers.provider.getBlock('latest')).timestamp
        )
        await ethers.provider.send('evm_setNextBlockTimestamp', [
          currentTimestmap.add(BigNumber.from(180).mul('86400')).toNumber(),
        ])
        await incentivesController.connect(user2).getReward([rewardToken2.address])
        await incentivesController.notifyReward(
          [rewardToken2.address],
          [K1_TOKENS],
          180 * ONE_DAY
        )
        expect(await rewardToken2.balanceOf(user2.address)).to.be.eq(
          K1_TOKENS.div(2).sub(1)
        )
        expect(await rewardToken2.balanceOf(user.address)).to.be.eq(0)
        await ethers.provider.send('evm_setNextBlockTimestamp', [
          currentTimestmap.add(BigNumber.from(400).mul('86400')).toNumber(),
        ])
        await incentivesController.connect(user).getReward([rewardToken2.address])
        await incentivesController.connect(user2).getReward([rewardToken2.address])
        await incentivesController.connect(user2).getReward([rewardToken2.address])
        expect(await rewardToken2.balanceOf(user2.address)).to.be.eq(
          K1_TOKENS.sub(2)
        )
        await incentivesController.connect(user).getReward([rewardToken2.address])
        expect(await rewardToken2.balanceOf(user.address)).to.be.eq(
          K1_TOKENS.sub(1)
        )
      })
    })
  })

  describe('addRewards', () => {
    it('Should revert if called by non-owner', async () => {
      const { incentivesController, rewardToken2, user } = await loadFixture(deployContractFixture);
      await expect(incentivesController.connect(user.address).addReward(rewardToken2.address)).to.be.revertedWith('Ownable: caller is not the owner');
    });

    it('Should revert if adding stakingToken', async () => {
      const { incentivesController, stakingToken, user } = await loadFixture(deployContractFixture);
      await expect(incentivesController.connect(user.address).addReward(stakingToken.address)).to.be.revertedWith('Ownable: caller is not the owner');
    });

    it('Should revert if adding already registered token', async () => {
      const { incentivesController, rewardToken, user } = await loadFixture(deployContractFixture);
      await expect(incentivesController.connect(user.address).addReward(rewardToken.address)).to.be.reverted;
    });

    it('Should add a new reward token', async () => {
      const { incentivesController, rewardToken2 } = await loadFixture(
        deployContractFixture
      )
      await incentivesController.addReward(rewardToken2.address)
      const blockTimestamp = (await ethers.provider.getBlock('latest')).timestamp
      expect(await incentivesController.rewardTokens(1)).to.be.eq(
        rewardToken2.address
      )
      const rewardData = await incentivesController.rewardData(rewardToken2.address)
      expect(rewardData.periodFinish).to.be.eq(blockTimestamp)
      expect(rewardData.lastUpdateTime).to.be.eq(blockTimestamp)
    })
  })

  // descrive notifyReward
  describe('notifyReward', () => {
    it('Should revert if called by non-owner', async () => {
      const { incentivesController, rewardToken2, user } = await loadFixture(deployContractFixtureWithEmissionsStarted);
      await incentivesController.addReward(rewardToken2.address)
      await expect(incentivesController.connect(user.address).notifyReward([rewardToken2.address], [K1_TOKENS], 180 * ONE_DAY)).to.be.revertedWith('CallerIsNotTheAdmin');
    });

    it('Should not revert if called with 0 reward', async () => {
      const { incentivesController, rewardToken2 } = await loadFixture(deployContractFixtureWithEmissionsStarted);
      await incentivesController.addReward(rewardToken2.address)
      await expect(incentivesController.notifyReward([rewardToken2.address], [0], 180 * ONE_DAY)).not.to.be.reverted;
    });

    it('Should revert if called with 0 duration', async () => {
      const { incentivesController, rewardToken2 } = await loadFixture(deployContractFixtureWithEmissionsStarted);
      await incentivesController.addReward(rewardToken2.address)
      await expect(incentivesController.notifyReward([rewardToken2.address], [K1_TOKENS], 0)).to.be.revertedWith('Duration is zero');
    });

    it('Should revert if called with mismatched array lengths', async () => {
      const { incentivesController, rewardToken } = await loadFixture(deployContractFixtureWithEmissionsStarted);
      await expect(incentivesController.notifyReward([rewardToken.address, rewardToken.address], [0], 10000)).to.be.revertedWith('Invalid input');
    });

    it('Should not update rewardsTokens[0]', async () => {
      const { incentivesController, rewardToken } = await loadFixture(deployContractFixtureWithEmissionsStarted);
      const rewardDataBefore = await incentivesController.rewardData(rewardToken.address)
      await incentivesController.notifyReward([rewardToken.address], [1000], 10000)
      const rewardData = await incentivesController.rewardData(rewardToken.address)
      expect(rewardDataBefore.periodFinish).to.be.eq(rewardData.periodFinish)
      expect(rewardDataBefore.lastUpdateTime).to.be.eq(rewardData.lastUpdateTime)
      expect(rewardDataBefore.rewardPerTokenStored).to.be.eq(rewardData.rewardPerTokenStored)
      expect(rewardDataBefore.rewardRate).to.be.eq(rewardData.rewardRate)
    });

    it('Should notify rewards correctly before period finish', async () => {
      const { incentivesController, rewardToken2 } = await loadFixture(deployContractFixtureWithUserStakedFor60Days);
      await incentivesController.addReward(rewardToken2.address)
      await incentivesController.notifyReward([rewardToken2.address], [K1_TOKENS], 1e8)
      var blockTimestamp = (await ethers.provider.getBlock('latest')).timestamp
      const rewardDataBefore = await incentivesController.rewardData(rewardToken2.address)
      expect(rewardDataBefore.periodFinish).to.be.eq(BigNumber.from(blockTimestamp).add(1e8))
      expect(rewardDataBefore.lastUpdateTime).to.be.eq(blockTimestamp)
      expect(rewardDataBefore.rewardPerTokenStored).to.be.eq(0)
      expect(rewardDataBefore.rewardRate).to.be.eq(BigNumber.from(1e12).mul(1e13))

      await ethers.provider.send('evm_setNextBlockTimestamp', [
        BigNumber.from(blockTimestamp).add(5e7).toNumber(),
      ])
      await incentivesController.notifyReward([rewardToken2.address], [K1_TOKENS], 1e8)
      blockTimestamp = (await ethers.provider.getBlock('latest')).timestamp
      const rewardData = await incentivesController.rewardData(rewardToken2.address)
      expect(rewardData.periodFinish).to.be.eq(BigNumber.from(blockTimestamp).add(1e8))
      expect(rewardData.lastUpdateTime).to.be.eq(blockTimestamp)
      expect(rewardData.rewardPerTokenStored).to.be.eq(BigNumber.from(5).mul(1e15).mul(1e14))
      expect(rewardData.rewardRate).to.be.eq(BigNumber.from(1e12).mul(1e12).mul(15))
    });

    it('Should notify rewards correctly after period finish', async () => {
      const { incentivesController, rewardToken2 } = await loadFixture(deployContractFixtureWithUserStakedFor60Days);
      await incentivesController.addReward(rewardToken2.address)
      await incentivesController.notifyReward([rewardToken2.address], [K1_TOKENS], 1e8)
      var blockTimestamp = (await ethers.provider.getBlock('latest')).timestamp
      const rewardDataBefore = await incentivesController.rewardData(rewardToken2.address)
      expect(rewardDataBefore.periodFinish).to.be.eq(BigNumber.from(blockTimestamp).add(1e8))
      expect(rewardDataBefore.lastUpdateTime).to.be.eq(blockTimestamp)
      expect(rewardDataBefore.rewardPerTokenStored).to.be.eq(0);
      expect(rewardDataBefore.rewardRate).to.be.eq(BigNumber.from(1e12).mul(1e13))

      await ethers.provider.send('evm_setNextBlockTimestamp', [
        BigNumber.from(blockTimestamp).add(1e9).toNumber(),
      ])
      await incentivesController.notifyReward([rewardToken2.address], [K1_TOKENS], 1e8)
      blockTimestamp = (await ethers.provider.getBlock('latest')).timestamp
      const rewardData = await incentivesController.rewardData(rewardToken2.address)
      expect(rewardData.periodFinish).to.be.eq(BigNumber.from(blockTimestamp).add(1e8))
      expect(rewardData.lastUpdateTime).to.be.eq(blockTimestamp)
      expect(rewardData.rewardPerTokenStored).to.be.eq(BigNumber.from(1e15).mul(1e15))
      expect(rewardData.rewardRate).to.be.eq(BigNumber.from(1e12).mul(1e13))
    })
  })
})
