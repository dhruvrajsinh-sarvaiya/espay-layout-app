import React, { Component } from 'react'
import { View, ScrollView, } from 'react-native'
import SafeView from '../../../native_theme/components/SafeView';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import R from '../../../native_theme/R';
import { changeTheme, parseIntVal, showAlert, parseArray } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../Navigation';
import { FeatureSwitch } from '../../../native_theme/components/FeatureSwitch';
import { TitlePicker } from '../../widget/ComboPickerWidget';
import Button from '../../../native_theme/components/Button';
import { getWalletType } from '../../../actions/PairListAction';
import { clearLeverageConfigData, addLeverageConfigData } from '../../../actions/Margin/LeverageConfigActions';
import { isInternet, isEmpty, validateResponseNew } from '../../../validations/CommonValidation';
import { connect } from 'react-redux';
import EditText from '../../../native_theme/components/EditText';
import CommonToast from '../../../native_theme/components/CommonToast';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';

export class AddEditLeverageConfigScreen extends Component {
    constructor(props) {
        super(props)

        let { item, Currency } = props.navigation.state.params

        // Define all initial state
        this.state = {
            item: item !== undefined ? item : {},
            Id: item !== undefined ? item.Id : 0,
            isEdit: item !== undefined ? true : false,
            Status: item !== undefined ? (item.Status == 1 ? true : false) : false,
            AutoApprove: item !== undefined ? (item.IsAutoApprove == 1 ? true : false) : false,
            isFirstTime: true,

            Currency: Currency !== undefined ? Currency : [],
            DeductionType: [
                { value: R.strings.selectDeductionType },
                { ID: 0, value: R.strings.trandingToMargin },
                { ID: 1, value: R.strings.endOfDay },
                { ID: 2, value: R.strings.marginToTradingWallet },
                { ID: 3, value: R.strings.endOfDayMarginToTradingWallet },
                { ID: 4, value: R.strings.endOfDayTradingToMarginWallet },
            ],
            Leverage: [
                { ID: 1, value: '1X' },
                { ID: 2, value: '2X' },
                { ID: 3, value: '3X' },
                { ID: 4, value: '4X' },
                { ID: 5, value: '5X' },
                { ID: 6, value: '6X' },
                { ID: 7, value: '7X' },
                { ID: 8, value: '8X' },
                { ID: 9, value: '9X' },
                { ID: 10, value: '10X' },
            ],
            selectedCurrency: item !== undefined ? item.WalletTypeName : R.strings.selectCurrency,
            selectedLeverage: '1X',
            selectedDeductionType: R.strings.selectDeductionType,

            WalletTypeId: item !== undefined ? item.WalletTypeId : 0,
            DeductionTypeId: 0,
            SafetyMargin: item !== undefined ? item.SafetyMarginPer.toString() : '',
            MarginCharge: item !== undefined ? item.MarginChargePer.toString() : '',
        }

        this.inputs = {}

        // Create Reference
        this.toast = React.createRef()

    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        // Check edit screen or add screen
        if (this.state.isEdit) {

            // Getting selected leverage and deductionType
            let levrage = '', deductiontype = ''
            this.state.Leverage.map((item) => {
                if (item.ID == this.state.item.LeveragePer)
                    levrage = item.value
            })

            this.state.DeductionType.map((item) => {
                if (item.ID == this.state.item.LeverageChargeDeductionType)
                    deductiontype = item.value
            })
            this.setState({ selectedLeverage: levrage, selectedDeductionType: deductiontype })
        }

        // check internet connection
        if (await isInternet()) {
            if (this.state.Currency.length == 0) {

                // Call Wallet Data Api
                this.props.getWalletType()
            }
        }
    }

    shouldComponentUpdate = (nextProps, _nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps)
    }

    //this Method is used to focus on next feild
    focusNextField(id) {
        this.inputs[id].focus();
    }

    onSubmitPress = async () => {
        // Check validation
        if (this.state.selectedCurrency === R.strings.selectCurrency)
            this.toast.Show(R.strings.selectCurrency)
        else if (this.state.selectedDeductionType === R.strings.selectDeductionType)
            this.toast.Show(R.strings.selectDeductionType)
        else if (isEmpty(this.state.SafetyMargin))
            this.toast.Show(R.strings.enterSafetyMargin)
        else if (parseIntVal(this.state.SafetyMargin) > parseIntVal(this.state.selectedLeverage))
            this.toast.Show(R.strings.safetyMarginValidation)
        else if (isEmpty(this.state.MarginCharge))
            this.toast.Show(R.strings.enterMarginCharge)
        else {
            // check internet connection
            if (await isInternet()) {
                let req = {
                    Id: this.state.Id,
                    WalletTypeId: this.state.WalletTypeId,
                    LeveragePer: parseIntVal(this.state.selectedLeverage),
                    Status: this.state.Status == true ? 1 : 0,
                    IsAutoApprove: this.state.AutoApprove == true ? 1 : 0,
                    SafetyMarginPer: parseIntVal(this.state.SafetyMargin),
                    MarginChargePer: parseIntVal(this.state.MarginCharge),
                    LeverageChargeDeductionType: this.state.DeductionTypeId,
                    InstantChargePer: 0,
                }

                // Call Add/Edit Levarge Configuration Api
                this.props.addLeverageConfigData(req)
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
        if (AddEditLeverageConfigScreen.oldProps !== props) {
            AddEditLeverageConfigScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //Get All Updated Feild of Particular actions
            const { WalletDataList } = props.LeverageConfigResult;

            // WalletDataList is not null
            if (WalletDataList) {
                try {
                    //if local WalletDataList state is null or its not null and also different then new response then and only then validate response.
                    if (state.WalletDataList == null || (state.WalletDataList != null && WalletDataList !== state.WalletDataList)) {

                        //if  response is success then store array list else store empty list
                        if (validateResponseNew({ response: WalletDataList, isList: true })) {

                            // Parsing data
                            let res = parseArray(WalletDataList.Types);

                            // Fetching only TypeName from whole data
                            for (var walletListKey in res) {
                                let item = res[walletListKey];
                                item.value = item.TypeName;
                            }

                            let walletNames = 
                            [
                                { value: R.strings.selectCurrency },
                                ...res
                            ];

                            return { ...state, WalletDataList, 
                                Currency: walletNames };
                        } else {
                            return { ...state, 
                                WalletDataList, 
                                Currency: [{ value: R.strings.selectCurrency }] };
                        }
                    }
                } catch (e) 
                {
                    return { ...state, 
                        Currency: [{ value: R.strings.selectCurrency }] };
                }
            }

        }
        return null
    }

    componentDidUpdate(prevProps, _prevState) {
        //Get All Updated field of Particular actions
        const { AddLeverageConfigData } = this.props.LeverageConfigResult

        // check previous props and existing props
        if (AddLeverageConfigData !== prevProps.LeverageConfigResult.AddLeverageConfigData) {
            // AddLeverageConfigData is not null
            if (AddLeverageConfigData) {
                try {
                    if (this.state.AddLeverageConfigData == null || (this.state.AddLeverageConfigData != null && AddLeverageConfigData !== this.state.AddLeverageConfigData)) {
                        // Handle Response
                        if (validateResponseNew({ response: AddLeverageConfigData })) {

                            this.setState({ AddLeverageConfigData })

                            showAlert(R.strings.Success + '!', AddLeverageConfigData.ReturnMsg, 0, () => {
                                // Clear leverage configuration data
                                this.props.clearLeverageConfigData()
                                // Navigate to Deposit Route List Screen
                                this.props.navigation.state.params.onRefresh(true)
                                this.props.navigation.goBack()
                            })
                        } else {
                            this.setState({ AddLeverageConfigData: null })
                            // Clear leverage configuration data
                            this.props.clearLeverageConfigData()
                        }
                    }
                } catch (error) {
                    // Clear leverage configuration data
                    this.props.clearLeverageConfigData()
                    this.setState({ AddLeverageConfigData: null })
                }
            }
        }
    }

    render() {
        let { isEdit } = this.state
        // Loading status for Progress bar which is fetching from reducer
        const { AddLeverageConfigLoading } = this.props.LeverageConfigResult

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={isEdit ? R.strings.updateLeverage : R.strings.addNewLeverage}
                    isBack={true}
                    onBackPress={this.onBackPress}
                    nav={this.props.navigation} />

                {/* Custom Toast */}
                <CommonToast ref={cmpToast => this.toast = cmpToast} />

                {/* Progressbar */}
                <ProgressDialog isShow={AddLeverageConfigLoading} />

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
                            <TitlePicker
                                isRequired={true}
                                title={R.strings.Currency}
                                array={this.state.Currency}
                                selectedValue={this.state.selectedCurrency}
                                onPickerSelect={(item, object) => this.setState({ selectedCurrency: item, WalletTypeId: object.ID })} />

                            {/* Picker for Deduction Type */}
                            <TitlePicker
                                style={{ marginTop: R.dimens.margin }}
                                isRequired={true}
                                title={R.strings.deductionType}
                                array={this.state.DeductionType}
                                selectedValue={this.state.selectedDeductionType}
                                onPickerSelect={(item, object) => this.setState({ selectedDeductionType: item, DeductionTypeId: object.ID })} />

                            {/* Picker for Leverage */}
                            <TitlePicker
                                style={{ marginTop: R.dimens.margin }}
                                isRequired={true}
                                title={R.strings.leverage}
                                array={this.state.Leverage}
                                selectedValue={this.state.selectedLeverage}
                                onPickerSelect={(item) => this.setState({ selectedLeverage: item })} />

                            {/* To Set Safety Margin in EditText */}
                            <EditText
                                isRequired={true}
                                reference={input => { this.inputs['etSafetyMargin'] = input; }}
                                header={R.strings.safetyMargin + '(%)'}
                                placeholder={R.strings.safetyMargin + '(%)'}
                                multiline={false}
                                maxLength={5}
                                keyboardType='numeric'
                                returnKeyType={"next"}
                                blurOnSubmit={false}
                                onSubmitEditing={() => { this.focusNextField('etMarginCharge') }}
                                onChangeText={(SafetyMargin) => this.setState({ SafetyMargin })}
                                value={this.state.SafetyMargin}
                                validate={true}
                                onlyDigit={true}
                            />

                            {/* To Set Margin Charge in EditText */}
                            <EditText
                                isRequired={true}
                                reference={input => { this.inputs['etMarginCharge'] = input; }}
                                header={R.strings.marginCharge + '(%)'}
                                placeholder={R.strings.marginCharge + '(%)'}
                                multiline={false}
                                maxLength={5}
                                keyboardType='numeric'
                                returnKeyType={"done"}
                                onChangeText={(MarginCharge) => this.setState({ MarginCharge })}
                                value={this.state.MarginCharge}
                                validate={true}
                                onlyDigit={true}
                            />

                            {/* Auto Approve */}
                            <FeatureSwitch
                                backgroundColor={'transparent'}
                                style={{ paddingLeft: R.dimens.LineHeight, paddingRight: R.dimens.widgetMargin, }}
                                textStyle={{ color: R.colors.textPrimary }}
                                title={R.strings.autoApprove}
                                isToggle={this.state.AutoApprove}
                                onValueChange={() => this.setState({ AutoApprove: !this.state.AutoApprove })}
                            />

                        </View>
                    </ScrollView>

                    <View 
                    style={{ 
                        paddingLeft: R.dimens.activity_margin, 
                        paddingRight: R.dimens.activity_margin,  paddingBottom: R.dimens.widget_top_bottom_margin, 
                        paddingTop: R.dimens.widget_top_bottom_margin }}>
                        {/* To Set Submit Button */}
                        <Button title={isEdit ? R.strings.update : R.strings.add} onPress={this.onSubmitPress}></Button>
                    </View>
                </View>
            </SafeView>
        )
    }

    // Common style
    styles = () => {
        return {
            mainView: 
            {
                paddingBottom: R.dimens.padding_top_bottom_margin,
                paddingRight: R.dimens.activity_margin,
                paddingTop: R.dimens.padding_top_bottom_margin,
                paddingLeft: R.dimens.activity_margin,
            }
        }
    }
}

const mapStateToProps = (state) => {
    return {
        // leverage config data from reducer
        LeverageConfigResult: state.LeverageConfigReducer,
    }
};

const mapDispatchToProps = (dispatch) => ({
    // Perform Wallet Data Action
    getWalletType: () => dispatch(getWalletType()),
    // Perform Clear Leverage Config Data
    clearLeverageConfigData: () => dispatch(clearLeverageConfigData()),
    // Perform Add Leverage Config Data
    addLeverageConfigData: (payload) => dispatch(addLeverageConfigData(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddEditLeverageConfigScreen);