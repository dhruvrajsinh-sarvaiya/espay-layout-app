/* 
    Developer : Nishant Vadgama
    Date : 18-09-2018
    File Comment : Wallet list file component
*/
import React, { Component } from "react";
import WalletList from "Components/Wallet/WalletList";

class WalletListIndex extends Component {
  render() {
    return <WalletList history={this.props.history} />;
  }
}

export default WalletListIndex;
