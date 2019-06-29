/**
 * App Widgets
 */
import React from 'react';
import Loadable from 'react-loadable';
import PreloadWidget from 'Components/PreloadLayout/PreloadWidget';

const MyLoadingComponent = () => (
    <PreloadWidget />
)

/*=================  PARTHBHAI SECTION ==========================*/
const DeviceManagementWdgt = Loadable({
    loader: () => import("./DeviceManagementWdgt"),
    loading: MyLoadingComponent
})

const EditProfileWdgt = Loadable({
    loader: () => import("./EditProfileWdgt"),
    loading: MyLoadingComponent
})

const AntiPhishingCodeWdgt = Loadable({
    loader: () => import("./AntiPhishingCodeWdgt"),
    loading: MyLoadingComponent
})

/*===========================  KEVINBHAI SECTION ========================*/

//SignUpwithEmail
const SignupWithEmailWidget = Loadable({
    loader: () => import("./SignupWithEmailWidget"),
    loading: MyLoadingComponent
});

//SignUpwithMobile
const SignupWithMobileWidget = Loadable({
    loader: () => import("./SignupWithMobileWidget"),
    loading: MyLoadingComponent
});

//SignUpwithBlockchain
const SignupWithBlockchainWidget = Loadable({
    loader: () => import("./SignupWithBlockchainWidget"),
    loading: MyLoadingComponent
});

//SMS Auth
const SmsAuthWidget = Loadable({
    loader: () => import("./SmsAuthWidget"),
    loading: MyLoadingComponent
});

//DownloadApp
const DownloadAppWdgt = Loadable({
    loader: () => import("./DownloadAppWdgt"),
    loading: MyLoadingComponent
});

//Scan QR 
const ScanQrWdgt = Loadable({
    loader: () => import("./ScanQrWdgt"),
    loading: MyLoadingComponent
});

//Backup Key
const BackupKeyWdgt = Loadable({
    loader: () => import("./BackupKeyWdgt"),
    loading: MyLoadingComponent
});

//Google Authentication
const EnableGoogleAuthWdgt = Loadable({
    loader: () => import("./EnableGoogleAuthWdgt"),
    loading: MyLoadingComponent
});

//Reset Password
const ResetPasswordWdgt = Loadable({
    loader: () => import("./ResetPasswordWdgt"),
    loading: MyLoadingComponent
});

//Change Password
const ChangePasswordWdgt = Loadable({
    loader: () => import("./ChangepasswordWdgt"),
    loading: MyLoadingComponent
});

//BlockchainKeyStore
const BlockchainKeyStoreWdgt = Loadable({
    loader: () => import("./BlockchainKeyStoreWdgt"),
    loading: MyLoadingComponent
});

//BlockchainPrivateKey
const BlockchainPrivateKeyWdgt = Loadable({
    loader: () => import("./BlockchainPrivateKeyWdgt"),
    loading: MyLoadingComponent
});

//DisableSmsAuthWdgt
const DisableSmsAuthWdgt = Loadable({
    loader: () => import("./DisableSmsAuthWdgt"),
    loading: MyLoadingComponent
});

//DisableGoogleAuthWdgt
const DisableGoogleAuthWdgt = Loadable({
    loader: () => import("./DisableGoogleAuthWdgt"),
    loading: MyLoadingComponent
});

//MembershipLevelWdgt
const MembershipLevelWdgt = Loadable({
    loader: () => import("./MembershipLevelWdgt"),
    loading: MyLoadingComponent
  });

  //Trade Summary
const TradeSummaryWdgt = Loadable({
    loader: () => import("./TradeSummaryWdgt"),
    loading: MyLoadingComponent
  });

//Top Gainers
const TopGainersWdgt = Loadable({
    loader: () => import("./TopGainersWdgt"),
    loading: MyLoadingComponent
  });
  
  //Top Losers
  const TopLosersWdgt = Loadable({
    loader: () => import("./TopLosersWdgt"),
    loading: MyLoadingComponent
  });
  
//IPWhitelistWdgt
const IPWhitelistWdgt = Loadable({
    loader: () => import("./IPWhitelistWdgt"),
    loading: MyLoadingComponent
  });
  
  //Add AddIPWhitelist
  const AddIPWhitelistWdgt = Loadable({
    loader: () => import("./AddIPWhitelistWdgt"),
    loading: MyLoadingComponent
  });

  //Edit IPWhitelist
  const EditIPWhitelistDialogWdgt = Loadable({
    loader: () => import("./EditIPWhitelistDialogWdgt"),
    loading: MyLoadingComponent
  });

  //Forgot Confirmation Widget
const ForgotConfirmationWdgt = Loadable({
    loader: () => import("./ForgotConfirmationWdgt"),
    loading: MyLoadingComponent
});

/*===========================  SALIMBHAI SECTION ========================*/

//2FA Google Authentication...
const TwoFAGoogleAuthentication = Loadable({
    loader: () => import("./2FAGoogleAuthentication"),
    loading: MyLoadingComponent
});

//2FA SMS Authentication...
const TwoFASMSAuthentication = Loadable({
    loader: () => import("./2FASMSAuthentication"),
    loading: MyLoadingComponent
});

//Lost Your Google Authentication...
const LostYourGoogleAuthenticator = Loadable({
    loader: () => import("./LostYourGoogleAuthenticator"),
    loading: MyLoadingComponent
});

//Phone Number Unavailable...
const PhoneNumberUnavailable = Loadable({
    loader: () => import("./PhoneNumberUnavailable"),
    loading: MyLoadingComponent
});

const LoginHistorySimpleTable = Loadable({
    loader: () => import("./LoginHistorySimpleTable"),
    loading: MyLoadingComponent
});

const LoginHistoryDataTable = Loadable({
    loader: () => import("./LoginHistoryDataTable"),
    loading: MyLoadingComponent
});

const IPHistorySimpleTable = Loadable({
    loader: () => import("./IPHistorySimpleTable"),
    loading: MyLoadingComponent
});

const IPHistoryDataTable = Loadable({
    loader: () => import("./IPHistoryDataTable"),
    loading: MyLoadingComponent
});

//Normal Login
const LoginNormal = Loadable({
    loader: () => import("./LoginNormal"),
    loading: MyLoadingComponent
});

//Blockchain Login
const LoginBlockchain = Loadable({
    loader: () => import("./LoginBlockchain"),
    loading: MyLoadingComponent
});

//Blockchain Keystore File
const BlockchainKeystoreFile = Loadable({
    loader: () => import("./BlockchainKeystoreFile"),
    loading: MyLoadingComponent
});

//Blockchain Private Key
const BlockchainPrivateKey = Loadable({
    loader: () => import("./BlockchainPrivateKey"),
    loading: MyLoadingComponent
});

//Forgot Password
const ForgotPasswordWdgt = Loadable({
    loader: () => import("./ForgotPassword"),
    loading: MyLoadingComponent
});




//Referral Banner Programmer Block
const ReferralBannerBlk = Loadable({
    loader: () => import("./ReferralBannerBlk"),
    loading: MyLoadingComponent
});

//Profile Block
const ProfileBlk = Loadable({
    loader: () => import("./ProfileBlk"),
    loading: MyLoadingComponent
});

//Withdraw Address Management Block
const WithdrawAddressMgmtBlk = Loadable({
    loader: () => import("./WithdrawAddressMgmtBlk"),
    loading: MyLoadingComponent
});

//SMS Authentication Block
const SMSAuthenticationBlk = Loadable({
    loader: () => import("./SMSAuthenticationBlk"),
    loading: MyLoadingComponent
});

//Google Authentication Block
const GoogleAuthenticationBlk = Loadable({
    loader: () => import("./GoogleAuthenticationBlk"),
    loading: MyLoadingComponent
});

//Anti Phishing Code Block
const AntiPhishingCodeBlk = Loadable({
    loader: () => import("./AntiPhishingCodeBlk"),
    loading: MyLoadingComponent
});

//API Setting Block
const APISettingBlk = Loadable({
    loader: () => import("./APISettingBlk"),
    loading: MyLoadingComponent
});

//User Profile Basic Info Block
const UserProfileBasicInfoBlk = Loadable({
    loader: () => import("./UserProfileBasicInfoBlk"),
    loading: MyLoadingComponent
});

//Withdraw Limit Level Block
const WithdrawLimitLevelBlk = Loadable({
    loader: () => import("./WithdrawLimitLevelBlk"),
    loading: MyLoadingComponent
});

//Verify Document Type Widget
const VerifyDocumentTypeWdgt = Loadable({
    loader: () => import("./VerifyDocumentTypeWdgt"),
    loading: MyLoadingComponent
});

//Personal Verification Form Widget
const PersonalVerificationFormWdgt = Loadable({
    loader: () => import("./PersonalVerificationFormWdgt"),
    loading: MyLoadingComponent
});

//Enterprise Verification Form Widget
const EnterpriseVerificationFormWdgt = Loadable({
    loader: () => import("./EnterpriseVerificationFormWdgt"),
    loading: MyLoadingComponent
});

//Activity List Widget
const ActivityListWdgt = Loadable({
    loader: () => import("./ActivityListWdgt"),
    loading: MyLoadingComponent
});

//API Setting Form Widget
const APISettingFormWdgt = Loadable({
    loader: () => import("./APISettingFormWdgt"),
    loading: MyLoadingComponent
});

//API Setting Edit Delete Widget
const APISettingEditDelWdgt = Loadable({
    loader: () => import("./APISettingEditDelWdgt"),
    loading: MyLoadingComponent
});

//Theme Configuration Widget
const ThemeConfigurationWdgt = Loadable({
    loader: () => import("./ThemeConfigurationWdgt"),
    loading: MyLoadingComponent
});

//Device Whitelisting Widget
const DeviceWhitelistingWdgt = Loadable({
    loader: () => import("./DeviceWhitelistingWdgt"),
    loading: MyLoadingComponent
});


import NormalRegistrationWdgt from './NormalRegistrationWdgt';


import SignupEmailWithOTPWdgt from './SignupEmailWithOTPWdgt';


import SignupMobileWithOTPWdgt from './SignupMobileWithOTPWdgt';


import NormalLoginWdgt from './NormalLoginWdgt';


import SigninEmailWithOTPWdgt from './SigninEmailWithOTPWdgt';


import SigninMobileWithOTPWdgt from './SigninMobileWithOTPWdgt';

//Email Confirmation Widget
const EmailConfirmationWdgt = Loadable({
    loader: () => import("./EmailConfirmationWdgt"),
    loading: MyLoadingComponent
});

//Complain Widget
const ComplainWdgt = Loadable({
    loader: () => import("./ComplainWdgt"),
    loading: MyLoadingComponent
});

//Device Authorized
const DeviceAuthorizeScreen = Loadable({
    loader: () => import("./DeviceAuthorizeScreen"),
    loading: MyLoadingComponent
});

/*================= Manish Vora*/

//My Account Dashboard
const MyAccountDashboardWdgt = Loadable({
    loader: () => import("./MyAccountDashboardWdgt"),
    loading: MyLoadingComponent
});
//My Profile Info
const MyProfileInfoWdgt = Loadable({
    loader: () => import("./MyProfileInfoWdgt"),
    loading: MyLoadingComponent
});

//User Confirmation Widget Added by Saloni Rathod...
const UserConfirmationWdgt = Loadable({
    loader: () => import("./UserConfirmationWdgt"),
    loading: MyLoadingComponent
});

export {
    //Parthbhai 
    LoginHistorySimpleTable,
    LoginHistoryDataTable,
    IPHistorySimpleTable,
    IPHistoryDataTable,
    DeviceManagementWdgt,
    EditProfileWdgt,
    AntiPhishingCodeWdgt,

    //Kevinbhai
    SignupWithEmailWidget,
    SignupWithMobileWidget,
    SignupWithBlockchainWidget,
    SmsAuthWidget,
    DownloadAppWdgt,
    ScanQrWdgt,
    BackupKeyWdgt,
    EnableGoogleAuthWdgt,
    ResetPasswordWdgt,
    ChangePasswordWdgt,
    BlockchainKeyStoreWdgt,
    BlockchainPrivateKeyWdgt,
    DisableSmsAuthWdgt,
    DisableGoogleAuthWdgt,
    MembershipLevelWdgt,
    TradeSummaryWdgt,
    TopGainersWdgt,
    TopLosersWdgt,
    IPWhitelistWdgt,
    AddIPWhitelistWdgt,
    EditIPWhitelistDialogWdgt,
    ForgotConfirmationWdgt,
    
    //Salimbhai

    TwoFAGoogleAuthentication,
    TwoFASMSAuthentication,
    LostYourGoogleAuthenticator,
    PhoneNumberUnavailable,
    LoginNormal,
    LoginBlockchain,
    BlockchainKeystoreFile,
    BlockchainPrivateKey,
    ForgotPasswordWdgt,
    ReferralBannerBlk,
    ProfileBlk,
    WithdrawAddressMgmtBlk,
    SMSAuthenticationBlk,
    GoogleAuthenticationBlk,
    AntiPhishingCodeBlk,
    APISettingBlk,
    UserProfileBasicInfoBlk,
    WithdrawLimitLevelBlk,
    VerifyDocumentTypeWdgt,
    PersonalVerificationFormWdgt,
    EnterpriseVerificationFormWdgt,
    ActivityListWdgt,
    APISettingFormWdgt,
    APISettingEditDelWdgt,
    ThemeConfigurationWdgt,
    DeviceWhitelistingWdgt,
    NormalRegistrationWdgt,
    SignupEmailWithOTPWdgt,
    SignupMobileWithOTPWdgt,
    NormalLoginWdgt,
    SigninEmailWithOTPWdgt,
    SigninMobileWithOTPWdgt,
    EmailConfirmationWdgt,
    ComplainWdgt,
    DeviceAuthorizeScreen,

    // Manish Vora 
    MyAccountDashboardWdgt,
    MyProfileInfoWdgt,

    //Added by Saloni Rathod
    UserConfirmationWdgt,
}