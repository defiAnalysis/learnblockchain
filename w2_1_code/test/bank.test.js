const { expect } = require('chai')
const { ethers } = require('hardhat')
const hre = require('hardhat')
const toWei = ethers.utils.parseEther

describe('Bank', function () {

  let wallet, wallet2
  let provider
  let bank

  beforeEach(async () => {
    [wallet, wallet2] = await hre.ethers.getSigners()
    provider = hre.ethers.provider
    const Bank = await ethers.getContractFactory('Bank')
    bank = await Bank.deploy()
  })

  it('should send and record balance', async function () {
    await wallet2.sendTransaction({ to: bank.address, value: ethers.utils.parseEther('1') })
    const balanceOfSigner2 = await bank.balanceOf(wallet2.address)
  
    expect(balanceOfSigner2).to.equal(toWei('1'))
  })

  it('should not be withdraw by other address', async function () {
    await expect(bank.connect(wallet2).withdraw()).to.be.revertedWith('Bank:only owner')
  })

  it('should be withdraw all balance', async function () {
    await wallet2.sendTransaction({ to: bank.address, value: ethers.utils.parseEther('2') })
    const withdrawTx = await bank.withdraw()
    await withdrawTx.wait();
    const walletBalance = await provider.getBalance(wallet.address)
   
    expect(walletBalance).to.above(toWei('10000'))
  
    expect(await provider.getBalance(bank.address)).to.equal(0)
  })
})
