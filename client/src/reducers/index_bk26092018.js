/**
 * App Reducers
 */
import { combineReducers } from 'redux';
import settings from './settings';
import chatAppReducer from './ChatAppReducer';
import emailAppReducer from './EmailAppReducer';
import sidebarReducer from './SidebarReducer';
import todoAppReducer from './TodoAppReducer';
import authUserReducer from './AuthUserReducer';
import feedbacksReducer from './FeedbacksReducer';
import ecommerceReducer from './EcommerceReducer';

//Parthbhai....
import loginHistoryReducer from './MyAccount/LoginHistory';
import ipHistoryReducer from './MyAccount/IPHistory';
import deviceManagementReducer from './MyAccount/DeviceManagement';
import editProfileReducer from './MyAccount/EditProfile';
import antiPhishingCodeReducer from './MyAccount/AntiPhishingCode';

//Kevinbhai....
import userauthReducer from './MyAccount/UserAuthReducer';
import usermobileauthReducer from './MyAccount/UserMobileAuthReducer';
import userblockchainauthReducer from './MyAccount/UserBlockchainAuthReducer';
import smsauthReducer from './MyAccount/SmsAuthReducer';
import enablegoogleauthReducer from './MyAccount/EnableGoogleAuthReducer';
import resetpasswordReducer from './MyAccount/ResetPasswordReducer';
import changepasswordReducer from './MyAccount/ChangePasswordReducer';
import disablesmsauthReducer from './MyAccount/DisableSmsAuthReducer';
import disablegoogleauthReducer from './MyAccount/DisableGoogleAuthReducer';

//Salimbhai....
import twoFAAuthenticationReducer from './MyAccount/2FAAuthentication';
import loginReducer from './MyAccount/Login';
import forgotPasswordReducer from './MyAccount/ForgotPassword';
import personalVerificatonFormReducer from './MyAccount/PersonalVerificationForm';
import enterpriseVerificatonFormReducer from './MyAccount/EnterpriseVerificationForm';
import refFriendReducer from './MyAccount/ReferralFriends';
import refLatestCommissionHistoryReducer from './MyAccount/ReferralLatestCommissionHistory';
import activityListReducer from './MyAccount/ActivityList';
import apiSettingReducer from './MyAccount/APISetting';
import socialLoginReducer from './MyAccount/SocialLogin';

const reducers = combineReducers({
  settings,
  chatAppReducer,
  emailApp: emailAppReducer,
  sidebar: sidebarReducer,
  todoApp: todoAppReducer,
  authUser: authUserReducer,
  feedback: feedbacksReducer,
  ecommerce: ecommerceReducer,
  
  //Parthbhai...
  loginHistoryRdcer : loginHistoryReducer,
  ipHistoryRdcer : ipHistoryReducer,
  deviceManagementRdcer : deviceManagementReducer,
  editProfileRdcer : editProfileReducer,
  antiPhishingCodeRdcer : antiPhishingCodeReducer,

  //Kevinbhai.....
  userauth: userauthReducer,
  usermobileauth: usermobileauthReducer,
  userblockchainauth: userblockchainauthReducer,
  smsauth : smsauthReducer,
  googleauthenable : enablegoogleauthReducer,
  resetpwd : resetpasswordReducer,
  changepwd : changepasswordReducer,
  disablesmsauth : disablesmsauthReducer,
  disablegoogleauth : disablegoogleauthReducer,
  
  //Salimbhai.....
  twoFAAuth : twoFAAuthenticationReducer,
  loginRdcer : loginReducer,
  forgotPassRdcer : forgotPasswordReducer,
  prsnlVerifyFrmRdcer : personalVerificatonFormReducer,
  entpriseVerifyFrmRdcer : enterpriseVerificatonFormReducer,
  refFrndRdcer : refFriendReducer,
  refLtstCmsnHstRdcer : refLatestCommissionHistoryReducer,
  activityListRdcer : activityListReducer,
  apiSettingRdcer : apiSettingReducer,
  socialLoginRdcer : socialLoginReducer,
});

export default reducers;
