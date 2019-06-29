/* 
    Developer : Nishant Vadgama
    Date : 19-02-2019
    File Comment : margin trading wallet management
*/
import React, { Component } from "react";
import { injectIntl } from 'react-intl';
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';

import {ListMarginWallets} from 'Components/MarginTrading';

class MarginTradingWallets extends Component {
    render() {
        const { intl } = this.props;
        return (
            <div className="History pb-20">
                <PageTitleBar title={intl.formatMessage({ id: "sidebar.wallet" })} match={this.props.match} />
                <ListMarginWallets {...this.props} />
            </div>
        )
    }
}

export default injectIntl(MarginTradingWallets);
