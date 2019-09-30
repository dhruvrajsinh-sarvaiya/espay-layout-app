import React, { Component } from 'react';
import {
    View,
    Text,
    ScrollView,
} from 'react-native';
import { connect } from 'react-redux'
import CodeInput from 'react-native-code-input';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar'
import { changeTheme, showAlert, getDeviceID } from '../../controllers/CommonUtils';
import Button from '../../native_theme/components/Button'
import { isInternet, validateResponseNew } from '../../validations/CommonValidation';
import { onVerifySignUpOTP, onResendOTP } from '../../actions/SignUpProcess/signUpAction';
import { isCurrentScreen } from '../Navigation';
import CountDown from 'react-native-countdown-component';
import { ServiceUtilConstant, Fonts } from '../../controllers/Constants';
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import R from '../../native_theme/R';
import TextViewMR from '../../native_theme/components/TextViewMR';
import TextViewHML from '../../native_theme/components/TextViewHML';
import BackgroundImageHeaderWidget from '../../native_theme/components/BackgroundImageHeaderWidget';

const { width, height } = R.screen();

class SignUpWithOtp extends Component {

    constructor(props) {
        super(props);

        this.progressDialog = React.createRef();
        this.inputs = {};

        let { params } = this.props.navigation.state;


        //Define All State initial state
        this.state = {
            EmailAddress: params.email,
            OTP: '',
            isShowTimer: false,
            VerifyBit: params.VerifyBit,
        }
    }

    componentDidMount = () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check Verify Bit is true then call resend api for send otp 
        if (this.state.VerifyBit) {
            this.onResendOTP();
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
                showAlert(R.strings.status, R.strings.SLOW_INTERNET, 3);
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
                showAlert(R.strings.status, R.strings.SLOW_INTERNET, 3);
            }
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps);
    };

    componentDidUpdate = (prevProps, prevState) => {
        //Get All Updated Feild of Particular actions
        const { VerifyOtpdata, VerifyOtpFetchData, ResendOtpFetchData, ResendOtpdata } = this.props;

        if (VerifyOtpdata !== prevProps.VerifyOtpdata) {
            //To Check Verify Otp Response Data Fetch or Not
            if (!VerifyOtpFetchData) {
                try {
                    //Get Verify Otp Api Return Message
                    let VerifyOtpStMsg = VerifyOtpdata.ReturnMsg;
                    if (validateResponseNew({ response: VerifyOtpdata })) {
                        showAlert(R.strings.Success, VerifyOtpStMsg, 0, () => this.props.navigation.navigate('QuickLogin'))
                        this.refs.etOTP.clear();
                    }
                    this.refs.etOTP.clear();
                } catch (error) {

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
                        showAlert(R.strings.Success, ResendOtpStMsg, 0, () => {
                            this.setState({ isShowTimer: true })
                            this.refs.etOTP.clear();
                        })
                    }
                    this.refs.etOTP.clear();
                } catch (error) {

                }
            }
        }
    }

    render() {

        //Get is Fetching value For All APIs to handle Progress bar in All Activity
        const { VerifyOtpisFetching, ResendOtpisFetching } = this.props;

        return (

            <View style={{ flex: 1, width, height, backgroundColor: R.colors.background }}>

                {/* To Set Status Bas as per out theme */}
                <CommonStatusBar />

                {/* Progress Dialog */}
                <ProgressDialog ref={component => this.progressDialog = component} isShow={VerifyOtpisFetching || ResendOtpisFetching} />

                <View style={{ flex: 1, justifyContent: 'space-between', }}>

                    {/* To Set All View in ScrolView */}
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <BackgroundImageHeaderWidget />
                        <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.padding_top_bottom_margin, }}>
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ marginTop: R.dimens.widget_top_bottom_margin, marginBottom: R.dimens.widgetMargin, fontSize: R.dimens.mediumText, color: R.colors.textPrimary, fontFamily: Fonts.MontserratBold }}>{R.strings.PleaseEnter}</Text>
                                <TextViewHML style={{ marginTop: R.dimens.widgetMargin, fontSize: R.dimens.smallestText, color: R.colors.textPrimary }}>{R.strings.verificationSMSMessage}</TextViewHML>
                            </View>
                            <View style={{ height: height / 10 }}>
                                <CodeInput
                                    ref="etOTP"
                                    secureTextEntry
                                    activeColor={R.colors.accent}
                                    inactiveColor={R.colors.imageBorder}
                                    autoFocus={false}
                                    inputPosition='center'
                                    borderType='square'
                                    codeLength={6}
                                    size={R.dimens.normalizePixels(42)}
                                    //cellBorderWidth={R.dimens.normalizePixels(1.0)}
                                    onFulfill={(OTP) => {
                                        this.setState({ OTP })
                                    }}
                                    containerStyle={{ marginTop: R.dimens.widget_top_bottom_margin }}
                                    codeInputStyle={{ borderWidth: R.dimens.pickerBorderWidth, backgroundColor: R.colors.cardBackground, elevation: R.dimens.listCardElevation, borderColor: R.colors.cardBackground, }}
                                />
                            </View>

                            {this.state.isShowTimer ?
                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: R.dimens.activity_margin }}>
                                    <Text style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, textAlign: 'right', fontFamily: Fonts.HindmaduraiSemiBold }} >{R.strings.Resend_In}  </Text>
                                    <CountDown style={{ alignItems: 'center' }}
                                        until={ServiceUtilConstant.ResendOTP_Timer}
                                        onFinish={() => {
                                            /* To hide timer after 200 milliseconds because clearInterval code is under CountDown class */
                                            setTimeout(() => { this.setState({ isShowTimer: false }) }, 200);
                                        }}
                                        digitStyle={{ backgroundColor: R.colors.background, }}
                                        digitTxtStyle={{ color: R.colors.accent, fontSize: R.dimens.mediumText }}
                                        separatorStyle={{ color: R.colors.accent }}
                                        showSeparator
                                        timeToShow={['M', 'S']}
                                        timeLabels={{ m: null, s: null }}
                                    />
                                    <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, textAlign: 'center', }}>{R.strings.sec}</TextViewHML>
                                </View>
                                :
                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: R.dimens.activity_margin }}>
                                    <TextViewHML style={{ flex: 1, fontSize: R.dimens.smallText, color: R.colors.textPrimary, textAlign: 'right' }} >{R.strings.DontReceivedCode}  </TextViewHML>
                                    <View style={{ flex: 1, }}>
                                        <TextViewMR style={{ fontSize: R.dimens.mediumText, color: R.colors.accent, textAlign: 'left', textDecorationLine: 'underline' }} onPress={this.onResendOTP}>{R.strings.ResendOtp.toUpperCase()}</TextViewMR>
                                    </View>
                                </View>
                            }

                            {/* To Set Verify Button */}
                            <Button
                                isRound={true}
                                title={R.strings.VerifyOtp}
                                onPress={this.onVerifyOTP}
                                style={{ marginTop: R.dimens.padding_top_bottom_margin, }}
                                disabled={this.state.OTP === '' ? true : false} />
                        </View>
                    </ScrollView>
                </View>
            </View >
        );
    }
}

function mapStateToProps(state) {
    return {
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

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SignUpWithOtp)