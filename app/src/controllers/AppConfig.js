export const AppConfig = {
    appName: 'CoolDex',                     // Application Name                             
    initialRoute: 'SplashScreen',               // Initial Launcher Screen
    initialHomeRoute: 'MainScreen',             // Initial Home Screen
    initialPair: 'INR_BTC',                     // Inital Pair for Market Trade
    enableLogger: false,                         // To Enable Disable Logs
    pageSize: 10,                               // Default Page Size
    expiration: false,                            // User should expire or login every time

    // Live API
    /* baseURL: 'https://6768-2901zz03.azurewebsites.net/',
    hostName: 'FrontAPI', */

    //For All Front and BackOffice API
    // baseURL: 'https://cleandevtest.azurewebsites.net/',
    // hostName: 'SSOAccountStaging',

    //For Authorization Token
    grantTypeForToken: 'password',
    grantTypeForRefreshToken: 'refresh_token',
    clientIDForToken: 'cleanarchitecture',
    scopeForToken: 'openid profile email offline_access client_id roles phone',

    referral_link: "https://new-stack-front.azurewebsites.net?ref=",

    license: {
        code: "LC000068",
        url: "http://api.espay.in/Biztechws/SiteService.asmx",
        bitWise: true,  // if GetBitWise value is false then redirect to license code activity.
    },
}