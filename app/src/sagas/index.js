import { all } from "redux-saga/effects";
import tradeSaga from './Trade/TradeSaga';
import WithdrawSaga from './WithdrawSaga';
import DepositSagas from './DepositSagas';
import TransferInOutSaga from './TransferInOutSaga';
import CommonSaga from './CommonSaga';
import ContactUsSaga from './ContactUsSaga';
import NewsSectionSaga from './NewsSectionSaga';
import SiteTokenConversionSaga from './SiteTokenConversionSaga';
import LimitControlSaga from './LimitControlSaga';
import TokenStackingSaga from './TokenStackingSaga';
import AddressManagementSaga from './AddressManagementSagas';
import RefereEarnSaga from './RefereEarnSaga'
import AnnouncementSaga from './AnnouncementSaga'
import FAQSaga from './FAQSaga'
import SignUpSaga from './signUpSaga'
import loginSaga from './loginSaga'
import ipWhiteListSaga from './IPWhiteListSaga';
import LoginHistorySaga from './LoginHistorySaga';
import IpHistorySaga from './IpHistorySaga';
import ResetPasswordSaga from './ResetPasswordSaga';
import DeviceHistorySaga from "./DeviceHistorySaga";
import Complain from './ComplainSaga';
import MemberShipLevelSaga from './MembershipLevelSaga';
import PageContent from './PageContent';
import EditProfileSaga from './EditProfileSaga';
import ForgotPasswordSaga from './ForgotPasswordSaga';
import EnableGoogleAuthSaga from './EnableGoogleAuthSaga';
import DisableGoogleAuthSaga from './DisableGoogleAuthSaga';
import FundViewSaga from './FundViewSaga';
import favouriteSaga from "./Trade/FavouritesSaga";
import UserLedgerSaga from './UserLedgerSaga'
import CoinlistSaga from './CoinlistSaga'
import tokenSaga from './AuthorizationToken';
import notificationSaga from './NotificationSaga';
import KYCSaga from './KYCSaga';
import SocialProfileSaga from './SocialProfileSaga'
import LanguageSaga from './LanguageSaga';
import marketTickersSaga from './Trade/MarketTickersSaga';
import topGainersDataSaga from './Trade/TopGainersDataSaga';
import topLosersDataSaga from './Trade/TopLosersDataSaga';
import topGainersLosersDataSaga from './Trade/TopGainersLosersDataSaga';
import marketDepthSaga from './Trade/MarketDepthSaga';
import ActivityLogSaga from './ActivityLogSaga';
import tradeSettledSaga from './Trade/TradeSettledSaga';
import pairListSaga from './PairListSaga';
import MyWalletSaga from './MyWalletSaga';
import CoinListRequestSaga from './CoinListRequestSaga';
import SurveySaga from './SurveySaga';
import HelpCenterSaga from './HelpCenterSaga';
import AffiliateSignUpSaga from './AffiliateSignUpSaga';
import AffiliateSaga from './AffiliateSaga';
import LeaderBoardSaga from './LeaderBoardSaga';
import chargeListSaga from './Trade/ChargeListSaga';
import MarginWalletLedgerSaga from './MarginWalletLedgerSaga';
import LeverageReportSaga from './LeverageReportSaga';
import MarginWalletListSaga from './MarginWalletListSaga';
import ApiPlanListSaga from './ApiPlanListSaga';
import ApiKeySaga from './ApiKeySaga';
import ReferralSystemCountSaga from './ReferralSystemCountSaga';
import orderHistorySaga from './Trade/OrderHistorySaga';
import openOrderSaga from './Trade/OpenOrderSaga';
import marketCapSaga from './Trade/MarketCapSaga';
import buyerBookSaga from './Trade/BuyerBookSaga';
import sellerBookSaga from './Trade/SellerBookSaga';
import pairRatesSaga from './Trade/PairRatesSaga';
import tradeBalanceSaga from './Trade/TradeBalanceSaga';
import buySellTradeSaga from './Trade/BuySellTradeSaga';
import ApiKeyDeleteSaga from './ApiKeyDeleteSaga';
import GlobalMarketTradeSaga from '../sagas/Trade/GlobalMarketTradeSaga';
import tradeChartSaga from '../sagas/Trade/TradeChartSaga';
import recentOrderSaga from '../sagas/Trade/RecentOrderSaga';
import FeesSaga from './FeesSaga';
import AddCurrencyLogoSaga from './AddCurrencyLogoSaga';
import AffiliateInviteFriendSaga from './AffiliateInviteFriendSaga';
import MarginProfitLossReportSaga from './MarginProfitLossReportSaga';
import OpenPositionReportSaga from './OpenPositionReportSaga';
import DeleverageSaga from './DeleverageSaga';

function* rootSaga() {
    yield all([
        tokenSaga(),
        tradeSaga(),
        WithdrawSaga(),
        DepositSagas(),
        TransferInOutSaga(),
        CommonSaga(),
        ContactUsSaga(),
        NewsSectionSaga(),
        SiteTokenConversionSaga(),
        LimitControlSaga(),
        TokenStackingSaga(),
        AddressManagementSaga(),
        RefereEarnSaga(),
        AnnouncementSaga(),
        FAQSaga(),
        SignUpSaga(),
        loginSaga(),
        ipWhiteListSaga(),
        LoginHistorySaga(),
        IpHistorySaga(),
        ResetPasswordSaga(),
        DeviceHistorySaga(),
        Complain(),
        MemberShipLevelSaga(),
        PageContent(),
        EditProfileSaga(),
        ForgotPasswordSaga(),
        EnableGoogleAuthSaga(),
        DisableGoogleAuthSaga(),
        FundViewSaga(),
        favouriteSaga(),
        UserLedgerSaga(),
        CoinlistSaga(),
        notificationSaga(),
        KYCSaga(),
        SocialProfileSaga(),
        LanguageSaga(),
        marketTickersSaga(),
        topGainersDataSaga(),
        topLosersDataSaga(),
        topGainersLosersDataSaga(),
        marketDepthSaga(),
        ActivityLogSaga(),
        tradeSettledSaga(),
        pairListSaga(),
        MyWalletSaga(),
        CoinListRequestSaga(),
        SurveySaga(),
        HelpCenterSaga(),
        AffiliateSignUpSaga(),
        AffiliateSaga(),
        LeaderBoardSaga(),
        chargeListSaga(),
        MarginWalletLedgerSaga(),
        LeverageReportSaga(),
        MarginWalletListSaga(),
        ApiPlanListSaga(),
        ApiKeySaga(),
        ReferralSystemCountSaga(),
        orderHistorySaga(),
        openOrderSaga(),
        marketCapSaga(),
        buyerBookSaga(),
        sellerBookSaga(),
        pairRatesSaga(),
        tradeBalanceSaga(),
        buySellTradeSaga(),
        ApiKeyDeleteSaga(),
        DeleverageSaga(),

        //Trade Sagas
        GlobalMarketTradeSaga(),
        tradeChartSaga(),
        recentOrderSaga(),
        FeesSaga(),
        AddCurrencyLogoSaga(),
        AffiliateInviteFriendSaga(),
        MarginProfitLossReportSaga(),
        OpenPositionReportSaga(),
    ])
}

export default rootSaga;