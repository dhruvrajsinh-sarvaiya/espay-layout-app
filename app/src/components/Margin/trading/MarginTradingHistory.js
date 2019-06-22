// MarginTradingHistory
import React, { Component } from 'react';
import { View, FlatList, Easing, RefreshControl, } from 'react-native';
import { connect } from 'react-redux'
import { isCurrentScreen, addRouteToBackPress } from '../../Navigation';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../../native_theme/components/CustomToolbar'
import ListLoader from '../../../native_theme/components/ListLoader';
import { contentContainerStyle, ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import { changeTheme, getCurrentDate, parseArray, addListener, parseFloatVal, convertDateTime } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew } from '../../../validations/CommonValidation'
import arraySort from 'array-sort';
import Drawer from 'react-native-drawer-menu';
import { Method } from '../../../controllers/Constants';
import R from '../../../native_theme/R';
import CommonToast from '../../../native_theme/components/CommonToast';
import FilterWidget from '../../Widget/FilterWidget';
import { DateValidation } from '../../../validations/DateValidation';
import { onOrderHistory, clearOrderHistory } from '../../../actions/Trade/OrderHistoryActions'
import CardView from '../../../native_theme/components/CardView';
import StatusChip from '../../Widget/StatusChip';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import { onFetchMarkets, clearMarketList } from '../../../actions/Trade/TradeActions';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import SafeView from '../../../native_theme/components/SafeView';

export const OrderHistoryBit = {
    BuySellTradeSuccess: 1
}

class MarginTradingHistory extends Component {

    constructor(props) {
        super(props);

        //Add Current Screen to Manual Handling BackPress Events
        addRouteToBackPress(props);

        // Bind Method
        this.onBackPress = this.onBackPress.bind(this);
        this.props.navigation.setParams({ onBackPress: this.onBackPress });

        // create reference
        this.drawer = React.createRef();
        this.toast = React.createRef();

        //to fetch pairname from previous screen
        this.PairName = props.navigation.state.params && props.navigation.state.params.PairName

        // Bind All Method
        this.onRefresh = this.onRefresh.bind(this);
        this.onResetPress = this.onResetPress.bind(this);
        this.onCompletePress = this.onCompletePress.bind(this);

        //request to pass in API call
        this.request = {}

        //Define All initial State
        this.state = {
            from: props.navigation.state.params.from != undefined ? props.navigation.state.params.from : 0,
            response: [],
            refreshing: false,

            //Filter
            stFromDate: getCurrentDate(),
            stToDate: getCurrentDate(),

            typeFilter: [{ value: R.strings.Please_Select, code: '' }, { value: R.strings.buy, code: 'buy' }, { value: R.strings.sell, code: 'sell' }],
            selectedType: R.strings.Please_Select,

            CurrencyPair: [{ value: R.strings.Please_Select }],
            selCurrencyPair: R.strings.Please_Select,

            statuses: [{ value: R.strings.Please_Select, code: 0 }, { value: R.strings.Success, code: 1 }, /* { value: R.strings.open, code: 2 }, */ { value: R.strings.cancel, code: 9 }],
            selectedStatus: R.strings.Please_Select,

            markets: [{ value: R.strings.Please_Select, code: '' }, { value: R.strings.limit, code: 'limit' }, { value: R.strings.market, code: 'market' }, { value: R.strings.spot, code: 'spot' }],
            selectedMarket: R.strings.Please_Select,

            searchInput: '',
            isFilter: false,
            isFirstTime: true,
            isDrawerOpen: false, // First Time Drawer is Closed
        };
    }

    onBackPress() {
        //If order history is opened from Buy Sell Trade Success then redirect to Home on Back Press.
        if (this.state.isDrawerOpen) {
            this.drawer.closeDrawer();
            this.setState({ isDrawerOpen: false })
        }
        else if (this.state.from == OrderHistoryBit.BuySellTradeSuccess) {
            this.props.navigation.navigate('MainScreen');
        } else {
            //redirect to its previous screen
            this.props.navigation.goBack();
        }
    }

    async componentDidMount() {

        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {

            // Bind Request for OrderHistory
            this.request = {
                fromDate: getCurrentDate(),
                toDate: getCurrentDate(),
                status: 0,
                IsMargin: 1 //get Order Histroy Based on margin
            }

            //Call OrderHistory api for flatlist
            this.props.onOrderHistory(this.request);

            //call api to get pair list
            this.props.getPairList({ IsMargin: 1 });

        }

        // Handle Signal-R response for Trade History
        this.listenerRecieveTradeHistory = addListener(Method.RecieveTradeHistory, (receivedMessage) => {

            // check for current screen
            if (isCurrentScreen(this.props)) {
                try {
                    let response = JSON.parse(receivedMessage);

                    //if connection has data
                    if (response) {
                        let list = this.state.response;

                        //if list is empty then add record
                        if (list.length == 0) {
                            list.push(response.Data);
                        }

                        //If existing list is not empty then check for other conditions
                        if (list.length > 0) {

                            //find index of Order History TrnNo
                            let indexOfPrice = list.findIndex(el => el.TrnNo == response.Data.TrnNo);

                            //if same price record found then check for its existing amount
                            if (indexOfPrice > -1) {

                                //Updating records
                                list[indexOfPrice] = response.Data

                            } else {
                                list.push(response.Data);
                            }
                        }

                        //Sort array based on Price in decending
                        let sortedArray = arraySort(list, 'DateTime', { reverse: true });

                        this.setState({ response: sortedArray });

                    }
                } catch (_error) {
                    //parsing error
                }
            }
        })
    };

    componentWillUnmount = () => {

        // call action to clear Reducer data
        this.props.clearOrderHistory();
        this.props.clearMarketList();

        // Remove Listener
        if (this.listenerRecieveTradeHistory) {
            this.listenerRecieveTradeHistory.remove();
        }
    }

    shouldComponentUpdate = (nextProps, _nextState) => {
        // stop twice api call 
        return isCurrentScreen(nextProps);
    };

    // Reset all value like type, date and hide/show
    async onResetPress() {

        //Bind Request for OrderHistory
        this.request = {
            fromDate: getCurrentDate(),
            toDate: getCurrentDate(),
            status: 0,
            IsMargin: 1 //get Order Histroy Based on margin
        }

        // set Initial value to state
        this.setState({
            isFilter: false,
            stFromDate: getCurrentDate(),
            stToDate: getCurrentDate(),
            selCurrencyPair: R.strings.Please_Select,
            selectedType: R.strings.Please_Select,
            selectedStatus: R.strings.Please_Select,
            selectedMarket: R.strings.Please_Select,
        })

        // Close Drawer
        this.drawer.closeDrawer();

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Call OrderHistory api for flatlist
            this.props.onOrderHistory(this.request);
        } else {
            this.setState({ refreshing: false })
        }
    }

    // Api Call when press on complete button
    async onCompletePress() {

        //Check All From Date and To Date Validation
        if (DateValidation(this.state.stFromDate, this.state.stToDate)) {
            this.toast.Show(DateValidation(this.state.stFromDate, this.state.stToDate));
            return;
        }

        //Bind Request for OrderHistory
        this.request = {
            ...this.request,
            fromDate: this.state.stFromDate,
            toDate: this.state.stToDate,
            pairName: this.state.selCurrencyPair !== R.strings.Please_Select ? this.state.selCurrencyPair : '',
            status: this.state.statuses[this.state.statuses.findIndex(el => this.state.selectedStatus === el.value)].code,
            marketType: this.state.markets[this.state.markets.findIndex(el => this.state.selectedMarket === el.value)].code,
            trade: this.state.typeFilter[this.state.typeFilter.findIndex(el => this.state.selectedType === el.value)].code,
            IsMargin: 1 //get Order Histroy Based on margin
        }

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Call OrderHistory api
            this.props.onOrderHistory(this.request)
        } else {
            this.setState({ refreshing: false })
        }

        // Close Drawer
        this.drawer.closeDrawer();
    }

    static oldProps = {};

    static getDerivedStateFromProps(props, state) {

        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return Object.assign({}, state, {
                isFirstTime: false,
            });
        }

        // To Skip Render if old and new props are equal
        if (MarginTradingHistory.oldProps !== props) {
            MarginTradingHistory.oldProps = props;
        } else {
            return null;
        }

        //check for current screen
        if (isCurrentScreen(props)) {

            //Get All Updated field of Particular actions 
            const { orderhistorydata, marketListFilter } = props.result

            // To check orderhistorydata is null or not
            if (orderhistorydata) {
                try {

                    //if tradeHistory is null or old and new data of tradeHistory  and response is different then validate it
                    if (state.tradeHistory == null || (state.tradeHistory != null && orderhistorydata !== state.tradeHistory)) {

                        if (validateResponseNew({ response: orderhistorydata, isList: true })) {

                            //check Order History Response is an Array Or not
                            //If Response is Array then Direct set in state otherwise conver response to Array form then set state.
                            let res = parseArray(orderhistorydata.response);

                            return Object.assign({}, state, {
                                tradeHistory: orderhistorydata, response: res, refreshing: false
                            })
                        } else {
                            return Object.assign({}, state, {
                                tradeHistory: orderhistorydata,
                                refreshing: false,
                                response: []
                            })
                        }
                    }
                } catch (error) {
                    return Object.assign({}, state, {
                        refreshing: false
                    })
                }
            }

            //if pairList response is not null then handle resposne
            if (marketListFilter) {

                try {
                    //if local pairList state is null or its not null and also different then new response then and only then validate response.
                    if (state.marketListFilter == null || (state.marketListFilter != null && marketListFilter !== state.marketListFilter)) {

                        //if tradingLedgers response is success then store array list else store empty list
                        if (validateResponseNew({ response: marketListFilter, isList: true })) {
                            let res = parseArray(marketListFilter.response);

                            let pairList = [{ value: R.strings.Please_Select },];

                            //to check if records are exist
                            if (res && res.length > 0) {

                                //Base Currency Loop
                                res.map((baseCurency) => {

                                    baseCurency.PairList.map(item => {
                                        if (pairList.every(el => el !== item.PairName)) {
                                            pairList.push({ value: item.PairName });
                                        }
                                    })
                                })
                            }
                            return Object.assign({}, state, {
                                CurrencyPair: pairList,
                                marketListFilter
                            })
                        } else {
                            return Object.assign({}, state, {
                                marketListFilter,
                                CurrencyPair: [{ value: R.strings.Please_Select }]
                            })
                        }
                    }
                } catch (error) {
                    return Object.assign({}, state, {
                        CurrencyPair: [{ value: R.strings.Please_Select }]
                    })
                }
            }
        }
        return null;
    }

    //For Swipe to referesh Functionality
    async onRefresh() {
        this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Call Get Order History API
            this.props.onOrderHistory(this.request);
        } else {
            this.setState({ refreshing: false });
        }
    }

    // Drawer Navigation
    navigationDrawer() {
        return (
            <SafeView style={this.styles().container}>

                {/* for display Toast */}
                <CommonToast ref={component => this.toast = component} styles={{ width: R.dimens.FilterDrawarWidth }} />

                {/* filterWidget for display fromdate, todate, market, currencypair, status and type data */}
                <FilterWidget
                    FromDatePickerCall={(date) => this.setState({ stFromDate: date, isFilter: false })}
                    FromDate={this.state.stFromDate}
                    ToDatePickerCall={(date) => this.setState({ stToDate: date, isFilter: false })}
                    ToDate={this.state.stToDate}
                    onResetPress={this.onResetPress}
                    onCompletePress={this.onCompletePress}
                    comboPickerStyle={{ marginTop: 0 }}
                    pickers={[{
                        title: R.strings.market,
                        array: this.state.markets,
                        selectedValue: this.state.selectedMarket,
                        onPickerSelect: (item) => {
                            if (item !== this.state.selectedMarket) {
                                this.setState({ selectedMarket: item })
                            }
                        }
                    },
                    {
                        title: R.strings.currencyPair,
                        array: this.state.CurrencyPair,
                        selectedValue: this.state.selCurrencyPair,
                        onPickerSelect: (item) => {
                            if (item !== this.state.selCurrencyPair) {
                                this.setState({ selCurrencyPair: item })
                            }
                        }
                    },
                    {
                        title: R.strings.Status,
                        array: this.state.statuses,
                        selectedValue: this.state.selectedStatus,
                        onPickerSelect: (item) => {
                            if (item !== this.state.selectedStatus) {
                                this.setState({ selectedStatus: item })
                            }
                        }
                    },
                    {
                        title: R.strings.Type,
                        array: this.state.typeFilter,
                        selectedValue: this.state.selectedType,
                        onPickerSelect: (item) => {
                            if (item !== this.state.selectedType) {
                                this.setState({ selectedType: item })
                            }
                        }
                    }]}
                />
            </SafeView>
        );
    }

    render() {

        //loading bit for handling progress dialog
        var { isFetchingOrderHistory } = this.props.result

        //for final items from search input (validate on PairName, Type, Amount, TrnNo, OrderType, StatusText)
        //default searchInput is empty so it will display all records.
        let finalItems = this.state.response.filter((item) => item.PairName.replace('_', '/').toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
            item.Type.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
            item.Amount.toString().includes(this.state.searchInput) ||
            item.TrnNo.toString().includes(this.state.searchInput) ||
            item.OrderType.toLowerCase().includes(this.state.searchInput) ||
            item.StatusText.toLowerCase().includes(this.state.searchInput.toLowerCase()))

        return (
            /* DrawerLayout for Order History Filteration */
            <Drawer
                ref={cmp => this.drawer = cmp}
                drawerWidth={R.dimens.FilterDrawarWidth}
                drawerPosition={Drawer.positions.Right}
                drawerContent={this.navigationDrawer()}
                onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
                onDrawerClose={() => this.setState({ isDrawerOpen: false })}
                type={Drawer.types.Overlay}
                easingFunc={Easing.ease}>
                <SafeView style={this.styles().container}>

                    {/* To set status bar as per our theme */}
                    <CommonStatusBar />

                    {/* To set toolbar as per our theme */}
                    <CustomToolbar
                        title={R.strings.marginTradingHistory}
                        rightIcon={R.images.FILTER}
                        isBack={true}
                        onBackPress={this.onBackPress}
                        searchable={true}
                        onSearchText={(input) => this.setState({ searchInput: input })}
                        nav={this.props.navigation}
                        onRightMenuPress={() => this.drawer.openDrawer()}
                    />

                    {/* First contain Flatlist View */}
                    <View style={{ flex: 1 }}>

                        {/* To Check Response fetch or not if isFetchingOrderHistory = true then display progress bar else display List*/}
                        {
                            (isFetchingOrderHistory && !this.state.refreshing) ?
                                <ListLoader />
                                :
                                <FlatList
                                    data={finalItems}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={({ item, index }) =>
                                        <OrderHistoryItem
                                            key={item.TrnNo.toString()}
                                            item={item}
                                            index={index}
                                            size={this.state.response.length}
                                        />}
                                    keyExtractor={(item) => item.TrnNo.toString()}
                                    /* for refreshing data of flatlist */
                                    refreshControl={
                                        <RefreshControl
                                            colors={[R.colors.accent]}
                                            progressBackgroundColor={R.colors.background}
                                            refreshing={this.state.refreshing}
                                            onRefresh={this.onRefresh}
                                        />}
                                    contentContainerStyle={contentContainerStyle(finalItems)}
                                    ListEmptyComponent={<ListEmptyComponent />}
                                />
                        }
                    </View>
                </SafeView>
            </Drawer>
        );
    }

    styles = () => {
        return {
            container: {
                flex: 1,
                backgroundColor: R.colors.background,
            },
        }
    }
}

// This Class is used for display record in list
class OrderHistoryItem extends Component {

    shouldComponentUpdate = (nextProps) => {

        //Check If Old Props and New Props are Equal then Return False
        if (this.props.item !== nextProps.item ||
            this.props.index !== nextProps.index ||
            this.props.size !== nextProps.size) {
            return true;
        } else {
            return false;
        }
    }

    render() {

        // Get required fields from props
        let { item, onPress, index, size } = this.props
        let color = R.colors.accent;

        //Update StatusChip Condition
        //Handle condition in IsCancel bit if IsCancel = 0 then Success and if IsCancel = 1 then cancel
        if (item.IsCancel == 0) {
            color = R.colors.successGreen;
        } else if (item.IsCancel == 1) {
            color = R.colors.failRed
        }
        //-----------

        return (
            <AnimatableItem>
                <View style={{
                    flex: 1,
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginLeft: R.dimens.widget_left_right_margin,
                    marginRight: R.dimens.widget_left_right_margin
                }}>
                    <CardView style={{
                        elevation: R.dimens.listCardElevation,
                        flex: 1,
                        borderRadius: 0,
                        borderBottomLeftRadius: R.dimens.margin,
                        borderTopRightRadius: R.dimens.margin,
                    }} onPress={onPress}>

                        <View style={{ flex: 1 }}>

                            {/* it will display pairname, ordertype, trnNo and status */}
                            <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row' }}>
                                <View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <TextViewMR style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, }}>
                                            {item.PairName.replace('_', '/')}
                                        </TextViewMR>
                                        <TextViewHML style={{
                                            color: item.Type.toLowerCase().includes('buy') ? R.colors.buyerGreen : R.colors.sellerPink,
                                            fontSize: R.dimens.volumeText, marginLeft: R.dimens.widgetMargin
                                        }}>
                                            {item.Type + ' - ' + item.OrderType}
                                        </TextViewHML>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginLeft: R.dimens.widgetMargin }}>
                                        <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{R.strings.TxnID} : </TextViewHML>
                                        <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}> {item.TrnNo}  </TextViewHML>
                                    </View>
                                </View>
                                <View>
                                    <StatusChip
                                        color={color}
                                        value={item.StatusText ? item.StatusText : '-'}></StatusChip>
                                </View>
                            </View>

                            {/* to show Amount,price and fee */}
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ flex: 1, alignItems: 'center' }}>
                                    <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.volumeText }}>{R.strings.Amount}</TextViewHML>
                                    <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.volumeText }}>{parseFloatVal(item.Amount).toFixed(8)}</TextViewHML>
                                </View>
                                <View style={{ flex: 1, alignItems: 'center' }}>
                                    <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.volumeText }}>{R.strings.Price}</TextViewHML>
                                    <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.volumeText }}>{parseFloatVal(item.Price).toFixed(8)}</TextViewHML>
                                </View>
                                <View style={{ flex: 1, alignItems: 'center' }}>
                                    <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.volumeText, }}>{R.strings.Fee}</TextViewHML>
                                    <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.volumeText }}>{parseFloatVal(item.ChargeRs).toFixed(8)}</TextViewHML>
                                </View>
                            </View>

                            {/* to show total */}
                            <View style={{ flexDirection: 'row', marginTop: R.dimens.widgetMargin, justifyContent: 'space-between' }}>
                                <TextViewHML style={{ color: R.colors.yellow, fontSize: R.dimens.smallText }}>{parseFloatVal(item.Total).toFixed(8) + ' ' + item.PairName.split('_')[1]}</TextViewHML>
                                <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{convertDateTime(item.DateTime, 'YYYY-MM-DD HH:mm:ss A', false)}</TextViewHML>
                            </View>
                        </View>
                    </CardView>
                </View>
            </AnimatableItem>
        )
    }
}

const mapStateToProps = (state) => {
    // Updated Data of OrderHistory and Trade Data
    return {
        result: { ...state.orderHistoryReducer, ...state.tradeData },
    }
}

const mapDispatchToProps = (dispatch) => ({
    // Perform Order History Action
    onOrderHistory: (payload) => dispatch(onOrderHistory(payload)),

    // Perform Pair List Action
    getPairList: (payload) => dispatch(onFetchMarkets(payload)),

    // perform Action to clear marketlist data from reducer
    clearMarketList: () => dispatch(clearMarketList()),

    // perform Action to clear OrderHistory data from reducer
    clearOrderHistory: () => dispatch(clearOrderHistory()),
})

export default connect(mapStateToProps, mapDispatchToProps)(MarginTradingHistory);