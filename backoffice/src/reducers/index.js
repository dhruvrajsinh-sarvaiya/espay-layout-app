/**
 * App Reducers
 */
import { combineReducers } from "redux";
import settings from "./settings";
import sidebarReducer from "./SidebarReducer";

/* Sanjay....*/
import adminAssetReport from "./AdminAsset/AdminAssetReducer";
import withdrawalReport from "./WithdrawalReport/WithdrawalReportReducer";
import trnsferInOut from "./TransferINAndOUT/TransferINOUTReducer";
import paymetMethod from "./PaymentMethod/PaymentMethodReducer";
import depositReport from "./DepositReport/DepositReportReducer";
import transferIn from "./TransferInOut/TransferInReducer";
import transferOut from "./TransferInOut/TransferOutReducer";
import demonBalance from "./DemonBalances/DemonBalanceReducer";
import transactionRetry from "./TransactionRetry/TransactionRetryReducer";
import stackingFees from "./StackingFees/StackingFeesReducer";
import earningLedger from "./EarningLedger/EarningLedgerReducer";
import chargeCollected from "./ChargesCollected/ChargesCollectedReducer";

import transactionPolicy from "./TransactionPolicy/TransactionPolicyReducer";
import commissionTypeDetail from "./CommisssionType/CommisssionTypeReducer";
import walletUsagePolicy from "./WalletUsagePolicy/WalletUsagePolicyReducer";
import chargeTypeDetail from "./ChargeTypeDetail/ChargeTypeDetailReducer";
import walletTypeMaster from "./WalletTypes/WalletTypesReducer";
import transferInReducer from "./TransferIn/TransferInReducer";
import transferOutReducer from "./TransferOut/TransferOutReducer";
import withdrawalReportReducer from "./Withdrawal/WithdrawalReportReducer";
import dipositReportReducer from "./Deposit/DepositReportReducer";
import TrnTypeRoleWise from './TrnTypeRoleWise/TrnTypeRoleWiseReducer';

/*================= Start My Account Section ========================*/
/* Added by Kevinbhai....*/
import resetPasswordReducer from "./MyAccount/ResetPasswordReducer";
import forgotPasswordReducer from "./MyAccount/ForgotPasswordReducer";
import profilesReducer from "./MyAccount/ProfilesReducer";
import patternsAssignmentsReducer from "./MyAccount/PatternsAssignments";
import displayUsers from "./MyAccount/Users";
import displayCustomers from "./MyAccount/Customers";
import usersSignupReport from "./MyAccount/UsersSignupReport";
import membershipLevelUpgradeRequestReducer from "./MyAccount/MembershipLevelUpgradeRequest";
import ipHistoryDashboard from "./MyAccount/IPHistoryDashboard";
import devicewhitelistDashboard from "./MyAccount/DevicewhitelistDashboard";
import ipWhitelistDashboard from "./MyAccount/IPWhitelistDashboard";
import changePasswordDashboard from "./MyAccount/ChangePasswordDashboard";
import PersonalDashboard from "./MyAccount/PersonalDashboard";
import SecurityQuestionDashboard from "./MyAccount/SecurityQuestionDashboard";
import LoginHistoryDashboard from "./MyAccount/LoginHistoryDashboard";
import phoneNumberDashboardReducer from "./MyAccount/PhoneNumberDashboard";
import activityDashboardReducer from "./MyAccount/ActivityDashboard";
import groupInfoDashboardReducer from "./MyAccount/GroupInfoDashboard";
import domainDashboardReducer from "./MyAccount/DomainDashboard";
import ipProfilingReducer from "./MyAccount/IPProfiling";
import passwordPolicyReducer from "./MyAccount/PasswordPolicy";
import profileConfigurationReducer from "./MyAccount/ProfileConfiguration";


/* Added by Salim... */
import rolesReducer from "./MyAccount/Roles";
import userRolesReducer from "./MyAccount/UsersRole";
import kycVerifyReducer from "./MyAccount/KYCVerify";
import complainReducer from "./MyAccount/Complain";
import slaReducer from "./MyAccount/SLAConfiguration";
import organizationDashboardReducer from "./MyAccount/OrganizationDashboard";
import applicationDashboardReducer from "./MyAccount/ApplicationDashboard";
import userDashboardReducer from "./MyAccount/UserDashboard";
import adminDashboardReducer from "./MyAccount/AdminDashboard";
import customerDashboardReducer from "./MyAccount/CustomerDashboard";
import groupDashboardReducer from "./MyAccount/GroupDashboard";
import roleDashboardReducer from "./MyAccount/RoleDashboard";
import languageDashboardReducer from "./MyAccount/LanguageDashboard";
import membershipLevelDashboardReducer from "./MyAccount/MembershipLevelDashboard";
import emailProvideDashboardReducer from "./MyAccount/EmailProvideDashboard";
import socialLoginDashboardReducer from "./MyAccount/SocialLoginDashboard";
import twoFAAuthDashboardReducer from "./MyAccount/TwoFAAuthDashboard";
import reportDashboardReducer from "./MyAccount/ReportDashboard";
import settingDashboardReducer from "./MyAccount/SettingDashboard";
import organizationInformationReducer from "./MyAccount/OrganizationInformation";
import normalLoginReducer from "./MyAccount/NormalLogin";
import authorizationTokenReducer from "./MyAccount/AuthorizationToken";
import editProfileReducer from "./MyAccount/EditProfile";
import kycConfigReducer from "./MyAccount/KycConfiguration";
import activityHistoryReducer from "./MyAccount/ActivityHistory";
import ruleModuleReducer from "./MyAccount/RuleModule";
import ruleSubModuleReducer from "./MyAccount/RuleSubModule";
import ruleToolReducer from "./MyAccount/RuleTool";
import ruleFieldReducer from "./MyAccount/RuleField";
import roleManagementReducer from "./MyAccount/RoleManagement";
import rolePermissionGroupReducer from "./MyAccount/RolePermissionGroup";
import affiliateConfigureReducer from "./MyAccount/AffiliateConfigure";
import affiliateSchemeReducer from "./MyAccount/AffiliateScheme";
import affiliateSchemeTypeReducer from "./MyAccount/AffiliateSchemeType";
import affiliatePromotionReducer from "./MyAccount/AffiliatePromotion";
import enablegoogleauthReducer from "./MyAccount/EnableGoogleAuthReducer";
import disablegoogleauthReducer from "./MyAccount/DisableGoogleAuthReducer";
import providerBalanceCheckReducer from "./MyAccount/ProviderBalanceCheck";

/*================= End My Account Section ========================*/

/*==================== Start Social Profile Section =====================*/
/* Added by kevin 12/20/2018 */
import socialTradingPolicyReducer from "./SocialProfile/SocialTradingPolicy";
/*==================== End Social Profile Section =====================*/

/* Kushalbhai ....*/
import faqCategoriesReducer from "./Faq/FaqCategoriesReducer";
import faqQuestionsReducer from "./Faq/FaqQuestionsReducer";
import exchangeReducer from "./ExchangeReducer";
import staticpagesReducer from "./Pages/PagesReducer";
import newsReducer from "./News/NewsReducer";
import languageReducer from './Language/LanguageReducer';
import sitesettingReducer from './SiteSetting/SiteSettingReducer';

/* Wallet Reducer - Added By Nishant */
import walletReducer from "./Wallet/WalletReducer";
import daemonAddressReducer from "./DaemonAddresses/DaemonAddressesReducer";
import patternListReducer from "./FeeAndLimitPatterns/PatternListReducer";
import tradeRoute from "./TradeRoute/TradeRouteReducer";
import withdrawRoute from "./WithdrawRoute/WithdrawRouteReducer";
import coinConfig from "./CoinConfig/CoinConfigReducer";
import DepositRouteReducer from "./DepositRoute/DepositRouteReducer";
import OrgWalletLedgerReducer from "./OrganizationLedger/OrganizationLedgerReducer";

/* Trading Reducer - Added By Nirmit */
import tradingledgerReducer from "./TradingReport/TradingLedgerReducer";
import openOrdersReducer from "./TradingReport/OpenOrdersReducer";
import settledOrdersReducer from "./TradingReport/SettledOrderReducer";

//Added By Tejas
import tradeChartDataReducer from "./Trade/TradeChartDataReducer";
import headerDataReducer from "./Trade/HeaderDataReducer";
import marketDataReducer from "./Trade/MarketDetailsReducer";
import topGainersDataReducer from "./Trade/TopGainersReducer";
import topLosersDataReducer from "./Trade/TopLosersReducer";
import orderSummaryDataReducer from "./Trade/OrderSummaryReducer";
import referralSummaryDataReducer from "./Trade/ReferralSummaryReducer";
import newSignupReducer from "./Trade/NewSignupReducer";
import activeUserReducer from "./Trade/ActiveUserReducer";

// Added For Daemon By:Tejas
import daemonConfiguration from "./DaemonConfiguarion/DaemonConfigureReducer";
import currencyListReducer from "./DaemonConfiguarion/CurrencyListReducer";

// Added For Trade Recon By:Tejas
import tradeReconReducer from "./TradeRecon/TradeReconReducer";

// Added For Bug Report By:Tejas
import bugReportReducer from './BugReport/BugReportReducer';

// Added For Api Configuration By : Tejas 
import apiConfigureReducer from './ApiConfiguration/ApiConfigurationReducer';

// Added For Api MATCH engine  By : Tejas 
import apiConfigureMatchEnfineReducer from './ApiMatchEngine/ApiConfigurationMatchEngineReducer';

// Added For Manage Markets By : Tejas
import manageMarketsReducer from './ManageMarkets/ManageMarketsReducer';

// Added For Trade Summary By : Tejas
import tradeSummaryReducer from './TradeSummary/TradeSummaryReducer';

// Added For Liquidity Manager By : Tejas
import liquidityManagerReducer from './LiquidityManager/LiquidityManagerReducer';

// Added For Exchange Feed Configuration By : Tejas
import exchangeFeedReducer from './ExchangeFeedConfig/ExchangeFeedConfigReducer';

/* pair configuration reducer - Added By Devang Parekh*/
import pairConfigurationReducer from "./PairConfiguration/PairConfigurationReducer";

/* pair configuration reducer - Added By Devang Parekh*/
import ApiConfAddGenReducer from "./ApiConfAddGen/ApiConfAddGenReducer";

/* Jayesh ....*/
import countryReducer from "./Localization/CountryReducer";
import stateReducer from "./Localization/StateReducer";
import cityReducer from "./Localization/CityReducer";
import contactusReducer from "./ContactUs/ContactUsReducer";

/* Wallet Dashboard - added by Nishant Vadgama */
import superAdminReducer from "./Wallet/SuperAdminReducer";
import transactionTypesReducer from "./Wallet/TransactionTypesReducer";
import usersReducer from './Wallet/UsersReducer';
import WalletBlockTrnTypeReducer from './WalletBlockTrnType/WalletBlockTrnTypeReducer';
import StakingConfigurationReducer from './Wallet/StakingConfigurationReducer';

/* CMS Dashboard - added by Kushal Parekh */
import cmsDashboardReducer from "./CmsDashboard/CmsDashboardReducer";

// Added By Tejas For Trading Dashboard
import tradeRevenueReducer from "./Trading/TradeRevenueReducer";
import tradeChartReducer from "./Trading/TradeChartReducer";
import tradeExpenseReducer from "./Trading/TradeExpenseReducer";
import tradeMarketReducer from "./Trading/TradeMarketReducer";
import tradeProfitReducer from "./Trading/TradeProfitReducer";
import userTradeReducer from "./Trading/UserTradeReducer";
import totalCountReducer from "./Trading/DashboardTotalCountReducer";
import tradeSummaryTotalReducer from "./Trading/TradingSummaryReducer";
import orderSummaryTotalReducer from "./Trading/TradeOrderSummaryReducer";
import tradinLedgerReport from "./Trading/TradeLedgerReducer";

// Added by Jayesh for Surveys
import surveysReducer from "./Surveys/SurveysReducer";

import thirdPartyApiResponse from './ApiResponseConfig/ApiResponseConfigReducer';
import thirdPartyApiRequest from './ApiRequestConfig/ApiRequestConfigReducer';
import providerConfig from './ProviderConfiguration/ProviderConfigurationReducer';

// code added by devang parekh 26-12-2018
import marketCapReducer from './Trading/MarketCapReducer';

//Added by Jayesh for CRM Form
import zohocrmReducer from "./ZohoCrmForm/ZohoCrmFormReducer";

//Added by Jayesh for Email Templates
import emailtemplatesReducer from "./EmailTemplates/EmailTemplatesReducer";
//Added by Kushal
import regionsReducer from "./Regions/RegionsReducer";
import chatDashboardReducer from "./ChatDashboard/ChatDashboardReducer";
import chatUserListReducer from "./ChatDashboard/ChatUserListReducer";

//added by Tejas Date : 7/1/2019
import coinConfigurationReducer from "./CoinConfiguration/CoinConfigurationReducer";

//Added By Jinesh 
import OrganizationLedgerReducer from './LedgerReport/OrganizationLedgerReducer';
import EmailQueueReportReducer from './Reports/EmailQueueReportReducer';

// Added by Kushal
import helpManualmodulesReducer from "./HelpManual/HelpManualModulesReducer";
import helpManualsReducer from "./HelpManual/HelpManualsReducer";

import displayPushNotificationReducer from "./PushNotificationQueue/PushNotificationQueue"; //Added by Khushbu Badheka D:08/01/2018
/**Dhara gajera 9/1/2019 */
import CoinListRequestReducer from "./CoinListRequest/CoinListRequestReducer";

//Create By Sanjay 
import ApplicationConfig from './MyAccount/ApplicationConfig';
import signinEmailWithOTPReducer from "./MyAccount/SigninEmailWithOTP";
import signinMobileWithOTPReducer from "./MyAccount/SigninMobileWithOTP";
import forgotPasswordRdsr from "./MyAccount/ForgotPassword";
import forgotConfirmationReducer from "./MyAccount/ForgotConfirmation";
import ReferralRewardConfig from './MyAccount/ReferralRewardConfig';
import ReferralDashboardReducer from './MyAccount/ReferralDashboardReducer';
import ReferralPayTypeReducer from './MyAccount/ReferralPayTypeReducer';
import ReferralChannelTypeReducer from './MyAccount/ReferralChannelTypeReducer';
import ReferralServiceTypeReducer from './MyAccount/ReferralServiceTypeReducer';
import ReferralInvitationsReducer from './MyAccount/ReferralInvitationsReducer';

//Added By Megha Kariya
import pushMessageReducer from './PushMessage/PushMessage';
import messageQueueReducer from './Reports/MessageQueueReducer';

// Added By Jinesh
import PushEmail from "./PushEmail/PushEmail";
import EmailApiManagerReducer from './EmailApiManager/EmailApiManagerReducer';

// added by bramarshi
import AllRequestFormet from "./RequestFormatApiManager/RequestFormatApiManagerReducer"; // uncomment & chnage spelling by Megha Kariya (20/02/2019)

// added by Tejas 8/2/2019
import SiteTokenReducer from "./SiteToken/SiteTokenReducer";
import SiteTokenConversionReducer from "./SiteToken/SiteTokenConversionReducer";
/* Marging Trading - added by Nishant */
import LeverageRequestsReducer from './MarginTrading/LeverageRequestsReducer';
import LeverageReportReducer from './MarginTrading/LeverageReportReducer';
import LeverageConfigReducer from './MarginTrading/LeverageConfigReducer';
import MarginWalletLedger from './MarginTrading/WalletLedgerReportReducer';
import WalletManagementReducer from './MarginTrading/WalletManagementReducer';

// Added By Bharat Jograna 
import ReferralReport from "./MyAccount/ReferralReport";
import UsersAndControl from "./MyAccount/UsersAndControl";
import AffiliateSchemeTypeMapping from './MyAccount/AffiliateSchemeTypeMapping';
import ReferralServiceDetail from './MyAccount/ReferralServiceDetail';

//Added by Saloni Rathod
import AffiliateReducer from './MyAccount/AffiliateReport';
import UserReducer from './MyAccount/User';
import socialTradingHistoryReducer from "./SocialProfile/SocialTradingHistory";
import AffiliateSchemeDetailReducer from "./MyAccount/AffiliateSchemeDetail";
import ReferralSchemeTypeMappingReducer from "./MyAccount/ReferralSchemeTypeMapping";

import staticSocialMediasReducer from "./SocialMedias/SocialMediasReducer"; // Added By Megha Kariya (12/02/2019)

// added By Tejas for Feed Limit 18/2/2019
import feedLimitConfiguration from './ExchangeFeedConfig/FeedLimitConfigurationReducer';

//Added by Karan Joshi
import TradingSummeryLpWise from "./TradingSummeryLpWise/TradingSummeryLpWiseReducer";
//Added by dhara gajera 8/2/2019
import zipcodesReducer from "./Localization/ZipCodesReducer";
// Added By Tejas for ApiPlanConfigUration 
import ApiPlanConfigReducer from "./ApiKeyConfiguration/ApiPlanConfigurationReducer";
import ApiPlanSubscriptionReducer from "./ApiKeyConfiguration/ApiPlanSubscriptionHistory";

/* Breadcrumb drawer close */
import DrawerCloseReducer from "./DrawerClose/DrawerCloseReducer";

// Added By devang parekh for ApiPlanConfigurationHistory (11-3-2019)
import ApiPlanConfigHistoryReducer from "./ApiKeyConfiguration/ApiPlanConfigurationHistory";
// Added By devang parekh for ApiKeyConfigurationHistory (11-3-2019)
import ApiKeyConfigHistoryReducer from "./ApiKeyConfiguration/ApiKeyConfigurationHistory";


// added by Tejas for APi Key POlicy Setting 14/3/2019
import ApiKeyPolicySetting from "./ApiKeyConfiguration/ApiKeyPolicySettingReducer";

//Added By Sanjay For API Plan Config Request Count 
import APIPlanConfigurationReducer from "./APIPlanConfiguration/APIPlanConfigurationReducer";
import RestAPIMethodReducer from "./RestAPIMethod/RestAPIMethodReducer";
import ServiceProviderReducer from "./ServiceProvider/ServiceProviderReducer";

/* charge configuration - parth */
import ChargeConfiguration from './ChargeConfigurationReducer/ChargeConfigurationReducer';
import DepositionIntervalReducer from './DepositionIntervalReducer/DepositionIntervalReducer';
import LimitConfigurationReducer from './LimitConfigurationReducer/LimitConfigurationReducer';

/* token unstaking request = added by vishva shah */
import UnstakingPendingRequestReducer from './Wallet/UnstakingPendingRequestReducer';

// added by Tejas for trade Routing report by Tejas 25/3/2019
import TradeRoutingReportReducer from './TradeRoutingReport/TradeRoutingReportReducer';

// added by devang parekh for api key dashboard count 9/4/2019
import ApiKeyDashboardCount from './ApiKeyConfiguration/ApiKeyDashboardCount';

// added by vishva shah
import ServiceProviderBalance from './ServiceProviderBalance/ServiceProviderBalanceReducer';
//added by parth andhariya for Ip Wise Requesr Report 
import IPWiseRequestReportReducer from './IPWiseRequestReportReducer/IPWiseRequestReportReducer';
//added by parth andhariya 23-04-2019
import OpenPositionReportReducer from './MarginTrading/OpenPositionReportReducer';
//added by vishva shah
import ProfitLoassReducer from './MarginTrading/ProfiLossReportReducer';
// added by Tejas for get menu access details 29/4/2019
import GetMenuAccessReducer from './GetMenuAccessDetailsReducer';
// added by vishva shah
import StakingHistoryReport from './StakingHistoryReport/StakingHistoryReportReducer';
//Added By Sanjay 
import HTMLBlocksReducer from "./HTMLBlocks/HTMLBlocksReducer";
import ImageSlidersReducer from "./ImageSliders/ImageSlidersReducer";
import AdvanceHTMLBlocksReducer from "./AdvanceHTMLBlocks/AdvanceHTMLBlocksReducer";
//added by vishva
// import ERC223Reducer from './ERC223/ERC223Reducer';
import IncreaseReducer from './ERC223/IncreaseReducer';
import DecreaseReducer from './ERC223/DecreaseReducer';
import TokenTransferReducer from './ERC223/TokenTransferReducer';
import SetTransferFeeReducer from './ERC223/SetTransferFeeReducer';
import DestroyBlackFundReducer from './ERC223/DestroyBlackFundReducer'
//added by parth andhariya 
import BlockUnblockUserAddressReducer from './BlockUnblockUserAddressReducer/BlockUnblockUserAddressReducer';
import WithdrawalApprovalReducer from './WithdrawalApprovalReducer/WithdrawalApprovalReducer';
//added by parth andhariya (06-06-2019)
import ArbitrageCurrencyConfigurationReducer from './Arbitrage/ArbitrageCurrencyConfiguration/ArbitrageCurrencyConfigurationReducer';
//Added by Palak 04.06.2019 for Market Making 
import marketMakingReducer from "./Trading/MarketMaking";

//added by vishva
import ExchangeBalanceReducer from './Arbitrage/ArbitrageExchangeBalance/ExchangeBalanceReducer';
//added by parth andhariya (10-06-2019)
import TopupHistoryReducer from './Arbitrage/ProviderTopupHistory/TopupHistoryReducer';

// added by devna gparekh (11-6-2019)
import ArbitrageExchangeConfiguration from './Arbitrage/ExchangeConfiguration/ExchangeConfigurationReducer';
//added by vishva
import FeeConfigurationReducer from './Arbitrage/ArbitrageFeeConfiguration/ArbitrageFeeConfigurationReducer';
//added by vishva
import ArbitrageAddressReducer from './Arbitrage/ArbitrageProviderAddress/ArbitrageAddressReducer';
//added by parth andhariya (11-06-2019)
import ConflictHistoryReducer from './Arbitrage/ConflictHistory/ConflictHistoryReducer';
//added by parth andhariya (17-06-2019)
import ProviderLedgerReducer from './Arbitrage/ProviderLedger/ProviderLedgerReducer';
//added by vishva shah
import ProviderWalletReducer from './Arbitrage/ArbitrageProviderWallet/ProviderWalletReducer';
const reducers = combineReducers({
    settings,
    sidebar: sidebarReducer,

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
    changePasswordDashboard: changePasswordDashboard, personalDashboard: PersonalDashboard,
    securityQuestionRdcer: SecurityQuestionDashboard,
    loginHistoryDashboard: LoginHistoryDashboard,
    phoneNumberDashboard: phoneNumberDashboardReducer,
    activityDashboard: activityDashboardReducer,
    groupInfoDashboard: groupInfoDashboardReducer,
    domainDashRdcer: domainDashboardReducer,
    ipProfilingRdcer: ipProfilingReducer,
    passwordPolicyRdcer: passwordPolicyReducer,
    profileConfigurationRdcer: profileConfigurationReducer,

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
    ruleModuleRdcer: ruleModuleReducer,
    ruleSubModuleRdcer: ruleSubModuleReducer,
    ruleToolRdcer: ruleToolReducer,
    ruleFieldRdcer: ruleFieldReducer,
    roleManagementRdcer: roleManagementReducer,
    rolePermissionGroupRdcer: rolePermissionGroupReducer,
    affiliateConfigureRdcer: affiliateConfigureReducer,
    affiliateSchemeRdcer: affiliateSchemeReducer,
    affiliateSchemeTypeRdcer: affiliateSchemeTypeReducer,
    affiliatePromotionRdcer: affiliatePromotionReducer,
    googleauthenable: enablegoogleauthReducer,
    disablegoogleauth: disablegoogleauthReducer,
    providerBalanceCheckRdcer: providerBalanceCheckReducer,

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
    DepositRouteReducer: DepositRouteReducer,
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
    OrgWalletLedgerReducer: OrgWalletLedgerReducer,

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
    coinConfiguration: coinConfigurationReducer,

    //Added By Jinesh
    OrganizationLedger: OrganizationLedgerReducer,
    EmailQueueList: EmailQueueReportReducer,

    //Added by Kushal
    helpmanualmodules: helpManualmodulesReducer,
    helpmanuals: helpManualsReducer,

    displayPushNotification: displayPushNotificationReducer, //Added by Khushbu Badheka D:08/01/2018
    CoinListRequest: CoinListRequestReducer, //Added by Khushbu Badheka D:09/01/2019

    //Create By Sanjay
    ApplicationConfig: ApplicationConfig,
    signInWithEmai: signinEmailWithOTPReducer,
    signInMobileOTP: signinMobileWithOTPReducer,
    forgotPasswordRdsr: forgotPasswordRdsr,
    forgotConfirmation: forgotConfirmationReducer,
    ReferralRewardConfig: ReferralRewardConfig,
    ReferralDashboardReducer: ReferralDashboardReducer,
    ReferralPayTypeReducer: ReferralPayTypeReducer,
    ReferralChannelTypeReducer: ReferralChannelTypeReducer,
    ReferralServiceTypeReducer: ReferralServiceTypeReducer,
    ReferralInvitationsReducer: ReferralInvitationsReducer,

    // Added By Megha Kariya
    pushMessage: pushMessageReducer,
    messageQueue: messageQueueReducer,

    //Added By Jinesh
    pushEmail: PushEmail,
    EmailApiManager: EmailApiManagerReducer,

    //added by bramarshi
    AllRequestFormet: AllRequestFormet, // uncomment by Megha Kariya (20/02/2019)

    //Added By Tejas 8/2/2019
    siteToken: SiteTokenReducer,
    siteTokenConversion: SiteTokenConversionReducer,

    /* Margin Tradign - adde by Nishant */
    LeverageRequestsReducer: LeverageRequestsReducer,
    LeverageReportReducer: LeverageReportReducer,
    LeverageConfigReducer: LeverageConfigReducer,
    MarginWalletLedger: MarginWalletLedger,
    WalletManagementReducer: WalletManagementReducer,

    // Added By Bharat Jograna
    ReferralReport: ReferralReport,
    UsersAndControl: UsersAndControl,
    AffiliateSchemeTypeMapping: AffiliateSchemeTypeMapping,
    ReferralServiceDetail: ReferralServiceDetail,

    //Added By Saloni
    AffiliateRdcer: AffiliateReducer,
    UserRdcer: UserReducer,
    socialTradingHistoryReducer: socialTradingHistoryReducer,
    affiliateSchemeDetailReducer: AffiliateSchemeDetailReducer,
    ReferralSchemeTypeMappingReducer: ReferralSchemeTypeMappingReducer,

    staticSocialMedias: staticSocialMediasReducer, // Added By Megha Kariya (12/02/2019)

    //added By Tejas for feed Limit 18/2/2019
    feedLimit: feedLimitConfiguration,

    //Added by Karan Joshi
    TradingLpWise: TradingSummeryLpWise,
    //Added by dhara gajera 8/2/2019
    zipcodes: zipcodesReducer,
    //added by Tejas 21/2/2019
    ApiPlanConfig: ApiPlanConfigReducer,

    /* Breadcrumb drawer close */
    drawerclose: DrawerCloseReducer,

    //added by Tejas 
    ApiPlanSubscription: ApiPlanSubscriptionReducer,
    // added by devang parekh (11-3-2019)
    ApiPlanConfigurationHistory: ApiPlanConfigHistoryReducer,
    // added by devang parekh (12-3-2019)
    ApiKeyConfigurationHistory: ApiKeyConfigHistoryReducer,

    // added by Tejas 14/3/2019
    ApiKeyPolicy: ApiKeyPolicySetting,

    //Added By Sanjay 
    APIPlanConfigurationReducer: APIPlanConfigurationReducer,
    RestAPIMethodReducer: RestAPIMethodReducer,
    ServiceProviderReducer: ServiceProviderReducer,

    //charge config - by parth
    ChargeConfiguration: ChargeConfiguration,
    DepositionInterval: DepositionIntervalReducer,
    ConfigurationLimit: LimitConfigurationReducer,

    // unstaking requests - by vishva
    UnstakingPendingRequestReducer: UnstakingPendingRequestReducer,

    // added by Tejas 25/3/2019

    tradeRoutingReport: TradeRoutingReportReducer,
    apiKeyDashboardCount: ApiKeyDashboardCount, // added by devang parekh 
    ServiceProviderBalance: ServiceProviderBalance, //added by vishva
    IPWiseRequest: IPWiseRequestReportReducer, //added by parth andhariya 
    OpenPositionReport: OpenPositionReportReducer, // added by parth andhariya   23-04-2019
    ProfitLoassReducer: ProfitLoassReducer, //added by vishva
    getMenuAccess: GetMenuAccessReducer, // added by Tejas 29/4/2019
    StakingHistoryReport: StakingHistoryReport,//added by vishva
    //Added By Sanjay 
    HTMLBlocksReducer: HTMLBlocksReducer,
    ImageSlidersReducer: ImageSlidersReducer,
    AdvanceHTMLBlocksReducer: AdvanceHTMLBlocksReducer,
    // ERC223Reducer:ERC223Reducer, //added by vishva
    BlockUnblockUserAddress: BlockUnblockUserAddressReducer, //added by parth andhariya
    WithdrawalApproval: WithdrawalApprovalReducer, //added by parth andhariya (04-06-2019)
    IncreaseReducer: IncreaseReducer,//added by vishva
    DecreaseReducer: DecreaseReducer, //added by vishva
    TokenTransferReducer: TokenTransferReducer,//added by vishva
    SetTransferFeeReducer: SetTransferFeeReducer,//added by vishva
    DestroyBlackFundReducer: DestroyBlackFundReducer, //added by vishva
    ArbitrageCurrencyConfiguration: ArbitrageCurrencyConfigurationReducer,//added by parth andhariya (06-06-2019)
    marketMakingRdcer: marketMakingReducer,//added by palak 04.06.2019 
    ExchangeBalanceReducer: ExchangeBalanceReducer, //added by vishva
    TopupHistory: TopupHistoryReducer, //added by parth andhariya (10-06-2019),
    ConflictHistory: ConflictHistoryReducer, //added by parth andhariya (11-06-2019),
    arbitrageExchangeConfiguration: ArbitrageExchangeConfiguration, // added by devang parekh (11-6-2019)
    FeeConfigurationReducer: FeeConfigurationReducer, //added by vishva
    ArbitrageAddressReducer: ArbitrageAddressReducer, //added by vishva
    ProviderLedger: ProviderLedgerReducer,// added by Parth Andhariya (17-06-2019)
    ProviderWalletReducer:ProviderWalletReducer,
});

export default reducers;