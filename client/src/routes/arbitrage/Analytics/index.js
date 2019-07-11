/**
 * Auther : Parth Andhariya
 * Created : 12/06/2019
 * updated by :
 * Arbitrage Analytics route....
 */
import React, { Component } from "react";
// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
// intl messages
import IntlMessages from "Util/IntlMessages";
import { Analytics } from "Components/Arbitrage";
import { injectIntl } from 'react-intl';

class ArbitrageAnalytics extends Component {
    render() {
        return (
            <div className="History pb-20">
                <PageTitleBar title={<IntlMessages id="sidebar.analytics" />} match={this.props.match} />
                <Analytics {...this.props} />
            </div>
        );
    }
}

export default injectIntl(ArbitrageAnalytics);