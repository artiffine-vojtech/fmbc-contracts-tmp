import { ethers } from 'hardhat'
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { expect } from 'chai'
import { parseEther } from 'ethers/lib/utils'

import {
  FMBCTeamVesting__factory,
  bin,
} from '../../hardhat-types/src/factories/contracts'
import { BigNumber } from 'ethers'
import { MEMEVesting__factory } from '../../hardhat-types/src'
import exp from 'constants'
const { FMBCTokenERC20__factory } = bin

const K100_TOKENS = parseEther(`${100_000}`)
const ONE_DAY = 24 * 60 * 60
const TGE_UNLOCKED = 0

// TODO: use OFT instead of FMBCTokenERC20__factory
describe('MEMEVesting', function () {
  async function deployContractFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, user, user2, user3] = await ethers.getSigners()

    // deploy the ERC20 contract
    const erc20ContractFactory = new FMBCTokenERC20__factory(owner)
    const erc20Contract = await erc20ContractFactory.deploy(
      parseEther(`${100_000_000_000}`)
    )
    await erc20Contract.deployed()

    const tgeTimestamp = BigNumber.from(
      (await ethers.provider.getBlock('latest')).timestamp
    ).add(BigNumber.from('1000000'))

    // deploy the vesting contract
    const vestingContractFactory = new MEMEVesting__factory(owner)
    const vestingContract = await vestingContractFactory.deploy(
      tgeTimestamp,
      erc20Contract.address
    )
    await vestingContract.deployed()

    const ownerBalance = await erc20Contract.balanceOf(owner.address)
    console.log('owner balance before transfer', ownerBalance.toString())

    // transfer 100k FMBC to user
    const res = await erc20Contract
      .connect(owner)
      .transfer(user.address, K100_TOKENS)
    await res.wait()

    // transfer 100k FMBC to user2
    const res2 = await erc20Contract
      .connect(owner)
      .transfer(user2.address, K100_TOKENS)
    await res2.wait()

    const ownerBalanceAfter = await erc20Contract.balanceOf(owner.address)
    console.log('owner balance after transfer', ownerBalanceAfter.toString())

    return {
      // contracts
      erc20Contract,
      vestingContract,
      tgeTimestamp,
      // accounts
      owner,
      user,
      user2,
      user3,
    }
  }

  async function deployContractFixtureAtTGEWithUSer2Vest() {
    const {
      erc20Contract,
      vestingContract,
      tgeTimestamp,
      owner,
      user,
      user2,
      user3,
    } = await loadFixture(deployContractFixture)
    await erc20Contract
      .connect(user)
      .approve(vestingContract.address, K100_TOKENS)
    await ethers.provider.send('evm_setNextBlockTimestamp', [
      tgeTimestamp.toNumber(),
    ])
    await vestingContract.connect(user).vestTokens(K100_TOKENS, user2.address)
    return {
      erc20Contract,
      vestingContract,
      tgeTimestamp,
      owner,
      user,
      user2,
      user3,
    }
  }

  async function deployContractFixtureBeforeTGEWithUSer2Vest() {
    const {
      erc20Contract,
      vestingContract,
      tgeTimestamp,
      owner,
      user,
      user2,
      user3,
    } = await loadFixture(deployContractFixture)
    await erc20Contract
      .connect(user)
      .approve(vestingContract.address, K100_TOKENS)
    await vestingContract.connect(user).vestTokens(K100_TOKENS, user2.address)
    return {
      erc20Contract,
      vestingContract,
      tgeTimestamp,
      owner,
      user,
      user2,
      user3,
    }
  }

  describe('Deployment', async () => {
    it('Print out gas needed', async () => {
      const { vestingContract } = await loadFixture(deployContractFixture)
      console.log(
        'Gas used for deployment',
        (await vestingContract.deployTransaction.wait()).gasUsed.toNumber()
      )
    })

    it('Should set FMBC token correctly', async () => {
      const { vestingContract, erc20Contract } = await loadFixture(
        deployContractFixture
      )
      expect(await vestingContract.memeToken()).to.be.eq(erc20Contract.address)
    })

    it('Should set tgeTimestamp correctly', async () => {
      const { vestingContract, tgeTimestamp } = await loadFixture(
        deployContractFixture
      )
      expect((await vestingContract.tgeTimestamp()).toString()).to.be.eq(
        tgeTimestamp
      )
    })
  })

  describe('VestTokens', async () => {
    it('Should revert if amount is zero', async () => {
      const { vestingContract, user } = await loadFixture(deployContractFixture)
      const action = vestingContract.connect(user).vestTokens(0, user.address)
      await expect(action).to.be.revertedWith('ArgumentIsZero')
    })

    it("Should revert if user doesn't have enough tokens", async () => {
      const { vestingContract, erc20Contract, user } = await loadFixture(
        deployContractFixture
      )
      const userBalance = await erc20Contract.balanceOf(user.address)
      const action = vestingContract
        .connect(user)
        .vestTokens(userBalance.add(1), user.address)
      await expect(action).to.be.revertedWith('ERC20: insufficient allowance')
    })

    describe('before TGE', async () => {
      it('Should add vesting position', async () => {
        const { vestingContract, tgeTimestamp, user2 } = await loadFixture(
          deployContractFixtureBeforeTGEWithUSer2Vest
        )
        const position = await vestingContract.vestingPositions(
          user2.address,
          0
        )
        expect(position.amount).to.be.eq(K100_TOKENS)
        expect(position.amountClaimed).to.be.eq(0)
        expect(position.startTimestamp).to.be.eq(tgeTimestamp)
      })

      it('Should add only one vesting position on consecutive calls', async () => {
        const { vestingContract, erc20Contract, tgeTimestamp, user, user2 } =
          await loadFixture(deployContractFixture)
        // First vesting before TGE
        await erc20Contract
          .connect(user)
          .approve(vestingContract.address, K100_TOKENS)
        await vestingContract
          .connect(user)
          .vestTokens(K100_TOKENS.div(2), user2.address)
        const position = await vestingContract.vestingPositions(
          user2.address,
          0
        )
        expect(position.amount).to.be.eq(K100_TOKENS.div(2))
        expect(position.amountClaimed).to.be.eq(0)
        expect(position.startTimestamp).to.be.eq(tgeTimestamp)
        // Second vesting before TGE
        await vestingContract
          .connect(user)
          .vestTokens(K100_TOKENS.div(2), user2.address)
        const position2 = await vestingContract.vestingPositions(
          user2.address,
          0
        )
        expect(position2.amount).to.be.eq(K100_TOKENS)
        expect(position2.amountClaimed).to.be.eq(0)
        expect(position2.startTimestamp).to.be.eq(tgeTimestamp)
      })

      it('Should transfer tokens properly', async () => {
        const { vestingContract, erc20Contract, user } = await loadFixture(
          deployContractFixtureBeforeTGEWithUSer2Vest
        )
        expect(await erc20Contract.balanceOf(user.address)).to.be.eq(0)
        expect(await erc20Contract.balanceOf(vestingContract.address)).to.be.eq(
          K100_TOKENS
        )
      })

      it('Should emit TokensVested event', async () => {
        const { vestingContract, erc20Contract, user, user2 } =
          await loadFixture(deployContractFixture)
        await erc20Contract
          .connect(user)
          .approve(vestingContract.address, K100_TOKENS)
        const action = vestingContract
          .connect(user)
          .vestTokens(K100_TOKENS, user2.address)
        await expect(action)
          .to.emit(vestingContract, 'TokensVested')
          .withArgs(user2.address, 0, K100_TOKENS)
      })
    })

    describe('at/after TGE', async () => {
      it('Should add vesting position', async () => {
        const { vestingContract, erc20Contract, tgeTimestamp, user, user2 } =
          await loadFixture(deployContractFixture)
        await erc20Contract
          .connect(user)
          .approve(vestingContract.address, K100_TOKENS)
        await ethers.provider.send('evm_setNextBlockTimestamp', [
          tgeTimestamp.add(1).toNumber(),
        ])
        await vestingContract
          .connect(user)
          .vestTokens(K100_TOKENS, user2.address)
        const position = await vestingContract.vestingPositions(
          user2.address,
          0
        )
        expect(position.amount).to.be.eq(K100_TOKENS)
        expect(position.amountClaimed).to.be.eq(
          K100_TOKENS.mul(TGE_UNLOCKED).div(10000)
        )
        expect(position.startTimestamp).to.be.eq(tgeTimestamp.add(1))
      })

      it('Should add new vesting position on consecutive calls (first call before TGE)', async () => {
        const { vestingContract, erc20Contract, tgeTimestamp, user, user2 } =
          await loadFixture(deployContractFixture)
        // First vesting before TGE
        await erc20Contract
          .connect(user)
          .approve(vestingContract.address, K100_TOKENS)
        await vestingContract
          .connect(user)
          .vestTokens(K100_TOKENS.div(2), user2.address)
        const position = await vestingContract.vestingPositions(
          user2.address,
          0
        )
        expect(position.amount).to.be.eq(K100_TOKENS.div(2))
        expect(position.amountClaimed).to.be.eq(0)
        expect(position.startTimestamp).to.be.eq(tgeTimestamp)
        // Second vesting after TGE
        await ethers.provider.send('evm_setNextBlockTimestamp', [
          tgeTimestamp.add(1).toNumber(),
        ])
        await vestingContract
          .connect(user)
          .vestTokens(K100_TOKENS.div(2), user2.address)
        const position2 = await vestingContract.vestingPositions(
          user2.address,
          1
        )
        expect(position2.amount).to.be.eq(K100_TOKENS.div(2))
        expect(position2.amountClaimed).to.be.eq(
          K100_TOKENS.div(2).mul(TGE_UNLOCKED).div(10000)
        )
        expect(position2.startTimestamp).to.be.eq(tgeTimestamp.add(1))
      })

      it('Should add new vesting position on consecutive calls (first call after TGE)', async () => {
        const { vestingContract, erc20Contract, tgeTimestamp, user, user2 } =
          await loadFixture(deployContractFixture)
        // First vesting after TGE
        await erc20Contract
          .connect(user)
          .approve(vestingContract.address, K100_TOKENS)
        await ethers.provider.send('evm_setNextBlockTimestamp', [
          tgeTimestamp.toNumber(),
        ])
        await vestingContract
          .connect(user)
          .vestTokens(K100_TOKENS.div(2), user2.address)
        const position = await vestingContract.vestingPositions(
          user2.address,
          0
        )
        expect(position.amount).to.be.eq(K100_TOKENS.div(2))
        expect(position.amountClaimed).to.be.eq(
          K100_TOKENS.div(2).mul(TGE_UNLOCKED).div(10000)
        )
        expect(position.startTimestamp).to.be.eq(tgeTimestamp)
        // Second vesting after TGE
        await vestingContract
          .connect(user)
          .vestTokens(K100_TOKENS.div(2), user2.address)
        const position2 = await vestingContract.vestingPositions(
          user2.address,
          1
        )
        expect(position2.amount).to.be.eq(K100_TOKENS.div(2))
        expect(position2.amountClaimed).to.be.eq(
          K100_TOKENS.div(2).mul(TGE_UNLOCKED).div(10000)
        )
        expect(position2.startTimestamp).to.be.eq(tgeTimestamp)
      })

      it('Should transfer tokens properly', async () => {
        const { vestingContract, erc20Contract, user, user2 } =
          await loadFixture(deployContractFixtureAtTGEWithUSer2Vest)
        const claimable = K100_TOKENS.mul(TGE_UNLOCKED).div(10000)
        expect(await erc20Contract.balanceOf(user.address)).to.be.eq(0)
        expect(await erc20Contract.balanceOf(vestingContract.address)).to.be.eq(
          K100_TOKENS.sub(claimable)
        )
        expect(await erc20Contract.balanceOf(user2.address)).to.be.eq(
          claimable.add(K100_TOKENS)
        )
      })

      it('Should transfer tokens properly on consecutive calls', async () => {
        const { vestingContract, erc20Contract, tgeTimestamp, user, user2 } =
          await loadFixture(deployContractFixture)
        const toVest = K100_TOKENS.div(4)
        const claimable = toVest.mul(TGE_UNLOCKED).div(10000)
        // First vesting before TGE
        await erc20Contract
          .connect(user)
          .approve(vestingContract.address, K100_TOKENS)
        await vestingContract.connect(user).vestTokens(toVest, user2.address)
        expect(await erc20Contract.balanceOf(user2.address)).to.be.eq(
          K100_TOKENS
        )
        expect(await erc20Contract.balanceOf(vestingContract.address)).to.be.eq(
          toVest
        )
        // Second vesting at TGE
        await ethers.provider.send('evm_setNextBlockTimestamp', [
          tgeTimestamp.toNumber(),
        ])
        await vestingContract.connect(user).vestTokens(toVest, user2.address)
        expect(await erc20Contract.balanceOf(user2.address)).to.be.eq(
          K100_TOKENS.add(claimable)
        )
        expect(await erc20Contract.balanceOf(vestingContract.address)).to.be.eq(
          toVest.add(toVest.sub(claimable))
        )
        // Third vesting after TGE
        await vestingContract.connect(user).vestTokens(toVest, user2.address)
        expect(await erc20Contract.balanceOf(user2.address)).to.be.eq(
          K100_TOKENS.add(claimable).add(claimable)
        )
        expect(await erc20Contract.balanceOf(vestingContract.address)).to.be.eq(
          toVest.add(toVest.sub(claimable)).add(toVest.sub(claimable))
        )
      })

      it('Should emit TokensVested and TokensClaimed events', async () => {
        const { vestingContract, erc20Contract, tgeTimestamp, user, user2 } =
          await loadFixture(deployContractFixture)
        await erc20Contract
          .connect(user)
          .approve(vestingContract.address, K100_TOKENS)
        await ethers.provider.send('evm_setNextBlockTimestamp', [
          tgeTimestamp.toNumber(),
        ])
        const action = vestingContract
          .connect(user)
          .vestTokens(K100_TOKENS, user2.address)
        const claimable = K100_TOKENS.mul(TGE_UNLOCKED).div(10000)
        await expect(action)
          .to.emit(vestingContract, 'TokensVested')
          .withArgs(user2.address, 0, K100_TOKENS)
          .and.to.emit(vestingContract, 'TokensClaimed')
          .withArgs(user2.address, 0, claimable)
      })

      it('Should emit TokensVested and TokensClaimed events on consecutive calls', async () => {
        const { vestingContract, erc20Contract, tgeTimestamp, user, user2 } =
          await loadFixture(deployContractFixture)
        await erc20Contract
          .connect(user)
          .approve(vestingContract.address, K100_TOKENS)
        await ethers.provider.send('evm_setNextBlockTimestamp', [
          tgeTimestamp.toNumber(),
        ])
        const action = vestingContract
          .connect(user)
          .vestTokens(K100_TOKENS.div(2), user2.address)
        const claimable = K100_TOKENS.div(2).mul(TGE_UNLOCKED).div(10000)
        await expect(action)
          .to.emit(vestingContract, 'TokensVested')
          .withArgs(user2.address, 0, K100_TOKENS.div(2))
          .and.to.emit(vestingContract, 'TokensClaimed')
          .withArgs(user2.address, 0, claimable)
        const action2 = vestingContract
          .connect(user)
          .vestTokens(K100_TOKENS.div(2), user2.address)
        await expect(action2)
          .to.emit(vestingContract, 'TokensVested')
          .withArgs(user2.address, 1, K100_TOKENS.div(2))
          .and.to.emit(vestingContract, 'TokensClaimed')
          .withArgs(user2.address, 1, claimable)
      })
    })
  })

  describe('ClaimTokens', async () => {
    it("Should revert if position doesn't exist", async () => {
      const { vestingContract, user2 } = await loadFixture(
        deployContractFixture
      )
      const action = vestingContract.connect(user2).claimTokens([0])
      await expect(action).to.be.reverted
    })

    it('Should revert before TGE', async () => {
      const { vestingContract, user2 } = await loadFixture(
        deployContractFixtureBeforeTGEWithUSer2Vest
      )
      const action = vestingContract.connect(user2).claimTokens([0])
      await expect(action).to.be.revertedWith('TokensNotUnlocked')
    })

    it("Should not claim from cancelled positions", async () => {
      const { vestingContract, erc20Contract, owner, tgeTimestamp, user2 } =
        await loadFixture(deployContractFixtureAtTGEWithUSer2Vest)
      await erc20Contract.approve(vestingContract.address, K100_TOKENS)
      await vestingContract.vestTokens(K100_TOKENS, user2.address)
      const user2BalanceBefore = await erc20Contract.balanceOf(user2.address)
      const ownerBalanceBefore = await erc20Contract.balanceOf(
        owner.address
      )
      const vestingContractBalanceBefore = await erc20Contract.balanceOf(
        vestingContract.address
      )
      await ethers.provider.send('evm_setNextBlockTimestamp', [
        tgeTimestamp.toNumber() + 60 * ONE_DAY,
      ])
      await vestingContract.cancelVesting(user2.address)
      await vestingContract.connect(user2).claimTokens([0])
      const user2BalanceAfter = await erc20Contract.balanceOf(user2.address)
      const vestingContractBalanceAfter = await erc20Contract.balanceOf(
        vestingContract.address
      )
      expect(user2BalanceAfter).to.be.eq(user2BalanceBefore)
      expect(vestingContractBalanceAfter).to.be.eq(
        0
      )
      expect(await erc20Contract.balanceOf(
        owner.address)).to.be.eq(vestingContractBalanceBefore.add(ownerBalanceBefore))
    })

    it('Should transfer tokens properly at TGE', async () => {
      const { vestingContract, erc20Contract, tgeTimestamp, user2 } =
        await loadFixture(deployContractFixtureBeforeTGEWithUSer2Vest)
      const user2BalanceBefore = await erc20Contract.balanceOf(user2.address)
      const claimable = K100_TOKENS.mul(TGE_UNLOCKED).div(10000)
      const vestingContractBalanceBefore = await erc20Contract.balanceOf(
        vestingContract.address
      )
      await ethers.provider.send('evm_setNextBlockTimestamp', [
        tgeTimestamp.toNumber(),
      ])
      await vestingContract.connect(user2).claimTokens([0])
      const user2BalanceAfter = await erc20Contract.balanceOf(user2.address)
      const vestingContractBalanceAfter = await erc20Contract.balanceOf(
        vestingContract.address
      )
      expect(user2BalanceAfter).to.be.eq(user2BalanceBefore.add(claimable))
      expect(vestingContractBalanceAfter).to.be.eq(
        vestingContractBalanceBefore.sub(claimable)
      )
    })

    it('Should transfer tokens properly after TGE', async () => {
      const { vestingContract, erc20Contract, tgeTimestamp, user2 } =
        await loadFixture(deployContractFixtureAtTGEWithUSer2Vest)
      const user2BalanceBefore = await erc20Contract.balanceOf(user2.address)
      const claimable = K100_TOKENS.mul(1666).div(10000)
      const vestingContractBalanceBefore = await erc20Contract.balanceOf(
        vestingContract.address
      )
      await ethers.provider.send('evm_setNextBlockTimestamp', [
        tgeTimestamp.toNumber() + 30 * ONE_DAY,
      ])
      await vestingContract.connect(user2).claimTokens([0])
      const user2BalanceAfter = await erc20Contract.balanceOf(user2.address)
      const vestingContractBalanceAfter = await erc20Contract.balanceOf(
        vestingContract.address
      )
      expect(user2BalanceAfter).to.be.eq(user2BalanceBefore.add(claimable))
      expect(vestingContractBalanceAfter).to.be.eq(
        vestingContractBalanceBefore.sub(claimable)
      )
    })

    it('Should transfer tokens properly from correct vesting positions', async () => {
      const { vestingContract, erc20Contract, tgeTimestamp, user2 } =
        await loadFixture(deployContractFixtureBeforeTGEWithUSer2Vest)
      await erc20Contract
        .connect(user2)
        .approve(vestingContract.address, K100_TOKENS)
      await ethers.provider.send('evm_setNextBlockTimestamp', [
        tgeTimestamp.toNumber(),
      ])
      await vestingContract
        .connect(user2)
        .vestTokens(K100_TOKENS, user2.address)

      const claimable = K100_TOKENS.mul(1666)
        .mul(2)
        .div(10000)
        .add(K100_TOKENS.mul(TGE_UNLOCKED).div(10000))

      const user2BalanceBefore = await erc20Contract.balanceOf(user2.address)
      const vestingContractBalanceBefore = await erc20Contract.balanceOf(
        vestingContract.address
      )

      await ethers.provider.send('evm_setNextBlockTimestamp', [
        tgeTimestamp.toNumber() + 30 * ONE_DAY,
      ])
      await vestingContract.connect(user2).claimTokens([1, 0])

      const user2BalanceAfter = await erc20Contract.balanceOf(user2.address)
      const vestingContractBalanceAfter = await erc20Contract.balanceOf(
        vestingContract.address
      )

      expect(user2BalanceAfter).to.be.eq(user2BalanceBefore.add(claimable))
      expect(vestingContractBalanceAfter).to.be.eq(
        vestingContractBalanceBefore.sub(claimable)
      )
    })

    it('Should update amount claimed', async () => {
      const { vestingContract, erc20Contract, tgeTimestamp, user2 } =
        await loadFixture(deployContractFixtureBeforeTGEWithUSer2Vest)
      await erc20Contract
        .connect(user2)
        .approve(vestingContract.address, K100_TOKENS)
      await ethers.provider.send('evm_setNextBlockTimestamp', [
        tgeTimestamp.toNumber(),
      ])
      await vestingContract
        .connect(user2)
        .vestTokens(K100_TOKENS, user2.address)

      let positionsBefore = await vestingContract.getVestingPositions(
        user2.address
      )
      expect(positionsBefore[0].amountClaimed).to.be.eq(0)
      expect(positionsBefore[1].amountClaimed).to.be.eq(
        K100_TOKENS.mul(TGE_UNLOCKED).div(10000)
      )

      await ethers.provider.send('evm_setNextBlockTimestamp', [
        tgeTimestamp.toNumber() + 30 * ONE_DAY,
      ])
      await vestingContract.connect(user2).claimTokens([1, 0])

      let positionsAfter = await vestingContract.getVestingPositions(
        user2.address
      )
      expect(positionsAfter[0].amountClaimed).to.be.eq(
        K100_TOKENS.mul(1666).div(10000)
      )
      expect(positionsAfter[1].amountClaimed).to.be.eq(
        K100_TOKENS.mul(1666).div(10000)
      )
    })

    it('Should emit TokensClaimed event', async () => {
      const { vestingContract, erc20Contract, tgeTimestamp, user2 } =
        await loadFixture(deployContractFixtureBeforeTGEWithUSer2Vest)
      await erc20Contract
        .connect(user2)
        .approve(vestingContract.address, K100_TOKENS)
      await ethers.provider.send('evm_setNextBlockTimestamp', [
        tgeTimestamp.toNumber(),
      ])
      await vestingContract
        .connect(user2)
        .vestTokens(K100_TOKENS, user2.address)

      await ethers.provider.send('evm_setNextBlockTimestamp', [
        tgeTimestamp.toNumber() + 30 * ONE_DAY,
      ])
      let action = vestingContract.connect(user2).claimTokens([1, 0])

      await expect(action)
        .to.emit(vestingContract, 'TokensClaimed')
        .withArgs(user2.address, 0, K100_TOKENS.mul(1666).div(10000))
        .and.to.emit(vestingContract, 'TokensClaimed')
        .withArgs(user2.address, 1, K100_TOKENS.mul(1666).div(10000))
    })
  })

  describe('AvailableToClaim', async () => {
    it('Should return 0 if timestamp is before TGE', async () => {
      const { vestingContract, tgeTimestamp, user2 } = await loadFixture(
        deployContractFixture
      )
      expect(
        await vestingContract.availableToClaim(
          user2.address,
          0,
          tgeTimestamp.sub(1)
        )
      ).to.be.eq(0)
    })

    it('Should return 0 if position is cancelled', async () => {
      const { vestingContract, tgeTimestamp, user2 } = await loadFixture(
        deployContractFixtureAtTGEWithUSer2Vest
      )
      expect(
        await vestingContract.availableToClaim(
          user2.address,
          0,
          tgeTimestamp.toNumber() + 30 * ONE_DAY
        )
      ).to.be.eq(K100_TOKENS.mul(1666).div(10000))
      await vestingContract.cancelVesting(user2.address)
      expect(
        await vestingContract.availableToClaim(
          user2.address,
          0,
          tgeTimestamp.toNumber() + 30 * ONE_DAY
        )
      ).to.be.eq(0)
    })

    it("Should revert if position doesn't exist", async () => {
      const { vestingContract, tgeTimestamp, user2 } = await loadFixture(
        deployContractFixture
      )
      const action = vestingContract.availableToClaim(
        user2.address,
        0,
        tgeTimestamp
      )
      await expect(action).to.be.reverted
    })

    describe('for vests set before TGE', async () => {
      it('Should return 8.33% claimable at/after TGE in <0-30) days of vesting position', async () => {
        const { vestingContract, tgeTimestamp, user2 } = await loadFixture(
          deployContractFixtureBeforeTGEWithUSer2Vest
        )
        const atTGE = await vestingContract.availableToClaim(
          user2.address,
          0,
          tgeTimestamp
        )
        const atAlmost30Days = await vestingContract.availableToClaim(
          user2.address,
          0,
          tgeTimestamp.add(30 * ONE_DAY - 1)
        )
        expect(atTGE).to.be.eq(K100_TOKENS.mul(TGE_UNLOCKED).div(10000))
        expect(atAlmost30Days).to.be.eq(atTGE)
      })

      it('Should return 33.33% claimable at/after TGE in <30,60) days of vesting position', async () => {
        const { vestingContract, tgeTimestamp, user2 } = await loadFixture(
          deployContractFixtureBeforeTGEWithUSer2Vest
        )
        const at30Days = await vestingContract.availableToClaim(
          user2.address,
          0,
          tgeTimestamp.add(30 * ONE_DAY)
        )
        const atAlmost60Days = await vestingContract.availableToClaim(
          user2.address,
          0,
          tgeTimestamp.add(60 * ONE_DAY - 1)
        )
        expect(at30Days).to.be.eq(
          K100_TOKENS.mul(TGE_UNLOCKED)
            .div(10000)
            .add(K100_TOKENS.mul(1666).div(10000))
        )
        expect(atAlmost60Days).to.be.eq(at30Days)
      })

      it('Should return 46.66% claimable at/after TGE in <60,90) days of vesting position', async () => {
        const { vestingContract, tgeTimestamp, user2 } = await loadFixture(
          deployContractFixtureBeforeTGEWithUSer2Vest
        )
        const at60Days = await vestingContract.availableToClaim(
          user2.address,
          0,
          tgeTimestamp.add(60 * ONE_DAY)
        )
        const atAlmost90Day = await vestingContract.availableToClaim(
          user2.address,
          0,
          tgeTimestamp.add(90 * ONE_DAY - 1)
        )
        expect(at60Days).to.be.eq(
          K100_TOKENS.mul(TGE_UNLOCKED)
            .div(10000)
            .add(K100_TOKENS.mul(2).mul(1666).div(10000))
        )
        expect(atAlmost90Day).to.be.eq(at60Days)
      })

      it('Should return 59.99% claimable at/after TGE in <90,120) days of vesting position', async () => {
        const { vestingContract, tgeTimestamp, user2 } = await loadFixture(
          deployContractFixtureBeforeTGEWithUSer2Vest
        )
        const at90Days = await vestingContract.availableToClaim(
          user2.address,
          0,
          tgeTimestamp.add(90 * ONE_DAY)
        )
        const atAlmostat120Days = await vestingContract.availableToClaim(
          user2.address,
          0,
          tgeTimestamp.add(120 * ONE_DAY - 1)
        )
        expect(at90Days).to.be.eq(
          K100_TOKENS.mul(TGE_UNLOCKED)
            .div(10000)
            .add(K100_TOKENS.mul(3).mul(1666).div(10000))
        )
        expect(atAlmostat120Days).to.be.eq(at90Days)
      })

      it('Should return 73.32% claimable at/after TGE in <120,150) days of vesting position', async () => {
        const { vestingContract, tgeTimestamp, user2 } = await loadFixture(
          deployContractFixtureBeforeTGEWithUSer2Vest
        )
        const at120Days = await vestingContract.availableToClaim(
          user2.address,
          0,
          tgeTimestamp.add(120 * ONE_DAY)
        )
        const atAlmost150Days = await vestingContract.availableToClaim(
          user2.address,
          0,
          tgeTimestamp.add(150 * ONE_DAY - 1)
        )
        expect(at120Days).to.be.eq(
          K100_TOKENS.mul(TGE_UNLOCKED)
            .div(10000)
            .add(K100_TOKENS.mul(4).mul(1666).div(10000))
        )
        expect(atAlmost150Days).to.be.eq(at120Days)
      })

      it('Should return 86.65% claimable at/after TGE in <150,180) days of vesting position', async () => {
        const { vestingContract, tgeTimestamp, user2 } = await loadFixture(
          deployContractFixtureBeforeTGEWithUSer2Vest
        )
        const at150Days = await vestingContract.availableToClaim(
          user2.address,
          0,
          tgeTimestamp.add(150 * ONE_DAY)
        )
        const atAlmost180Days = await vestingContract.availableToClaim(
          user2.address,
          0,
          tgeTimestamp.add(180 * ONE_DAY - 1)
        )
        expect(at150Days).to.be.eq(
          K100_TOKENS.mul(TGE_UNLOCKED)
            .div(10000)
            .add(K100_TOKENS.mul(5).mul(1666).div(10000))
        )
        expect(atAlmost180Days).to.be.eq(at150Days)
      })

      it('Should return 100% claimable at/after TGE after 180 days of vesting position', async () => {
        const { vestingContract, tgeTimestamp, user2 } = await loadFixture(
          deployContractFixtureBeforeTGEWithUSer2Vest
        )
        const at180Days = await vestingContract.availableToClaim(
          user2.address,
          0,
          tgeTimestamp.add(360 * ONE_DAY)
        )
        expect(at180Days).to.be.eq(K100_TOKENS)
      })
    })

    describe('for vests set at/after TGE', async () => {
      it('Should return 0% claimable at/after TGE in <0-30) days of vesting position', async () => {
        const { vestingContract, tgeTimestamp, user2 } = await loadFixture(
          deployContractFixtureAtTGEWithUSer2Vest
        )
        const atTGE = await vestingContract.availableToClaim(
          user2.address,
          0,
          tgeTimestamp
        )
        const atAlmost30Days = await vestingContract.availableToClaim(
          user2.address,
          0,
          tgeTimestamp.add(30 * ONE_DAY - 1)
        )
        expect(atTGE).to.be.eq(0)
        expect(atAlmost30Days).to.be.eq(atTGE)
      })

      it('Should return 13.33% claimable at/after TGE in <30,60) days of vesting position', async () => {
        const { vestingContract, tgeTimestamp, user2 } = await loadFixture(
          deployContractFixtureAtTGEWithUSer2Vest
        )
        const at30Days = await vestingContract.availableToClaim(
          user2.address,
          0,
          tgeTimestamp.add(30 * ONE_DAY)
        )
        const atAlmost60Days = await vestingContract.availableToClaim(
          user2.address,
          0,
          tgeTimestamp.add(60 * ONE_DAY - 1)
        )
        expect(at30Days).to.be.eq(K100_TOKENS.mul(1666).div(10000))
        expect(atAlmost60Days).to.be.eq(at30Days)
      })

      it('Should return 26.66% claimable at/after TGE in <60,90) days of vesting position', async () => {
        const { vestingContract, tgeTimestamp, user2 } = await loadFixture(
          deployContractFixtureAtTGEWithUSer2Vest
        )
        const at60Days = await vestingContract.availableToClaim(
          user2.address,
          0,
          tgeTimestamp.add(60 * ONE_DAY)
        )
        const atAlmost90Day = await vestingContract.availableToClaim(
          user2.address,
          0,
          tgeTimestamp.add(90 * ONE_DAY - 1)
        )
        expect(at60Days).to.be.eq(
          K100_TOKENS.mul(2).mul(1666).div(10000)
        )
        expect(atAlmost90Day).to.be.eq(at60Days)
      })

      it('Should return 39.99% claimable at/after TGE in <90,120) days of vesting position', async () => {
        const { vestingContract, tgeTimestamp, user2 } = await loadFixture(
          deployContractFixtureAtTGEWithUSer2Vest
        )
        const at90Days = await vestingContract.availableToClaim(
          user2.address,
          0,
          tgeTimestamp.add(90 * ONE_DAY)
        )
        const atAlmostat120Days = await vestingContract.availableToClaim(
          user2.address,
          0,
          tgeTimestamp.add(120 * ONE_DAY - 1)
        )
        expect(at90Days).to.be.eq(
          K100_TOKENS.mul(3).mul(1666).div(10000)
        )
        expect(atAlmostat120Days).to.be.eq(at90Days)
      })

      it('Should return 43.32% claimable at/after TGE in <120,150) days of vesting position', async () => {
        const { vestingContract, tgeTimestamp, user2 } = await loadFixture(
          deployContractFixtureAtTGEWithUSer2Vest
        )
        const at120Days = await vestingContract.availableToClaim(
          user2.address,
          0,
          tgeTimestamp.add(120 * ONE_DAY)
        )
        const atAlmost150Days = await vestingContract.availableToClaim(
          user2.address,
          0,
          tgeTimestamp.add(150 * ONE_DAY - 1)
        )
        expect(at120Days).to.be.eq(
          K100_TOKENS.mul(4).mul(1666).div(10000)
        )
        expect(atAlmost150Days).to.be.eq(at120Days)
      })

      it('Should return 56.65% claimable at/after TGE in <150,180) days of vesting position', async () => {
        const { vestingContract, tgeTimestamp, user2 } = await loadFixture(
          deployContractFixtureAtTGEWithUSer2Vest
        )
        const at150Days = await vestingContract.availableToClaim(
          user2.address,
          0,
          tgeTimestamp.add(150 * ONE_DAY)
        )
        const atAlmost180Days = await vestingContract.availableToClaim(
          user2.address,
          0,
          tgeTimestamp.add(180 * ONE_DAY - 1)
        )
        expect(at150Days).to.be.eq(
          K100_TOKENS.mul(5).mul(1666).div(10000)
        )
        expect(atAlmost180Days).to.be.eq(at150Days)
      })

      it('Should return 80% claimable at/after TGE after 180 days of vesting position', async () => {
        const { vestingContract, tgeTimestamp, user2 } = await loadFixture(
          deployContractFixtureAtTGEWithUSer2Vest
        )
        const at180Days = await vestingContract.availableToClaim(
          user2.address,
          0,
          tgeTimestamp.add(360 * ONE_DAY)
        )
        expect(at180Days).to.be.eq(
          K100_TOKENS.mul(10000 - TGE_UNLOCKED).div(10000)
        )
      })
    })
  })

  describe('GetVestingSchedule', async () => {
    it('Should return correct vesting schedule for vest set before/at TGE', async () => {
      const { vestingContract, tgeTimestamp, user2 } = await loadFixture(
        deployContractFixtureBeforeTGEWithUSer2Vest
      )
      const schedule = await vestingContract.getVestingSchedule(
        user2.address,
        0
      )
      const timestamps = schedule[0]
      const amounts = schedule[1]
      expect(timestamps[0]).to.be.eq(tgeTimestamp)
      expect(amounts[0]).to.be.eq(K100_TOKENS.mul(TGE_UNLOCKED).div(10000))
      expect(timestamps[1]).to.be.eq(tgeTimestamp.add(30 * ONE_DAY * 1))
      expect(amounts[1]).to.be.eq(K100_TOKENS.mul(1666).div(10000))
      expect(timestamps[2]).to.be.eq(tgeTimestamp.add(30 * ONE_DAY * 2))
      expect(amounts[2]).to.be.eq(K100_TOKENS.mul(1666).div(10000))
      expect(timestamps[3]).to.be.eq(tgeTimestamp.add(30 * ONE_DAY * 3))
      expect(amounts[3]).to.be.eq(K100_TOKENS.mul(1666).div(10000))
      expect(timestamps[4]).to.be.eq(tgeTimestamp.add(30 * ONE_DAY * 4))
      expect(amounts[4]).to.be.eq(K100_TOKENS.mul(1666).div(10000))
      expect(timestamps[5]).to.be.eq(tgeTimestamp.add(30 * ONE_DAY * 5))
      expect(amounts[5]).to.be.eq(K100_TOKENS.mul(1666).div(10000))
    })

    it('Should return correct vesting schedule for vest set after TGE', async () => {
      const { vestingContract, erc20Contract, tgeTimestamp, user, user2 } =
        await loadFixture(deployContractFixture)
      await erc20Contract
        .connect(user)
        .approve(vestingContract.address, K100_TOKENS)
      await ethers.provider.send('evm_setNextBlockTimestamp', [
        tgeTimestamp.toNumber() + 1000,
      ])
      await vestingContract.connect(user).vestTokens(K100_TOKENS, user2.address)
      const position = await vestingContract.vestingPositions(user2.address, 0)
      expect(position.startTimestamp).to.be.eq(tgeTimestamp.add(1000))
      const schedule = await vestingContract.getVestingSchedule(
        user2.address,
        0
      )
      const timestamps = schedule[0]
      const amounts = schedule[1]
      expect(timestamps[0]).to.be.eq(position.startTimestamp)
      expect(amounts[0]).to.be.eq(K100_TOKENS.mul(TGE_UNLOCKED).div(10000))
      expect(timestamps[1]).to.be.eq(
        position.startTimestamp.add(30 * ONE_DAY * 1)
      )
      expect(amounts[1]).to.be.eq(K100_TOKENS.mul(1666).div(10000))
      expect(timestamps[2]).to.be.eq(
        position.startTimestamp.add(30 * ONE_DAY * 2)
      )
      expect(amounts[2]).to.be.eq(K100_TOKENS.mul(1666).div(10000))
      expect(timestamps[3]).to.be.eq(
        position.startTimestamp.add(30 * ONE_DAY * 3)
      )
      expect(amounts[3]).to.be.eq(K100_TOKENS.mul(1666).div(10000))
      expect(timestamps[4]).to.be.eq(
        position.startTimestamp.add(30 * ONE_DAY * 4)
      )
      expect(amounts[4]).to.be.eq(K100_TOKENS.mul(1666).div(10000))
      expect(timestamps[5]).to.be.eq(
        position.startTimestamp.add(30 * ONE_DAY * 5)
      )
      expect(amounts[5]).to.be.eq(K100_TOKENS.mul(1666).div(10000))
      expect(timestamps[6]).to.be.eq(
        position.startTimestamp.add(30 * ONE_DAY * 6)
      )
    })
  })

  describe('CancelVesting', async () => {
    it("Should revert if called not by the owner", async () => {
      const { vestingContract, user2, user } = await loadFixture(
        deployContractFixture
      )
      const action = vestingContract.connect(user2).cancelVesting(user.address)
      await expect(action).to.be.revertedWith("Ownable: caller is not the owner")
    })

    it('Should transfer all unclaimed tokens back to owner', async () => {
      const { vestingContract, erc20Contract, owner, tgeTimestamp, user2 } =
        await loadFixture(deployContractFixtureAtTGEWithUSer2Vest)
      const user2BalanceBefore = await erc20Contract.balanceOf(user2.address)
      const claimable = K100_TOKENS.mul(1666).div(10000)
      const ownerBalanceBefore = await erc20Contract.balanceOf(
        owner.address
      )
      await ethers.provider.send('evm_setNextBlockTimestamp', [
        tgeTimestamp.toNumber() + 30 * ONE_DAY,
      ])
      await vestingContract.connect(user2).claimTokens([0]);
      await vestingContract.connect(owner).cancelVesting(user2.address)
      const user2BalanceAfter = await erc20Contract.balanceOf(user2.address)
      const ownerBalanceAfter = await erc20Contract.balanceOf(
        owner.address
      )
      expect(user2BalanceAfter).to.be.eq(user2BalanceBefore.add(claimable))
      expect(ownerBalanceAfter).to.be.eq(
        ownerBalanceBefore.add(K100_TOKENS).sub(claimable))
    })

    it('Should not send tokens from already claimed position to owner', async () => {
      const { vestingContract, erc20Contract, owner, tgeTimestamp, user2 } =
        await loadFixture(deployContractFixtureAtTGEWithUSer2Vest)
      const user2BalanceBefore = await erc20Contract.balanceOf(user2.address)
      const claimable = K100_TOKENS.mul(1666).div(10000)
      await ethers.provider.send('evm_setNextBlockTimestamp', [
        tgeTimestamp.toNumber() + 30 * ONE_DAY,
      ])
      await vestingContract.connect(user2).claimTokens([0]);
      await vestingContract.connect(owner).cancelVesting(user2.address)
      const ownerBalanceBefore = await erc20Contract.balanceOf(
        owner.address
      )
      await erc20Contract.approve(vestingContract.address, K100_TOKENS)
      await vestingContract.connect(owner).vestTokens(K100_TOKENS, user2.address);
      const positions = await vestingContract.getVestingPositions(user2.address)
      expect(positions[0].cancelled).to.be.true;
      expect(positions[1].cancelled).to.be.false;
      await vestingContract.connect(owner).cancelVesting(user2.address)
      const user2BalanceAfter = await erc20Contract.balanceOf(user2.address)
      const ownerBalanceAfter = await erc20Contract.balanceOf(
        owner.address
      )
      expect(user2BalanceAfter).to.be.eq(user2BalanceBefore.add(claimable))
      expect(ownerBalanceAfter).to.be.eq(
        ownerBalanceBefore)
      const afterPositions = await vestingContract.getVestingPositions(user2.address)
      expect(afterPositions[0].cancelled).to.be.true;
      expect(afterPositions[1].cancelled).to.be.true;
    })

    it('Should set vesting position to cancelled', async () => {
      const { vestingContract, owner, user2 } =
        await loadFixture(deployContractFixtureAtTGEWithUSer2Vest)
      await vestingContract.connect(owner).cancelVesting(user2.address)
      const positions = await vestingContract.getVestingPositions(user2.address)
      expect(positions[0].amount).to.be.eq(positions[0].amountClaimed)
      expect(positions[0].cancelled).to.be.true;
    })
  })
})
