import React, { Component } from 'react';
import { View, FlatList, Easing, RefreshControl } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import ListLoader from '../../../native_theme/components/ListLoader';
import { ListEmptyComponent, contentContainerStyle } from '../../../native_theme/components/FlatListWidgets';
import { changeTheme, parseArray, getCurrentDate, addPages, convertDateTime, getDateWeekAgoForTrade, getDateMonthAgoForTrade, getDateYearAgoForTrade } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew, validateValue } from '../../../validations/CommonValidation';
import { isCurrentScreen, addRouteToBackPress } from '../../../components/Navigation';
import { connect } from 'react-redux';
import Drawer from 'react-native-drawer-menu';
import { getPairList } from '../../../actions/PairListAction';
import { getTradeSummaryList, clearAllTradeList } from '../../../actions/Trading/TradingSummaryActions';
import { AppConfig } from '../../../controllers/AppConfig';
import PaginationWidget from '../../widget/PaginationWidget'
import R from '../../../native_theme/R';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import FilterWidget from '../../widget/FilterWidget';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import CardView from '../../../native_theme/components/CardView';
import Separator from '../../../native_theme/components/Separator';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import SafeView from '../../../native_theme/components/SafeView';

class UserTradingSummaryScreen extends Component {

    constructor(props) {
        super(props);

        //Create Reference
        this.drawer = React.createRef();

        //stored data based on Previus screen for type etc.
        let range = props.navigation.state.params ? props.navigation.state.params.range : '';
        let orderType = props.navigation.state.params ? props.navigation.state.params.orderType : '';
        let isMargin = props.navigation.state.params ? props.navigation.state.params.isMargin : false;
        let fromDate = '';
        let toDate = '';
        let selectedOrderType = R.strings.selectOrderType;
        let storedSelectedOrderType = '';
        let title = R.strings.TradeSummary;

        if (range) {
            switch (range) {
                case 'Today': {
                    fromDate = getCurrentDate();
                    toDate = getCurrentDate();
                    title = R.strings.today + ' ' + R.strings.TradeSummary;
                    break;
                }
                case 'Week': {
                    fromDate = getDateWeekAgoForTrade();
                    toDate = getCurrentDate();
                    title = R.strings.weekly + ' ' + R.strings.TradeSummary;
                    break;
                }
                case 'Month': {
                    fromDate = getDateMonthAgoForTrade();
                    toDate = getCurrentDate();
                    title = R.strings.monthly + ' ' + R.strings.TradeSummary;
                    break;
                }
                case 'Year': {
                    fromDate = getDateYearAgoForTrade();
                    toDate = getCurrentDate();
                    title = R.strings.yearly + ' ' + R.strings.TradeSummary;
                    break;
                }
                default: {
                    fromDate = getCurrentDate();
                    toDate = getCurrentDate();
                    title = R.strings.TradeSummary;
                }
            }
        }

        if (orderType) {
            switch (orderType) {
                case 'LIMIT': {
                    selectedOrderType = R.strings.limit;
                    storedSelectedOrderType = 'LIMIT';
                    break;
                }
                case 'MARKET': {
                    selectedOrderType = R.strings.market;
                    storedSelectedOrderType = 'MARKET';
                    break;
                }
                case 'STOP_Limit': {
                    selectedOrderType = R.strings.stopLimit;
                    storedSelectedOrderType = 'STOP_Limit';
                    break;
                }
                case 'SPOT': {
                    selectedOrderType = R.strings.spot;
                    storedSelectedOrderType = 'SPOT';
                    break;
                }
            }
        }


        //Dedine all initial state
        this.state = {
            title,
            //Filter
            fromDate,
            toDate,
            storedFromDate: fromDate,
            storedToDate: toDate,
            userid: '',
            transactionNo: '',

            refreshing: false,
            search: '',
            response: [],

            //pickers
            type: [{ value: R.strings.select_type }, { value: R.strings.buy, code: 'buy' }, { value: R.strings.sell, code: 'sell' }],
            selectedType: R.strings.select_type,
            selectedTypeCode: '',

            currencyPairs: [{ value: R.strings.all }],
            selectedCurrencyPair: R.strings.all,

            status: [{ value: R.strings.select_status }, { value: 'Active Order', code: '95' }, { value: 'Partial Order', code: '92' }, { value: 'Settled Order', code: '91' }, { value: 'System Fail', code: '94' }],
            selectedStatus: R.strings.select_status,
            selectedStatusCode: '',

            row: [],
            selectedPage: 1,

            orderTypes: [{ value: R.strings.limit, code: 'LIMIT' }, { value: R.strings.market, code: 'MARKET' }, { value: R.strings.stopLimit, code: 'STOP_Limit' }, { value: R.strings.spot, code: 'SPOT' }],
            selectedOrderType: selectedOrderType,
            storedTypeText: selectedOrderType,
            storedSelectedOrderType: storedSelectedOrderType,
            selectedOrderTypeCode: storedSelectedOrderType,

            isMargin: isMargin,
            isDrawerOpen: false,
            isFirstTime: true,
        };

        //Bind all methods

        this.onBackPress = this.onBackPress.bind(this);

        //Add current route for backpress handle
        addRouteToBackPress(props, this.onBackPress);

        this.props.navigation.setParams({ onBackPress: this.onBackPress });
    }

    // If drawer is open then first, it will close the drawer and after it will return to previous screen
    onBackPress() {
        if (this.state.isDrawerOpen) {

            this.drawer.closeDrawer();
            this.setState({ isDrawerOpen: false }
            )
        }
        else {
            //goging back screen
            this.props.navigation.goBack();
        }
    }

    componentDidMount = async () => {

        //Add this method to change theme based on stored theme name.

        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {

            let request = {
                FromDate: this.state.fromDate,
                ToDate: this.state.toDate,
                PageNo: 0,
                PageSize: AppConfig.pageSize,
                MarketType: this.state.selectedOrderTypeCode,
            }

            if (this.state.isMargin) {
                //to get pair list
                this.props.getCurrencyPairs({ IsMargin: 1 });

                request = {
                    ...request,
                    IsMargin: 1
                }
                //To get trading summary list
                this.props.getTradeSummaryList(request);
            } else {

                //to get pair list
                this.props.getCurrencyPairs({});

                //To get trading summary list
                this.props.getTradeSummaryList(request);
            }

        }
    };

    shouldComponentUpdate = (nextProps, nextState) => {

        //Stop Twice api call
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
        if (UserTradingSummaryScreen.oldProps !== props) {
            UserTradingSummaryScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            const { tradeSummaryData, pairList } = props.data;

            if (tradeSummaryData) {
                try {
                    //if local tradeSummaryData state is null or its not null and also different then new response then and only then validate response.
                    if (state.tradeSummaryData == null || (state.tradeSummaryData != null && tradeSummaryData !== state.tradeSummaryData)) {

                        //if tradeSummaryData response is success then store array list else store empty list
                        if (validateResponseNew({ response: tradeSummaryData, isList: true })) {
                            // Parsing response in array
                            let res = parseArray(tradeSummaryData.Response);

                            return { ...state, tradeSummaryData, response: res, refreshing: false, row: addPages(tradeSummaryData.TotalCount) };
                        } else {
                            return { ...state, tradeSummaryData, response: [], refreshing: false, row: [] };
                        }
                    }
                } catch (e) {
                    return { ...state, response: [], refreshing: false, row: [] };
                }
            }

            if (pairList) {
                try {

                    //if local pairList state is null or its not null and also different then new response then and only then validate response.
                    if (state.pairList == null || (state.pairList != null && pairList !== state.pairList)) {

                        //if tradingLedgers response is success then store array list else store empty list

                        if (validateResponseNew({ response: pairList, isList: true })) {
                            // Parsing response in array

                            let res = parseArray(pairList.Response);

                            // fetching only PairName from PairName
                            for (var dataItem in res) {

                                let item = res[dataItem]

                                item.value = item.PairName
                            }

                            let currencyPairs = [

                                { value: R.strings.all },
                                ...res
                            ];

                            return { ...state, pairList, currencyPairs };

                        } else {

                            return { ...state, pairList, currencyPairs: [{ value: R.strings.all }] };
                        }
                    }
                } catch (e) {
                    return { ...state, currencyPairs: [{ value: R.strings.all }] };
                }
            }
        }
        return null;
    }

    // if press on complete button then check validation and api calling

    onComplete = async () => {

        let request = {
            FromDate: this.state.fromDate,
            ToDate: this.state.toDate,
            TrnNo: this.state.transactionNo,
            MemberID: this.state.userid,
            Status: this.state.selectedStatusCode,
            Trade: this.state.selectedTypeCode,
            Pair: this.state.selectedCurrencyPair == R.strings.all ? '' : this.state.selectedCurrencyPair,
            MarketType: this.state.selectedOrderTypeCode,
            PageNo: 0,
            PageSize: AppConfig.pageSize,
        }

        //Check NetWork is Available or not
        if (await isInternet()) {
            if (this.state.isMargin) {

                request = {
                    ...request,
                    IsMargin: 1
                }

                //To get the trading ledgers
                this.props.getTradeSummaryList(request);
            } else {

                //To get the trading ledgers
                this.props.getTradeSummaryList(request);
            }
        }

        /* Close Drawer user press on Complete button bcoz display flatlist item on Screen */
        this.drawer.closeDrawer();
        this.setState({ selectedPage: 1 })
    }

    /* When user press on reset button then all values are reset */
    onReset = async () => {

        let request = {
            FromDate: this.state.storedFromDate,
            ToDate: this.state.storedToDate,
            PageNo: 0,
            PageSize: AppConfig.pageSize,
            MarketType: this.state.storedSelectedOrderType,
        }

        /* Set state to original value */
        this.setState({
            fromDate: this.state.storedFromDate,
            toDate: this.state.storedToDate,
            transactionNo: '',
            userid: '',
            selectedType: R.strings.select_type,
            selectedStatus: R.strings.select_status,
            selectedCurrency: R.strings.selectCurrency,
            selectedOrderType: this.state.storedTypeText,
            selectedPage: 1,
            selectedOrderTypeCode: '',
            selectedStatusCode: '',
            selectedTypeCode: '',
        })

        //Check NetWork is Available or not
        if (await isInternet()) {
            if (this.state.isMargin) {

                request = {
                    ...request,
                    IsMargin: 1
                }

                //To get the trading ledgers
                this.props.getTradeSummaryList(request);
            } else {

                //To get the trading ledgers
                this.props.getTradeSummaryList(request);
            }
        }

        /* Close Drawer user press on Complete button bcoz display flatlist item on Screen */
        this.drawer.closeDrawer();

    }

    onRefresh = async () => {

        this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (await isInternet()) {

            let request = {
                FromDate: this.state.fromDate,
                MemberID: this.state.userid,
                Status: this.state.selectedStatusCode,
                Trade: this.state.selectedTypeCode,
                Pair: this.state.selectedCurrencyPair == R.strings.all ? '' : this.state.selectedCurrencyPair,
                MarketType: this.state.selectedOrderTypeCode,
                PageNo: this.state.selectedPage - 1,
                TrnNo: this.state.transactionNo,
                PageSize: AppConfig.pageSize,
                ToDate: this.state.toDate,
            }

            if (this.state.isMargin) {

                request = {
                    ...request, IsMargin: 1
                }

                //To get the trading ledgers

                this.props.getTradeSummaryList(request);
            } else {

                //To get the trading ledgers

                this.props.getTradeSummaryList(request);
            }

        } else {
            this.setState(
                { refreshing: false });
        }
    }

    /* this method is called when page change and also api call */
    onPageChange = async (pageNo) => {

        //if selected page is diifferent than call api
        if (pageNo != this.state.selectedPage) {

            //Check NetWork is Available or not
            if (await isInternet()) {
                this.setState({ selectedPage: pageNo });

                let request = {
                    Trade: this.state.selectedTypeCode,
                    Pair: this.state.selectedCurrencyPair == R.strings.all ? '' : this.state.selectedCurrencyPair,
                    MarketType: this.state.selectedOrderTypeCode,
                    FromDate: this.state.fromDate,
                    TrnNo: this.state.transactionNo,
                    MemberID: this.state.userid,
                    Status: this.state.selectedStatusCode,
                    PageNo: this.state.selectedPage - 1,
                    PageSize: AppConfig.pageSize,
                    ToDate: this.state.toDate,
                }

                if (this.state.isMargin) {

                    request = {
                        ...request, IsMargin: 1
                    }
                    //To get the trading ledgers
                    this.props.getTradeSummaryList(request);
                } else {

                    //To get the trading ledgers
                    this.props.getTradeSummaryList(request);
                }
            } else {
                this.setState({ refreshing: false })
            }
        }
    }

    navigationDrawer() {
        // for show filter of fromdate, todate,userid, transactionNo, type, currencyPairs, status and orderTypes etc
        return (
            <FilterWidget
                FromDatePickerCall={(date) => this.setState({ fromDate: date })}
                ToDatePickerCall={(date) => this.setState({ toDate: date })}
                toastRef={component => this.toast = component}
                FromDate={this.state.fromDate}
                ToDate={this.state.toDate}
                textInputStyle={{ marginTop: 0, marginBottom: 0, }}
                textInputs={[
                    {
                        header: R.strings.userid,
                        placeholder: R.strings.userid, multiline: false,
                        keyboardType: 'default',
                        returnKeyType: "done", maxLength: 50,
                        onChangeText: (text) => { this.setState({ userid: text }) },
                        value: this.state.userid,
                    },
                    {
                        header: R.strings.transactionNo,
                        placeholder: R.strings.transactionNo,
                        multiline: false, keyboardType: 'default',
                        returnKeyType: "done",
                        maxLength: 50,
                        onChangeText: (text) => { this.setState({ transactionNo: text }) },
                        value: this.state.transactionNo,
                    }
                ]}
                comboPickerStyle={{ marginTop: 0, }}
                pickers={[
                    {
                        title: R.strings.type, array: this.state.type,
                        selectedValue: this.state.selectedType,
                        onPickerSelect: (index, object) => this.setState({ selectedType: index, selectedTypeCode: object.code })
                    },
                    {
                        title: R.strings.currencyPair,
                        array: this.state.currencyPairs,
                        selectedValue: this.state.selectedCurrencyPair,
                        onPickerSelect: (item) => this.setState({ selectedCurrencyPair: item })
                    },
                    {
                        title: R.strings.status,
                        array: this.state.status,
                        selectedValue: this.state.selectedStatus,
                        onPickerSelect: (index, object) => this.setState({ selectedStatus: index, selectedStatusCode: object.code })
                    },
                    {
                        title: R.strings.selectOrderType,
                        array: this.state.orderTypes,
                        selectedValue: this.state.selectedOrderType,
                        onPickerSelect: (index, object) => this.setState({ selectedOrderType: index, selectedOrderTypeCode: object.code })
                    }
                ]}
                onResetPress={this.onReset}
                onCompletePress={this.onComplete}
            />
        )
    }

    componentWillUnmount = () => {
        //clear data on backpress
        this.props.clearAllTradeList();
    };

    render() {
        let filteredList = [];

        // For searching functionality
        if (this.state.response.length) {
            filteredList = this.state.response.filter (item => (
                    item.PairName.replace('_', '/').toLowerCase().includes(this.state.search.toLowerCase()) ||
                    item.Type.toLowerCase().includes(this.state.search.toLowerCase()) ||
                    item.OrderType.toLowerCase().includes(this.state.search.toLowerCase()) ||
                    item.TrnNo.toString().includes(this.state.search) ||
                    item.MemberID.toString().includes(this.state.search)
                )
                );
        }

        return (

            // DrawerLayout for Filteration
            <Drawer
                ref={component => this.drawer = component}
                onDrawerClose={() => this.setState({ isDrawerOpen: false })}
                drawerPosition={Drawer.positions.Right}
                drawerContent={this.navigationDrawer()}
                onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
                type={Drawer.types.Overlay}
                drawerWidth={R.dimens.FilterDrawarWidth}
                easingFunc={Easing.ease}>

                <SafeView style={{ flex: 1, backgroundColor: R.colors.background, }}>
                    {/* To set status bar as per our theme */}
                    <CommonStatusBar />

                    {/* To set toolbar as per our theme */}
                    <CustomToolbar
                        title={this.state.title}
                        isBack={true}
                        nav={this.props.navigation}
                        searchable={true}
                        onSearchText={(input) => this.setState({ search: input })}
                        rightIcon={R.images.FILTER}
                        onRightMenuPress={() => this.drawer.openDrawer()}
                        onBackPress={this.onBackPress}
                    />

                    <View style={{ flex: 1, justifyContent: 'space-between' }}>
                        {/* Progress */}
                        {(this.props.data.isFetchingTradeSummary && !this.state.refreshing)
                            ?
                            <ListLoader />
                            :
                            filteredList.length > 0 ?
                                <FlatList
                                    data={filteredList}
                                    extraData={this.state}
                                    showsVerticalScrollIndicator={false}
                                    // render all item in list
                                    renderItem={({ item, index }) =>
                                        <UserTradingSummaryItem
                                            index={index}
                                            item={item}
                                            onPress={() => this.props.navigation.navigate('UserTradingSummaryDetail', { item })}
                                            size={this.state.response.length} />
                                    }
                                    // assign index as key value to list item
                                    keyExtractor={(_item, index) => index.toString()}
                                    contentContainerStyle={contentContainerStyle(filteredList)}
                                    // Refresh functionality in list
                                    refreshControl={<RefreshControl
                                        colors={[R.colors.accent]}
                                        progressBackgroundColor={R.colors.background}
                                        refreshing={this.state.refreshing}
                                        onRefresh={this.onRefresh}
                                    />}
                                />
                                :
                                // Displayed empty component when no record found 
                                <ListEmptyComponent />
                        }

                        <View>
                            {/*To Set Pagination View  */}
                            {filteredList.length > 0 && <PaginationWidget
                                row={this.state.row}
                                selectedPage={this.state.selectedPage}
                                onPageChange={(item) => { this.onPageChange(item) }} />}
                        </View>
                    </View>
                </SafeView>
            </Drawer>
        );
    }
}

// This Class is used for display record in list
class UserTradingSummaryItem extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {

        //if old item and new item are different than only render list item
        if (this.props.item === nextProps.item) {
            return false
        }
        return true
    }

    render() {
        let { item: { TrnNo, MemberID, Type, PairName, DateTime, Amount, Total, OrderType }, index, size, } = this.props;

        //set status color based on type
        let statusColor = R.colors.failRed;
        if (Type === "BUY") {
            statusColor = R.colors.successGreen;
        }
        return (
            // Flatlist item animation
            <AnimatableItem>
                <View style={{
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginLeft: R.dimens.widget_left_right_margin,
                    flex: 1,
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginRight: R.dimens.widget_left_right_margin
                }}>

                    <CardView style={{
                        borderRadius: 0,
                        borderBottomLeftRadius: R.dimens.margin,
                        flex: 1,
                        borderTopRightRadius: R.dimens.margin,
                        elevation: R.dimens.listCardElevation,
                    }} onPress={this.props.onPress}>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                            {/* for show PairName, Type and OrderType */}
                            <View style={{ flexDirection: 'row', alignItems: 'center', alignContent: 'center' }}>
                                <TextViewMR style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText }}>{PairName.replace('_', '/')}</TextViewMR>
                                <TextViewMR style={{ color: statusColor, fontSize: R.dimens.smallText, marginLeft: R.dimens.widgetMargin }}>{Type}</TextViewMR>
                                <TextViewMR style={{ fontSize: R.dimens.smallestText, color: statusColor }}>{' - '}{OrderType ? OrderType.toUpperCase() : '-'}</TextViewMR>
                            </View>
                            <ImageTextButton
                                icon={R.images.RIGHT_ARROW_DOUBLE}
                                onPress={this.props.onPress}
                                style={{ margin: 0 }}
                                iconStyle={{
                                    width: R.dimens.dashboardMenuIcon,
                                    height: R.dimens.dashboardMenuIcon,
                                    tintColor: R.colors.textPrimary
                                }} />
                        </View>

                        {/* for show MemberID, Amount and Total */}
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.userid}</TextViewHML>
                                <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, }}>{MemberID ? MemberID : '-'}</TextViewHML>
                            </View>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.Amount}</TextViewHML>
                                <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, }}>{Amount.toFixed(8)}</TextViewHML>
                            </View>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.total}</TextViewHML>
                                <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, }}>{Total.toFixed(8)}</TextViewHML>
                            </View>
                        </View>

                        {/* for show TrnNo */}
                        <View style={{ marginTop: R.dimens.widgetMargin }}>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textSecondary, }}>{R.strings.Trn_No.toUpperCase()}</TextViewHML>
                                <Separator style={{ flex: 1, justifyContent: 'center', }} />
                            </View>
                            <TextViewHML style={{
                                flex: 1, marginLeft: R.dimens.widget_left_right_margin, fontSize: R.dimens.smallText,
                                color: R.colors.yellow,
                            }}>{validateValue(TrnNo)}</TextViewHML>
                        </View>

                        {/* for show date and time */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <ImageTextButton
                                style={{ margin: 0, paddingRight: R.dimens.LineHeight, }}
                                icon={R.images.IC_TIMER}
                                iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
                            />
                            <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{convertDateTime(DateTime, 'YYYY-MM-DD HH:mm:ss', false)}</TextViewHML>
                        </View>
                    </CardView>
                </View>
            </AnimatableItem>
        )
    }
}

function mapStatToProps(state) {
    //Updated Data For tradingSummaryReducer,pairListReducer Data 
    let data = {
        ...state.tradingSummaryReducer,
        ...state.pairListReducer
    }
    return { data }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform getTradeSummaryList List Action 
        getTradeSummaryList: (payload) => dispatch(getTradeSummaryList(payload)),
        //Perform getCurrencyPairs Action 
        getCurrencyPairs: (payload) => dispatch(getPairList(payload)),
        //clear data
        clearAllTradeList: () => dispatch(clearAllTradeList()),
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(UserTradingSummaryScreen);