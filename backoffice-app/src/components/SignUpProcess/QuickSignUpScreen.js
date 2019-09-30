import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { signUpWithMobile, signUpWithMobileEmailClear } from '../../actions/SignUpProcess/signUpAction'
import { onGenerateOtp } from '../../actions/SignUpProcess/signUpAction'
import CommonStatusBar from '../../native_theme/components/CommonStatusBar'
import { isEmpty, isInternet, validateResponseNew, validateMobileNumber, validateNumeric, } from '../../validations/CommonValidation'
import { changeTheme, getDeviceID, changeFocus } from '../../controllers/CommonUtils';
import EditText from '../../native_theme/components/EditText'
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import { isCurrentScreen } from '../Navigation';
import Button from '../../native_theme/components/Button';
import { showAlert } from '../../controllers/CommonUtils';
import { ServiceUtilConstant } from '../../controllers/Constants';
import CommonToast from '../../native_theme/components/CommonToast';
import R from '../../native_theme/R';
import BackgroundImageHeaderWidget from '../../native_theme/components/BackgroundImageHeaderWidget';
import { CheckEmailValidation } from '../../validations/EmailValidation'
import InputScrollView from 'react-native-input-scroll-view';
import { setData, getData } from '../../App';
const { width, height } = R.screen();

class QuickSignUpScreen extends Component {

    constructor(props) {
        super(props);

        this.toast = React.createRef();
        this.progressDialog = React.createRef();

        //To Bind All Method
        this.onQuickSignUp = this.onQuickSignUp.bind(this);

        this.mainInputTexts = {};

        this.state = {
            emailMobile: '',
            isInputMobile: false,

            // for select county and it's code
            cca2: 'IN',
            callingCode: '91'
        }
    }

    componentDidMount = () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    };

    shouldComponentUpdate = (nextProps, nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps);
    };

    componentDidUpdate = (prevProps, prevState) => {
        const { SignUpMobileData, SignUpMobileFetchData, emaildata, emailfatchdata } = this.props;

        if (emaildata !== prevProps.emaildata) {
            //Check Sign up Email Api Response 
            if (!emailfatchdata) {
                try {
                    //Get Api STMSG
                    let stmsg = emaildata.ReturnMsg;
                    let ErrorCode = emaildata.ErrorCode;

                    if (validateResponseNew({ response: emaildata, isList: true })) {

                        // on success responce redirect to otp screen 
                        showAlert(R.strings.Success, stmsg, 0, () => {
                            //reducer data
                            this.props.signUpWithMobileEmailClear();
                            this.props.navigation.navigate('SignUpWithOtp', { email: this.state.emailMobile, VerifyBit: false })
                        })
                    } else {

                        //Check Return Code And ErrorCode For Email Already Exist 
                        if (ErrorCode == 4036) {
                            showAlert(R.strings.Success, stmsg, 0, () => {
                                //reducer data
                                this.props.signUpWithMobileEmailClear();
                                this.props.navigation.navigate('SignUpWithOtp', { email: this.state.emailMobile, VerifyBit: true })
                            })
                        } else {
                            showAlert(R.strings.status, stmsg, 1, () => {
                                //reducer data
                                this.props.signUpWithMobileEmailClear();
                            })
                        }
                    }
                } catch (error) {
                    //Handle Catch and Notify User to Exception.
                }
            }
        }

        if (SignUpMobileData !== prevProps.SignUpMobileData) {
            //check Sign UP Mobile Request Api data
            if (!SignUpMobileFetchData) {
                try {
                    //Get Api STMSG
                    let stmsg = SignUpMobileData.ReturnMsg;
                    let ErrorCode = SignUpMobileData.ErrorCode;

                    if (validateResponseNew({ response: SignUpMobileData })) {
                        //reducer data
                        this.props.signUpWithMobileEmailClear();
                        if (SignUpMobileData.ReturnCode == 0 && ErrorCode == 0) {
                            // on success responce redirect to otp screen 
                            showAlert(R.strings.Success, stmsg, 0, () => this.props.navigation.navigate('SignUpMobileWithOtp', { MobileNo: this.state.emailMobile, VerifyBit: false, CountryCode: this.state.cca2, }))
                        }
                        //Check Return Code And ErrorCode For Email Already Exist 
                        if (SignUpMobileData.ReturnCode == 0 && ErrorCode == 4036) {
                            showAlert(R.strings.Success, stmsg, 0, () => this.props.navigation.navigate('SignUpMobileWithOtp', { MobileNo: this.state.emailMobile, CountryCode: this.state.cca2, VerifyBit: true }))
                        }
                    }

                } catch (error) {
                    //Handle Catch and Notify User to Exception.
                }
            }
        }
    }

    onQuickSignUp = async () => {

        try {

            //Set dialog show count to 0
            setData({ [ServiceUtilConstant.KEY_DialogCount]: 0 });

            // for check email is empty or not
            if (isEmpty(this.state.emailMobile)) {
                this.toast.Show(R.strings.enterEmailorMobile);
                return;
            }

            let isMobile = validateNumeric(this.state.emailMobile);
            let isEmail = !CheckEmailValidation(this.state.emailMobile);

            // If user input content matched with mobile number than check mobile validation
            if (isMobile == true && isEmail == false) {
                if (!validateMobileNumber(this.state.emailMobile) || (this.state.emailMobile.length != 10)) {
                    this.toast.Show(R.strings.phoneNumberValidation);
                    return;
                }
            } else {
                // If user input content matched with email than check email validation
                if (CheckEmailValidation(this.state.emailMobile)) {
                    this.toast.Show(R.strings.Enter_Valid_Email);
                    return;
                }
            }

            if (isEmail || isMobile) {

                changeFocus(this.mainInputTexts);

                //Check NetWork is Available or not
                if (await isInternet()) {

                    try {

                        if (getData(ServiceUtilConstant.KEY_DialogCount) > 0) {
                            //To reset dialog show count for session expire causing
                            //Set dialog show count to 0
                            setData({ [ServiceUtilConstant.KEY_DialogCount]: 0 });
                        }

                        //Bind Request For Email SignIn
                        let request = {
                            deviceId: await getDeviceID(),
                            mode: ServiceUtilConstant.Mode,
                            hostName: ServiceUtilConstant.hostName,
                        }
                        //Note : IPAddress parameter is passed in its saga.

                        if (isMobile) {
                            request = Object.assign({}, request, {
                                CountryCode: this.state.cca2,
                                mobile: this.state.emailMobile,
                                PreferedLanguage: R.strings.getLanguage(),
                            });

                            //call api for send otp to given Mobile No
                            this.props.signUpWithMobile(request)
                        }

                        if (isEmail) {
                            request = Object.assign({}, request, {
                                email: (this.state.emailMobile).toLowerCase(),
                                PreferedLanguage: R.strings.getLanguage(),
                            })

                            //call api for send otp to given email address
                            this.props.onGenerateOtp(request)
                        }

                    } catch (error) {
                        this.progressDialog.dismiss();
                        showAlert(R.strings.status, R.strings.SLOW_INTERNET, 3);
                    }
                }
            }
        } catch (error) {
            // logger(error.message);
        }
    }

    render() {

        const { SignUpMobileIsFetching, emailisfatching } = this.props;

        let isInputMobile = validateNumeric(this.state.emailMobile)

        return (
            <View style={{ flex: 1, width, height, backgroundColor: R.colors.background }}>

                {/* To Set Status Bas as per out theme */}
                <CommonStatusBar translucent />

                {/* Progress Dialog */}
                <ProgressDialog ref={component => this.progressDialog = component} isShow={SignUpMobileIsFetching || emailisfatching} translucent={true} />

                {/* For Toast */}
                <CommonToast ref={comp => this.toast = comp} />

                {/* To Set All View in ScrolView */}
                <InputScrollView keyboardShouldPersistTaps='always' showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>

                    <View style={{ height: R.screen().height }}>
                        {/* Background Image Header */}
                        <BackgroundImageHeaderWidget />

                        <View style={{ flex: 1, paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingTop: R.dimens.margin_top_bottom }}>

                            <View style={{ justifyContent: 'center' }}>
                                <View>
                                    {/* for Email Id/ Mobile No. */}
                                    <EditText
                                        ref={input => { this.mainInputTexts['etEmailMobile'] = input; }}
                                        style={{ marginTop: 0 }}
                                        placeholder={R.strings.emailMobile}
                                        multiline={false}
                                        keyboardType={'default'}
                                        returnKeyType={"done"}
                                        value={this.state.emailMobile}
                                        onChangeText={(emailMobile) => this.setState({ emailMobile })}
                                        isRound={true}
                                        focusable={true}
                                        onFocus={() => changeFocus(this.mainInputTexts, 'etEmailMobile')}
                                        countryPicker={isInputMobile}
                                        onCountryChange={(value) => { this.setState({ cca2: value.cca2, callingCode: value.callingCode }) }}
                                        contryPickerValue={this.state.cca2}
                                    />

                                    {/* To send otp */}
                                    <Button
                                        isRound={true}
                                        textStyle={{ color: R.colors.white }}
                                        title={R.strings.sendOTP}
                                        onPress={this.onQuickSignUp}
                                        style={{
                                            marginTop: R.dimens.padding_top_bottom_margin,
                                            width: R.screen().width / 2,
                                            paddingLeft: R.dimens.activity_margin,
                                            paddingRight: R.dimens.activity_margin,
                                            borderColor: 'transparent',
                                            backgroundColor: R.colors.loginButtonBackground
                                        }}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                </InputScrollView>
            </View >
        );
    }
}

function mapStateToProps(state) {
    return {
        //get emaildata from the reducer 
        emaildata: state.SignUpReducer.emaildata,
        emailisfatching: state.SignUpReducer.emailisfatching,
        emailfatchdata: state.SignUpReducer.emailfatchdata,

        //get MobileNo Data from the reducer 
        SignUpMobileData: state.SignUpReducer.SignUpMobileData,
        SignUpMobileIsFetching: state.SignUpReducer.SignUpMobileIsFetching,
        SignUpMobileFetchData: state.SignUpReducer.SignUpMobileFetchData,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        //perform action on generate otp button clicked
        signUpWithMobile: (request) => dispatch(signUpWithMobile(request)),

        //perform action on generate otp button clicked
        onGenerateOtp: (request) => dispatch(onGenerateOtp(request)),

        //for clear reducer
        signUpWithMobileEmailClear: () => dispatch(signUpWithMobileEmailClear()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(QuickSignUpScreen)