/* 
    Developer : Nishant Vadgama
    Date : 19-11-2018
    File Comment : Wallet Dashboard route index component
*/
import React, { Component } from "react";
import IntlMessages from "Util/IntlMessages";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import AdminDashboard from "Components/Wallet/AdminDashboard";

// Component for wallet dashboard
class WalletDashbaord extends Component {
    render() {
        const { match } = this.props;
        return (
            <div className="wallet-dashboard-wrapper">
                <PageTitleBar
                    title={<IntlMessages id="sidebar.walletMenu" />}
                    match={match}
                />
                <AdminDashboard {...this.props} />
            </div>
        );
    }
}

export default WalletDashbaord;
