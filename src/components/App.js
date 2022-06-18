import React, { Component } from 'react'
import Web3 from 'web3'
import UsdcToken from '../abis/UsdcToken.json'
import ReCryptoToken from '../abis/ReCryptoToken.json'
import RecryUsdcSwap from '../abis/RecryUsdcSwap.json'
import Navbar from './Navbar'
import Main from './Main'
import './App.css'

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadBlockchainData() {
    const web3 = window.web3

    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    const networkId = await web3.eth.net.getId()

    // Load UsdcToken
    const usdcTokenData = UsdcToken.networks[networkId]
    if(usdcTokenData) {
      const usdcToken = new web3.eth.Contract(UsdcToken.abi, usdcTokenData.address)
      this.setState({ usdcToken })
      let usdcTokenBalance = await usdcToken.methods.balanceOf(this.state.account).call()
      this.setState({ usdcTokenBalance: usdcTokenBalance.toString() })
    } else {
      window.alert('UsdcToken contract not deployed to detected network.')
    }

    // Load ReCryptoToken
    const recryTokenData = ReCryptoToken.networks[networkId]
    if(recryTokenData) {
      const recryToken = new web3.eth.Contract(ReCryptoToken.abi, recryTokenData.address)
      this.setState({ recryToken })
      let recryTokenBalance = await recryToken.methods.balanceOf(this.state.account).call()
      this.setState({ recryTokenBalance: recryTokenBalance.toString() })
    } else {
      window.alert('ReCryptoToken contract not deployed to detected network.')
    }


    // Load RecryUsdcSwap
    const recryUsdcSwapData = RecryUsdcSwap.networks[networkId]
    if(recryUsdcSwapData) {
      const recryUsdcSwap = new web3.eth.Contract(RecryUsdcSwap.abi, recryUsdcSwapData.address)
      this.setState({ recryUsdcSwap })
      let recryValue = await recryUsdcSwap.methods.getRecryValue().call()
      this.setState({ recryValue: recryValue.toString() })
      let recryPrice = await recryUsdcSwap.methods.getRecryPrice().call()
      this.setState({ recryPrice: recryPrice.toString() })
      let recryTotal = await recryUsdcSwap.methods.getTotalValue().call()
      this.setState({ recryTotal: recryTotal.toString() })
      let recryMaxSupply = await recryUsdcSwap.methods.getMaxSupply().call()
      this.setState({ recryMaxSupply: recryMaxSupply.toString() })
      let recryMaxAvailable = await recryUsdcSwap.methods.getMaxAvailable().call()
      this.setState({ recryMaxAvailable: recryMaxAvailable.toString() })
    } else {
      window.alert('RecryUsdcSwap contract not deployed to detected network.')
    }

    this.setState({ loading: false })
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  stakeTokens = (amount) => {
    this.setState({ loading: true })
    this.state.usdcToken.methods.approve(this.state.recryUsdcSwap._address, amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.state.recryUsdcSwap.methods.stakeTokens(amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      })
    })
  }

  unstakeTokens = (amount) => {
    this.setState({ loading: true })
    this.state.recryUsdcSwap.methods.unstakeTokens().send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.setState({ loading: false })
    })
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      usdcToken: {},
      recryToken: {},
      recryUsdcSwap: {},
      usdcTokenBalance: '0',
      recryTokenBalance: '0',
      recryValue:'0',
      recryPrice: '0',
      recryTotal: '0',
      recryMaxSupply: '0',
      recryMaxAvailable: '0',
      loading: true
    }
  }

  render() {
    let content
    if(this.state.loading) {
      content = <p id="loader" className="text-center">Loading...</p>
    } else {
      content = <Main
        usdcTokenBalance={this.state.usdcTokenBalance}
        recryTokenBalance={this.state.recryTokenBalance}
        recryValue={this.state.recryValue}
        recryPrice={this.state.recryPrice}
        recryTotal={this.state.recryTotal}
        recryMaxSupply = {this.state.recryMaxSupply}
        recryMaxAvailable = {this.state.recryMaxAvailable}
        stakeTokens={this.stakeTokens}
        unstakeTokens={this.unstakeTokens}
      />
    }

    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                </a>

                {content}

              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
