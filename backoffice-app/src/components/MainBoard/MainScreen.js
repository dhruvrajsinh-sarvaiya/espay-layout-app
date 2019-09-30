import React, { Component } from 'react';
import { View, Easing, YellowBox, Image, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import { changeTheme, getIPAddress } from '../../controllers/CommonUtils';
import { isCurrentScreen } from '../Navigation';
import { ServiceUtilConstant } from '../../controllers/Constants';
import Drawer from 'react-native-drawer-menu';
import R from '../../native_theme/R';
import NavigationDrawer from './NavigationDrawer';
import SafeView from '../../native_theme/components/SafeView';
import { refreshToken } from '../../actions/Login/AuthorizeToken';
import { getData, setData } from '../../App';
import LinearGradient from 'react-native-linear-gradient';
import ImageTextButton from '../../native_theme/components/ImageTextButton';
import TextViewHML from '../../native_theme/components/TextViewHML';
import TextViewMR from '../../native_theme/components/TextViewMR';
import { getProfileByID, clearReducerData } from '../../actions/account/EditProfileActions';
import { isEmpty, validateValue, isInternet, validateResponseNew } from '../../validations/CommonValidation';
import ProgressDialog from '../../native_theme/components/ProgressDialog';
YellowBox.ignoreWarnings(['Setting a timer']);

class MainScreen extends Component {
    constructor(props) {
        super(props);

        //getting user selected avatar from preference
        let avatar = getData(ServiceUtilConstant.KEY_USER_AVATAR);
        let userAvatar = '';
        try {
            if (JSON.parse(avatar)) {
                userAvatar = JSON.parse(avatar);
            } else {
                userAvatar = R.images.AVATAR_01;
            }
        } catch (error) {
            userAvatar = R.images.AVATAR_01;
        }

        // Reference of Views
        this.drawer = React.createRef();


        //Define All State initial state
        this.state = {
            viewProfile: null,
            firstName: '',
            lastName: '',
            userName: '',
            email: '',
            isEmailConfirmed: null,
            phoneNumber: '',
            redisDBKey: '',
            KYCStatus: false,
            userAvatar,
            isFirstTime: true,
            IpAddress: '',
            twoFaStatus: false,
            socialProfile: '',
        }
    }

    async componentDidMount() {

        //Add this method to change theme based on stored theme name.
        changeTheme();

        // To call Refresh token method at 13 minutes interval
        this.refreshTokenInterval = setInterval(() => this.props.refreshToken(), ServiceUtilConstant.refreshTokenInterval * 60000);


        // Check internet connection is available or not
        if (await isInternet()) {

            //Call GetProfileById api
            this.props.getProfileByID()
        }

        //getting user selected avatar from preference
        let avatar = getData(ServiceUtilConstant.KEY_USER_AVATAR);
        try {
            if (JSON.parse(avatar)) {
                this.setState({ userAvatar: JSON.parse(avatar) });
            } else {
                this.setState({ userAvatar: R.images.AVATAR_01 })
            }
        } catch (error) {
            this.setState({ userAvatar: R.images.AVATAR_01 })
        }
        let Ip = await getIPAddress();
        this.setState({ IpAddress: Ip, })
    };

    componentWillUnmount() {

        // clear reducer

        // if refresh token interval is not null then clear it on unmount screen
        if (this.refreshTokenInterval) {
            clearInterval(this.refreshTokenInterval);
        }
    }

    shouldComponentUpdate(nextProps, _nextState) {

        let oldName = this.props.preference[ServiceUtilConstant.FIRSTNAME] + ' ' + this.props.preference[ServiceUtilConstant.LASTNAME];
        let newName = nextProps.preference[ServiceUtilConstant.FIRSTNAME] + ' ' + nextProps.preference[ServiceUtilConstant.LASTNAME];

        //If theme or locale is changed then update componenet
        if (this.props.preference.theme !== nextProps.preference.theme ||
            this.props.preference.locale !== nextProps.preference.locale ||
            oldName !== newName) {
            return true;
        } else {
            return isCurrentScreen(nextProps);
        }
    };

    static getDerivedStateFromProps(props, state) {
        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return {
                ...state,
                isFirstTime: false,
            };
        }
        try {
            //if props user name and state's full name is different than store new name
            let propName = props.preference[ServiceUtilConstant.FIRSTNAME] + ' ' + props.preference[ServiceUtilConstant.LASTNAME];
            let stateName = state.firstName + ' ' + state.lastName;
            if (propName !== stateName) {
                return {
                    ...state,
                    firstName: props.preference[ServiceUtilConstant.FIRSTNAME],
                    lastName: props.preference[ServiceUtilConstant.LASTNAME]
                }
            }
        } catch (error) {
            return null;
        }

        // check for current screen
        if (isCurrentScreen(props)) {
            //Get All Updated field of Particular actions
            const { data, } = props.updateData

            // To check data is null or not
            if (data) {

                //if local buySellTrade state is null or its not null and also different then new response then and only then validate response.
                if (state.viewProfile == null || (state.viewProfile != null && data !== state.viewProfile)) {
                    try {
                        //currently use status code as success temprory
                        if (validateResponseNew({ response: data, isList: false })) {

                            //To update FirstName and LastName in preference
                            setData({
                                [ServiceUtilConstant.FIRSTNAME]: data.UserData.FirstName,
                                [ServiceUtilConstant.LASTNAME]: data.UserData.LastName
                            })
                            return {
                                ...state,
                                viewProfile: data,
                                firstName: data.UserData.FirstName,
                                lastName: data.UserData.LastName,
                                userName: data.UserData.Username,
                                isEmailConfirmed: data.UserData.IsEmailConfirmed,
                                email: data.UserData.Email,
                                phoneNumber: data.UserData.MobileNo,
                                twoFaStatus: data.UserData.TwoFactorEnabled,
                                socialProfile: data.UserData.SocialProfile,
                            }

                        } else {
                            return {
                                ...state,
                                viewProfile
                            }
                        }
                    } catch (error) {
                        console.log("error" + error)
                        return {
                            ...state,
                        }
                    }
                }
            }
        }
        return null;
    }

    //Refresh The Image Based On backPress From Update Profile Screen
    refresh = () => {
        this.setState({ userAvatar: getData(ServiceUtilConstant.KEY_USER_AVATAR) ? getData(ServiceUtilConstant.KEY_USER_AVATAR) : R.images.AVATAR_01 })
    }

    //To open Drawer
    handleDrawer() {
        if (this.drawer.openDrawer !== undefined) {
            this.drawer.openDrawer()
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

        //loading bit for handling progress dialog
        const { loading } = this.props.updateData

        let firstName = isEmpty(this.state.firstName) ? '' : this.state.firstName;
        let lastName = isEmpty(this.state.lastName) ? '' : this.state.lastName;
        let fullName = (firstName === '' && lastName === '') ? '-' : firstName + ' ' + lastName;

        return (
            <Drawer
                ref={component => this.drawer = component}
                drawerWidth={R.dimens.drawer_width}
                drawerPosition={Drawer.positions.Left}
                drawerContent={
                    <NavigationDrawer
                        navigation={this.props.navigation}
                        drawer={this.drawer} />
                }
                type={Drawer.types.Overlay}
                easingFunc={Easing.ease}>

                <SafeView style={this.styles().container}>

                    {/* To set status bar as per our theme */}
                    <CommonStatusBar />

                    {/* For Show Progress dialog */}
                    <ProgressDialog isShow={loading} />

                    <View style={{ flex: 10, }}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <LinearGradient style={{
                                flex: 1,
                            }}
                                locations={[0, 1]}
                                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                                colors={[R.colors.cardBalanceBlue, R.colors.accent]}>

                                {/* Open Drawer Button */}
                                <ImageTextButton
                                    onPress={() => this.handleDrawer()}
                                    icon={R.images.IC_DRAWER}
                                    style={{
                                        margin: 0,
                                        marginLeft: R.dimens.widgetMargin,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        width: R.dimens.dashboardMenuIcon + R.dimens.margin,
                                        height: R.dimens.dashboardMenuIcon + R.dimens.margin,
                                    }}
                                    iconStyle={{
                                        padding: R.dimens.margin,
                                        width: R.dimens.dashboardMenuIcon,
                                        height: R.dimens.dashboardMenuIcon,
                                    }} />

                                <View style={{
                                    flexDirection: 'row',
                                    padding: R.dimens.WidgetPadding,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    <View style={{ marginLeft: R.dimens.widget_left_right_margin, borderRadius: R.dimens.QRCodeIconWidthHeight / 2, borderWidth: R.dimens.ViewProfileImageBorder, borderColor: R.colors.backgroundTransparent, }}>

                                        {/* Avtar Image For Profile */}
                                        <Image
                                            style={this.styles().image_style}
                                            source={this.state.userAvatar} />
                                    </View>
                                    <View style={{ flex: 1, marginLeft: R.dimens.margin_left_right, justifyContent: 'center', marginRight: R.dimens.widget_left_right_margin }}>

                                        {/* Full Name */}
                                        {
                                            fullName !== '-' &&
                                            <TextViewMR style={{ color: R.colors.white, fontSize: R.dimens.mediumText }}>{fullName}</TextViewMR>
                                        }
                                        {/* User Name */}
                                        <TextViewHML style={{ color: R.colors.white, fontSize: fullName !== '-' ? R.dimens.smallestText : R.dimens.mediumText }}>{validateValue(this.state.userName)}</TextViewHML>
                                    </View>
                                </View>
                            </LinearGradient>

                            <View style={{ paddingLeft: R.dimens.margin_left_right, paddingRight: R.dimens.margin_left_right, marginBottom: R.dimens.widget_top_bottom_margin }}>
                                <View style={{ flexDirection: 'row', marginTop: R.dimens.widget_top_bottom_margin, }}>
                                    <View style={{ flex: 1 }}>

                                        {/* First Name */}
                                        <TextViewMR style={this.styles().detailHeader}>{R.strings.firstName}</TextViewMR>
                                        <TextViewHML style={this.styles().detailValue}>{validateValue(this.state.firstName)}</TextViewHML>
                                    </View>
                                    <View style={{ flex: 1 }}>

                                        {/* Last Name */}
                                        <TextViewMR style={this.styles().detailHeader}>{R.strings.lastName}</TextViewMR>
                                        <TextViewHML style={this.styles().detailValue}>{validateValue(this.state.lastName)}</TextViewHML>
                                    </View>
                                </View>

                                <View style={{ marginTop: R.dimens.widget_top_bottom_margin }}>
                                    {/* Email Id */}
                                    <TextViewMR style={this.styles().detailHeader}>{R.strings.EmailId}</TextViewMR>
                                    <View style={{ flexDirection: 'row' }}>
                                        <TextViewHML style={this.styles().detailValue}>{this.state.email}</TextViewHML>

                                        {/* if Email Id is confirmed Than show Verifed else Verify */}
                                        {this.state.isEmailConfirmed ?
                                            <TextViewHML style={{ color: R.colors.buyerGreen, fontSize: R.dimens.smallestText, marginLeft: R.dimens.widget_left_right_margin }}>{R.strings.Verified.toUpperCase()}</TextViewHML>
                                            :
                                            <TextViewHML style={{ color: R.colors.sellerPink, fontSize: R.dimens.smallestText, marginLeft: R.dimens.widget_left_right_margin }}>{R.strings.notText} {R.strings.Verified.toUpperCase()}</TextViewHML>
                                        }
                                    </View>
                                </View>

                                <View style={{ marginTop: R.dimens.widget_top_bottom_margin }}>

                                    {/* Mobile Number */}
                                    <TextViewMR style={this.styles().detailHeader}>{R.strings.MobileNo}</TextViewMR>
                                    <TextViewHML style={this.styles().detailValue}>{isEmpty(this.state.phoneNumber) ? '-' : this.state.phoneNumber}</TextViewHML>
                                </View>

                                <View style={{ marginTop: R.dimens.widget_top_bottom_margin }}>
                                    {/* 2FA Status */}
                                    <TextViewMR style={this.styles().detailHeader}>{R.strings.twoFa_status} </TextViewMR>

                                    {/* if 2FA is enabled Than show active else in active */}
                                    {this.state.twoFaStatus ?
                                        <TextViewHML style={[this.styles().detailValue, { color: R.colors.buyerGreen }]}>{R.strings.active.toUpperCase()}</TextViewHML>
                                        :
                                        <TextViewHML style={[this.styles().detailValue, { color: R.colors.sellerPink }]}>{R.strings.inActive.toUpperCase()}</TextViewHML>
                                    }
                                </View>

                                <View style={{ marginTop: R.dimens.widget_top_bottom_margin, }}>

                                    {/* Social profile status */}
                                    <TextViewMR style={this.styles().detailHeader}>{R.strings.socialProfileStatus}</TextViewMR>
                                    <TextViewHML style={[this.styles().detailValue, { color: R.colors.yellow }]}>{this.state.socialProfile}</TextViewHML>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </SafeView>
            </Drawer>
        );
    }

    styles = () => {
        return {
            container: {
                flex: 1,
                backgroundColor: R.colors.background,
            },
            detailHeader: {
                color: R.colors.textPrimary,
                fontSize: R.dimens.smallText,
            },
            detailValue: {
                color: R.colors.textSecondary,
                fontSize: R.dimens.smallestText,
            },
            image_style: {
                height: R.dimens.QRCodeIconWidthHeightD,
                width: R.dimens.QRCodeIconWidthHeightD,
                alignItems: 'center',
                justifyContent: 'center',
                padding: R.dimens.WidgetPadding,
                borderRadius: R.dimens.QRCodeIconWidthHeightD / 2,
            },
        }
    }
}

const mapStateToProps = (state) => ({
    preference: state.preference,
    updateData: state.EditProfileReducer,
})

const mapDispatchToProps = dispatch => ({
    // Perform Refresh token Action
    refreshToken: () => dispatch(refreshToken()),

    //Perform get Profilebyid  Action
    getProfileByID: () => dispatch(getProfileByID()),

    //Perform Clear Data Action
    clearReducerData: () => dispatch(clearReducerData())
})

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);