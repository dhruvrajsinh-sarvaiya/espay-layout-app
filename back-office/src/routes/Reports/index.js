import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import EmailQueueReport from "./EmailQueueReport"; // get index file from example order list file
import MessageQueueReport from "Routes/MessageQueue/message-queue"; // get index file from example order list file


const EmailQueueReports = ({ match }) => (

    <div className="dashboard-wrapper">
        <Switch>
            <Redirect exact from={`${match.url}/`} to={`${match.url}/EmailQueueReport`} /> {/*set full link for point to folder */}
            <Route path={`${match.url}/EmailQueueReport`} component={EmailQueueReport} /> {/*set path for load component */}
            <Route path={`${match.url}/MessageQueue`} component={MessageQueueReport} /> {/*set path for load component */}
        </Switch>
    </div>
);

export default EmailQueueReports;