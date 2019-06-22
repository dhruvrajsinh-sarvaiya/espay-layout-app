import React, { Component } from 'react';
import { FlatList } from 'react-native';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../native_theme/components/CustomToolbar'
import { changeTheme } from '../../controllers/CommonUtils';
import MenuListItem from '../../native_theme/components/MenuListItem';
import { Category } from './MyAccount';
import R from '../../native_theme/R';
import { getData } from '../../App';
import { ServiceUtilConstant } from '../../controllers/Constants';
import { addRouteToBackPress } from '../Navigation';
import SafeView from '../../native_theme/components/SafeView';

class AccountSubMenu extends Component {

    constructor(props) {
        super(props)

        let title = 'Menus', prevCategory = Category.Menu, category = Category.Menu, pairName = ''

        let { params } = props.navigation.state;

        if (params !== undefined) {
            title = params.title;
            prevCategory = params.category;
            category = params.category;

            if (params.pairName !== undefined) {
                pairName = params.pairName;
            }
        }

        //data pass for listing screen title,icon,screen redirection name
        this.state = {
            title,
            prevCategory,
            category,
            pairName,
            subLevels: [{
                id: 0,
                title,
                prevCategory,
                category,
            }],
            // Category wise display submenu screen 
            data: [

                // Static Menu If anyhow screen is open without any params
                { title: R.strings.Accounts, screenname: '', subCategory: Category.Account, category: Category.Menu },
                { title: R.strings.identityAuthentication, screenname: '', subCategory: Category.KYC, category: Category.Menu },
                { title: R.strings.Support, screenname: '', subCategory: Category.Support, category: Category.Menu },
                { title: R.strings.policy, screenname: '', subCategory: Category.Policy, category: Category.Menu },
                { title: R.strings.reports, screenname: '', subCategory: Category.Report, category: Category.Menu },
                { title: R.strings.Exchange, screenname: '', subCategory: Category.Exchange, category: Category.Menu },
                { title: R.strings.Session, screenname: '', subCategory: Category.Session, category: Category.Menu },
                { title: R.strings.Announcement, screenname: '', subCategory: Category.Announcement, category: Category.Menu },
                { title: R.strings.wallet, screenname: '', subCategory: Category.Wallet, category: Category.Menu },
                { title: R.strings.SocialProfile, screenname: '', subCategory: Category.SocialProifle, category: Category.Menu },
                { title: R.strings.affiliate, screenname: '', subCategory: Category.Affiliate, category: Category.Menu },
                { title: R.strings.margin, screenname: '', subCategory: Category.Margin, category: Category.Menu },
                { title: R.strings.apiPlan, screenname: '', subCategory: Category.apiPlan, category: Category.Menu },

                // Contains SubMenu of support 
                { title: R.strings.About_Us, screenname: 'AboutUs', icon: R.images.IC_ABOUT_US, category: Category.Support },
                { title: R.strings.Contact_Us, screenname: 'ContactUs', icon: R.images.IC_CONTACT_US, category: Category.Support },
                { title: R.strings.complaint, screenname: 'ComplainScreen', icon: R.images.IC_COMPLAINT, category: Category.Support },
                { title: R.strings.faq, screenname: 'FAQsScreen', icon: R.images.IC_QUESTION, category: Category.Support },
                { title: R.strings.Chat, screenname: 'ChatScreen', icon: R.images.IC_COMPLAINT, category: Category.Support },
                { title: R.strings.Survey, screenname: 'SurveyMenuScreen', icon: R.images.IC_SURVEY, category: Category.Support },
                { title: R.strings.HelpCenter, screenname: 'HelpCenter', icon: R.images.IC_QUESTION, category: Category.Support },
                // { title: R.strings.coinList, screenname: 'CoinListRequestScreen', icon: R.images.IC_COIN_LISTING, category: Category.Support },
                //{ title: R.strings.Sitemap, screenname: 'SitemapScreen', icon: R.images.IC_SITEMAP, category: Category.Support },

                // Contains SubMenu of Policy 
                { title: R.strings.Privacy_Policy, screenname: 'PrivacyPolicy', icon: R.images.IC_PRIVACY_POLICY, category: Category.Policy },
                { title: R.strings.Refund_Policy, screenname: 'RefundPolicy', icon: R.images.IC_REFUND_POLICY, category: Category.Policy },
                { title: R.strings.Terms_Condition, screenname: 'TermConditionScreen', icon: R.images.IC_TERMS_CONDITION, category: Category.Policy },
                { title: R.strings.terms_of_service, screenname: 'TermsOfServiceScreen', icon: R.images.IC_TERMS_CONDITION, category: Category.Policy },
                { title: R.strings.legal_statement, screenname: 'LegalStatementScreen', icon: R.images.IC_STATEMENT, category: Category.Policy },
                { title: R.strings.application_center, screenname: 'ApplicationCenterScreen', icon: R.images.IC_APP_CENTER, category: Category.Policy },
                { title: R.strings.fees_charges, screenname: 'FeesAndChargesScreen', icon: R.images.IC_FEES_CHARGES, category: Category.Policy },

                // Contains SubMenu of KYC
                { title: R.strings.kyc_personal_actionbar_title, screenname: 'KYCPersonalInfoScreen', icon: R.images.IC_USER, category: Category.KYC },

                //Contains SubMenu of Margin
                { title: R.strings.margin, screenname: '', icon: R.images.IC_TRADEUP, category: Category.Report, subCategory: Category.Margin },
                { title: R.strings.Withdraw_History, screenname: 'WithdrawHistory', icon: R.images.IC_WITHDRAW_HISTORY, category: Category.Report },
                { title: R.strings.DepositHistory, screenname: 'DepositHistory', icon: R.images.IC_DEPOSIT_HISTORY, category: Category.Report },
                { title: R.strings.TransferInHistory, screenname: 'TransferInHistoryResult', icon: R.images.IC_DEPOSIT, category: Category.Report },
                { title: R.strings.TransferoutHistory, screenname: 'TransferOutHistoryResult', icon: R.images.IC_WITHDRAW, category: Category.Report },
                { title: R.strings.SiteTokenHistory, screenname: 'SiteTokenConversionHistory', icon: R.images.IC_DEPOSIT_HISTORY, category: Category.Report },
                { title: R.strings.TokenStacking_History, screenname: 'TokenStackingHistoryResult', icon: R.images.IC_WITHDRAW_HISTORY, category: Category.Report },
                { title: R.strings.Whitelist_Address_History, screenname: 'AddressWhitelistHistoryResult', icon: R.images.IC_DEPOSIT_HISTORY, category: Category.Report },
                { title: R.strings.Ip_History, screenname: 'IpHistoryResult', icon: R.images.IC_DEPOSIT_HISTORY, category: Category.Report },
                { title: R.strings.UserLedger, screenname: 'UserLedger', icon: R.images.IC_USER_LEDGER, category: Category.Report },
                { title: R.strings.TradingSummary, screenname: getData(ServiceUtilConstant.KEY_IsMargin) ? 'MarginTradingSummaryScreen' : 'TradingSummary', icon: R.images.IC_CHART, category: Category.Report },
                { title: R.strings.PendingRequests, screenname: 'AcceptRejectWalletRequest', icon: R.images.IC_WITHDRAW_HISTORY, category: Category.Report },
                { title: R.strings.LeaderBoard, screenname: 'LeaderBoardList', icon: R.images.IC_USER_LEDGER, category: Category.Report },
                { title: R.strings.openOrder, screenname: getData(ServiceUtilConstant.KEY_IsMargin) ? 'MarginOpenOrder' : 'OpenOrder', icon: R.images.IC_CHART, category: Category.Report },

                // Contains SubMenu of Exchange
                { title: R.strings.list_coin, screenname: 'CoinListRequestScreen', icon: R.images.IC_COIN_LISTING, category: Category.Exchange },
                { title: R.strings.coin_info, screenname: 'ListCoinScreen', icon: R.images.IC_INFO, category: Category.Exchange },

                // Contains SubMenu of Session
                { title: R.strings.ipWhitelisting, screenname: 'IPWhitelistScreen', icon: R.images.IC_IP_LIST, category: Category.Session },
                { title: R.strings.DeviceWhitelist, screenname: 'DeviceWhitelistScreen', icon: R.images.IC_DEVICE_WHITELIST, category: Category.Session },
                { title: R.strings.Login_History, screenname: 'LoginHistoryResult', icon: R.images.IC_LOGIN_HISTORY, category: Category.Session },
                { title: R.strings.activityLogHistory, screenname: 'ActivityLogScreen', icon: R.images.IC_LOGIN_HISTORY, category: Category.Session },

                // Contains SubMenu of Announcement
                { title: R.strings.News_Section, screenname: 'NewsSection', icon: R.images.IC_NEWS, category: Category.Announcement },

                // Contains SubMenu of Wallet
                { title: R.strings.LimitControl, screenname: 'LimitControl', icon: R.images.IC_ARROW_RIGHT_BOLD, category: Category.Wallet },
                { title: R.strings.Token_Stack, screenname: 'TokenStackingScreen', icon: R.images.IC_ARROW_RIGHT_BOLD, category: Category.Wallet },
                { title: R.strings.WalletSharing, screenname: 'ListWallets', icon: R.images.IC_ARROW_RIGHT_BOLD, category: Category.Wallet },
                { title: R.strings.ConverToSiteToken, screenname: 'SiteTokenConversion', icon: R.images.IC_ARROW_RIGHT_BOLD, category: Category.Wallet },
                { title: R.strings.withdrawalAddressManagement, screenname: 'AddreesWhiteListMainScreen', icon: R.images.IC_ARROW_RIGHT_BOLD, category: Category.Wallet },
                // { title: R.strings.CoinConfiguration, screenname: 'AddCurrencyLogo', icon: R.images.IC_ARROW_RIGHT_BOLD, category: Category.Wallet },

                // Contains SubMenu of Margin
                { title: R.strings.marginWalletLedger, screenname: 'MarginWalletLedgerScreen', icon: R.images.IC_ARROW_RIGHT_BOLD, category: Category.Margin },
                { title: R.strings.MarginWallets, screenname: 'MarginWalletList', icon: R.images.IC_ARROW_RIGHT_BOLD, category: Category.Margin },
                { title: R.strings.LeverageReport, screenname: 'LeverageReport', icon: R.images.IC_ARROW_RIGHT_BOLD, category: Category.Margin },
                { title: R.strings.marginTradingHistory, screenname: 'MarginTradingHistory', icon: R.images.IC_ARROW_RIGHT_BOLD, category: Category.Margin },
                { title: R.strings.marginProfitLossReport, screenname: 'MarginProfitLossReportScreen', icon: R.images.IC_ARROW_RIGHT_BOLD, category: Category.Margin },
                { title: R.strings.openPositionReport, screenname: 'OpenPositionReportScreen', icon: R.images.IC_ARROW_RIGHT_BOLD, category: Category.Margin },

                // Contains SubMenu of ApiPlan
                { title: R.strings.apiPlan, screenname: 'ApiPlanListScreen', icon: R.images.IC_ARROW_RIGHT_BOLD, category: Category.apiPlan },
                { title: R.strings.apiKey, screenname: 'ViewPublicApiKey', icon: R.images.IC_ARROW_RIGHT_BOLD, category: Category.apiPlan },
            ],
        }

        //Add Current Screen to Manual Handling BackPress Events
        addRouteToBackPress(props);

        //To Bind All Method
        this.onBackPress = this.onBackPress.bind(this);
        this.props.navigation.setParams({ onBackPress: this.onBackPress });
        // --------------
    }

    componentDidMount = () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    };

    // for redirect to seletion screen
    moveToScreen(item) {
        let { title, screenname = '', category, subCategory = '' } = item;

        if (screenname != '') {
            var { navigate } = this.props.navigation;

            let options = { pairName: this.state.pairName };

            if (screenname === 'OpenOrder') {
                options = {
                    ...options,
                    shouldDisplay: true
                }
            }
            navigate(screenname, options);
        } else {
            if (subCategory !== '') {
                let subLevels = this.state.subLevels;
                subLevels.push({
                    id: this.state.subLevels[this.state.subLevels.length - 1].id + 1,
                    title,
                    category: subCategory,
                    prevCategory: category
                })
                this.setState({ title, category: subCategory, prevCategory: category, subLevels });
            }
        }
    }

    onBackPress() {
        if (this.state.subLevels.length > 1) {
            //To get Preivous Screen Category
            let prevItem = this.state.subLevels[this.state.subLevels.length - 2];

            //To remove last item from array
            let subLevels = this.state.subLevels;
            subLevels.splice(subLevels.length - 1, 1);

            //To update state as per previous screen
            this.setState({ ...prevItem, subLevels })
        } else {

            let { params } = this.props.navigation.state;

            //refresh previous screen list
            if (params && params.refresh !== undefined) {
                params.refresh();
            }
            this.props.navigation.goBack();
        }
    }

    render() {
        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar title={this.state.title} isBack={true} nav={this.props.navigation} onBackPress={this.onBackPress} />

                {/* show list of screen title */}
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={this.state.data.filter((item) => item.category == this.state.category)}
                    renderItem={({ item }) => (
                        <MenuListItem
                            title={item.title}
                            icon={item.icon}
                            onPress={() => this.moveToScreen(item)} />
                    )}
                    keyExtractor={item => item.title}
                />
            </SafeView>
        )
    }
}

export default AccountSubMenu;