/**
 * App Config File
 */
const AppConfig = {
    appLogo: require('Assets/img/cool_dex_one.png'),          // App Logo
    brandName: 'COOLDEX',                                    // Brand Name
    navCollapsed: true,                                      // Sidebar collapse
    darkMode: false,                                          // Dark Mode
    boxLayout: false,                                         // Box Layout
    rtlLayout: false,                                         // RTL Layout
    miniSidebar: false,                                       // Mini Sidebar
    enableSidebarBackgroundImage: true,                      // Enable Sidebar Background Image
    sidebarImage: require('Assets/img/sidebar-4.jpg'),     // Select sidebar image
    isDarkSidenav: true,                                   // Set true to dark sidebar
    enableThemeOptions: false,                              // Enable Theme Options // false by Jayesh 16-01-2019
    locale: {
        languageId: 'english',
        locale: 'en',
        name: 'English',
        icon: 'en',
    },
    enableUserTour: process.env.NODE_ENV === 'production' ? true : false,  // Enable / Disable User Tour
    copyRightText: 'COOLDEX © 2019 All Rights Reserved.',      // Copy Right Text
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
    backofficeSwaggerUrl: 'https://cleandevtest.azurewebsites.net/BackofficeSSOAccountStaging/', //added by salim,
    //Added by salim dt:04/12/2018... (Generate Token)
    refreshTokenInterval: 780000, //Added by salim for refreshToken Interval time
    grantTypeForToken: 'password',
    grantTypeForRefreshToken: 'refresh_token',
    clientIDForToken: 'cleanarchitecture',
    scopeForToken: 'openid profile email offline_access client_id roles phone',
    authorizationToken: 'Bearer ',
    defaultCountryCode: 'IN', //For country wise login..
    //Added by salim dt:07/12/2018... (Social Setting)
    facebookProviderID: '1070670509781494',
    googleClientID: '114014449189-np6uk1a7bk6e2opgi2ep0qhcl0ebnui0.apps.googleusercontent.com',
    afterLoginRedirect: '/app/user-profile',
    totalRecordDisplayInList: 100, //added by salim dt:07/01/2018
    /* margin wallet usage type constant - added by nishant */
    marginTradingWalletId: 5,
    marginSafetyWalletId: 6,
    marginProfitWalletId: 7,
    //added by parth andhariya for show Currancy logo
    coinlistImageurl: 'https://cleandevtest.azurewebsites.net/BackofficeSSOAccountStaging/CurrencyLogo',
    rowsPerPageOptions:[100,250,500,1000] // code added by devang parekh for row per page options common
}

export default AppConfig;
