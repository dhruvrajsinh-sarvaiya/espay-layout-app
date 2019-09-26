import { View, ScrollView, Keyboard, } from 'react-native';
import React from 'react'
import { Component } from 'react';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../../native_theme/components/CustomToolbar'
import EditText from '../../../native_theme/components/EditText'
import Button from '../../../native_theme/components/Button';
import { connect } from 'react-redux';
import { isCurrentScreen } from '../../Navigation';
import { showAlert, changeTheme, parseFloatVal } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew, isEmpty } from '../../../validations/CommonValidation';
import CommonToast from '../../../native_theme/components/CommonToast';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import R from '../../../native_theme/R';
import { FeatureSwitch } from '../../../native_theme/components/FeatureSwitch';
import { addChargesConfigurationDetail, clearChargeConfigData, UpdateChargesConfigurationDetail } from '../../../actions/Wallet/ChargeConfigActions';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import SafeView from '../../../native_theme/components/SafeView';
import TextCard from '../../../native_theme/components/TextCard';
import RadioButton from '../../../native_theme/components/RadioButton';

//Create Common class for Add Edit Limit Configuration
class ChargeConfigDetailAddEditScreen extends Component {

    constructor(props) {
        super(props);

        this.inputs = {};

        //item for edit from List screen 
        let item = props.navigation.state.params && props.navigation.state.params.item

        //item that check edit is true or not
        let edit = props.navigation.state.params && props.navigation.state.params.edit

        //item that comes from master screen 
        let MasterItem = props.navigation.state.params && props.navigation.state.params.MasterItem

        //Define All State initial state
        this.state = {
            edit: edit,
            item: item,
            MasterItem: MasterItem,

            Status: edit ? (item.Status === 1 ? true : false) : false,

            chargeType: edit ? (item.ChargeType === 1 ? true : false) : true,

            selectedCurrency: MasterItem.WalletTypeName,
            selectedCurrencyCode: MasterItem.DeductionWalledID,

            chargeValue: edit ? (item.ChargeValue).toString() : '',

            chagreIn: edit ? (item.ChargeValueType === 1 ? true : false) : true,

            MakerCharge: edit ? (item.MakerCharge).toString() : '',
            TakerCharge: edit ? (item.TakerCharge).toString() : '',
            MinAmount: edit ? (item.MinAmount).toString() : '',
            MaxAmount: edit ? (item.MaxAmount).toString() : '',
            Remarks: edit ? (item.Remarks) : '',
        };

        // Create reference
        this.toast = React.createRef();
    }

    async componentDidMount() {

        //Add this method to change theme based on stored theme name.
        changeTheme();
    }

    componentDidUpdate = async (prevProps, prevState) => {

        const { addDetailData, updateDetailData } = this.props.Listdata;

        if (addDetailData !== prevProps.Listdata.addDetailData) {
            // for show responce add
            if (addDetailData) {
                try {
                    if (validateResponseNew({
                        response: addDetailData,
                    })) {
                        showAlert(R.strings.Success, addDetailData.ReturnMsg, 0, () => {
                            this.props.clearChargeConfigData()
                            this.props.navigation.state.params.onSuccess() // if add success call list method from back screen
                            this.props.navigation.goBack()
                        });
                    } else {
                        this.props.clearChargeConfigData()
                    }
                } catch (e) {
                    this.props.clearChargeConfigData()
                }
            }
        }

        if (updateDetailData !== prevProps.Listdata.updateDetailData) {
            // for show responce update
            if (updateDetailData) {
                try {
                    if (validateResponseNew({
                        response: updateDetailData
                    })) {
                        showAlert(R.strings.Success, updateDetailData.ReturnMsg, 0, () => {
                            this.props.clearChargeConfigData()
                            this.props.navigation.state.params.onSuccess() // if update success call list method from back screen
                            this.props.navigation.goBack()
                        });
                    } else {
                        this.props.clearChargeConfigData()
                    }
                } catch (e) {
                    this.props.clearChargeConfigData()
                }
            }
        }
    }

    //Add Or Update Button Presss
    onPress = async (Id) => {

        //validations for Inputs 
        if (isEmpty(this.state.chargeValue)) {
            this.toast.Show(R.strings.enter + ' ' + R.strings.chargeValue)
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

        if (isEmpty(this.state.MinAmount)) {
            this.toast.Show(R.strings.enter + ' ' + R.strings.minAmount)
            return;
        }

        if (isEmpty(this.state.MaxAmount)) {
            this.toast.Show(R.strings.enter + ' ' + R.strings.maxAmount)
            return;
        }

        if (isEmpty(this.state.Remarks)) {
            this.toast.Show(R.strings.enter + ' ' + R.strings.remarks)
            return;
        }

        Keyboard.dismiss();

        if (await isInternet()) {
            this.request = {
                MakerCharge: parseFloatVal(this.state.MakerCharge),
                ChargeType: this.state.chargeType === true ? 1 : 2,
                DeductionWalletTypeId: this.state.MasterItem.WalletTypeID,
                ChargeValueType: this.state.chagreIn === true ? 1 : 2,
                MinAmount: this.state.MinAmount,
                ChargeDistributionBasedOn: 1,
                Status: this.state.Status === true ? 1 : 0,
                MaxAmount: this.state.MaxAmount,
                ChargeValue: this.state.chargeValue,
                Remarks: this.state.Remarks,
                ChargeConfigurationMasterID: this.state.MasterItem.Id,
                TakerCharge: this.state.TakerCharge,
            }

            if (this.state.edit) {
                this.request = {
                    MinAmount: this.state.MinAmount,
                    TakerCharge: this.state.TakerCharge,
                    MaxAmount: this.state.MaxAmount,
                    Remarks: this.state.Remarks,
                    Status: this.state.Status === true ? 1 : 0,
                    ChargeConfigDetailId: this.state.item.ChargeConfigDetailId,
                    ChargeValueType: this.state.chagreIn === true ? 1 : 2,
                    ChargeValue: this.state.chargeValue,
                    MakerCharge: parseFloatVal(this.state.MakerCharge),
                    ChargeDistributionBasedOn: 1,
                    ChargeType: this.state.chargeType === true ? 1 : 2,
                    ChargeConfigurationMasterID: this.state.MasterItem.Id,
                    DeductionWalletTypeId: this.state.MasterItem.WalletTypeID,
                }

                //call update chrage configuration api
                this.props.UpdateChargesConfigurationDetail(this.request)
            }
            else {
                //call add charge configuration api
                this.props.addChargesConfigurationDetail(this.request)
            }
        }
    }

    //this Method is used to focus on next feild
    focusNextField(id) {
        this.inputs[id].focus();
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        // stop twice api call
        return isCurrentScreen(nextProps);
    };

    render() {
        // Loading status for Progress bar which is fetching from reducer
        const { addDetailLoading, updateDetailLoading } = this.props.Listdata;

        return (

            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                {/* To Set Status Bas as per out theme */}
                <CommonStatusBar />

                {/* To Set ToolBar as per out theme */}
                <CustomToolbar
                    title={this.state.edit ? (R.strings.updateChrgeConfiguration + ' ' + R.strings.detail) : (R.strings.addChrgeConfiguration + ' ' + R.strings.detail)}
                    isBack={true}
                    nav={this.props.navigation}

                />

                {/* Progress Dialog */}
                <ProgressDialog isShow={addDetailLoading || updateDetailLoading} />

                {/* for common toast */}
                <CommonToast ref={cmpToast => this.toast = cmpToast} />

                {/* Toggle Button For Status Enable/Disable Functionality */}
                <FeatureSwitch
                    isGradient={true}
                    title={this.state.Status ? R.strings.Enable : R.strings.Disable}
                    isToggle={this.state.Status}
                    onValueChange={() => {
                        this.setState({
                            Status: !this.state.Status
                        })
                    }}
                />

                <View style={{
                    flex: 1, justifyContent: 'space-between',
                    paddingLeft: R.dimens.activity_margin,
                    paddingRight: R.dimens.activity_margin,
                    paddingTop: R.dimens.widget_top_bottom_margin
                }}>

                    <View style={{ flex: 1 }}>

                        <ScrollView keyboardShouldPersistTaps='always' showsVerticalScrollIndicator={false}>

                            {/* Picker for Currency */}
                            <TextCard title={R.strings.Currency} value={this.state.selectedCurrency} />

                            {/* EditText for chargeValue */}
                            <EditText
                                isRequired={true}
                                header={R.strings.chargeValue}
                                placeholder={R.strings.chargeValue}
                                multiline={false}
                                keyboardType='numeric'
                                returnKeyType={"next"}
                                blurOnSubmit={false}
                                reference={input => { this.inputs['charge'] = input; }}
                                onSubmitEditing={() => { this.focusNextField('makerCharge') }}
                                onChangeText={(Label) => this.setState({ chargeValue: Label })}
                                value={this.state.chargeValue}
                                validate={true}
                                maxLength={5}
                            />

                            {/* To Set charge Type */}
                            <TextViewMR style={{ marginLeft: R.dimens.LineHeight, fontSize: R.dimens.smallText, marginTop: R.dimens.widget_top_bottom_margin, color: R.colors.textPrimary }}>{R.strings.ChargeType}</TextViewMR>
                            <View style={{ marginLeft: R.dimens.LineHeight, flexDirection: 'row', marginTop: R.dimens.widgetMargin }}>

                                <RadioButton
                                    item={{ title: R.strings.recurring, selected: !this.state.chargeType }}
                                    onPress={() => this.setState({ chargeType: !this.state.chargeType })}
                                />
                                <RadioButton
                                    item={{ title: R.strings.regular, selected: this.state.chargeType }}
                                    onPress={() => this.setState({ chargeType: !this.state.chargeType })}
                                />

                            </View>

                            {/* To Set chagreIn */}
                            <TextViewMR style={{ marginLeft: R.dimens.LineHeight, fontSize: R.dimens.smallText, marginTop: R.dimens.widget_top_bottom_margin, color: R.colors.textPrimary }}>{R.strings.chargeIn}</TextViewMR>
                            <View style={{ marginLeft: R.dimens.LineHeight, flexDirection: 'row', marginTop: R.dimens.widgetMargin }}>

                                <RadioButton
                                    item={{ title: R.strings.Percentage, selected: !this.state.chagreIn }}
                                    onPress={() => this.setState({ chagreIn: !this.state.chagreIn })}
                                />

                                <RadioButton
                                    item={{ title: R.strings.Fixed, selected: this.state.chagreIn }}
                                    onPress={() => this.setState({ chagreIn: !this.state.chagreIn })}
                                />

                            </View>

                            {/* For charge */}
                            <TextViewMR style={{ marginLeft: R.dimens.LineHeight, fontSize: R.dimens.smallText, marginTop: R.dimens.widget_top_bottom_margin, color: R.colors.textPrimary }}>{R.strings.Charge}</TextViewMR>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: R.dimens.widgetMargin }}>
                                {/* EditText for MakerCharge */}
                                <EditText
                                    isRequired={true}
                                    reference={input => { this.inputs['makerCharge'] = input; }}
                                    placeholder={R.strings.Maker_Charges}
                                    multiline={false}
                                    keyboardType='numeric'
                                    returnKeyType={"next"}
                                    blurOnSubmit={false}
                                    maxLength={10}
                                    style={{ flex: 1, marginTop: 0, marginRight: R.dimens.widgetMargin, }}
                                    onChangeText={(Label) => this.setState({ MakerCharge: Label })}
                                    onSubmitEditing={() => { this.focusNextField('takerCharge') }}
                                    value={this.state.MakerCharge}
                                    validate={true}
                                />

                                {/* EditText for TakerCharge */}
                                <EditText
                                    isRequired={true}
                                    reference={input => { this.inputs['takerCharge'] = input; }}
                                    placeholder={R.strings.Taker_Charges}
                                    multiline={false}
                                    maxLength={10}
                                    keyboardType='numeric'
                                    returnKeyType={"next"}
                                    style={{ flex: 1, marginTop: 0, marginRight: R.dimens.widgetMargin, }}
                                    blurOnSubmit={false}
                                    onChangeText={(Label) => this.setState({ TakerCharge: Label })}
                                    onSubmitEditing={() => { this.focusNextField('minAmount') }}
                                    value={this.state.TakerCharge}
                                    validate={true}
                                />
                            </View>

                            {/* For Amount Range */}
                            <TextViewMR style={{ marginLeft: R.dimens.LineHeight, fontSize: R.dimens.smallText, marginTop: R.dimens.widget_top_bottom_margin, color: R.colors.textPrimary }}>{R.strings.Amount}</TextViewMR>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: R.dimens.widgetMargin }}>
                                {/* To Set Min Amount in EditText */}
                                <EditText
                                    isRequired={true}
                                    style={{ flex: 1, marginTop: 0, marginRight: R.dimens.widgetMargin, }}
                                    reference={input => { this.inputs['minAmount'] = input; }}
                                    placeholder={R.strings.minAmount}
                                    multiline={false}
                                    keyboardType='numeric'
                                    returnKeyType={"next"}
                                    blurOnSubmit={false}
                                    onChangeText={(Label) => this.setState({ MinAmount: Label })}
                                    onSubmitEditing={() => { this.focusNextField('maxAmount') }}
                                    value={this.state.MinAmount}
                                    validate={true}
                                    maxLength={10}
                                />

                                {/* To Set Max Amount in EditText */}
                                <EditText
                                    isRequired={true}
                                    reference={input => { this.inputs['maxAmount'] = input; }}
                                    placeholder={R.strings.maxAmount}
                                    multiline={false}
                                    keyboardType='numeric'
                                    returnKeyType={"next"}
                                    blurOnSubmit={false}
                                    onChangeText={(Label) => this.setState({ MaxAmount: Label })}
                                    onSubmitEditing={() => { this.focusNextField('remarks') }}
                                    value={this.state.MaxAmount}
                                    validate={true}
                                    maxLength={10}
                                    style={{ flex: 1, marginTop: 0, marginLeft: R.dimens.widgetMargin, }}
                                />
                            </View>

                            {/* EditText for Remarks */}
                            <EditText
                                isRequired={true}
                                header={R.strings.remarks}
                                reference={input => { this.inputs['remarks'] = input; }}
                                placeholder={R.strings.remarks}
                                multiline={true}
                                keyboardType='default'
                                returnKeyType={"done"}
                                onChangeText={(Label) => this.setState({ Remarks: Label })}
                                value={this.state.Remarks}
                                numberOfLines={4}
                                blurOnSubmit={true}
                                maxLength={300}
                                textAlignVertical={'top'}
                            />
                        </ScrollView>
                    </View>
                    <View style={{ paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                        {/* To Set Add or Edit Button */}
                        <Button title={this.state.edit ? R.strings.update : R.strings.Add} onPress={() => this.onPress(this.state.edit ? this.state.item.Id : null)}></Button>
                    </View>
                </View>
            </SafeView>
        )
    }
}

function mapStateToProps(state) {
    return {
        //Updated ChargeConfigReducer  
        Listdata: state.ChargeConfigReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //for add  api data
        addChargesConfigurationDetail: (add) => dispatch(addChargesConfigurationDetail(add)),
        //for add  api data
        UpdateChargesConfigurationDetail: (add) => dispatch(UpdateChargesConfigurationDetail(add)),
        //for add edit data clear
        clearChargeConfigData: () => dispatch(clearChargeConfigData()),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ChargeConfigDetailAddEditScreen)