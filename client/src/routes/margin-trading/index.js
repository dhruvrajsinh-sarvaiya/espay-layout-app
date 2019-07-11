/* 
    Developer : Nishant Vadgama
    Date : 19-02-2019
    File Comment : margin trading initial route
*/
import React, { Fragment } from "react";
import { Route, Switch } from "react-router-dom";

// async components for marging trading page
import {
    AsyncMarginTradingWalletComponent,
    AsyncMarginTradingComponent,
    AsyncMarginLeverageReport,
    AsyncMarginTradingWalletledgerComponent,
    AsyncMarginTradingHistoryComponent,// added by devang parekh (6-3-2019)
    AsyncprofitlossComponent,
    OpenPositionReport// added by parth andhariya 22-04-2019
} from "Components/AsyncComponent/AsyncComponent";
// redirect routes from index
const MaringTrading = ({ match }) => (
    <Fragment>
        <Switch>

            <Route path={`${match.url}/leverage-report`} component={AsyncMarginLeverageReport} />
            <Route path={`${match.url}/wallet`} component={AsyncMarginTradingWalletComponent} />
            <Route path={`${match.url}/ledger`} component={AsyncMarginTradingWalletledgerComponent} />
            {/* added by devang parekh for margin trading history */}
            <Route path={`${match.url}/history`} component={AsyncMarginTradingHistoryComponent} />
            {/* added by parth andhariya 22-04-2019 */}
            <Route path={`${match.url}/profitlossReport`} component={AsyncprofitlossComponent} />
            <Route path={`${match.url}/OpenPositionReport`} component={OpenPositionReport} />
            <Route path={`${match.url}/`} component={AsyncMarginTradingComponent} />
        </Switch>
    </Fragment>
);

export default MaringTrading;
