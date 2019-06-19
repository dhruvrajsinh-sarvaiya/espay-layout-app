/**
 * Root Sagas
 */
import { all } from "redux-saga/effects";

/*==================== Start My Account Section =====================*/
/* Added by kevin */
import resetPasswordSagas from "./MyAccount/ResetPassword";
import forgotPasswordSagas from "./MyAccount/ForgotPasswordSaga";
import profilesSagas from "./MyAccount/Profiles";
import patternsAssignmentsSagas from "./MyAccount/PatternsAssignments";
import displayUsersSagas from "./MyAccount/Users";
import customersSagas from "./MyAccount/Customers";
import usersSignupReportSagas from "./MyAccount/UsersSignupReport";
import membershipLevelUpgradeRequestSagas from "./MyAccount/MembershipLevelUpgradeRequest";
import iphistoryDashboard from "./MyAccount/IPHistoryDashboard";
import devicewhitelistDashboard from "./MyAccount/DevicewhitelistDashboard";
import ipwhitelistDashboard from "./MyAccount/IPWhitelistDashboard";
import changePasswordDashboard from "./MyAccount/ChangePasswordDashboard";
import personalDashboard from "./MyAccount/PersonalDashboard";
import securityDashboard from "./MyAccount/SecurityQuestionDashboard";
import loginHistoryDashboard from "./MyAccount/LoginHistoryDashboard";
import phoneNumberDashboardSagas from "./MyAccount/PhoneNumberDashboard";
import activityDashboardSagas from "./MyAccount/ActivityDashboard";
import groupInfoDashboardSagas from "./MyAccount/GroupInfoDashboard";
import domainDashboardSagas from "./MyAccount/DomainDashboard";
import ipProfilingSagas from "./MyAccount/IPProfiling";
import passwordPolicySagas from "./MyAccount/PasswordPolicy";
import profileConfigurationSagas from "./MyAccount/ProfileConfiguration";

/* Added by Salim */
import rolesSagas from "./MyAccount/Roles";
import userRolesSagas from "./MyAccount/UsersRole";
import kycVerifySagas from "./MyAccount/KYCVerify";
import complainSagas from "./MyAccount/Complain";
import slaSagas from "./MyAccount/SLAConfiguration";
import organizationDashboardSagas from "./MyAccount/OrganizationDashboard";
import applicationDashboardSagas from "./MyAccount/ApplicationDashboard";
import userDashboardSagas from "./MyAccount/UserDashboard";
import adminDashboardSagas from "./MyAccount/AdminDashboard";
import customerDashboardSagas from "./MyAccount/CustomerDashboard";
import groupDashboardSagas from "./MyAccount/GroupDashboard";
import roleDashboardSagas from "./MyAccount/RoleDashboard";
import languageDashboardSagas from "./MyAccount/LanguageDashboard";
import membershipLevelDashboardSagas from "./MyAccount/MembershipLevelDashboard";
import emailProvideDashboardSagas from "./MyAccount/EmailProvideDashboard";
import socialLoginDashboardSagas from "./MyAccount/SocialLoginDashboard";
import twoFAAuthDashboardSagas from "./MyAccount/TwoFAAuthDashboard";
import reportDashboardSagas from "./MyAccount/ReportDashboard";
import settingDashboardSagas from "./MyAccount/SettingDashboard";
import organizationInformationSagas from "./MyAccount/OrganizationInformation";
import normalLoginSagas from "./MyAccount/NormalLogin";
import authorizationTokenSagas from "./MyAccount/AuthorizationToken";
import editProfileSagas from "./MyAccount/EditProfile";
import kycConfigurationSagas from "./MyAccount/KYCConfiguration";
import activityHistorySagas from "./MyAccount/ActivityHistory";
import ruleModuleSagas from "./MyAccount/RuleModule";
import ruleSubModuleSagas from "./MyAccount/RuleSubModule";
import ruleToolSagas from "./MyAccount/RuleTool";
import ruleFieldSagas from "./MyAccount/RuleField";
import roleManagementSagas from "./MyAccount/RoleManagement";
import rolePermissionGroupSagas from "./MyAccount/RolePermissionGroup";
import affiliateConfigureSagas from "./MyAccount/AffiliateConfigure";
import affiliateSchemeSagas from "./MyAccount/AffiliateScheme";
import affiliateSchemeTypeSagas from "./MyAccount/AffiliateSchemeType";
import affiliatePromotionSagas from "./MyAccount/AffiliatePromotion";
import enablegoogleauthSagas from "./MyAccount/EnableGoogleAuth";
import disablegoogleauthSagas from "./MyAccount/DisableGoogleAuth";
import providerBalanceCheckSagas from "./MyAccount/ProviderBalanceCheck";
/*==================== End My Account Section =====================*/

/*==================== Start Social Profile Section =====================*/
/* Social Profile Trading - Added by kevin 12/20/2018 */
import SocialTradingPolicySagas from "./SocialProfile/SocialTradingPolicy";
/*==================== End Social Profile Section =====================*/

/* CMS - Kushal */
import faqcategoriesSagas from "./Faq/FaqCategories";
import faqquestionsSagas from "./Faq/FaqQuestions";
import exchangeSagas from "./Exchange";
import pagesSagas from "./Pages/Pages";
import newsSagas from "./News/News";
import languageSagas from './Language/Language';
import sitesettingSagas from './SiteSetting/SiteSetting';

/*Sanjay ..... */
import assetReport from "./AssetReport/AdminAssetReport";
import withdrawalReportSaga from "./WithdrawalReport/WithdrawalReport";
import transferInOut from "./TransferInAndOut/TransferInOut";
import paymentMethosSaga from "./PaymentMethod/PaymentMethod";
import depositReportSaga from "./DepositReport/DepositReport";
import transferInSaga from "./TransferInOut/TransferInSaga";
import transferOutSaga from "./TransferInOut/TransferOutSaga";
import DeamonBalanceSagas from "./DemonBalance/DemonBalanceReport";
import TransactionRetrySaga from "./TransactionRetry/TransactionRetry";
import StackingHistorySaga from "./StackingFees/StackingFeesSaga";
import EarningLedgerSaga from "./EarningLedger/EarningLedger";
import ChargeCollectedSagas from "./ChargesCollected/ChargesCollected";

import TransactionPolicy from "./TransactionPolicy/TransactionPolicySaga";
import CommisssionType from "./CommisssionType/CommisssionTypeSaga";
import WalletUsagePolicy from "./WalletUsagePolicy/WalletUsagePolicySaga";
import ChargeType from "./ChargeTypeDetail/ChargeTypeDetailSaga";
import WalletTypeMaster from './WalletTypes/WalletTypesSaga';
import TransferIn from "./TransferIn/TransferInSaga";
import TransferOut from "./TransferOut/TransferOutSaga";
import WithdrawalReportSaga from "./Withdrawal/withdrawalReportSaga";
import DepositReportSaga from "./Deposit/DepositReportSaga";
import TrnTypeRoleWise from './TrnTypeRoleWise/TrnTypeRoleWiseSaga';

/* Wallet Sagas - Added By Nishant */
import walletSaga from "./Wallet/WalletSaga";
import daemonAddressesSaga from "./DaemonAddresses/DaemonAddressSaga";
import feeAndLimitPatternSaga from "./FeeAndLimitPatterns/FeeAndLimitPatterns";
import tradeRouteSaga from "./TradeRoute/TradeRoute";
import withdrawRouteSaga from "./WithdrawRoute/WithdrawRoute";
import DepositRouteSaga from "./DepositRoute/DepositRouteSaga";
import OrgWalletLedgerSaga from './OrganizationLedger/OrganizationLedgerSaga';

//added by Nirmit
import tradingledgerSaga from "./TradingReport/TradingLedgerSaga";
import openOrders from "./TradingReport/OpenOrders";
import settledOrders from "./TradingReport/SettledOrders";
import coinConfigSaga from "./CoinConfig/CoinConfigSaga";

//import By Tejas
import chartData from "./Trade/TradeChartDataSaga";
import headerData from "./Trade/HeaderDataSaga";
import marketDataSaga from "./Trade/MarketDetailsSaga";
import topGainersSaga from "./Trade/TopGainersDataSaga";
import topLosersSaga from "./Trade/TopLosersDataSaga";
import orderSummarySaga from "./Trade/OrderSummaryDataSaga";
import referralSummarySaga from "./Trade/ReferralSummarySaga";
import activeUserSaga from "./Trade/ActiveUserSaga";
import newSignupSaga from "./Trade/NewSignupSaga";

import daemonConfigureSaga from "./DaemonConfiguration/DaemonConfigurationSaga";
import currencyListSaga from "./DaemonConfiguration/CurrencyListSaga";

import tradeReconSaga from "./TradeRecon/TradeReconSaga";
import bugReportSaga from "./BugReport/BugReportSaga";

import apiConfigurationSaga from "./ApiConfiguration/ApiConfigurationSaga";

import apiMatchEngineSaga from "./ApiMatchEngine/ApiConfigurationMatchEngineSaga";

import manageMarketsSaga from "./ManageMarkets/ManageMarketSaga";

import tradeSummarySaga from "./TradeSummary/TradeSummarySaga";

import liquidityManagerSaga from "./LiquidityManager/LiquidityManagerSaga";

import exchangeFeedSaga from "./ExchangeFeedConfig/ExchangeFeedConfigSaga";

/* Pair Configuration Sagas - Added By Devang Parekh */
import pairConfigurationSaga from "./PairConfiguration/PairConfigurationSaga";
import apiConfAddGen from "./ApiConfAddGen/ApiConfAddGenSaga";

/* Localization - Jayesh ..... */
import countrySagas from "./Localization/Country";
import stateSagas from "./Localization/State";
import citySagas from "./Localization/City";
import contactusSagas from "./ContactUs/ContactUs";

/* Wallet Dashboard - added by Nishant */
import superAdminSaga from "./Wallet/SuperAdminSaga";
import transactionTypesSaga from "./Wallet/TransactionTypesSaga";
import UsersSaga from "./Wallet/UsersSaga";
import WalletBlockTrnTypeSaga from "./WalletBlockTrnType/WalletBlockTrnTypeSaga";
import StakingConfigurationSaga from "./Wallet/StakingConfigurationSaga";

/* CMS Dashboard Dashboard - added by Kushal */
import CmsDashboardSaga from "./CmsDashboard/CmsDashboard";

// Trading Dashboard
import revenueSaga from "./Trading/TradeRevenueSaga";
import tradeChartSaga from "./Trading/TradeChartSaga";
import expensesSaga from "./Trading/TradeExpenseSaga";
import marketsSaga from "./Trading/TradeMarketsSaga";
import userTradeSaga from "./Trading/UserTradeSaga";
import profitSaga from "./Trading/TradeProfitSaga";
import totalCountSaga from './Trading/DashboardTotalCountSaga';
import tradeSummaryTotalSaga from './Trading/TradingSummaryTotalSaga';
import orderSummaryTotalSaga from './Trading/TradeOrderSummarySaga';
import tradeLedgerSaga from './Trading/TradeLedgerSaga';
//import apiConfig from './Trading/TradeApiConfigSaga';
//import pairConfig from './Trading/TradePairConfigSaga';

import thirdPartyApiRequest from "./ApiRequestConfig/ApiRequestConfigSaga";
import thirdPartyApiResponse from "./ApiResponseConfig/ApiResponseConfigSaga";
import ProviderConfig from "./ProviderConfiguration/ProviderConfigurationSaga";

//Added by Jayesh for Surveys
import surveysSagas from "./Surveys/Surveys";

// add by devang parekh for trading market cap
import marketCap from './Trading/MarketCapSaga';
//Added by jayeshbhai
import zohocrmformSagas from './ZohoCrmForm/ZohoCrmForm';
import emailtemplatesSagas from './EmailTemplates/EmailTemplates';
//Added by Kushal
import regionsSagas from "./Regions/Regions";
import ChatDashboardSaga from "./ChatDashboard/ChatDashboard";
import ChatUserListSaga from "./ChatDashboard/ChatUserList";

//added by Tejas Date : 7/1/2019
import coinConfigurationSaga from './CoinConfiguration/CoinConfigurationSaga';

//Added By Jinesh
import OrganizationLedgerSaga from "./LedgerReport/OrganizationLedgerSaga";
import EmailQueueReportSaga from "./Reports/EmailQueueReportSaga";


//Added by Kushal 10-01-2019
import helpmanualmodulesSagas from "./HelpManual/HelpManualModules";
import helmanualsSagas from "./HelpManual/HelpManuals";

import PushNotificationQueueSaga from "./PushNotificationQueue/PushNotificationQueue";// Added by Khushbu Badheka D:08/01/2019
import CoinListRequest from "./CoinListRequest/CoinListRequest"; // Added by Dhara Gajera

//Create By Sanjay 
import ApplicationConfigSaga from "./MyAccount/ApplicationConfig";
import signinEmailOTPSagas from "./MyAccount/SigninEmailWithOTP";
import signinMobileOTPSagas from "./MyAccount/SigninMobileWithOTP";
import forgotPasswordSaga from "./MyAccount/ForgotPassword";
import forgotConfirmationSagas from "./MyAccount/ForgotConfirmation";
import ReferralRewardConfig from './MyAccount/ReferralRewardConfig';
import ReferralDashboardSaga from './MyAccount/ReferralDashboardSaga';
import ReferralPayTypeSaga from './MyAccount/ReferralPayTypeSaga';
import ReferralChannelTypeSaga from './MyAccount/ReferralChannelTypeSaga';
import ReferralServiceTypeSaga from './MyAccount/ReferralServiceTypeSaga';
import ReferralInvitationsSaga from './MyAccount/ReferralInvitationsSaga';

// Added By Megha Kariya
import pushMessageSaga from './PushMessage/PushMessage';
import messageQueueSaga from './Reports/MessageQueueSaga';

//Added By Jinesh
import PushEmail from "./PushEmail/PushEmail";
import EmailApiManagerSaga from "./EmailApiManager/EmailApiManagerSaga";

// added by Bramarshi
import getallrequestformetdataSaga from './RequestFormatApiManager/RequestFormatApiManagerSaga'; // uncomment & chnage spelling by Megha Kariya (20/02/2019)

// added by tejas 8/2/2019
import siteTokenSaga from "./SiteToken/SiteTokenSaga";
import siteTokenConversionSaga from "./SiteToken/SiteTokenConversionSaga";

/* Margin Trading - Added by Nishant */
import LeverageRequestsSaga from './MarginTrading/LeverageRequestsSaga';
import LeverageReportSaga from './MarginTrading/LeverageReportSaga';
import LeverageConfigSaga from './MarginTrading/LeverageConfigSaga';
import WalletLedgerReportSaga from './MarginTrading/WalletLedgerReportSaga';
import WalletManagementSaga from './MarginTrading/WalletManagementSaga';
// Added By Bharat Jograna
import ReferralReport from "./MyAccount/ReferralReport";
import UsersAndControl from "./MyAccount/UsersAndControl";
import AffiliateSchemeTypeMapping from './MyAccount/AffiliateSchemeTypeMapping';
import ReferralServiceDetail from './MyAccount/ReferralServiceDetail'

// Added By Saloni
import AffiliateReport from './MyAccount/AffiliateReport';
import UserSagas from './MyAccount/User';
import SocialTradingSaga from './SocialProfile/SocialTradingHistory';
import AffiliateSchemeDetailSaga from './MyAccount/AffiliateSchemeDetail';
import ReferralSchemeTypeMappingSaga from './MyAccount/ReferralSchemeTypeMapping';

import socialMediasSagas from "./SocialMedias/SocialMedias"; // Added By Megha Kariya (12/02/2019)

//added by Tejas for feed limit 18/2/2019
import limitFeedSaga from './ExchangeFeedConfig/FeedLimitConfigurationSaga';

//added by Karan Joshi
import TradingSummaryLPTotalSaga from "./TradingSummeryLpWise/TradingSummeryLpWiseSaga";
//Added by dhara gajera 8/2/2019 zipcodes
import ZipcodesSagas from "./Localization/ZipCodes";

// added by Tejas 21/2/2019
import ApiPlanConfiguration from "./ApiKeyConfiguration/ApiPlanConfigurationSaga";
import ApiPlanSubscription from "./ApiKeyConfiguration/ApiPlanSubscriptionSaga";

/* Breadcrumb   */
import DrawerCloseSaga from "./DrawerClose/DrawerCloseSaga";

// added by devang parekh 11/3/2019
import ApiPlanConfigurationHistory from "./ApiKeyConfiguration/ApiPlanConfigurationHistorySaga";
import ApiKeyConfigurationHistory from "./ApiKeyConfiguration/ApiKeyConfigurationHistorySaga";

// added by Tejas 14/3/2019
import ApiKeyPolicySetting from "./ApiKeyConfiguration/ApiKeyPolicySettingSaga";

//Added By Sanjay 
import APIPlanConfigurationSaga from "./APIPlanConfiguration/APIPlanConfigurationSaga";
import RestAPIMethodSaga from "./RestAPIMethod/RestAPIMethodSaga";
import ServiceProviderSaga from "./ServiceProvider/ServiceProviderSaga";

/* charge config - added by parth */
import chaChargeConfigurationSaga from './ChargeConfigurationSaga/ChargeConfigurationSaga';
import DepositionIntervalSaga from './DepositionIntervalSaga/DepositionIntervalSaga';
import LimitConfigurationSaga from './LimitConfigurationSaga/LimitConfigurationSaga';

/* unstaking pending request - added by vishva shaha */
import UnstakingPendingRequestSaga from './Wallet/UnstakingPendingRequestSaga';

/* api key config dashbaord - added by devang parekh (9-4-2019) */
import ApiKeyDashbaordCount from './ApiKeyConfiguration/ApiKeyDashboardCountSaga';
/* Ip Wise Request report - added by parth andhariya (15-04-2019) */
import IPWiseRequestReportSaga from './IPWiseRequestReportSaga/IPWiseRequestReportSaga'
// added by vishva shah 
import ServiceProviderBalance from './ServiceProviderBalance/ServiceProviderBalanceSaga';
//added by parth andhariya 23-04-2019
import OpenPositionReportSaga from './MarginTrading/OpenPositionReportSaga';
import ProfitLossReportSaga from './MarginTrading/ProfitLossReportSaga';
// added by tejas for get menu access details 29/4/2019
import GetMenuAccessSaga from './GetMenuAccessDetailsSaga';
import StakingHistoryReport from './StakingHistoryReport/StakingHistoryReportSaga'; //added by vishva
// import ERC223 from './ERC223/ERC223Saga'; //added by vishva

//Added By Sanjay 
import HTMLBlocksSaga from "./HTMLBlocks/HTMLBlocksSaga";
import ImageSlidersSaga from "./ImageSliders/ImageSlidersSaga";
import AdvanceHTMLBlocksSaga from "./AdvanceHTMLBlocks/AdvanceHTMLBlocksSaga";
//added by parth andhariya 
import BlockUnblockUserAddressSaga from './BlockUnblockUserAddressSaga/BlockUnblockUserAddressSaga';
import IncreaseSaga from './ERC223/IncreaseSaga'; //added by vishva
import DecreaseSaga from './ERC223/DecreaseSaga'; //added by vishva
import SetTransferFeeSaga from './ERC223/SetTransferFeeSaga'; //added by vishva
import TokenTransferSaga from './ERC223/TokenTransferSaga'; //added by vishva
import DestroyBlackFundSaga from './ERC223/DestroyBlackFundSaga'; //added by vishva

import WithdrawalApprovalSaga from './WithdrawalApprovalSaga/WithdrawalApprovalSaga';
//added by parth andhariya (06-06-2019)
import ArbitrageCurrencyConfigurationSaga from './Arbitrage/ArbitrageCurrencyConfiguration/ArbitrageCurrencyConfigurationSaga';
//Added by Palak 04.6.2019
import marketMakingSaga from './Trading/MarketMaking';

import ExchangeBalanceSaga from './Arbitrage/ArbitrageExchangeBalance/ExchangeBalanceSaga'; //added by vishva
//added by parth andhariya (10-06-2019)
import TopupHistorySaga from './Arbitrage/ProviderTopupHistory/TopupHistorySaga';

//added by devang parekh 
import ArbitrageExchangeConfiguration from './Arbitrage/ExchangeConfiguration/ExchangeConfigurationSaga';

import ArbitrageFeeConfigurationSaga from './Arbitrage/ArbitrageFeeConfiguration/ArbitrageFeeConfigurationSaga'; //added by vishva
import ArbitrageAddressSaga from './Arbitrage/ArbitrageProviderAddress/ArbitrageAddressSaga'; //added by vishva
//added by parth andhariya (11-06-2019)
import ConflictHistorySaga from './Arbitrage/ConflictHistory/ConflictHistorySaga';
//added by parth andhariya (17-06-2019)
import ProviderLedgersaga from './Arbitrage/ProviderLedger/ProviderLedgersaga';
import ProviderWalletSaga from './Arbitrage/ArbitrageProviderWallet/ProviderWalletSaga'; //added by vishva shah
export default function* rootSaga(getState) {
    yield all([
        /*======================= Start My Account Section ============*/
        /* Added by Kevin */
        resetPasswordSagas(),
        forgotPasswordSagas(),
        profilesSagas(),
        patternsAssignmentsSagas(),
        displayUsersSagas(),
        customersSagas(),
        usersSignupReportSagas(),
        membershipLevelUpgradeRequestSagas(),
        iphistoryDashboard(),
        devicewhitelistDashboard(),
        ipwhitelistDashboard(),
        changePasswordDashboard(),
        personalDashboard(),
        securityDashboard(),
        loginHistoryDashboard(),
        phoneNumberDashboardSagas(),
        activityDashboardSagas(),
        groupInfoDashboardSagas(),
        domainDashboardSagas(),
        ipProfilingSagas(),
        passwordPolicySagas(),
        profileConfigurationSagas(),

        /* Added by Salim */
        rolesSagas(),
        userRolesSagas(),
        kycVerifySagas(),
        complainSagas(),
        slaSagas(),
        organizationDashboardSagas(),
        applicationDashboardSagas(),
        userDashboardSagas(),
        adminDashboardSagas(),
        customerDashboardSagas(),
        groupDashboardSagas(),
        roleDashboardSagas(),
        languageDashboardSagas(),
        membershipLevelDashboardSagas(),
        emailProvideDashboardSagas(),
        socialLoginDashboardSagas(),
        twoFAAuthDashboardSagas(),
        reportDashboardSagas(),
        settingDashboardSagas(),
        organizationInformationSagas(),
        normalLoginSagas(),
        authorizationTokenSagas(),
        editProfileSagas(),
        kycConfigurationSagas(),
        activityHistorySagas(),
        ruleModuleSagas(),
        ruleSubModuleSagas(),
        ruleToolSagas(),
        ruleFieldSagas(),
        roleManagementSagas(),
        rolePermissionGroupSagas(),
        affiliateConfigureSagas(),
        affiliateSchemeSagas(),
        affiliateSchemeTypeSagas(),
        affiliatePromotionSagas(),
        enablegoogleauthSagas(),
        disablegoogleauthSagas(),
        providerBalanceCheckSagas(),

        /*======================= End My Account Section ============*/

        /*==================== Start Social Profile Section =====================*/
        /* Added by kevin 12/20/2018 */
        SocialTradingPolicySagas(),
        /*==================== End Social Profile Section =====================*/

        /* Kushal - cms */
        faqcategoriesSagas(),
        faqquestionsSagas(),
        exchangeSagas(),
        pagesSagas(),
        newsSagas(),
        languageSagas(),
        sitesettingSagas(),

        /* Wallet sagas - Added By Nishant */
        walletSaga(),
        daemonAddressesSaga(),
        feeAndLimitPatternSaga(),
        tradeRouteSaga(),
        withdrawRouteSaga(),
        DepositRouteSaga(),
        coinConfigSaga(),
        /*Sanjay */
        assetReport(),
        withdrawalReportSaga(),
        transferInOut(),
        paymentMethosSaga(),
        depositReportSaga(),
        transferInSaga(),
        transferOutSaga(),
        DeamonBalanceSagas(),
        TransactionRetrySaga(),
        StackingHistorySaga(),
        EarningLedgerSaga(),

        TransactionPolicy(),
        CommisssionType(),
        WalletUsagePolicy(),
        ChargeType(),
        WalletTypeMaster(),
        TransferIn(),
        TransferOut(),
        WithdrawalReportSaga(),
        DepositReportSaga(),
        TrnTypeRoleWise(),

        //added by Nirmit
        tradingledgerSaga(),
        openOrders(),
        settledOrders(),
        ChargeCollectedSagas(),

        //Tejas
        chartData(),
        headerData(),
        marketDataSaga(),
        topGainersSaga(),
        topLosersSaga(),
        orderSummarySaga(),
        referralSummarySaga(),
        activeUserSaga(),
        newSignupSaga(),
        daemonConfigureSaga(),
        currencyListSaga(),
        tradeReconSaga(),
        bugReportSaga(),
        apiConfigurationSaga(),
        manageMarketsSaga(),
        tradeSummarySaga(),
        liquidityManagerSaga(),
        exchangeFeedSaga(),
        apiMatchEngineSaga(),

        // added by devang parekh
        pairConfigurationSaga(),
        apiConfAddGen(),

        /* Jayesh */
        countrySagas(),
        stateSagas(),
        citySagas(),
        contactusSagas(),

        /* Wallet Dashboard - Nishant */
        superAdminSaga(),
        transactionTypesSaga(),
        UsersSaga(),
        WalletBlockTrnTypeSaga(),
        StakingConfigurationSaga(),
        OrgWalletLedgerSaga(),
        /* CMS Dashboard - Kushal */
        CmsDashboardSaga(),

        // Added By Tejas
        revenueSaga(),
        tradeChartSaga(),
        expensesSaga(),
        marketsSaga(),
        userTradeSaga(),
        profitSaga(),
        totalCountSaga(),
        tradeSummaryTotalSaga(),
        orderSummaryTotalSaga(),
        tradeLedgerSaga(),
        //apiConfig(),
        //pairConfig(),
        thirdPartyApiResponse(),
        thirdPartyApiRequest(),
        //Aded by Jayesh
        surveysSagas(),
        ProviderConfig(),
        marketCap(),
        //Added by Jayesh
        zohocrmformSagas(),
        emailtemplatesSagas(),
        //Added by Kushal
        regionsSagas(),
        ChatDashboardSaga(),
        ChatUserListSaga(),
        //added by tejas
        coinConfigurationSaga(),

        //Added By Jinesh
        OrganizationLedgerSaga(),
        EmailQueueReportSaga(),

        //Added by kushal
        helpmanualmodulesSagas(),
        helmanualsSagas(),

        PushNotificationQueueSaga(),//Added by Khushbu Badheka D:08/01/2019
        CoinListRequest(),//Added by dhara gajera 9/1/2019

        //Added By Sanjay
        ApplicationConfigSaga(),
        signinEmailOTPSagas(),
        signinMobileOTPSagas(),
        forgotPasswordSaga(),
        forgotConfirmationSagas(),
        ReferralRewardConfig(),
        ReferralDashboardSaga(),
        ReferralPayTypeSaga(),
        ReferralChannelTypeSaga(),
        ReferralServiceTypeSaga(),
        ReferralInvitationsSaga(),

        //Added By Megha Kariya
        pushMessageSaga(),
        messageQueueSaga(),

        //Added By Jinesh
        PushEmail(),
        EmailApiManagerSaga(),

        //added by bramarshi
        getallrequestformetdataSaga(), // uncomment by Megha Kariya (20/02/2019)

        //added by Tejas 
        siteTokenSaga(),
        siteTokenConversionSaga(),

        /* Margin Trading Sagas */
        LeverageRequestsSaga(),
        LeverageReportSaga(),
        LeverageConfigSaga(),
        WalletLedgerReportSaga(),

        // Added By Bharat Jograna
        ReferralReport(),
        UsersAndControl(),
        AffiliateSchemeTypeMapping(),
        ReferralServiceDetail(),

        //Added by Saloni
        AffiliateReport(),
        UserSagas(),
        SocialTradingSaga(),
        AffiliateSchemeDetailSaga(),
        ReferralSchemeTypeMappingSaga(),

        socialMediasSagas(), // Added By Megha Kariya (12/02/2019)

        //added by Tejas 18/2/2019
        limitFeedSaga(),

        //added by Karan Joshi
        TradingSummaryLPTotalSaga(),
        //Added by dhara gajera 8/2/2019 zipcodes
        ZipcodesSagas(),
        //added by Tejas 21/2/2019
        ApiPlanConfiguration(),

        /* breadcrumb */
        DrawerCloseSaga(),
        WalletManagementSaga(),

        //added by Tejas 
        ApiPlanSubscription(),
        // added by devang parekh
        ApiPlanConfigurationHistory(),
        ApiKeyConfigurationHistory(),

        // added by Tejas 14/3/2019
        ApiKeyPolicySetting(),

        //Added By Sanjay 
        APIPlanConfigurationSaga(),
        RestAPIMethodSaga(),
        ServiceProviderSaga(),

        /* charge config by parth */
        chaChargeConfigurationSaga(),
        DepositionIntervalSaga(),
        LimitConfigurationSaga(),

        /* unstaking requests - by vishva */
        UnstakingPendingRequestSaga(),

        ApiKeyDashbaordCount(), // added by devang parekh  (9-4-2019)
        ServiceProviderBalance(), //added by vishva shah

        IPWiseRequestReportSaga(), // added by parth andhariya (15-04-2019)
        OpenPositionReportSaga(),//added by parth andhariya 23-04-2019
        ProfitLossReportSaga(), //added by vishva
        GetMenuAccessSaga(), // added bt Tejas for get menuDetails
        StakingHistoryReport(), // added by vishva
        //Added By Sanjay 
        HTMLBlocksSaga(),
        ImageSlidersSaga(),
        AdvanceHTMLBlocksSaga(),
        // ERC223(), //added by vishva      
        BlockUnblockUserAddressSaga(), //added by parth andhariya
        IncreaseSaga(), //added by vishva
        DecreaseSaga(),
        SetTransferFeeSaga(),
        TokenTransferSaga(),
        DestroyBlackFundSaga(),
        WithdrawalApprovalSaga(), //added by parth andhariya (04-06-2019)
        ArbitrageCurrencyConfigurationSaga(),//added by parth andhariya (06-06-2019)
        marketMakingSaga(),//added by palak Gajjar 04.06.2019
        ExchangeBalanceSaga(), //added by vishva
        TopupHistorySaga(), //added by parth andhariya (10-06-2019)
        ArbitrageExchangeConfiguration(), // added by devang parekh 11-6-2019
        ArbitrageFeeConfigurationSaga(), //added by vishva
        ArbitrageAddressSaga(), //added by vishva
        ConflictHistorySaga(),//added by parth andhariya (11-06-2019)
        ProviderLedgersaga(),//added by parth andhariya (17-06-2019)
        ProviderWalletSaga(), //added by vishva shah
    ]);
}