/**
 * App Reducers
 */
import { combineReducers } from "redux";
import settings from "./settings";
import chatAppReducer from "./ChatAppReducer";
import sidebarReducer from "./SidebarReducer";
import feedbacksReducer from "./FeedbacksReducer";
import ecommerceReducer from "./EcommerceReducer";
import pageContentAppReducuer from "./PageContentAppReducer";

//Parthbhai....
import loginHistoryReducer from "./MyAccount/LoginHistory";
import ipHistoryReducer from "./MyAccount/IPHistory";
import deviceManagementReducer from "./MyAccount/DeviceManagement";
import editProfileReducer from "./MyAccount/EditProfile";
import antiPhishingCodeReducer from "./MyAccount/AntiPhishingCode";

//Kevinbhai....
import userauthReducer from "./MyAccount/UserAuthReducer";
import usermobileauthReducer from "./MyAccount/UserMobileAuthReducer";
import userblockchainauthReducer from "./MyAccount/UserBlockchainAuthReducer";
import smsauthReducer from "./MyAccount/SmsAuthReducer";
import enablegoogleauthReducer from "./MyAccount/EnableGoogleAuthReducer";
import resetpasswordReducer from "./MyAccount/ResetPasswordReducer";
import changepasswordReducer from "./MyAccount/ChangePasswordReducer";
import disablesmsauthReducer from "./MyAccount/DisableSmsAuthReducer";
import disablegoogleauthReducer from "./MyAccount/DisableGoogleAuthReducer";
import membershipLevelReducer from "./MyAccount/MembershipLevel";
import tradeSummaryReducer from "./MyAccount/TradeSummary";
import topGainersReducer from "./MyAccount/TopGainers";
import topLosersReducer from "./MyAccount/TopLosers";
import ipWhitelistReducer from "./MyAccount/IPWhitelist";
import deviceWhitelistingReducer from "./MyAccount/DeviceWhitelisting";
import themeConfigReducer from "./MyAccount/ThemeConfiguration";
import forgotConfirmationReducer from "./MyAccount/ForgotConfirmation";
import socialProfileReducer from "./SocialProfile/SocialProfile";

//Salimbhai....
import twoFAAuthenticationReducer from "./MyAccount/2FAAuthentication";
import loginReducer from "./MyAccount/Login";
import forgotPasswordReducer from "./MyAccount/ForgotPassword";
import personalVerificatonFormReducer from "./MyAccount/PersonalVerificationForm";
import enterpriseVerificatonFormReducer from "./MyAccount/EnterpriseVerificationForm";
import refFriendReducer from "./MyAccount/ReferralFriends";
import refLatestCommissionHistoryReducer from "./MyAccount/ReferralLatestCommissionHistory";
import activityListReducer from "./MyAccount/ActivityList";
import apiSettingReducer from "./MyAccount/APISetting";
import socialLoginReducer from "./MyAccount/SocialLogin";
import complainReducer from "./MyAccount/Complain";
import normalRegistrationReducer from "./MyAccount/NormalRegistration";
import signupEmailWithOTPReducer from "./MyAccount/SignupEmailWithOTP";
import signupMobileWithOTPReducer from "./MyAccount/SignupMobileWithOTP";
import normalLoginReducer from "./MyAccount/NormalLogin";
import signinEmailWithOTPReducer from "./MyAccount/SigninEmailWithOTP";
import signinMobileWithOTPReducer from "./MyAccount/SigninMobileWithOTP";
import authorizationTokenReducer from "./MyAccount/AuthorizationToken";
import signupBlockchainReducer from "./MyAccount/SignupWithBlockchain";
import emailConfirmationReducer from "./MyAccount/EmailConfirmation";
import unlockUserReducer from "./MyAccount/UnlockUser";
import deviceAuthorizeReducer from "./MyAccount/DeviceAuthorize";
import socialTradingPolicyReducer from "./SocialProfile/SocialTradingPolicy";
import historicalPerformanceReducer from "./SocialProfile/HistoricalPerformance";
import portfolioReducer from "./SocialProfile/Portfolio";
import topGainerReducer from "./SocialProfile/TopGainer";
import topLooserReducer from "./SocialProfile/TopLooser";
import topLeaderReducer from "./SocialProfile/TopLeader";
import leaderBoardReducer from "./SocialProfile/LeaderBoard";
import affiliateReducer from "./MyAccount/Affiliate";
import arbitrageReportReducer from "./Arbitrage/Reports";

//Added By Bharatbhai
import AffiliateSchemeTypeMapping from './MyAccount/AffiliateSchemeTypeMapping'

//Added By Saloni
import affiliateInviteFriendsReducer from "./MyAccount/AffiliateInviteFriends";
import userConfirmationReducer from "./MyAccount/UserConfirmation";
import affiliateReportReducer from "./MyAccount/AffiliateReport";

// Added By Tejas
import tradePairReducer from "./Trade/PairAppReducer";
import tradePairListReducer from "./Trade/PairListReducer";
import tradeHoldingReducer from "./Trade/HoldingsReducers";
import tradeSellerOrderReducer from "./Trade/SellerOrderReducer";
import tradeBuyerOrderReducer from "./Trade/BuyerOrderReducer";
import tradeMarketTradeHistoryReducer from "./Trade/MarketTradeHistoryReducer";
import tradeOpenOrderReducer from "./Trade/OpenOrdersReducer";
import tradeRecentOpenOrderReducer from "./Trade/RecentOrdersReducer";
import tradeCurrentMarketCapReducer from "./Trade/CurrentMarketCapReducer";
import tradeNewsTickerReducer from "./Trade/NewsTickerReducer";
import tradeCurrencyReducer from "./Trade/CurrencyDetailsReducer";
import placeOrderReducer from "./Trade/PlaceOrderReducer";
import tradeChartDataReducer from "./Trade/TradeChartDataReducer";
import transactionChargeReducer from "./TransactionCharge/TransactionChargeReducer";
import topGainerLoser from './Trade/TopGainerLoserReducer';
//Added By Devang
import transactionHistoryReducer from "./TransactionHistoryReducer";
import openOrdersReducer from "./OpenOrdersReducer";

//Added by Kushal
import contactusReducer from "./Contactus/ContactusReducer";
import newsReducer from "./News/NewsReducer";
import faqReducer from "./Faq/FaqReducer";
import annoucementReducer from "./Annoucement/AnnoucementReducer";
import apiReducer from "./Api/ApiReducer";

//added by Nishant Vadgama
import adddressGeneration from "./Deposit/AddressGenerationReducer";
import depositHistory from "./Deposit/HistoryReducer";
import withdrawHistory from "./Withdraw/HistoryReducer";
import withdrawApp from "./Withdraw/WithdrawReducer";
import tokenStakingReducer from "./TokenStaking/TokenStakingReducer";
import stakingHistoryReducer from "./TokenStaking/StakingHistoryReducer";
import convertHistory from "./ConvertToken/ConvertHistoryReducer";
import convertTokenInfo from "./ConvertToken/ConvertTokenReducer";
import limitsControl from "./LimitsControl/LimitsControlReducer";
import transferIn from "./TransferInOut/TransferInReducer";
import transferOut from "./TransferInOut/TransferOutReducer";
import decentAddressGenReducer from "./DecentAddressGen/DecentAddressGenReducer";
import addressWhitelist from "./AddressWhitelist/WhitelistedAddressListReducer";
import fundBalanceReducer from "./FundBalances/FundBalancesReducer";
import incomingTransactionsReducer from "./IncomingTransactions/IncomingTransactionsReducer";
import outGoingTransactionsReducer from "./OutGoingTransaction/OutGoingTransactionReducer";
import MyWalletsReducer from "./MyWallets/MyWalletsReducer";
import WalletManagementReducer from "./MarginTrading/WalletManagementReducer";
import WalletLedger from './MarginTrading/WalletLedger';

/* Trading Reducer - Added By Nirmit */
import tradingledgerReducer from "./TradingReport/TradingLedgerReducer";
import myLedgerReducer from "./TradingReport/MyLedgerReducer";

/* Coinlist Reducer - Added by Kushal */
import coinlistReducer from "./Coinlist/CoinlistReducer";
import surveyReducer from "./Survey/SurveyReducer";
// code added by devang parekh 26-12-2018
import coinSliderReducer from "./LandingPage/CoinSliderReducer";
//Added by Kushal
import regionsReducer from "./Regions/RegionsReducer";

import tradeSummaryReportReducer from './TradingReport/TradeSummaryReducer';

//Added by Jayesh 
import helpCenterReducer from "./HelpCenter/HelpCenterReducer";
/* Coinlist request Reducer - Added by dhara gajera */
import coinlistRequestReducer from "./Coinlist/CoinListRequestReducer";

//added By Tejas for charge list 6/2/2019
import chargeListReducer from "./Trade/ChargeListReducer";

// added by Tejas 11/2/2019
import SiteTokenReportReducer from "./SiteTokenReport/SiteTokenReportReducer";
import SiteTokenConversionReducer from "./SiteTokenConversion/SiteTokenConversionReducer";
import socialMediaReducer from "./SocialMedia/SocialMediaReducer";  // Added By Megha Kariya (13/02/2019)

//Added By Sanjay 
import ReferralProgramReducer from './MyAccount/ReferralProgramReducer';
import ReferralInviteByEmailAndSMS from "./MyAccount/ReferralInviteByEmailAndSMS";
import ReferralURLClick from './MyAccount/ReferralURLClick';
import ReferralReportReducer from './MyAccount/ReferralReportReducer';


// added by Tejas 26/2/2019
import ApiPlanReducer from "./ApiPlan/ApiPlanReducer";
import ApiKeyReducer from "./ApiKey/ApiKeyListReducer";

// added By Tejas 14/3/2019
import APICustomLimits from "./ApiPlan/ApiCustomLimitReducer";


// added by devang parekh for handle leverage detail in margin dashboard (6-3-2019)
import LeverageDetail from './MarginTrading/LeverageDetail';
/* leverage report - done by parth andhariya */
import LeverageReportReducer from './MarginTrading/LeverageReportReducer';
//added by vishva
import ProfitLossReducer from './MarginTrading/ProfitLossReducer';
import OpenPositionReportReducer from './MarginTrading/OpenPositionReportReducer';
import ArbitrageLedgerReducer from './Arbitrage/ArbitrageLedgerReducer'; //added vishva 
import ArbitrageWalletReducer from './Arbitrage/WalletReducer';
import AnalyticReducer from './Arbitrage/AnalyticReducer'; //added by vishva

// added By TEjas 3/6/2019
import ArbitrageOrderBookReducer from "./Arbitrage/OrdersDetailsReducer";

// added By TEjas 3/6/2019
import arbitrageReports from "./Arbitrage/Reports";

// added By Tejas 5/6/2019
import arbitragePlaceOrder from "./Arbitrage/PlaceOrderReducer";

// added by devang parekh
import arbitradeProfitIndicator from "./Arbitrage/ProfitIndicator";

// added By TEjas 11/6/2019
import ArbitrageTrading from "./Arbitrage/ArbitrageTradingReducer";

//added by Tejas 12/6/2019
import ArbitrageExchange from "./Arbitrage/ArbitrageExchangeReducer";

const reducers = combineReducers({
  settings,
  chatAppReducer,
  sidebar: sidebarReducer,
  feedback: feedbacksReducer,
  ecommerce: ecommerceReducer,
  pageContentApp: pageContentAppReducuer,

  //Parthbhai...
  loginHistoryRdcer: loginHistoryReducer,
  ipHistoryRdcer: ipHistoryReducer,
  deviceManagementRdcer: deviceManagementReducer,
  editProfileRdcer: editProfileReducer,
  antiPhishingCodeRdcer: antiPhishingCodeReducer,

  //Kevinbhai.....
  userauth: userauthReducer,
  usermobileauth: usermobileauthReducer,
  userblockchainauth: userblockchainauthReducer,
  smsauth: smsauthReducer,
  googleauthenable: enablegoogleauthReducer,
  resetpwd: resetpasswordReducer,
  changepwd: changepasswordReducer,
  disablesmsauth: disablesmsauthReducer,
  disablegoogleauth: disablegoogleauthReducer,
  membershipLevelRdcer: membershipLevelReducer,
  tradeSummary: tradeSummaryReducer,
  topGainers: topGainersReducer,
  topLosers: topLosersReducer,
  ipWhitelist: ipWhitelistReducer,
  deviceRdcer: deviceWhitelistingReducer,
  themeConfig: themeConfigReducer,
  forgotConfirmationReducer: forgotConfirmationReducer,

  socialProfileRdcer: socialProfileReducer,

  //Salimbhai.....
  twoFAAuth: twoFAAuthenticationReducer,
  loginRdcer: loginReducer,
  forgotPassRdcer: forgotPasswordReducer,
  prsnlVerifyFrmRdcer: personalVerificatonFormReducer,
  entpriseVerifyFrmRdcer: enterpriseVerificatonFormReducer,
  refFrndRdcer: refFriendReducer,
  refLtstCmsnHstRdcer: refLatestCommissionHistoryReducer,
  activityListRdcer: activityListReducer,
  apiSettingRdcer: apiSettingReducer,
  socialLoginRdcer: socialLoginReducer,
  complainRdcer: complainReducer,
  nrlRegRdcer: normalRegistrationReducer,
  sgnUpEmailOTPRdcer: signupEmailWithOTPReducer,
  sgnUpMobileOTPRdcer: signupMobileWithOTPReducer,
  nrlLoginRdcer: normalLoginReducer,
  sgnInEmailOTPRdcer: signinEmailWithOTPReducer,
  sgnInMobileOTPRdcer: signinMobileWithOTPReducer,
  authTokenRdcer: authorizationTokenReducer,
  sgnUpBlkchnRdcer: signupBlockchainReducer,
  emailConfirmRdcer: emailConfirmationReducer,
  unlockUserRdcer: unlockUserReducer,
  devAuthRdcer: deviceAuthorizeReducer,
  socialTradePolicyRdcer: socialTradingPolicyReducer,
  historicalPerformanceRdcer: historicalPerformanceReducer,
  portfolioRdcer: portfolioReducer,
  topGainerRdcer: topGainerReducer,
  topLooserRdcer: topLooserReducer,
  topLeaderRdcer: topLeaderReducer,
  leaderBoardRdcer: leaderBoardReducer,
  affiliateRdcer: affiliateReducer,
  arbitrageReportRdcer: arbitrageReportReducer,

  //Added by Bharatbhai
  AffiliateSchemeTypeMapping: AffiliateSchemeTypeMapping,

  //Added by saloni
  invitefriends: affiliateInviteFriendsReducer,
  userConfirmRdcer: userConfirmationReducer,
  affiliateReportRdcer: affiliateReportReducer,

  // added by tejas
  tradePair: tradePairReducer,
  tradePairList: tradePairListReducer,
  holdings: tradeHoldingReducer,
  sellerOrder: tradeSellerOrderReducer,
  buyerOrder: tradeBuyerOrderReducer,
  marketTradeHistory: tradeMarketTradeHistoryReducer,
  recentOrder: tradeRecentOpenOrderReducer,
  openOrder: tradeOpenOrderReducer,
  currentMarketCap: tradeCurrentMarketCapReducer,
  newsTicker: tradeNewsTickerReducer,
  currency: tradeCurrencyReducer,
  placeOrder: placeOrderReducer,
  tradeChart: tradeChartDataReducer,
  transactionCharge: transactionChargeReducer,

  // added by devang parekh
  transactionHistoryReducer: transactionHistoryReducer,
  openOrdersReducer: openOrdersReducer,
  //Added by Kushal
  contactus: contactusReducer,
  news: newsReducer,
  faq: faqReducer,
  annoucement: annoucementReducer,
  api: apiReducer,

  //added by nishant vadgama
  adddressGeneration: adddressGeneration,
  depositHistory: depositHistory,
  withdrawHistory: withdrawHistory,
  withdrawApp: withdrawApp,
  tokenStakingReducer: tokenStakingReducer,
  stakingHistoryReducer: stakingHistoryReducer,
  convertHistory: convertHistory,
  convertTokenInfo: convertTokenInfo,
  limitsControl: limitsControl,
  transferIn: transferIn,
  transferOut: transferOut,
  decentAddressGenReducer: decentAddressGenReducer,
  addressWhitelist: addressWhitelist,
  fundBalanceReducer: fundBalanceReducer,
  MyWalletsReducer: MyWalletsReducer,
  WalletManagementReducer: WalletManagementReducer,
  WalletLedger: WalletLedger,
  //Sanjay
  incomingTransactionsReducer: incomingTransactionsReducer,
  outGoingTransactionsReducer: outGoingTransactionsReducer,
  //added Nirmit
  tradingledgerReducer: tradingledgerReducer,
  // added by Tejas
  myLedgerReducer: myLedgerReducer,
  //added by kushal
  coinlist: coinlistReducer,
  coinSlider: coinSliderReducer,
  survey: surveyReducer,
  regions: regionsReducer,
  topGainerLoser: topGainerLoser,
  tradeSummaryReport: tradeSummaryReportReducer,
  //Added by Jayesh 
  helpCenter: helpCenterReducer,
  coinlistRequest: coinlistRequestReducer,
  chargeList: chargeListReducer,
  // Added By Tejas 11/2/2019
  siteTokenReport: SiteTokenReportReducer,
  siteTokenConversion: SiteTokenConversionReducer,
  socialMedia: socialMediaReducer, // Added By Megha Kariya (13/02/2019)
  //Added By Sanjay 
  ReferralProgramReducer: ReferralProgramReducer,
  ReferralInviteByEmailAndSMS: ReferralInviteByEmailAndSMS,
  ReferralURLClick: ReferralURLClick,
  ReferralReportReducer: ReferralReportReducer,
  // added by tejas 26/2/2019
  apiPlan: ApiPlanReducer,
  leverageDetail: LeverageDetail, // added by devang parekh for create object for margin trading leverage detail (6-3-2019),
  LeverageReportReducer, // added by parth andhariya,

  //added by Tejas 7/3/32019
  apiKey: ApiKeyReducer,

  //added By Tejas 14/3/2019
  customLimits: APICustomLimits,
  ProfitLossReducer: ProfitLossReducer, //added by vishva
  OpenPositionReportRdcr: OpenPositionReportReducer, // added by parth andhariya 22-04-2019
  ArbitrageLedgerReducer: ArbitrageLedgerReducer, //added by vishva
  ArbitrageWalletReducer: ArbitrageWalletReducer, //added by vishva

  // added by Tejas  3/6/2019
  arbitrageOrderBook: ArbitrageOrderBookReducer,
  arbitrageReports: arbitrageReports,
  arbitragePlaceOrder: arbitragePlaceOrder,
  arbitradeProfitIndicator: arbitradeProfitIndicator, // added by devang parekh

  //added by Tejas 11/6/2019
  ArbitrageTrading: ArbitrageTrading,

  //a dded by Tejas 12/6/2019
  ArbitrageExchange: ArbitrageExchange,
  AnalyticReducer: AnalyticReducer, //added by vishva

});

export default reducers;
