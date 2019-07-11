import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

// async components for admin wallet page
import {
  AsyncTradeRouteComponent,
  AsyncAddTradeRouteComponent,
  AsyncEditTradeRouteComponent
} from "Components/AsyncComponent/AsyncComponent";
// redirect routes from index
const TradeRoute = ({ match }) => (
  <div className="content-wrapper">
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/list`} />
      <Route path={`${match.url}/list`} component={AsyncTradeRouteComponent} />
      <Route
        path={`${match.url}/add`}
        component={AsyncAddTradeRouteComponent}
      />
      <Route
        path={`${match.url}/edit`}
        component={AsyncEditTradeRouteComponent}
      />
    </Switch>
  </div>
);

export default TradeRoute;
