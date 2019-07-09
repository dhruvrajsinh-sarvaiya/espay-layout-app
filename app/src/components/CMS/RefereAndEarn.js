import React, { Component } from 'react';
import { View, ScrollView, Image, Text, Clipboard, FlatList, Linking, TouchableOpacity } from 'react-native';
import RNFetchBlob from "rn-fetch-blob";
import CommonStatusBar from '../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../native_theme/components/CustomToolbar'
import { changeTheme, logger, showAlert, parseIntVal, } from '../../controllers/CommonUtils'
import { isCurrentScreen } from '../Navigation';
import R from '../../native_theme/R';
import CardView from '../../native_theme/components/CardView';
import CommonToast from '../../native_theme/components/CommonToast';
import Separator from '../../native_theme/components/Separator';
import { connect } from 'react-redux';
import {
    getEnsitmatedCommissionValue, getReferralChannelUserCount,
    getReferralUrls, getReferralDescriptionData, getReferralCode,
    getReferralEmailData, getReferralSmsData, clearSendedData, clearAllReferralData
} from '../../actions/CMS/RefereEarnAction';
import { validateResponseNew, isInternet, isEmpty, validateMobileNumber, validateNumeric } from '../../validations/CommonValidation';
import ImageButton from '../../native_theme/components/ImageTextButton';
import Share, { ShareSheet, Button as LibraryButton } from 'react-native-share';
import { getData } from '../../App';
import { ServiceUtilConstant, Fonts } from '../../controllers/Constants';
import { AppConfig } from '../../controllers/AppConfig';
import CustomCard from '../../components/Widget/CustomCard';
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import EditText from '../../native_theme/components/EditText';
import Button from '../../native_theme/components/Button';
import { CheckEmailValidation } from '../../validations/EmailValidation';
import AlertDialog from '../../native_theme/components/AlertDialog';
import TextViewMR from '../../native_theme/components/TextViewMR';
import TextViewHML from '../../native_theme/components/TextViewHML';
import SafeView from '../../native_theme/components/SafeView';
import { ListEmptyComponent } from '../../native_theme/components/FlatListWidgets';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
const fs = RNFetchBlob.fs;
let imagePath = null;

//  twitter icon
const TWITTER_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAMAAAANIilAAAABvFBMVEUAAAAA//8AnuwAnOsAneoAm+oAm+oAm+oAm+oAm+kAnuwAmf8An+0AqtUAku0AnesAm+oAm+oAnesAqv8An+oAnuoAneoAnOkAmOoAm+oAm+oAn98AnOoAm+oAm+oAmuoAm+oAmekAnOsAm+sAmeYAnusAm+oAnOoAme0AnOoAnesAp+0Av/8Am+oAm+sAmuoAn+oAm+oAnOoAgP8Am+sAm+oAmuoAm+oAmusAmucAnOwAm+oAmusAm+oAm+oAm+kAmusAougAnOsAmukAn+wAm+sAnesAmeoAnekAmewAm+oAnOkAl+cAm+oAm+oAmukAn+sAmukAn+0Am+oAmOoAmesAm+oAm+oAm+kAme4AmesAm+oAjuMAmusAmuwAm+kAm+oAmuoAsesAm+0Am+oAneoAm+wAmusAm+oAm+oAm+gAnewAm+oAle0Am+oAm+oAmeYAmeoAmukAoOcAmuoAm+oAm+wAmuoAneoAnOkAgP8Am+oAm+oAn+8An+wAmusAnuwAs+YAmegAm+oAm+oAm+oAmuwAm+oAm+kAnesAmuoAmukAm+sAnukAnusAm+oAmuoAnOsAmukAqv9m+G5fAAAAlHRSTlMAAUSj3/v625IuNwVVBg6Z//J1Axhft5ol9ZEIrP7P8eIjZJcKdOU+RoO0HQTjtblK3VUCM/dg/a8rXesm9vSkTAtnaJ/gom5GKGNdINz4U1hRRdc+gPDm+R5L0wnQnUXzVg04uoVSW6HuIZGFHd7WFDxHK7P8eIbFsQRhrhBQtJAKN0prnKLvjBowjn8igenQfkQGdD8A7wAAAXRJREFUSMdjYBgFo2AUDCXAyMTMwsrGzsEJ5nBx41HKw4smwMfPKgAGgkLCIqJi4nj0SkhKoRotLSMAA7Jy8gIKing0KwkIKKsgC6gKIAM1dREN3Jo1gSq0tBF8HV1kvax6+moG+DULGBoZw/gmAqjA1Ay/s4HA3MISyrdC1WtthC9ebGwhquzsHRxBfCdUzc74Y9UFrtDVzd3D0wtVszd+zT6+KKr9UDX749UbEBgULIAbhODVHCoQFo5bb0QkXs1RAvhAtDFezTGx+DTHEchD8Ql4NCcSyoGJYTj1siQRzL/JKeY4NKcSzvxp6RmSWPVmZhHWnI3L1TlEFDu5edj15hcQU2gVqmHTa1pEXJFXXFKKqbmM2ALTuLC8Ak1vZRXRxa1xtS6q3ppaYrXG1NWjai1taCRCG6dJU3NLqy+ak10DGImx07LNFCOk2js6iXVyVzcLai7s6SWlbnIs6rOIbi8ViOifIDNx0uTRynoUjIIRAgALIFStaR5YjgAAAABJRU5ErkJggg==";

//  facebook icon
const FACEBOOK_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAMAAAANIilAAAAAYFBMVEUAAAAAQIAAWpwAX5kAX5gAX5gAX5gAXJwAXpgAWZ8AX5gAXaIAX5gAXpkAVaoAX5gAXJsAX5gAX5gAYJkAYJkAXpoAX5gAX5gAX5kAXpcAX5kAX5gAX5gAX5YAXpoAYJijtTrqAAAAIHRSTlMABFis4vv/JL0o4QvSegbnQPx8UHWwj4OUgo7Px061qCrcMv8AAAB0SURBVEjH7dK3DoAwDEVRqum9BwL//5dIscQEEjFiCPhubziTbVkc98dsx/V8UGnbIIQjXRvFQMZJCnScAR3nxQNcIqrqRqWHW8Qd6cY94oGER8STMVioZsQLLnEXw1mMr5OqFdGGS378wxgzZvwO5jiz2wFnjxABOufdfQAAAABJRU5ErkJggg==";

//  whatsapp icon
const WHATSAPP_ICON = "data:image/png;base64,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";

//  email icon
const EMAIL_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAMAAAANIilAAAABC1BMVEUAAAA/Pz8/Pz9AQEA/Pz8/Pz8+Pj4+Pj4/Pz8/Pz8/Pz8/Pz8+Pj4+Pj4/Pz8/Pz8/Pz9AQEA+Pj5AQEA/Pz87Ozs7Ozs/Pz8+Pj47OztAQEA/Pz89PT01NTVBQUFBQUE/Pz8/Pz8+Pj4/Pz9BQUE+Pj4/Pz8/Pz89PT0+Pj4/Pz9BQUFAQEA9PT09PT0/Pz87Ozs9PT05OTk/Pz8+Pj4/Pz9AQEA/Pz8/Pz8/Pz8/Pz+AgIA+Pj4/Pz8/Pz9AQEA/Pz8/Pz8/Pz8/Pz8+Pj4/Pz8/Pz8/Pz9AQEA+Pj4/Pz8+Pj4/Pz85OTk/Pz8/Pz8/Pz8/Pz88PDw9PT0/Pz88PDw8PDw+Pj45OTlktUJVAAAAWXRSTlMA/7N4w+lCWvSx8etGX/XlnmRO7+1KY/fjOGj44DU7UvndMec/VvLbLj7YKyiJdu9O7jZ6Um1w7DnzWQJz+tpE6uY9t8D9QehAOt7PVRt5q6duEVDwSEysSPRjqHMAAAEfSURBVEjH7ZTXUgIxGEa/TwURUFyKYgMURLCvbe2gYAV7ff8nMRksgEDiKl7lXOxM5p8zO3s2CWAwGAx/CjXontzT25Y+pezxtpv2+xTygJ+BYOvh4BBDwx1lKxxhNNZqNjLK+JjVWUYsykj4+2h8gpNTUMkIBuhPNE+SKU7PQC3D62E60ziYzXIuBx0Z+XRTc9F5fgF6MhKNzWXnRejKWGJdc9GZy8AP3kyurH52Ju01XTkjvnldNN+Qi03RecthfFtPlrXz8rmzi739Ax7mUCjy6FhH/vjPonmqVD6pdT718excLX/tsItLeRAqtc7VLIsFlVy/t6+ub27v7t8XD490niy3p+rZpv3i+jy/Or+5SUrdvcNcywaDwfD/vAF2TBl+G6XvQwAAAABJRU5ErkJggg==";

//  pinterest icon
const PINTEREST_ICON = "data:image/png;base64,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"

//  more icon
const MORE_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAMAAAANIilAAAAAQlBMVEUAAABEREQ9PT0/Pz8/Pz9AQEA7OzszMzM/Pz8/Pz9FRUU/Pz8/Pz9VVVUAAAA/Pz8+Pj4/Pz8/Pz9BQUFAQEA/Pz+e9yGtAAAAFnRSTlMAD5bv9KgaFJ/yGv+zAwGltPH9LyD5QNQoVwAAAF5JREFUSMft0EkKwCAQRFHHqEnUON3/qkmDuHMlZlVv95GCRsYAAAD+xYVU+hhprHPWjDy1koJPx+L63L5XiJQx9PQPpZiOEz3n0qs2ylZ7lkyZ9oyXzl76MAAAgD1eJM8FMZg0rF4AAAAASUVORK5CYII=";

let websiteLink = "https://new-stack-front.azurewebsites.net";

class RefereAndEarn extends Component {
    constructor() {
        super()

        //Define All State initial state
        this.state = {
            responseEnstimatedCommission: [],
            programDetails: '',
            importantNotice: '',
            isGrid: true,
            visible: false,
            my_referral_id: '-',
            referral_link: AppConfig.referral_link,
            description: '',
            emailLink: AppConfig.referral_link,
            smsLink: '',
            twitterLink: '',
            facebookLink: '',
            messenger: '',
            whatsAppLink: '',
            pinterestLink: '',
            linkedinLink: '',
            telegramLink: '',
            isFirstTime: true,
            Alert_Visibility: false,
            emailMobile: '',
            referralUserCountRes: '',

            //response for displaying Different Different views
            data: [
                { id: '1', title: '-', value: R.strings.invites, icon: R.images.IC_SHARE, type: 1, bgcolor: '#001f3f' },
                { id: '2', title: '-', value: R.strings.clicks, icon: R.images.IC_CLICK, type: 1, bgcolor: '#218E8E' },
                { id: '3', title: '-', value: R.strings.participant, icon: R.images.IC_ACCOUNT, type: 1, bgcolor: '#3D9970' },
                { id: '4', title: '-', value: R.strings.converts, icon: R.images.IC_HANDSHAKE, type: 1, bgcolor: '#218E8E' },
                { id: '5', title: '-', value: R.strings.Email, icon: R.images.IC_EMAIL_FILLED, type: 1, bgcolor: '#fcc95d' },
                { id: '6', title: '-', value: R.strings.sms, icon: R.images.IC_SMS_LOGO, type: 1, bgcolor: 'darkgray' },
                { id: '7', title: '-', value: R.strings.Twitter, icon: R.images.IC_TWITTER, type: 1, bgcolor: '#63cdf1' },
                { id: '8', title: '-', value: R.strings.Facebook, icon: R.images.IC_FACEBOOK_LOGO, type: 1, bgcolor: '#507cbe' },
                { id: '9', title: '-', value: R.strings.messenger, icon: R.images.IC_MESSANGER_LOGO, type: 1, bgcolor: '#3c5a99' },
                { id: '10', title: '-', value: R.strings.Whatsapp, icon: R.images.IC_WHATSAPP_LOGO, type: 1, bgcolor: '#25d366' },
                { id: '11', title: '-', value: R.strings.Pinterest, icon: R.images.IC_PINTEREST_LOGO, type: 1, bgcolor: '#c8232c' },
                { id: '12', title: '-', value: R.strings.linkedin, icon: R.images.IC_LINKEDIN_LOGO, type: 1, bgcolor: '#117EB9' },
                { id: '13', title: '-', value: R.strings.telegram, icon: R.images.IC_TELEGRAM_LOGO, type: 1, bgcolor: '#0088cc' },
            ],
        }
        this.shareOptions = {
            title: R.strings.Referral_Link,
        }

        //bind all methods
        this.onWebLinkPress = this.onWebLinkPress.bind(this);
    }
    async componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check internet connection
        if (await isInternet()) {

            // Api Call
            this.props.getEnsitmatedCommissionValue()  //for get program details and Important notice
            this.props.getReferralChannelUserCount()   // for get card value (useCount)
            this.props.getReferralUrls()               // for get referral Urls
            this.props.getReferralDescriptionData()    // for get Description Data 
            this.props.getReferralCode()               //for get Referral code
        }
    }

    shouldComponentUpdate = (nextProps, _nextState) => {
        return isCurrentScreen(nextProps);
    };

    static getDerivedStateFromProps(props, state) {

        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return {
                ...state,
                isFirstTime: false,
            };
        }

        if (isCurrentScreen(props)) {

            //Get All Updated field of Particular actions
            const { enstimatedCommissionData, referralUserCount, referralUserCountFetch,
                referralUrlsData, referralDescription, referralCode, } = props.appData;

            //check not fetching for data
            if (!referralUserCountFetch) {
                try {
                    if (validateResponseNew({ response: referralUserCount, isList: true })) {

                        // for store responce in res. 
                        let res = referralUserCount.ReferralChannelUserCount;
                        // get existing array data 
                        let arraydata = state.data;

                        // convert int to string to display in text and set to title value of Array data 
                        arraydata[0].title = res.Invite.toString()
                        arraydata[1].title = res.Clicks.toString()
                        arraydata[2].title = res.TotalParticipants.toString()
                        arraydata[3].title = res.Converts.toString()
                        arraydata[4].title = res.EmailInvite.toString()
                        arraydata[5].title = res.SMSInvite.toString()
                        arraydata[6].title = res.TwitterShare.toString()
                        arraydata[7].title = res.FacebookShare.toString()
                        arraydata[8].title = res.GoogleShare.toString()
                        arraydata[9].title = res.InstaShare.toString()
                        arraydata[10].title = res.Pinterest.toString()
                        arraydata[11].title = res.LinkedIn.toString()
                        arraydata[12].title = res.Telegram.toString()

                        // store array data to state
                        return { ...state, data: arraydata, referralUserCountRes: res }
                    }
                    else {
                        return { ...state, }
                    }
                } catch (e) {
                    return { ...state, }
                }
            }

            //To Check Referral Url Data Fetch or Not
            if (referralUrlsData) {
                try {
                    if (state.referralUrlsData == null || (state.referralUrlsData != null && referralUrlsData !== state.referralUrlsData)) {
                        if (validateResponseNew({ response: referralUrlsData, isList: true })) {
                            let res = referralUrlsData.ShareURL;

                            //set values to state from response
                            return {
                                ...state,
                                emailLink: state.referral_link + res.EmailURL,
                                smsLink: state.referral_link + res.SMSURL,
                                twitterLink: state.referral_link + res.TwitterURL,
                                facebookLink: state.referral_link + res.FacebookURL,
                                messenger: state.referral_link + res.MessengerURL,
                                whatsAppLink: state.referral_link + res.WhatsAppURL,
                                pinterestLink: state.referral_link + res.PintrestURL,
                                linkedinLink: state.referral_link + res.LinkedInURL,
                                telegramLink: state.referral_link + res.TelegramURL,
                                referralUrlsData
                            }
                        }
                        else {
                            return {
                                ...state, emailLink: state.referral_link, smsLink: '', twitterLink: '', facebookLink: '', messenger: '',
                                whatsAppLink: '', pinterestLink: '', linkedinLink: '', telegramLink: '', referralUrlsData
                            }
                        }
                    }
                } catch (e) {
                    return {
                        ...state, emailLink: state.referral_link, smsLink: '', twitterLink: '', facebookLink: '', messenger: '',
                        whatsAppLink: '', pinterestLink: '', linkedinLink: '', telegramLink: ''
                    }
                }
            }

            //To Check Referral Description Fetch or Not
            if (referralCode) {
                try {
                    if (state.referralCode == null || (state.referralCode != null && referralCode !== state.referralCode)) {
                        if (validateResponseNew({ response: referralCode, isList: true })) {
                            let res = referralCode.UserReferralCode;
                            return { ...state, my_referral_id: res != null ? res : '-', referralCode }
                        }
                        else {
                            return { ...state, my_referral_id: '-', referralCode: null }
                        }
                    }
                } catch (e) {
                    return { ...state, my_referral_id: '-', }
                }
            }

            //To Check Referral Description Fetch or Not
            if (referralDescription) {
                try {
                    if (state.referralDescription == null || (state.referralDescription != null && referralDescription !== state.referralDescription)) {
                        if (validateResponseNew({ response: referralDescription, isList: true })) {
                            let res = referralDescription.ReferralServiceObj;
                            return { ...state, description: res.Description != null ? res.Description : '', referralDescription }
                        }
                        else {
                            return { ...state, description: '-', referralDescription: null }
                        }
                    }
                } catch (e) {
                    return { ...state, description: '' }
                }
            }

            if (enstimatedCommissionData !== null) {
                //if local enstimated commission data state is null or its not null and also different then new response then and only then validate response.
                if (state.enstimatedCommissionData == null || (state.enstimatedCommissionData != null && enstimatedCommissionData !== state.enstimatedCommissionData)) {
                    try {
                        if (validateResponseNew({ response: enstimatedCommissionData, isList: true })) {
                            return {
                                ...state,
                                responseEnstimatedCommission: enstimatedCommissionData.Response,
                                programDetails: enstimatedCommissionData.programDetails,
                                importantNotice: enstimatedCommissionData.importantNotice,
                            }
                        }
                        else {
                            return {
                                ...state,
                                responseEnstimatedCommission: [],
                                programDetails: '',
                                importantNotice: '',
                            }
                        }
                    } catch (e) {
                        return {
                            ...state,
                            responseEnstimatedCommission: [],
                            programDetails: '',
                            importantNotice: '',
                        }
                    }
                }
            }
        }
        return null;
    }

    componentDidUpdate = (prevProps, prevState) => {
        let { emailData, smsData } = this.props.appData;

        //compare response with previous response
        if (emailData !== prevProps.appData.emailData) {

            //check data is available
            if (emailData) {
                try {
                    if (validateResponseNew({ response: emailData })) {
                        showAlert(R.strings.Success + '!', emailData.ReturnMsg, 0, async () => {
                            //clear data
                            this.props.clearSendedData()

                            //check for internet condition
                            if (await isInternet()) {

                                // call api for referral channel user count
                                this.props.getReferralChannelUserCount()
                            }
                            this.setState({ emailMobile: '' })
                        })
                    }
                } catch (e) {
                    this.setState({ emailMobile: '' })
                }
            }
        }

        //compare response with previous response
        if (smsData !== prevProps.appData.smsData) {

            //check data is available
            if (smsData) {
                try {
                    if (validateResponseNew({ response: smsData })) {
                        showAlert(R.strings.Success + '!', smsData.ReturnMsg, 0, async () => {
                            //clear data
                            this.props.clearSendedData()

                            //check for internet connection
                            if (await isInternet()) {

                                //call api for referral channel user count
                                this.props.getReferralChannelUserCount()
                            }
                            this.setState({ emailMobile: '' })
                        })
                    }
                } catch (e) {
                    this.setState({ emailMobile: '' })
                }
            }
        }
    };

    componentWillUnmount() {

        // call action for clear Reducer value 
        this.props.clearAllReferralData()
    }

    // Copy link Functionality
    onCopyAddress = async (flag = true) => {
        let val = '-'
        // flag = true means user click on copy button where false means user press on referral id text
        if (flag) {
            // user have link and id then priority is referral link
            if (this.state.emailLink !== AppConfig.referral_link && this.state.my_referral_id !== '-')
                val = this.state.emailLink
            // user has only link 
            else if (this.state.emailLink !== AppConfig.referral_link)
                val = this.state.emailLink
            // user has only referral id
            else if (this.state.my_referral_id !== '-')
                val = this.state.my_referral_id
        } else {
            if (this.state.my_referral_id !== '-')
                val = this.state.my_referral_id
        }

        // val have referral id/referral link
        if (val !== '-') {
            await Clipboard.setString(val);
            this.refs.Toast.Show(R.strings.Copy_SuccessFul);
        }
    }

    //to close share functionality
    onCancel = () => {
        this.setState({ visible: false });
    }

    //to hide share functionality
    onOpen = async () => {

        //check for internet condition
        if (await isInternet()) {
            this.setState({ visible: true });
        }
    }

    // for  redirect to selected card screen
    screenToRedirect = (screenName) => {

        // Invites Screen 
        if (screenName === R.strings.invites) {
            this.props.navigation.navigate('ReferralInvitesScreen');
        }

        // Click Screen 
        if (screenName === R.strings.clicks) {
            this.props.navigation.navigate('ReferralClickDataScreen');
        }

        // participant Screen 
        if (screenName === R.strings.participant) {
            this.props.navigation.navigate('ReferralParticipantScreen');
        }

        // participant Screen 
        if (screenName === R.strings.converts) {
            this.props.navigation.navigate('ReferralConvertScreen');
        }

        // for email data Screen
        if (screenName === R.strings.Email) {
            this.props.navigation.navigate('ReferralEmailDataScreen', { Id: 1 });
        }

        // for SMS data Screen
        if (screenName === R.strings.sms) {
            this.props.navigation.navigate('ReferralEmailDataScreen', { Id: 2 });
        }
    }

    // for Open AlertDialogBox
    OnQRCodeScan = (visible) => {
        this.setState({ Alert_Visibility: visible })
    }

    // this function return base64 image string  
    getBaseImage = async () => {
        let val = '-'
        // user have link and id then priority is referral link
        if (this.state.emailLink !== AppConfig.referral_link && this.state.my_referral_id !== '-')
            val = this.state.emailLink
        // user has only link 
        else if (this.state.emailLink !== AppConfig.referral_link)
            val = this.state.emailLink
        // user has only referral id
        else if (this.state.my_referral_id !== '-')
            val = this.state.my_referral_id

        return new Promise(resolve => {
            RNFetchBlob.config({
                fileCache: true
            })
                .fetch("GET", encodeURI('https://chart.googleapis.com/chart?cht=qr&chl=' + val + '&chs=150x150&chld=L|0'))

                // the image is now dowloaded to device's storage
                .then(resp => {

                    // the image path you can use it directly with Image component
                    imagePath = resp.path();
                    return resp.readFile("base64");
                })
                .then(base64Data => {

                    // here's base64 encoded image
                    resolve(base64Data);

                    // remove the file from storage
                    return fs.unlink(imagePath);
                })
        })
    }

    //calle api for send sms or email based on input
    onShareClick = async () => {
        try {
            // for check email is empty or not
            if (isEmpty(this.state.emailMobile)) {
                this.refs.Toast.Show(R.strings.enterEmailorMobile);
                return;
            }

            //check for valid mobile number
            let isMobile = validateNumeric(this.state.emailMobile);

            //check for valid email address
            let isEmail = !CheckEmailValidation(this.state.emailMobile);

            // If user input content matched with mobile number than check mobile validation
            if (isMobile == true && isEmail == false) {
                if (!validateMobileNumber(this.state.emailMobile) || (this.state.emailMobile.length != 10)) {
                    this.refs.Toast.Show(R.strings.phoneNumberValidation);
                    return;
                }
            } else {
                // If user input content matched with email than check email validation
                if (CheckEmailValidation(this.state.emailMobile)) {
                    this.refs.Toast.Show(R.strings.Enter_Valid_Email);
                    return;
                }
            }

            //check either email or mobile is true
            if (isEmail || isMobile) {

                //Check NetWork is Available or not
                if (await isInternet()) {
                    try {

                        //check input is mobile
                        if (isMobile) {
                            // request for SMS Send
                            let requestSmsSend = {
                                MobileNumber: this.state.emailMobile,
                                SMSShareURL: this.state.smsLink,
                                ReferralChannelTypeId: 2
                            }

                            //call api for send SMS
                            this.props.getReferralSmsData(requestSmsSend)
                            //---------
                        }

                        //check input is email
                        if (isEmail) {

                            // request for Email Send
                            let requestEmailSend = {
                                EmailAddress: this.state.emailMobile,
                                EmailShareURL: this.state.emailLink,
                                ReferralChannelTypeId: 1
                            }

                            //call api for send email
                            this.props.getReferralEmailData(requestEmailSend)
                            //---------
                        }
                    } catch (error) { }
                }
            }
        } catch (error) { }
    }

    // for open link in broweser on click link
    onWebLinkPress(url) {
        try {

            //check url is exist or not
            if (url)
                Linking.openURL(url);
        } catch (error) { }
    }

    render() {

        // loading bit for handling progress dialog
        let { isUsercount, isUrlget, isDescriptionFetch, isCodeget, isEmailSend, isSmsSend } = this.props.appData
        let countValue = 0;
        try {
            //condition for not call this part on every renering and improve performance
            if (!isEmpty(this.state.referralUserCountRes)) {
                this.state.data.forEach((item) => {
                    //check value is not static and not 0
                    if (item.title !== '-' && parseIntVal(item.title) > 0) {
                        countValue = 1
                    }
                })
            }
        }
        catch (e) { }

        let val = '-'
        // user have link and id then priority is referral link
        if (this.state.emailLink !== AppConfig.referral_link && this.state.my_referral_id !== '-')
            val = this.state.emailLink
        // user has only link 
        else if (this.state.emailLink !== AppConfig.referral_link)
            val = this.state.emailLink
        // user has only referral id
        else if (this.state.my_referral_id !== '-')
            val = this.state.my_referral_id

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background, }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CommonToast ref="Toast" />

                <CustomToolbar
                    title={R.strings.referralProgram}
                    isBack={true}
                    original={true}
                    leftStyle={{ width: wp('10%') }}
                    titleStyle={{ justifyContent: 'flex-start', width: wp('80%') }}
                    rightStyle={{ width: wp('10%') }}
                    rightIcon={R.images.IC_INFO}
                    onRightMenuPress={async () => {
                        if (await isInternet()) {
                            this.props.navigation.navigate('ReferaAndEanProgramDetails', { programDetails: this.state.programDetails, importantNotice: this.state.importantNotice })
                        }
                    }}
                    nav={this.props.navigation} />
                <ProgressDialog isShow={isUsercount || isUrlget || isDescriptionFetch || isCodeget || isEmailSend || isSmsSend} />

                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ flex: 1, }}>

                        <View style={{ flex: 1, margin: R.dimens.margin, justifyContent: 'center', alignItems: 'center', }}>
                            {/* for display referral Image */}
                            <Image
                                style={{ width: R.dimens.splashImageWidthHeight, height: R.dimens.splashImageWidthHeight, }}
                                resizeMode={"contain"}
                                source={R.images.IC_REFER_EARN_IMG}
                            />
                            {/* for display reward text / Description */}
                            <Text style={{
                                fontSize: R.dimens.largeText,
                                color: R.colors.textPrimary,
                                marginTop: R.dimens.margin,
                                fontFamily: Fonts.MontserratSemiBold
                            }}>
                                {R.strings.referEarnReward}</Text>
                            {/* for display Description */}
                            <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, marginTop: R.dimens.widgetMargin, textAlign: 'center' }}>
                                {this.state.description != '' ? this.state.description : '-'}</TextViewHML>

                            {/* <View style={{ flex: 1, flexDirection: 'row', marginTop: R.dimens.widgetMargin }}> */}
                            {/* for display button for Referrals */}
                            {/* <CardView style={{
                                    flex: 1, backgroundColor: R.colors.accent, justifyContent: 'center',
                                    marginRight: R.dimens.widgetMargin
                                }}>
                                    <Text style={{ fontSize: R.dimens.largeText, color: R.colors.white, fontFamily: Fonts.HindmaduraiSemiBold }}>{'12'}</Text>

                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.white, textAlign: 'center' }}>{R.strings.referrals}</TextViewHML>
                                        <ImageButton
                                            style={{ margin: 0, }}
                                            icon={R.images.IC_REFER_SHARE}
                                            iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: R.colors.white }}
                                        />
                                    </View>
                                </CardView> */}

                            {/* for display button for Commisiion  */}
                            {/* <CardView style={{ flex: 1, backgroundColor: R.colors.cardBalanceBlue, marginLeft: R.dimens.widgetMargin }}>
                                    <Text style={{ fontSize: R.dimens.largeText, color: R.colors.white, fontFamily: Fonts.HindmaduraiSemiBold }}>{'20'} <Text style={{ fontSize: R.dimens.smallestText, color: R.colors.white, fontFamily: Fonts.HindmaduraiSemiBold }}>{'%'}</Text></Text>

                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.white, textAlign: 'center' }}>{R.strings.commission}</TextViewHML>
                                        <ImageButton
                                            style={{ margin: 0, }}
                                            icon={R.images.IC_GRADIANT_GIFT}
                                            iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: R.colors.white }}
                                        />
                                    </View>
                                </CardView> */}
                            {/*  </View> */}
                        </View>

                        <CardView style={{ flex: 1, marginLeft: R.dimens.margin, marginRight: R.dimens.margin, }}>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: R.dimens.padding_left_right_margin }}>

                                {/* for Display Referral Id */}
                                <View>
                                    <TextViewMR style={{ fontSize: R.dimens.smallText, color: R.colors.textSecondary }}>{R.strings.referral_id}</TextViewMR>
                                    <TouchableOpacity onPress={() => this.onCopyAddress(false)}>
                                        <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, textAlign: 'center' }}>{this.state.my_referral_id != '-' ? this.state.my_referral_id : '-'}</TextViewHML>
                                    </TouchableOpacity>
                                </View>

                                {/* for display share copy and Qrcode image button */}
                                <View style={{ flexDirection: 'row' }}>
                                    <ImageButton
                                        style={[this.styles().image_style, { backgroundColor: R.colors.yellow, }]}
                                        icon={R.images.IC_SHARE}
                                        iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: R.colors.white }}
                                        onPress={this.onOpen}
                                        disabled={(this.state.my_referral_id === '-' && this.state.emailLink === AppConfig.referral_link) ? true : false}
                                    />
                                    <ImageButton
                                        style={[this.styles().image_style, { backgroundColor: R.colors.buyerGreen, }]}
                                        icon={R.images.IC_COPY}
                                        iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: R.colors.white }}
                                        onPress={async () => {
                                            if (await isInternet()) {
                                                this.onCopyAddress()
                                            }
                                        }}
                                        disabled={(this.state.my_referral_id === '-' && this.state.emailLink === AppConfig.referral_link) ? true : false}
                                    />
                                    <ImageButton
                                        style={[this.styles().image_style, { backgroundColor: R.colors.accent, }]}
                                        icon={R.images.IC_QRCODE}
                                        iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: R.colors.white }}
                                        onPress={async () => {
                                            if (await isInternet()) {
                                                this.OnQRCodeScan(true)
                                            }
                                        }}
                                        disabled={(this.state.my_referral_id === '-' && this.state.emailLink === AppConfig.referral_link) ? true : false}
                                    />
                                </View>
                            </View>

                            {/* for display Referral Link */}
                            <View style={{ marginTop: R.dimens.margin, marginLeft: R.dimens.padding_left_right_margin }}>
                                <TextViewMR style={{ fontSize: R.dimens.smallText, color: R.colors.textSecondary }}>{R.strings.Referral_Link}</TextViewMR>
                                <TouchableOpacity onPress={() => this.onWebLinkPress(this.state.emailLink)}>
                                    <TextViewHML
                                        style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, }}
                                        numberOfLines={1}
                                        ellipsizeMode="tail">
                                        {this.state.emailLink !== AppConfig.referral_link ? this.state.emailLink : '-'}
                                    </TextViewHML>
                                </TouchableOpacity>
                            </View>

                            {/* for invites friends using email and sms */}
                            <View style={{ flexDirection: 'row', marginTop: R.dimens.margin, alignItems: 'center' }}>
                                <Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, marginLeft: R.dimens.LineHeight }}>{R.strings.inviteFriends}</Text>
                                <Separator style={{ flex: 1, justifyContent: 'center', }} />
                            </View>
                            <EditText
                                style={{ marginTop: 0 }}
                                placeholder={R.strings.inviteViaEmailSMS}
                                multiline={false}
                                keyboardType={'default'}
                                returnKeyType={"done"}
                                value={this.state.emailMobile}
                                onChangeText={(emailMobile) => this.setState({ emailMobile })}
                            />
                            <Button
                                style={{ alignSelf: 'flex-end', marginTop: R.dimens.widgetMargin, marginBottom: R.dimens.widgetMargin, height: R.dimens.activity_margin }}
                                textStyle={{ fontSize: R.dimens.smallText }}
                                isRound={true}
                                title={R.strings.invite}
                                onPress={this.onShareClick}
                            />
                        </CardView>

                        {/* for header name and icon */}
                        <View style={{ flexDirection: 'row', marginLeft: R.dimens.margin, marginRight: R.dimens.margin, marginTop: R.dimens.margin }}>

                            <View style={{ flex: 1, justifyContent: 'center', }}>
                                <TextViewMR style={{ fontSize: R.dimens.mediumText, color: R.colors.textPrimary, }}>{R.strings.referralAnalytics}</TextViewMR>
                            </View>

                            <View style={{ justifyContent: 'center', alignItems: 'flex-end' }}>
                                <ImageButton
                                    icon={this.state.isGrid ? R.images.IC_VIEW_LIST : R.images.IC_VIEW_GRID}
                                    style={{ margin: 0 }}
                                    iconStyle={[{ height: R.dimens.LARGE_MENU_ICON_SIZE, width: R.dimens.LARGE_MENU_ICON_SIZE, tintColor: R.colors.cardHeader }]}
                                    onPress={() => this.setState({ isGrid: !this.state.isGrid })} />
                            </View>
                        </View>

                        <Separator style={{ marginTop: R.dimens.widgetMargin }} />

                        <View style={{ flex: 1, }}>
                            {this.state.data.length > 0 && countValue > 0 ?
                                <FlatList
                                    key={this.state.isGrid ? 'Grid' : 'List'}
                                    numColumns={this.state.isGrid ? 2 : 1}
                                    data={this.state.data}
                                    extraData={this.state}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <CustomCard
                                                isGrid={this.state.isGrid}
                                                index={index}
                                                size={this.state.data.length}
                                                title={item.title}
                                                value={item.value}
                                                type={item.type}
                                                icon={item.icon}
                                                width={this.props.width}
                                                cardStyle={{ backgroundColor: item.bgcolor }}
                                                imageBack={item.bgcolor}
                                                onChangeHeight={(height) => {
                                                    if (height > this.state.viewHeight) {
                                                        this.setState({ viewHeight: height })
                                                    }
                                                }}
                                                viewHeight={this.state.viewHeight}
                                                onPress={() => {
                                                    if (item.title != 0 && item.title !== '-')
                                                        this.screenToRedirect(item.value)
                                                    else
                                                        this.refs.Toast.Show(R.strings.noRecordsFound)
                                                }
                                                } />
                                        )
                                    }}
                                    keyExtractor={(item, index) => index.toString()}
                                />
                                : <View style={{ height: R.dimens.emptyListWidgetHeight }}>
                                    <ListEmptyComponent />
                                </View>
                            }
                        </View>
                    </View>
                </ScrollView>

                {/* to display share view at bottom */}
                {
                    this.shareMenu()
                }
                <AlertDialog
                    seprator={false}
                    visible={this.state.Alert_Visibility}
                    title={R.strings.qrcode}
                    backgroundStyle={{ backgroundColor: R.colors.white, }}
                    ButtonViewStyle={{ flexDirection: 'column', justifyContent: 'center', marginTop: 0, }}
                    negativeButton={{
                        onPress: () => { this.setState({ Alert_Visibility: !this.state.Alert_Visibility }) },
                    }}
                    positiveButton={{
                        title: R.strings.share,
                        onPress: async () => {
                            let imgurl = await this.getBaseImage()
                            let shareImage = {
                                // title: caption,//string
                                // message: message,//string
                                url: "data:image/png;base64," + imgurl,

                            };
                            setTimeout(() => {
                                Share.open(shareImage).catch(err => logger(err));
                            }, 300)
                            this.setState({ Alert_Visibility: !this.state.Alert_Visibility })
                        },
                    }}
                    requestClose={() => null}>

                    <View style={{ justifyContent: 'center', alignSelf: 'center', }}>
                        <Image
                            source={{ uri: 'https://chart.googleapis.com/chart?cht=qr&chl=' + val + '&chs=150x150&chld=L|0' }}
                            style={{ width: R.dimens.QRCodeIconWidthHeight, height: R.dimens.QRCodeIconWidthHeight, }} />
                    </View>
                </AlertDialog>
            </SafeView>
        )
    }

    // styles for this class
    styles = () => {
        return {
            image_style: {
                margin: 0,
                justifyContent: 'center',
                alignSelf: 'center',
                width: R.dimens.roundButtonRedius,
                height: R.dimens.roundButtonRedius,
                backgroundColor: R.colors.yellow,
                borderRadius: R.dimens.roundButtonRedius,
                marginRight: R.dimens.widgetMargin
            },
        }
    }

    //layout for bottom share manu
    shareMenu = () => {
        // if first name and last name is awailable then display it
        // otherwise if email is availble then display it
        // otherwise display mobile number.
        let userDes = (getData(ServiceUtilConstant.FIRSTNAME) && getData(ServiceUtilConstant.LASTNAME)) ?
            (getData(ServiceUtilConstant.FIRSTNAME) + ' ' + getData(ServiceUtilConstant.LASTNAME))
            : (getData(ServiceUtilConstant.Email) ? getData(ServiceUtilConstant.Email)
                : getData(ServiceUtilConstant.MOBILENO))
        //--------

        // define initial value of social media invite dialog
        let referralLink = false
        let referralId = ''
        let defaultRefLink = AppConfig.referral_link

        // Check condition for displaying message of invite social media
        if (((this.state.emailLink !== defaultRefLink) || (this.state.twitterLink) || (this.state.telegramLink) || (this.state.whatsAppLink) || (this.state.pinterestLink)) && this.state.my_referral_id !== '-') {
            referralLink = true
            referralId = this.state.my_referral_id
        } else if (((this.state.emailLink !== defaultRefLink) || (this.state.twitterLink) || (this.state.telegramLink) || (this.state.whatsAppLink) || (this.state.pinterestLink))) {
            referralLink = true
        } else if (this.state.my_referral_id !== '-')
            referralId = this.state.my_referral_id

        return (
            <ShareSheet visible={this.state.visible} onCancel={this.onCancel}>

                {/* for twitter */}
                <LibraryButton iconSrc={{ uri: TWITTER_ICON }}
                    onPress={() => {
                        this.onCancel();
                        setTimeout(() => {

                            // make string for Twitter message which is send to user
                            let refLinkJoin = referralLink ? ' and' : '';
                            let refIDMsg = ' referral Id- ' + referralId + refLinkJoin;
                            let refID = referralId ? refIDMsg : '';
                            let refLink = referralLink ? 'referral Link -' + this.state.twitterLink : '';

                            let object = {
                                user: userDes,
                                appName: AppConfig.appName,
                                referralId: refID,
                                referralLink: refLink,
                                websiteLink: websiteLink
                            }
                            let message = R.strings.formatString(R.strings.inviteShareMessage, object);

                            Share.shareSingle(Object.assign({}, this.shareOptions, {
                                social: "twitter",
                                message: message,
                                url: '',
                            })).catch(err => logger(err));
                        }, 300);
                    }}>{R.strings.Twitter}</LibraryButton>

                {/* for facebook */}
                <LibraryButton iconSrc={{ uri: FACEBOOK_ICON }}
                    onPress={() => {
                        this.onCancel();
                        setTimeout(() => {

                            // make string for Facebook message which is send to user
                            let refLinkJoin = referralLink ? ' and' : '';
                            let refIDMsg = ' referral Id- ' + referralId + refLinkJoin;
                            let refID = referralId ? refIDMsg : '';
                            let refLink = referralLink ? 'referral Link -' + this.state.facebookLink : '';

                            let object = {
                                user: userDes,
                                appName: AppConfig.appName,
                                referralId: refID,
                                referralLink: refLink,
                                websiteLink: websiteLink
                            }
                            let message = R.strings.formatString(R.strings.inviteShareMessage, object);

                            Share.shareSingle(Object.assign({}, this.shareOptions, {
                                social: "facebook",
                                message: message,
                                url: '',
                            })).catch(err => logger(err));
                        }, 300);
                    }}>{R.strings.facebook}</LibraryButton>

                {/* for Whats app */}
                <LibraryButton iconSrc={{ uri: WHATSAPP_ICON }}
                    onPress={() => {
                        this.onCancel();
                        setTimeout(() => {

                            // make string for WhatsApp message which is send to user
                            let refLinkJoin = referralLink ? ' and' : '';
                            let refIDMsg = ' referral Id- ' + referralId + refLinkJoin;
                            let refID = referralId ? refIDMsg : '';
                            let refLink = referralLink ? 'referral Link -' + this.state.whatsAppLink : '';

                            let object = {
                                user: userDes,
                                appName: AppConfig.appName,
                                referralId: refID,
                                referralLink: refLink,
                                websiteLink: websiteLink
                            }
                            let message = R.strings.formatString(R.strings.inviteShareMessage, object);

                            Share.shareSingle(Object.assign({}, this.shareOptions, {
                                social: "whatsapp",
                                message: message,
                                url: '',
                            })).catch(err => logger(err));
                        }, 300);
                    }}>{R.strings.Whatsapp}</LibraryButton>

                {/* for Email */}
                <LibraryButton iconSrc={{ uri: EMAIL_ICON }}
                    onPress={() => {
                        this.onCancel();
                        setTimeout(() => {
                            // make string for Email message which is send to user.
                            let refLinkJoin = referralLink ? (this.state.emailLink !== defaultRefLink ? ' and' : '') : '';
                            let refIDMsg = ' referral Id- ' + referralId + refLinkJoin;
                            let refID = referralId ? refIDMsg : '';
                            let refLink = referralLink ? (this.state.emailLink !== defaultRefLink ? 'referral Link -' + this.state.emailLink : '') : '';

                            let object = {
                                user: userDes,
                                websiteLink: websiteLink,
                                referralLink: refLink,
                                appName: AppConfig.appName,
                                referralId: refID,
                            }
                            let message = R.strings.formatString(R.strings.inviteShareMessage, object);

                            Share.shareSingle(Object.assign({}, this.shareOptions, {
                                social: "email",
                                message: message,
                                url: '',
                                subject: R.strings.Referral_Link + " " + AppConfig.appName //  for email
                            })).catch(err => logger(err));
                        }, 300);
                    }}>{R.strings.Email}</LibraryButton>

                {/* for Pinterest */}
                <LibraryButton iconSrc={{ uri: PINTEREST_ICON }}
                    onPress={() => {
                        this.onCancel();
                        setTimeout(() => {

                            // make string for other app which is send to user
                            let refLinkJoin = referralLink ? ' and' : '';
                            let refIDMsg = ' referral Id- ' + referralId + refLinkJoin;
                            let refID = referralId ? refIDMsg : '';
                            let refLink = referralLink ? 'referral Link -' + this.state.pinterestLink : '';

                            let object = {
                                user: userDes,
                                appName: AppConfig.appName,
                                referralId: refID,
                                referralLink: refLink,
                                websiteLink: websiteLink
                            }
                            let message = R.strings.formatString(R.strings.inviteShareMessage, object);

                            Share.shareSingle(Object.assign({}, this.shareOptions, {
                                social: "pinterest",
                                message: message,
                                url: '',
                            })).catch(err => logger(err));
                        }, 300);
                    }}>{R.strings.Pinterest}</LibraryButton>

                {/* for More Option */}
                <LibraryButton iconSrc={{ uri: MORE_ICON }}
                    onPress={() => {
                        this.onCancel();
                        setTimeout(() => {

                            let refLinkJoin = referralLink ? (this.state.emailLink !== defaultRefLink ? ' and' : '') : '';
                            let refIDMsg = ' referral Id- ' + referralId + refLinkJoin;
                            let refID = referralId ? refIDMsg : '';
                            let refLink = referralLink ? (this.state.emailLink !== defaultRefLink ? 'referral Link -' + this.state.emailLink : '') : '';

                            let object = {
                                user: userDes,
                                appName: AppConfig.appName,
                                referralId: refID,
                                referralLink: refLink,
                                websiteLink: websiteLink,
                            }
                            let message = R.strings.formatString(R.strings.inviteShareMessage, object);

                            Share.open({
                                title: R.strings.Referral_Link,
                                message: message,
                                subject: R.strings.Referral_Link + " " + AppConfig.appName
                            }).catch(err => logger(err));
                        }, 300);
                    }}>{R.strings.more}</LibraryButton>
            </ShareSheet>
        );
    }
}

function mapStateToProps(state) {
    return {
        //For Update width as per orientation change
        width: state.preference.dimensions.width,
        //data get from the reducer and set to appData
        appData: state.RefereEarnReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //here dispatch action and pass to action file and then goes to saga then data set to reducer and change state acording to responce.
        getEnsitmatedCommissionValue: () => dispatch(getEnsitmatedCommissionValue()),
        getReferralChannelUserCount: () => dispatch(getReferralChannelUserCount()),
        getReferralUrls: () => dispatch(getReferralUrls()),
        getReferralDescriptionData: () => dispatch(getReferralDescriptionData()),
        getReferralCode: () => dispatch(getReferralCode()),
        getReferralEmailData: (requestEmailSend) => dispatch(getReferralEmailData(requestEmailSend)),
        getReferralSmsData: (requestSmsSend) => dispatch(getReferralSmsData(requestSmsSend)),
        clearSendedData: () => dispatch(clearSendedData()),
        clearAllReferralData: () => dispatch(clearAllReferralData()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RefereAndEarn)