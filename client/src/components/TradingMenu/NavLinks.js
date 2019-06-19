// horizontal nav links
export default {
  Tradingmenu: [
    {
      //path: "/dashboard/CooldexTrading",
      path: "/dashboard/trading",
      menu_title: "sidebar.experience",
      menu_icon: "zmdi zmdi-trending-up",
      //child_routes: null
      child_routes: [
        {
          //path: "/dashboard/CooldexTrading",
          path: "/dashboard/trading",
          menu_title: "sidebar.basic"
        },
        {
          path: "/advance",
          menu_title: "sidebar.advance"
        },

        // {
        //   //path: "/dashboard/CooldexTrading",
        //   path: "/dashboard/trading",
        //   menu_title: "sidebar.trading"
        // },
      ]
      // child_routes: [
      //   {
      //     path: "/basic",
      //     menu_title: "sidebar.basic"
      //   },
      //   {
      //     path: "/advance",
      //     menu_title: "sidebar.advance"
      //   },
      //   {
      //     path: "/dashboard/CooldexTrading",
      //     menu_title: "sidebar.CooldexTrading"
      //   },
      //   {
      //     path: "/dashboard/CooldexFiat",
      //     menu_title: "sidebar.CooldexFiat"
      //   },
      //   {
      //     path: "/dashboard/CooldexFunding",
      //     menu_title: "sidebar.CooldexFunding"
      //   },
      // ]
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
          menu_title: "sidebar.transactionhistory"
        },
      ]
    },
    {
      menu_title: "sidebar.tradehistory",
      menu_icon: "zmdi zmdi-grid",
      child_routes: [
        {
          path: "/transaction-history",
          menu_title: "sidebar.transactionhistory"
        },
        {
          path: "/open-orders",
          menu_title: "sidebar.openorders",
          menu_icon: "zmdi zmdi-assignment-o",
          child_routes: null
        },
        // {
        //   path: "/transactioncharge-report",
        //   menu_title: "sidebar.transactioncharge"
        // },
        // {
        //   path: "/trading-report",
        //   menu_title: "sidebar.tradingLedger"
        // },
        {
          path: "/ledger",
          menu_title: "sidebar.ledger"
        },
        // {
        //   path: "/siteTokenReport",
        //   menu_title: "sidebar.siteToken"
        // }
        /* ,
        {
          path: "/tradeSummary",
          menu_title: "sidebar.tradeSummary"
        } */
      ]
    },
    {
      //path: "/tokenConversion",
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
      //path: "/tokenConversion",
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
    // {
    //   path: "/ApiPlan",
    //   menu_title: "sidebar.ApiPlan",
    //   menu_icon: "ti-comment-alt",
    //   child_routes: null
    // },
    {
      path: "/balance",
      menu_title: "sidebar.fundsbalances",
      menu_icon: "zmdi zmdi-balance-wallet",
      child_routes: null
    },
    // {
    //   path: "/pages/faq",
    //   menu_title: "sidebar.support",
    //   menu_icon: "ti-headphone-alt",
    //   child_routes: null
    // },
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
    /* {
      path: "/social-profile",
      menu_title: "sidebar.socialProfile",
      menu_icon: "zmdi zmdi-share",
      child_routes: [
        {
          path: "/app/social-profile",
          menu_title: "sidebar.subscription",
          exact: true
        },
        {
          path: "/app/social-profile/dashboard",
          menu_title: "sidebar.socialDashboard",
          exact: true
        },
        {
          path: "/app/social-profile/follower-list",
          menu_title: "sidebar.followerList",
          exact: true
        }
      ]
    }, */
    // {
    //   menu_title: "sidebar.myAccount",
    //   menu_icon: "zmdi zmdi-accounts",
    //   child_routes: [
    //     {
    //       path: "/app/my-account/login-history",
    //       menu_title: "sidebar.loginHistory",
    //       exact: true
    //     },
    //     {
    //       path: "/app/my-account/ip-history",
    //       menu_title: "sidebar.ipHistory",
    //       exact: true
    //     },
    //     {
    //       path: "/app/my-account/login",
    //       menu_title: "sidebar.login",
    //       exact: true
    //     },
    //     {
    //       path: "/app/my-account/user-account",
    //       menu_title: "sidebar.userAccount",
    //       exact: true
    //     },
    //     {
    //       path: "/app/my-account/activity-list",
    //       menu_title: "sidebar.activityList",
    //       exact: true
    //     },
    //     {
    //       path: "/app/my-account/theme-configuration",
    //       menu_title: "sidebar.themeConfiguration",
    //       exact: true
    //     },
    //     {
    //       path: "/app/my-account/signup-with-email",
    //       menu_title: "sidebar.signupWithEmail",
    //       exact: true
    //     },
    //     {
    //       path: "/app/my-account/signup-with-blockchain",
    //       menu_title: "sidebar.signupWithBlockchain",
    //       exact: true
    //     },
    //     {
    //       path: "/app/my-account/reset-password",
    //       menu_title: "sidebar.resetPassword",
    //       exact: true
    //     },
    //     {
    //       path: "/app/my-account/signup-with-mobile",
    //       menu_title: "sidebar.signupWithMobile",
    //       exact: true
    //     },
    //     {
    //       path: "/app/my-account/change-password",
    //       menu_title: "sidebar.changePassword",
    //       exact: true
    //     },
    //     {
    //       path: "/app/my-account/membership-level",
    //       menu_title: "sidebar.membershipLevel",
    //       exact: true
    //     },
    //     {
    //       path: "/app/my-account/complain",
    //       menu_title: "sidebar.complain",
    //       exact: true
    //     },
    //     {
    //       path: "/app/my-account/trade-summary",
    //       menu_title: "sidebar.tradeSummary",
    //       exact: true
    //     },
    //     {
    //       path: "/app/my-account/top-gainers",
    //       menu_title: "sidebar.topGainers",
    //       exact: true
    //     },
    //     {
    //       path: "/app/my-account/top-losers",
    //       menu_title: "sidebar.topLosers",
    //       exact: true
    //     },
    //     {
    //       path: "/app/my-account/ip-whitelist",
    //       menu_title: "sidebar.ipWhitelist",
    //       exact: true
    //     },
    //     {
    //       path: "/app/my-account/device-whitelisting",
    //       menu_title: "sidebar.deviceWhitelisting",
    //       exact: true
    //     }
    //   ]
    // },
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
        /*{
          path: "/convert-token",
          menu_title: "wallet.CTPageTitle"
        }, */
        {
          path: "/configuration",
          menu_title: "wallet.ConfigurationAndPreference"
        },
        /* {
          path: "/transfer-in",
          menu_title: "sidebar.transferin"
        },
        {
          path: "/transfer-out",
          menu_title: "sidebar.transferout"
        },
        {
          path: "/decent-addgen",
          menu_title: "sidebar.decentAddgen"
        }, */
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
    /* {
      menu_title: 'sidebar.affiliate',
      menu_icon: "zmdi zmdi-balance-wallet",
      child_routes: [
        {
          path: "/affiliate/dashboard",
          menu_title: 'sidebar.dashboard'
        },
        {
          path: "/affiliate/commission-pattern",
          menu_title: 'sidebar.commissionPattern'
        },
        {
          path: "/affiliate/promotion",
          menu_title: 'sidebar.promotion'
        },
        {
          path: "/affiliate/commission-report",
          menu_title: 'sidebar.commissionReport'
        }
      ]
    }, */
    // {
    //   path: "/social-profile/social-profile-subscription",
    //   menu_title: "sidebar.socialProfile",
    //   menu_icon: "ti-comment-alt",
    //   child_routes: null
    // },
  ]
};
