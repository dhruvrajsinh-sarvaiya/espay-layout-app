import React, { Component } from 'react';
import {
    View,
    ScrollView,
    TouchableWithoutFeedback,
    Image,
    Modal,
    Text
} from 'react-native';
import { connect } from 'react-redux';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../native_theme/components/CustomToolbar'
import { isInternet, isEmpty, validateGoogleAuthCode, validateResponseNew, validWithdrawAddress, validCharacter, validateNumeric } from '../../validations/CommonValidation'
import Button from '../../native_theme/components/Button'
import { isCurrentScreen } from '../Navigation';
import { onSubmitWhithdrawalAddress, getPreference, setPreference, twoFAGoogleAuthentication } from '../../actions/Wallet/AddressManagementAction'
import Picker from '../../native_theme/components/Picker';
import EditText from '../../native_theme/components/EditText'
import { FeatureSwitch } from '../../native_theme/components/FeatureSwitch';
import { changeTheme, showAlert, sendEvent } from '../../controllers/CommonUtils';
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import CommonToast from '../../native_theme/components/CommonToast';
import { getData } from '../../App';
import { ServiceUtilConstant, Events, Fonts } from '../../controllers/Constants';
import AlertDialog from '../../native_theme/components/AlertDialog';
import R from '../../native_theme/R';

//For QR Code Scan Functionality
import { CameraKitCameraScreen } from 'react-native-camera-kit';
import LinearGradient from 'react-native-linear-gradient';
import { GetBalance } from '../../actions/PairListAction';
import TextViewMR from '../../native_theme/components/TextViewMR';
import TextViewHML from '../../native_theme/components/TextViewHML';
import SafeView from '../../native_theme/components/SafeView';

class AddressWhiteListMainScreen extends Component {
    constructor(props) {
        super(props);

        // create reference
        this.inputs = {};
        this.progressDialog = React.createRef();
        this.toast = React.createRef();
        this.toastIn = React.createRef();

        //To Bind All Method
        this.focusNextField = this.focusNextField.bind(this);
        this.onSubmitButtonPress = this.onSubmitButtonPress.bind(this);
        this.updateWhiteListing = this.updateWhiteListing.bind(this);
        this.Redirection = this.Redirection.bind(this);
        //----------

        //Define All initial State
        this.state = {
            Label: '',
            Address: '',
            whitelistchecked: false,
            isToggle: false,
            symbol: '',
            isVisible: false,
            authCode: '',
            Alert_Visibility1: false,
            currencyItems: [],
        }
        //----------
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Call Get Currency API
            this.props.GetBalance();

            //Call to Get user preferences API
            this.props.getPreference();
        }
    }

    //this Method is used to focus on next feild 
    focusNextField(id) {
        this.inputs[id].focus();
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        return isCurrentScreen(nextProps);
    };

    //To Redirect user to Main Screen
    Redirection = async () => {
        sendEvent(Events.MoveToMainScreen, 0);
        this.props.navigation.navigate('MainScreen')
    }

    componentDidUpdate = async (prevProps, prevState) => {

        //Get All Updated Feild of Particular actions From Reducers
        const { setGlobalPerfFetchData, setGlobalPrefdata,
            AddToWhitelistFetchData, AddToWhitelistdata,
            VerifyGoogleAuthData, VerifyGoogleAuthFetchData } = this.props;

        // compare response with previous response
        if (VerifyGoogleAuthData !== prevProps.VerifyGoogleAuthData) {

            //To Check 2FA verification Api Data Fetch or Not
            if (!VerifyGoogleAuthFetchData) {
                try {
                    if (validateResponseNew({ response: VerifyGoogleAuthData })) {

                        //if ErrorCode is also 0 and generate token is not called yet then call generateToken method
                        if (VerifyGoogleAuthData.ErrorCode == 0) {

                            //Check NetWork is Available or not
                            if (await isInternet()) {

                                //Bind Add WhiteListed Address Request
                                let addBeneRequest = {
                                    CoinName: this.state.symbol,
                                    BeneficiaryAddress: this.state.Address,
                                    BeneficiaryName: this.state.Label,
                                    WhitelistingBit: this.state.whitelistchecked ? 1 : 0
                                }

                                //call Add Address To whitelist Api
                                this.props.onSubmitWhithdrawalAddress(addBeneRequest);
                            }
                        }
                        else if (VerifyGoogleAuthData.ErrorCode == 4137) {
                            showAlert(R.strings.Info + '!', VerifyGoogleAuthData.ReturnMsg, 3);
                        }
                    }
                } catch (e) {
                    //Handle Catch and Notify User to Exception.
                }
            }
        }

        // compare response with previous response
        if (setGlobalPrefdata !== prevProps.setGlobalPrefdata) {

            //To Check set User Preference Api Data Fetch or Not
            if (!setGlobalPerfFetchData) {
                try {
                    if (validateResponseNew({ response: setGlobalPrefdata.BizResponse, statusCode: setGlobalPrefdata.statusCode })) {

                        //Display User Preference Msg
                        showAlert(R.strings.Success + '!', setGlobalPrefdata.BizResponse.ReturnMsg, 0, () => { this.setState({ isToggle: !this.state.isToggle }) });
                    }
                } catch (e) {
                    //Handle Catch and Notify User to Exception.
                }
            }
        }

        // compare response with previous response
        if (AddToWhitelistdata !== prevProps.AddToWhitelistdata) {

            //To Check Add To WhiteList Api Data Fetch or Not
            if (!AddToWhitelistFetchData) {
                try {
                    if (validateResponseNew({ response: AddToWhitelistdata.BizResponse, statusCode: AddToWhitelistdata.statusCode })) {

                        //Display Success Message Of Add Whitelist Address 
                        showAlert(R.strings.Success + '!', AddToWhitelistdata.BizResponse.ReturnMsg, 0, () => this.Redirection());
                    }
                } catch (e) {
                    //Handle Catch and Notify User to Exception.
                }
            }
        }
    };

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
        if (AddressWhiteListMainScreen.oldProps !== props) {
            AddressWhiteListMainScreen.oldProps = props;
        } else {
            return null;
        }

        // check for current screen
        if (isCurrentScreen(props)) {

            //Get All Updated Feild of Particular actions
            const { getGlobalPerfFetchData, getGlobalPrefdata,
                Balancedata, BalanceFetchData, VerifyGoogleAuthFetchData } = props;

            //To Check 2FA verification Api Data Fetch or Not
            if (!VerifyGoogleAuthFetchData) {
                try {
                    return {
                        ...state,
                        authCode: '',
                    }
                } catch (e) {
                    return null;
                    //Handle Catch and Notify User to Exception.
                }
            }

            //To Check Get User Preference Api Data Fetch or Not
            if (!getGlobalPerfFetchData) {
                try {
                    if (validateResponseNew({ response: getGlobalPrefdata.BizResponse, statusCode: getGlobalPrefdata.statusCode, isList: true })) {
                        return {
                            ...state,
                            isToggle: (getGlobalPrefdata.IsWhitelisting == 0) ? false : true
                        }
                    }
                } catch (e) {
                    return null;
                    //Handle Catch and Notify User to Exception.
                }
            }

            //To Check Get Currency Api Data Fetch Or Not
            if (!BalanceFetchData) {
                try {
                    if (validateResponseNew({ response: Balancedata, isList: true })) {

                        //Store Api Response Felid and display in Screen.
                        let symbols = [];
                        let currencyItems = [];

                        // loop for coin picker
                        for (var i = 0; i < Balancedata.Response.length; i++) {
                            if (Balancedata.Response[i].IsWithdraw == 1) {
                                let item = Balancedata.Response[i].SMSCode;
                                symbols.push(item);
                                currencyItems.push({ value: item });
                            }
                        }
                        return {
                            ...state,
                            currencyItems: currencyItems,
                            symbol: symbols[0],
                        }
                    } else {
                        return {
                            ...state,
                            currencyItems: [],
                            symbol: '',
                        }
                    }
                } catch (e) {
                    return {
                        ...state,
                        currencyItems: [],
                        symbol: '',
                    }
                    //Handle Catch and Notify User to Exception.
                }
            }
        }
        return null;
    }

    //Check All Validation and if validation is proper then call API for Add Withdraw address in whitelist
    onSubmitButtonPress = async () => {

        //Check Coin is Selected or Not.
        if (isEmpty(this.state.symbol)) {
            this.toast.Show(R.strings.Select_Coin);
            return;
        }

        //Check Label is Empty or Not
        if (isEmpty(this.state.Label)) {
            this.toast.Show(R.strings.Enter_Label);
            return;
        }

        //Check Label Editext Length Exceed or Not
        if (this.state.Label.length > 20) {
            this.toast.Show(R.strings.Label_Excced_Limit);
            return;
        }

        //Check Address is Empty or Not
        if (isEmpty(this.state.Address)) {
            this.toast.Show(R.strings.Enter_Address);
            return;
        }

        //To check Address is valid or not
        if (validateNumeric(this.state.Address)) {
            this.toast.Show(R.strings.invalidAddress);
            return;
        }

        //To check Address is valid or not
        if (validCharacter(this.state.Address)) {
            this.toast.Show(R.strings.invalidAddress);
            return;
        }

        //To check Address is valid or not
        if (!validWithdrawAddress(this.state.Address)) {
            this.toast.Show(R.strings.invalidAddress);
            return;
        }

        // check whitelist checkbox is checked or not
        if (this.state.whitelistchecked == true) {

            //validation if user want to add address in whitelist then check whitelist functionality is on/off
            if (this.state.isToggle == false) {
                showAlert(R.strings.Info + '!', R.strings.TurnON_Whitelist_Function, 3, () => this.updateWhiteListing(), R.strings.cancel, () => { });
                return;
            }
            else {
                try {
                    //if 2FA Functionality is enable then ask user to enter 2FA code for verification else Redirect user to Enable 2FA Functionality
                    if (getData(ServiceUtilConstant.KEY_GoogleAuth)) {

                        //To Display verify 2FA popup
                        this.setState({ isVisible: true })
                    } else {
                        //Redirect user to Enable 2FA Functionality
                        this.props.navigation.navigate('GoogleAuthenticatorDownloadApp', { screenName: 'AddreesWhiteListMainScreen' })
                    }
                }
                catch (e) {
                    //some logic
                }
            }
        }
        else {
            try {
                //if 2FA Functionality is enable then ask user to enter 2FA code for verification else Redirect user to Enable 2FA Functionality
                if (getData(ServiceUtilConstant.KEY_GoogleAuth)) {

                    //To Display verify 2FA popup
                    this.setState({ isVisible: true })
                } else {

                    //Redirect user to Enable 2FA Functionality
                    this.props.navigation.navigate('GoogleAuthenticatorDownloadApp', { screenName: 'AddreesWhiteListMainScreen' })
                }
            } catch (e) {
                //some logic
            }
        }
    }
    //-----------

    //Update Whitelist Functionality For Address
    updateWhiteListing = async () => {

        //Check NetWork is Available or not
        if (await isInternet()) {
            let setPrefRequest = {
                GlobalBit: this.state.isToggle ? 0 : 1
            }

            //Call to Set user preferences
            this.props.setPreference(setPrefRequest);
        }
    }

    //This Method Call When User Verify 2FA
    verify2FA = async () => {

        //Check Google Auth Code is Empty or Not
        if (isEmpty(this.state.authCode)) {
            this.toastIn.Show(R.strings.authentication_code_validate);
            return;
        }

        //Check Google Auth Code Length is Less then 6 Or Not
        else if (this.state.authCode.length != 6) {
            this.toastIn.Show(R.strings.Enter_valid_Code);
            return;
        }
        else {
            this.setState({ isVisible: false })

            //Check NetWork is Available or not
            if (await isInternet()) {

                try {
                    //Bind VerifyCode API Request
                    let verifyCodeRequest = {
                        Code: this.state.authCode,
                    }

                    //call api for verify 2FA Google Auth
                    this.props.twoFAGoogleAuthentication(verifyCodeRequest);
                } catch (error) {
                    this.progressDialog.dismiss();
                    showAlert(R.strings.NetworkError, R.strings.SLOW_INTERNET, 5);
                }
            }
        }
    }

    //Validate Google Auth Code for 6 digits.
    validateGoogleCode = (text) => {
        if (validateGoogleAuthCode(text)) {
            this.setState({ authCode: text })
        }
    }

    //Open Camera To Scan QR Code
    OnQRCodeScan(visible) {
        this.setState({ Alert_Visibility1: visible });
    }

    //After Barcode Read hide camera and set Address value in EditText
    onBarCodeRead = async (scanResult) => {
        if (scanResult.nativeEvent.codeStringValue != null) {
            this.setState({ Alert_Visibility1: false, Address: scanResult.nativeEvent.codeStringValue })
        }
        return;
    }
    //---------

    render() {

        //Get is Fetching value For All APIs to handle Progress bar in All Activity
        const { formLoading, BalanceDataIsFetching, VerifyGoogleAuthIsFetching } = this.props;
        //----------

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.Add_Withdrawal_Address}
                    isBack={true}
                    nav={this.props.navigation}
                    rightIcon={R.images.ic_history}
                    onRightMenuPress={() => this.props.navigation.navigate('AddressWhitelistHistoryResult')} />

                {/* Progress Dialog */}
                <ProgressDialog ref={component => this.progressDialog = component} isShow={formLoading || BalanceDataIsFetching || VerifyGoogleAuthIsFetching} />

                {/* For Toast */}
                <CommonToast ref={component => this.toast = component} />

                <View style={{ flex: 1, }}>

                    {/* Dialog to display Verify 2FA */}
                    <AlertDialog
                        visible={this.state.isVisible}
                        title={R.strings.TwoFA_text}
                        titleStyle={{ justifyContent: 'center', textAlign: 'center' }}
                        negativeButton={{
                            title: R.strings.cancel,
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
                            <CommonToast ref={component => this.toastIn = component} styles={{ width: '100%' }} />

                            {/* For Google Auth Code Input */}
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Image
                                    style={{ tintColor: R.colors.textPrimary, justifyContent: 'center', alignItems: 'center', height: R.dimens.Verify_Image_Width_Height, width: R.dimens.Verify_Image_Width_Height }}
                                    source={R.images.IC_GOOGLE_AUTH}
                                />
                                <Text style={{ textAlign: 'center', marginTop: R.dimens.widget_top_bottom_margin, marginBottom: R.dimens.widgetMargin, fontSize: R.dimens.mediumText, color: R.colors.textPrimary, fontFamily: Fonts.MontserratSemiBold, }}>{R.strings.PleaseEnter}</Text>
                                <TextViewHML style={{ textAlign: 'center', marginTop: R.dimens.widgetMargin, fontSize: R.dimens.smallestText, color: R.colors.textPrimary }}>{R.strings.verificationCodeMessage}</TextViewHML>
                            </View>

                            {/* For Google auth code Edittext */}
                            <EditText
                                BorderStyle={{
                                    justifyContent: 'center',
                                    backgroundColor: R.colors.cardBackground,
                                    borderColor: R.colors.accent,
                                    marginTop: R.dimens.widgetMargin,
                                    borderWidth: R.dimens.pickerBorderWidth,
                                }}
                                textInputStyle={{
                                    color: R.colors.textPrimary,
                                    fontSize: R.dimens.smallText,
                                }}
                                multiline={false}
                                secureTextEntry={true}
                                returnKeyType={"done"}
                                maxLength={6}
                                keyboardType='numeric'
                                textContentType='password'
                                onChangeText={(text) => this.validateGoogleCode(text)}
                                value={this.state.authCode}
                            />
                        </View>
                    </AlertDialog>

                    {/* Toggle Button For Whitelist On/Off Functionality */}
                    <LinearGradient
                        locations={[0, 1]}
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                        colors={[R.colors.linearStart, R.colors.linearEnd]}>

                        <FeatureSwitch
                            isGradient={true}
                            title={this.state.isToggle ? R.strings.WhiteList_ON : R.strings.WhiteList_OFF}
                            isToggle={this.state.isToggle}
                            onValueChange={() => this.updateWhiteListing()}
                            textStyle={{ color: R.colors.white }}
                        />
                    </LinearGradient>

                    <View style={{ flex: 1, justifyContent: 'space-between' }}>
                        {/* To Set All View in ScrolView */}
                        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='always'>

                            <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.padding_top_bottom_margin }}>

                                {/* To Set Wallet Coin in Dropdown */}
                                <TextViewMR style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, marginTop: R.dimens.margin_top_bottom }}>{R.strings.Select_Coin}</TextViewMR>
                                <Picker
                                    cardStyle={{ marginBottom: 0 }}
                                    ref='spSelectCoin'
                                    title={R.strings.Select_Coin}
                                    searchable={true}
                                    withIcon={true}
                                    data={this.state.currencyItems}
                                    value={this.state.symbol ? this.state.symbol : ''}
                                    onPickerSelect={(index) => { this.setState({ symbol: index }) }}
                                    displayArrow={'true'}
                                    width={'100%'}
                                />

                                {/* To Set Label in Edit Text */}
                                <EditText
                                    header={R.strings.Label}
                                    reference={input => { this.inputs['etLabel'] = input; }}
                                    value={this.state.Label}
                                    placeholder={R.strings.Label}
                                    placeholderTextColor={R.colors.textSecondary}
                                    multiline={false}
                                    maxLength={20}
                                    keyboardType='default'
                                    returnKeyType={"next"}
                                    onChangeText={(Label) => this.setState({ Label })}
                                    onSubmitEditing={() => { this.focusNextField('etAddress') }}
                                />

                                {/* for show Address text and separator */}
                                {/* To Set Address in Edit Text */}
                                <EditText
                                    header={R.strings.Address}
                                    reference={input => { this.inputs['etAddress'] = input; }}
                                    value={this.state.Address}
                                    placeholder={R.strings.Address}
                                    placeholderTextColor={R.colors.textSecondary}
                                    multiline={true}
                                    blurOnSubmit={true}
                                    numberOfLines={1}
                                    maxLength={100}
                                    keyboardType='default'
                                    returnKeyType={"done"}
                                    rightImage={R.images.IC_CAMERA}
                                    onPressRight={() => { this.OnQRCodeScan(true) }}
                                    onChangeText={(Address) => this.setState({ Address })}
                                />

                                {/* For Scan QR Code Functionality */}
                                <Modal
                                    supportedOrientations={['portrait', 'landscape']}
                                    visible={this.state.Alert_Visibility1}
                                    transparent={true}
                                    animationType={"fade"}
                                    onRequestClose={() => { this.setState({ Alert_Visibility1: !this.state.Alert_Visibility1 }) }} >

                                    <View style={styles.container}>
                                        <CameraKitCameraScreen
                                            actions={{ leftButtonText: R.strings.cancel }}
                                            onBottomButtonPressed={() => { this.setState({ Alert_Visibility1: false }) }}
                                            showFrame={true}
                                            scanBarcode={true}
                                            laserColor={R.colors.accent}
                                            frameColor={R.colors.accent}
                                            onReadCode={(event) => { this.onBarCodeRead(event) }}
                                            hideControls={false}
                                        />

                                        <View style={[styles.overlay, styles.topOverlay]}>
                                            <TextViewMR style={styles.scanScreenMessage}>{R.strings.ScanQRCode}</TextViewMR>
                                        </View>
                                    </View>
                                </Modal>

                                {/* Checkbox For Add Address to whitelist */}
                                <View style={{ flex: 1, marginTop: R.dimens.margin, }}>
                                    <TouchableWithoutFeedback
                                        style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}
                                        onPress={() => this.setState({ whitelistchecked: !this.state.whitelistchecked })}>

                                        <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
                                            <Image style={{ width: R.dimens.IconWidthHeight, height: R.dimens.IconWidthHeight, tintColor: this.state.whitelistchecked ? R.colors.accent : R.colors.textPrimary }}
                                                source={this.state.whitelistchecked ? R.images.FILL_CHECKBOX : R.images.EMPTY_CHECKBOX} />
                                            <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, paddingLeft: R.dimens.widgetMargin, textAlign: 'center', }}>{R.strings.Add_WhiteList}</TextViewHML>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                            </View>
                        </ScrollView>

                        {/* To Set Submit Button */}
                        <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                            <Button title={R.strings.submit} onPress={this.onSubmitButtonPress}></Button>
                        </View>
                    </View>
                </View>
            </SafeView>
        );
    }
}

const mapStateToProps = (state) => {
    return {

        //Updated Data For Get Currency Action
        Balancedata: state.AddressManagementReducer.Balancedata,
        BalanceFetchData: state.AddressManagementReducer.BalanceFetchData,
        BalanceDataIsFetching: state.AddressManagementReducer.BalanceDataIsFetching,

        //Updated Data For Add To Whitelist Action
        AddToWhitelistFetchData: state.AddressManagementReducer.AddToWhitelistFetchData,
        formLoading: state.AddressManagementReducer.formLoading,
        AddToWhitelistdata: state.AddressManagementReducer.AddToWhitelistdata,

        //Get user preference
        getGlobalPerfFetchData: state.AddressManagementReducer.getGlobalPerfFetchData,
        getGlobalPrefdata: state.AddressManagementReducer.getGlobalPrefdata,

        //Set user preference
        setGlobalPerfFetchData: state.AddressManagementReducer.setGlobalPerfFetchData,
        setGlobalPrefdata: state.AddressManagementReducer.setGlobalPrefdata,

        //For 2FA
        VerifyGoogleAuthData: state.AddressManagementReducer.VerifyGoogleAuthData,
        VerifyGoogleAuthFetchData: state.AddressManagementReducer.VerifyGoogleAuthFetchData,
        VerifyGoogleAuthIsFetching: state.AddressManagementReducer.VerifyGoogleAuthIsFetching,
    }
};

const mapDispatchToProps = (dispatch) => ({

    //Perform Get Currency Action
    GetBalance: () => dispatch(GetBalance()),

    //Perform Add To Whitelist Address Action
    onSubmitWhithdrawalAddress: (addBeneRequest) => dispatch(onSubmitWhithdrawalAddress(addBeneRequest)),

    //To Get User Preference
    getPreference: () => dispatch(getPreference()),

    //To Get User Preference
    setPreference: (setPrefRequest) => dispatch(setPreference(setPrefRequest)),

    //For Verify 2FA
    twoFAGoogleAuthentication: (verifyCodeRequest) => dispatch(twoFAGoogleAuthentication(verifyCodeRequest)),
});

// Define All Style Of Screen
const styles = {
    container: {
        flex: 1
    },
    overlay: {
        justifyContent: 'center',
        position: 'absolute',
        padding: R.dimens.padding_left_right_margin,
        right: 0,
        left: 0,
        alignItems: 'center'
    },
    topOverlay: {
        top: 0,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    scanScreenMessage: {
        fontSize: R.dimens.smallText,
        color: R.colors.accent,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AddressWhiteListMainScreen)