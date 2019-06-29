// horizontal nav links
export default {
  Tradingmenu: [
    {
      path: "/dashboard/trading",
      menu_title: "sidebar.experience",
      menu_icon: "zmdi zmdi-trending-up",
      child_routes: [
        {
          path: "/dashboard/trading",
          menu_title: "sidebar.basic"
        },
        {
          path: "/advance",
          menu_title: "sidebar.advance"
        },

      ]
    },
    {
      path: "/margin-trading",
      menu_title: "sidebar.marginTrading",
      menu_icon: "zmdi zmdi-trending-up",
      child_routes: [
        {
          path: "/margin-trading",
          menu_title: "sidebar.trading"
        },
        {
          path: "/margin-trading/wallet",
          menu_title: "sidebar.wallet"
        },
        {
          path: "/margin-trading/ledger",
          menu_title: "sidebar.Ledger"
        },
        {
          path: "/margin-trading/leverage-report",
          menu_title: "sidebar.LeverageRequest"
        },
        { // added by devang parekh for margin trading history
          path: "/margin-trading/history",
          menu_title: "sidebar.marginHistory"
        },
        { // added by vishva
          path: "/margin-trading/profitlossReport",
          menu_title: "sidebar.profitlossReport"
        },
        { // added by Parth andhariya for margin trading Open Position Report
          path: "/margin-trading/OpenPositionReport",
          menu_title: "sidebar.OpenPositionReport"
        },
      ]
    },
    //added by vishva
    {
      path: "/ArbitrageDashboard",
      menu_title: "sidebar.Arbitrage",
      menu_icon: "zmdi zmdi-trending-up",
      child_routes: [
        {
          path: "/arbitrage/dashboard",
          menu_title: "sidebar.arbitrageDashboard"
        },
        {
          path: "/arbitrage/Wallet",
          menu_title: "sidebar.Wallet"
        },
        {
          path: "/arbitrage/trading",
          menu_title: "sidebar.arbitrageTrading"
        },
        {
          path: "/arbitrage/analytics",
          menu_title: "sidebar.analytics"
        },
        {
          path: "/arbitrage/profit-indicator",
          menu_title: "sidebar.profitIndicator"
        },
        {
          path: "/arbitrage/ledger",
          menu_title: "sidebar.Ledger"
        },
        {
          path: "/arbitrage/open-order",
          menu_title: "sidebar.openorders"
        },
        {
          path: "/arbitrage/transaction-history",
          menu_title: "sidebar.transactionHistory"
        },
      ]
    },
    {
      menu_title: "sidebar.tradehistory",
      menu_icon: "zmdi zmdi-grid",
      child_routes: [
        {
          path: "/transaction-history",
          menu_title: "sidebar.transactionHistory"
        },
        {
          path: "/open-orders",
          menu_title: "sidebar.openorders",
          menu_icon: "zmdi zmdi-assignment-o",
          child_routes: null
        },
        {
          path: "/ledger",
          menu_title: "sidebar.ledger"
        },
      ]
    },
    {
      menu_title: "sidebar.token",
      menu_icon: "zmdi zmdi-assignment-o",
      child_routes: [
        {
          path: "/tokenConversion",
          menu_title: "sidebar.tokenConversion"
        },
        {
          path: "/siteTokenReport",
          menu_title: "sidebar.siteToken"
        }
      ]
    },
    {
      menu_title: "sidebar.ApiPlans",
      menu_icon: "zmdi zmdi-assignment-o",
      child_routes: [
        {
          path: "/ApiPlan",
          menu_title: "sidebar.ApiPlan"
        },
        {
          path: "/ApiKey",
          menu_title: "sidebar.ApiKey"
        }
      ]
    },
    {
      path: "/balance",
      menu_title: "sidebar.fundsbalances",
      menu_icon: "zmdi zmdi-balance-wallet",
      child_routes: null
    },
    {
      path: "/pages/news",
      menu_title: "sidebar.newsmenu",
      menu_icon: "ti-comment-alt",
      child_routes: null
    },
    {
      path: "/my-account",
      menu_title: "sidebar.myAccount",
      menu_icon: "zmdi zmdi-accounts",
      child_routes: [
        {
          path: "/app/my-account/my-account-dashboard",
          menu_title: "sidebar.myaccountdashboard",
          exact: true
        },
        {
          path: "/app/my-account/referral-program",
          menu_title: "sidebar.referralSystem",
          exact: true
        },
        {
          path: "/app/affiliate/dashboard",
          menu_title: "sidebar.affiliate",
          exact: true
        },
        {
          path: "/affiliate-signup",//Added by Saloni Rathod
          menu_title: "sidebar.affiliateSignup",
          exact: true
        }
      ]
    },
    {
      menu_title: "sidebar.Wallet",
      menu_icon: "zmdi zmdi-balance-wallet",
      child_routes: [
        {
          path: "/deposit",
          menu_title: "sidebar.deposits"
        },
        {
          path: "/history/deposit",
          menu_title: "sidebar.depositHistory"
        },
        {
          path: "/withdraw",
          menu_title: "sidebar.withdrawals"
        },
        {
          path: "/history/withdraw",
          menu_title: "sidebar.withdrawHistory"
        },
        {
          path: "/configuration",
          menu_title: "wallet.ConfigurationAndPreference"
        },
        {
          path: "/address-whitelist",
          menu_title: "sidebar.withdrawalAddress"
        },
        {
          path: "/incoming-transactions",
          menu_title: "sidebar.incomingtransactions"
        },
        {
          path: "/outgoing-transaction",
          menu_title: "sidebar.outGoingTransaction"
        },
        //Added by salim dt:07/02/2019
        {
          path: "/app/leader-board",
          menu_title: "sidebar.leaderBoard",
          exact: true
        },
        {
          path: "/token-staking",
          menu_title: "wallet.TSPageTitle"
        },
      ]
    },
  ]
};
