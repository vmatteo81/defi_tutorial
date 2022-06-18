const RecryptoToken = artifacts.require('RecryptoToken')
const UsdcToken = artifacts.require('UsdcToken')
const RecryUsdcSwap = artifacts.require('RecryUsdcSwap')

module.exports = async function(deployer, network, accounts) {
  // Deploy Mock DAI Token
  await deployer.deploy(UsdcToken)
  const usdcToken = await UsdcToken.deployed()

  // Deploy Dapp Token
  await deployer.deploy(RecryptoToken)
  const recryToken = await RecryptoToken.deployed()

  // Deploy RecryUsdcSwap
  await deployer.deploy(RecryUsdcSwap, recryToken.address, usdcToken.address)
  const recryUsdcSwap = await RecryUsdcSwap.deployed()

  // Transfer all tokens to RecryUsdcSwap (1 million)
  await recryToken.transfer(recryUsdcSwap.address, '500000000000000000000000')

  // Transfer 1000 Mock Usdc tokens to investors
  await usdcToken.transfer(accounts[1], '1000000000000000000000')
  await usdcToken.transfer(accounts[2], '1000000000000000000000')
}
