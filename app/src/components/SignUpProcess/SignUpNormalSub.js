import React, { Component } from 'react';
import { View, } from 'react-native';
import { normalRegister, removeLoginData } from '../../actions/SignUpProcess/signUpAction'
import { connect } from 'react-redux';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar'
import { isEmpty, isInternet, validateMobileNumber, validatePassword, validateResponseNew } from '../../validations/CommonValidation'
import Button from '../../native_theme/components/Button'
import { isCurrentScreen } from '../Navigation'
import EditText from '../../native_theme/components/EditText'
import { changeTheme, getDeviceID, showAlert, changeFocus, sendEvent, } from '../../controllers/CommonUtils';
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import { ServiceUtilConstant, Events } from '../../controllers/Constants';
import CommonToast from '../../native_theme/components/CommonToast';
import R from '../../native_theme/R';
import BackgroundImageHeaderWidget from '../../native_theme/components/BackgroundImageHeaderWidget';
import InputScrollView from 'react-native-input-scroll-view';
import { getData } from '../../App';

class SignUpNormalSub extends Component {

    constructor(props) {
        super(props);

        //Create reference
        this.progressDialog = React.createRef();
        this.toast = React.createRef();
        this.mainInputTexts = {};
        this.inputs = {};

        //To Bind All Method
        this.focusNextField = this.focusNextField.bind(this);

        //Define All State initial state
        this.state = {
            FirstName: this.props.navigation.state.params ? this.props.navigation.state.params.FirstName : '',
            LastName: this.props.navigation.state.params ? this.props.navigation.state.params.LastName : '',
            MobileNumber: this.props.navigation.state.params ? this.props.navigation.state.params.MobileNumber : '',
            EmailId: this.props.navigation.state.params ? this.props.navigation.state.params.EmailId : '',
            CountryCode: this.props.navigation.state.params ? this.props.navigation.state.params.CountryCode : '',
            userName: '',
            ReferralID: '',
            password: '',
            ConfirmPassword: '',
            isVisiblePassword: false
        }
    }

    componentDidMount = () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();
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

        //Get All Updated Feild of Particular actions
        const { NormalSignUpData, NormalSignUpFetchData } = this.props;

        if (NormalSignUpData !== prevProps.NormalSignUpData) {

            //To Check Normal SignUp Api Data Fetch or Not
            if (!NormalSignUpFetchData) {
                try {
                    //Get Api STCODE and STMSG
                    let statusCode = NormalSignUpData.ReturnCode;
                    let statusMessage = NormalSignUpData.ReturnMsg;

                    var { navigate } = this.props.navigation;
                    if (validateResponseNew({ response: NormalSignUpData, isList: true })) {

                        //if returnCode == 0 then Success Response and Redirect user to login Screen
                        showAlert(R.strings.Success + '!', statusMessage, 0, () => {
                            this.props.removeLoginData();

                            //This will reset to login page
                            sendEvent(Events.SessionLogout, true);
                        })
                    } else {
                        // Verify Email
                        if (statusCode == 1 && NormalSignUpData.ErrorCode == 4036) {
                            navigate('VerifyEmailScreen', { ITEM: this.state });
                        } else {
                            showAlert(R.strings.failure + '!', statusMessage, 1)
                        }
                    }
                } catch (error) {

                }
            }
        }
    }

    //this Method is used to focus on next feild
    focusNextField(id) {
        this.inputs[id].focus();
    }

    //Check All Validation and if validation is proper then call API
    onSignUpButtonPress = async () => {

        //Check userName is Empty or Not
        if (isEmpty(this.state.userName)) {
            this.toast.Show(R.strings.username_validate);
            return;
        }

        //Check password is Empty or Not
        if (isEmpty(this.state.password)) {
            this.toast.Show(R.strings.password_validate);
            return;
        }

        //To Check password length is 10 or not
        if (this.state.password.length < 6) {
            this.toast.Show(R.strings.password_length_validate);
            return;
        }

        //To Check password Validation
        if (!validatePassword(this.state.password)) {
            this.toast.Show(R.strings.Strong_Password_Validation);
            return;
        }

        //Check Confirm password is Empty or Not
        if (isEmpty(this.state.ConfirmPassword)) {
            this.toast.Show(R.strings.confirm_password_validate);
            return;
        }

        //Check password and Confrim password are Same 
        if (this.state.password != this.state.ConfirmPassword) {
            this.toast.Show(R.strings.password_match_validate);
            return;
        }
        else {

            changeFocus(this.mainInputTexts);

            if (getData(ServiceUtilConstant.KEY_DialogCount) > 0) {
                //To reset dialog show count for session expire causing
                //Set dialog show count to 0
                setData({ [ServiceUtilConstant.KEY_DialogCount]: 0 });
            }

            //Check NetWork is Available or not
            if (await isInternet()) {

                try {
                    //Bind Request For Normal SignUp
                    let registerRequest = {
                        Username: this.state.userName,
                        Firstname: this.state.FirstName,
                        Lastname: this.state.LastName,
                        Email: (this.state.EmailId).toLowerCase(),
                        Password: this.state.password,
                        Mobile: this.state.MobileNumber,
                        CountryCode: this.state.CountryCode,
                        PreferedLanguage: R.strings.getLanguage(),
                        DeviceId: await getDeviceID(),
                        Mode: ServiceUtilConstant.Mode,
                        HostName: ServiceUtilConstant.hostName
                        //Note : IPAddress parameter is passed in its saga.
                    }

                    //call Normal SignUp API
                    this.props.normalRegister(registerRequest);
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
        const { NormalSignUpIsFetching } = this.props;


        return (
            <View style={this.styles().container}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar translucent />

                {/* Progress Dialog */}
                <ProgressDialog ref={component => this.progressDialog = component} isShow={NormalSignUpIsFetching} translucent={true} />

                {/* For Toast */}
                <CommonToast ref={component => this.toast = component} />

                {/* To Set All View in ScrolView */}
                <InputScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='always'>

                    <View style={[R.screen().isPortrait ? { height: R.screen().height } : { flex: 1 }]}>

                        {/* Background Image Header */}
                        <BackgroundImageHeaderWidget navigation={this.props.navigation} />

                        <View style={this.styles().input_container}>

                            {/* To Set userName in EditText */}
                            <EditText
                                ref={input => { this.mainInputTexts['etUsername'] = input; }}
                                isRound={true}
                                reference={input => { this.inputs['etUsername'] = input; }}
                                placeholder={R.strings.Username}
                                multiline={false}
                                keyboardType='default'
                                returnKeyType={"next"}
                                onChangeText={(userName) => this.setState({ userName })}
                                onSubmitEditing={() => { this.focusNextField('etPassword') }}
                                value={this.state.userName}
                                focusable={true}
                                onFocus={() => changeFocus(this.mainInputTexts, 'etUsername')}
                            />

                            {/* To Set password in EditText */}
                            <EditText
                                ref={input => { this.mainInputTexts['etPassword'] = input; }}
                                isRound={true}
                                reference={input => { this.inputs['etPassword'] = input; }}
                                placeholder={R.strings.Password}
                                multiline={false}
                                maxLength={30}
                                secureTextEntry={!this.state.isVisiblePassword}
                                rightImage={this.state.isVisiblePassword ? R.images.IC_EYE_FILLED : R.images.IC_EYE_FILLED_DISABLE}
                                onPressRight={() => {
                                    this.setState({ isVisiblePassword: !this.state.isVisiblePassword })
                                }}
                                keyboardType='default'
                                returnKeyType={"next"}
                                onChangeText={(password) => this.setState({ password })}
                                onSubmitEditing={() => { this.focusNextField('etConfirmPassword') }}
                                value={this.state.password}
                                focusable={true}
                                onFocus={() => changeFocus(this.mainInputTexts, 'etPassword')}
                            />

                            {/* To Set Confirm Password in EditText */}
                            <EditText
                                ref={input => { this.mainInputTexts['etConfirmPassword'] = input; }}
                                isRound={true}
                                reference={input => { this.inputs['etConfirmPassword'] = input; }}
                                placeholder={R.strings.Confirm_Password}
                                multiline={false}
                                maxLength={30}
                                secureTextEntry={true}
                                keyboardType='default'
                                returnKeyType={"next"}
                                onSubmitEditing={() => { this.focusNextField('etReferralID') }}
                                onChangeText={(ConfirmPassword) => this.setState({ ConfirmPassword })}
                                value={this.state.ConfirmPassword}
                                focusable={true}
                                onFocus={() => changeFocus(this.mainInputTexts, 'etConfirmPassword')}
                            />

                            {/* To Set ReferalId in EditText */}
                            <EditText
                                ref={input => { this.mainInputTexts['etReferralID'] = input; }}
                                isRound={true}
                                reference={input => { this.inputs['etReferralID'] = input; }}
                                placeholder={referralid}
                                multiline={false}
                                keyboardType='default'
                                returnKeyType={"done"}
                                onChangeText={(ReferralID) => this.setState({ ReferralID })}
                                value={this.state.ReferralID}
                                focusable={true}
                                onFocus={() => changeFocus(this.mainInputTexts, 'etReferralID')}
                            />

                            {/* Button */}
                            <Button
                                isRound={true}
                                title={R.strings.SignUp}
                                onPress={this.onSignUpButtonPress}
                                style={{ marginTop: R.dimens.padding_top_bottom_margin, width: R.screen().width / 2, marginBottom: R.dimens.padding_top_bottom_margin }} />
                        </View>
                    </View>
                </InputScrollView>
            </View>
        );
    }

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
        isPortrait: state.preference.dimensions.isPortrait,
        //Updated Data For Normal SignUp Api Action
        NormalSignUpFetchData: state.SignUpReducer.NormalSignUpFetchData,
        NormalSignUpData: state.SignUpReducer.NormalSignUpData,
        NormalSignUpIsFetching: state.SignUpReducer.NormalSignUpIsFetching,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        // Perform Normal SignUp Action
        normalRegister: (registerRequest) => dispatch(normalRegister(registerRequest)),
        // Perform remove login action
        removeLoginData: () => dispatch(removeLoginData()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUpNormalSub)