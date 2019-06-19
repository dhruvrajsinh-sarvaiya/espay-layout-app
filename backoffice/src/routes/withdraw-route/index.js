import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import {
  AsyncWithdrawRouteComponent,
  AsyncAddWithdrawRouteComponent,
  AsyncEditWithdrawRouteComponent
} from "Components/AsyncComponent/AsyncComponent";

const WithdrawRoute = ({ match }) => (
  <div className="content-wrapper">
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/list`} />
      <Route
        path={`${match.url}/list`}
        component={AsyncWithdrawRouteComponent}
      />
      <Route
        path={`${match.url}/add`}
        component={AsyncAddWithdrawRouteComponent}
      />
      <Route
        path={`${match.url}/edit`}
        component={AsyncEditWithdrawRouteComponent}
      />
    </Switch>
  </div>
);

export default WithdrawRoute;
