/**
 * Root Sagas
 */
import { all } from 'redux-saga/effects';

// sagas
import authSagas from './Auth';
import emailSagas from './Email';
import todoSagas from './Todo';
import feedbacksSagas from './Feedbacks';

//Parthbhai....
import loginHistorySagas from './MyAccount/LoginHistory';
import ipHistorySagas from './MyAccount/IPHistory';
import deviceManagementSagas from './MyAccount/DeviceManagement';
import editProfileSagas from './MyAccount/EditProfile';
import antiPhishingCodeSagas from './MyAccount/AntiPhishingCode';

//Kevinbhai....
import userauthSagas from './MyAccount/UserAuth';
import usermobileauthSagas from './MyAccount/UserMobileAuth';
import userblockchainauthSagas from './MyAccount/UserBlockchainAuth';
import smsauthSagas from './MyAccount/SmsAuth';
import enablegoogleauthSagas from './MyAccount/EnableGoogleAuth';
import resetpasswordSagas from './MyAccount/ResetPassword';
import changepasswordSagas from './MyAccount/ChangePassword';
import disablesmsauthSagas from './MyAccount/DisableSmsAuth';
import disablegoogleauthSagas from './MyAccount/DisableGoogleAuth';

//Salimbhai....
import twoFAAuthenticationSagas from './MyAccount/2FAAuthentication';
import forgotPasswordSagas from './MyAccount/ForgotPassword';
import loginSagas from './MyAccount/Login';
import personalVerificationFormSagas from './MyAccount/PersonalVerificationForm';
import enterpriseVerificationFormSagas from './MyAccount/EnterpriseVerificationForm';
import referralFriendsSagas from './MyAccount/ReferralFriends';
import referralLatestCommissionHisorySagas from './MyAccount/ReferralLatestCommissionHisory';
import activityListSagas from './MyAccount/ActivityList';
import apiSettingSagas from './MyAccount/APISetting';
import socialLoginSagas from './MyAccount/SocialLogin';

export default function* rootSaga(getState) {
    yield all([
        authSagas(),
        emailSagas(),
        todoSagas(),
        feedbacksSagas(),
        
        //Parthbhai...
        loginHistorySagas(),
        ipHistorySagas(),
        deviceManagementSagas(),
        editProfileSagas(),
        antiPhishingCodeSagas(),

        //Kevinbhai....
        userauthSagas(),
        usermobileauthSagas(),
        userblockchainauthSagas(),
        smsauthSagas(),
        enablegoogleauthSagas(),
        resetpasswordSagas(),
        changepasswordSagas(),
        disablesmsauthSagas(),
        disablegoogleauthSagas(),

        //Salimbhai....
        twoFAAuthenticationSagas(),
        forgotPasswordSagas(),
        loginSagas(),
        personalVerificationFormSagas(),
        enterpriseVerificationFormSagas(),
        referralFriendsSagas(),
        referralLatestCommissionHisorySagas(),
        activityListSagas(),
        apiSettingSagas(),
        socialLoginSagas()
    ]);
}