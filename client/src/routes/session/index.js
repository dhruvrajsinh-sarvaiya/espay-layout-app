/**
 * Session Routes
 */
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

// async components
import {
    AsyncNoInternetConnectionComponent,
    AsyncMaintainanceComponent
} from 'Components/AsyncComponent/AsyncComponent';

const Session = ({ match }) => (
    <div className="content-wrapper">
        <Switch>
            <Redirect exact from={`${match.url}/`} to={`${match.url}/nointernet`} />
            <Route path={`${match.url}/nointernet`} component={AsyncNoInternetConnectionComponent} />
            <Route path={`${match.url}/maintenance`} component={AsyncMaintainanceComponent} />
        </Switch>
    </div>
);

export default Session;
