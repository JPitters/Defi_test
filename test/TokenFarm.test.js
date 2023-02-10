const JookToken = artifacts.require('JookToken')
const DaiToken = artifacts.require('DaiToken')
const TokenFarm = artifacts.require('TokenFarm')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('TokenFarm', (accounts) => {
  //writing tests in here
  let daiToken


  before(async () => {
    daiToken = await DaiToken.new()
  })


  describe('Mock Dai deployment', async () => {
    it('has a name', async () => {
      const name = await daiToken.name()
      assert.equal(name, 'Mock DAI Token') 
    })
  })
})