// horizontal nav links
export default {
    Tradingmenu: [
        {
            "path": "/horizontal/pages/blank",
            "menu_title": "sidebar.trading",
            "menu_icon": "zmdi zmdi-trending-up",
            "child_routes": null
        },
        {
            "path": "/horizontal/pages/blank",
            "menu_title": "sidebar.fundsbalances",
            "menu_icon": "zmdi zmdi-balance-wallet",
            "child_routes": null
        },
        {
            "path": "/horizontal/pages/blank",
            "menu_title": "sidebar.deposits",
            "menu_icon": "zmdi zmdi-balance",
            "child_routes": null
        },
        {
            "path": "/horizontal/pages/blank",
            "menu_title": "sidebar.withdrawals",
            "menu_icon": "zmdi zmdi-card",
            "child_routes": null
        },
        {
            "path": "/horizontal/pages/blank",
            "menu_title": "sidebar.openorders",
            "menu_icon": "zmdi zmdi-assignment-o",
            "child_routes": null
        },
        {
            "path": "/horizontal/pages/blank",
            "menu_title": "sidebar.tradehistory",
            "menu_icon": "zmdi zmdi-grid",
            "child_routes": null
        },
        {
            "path": "/horizontal/pages/blank",
            "menu_title": "sidebar.support",
            "menu_icon": "ti-headphone-alt",
            "child_routes": null
        },
        {
            "path": "/horizontal/pages/blank",
            "menu_title": "sidebar.newsmenu",
            "menu_icon": "ti-comment-alt",
            "child_routes": null
        },
        {
			"menu_title": "sidebar.myAccount",
            "menu_icon": "zmdi zmdi-accounts",
            "child_routes": [
                /* Kevinbhai...... */                
                {
                    "path": "/app/my-account/signup-with-email",
                    "menu_title": "sidebar.signupWithEmail",
                    exact: true
                 },
                 {
                    "path": "/app/my-account/signup-with-blockchain",
                    "menu_title": "sidebar.signupWithBlockchain",
                    exact: true
                 },
                 {
                    "path": "/app/my-account/reset-password",
                    "menu_title": "sidebar.resetPassword",
                    exact: true
                 },
             ]
		},
        {
			"menu_title": "sidebar.myAccount",
            "menu_icon": "zmdi zmdi-accounts",
            "child_routes": [
                {
                   "path": "/app/my-account/login-history",
                   "menu_title": "sidebar.loginHistory",
                   exact: true
                },
                {
                   "path": "/app/my-account/ip-history",
                   "menu_title": "sidebar.ipHistory",
                   exact: true
                },
                {
                    "path": "/app/my-account/login",
                    "menu_title": "sidebar.login",
                    exact: true
                 },
                 {
                    "path": "/app/my-account/user-account",
                    "menu_title": "sidebar.userAccount",
                    exact: true
                 },
                {
                   "path": "/app/my-account/activity-list",
                   "menu_title": "sidebar.activityList",
                   exact: true
                },
                {
                   "path": "/app/my-account/theme-configuration",
                   "menu_title": "sidebar.themeConfiguration",
                   exact: true
                },{
                    "path": "/app/my-account/signup-with-email",
                    "menu_title": "sidebar.signupWithEmail",
                    exact: true
                 },
                 {
                    "path": "/app/my-account/signup-with-blockchain",
                    "menu_title": "sidebar.signupWithBlockchain",
                    exact: true
                 },
                 {
                    "path": "/app/my-account/reset-password",
                    "menu_title": "sidebar.resetPassword",
                    exact: true
                 },
             ]
		}
    ]
}
