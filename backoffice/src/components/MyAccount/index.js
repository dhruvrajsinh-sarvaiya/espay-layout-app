/**
 * App Widgets
 */
import React from "react";
import Loadable from "react-loadable";
import PreloadWidget from "Components/PreloadLayout/PreloadWidget";

const MyLoadingComponent = () => <PreloadWidget />;

//ForgotPasswordWdgt
const ForgotPasswordWdgt = Loadable({
  loader: () => import("./ForgotPasswordWdgt"),
  loading: MyLoadingComponent
});

//ResetPasswordWdgt
const ResetPasswordWdgt = Loadable({
  loader: () => import("./ResetPasswordWdgt"),
  loading: MyLoadingComponent
});

//ProfilesWdgt
const ProfilesWdgt = Loadable({
  loader: () => import("./ProfilesWdgt"),
  loading: MyLoadingComponent
});

//CreateProfilesWdgt
const CreateProfileWdgt = Loadable({
  loader: () => import("./CreateProfileWdgt"),
  loading: MyLoadingComponent
});

//UsersProfileWdgt
const UsersProfileWdgt = Loadable({
  loader: () => import("./UsersProfileWdgt"),
  loading: MyLoadingComponent
});

//ProfileInfoWdgt
const ProfileInfoWdgt = Loadable({
  loader: () => import("./ProfileInfoWdgt"),
  loading: MyLoadingComponent
});

//ProfilePermissionsWdgt
const ProfilePermissionsWdgt = Loadable({
  loader: () => import("./ProfilePermissionsWdgt"),
  loading: MyLoadingComponent
});

//List PatternsAssignmentsWdgt
const PatternsAssignmentsWdgt = Loadable({
  loader: () => import("./PatternsAssignmentsWdgt"),
  loading: MyLoadingComponent
});

//Add PatternsAssignsWdgt
const AddPatternsAssignmentsWdgt = Loadable({
  loader: () => import("./AddPatternsAssignmentsWdgt"),
  loading: MyLoadingComponent
});

//Edit PatternsAssignmentsWdgt
const EditPatternsAssignmentsWdgt = Loadable({
  loader: () => import("./EditPatternsAssignmentsWdgt"),
  loading: MyLoadingComponent
});

//DisplayUsersWdgt
const UsersWdgt = Loadable({
  loader: () => import("./UsersWdgt"),
  loading: MyLoadingComponent
});

//AddUsersWdgt
const AddUsersWdgt = Loadable({
  loader: () => import("./AddUsersWdgt"),
  loading: MyLoadingComponent
});

//EditUsersWdgt
const EditUsersWdgt = Loadable({
  loader: () => import("./EditUsersWdgt"),
  loading: MyLoadingComponent
});

//DisplayCustomersWdgt
const CustomersWdgt = Loadable({
  loader: () => import("./CustomersWdgt"),
  loading: MyLoadingComponent
});

//AddCustomerWdgt
const AddCustomerWdgt = Loadable({
  loader: () => import("./AddCustomerWdgt"),
  loading: MyLoadingComponent
});

//EditCustomerWdgt
const EditCustomerWdgt = Loadable({
  loader: () => import("./EditCustomerWdgt"),
  loading: MyLoadingComponent
});

//For UsersSignupReportWdgt
const UsersSignupReportWdgt = Loadable({
  loader: () => import("./UsersSignupReportWdgt"),
  loading: MyLoadingComponent
});

//Edit MembershipLevelUpgradeRequestWdgt
const MembershipLevelUpgradeRequestWdgt = Loadable({
  loader: () => import("./MembershipLevelUpgradeRequestWdgt"),
  loading: MyLoadingComponent
});

//For Personal Dashboard
const PresonalDashboard = Loadable({
  loader: () => import("./PresonalDashboard"),
  loading: MyLoadingComponent
});

/*********** SALIMBHAI SECTION **************************/
//List Roles Widget
const ListRolesWdgt = Loadable({
  loader: () => import("./ListRolesWdgt"),
  loading: MyLoadingComponent
});

//Add Roles Widget
const AddRolesWdgt = Loadable({
  loader: () => import("./AddRolesWdgt"),
  loading: MyLoadingComponent
});

//Edit Roles Widget
const EditRolesWdgt = Loadable({
  loader: () => import("./EditRolesWdgt"),
  loading: MyLoadingComponent
});

//Delete Role Widget
const DeleteRolesWdgt = Loadable({
  loader: () => import("./DeleteRolesWdgt"),
  loading: MyLoadingComponent
});

//List Role Users Widget
const ListRoleUsersWdgt = Loadable({
  loader: () => import("./ListRoleUsersWdgt"),
  loading: MyLoadingComponent
});

//Edit Personal Kyc Verify Widget
const EditPersonalKYCVerifyWdgt = Loadable({
  loader: () => import("./EditPersonalKYCVerifyWdgt"),
  loading: MyLoadingComponent
});

//Edit Enterprise Kyc Verify Widget
const EditEnterpriseKYCVerifyWdgt = Loadable({
  loader: () => import("./EditEnterpriseKYCVerifyWdgt"),
  loading: MyLoadingComponent
});

//Complain Report Widget
const ComplainReportWdgt = Loadable({
  loader: () => import("./ComplainReportWdgt"),
  loading: MyLoadingComponent
});

//Edit Complain Form Widget
const EditComplainFormWdgt = Loadable({
  loader: () => import("./EditComplainFormWdgt"),
  loading: MyLoadingComponent
});

//View Complain Form Widget
const ViewComplainWdgt = Loadable({
  loader: () => import("./ViewComplainWdgt"),
  loading: MyLoadingComponent
});

//Organization Form Widget
const OrganiztionFormWdgt = Loadable({
  loader: () => import("./OrganiztionFormWdgt"),
  loading: MyLoadingComponent
});

//Add Domain Form Widget
const AddDomainWdgt = Loadable({
  loader: () => import("./AddDomainWdgt"),
  loading: MyLoadingComponent
});

//Active Inactive Status
const ActiveInactiveStatus = Loadable({
  loader: () => import("./ActiveInactiveStatus"),
  loading: MyLoadingComponent
});

//Normal Login Widget
import NormalLoginWdgt from './NormalLoginWdgt';
//Signin Email With OTP Widget
import SigninEmailWithOTPWdgt from './SigninEmailWithOTPWdgt';

//Signin Mobile With OTP Widget
import SigninMobileWithOTPWdgt from './SigninMobileWithOTPWdgt';

//Forgot Password Widget
import ForgotPassword from './ForgotPassword';

//Forgot Confirmation Widget
import ForgotConfirmationWdgt from './ForgotConfirmationWdgt';

//Reset Pass Widget
import ResetPassword from './ResetPassword';

export {
  /* Added by Kevin */
  ForgotPasswordWdgt,
  ResetPasswordWdgt,
  CreateProfileWdgt,
  ProfilesWdgt,
  ProfileInfoWdgt,
  UsersProfileWdgt,
  ProfilePermissionsWdgt,
  PatternsAssignmentsWdgt,
  AddPatternsAssignmentsWdgt,
  EditPatternsAssignmentsWdgt,
  MembershipLevelUpgradeRequestWdgt,
  UsersWdgt,
  AddUsersWdgt,
  EditUsersWdgt,
  CustomersWdgt,
  AddCustomerWdgt,
  EditCustomerWdgt,
  UsersSignupReportWdgt,
  PresonalDashboard,
  
  /* Added by Salim */
  ListRolesWdgt,
  AddRolesWdgt,
  EditRolesWdgt,
  DeleteRolesWdgt,
  ListRoleUsersWdgt,
  EditPersonalKYCVerifyWdgt,
  EditEnterpriseKYCVerifyWdgt,
  ComplainReportWdgt,
  EditComplainFormWdgt,
  ViewComplainWdgt,
  OrganiztionFormWdgt,
  AddDomainWdgt,
  ActiveInactiveStatus,
  NormalLoginWdgt,

  //Create by Sanjay 
  SigninEmailWithOTPWdgt,
  SigninMobileWithOTPWdgt,
  ForgotPassword,
  ForgotConfirmationWdgt,
  ResetPassword,

};
