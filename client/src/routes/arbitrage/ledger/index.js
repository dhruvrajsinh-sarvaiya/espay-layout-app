/* 
    Developer : Vishva Shah
    Date : 04-06-2019
    File Comment : Arbitrage report
*/
import React, { Component } from "react";
import { injectIntl } from 'react-intl';
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
import {LedgerReport} from 'Components/Arbitrage';

class ArbitrageLedgerReport extends Component {
    render() {
        const { intl } = this.props;
        return (
            <div className="History pb-20">
                <PageTitleBar title={intl.formatMessage({ id: "sidebar.Ledger" })} match={this.props.match} />
                <LedgerReport {...this.props} />
            </div>
        )
    }
}

export default injectIntl(ArbitrageLedgerReport);
