import WithdrawRequest from './Withdraw/WithdrawRequest';
import WithdrawHistory from './Withdraw/WithdrawHistory';
import DepositRequest from './Deposit/Deposit';
import TransferInHistoryResult from './Reports/TransferInHistoryResult';
import DepositHistory from './Deposit/DepositHistory';
import TradingDashboard from './Trading/TradingDashboard';
import MarketPairDetail from './Trading/MarketPairDetail';
import TransferOutHistoryResult from './Reports/TransferOutHistoryResult';
import SplashScreen from './CMS/SplashScreen';
import ListCoinScreen from './CMS/ListCoinScreen';
import CoinInfo from './CMS/CoinInfo';
import PrivacyPolicy from './CMS/PrivacyPolicy';
import RefundPolicy from './CMS/RefundPolicy';
import AboutUs from './CMS/AboutUs';
import FeesAndChargesScreen from './CMS/FeesAndChargesScreen';
import ContactUs from './CMS/ContactUs';
import NewsSection from './CMS/NewsSection';
import NewsSectionDetail from './CMS/NewsSectionDetail';
import MainScreen from './MainBoard/MainScreen';
import MarketListScreen from './Trading/MarketListScreen';
import MarketSearchScreen from './Trading/MarketSearchScreen';
import MyAccount from './CMS/MyAccount';
import SiteTokenConversion from './SiteTokenConversion/SiteTokenConversion';
import SiteTokenConversionHistory from './SiteTokenConversion/SiteTokenConversionHistory';
import LimitControl from './LimitControl/LimitControl';
import TokenStackingScreen from './TokenStacking/TokenStackingScreen'
import TokenStackingHistoryResult from './Reports/TokenStackingHistoryResult'
import AddressWhiteListMainScreen from './AddressManagement/AddressWhitelistMainScreen'
import AddressWhitelistHistoryResult from './Reports/AddressWhitelistHistoryResult'
import FavoriteScreen from './Trading/FavoriteScreen';
import BuySellTradeScreen from './Trading/BuySellTradeScreen';
import BuySellTradeSuccessScreen from './Trading/BuySellTradeSuccessScreen';
import OrderHistory from './Trading/OrderHistory';
import OpenOrder from './Trading/OpenOrder';
import RefereAndEarn from './CMS/RefereAndEarn';
import Announcement from './CMS/Announcement';
import FAQsScreen from './CMS/FAQsScreen';
import AppIntroScreen from './CMS/AppIntroScreen';
import ForgotPasswordComponent from './Login/ForgotPassword';
import IPWhitelistScreen from './Login/IPWhitelistScreen';
import LoginHistoryResult from './Reports/LoginHistoryResult';
import IpHistoryResult from './Reports/IpHistoryResult';
import KYCPersonalInfoScreen from './KYC/KYCPersonalInfoScreen';
import SecurityScreen from './Security/SecurityScreen';
import SettingScreen from './Setting/SettingScreen';
import ResetPasswordComponent from './Login/ResetPassword';
import AccountSubMenu from './CMS/AccountSubMenu';
import UpdateProfileScreen from './CMS/UpdateProfile';
import DeviceWhitelistScreen from './CMS/DeviceWhitelistScreen';
import ComplainScreen from './Reports/ComplainScreen';
import ComplainDetailsScreen from './Reports/ComplainDetailsScreen';
import SignUpNormal from './SignUpProcess/SignUpNormal';
import TermConditionScreen from './CMS/TermConditionScreen'
import ReplyComplainScreen from './CMS/ReplyComplainScreen'
import RaiseComplainScreen from './CMS/RaiseComplainScreen'
import SignUpWithOtp from './SignUpProcess/SignUpWithOtp';
import MembershipLevels from './KYC/MembershipLevels';
import LoginNormalScreen from './Login/LoginNormalScreen';
import SignUpNormalSub from './SignUpProcess/SignUpNormalSub';
import FundViewScreen from './Reports/FundViewScreen';
import ViewProfile from './CMS/ViewProfile';
import LanguageScreen from './Setting/LanguageScreen';
import LanguageFreshScreen from './Setting/LanguageFreshScreen';
import SignUpMobileWithOtp from './SignUpProcess/SignUpMobileWithOtp';
import SignInEmailWithOtp from './Login/SignInEmailWithOtp';
import SignInMobileWithOtp from './Login/SignInMobileWithOtp';
import TermsOfServiceScreen from './CMS/TermsOfServiceScreen';
import LegalStatementScreen from './CMS/LegalStatementScreen';
import ApplicationCenterScreen from './CMS/ApplicationCenterScreen';
import GoogleAuthenticatorDownloadApp from './Security/GoogleAuthenticatorDownloadApp';
import GoogleAuthenticatorBackupKey from './Security/GoogleAuthenticatorBackupKey';
import EnableGoogleAuthenticator from './Security/EnableGoogleAuthenticator';
import DisableGoogleAuthenticator from './Security/DisableGoogleAuthenticator';
import FundDetailScreen from './Reports/FundDetailScreen';
import FundDetailSubScreen from './Reports/FundDetailSubScreen';
import GlobalMarketTradeWidget from './Trading/GlobalMarketTradeWidget'
import RecentOrder from './Trading/RecentOrder'
import UserLedger from './Reports/UserLedger'
import UserLedgerResult from './Reports/UserLedgerResult'
import VerifyEmailScreen from './SignUpProcess/VerifyEmailScreen';
import { MultipleSelection } from '../native_theme/components/MultipleSelection';
import ChatScreen from './CMS/ChatScreen';
import LeaderProfileConfiguration from './SocialProfile/LeaderProfileConfiguration'
import FollowerProfileConfiguration from './SocialProfile/FollowerProfileConfiguration'
import SocialProfileSubscription from './SocialProfile/SocialProfileSubscription'
import TopGainerLoser from './Trading/TopGainerLoser/TopGainerLoser';
import ActivityLogScreen from './Reports/ActivityLogScreen'
import TradingSummaryScreen from './Trading/TradeSummary/TradingSummaryScreen';
import TradingSummaryDetailScreen from './Trading/TradeSummary/TradingSummaryDetailScreen';
import TokenStackingHistoryDetail from './Reports/TokenStackingHistoryDetail'
import TokenStakingDetailScreen from './TokenStacking/TokenStakingDetailScreen'
import ListWallets from './MyWallet/ListWallets';
import ListWalletUser from './MyWallet/ListWalletUser';
import AddNewWalletUser from './MyWallet/AddNewWalletUser';
import AcceptRejectWalletRequest from './MyWallet/AcceptRejectWalletRequest';
import CoinListRequestScreen from './CMS/CoinListRequestScreen';
import LeaderList from './SocialProfile/LeaderList';
import CoinSelectScreen from './Deposit/CoinSelectScreen';
import HelpCenter from './CMS/HelpCenter';
import HelpCenterModule from './CMS/HelpCenterModule';
import LostGoogleAuthWidget from './Widget/LostGoogleAuthWidget';
import SurveyScreen from './CMS/SurveyScreen';
import SurveyMenuScreen from './CMS/SurveyMenuScreen';
import ImageViewWidget from './Widget/ImageViewWidget';
import FollowerList from './SocialProfile/FollowerList';
import MyWatchList from './SocialProfile/MyWatchList';
import LeaderBoardList from './Reports/LeaderBoardList';
import AffiliateSignUp from './Affiliate/AffiliateSignUp';
import AffiliateSignUpMain from './Affiliate/AffiliateSignUpMain';
import AffiliateDashboard from './Affiliate/AffiliateDashboard';
import CommissionPatternScreen from './Affiliate/CommissionPatternScreen';
import PortfolioList from './SocialProfile/PortfolioList';
import PortfolioListDetail from './SocialProfile/PortfolioListDetail';
import SendMailReport from './Affiliate/SendMailReport'
import SendSmsReport from './Affiliate/SendSmsReport';
import FacebookShareReport from './Affiliate/FacebookShareReport';
import TwitterShareReport from './Affiliate/TwitterShareReport';
import SignUpReport from './Affiliate/SignUpReport';
import ClickOnLinkReport from './Affiliate/ClickOnLinkReport';
import CommissionReport from './Affiliate/CommissionReport';
import CommissionReportDetail from './Affiliate/CommissionReportDetail';
import QuickLoginScreen from './Login/QuickLoginScreen'
import MarginWalletLedgerScreen from './Margin/MarginWalletLedgerScreen'
import MarginWalletLedgerDetails from './Margin/MarginWalletLedgerDetails'
import MarginWalletList from './Margin/MarginWalletList'
import MarginWalletListDetail from './Margin/MarginWalletListDetail'
import QuickSignUpScreen from './SignUpProcess/QuickSignUpScreen'
import WithdrawHistoryDetail from './Withdraw/WithdrawHistoryDetail';
import DepositHistoryDetail from './Deposit/DepositHistoryDetail';
import LeverageReport from './Margin/LeverageReport'
import LeverageReportDetail from './Margin/LeverageReportDetail';
import CreateMarginWallet from './Margin/CreateMarginWallet'
import ConfirmMarginWalletScreen from './Margin/ConfirmMarginWalletScreen'
import ApiPlanListScreen from './ApiPlan/ApiPlanListScreen';
import ApiPlanListDetailScreen from './ApiPlan/ApiPlanListDetailScreen';
import MarginOpenOrder from './Margin/trading/MarginOpenOrder';
import MarginMarketPairDetail from './Margin/trading/MarginMarketPairDetail';
import MarginBuySellTradeScreen from './Margin/trading/MarginBuySellTradeScreen';
import MarginMarketListScreen from './Margin/trading/MarginMarketListScreen';
import MarginBuyerSellerBookWidget from './Margin/trading/MarginBuyerSellerBookWidget';
import ApiActivePlanListDetail from './ApiPlan/ApiActivePlanListDetail';
import ManualRenewPlan from './ApiPlan/ManualRenewPlan';
import ReferralInvitesScreen from './Account/ReferralSystem/ReferralInvitesScreen';
import ReferralEmailDataScreen from './Account/ReferralSystem/ReferralEmailDataScreen';
import ReferralParticipantScreen from './Account/ReferralSystem/ReferralParticipantScreen';
import ReferralClickDataScreen from './Account/ReferralSystem/ReferralClickDataScreen';
import ReferralConvertScreen from './Account/ReferralSystem/ReferralConvertScreen';
import AddApiKeyScreen from './ApiKey/AddApiKeyScreen';
import ViewPublicApiKey from './ApiKey/ViewPublicApiKey';
import SetAutoRenewApiPlan from './ApiPlan/SetAutoRenewApiPlan';
import ViewPublicApiKeyDetail from './ApiKey/ViewPublicApiKeyDetail';
import StopAutoRenewApiPlan from './ApiPlan/StopAutoRenewApiPlan';
import AffliateSignUpMain from './Affiliate/AffiliateSignUpMain';
import ApiKeyIpWhitelist from './ApiKey/ApiKeyIpWhitelist';
import SetCustomLimitsForKeys from './ApiPlan/SetCustomLimitsForKeys';
import AddCustomLimitsForKeys from './ApiPlan/AddCustomLimitsForKeys';
import EditCustomLimitsForKeys from './ApiPlan/EditCustomLimitsForKeys';
import AddApiKeySuccessScreen from './ApiKey/AddApiKeySuccessScreen';
import ApiKeyUpdateScreen from './ApiKey/ApiKeyUpdateScreen';
import ApiKeyWhiteListAddScreen from './ApiKey/ApiKeyWhiteListAddScreen';
import DiscoverScreen from './Discover/DiscoverScreen';
import ReferaAndEanProgramDetails from './CMS/ReferaAndEanProgramDetails';
import OrderManagementScreen from './Trading/OrderManagementScreen';
import FeesScreen from './Fees/FeesScreen';
import SocialProfileDashboard from './SocialProfile/SocialProfileDashboard';
import SocialProfileTopGainerWidget from './SocialProfile/SocialProfileTopGainerWidget';
import SocialProfileTopLooserWidget from './SocialProfile/SocialProfileTopLooserWidget';
import MarginOrderManagementScreen from './Margin/trading/MarginOrderManagementScreen';
import AddCurrencyLogo from './Reports/AddCurrencyLogo'
import ApiUpgradeDowngradeScreen from './ApiPlan/ApiUpgradeDowngradeScreen';
import AffiliateInviteFriendScreen from './Affiliate/AffiliateInviteFriendScreen';
import MarginProfitLossReportScreen from './Reports/MarginProfitLossReportScreen';
import OpenPositionReportScreen from './Reports/OpenPositionReportScreen';
import Deleverage from './Margin/Deleverage';
import AlertModal from './AlertModal';

import React from 'react'
import { Platform } from 'react-native';
import { createStackNavigator, createDrawerNavigator } from 'react-navigation';
import { configureTransition } from '../validations/CommonValidation';
import { collapseExpand, fromRight, fromLeft } from '../native_theme/components/NavigationTransition';
import R from '../native_theme/R';
import NavigationDrawer from './MainBoard/NavigationDrawer';

const navigationOptions = { header: null };

const DrawerMenus = createDrawerNavigator(
    {
        Home: {
            screen: MainScreen,
            navigationOptions
        }
    },
    {
        initialRouteName: 'Home',
        contentComponent: NavigationDrawer,
        drawerWidth: R.dimens.drawer_width
    }
);

const MainStack = {
    SplashScreen: { screen: SplashScreen, navigationOptions }, //Needed
    MainScreen: { screen: DrawerMenus, navigationOptions }, //Needed
    CoinInfo: { screen: CoinInfo, navigationOptions }, //Needed
    ListCoinScreen: { screen: ListCoinScreen, navigationOptions }, //Needed
    MarketList: { screen: MarketListScreen, navigationOptions }, //Needed
    MarketSearch: { screen: MarketSearchScreen, navigationOptions }, //Needed
    EditFavorite: { screen: FavoriteScreen, navigationOptions }, //Needed
    BuySellTrade: { screen: BuySellTradeScreen, navigationOptions }, //Needed
    BuySellTradeSuccess: { screen: BuySellTradeSuccessScreen, navigationOptions }, //Needed
    OrderHistory: { screen: OrderHistory, navigationOptions }, //Needed
    OpenOrder: { screen: OpenOrder, navigationOptions }, //Needed
    WithdrawRequest: { screen: WithdrawRequest, navigationOptions }, //Needed
    WithdrawHistory: { screen: WithdrawHistory, navigationOptions }, //Needed
    DepositRequest: { screen: DepositRequest, navigationOptions }, //Needed
    DepositHistory: { screen: DepositHistory, navigationOptions }, //Needed
    TransferInHistoryResult: { screen: TransferInHistoryResult, navigationOptions }, //Needed
    TradingDashboard: { screen: TradingDashboard, navigationOptions }, //Needed
    MarketPairDetail: { screen: MarketPairDetail, navigationOptions }, //Needed
    TransferOutHistoryResult: { screen: TransferOutHistoryResult, navigationOptions }, //Needed
    AboutUs: { screen: AboutUs, navigationOptions },   //Needed
    ContactUs: { screen: ContactUs, navigationOptions }, //Needed
    PrivacyPolicy: { screen: PrivacyPolicy, navigationOptions }, //Needed
    FeesAndChargesScreen: { screen: FeesAndChargesScreen, navigationOptions }, //Needed
    RefundPolicy: { screen: RefundPolicy, navigationOptions }, //Needed
    NewsSection: { screen: NewsSection, navigationOptions }, //Needed
    NewsSectionDetail: { screen: NewsSectionDetail, navigationOptions }, //Needed
    MyAccount: { screen: MyAccount, navigationOptions }, //Needed
    SiteTokenConversion: { screen: SiteTokenConversion, navigationOptions }, //Needed
    SiteTokenConversionHistory: { screen: SiteTokenConversionHistory, navigationOptions }, //Neededs
    LimitControl: { screen: LimitControl, navigationOptions }, //Needed
    TokenStackingScreen: { screen: TokenStackingScreen, navigationOptions }, //Needed
    TokenStackingHistoryResult: { screen: TokenStackingHistoryResult, navigationOptions }, //Needed
    AddreesWhiteListMainScreen: { screen: AddressWhiteListMainScreen, navigationOptions }, //Needed
    AddressWhitelistHistoryResult: { screen: AddressWhitelistHistoryResult, navigationOptions }, //Needed
    RefereAndEarn: { screen: RefereAndEarn, navigationOptions }, //Needed
    Announcement: { screen: Announcement, navigationOptions }, //Needed
    AppIntroScreen: { screen: AppIntroScreen, navigationOptions }, //Needed
    FAQsScreen: { screen: FAQsScreen, navigationOptions }, //Needed
    ForgotPasswordComponent: { screen: ForgotPasswordComponent, navigationOptions }, //Needed
    IPWhitelistScreen: { screen: IPWhitelistScreen, navigationOptions }, //Needed
    LoginHistoryResult: { screen: LoginHistoryResult, navigationOptions }, //Needed
    IpHistoryResult: { screen: IpHistoryResult, navigationOptions }, //Needed
    KYCPersonalInfoScreen: { screen: KYCPersonalInfoScreen, navigationOptions }, //Needed
    Security: { screen: SecurityScreen, navigationOptions }, //Needed
    SettingScreen: { screen: SettingScreen, navigationOptions }, //Needed
    LanguageScreen: { screen: LanguageScreen, navigationOptions }, //Needed
    LanguageFreshScreen: { screen: LanguageFreshScreen, navigationOptions }, //Needed
    ResetPasswordComponent: { screen: ResetPasswordComponent, navigationOptions }, //Needed
    AccountSubMenu: { screen: AccountSubMenu, navigationOptions }, //Needed
    UpdateProfile: { screen: UpdateProfileScreen, navigationOptions }, //Needed
    DeviceWhitelistScreen: { screen: DeviceWhitelistScreen, navigationOptions }, //Needed
    ComplainScreen: { screen: ComplainScreen, navigationOptions }, //Needed
    ComplainDetailsScreen: { screen: ComplainDetailsScreen, navigationOptions }, //Needed
    SignUpNormal: { screen: SignUpNormal, navigationOptions }, //Needed
    TermConditionScreen: { screen: TermConditionScreen, navigationOptions }, //Needed
    ReplyComplainScreen: { screen: ReplyComplainScreen, navigationOptions }, //Needed
    RaiseComplainScreen: { screen: RaiseComplainScreen, navigationOptions }, //Needed
    SignUpWithOtp: { screen: SignUpWithOtp, navigationOptions }, //Needed
    MemberShipLevels: { screen: MembershipLevels, navigationOptions }, //Needed
    LoginNormalScreen: { screen: LoginNormalScreen, navigationOptions }, //Needed
    QuickLogin: { screen: QuickLoginScreen, navigationOptions }, //Needed
    SignUpNormalSub: { screen: SignUpNormalSub, navigationOptions }, //Needed
    FundViewScreen: { screen: FundViewScreen, navigationOptions }, //Needed
    ViewProfile: { screen: ViewProfile, navigationOptions }, //Needed
    SignUpMobileWithOtp: { screen: SignUpMobileWithOtp, navigationOptions }, //Needed
    SignInEmailWithOtp: { screen: SignInEmailWithOtp, navigationOptions }, //Needed
    SignInMobileWithOtp: { screen: SignInMobileWithOtp, navigationOptions }, //Needed
    TermsOfServiceScreen: { screen: TermsOfServiceScreen, navigationOptions }, //Needed
    LegalStatementScreen: { screen: LegalStatementScreen, navigationOptions }, //Needed
    ApplicationCenterScreen: { screen: ApplicationCenterScreen, navigationOptions }, //Needed
    GoogleAuthenticatorDownloadApp: { screen: GoogleAuthenticatorDownloadApp, navigationOptions }, //Needed
    GoogleAuthenticatorBackupKey: { screen: GoogleAuthenticatorBackupKey, navigationOptions }, //Needed
    EnableGoogleAuthenticator: { screen: EnableGoogleAuthenticator, navigationOptions }, //Needed
    DisableGoogleAuthenticator: { screen: DisableGoogleAuthenticator, navigationOptions }, //Needed
    FundDetailScreen: { screen: FundDetailScreen, navigationOptions }, //Needed
    FundDetailSubScreen: { screen: FundDetailSubScreen, navigationOptions }, //Needed
    GlobalMarketTradeWidget: { screen: GlobalMarketTradeWidget, navigationOptions }, //Needed
    RecentOrder: { screen: RecentOrder, navigationOptions }, //Needed 
    UserLedger: { screen: UserLedger, navigationOptions }, //Needed 
    UserLedgerResult: { screen: UserLedgerResult, navigationOptions }, //Needed
    VerifyEmailScreen: { screen: VerifyEmailScreen, navigationOptions }, //Needed
    ChatScreen: { screen: ChatScreen, navigationOptions }, //Needed

    //social profile leader list
    SocialProfileSubscription: { screen: SocialProfileSubscription, navigationOptions }, //Needed - Future
    LeaderProfileConfiguration: { screen: LeaderProfileConfiguration, navigationOptions }, //Needed - Future
    FollowerProfileConfiguration: { screen: FollowerProfileConfiguration, navigationOptions }, //Needed - Future
    LeaderList: { screen: LeaderList, navigationOptions }, //Needed - Future
    SocialProfileDashboard: { screen: SocialProfileDashboard, navigationOptions }, //Needed - Future
    SocialProfileTopGainerWidget: { screen: SocialProfileTopGainerWidget, navigationOptions }, //Needed - Future
    SocialProfileTopLooserWidget: { screen: SocialProfileTopLooserWidget, navigationOptions }, //Needed - Future

    ActivityLogScreen: { screen: ActivityLogScreen, navigationOptions }, // Needed - Future
    TokenStakingDetailScreen: { screen: TokenStakingDetailScreen, navigationOptions }, //Needed
    CoinListRequestScreen: { screen: CoinListRequestScreen, navigationOptions }, //Needed - Future

    //Widget
    MultipleSelection: { screen: MultipleSelection, navigationOptions }, //Needed

    //Top Gainer Loser
    TopGainerLoser: { screen: TopGainerLoser, navigationOptions }, //Needed

    TradingSummary: { screen: TradingSummaryScreen, navigationOptions }, //Needed
    TradingSummaryDetail: { screen: TradingSummaryDetailScreen, navigationOptions }, //Needed
    TokenStackingHistoryDetail: { screen: TokenStackingHistoryDetail, navigationOptions }, //Needed

    ListWallets: { screen: ListWallets, navigationOptions }, //Needed - Future
    ListWalletUser: { screen: ListWalletUser, navigationOptions }, //Needed - Future
    AddNewWalletUser: { screen: AddNewWalletUser, navigationOptions }, //Needed - Future
    AcceptRejectWalletRequest: { screen: AcceptRejectWalletRequest, navigationOptions }, //Needed - Future
    CoinSelectScreen: { screen: CoinSelectScreen, navigationOptions }, //Needed - Future
    HelpCenter: { screen: HelpCenter, navigationOptions },
    HelpCenterModule: { screen: HelpCenterModule, navigationOptions },
    LostGoogleAuthWidget: { screen: LostGoogleAuthWidget, navigationOptions },
    SurveyScreen: { screen: SurveyScreen, navigationOptions },
    SurveyMenuScreen: { screen: SurveyMenuScreen, navigationOptions },
    ImageViewWidget: { screen: ImageViewWidget, navigationOptions },
    FollowerList: { screen: FollowerList, navigationOptions },
    AffiliateSignUp: { screen: AffiliateSignUp, navigationOptions },
    AffiliateSignUpMain: { screen: AffiliateSignUpMain, navigationOptions },
    AffiliateDashboard: { screen: AffiliateDashboard, navigationOptions },
    MyWatchList: { screen: MyWatchList, navigationOptions },
    LeaderBoardList: { screen: LeaderBoardList, navigationOptions },
    CommissionPatternScreen: { screen: CommissionPatternScreen, navigationOptions },

    PortfolioList: { screen: PortfolioList, navigationOptions },
    PortfolioListDetail: { screen: PortfolioListDetail, navigationOptions },
    SendMailReport: { screen: SendMailReport, navigationOptions },
    SendSmsReport: { screen: SendSmsReport, navigationOptions },
    FacebookShareReport: { screen: FacebookShareReport, navigationOptions },
    TwitterShareReport: { screen: TwitterShareReport, navigationOptions },
    SignUpReport: { screen: SignUpReport, navigationOptions },

    ClickOnLinkReport: { screen: ClickOnLinkReport, navigationOptions },
    CommissionReport: { screen: CommissionReport, navigationOptions },
    CommissionReportDetail: { screen: CommissionReportDetail, navigationOptions },
    MarginWalletLedgerScreen: { screen: MarginWalletLedgerScreen, navigationOptions },
    MarginWalletLedgerDetails: { screen: MarginWalletLedgerDetails, navigationOptions },

    MarginWalletList: { screen: MarginWalletList, navigationOptions },
    MarginWalletListDetail: { screen: MarginWalletListDetail, navigationOptions },

    QuickSignUpScreen: { screen: QuickSignUpScreen, navigationOptions },
    WithdrawHistoryDetail: { screen: WithdrawHistoryDetail, navigationOptions }, //Needed
    DepositHistoryDetail: { screen: DepositHistoryDetail, navigationOptions }, //Needed
    LeverageReport: { screen: LeverageReport, navigationOptions },
    LeverageReportDetail: { screen: LeverageReportDetail, navigationOptions },

    CreateMarginWallet: { screen: CreateMarginWallet, navigationOptions },
    ConfirmMarginWalletScreen: { screen: ConfirmMarginWalletScreen, navigationOptions },

    ApiPlanListScreen: { screen: ApiPlanListScreen, navigationOptions },
    ApiPlanListDetailScreen: { screen: ApiPlanListDetailScreen, navigationOptions },
    ApiActivePlanListDetail: { screen: ApiActivePlanListDetail, navigationOptions },
    ManualRenewPlan: { screen: ManualRenewPlan, navigationOptions },
    SetAutoRenewApiPlan: { screen: SetAutoRenewApiPlan, navigationOptions },
    StopAutoRenewApiPlan: { screen: StopAutoRenewApiPlan, navigationOptions },
    SetCustomLimitsForKeys: { screen: SetCustomLimitsForKeys, navigationOptions },
    AddCustomLimitsForKeys: { screen: AddCustomLimitsForKeys, navigationOptions },
    EditCustomLimitsForKeys: { screen: EditCustomLimitsForKeys, navigationOptions },
    ApiUpgradeDowngradeScreen: { screen: ApiUpgradeDowngradeScreen, navigationOptions },

    MarginOpenOrder: { screen: MarginOpenOrder, navigationOptions },
    MarginMarketPairDetail: { screen: MarginMarketPairDetail, navigationOptions },
    MarginBuySellTradeScreen: { screen: MarginBuySellTradeScreen, navigationOptions },
    MarginMarketListScreen: { screen: MarginMarketListScreen, navigationOptions },
    MarginBuyerSellerBookWidget: { screen: MarginBuyerSellerBookWidget, navigationOptions }, //Needed

    ReferralInvitesScreen: { screen: ReferralInvitesScreen, navigationOptions },
    ReferralEmailDataScreen: { screen: ReferralEmailDataScreen, navigationOptions },
    ReferralParticipantScreen: { screen: ReferralParticipantScreen, navigationOptions },
    ReferralClickDataScreen: { screen: ReferralClickDataScreen, navigationOptions },
    ReferralConvertScreen: { screen: ReferralConvertScreen, navigationOptions },

    AddApiKeyScreen: { screen: AddApiKeyScreen, navigationOptions }, //Needed
    ViewPublicApiKey: { screen: ViewPublicApiKey, navigationOptions }, //Neede
    ViewPublicApiKeyDetail: { screen: ViewPublicApiKeyDetail, navigationOptions }, //Needed
    AffliateSignUpMain: { screen: AffliateSignUpMain, navigationOptions },

    ApiKeyIpWhitelist: { screen: ApiKeyIpWhitelist, navigationOptions },

    AddApiKeySuccessScreen: { screen: AddApiKeySuccessScreen, navigationOptions },
    ApiKeyUpdateScreen: { screen: ApiKeyUpdateScreen, navigationOptions },
    ApiKeyWhiteListAddScreen: { screen: ApiKeyWhiteListAddScreen, navigationOptions },

    DiscoverScreen: { screen: DiscoverScreen, navigationOptions },
    ReferaAndEanProgramDetails: { screen: ReferaAndEanProgramDetails, navigationOptions },
    OrderManagementScreen: { screen: OrderManagementScreen, navigationOptions },
    MarginOrderManagementScreen: { screen: MarginOrderManagementScreen, navigationOptions },
    FeesScreen: { screen: FeesScreen, navigationOptions },

    AddCurrencyLogo: { screen: AddCurrencyLogo, navigationOptions },
    AffiliateInviteFriendScreen: { screen: AffiliateInviteFriendScreen, navigationOptions },
    MarginProfitLossReportScreen: { screen: MarginProfitLossReportScreen, navigationOptions },
    OpenPositionReportScreen: { screen: OpenPositionReportScreen, navigationOptions },
    Deleverage: { screen: Deleverage, navigationOptions },
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

    let screenArray = [
        { prev: 'DepositHistory', next: 'DepositHistoryDetail' },
        { prev: 'WithdrawHistory', next: 'WithdrawHistoryDetail' },
        { prev: 'CommissionReport', next: 'CommissionReportDetail' },
        { prev: 'ViewPublicApiKey', next: 'ViewPublicApiKeyDetail' },
        { prev: 'NewsSection', next: 'NewsSectionDetail' },
        { prev: 'MarginWalletList', next: 'MarginWalletListDetail' },
        { prev: 'LeverageReport', next: 'LeverageReportDetail' },
        { prev: 'TokenStackingScreen', next: 'TokenStakingDetailScreen' },
        { prev: 'TokenStackingHistoryResult', next: 'TokenStackingHistoryDetail' },
        { prev: 'SocialProfileDashboard', next: 'PortfolioListDetail' },
        { prev: 'PortfolioList', next: 'PortfolioListDetail' },
        { prev: 'TradingSummary', next: 'TradingSummaryDetail' },
        { prev: 'ListCoinScreen', next: 'CoinInfo' },
        { prev: 'ListWallets', next: 'ListWalletUser' },
        { prev: 'ComplainScreen', next: 'ComplainDetailsScreen' },
        { prev: 'FundDetailScreen', next: 'FundDetailSubScreen' },
    ]

    let isCollapseExpand = configureTransition(scenes, screenArray)
    // Custom transitions go there
    if (isCollapseExpand)
        return collapseExpand();
    else
        return Platform.OS == 'ios' ? fromRight(500) : fromLeft(500);
}


export default Screens;