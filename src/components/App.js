import React, { Component } from 'react'
import Web3 from 'web3'
import ReEURToken from '../abis/ReEURToken.json'
import ReCryptoToken from '../abis/ReCryptoToken.json'
import SwapRecryEur from '../abis/SwapRecryEur.json'
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
    this.setState({ account_min: accounts[0].substring(0,6)+'...'+accounts[0].substring(accounts[0].length-4) })

    const networkId = await web3.eth.net.getId()

    // Load ReEURToken
    const eurTokenData = ReEURToken.networks[networkId]
    if(eurTokenData) {
      const eurToken = new web3.eth.Contract(ReEURToken.abi, eurTokenData.address)
      this.setState({ eurToken })
      let eurTokenBalance = await eurToken.methods.balanceOf(this.state.account).call()
      this.setState({ eurTokenBalance: eurTokenBalance.toString() })
    } else {
      window.alert('ReEURToken contract not deployed to detected network.')
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


    // Load SwapRecryEur
    const SwapRecryEurData = SwapRecryEur.networks[networkId]
    if(SwapRecryEurData) {
      const swapRecryEur = new web3.eth.Contract(SwapRecryEur.abi, SwapRecryEurData.address)
      this.setState({ swapRecryEur })
      let recryValue = await swapRecryEur.methods.getRecryValue().call()
      this.setState({ recryValue: recryValue.toString() })
      let recryPrice = await swapRecryEur.methods.getRecryPrice().call()
      this.setState({ recryPrice: recryPrice.toString() })
      let recryTotal = await swapRecryEur.methods.getRecryTotalValue().call()
      this.setState({ recryTotal: recryTotal.toString() })
      let recryMaxSupply = await swapRecryEur.methods.getRecryMaxSupply().call()
      this.setState({ recryMaxSupply: recryMaxSupply.toString() })
      let recryMaxAvailable = await swapRecryEur.methods.getRecryMaxAvailable().call()
      this.setState({ recryMaxAvailable: recryMaxAvailable.toString() })
      let eurMaxSellAvailable = await swapRecryEur.methods.getReEURMaxAvailable().call()
      this.setState({ eurMaxSellAvailable: eurMaxSellAvailable.toString() })
      let protocolGain = await swapRecryEur.methods.getProtocolGain().call()
      this.setState({ protocolGain: protocolGain.toString() })
      this.setState({ isOwner: false })
      if (accounts[0] === await swapRecryEur.methods.getOwner().call())
      {
        this.setState({ isOwner: true })
      }
    } else {
      window.alert('SwapRecryEur contract not deployed to detected network.')
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

  buyTokens = (amount) => {
    this.setState({ loading: true })
    this.state.eurToken.methods.approve(this.state.swapRecryEur._address, amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.state.swapRecryEur.methods.buyRecryWithReEUR(amount).send({ from: this.state.account })
      .on('transactionHash', (hash) => {this.setState({ loading: false })})
      .on('error',(error) =>this.setState({ loading: false }))
    })
  }

  sellTokens = (amount) => {
    this.setState({ loading: true })
    this.state.recryToken.methods.approve(this.state.swapRecryEur._address, amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.state.swapRecryEur.methods.sellRecryWithReEUR(amount).send({ from: this.state.account })
      .on('transactionHash', (hash) => {this.setState({ loading: false })
      .on('error',(error) =>this.setState({ loading: false }))
      })
    })
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      account_min :'0x0',
      eurToken: {},
      recryToken: {},
      swapRecryEur: {},
      eurTokenBalance: '0',
      recryTokenBalance: '0',
      recryValue:'0',
      recryPrice: '0',
      recryTotal: '0',
      recryMaxSupply: '0',
      recryMaxAvailable: '0',
      protocolGain: '0',
      eurMaxSellAvailable: '0',
      isOwner: false,
      loading: true
    }
  }

  render() {
    let content
    if(this.state.loading) {
      content = <p id="loader" className="text-center">Loading...</p>
    } else {
      content = <Main
        eurTokenBalance={this.state.eurTokenBalance}
        recryTokenBalance={this.state.recryTokenBalance}
        recryValue={this.state.recryValue}
        recryPrice={this.state.recryPrice}
        recryTotal={this.state.recryTotal}
        recryMaxSupply = {this.state.recryMaxSupply}
        recryMaxAvailable = {this.state.recryMaxAvailable}
        protocolGain = {this.state.protocolGain}
        eurMaxSellAvailable = {this.state.eurMaxSellAvailable}
        isOwner = {this.state.isOwner}
        buyTokens={this.buyTokens}
        sellTokens={this.sellTokens}
      />
    }

    return (
      <div>
        <Navbar account_min={this.state.account_min} recryPrice={this.state.recryPrice}  />
        <div className="container-fluid">
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
