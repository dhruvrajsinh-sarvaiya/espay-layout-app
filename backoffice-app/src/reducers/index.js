import navigationReducer from './navigationReducer'
import preference from './preference';
import pairListReducer from './PairListReducer';
import cacheReducer from './CacheReducer';
import SplashScreenReducer from './SplashScreenReducer';

// Trading
import tradingLedgerBOReducer from './trading/tradingLedgerBOReducer';
import TradingDashboardReducer from './trading/TradingDashboardReducer';
import thirdPartyAPIResponseBOReducer from './trading/thirdPartyAPIResponseBOReducer';
import marketTickerReducer from './trading/marketTickerReducer';
import tradeRoutesBOReducer from './trading/tradeRoutesBOReducer';
import pairConfigurationReducer from './trading/PairConfigurationReducer';
import tradingSummaryReducer from './trading/TradingSummaryReducer'
import exchangeFeedConfigReducer from './trading/ExchangeFeedConfigReducer';
import feedLimitConfigReducer from './trading/FeedLimitConfigReducer';
import liquidityAPIManagerReducer from './trading/LiquidityAPIManagerReducer';
import apiRequestConfigReducer from './trading/ApiRequestConfigReducer';
import manageMarketReducer from './trading/ManageMarketReducer';
import daemonConfigureReducer from './trading/DaemonConfigureReducer';
import providerConfigureReducer from './trading/ProviderConfigurationReducer';
import tradeGraphBOReducer from './trading/tradeGraphBOReducer';
import TradeRoutingReducer from './trading/TradeRoutingReducer';
import coinConfigurationReducer from './trading/CoinConfigurationReducer';
import SiteTokenConversionReportReducer from './trading/SiteTokenConversionReportReducer';
import SiteTokenReducer from './trading/SiteTokenReducer';
import ServiceProviderConfigReducer from './trading/ServiceProviderReducer';
import MarketMakingReducer from './trading/MarketMakingReducer';

//Margin
import MarginTradingDashboardReducer from './margin/MarginTradingDashboardReducer';
import MarginTradingChartReducer from './margin/MarginTradingChartReducer';
import MarginTopGainerReducer from './margin/MarginTopGainerReducer';
import MarginTopLoserReducer from './margin/MarginTopLoserReducer';
import MarginTopGainerLoserReducer from './margin/MarginTopGainerLoserReducer';
import MarginTradingMarketCapTickersReducer from './margin/MarginTradingMarketCapTickersReducer';
import MarginManageMarketReducer from './margin/MarginManageMarketReducer';
import LeverageRequestReducer from './margin/LeverageRequestReducer';
import LeverageReportReducer from './margin/LeverageReportReducer';
import LeverageConfigReducer from './margin/LeverageConfigReducer';
import ProfitLossReportReducer from './margin/ProfitLossReportReducer';
import OpenPositionReportReducer from './margin/OpenPositionReportReducer';
import WalletLedgerReducer from './margin/WalletLedgerReducer';

// MyAccount
import ReferralSystemReducer from './myaccount/ReferralSystemReducer';
import RuleFieldsBoReducer from './myaccount/RuleFieldsReducer';
import ProfileConfigReducer from './myaccount/ProfileConfigReducer';
import PasswordPolicyReducer from './myaccount/PasswordPolicyReducer';
import SocialTradingPolicyReducer from './myaccount/SocialTradingPolicyReducer';
import HelpAndSupportReducer from './myaccount/HelpAndSupportReducer';
import SlaConfigPriorityReducer from './myaccount/SlaConfigPriorityReducer';
import IpRangeReducer from './myaccount/IpRangeReducer';
import IpHistoryReducer from './myaccount/IpHistoryReducer';
import LoginHistoryBoReducer from './myaccount/LoginHistoryBoReducer';
import ReferralReducer from './myaccount/ReferralReducer';
import ActivityLogHistoryReducer from './myaccount/ActivityLogHistoryReducer';
import UsersSignupReportReducer from './myaccount/UsersSignupReportReducer';
import ReferralInvitesReducer from './myaccount/ReferralInvitesReducer';
import PersonalInfoReducer from './myaccount/PersonalInfoReducer';
import ReferralChannelTypeReducer from './myaccount/ReferralChannelTypeReducer';
import ReferralServiceTypeReducer from './myaccount/ReferralServiceTypeReducer';
import ReferralPayTypeReducer from './myaccount/ReferralPayTypeReducer';
import ReferralParticipantReducer from './myaccount/ReferralParticipantReducer';
import DeviceWhitelistReducer from './myaccount/DeviceWhitelistReducer';
import KYCVerifyReducer from './myaccount/KYCVerifyReducer';
import UserManagementReducer from './myaccount/UserManagementReducer';
import AffliateSignUpReportReducer from './myaccount/AffliateSignUpReportReducer';
import ConvertsReducer from './myaccount/ConvertsReducer';
import ReferralClickOnLinkReportReducer from './myaccount/ReferralClickOnLinkReportReducer';
import AffiliateFacebookShareReportReducer from './myaccount/AffiliateFacebookShareReportReducer';
import AffiliateTwitterShareReportReducer from './myaccount/AffiliateTwitterShareReportReducer';
import AffiliateCommissionReportReducer from './myaccount/AffiliateCommissionReportReducer';
import AffiliateSchemeReducer from './myaccount/AffiliateSchemeReducer';
import AffiliateClickOnLinkReportReducer from './myaccount/AffiliateClickOnLinkReportReducer';
import AffiliateEmailSentReportReducer from './myaccount/AffiliateEmailSentReportReducer';
import AffiliateSmsSentReportReducer from './myaccount/AffiliateSmsSentReportReducer';
import AffiliatePromotionReducer from './myaccount/AffiliatePromotionReducer';
import AffiliateSchemeTypeReducer from './myaccount/AffiliateSchemeTypeReducer';
import AffiliateSchemeDetailReducer from './myaccount/AffiliateSchemeDetailReducer';
import AffiliateSchemeTypeMappingReducer from './myaccount/AffiliateSchemeTypeMappingReducer';
import AffiliateReportDashboardReducer from './myaccount/AffiliateReportDashboardReducer';
import SocialTradingHistoryReducer from './myaccount/SocialTradingHistoryReducer';
import RoleAssignHistoryReducer from './myaccount/RoleAssignHistoryReducer';
import UnsignedUserRoleReducer from './myaccount/UnsignedUserRoleReducer';
import ProviderBalCheckReducer from './myaccount/ProviderBalCheckReducer';
import SignUpReducer from './myaccount/signUpReducer'
import loginReducer from './myaccount/loginReducer';
import ForgotPasswordReducer from './myaccount/ForgotPasswordReducer';
import ResetPasswordReducer from './myaccount/ResetPasswordReducer';
import EnableGoogleAuthReducer from './myaccount/EnableGoogleAuthReducer';
import DisableGoogleAuthReducer from './myaccount/DisableGoogleAuthReducer';
import tokenReducer from './myaccount/tokenReducer';
import AppSettingsReducer from './myaccount/AppSettingsReducer'
import EditProfileReducer from './myaccount/EditProfileReducer';
import LoginHistoryReducer from './myaccount/LoginHistoryReducer';
import notificationReducer from './myaccount/NotificationReducer';
import IPWhitelistHistoryReducer from './myaccount/IPWhitelistHistoryReducer';
import UserListReducer from './myaccount/UserListReducer';
import RuleModuleReducer from './myaccount/RuleModuleReducer';
import RuleSubModuleReducer from './myaccount/RuleSubModuleReducer';
import RoleModuleReducer from './myaccount/RoleModuleReducer';

//CMS
import CustomerListReducer from './cms/CustomerListReducer';
import ContactUsReducer from './cms/ContactUsReducer';
import StateMasterReducer from './cms/StateMasterReducer';
import CountriesReducer from './cms/CountriesReducer';
import TemplateReducer from './cms/TemplateReducer';
import CmsDashboardReducer from './cms/CmsDashboardReducer'
import ChatDashboardReducer from './cms/ChatDashboardReducer';
import ChatUserListReducer from './cms/ChatUserListReducer';
import UserCoinListRequestReducer from './cms/UserCoinListRequestReducer';
import SendEmailReducer from './cms/SendEmailReducer';
import CoinListFieldReducer from './cms/CoinListFieldReducer';
import MessageQueReducer from './cms/MessageQueReducer';
import EmailQueReducer from './cms/EmailQueReducer';
import ApiManagerReducer from './cms/ApiManagerReducer';
import RequestFormatApiReducer from './cms/RequestFormatApiReducer';
import SendSmsReducer from './cms/SendSmsReducer';
import TemplateConfigurationReducer from './cms/TemplateConfigurationReducer';
import LocalizationReducer from './cms/LocalizationReducer';
import CitiesReducer from './cms/CitiesReducer';
import ZipCodesReducer from './cms/ZipCodesReducer';

import AddCurrencyLogoReducer from './trading/AddCurrencyLogoReducer';

// Wallet
import LimitConfigReducer from './wallet/LimitConfigReducer';
import StakingConfigurationReducer from './wallet/StakingConfigurationReducer';
import ChargeConfigReducer from './wallet/ChargeConfigReducer';
import AddressGenrationRouteReducer from './wallet/AddressGenrationRouteReducer';
import ServiceProviderBalanceReducer from './wallet/ServiceProviderBalanceReducer';
import DepositionIntervalReducer from './wallet/DepositionIntervalReducer';
import ERC223DashboardReducer from './wallet/ERC223DashboardReducer';
import WalletMainDashboardReducer from './wallet/WalletMainDashboardReducer';
import TransactionPolicyReducer from './wallet/TransactionPolicyReducer';
import AdminAssetsReducer from './wallet/AdminAssetsReducer';
import DepositRouteReducer from './wallet/DepositRouteReducer';
import WalletUsagePolicyReducer from './wallet/WalletUsagePolicyReducer';
import OrginizationLedgerReducer from './wallet/OrginizationLedgerReducer';
import WithdrawReportReducer from './wallet/WithdrawReportReducer';
import DaemonAddressReducer from './wallet/DaemonAddressReducer';
import ChargesCollectedReducer from './wallet/ChargesCollectedReducer';
import TransferInOutReducer from './wallet/TransferInReducer';
import StackingHistroyReducer from './wallet/StackingHistroyReducer';
import WithdrawalApprovalReducer from './wallet/WithdrawalApprovalReducer';
import UserAddressReducer from './wallet/UserAddressReducer';
import WalletTrnTypesReducer from './wallet/WalletTrnTypesReducer';
import RoleWiseTransactionTypesReducer from './wallet/RoleWiseTransactionTypesReducer';
import DepositReportReducer from './wallet/DepositReportReducer';
import UnstakingRequestsReducer from './wallet/UnstakingRequestsReducer';
import UserWalletsReducer from './wallet/UserWalletsReducer';
import WalletTypesReducer from './wallet/WalletTypesReducer';
import TokenTransferReducer from './wallet/TokenTransferReducer';
import WalletMemberReducer from './wallet/WalletMemberReducer';

// Arbitrage
import ProviderWalletReducer from './arbitrage/ProviderWalletReducer';
import ArbitrageExchangeBalReducer from './arbitrage/ArbitrageExchangeBalReducer';
import ConflictHistoryReducer from './arbitrage/ConflictHistoryReducer';
import ProviderLedgerReducer from './arbitrage/ProviderLedgerReducer';
import ServiceProviderListReducer from './arbitrage/ServiceProviderListReducer';
import ProviderAddressReducer from './arbitrage/ProviderAddressReducer';
import CurrencyConfigReducer from './arbitrage/CurrencyConfigReducer';
import ArbiServiceProviderConfigReducer from './arbitrage/ArbiServiceProviderConfigReducer';
import ArbitrageChargeConfigReducer from './arbitrage/ArbitrageChargeConfigReducer';
import ArbitrageUserTradeReducer from './arbitrage/ArbitrageUserTradeReducer';
import TopUpHistoryReducer from './arbitrage/TopUpHistoryReducer';
import ArbitrageApiRequestReducer from './arbitrage/ArbitrageApiRequestReducer';
import ArbitrageLpChargeConfigReducer from './arbitrage/ArbitrageLpChargeConfigReducer';
import ArbitrageApiResponseReducer from './arbitrage/ArbitrageApiResponseReducer';
import InitialBalanceConfigurationReducer from './arbitrage/InitialBalanceConfigurationReducer';
import ArbitragePairConfigurationReducer from './arbitrage/ArbitragePairConfigurationReducer';
import AllowOrderTypeReducer from './arbitrage/AllowOrderTypeReducer';
import ArbitrageManageMarketReducer from './arbitrage/ArbitrageManageMarketReducer';
import ArbitrageTradeReconReducer from './arbitrage/ArbitrageTradeReconReducer';
import ArbitrageCoinConfigurationReducer from './arbitrage/ArbitrageCoinConfigurationReducer';
import ArbiTradingSummaryLpWiseReducer from './arbitrage/ArbiTradingSummaryLpWiseReducer';
import ArbitrageUserWalletsReducer from './arbitrage/ArbitrageUserWalletsReducer';
import ArbitrageUserWalletLedgerReducer from './arbitrage/ArbitrageUserWalletLedgerReducer';

// Public Private Api Key Configuration
import ApiKeyDashboardReducer from './apikeyconfiguration/ApiKeyDashboardReducer';
import ApiPlanConfigReducer from './apikeyconfiguration/ApiPlanConfigReducer';
import ApiPlanSubscriptionHistoryReducer from './apikeyconfiguration/ApiPlanSubscriptionHistoryReducer';
import ApiPlanConfigHistoryReducer from './apikeyconfiguration/ApiPlanConfigHistoryReducer';
import ApiKeyConfigHistoryReducer from './apikeyconfiguration/ApiKeyConfigHistoryReducer';
import IpWiseRequestReportReducer from './apikeyconfiguration/IpWiseRequestReportReducer';
import ApiKeyPolicySettingReducer from './apikeyconfiguration/ApiKeyPolicySettingReducer';
import GetIpAndApiAddressWiseReportReducer from './apikeyconfiguration/GetIpAndApiAddressWiseReportReducer';
import ApiMethodReducer from './apikeyconfiguration/ApiMethodReducer';
import HttpErrorCodeReducer from './apikeyconfiguration/HttpErrorCodeReducer';

const rootFrontReducer = {
    navigationReducer,
    preference,
    cacheReducer,
    pairListReducer,
    SplashScreenReducer,

    //Trading 
    tradingLedgerBOReducer,
    TradingDashboardReducer,
    thirdPartyAPIResponseBOReducer,
    marketTickerReducer,
    tradeRoutesBOReducer,
    pairConfigurationReducer,
    tradingSummaryReducer,
    exchangeFeedConfigReducer,
    feedLimitConfigReducer,
    liquidityAPIManagerReducer,
    apiRequestConfigReducer,
    manageMarketReducer,
    daemonConfigureReducer,
    providerConfigureReducer,
    tradeGraphBOReducer,
    TradeRoutingReducer,
    coinConfigurationReducer,
    SiteTokenConversionReportReducer,
    SiteTokenReducer,
    ServiceProviderConfigReducer,
    MarketMakingReducer,

    //Margin
    MarginTradingDashboardReducer,
    MarginTradingChartReducer,
    MarginTopGainerReducer,
    MarginTopLoserReducer,
    MarginTopGainerLoserReducer,
    MarginTradingMarketCapTickersReducer,
    MarginManageMarketReducer,
    LeverageRequestReducer,
    LeverageReportReducer,
    LeverageConfigReducer,
    ProfitLossReportReducer,
    OpenPositionReportReducer,
    WalletLedgerReducer,

    // MyAccount
    ReferralSystemReducer,
    RuleFieldsBoReducer,
    ProfileConfigReducer,
    PasswordPolicyReducer,
    SocialTradingPolicyReducer,
    HelpAndSupportReducer,
    SlaConfigPriorityReducer,
    IpRangeReducer,
    IpHistoryReducer,
    LoginHistoryBoReducer,
    ReferralReducer,
    ActivityLogHistoryReducer,
    UsersSignupReportReducer,
    ReferralInvitesReducer,
    PersonalInfoReducer,
    ReferralChannelTypeReducer,
    ReferralServiceTypeReducer,
    ReferralPayTypeReducer,
    ReferralParticipantReducer,
    DeviceWhitelistReducer,
    KYCVerifyReducer,
    UserManagementReducer,
    AffliateSignUpReportReducer,
    ConvertsReducer,
    ReferralClickOnLinkReportReducer,
    AffiliateFacebookShareReportReducer,
    AffiliateTwitterShareReportReducer,
    AffiliateCommissionReportReducer,
    AffiliateSchemeReducer,
    AffiliateClickOnLinkReportReducer,
    AffiliateEmailSentReportReducer,
    AffiliateSmsSentReportReducer,
    AffiliatePromotionReducer,
    AffiliateSchemeTypeReducer,
    AffiliateSchemeDetailReducer,
    AffiliateSchemeTypeMappingReducer,
    AffiliateReportDashboardReducer,
    SocialTradingHistoryReducer,
    RoleAssignHistoryReducer,
    UnsignedUserRoleReducer,
    ProviderBalCheckReducer,
    SignUpReducer,
    loginReducer,
    ForgotPasswordReducer,
    ResetPasswordReducer,
    EnableGoogleAuthReducer,
    DisableGoogleAuthReducer,
    tokenReducer,
    AppSettingsReducer,
    EditProfileReducer,
    LoginHistoryReducer,
    notificationReducer,
    IPWhitelistHistoryReducer,
    UserListReducer,
    RuleModuleReducer,
    RuleSubModuleReducer,
    RoleModuleReducer,

    //CMS
    CustomerListReducer,
    ContactUsReducer,
    StateMasterReducer,
    CountriesReducer,
    TemplateReducer,
    CmsDashboardReducer,
    ChatDashboardReducer,
    ChatUserListReducer,
    UserCoinListRequestReducer,
    SendEmailReducer,
    CoinListFieldReducer,
    MessageQueReducer,
    EmailQueReducer,
    ApiManagerReducer,
    RequestFormatApiReducer,
    SendSmsReducer,
    TemplateConfigurationReducer,
    LocalizationReducer,
    CitiesReducer,
    ZipCodesReducer,

    AddCurrencyLogoReducer,

    // Wallet
    LimitConfigReducer,
    StakingConfigurationReducer,
    ChargeConfigReducer,
    AddressGenrationRouteReducer,
    ServiceProviderBalanceReducer,
    DepositionIntervalReducer,
    ERC223DashboardReducer,
    WalletMainDashboardReducer,
    TransactionPolicyReducer,
    AdminAssetsReducer,
    DepositRouteReducer,
    WalletUsagePolicyReducer,
    OrginizationLedgerReducer,
    WithdrawReportReducer,
    DaemonAddressReducer,
    ChargesCollectedReducer,
    TransferInOutReducer,
    StackingHistroyReducer,
    WithdrawalApprovalReducer,
    UserAddressReducer,
    WalletTrnTypesReducer,
    RoleWiseTransactionTypesReducer,
    DepositReportReducer,
    UnstakingRequestsReducer,
    UserWalletsReducer,
    WalletTypesReducer,
    TokenTransferReducer,
    WalletMemberReducer,

    // Arbitrage
    ProviderWalletReducer,
    ArbitrageExchangeBalReducer,
    ConflictHistoryReducer,
    ProviderLedgerReducer,
    ServiceProviderListReducer,
    ProviderAddressReducer,
    CurrencyConfigReducer,
    ArbiServiceProviderConfigReducer,
    ArbitrageChargeConfigReducer,
    ArbitrageUserTradeReducer,
    TopUpHistoryReducer,
    ArbitrageApiRequestReducer,
    ArbitrageLpChargeConfigReducer,
    ArbitrageApiResponseReducer,
    InitialBalanceConfigurationReducer,
    ArbitragePairConfigurationReducer,
    AllowOrderTypeReducer,
    ArbitrageManageMarketReducer,
    ArbitrageTradeReconReducer,
    ArbitrageCoinConfigurationReducer,
    ArbiTradingSummaryLpWiseReducer,
    ArbitrageUserWalletsReducer,
    ArbitrageUserWalletLedgerReducer,

    // Public Private Api Key Configuration
    ApiKeyDashboardReducer,
    ApiPlanConfigReducer,
    ApiPlanSubscriptionHistoryReducer,
    ApiPlanConfigHistoryReducer,
    ApiKeyConfigHistoryReducer,
    IpWiseRequestReportReducer,
    ApiKeyPolicySettingReducer,
    GetIpAndApiAddressWiseReportReducer,
    ApiMethodReducer,
    HttpErrorCodeReducer,
}

export default rootFrontReducer 