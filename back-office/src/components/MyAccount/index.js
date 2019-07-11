/**
 * App Widgets
 */
import React from "react";
import Loadable from "react-loadable";
import PreloadWidget from "Components/PreloadLayout/PreloadWidget";

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

//Delete Role Widget
const DeleteRolesWdgt = Loadable({
  loader: () => import("./DeleteRolesWdgt"),
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

export {
  /* Added by Kevin */
  ForgotPasswordWdgt,
  ResetPasswordWdgt,
  ProfileInfoWdgt,
  UsersProfileWdgt,
  ProfilePermissionsWdgt,
  MembershipLevelUpgradeRequestWdgt,
  PresonalDashboard,

  /* Added by Salim */
  ListRolesWdgt,
  DeleteRolesWdgt,
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
