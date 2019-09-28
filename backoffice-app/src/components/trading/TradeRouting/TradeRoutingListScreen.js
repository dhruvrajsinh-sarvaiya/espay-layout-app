import React, { Component } from 'react';
import { View, FlatList, Easing, RefreshControl } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import ListLoader from '../../../native_theme/components/ListLoader';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import { changeTheme, parseArray, getCurrentDate, convertDate, addPages, convertTime } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew, validateValue } from '../../../validations/CommonValidation';
import { isCurrentScreen, addRouteToBackPress } from '../../Navigation';
import { connect } from 'react-redux';
import Drawer from 'react-native-drawer-menu';
import { DateValidation } from '../../../validations/DateValidation';
import { getPairList, getUserDataList } from '../../../actions/PairListAction';
import { getTradingSummaryLPWiseList, clearTradingSummaryLPWiseList } from '../../../actions/Trading/TradeRoutingAction';
import { AppConfig } from '../../../controllers/AppConfig';
import PaginationWidget from '../../widget/PaginationWidget'
import R from '../../../native_theme/R';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import FilterWidget from '../../widget/FilterWidget';
import CardView from '../../../native_theme/components/CardView';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import SafeView from '../../../native_theme/components/SafeView';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import Separator from '../../../native_theme/components/Separator';

class TradeRoutingListScreen extends Component {

    constructor(props) {
        super(props);

        //Create reference
        this.drawer = React.createRef();
        this.toast = React.createRef();

        //Define all initial state
        this.state = {
            title: R.strings.tradeRouting,
            refreshing: false,
            search: '',
            response: [],
            isFirstTime: true,

            //Filter
            fromDate: getCurrentDate(),
            toDate: getCurrentDate(),
            transactionNo: '',

            //Users Picker
            users: [{ value: R.strings.Please_Select }],
            selectedUser: R.strings.Please_Select,
            selectedUserId: '',

            //LPType Picker
            lpTypes: [
                { value: R.strings.Please_Select },
                { value: 'Binance', code: 9 },
                { value: 'Bitrex', code: 10 },
                { value: 'TradeSatoshi', code: 11 },
                { value: 'Poloniex', code: 12 },
                { value: 'Coinbase', code: 13 },
                { value: 'ERC20Withdraw', code: 14 },
                { value: 'Twilio', code: 15 }
            ],
            selectedLPType: R.strings.Please_Select,
            selectedLPTypeCode: '',

            //Type Picker
            type: [{ value: R.strings.Please_Select }, { value: 'buy', code: 'buy' }, { value: 'sell', code: 'sell' }],
            selectedType: R.strings.Please_Select,
            selectedTypeCode: '',

            //Currency Pair Picker
            currencyPairs: [{ value: R.strings.all }],
            selectedCurrencyPair: R.strings.all,

            //Order Type Picker
            marketTypes: [{ value: R.strings.Please_Select, code: '' }, { value: R.strings.limit, code: 'LIMIT' }, { value: R.strings.market, code: 'MARKET' }, { value: R.strings.stopLimit, code: 'STOP_Limit' }, { value: R.strings.spot, code: 'SPOT' }],
            selectedMarketType: R.strings.Please_Select,
            selectedMarketTypeCode: '',

            //For pagination
            row: [],
            selectedPage: 1,
            PageSize: AppConfig.pageSize,

            //For Drawer First Time Close
            isDrawerOpen: false,
        };

        //Bind all methods

        this.onBackPress = this.onBackPress.bind(this);

        //add current route for backpress handle

        addRouteToBackPress(props, this.onBackPress);

        this.props.navigation.setParams({ onBackPress: this.onBackPress });
    }

    onBackPress() 
    {
        if (this.state.isDrawerOpen) 
        {
            this.drawer.closeDrawer();
            this.setState({ isDrawerOpen: false })
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

            //to get pair list
            this.props.getCurrencyPairs({});

            //To get all users
            this.props.getUserDataList();

            //initial request
            let request = {
                FromDate: getCurrentDate(),
                ToDate: getCurrentDate(),
                PageNo: 0,
                PageSize: this.state.PageSize,
            }

            //To get trading summary lp wise list
            this.props.getTradeRoutingList(request);
        }
    };

    shouldComponentUpdate = (nextProps, _nextState) => {
        //For stop twice api call
        return isCurrentScreen(nextProps);
    };

    componentWillUnmount = () => {
        //for Data clear on Backpress
        this.props.clearTradeRoutingData();
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
        if (TradeRoutingListScreen.oldProps !== props) {
            TradeRoutingListScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            const { tradeSummaryLPWiseData, pairList, userData } = props.data;

            if (tradeSummaryLPWiseData) {
                try {
                    //if local tradeSummaryLPWiseData state is null or its not null and also different then new response then and only then validate response.
                    if (state.tradeSummaryLPWiseData == null || (state.tradeSummaryLPWiseData != null && tradeSummaryLPWiseData !== state.tradeSummaryLPWiseData)) {

                        //if tradeSettledData response is success then store array list else store empty list
                        if (validateResponseNew({ response: tradeSummaryLPWiseData, isList: true })) {
                            let res = parseArray(tradeSummaryLPWiseData.Response);
                            return { ...state, tradeSummaryLPWiseData, response: res, refreshing: false, row: addPages(tradeSummaryLPWiseData.TotalCount) };
                        } else {
                            return { ...state, tradeSummaryLPWiseData, response: [], refreshing: false, row: [] };
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

                        //if  response is success then store array list else store empty list
                        if (validateResponseNew({ response: pairList, isList: true })) {
                            let res = parseArray(pairList.Response);

                            res.map((item, index) => {
                                res[index].value = item.PairName;
                            })

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

            if (userData) {
                try {
                    //if local userData state is null or its not null and also different then new response then and only then validate response.
                    if (state.userData == null || (state.userData != null && userData !== state.userData)) {

                        //if  response is success then store array list else store empty list
                        if (validateResponseNew({ response: userData, isList: true })) {
                            let res = parseArray(userData.GetUserData);

                            res.map((item, index) => {
                                res[index].value = item.UserName;
                            })

                            let users = [
                                { value: R.strings.Please_Select },
                                ...res
                            ];

                            return { ...state, pairList, users };
                        } else {
                            return { ...state, pairList, users: [{ value: R.strings.Please_Select }] };
                        }
                    }
                } catch (e) {
                    return { ...state, users: [{ value: R.strings.Please_Select }] };
                }
            }
        }
        return null;
    }

    // if press on complete button then check validation and api calling
    onComplete = async () => {

        //Check All From Date and To Date Validation
        if (DateValidation(this.state.fromDate, this.state.toDate)) {
            this.toast.Show(DateValidation(this.state.fromDate, this.state.toDate));
            return;
        }

        let request = {
            FromDate: this.state.fromDate,
            ToDate: this.state.toDate,
            TrnNo: this.state.transactionNo,
            MemberID: this.state.selectedUserId,
            LPType: this.state.selectedLPTypeCode,
            Trade: this.state.selectedTypeCode,
            Pair: this.state.selectedCurrencyPair == R.strings.all ? '' : this.state.selectedCurrencyPair,
            MarketType: this.state.selectedOrderTypeCode,
            PageNo: 0,
            PageSize: this.state.PageSize,
        }

        //Check NetWork is Available or not
        if (await isInternet()) {

            //To get trading summary lp wise list
            this.props.getTradeRoutingList(request);
        }

        // Close Drawer user press on Complete button bcoz display flatlist item on Screen
        this.drawer.closeDrawer();
        this.setState({ selectedPage: 1, })
    }

    // When user press on reset button then all values are reset
    onReset = async () => {

        let request = {
            PageNo: 0,
            PageSize: this.state.page,
            FromDate: getCurrentDate(),
            ToDate: getCurrentDate(),
        };

        // Set state to original value
        this.setState({
            fromDate: getCurrentDate(),
            toDate: getCurrentDate(),
            selectedUser: R.strings.Please_Select,
            transactionNo: '',
            selectedLPType: R.strings.select_type,
            selectedType: R.strings.select_type,
            selectedCurrencyPair: R.strings.all,
            selectedOrderType: R.strings.selectOrderType,
            selectedPage: 1,
            selectedUserId: '',
            selectedLPTypeCode: '',
            selectedTypeCode: '',
            selectedOrderTypeCode: '',
        })

        // Close Drawer user press on Complete button bcoz display flatlist item on Screen
        this.drawer.closeDrawer();

        //Check NetWork is Available or not
        if (await isInternet()) {

            //To get trading summary lp wise list
            this.props.getTradeRoutingList(request);
        }
    }

    onRefresh = async () => {

        this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (await isInternet()) {

            let request = {
                FromDate: this.state.fromDate,
                ToDate: this.state.toDate,
                TrnNo: this.state.transactionNo,
                MemberID: this.state.selectedUserId,
                LPType: this.state.selectedLPTypeCode,
                Trade: this.state.selectedTypeCode,
                Pair: this.state.selectedCurrencyPair == R.strings.all ? '' : this.state.selectedCurrencyPair,
                MarketType: this.state.selectedOrderTypeCode,
                PageNo: this.state.selectedPage - 1,
                PageSize: this.state.PageSize,
            }

            //To get trading summary lp wise list
            this.props.getTradeRoutingList(request);

        } else {
            this.setState({ refreshing: false });
        }
    }

    // this method is called when page change and also api call
    onPageChange = async (pageNo) => {

        if (pageNo != this.state.selectedPage) {

            //Check NetWork is Available or not
            if (await isInternet()) {
                this.setState({ selectedPage: pageNo });

                let request = {
                    FromDate: this.state.fromDate,
                    ToDate: this.state.toDate,
                    TrnNo: this.state.transactionNo,
                    MemberID: this.state.selectedUserId,
                    LPType: this.state.selectedLPTypeCode,
                    Trade: this.state.selectedTypeCode,
                    Pair: this.state.selectedCurrencyPair == R.strings.all ? '' : this.state.selectedCurrencyPair,
                    MarketType: this.state.selectedOrderTypeCode,
                    PageNo: pageNo - 1,
                    PageSize: this.state.PageSize,
                }

                //To get trading summary lp wise list
                this.props.getTradeRoutingList(request);
            }
        }
    }

    navigationDrawer() {

        return (
            <FilterWidget
                FromDatePickerCall={(date) => this.setState({ fromDate: date })}
                ToDatePickerCall={(date) => this.setState({ toDate: date })}
                FromDate={this.state.fromDate}
                ToDate={this.state.toDate}
                toastRef={component => this.toast = component}
                textInputStyle={{ marginTop: 0, marginBottom: 0, }}
                textInputs={[
                    {
                        header: R.strings.transactionNo,
                        placeholder: R.strings.transactionNo,
                        multiline: false,
                        keyboardType: 'default',
                        returnKeyType: "done",
                        maxLength: 50,
                        onChangeText: (text) => { this.setState({ transactionNo: text }) },
                        value: this.state.transactionNo,
                    }
                ]}
                comboPickerStyle={{ marginTop: 0, }}
                pickers={[
                    {
                        title: R.strings.User,
                        array: this.state.users,
                        selectedValue: this.state.selectedUser,
                        onPickerSelect: (index, object) => this.setState({ selectedUser: index, selectedUserId: object.Id })
                    },
                    {
                        title: 'LPType',
                        array: this.state.lpTypes,
                        selectedValue: this.state.selectedLPType,
                        onPickerSelect: (index, object) => this.setState({ selectedLPType: index, selectedLPTypeCode: object.code })
                    },
                    {
                        title: R.strings.type,
                        array: this.state.type,
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
                        title: R.strings.selectOrderType,
                        array: this.state.marketTypes,
                        selectedValue: this.state.selectedMarketType,
                        onPickerSelect: (index, object) => this.setState({ selectedMarketType: index, selectedMarketTypeCode: object.code })
                    }
                ]
                }
                onResetPress={this.onReset}
                onCompletePress={this.onComplete}
            />
        )
    }

    render() {

        let filteredList = [];

        //for search
        if (this.state.response.length) 
        {
            filteredList = this.state.response.filter(item =>
                (
                    item.OrderType.toLowerCase().includes(this.state.search.toLowerCase()) ||
                    item.Type.toLowerCase().includes(this.state.search.toLowerCase()) ||
                    item.TrnNo.toString().includes(this.state.search) ||
                    item.PairName.replace('_', '/').toLowerCase().includes(this.state.search.toLowerCase()) ||
                    item.MemberID.toString().includes(this.state.search)
                ));
        }

        return (
            <Drawer ref={component => this.drawer = component} drawerWidth={R.dimens.FilterDrawarWidth}
                onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
                type={Drawer.types.Overlay}
                onDrawerClose={() => this.setState({ isDrawerOpen: false })}
                drawerPosition={Drawer.positions.Right}
                drawerContent={this.navigationDrawer()}
                easingFunc={Easing.ease}>

                <SafeView style={this.styles().container}>

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
                        onBackPress={this.onBackPress} />

                    <View style={{ flex: 1, justifyContent: 'space-between' }}>

                        {(this.props.data.isFetchingTradeSummaryLPWise && !this.state.refreshing)
                            ?
                            <ListLoader />
                            :
                            filteredList.length > 0 ?
                                <FlatList
                                    data={filteredList}
                                    extraData={this.state}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={({ item, index }) =>
                                        <TradeRoutingListItem
                                            index={index}
                                            item={item}
                                            onPress={() => this.props.navigation.navigate('TradeRoutingListDetailScreen', { item })}
                                            size={this.state.response.length} />
                                    }
                                    keyExtractor={(_item, index) => index.toString()}
                                    refreshControl={
                                    <RefreshControl
                                        colors={[R.colors.accent]}
                                        progressBackgroundColor={R.colors.background}
                                        refreshing={this.state.refreshing}
                                        onRefresh={this.onRefresh}
                                    />
                                }
                                />
                                :
                                <ListEmptyComponent />
                        }
                        {/*To Set Pagination View  */}
                        <View>
                            {filteredList.length > 0 
                                && <PaginationWidget 
                                row={this.state.row} 
                                selectedPage={this.state.selectedPage} onPageChange={(item) => { this.onPageChange(item) }} />}
                        </View>
                    </View>
                </SafeView>
            </Drawer>
        );
    }

    styles = () => {
        return {
            container: {
                backgroundColor: R.colors.background,
                flex: 1,
            },
        }
    }
}

// This Class is used for display record in list
class TradeRoutingListItem extends Component {
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
        let { item: { TrnNo, MemberID, Type, PairName, DateTime, Price, Amount, OrderType }, onPress, index, size } = this.props;
        let statusColor = R.colors.accent;

        //for set status  color based on order type
        if (Type === 'BUY') {
            statusColor = R.colors.successGreen;
        } else {
            statusColor = R.colors.failRed;
        }

        return (
            <AnimatableItem>
                <View 
                style={{  flexDirection: 'column',  marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    flex: 1,
                    marginLeft: R.dimens.widget_left_right_margin,
                    marginRight: R.dimens.widget_left_right_margin
                }}>
                    <CardView style={{  elevation: R.dimens.listCardElevation,  flex: 1,
                        flexDirection: 'column',
                        borderBottomLeftRadius: R.dimens.margin,
                        borderTopRightRadius: R.dimens.margin,
                        borderRadius: 0,
                    }} onPress={onPress}>
                        <View>
                            {/* for show PairName, Type and OrderType */}
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', alignContent: 'center' }}>
                                    <TextViewMR style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText }}>{PairName ? PairName.replace('_', '/') : '-'}</TextViewMR>
                                    <TextViewMR style={{ color: statusColor, fontSize: R.dimens.smallText, marginLeft: R.dimens.widgetMargin }}>{Type ? Type : '-'}</TextViewMR>
                                    <TextViewMR style={{ fontSize: R.dimens.smallestText, color: statusColor }}>{' - '}{OrderType ? OrderType.toUpperCase() : '-'}</TextViewMR>
                                </View>
                                <ImageTextButton
                                    icon={R.images.RIGHT_ARROW_DOUBLE}
                                    onPress={onPress}
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
                                    <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.price}</TextViewHML>
                                    <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, }}>{Price.toFixed(8)}</TextViewHML>
                                </View>
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.Amount}</TextViewHML>
                                    <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, }}>{Amount.toFixed(8)}</TextViewHML>
                                </View>
                            </View>

                            {/* for show TrnNo */}
                            <View style={{ marginTop: R.dimens.widgetMargin }}>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textSecondary, }}>{R.strings.Trn_No.toUpperCase()}</TextViewHML>
                                    <Separator style={{ flex: 1, justifyContent: 'center', }} />
                                </View>
                                <TextViewHML style={{ flex: 1, fontSize: R.dimens.smallText, color: R.colors.yellow, }}>{validateValue(TrnNo)}</TextViewHML>
                            </View>

                            {/* for show date and time */}
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                                <ImageTextButton
                                    style={{ margin: 0, paddingRight: R.dimens.LineHeight, }}
                                    icon={R.images.IC_TIMER}
                                    iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
                                />
                                <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{DateTime ? convertDate(DateTime) + ' ' + convertTime(DateTime) : '-'}</TextViewHML>
                            </View>
                        </View>
                    </CardView>
                </View>
            </AnimatableItem>
        )
    }
}

function mapStatToProps(state) {
    //Updated Data For Trade Routing Data 
    let data = {
        ...state.TradeRoutingReducer,
        ...state.pairListReducer
    }
    return { data }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform getTradeRoutingList Action 
        getTradeRoutingList: (payload) => dispatch(getTradingSummaryLPWiseList(payload)),
        //Perform getCurrencyPairs Action 
        getCurrencyPairs: (payload) => dispatch(getPairList(payload)),
        //Perform getUserDataList Action 
        getUserDataList: () => dispatch(getUserDataList()),
        //Perform clearTradeRoutingData Action 
        clearTradeRoutingData: () => dispatch(clearTradingSummaryLPWiseList())
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(TradeRoutingListScreen);