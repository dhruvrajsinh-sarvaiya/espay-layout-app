import React, { Component } from 'react';
import { ScrollView, View, Text, Image } from 'react-native';
import { connect } from 'react-redux';
import { generateApiKey, twoFAGoogleAuthentication, clearApikeyData, } from '../../actions/ApiKey/ApiKeyAction';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import Button from '../../native_theme/components/Button';
import EditText from '../../native_theme/components/EditText';
import { changeTheme } from '../../controllers/CommonUtils';
import CustomToolbar from '../../native_theme/components/CustomToolbar';
import { isEmpty, isInternet, validateResponseNew, validateGoogleAuthCode, } from '../../validations/CommonValidation';
import { isCurrentScreen } from '../../components/Navigation';
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import { showAlert } from '../../controllers/CommonUtils';
import CommonToast from '../../native_theme/components/CommonToast';
import R from '../../native_theme/R';
import ImageButton from '../../native_theme/components/ImageTextButton';
import AlertDialog from '../../native_theme/components/AlertDialog';
import { ServiceUtilConstant, Fonts } from '../../controllers/Constants';
import { getData } from '../../App';
import TextViewHML from '../../native_theme/components/TextViewHML';
import TextViewMR from '../../native_theme/components/TextViewMR';
import SafeView from '../../native_theme/components/SafeView';

class AddApiKeyScreen extends Component {

    constructor(props) {
        super(props)

        //Data from Previous screen
        let item = props.navigation.state.params && props.navigation.state.params.ITEM;

        this.headerText = R.strings.generate_api_key;
        this.buttonText = R.strings.generate_now

        //for focus on next field
        this.inputs = {};

        //Define All initial State
        this.state = {
            aliasName: '',
            apiViewRights: true,
            apiAdminRights: false,
            planName: item == undefined ? '' : item.PlanName,
            planId: item == undefined ? '' : item.PlanID,

            //for2FA
            isVisible: false,
            googleAuthCode: '',
            isFirstTime: true,
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        return isCurrentScreen(nextProps);
    };

    componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();
    }

    componentDidUpdate = async (prevProps, prevState) => {
        let { generateApiKeyData, VerifyGoogleAuthFetchData, VerifyGoogleAuthData } = this.props.appData

        //add Api key Response
        if (generateApiKeyData !== prevProps.generateApiKeyData) {
            if (generateApiKeyData) {
                try {
                    if (validateResponseNew({ response: generateApiKeyData })) {

                        //to clear reducer data
                        this.props.clearApikeyData();
                        //---

                        //refresh previous screen list
                        this.props.navigation.state.params.onSuccessAddEdit()
                        //----

                        this.props.navigation.navigate('AddApiKeySuccessScreen', { item: generateApiKeyData.Response, onSuccessAddEdit: this.props.navigation.state.params.onSuccessAddEdit })
                    } else {
                        //to clear reducer data
                        this.props.clearApikeyData();
                        //---
                    }
                }
                catch (e) {
                    //to clear reducer data
                    this.props.clearApikeyData();
                    //---
                }
            }
        }

        if (VerifyGoogleAuthData !== prevProps.VerifyGoogleAuthData) {
            //To Check 2FA verification Api Data Fetch or Not
            if (!VerifyGoogleAuthFetchData) {
                if (VerifyGoogleAuthData) {
                    try {
                        if (validateResponseNew({ response: VerifyGoogleAuthData })) {

                            //if ErrorCode is also 0 and generate token is not called yet then call generateToken method
                            if (VerifyGoogleAuthData.ErrorCode == 0) {

                                //to clear reducer data
                                this.props.clearApikeyData();
                                //---

                                //Check NetWork is Available or not
                                if (await isInternet()) {
                                    let apiPermission = this.state.apiAdminRights ? 1 : 0
                                    const data = {
                                        PlanID: this.state.planId,
                                        AliasName: this.state.aliasName,
                                        APIAccess: apiPermission,
                                    }
                                    this.props.generateApiKey({ data })
                                }
                            }
                        }
                        else if (VerifyGoogleAuthData.ErrorCode == 4137) {
                            showAlert(R.strings.Info + '!', VerifyGoogleAuthData.ReturnMsg, 3);

                            //to clear reducer data
                            this.props.clearApikeyData();
                            //---
                        } else {
                            //to clear reducer data
                            this.props.clearApikeyData();
                            //---
                        }
                    } catch (e) {
                        //to clear reducer data
                        this.props.clearApikeyData();
                        //---
                    }
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
        if (AddApiKeyScreen.oldProps !== props) {
            AddApiKeyScreen.oldProps = props;
        } else {
            return null;
        }
        
        // check for current screen or not
        if (isCurrentScreen(props)) {

            let { VerifyGoogleAuthFetchData, VerifyGoogleAuthData } = props.appData

            //To Check 2FA verification Api Data Fetch or Not
            if (!VerifyGoogleAuthFetchData) {
                if (VerifyGoogleAuthData) {
                    try {
                        return {
                            ...state,
                            googleAuthCode: ''
                        }
                    } catch (e) {
                        return null;
                    }
                }
            }

        }
        return null;
    }

    onPressSubmit = async () => {
        // Check validation for aliasName and apiViewRights
        if (isEmpty(this.state.aliasName)) {
            this.refs.Toast.Show(R.strings.enter + ' ' + R.strings.alias_name);
        } else if (!this.state.apiViewRights && !this.state.apiAdminRights) {
            this.refs.Toast.Show(R.strings.select + ' ' + R.strings.api_permission);
        } else {
            //if 2FA Functionality is enable then ask user to enter 2FA code for verification else Redirect user to Enable 2FA Functionality
            if (getData(ServiceUtilConstant.KEY_GoogleAuth)) {
                //To Display verify 2FA popup
                this.setState({ isVisible: true })
            } else {
                //Redirect user to Enable 2FA Functionality
                this.props.navigation.navigate('GoogleAuthenticatorDownloadApp', { screenName: 'AddApiKeyScreen' })
            }
        }
    }

    verify2FA = async () => {

        //validations For 2fa
        if (isEmpty(this.state.googleAuthCode)) {
            this.refs.ToastIn.Show(R.strings.authentication_code_validate);
            return;
        }
        else if (this.state.googleAuthCode.length != 6) {
            this.refs.ToastIn.Show(R.strings.Enter_valid_Code);
            return;
        }
        else {
            this.setState({ isVisible: false })
            //Check NetWork is Available or not
            if (await isInternet()) {

                //Bind VerifyCode API Request
                let verifyCodeRequest = {
                    Code: this.state.googleAuthCode,
                }
                //call api for verify 2FA Google Auth
                this.props.twoFAGoogleAuthentication(verifyCodeRequest);
            }
        }
    }

    validateGoogleCode = (text) => {
        //Validate Google Auth Code for 6 digits.
        if (validateGoogleAuthCode(text)) {
            this.setState({ googleAuthCode: text })
        }
    }

    //this Method is used to focus on next feild
    focusNextField(id) {
        this.inputs[id].focus();
    }

    render() {

        let { generateApiKeyLoading, VerifyGoogleAuthIsFetching } = this.props.appData
        return (
            <SafeView style={this.styles().container}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar title={this.headerText} isBack={true} nav={this.props.navigation} />

                {/* To Set ProgressDialog as per out theme */}
                <ProgressDialog isShow={generateApiKeyLoading || VerifyGoogleAuthIsFetching} />

                {/* To Set CommonToast as per out theme */}
                <CommonToast ref="Toast" />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    {/* Dialog to display Verify 2FA */}
                    <AlertDialog
                        visible={this.state.isVisible}
                        title={R.strings.TwoFA_text}
                        titleStyle={{ justifyContent: 'center', textAlign: 'center' }}
                        negativeButton={{
                            title: R.strings.cel,
                            onPress: () => this.setState({ isVisible: !this.state.isVisible })
                        }}
                        positiveButton={{
                            title: R.strings.submit,
                            onPress: () => this.verify2FA(),
                            progressive: false
                        }}
                        requestClose={() => this.setState({ isVisible: !this.state.isVisible })}>
                        <View style={{ padding: R.dimens.margin }}>
                            {/* For Toast */}
                            <CommonToast ref="ToastIn" styles={{ width: '100%' }} />
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Image
                                    style={{ tintColor: R.colors.textPrimary, justifyContent: 'center', alignItems: 'center', height: R.dimens.Verify_Image_Width_Height, width: R.dimens.Verify_Image_Width_Height }}
                                    source={R.images.IC_GOOGLE_AUTH}
                                />
                                <Text style={{ marginTop: R.dimens.widget_top_bottom_margin, marginBottom: R.dimens.widgetMargin, fontSize: R.dimens.mediumText, color: R.colors.textPrimary, fontFamily: Fonts.HindmaduraiSemiBold, textAlign: 'center' }}>{R.strings.PleaseEnter}</Text>
                                <TextViewHML style={{ marginTop: R.dimens.widgetMargin, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, textAlign: 'center' }}>{R.strings.verificationCodeMessage}</TextViewHML>
                            </View>

                            {/* EditText for Google Auth */}
                            <EditText
                                BorderStyle={{
                                    backgroundColor: R.colors.cardBackground,
                                    borderColor: R.colors.accent,
                                    borderWidth: R.dimens.pickerBorderWidth,
                                    marginTop: R.dimens.widgetMargin,
                                    justifyContent: 'center',
                                }}
                                textInputStyle={{
                                    fontSize: R.dimens.smallText,
                                    color: R.colors.textPrimary,
                                }}
                                multiline={false}
                                maxLength={6}
                                keyboardType='numeric'
                                returnKeyType={"done"}
                                secureTextEntry={true}
                                textContentType='password'
                                onChangeText={(text) => this.validateGoogleCode(text)}
                                value={this.state.googleAuthCode}
                            />
                        </View>
                    </AlertDialog>

                    <ScrollView keyboardShouldPersistTaps='always' showsVerticalScrollIndicator={false}>
                        <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.padding_top_bottom_margin, paddingTop: R.dimens.padding_top_bottom_margin }}>
                            <TextViewMR style={{ marginLeft: R.dimens.LineHeight, fontSize: R.dimens.smallText, color: R.colors.textPrimary }}>{R.strings.plan_name} :
                            <TextViewMR style={{ fontSize: R.dimens.smallText, color: R.colors.textSecondary }}> {this.state.planName}</TextViewMR>
                            </TextViewMR>

                            {/* EditText for Alias Name */}
                            <EditText
                                reference={input => { this.inputs['etAliasName'] = input; }}
                                value={this.state.aliasName}
                                header={R.strings.alias_name}
                                placeholder={R.strings.alias_name}
                                multiline={false}
                                keyboardType='default'
                                returnKeyType={"done"}
                                onChangeText={(aliasName) => this.setState({ aliasName })}
                            />
                            <TextViewMR style={{ marginLeft: R.dimens.LineHeight, fontSize: R.dimens.smallText, color: R.colors.textPrimary, marginTop: R.dimens.widget_top_bottom_margin }}>{R.strings.api_permission}</TextViewMR>
                            <ImageButton
                                name={R.strings.view_rights}
                                icon={this.state.apiViewRights ? R.images.IC_RADIO_CHECK : R.images.IC_RADIO_UNCHECK}
                                onPress={() => this.setState({ apiViewRights: true, apiAdminRights: false })}
                                style={{ marginTop: R.dimens.CardViewElivation, marginBottom: 0, marginRight: R.dimens.widget_left_right_margin, flexDirection: 'row-reverse', alignSelf: 'flex-start', }}
                                textStyle={{ color: R.colors.textPrimary, marginLeft: R.dimens.CardViewElivation }}
                                iconStyle={{ tintColor: this.state.apiViewRights ? R.colors.accent : R.colors.textPrimary, width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon }}
                            />
                            <ImageButton
                                name={R.strings.admin_rights}
                                icon={this.state.apiAdminRights ? R.images.IC_RADIO_CHECK : R.images.IC_RADIO_UNCHECK}
                                onPress={() => this.setState({ apiAdminRights: true, apiViewRights: false })}
                                style={{ marginBottom: R.dimens.widget_left_right_margin, marginTop: R.dimens.CardViewElivation, marginRight: R.dimens.widget_left_right_margin, flexDirection: 'row-reverse', alignSelf: 'flex-start', }}
                                textStyle={{ color: R.colors.textPrimary, marginLeft: R.dimens.CardViewElivation }}
                                iconStyle={{ tintColor: this.state.apiAdminRights ? R.colors.accent : R.colors.textPrimary, width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon }}
                            />
                            <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.failRed, marginLeft: R.dimens.LineHeight }}>{R.strings.note_text} : </TextViewHML>
                            <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textSecondary, marginLeft: R.dimens.LineHeight }}>{R.strings.add_apikey_Note}</TextViewHML>
                        </View>
                    </ScrollView>
                    <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                        <Button title={this.buttonText}
                            onPress={this.onPressSubmit} />
                    </View>
                </View >
            </SafeView >
        );
    }

    // styles for this class
    styles = () => {
        return {
            container: {
                flex: 1,
                flexDirection: 'column',
                backgroundColor: R.colors.background
            },
        }
    }
}

function mapStateToProps(state) {
    return {
        //Updated Data For Api Key Action
        appData: state.ApiKeyReducer,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //for generating api key
        generateApiKey: (request) => dispatch(generateApiKey(request)),
        //For Verify 2FA
        twoFAGoogleAuthentication: (verifyCodeRequest) => dispatch(twoFAGoogleAuthentication(verifyCodeRequest)),
        //clear data
        clearApikeyData: () => dispatch(clearApikeyData()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddApiKeyScreen)