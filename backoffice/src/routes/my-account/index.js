/**
 * Dasboard Routes
 */
import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

/****** Added by Kevin *******/
//Import Component...
import ForgotPassword from "./forgot-password";
import ResetPassword from "./reset-password";

import Profiles from "./profiles";
import CreateProfiles from "./profiles/add";
import EditProfiles from "./profiles/edit";

//Patterns Assignments
import PatternsAssignments from "./patterns-assignments";
import AddPatternsAssignmentsWdgt from "./patterns-assignments/add";
import EditPatternsAssignmentsWdgt from "./patterns-assignments/edit";

//For Users
import Users from "./users";
import AddUsers from "./users/add";
import EditUsers from "./users/edit";
//For Customers
import Customers from "./customers";
import AddCustomer from "./customers/add";
import EditCustomer from "./customers/edit";

//For UsersSignup Rpeport
import UsersSignupReport from "./users-signup-report";

//For Membeship Level Upgrade Rpeport
import MembershipLevelUpgradeRequest from "./membership-level-upgrade-request";

//For Personal Dashboard Rpeport
import PersonalDashboard from "./personal-dashbord";

/****** Added by Salim *******/
//Roles
import ListRoles from "./roles";
import AddRoles from "./roles/add";
import EditRoles from "./roles/edit";
import DeleteRoles from "./roles/delete";

//KYC Verify
import ListKYCVerify from "./kyc-verify";
import EditKYCVerify from "./kyc-verify/edit";

//Complain
import ComplainReports from "./complain";
import EditComplainForm from "./complain/edit";
import ViewComplainForm from "./complain/view";

//SLA Configuration
// import ListSLA from "./sla-configuration";
// import AddSLAForm from "./sla-configuration/add";
// import EditSLAForm from "./sla-configuration/edit";


const MyAccount = ({ match }) => (
  <div className="dashboard-wrapper">
    <Switch>
      <Redirect exact from={`${match.url}/my-account`} to={`${match.url}`} />
      {/* Added by Kevin */}
      <Route path={`${match.url}/reset-password`} component={ResetPassword} />
      <Route path={`${match.url}/forgot-password`} component={ForgotPassword} />
      <Route path={`${match.url}/profiles`} component={Profiles} />
      <Route path={`${match.url}/create-profile`} component={CreateProfiles} />
      <Route path={`${match.url}/edit-profile`} component={EditProfiles} />
      <Route path={`${match.url}/patterns-assignments`} component={PatternsAssignments} />
      <Route path={`${match.url}/add-patterns-assignments`} component={AddPatternsAssignmentsWdgt} />
      <Route path={`${match.url}/edit-patterns-assignments`} component={EditPatternsAssignmentsWdgt} />
      <Route path={`${match.url}/users`} component={Users} />
      <Route path={`${match.url}/add-users`} component={AddUsers} />
      <Route path={`${match.url}/edit-users`} component={EditUsers} />
      <Route path={`${match.url}/customers`} component={Customers} />
      <Route path={`${match.url}/add-customer`} component={AddCustomer} />
      <Route path={`${match.url}/edit-customer`} component={EditCustomer} />
      <Route path={`${match.url}/users-signup-report`} component={UsersSignupReport} />
      <Route path={`${match.url}/membership-level-upgrade-request`} component={MembershipLevelUpgradeRequest} />
      <Route path={`${match.url}/personal-dashboard`} component={PersonalDashboard} />


      {/* Added by Salim */}
      <Route path={`${match.url}/roles`} component={ListRoles} />
      <Route path={`${match.url}/add-roles`} component={AddRoles} />
      <Route path={`${match.url}/edit-roles:id`} component={EditRoles} />
      <Route path={`${match.url}/delete-roles`} component={DeleteRoles} />
      <Route path={`${match.url}/kyc-verify`} component={ListKYCVerify} />
      <Route path={`${match.url}/edit-kyc`} component={EditKYCVerify} />
      <Route path={`${match.url}/complain-reports`} component={ComplainReports} />
      <Route path={`${match.url}/edit-complain`} component={EditComplainForm} />
      <Route path={`${match.url}/view-complain`} component={ViewComplainForm} />

      {/* <Route path={`${match.url}/sla-configuration`} component={ListSLA} />
      <Route path={`${match.url}/edit-sla-configuration`} component={EditSLAForm} />
      <Route path={`${match.url}/add-sla-configuration`} component={AddSLAForm} /> */}
    </Switch>
  </div>
);

export default MyAccount;
