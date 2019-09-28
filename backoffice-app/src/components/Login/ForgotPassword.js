import React, { Component } from 'react';
import { View, } from 'react-native';
import { connect } from 'react-redux';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import Button from '../../native_theme/components/Button';
import { isEmpty, isInternet, getRemainingSeconds, validateResponseNew } from '../../validations/CommonValidation';
import { forgotPassword } from '../../actions/Login/ForgotPasswordAction'
import { changeTheme, addListener, sendEvent, showAlert, getDeviceID, changeFocus } from '../../controllers/CommonUtils'
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import EditText from '../../native_theme/components/EditText'
import CountDown from 'react-native-countdown-component';
import { ServiceUtilConstant, timerScreen, Events } from '../../controllers/Constants'
import { CheckEmailValidation } from '../../validations/EmailValidation'
import { isCurrentScreen } from '../Navigation';
import CommonToast from '../../native_theme/components/CommonToast';
import R from '../../native_theme/R';
import BackgroundImageHeaderWidget from '../../native_theme/components/BackgroundImageHeaderWidget';
import InputScrollView from 'react-native-input-scroll-view';
import { setData } from '../../App';

class ForgotPasswordComponent extends Component {

    constructor(props) {
        super(props)

        // Create reference
        this.toast = React.createRef();
        this.progressDialog = React.createRef();

        this.mainInputTexts = {};

        // Define all initial state
        this.state = {
            email: null,
            isShowTimer: false,
            until: ServiceUtilConstant.timer_time_seconds,
            isFirstTime: true,
            isForgotSuceessAlert: false,
        }

        // for focus on next field
        this.inputs = {}
    }

    componentDidMount = () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        if (isCurrentScreen(this.props)) {

            //get remaining seconds from data
            let remainingSeconds = getRemainingSeconds(timerScreen.forgotPassword);
            if (remainingSeconds > 0) {
                this.setState({ isShowTimer: true, until: remainingSeconds })
            }

            this.eventListener = addListener(Events.CounterListener, (left, screen) => {
                //if both screen are same then update state
                if (screen == timerScreen.forgotPassword) {
                    this.setState({ isShowTimer: left != 0, until: left })
                }
            })
        }
    };

    componentWillUnmount = () => {
        if (this.eventListener) {
            this.eventListener.remove();
        }
    };

    componentDidUpdate = (prevProps, prevState) => {

        // Get updated field from reducer
        const { ForgotPassworddata } = this.props;

        // compare response with previous response
        if (ForgotPassworddata !== prevProps.ForgotPassworddata) {

            // Data is not null
            if (ForgotPassworddata) {

                // Check isForgotSuceessAlert is true or false
                if (this.state.isForgotSuceessAlert) {

                    sendEvent(Events.Timer, ServiceUtilConstant.timer_time_seconds, timerScreen.forgotPassword);

                    // on success responce redirect to Login screen 
                    showAlert(R.strings.Success, ForgotPassworddata.ReturnMsg, 0, () => this.props.navigation.goBack())
                }
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
        if (ForgotPasswordComponent.oldProps !== props) {
            ForgotPasswordComponent.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            const { ForgotPasswordFetchData, ForgotPassworddata } = props;

            if (!ForgotPasswordFetchData) {
                try {
                    //Check ForgotPasswordFetchData Api Response 
                    if (validateResponseNew({ response: ForgotPassworddata })) {
                        return {
                            ...state,
                            isShowTimer: true,
                            isForgotSuceessAlert: true
                        }
                    }
                } catch (error) {
                    return {
                        ...state,
                        isShowTimer: false,
                        isForgotSuceessAlert: false,
                    }
                }
            }
        }
        return null
    }

    shouldComponentUpdate = (nextProps, nextState) => {

        //stop twice api call
        return isCurrentScreen(nextProps)
    };

    onPressSubmit = async () => {

        //Set dialog show count to 0
        setData({ [ServiceUtilConstant.KEY_DialogCount]: 0 });

        if (isEmpty(this.state.email)) {
            this.toast.Show(R.strings.enterEmail);
            return
        }
        if (CheckEmailValidation(this.state.email)) {
            this.toast.Show(R.strings.Enter_Valid_Email);
            return
        }

        else {

            changeFocus(this.mainInputTexts);

            // for check internet condition
            if (await isInternet()) {

                try {
                    //Bind Request For Normal SignUp
                    let forgotPasswordRequest = {
                        email: this.state.email,
                        deviceId: await getDeviceID(),
                        mode: ServiceUtilConstant.Mode,
                        hostName: ServiceUtilConstant.hostName
                    }
                    //Note : ipAddress parameter is passed in its saga.

                    //Call Login API
                    this.props.forgotPassword(forgotPasswordRequest)
                } catch (error) {
                    this.progressDialog.dismiss();
                    showAlert(R.strings.status, R.strings.SLOW_INTERNET, 3);
                }
            }
        }
    }

    render() {

        // Loading status for Progress bar which is fetching from reducer
        const { ForgotPasswordisFetching } = this.props;

        return (
            <View style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar translucent />

                {/* Progress Dialog */}
                <ProgressDialog ref={component => this.progressDialog = component} isShow={ForgotPasswordisFetching} translucent={true} />

                {/* For Toast */}
                <CommonToast ref={comp => this.toast = comp} />

                <InputScrollView keyboardShouldPersistTaps='always' showsVerticalScrollIndicator={false} >

                    {/* for Background Image Header */}
                    <BackgroundImageHeaderWidget />

                    <View style={this.styles().input_container}>
                        {/* To Set UserName in EditText */}
                        <EditText
                            ref={input => { this.mainInputTexts['etEmail'] = input; }}
                            reference={input => { this.inputs['etEmail'] = input; }}
                            placeholder={R.strings.email}
                            multiline={false}
                            keyboardType='default'
                            returnKeyType={"next"}
                            onChangeText={(text) => this.setState({ email: text })}
                            value={this.state.email}
                            isRound={true}
                            focusable={true}
                            onFocus={() => changeFocus(this.mainInputTexts, 'etEmail')}
                        />

                        <View>
                            {/* Forgot password Button*/}
                            <Button
                                isRound={true}
                                disabled={this.state.isShowTimer}
                                title={R.strings.ForgotpasswordTitle}
                                onPress={this.onPressSubmit}
                                style={{ marginTop: R.dimens.padding_top_bottom_margin, marginBottom: R.dimens.widgetMargin/* , width: R.screen().width / 2, */ }} />
                        </View>

                        {/* Showing Timer */}
                        {this.state.isShowTimer ?
                            <CountDown style={{ alignItems: 'flex-end' }}
                                until={this.state.until}
                                onFinish={() => {
                                    // To hide timer after 200 milliseconds because clearInterval code is under CountDown class
                                    setTimeout(() => {
                                        this.setState({ isShowTimer: false })
                                    }, 200);
                                }}
                                digitStyle={{ backgroundColor: R.colors.background, }}
                                digitTxtStyle={{ color: R.colors.accent, }}
                                size={R.dimens.mediumText}
                                timeToShow={['M', 'S']}
                                timeLabels={{ m: null, s: null }}
                                separatorStyle={{ color: R.colors.accent }}
                                showSeparator
                            />

                            : null}
                    </View>
                </InputScrollView>
            </View>
        );
    }
    styles = () => {
        return {
            input_container: {
                paddingLeft: R.dimens.activity_margin,
                paddingRight: R.dimens.activity_margin,
                paddingTop: R.dimens.margin_top_bottom,
            },
        }
    }
}

function mapStateToProps(state) {
    return {
        ForgotPasswordFetchData: state.ForgotPasswordReducer.ForgotPasswordFetchData,
        ForgotPassworddata: state.ForgotPasswordReducer.ForgotPassworddata,
        ForgotPasswordisFetching: state.ForgotPasswordReducer.ForgotPasswordisFetching,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        forgotPassword: (payload) => dispatch(forgotPassword(payload)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ForgotPasswordComponent)