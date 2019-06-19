/* 
    Developer : Salim Deraiya
    Date : 19-11-2018
    File Comment : My Account Dashboard route index component
*/
import React, { Component } from "react";
import IntlMessages from "Util/IntlMessages";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import OrganizationDashboard from "Components/MyAccount/Dashboards/OrganizationDashboard";
// import { checkAndGetMenuAccessDetail } from 'Helpers/helpers';

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
                {/* {checkAndGetMenuAccessDetail('E8FEEB92-0BD0-5246-4B49-44D3FC9E071B') && //E8FEEB92-0BD0-5246-4B49-44D3FC9E071B */}
                    <OrganizationDashboard />
                {/* } */}
            </div>
        );
    }
}

export default MyAccountOrganizationDashboard;