export const AppConfig = {
    appName: 'NewStackApp',                     // Application Name                             
    initialRoute: 'SplashScreen',               // Initial Launcher Screen
    initialHomeRoute: 'CountriesListScreen',          // Initial Home Screen
    initialPair: 'INR_BTC',                     // Inital Pair for Market Trade
    enableLogger: true,                         // To Enable Disable Logs
    pageSize: 10,                               // Default Page Size
    expiration: true,                          // User should expire or login every time
    isLicenseAPICall: false,

    // Live API
    /* baseURL: 'https://6768-2901zz03.azurewebsites.net/',
    hostName: 'FrontAPI', */

    //For All Front and BackOffice API
    baseURL: 'https://cleandevtest.azurewebsites.net/',
    // hostName: 'Backoffice_CleanUp',
    hostName: 'BackofficeSSOAccountStaging',

    WebServiceUrl: 'https://new-stack-node-api.azurewebsites.net/',          // Webservice Url Used When License Api bit false
    //WebServiceUrl: 'http://192.168.31.105:9000/',/* Bharat bhai  */
    WebSiteUrl: 'https://cleandevtest.azurewebsites.net/BackofficeSSOAccountStaging',     // WebSite Url Used When License Api bit false
    LOGOURL: 'https://cleandevtest.azurewebsites.net/SSOAccountStaging/Logo/Logo1.png',     // Logo Url Used When License Api bit false

    //For Authorization Token
    grantTypeForToken: 'password',
    grantTypeForRefreshToken: 'refresh_token',
    clientIDForToken: 'cleanarchitecture',
    scopeForToken: 'openid profile email offline_access client_id roles phone',

    referral_link: "https://new-stack-front.azurewebsites.net?ref=",

    license: {
        code: "LC005140",
        url: "http://api.espay.in/Biztechws/SiteService.asmx",
        bitWise: true,  // if GetBitWise value is false then redirect to license code activity.
    },

    //Staging - NOT IN USED
    // hostName: 'SSO_Account',    
    // hostName: 'SSO_Account_Staging',
    // hostName: 'BackOffice',
}