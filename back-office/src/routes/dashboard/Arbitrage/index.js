/* 
    Developer : Parth Andhariya
    Date : 05-06-2019
    File Comment : Arbitrage Dashboard route index component
*/
import React, { Component } from "react";
import IntlMessages from "Util/IntlMessages";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import ArbitrageAdminDashboard from "Components/Arbitrage/ArbitrageAdminDashboard";

// Component for wallet dashboard
class ArbitrageDashbaord extends Component {
    render() {
        const { match } = this.props;
        return (
            <div className="wallet-dashboard-wrapper">
                <PageTitleBar
                    title={<IntlMessages id="sidebar.Arbitrage" />}
                    match={match}
                />
                <ArbitrageAdminDashboard {...this.props} />
            </div>
        );
    }
}

export default ArbitrageDashbaord;
