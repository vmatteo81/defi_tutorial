const Authority = artifacts.require('Authority')
const RecryptoToken = artifacts.require('RecryptoToken')
const UsdcToken = artifacts.require('UsdcToken')
const RecryUsdcSwap = artifacts.require('RecryUsdcSwap')

function tokens(n) {
  return web3.utils.toWei(n, 'ether');
}

module.exports = async function(deployer, network, accounts) {
  // Deploy authority
  await deployer.deploy(Authority)
  const authority = await Authority.deployed()

  // Deploy Mock DAI Token
  await deployer.deploy(UsdcToken)
  const usdcToken = await UsdcToken.deployed()

  // Deploy Dapp Token
  await deployer.deploy(RecryptoToken,authority.address)
  const recryToken = await RecryptoToken.deployed()

  // Deploy RecryUsdcSwap
  await deployer.deploy(RecryUsdcSwap, recryToken.address, usdcToken.address)
  const recryUsdcSwap = await RecryUsdcSwap.deployed()

  // Add RecryUsdcSwap to authorized
  await authority.addAuth(recryUsdcSwap.address)

  // Transfer all tokens to RecryUsdcSwap (1 million)
  await recryToken.approve(recryUsdcSwap.address, tokens('500000'), { from: accounts[0] })
  await recryUsdcSwap.addRecrySupply(tokens('500000'))

  // Transfer 1000 Mock Usdc tokens to investors
  await usdcToken.transfer(accounts[1],tokens('1000'))
  await usdcToken.transfer(accounts[2],tokens('1000'))
}
