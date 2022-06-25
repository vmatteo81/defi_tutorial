import React, { Component } from 'react'
import logo from '../logo.png'
import bsc_logo from '../bsc.24b1e0ef.svg'

class Navbar extends Component {

  render() {
    return (
      <div className="MuiBox-root jss23">
       <header className="MuiPaper-root MuiAppBar-root MuiAppBar-positionStatic MuiAppBar-colorPrimary jss7 jss9 MuiPaper-elevation4">
       <div className="MuiContainer-root jss10 MuiContainer-maxWidthLg">
        <div className="MuiToolbar-root MuiToolbar-regular">
            <div className="MuiBox-root jss43 jss8"><a aria-current="page" className="jss13 jss15" href="/">Home</a>
            <div className="jss13"><a target="_blank" rel="noreferrer" href="https://vote.beefy.finance/">Vote</a>            </div>
            <div className="jss13"><a target="_blank" rel="noreferrer" href="https://dashboard.beefy.finance/">Stats</a></div>
            <div className="jss13"><a target="_blank" rel="noreferrer" href="https://blog.beefy.finance/articles/">Blog</a></div>
            <div className="jss13"><a target="_blank" rel="noreferrer" href="https://docs.beefy.finance">Docs</a></div>
          </div>
          <div className="MuiBox-root jss25 jss8 jss17">
            <img alt="RECRY" src={logo} className ="MuiAvatar-root MuiAvatar-circular"/>{window.web3.utils.fromWei(this.props.recryPrice, 'Ether')} $
          <div className="MuiBox-root jss258">
            <div className="jss17">
              <img alt="bsc" src={bsc_logo} /> BSC 
            </div>
          </div>
          <div>
            <button className="jss26">
              <div className="jss27 loading">
                <div className="jss29 loading"></div>
                <div className="jss29 loading"></div>
                <div className="jss29 loading"></div>
                <div className="jss29 loading"></div>
              </div>
            </button>
          </div>
          <div className="jss22">
            <div className="MuiBox-root jss65 jss58 jss61 jss62">
              <div className="MuiFormControl-root" noValidate="" autoComplete="off">
                <div className="MuiGrid-root MuiGrid-container MuiGrid-align-items-xs-center">
                  <div className="MuiAvatar-root MuiAvatar-circular">
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAALVJREFUWEdj3GnV8Z8BD9DZfBRF9oqvNT7lDKSqZxx1wKAPgaTClXjjnJDkvP5wvEoIpoFRB9A9BNDzMXoEkloOENKPkQZGHUD3EJBebYhSFxDKt4QSJan6GUcdMOhCAD3foscpqYmUUJrBSAOjDhjwEDjlJIPiBrN9TwhV+XjlCZmHkQYIaSDVNYTMG3UAweoYvf4nlK8JlRvo5o06YOBDAL0yIpRtSK3vCZlHcjYcdQC1QwAA3u8TMF/160AAAAAASUVORK5CYII=" className="MuiAvatar-img" />
                  </div>
                  <div className="jss59">{this.props.account_min}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
    </div>
    );
  }
}

export default Navbar;
