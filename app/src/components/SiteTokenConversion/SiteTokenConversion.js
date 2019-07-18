import React, { Component } from 'react';
import {
    View,
    ScrollView,
} from 'react-native';
import Picker from '../../native_theme/components/Picker';
import { getCurrencyList, getWallets } from '../../actions/PairListAction';
import { getSiteTokenCalculation, doSiteTokenConversion } from '../../actions/SiteTokenConversion/SiteTokenConversionAction'
import { getSiteToken } from '../../actions/PairListAction'
import { connect } from 'react-redux';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../native_theme/components/CustomToolbar'
import { isEmpty, isInternet, validateResponseNew, validateValue } from '../../validations/CommonValidation'
import Button from '../../native_theme/components/Button'
import { isCurrentScreen } from '../Navigation';
import EditText from '../../native_theme/components/EditText'
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import { changeTheme, showAlert, parseArray, parseFloatVal } from '../../controllers/CommonUtils';
import CommonToast from '../../native_theme/components/CommonToast';
import R from '../../native_theme/R';
import Separator from '../../native_theme/components/Separator';
import TextViewMR from '../../native_theme/components/TextViewMR';
import TextViewHML from '../../native_theme/components/TextViewHML';
import SafeView from '../../native_theme/components/SafeView';

class SiteTokenConversion extends Component {
    constructor(props) {
        super(props);

        // for focus on next field
        this.inputs = {};

        // create reference
        this.toast = React.createRef();

        //To Bind All Method
        this.RedirectSiteTokenConversionHistory = this.RedirectSiteTokenConversionHistory.bind(this);
        //----------

        // to store localValue to stop calling api if already called with same amount
        this.prevAmountValue = 0;
        this.prevTokenValue = 0;

        //Define All State initial state
        this.state = {
            Amount: '',
            TokenValue: '',
            AvailableBalance: '',
            CurrentRate: '',
            tokenMinLimit: '',
            tokenMaxLimit: '',
            Fees: 0.00000000,
            walletItems: [{ value: R.strings.Please_Select }],
            WalletName: R.strings.Please_Select,
            tokenItems: [{ value: R.strings.Please_Select }],
            TokenName: R.strings.Please_Select,
            WalletList: [],
            SourceCurrencyID: '',
            SiteTokenMasterID: '',
            isFirst: true,
            Qty: '',
            isFirstTime: true,
        }
        //----------
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Call Currency List api call
            this.props.getCurrencyList();

            //Call to get Wallet List
            this.props.getWallets();

            //Call to get All Site Token
            this.props.getSiteToken();
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        return isCurrentScreen(nextProps);
    };

    componentDidUpdate = (prevProps, prevState) => {

        const { SiteTokenConversionFetchData, SiteTokenConversionData } = this.props;

        // compare response with previous response
        if (SiteTokenConversionData !== prevProps.SiteTokenConversionData) {

            //To Check Site Token Conversion Data Fetch or Not
            if (!SiteTokenConversionFetchData) {
                try {
                    if (validateResponseNew({ response: SiteTokenConversionData })) {
                        showAlert(R.strings.Success + '!', R.strings.added_msg, 0);
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
        if (SiteTokenConversion.oldProps !== props) {
            SiteTokenConversion.oldProps = props;
        } else {
            return null;
        }


        // check for current screen
        if (isCurrentScreen(props)) {

            //Get All Updated Feild of Particular actions
            const { CurrencyListFetchData, CurrencyListdata, ListWalletData, ListWalletFetchData,
                GetSiteTokenFetchData, GetSiteTokenData, SiteTokenCalculationFetchData, SiteTokenCalculationData,
            } = props;

            //To Check Currency List Fetch or Not
            if (!CurrencyListFetchData) {
                try {
                    if (validateResponseNew({ response: CurrencyListdata, isList: true })) {

                        let res = parseArray(CurrencyListdata.Response);

                        // store response value for picker
                        res.map((item, index) => {
                            res[index].value = item.SMSCode;
                        })

                        let currencyItem = [
                            ...state.walletItems,
                            ...res
                        ];
                        return {
                            ...state,
                            walletItems: currencyItem
                        }
                    }
                } catch (e) {
                    //Handle Catch and Notify User to Exception.
                }
            }

            //To Check List Wallet Fetch or Not
            if (!ListWalletFetchData) {
                try {
                    if (validateResponseNew({ response: ListWalletData, isList: true })) {
                        let res = parseArray(ListWalletData.Wallets);
                        return {
                            ...state,
                            WalletList: res,
                        }
                    }
                } catch (e) {
                    //Handle Catch and Notify User to Exception.
                }
            }

            //To Check Currency List Fetch or Not
            if (!GetSiteTokenFetchData) {
                try {
                    if (validateResponseNew({ response: GetSiteTokenData, isList: true })) {
                        let tokenRes = parseArray(GetSiteTokenData.Response);

                        // store response value for picker
                        tokenRes.map((item, index) => {
                            tokenRes[index].value = item.CurrencySMSCode;
                        })

                        let tokenItem = [
                            ...state.tokenItems,
                            ...tokenRes
                        ];
                        return {
                            ...state,
                            tokenItems: tokenItem,
                        }
                    }
                } catch (e) {
                    //Handle Catch and Notify User to Exception.
                }
            }


            //To Check Site Token Calculation Data Fetch or Not
            if (!SiteTokenCalculationFetchData) {
                try {
                    if (validateResponseNew({ response: SiteTokenCalculationData })) {
                        let qtyRes = SiteTokenCalculationData.response.ResultQty.toString();

                        //Check Bit Condition For Api Call from Wallet Section Or Token then Display Value in EditText
                        if (state.isFirst) {
                            return {
                                ...state,
                                TokenValue: parseFloatVal(qtyRes).toFixed(8),
                                Qty: qtyRes
                            }
                        } else {
                            return {
                                ...state,
                                Amount: parseFloatVal(qtyRes).toFixed(8),
                                Qty: qtyRes
                            }
                        }
                    }
                } catch (e) {
                    //Handle Catch and Notify User to Exception.
                }
            }
        }
        return null;
    }

    //Redirect User To Convert Token History Screen
    RedirectSiteTokenConversionHistory() {

        //To Redirect User To Convert Token History Screen
        var { navigate } = this.props.navigation;
        navigate('SiteTokenConversionHistory', {});
        //----------
    }

    //On Change Source Currency
    onCurrencyChange = async (index, object) => {

        if (object.ServiceId !== this.state.SourceCurrencyID && this.state.TokenName !== index) {
            let data = {
                WalletName: object.value,
                AvailableBalance: '',
            }

            //Check Currency Selected or Not.If Not Clear Avalible Balance 
            if (object.value != R.strings.Please_Select) {
                // from another picker
                let indexOfWallet = this.state.WalletList.findIndex(el => el.CoinName === object.value);
                let avaBal = indexOfWallet > -1 ? this.state.WalletList[indexOfWallet].Balance : '';

                data = Object.assign({}, data, {
                    AvailableBalance: avaBal,
                    SourceCurrencyID: object.ServiceId,
                });

                // Check Site Token Select or Not.
                if (this.state.TokenName != R.strings.Please_Select) {

                    let callAPI = false;
                    let request = {
                        SourceCurrencyID: parseFloatVal(data.SourceCurrencyID),
                        SiteTokenMasterID: parseFloatVal(this.state.SiteTokenMasterID),
                    };

                    //Check Amount Is Empty Or Not
                    if (!isEmpty(this.state.Amount) && this.state.Amount !== '0') {

                        //Check Amount Is Greter Then Avalible Balance Or Not.
                        if (this.state.Amount > data.AvailableBalance) {
                            this.toast.Show(R.strings.Balance_Validation);
                        } else {
                            callAPI = true;

                            // Bind Request For Perform Site Token Calculation
                            request = Object.assign({}, request, {
                                Qty: isEmpty(this.state.Amount) ? 0 : parseFloatVal(this.state.Amount),
                                ISSiteTokenToCurrency: 0
                            });

                            data = Object.assign({}, data, { isFirst: true });
                        }

                    }
                    //Check Token Value Is Empty Or Not.
                    else if (!isEmpty(this.state.TokenValue) && this.state.TokenValue !== '0') {

                        //Check Token Value Validation For Minimum and Maximum Token Conversion Limit
                        if (this.state.TokenValue <= this.state.tokenMinLimit) {
                            this.toast.Show(R.strings.Min_Token_Validation);
                        }

                        // To check token value is more then or equal to max limit of token
                        else if (this.state.TokenValue >= this.state.tokenMaxLimit) {
                            this.toast.Show(R.strings.Max_Token_Validation);
                        } else {

                            callAPI = true;

                            // Bind Request For Perform Site Token Calculation
                            request = Object.assign({}, request, {
                                Qty: isEmpty(this.state.TokenValue) ? 0 : parseFloatVal(this.state.TokenValue),
                                ISSiteTokenToCurrency: 1
                            });
                            data = Object.assign({}, data, { isFirst: false });
                        }
                    }

                    // check call api bit and internet connection
                    if (callAPI && await isInternet()) {

                        //Call api for site Token Calculation
                        this.props.getSiteTokenCalculation(request);
                    }
                }
            }
            this.setState(data);
        } else {
            this.toast.Show(R.strings.sameCurrencyValidation);
        }
    }

    //On Change Site Tokens
    onTokenChange = async (index, object) => {
        if (object.ID !== this.state.SiteTokenMasterID && this.state.WalletName !== index) {
            let data = {
                TokenName: object.value,
                CurrentRate: '',
            }

            //Check Token Selected or Not
            if (object.value !== R.strings.Please_Select) {
                data = Object.assign({}, data, {
                    CurrentRate: (parseFloatVal(object.Rate).toFixed(8) !== 'NaN' ? parseFloatVal(object.Rate).toFixed(8) : '-') + ' ' + object.BaseCurrencySMSCode,
                    SiteTokenMasterID: object.ID,
                    tokenMinLimit: object.MinLimit,
                    tokenMaxLimit: object.MaxLimit
                })

                // Check Site Token Select or Not.
                if (this.state.WalletName != R.strings.Please_Select) {

                    let callAPI = false;
                    let request = {
                        SourceCurrencyID: parseFloatVal(this.state.SourceCurrencyID),
                        SiteTokenMasterID: parseFloatVal(data.SiteTokenMasterID),
                    };

                    //Check Token Value Is Empty Or Not.
                    if (!isEmpty(this.state.TokenValue) && this.state.TokenValue !== '0') {

                        //Check Token Value Validation For Minimum and Maximum Token Conversion Limit
                        if (this.state.TokenValue <= data.tokenMinLimit) {
                            this.toast.Show(R.strings.Min_Token_Validation);
                        } else if (this.state.TokenValue >= data.tokenMaxLimit) {
                            this.toast.Show(R.strings.Max_Token_Validation);
                        } else {
                            callAPI = true;

                            // Bind Request For Perform Site Token Calculation
                            request = Object.assign({}, request, {
                                Qty: isEmpty(this.state.TokenValue) ? 0 : parseFloatVal(this.state.TokenValue),
                                ISSiteTokenToCurrency: 1
                            })

                            data = Object.assign({}, data, { isFirst: false })
                        }
                    }

                    //Check Amount Is Empty Or Not
                    else if (!isEmpty(this.state.Amount) && this.state.Amount !== '0') {

                        //Check Amount Is Greter Then Avalible Balance Or Not.
                        if (this.state.Amount > this.state.AvailableBalance) {
                            this.toast.Show(R.strings.Balance_Validation);
                        } else {
                            callAPI = true;

                            // Bind Request For Perform Site Token Calculation
                            request = Object.assign({}, request, {
                                Qty: isEmpty(this.state.Amount) ? 0 : parseFloatVal(this.state.Amount),
                                ISSiteTokenToCurrency: 0
                            })

                            data = Object.assign({}, data, { isFirst: true })
                        }
                    }

                    // check call api bit and internet connection
                    if (callAPI && await isInternet()) {

                        //Call api for site Token Calculation
                        this.props.getSiteTokenCalculation(request);
                    }
                }
            }
            this.setState(data);
        } else {
            this.toast.Show(R.strings.sameCurrencyValidation);
        }
    }

    // Handle Blur Event of Amount Editext
    handleBlurAmount = async () => {

        //Check Currency and Site Token Select Or Not.Also Check Amount is blank or not.
        if (this.state.WalletName != R.strings.Please_Select && this.state.TokenName != R.strings.Please_Select) {

            //Check Amount and Token Value is blank or not. 
            if (!isEmpty(this.state.Amount) && this.state.Amount !== '0') {

                // if previous amount and new amount is different than call api
                if (this.prevAmountValue != this.state.Amount) {

                    // store new amount in previous amount
                    this.prevAmountValue = this.state.Amount;

                    // Bind Request For Perform Site Token Calculation
                    const Data = {
                        SourceCurrencyID: parseFloatVal(this.state.SourceCurrencyID),
                        SiteTokenMasterID: parseFloatVal(this.state.SiteTokenMasterID),
                        Qty: isEmpty(this.state.Amount) ? 0 : parseFloatVal(this.state.Amount),
                        ISSiteTokenToCurrency: 0
                    }
                    this.setState({ isFirst: true })

                    //Call api for site Token Calculation
                    this.props.getSiteTokenCalculation(Data);
                }
            }
            //Check Token Value Is Empty Or Not.
            else if (!isEmpty(this.state.TokenValue) && this.state.TokenValue != '0') {

                // if previous token value and new amount is different than call api
                if (this.prevTokenValue != this.state.TokenValue) {

                    // store new token value in previous token value
                    this.prevTokenValue = this.state.TokenValue;

                    // Bind Request For Perform Site Token Calculation
                    const Data = {
                        SourceCurrencyID: parseFloatVal(this.state.SourceCurrencyID),
                        SiteTokenMasterID: parseFloatVal(this.state.SiteTokenMasterID),
                        Qty: isEmpty(this.state.TokenValue) ? 0 : parseFloatVal(this.state.TokenValue),
                        ISSiteTokenToCurrency: 1
                    }

                    this.setState({ isFirst: false })

                    //Call api for site Token Calculation
                    this.props.getSiteTokenCalculation(Data);
                }
            }
        }
    }

    // Handle Blur Event of Token Value Editext
    handleBlurToken = async () => {

        //Check Currency and Site Token Select Or Not.Also Check Token Value is blank or not.
        if (this.state.WalletName != R.strings.Please_Select && this.state.TokenName != R.strings.Please_Select) {

            //Check Token Value Is Empty Or Not.
            if (!isEmpty(this.state.TokenValue) && this.state.TokenValue != '0') {

                // if previous token value and new amount is different than call api
                if (this.prevTokenValue != this.state.TokenValue) {

                    // store new token value in previous token value
                    this.prevTokenValue = this.state.TokenValue;

                    // Bind Request For Perform Site Token Calculation
                    const Data = {
                        SourceCurrencyID: parseFloatVal(this.state.SourceCurrencyID),
                        SiteTokenMasterID: parseFloatVal(this.state.SiteTokenMasterID),
                        Qty: isEmpty(this.state.TokenValue) ? 0 : parseFloatVal(this.state.TokenValue),
                        ISSiteTokenToCurrency: 1
                    }

                    this.setState({ isFirst: false })

                    //Call api for site Token Calculation
                    this.props.getSiteTokenCalculation(Data);
                }
            }
            //Check Amount and Token Value is blank or not.
            else if (!isEmpty(this.state.Amount) && this.state.Amount != '0') {

                // if previous amount and new amount is different than call api
                if (this.prevAmountValue != this.state.Amount) {

                    // store new amount in previous amount
                    this.prevAmountValue = this.state.Amount;

                    // Bind Request For Perform Site Token Calculation
                    const Data = {
                        SourceCurrencyID: parseFloatVal(this.state.SourceCurrencyID),
                        SiteTokenMasterID: parseFloatVal(this.state.SiteTokenMasterID),
                        Qty: isEmpty(this.state.Amount) ? 0 : parseFloatVal(this.state.Amount),
                        ISSiteTokenToCurrency: 0
                    }
                    this.setState({ isFirst: true })

                    //Call api for site Token Calculation
                    this.props.getSiteTokenCalculation(Data);
                }
            }
        }
    }

    //Check All Validation and if validation is proper then call API
    onSubmitButtonPress = async () => {

        //Check Enough Balance is available or not
        if (this.state.Qty > this.state.AvailableBalance) {
            this.toast.Show(R.strings.Balance_Validation);
            return;
        }

        //To check Token Coin is Selected or not from Dropdown
        if (isEmpty(this.state.TokenName) || this.state.TokenName === R.strings.Please_Select) {
            this.toast.Show(R.strings.selectToken);
            return;
        }

        //To check Wallet is Selected or not from Dropdown
        if (isEmpty(this.state.WalletName) || this.state.WalletName === R.strings.Please_Select) {
            this.toast.Show(R.strings.Select_Wallet);
            return;
        }

        //To check Amount and Token Value is available or not
        if (this.state.Qty == "") {
            this.toast.Show(R.strings.amountTokenValidation);
            return;
        }

        // To Check token value is smaller then min limit
        if (this.state.TokenValue < this.state.tokenMinLimit) {
            this.toast.Show(R.strings.formatString(R.strings.convertTokenMinLimit, { Param1: this.state.tokenMinLimit }));
            return;
        }

        // To Check token value is bigger then max limit
        if (this.state.TokenValue > this.state.tokenMaxLimit) {
            this.toast.Show(R.strings.formatString(R.strings.convertTokenMaxLimit, { Param2: this.state.tokenMaxLimit }));
            return;
        } else {

            // Set and API Call If Required Data is available
            if (this.state.WalletName != R.strings.Please_Select && this.state.TokenName != R.strings.Please_Select) {
                const Data = {
                    SourceCurrencyID: parseFloatVal(this.state.SourceCurrencyID),
                    SiteTokenMasterID: parseFloatVal(this.state.SiteTokenMasterID),
                    SourceCurrencyQty: !isEmpty(this.state.Qty) ? parseFloatVal(this.state.Qty) : 0,
                    TrnMode: 21
                }

                // Call site Token conversion                
                this.props.doSiteTokenConversion(Data)
            } else {
                // Display message if required data is not available 
                this.toast.Show(R.strings.Token_Calculation_Validation);
            }
        }
    }
    //-----------

    render() {

        //Get is Fetching value For All APIs to handle Progress bar in All Activity
        const { CurrencyListIsFetching, ListWalletIsFetching, GetSiteTokenIsFetching, SiteTokenCalculationIsFetching, SiteTokenConversionIsFetching } = this.props;
        //----------

        let SourceCurrency = (parseFloatVal(this.state.Amount).toFixed(8) !== 'NaN' ? parseFloatVal(this.state.Amount).toFixed(8) : '-') + (this.state.WalletName === R.strings.Please_Select ? '' : ' ' + this.state.WalletName);

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.ConverToSiteToken}
                    isBack={true}
                    rightIcon={R.images.ic_history}
                    onRightMenuPress={this.RedirectSiteTokenConversionHistory}
                    nav={this.props.navigation}
                />

                {/* For Toast */}
                <CommonToast ref={component => this.toast = component} />

                {/* Progress Dialog */}
                <ProgressDialog isShow={CurrencyListIsFetching || ListWalletIsFetching || GetSiteTokenIsFetching || SiteTokenCalculationIsFetching || SiteTokenConversionIsFetching} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>

                    {/* To Set All View in ScrolView */}
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.padding_top_bottom_margin, paddingTop: R.dimens.padding_top_bottom_margin }}>

                            {/* to set Convert Token View */}
                            <TextViewMR style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, marginLeft: R.dimens.LineHeight }}>{R.strings.ConvertToToken}</TextViewMR>
                            <Separator style={{ marginLeft: R.dimens.LineHeight, marginRight: 0, marginTop: R.dimens.widgetMargin }} />

                            {/* To Set Token Value Edit Text */}
                            <EditText
                                reference={input => { this.inputs['etTokenValue'] = input; }}
                                placeholder={R.strings.TokenValue}
                                multiline={false}
                                keyboardType='numeric'
                                returnKeyType={"done"}
                                onChangeText={(TokenValue) => this.setState({ TokenValue })}
                                value={this.state.TokenValue}
                                validate={true}
                                onBlur={() => this.handleBlurToken()}
                            />

                            {/* Token Selection Form Dropdown */}
                            <Picker
                                title={R.strings.selectToken}
                                searchable={true}
                                withIcon={true}
                                data={this.state.tokenItems}
                                value={this.state.TokenName ? this.state.TokenName : ''}
                                onPickerSelect={(index, object) => {
                                    // if new index and old index are different
                                    if (index !== this.state.TokenName) {
                                        this.onTokenChange(index, object)
                                    }
                                }}
                                displayArrow={'true'}
                                width={'100%'}
                            />

                            <TextViewMR style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, marginTop: R.dimens.widget_top_bottom_margin, marginLeft: R.dimens.LineHeight }}>{R.strings.Select_Wallet}</TextViewMR>
                            <Separator style={{ marginLeft: R.dimens.LineHeight, marginRight: 0, marginTop: R.dimens.widgetMargin }} />

                            {/* To Set Amount Edit Text */}
                            <EditText
                                reference={input => { this.inputs['etAmount'] = input; }}
                                placeholder={R.strings.Amount}
                                multiline={false}
                                keyboardType='numeric'
                                returnKeyType={"done"}
                                onChangeText={(Amount) => this.setState({ Amount })}
                                value={this.state.Amount}
                                validate={true}
                                onBlur={() => this.handleBlurAmount()}
                            />

                            {/* Currency Selection From Dropdown */}
                            <Picker
                                ref='spSelectCoin'
                                title={R.strings.Select_Wallet}
                                searchable={true}
                                withIcon={true}
                                data={this.state.walletItems}
                                value={this.state.WalletName ? this.state.WalletName : ''}
                                onPickerSelect={(index, object) => {
                                    // if new index and old index are different
                                    if (index !== this.state.WalletName) {
                                        this.onCurrencyChange(index, object)
                                    }
                                }}
                                displayArrow={'true'}
                                width={'100%'}
                            />

                            {/* To Display Available Balance of Selected Coin */}
                            {
                                !isEmpty(this.state.AvailableBalance) ?
                                    <View style={{ marginLeft: R.dimens.LineHeight, marginTop: R.dimens.widget_top_bottom_margin, flexDirection: 'row', flex: 1, justifyContent: 'space-between' }}>
                                        <TextViewHML style={{ flex: 1, color: R.colors.textSecondary, fontSize: R.dimens.smallText, }}>{R.strings.Ava_Bal}</TextViewHML>
                                        <TextViewHML style={{ flex: 1, color: R.colors.textPrimary, fontSize: R.dimens.smallText, textAlign: 'right' }}>{this.state.AvailableBalance ? this.state.AvailableBalance : '-'}</TextViewHML>
                                    </View>
                                    : null
                            }

                            {/* to set Details View */}
                            <View style={{ marginLeft: R.dimens.LineHeight, marginTop: R.dimens.widget_top_bottom_margin, }}>
                                <TextViewMR style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, }}>{R.strings.Details}</TextViewMR>
                            </View>
                            <Separator style={{ marginLeft: R.dimens.LineHeight, marginRight: 0, marginTop: R.dimens.widgetMargin }} />

                            <View style={{ marginLeft: R.dimens.LineHeight }}>
                                <View style={{ marginTop: R.dimens.widget_top_bottom_margin, flexDirection: 'row', flex: 1, justifyContent: 'space-between' }}>
                                    <TextViewHML style={{ flex: 1, color: R.colors.textSecondary, fontSize: R.dimens.smallText, }}>{R.strings.currentRate}</TextViewHML>
                                    <TextViewHML style={{ flex: 1, color: R.colors.textPrimary, fontSize: R.dimens.smallText, textAlign: 'right' }}>{!isEmpty(this.state.CurrentRate) ? this.state.CurrentRate : '-'}</TextViewHML>
                                </View>

                                <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between' }}>
                                    <TextViewHML style={{ flex: 1, color: R.colors.textSecondary, fontSize: R.dimens.smallText, }}>{R.strings.Min_Limit_Conversion}</TextViewHML>
                                    <TextViewHML style={{ flex: 1, color: R.colors.textPrimary, fontSize: R.dimens.smallText, textAlign: 'right' }}>{(parseFloatVal(this.state.tokenMinLimit).toFixed(8) !== 'NaN' ? parseFloatVal(this.state.tokenMinLimit).toFixed(8) : '-')} {this.state.TokenName === R.strings.Please_Select ? '-' : this.state.TokenName}</TextViewHML>
                                </View>

                                <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between' }}>
                                    <TextViewHML style={{ flex: 1, color: R.colors.textSecondary, fontSize: R.dimens.smallText, }}>{R.strings.Max_Limit_Conversion}</TextViewHML>
                                    <TextViewHML style={{ flex: 1, color: R.colors.textPrimary, fontSize: R.dimens.smallText, textAlign: 'right' }}>{(parseFloatVal(this.state.tokenMaxLimit).toFixed(8) !== 'NaN' ? parseFloatVal(this.state.tokenMaxLimit).toFixed(8) : '-')} {this.state.TokenName === R.strings.Please_Select ? '-' : this.state.TokenName}</TextViewHML>
                                </View>

                                <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between' }}>
                                    <TextViewHML style={{ flex: 1, color: R.colors.textSecondary, fontSize: R.dimens.smallText }}>{R.strings.Select_Wallet}</TextViewHML>
                                    <TextViewHML style={{ flex: 1, color: R.colors.textPrimary, fontSize: R.dimens.smallText, textAlign: 'right' }}>{!isEmpty(SourceCurrency) ? SourceCurrency : '-'}</TextViewHML>
                                </View>

                                <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between' }}>
                                    <TextViewHML style={{ flex: 1, color: R.colors.textSecondary, fontSize: R.dimens.smallText }}>{R.strings.Fee}</TextViewHML>
                                    <TextViewHML style={{ flex: 1, color: R.colors.textPrimary, fontSize: R.dimens.smallText, textAlign: 'right' }}>{(parseFloatVal(this.state.Fees).toFixed(8) !== 'NaN' ? parseFloatVal(this.state.Fees).toFixed(8) : '-')}</TextViewHML>
                                </View>

                                <TextViewHML style={{ flex: 1, fontSize: R.dimens.smallText, color: R.colors.textPrimary }}>{R.strings.NetTotal} ({R.strings.Receive} {this.state.TokenName === R.strings.Please_Select ? null : this.state.TokenName + ' '}{R.strings.Tokens}) : {validateValue(this.state.TokenValue)} {this.state.TokenName === R.strings.Please_Select ? null : this.state.TokenName}</TextViewHML>
                            </View>

                        </View>
                    </ScrollView>

                    {/* To Set Submit Button */}
                    <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                        <Button title={R.strings.ConvertToToken} onPress={this.onSubmitButtonPress}></Button>
                    </View>
                </View>
            </SafeView>
        );
    }
}

function mapStateToProps(state) {
    return {
        //For Currency List Data
        CurrencyListFetchData: state.SiteTokenConversionReducer.CurrencyListFetchData,
        CurrencyListIsFetching: state.SiteTokenConversionReducer.CurrencyListIsFetching,
        CurrencyListdata: state.SiteTokenConversionReducer.CurrencyListdata,

        //For Wallet List
        ListWalletData: state.SiteTokenConversionReducer.ListWalletData,
        ListWalletFetchData: state.SiteTokenConversionReducer.ListWalletFetchData,
        ListWalletIsFetching: state.SiteTokenConversionReducer.ListWalletIsFetching,

        //For Get All Site Token
        GetSiteTokenFetchData: state.SiteTokenConversionReducer.GetSiteTokenFetchData,
        GetSiteTokenData: state.SiteTokenConversionReducer.GetSiteTokenData,
        GetSiteTokenIsFetching: state.SiteTokenConversionReducer.GetSiteTokenIsFetching,

        //For Get Site Token Calculation
        SiteTokenCalculationFetchData: state.SiteTokenConversionReducer.SiteTokenCalculationFetchData,
        SiteTokenCalculationData: state.SiteTokenConversionReducer.SiteTokenCalculationData,
        SiteTokenCalculationIsFetching: state.SiteTokenConversionReducer.SiteTokenCalculationIsFetching,

        //For Get Site Token Conversion
        SiteTokenConversionFetchData: state.SiteTokenConversionReducer.SiteTokenConversionFetchData,
        SiteTokenConversionData: state.SiteTokenConversionReducer.SiteTokenConversionData,
        SiteTokenConversionIsFetching: state.SiteTokenConversionReducer.SiteTokenConversionIsFetching,
    }

}

function mapDispatchToProps(dispatch) {

    return {
        //Perform Get Currency list Record
        getCurrencyList: () => dispatch(getCurrencyList()),

        //To get Wallets
        getWallets: () => dispatch(getWallets()),

        //To get All Site Tokens 
        getSiteToken: () => dispatch(getSiteToken()),

        //To Perform Site Token Calculation
        getSiteTokenCalculation: (Data) => dispatch(getSiteTokenCalculation(Data)),

        //To Perform Site Token Conversion
        doSiteTokenConversion: (Data) => dispatch(doSiteTokenConversion(Data)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SiteTokenConversion)