const JookToken = artifacts.require('JookToken')
const DaiToken = artifacts.require('DaiToken')
const TokenFarm = artifacts.require('TokenFarm')

module.exports = async function(deployer, network, accounts) {
  // Used to deploy smart contracts to the blockchain

  // Deploy mock DAI Token
  await deployer.deploy(DaiToken)
  const daiToken = await DaiToken.deployed()

  // Deploy Jook Token
  await deployer.deploy(JookToken)
  const jookToken = await JookToken.deployed()

  // previosuly deployer.deploy(TokenFarm)
  // changed to provide the function with some arguments, specifically
  // some information on the smart contracts
  await deployer.deploy(TokenFarm, jookToken.address, daiToken.address)
  const tokenFarm = await TokenFarm.deployed()
  
  // Transfering value to the liquidity pool, i.e. TokenFarm (1 mil; 18 decimal places)
  await jookToken.transfer(tokenFarm.address, '1000000000000000000000000')
  
  // Transfer 100 mock DAI to specified account
  await daiToken.transfer(accounts[1], '100000000000000000000')

}
