/**
 * Root Sagas
 */
import { all } from "redux-saga/effects";

// sagas
import feedbacksSagas from "./Feedbacks";
import pageContentSagas from "./PageContent";

//Parthbhai....
import loginHistorySagas from "./MyAccount/LoginHistory";
import ipHistorySagas from "./MyAccount/IPHistory";
import deviceManagementSagas from "./MyAccount/DeviceManagement";
import editProfileSagas from "./MyAccount/EditProfile";
import antiPhishingCodeSagas from "./MyAccount/AntiPhishingCode";

//Kevinbhai....
import userauthSagas from "./MyAccount/UserAuth";
import usermobileauthSagas from "./MyAccount/UserMobileAuth";
import userblockchainauthSagas from "./MyAccount/UserBlockchainAuth";
import smsauthSagas from "./MyAccount/SmsAuth";
import enablegoogleauthSagas from "./MyAccount/EnableGoogleAuth";
import resetpasswordSagas from "./MyAccount/ResetPassword";
import changepasswordSagas from "./MyAccount/ChangePassword";
import disablesmsauthSagas from "./MyAccount/DisableSmsAuth";
import disablegoogleauthSagas from "./MyAccount/DisableGoogleAuth";
import membershipLevelSagas from "./MyAccount/Membership";
import tradeSummarySagas from "./MyAccount/TradeSummary";
import topGainersSagas from "./MyAccount/TopGainers";
import topLosersSagas from "./MyAccount/TopLosers";
import ipWhitelistSagas from "./MyAccount/IPWhitelist";
import deviceListSagas from "./MyAccount/DeviceWhitelisting";
import themeConfigSagas from "./MyAccount/ThemeConfiguration";
import forgotConfirmationSagas from "./MyAccount/ForgotConfirmation";

import socialProfileSagas from "./SocialProfile/SocialProfile";

//Salimbhai....
import twoFAAuthenticationSagas from "./MyAccount/2FAAuthentication";
import forgotPasswordSagas from "./MyAccount/ForgotPassword";
import personalVerificationFormSagas from "./MyAccount/PersonalVerificationForm";
import enterpriseVerificationFormSagas from "./MyAccount/EnterpriseVerificationForm";
import referralFriendsSagas from "./MyAccount/ReferralFriends";
import referralLatestCommissionHisorySagas from "./MyAccount/ReferralLatestCommissionHisory";
import activityListSagas from "./MyAccount/ActivityList";
import apiSettingSagas from "./MyAccount/APISetting";
import socialLoginSagas from "./MyAccount/SocialLogin";
import complainSagas from "./MyAccount/Complain";
import normalRegisterSagas from "./MyAccount/NormalRegistration";
import signupEmailOTPSagas from "./MyAccount/SignupEmailWithOTP";
import signupMobileOTPSagas from "./MyAccount/SignupMobileWithOTP";
import normalLoginSagas from "./MyAccount/NormalLogin";
import signinEmailOTPSagas from "./MyAccount/SigninEmailWithOTP";
import signinMobileOTPSagas from "./MyAccount/SigninMobileWithOTP";
import authorizationTokenSagas from "./MyAccount/AuthorizationToken";
import signupBlockchainSagas from "./MyAccount/SignupWithBlockchain";
import emailConfirmationSagas from "./MyAccount/EmailConfirmation";
import deviceAuthorizeSagas from "./MyAccount/DeviceAuthorize";
import socialTradingPolicySagas from "./SocialProfile/SocialTradingPolicy";
import historicalPerformanceSagas from "./SocialProfile/HistoricalPerformance";
import portfolioSagas from "./SocialProfile/Portfolio";
import topGainerSagas from "./SocialProfile/TopGainer";
import topLooserSagas from "./SocialProfile/TopLooser";
import topLeaderSagas from "./SocialProfile/TopLeader";
import leaderBoardSagas from "./SocialProfile/LeaderBoard";
import affiliateSagas from "./MyAccount/Affiliate";
import languagePreferenceSagas from "./Language/LanguagePreference";

//Added by Bharatbhai
import AffiliateSchemeTypeMapping from "./MyAccount/AffiliateSchemeTypeMapping";

//Added by saloni
import affiliateInviteFriendsSagas from "./MyAccount/AffiliateInviteFriends";
import userConfirmationSagas from "./MyAccount/UserConfirmation";
import affiliateReportSagas from "./MyAccount/AffiliateReport";


// added by Tejas
import tradeSagas from "./Trade/Pair";
import pairListSagas from "./Trade/PairList";
import holdingsSaga from "./Trade/HoldingsSaga";
import openOrderSaga from "./Trade/OpenOrdersSaga";
import recentOrderSaga from "./Trade/RecentOrdersSaga";
import currentMarketCapSaga from "./Trade/CurrentMarketCapSaga";
import newsTickerSaga from "./Trade/NewsTickerSaga";
import currencySaga from "./Trade/CurrencyDetailsSaga";
import placeOrderSaga from "./Trade/PlaceOrderSaga";
import chartData from "./Trade/TradeChartDataSaga";
import transactionCharge from "./TransactionCharge/TransactionChargeSaga";
import topGainerLoserSaga from './Trade/TopGainerLoserSaga';

// added by devang parekh
import transactionHistory from "./TransactionHistory";
import openOrders from "./OpenOrders";

// Added By Kushal
import contactusSagas from "./Contactus/Contactus";
import newsSagas from "./News/News";
import faqSagas from "./Faq/Faq";
import annoucementSagas from "./Annoucement/Annoucement";
import apiSagas from "./Api/Api";

/* Added By Nishant */
import depositHistorySaga from "./Deposit/HistorySaga";
import withdrawHistorySaga from "./Withdraw/HistorySaga";
import addressGenerationSaga from "./Deposit/AddressGenerationSaga";
import withdrawSaga from "./Withdraw/WithdrawSaga";
import tokenStakingSaga from "./TokenStaking/TokenStakingSaga";
import stakingHistorySaga from "./TokenStaking/StakingHistorySaga";
import convertHistorySaga from "./ConvertToken/ConvertHistorySaga";
import convertTokenInfoSaga from "./ConvertToken/ConvertTokenSaga";
import limitControlSaga from "./LimitsControl/LimitsControlSaga";
import transferInSaga from "./TransferInOut/TransferInSaga";
import transferOutSaga from "./TransferInOut/TransferOutSaga";
import decentAddressGenSaga from "./DecentAddressGen/DecentAddressGenSaga";
import whitelistedAddressListSaga from "./AddressWhitelist/WhitelistedAddressListSaga";
import fundBalanceSaga from "./FundBalances/FundBalancesSaga";
import incomingTransactionsSaga from "./IncomingTransactions/IncomingTransactionsSaga";
import outGoingTransactionsSaga from "./OutGoingTransaction/OutGoingTransactionSaga";
import myWalletSaga from "./MyWallets/MyWalletsSaga";
import WalletManagementSaga from "./MarginTrading/WalletManagementSaga";
import WalletLedger from './MarginTrading/WalletLedger';

//added by Nirmit
import tradingledgerSaga from "./TradingReport/TradingLedgerSaga";

// added By Tejas
import myLedgerSaga from "./TradingReport/MyLedgerSaga";

// added By Kushal
import coinListSaga from "./Coinlist/Coinlist";
// added by Jayesh 
import languagesSaga from "./Language/Language";
import surveySaga from "./Survey/Survey";
// added code by devang parekh 26-12-2018
import coinSliderSaga from "./LandingPage/CoinSlider";
//added by Kushal parekh 28-12-2018
import regionsSagas from "./Regions/Regions";

import tradeSummaryReport from './TradingReport/TradeSummarySaga';

//Added by Jayesh Pathak 09-01-2019
import helpcenterSagas from "./HelpCenter/HelpCenter";
import coinListRequestSaga from "./Coinlist/CoinListRequest"; //Dhara gajera 4/1/2019

import modeChangeSaga from './modeChangeSaga';

//Added By Tejas 6/2/2019 for charges type
import ChargeTypeSaga from "./Trade/ChargeListSaga";

//added by Tejas 11/2/2019
import siteTokenReportSaga from "./SiteTokenReport/SiteTokenReportSaga";

import siteTokenConversionSaga from "./SiteTokenConversion/SiteTokenConversionSaga";
import socialMediaSaga from "./SocialMedia/SocialMedia"; // Added By Megha Kariya (13/02/2019)

//Added By Sanjay 
import ReferralProgramSaga from "./MyAccount/ReferralProgramSaga";
import ReferralInviteByEmailAndSMS from './MyAccount/ReferralInviteByEmailAndSMS';
import ReferralURLClick from './MyAccount/ReferralURLClick';
import ReferralReportSaga from './MyAccount/ReferralReportSaga';

// added By tejas 26/2/2019
import ApiPlanSaga from "./ApiPlan/ApiPlanSaga";

// code added by devang parekh for margin trading dashboard leverage detail (6-3-2019)
import LeverageDetail from './MarginTrading/LeverageDetail';

/* Leverage report done by parth andhariya */
import LeverageReportSaga from './MarginTrading/LeverageReportSaga';

// added By tejas 7/3/2019
import ApiKeySaga from "./ApiKey/ApiKeySaga";

//added by tejas 14/3/2019
import APICustomLimits from "./ApiPlan/ApiCustomLimitSaga";

//added by vishva
import ProfitLossSaga from './MarginTrading/ProfitLossSaga';

//added by parth andhariya 22-2019
import OpenPositionReportSaga from './MarginTrading/OpenPositionReportSaga';
import ArbitrageLedgerSaga from './Arbitrage/ArbitrageLedgerSaga';
import ArbitrageWalletSaga from './Arbitrage/ArbitrageWalletSaga';

//added by Tejas for Buyer book 3/6/2019
import ArbitrageOrderBook from "./Arbitrage/OrdersDetailsSaga";

//added by Tejas 3/6/2019
import ArbitrageReportsList from "./Arbitrage/Reports";

//added by Tejas 5/6/2019
import ArbitragePlaceOrder from "./Arbitrage/PlaceOrderSaga";

// code added by devang parekh (7-6-2019)
import ArbitrageProfitIndicator from "./Arbitrage/ProfitIndicator";

//added by Tejas 11/6/2019
import ArbitrageTradingSaga from "./Arbitrage/ArbitrageTradingSaga";

//added by Tejas 12/6/2019
import ArbitrageExchangeSaga from "./Arbitrage/ArbitrageExchangeSaga";
import AnalyticSaga from "./Arbitrage/AnalyticSaga"; //added by vishva

export default function* rootSaga(getState) {
  yield all([
    feedbacksSagas(),
    pageContentSagas(),

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
    membershipLevelSagas(),
    tradeSummarySagas(),
    topGainersSagas(),
    topLosersSagas(),
    ipWhitelistSagas(),
    deviceListSagas(),
    themeConfigSagas(),
    forgotConfirmationSagas(),

    socialProfileSagas(),

    //Salimbhai....
    twoFAAuthenticationSagas(),
    forgotPasswordSagas(),
    personalVerificationFormSagas(),
    enterpriseVerificationFormSagas(),
    referralFriendsSagas(),
    referralLatestCommissionHisorySagas(),
    activityListSagas(),
    apiSettingSagas(),
    socialLoginSagas(),
    complainSagas(),
    normalRegisterSagas(),
    signupEmailOTPSagas(),
    signupMobileOTPSagas(),
    normalLoginSagas(),
    signinEmailOTPSagas(),
    signinMobileOTPSagas(),
    authorizationTokenSagas(),
    signupBlockchainSagas(),
    emailConfirmationSagas(),
    deviceAuthorizeSagas(),
    socialTradingPolicySagas(),
    historicalPerformanceSagas(),
    portfolioSagas(),
    topGainerSagas(),
    topLooserSagas(),
    topLeaderSagas(),
    leaderBoardSagas(),
    affiliateSagas(),
    languagePreferenceSagas(),

    //Added by bharat
    AffiliateSchemeTypeMapping(),

    //Added by saloni
    affiliateInviteFriendsSagas(),
    userConfirmationSagas(),
    affiliateReportSagas(),

    // added by tejas
    pairListSagas(),
    tradeSagas(),
    holdingsSaga(),
    openOrderSaga(),
    recentOrderSaga(),
    currentMarketCapSaga(),
    newsTickerSaga(),
    currencySaga(),
    placeOrderSaga(),
    chartData(),
    transactionCharge(),

    // added by devang parekh
    transactionHistory(),
    openOrders(),

    //Added by Kushal
    contactusSagas(),
    newsSagas(),
    faqSagas(),
    annoucementSagas(),
    apiSagas(),

    /* Added By Nishant */
    depositHistorySaga(),
    withdrawHistorySaga(),
    addressGenerationSaga(),
    withdrawSaga(),
    tokenStakingSaga(),
    stakingHistorySaga(),
    convertHistorySaga(),
    convertTokenInfoSaga(),
    limitControlSaga(),
    transferInSaga(),
    transferOutSaga(),
    decentAddressGenSaga(),
    whitelistedAddressListSaga(),
    fundBalanceSaga(),
    myWalletSaga(),
    WalletManagementSaga(),
    WalletLedger(),
    //added Nirmit
    tradingledgerSaga(),
    //added By tejas
    myLedgerSaga(),
    //added by Kushal
    coinListSaga(),
    incomingTransactionsSaga(),
    outGoingTransactionsSaga(),
    coinSliderSaga(),
    //added by Jayesh
    languagesSaga(),
    surveySaga(),
    regionsSagas(),

    //added by tejas
    topGainerLoserSaga(),

    tradeSummaryReport(),
    //Added by Jayesh
    helpcenterSagas(),
    coinListRequestSaga(),

    //added By Sanjay 
    modeChangeSaga(),

    //added by tejas
    ChargeTypeSaga(),
    // added by Tejas 11/2/2019
    siteTokenReportSaga(),
    siteTokenConversionSaga(),
    socialMediaSaga(), // Added By Megha Kariya (13/02/2019)

    //Added by Sanjay 
    ReferralProgramSaga(),
    ReferralInviteByEmailAndSMS(),
    ReferralURLClick(),
    ReferralReportSaga(),
    //Added By TEjas 26/2/2019
    ApiPlanSaga(),
    LeverageDetail(), // code added by devang parekh for margin trading dashboard leverage detail (6-3-2019)

    LeverageReportSaga(), // done by parth andhariya

    ApiKeySaga(), // added by Tejas 7/3/2019

    APICustomLimits(), // added by Tejas 14/3/2019
    ProfitLossSaga(),
    OpenPositionReportSaga(), //added by parth andhariya 22-04-2019
    ArbitrageLedgerSaga(), //added by vishva
    ArbitrageWalletSaga(), //added by vishva

    ArbitrageOrderBook(), // added byTejas 3/6/2019
    ArbitrageReportsList(), // added byTejas 3/6/2019
    ArbitragePlaceOrder(), // added byTejas 5/6/2019
    ArbitrageProfitIndicator(), // added by devang parekh (7-3-2019)

    ArbitrageTradingSaga(), // added Tejas 11/6/2019

    ArbitrageExchangeSaga(), // added Tejas 12/6/2019
    AnalyticSaga(), //added by vishva
  ]);
}