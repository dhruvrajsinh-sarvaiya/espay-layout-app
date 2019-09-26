import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { configureTransition } from '../validations/CommonValidation';
import { collapseExpand, fromRight, fromLeft } from '../native_theme/components/NavigationTransition';

import SplashScreen from './CMS/SplashScreen';
import AppIntroScreen from './CMS/AppIntroScreen';
import ForgotPasswordComponent from './Login/ForgotPassword';
import ResetAuthenticationComponent from './Login/ResetAuthentication';
import SecurityScreen from './Security/SecurityScreen';
import SettingScreen from './Setting/SettingScreen';
import ResetPasswordComponent from './Login/ResetPassword';
import SubMenuScreen from './widget/SubMenuScreen';
import SignUpNormal from './SignUpProcess/SignUpNormal';
import SignUpWithOtp from './SignUpProcess/SignUpWithOtp';
import LoginNormalScreen from './Login/LoginNormalScreen';
import SignUpNormalSub from './SignUpProcess/SignUpNormalSub';
import LanguageScreen from './Setting/LanguageScreen';
import LanguageFreshScreen from './Setting/LanguageFreshScreen';
import SignUpMobileWithOtp from './SignUpProcess/SignUpMobileWithOtp';
import SignInEmailWithOtp from './Login/SignInEmailWithOtp';
import SignInMobileWithOtp from './Login/SignInMobileWithOtp';
import GoogleAuthenticatorDownloadApp from './Security/GoogleAuthenticatorDownloadApp';
import GoogleAuthenticatorBackupKey from './Security/GoogleAuthenticatorBackupKey';
import EnableGoogleAuthenticator from './Security/EnableGoogleAuthenticator';
import DisableGoogleAuthenticator from './Security/DisableGoogleAuthenticator';
import VerifyEmailScreen from './SignUpProcess/VerifyEmailScreen';
import { MultipleSelection } from '../native_theme/components/MultipleSelection';
import QuickLoginScreen from './Login/QuickLoginScreen'
import QuickSignUpScreen from './SignUpProcess/QuickSignUpScreen'
import MyAccount from './CMS/MyAccount';

import TradingLedgerScreen from "./trading/TradingLedger/TradingLedgerScreen";

//Trading Dashboard Screens
import TradingDashboardScreen from "./trading/TradingDashboard/TradingDashboardScreen";
import TradingDashboardSubScreen from "./trading/TradingDashboard/TradingDashboardSubScreen";
import TradeSummaryCountScreen from "./trading/TradingDashboard/TradeSummaryCountScreen";

//Third Party API Response
import ThirdPartyAPIResponseScreen from "./trading/ThirdPartyAPIResponse/ThirdPartyAPIResponseScreen";
import AddUpdateThirdPartyAPIResponseScreen from "./trading/ThirdPartyAPIResponse/AddUpdateThirdPartyAPIResponseScreen";

//Trading Market Tickers
import TradingMarketTickersScreen from "./trading/MarketTickers/TradingMarketTickersScreen";

//Trade Routes
import TradeRoutesScreen from "./trading/TradeRoutes/TradeRoutesScreen";
import AddUpdateTradeRoutesScreen from "./trading/TradeRoutes/AddUpdateTradeRoutesScreen";

//Coin Configuration
import CoinConfigurationScreen from './trading/CoinConfiguration/CoinConfigurationScreen';
import CoinConfigurationAddUpdateScreen from './trading/CoinConfiguration/CoinConfigurationAddUpdateScreen';
import CoinConfigurationDetailScreen from './trading/CoinConfiguration/CoinConfigurationDetailScreen';

//Pair Configuration
import PairConfigurationScreen from './trading/PairConfiguration/PairConfigurationScreen';
import PairConfigurationDetailScreen from './trading/PairConfiguration/PairConfigurationDetailScreen';
import AddPairConfiguration from './trading/PairConfiguration/AddPairConfiguration';

//Exchagne Feed Configuration
import ExchangeFeedConfigScreen from './trading/ExchangeFeedConfig/ExchangeFeedConfigScreen'
import ExchangeFeedConfigAddScreen from './trading/ExchangeFeedConfig/ExchangeFeedConfigAddScreen'

//Feed Limit Configuration
import FeedLimitConfigScreen from './trading/FeedLimitConfig/FeedLimitConfigScreen'
import FeedLimitConfigAddScreen from './trading/FeedLimitConfig/FeedLimitConfigAddScreen'

//Third Party API Request
import ThirdPartyApiRequestScreen from './trading/ThirdPartyAPIRequest/ThirdPartyApiRequestScreen'
import ThirdPartyApiRequestAddScreen from './trading/ThirdPartyAPIRequest/ThirdPartyApiRequestAddScreen'

//Liquidity API Manager
import LiquidityAPIManager from './trading/LiquidityAPIManager/LiquidityAPIManager';
import LiquidityAPIManagerAddEdit from './trading/LiquidityAPIManager/LiquidityAPIManagerAddEdit';

//Manage Market
import ManageMarket from './trading/ManageMarkets/ManageMarket';
import ManageMarketAddEdit from './trading/ManageMarkets/ManageMarketAddEdit';

//Daemon Configuration
import DaemonConfigurationScreen from "./trading/DaemonConfiguration/DaemonConfigurationScreen";
import AddEditDemonConfigurationScreen from "./trading/DaemonConfiguration/AddEditDemonScreen";

//Provider Configuration
import ProviderConfigurationScreen from "./trading/ProviderConfiguration/ProviderConfigurationScreen";
import AddEditProviderConfigurationScreen from "./trading/ProviderConfiguration/AddEditProviderConfigurationScreen";

//Trading Summary New
import UserTradingSummaryScreen from "./trading/TradingSummary/UserTradingSummaryScreen";
import UserTradingSummaryDetailScreen from './trading/TradingSummary/UserTradingSummaryDetailScreen';
import TradingSummaryScreen from "./trading/TradingSummary/TradingSummaryScreen";
import TradingSummaryDetailScreen from './trading/TradingSummary/TradingSummaryDetailScreen';

import ViewProfile from './CMS/UpdateViewProfile/ViewProfile';
import UpdateProfile from './CMS/UpdateViewProfile/UpdateProfile';

// Referral System
import ReferralSystemDashboard from './MyAccount/ReferralSystem/ReferralSystemDashboard';
import SMSAndEmailInviteScreen from './MyAccount/ReferralSystem/SMSAndEmailInviteScreen';
import SocialMediaShareScreen from './MyAccount/ReferralSystem/SocialMediaShareScreen';
import RuleFieldsListScreen from './MyAccount/RuleField/RuleFieldsListScreen';
import AddEditRuleFieldScreen from './MyAccount/RuleField/AddEditRuleFieldScreen';
import PasswordPolicyDashboard from './MyAccount/PasswordPolicy/PasswordPolicyDashboard';
import ProfileConfigDashboard from './MyAccount/ProfileConfig/ProfileConfigDashboard';
import SecurityDashboard from './MyAccount/Security/SecurityDashboard';
import SlaSettingDash from './MyAccount/SlaSetting/SlaSettingDash';

import ProfileConfigListScreen from './MyAccount/ProfileConfig/ProfileConfigListScreen';
import ProfileConfigListDetailScreen from './MyAccount/ProfileConfig/ProfileConfigListDetailScreen';
import PasswordPolicyListScreen from './MyAccount/PasswordPolicy/PasswordPolicyListScreen';
import AddEditPasswordPolicy from './MyAccount/PasswordPolicy/AddEditPasswordPolicy';
import ReferralInvitesScreen from './MyAccount/ReferralSystem/ReferralInvitesScreen';

// Social Trading Policy
import FollowerProfileConfigScreen from './MyAccount/SocialProfile/FollowerProfileConfigScreen';
import LeaderProfileConfigScreen from './MyAccount/SocialProfile/LeaderProfileConfigScreen';

// Help And Support
import HelpAndSupportDashboard from './MyAccount/HelpAndSupport/HelpAndSupportDashboard';
import ComplainReportScreen from './MyAccount/HelpAndSupport/ComplainReportScreen';
import ComplainReportDetailScreen from './MyAccount/HelpAndSupport/ComplainReportDetailScreen';
import ReplyComplainScreen from './MyAccount/HelpAndSupport/ReplyComplainScreen';

//CMS
import CountriesScreen from './CMS/CountriesScreen';
import CountriesAddScreen from './CMS/CountriesAddScreen';
import TemplateScreen from './CMS/Template/TemplateScreen';
import TemplateAddScreen from './CMS/Template/TemplateAddScreen';
import CmsDashBoardScreen from './CMS/CmsDashBoardScreen';

import ContactUsScreen from './CMS/ContactUs/ContactUsScreen';
import StateMaster from './CMS/StateMaster';
import StateMasterAdd from './CMS/StateMasterAdd';
import ChatDashboard from './CMS/ChatDashboard';
import ChatUserList from './CMS/ChatUserList';
import ChatUserListEdit from './CMS/ChatUserListEdit';
import ChatUserHistory from './CMS/ChatUserHistory';
import UserCoinListRequestScreen from './CMS/CoinListRequest/UserCoinListRequestScreen';
import UserCoinListDetailsScreen from './CMS/CoinListRequest/UserCoinListDetailsScreen';
import SendEmailScreen from './CMS/SendEmail/SendEmailScreen';
import CoinListFieldScreen from './CMS/CoinListFields/CoinListFieldScreen';
import CoinListRequestDashboard from './CMS/CoinListRequest/CoinListRequestDashboard';
import SendSmsScreen from './CMS/SendSms/SendSmsScreen';
import TemplateConfigurationScreen from './CMS/TemplateConfiguration/TemplateConfigurationScreen';
import EditTemplateConfigurationScreen from './CMS/TemplateConfiguration/EditTemplateConfigurationScreen';
import SlaConfigPriorityScreen from './MyAccount/SlaSetting/SlaConfigPriorityScreen';
import AddEditSlaConfigPriority from './MyAccount/SlaSetting/AddEditSlaConfigPriority';

import ListIpRange from './MyAccount/IpRange/ListIpRange';
import IpProfilingDash from './MyAccount/IpRange/IpProfilingDash';
import AddEditAllowIp from './MyAccount/IpRange/AddEditAllowIp';
import LoginHistoryScreen from './MyAccount/Reports/LoginHistoryScreen';
import IpHistoryScreen from './MyAccount/Reports/IpHistoryScreen';
import RewardConfigurationDash from './MyAccount/ReferralReward/RewardConfigurationDash';
import ReferralRewardList from './MyAccount/ReferralReward/ReferralRewardList';
import ReferralRewardListDetail from './MyAccount/ReferralReward/ReferralRewardListDetail';
import AddEditRefferalReward from './MyAccount/ReferralReward/AddEditRefferalReward';
import ActivityLogHistoryList from './MyAccount/Reports/ActivityLogHistoryList';
import ActivityLogHistoryDetail from './MyAccount/Reports/ActivityLogHistoryDetail';
import UserSignUpReportDash from './MyAccount/Reports/UserSignUpReportDash';
import UserSignUpReportList from './MyAccount/Reports/UserSignUpReportList';
import UserSignUpReportDetail from './MyAccount/Reports/UserSignUpReportDetail';
import SiteTokenConversionReport from './trading/SiteTokenConversionReport/SiteTokenConversionReport';
import PersonalInfo from './MyAccount/ManageAccount/PersonalInfo';
import MyAccountDashboard from './MyAccount/MyAccountDashboard';
import ReportsDashbord from './MyAccount/Reports/ReportsDashbord';
import ManageAccountDasboard from './MyAccount/ManageAccount/ManageAccountDasboard';
import ReferralPayTypeAddScreen from './MyAccount/ReferralSystem/ReferralPayTypeAddScreen';
import ReferralPayTypeScreen from './MyAccount/ReferralSystem/ReferralPayTypeScreen';
import ReferralChannelTypeScreen from './MyAccount/ReferralSystem/ReferralChannelTypeScreen';
import ReferralChannelTypeAddScreen from './MyAccount/ReferralSystem/ReferralChannelTypeAddScreen';
import ReferralServiceTypeScreen from './MyAccount/ReferralSystem/ReferralServiceTypeScreen';
import ReferralServiceTypeAddScreen from './MyAccount/ReferralSystem/ReferralServiceTypeAddScreen';
import ReferralParticipantScreen from './MyAccount/ReferralSystem/ReferralParticipantScreen';
import AffliateManagementDashboard from './MyAccount/AffliateManagement/AffliateManagementDashboard';
import CommonDashboard from '../native_theme/components/CommonDashboard';
import UsersDashboard from './MyAccount/UserManagement/UsersDashboard';
import DeviceWhitelistScreen from './MyAccount/ManageAccount/DeviceWhitelistScreen';
import KYCVerifyListScreen from './MyAccount/KYCVerify/KYCVerifyListScreen';
import KYCVerifyListDetailScreen from './MyAccount/KYCVerify/KYCVerifyListDetailScreen';

// User Management
import RuleModuleScreen from './MyAccount/UserManagement/RuleModuleScreen';
import RuleSubModuleScreen from './MyAccount/UserManagement/RuleSubModuleScreen';
import RoleModuleScreen from './MyAccount/UserManagement/RoleModuleScreen';
import AddEditRuleModuleScreen from './MyAccount/UserManagement/AddEditRuleModuleScreen';
import AddEditRuleSubModuleScreen from './MyAccount/UserManagement/AddEditRuleSubModuleScreen';
import AddEditRoleModuleScreen from './MyAccount/UserManagement/AddEditRoleModuleScreen';
import UserManagementDashboard from './MyAccount/UserManagement/UserManagementDashboard';
import RuleManagementDashboard from './MyAccount/UserManagement/RuleManagementDashboard';
import RoleManagementDashboard from './MyAccount/UserManagement/RoleManagementDashboard';
import RuleModuleDashboard from './MyAccount/UserManagement/RuleModuleDashboard';
import RuleSubModuleDashboard from './MyAccount/UserManagement/RuleSubModuleDashboard';
import RuleToolListScreen from './MyAccount/UserManagement/RuleToolListScreen';
import AddEditRuleToolModuleScreen from './MyAccount/UserManagement/AddEditRuleToolModuleScreen';
import RuleToolModuleDashboard from './MyAccount/UserManagement/RuleToolModuleDashboard';
import UsersListScreen from './MyAccount/UserManagement/UsersListScreen';
import AddEditUserScreen from './MyAccount/UserManagement/AddEditUserScreen';
import UserAssignRoleScreeen from './MyAccount/UserManagement/UserAssignRoleScreeen';

import CustomerListScreen from './MyAccount/Customers/CustomerListScreen';
import CustomerListDetailScreen from './MyAccount/Customers/CustomerListDetailScreen';
import CustomerDashboard from './MyAccount/Customers/CustomerDashboard';
import CustomerAddScreen from './MyAccount/Customers/CustomerAddScreen';
import AffliateSignUpReportListScreen from './MyAccount/AffliateManagement/AffliateSignUpReportListScreen';
import AffliateSignUpReportDetailScreen from './MyAccount/AffliateManagement/AffliateSignUpReportDetailScreen';
import ConvetsListScreen from './MyAccount/ReferralSystem/ConvetsListScreen';
import ConvertsListDetailScreen from './MyAccount/ReferralSystem/ConvertsListDetailScreen';
import ReferralClickOnReportScreen from './MyAccount/ReferralSystem/ReferralClickOnReportScreen';

import AffiliateFacebookShareReportScreen from './MyAccount/AffliateManagement/AffiliateFacebookShareReportScreen';
import AffiliateTwitterShareReportScreen from './MyAccount/AffliateManagement/AffiliateTwitterShareReportScreen';
import AffiliateCommissionReportScreen from './MyAccount/AffliateManagement/AffiliateCommissionReportScreen';
import AffiliateCommissionReportDetailScreen from './MyAccount/AffliateManagement/AffiliateCommissionReportDetailScreen';
import AffliateSchemeListScreen from './MyAccount/AffliateManagement/AffliateSchemeListScreen';
import AffiliateSchemeAddEditScreen from './MyAccount/AffliateManagement/AffiliateSchemeAddEditScreen';
import AffiliateClickOnLinkReportScreen from './MyAccount/AffliateManagement/AffiliateClickOnLinkReportScreen';
import AffiliateEmailSentReportScreen from './MyAccount/AffliateManagement/AffiliateEmailSentReportScreen';
import AffiliateSmsSentReportScreen from './MyAccount/AffliateManagement/AffiliateSmsSentReportScreen';
import AffliatePromotionListScreen from './MyAccount/AffliateManagement/AffliatePromotionListScreen';
import AffiliatePromotionAddEditScreen from './MyAccount/AffliateManagement/AffiliatePromotionAddEditScreen';
import AffiliateSchemeTypeListScreen from './MyAccount/AffliateManagement/AffiliateSchemeTypeListScreen';
import AffiliateSchemeTypeAddEditScreen from './MyAccount/AffliateManagement/AffiliateSchemeTypeAddEditScreen';
import AffiliateSchemeDetailScreen from './MyAccount/AffliateManagement/AffiliateSchemeDetailScreen';
import AffiliateSchemeDetailAddEditScreen from './MyAccount/AffliateManagement/AffiliateSchemeDetailAddEditScreen';
import AffiliateSchemeTypeMappingScreen from './MyAccount/AffliateManagement/AffiliateSchemeTypeMappingScreen';
import AffiliateSchemeTypeMappingAddEditScreen from './MyAccount/AffliateManagement/AffiliateSchemeTypeMappingAddEditScreen';
import AffiliateSchemeTypeMappingDetailScreen from './MyAccount/AffliateManagement/AffiliateSchemeTypeMappingDetailScreen';
import AffliateReportsDashboard from './MyAccount/AffliateManagement/AffliateReportsDashboard';
import ProviderBalCheckScreen from './MyAccount/ProviderBalanceCheck/ProviderBalCheckScreen';
import ProviderBalCheckListScreen from './MyAccount/ProviderBalanceCheck/ProviderBalCheckListScreen';

import AlertModal from './AlertModal';

import MainScreen from './MainBoard/MainScreen';

//site token
import SiteTokenScreen from './trading/SiteToken/SiteTokenScreen';
import SiteTokenAddEditScreen from './trading/SiteToken/SiteTokenAddEditScreen';

//Trading Trade Routing
import TradeRoutingListScreen from './trading/TradeRouting/TradeRoutingListScreen';
import TradeRoutingListDetailScreen from './trading/TradeRouting/TradeRoutingListDetailScreen';
import MarginTradingDashboardScreen from './Margin/MarginTradingDashboard/MarginTradingDashboardScreen';
import MarginTopGainerLoser from './trading/MarginTopGainerLoser/MarginTopGainerLoser';

// for Service Provider
import ServiceProviderScreen from './trading/ServiceProvider/ServiceProviderScreen';
import ServiceProviderAddScreen from './trading/ServiceProvider/ServiceProviderAddScreen';
import MarginTradingDashboardSub from './Margin/MarginTradingDashboard/MarginTradingDashboardSub';

// for margin pair configuration
import MarginTradingMarketTickersScreen from './Margin/MarginMarketTickers/MarginTradingMarketTickersScreen';

import MarginManageMarket from './Margin/MarginManageMarkets/MarginManageMarket';
import MarginManageMarketAdd from './Margin/MarginManageMarkets/MarginManageMarketAdd';
import SocialTradingHistoryScreen from './MyAccount/ManageAccount/SocialTradingHistoryScreen';
import SocialTradingHistoryDetailScreen from './MyAccount/ManageAccount/SocialTradingHistoryDetailScreen';
import RoleAssignHistoryScreen from './MyAccount/ManageAccount/RoleAssignHistoryScreen';
import UnSignedUserRoleScreen from './MyAccount/ManageAccount/UnSignedUserRoleScreen';

import LeverageRequestListScreen from './Margin/LeverageReport/LeverageRequestListScreen';
import LeverageRequestDetailScreen from './Margin/LeverageReport/LeverageRequestDetailScreen';
import LevarageReportScreen from './Margin/LeverageReport/LevarageReportScreen';
import LevarageReportDetailScreen from './Margin/LeverageReport/LevarageReportDetailScreen';
import LeverageConfigListScreen from './Margin/LeverageReport/LeverageConfigListScreen';
import AddEditLeverageConfigScreen from './Margin/LeverageReport/AddEditLeverageConfigScreen';

import OpenPositionListScreen from './Margin/OpenPositionReport/OpenPositionListScreen';
import OpenPositionReportDetailScreen from './Margin/OpenPositionReport/OpenPositionReportDetailScreen';
import ProfitLossReportScreen from './Margin/ProfitLossReport/ProfitLossReportScreen';
import ProfitLossReportDetailScreen from './Margin/ProfitLossReport/ProfitLossReportDetailScreen';
import WalletLedgerScreen from './Margin/WalletLedger/WalletLedgerScreen';
import WalletLedgerListScreen from './Margin/WalletLedger/WalletLedgerListScreen';

import LimitConfigListScreen from './Wallet/LimitConfiguration/LimitConfigListScreen';
import LimitConfigAddEditScreen from './Wallet/LimitConfiguration/LimitConfigAddEditScreen';

import StakingConfigListScreen from './Wallet/StakingConfiguration/StakingConfigListScreen';
import StakingPolicyListScreen from './Wallet/StakingConfiguration/StakingPolicyListScreen';
import AddEditStakingConfigScreen from './Wallet/StakingConfiguration/AddEditStakingConfigScreen';
import AddEditStakingPolicyScreen from './Wallet/StakingConfiguration/AddEditStakingPolicyScreen';

import AddressGenrationRoute from './Wallet/AddressGenrationRoute/AddressGenrationRoute';
import ChargeConfigListScreen from './Wallet/ChargeConfiguration/ChargeConfigListScreen';
import ChargeConfigAddEditScreen from './Wallet/ChargeConfiguration/ChargeConfigAddEditScreen';
import ChargeConfigDetailScreen from './Wallet/ChargeConfiguration/ChargeConfigDetailScreen';
import ChargeConfigDetailAddEditScreen from './Wallet/ChargeConfiguration/ChargeConfigDetailAddEditScreen';

import ServiceProviderBalanceListScreen from './Wallet/ServiceProviderBalance/ServiceProviderBalanceListScreen';
import ServiceProviderBalanceScreen from './Wallet/ServiceProviderBalance/ServiceProviderBalanceScreen';
import DepositionIntervalScreen from './Wallet/DepositionInterval/DepositionIntervalScreen';

import ERC223ConfigDashboard from './Wallet/ERC223Configuration/ERC223ConfigDashboard';
import IncreaseTokenSupplyListScreen from './Wallet/ERC223Configuration/IncreaseTokenSupplyListScreen';
import AddIncreTokenSupplyScreen from './Wallet/ERC223Configuration/AddIncreTokenSupplyScreen';
import DestroyBlackFundListScreen from './Wallet/ERC223Configuration/DestroyBlackFundListScreen';
import SetTransferFeeListScreen from './Wallet/ERC223Configuration/SetTransferFeeListScreen';
import SetTransferFeeDetailScreen from './Wallet/ERC223Configuration/SetTransferFeeDetailScreen';
import AddTransferFeeScreen from './Wallet/ERC223Configuration/AddTransferFeeScreen';

//Wallet
import WalletMainDashboard from './Wallet/Dashboard/WalletMainDashboard';
import WalletReportDashboard from './Wallet/Dashboard/WalletReportDashboard';
import WalletUtilitesDashboard from './Wallet/Dashboard/WalletUtilitesDashboard';
import AddressGenrationRouteDetail from './Wallet/AddressGenrationRoute/AddressGenrationRouteDetail';
import AddressGenrationRouteDetailSubScreen from './Wallet/AddressGenrationRoute/AddressGenrationRouteDetailSubScreen';
import AddressGenrationRouteAddEdit from './Wallet/AddressGenrationRoute/AddressGenrationRouteAddEdit';
import AdminAssetsListScreen from './Wallet/Reports/AdminAssetsListScreen';
import AdminAssetsDetailScreen from './Wallet/Reports/AdminAssetsDetailScreen';
import DepositRouteListScreen from './Wallet/DepositRoute/DepositRouteListScreen';
import AddEditDepositRouteScreen from './Wallet/DepositRoute/AddEditDepositRouteScreen';
import TransactionPolicyListScreen from './Wallet/Policies/TransactionPolicyListScreen';
import TransactionPolicyAddEditScreen from './Wallet/Policies/TransactionPolicyAddEditScreen';
import WalletUsagePolicyListScreen from './Wallet/Policies/WalletUsagePolicyListScreen';
import WalletUsagePolicyAddEditScreen from './Wallet/Policies/WalletUsagePolicyAddEditScreen';
import WithdrawReportScreen from './Wallet/WithdrawReport/WithdrawReportScreen';
import WithdrawReportDetailScreen from './Wallet/WithdrawReport/WithdrawReportDetailScreen';
import WithdrawReconScreen from './Wallet/WithdrawReport/WithdrawReconScreen';
import WalletOrganizationLedgerScreen from './Wallet/Reports/WalletOrganizationLedgerScreen';
import WalletOrganizationLedgerListScreen from './Wallet/Reports/WalletOrganizationLedgerListScreen';
import DaemonAddressScreen from './Wallet/Reports/DaemonAddressScreen';
import TransferInOutListScreen from './Wallet/Reports/TransferInOutListScreen';
import WithdrawalApprovalListScreen from './Wallet/Reports/WithdrawalApprovalListScreen';
import WithdrawalApprovalDetailScreen from './Wallet/Reports/WithdrawalApprovalDetailScreen';
import ChargesCollectedScreen from './Wallet/Reports/ChargesCollectedScreen';
import ChargesCollectedDetailScreen from './Wallet/Reports/ChargesCollectedDetailScreen';
import StackingHistoryScreen from './Wallet/Reports/StackingHistoryScreen';
import StackingHistoryDetailScreen from './Wallet/Reports/StackingHistoryDetailScreen';
import WalletTrnTypesListScreen from './Wallet/WalletTransactionTypes/WalletTrnTypesListScreen';
import AddEditWalletTrnTypesScreen from './Wallet/WalletTransactionTypes/AddEditWalletTrnTypesScreen';
import UserAddressScreen from './Wallet/UserAddress/UserAddressScreen';
import UserAddressAddScreen from './Wallet/UserAddress/UserAddressAddScreen';
import RoleWiseTransactionTypesScreen from './Wallet/RoleWiseTransactionType/RoleWiseTransactionTypesScreen';
import RoleWiseTransasctionTypeAddScreen from './Wallet/RoleWiseTransactionType/RoleWiseTransasctionTypeAddScreen';
import DepositReportScreen from './Wallet/DepositReport/DepositReportScreen';
import DepositReportDetailScreen from './Wallet/DepositReport/DepositReportDetailScreen';
import DepositReconListScreen from './Wallet/DepositReport/DepositReconListScreen';
import DepositReconScreen from './Wallet/DepositReport/DepositReconScreen';
import UnstakingRequestsScreen from './Wallet/UnstakingRequest/UnstakingRequestsScreen';
import UserWalletListScreen from './Wallet/UserWallet/UserWalletListScreen';
import UserWalletsDetailScreen from './Wallet/UserWallet/UserWalletsDetailScreen';
import AuthUserAndWalletLedgerListScreen from './Wallet/UserWallet/AuthUserAndWalletLedgerListScreen';
import UnstakingRequestsDetailScreen from './Wallet/UnstakingRequest/UnstakingRequestsDetailScreen';
import WalletTypesScreen from './Wallet/WalletTypes/WalletTypesScreen';
import WalletTypesAddEditScreen from './Wallet/WalletTypes/WalletTypesAddEditScreen';
import WalletTypesDetailScreen from './Wallet/WalletTypes/WalletTypesDetailScreen';
import WalletMemberListScreen from './Wallet/WalletMember/WalletMemberListScreen';
import TokenTransferScreen from './Wallet/TokenTransfer/TokenTransferScreen';
import TokenTransferDetailScreen from './Wallet/TokenTransfer/TokenTransferDetailScreen';
import TokenTransferAddScreen from './Wallet/TokenTransfer/TokenTransferAddScreen';

// Arbitrage
import ArbitrageMainDashboard from './Arbitrage/Dashboard/ArbitrageMainDashboard';
import ArbitrageConfigurationDashboard from './Arbitrage/Dashboard/ArbitrageConfigurationDashboard';
import ArbitragePortfolioDashboard from './Arbitrage/Dashboard/ArbitragePortfolioDashboard';
import ProviderWalletListScreen from './Arbitrage/ProviderWallet/ProviderWalletListScreen';
import ArbitrageExchangeBalScreen from './Arbitrage/ArbitrageExchangeBalance/ArbitrageExchangeBalScreen';
import ArbitrageExchangeBalListScreen from './Arbitrage/ArbitrageExchangeBalance/ArbitrageExchangeBalListScreen';
import ConflictHistoryScreen from './Arbitrage/ConflictHistory/ConflictHistoryScreen';
import ConflictReconScreen from './Arbitrage/ConflictHistory/ConflictReconScreen';
import ProviderLedgerScreen from './Arbitrage/ProviderLedger/ProviderLedgerScreen';
import ProviderLedgerListScreen from './Arbitrage/ProviderLedger/ProviderLedgerListScreen';
import ProfileConfigAddEditScreen from './MyAccount/ProfileConfig/ProfileConfigAddEditScreen';
import ProfileConfigAddEditDetailScreen from './MyAccount/ProfileConfig/ProfileConfigAddEditDetailScreen';
import ProfileConfigdDetailSubAddEdit from './MyAccount/ProfileConfig/ProfileConfigdDetailSubAddEdit';
import ServiceProviderList from './Arbitrage/ArbitrageExchangeConfiguration/ServiceProviderList'
import AddArbritageServiceProvider from './Arbitrage/ArbitrageExchangeConfiguration/AddArbritageServiceProvider'
import ProviderAddressListScreen from './Arbitrage/ProviderAddress/ProviderAddressListScreen';
import AddEditProviderAddressScreen from './Arbitrage/ProviderAddress/AddEditProviderAddressScreen';
import CurrencyConfigListScreen from './Arbitrage/CurrencyConfiguration/CurrencyConfigListScreen';
import CurrencyConfigDetailScreen from './Arbitrage/CurrencyConfiguration/CurrencyConfigDetailScreen';
import ArbitrageChargeConfigListScreen from './Arbitrage/ChargeConfiguration/ArbitrageChargeConfigListScreen';
import ArbitrageChargeConfigDetailScreen from './Arbitrage/ChargeConfiguration/ArbitrageChargeConfigDetailScreen';
import AddEditArbiChargeConfigDetailScreen from './Arbitrage/ChargeConfiguration/AddEditArbiChargeConfigDetailScreen';
import AddEditArbitrageChargeConfigScreen from './Arbitrage/ChargeConfiguration/AddEditArbitrageChargeConfigScreen';
import ArbiServiceProviderConfigListScreen from './Arbitrage/ArbitageServiceProviderConfiguration/ArbiServiceProviderConfigListScreen';
import ArbiServiceProviderConfigAddEditScreen from './Arbitrage/ArbitageServiceProviderConfiguration/ArbiServiceProviderConfigAddEditScreen';
import UserTradeListScreen from './Arbitrage/UserTrade/UserTradeListScreen';
import UserTradeListDetailScreen from './Arbitrage/UserTrade/UserTradeListDetailScreen';
import ArbitrageApiRequestListScreen from './Arbitrage/ArbitrageApiRequest/ArbitrageApiRequestListScreen';
import ArbitrageApiRequestDetailScreen from './Arbitrage/ArbitrageApiRequest/ArbitrageApiRequestDetailScreen';
import ArbitrageApiRequestAddEditScreen from './Arbitrage/ArbitrageApiRequest/ArbitrageApiRequestAddEditScreen';
import TopupHistoryListScreen from './Arbitrage/TopupHistory/TopupHistoryListScreen';
import TopupHistoryAddScreen from './Arbitrage/TopupHistory/TopupHistoryAddScreen';
import ArbitrageApiResponseListScreen from './Arbitrage/ArbitrageApiResponse/ArbitrageApiResponseListScreen';
import ArbitrageApiResponseDetailsScreen from './Arbitrage/ArbitrageApiResponse/ArbitrageApiResponseDetailsScreen';
import ArbitrageApiResponseAddEditScreen from './Arbitrage/ArbitrageApiResponse/ArbitrageApiResponseAddEditScreen';
import ArbitrageLpChargeConfigListScreen from './Arbitrage/ArbitrageLpChargeConfiguration/ArbitrageLpChargeConfigListScreen';
import ArbitrageLpChargeConfigAddEditScreen from './Arbitrage/ArbitrageLpChargeConfiguration/ArbitrageLpChargeConfigAddEditScreen';
import InitialBalanceConfigListScreen from './Arbitrage/InitialBalanceConfiguration/InitialBalanceConfigListScreen';
import AddInitialBalanceScreen from './Arbitrage/InitialBalanceConfiguration/AddInitialBalanceScreen';
import ArbitrageLpChargeConfigDetailAddEditScreen from './Arbitrage/ArbitrageLpChargeConfiguration/ArbitrageLpChargeConfigDetailAddEditScreen';
import ArbitrageLpChargeConfigDetailScreen from './Arbitrage/ArbitrageLpChargeConfiguration/ArbitrageLpChargeConfigDetailScreen';
import AllowOrderTypeListScreen from './Arbitrage/ArbitrageExchangeConfiguration/AllowOrderTypeListScreen';
import ArbitrageManageMarketListScreen from './Arbitrage/ArbitrageManageMarket/ArbitrageManageMarketListScreen';
import ArbitrageAddNewCurrencyScreen from './Arbitrage/ArbitrageManageMarket/ArbitrageAddNewCurrencyScreen';
import ArbiPairConfigListScreen from './Arbitrage/ArbitragePairConfiguration/ArbiPairConfigListScreen';
import ArbiPairConfigListDetailScreen from './Arbitrage/ArbitragePairConfiguration/ArbiPairConfigListDetailScreen';
import ArbiPairConfigAddEditScreen from './Arbitrage/ArbitragePairConfiguration/ArbiPairConfigAddEditScreen';
import ArbiTradeReconListScreen from './Arbitrage/TradeRecon/ArbiTradeReconListScreen';
import ArbiTradeReconListDetailScreen from './Arbitrage/TradeRecon/ArbiTradeReconListDetailScreen';
import ArbiTradeReconSetScreen from './Arbitrage/TradeRecon/ArbiTradeReconSetScreen';
import ArbitrageCoinConfigurationListScreen from './Arbitrage/ArbitrageCoinConfiguration/ArbitrageCoinConfigurationListScreen';
import ArbitrageCoinConfigurationDetailScreen from './Arbitrage/ArbitrageCoinConfiguration/ArbitrageCoinConfigurationDetailScreen';
import ArbitrageCoinConfigurationAddEditScreen from './Arbitrage/ArbitrageCoinConfiguration/ArbitrageCoinConfigurationAddEditScreen';
import UserTradeListDetailsDisplayScreen from './Arbitrage/UserTrade/UserTradeListDetailsDisplayScreen';
import UserTradeDisplayDetailsScreen from './Arbitrage/UserTrade/UserTradeDisplayDetailsScreen';
import ArbiUserWalletsListScreen from './Arbitrage/UserWallets/ArbiUserWalletsListScreen';
import ArbiUserWalletsListDetailScreen from './Arbitrage/UserWallets/ArbiUserWalletsListDetailScreen';
import ArbiUserWalletLedgerScreen from './Arbitrage/UserWalletLedger/ArbiUserWalletLedgerScreen';
import ArbiUserWalletLedgerListScreen from './Arbitrage/UserWalletLedger/ArbiUserWalletLedgerListScreen';

// Trading
import MarketMakingListScreen from './trading/MarketMaking/MarketMakingListScreen';
import MessageQueListScreen from './CMS/MessageQue/MessageQueListScreen';
import EmailQueListScreen from './CMS/EmailQue/EmailQueListScreen';
import EmailQueResendEmailScreen from './CMS/EmailQue/EmailQueResendEmailScreen';
import EmailQueMultipleSelection from './CMS/EmailQue/EmailQueMultipleSelection';

import ApiManagerListScreen from './CMS/ApiManager/ApiManagerListScreen';
import ApiManagerListDetailScreen from './CMS/ApiManager/ApiManagerListDetailScreen';
import ApiManagerAddEditScreen from './CMS/ApiManager/ApiManagerAddEditScreen';
import ApiManagerDashboard from './CMS/ApiManager/ApiManagerDashboard';

// API Key Configuration
import ApiKeyMainDashboard from './ApiKeyConfiguration/Dashboard/ApiKeyMainDashboard';
import ApiPlanConfigListScreen from './ApiKeyConfiguration/ApiPlanConfiguration/ApiPlanConfigListScreen';
import ApiPlanConfigDetailScreen from './ApiKeyConfiguration/ApiPlanConfiguration/ApiPlanConfigDetailScreen';
import AddApiPlanConfigScreen from './ApiKeyConfiguration/ApiPlanConfiguration/AddApiPlanConfigScreen';
import EditApiPlanConfigScreen from './ApiKeyConfiguration/ApiPlanConfiguration/EditApiPlanConfigScreen';
import ApiPlanSubscriptionHistory from './ApiKeyConfiguration/ApiPlanSubscriptionHistory/ApiPlanSubscriptionHistory';
import ApiPlanSubscriptionHistoryDetail from './ApiKeyConfiguration/ApiPlanSubscriptionHistory/ApiPlanSubscriptionHistoryDetail';
import ApiPlanConfigurationHistoryScreen from './ApiKeyConfiguration/ApiPlanConfigurationHistory/ApiPlanConfigurationHistoryScreen';
import ApiPlanConfigurationHistoryDetailScreen from './ApiKeyConfiguration/ApiPlanConfigurationHistory/ApiPlanConfigurationHistoryDetailScreen';
import ApiKeyConfigHistory from './ApiKeyConfiguration/ApiKeyConfigurationHistory/ApiKeyConfigHistory';
import ApiKeyConfigHistoryDetail from './ApiKeyConfiguration/ApiKeyConfigurationHistory/ApiKeyConfigHistoryDetail';
import RequestFormatApiListScreen from './CMS/RequestFormatApi/RequestFormatApiListScreen';
import RequestFormatApiListDetailScreen from './CMS/RequestFormatApi/RequestFormatApiListDetailScreen';
import RequestFormatApiAddEditScreen from './CMS/RequestFormatApi/RequestFormatApiAddEditScreen';
import IpWiseRequestReportScreen from './ApiKeyConfiguration/IpWiseRequestReport/IpWiseRequestReportScreen';
import ApiKeyPolicySettingScreen from './ApiKeyConfiguration/ApiKeyPolicySetting/ApiKeyPolicySettingScreen';

import ActiveIpAddressReportListScreen from './ApiKeyConfiguration/IpAndApiAddressWiseReports/ActiveIpAddressReportListScreen';
import ActiveIpAddressReportListDetailScreen from './ApiKeyConfiguration/IpAndApiAddressWiseReports/ActiveIpAddressReportListDetailScreen';
import UsedApiWiseReportListScreen from './ApiKeyConfiguration/IpAndApiAddressWiseReports/UsedApiWiseReportListScreen';
import UsedApiWiseReportListDetailScreen from './ApiKeyConfiguration/IpAndApiAddressWiseReports/UsedApiWiseReportListDetailScreen';

import ListApiMethodScreen from './ApiKeyConfiguration/ApiMethod/ListApiMethodScreen';
import ListApiMethodDetailScreen from './ApiKeyConfiguration/ApiMethod/ListApiMethodDetailScreen';
import ListApiMethodAddEditScreen from './ApiKeyConfiguration/ApiMethod/ListApiMethodAddEditScreen';
import HttpErrorCodeListScreen from './ApiKeyConfiguration/HttpErrorCode/HttpErrorCodeListScreen';
import AddEditIPWhitelist from './MyAccount/IPWhitelist/AddEditIPWhitelist';
import IPWhitelistScreen from './MyAccount/IPWhitelist/IPWhitelistScreen';
import RoleModuleDetailScreen from './MyAccount/UserManagement/RoleModuleDetailScreen';
import UpdateAssignRoleScreen from './MyAccount/UserManagement/UpdateAssignRoleScreen';
import UnSignedUserRoleAssignScreen from './MyAccount/ManageAccount/UnSignedUserRoleAssignScreen';
import ConflictHistoryDetailScreen from './Arbitrage/ConflictHistory/ConflictHistoryDetailScreen';
import UsersListDetailScreen from './MyAccount/UserManagement/UsersListDetailScreen';
import commonDetailScreen from '../native_theme/components/CommonDetailScreen';
import CountriesListScreen from './CMS/Localization/CountriesListScreen';
import AddEditCountriesScreen from './CMS/Localization/AddEditCountriesScreen';
import StatesListScreen from './CMS/Localization/StatesListScreen';
import AddEditStatesScreen from './CMS/Localization/AddEditStatesScreen';
import CitiesListScreen from './CMS/Localization/CitiesListScreen';
import AddEditCitiesScreen from './CMS/Localization/AddEditCitiesScreen';

const navigationOptions = { header: null };

const MainStack = {
    SplashScreen: { screen: SplashScreen, navigationOptions }, //Needed
    AppIntroScreen: { screen: AppIntroScreen, navigationOptions }, //Needed
    ViewProfile: { screen: ViewProfile, navigationOptions }, //Needed
    UpdateProfile: { screen: UpdateProfile, navigationOptions }, //Needed
    MyAccount: { screen: MyAccount, navigationOptions }, //Needed
    ForgotPasswordComponent: { screen: ForgotPasswordComponent, navigationOptions }, //Needed
    ResetAuthenticationComponent: { screen: ResetAuthenticationComponent, navigationOptions }, //Needed
    Security: { screen: SecurityScreen, navigationOptions }, //Needed
    SettingScreen: { screen: SettingScreen, navigationOptions }, //Needed
    LanguageScreen: { screen: LanguageScreen, navigationOptions }, //Needed
    LanguageFreshScreen: { screen: LanguageFreshScreen, navigationOptions }, //Needed
    ResetPasswordComponent: { screen: ResetPasswordComponent, navigationOptions }, //Needed
    SubMenuScreen: { screen: SubMenuScreen, navigationOptions }, //Needed
    SignUpNormal: { screen: SignUpNormal, navigationOptions }, //Needed
    SignUpWithOtp: { screen: SignUpWithOtp, navigationOptions }, //Needed
    LoginNormalScreen: { screen: LoginNormalScreen, navigationOptions }, //Needed
    QuickLogin: { screen: QuickLoginScreen, navigationOptions }, //Needed
    SignUpNormalSub: { screen: SignUpNormalSub, navigationOptions }, //Needed
    SignUpMobileWithOtp: { screen: SignUpMobileWithOtp, navigationOptions }, //Needed
    SignInEmailWithOtp: { screen: SignInEmailWithOtp, navigationOptions }, //Needed
    SignInMobileWithOtp: { screen: SignInMobileWithOtp, navigationOptions }, //Needed
    GoogleAuthenticatorDownloadApp: { screen: GoogleAuthenticatorDownloadApp, navigationOptions }, //Needed
    GoogleAuthenticatorBackupKey: { screen: GoogleAuthenticatorBackupKey, navigationOptions }, //Needed
    EnableGoogleAuthenticator: { screen: EnableGoogleAuthenticator, navigationOptions }, //Needed
    DisableGoogleAuthenticator: { screen: DisableGoogleAuthenticator, navigationOptions }, //Needed
    VerifyEmailScreen: { screen: VerifyEmailScreen, navigationOptions }, //Needed

    //Widget
    MultipleSelection: { screen: MultipleSelection, navigationOptions }, //Needed

    QuickSignUpScreen: { screen: QuickSignUpScreen, navigationOptions },

    // Back Office

    //Trading Dashboard
    TradingDashboard: { screen: TradingDashboardScreen, navigationOptions },
    TradingDashboardSub: { screen: TradingDashboardSubScreen, navigationOptions },
    TradeSummaryCount: { screen: TradeSummaryCountScreen, navigationOptions },

    //Trading Ledger
    TradingLedgerScreen: { screen: TradingLedgerScreen, navigationOptions },

    //Third Party API Response
    ThirdPartyAPIResponse: { screen: ThirdPartyAPIResponseScreen, navigationOptions },
    AddUpdateThirdPartyAPIResponse: { screen: AddUpdateThirdPartyAPIResponseScreen, navigationOptions },

    //Traindg Market Tickers
    TradingMarketTickers: { screen: TradingMarketTickersScreen, navigationOptions },

    //Trade Routes
    TradeRoutes: { screen: TradeRoutesScreen, navigationOptions },
    AddUpdateTradeRoutes: { screen: AddUpdateTradeRoutesScreen, navigationOptions },

    //Coin Configuration
    CoinConfiguration: { screen: CoinConfigurationScreen, navigationOptions },
    //PairConfigurationDetail: { screen: PairConfigurationDetailScreen, navigationOptions },
    CoinConfigurationAddUpdate: { screen: CoinConfigurationAddUpdateScreen, navigationOptions },
    CoinConfigurationDetailScreen: { screen: CoinConfigurationDetailScreen, navigationOptions },

    //Pair Configuration
    PairConfiguration: { screen: PairConfigurationScreen, navigationOptions },
    PairConfigurationDetail: { screen: PairConfigurationDetailScreen, navigationOptions },
    AddPairConfiguration: { screen: AddPairConfiguration, navigationOptions },

    //Trading Summary New
    UserTradingSummary: { screen: UserTradingSummaryScreen, navigationOptions },
    UserTradingSummaryDetail: { screen: UserTradingSummaryDetailScreen, navigationOptions },
    TradingSummaryScreen: { screen: TradingSummaryScreen, navigationOptions },
    TradingSummaryDetailScreen: { screen: TradingSummaryDetailScreen, navigationOptions },

    //Exchange Feed Configuration
    ExchangeFeedConfig: { screen: ExchangeFeedConfigScreen, navigationOptions },
    ExchangeFeedConfigAdd: { screen: ExchangeFeedConfigAddScreen, navigationOptions },

    //Feed Limit Configuration
    FeedLimitConfig: { screen: FeedLimitConfigScreen, navigationOptions },
    FeedLimitConfigAdd: { screen: FeedLimitConfigAddScreen, navigationOptions },

    //Third Party API Request
    ThirdPartyApiRequest: { screen: ThirdPartyApiRequestScreen, navigationOptions },
    ThirdPartyApiRequestAdd: { screen: ThirdPartyApiRequestAddScreen, navigationOptions },

    //Liquidity API Manager
    LiquidityAPIManager: { screen: LiquidityAPIManager, navigationOptions },
    LiquidityAPIManagerAddEdit: { screen: LiquidityAPIManagerAddEdit, navigationOptions },

    //Manage Markets
    ManageMarket: { screen: ManageMarket, navigationOptions },
    ManageMarketAddEdit: { screen: ManageMarketAddEdit, navigationOptions },

    //Daemon Configuration
    DaemonConfiguration: { screen: DaemonConfigurationScreen, navigationOptions },
    AddEditDaemonConfiguration: { screen: AddEditDemonConfigurationScreen, navigationOptions },

    //Provider Configuration
    ProviderConfiguration: { screen: ProviderConfigurationScreen, navigationOptions },
    AddEditProviderConfiguration: { screen: AddEditProviderConfigurationScreen, navigationOptions },

    //Trading Trade Routing
    TradeRoutingListScreen: { screen: TradeRoutingListScreen, navigationOptions },
    TradeRoutingListDetailScreen: { screen: TradeRoutingListDetailScreen, navigationOptions },

    //Margin Trading
    //Margin Trading Dashboard
    MarginTradingDashboardScreen: { screen: MarginTradingDashboardScreen, navigationOptions },
    MarginTopGainerLoser: { screen: MarginTopGainerLoser, navigationOptions },
    MarginTradingDashboardSub: { screen: MarginTradingDashboardSub, navigationOptions },

    // Referral System
    ReferralSystemDashboard: { screen: ReferralSystemDashboard, navigationOptions },
    SMSAndEmailInviteScreen: { screen: SMSAndEmailInviteScreen, navigationOptions },
    SocialMediaShareScreen: { screen: SocialMediaShareScreen, navigationOptions },

    //rule field
    RuleFieldsListScreen: { screen: RuleFieldsListScreen, navigationOptions },
    AddEditRuleFieldScreen: { screen: AddEditRuleFieldScreen, navigationOptions },

    AddEditIPWhitelist: { screen: AddEditIPWhitelist, navigationOptions },
    IPWhitelistScreen: { screen: IPWhitelistScreen, navigationOptions },
    SecurityDashboard: { screen: SecurityDashboard, navigationOptions },

    ProfileConfigDashboard: { screen: ProfileConfigDashboard, navigationOptions },
    ProfileConfigListScreen: { screen: ProfileConfigListScreen, navigationOptions },
    ProfileConfigListDetailScreen: { screen: ProfileConfigListDetailScreen, navigationOptions },
    ProfileConfigAddEditScreen: { screen: ProfileConfigAddEditScreen, navigationOptions },
    ProfileConfigAddEditDetailScreen: { screen: ProfileConfigAddEditDetailScreen, navigationOptions },
    ProfileConfigdDetailSubAddEdit: { screen: ProfileConfigdDetailSubAddEdit, navigationOptions },

    PasswordPolicyDashboard: { screen: PasswordPolicyDashboard, navigationOptions },
    PasswordPolicyListScreen: { screen: PasswordPolicyListScreen, navigationOptions },
    AddEditPasswordPolicy: { screen: AddEditPasswordPolicy, navigationOptions },

    FollowerProfileConfigScreen: { screen: FollowerProfileConfigScreen, navigationOptions },
    LeaderProfileConfigScreen: { screen: LeaderProfileConfigScreen, navigationOptions },

    SlaSettingDash: { screen: SlaSettingDash, navigationOptions },
    SlaConfigPriorityScreen: { screen: SlaConfigPriorityScreen, navigationOptions },
    AddEditSlaConfigPriority: { screen: AddEditSlaConfigPriority, navigationOptions },

    IpProfilingDash: { screen: IpProfilingDash, navigationOptions },
    AddEditAllowIp: { screen: AddEditAllowIp, navigationOptions },
    ListIpRange: { screen: ListIpRange, navigationOptions },

    LoginHistoryScreen: { screen: LoginHistoryScreen, navigationOptions },
    IpHistoryScreen: { screen: IpHistoryScreen, navigationOptions },

    RewardConfigurationDash: { screen: RewardConfigurationDash, navigationOptions },
    ReferralRewardList: { screen: ReferralRewardList, navigationOptions },
    ReferralRewardListDetail: { screen: ReferralRewardListDetail, navigationOptions },
    AddEditRefferalReward: { screen: AddEditRefferalReward, navigationOptions },

    ActivityLogHistoryList: { screen: ActivityLogHistoryList, navigationOptions },
    ActivityLogHistoryDetail: { screen: ActivityLogHistoryDetail, navigationOptions },

    UserSignUpReportDash: { screen: UserSignUpReportDash, navigationOptions },
    UserSignUpReportList: { screen: UserSignUpReportList, navigationOptions },
    UserSignUpReportDetail: { screen: UserSignUpReportDetail, navigationOptions },

    PersonalInfo: { screen: PersonalInfo, navigationOptions },

    MyAccountDashboard: { screen: MyAccountDashboard, navigationOptions },

    ReportsDashbord: { screen: ReportsDashbord, navigationOptions },

    ManageAccountDasboard: { screen: ManageAccountDasboard, navigationOptions },

    ReferralPayTypeScreen: { screen: ReferralPayTypeScreen, navigationOptions },
    ReferralPayTypeAddScreen: { screen: ReferralPayTypeAddScreen, navigationOptions },

    ReferralChannelTypeScreen: { screen: ReferralChannelTypeScreen, navigationOptions },
    ReferralChannelTypeAddScreen: { screen: ReferralChannelTypeAddScreen, navigationOptions },

    ReferralServiceTypeScreen: { screen: ReferralServiceTypeScreen, navigationOptions },
    ReferralServiceTypeAddScreen: { screen: ReferralServiceTypeAddScreen, navigationOptions },

    ReferralParticipantScreen: { screen: ReferralParticipantScreen, navigationOptions },

    AffliateManagementDashboard: { screen: AffliateManagementDashboard, navigationOptions },
    CommonDashboard: { screen: CommonDashboard, navigationOptions },

    UsersDashboard: { screen: UsersDashboard, navigationOptions },

    DeviceWhitelistScreen: { screen: DeviceWhitelistScreen, navigationOptions },

    // Help And Support
    HelpAndSupportDashboard: { screen: HelpAndSupportDashboard, navigationOptions },
    ComplainReportScreen: { screen: ComplainReportScreen, navigationOptions },
    ComplainReportDetailScreen: { screen: ComplainReportDetailScreen, navigationOptions },
    ReplyComplainScreen: { screen: ReplyComplainScreen, navigationOptions },

    KYCVerifyListScreen: { screen: KYCVerifyListScreen, navigationOptions },
    KYCVerifyListDetailScreen: { screen: KYCVerifyListDetailScreen, navigationOptions },
    RuleModuleScreen: { screen: RuleModuleScreen, navigationOptions },
    AddEditRuleModuleScreen: { screen: AddEditRuleModuleScreen, navigationOptions },
    RuleSubModuleScreen: { screen: RuleSubModuleScreen, navigationOptions },
    AddEditRuleSubModuleScreen: { screen: AddEditRuleSubModuleScreen, navigationOptions },
    RoleModuleScreen: { screen: RoleModuleScreen, navigationOptions },
    AddEditRoleModuleScreen: { screen: AddEditRoleModuleScreen, navigationOptions },
    UserManagementDashboard: { screen: UserManagementDashboard, navigationOptions },
    RuleManagementDashboard: { screen: RuleManagementDashboard, navigationOptions },
    RoleManagementDashboard: { screen: RoleManagementDashboard, navigationOptions },
    RuleModuleDashboard: { screen: RuleModuleDashboard, navigationOptions },
    RuleSubModuleDashboard: { screen: RuleSubModuleDashboard, navigationOptions },
    RuleToolListScreen: { screen: RuleToolListScreen, navigationOptions },
    AddEditRuleToolModuleScreen: { screen: AddEditRuleToolModuleScreen, navigationOptions },
    RuleToolModuleDashboard: { screen: RuleToolModuleDashboard, navigationOptions },
    UsersListScreen: { screen: UsersListScreen, navigationOptions },
    AddEditUserScreen: { screen: AddEditUserScreen, navigationOptions },
    UserAssignRoleScreeen: { screen: UserAssignRoleScreeen, navigationOptions },

    CustomerListScreen: { screen: CustomerListScreen, navigationOptions },
    CustomerListDetailScreen: { screen: CustomerListDetailScreen, navigationOptions },
    CustomerAddScreen: { screen: CustomerAddScreen, navigationOptions },
    CustomerDashboard: { screen: CustomerDashboard, navigationOptions },

    AffliateSignUpReportListScreen: { screen: AffliateSignUpReportListScreen, navigationOptions },
    AffliateSignUpReportDetailScreen: { screen: AffliateSignUpReportDetailScreen, navigationOptions },

    ConvetsListScreen: { screen: ConvetsListScreen, navigationOptions },
    ConvertsListDetailScreen: { screen: ConvertsListDetailScreen, navigationOptions },
    ReferralClickOnReportScreen: { screen: ReferralClickOnReportScreen, navigationOptions },

    AffliateSchemeListScreen: { screen: AffliateSchemeListScreen, navigationOptions },
    AffiliateSchemeAddEditScreen: { screen: AffiliateSchemeAddEditScreen, navigationOptions },

    AffliatePromotionListScreen: { screen: AffliatePromotionListScreen, navigationOptions },
    AffiliatePromotionAddEditScreen: { screen: AffiliatePromotionAddEditScreen, navigationOptions },

    SocialTradingHistoryScreen: { screen: SocialTradingHistoryScreen, navigationOptions },
    SocialTradingHistoryDetailScreen: { screen: SocialTradingHistoryDetailScreen, navigationOptions },
    RoleAssignHistoryScreen: { screen: RoleAssignHistoryScreen, navigationOptions },
    UnSignedUserRoleScreen: { screen: UnSignedUserRoleScreen, navigationOptions },

    //CMS
    ContactUsScreen: { screen: ContactUsScreen, navigationOptions },
    StateMaster: { screen: StateMaster, navigationOptions },
    StateMasterAdd: { screen: StateMasterAdd, navigationOptions },
    CountriesScreen: { screen: CountriesScreen, navigationOptions },
    CountriesAddScreen: { screen: CountriesAddScreen, navigationOptions },
    TemplateScreen: { screen: TemplateScreen, navigationOptions },
    TemplateAddScreen: { screen: TemplateAddScreen, navigationOptions },
    CmsDashBoardScreen: { screen: CmsDashBoardScreen, navigationOptions },

    ChatDashboard: { screen: ChatDashboard, navigationOptions },
    ChatUserList: { screen: ChatUserList, navigationOptions },
    ChatUserListEdit: { screen: ChatUserListEdit, navigationOptions },
    ChatUserHistory: { screen: ChatUserHistory, navigationOptions },
    SendEmailScreen: { screen: SendEmailScreen, navigationOptions },
    MessageQueListScreen: { screen: MessageQueListScreen, navigationOptions },
    EmailQueListScreen: { screen: EmailQueListScreen, navigationOptions },
    EmailQueResendEmailScreen: { screen: EmailQueResendEmailScreen, navigationOptions },
    EmailQueMultipleSelection: { screen: EmailQueMultipleSelection, navigationOptions },

    ReferralInvitesScreen: { screen: ReferralInvitesScreen, navigationOptions },
    SiteTokenConversionReport: { screen: SiteTokenConversionReport, navigationOptions },
    UserCoinListRequestScreen: { screen: UserCoinListRequestScreen, navigationOptions },
    UserCoinListDetailsScreen: { screen: UserCoinListDetailsScreen, navigationOptions },
    CoinListFieldScreen: { screen: CoinListFieldScreen, navigationOptions },
    CoinListRequestDashboard: { screen: CoinListRequestDashboard, navigationOptions },
    SendSmsScreen: { screen: SendSmsScreen, navigationOptions },
    TemplateConfigurationScreen: { screen: TemplateConfigurationScreen, navigationOptions },
    EditTemplateConfigurationScreen: { screen: EditTemplateConfigurationScreen, navigationOptions },

    AffiliateFacebookShareReportScreen: { screen: AffiliateFacebookShareReportScreen, navigationOptions },
    AffiliateTwitterShareReportScreen: { screen: AffiliateTwitterShareReportScreen, navigationOptions },
    AffiliateCommissionReportScreen: { screen: AffiliateCommissionReportScreen, navigationOptions },
    AffiliateCommissionReportDetailScreen: { screen: AffiliateCommissionReportDetailScreen, navigationOptions },
    AffiliateClickOnLinkReportScreen: { screen: AffiliateClickOnLinkReportScreen, navigationOptions },
    AffiliateEmailSentReportScreen: { screen: AffiliateEmailSentReportScreen, navigationOptions },
    AffiliateSmsSentReportScreen: { screen: AffiliateSmsSentReportScreen, navigationOptions },
    AffiliateSchemeTypeListScreen: { screen: AffiliateSchemeTypeListScreen, navigationOptions },
    AffiliateSchemeTypeAddEditScreen: { screen: AffiliateSchemeTypeAddEditScreen, navigationOptions },
    AffiliateSchemeDetailScreen: { screen: AffiliateSchemeDetailScreen, navigationOptions },
    AffiliateSchemeDetailAddEditScreen: { screen: AffiliateSchemeDetailAddEditScreen, navigationOptions },
    AffiliateSchemeTypeMappingScreen: { screen: AffiliateSchemeTypeMappingScreen, navigationOptions },
    AffiliateSchemeTypeMappingAddEditScreen: { screen: AffiliateSchemeTypeMappingAddEditScreen, navigationOptions },
    AffiliateSchemeTypeMappingDetailScreen: { screen: AffiliateSchemeTypeMappingDetailScreen, navigationOptions },
    AffliateReportsDashboard: { screen: AffliateReportsDashboard, navigationOptions },
    ProviderBalCheckScreen: { screen: ProviderBalCheckScreen, navigationOptions },
    ProviderBalCheckListScreen: { screen: ProviderBalCheckListScreen, navigationOptions },

    MainScreen: { screen: MainScreen, navigationOptions },

    SiteTokenScreen: { screen: SiteTokenScreen, navigationOptions },
    SiteTokenAddEditScreen: { screen: SiteTokenAddEditScreen, navigationOptions },

    ServiceProviderScreen: { screen: ServiceProviderScreen, navigationOptions },
    ServiceProviderAddScreen: { screen: ServiceProviderAddScreen, navigationOptions },

    MarginTradingMarketTickersScreen: { screen: MarginTradingMarketTickersScreen, navigationOptions },

    MarginManageMarket: { screen: MarginManageMarket, navigationOptions },
    MarginManageMarketAdd: { screen: MarginManageMarketAdd, navigationOptions },

    LeverageRequestListScreen: { screen: LeverageRequestListScreen, navigationOptions },
    LeverageRequestDetailScreen: { screen: LeverageRequestDetailScreen, navigationOptions },
    LevarageReportScreen: { screen: LevarageReportScreen, navigationOptions },
    LevarageReportDetailScreen: { screen: LevarageReportDetailScreen, navigationOptions },
    LeverageConfigListScreen: { screen: LeverageConfigListScreen, navigationOptions },
    AddEditLeverageConfigScreen: { screen: AddEditLeverageConfigScreen, navigationOptions },

    OpenPositionListScreen: { screen: OpenPositionListScreen, navigationOptions },
    OpenPositionReportDetailScreen: { screen: OpenPositionReportDetailScreen, navigationOptions },
    WalletLedgerScreen: { screen: WalletLedgerScreen, navigationOptions },
    WalletLedgerListScreen: { screen: WalletLedgerListScreen, navigationOptions },

    ProfitLossReportScreen: { screen: ProfitLossReportScreen, navigationOptions },
    ProfitLossReportDetailScreen: { screen: ProfitLossReportDetailScreen, navigationOptions },

    // Wallet
    LimitConfigListScreen: { screen: LimitConfigListScreen, navigationOptions },
    StakingConfigListScreen: { screen: StakingConfigListScreen, navigationOptions },
    AddEditStakingConfigScreen: { screen: AddEditStakingConfigScreen, navigationOptions },
    AddEditStakingPolicyScreen: { screen: AddEditStakingPolicyScreen, navigationOptions },
    StakingPolicyListScreen: { screen: StakingPolicyListScreen, navigationOptions },
    AddressGenrationRoute: { screen: AddressGenrationRoute, navigationOptions },
    ChargeConfigListScreen: { screen: ChargeConfigListScreen, navigationOptions },
    LimitConfigAddEditScreen: { screen: LimitConfigAddEditScreen, navigationOptions },
    ChargeConfigAddEditScreen: { screen: ChargeConfigAddEditScreen, navigationOptions },
    ChargeConfigDetailScreen: { screen: ChargeConfigDetailScreen, navigationOptions },
    ChargeConfigDetailAddEditScreen: { screen: ChargeConfigDetailAddEditScreen, navigationOptions },
    ServiceProviderBalanceListScreen: { screen: ServiceProviderBalanceListScreen, navigationOptions },
    ServiceProviderBalanceScreen: { screen: ServiceProviderBalanceScreen, navigationOptions },
    DepositionIntervalScreen: { screen: DepositionIntervalScreen, navigationOptions },
    ERC223ConfigDashboard: { screen: ERC223ConfigDashboard, navigationOptions },
    IncreaseTokenSupplyListScreen: { screen: IncreaseTokenSupplyListScreen, navigationOptions },
    AddIncreTokenSupplyScreen: { screen: AddIncreTokenSupplyScreen, navigationOptions },
    DestroyBlackFundListScreen: { screen: DestroyBlackFundListScreen, navigationOptions },
    SetTransferFeeListScreen: { screen: SetTransferFeeListScreen, navigationOptions },
    SetTransferFeeDetailScreen: { screen: SetTransferFeeDetailScreen, navigationOptions },
    AddTransferFeeScreen: { screen: AddTransferFeeScreen, navigationOptions },
    WalletMainDashboard: { screen: WalletMainDashboard, navigationOptions },
    WalletReportDashboard: { screen: WalletReportDashboard, navigationOptions },
    WalletUtilitesDashboard: { screen: WalletUtilitesDashboard, navigationOptions },
    AddressGenrationRouteDetail: { screen: AddressGenrationRouteDetail, navigationOptions },
    AddressGenrationRouteDetailSubScreen: { screen: AddressGenrationRouteDetailSubScreen, navigationOptions },
    AddressGenrationRouteAddEdit: { screen: AddressGenrationRouteAddEdit, navigationOptions },
    AdminAssetsListScreen: { screen: AdminAssetsListScreen, navigationOptions },
    AdminAssetsDetailScreen: { screen: AdminAssetsDetailScreen, navigationOptions },
    DepositRouteListScreen: { screen: DepositRouteListScreen, navigationOptions },
    AddEditDepositRouteScreen: { screen: AddEditDepositRouteScreen, navigationOptions },
    TransactionPolicyListScreen: { screen: TransactionPolicyListScreen, navigationOptions },
    TransactionPolicyAddEditScreen: { screen: TransactionPolicyAddEditScreen, navigationOptions },
    WalletUsagePolicyListScreen: { screen: WalletUsagePolicyListScreen, navigationOptions },
    WalletUsagePolicyAddEditScreen: { screen: WalletUsagePolicyAddEditScreen, navigationOptions },
    WithdrawReportScreen: { screen: WithdrawReportScreen, navigationOptions },
    WithdrawReportDetailScreen: { screen: WithdrawReportDetailScreen, navigationOptions },
    WithdrawReconScreen: { screen: WithdrawReconScreen, navigationOptions },
    WalletOrganizationLedgerScreen: { screen: WalletOrganizationLedgerScreen, navigationOptions },
    WalletOrganizationLedgerListScreen: { screen: WalletOrganizationLedgerListScreen, navigationOptions },
    DaemonAddressScreen: { screen: DaemonAddressScreen, navigationOptions },
    TransferInOutListScreen: { screen: TransferInOutListScreen, navigationOptions },
    WithdrawalApprovalListScreen: { screen: WithdrawalApprovalListScreen, navigationOptions },
    WithdrawalApprovalDetailScreen: { screen: WithdrawalApprovalDetailScreen, navigationOptions },
    ChargesCollectedScreen: { screen: ChargesCollectedScreen, navigationOptions },
    ChargesCollectedDetailScreen: { screen: ChargesCollectedDetailScreen, navigationOptions },
    StackingHistoryScreen: { screen: StackingHistoryScreen, navigationOptions },
    StackingHistoryDetailScreen: { screen: StackingHistoryDetailScreen, navigationOptions },
    WalletTrnTypesListScreen: { screen: WalletTrnTypesListScreen, navigationOptions },
    AddEditWalletTrnTypesScreen: { screen: AddEditWalletTrnTypesScreen, navigationOptions },
    UserAddressScreen: { screen: UserAddressScreen, navigationOptions },
    UserAddressAddScreen: { screen: UserAddressAddScreen, navigationOptions },
    RoleWiseTransactionTypesScreen: { screen: RoleWiseTransactionTypesScreen, navigationOptions },
    RoleWiseTransasctionTypeAddScreen: { screen: RoleWiseTransasctionTypeAddScreen, navigationOptions },
    DepositReportScreen: { screen: DepositReportScreen, navigationOptions },
    DepositReportDetailScreen: { screen: DepositReportDetailScreen, navigationOptions },
    DepositReconListScreen: { screen: DepositReconListScreen, navigationOptions },
    DepositReconScreen: { screen: DepositReconScreen, navigationOptions },
    UnstakingRequestsScreen: { screen: UnstakingRequestsScreen, navigationOptions },
    UnstakingRequestsDetailScreen: { screen: UnstakingRequestsDetailScreen, navigationOptions },
    UserWalletListScreen: { screen: UserWalletListScreen, navigationOptions },
    UserWalletsDetailScreen: { screen: UserWalletsDetailScreen, navigationOptions },
    AuthUserAndWalletLedgerListScreen: { screen: AuthUserAndWalletLedgerListScreen, navigationOptions },
    WalletTypesScreen: { screen: WalletTypesScreen, navigationOptions },
    WalletTypesAddEditScreen: { screen: WalletTypesAddEditScreen, navigationOptions },
    WalletTypesDetailScreen: { screen: WalletTypesDetailScreen, navigationOptions },
    WalletMemberListScreen: { screen: WalletMemberListScreen, navigationOptions },
    TokenTransferScreen: { screen: TokenTransferScreen, navigationOptions },
    TokenTransferDetailScreen: { screen: TokenTransferDetailScreen, navigationOptions },
    TokenTransferAddScreen: { screen: TokenTransferAddScreen, navigationOptions },

    // Arbitrage
    ArbitrageMainDashboard: { screen: ArbitrageMainDashboard, navigationOptions },
    ArbitrageConfigurationDashboard: { screen: ArbitrageConfigurationDashboard, navigationOptions },
    ArbitragePortfolioDashboard: { screen: ArbitragePortfolioDashboard, navigationOptions },
    ProviderWalletListScreen: { screen: ProviderWalletListScreen, navigationOptions },
    ArbitrageExchangeBalScreen: { screen: ArbitrageExchangeBalScreen, navigationOptions },
    ArbitrageExchangeBalListScreen: { screen: ArbitrageExchangeBalListScreen, navigationOptions },
    ConflictHistoryScreen: { screen: ConflictHistoryScreen, navigationOptions },
    ConflictReconScreen: { screen: ConflictReconScreen, navigationOptions },
    ProviderLedgerScreen: { screen: ProviderLedgerScreen, navigationOptions },
    ProviderLedgerListScreen: { screen: ProviderLedgerListScreen, navigationOptions },
    ServiceProviderList: { screen: ServiceProviderList, navigationOptions },
    AddArbritageServiceProvider: { screen: AddArbritageServiceProvider, navigationOptions },
    ProviderAddressListScreen: { screen: ProviderAddressListScreen, navigationOptions },
    AddEditProviderAddressScreen: { screen: AddEditProviderAddressScreen, navigationOptions },
    CurrencyConfigListScreen: { screen: CurrencyConfigListScreen, navigationOptions },
    CurrencyConfigDetailScreen: { screen: CurrencyConfigDetailScreen, navigationOptions },
    ArbitrageChargeConfigListScreen: { screen: ArbitrageChargeConfigListScreen, navigationOptions },
    AddEditArbitrageChargeConfigScreen: { screen: AddEditArbitrageChargeConfigScreen, navigationOptions },
    ArbitrageChargeConfigDetailScreen: { screen: ArbitrageChargeConfigDetailScreen, navigationOptions },
    AddEditArbiChargeConfigDetailScreen: { screen: AddEditArbiChargeConfigDetailScreen, navigationOptions },
    ArbiServiceProviderConfigListScreen: { screen: ArbiServiceProviderConfigListScreen, navigationOptions },
    ArbiServiceProviderConfigAddEditScreen: { screen: ArbiServiceProviderConfigAddEditScreen, navigationOptions },
    UserTradeListScreen: { screen: UserTradeListScreen, navigationOptions },
    UserTradeListDetailScreen: { screen: UserTradeListDetailScreen, navigationOptions },
    ArbitrageApiRequestListScreen: { screen: ArbitrageApiRequestListScreen, navigationOptions },
    ArbitrageApiRequestDetailScreen: { screen: ArbitrageApiRequestDetailScreen, navigationOptions },
    ArbitrageApiRequestAddEditScreen: { screen: ArbitrageApiRequestAddEditScreen, navigationOptions },
    TopupHistoryListScreen: { screen: TopupHistoryListScreen, navigationOptions },
    TopupHistoryAddScreen: { screen: TopupHistoryAddScreen, navigationOptions },
    ArbitrageApiResponseListScreen: { screen: ArbitrageApiResponseListScreen, navigationOptions },
    ArbitrageApiResponseDetailsScreen: { screen: ArbitrageApiResponseDetailsScreen, navigationOptions },
    ArbitrageApiResponseAddEditScreen: { screen: ArbitrageApiResponseAddEditScreen, navigationOptions },
    ArbitrageLpChargeConfigListScreen: { screen: ArbitrageLpChargeConfigListScreen, navigationOptions },
    ArbitrageLpChargeConfigAddEditScreen: { screen: ArbitrageLpChargeConfigAddEditScreen, navigationOptions },
    ArbitrageLpChargeConfigDetailScreen: { screen: ArbitrageLpChargeConfigDetailScreen, navigationOptions },
    ArbitrageLpChargeConfigDetailAddEditScreen: { screen: ArbitrageLpChargeConfigDetailAddEditScreen, navigationOptions },
    InitialBalanceConfigListScreen: { screen: InitialBalanceConfigListScreen, navigationOptions },
    AddInitialBalanceScreen: { screen: AddInitialBalanceScreen, navigationOptions },
    AllowOrderTypeListScreen: { screen: AllowOrderTypeListScreen, navigationOptions },
    ArbitrageManageMarketListScreen: { screen: ArbitrageManageMarketListScreen, navigationOptions },
    ArbitrageAddNewCurrencyScreen: { screen: ArbitrageAddNewCurrencyScreen, navigationOptions },
    ArbiPairConfigListScreen: { screen: ArbiPairConfigListScreen, navigationOptions },
    ArbiPairConfigListDetailScreen: { screen: ArbiPairConfigListDetailScreen, navigationOptions },
    ArbiPairConfigAddEditScreen: { screen: ArbiPairConfigAddEditScreen, navigationOptions },
    ArbiTradeReconListScreen: { screen: ArbiTradeReconListScreen, navigationOptions },
    ArbiTradeReconListDetailScreen: { screen: ArbiTradeReconListDetailScreen, navigationOptions },
    ArbiTradeReconSetScreen: { screen: ArbiTradeReconSetScreen, navigationOptions },
    ArbitrageCoinConfigurationListScreen: { screen: ArbitrageCoinConfigurationListScreen, navigationOptions },
    ArbitrageCoinConfigurationDetailScreen: { screen: ArbitrageCoinConfigurationDetailScreen, navigationOptions },
    ArbitrageCoinConfigurationAddEditScreen: { screen: ArbitrageCoinConfigurationAddEditScreen, navigationOptions },
    UserTradeListDetailsDisplayScreen: { screen: UserTradeListDetailsDisplayScreen, navigationOptions },
    UserTradeDisplayDetailsScreen: { screen: UserTradeDisplayDetailsScreen, navigationOptions },
    ArbiUserWalletsListScreen: { screen: ArbiUserWalletsListScreen, navigationOptions },
    ArbiUserWalletsListDetailScreen: { screen: ArbiUserWalletsListDetailScreen, navigationOptions },
    ArbiUserWalletLedgerScreen: { screen: ArbiUserWalletLedgerScreen, navigationOptions },
    ArbiUserWalletLedgerListScreen: { screen: ArbiUserWalletLedgerListScreen, navigationOptions },

    // Trading
    MarketMakingListScreen: { screen: MarketMakingListScreen, navigationOptions },

    ApiManagerListScreen: { screen: ApiManagerListScreen, navigationOptions },
    ApiManagerListDetailScreen: { screen: ApiManagerListDetailScreen, navigationOptions },
    ApiManagerAddEditScreen: { screen: ApiManagerAddEditScreen, navigationOptions },
    ApiManagerDashboard: { screen: ApiManagerDashboard, navigationOptions },

    // API Key Configuration
    ApiKeyMainDashboard: { screen: ApiKeyMainDashboard, navigationOptions },
    ApiPlanConfigListScreen: { screen: ApiPlanConfigListScreen, navigationOptions },
    ApiPlanConfigDetailScreen: { screen: ApiPlanConfigDetailScreen, navigationOptions },
    AddApiPlanConfigScreen: { screen: AddApiPlanConfigScreen, navigationOptions },
    EditApiPlanConfigScreen: { screen: EditApiPlanConfigScreen, navigationOptions },
    ApiPlanSubscriptionHistory: { screen: ApiPlanSubscriptionHistory, navigationOptions },
    ApiPlanSubscriptionHistoryDetail: { screen: ApiPlanSubscriptionHistoryDetail, navigationOptions },
    ApiPlanConfigurationHistoryScreen: { screen: ApiPlanConfigurationHistoryScreen, navigationOptions },
    ApiPlanConfigurationHistoryDetailScreen: { screen: ApiPlanConfigurationHistoryDetailScreen, navigationOptions },
    ApiKeyConfigHistory: { screen: ApiKeyConfigHistory, navigationOptions },
    ApiKeyConfigHistoryDetail: { screen: ApiKeyConfigHistoryDetail, navigationOptions },
    IpWiseRequestReportScreen: { screen: IpWiseRequestReportScreen, navigationOptions },
    ApiKeyPolicySettingScreen: { screen: ApiKeyPolicySettingScreen, navigationOptions },

    RequestFormatApiListScreen: { screen: RequestFormatApiListScreen, navigationOptions },
    RequestFormatApiListDetailScreen: { screen: RequestFormatApiListDetailScreen, navigationOptions },
    RequestFormatApiAddEditScreen: { screen: RequestFormatApiAddEditScreen, navigationOptions },

    ActiveIpAddressReportListScreen: { screen: ActiveIpAddressReportListScreen, navigationOptions },
    ActiveIpAddressReportListDetailScreen: { screen: ActiveIpAddressReportListDetailScreen, navigationOptions },
    UsedApiWiseReportListScreen: { screen: UsedApiWiseReportListScreen, navigationOptions },
    UsedApiWiseReportListDetailScreen: { screen: UsedApiWiseReportListDetailScreen, navigationOptions },

    ListApiMethodScreen: { screen: ListApiMethodScreen, navigationOptions },
    ListApiMethodDetailScreen: { screen: ListApiMethodDetailScreen, navigationOptions },
    ListApiMethodAddEditScreen: { screen: ListApiMethodAddEditScreen, navigationOptions },

    HttpErrorCodeListScreen: { screen: HttpErrorCodeListScreen, navigationOptions },
    RoleModuleDetailScreen: { screen: RoleModuleDetailScreen, navigationOptions },
    UpdateAssignRoleScreen: { screen: UpdateAssignRoleScreen, navigationOptions },
    UnSignedUserRoleAssignScreen: { screen: UnSignedUserRoleAssignScreen, navigationOptions },
    ConflictHistoryDetailScreen: { screen: ConflictHistoryDetailScreen, navigationOptions },
    UsersListDetailScreen: { screen: UsersListDetailScreen, navigationOptions },
    commonDetailScreen: { screen: commonDetailScreen, navigationOptions },
    
    // Localization
    CountriesListScreen: { screen: CountriesListScreen, navigationOptions },
    AddEditCountriesScreen: { screen: AddEditCountriesScreen, navigationOptions },
    StatesListScreen: { screen: StatesListScreen, navigationOptions },
    AddEditStatesScreen: { screen: AddEditStatesScreen, navigationOptions },
    CitiesListScreen: { screen: CitiesListScreen, navigationOptions },
    AddEditCitiesScreen: { screen: AddEditCitiesScreen, navigationOptions },
    
}

const Screens = {
    MainStack: {
        screen: createStackNavigator(MainStack, {
            transitionConfig: (nav) => handleCustomTransition(nav)
        })
    },
    Modal: { screen: AlertModal, navigationOptions: { gesturesEnabled: false } }
}

const handleCustomTransition = ({ scenes }) => {

    let screenArray = [{ prev: 'TradeRoutingListScreen', next: 'TradeRoutingListDetailScreen' },
    ]

    let isCollapseExpand = configureTransition(scenes, screenArray)
    // Custom transitions go there
    if (isCollapseExpand)
        return collapseExpand();
    else
        return Platform.OS == 'ios' ? fromRight(500) : fromLeft(500);
}

export default Screens;