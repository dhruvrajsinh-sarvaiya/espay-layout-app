import React, { Component } from 'react';
import {
    View,
    TouchableWithoutFeedback,
    Easing,
    FlatList,
    RefreshControl,
} from 'react-native';
import { connect } from 'react-redux';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import { isCurrentScreen, addRouteToBackPress } from '../Navigation';
import { changeTheme, getCurrentDate, parseArray, addListener, parseFloatVal, convertDateTime } from '../../controllers/CommonUtils';
import R from '../../native_theme/R';
import { Method } from '../../controllers/Constants';
import CustomToolbar from '../../native_theme/components/CustomToolbar';
import RecentOrder from './RecentOrder';
import { ListEmptyComponent, contentContainerStyle } from '../../native_theme/components/FlatListWidgets';
import CommonToast from '../../native_theme/components/CommonToast';
import Drawer from 'react-native-drawer-menu';
import ListLoader from '../../native_theme/components/ListLoader';
import FilterWidget from '../Widget/FilterWidget';
import { isInternet, validateResponseNew } from '../../validations/CommonValidation';
import arraySort from 'array-sort';
import CardView from '../../native_theme/components/CardView';
import { DateValidation } from '../../validations/DateValidation';
import { onOrderHistory, clearOrderHistory } from '../../actions/Trade/OrderHistoryActions';
import TextViewMR from '../../native_theme/components/TextViewMR';
import TextViewHML from '../../native_theme/components/TextViewHML';
import AnimatableItem from '../../native_theme/components/AnimatableItem';
import { clearMarketList, onFetchMarkets } from '../../actions/Trade/TradeActions';
import SafeView from '../../native_theme/components/SafeView';
import StatusChip from '../Widget/StatusChip';
import { clearRecentOrder } from '../../actions/Trade/RecentOrderAction';

class OrderManagementScreen extends Component {

    constructor(props) {
        super(props);

        //request to pass in API call
        this.request = {}

        //Add Current Screen to Manual Handling BackPress Events
        addRouteToBackPress(props);

        //Create Reference
        this.toast = React.createRef();
        this.drawer = React.createRef();

        // Bind all methods
        this.onResetPress = this.onResetPress.bind(this);
        this.onBackPress = this.onBackPress.bind(this);
        this.onCompletePress = this.onCompletePress.bind(this);
        this.onRefresh = this.onRefresh.bind(this);

        // set params for calling previous screen method
        this.props.navigation.setParams({ onBackPress: this.onBackPress });

        let from;
        if (props.navigation.state.params !== undefined && props.navigation.state.params.from !== undefined) {
            from = props.navigation.state.params.from;
        } else if (props.from !== undefined) {
            from = props.from;
        } else {
            from = 0
        }

        //Define All initial State
        this.state = {
            search: '',
            isShowHistory: true,

            //To hide Search View while swithcing tabs
            hideSearch: false,

            from,
            refreshing: false,
            response: [],

            //Filter
            stToDate: getCurrentDate(),
            stFromDate: getCurrentDate(),

            CurrencyPair: [{ value: R.strings.Please_Select }],
            selCurrencyPair: R.strings.Please_Select,

            typeFilter: [{ value: R.strings.Please_Select, code: '' }, { value: R.strings.buy, code: 'buy' }, { value: R.strings.sell, code: 'sell' }],
            tradeTypeId: 0,
            selectedType: R.strings.Please_Select,

            statuses: [{ value: R.strings.Please_Select, code: 0 }, { value: R.strings.Success, code: 1 }, /* { value: R.strings.open, code: 2 }, */ { value: R.strings.cancel, code: 9 }],
            statusId: 0,
            selectedStatus: R.strings.Please_Select,

            markets: [{ value: R.strings.Please_Select, code: '' }, { value: R.strings.limit, code: 'limit' }, { value: R.strings.market, code: 'market' }, { value: R.strings.spot, code: 'spot' }],
            marketTypeId: 0,
            selectedMarket: R.strings.Please_Select,

            isDrawerOpen: false, // First Time Drawer is Closed
            isFirstTime: true,
            isFilter: false,
        };
    }

    async componentDidMount() {

        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {

            // Bind Request for OrderHistory
            this.request = {
                status: 0,
                fromDate: getCurrentDate(),
                toDate: getCurrentDate(),
            }

            //Call OrderHistory api for flatlist
            this.props.onOrderHistory(this.request);

            //to get pair list
            this.props.getPairList();
        }

        // Handle Signal-R response for Trade History
        this.listenerRecieveTradeHistory = addListener(Method.RecieveTradeHistory, (receiveTradeHistory) => {

            // check for current screen
            if (isCurrentScreen(this.props)) {
                try {
                    let historyData = JSON.parse(receiveTradeHistory);

                    //if connection has data
                    if (historyData) {
                        let list = this.state.response;

                        //if list is empty then add record
                        if (list.length == 0) {
                            list.push(historyData.Data);
                        }

                        //If existing list is not empty then check for other conditions
                        if (list.length > 0) {

                            //find index of Order History TrnNo
                            let indexOfPrice = list.findIndex(el => el.TrnNo == historyData.Data.TrnNo);

                            //if same price record found then check for its existing amount
                            if (indexOfPrice > -1) {

                                //Updating records
                                list[indexOfPrice] = historyData.Data

                            } else {
                                list.push(historyData.Data);
                            }
                        }

                        //Sort array based on Price in decending
                        let sortedArray = arraySort(list, 'DateTime', { reverse: true });

                        if (this.state.isShowHistory) {
                            this.setState({ response: sortedArray, });
                        }
                    }
                } catch (_error) {
                    //parsing error
                }
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

    shouldComponentUpdate = (nextProps, nextState) => {
        // stop twice api call 
        return isCurrentScreen(nextProps);
    };

    componentWillUnmount = () => {

        // remove listener
        if (this.listenerRecieveTradeHistory) {
            this.listenerRecieveTradeHistory.remove();
        }

        // for clear reducer
        this.props.clearMarketList();
        this.props.clearRecentOrder();
        this.props.clearOrderHistory();
    }

    // Reset all value like type, date and hide/show
    async onResetPress() {

        //Bind Request For OrderHistory
        this.request = {
            toDate: getCurrentDate(),
            fromDate: getCurrentDate(),
            status: 0,
        }

        this.setState({
            isFilter: false,
            selCurrencyPair: '',
            stToDate: getCurrentDate(),
            stFromDate: getCurrentDate(),
            selectedMarket: R.strings.Please_Select,
            selectedType: R.strings.Please_Select,
            selectedStatus: R.strings.Please_Select,
            marketTypeId: 0,
            statusId: 0,
            tradeTypeId: 0
        })

        // Close Drawer
        this.drawer.closeDrawer()

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Call OrderHistory api for flatlist
            this.props.onOrderHistory(this.request)

        } else {
            this.setState({ refreshing: false })
        }
    }

    // Api Call when press on complete button
    async onCompletePress() {

        //Check All From Date and To Date Validation
        if (DateValidation(this.state.stFromDate, this.state.stToDate)) {
            this.toast.Show(DateValidation(this.state.stFromDate, this.state.stToDate))
            return
        }

        //Bind Request For OrderHistory
        this.request = {
            ...this.request, status: this.state.statusId,
            fromDate: this.state.stFromDate,
            toDate: this.state.stToDate,
            pairName: this.state.selCurrencyPair !== R.strings.Please_Select ? this.state.selCurrencyPair : '',
            trade: this.state.tradeTypeId,
            marketType: this.state.marketTypeId,
        }

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Call OrderHistory api for flatlist
            this.props.onOrderHistory(this.request)
        } else {
            this.setState({ refreshing: false, })
        }

        // Close Drawer
        this.drawer.closeDrawer();
    }

    static oldProps = {};

    static getDerivedStateFromProps(props, state) {

        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return Object.assign({}, state, {
                isFirstTime: false
            });
        }

        // To Skip Render if old and new props are equal
        if (OrderManagementScreen.oldProps !== props) {
            OrderManagementScreen.oldProps = props;
        } else {
            return null;
        }

        // check for current screen
        if (isCurrentScreen(props)) {

            //Get All Updated field of Particular actions 
            const { orderhistorydata, marketListFilter, } = props.result

            // To check orderhistorydata is null or not
            if (orderhistorydata) {
                try {

                    //if tradeHistory is null or old and new data of tradeHistory  and response is different then validate it
                    if (state.tradeHistory == null || (state.tradeHistory != null && orderhistorydata !== state.tradeHistory)) {

                        if (validateResponseNew({ response: orderhistorydata, isList: true })) {

                            //check Order History Response is an Array Or not
                            //If Response is Array then Direct set in state otherwise conver response to Array form then set state.
                            let res = parseArray(orderhistorydata.response);
                            let newResponse = res

                            res.map((item, index) => { newResponse[index].isCancelText = item.IsCancel == 0 ? 'Success' : 'Cancel' })

                            return Object.assign({}, state, {
                                tradeHistory: orderhistorydata, response: newResponse, refreshing: false,
                            })
                        } else {
                            return Object.assign({}, state, {
                                tradeHistory: orderhistorydata, response: [], refreshing: false,
                            })
                        }
                    }

                } catch (error) {
                    return Object.assign({}, state, { refreshing: false })
                }
            }

            //if pairList response is not null then handle resposne
            if (marketListFilter) {

                try {
                    //if local pairList state is null or its not null and also different then new response then and only then validate response.
                    if (state.marketListFilter == null || (state.marketListFilter != null && marketListFilter !== state.marketListFilter)) {

                        //if tradingLedgers response is success then store array list else store empty list
                        if (validateResponseNew({ response: marketListFilter, isList: true })) {
                            let marketListRes = parseArray(marketListFilter.response);

                            let pairList = [{ value: R.strings.Please_Select },];

                            //to check if records are exist
                            if (marketListRes && marketListRes.length > 0) {

                                //Base Currency Loop
                                marketListRes.map((baseCurency) => {
                                    baseCurency.PairList.map(item => {
                                        if (pairList.every(el => el !== item.PairName)) { pairList.push({ value: item.PairName }); }
                                    })
                                })
                            }
                            return Object.assign({}, state, {
                                CurrencyPair: pairList, marketListFilter,
                            })
                        } else {
                            return Object.assign({}, state, {
                                marketListFilter, CurrencyPair: [{ value: R.strings.Please_Select }],
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
        this.setState({
            refreshing: true,
        });

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Call Get Order History API
            this.props.onOrderHistory(this.request);
        } else {
            this.setState({
                refreshing: false,
            });
        }
    }

    // Drawer Navigation
    navigationDrawer() {

        return (
            <SafeView
                style={this.styles().container}>

                {/* for display Toast */}
                <CommonToast ref={component => this.toast = component} styles={{ width: R.dimens.FilterDrawarWidth, }} />

                {/* filterwidget for fromdate,todate,type,currencypair, statusand market data */}
                <FilterWidget
                    FromDatePickerCall={(date) => { this.setState({ stFromDate: date, isFilter: false, }) }}
                    FromDate={this.state.stFromDate}
                    ToDatePickerCall={(date) => this.setState({ stToDate: date, isFilter: false, })}
                    ToDate={this.state.stToDate}
                    onCompletePress={this.onCompletePress}
                    onResetPress={this.onResetPress}
                    comboPickerStyle={{ marginTop: 0, marginBottom: R.dimens.activity_margin }}
                    pickers={[{
                        title: R.strings.Type,
                        selectedValue: this.state.selectedType,
                        array: this.state.typeFilter,
                        onPickerSelect: (item, object) => {
                            if (item !== this.state.selectedType) {
                                this.setState({ selectedType: item, tradeTypeId: object.code, })
                            }
                        }
                    },
                    {
                        title: R.strings.currencyPair,
                        selectedValue: this.state.selCurrencyPair,
                        array: this.state.CurrencyPair,
                        onPickerSelect: (item) => {
                            if (item !== this.state.selCurrencyPair) {
                                this.setState({ selCurrencyPair: item, })
                            }
                        }
                    },
                    {
                        title: R.strings.Status,
                        selectedValue: this.state.selectedStatus,
                        array: this.state.statuses,
                        onPickerSelect: (item, object) => {
                            if (item !== this.state.selectedStatus) {
                                this.setState({ selectedStatus: item, statusId: object.code, })
                            }
                        }
                    },
                    {
                        title: R.strings.market,
                        selectedValue: this.state.selectedMarket,
                        array: this.state.markets,
                        onPickerSelect: (item, object) => {
                            if (item !== this.state.selectedMarket) {
                                this.setState({ selectedMarket: item, marketTypeId: object.code, })
                            }
                        }
                    }]}
                />
            </SafeView>
        );
    }

    // to show order history and recent order as per selection
    onTabChange(isShowHistory) {

        //hideSearch to true so that search view can hide
        this.setState({ isShowHistory: isShowHistory, search: '', hideSearch: false, })
    }

    render() {

        //loading bit for handling progress dialog
        var { isFetchingOrderHistory } = this.props.result

        let finalItems = [];
        if (this.state.isShowHistory) {

            //for final items from search input (validate on PairName, Type, Amount, TrnNo, OrderType, isCancelText)
            //default searchInput is empty so it will display all records.
            finalItems = this.state.response.filter((item) =>
                item.Type.toLowerCase().includes(this.state.search.toLowerCase()) ||
                item.PairName.replace('_', '/').toLowerCase().includes(this.state.search.toLowerCase()) ||
                item.TrnNo.toString().includes(this.state.search) ||
                item.OrderType.toLowerCase().includes(this.state.search) ||
                item.Amount.toString().includes(this.state.search) ||
                item.isCancelText.toLowerCase().includes(this.state.search.toLowerCase())
            )
        }

        return (
            /* DrawerLayout for Order History Filteration */
            <Drawer
                ref={cmp => this.drawer = cmp}
                drawerContent={this.navigationDrawer()}
                drawerWidth={R.dimens.FilterDrawarWidth}
                disabled={!this.state.isShowHistory}
                drawerPosition={Drawer.positions.Right}
                onDrawerClose={() => this.setState({ isDrawerOpen: false })}
                onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
                easingFunc={Easing.ease}
                type={Drawer.types.Overlay}
            >

                <SafeView style={this.styles().container}>

                    {/* To set status bar as per our theme */}
                    <CommonStatusBar />

                    {/* To set toolbar as per our theme */}
                    <CustomToolbar
                        onBackPress={this.onBackPress}
                        isBack={true}
                        searchable={true}
                        original={true}
                        onRightMenuPress={() => this.drawer.openDrawer()}

                        //To manually visible SearchView
                        onVisibleSearch={(isVisible) => this.setState({ hideSearch: isVisible })}
                        visibleSearch={this.state.hideSearch}

                        //If search input change than show searchView with hideSearch to false
                        onSearchText={(input) => this.setState({ search: input, hideSearch: true })}

                        //On Search Cancel Button change hideSearch to true
                        onSearchCancel={() => this.setState({ hideSearch: false })}
                        titleStyle={{ justifyContent: 'flex-start', width: '80%' }}
                        leftStyle={{ width: '10%' }}
                        rightIcon={this.state.isShowHistory && R.images.FILTER}
                        rightStyle={{ width: '10%' }}
                        nav={this.props.navigation} />

                    <View style={{ flexDirection: 'row', marginBottom: R.dimens.widget_top_bottom_margin, }}>
                        <TouchableWithoutFeedback
                            onPress={() => this.onTabChange(true)}>
                            <View style={{ marginRight: R.dimens.widgetMargin, }}>
                                <TextViewMR
                                    style={{
                                        color: this.state.isShowHistory ? R.colors.textPrimary : R.colors.textSecondary,
                                        paddingLeft: R.dimens.margin_left_right,
                                        fontSize: R.dimens.mediumText,
                                    }}
                                    numberOfLines={1}
                                    ellipsizeMode={'tail'}
                                >{R.strings.orderhistory}</TextViewMR>
                            </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                            onPress={() => this.onTabChange(false)}>
                            <View style={{ flex: 1, marginLeft: R.dimens.widgetMargin, }}>
                                <TextViewMR
                                    ellipsizeMode={'tail'}
                                    numberOfLines={1}
                                    style={{
                                        fontSize: R.dimens.mediumText,
                                        color: !this.state.isShowHistory ? R.colors.textPrimary : R.colors.textSecondary,
                                        paddingRight: R.dimens.margin_left_right,
                                    }}>{R.strings.RecentOrder}</TextViewMR>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>

                    {this.state.isShowHistory ?
                        <View style={{ flex: 1, }}>

                            {/* Flatlist Data which is get from api */}
                            {
                                (isFetchingOrderHistory && !this.state.refreshing) ?
                                    <ListLoader />
                                    :
                                    <FlatList
                                        showsVerticalScrollIndicator={false}
                                        data={finalItems}
                                        renderItem={({ item, index }) =>
                                            <OrderHistoryItems
                                                index={index}
                                                key={item.TrnNo.toString()}
                                                item={item}
                                                size={this.state.response.length}
                                            />}
                                        keyExtractor={(item) => item.TrnNo.toString()}
                                        /* for refreshing data of flatlist */
                                        refreshControl={
                                            <RefreshControl
                                                progressBackgroundColor={R.colors.background}
                                                colors={[R.colors.accent]}
                                                onRefresh={this.onRefresh}
                                                refreshing={this.state.refreshing}
                                            />}
                                        ListEmptyComponent={<ListEmptyComponent />}
                                        contentContainerStyle={contentContainerStyle(finalItems)}
                                    />
                            }
                        </View>
                        :
                        <RecentOrder search={this.state.search} navigation={this.props.navigation} />}
                </SafeView>
            </Drawer>
        );
    }

    // styles for this class
    styles = () => {
        return {
            container: {
                flex: 1, backgroundColor: R.colors.background,
            },
        }
    }
}

class OrderHistoryItems extends Component {

    shouldComponentUpdate = (nextProps) => {

        //Check If Old Props and New Props are Equal then Return False
        if (this.props.index !== nextProps.index ||
            this.props.item !== nextProps.item ||
            this.props.size !== nextProps.size
        ) {
            return true;
        }
        return false;
    }

    render() {

        // Get required fields from props
        let { item, size, index } = this.props
        let color = R.colors.textSecondary;

        //Update StatusChip Condition
        //Handle condition in IsCancel bit if IsCancel = 0 then Success and if IsCancel = 1 then cancel
        if (item.IsCancel == 0) { color = R.colors.successGreen }
        else if (item.IsCancel == 1) { color = R.colors.failRed }

        return (
            <AnimatableItem>
                <View style={{
                    flex: 1,
                    marginLeft: R.dimens.widget_left_right_margin,
                    marginRight: R.dimens.widget_left_right_margin,
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                }}>
                    <CardView style={{
                        flex: 1,
                        elevation: R.dimens.listCardElevation,
                        borderBottomLeftRadius: R.dimens.margin,
                        borderRadius: 0,
                        borderTopRightRadius: R.dimens.margin,
                    }} >
                        <View style={{ flex: 1 }}>

                            {/* To show pairname,trnno,and ordertype */}
                            <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', }}>
                                <View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <TextViewMR style={{
                                            color: R.colors.textPrimary, fontSize: R.dimens.smallText
                                        }}> {item.PairName.replace('_', '/')}</TextViewMR>

                                        <TextViewHML style={{
                                            color: item.Type.toLowerCase().includes('buy') ? R.colors.buyerGreen : R.colors.sellerPink,
                                            fontSize: R.dimens.volumeText, marginLeft: R.dimens.widgetMargin
                                        }}>{item.Type + ' - ' + item.OrderType}</TextViewHML>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginLeft: R.dimens.widgetMargin }}>
                                        <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary }}>{R.strings.TxnID} : </TextViewHML>
                                        <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}> {item.TrnNo}  </TextViewHML>
                                    </View>
                                </View>
                                <View>
                                    <StatusChip
                                        color={color}
                                        value={item.IsCancel == 0 ? 'Success' : 'Cancel'} />
                                </View>
                            </View>

                            {/* To show Amount Price and fee */}
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ alignItems: 'center', flex: 1 }}>
                                    <TextViewHML style={{ fontSize: R.dimens.volumeText, color: R.colors.textSecondary, }}>{R.strings.Amount}</TextViewHML>
                                    <TextViewHML style={{ fontSize: R.dimens.volumeText, color: R.colors.textPrimary, }}>{parseFloatVal(item.Amount).toFixed(8)}</TextViewHML>
                                </View>
                                <View style={{ flex: 1, alignItems: 'center' }}>
                                    <TextViewHML style={{ fontSize: R.dimens.volumeText, color: R.colors.textSecondary, }}>{R.strings.Price}</TextViewHML>
                                    <TextViewHML style={{ fontSize: R.dimens.volumeText, color: R.colors.textPrimary, }}>{parseFloatVal(item.Price).toFixed(8)}</TextViewHML>
                                </View>
                                <View style={{ alignItems: 'center', flex: 1, }}>
                                    <TextViewHML style={{ fontSize: R.dimens.volumeText, color: R.colors.textSecondary }}>{R.strings.Fee}</TextViewHML>
                                    <TextViewHML style={{ fontSize: R.dimens.volumeText, color: R.colors.textPrimary, }}>{parseFloatVal(item.ChargeRs).toFixed(8)}</TextViewHML>
                                </View>
                            </View>

                            {/* to show total */}
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: R.dimens.widgetMargin }}>
                                <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.yellow, }}>{parseFloatVal(item.Total).toFixed(8) + ' ' + item.PairName.split('_')[1]}</TextViewHML>
                                <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{convertDateTime(item.DateTime, 'YYYY-MM-DD HH:mm:ss', false)}</TextViewHML>
                            </View>
                        </View>
                    </CardView>
                </View>
            </AnimatableItem>
        )
    }
}

function mapStatToProps(state) {
    //Updated Data for OrderHistory and tradeData
    return {
        result: { ...state.orderHistoryReducer, ...state.tradeData }
    }
}

const mapDispatchToProps = (dispatch) => ({

    // Perform PirList Action
    getPairList: () => dispatch(onFetchMarkets()),

    // Perform OrderHistory Action
    onOrderHistory: (payload) => dispatch(onOrderHistory(payload)),

    // clear orderHistory data from reducer
    clearOrderHistory: () => dispatch(clearOrderHistory()),

    // clear MarketList data from reducer
    clearMarketList: () => dispatch(clearMarketList()),

    // clear RecentOrder data from reducer
    clearRecentOrder: () => dispatch(clearRecentOrder())
})
export default connect(mapStatToProps, mapDispatchToProps)(OrderManagementScreen);