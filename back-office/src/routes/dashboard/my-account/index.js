/* 
    Developer : Salim Deraiya
    Date : 19-11-2018
    File Comment : My Account Dashboard route index component
*/
import React, { Component } from "react";
import IntlMessages from "Util/IntlMessages";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import OrganizationDashboard from "Components/MyAccount/Dashboards/OrganizationDashboard";

// Component for my account dashboard
class MyAccountOrganizationDashboard extends Component {
    render() {
        const { match } = this.props;
        return (
            <div className="drawer-data myaccount-dashboard-wrapper">
                <PageTitleBar
                    title={<IntlMessages id="sidebar.myAccount" />}
                    match={match}
                />
                    <OrganizationDashboard />
            </div>
        );
    }
}

export default MyAccountOrganizationDashboard;