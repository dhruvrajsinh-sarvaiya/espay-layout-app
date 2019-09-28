// ManageMarketAddEdit
import React, { Component } from 'react';
import { View, ScrollView, } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { changeTheme, parseArray, showAlert } from '../../../controllers/CommonUtils';
import Button from '../../../native_theme/components/Button';
import { isInternet, validateResponseNew } from '../../../validations/CommonValidation'
import { GetMarketList, AddManageMarketData, AddManageMarketDataClear, GetTradingCurrecnyList } from '../../../actions/Trading/ManageMarketAction'
import { isCurrentScreen } from '../../../components/Navigation';
import { connect } from 'react-redux';
import CommonToast from '../../../native_theme/components/CommonToast';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import R from '../../../native_theme/R';
import { TitlePicker } from '../../widget/ComboPickerWidget'
import SafeView from '../../../native_theme/components/SafeView';

class ManageMarketAddEdit extends Component {

    constructor(props) {
        super(props)
        //Create reference

        this.toast = React.createRef();

        //Define all initial state

        this.state = {
            currency: [{ value: R.strings.Please_Select }],
            selectedStatus: R.strings.Please_Select,
            status: [{ value: R.strings.Please_Select }, { value: R.strings.active }, { value: R.strings.inActive }],
            isFirstTime: true,
            serviceId: '',
            selectedCurrency: R.strings.Please_Select,
        }
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.

        changeTheme();

        //Check NetWork is Available or not

        if (await isInternet()) {

            //  call api for get currencyList
            this.props.GetTradingCurrecnyList()
        }
    }

    submitdata = async () => {

        //input validations
        if (this.state.selectedCurrency === R.strings.Please_Select) {
            this.toast.Show(R.strings.SelectCurrencyName)
            return;
        }
        if (this.state.selectedStatus === R.strings.Please_Select) {
            this.toast.Show(R.strings.SelectCurrencyStatus)
            return;
        }
        else {
            // check internet 
            if (await isInternet()) {
                let RequestAddmarketCurrency = {
                    CurrencyName: this.state.selectedCurrency,
                    Status: this.state.selectedStatus === 'Active' ? 1 : 0,
                    ServiceID: this.state.serviceId
                }

                // call action for Add recoed 
                this.props.AddManageMarketData(RequestAddmarketCurrency);
            }
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        //stop twice api call
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
        if (ManageMarketAddEdit.oldProps !== props) {
            ManageMarketAddEdit.oldProps = props;
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

                        res.map((el, index) => {
                            res[index].value = el.SMSCode;
                        });

                        return {
                            ...state
                            , currency: [...state.currency, ...res]
                        }
                    } else {
                        return {
                            ...state
                            , currency: [{ value: R.strings.Please_Select }], selectedCurrency: R.strings.Please_Select,
                        }
                    }
                } catch (e) {
                    return {
                        ...state, currency: [
                            { value: R.strings.Please_Select }],
                        selectedCurrency: R.strings.Please_Select,
                
                    }
                }
            }
        }

        return null;
    }

    componentDidUpdate = (prevProps, prevState) => {
        const { AddMarketlistdata, 
            AddedMarketlistdata, } = this.props;

        if (AddMarketlistdata !== prevProps.AddMarketlistdata) {

            // for responce of add Record
            
            if (!AddedMarketlistdata) {

                try
                 {
                    // when returncode 0 display success and returncode 1 check for ErrorCode for Display error message
                    if (validateResponseNew({ response: AddMarketlistdata, returnCode: AddMarketlistdata.ReturnCode, returnMessage: R.strings[`error.message.${AddMarketlistdata.ErrorCode}`] })) {
                        showAlert(R.strings.Success, AddMarketlistdata.ReturnMsg === null ? R.strings.RedcordAddedSuccessfully : '', 0, () => {

                            // Addeded data clear from the reducer

                            this.props.AddManageMarketDataClear();

                            // return to Marketscreen
                            this.props.navigation.goBack()

                            // call api for refresh value in managemarket list screen 
                            this.props.GetMarketList()
                        })
                    } else {
                        // for clear responce from the reducer when record already exist
                        this.props.AddManageMarketDataClear()
                    }
                } catch (e) {
                    this.props.AddManageMarketDataClear()
                }
            }
        }
    }

    render() {

        const { isCurrecnyFetch, isAddMarketlist } = this.props;

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background, }}>
                {/* statusbar and actionbar  */}
                <CommonStatusBar />

                <CustomToolbar
                    nav={this.props.navigation}
                    isBack={true}
                    title={R.strings.AddNewCurrency}
                />

                {/* show progress bar when fetching currencylist, add Record, edit record */}
                <ProgressDialog
                    isShow={isCurrecnyFetch || isAddMarketlist}
                />

                {/* for display toast for notifyuser to fill currect item in picker  */}
                <CommonToast
                    ref={cmp => this.toast = cmp}
                />

                <View style={{
                    justifyContent: 'space-between',
                    flex: 1,
                }}>

                    <ScrollView
                        showsVerticalScrollIndicator={false}>

                        <View 
                        style={{ 
                            paddingLeft: R.dimens.activity_margin, 
                            paddingTop: R.dimens.padding_top_bottom_margin, 
                            paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.padding_top_bottom_margin }}>

                            {/* For select CurrencyName */}
                            <TitlePicker
                                isRequired={true}
                                title={R.strings.CurrencyName}
                                array={this.state.currency}
                                selectedValue={this.state.selectedCurrency}
                                onPickerSelect={(index, object) => this.setState({ selectedCurrency: index, serviceId: object.ServiceId })}
                                style={{ marginTop: R.dimens.widget_top_bottom_margin, marginBottom: R.dimens.widget_top_bottom_margin }}
                            />

                            {/* For select Status */}
                            <TitlePicker
                                isRequired={true}
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
                </View>
                <View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                    {/* To Set Add Button*/}
                    <Button title={R.strings.add} onPress={this.submitdata}></Button>
                </View>
            </SafeView>
        );
    }
}

function mapStateToProps(state) {
    return {
        // for Currency list
        isCurrecnyFetch: state.manageMarketReducer.isCurrecnyFetch,
        currencyList: state.manageMarketReducer.currencyList,
        currecnyListFetch: state.manageMarketReducer.currecnyListFetch,

        // for add data in marketlist
        isAddMarketlist: state.manageMarketReducer.isAddMarketlist,
        AddMarketlistdata: state.manageMarketReducer.AddMarketlistdata,
        AddedMarketlistdata: state.manageMarketReducer.AddedMarketlistdata,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        // call Action for fetch currencylist 
        GetTradingCurrecnyList: () => dispatch(GetTradingCurrecnyList()),
        // call action for fetch marketlist
        GetMarketList: () => dispatch(GetMarketList()),
        // call action for Add record in market, than call action for clear added data from reducer
        AddManageMarketData: (RequestAddmarketCurrency) => dispatch(AddManageMarketData(RequestAddmarketCurrency)),
        AddManageMarketDataClear: () => dispatch(AddManageMarketDataClear()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageMarketAddEdit)