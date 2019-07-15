import React, { Component } from 'react';
import { View } from 'react-native';
import { removeLoginData } from '../../actions/SignUpProcess/signUpAction'
import { affiliateSignup, clearAffiliate, getAffiliateCommissionPattern } from '../../actions/Affiliate/AffiliateSignUpAction'
import { connect } from 'react-redux';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar'
import { isEmpty, isInternet, validateMobileNumber, validatePassword, validateResponseNew } from '../../validations/CommonValidation'
import Button from '../../native_theme/components/Button'
import { isCurrentScreen } from '../Navigation'
import EditText from '../../native_theme/components/EditText'
import { changeTheme, getDeviceID, showAlert, parseArray, changeFocus, sendEvent, } from '../../controllers/CommonUtils';
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import { ServiceUtilConstant, Events } from '../../controllers/Constants';
import CommonToast from '../../native_theme/components/CommonToast';
import R from '../../native_theme/R';
import BackgroundImageHeaderWidget from '../../native_theme/components/BackgroundImageHeaderWidget';
import Picker from '../../native_theme/components/Picker';
import InputScrollView from 'react-native-input-scroll-view';
import SafeView from '../../native_theme/components/SafeView';

class AffiliateSignUpMain extends Component {

    constructor(props) {
        super(props);

        // create reference
        this.toast = React.createRef();
        this.progressDialog = React.createRef();

        this.mainInputTexts = {};
        this.inputs = {};

        //To Bind All Method
        this.focusNextField = this.focusNextField.bind(this);
        //----------

        //Define All State initial state
        this.state = {
            FirstName: this.props.navigation.state ? this.props.navigation.state.params.FirstName : '',
            LastName: this.props.navigation.state ? this.props.navigation.state.params.LastName : '',
            MobileNumber: this.props.navigation.state ? this.props.navigation.state.params.MobileNumber : '',
            EmailId: this.props.navigation.state ? this.props.navigation.state.params.EmailId : '',
            CountryCode: this.props.navigation.state ? this.props.navigation.state.params.CountryCode : '',
            UserName: '',
            ReferralID: '',
            Password: '',
            ConfirmPassword: '',

            spinnerSchemeTypeData: [],
            selectedSchemeId: 0,
            selectedSchemeType: R.strings.select_scheme_type,
            SchemeType: 0,

            //for scheme type spinner
            type: 0, //0 For basic & 1 for full details
            isVisiblePassword: false,
            isFirstTime: true,
        }
    }

    async componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Call Fetch commission pattern for spinner
            this.props.getAffiliateCommissionPattern({ type: this.state.type });
            //----
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        return isCurrentScreen(nextProps);
    };

    //To Validate Mobile Number
    validateMobileNumber = (MobileNumber) => {
        if (validateMobileNumber(MobileNumber)) {
            this.setState({ MobileNumber: MobileNumber })
        }
    }

    componentDidUpdate = (prevProps, prevState) => {
        const { affiliateSignUpData, loading } = this.props.AffiliateSignUpReducer;

        if (affiliateSignUpData !== prevProps.AffiliateSignUpReducer.affiliateSignUpData) {
            if (!loading) {
                if (affiliateSignUpData) {
                    try {
                        if (validateResponseNew({ response: affiliateSignUpData })) {
                            // on success responce redirect to login screen 
                            showAlert(R.strings.Success + '!', affiliateSignUpData.ReturnMsg, 0, () => {
                                //clear reducer data
                                this.props.clearAffiliate()
                                //---
                                //This will reset to login page
                                sendEvent(Events.SessionLogout, true);
                                //----
                            })
                        } else {
                            //clear reducer data
                            this.props.clearAffiliate()
                        }
                    } catch (e) {
                        // logger('error :', e)
                    }
                }
            }
        }
    }

    //this Method is used to focus on next feild
    focusNextField(id) {
        this.inputs[id].focus();
    }

    static getDerivedStateFromProps(props, state) {
        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return {
                ...state,
                isFirstTime: false,
            };
        }

        if (isCurrentScreen(props)) {
            //Get All Updated Feild of Particular actions
            const { loading, getPlan } = props.AffiliateSignUpReducer;

            //To Check Normal SignUp Api Data Fetch or Not
            if (!loading) {
                if (getPlan) {
                    try {
                        if (validateResponseNew({ response: getPlan })) {

                            //adding response to spinner
                            let newRes = parseArray(getPlan.Response)
                            newRes.map((item, index) => {
                                newRes[index].value = newRes[index].Value
                                newRes[index].Id = newRes[index].Id
                            })
                            //----
                            let res = [{ value: R.strings.select_scheme_type }, ...newRes]

                            return {
                                ...state,
                                spinnerSchemeTypeData: res,
                            }
                        }
                    } catch (e) {
                        return {
                            ...state,
                            spinnerSchemeTypeData: [],
                        }
                    }
                }
            }
        }
        return null
    }



    //Check All Validation and if validation is proper then call API
    onSignUpButtonPress = async () => {

        //Check UserName is Empty or Not
        if (isEmpty(this.state.UserName)) {
            this.toast.Show(R.strings.username_validate);
            return;
        }
        //Check Password is Empty or Not
        else if (isEmpty(this.state.Password)) {
            this.toast.Show(R.strings.password_validate);
            return;
        }
        //To Check Password length is 10 or not
        else if (this.state.Password.length < 6) {
            this.toast.Show(R.strings.password_length_validate);
            return;
        }
        //To Check Password Validation
        else if (!validatePassword(this.state.Password)) {
            this.toast.Show(R.strings.Strong_Password_Validation);
            return;
        }
        //Check Confirm Password is Empty or Not
        else if (isEmpty(this.state.ConfirmPassword)) {
            this.toast.Show(R.strings.confirm_password_validate);
            return;
        }
        //Check Password and Confirm Password Same or Not
        else if (this.state.Password != this.state.ConfirmPassword) {
            this.toast.Show(R.strings.password_match_validate);
            return;
        }
        //Check Scheme Type Select Or Not From DropDown
        else if (isEmpty(this.state.selectedSchemeType) || this.state.selectedSchemeType === R.strings.select_scheme_type) {
            this.toast.Show(R.strings.select_scheme_type);
            return;
        }
        else {
            //Check NetWork is Available or not
            if (await isInternet()) {

                try {
                    changeFocus(this.mainInputTexts);

                    //Bind Request For Affiliate SignUp
                    let registerRequest = {
                        Username: this.state.UserName,
                        Firstname: this.state.FirstName,
                        Lastname: this.state.LastName,
                        Email: (this.state.EmailId).toLowerCase(),
                        Password: this.state.Password,
                        Mobile: this.state.MobileNumber,
                        CountryCode: this.state.CountryCode,
                        DeviceId: await getDeviceID(),
                        //deviceId: 'DeviceId',
                        Mode: ServiceUtilConstant.Mode,
                        HostName: ServiceUtilConstant.hostName,
                        SchemeType: this.state.SchemeType,
                        ReferCode: this.state.ReferralID,

                        //Note : ipAddress parameter is passed in its saga.
                    }

                    //call Normal SignUp API
                    this.props.affiliateSignup(registerRequest);
                } catch (error) {
                    this.progressDialog.dismiss();
                    showAlert(R.strings.NetworkError, R.strings.SLOW_INTERNET, 5);
                }
            }
        }
    }
    //-----------

    render() {

        let referralid = R.strings.ReferalId + ' (' + R.strings.Optional + ')'
        //Get is Fetching value For All APIs to handle Progress bar in All Activity
        const { loading } = this.props.AffiliateSignUpReducer;

        return (
            <View style={this.styles().container}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar translucent />

                {/* To Set Progress Dialog as per out theme */}
                <ProgressDialog ref={component => this.progressDialog = component} translucent={true} isShow={loading} />

                {/* To Set Toast as per out theme */}
                <CommonToast ref={component => this.toast = component} />

                {/* To Set All View in ScrolView */}
                <InputScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='always' >

                    <View style={[R.screen().isPortrait ? { height: R.screen().height } : { flex: 1 }]}>

                        {/* Background Image Header */}
                        <BackgroundImageHeaderWidget navigation={this.props.navigation} />

                        <SafeView style={this.styles().input_container}>

                            {/* To Set UserName in EditText */}
                            <EditText
                                ref={input => { this.mainInputTexts['etUsrname'] = input; }}
                                isRound={true}
                                reference={input => { this.inputs['etUsrname'] = input; }}
                                value={this.state.UserName}
                                onChangeText={(UserName) => this.setState({ UserName })}
                                placeholder={R.strings.Username}
                                multiline={false}
                                keyboardType='default'
                                returnKeyType={"next"}
                                focusable={true}
                                onSubmitEditing={() => { this.focusNextField('etPWD') }}
                                onFocus={() => changeFocus(this.mainInputTexts, 'etUsrname')}
                            />

                            {/* To Set Password in EditText */}
                            <EditText
                                ref={input => { this.mainInputTexts['etPWD'] = input; }}
                                isRound={true}
                                reference={input => { this.inputs['etPWD'] = input; }}
                                value={this.state.Password}
                                onChangeText={(Password) => this.setState({ Password })}
                                placeholder={R.strings.Password}
                                multiline={false}
                                maxLength={30}
                                returnKeyType={"next"}
                                keyboardType='default'
                                onSubmitEditing={() => { this.focusNextField('etConfirmPWD') }}
                                secureTextEntry={!this.state.isVisiblePassword}
                                rightImage={this.state.isVisiblePassword ? R.images.IC_EYE_FILLED : R.images.IC_EYE_FILLED_DISABLE}
                                onPressRight={() => {
                                    this.setState({ isVisiblePassword: !this.state.isVisiblePassword })
                                }}
                                focusable={true}
                                onFocus={() => changeFocus(this.mainInputTexts, 'etPWD')}
                            />

                            {/* To Set Confirm Password in EditText */}
                            <EditText
                                ref={input => { this.mainInputTexts['etConfirmPWD'] = input; }}
                                isRound={true}
                                reference={input => { this.inputs['etConfirmPWD'] = input; }}
                                value={this.state.ConfirmPassword}
                                onChangeText={(ConfirmPassword) => this.setState({ ConfirmPassword })}
                                placeholder={R.strings.Confirm_Password}
                                maxLength={30}
                                multiline={false}
                                secureTextEntry={true}
                                keyboardType='default'
                                returnKeyType={"next"}
                                onSubmitEditing={() => { this.focusNextField('etReferralId') }}
                                focusable={true}
                                onFocus={() => changeFocus(this.mainInputTexts, 'etConfirmPWD')}
                            />

                            {/* To Set Scheme type in Dropdown */}
                            <View style={{ marginBottom: R.dimens.widgetMargin, marginTop: R.dimens.widgetMargin }}>
                                <Picker
                                    cardStyle={{ marginBottom: 0 }}
                                    data={this.state.spinnerSchemeTypeData}
                                    value={this.state.selectedSchemeType}
                                    onPickerSelect={(item, object) => { this.setState({ selectedSchemeType: item, SchemeType: object.Id }) }}
                                    displayArrow={'true'}
                                    width={'100%'}
                                    isRound={true}
                                />
                            </View>

                            {/* To Set ReferalId in EditText */}
                            <EditText
                                ref={input => { this.mainInputTexts['etReferralId'] = input; }}
                                isRound={true}
                                value={this.state.ReferralID}
                                onChangeText={(ReferralID) => this.setState({ ReferralID })}
                                reference={input => { this.inputs['etReferralId'] = input; }}
                                placeholder={referralid}
                                multiline={false}
                                keyboardType='default'
                                returnKeyType={"done"}
                                focusable={true}
                                onFocus={() => changeFocus(this.mainInputTexts, 'etReferralId')}
                            />

                            {/* Button */}
                            <Button
                                isRound={true}
                                title={R.strings.Register}
                                onPress={this.onSignUpButtonPress}
                                style={{ marginTop: R.dimens.padding_top_bottom_margin, marginBottom: R.dimens.widgetMargin }} />
                        </SafeView>
                    </View>
                </InputScrollView>
            </View >
        );
    }

    // styles for this class
    styles = () => {
        return {
            container: {
                flex: 1,
                backgroundColor: R.colors.background,
            },
            input_container: {
                justifyContent: 'center',
                paddingLeft: R.dimens.activity_margin,
                paddingRight: R.dimens.activity_margin,
                paddingTop: R.dimens.margin_left_right,
            },
        }
    }
}

function mapStateToProps(state) {
    return {
        //Updated Data For Affiliate Signup
        AffiliateSignUpReducer: state.AffiliateSignUpReducer,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform Normal SignUp Action
        affiliateSignup: (registerRequest) => dispatch(affiliateSignup(registerRequest)),
        // perform AffiliateCommissionPattern Action 
        getAffiliateCommissionPattern: (registerRequest) => dispatch(getAffiliateCommissionPattern(registerRequest)),
        // perform action fro remove login data
        removeLoginData: () => dispatch(removeLoginData()),
        // perform action to clear data from reducer
        clearAffiliate: () => dispatch(clearAffiliate()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AffiliateSignUpMain)
