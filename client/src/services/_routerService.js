// routes
import Pages from "Routes/pages";
import Components from "Routes/components";
import Dashboard from "Routes/dashboard";
import MyAccount from "Routes/my-account";
import Arbitrage from "Routes/arbitrage";
import History from "Routes/history";
import MaringTrading from "Routes/margin-trading";
//added by devang parekh
import transactionHistory from "Routes/transaction-history";
import openOrders from "Routes/open-orders";
import Trading from "Routes/dashboard/trading";
import BasicTrading from "Routes/dashboard/Trading2";
// Added By Tejas
import TransactionChargeReport from "Routes/TransactionChargeReport";
// Added By TradeSummary
import TradeSummary from "Routes/trade-summary";
// Added By Nirmit
import TradeLedger from "Routes/trading-report";
// Added By Nirmit
import Ledger from "Routes/ledger";
//Added By Kevin
import SocialProfile from "Routes/social-profile";
/* Withdraw confirmation route - added by Nishant */
import WithdrawConfirmation from "Routes/withdraw-confirmation";
/* Leader Board - added by Salim dt:07/02/2019 */
import LeaderBoard from "Routes/leader-board";
// import for Site TokenReport 
import SiteTokenReport from "Routes/SiteTokenReport";
import SiteTokenConversion from "Components/SiteTokenConversion";
//Added By Salim
import Affiliate from "Routes/affiliate";
// added By Tejas date : 16/2/2019
import ApiPlanComponent from "Routes/ApiPlan";
import SubScribePlan from "Components/ApiPlan/SubscribePlan";
import ApiKeyView from "Components/ApiKey/ViewApiKeys";

// async component
import {
    AsyncTermsAndConditionComponent,
    AsyncDepositComponent,
    AsyncWithdrawComponent,
    AsyncTokenStakingComponent,
    AsyncConvertTokenComponent,
    AsyncConfigurationComponent,
    AsyncTransferInComponent,
    AsyncTransferOutComponent,
    AsyncAddressWhitelistComponent,
    AsyncBalanceComponent,
    AsyncIncomingTransactionsComponent,
    AsyncOutGoingTransactionComponent,
    AsyncTrading_DashboardComponent,
    AsyncCooldexTrading_DashboardComponent,
    AsyncCooldexFiat_Component,
    AsyncCooldexFunding_Component,
    AsyncMyWalletsComponent,
    AsyncWalletUserListComponent,
    AsyncWalletActivityComponent
} from "Components/AsyncComponent/AsyncComponent";

export default [
    {
        path: "dashboard",
        component: Dashboard
    },
    {
        path: "pages",
        component: Pages
    },
    {
        path: "ui-components",
        component: Components
    },
    {
        path: "terms-and-condition",
        component: AsyncTermsAndConditionComponent
    },
    //Added by salim for MyAccount
    {
        path: "my-account",
        component: MyAccount
    },
    // added by devang parekh for open order and trade history
    {
        path: "transaction-history",
        component: transactionHistory
    },
    {
        path: "trading",
        component: Trading
    },
    {
        path: "open-orders",
        component: openOrders
    },
    {
        path: "deposit",
        component: AsyncDepositComponent
    },
    {
        path: "withdraw",
        component: AsyncWithdrawComponent
    },
    {
        path: "history",
        component: History
    },
    {
        path: "margin-trading",
        component: MaringTrading
    },
    {
        path: "token-staking",
        component: AsyncTokenStakingComponent
    },
    {
        path: "convert-token",
        component: AsyncConvertTokenComponent
    },
    {
        path: "configuration",
        component: AsyncConfigurationComponent
    },
    {
        path: "transfer-in",
        component: AsyncTransferInComponent
    },
    {
        path: "transfer-out",
        component: AsyncTransferOutComponent
    },
    {
        path: "address-whitelist",
        component: AsyncAddressWhitelistComponent
    },
    {
        path: "transactioncharge-report",
        component: TransactionChargeReport
    },
    {
        path: "trading-report",
        component: TradeLedger
    },
    {
        path: "balance",
        component: AsyncBalanceComponent
    },
    {
        path: "ledger",
        component: Ledger
    },
    {
        path: "incoming-transactions",
        component: AsyncIncomingTransactionsComponent
    },
    {
        path: "outgoing-transaction",
        component: AsyncOutGoingTransactionComponent
    },
    //Added by salim dt:07/02/2019
    {
        path: "leader-board",
        component: LeaderBoard
    },
    {
        path: "trading3",
        component: AsyncTrading_DashboardComponent
    },
    {
        path: "basic",
        component: BasicTrading
    },
    {
        path: "advance",
        component: AsyncTrading_DashboardComponent
    },
    {
        path: "CooldexTrading",
        component: AsyncCooldexTrading_DashboardComponent
    },
    {
        path: "CooldexFiat",
        component: AsyncCooldexFiat_Component
    },
    {
        path: "CooldexFunding",
        component: AsyncCooldexFunding_Component
    },
    //Added by Kevin for Social Profile
    {
        path: "social-profile",
        component: SocialProfile
    },
    //added by Nishant for wallet sharing
    {
        path: "my-wallets",
        component: AsyncMyWalletsComponent
    },
    //added by Nishant for wallet sharing
    {
        path: "wallet-userlist",
        component: AsyncWalletUserListComponent
    },
    {
        path: "tradeSummary",
        component: TradeSummary
    },
    //added by Nishant for wallet activity
    {
        path: "wallet-activity",
        component: AsyncWalletActivityComponent
    },
    //added by Nishant for wallet activity
    {
        path: "withdraw-confirmation",
        component: WithdrawConfirmation
    },
    // added By Tejas For SiteTokenReport
    {
        path: "siteTokenReport",
        component: SiteTokenReport
    },
    //Added by Salim for Affiliate
    {
        path: "affiliate",
        component: Affiliate
    },
    {
        path: "tokenConversion",
        component: SiteTokenConversion
    },
    {
        path: "ApiPlan",
        component : ApiPlanComponent
    },
    {
        path: "ApiPlan/ApiPlanData",
        component : SubScribePlan
    },
    {
        path:"ApiKey",
        component:ApiKeyView
    },
    //Added by salim for Arbitrage
    {
        path: "arbitrage",
        component: Arbitrage
    },
    // {
    //     path: "ArbitrageDashboard",
    //     component: ArbitrageDashboard
    // },
];