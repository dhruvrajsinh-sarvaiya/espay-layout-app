// MarginManageMarketAdd.js
import React, { Component } from 'react';
import { View, ScrollView, } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { changeTheme, parseArray, showAlert } from '../../../controllers/CommonUtils';
import Button from '../../../native_theme/components/Button';
import { isInternet, validateResponseNew } from '../../../validations/CommonValidation'
import { GetMarginMarketList, GetMarginCurrecnyList, AddMarginManageMarketData, AddMarginManageMarketDataClear } from '../../../actions/Margin/MarginManageMarketAction'
import { isCurrentScreen } from '../../../components/Navigation';
import { connect } from 'react-redux';
import CommonToast from '../../../native_theme/components/CommonToast';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import R from '../../../native_theme/R';
import { TitlePicker } from '../../widget/ComboPickerWidget'
import SafeView from '../../../native_theme/components/SafeView';

class MarginManageMarketAdd extends Component {

    constructor(props) {
        super(props)

        // Create reference
        this.toast = React.createRef();

        // Define all initial state
        this.state = {
            currency: [{ value: R.strings.Please_Select }],
            selectedCurrency: R.strings.Please_Select,
            serviceId: '',
            status: [{ value: R.strings.Please_Select }, { value: R.strings.active }, { value: R.strings.inActive }],
            selectedStatus: R.strings.Please_Select,
            isFirstTime: true,
        }
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {
            //  call api for get currencyList
            this.props.GetMarginCurrecnyList()
        }

    }

    submitdata = async () => {
        // check validation for selected values
        if (this.state.selectedCurrency === R.strings.Please_Select) {
            this.toast.Show(R.strings.SelectCurrencyName)
            return;
        }
        if (this.state.selectedStatus === R.strings.Please_Select) {
            this.toast.Show(R.strings.SelectCurrencyStatus)
            return;
        }
        else {
            //Check NetWork is Available or not
            if (await isInternet()) {
                let RequestAddmarketCurrency = {
                    IsMargin: 1,
                    CurrencyName: this.state.selectedCurrency,
                    Status: this.state.selectedStatus === 'Active' ? 1 : 0,
                    ServiceID: this.state.serviceId
                }
                // call action for Add record for Marketdata
                this.props.AddMarginManageMarketData(RequestAddmarketCurrency);
            }
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps);
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
        if (MarginManageMarketAdd.oldProps !== props) {
            MarginManageMarketAdd.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {

            const { currencyList, currecnyListFetch } = props;

            // used for get Currencylist, if not null than populate list in currency array 
            if (!currecnyListFetch) {
                try {

                    if (validateResponseNew({ response: currencyList, isList: true })) {
                        //Get array from response
                        let res = parseArray(currencyList.Response);

                        // fetching only SMSCode from response
                        for (var smsCodeItem in res) {
                            let item = res[smsCodeItem]
                            item.value = item.SMSCode
                        }

                        return { ...state, currency: [...state.currency, ...res] }
                    } else {
                        return { ...state, currency: [{ value: R.strings.Please_Select }], selectedCurrency: R.strings.Please_Select, }
                    }
                } catch (e) {
                    return { ...state, currency: [{ value: R.strings.Please_Select }], selectedCurrency: R.strings.Please_Select, }
                }
            }
        }
        return null;
    }

    componentDidUpdate = (prevProps, prevState) => {
        const { AddMarketlistdata, AddedMarketlistdata, } = this.props;

        // check previous props and existing props
        if (AddMarketlistdata !== prevProps.AddMarketlistdata) {
            // for responce of add Record
            if (!AddedMarketlistdata) {

                try {
                    // when returncode 0 display success and returncode 1 check for ErrorCode for Display error message
                    if (validateResponseNew({ response: AddMarketlistdata, returnCode: AddMarketlistdata.ReturnCode, returnMessage: R.strings[`error.message.${AddMarketlistdata.ErrorCode}`] })) {
                        showAlert(R.strings.Success, AddMarketlistdata.ReturnMsg === null ? R.strings.RedcordAddedSuccessfully : '', 0, () => {
                            // Addeded data clear from the reducer
                            this.props.AddMarginManageMarketDataClear();

                            // return to Marketscreen
                            this.props.navigation.goBack()

                            // call api for refresh value in managemarket list screen 
                            this.props.GetMarginMarketList()
                        })
                    } else {
                        // for clear response from the reducer when record already exist
                        this.props.AddMarginManageMarketDataClear()
                    }
                } catch (e) {
                    this.props.AddMarginManageMarketDataClear()
                }
            }
        }
    }

    render() {
        // Loading status for Progress bar which is fetching from reducer
        const { isCurrecnyFetch, isAddMarketlist } = this.props;

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background, }}>
                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={R.strings.AddNewCurrency}
                    isBack={true}
                    nav={this.props.navigation}
                />

                {/* show progress bar when fetching currencylist, add Record, edit record */}
                <ProgressDialog isShow={isCurrecnyFetch || isAddMarketlist} />

                {/* for display toast for notifyuser to fill currect item in picker  */}
                <CommonToast ref={cmp => this.toast = cmp} />

                <View style={{ flex: 1, justifyContent: 'space-between' }}>

                    <ScrollView showsVerticalScrollIndicator={false}>

                        <View style={{ paddingTop: R.dimens.padding_top_bottom_margin, paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.padding_top_bottom_margin }}>

                            {/* For select CurrencyName */}
                            <TitlePicker
                                title={R.strings.CurrencyName}
                                array={this.state.currency}
                                selectedValue={this.state.selectedCurrency}
                                onPickerSelect={(index, object) => this.setState({ selectedCurrency: index, serviceId: object.ServiceId })}
                                style={{ marginTop: R.dimens.widget_top_bottom_margin, marginBottom: R.dimens.widget_top_bottom_margin }}
                            />

                            {/* For select Status */}
                            <TitlePicker
                                title={R.strings.Status}
                                array={this.state.status}
                                selectedValue={this.state.selectedStatus}
                                onPickerSelect={(value) => {
                                    if (this.state.selectedStatus !== value) {
                                        this.setState({ selectedStatus: value });
                                    }
                                }}
                                style={{ marginTop: R.dimens.widget_top_bottom_margin, marginBottom: R.dimens.widget_top_bottom_margin }}
                            />
                        </View>
                    </ScrollView>

                    {/* for submit button */}
                    <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                        <Button title={R.strings.submit} onPress={this.submitdata}></Button>
                    </View>
                </View>

            </SafeView>
        );
    }
}

function mapStateToProps(state) {
    return {

        // for currecny list
        isCurrecnyFetch: state.MarginManageMarketReducer.isCurrecnyFetch,
        currencyList: state.MarginManageMarketReducer.currencyList,
        currecnyListFetch: state.MarginManageMarketReducer.currecnyListFetch,

        // for add data in marketlist
        isAddMarketlist: state.MarginManageMarketReducer.isAddMarketlist,
        AddMarketlistdata: state.MarginManageMarketReducer.AddMarketlistdata,
        AddedMarketlistdata: state.MarginManageMarketReducer.AddedMarketlistdata,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        // call Action for fetch currencylist 
        GetMarginCurrecnyList: () => dispatch(GetMarginCurrecnyList()),
        // call action for fetch marketlist
        GetMarginMarketList: () => dispatch(GetMarginMarketList()),
        // call action for Add record in market,
        AddMarginManageMarketData: (RequestAddmarketCurrency) => dispatch(AddMarginManageMarketData(RequestAddmarketCurrency)),
        //  call action for clear added data from reducer
        AddMarginManageMarketDataClear: () => dispatch(AddMarginManageMarketDataClear()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MarginManageMarketAdd)