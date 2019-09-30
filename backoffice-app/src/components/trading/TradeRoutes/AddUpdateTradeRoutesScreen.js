import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { changeTheme, showAlert, parseArray } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew, isEmpty } from '../../../validations/CommonValidation';
import { isCurrentScreen } from '../../../components/Navigation';
import { connect } from 'react-redux';
import Button from '../../../native_theme/components/Button';
import EditText from '../../../native_theme/components/EditText';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import CommonToast from '../../../native_theme/components/CommonToast';
import { addTradeRoutesConfiguration, updateTradeRoutesConfiguration, cleanAddUpdateTradeRoutes, getOrderTypes, getAvailableTradeRoutes } from '../../../actions/Trading/TradeRoutesActions';
import ComboPickerWidget from '../../widget/ComboPickerWidget'
import { getPairList } from '../../../actions/PairListAction';
import R from '../../../native_theme/R';
import SafeView from '../../../native_theme/components/SafeView';

class AddUpdateTradeRoutesScreen extends Component {

    constructor(props) {
        super(props);

        //Create reference
        this.progressDialog = React.createRef();
        this.toast = React.createRef();
        this.inputs = {};

        //Data from previous screen
        let { item, isEdit } = props.navigation.state.params;

        //Define all initial state
        this.state = {
            title: (isEdit ? R.strings.update : R.strings.add) + ' ' + R.strings.tradeRoute,
            isEdit,

            currencyPairs: [{ value: R.strings.selectPair }],
            selectedCurrencyPair: isEdit ? item.PairName : R.strings.selectPair,
            PairId: isEdit ? item.PairId : 0,


            orderTypesList: [{ value: R.strings.selectOrderType }],
            selectedOrderType: isEdit ? item.OrderTypeText : R.strings.selectOrderType,
            TradeRoutesId: 0,

            trnTypes: [{ value: R.strings.selectTransactionType }, { value: R.strings.buyTrade, code: 4 }, { value: R.strings.sellTrade, code: 5 }],
            selectedTrnType: isEdit ? item.TrnTypeText : R.strings.selectTransactionType,
            selectedTrnTypeCode: 0,

            statuses: [{ value: R.strings.select_status }, { value: R.strings.active, code: 1 }, { value: R.strings.inActive, code: 0 }],
            selectedStatus: isEdit ? item.StatusText : R.strings.select_status,
            selectedStatusCode: 0,

            availableTradeRouteList: [{ value: R.strings.selectRouteURL }],
            selectedavailableTradeRoute: isEdit ? (isEmpty(item.RouteUrl) ? '-' : item.RouteUrl) : R.strings.selectRouteURL,
            selectedavailableTradeRouteCode: 0,

            assetName: isEdit ? item.AssetName : '',
            convertAmount: isEdit ? item.ConvertAmount.toString() : '',
            confirmationAmount: isEdit ? item.ConfirmationCount.toString() : '',

            Id: isEdit ? item.Id : '',
            isFirstTime: true,
        };
    }

    componentDidMount = async () => {

        //Add this method to change theme based on stored theme name.
        changeTheme();

        try {
            //To check if internet is connected
            if (await isInternet()) {

                //to get pair list
                this.props.getPairList({});

                //to get order types
                this.props.getOrderTypes();

                if (this.state.isEdit) {
                    if (this.state.selectedTrnType !== R.strings.selectTransactionType) {
                        this.props.getAvailableTradeRoutes({
                            TrnType: this.state.selectedTrnType === R.strings.buyTrade ? 4 : 5
                        })
                    }
                }

            }
        } catch (error) {
        }
    };

    shouldComponentUpdate = (nextProps, _nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps);
    };

    componentDidUpdate = (prevProps, prevState) => {
        const { availableTradeRoutes, addTradeRoutes, updateTradeRoutes, } = this.props.data;

        if (availableTradeRoutes !== prevProps.data.availableTradeRoutes) {
            if (availableTradeRoutes) {
                try {
                    //if local availableTradeRoutes state is null or its not null and also different then new response then and only then validate response.
                    if (this.state.availableTradeRoutes == null || (this.state.availableTradeRoutes != null && availableTradeRoutes !== this.state.availableTradeRoutes)) {

                        //if availableTradeRoutes response is success then store array list else store empty list
                        if (validateResponseNew({ response: availableTradeRoutes, isList: true })) {
                            let res = parseArray(availableTradeRoutes.Response);

                            for (var availableTradeRoutesKey in res) {
                                let item = res[availableTradeRoutesKey]
                                item.value = isEmpty(item.APISendURL) ? '-' : item.APISendURL
                            }

                            this.setState({ availableTradeRoutes, availableTradeRouteList: [{ value: R.strings.selectRouteURL }, ...res] });
                        } else {
                            this.setState({ availableTradeRoutes, availableTradeRouteList: [{ value: R.strings.selectRouteURL }] });
                        }
                    }
                } catch (error) {
                    this.setState({ availableTradeRouteList: [{ value: R.strings.selectRouteURL }] });
                }
            }
        }

        if (addTradeRoutes !== prevProps.data.addTradeRoutes) {
            if (addTradeRoutes) {
                try {
                    this.progressDialog.dismiss();

                    //if local addTradeRoutes state is null or its not null and also different then new response then and only then validate response.
                    if (this.state.addTradeRoutes == null || (this.state.addTradeRoutes != null && addTradeRoutes !== this.state.addTradeRoutes)) {
                        //if addThirdPartyAPIResponse response is success then store array list else store empty list
                        if (validateResponseNew({ response: addTradeRoutes })) {

                            showAlert(R.strings.status, addTradeRoutes.ReturnMsg, 0, async () => {
                                this.props.cleanAddUpdateTradeRoutes();
                                this.props.navigation.state.params.onRefresh(true);
                                this.props.navigation.goBack();
                            });

                        } else {
                            this.props.cleanAddUpdateTradeRoutes();
                        }
                    }
                } catch (error) {
                    this.props.cleanAddUpdateTradeRoutes();
                }
            }
        }

        if (updateTradeRoutes !== prevProps.data.updateTradeRoutes) {
            if (updateTradeRoutes) {
                try {
                    this.progressDialog.dismiss();

                    //if local updateTradeRoutes state is null or its not null and also different then new response then and only then validate response.
                    if (this.state.updateTradeRoutes == null || (this.state.updateTradeRoutes != null && updateTradeRoutes !== this.state.updateTradeRoutes)) {
                        //if addThirdPartyAPIResponse response is success then store array list else store empty list
                        if (validateResponseNew({ response: updateTradeRoutes })) {

                            showAlert(R.strings.status, updateTradeRoutes.ReturnMsg, 0, async () => {
                                this.props.cleanAddUpdateTradeRoutes();
                                this.props.navigation.state.params.onRefresh(true);
                                this.props.navigation.goBack();
                            });

                        } else {
                            this.props.cleanAddUpdateTradeRoutes();
                        }
                    }
                } catch (error) {
                    this.props.cleanAddUpdateTradeRoutes();
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
        if (AddUpdateTradeRoutesScreen.oldProps !== props) {
            AddUpdateTradeRoutesScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            const { pairList, orderTypes } = props.data;

            if (pairList) {
                try {
                    //if local pairList state is null or its not null and also different then new response then and only then validate response.
                    if (state.pairList == null || (state.pairList != null && pairList !== state.pairList)) {

                        //if tradingLedgers response is success then store array list else store empty list
                        if (validateResponseNew({ response: pairList, isList: true })) {
                            let res = parseArray(pairList.Response);

                            for (var pairNameItem in res) {
                                let item = res[pairNameItem]
                                item.value = item.PairName
                            }

                            return { ...state, pairList, currencyPairs: [{ value: R.strings.selectPair }, ...res] };
                        } else {
                            return { ...state, pairList, currencyPairs: [{ value: R.strings.selectPair }] };
                        }
                    }
                } catch (e) {
                    return { ...state, currencyPairs: [{ value: R.strings.selectPair }] };
                }
            }

            if (orderTypes) {
                try {
                    //if local orderTypes state is null or its not null and also different then new response then and only then validate response.
                    if (state.orderTypes == null || (state.orderTypes != null && orderTypes !== state.orderTypes)) {

                        //if orderTypes response is success then store array list else store empty list
                        if (validateResponseNew({ response: orderTypes, isList: true })) {
                            let res = parseArray(orderTypes.Response);

                            for (var orderTypesKey in res) {
                                let item = res[orderTypesKey]
                                item.value = item.OrderType
                            }

                            return { ...state, orderTypes, orderTypesList: [{ value: R.strings.selectOrderType }, ...res] };
                        } else {
                            return { ...state, orderTypes, orderTypesList: [{ value: R.strings.selectOrderType }] };
                        }
                    }
                } catch (e) {
                    return { ...state, orderTypesList: [{ value: R.strings.selectOrderType }] };
                }
            }
        }
        return null;
    }

    onSumbit = async () => {

        //Check NetWork is Available or not
        if (await isInternet()) {

            //all input validations
            if (this.state.selectedCurrencyPair === R.strings.selectPair) {
                this.toast.Show(R.strings.pairValidate);
                return;
            }
            if (this.state.selectedOrderType === R.strings.selectOrderType) {
                this.toast.Show(R.strings.orderTypeValidate);
                return;
            }
            if (this.state.selectedTrnType === R.strings.selectTransactionType) {
                this.toast.Show(R.strings.transactionTypeValidate)
                return;
            }
            if (this.state.selectedStatus === R.strings.select_status) {
                this.toast.Show(R.strings.statusValidate)
                return;
            }
            if (isEmpty(this.state.assetName)) {
                this.toast.Show(R.strings.assetNameValidate);
                return;
            }
            if (isEmpty(this.state.convertAmount)) {
                this.toast.Show(R.strings.convertAmountValidate);
                return;
            }
            if (isEmpty(this.state.confirmationAmount)) {
                this.toast.Show(R.strings.confirmationAmountValidate);
                return;
            }
            if (this.state.selectedavailableTradeRoute === R.strings.selectRouteURL) {
                this.toast.Show(R.strings.routeURLValidate)
                return;
            }

            try {
                let request = {
                    "PairId": this.state.PairId,
                    "OrderType": this.state.TradeRoutesId,
                    "TrnType": this.state.selectedTrnTypeCode,
                    "Status": this.state.selectedStatusCode,
                    "RouteUrlId": this.state.selectedavailableTradeRouteCode,
                    "AssetName": this.state.assetName,
                    "ConvertAmount": parseInt(this.state.convertAmount),
                    "ConfirmationCount": parseInt(this.state.confirmationAmount)
                }

                this.progressDialog.show();

                if (this.state.isEdit) {

                    //Call updateTradeRoutesConfiguration api
                    this.props.updateTradeRoutesConfiguration({
                        Id: this.state.Id,
                        ...request
                    });
                } else {

                    //Call addTradeRoutesConfiguration api
                    this.props.addTradeRoutesConfiguration(request);
                }

            } catch (error) {
            }
        }

    }

    render() {

        let { isAddingTradeRoutes, isUpdatingTradeRoutes, isLoadingOrderTypes, isLoadingAvailableTradeRoutes, isLoadingPair } = this.props.data;
        let isShow = isAddingTradeRoutes || isUpdatingTradeRoutes || isLoadingOrderTypes || isLoadingAvailableTradeRoutes || isLoadingPair;

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background, }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    title={this.state.title}
                    isBack={true}
                    nav={this.props.navigation}
                />

                {/* Progress Dialog */}
                <ProgressDialog ref={(component) => this.progressDialog = component} isShow={isShow} />

                {/* For Toast */}
                <CommonToast ref={(component) => this.toast = component} />

                <View style={{
                    flex: 1, justifyContent: 'space-between',
                    paddingLeft: R.dimens.activity_margin,
                    paddingRight: R.dimens.activity_margin,
                    paddingTop: R.dimens.padding_top_bottom_margin
                }}>

                    <View style={{ flex: 1 }}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <ComboPickerWidget
                                style={{ paddingLeft: 0, paddingRight: 0 }}
                                pickers={[
                                    {
                                        title: R.strings.pairName,
                                        array: this.state.currencyPairs,
                                        selectedValue: this.state.selectedCurrencyPair,
                                        onPickerSelect: (index, object) => this.setState({ selectedCurrencyPair: index, PairId: object.PairId })
                                    },
                                    {
                                        title: R.strings.orderType,
                                        array: this.state.orderTypesList,
                                        selectedValue: this.state.selectedOrderType,
                                        onPickerSelect: (index, object) => this.setState({ selectedOrderType: index, TradeRoutesId: object.ID })
                                    },
                                    {
                                        title: R.strings.transactionType,
                                        array: this.state.trnTypes,
                                        selectedValue: this.state.selectedTrnType,
                                        onPickerSelect: (index, object) => {
                                            if (index !== R.strings.selectTransactionType) {
                                                //To get available trade routes
                                                let TrnType = object.code;
                                                this.props.getAvailableTradeRoutes({ TrnType })
                                            }

                                            this.setState({
                                                selectedTrnType: index,
                                                selectedTrnTypeCode: object.code,
                                                availableTradeRouteList: [{ value: R.strings.selectRouteURL }],
                                                selectedavailableTradeRoute: R.strings.selectRouteURL,
                                            });
                                        }
                                    },
                                    {
                                        title: R.strings.status,
                                        array: this.state.statuses,
                                        selectedValue: this.state.selectedStatus,
                                        onPickerSelect: (index, object) => this.setState({ selectedStatus: index, selectedStatusCode: object.code })
                                    }
                                ]}
                            />

                            {/* Inputfield for assetName */}
                            <EditText
                                reference={input => { this.inputs['etAssetName'] = input; }}
                                value={this.state.assetName}
                                header={R.strings.assetName}
                                placeholder={R.strings.assetName}
                                onChangeText={(text) => this.setState({ assetName: text })}
                                multiline={false}
                                returnKeyType={"next"}
                                blurOnSubmit={false}
                                onSubmitEditing={() => { this.inputs['etConvertAmount'].focus() }} />

                            {/* Inputfield for convertAmount */}
                            <EditText
                                reference={input => { this.inputs['etConvertAmount'] = input; }}
                                value={this.state.convertAmount}
                                header={R.strings.convertAmount}
                                placeholder={R.strings.convertAmount}
                                onChangeText={(text) => this.setState({ convertAmount: text })}
                                multiline={false}
                                validate={true}
                                keyboardType={'numeric'}
                                returnKeyType={"next"}
                                blurOnSubmit={false}
                                onSubmitEditing={() => { this.inputs['etConfirmationAmount'].focus() }} />

                            {/* Inputfield for confirmationAmount */}
                            <EditText
                                reference={input => { this.inputs['etConfirmationAmount'] = input; }}
                                value={this.state.confirmationAmount}
                                header={R.strings.confirmationAmount}
                                placeholder={R.strings.confirmationAmount}
                                onChangeText={(text) => this.setState({ confirmationAmount: text })}
                                validate={true}
                                keyboardType={'numeric'}
                                multiline={false}
                                returnKeyType={"done"} />

                            {/* dropdown for routeURL */}
                            <ComboPickerWidget
                                style={{ paddingLeft: 0, paddingRight: 0, marginBottom: R.dimens.margin }}
                                pickers={[
                                    {
                                        title: R.strings.routeURL,
                                        array: this.state.availableTradeRouteList,
                                        selectedValue: this.state.selectedavailableTradeRoute,
                                        onPickerSelect: (index, object) => this.setState({ selectedavailableTradeRoute: index, selectedavailableTradeRouteCode: object.Id })
                                    }
                                ]}
                            />
                        </ScrollView>
                    </View>
                    <View style={{ paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
                        {/* To Set Add or Edit Button */}
                        <Button title={this.state.isEdit ? R.strings.update : R.strings.add} onPress={this.onSumbit} />
                    </View>
                </View>

            </SafeView>
        );
    }
}

function mapStatToProps(state) {
    //Updated tradeRoutesBOReducer Data 
    return {
        data: {
            ...state.tradeRoutesBOReducer,
            ...state.pairListReducer
        }
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform addTradeRoutesConfiguration action
        addTradeRoutesConfiguration: (payload) => dispatch(addTradeRoutesConfiguration(payload)),
        //Perform updateTradeRoutesConfiguration action
        updateTradeRoutesConfiguration: (payload) => dispatch(updateTradeRoutesConfiguration(payload)),
        //Perform getPairList action
        getPairList: (payload) => dispatch(getPairList(payload)),
        //Perform getOrderTypes action
        getOrderTypes: () => dispatch(getOrderTypes()),
        //Perform getAvailableTradeRoutes action
        getAvailableTradeRoutes: (payload) => dispatch(getAvailableTradeRoutes(payload)),
        //clear data
        cleanAddUpdateTradeRoutes: () => dispatch(cleanAddUpdateTradeRoutes())
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(AddUpdateTradeRoutesScreen);