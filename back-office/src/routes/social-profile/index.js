/**
 * Dasboard Routes
 */
import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

//For SocialTradingPolicy
import SocialTradingPolicy from "./social-trading-policy";

const SocialProfile = ({ match }) => (
    <div className="dashboard-wrapper">
        <Switch>
            <Redirect exact from={`${match.url}/social-profile`} to={`${match.url}`} />
            {/* Added by Kevin */}
            <Route path={`${match.url}/social-trading-policy`} component={SocialTradingPolicy} />

        </Switch>
    </div>
);

export default SocialProfile;
