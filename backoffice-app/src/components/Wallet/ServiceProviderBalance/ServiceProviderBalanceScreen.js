import React, { Component } from 'react'
import { View, ScrollView } from 'react-native'
import SafeView from '../../../native_theme/components/SafeView';
import R from '../../../native_theme/R';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import Button from '../../../native_theme/components/Button';
import { TitlePicker } from '../../widget/ComboPickerWidget';
import { getProviderList, getWalletType } from '../../../actions/PairListAction';
import { isInternet, validateResponseNew } from '../../../validations/CommonValidation';
import { isCurrentScreen } from '../../Navigation';
import { changeTheme, parseArray } from '../../../controllers/CommonUtils';
import { connect } from 'react-redux';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import CommonToast from '../../../native_theme/components/CommonToast';
import { getServiceProviderBalList } from '../../../actions/Wallet/ServiceProviderBalActions';

export class ServiceProviderBalanceScreen extends Component {
    constructor(props) {
        super(props)

        // Define all state initial state
        this.state = {
            ServiceProviderId: 0,
            ServiceProvider: [],
            selectedServiceProvider: R.strings.select_serivce_provider,

            TransTypeId: 0,
            TransType: [
                { value: R.strings.selectTransactionType },
                { code: 6, value: 'Withdrawal' },
                { code: 9, value: 'AddressGeneration' }
            ],
            selectedTransType: R.strings.selectTransactionType,

            Currency: [],
            selectedCurrency: R.strings.selectCurrency,
            isFirstTime: true,

            WalletDataList: null,

            ServiceProviderBalResponse: [],
        }

        // Create reference
        this.toast = React.createRef();
    }

    shouldComponentUpdate = (nextProps, _nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps);
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        // check internet connection
        if (await isInternet()) {
            // Call Service Provider List Api 
            this.props.getProviderList()
        }
    }

    onServiceProviderChange = async (item, object) => {
        let obj = {}
        if (item !== R.strings.select_serivce_provider) {
            // Api not call when user already select selected item 
            if (this.state.selectedServiceProvider !== item) {
                obj = {
                    ...obj,
                    ServiceProviderId: object.Id,
                }

                // check internet connection
                if (await isInternet()) {
                    // Call Get Wallet Type Api
                    this.props.getWalletType({ ServiceProviderId: object.Id })
                }
            }
        }

        obj = {
            ...obj,
            selectedServiceProvider: item,
        }
        this.setState(obj)
    }

    // After check all validation, call service provider balance api
    onServiceProviderBalPress = async () => {
        if (this.state.selectedServiceProvider === R.strings.select_service_provider) {
            this.toast.Show(R.strings.select_serivce_provider)
            return
        }

        // Currency dropdown displayed on Service Provider list item
        if (this.state.WalletDataList !== null && this.state.WalletDataList.Types.length > 0) {

            // display toast
            if (this.state.selectedCurrency === R.strings.selectedCurrency) {
                this.toast.Show(R.strings.selectCurrency)
                return
            }
        }

        // check internet connection
        if (await isInternet()) {

            let req = {
                ServiceProviderId: this.state.ServiceProviderId,
                CurrencyName: this.state.selectedCurrency,
                TransactionType: this.state.selectedTransType === R.strings.selectTransactionType ? '' : this.state.TransTypeId
            }
            // Call Service Provicer List Api
            this.props.getServiceProviderBalList(req)
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
        if (ServiceProviderBalanceScreen.oldProps !== props) {
            ServiceProviderBalanceScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {

            //Get All Updated Feild of Particular actions
            const { SerProviderList, WalletDataList } = props.ServiceProviderBalResult;

            // SerProviderList is not null
            if (SerProviderList) {
                try {
                    //if local SerProviderList state is null or its not null and also different then new response then and only then validate response.
                    if (state.SerProviderList == null || (state.SerProviderList != null && SerProviderList !== state.SerProviderList)) {

                        //if  response is success then store array list else store empty list
                        if (validateResponseNew({ response: SerProviderList, isList: true })) {
                            // Parsing array
                            let res = parseArray(SerProviderList.Response);

                            for (var dataItem in res) {
                                let item = res[dataItem]
                                item.value = item.ProviderName
                            }

                            let serviceProviderName = [{ value: R.strings.select_serivce_provider }, ...res];

                            return { ...state, SerProviderList, ServiceProvider: serviceProviderName };
                        } else {
                            return { ...state, SerProviderList, ServiceProvider: [{ value: R.strings.select_serivce_provider }] };
                        }
                    }
                } catch (e) {
                    return {
                        ...state,
                        ServiceProvider: [{ value: R.strings.select_serivce_provider }]
                    };
                }
            }

            // WalletDataList is not null
            if (WalletDataList) {
                try {
                    //if local WalletDataList state is null or its not null and also different then new response then and only then validate response.
                    if (state.WalletDataList == null
                        || (state.WalletDataList != null
                            && WalletDataList !== state.WalletDataList)) {

                        //if  response is success then store array list else store empty list
                        if (validateResponseNew({ isList: true, response: WalletDataList,  })) {
                            // Parsing array
                            let res = parseArray(WalletDataList.Types);

                            for (var WalletDataListKey in res) {
                                let item = res[WalletDataListKey];  item.value = item.TypeName
                            }

                            let walletName = [
                                { value: R.strings.selectCurrency }, ...res
                            ]

                            return { ...state, WalletDataList, Currency: walletName };
                        } else {
                            return { ...state, WalletDataList, Currency: [{ value: R.strings.selectCurrency }] };
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
        const { ServiceProviderBalList, } = this.props.ServiceProviderBalResult;

        // compare response with previous response
        if (ServiceProviderBalList !== prevProps.ServiceProviderBalResult.ServiceProviderBalList) {

            // ServiceProviderBalList is not null
            if (ServiceProviderBalList) {
                try {
                    // if local ServiceProviderBalList state is null or its not null and also different then new response then and only then validate response.
                    if (this.state.ServiceProviderBalList == null || (this.state.ServiceProviderBalList != null && ServiceProviderBalList !== this.state.ServiceProviderBalList)) {
                        //handle response of API
                        if (validateResponseNew({ response: ServiceProviderBalList })) {

                            this.setState({ ServiceProviderBalList })

                            let res = parseArray(ServiceProviderBalList.Data)
                            // navigate Service Provider Balance List Screen
                            this.props.navigation.navigate('ServiceProviderBalanceListScreen', { item: res, currencyName: this.state.selectedCurrency, serviceProvider: this.state.selectedServiceProvider, transType: this.state.selectedTransType })
                        }
                    }
                } catch (error) {
                    this.setState({ ServiceProviderBalList: null })
                }
            }
        }
    }

    render() {
        // Loading status for Progress bar which is fetching from reducer
        const { SerProviderLoading, WalletDataLaoding, ServiceProviderBalLoading } = this.props.ServiceProviderBalResult;
        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.serviceProviderBalance}
                    isBack={true}
                    nav={this.props.navigation}
                />

                {/* Common Toast */}
                <CommonToast ref={cmp => this.toast = cmp} />

                {/* Progress bar */}
                <ProgressDialog isShow={SerProviderLoading || WalletDataLaoding || ServiceProviderBalLoading} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='always'>
                        <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>

                            {/* To Set Service Provider List in Dropdown */}
                            <TitlePicker
                                style={{ marginTop: R.dimens.margin }}
                                title={R.strings.ServiceProvider}
                                array={this.state.ServiceProvider}
                                selectedValue={this.state.selectedServiceProvider}
                                onPickerSelect={(item, object) => this.onServiceProviderChange(item, object)} />

                            {
                                (this.state.WalletDataList !== null && this.state.WalletDataList.Types.length > 0) &&
                                /* To Set Currency List in Dropdown */
                                <TitlePicker
                                    style={{ marginTop: R.dimens.margin }}
                                    title={R.strings.Currency}
                                    array={this.state.Currency}
                                    selectedValue={this.state.selectedCurrency}
                                    onPickerSelect={(item) => this.setState({ selectedCurrency: item })} />
                            }

                            {/* To Set Transaction Type List in Dropdown */}
                            <TitlePicker
                                style={{ marginTop: R.dimens.margin }}
                                title={R.strings.transType}
                                array={this.state.TransType}
                                selectedValue={this.state.selectedTransType}
                                onPickerSelect={(item, object) => this.setState({ selectedTransType: item, TransTypeId: object.code })} />
                        </View>
                    </ScrollView>

                    {/* To Set Submit Button */}
                    <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                        <Button title={R.strings.submit} onPress={this.onServiceProviderBalPress}></Button>
                    </View>
                </View>
            </SafeView>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        // get service provider balance data from reducer
        ServiceProviderBalResult: state.ServiceProviderBalanceReducer,
    }
};

const mapDispatchToProps = (dispatch) => ({
    // To Perform Get Provider List Action
    getProviderList: () => dispatch(getProviderList()),
    // To Get Currency List Action
    getWalletType: (payload) => dispatch(getWalletType(payload)),
    // To Get Service Provider Bal List Action
    getServiceProviderBalList: (payload) => dispatch(getServiceProviderBalList(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ServiceProviderBalanceScreen);