import React, { Component } from 'react';
import { View, } from 'react-native';
import { connect } from 'react-redux'
import CommonStatusBar from '../../native_theme/components/CommonStatusBar'
import { changeTheme, showAlert, getDeviceID } from '../../controllers/CommonUtils';
import { isInternet, validateResponseNew, getRemainingSeconds } from '../../validations/CommonValidation';
import { onVerifySignUpOTP, onResendOTP } from '../../actions/SignUpProcess/signUpAction';
import { isCurrentScreen } from '../Navigation';
import { ServiceUtilConstant, timerScreen } from '../../controllers/Constants';
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import R from '../../native_theme/R';
import BackgroundImageHeaderWidget from '../../native_theme/components/BackgroundImageHeaderWidget';
import SafeView from '../../native_theme/components/SafeView';
import OTPScreenWidget from '../Widget/OTPScreenWidget';
import moment from 'moment'
import { setData } from '../../App';

class SignUpWithOtp extends Component {

    constructor(props) {
        super(props);

        //Create reference
        this.progressDialog = React.createRef();
        this.inputs = {};

        //Data From Previous Screen
        let { params } = this.props.navigation.state;

        //To Bind All Method
        this.onVerifyOTP = this.onVerifyOTP.bind(this);
        this.onResendOTP = this.onResendOTP.bind(this);

        //Define All State initial state
        this.state = {
            EmailAddress: params && params.email,
            OTP: '',
            isShowTimer: false,
            VerifyBit: params && params.VerifyBit,
            until: ServiceUtilConstant.timer_time_seconds,
        }
    }

    componentDidMount = () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check Verify Bit is true then call resend api for send otp 
        let remainingSeconds = getRemainingSeconds(timerScreen.signUpEmailWithOTP);
        if (remainingSeconds > 0) {
            this.setState({ isShowTimer: true, until: remainingSeconds })
        } else {
            if (this.state.VerifyBit) {
                this.onResendOTP();//get remaining seconds from data
            }
        }
    }

    // Verify OTP 
    onVerifyOTP = async () => {
        this.progressDialog.show()

        //Check NetWork is Available or not
        if (await isInternet()) {
            try {

                //Call SignUp Email Verify Otp Method 
                let emailOtpVerifyRequest = {
                    otp: this.state.OTP,
                    email: this.state.EmailAddress,
                    deviceId: await getDeviceID(),
                    mode: ServiceUtilConstant.Mode,
                    PreferedLanguage: R.strings.getLanguage(),
                    hostName: ServiceUtilConstant.hostName
                    //Note : IPAddress parameter is passed in its saga.
                }

                //call api for SignUp Email Verify Otp
                this.props.onVerifySignUpOTP(emailOtpVerifyRequest)
            } catch (error) {
                this.progressDialog.dismiss();
                showAlert(R.strings.NetworkError, R.strings.SLOW_INTERNET, 5);
            }
        }
    }

    onResendOTP = async () => {
        this.progressDialog.show()

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Call SignUp Email Resend Otp Method 
            try {
                let emailOtpResendRequest = {
                    email: this.state.EmailAddress,
                    deviceId: await getDeviceID(),
                    mode: ServiceUtilConstant.Mode,
                    PreferedLanguage: R.strings.getLanguage(),
                    hostName: ServiceUtilConstant.hostName
                    //Note : IPAddress parameter is passed in its saga.
                }

                //call api for SignUp Email Resend Otp
                this.props.onResendOTP(emailOtpResendRequest)
            } catch (error) {
                this.progressDialog.dismiss();
                showAlert(R.strings.NetworkError, R.strings.SLOW_INTERNET, 5);
            }
        }
    }

    shouldComponentUpdate = (nextProps, _nextState) => {
        /* stop twice api call  */
        return isCurrentScreen(nextProps);
    };

    componentDidUpdate = (prevProps, _prevState) => {
        try {
            //Get All Updated Feild of Particular actions
            const { VerifyOtpdata, VerifyOtpFetchData, ResendOtpFetchData, ResendOtpdata } = this.props;

            if (VerifyOtpdata !== prevProps.VerifyOtpdata) {

                //To Check Verify Otp Response Data Fetch or Not
                if (!VerifyOtpFetchData) {
                    try {
                        //Get Verify Otp Api Return Message
                        let VerifyOtpStMsg = VerifyOtpdata.ReturnMsg;
                        if (validateResponseNew({ response: VerifyOtpdata })) {
                            showAlert(R.strings.Success + '!', VerifyOtpStMsg, 0, () => this.props.navigation.navigate('QuickLogin'))
                            this.refs.etOTP.clear();
                            this.setState({ OTP: '' })
                        } else {
                            //if response is failure then clear OTP state
                            this.setState({ OTP: '' })
                        }
                        this.refs.etOTP.clear();
                    } catch (error) {
                        //if response is failure then clear OTP state
                        this.setState({ OTP: '' })
                        this.refs.etOTP.clear();
                    }
                }
            }

            if (ResendOtpdata !== prevProps.ResendOtpdata) {

                //To Check Resend Otp Response Data Fetch or Not
                if (!ResendOtpFetchData) {
                    try {
                        //Get Resend Otp Api STCODE and STMSG
                        let ResendOtpStMsg = ResendOtpdata.ReturnMsg;
                        if (validateResponseNew({ response: ResendOtpdata })) {
                            showAlert(R.strings.Success + '!', ResendOtpStMsg, 0, () => {
                                this.setState({ isShowTimer: true, OTP: '' })
                                this.forceUpdate()
                                this.refs.etOTP.clear();

                                //store ending time in redux persist
                                let afterSeconds = moment().add(ServiceUtilConstant.timer_time_seconds, 'seconds').format('HH:mm:ss');
                                setData({
                                    timerScreen: timerScreen.signUpEmailWithOTP,
                                    [ServiceUtilConstant.timerEndTime]: afterSeconds
                                });
                            })
                        } else {
                            //if response is failure then clear OTP state
                            this.setState({ OTP: '' })
                        }
                        this.refs.etOTP.clear();
                    } catch (error) {
                        //if response is failure then clear OTP state
                        this.setState({ OTP: '' })
                        this.refs.etOTP.clear();
                    }
                }
            }
        } catch (e) {
            //handle catch part
        }
    }

    render() {
        //Get is Fetching value For All APIs to handle Progress bar in All Activity
        const { VerifyOtpisFetching, ResendOtpisFetching } = this.props;

        return (

            <View style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar translucent />

                {/* Background Image Header */}
                <BackgroundImageHeaderWidget navigation={this.props.navigation} />

                {/* Progress Dialog */}
                <ProgressDialog ref={component => this.progressDialog = component} isShow={VerifyOtpisFetching || ResendOtpisFetching} translucent={true} />

                <SafeView style={{ flex: 1 }}>

                    {/* otp screen widget */}
                    <OTPScreenWidget ref='etOTP' ctx={this} navigation={this.props.navigation} />
                </SafeView >

            </View >
        );
    }
}

function mapStateToProps(state) {
    return {
        //For Update isPortrait true or false
        preference: state.preference.dimensions.isPortrait,

        //Updated Data For Verify Otp Api
        VerifyOtpFetchData: state.SignUpReducer.VerifyOtpFetchData,
        VerifyOtpisFetching: state.SignUpReducer.VerifyOtpisFetching,
        VerifyOtpdata: state.SignUpReducer.VerifyOtpdata,

        //Updated Data For Resend Otp Api
        ResendOtpFetchData: state.SignUpReducer.ResendOtpFetchData,
        ResendOtpisFetching: state.SignUpReducer.ResendOtpisFetching,
        ResendOtpdata: state.SignUpReducer.ResendOtpdata,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform Verify Otp Action
        onVerifySignUpOTP: (emailOtpVerifyRequest) => dispatch(onVerifySignUpOTP(emailOtpVerifyRequest)),
        //Perform Resend Otp Action 
        onResendOTP: (emailOtpResendRequest) => dispatch(onResendOTP(emailOtpResendRequest))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUpWithOtp)