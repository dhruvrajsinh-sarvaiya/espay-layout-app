/* 
    Developer : Vishva Shah
    Date : 04-06-2019
    File Comment : List currency
*/
import React, { Component, Fragment } from "react";
import { injectIntl } from 'react-intl';
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
import {ListArbitrageWallet} from 'Components/Arbitrage';

class ArbitrageWallet extends Component {
    render() {
        const { intl } = this.props;
        return (
            <div className="History pb-20">
                <PageTitleBar title={intl.formatMessage({ id: "sidebar.Wallet" })} match={this.props.match} />
                <ListArbitrageWallet {...this.props} />
            </div>
        )
    }
}

export default injectIntl(ArbitrageWallet);
