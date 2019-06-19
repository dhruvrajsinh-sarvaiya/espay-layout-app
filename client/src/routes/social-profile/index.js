/**
 * Dasboard Routes
 */
import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

/* Kevinbhai... */
import SocialProfileSubscription from "./social-profile-subscription";
import LeaderProfileConfiguration from "./leader-profile-configuration";
import FollowerProfileConfiguration from "./follower-profile-configuration";

/* Salimbhai... */
import SocialProfileDashboard from './dashboard';
import TopGainer from './top-gainer';
import TopLooserList from './top-looser';
import SocialPosting from './social-posting';
import PopularLeaders from './popular-leaders';
import HistoricalPerformance from './historical-performance';
import LeaderList from './leader-list';
import FollowerList from './follower-list';
import MyWatchlists from './my-watchlist';
import MyPortfolio from './my-portfolio';
import { LeaderDashboard } from "Components/SocialProfile";

const SocialProfile = ({ match }) => (
    <div className="dashboard-wrapper">
        <Switch>
            <Redirect exact from={`${match.url}/social-profile`} to={`${match.url}`} />
            {/* Kevinbhai Route */}
            <Route path={`${match.url}/social-profile-subscription`} component={SocialProfileSubscription} />
            <Route path={`${match.url}/leader-profile-configuration`} component={LeaderProfileConfiguration} />
            <Route path={`${match.url}/follower-profile-configuration`} component={FollowerProfileConfiguration} />
            <Route exact path={`${match.url}`} component={SocialProfileSubscription} />

            {/* Salimbhai Route */}
            <Route path={`${match.url}/dashboard`} component={SocialProfileDashboard} />
            <Route path={`${match.url}/top-gainer`} component={TopGainer} />
            <Route path={`${match.url}/top-looser`} component={TopLooserList} />
            <Route path={`${match.url}/social-posting`} component={SocialPosting} />
            <Route path={`${match.url}/popular-leaders`} component={PopularLeaders} />
            <Route path={`${match.url}/historical-performance`} component={HistoricalPerformance} />
            <Route path={`${match.url}/leader-list`} component={LeaderList} />MyWatchlists
            <Route path={`${match.url}/follower-list`} component={FollowerList} />
            <Route path={`${match.url}/watchlists`} component={MyWatchlists} />
            <Route path={`${match.url}/portfolio`} component={MyPortfolio} />
            <Route path={`${match.url}/leader-board`} component={LeaderDashboard} />
        </Switch>
    </div>
);

export default SocialProfile;
