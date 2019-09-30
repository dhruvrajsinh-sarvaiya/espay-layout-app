import { all } from "redux-saga/effects";
import CommonSaga from './CommonSaga';
import pairListSaga from './PairListSaga';
import SplashScreenSaga from './SplashScreenSaga';

// Trading
import tradingLedgersBOSaga from './trading/TradingLedgerSaga';
import tradingDashboardBOSaga from './trading/TradingDashboardSaga';
import thirdPartyAPIResponseBOSaga from './trading/ThirdPartyAPIResponseSaga';
import tradingMarketTickersBOSaga from './trading/TradingMarketTickersSaga';
import tradeRoutesBOSaga from './trading/TradeRoutesSaga';
import pairConfigurationSaga from './trading/PairConfigurationSaga';
import tradingSummarySaga from './trading/TradingSummarySaga';
import exchangeFeedConfigSaga from './trading/ExchangeFeedConfigSaga';
import feedLimitConfigSaga from './trading/FeedLimitConfigSaga';
import liquidityAPIManagerSaga from './trading/LiquidityAPIManagerSaga';
import thirdPartyAPIRequest from './trading/ApiRequestConfigSaga';
import manageMarketSaga from './trading/ManageMarketSaga';
import daemonConfiguraionSaga from './trading/DaemonConfigurationSaga';
import providerConfiguraionSaga from './trading/ProviderConfigurationSaga';
import topGainersDataSagaBO from './trading/TopGainersDataSaga';
import topLosersDataSagaBO from './trading/TopLosersDataSaga';
import topGainersLosersDataSagaBO from './trading/TopGainersLosersDataSaga';
import tradeChartBOSaga from './trading/TradeChartSaga';
import TradeRoutingSaga from './trading/TradeRoutingSaga';
import coinConfigurationSaga from './trading/CoinConfigurationSaga';
import SiteTokenConversionReportSaga from './trading/SiteTokenConversionReportSaga';
import SiteTokenSaga from './trading/SiteTokenSaga';
import ServiceProviderConfigSaga from './trading/ServiceProviderSaga';
import MarketMakingSaga from './trading/MarketMakingSaga';
import AddCurrencyLogoSaga from './trading/AddCurrencyLogoSaga';

// margin
import MarginTradingMarketCapTickersSaga from './margin/MarginTradingMarketCapTickersSaga';
import MarginManageMarketSaga from './margin/MarginManageMarketSaga';
import LeverageRequestSaga from './margin/LeverageRequestSaga';
import LeverageReportSaga from './margin/LeverageReportSaga';
import LeverageConfigSaga from "./margin/LeverageConfigSaga";
import ProfitLossReportSaga from "./margin/ProfitLossReportSaga";
import OpenPositionReportSaga from "./margin/OpenPositionReportSaga";
import WalletLedgerSaga from "./margin/WalletLedgerSaga";

// MyAccount
import ReferralSystemSaga from './myaccount/ReferralSystemSaga';
import RuleFieldsBoSaga from './myaccount/RuleFieldsSaga';
import ProfileConfigSaga from './myaccount/ProfileConfigSaga';
import passwordPolicySaga from './myaccount/passwordPolicySaga';
import SocialTradingPolicySaga from './myaccount/SocialTradingPolicySaga';
import SlaConfigPrioritySaga from './myaccount/SlaConfigPrioritySaga';
import HelpAndSupportSaga from './myaccount/HelpAndSupportSaga';
import IpRangeSaga from './myaccount/IpRangeSaga';
import IpHistorySaga from './myaccount/IpHistroyBoSaga';
import LoginHistoryBoSaga from './myaccount/LoginHistoryBoSaga';
import ReferralSaga from './myaccount/ReferralSaga';
import ActivityLogHistorySaga from './myaccount/ActivityLogHistorySaga';
import UsersSignupReportSaga from './myaccount/UsersSignupReportSaga';
import ReferralInvitesSaga from './myaccount/ReferralInvitesSaga';
import PersonalInfoSaga from './myaccount/PersonalInfoSaga';
import ReferralChannelTypeSaga from './myaccount/ReferralChannelTypeSaga';
import ReferralPayTypeSaga from './myaccount/ReferralPayTypeSaga';
import ReferralServiceTypeSaga from './myaccount/ReferralServiceTypeSaga';
import ReferralParticipantSaga from './myaccount/ReferralParticipantSaga';
import DeviceWhitelistSaga from './myaccount/DeviceWhitelistSaga';
import KYCVerifySaga from './myaccount/KYCVerifySaga';
import UserManagementSaga from './myaccount/UserManagementSaga';
import AffliateSignUpReportSaga from './myaccount/AffliateSignUpReportSaga';
import ConvertsSaga from './myaccount/ConvertsSaga';
import ReferralClickOnLinkSaga from './myaccount/ReferralClickOnLinkSaga';
import AffiliateFacebookShareReportSaga from './myaccount/AffiliateFacebookShareReportSaga';
import AffiliateTwitterShareReportSaga from './myaccount/AffiliateTwitterShareReportSaga';
import AffiliateCommissionReportSaga from './myaccount/AffiliateCommissionReportSaga';
import AffiliateSchemeSaga from './myaccount/AffiliateSchemeSaga';
import AffiliateClickOnLinkReportSaga from './myaccount/AffiliateClickOnLinkReportSaga';
import AffiliateEmailSentReportSaga from './myaccount/AffiliateEmailSentReportSaga';
import AffiliateSmsSentReportSaga from './myaccount/AffiliateSmsSentReportSaga';
import AffiliatePromotionSaga from './myaccount/AffiliatePromotionSaga';
import AffiliateSchemeTypeSaga from './myaccount/AffiliateSchemeTypeSaga';
import AffiliateSchemeDetailSaga from './myaccount/AffiliateSchemeDetailSaga';
import AffiliateSchemeTypeMappingSaga from './myaccount/AffiliateSchemeTypeMappingSaga';
import AffiliateReportDashboardSaga from './myaccount/AffiliateReportDashboardSaga';
import SocialTradingHistorySaga from './myaccount/SocialTradingHistorySaga';
import RoleAssignHistorySaga from './myaccount/RoleAssignHistorySaga';
import UnsignedUserRoleSaga from './myaccount/UnsignedUserRoleSaga';
import ProviderBalCheckSaga from './myaccount/ProviderBalCheckSaga';
import SignUpSaga from './myaccount/signUpSaga'
import loginSaga from './myaccount/loginSaga'
import ResetPasswordSaga from './myaccount/ResetPasswordSaga';
import forgotPasswordSagas from './myaccount/forgotPasswordSagas';
import EnableGoogleAuthSaga from './myaccount/EnableGoogleAuthSaga';
import DisableGoogleAuthSaga from './myaccount/DisableGoogleAuthSaga';
import tokenSaga from './myaccount/AuthorizationToken';
import LanguageSaga from './myaccount/LanguageSaga';
import EditProfileSaga from './myaccount/EditProfileSaga';
import LoginHistorySaga from './myaccount/LoginHistorySaga';
import notificationSaga from './myaccount/NotificationSaga';
import IPWhitelistHistorySaga from './myaccount/IPWhitelistHistorySaga';
import UserListSaga from './myaccount/UserListSaga';

//CMS
import CustomerListSaga from './cms/CustomerListSaga';
import ContactUsSaga from './cms/ContactUsSaga';
import StateMasterSaga from './cms/StateMasterSaga';
import CountriesSaga from './cms/CountriesSaga';
import TemplatesSaga from './cms/TemplatesSaga';
import CmsDashboardSaga from './cms/CmsDashboardSaga';
import ChatDashboardSaga from './cms/ChatDashboardSaga';
import ChatUserListSaga from './cms/ChatUserListSaga';
import UserCoinListRequestSaga from './cms/UserCoinListRequestSaga';
import SendEmailSaga from './cms/SendEmailSaga';
import CoinListFieldSaga from './cms/CoinListFieldSaga';
import MessageQueSaga from './cms/MessageQueSaga';
import EmailQueSaga from './cms/EmailQueSaga';
import ApiManagerSaga from './cms/ApiManagerSaga';
import RequestFormatApiSaga from './cms/RequestFormatApiSaga';
import SendSmsSaga from './cms/SendSmsSaga';
import TemplateConfigurationSaga from './cms/TemplateConfigurationSaga';
import LocalizationSaga from './cms/LocalizationSaga';

// Wallet
import LimitConfigSaga from './wallet/LimitConfigSaga';
import StakingConfigurationSaga from './wallet/StakingConfigurationSaga';
import ChargeConfigSaga from './wallet/ChargeConfigSaga';
import AddressGenrationRouteSaga from './wallet/AddressGenrationRouteSaga';
import ServiceProviderBalanceSaga from './wallet/ServiceProviderBalanceSaga';
import DepositionIntervalSaga from './wallet/DepositionIntervalSaga';
import ERC223DashboardSaga from './wallet/ERC223DashboardSaga';
import WalletMainDasboardSaga from './wallet/WalletMainDasboardSaga';
import TransactionPolicySaga from './wallet/TransactionPolicySaga';
import AdminAssetsSaga from './wallet/AdminAssetsSaga';
import DepositRouteSaga from './wallet/DepositRouteSaga';
import WalletUsagePolicySaga from './wallet/WalletUsagePolicySaga';
import OrginizationLedgerSaga from './wallet/OrginizationLedgerSaga';
import WithdrawReportSaga from './wallet/WithdrawReportSaga';
import DaemonAddressSaga from './wallet/DaemonAddressSaga';
import ChargesCollectedSaga from './wallet/ChargesCollectedSaga';
import TransferInOutSaga from './wallet/TransferInOutSaga';
import StackingHistorySaga from './wallet/StackingHistorySaga';
import WithdrawalApprovalSaga from './wallet/WithdrawalApprovalSaga';
import UserAddressSaga from './wallet/UserAddressSaga';
import WalletTrnTypesSaga from './wallet/WalletTrnTypesSaga';
import RoleWiseTransactionTypesSaga from './wallet/RoleWiseTransactionTypesSaga';
import DepositReportSaga from './wallet/DepositReportSaga';
import UnstakingRequestsSaga from './wallet/UnstakingRequestsSaga';
import UserWalletsSaga from './wallet/UserWalletsSaga';
import WalletTypesSaga from './wallet/WalletTypesSaga';
import TokenTransferSaga from './wallet/TokenTransferSaga';
import WalletMemberSaga from './wallet/WalletMemberSaga';

// Arbitrage
import ArbitrageExchangeBalSaga from './arbitrage/ArbitrageExchangeBalSaga';
import ConflictHistorySaga from './arbitrage/ConflictHistorySaga';
import ProviderLedgerSaga from './arbitrage/ProviderLedgerSaga';
import ServiceProviderListSaga from './arbitrage/ServiceProviderListSaga';
import ProviderAddressSaga from './arbitrage/ProviderAddressSaga';
import CurrencyConfigSaga from './arbitrage/CurrencyConfigSaga';
import ArbitrageServiceProviderConfigSaga from './arbitrage/ArbitrageServiceProviderConfigSaga';
import ArbitrageChargeConfigSaga from './arbitrage/ArbitrageChargeConfigSaga';
import ArbitrageUserTradeCountSaga from './arbitrage/ArbitrageUserTradeCountSaga';
import TopupHistorySaga from './arbitrage/TopupHistorySaga';
import ArbitrageApiRequestSaga from './arbitrage/ArbitrageApiRequestSaga';
import ArbitrageLpChargeConfigSaga from './arbitrage/ArbitrageLpChargeConfigSaga';
import ArbitrageApiResponseSaga from './arbitrage/ArbitrageApiResponseSaga';
import InitialBalanceConfigurationSaga from './arbitrage/InitialBalanceConfigurationSaga';
import ArbitragePairConfigurationSaga from './arbitrage/ArbitragePairConfigurationSaga';
import AllowOrderTypeSaga from './arbitrage/AllowOrderTypeSaga';
import ArbitrageCommonSaga from './ArbitrageCommonSaga';
import ArbitrageManageMarketSaga from './arbitrage/ArbitrageManageMarketSaga';
import ArbitrageTradeReconSaga from './arbitrage/ArbitrageTradeReconSaga';
import ArbitrageCoinConfigurationSaga from './arbitrage/ArbitrageCoinConfigurationSaga';
import ArbitrageTradingSummeryLpWiseSaga from './arbitrage/ArbitrageTradingSummeryLpWiseSaga';
import ArbitrageUserWalletsSaga from './arbitrage/ArbitrageUserWalletsSaga';
import ArbitrageUserWalletLedgerSaga from './arbitrage/ArbitrageUserWalletLedgerSaga';

// Public Private Api Key Configuration 
import ApiKeyDashboardSaga from './apikeyconfiguration/ApiKeyDashboardSaga';
import ApiPlanConfigSaga from './apikeyconfiguration/ApiPlanConfigSaga';
import ApiPlanSubscriptionHistorySaga from './apikeyconfiguration/ApiPlanSubscriptionHistorySaga';
import ApiPlanConfigHistorySaga from './apikeyconfiguration/ApiPlanConfigHistorySaga';
import ApiKeyConfigHistorySaga from './apikeyconfiguration/ApiKeyConfigHistorySaga';
import IpWiseRequestReportSaga from './apikeyconfiguration/IpWiseRequestReportSaga';
import ApiKeyPolicySettingSaga from './apikeyconfiguration/ApiKeyPolicySettingSaga';
import GetIpAndApiAddressWiseReportSaga from './apikeyconfiguration/GetIpAndApiAddressWiseReportSaga';
import ApiMethodSaga from './apikeyconfiguration/ApiMethodSaga';
import HttpErrorCodeSaga from './apikeyconfiguration/HttpErrorCodeSaga';

function* rootSaga() {
    yield all([
        tokenSaga(),
        CommonSaga(),
        pairListSaga(),
        SplashScreenSaga(),

        // Trading 
        tradingLedgersBOSaga(),
        tradingDashboardBOSaga(),
        thirdPartyAPIResponseBOSaga(),
        tradingMarketTickersBOSaga(),
        tradeRoutesBOSaga(),
        pairConfigurationSaga(),
        tradingSummarySaga(),
        exchangeFeedConfigSaga(),
        feedLimitConfigSaga(),
        liquidityAPIManagerSaga(),
        thirdPartyAPIRequest(),
        manageMarketSaga(),
        daemonConfiguraionSaga(),
        providerConfiguraionSaga(),
        topGainersDataSagaBO(),
        topLosersDataSagaBO(),
        topGainersLosersDataSagaBO(),
        tradeChartBOSaga(),
        TradeRoutingSaga(),
        coinConfigurationSaga(),
        SiteTokenConversionReportSaga(),
        SiteTokenSaga(),
        ServiceProviderConfigSaga(),
        MarketMakingSaga(),

        // MyAccount
        ReferralSystemSaga(),
        RuleFieldsBoSaga(),
        ProfileConfigSaga(),
        passwordPolicySaga(),
        SocialTradingPolicySaga(),
        HelpAndSupportSaga(),
        SlaConfigPrioritySaga(),
        IpRangeSaga(),
        IpHistorySaga(),
        LoginHistoryBoSaga(),
        ReferralSaga(),
        ActivityLogHistorySaga(),
        UsersSignupReportSaga(),
        ReferralInvitesSaga(),
        PersonalInfoSaga(),
        ReferralChannelTypeSaga(),
        ReferralPayTypeSaga(),
        ReferralServiceTypeSaga(),
        ReferralParticipantSaga(),
        DeviceWhitelistSaga(),
        KYCVerifySaga(),
        UserManagementSaga(),
        AffliateSignUpReportSaga(),
        ConvertsSaga(),
        ReferralClickOnLinkSaga(),
        AffiliateFacebookShareReportSaga(),
        AffiliateTwitterShareReportSaga(),
        AffiliateCommissionReportSaga(),
        AffiliateSchemeSaga(),
        AffiliateClickOnLinkReportSaga(),
        AffiliateEmailSentReportSaga(),
        AffiliateSmsSentReportSaga(),
        AffiliatePromotionSaga(),
        AffiliateSchemeTypeSaga(),
        AffiliateSchemeDetailSaga(),
        AffiliateSchemeTypeMappingSaga(),
        AffiliateReportDashboardSaga(),
        SocialTradingHistorySaga(),
        RoleAssignHistorySaga(),
        UnsignedUserRoleSaga(),
        ProviderBalCheckSaga(),
        SignUpSaga(),
        loginSaga(),
        ResetPasswordSaga(),
        forgotPasswordSagas(),
        EnableGoogleAuthSaga(),
        DisableGoogleAuthSaga(),
        LanguageSaga(),
        EditProfileSaga(),
        LoginHistorySaga(),
        notificationSaga(),
        IPWhitelistHistorySaga(),
        UserListSaga(),

        //CMS
        CustomerListSaga(),
        ContactUsSaga(),
        StateMasterSaga(),
        CountriesSaga(),
        TemplatesSaga(),
        CmsDashboardSaga(),
        ChatDashboardSaga(),
        ChatUserListSaga(),
        UserCoinListRequestSaga(),
        SendEmailSaga(),
        CoinListFieldSaga(),
        MessageQueSaga(),
        EmailQueSaga(),
        ApiManagerSaga(),
        RequestFormatApiSaga(),
        SendSmsSaga(),
        TemplateConfigurationSaga(),
        LocalizationSaga(),

        // margin
        MarginTradingMarketCapTickersSaga(),
        MarginManageMarketSaga(),
        LeverageRequestSaga(),
        LeverageReportSaga(),
        LeverageConfigSaga(),
        ProfitLossReportSaga(),
        OpenPositionReportSaga(),
        WalletLedgerSaga(),

        AddCurrencyLogoSaga(),

        // Wallet
        LimitConfigSaga(),
        StakingConfigurationSaga(),
        ChargeConfigSaga(),
        AddressGenrationRouteSaga(),
        ServiceProviderBalanceSaga(),
        DepositionIntervalSaga(),
        ERC223DashboardSaga(),
        WalletMainDasboardSaga(),
        TransactionPolicySaga(),
        AdminAssetsSaga(),
        DepositRouteSaga(),
        WalletUsagePolicySaga(),
        OrginizationLedgerSaga(),
        WithdrawReportSaga(),
        DaemonAddressSaga(),
        ChargesCollectedSaga(),
        TransferInOutSaga(),
        StackingHistorySaga(),
        WithdrawalApprovalSaga(),
        UserAddressSaga(),
        WalletTrnTypesSaga(),
        RoleWiseTransactionTypesSaga(),
        DepositReportSaga(),
        UnstakingRequestsSaga(),
        UserWalletsSaga(),
        WalletTypesSaga(),
        TokenTransferSaga(),
        WalletMemberSaga(),

        // Arbitrage
        ArbitrageExchangeBalSaga(),
        ConflictHistorySaga(),
        ProviderLedgerSaga(),
        ServiceProviderListSaga(),
        ProviderAddressSaga(),
        CurrencyConfigSaga(),
        ArbitrageServiceProviderConfigSaga(),
        ArbitrageChargeConfigSaga(),
        ArbitrageUserTradeCountSaga(),
        TopupHistorySaga(),
        ArbitrageApiRequestSaga(),
        ArbitrageLpChargeConfigSaga(),
        ArbitrageApiResponseSaga(),
        InitialBalanceConfigurationSaga(),
        ArbitragePairConfigurationSaga(),
        ArbitrageCommonSaga(),
        AllowOrderTypeSaga(),
        ArbitrageManageMarketSaga(),
        ArbitrageTradeReconSaga(),
        ArbitrageCoinConfigurationSaga(),
        ArbitrageTradingSummeryLpWiseSaga(),
        ArbitrageUserWalletsSaga(),
        ArbitrageUserWalletLedgerSaga(),

        // Public Private Key Configuration
        ApiKeyDashboardSaga(),
        ApiPlanConfigSaga(),
        ApiPlanSubscriptionHistorySaga(),
        ApiPlanConfigHistorySaga(),
        ApiKeyConfigHistorySaga(),
        IpWiseRequestReportSaga(),
        ApiKeyPolicySettingSaga(),
        GetIpAndApiAddressWiseReportSaga(),
        ApiMethodSaga(),
        HttpErrorCodeSaga(),
    ])
}

export default rootSaga;