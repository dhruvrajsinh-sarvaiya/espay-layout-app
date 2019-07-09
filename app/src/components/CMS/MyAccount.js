import React, { Component } from 'react';
import { View, ScrollView, } from 'react-native';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../native_theme/components/CustomToolbar'
import { changeTheme, showAlert, sendEvent, } from '../../controllers/CommonUtils';
import { connect } from 'react-redux';
import MenuListItem from '../../native_theme/components/MenuListItem';
import { isCurrentScreen } from '../Navigation';
import R from '../../native_theme/R';
import CardView from '../../native_theme/components/CardView';
import ViewProfileWidget from './MyAccounts/ViewProfileWidget';
import { getUserActivePlan } from '../../actions/ApiPlan/ApiPlanListAction';
import { validateResponseNew, isInternet } from '../../validations/CommonValidation';
import { Events, ServiceUtilConstant } from '../../controllers/Constants';
import Separator from '../../native_theme/components/Separator';
import { getData } from '../../App';
import SafeView from '../../native_theme/components/SafeView';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

export const Category = { Menu: -1, Account: 0, KYC: 1, Support: 2, Policy: 3, Report: 4, Exchange: 5, Session: 6, Announcement: 7, Wallet: 8, SocialProifle: 9, Affiliate: 10, Margin: 11, apiPlan: 12 };

class MyAccount extends Component {

    // static constant for checking if class is mounted then load ip, last login time even if screen is not open
    static classMounted = true;

    constructor(props) {
        super(props)

        this.onRightMenuPress = this.onRightMenuPress.bind(this);

        //data pass for listing screen title,icon,redirection name
        this.state = {
            data: [],
            plan: getData(ServiceUtilConstant.KEY_IsPlanChange)
        }
    }

    async componentDidMount() {

        // update static classMounted to true
        MyAccount.classMounted = true;

        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {

            // Uset API Active Plan Api Call
            this.props.getUserActivePlan()
        }
    };

    componentWillUnmount() {
        // update static classMounted to false
        MyAccount.classMounted = false;
    }


    static getDerivedStateFromProps(props, state) {

        // check if curent screen is active, or class is already mounted or not
        if (isCurrentScreen(props) || MyAccount.classMounted) {

            if (state.data.length == 0) {
                return Object.assign({}, state, {
                    data: [
                        { title: R.strings.updateProfileTitle, screenname: 'UpdateProfile', icons: R.images.IC_USER },
                        { title: R.strings.Membershiplevel, screenname: 'MemberShipLevels', icons: R.images.IC_SECURITY },
                        // { title: R.strings.identityAuthentication, screenname: 'AccountSubMenu', icons: R.images.IC_SECURITY, category: Category.KYC },
                        { title: R.strings.identityAuthentication, screenname: 'KYCPersonalInfoScreen', icons: R.images.IC_SECURITY },
                        { title: R.strings.affiliate, screenname: 'AffiliateDashboard', icons: R.images.IC_WALLET/* , category: Category.Affiliate */ },
                        { title: R.strings.apiPlan, screenname: 'AccountSubMenu', icons: R.images.IC_MESSAGE_DETAILS, category: Category.apiPlan },
                        { title: R.strings.Security, screenname: 'Security', icons: R.images.IC_SECURITY },
                        { title: R.strings.Session, screenname: 'AccountSubMenu', icons: R.images.IC_DEVICE_WHITELIST, category: Category.Session },
                        { title: R.strings.Preferences, screenname: 'SettingScreen', icons: R.images.IC_SETTING },
                    ]
                })
            }

            try {
                // UserActivePlanData is not null
                if (props.UserActivePlanData) {

                    try {
                        if (state.UserActivePlanData == null || (state.UserActivePlanData != null && props.UserActivePlanData !== state.UserActivePlanData)) {

                            // Handle Response
                            if (validateResponseNew({ response: props.UserActivePlanData, isList: true })) {

                                let indexOfAPIPlan = state.data.findIndex(el => el.category == Category.apiPlan);

                                if (indexOfAPIPlan > -1) {
                                    let data = state.data;
                                    data[indexOfAPIPlan].status = props.UserActivePlanData.Response.PlanName;

                                    return Object.assign({}, state, {
                                        data,
                                        UserActivePlanData: props.UserActivePlanData
                                    })
                                }
                            }
                            return Object.assign({}, state, {
                                UserActivePlanData
                            })
                        }
                    } catch (error) {
                        return null;
                    }
                }
            } catch (error) {
                return null;
            }
        }

        return null;
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        //If theme or locale is changed then update componenet
        if (this.state !== nextState || this.props.preference.theme !== nextProps.preference.theme || this.props.preference.locale !== nextProps.preference.locale || this.state.data !== nextState.data) {
            return true;
        } else {
            return isCurrentScreen(nextProps);
        }
    };

    moveToScreen(item) {
        if (item.screenname != '') {
            var { navigate } = this.props.navigation;
            navigate(item.screenname, { category: item.category ? item.category : '', title: item.title, refresh: this.refresh })
        }
    }

    onRightMenuPress() {
        //redirect user to login
        showAlert(R.strings.Logout, R.strings.logout_message, 4, async () => {
            sendEvent(Events.SessionLogout);
        }, R.strings.cancel);
    }

    refresh = () => {
        var NewPlan = getData(ServiceUtilConstant.KEY_IsPlanChange)

        let data = [
            { title: R.strings.updateProfileTitle, screenname: 'UpdateProfile', icons: R.images.IC_USER },
            { title: R.strings.Membershiplevel, screenname: 'MemberShipLevels', icons: R.images.IC_SECURITY },
            { title: R.strings.identityAuthentication, screenname: 'AccountSubMenu', icons: R.images.IC_SECURITY, category: Category.KYC },
            { title: R.strings.affiliate, screenname: 'AffiliateDashboard', icons: R.images.IC_WALLET/* , category: Category.Affiliate */ },
            { title: R.strings.apiPlan, screenname: 'AccountSubMenu', icons: R.images.IC_MESSAGE_DETAILS, category: Category.apiPlan },
            { title: R.strings.Security, screenname: 'Security', icons: R.images.IC_SECURITY },
            { title: R.strings.Session, screenname: 'AccountSubMenu', icons: R.images.IC_DEVICE_WHITELIST, category: Category.Session },
            { title: R.strings.Preferences, screenname: 'SettingScreen', icons: R.images.IC_SETTING },
        ];

        let newState = { data };

        if (this.state.plan !== NewPlan) {
            if (validateResponseNew({ response: this.props.UserActivePlanData, isList: true })) {

                let indexOfAPIPlan = this.state.data.findIndex(el => el.category == Category.apiPlan);

                if (indexOfAPIPlan > -1) {

                    data[indexOfAPIPlan].status = this.props.UserActivePlanData.Response.PlanName;

                    newState = {
                        data,
                        UserActivePlanData: this.props.UserActivePlanData
                    }
                }
            }
        } else {
            let indexOfAPIPlan = this.state.data.findIndex(el => el.category == Category.apiPlan);
            if (indexOfAPIPlan > -1) {

                data[indexOfAPIPlan].status = this.state.data[indexOfAPIPlan].status;
                newState = { data }
            }
        }

        this.setState(newState);
    }

    render() {

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.accountSettings}
                    isBack={true}
                    original={true}
                    leftStyle={{ width: wp('10%') }}
                    titleStyle={{ justifyContent: 'flex-start', width: wp('80%') }}
                    rightStyle={{ width: wp('10%') }}
                    rightIcon={R.images.IC_LOGOUT}
                    onRightMenuPress={this.onRightMenuPress}
                    nav={this.props.navigation} />

                <ScrollView showsVerticalScrollIndicator={false}>

                    <ViewProfileWidget navigation={this.props.navigation} />

                    <CardView style={{ padding: 0, margin: R.dimens.margin_left_right }}>

                        {/* To display all menus */}
                        {this.state.data.map((item, index) => {
                            return (
                                <View key={item.title}>
                                    <MenuListItem
                                        title={item.title}
                                        onPress={() => this.moveToScreen(item)}
                                        status={item.status}
                                        statusStyle={{ color: R.colors.yellow }}
                                        style={{
                                            marginTop: 0,
                                            marginBottom: 0,
                                            backgroundColor: 'transparent'
                                        }}
                                    />
                                    {/* No one Change seperator Color without Asking Dhruvit(me) Strict Instruction */}
                                    {index != this.state.data.length - 1 && <Separator />}
                                </View>
                            )
                        })}
                    </CardView>
                </ScrollView>
            </SafeView>
        )
    }
}

function mapStateToProps(state) {
    return {
        //For Update isPortrait true or false
        orientation: state.preference.dimensions.isPortrait,
        // updated state
        UserActivePlanData: state.ApiPlanListReducer.UserActivePlanData,
        preference: state.preference,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        // User Active Plan Data
        getUserActivePlan: () => dispatch(getUserActivePlan()),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(MyAccount);
