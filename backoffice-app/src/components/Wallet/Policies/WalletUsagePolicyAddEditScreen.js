import {
    View,
    ScrollView,
    Keyboard,
    FlatList,
    Text
} from 'react-native';
import React from 'react'
import { Component } from 'react';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../../native_theme/components/CustomToolbar'
import EditText from '../../../native_theme/components/EditText'
import Button from '../../../native_theme/components/Button';
import { connect } from 'react-redux';
import { isCurrentScreen } from '../../Navigation';
import { showAlert, changeTheme, parseArray, parseFloatVal, parseIntVal } from '../../../controllers/CommonUtils';
import { isEmpty, isInternet, validateResponseNew, validateIPaddress, isHtmlTag, isScriptTag } from '../../../validations/CommonValidation';
import CommonToast from '../../../native_theme/components/CommonToast';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import R from '../../../native_theme/R';
import { TitlePicker } from '../../widget/ComboPickerWidget';
import { getWalletType } from '../../../actions/PairListAction';
import moment from 'moment';
import IndicatorViewPager from '../../../native_theme/components/IndicatorViewPager';
import TimePickerWidget from '../../widget/TimePickerWidget';
import { FeatureSwitch } from '../../../native_theme/components/FeatureSwitch';
import { addWalletUsagePolicy, onUpdateWalletUsagePolicy, clearWalletPolicy } from '../../../actions/Wallet/WalletUsagePolicyAction';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import SafeView from '../../../native_theme/components/SafeView';
const { width } = R.screen();

function forLoop(array, superMethod) {
    for (let index = 0; index <= array.length - 1; index++) {
        superMethod(index, array[index]);
    }
}

//Create Common class for WalletUsagePolicyAddEditScreen
class WalletUsagePolicyAddEditScreen extends Component {

    constructor(props) {
        super(props);

        this.inputs = {};

        //item for edit from List screen 
        let item = props.navigation.state.params && props.navigation.state.params.item

        //item that check edit is true or not
        let edit = props.navigation.state.params && props.navigation.state.params.edit

        //for the allowed days chekboxes 
        let allowedDays = this.returnDays([R.strings.monday, R.strings.tuesday, R.strings.wednesday, R.strings.thursday, R.strings.friday, R.strings.saturday, R.strings.sunday])

        //if edit is true than fill chekboxes from  edit item response 
        if (edit && item.DayNo) {
            let dayNumber = item.DayNo.split(',');
            dayNumber.map(day => {
                let findIndex = allowedDays.findIndex(el => el.id === day);
                if (findIndex > -1) {
                    allowedDays[findIndex].selected = true
                }
            })
        }

        //Define All State initial state
        this.state = {
            edit: edit,
            item: item,
            allowedDays,

            walletTypes: [{ value: R.strings.Select_Type }],
            selectedWalletType: edit ? item.WalletType : R.strings.Select_Type,
            selectedWalletTypeCode: edit ? item.WalletTypeId : '',

            PolicyName: edit ? (item.PolicyName) : "",
            allowedIp: edit ? (item.AllowedIP) : "",
            allowedLocation: edit ? (item.AllowedLocation) : "",
            authType: edit ? (item.AuthenticationType).toString() : "",
            DailyTrnCount: edit ? item.DailyTrnCount.toString() : '',
            DailyTrnAmount: edit ? item.DailyTrnAmount.toString() : '',
            HourlyTrnCount: edit ? (item.HourlyTrnCount).toString() : "",
            HourlyTrnAmount: edit ? (item.HourlyTrnAmount).toString() : "",
            MonthlyTrnCount: edit ? item.MonthlyTrnCount.toString() : '',
            MonthlyTrnAmount: edit ? item.MonthlyTrnAmount.toString() : '',
            WeeklyTrnCount: edit ? item.WeeklyTrnCount.toString() : '',
            WeeklyTrnAmount: edit ? item.WeeklyTrnAmount.toString() : '',
            YearlyTrnCount: edit ? item.YearlyTrnCount.toString() : '',
            YearlyTrnAmount: edit ? item.YearlyTrnAmount.toString() : '',
            LifeTimeTrnCount: edit ? (item.LifeTimeTrnCount).toString() : "",
            LifeTimeTrnAmount: edit ? (item.LifeTimeTrnAmount).toString() : "",
            minAmount: edit ? (item.MinAmount).toString() : "",
            maxAmount: edit ? (item.MaxAmount).toString() : "",
            StartTime: edit ? (item.StartTime === null ? '' : moment(item.StartTime).format('hh:mm A')) : '',
            EndTime: edit ? (item.EndTime === null ? '' : moment(item.EndTime).format('hh:mm A')) : '',
            Status: edit ? (item.Status === 1 ? true : false) : false,

            isFirstTime: true,
            walletType: null,
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
                //call getWalletType api
                this.props.getWalletType();
            }
        }
    }

    returnDays = (permissions = []) => {
        let permis = [];
        forLoop(permissions, (index, el) => permis.push({ id: (index + 1).toString(), title: el, selected: false }))
        return permis;
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
        if (WalletUsagePolicyAddEditScreen.oldProps !== props) {
            WalletUsagePolicyAddEditScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            const { walletType } = props.Listdata;

            if (walletType) {
                try {
                    //if local walletType state is null or its not null and also different then new response then and only then validate response.
                    if (state.walletType == null || (state.walletType != null && walletType !== state.walletType)) {

                        //if  response is success then store walletType list else store empty list
                        if (validateResponseNew({ response: walletType, isList: true })) {
                            let res = parseArray(walletType.Types);

                            //for add transactionTypes
                            for (var key in res) {
                                let item = res[key];
                                item.value = item.TypeName;
                            }

                            let walletTypes = [
                                { value: R.strings.Select_Type },
                                ...res
                            ];

                            return { ...state, walletType, walletTypes };
                        } else {
                            return { ...state, walletType, walletTypes: [{ value: R.strings.Select_Type }] };
                        }
                    }
                } catch (e) {
                    return { ...state, walletTypes: [{ value: R.strings.Select_Type }] };
                }
            }
        }
        return null;
    }

    componentDidUpdate = async (prevProps, prevState) => {

        const { addWalletUsagePolicyData, updateWalletUsagePolicyData } = this.props.Listdata;

        if (addWalletUsagePolicyData !== prevProps.Listdata.addWalletUsagePolicyData) {
            // for show responce add
            if (addWalletUsagePolicyData) {
                try {
                    if (validateResponseNew({
                        response: addWalletUsagePolicyData,
                    })) {
                        showAlert(R.strings.Success, addWalletUsagePolicyData.ReturnMsg, 0, () => {
                            this.props.clearWalletPolicy()
                            this.props.navigation.state.params.onSuccess() // if add success call list method from back screen
                            this.props.navigation.goBack()
                        });
                    } else {
                        this.props.clearWalletPolicy()
                    }
                } catch (e) {
                    this.props.clearWalletPolicy()
                }
            }
        }

        if (updateWalletUsagePolicyData !== prevProps.Listdata.updateWalletUsagePolicyData) {
            // for show responce update
            if (updateWalletUsagePolicyData) {
                try {
                    if (validateResponseNew({
                        response: updateWalletUsagePolicyData
                    })) {
                        showAlert(R.strings.Success, updateWalletUsagePolicyData.ReturnMsg, 0, () => {
                            this.props.clearWalletPolicy()
                            this.props.navigation.state.params.onSuccess() // if update success call list method from back screen
                            this.props.navigation.goBack()
                        });
                    } else {
                        this.props.clearWalletPolicy()
                    }
                } catch (e) {
                    this.props.clearWalletPolicy()
                }
            }
        }
    }

    //Add Or Update Button Presss
    onPress = async (Id) => {

        if (!this.state.edit) {
            if (this.state.selectedWalletTypeCode === '' || this.state.selectedWalletType === R.strings.Select_Type) {
                this.toast.Show(R.strings.selectWalletType)
                return;
            }
        }

        //validations for Inputs 
        if (isEmpty(this.state.PolicyName)) {
            this.toast.Show(R.strings.enter + ' ' + R.strings.PolicyName)
            return;
        }

        if (isEmpty(this.state.allowedIp)) {
            this.toast.Show(R.strings.enter + ' ' + R.strings.allowedIp)
            return;
        }

        if (validateIPaddress(this.state.allowedIp)) {
            this.toast.Show(R.strings.enterValidIpAddress)
            return;
        }

        if (isEmpty(this.state.allowedLocation)) {
            this.toast.Show(R.strings.enter + ' ' + R.strings.allowedLocation)
            return;
        }

        if (isHtmlTag(this.state.allowedLocation)) {
            this.toast.Show(R.strings.htmlTagNotAllowed + ' ' + R.strings.allowedLocation)
            return;
        }

        if (isScriptTag(this.state.allowedLocation)) {
            this.toast.Show(R.strings.scriptTagNotAllowed + ' ' + R.strings.allowedLocation)
            return;
        }

        if (isEmpty(this.state.authType)) {
            this.toast.Show(R.strings.enter + ' ' + R.strings.authType)
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

        if (isEmpty(this.state.HourlyTrnCount)) {
            this.toast.Show(R.strings.enterHourlyTrnCount)
            return;
        }

        if (isEmpty(this.state.HourlyTrnAmount)) {
            this.toast.Show(R.strings.enterHourlyTrnAmount)
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

        if (isEmpty(this.state.WeeklyTrnCount)) {
            this.toast.Show(R.strings.enterWeeklyTrnCount)
            return;
        }

        if (isEmpty(this.state.WeeklyTrnAmount)) {
            this.toast.Show(R.strings.enterWeeklyTrnAmount)
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

        if (isEmpty(this.state.LifeTimeTrnCount)) {
            this.toast.Show(R.strings.enterLifeTimeTrnCount)
            return;
        }
        if (isEmpty(this.state.LifeTimeTrnAmount)) {
            this.toast.Show(R.strings.enterLifeTimeTrnAmount)
            return;
        }

        if (isEmpty(this.state.minAmount)) {
            this.toast.Show(R.strings.enterMinAmount)
            return;
        }

        if (isEmpty(this.state.maxAmount)) {
            this.toast.Show(R.strings.enterMaxAmount)
            return;
        }

        Keyboard.dismiss();

        //selected allowed days 
        var res = parseArray(this.state.allowedDays);
        var selectedDays = [];

        //for add selectedDays to request
        for (var keyDaysSelected in res) {
            let item = res[keyDaysSelected];
            if (item.selected === true)
                selectedDays.push(parseInt(res[keyDaysSelected].id))
        }

        //initial request 
        this.request = {
            Id: this.state.edit ? parseIntVal(this.state.item.Id) : parseIntVal(0), // 0  is fix value for insert 
            Status: parseFloatVal(this.state.Status === true ? 1 : 0),
            WalletType: parseIntVal(this.state.selectedWalletTypeCode),
            PolicyName: this.state.PolicyName,
            AllowedIP: this.state.allowedIp,
            AllowedLocation: this.state.allowedLocation,
            AuthenticationType: parseIntVal(this.state.authType),
            DailyTrnCount: parseIntVal(this.state.DailyTrnCount),
            DailyTrnAmount: parseFloatVal(this.state.DailyTrnAmount),
            HourlyTrnCount: parseIntVal(this.state.HourlyTrnCount),
            HourlyTrnAmount: parseFloat(this.state.HourlyTrnAmount),
            MonthlyTrnCount: parseIntVal(this.state.MonthlyTrnCount),
            MonthlyTrnAmount: parseFloatVal(this.state.MonthlyTrnAmount),
            WeeklyTrnCount: parseIntVal(this.state.WeeklyTrnCount),
            WeeklyTrnAmount: parseFloatVal(this.state.WeeklyTrnAmount),
            YearlyTrnCount: parseIntVal(this.state.YearlyTrnCount),
            YearlyTrnAmount: parseFloatVal(this.state.YearlyTrnAmount),
            LifeTimeTrnCount: parseIntVal(this.state.LifeTimeTrnCount),
            LifeTimeTrnAmount: parseFloat(this.state.LifeTimeTrnAmount),
            MaxAmount: parseFloatVal(this.state.maxAmount),
            MinAmount: parseFloatVal(this.state.minAmount),
            StartTime: this.state.StartTime === '' ? null : parseFloatVal(moment(this.state.StartTime, 'hh:mm A').format('x')),
            EndTime: this.state.EndTime === '' ? null : parseFloatVal(moment(this.state.EndTime, 'hh:mm A').format('x')),
            DayNo: selectedDays,
        }

        if (await isInternet()) {
            if (this.state.edit) {
                //call update Wallet Usage policy api
                this.props.onUpdateWalletUsagePolicy(this.request)
            }
            else {
                //call add Wallet Usage policy api
                this.props.addWalletUsagePolicy(this.request)
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

    onDaysChekboxPress = (checkBoxItem) => {
        let original = this.state.allowedDays;
        (original[(checkBoxItem.id) - 1].selected) = (!original[(checkBoxItem.id) - 1].selected);
        this.setState({ allowedDays: original });
    }

    render() {
        // Loading status for Progress bar which is fetching from reducer
        const { isAddWalletPolicy, isUpdateWalletPolicy, isWalletType } = this.props.Listdata;

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                {/* To Set Status Bas as per out theme */}
                <CommonStatusBar />

                {/* To Set ToolBar as per out theme */}
                <CustomToolbar
                    title={this.state.edit ? R.strings.updateWalletUsagePolicy : R.strings.addWalletUsagePolicy}
                    isBack={true}
                    nav={this.props.navigation}
                />

                {/* Progress Dialog */}
                <ProgressDialog isShow={isAddWalletPolicy || isUpdateWalletPolicy || isWalletType} />

                {/* for common toast */}
                <CommonToast ref={cmpToast => this.toast = cmpToast} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>

                    {/* View Pager Indicator (Tab) */}
                    <IndicatorViewPager
                        ref='walletPolicy'
                        style={{ flex: 1, flexDirection: 'column-reverse', 
                        marginLeft: R.dimens.activity_margin, marginRight: R.dimens.activity_margin,}}
                        titles={this.state.tabNames}
                        numOfItems={2}
                        horizontalScroll={false}
                        isGradient={true}  >

                        {/* First Tab */}
                        <View>
                            <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.padding_top_bottom_margin, paddingTop: R.dimens.padding_top_bottom_margin }}>
                                <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='always'>

                                    {/* for status switch */}
                                    <FeatureSwitch
                                        isGradient={true}
                                        title={R.strings.Status}
                                        isToggle={this.state.Status}
                                        onValueChange={() => {
                                            this.setState({
                                                Status: !this.state.Status
                                            })
                                        }}
                                        textStyle={{ color: R.colors.white }}
                                    />

                                    {/* Picker for WalletType */}
                                    {!this.state.edit &&
                                        <TitlePicker
                                            isRequired={true}
                                            title={R.strings.WalletType}
                                            array={this.state.walletTypes}
                                            selectedValue={this.state.selectedWalletType}
                                            onPickerSelect={(index, object) => this.setState({ selectedWalletType: index, selectedWalletTypeCode: object.ID })}
                                            style={{ marginTop: R.dimens.widget_top_bottom_margin }}
                                        />}

                                    {/* EditText for PolicyName  */}
                                    <EditText
                                        isRequired={true}
                                        header={R.strings.PolicyName}
                                        placeholder={R.strings.PolicyName}
                                        onChangeText={(text) => this.setState({ PolicyName: text })}
                                        value={this.state.PolicyName}
                                        keyboardType={'default'}
                                        multiline={false}
                                        reference={input => { this.inputs['PolicyName'] = input; }}
                                        onSubmitEditing={() => { this.focusNextField('allowedIp') }}
                                        returnKeyType={"next"}
                                    />

                                    {/* EditText for allowedIp  */}
                                    <EditText
                                        isRequired={true}
                                        header={R.strings.allowedIp}
                                        placeholder={R.strings.allowedIp}
                                        onChangeText={(text) => this.setState({ allowedIp: text })}
                                        value={this.state.allowedIp}
                                        keyboardType={'numeric'}
                                        multiline={false}
                                        reference={input => { this.inputs['allowedIp'] = input; }}
                                        onSubmitEditing={() => { this.focusNextField('allowedLocation') }}
                                        returnKeyType={"next"}
                                    />

                                    {/* EditText for allowedLocation  */}
                                    <EditText
                                        isRequired={true}
                                        header={R.strings.allowedLocation}
                                        placeholder={R.strings.allowedLocation}
                                        onChangeText={(text) => this.setState({ allowedLocation: text })}
                                        value={this.state.allowedLocation}
                                        keyboardType={'default'}
                                        multiline={false}
                                        reference={input => { this.inputs['allowedLocation'] = input; }}
                                        onSubmitEditing={() => { this.focusNextField('authType') }}
                                        returnKeyType={"next"}
                                    />

                                    {/* EditText for authentication Type */}
                                    <EditText
                                        isRequired={true}
                                        header={R.strings.authType}
                                        placeholder={R.strings.authType}
                                        onChangeText={(text) => this.setState({ authType: text })}
                                        value={this.state.authType}
                                        keyboardType={'numeric'}
                                        multiline={false}
                                        reference={input => { this.inputs['authType'] = input; }}
                                        onSubmitEditing={() => { this.focusNextField('DailyTrnCount') }}
                                        returnKeyType={"next"}
                                        validate={true}
                                        onlyDigit={true}
                                    />

                                    {/* EditText for dailyTrnCount */}
                                    <EditText
                                        isRequired={true}
                                        validate={true}
                                        onlyDigit={true}
                                        header={R.strings.dailyTrnCount}
                                        reference={input => { this.inputs['DailyTrnCount'] = input; }}
                                        placeholder={R.strings.setZeroToDisable}
                                        multiline={false}
                                        keyboardType='numeric'
                                        returnKeyType={"next"}
                                        blurOnSubmit={false}
                                        onChangeText={(Label) => this.setState({ DailyTrnCount: Label })}
                                        onSubmitEditing={() => { this.focusNextField('dailyTrnAmount') }}
                                        value={this.state.DailyTrnCount}
                                    />

                                    {/* EditText for dailyTrnAmount */}
                                    <EditText
                                        isRequired={true}
                                        validate={true}
                                        header={R.strings.dailyTrnAmount}
                                        reference={input => { this.inputs['dailyTrnAmount'] = input; }}
                                        onSubmitEditing={() => { this.focusNextField('HourlyTrnCount') }}
                                        placeholder={R.strings.setZeroToDisable}
                                        multiline={false}
                                        keyboardType='numeric'
                                        returnKeyType={"next"}
                                        onChangeText={(Label) => this.setState({ DailyTrnAmount: Label })}
                                        value={this.state.DailyTrnAmount}
                                    />

                                    {/* EditText for HourlyTrnCount */}
                                    <EditText
                                        isRequired={true}
                                        validate={true}
                                        onlyDigit={true}
                                        header={R.strings.hourlyTrnCount}
                                        reference={input => { this.inputs['HourlyTrnCount'] = input; }}
                                        placeholder={R.strings.setZeroToDisable}
                                        multiline={false}
                                        keyboardType='numeric'
                                        returnKeyType={"next"}
                                        blurOnSubmit={false}
                                        onChangeText={(Label) => this.setState({ HourlyTrnCount: Label })}
                                        onSubmitEditing={() => { this.focusNextField('HourlyTrnAmount') }}
                                        value={this.state.HourlyTrnCount}
                                    />

                                    {/* EditText for HourlyTrnAmount */}
                                    <EditText
                                        isRequired={true}
                                        validate={true}
                                        header={R.strings.hourlyTrnAmount}
                                        reference={input => { this.inputs['HourlyTrnAmount'] = input; }}
                                        onSubmitEditing={() => { this.focusNextField('monthlyTrnCount') }}
                                        placeholder={R.strings.setZeroToDisable}
                                        multiline={false}
                                        keyboardType='numeric'
                                        returnKeyType={"next"}
                                        onChangeText={(Label) => this.setState({ HourlyTrnAmount: Label })}
                                        value={this.state.HourlyTrnAmount}
                                    />

                                    {/* EditText for monthlyTrnCount */}
                                    <EditText
                                        isRequired={true}
                                        validate={true}
                                        onlyDigit={true}
                                        header={R.strings.monthlyTrnCount}
                                        reference={input => { this.inputs['monthlyTrnCount'] = input; }}
                                        placeholder={R.strings.setZeroToDisable}
                                        multiline={false}
                                        keyboardType='numeric'
                                        returnKeyType={"next"}
                                        blurOnSubmit={false}
                                        onChangeText={(Label) => this.setState({ MonthlyTrnCount: Label })}
                                        onSubmitEditing={() => { this.focusNextField('monthlyTrnAmount') }}
                                        value={this.state.MonthlyTrnCount}
                                    />

                                    {/* EditText for monthlyTrnAmount */}
                                    <EditText
                                        isRequired={true}
                                        validate={true}
                                        header={R.strings.monthlyTrnAmount}
                                        reference={input => { this.inputs['monthlyTrnAmount'] = input; }}
                                        placeholder={R.strings.setZeroToDisable}
                                        multiline={false}
                                        keyboardType='numeric'
                                        returnKeyType={"next"}
                                        blurOnSubmit={false}
                                        onChangeText={(Label) => this.setState({ MonthlyTrnAmount: Label })}
                                        onSubmitEditing={() => { this.focusNextField('weeklyTrnCount') }}
                                        value={this.state.MonthlyTrnAmount}
                                    />

                                    {/* EditText for weeklyTrnCount */}
                                    <EditText
                                        isRequired={true}
                                        validate={true}
                                        onlyDigit={true}
                                        header={R.strings.weeklyTrnCount}
                                        reference={input => { this.inputs['weeklyTrnCount'] = input; }}
                                        placeholder={R.strings.setZeroToDisable}
                                        multiline={false}
                                        keyboardType='numeric'
                                        returnKeyType={"next"}
                                        blurOnSubmit={false}
                                        onChangeText={(Label) => this.setState({ WeeklyTrnCount: Label })}
                                        onSubmitEditing={() => { this.focusNextField('weeklyTrnAmount') }}
                                        value={this.state.WeeklyTrnCount}
                                    />

                                    {/* EditText for weeklyTrnAmount */}
                                    <EditText
                                        isRequired={true}
                                        header={R.strings.weeklyTrnAmount}
                                        reference={input => { this.inputs['weeklyTrnAmount'] = input; }}
                                        placeholder={R.strings.setZeroToDisable}
                                        multiline={false}
                                        keyboardType='numeric'
                                        returnKeyType={"next"}
                                        blurOnSubmit={false}
                                        onChangeText={(Label) => this.setState({ WeeklyTrnAmount: Label })}
                                        value={this.state.WeeklyTrnAmount}
                                    />

                                </ScrollView>
                            </View>
                        </View>

                        {/* secrrr Tab */}
                        <View>
                            <View style={{ flex: 1, justifyContent: 'space-between', paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.padding_top_bottom_margin, paddingTop: R.dimens.padding_top_bottom_margin }}>
                                <ScrollView showsVerticalScrollIndicator={false} >

                                    {/* EditText for yearlyTrnCount */}
                                    <EditText
                                        style={{ marginTop: 0 }}
                                        isRequired={true}
                                        validate={true}
                                        onlyDigit={true}
                                        header={R.strings.yearlyTrnCount}
                                        reference={input => { this.inputs['yearlyTrnCount'] = input; }}
                                        placeholder={R.strings.setZeroToDisable}
                                        multiline={false}
                                        keyboardType='numeric'
                                        returnKeyType={"next"}
                                        onChangeText={(Label) => this.setState({ YearlyTrnCount: Label })}
                                        onSubmitEditing={() => { this.focusNextField('yearlyTrnAmount') }}
                                        value={this.state.YearlyTrnCount}
                                    />

                                    {/* EditText for yearlyTrnAmount */}
                                    <EditText
                                        isRequired={true}
                                        validate={true}
                                        header={R.strings.yearlyTrnAmount}
                                        reference={input => { this.inputs['yearlyTrnAmount'] = input; }}
                                        onSubmitEditing={() => { this.focusNextField('LifeTimeTrnCount') }}
                                        placeholder={R.strings.setZeroToDisable}
                                        multiline={false}
                                        keyboardType='numeric'
                                        returnKeyType={"done"}
                                        blurOnSubmit={false}
                                        onChangeText={(Label) => this.setState({ YearlyTrnAmount: Label })}
                                        value={this.state.YearlyTrnAmount}
                                    />

                                    {/* EditText for yearlyTrnCount */}
                                    <EditText
                                        isRequired={true}
                                        validate={true}
                                        onlyDigit={true}
                                        header={R.strings.lifeTimeTrnCount}
                                        reference={input => { this.inputs['LifeTimeTrnCount'] = input; }}
                                        placeholder={R.strings.setZeroToDisable}
                                        multiline={false}
                                        keyboardType='numeric'
                                        returnKeyType={"next"}
                                        onChangeText={(Label) => this.setState({ LifeTimeTrnCount: Label })}
                                        onSubmitEditing={() => { this.focusNextField('LifeTimeTrnAmount') }}
                                        value={this.state.LifeTimeTrnCount}
                                    />

                                    {/* EditText for LifeTimeTrnAmount */}
                                    <EditText
                                        isRequired={true}
                                        validate={true}
                                        header={R.strings.lifeTimeTrnAmount}
                                        reference={input => { this.inputs['LifeTimeTrnAmount'] = input; }}
                                        onSubmitEditing={() => { this.focusNextField('minAmount') }}
                                        placeholder={R.strings.setZeroToDisable}
                                        multiline={false}
                                        keyboardType='numeric'
                                        returnKeyType={"next"}
                                        blurOnSubmit={false}
                                        onChangeText={(Label) => this.setState({ LifeTimeTrnAmount: Label })}
                                        value={this.state.LifeTimeTrnAmount}
                                    />

                                    {/* EditText for MinAmount */}
                                    <EditText
                                        isRequired={true}
                                        validate={true}
                                        header={R.strings.minAmount}
                                        reference={input => { this.inputs['minAmount'] = input; }}
                                        onSubmitEditing={() => { this.focusNextField('maxAmount') }}
                                        placeholder={R.strings.setZeroToDisable}
                                        multiline={false}
                                        keyboardType='numeric'
                                        returnKeyType={"next"}
                                        blurOnSubmit={false}
                                        onChangeText={(Label) => this.setState({ minAmount: Label })}
                                        value={this.state.minAmount}
                                    />

                                    {/* EditText for MaxAmount */}
                                    <EditText
                                        isRequired={true}
                                        validate={true}
                                        header={R.strings.maxAmount}
                                        reference={input => { this.inputs['maxAmount'] = input; }}
                                        placeholder={R.strings.setZeroToDisable}
                                        multiline={false}
                                        keyboardType='numeric'
                                        returnKeyType={"done"}
                                        blurOnSubmit={false}
                                        onChangeText={(Label) => this.setState({ maxAmount: Label })}
                                        value={this.state.maxAmount}
                                    />


                                    {/* For StartTime and EndTime Picker and Its View */}
                                    <TimePickerWidget
                                        StartTimePickerCall={(StartTime) => this.setState({ StartTime })}
                                        EndTimePickerCall={(EndTime) => this.setState({ EndTime })}
                                        StartTime={this.state.StartTime}
                                        EndTime={this.state.EndTime} />

                                    {/* For allowed days */}

                                    <View style={{ marginTop: R.dimens.widget_top_bottom_margin, marginBottom: R.dimens.margin }}>

                                        <Text style={{ marginLeft: R.dimens.LineHeight, color: R.colors.textPrimary, fontSize: R.dimens.smallText }}>{R.strings.allowedDays}
                                        </Text>
                                        <FlatList
                                            data={this.state.allowedDays}
                                            showsVerticalScrollIndicator={false}
                                            extraData={this.state}
                                            renderItem={({ item, index }) =>
                                                <WalletUsagePolicyAddEditItem
                                                    index={index}
                                                    item={item}
                                                    onPress={(checkBoxItem) => this.onDaysChekboxPress(checkBoxItem)}
                                                />
                                            }
                                            keyExtractor={item => item.id}
                                            numColumns={2}
                                        />
                                    </View>

                                </ScrollView>
                                <View>
                                    {/* To Set Add or Edit Button */}
                                    <Button title={this.state.edit ? R.strings.update : R.strings.Add} onPress={() => this.onPress(this.state.edit ? this.state.item.Id : null)}></Button>
                                </View>
                            </View>
                        </View>
                    </IndicatorViewPager>
                </View>
            </SafeView>
        );
    }
}

// This Class is used for display DAYS 
class WalletUsagePolicyAddEditItem extends Component {

    render() {

        // Get required fields from props
        let { item } = this.props;

        return (
            <View style={[{ width: (width - (R.dimens.activity_margin * 2)) / 2, alignItems: 'flex-start' },]} >
                <ImageTextButton
                    name={item.title}
                    icon={item.selected ? R.images.FILL_CHECKBOX : R.images.EMPTY_CHECKBOX}
                    onPress={() => this.props.onPress(item)}
                    style={{ margin: R.dimens.widgetMargin, flexDirection: 'row-reverse' }}
                    textStyle={{ marginLeft: R.dimens.LineHeight, color: R.colors.textPrimary }}
                    iconStyle={{ tintColor: R.colors.accent, width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon }}
                />
            </View>
        )
    }
}

function mapStateToProps(state) {
    return {
        //Updated WalletUsagePolicyReducer data
        Listdata: state.WalletUsagePolicyReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform  getWalletType Api Data
        getWalletType: () => dispatch(getWalletType()),
        //for addWalletUsagePolicy  api data
        addWalletUsagePolicy: (add) => dispatch(addWalletUsagePolicy(add)),
        //for onUpdateWalletUsagePolicy api data
        onUpdateWalletUsagePolicy: (edit) => dispatch(onUpdateWalletUsagePolicy(edit)),
        //for add edit data clear
        clearWalletPolicy: () => dispatch(clearWalletPolicy()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WalletUsagePolicyAddEditScreen)