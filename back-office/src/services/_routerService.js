// routes
import DragAndDrop from "Routes/drag-drop";
import Dashboard from "Routes/dashboard";

/* Wallet Route - Added By Nishant */

import FeeAndLimitPatterns from "Routes/fee-limit-patterns";
import TradeRoute from "Components/TradingWidgets/Configuration/Components/trade-route/TradeRouteList";
import WithdrawRoute from "Routes/withdraw-route";

//added by nirmit
import TradingLedger from "Routes/trading-report";

//added by Raj
import LiquidityAPIManager from "Components/TradingWidgets/Configuration/Components/Liquidity-API-Manager";
import ExchangeFeedConfiguration from "Components/TradingWidgets/Configuration/Components/Exchange-Feed-Configuration";
import TradeSummary from "Routes/trading-report/Trade-Summary";

// added By Tejas
import DaemonConfigure from "Components/TradingWidgets/Configuration/Components/Daemon-Configure";

// Added By Tejas
import TradeRecon from "Components/TradingWidgets/Reports/Components/TradeRecon";

// added By Tejas
import BugReport from "Routes/BugReport";

// added By Tejas
import ApiConfiguration from "Routes/ApiConfiguration";

//Added by Tejas
import ManageMarkets from "Routes/ManageMarkets";

// Added By Jayesh
import LOCALIZATION from "Routes/localization";

import WalletDashBoard from "Routes/wallet-dashboard";

//Added By Kevin Ladani 
import SocialProfile from "Routes/social-profile";

import PushNotificationData from "Routes/PushNotificationQueue"; //Added by Khushbu Badheka D:08/01/2019
//import PushMessage from "Routes/PushMessage"; // Added By Megha Kariya
import PushMessage from "Routes/PushMessage/push-message"; // Added By Megha Kariya

// async component
import {
  /* Wallet Async Component - Added By Nishant */
  AsyncDaemonAddressesComponent,
  AsyncCoinConfigComponent,
  /*Sanjay */
  AsyncAdminAssetReportComponent,
  AsyncWithdrawalReportComponent,
  AsyncTransferInOutReportComponent,
  AsyncPaymentMethodReportComponent,
  AsyncDepositReportComponent,
  AsyncTransferInReportComponent,
  AsyncTransferOutReportComponent,
  AsyncDeamonBalancesReportComponent,
  AsyncTransactionRetryReportComponent,
  AsyncStackingFeesComponent,
  AsyncEarningLedgerComponent,
  AsyncPairConfigurationComponent, //Added by Devangbhai
  /*Manish */
  AsyncLiquidityProviderComponent,
  AsyncMemberTopupComponent, // added by Nishant
} from "Components/AsyncComponent/AsyncComponent";

import Reports from 'Routes/Reports';

//Added By Jinesh
import PushEmail from "Routes/PushEmail";
import EmailApiManager from "Routes/EmailApiManager";

import UserProfile from "Routes/user-profile";

export default [
  {
    path: "user-profile",
    component: UserProfile
  },
  {
    path: "dashboard",
    component: Dashboard
  },
  {
    path: "Trade-Summary",
    component: TradeSummary
  },
  {
    path: "drag-andDrop",
    component: DragAndDrop
  },
  {
    path: "Liquidity-API-Manager",
    component: LiquidityAPIManager
  },
  {
    path: "Exchange-Feed-Configuration",
    component: ExchangeFeedConfiguration
  },
  {
    path: "daemon-addresses",
    component: AsyncDaemonAddressesComponent
  },
  {
    path: "asset-report",
    component: AsyncAdminAssetReportComponent
  },
  {
    path: "withdraw-report",
    component: AsyncWithdrawalReportComponent
  },
  {
    path: "transfer-in-out",
    component: AsyncTransferInOutReportComponent
  },
  {
    path: "payment-methods",
    component: AsyncPaymentMethodReportComponent
  },
  {
    path: "deposit-report",
    component: AsyncDepositReportComponent
  },
  {
    path: "transfer-in",
    component: AsyncTransferInReportComponent
  },
  {
    path: "transfer-out",
    component: AsyncTransferOutReportComponent
  },
  {
    path: "deamon-balances",
    component: AsyncDeamonBalancesReportComponent
  },
  {
    path: "transaction-retry",
    component: AsyncTransactionRetryReportComponent
  },
  {
    path: "stacking-fees",
    component: AsyncStackingFeesComponent
  },
  {
    path: "trading-report",
    component: TradingLedger
  },
  {
    path: "earningLedger",
    component: AsyncEarningLedgerComponent
  },
  {
    path: "fee-limit-patterns",
    component: FeeAndLimitPatterns
  },
  {
    path: "pair-configuration",
    component: AsyncPairConfigurationComponent
  },
  {
    path: "daemon-configure",
    component: DaemonConfigure
  },
  {
    path: "liquidity-provider",
    component: AsyncLiquidityProviderComponent
  },
  {
    path: "trade-route",
    component: TradeRoute
  },
  {
    path: "withdraw-route",
    component: WithdrawRoute
  },
  {
    path: "tradeRecon",
    component: TradeRecon
  },
  {
    path: "bugReport",
    component: BugReport
  },
  {
    path: "apiConfiguration",
    component: ApiConfiguration
  },
  {
    path: "manageMarkets",
    component: ManageMarkets
  },
  {
    path: "coin-config",
    component: AsyncCoinConfigComponent
  },
  {
    path: "localization",
    component: LOCALIZATION
  },
  {
    path: "topup",
    component: AsyncMemberTopupComponent
  },
  {
    path: "wallet-dashboard",
    component: WalletDashBoard
  },
  {
    path: "social-profile",
    component: SocialProfile
  },
  {
    path: "Reports",
    component: Reports
  },
  {
    path: "pushNotificationQueue",
    component: PushNotificationData
  },
  {
    path: "pushMessage",
    component: PushMessage
  }, {
    path: "PushEmail",
    component: PushEmail
  },
  {
    path: "EmailApiManager",
    component: EmailApiManager
  }
];
