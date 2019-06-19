/**
 * Auther : devang parekh
 * Created : 7/06/2019
 * updated by :
 * Arbitrage profit indicator route....
 */
import React, { Component } from "react";
// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
// intl messages
import IntlMessages from "Util/IntlMessages";
import { ProfitIndicator } from "Components/Arbitrage";

export default class ProfitIndicatorRoute extends Component {
    render() {
        return (
            <div>
                <PageTitleBar title={<IntlMessages id="sidebar.profitIndicator" />} match={this.props.match} />
                <ProfitIndicator {...this.props} />
            </div>
        );
    }
}