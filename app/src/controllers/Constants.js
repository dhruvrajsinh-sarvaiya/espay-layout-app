export const ServiceUtilConstant = {
    KEY_Theme: 'theme',
    KEY_Locale: 'locale',
    KEY_FirstTime: 'FirstTime',
    KEY_DetailPref: 'DetailPref',
    KEY_FirmName: 'FirmName',
    KEY_MemberStatus: 'MemberStatus',
    KEY_ExpireDate: 'ExpireDate',
    KEY_WebServiceUrl: 'WebServiceUrl',
    KEY_LOGOURL: 'LOGOURL',
    KEY_WebSiteUrl: 'WebSiteUrl',
    KEY_LicenseCode: 'LicenseCode',
    KEY_ContactNo: 'ContactNo',
    KEY_EmailID: 'EmailID',
    KEY_StatusCode: 'StatusCode',
    SERVICEIDFOUND: 'SERVICEIDFOUND',
    LICENSETYPE: 'LICENSETYPE',
    KEY_PREF_FIRST_TIME: 'PREF_FIRST_TIME',
    SERVER_ERROR_CODE: '888',
    SERVER_CONNECTION: 77,
    SESSION_EXPIRED: -2,

    // login preference
    KEY_keylogindetails: 'keylogindetails',
    MOBILENO: 'MOBILENO',
    SMSPIN: 'SMSPIN',
    FIRSTNAME: 'FIRSTNAME',
    LOGINPASSWORD: 'LOGINPASSWORD',
    LOGINUSERNAME: 'LOGINUSERNAME',
    ALLOWTOKEN: 'ALLOWTOKEN',
    TwoFAToken: 'TwoFAToken',
    DISCOUNTPATTERNTYPE: 'DISCOUNTPATTERNTYPE',
    MEMBERTYPE: 'MEMBERTYPE',
    MEMBERID: 'MEMBERID',
    CLIENT_BAL: 'CLIENT_BAL',
    MIDDLENAME: 'MIDDLENAME',
    LASTNAME: 'LASTNAME',
    FirmName: 'FirmName',
    Email: 'Email',
    SessionID: 'SessionID',
    ApiSecretKey: 'ApiSecretKey',
    APIKEY: 'APIKEY',
    ACCESS_TOKEN: 'accessToken',
    REFRESH_TOKEN: 'refreshToken',
    ID_TOKEN: 'idToken',

    // for License code
    SYSTEM_ID: 'h4rd1kk41p35h',

    //for timer
    timer_time_seconds: 40,
    timer_size: 20,

    //For Enable Disable Feature
    KEY_AppSettingsPref: 'AppSettingsPref',
    KEY_IPWhitelisting: 'ipWhiteListing',
    KEY_LoginWithPIN: 'LoginWithPin',
    KEY_LoginWithPattern: 'LoginWithPattern',
    KEY_SecurePin: 'SecurePin',
    KEY_SecurePattern: 'SecurePattern',
    KEY_SMSAuth: 'SMSAuth',
    KEY_GoogleAuth: 'GoogleAuth',
    KEY_EnableDarkMode: 'EnableDarkMode',
    KEY_SocialProfilePlan: 'SocialProfilePlan',
    KEY_DIMENSIONS: 'dimensions',

    KEY_Question: 'Question',
    KEY_Answer: 'KEY_Answer',
    KEY_SecurityQuestion: 'SecurityQuestion',

    KEY_SecurityImageMessage: 'SecurityImageMessage',
    KEY_Image: 'Image',
    KEY_Message: 'Message',
    KEY_Expiration: 'Expiration',

    //For API
    Mode: 'Mobile',
    hostName: 'paro',

    //API URL
    // swaggerURL: AppConfig.baseURL + AppConfig.hostName + '/',

    //SignalR URL
    // signalRMarketURL: AppConfig.baseURL + AppConfig.hostName + '/Market',
    // signalRChatURL: AppConfig.baseURL + AppConfig.hostName + '/Chat',

    //Coin Image URL
    // coinListImageUrl: AppConfig.baseURL + AppConfig.hostName + '/CurrencyLogo/',

    //For Verify SignUp
    ResendOTP_Timer: 40,

    //for view profile
    KEY_UserAvatarPref: 'UserAvatarPref',
    KEY_USER_AVATAR: 'USER_AVATAR',
    KEY_USER_NAME: 'USER_NAME',

    refreshTokenInterval: 13, //13 Minutes
    timerEndTime: 'timerEndTime',
    FCMToken: 'fcmToken',
    KEY_SubscribeNoti: 'SubscribeNoti',
    KEY_FromTray: false,
    KEY_IsBlockedUser: 'IsBlockedUser',

    //For Deposit and Withdraw Action
    From_Deposit: 1,
    From_Withdraw: 2,

    //webpageurl
    // webPageUrl: 'https://new-stack-node-api.azurewebsites.net/',

    // webPageUrl: 'http://172.20.65.173:5000/',/* jayeshbhai  */
    // webPageUrl: 'http://172.20.65.115:5000/',/* kushalbhai  */
    //  webPageUrl: 'http://172.20.65.127:5000/',/* kushalbhai  */
    // webPageUrl: 'http://172.20.65.148:5000/',/* kushalbhai  */
    // webPageUrl: 'http://172.20.65.152:5000/',/* kushalbhai  */
    // webPageUrl: 'http://172.20.65.143:5000',/* DharaBen  */

    KEY_DialogCount: 'dialogCount',
    KEY_CurrencyPair: 'currencyPair',
    KEY_IsMargin: 'isMargin',
    KEY_IsPlanChange: false,
}

const apiAuthorization = 'connect/';
const apiDeviceRegistration = 'api/DeviceRegistration/'
const apiAccount = 'api/Manage/';
const apiProfile = 'api/Profile/';
const apiSignIn = 'api/Signin/';
const apiSignUp = 'api/SignUp/';
const apiTransaction = 'api/Transaction/';
const apiTransactionConfiguration = 'api/TransactionConfiguration/';
const apiTwoFASetting = 'api/TwoFASetting/';
const apiWallet = 'api/Wallet/';
const apiWalletOperation = 'api/WalletOperations/';
const apiKYC = 'api/KYC/';
const apiComplaint = 'api/Complaint/';
const apiSocialProfile = 'api/SocialProfile/';
const apiLanguages = 'api/private/v1/languages/';
const apiWalletConfiguration = 'api/WalletConfiguration/';
const apiWalletControlPanel = 'api/WalletControlPanel/';
const apiWalletOpnAdvanced = 'api/WalletOpnAdvanced/';
const apiBackOfficeActivityLog = 'api/BackOfficeActivityLog/';
const apiCoinListRequest = 'api/private/v1/coinListRequest/';
const apiprivatev1surveys = 'api/private/v1/surveys/';
const apichat = 'api/Chat/';
const apiMasterConfiguration = 'api/MasterConfiguration/';
const apiprivatev1 = 'api/private/v1/';
const apiAffiliate = 'api/Affiliate/';
const apiBackOfficeComplain = 'api/BackOfficeComplain/';
const apiReferral = 'api/Referral/';
const apiMarginWalletControlPanel = 'api/MarginWalletControlPanel/';
const apiMarginWallet = 'api/MarginWallet/';
const apiConfiguration = 'api/APIConfiguration/';
const apiAffiliateBackOffice = 'api/AffiliateBackOffice/';

const Authorization = {
    token: apiAuthorization + 'token',
    GenerateNewToken: 'GenerateNewToken', // Not in use
    refreshToken: 'refreshToken', // Not in use
}

const Language = {
    getActiveDefaultLanguages: apiLanguages + 'getActiveDefaultLanguages',
}

const DeviceRegistration = {
    SubscribePushNotification: apiDeviceRegistration + 'SubscribePushNotification',
    UnsubscribePushNotification: apiDeviceRegistration + 'UnsubscribePushNotification'
}

const MarginWallet = {
    ListMarginWalletMaster: apiMarginWallet + 'ListMarginWalletMaster',
    GetMarginWalletLedger: apiMarginWallet + 'GetMarginWalletLedger/',
    LeverageRequestReport: apiMarginWallet + 'LeverageRequestReport',
    GetMarginPreConfirmationData: apiMarginWallet + 'GetMarginPreConfirmationData',
    InsertMarginRequest: apiMarginWallet + 'InsertMarginRequest',
    ListLeverageBaseCurrency: apiMarginWallet + 'ListLeverageBaseCurrency',
    GetProfitNLossReportData: apiMarginWallet + 'GetProfitNLossReportData',
    GetOpenPosition: apiMarginWallet + 'GetOpenPosition',
    MarginWithdrawPreConfirm: apiMarginWallet + 'MarginWithdrawPreConfirm',
    WithdrawMigration: apiMarginWallet + 'WithdrawMigration',

}

const AffiliateBackOffice = {
    ListAffiliateSchemeTypeMapping: apiAffiliateBackOffice + 'ListAffiliateSchemeTypeMapping',
}


const Account = {
    userinfo: apiAccount + 'userinfo',
    GetIpHistory: apiAccount + 'GetIpHistory',
    GetIpAddress: apiAccount + 'GetIpAddress',
    IpAddress: apiAccount + 'IpAddress',
    DeleteIpAddress: apiAccount + 'DeleteIpAddress',
    DisableIpAddress: apiAccount + 'DisableIpAddress',
    EnableIpAddress: apiAccount + 'EnableIpAddress',
    UpdateIpAddress: apiAccount + 'UpdateIpAddress',
    GetLoginHistory: apiAccount + 'GetLoginHistory',
    changepassword: apiAccount + 'changepassword',
    TwoFAVerifyCode: apiAccount + 'TwoFAVerifyCode',
    GetDeviceId: apiAccount + 'GetDeviceId',
    DeleteDeviceId: apiAccount + 'DeleteDeviceId',
    DisableDeviceId: apiAccount + 'DisableDeviceId',
    EnableDeviceId: apiAccount + 'EnableDeviceId',
    UpdateLanguagePreference: apiAccount + 'UpdateLanguagePreference',
}

const Profile = {
    GetProfileData: apiProfile + 'GetProfileData',
}

const SignIn = {
    VerifyCode: apiSignIn + 'VerifyCode',
    //StandardLogin: apiSignIn + 'StandardLogin',
    StandardLogin: apiSignIn + 'StandardLoginV1',
    //LoginWithEmail: apiSignIn + 'LoginWithEmail',
    LoginWithEmail: apiSignIn + 'LoginWithEmailV1',
    'EmailOtpVerification.SignIn': apiSignIn + 'EmailOtpVerification',
    'ReSendOtpWithEmail.SignIn': apiSignIn + 'ReSendOtpWithEmail',
    //LoginWithMobile: apiSignIn + 'LoginWithMobile',
    LoginWithMobile: apiSignIn + 'LoginWithMobileV1',
    'MobileOtpVerification.SignIn': apiSignIn + 'MobileOtpVerification',
    'ReSendOtpWithMobile.SignIn': apiSignIn + 'ReSendOtpWithMobile',
    ForgotPassword: apiSignIn + 'ForgotPassword',
    ExternalLoginForFacebook: apiSignIn + 'ExternalLoginForFacebook',
    ExternalLoginForGoogle: apiSignIn + 'ExternalLoginForGoogle',
}

const SignUp = {
    register: apiSignUp + 'register',
    ReSendRegisterlink: apiSignUp + 'ReSendRegisterlink',
    SignUpWithEmail: apiSignUp + 'SignUpWithEmail',
    'EmailOtpVerification.SignUp': apiSignUp + 'EmailOtpVerification',
    'ReSendOtpWithEmail.SignUp': apiSignUp + 'ReSendOtpWithEmail',
    SignUpWithMobile: apiSignUp + 'SignUpWithMobile',
    'MobileOtpVerification.SignUp': apiSignUp + 'MobileOtpVerification',
    'ReSendOtpWithMobile.SignUp': apiSignUp + 'ReSendOtpWithMobile',
}

const Transaction = {
    CreateTransactionOrderBG: apiTransaction + 'CreateTransactionOrderBG',
    CancelOrder: apiTransaction + 'CancelOrder',
    GetTradeHistory: apiTransaction + 'GetTradeHistory',
    GetActiveOrder: apiTransaction + 'GetActiveOrder',
    GetRecentOrder: apiTransaction + 'GetRecentOrder',
    GetOrderhistory: apiTransaction + 'GetOrderhistory',
    GetBuyerBook: apiTransaction + 'GetBuyerBook',
    GetSellerBook: apiTransaction + 'GetSellerBook',
    GetVolumeData: apiTransaction + 'GetVolumeData',
    GetTradePairAsset: apiTransaction + 'GetTradePairAsset',
    GetGraphDetail: apiTransaction + 'GetGraphDetail',
    GetMarketCap: apiTransaction + 'GetMarketCap',
    GetPairRates: apiTransaction + 'GetPairRates',
    AddToFavouritePair: apiTransaction + 'AddToFavouritePair',
    RemoveFromFavouritePair: apiTransaction + 'RemoveFromFavouritePair',
    GetFavouritePair: apiTransaction + 'GetFavouritePair',
    Withdrawal: apiTransaction + 'Withdrawal',
    GetMarketTicker: apiTransaction + 'GetMarketTicker',
    TradeSettledHistory: apiTransaction + 'TradeSettledHistory',
    GetFrontTopLooserPair: apiTransaction + 'GetFrontTopLooserPair',
    GetFrontTopGainerPair: apiTransaction + 'GetFrontTopGainerPair',
    GetFrontTopLooserGainerPair: apiTransaction + 'GetFrontTopLooserGainerPair',
    GetMarketDepthChart: apiTransaction + 'GetMarketDepthChart',
    ResendEmailWithdrawalConfirmation: apiTransaction + 'ResendEmailWithdrawalConfirmation',
    GetAllSiteToken: apiTransaction + 'GetAllSiteToken',
    SiteTokenCalculation: apiTransaction + 'SiteTokenCalculation',
    SiteTokenConversion: apiTransaction + 'SiteTokenConversion',
    GetSiteTokenConversionData: apiTransaction + 'GetSiteTokenConversionData',
    TopProfitGainer: apiTransaction + 'TopProfitGainer',
    TopProfitLoser: apiTransaction + 'TopProfitLoser',
    TopLeadersList: apiTransaction + 'TopLeadersList',
    GetCopiedLeaderOrders: apiTransaction + 'GetCopiedLeaderOrders',
    GetHistoricalPerformance: apiTransaction + 'GetHistoricalPerformance',
    CreateTransactionOrderMargin: apiTransaction + 'CreateTransactionOrderMargin',
}

const TransactionConfiguration = {
    GetAllServiceConfiguration: apiTransactionConfiguration + 'GetAllServiceConfiguration',
    ListCurrency: apiTransactionConfiguration + 'ListCurrency',
    ListPair: apiTransactionConfiguration + 'ListPair',
    // for backoffice TransactionConfiguration
    // GetBaseMarket: apiTransactionConfiguration + 'GetBaseMarket',
    AddMarketData: apiTransactionConfiguration + 'AddMarketData',
    UpdateMarketData: apiTransactionConfiguration + 'UpdateMarketData',
    GetAllLiquidityAPIManager: apiTransactionConfiguration + 'GetAllLiquidityAPIManager',
    GetAllThirdPartyAPI: apiTransactionConfiguration + 'GetAllThirdPartyAPI',
    GetAllLimitData: apiTransactionConfiguration + 'GetAllLimitData',
    GetProviderList: apiTransactionConfiguration + 'GetProviderList',
    ListDemonConfig: apiTransactionConfiguration + 'ListDemonConfig',
    ListProviderConfiguration: apiTransactionConfiguration + 'ListProviderConfiguration',
    GetServiceProviderType: apiTransactionConfiguration + 'GetServiceProviderType',
    GetAllTransactionType: apiTransactionConfiguration + 'GetAllTransactionType',
    AddLiquidityAPIManager: apiTransactionConfiguration + 'AddLiquidityAPIManager',
    UpdateLiquidityAPIManager: apiTransactionConfiguration + 'UpdateLiquidityAPIManager',

    //Bo And Front
    GetAllRouteConfiguration: apiTransactionConfiguration + 'GetAllRouteConfiguration',
    GetAvailableRoute: apiTransactionConfiguration + 'GetAvailableRoute',
    UpdateWithdrawRouteConfiguration: apiTransactionConfiguration + 'UpdateWithdrawRouteConfiguration',
    AddWithdrawRouteConfiguration: apiTransactionConfiguration + 'AddWithdrawRouteConfiguration',
    GetWithdrawRouteByService: apiTransactionConfiguration + 'GetWithdrawRouteByService',
    GetBaseMarket: apiTransactionConfiguration + 'GetBaseMarket',
}

const WalletControlPanel = {
    //Bo And Front
    GetOrgCount: apiWalletControlPanel + 'GetOrgCount',
    GetUserCount: apiWalletControlPanel + 'GetUserCount',
    GetUserCountTypeWise: apiWalletControlPanel + 'GetUserCountTypeWise',
    GetWalletAuthUserCountRoleWise: apiWalletControlPanel + 'GetWalletAuthUserCountRoleWise',
    GetDetailTypeWise: apiWalletControlPanel + 'GetDetailTypeWise',
    GetOrgAllDetail: apiWalletControlPanel + 'GetOrgAllDetail',
    GetWalletCountStatusWise: apiWalletControlPanel + 'GetWalletCountStatusWise',
    GetMonthwiseUserCount: apiWalletControlPanel + 'GetMonthwiseUserCount',
    GetMonthwiseOrgCount: apiWalletControlPanel + 'GetMonthwiseOrgCount',
    ListOrgDetails: apiWalletControlPanel + 'ListOrgDetails',
    GetWalletCountTypeWise: apiWalletControlPanel + 'GetWalletCountTypeWise',
    ListUserLastFive: apiWalletControlPanel + 'ListUserLastFive',
    GetTranCountTypewise: apiWalletControlPanel + 'GetTranCountTypewise',
    ListChannelwiseTransactionCount: apiWalletControlPanel + 'ListChannelwiseTransactionCount',
    ListChargePolicyLastFive: apiWalletControlPanel + 'ListChargePolicyLastFive',
    ListUsagePolicyLastFive: apiWalletControlPanel + 'ListUsagePolicyLastFive',
    ListCommissionPolicyLastFive: apiWalletControlPanel + 'ListCommissionPolicyLastFive',
    ListStackingPolicyDetail: apiWalletControlPanel + 'ListStackingPolicyDetail',
    ChangeStakingPolicyDetailStatus: apiWalletControlPanel + 'ChangeStakingPolicyDetailStatus',
    ListWalletTypeDetails: apiWalletControlPanel + 'ListWalletTypeDetails',
    AddStakingPolicy: apiWalletControlPanel + 'AddStakingPolicy',
    UpdateStakingPolicyDetail: apiWalletControlPanel + 'UpdateStakingPolicyDetail',
    ListRoleDetails: apiWalletControlPanel + 'ListRoleDetails',
    ListWalletTrnType: apiWalletControlPanel + 'ListWalletTrnType',
    ListStakingPolicyMaster: apiWalletControlPanel + 'ListStakingPolicyMaster',
    ChangeStakingPolicyStatus: apiWalletControlPanel + 'ChangeStakingPolicyStatus',
    InsertUpdateStakingPolicy: apiWalletControlPanel + 'InsertUpdateStakingPolicy',
    GetExportAddressDetails: apiWalletControlPanel + 'GetExportAddressDetails',
    ListAllUserDetails: apiWalletControlPanel + 'ListAllUserDetails',
    //For Takers, Makers in Buy Sell Trade Module
    /*     ListChargesTypeWise: apiWalletControlPanel + 'ListChargesTypeWise', */

    AddCurrencyLogo: apiWalletControlPanel + 'AddCurrencyLogo',
}

const WalletConfiguration = {
    //Bo And Front
    ListAllWalletTypeMaster: apiWalletConfiguration + 'ListAllWalletTypeMaster',
    DeleteWalletTypeMaster: apiWalletConfiguration + 'DeleteWalletTypeMaster',
    AddWalletTypeMaster: apiWalletConfiguration + 'AddWalletTypeMaster',
    UpdateWalletTypeMaster: apiWalletConfiguration + 'UpdateWalletTypeMaster',
    GetTransferIn: apiWalletConfiguration + 'GetTransferIn',
}

const TwoFASetting = {
    Disable2fa: apiTwoFASetting + 'Disable2fa',
    enableauthenticator: apiTwoFASetting + 'Enableauthenticator',
}

const Wallet = {
    ListWallet: apiWallet + 'ListWallet',
    GetWalletByType: apiWallet + 'GetWalletByType',
    DepositHistoy: apiWallet + 'DepositHistoy',
    WithdrawalHistoy: apiWallet + 'WithdrawalHistoy',
    GetAllBalances: apiWallet + 'GetAllBalances',
    GetAvailbleBalTypeWise: apiWallet + 'GetAvailbleBalTypeWise',
    GetAllBalancesTypeWise: apiWallet + 'GetAllBalancesTypeWise',
    GetWalletLedgerV1: apiWallet + 'GetWalletLedgerV1',
    GetIncomingTransaction: apiWallet + 'GetIncomingTransaction',
    GetServiceLimitChargeValue: apiWallet + 'GetServiceLimitChargeValue',
    GetOutGoingTransaction: apiWallet + 'GetOutGoingTransaction',
    ListChargesTypeWise: apiWallet + 'ListChargesTypeWise',
}

const WalletOperations = {
    CreateWalletAddress: apiWalletOperation + 'CreateWalletAddress',
    ListWalletAddress: apiWalletOperation + 'ListWalletAddress',
    GetDefaultWalletAddress: apiWalletOperation + 'GetDefaultWalletAddress',
    GetWalletLimit: apiWalletOperation + 'GetWalletLimit',
    SetWalletLimit: apiWalletOperation + 'SetWalletLimit',
    AddBeneficiary: apiWalletOperation + 'AddBeneficiary',
    WhitelistBeneficiary: apiWalletOperation + 'WhitelistBeneficiary',
    GetWhitelistedBeneficiaries: apiWalletOperation + 'GetWhitelistedBeneficiaries',
    GetAllBeneficiaries: apiWalletOperation + 'GetAllBeneficiaries',
    SetUserPreferences: apiWalletOperation + 'SetUserPreferences',
    GetUserPreferences: apiWalletOperation + 'GetUserPreferences',
    GetStackingHistory: apiWalletOperation + 'GetStackingHistory',
    GetStackingPolicyDetail: apiWalletOperation + 'GetStackingPolicyDetail',
    UserStackingPolicyRequest: apiWalletOperation + 'UserStackingPolicyRequest',
    GetPreStackingConfirmationData: apiWalletOperation + 'GetPreStackingConfirmationData',
    UserUnstackingRequest: apiWalletOperation + 'UserUnstackingRequest',

}

const signalR = {
    OnConnected: 'OnConnected',
    AddPairSubscription: 'AddPairSubscription',
    AddMarketSubscription: 'AddMarketSubscription',
    OnTokenChange: 'OnTokenChange',
    SetTime: 'SetTime',
    RecieveNotification: 'RecieveNotification',
    RecieveAnnouncement: 'RecieveAnnouncement',
    RecieveNews: 'RecieveNews',
    RecievePairData: 'RecievePairData',
    RecieveActiveOrder: 'RecieveActiveOrder',
    RecieveTradeHistory: 'RecieveTradeHistory',
    RecieveRecentOrder: 'RecieveRecentOrder',
    RecieveMarketData: 'RecieveMarketData',
    RecieveBuyerBook: 'RecieveBuyerBook',
    RecieveSellerBook: 'RecieveSellerBook',
    RecieveLastPrice: 'RecieveLastPrice',
    RecieveWalletBal: 'RecieveWalletBal',
    RecieveOrderHistory: 'RecieveOrderHistory',
    RecieveChartData: 'RecieveChartData',
    SendMessage: 'SendMessage',
    ReceiveMessage: 'ReceiveMessage',
    RecieveChatHistory: 'RecieveChatHistory',
    GetChatHistory: 'GetChatHistory',
    RecieveBlockUnblockUser: 'RecieveBlockUnblockUser',
    RecieveMarketTicker: 'RecieveMarketTicker',
    RecieveStopLimitBuyerBook: 'RecieveStopLimitBuyerBook',
    RecieveStopLimitSellerBook: 'RecieveStopLimitSellerBook',
    ReceiveBulkSellerBook: 'ReceiveBulkSellerBook',
    RecieveWalletActivity: 'RecieveWalletActivity',
    ReceiveSessionExpired: 'ReceiveSessionExpired',
}

const KYC = {
    PersonalVerification: apiKYC + 'PersonalVerification',
}

const Complaint = {
    Raisecomplaint: apiComplaint + 'Raisecomplaint',
    GetTypeMaster: apiComplaint + 'GetTypeMaster',
    AddCompainTrail: apiComplaint + 'AddCompainTrail',
    GetComplain: apiComplaint + 'GetComplain',
    GetUserWiseComplain: apiComplaint + 'GetUserWiseComplain',
}

const SocialProfile = {
    GetSocialProfile: apiSocialProfile + 'GetSocialProfile',
    SubscribSocialProfile: apiSocialProfile + 'SubscribSocialProfile',
    UnsibscribeSocialProfile: apiSocialProfile + 'UnsibscribeSocialProfile',
    SetLeaderFrontProfile: apiSocialProfile + 'SetLeaderFrontProfile',
    GetFollowerFrontProfileConfiguration: apiSocialProfile + 'GetFollowerFrontProfileConfiguration',
    SetFollowerFrontProfile: apiSocialProfile + 'SetFollowerFrontProfile',
    GetLeaderList: apiSocialProfile + 'GetLeaderList',
    UnFollow: apiSocialProfile + 'UnFollow',
    GetLeaderFrontProfileConfiguration: apiSocialProfile + 'GetLeaderFrontProfileConfiguration',
    GetLeaderWiseFollowerConfig: apiSocialProfile + 'GetLeaderWiseFollowerConfig',
    GetGroupList: apiSocialProfile + 'GetGroupList',
    AddGroup: apiSocialProfile + 'AddGroup',
    AddWatch: apiSocialProfile + 'AddWatch',
    UnFollowWatch: apiSocialProfile + 'UnFollowWatch',
    GetWatcherWiseLeaderList: apiSocialProfile + 'GetWatcherWiseLeaderList',
}

const WalletOpnAdvanced = {
    ListWalletNew: apiWalletOpnAdvanced + 'ListWalletNew',
    ListUserWalletWise: apiWalletOpnAdvanced + 'ListUserWalletWise',
    InsertUserWalletPendingRequest: apiWalletOpnAdvanced + 'InsertUserWalletPendingRequest',
    UpdateUserWalletPendingRequest: apiWalletOpnAdvanced + 'UpdateUserWalletPendingRequest',
    ListUserWalletRequest: apiWalletOpnAdvanced + 'ListUserWalletRequest',
    LeaderBoard: apiWalletOpnAdvanced + 'LeaderBoard',
}

const BackOfficeActivityLog = {
    GetActivityLogHistoryByUserId: apiBackOfficeActivityLog + 'GetActivityLogHistoryByUserId',
    GetAllModuleData: apiBackOfficeActivityLog + 'GetAllModuleData',
}

const CoinListField = {
    addCoinListFieldsData: apiCoinListRequest + 'addCoinListFieldsData',
    CoinListRequest: apiCoinListRequest
}
const pages = {
    aboutUs: '5bb7536ce912caf2f9582912',
    termsAndConditions: '5bbae6473afb55f7cac2eac7',
    termsOfService: '5bbae6473afb55f7cac2eac7',
    privacyPolicy: '5bbae5ad3afb55f7cac2ea88',
    legalStatement: '5bbae6643afb55f7cac2eadc',
    refundPolicy: '5bbae6f43afb55f7cac2eb1f',
    applicationCenter: '5bbae7013afb55f7cac2eb24',
    feesAndCharges: '5bbb40b7e462621e90e87a4a',
    //'list-coin':'0KdMtWU3WL',
}

const Cms = {
    // for survey 
    getSurvey: apiprivatev1surveys + 'getSurvey',
    addSurveyResult: apiprivatev1surveys + 'addSurveyResult',
    getSurveyResultsBySurveyId: apiprivatev1surveys + 'getSurveyResultsBySurveyId',
    // for chat dashboard history and list
    GetOnlineUserCount: apichat + 'GetOnlineUserCount',
    GetOfflineUserCount: apichat + 'GetOfflineUserCount',
    GetActiveUserCount: apichat + 'GetActiveUserCount',
    GetBlockedUserCount: apichat + 'GetBlockedUserCount',
    GetUserList: apichat + 'GetUserList',
    BlockUser: apichat + 'BlockUser',
    GetUserWiseChat: apichat + 'GetUserWiseChat',
    // for template
    GetAllTemplate: apiMasterConfiguration + 'GetAllTemplate',
    ListTemplate: apiMasterConfiguration + 'ListTemplate',
    AddTemplate: apiMasterConfiguration + 'AddTemplate',
    UpdateTemplate: apiMasterConfiguration + 'UpdateTemplate',
    GetTemplateById: apiMasterConfiguration + 'GetTemplateById/',
    ChangeTemplateStatus: apiMasterConfiguration + 'ChangeTemplateStatus/',
    // for HelpCenter
    listHelpManualModule: apiprivatev1 + 'helpmanualmodule/listHelpManualModule/',
    getHelpManualByModuleId: apiprivatev1 + 'helpmanual/getHelpManualByModuleId/',
    //FAQs
    getActiveFaqCategory: apiprivatev1 + 'faqcategory/getActiveFaqCategory',
    getActiveFaqQuestion: apiprivatev1 + 'faqquestion/getActiveFaqQuestion',

}

const affiliateSignUp = {
    AffiliateRegister: apiAffiliate + 'AffiliateRegister',
    GetAffiliateSchemeType: apiAffiliate + 'GetAffiliateSchemeType/',
    GetAffiliateDashboardCount: apiAffiliate + 'GetAffiliateDashboardCount',
    GetAllAffiliateUser: apiAffiliate + 'GetAllAffiliateUser',
    GetAffiateUserRegistered: apiAffiliate + 'GetAffiateUserRegistered',
    GetReferralLinkClick: apiAffiliate + 'GetReferralLinkClick',
    GetFacebookLinkClick: apiAffiliate + 'GetFacebookLinkClick',
    GetTwitterLinkClick: apiAffiliate + 'GetTwitterLinkClick',
    GetEmailSent: apiAffiliate + 'GetEmailSent',
    GetSMSSent: apiAffiliate + 'GetSMSSent',
    AffiliateCommissionHistoryReport: apiAffiliate + 'AffiliateCommissionHistoryReport',
    GetAffiliatePromotionLink: apiAffiliate + 'GetAffiliatePromotionLink',
    SendAffiliateEmail: apiAffiliate + 'SendAffiliateEmail',
    SendAffiliateSMS: apiAffiliate + 'SendAffiliateSMS',
    GetAffiliateInvitieChartDetail: apiAffiliate + 'GetAffiliateInvitieChartDetail',
    GetMonthWiseCommissionChartDetail: apiAffiliate + 'GetMonthWiseCommissionChartDetail',
}

const BackOfficeComplain = {
    GetAllUserData: apiBackOfficeComplain + 'GetAllUserData',
}

const Referral = {
    DropDownReferralService: apiReferral + 'DropDownReferralService',
    DropDownReferralPayType: apiReferral + 'DropDownReferralPayType',
    DropDownReferralChannelType: apiReferral + 'DropDownReferralChannelType',
    AllCountForUserReferralChannel: apiReferral + 'AllCountForUserReferralChannel',
    ListUserReferralChannelInvite: apiReferral + 'ListUserReferralChannelInvite',
    ListAdminReferralChannelWithChannelType: apiReferral + 'ListAdminReferralChannelWithChannelType',
    ListUserParticipateReferralUser: apiReferral + 'ListUserParticipateReferralUser',
    ListUserReferralUserClick: apiReferral + 'ListUserReferralUserClick',
    ListUserReferralRewards: apiReferral + 'ListUserReferralRewards',
    GetReferralURL: apiReferral + 'GetReferralURL',
    GetReferralService: apiReferral + 'GetReferralService',
    GetUserReferralCode: apiReferral + 'GetUserReferralCode',
    SendReferralEmail: apiReferral + 'SendReferralEmail',
    SendReferralSMS: apiReferral + 'SendReferralSMS',
}

const MarginWalletControlPanel = {
    //Bo
    LeveragePendingReport: apiMarginWalletControlPanel + 'LeveragePendingReport',
    MarginLeverageRequestAdminApproval: apiMarginWalletControlPanel + 'MarginLeverageRequestAdminApproval',
    LeverageReport: apiMarginWalletControlPanel + 'LeverageReport',
    ListLeverage: apiMarginWalletControlPanel + 'ListLeverage',
    ChangeLeverageStatus: apiMarginWalletControlPanel + 'ChangeLeverageStatus',
    InserUpdateLeverage: apiMarginWalletControlPanel + 'InserUpdateLeverage',
}

const ApiConfiguration = {
    ViewAPIPlanDetail: apiConfiguration + 'ViewAPIPlanDetail',
    SubscribeAPIPlan: apiConfiguration + 'SubscribeAPIPlan',
    ViewUserActivePlan: apiConfiguration + 'ViewUserActivePlan',
    ManualRenewAPIPlan: apiConfiguration + 'ManualRenewAPIPlan',
    GenerateAPIKey: apiConfiguration + 'GenerateAPIKey',
    AutoRenewAPIPlan: apiConfiguration + 'AutoRenewAPIPlan',
    GetAutoRenewPlanDetail: apiConfiguration + 'GetAutoRenewPlanDetail',
    StopAutoRenewPlan: apiConfiguration + 'StopAutoRenewPlan',
    GetUserAPICustomLimit: apiConfiguration + 'GetUserAPICustomLimit',
    SetUserAPICustomLimit: apiConfiguration + 'SetUserAPICustomLimit',
    UpdateUserAPICustomLimit: apiConfiguration + 'UpdateUserAPICustomLimit',
    SetDefaultAPILimits: apiConfiguration + 'SetDefaultAPILimits',
    GetAPIKeyList: apiConfiguration + 'GetAPIKeyList',
    IPWhitelist: apiConfiguration + 'IPWhitelist',
    UpdateAPIKey: apiConfiguration + 'UpdateAPIKey',
    DeleteAPIKey: apiConfiguration + 'DeleteAPIKey',
    GetWhitelistIP: apiConfiguration + 'GetWhitelistIP',
    DeleteWhitelistIP: apiConfiguration + 'DeleteWhitelistIP',
    GetAPIKeyByID: apiConfiguration + 'GetAPIKeyByID',
}

//Define All API Method Here
export const Method = {
    ...Authorization,
    ...DeviceRegistration,
    ...Account,
    ...Profile,
    ...SignIn,
    ...SignUp,
    ...Transaction,
    ...TransactionConfiguration,
    ...TwoFASetting,
    ...Wallet,
    ...WalletOperations,
    ...signalR,
    ...KYC,
    ...Complaint,
    ...SocialProfile,
    ...Language,
    ...WalletControlPanel,
    ...WalletConfiguration,
    ...WalletOpnAdvanced,
    ...BackOfficeActivityLog,
    ...CoinListField,
    ...pages,
    ...Cms,
    ...affiliateSignUp,
    ...BackOfficeComplain,
    ...Referral,
    ...MarginWallet,
    ...MarginWalletControlPanel,
    ...ApiConfiguration,
    ...AffiliateBackOffice
};

//it will use to match stored screen by passing any of it to get its remaining time
export const timerScreen = {
    forgotPassword: 0,
    loginWith2FA: 1,
    smsAuthenticator: 2,
    signInEmailWithOTP: 3,
    signInMobileWithOTP: 4,
    signUpMobileWithOTP: 5,
    signUpEmailWithOTP: 6,
}

export const Constants = {
    TradeTypes: {
        Buy: 4,
        Sell: 5
    },
    OrderTypes: {
        LIMIT_ORDER: 1,
        MARKET_ORDER: 2,
        SPOT_ORDER: 3,
        STOP_LIMIT_ORDER: 4
    }
}

export const Fonts = {
    HindmaduraiBold: 'hindmadurai-bold',
    HindmaduraiLight: 'hindmadurai-light',
    HindmaduraiMedium: 'hindmadurai-medium',
    HindmaduraiRegular: 'hindmadurai-regular',
    HindmaduraiSemiBold: 'hindmadurai-semibold',
    MakoRegular: 'mako-regular',
    MontserratBold: 'Montserrat-Bold',
    MontserratMedium: 'Montserrat-Medium',
    MontserratRegular: 'Montserrat-Regular',
    MontserratSemiBold: 'Montserrat-Semibold',
}

export const Events = {
    SessionLogout: 'SessionLogout',
    ProgressDismiss: 'ProgressDismiss',
    BuySellPairData: 'buySellPairData',
    BuySellPairDataMargin: 'buySellPairDataMargin',
    Timer: 'Timer',
    CounterListener: 'CounterListener',
    ApiPlanList: 'ApiPlanList',
    MoveToMainScreen: 'MoveToMainScreen',
    BuySellInput: 'BuySellInput',
    BuySellInputMargin: 'BuySellInputMargin',
    Dimensions: 'Dimensions',
}

export const AllOrientations = [
    'SplashScreen',
    'AppIntroScreen',
    'LanguageFreshScreen',
    'LoginNormalScreen',
    'ForgotPasswordComponent',
    'SignUpNormal',
    'SignUpNormalSub',
    'QuickSignUpScreen',
    'SignUpMobileWithOtp',
    'SignUpWithOtp',
    'QuickLogin',
    'SignInEmailWithOtp',
    'SignInMobileWithOtp',
    'VerifyEmailScreen',
    'MainScreen',
    'BuySellTradeSuccess',
]