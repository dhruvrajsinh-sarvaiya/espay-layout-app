import React, { Component } from 'react';
import { View, Image, Animated, Dimensions, Platform } from 'react-native';
import { AppConfig } from '../../controllers/AppConfig';
import { ServiceUtilConstant, Fonts } from '../../controllers/Constants'
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import RuntimePermission from '../../native_theme/components/RuntimePermission';
import Separator from '../../native_theme/components/Separator';
import { getData, setData } from '../../App';
import { isCurrentScreen, navigateReset } from '../Navigation';
import FCMConfig from '../widget/FCMConfig';
import R from '../../native_theme/R';
const { width } = Dimensions.get('window').width;
import { connect } from 'react-redux';
import DeviceInfo from 'react-native-device-info';
import { showAlert, getAppLogo } from '../../controllers/CommonUtils';
import { isInternet, validateResponseNew } from '../../validations/CommonValidation';
import RNExitApp from 'react-native-exit-app';
import moment from 'moment';
import { getLicenseDetail } from '../../actions/SplashScreen/SplashScreenAction';
import { refreshToken as refreshTokenApi } from '../../actions/Login/AuthorizeToken';
import LinearTextGradient from '../../native_theme/components/LinearTextGradient';
import Features from '../../controllers/Features';
import { generateToken as generateTokenApi } from '../../actions/Login/AuthorizeToken';

class SplashScreen extends Component {

    constructor(props) {
        super(props);

        let logo = getAppLogo();

        //Define All State initial state
        this.state = {
            fadeAnim: new Animated.Value(0),
            isTablet: DeviceInfo.isTablet(), // for check device is tablet or not
            isPortrait: R.screen().isPortrait, //for check tablet orientation
            logo: logo ? logo : null,
            isFirstTime: true,
        };
    }

    componentDidMount = async () => {

        Animated.timing(                  // Animate over time
            this.state.fadeAnim,          // The animated value to drive
            {
                toValue: 1,               // Animate to opacity: 1 (opaque)
                duration: 3000,           // Make it take a while
            }
        ).start();                        // Starts the animation

        //If theme or locale is changed then update componenet
        R.colors.setTheme(getData(ServiceUtilConstant.KEY_Theme));
        R.strings.setLanguage(getData(ServiceUtilConstant.KEY_Locale))

        //To reset dialog show count for session expire causing
        //Set dialog show count to 0
        setData({ [ServiceUtilConstant.KEY_DialogCount]: 0 });

        // storing default isMargin value
        global.isMargin = getData(ServiceUtilConstant.KEY_IsMargin);
    };

    checkForAPICall = async () => {

        let licenseType = getData(ServiceUtilConstant.LICENSETYPE)

        // to update license based preference if made changes
        var prevLicenseCode = getData(ServiceUtilConstant.KEY_LicenseCode)

        // if prevLicenseCode is not undefined, prevLicenseCode and AppConfig code is same, licenseType is not undefined and app logo is also not null,
        // than go to next screen otherwise call api for license details.
        if (prevLicenseCode !== undefined && prevLicenseCode === AppConfig.license.code && licenseType !== undefined && (getAppLogo() !== null)) {

            // open login after some time
            this.checkStartActivity();
        } else {
            // Check If License API bit is true then call license api otherwise take required static url for configuration and store in preferance
            if (AppConfig.isLicenseAPICall) {
                if (global.isLicense) {

                    global.isLicense = false
                    //check for internet connection
                    if (await isInternet()) {
                        this.props.getLicenseDetail();
                    }
                }
            } else {
                //to store data
                setData({
                    [ServiceUtilConstant.KEY_WebServiceUrl]: AppConfig.WebServiceUrl,
                    [ServiceUtilConstant.KEY_LOGOURL]: AppConfig.LOGOURL,
                    [ServiceUtilConstant.KEY_WebSiteUrl]: AppConfig.WebSiteUrl
                });
                //-----
                //start activity
                this.checkStartActivity();

            }
        }
    }

    static oldProps = {};

    static getDerivedStateFromProps(props, state) {

        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return {
                ...state,
                isFirstTime: false,
            };
        }

        // To Skip Render if old and new props are equal
        if (SplashScreen.oldProps !== props) {
            SplashScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            let { licenseData, token: { generateTokenData } } = props;
            try {
                //if response is not null then store
                if (generateTokenData) {
                    //if local generateTokenData state is null or its not null and also different then new response then and only then validate response.
                    if (state.generateTokenData == null || (state.generateTokenData != null && generateTokenData !== state.generateTokenData)) {
                        if (validateResponseNew({ response: generateTokenData, isList: true })) {
                            if (generateTokenData.access_token && generateTokenData.refresh_token && generateTokenData.id_token) {
                                //to store token and credential in redux persist
                                let data = {
                                    [ServiceUtilConstant.ACCESS_TOKEN]: 'Bearer ' + generateTokenData.access_token,
                                    [ServiceUtilConstant.REFRESH_TOKEN]: generateTokenData.refresh_token,
                                    [ServiceUtilConstant.ID_TOKEN]: generateTokenData.id_token,
                                }
                                setData(data);
                                return Object.assign({}, state, {
                                    generateTokenData,
                                })
                            } else {
                                return Object.assign({}, state, {
                                    generateTokenData: null,
                                })
                            }
                        } else {
                            return Object.assign({}, state, {
                                generateTokenData,
                            })
                        }
                    }
                }

                if (licenseData.LicenseDetailData !== null && JSON.stringify(licenseData.LicenseDetailData) !== JSON.stringify(state.LicenseDetailData)) {

                    let responseDoc = licenseData.LicenseDetailData;

                    let statusCode = '';
                    let returnId = '';
                    let serviceIdFound = false;
                    let licenseType = '';
                    let expirydatestring = '';

                    // for check license
                    global.isLicense = true

                    let newState = {
                        data: licenseData.LicenseDetailData,
                    }

                    let preferenceData = {
                        [ServiceUtilConstant.SERVICEIDFOUND]: false
                    }

                    //check response is available or not
                    if (responseDoc != null) {

                        statusCode = responseDoc.GetClientInfoResponse.GetClientInfoResult[0].Status[0].StatusCode + "";
                        returnId = responseDoc.GetClientInfoResponse.GetClientInfoResult[0].Status[0].ReturnId + "";

                        var appInfoList = responseDoc.GetClientInfoResponse.GetClientInfoResult[0].ApplicationInfoList[0].ApplicationInfo;
                        let appInfoListCount = appInfoList.length;

                        for (var i = 0; i < appInfoListCount; i++) {

                            var appinfoelement = appInfoList[i];
                            var appserviceid = appinfoelement.ServiceID + "";
                            var appisactive = appinfoelement.IsActive + "";
                            var applicensetype = appinfoelement.LicenseType + "";

                            if (appserviceid === "1000108") {

                                serviceIdFound = (appisactive === "1");

                                if (appisactive === "1") {
                                    if (applicensetype === "1") {
                                        licenseType = "Demomode"
                                    } else if (applicensetype === "2") {
                                        licenseType = "Fullmode"
                                    } else if (applicensetype === "3") {
                                        licenseType = "Disablemode"
                                    }

                                    preferenceData = Object.assign({}, preferenceData, { [ServiceUtilConstant.LICENSETYPE]: licenseType });
                                }
                            }
                        }

                        expirydatestring = responseDoc.GetClientInfoResponse.GetClientInfoResult[0].ExpireDate.toString();

                        preferenceData = Object.assign({}, preferenceData, {
                            [ServiceUtilConstant.SERVICEIDFOUND]: serviceIdFound,
                            [ServiceUtilConstant.KEY_LicenseCode]: AppConfig.license.code,
                            [ServiceUtilConstant.KEY_MemberStatus]: responseDoc.GetClientInfoResponse.GetClientInfoResult[0].MemberStatus.toString(),
                            [ServiceUtilConstant.KEY_ExpireDate]: responseDoc.GetClientInfoResponse.GetClientInfoResult[0].ExpireDate.toString(),
                            [ServiceUtilConstant.KEY_WebServiceUrl]: responseDoc.GetClientInfoResponse.GetClientInfoResult[0].WebServiceUrl.toString(),
                            [ServiceUtilConstant.KEY_LOGOURL]: responseDoc.GetClientInfoResponse.GetClientInfoResult[0].LogoUrl.toString(),
                            [ServiceUtilConstant.KEY_WebSiteUrl]: responseDoc.GetClientInfoResponse.GetClientInfoResult[0].WebSiteUrl.toString()
                        });
                    }

                    setData(preferenceData)

                    let needAlert = true;
                    let message = R.strings.incorrectCodeContactProvider;

                    if (statusCode.toString() === "0" && returnId.toString() === "1") {

                        if (checkdates(expirydatestring)) {

                            if (serviceIdFound) {
                                if (licenseType.toLowerCase() === "fullmode" || licenseType.toLowerCase() === "disablemode") {
                                    message = R.strings.licenseExpired;
                                } else if (licenseType.toLowerCase() === "demomode") {
                                    message = R.strings.trialExpire;
                                }
                            } else {
                                message = R.strings.notAuthorized;
                            }
                        } else if (serviceIdFound && (licenseType.toLowerCase() === "fullmode" || licenseType.toLowerCase() === "demomode") && !checkdates(expirydatestring)) {
                            needAlert = false;
                        } else {
                            message = R.strings.contactServiceProvider;
                        }
                    }

                    let logo = responseDoc.GetClientInfoResponse.GetClientInfoResult[0].LogoUrl.toString();

                    newState = Object.assign({}, newState, {
                        needAlert,
                        message,
                        logo
                    })
                    return newState;
                }
            } catch (error) { }
        }
        return null;
    }

    componentDidUpdate = async (prevProps, prevState) => {
        //Get All Updated Feild of Particular actions
        const { token: { refreshToken, generateTokenData } } = this.props;

        //Handle Refresh Token Response
        if (refreshToken !== prevProps.token.refreshToken) {
            if (refreshToken) {
                //if Response Success then redirect to Main Screen else Call Generate Token API
                if (validateResponseNew({ response: refreshToken, isList: true })) {
                    navigateReset(AppConfig.initialHomeRoute, AppConfig.homeScreenParams);
                } else {
                    //navigate user to login screen
                    navigateReset('LoginNormalScreen');
                }
            }
        }

        // Response handling of generateTokenData
        if (generateTokenData !== prevProps.token.generateTokenData) {
            if (generateTokenData) {
                let tokenData = generateTokenData
                // Token is not null
                if (tokenData.access_token && tokenData.refresh_token && tokenData.id_token) {
                    navigateReset(AppConfig.initialHomeRoute, AppConfig.homeScreenParams);
                } else {
                    //navigate user to login screen
                    navigateReset('LoginNormalScreen');
                }
            }
        }

        if (this.state.needAlert !== undefined) {

            if (this.state.needAlert) {

                this.setState({ needAlert: false });

                let title = R.strings.Info + '!';
                let successAction = () => RNExitApp.exitApp();

                showAlert(title, this.state.message, successAction);
            } else {
                // open login after some time
                this.checkStartActivity();
            }
        }
    }

    // called on all permissions granted
    onAllGranted = (status) => {

        //if splash screen is open then and only then redirect to login screen
        //Causes if its not applied: 
        //if once user login and user press home then its state changed to 'backgroud' 
        //and then again open app will change state to 'active' which will this method again and this will open login screen
        //Note: Runtime Permission has AppState listener that's why this all came in code.
        if (isCurrentScreen(this.props)) {

            //check for status bit
            if (status) {

                //call API for get client info
                this.checkForAPICall();
            }
        }
    }

    checkStartActivity = async () => {

        setTimeout(async () => {

            let isFirstTime = getData(ServiceUtilConstant.KEY_PREF_FIRST_TIME);
            let screenName = 'AppIntroScreen';
            let screenParams = {};

            //check for first time from preference
            if (!isFirstTime) {

                screenName = 'LoginNormalScreen';

                // open login after some time with check security functions
                //To get current time
                let now = moment();

                //To get expiration time if its stored
                let accessExpiration = getData(ServiceUtilConstant.KEY_Access_Expiration);
                let refreshExpiration = getData(ServiceUtilConstant.KEY_Refresh_Expiration);

                //If expiration time is stored then check for other validation
                if (Features.expiration && typeof refreshExpiration !== 'undefined' && typeof accessExpiration !== 'undefined') {

                    //Get different between current and expiration time
                    let accessMinutes = moment(accessExpiration).diff(now, 'minutes');
                    let refreshMinutes = moment(refreshExpiration).diff(now, 'minutes');

                    //If minutes is greater than 0 than redirect to home screen else Login Screen
                    if (accessMinutes > 0 && refreshMinutes > 0) {

                        //If access token is not null then go to home route otherwise login screen
                        if (getData(ServiceUtilConstant.ACCESS_TOKEN)) {
                            screenName = AppConfig.initialHomeRoute;
                            screenParams = AppConfig.homeScreenParams;
                        }
                    } else if (Features.expirationWithRefreshToken) {
                        screenName = '';

                        //check for internet connection
                        if (await isInternet()) {
                            //if 55 minutes interval is over then call generate token for new token(access and refresh) 
                            if (refreshMinutes <= 0) {
                                //Call generate token method
                                this.props.generateToken({ username: getData(ServiceUtilConstant.LOGINUSERNAME), password: getData(ServiceUtilConstant.LOGINPASSWORD) });
                            }
                            //if 13 minutes interval is over then call refresh token for new token(access) 
                            else if (accessMinutes <= 0) {
                                //To Call Refresh Token API
                                this.props.refreshTokenApi();
                            }
                        }
                    }
                }
            }

            //if screenName is Empty then and only then navigate
            if (screenName !== '') {
                navigateReset(screenName, screenParams);
            }
        }, 2000);
    }

    render() {

        // get animation variable from state
        let { fadeAnim } = this.state;

        return (
            <View style={this.styles().container}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* 
                    For runtime permission
                    isAllGranted is used to continue the code after all permisisons are granted
                */}
                <RuntimePermission isAllGranted={(status) => this.onAllGranted(status)} />

                {/* 
                    To Generate FCM token and store in Preference,
                    Once Token is stored it won't generate new token,
                    This token can use to Enable/Disable notification
                 */}
                <FCMConfig />

                {/* View for image and app name with animation */}
                <View style={[this.styles().background, { justifyContent: 'center' }]} resizeMode="cover">

                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

                        <View style={{ alignItems: 'center', justifyContent: 'center', }}>
                            <Animated.View                 // Special animatable View
                                style={{
                                    ...this.props.style,
                                    opacity: fadeAnim,     // Bind opacity to animated value
                                }}>
                                {this.state.logo === null ?
                                    <Image
                                        style={this.styles().splashImage}
                                        resizeMode={"contain"}
                                        source={R.images.IC_APP_ICON} >
                                    </Image>
                                    :
                                    <Image
                                        style={this.styles().splashImage}
                                        resizeMode={"contain"}
                                        source={{ uri: Platform.OS === 'android' ? this.state.logo : ('' + this.state.logo) }} >
                                    </Image>
                                }
                            </Animated.View>

                            <Separator isGradient={true} width={R.dimens.chartHeightSmall} color={R.colors.accent} style={{ marginTop: R.dimens.WidgetPadding }} />

                            <LinearTextGradient
                                style={{ fontSize: R.dimens.splash_text_size, fontFamily: Fonts.HindmaduraiLight, marginTop: R.dimens.WidgetPadding }}
                            >{R.strings.WelcomeTo}</LinearTextGradient>
                            <LinearTextGradient
                                style={{ fontSize: R.dimens.LoginButtonBorderRadius, marginTop: R.dimens.WidgetPadding, fontFamily: Fonts.MontserratBold }}
                            >{R.strings.appName}</LinearTextGradient>
                        </View>
                    </View>

                    <View style={{ justifyContent: "center" }}>
                        {this.state.isTablet && !this.state.isPortrait
                            ?
                            <Image resizeMode={"center"} source={R.images.IC_SPLASH_MAP} style={{ width: width, height: R.dimens.GridImage, opacity: 0.40, tintColor: R.colors.textSecondary }} />
                            :
                            <Image resizeMode={"stretch"} source={R.images.IC_SPLASH_MAP} style={{ width: width, height: R.dimens.GridImage, opacity: 0.40, tintColor: R.colors.textSecondary }} />
                        }
                    </View>
                </View>
            </View>
        );
    }
    styles = () => {
        return {
            container: {
                flex: 1,
            },
            background: {
                width: R.screen().width,
                height: R.screen().height,
                backgroundColor: R.colors.background
            },
            splashImage: {
                width: R.dimens.splashImageWidthHeight,
                height: R.dimens.splashImageWidthHeight,
            },
        }
    }
}

function checkdates(expiryDate) {
    var lastindexofdate = expiryDate.indexOf("T");

    var finalexpiryDatestring = expiryDate.substring(0, lastindexofdate);

    var currentdateformat = new Date();

    var expireDate = new Date(finalexpiryDatestring);

    let checkdate = currentdateformat > expireDate;

    return checkdate;
}

function mapStateToProps(state) {
    return {
        isPortrait: state.preference.dimensions.isPortrait,
        licenseData: state.SplashScreenReducer,
        token: state.tokenReducer,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getLicenseDetail: () => dispatch(getLicenseDetail()),
        // To perform action for refreshTokenApi
        refreshTokenApi: () => dispatch(refreshTokenApi()),
        //Perform genrate token action
        generateToken: (payload) => dispatch(generateTokenApi(payload)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);