/**
 * Dasboard Routes
 */
import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

/****** Added by Kevin *******/
//Import Component...
import ForgotPassword from "./forgot-password";
import ResetPassword from "./reset-password";

//For UsersSignup Rpeport
import UsersSignupReport from "./users-signup-report";

//For Membeship Level Upgrade Rpeport
import MembershipLevelUpgradeRequest from "./membership-level-upgrade-request";

//For Personal Dashboard Rpeport
import PersonalDashboard from "./personal-dashbord";

const MyAccount = ({ match }) => (
  <div className="dashboard-wrapper">
    <Switch>
      <Redirect exact from={`${match.url}/my-account`} to={`${match.url}`} />
      {/* Added by Kevin */}
      <Route path={`${match.url}/reset-password`} component={ResetPassword} />
      <Route path={`${match.url}/forgot-password`} component={ForgotPassword} />
      <Route path={`${match.url}/users-signup-report`} component={UsersSignupReport} />
      <Route path={`${match.url}/membership-level-upgrade-request`} component={MembershipLevelUpgradeRequest} />
      <Route path={`${match.url}/personal-dashboard`} component={PersonalDashboard} />
    </Switch>
  </div>
);

export default MyAccount;
