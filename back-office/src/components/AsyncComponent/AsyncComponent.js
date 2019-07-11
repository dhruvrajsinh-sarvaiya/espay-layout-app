/**
 * AsyncComponent
 * Code Splitting Component / Server Side Rendering
 */
import React from "react";
import Loadable from "react-loadable";

// jbs page loader
import JbsPageLoader from "Components/JbsPageLoader/JbsPageLoader";

// agency dashboard Trading
const AsyncTradingDashboardComponent = Loadable({
    loader: () => import("Routes/dashboard/Trading"),
    loading: () => <JbsPageLoader />
});

// react dragula
const AsyncReactDragulaComponent = Loadable({
    loader: () => import("Routes/drag-drop/react-dragula"),
    loading: () => <JbsPageLoader />
});

// react dnd
const AsyncReactDndComponent = Loadable({
    loader: () => import("Routes/drag-drop/react-dnd"),
    loading: () => <JbsPageLoader />
});

const AsyncDaemonAddressesComponent = Loadable({
    loader: () => import("Routes/daemon-addresses"),
    loading: () => <JbsPageLoader />
});

//Admin Asset Component - Added by Sanjay
const AsyncAdminAssetReportComponent = Loadable({
    loader: () => import("Routes/asset-report"),
    loading: () => <JbsPageLoader />
});

//Withdrawal Component
const AsyncWithdrawalReportComponent = Loadable({
    loader: () => import("Routes/withdraw-report"),
    loading: () => <JbsPageLoader />
});

//TransferInOut Component
const AsyncTransferInOutReportComponent = Loadable({
    loader: () => import("Routes/transfer-in-out"),
    loading: () => <JbsPageLoader />
});

const AsyncPaymentMethodReportComponent = Loadable({
    loader: () => import("Routes/payment-methods"),
    loading: () => <JbsPageLoader />
});

//Deposit Report Component
const AsyncDepositReportComponent = Loadable({
    loader: () => import("Routes/deposit-report"),
    loading: () => <JbsPageLoader />
});

//transfer-in Report Component
const AsyncTransferInReportComponent = Loadable({
    loader: () => import("Routes/transfer-in"),
    loading: () => <JbsPageLoader />
});

//transfer-out Report Component
const AsyncTransferOutReportComponent = Loadable({
    loader: () => import("Routes/transfer-out"),
    loading: () => <JbsPageLoader />
});

//deamon-balances Report Component
const AsyncDeamonBalancesReportComponent = Loadable({
    loader: () => import("Routes/deamon-balances"),
    loading: () => <JbsPageLoader />
});

//transaction-retry Report Component
const AsyncTransactionRetryReportComponent = Loadable({
    loader: () => import("Routes/transaction-retry"),
    loading: () => <JbsPageLoader />
});

//Stacking Fees Report Component
const AsyncStackingFeesComponent = Loadable({
    loader: () => import("Routes/stacking-fees"),
    loading: () => <JbsPageLoader />
});

//Earning Ledger Report Component
const AsyncEarningLedgerComponent = Loadable({
    loader: () => import("Routes/earningLedger"),
    loading: () => <JbsPageLoader />
});

//added Nirmit
const AsyncTradingLedger = Loadable({
    loader: () => import("Routes/trading-report/trading-ledger"),
    loading: () => <JbsPageLoader />
});

// added by Nishant
const AsyncPatternListComponent = Loadable({
    loader: () => import("Routes/fee-limit-patterns/list"),
    loading: () => <JbsPageLoader />
});
// added by Nishant
const AsyncAddPatternComponent = Loadable({
    loader: () => import("Routes/fee-limit-patterns/add"),
    loading: () => <JbsPageLoader />
});
// added by Nishant
const AsyncEditPatternComponent = Loadable({
    loader: () => import("Routes/fee-limit-patterns/edit"),
    loading: () => <JbsPageLoader />
});

// pair configuration added by devang parekh
const AsyncPairConfigurationComponent = Loadable({
    loader: () => import("Components/TradingWidgets/Configuration/Components/pair-configuration"),
    loading: () => <JbsPageLoader />
});
//trade routing
const AsyncTradeRoutingComponent = Loadable({
    loader: () => import("Routes/drag-drop/trade-routing"),
    loading: () => <JbsPageLoader />
});

// LiquidityProvider Component added by Manish vora
const AsyncLiquidityProviderComponent = Loadable({
    loader: () => import("Routes/liquidity-provider"),
    loading: () => <JbsPageLoader />
});

//Async Compo for trade routing - added by nishant
const AsyncTradeRouteComponent = Loadable({
    loader: () => import("Components/TradingWidgets/Configuration/Components/trade-route/list"),
    loading: () => <JbsPageLoader />
});

const AsyncAddTradeRouteComponent = Loadable({
    loader: () => import("Components/TradingWidgets/Configuration/Components/trade-route/add"),
    loading: () => <JbsPageLoader />
});

const AsyncEditTradeRouteComponent = Loadable({
    loader: () => import("Components/TradingWidgets/Configuration/Components/trade-route/edit"),
    loading: () => <JbsPageLoader />
});

//Async Compo for withdraw routing - added by nishant
const AsyncWithdrawRouteComponent = Loadable({
    loader: () => import("Routes/withdraw-route/list"),
    loading: () => <JbsPageLoader />
});

const AsyncAddWithdrawRouteComponent = Loadable({
    loader: () => import("Routes/withdraw-route/add"),
    loading: () => <JbsPageLoader />
});

const AsyncEditWithdrawRouteComponent = Loadable({
    loader: () => import("Routes/withdraw-route/edit"),
    loading: () => <JbsPageLoader />
});

//Trade Recon Trade LIst By Tejas
const AsyncTradeReconListComponent = Loadable({
    //    loader: () => import("Routes/TradeRecon/TradeReconList"),
    loader: () => import("Components/TradingWidgets/Reports/Components/TradeRecon/TradeReconList"),
    loading: () => <JbsPageLoader />
});

//Trade Recon Trade Edit By Tejas
const AsyncTradeReconEditComponent = Loadable({
    loader: () => import("Components/TradingWidgets/Reports/Components/TradeRecon/TradeReconEdit"),
    loading: () => <JbsPageLoader />
});

//charge Collected by Sanjay
const AsyncChargeCollectedComponent = Loadable({
    loader: () => import("Routes/charges-collected"),
    loading: () => <JbsPageLoader />
});

/* Coin Configuration Async component added by Nishant */
const AsyncCoinConfigComponent = Loadable({
    loader: () => import("Routes/coin-config"),
    loading: () => <JbsPageLoader />
});

//Added by Jayesh
const AsyncCountryComponent = Loadable({
    loader: () => import("Routes/localization/country"),
    loading: () => <JbsPageLoader />
});

const AsyncStateComponent = Loadable({
    loader: () => import("Routes/localization/state"),
    loading: () => <JbsPageLoader />
});

const AsyncCityComponent = Loadable({
    loader: () => import("Routes/localization/city"),
    loading: () => <JbsPageLoader />
});

const AsyncLanguageComponent = Loadable({
    loader: () => import("Routes/localization/language"),
    loading: () => <JbsPageLoader />
});

/* Member Topup - added by Nishant */
const AsyncMemberTopupComponent = Loadable({
    loader: () => import("Routes/topup"),
    loading: () => <JbsPageLoader />
});

// wallet dashboard - added by nishant
const AsyncWalletDashboardComponent = Loadable({
    loader: () => import("Routes/dashboard/wallet"),
    loading: () => <JbsPageLoader />
});

// margin trading - added by nishant
const AsyncMarginTradingDashboardComponent = Loadable({
    loader: () => import("Routes/dashboard/margin-trading"),
    loading: () => <JbsPageLoader />
});

// Admin Panel dashboard - added by salim deraiya
const AsyncMyAccountDashboardComponent = Loadable({
    loader: () => import("Routes/dashboard/my-account"),
    loading: () => <JbsPageLoader />
});

// cms dashboard - added by kushal
const AsyncCmsDashboardComponent = Loadable({
    loader: () => import("Routes/dashboard/cms"),
    loading: () => <JbsPageLoader />
});

// cms dashboard - added by dhara 24/12/2018
const AsyncChatDashboardComponent = Loadable({
    loader: () => import("Routes/dashboard/Chat"),
    loading: () => <JbsPageLoader />
});

//localization- added by dhara 8/2/2019 zipcodes
const AsyncZipcodesComponent = Loadable({
    loader: () => import("Routes/localization/zipcodes"),
    loading: () => <JbsPageLoader />
});

//Added By Sanjay API Key Configuration Dashboard
const AsyncAPIKeyConfigurationDashboardComponent = Loadable({
    loader: () => import("Routes/dashboard/ApiKeyConfiguration"),
    loading: () => <JbsPageLoader />
});

// added by devang parekh (18-4-2019)
const AsyncFinancialDashboardComponent = Loadable({
    loader: () => import("Routes/dashboard/financial"),
    loading: () => <JbsPageLoader />
});
// added by parth andhariya (05-06-2019)
const AsyncArbitrageDashboardComponent = Loadable({
    loader: () => import("Routes/dashboard/Arbitrage"),
    loading: () => <JbsPageLoader />
});

export {
    AsyncReactDragulaComponent,
    AsyncReactDndComponent,
    /* Wallet Async Component - Added By Nishant */
    AsyncDaemonAddressesComponent,
    AsyncPatternListComponent,
    AsyncAddPatternComponent,
    AsyncEditPatternComponent,
    AsyncTradeRouteComponent,
    AsyncAddTradeRouteComponent,
    AsyncEditTradeRouteComponent,
    AsyncWithdrawRouteComponent,
    AsyncAddWithdrawRouteComponent,
    AsyncEditWithdrawRouteComponent,
    /*Sanjay... */
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
    AsyncChargeCollectedComponent,
    /* CMS - Kushal */
    AsyncTradingLedger,
    /* Added By Tejas */
    AsyncTradingDashboardComponent,
    // added by devang parekh
    AsyncPairConfigurationComponent,
    AsyncTradeRoutingComponent,
    //Manish
    AsyncLiquidityProviderComponent,
    ////Added By Tejas
    AsyncTradeReconListComponent,
    AsyncTradeReconEditComponent,
    AsyncCoinConfigComponent, // added by nishant
    //Added by Jayesh
    AsyncCountryComponent,
    AsyncStateComponent,
    AsyncCityComponent,
    AsyncLanguageComponent,
    AsyncMemberTopupComponent, //added by Nishant
    AsyncWalletDashboardComponent, //added by Nishant
    AsyncMarginTradingDashboardComponent, //added by Nishant
    // AsyncAdminPanelDashboardComponent, //added by Salim Deraiya
    AsyncMyAccountDashboardComponent, //added by Salim Deraiya
    AsyncCmsDashboardComponent, //added by Kushal
    AsyncChatDashboardComponent, // Addedby Kushal
    AsyncZipcodesComponent,//Added by dhara gajera 8/2/2019 zipcodes,

    //Added By Sanjay 
    AsyncAPIKeyConfigurationDashboardComponent,
    AsyncFinancialDashboardComponent, // added by devang parekh (18-4-2019),
    AsyncArbitrageDashboardComponent// added by Parth Andhariya (05-06-2019),
};
