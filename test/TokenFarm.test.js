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

})