/**
 * AsyncComponent
 * Code Splitting Component / Server Side Rendering
 */
import React from "react";
import Loadable from "react-loadable";

// jbs page loader
import JbsPageLoader from "Components/JbsPageLoader/JbsPageLoader";

//Jbs DataTable
const AsyncJbsDataTableComponent = Loadable({
    loader: () => import("Routes/components/JbsDataTable"),
    loading: () => <JbsPageLoader />
});

// trading dashboard
const AsyncTradingDashboardComponent = Loadable({
    loader: () => import("Routes/dashboard/Trading2"),
    loading: () => <JbsPageLoader />
});

const AsyncTrading_DashboardComponent = Loadable({
    loader: () => import("Routes/dashboard/Trading3"),
    loading: () => <JbsPageLoader />
});

//CoolDax Trading
const AsyncCooldexTrading_DashboardComponent = Loadable({
    loader: () => import("Routes/dashboard/CooldexTrading"),
    loading: () => <JbsPageLoader />
});

//CoolDax Fiat
const AsyncCooldexFiat_Component = Loadable({
    loader: () => import("Routes/dashboard/CooldexFiat"),
    loading: () => <JbsPageLoader />
});

//CoolDax Fiat
const AsyncCooldexFunding_Component = Loadable({
    loader: () => import("Routes/dashboard/CooldexFunding"),
    loading: () => <JbsPageLoader />
});

// chat app
const AsyncChatComponent = Loadable({
    loader: () => import("Routes/chat"),
    loading: () => <JbsPageLoader />
});

// faq
const AsyncFaqComponent = Loadable({
    loader: () => import("Routes/pages/faq"),
    loading: () => <JbsPageLoader />
});

// Session Page 404
const AsyncSessionPage404Component = Loadable({
    loader: () => import("Routes/session/404"),
    loading: () => <JbsPageLoader />
});

// Session Page 404
const AsyncSessionPage500Component = Loadable({
    loader: () => import("Routes/session/500"),
    loading: () => <JbsPageLoader />
});

// terms and conditions
const AsyncTermsAndConditionComponent = Loadable({
    loader: () => import("Routes/terms-and-condition"),
    loading: () => <JbsPageLoader />
});

/* ==================== My Account ================= */
/* My Account Components */
const AsyncTwoFaAuthenticationComponent = Loadable({
    loader: () => import("Routes/my-account/2fa-authentication"),
    loading: () => <JbsPageLoader />
});

const AsyncLoginComponent = Loadable({
    loader: () => import("Routes/my-account/login"),
    loading: () => <JbsPageLoader />
});

// MyAccount - Login History Simple Table - Parth
const AsyncLoginHistoryComponent = Loadable({
    loader: () => import("Routes/my-account/login-history"),
    loading: () => <JbsPageLoader />
});

// MyAccount - IP History Data Table - Parth
const AsyncIPHistoryComponent = Loadable({
    loader: () => import("Routes/my-account/ip-history"),
    loading: () => <JbsPageLoader />
});

// No Internet Connection
const AsyncNoInternetConnectionComponent = Loadable({
    loader: () => import("Routes/session/NoInternet"),
    loading: () => <JbsPageLoader />
});

// Contact us - Kushal
const AsyncContactUsComponent = Loadable({
    loader: () => import("Routes/pages/contact-us"),
    loading: () => <JbsPageLoader />
});

// News - Kushal
const AsyncNewsComponent = Loadable({
    loader: () => import("Routes/pages/news"),
    loading: () => <JbsPageLoader />
});

// Privacy Policy - Kushal
const AsyncPrivacyPolicyComponent = Loadable({
    loader: () => import("Routes/pages/privacy-policy"),
    loading: () => <JbsPageLoader />
});

// Terms of Service - Kushal
const AsyncTermsOfServiceComponent = Loadable({
    loader: () => import("Routes/pages/terms-of-service"),
    loading: () => <JbsPageLoader />
});

// AML Policy - Kushal
const AsyncLegalStatementComponent = Loadable({
    loader: () => import("Routes/pages/legal-statement"),
    loading: () => <JbsPageLoader />
});

// Refund Policy - Kushal
const AsyncRefundPolicyComponent = Loadable({
    loader: () => import("Routes/pages/refund-policy"),
    loading: () => <JbsPageLoader />
});

// API Description - Kushal
const AsyncAPIComponent = Loadable({
    loader: () => import("Routes/pages/api"),
    loading: () => <JbsPageLoader />
});

// KYC Standard - Kushal
const AsyncApplicationCenterComponent = Loadable({
    loader: () => import("Routes/pages/application-center"),
    loading: () => <JbsPageLoader />
});

// COIN LIST - Kushal
const AsyncCoinListComponent = Loadable({
    loader: () => import("Routes/pages/coin-list"),
    loading: () => <JbsPageLoader />
});

// COIN INFO - Kushal
const AsyncCoinInfoComponent = Loadable({
    loader: () => import("Routes/pages/coin-info"),
    loading: () => <JbsPageLoader />
});

//Fees - Kushal
const AsyncFeesComponent = Loadable({
    loader: () => import("Routes/pages/fees"),
    loading: () => <JbsPageLoader />
});

// Aboutus - Kushal
const AsyncAboutUsComponent = Loadable({
    loader: () => import("Routes/pages/about-us"),
    loading: () => <JbsPageLoader />
});

// Deposit - Nishant
const AsyncDepositComponent = Loadable({
    loader: () => import("Routes/deposit"),
    loading: () => <JbsPageLoader />
});
const AsyncWithdrawComponent = Loadable({
    loader: () => import("Routes/withdraw"),
    loading: () => <JbsPageLoader />
});
const AsyncDepositHistoryComponent = Loadable({
    loader: () => import("Routes/history/deposit"),
    loading: () => <JbsPageLoader />
});
const AsyncWithdrawHistoryComponent = Loadable({
    loader: () => import("Routes/history/withdraw"),
    loading: () => <JbsPageLoader />
});
const AsyncTokenStakingComponent = Loadable({
    loader: () => import("Routes/token-staking"),
    loading: () => <JbsPageLoader />
});
const AsyncConvertTokenComponent = Loadable({
    loader: () => import("Routes/convert-token"),
    loading: () => <JbsPageLoader />
});
const AsyncConfigurationComponent = Loadable({
    loader: () => import("Routes/configuration"),
    loading: () => <JbsPageLoader />
});
const AsyncTransferInComponent = Loadable({
    loader: () => import("Routes/transfer-in"),
    loading: () => <JbsPageLoader />
});

const AsyncTransferOutComponent = Loadable({
    loader: () => import("Routes/transfer-out"),
    loading: () => <JbsPageLoader />
});

/* Decentralize Address Generation - added by nishant */
const AsyncDecentAddgenComponent = Loadable({
    loader: () => import("Routes/decent-addgen"),
    loading: () => <JbsPageLoader />
});
/* Address whitelist component */
const AsyncAddressWhitelistComponent = Loadable({
    loader: () => import("Routes/address-whitelist"),
    loading: () => <JbsPageLoader />
});

/* Fund Balance -added by nishant*/
const AsyncBalanceComponent = Loadable({
    loader: () => import("Routes/balance"),
    loading: () => <JbsPageLoader />
});

/* Incoming Transactions */
const AsyncIncomingTransactionsComponent = Loadable({
    loader: () => import("Routes/incoming-transactions"),
    loading: () => <JbsPageLoader />
});

/*OutGoing Transaction */
const AsyncOutGoingTransactionComponent = Loadable({
    loader: () => import("Routes/outgoing-transaction"),
    loading: () => <JbsPageLoader />
});

/*Margin Trading Wallet Management */
const AsyncMarginTradingWalletComponent = Loadable({
    loader: () => import("Routes/margin-trading/wallet"),
    loading: () => <JbsPageLoader />
});

// Maintainance - Kushal
const AsyncMaintainanceComponent = Loadable({
    loader: () => import("Routes/session/Maintainance"),
    loading: () => <JbsPageLoader />
});

// Maintainance - Kushal
const AsyncSurveyComponent = Loadable({
    loader: () => import("Routes/pages/survey"),
    loading: () => <JbsPageLoader />
});
// wallet sharing - added by Nishant
const AsyncMyWalletsComponent = Loadable({
    loader: () => import("Routes/my-wallets"),
    loading: () => <JbsPageLoader />
});
// wallet sharing - added by Nishant
const AsyncWalletUserListComponent = Loadable({
    loader: () => import("Routes/wallet-userlist"),
    loading: () => <JbsPageLoader />
});
// wallet activity - added by Nishant
const AsyncWalletActivityComponent = Loadable({
    loader: () => import("Routes/wallet-activity"),
    loading: () => <JbsPageLoader />
});
// HelpCenter - Jayesh
const AsyncHelpCenterComponent = Loadable({
    loader: () => import("Routes/pages/helpcenter"),
    loading: () => <JbsPageLoader />
});

const AsyncHelpCenterInfoComponent = Loadable({
    loader: () => import("Routes/pages/helpcenter-info"),
    loading: () => <JbsPageLoader />
});

// coin list requist custom - dhara gajera 4/1/2019
const AsyncCoinListRequestComponent = Loadable({
    loader: () => import("Routes/pages/coin-list-request"),
    loading: () => <JbsPageLoader />
});

/*Margin Trading Route Management (added by devang parekh 19-2-2019) */
const AsyncMarginTradingComponent = Loadable({
    loader: () => import("Routes/margin-trading/trading"),
    loading: () => <JbsPageLoader />
});

//added by vishva
const AsyncMarginTradingWalletledgerComponent = Loadable({
    loader: () => import("Routes/margin-trading/ledger"),
    loading: () => <JbsPageLoader />
});

// added by parth andhariya Leaverage Request 05-03-2019
const AsyncMarginLeverageReport = Loadable({
    loader: () => import("Routes/margin-trading/leverage-report"),
    loading: () => <JbsPageLoader />
});

const AsyncMarginTradingHistoryComponent = Loadable({
    loader: () => import("Routes/margin-trading/history"),
    loading: () => <JbsPageLoader />
});
const AsyncprofitlossComponent = Loadable({
    loader: () => import("Routes/margin-trading/ProfitLossReport"),
    loading: () => <JbsPageLoader />
});

// added by parth andhariya Leaverage Request 05-03-2019
const OpenPositionReport = Loadable({
    loader: () => import("Routes/margin-trading/OpenPositionReport"),
    loading: () => <JbsPageLoader />
});
export {
    AsyncChatComponent,
    AsyncFaqComponent,
    AsyncSessionPage404Component,
    AsyncSessionPage500Component,
    AsyncTradingDashboardComponent,
    AsyncJbsDataTableComponent,
    AsyncTermsAndConditionComponent,
    //Added by salim
    AsyncTwoFaAuthenticationComponent,
    AsyncLoginComponent,
    AsyncLoginHistoryComponent,
    AsyncIPHistoryComponent,
    AsyncNoInternetConnectionComponent,
    //Added by Kushal
    AsyncContactUsComponent,
    AsyncNewsComponent,
    AsyncPrivacyPolicyComponent,
    AsyncTermsOfServiceComponent,
    AsyncLegalStatementComponent,
    AsyncRefundPolicyComponent,
    AsyncAPIComponent,
    AsyncApplicationCenterComponent,
    AsyncCoinListComponent,
    AsyncCoinInfoComponent,
    AsyncFeesComponent,
    AsyncAboutUsComponent,
    // Added By Nishant
    AsyncDepositComponent,
    AsyncWithdrawComponent,
    AsyncDepositHistoryComponent,
    AsyncWithdrawHistoryComponent,
    AsyncTokenStakingComponent,
    AsyncConvertTokenComponent,
    AsyncConfigurationComponent,
    AsyncTransferInComponent,
    AsyncTransferOutComponent,
    AsyncDecentAddgenComponent,
    AsyncAddressWhitelistComponent,
    AsyncBalanceComponent,
    AsyncIncomingTransactionsComponent,
    AsyncOutGoingTransactionComponent,
    AsyncMarginTradingWalletComponent,
    //Added by Kushal
    AsyncMaintainanceComponent,
    //Manish Vora
    AsyncTrading_DashboardComponent,
    AsyncCooldexTrading_DashboardComponent,
    AsyncCooldexFiat_Component,
    AsyncCooldexFunding_Component,
    //Added by Kushal
    AsyncSurveyComponent,
    //added by Nishant
    AsyncMyWalletsComponent,
    AsyncWalletUserListComponent,
    AsyncWalletActivityComponent,
    //Added by Jayesh
    AsyncHelpCenterComponent,
    AsyncHelpCenterInfoComponent,
    AsyncCoinListRequestComponent,//dhara 4/1/2019
    AsyncMarginTradingComponent, // added by devang parekh 19-2-2019
    AsyncMarginTradingWalletledgerComponent, // added by vishva shah
    AsyncMarginLeverageReport, // added by parth andhariya
    AsyncMarginTradingHistoryComponent, // added by devang parekh (6-3-2019)
    AsyncprofitlossComponent,// added by vishva
    OpenPositionReport, // added by parth andhariya (22-04-2016) 
};
