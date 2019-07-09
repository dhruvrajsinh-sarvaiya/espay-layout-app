import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { signInWithEmail, signInWithMobile } from '../../actions/Login/loginAction'
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
import { setData } from '../../App';

class QuickLoginScreen extends Component {

    constructor(props) {
        super(props);

        //Create reference
        this.toast = React.createRef();
        this.progressDialog = React.createRef();
        this.mainInputTexts = {};

        //To Bind All Method
        this.onQuickLogin = this.onQuickLogin.bind(this);

        //Defeine initial state
        this.state = {
            emailOrMobile: '',
        }
    }

    componentDidMount = () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    };

    shouldComponentUpdate = (nextProps, _nextState) => {
        //Stop twice api call 
        return isCurrentScreen(nextProps);
    };

    componentDidUpdate = (prevProps, _prevState) => {
        const { SignInEmailFetchData, SignInEmailData, SignInMobileFetchData, SignInMobileData } = this.props;
        if (SignInEmailData !== prevProps.SignInEmailData) {
            //Check SignIn Email Api Response 
            if (!SignInEmailFetchData) {
                try {
                    if (validateResponseNew({ response: SignInEmailData, })) {
                        // on success responce redirect to otp screen 
                        this.props.navigation.navigate('SignInEmailWithOtp', { Email: this.state.emailOrMobile, appkey: SignInEmailData.Appkey })
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
                        this.props.navigation.navigate('SignInMobileWithOtp', { MobileNo: this.state.emailOrMobile, appkey: SignInMobileData.Appkey })
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
            setData({ [ServiceUtilConstant.KEY_DialogCount]: 0 });

            // for check email is empty or not
            if (isEmpty(this.state.emailOrMobile)) {
                this.toast.Show(R.strings.enterEmailorMobile);
                return;
            }
            let isMobile = validateNumeric(this.state.emailOrMobile);
            let isEmail = !CheckEmailValidation(this.state.emailOrMobile);

            // If user input content matched with mobile number than check mobile validation
            if (isMobile == true && isEmail == false) {
                if (!validateMobileNumber(this.state.emailOrMobile) || (this.state.emailOrMobile.length != 10)) {
                    this.toast.Show(R.strings.phoneNumberValidation);
                    return;
                }
            } else {
                // If user input content matched with email than check email validation
                if (CheckEmailValidation(this.state.emailOrMobile)) {
                    this.toast.Show(R.strings.Enter_Valid_Email);
                    return;
                }
            }

            //Call api based on Email or Mobile Which is inserted
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
                            //Note : ipAddress parameter is passed in its saga.
                        }

                        if (isMobile) {
                            request = Object.assign({}, request, {
                                Mobile: this.state.emailOrMobile,
                            });
                            //call api for send otp to given Mobile No
                            this.props.signInWithMobile(request)
                        }

                        if (isEmail) {
                            request = Object.assign({}, request, {
                                Email: (this.state.emailOrMobile).toLowerCase(),
                            })
                            //call api for send otp to given email address
                            this.props.signInWithEmail(request)
                        }
                    } catch (error) {
                        this.progressDialog.dismiss();
                        showAlert(R.strings.NetworkError, R.strings.SLOW_INTERNET, 5);
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
            <View style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar translucent />

                {/* Progress Dialog */}
                <ProgressDialog ref={component => this.progressDialog = component} isShow={SignInEmailIsFetching || SignInMobileIsFetching} translucent={true} />

                {/* For Toast */}
                <CommonToast ref={comp => this.toast = comp} />

                {/* To Set All View in ScrollView */}
                <InputScrollView keyboardShouldPersistTaps='always' showsVerticalScrollIndicator={false} >
                    {/* Background Image Header */}
                    <BackgroundImageHeaderWidget navigation={this.props.navigation} />

                    <View style={{
                        flex: 1,
                        paddingLeft: R.dimens.activity_margin,
                        paddingRight: R.dimens.activity_margin,
                        paddingTop: R.dimens.margin_top_bottom,
                        justifyContent: 'center'
                    }}>

                        {/* for Email Id/ Mobile No. */}
                        <EditText
                            ref={input => { this.mainInputTexts['etEmailMobileLogin'] = input; }}
                            style={{ marginTop: 0 }}
                            placeholder={R.strings.emailMobile}
                            multiline={false}
                            maxLength={50}
                            keyboardType={'default'}
                            returnKeyType={"done"}
                            value={this.state.emailOrMobile}
                            onChangeText={(emailOrMobile) => this.setState({ emailOrMobile })}
                            isRound={true}
                            focusable={true}
                            onFocus={() => changeFocus(this.mainInputTexts, 'etEmailMobileLogin')}
                        />

                        {/* To send otp */}
                        <Button
                            isRound={true}
                            textStyle={{ color: R.colors.white }}
                            title={R.strings.sendOTP}
                            onPress={this.onQuickLogin}
                            style={{
                                marginTop: R.dimens.padding_top_bottom_margin,
                                marginBottom: R.dimens.widgetMargin,
                                paddingLeft: R.dimens.activity_margin,
                                paddingRight: R.dimens.activity_margin,
                                borderColor: 'transparent',
                                backgroundColor: R.colors.loginButtonBackground
                            }}
                        />
                    </View>
                </InputScrollView>
            </View >
        );
    }
}

function mapStateToProps(state) {
    return {
        //For Update isPortrait true or false
        preference: state.preference.dimensions.isPortrait,
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