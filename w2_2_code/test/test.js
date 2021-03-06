const { expect } = require('chai')
const { ethers } = require('hardhat')
const hre = require('hardhat')
const toWei = ethers.utils.parseEther

describe('Score', function () {

  let wallet
  let wallet2
  let wallet3
  let score
  let teacher

  beforeEach(async () => {
    [wallet, wallet2, wallet3] = await hre.ethers.getSigners()
 
    const Score = await hre.ethers.getContractFactory('Score')
    const Teacher = await hre.ethers.getContractFactory('Teacher')

    score = await Score.deploy()
    teacher = await Teacher.deploy(score.address)

 
    await score.setTeacher(teacher.address)
  })

  it('only teacher can modify score', async function () {
    await expect(score.setScore(wallet3.address, 99)).to.be.revertedWith('Score: NOT_TEACHER')
  })

  it('score must be below 100', async function () {
    await expect(teacher.setScore(wallet3.address, 200)).to.be.revertedWith('Score: INVALID_SCORE')
  })

  it('score must be set correct', async function () {
    await teacher.setScore(wallet3.address, 98)
    expect(await score.studentScore(wallet3.address)).to.be.equal(98)
  })
})
