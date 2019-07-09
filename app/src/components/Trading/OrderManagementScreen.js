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
import CommonToast from '../../native_theme/components/CommonToast';
import FilterWidget from '../Widget/FilterWidget';
import Drawer from 'react-native-drawer-menu';
import ListLoader from '../../native_theme/components/ListLoader';
import { ListEmptyComponent, contentContainerStyle } from '../../native_theme/components/FlatListWidgets';
import { isInternet, validateResponseNew } from '../../validations/CommonValidation';
import arraySort from 'array-sort';
import { DateValidation } from '../../validations/DateValidation';
import { onOrderHistory, clearOrderHistory } from '../../actions/Trade/OrderHistoryActions';
import CardView from '../../native_theme/components/CardView';
import StatusChip from '../Widget/StatusChip';
import TextViewMR from '../../native_theme/components/TextViewMR';
import TextViewHML from '../../native_theme/components/TextViewHML';
import { clearMarketList, onFetchMarkets } from '../../actions/Trade/TradeActions';
import { clearRecentOrder } from '../../actions/Trade/RecentOrderAction';
import AnimatableItem from '../../native_theme/components/AnimatableItem';
import SafeView from '../../native_theme/components/SafeView';

class OrderManagementScreen extends Component {

    constructor(props) {
        super(props);

        //Add Current Screen to Manual Handling BackPress Events
        addRouteToBackPress(props);

        //Create Reference
        this.drawer = React.createRef();
        this.toast = React.createRef();

        // Bind all methods
        this.onRefresh = this.onRefresh.bind(this);
        this.onResetPress = this.onResetPress.bind(this);
        this.onCompletePress = this.onCompletePress.bind(this);
        this.onBackPress = this.onBackPress.bind(this);

        // set params for calling previous screen method
        this.props.navigation.setParams({ onBackPress: this.onBackPress });

        //request to pass in API call
        this.request = {}

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
            isShowHistory: true,
            search: '',

            //To hide Search View while swithcing tabs
            hideSearch: false,

            from,
            response: [],
            refreshing: false,

            //Filter
            stFromDate: getCurrentDate(),
            stToDate: getCurrentDate(),

            typeFilter: [{ value: R.strings.Please_Select, code: '' }, { value: R.strings.buy, code: 'buy' }, { value: R.strings.sell, code: 'sell' }],
            selectedType: R.strings.Please_Select,
            tradeTypeId: 0,

            CurrencyPair: [{ value: R.strings.Please_Select }],
            selCurrencyPair: R.strings.Please_Select,

            statuses: [{ value: R.strings.Please_Select, code: 0 }, { value: R.strings.Success, code: 1 }, /* { value: R.strings.open, code: 2 }, */ { value: R.strings.cancel, code: 9 }],
            selectedStatus: R.strings.Please_Select,
            statusId: 0,

            markets: [{ value: R.strings.Please_Select, code: '' }, { value: R.strings.limit, code: 'limit' }, { value: R.strings.market, code: 'market' }, { value: R.strings.spot, code: 'spot' }],
            selectedMarket: R.strings.Please_Select,
            marketTypeId: 0,

            isFilter: false,
            isFirstTime: true,
            isDrawerOpen: false, // First Time Drawer is Closed
        };
    }

    //for BackPress if Drawer is Open Than First Close The Drawer else Back to Previous Screen
    onBackPress() {
        if (this.state.isDrawerOpen) {
            this.drawer.closeDrawer();
            this.setState({ isDrawerOpen: false })
        }
        else {
            //going back screen
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
            }

            //Call OrderHistory api for flatlist
            this.props.onOrderHistory(this.request);

            //to get pair list
            this.props.getPairList();
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

                        if (this.state.isShowHistory) {
                            this.setState({ response: sortedArray });
                        }
                    }
                } catch (_error) {
                    //parsing error
                }
            }
        })
    };

    componentWillUnmount = () => {

        // for clear reducer
        this.props.clearOrderHistory();
        this.props.clearMarketList();
        this.props.clearRecentOrder();

        // remove listener
        if (this.listenerRecieveTradeHistory) {
            this.listenerRecieveTradeHistory.remove();
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        // stop twice api call 
        return isCurrentScreen(nextProps);
    };

    // Reset all value like type, date and hide/show
    async onResetPress() {

        //Bind Request For OrderHistory
        this.request = {
            fromDate: getCurrentDate(),
            toDate: getCurrentDate(),
            status: 0
        }

        this.setState({
            isFilter: false,
            stFromDate: getCurrentDate(),
            stToDate: getCurrentDate(),
            selCurrencyPair: '',
            selectedType: R.strings.Please_Select,
            selectedStatus: R.strings.Please_Select,
            selectedMarket: R.strings.Please_Select,
            statusId: 0,
            tradeTypeId: 0,
            marketTypeId: 0,
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

        //Bind Request For OrderHistory
        this.request = {
            ...this.request,
            fromDate: this.state.stFromDate,
            toDate: this.state.stToDate,
            pairName: this.state.selCurrencyPair !== R.strings.Please_Select ? this.state.selCurrencyPair : '',
            status: this.state.statusId,
            marketType: this.state.marketTypeId,
            trade: this.state.tradeTypeId,
        }

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Call OrderHistory api for flatlist
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
        if (OrderManagementScreen.oldProps !== props) {
            OrderManagementScreen.oldProps = props;
        } else {
            return null;
        }

        // check for current screen
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
                            let newResponse = res
                            res.map((item, index) => {
                                newResponse[index].isCancelText = item.IsCancel == 0 ? 'Success' : 'Cancel'
                            })
                            return Object.assign({}, state, {
                                tradeHistory: orderhistorydata, response: newResponse, refreshing: false
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

                {/* filterwidget for fromdate,todate,type,currencypair, statusand market data */}
                <FilterWidget
                    FromDatePickerCall={(date) => {
                        this.setState({ stFromDate: date, isFilter: false })
                    }}
                    FromDate={this.state.stFromDate}
                    ToDatePickerCall={(date) => this.setState({ stToDate: date, isFilter: false })}
                    ToDate={this.state.stToDate}
                    onResetPress={this.onResetPress}
                    onCompletePress={this.onCompletePress}
                    comboPickerStyle={{ marginTop: 0, marginBottom: R.dimens.activity_margin, }}
                    pickers={[{
                        title: R.strings.Type,
                        array: this.state.typeFilter,
                        selectedValue: this.state.selectedType,
                        onPickerSelect: (item, object) => {
                            if (item !== this.state.selectedType) {
                                this.setState({ selectedType: item, tradeTypeId: object.code })
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
                        onPickerSelect: (item, object) => {
                            if (item !== this.state.selectedStatus) {
                                this.setState({ selectedStatus: item, statusId: object.code })
                            }
                        }
                    },
                    {
                        title: R.strings.market,
                        array: this.state.markets,
                        selectedValue: this.state.selectedMarket,
                        onPickerSelect: (item, object) => {
                            if (item !== this.state.selectedMarket) {
                                this.setState({ selectedMarket: item, marketTypeId: object.code })
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
        this.setState({ isShowHistory: isShowHistory, search: '', hideSearch: false })
    }

    render() {

        //loading bit for handling progress dialog
        var { isFetchingOrderHistory } = this.props.result

        let finalItems = [];
        if (this.state.isShowHistory) {

            //for final items from search input (validate on PairName, Type, Amount, TrnNo, OrderType, isCancelText)
            //default searchInput is empty so it will display all records.
            finalItems = this.state.response.filter((item) =>
                item.PairName.replace('_', '/').toLowerCase().includes(this.state.search.toLowerCase()) ||
                item.Type.toLowerCase().includes(this.state.search.toLowerCase()) ||
                item.Amount.toString().includes(this.state.search) ||
                item.TrnNo.toString().includes(this.state.search) ||
                item.OrderType.toLowerCase().includes(this.state.search) ||
                item.isCancelText.toLowerCase().includes(this.state.search.toLowerCase())
            )
        }

        return (
            /* DrawerLayout for Order History Filteration */
            <Drawer
                ref={cmp => this.drawer = cmp}
                disabled={!this.state.isShowHistory}
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
                        isBack={true}
                        onBackPress={this.onBackPress}
                        original={true}
                        searchable={true}

                        //To manually visible SearchView
                        visibleSearch={this.state.hideSearch}
                        onVisibleSearch={(isVisible) => this.setState({ hideSearch: isVisible })}

                        //If search input change than show searchView with hideSearch to false
                        onSearchText={(input) => this.setState({ search: input, hideSearch: true })}

                        //On Search Cancel Button change hideSearch to true
                        onSearchCancel={() => this.setState({ hideSearch: false })}
                        leftStyle={{ width: '10%' }}
                        titleStyle={{ justifyContent: 'flex-start', width: '80%' }}
                        rightStyle={{ width: '10%' }}
                        rightIcon={this.state.isShowHistory && R.images.FILTER}
                        onRightMenuPress={() => this.drawer.openDrawer()}
                        nav={this.props.navigation} />

                    <View style={{ flexDirection: 'row', marginBottom: R.dimens.widget_top_bottom_margin }}>
                        <TouchableWithoutFeedback
                            onPress={() => this.onTabChange(true)}>
                            <View style={{ marginRight: R.dimens.widgetMargin }}>
                                <TextViewMR
                                    numberOfLines={1}
                                    ellipsizeMode={'tail'}
                                    style={{
                                        color: this.state.isShowHistory ? R.colors.textPrimary : R.colors.textSecondary,
                                        fontSize: R.dimens.mediumText,
                                        paddingLeft: R.dimens.margin_left_right,
                                    }}>{R.strings.orderhistory}</TextViewMR>
                            </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                            onPress={() => this.onTabChange(false)}>
                            <View style={{ flex: 1, marginLeft: R.dimens.widgetMargin }}>
                                <TextViewMR
                                    numberOfLines={1}
                                    ellipsizeMode={'tail'}
                                    style={{
                                        color: !this.state.isShowHistory ? R.colors.textPrimary : R.colors.textSecondary,
                                        fontSize: R.dimens.mediumText,
                                        paddingRight: R.dimens.margin_left_right,
                                    }}>{R.strings.RecentOrder}</TextViewMR>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>

                    {this.state.isShowHistory ?
                        <View style={{ flex: 1 }}>

                            {/* Flatlist Data which is get from api */}
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
                        :
                        <RecentOrder navigation={this.props.navigation} search={this.state.search} />}
                </SafeView>
            </Drawer>
        );
    }

    // styles for this class
    styles = () => {
        return {
            container: {
                flex: 1,
                backgroundColor: R.colors.background,
            },
        }
    }
}

class OrderHistoryItem extends Component {

    shouldComponentUpdate = (nextProps) => {

        //Check If Old Props and New Props are Equal then Return False
        if (this.props.item !== nextProps.item ||
            this.props.index !== nextProps.index ||
            this.props.size !== nextProps.size
        ) {
            return true;
        }
        return false;
    }

    render() {

        // Get required fields from props
        let { item, index, size } = this.props
        let color = R.colors.textSecondary;

        //Update StatusChip Condition
        //Handle condition in IsCancel bit if IsCancel = 0 then Success and if IsCancel = 1 then cancel
        if (item.IsCancel == 0) {
            color = R.colors.successGreen;
        } else if (item.IsCancel == 1) {
            color = R.colors.failRed
        }

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
                    }} >
                        <View style={{ flex: 1 }}>

                            {/* To show pairname,trnno,and ordertype */}
                            <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row' }}>
                                <View>
                                    <View style={{ flexDirection: 'row', }}>
                                        <TextViewMR style={{
                                            color: R.colors.textPrimary,
                                            fontSize: R.dimens.smallText,
                                        }}>
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
                                        value={item.IsCancel == 0 ? 'Success' : 'Cancel'}></StatusChip>
                                </View>
                            </View>

                            {/* To show Amount Price and fee */}
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
                                <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{convertDateTime(item.DateTime, 'YYYY-MM-DD HH:mm:ss', false)}</TextViewHML>
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
        result: { ...state.orderHistoryReducer, ...state.tradeData },
    }
}

const mapDispatchToProps = (dispatch) => ({

    // Perform OrderHistory Action
    onOrderHistory: (payload) => dispatch(onOrderHistory(payload)),

    // Perform PirList Action
    getPairList: () => dispatch(onFetchMarkets()),

    // clear orderHistory data from reducer
    clearOrderHistory: () => dispatch(clearOrderHistory()),

    // clear MarketList data from reducer
    clearMarketList: () => dispatch(clearMarketList()),

    // clear RecentOrder data from reducer
    clearRecentOrder: () => dispatch(clearRecentOrder())
})
export default connect(mapStatToProps, mapDispatchToProps)(OrderManagementScreen);