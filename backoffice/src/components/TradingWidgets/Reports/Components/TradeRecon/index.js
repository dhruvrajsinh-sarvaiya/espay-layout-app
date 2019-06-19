// Component for Trade Recon LIst and Edit Action
import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

// async components for Trade Recon LIst
import {
  AsyncTradeReconListComponent,
  AsyncTradeReconEditComponent
} from "Components/AsyncComponent/AsyncComponent";
// redirect routes from index
const TradeRecon = ({ match }) => (
  <div className="mb-10  content-wrapper">
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/list`} />
      <Route
        path={`${match.url}/list`}
        component={AsyncTradeReconListComponent}
      />
      <Route
        path={`${match.url}/Edit`}
        component={AsyncTradeReconEditComponent}
      />
    </Switch>
  </div>
);

export default TradeRecon;
