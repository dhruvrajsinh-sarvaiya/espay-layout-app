/* 
    Developer : Nishant Vadgama
    Date : 18-09-2018
    File Comment : Wallet list file component
*/
import React, { Component } from 'react';
// import component for Page Title
//import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
// Import component for internationalization
import IntlMessages from 'Util/IntlMessages';
import WalletView from 'Components/Wallet/WalletView';

class WalletViewIndex extends Component {
    render() {
        return (
            <div className="wallet-list pb-20">
                {/*<PageTitleBar title={<IntlMessages id="wallet.walletDetails" />} match={this.props.match} />*/}
                <WalletView history={this.props.history} location={this.props.location}/>
            </div>
        )
    }
}

export default WalletViewIndex;