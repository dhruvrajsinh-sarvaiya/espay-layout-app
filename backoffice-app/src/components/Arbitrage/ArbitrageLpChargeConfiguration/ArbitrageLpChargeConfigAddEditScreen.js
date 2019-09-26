import {
    View,
    ScrollView,
    Keyboard,
} from 'react-native';
import React from 'react'
import { Component } from 'react';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../../native_theme/components/CustomToolbar'
import EditText from '../../../native_theme/components/EditText'
import Button from '../../../native_theme/components/Button';
import { connect } from 'react-redux';
import { isCurrentScreen } from '../../Navigation';
import { showAlert, changeTheme, parseArray, parseFloatVal } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew, isEmpty, isHtmlTag, isScriptTag } from '../../../validations/CommonValidation';
import CommonToast from '../../../native_theme/components/CommonToast';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import R from '../../../native_theme/R';
import { TitlePicker } from '../../widget/ComboPickerWidget';
import { getArbitrageCurrencyList, getArbitrageProviderList, getWalletTransactionType, getListPairArbitrage } from '../../../actions/PairListAction';
import { FeatureSwitch } from '../../../native_theme/components/FeatureSwitch';
import { clearLpChargeConfigData, addEditDeleteLpChargeConfig } from '../../../actions/Arbitrage/ArbitrageLpChargeConfigActions';
import SafeView from '../../../native_theme/components/SafeView';
import TextCard from '../../../native_theme/components/TextCard';

//Create Common class for Add Edit ArbitrageLpChargeConfig 
class ArbitrageLpChargeConfigAddEditScreen extends Component {

    constructor(props) {
        super(props);

        this.inputs = {};

        // create reference
        this.toast = React.createRef();

        //item for edit from List screen 
        let item = props.navigation.state.params && props.navigation.state.params.item

        //Define All State initial state
        this.state = {
            edit: item ? true : false,
            item: item,

            providers: [{ value: R.strings.selectProvider }],
            selectedProvider: item ? item.ProviderName : R.strings.selectProvider,
            selectedProviderCode: item ? item.SerProID : -1,

            currencies: [{ value: R.strings.selectCurrency }],
            selectedCurrency: item ? item.WalletTypeName : R.strings.selectCurrency,
            selectedCurrencyCode: item ? item.WalletTypeID : -1,

            transactionTypes: [{ value: R.strings.selectTransactionType }],
            selectedTransactionType: item ? item.TrnTypeName : R.strings.selectTransactionType,
            selectedTransactionTypeCode: item ? item.TrnType : -1,

            pairs: [{ value: R.strings.Please_Select }],
            selectedPair: item ? item.PairName : R.strings.Please_Select,
            selectedPairCode: item ? item.PairID : -1,

            remarks: item ? item.Remarks : '',

            KYCComplaint: item ? (item.KYCComplaint == 1 ? true : false) : false,
            Status: item ? (item.Status == 1 ? true : false) : false,

            arbitrageProviderDataState: null,
            arbitrageCurrencyDataState: null,
            walletTransactionTypeState: null,
            arbitragePairListDataState: null,
            isFirstTime: true,
        };
    }

    async componentDidMount() {

        //Add this method to change theme based on stored theme name.
        changeTheme();

        //if edit is false than only api call 
        if (!this.state.edit) {
            // Check internet is Available or not
            if (await isInternet()) {
                //To getArbitrageCurrencyList 
                this.props.getArbitrageCurrencyList()
                //To getArbitrageProviderList
                this.props.getArbitrageProviderList()
                //call getWalletTransactionType api
                this.props.getWalletTransactionType();
                //call getListPairArbitrage api
                this.props.getListPairArbitrage();
            }
        }
    }

    static oldProps = {};

    //handle reponse 
    static getDerivedStateFromProps(props, state) {

        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return {
                ...state,
                isFirstTime: false,
            };
        }

        // To Skip Render if old and new props are equal
        if (ArbitrageLpChargeConfigAddEditScreen.oldProps !== props) {
            ArbitrageLpChargeConfigAddEditScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            const { arbitrageCurrencyData, arbitrageProviderData,
                walletTransactionType, arbitragePairListData } = props.Listdata;

            if (arbitrageCurrencyData) {
                try {
                    //if local currencyList state is null or its not null and also different then new response then and only then validate response.
                    if (state.arbitrageCurrencyDataState == null || (state.arbitrageCurrencyDataState != null && arbitrageCurrencyData !== state.arbitrageCurrencyDataState)) {

                        //if currencyList response is success then store array list else store empty list
                        if (validateResponseNew({
                            isList: true,
                            response: arbitrageCurrencyData,
                        })) {
                            let res = parseArray(arbitrageCurrencyData.ArbitrageWalletTypeMasters);

                            //for add pairCurrencyList
                            for (var keyPairList in res) {
                                let item = res[keyPairList];
                                item.value = item.CoinName;
                            }

                            let currencies = [
                                { value: R.strings.selectCurrency },
                                ...res
                            ];

                            return {
                                ...state, arbitrageCurrencyDataState: arbitrageCurrencyData,
                                currencies
                            };
                        } else {
                            return { ...state, currencies: [{ value: R.strings.selectCurrency }], arbitrageCurrencyDataState: arbitrageCurrencyData };
                        }
                    }
                } catch (e) {
                    return { ...state, currencies: [{ value: R.strings.selectCurrency }] };
                }
            }

            if (arbitrageProviderData) {
                try {
                    //if local arbitrageProviderData state is null or its not null and also different then new response then and only then validate response.
                    if (state.arbitrageProviderDataState == null || (state.arbitrageProviderDataState != null && arbitrageProviderData !== state.arbitrageProviderDataState)) {

                        //if currencyList response is success then store array list else store empty list
                        if (validateResponseNew({
                            response: arbitrageProviderData,
                            isList: true
                        })) {
                            let res = parseArray(arbitrageProviderData.Response);

                            //for add Provider
                            for (var keyProvider in res) {
                                let item = res[keyProvider]; item.value = item.ProviderName;
                            }

                            let providers = [
                                { value: R.strings.selectProvider },
                                ...res
                            ];

                            return { ...state, arbitrageProviderDataState: arbitrageProviderData, providers, };
                        } else {
                            return { ...state, providers: [{ value: R.strings.selectProvider }], arbitrageProviderDataState: arbitrageProviderData };
                        }
                    }
                } catch (e) {
                    return { ...state, providers: [{ value: R.strings.selectProvider }] };
                }
            }

            if (walletTransactionType) {
                try {
                    //if local walletTransactionType state is null or its not null and also different then new response then and only then validate response.
                    if (state.walletTransactionTypeState == null || (state.walletTransactionTypeState != null && walletTransactionType !== state.walletTransactionTypeState)) {

                        //if  response is success then store walletTransactionType list else store empty list
                        if (validateResponseNew({ response: walletTransactionType, isList: true })) {
                            let res = parseArray(walletTransactionType.Data);

                            //for add transactionTypes
                            for (var transactionTypesKey in res) {
                                let item = res[transactionTypesKey];
                                item.value = item.TypeName;
                            }

                            let transactionTypes = [
                                { value: R.strings.selectTransactionType },
                                ...res
                            ];

                            return { ...state, walletTransactionTypeState: walletTransactionType, transactionTypes };
                        } else {
                            return { ...state, walletTransactionTypeState: walletTransactionType, transactionTypes: [{ value: R.strings.selectTransactionType }] };
                        }
                    }
                } catch (e) {
                    return { ...state, transactionTypes: [{ value: R.strings.selectTransactionType }] };
                }
            }

            if (arbitragePairListData) {
                try {
                    //if local arbitragePairListData state is null or its not null and also different then new response then and only then validate response.
                    if (state.arbitragePairListDataState == null || (state.arbitragePairListDataState != null && arbitragePairListData !== state.arbitragePairListDataState)) {

                        //if  response is success then store arbitragePairListData list else store empty list
                        if (validateResponseNew({ response: arbitragePairListData, isList: true })) {
                            let res = parseArray(arbitragePairListData.Response);

                            //for add transactionTypes
                            for (var pairKey in res) {
                                let item = res[pairKey];
                                item.value = item.PairName;
                            }

                            let pairs = [
                                { value: R.strings.Please_Select },
                                ...res
                            ];

                            return { ...state, arbitragePairListDataState: arbitragePairListData, pairs };
                        } else {
                            return { ...state, arbitragePairListDataState: arbitragePairListData, pairs: [{ value: R.strings.Please_Select }] };
                        }
                    }
                } catch (e) {
                    return { ...state, pairs: [{ value: R.strings.Please_Select }] };
                }
            }

        }
        return null;
    }

    componentDidUpdate = async (prevProps, prevState) => {

        //Get All Updated field of Particular actions
        const { lpChargeConfigAddEditDeleteData } = this.props.Listdata;

        // check previous props and existing props
        if (lpChargeConfigAddEditDeleteData !== prevProps.Listdata.lpChargeConfigAddEditDeleteData) {
            // for show responce add and update
            if (lpChargeConfigAddEditDeleteData) {
                try {

                    // If reponse is validate than so success dialog
                    if (validateResponseNew({
                        response: lpChargeConfigAddEditDeleteData,
                        isList: true
                    })) {
                        showAlert(R.strings.Success, lpChargeConfigAddEditDeleteData.ReturnMsg, 0, () => {

                            //Clear data
                            this.props.clearLpChargeConfigData()
                            this.props.navigation.state.params.onSuccess() // if add success call list method from back screen
                            this.props.navigation.goBack()
                        });
                    } else {
                        // Show failure response dialog
                        showAlert(R.strings.status, R.strings[`apiWalletErrCode.${lpChargeConfigAddEditDeleteData.ErrorCode}`], 1, () => {
                            //Clear data
                            this.props.clearLpChargeConfigData()
                        })
                    }
                } catch (e) {
                    //Clear data
                    this.props.clearLpChargeConfigData()
                }
            }
        }
    }

    //Add Or Update Button Presss
    onPress = async () => {

        //validations for Inputs 
        if (this.state.selectedProvider === R.strings.selectProvider) {
            this.toast.Show(R.strings.selectProvider)
            return;
        }
        if (this.state.selectedTransactionType === R.strings.selectTransactionType) {
            this.toast.Show(R.strings.selectTransactionType)
            return;
        }
        //selltrade =8 buytrade=3
        if (this.state.selectedTransactionTypeCode == 8 || this.state.selectedTransactionTypeCode == 3) {
            if (this.state.selectedPair === R.strings.Please_Select) {
                this.toast.Show(R.strings.selectCurrency)
                return;
            }
        }
        else {
            if (this.state.selectedCurrency === R.strings.selectCurrency) {
                this.toast.Show(R.strings.selectCurrency)
                return;
            }
        }

        if (isEmpty(this.state.remarks)) {
            this.toast.Show(R.strings.enterRemarks)
            return;
        }
        if (isHtmlTag(this.state.remarks)) {
            this.toast.Show(R.strings.htmlTagNotAllowed + ' ' + R.strings.remarks)
            return;
        }
        if (isScriptTag(this.state.remarks)) {
            this.toast.Show(R.strings.scriptTagNotAllowed + ' ' + R.strings.remarks)
            return;
        }

        Keyboard.dismiss();

        // Check internet is Available or not
        if (await isInternet()) {

            //call addEditDeleteLpChargeConfig api
            this.props.addEditDeleteLpChargeConfig({
                Id: parseFloatVal(this.state.edit ? this.state.item.Id : 0),
                WalletTypeId: parseFloatVal((this.state.selectedTransactionTypeCode == 3 || this.state.selectedTransactionTypeCode == 8) ? 0 : this.state.selectedCurrencyCode),
                PairID: parseFloatVal((this.state.selectedTransactionTypeCode == 3 || this.state.selectedTransactionTypeCode == 8) ? this.state.selectedPairCode : 0),
                SerProID: parseFloatVal(this.state.selectedProviderCode),
                TrnType: parseFloatVal(this.state.selectedTransactionTypeCode),
                KYCComplaint: parseFloatVal(this.state.KYCComplaint == true ? 1 : 0),
                Status: parseFloatVal(this.state.Status == true ? 1 : 0),
                Remarks: this.state.remarks
            })
        }
    }

    render() {

        // Loading status for Progress bar which is fetching from reducer
        const { lpChargeConfigAddEditDeleteFetching, arbitrageCurrencyFetching, arbitrageProviderFetching, isWalletTransactionType, arbitragePairListFetching } = this.props.Listdata;

        return (

            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                {/* To Set Status Bas as per out theme */}
                <CommonStatusBar />

                {/* To Set ToolBar as per out theme */}
                <CustomToolbar
                    title={this.state.edit ? R.strings.updateLPChargeConfiguration : R.strings.addLPChargeConfiguration}
                    isBack={true}
                    nav={this.props.navigation}
                />

                {/* Progress Dialog */}
                <ProgressDialog isShow={lpChargeConfigAddEditDeleteFetching || arbitrageCurrencyFetching || arbitrageProviderFetching || isWalletTransactionType || arbitragePairListFetching} />

                {/* For Toast */}
                <CommonToast ref={component => this.toast = component} />

                {/* Toggle Button For Status Enable/Disable Functionality */}
                <FeatureSwitch
                    isGradient={true}
                    title={R.strings.status}
                    isToggle={this.state.Status}
                    onValueChange={() => { this.setState({ Status: !this.state.Status }) }}
                />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='always'>
                        <View style={{
                            paddingLeft: R.dimens.activity_margin,
                            paddingRight: R.dimens.activity_margin,
                            paddingTop: R.dimens.padding_top_bottom_margin,
                            paddingBottom: R.dimens.padding_top_bottom_margin,
                        }}>

                            {/* Picker for ServiceProvider */}
                            {
                                !this.state.edit ?
                                    <TitlePicker
                                        isRequired={true}
                                        title={R.strings.ServiceProvider}
                                        array={this.state.providers}
                                        selectedValue={this.state.selectedProvider}
                                        onPickerSelect={(item, object) => this.setState({ selectedProvider: item, selectedProviderCode: object.Id })} />
                                    :
                                    <TextCard isRequired={true} title={R.strings.ServiceProvider} value={this.state.selectedProvider} />
                            }

                            {/* Picker for Transaction Type */}
                            {
                                !this.state.edit ?
                                    <TitlePicker
                                        isRequired={true}
                                        style={{ marginTop: R.dimens.margin }}
                                        title={R.strings.TransactionType}
                                        array={this.state.transactionTypes}
                                        selectedValue={this.state.selectedTransactionType}
                                        onPickerSelect={(item, object) => this.setState({ selectedTransactionType: item, selectedTransactionTypeCode: object.TypeId })} />
                                    :
                                    <TextCard isRequired={true} title={R.strings.TransactionType} value={this.state.selectedTransactionType} />
                            }

                            {/*  selltrade =8 buytrade=3  */}
                            {this.state.selectedTransactionTypeCode == 3 || this.state.selectedTransactionTypeCode == 8 ?
                                !this.state.edit ?
                                    <TitlePicker
                                        isRequired={true}
                                        style={{ marginTop: R.dimens.margin }}
                                        title={R.strings.currencyPair}
                                        array={this.state.pairs}
                                        selectedValue={this.state.selectedPair}
                                        onPickerSelect={(item, object) => this.setState({ selectedPair: item, selectedPairCode: object.PairId })} />
                                    :
                                    <TextCard isRequired={true} title={R.strings.currencyPair} value={this.state.selectedPair} />
                                :
                                !this.state.edit ?
                                    <TitlePicker
                                        isRequired={true}
                                        style={{ marginTop: R.dimens.margin }}
                                        title={R.strings.Currency}
                                        array={this.state.currencies}
                                        selectedValue={this.state.selectedCurrency}
                                        onPickerSelect={(item, object) => this.setState({ selectedCurrency: item, selectedCurrencyCode: object.Id })} />
                                    :
                                    <TextCard isRequired={true} title={R.strings.Currency} value={this.state.selectedCurrency} />
                            }


                            {/* EditText for Remarks */}
                            <EditText
                                isRequired={true}
                                header={R.strings.remarks}
                                placeholder={R.strings.remarks}
                                multiline={true}
                                numberOfLines={4}
                                keyboardType='default'
                                returnKeyType={"done"}
                                blurOnSubmit={true}
                                maxLength={300}
                                textAlignVertical={'top'}
                                onChangeText={(Label) => this.setState({ remarks: Label })}
                                value={this.state.remarks}
                            />

                            {/* Toggle for KYCStatus */}
                            <FeatureSwitch
                                style={{ paddingLeft: R.dimens.LineHeight, paddingRight: R.dimens.widgetMargin }}
                                backgroundColor={'transparent'}
                                title={R.strings.kycCompliant}
                                disabled={this.state.edit ? true : false}
                                isToggle={this.state.KYCComplaint}
                                textStyle={{ color: R.colors.textPrimary }}
                                onValueChange={() => {
                                    this.setState({ KYCComplaint: !this.state.KYCComplaint })
                                }}
                            />

                        </View>
                    </ScrollView>
                    <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.WidgetPadding }}>
                        {/* To Set Add or Edit Button */}
                        <Button title={this.state.edit ? R.strings.update : R.strings.Add} onPress={() => this.onPress()}></Button>
                    </View>
                </View>
            </SafeView >
        );
    }
}

function mapStateToProps(state) {
    return {
        //Updated ArbitrageLpChargeConfigReducer  
        Listdata: state.ArbitrageLpChargeConfigReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //for getArbitrageCurrencyList list action 
        getArbitrageCurrencyList: () => dispatch(getArbitrageCurrencyList()),
        //for getArbitrageProviderList list action 
        getArbitrageProviderList: () => dispatch(getArbitrageProviderList()),
        //for addEditDeleteLpChargeConfig list action 
        addEditDeleteLpChargeConfig: (request) => dispatch(addEditDeleteLpChargeConfig(request)),
        //Perform  getWalletTransactionType Api Data 
        getWalletTransactionType: () => dispatch(getWalletTransactionType()),
        //Perform  getListPairArbitrage Api Data 
        getListPairArbitrage: () => dispatch(getListPairArbitrage()),
        //Perform clearLpChargeConfigData Action 
        clearLpChargeConfigData: () => dispatch(clearLpChargeConfigData())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ArbitrageLpChargeConfigAddEditScreen)