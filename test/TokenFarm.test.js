const JookToken = artifacts.require('JookToken')
const DaiToken = artifacts.require('DaiToken')
const TokenFarm = artifacts.require('TokenFarm')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('TokenFarm', ([owner, recipient]) => {
  //writing tests in here
  let daiToken, jookToken, tokenFarm

  function tokens(n) {
    // A function to convert number (in tokens, as a String) to 'Wei' Ether value
    return web3.utils.toWei(n, 'ether')
  }

  before(async () => {
    daiToken = await DaiToken.new()
    jookToken = await JookToken.new()
    tokenFarm = await TokenFarm.new(jookToken.address, daiToken.address)

    // transfer to tokenfarm  (1 million tokens)
    //await jookToken.transfer(tokenFarm.address, '1000000000000000000000000')
    await jookToken.transfer(tokenFarm.address, tokens('1000000'))

    // Send tokens to desired account, from specified account
    await daiToken.transfer(recipient, tokens('100'), { from: owner })

  })


  describe('Mock Dai deployment', async () => {
    it('has a name', async () => {
      const name = await daiToken.name()
      assert.equal(name, 'Mock DAI Token') 
    })
  })

  describe('Jook Token deployment', async () => {
    it('has a name', async () => {
      const name = await jookToken.name()
      assert.equal(name, 'Jook Token') 
    })
  })
  
  describe('Token Farm deployment', async () => {
    it('has a name', async () => {
      const name = await tokenFarm.name()
      assert.equal(name, 'Jook Token Farm') 
    })

    it('contract has tokens', async () => {
      let balance = await jookToken.balanceOf(tokenFarm.address)
      assert.equal(balance.toString(), tokens('1000000'))
    })

  })

  describe('Farming Tokens', async () => {
    it('rewards for staking DAI tokens', async () => {
      let result

      // Check recipient's balance before staking
      result = await daiToken.balanceOf(recipient)
      assert.equal(result.toString(), tokens('100'), 'Recipient must correct DAI balance before staking') 

      // Stake Mock DAI Tokens -------------------
      //    the daiToken smart contract must approve of the amount of staking/ spending of said token before
      //    it is staked
      await daiToken.approve(tokenFarm.address, tokens('100'), { from: recipient })
      await tokenFarm.stakeTokens(tokens('100'), { from: recipient })

      result = await daiToken.balanceOf(recipient)
      assert.equal(result.toString(), tokens('0'), 'Recipient has incorrect DAI balance after staking')
      
      result = await daiToken.balanceOf(tokenFarm.address)
      assert.equal(result.toString(), tokens('100'), 'TokenFarm has incorrect DAI balance after staking')
      
      result = await tokenFarm.stakingBalance(recipient)
      assert.equal(result.toString(), tokens('100'), 'Recipient has incorrect DAI balance after staking')
      
      result = await tokenFarm.isStaking(recipient)
      assert.equal(result.toString(), 'true', 'Recipient has incorrect staking status after staking')


      // Issuing Tokens -------------------
      await tokenFarm.issueTokens({ from: owner })

      // Checking balance
      result = await jookToken.balanceOf(recipient)
      assert.equal(result.toString(), tokens('100'), 'Recipient JOOK token wallet balance incorrect after issuance')

      // Ensure that only the owner can issue/ provide tokens
      await tokenFarm.issueTokens({ from: recipient }).should.be.rejected;
      

      // Unstake Tokens --------------------------
      await tokenFarm.unstakeTokens({ from: recipient })

      // Check results
      result = await daiToken.balanceOf(recipient)
      assert.equal(result.toString(), tokens('100'), 'Recipient has incorrect DAI balance after unstaking')
      
      result = await daiToken.balanceOf(tokenFarm.address)
      assert.equal(result.toString(), tokens('0'), 'TokenFarm has incorrect DAI balance after unstaking')
      
      result = await tokenFarm.stakingBalance(recipient)
      assert.equal(result.toString(), tokens('0'), 'Recipient has incorrect DAI balance after unstaking')
      
      result = await tokenFarm.isStaking(recipient)
      assert.equal(result.toString(), 'false', 'Recipient has incorrect staking status after unstaking')
      

    })
  })

})