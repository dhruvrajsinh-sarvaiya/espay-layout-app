import React, { Component } from 'react';
import { View, } from 'react-native';
import { connect } from 'react-redux'
import CommonStatusBar from '../../native_theme/components/CommonStatusBar'
import { changeTheme, showAlert, getDeviceID } from '../../controllers/CommonUtils';
import { isInternet, validateResponseNew, getRemainingSeconds } from '../../validations/CommonValidation';
import { signUpMobileResendOTP, signUpMobileVerifyOTP } from '../../actions/SignUpProcess/signUpAction';
import { isCurrentScreen } from '../Navigation';
import { ServiceUtilConstant, timerScreen } from '../../controllers/Constants';
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import OTPScreenWidget from '../Widget/OTPScreenWidget';
import R from '../../native_theme/R';
import SafeView from '../../native_theme/components/SafeView';
import BackgroundImageHeaderWidget from '../../native_theme/components/BackgroundImageHeaderWidget';
import moment from 'moment';
import { setData } from '../../App';

class SignUpMobileWithOtp extends Component {

    constructor(props) {
        super(props);

        //Create reference
        this.progressDialog = React.createRef();
        this.inputs = {};

        //To Bind All Method
        this.onVerifyOTP = this.onVerifyOTP.bind(this);
        this.onResendOTP = this.onResendOTP.bind(this);

        //Data from previous screen 
        const { params } = this.props.navigation.state;

        //Define All State initial state
        this.state = {
            MobileNo: params && params.MobileNo,
            CountryCode: params && params.CountryCode,
            OTP: '',
            isShowTimer: false,
            until: ServiceUtilConstant.timer_time_seconds,
            VerifyBit: params && params.VerifyBit,
        }
    }

    componentDidMount = () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check Verify Bit is true then call resend api for send otp 
        //Check Verify Bit is true then call resend api for send otp 
        let remainingSeconds = getRemainingSeconds(timerScreen.signUpMobileWithOTP);
        if (remainingSeconds > 0) {
            this.setState({ isShowTimer: true, until: remainingSeconds })
        } else {
            if (this.state.VerifyBit) {
                this.onResendOTP();//get remaining seconds from data
            }
        }
    };

    //Resend Otp Api calling
    onResendOTP = async () => {
        this.progressDialog.show()

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Call Resend Otp Method 
            try {

                let mobileNoOtpResendRequest = {
                    mobile: this.state.MobileNo,
                    CountryCode: this.state.CountryCode,
                    deviceId: await getDeviceID(),
                    PreferedLanguage: R.strings.getLanguage(),
                    mode: ServiceUtilConstant.Mode,
                    hostName: ServiceUtilConstant.hostName
                }
                //Note : IPAddress parameter is passed in its saga.

                //call api for Resend Mobile Otp
                this.props.signUpMobileResendOTP(mobileNoOtpResendRequest)
            } catch (error) {
                this.progressDialog.dismiss();
                showAlert(R.strings.NetworkError, R.strings.SLOW_INTERNET, 5);
            }
        }
    }

    //Verify Otp Api Calling
    onVerifyOTP = async () => {
        this.progressDialog.show()

        //Check NetWork is Available or not
        if (await isInternet()) {
            try {

                //Call Verify Otp Method 
                let mobileNoOtpVerifyRequest = {
                    otp: this.state.OTP,
                    mobile: this.state.MobileNo,
                    PreferedLanguage: R.strings.getLanguage(),
                    deviceId: await getDeviceID(),
                    mode: ServiceUtilConstant.Mode,
                    hostName: ServiceUtilConstant.hostName
                }
                //Note : IPAddress parameter is passed in its saga.

                //call api for Resend Mobile Otp
                this.props.signUpMobileVerifyOTP(mobileNoOtpVerifyRequest)
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

        //Get All Updated Feild of Particular actions
        const { ResendMobileOtpFetchData, ResendMobileOtpdata, VerifyMobileOtpFetchData, VerifyMobileOtpdata } = this.props;

        if (ResendMobileOtpdata !== prevProps.ResendMobileOtpdata) {

            //To Check Resend Otp Response Data Fetch or Not
            if (!ResendMobileOtpFetchData) {
                try {
                    //Get Resend Otp Api STCODE and STMSG
                    let ResendOtpStMsg = ResendMobileOtpdata.ReturnMsg;

                    if (validateResponseNew({ response: ResendMobileOtpdata })) {
                        showAlert(R.strings.Success + '!', ResendOtpStMsg, 0, () => {
                            this.setState({ isShowTimer: true, OTP: '' });
                            this.forceUpdate();
                            this.refs.etOTP.clear();

                            //store ending time in redux persist
                            let afterSeconds = moment().add(ServiceUtilConstant.timer_time_seconds, 'seconds').format('HH:mm:ss');
                            setData({
                                timerScreen: timerScreen.signUpMobileWithOTP,
                                [ServiceUtilConstant.timerEndTime]: afterSeconds
                            });
                        })
                    } else {
                        //if response is failure then clear OTP state
                        this.setState({ OTP: '' })
                    }
                    this.refs.etOTP.clear();
                } catch (error) {
                    //logger('MOBILE RESEND', error.message)
                    //if response is failure then clear OTP state
                    this.setState({ OTP: '' })
                    this.refs.etOTP.clear();
                }
            }
        }

        if (VerifyMobileOtpdata !== prevProps.VerifyMobileOtpdata) {

            //To Check Verify Otp Response Data Fetch or Not
            if (!VerifyMobileOtpFetchData) {
                try {
                    //Get Verify Otp Api Return Message
                    let VerifyOtpStMsg = VerifyMobileOtpdata.ReturnMsg;
                    if (validateResponseNew({ response: VerifyMobileOtpdata })) {
                        showAlert(R.strings.Success + '!', VerifyOtpStMsg, 0, () => this.props.navigation.navigate('QuickLogin'))
                        this.refs.etOTP.clear();
                    } else {
                        //if response is failure then clear OTP state
                        this.setState({ OTP: '' })
                    }
                    this.refs.etOTP.clear();
                } catch (error) {
                    //logger('VERIFY MOBILE OTP', error.message)
                    //if response is failure then clear OTP state
                    this.setState({ OTP: '' })
                    this.refs.etOTP.clear();
                }
            }
        }
    }

    render() {

        //Get is Fetching value For All APIs to handle Progress bar in All Activity
        const { ResendMobileOtpisFetching, VerifyMobileOtpisFetching } = this.props;

        return (
            <View style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar translucent />

                {/* Background Image Header */}
                <BackgroundImageHeaderWidget navigation={this.props.navigation} />

                {/* Progress Dialog */}
                <ProgressDialog ref={component => this.progressDialog = component} isShow={ResendMobileOtpisFetching || VerifyMobileOtpisFetching} translucent={true} />

                <SafeView style={{ flex: 1 }}>

                    {/* otp screen widget */}
                    <OTPScreenWidget ref='etOTP' ctx={this} navigation={this.props.navigation} />

                </SafeView>
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        //Updated Data For Resend Mobile Otp Api
        ResendMobileOtpFetchData: state.SignUpReducer.ResendMobileOtpFetchData,
        ResendMobileOtpisFetching: state.SignUpReducer.ResendMobileOtpisFetching,
        ResendMobileOtpdata: state.SignUpReducer.ResendMobileOtpdata,

        //Updated Data For Verify Otp Api 
        VerifyMobileOtpFetchData: state.SignUpReducer.VerifyMobileOtpFetchData,
        VerifyMobileOtpisFetching: state.SignUpReducer.VerifyMobileOtpisFetching,
        VerifyMobileOtpdata: state.SignUpReducer.VerifyMobileOtpdata,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform Resend Otp Action 
        signUpMobileResendOTP: (mobileNoOtpResendRequest) => dispatch(signUpMobileResendOTP(mobileNoOtpResendRequest)),
        //Perform Verify Otp Action
        signUpMobileVerifyOTP: (mobileNoOtpVerifyRequest) => dispatch(signUpMobileVerifyOTP(mobileNoOtpVerifyRequest)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUpMobileWithOtp)