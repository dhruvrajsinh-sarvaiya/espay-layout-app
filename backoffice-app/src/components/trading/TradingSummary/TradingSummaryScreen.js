import React, { Component } from 'react';
import { View, FlatList, Easing, RefreshControl } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import ListLoader from '../../../native_theme/components/ListLoader';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { changeTheme, parseArray, getCurrentDate, addPages, convertDateTime } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew, validateValue } from '../../../validations/CommonValidation';
import { isCurrentScreen, addRouteToBackPress } from '../../../components/Navigation';
import { connect } from 'react-redux';
import Drawer from 'react-native-drawer-menu';
import { getPairList } from '../../../actions/PairListAction';
import { getTradingSettledList, clearAllTradeList } from '../../../actions/Trading/TradingSummaryActions';
import { AppConfig } from '../../../controllers/AppConfig';
import PaginationWidget from '../../widget/PaginationWidget'
import R from '../../../native_theme/R';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import FilterWidget from '../../widget/FilterWidget';
import CardView from '../../../native_theme/components/CardView';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import Separator from '../../../native_theme/components/Separator';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import SafeView from '../../../native_theme/components/SafeView';

class TradingSummaryScreen extends Component {

    constructor(props) {
        super(props);

        //Create reference
        this.drawer = React.createRef();
        this.progressDialog = React.createRef();
        this.toast = React.createRef();

        //Store data from previous screen
        let orderType = props.navigation.state.params ? props.navigation.state.params.orderType : '';
        let isMargin = props.navigation.state.params ? props.navigation.state.params.isMargin : '';
        let selectedOrderType = R.strings.selectOrderType;
        let storedSelectedOrderType = '';

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

        this.orerType = orderType;

        //initial request
        this.request = {
            FromDate: getCurrentDate(),
            ToDate: getCurrentDate(),
            MarketType: orderType,
            PageNo: 0,
            PageSize: AppConfig.pageSize,
        }
        //Bind all methods
        this.onBackPress = this.onBackPress.bind(this);

        //Define all initial state
        this.state = {
            title: R.strings.TradeSummary,
            //Filter
            fromDate: getCurrentDate(),
            toDate: getCurrentDate(),
            userid: '',
            transactionNo: '',

            refreshing: false,
            search: '',
            response: [],

            //pickers
            type: [{ value: R.strings.select_type }, { value: R.strings.buy, code: 'buy' }, { value: R.strings.sell, code: 'sell' }],
            selectedType: R.strings.select_type,
            selectedTypeCode: '',

            isFirstTime: true,
            isDrawerOpen: false,
            isMargin: isMargin,

            currencyPairs: [{ value: R.strings.all }],
            selectedCurrencyPair: R.strings.all,

            row: [],
            selectedPage: 1,

            orderTypes: [{ value: R.strings.limit, code: 'LIMIT' }, { value: R.strings.market, code: 'MARKET' }, { value: R.strings.stopLimit, code: 'STOP_Limit' }, { value: R.strings.spot, code: 'SPOT' }],
            selectedOrderType: selectedOrderType,
            storedTypeText: selectedOrderType,
            storedSelectedOrderType: storedSelectedOrderType,
            selectedOrderTypeCode: storedSelectedOrderType,

        };


        //add current route to backpress
        addRouteToBackPress(props, this.onBackPress);
        this.props.navigation.setParams({ onBackPress: this.onBackPress });
    }

    // If drawer is open then first, it will close the drawer and after it will return to previous screen
    onBackPress() {
        if (this.state.isDrawerOpen) {
            this.setState({ isDrawerOpen: false })
            this.drawer.closeDrawer();
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

            if (this.state.isMargin) {
                this.request = {
                    ...this.request,
                    IsMargin: 1
                }

                //To get trading settled list
                this.props.getTradingSettledList(this.request);

                //to get pair list
                this.props.getCurrencyPairs({ IsMargin: 1 });
            } else {

                //to get pair list
                this.props.getCurrencyPairs({});

                //To get trading settled list
                this.props.getTradingSettledList(this.request);
            }
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {

        //stop twice api call
        return isCurrentScreen(nextProps);
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
        if (TradingSummaryScreen.oldProps !== props) {
            TradingSummaryScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            const { tradeSettledData, pairList } = props.data;

            if (tradeSettledData) {
                try {
                    //if local tradeSettledData state is null or its not null and also different then new response then and only then validate response.
                    if (state.tradeSettledData == null || (state.tradeSettledData != null && tradeSettledData !== state.tradeSettledData)) {

                        //if tradeSettledData response is success then store array list else store empty list
                        if (validateResponseNew({ response: tradeSettledData, isList: true })) {

                            // Parsing response
                            let res = parseArray(tradeSettledData.Response);

                            return { ...state, tradeSettledData, response: res, refreshing: false, row: addPages(tradeSettledData.TotalCount) };
                        } else {
                            return { ...state, tradeSettledData, response: [], refreshing: false, row: [] };
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
                            // Parsing response
                            let res = parseArray(pairList.Response);

                            // fetching only PairName from PairName
                            for (var pairItemList in res) {

                                let item = res[pairItemList]

                                item.value = item.PairName
                            }

                            let currencyPairs = [
                                {
                                    value: R.strings.all
                                },
                                ...res
                            ];

                            return {
                                ...state,
                                pairList, currencyPairs
                            };
                        } else {
                            return {
                                ...state, pairList,
                                currencyPairs: [
                                    { value: R.strings.all }
                                ]
                            };
                        }
                    }
                } catch (e) {
                    return {
                        ...state,
                        currencyPairs: [
                            { value: R.strings.all }
                        ]
                    };
                }
            }
        }
        return null;
    }

    // if press on complete button then check validation and api calling

    onComplete = async () => {

        this.request = {
            ...this.request,
            FromDate: this.state.fromDate,
            ToDate: this.state.toDate,
            TrnNo: this.state.transactionNo,
            MemberID: this.state.userid,
            Trade: this.state.selectedTypeCode,
            Pair: this.state.selectedCurrencyPair == R.strings.all ? '' : this.state.selectedCurrencyPair,
            MarketType: this.state.selectedOrderTypeCode,
            PageNo: 0,
        }

        //Check NetWork is Available or not
        if (await isInternet()) {
            if (this.state.isMargin) {
                this.request = {
                    ...this.request,
                    IsMargin: 1
                }

                //To get trading settled list
                this.props.getTradingSettledList(this.request);
            } else {

                //To get trading settled list
                this.props.getTradingSettledList(this.request);
            }
        } else {
            this.setState({ refreshing: false });
        }

        /* Close Drawer user press on Complete button bcoz display flatlist item on Screen */
        this.drawer.closeDrawer();
        this.setState({ selectedPage: 1, })
    }

    // When user press on reset button then all values are reset
    onReset = async () => {

        /* Set state to original value */
        this.setState({
            fromDate: getCurrentDate(),
            toDate: getCurrentDate(),
            transactionNo: '',
            userid: '',
            selectedType: R.strings.select_type,
            selectedCurrency: R.strings.selectCurrency,
            selectedOrderType: this.state.storedTypeText,
            selectedPage: 1,
            selectedOrderTypeCode: '',
            selectedTypeCode: '',
        })

        // Close Drawer user press on Complete button bcoz display flatlist item on Screen
        this.drawer.closeDrawer();

        //Check NetWork is Available or not
        if (await isInternet()) {

            this.request = {
                FromDate: getCurrentDate(),
                ToDate: getCurrentDate(),
                PageNo: 0,
                PageSize: AppConfig.pageSize,
                MarketType: this.state.storedSelectedOrderType,
            }

            if (this.state.isMargin) {
                this.request = {
                    ...this.request,
                    IsMargin: 1
                }

                //To get trading settled list
                this.props.getTradingSettledList(this.request);
            } else {

                //To get trading settled list
                this.props.getTradingSettledList(this.request);
            }
        } else {
            this.setState({ refreshing: false })
        }
    }

    onRefresh = async () => {

        this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (await isInternet()) {

            // request for trading settled list
            this.request = {
                Trade: this.state.selectedTypeCode,
                Pair: this.state.selectedCurrencyPair == R.strings.all ? '' : this.state.selectedCurrencyPair,
                MarketType: this.state.selectedOrderTypeCode,
                PageNo: this.state.selectedPage - 1,
                FromDate: this.state.fromDate,
                ToDate: this.state.toDate,
                TrnNo: this.state.transactionNo,
                MemberID: this.state.userid,
            }

            if (this.state.isMargin) {
                this.request = {
                    ...this.request, IsMargin: 1
                }

                //To get trading settled list

                this.props.getTradingSettledList(this.request);
            } else {

                //To get trading settled list

                this.props.getTradingSettledList(this.request);
            }

        } else {
            this.setState(
                { refreshing: false }
            );
        }
    }

    // this method is called when page change and also api call
    onPageChange = async (pageNo) => {

        //if selected page is diifferent than call api
        if (pageNo != this.state.selectedPage) {

            //Check NetWork is Available or not
            if (await isInternet()) {
                this.setState({ selectedPage: pageNo });

                // request for trading settled list
                this.request = {
                    ...this.request,
                    FromDate: this.state.fromDate,
                    ToDate: this.state.toDate,
                    TrnNo: this.state.transactionNo,
                    MemberID: this.state.userid,
                    Trade: this.state.selectedTypeCode,
                    Pair: this.state.selectedCurrencyPair == R.strings.all ? '' : this.state.selectedCurrencyPair,
                    MarketType: this.state.selectedOrderTypeCode,
                    PageNo: this.state.selectedPage - 1,
                }

                if (this.state.isMargin) {
                    this.request = {
                        ...this.request,
                        IsMargin: 1
                    }

                    //To get trading settled list
                    this.props.getTradingSettledList(this.request);
                } else {

                    //To get trading settled list
                    this.props.getTradingSettledList(this.request);
                }

            } else {
                this.setState({ refreshing: false })
            }
        }
    }

    navigationDrawer() {
        // For show filter of fromdate, todate,userid and transactionNo data etc      
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
                        returnKeyType: "next",
                        maxLength: 50,
                        onChangeText: (text) => { this.setState({ userid: text }) },
                        header: R.strings.userid,
                        placeholder: R.strings.userid,
                        value: this.state.userid,
                        multiline: false,
                        keyboardType: 'default',
                    },
                    {
                        maxLength: 50,
                        header: R.strings.transactionNo,
                        onChangeText: (text) => { this.setState({ transactionNo: text }) },
                        value: this.state.transactionNo,
                        placeholder: R.strings.transactionNo,
                        multiline: false,
                        keyboardType: 'default',
                        returnKeyType: "done",
                    }
                ]}
                comboPickerStyle={{ marginTop: 0, }}
                pickers={[
                    {
                        title: R.strings.type,
                        array: this.state.type,
                        selectedValue: this.state.selectedType,
                        onPickerSelect: (index, object) => this.setState(
                            { selectedType: index, selectedTypeCode: object.code, }
                        )
                    },
                    {
                        title: R.strings.currencyPair,
                        array: this.state.currencyPairs,
                        selectedValue: this.state.selectedCurrencyPair,
                        onPickerSelect: (item) => this.setState({ selectedCurrencyPair: item })
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

    componentWillUnmount() {

        //for clear data 
        this.props.clearAllTradeList();
    }

    render() {
        let filteredList = [];

        // For searching functionality
        if (this.state.response.length) {
            filteredList = this.state.response.filter(item => (
                item.PairName.replace('_', '/').toLowerCase().includes(this.state.search.toLowerCase()) ||
                item.TrnType.toLowerCase().includes(this.state.search.toLowerCase()) || item.OrderType.toLowerCase().includes(this.state.search.toLowerCase()) ||
                item.TrnNo.toString().includes(this.state.search) || item.MemberID.toString().includes(this.state.search)
            ));
        }

        return (
            // DrawerLayout for Filteration
            <Drawer
                onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
                ref={component => this.drawer = component}
                drawerWidth={R.dimens.FilterDrawarWidth}
                onDrawerClose={() => this.setState({ isDrawerOpen: false })}
                easingFunc={Easing.ease}
                type={Drawer.types.Overlay}
                drawerPosition={Drawer.positions.Right}
                drawerContent={this.navigationDrawer()}
            >

                <SafeView style={{
                    flex: 1,
                    backgroundColor: R.colors.background,
                }}>

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

                    {/* Progress Dialog */}
                    <ProgressDialog ref={component => this.progressDialog = component} />

                    <View style={{ flex: 1, justifyContent: 'space-between' }}>

                        {/* Progress */}
                        {(this.props.data.isLoadingTradeSettled && !this.state.refreshing)
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
                                        <TradingSummaryItem
                                            onPress={() => this.props.navigation.navigate('TradingSummaryDetailScreen', { item })}
                                            index={index}
                                            item={item}
                                            size={this.state.response.length} />
                                    }
                                    // assign index as key value to list item
                                    keyExtractor={(_item, index) => index.toString()}
                                    // Refresh functionality in list

                                    refreshControl={<RefreshControl
                                        progressBackgroundColor={R.colors.background}
                                        refreshing={this.state.refreshing}
                                        onRefresh={this.onRefresh}
                                        colors={[R.colors.accent]}
                                    />}
                                /> :
                                // Displayed empty component when no record found 
                                <ListEmptyComponent />
                        }
                    </View>

                    {/*To Set Pagination View  */}
                    <View>
                        {filteredList.length > 0 && <PaginationWidget row={this.state.row} selectedPage={this.state.selectedPage} onPageChange={(item) => { this.onPageChange(item) }} />}
                    </View>
                </SafeView>
            </Drawer>
        );
    }
}

// This Class is used for display record in list
class TradingSummaryItem extends Component {
    constructor(props) {
        super(props);

    }

    shouldComponentUpdate(nextProps) {
        // If new props and old props are equal then it will return false otherwise it will return true
        if (this.props.item === nextProps.item)
            return false
        return true
    }

    render() {
        let { item:
            { TrnNo, MemberID, TrnType, PairName,
                TrnDate, Qty, Price, OrderType },
            onPress, size, index } = this.props;
        return (
            // Flatlist item animation
            <AnimatableItem>
                <View style={{
                    flex: 1, marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginRight: R.dimens.widget_left_right_margin,
                    marginLeft: R.dimens.widget_left_right_margin,
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                }}>

                    <CardView style={{
                        flex: 1, borderBottomLeftRadius: R.dimens.margin,
                        borderRadius: 0, elevation: R.dimens.listCardElevation,
                        borderTopRightRadius: R.dimens.margin,
                    }} onPress={onPress}>
                        <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                                {/* for show PairName, Type and OrderType */}
                                <View style={{ flexDirection: 'row', alignItems: 'center', alignContent: 'center' }}>
                                    <TextViewMR style={{ color: R.colors.listSeprator, fontSize: R.dimens.smallText }}>{PairName ? PairName.replace('_', '/') : '-'}</TextViewMR>
                                    <TextViewMR style={{ color: TrnType.toLowerCase().includes(R.strings.buy.toLowerCase()) ? R.colors.buyerGreen : R.colors.sellerPink, fontSize: R.dimens.smallText, marginLeft: R.dimens.widgetMargin }}>{TrnType ? TrnType : '-'}</TextViewMR>
                                    <TextViewMR style={{ fontSize: R.dimens.smallestText, color: TrnType.toLowerCase().includes(R.strings.buy.toLowerCase()) ? R.colors.buyerGreen : R.colors.sellerPink }}>{' - '}{OrderType ? OrderType : '-'}</TextViewMR>
                                </View>
                                <ImageTextButton
                                    icon={R.images.RIGHT_ARROW_DOUBLE}
                                    iconStyle={{
                                        height: R.dimens.dashboardMenuIcon,
                                        tintColor: R.colors.textPrimary,
                                        width: R.dimens.dashboardMenuIcon,
                                    }}
                                    onPress={onPress}
                                    style={{ margin: 0 }}
                                     />
                            </View>

                            {/* for show MemberID, Amount and Total */}
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.userId}</TextViewHML>
                                    <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, }}>{MemberID}</TextViewHML>
                                </View>
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.Qty}</TextViewHML>
                                    <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, }}>{Qty.toFixed(8)}</TextViewHML>
                                </View>
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.Price}</TextViewHML>
                                    <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, }}>{Price.toFixed(8)}</TextViewHML>
                                </View>
                            </View>

                            {/* for show TrnNo */}
                            <View style={{ marginTop: R.dimens.widgetMargin }}>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textSecondary, }}>{R.strings.Trn_No.toUpperCase()}</TextViewHML>
                                    <Separator style={{ flex: 1, justifyContent: 'center', }} />
                                </View>
                                <TextViewHML style={{ flex: 1, marginLeft: R.dimens.widget_left_right_margin, fontSize: R.dimens.smallText, color: R.colors.yellow, }}>{validateValue(TrnNo)}</TextViewHML>
                            </View>

                            {/* for show date and time */}
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                                <ImageTextButton
                                    style={{ margin: 0, paddingRight: R.dimens.LineHeight, }}
                                    icon={R.images.IC_TIMER}
                                    iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
                                />
                                <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{validateValue(convertDateTime(TrnDate))}</TextViewHML>
                            </View>
                        </View>
                    </CardView>
                </View>
            </AnimatableItem>
        )
    }
}

function mapStatToProps(state) {
    //Updated data for margin trading summary list action data
    let data = {
        ...state.tradingSummaryReducer,
        ...state.pairListReducer
    }
    return { data }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform action for getTradingSettledList action for get TradingSettledList api
        getTradingSettledList: (payload) => dispatch(getTradingSettledList(payload)),
        //Perform action for getCurrencyPairs action for get Pair list api
        getCurrencyPairs: (payload) => dispatch(getPairList(payload)),
        //Perform action for clear data 
        clearAllTradeList: () => dispatch(clearAllTradeList()),
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(TradingSummaryScreen);