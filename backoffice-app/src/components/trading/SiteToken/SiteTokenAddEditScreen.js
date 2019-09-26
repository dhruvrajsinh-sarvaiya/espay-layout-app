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
import { isCurrentScreen } from '../../../components/Navigation';
import { showAlert, changeTheme, parseArray } from '../../../controllers/CommonUtils';
import { isEmpty, isInternet, validateResponseNew } from '../../../validations/CommonValidation';
import CommonToast from '../../../native_theme/components/CommonToast';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { getBaseCurrencyList, getCurrencyList } from '../../../actions/PairListAction';
import { getRateTypeList, updateSiteToken, addSiteToken, clearSiteToken } from '../../../actions/Trading/SiteTokenAction';
import R from '../../../native_theme/R';
import { TitlePicker } from '../../widget/ComboPickerWidget'
import SafeView from '../../../native_theme/components/SafeView';

//Create Common class for Add Edit Site Token
class SiteTokenAddEditScreen extends Component {

    constructor(props) {
        super(props);
        // create reference
        this.toast = React.createRef();

        this.inputs = {};

        //item for edit from Provider configuration 
        let item = props.navigation.state.params && props.navigation.state.params.item

        //item that check edit is true or not
        let edit = props.navigation.state.params && props.navigation.state.params.edit

        //status text based on status 
        let statusText = edit ? (item.Status == 1 ? R.strings.active : R.strings.inActive) : R.strings.Please_Select

        //Define All State initial state
        this.state = {
            response: [],
            edit: edit,
            item: item,
            isFirstTime: true,

            //apply values as per Edit and Add selection
            selectedCurrencyName: edit ? (item.CurrencySMSCode) : "",
            currencyNames: [],

            selectedMarketCurrency: edit ? (item.BaseCurrencySMSCode) : "",
            marketcurrencies: [],

            selectedRateType: "", // on edit it is based on rate type and fill from rate type picker response
            rateTypes: [],

            selectedStatus: statusText,
            status: [{ value: R.strings.Please_Select }, { value: R.strings.active }, { value: R.strings.inActive }],

            note: edit ? (item.Note) : "",
            minimumLimit: edit ? (item.MinLimit.toString()) : "",
            maximumLimit: edit ? (item.MaxLimit.toString()) : "",
            monthlyLimit: edit ? (item.MonthlyLimit.toString()) : "",
            dailyLimit: edit ? (item.DailyLimit.toString()) : "",
            weeklyLimit: edit ? (item.WeeklyLimit.toString()) : "",
            currencySMSCode: edit ? (item.CurrencySMSCode.toString()) : "",
            baseCurrencySMSCode: edit ? (item.BaseCurrencySMSCode.toString()) : "",
            rateTypeId: edit ? (item.RateType) : "",
            rate: edit ? (item.Rate.toString()) : "",

            // currency id based on spinner selection
            baseCurrencyId: '',
            currencyId: ''
        };
    }

    async componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        // check for internet connection
        if (await isInternet()) {

            // call api for fill spinner of market currency
            this.props.getBaseCurrencyList();

            // call api for fill spinner of currency name
            this.props.getCurrencyList();

            // call api for fill rate type spinner
            this.props.getRateTypeList();
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps);
    };

    componentDidUpdate = (prevProps, prevState) => {

        //Get All Updated Feild of Particular actions
        const { addSiteTokenData, updateSiteTokenData } = this.props.data;

        // compare response with previous response
        if (addSiteTokenData !== prevProps.data.addSiteTokenData) {

            // for show responce of add provider configuration data
            if (addSiteTokenData) {
                try {
                    if (validateResponseNew({ response: addSiteTokenData })) {

                        //if add provider configuration succcess redirect user to provider configuration list screen
                        showAlert(R.strings.Success, R.strings.added_msg, 0, () => {

                            // clear reducer
                            this.props.clearSiteToken();

                            //navigate to previous screen
                            this.props.navigation.goBack();

                            // refresh previous list for updated data
                            this.props.navigation.state.params.onRefresh(true)
                        });
                    }
                    else {
                        this.props.clearSiteToken()
                    }
                } catch (e) {
                    this.props.clearSiteToken()
                }
            }
        }

        // compare response with previous response
        if (updateSiteTokenData !== prevProps.data.updateSiteTokenData) {

            // for show responce of  Update provider configuration
            if (updateSiteTokenData) {
                try {
                    if (validateResponseNew({ response: updateSiteTokenData })) {
                        //if  Update provider configuration succcess redirect user to provider configuration list screen
                        showAlert(R.strings.Success, R.strings.edit_msg, 0, () => {

                            // clear reducer
                            this.props.clearSiteToken();

                            // navigate to previous screen
                            this.props.navigation.goBack();

                            // refresh previous list for updated data
                            this.props.navigation.state.params.onRefresh(true)
                        });
                    }
                    else {
                        this.props.clearSiteToken();
                    }
                } catch (e) {
                    this.props.clearSiteToken()
                }
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
        if (SiteTokenAddEditScreen.oldProps !== props) {
            SiteTokenAddEditScreen.oldProps = props;
        } else {
            return null;
        }

        // check for current screen
        if (isCurrentScreen(props)) {

            //Get All Updated Feild of Particular actions
            const { rateTypeList } = props.data;
            const { baseCurrencyData, pairCurrencyList } = props.pairListData;

            // check Rate type spinner response is available or not
            if (rateTypeList) {
                try {
                    if (state.rateTypeList == null || (state.rateTypeList != null && rateTypeList !== state.rateTypeList)) {
                        if (validateResponseNew({ response: rateTypeList, isList: true })) {

                            //fill rate type spinner
                            let newRes = parseArray(rateTypeList.Response)
                            newRes.map((item, index) => {
                                newRes[index].value = newRes[index].SiteTokenType
                            })
                            let res = [{ value: R.strings.select + ' ' + R.strings.rate_type }, ...newRes]

                            // while edit apply rate type based on rateType id
                            let selectedRateType = R.strings.rate_type;
                            if (state.edit) {
                                selectedRateType = newRes[newRes.findIndex(el => el.Id === state.rateTypeId)].SiteTokenType;
                            }
                            return { ...state, rateTypes: res, rateTypeList, selectedRateType }
                        } else {
                            return { ...state, rateTypes: [{ value: R.strings.select + ' ' + R.strings.rate_type }], rateTypeList }
                        }
                    }
                } catch (error) {
                    return { ...state, rateTypes: [{ value: R.strings.select + ' ' + R.strings.rate_type }] }
                }
            }

            // check market currency spinner response is available or not
            if (baseCurrencyData) {
                try {
                    if (state.baseCurrencyData == null || (state.baseCurrencyData != null && baseCurrencyData !== state.baseCurrencyData)) {
                        if (validateResponseNew({ response: baseCurrencyData, isList: true })) {

                            // fill market currency spinner
                            let newRes = parseArray(baseCurrencyData.Response)
                            newRes.map((item, index) => {
                                newRes[index].value = newRes[index].CurrencyName
                            })
                            let res = [{ value: R.strings.SelectMarketCur }, ...newRes]

                            //while edit get base currency id based on service id
                            let serviceId = "";
                            if (state.edit) {
                                //find service id from base currencies response
                                serviceId = res[res.findIndex(el => el.value === state.selectedMarketCurrency)].ServiceID;
                            }
                            return { ...state, marketcurrencies: res, baseCurrencyData, baseCurrencyId: serviceId }
                        } else {
                            return { ...state, marketcurrencies: [{ value: R.strings.SelectMarketCur }], baseCurrencyData }
                        }
                    }
                } catch (error) {
                    return { ...state, marketcurrencies: [{ value: R.strings.SelectMarketCur }] }
                }
            }

            // check currency name spinner response is available or not
            if (pairCurrencyList) {
                try {
                    if (state.pairCurrencyList == null || (state.pairCurrencyList != null && pairCurrencyList !== state.pairCurrencyList)) {
                        if (validateResponseNew({ response: pairCurrencyList, isList: true })) {

                            // fill currency name spinner
                            let newRes = parseArray(pairCurrencyList.Response)
                            newRes.map((item, index) => {
                                newRes[index].value = newRes[index].SMSCode
                            })
                            let res = [{ value: R.strings.SelectCurrencyName }, ...newRes]

                            //while edit get currency id based on service id
                            let serviceId = "";
                            if (state.edit) {
                                //find service id from list crrency response
                                serviceId = res[res.findIndex(el => el.value === state.selectedCurrencyName)].ServiceId;
                            }
                            return { ...state, currencyNames: res, pairCurrencyList, currencyId: serviceId }
                        } else {
                            return { ...state, currencyNames: [{ value: R.strings.SelectCurrencyName }], pairCurrencyList }
                        }
                    }
                } catch (error) {
                    return { ...state, currencyNames: [{ value: R.strings.SelectCurrencyName }] }
                }
            }
        }
        return null;
    }

    onPress = async (Id) => {

        //validations for Inputs 
        if (isEmpty(this.state.selectedCurrencyName) || this.state.selectedCurrencyName === R.strings.SelectCurrencyName) {
            this.toast.Show(R.strings.SelectCurrencyName);
            return;
        }

        if (isEmpty(this.state.selectedMarketCurrency) || this.state.selectedMarketCurrency === R.strings.SelectMarketCur) {
            this.toast.Show(R.strings.SelectMarketCur);
            return;
        }

        if (isEmpty(this.state.selectedRateType) || this.state.selectedRateType === R.strings.select + ' ' + R.strings.rate_type) {
            this.toast.Show(R.strings.select + ' ' + R.strings.rate_type);
            return;
        }

        Keyboard.dismiss();

        //for edit Request Site Token
        if (this.state.edit) {

            // check for internet connection
            if (await isInternet()) {

                // get reuired values for binding request
                let status = this.state.selectedStatus == R.strings.active ? 1 : 0;
                let rate = this.state.minimumLimit ? this.state.minimumLimit : '';
                let rateTypeId = this.state.rateTypes[this.state.rateTypes.findIndex(el => el.value === this.state.selectedRateType)].Id;

                // bind request for add site token
                const request = {
                    //IsMargin: 0,
                    ID: Id,
                    CurrencyID: this.state.currencyId,
                    BaseCurrencyID: this.state.baseCurrencyId,
                    CurrencySMSCode: this.state.selectedCurrencyName,
                    BaseCurrencySMSCode: this.state.selectedMarketCurrency,
                    MinLimit: this.state.minimumLimit !== '' ? parseFloat(this.state.minimumLimit) : parseFloat(0),
                    MaxLimit: this.state.maximumLimit !== '' ? parseFloat(this.state.maximumLimit) : parseFloat(0),
                    Rate: rate !== '' ? parseFloat(rate) : parseFloat(0),
                    RateType: rateTypeId ? parseFloat(rateTypeId) : parseFloat(0),
                    DailyLimit: this.state.dailyLimit !== '' ? parseFloat(this.state.dailyLimit) : parseFloat(0),
                    WeeklyLimit: this.state.weeklyLimit !== '' ? parseFloat(this.state.weeklyLimit) : parseFloat(0),
                    MonthlyLimit: this.state.monthlyLimit !== '' ? parseFloat(this.state.monthlyLimit) : parseFloat(0),
                    Status: status ? parseFloat(status) : parseFloat(0),
                    Note: this.state.note,
                };

                // call api for Update site token
                this.props.updateSiteToken(request)
            }
        }
        else {

            // check for internet connection
            if (await isInternet()) {

                // get reuired values for binding request
                let status = this.state.selectedStatus == R.strings.active ? 1 : 0;
                let rate = this.state.minimumLimit ? this.state.minimumLimit : '';
                let rateTypeId = this.state.rateTypes[this.state.rateTypes.findIndex(el => el.value === this.state.selectedRateType)].Id;

                // bind request for add site token
                const request = {
                    //IsMargin: 0,
                    CurrencyID: this.state.currencyId,
                    BaseCurrencyID: this.state.baseCurrencyId,
                    CurrencySMSCode: this.state.selectedCurrencyName,
                    BaseCurrencySMSCode: this.state.selectedMarketCurrency,
                    Rate: rate !== '' ? parseFloat(rate) : parseFloat(0),
                    RateType: rateTypeId ? parseFloat(rateTypeId) : parseFloat(0),
                    MinLimit: this.state.minimumLimit !== '' ? parseFloat(this.state.minimumLimit) : parseFloat(0),
                    MaxLimit: this.state.maximumLimit !== '' ? parseFloat(this.state.maximumLimit) : parseFloat(0),
                    DailyLimit: this.state.dailyLimit !== '' ? parseFloat(this.state.dailyLimit) : parseFloat(0),
                    WeeklyLimit: this.state.weeklyLimit !== '' ? parseFloat(this.state.weeklyLimit) : parseFloat(0),
                    MonthlyLimit: this.state.monthlyLimit !== '' ? parseFloat(this.state.monthlyLimit) : parseFloat(0),
                    Note: this.state.note,
                    Status: status ? parseFloat(status) : parseFloat(0),
                };

                // call api for add site token
                this.props.addSiteToken(request)
            }
        }
    }
    //this Method is used to focus on next feild
    focusNextField(id) {
        this.inputs[id].focus();
    }

    // on select currency name picker
    onSelectCurrencyName = (value) => {

        //find service id from list crrency response
        let serviceId = this.state.currencyNames[this.state.currencyNames.findIndex(el => el.value === value)].ServiceId;

        // check currency name and market currency not same
        if (value === this.state.selectedMarketCurrency) {
            if (this.state.baseCurrencyId === serviceId) {
                this.toast.Show(R.strings.same_currency_selection_error);
            }
        } else {
            this.setState({ selectedCurrencyName: value, currencyId: serviceId })
        }
    }

    // on select market currency picker
    onSelectMarketCurrency = (value) => {

        //find service id from base currencies response
        let serviceId = this.state.marketcurrencies[this.state.marketcurrencies.findIndex(el => el.value === value)].ServiceID;

        // check currency name and market currency not same
        if (value === this.state.selectedCurrencyName) {
            if (this.state.currencyId === serviceId) {
                this.toast.Show(R.strings.same_currency_selection_error);
            }
        } else {
            this.setState({ selectedMarketCurrency: value, baseCurrencyId: serviceId })
        }
    }

    onSelectRateType = (value) => {

        // get selected rate type id from rate type response
        let rateTypeId = this.state.rateTypes[this.state.rateTypes.findIndex(el => el.value === value)].Id;
        this.setState({ selectedRateType: value, rateTypeId })
    }

    render() {

        //Get is Fetching value For All APIs to handle Progress bar in All Activity
        const { addLoading, updateLoading, rateLoading, isLoadingBaseCurrency, isLoadingPairCurrency } = this.props.data;

        return (

            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To Set Status Bas as per out theme */}
                <CommonStatusBar />

                {/* To Set ToolBar as per out theme */}
                <CustomToolbar
                    title={this.state.edit ? R.strings.update_site_token : R.strings.add_site_token}
                    isBack={true}
                    nav={this.props.navigation}
                />

                {/* Progress Dialog */}
                <ProgressDialog isShow={addLoading || updateLoading || rateLoading || isLoadingBaseCurrency || isLoadingPairCurrency} />

                  {/* Common Toast */}
              <CommonToast ref={cmpToast => this.toast = cmpToast} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    {/* Display Data in scrollview */}

                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='always'>

                        <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.padding_top_bottom_margin, paddingTop: R.dimens.padding_top_bottom_margin }}>

                            {/* Picker for Currency name */}
                            <TitlePicker
                                title={R.strings.CurrencyName}
                                array={this.state.currencyNames}
                                selectedValue={this.state.selectedCurrencyName}
                                onPickerSelect={(value) => this.onSelectCurrencyName(value)}
                                isRequired={true}
                            />

                            {/* Picker for market Currency */}
                            <TitlePicker
                                title={R.strings.market_currency}
                                array={this.state.marketcurrencies}
                                selectedValue={this.state.selectedMarketCurrency}
                                onPickerSelect={(value) => this.onSelectMarketCurrency(value)}
                                style={{ marginTop: R.dimens.widget_top_bottom_margin }}
                                isRequired={true}
                            />

                            {/* Picker for market Currency */}
                            <TitlePicker
                                title={R.strings.rate_type}
                                array={this.state.rateTypes}
                                selectedValue={this.state.selectedRateType}
                                onPickerSelect={(value) => this.onSelectRateType(value)}
                                style={{ marginTop: R.dimens.widget_top_bottom_margin }}
                                isRequired={true}
                            />

                            {/* Picker for status */}
                            <TitlePicker
                                title={R.strings.status}
                                array={this.state.status}
                                selectedValue={this.state.selectedStatus}
                                onPickerSelect={(value) => this.setState({ selectedStatus: value })}
                                style={{ marginTop: R.dimens.widget_top_bottom_margin }}
                            />

                            {/* EditText for note */}
                            <EditText
                                header={R.strings.note_text}
                                placeholder={R.strings.note_text}
                                onChangeText={(text) => this.setState({ note: text })}
                                value={this.state.note}
                                keyboardType={'default'}
                                multiline={false}
                                reference={input => { this.inputs['note'] = input; }}
                                onSubmitEditing={() => { this.state.rateTypeId === 3 ? this.focusNextField('rate') : this.focusNextField('minLimit') }}
                                returnKeyType={"next"}
                                blurOnSubmit={false}
                            />

                            {this.state.rateTypeId === 3 &&
                                /* EditText for rate */
                                <EditText
                                    header={R.strings.Rate}
                                    placeholder={R.strings.Rate}
                                    onChangeText={(text) => this.setState({ rate: text })}
                                    value={this.state.rate}
                                    keyboardType={'default'}
                                    multiline={false}
                                    reference={input => { this.inputs['rate'] = input; }}
                                    onSubmitEditing={() => { this.focusNextField('minLimit') }}
                                    returnKeyType={"next"}
                                    blurOnSubmit={false}
                                />
                            }

                            {/* EditText for minimum amount */}
                            <EditText
                                header={R.strings.min_limit}
                                placeholder={R.strings.min_limit}
                                onChangeText={(text) => this.setState({ minimumLimit: text })}
                                value={this.state.minimumLimit}
                                keyboardType={'default'}
                                multiline={false}
                                reference={input => { this.inputs['minLimit'] = input; }}
                                onSubmitEditing={() => { this.focusNextField('maxLimit') }}
                                returnKeyType={"next"}
                                blurOnSubmit={false}
                            />

                            {/* EditText for maximum limit */}
                            <EditText
                                header={R.strings.max_limit}
                                placeholder={R.strings.max_limit}
                                onChangeText={(text) => this.setState({ maximumLimit: text })}
                                value={this.state.maximumLimit}
                                keyboardType={'default'}
                                returnKeyType={"next"}
                                multiline={false}
                                reference={input => { this.inputs['maxLimit'] = input; }}
                                onSubmitEditing={() => { this.focusNextField('monthLimit') }}
                                blurOnSubmit={false}
                            />

                            {/* EditText for monthly limit */}
                            <EditText
                                header={R.strings.monthly_limit}
                                placeholder={R.strings.monthly_limit}
                                onChangeText={(text) => this.setState({ monthlyLimit: text })}
                                value={this.state.monthlyLimit}
                                keyboardType={'default'}
                                returnKeyType={"next"}
                                multiline={false}
                                reference={input => { this.inputs['monthLimit'] = input; }}
                                onSubmitEditing={() => { this.focusNextField('dailyimit') }}
                                blurOnSubmit={false}
                            />

                            {/* EditText for daily limit */}
                            <EditText
                                header={R.strings.daily_limit}
                                placeholder={R.strings.daily_limit}
                                onChangeText={(text) => this.setState({ dailyLimit: text })}
                                value={this.state.dailyLimit}
                                keyboardType={'default'}
                                returnKeyType={"next"}
                                multiline={false}
                                reference={input => { this.inputs['dailyimit'] = input; }}
                                onSubmitEditing={() => { this.focusNextField('weeklyLimit') }}
                                blurOnSubmit={false}
                            />

                            {/* EditText for weekly limit */}
                            <EditText
                                header={R.strings.weekly_limit}
                                placeholder={R.strings.weekly_limit}
                                onChangeText={(text) => this.setState({ weeklyLimit: text })}
                                value={this.state.weeklyLimit}
                                keyboardType={'default'}
                                returnKeyType={"done"}
                                multiline={false}
                                reference={input => { this.inputs['weeklyLimit'] = input; }}
                            />
                        </View>
                    </ScrollView>
                </View>

                {/* for Add or Update Button */}
                <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                    <Button title={this.state.edit ? R.strings.update : R.strings.add} onPress={() => this.onPress(this.state.edit ? this.state.item.ID : null)}></Button>
                </View>
            </SafeView>

        );
    }
}


function mapStateToProps(state) {
    return {
        //data for site token reducer and PairListReducer
        data: state.SiteTokenReducer,
        pairListData: state.pairListReducer,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //for market currency name
        getBaseCurrencyList: () => dispatch(getBaseCurrencyList()),

        //for get currency name
        getCurrencyList: () => dispatch(getCurrencyList()),

        //for rate type
        getRateTypeList: () => dispatch(getRateTypeList()),

        //for update site token data
        updateSiteToken: (request) => dispatch(updateSiteToken(request)),

        //for adding site token data
        addSiteToken: (request) => dispatch(addSiteToken(request)),

        //for clear site token data
        clearSiteToken: () => dispatch(clearSiteToken()),
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SiteTokenAddEditScreen)