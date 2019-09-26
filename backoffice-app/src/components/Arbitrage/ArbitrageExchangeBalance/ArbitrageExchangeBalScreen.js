import React, { Component } from 'react'
import { View, ScrollView } from 'react-native'
import SafeView from '../../../native_theme/components/SafeView';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import R from '../../../native_theme/R';
import { changeTheme, parseArray } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../Navigation';
import CommonToast from '../../../native_theme/components/CommonToast';
import Button from '../../../native_theme/components/Button';
import { TitlePicker } from '../../widget/ComboPickerWidget';
import { connect } from 'react-redux';
import { getArbitrageCurrencyList, getArbitrageProviderList } from '../../../actions/PairListAction';
import { validateResponseNew, isInternet } from '../../../validations/CommonValidation';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { getArbitrageExchangeBalList } from '../../../actions/Arbitrage/ArbitrageExchangeBalActions';
import { FeatureSwitch } from '../../../native_theme/components/FeatureSwitch';

export class ArbitrageExchangeBalScreen extends Component {
    constructor(props) {
        super(props);

        //Define all initial state
        this.state = {

            ArbitrageCurrencyListState: null,
            ArbitrageProviderListState: null,
            ArbitrageExchangeBalListState: null,

            Currency: [],
            selectedCurrency: R.strings.selectCurrency,

            ServiceProvider: [],
            selectedServiceProvider: R.strings.selectProvider,
            SerProId: '',

            isFirstTime: true,

            // For genrate mismatch functionality
            resolveBalanceMismatchStatus: false,
        }
    }

    async componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme()

        // check internet connection
        if (await isInternet()) {
            // Call Arbitrage Currency List Api
            this.props.getArbitrageCurrencyList()
            // Call Arbitrage Provider List Api
            this.props.getArbitrageProviderList()
        }
    }

    shouldComponentUpdate(nextProps, _nextState) {
        //stop twice api call
        return isCurrentScreen(nextProps)
    }

    // After check all validation, call arbitrage exchange balance api
    onArbiExchBalPress = async () => {

        // For input validations
        /*   if (this.state.selectedServiceProvider === R.strings.selectProvider) {
              this.toast.Show(R.strings.selectProvider)
           } */
        if (this.state.selectedCurrency === R.strings.selectCurrency) {
            this.toast.Show(R.strings.selectCurrency)
        } else {
            // check internet connection
            if (await isInternet()) {

                let req = {
                    SerProId: this.state.selectedServiceProvider == R.strings.selectProvider ? '' : this.state.SerProId,
                    SMSCode: this.state.selectedCurrency,
                    GenerateMismatch: (this.state.resolveBalanceMismatchStatus == true &&
                        (this.state.selectedCurrency != R.strings.selectCurrency && this.state.selectedServiceProvider != R.strings.selectProvider)) ? 1 : '', // For genrate mismatch functionality
                }

                // Call Service Provicer List Api
                this.props.getArbitrageExchangeBalList(req)
            }
        }
    }

    static oldProps = {};

    static getDerivedStateFromProps(props, state) {

        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return { ...state, isFirstTime: false, };
        }

        // To Skip Render if old and new props are equal
        if (ArbitrageExchangeBalScreen.oldProps !== props) {
            ArbitrageExchangeBalScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //Get All Updated Feild of Particular actions
            const { ArbitrageProviderList, ArbitrageCurrencyList } = props.ArbitrageExchangeBalResult

            // ArbitrageProviderList is not null
            if (ArbitrageProviderList) {
                try {
                    //if local ArbitrageProviderList state is null or its not null and also different then new response then and only then validate response.
                    if (state.ArbitrageProviderListState == null || (state.ArbitrageProviderListState !== null && ArbitrageProviderList !== state.ArbitrageProviderListState)) {

                        //if  response is success then store array list else store empty list
                        if (validateResponseNew({ response: ArbitrageProviderList, isList: true })) {
                            let res = parseArray(ArbitrageProviderList.Response);

                            for (var arbiProviderKey in res) {
                                let item = res[arbiProviderKey]
                                item.value = item.ProviderName
                            }

                            let providerNames = [
                                { value: R.strings.selectProvider },
                                ...res
                            ]

                            return { ...state, ArbitrageProviderListState: ArbitrageProviderList, ServiceProvider: providerNames };
                        } else {
                            return { ...state, ArbitrageProviderListState: ArbitrageProviderList, ServiceProvider: [{ value: R.strings.selectProvider }] };
                        }
                    }
                } catch (e) {
                    return { ...state, ServiceProvider: [{ value: R.strings.selectProvider }] };
                }
            }

            // ArbitrageCurrencyList is not null
            if (ArbitrageCurrencyList) {
                try {
                    //if local ArbitrageCurrencyList state is null or its not null and also different then new response then and only then validate response.
                    if (state.ArbitrageCurrencyListState == null || (state.ArbitrageCurrencyListState !== null && ArbitrageCurrencyList !== state.ArbitrageCurrencyListState)) {

                        //if  response is success then store array list else store empty list
                        if (validateResponseNew({ response: ArbitrageCurrencyList, isList: true })) {
                            let res = parseArray(ArbitrageCurrencyList.ArbitrageWalletTypeMasters);

                            for (var currencyKey in res) {
                                let item = res[currencyKey]
                                item.value = item.CoinName
                            }

                            let currency = [
                                { value: R.strings.selectCurrency },
                                ...res
                            ]

                            return { ...state, ArbitrageCurrencyListState: ArbitrageCurrencyList, Currency: currency };
                        } else {
                            return { ...state, ArbitrageCurrencyListState: ArbitrageCurrencyList, Currency: [{ value: R.strings.selectCurrency }] };
                        }
                    }
                } catch (e) {
                    return { ...state, Currency: [{ value: R.strings.selectCurrency }] };
                }
            }
        }
        return null
    }

    componentDidUpdate(prevProps, _prevState) {

        //Get All Updated field of Particular actions
        const { ArbitrageExchangeBalList, } = this.props.ArbitrageExchangeBalResult;

        // compare response with previous response
        if (ArbitrageExchangeBalList !== prevProps.ArbitrageExchangeBalResult.ArbitrageExchangeBalList) {

            // ArbitrageExchangeBalList is not null
            if (ArbitrageExchangeBalList) {
                try {
                    // if local ArbitrageExchangeBalList state is null or its not null and also different then new response then and only then validate response.
                    if (this.state.ArbitrageExchangeBalListState == null || (this.state.ArbitrageExchangeBalListState != null && ArbitrageExchangeBalList !== this.state.ArbitrageExchangeBalListState)) {
                        // handle response of API
                        if (validateResponseNew({ response: ArbitrageExchangeBalList })) {

                            this.setState({ ArbitrageExchangeBalListState: ArbitrageExchangeBalList })

                            let res = parseArray(ArbitrageExchangeBalList.Data)
                            // navigate Arbitrage Exchange Bal List Screen
                            this.props.navigation.navigate('ArbitrageExchangeBalListScreen', {
                                item: res,

                                Currency: this.state.Currency,
                                currencyName: this.state.selectedCurrency,

                                ServiceProvider: this.state.ServiceProvider,
                                selectedProvider: this.state.selectedServiceProvider,
                                SerProId: this.state.selectedServiceProvider == R.strings.selectProvider ? '' : this.state.SerProId,

                                GenerateMismatch: this.state.resolveBalanceMismatchStatus // For genrate mismatch functionality
                            })
                        }
                    }
                } catch (error) {
                    this.setState({ ArbitrageExchangeBalListState: null })
                }
            }
        }
    }

    render() {
        // Loading status for Progress bar which is fetching from reducer
        let { ArbitrageCurrencyLoading, ArbitrageProviderLoading, ArbitrageExchangeBalLoading } = this.props.ArbitrageExchangeBalResult

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.arbitrageExchangeBal}
                    isBack={true}
                    nav={this.props.navigation}
                />

                {/* Common Toast */}
                <CommonToast ref={cmp => this.toast = cmp} />

                {/* Progressbar */}
                <ProgressDialog isShow={ArbitrageExchangeBalLoading || ArbitrageProviderLoading || ArbitrageCurrencyLoading} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='always'>
                        <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>

                            {/* To Set Service Provider List in Dropdown */}
                            <TitlePicker
                                style={{ marginTop: R.dimens.margin }}
                                title={R.strings.ServiceProvider}
                                array={this.state.ServiceProvider}
                                selectedValue={this.state.selectedServiceProvider}
                                onPickerSelect={(item, object) => this.setState({ selectedServiceProvider: item, SerProId: object.Id })} />

                            {/* To Set Currency List in Dropdown */}
                            <TitlePicker
                                style={{ marginTop: R.dimens.margin }}
                                title={R.strings.Currency}
                                array={this.state.Currency}
                                selectedValue={this.state.selectedCurrency}
                                onPickerSelect={(item) => this.setState({ selectedCurrency: item, })} />

                            {/* switch for resolveBalanceMismatch */}
                            {
                                (this.state.selectedCurrency != R.strings.selectCurrency && this.state.selectedServiceProvider != R.strings.selectProvider) &&
                                <FeatureSwitch
                                    backgroundColor={'transparent'}
                                    title={R.strings.resolveBalanceMismatch}
                                    style={{ paddingLeft: R.dimens.LineHeight, paddingRight: R.dimens.widgetMargin }}
                                    isToggle={this.state.resolveBalanceMismatchStatus}
                                    textStyle={{ color: R.colors.textPrimary }}
                                    onValueChange={() => {
                                        this.setState({ resolveBalanceMismatchStatus: !this.state.resolveBalanceMismatchStatus })
                                    }}
                                />}

                        </View>
                    </ScrollView>

                    {/* To Set Submit Button */}
                    <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                        <Button title={R.strings.submit} onPress={this.onArbiExchBalPress}></Button>
                    </View>
                </View>
            </SafeView>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        // get arbitrage exchange bal data from reducer
        ArbitrageExchangeBalResult: state.ArbitrageExchangeBalReducer,
    }
}

const mapDispatchToProps = (dispatch) => ({
    // Perform Arbitrage Exchange Bal Action
    getArbitrageExchangeBalList: (payload) => dispatch(getArbitrageExchangeBalList(payload)),
    // Arbitrage Currency List Action
    getArbitrageCurrencyList: () => dispatch(getArbitrageCurrencyList()),
    // Arbitrage Provider List Action
    getArbitrageProviderList: () => dispatch(getArbitrageProviderList()),
})

export default connect(mapStateToProps, mapDispatchToProps)(ArbitrageExchangeBalScreen) 