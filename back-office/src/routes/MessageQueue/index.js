/*
 * CreatedBy : Megha Kariya
 * Date : 15-01-2019
 * Comment : Report routes
 */
/**
 * Report Routes
 */
import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

//SLA Configuration
import Messages from "./message-queue";


const Report = ({ match }) => (
  <div className="dashboard-wrapper">
    <Switch>
      <Redirect exact from={`${match.url}/report`} to={`${match.url}`} />
      
      <Route path={`${match.url}/message-queue`} component={Messages} />
    </Switch>
  </div>
);

export default Report;
