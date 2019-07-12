import React, { Component } from 'react';
import {
    View,
    FlatList,
    TouchableWithoutFeedback,
    RefreshControl,
    Easing
} from 'react-native';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar'
import { connect } from 'react-redux'
import { changeTheme, parseArray, convertDate, getCurrentDate, showAlert, addListener, parseFloatVal, createOptions, createActions, convertDateTime } from '../../controllers/CommonUtils';
import { isCurrentScreen, addRouteToBackPress } from '../Navigation'
import ListLoader from '../../native_theme/components/ListLoader';
import { fetchOpenOrders, cancelOpenOrder, clearCancelOpenOrder, clearOpenOrder } from '../../actions/Trade/OpenOrderActions';
import CustomToolbar from '../../native_theme/components/CustomToolbar'
import arraySort from 'array-sort';
import { isInternet, validateResponseNew } from '../../validations/CommonValidation'
import { ListEmptyComponent, contentContainerStyle } from '../../native_theme/components/FlatListWidgets';
import { DateValidation } from '../../validations/DateValidation';
import Drawer from 'react-native-drawer-menu';
import CommonToast from '../../native_theme/components/CommonToast';
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import FilterWidget from '../Widget/FilterWidget';
import { getPairList, clearPairList } from '../../actions/PairListAction';
import { Method, ServiceUtilConstant, Fonts } from '../../controllers/Constants';
import R from '../../native_theme/R';
import ImageButton from '../../native_theme/components/ImageTextButton';
import CardView from '../../native_theme/components/CardView';
import Separator from '../../native_theme/components/Separator';
import TextViewMR from '../../native_theme/components/TextViewMR';
import AlertDialog from '../../native_theme/components/AlertDialog';
import TextViewHML from '../../native_theme/components/TextViewHML';
import OptionsMenu from "react-native-options-menu";
import { getData } from '../../App';
import { FeatureSwitch } from '../../native_theme/components/FeatureSwitch';
import SafeView from '../../native_theme/components/SafeView';
import AnimatableItem from '../../native_theme/components/AnimatableItem';

// order type data to compare with api response
const orderTypes = [
    { "type": "LIMIT", "ID": "1" }, { "type": "MARKET", "ID": "2" }, // { "type": "SPOT", "ID": "3" },{ "type": "STOP_Limit", "ID": "4" },
]

class OpenOrder extends Component {

    constructor(props) {
        super(props);

        //request to pass in API call
        this.request = {};

        //Create Reference
        this.optionExchange = React.createRef();
        this.toast = React.createRef();
        this.drawer = React.createRef();

        //Add Current Screen to Manual Handling BackPress Events
        addRouteToBackPress(props);

        //Binding methods
        this.onCancelPress = this.onCancelPress.bind(this);
        this.onRefresh = this.onRefresh.bind(this);
        this.onChangeType = this.onChangeType.bind(this);
        this.onResetPress = this.onResetPress.bind(this);
        this.onHideTogglePress = this.onHideTogglePress.bind(this);
        this.handleOptionMenu = this.handleOptionMenu.bind(this);
        this.onBackPress = this.onBackPress.bind(this);
        this.props.navigation.setParams({ onBackPress: this.onBackPress });
        this.onCompletePress = this.onCompletePress.bind(this);

        let pairName = '';

        // check this Open Order is currently using by widget or not
        if (props.isWidget !== undefined && props.isWidget == true) {
            pairName = props.pairName
        } else {
            if (props.navigation.state.params !== undefined) {
                pairName = props.navigation.state.params.pairName
            }
        }

        //Define All initial State
        this.state = {
            pairName: pairName,
            openOrder: null,
            cancelOpenOrder: null,
            response: [],
            isToggle: false,
            filterResponse: [],
            searchInput: '',
            stToDate: getCurrentDate(),
            stFromDate: getCurrentDate(),
            refreshing: false,
            Type: [
                { value: R.strings.all, },
                { value: R.strings.buy, },
                { value: R.strings.sell }
            ],
            CurrencyPair: [],
            selectedType: R.strings.all,
            cancelAllOrders: [R.strings.cancelAllOrders, R.strings.cancelLimitsOrders, R.strings.cancelMarketsOrders, R.strings.cancelStopLimitsOrders],
            selectedCurrencyPair: R.strings.all,
            socketData: [],
            isFirstTime: true,
            cancelItem: null,
            isDelete: false,
            isDrawerOpen: false, // First Time Drawer is Closed
        };
    }

    async componentDidMount() {

        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {

            if (this.props.isWidget === undefined ||
                (this.props.isWidget !== undefined && this.props.isWidget == false)) {

                //call api to get pair list
                this.props.getCurrencyPairs();

                // Bind Request for Open Order
                this.request = {}

                //Call Open Orders Api
                this.props.getOpenOrder(this.request)
            }
        }

        // Handle Signal-R response for open order
        this.listenerRecieveActiveOrder = addListener(Method.RecieveActiveOrder, (receivedMessage) => {

            try {
                if (JSON.parse(receivedMessage).Data) {

                    let signalData = JSON.parse(receivedMessage);
                    let newData = JSON.parse(receivedMessage).Data;

                    if ((signalData.EventTime && this.state.socketData.length === 0) || (this.state.socketData.length !== 0 && signalData.EventTime >= this.state.socketData.EventTime)) {

                        if (typeof signalData.IsMargin !== 'undefined' && signalData.IsMargin === 0) {

                            //get latest list
                            let latestOrderList = this.state.response;

                            let openOrder = [];

                            if (parseFloatVal(newData.Price) !== 0) {

                                //find index of same Id record
                                var findIndexOrderId = latestOrderList.findIndex(order => parseFloatVal(order.Id) === parseFloatVal(newData.Id));

                                //if same id record is not found then check for amount validation
                                if (findIndexOrderId === -1) {

                                    //if amount of new record is greater then 0 then add to list
                                    if (parseFloatVal(newData.Amount) !== 0) {

                                        openOrder.push(newData);
                                        latestOrderList.map((value, key) => { openOrder.push(value) })
                                    }
                                } else {

                                    //if amount of new record is greater then 0 then update amount in existing record
                                    if (parseFloatVal(newData.Amount) > 0) {

                                        latestOrderList[findIndexOrderId].Amount = newData.Amount;
                                        openOrder = latestOrderList;
                                    } else {

                                        //remove record if its amount is not greater than 0
                                        latestOrderList.splice(findIndexOrderId, 1);
                                        openOrder = latestOrderList;
                                    }
                                }

                            } else if (parseFloatVal(newData.Price) === 0 && parseFloatVal(newData.Amount) >= 0) {

                                // if price and amount both are 0 then remove record
                                if (parseFloatVal(newData.Amount) == 0) {

                                    //find index of same Id record
                                    var removeRecordIndex = latestOrderList.findIndex(order => parseFloatVal(order.Id) === parseFloatVal(newData.Id));

                                    if (removeRecordIndex > -1) {
                                        //remove record if its amount is 0
                                        latestOrderList.splice(removeRecordIndex, 1);
                                        openOrder = latestOrderList;
                                    }
                                } else {

                                    openOrder.push(newData);
                                    latestOrderList.map((value, _key) => { openOrder.push(value) })
                                }
                            }

                            //Sort array based on DateTime in decending
                            let sortedArray = arraySort(openOrder, 'TrnDate', { reverse: true });

                            // check for current screen
                            if (isCurrentScreen(this.props)) {
                                this.setState({ response: sortedArray, socketData: signalData, });
                            }
                        }
                    }
                }
            } catch (error) {
                //parsing error
            }
        })
    };

    //for BackPress if Drawer is Open Than First Close The Drawer else Back to Previous Screen
    onBackPress() {
        if (this.state.isDrawerOpen) {
            this.drawer.closeDrawer();
            this.setState({ isDrawerOpen: false, })
        }
        else {
            //going back screen
            this.props.navigation.goBack();
        }
    }

    shouldComponentUpdate(nextProps, nextState) {

        //If theme or locale is changed then update componenet
        if (this.props.preference.theme !== nextProps.preference.theme ||
            this.props.preference.locale !== nextProps.preference.locale ||
            this.props.preference.dimensions.isPortrait !== nextProps.preference.dimensions.isPortrait) {
            return true;
        } else {

            //if component's isWidget & shouldDisplay both props are missing then display open order
            if (this.props.isWidget === undefined &&
                this.props.shouldDisplay === undefined) {

                // stop twice api call
                return isCurrentScreen(nextProps);
            } else if ((this.props.isWidget !== undefined && this.props.isWidget) &&
                (this.props.shouldDisplay !== undefined && this.props.shouldDisplay)) {

                // stop twice api call
                return isCurrentScreen(nextProps);
            } else {
                return false;
            }
        }
    };

    componentWillUnmount = () => {
        // Remove Listener
        if (this.listenerRecieveActiveOrder) {
            this.listenerRecieveActiveOrder.remove();
        }
        // Call action to clear Reducer data
        this.props.clearOpenOrder();
        this.props.clearPairList();
    }

    static oldProps = {};

    static getDerivedStateFromProps(props, state) {

        let displayCondition;

        //if component's isWidget & shouldDisplay both props are missing then display open order
        if (props.isWidget === undefined &&
            props.shouldDisplay === undefined) {

            displayCondition = true;

            //To Skip Render First Time for available reducer data if exists as its Open Order's original Component Screen
            if (state.isFirstTime) {
                return Object.assign({}, state, {
                    isFirstTime: false
                });
            }
        }
        //If isWidget props is true and shouldDisplay is true then display open order 
        else if ((props.isWidget !== undefined && props.isWidget) &&
            (props.shouldDisplay !== undefined && props.shouldDisplay)) {
            displayCondition = true;
        } else {
            //Don't execute code
            displayCondition = false;
        }

        // To Skip Render if old and new props are equal
        if (OpenOrder.oldProps !== props) {
            OpenOrder.oldProps = props;
        } else {
            return null;
        }

        if (displayCondition && isCurrentScreen(props)) {

            //Get All Updated field of Particular actions
            const { openOrder, pairList, } = props.result

            try {
                //If openOrder is not null then handle response
                if (openOrder) {

                    if (state.openOrder == null || (state.openOrder != null && openOrder !== state.openOrder)) {

                        //If response is success then handle array
                        if (validateResponseNew({ response: openOrder, isList: true })) {

                            let res = parseArray(openOrder.response);

                            let finalRecords = [];

                            res.map(item => {
                                if (props.isWidget !== undefined && props.isWidget == true) {
                                    if (finalRecords.length < 5) { finalRecords.push(item); }
                                }
                                else { finalRecords.push(item); }
                            })

                            return Object.assign({}, state, {
                                openOrder, response: finalRecords, refreshing: false,
                            })
                        } else {
                            return Object.assign({}, state, { openOrder, response: [], refreshing: false, });
                        }
                    }
                }

                //if pairList response is not null then handle resposne
                if (pairList) {

                    //if local pairList state is null or its not null and also different then new response then and only then validate response.
                    if (state.pairList == null || (state.pairList != null && pairList !== state.pairList)) {

                        //if tradingLedgers response is success then store array list else store empty list
                        if (validateResponseNew({ response: pairList, isList: true })) {
                            let res = parseArray(pairList.Response);

                            res.map((item, index) => { res[index].value = item.PairName; })

                            let CurrencyPair = [
                                { value: R.strings.all }, ...res
                            ];

                            return Object.assign({}, state, {
                                pairList, CurrencyPair,
                            })

                        } else {
                            return Object.assign({}, state, {
                                pairList, CurrencyPair: [{ value: R.strings.all }]
                            });
                        }
                    }
                }
            } catch (error) {
                return Object.assign({}, state, {
                    refreshing: false,
                })
            }
        }
        return null;
    }

    componentDidUpdate = (prevProps, prevState) => {

        //Get All Updated field of Particular actions
        let { result: { cancelopenorderdata } } = this.props;

        //If current and previous both cancel open order is different
        if (cancelopenorderdata !== prevProps.result.cancelopenorderdata) {

            //If cancel open order data is not null and validating response is success than show dialog.
            if (cancelopenorderdata && validateResponseNew({ response: cancelopenorderdata, })) {

                //On Ok button press clear cancel open order data.
                showAlert(R.strings.Success + '!', cancelopenorderdata.ReturnMsg, 0, () => {
                    this.setState({ cancelItem: null, })
                    this.props.clearCancelOpenOrder()
                });
            }
        }
    };

    // Call when press on Cancel button from Flatlist Item
    async onCancelPress() {

        this.setState({ isDelete: false, })

        //Check NetWork is Available or not
        if (await isInternet()) {

            // Call api for cancel Order
            this.props.cancelOpenOrder({ TranNo: this.state.cancelItem.Id, CancelAll: 0, OrderType: 0 })
        }
    }

    // for showing cancel dialog 
    showCancelDialog(message, requestCall = false, OrderType = 0) {
        if (requestCall) {
            //show cancel order dialog with appropriate message.
            showAlert(
                R.strings.cancelOrder,
                message,
                3,
                async () => {

                    //Check NetWork is Available or not
                    if (await isInternet()) {

                        //Request to Cancel All Orders
                        let request = { TranNo: 0, CancelAll: OrderType == 0 ? 1 : 2, OrderType: OrderType };

                        //Request to Cancel All Orders
                        this.props.cancelOpenOrder(request)
                    }
                },
                R.strings.cancel,
            );
        } else {
            //show cancel order dialog with appropriate message.
            showAlert(
                R.strings.cancelOrder,
                message,
                3
            );
        }
    }

    // to cancel all orders based on its type
    handleOptionMenu(i) {

        // To get dialog show count from preference
        let dialogShowCount = getData(ServiceUtilConstant.KEY_DialogCount);

        // If dialog show count is 0 then show dialog
        if (dialogShowCount == 0) {

            //To set Order Type as per Order Sequence, where 3 will be considered as 4 and rest of in sequence.
            let OrderType = i == 3 ? 4 : i;

            //If OrderType is 0 than set true otherwise get its true/false based on records availabelities
            let isOrderType = OrderType == 0;

            // If OrderType is 0 than it means cancel all orders
            if (OrderType != 0) {

                // Loop through all records to find similar records
                this.state.response.map((value) => {

                    // Loop through all available order types
                    orderTypes.map((item) => {

                        // If Order Types are same in available records than store bit to true so that we can laters call api for it.
                        if (item.ID === OrderType.toString() && item.type === value.OrderType) { isOrderType = true; }
                    });
                })
            }

            // if there are records available to cancel than show dialog
            if (this.state.response.length > 0 && isOrderType) {

                let message;

                switch (i) {
                    case 0:
                        message = R.strings.cancelAllMessage;
                        break;
                    case 1:
                        message = R.strings.formatString(R.strings.cancelMessage, { type: R.strings.limit });
                        break;
                    case 2:
                        message = R.strings.formatString(R.strings.cancelMessage, { type: R.strings.market });
                        break;
                    case 3:
                        message = R.strings.formatString(R.strings.cancelMessage, { type: R.strings.stopLimit });
                        break;
                    default:
                        message = R.strings.cancelAllMessage;
                        break;
                }
                this.showCancelDialog(message, true, OrderType);
            } else {
                this.showCancelDialog(R.strings.ordersNotAvailable, false)
            }
        }
    }


    //For Swipe to referesh Functionality
    async onRefresh() {
        this.setState({ refreshing: true, });

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Call Get Withdraw History API
            this.props.getOpenOrder(this.request)
            //----------
        } else {
            this.setState({ refreshing: false, });
        }
    }

    // to show only open orders for selected pair and hide other open order
    async onHideTogglePress() {
        this.setState({ isToggle: !this.state.isToggle, })

        //Check NetWork is Available or not
        if (await isInternet()) {

            // Bind Request for OpenOrder
            this.request = {
                ...this.request, pairName: this.state.isToggle ? this.state.pairName : '',
            }

            //Call Get Open Order API
            this.props.getOpenOrder(this.request)
            //----------
        } else {
            this.setState({ refreshing: false, });
        }
    }

    // Change Currency Pair from Dropdown
    onChangeCurrencyPair = (item) => {
        this.setState({ selectedCurrencyPair: item, })
    }

    // Change Type from Dropdown
    onChangeType(item) {
        this.setState({ selectedType: item, })
    }

    // When user press on Reset Button from Drop Down
    async onResetPress() {

        // Bind Request for OpenOrder
        this.request = {};

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Call Open Order api for flatlist
            this.props.getOpenOrder(this.request);

        } else {
            this.setState({ refreshing: false, })
        }
        this.setState({ stToDate: getCurrentDate(), stFromDate: getCurrentDate(), selectedCurrencyPair: R.strings.all, selectedType: R.strings.all })

        // Close Drawer user press on Complete button bcoz display flatlist item on Screen 
        this.drawer.closeDrawer();
    }

    // When user press on Complete Button from Drop Down
    async onCompletePress() {

        //Check All From Date and To Date Validation
        if (DateValidation(this.state.stFromDate, this.state.stToDate)) {
            this.toast.Show(DateValidation(this.state.stFromDate, this.state.stToDate));
            return;
        } else {
            var fromDate
            var toDate
            if (this.state.stFromDate != '' || this.state.stToDate != '') {
                fromDate = convertDate(this.state.stFromDate)
                toDate = convertDate(this.state.stToDate)
            }

            //Call Get Open Order API
            if (this.state.selectedType.includes(R.strings.all) && this.state.selectedCurrencyPair.includes(R.strings.all)) {

                // Bind Request for Open Order
                this.request = {
                    ...this.request,
                    pairName: '',
                    fromDate,
                    toDate,
                    orderType: '',
                }

                //Check NetWork is Available or not
                if (await isInternet()) {

                    // Call Api for Open Order
                    this.props.getOpenOrder(this.request)
                } else {
                    this.setState({ refreshing: false, })
                }

            } else if (this.state.selectedType.includes(R.strings.all)) {

                // Bind Request for Open Order api
                this.request = {
                    ...this.request,
                    pairName: this.state.selectedCurrencyPair,
                    fromDate,
                    orderType: '',
                    toDate,
                }

                //Check NetWork is Available or not
                if (await isInternet()) {

                    // call api for OpenOrder
                    this.props.getOpenOrder(this.request);
                } else {
                    this.setState({ refreshing: false, })
                }


            } else if (this.state.selectedCurrencyPair.includes(R.strings.all)) {

                // Bind Request for Open Order api
                this.request = {
                    ...this.request,
                    orderType: this.state.selectedType,
                    pairName: '',
                    toDate,
                    fromDate,
                }

                //Check NetWork is Available or not
                if (await isInternet()) {

                    // call api for OpenOrder
                    this.props.getOpenOrder(this.request);
                } else {
                    this.setState({ refreshing: false, })
                }
            } else {

                // Bind Request for Open Order api
                this.request = {
                    ...this.request,
                    toDate,
                    fromDate,
                    orderType: this.state.selectedType,
                    pairName: this.state.selectedCurrencyPair,
                }

                //Check NetWork is Available or not
                if (await isInternet()) {

                    // call api for OpenOrder
                    this.props.getOpenOrder(this.request);
                } else {
                    this.setState({ refreshing: false, })
                }
            }

            // Close Drawer user press on Complete button bcoz display flatlist item on Screen
            this.drawer.closeDrawer();
        }
    }

    navigationDrawer() {
        return (
            <SafeView style={this.styles().container}>

                {/* For Display Toast */}
                <CommonToast ref={component => this.toast = component} styles={{ width: R.dimens.FilterDrawarWidth, }} />

                {/* FilterWidget for show fromdate, toDate, type and CurrencyPair */}
                <FilterWidget
                    FromDatePickerCall={(date) => this.setState({ stFromDate: date })}
                    FromDate={this.state.stFromDate}
                    ToDatePickerCall={(date) => this.setState({ stToDate: date })}
                    ToDate={this.state.stToDate}
                    onResetPress={this.onResetPress}
                    comboPickerStyle={{ marginTop: 0 }}
                    onCompletePress={this.onCompletePress}
                    pickers={[{
                        title: R.strings.Type,
                        selectedValue: this.state.selectedType,
                        array: this.state.Type,
                        onPickerSelect: (item) => this.onChangeType(item)
                    },
                    {
                        selectedValue: this.state.selectedCurrencyPair,
                        title: R.strings.currencyPair,
                        array: this.state.CurrencyPair,
                        onPickerSelect: (item) => this.onChangeCurrencyPair(item)
                    }
                    ]}
                />
            </SafeView>
        )
    }

    render() {
        //loading bit for handling progress dialog
        var { isOpenOrder, isFetchingCancelOpenOrder, } = this.props.result

        //for final items from search input (validate on PairName, Amount)
        //default searchInput is empty so it will display all records.
        let finalItems;
        let finalItem = this.state.response;
        if (finalItem) {
            finalItems = finalItem.filter((item) => {
                if (item) {
                    return item.PairName.replace('_', '/').toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
                        parseFloatVal(item.Price).toFixed(8).includes(this.state.searchInput) ||
                        item.Type.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
                        parseFloatVal(item.Amount).toFixed(8).includes(this.state.searchInput) ||
                        item.OrderType.toLowerCase().includes(this.state.searchInput.toLowerCase())
                } else {
                    return true;
                }
            })
        }

        if (this.props.isWidget) {

            return (<View>

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }}>
                    <TextViewMR style={{
                        margin: R.dimens.margin,
                        color: R.colors.textPrimary,
                        fontSize: R.dimens.mediumText,
                    }}>{R.strings.openOrder}</TextViewMR>

                    {finalItems.length > 0 && <ImageButton
                        onPress={() => this.props.navigation.navigate('OpenOrder')}
                        icon={R.images.RIGHT_ARROW_DOUBLE}
                        style={{ marginBottom: 0, marginTop: 0, }}
                        iconStyle={{
                            tintColor: R.colors.textPrimary,
                            height: R.dimens.dashboardMenuIcon,
                            width: R.dimens.dashboardMenuIcon,
                        }} />}
                </View>

                {/* Dialog for cancel order */}
                {this.cancelOrderDialog()}

                {/* Flatlist Data which is get from api */}
                {
                    /* ActvityIndicator will shown if  isOpenOrder is true otherwise flatlist shown  */
                    (isOpenOrder && !this.state.refreshing) ?
                        <View style={{ height: R.dimens.emptyListWidgetHeight, }}>
                            <ListLoader />
                        </View>
                        :
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            data={finalItems}
                            renderItem={({ item, index }) => {
                                return <OpenOrderItem
                                    item={item}
                                    index={index}
                                    onPress={() => this.setState({ cancelItem: item, isDelete: true })}
                                    preference={this.props.preference}
                                    size={this.state.response.length} />
                            }}
                            keyExtractor={(item, index) => index.toString()}
                            contentContainerStyle={contentContainerStyle(finalItems)}
                            ListEmptyComponent={<View style={{ height: R.dimens.emptyListWidgetHeight }}>
                                <ListEmptyComponent icon={R.images.IC_WARNING_FILE} iconStyle={{ tintColor: null }} />
                            </View>}
                            /* For Refresh Functionality In FlatList */
                            refreshControl={
                                <RefreshControl
                                    progressBackgroundColor={R.colors.background}
                                    colors={[R.colors.accent]}
                                    onRefresh={this.onRefresh}
                                    refreshing={this.state.refreshing}
                                />
                            }
                        />
                }
            </View>
            );
        }

        return (
            // show drawer for apply filter
            <Drawer
                ref={component => this.drawer = component}
                drawerPosition={Drawer.positions.Right}
                drawerContent={this.navigationDrawer()}
                drawerWidth={R.dimens.FilterDrawarWidth}
                onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
                onDrawerClose={() => this.setState({ isDrawerOpen: false })}
                type={Drawer.types.Overlay}
                easingFunc={Easing.ease}
            >
                <SafeView style={this.styles().container}>

                    {/* To set status bar as per our theme */}
                    <CommonStatusBar />

                    {/* Progress Dialog */}
                    <ProgressDialog isShow={!this.props.isWidget && isFetchingCancelOpenOrder} />

                    {/* To set toolbar as per our theme */}
                    <CustomToolbar
                        isBack={true}
                        title={R.strings.openorder}
                        searchable={true}
                        onBackPress={this.onBackPress}
                        onSearchText={(input) => this.setState({ searchInput: input })}
                        onRightMenuPress={() => this.drawer.openDrawer()}
                        rightIcon={R.images.FILTER}
                        nav={this.props.navigation}
                    />

                    {/* Hide Other Pair Design which can show/hide all pair */}
                    {this.renderSwitch()}

                    {/* Dialog for cancel order */}
                    {this.cancelOrderDialog()}

                    <Separator />

                    <View style={{ flex: 1, marginTop: R.dimens.widgetMargin }}>

                        {/* Flatlist Data which is get from api */}
                        {
                            /* ActvityIndicator will shown if  isOpenOrder is true otherwise flatlist shown  */
                            (isOpenOrder && !this.state.refreshing) ?
                                <ListLoader />
                                :
                                <FlatList
                                    showsVerticalScrollIndicator={false}
                                    data={finalItems}
                                    renderItem={({ item, index }) => {
                                        return <OpenOrderItem
                                            preference={this.props.preference}
                                            index={index}
                                            item={item}
                                            isPortrait={this.props.preference.dimensions.isPortrait}
                                            onPress={() => this.setState({ cancelItem: item, isDelete: true })}
                                            size={this.state.response.length} />
                                    }}
                                    contentContainerStyle={contentContainerStyle(finalItems)}
                                    ListEmptyComponent={<ListEmptyComponent />}
                                    keyExtractor={item => item.Id.toString()}
                                    /* For Refresh Functionality In FlatList */
                                    refreshControl={
                                        <RefreshControl
                                            colors={[R.colors.accent]}
                                            refreshing={this.state.refreshing}
                                            onRefresh={this.onRefresh}
                                            progressBackgroundColor={R.colors.background}
                                        />
                                    }
                                />
                        }
                    </View>
                </SafeView>
            </Drawer>
        );
    }

    // for switch view
    renderSwitch() {
        return <View style={this.styles().hidepairview}>
            <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row' }}>
                <FeatureSwitch
                    title={R.strings.hideotherpair}
                    backgroundColor={R.colors.background}
                    reverse={true}
                    style={{ paddingTop: 0, paddingLeft: 0, paddingRight: 0, paddingBottom: 0 }}
                    onValueChange={this.onHideTogglePress}
                    isToggle={this.state.isToggle}
                    tintColor={R.colors.textSecondary}
                    textStyle={{ color: R.colors.textPrimary, fontFamily: Fonts.MontserratRegular }}
                />
            </View>

            <View style={{ justifyContent: 'flex-end', }}>
                <OptionsMenu
                    ref={component => {
                        this.optionExchange = component;
                    }}
                    customButton={
                        <ImageButton
                            icon={R.images.VERTICAL_MENU}
                            onPress={() => {
                                this.optionExchange.handlePress();
                            }}
                            style={{ margin: R.dimens.widgetMargin, }}
                            iconStyle={{ width: R.dimens.dashboardMenuIcon, tintColor: R.colors.textPrimary, height: R.dimens.dashboardMenuIcon }}
                        />}
                    options={createOptions(this.state.cancelAllOrders)}
                    actions={createActions([() => this.handleOptionMenu(0), () => this.handleOptionMenu(1), () => this.handleOptionMenu(2), () => this.handleOptionMenu(3)])}
                />
            </View>
        </View>
    }

    // dialog for cancel order
    cancelOrderDialog() {
        return (<AlertDialog
            title={R.strings.cancelOrder}
            visible={this.state.isDelete}
            negativeButton={{
                hide: false,
                onPress: () => this.setState({ cancelItem: null, isDelete: false, }),
            }}
            positiveButton={{
                title: R.strings.cancel,
                onPress: this.onCancelPress,
            }}
            requestClose={() => this.setState({ cancelItem: null, isDelete: false, })}>
            {this.state.cancelItem && <View style={{ justifyContent: 'space-between', }}>
                <View>
                    {this.renderHeader({ module: this.state.cancelItem.Type + ' - ' + this.state.cancelItem.OrderType, pairName: this.state.cancelItem.PairName.replace('_', '/') })}
                    {this.renderKeyValues({ key: R.strings.Amount, value: parseFloatVal(this.state.cancelItem.Amount).toFixed(8) })}
                    {this.renderKeyValues({ key: R.strings.price, value: parseFloatVal(this.state.cancelItem.Price).toFixed(8) })}
                </View>
                <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, marginTop: R.dimens.widget_top_bottom_margin }}>
                    {R.strings.cancelSingleOrder}
                </TextViewHML>
            </View>}

        </AlertDialog>)
    }

    // header for cancel order dialog
    renderHeader(props) {
        let color = this.state.cancelItem.Type.toLowerCase() === R.strings.buy.toLowerCase() ? R.colors.successGreen : R.colors.failRed;
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
                <Separator height={R.dimens.largeText} width={R.dimens.statusIndicatorWidth} style={{ marginLeft: 0, marginRight: R.dimens.widgetMargin }} color={color} />
                <TextViewMR style={{ width: '70%', fontSize: R.dimens.smallText, color: R.colors.textPrimary }}>{props.module}</TextViewMR>
                <TextViewMR style={{ width: '30%', fontSize: R.dimens.smallText, textAlign: 'right', color: R.colors.textPrimary }}>{props.pairName}</TextViewMR>
            </View>
        )
    }

    // for display key name and value for cancel order dialog
    renderKeyValues(props) {
        return (
            <View style={{ flexDirection: 'row', marginLeft: R.dimens.widgetMargin + R.dimens.LineHeight, }}>
                {/* Key Name */}
                <TextViewHML style={{ flex: 1, fontSize: R.dimens.smallText, color: R.colors.textPrimary, }}>{props.key}</TextViewHML>

                {/* If Value is not null then display value */}
                {props.value && <TextViewHML style={{ flex: 1, color: R.colors.textPrimary, textAlign: 'right', fontSize: R.dimens.smallText }}>{props.value}</TextViewHML>}
            </View>
        )
    }

    // styles for this class
    styles = () => {
        return {
            container: {
                backgroundColor: R.colors.background,
                flex: 1,
            },
            hidepairview: {
                flexDirection: 'row',
                marginBottom: R.dimens.widget_top_bottom_margin,
                marginRight: R.dimens.margin_left_right,
                marginTop: R.dimens.widget_top_bottom_margin,
                marginLeft: R.dimens.margin_left_right,
            }
        }
    }
}

class OpenOrderItem extends Component {

    shouldComponentUpdate(nextProps) {

        //Check If Old Props and New Props are Equal then Return False
        if (this.props.preference.theme !== nextProps.preference.theme ||
            this.props.preference.locale !== nextProps.preference.locale ||
            this.props.isPortrait !== nextProps.isPortrait ||
            this.props.item !== nextProps.item) {
            return true;
        }
        return false;
    }

    render() {
        // Get required fields from props
        let props = this.props;
        let item = props.item;

        let fontColor;

        // if item.side is Buy then their side color is buyerGreen otherwise sellerPink
        if (item.Type.toLowerCase() === 'buy') {
            fontColor = R.colors.buyerGreen
        } else {
            fontColor = R.colors.sellerPink
        }

        // display price and amount length 8 after point
        let amount = parseFloatVal(item.Amount) == 0 ? R.strings.Amount : parseFloatVal(item.Amount).toFixed(8);
        let price = parseFloatVal(item.Price) == 0 ? R.strings.market : parseFloatVal(item.Price).toFixed(8);

        return (
            <AnimatableItem>
                <View style={{
                    flexDirection: 'column',
                    flex: 1,
                    marginRight: R.dimens.widget_left_right_margin,
                    marginBottom: (props.index == props.size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginTop: (props.index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginLeft: R.dimens.widget_left_right_margin,
                }}>
                    <CardView style={{
                        borderRadius: 0,
                        elevation: R.dimens.listCardElevation,
                        width: '100%',
                        borderTopRightRadius: R.dimens.margin,
                        flexDirection: 'column',
                        borderBottomLeftRadius: R.dimens.margin,
                    }}>
                        {/* Sell/Buy, Pair and date & time Header */}
                        <View style={{ flexDirection: 'row', }}>
                            <TextViewMR style={{ flex: 1, fontSize: R.dimens.smallText, color: R.colors.textPrimary }}>
                                {item.PairName.replace('_', '/')}
                                {<TextViewHML style={{ fontWeight: 'normal', color: fontColor, fontSize: R.dimens.smallText, }}> {item.Type}</TextViewHML>}
                                {<TextViewHML style={{ fontWeight: 'normal', color: fontColor, fontSize: R.dimens.smallText, }}> - {item.OrderType}</TextViewHML>}
                            </TextViewMR>
                            <TextViewHML style={{ color: R.colors.textSecondary, textAlign: 'right', fontSize: R.dimens.smallestText, alignSelf: 'flex-end' }}>
                                {convertDateTime(item.TrnDate, 'YYYY-MM-DD HH:mm:ss', false)}
                            </TextViewHML>
                        </View>

                        {/* per, amount, price item and cancel button design */}
                        <View style={{ flexDirection: 'row', marginTop: R.dimens.widgetMargin, }}>

                            <View style={{ flexDirection: 'row', width: '70%' }}>
                                <View style={{ flexDirection: 'row', }}>
                                    <View style={{ marginRight: R.dimens.widget_left_right_margin, }}>
                                        <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.volumeText }}>{R.strings.Amount}</TextViewHML>
                                        <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.volumeText, }}>{R.strings.price}</TextViewHML>
                                    </View>
                                    <View>
                                        <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.volumeText, }}>{amount} {item.Order_Currency}</TextViewHML>
                                        <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.volumeText, }}>{item.OrderType.toLowerCase().includes('market') ? R.strings.market : (price + ' ' + item.Delivery_Currency)}</TextViewHML>
                                    </View>
                                </View>
                            </View>

                            {/* Cancel button Design */}
                            <View style={{ width: '30%', justifyContent: 'flex-end', }}>
                                <TouchableWithoutFeedback
                                    onPress={props.onPress}>
                                    <View style={{ alignSelf: 'flex-end' }}>
                                        <TextViewMR style={this.styles().cancelbuttonText}>
                                            {R.strings.cancel}
                                        </TextViewMR>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        </View>
                    </CardView>
                </View>
            </AnimatableItem>
        )
    }

    // styles for this class
    styles() {
        return {
            cancelbuttonText: {
                borderWidth: R.dimens.icon_borderwidth,
                borderColor: R.colors.yellow,
                color: R.colors.yellow,
                fontSize: R.dimens.volumeText,
                textAlign: 'center',
                paddingRight: R.dimens.widget_left_right_margin,
                paddingLeft: R.dimens.widget_left_right_margin,
                paddingBottom: R.dimens.CardViewElivation,
                paddingTop: R.dimens.CardViewElivation,
            }
        }
    }
}

const mapStateToProps = (state) => {
    // Updated Data for Preference, OpenOrder and PairList
    return {
        result: { ...state.openOrderReducer, ...state.pairListReducer },
        preference: state.preference,
    }
}

const mapDispatchToProps = (dispatch) => ({

    // Perform Currency Pair Action
    getCurrencyPairs: () => dispatch(getPairList()),

    // Perform OpenOrder Action
    getOpenOrder: (params) => dispatch(fetchOpenOrders(params)),

    // Perform cancel OpenOrder Action
    cancelOpenOrder: (payload) => dispatch(cancelOpenOrder(payload)),

    // clear OpenOrder data from reducer
    clearOpenOrder: () => dispatch(clearOpenOrder()),

    // clear PairList data from reducer
    clearPairList: () => dispatch(clearPairList()),

    // clear cancel OpenOrder data from reducer
    clearCancelOpenOrder: () => dispatch(clearCancelOpenOrder()),

})

export default connect(mapStateToProps, mapDispatchToProps)(OpenOrder);