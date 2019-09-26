// AddEditProviderAddressScreen
import {
    View,
    Keyboard,
    ScrollView,
} from 'react-native';
import React from 'react'
import { Component } from 'react';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../../native_theme/components/CustomToolbar'
import Button from '../../../native_theme/components/Button';
import EditText from '../../../native_theme/components/EditText'
import { isCurrentScreen } from '../../Navigation';
import { connect } from 'react-redux';
import { isInternet, validateResponseNew, isEmpty } from '../../../validations/CommonValidation';
import { showAlert, changeTheme, parseFloatVal, parseArray } from '../../../controllers/CommonUtils';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import CommonToast from '../../../native_theme/components/CommonToast';
import R from '../../../native_theme/R';
import { FeatureSwitch } from '../../../native_theme/components/FeatureSwitch';
import { TitlePicker } from '../../widget/ComboPickerWidget';
import { getArbitrageCurrencyList, getArbitrageProviderList } from '../../../actions/PairListAction';
import { addProviderAddress, updateProviderAddress, clearProviderAddressData } from '../../../actions/Arbitrage/ProviderAddressAction';
import SafeView from '../../../native_theme/components/SafeView';

//Create Common class for Add Edit WalletTypes
class AddEditProviderAddressScreen extends Component {

    constructor(props) {
        super(props)

        //item for edit from List screen 
        let item = props.navigation.state.params && props.navigation.state.params.item

        //item that check edit is true or not
        let edit = props.navigation.state.params && props.navigation.state.params.edit

        //Define All State initial state
        this.state = {
            edit: edit,
            item: item,

            // for provider List
            Provider: [],
            ArbitrageProviderListState: null,
            selectedProvider: edit ? item.ServiceProviderName : R.strings.selectProvider,
            ServiceProviderId: edit ? item.ServiceProviderId : 0,

            // For Currency List
            Currency: [],
            ArbitrageCurrencyListState: null,
            selectedCurrency: edit ? item.WalletTypeName : R.strings.selectCurrency,
            WalletTypeId: edit ? item.WalletTypeId : 0,

            Address: edit ? item.Address : '',
            Status: edit ? (item.IsDefaultAddress === 1 ? true : false) : false,

            isFirstTime: true,
        };

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
        if (AddEditProviderAddressScreen.oldProps !== props) {
            AddEditProviderAddressScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //Get All Updated Feild of Particular actions
            const { ArbitrageProviderList, ArbitrageCurrencyList } = props.ProviderAddressResult

            // ArbitrageProviderList is not null
            if (ArbitrageProviderList) {
                try {
                    //if local ArbitrageProviderList state is null or its not null and also different then new response then and only then validate response.
                    if (state.ArbitrageProviderListState == null || (state.ArbitrageProviderListState !== null && ArbitrageProviderList !== state.ArbitrageProviderListState)) {

                        //if  response is success then store array list else store empty list
                        if (validateResponseNew({ response: ArbitrageProviderList, isList: true })) {

                            let res = parseArray(ArbitrageProviderList.Response);
                            for (var providerKey in res) {
                                let item = res[providerKey]
                                item.value = item.ProviderName
                            }

                            let providerNames = [{ value: R.strings.selectProvider }, ...res];

                            return {
                                ...state, Provider: providerNames,
                                ArbitrageProviderListState: ArbitrageProviderList,
                            };
                        } else {
                            return {
                                ...state,
                                ArbitrageProviderListState: ArbitrageProviderList,
                                Provider: [{ value: R.strings.selectProvider }]
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
                    if (state.ArbitrageCurrencyListState == null || (state.ArbitrageCurrencyListState !== null && ArbitrageCurrencyList !== state.ArbitrageCurrencyListState)) {

                        //if  response is success then store array list else store empty list
                        if (validateResponseNew({ isList: true, response: ArbitrageCurrencyList, })) {

                            let res = parseArray(ArbitrageCurrencyList.ArbitrageWalletTypeMasters);
                            for (var walletType in res) {
                                let item = res[walletType]
                                item.value = item.CoinName
                            }

                            let providerNames = [
                                { value: R.strings.selectCurrency }, ...res
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
        const { AddProviderAddressData, UpdateProviderAddressData } = this.props.ProviderAddressResult;

        // check previous props and existing props
        if (AddProviderAddressData !== prevProps.ProviderAddressResult.AddProviderAddressData) {
            // for show responce add
            if (AddProviderAddressData) {
                try {
                    // If AddProviderAddress response is valdate than show success dialog else failure dialog
                    if (validateResponseNew({
                        response: AddProviderAddressData,
                    })) {
                        showAlert(R.strings.Success, AddProviderAddressData.ReturnMsg, 0, () => {
                            //Clear data
                            this.props.clearProviderAddressData()
                            this.props.navigation.state.params.onSuccess() // if add success call list method from back screen
                            this.props.navigation.goBack()
                        });
                    } else {
                        //Clear data
                        this.props.clearProviderAddressData()
                    }
                } catch (e) {
                    //Clear data
                    this.props.clearProviderAddressData()
                }
            }
        }

        if (UpdateProviderAddressData !== prevProps.ProviderAddressResult.UpdateProviderAddressData) {
            // for show responce update
            if (UpdateProviderAddressData) {
                try {
                    // If UpdateProviderAddress response is valdate than show success dialog else failure dialog
                    if (validateResponseNew({
                        response: UpdateProviderAddressData
                    })) {
                        showAlert(R.strings.Success, UpdateProviderAddressData.ReturnMsg, 0, () => {
                            //Clear data
                            this.props.clearProviderAddressData()
                            this.props.navigation.state.params.onSuccess() // if update success call list method from back screen
                            this.props.navigation.goBack()
                        });
                    } else {
                        //Clear data
                        this.props.clearProviderAddressData()
                    }
                } catch (e) {
                    //Clear data
                    this.props.clearProviderAddressData()
                }
            }
        }
    }

    //Add Or Update Button Presss
    onAddEditProvider = async (Id) => {

        //validations for Inputs 
        if (this.state.selectedProvider == R.strings.selectProvider) {
            this.toast.Show(R.strings.selectProvider)
            return;
        }

        //validations for Inputs 
        if (this.state.selectedCurrency == R.strings.selectCurrency) {
            this.toast.Show(R.strings.selectCurrency)
            return;
        }

        if (isEmpty(this.state.Address)) {
            this.toast.Show(R.strings.enter + ' ' + R.strings.Address)
            return;
        }

        Keyboard.dismiss();

        // Check Internet is Available or not
        if (await isInternet()) {

            this.request = {
                Address: this.state.Address,
                IsDefaultAddress: parseFloatVal(this.state.Status === true ? 1 : 0),
                WalletTypeId: this.state.selectedCurrency !== R.strings.selectCurrency ? this.state.WalletTypeId : '',
                ServiceProviderId: this.state.selectedProvider !== R.strings.selectProvider ? this.state.ServiceProviderId : '',
            }

            if (this.state.edit) {
                this.request = {
                    ...this.request,
                    id: this.state.item.Id,
                }

                //call update chrage configuration api
                this.props.onUpdateProviderAddress(this.request)
            }
            else {
                //call add charge configuration api
                this.props.onAddProviderAddress(this.request)
            }
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        // stop twice api call
        return isCurrentScreen(nextProps);
    };

    render() {

        // Loading status for Progress bar which is fetching from reducer
        const { ArbitrageProviderLoading, ArbitrageCurrencyLoading, AddProviderAddressLoading, UpdateProviderAddressLoading } = this.props.ProviderAddressResult;

        return (

            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                {/* To Set Status Bas as per out theme */}
                <CommonStatusBar />

                {/* To Set ToolBar as per out theme */}
                <CustomToolbar
                    title={this.state.edit ? R.strings.updateProviderAddress : R.strings.addProviderAddress}
                    isBack={true}
                    nav={this.props.navigation}
                />

                {/* Progress Dialog */}
                <ProgressDialog isShow={ArbitrageProviderLoading || ArbitrageCurrencyLoading || AddProviderAddressLoading || UpdateProviderAddressLoading} />

                {/* for common toast */}
                <CommonToast ref={cmpToast => this.toast = cmpToast} />

                {/* Toggle Button For Status Enable/Disable Functionality */}
                <FeatureSwitch
                    isGradient
                    title={R.strings.defaultAddress}
                    isToggle={this.state.Status}
                    onValueChange={() => {
                        this.setState({ Status: !this.state.Status })
                    }}
                />

                <View style={{
                    paddingTop: R.dimens.widget_top_bottom_margin,
                    flex: 1,
                    justifyContent: 'space-between', paddingLeft: R.dimens.activity_margin,
                    paddingRight: R.dimens.activity_margin,
                }}>

                    <View style={{ flex: 1 }}>

                        <ScrollView keyboardShouldPersistTaps='always' showsVerticalScrollIndicator={false}>

                            {/* Picker for Service Provider */}
                            <TitlePicker
                                title={R.strings.ServiceProvider}
                                isRequired={true}
                                array={this.state.Provider}
                                selectedValue={this.state.selectedProvider}
                                style={{ marginTop: R.dimens.widget_top_bottom_margin }}
                                onPickerSelect={(index, object) => this.setState({ selectedProvider: index, ServiceProviderId: object.Id })} />

                            {/* Picker for Currency */}
                            <TitlePicker
                                array={this.state.Currency}
                                isRequired={true} title={R.strings.Currency}
                                style={{ marginTop: R.dimens.widget_top_bottom_margin }}
                                selectedValue={this.state.selectedCurrency}
                                onPickerSelect={(index, object) => this.setState({ selectedCurrency: index, WalletTypeId: object.Id })} />


                            {/* EditText for Address */}
                            <EditText
                                isRequired={true}
                                header={R.strings.Address}
                                placeholder={R.strings.Address}
                                maxLength={100}
                                multiline={false}
                                keyboardType='default'
                                returnKeyType={"done"}
                                onChangeText={(Label) => this.setState({ Address: Label })}
                                value={this.state.Address}
                            />

                        </ScrollView>
                    </View>
                    <View style={{ paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                        {/* To Set Add or Edit Button */}
                        <Button title={this.state.edit ? R.strings.update : R.strings.Add} onPress={() => this.onAddEditProvider(this.state.edit ? this.state.item.Id : null)}></Button>
                    </View>
                </View>
            </SafeView>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        // get provider Address data from reducer
        ProviderAddressResult: state.ProviderAddressReducer,
    }
}

const mapDispatchToProps = (dispatch) => ({
    // Arbitrage Currency List Action
    getArbitrageCurrencyList: () => dispatch(getArbitrageCurrencyList()),
    // Arbitrage Provider List Action
    getArbitrageProviderList: () => dispatch(getArbitrageProviderList()),
    // Add Provider Address Action
    onAddProviderAddress: (request) => dispatch(addProviderAddress(request)),
    // Update Provider Address Action
    onUpdateProviderAddress: (request) => dispatch(updateProviderAddress(request)),
    // clear data
    clearProviderAddressData: () => dispatch(clearProviderAddressData()),
})

export default connect(mapStateToProps, mapDispatchToProps)(AddEditProviderAddressScreen)