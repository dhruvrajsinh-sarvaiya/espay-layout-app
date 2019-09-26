// AddInitialBalanceScreen
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
import { showAlert, changeTheme, parseFloatVal, parseArray } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew, isEmpty } from '../../../validations/CommonValidation';
import CommonToast from '../../../native_theme/components/CommonToast';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import R from '../../../native_theme/R';
import { TitlePicker } from '../../widget/ComboPickerWidget';
import { getArbitrageCurrencyList, getArbitrageProviderList } from '../../../actions/PairListAction';
import { addInitialBalance, clearInitialBalanceConfigurationData } from '../../../actions/Arbitrage/InitialBalanceConfigurationActions';
import SafeView from '../../../native_theme/components/SafeView';

//Create Common class for Add 
class AddInitialBalanceScreen extends Component {

    constructor(props) {
        super(props);

        //Define All State initial state
        this.state = {

            // for provider List
            Provider: [],
            ArbitrageProviderListState: null,
            selectedProvider: R.strings.selectProvider,
            ServiceProviderId: 0,

            // For Currency List
            Currency: [],
            ArbitrageCurrencyListState: null,
            selectedCurrency: R.strings.selectCurrency,
            WalletTypeId: 0,

            //for enter amount value 
            Amount: '',

            isFirstTime: true,
        }

        // Create reference
        this.toast = React.createRef();
    }

    async componentDidMount() {

        //Add this method to change theme based on stored theme name.
        changeTheme();

        // Check internet is Available or not
        if (await isInternet()) {
            // Call Arbitrage Currency List Api
            this.props.getArbitrageCurrencyList()
            // Call Arbitrage Provider List Api
            this.props.getArbitrageProviderList()
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
        if (AddInitialBalanceScreen.oldProps !== props) {
            AddInitialBalanceScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //Get All Updated Feild of Particular actions
            const { ArbitrageProviderList, ArbitrageCurrencyList } = props.InitialBalanceConfigResult

            // ArbitrageProviderList is not null
            if (ArbitrageProviderList) {
                try {
                    //if local ArbitrageProviderList state is null or its not null and also different then new response then and only then validate response.
                    if (state.ArbitrageProviderListState == null || (state.ArbitrageProviderListState !== null && ArbitrageProviderList !== state.ArbitrageProviderListState)) {

                        //if  response is success then store array list else store empty list
                        if (validateResponseNew({ response: ArbitrageProviderList, isList: true })) {
                            let res = parseArray(ArbitrageProviderList.Response);

                            for (var providerKey in res) {
                                let item = res[providerKey]; item.value = item.ProviderName
                            }

                            let providerNames = [
                                { value: R.strings.selectProvider },
                                ...res
                            ];

                            return {
                                ...state,
                                Provider: providerNames,
                                ArbitrageProviderListState: ArbitrageProviderList,
                            };
                        } else {
                            return {
                                ...state,
                                Provider: [{ value: R.strings.selectProvider }],
                                ArbitrageProviderListState: ArbitrageProviderList,
                            };
                        }
                    }
                } catch (e) {
                    return {
                        ...state,
                        Provider: [{ value: R.strings.selectProvider }]
                    };
                }
            }

            // ArbitrageCurrencyList is not null
            if (ArbitrageCurrencyList) {
                try {
                    //if local ArbitrageCurrencyList state is null or its not null and also different then new response then and only then validate response.
                    if (state.ArbitrageCurrencyListState == null ||
                        (state.ArbitrageCurrencyListState !== null &&
                            ArbitrageCurrencyList !== state.ArbitrageCurrencyListState)) {

                        //if  response is success then store array list else store empty list
                        if (validateResponseNew({ response: ArbitrageCurrencyList, isList: true })) {
                            let res = parseArray(ArbitrageCurrencyList.ArbitrageWalletTypeMasters);

                            for (var arbiWalletTypeLey in res) {
                                let item = res[arbiWalletTypeLey]; item.value = item.CoinName
                            }

                            let providerNames = [
                                { value: R.strings.selectCurrency },
                                ...res
                            ];

                            return { ...state, ArbitrageCurrencyListState: ArbitrageCurrencyList, Currency: providerNames };
                        } else {
                            return { ...state, ArbitrageCurrencyListState: ArbitrageCurrencyList, Currency: [{ value: R.strings.selectCurrency }] };
                        }
                    }
                } catch (e) {
                    return { ...state, Currency: [{ value: R.strings.selectCurrency }] };
                }
            }
        }
        return null;
    }


    componentDidUpdate = async (prevProps, prevState) => {

        //Get All Updated field of Particular actions
        const { AddInitialBalanceData } = this.props.InitialBalanceConfigResult;

        // check previous props and existing props
        if (AddInitialBalanceData !== prevProps.InitialBalanceConfigResult.AddInitialBalanceData) {
            // for show responce add
            if (AddInitialBalanceData) {
                try {
                    //If AddInitialBalance response is validate than show success dialog else show failure dialog
                    if (validateResponseNew({
                        response: AddInitialBalanceData,
                    })) {
                        showAlert(R.strings.Success, R.strings.balanceAddedSuccessFully, 0, () => {

                            // Clear data
                            this.props.clearInitialBalanceConfigurationData()
                            this.props.navigation.state.params.onSuccess() // if add success call list method from back screen
                            this.props.navigation.goBack()
                        });
                    } else {
                        // Clear data
                        this.props.clearInitialBalanceConfigurationData()
                    }
                } catch (e) {
                    // Clear data
                    this.props.clearInitialBalanceConfigurationData()
                }
            }
        }
    }

    //Add Or Update Button Presss
    onPress = async () => {

        //validations for Inputs 
        if (this.state.selectedProvider == R.strings.selectProvider) {
            this.toast.Show(R.strings.selectProvider)
            return;
        }

        if (this.state.selectedCurrency == R.strings.selectCurrency) {
            this.toast.Show(R.strings.selectCurrency)
            return;
        }

        if (isEmpty(this.state.Amount)) {
            this.toast.Show(R.strings.enter + ' ' + R.strings.Amount)
            return;
        }

        else {
            Keyboard.dismiss();

            // Check internet is Available or not
            if (await isInternet()) {
                // create 
                let request = {
                    ServiceProviderId: this.state.selectedProvider !== R.strings.selectProvider ? this.state.ServiceProviderId : '',
                    CurrencyName: this.state.selectedCurrency !== R.strings.selectCurrency ? this.state.selectedCurrency : '',
                    Amount: this.state.Amount ? parseFloatVal(this.state.Amount) : 0,
                }
                //call add Initial Balance api
                this.props.addInitialBalance(request)
            }
        }

    }

    shouldComponentUpdate(nextProps, nextState) {
        // stop twice api call
        return isCurrentScreen(nextProps);
    }

    render() {

        // Loading status for Progress bar which is fetching from reducer
        const { ArbitrageProviderLoading, ArbitrageCurrencyLoading, AddInitialBalanaceLoading, } = this.props.InitialBalanceConfigResult;

        return (

            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                {/* To Set Status Bas as per out theme */}
                <CommonStatusBar />

                {/* To Set ToolBar as per out theme */}
                <CustomToolbar
                    title={R.strings.setInitialBalance}
                    isBack={true}
                    nav={this.props.navigation}
                />

                {/* Progress Dialog */}
                <ProgressDialog isShow={ArbitrageProviderLoading || ArbitrageCurrencyLoading || AddInitialBalanaceLoading} />

                {/* for common toast */}
                <CommonToast ref={cmpToast => this.toast = cmpToast} />

                <View style={{
                    paddingTop: R.dimens.widget_top_bottom_margin,
                    flex: 1, justifyContent: 'space-between',
                    paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin,
                }}>

                    <View style={{ flex: 1 }}>

                        <ScrollView keyboardShouldPersistTaps='always' showsVerticalScrollIndicator={false}>

                            {/* Picker for Service Provider */}
                            <TitlePicker
                                title={R.strings.ServiceProvider}
                                isRequired={true} array={this.state.Provider}
                                style={{ marginTop: R.dimens.widget_top_bottom_margin }}
                                selectedValue={this.state.selectedProvider}
                                onPickerSelect={(index, object) => this.setState({ selectedProvider: index, ServiceProviderId: object.Id })} />

                            {/* Picker for Currency */}
                            <TitlePicker
                                title={R.strings.Currency}
                                isRequired={true}
                                array={this.state.Currency}
                                selectedValue={this.state.selectedCurrency}
                                style={{ marginTop: R.dimens.widget_top_bottom_margin }}
                                onPickerSelect={(index, object) => this.setState({ selectedCurrency: index, WalletTypeId: object.Id })} />


                            {/* EditText for Amount */}
                            <EditText
                                style={{ marginBottom: R.dimens.widget_top_bottom_margin, }}
                                isRequired={true}
                                maxLength={17}
                                header={R.strings.Amount}
                                placeholder={R.strings.Amount}
                                multiline={false}
                                validate={true}
                                onlyDigit={true}
                                keyboardType='numeric'
                                returnKeyType={"done"}
                                onChangeText={(Label) => this.setState({ Amount: Label })}
                                value={this.state.Amount}
                            />

                        </ScrollView>
                    </View>
                    <View style={{ paddingBottom: R.dimens.WidgetPadding }}>
                        {/* To Set Add Button */}
                        <Button title={R.strings.Add} onPress={() => this.onPress()}></Button>
                    </View>
                </View>
            </SafeView>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        // get Initial Balance Configuration data from reducer
        InitialBalanceConfigResult: state.InitialBalanceConfigurationReducer,
    }
}

const mapDispatchToProps = (dispatch) => ({
    // Arbitrage Currency List Action
    getArbitrageCurrencyList: () => dispatch(getArbitrageCurrencyList()),
    // Arbitrage Provider List Action
    getArbitrageProviderList: () => dispatch(getArbitrageProviderList()),
    // Add Initial Balance Configuration data Action
    addInitialBalance: (request) => dispatch(addInitialBalance(request)),
    // clear data
    clearInitialBalanceConfigurationData: () => dispatch(clearInitialBalanceConfigurationData()),
})

export default connect(mapStateToProps, mapDispatchToProps)(AddInitialBalanceScreen)