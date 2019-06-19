/**
 * Dasboard Routes
 */
import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

//KYC Verify
//import TradingLedger from "./trading-ledger";

import OpenOrders from "./open-orders";
import SettledOrders from "./settled-orders";
import TradeSummary from "./Trade-Summary";
//import LiquidityAPIManager from "Routes/Liquidity-API-Manager";
import LiquidityAPIManager from "Components/TradingWidgets/Configuration/Components/Liquidity-API-Manager/components/LiquidityApiManagerList";
import ExchangeFeedConfiguration from "Components/TradingWidgets/Configuration/Components/Exchange-Feed-Configuration";

import ProviderConfiguration from "Components/TradingWidgets/Configuration/Components/ProviderConfiguration/ProviderConfigurationList";


import { AsyncLiquidityProviderComponent } from "Components/AsyncComponent/AsyncComponent";

// added By Tejas
import DaemonConfigure from "Components/TradingWidgets/Configuration/Components/Daemon-Configure";

// Added By Tejas
import TradeRecon from "Components/TradingWidgets/Reports/Components/TradeRecon";

// added By Tejas
import BugReport from "Routes/BugReport";

// added By Tejas
import ApiConfiguration from "Routes/ApiConfigurationWithdraw";

//Added by Tejas
import ManageMarkets from "Routes/ManageMarkets/ManageMarketList";

//Added by Tejas
import MatchEngine from "Routes/Api-Match-Engine";


const TradingReport = ({ match }) => (
  <div className="dashboard-wrapper">
    <Switch>
      <Redirect
        exact
        from={`${match.url}/trading-report`}
        to={`${match.url}`}
      />
      {/* <Route path={`${match.url}/trading-ledger`} component={TradingLedger} /> */}
      <Route path={`${match.url}/open-orders`} component={OpenOrders} />
      <Route path={`${match.url}/settled-orders`} component={SettledOrders} />
      <Route path={`${match.url}/Trade-Summary`} component={TradeSummary} />
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
      <Route path={`${match.url}/tradeRecon`} component={TradeRecon} />
      <Route path={`${match.url}/bugReport`} component={BugReport} />
      <Route
        path={`${match.url}/apiConfigurationWithdraw`}
        component={ApiConfiguration}
      />
      <Route path={`${match.url}/manageMarkets`} component={ManageMarkets} />
      <Route
        path={`${match.url}/liquidity-provider`}
        component={AsyncLiquidityProviderComponent}
      />
      <Route path={`${match.url}/apimatchEngine`} component={MatchEngine} />      
      <Route path={`${match.url}/providerConfiguration`} component={ProviderConfiguration} />
    </Switch>
  </div>
);

export default TradingReport;
