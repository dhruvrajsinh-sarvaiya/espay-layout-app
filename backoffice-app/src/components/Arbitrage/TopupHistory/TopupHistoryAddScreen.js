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
import { showAlert, changeTheme, parseIntVal, parseArray, parseFloatVal } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew, isEmpty } from '../../../validations/CommonValidation';
import CommonToast from '../../../native_theme/components/CommonToast';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import R from '../../../native_theme/R';
import { TitlePicker } from '../../widget/ComboPickerWidget';
import { clearTopupHistoryData } from '../../../actions/Arbitrage/TopupHistoryActions';
import SafeView from '../../../native_theme/components/SafeView';
import LostGoogleAuthWidget from '../../widget/LostGoogleAuthWidget';
import { getArbitrageCurrencyList, getArbitrageProviderList, getProviderAddressList } from '../../../actions/PairListAction';

//Create Common class for Add Edit TopupHistoryAddScreen
class TopupHistoryAddScreen extends Component {

    constructor(props) {
        super(props);

        //create refrence
        this.toast = React.createRef();

        //Define All State initial state
        this.state = {
            currencies: [{ value: R.strings.selectCurrency }],
            selectedCurrency: R.strings.selectCurrency,
            selectedCurrencyCode: -1,

            fromProviders: [{ value: R.strings.Please_Select }],
            selectedFromProvider: R.strings.Please_Select,
            selectedFromProviderCode: -1,

            toProviders: [{ value: R.strings.Please_Select }],
            selectedToProvider: R.strings.Please_Select,
            selectedToProviderCode: -1,

            addresses: [{ value: R.strings.Please_Select }],
            selectedAddress: R.strings.Please_Select,

            amount: '',

            isFirstTime: true,
            arbitrageProviderDataState: null,
            arbitrageCurrencyDataState: null,
            providerAddressDataState: null,

            askTwoFA: false,

            //topUpRequest 
            topUpRequest: {},
        };
    }

    async componentDidMount() {

        //Add this method to change theme based on stored theme name.
        changeTheme();

        // Check Internet is Available or not
        if (await isInternet()) {
            //To getArbitrageCurrencyList 
            this.props.getArbitrageCurrencyList();
            //To getArbitrageProviderList
            this.props.getArbitrageProviderList();
        }
    }

    componentDidUpdate(prevProps, prevState) {

        //Get All Updated field of Particular actions
        const { addTopupData } = this.props.Listdata;

        // check previous props and existing props
        if (addTopupData !== prevProps.Listdata.addTopupData) {
            // for show responce add
            if (addTopupData) {
                try {
                    // If addTopupData response is validate than show success dialog else failure dialog
                    if (validateResponseNew({
                        response: addTopupData,
                        isList: true
                    })) {
                        showAlert(R.strings.Success, addTopupData.ReturnMsg, 0, () => {
                            this.props.navigation.state.params.onSuccess() // if add success call list method from back screen
                            this.props.navigation.goBack()
                        });
                    } else {
                        // Show failure dialog
                        showAlert(R.strings.status, R.strings[`apiWalletErrCode.${addTopupData.ErrorCode}`], 1, () => {
                        })
                    }

                    //Clear data
                    this.props.clearTopupHistoryData()
                } catch (e) {
                    //Clear data
                    this.props.clearTopupHistoryData()
                }
            }
        }
    }

    //Add Or Update Button Presss
    onPress = async () => {

        //validations for Inputs 
        if (this.state.selectedFromProvider == R.strings.Please_Select) {
            this.toast.Show(R.strings.select + ' ' + R.strings.fromProvider)
            return;
        }
        if (this.state.selectedToProvider == R.strings.Please_Select) {
            this.toast.Show(R.strings.select + ' ' + R.strings.toProvider)
            return;
        }
        if (this.state.selectedCurrency == R.strings.selectCurrency) {
            this.toast.Show(R.strings.selectCurrency)
            return;
        }
        if (this.state.selectedAddress == R.strings.Please_Select) {
            this.toast.Show(R.strings.select + ' ' + R.strings.Address)
            return;
        }
        if (isEmpty(this.state.amount)) {
            this.toast.Show(R.strings.Enter_Amount)
            return;
        }
        if (this.state.selectedFromProvider == this.state.selectedToProvider) {
            this.toast.Show(R.strings.fromProviderandToProviderCantbeSame)
            return;
        }

        Keyboard.dismiss();

        // Check Internet is Available or not
        if (await isInternet()) {

            //open  google auth and api call
            let request = {
                FromServiceProviderId: parseIntVal(this.state.selectedFromProviderCode),
                ToServiceProviderId: parseIntVal(this.state.selectedToProviderCode),
                Address: this.state.selectedAddress,
                Amount: parseFloatVal(this.state.amount),
                SMSCode: this.state.selectedCurrency,
            }

            this.setState({ topUpRequest: request, askTwoFA: true, })
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        // stop twice api call
        return isCurrentScreen(nextProps)
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
        if (TopupHistoryAddScreen.oldProps !== props) {
            TopupHistoryAddScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            const { arbitrageCurrencyData, arbitrageProviderData, providerAddressData } = props.Listdata;

            if (arbitrageCurrencyData) {
                try {
                    //if local currencyList state is null or its not null and also different then new response then and only then validate response.
                    if (state.arbitrageCurrencyDataState == null || (state.arbitrageCurrencyDataState != null && arbitrageCurrencyData !== state.arbitrageCurrencyDataState)) {

                        //if currencyList response is success then store array list else store empty list
                        if (validateResponseNew({ response: arbitrageCurrencyData, isList: true })) {
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

                            return { ...state, currencies, arbitrageCurrencyDataState: arbitrageCurrencyData };
                        }
                        else {
                            return {
                                ...state, currencies: [{ value: R.strings.selectCurrency }],
                                arbitrageCurrencyDataState: arbitrageCurrencyData
                            };
                        }
                    }
                }
                catch (e) {
                    return {
                        ...state,
                        currencies: [{ value: R.strings.selectCurrency }]
                    };
                }
            }

            if (arbitrageProviderData) {
                try {
                    //if local arbitrageProviderData state is null or its not null and also different then new response then and only then validate response.
                    if (state.arbitrageProviderDataState == null
                        || (state.arbitrageProviderDataState != null && arbitrageProviderData !== state.arbitrageProviderDataState)) {

                        //if currencyList response is success then store array list else store empty list
                        if (validateResponseNew({
                            response: arbitrageProviderData, isList: true
                        })) {
                            let res = parseArray(arbitrageProviderData.Response);

                            //for add Provider
                            for (var keyProvider in res) {
                                 let item = res[keyProvider]; 
                                 item.value = item.ProviderName;  
                            }

                            let providers = [
                                { value: R.strings.Please_Select },
                                ...res
                            ];

                            return { ...state, fromProviders: providers, toProviders: providers, arbitrageProviderDataState: arbitrageProviderData };
                        } else {
                            return { ...state, fromProviders: [{ value: R.strings.Please_Select }], toProviders: [{ value: R.strings.Please_Select }], arbitrageProviderDataState: arbitrageProviderData };
                        }
                    }
                } catch (e) {
                    return { ...state, fromProviders: [{ value: R.strings.Please_Select }], toProviders: [{ value: R.strings.Please_Select }] };
                }
            }

            if (providerAddressData) {
                try {
                    //if local providerAddressData state is null or its not null and also different then new response then and only then validate response.
                    if (state.providerAddressDataState == null || (state.providerAddressDataState != null && providerAddressData !== state.providerAddressDataState)) {

                        //if currencyList response is success then store array list else store empty list
                        if (validateResponseNew({ response: providerAddressData, isList: true })) {
                            let res = parseArray(providerAddressData.Data);

                            //for add Provider
                            for (var keyAddress in res) {
                                let item = res[keyAddress];
                                item.value = item.Address;
                            }

                            let addressesData = [
                                { value: R.strings.Please_Select },
                                ...res
                            ];

                            return { ...state, addresses: addressesData, providerAddressDataState: providerAddressData };
                        } else {
                            return { ...state, addresses: [{ value: R.strings.Please_Select }], providerAddressDataState: providerAddressData };
                        }
                    }
                } catch (e) {
                    return { ...state, addresses: [{ value: R.strings.Please_Select }], };
                }
            }
        }
        return null;
    }

    onChangeToProvider = async (index, item) => {

        //To Check User is Selected or Not
        if (index != R.strings.Please_Select) {

            this.setState({ selectedToProvider: index, selectedToProviderCode: item.Id })

            //if currency and to provider are selected than only call api for address
            if (index != R.strings.Please_Select && this.state.selectedCurrency != R.strings.selectCurrency) {

                //Check NetWork is Available or not
                if (await isInternet()) {

                    //Clear address 
                    this.setState({ selectedAddress: R.strings.Please_Select })

                    //Call getProviderAddressList Api 
                    this.props.getProviderAddressList({
                        ServiceProviderId: this.state.selectedToProviderCode,
                        WalletTypeId: this.state.selectedCurrencyCode,
                    });

                }
            }
        }
    }

    onChangeCurrency = async (index, item) => {

        //To Check User is Selected or Not
        if (index != R.strings.selectCurrency) {

            this.setState({ selectedCurrency: index, selectedCurrencyCode: item.Id })

            //if currency and to provider are selected than only call api for address
            if (index != R.strings.selectCurrency && this.state.selectedToProvider != R.strings.Please_Select) {

                //Check NetWork is Available or not
                if (await isInternet()) {

                    //Clear address 
                    this.setState({ selectedAddress: R.strings.Please_Select })

                    //Call getProviderAddressList Api 
                    this.props.getProviderAddressList({
                        ServiceProviderId: this.state.selectedToProviderCode,
                        WalletTypeId: this.state.selectedCurrencyCode,
                    });

                }
            }
        }
    }

    render() {

        // Loading status for Progress bar which is fetching from reducer
        const { addTopupFetching, providerAddressFetching, arbitrageProviderFetching, arbitrageCurrencyFetching } = this.props.Listdata;

        return (

            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                {/* To Set Status Bas as per out theme */}
                <CommonStatusBar />

                {/* To Set ToolBar as per out theme */}
                <CustomToolbar
                    title={R.strings.topupRequest}
                    isBack={true}
                    nav={this.props.navigation}
                />

                {/* Progress Dialog */}
                <ProgressDialog isShow={addTopupFetching || providerAddressFetching || arbitrageProviderFetching || arbitrageCurrencyFetching} />

                {/* for common toast */}
                <CommonToast ref={component => this.toast = component} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <ScrollView showsVerticalScrollIndicator={false}>

                        <View style={{
                            flex: 1, paddingLeft: R.dimens.activity_margin,
                            paddingRight: R.dimens.activity_margin,
                            paddingTop: R.dimens.padding_top_bottom_margin,
                            paddingBottom: R.dimens.padding_top_bottom_margin,
                        }}>

                            {/* Picker for fromProvider */}
                            <TitlePicker
                                isRequired={true}
                                title={R.strings.fromProvider}
                                array={this.state.fromProviders}
                                style={{ marginTop: R.dimens.widget_top_bottom_margin }}
                                selectedValue={this.state.selectedFromProvider}
                                onPickerSelect={(item, object) => this.setState({ selectedFromProvider: item, selectedFromProviderCode: object.Id })} />

                            {/* Picker for toProvider */}
                            <TitlePicker
                                isRequired={true}
                                title={R.strings.toProvider}
                                array={this.state.toProviders}
                                style={{ marginTop: R.dimens.widget_top_bottom_margin }}
                                selectedValue={this.state.selectedToProvider}
                                onPickerSelect={(index, object) => {
                                    this.onChangeToProvider(index, object)
                                }}
                            />

                            {/* Picker for Currency */}
                            <TitlePicker
                                isRequired={true}
                                title={R.strings.Currency}
                                array={this.state.currencies}
                                style={{ marginTop: R.dimens.widget_top_bottom_margin }}
                                selectedValue={this.state.selectedCurrency}
                                onPickerSelect={(index, object) => {
                                    this.onChangeCurrency(index, object)
                                }} />

                            {/* Picker for address */}
                            <TitlePicker
                                isRequired={true}
                                title={R.strings.Address}
                                array={this.state.addresses}
                                style={{ marginTop: R.dimens.widget_top_bottom_margin }}
                                selectedValue={this.state.selectedAddress}
                                onPickerSelect={(item) => this.setState({ selectedAddress: item })} />

                            {/* EditText for amount  */}
                            <EditText
                                isRequired={true}
                                header={R.strings.Amount}
                                placeholder={R.strings.Amount}
                                onChangeText={(text) => this.setState({ amount: text })}
                                value={this.state.amount}
                                validate={true}
                                keyboardType={'numeric'}
                                multiline={false}
                                returnKeyType={"done"}
                            />

                        </View>
                    </ScrollView>
                </View>
                <View style={{
                    paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin
                }}>
                    {/* To Set Add or Edit Button */}
                    <Button title={R.strings.Add} onPress={() => this.onPress()}></Button>
                </View>

                <LostGoogleAuthWidget
                    generateTokenApi={9}
                    navigation={this.props.navigation}
                    isShow={this.state.askTwoFA}
                    ApiRequest={this.state.topUpRequest}
                    onShow={() => this.setState({ askTwoFA: true })}
                    onCancel={() => this.setState({ askTwoFA: false })}
                />
            </SafeView>
        );
    }
}

function mapStateToProps(state) {
    return {
        //Updated TopUpHistoryReducer  
        Listdata: state.TopUpHistoryReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform clearTopupHistoryData Action 
        clearTopupHistoryData: () => dispatch(clearTopupHistoryData()),
        //for getArbitrageCurrencyList list action 
        getArbitrageCurrencyList: () => dispatch(getArbitrageCurrencyList()),
        //for getArbitrageProviderList list action 
        getArbitrageProviderList: () => dispatch(getArbitrageProviderList()),
        // Perform Provider Address Action
        getProviderAddressList: (payload) => dispatch(getProviderAddressList(payload)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TopupHistoryAddScreen)