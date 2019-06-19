/* 
    Developer : Nishant Vadgama
    Date : 13-09-2018
    File Comment : History page component root
*/
import React, {Fragment} from "react";
import { Redirect, Route, Switch } from "react-router-dom";

// async components for deposit and withdraw history page
import {
    AsyncDepositHistoryComponent,
    AsyncWithdrawHistoryComponent
} from "Components/AsyncComponent/AsyncComponent";
// redirect routes from index
const History = ({ match }) => (
    <Fragment>
        <Switch>
            <Redirect exact from={`${match.url}/`} to={`${match.url}/deposit`} />
            <Route
                path={`${match.url}/deposit`}
                component={AsyncDepositHistoryComponent}
            />
            <Route
                path={`${match.url}/withdraw`}
                component={AsyncWithdrawHistoryComponent}
            />
        </Switch>
    </Fragment>
);

export default History;
