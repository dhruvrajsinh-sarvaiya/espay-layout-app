import React, { Component } from 'react';
import { View, ScrollView, Image, Platform } from 'react-native';
import { connect } from 'react-redux';
import ImageButton from '../../native_theme/components/ImageTextButton';
import R from '../../native_theme/R';
import Separator from '../../native_theme/components/Separator';
import { validateResponseNew, isEmpty } from '../../validations/CommonValidation';
import { Category } from '../CMS/MyAccount';
import { showAlert, changeTheme, sendEvent, getAppLogo } from '../../controllers/CommonUtils';
import { getData, setData } from '../../App';
import { ServiceUtilConstant, Events } from '../../controllers/Constants';
import { isCurrentScreen } from '../Navigation';
import LinearGradient from 'react-native-linear-gradient';
import TextViewMR from '../../native_theme/components/TextViewMR';
import SafeView from '../../native_theme/components/SafeView';
import { getCardStyle } from '../../native_theme/components/CardView';

const NavigationDrawerConstant = {
    Account: 0,
    Deposit: 1,
    Withdraw: 2,
    Funds: 3,
    OrderManagementScreen: 4,
    Wallet: 5,
    Share: 6,
    TellAFriend: 7,
    Report: 8,
    AboutUs: 9,
    Security: 10,
    Settings: 11,
    ContactUs: 12,
    Logout: 13,
    Trading: 14,
    Margin: 15,
};

class NavigationDrawer extends Component {
    constructor(props) {
        super(props);

        // create reference
        this.drawer = React.createRef();

        // bind method 
        this.handleClickEvent = this.handleClickEvent.bind(this);

        // define state
        this.state = {
            fullName: '',
            isNavigate: false,
            screenName: '',
            screenParams: {},
        };
    }

    componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //To get firstname and lastname from stored data
        let firstName = getData(ServiceUtilConstant.FIRSTNAME);
        let lastName = getData(ServiceUtilConstant.LASTNAME);
        let userName = getData(ServiceUtilConstant.KEY_USER_NAME);

        //if firstName & lastName is not empty than store name in state
        if (!isEmpty(firstName) && !isEmpty(lastName)) {
            this.setState({ fullName: firstName + ' ' + lastName });
        } else if (!isEmpty(userName)) {
            this.setState({ fullName: userName });
        }
    }

    componentDidUpdate() {
        //if drawer close then and only then navigate module
        if (!this.props.navigation.state.isDrawerOpen) {
            if (this.state.isNavigate) {
                this.setState({
                    isNavigate: false
                }, () => {
                    if (this.state.screenName === 'Logout') {
                        //redirect user to login
                        showAlert(R.strings.Logout, R.strings.logout_message, 4, async () => {
                            sendEvent(Events.SessionLogout);
                        }, R.strings.cancel);
                    } else {
                        this.props.navigation.navigate(this.state.screenName, this.state.screenParams)
                    }
                })
            }
        }
    }

    shouldComponentUpdate(nextProps, nextState) {

        //To get old name and new name if there's changes then refresh screen.
        let oldName = this.props.preference[ServiceUtilConstant.FIRSTNAME] + ' ' + this.props.preference[ServiceUtilConstant.LASTNAME];
        let newName = nextProps.preference[ServiceUtilConstant.FIRSTNAME] + ' ' + nextProps.preference[ServiceUtilConstant.LASTNAME];
        let isMargin = nextProps.preference[ServiceUtilConstant.KEY_IsMargin] + ' ' + nextProps.preference[ServiceUtilConstant.KEY_IsMargin];

        //If theme or locale is changed then update componenet
        if (this.props.preference.theme !== nextProps.preference.theme || this.props.preference.locale !== nextProps.preference.locale || oldName !== newName || isMargin !== nextProps.preference.isMargin) {
            return true;
        } else {
            return isCurrentScreen(nextProps);
        }
    };

    static getDerivedStateFromProps(props, state) {

        try {

            let firstName = props.preference[ServiceUtilConstant.FIRSTNAME];
            let lastName = props.preference[ServiceUtilConstant.LASTNAME];
            let userName = props.preference[ServiceUtilConstant.KEY_USER_NAME];

            //if firstName & lastName is not empty than store name
            if (!isEmpty(firstName) && !isEmpty(lastName)) {

                let fullName = firstName + ' ' + lastName;

                //if props user name and state's full name is different than store new name
                if (fullName !== state.fullName) {
                    return Object.assign({}, state, {
                        fullName
                    })
                }
            } else if (!isEmpty(userName)) {
                if (state.fullName !== userName) {
                    return Object.assign({}, state, {
                        fullName: userName
                    })
                }
            }
        } catch (error) {
            return null;
        }

        if (isCurrentScreen(props)) {

            if (props.isMargin !== state.isMargin) {
                return Object.assign({}, state, { isMargin: props.isMargin });
            }

            let { updateData: { data } } = props

            // To check data is null or not
            if (data) {

                //if local viewProfile state is null or its not null and also different then new response then and only then validate response.
                if (state.viewProfile == null || (state.viewProfile != null && data !== state.viewProfile)) {
                    let temp = {
                        viewProfile: data
                    };

                    try {
                        //logger("response", data);
                        //currently use status code as success temprory
                        if (validateResponseNew({ response: data, isList: true })) {

                            temp = {
                                ...temp,
                                fullName: data.UserData.FirstName + ' ' + data.UserData.LastName
                            }
                        }
                    } catch (error) {
                        //perform catch operation
                    }
                    return Object.assign({}, state, temp)
                }
            }
        }

        return null;
    }

    handleClickEvent(event) {
        // to close drawer if open
        if (event != NavigationDrawerConstant.Trading || event != NavigationDrawerConstant.Margin) this.props.navigation.closeDrawer();

        let screenName = '';
        let screenParams = {};

        switch (event) {
            //Redirect to My Account
            case NavigationDrawerConstant.Account: {
                screenName = 'MyAccount';
                break;
            }

            //Redirect To Deposit
            case NavigationDrawerConstant.Deposit: {
                screenName = 'CoinSelectScreen';
                screenParams = { isAction: ServiceUtilConstant.From_Deposit };
                break;
            }

            //Redirect To Withdraw
            case NavigationDrawerConstant.Withdraw: {
                screenName = 'CoinSelectScreen';
                screenParams = { isAction: ServiceUtilConstant.From_Withdraw };
                break;
            }

            //Redirect To Funds
            case NavigationDrawerConstant.Funds: {
                screenName = 'FundViewScreen';
                break;
            }

            //Redirect To Order History
            case NavigationDrawerConstant.OrderManagementScreen: {
                screenName = getData(ServiceUtilConstant.KEY_IsMargin) ? 'MarginOrderManagementScreen' : 'OrderManagementScreen';
                break;
            }

            //Redirect To Wallets
            case NavigationDrawerConstant.Wallet: {
                screenName = 'AccountSubMenu';
                screenParams = { category: Category.Wallet, title: R.strings.wallet }
                break;
            }

            //Redirect To Social Profile
            case NavigationDrawerConstant.Share: {
                if (getData(ServiceUtilConstant.KEY_SocialProfilePlan)) {
                    screenName = 'SocialProfileDashboard';
                } else {
                    screenName = 'SocialProfileSubscription';
                }
                break;
            }

            //Redirect To Invitation Program aka Referral Program
            case NavigationDrawerConstant.TellAFriend: {
                screenName = 'RefereAndEarn';
                break;
            }

            //Redirect To Reports
            case NavigationDrawerConstant.Report: {
                screenName = 'AccountSubMenu';
                screenParams = { category: Category.Report, title: R.strings.reports, pairName: this.state.currencyPair };
                break;
            }

            //Redirect To About Us Page
            case NavigationDrawerConstant.AboutUs: {
                screenName = 'AboutUs';
                break;
            }

            //Redirect To Security Settings
            case NavigationDrawerConstant.Security: {
                screenName = 'Security';
                break;
            }

            //Redirect To Settings
            case NavigationDrawerConstant.Settings: {
                screenName = 'SettingScreen';
                break;
            }

            //Redirect To Contact Us
            case NavigationDrawerConstant.ContactUs: {
                screenName = 'ContactUs';
                break;
            }

            //Logout User
            case NavigationDrawerConstant.Logout: {
                screenName = 'Logout';
                break;
            }

            //Redirect To Contact Us
            case NavigationDrawerConstant.Trading: {
                setData({ [ServiceUtilConstant.KEY_IsMargin]: false });
                break;
            }

            //Redirect To Contact Us
            case NavigationDrawerConstant.Margin: {
                setData({ [ServiceUtilConstant.KEY_IsMargin]: true });
                break;
            }
        }

        //set screen Name and screen parameters and isNavigate state
        this.setState({ screenName, screenParams, isNavigate: isEmpty(screenName) ? false : true })
    }

    render() {

        // get image url and replace with logo1 to logo3 for new image get
        let imageUrl = getAppLogo();
        let logoUrl = imageUrl.replace("Logo1", "Logo3");

        //Change Language Forcefully if not changed
        if (R.strings.getLanguage() !== this.props.preference.locale) {
            R.strings.setLanguage(this.props.preference.locale);
        }

        //Change Theme Forcefully if not changed
        if (R.colors.getTheme() !== this.props.preference.theme) {
            R.colors.setTheme(this.props.preference.theme);
        }

        return (
            <SafeView style={[this.props.width !== undefined ? { width: this.props.width, height: '100%', ...getCardStyle(R.dimens.CardViewElivation), zIndex: R.dimens.CardViewElivation } : { flex: 1 }, { justifyContent: 'space-between', backgroundColor: R.colors.background }]}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{ flex: 1, }}>
                    <View style={{
                        paddingTop: this.props.width !== undefined ? R.dimens.margin : R.dimens.activity_margin,
                        paddingLeft: this.props.width !== undefined ? R.dimens.margin : R.dimens.activity_margin,
                        paddingRight: this.props.width !== undefined ? R.dimens.margin : R.dimens.activity_margin
                    }}>
                        {/* Image and User Name */}
                        <View style={{ width: '100%', padding: R.dimens.WidgetPadding, marginBottom: R.dimens.widget_top_bottom_margin }}>

                            <View>
                                <LinearGradient
                                    style={{
                                        alignSelf: 'center',
                                        width: R.dimens.Verify_Image_Width_Height,
                                        height: R.dimens.Verify_Image_Width_Height,
                                        marginBottom: R.dimens.widget_top_bottom_margin,
                                        borderRadius: R.dimens.Verify_Image_Width_Height / 2,
                                    }}
                                    locations={[0, 1]}
                                    colors={[R.colors.linearStart, R.colors.linearEnd]}>
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                        {/* if Image Url is get than show logo which is get from Url otherwise Show static image of CoolDex  */}
                                        {logoUrl != null ? <Image
                                            source={{ uri: Platform.OS === 'android' ? logoUrl : ('' + logoUrl) }}
                                            style={{
                                                alignSelf: 'center',
                                                // tintColor: R.colors.white,
                                                height: R.dimens.icon_header_width_height,
                                                width: R.dimens.icon_header_width_height
                                            }}
                                        /> : <Image
                                                source={R.images.IC_DRAWER_APP_ICON}
                                                style={{
                                                    alignSelf: 'center',
                                                    tintColor: R.colors.white,
                                                    height: R.dimens.icon_header_width_height,
                                                    width: R.dimens.icon_header_width_height
                                                }}
                                            />
                                        }
                                    </View>
                                </LinearGradient>

                                {/* My Account */}
                                <ImageButton
                                    icon={R.images.IC_SETTINGS_OUTLINE}
                                    onPress={() => this.handleClickEvent(NavigationDrawerConstant.Account)}
                                    iconStyle={{
                                        width: R.dimens.dashboardMenuIcon,
                                        height: R.dimens.dashboardMenuIcon,
                                        tintColor: null
                                    }}
                                    style={{ position: 'absolute', bottom: 0, right: 0 }} />
                            </View>
                            <TextViewMR style={{ width: '100%', textAlign: 'center', color: R.colors.textPrimary, fontSize: R.dimens.mediumText }}> {R.strings.welcome} </TextViewMR>
                            <TextViewMR style={{ width: '100%', textAlign: 'center', color: R.colors.textPrimary, fontSize: R.dimens.mediumText }}> {this.state.fullName} </TextViewMR>
                        </View>

                        <Separator />

                        {/* Deposit, Withdraw, & Funds Menu */}
                        <View style={{
                            marginTop: R.dimens.widget_top_bottom_margin,
                            marginBottom: R.dimens.widget_top_bottom_margin,
                            flexDirection: 'row',
                            width: '100%'
                        }}>
                            <ImageButton
                                isVertical={true}
                                icon={R.images.IC_DEPOSIT_GRADIANT}
                                name={R.strings.deposit}
                                onPress={() => this.handleClickEvent(NavigationDrawerConstant.Deposit)}
                                textStyle={{
                                    color: R.colors.textPrimary,
                                    fontSize: R.dimens.smallestText
                                }}
                                isMR
                                numberOfLines={1}
                                iconStyle={{
                                    width: R.dimens.drawerMenuIconWidthHeight,
                                    height: R.dimens.drawerMenuIconWidthHeight,
                                    tintColor: null
                                }}
                                style={{ flex: 1 }} />
                            <ImageButton
                                isVertical={true}
                                icon={R.images.IC_WITHDRAW_GRADIANT}
                                name={R.strings.Withdraw}
                                onPress={() => this.handleClickEvent(NavigationDrawerConstant.Withdraw)}
                                textStyle={{
                                    color: R.colors.textPrimary,
                                    fontSize: R.dimens.smallestText
                                }}
                                isMR
                                numberOfLines={1}
                                iconStyle={{
                                    width: R.dimens.drawerMenuIconWidthHeight,
                                    height: R.dimens.drawerMenuIconWidthHeight,
                                    tintColor: null
                                }}
                                style={{ flex: 1 }} />
                            <ImageButton
                                isVertical={true}
                                icon={R.images.IC_POINTCARD}
                                name={R.strings.Funds}
                                onPress={() => this.handleClickEvent(NavigationDrawerConstant.Funds)}
                                textStyle={{
                                    color: R.colors.textPrimary,
                                    fontSize: R.dimens.smallestText
                                }}
                                isMR
                                numberOfLines={1}
                                iconStyle={{
                                    width: R.dimens.drawerMenuIconWidthHeight,
                                    height: R.dimens.drawerMenuIconWidthHeight,
                                    tintColor: null
                                }}
                                style={{ flex: 1 }} />
                        </View>

                        <Separator />

                        <View style={{ alignItems: 'flex-start' }}>
                            {/* Order Management, Wallets, Social Profile, Reports & Invitation Program Menu */}
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <ImageButton
                                    icon={R.images.IC_TRADEUP}
                                    name={R.strings.trading}
                                    numberOfLines={1}
                                    onPress={() => this.handleClickEvent(NavigationDrawerConstant.Trading)}
                                    textStyle={{
                                        color: getData(ServiceUtilConstant.KEY_IsMargin) ? R.colors.textSecondary : R.colors.textPrimary,
                                        marginLeft: R.dimens.widgetMargin
                                    }}
                                    isMR
                                    isLeftIcon
                                    iconStyle={{
                                        width: R.dimens.dashboardMenuIcon,
                                        height: R.dimens.dashboardMenuIcon,
                                        tintColor: getData(ServiceUtilConstant.KEY_IsMargin) ? R.colors.textSecondary : null
                                    }}
                                    style={{
                                        flex: 1,
                                        marginBottom: R.dimens.widgetMargin
                                    }} />
                                <View style={{ width: R.dimens.separatorHeight, height: '50%', backgroundColor: R.colors.textSecondary }} />
                                <ImageButton
                                    icon={R.images.IC_TRADEUP}
                                    name={R.strings.margin}
                                    numberOfLines={1}
                                    onPress={() => this.handleClickEvent(NavigationDrawerConstant.Margin)}
                                    textStyle={{
                                        color: getData(ServiceUtilConstant.KEY_IsMargin) ? R.colors.textPrimary : R.colors.textSecondary,
                                        marginLeft: R.dimens.widgetMargin
                                    }}
                                    isMR
                                    isLeftIcon
                                    iconStyle={{
                                        width: R.dimens.dashboardMenuIcon,
                                        height: R.dimens.dashboardMenuIcon,
                                        tintColor: getData(ServiceUtilConstant.KEY_IsMargin) ? null : R.colors.textSecondary
                                    }}
                                    style={{
                                        flex: 1,
                                        marginBottom: R.dimens.widgetMargin
                                    }} />
                            </View>
                            <ImageButton
                                icon={R.images.ic_history}
                                name={R.strings.orderManagement}
                                numberOfLines={1}
                                onPress={() => this.handleClickEvent(NavigationDrawerConstant.OrderManagementScreen)}
                                textStyle={{
                                    color: R.colors.textPrimary,
                                    marginLeft: R.dimens.widgetMargin
                                }}
                                isMR
                                isLeftIcon
                                iconStyle={{
                                    width: R.dimens.dashboardMenuIcon,
                                    height: R.dimens.dashboardMenuIcon,
                                    tintColor: null
                                }}
                                style={{
                                    marginBottom: R.dimens.widgetMargin
                                }} />
                            <ImageButton
                                icon={R.images.IC_WALLET}
                                name={R.strings.wallet}
                                numberOfLines={1}
                                onPress={() => this.handleClickEvent(NavigationDrawerConstant.Wallet)}
                                textStyle={{
                                    color: R.colors.textPrimary,
                                    marginLeft: R.dimens.widgetMargin
                                }}
                                isMR
                                isLeftIcon
                                iconStyle={{
                                    width: R.dimens.dashboardMenuIcon,
                                    height: R.dimens.dashboardMenuIcon,
                                    tintColor: null
                                }}
                                style={{
                                    marginBottom: R.dimens.widgetMargin
                                }} />

                            <ImageButton
                                icon={R.images.IC_SHARE}
                                name={R.strings.SocialProfile}
                                numberOfLines={1}
                                onPress={() => this.handleClickEvent(NavigationDrawerConstant.Share)}
                                textStyle={{
                                    color: R.colors.textPrimary,
                                    marginLeft: R.dimens.widgetMargin,
                                }}
                                isMR
                                isLeftIcon
                                iconStyle={{
                                    width: R.dimens.dashboardMenuIcon,
                                    height: R.dimens.dashboardMenuIcon,
                                    tintColor: null
                                }}
                                style={{
                                    marginBottom: R.dimens.widgetMargin
                                }} />

                            <ImageButton
                                icon={R.images.IC_GRADIANT_GIFT}
                                name={R.strings.ReferrelProgram}
                                numberOfLines={1}
                                textStyle={{
                                    color: R.colors.textPrimary,
                                    marginLeft: R.dimens.widgetMargin
                                }}
                                isMR
                                isLeftIcon
                                iconStyle={{
                                    width: R.dimens.dashboardMenuIcon,
                                    height: R.dimens.dashboardMenuIcon,
                                    tintColor: null
                                }}
                                style={{
                                    marginBottom: R.dimens.widgetMargin
                                }}
                                onPress={() => this.handleClickEvent(NavigationDrawerConstant.TellAFriend)} />
                            <ImageButton
                                icon={R.images.IC_GRADIENT_REPORT}
                                name={R.strings.reports}
                                numberOfLines={1}
                                onPress={() => this.handleClickEvent(NavigationDrawerConstant.Report)}
                                textStyle={{
                                    color: R.colors.textPrimary,
                                    marginLeft: R.dimens.widgetMargin
                                }}
                                isMR
                                isLeftIcon
                                iconStyle={{
                                    width: R.dimens.dashboardMenuIcon,
                                    height: R.dimens.dashboardMenuIcon,
                                    tintColor: null
                                }} />

                        </View>
                        <Separator />
                        <View>
                            {/* About, Security, Settings, & Contact Us */}
                            <ImageButton
                                name={R.strings.About_Us}
                                numberOfLines={1}
                                onPress={() => this.handleClickEvent(NavigationDrawerConstant.AboutUs)}
                                textStyle={{ color: R.colors.textSecondary }}
                                isHML
                                style={{ marginTop: R.dimens.widget_top_bottom_margin, marginBottom: R.dimens.widgetMargin }} />
                            <ImageButton
                                name={R.strings.Security}
                                numberOfLines={1}
                                onPress={() => this.handleClickEvent(NavigationDrawerConstant.Security)}
                                textStyle={{ color: R.colors.textSecondary }}
                                isHML
                                style={{ marginTop: R.dimens.widgetMargin, marginBottom: R.dimens.widgetMargin }} />
                            <ImageButton
                                name={R.strings.Settings}
                                numberOfLines={1}
                                onPress={() => this.handleClickEvent(NavigationDrawerConstant.Settings)}
                                textStyle={{ color: R.colors.textSecondary }}
                                isHML
                                style={{ marginTop: R.dimens.widgetMargin, marginBottom: R.dimens.widgetMargin }} />
                            <ImageButton
                                name={R.strings.Contact_Us}
                                numberOfLines={1}
                                onPress={() => this.handleClickEvent(NavigationDrawerConstant.ContactUs)}
                                textStyle={{ color: R.colors.textSecondary }}
                                isHML
                                style={{ marginTop: R.dimens.widgetMargin, marginBottom: R.dimens.widget_top_bottom_margin }} />

                        </View>
                    </View>
                </ScrollView>
                <View style={{ justifyContent: 'center', alignItems: 'flex-end' }}>

                    {/* Log Off  */}
                    <ImageButton
                        name={R.strings.logOff}
                        isMR
                        onPress={() => this.handleClickEvent(NavigationDrawerConstant.Logout)}
                        textStyle={{ color: R.colors.accent }} />
                </View>
            </SafeView>
        );
    }
}

function mapStatToProps(state) {
    return {
        // updated state from reducer
        preference: state.preference,
        updateData: state.EditProfileReducer,
    }
}

function mapDispatchToProps(dispatch) {
    return {}
}

export default connect(mapStatToProps, mapDispatchToProps)(NavigationDrawer);