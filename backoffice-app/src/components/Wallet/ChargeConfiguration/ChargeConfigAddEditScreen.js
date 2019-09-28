import { View, ScrollView, Keyboard, } from 'react-native';
import React from 'react'
import { Component } from 'react';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../../native_theme/components/CustomToolbar'
import EditText from '../../../native_theme/components/EditText'
import Button from '../../../native_theme/components/Button';
import { connect } from 'react-redux';
import { isCurrentScreen } from '../../Navigation';
import { showAlert, changeTheme, parseArray } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew, isEmpty } from '../../../validations/CommonValidation';
import CommonToast from '../../../native_theme/components/CommonToast';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import R from '../../../native_theme/R';
import { TitlePicker } from '../../widget/ComboPickerWidget';
import { getWalletType, getWalletTransactionType } from '../../../actions/PairListAction';
import { FeatureSwitch } from '../../../native_theme/components/FeatureSwitch';
import { addChargesConfiguration, clearChargeConfigData, UpdateChargesConfiguration } from '../../../actions/Wallet/ChargeConfigActions';
import SafeView from '../../../native_theme/components/SafeView';
import TextCard from '../../../native_theme/components/TextCard';

//Create Common class for Add/Edit Charge Configuration
class ChargeConfigAddEditScreen extends Component {

    constructor(props) {
        super(props);

        this.inputs = {};

        //item for edit from List screen 
        let item = props.navigation.state.params && props.navigation.state.params.item

        //item that check edit is true or not
        let edit = props.navigation.state.params && props.navigation.state.params.edit

        //Define All State initial state
        this.state = {
            edit: edit,
            item: item,

            currency: [{ value: R.strings.selectCurrency }],
            selectedCurrency: edit ? item.WalletTypeName : R.strings.selectCurrency,
            selectedCurrencyCode: edit ? item.WalletTypeID : '',

            transactionTypes: [{ value: R.strings.Select_Type }],
            selectedTransactionType: edit ? item.TrnTypeName : R.strings.Select_Type,
            selectedTransactionTypeCode: edit ? item.TrnType : '',

            remarks: edit ? item.Remarks : '',

            IsKYCEnable: edit ? (item.KYCComplaint === 1 ? true : false) : false,
            Status: edit ? (item.Status === 1 ? true : false) : false,
        };

        // Create reference
        this.toast = React.createRef();
    }

    async componentDidMount() {

        //Add this method to change theme based on stored theme name.
        changeTheme();

        //if edit is false than only api call 
        if (!this.state.edit) {
            if (await isInternet()) {
                //call Api submodule data
                this.props.getWalletType();
                this.props.getWalletTransactionType();
            }
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
        if (ChargeConfigAddEditScreen.oldProps !== props) {
            ChargeConfigAddEditScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            const { walletData, transactionTypeData } = props.Listdata;

            if (walletData) {
                try {
                    //if local userData state is null or its not null and also different then new response then and only then validate response.
                    if (state.walletData == null || (state.walletData != null && walletData !== state.walletData)) {

                        //if  response is success then store array list else store empty list
                        if (validateResponseNew({ response: walletData, isList: true })) {
                            let res = parseArray(walletData.Types);

                            res.map((item, index) => {
                                res[index].value = item.TypeName;
                            })

                            let currency = [
                                { value: R.strings.selectCurrency },
                                ...res
                            ];

                            return { ...state, walletData, currency };
                        } else {
                            return { ...state, walletData, currency: [{ value: R.strings.selectCurrency }] };
                        }
                    }
                } catch (e) {
                    return { ...state, currency: [{ value: R.strings.selectCurrency }] };
                }
            }

            if (transactionTypeData) {
                try {
                    //if local userData state is null or its not null and also different then new response then and only then validate response.
                    if (state.transactionTypeData == null || (state.transactionTypeData != null && transactionTypeData !== state.transactionTypeData)) {

                        //if  response is success then store array list else store empty list
                        if (validateResponseNew({ response: transactionTypeData, isList: true })) {
                            let res = parseArray(transactionTypeData.Data);

                            res.map((item, index) => {
                                res[index].value = item.TypeName;
                            })

                            let transactionTypes = [
                                { value: R.strings.select_type },
                                ...res
                            ];

                            return { ...state, transactionTypeData, transactionTypes };
                        } else {
                            return { ...state, transactionTypeData, transactionTypes: [{ value: R.strings.select_type }] };
                        }
                    }
                } catch (e) {
                    return { ...state, transactionTypes: [{ value: R.strings.select_type }] };
                }
            }
        }
        return null;
    }

    componentDidUpdate = async (prevProps, prevState) => {

        const { addData, updateData } = this.props.Listdata;

        if (addData !== prevProps.Listdata.addData) {
            // for show responce add
            if (addData) {
                try {
                    if (validateResponseNew({
                        response: addData,
                    })) {
                        showAlert(R.strings.Success, addData.ReturnMsg, 0, () => {
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

        if (updateData !== prevProps.Listdata.updateData) {
            // for show responce update
            if (updateData) {
                try {
                    if (validateResponseNew({
                        response: updateData
                    })) {
                        showAlert(R.strings.Success, updateData.ReturnMsg, 0, () => {
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
        if (this.state.selectedCurrency === R.strings.selectCurrency) {
            this.toast.Show(R.strings.selectCurrency)
            return;
        }

        if (this.state.selectedTransactionType === R.strings.select_type) {
            this.toast.Show(R.strings.selectTransactionType)
            return;
        }

        if (isEmpty(this.state.remarks)) {
            this.toast.Show(R.strings.enterRemarks)
            return;
        }

        Keyboard.dismiss();

        // Check internet connection
        if (await isInternet()) {
            this.request = {
                WalletTypeId: this.state.selectedCurrencyCode,
                TrnType: this.state.selectedTransactionTypeCode,
                KYCComplaint: this.state.IsKYCEnable === true ? 1 : 0,
                SlabType: 1,
                SpecialChargeConfigurationID: 0,
                Remarks: this.state.remarks,
                Status: this.state.Status === true ? 1 : 0,
            }

            if (this.state.edit) {
                this.request = {
                    Id: this.state.item.Id,
                    SlabType: 1,
                    Remarks: this.state.remarks,
                    Status: this.state.Status === true ? 1 : 0,
                }

                //call update chrage configuration api
                this.props.UpdateChargesConfiguration(this.request)
            }
            else {
                //call add charge configuration api
                this.props.addChargesConfiguration(this.request)
            }
        }
    }

    //this Method is used to focus on next feild
    focusNextField(id) {
        this.inputs[id].focus();
    }

    render() {
        // Loading status for Progress bar which is fetching from reducer
        const { addLoading, updateLoading } = this.props.Listdata;

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                {/* To Set Status Bas as per out theme */}
                <CommonStatusBar />

                {/* To Set ToolBar as per out theme */}
                <CustomToolbar
                    title={this.state.edit ? R.strings.updateChrgeConfiguration : R.strings.addChrgeConfiguration}
                    isBack={true}
                    nav={this.props.navigation}
                />

                {/* Progress Dialog */}
                <ProgressDialog isShow={addLoading || updateLoading} />

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

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='always'>
                        <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.LoginScreenTopMargin }}>

                            {/* Picker for Currency */}
                            {
                                !this.state.edit ?
                                    <TitlePicker
                                        isRequired={true}
                                        title={R.strings.Currency}
                                        array={this.state.currency}
                                        selectedValue={this.state.selectedCurrency}
                                        onPickerSelect={(index, object) => this.setState({ selectedCurrency: index, selectedCurrencyCode: object.ID })}
                                        style={{ marginTop: R.dimens.widget_top_bottom_margin }}
                                    />
                                    :
                                    <TextCard title={R.strings.Currency} value={this.state.selectedCurrency} isRequired={true} />
                            }

                            {/* Picker for transactionType */}
                            {
                                !this.state.edit ?
                                    <TitlePicker
                                        isRequired={true}
                                        title={R.strings.transType}
                                        array={this.state.transactionTypes}
                                        selectedValue={this.state.selectedTransactionType}
                                        onPickerSelect={(index, object) => this.setState({ selectedTransactionType: index, selectedTransactionTypeCode: object.TypeId })}
                                        style={{ marginTop: R.dimens.widget_top_bottom_margin }}
                                    />
                                    :
                                    <TextCard title={R.strings.transType} value={this.state.selectedTransactionType} isRequired={true} />
                            }

                            {/* EditText for remarks */}
                            <EditText
                                isRequired={true}
                                header={R.strings.remarks}
                                placeholder={R.strings.remarks}
                                multiline={false}
                                keyboardType='default'
                                returnKeyType={"done"}
                                blurOnSubmit={false}
                                onChangeText={(Label) => this.setState({ remarks: Label })}
                                value={this.state.remarks}
                            />

                            {/* switch for KYCStatus */}
                            <FeatureSwitch
                                style={{ paddingLeft: R.dimens.LineHeight, paddingRight: R.dimens.WidgetPadding }}
                                backgroundColor={'transparent'}
                                title={R.strings.kycCompliant}
                                disabled={this.state.edit ? true : false}
                                isToggle={this.state.IsKYCEnable}
                                textStyle={{ color: R.colors.textPrimary }}
                                onValueChange={() => {
                                    this.setState({
                                        IsKYCEnable: this.state.edit ? this.state.IsKYCEnable : !this.state.IsKYCEnable
                                    })
                                }}
                            />
                        </View>
                    </ScrollView>
                    <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                        {/* To Set Add or Edit Button */}
                        <Button title={this.state.edit ? R.strings.update : R.strings.Add} onPress={() => this.onPress(this.state.edit ? this.state.item.Id : null)}></Button>
                    </View>
                </View>
            </SafeView>
        );
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
        addChargesConfiguration: (add) => dispatch(addChargesConfiguration(add)),
        //for add  api data
        UpdateChargesConfiguration: (add) => dispatch(UpdateChargesConfiguration(add)),
        //for add edit data clear
        clearChargeConfigData: () => dispatch(clearChargeConfigData()),
        //Perform getWalletType Action 
        getWalletType: () => dispatch(getWalletType()),
        //Perform getWalletTransactionType Action 
        getWalletTransactionType: () => dispatch(getWalletTransactionType()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChargeConfigAddEditScreen)