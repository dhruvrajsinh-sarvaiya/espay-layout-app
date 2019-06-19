/**
 * Components Routes
 */
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

// async routes
import {
    AsyncJbsDataTableComponent
} from 'Components/AsyncComponent/AsyncComponent';

const Components = ({ match }) => (
    <div className="content-wrapper">
        <Switch>
            <Redirect exact from={`${match.url}/`} to={`${match.url}/alert`} />
            <Route path={`${match.url}/JbsDataTable`} component={AsyncJbsDataTableComponent} />
        </Switch>
    </div>
);

export default Components;
