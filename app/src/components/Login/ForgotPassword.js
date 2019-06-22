import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import Button from '../../native_theme/components/Button';
import { isEmpty, isInternet, getRemainingSeconds, validateResponseNew } from '../../validations/CommonValidation';
import { forgotPassword } from '../../actions/Login/ForgotPasswordAction'
import { changeTheme, showAlert, getDeviceID, changeFocus } from '../../controllers/CommonUtils'
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import EditText from '../../native_theme/components/EditText'
import CountDown from '../../native_theme/components/CountDownComponent';
import { ServiceUtilConstant, timerScreen } from '../../controllers/Constants'
import { CheckEmailValidation } from '../../validations/EmailValidation'
import { isCurrentScreen } from '../Navigation';
import CommonToast from '../../native_theme/components/CommonToast';
import R from '../../native_theme/R';
import BackgroundImageHeaderWidget from '../../native_theme/components/BackgroundImageHeaderWidget';
import InputScrollView from 'react-native-input-scroll-view';
import { setData } from '../../App';
import moment from 'moment';

class ForgotPasswordComponent extends Component {

    constructor(props) {
        super(props)

        //Create reference
        this.toast = React.createRef();
        this.progressDialog = React.createRef();
        this.mainInputTexts = {};
        this.inputs = {}

        // To bind method with component
        this.turnOffTimer = this.turnOffTimer.bind(this);

        //Define initial state
        this.state = {
            email: null,
            isShowTimer: false,
            until: ServiceUtilConstant.timer_time_seconds,
            isFirstTime: true,
            isForgotSuceessAlert: false,
        }
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
        }
    };

    componentDidUpdate = (prevProps, _prevState) => {
        const { ForgotPassworddata } = this.props;

        //For showing response of forgot password 
        if (ForgotPassworddata !== prevProps.ForgotPassworddata) {
            if (ForgotPassworddata) {
                if (this.state.isForgotSuceessAlert) {
                    const stmsg = ForgotPassworddata.ReturnMsg;
                    //store ending time in redux persist
                    let afterSeconds = moment().add(ServiceUtilConstant.timer_time_seconds, 'seconds').format('HH:mm:ss');
                    setData({
                        timerScreen: timerScreen.forgotPassword,
                        [ServiceUtilConstant.timerEndTime]: afterSeconds
                    });
                    showAlert(R.strings.Success + '!', stmsg, 0, () => this.props.navigation.goBack())
                }
            }
        }
    }

    static oldProps = {};

    static getDerivedStateFromProps(props, state) {

        // To Skip Render if old and new props are equal
        if (ForgotPasswordComponent.oldProps !== props) {
            ForgotPasswordComponent.oldProps = props;
        } else {
            return null;
        }

        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return Object.assign({}, state, { isFirstTime: false })
        }

        if (isCurrentScreen(props)) {
            const { ForgotPasswordFetchData, ForgotPassworddata } = props;

            if (!ForgotPasswordFetchData) {
                try {

                    //Check ForgotPasswordFetchData Api Response 
                    if (validateResponseNew({ response: ForgotPassworddata })) {
                        return Object.assign({}, state, {
                            isShowTimer: true,
                            isForgotSuceessAlert: true
                        })
                    }
                } catch (error) {
                    return Object.assign({}, state, {
                        isShowTimer: false,
                        isForgotSuceessAlert: false,
                    })
                }
            }
        }
        return null
    }

    shouldComponentUpdate = (nextProps, _nextState) => {
        /* stop twice api call  */
        return isCurrentScreen(nextProps)
    };

    onPressSubmit = async () => {

        //Set dialog show count to 0
        setData({ [ServiceUtilConstant.KEY_DialogCount]: 0 });

        //Validations for Input
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
                    showAlert(R.strings.NetworkError, R.strings.SLOW_INTERNET, 5);
                }
            }
        }
    }

    turnOffTimer = () => {
        setTimeout(() => {
            // clear screen name and interval
            setData({
                timerScreen: '',
                [ServiceUtilConstant.timerEndTime]: '00:00:00'
            });
            // To hide timer after 100 milliseconds because clearInterval code is under CountDown class
            this.setState({ isShowTimer: false })
        }, 100);
    }

    render() {

        //Get is Fetching value For All APIs to handle Progress bar in All Activity
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

                    {/* Background Image Header */}
                    <BackgroundImageHeaderWidget navigation={this.props.navigation} />

                    <View style={this.styles().input_container}>

                        {/* To Set UserName in EditText */}
                        <EditText
                            ref={input => { this.mainInputTexts['etEmail'] = input; }}
                            reference={input => { this.inputs['etEmail'] = input; }}
                            placeholder={R.strings.EmailId}
                            maxLength={50}
                            multiline={false}
                            keyboardType='default'
                            returnKeyType={"done"}
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
                                style={{ marginTop: R.dimens.padding_top_bottom_margin, marginBottom: R.dimens.widgetMargin }} />
                        </View>

                        {this.state.isShowTimer ?
                            <CountDown style={{ alignItems: 'flex-end' }}
                                until={this.state.until}
                                onFinish={this.turnOffTimer}
                                onChange={(until) => parseInt(until) == 0 && this.turnOffTimer()}
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

    // style for this class
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
        //Updated Data For Forgot Password Api Action
        ForgotPasswordFetchData: state.ForgotPasswordReducer.ForgotPasswordFetchData,
        ForgotPassworddata: state.ForgotPasswordReducer.ForgotPassworddata,
        ForgotPasswordisFetching: state.ForgotPasswordReducer.ForgotPasswordisFetching,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform forgotPassword action
        forgotPassword: (payload) => dispatch(forgotPassword(payload)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPasswordComponent)