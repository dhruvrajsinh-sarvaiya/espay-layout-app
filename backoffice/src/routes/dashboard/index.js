/**
 * Dasboard Routes
 */
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

// async components
import {
    AsyncEcommerceDashboardComponent,
    AsyncSaasDashboardComponent,
    AsyncAgencyDashboardComponent,
    AsyncNewsDashboardComponent,
    AsyncTradingDashboardComponent,
    AsyncWalletDashboardComponent,
    AsyncMarginTradingDashboardComponent,
    // AsyncAdminPanelDashboardComponent,
    AsyncMyAccountDashboardComponent,
    AsyncCmsDashboardComponent,
    AsyncChatDashboardComponent,
    AsyncAPIKeyConfigurationDashboardComponent,
    AsyncFinancialDashboardComponent,
    AsyncArbitrageDashboardComponent, //added by parth andhariya (05-06-2019)
} from 'Components/AsyncComponent/AsyncComponent';

const Dashboard = ({ match }) => (
    <div className="dashboard-wrapper">
        <Switch>
            <Redirect exact from={`${match.url}/`} to={`${match.url}/trading`} />
            <Route path={`${match.url}/ecommerce`} component={AsyncEcommerceDashboardComponent} />
            <Route path={`${match.url}/saas`} component={AsyncSaasDashboardComponent} />
            <Route path={`${match.url}/agency`} component={AsyncAgencyDashboardComponent} />
            <Route path={`${match.url}/news`} component={AsyncNewsDashboardComponent} />
            <Route path={`${match.url}/trading`} component={AsyncTradingDashboardComponent} />
            <Route path={`${match.url}/wallet`} component={AsyncWalletDashboardComponent} />
            <Route path={`${match.url}/margin-trading`} component={AsyncMarginTradingDashboardComponent} />
            <Route path={`${match.url}/my-account`} component={AsyncMyAccountDashboardComponent} />
            {/* <Route path={`${match.url}/my-account1`} component={AsyncMyAccountDashboardComponent} /> */}
            <Route path={`${match.url}/cms`} component={AsyncCmsDashboardComponent} />
            <Route path={`${match.url}/Chat`} component={AsyncChatDashboardComponent} />
            <Route path={`${match.url}/ApiKeyConfiguration`} component={AsyncAPIKeyConfigurationDashboardComponent} />
            <Route path={`${match.url}/financial`} component={AsyncFinancialDashboardComponent} />
            <Route path={`${match.url}/Arbitrage`} component={AsyncArbitrageDashboardComponent} />

        </Switch>
    </div>
);

export default Dashboard;
