/* 
    Developer : Nishant Vadgama
    Date : 19-11-2018
    File Comment : Wallet Dashboard route index component
*/
import React, { Component } from "react";
import IntlMessages from "Util/IntlMessages";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import PresonalDashboard from "Components/MyAccount/PresonalDashboard";

// Component for wallet dashboard
class MyAccountPresonalDashboard extends Component {
    render() {
        const { match } = this.props;
        return (
            <div className="myaccount-dashboard-wrapper">
                <PageTitleBar
                    title={<IntlMessages id="my_account.dashboard" />}
                    match={match}
                />
                <PresonalDashboard />
            </div>
        );
    }
}

export default MyAccountPresonalDashboard;