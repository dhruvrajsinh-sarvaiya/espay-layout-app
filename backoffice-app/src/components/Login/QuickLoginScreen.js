import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { signInWithEmail, signInWithMobile } from '../../actions/Login/loginAction'
import CommonStatusBar from '../../native_theme/components/CommonStatusBar'
import { isEmpty, isInternet, validateResponseNew, validateMobileNumber, validateNumeric, } from '../../validations/CommonValidation'
import { changeTheme, getDeviceID, changeFocus, sendEvent } from '../../controllers/CommonUtils';
import EditText from '../../native_theme/components/EditText'
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import { isCurrentScreen, addRouteToBackPress } from '../Navigation';
import Button from '../../native_theme/components/Button';
import { showAlert } from '../../controllers/CommonUtils';
import { ServiceUtilConstant, Events } from '../../controllers/Constants';
import CommonToast from '../../native_theme/components/CommonToast';
import R from '../../native_theme/R';
import BackgroundImageHeaderWidget from '../../native_theme/components/BackgroundImageHeaderWidget';
import { CheckEmailValidation } from '../../validations/EmailValidation'
import InputScrollView from 'react-native-input-scroll-view';
import { setData } from '../../App';
const { width, height } = R.screen();

class QuickLoginScreen extends Component {

    constructor(props) {
        super(props);

        this.toast = React.createRef();
        this.progressDialog = React.createRef();

        //To Bind All Method
        this.onQuickLogin = this.onQuickLogin.bind(this);

        addRouteToBackPress(props);
        this.onBackPress = this.onBackPress.bind(this);
        this.props.navigation.setParams({ onBackPress: this.onBackPress });

        this.mainInputTexts = {};

        this.state = {
            emailMobile: '',
        }
    }

    onBackPress() {
        //This will redirect to login screen.
        sendEvent(Events.SessionLogout, false);
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
        const { SignInEmailFetchData, SignInEmailData, SignInMobileFetchData, SignInMobileData } = this.props;

        if (SignInEmailData !== prevProps.SignInEmailData) {
            //Check SignIn Email Api Response 
            if (!SignInEmailFetchData) {
                try {

                    if (validateResponseNew({ response: SignInEmailData, })) {
                        // on success responce redirect to otp screen 
                        this.props.navigation.navigate('SignInEmailWithOtp', { Email: this.state.emailMobile, appkey: SignInEmailData.Appkey })
                    }
                } catch (error) {
                    //Handle Catch and Notify User to Exception.
                }
            }
        }

        if (SignInMobileData !== prevProps.SignInMobileData) {
            //check Sign In Mobile Request Api data
            if (!SignInMobileFetchData) {
                try {
                    if (validateResponseNew({ response: SignInMobileData })) {
                        // on success responce redirect to otp screen 
                        this.props.navigation.navigate('SignInMobileWithOtp', { MobileNo: this.state.emailMobile, appkey: SignInMobileData.Appkey })
                    }

                } catch (error) {
                    //Handle Catch and Notify User to Exception.
                }
            }
        }
    }

    onQuickLogin = async () => {

        try {

            //Set dialog show count to 0
            setData({
                [ServiceUtilConstant.KEY_DialogCount]: 0
            });

            // for check email is empty or not

            if (isEmpty(this.state.emailMobile)) {

                this.toast.Show(R.strings.enterEmailorMobile);
                return;
            }

            let isMobile = validateNumeric(this.state.emailMobile);

            let isEmail = !CheckEmailValidation(this.state.emailMobile);

            // If user input content matched with mobile number than check mobile validation
            if (isMobile == true && isEmail == false) {

                if (!validateMobileNumber(this.state.emailMobile) ||
                    (this.state.emailMobile.length != 10)) {

                    this.toast.Show(R.strings.phoneNumberValidation);
                    return;

                }
            }
            else {
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

                        //Bind Request For Email SignIn
                        let request = {
                            DeviceId: await getDeviceID(),
                            Mode: ServiceUtilConstant.Mode,
                            HostName: ServiceUtilConstant.hostName
                        }
                        //Note : ipAddress parameter is passed in its saga.

                        if (isMobile) {
                            request = Object.assign({}, request, {
                                Mobile: this.state.emailMobile,
                            });

                            //call api for send otp to given Mobile No
                            this.props.signInWithMobile(request)
                        }

                        if (isEmail) {
                            request = Object.assign({}, request, {
                                Email: (this.state.emailMobile).toLowerCase(),
                            })

                            //call api for send otp to given email address
                            this.props.signInWithEmail(request)
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

        const { SignInEmailIsFetching, SignInMobileIsFetching } = this.props;

        return (
            <View style={{ flex: 1, width, height, backgroundColor: R.colors.background }}>

                {/* To Set Status Bas as per out theme */}
                <CommonStatusBar translucent />

                {/* Progress Dialog */}
                <ProgressDialog ref={component => this.progressDialog = component} isShow={SignInEmailIsFetching || SignInMobileIsFetching} translucent={true} />

                {/* For Toast */}
                <CommonToast
                    ref={comp => this.toast = comp}
                />

                {/* To Set All View in ScrolView */}
                <InputScrollView
                    keyboardShouldPersistTaps='always' showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}>

                    <View style={
                        { height: R.screen().height }}>

                        {/* Background Image Header */}
                        <BackgroundImageHeaderWidget />

                        <View style={
                            { flex: 1, paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingTop: R.dimens.margin_top_bottom }}>

                            <View style={{ justifyContent: 'center' }}>
                                <View>
                                    {/* for Email Id/ Mobile No. */}
                                    <EditText
                                        isRound={true}
                                        style={{ marginTop: 0 }}
                                        placeholder={R.strings.emailMobile}
                                        onChangeText={(emailMobile) => this.setState({ emailMobile })}
                                        focusable={true}
                                        onFocus={() => changeFocus(this.mainInputTexts, 'etEmailMobile')}
                                        multiline={false}
                                        keyboardType={'default'}
                                        returnKeyType={"done"}
                                        ref={input => { this.mainInputTexts['etEmailMobile'] = input; }}
                                        value={this.state.emailMobile}
                                    />

                                    {/* To send otp */}
                                    <Button
                                        isRound={true}
                                        textStyle={{ color: R.colors.white }}
                                        title={R.strings.sendOTP}
                                        onPress={this.onQuickLogin}
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
        SignInEmailFetchData: state.loginReducer.SignInEmailFetchData,
        SignInEmailData: state.loginReducer.SignInEmailData,
        SignInEmailIsFetching: state.loginReducer.SignInEmailIsFetching,

        //get MobileNo Data from the reducer 
        SignInMobileFetchData: state.loginReducer.SignInMobileFetchData,
        SignInMobileData: state.loginReducer.SignInMobileData,
        SignInMobileIsFetching: state.loginReducer.SignInMobileIsFetching,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        //perform action on generate otp button clicked
        signInWithEmail: (emailOtpRequest) => dispatch(signInWithEmail(emailOtpRequest)),

        //perform action on generate otp button clicked
        signInWithMobile: (mobileNoOtpRequest) => dispatch(signInWithMobile(mobileNoOtpRequest)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(QuickLoginScreen)