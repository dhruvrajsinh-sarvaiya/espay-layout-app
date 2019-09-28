import React, { Component } from 'react'
import { View, ScrollView } from 'react-native'
import { changeTheme, parseArray, parseIntVal, showAlert, } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../Navigation';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import R from '../../../native_theme/R';
import CommonToast from '../../../native_theme/components/CommonToast';
import { TitlePicker } from '../../widget/ComboPickerWidget';
import { isInternet, validateResponseNew, isEmpty } from '../../../validations/CommonValidation';
import { getWalletType, getProviderList } from '../../../actions/PairListAction';
import { clearDepositRouteData, addDepositRoute } from '../../../actions/Wallet/DepositRouteActions';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { connect } from 'react-redux';
import SafeView from '../../../native_theme/components/SafeView';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { FeatureSwitch } from '../../../native_theme/components/FeatureSwitch';
import EditText from '../../../native_theme/components/EditText';
import Button from '../../../native_theme/components/Button';
import TextCard from '../../../native_theme/components/TextCard';

export class AddEditDepositRouteScreen extends Component {
    constructor(props) {
        super(props)

        let { item, Currency, Provider } = props.navigation.state.params
        // Define all initial state
        this.state = {
            isEdit: item !== undefined ? true : false,
            Status: item !== undefined ? (item.Status == 1 ? true : false) : false,
            isFirstTime: true,

            Id: item !== undefined ? item.Id : 0,
            WalletTypeId: item !== undefined ? item.WalletTypeID : 0,
            ProviderId: item !== undefined ? item.SerProId : 0,

            Limit: item !== undefined ? item.Limit.toString() : '',
            MaxLimit: item !== undefined ? item.MaxLimit.toString() : '',
            RecordCount: item !== undefined ? item.RecordCount.toString() : '',
            IsResetLimit: false,
            Currency: Currency !== undefined ? Currency : [],
            Provider: Provider !== undefined ? Provider : [],
            selectedCurrency: item !== undefined ? item.WalletTypeName : R.strings.selectCurrency,
            selectedProvider: item !== undefined ? item.SerProName : R.strings.selectProvider,
        }

        this.inputs = {}
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        // check internet connection
        if (await isInternet()) {
            if (this.state.Currency.length == 0)
                // Call Wallet Data Api
                this.props.getWalletType()

            if (this.state.Provider.length == 0)
                // Call Service Provider List Api
                this.props.getProviderList()
        }
    }

    shouldComponentUpdate = (nextProps, _nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps)
    }

    //this Method is used to focus on next feild
    focusNextField(id) {
        //To handle Edit Text Focus Condition based on reference value
        if (id === 'etLimit') {
            if (this.state.isEdit) {
                this.inputs['etMaxLimit'].focus()
            } else {
                this.inputs[id].focus();
            }
        } else {
            this.inputs[id].focus();
        }
    }

    // Call when user press on add/update button
    onSubmitPress = async () => {
        // check validation
        if (R.strings.selectCurrency === this.state.selectedCurrency)
            this.toast.Show(R.strings.selectCurrency)
        else if (R.strings.selectProvider === this.state.selectedProvider)
            this.toast.Show(R.strings.selectProvider)
        else if (isEmpty(this.state.RecordCount))
            this.toast.Show(R.strings.enterRecordCount)
        else if (isEmpty(this.state.Limit))
            this.toast.Show(R.strings.enterLimit)
        else if (isEmpty(this.state.MaxLimit))
            this.toast.Show(R.strings.enterMaxLimit)
        // Minimum limit must be less than to Max Limit
        else if (parseIntVal(this.state.Limit) > parseIntVal(this.state.MaxLimit))
            this.toast.Show(R.strings.enterMinMaxLimitValidate)
        else {
            // check internet connection
            if (await isInternet()) {
                let req = {
                    Id: this.state.isEdit ? this.state.Id : 0,
                    WalletTypeID: this.state.WalletTypeId,
                    Status: this.state.Status ? 1 : 0,
                    RecordCount: parseIntVal(this.state.RecordCount),
                    Limit: parseIntVal(this.state.Limit),
                    MaxLimit: parseIntVal(this.state.MaxLimit),
                    SerProId: this.state.ProviderId,
                    IsResetLimit: this.state.IsResetLimit ? 1 : 0,
                    LastTrnID: '',
                    PreviousTrnID: '',
                    PrevIterationID: '',
                    TPSPickupStatus: 0
                }

                // Call Add Deposit Route Api
                this.props.addDepositRoute(req)
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
        if (AddEditDepositRouteScreen.oldProps !== props) {
            AddEditDepositRouteScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //Get All Updated Feild of Particular actions
            const { WalletDataList, ServiceProviderList } = props.DepositRouteResult;

            // WalletDataList is not null
            if (WalletDataList) {
                try {
                    //if local WalletDataList state is null or its not null and also different then new response then and only then validate response.
                    if (state.WalletDataList == null || (state.WalletDataList != null && WalletDataList !== state.WalletDataList)) {

                        //if  response is success then store array list else store empty list
                        if (validateResponseNew(
                            { response: WalletDataList, isList: true })) {
                            let res = parseArray(WalletDataList.Types);

                            for (var dataItem in res) {
                                let item = res[dataItem]
                                item.value = item.TypeName
                            }

                            let walletNames = [
                                { value: R.strings.selectCurrency },
                                ...res
                            ];

                            return { ...state, WalletDataList, Currency: walletNames };
                        } else {
                            return { ...state, WalletDataList, Currency: [{ value: R.strings.selectCurrency }] };
                        }
                    }
                } catch (e) {
                    return { ...state, Currency: [{ value: R.strings.selectCurrency }] };
                }
            }

            // ServiceProviderList is not null
            if (ServiceProviderList) {
                try {
                    //if local ServiceProviderList state is null or its not null and also different then new response then and only then validate response.
                    if (state.ServiceProviderList == null || (state.ServiceProviderList != null && ServiceProviderList !== state.ServiceProviderList)) {

                        //if  response is success then store array list else store empty list
                        if (validateResponseNew({ response: ServiceProviderList, isList: true })) {
                            let res = parseArray(ServiceProviderList.Response);

                            for (var ServiceProviderListKey in res) {
                                let item = res[ServiceProviderListKey]
                                item.value = item.ProviderName
                            }

                            let providerNames = [
                                { value: R.strings.selectProvider },
                                ...res
                            ];

                            return { ...state, ServiceProviderList, Provider: providerNames };
                        } else {
                            return { ...state, ServiceProviderList, Provider: [{ value: R.strings.selectProvider }] };
                        }
                    }
                } catch (e) {
                    return { ...state, Provider: [{ value: R.strings.selectProvider }] };
                }
            }
        }
        return null
    }

    componentDidUpdate(prevProps, _prevState) {
        //Get All Updated field of Particular actions
        const { AddDepositRoute } = this.props.DepositRouteResult

        // check previous props and existing props
        if (AddDepositRoute !== prevProps.DepositRouteResult.AddDepositRoute) {
            // AddDepositRoute is not null
            if (AddDepositRoute) {
                try {
                    if (this.state.AddDepositRoute == null || (this.state.AddDepositRoute != null && AddDepositRoute !== this.state.AddDepositRoute)) {
                        // Handle Response
                        if (validateResponseNew({ response: AddDepositRoute })) {

                            this.setState({ AddDepositRoute })

                            showAlert(R.strings.Success + '!', AddDepositRoute.ReturnMsg, 0, () => {
                                // Clear deposit route data
                                this.props.clearDepositRouteData()
                                // Navigate to Deposit Route List Screen
                                this.props.navigation.state.params.onRefresh(true)
                                this.props.navigation.goBack()
                            })
                        } else {
                            // Clear deposit route data
                            this.props.clearDepositRouteData()
                        }
                    }
                } catch (error) {
                    // Clear deposit route data
                    this.props.clearDepositRouteData()
                    this.setState({ AddDepositRoute: null })
                }
            }
        }
    }

    render() {
        // Loading status for Progress bar which is fetching from reducer
        let { ServiceProviderLoading, WalletDataListLoading, AddDepositRouteLoading } = this.props.DepositRouteResult

        let { isEdit } = this.state
        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={isEdit ? R.strings.updateRoute : R.strings.addRoute}
                    isBack={true}
                    onBackPress={this.onBackPress}
                    nav={this.props.navigation} />

                {/* For Toast */}
                <CommonToast ref={component => this.toast = component} />

                {/* Progress Dialog */}
                <ProgressDialog isShow={WalletDataListLoading || ServiceProviderLoading || AddDepositRouteLoading} />

                {/* Toggle Button For Status Enable/Disable Functionality */}
                <FeatureSwitch
                    isGradient={true}
                    title={R.strings.Status}
                    isToggle={this.state.Status}
                    onValueChange={() => this.setState({ Status: !this.state.Status })}
                />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={this.styles().mainView}>
                            {/* Picker for Currency */}
                            {
                                !isEdit ?
                                    <TitlePicker
                                        isRequired={true}
                                        title={R.strings.Currency}
                                        array={this.state.Currency}
                                        selectedValue={this.state.selectedCurrency}
                                        onPickerSelect={(item, object) => this.setState({ selectedCurrency: item, WalletTypeId: object.ID })} />
                                    :
                                    <TextCard title={R.strings.Currency} value={this.state.selectedCurrency} />
                            }

                            {/* Picker for Provider */}
                            {
                                !isEdit ?
                                    <TitlePicker
                                        isRequired={true}
                                        style={{ marginTop: R.dimens.margin }}
                                        title={R.strings.ServiceProvider}
                                        array={this.state.Provider}
                                        selectedValue={this.state.selectedProvider}
                                        onPickerSelect={(item, object) => this.setState({ selectedProvider: item, ProviderId: object.Id })} />
                                    :
                                    <TextCard title={R.strings.ServiceProvider} value={this.state.selectedProvider} />
                            }

                            {/* To Set Record Count in EditText */}
                            <EditText
                                isRequired={true}
                                reference={input => { this.inputs['etRecordCount'] = input; }}
                                header={R.strings.recordCount}
                                placeholder={R.strings.recordCount}
                                multiline={false}
                                maxLength={5}
                                keyboardType='numeric'
                                returnKeyType={"next"}
                                blurOnSubmit={false}
                                onSubmitEditing={() => { this.focusNextField('etLimit') }}
                                onChangeText={(RecordCount) => this.setState({ RecordCount })}
                                value={this.state.RecordCount}
                                validate={true}
                                onlyDigit={true}
                            />

                            {/* To Set Limit in EditText */}
                            <EditText
                                editable={isEdit ? false : true}
                                isRequired={true}
                                reference={input => { this.inputs['etLimit'] = input; }}
                                header={R.strings.limit}
                                placeholder={R.strings.limit}
                                multiline={false}
                                maxLength={5}
                                keyboardType='numeric'
                                returnKeyType={"next"}
                                blurOnSubmit={false}
                                onSubmitEditing={() => { this.focusNextField('etMaxLimit') }}
                                onChangeText={(Limit) => this.setState({ Limit })}
                                value={this.state.Limit}
                                validate={true}
                                onlyDigit={true}
                            />

                            {/* To Set Max Limit in EditText */}
                            <EditText
                                isRequired={true}
                                reference={input => { this.inputs['etMaxLimit'] = input; }}
                                header={R.strings.maxLimit}
                                placeholder={R.strings.maxLimit}
                                multiline={false}
                                maxLength={5}
                                keyboardType='numeric'
                                returnKeyType={"done"}
                                onChangeText={(MaxLimit) => this.setState({ MaxLimit })}
                                value={this.state.MaxLimit}
                                validate={true}
                                onlyDigit={true}
                            />

                            {
                                isEdit &&
                                <FeatureSwitch
                                    backgroundColor={'transparent'}
                                    style={{ paddingLeft: 0, paddingRight: 0 }}
                                    textStyle={{ color: R.colors.textPrimary }}
                                    title={R.strings.restartCount}
                                    isToggle={this.state.IsResetLimit}
                                    onValueChange={() => this.setState({ IsResetLimit: !this.state.IsResetLimit })}
                                />
                            }
                        </View>
                    </ScrollView>

                    <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                        {/* To Set Submit Button */}
                        <Button title={isEdit ? R.strings.update : R.strings.add} onPress={this.onSubmitPress}></Button>
                    </View>
                </View>
            </SafeView>
        )
    }

    styles = () => {
        return {
            mainView: {
                paddingLeft: R.dimens.activity_margin,
                paddingRight: R.dimens.activity_margin,
                paddingTop: R.dimens.padding_top_bottom_margin,
                paddingBottom: R.dimens.padding_top_bottom_margin,
            }
        }
    }
}

const mapStateToProps = (state) => {
    return {
        // get transfer fee data from reducer
        DepositRouteResult: state.DepositRouteReducer,
    }
};

const mapDispatchToProps = (dispatch) => ({
    // To Perform Wallet Data Action
    getWalletType: () => dispatch(getWalletType()),
    // To Perform Provider List Action
    getProviderList: () => dispatch(getProviderList()),
    // To Clear Deposit Route Data Action
    clearDepositRouteData: () => dispatch(clearDepositRouteData()),
    // Add Deposit Route Action
    addDepositRoute: (payload) => dispatch(addDepositRoute(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddEditDepositRouteScreen);