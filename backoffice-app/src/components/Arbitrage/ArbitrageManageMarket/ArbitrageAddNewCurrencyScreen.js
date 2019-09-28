// ArbitrageAddNewCurrencyScreen.js
import {
    View,
    ScrollView,
    Keyboard,
} from 'react-native';
import React from 'react'
import { Component } from 'react';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../../native_theme/components/CustomToolbar'
import Button from '../../../native_theme/components/Button';
import { connect } from 'react-redux';
import { isCurrentScreen } from '../../Navigation';
import { showAlert, changeTheme, parseArray } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew } from '../../../validations/CommonValidation';
import CommonToast from '../../../native_theme/components/CommonToast';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import R from '../../../native_theme/R';
import { TitlePicker } from '../../widget/ComboPickerWidget';
import { getListCurrencyArbitrage, AddArbiManageMarketList, clearArbiManageMarketListData } from '../../../actions/Arbitrage/ArbitrageManageMarketActions';
import SafeView from '../../../native_theme/components/SafeView';

//Create Common class for Add
class ArbitrageAddNewCurrencyScreen extends Component {

    constructor(props) {
        super(props);

        //Define All State initial state
        this.state = {

            currency: [],
            ArbitrageCurrencyListState: null,
            selectedCurrency: R.strings.selectCurrency,
            currencyId: 0,

            status: [{ value: R.strings.select_status }, { value: R.strings.Active }, { value: R.strings.Inactive }],
            selectedStatus: R.strings.select_status,

            isFirstTime: true,
        }

        // Create reference
        this.toast = React.createRef();
    }

    async componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        // Check internet is Available or not
        if (await isInternet()) {
            // for get currency List
            this.props.getListCurrencyArbitrage({ ActiveOnly: 1 })
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
        if (ArbitrageAddNewCurrencyScreen.oldProps !== props) {
            ArbitrageAddNewCurrencyScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {

            //Get All Updated Feild of Particular actions
            const { ArbitrageCurrencyList, } = props.ManageMarketResult

            // ArbitrageCurrencyList is not null
            if (ArbitrageCurrencyList) {
                try {
                    //if local ArbitrageCurrencyList state is null or its not null and also different then new response then and only then validate response.
                    if (state.ArbitrageCurrencyListState == null || (ArbitrageCurrencyList !== state.ArbitrageCurrencyListState)) {

                        //if  response is success then store array list else store empty list
                        if (validateResponseNew({ response: ArbitrageCurrencyList, isList: true })) {
                            let res = parseArray(ArbitrageCurrencyList.Response);

                            res.map((item, index) => {
                                res[index].value = item.SMSCode;
                            })

                            let currencyNames = [
                                { value: R.strings.selectCurrency },
                                ...res
                            ];

                            return { ...state, ArbitrageCurrencyListState: ArbitrageCurrencyList, currency: currencyNames };
                        } else {
                            return { ...state, ArbitrageCurrencyListState: ArbitrageCurrencyList, currency: [{ value: R.strings.selectCurrency }] };
                        }
                    }
                } catch (e) {
                    return { ...state, currency: [{ value: R.strings.selectCurrency }] };
                }
            }
        }
        return null;
    }


    componentDidUpdate = async (prevProps, prevState) => {

        // for Add Arbitrage Manage Market List
        const { AddArbiManageMarketListData } = this.props.ManageMarketResult;

        // check previous props and existing props
        if (AddArbiManageMarketListData !== prevProps.ManageMarketResult.AddArbiManageMarketListData) {
            // for show responce add
            if (AddArbiManageMarketListData) {
                try {
                    //If AddArbiManageMarketListData response is validate than show success dialog else show failure dialog
                    if (validateResponseNew({
                        response: AddArbiManageMarketListData,
                    })) {
                        showAlert(R.strings.Success, AddArbiManageMarketListData.ReturnMsg, 0, () => {
                            // Clear data
                            this.props.clearArbiManageMarketListData()
                            this.props.navigation.state.params.onSuccess() // if add success call list method from back screen
                            this.props.navigation.goBack()
                        });
                    } else {
                        // Clear data
                        this.props.clearArbiManageMarketListData()
                    }
                } catch (e) {
                    // Clear data
                    this.props.clearArbiManageMarketListData()
                }
            }
        }
    }

    //Add 
    onPress = async () => {

        // for check validation for selected value
        if (this.state.selectedCurrency === R.strings.selectCurrency) {
            this.toast.Show(R.strings.selectCurrency)
            return;
        }
        else if (this.state.selectedStatus === R.strings.select_status) {
            this.toast.Show(R.strings.select_status)
            return;
        }
        else {
            // Check internet is Available or not
            if (await isInternet()) {

                let request = {
                    ServiceID: this.state.selectedCurrency === R.strings.selectCurrency ? 0 : this.state.currencyId,
                    Status: this.state.selectedStatus === R.strings.Active ? 1 : 0,
                    CurrencyName: this.state.selectedCurrency === R.strings.selectCurrency ? '' : this.state.selectedCurrency,
                }

                //call add Arbitrage Manage Market List api
                this.props.AddArbiManageMarketList(request)
            }
        }

        Keyboard.dismiss();
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        // stop twice api call
        return isCurrentScreen(nextProps);
    };

    render() {

        // Loading status for Progress bar which is fetching from reducer
        const { ArbitrageCurrencyListLoading, AddArbiManageMarketLoading } = this.props.ManageMarketResult;

        return (

            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                {/* To Set Status Bas as per out theme */}
                <CommonStatusBar />

                {/* To Set ToolBar as per out theme */}
                <CustomToolbar
                    title={R.strings.addNewCurrency}
                    isBack={true}
                    nav={this.props.navigation}
                />

                {/* Progress Dialog */}
                <ProgressDialog isShow={ArbitrageCurrencyListLoading || AddArbiManageMarketLoading} />

                {/* for common toast */}
                <CommonToast ref={cmpToast => this.toast = cmpToast} />

                <View style={{
                    flex: 1, justifyContent: 'space-between',
                    paddingLeft: R.dimens.activity_margin,
                    paddingRight: R.dimens.activity_margin,
                    paddingTop: R.dimens.widget_top_bottom_margin
                }}>

                    <View style={{ flex: 1 }}>

                        <ScrollView keyboardShouldPersistTaps='always' showsVerticalScrollIndicator={false}>

                            {/* Dropdown selection for currency */}
                            <TitlePicker
                                title={R.strings.CurrencyName}
                                array={this.state.currency}
                                selectedValue={this.state.selectedCurrency}
                                style={{ marginTop: R.dimens.widget_top_bottom_margin }}
                                onPickerSelect={(index, object) => this.setState({ selectedCurrency: index, currencyId: object.ServiceId })} />

                            {/* Dropdown selection for status */}
                            <TitlePicker
                                title={R.strings.status}
                                array={this.state.status}
                                selectedValue={this.state.selectedStatus}
                                style={{ marginTop: R.dimens.widget_top_bottom_margin, marginBottom: R.dimens.margin }}
                                onPickerSelect={(index) => this.setState({ selectedStatus: index, })} />

                        </ScrollView>
                    </View>
                    <View style={{ paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                        {/* To Set Add Button */}
                        <Button title={R.strings.Add} onPress={() => this.onPress()}></Button>
                    </View>
                </View>
            </SafeView>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        // get Arbitrage Manage Market data from reducer
        ManageMarketResult: state.ArbitrageManageMarketReducer,
    }
}

const mapDispatchToProps = (dispatch) => ({
    // get list currency
    getListCurrencyArbitrage: (request) => dispatch(getListCurrencyArbitrage(request)),
    // Add Arbitrage Manage Market
    AddArbiManageMarketList: (request) => dispatch(AddArbiManageMarketList(request)),
    // clear data
    clearArbiManageMarketListData: () => dispatch(clearArbiManageMarketListData()),
})

export default connect(mapStateToProps, mapDispatchToProps)(ArbitrageAddNewCurrencyScreen)