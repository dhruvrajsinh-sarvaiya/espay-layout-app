/* 
    Developer : Nishant Vadgama
    Date : 18-09-2018
    File Comment : Wallet list file component
*/
import React, { Component } from 'react';
import WalletView from 'Components/Wallet/WalletView';

class WalletViewIndex extends Component {
    render() {
        return (
            <div className="wallet-list pb-20">
                <WalletView history={this.props.history} location={this.props.location}/>
            </div>
        )
    }
}

export default WalletViewIndex;