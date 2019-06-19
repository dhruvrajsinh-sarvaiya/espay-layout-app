/**
 * Auther : Salim Deraiya
 * Created : 27/05/2019
 * updated by :
 * Arbitrage dashboard route....
 */
import React, { Component } from "react";
// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
// intl messages
import IntlMessages from "Util/IntlMessages";
import { Dashboard } from "Components/Arbitrage";

export default class ArbitrageDashboard extends Component {
    render() {
        return (
            <div className="arbitrage-dashboard">
                {/* <PageTitleBar title={<IntlMessages id="sidebar.arbitrageDashboard" />} match={this.props.match} /> */}
                <Dashboard {...this.props} />
            </div>
        );
    }
}