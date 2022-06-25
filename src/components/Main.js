import React, { Component } from 'react'
import usdc from '../usdc.png'
import { Doughnut } from "react-chartjs-2";
import { chartColors } from "./ChartColors";
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
    return (
      <div id="content" className="mt-3">

        <table className="table table-borderless text-muted text-center">
          <thead>
            <tr>
              <th scope="col">Token Available</th>
              <th scope="col">Token Price</th>
              <th scope="col">Total Balance</th>
              <th scope="col">Max Supply</th>
              <th scope="col">Current Available</th>
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
                          data: [window.web3.utils.fromWei(this.props.recryMaxAvailable,'Ether'), 5000],
                          backgroundColor: chartColors,
                          hoverBackgroundColor: chartColors
                        }
                      ]
                    }
                  }
                  width={200}
                  height={200}
                  options={options} />
              </td>
              <td>{window.web3.utils.fromWei(this.props.recryTokenBalance, 'Ether')} Recry</td>
              <td>{window.web3.utils.fromWei(this.props.recryPrice, 'Ether')} $</td>
              <td>{window.web3.utils.fromWei(this.props.recryTotal, 'Ether')} $</td>
              <td>{window.web3.utils.fromWei(this.props.recryMaxSupply, 'Ether')} $</td>
              <td>{window.web3.utils.fromWei(this.props.recryMaxAvailable, 'Ether')} $</td>
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
                <label className="float-left"><b>Stake Tokens</b></label>
                <span className="float-right text-muted">
                  Balance: {window.web3.utils.fromWei(this.props.usdcTokenBalance, 'Ether')}
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
              </div>
              <button type="submit" className="btn btn-primary btn-block btn-lg">STAKE!</button>
            </form>
            <button
              type="submit"
              className="btn btn-link btn-block btn-sm"
              onClick={(event) => {
                event.preventDefault()
                this.props.unstakeTokens()
              }}>
                UN-STAKE...
              </button>
          </div>
        </div>

      </div>
    );
  }
}

export default Main;
