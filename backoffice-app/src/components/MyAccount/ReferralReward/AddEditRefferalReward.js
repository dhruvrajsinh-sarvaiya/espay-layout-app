import {
    View,
    ScrollView,
    Keyboard,
} from 'react-native';
import React from 'react'
import { Component } from 'react';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../../native_theme/components/CustomToolbar'
import EditText from '../../../native_theme/components/EditText'
import Button from '../../../native_theme/components/Button';
import { connect } from 'react-redux';
import { isCurrentScreen } from '../../Navigation';
import { showAlert, changeTheme, getCurrentDate, convertDate, parseArray, getDateWeekAgo, parseIntVal, parseFloatVal } from '../../../controllers/CommonUtils';
import { isEmpty, isInternet, validateResponseNew } from '../../../validations/CommonValidation';
import CommonToast from '../../../native_theme/components/CommonToast';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import R from '../../../native_theme/R';
import { clearRefferal, editReferral, addRefferal, getRefferalServiceType, getRefferalPayType } from '../../../actions/account/ReferralAction';
import { getWalletTypeMaster } from '../../../actions/PairListAction';
import ComboPickerWidget from '../../widget/ComboPickerWidget';
import DatePickerWidget from '../../widget/DatePickerWidget';
import SafeView from '../../../native_theme/components/SafeView';

//Create Common class for Add Edit Transaction policy 
class AddEditRefferalReward extends Component {

    constructor(props) {
        super(props);

        // create reference
        this.toast = React.createRef();
        this.inputs = {};

        //item that check edit is true or not
        let edit = props.navigation.state.params && props.navigation.state.params.edit
        //item for edit from List screen 
        let item = props.navigation.state.params && props.navigation.state.params.item
        //to chek whether user is from list screen or Dashboard Screen
        let fromDashboard = props.navigation.state.params && props.navigation.state.params.fromDashboard

        //Define All State initial state
        this.state = {          
            item: item,
            edit: edit,
            fromDashboard: fromDashboard,

            minLimitRefer: edit ? (item.ReferMinCount).toString() : '',
            maxLimitRefer: edit ? (item.ReferMaxCount).toString() : '',

            reward: edit ? (item.RewardsPay).toString() : '',

            description: edit ? item.Description : '',

            currency: [{ value: R.strings.Please_Select }],
            selectedCurrency: edit ? item.CurrencyName : R.strings.Please_Select,
            selectedCurrencyId: edit ? item.CurrencyId : null,

            payType: [{ value: R.strings.Please_Select }],
            selectedPayType: edit ? item.ReferralPayTypeName : R.strings.Please_Select,
            selectedPayTypeId: edit ? item.ReferralPayTypeId : null,

            serviceType: [{ value: R.strings.Please_Select }],
            selectedServiceType: edit ? item.ReferralServiceTypeName : R.strings.Please_Select,
            selectedServiceTypeId: edit ? item.ReferralServiceTypeId : null,

            ActiveDate: edit ? convertDate(item.ActiveDate) : getDateWeekAgo(),
            ExpireDate: edit ? convertDate(item.ExpireDate) : getCurrentDate(),
            isFirstTime: true,
        }

        //To Bind All Method
        this.focusNextField = this.focusNextField.bind(this);
    }

    async componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {
            //call Api For Fill Currency Picker
            this.props.getWalletTypeMaster();
            //call Api For Fill PayType Picker
            this.props.getRefferalPayType();
            //call Api For Fill ServiceType Picker
            this.props.getRefferalServiceType();
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        // stop twice api call
        return isCurrentScreen(nextProps);
    };

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
        if (AddEditRefferalReward.oldProps !== props) {
            AddEditRefferalReward.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //Get All Updated Feild of Particular actions
            const { currencyData, payTypeData, serviceTypeData } = props.Listdata;

            //if Currency response is not null then handle resposne
            if (currencyData) {
                if (state.currencyData == null || (state.currencyData != null && currencyData !== state.currencyData)) {
                    if (validateResponseNew({ response: currencyData, isList: true })) {
                        let res = parseArray(currencyData.walletTypeMasters);
                        res.map((item, index) => {
                            res[index].value = item.CoinName;
                        })
                        let currency = [
                            { value: R.strings.Please_Select },
                            ...res
                        ];
                        return {
                            ...state,
                            currencyData, currency
                        }
                    } else {
                        return {
                            ...state,
                            currencyData,
                            currency: [{ value: R.strings.Please_Select }]
                        }
                    }
                }
            }

            //if PayType response is not null then handle resposne
            if (payTypeData) {
                if (state.payTypeData == null || (state.payTypeData != null && payTypeData !== state.payTypeData)) {
                    if (validateResponseNew({ response: payTypeData, isList: true })) {
                        let res = parseArray(payTypeData.ReferralPayTypeDropDownList);
                        res.map((item, index) => {
                            res[index].value = item.PayTypeName;
                        })
                        let payType = [
                            { value: R.strings.Please_Select },
                            ...res
                        ];
                        return {
                            ...state,
                            payTypeData, payType
                        }
                    } else {
                        return {
                            ...state,
                            payTypeData, payType: [{ value: R.strings.Please_Select }]
                        }
                    }
                }
            }

            //if ServiceType response is not null then handle resposne
            if (serviceTypeData) {
                if (state.serviceTypeData == null || (state.serviceTypeData != null && serviceTypeData !== state.serviceTypeData)) {
                    if (validateResponseNew({ response: serviceTypeData, isList: true })) {
                        let res = parseArray(serviceTypeData.ReferralServiceTypeDropDownList);
                        res.map((item, index) => {
                            res[index].value = item.ServiceTypeName;
                        })
                        let serviceType = [
                            { value: R.strings.Please_Select },
                            ...res
                        ];
                        return {
                            ...state,
                            serviceTypeData,
                            serviceType
                        }
                    } else {
                        return {
                            ...state,
                            serviceTypeData,
                            serviceType: [{ value: R.strings.Please_Select }]
                        }
                    }
                }
            }
        }
        return null;
    }

    componentDidUpdate = async (prevProps, prevState) => {
        const { addRefferalData, editReferralData } = this.props.Listdata;
        if (addRefferalData !== prevProps.Listdata.addRefferalData) {
            // for show responce add
            if (addRefferalData) {
                if (validateResponseNew({
                    response: addRefferalData,
                })) {
                    showAlert(R.strings.Success, addRefferalData.ReturnMsg, 0, () => {

                        //clear data
                        this.props.clearRefferal()
                        if (!this.state.fromDashboard) {
                            this.props.navigation.state.params.onSuccess() // if add success call list method from back screen
                            this.props.navigation.goBack()
                        }
                        else {
                            this.props.navigation.goBack()
                        }
                    });
                } else {
                    //clear data
                    this.props.clearRefferal()
                }
            }
        }

        if (editReferralData !== prevProps.Listdata.editReferralData) {
            // for show responce update
            if (editReferralData) {
                if (validateResponseNew({
                    response: editReferralData
                })) {
                    showAlert(R.strings.Success, editReferralData.ReturnMsg, 0, () => {
                        //clear data
                        this.props.clearRefferal()
                        this.props.navigation.state.params.onSuccess() // if update success call list method from back screen
                        this.props.navigation.goBack()
                    });
                } else {
                    //clear data
                    this.props.clearRefferal()
                }
            }
        }
    }

    //this Method is used to focus on next feild
    focusNextField(id) {
        this.inputs[id].focus();
    }

    //Add Or Update Button Presss
    onAddEditReferralPress = async (Id) => {
        // Validations For Input Fields 
        if (isEmpty(this.state.minLimitRefer)) {
            this.toast.Show(R.strings.enter + " " + R.strings.minLimitForRefer)
            return;
        }
        if (isEmpty(this.state.maxLimitRefer)) {
            this.toast.Show(R.strings.enter + " " + R.strings.maxLimitForRefer)
            return;
        }
        // if min limit is maximum or equal to Max limit than display message 
        if (((parseInt(this.state.minLimitRefer)) > (parseInt(this.state.maxLimitRefer))) || ((parseInt(this.state.minLimitRefer)) === (parseInt(this.state.maxLimitRefer)))) {
            this.toast.Show(R.strings.minLimitForRefer + " " + R.strings.shouldBeLessThan + " " + R.strings.maxLimitForRefer)
            return;
        }
        if (isEmpty(this.state.reward)) {
            this.toast.Show(R.strings.enter + " " + R.strings.reward)
            return;
        }
        if (this.state.selectedCurrency === R.strings.Please_Select) {
            this.toast.Show(R.strings.Please_Select + " " + R.strings.Currency)
            return;
        }
        if (this.state.selectedPayType === R.strings.Please_Select) {
            this.toast.Show(R.strings.Please_Select + " " + R.strings.pay + R.strings.type)
            return;
        }
        if (this.state.selectedServiceType === R.strings.Please_Select) {
            this.toast.Show(R.strings.Please_Select + " " + R.strings.service + R.strings.type)
            return;
        }
        if (isEmpty(this.state.description)) {
            this.toast.Show(R.strings.enter + " " + R.strings.description)
            return;
        }

        Keyboard.dismiss();

        //Check NetWork is Available or not
        if (await isInternet()) {
            this.request = {
                ReferralServiceTypeId: parseIntVal(this.state.selectedServiceTypeId),
                ReferralPayTypeId: parseIntVal(this.state.selectedPayTypeId),
                CurrencyId: parseIntVal(this.state.selectedCurrencyId),
                Description: this.state.description,
                ReferMinCount: parseIntVal(this.state.minLimitRefer),
                ReferMaxCount: parseIntVal(this.state.maxLimitRefer),
                RewardsPay: parseFloatVal(this.state.reward),
                ActiveDate: this.state.ActiveDate,
                ExpireDate: this.state.ExpireDate,
            }
            if (this.state.edit) {
                this.request = {
                    ...this.request,
                    Id: Id,
                }

                //call editReferral api
                this.props.editReferral(this.request)
            }
            else {
                //call addRefferal api
                this.props.addRefferal(this.request)
            }
        }
    }

    render() {
        const { isCurrencyLoading, isPayTypeLoading, isServiceTypeLoading, isEditReferral, isAddRefferal } = this.props.Listdata;
        return (

            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                {/* To Set Status Bas as per out theme */}
                <CommonStatusBar />

                {/* To Set ToolBar as per out theme */}
                <CustomToolbar
                    title={this.state.edit ? R.strings.updateReferralReward : R.strings.addReferralReward}
                    isBack={true}
                    nav={this.props.navigation}

                />
                {/* Progress Dialog */}
                <ProgressDialog isShow={isCurrencyLoading || isPayTypeLoading || isServiceTypeLoading || isEditReferral || isAddRefferal} />

                {/* Common Toast */}
                <CommonToast ref={cmpToast => this.toast = cmpToast} />

                <View style={{
                    flex: 1, justifyContent: 'space-between',
                    paddingLeft: R.dimens.activity_margin,
                    paddingRight: R.dimens.activity_margin,
                }}>

                    <View style={{ flex: 1 }}>
                        {/* Display Data in scrollview */}
                        <ScrollView showsVerticalScrollIndicator={false} >

                            {/* EditText for minLimitForRefer */}
                            <EditText
                                isRequired={true}
                                header={R.strings.minLimitForRefer}
                                placeholder={R.strings.minLimitForRefer}
                                onChangeText={(text) => this.setState({ minLimitRefer: text })}
                                value={this.state.minLimitRefer}
                                keyboardType={'numeric'}
                                returnKeyType={"next"}
                                validate={true}
                                onlyDigit={true}
                                blurOnSubmit={false}
                                onSubmitEditing={() => { this.focusNextField('maxLimitRefer') }}
                            />

                            {/* EditText for maxLimitForRefer */}
                            <EditText
                                isRequired={true}
                                header={R.strings.maxLimitForRefer}
                                placeholder={R.strings.maxLimitForRefer}
                                onChangeText={(text) => this.setState({ maxLimitRefer: text })}
                                value={this.state.maxLimitRefer}
                                keyboardType={'numeric'}
                                returnKeyType={"next"}
                                blurOnSubmit={false}
                                validate={true}
                                onlyDigit={true}
                                reference={input => { this.inputs['maxLimitRefer'] = input; }}
                                onSubmitEditing={() => { this.focusNextField('Reward') }}
                            />

                            {/* EditText for reward */}
                            <EditText
                                isRequired={true}
                                header={R.strings.reward}
                                placeholder={R.strings.reward}
                                onChangeText={(text) => this.setState({ reward: text })}
                                value={this.state.reward}
                                keyboardType={'numeric'}
                                returnKeyType={"done"}
                                validate={true}
                                reference={input => { this.inputs['Reward'] = input; }}
                            />
                            {/* dropdown for Currency,payType,service */}
                            <ComboPickerWidget
                                pickers={[
                                    {
                                        title: R.strings.Currency,
                                        array: this.state.currency,
                                        selectedValue: this.state.selectedCurrency,
                                        onPickerSelect: (item, object) => this.setState({ selectedCurrency: item, selectedCurrencyId: object.Id }),
                                        isRequired: true
                                    },
                                    {
                                        title: R.strings.pay + " " + R.strings.type,
                                        array: this.state.payType,
                                        selectedValue: this.state.selectedPayType,
                                        onPickerSelect: (item, object) => this.setState({ selectedPayType: item, selectedPayTypeId: object.Id }),
                                        isRequired: true
                                    },
                                    {
                                        title: R.strings.service + " " + R.strings.type,
                                        array: this.state.serviceType,
                                        selectedValue: this.state.selectedServiceType,
                                        onPickerSelect: (item, object) => this.setState({ selectedServiceType: item, selectedServiceTypeId: object.Id }),
                                        isRequired: true
                                    },
                                ]}
                            />

                            {/* EditText for description */}
                            <EditText
                                header={R.strings.description}
                                placeholder={R.strings.description}
                                onChangeText={(text) => this.setState({ description: text })}
                                value={this.state.description}
                                keyboardType={'default'}
                                returnKeyType={"next"}
                                textAlignVertical={'top'}
                                multiline={true}
                                numberOfLines={4}
                                isRequired={true}
                            />

                            <View>
                                {/* DatePicker */}
                                <DatePickerWidget
                                    allowFutureDate={true}
                                    fromTitle={R.strings.Active + " " + R.strings.Date}
                                    toTitle={R.strings.expire + " " + R.strings.Date}
                                    FromDatePickerCall={(FromDate) => this.setState({ ActiveDate: FromDate })}
                                    ToDatePickerCall={(ToDate) => this.setState({ ExpireDate: ToDate })}
                                    FromDate={this.state.ActiveDate}
                                    ToDate={this.state.ExpireDate} />
                            </View>

                        </ScrollView>

                    </View>
                    <View style={{ paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                        {/* To Set Add or Edit Button */}
                        <Button title={this.state.edit ? R.strings.update : R.strings.Add} onPress={() => this.onAddEditReferralPress(this.state.edit ? this.state.item.Id : null)}></Button>
                    </View>
                </View>
            </SafeView>

        );
    }
}

function mapStateToProps(state) {
    return {
        //Updated Data sla config priority
        Listdata: state.ReferralReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //for add  api data
        addRefferal: (add) => dispatch(addRefferal(add)),
        //for edit api data
        editReferral: (edit) => dispatch(editReferral(edit)),
        //for add edit data clear
        clearRefferal: () => dispatch(clearRefferal()),
        //get currency 
        getWalletTypeMaster: () => dispatch(getWalletTypeMaster()),
        //get serviceType
        getRefferalServiceType: () => dispatch(getRefferalServiceType()),
        //get Paytype
        getRefferalPayType: () => dispatch(getRefferalPayType()),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AddEditRefferalReward)












