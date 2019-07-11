/**
 * Dasboard Routes
 */
import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

// async components
import {
  AsyncTrading_DashboardComponent,
  AsyncCooldexTrading_DashboardComponent,
  AsyncCooldexFiat_Component,
  AsyncCooldexFunding_Component,
  AsyncTradingDashboardComponent
} from "Components/AsyncComponent/AsyncComponent";

const Dashboard = ({ match }) => (
  <div className="dashboard-wrapper">
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/trading`} />
      <Route path={`${match.url}/advance`} component={AsyncTrading_DashboardComponent} />
      <Route path={`${match.url}/trading`} component={AsyncCooldexTrading_DashboardComponent} />
      <Route path={`${match.url}/CooldexFiat`} component={AsyncCooldexFiat_Component} />
      <Route path={`${match.url}/CooldexFunding`} component={AsyncCooldexFunding_Component} />
      <Route path={`${match.url}/trading2`} component={AsyncTradingDashboardComponent} />
    </Switch>
  </div>
);

export default Dashboard;
