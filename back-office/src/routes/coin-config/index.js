/* 
    Developer : Nishant Vadgama
    Date : 15-10-2018
    File Comment : Coin Configuration add, update, delete, and list
*/
import React, { Component } from 'react';
// import component for Page Title
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
// Import component for internationalization
import IntlMessages from 'Util/IntlMessages';
import CoinList from 'Components/CoinList/CoinList';

class CoinListIndex extends Component {
    render() {
        return (
            <div className="wallet-list pb-20">
                <PageTitleBar title={<IntlMessages id="wallet.coinList" />} match={this.props.match} />
                <CoinList />
            </div>
        )
    }
}

export default CoinListIndex