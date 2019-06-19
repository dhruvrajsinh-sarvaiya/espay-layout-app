/**
 * App Config File
 */
const general = localStorage.getItem('general') !=='undefined' && localStorage.getItem('general') ? JSON.parse(localStorage.getItem('general')) : '';
const social = localStorage.getItem('social') !=='undefined' && localStorage.getItem('social') ? JSON.parse(localStorage.getItem('social')) : '';
const AppConfig = {
    appLogo: localStorage.getItem('appLogo')?localStorage.getItem('appLogo'):require('Assets/img/cool_dex_one.png'),          // App Logo
    brandName: general != null && general.locale && general.locale[localStorage.getItem('locale')] && general.locale[localStorage.getItem('locale')].sitename ? general.locale[localStorage.getItem("locale")].sitename : 'COOLDEX',                                    // Brand Name
    navCollapsed: false,                                      // Sidebar collapse
    darkMode: false,                                          // Dark Mode
    boxLayout: false,                                         // Box Layout
    rtlLayout: false,                                         // RTL Layout
    miniSidebar: false,                                       // Mini Sidebar
    enableSidebarBackgroundImage: true,                      // Enable Sidebar Background Image
    sidebarImage: require('Assets/img/sidebar-4.jpg'),     // Select sidebar image
    isDarkSidenav: true,                                   // Set true to dark sidebar
    enableThemeOptions: true,                              // Enable Theme Options
    refreshTokenInterval: 780000, //Added by salim for refreshToken Interval time
    socketAPIUrl: 'wss://new-stack-socket-api.azurewebsites.net/',//'ws://172.20.65.131:8082',//'wss://new-stack-socket-api.azurewebsites.net/', //Added by salim for socket API Url..
    signInNSignUpMethod: 0, //Added by salim (0:Standard, 1:Email, 2:Mobile)
    locale: {
        languageId: 'english',
        locale: 'en',
        name: 'English',
        icon: 'en',
    },
    enableUserTour: process.env.NODE_ENV === 'production' ? false : false,  // Enable / Disable User Tour
    copyRightText: general != null && general.locale && general.locale[localStorage.getItem('locale')] && general.locale[localStorage.getItem('locale')].copyrights ? general.locale[localStorage.getItem("locale")].copyrights : 'Cooldex - 2019 All Rights Reserved.',      // Copy Right Text
    // light theme colors
    themeColors: {
        'primary': '#5D92F4',
        'secondary': '#677080',
        'success': '#00D014',
        'danger': '#FF3739',
        'warning': '#FFB70F',
        'info': '#00D0BD',
        'dark': '#464D69',
        'default': '#FAFAFA',
        'greyLighten': '#A5A7B2',
        'grey': '#677080',
        'white': '#FFFFFF',
        'purple': '#896BD6',
        'yellow': '#D46B08'
    },
    // dark theme colors
    darkThemeColors: {
        darkBgColor: '#424242'
    },
    // redis related details
    pages: {
        'about-us': '5bb7536ce912caf2f9582912',
        'terms-of-service': '5bbae6473afb55f7cac2eac7',
        'privacy-policy': '5bbae5ad3afb55f7cac2ea88',
        'legal-statement': '5bbae6643afb55f7cac2eadc',
        'refund-policy': '5bbae6f43afb55f7cac2eb1f',
        'application-center': '5bbae7013afb55f7cac2eb24',
        'fees-and-charges': '5bbb40b7e462621e90e87a4a',
    },
    socketUrl: "https://new-stack-node-socket.azurewebsites.net", // Add Socket Url By Tejas
    googleQRCodeUrl: 'https://chart.googleapis.com/chart?chs=200x200&chld=M|0&cht=qr&chl=', //added by salim
    myAccountSwaggerUrl : 'https://6768-2901zz03.azurewebsites.net/frontapi/', //added by salim, client side
    //myAccountSwaggerUrl: 'http://172.20.65.183:60030/', //added by salim,
    //myAccountSwaggerUrl : 'https://cleandevtest.azurewebsites.net/SPAOnCoreV1/', //added by salim,
    // myAccountSwaggerUrl : 'https://cleandevtest.azurewebsites.net/SPAOnCoreV2/', //added by salim,
    totalOrders: 1000, // added by Tejas,
    signalRURL : 'https://6768-2901zz03.azurewebsites.net/frontapi/Market',
    //signalRURL : 'http://172.20.65.183:60030/Market', // client side url
    //signalRURL: 'https://cleandevtest.azurewebsites.net/SPAOnCoreV1/Market', // local url
    siteId: 1,
    coinlistImageurl: 'https://6768-2901zz03.azurewebsites.net/frontapi/CurrencyLogo',
    metatitle: general != null && general.locale && general.locale[localStorage.getItem('locale')] && general.locale[localStorage.getItem('locale')].meta_title ? general.locale[localStorage.getItem("locale")].meta_title : 'COOLDEX', // metatitle,
    //socialmedia
    facebooklink: social != null && social.facebooklink ? social.facebooklink : '',
    twitterlink: social != null && social.twitterlink ? social.twitterlink : '',
    linkedinlink: social != null && social.linkedinlink ? social.linkedinlink : '',
    googlepluslink: social != null && social.googlepluslink ? social.googlepluslink : '',
    skypelink: social != null && social.skypelink ? social.skypelink : '',
    youtubelink: social != null && social.youtubelink ? social.youtubelink : '',
    pinterestlink: social != null && social.pinetrestlink ? social.pinetrestlink : '',
    instagramlink: social != null && social.instagramlink ? social.instagramlink : '',
    whatsapplink: social != null && social.whatsapplink ? social.whatsapplink : '',
    //Added by salim dt:04/12/2018... (Generate Token)
    grantTypeForToken: 'password',
    grantTypeForRefreshToken: 'refresh_token',
    clientIDForToken: 'cleanarchitecture',
    scopeForToken: 'openid profile email offline_access client_id roles phone',
    authorizationToken: 'Bearer ',
    defaultCountryCode: 'IN', //For country wise login..
    //Added by salim dt:07/12/2018... (Social Setting)
    facebookProviderID: '1070670509781494',
    googleClientID: '114014449189-np6uk1a7bk6e2opgi2ep0qhcl0ebnui0.apps.googleusercontent.com',
    //afterLoginRedirect: '/app/dashboard/CooldexTrading',
    afterLoginRedirect: '/app/dashboard/trading',
    //signalRChatURL: 'http://172.20.65.183:60030/Chat',
    //signalRChatURL: 'https://cleandevtest.azurewebsites.net/SPAOnCoreV1/Chat',
    signalRChatURL: 'https://6768-2901zz03.azurewebsites.net/frontapi/Chat',
    //Survey Type
    survey: {
        'feature_survey': '1',
        'coinlist_survey': '2',
        'feedback_survey': '3'
    },
    pushnotificationkey: 'BM0yH9JtGnmzF8Mm3Tn_ua36PA9FZzufsmFYF2Ul8MZOoXW13hvZo9NYVeIPDZCaG_gBrdE20QwoYetxpo0wuh8',
    totalRecordDisplayInList: 100, //added by salim dt:07/01/2018
    WithdrawRedirect: '/app/withdraw-confirmation', // added by nishant for withdraw approval route
    defaultPair:'INR_BTC', // default pair
	defaultBasedCurrency:'BTC', // default second currency
    defaultChildCurrency:'INR', // default first currency
    buySellRecordCount:7, // for display records in buyer/seller grid in trading dashboard
    maintenance_message:general != null && general.locale && general.locale[localStorage.getItem('locale')] && general.locale[localStorage.getItem('locale')].maintenance_message ? general.locale[localStorage.getItem("locale")].maintenance_message : '<h6 class="error-msg mb-30">Site Under Maintenance</h6>',
}

export default AppConfig;