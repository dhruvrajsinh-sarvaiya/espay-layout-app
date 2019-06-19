import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import OrganizationLedger from "./OrganizationLedger"; // get index file from example order list file


const LedgerReport = ({ match }) => (

    <div className="dashboard-wrapper">
        <Switch>
            <Redirect exact from={`${match.url}/LedgerReport`} to={`${match.url}`} /> {/*set full link for point to folder */}
            <Route path={`${match.url}/OrganizationLedger`} component={OrganizationLedger} /> {/*set path for load component */}
        </Switch>
    </div>
);

export default LedgerReport;