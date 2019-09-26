import { View, ScrollView, Keyboard, } from 'react-native';
import React from 'react'
import { Component } from 'react';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../../native_theme/components/CustomToolbar'
import EditText from '../../../native_theme/components/EditText'
import Button from '../../../native_theme/components/Button';
import { connect } from 'react-redux';
import { isCurrentScreen } from '../../Navigation';
import { showAlert, changeTheme, parseArray, parseFloatVal } from '../../../controllers/CommonUtils';
import { isEmpty, isInternet, validateResponseNew } from '../../../validations/CommonValidation';
import CommonToast from '../../../native_theme/components/CommonToast';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import R from '../../../native_theme/R';
import { TitlePicker } from '../../widget/ComboPickerWidget';
import { getWalletType } from '../../../actions/PairListAction';
import moment from 'moment';
import { addLimitsConfiguration, UpdateLimitsConfiguration, clearLimitConfigured } from '../../../actions/Wallet/LimitConfigActions';
import IndicatorViewPager from '../../../native_theme/components/IndicatorViewPager';
import TimePickerWidget from '../../widget/TimePickerWidget';
import { FeatureSwitch } from '../../../native_theme/components/FeatureSwitch';
import TextCard from '../../../native_theme/components/TextCard';

//Create Common class for Add Edit Limit Configuration
class LimitConfigAddEditScreen extends Component {

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

            transactionTypes: [
                { value: R.strings.Select_Type, code: '' },
                { value: R.strings.trading, code: '1' },
                { value: R.strings.deposit, code: '2' },
                { value: R.strings.api, code: '4' },
                { value: R.strings.withdrawal, code: '9' },
            ],
            selectedTransactionType: edit ? item.StrTrnType : R.strings.Select_Type,
            selectedTransactionTypeCode: edit ? item.StrTrnType : '',

            currency: [{ value: R.strings.selectCurrency }],
            selectedCurrency: edit ? item.WalletTypeName : R.strings.selectCurrency,
            selectedCurrencyCode: edit ? item.WalletType : '',

            PerTranMinAmount: edit ? item.PerTranMinAmount.toString() : '',
            PerTranMaxAmount: edit ? item.PerTranMaxAmount.toString() : '',
            HourlyTrnCount: edit ? item.HourlyTrnCount.toString() : '',
            HourlyTrnAmount: edit ? item.HourlyTrnAmount.toString() : '',
            DailyTrnCount: edit ? item.DailyTrnCount.toString() : '',
            DailyTrnAmount: edit ? item.DailyTrnAmount.toString() : '',
            WeeklyTrnCount: edit ? item.WeeklyTrnCount.toString() : '',
            WeeklyTrnAmount: edit ? item.WeeklyTrnAmount.toString() : '',
            MonthlyTrnCount: edit ? item.MonthlyTrnCount.toString() : '',
            MonthlyTrnAmount: edit ? item.MonthlyTrnAmount.toString() : '',
            YearlyTrnCount: edit ? item.YearlyTrnCount.toString() : '',
            YearlyTrnAmount: edit ? item.YearlyTrnAmount.toString() : '',
            IsKYCEnable: edit ? (item.IsKYCEnable === 1 ? true : false) : false,
            Status: edit ? (item.Status === 1 ? true : false) : false,
            StartTime: edit ? moment(item.StartTime).format('hh:mm A') : '',
            EndTime: edit ? moment(item.EndTime).format('hh:mm A') : '',
            tabNames: ['Step-1', 'Step-2'],
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
            }
        }
    }

    shouldComponentUpdate = (nextProps, _nextState) => {
        //For stop twice api call
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
        if (LimitConfigAddEditScreen.oldProps !== props) {
            LimitConfigAddEditScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            const { walletData } = props.Listdata;

            if (walletData) {

                try {

                    //if local userData state is null or its not null and also different then new response then and only then validate response.
                    if (state.walletData == null || (state.walletData != null && walletData !== state.walletData)) {

                        //if  response is success then store array list else store empty list
                        if (validateResponseNew(
                            { response: walletData, isList: true })) {
                            let res = parseArray(walletData.Types);
                            for (var dataItem in res) {
                                let item = res[dataItem]
                                item.value = item.TypeName
                            }

                            let currency = [
                                {
                                    value: R.strings.Please_Select
                                },
                                ...res
                            ];

                            return {
                                ...state,
                                walletData, currency
                            };
                        } else {
                            return {
                                ...state, walletData, currency: [
                                    { value: R.strings.selectCurrency }]
                            };
                        }
                    }
                } catch (e) {
                    return {
                        ...state, currency: [{
                            value: R.strings.selectCurrency
                        }]
                    };
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
                            this.props.clearLimitConfigured()
                            this.props.navigation.state.params.onSuccess() // if add success call list method from back screen
                            this.props.navigation.goBack()
                        });
                    } else {
                        this.props.clearLimitConfigured()
                    }
                } catch (e) {
                    this.props.clearLimitConfigured()
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
                            this.props.clearLimitConfigured()
                            this.props.navigation.state.params.onSuccess() // if update success call list method from back screen
                            this.props.navigation.goBack()
                        });
                    } else {
                        this.props.clearLimitConfigured()
                    }
                } catch (e) {
                    this.props.clearLimitConfigured()
                }
            }
        }
    }

    //Add Or Update Button Presss
    onPress = async (Id) => {

        //validations for Inputs 
        if (this.state.selectedTransactionTypeCode === '') {
            this.toast.Show(R.strings.selectTransactionType)
            return;
        }

        if (this.state.selectedCurrency === R.strings.selectCurrency) {
            this.toast.Show(R.strings.selectCurrency)
            return;
        }

        if (isEmpty(this.state.PerTranMinAmount)) {
            this.toast.Show(R.strings.enter + ' ' + R.strings.per + '' + R.strings.trnMinAmount)
            return;
        }

        if (isEmpty(this.state.PerTranMaxAmount)) {
            this.toast.Show(R.strings.enter + ' ' + R.strings.per + '' + R.strings.trnMaxAmount)
            return;
        }

        if (isEmpty(this.state.HourlyTrnCount)) {
            this.toast.Show(R.strings.enterHourlyTrnCount)
            return;
        }

        if (isEmpty(this.state.HourlyTrnAmount)) {
            this.toast.Show(R.strings.enterHourlyTrnAmount)
            return;
        }

        if (isEmpty(this.state.DailyTrnCount)) {
            this.toast.Show(R.strings.enterDailyTrnCount)
            return;
        }

        if (isEmpty(this.state.DailyTrnAmount)) {
            this.toast.Show(R.strings.enterDailyTrnAmount)
            return;
        }

        if (isEmpty(this.state.WeeklyTrnCount)) {
            this.toast.Show(R.strings.enterWeeklyTrnCount)
            return;
        }

        if (isEmpty(this.state.WeeklyTrnAmount)) {
            this.toast.Show(R.strings.enterWeeklyTrnAmount)
            return;
        }

        if (isEmpty(this.state.MonthlyTrnCount)) {
            this.toast.Show(R.strings.enterMonthlyTrnCount)
            return;
        }

        if (isEmpty(this.state.MonthlyTrnAmount)) {
            this.toast.Show(R.strings.enterMonthlyTrnAmount)
            return;
        }

        if (isEmpty(this.state.YearlyTrnCount)) {
            this.toast.Show(R.strings.enterYearlyTrnCount)
            return;
        }

        if (isEmpty(this.state.YearlyTrnAmount)) {
            this.toast.Show(R.strings.enterYearlyTrnAmount)
            return;
        }

        Keyboard.dismiss();

        if (await isInternet()) {
            this.request = {
                TrnType: this.state.selectedTransactionTypeCode,
                walletType: this.state.selectedCurrencyCode,
                IsKYCEnable: parseFloatVal(this.state.IsKYCEnable === true ? 1 : 0),
                StartTime: this.state.StartTime === '' ? 0 : parseFloatVal(moment(this.state.StartTime, 'hh:mm A').format('x')),
                EndTime: this.state.EndTime === '' ? 0 : parseFloatVal(moment(this.state.EndTime, 'hh:mm A').format('x')),
                PerTranMinAmount: parseFloatVal(this.state.PerTranMinAmount),
                PerTranMaxAmount: parseFloatVal(this.state.PerTranMaxAmount),
                HourlyTrnCount: parseFloatVal(this.state.HourlyTrnCount),
                HourlyTrnAmount: parseFloatVal(this.state.HourlyTrnAmount),
                DailyTrnCount: parseFloatVal(this.state.DailyTrnCount),
                DailyTrnAmount: parseFloatVal(this.state.DailyTrnAmount),
                WeeklyTrnCount: parseFloatVal(this.state.WeeklyTrnCount),
                WeeklyTrnAmount: parseFloatVal(this.state.WeeklyTrnAmount),
                MonthlyTrnCount: parseFloatVal(this.state.MonthlyTrnCount),
                MonthlyTrnAmount: parseFloatVal(this.state.MonthlyTrnAmount),
                YearlyTrnCount: parseFloatVal(this.state.YearlyTrnCount),
                YearlyTrnAmount: parseFloatVal(this.state.YearlyTrnAmount),
                Status: parseFloatVal(this.state.Status === true ? 1 : 0),
            }

            if (this.state.edit) {
                this.request = {
                    ...this.request,
                    Id: this.state.item.Id,
                }

                //call update limit configuration api
                this.props.UpdateLimitsConfiguration(this.request)
            }
            else {
                //call add limit configuration api
                this.props.addLimitsConfiguration(this.request)
            }
        }
    }

    //this Method is used to focus on next feild
    focusNextField(id) {
        this.inputs[id].focus();
    }

    /* Called when onPage Scrolling */
    onPageScroll = (scrollData) => {
        let { position } = scrollData
        if (position != this.state.tabPosition) {
            this.setState({ tabPosition: position, })
        }
    }

    render() {
        // Loading status for Progress bar which is fetching from reducer
        const { addLoading, updateLoading } = this.props.Listdata;

        return (

            <View style={{ flex: 1, backgroundColor: R.colors.background }}>
                {/* To Set Status Bas as per out theme */}
                <CommonStatusBar />

                {/* To Set ToolBar as per out theme */}
                <CustomToolbar
                    title={this.state.edit ? R.strings.updateLimitConfiguration : R.strings.addLimitConfiguration}
                    isBack={true}
                    nav={this.props.navigation} />

                {/* Progress Dialog */}
                <ProgressDialog isShow={addLoading || updateLoading} />

                {/* for common toast */}
                <CommonToast
                    ref={cmpToast => this.toast = cmpToast} />

                <View style={{
                    flex: 1,
                    justifyContent: 'space-between'
                }}>

                    {/* View Pager Indicator (Tab) */}
                    <IndicatorViewPager
                        isGradient={true}
                        style={{ marginLeft: R.dimens.activity_margin, marginRight: R.dimens.activity_margin, }}
                        style={{ flex: 1, flexDirection: 'column-reverse', }}
                        titles={this.state.tabNames}
                        horizontalScroll={false}
                        numOfItems={2}
                        ref='PairConfigurationTab'
                        onPageScroll={this.onPageScroll.bind(this)}>

                        {/* First Tab */}

                        <View>

                            <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.padding_top_bottom_margin, paddingTop: R.dimens.padding_top_bottom_margin }}>
                                <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='always'>

                                    {/* for status switch */}
                                    <FeatureSwitch
                                        isToggle={this.state.Status}
                                        onValueChange={() => {
                                            this.setState({
                                                Status: !this.state.Status
                                            })
                                        }}
                                        title={R.strings.Status}
                                        textStyle={{ color: R.colors.white }}
                                        isGradient={true}
                                    />

                                    {/* Picker for transactionType */}

                                    {
                                        !this.state.edit ?
                                            <TitlePicker
                                                onPickerSelect={(index, object) => this.setState({ selectedTransactionType: index, selectedTransactionTypeCode: object.code })}
                                                isRequired={true}
                                                title={R.strings.transType}
                                                style={{ marginTop: R.dimens.widget_top_bottom_margin }}
                                                array={this.state.transactionTypes}
                                                selectedValue={this.state.selectedTransactionType}
                                            />
                                            :
                                            <TextCard title={R.strings.transType} value={this.state.selectedTransactionType} />
                                    }

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
                                            <TextCard title={R.strings.Currency} value={this.state.selectedCurrency} />
                                    }

                                    {/* EditText for pertrnMinAmount */}
                                    <EditText
                                        isRequired={true}
                                        header={R.strings.per + ' ' + R.strings.trnMinAmount}
                                        reference={input => { this.inputs['trnMinAmount'] = input; }}
                                        placeholder={R.strings.setZeroToDisable}
                                        multiline={false}
                                        keyboardType='numeric'
                                        returnKeyType={"next"}
                                        blurOnSubmit={false}
                                        onChangeText={(Label) => this.setState({ PerTranMinAmount: Label })}
                                        onSubmitEditing={() => { this.focusNextField('trnMaxAmount') }}
                                        value={this.state.PerTranMinAmount}
                                    />

                                    {/* EditText for pertrnMaxAmount */}
                                    <EditText
                                        isRequired={true}
                                        header={R.strings.per + ' ' + R.strings.trnMaxAmount}
                                        reference={input => { this.inputs['trnMaxAmount'] = input; }}
                                        placeholder={R.strings.setZeroToDisable}
                                        multiline={false}
                                        keyboardType='numeric'
                                        returnKeyType={"next"}
                                        blurOnSubmit={false}
                                        onChangeText={(Label) => this.setState({ PerTranMaxAmount: Label })}
                                        onSubmitEditing={() => { this.focusNextField('hourlyTrnCount') }}
                                        value={this.state.PerTranMaxAmount}
                                    />

                                    {/* EditText for hourlyTrnCount */}
                                    <EditText
                                        validate={true}
                                        multiline={false}
                                        keyboardType='numeric'
                                        returnKeyType={"next"}
                                        blurOnSubmit={false}
                                        isRequired={true}
                                        header={R.strings.hourlyTrnCount}
                                        reference={input => { this.inputs['hourlyTrnCount'] = input; }}
                                        placeholder={R.strings.setZeroToDisable}
                                        onChangeText={(Label) => this.setState({ HourlyTrnCount: Label })}
                                        onlyDigit={true}
                                        onSubmitEditing={() => { this.focusNextField('hourlyTrnAmount') }}
                                        value={this.state.HourlyTrnCount}
                                    />

                                    {/* EditText for hourlyTrnAmount */}

                                    <EditText
                                        header={R.strings.hourlyTrnAmount}
                                        isRequired={true}
                                        reference={input => { this.inputs['hourlyTrnAmount'] = input; }}
                                        placeholder={R.strings.setZeroToDisable}
                                        multiline={false}
                                        keyboardType='numeric'
                                        returnKeyType={"next"}
                                        blurOnSubmit={false}
                                        onChangeText={(Label) => this.setState({ HourlyTrnAmount: Label })}
                                        onSubmitEditing={() => { this.focusNextField('DailyTrnCount') }}
                                        value={this.state.HourlyTrnAmount}
                                    />

                                    {/* EditText for dailyTrnCount */}
                                    <EditText
                                        multiline={false}
                                        keyboardType='numeric'
                                        returnKeyType={"next"}
                                        blurOnSubmit={false}
                                        onChangeText={(Label) => this.setState({ DailyTrnCount: Label })}
                                        onSubmitEditing={() => { this.focusNextField('dailyTrnAmount') }}
                                        validate={true}
                                        onlyDigit={true}
                                        header={R.strings.dailyTrnCount}
                                        reference={input => { this.inputs['DailyTrnCount'] = input; }}
                                        placeholder={R.strings.setZeroToDisable}
                                        isRequired={true}
                                        value={this.state.DailyTrnCount}
                                    />

                                    {/* EditText for dailyTrnAmount */}
                                    <EditText
                                        header={R.strings.dailyTrnAmount}
                                        reference={input => { this.inputs['dailyTrnAmount'] = input; }}
                                        placeholder={R.strings.setZeroToDisable}
                                        multiline={false}
                                        keyboardType='numeric'
                                        isRequired={true}
                                        returnKeyType={"done"}
                                        onChangeText={(Label) => this.setState({ DailyTrnAmount: Label })}
                                        value={this.state.DailyTrnAmount}
                                    />

                                </ScrollView>
                            </View>
                        </View>

                        {/* secrrr Tab */}
                        <View>
                            <View style={{ flex: 1, justifyContent: 'space-between', paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.padding_top_bottom_margin, paddingTop: R.dimens.padding_top_bottom_margin }}>

                                <ScrollView showsVerticalScrollIndicator={false} style={{ marginBottom: 20 }}>

                                    {/* switch for KYCStatus */}
                                    <FeatureSwitch
                                        isGradient={true}
                                        disabled={this.state.edit ? true : false}
                                        title={R.strings.KYCStatus}
                                        isToggle={this.state.IsKYCEnable}
                                        textStyle={{ color: R.colors.white }}
                                        onValueChange={() => {
                                            this.setState({
                                                IsKYCEnable: this.state.edit ? this.state.IsKYCEnable : !this.state.IsKYCEnable
                                            })
                                        }}
                                    />

                                    {/* EditText for weeklyTrnCount */}
                                    <EditText
                                        validate={true}
                                        onlyDigit={true}
                                        header={R.strings.weeklyTrnCount}
                                        onChangeText={(Label) => this.setState({ WeeklyTrnCount: Label })}
                                        reference={input => { this.inputs['weeklyTrnCount'] = input; }}
                                        placeholder={R.strings.setZeroToDisable}
                                        multiline={false}
                                        keyboardType='numeric'
                                        returnKeyType={"next"}
                                        blurOnSubmit={false}
                                        onSubmitEditing={() => { this.focusNextField('weeklyTrnAmount') }}
                                        isRequired={true}
                                        value={this.state.WeeklyTrnCount}
                                    />

                                    {/* EditText for weeklyTrnAmount */}
                                    <EditText
                                        reference={input => { this.inputs['weeklyTrnAmount'] = input; }}
                                        keyboardType='numeric'
                                        returnKeyType={"next"}
                                        placeholder={R.strings.setZeroToDisable}
                                        onChangeText={(Label) => this.setState({ WeeklyTrnAmount: Label })}
                                        isRequired={true}
                                        onSubmitEditing={() => { this.focusNextField('monthlyTrnCount') }}
                                        multiline={false}
                                        value={this.state.WeeklyTrnAmount}
                                        blurOnSubmit={false}
                                        header={R.strings.weeklyTrnAmount}
                                    />

                                    {/* EditText for monthlyTrnCount */}
                                    <EditText
                                        multiline={false}
                                        keyboardType='numeric'
                                        returnKeyType={"next"}
                                        blurOnSubmit={false}
                                        onChangeText={(Label) => this.setState({ MonthlyTrnCount: Label })}
                                        onSubmitEditing={() => { this.focusNextField('monthlyTrnAmount') }}
                                        value={this.state.MonthlyTrnCount}
                                        isRequired={true}
                                        validate={true}
                                        onlyDigit={true}
                                        header={R.strings.monthlyTrnCount}
                                        reference={input => { this.inputs['monthlyTrnCount'] = input; }}
                                        placeholder={R.strings.setZeroToDisable}
                                    />

                                    {/* EditText for monthlyTrnAmount */}
                                    <EditText
                                        returnKeyType={"next"}
                                        onChangeText={(Label) => this.setState({ MonthlyTrnAmount: Label })}
                                        placeholder={R.strings.setZeroToDisable}
                                        multiline={false}
                                        keyboardType='numeric'
                                        onSubmitEditing={() => { this.focusNextField('yearlyTrnCount') }}
                                        blurOnSubmit={false}
                                        isRequired={true}
                                        header={R.strings.monthlyTrnAmount}
                                        reference={input => { this.inputs['monthlyTrnAmount'] = input; }}
                                        value={this.state.MonthlyTrnAmount}
                                    />

                                    {/* EditText for yearlyTrnCount */}
                                    <EditText
                                        keyboardType='numeric'
                                        returnKeyType={"next"}
                                        onChangeText={(Label) => this.setState({ YearlyTrnCount: Label })}
                                        onSubmitEditing={() => { this.focusNextField('yearlyTrnAmount') }}
                                        isRequired={true}
                                        onlyDigit={true}
                                        header={R.strings.yearlyTrnCount}
                                        reference={input => { this.inputs['yearlyTrnCount'] = input; }}
                                        placeholder={R.strings.setZeroToDisable}
                                        multiline={false}
                                        validate={true}
                                        value={this.state.YearlyTrnCount}
                                    />

                                    {/* EditText for yearlyTrnAmount */}
                                    <EditText
                                        isRequired={true}
                                        header={R.strings.yearlyTrnAmount}
                                        reference={input => { this.inputs['yearlyTrnAmount'] = input; }}
                                        returnKeyType={"done"}
                                        blurOnSubmit={false}
                                        onChangeText={(Label) => this.setState({ YearlyTrnAmount: Label })}
                                        multiline={false}
                                        keyboardType='numeric'
                                        value={this.state.YearlyTrnAmount}
                                        placeholder={R.strings.setZeroToDisable}
                                    />

                                    {/* For StartTime and EndTime Picker and Its View */}
                                    <TimePickerWidget
                                        StartTimePickerCall={(StartTime) => this.setState({ StartTime })}
                                        EndTimePickerCall={(EndTime) => this.setState({ EndTime })}
                                        StartTime={this.state.StartTime}
                                        EndTime={this.state.EndTime} />
                                </ScrollView>
                                <View style={{ paddingTop: R.dimens.WidgetPadding }}>
                                    {/* To Set Add or Edit Button */}
                                    <Button title={this.state.edit ? R.strings.update : R.strings.Add} onPress={() => this.onPress(this.state.edit ? this.state.item.Id : null)}></Button>
                                </View>
                            </View>
                        </View>
                    </IndicatorViewPager>
                </View>
            </View >
        );
    }
}

function mapStateToProps(state) {
    return {
        //Updated LimitConfigReducer  
        Listdata: state.LimitConfigReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform getWalletType Action 
        getWalletType: () => dispatch(getWalletType()),
        //for add  api data
        addLimitsConfiguration: (add) => dispatch(addLimitsConfiguration(add)),
        //for edit api data
        UpdateLimitsConfiguration: (edit) => dispatch(UpdateLimitsConfiguration(edit)),
        //for add edit data clear
        clearLimitConfigured: () => dispatch(clearLimitConfigured()),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LimitConfigAddEditScreen)