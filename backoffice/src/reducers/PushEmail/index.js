/**
 * App Reducers
 */
import { combineReducers } from "redux";
import settings from "./settings";
import chatAppReducer from "./ChatAppReducer";
import emailAppReducer from "./EmailAppReducer";
import sidebarReducer from "./SidebarReducer";
import todoAppReducer from "./TodoAppReducer";
import authUserReducer from "./AuthUserReducer";
import feedbacksReducer from "./FeedbacksReducer";
import ecommerceReducer from "./EcommerceReducer";

import emailpushRcd from"./MyAccount/PremissionForm";



const reducers = combineReducers({
    settings,
    chatAppReducer,
    emailApp: emailAppReducer,
    sidebar: sidebarReducer,
    todoApp: todoAppReducer,
    authUser: authUserReducer,
    feedback: feedbacksReducer,
    ecommerce: ecommerceReducer,

    /*===================== Start My Account Section ================*/
    /* Added by Kevin.... */
    resetPassword: resetPasswordReducer,
    forgotPassword: forgotPasswordReducer,
    profiles: profilesReducer,
    patternsAssignment: patternsAssignmentsReducer,
    displayUsers: displayUsers,
    costomers: displayCustomers,
    usersSignupReport: usersSignupReport,
    membershipUpgrade: membershipLevelUpgradeRequestReducer,
    iphistoryDashboard: ipHistoryDashboard,
    devicewhitelistDashboard: devicewhitelistDashboard,
    ipwhitelistDashboard: ipWhitelistDashboard,
    changePasswordDashboard: changePasswordDashboard,
    personalDashboard: PersonalDashboard,
    securityQuestionRdcer: SecurityQuestionDashboard,
    loginHistoryDashboard: LoginHistoryDashboard,
    phoneNumberDashboard: phoneNumberDashboardReducer,
    activityDashboard: activityDashboardReducer,
    groupInfoDashboard: groupInfoDashboardReducer,
    domainDashRdcer: domainDashboardReducer,
    Brahmrshi:Brahmrshi,
    emailpushRcd:emailpushRcd,

    /* Added by Salim.... */
    rolesRdcer: rolesReducer,
    userRolesRdcer: userRolesReducer,
    kycVerifyRdcer: kycVerifyReducer,
    complainRdcer: complainReducer,
    slaRdcer: slaReducer,
    orgDashRdcer: organizationDashboardReducer,
    appDashRdcer: applicationDashboardReducer,
    userDashRdcer: userDashboardReducer,
    adminDashRdcer: adminDashboardReducer,
    custDashRdcer: customerDashboardReducer,
    grpDashRdcer: groupDashboardReducer,
    roleDashRdcer: roleDashboardReducer,
    lngDashRdcer: languageDashboardReducer,
    memlvlDashRdcer: membershipLevelDashboardReducer,
    emlPrvdrDashRdcer: emailProvideDashboardReducer,
    sociallngDashRdcer: socialLoginDashboardReducer,
    twoFADashRdcer: twoFAAuthDashboardReducer,
    rptDashRdcer: reportDashboardReducer,
    settingDashRdcer: settingDashboardReducer,
    orgInfoRdcer: organizationInformationReducer,
    nrlLoginRdcer: normalLoginReducer,
    authTokenRdcer: authorizationTokenReducer,
    editProfileRdcer: editProfileReducer,
    kycConfigRdcer: kycConfigReducer,
    actvHstrRdcer: activityHistoryReducer,

    /*===================== End My Account Section ================*/

    /*==================== Start Social Profile Section =====================*/
    /* Added by kevin 12/20/2018 */
    socialTradingPolicy: socialTradingPolicyReducer,
    /*==================== End Social Profile Section =====================*/

    /* KushalBhai .... */
    faqcategories: faqCategoriesReducer,
    faqquestions: faqQuestionsReducer,
    exchangemaster: exchangeReducer,
    staticpages: staticpagesReducer,
    news: newsReducer,
    languages: languageReducer,
    sitesetting: sitesettingReducer,

    /* Wallet Reducer - Added By Nishant */
    walletReducer: walletReducer,
    daemonAddressReducer: daemonAddressReducer,
    patternListReducer: patternListReducer,
    tradeRoute: tradeRoute,
    withdrawRoute: withdrawRoute,
    coinConfig: coinConfig,
    /*Sanjay */
    adminAssetReport: adminAssetReport,
    withdrawalReport: withdrawalReport,
    trnsferInOut: trnsferInOut,
    paymetMethod: paymetMethod,
    depositReport: depositReport,
    transferIn: transferIn,
    transferOut: transferOut,
    demonBalance: demonBalance,
    transactionRetry: transactionRetry,
    stackingFees: stackingFees,
    earningLedger: earningLedger,
    chargeCollected: chargeCollected,

    transactionPolicy: transactionPolicy,
    commissionTypeDetail: commissionTypeDetail,
    walletUsagePolicy: walletUsagePolicy,
    chargeTypeDetail: chargeTypeDetail,
    walletTypeMaster: walletTypeMaster,
    transferInReducer: transferInReducer,
    transferOutReducer: transferOutReducer,
    withdrawalReportReducer: withdrawalReportReducer,
    dipositReportReducer: dipositReportReducer,
    TrnTypeRoleWise: TrnTypeRoleWise,

    //added Nirmit
    tradingledger: tradingledgerReducer,
    openOrders: openOrdersReducer,
    settledOrders: settledOrdersReducer,

    //Added By Tejas
    tradeChart: tradeChartDataReducer,
    headerData: headerDataReducer,
    marketDetails: marketDataReducer,
    topGainers: topGainersDataReducer,
    topLosers: topLosersDataReducer,
    orderSummary: orderSummaryDataReducer,
    referralSummary: referralSummaryDataReducer,
    activeUser: activeUserReducer,
    newSignup: newSignupReducer,
    daemonConfigure: daemonConfiguration,
    currencyList: currencyListReducer,
    tradeRecon: tradeReconReducer,
    bugReport: bugReportReducer,
    apiConfig: apiConfigureReducer,
    manageMarkets: manageMarketsReducer,
    tradeSummary: tradeSummaryReducer,
    liquidityManager: liquidityManagerReducer,
    exchangeFeed: exchangeFeedReducer,
    apiMatchConfig: apiConfigureMatchEnfineReducer,

    // added by devang parekh
    pairConfiguration: pairConfigurationReducer,
    apiConfAddGen: ApiConfAddGenReducer,

    /* Jayesh */
    country: countryReducer,
    state: stateReducer,
    city: cityReducer,
    contactus: contactusReducer,

    /* Wallet Dashboard - Nishant */
    superAdminReducer: superAdminReducer,
    transactionTypesReducer: transactionTypesReducer,
    /* CMS Dashboard - Kushal */
    cmsDashboard: cmsDashboardReducer,


    // added by Tejas
    revenueData: tradeRevenueReducer,
    chartData: tradeChartReducer,
    marketsData: tradeMarketReducer,
    userTradeData: userTradeReducer,
    expenseData: tradeExpenseReducer,
    profitData: tradeProfitReducer,
    totalCount: totalCountReducer,
    tradeSummaryTotal: tradeSummaryTotalReducer,
    orderSummaryTotal: orderSummaryTotalReducer,

    //added by Nishant 
    usersReducer: usersReducer,
    WalletBlockTrnTypeReducer: WalletBlockTrnTypeReducer,
    StakingConfigurationReducer: StakingConfigurationReducer,

    //added by Jayesh 
    surveysReducer: surveysReducer,

    //Added by Tejas
    thirdPartyApiResponse: thirdPartyApiResponse,
    thirdPartyApiRequest: thirdPartyApiRequest,
    ProviderConfig: providerConfig,
    marketCap: marketCapReducer,
    tradeledger: tradinLedgerReport,
    //added by jayesh 
    zohocrmReducer: zohocrmReducer,
    emailtemplatesReducer: emailtemplatesReducer,
    //Added by kushal
    regions: regionsReducer,
    chatDashboard: chatDashboardReducer,
    chatUserList: chatUserListReducer,
    coinConfiguration:coinConfigurationReducer
});

export default reducers;
