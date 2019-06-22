import { combineReducers } from 'redux';
import nav from './navigationReducer'
import tradeData from './TradeReducer';
import marginTradeReducer from './MarginTradeReducer';
import DepositReducer from './DepositReducer';
import WithdrawReducer from './WithdrawReducer';
import AboutUsReducer from './AboutUsReducer';
import ContactUsReducer from './ContactUsReducer';
import NewsSectionReducer from './NewsSectionReducer'
import TransferInOutReducer from './TransferInOutReducer'
import recentOrderReducer from './Trade/RecentOrderReducer';
import SiteTokenConversionReducer from './SiteTokenConversionReducer';
import LimitControlReducer from './LimitControlReducer';
import TokenStackingReducer from './TokenStackingReducer';
import AddressManagementReducer from './AddressManagementReducer';
import RefereEarnReducer from './RefereEarnReducer';
import AnnouncementReducer from './AnnouncementReducer';
import FAQReducer from './FAQReducer';
import SignUpReducer from './signUpReducer'
import loginReducer from './loginReducer';
import ForgotPasswordReducer from './ForgotPasswordReducer';
import LoginHistoryReducer from './LoginHistoryReducer';
import IpHistoryReducer from './IpHistoryReducer';
import ResetPasswordReducer from './ResetPasswordReducer';
import ipWhiteListReducer from './IPWhiteListReducer';
import DeviceHistoryReducer from './DeviceHistoryReducer';
import complainReducer from './ComplainReducer';
import MembershipLevelReducer from './MembershipLevelReducer';
import PageContentAppReducer from './PageContentAppReducer';
import EditProfileReducer from './EditProfileReducer';
import FundViewReducer from './FundViewReducer';
import EnableGoogleAuthReducer from './EnableGoogleAuthReducer';
import DisableGoogleAuthReducer from './DisableGoogleAuthReducer';
import favouriteReducer from './Trade/FavouriteReducer';
import UserLedgerReducer from './UserLedgerReducer';
import CoinReducer from './FetchCoinReducer'
import CoinlistReducer from './CoinlistReducer';
import tokenReducer from './AuthorizeTokenReducer';
import preference from './PreferenceReducer';
import notificationReducer from './NotificationReducer';
import ChatReducer from './ChatReducer';
import KYCReducer from './KYCReducer';
import SocialProfileReducer from './SocialProfileReducer'
import AppSettingsReducer from './AppSettingsReducer'
import marketTickerReducer from './Trade/MarketTickersReducer';
import topGainerReducer from './Trade/TopGainerReducer';
import topLoserReducer from './Trade/TopLoserReducer';
import topGainerLoserReducer from './Trade/TopGainerLoserReducer';
import marketDepthReducer from './Trade/MarketDepthReducer';
import ActivityLogReducer from './ActivityLogReducer';
import tradeSettledReducer from './Trade/TradeSettledReducer';
import pairListReducer from './PairListReducer';
import MyWalletReducer from './MyWalletReducer';
import CoinListRequestReducer from './CoinListRequestReducer'
import SurveyReducer from './SurveyReducer';
import HelpCenterReducer from './HelpCenterReducer';
import AffiliateSignUpReducer from './AffiliateSignUpReducer';
import AffiliateReducer from './AffiliateReducer';
import LeaderBoardReducer from './LeaderBoardReducer';
import chargeListReducer from './Trade/ChargeListReducer';
import MarginWalletLedgerReducer from './MarginWalletLedgerReducer';
import MarginWalletListReducer from './MarginWalletListReducer';
import LeverageReportReducer from './LeverageReportReducer';
import ApiPlanListReducer from './ApiPlanListReducer';
import ApiKeyReducer from './ApiKeyReducer';
import ReferralSystemCountReducer from './ReferralSystemCountReducer';
import buyerBookReducer from './Trade/BuyerBookReducer';
import sellerBookReducer from './Trade/SellerBookReducer';
import marketCapReducer from './Trade/MarketCapReducer';
import openOrderReducer from './Trade/OpenOrderReducer';
import orderHistoryReducer from './Trade/OrderHistoryReducer';
import tradeWalletReducer from './Trade/TradeWalletReducer';
import pairRatesReducer from './Trade/PairRatesReducer';
import buySellTradeReducer from './Trade/BuySellTradeReducer';
import ApiKeyDeleteReducer from '../reducers/ApiKey/ApiKeyDeleteReducer';
import globalMarketTradeReducer from '../reducers/Trade/GlobalMarketTradeReducer';
import tradeChartReducer from '../reducers/Trade/TradeChartReducer';
import FeesReducer from '../reducers/Fees/FeesReducer';
import AddCurrencyLogoReducer from './AddCurrencyLogoReducer';
import AffiliateInvitefriendReducer from './AffiliateInvitefriendReducer';
import cacheReducer from './CacheReducer';
import MarginProfitLossReportReducer from './MarginProfitLossReportReducer';
import OpenPositionReportReducer from './OpenPositionReportReducer';
import DeleverageReducer from './DeleverageReducer';

const rootFrontReducer = {
    nav,
    preference,
    cacheReducer,
    tradeData,
    marginTradeReducer,
    DepositReducer,
    AboutUsReducer,
    ContactUsReducer,
    WithdrawReducer,
    TransferInOutReducer,
    NewsSectionReducer,
    SiteTokenConversionReducer,
    LimitControlReducer,
    TokenStackingReducer,
    AddressManagementReducer,
    RefereEarnReducer,
    AnnouncementReducer,
    FAQReducer,
    SignUpReducer,
    loginReducer,
    ForgotPasswordReducer,
    LoginHistoryReducer,
    IpHistoryReducer,
    ResetPasswordReducer,
    ipWhiteListReducer,
    DeviceHistoryReducer,
    complainReducer,
    MembershipLevelReducer,
    PageContentAppReducer,
    EditProfileReducer,
    FundViewReducer,
    EnableGoogleAuthReducer,
    DisableGoogleAuthReducer,
    favouriteReducer,
    UserLedgerReducer,
    CoinReducer,
    CoinlistReducer,
    tokenReducer,
    notificationReducer,
    ChatReducer,
    KYCReducer,
    SocialProfileReducer,
    AppSettingsReducer,
    marketTickerReducer,
    topGainerReducer,
    topLoserReducer,
    topGainerLoserReducer,
    marketDepthReducer,
    ActivityLogReducer,
    tradeSettledReducer,
    pairListReducer,
    MyWalletReducer,
    CoinListRequestReducer,
    SurveyReducer,
    HelpCenterReducer,
    AffiliateSignUpReducer,
    AffiliateReducer,
    LeaderBoardReducer,
    chargeListReducer,
    MarginWalletLedgerReducer,
    MarginWalletListReducer,
    LeverageReportReducer,
    ApiPlanListReducer,
    ApiKeyReducer,
    ReferralSystemCountReducer,
    buyerBookReducer,
    sellerBookReducer,
    marketCapReducer,
    openOrderReducer,
    orderHistoryReducer,
    tradeWalletReducer,
    pairRatesReducer,
    buySellTradeReducer,
    ApiKeyDeleteReducer,
    DeleverageReducer,

    //Trade Reducers
    globalMarketTradeReducer,
    tradeChartReducer,
    recentOrderReducer,
    FeesReducer,
    AddCurrencyLogoReducer,
    AffiliateInvitefriendReducer,
    MarginProfitLossReportReducer,
    OpenPositionReportReducer
};

export default rootFrontReducer 