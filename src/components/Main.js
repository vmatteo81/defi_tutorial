import React, { Component } from 'react'
import usdc from '../usdc.png'
import recry from '../recry.png'
import { Doughnut } from "react-chartjs-2";
import { buyChartColors } from "./ChartColors";
import { sellChartColors } from "./ChartColors";
import 'chart.js/auto';


const options = {
  legend: {
    display: false,
    position: "right"
  },
  elements: {
    arc: {
      borderWidth: 0
    }
  }
};

class Main extends Component {

  render() {
    
    if (this.props.isOwner=== false)
    {
    return (
      <div id="content" className="mt-3">

        <table className="table table-borderless text-muted text-center">
          <thead>
            <tr>
              <th scope="col">Buy Stats</th>
              <th scope="col">Sell Stats</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td scope="col">
               <Doughnut
                  data = {{
                      maintainAspectRatio: false,
                      responsive: false,
                      labels: ["Available", "Sold"],
                      datasets: [
                        {
                          data: [window.web3.utils.fromWei(this.props.recryMaxAvailable,'Ether'), window.web3.utils.fromWei(this.props.recryMaxSupply,'Ether')],
                          backgroundColor: buyChartColors,
                          hoverBackgroundColor: buyChartColors
                        }
                      ]
                    }
                  }
                  width={200}
                  height={200}
                  options={options} />
              </td>

              <td scope="col">
               <Doughnut
                  data = {{
                      maintainAspectRatio: false,
                      responsive: false,
                      labels: ["Available", "Sold"],
                      datasets: [
                        {
                          data: [window.web3.utils.fromWei(this.props.protocolGain,'Ether'), window.web3.utils.fromWei(this.props.usdcMaxSellAvailable,'Ether')],
                          backgroundColor: sellChartColors,
                          hoverBackgroundColor: sellChartColors
                        }
                      ]
                    }
                  }
                  width={200}
                  height={200}
                  options={options} />
              </td>
            </tr>
          </tbody>
        </table>

        <div className="card mb-4" >

          <div className="card-body">

            <form className="mb-3" onSubmit={(event) => {
                event.preventDefault()
                let amount
                amount = this.buy_amount.value.toString()
                console.log("amount:"+amount);
                amount = window.web3.utils.toWei(amount, 'Ether')
                console.log("wei-amount:"+amount);
                this.props.buyTokens(amount)
              }}>
              <div>
              <span className="float-left text-muted">
                  Recry Available: {window.web3.utils.fromWei(this.props.recryMaxAvailable, 'Ether')}
                </span>
                <span className="float-right text-muted">
                  Usdc Balance: {window.web3.utils.fromWei(this.props.usdcTokenBalance, 'Ether')}
                </span>
              </div>
              <div className="input-group mb-4">
                <input
                  type="text"
                  ref={(buy_amount) => { this.buy_amount = buy_amount }}
                  className="form-control form-control-lg input-number"
                  placeholder="0"
                  required />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <img src={usdc} height='32' alt=""/>
                    &nbsp;&nbsp;&nbsp; Usdc
                  </div>
                </div>
              <button type="submit" className="btn btn-buy btn-lg">Buy Recry!</button>
              </div>
            </form>
            <form className="mb-3" onSubmit={(event) => {
                event.preventDefault()
                let amount
                amount = this.sell_amount.value.toString()
                amount = window.web3.utils.toWei(amount, 'Ether')
                this.props.sellTokens(amount)
              }}>
              <div>
                <span className="float-left text-muted">
                  Usdc Available: {window.web3.utils.fromWei(this.props.usdcMaxSellAvailable, 'Ether')}
                </span>
                <span className="float-right text-muted">
                  Recry Balance: {window.web3.utils.fromWei(this.props.recryTokenBalance, 'Ether')}
                </span>
              </div>
              <div className="input-group mb-4">
                <input
                  type="text"
                  ref={(sell_amount) => { this.sell_amount = sell_amount }}
                  className="form-control form-control-lg input-number"
                  placeholder="0"
                  required />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <img src={recry} height='32' alt=""/>
                    &nbsp;&nbsp;&nbsp; Recry
                  </div>
                </div>
              <button type="submit" className="btn btn-sell btn-lg">Sell Recry!</button>
              </div>
            </form>

          </div>
        </div>

      </div>
    );
  }
  else {
  return (
    <div id="content" className="mt-3">

      <table className="table table-borderless text-muted text-center">
        <thead>
          <tr>
            <th scope="col">Buy Stats</th>
            <th scope="col">Sell Stats</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td scope="col">
             <Doughnut
                data = {{
                    maintainAspectRatio: false,
                    responsive: false,
                    labels: ["Available", "Sold"],
                    datasets: [
                      {
                        data: [window.web3.utils.fromWei(this.props.recryMaxAvailable,'Ether'), window.web3.utils.fromWei(this.props.recryMaxSupply,'Ether')],
                        backgroundColor: buyChartColors,
                        hoverBackgroundColor: buyChartColors
                      }
                    ]
                  }
                }
                width={200}
                height={200}
                options={options} />
            </td>

            <td scope="col">
             <Doughnut
                data = {{
                    maintainAspectRatio: false,
                    responsive: false,
                    labels: ["Available", "Sold"],
                    datasets: [
                      {
                        data: [window.web3.utils.fromWei(this.props.protocolGain,'Ether'), window.web3.utils.fromWei(this.props.usdcMaxSellAvailable,'Ether')],
                        backgroundColor: sellChartColors,
                        hoverBackgroundColor: sellChartColors
                      }
                    ]
                  }
                }
                width={200}
                height={200}
                options={options} />
            </td>
          </tr>
        </tbody>
      </table>

      <div className="card mb-4" >

        <div className="card-body">

          <form className="mb-3" onSubmit={(event) => {
              event.preventDefault()
              let amount
              amount = this.input.value.toString()
              amount = window.web3.utils.toWei(amount, 'Ether')
              this.props.stakeTokens(amount)
            }}>
            <div>
              <span className="float-left text-muted">
                Recry Available: {window.web3.utils.fromWei(this.props.recryMaxAvailable, 'Ether')}
              </span>
              <span className="float-right text-muted">
                Recry Balance: {window.web3.utils.fromWei(this.props.recryTokenBalance, 'Ether')}
              </span>
            </div>
            <div className="input-group mb-4">
              <input
                type="text"
                ref={(input) => { this.input = input }}
                className="form-control form-control-lg"
                placeholder="0"
                required />
              <div className="input-group-append">
                <div className="input-group-text">
                  <img src={recry} height='32' alt=""/>
                  &nbsp;&nbsp;&nbsp; Recry
                </div>
              </div>
            <button type="submit" className="btn btn-buy btn-lg">Add Recry Supply!</button>
            </div>
          </form>
          <form className="mb-3" onSubmit={(event) => {
              event.preventDefault()
              let amount
              amount = this.input.value.toString()
              amount = window.web3.utils.toWei(amount, 'Ether')
              this.props.stakeTokens(amount)
            }}>
            <div>
              <span className="float-left text-muted">
                Recry Available: {window.web3.utils.fromWei(this.props.recryMaxAvailable, 'Ether')}
              </span>
              <span className="float-right text-muted">
                Recry Balance: {window.web3.utils.fromWei(this.props.recryTokenBalance, 'Ether')}
              </span>
            </div>
            <div className="input-group mb-4">
              <input
                type="text"
                ref={(input) => { this.input = input }}
                className="form-control form-control-lg"
                placeholder="0"
                required />
              <div className="input-group-append">
                <div className="input-group-text">
                  <img src={recry} height='32' alt=""/>
                  &nbsp;&nbsp;&nbsp; Recry
                </div>
              </div>
            <button type="submit" className="btn btn-buy btn-lg">Change Recry Supply!</button>
            </div>
          </form>
          <form className="mb-3" onSubmit={(event) => {
              event.preventDefault()
              let amount
              amount = this.input.value.toString()
              amount = window.web3.utils.toWei(amount, 'Ether')
              this.props.stakeTokens(amount)
            }}>
            <div>
              <span className="float-left text-muted">
                Protocol Gain: {window.web3.utils.fromWei(this.props.protocolGain, 'Ether')}
              </span>
            </div>
            <div className="input-group mb-4">
              <input
                type="text"
                ref={(input) => { this.input = input }}
                className="form-control form-control-lg"
                placeholder="0"
                required />
              <div className="input-group-append">
                <div className="input-group-text">
                  <img src={usdc} height='32' alt=""/>
                  &nbsp;&nbsp;&nbsp; Usdc
                </div>
              </div>
            <button type="submit" className="btn btn-buy btn-lg">Add Protocol Gain!</button>
            </div>
          </form>
          <form className="mb-3" onSubmit={(event) => {
              event.preventDefault()
              let amount
              amount = this.input.value.toString()
              amount = window.web3.utils.toWei(amount, 'Ether')
              this.props.stakeTokens(amount)
            }}>
            <div>
              <span className="float-left text-muted">
                Protocol Gain: {window.web3.utils.fromWei(this.props.protocolGain, 'Ether')}
              </span>
            </div>
            <div className="input-group mb-4">
              <input
                type="text"
                ref={(input) => { this.input = input }}
                className="form-control form-control-lg"
                placeholder="0"
                required />
              <div className="input-group-append">
                <div className="input-group-text">
                  <img src={usdc} height='32' alt=""/>
                  &nbsp;&nbsp;&nbsp; Usdc
                </div>
              </div>
            <button type="submit" className="btn btn-buy btn-lg">Change Protocol Gain!</button>
            </div>
          </form>
          <form className="mb-3" onSubmit={(event) => {
              event.preventDefault()
              let amount
              amount = this.input.value.toString()
              amount = window.web3.utils.toWei(amount, 'Ether')
              this.props.stakeTokens(amount)
            }}>
            <div>
              <span className="float-left text-muted">
                Usdc Available: {window.web3.utils.fromWei(this.props.usdcMaxSellAvailable, 'Ether')}
              </span>
              <span className="float-right text-muted">
                Usdc Balance: {window.web3.utils.fromWei(this.props.usdcTokenBalance, 'Ether')}
              </span>
            </div>
            <div className="input-group mb-4">
              <input
                type="text"
                ref={(input) => { this.input = input }}
                className="form-control form-control-lg"
                placeholder="0"
                required />
              <div className="input-group-append">
                <div className="input-group-text">
                  <img src={usdc} height='32' alt=""/>
                  &nbsp;&nbsp;&nbsp; Usdc
                </div>
              </div>
            <button type="submit" className="btn btn-sell btn-lg">Withdraw Usdc!</button>
            </div>
          </form>
          <form className="mb-3" onSubmit={(event) => {
              event.preventDefault()
              let amount
              amount = this.input.value.toString()
              amount = window.web3.utils.toWei(amount, 'Ether')
              this.props.stakeTokens(amount)
            }}>
            <div>
              <span className="float-left text-muted">
                Recry Available: {window.web3.utils.fromWei(this.props.recryMaxAvailable, 'Ether')}
              </span>
              <span className="float-right text-muted">
                Recry Balance: {window.web3.utils.fromWei(this.props.recryTokenBalance, 'Ether')}
              </span>
            </div>
            <div className="input-group mb-4">
              <input
                type="text"
                ref={(input) => { this.input = input }}
                className="form-control form-control-lg"
                placeholder="0"
                required />
              <div className="input-group-append">
                <div className="input-group-text">
                  <img src={recry} height='32' alt=""/>
                  &nbsp;&nbsp;&nbsp; Recry
                </div>
              </div>
            <button type="submit" className="btn btn-sell btn-lg">Withdraw Recry!</button>
            </div>
          </form>

        </div>
      </div>

    </div>
    ); 
  }
  }
}

export default Main;
