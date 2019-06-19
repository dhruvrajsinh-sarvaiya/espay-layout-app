/*
 * CreatedBy : Megha Kariya
 * Date : 17-01-2019
 * Comment : Message routes
 */
/**
 * Message Routes
 */
import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import Messages from "./push-message";


const Message = ({ match }) => (
  <div className="dashboard-wrapper">
    <Switch>
      <Redirect exact from={`${match.url}/message`} to={`${match.url}`} />
      
      <Route path={`${match.url}/push-message`} component={Messages} />
    </Switch>
  </div>
);

export default Message;
