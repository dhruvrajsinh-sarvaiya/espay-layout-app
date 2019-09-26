// UserTradeListDetailsDisplayScreen.js
import React, { Component } from 'react'
import { View, FlatList, RefreshControl, Easing } from 'react-native'
import { changeTheme, parseArray, addPages, convertDate, convertTime, getCurrentDate, getDateWeekAgo, getDateMonthAgo, parseIntVal, } from '../../../controllers/CommonUtils';
import { isCurrentScreen, addRouteToBackPress } from '../../Navigation';
import SafeView from '../../../native_theme/components/SafeView';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import R from '../../../native_theme/R';
import { contentContainerStyle, ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import CardView from '../../../native_theme/components/CardView';
import PaginationWidget from '../../widget/PaginationWidget';
import { connect } from 'react-redux';
import ListLoader from '../../../native_theme/components/ListLoader';
import { isInternet, validateResponseNew, validateValue, isEmpty, } from '../../../validations/CommonValidation';
import Drawer from 'react-native-drawer-menu';
import { AppConfig } from '../../../controllers/AppConfig';
import { getListPairArbitrage } from '../../../actions/PairListAction';
import { getArbitrageTradingSummeryList, clearArbitrageTradingSummeryListData } from '../../../actions/Arbitrage/ArbitrageTradingSummeryLpWiseActions'
import FilterWidget from '../../widget/FilterWidget';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import Separator from '../../../native_theme/components/Separator';

export class UserTradeListDetailsDisplayScreen extends Component {
    constructor(props) {
        super(props);

        //stored data based on Previus screen for type etc.
        let range = props.navigation.state.params.range ? props.navigation.state.params.range : '';
        let marketType = props.navigation.state.params.range ? props.navigation.state.params.marketType : '';
        let fromDate = getCurrentDate();
        let title = R.strings.TradeSummary;
        let toDate = getCurrentDate();

        if (range) {
            switch (range) {
                case 'Today': {
                    fromDate = getCurrentDate();
                    toDate = getCurrentDate();
                    title = R.strings.today + ' ' + R.strings.TradeSummary;
                    break;
                }
                case 'Week': {
                    toDate = getCurrentDate();
                    fromDate = getDateWeekAgo();
                    title = R.strings.weekly + ' ' + R.strings.TradeSummary;
                    break;
                }
                case 'Month': {
                    fromDate = getDateMonthAgo(0); toDate = getCurrentDate();
                    title = R.strings.monthly + ' ' + R.strings.TradeSummary;
                    break;
                }
                case 'Year': {
                    toDate = getCurrentDate();
                    fromDate = getDateMonthAgo(11);
                    title = R.strings.yearly + ' ' + R.strings.TradeSummary;
                    break;
                }
                default: {
                    fromDate = getCurrentDate(); toDate = getCurrentDate();
                    title = R.strings.TradeSummary;
                }
            }
        }

        //Define all initial state
        this.state = {
            storedFromDate: fromDate,
            storedToDate: toDate,
            title,

            //Filter
            fromDate,
            toDate,
            userid: '',
            transactionNo: '',

            type: [{ value: R.strings.select_type }, { value: R.strings.buy, code: 'buy' }, { value: R.strings.sell, code: 'sell' }],
            selectedType: R.strings.select_type,
            selectedTypeCode: '',

            arbitragePairListDataState: null,
            pairs: [{ value: R.strings.all }],
            selectedPair: R.strings.all,
            selectedPairCode: -1,

            status: [{ value: R.strings.select_status }, { value: R.strings.activeOrder, code: '95' }, { value: R.strings.partialOrder, code: '96' }, { value: R.strings.settledOrder, code: '91' }, { value: R.strings.cancelOrder, code: '93' }, { value: R.strings.SystemFail, code: '94' }],
            selectedStatus: R.strings.select_status,
            selectedStatusCode: '',

            orderTypes: [
                { value: R.strings.selectOrderType, code: R.strings.selectOrderType },
                { value: R.strings.LIMIT, code: 'LIMIT' },
                { value: R.strings.MARKET, code: 'MARKET' },
                { value: R.strings.STOPLIMIT, code: 'STOP_Limit' },
                { value: R.strings.SPOT, code: 'SPOT' }
            ],
            selectedOrderType: marketType,
            selectedOrderTypeCode: marketType,
            oldOrderType: marketType,

            // for lpwise data
            ArbitrageLpWiseListResponse: [],
            ArbitrageLpWiseListState: null,

            row: [],
            searchInput: '',
            selectedPage: 1,

            isDrawerOpen: false,
            refreshing: false,
            isFirstTime: true,
        }

        // Create Reference
        this.drawer = React.createRef()

        //add current route for backpress handle
        addRouteToBackPress(props, this.onBackPress);
        this.props.navigation.setParams({ onBackPress: this.onBackPress });
    }

    // If drawer is open then first, it will close the drawer and after it will return to previous screen
    onBackPress = () => {
        if (this.state.isDrawerOpen) {
            this.drawer.closeDrawer();
            this.setState({ isDrawerOpen: false })
        }
        else {
            //goging back screen
            this.props.navigation.goBack();
        }
    }

    async componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme()
        // call trade summery lp wise api 
        this.callTradeSummaryLPWiseApi()
        // call list pair api
        this.props.getListPairArbitrage()
    }

    shouldComponentUpdate(nextProps, _nextState) {
        //stop twice api call
        return isCurrentScreen(nextProps)
    }

    componentWillUnmount() {
        // clear reducer data
        this.props.clearArbitrageTradingSummeryListData()
    }

    //api call
    callTradeSummaryLPWiseApi = async () => {

        //Check NetWork is Available or not
        if (await isInternet()) {
            this.setState({ selectedPage: 1 })
            let request = {
                FromDate: this.state.fromDate,
                PageSize: AppConfig.pageSize,
                PageNo: 1,
                MarketType: this.state.selectedOrderTypeCode,
                ToDate: this.state.toDate,
            }

            // Call arbitrage trading summery lp wise List Api
            this.props.getArbitrageTradingSummeryList(request)
        }
    }


    // for swipe to refresh functionality
    onRefresh = async () => {
        this.setState({ refreshing: true });

        // Check NetWork is Available or not
        if (await isInternet()) {

            // Bind request for arbitrage trading summery lp wise List
            let request = {
                ToDate: this.state.toDate,
                FromDate: this.state.fromDate,
                TrnNo: this.state.transactionNo,
                MemberID: isEmpty(this.state.userid) ? '' : parseInt(this.state.userid),
                Pair: this.state.selectedPair === R.strings.all ? '' : this.state.selectedPair,
                Trade: this.state.selectedTypeCode,
                Status: this.state.selectedStatus === R.strings.select_status ? '' : parseInt(this.state.selectedStatusCode),
                PageNo: this.state.selectedPage,
                MarketType: R.strings.selectOrderType !== this.state.selectedOrderType ? this.state.selectedOrderTypeCode : '',
                PageSize: AppConfig.pageSize,
            }
            // Call Get arbitrage trading summery lp wise List API
            this.props.getArbitrageTradingSummeryList(request);

        } else {
            this.setState({ refreshing: false });
        }
    }

    // Reset Filter
    onResetPress = async () => {
        // Close drawer
        this.drawer.closeDrawer()

        // set Initial State
        this.setState({
            fromDate: this.state.storedFromDate,
            toDate: this.state.storedToDate,
            userid: '',
            transactionNo: '',
            selectedStatusCode: '',
            searchInput: '',
            selectedOrderType: R.strings.LIMIT,
            selectedType: R.strings.select_type,
            selectedTypeCode: '',
            selectedPair: R.strings.all,
            selectedOrderTypeCode: this.state.oldOrderType,
            selectedPairCode: -1,
            selectedStatus: R.strings.select_status,
            selectedExchange: R.strings.select_type,
            selectedPage: 1,
        })

        // Check NetWork is Available or not
        if (await isInternet()) {

            // Bind request for arbitrage trading summery lp wise List
            let request = {
                FromDate: this.state.storedFromDate,
                ToDate: this.state.storedToDate,
                PageNo: 1,
                PageSize: AppConfig.pageSize,
                MarketType: this.state.oldOrderType,
            }
            //Call Get arbitrage trading summery lp wise List API
            this.props.getArbitrageTradingSummeryList(request);

        } else {
            this.setState({ refreshing: false });
        }
    }

    // Call api when user pressed on complete button
    onCompletePress = async () => {

        this.setState({ selectedPage: 1, })

        // Close Drawer user press on Complete button bcoz display flatlist item on Screen
        this.drawer.closeDrawer();

        // Check NetWork is Available or not
        if (await isInternet()) {

            // Bind request for arbitrage trading summery lp wise List
            let request = {
                ToDate: this.state.toDate,
                MemberID: isEmpty(this.state.userid) ? '' : parseInt(this.state.userid),
                MarketType: R.strings.selectOrderType !== this.state.selectedOrderType ? this.state.selectedOrderTypeCode : '',
                Trade: this.state.selectedTypeCode,
                Pair: this.state.selectedPair === R.strings.all ? '' : this.state.selectedPair,
                Status: this.state.selectedStatus === R.strings.select_status ? '' : parseInt(this.state.selectedStatusCode),
                PageNo: 1,
                TrnNo: this.state.transactionNo,
                FromDate: this.state.fromDate,
                PageSize: AppConfig.pageSize,
            }
            //Call Get arbitrage trading summery lp wise List API
            this.props.getArbitrageTradingSummeryList(request);

        } else {
            this.setState({ refreshing: false });
        }

        //If Filter from Complete Button Click then empty searchInput
        this.setState({ searchInput: '' })

    }

    // Pagination Method Called When User Change Page 
    onPageChange = async (pageNo) => {

        //if selected page is diffrent than call api
        if (pageNo != this.state.selectedPage) {
            //if user selecte other page number then and only then API Call elase no need to call API
            this.setState({ selectedPage: pageNo });

            // Check NetWork is Available or not
            if (await isInternet()) {
                // Bind request for arbitrage trading summery lp wise List
                let request = {
                    FromDate: this.state.fromDate,
                    ToDate: this.state.toDate,
                    MemberID: isEmpty(this.state.userid) ? '' : parseInt(this.state.userid),
                    TrnNo: this.state.transactionNo,
                    PageNo: pageNo,
                    Trade: this.state.selectedTypeCode,
                    Pair: this.state.selectedPair === R.strings.all ? '' : this.state.selectedPair,
                    Status: this.state.selectedStatus === R.strings.select_status ? '' : parseInt(this.state.selectedStatusCode),
                    MarketType: R.strings.selectOrderType !== this.state.selectedOrderType ? this.state.selectedOrderTypeCode : '',
                    PageSize: AppConfig.pageSize,
                }
                //Call Get arbitrage trading summery lp wise List API
                this.props.getArbitrageTradingSummeryList(request);
            } else {
                this.setState({ refreshing: false });
            }
        }
    }

    static oldProps = {};

    static getDerivedStateFromProps(props, state) {

        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return { ...state, isFirstTime: false, };
        }

        // To Skip Render if old and new props are equal
        if (UserTradeListDetailsDisplayScreen.oldProps !== props) {
            UserTradeListDetailsDisplayScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //Get All Updated Feild of Particular actions
            const { ArbitrageLpWiseList, arbitragePairListData } = props.TradeSummeryResult

            // ArbitrageLpWiseList is not null
            if (ArbitrageLpWiseList) {
                try {
                    if (state.ArbitrageLpWiseListState == null || (state.ArbitrageLpWiseListState !== null && ArbitrageLpWiseList !== state.ArbitrageLpWiseListState)) {
                        //succcess response fill the list 
                        if (validateResponseNew({ response: ArbitrageLpWiseList, isList: true, })) {

                            return Object.assign({}, state, {
                                ArbitrageLpWiseListState: ArbitrageLpWiseList,
                                ArbitrageLpWiseListResponse: parseArray(ArbitrageLpWiseList.Response),
                                refreshing: false,
                                row: addPages(ArbitrageLpWiseList.TotalCount)
                            })
                        } else {
                            //if response is not validate than list is empty
                            return Object.assign({}, state, {
                                ArbitrageLpWiseListState: null,
                                ArbitrageLpWiseListResponse: [],
                                refreshing: false,
                                row: []
                            })
                        }
                    }
                } catch (e) {
                    return Object.assign({}, state, {
                        ArbitrageLpWiseListState: null,
                        ArbitrageLpWiseListResponse: [],
                        refreshing: false,
                        row: [],
                    })
                }
            }
            if (arbitragePairListData) {
                try {
                    //if local arbitragePairListData state is null or its not null and also different then new response then and only then validate response.
                    if (state.arbitragePairListDataState == null || (state.arbitragePairListDataState != null && arbitragePairListData !== state.arbitragePairListDataState)) {

                        //if  response is success then store arbitragePairListData list else store empty list
                        if (validateResponseNew({ response: arbitragePairListData, isList: true })) {
                            let res = parseArray(arbitragePairListData.Response);

                            //for add transactionTypes
                            for (var pairKey in res) {
                                let item = res[pairKey];
                                item.value = item.PairName;
                            }

                            let pairNames = [
                                { value: R.strings.all },
                                ...res
                            ];

                            return { ...state, arbitragePairListDataState: arbitragePairListData, pairs: pairNames };
                        } else {
                            return { ...state, arbitragePairListDataState: arbitragePairListData, pairs: [{ value: R.strings.all }] };
                        }
                    }
                } catch (e) {
                    return { ...state, pairs: [{ value: R.strings.all }] };
                }
            }
        }
        return null
    }

    // Drawer Navigation
    navigationDrawer() {

        return (
            // for show filter of fromdate, todate,currency and user data etc
            <FilterWidget
                FromDatePickerCall={(date) => this.setState({ fromDate: date })}
                ToDatePickerCall={(date) => this.setState({ toDate: date })}
                FromDate={this.state.fromDate}
                ToDate={this.state.toDate}
                toastRef={component => this.toast = component}
                textInputStyle={{ marginTop: 0, marginBottom: 0, }}
                textInputs={
                    [
                        {
                            placeholder: R.strings.userid,
                            header: R.strings.userid,
                            multiline: false,
                            keyboardType: 'numeric',
                            maxLength: 50,
                            returnKeyType: "next",
                            validate: true,
                            validateNumeric: true,
                            onChangeText: (text) => { this.setState({ userid: text }) },
                            value: this.state.userid,
                        },
                        {
                            multiline: false,
                            keyboardType: 'default',
                            returnKeyType: "done",
                            header: R.strings.transactionNo,
                            placeholder: R.strings.transactionNo,
                            maxLength: 50,
                            onChangeText: (text) => { this.setState({ transactionNo: text }) },
                            value: this.state.transactionNo,
                        }
                    ]}
                comboPickerStyle={{ marginTop: 0, }}
                pickers={
                    [
                        {
                            title: R.strings.type,
                            array: this.state.type,
                            selectedValue: this.state.selectedType,
                            onPickerSelect: (index, object) => this.setState({ selectedType: index, selectedTypeCode: object.code })
                        },
                        {
                            selectedValue: this.state.selectedPair,
                            title: R.strings.currencyPair,
                            array: this.state.pairs,
                            onPickerSelect: (item) => this.setState({ selectedPair: item })
                        },
                        {
                            array: this.state.status,
                            selectedValue: this.state.selectedStatus,
                            onPickerSelect: (index, object) => this.setState({ selectedStatus: index, selectedStatusCode: object.code }),
                            title: R.strings.status,
                        },
                        {
                            array: this.state.orderTypes,
                            title: R.strings.selectOrderType,
                            selectedValue: this.state.selectedOrderType,
                            onPickerSelect: (index, object) => this.setState({ selectedOrderType: index, selectedOrderTypeCode: object.code })
                        }
                    ]}
                onResetPress={this.onResetPress}
                onCompletePress={this.onCompletePress}
            />
        )
    }

    render() {

        // Loading status for Progress bar which is fetching from reducer
        let { ArbitrageLpWiseLoading, } = this.props.TradeSummeryResult

        // For searching functionality
        let finalItems = this.state.ArbitrageLpWiseListResponse.filter(item => (
            item.TrnNo.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
            item.Type.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
            item.PairName.replace('_', '/').toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
            item.OrderType.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
            item.ProviderName !== null && item.ProviderName.toString().toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
            parseIntVal(item.MemberID).toString().includes(this.state.searchInput) ||
            item.Total.toFixed(8).toString().includes(this.state.searchInput) ||
            item.Amount.toFixed(8).toString().includes(this.state.searchInput)
        ))

        return (
            //DrawerLayout for arbitrage trading summery lp wise Filteration
            <Drawer
                onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
                onDrawerClose={() => this.setState({ isDrawerOpen: false })}
                type={Drawer.types.Overlay}
                drawerPosition={Drawer.positions.Right}
                ref={cmpDrawer => this.drawer = cmpDrawer}
                drawerWidth={R.dimens.FilterDrawarWidth}
                drawerContent={this.navigationDrawer()}
                easingFunc={Easing.ease}>

                <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                    {/* To set status Bar as per our theme */}
                    <CommonStatusBar />

                    {/* To set toolbar as per our Theme */}
                    <CustomToolbar
                        isBack={true}
                        title={this.state.title}
                        onBackPress={() => this.onBackPress()}
                        nav={this.props.navigation}
                        rightIcon={R.images.FILTER}
                        onRightMenuPress={() => this.drawer.openDrawer()}
                        searchable={true}
                        onSearchText={(text) => this.setState({ searchInput: text })} />

                    <View style={{ flex: 1, justifyContent: 'space-between' }}>
                        {
                            (ArbitrageLpWiseLoading && !this.state.refreshing) ?
                                <ListLoader />
                                :
                                <FlatList
                                    data={finalItems}
                                    showsVerticalScrollIndicator={false}
                                    // render all item in list
                                    renderItem={({ item, index }) => <UserTradeListDetailItem
                                        index={index}
                                        item={item}
                                        size={finalItems.length}
                                        onDetail={() => this.props.navigation.navigate('UserTradeDisplayDetailsScreen', { item: item, title: this.state.title })}
                                    />
                                    }
                                    // assign index as key value to arbitrage trading summery lp wise list item
                                    keyExtractor={(_item, index) => index.toString()}
                                    // For Refresh Functionality In arbitrage trading summery lp wise FlatList Item
                                    refreshControl={
                                        <RefreshControl
                                            colors={[R.colors.accent]}
                                            refreshing={this.state.refreshing}
                                            onRefresh={this.onRefresh}
                                            progressBackgroundColor={R.colors.background}
                                        />
                                    }
                                    contentContainerStyle={contentContainerStyle(finalItems)}
                                    // Displayed empty component when no record found 
                                    ListEmptyComponent={<ListEmptyComponent />}
                                />
                        }

                        {/*To Set Pagination View  */}
                        <View>
                            {
                                finalItems.length > 0 &&
                                <PaginationWidget row={this.state.row} selectedPage={this.state.selectedPage} onPageChange={(item) => { this.onPageChange(item) }} />
                            }
                        </View>
                    </View>
                </SafeView>
            </Drawer>
        )
    }
}

// This Class is used for display record in list
class UserTradeListDetailItem extends Component {

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        //Check If Old Props and New Props are Equal then Return False
        if (this.props.item === nextProps.item)
            return false
        return true
    }

    render() {  
        // Set status Color based on type
        let statusColor = R.colors.accent;

        let { item: { TrnNo, MemberID, Type, PairName, DateTime, Amount, Total, OrderType, ProviderName }, index, size, onDetail } = this.props;
        if (Type === "BUY") {statusColor = R.colors.successGreen;} else {
            statusColor = R.colors.failRed; }

        return (
            // Flatlist item animation
            <AnimatableItem>
                <View style={{
                    marginLeft: R.dimens.widget_left_right_margin,marginRight: R.dimens.widget_left_right_margin,
                    flex: 1,marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                }}>

                    <CardView style={{elevation: R.dimens.listCardElevation,
                        borderBottomLeftRadius: R.dimens.margin, borderTopRightRadius: R.dimens.margin,
                        flex: 1, borderRadius: 0,
                    }} onPress={onDetail}>

                        {/* for show PairName, Type and OrderType */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', alignContent: 'center' }}>
                                <TextViewMR style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText }}>
                                    {PairName.replace('_', '/')}</TextViewMR>
                                <TextViewMR style={{
                                    color: statusColor, fontSize: R.dimens.smallText,
                                    marginLeft: R.dimens.widgetMargin
                                }}>{Type}</TextViewMR>
                                <TextViewMR style={{ fontSize: R.dimens.smallestText, color: statusColor }}>
                                    {' - '}{OrderType ? OrderType.toUpperCase() : '-'}</TextViewMR>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <TextViewMR style={{ fontSize: R.dimens.smallText, color: R.colors.yellow }}>{validateValue(ProviderName)}</TextViewMR>
                                <ImageTextButton
                                    icon={R.images.RIGHT_ARROW_DOUBLE}
                                    style={{ margin: 0 }}
                                    iconStyle={{
                                        width: R.dimens.dashboardMenuIcon,
                                        height: R.dimens.dashboardMenuIcon,
                                        tintColor: R.colors.textPrimary
                                    }}
                                    onPress={onDetail} />
                            </View>
                        </View>

                        {/* for show userid, Amount and Total */}
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <TextViewHML style={{
                                    fontSize: R.dimens.smallestText,
                                    color: R.colors.textSecondary,
                                }}>{R.strings.userid}</TextViewHML>
                                <TextViewHML style={{
                                    fontSize: R.dimens.smallText,
                                    color: R.colors.textPrimary,
                                }}>{MemberID ? MemberID : '-'}</TextViewHML>
                            </View>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.Amount}</TextViewHML>
                                <TextViewHML style={{
                                    fontSize: R.dimens.smallText,
                                    color: R.colors.textPrimary,
                                }}>{Amount.toFixed(8)}</TextViewHML>
                            </View>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.total}</TextViewHML>
                                <TextViewHML style={{
                                    fontSize: R.dimens.smallText,
                                    color: R.colors.textPrimary,
                                }}>{Total.toFixed(8)}</TextViewHML>
                            </View>
                        </View>

                        {/* for show TrnNo */}
                        <View style={{ marginTop: R.dimens.widgetMargin }}>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textSecondary, }}>{R.strings.Trn_No.toUpperCase()}</TextViewHML>
                                <Separator style={{ flex: 1, justifyContent: 'center', }} />
                            </View>
                            <TextViewHML style={{ flex: 1, fontSize: R.dimens.smallText, color: R.colors.yellow, marginLeft: R.dimens.margin }}>{validateValue(TrnNo)}</TextViewHML>
                        </View>

                        {/* for show DateTime */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <ImageTextButton
                                style={{ margin: 0, paddingRight: R.dimens.LineHeight, }}
                                icon={R.images.IC_TIMER}
                                iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
                            />
                            <TextViewHML style={{
                                color: R.colors.textSecondary,
                                fontSize: R.dimens.smallestText,
                            }}>{DateTime ? convertDate(DateTime) + ' ' + convertTime(DateTime) : '-'}</TextViewHML>
                        </View>
                    </CardView>
                </View >
            </AnimatableItem >
        )
    }
}

const mapStateToProps = (state) => {
    return {
        // get arbitrage trading summery lp wise data from reducer
        TradeSummeryResult: state.ArbiTradingSummaryLpWiseReducer,
    }
}

const mapDispatchToProps = (dispatch) => ({
    // Perform arbitrage trading summery lp wise Action
    getArbitrageTradingSummeryList: (payload) => dispatch(getArbitrageTradingSummeryList(payload)),
    // Clear arbitrage trading summery lp wise Data Action
    clearArbitrageTradingSummeryListData: () => dispatch(clearArbitrageTradingSummeryListData()),
    // List Currency Action
    getListPairArbitrage: () => dispatch(getListPairArbitrage()),
})

export default connect(mapStateToProps, mapDispatchToProps)(UserTradeListDetailsDisplayScreen)