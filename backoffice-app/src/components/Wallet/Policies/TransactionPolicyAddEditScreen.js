import {
    Keyboard,
    View, ScrollView,
} from 'react-native';
import R from '../../../native_theme/R';
import { TitlePicker } from '../../widget/ComboPickerWidget';
import { getWalletTransactionType, getRoleDetails } from '../../../actions/PairListAction';
import moment from 'moment';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { FeatureSwitch } from '../../../native_theme/components/FeatureSwitch';
import { addTransactionPolicy, onUpdateTransactionPolicy, clearTransactionPolicy } from '../../../actions/Wallet/TransactionPolicyAction';
import SafeView from '../../../native_theme/components/SafeView';
import React from 'react'
import { showAlert, changeTheme, parseArray, parseFloatVal, parseIntVal } from '../../../controllers/CommonUtils';
import { isEmpty, isInternet, validateResponseNew, validateIPaddress, isHtmlTag, isScriptTag } from '../../../validations/CommonValidation';
import CommonToast from '../../../native_theme/components/CommonToast';
import IndicatorViewPager from '../../../native_theme/components/IndicatorViewPager';
import TimePickerWidget from '../../widget/TimePickerWidget';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../../native_theme/components/CustomToolbar'
import EditText from '../../../native_theme/components/EditText'
import Button from '../../../native_theme/components/Button';
import { connect } from 'react-redux';
import { Component } from 'react';
import { isCurrentScreen } from '../../Navigation';

//Create Common class for TransactionPolicyAddEditScreen
class TransactionPolicyAddEditScreen extends Component {

    constructor(props) {
        super(props);

        this.inputs = {};
        //item for edit from List screen 
        let item = props.navigation.state.params && props.navigation.state.params.item

        //item that check edit is true or not
        let edit = props.navigation.state.params && props.navigation.state.params.edit

        //Define All State initial state
        this.state = {
            item: item,
            edit: edit,

            selectedTransactionType: edit ? item.StrTrnType : R.strings.Select_Type,
            selectedTransactionTypeCode: edit ? item.TrnType : '',
            transactionTypes: [{ value: R.strings.Select_Type }],

            selectedRole: edit ? item.RoleName : R.strings.Select_Type,
            roles: [{ value: R.strings.Select_Type }],
            selectedRoleCode: edit ? item.RoleId : '',

            allowedIp: edit ? (item.AllowedIP) : "",
            allowedLocation: edit ? (item.AllowedLocation) : "",
            authType: edit ? (item.AuthenticationType).toString() : "",
            DailyTrnCount: edit ? item.DailyTrnCount.toString() : '',
            DailyTrnAmount: edit ? item.DailyTrnAmount.toString() : '',
            MonthlyTrnCount: edit ? item.MonthlyTrnCount.toString() : '',
            MonthlyTrnAmount: edit ? item.MonthlyTrnAmount.toString() : '',
            WeeklyTrnCount: edit ? item.WeeklyTrnCount.toString() : '',
            WeeklyTrnAmount: edit ? item.WeeklyTrnAmount.toString() : '',
            YearlyTrnCount: edit ? item.YearlyTrnCount.toString() : '',
            YearlyTrnAmount: edit ? item.YearlyTrnAmount.toString() : '',
            minAmount: edit ? (item.MinAmount).toString() : "",
            maxAmount: edit ? (item.MaxAmount).toString() : "",
            authorityType: edit ? (item.AuthorityType).toString() : "",
            allowedUserType: edit ? (item.AllowedUserType).toString() : "",
            StartTime: edit ? (item.StartTime === null ? '' : moment(item.StartTime).format('hh:mm A')) : '',
            EndTime: edit ? (item.EndTime === null ? '' : moment(item.EndTime).format('hh:mm A')) : '',
            Status: edit ? (item.Status === 1 ? true : false) : false,
            IsKYCEnable: edit ? (item.IsKYCEnable === 1 ? true : false) : false,

            isFirstTime: true,
            transactionPolicyData: null,
            roleDetails: null,
            walletTransactionType: null,
            tabNames: ['Step-1', 'Step-2'],
        }

        // Create reference
        this.toast = React.createRef();
    }

    async componentDidMount() {

        //Add this method to change theme based on stored theme name.
        changeTheme();

        //if edit is false than only api call 
        if (!this.state.edit) {
            if (await isInternet()) {
                //call getWalletTransactionType api
                this.props.getWalletTransactionType();
                //call getRoleDetails api
                this.props.getRoleDetails()
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
                ...state, isFirstTime: false,
            };
        }

        // To Skip Render if old and new props are equal
        if (TransactionPolicyAddEditScreen.oldProps !== props) {
            TransactionPolicyAddEditScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            const { walletTransactionType, roleDetails } = props.Listdata;

            if (walletTransactionType) {
                try {
                    //if local walletTransactionType state is null or its not null and also different then new response then and only then validate response.
                    if (state.walletTransactionType == null || (state.walletTransactionType != null && walletTransactionType !== state.walletTransactionType)) {

                        //if  response is success then store walletTransactionType list else store empty list
                        if (validateResponseNew({ response: walletTransactionType, isList: true })) {
                            let res = parseArray(walletTransactionType.Data);

                            //for add transactionTypes
                            for (var key in res) {
                                let item = res[key]; item.value = item.TypeName;
                            }

                            let transactionTypes = [
                                { value: R.strings.Select_Type },
                                ...res
                            ];

                            return {
                                ...state,
                                walletTransactionType,
                                transactionTypes
                            };
                        } else {
                            return {
                                ...state,
                                walletTransactionType,
                                transactionTypes: [{ value: R.strings.Select_Type }]
                            };
                        }
                    }
                } catch (e) {
                    return {
                        ...state,
                        transactionTypes: [{ value: R.strings.Select_Type }]
                    };
                }
            }

            if (roleDetails) {
                try {
                    //if local roleDetails state is null or its not null and also different then new response then and only then validate response.
                    if (state.roleDetails == null || (state.roleDetails != null && roleDetails !== state.roleDetails)) {

                        //if  response is success then store roleDetails list else store empty list
                        if (validateResponseNew({ response: roleDetails, isList: true })) {
                            let res = parseArray(roleDetails.Roles);
                            //for add roleDetails
                            for (var roleDetailsKey in res) {
                                let item = res[roleDetailsKey];
                                item.value = item.RoleName;
                            }

                            let roles = [
                                {
                                    value: R.strings.Select_Type
                                },
                                ...res
                            ];

                            return {
                                ...state,
                                roleDetails,
                                roles
                            };
                        } else {
                            return {
                                ...state,
                                roleDetails,
                                roles: [{ value: R.strings.Select_Type }]
                            };
                        }
                    }
                } catch (e) {
                    return {
                        ...state,
                        roles: [{ value: R.strings.Select_Type }]
                    };
                }
            }
        }
        return null;
    }

    componentDidUpdate = async (prevProps, prevState) => {

        const { addTransactionData, updateTransactionData } = this.props.Listdata;

        if (addTransactionData !== prevProps.Listdata.addTransactionData) {
            // for show responce add
            if (addTransactionData) {
                try {
                    if (validateResponseNew({
                        response: addTransactionData,
                    })) {
                        showAlert(R.strings.Success, addTransactionData.ReturnMsg, 0, () => {
                            this.props.clearTransactionPolicy()
                            this.props.navigation.state.params.onSuccess() // if add success call list method from back screen
                            this.props.navigation.goBack()
                        });
                    } else {
                        this.props.clearTransactionPolicy()
                    }
                } catch (e) {
                    this.props.clearTransactionPolicy()
                }
            }
        }

        if (updateTransactionData !== prevProps.Listdata.updateTransactionData) {
            // for show responce update
            if (updateTransactionData) {
                try {
                    if (validateResponseNew({
                        response: updateTransactionData
                    })) {
                        showAlert(R.strings.Success, updateTransactionData.ReturnMsg, 0, () => {
                            this.props.clearTransactionPolicy()
                            this.props.navigation.state.params.onSuccess() // if update success call list method from back screen
                            this.props.navigation.goBack()
                        });
                    } else {
                        this.props.clearTransactionPolicy()
                    }
                } catch (e) {
                    this.props.clearTransactionPolicy()
                }
            }
        }
    }

    //Add Or Update Button Presss
    onPress = async (Id) => {

        if (!this.state.edit) {
            if (this.state.selectedTransactionTypeCode === '' || this.state.selectedTransactionType === R.strings.Select_Type) {
                this.toast.Show(R.strings.selectTransactionType)
                return;
            }
            if (this.state.selectedRoleCode === '' || this.state.selectedRole === R.strings.Select_Type) {
                this.toast.Show(R.strings.selectRoleMsg)
                return;
            }
        }

        //validations for Inputs 
        if (isEmpty(this.state.allowedIp)) 
        {
            this.toast.Show(R.strings.enter + ' ' + R.strings.allowedIp)
            return;
        }

        if (validateIPaddress(this.state.allowedIp)) 
        {
            this.toast.Show(R.strings.enterValidIpAddress)
            return;
        }

        if (isEmpty(this.state.allowedLocation)) 
        {
            this.toast.Show(R.strings.enter + ' ' + R.strings.allowedLocation)
            return;
        }

        if (isHtmlTag(this.state.allowedLocation)) 
        {
            this.toast.Show(R.strings.htmlTagNotAllowed + ' ' + R.strings.allowedLocation)
            return;
        }


        if (isEmpty(this.state.authType)) 
        {
            this.toast.Show(R.strings.enter + ' ' + R.strings.authType)
            return;
        }
        if (isScriptTag(this.state.allowedLocation)) 
        {
            this.toast.Show(R.strings.scriptTagNotAllowed + ' ' + R.strings.allowedLocation)
            return;
        }

        if (isEmpty(this.state.DailyTrnCount)) 
        {
            this.toast.Show(R.strings.enterDailyTrnCount)
            return;
        }
        if (isEmpty(this.state.MonthlyTrnCount)) 
        {
            this.toast.Show(R.strings.enterMonthlyTrnCount)
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
        if (isEmpty(this.state.YearlyTrnAmount)) {
            this.toast.Show(R.strings.enterYearlyTrnAmount)
            return;
        }

        if (isEmpty(this.state.authorityType)) {
            this.toast.Show(R.strings.enter + ' ' + R.strings.authorityType)
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

        if (isEmpty(this.state.minAmount)) {
            this.toast.Show(R.strings.enterMinAmount)
            return;
        }


        if (isEmpty(this.state.allowedUserType)) {
            this.toast.Show(R.strings.enter + ' ' + R.strings.allowedUserType)
            return;
        }
        if (isEmpty(this.state.maxAmount)) {
            this.toast.Show(R.strings.enterMaxAmount)
            return;
        }


        Keyboard.dismiss();

        //initial request 
        this.request = {
            StartTime: this.state.StartTime === '' ? null : parseFloatVal(moment(this.state.StartTime, 'hh:mm A').format('x')),
            EndTime: this.state.EndTime === '' ? null : parseFloatVal(moment(this.state.EndTime, 'hh:mm A').format('x')),
            Status: parseFloatVal(this.state.Status === true ? 1 : 0),
            DailyTrnCount: parseIntVal(this.state.DailyTrnCount),
            DailyTrnAmount: parseFloatVal(this.state.DailyTrnAmount),
            WeeklyTrnCount: parseIntVal(this.state.WeeklyTrnCount),
            WeeklyTrnAmount: parseFloatVal(this.state.WeeklyTrnAmount),
            MonthlyTrnCount: parseIntVal(this.state.MonthlyTrnCount),
            MonthlyTrnAmount: parseFloatVal(this.state.MonthlyTrnAmount),
            YearlyTrnCount: parseIntVal(this.state.YearlyTrnCount),
            YearlyTrnAmount: parseFloatVal(this.state.YearlyTrnAmount),
            AllowedIP: this.state.allowedIp,
            AllowedLocation: this.state.allowedLocation,
            AllowedUserType: parseIntVal(this.state.allowedUserType),
            AuthenticationType: parseIntVal(this.state.authType),
            AuthorityType: parseIntVal(this.state.authorityType),
            MaxAmount: parseFloatVal(this.state.maxAmount),
            MinAmount: parseFloatVal(this.state.minAmount),
        }

        if (await isInternet()) {
            if (this.state.edit) {
                //request for update transaction policy
                this.request = {
                    ...this.request,
                    TrnPolicyId: parseIntVal(Id),
                }

                //call update Transaction policy api
                this.props.onUpdateTransactionPolicy(this.request)
            }
            else {
                //request for add transaction policy
                this.request = {
                    ...this.request,
                    TrnType: parseIntVal(this.state.selectedTransactionTypeCode),
                    RoleId: parseIntVal(this.state.selectedRoleCode),
                    IsKYCEnable: parseIntVal(this.state.IsKYCEnable === true ? 1 : 0),
                }

                //call add Transaction policy api
                this.props.addTransactionPolicy(this.request)
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
        const { isAddPolicy, isUpdatePolicy, isWalletTransactionType, isRoleFetching } = this.props.Listdata;
        return (

            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                {/* To Set Status Bas as per out theme */}
                <CommonStatusBar />

                {/* To Set ToolBar as per out theme */}
                <CustomToolbar
                    title={this.state.edit ? R.strings.updateTransactionPolicy : R.strings.addTransactionPolicy}
                    isBack={true}
                    nav={this.props.navigation}
                />

                {/* Progress Dialog */}
                <ProgressDialog isShow={isAddPolicy || isUpdatePolicy || isWalletTransactionType || isRoleFetching} />

                {/* for common toast */}
                <CommonToast
                    ref={
                        cmpToast => this.toast = cmpToast
                    } />

                <View style={{
                    flex: 1,
                    justifyContent: 'space-between'
                }}>

                    {/* View Pager Indicator (Tab) */}
                    <IndicatorViewPager
                        onPageScroll={this.onPageScroll.bind(this)}
                        style={{ flex: 1, flexDirection: 'column-reverse', }}
                        isGradient={true}
                        numOfItems={2}
                        titles={this.state.tabNames}
                        horizontalScroll={false}
                        ref='transactionPolicy'
                        style={{
                            marginLeft: R.dimens.activity_margin,
                            marginRight: R.dimens.activity_margin,
                        }}
                    >

                        {/* First Tab */}
                        <View>
                            <View
                                style={{
                                    paddingLeft: R.dimens.activity_margin,
                                    paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.padding_top_bottom_margin, paddingTop: R.dimens.padding_top_bottom_margin
                                }}>
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

                                    {/* Picker for transactionType */}
                                    {!this.state.edit &&
                                        <TitlePicker
                                            isRequired={true}
                                            title={R.strings.transType}
                                            array={this.state.transactionTypes}
                                            selectedValue={this.state.selectedTransactionType}
                                            onPickerSelect={(index, object) => this.setState({ selectedTransactionType: index, selectedTransactionTypeCode: object.TypeId })}
                                            style={{ marginTop: R.dimens.widget_top_bottom_margin }}
                                        />}

                                    {/* Picker for Roles */}
                                    {!this.state.edit &&
                                        <TitlePicker
                                            isRequired={true}
                                            title={R.strings.Role}
                                            array={this.state.roles}
                                            selectedValue={this.state.selectedRole}
                                            onPickerSelect={(index, object) => this.setState({ selectedRole: index, selectedRoleCode: object.ID })}
                                            style={{ marginTop: R.dimens.widget_top_bottom_margin }}
                                        />
                                    }

                                    {/* EditText for allowedIp  */}
                                    <EditText
                                        keyboardType={'numeric'}
                                        returnKeyType={"next"}
                                        header={R.strings.allowedIp}
                                        placeholder={R.strings.allowedIp}
                                        onChangeText={(text) => this.setState({ allowedIp: text })}
                                        value={this.state.allowedIp}
                                        multiline={false}
                                        reference={input => { this.inputs['allowedIp'] = input; }}
                                        onSubmitEditing={() => { this.focusNextField('allowedLocation') }}
                                        isRequired={true}
                                    />

                                    {/* EditText for allowedLocation  */}
                                    <EditText
                                        multiline={false}
                                        reference={input => { this.inputs['allowedLocation'] = input; }}
                                        onSubmitEditing={() => { this.focusNextField('authType') }}
                                        header={R.strings.allowedLocation}
                                        placeholder={R.strings.allowedLocation}
                                        onChangeText={(text) => this.setState({ allowedLocation: text })}
                                        value={this.state.allowedLocation}
                                        keyboardType={'default'}
                                        isRequired={true}
                                        returnKeyType={"next"}
                                    />

                                    {/* EditText for authentication Type */}
                                    <EditText
                                        reference={input => { this.inputs['authType'] = input; }}
                                        onSubmitEditing={() => { this.focusNextField('DailyTrnCount') }}
                                        returnKeyType={"next"}
                                        validate={true}
                                        onlyDigit={true}
                                        isRequired={true}
                                        header={R.strings.authType}
                                        placeholder={R.strings.authType}
                                        onChangeText={(text) => this.setState({ authType: text })}
                                        value={this.state.authType}
                                        keyboardType={'numeric'}
                                        multiline={false}
                                    />

                                    {/* EditText for dailyTrnCount */}
                                    <EditText
                                        keyboardType='numeric'
                                        returnKeyType={"next"}
                                        blurOnSubmit={false}
                                        onChangeText={(Label) => this.setState({ DailyTrnCount: Label })}
                                        onSubmitEditing={() => { this.focusNextField('dailyTrnAmount') }}
                                        isRequired={true}
                                        placeholder={R.strings.setZeroToDisable}
                                        multiline={false}
                                        value={this.state.DailyTrnCount}
                                        validate={true}
                                        onlyDigit={true}
                                        header={R.strings.dailyTrnCount}
                                        reference={input => { this.inputs['DailyTrnCount'] = input; }}
                                    />

                                    {/* EditText for dailyTrnAmount */}
                                    <EditText
                                        returnKeyType={"done"}
                                        onChangeText={(Label) => this.setState({ DailyTrnAmount: Label })}
                                        value={this.state.DailyTrnAmount}
                                        isRequired={true}
                                        validate={true}
                                        header={R.strings.dailyTrnAmount}
                                        reference={input => { this.inputs['dailyTrnAmount'] = input; }}
                                        onSubmitEditing={() => { this.focusNextField('monthlyTrnCount') }}
                                        placeholder={R.strings.setZeroToDisable}
                                        multiline={false}
                                        keyboardType='numeric'
                                    />

                                    {/* EditText for monthlyTrnCount */}
                                    <EditText
                                        isRequired={true}
                                        onSubmitEditing={() => { this.focusNextField('monthlyTrnAmount') }}
                                        validate={true}
                                        onlyDigit={true}
                                        keyboardType='numeric'
                                        returnKeyType={"next"}
                                        blurOnSubmit={false}
                                        header={R.strings.monthlyTrnCount}
                                        reference={input => { this.inputs['monthlyTrnCount'] = input; }}
                                        placeholder={R.strings.setZeroToDisable}
                                        multiline={false}
                                        onChangeText={(Label) => this.setState({ MonthlyTrnCount: Label })}
                                        value={this.state.MonthlyTrnCount}
                                    />

                                    {/* EditText for monthlyTrnAmount */}
                                    <EditText
                                        onSubmitEditing={() => { this.focusNextField('weeklyTrnCount') }}
                                        value={this.state.MonthlyTrnAmount}
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
                                    />

                                    {/* EditText for weeklyTrnCount */}
                                    <EditText
                                        onChangeText={(Label) => this.setState({ WeeklyTrnCount: Label })}
                                        onSubmitEditing={() => { this.focusNextField('weeklyTrnAmount') }}
                                        value={this.state.WeeklyTrnCount}
                                        isRequired={true}
                                        validate={true}
                                        onlyDigit={true}
                                        reference={input => { this.inputs['weeklyTrnCount'] = input; }}
                                        placeholder={R.strings.setZeroToDisable}
                                        multiline={false}
                                        header={R.strings.weeklyTrnCount}
                                        keyboardType='numeric'
                                        returnKeyType={"next"}
                                        blurOnSubmit={false}
                                    />

                                    {/* EditText for weeklyTrnAmount */}
                                    <EditText
                                        multiline={false}
                                        keyboardType='numeric'
                                        returnKeyType={"done"}
                                        blurOnSubmit={false}
                                        isRequired={true}
                                        header={R.strings.weeklyTrnAmount}
                                        placeholder={R.strings.setZeroToDisable}
                                        onChangeText={(Label) => this.setState({ WeeklyTrnAmount: Label })}
                                        reference={input => { this.inputs['weeklyTrnAmount'] = input; }}
                                        value={this.state.WeeklyTrnAmount}
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
                                        isToggle={this.state.IsKYCEnable}
                                        disabled={this.state.edit ? true : false}
                                        textStyle={{
                                            color: R.colors.white
                                        }}
                                        isGradient={true}
                                        title={R.strings.KYCStatus}
                                        onValueChange={() => {
                                            this.setState({
                                                IsKYCEnable: this.state.edit ? this.state.IsKYCEnable : !this.state.IsKYCEnable
                                            })
                                        }}
                                    />

                                    {/* EditText for yearlyTrnCount */}
                                    <EditText
                                        reference={input => { this.inputs['yearlyTrnCount'] = input; }}
                                        placeholder={R.strings.setZeroToDisable}
                                        multiline={false}
                                        keyboardType='numeric'
                                        isRequired={true}
                                        validate={true}
                                        header={R.strings.yearlyTrnCount}
                                        returnKeyType={"next"}
                                        onChangeText={(Label) => this.setState({ YearlyTrnCount: Label })}
                                        onSubmitEditing={() => { this.focusNextField('yearlyTrnAmount') }}
                                        onlyDigit={true}
                                        value={this.state.YearlyTrnCount}
                                    />

                                    {/* EditText for yearlyTrnAmount */}
                                    <EditText
                                        isRequired={true}
                                        header={R.strings.yearlyTrnAmount}
                                        blurOnSubmit={false}
                                        reference={input => { this.inputs['yearlyTrnAmount'] = input; }}
                                        onSubmitEditing={() => { this.focusNextField('maxAmount') }}
                                        placeholder={R.strings.setZeroToDisable}
                                        value={this.state.YearlyTrnAmount}
                                        multiline={false}
                                        keyboardType='numeric'
                                        returnKeyType={"done"}
                                        onChangeText={(Label) => this.setState({ YearlyTrnAmount: Label })}
                                        validate={true}
                                    />

                                    {/* EditText for MaxAmount */}
                                    <EditText
                                        validate={true}
                                        header={R.strings.maxAmount}
                                        reference={input => { this.inputs['maxAmount'] = input; }}
                                        onSubmitEditing={() => { this.focusNextField('minAmount') }}
                                        placeholder={R.strings.setZeroToDisable}
                                        multiline={false}
                                        keyboardType='numeric'
                                        returnKeyType={"next"}
                                        blurOnSubmit={false}
                                        isRequired={true}
                                        onChangeText={(Label) => this.setState({ maxAmount: Label })}
                                        value={this.state.maxAmount}
                                    />

                                    {/* EditText for MinAmount */}
                                    <EditText
                                        isRequired={true}
                                        header={R.strings.maxAmount}
                                        reference={input => { this.inputs['minAmount'] = input; }}
                                        onSubmitEditing={() => { this.focusNextField('authorityType') }}
                                        placeholder={R.strings.setZeroToDisable}
                                        multiline={false}
                                        keyboardType='numeric'
                                        validate={true}
                                        returnKeyType={"next"}
                                        blurOnSubmit={false}
                                        onChangeText={(Label) => this.setState({ minAmount: Label })}
                                        value={this.state.minAmount}
                                    />

                                    {/* EditText for authorityType */}
                                    <EditText
                                        multiline={false}
                                        isRequired={true}
                                        validate={true}
                                        onlyDigit={true}
                                        header={R.strings.authorityType}
                                        reference={input => { this.inputs['authorityType'] = input; }}
                                        placeholder={R.strings.authorityType}
                                        keyboardType='numeric'
                                        returnKeyType={"next"}
                                        onChangeText={(Label) => this.setState({ authorityType: Label })}
                                        value={this.state.authorityType}
                                        onSubmitEditing={() => { this.focusNextField('allowedUserType') }}
                                    />

                                    {/* EditText for allowedUserType */}
                                    <EditText
                                        isRequired={true}
                                        reference={input => { this.inputs['allowedUserType'] = input; }}
                                        returnKeyType={"done"}
                                        placeholder={R.strings.allowedUserType}
                                        validate={true}
                                        onlyDigit={true}
                                        header={R.strings.allowedUserType}
                                        multiline={false}
                                        keyboardType='numeric'
                                        onChangeText={(Label) => this.setState({ allowedUserType: Label })}
                                        value={this.state.allowedUserType}
                                    />

                                    {/* For StartTime and EndTime Picker and Its View */}
                                    <TimePickerWidget
                                        StartTimePickerCall={(StartTime) => this.setState({ StartTime })}
                                        EndTimePickerCall={(EndTime) => this.setState({ EndTime })}
                                        StartTime={this.state.StartTime}
                                        EndTime={this.state.EndTime} />

                                </ScrollView>
                                <View>
                                    {/* To Set Add or Edit Button */}
                                    <Button
                                        title={this.state.edit ?
                                            R.strings.update : R.strings.Add}
                                        onPress={() => this.onPress(this.state.edit ?
                                            this.state.item.Id : null)}>

                                    </Button>

                                </View>
                            </View>

                        </View>

                    </IndicatorViewPager>

                </View>

            </SafeView>
        );
    }
}

function mapStateToProps(state) {
    return {
        //Updated TransactionPolicyReducer data  
        Listdata: state.TransactionPolicyReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform  getWalletTransactionType Api Data 
        getWalletTransactionType: () => dispatch(getWalletTransactionType()),
        
        //Perform role type
        getRoleDetails: () => dispatch(getRoleDetails()),
      
        //for addTransactionPolicy  api data
        addTransactionPolicy: (add) => dispatch(addTransactionPolicy(add)),
       
        //for onUpdateTransactionPolicy api data
        onUpdateTransactionPolicy: (edit) => dispatch(onUpdateTransactionPolicy(edit)),
       
        //for add edit data clear
        clearTransactionPolicy: () => dispatch(clearTransactionPolicy()),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TransactionPolicyAddEditScreen)