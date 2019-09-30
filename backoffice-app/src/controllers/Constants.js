import { AppConfig } from "./AppConfig";
import { Method as MethodOriginal } from './Methods';

// Will be removed when whole project will be configured and replaced with Methods imports in all sagas.
export const Method = MethodOriginal;

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
    KEY_ContactNo: 'ContactNo',
    KEY_EmailID: 'EmailID',
    KEY_StatusCode: 'StatusCode',
    KEY_LicenseCode: 'LicenseCode',
    SERVICEIDFOUND: 'SERVICEIDFOUND',
    LICENSETYPE: 'LICENSETYPE',
    KEY_PREF_FIRST_TIME: 'PREF_FIRST_TIME',
    SERVER_ERROR_CODE: '888',
    SERVER_CONNECTION: 77,
    SESSION_EXPIRED: -2,

    // login preference
    MOBILENO: 'MOBILENO',
    FIRSTNAME: 'FIRSTNAME',
    LOGINPASSWORD: 'LOGINPASSWORD',
    LOGINUSERNAME: 'LOGINUSERNAME',
    TwoFAToken: 'TwoFAToken',
    LASTNAME: 'LASTNAME',
    FirmName: 'FirmName',
    Email: 'Email',
    ACCESS_TOKEN: 'accessToken',
    REFRESH_TOKEN: 'refreshToken',
    ALLOWTOKEN: 'ALLOWTOKEN',
    ID_TOKEN: 'idToken',

    // for License code		
    SYSTEM_ID: 'h4rd1kk41p35h',

    //for timer
    timer_time_seconds: 40,

    //For Enable Disable Feature
    KEY_SMSAuth: 'SMSAuth',
    KEY_GoogleAuth: 'GoogleAuth',
    KEY_DIMENSIONS: 'dimensions',

    KEY_Access_Expiration: 'KEY_Access_Expiration',
    KEY_Refresh_Expiration: 'KEY_Refresh_Expiration',

    //For API
    Mode: 'Mobile',
    hostName: 'paro',

    /* coinListImageUrl: 'https://cleandevtest.azurewebsites.net/' + AppConfig.hostName + '/CurrencyLogo/',

    //Signal R URL
    signalRMarketURL: 'https://cleandevtest.azurewebsites.net/' + AppConfig.hostName + '/Market',
    signalRChatURL: 'https://cleandevtest.azurewebsites.net/' + AppConfig.hostName + '/Chat',

    swaggerURL: 'https://cleandevtest.azurewebsites.net/' + AppConfig.hostName + '/',

    backofficeSwaggerUrl: 'https://cleandevtest.azurewebsites.net/' + AppConfig.hostName + '/', */
    //API URL
    swaggerURL: AppConfig.baseURL + AppConfig.hostName + '/',

    //SignalR URL
    signalRMarketURL: AppConfig.baseURL + AppConfig.hostName + '/Market',
    signalRChatURL: AppConfig.baseURL + AppConfig.hostName + '/Chat',

    //Coin Image URL
    coinListImageUrl: AppConfig.baseURL + AppConfig.hostName + '/CurrencyLogo/',

    //For Verify SignUp
    ResendOTP_Timer: 40,

    //for view profile
    KEY_USER_AVATAR: 'USER_AVATAR',
    KEY_USER_NAME: 'USER_NAME',

    accessTokenInterval: 13, // Minutes
    refreshTokenInterval: 40, // Minutes
    timerEndTime: 'timerEndTime',
    FCMToken: 'fcmToken',
    KEY_SubscribeNoti: 'SubscribeNoti',
    KEY_FromTray: false,
    KEY_IsBlockedUser: 'IsBlockedUser',


    //webpageurl
    webPageUrl: 'https://new-stack-node-api.azurewebsites.net/',
    //webPageUrl: 'http://192.168.31.105:9000/',/* Bharat bhai  */


    KEY_DialogCount: 'dialogCount',
    KEY_CurrencyPair: 'currencyPair',
    KEY_IsMargin: 'isMargin',
    KEY_IsPlanChange: false,
}


//it will use to match stored screen by passing any of it to get its remaining time
export const timerScreen = {
    forgotPassword: 0,
    loginWith2FA: 1,
    smsAuthenticator: 2,
    signInEmailWithOTP: 3,
    signInMobileWithOTP: 4,
    signUpMobileWithOTP: 5
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
    },
    Category: {
        Home: 0,
        Localization: 1
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
    OnResumeComponent: 'OnResumeComponent',
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
    DepositReconEvent: 'DepositReconEvent',
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
]