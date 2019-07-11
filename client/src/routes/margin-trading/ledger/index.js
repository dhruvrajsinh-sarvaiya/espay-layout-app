/* 
    Developer : Vishva Shah
    Date : 1-03-2019
    File Comment : Margin Wallet Ledger
*/
import React, { Component } from "react";
import { injectIntl } from 'react-intl';
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
import {ListMarginWalletLedger} from 'Components/MarginTrading';

class MarginTradingWalletsLedger extends Component {
    render() {
        const { intl } = this.props;
        return (
            <div className="History pb-20">
                <PageTitleBar title={intl.formatMessage({ id: "sidebar.Ledger" })} match={this.props.match} />
                <ListMarginWalletLedger {...this.props} />
            </div>
        )
    }
}

export default injectIntl(MarginTradingWalletsLedger);
