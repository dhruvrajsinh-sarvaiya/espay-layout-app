/**
 * Auther : Salim Deraiya
 * Created : 27/05/2019
 * updated by : Devang parekh
 * Arbitrage Routes..
 * update detail : add profit indicator route
 */
import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import ArbitrageDashboard from "./dashboard";
import ProfitIndicatorRoute from "./profitIndicator";
import ArbitrageLedgerReport from "./ledger";
import ArbitrageWallet from "./Wallet";

//added by Tejas 11/6/2019
import ArbitrageTrading from './ArbitrageTrading';
import ArbitrageOpenOrders from './open-orders';
import ArbitrageTransactionHistory from './transaction-history';

//added by parth andhariya (12-06-2019)
import ArbitrageAnalytics from './Analytics'
const Arbitrage = ({ match }) => (
    <div className="dashboard-wrapper">
        <Switch>
            <Redirect exact from={`${match.url}/arbitrage`} to={`${match.url}`} />
            <Route path={`${match.url}/dashboard`} component={ArbitrageDashboard} />
            <Route path={`${match.url}/trading`} component={ArbitrageTrading} />
            <Route path={`${match.url}/profit-indicator`} component={ProfitIndicatorRoute} />
            <Route path={`${match.url}/ledger`} component={ArbitrageLedgerReport} />
            <Route path={`${match.url}/Wallet`} component={ArbitrageWallet} />
            <Route path={`${match.url}/analytics`} component={ArbitrageAnalytics} />
            <Route path={`${match.url}/open-order`} component={ArbitrageOpenOrders} />
            <Route path={`${match.url}/transaction-history`} component={ArbitrageTransactionHistory} />
        </Switch>
    </div>
);

export default Arbitrage;