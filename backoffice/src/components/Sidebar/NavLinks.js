import { checkAndGetMenuAccessDetail } from 'Helpers/helpers';
// sidebar nav links
export default {
    category1: [
        /* permission based menu rendering - added by nishant */
        checkAndGetMenuAccessDetail('085F7B78-2D47-0FA7-6C4A-5DD1A02A91DD') ? {
            menu_title: "sidebar.dashboard",
            menu_icon: "zmdi zmdi-view-dashboard",
            child_routes: [
                checkAndGetMenuAccessDetail('5F9F682D-3B7E-35C0-6062-C3F80C2D4C56') ? { // 5F9F682D-3B7E-35C0-6062-C3F80C2D4C56
                    menu_title: "sidebar.trading",
                    path: "/app/dashboard/trading",
                } : {},
                checkAndGetMenuAccessDetail('1B6C71F0-9D76-396D-25E6-6187D0F30F0A') ? { //1B6C71F0-9D76-396D-25E6-6187D0F30F0A
                    menu_title: "sidebar.marginTrading",
                    path: "/app/dashboard/margin-trading"
                } : {},
                /* {    
                    menu_title: "sidebar.financial",
                    path: "/app/dashboard/financial"
                }, */
                checkAndGetMenuAccessDetail('58ADC832-8637-6895-3ACE-9025DEE8247B') ? { //58ADC832-8637-6895-3ACE-9025DEE8247B
                    menu_title: "sidebar.walletMenu",
                    path: "/app/dashboard/wallet"
                } : {},
                checkAndGetMenuAccessDetail('E8FEEB92-0BD0-5246-4B49-44D3FC9E071B') ? { //E8FEEB92-0BD0-5246-4B49-44D3FC9E071B
                    menu_title: "sidebar.myAccount",
                    path: "/app/dashboard/my-account"
                } : {},
                checkAndGetMenuAccessDetail('38868F8E-11F7-A6B5-A520-E9D0E1514A5F') ? { //38868F8E-11F7-A6B5-A520-E9D0E1514A5F
                    menu_title: "sidebar.cms",
                    path: "/app/dashboard/cms"
                } : {},
                checkAndGetMenuAccessDetail('3B931E92-4833-451C-46D3-07EBC960127B') ? { //3B931E92-4833-451C-46D3-07EBC960127B
                    menu_title: "sidebar.Chat",
                    path: "/app/dashboard/Chat"
                } : {},
                checkAndGetMenuAccessDetail('1CB9A7EB-315B-1A0B-1E71-5F4119D20FBF') ? { //1CB9A7EB-315B-1A0B-1E71-5F4119D20FBF
                    menu_title: "sidebar.ApiKeyConfiguration",
                    path: "/app/dashboard/APIKeyConfiguration",
                } : {},
                //added by jayshreeba gohil (17/06/2019)
                checkAndGetMenuAccessDetail('1CB9A7EB-315B-1A0B-1E71-5F4119D20FBF') ? { //1CB9A7EB-315B-1A0B-1E71-5F4119D20FBF
                    menu_title:  "sidebar.Arbitrage",
                    path: "/app/dashboard/Arbitrage",
                } : {},
                //added by parth andhariya (04-05-2019) guid na change baki 
                // checkAndGetMenuAccessDetail('1CB9A7EB-315B-1A0B-1E71-5F4119D20FBF') ? { //1CB9A7EB-315B-1A0B-1E71-5F4119D20FBF
                //     menu_title: "sidebar.Arbitrage",
                //     path: "/app/dashboard/Arbitrage",
                // } : {},
            ]
        } : {},
        /* {
            menu_title: "sidebar.myAccount",
            menu_icon: "zmdi zmdi-view-dashboard",
            child_routes: [
                {
                    menu_title: "sidebar.personalDashboard",
                    path: "/app/my-account/personal-dashboard"
                },
                {
                    menu_title: "sidebar.resetPassword",
                    path: "/app/my-account/reset-password"
                },
                {
                    menu_title: "sidebar.forgotPassword",
                    path: "/app/my-account/forgot-password"
                },
                {
                    menu_title: "sidebar.userList",
                    path: "/app/my-account/users"
                },
                {
                    menu_title: "sidebar.customers",
                    path: "/app/my-account/customers"
                },
                {
                    menu_title: "sidebar.usersSignupReport",
                    path: "/app/my-account/users-signup-report"
                },
                {
                    menu_title: "sidebar.profile",
                    path: "/app/my-account/profiles"
                },
                {
                    menu_title: "sidebar.roles",
                    path: "/app/my-account/roles"
                },
                {
                    menu_title: "sidebar.kycVerify",
                    path: "/app/my-account/kyc-verify"
                },
                {
                    menu_title: "sidebar.patternAssignments",
                    path: "/app/my-account/patterns-assignments"
                },
                {
                    "menu_title": "sidebar.membershipUpgrade",
                    "path": "/app/my-account/membership-level-upgrade-request",
                },
                {
                    "menu_title": "sidebar.complainReports",
                    "path": "/app/my-account/complain-reports",
                },
                {
                    "menu_title": "sidebar.slaConfiguration",
                    "path": "/app/my-account/sla-configuration",
                }
            ]
        }, */
        /* {
            menu_title: "sidebar.socialProfile",
            menu_icon: "zmdi zmdi-view-dashboard",
            child_routes: [
                {
                    menu_title: "sidebar.socialTradingPolicy",
                    path: "/app/social-profile/social-trading-policy"
                },
            ]
        }, */
        /*  {
             menu_title: "sidebar.apiconfAdd",
             menu_icon: "zmdi zmdi-wrench",
             path: "/app/apiconf-add-gen",
             child_routes: null
         }, */
        /* {
            menu_title: "sidebar.walletMenu",
            menu_icon: "zmdi zmdi-balance-wallet",
            path: "/app/wallet-dashboard",
            child_routes: null
        }, */
        /*   {
              menu_title: "sidebar.report",
              menu_icon: "zmdi zmdi-view-dashboard",
              child_routes: [
                  {
                      menu_title: "sidebar.emailQueueReport",
                      path: "/app/Reports/EmailQueueReport"
                  },
                  {
                      menu_title: "sidebar.MessageQueue",  // commented by jayesh - moved to drawer 30-01-2019
                      path: "/app/Reports/MessageQueue"
                  },
              ]
          }, */
        /* permission based menu rendering - added by devang (9-4-2019) */
        /* checkAndGetMenuAccessDetail('NOT_PROVIDED') ? {  // not generated because this is not a main menu
            menu_title: "sidebar.pushnotificationqueue",  //Added by Khushbu Badheka D:08/01/2019
            menu_icon: "zmdi zmdi-view-dashboard",
            path: "/app/pushNotificationQueue",
            child_routes: null
        } : {}, */
        /*     {
                menu_title: "sidebar.pushMessage",  //Added by Megha Kariya 
                menu_icon: "zmdi zmdi-view-dashboard",   // commented by jayesh - moved to drawer 30-01-2019
                path: "/app/pushMessage",
                child_routes: null
            }, */
        /*   {
              // From Jinesh
              menu_title:"sidebar.PushEmail",  // commented by jayesh - moved to drawer 30-01-2019
              path:"/app/PushEmail/"
          
          }, */
        /*  {
             menu_title: "sidebar.EmailApiManager",
             path: "/app/EmailApiManager"
         } */ // Comment by Megha Kariya (23/02/2019) : added into CMS

    ],
    category2: [

        /* permission based menu rendering - added by devang (9-4-2019) */
        checkAndGetMenuAccessDetail('1044742A-0BA6-59A6-3C56-E38BCBBC3DAC') ? {
            menu_title: "sidebar.localization",
            menu_icon: "zmdi zmdi-file-text",
            child_routes: [

                checkAndGetMenuAccessDetail('9E14E490-A50C-497A-00C5-D918B3C51B18') ? {
                    path: "/app/localization/country",
                    menu_title: "sidebar.countries"
                } : {},
                checkAndGetMenuAccessDetail('3D457BBA-A00F-6FE6-4AE6-93CAB089A400') ? {
                    path: "/app/localization/state",
                    menu_title: "sidebar.states"
                } : {},
                checkAndGetMenuAccessDetail('0B0B4A82-6DA8-043F-6145-9E5D397B60B5') ? {
                    path: "/app/localization/city",
                    menu_title: "sidebar.cities"
                } : {},
                checkAndGetMenuAccessDetail('3EF4A78D-18AB-572A-68AC-63AF4C0E7DCB') ? {
                    path: "/app/localization/zipcodes", //Added by dhara gajera 8/2/2019
                    menu_title: "sidebar.zipcodes"
                } : {},
                /*  {
                     path: "/app/localization/language",
                     menu_title: "sidebar.languages"
                 } */ // Comment By Megha Kariya (28/02/2019)
            ]

        } : {}

    ]
};
