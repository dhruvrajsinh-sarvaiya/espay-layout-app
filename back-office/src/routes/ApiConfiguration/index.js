/**
 * Api Configuration Menu Added By Tejas
 */
import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import LiquidityAPIManager from "Components/TradingWidgets/Configuration/Components/Liquidity-API-Manager";
import ExchangeFeedConfiguration from "Components/TradingWidgets/Configuration/Components/Exchange-Feed-Configuration";
import { AsyncLiquidityProviderComponent } from "Components/AsyncComponent/AsyncComponent";
import DaemonConfigure from "Components/TradingWidgets/Configuration/Components/Daemon-Configure";
import MatchEngine from "Routes/Api-Match-Engine";

const ApiConfiguration = ({ match }) => (
  <div className="dashboard-wrapper">
    <Switch>
      <Redirect
        exact
        from={`${match.url}/api-Configuration`}
        to={`${match.url}`}
      />
      <Route
        path={`${match.url}/Liquidity-API-Manager`}
        component={LiquidityAPIManager}
      />
      <Route
        path={`${match.url}/Exchange-Feed-Configuration`}
        component={ExchangeFeedConfiguration}
      />
      <Route
        path={`${match.url}/daemon-configure`}
        component={DaemonConfigure}
      />

      <Route
        path={`${match.url}/liquidity-provider`}
        component={AsyncLiquidityProviderComponent}
      />
      <Route path={`${match.url}/apimatchEngine`} component={MatchEngine} />
    </Switch>
  </div>
);

export default ApiConfiguration;
