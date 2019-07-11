/* 
    Developer : Nishant Vadgam
    Date : 27-09-2018
    File Comment : Fee & Limit Pattern root component
*/
import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

// async components for admin wallet page
import {
  AsyncPatternListComponent,
  AsyncAddPatternComponent,
  AsyncEditPatternComponent
} from "Components/AsyncComponent/AsyncComponent";
// redirect routes from index
const FeeAndLimitPatterns = ({ match }) => (
  <div className="content-wrapper">
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/list`} />
      <Route path={`${match.url}/list`} component={AsyncPatternListComponent} />
      <Route path={`${match.url}/add`} component={AsyncAddPatternComponent} />
      <Route path={`${match.url}/edit`} component={AsyncEditPatternComponent} />
    </Switch>
  </div>
);

export default FeeAndLimitPatterns;
