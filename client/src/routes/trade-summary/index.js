/*
 * Created By Megha Kariya 
 * Date :- 09-01-2019
 * Route File for Trade Summary Report
*/
/**
 * Dasboard Routes
 */
import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
//Import Component...
//For Users
import TradeSummaryWdgt from "./components";

const TradeSummary = ({ match }) => (
  <div className="dashboard-wrapper">
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/trade-summary`} />
      <Route path={`${match.url}/trade-summary`} component={TradeSummaryWdgt} />
    </Switch>
  </div>
);

export default TradeSummary;
