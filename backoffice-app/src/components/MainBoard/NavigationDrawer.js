import React, { Component } from 'react';
import { View, ScrollView, Image } from 'react-native';
import { connect } from 'react-redux';
import ImageButton from '../../native_theme/components/ImageTextButton';
import R from '../../native_theme/R';
import Separator from '../../native_theme/components/Separator';
import { validateResponseNew, isEmpty } from '../../validations/CommonValidation';
import { showAlert, changeTheme, sendEvent } from '../../controllers/CommonUtils';
import { getData } from '../../App';
import { ServiceUtilConstant, Events, Constants } from '../../controllers/Constants';
import { isCurrentScreen } from '../Navigation';
import LinearGradient from 'react-native-linear-gradient';
import TextViewMR from '../../native_theme/components/TextViewMR';
import SafeView from '../../native_theme/components/SafeView';

const NavigationDrawerConstant = {
    Account: 0,
    Trading: 1,
    MarginTrading: 2,
    Wallet: 3,
    MyAccount: 4,
    Cms: 5,
    Chat: 6,
    Settings: 7,
    Logout: 8,
    Localization: 9,
    Arbitrage: 10,
    ApiKeyConfiguration: 11,
};

class NavigationDrawer extends Component {
    constructor(props) {
        super(props);

        // create reference
        this.drawer = React.createRef();

        // Bind all methods
        this.handleClickEvent = this.handleClickEvent.bind(this);

        //Define All State initial state
        this.state = {
            fullName: '',
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

    shouldComponentUpdate(nextProps, nextState) {

        //To get old name and new name if there's changes then refresh screen.
        let oldName = this.props.preference[ServiceUtilConstant.FIRSTNAME] + ' ' + this.props.preference[ServiceUtilConstant.LASTNAME];
        let newName = nextProps.preference[ServiceUtilConstant.FIRSTNAME] + ' ' + nextProps.preference[ServiceUtilConstant.LASTNAME];

        //If theme or locale is changed then update componenet
        if (this.props.preference.theme !== nextProps.preference.theme || this.props.preference.locale !== nextProps.preference.locale || oldName !== newName) {
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

        // check for current screen
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
        this.props.drawer.closeDrawer();

        switch (event) {
            //Redirect to My Account
            case NavigationDrawerConstant.Account: {
                this.props.navigation.navigate('MyAccount')
                break;
            }

            //Redirect To Trading Dashboard
            case NavigationDrawerConstant.Trading: {
                this.props.navigation.navigate('TradingDashboard')
                break;
            }

            //Redirect To Margin Trading
            case NavigationDrawerConstant.MarginTrading: {
                this.props.navigation.navigate('MarginTradingDashboardScreen')
                break;
            }

            //Redirect To Wallets
            case NavigationDrawerConstant.Wallet: {

                this.props.navigation.navigate('WalletMainDashboard')
                break;
            }

            //Redirect To My Account Dashboard
            case NavigationDrawerConstant.MyAccount: {
                this.props.navigation.navigate('MyAccountDashboard')
                break;
            }

            //Redirect To Cms Dashborad
            case NavigationDrawerConstant.Cms: {
                this.props.navigation.navigate('CmsDashBoardScreen')
                break;
            }

            //Redirect To Chat Dashborad
            case NavigationDrawerConstant.Chat: {
                this.props.navigation.navigate('ChatDashboard')
                break;
            }

            //Redirect To Settings
            case NavigationDrawerConstant.Settings: {
                this.props.navigation.navigate('SettingScreen')
                break;
            }

            //Redirect To Arbitrage Dashboard
            case NavigationDrawerConstant.Arbitrage: {
                this.props.navigation.navigate('ArbitrageMainDashboard')
                break;
            }

            //Redirect To Api Key Configuration Dashboard
            case NavigationDrawerConstant.ApiKeyConfiguration: {
                this.props.navigation.navigate('ApiKeyMainDashboard')
                break;
            }

            //Redirect To Localization
            case NavigationDrawerConstant.Localization: {
                this.props.navigation.navigate('SubMenuScreen', { category: Constants.Category.Localization, title: R.strings.localization })
                break;
            }

            //Logout User
            case NavigationDrawerConstant.Logout: {

                //redirect user to login
                showAlert(R.strings.Logout, R.strings.logout_message, 4, async () => {
                    sendEvent(Events.SessionLogout);
                }, R.strings.cancel);
                break;
            }
        }
    }

    render() {

        //Change Language Forcefully if not changed
        if (R.strings.getLanguage() !== this.props.preference.locale) {
            R.strings.setLanguage(this.props.preference.locale);
        }

        //Change Theme Forcefully if not changed
        if (R.colors.getTheme() !== this.props.preference.theme) {
            R.colors.setTheme(this.props.preference.theme);
        }
        return (
            <SafeView style={{ flex: 1, justifyContent: 'space-between', backgroundColor: R.colors.background, }}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{
                        flex: 1,
                    }}>
                    <View style={{
                        paddingTop: R.dimens.activity_margin,
                        paddingLeft: R.dimens.activity_margin,
                        paddingRight: R.dimens.activity_margin
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
                                    colors={[R.colors.cardBalanceBlue, R.colors.accent]}>
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                        <Image
                                            source={R.images.IC_DRAWER_APP_ICON}
                                            style={{
                                                alignSelf: 'center',
                                                tintColor: R.colors.white,
                                                height: R.dimens.icon_header_width_height,
                                                width: R.dimens.icon_header_width_height
                                            }}
                                        />
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

                        <View style={{ alignItems: 'flex-start' }}>
                            {/* Order Management, Wallets, Social Profile, Reports & Invitation Program Menu */}
                            <ImageButton
                                icon={R.images.IC_TRADEUP}
                                name={R.strings.trading}
                                numberOfLines={1}
                                onPress={() => this.handleClickEvent(NavigationDrawerConstant.Trading)}
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
                                icon={R.images.IC_TRADEUP}
                                name={R.strings.margin + ' ' + R.strings.trading}
                                numberOfLines={1}
                                onPress={() => this.handleClickEvent(NavigationDrawerConstant.MarginTrading)}
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
                                icon={R.images.IC_ACCOUNT}
                                name={R.strings.myAccountTitle}
                                numberOfLines={1}
                                onPress={() => this.handleClickEvent(NavigationDrawerConstant.MyAccount)}
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
                                icon={R.images.ic_history}
                                name={R.strings.cms}
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
                                onPress={() => this.handleClickEvent(NavigationDrawerConstant.Cms)} />
                            <ImageButton
                                icon={R.images.IC_CHAT_GRADIENT}
                                name={R.strings.Chat}
                                numberOfLines={1}
                                onPress={() => this.handleClickEvent(NavigationDrawerConstant.Chat)}
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
                                icon={R.images.IC_GRADIENT_TRADE}
                                name={R.strings.arbitrage}
                                numberOfLines={1}
                                onPress={() => this.handleClickEvent(NavigationDrawerConstant.Arbitrage)}
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

                            <ImageButton
                                icon={R.images.IC_GRADIENT_TRADE}
                                name={R.strings.apiKey}
                                numberOfLines={1}
                                onPress={() => this.handleClickEvent(NavigationDrawerConstant.ApiKeyConfiguration)}
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
                            {/* Localization */}
                            <ImageButton
                                name={R.strings.localization}
                                numberOfLines={1}
                                onPress={() => this.handleClickEvent(NavigationDrawerConstant.Localization)}
                                textStyle={{ color: R.colors.textSecondary }}
                                isHML
                                style={{ marginTop: R.dimens.widgetMargin, marginBottom: R.dimens.widgetMargin }} />
                        </View>
                        <View>
                            {/* Settings */}
                            <ImageButton
                                name={R.strings.Settings}
                                numberOfLines={1}
                                onPress={() => this.handleClickEvent(NavigationDrawerConstant.Settings)}
                                textStyle={{ color: R.colors.textSecondary }}
                                isHML
                                style={{ marginTop: R.dimens.widgetMargin, marginBottom: R.dimens.widgetMargin }} />
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
        preference: state.preference,
        updateData: state.EditProfileReducer,
    }
}

function mapDispatchToProps(dispatch) {
    return {}
}

export default connect(mapStatToProps, mapDispatchToProps)(NavigationDrawer);