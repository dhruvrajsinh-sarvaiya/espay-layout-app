import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    Modal,
    TouchableWithoutFeedback,
} from 'react-native';
import { OnWithdrawRequest, OnGenerateAddress, OnDropdownChange, getWallets, getWalletBalance, getFeeAndLimits, twoFAGoogleAuthentication } from '../../actions/Wallet/WithdrawAction'
import { connect } from 'react-redux';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../native_theme/components/CustomToolbar'
import { isEmpty, isInternet, validateGoogleAuthCode, validateResponseNew, validWithdrawAddress, validCharacter, validateNumeric } from '../../validations/CommonValidation'
import { CheckAmountValidation } from '../../validations/AmountValidation'
import Button from '../../native_theme/components/Button'
import { isCurrentScreen } from '../Navigation';

//For QR Code Scan Functionality
import { CameraKitCameraScreen } from 'react-native-camera-kit';
import Picker from '../../native_theme/components/Picker';
import { changeTheme, showAlert, getPercentage, parseIntVal, parseFloatVal, parseArray } from '../../controllers/CommonUtils';
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import EditText from '../../native_theme/components/EditText';
import CommonToast from '../../native_theme/components/CommonToast';
import { sendEvent } from '../../controllers/CommonUtils';
import { getData } from '../../App';
import { ServiceUtilConstant, Fonts, Events } from '../../controllers/Constants';
import AlertDialog from '../../native_theme/components/AlertDialog';
import R from '../../native_theme/R';
import Separator from '../../native_theme/components/Separator';
import CardView from '../../native_theme/components/CardView';
import ImageViewWidget from '../Widget/ImageViewWidget';
import TextViewMR from '../../native_theme/components/TextViewMR';
import TextViewHML from '../../native_theme/components/TextViewHML';
import SafeView from '../../native_theme/components/SafeView';
import InputScrollView from 'react-native-input-scroll-view';

class WithdrawRequest extends Component {

    constructor(props) {
        super(props);

        this.inputs = {};

        //To Bind All Method
        this.onChange = this.onChange.bind(this);
        this.onWalletChange = this.onWalletChange.bind(this);
        this.onAddressChange = this.onAddressChange.bind(this);
        this.focusNextField = this.focusNextField.bind(this);
        this.OnLimits = this.OnLimits.bind(this);
        this.OnMaxBalance = this.OnMaxBalance.bind(this);
        this.OnQRCodeScan = this.OnQRCodeScan.bind(this);
        this.RedirectWithdrawHistory = this.RedirectWithdrawHistory.bind(this);
        this.onBarCodeRead = this.onBarCodeRead.bind(this);
        this.Redirection = this.Redirection.bind(this);
        //----------

        //Define All State initial state
        this.state = {
            walletItems: [],
            AddressItems: [],
            PrivateAddresses: [],
            labels: [],
            isFirstTime: true,
            data: this.props.navigation.state.params ? this.props.navigation.state.params.Response : [],
            checkWhiteListing: false,
            IsWhiteListing: 0,
            symbol: this.props.navigation.state.params ? this.props.navigation.state.params.CoinItem.SMSCode : '',
            Id: this.props.navigation.state.params ? this.props.navigation.state.params.CoinItem.ServiceId : '',
            accWalletID: '',
            CoinName: R.strings.Please_Select,
            Address: '',

            //For Wallet All Balance
            AvailableBalance: '',
            Limit: 0.00000000,
            visibleLimit: false,

            //For Fee and Limit
            MinAmount: '',
            MaxAmount: '',
            ChargeType: 0,
            ChargeValue: '',
            receivedAmount: '',
            label: '',
            Alert_Visibility1: false,
            Amount: '',
            isVisible: false,
            authCode: '',
            count: true,
        }
        //----------
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();
        //Check NetWork is Available or not
        if (await isInternet()) {
            let walletsRequest = {
                Coin: this.state.symbol
            }
            //To Get Wallets of Selected Currency
            this.props.getWallets(walletsRequest)

            let feeLimitRequest = {
                TrnType: 9,
                CoinName: this.state.symbol
            }
            //To Get Selected Currency Fee and Limits
            this.props.getFeeAndLimits(feeLimitRequest)
        }
    }

    //To Redirect user to Main Screen
    Redirection = async () => {
        //To move to dashboard
        sendEvent(Events.MoveToMainScreen, 0);
        this.props.navigation.navigate('MainScreen')
    }

    //After Barcode Read hide camera and set Address value in EditText
    onBarCodeRead = async (scanResult) => {
        if (scanResult.nativeEvent.codeStringValue != null) {
            this.setState({ Alert_Visibility1: false, Address: scanResult.nativeEvent.codeStringValue })
        }
        return;
    }
    //---------

    OnLimits() {
        this.setState({ visibleLimit: true })
    }

    shouldComponentUpdate = (nextProps, _nextState) => {
        return isCurrentScreen(nextProps);
    };

    componentDidUpdate = async (prevProps, _prevState) => {
        const { WithdrawData, WithdrawFetchData,
            VerifyGoogleAuthFetchData, VerifyGoogleAuthData } = this.props;

        if (VerifyGoogleAuthData !== prevProps.VerifyGoogleAuthData) {
            //To Check 2FA verification Api Data Fetch or Not
            if (!VerifyGoogleAuthFetchData) {
                try {
                    if (validateResponseNew({ response: VerifyGoogleAuthData })) {

                        //if ErrorCode is also 0 and generate token is not called yet then call generateToken method
                        if (VerifyGoogleAuthData.ErrorCode == 0) {
                            if (this.state.count) {
                                this.setState({ count: false });
                                showAlert(
                                    R.strings.Are_you_sure,
                                    R.strings.withdrawMailMsg,
                                    3,
                                    async () => {
                                        this.setState({ count: true });
                                        //Check NetWork is Available or not
                                        if (await isInternet()) {
                                            //Bind Request For withdrawal
                                            let withdrawRequest = {
                                                TrnMode: 21,//Static For App
                                                asset: this.state.symbol,
                                                address: this.state.Address,
                                                DebitWalletID: this.state.accWalletID,
                                                AddressLabel: this.state.label,
                                                WhitelistingBit: this.state.checkWhiteListing == true ? 1 : 0,
                                                Amount: this.state.receivedAmount,
                                                Nonce: new Date().getTime()//DateTime in MiliSecond
                                            }
                                            //call withdrawal API
                                            this.props.WithdrawRequest(withdrawRequest);
                                        }
                                    },
                                    R.strings.cancel,
                                    () => { this.setState({ count: true }) },
                                    R.strings.agree);
                            }
                        }
                        else if (VerifyGoogleAuthData.ErrorCode == 4137) {
                            showAlert(R.strings.Info + '!', VerifyGoogleAuthData.ReturnMsg, 3);
                        }
                    }
                } catch (e) {
                    //Handle Catch and Notify User to Exception.
                    //Alert.alert('Status', e);
                }
            }
        }

        if (WithdrawData !== prevProps.WithdrawData) {
            //To Check Withdraw Data Fetch or Not
            if (!WithdrawFetchData) {

                try {
                    //Get Withdraw Request Api STMSG
                    let Withdrawstmsg = WithdrawData.ReturnMsg;
                    if (validateResponseNew({ response: WithdrawData, isList: true })) {
                        showAlert(R.strings.Success + '!', Withdrawstmsg + '\n' + R.strings.TransactionId + ' : ' + WithdrawData.response.TrnID, 0, () => this.Redirection());
                    }
                    else {
                        if (WithdrawData.response) {
                            showAlert(R.strings.failure + '!', Withdrawstmsg + '\n' + R.strings.TransactionId + ' : ' + WithdrawData.response.TrnID, 1, () => this.Redirection());
                        } else {
                            showAlert(R.strings.failure + '!', Withdrawstmsg, 1);
                        }
                    }
                } catch (e) {
                    //Handle Catch and Notify User to Exception.
                    //Alert.alert('Status', e);
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
        if (WithdrawRequest.oldProps !== props) {
            WithdrawRequest.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //Get All Updated Feild of Particular actions
            const { FeeLimitData, FeeLimitFetchData,
                WalletBalanceFetchData, WalletBalanceData,
                GenerateAddressData, GenerateAddressFetchData,
                WalletListData, WalletListFetchData,
                VerifyGoogleAuthFetchData } = props;

            //To Check Selected Currency Fee and Limit Api Data Fetch Or Not
            if (!FeeLimitFetchData) {
                try {
                    if (validateResponseNew({ response: FeeLimitData })) {
                        return {
                            ...state,
                            MinAmount: FeeLimitData.response.MinAmount,
                            MaxAmount: FeeLimitData.response.MaxAmount,
                            ChargeType: FeeLimitData.response.ChargeType,
                            ChargeValue: FeeLimitData.response.ChargeValue
                        }
                    }
                    else {
                        return {
                            ...state,
                            MinAmount: 0,
                            MaxAmount: 0,
                            ChargeType: 0,
                            ChargeValue: 0,
                        }
                    }
                } catch (e) {
                    return {
                        ...state,
                        MinAmount: 0,
                        MaxAmount: 0,
                        ChargeType: 0,
                        ChargeValue: 0,
                    }
                    //Handle Catch and Notify User to Exception.
                    //Alert.alert('Status', e);
                }
            }

            //To Check Selected Wallet Balance Api Data Fetch Or Not
            if (!WalletBalanceFetchData) {

                try {
                    if (WalletBalanceData.statusCode == 400) {
                        return {
                            ...state,
                            AvailableBalance: '-',
                            Limit: 0.00000000,
                            Amount: '',
                            receivedAmount: 0,
                        }
                    }
                    else if (validateResponseNew({ response: WalletBalanceData.BizResponseObj, statusCode: WalletBalanceData.statusCode, isList: true })) {
                        return {
                            ...state,
                            AvailableBalance: WalletBalanceData.Balance.AvailableBalance,
                            Limit: WalletBalanceData.WithdrawalDailyLimit,
                        }
                    }
                    else {
                        return {
                            ...state,
                            AvailableBalance: '-',
                            Limit: 0.00000000,
                            Amount: 0.00000000,
                            receivedAmount: 0,
                        }
                    }
                } catch (e) {
                    return {
                        ...state,
                        AvailableBalance: '-',
                        Limit: 0.00000000,
                        Amount: '',
                        receivedAmount: 0,
                    }
                    //Handle Catch and Notify User to Exception.
                    //Alert.alert('Status', e);
                }
            }

            //To Check Generate Address Api Data Fetch Or Not
            if (!GenerateAddressFetchData) {

                try {
                    if (validateResponseNew({ response: GenerateAddressData.BizResponse, statusCode: GenerateAddressData.statusCode, isList: true })) {
                        //Store Api Response Field and display in Screen.

                        let privateAddress = [];
                        let labels = [];
                        let AddressItems = [];
                        // Get Beneficiaries from response
                        for (var i = 0; i < GenerateAddressData.Beneficiaries.length; i++) {
                            let item = GenerateAddressData.Beneficiaries[i].Address;
                            AddressItems.push({ 'value': item });
                            privateAddress[i] = GenerateAddressData.Beneficiaries[i].Address;
                            labels[i] = GenerateAddressData.Beneficiaries[i].Name;
                        }
                        return {
                            ...state,
                            label: labels[0],
                            Address: privateAddress[0],
                            AddressItems: AddressItems,
                            PrivateAddresses: privateAddress,
                            labels: labels,
                        }
                    }
                    else {
                        return {
                            ...state,
                            label: '',
                            Address: R.strings.Please_Select,
                            AddressItems: [{ value: R.strings.Please_Select }, { value: R.strings.AddNewAddress }],
                            PrivateAddresses: [],
                            labels: [],
                        }
                    }
                } catch (e) {
                    return {
                        ...state,
                        label: '',
                        Address: R.strings.Please_Select,
                        AddressItems: [{ value: R.strings.Please_Select }, { value: R.strings.AddNewAddress }],
                        PrivateAddresses: [],
                        labels: [],
                    }
                    //Handle Catch and Notify User to Exception.
                    //Alert.alert('Status', e);
                }
            }

            //To Check selected Currency Wallet List Api Data Fetch Or Not
            if (!WalletListFetchData) {
                try {
                    if (validateResponseNew({ response: WalletListData })) {
                        let res = parseArray(WalletListData.Wallets)
                        res.map((item, index) => {
                            res[index].value = item.WalletName;
                        })

                        let walletItem = [
                            { value: R.strings.Please_Select },
                            ...res
                        ];
                        return {
                            ...state,
                            walletItems: walletItem,
                            IsWhiteListing: WalletListData.IsWhitelisting,
                        }
                    }
                    else {
                        return {
                            ...state,
                            walletItems: [{ value: R.strings.Please_Select }],
                            AddressItems: [],
                            IsWhiteListing: '0',
                            AvailableBalance: '-',
                            Limit: 0.00000000,
                        }
                    }
                } catch (e) {
                    return {
                        ...state,
                        walletItems: [{ value: R.strings.Please_Select }],
                        AddressItems: [],
                        IsWhiteListing: '0',
                        AvailableBalance: '-',
                        Limit: 0.00000000,
                    }
                    //Handle Catch and Notify User to Exception.
                    //Alert.alert('Status', e);
                }
            }

            //To Check 2FA verification Api Data Fetch or Not
            if (!VerifyGoogleAuthFetchData) {
                try {
                    return {
                        ...state,
                        authCode: ''
                    }
                } catch (e) {
                    return null;
                    //Handle Catch and Notify User to Exception.
                    //Alert.alert('Status', e);
                }
            }
        }
        return null;
    }

    //on Selection of Currency From Drop Down
    onWalletChange = async (index, object) => {
        try {
            if (index !== R.strings.Please_Select) {
                this.props.OnDropdownChange();
                //Chcek if Item is Select From Select Wallet DropDown
                if (this.refs.spWallet != null) {
                    //Store Update DropDown Item and Perform Wallet Change Action For Update Item
                    if (object.AccWalletID !== this.state.accWalletID) {
                        //Check NetWork is Available or not
                        if (await isInternet()) {
                            let allBalanceRequest = {
                                WalletId: object.AccWalletID
                            }
                            //To Get Wallets Balance of Selected Wallet
                            this.props.getWalletBalance(allBalanceRequest)
                            //Check if IsWhiteListing value from WalletList API is 1 then call Generate Address API else not
                            if (this.state.IsWhiteListing == 1) {
                                //call Generate Address API
                                this.props.GenerateAddress(object.AccWalletID);
                            }
                        }
                        this.setState({ AddressItems: [] });
                    }
                    this.setState({ accWalletID: object.AccWalletID, CoinName: index })
                }
            }
            else {
                this.setState({
                    accWalletID: '',
                    CoinName: index,
                })
            }
        }
        catch (e) {
            //Catch Code here
            this.setState({
                accWalletID: '',
                CoinName: index,
            })
        }
    }

    //on Selection of Addresses From Drop Down
    onAddressChange(index) {

        if (index !== R.strings.AddNewAddress && index !== R.strings.Please_Select) {
            //To set WithdrawCoinData empty
            this.props.OnDropdownChange();
            //---------

            try {
                if (this.refs.spSourceAddress != null) {
                    var i = this.state.PrivateAddresses.indexOf(index);
                    this.setState({ Address: this.state.PrivateAddresses[i], label: this.state.labels[i] })
                }
            }
            catch (e) {
                //Catch Code here
            }
        } else {
            if (index !== R.strings.Please_Select) {
                setTimeout(() => {
                    //if Address Not Available For Currency then Redirect User To Add WhiteListed Address Screen
                    this.props.navigation.navigate('AddreesWhiteListMainScreen');
                }, 500);
            }
        }
    }

    //Set Maximum Value of Selected Coin in EditText
    OnMaxBalance() {
        if (this.state.AvailableBalance === '-') {
            this.setState({ Amount: '' })
        } else {
            this.setState({ Amount: (parseFloatVal(this.state.AvailableBalance).toFixed(8).toString()) !== 'NaN' ? parseFloatVal(this.state.AvailableBalance).toFixed(8).toString() : '' })
        }

        if (this.state.ChargeType == 1) {
            this.setState({ receivedAmount: (parseFloatVal(this.state.AvailableBalance).toFixed(8) - parseIntVal(this.state.ChargeValue)) });
        }
        if (this.state.ChargeType == 2) {
            this.setState({ receivedAmount: (parseFloatVal(this.state.AvailableBalance).toFixed(8) - getPercentage(parseFloatVal(this.state.AvailableBalance).toFixed(8), parseIntVal(this.state.ChargeValue))) });
        }
    }

    //Open Camera To Scan QR Code
    OnQRCodeScan(visible) {
        this.setState({ Alert_Visibility1: visible });
    }

    //Redirect User To Withdraw History Screen
    RedirectWithdrawHistory() {
        //To Redirect User To Withdraw Coin Success Screen
        var { navigate } = this.props.navigation;
        navigate('WithdrawHistory', { data: this.state.data });
        //----------
    }

    //this Method is used to focus on next feild 
    focusNextField(id) {
        this.inputs[id].focus();
    }

    //To Allow only Digits and only one decimal Point in Edit Text
    //Also handle Condition to enter max. 8 digits after decimal point
    onChange(Amount) {
        if (Amount !== '') {
            if (CheckAmountValidation(Amount)) {
                this.setState({ Amount: CheckAmountValidation(Amount) });
                if (this.state.ChargeType == 1) {
                    this.setState({ receivedAmount: (parseFloatVal(CheckAmountValidation(Amount)) - parseIntVal(this.state.ChargeValue)).toFixed(8) });
                }
                if (this.state.ChargeType == 2) {
                    this.setState({ receivedAmount: (parseFloatVal(CheckAmountValidation(Amount)) - getPercentage(parseFloatVal(CheckAmountValidation(Amount)), parseIntVal(this.state.ChargeValue))) });
                }
            }
        } else {
            this.setState({ Amount: '' });
            this.setState({ receivedAmount: 0 });
        }
    }

    // Verify 2FA
    verify2FA = async () => {
        // Check validation
        if (isEmpty(this.state.authCode)) {
            this.refs.ToastIn.Show(R.strings.authentication_code_validate);
            return;
        }
        else if (this.state.authCode.length != 6) {
            this.refs.ToastIn.Show(R.strings.Enter_valid_Code);
            return;
        }
        else {
            this.setState({ isVisible: false })
            //Check NetWork is Available or not
            if (await isInternet()) {
                //Bind VerifyCode API Request
                let verifyCodeRequest = {
                    Code: this.state.authCode,
                }
                //call api for verify 2FA Google Auth
                this.props.twoFAGoogleAuthentication(verifyCodeRequest);
            }
        }
    }

    //Check All Validation and if validation is proper then call API
    onWithdrawButtonPress = async () => {

        //Check Symbol is Empty or Not
        if (isEmpty(this.state.symbol)) {
            this.refs.Toast.Show(R.strings.Select_Coin);
            return;
        }
        //Added Validation For Wallet Selected or not from dropdown
        if (isEmpty(this.state.accWalletID)) {
            this.refs.Toast.Show(R.strings.Select_Wallet)
            return;
        }
        if (this.state.IsWhiteListing == 1) {
            //Check  Address is selected or Not
            if (isEmpty(this.state.Address) || this.state.Address === R.strings.Please_Select) {
                this.refs.Toast.Show(R.strings.Select_Source_Address);
                return;
            }
            //To check Address is valid or not
            if (validateNumeric(this.state.Address)) {
                this.refs.Toast.Show(R.strings.invalidAddress);
                return;
            }
            //To check Address is valid or not
            if (validCharacter(this.state.Address)) {
                this.refs.Toast.Show(R.strings.invalidAddress);
                return;
            }
            //To check Address is valid or not
            if (!validWithdrawAddress(this.state.Address)) {
                this.refs.Toast.Show(R.strings.invalidAddress);
                return;
            }
        }
        if (this.state.IsWhiteListing == 0) {
            //Check lable is Empty or Not
            if (isEmpty(this.state.label)) {
                this.refs.Toast.Show(R.strings.Enter_Lable);
                return;
            }
            //Check Label Editext Length Exceed or Not
            if (this.state.label.length > 20) {
                this.refs.Toast.Show(R.strings.Label_Excced_Limit);
                return;
            }
            //Check Address is Empty or Not
            if (isEmpty(this.state.Address)) {
                this.refs.Toast.Show(R.strings.Enter_Address);
                return;
            }
            //To check Address is valid or not
            if (validateNumeric(this.state.Address)) {
                this.refs.Toast.Show(R.strings.invalidAddress);
                return;
            }
            //To check Address is valid or not
            if (validCharacter(this.state.Address)) {
                this.refs.Toast.Show(R.strings.invalidAddress);
                return;
            }
            //To check Address is valid or not
            if (!validWithdrawAddress(this.state.Address)) {
                this.refs.Toast.Show(R.strings.invalidAddress);
                return;
            }
        }
        //Check Amount is Empty or Not
        if (isEmpty(this.state.Amount)) {
            this.refs.Toast.Show(R.strings.Enter_Withdraw_Amount);
            return;
        }
        if (parseFloatVal(this.state.receivedAmount) > parseFloatVal(this.state.MaxAmount) && this.state.MaxAmount != 0) {
            this.refs.Toast.Show(R.strings.WDMinWithdraw);
            return;
        }
        if (parseFloatVal(this.state.receivedAmount) < parseFloatVal(this.state.MinAmount) && this.state.MinAmount != 0) {
            this.refs.Toast.Show(R.strings.WDMaxWithdraw);
            return;
        }
        if (parseFloatVal(this.state.receivedAmount) > parseFloatVal(this.state.AvailableBalance)) {
            this.refs.Toast.Show(R.strings.WDLessthenBalance);
            return;
        }
        if (parseFloatVal(this.state.receivedAmount) > parseFloatVal(this.state.Limit) && this.state.Limit != 0) {
            this.refs.Toast.Show(R.strings.WDLessthenLimit);
            return;
        }
        else {
            if (this.state.IsWhiteListing == 0) {

                //if 2FA Functionality is enable then ask user to enter 2FA code for verification else Redirect user to Enable 2FA Functionality
                if (getData(ServiceUtilConstant.KEY_GoogleAuth)) {
                    //To Display verify 2FA popup
                    this.setState({ isVisible: true })
                } else {
                    //Redirect user to Enable 2FA Functionality
                    this.props.navigation.navigate('GoogleAuthenticatorDownloadApp', { screenName: 'WithdrawRequest' })
                }

            } else {
                if (this.state.count) {
                    this.setState({ count: false });
                    showAlert(R.strings.Are_you_sure, R.strings.withdrawMailMsg, 3, async () => {
                        this.setState({ count: true });
                        //Check NetWork is Available or not
                        if (await isInternet()) {
                            //Bind Request For withdrawal
                            let withdrawRequest = {
                                asset: this.state.symbol,
                                address: this.state.Address,
                                DebitWalletID: this.state.accWalletID,
                                TrnMode: 21,//Static For App
                                Amount: this.state.receivedAmount,
                                WhitelistingBit: this.state.checkWhiteListing == true ? 1 : 0,
                                AddressLabel: this.state.label,
                                Nonce: new Date().getTime()//DateTime in MiliSecond
                            }

                            //call Coin withdrawal API
                            this.props.WithdrawRequest(withdrawRequest);
                        }
                    }, R.strings.cancel, () => { this.setState({ count: true }) }, R.strings.agree);
                }
            }
        }
    }

    // Validate google code
    validateGoogleCode = (text) => {
        //Validate Google Auth Code for 6 digits.
        if (validateGoogleAuthCode(text)) {
            this.setState({ authCode: text })
        }
    }

    onCoinItemSelection = () => {
        var { navigate } = this.props.navigation;
        navigate('CoinSelectScreen', { isAction: ServiceUtilConstant.From_Withdraw });
        //----------
    }

    render() {

        //Get is Fetching value For All APIs to handle Progress bar in All Activity
        const {
            GenerateAddressIsFetchData,
            loading,
            WalletBalanceIsFetching,
            VerifyGoogleAuthIsFetching,
            FeeLimitIsFetching
        } = this.props;
        //----------

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar title={R.strings.withdrawal} isBack={true} rightIcon={R.images.ic_history} onRightMenuPress={this.RedirectWithdrawHistory} nav={this.props.navigation} />

                {/* Progress Dialog */}
                <ProgressDialog isShow={FeeLimitIsFetching || loading || WalletBalanceIsFetching || GenerateAddressIsFetchData || VerifyGoogleAuthIsFetching} />

                {/* For Toast */}
                <CommonToast ref="Toast" />

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
                            <Text style={{ marginTop: R.dimens.widget_top_bottom_margin, marginBottom: R.dimens.widgetMargin, fontSize: R.dimens.mediumText, color: R.colors.textPrimary, textAlign: 'center', fontFamily: Fonts.MontserratSemiBold }}>{R.strings.PleaseEnter}</Text>
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
                                fontFamily: Fonts.MontserratRegular,
                            }}
                            multiline={false}
                            maxLength={6}
                            keyboardType='numeric'
                            returnKeyType={"done"}
                            secureTextEntry={true}
                            textContentType='password'
                            onChangeText={(text) => this.validateGoogleCode(text)}
                            value={this.state.authCode}
                        />
                    </View>
                </AlertDialog>

                {/* Dialog to display Limit */}
                <AlertDialog
                    visible={this.state.visibleLimit}
                    title={R.strings.Limit}
                    titleStyle={{ justifyContent: 'center', textAlign: 'center' }}
                    negativeButton={{
                        onPress: () => this.setState({ visibleLimit: false })
                    }}
                    positiveButton={{
                        title: R.strings.OK,
                        onPress: () => this.setState({ visibleLimit: false })
                    }}
                    requestClose={() => this.setState({ visibleLimit: false })}>
                    <View style={{
                        paddingLeft: R.dimens.margin,
                        paddingRight: R.dimens.margin
                    }}>
                        <View style={{ justifyContent: 'center', alignItems: 'flex-start' }}>
                            <TextViewHML style={{ marginTop: R.dimens.widgetMargin, fontSize: R.dimens.smallText, color: R.colors.textPrimary, textAlign: 'left' }}>{R.strings.Mini_Withdrawal + " : " + (parseFloatVal(this.state.MinAmount).toFixed(8) !== 'NaN' ? parseFloatVal(this.state.MinAmount).toFixed(8) : '-') + ' ' + this.state.symbol + '\n' + R.strings.Max_Withdrawal + " : " + (parseFloatVal(this.state.MaxAmount).toFixed(8) !== 'NaN' ? parseFloatVal(this.state.MaxAmount).toFixed(8) : '-') + ' ' + this.state.symbol + '\n' + R.strings.Withdraw_Limit_Msg + '\n' + R.strings.Limit + ' : ' + (parseFloatVal(this.state.Limit).toFixed(8) !== 'NaN' ? parseFloatVal(this.state.Limit).toFixed(8) : '-') + ' ' + this.state.symbol}</TextViewHML>
                        </View>
                    </View>
                </AlertDialog>

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    {/* To Set All View in ScrolView */}
                    <InputScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'always'}>
                        <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.padding_top_bottom_margin, paddingTop: R.dimens.padding_top_bottom_margin }}>

                            {/* To Set Coin*/}
                            <CoinBlock
                                currency={this.state.symbol}
                                onCoinItemSelection={() => this.onCoinItemSelection()}>
                            </CoinBlock>

                            {/* To Set selected coin Wallet in Dropdown */}
                            <TextViewMR style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, marginTop: R.dimens.widget_top_bottom_margin }}>{R.strings.Select_Wallet}</TextViewMR>
                            <Picker
                                searchable={true}
                                data={this.state.walletItems}
                                cardStyle={{ marginLeft: 0, marginRight: 0, }}
                                ref='spWallet'
                                width={'100%'}
                                title={R.strings.Select_Wallet}
                                onPickerSelect={(index, object) => this.onWalletChange(index, object)}
                                displayArrow={'true'}
                                value={this.state.CoinName ? this.state.CoinName : ''} />

                            <CardView style={{ marginTop: R.dimens.padding_top_bottom_margin, flex: 1, paddingBottom: R.dimens.margin_top_bottom, paddingTop: R.dimens.margin_top_bottom, paddingLeft: R.dimens.margin, paddingRight: R.dimens.margin }} cardRadius={0}>
                                {this.state.CoinName !== R.strings.Please_Select ?
                                    <View>
                                        {
                                            this.state.IsWhiteListing == 1 ?
                                                <View>
                                                    {/* To Set Generate Address in Dropdown */}
                                                    <TextViewMR style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, marginLeft: R.dimens.LineHeight }}>{R.strings.Address}</TextViewMR>
                                                    <Picker
                                                        cardStyle={{
                                                            borderColor: R.colors.textSecondary,
                                                            borderWidth: R.dimens.pickerBorderWidth,
                                                            elevation: 0,
                                                            borderRadius: 0,
                                                        }}
                                                        ref='spSourceAddress'
                                                        data={this.state.AddressItems}
                                                        value={this.state.Address ? this.state.Address : ''}
                                                        onPickerSelect={(index) => this.onAddressChange(index)}
                                                        displayArrow={'true'}
                                                        width={'100%'}
                                                    //renderItemTextStyle={{ fontSize: R.dimens.smallText, color: R.colors.textSecondary, paddingTop: R.dimens.widgetMargin, paddingBottom: R.dimens.widgetMargin }}
                                                    />
                                                </View>
                                                :
                                                <View>
                                                    <TextViewMR style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, marginLeft: R.dimens.LineHeight }}>{R.strings.Withdraw_Address}</TextViewMR>
                                                    <Separator style={{ marginLeft: R.dimens.LineHeight, marginRight: 0, marginTop: R.dimens.widgetMargin }} />
                                                    {/* To Set Lable in Edit Text */}
                                                    <EditText
                                                        elevation={0}
                                                        reference={input => { this.inputs['etLabel'] = input; }}
                                                        placeholderTextColor={R.colors.textSecondary}
                                                        isSquare={true}
                                                        BorderStyle={{ borderColor: R.colors.textSecondary, borderWidth: R.dimens.pickerBorderWidth, elevation: 0, borderRadius: 0, backgroundColor: 'transparent' }}
                                                        style={{ marginTop: R.dimens.widget_top_bottom_margin }}
                                                        placeholder={R.strings.Label}
                                                        multiline={false}
                                                        maxLength={20}
                                                        keyboardType='default'
                                                        returnKeyType={"next"}
                                                        onSubmitEditing={() => { this.focusNextField('etToAddress') }}
                                                        onChangeText={(label) => this.setState({ label: label })}
                                                        value={this.state.label}
                                                    />

                                                    {/* To Set Address in Edit Text */}
                                                    <EditText
                                                        elevation={0}
                                                        reference={input => { this.inputs['etToAddress'] = input; }}
                                                        isSquare={true}
                                                        BorderStyle={{ borderColor: R.colors.textSecondary, borderWidth: R.dimens.pickerBorderWidth, elevation: 0, borderRadius: 0 }}
                                                        value={this.state.Address}
                                                        placeholder={R.strings.Address}
                                                        placeholderTextColor={R.colors.textSecondary}
                                                        multiline={true}
                                                        numberOfLines={1}
                                                        keyboardType='default'
                                                        returnKeyType={"next"}
                                                        rightImage={R.images.IC_CAMERA}
                                                        onPressRight={() => { this.OnQRCodeScan(true) }}
                                                        onSubmitEditing={() => { this.focusNextField('etAmount') }}
                                                        onChangeText={(Address) => this.setState({ Address })}
                                                    />

                                                    {/* Checkbox For store Whitelist Address */}
                                                    <View style={{ flex: 1, marginTop: R.dimens.widgetMargin }}>
                                                        <TouchableWithoutFeedback
                                                            style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}
                                                            onPress={() => this.setState({ checkWhiteListing: !this.state.checkWhiteListing })}>
                                                            <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
                                                                <Image style={{ width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: this.state.checkWhiteListing ? R.colors.accent : R.colors.textPrimary }}
                                                                    source={this.state.checkWhiteListing ? R.images.FILL_CHECKBOX : R.images.EMPTY_CHECKBOX} />
                                                                <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary, marginLeft: R.dimens.widgetMargin, textAlign: 'center', justifyContent: 'center' }}>{R.strings.WhiteList_Store}</TextViewHML>
                                                            </View>
                                                        </TouchableWithoutFeedback>
                                                    </View>
                                                </View>
                                        }
                                    </View> : null}

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

                                {/* To Set Withdraw Amount Edit Text */}
                                <View style={{ backgroundColor: 'transparent', marginTop: this.state.CoinName !== R.strings.Please_Select ? R.dimens.widget_top_bottom_margin : 0, flexDirection: 'column' }}>

                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <TextViewMR style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary }}>{R.strings.Amount}</TextViewMR>
                                        <TextViewMR style={{ fontSize: R.dimens.smallText, color: R.colors.accent, alignContent: 'flex-end' }}
                                            onPress={this.OnLimits}>{R.strings.Limit}</TextViewMR>
                                    </View>

                                    <Separator style={{ marginLeft: 0, marginRight: 0, marginTop: R.dimens.widgetMargin }} />

                                    {/* To Set Amount in Edit Text */}
                                    <EditText
                                        elevation={0}
                                        isSquare={true}
                                        style={{ marginTop: R.dimens.widget_top_bottom_margin }}
                                        reference={input => { this.inputs['etAmount'] = input; }}
                                        BorderStyle={{ borderColor: R.colors.textSecondary, borderWidth: R.dimens.pickerBorderWidth, elevation: 0, borderRadius: 0 }}
                                        value={this.state.Amount.toString()}
                                        placeholder={R.strings.Min + '. ' + (parseFloatVal(this.state.MinAmount).toFixed(8) !== 'NaN' ? parseFloatVal(this.state.MinAmount).toFixed(8) : '-')}
                                        placeholderTextColor={R.colors.textSecondary}
                                        onChangeText={(Amount) => this.onChange(Amount)}
                                        maxLength={18}
                                        multiline={false}
                                        keyboardType='numeric'
                                        returnKeyType={"done"}
                                        rightText={(this.state.symbol ? this.state.symbol : '-') + ' | ' + R.strings.all}
                                        onPressRight={() => {
                                            //To set Available Amount in EditText
                                            this.setState({ Amount: (this.state.AvailableBalance.toString() !== '-' ? this.state.AvailableBalance.toString() : '0.00000000') })
                                        }}
                                    />
                                </View>

                                {/* To Display Available Balance */}
                                <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, marginTop: R.dimens.widgetMargin, marginLeft: R.dimens.LineHeight }}>{R.strings.Available} : {parseFloatVal(this.state.AvailableBalance).toFixed(8) !== 'NaN' ? parseFloatVal(this.state.AvailableBalance).toFixed(8) : '-'} {this.state.symbol ? this.state.symbol : '-'}</TextViewHML>

                                <View style={{ flexDirection: 'column', justifyContent: 'space-between', marginTop: R.dimens.widgetMargin }}>
                                    {/* Here if ChatgeType = 1 then Fixed Value and if ChatgeType = 2 then Percentage Value Display */}
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: R.dimens.LineHeight }}>
                                        <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary }}>{R.strings.fee}</TextViewHML>
                                        {this.state.ChargeType == 1 ?
                                            <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary, alignContent: 'flex-end' }}>{parseFloatVal(this.state.ChargeValue).toFixed(8) !== 'NaN' ? parseFloatVal(this.state.ChargeValue).toFixed(8) : '0'} {this.state.symbol ? this.state.symbol : '-'}</TextViewHML>
                                            : null}
                                        {this.state.ChargeType == 2 ?
                                            <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary, alignContent: 'flex-end' }}>{this.state.ChargeValue ? this.state.ChargeValue + '%' : '0'} {this.state.symbol ? this.state.symbol : '-'}</TextViewHML>
                                            : null}
                                        {this.state.ChargeType == 0 ?
                                            <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary, alignContent: 'flex-end' }}>-</TextViewHML>
                                            : null}
                                    </View>

                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: R.dimens.LineHeight }}>
                                        <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.accent }}>{R.strings.Total}</TextViewHML>
                                        <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.accent, alignContent: 'flex-end' }}>{(parseFloatVal(this.state.receivedAmount) > 0) ? this.state.receivedAmount : '0'} {this.state.symbol ? this.state.symbol : '-'}</TextViewHML>
                                    </View>
                                    <Separator style={{ marginLeft: R.dimens.LineHeight, marginRight: 0, marginTop: R.dimens.widgetMargin }} />
                                    <View style={{ marginTop: R.dimens.margin_top_bottom }}>
                                        {/* To Set Withdraw Button */}
                                        <Button style={{ alignSelf: 'center', paddingLeft: R.dimens.license_code_activity_margin, paddingRight: R.dimens.license_code_activity_margin }} title={R.strings.Confirm} onPress={this.onWithdrawButtonPress}></Button>
                                    </View>
                                </View>
                            </CardView>
                            {/* Important Message For Withdraw */}
                            <View style={{ flex: 1, marginTop: R.dimens.widget_top_bottom_margin, justifyContent: 'center', alignItems: 'center' }}>
                                <TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, textAlign: 'center' }}>{R.strings.formatString(R.strings.Important_Message_Withdraw, { MinAmount: (parseFloatVal(this.state.MinAmount).toFixed(8) !== 'NaN' ? parseFloatVal(this.state.MinAmount).toFixed(8).toString() : '-'), Coin: this.state.symbol })}</TextViewHML>
                            </View>
                        </View>
                    </InputScrollView>
                </View>
            </SafeView>
        );
    }
}

// Set Selected Coin
class CoinBlock extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        if (this.props.currency === nextProps.currency) {
            return false
        }
        return true
    }

    render() {
        return (
            <CardView style={{ height: R.dimens.ButtonHeight, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} cardRadius={0}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                    <ImageViewWidget url={this.props.currency ? this.props.currency : null} style={{ marginRight: R.dimens.margin }} width={R.dimens.SMALL_MENU_ICON_SIZE} height={R.dimens.SMALL_MENU_ICON_SIZE} />
                    <TextViewMR style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary }}>{this.props.currency ? this.props.currency : ''}</TextViewMR>
                </View>
                <TextViewHML
                    onPress={this.props.onCoinItemSelection}
                    style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, textAlign: 'right' }}>{R.strings.Choose_Coin}</TextViewHML>
            </CardView>
        )
    };
}

function mapStateToProps(state) {
    return {
        //Updated Data For Withdraw Request Action
        WithdrawData: state.WithdrawReducer.WithdrawData,
        WithdrawFetchData: state.WithdrawReducer.WithdrawFetchData,

        //Updated Data For Generate Address Action
        GenerateAddressData: state.WithdrawReducer.GenerateAddressData,
        GenerateAddressFetchData: state.WithdrawReducer.GenerateAddressFetchData,
        GenerateAddressIsFetchData: state.WithdrawReducer.GenerateAddressIsFetchData,

        //For Wallet List
        WalletListData: state.WithdrawReducer.WalletListData,
        WalletListFetchData: state.WithdrawReducer.WalletListFetchData,

        loading: state.WithdrawReducer.loading,

        //For Wallet Balance Data
        WalletBalanceData: state.WithdrawReducer.WalletBalanceData,
        WalletBalanceFetchData: state.WithdrawReducer.WalletBalanceFetchData,
        WalletBalanceIsFetching: state.WithdrawReducer.WalletBalanceIsFetching,

        //For Fee and Limits
        FeeLimitFetchData: state.WithdrawReducer.FeeLimitFetchData,
        FeeLimitData: state.WithdrawReducer.FeeLimitData,
        FeeLimitIsFetching: state.WithdrawReducer.FeeLimitIsFetching,

        // for 2FA Google Auth Verify
        VerifyGoogleAuthData: state.WithdrawReducer.VerifyGoogleAuthData,
        VerifyGoogleAuthFetchData: state.WithdrawReducer.VerifyGoogleAuthFetchData,
        VerifyGoogleAuthIsFetching: state.WithdrawReducer.VerifyGoogleAuthIsFetching,

    }
}

function mapDispatchToProps(dispatch) {

    return {
        OnDropdownChange: () => dispatch(OnDropdownChange()),
        //Perform Withdraw Request Action
        WithdrawRequest: (withdrawRequest) => dispatch(OnWithdrawRequest(withdrawRequest)),
        //Perform Generate Address Data Action
        GenerateAddress: (AccWalletID) => dispatch(OnGenerateAddress(AccWalletID)),
        //Perform Wallet List Action
        getWallets: (walletsRequest) => dispatch(getWallets(walletsRequest)),
        getFeeAndLimits: (feeLimitRequest) => dispatch(getFeeAndLimits(feeLimitRequest)),
        getWalletBalance: (allBalanceRequest) => dispatch(getWalletBalance(allBalanceRequest)),
        //For Verify 2FA
        twoFAGoogleAuthentication: (verifyCodeRequest) => dispatch(twoFAGoogleAuthentication(verifyCodeRequest)),
    }
}

const styles = {
    overlay: {
        justifyContent: 'center',
        position: 'absolute',
        padding: R.dimens.padding_left_right_margin,
        right: 0,
        left: 0,
        alignItems: 'center'
    },
    scanScreenMessage: {
        fontSize: R.dimens.smallText,
        color: R.colors.accent,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
    topOverlay: {
        top: 0,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        flex: 1
    },
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(WithdrawRequest)