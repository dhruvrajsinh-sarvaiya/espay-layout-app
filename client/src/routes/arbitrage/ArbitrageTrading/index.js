// added by Tejas for handle Route of Arbitrage Trading 11/6/2019

import React, { Component } from "react";

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
// intl messages
import IntlMessages from "Util/IntlMessages";
import { ArbitrageTrading } from "Components/Arbitrage";

export default class ArbitrageTradingDashboard extends Component {
    render() {
        return (
            <div>
                <PageTitleBar title={<IntlMessages id="sidebar.arbitrageTrading" />} match={this.props.match} />
                <ArbitrageTrading {...this.props} />
            </div>
        );
    }
}