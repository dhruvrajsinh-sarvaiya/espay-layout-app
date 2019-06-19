// Api Key Configuration Dashboard By Tejas Date : 21/2/2019
//Update By Sanjay 
//Updated On 18/03/2019

import React from 'react';
import IntlMessages from "Util/IntlMessages";
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";
import ApiKeyConfigurationDashboard from "Components/ApiKeyConfiguration/ApiKeyConfigurationDashboard";

class ApiKeyConfiguration extends React.Component {
    render() {
        const { match } = this.props;
        return (
            <div className="drawer-data trading-dashboard-wrapper pblc_api">
                <PageTitleBar
                    title={<IntlMessages id="sidebar.ApiKeyConfiguration" />}
                    match={match}
                />
                <ApiKeyConfigurationDashboard {...this.props} />             
            </div>
        )
    }
}

export default ApiKeyConfiguration;

