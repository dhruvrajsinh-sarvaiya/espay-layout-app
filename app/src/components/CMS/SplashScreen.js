import React, { Component } from 'react';
import { View, Image, Animated, Dimensions, Platform } from 'react-native';
import { AppConfig } from '../../controllers/AppConfig';
import { ServiceUtilConstant, Fonts } from '../../controllers/Constants'
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import RuntimePermission from '../../native_theme/components/RuntimePermission';
import Separator from '../../native_theme/components/Separator';
import { getData, setData } from '../../App';
import { isCurrentScreen, navigateReset } from '../Navigation';
import FCMConfig from '../Widget/FCMConfig';
import R from '../../native_theme/R';
import LinearTextGradient from '../../native_theme/components/LinearTextGradient';
const { width } = Dimensions.get('window').width;
import { connect } from 'react-redux';
import DeviceInfo from 'react-native-device-info';
import xml2js from 'react-native-xml2js';
import { showAlert, getAppLogo } from '../../controllers/CommonUtils';
import { isInternet } from '../../validations/CommonValidation';
import RNExitApp from 'react-native-exit-app';
import moment from 'moment';

let statusCode = "";
let returnId = "";
let licenseType = "";
let expirydatestring = "";
let checkdate = true;
let serviceIdFound = false;

let logo = null;

class SplashScreen extends Component {

    constructor(props) {
        super(props);

        this.fcmConfig = React.createRef();

        //Define All State initial state
        this.state = {
            fadeAnim: new Animated.Value(0),
            isTablet: DeviceInfo.isTablet(), // for check device is tablet or not
            isPortrait: R.screen().isPortrait, //for check tablet orientation
            loaded: false,
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

        if (await isInternet()) {
            //getting image for logo
            logo = getData(ServiceUtilConstant.KEY_LOGOURL)
        }
    };

    checkForAPICall = async () => {
        //check for internet connection
        if (await isInternet()) {

            licenseType = getData(ServiceUtilConstant.LICENSETYPE)

            // to update license based preference if made changes
            var prevLicenseCode = getData(ServiceUtilConstant.KEY_LicenseCode)

            // if prevLicenseCode is not undefined, prevLicenseCode and AppConfig code is same, licenseType is not undefined and app logo is also not null,
            // than go to next screen otherwise call api for license details.
            if (prevLicenseCode !== undefined && prevLicenseCode === AppConfig.license.code && licenseType !== undefined && (getAppLogo() !== null)) {

                // open login after some time
                checkStartActivity();
            } else {

                if (global.isLicense) {
                    global.isLicense = false
                    this.callAPI();
                }
            }
        }
    }

    callAPI = async () => {
        var LicenseCodeUrl = AppConfig.license.url;
        var LicenseCode = AppConfig.license.code;
        var SYSTEM_ID = ServiceUtilConstant.SYSTEM_ID;

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("POST", LicenseCodeUrl, true);
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4) {

                //To Check StatusCode 200 or not
                if (xmlhttp.status == 200) {

                    try {
                        let firstIndex = xmlhttp.responseText.indexOf('<soap:Body>') + 11;
                        let lastIndex = xmlhttp.responseText.indexOf('</soap:Body>');
                        // console.log(xmlhttp.responseText.substring(firstIndex, lastIndex))

                        //To Convert XML To JSON
                        xml2js.parseString(xmlhttp.responseText.substring(firstIndex, lastIndex), (err, result) => {
                            if (err) {
                                throw (err);
                            }
                            this.responseDoc = result;
                            // console.log('result data', this.responseDoc);

                            // for check license
                            global.isLicense = true

                            //check response is available or not
                            if (this.responseDoc != null) {

                                statusCode = this.responseDoc.GetClientInfoResponse.GetClientInfoResult[0].Status[0].StatusCode + "";
                                returnId = this.responseDoc.GetClientInfoResponse.GetClientInfoResult[0].Status[0].ReturnId + "";

                                var appInfoList = this.responseDoc.GetClientInfoResponse.GetClientInfoResult[0].ApplicationInfoList[0].ApplicationInfo;
                                let appInfoListCount = appInfoList.length;

                                for (var i = 0; i < appInfoListCount; i++) {

                                    var appinfoelement = appInfoList[i];
                                    var appserviceid = appinfoelement.ServiceID + "";
                                    var appisactive = appinfoelement.IsActive + "";
                                    var applicensetype = appinfoelement.LicenseType + "";

                                    if (appserviceid === "1000108") {
                                        if (appisactive === "1") {

                                            serviceIdFound = true

                                            setData({
                                                [ServiceUtilConstant.SERVICEIDFOUND]: serviceIdFound.toString(),
                                            });

                                            if (applicensetype === "1") {
                                                licenseType = "Demomode";

                                                setData({
                                                    [ServiceUtilConstant.LICENSETYPE]: licenseType,
                                                });
                                                // console.log("Mode :", licenseType);

                                            } else if (applicensetype === "2") {
                                                licenseType = "Fullmode";
                                                setData({
                                                    [ServiceUtilConstant.LICENSETYPE]: licenseType,
                                                });

                                                // console.log("Mode :", licenseType);
                                            } else if (applicensetype === "3") {
                                                licenseType = "Disablemode";
                                                setData({
                                                    [ServiceUtilConstant.LICENSETYPE]: licenseType,
                                                });
                                                // console.log("Mode :", licenseType);
                                            }
                                        } else if (appisactive != "1") {

                                            serviceIdFound = false
                                            setData({
                                                [ServiceUtilConstant.SERVICEIDFOUND]: serviceIdFound.toString(),
                                            });
                                        }
                                    }

                                }

                                expirydatestring = this.responseDoc.GetClientInfoResponse.GetClientInfoResult[0].ExpireDate.toString();

                                //to store data
                                setData({
                                    [ServiceUtilConstant.KEY_LicenseCode]: LicenseCode,
                                    [ServiceUtilConstant.KEY_MemberStatus]: this.responseDoc.GetClientInfoResponse.GetClientInfoResult[0].MemberStatus.toString(),
                                    [ServiceUtilConstant.KEY_ExpireDate]: this.responseDoc.GetClientInfoResponse.GetClientInfoResult[0].ExpireDate.toString(),
                                    [ServiceUtilConstant.KEY_WebServiceUrl]: this.responseDoc.GetClientInfoResponse.GetClientInfoResult[0].WebServiceUrl.toString(),
                                    [ServiceUtilConstant.KEY_LOGOURL]: this.responseDoc.GetClientInfoResponse.GetClientInfoResult[0].LogoUrl.toString(),
                                    [ServiceUtilConstant.KEY_WebSiteUrl]: this.responseDoc.GetClientInfoResponse.GetClientInfoResult[0].WebSiteUrl.toString()
                                });
                                //-----
                            } else {
                                // response is json but invalid
                                statusCode = ServiceUtilConstant.SERVER_ERROR_CODE;
                            }

                        });
                        //------------
                    } catch (e) {
                        // console.log("error occur" + e);
                    } finally {
                        licenseCodeValidate();
                    }
                }
            }
        }

        //setup request
        xmlhttp.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
        var xml = '<?xml version="1.0" encoding="utf-8"?>' +
            '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
            '<soap:Body>' +
            '<GetClientInfo xmlns="http://tempuri.org/">' +
            '<request>' + LicenseCode + '</request>' +
            '<systemId>' + SYSTEM_ID + '</systemId>' +
            '</GetClientInfo>' +
            '</soap:Body>' +
            '</soap:Envelope>';

        xmlhttp.send(xml);
        //-----------
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

                // Execute FCM code after all permissions are granted
                this.fcmConfig.withPermissions();

                //call API for get client info
                this.checkForAPICall();
            }
        }
    }

    _onLoad = () => {
        this.setState(() => ({ loaded: true }))
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
                <FCMConfig ref={comp => this.fcmConfig = comp} />

                {/* View for image and app name with animation */}
                <View style={[this.styles().background, { justifyContent: 'center' }]} resizeMode="cover">

                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

                        <View style={{ alignItems: 'center', justifyContent: 'center', }}>
                            <Animated.View                 // Special animatable View
                                style={{
                                    ...this.props.style,
                                    opacity: fadeAnim,     // Bind opacity to animated value
                                }}>
                                {logo == null ?
                                    <Image
                                        style={[this.styles().splashImage,]}
                                        resizeMode={"contain"}
                                        source={R.images.IC_APP_ICON} >
                                    </Image>
                                    :
                                    <Image
                                        onLoad={this._onLoad}
                                        style={this.styles().splashImage}
                                        resizeMode={"contain"}
                                        source={{ uri: Platform.OS === 'android' ? logo : ('' + logo) }} >
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

function licenseCodeValidate() {

    let needAlert = true;
    let title = R.strings.Info + '!';
    let message = R.strings.incorrectCodeContactProvider;
    let successAction = () => RNExitApp.exitApp();

    if (statusCode === "0" && returnId === "1") {
        checkdates();

        if (checkdate) {
            if (serviceIdFound) {
                if (licenseType === "Fullmode" || licenseType === "Disablemode") {
                    message = R.strings.licenseExpired;
                } else if (licenseType.equalsIgnoreCase("Demomode")) {
                    message = R.strings.trialExpire;
                }
            } else {
                message = R.strings.notAuthorized;
            }
        } else if (serviceIdFound == true && (licenseType === "Fullmode" || licenseType === "Demomode") && checkdate == false) {
            needAlert = false;
        } else {
            message = R.strings.contactServiceProvider;
        }
    }
    if (needAlert) {
        showAlert(title, message, 3, successAction);
    } else {
        //start activity
        checkStartActivity();
    }
}

function checkdates() {

    var lastindexofdate = expirydatestring.indexOf("T");

    var finalexpiryDatestring = expirydatestring.substring(0, lastindexofdate);

    var currentdateformat = new Date();

    var expireDate = new Date(finalexpiryDatestring);

    checkdate = currentdateformat > expireDate;
}

async function checkStartActivity() {

    setTimeout(() => {

        let isFirstTime = getData(ServiceUtilConstant.KEY_PREF_FIRST_TIME);
        let screenName = 'AppIntroScreen';

        //check for first time from preference
        if (!isFirstTime) {

            screenName = 'LoginNormalScreen';

            // open login after some time with check security functions
            //To get current time
            let now = moment();

            //To get expiration time if its stored
            let expiration = getData(ServiceUtilConstant.KEY_Expiration);

            //If expiration time is stored then check for other validation
            if (AppConfig.expiration && expiration) {

                //Get different between current and expiration time
                let minutes = moment(expiration).diff(now, 'minutes');

                //If minutes is greater than 0 than redirect to home screen else Login Screen
                if (minutes > 0) {

                    //If access token is not null then go to home route otherwise login screen
                    if (getData(ServiceUtilConstant.ACCESS_TOKEN)) {
                        screenName = AppConfig.initialHomeRoute
                    }
                }
            }
        }

        navigateReset(screenName);
    }, 2000);
}

export default connect(state => { return { isPortrait: state.preference.dimensions.isPortrait } })(SplashScreen);