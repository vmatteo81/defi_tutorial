const Authority = artifacts.require('Authority')
const RecryptoToken = artifacts.require('RecryptoToken')
const ReEURToken = artifacts.require('ReEURToken')
const SwapRecryEur = artifacts.require('SwapRecryEur')
const EurUsd = artifacts.require('EurUsd')

function tokens(n) {
  return web3.utils.toWei(n, 'ether');
}

module.exports = async function(deployer, network, accounts) {
  // Deploy authority
  await deployer.deploy(Authority)
  const authority = await Authority.deployed()

  // Deploy Mock DAI Token
  await deployer.deploy(ReEURToken)
  const reEurToken = await ReEURToken.deployed()

  // Deploy Dapp Token
  await deployer.deploy(RecryptoToken,authority.address)
  const recryToken = await RecryptoToken.deployed()

  //Depoly eurusd change
  await deployer.deploy(EurUsd)
  const eurusd = await EurUsd.deployed()
  // Deploy SwapRecryEur
  await deployer.deploy(SwapRecryEur, recryToken.address, reEurToken.address)
  const swapRecryEur = await SwapRecryEur.deployed()

  // Add SwapRecryEur to authorized
  await authority.addAuth(swapRecryEur.address)

  // Transfer all tokens to SwapRecryEur (1 million)
  await recryToken.approve(swapRecryEur.address, tokens('500000'), { from: accounts[0] })
  await swapRecryEur.addRecrySupply(tokens('500000'))

  // Transfer 1000 Mock Usdc tokens to investors
  await reEurToken.transfer(accounts[1],tokens('1000'))
  await reEurToken.transfer(accounts[2],tokens('1000'))
}
