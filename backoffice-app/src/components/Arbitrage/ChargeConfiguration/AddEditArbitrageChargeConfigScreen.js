import React, { Component } from 'react'
import { View, ScrollView } from 'react-native'
import SafeView from '../../../native_theme/components/SafeView';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import R from '../../../native_theme/R';
import { changeTheme, parseArray, showAlert } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../Navigation';
import CommonToast from '../../../native_theme/components/CommonToast';
import { FeatureSwitch } from '../../../native_theme/components/FeatureSwitch';
import { TitlePicker } from '../../widget/ComboPickerWidget';
import { connect } from 'react-redux';
import { clearArbitrageChargeConfigData, addArbitrageChargeConfigData } from '../../../actions/Arbitrage/ArbitrageChargeConfigActions';
import { getArbitrageCurrencyList, getWalletTransactionType } from '../../../actions/PairListAction';
import { isInternet, validateResponseNew, isEmpty } from '../../../validations/CommonValidation';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import EditText from '../../../native_theme/components/EditText';
import Button from '../../../native_theme/components/Button';
import TextCard from '../../../native_theme/components/TextCard';

export class AddEditArbitrageChargeConfigScreen extends Component {
    constructor(props) {
        super(props)

        // getting response from previous screen
        let item = props.navigation.state.params && props.navigation.state.params.item

        // Define all initial state
        this.state = {
            Currency: [],
            TransactionType: [],

            ArbitrageCurrencyListState: null,
            TransactionTypeListState: null,
            AddChargeConfigDataState: null,

            selectedCurrency: item ? item.WalletTypeName : R.strings.selectCurrency,
            selectedTransType: item ? item.TrnTypeName : R.strings.selectTransactionType,

            Remarks: item ? item.Remarks : '',
            Id: item ? item.Id : 0,
            SlabType: item ? item.SlabType : 1,
            TrnTypeId: item ? item.TrnType : 0,
            WalletTypeId: item ? item.WalletTypeID : 0,
            SpecialChargeConfigurationId: item ? item.SpecialChargeConfigurationID : 0,

            isEdit: item ? true : false,
            Status: item ? (item.Status == 1 ? true : false) : false,
            IsKYCEnable: item ? (item.KYCComplaint == 1 ? true : false) : false,
            isFirstTime: false,
        }

        this.inputs = {}

        // create reference
        this.toast = React.createRef();
    }

    async componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme()

        // check internet connection
        if (await isInternet()) {
            if (!this.state.isEdit) {
                // Call Arbitrage Currency List Api
                this.props.getArbitrageCurrencyList()
                //call get Wallet Transaction Type api
                this.props.getWalletTransactionType()
            }
        }
    }

    shouldComponentUpdate(nextProps, _nextState) {
        //stop twice api call
        return isCurrentScreen(nextProps)
    }

    // Call api after check all validation
    onSubmitPress = async () => {

        // Check input validations
        if (this.state.selectedCurrency === R.strings.selectCurrency)
            this.toast.Show(R.strings.selectCurrency)
        else if (this.state.selectedTransType === R.strings.selectTransactionType)
            this.toast.Show(R.strings.selectTransactionType)
        else if (isEmpty(this.state.Remarks))
            this.toast.Show(R.strings.enterRemarks)
        else {
            // Check internet connection
            if (await isInternet()) {
                let req = {
                    Id: this.state.Id,
                    WalletTypeId: this.state.WalletTypeId,
                    TrnType: this.state.TrnTypeId,
                    KYCComplaint: this.state.IsKYCEnable ? 1 : 0,
                    Status: this.state.Status ? 1 : 0,
                    SlabType: this.state.SlabType,
                    SpecialChargeConfigurationID: this.state.SpecialChargeConfigurationId,
                    Remarks: this.state.Remarks
                }
                // Call Add/Edit Arbitrage Charge Config Api
                this.props.addArbitrageChargeConfigData(req)
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
        if (AddEditArbitrageChargeConfigScreen.oldProps !== props) {
            AddEditArbitrageChargeConfigScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //Get All Updated Feild of Particular actions
            const { ArbitrageCurrencyList, TransactionTypeList } = props.ArbitrageChargeConfigResult

            // ArbitrageCurrencyList is not null
            if (ArbitrageCurrencyList) {
                try {
                    //if local ArbitrageCurrencyList state is null or its not null and also different then new response then and only then validate response.
                    if (state.ArbitrageCurrencyListState == null || (ArbitrageCurrencyList !== state.ArbitrageCurrencyListState)) {

                        //if  response is success then store array list else store empty list
                        if (validateResponseNew({ response: ArbitrageCurrencyList, isList: true })) {
                            let res = parseArray(ArbitrageCurrencyList.ArbitrageWalletTypeMasters);

                            for (var arbiCurrencyKey in res) {
                                let item = res[arbiCurrencyKey]
                                item.value = item.CoinName
                            }

                            let currencyNames = [
                                { value: R.strings.selectCurrency },
                                ...res
                            ];

                            return { ...state, ArbitrageCurrencyListState: ArbitrageCurrencyList, Currency: currencyNames };
                        } else {
                            return { ...state, ArbitrageCurrencyListState: ArbitrageCurrencyList, Currency: [{ value: R.strings.selectCurrency }] };
                        }
                    }
                } catch (e) {
                    return { ...state, Currency: [{ value: R.strings.selectCurrency }] };
                }
            }

            // TransactionTypeList is not null
            if (TransactionTypeList) {
                try {
                    //if local TransactionTypeList state is null or its not null and also different then new response then and only then validate response.
                    if (state.TransactionTypeListState == null || (TransactionTypeList !== state.TransactionTypeListState)) {

                        //if  response is success then store array list else store empty list
                        if (validateResponseNew({ response: TransactionTypeList, isList: true })) {
                            let res = parseArray(TransactionTypeList.Data)

                            for (var trnTypeKey in res) {
                                let item = res[trnTypeKey]
                                item.value = item.TypeName
                            }

                            let currencyNames = [
                                { value: R.strings.selectTransactionType },
                                ...res
                            ]

                            return { ...state, TransactionTypeListState: TransactionTypeList, TransactionType: currencyNames };
                        } else {
                            return { ...state, TransactionTypeListState: TransactionTypeList, TransactionType: [{ value: R.strings.selectTransactionType }] };
                        }
                    }
                } catch (e) {
                    return { ...state, TransactionType: [{ value: R.strings.selectTransactionType }] };
                }
            }
        }
        return null
    }

    componentDidUpdate(prevProps, _prevState) {

        //Get All Updated field of Particular actions
        const { AddChargeConfigData } = this.props.ArbitrageChargeConfigResult

        // check previous props and existing props
        if (AddChargeConfigData !== prevProps.ArbitrageChargeConfigResult.AddChargeConfigData) {
            // AddChargeConfigData is not null
            if (AddChargeConfigData) {
                try {
                    if (this.state.AddChargeConfigDataState == null || (this.state.AddChargeConfigDataState != null && AddChargeConfigData !== this.state.AddChargeConfigDataState)) {
                        // Handle Response
                        if (validateResponseNew({ response: AddChargeConfigData, })) {

                            this.setState({ AddChargeConfigDataState: AddChargeConfigData })

                            showAlert(R.strings.Success + '!', AddChargeConfigData.ReturnMsg, 0, () => {
                                // Clear Charge Config data
                                this.props.clearArbitrageChargeConfigData()
                                // Navigate to Deposit Route List Screen
                                this.props.navigation.state.params.onRefresh(true)
                                this.props.navigation.goBack()
                            })
                        } else {
                            this.setState({ AddChargeConfigDataState: null })

                            // Clear Charge Config data
                            this.props.clearArbitrageChargeConfigData()
                        }
                    }
                } catch (error) {
                    // Clear Charge Config data
                    this.props.clearArbitrageChargeConfigData()
                    this.setState({ AddChargeConfigDataState: null })
                }
            }
        }
    }

    render() {

        // Loading status for Progress bar which is fetching from reducer
        let { ArbitrageCurrencyLoading, AddChargeConfigLoading } = this.props.ArbitrageChargeConfigResult

        let { isEdit } = this.state
        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={isEdit ? R.strings.updateChrgeConfiguration : R.strings.addChrgeConfiguration}
                    isBack={true}
                    nav={this.props.navigation} />

                {/* For Toast */}
                <CommonToast ref={component => this.toast = component} />

                {/* Progressbar */}
                <ProgressDialog isShow={ArbitrageCurrencyLoading || AddChargeConfigLoading} />

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
                                        onPickerSelect={(item, object) => this.setState({ selectedCurrency: item, WalletTypeId: object.Id })} />
                                    :
                                    <TextCard isRequired={true} title={R.strings.Currency} value={this.state.selectedCurrency} />
                            }

                            {/* Picker for Transaction Type */}

                            {
                                !isEdit ?
                                    <TitlePicker
                                        isRequired={true}
                                        style={{ marginTop: R.dimens.margin }}
                                        title={R.strings.TransactionType}
                                        array={this.state.TransactionType}
                                        selectedValue={this.state.selectedTransType}
                                        onPickerSelect={(item, object) => this.setState({ selectedTransType: item, TrnTypeId: object.TypeId })} />
                                    :
                                    <TextCard isRequired={true} title={R.strings.TransactionType} value={this.state.selectedTransType} />
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
                                onChangeText={(Label) => this.setState({ Remarks: Label })}
                                value={this.state.Remarks}
                            />

                            {/* switch for KYCStatus */}
                            <FeatureSwitch
                                style={{ paddingLeft: R.dimens.LineHeight, paddingRight: R.dimens.widgetMargin }}
                                backgroundColor={'transparent'}
                                title={R.strings.kycCompliant}
                                disabled={isEdit ? true : false}
                                isToggle={this.state.IsKYCEnable}
                                textStyle={{ color: R.colors.textPrimary }}
                                onValueChange={() => {
                                    this.setState({ IsKYCEnable: !this.state.IsKYCEnable })
                                }}
                            />
                        </View>
                    </ScrollView>

                    {/* To Set Submit Button */}
                    <View style={{ paddingRight: R.dimens.activity_margin, paddingLeft: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                        <Button title={isEdit ? R.strings.update : R.strings.add} onPress={this.onSubmitPress}></Button>
                    </View>
                </View>
            </SafeView>
        )
    }

    styles = () => {
        return {
            mainView: {
                paddingRight: R.dimens.activity_margin, paddingLeft: R.dimens.activity_margin,
                paddingBottom: R.dimens.padding_top_bottom_margin,
                paddingTop: R.dimens.padding_top_bottom_margin,
            }
        }
    }
}

const mapStateToProps = (state) => {
    return {
        // get arbitrage charge config data from reducer
        ArbitrageChargeConfigResult: state.ArbitrageChargeConfigReducer,
    }
}

const mapDispatchToProps = (dispatch) => ({
    // Perform Arbitrage Currency List Action
    getArbitrageCurrencyList: (payload) => dispatch(getArbitrageCurrencyList(payload)),
    //Perform  getWalletTransactionType Api Data 
    getWalletTransactionType: () => dispatch(getWalletTransactionType()),
    // Clear Arbitrage Charge Config Action
    clearArbitrageChargeConfigData: () => dispatch(clearArbitrageChargeConfigData()),
    // Perform Arbitrage Add Charge Config
    addArbitrageChargeConfigData: (payload) => dispatch(addArbitrageChargeConfigData(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(AddEditArbitrageChargeConfigScreen)
