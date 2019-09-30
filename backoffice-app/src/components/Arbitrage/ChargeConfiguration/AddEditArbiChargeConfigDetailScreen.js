import React, { Component } from 'react'
import { View, ScrollView } from 'react-native'
import { changeTheme, showAlert, parseFloatVal, parseIntVal } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../Navigation';
import SafeView from '../../../native_theme/components/SafeView';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import R from '../../../native_theme/R';
import { getArbitrageCurrencyList } from '../../../actions/PairListAction';
import { clearArbitrageChargeConfigData, addArbiChargeConfigDetail, updateArbiChargeConfigDetail } from '../../../actions/Arbitrage/ArbitrageChargeConfigActions';
import { FeatureSwitch } from '../../../native_theme/components/FeatureSwitch';
import EditText from '../../../native_theme/components/EditText';
import { connect } from 'react-redux';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import Button from '../../../native_theme/components/Button';
import { isEmpty, isInternet, validateResponseNew } from '../../../validations/CommonValidation';
import CommonToast from '../../../native_theme/components/CommonToast';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import TextCard from '../../../native_theme/components/TextCard';

export class AddEditArbiChargeConfigDetailScreen extends Component {
    constructor(props) {
        super(props)

        // getting response from previous screen
        let item = props.navigation.state.params && props.navigation.state.params.item
        let CurrencyName = props.navigation.state.params && props.navigation.state.params.CurrencyName
        let WalletTypeId = props.navigation.state.params && props.navigation.state.params.WalletTypeId
        let MasterId = props.navigation.state.params && props.navigation.state.params.MasterId

        // Define all initial state
        this.state = {
            AddChargeConfigDetailState: null,
            UpdateChargeConfigDetailState: null,

            DetailId: item ? item.ChargeConfigDetailId : 0,
            ChargeIn: item ? item.ChargeValueType : 2,
            ChargeType: item ? item.ChargeType : 1,
            MasterId: MasterId ? MasterId : 0,
            WalletTypeId: WalletTypeId ? WalletTypeId : 0,

            ChargeValue: item ? item.ChargeValue.toString() : '',
            MakerCharge: item ? item.MakerCharge.toString() : '',
            TakerCharge: item ? item.TakerCharge.toString() : '',
            MinAmount: item ? item.MinAmount.toString() : '',
            MaxAmount: item ? item.MaxAmount.toString() : '',
            Remarks: item ? item.Remarks : '',

            selectedCurrency: CurrencyName ? CurrencyName : R.strings.selectCurrency,
            isEdit: item ? true : false,
            Status: item ? (item.Status == 1 ? true : false) : false,
        }

        this.inputs = {}
        // create reference
        this.toast = React.createRef();
    }

    async componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme()
    }

    shouldComponentUpdate(nextProps, _nextState) {
        //stop twice api call
        return isCurrentScreen(nextProps)
    }

    //this Method is used to focus on next feild
    focusNextField(id) {
        this.inputs[id].focus();
    }

    // Check validation and call api when user click on add/edit button
    onSubmitPress = async () => {
        if (isEmpty(this.state.ChargeValue))
            this.toast.Show(R.strings.enterChargeValue)
        else if (isEmpty(this.state.MakerCharge))
            this.toast.Show(R.strings.MakerCharge_Validation)
        else if (isEmpty(this.state.TakerCharge))
            this.toast.Show(R.strings.TakerCharge_Validation)
        else if (isEmpty(this.state.MinAmount))
            this.toast.Show(R.strings.enterMinAmount)
        else if (isEmpty(this.state.MaxAmount))
            this.toast.Show(R.strings.enterMaxAmount)
        else if (parseFloatVal(this.state.MinAmount) > parseFloatVal(this.state.MaxAmount))
            this.toast.Show(R.strings.MinMaxAmount_Validation)
        else if (isEmpty(this.state.Remarks))
            this.toast.Show(R.strings.enterRemarks)
        else {
            // check internet connection
            if (await isInternet()) {

                let request = {
                    ChargeConfigDetailId: this.state.DetailId,
                    ChargeConfigurationMasterID: this.state.MasterId,
                    ChargeDistributionBasedOn: 1,
                    ChargeType: this.state.ChargeType,
                    DeductionWalletTypeId: this.state.WalletTypeId,
                    ChargeValue: parseIntVal(this.state.ChargeValue),
                    ChargeValueType: parseIntVal(this.state.ChargeIn),
                    MakerCharge: parseFloatVal(this.state.MakerCharge),
                    TakerCharge: parseFloatVal(this.state.TakerCharge),
                    MinAmount: parseFloatVal(this.state.MinAmount),
                    MaxAmount: parseFloatVal(this.state.MaxAmount),
                    Remarks: this.state.Remarks,
                    Status: this.state.Status ? 1 : 0
                }

                if (this.state.isEdit) {
                    // Update Arbitrage Charge Config Detail Api Call
                    this.props.updateArbiChargeConfigDetail(request)
                } else {
                    // Add Arbitrage Charge Config Detail Api Call
                    this.props.addArbiChargeConfigDetail(request)
                }
            }
        }
    }

    componentDidUpdate(prevProps, _prevState) {

        //Get All Updated field of Particular actions
        const { AddChargeConfigDetail, UpdateChargeConfigDetail } = this.props.ArbitrageChargeConfigResult

        // check previous props and existing props
        if (AddChargeConfigDetail !== prevProps.ArbitrageChargeConfigResult.AddChargeConfigDetail) {
            // AddChargeConfigDetail is not null
            if (AddChargeConfigDetail) {
                try {
                    if (this.state.AddChargeConfigDetailState == null || (this.state.AddChargeConfigDetailState != null && AddChargeConfigDetail !== this.state.AddChargeConfigDetailState)) {
                        // Handle Response
                        if (validateResponseNew({ response: AddChargeConfigDetail, })) {

                            this.setState({ AddChargeConfigDetailState: AddChargeConfigDetail })

                            showAlert(R.strings.Success + '!', AddChargeConfigDetail.ReturnMsg, 0, () => {
                                // Clear Charge Config data
                                this.props.clearArbitrageChargeConfigData()
                                // Navigate to Deposit Route List Screen
                                this.props.navigation.state.params.onRefresh(true)
                                this.props.navigation.goBack()
                            })
                        } else {
                            this.setState({ AddChargeConfigDetailState: null })
                            // Clear Charge Config data
                            this.props.clearArbitrageChargeConfigData()
                        }
                    }
                } catch (error) {
                    // Clear Charge Config data
                    this.props.clearArbitrageChargeConfigData()
                    this.setState({ AddChargeConfigDetailState: null })
                }
            }
        }

        // check previous props and existing props
        if (UpdateChargeConfigDetail !== prevProps.ArbitrageChargeConfigResult.UpdateChargeConfigDetail) {
            // UpdateChargeConfigDetail is not null
            if (UpdateChargeConfigDetail) {
                try {
                    if (this.state.UpdateChargeConfigDetailState == null || (this.state.UpdateChargeConfigDetailState != null && UpdateChargeConfigDetail !== this.state.UpdateChargeConfigDetailState)) {
                        // Handle Response
                        if (validateResponseNew({ response: UpdateChargeConfigDetail, })) {

                            this.setState({ UpdateChargeConfigDetailState: UpdateChargeConfigDetail })

                            showAlert(R.strings.Success + '!', UpdateChargeConfigDetail.ReturnMsg, 0, () => {
                                // Clear Charge Config data
                                this.props.clearArbitrageChargeConfigData()
                                // Navigate to Deposit Route List Screen
                                this.props.navigation.state.params.onRefresh(true)
                                this.props.navigation.goBack()
                            })
                        } else {
                            this.setState({ UpdateChargeConfigDetailState: null })
                            // Clear Charge Config data
                            this.props.clearArbitrageChargeConfigData()
                        }
                    }
                } catch (error) {
                    // Clear Charge Config data
                    this.props.clearArbitrageChargeConfigData()
                    this.setState({ UpdateChargeConfigDetailState: null })
                }
            }
        }
    }

    render() {

        // Loading status for Progress bar which is fetching from reducer
        let { AddChargeConfigDetailLoading, UpdateChargeConfigDetailLoading } = this.props.ArbitrageChargeConfigResult

        let { isEdit } = this.state
        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={isEdit ? R.strings.updateChargeConfigDetail : R.strings.addChargeConfigDetail}
                    isBack={true}
                    nav={this.props.navigation} />

                {/* For Toast */}
                <CommonToast ref={component => this.toast = component} />

                {/* For Progressbar */}
                <ProgressDialog isShow={AddChargeConfigDetailLoading || UpdateChargeConfigDetailLoading} />

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

                            {/* Text for Currency */}
                            <TextCard title={R.strings.Currency} value={this.state.selectedCurrency} />

                            {/* To Set Charge Value in EditText */}
                            <EditText
                                isRequired={true}
                                reference={input => { this.inputs['etChargeValue'] = input; }}
                                header={R.strings.chargeValue}
                                placeholder={R.strings.chargeValue}
                                multiline={false}
                                maxLength={5}
                                keyboardType='numeric'
                                returnKeyType={"next"}
                                blurOnSubmit={false}
                                onSubmitEditing={() => { this.focusNextField('etMakerCharge') }}
                                onChangeText={(ChargeValue) => this.setState({ ChargeValue })}
                                value={this.state.ChargeValue}
                                validate={true}
                            />

                            {/* To Set Charge Type */}
                            <TextViewMR style={this.styles().radioButtonTitle}>{R.strings.ChargeType}</TextViewMR>
                            <View style={{ marginLeft: R.dimens.LineHeight, flexDirection: 'row', marginTop: R.dimens.widgetMargin }}>
                                {this.renderRadioButton({
                                    index: 0,
                                    item: { title: R.strings.recurring, selected: this.state.ChargeType == 2 },
                                    onPress: () => this.setState({ ChargeType: 2 })
                                })}
                                {this.renderRadioButton({
                                    index: 1,
                                    item: { title: R.strings.regular, selected: this.state.ChargeType == 1 },
                                    onPress: () => this.setState({ ChargeType: 1 })
                                })}
                            </View>

                            {/* To Set Charge Type */}
                            <TextViewMR style={this.styles().radioButtonTitle}>{R.strings.chargeIn}</TextViewMR>
                            <View style={{ marginLeft: R.dimens.LineHeight, flexDirection: 'row', marginTop: R.dimens.widgetMargin }}>
                                {this.renderRadioButton({
                                    index: 0,
                                    item: { title: R.strings.Percentage, selected: this.state.ChargeIn == 2 },
                                    onPress: () => this.setState({ ChargeIn: 2 })
                                })}
                                {this.renderRadioButton({
                                    index: 1,
                                    item: { title: R.strings.Fixed, selected: this.state.ChargeIn == 1 },
                                    onPress: () => this.setState({ ChargeIn: 1 })
                                })}
                            </View>

                            {/* For Amount Range */}
                            <TextViewMR style={{ marginLeft: R.dimens.LineHeight, fontSize: R.dimens.smallText, marginTop: R.dimens.widget_top_bottom_margin, color: R.colors.textPrimary }}>{R.strings.Charge}</TextViewMR>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: R.dimens.widgetMargin }}>
                                {/* To Set Months in EditText */}
                                <EditText
                                    isRequired={true}
                                    style={{ flex: 1, marginTop: 0, marginRight: R.dimens.widgetMargin, }}
                                    reference={input => { this.inputs['etMakerCharge'] = input; }}
                                    placeholder={R.strings.Maker_Charges}
                                    multiline={false}
                                    maxLength={10}
                                    keyboardType='numeric'
                                    returnKeyType={"next"}
                                    blurOnSubmit={false}
                                    onSubmitEditing={() => { this.focusNextField('etTakerCharge') }}
                                    onChangeText={(MakerCharge) => this.setState({ MakerCharge })}
                                    value={this.state.MakerCharge}
                                    validate={true}
                                />

                                {/* To Set Weeks in EditText */}
                                <EditText
                                    isRequired={true}
                                    style={{ flex: 1, marginTop: 0, marginLeft: R.dimens.widgetMargin, }}
                                    reference={input => { this.inputs['etTakerCharge'] = input; }}
                                    value={this.state.TakerCharge}
                                    validate={true}
                                    placeholder={R.strings.Taker_Charges}
                                    returnKeyType={"next"}
                                    blurOnSubmit={false}
                                    onSubmitEditing={() => { this.focusNextField('etMinAmount') }}
                                    multiline={false}
                                    maxLength={10}
                                    keyboardType='numeric'
                                    onChangeText={(TakerCharge) => this.setState({ TakerCharge })}
                                />
                            </View>

                            {/* For amount Range */}
                            <TextViewMR style={{ marginLeft: R.dimens.LineHeight, fontSize: R.dimens.smallText, marginTop: R.dimens.widget_top_bottom_margin, color: R.colors.textPrimary }}>{R.strings.Amount}</TextViewMR>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: R.dimens.widgetMargin }}>
                                {/* To Set Min Amount in EditText */}
                                <EditText
                                    value={this.state.MinAmount}
                                    isRequired={true}
                                    placeholder={R.strings.minAmount}
                                    returnKeyType={"next"}
                                    onChangeText={(MinAmount) => this.setState({ MinAmount })}
                                    reference={input => { this.inputs['etMinAmount'] = input; }}
                                    multiline={false}
                                    maxLength={10}
                                    keyboardType='numeric'
                                    blurOnSubmit={false}
                                    onSubmitEditing={() => { this.focusNextField('etMaxAmount') }}
                                    style={{ flex: 1, marginTop: 0, marginRight: R.dimens.widgetMargin, }}
                                    validate={true}
                                />

                                {/* To Set Max Amount in EditText */}
                                <EditText
                                    isRequired={true}
                                    style={{ flex: 1, marginTop: 0, marginLeft: R.dimens.widgetMargin, }}
                                    reference={input => { this.inputs['etMaxAmount'] = input; }}
                                    placeholder={R.strings.maxAmount}
                                    multiline={false}
                                    maxLength={10}
                                    keyboardType='numeric'
                                    returnKeyType={"next"}
                                    blurOnSubmit={false}
                                    onSubmitEditing={() => { this.focusNextField('etRemarks') }}
                                    onChangeText={(MaxAmount) => this.setState({ MaxAmount })}
                                    value={this.state.MaxAmount}
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
                                returnKeyType={"done"}
                                blurOnSubmit={true}
                                maxLength={300}
                                textAlignVertical={'top'}
                                onChangeText={(Label) => this.setState({ Remarks: Label })}
                                value={this.state.Remarks}
                            />
                        </View>
                    </ScrollView>
                    {/* To set Submit Button */}
                    <View style={{ paddingLeft: R.dimens.activity_margin,
                         paddingTop: R.dimens.widget_top_bottom_margin,
                         paddingRight: R.dimens.activity_margin,
                          paddingBottom: R.dimens.widget_top_bottom_margin,
                           }}>
                        <Button title={isEdit ?
                             R.strings.update :
                              R.strings.add} onPress={this.onSubmitPress}></Button>
                    </View>
                </View>
            </SafeView>
        )
    }

    styles = () => {
        return {
            mainView: {
                paddingRight: R.dimens.activity_margin,
                paddingBottom: R.dimens.padding_top_bottom_margin,
                paddingTop: R.dimens.padding_top_bottom_margin,
                paddingLeft: R.dimens.activity_margin,
            },
            radioButtonTitle: {
                marginLeft: R.dimens.LineHeight,
                fontSize: R.dimens.smallText,
                marginTop: R.dimens.widget_top_bottom_margin,
                color: R.colors.textPrimary
            }
        }
    }

    renderRadioButton(props) {
        let { item } = props;

        return (<View>
            <ImageTextButton
                name={item.title}
                icon={item.selected ? R.images.IC_RADIO_CHECK : R.images.IC_RADIO_UNCHECK}
                onPress={() => props.onPress(item)}
                style={{ flex: 1, margin: R.dimens.widgetMargin, flexDirection: 'row-reverse' }}
                textStyle={{ marginLeft: R.dimens.widgetMargin, color: R.colors.textSecondary }}
                iconStyle={{ tintColor: item.selected ? R.colors.accent : R.colors.textPrimary, width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon }}
            />
        </View>)
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
    // Clear Arbitrage Charge Config Action
    clearArbitrageChargeConfigData: () => dispatch(clearArbitrageChargeConfigData()),
    // Perform Arbitrage Add Charge Config
    addArbiChargeConfigDetail: (payload) => dispatch(addArbiChargeConfigDetail(payload)),
    // Perform Arbitrage Update Charge Config
    updateArbiChargeConfigDetail: (payload) => dispatch(updateArbiChargeConfigDetail(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(AddEditArbiChargeConfigDetailScreen)