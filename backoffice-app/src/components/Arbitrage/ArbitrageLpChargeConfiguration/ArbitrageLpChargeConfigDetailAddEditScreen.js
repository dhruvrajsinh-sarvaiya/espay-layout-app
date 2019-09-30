import {
    View,
    ScrollView,
    Keyboard,
} from 'react-native';
import React from 'react'
import { Component } from 'react';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar'
import EditText from '../../../native_theme/components/EditText'
import CustomToolbar from '../../../native_theme/components/CustomToolbar'
import { connect } from 'react-redux';
import Button from '../../../native_theme/components/Button';
import { isCurrentScreen } from '../../Navigation';
import { isInternet, validateResponseNew, isEmpty } from '../../../validations/CommonValidation';
import { showAlert, changeTheme, parseFloatVal, parseArray } from '../../../controllers/CommonUtils';
import CommonToast from '../../../native_theme/components/CommonToast';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { TitlePicker } from '../../widget/ComboPickerWidget';
import R from '../../../native_theme/R';
import { addEditDeleteLpChargeConfigDetail, clearLpChargeConfigData } from '../../../actions/Arbitrage/ArbitrageLpChargeConfigActions';
import { FeatureSwitch } from '../../../native_theme/components/FeatureSwitch';
import { getArbitrageCurrencyList } from '../../../actions/PairListAction';
import SafeView from '../../../native_theme/components/SafeView';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import RadioButton from '../../../native_theme/components/RadioButton';

//Create Common class for Add Edit ArbitrageLpChargeConfigDetail
class ArbitrageLpChargeConfigDetailAddEditScreen extends Component {

    constructor(props) {
        super(props);

        this.inputs = {};

        //item for edit from List screen 
        let item = props.navigation.state.params && props.navigation.state.params.item

        //item that comes from master screen 
        let MasterItem = props.navigation.state.params && props.navigation.state.params.MasterItem

        //Define All State initial state
        this.state = {
            edit: item ? true : false,
            item: item,
            MasterItem: MasterItem,

            chargeType: item ? (item.ChargeValueType == 1 ? true : false) : true,
            chargeValue: item ? (item.ChargeValue).toString() : '',
            MakerCharge: item ? (item.MakerCharge).toString() : '',
            TakerCharge: item ? (item.TakerCharge).toString() : '',

            currencies: [{ value: R.strings.selectCurrency }],
            selectedCurrency: item ? item.WalletTypeName : R.strings.selectCurrency,
            selectedCurrencyCode: item ? item.DeductionWalletTypeId : R.strings.selectCurrency,

            Remarks: item ? (item.Remarks) : '',

            Status: item ? (item.Status == 1 ? true : false) : false,
            CurrencyConverted: item ? (item.IsCurrencyConverted == 1 ? true : false) : false,
        };

        // create reference
        this.toast = React.createRef();
    }

    async componentDidMount() {

        //Add this method to change theme based on stored theme name.
        changeTheme();

        // Check internet is Available or not
        if (await isInternet()) {
            //To getArbitrageCurrencyList 
            this.props.getArbitrageCurrencyList()
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        // stop twice api call
        return isCurrentScreen(nextProps);
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
        if (ArbitrageLpChargeConfigDetailAddEditScreen.oldProps !== props) {
            ArbitrageLpChargeConfigDetailAddEditScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            const { arbitrageCurrencyData } = props.Listdata;

            if (arbitrageCurrencyData) {
                try {
                    //if local currencyList state is null or its not null and also different then new response then and only then validate response.
                    if (state.arbitrageCurrencyDataState == null || (state.arbitrageCurrencyDataState != null && arbitrageCurrencyData !== state.arbitrageCurrencyDataState)) {

                        //if currencyList response is success then store array list else store empty list
                        if (validateResponseNew({ response: arbitrageCurrencyData, isList: true })) {
                            let res = parseArray(arbitrageCurrencyData.ArbitrageWalletTypeMasters);

                            //for add pairCurrencyList
                            for (var coinNameKey in res) {
                                let item = res[coinNameKey];
                                item.value = item.CoinName;
                            }

                            let currencies = [
                                { value: R.strings.selectCurrency }, ...res
                            ]

                            return { ...state, currencies, arbitrageCurrencyDataState: arbitrageCurrencyData };
                        } else {
                            return { ...state, currencies: [{ value: R.strings.selectCurrency }], arbitrageCurrencyDataState: arbitrageCurrencyData };
                        }
                    }
                } catch (e) {
                    return { ...state, currencies: [{ value: R.strings.selectCurrency }] };
                }
            }
        }
        return null;
    }

    componentDidUpdate = async (prevProps, prevState) => {

        //Get All Updated field of Particular actions
        const { lpChargeConfigDetailAddEditDeleteData } = this.props.Listdata;

        // check previous props and existing props
        if (lpChargeConfigDetailAddEditDeleteData !== prevProps.Listdata.lpChargeConfigDetailAddEditDeleteData) {
            // for show responce Update or Add
            if (lpChargeConfigDetailAddEditDeleteData) {
                try {
                    // If response lpChargeConfigDetail add ,edit than show success dialog else failure dialog
                    if (validateResponseNew({
                        response: lpChargeConfigDetailAddEditDeleteData,
                    })) {
                        showAlert(R.strings.Success, lpChargeConfigDetailAddEditDeleteData.ReturnMsg, 0, () => {
                            //clear data
                            this.props.clearLpChargeConfigData()
                            this.props.navigation.state.params.onSuccess() // if add success call list method from back screen
                            this.props.navigation.goBack()
                        });
                    } else {
                        //clear data
                        this.props.clearLpChargeConfigData()
                    }
                } catch (e) {
                    //clear data
                    this.props.clearLpChargeConfigData()
                }
            }
        }
    }

    //Add Or Update Button Presss
    onPress = async () => {

        //validations for Inputs 
        if (this.state.selectedCurrency === R.strings.selectCurrency) {
            this.toast.Show(R.strings.selectCurrency)
            return;
        }
        if (isEmpty(this.state.chargeValue)) {
            this.toast.Show(R.strings.enterChargeValue)
            return;
        }
        if (isEmpty(this.state.MakerCharge)) {
            this.toast.Show(R.strings.enter + ' ' + R.strings.maker + ' ' + R.strings.Charge)
            return;
        }
        if (isEmpty(this.state.TakerCharge)) {
            this.toast.Show(R.strings.enter + ' ' + R.strings.Taker + ' ' + R.strings.Charge)
            return;
        }
        if (isEmpty(this.state.Remarks)) {
            this.toast.Show(R.strings.enter + ' ' + R.strings.remarks)
            return;
        }

        Keyboard.dismiss();

        // Check internet is Available or not
        if (await isInternet()) {

            //calladdEditDeleteLpChargeConfigDetail for add or update api
            this.props.addEditDeleteLpChargeConfigDetail({
                Id: parseFloatVal(this.state.edit ? this.state.item.ChargeConfigDetailId : 0), //if edit than pass id for insert 0 fixed
                Status: parseFloatVal(this.state.Status == true ? 1 : 0),
                IsCurrencyConverted: parseFloatVal(this.state.CurrencyConverted == true ? 1 : 0),
                ChargeValue: parseFloatVal(this.state.chargeValue),
                Remarks: this.state.Remarks,
                DeductionWalletTypeId: parseFloatVal(this.state.selectedCurrencyCode),
                MakerCharge: parseFloatVal(this.state.MakerCharge),
                TakerCharge: parseFloatVal(this.state.TakerCharge),
                ChargeType: parseFloatVal(this.state.chargeType === true ? 1 : 2),
                ChargeConfigurationMasterID: parseFloatVal(this.state.MasterItem.Id),
                ChargeDistributionBasedOn: parseFloatVal(1),//fix 1
                ChargeValueType: parseFloatVal(this.state.chargeType === true ? 1 : 2),
            })
        }
    }

    //this Method is used to focus on next feild
    focusNextField(id) {
        this.inputs[id].focus();
    }

    render() {

        // Loading status for Progress bar which is fetching from reducer
        const { lpChargeConfigDetailAddEditDeleteFetching } = this.props.Listdata;

        return (

            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                {/* To Set Status Bas as per out theme */}
                <CommonStatusBar />

                {/* To Set ToolBar as per out theme */}
                <CustomToolbar
                    title={this.state.edit ? (R.strings.updateLPChargeConfiguration + ' ' + R.strings.detail) : (R.strings.addLPChargeConfiguration + ' ' + R.strings.detail)}
                    isBack={true}
                    nav={this.props.navigation}
                />

                {/* Progress Dialog */}
                <ProgressDialog isShow={lpChargeConfigDetailAddEditDeleteFetching} />

                {/* For Toast */}
                <CommonToast ref={component => this.toast = component} />

                {/* Toggle Button For Status Enable/Disable Functionality */}
                <FeatureSwitch
                    title={this.state.Status ? R.strings.Enable : R.strings.Disable}
                    isGradient={true}
                    isToggle={this.state.Status}
                    onValueChange={() => {
                        this.setState({
                            Status: !this.state.Status
                        })
                    }}
                />

                <View style={{
                    flex: 1,
                    justifyContent: 'space-between',
                }}>
                    <ScrollView keyboardShouldPersistTaps='always' showsVerticalScrollIndicator={false}>
                        <View style={{
                            paddingRight: R.dimens.activity_margin,
                            paddingLeft: R.dimens.activity_margin,
                            paddingTop: R.dimens.padding_top_bottom_margin,
                            paddingBottom: R.dimens.padding_top_bottom_margin,
                        }}>
                            {/* Picker for deductionWalletType */}
                            <TitlePicker
                                title={R.strings.Currency}
                                array={this.state.currencies}
                                selectedValue={this.state.selectedCurrency}
                                onPickerSelect={(item, object) => this.setState({ selectedCurrency: item, selectedCurrencyCode: object.Id })} />

                            {/* To Set Charge Value in EditText */}
                            <EditText
                                isRequired={true}
                                reference={input => { this.inputs['etChargeValue'] = input; }}
                                placeholder={R.strings.chargeValue}
                                header={R.strings.chargeValue}
                                maxLength={5}
                                multiline={false}
                                keyboardType='numeric'
                                returnKeyType={"next"}
                                blurOnSubmit={false}
                                onSubmitEditing={() => { this.focusNextField('etMakerCharge') }}
                                onChangeText={(chargeValue) => this.setState({ chargeValue })}
                                value={this.state.chargeValue}
                                validate={true}
                            />

                            {/* To Set Charge Type */}
                            <TextViewMR style={this.styles().radioButtonTitle}>{R.strings.ChargeType}</TextViewMR>
                            <View style={{ marginLeft: R.dimens.LineHeight, flexDirection: 'row', marginTop: R.dimens.widgetMargin }}>
                                <RadioButton
                                    item={{ title: R.strings.Percentage, selected: !this.state.chargeType }}
                                    onPress={() => this.setState({ chargeType: !this.state.chargeType })} />

                                <RadioButton
                                    item={{ title: R.strings.Fixed, selected: this.state.chargeType }}
                                    onPress={() => this.setState({ chargeType: !this.state.chargeType })} />
                            </View>

                            {/* For Charge Range */}
                            <TextViewMR style={{ fontSize: R.dimens.smallText, marginLeft: R.dimens.LineHeight, marginTop: R.dimens.widget_top_bottom_margin, color: R.colors.textPrimary }}>{R.strings.Charge}</TextViewMR>
                            <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', marginTop: R.dimens.widgetMargin }}>
                                {/* To Set eTakerCharge in EditText */}
                                <EditText
                                    style={{ flex: 1, marginTop: 0, marginRight: R.dimens.widgetMargin, }}
                                    isRequired={true}
                                    multiline={false}
                                    reference={input => { this.inputs['etMakerCharge'] = input; }}
                                    placeholder={R.strings.Maker_Charges}
                                    maxLength={10}
                                    keyboardType='numeric'
                                    returnKeyType={"next"}
                                    blurOnSubmit={false}
                                    onSubmitEditing={() => { this.focusNextField('etTakerCharge') }}
                                    onChangeText={(MakerCharge) => this.setState({ MakerCharge })}
                                    validate={true}
                                    value={this.state.MakerCharge}
                                />

                                {/* To Set Weeks in EditText */}
                                <EditText
                                    isRequired={true}
                                    style={{ flex: 1, marginTop: 0, marginLeft: R.dimens.widgetMargin, }}
                                    reference={input => { this.inputs['etTakerCharge'] = input; }}
                                    placeholder={R.strings.Taker_Charges}
                                    returnKeyType={"next"}
                                    maxLength={10}
                                    multiline={false}
                                    keyboardType='numeric'
                                    blurOnSubmit={false}
                                    onSubmitEditing={() => { this.focusNextField('etRemarks') }}
                                    onChangeText={(TakerCharge) => this.setState({ TakerCharge })}
                                    value={this.state.TakerCharge}
                                    validate={true}
                                />
                            </View>

                            {/* To Set Remarks in EditText */}
                            <EditText
                                isRequired={true}
                                reference={input => { this.inputs['etRemarks'] = input; }}
                                header={R.strings.remarks}
                                placeholder={R.strings.remarks}
                                multiline={true}
                                numberOfLines={4}
                                keyboardType='default'
                                textAlignVertical={'top'}
                                returnKeyType={"done"}
                                blurOnSubmit={true}
                                maxLength={300}
                                onChangeText={(Label) => this.setState({ Remarks: Label })}
                                value={this.state.Remarks}
                            />

                            {/* switch for CurrencyConverted */}
                            <FeatureSwitch
                                backgroundColor={'transparent'}
                                title={R.strings.currencyConverted}
                                style={{ paddingLeft: R.dimens.LineHeight, paddingRight: R.dimens.widgetMargin }}
                                isToggle={this.state.CurrencyConverted}
                                textStyle={{ color: R.colors.textPrimary }}
                                onValueChange={() => {
                                    this.setState({ CurrencyConverted: !this.state.CurrencyConverted })
                                }}
                            />
                        </View>
                    </ScrollView>
                    <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                        {/* To Set Add or Edit Button */}
                        <Button title={this.state.edit ? R.strings.update : R.strings.Add} onPress={() => this.onPress()}></Button>
                    </View>
                </View>
            </SafeView>
        );
    }

    styles = () => {
        return {
            radioButtonTitle: {
                marginLeft: R.dimens.LineHeight,
                fontSize: R.dimens.smallText,
                marginTop: R.dimens.widget_top_bottom_margin,
                color: R.colors.textPrimary
            }
        }
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
        //for add  api data
        addEditDeleteLpChargeConfigDetail: (Request) => dispatch(addEditDeleteLpChargeConfigDetail(Request)),
        //for add edit data clear
        clearLpChargeConfigData: () => dispatch(clearLpChargeConfigData()),
        //for getArbitrageCurrencyList list action 
        getArbitrageCurrencyList: () => dispatch(getArbitrageCurrencyList()),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ArbitrageLpChargeConfigDetailAddEditScreen)