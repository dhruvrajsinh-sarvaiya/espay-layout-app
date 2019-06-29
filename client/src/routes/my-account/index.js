/**
 * Dasboard Routes
 */
import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

// async components
import {
  AsyncTwoFaAuthenticationComponent,
  AsyncLoginHistoryComponent,
  AsyncIPHistoryComponent,
  AsyncLoginComponent
} from "Components/AsyncComponent/AsyncComponent";

/* Parthbhai.... */
import ActivityList from "./activity-list";
import APISettingForm from "./api-setting-form";
import EditProfile from "./edit-profile";
import AntiPhishingCode from "./anti-phishing-code";

/* Kevinbhai... */
import SignupWithEmail from "./signup-with-email";
import SignupWithMobile from "./signup-with-mobile";
import SignupWithBlockchain from "./signup-with-blockchain";
import SMSAuth from "./sms-auth";
import GoogleAuth from "./google-auth";
import ResetPassword from "./reset-password";
import ChangePassword from "./change-password";
import DisableGoogleAuth from "./disable-google-auth";
import DisableSmsAuth from "./disable-sms-auth";
import membershipLevel from "./membership-level";
import tradeSummary from "./trade-summary";
import topGainers from "./top-gainers";
import topLosers from "./top-losers";
import ipWhitelist from "./ip-whitelist";
import addIpWhitelist from "./ip-whitelist/addIPWhiteList";
import deviceList from "./device-whitelisting";

// Manish Vora
import myAccountDashboard from "./my-account-dashboard";
import myProfileInfo from "./my-account-dashboard/myprofileinfo";

/* Salimbhai.... */
import ForgotPassword from "./forgot-password";
import UserAccount from "./user-account";
import VerifyDocumentType from "./verify-document-type";
import PersonalVerificationForm from "./personal-verification-form";
import EnterpriseVerificationForm from "./enterprise-verification-form";
import ReferraleProgram from "./referrale-program";
import ThemeConfiguration from "./theme-configuration";
import DeviceWhitelisting from "./device-whitelisting";
import ListComplain from "./help-and-support";
import RaiseComplainForm from "./help-and-support/RaiseComplainForm";
import ComplainReplayForms from "./help-and-support/ComplainReplayForms";

//Sanjay
import ChartAccount from './chart-account';
import RiskScore from "./risk-score";
import ReferralInvite from './referrale-program/report/referral-invite';
import ReferralParticipate from './referrale-program/report/referral-participate';
import ReferralInviteEmail from './referrale-program/report/referral-invite-email';
import ReferralInviteSMS from './referrale-program/report/referral-invite-sms';
import ClickReferralLink from './referrale-program/report/click-referral-link';
import ReferralRewards from './referrale-program/report/referral-rewards';

const MyAccount = ({ match }) => (
  <div className="dashboard-wrapper">
    <Switch>
      <Redirect exact from={`${match.url}/my-account`} to={`${match.url}`} />
      {/* Parthbhai Route */}
      <Route path={`${match.url}/login-history`} component={AsyncLoginHistoryComponent} />
      <Route path={`${match.url}/ip-history`} component={AsyncIPHistoryComponent} />
      <Route path={`${match.url}/edit-profile`} component={EditProfile} />
      <Route path={`${match.url}/anti-phishing-code`} component={AntiPhishingCode} />

      {/* Kevinbhai Route */}
      <Route path={`${match.url}/signup-with-email`} component={SignupWithEmail} />
      <Route path={`${match.url}/signup-with-blockchain`} component={SignupWithBlockchain} />
      <Route path={`${match.url}/signup-with-mobile`} component={SignupWithMobile} />
      <Route path={`${match.url}/sms-auth`} component={SMSAuth} />
      <Route path={`${match.url}/google-auth`} component={GoogleAuth} />
      <Route path={`${match.url}/reset-password`} component={ResetPassword} />
      <Route path={`${match.url}/change-password`} component={ChangePassword} />
      <Route path={`${match.url}/disable-sms-auth`} component={DisableSmsAuth} />
      <Route path={`${match.url}/disable-google-auth`} component={DisableGoogleAuth} />
      <Route path={`${match.url}/membership-level`} component={membershipLevel} />
      <Route path={`${match.url}/trade-summary`} component={tradeSummary} />
      <Route path={`${match.url}/top-gainers`} component={topGainers} />
      <Route path={`${match.url}/top-losers`} component={topLosers} />
      <Route path={`${match.url}/ip-whitelist`} component={ipWhitelist} />
      <Route path={`${match.url}/add-ipwhitelist`} component={addIpWhitelist} />
      <Route path={`${match.url}/device-whitelisting`} component={deviceList} />

      {/* Manish Vora Routes */}
      <Route path={`${match.url}/my-account-dashboard`} component={myAccountDashboard} />
      <Route path={`${match.url}/my-profile-info`} component={myProfileInfo} />

      {/* Salimbhai Routes */}
      <Route exact path={`${match.url}`} component={myAccountDashboard} />
      <Route path={`${match.url}/2fa-authentication`} component={AsyncTwoFaAuthenticationComponent} />
      <Route path={`${match.url}/login`} component={AsyncLoginComponent} />
      <Route path={`${match.url}/forgot-password`} component={ForgotPassword} />
      <Route path={`${match.url}/user-account`} component={UserAccount} />
      <Route path={`${match.url}/verify-documents-type`} component={VerifyDocumentType} />
      <Route path={`${match.url}/personal-verification`} component={PersonalVerificationForm} />
      <Route path={`${match.url}/enterprise-verification`} component={EnterpriseVerificationForm} />
      <Route path={`${match.url}/activity-list`} component={ActivityList} />
      <Route path={`${match.url}/api-setting`} component={APISettingForm} />
      <Route path={`${match.url}/theme-configuration`} component={ThemeConfiguration} />
      <Route path={`${match.url}/device-whitelisting`} component={DeviceWhitelisting} />
      <Route path={`${match.url}/complain`} component={ListComplain} />
      <Route path={`${match.url}/raise-complain`} component={RaiseComplainForm} />
      <Route path={`${match.url}/replay-complain`} component={ComplainReplayForms} />

      {/**Added By Bharat Jograna Referral*/}
      <Redirect exact from={`${match.url}/referral-program`} to={`${match.url}/referral-program/dashboard`} />
      <Route path={`${match.url}/referral-program/dashboard`} component={ReferraleProgram} />
      <Route path={`${match.url}/referral-program/chart-account`} component={ChartAccount} />
      <Route path={`${match.url}/referral-program/risk-score`} component={RiskScore} />
      <Route path={`${match.url}/referral-program/referral-invite`} component={ReferralInvite} />
      <Route path={`${match.url}/referral-program/referral-participate`} component={ReferralParticipate} />
      <Route path={`${match.url}/referral-program/referral-invite-email`} component={ReferralInviteEmail} />
      <Route path={`${match.url}/referral-program/referral-invite-sms`} component={ReferralInviteSMS} />
      <Route path={`${match.url}/referral-program/click-referral-link`} component={ClickReferralLink} />
      <Route path={`${match.url}/referral-program/referral-rewards`} component={ReferralRewards} />
    </Switch>
  </div>
);

export default MyAccount;
