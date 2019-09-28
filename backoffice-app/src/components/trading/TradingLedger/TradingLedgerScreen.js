import React, { Component } from 'react';
import { View, FlatList, Easing, RefreshControl, } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import ListLoader from '../../../native_theme/components/ListLoader';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import { changeTheme, parseArray, getCurrentDate, addPages, convertDateTime, parseFloatVal } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew, validateValue, isEmpty } from '../../../validations/CommonValidation';
import { isCurrentScreen, addRouteToBackPress } from '../../../components/Navigation';
import { connect } from 'react-redux';
import Drawer from 'react-native-drawer-menu';
import { DateValidation } from '../../../validations/DateValidation';
import { getTradingLedgersBO, clearTradingLedgersData } from '../../../actions/Trading/TradingLedgerActions';
import { getPairList, getCurrencyList } from '../../../actions/PairListAction';
import R from '../../../native_theme/R';
import { AppConfig } from '../../../controllers/AppConfig';
import PaginationWidget from '../../widget/PaginationWidget'
import FilterWidget from '../../widget/FilterWidget';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import CardView from '../../../native_theme/components/CardView';
import Separator from '../../../native_theme/components/Separator';
import StatusChip from '../../widget/StatusChip';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import SafeView from '../../../native_theme/components/SafeView';

class TradingLedgerScreen extends Component {

    constructor(props) {
        super(props);

        // create reference
        this.drawer = React.createRef();
        this.toast = React.createRef();

        //screenType  1 for trading ledger , screenType 2 for margin trading history
        let screenType = props.navigation.state.params && props.navigation.state.params.screenType

        //screenType  1 for trading ledger , screenType 2 for margin trading history
        let titleScreen

        if (screenType == 1)
            titleScreen = R.strings.tradingLedgerReport
        else if (screenType == 2)
            titleScreen = R.strings.marginTradingHistory

        // Define all initial state
        this.state = {
            titleScreen: titleScreen,
            screenType: screenType,

            refreshing: false,
            search: '',
            response: [],

            fromDate: getCurrentDate(),
            toDate: getCurrentDate(),
            userid: '',
            transactionNo: '',

            type: [{ value: R.strings.select_type }, { value: R.strings.buy, code: 'buy' }, { value: R.strings.sell, code: 'sell' }],
            selectedType: R.strings.select_type,
            selectedTypeId: '',

            currencyPairs: [{ value: R.strings.all }],
            selectedCurrencyPair: R.strings.all,

            status: [{ value: R.strings.select_status }, { value: R.strings.activeOrder, code: 95 }, { value: R.strings.partialOrder, code: 92 }, { value: R.strings.settledOrder, code: 91 }, { value: R.strings.SystemFail, code: 94 }],
            selectedStatus: R.strings.select_status,
            selectedStatusId: '',

            currencies: [{ value: R.strings.selectCurrency }],
            selectedCurrency: R.strings.selectCurrency,

            orderTypes: [{ value: R.strings.selectOrderType }, { value: R.strings.limit, code: 'LIMIT' }, { value: R.strings.market, code: 'MARKET' }, { value: R.strings.stopLimit, code: 'STOP_Limit' }, { value: R.strings.spot, code: 'SPOT' }],
            selectedOrderType: R.strings.selectOrderType,
            selectedOrderTypeId: '',

            row: [],
            selectedPage: 1,

            isFirstTime: true,
            isDrawerOpen: false,

            IsMargin: screenType == 2 ? 1 : 0,
            tradingLedgersState: null,
            pairCurrencyListState: null,
            pairListState: null,
        };

        // Bind method
        this.onBackPress = this.onBackPress.bind(this);

        addRouteToBackPress(props, this.onBackPress);
        this.props.navigation.setParams({ onBackPress: this.onBackPress });
    }

    // If drawer is open then first, it will close the drawer and after it will return to previous screen
    onBackPress() {
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
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {

            //To get callTradingLedgerApi 
            this.callTradingLedgerApi()

            //to get pair list
            this.props.getCurrencyPairs({ IsMargin: this.state.IsMargin });

            //to get currency list
            if (this.state.screenType == 1)
                this.props.getCurrencyList();
        }
    }

    //api call for list and filter reset
    callTradingLedgerApi = async () => {

        if (!this.state.isFirstTime) {
            this.setState({
                fromDate: getCurrentDate(),
                toDate: getCurrentDate(),
                transactionNo: '',
                userid: '',
                selectedType: R.strings.select_type,
                selectedStatus: R.strings.select_status,
                selectedCurrency: R.strings.selectCurrency,
                selectedOrderType: R.strings.selectOrderType,
                selectedCurrencyPair: R.strings.all,
                selectedPage: 1,
                selectedOrderTypeId: '',
                selectedStatusId: '',
                selectedTypeId: '',
            })
        }

        // Close Drawer user press on reset button bcoz display flatlist item on Screen
        this.drawer.closeDrawer();

        //Check NetWork is Available or not
        if (await isInternet()) {

            //To getTradingLedgers list
            this.props.getTradingLedgers({
                PageNo: 0,
                PageSize: AppConfig.pageSize,
                FromDate: getCurrentDate(),
                ToDate: getCurrentDate(),
                IsMargin: this.state.IsMargin
            });
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        //stop twice api call
        return isCurrentScreen(nextProps)
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
        if (TradingLedgerScreen.oldProps !== props) {
            TradingLedgerScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            const { tradingLedgers, pairList, pairCurrencyList } = props.data;

            if (tradingLedgers) {
                try {
                    //if local tradingLedgers state is null or its not null and also different then new response then and only then validate response.
                    if (state.tradingLedgersState == null || (state.tradingLedgersState != null && tradingLedgers !== state.tradingLedgersState)) {

                        //if tradingLedgers response is success then store array list else store empty list
                        if (validateResponseNew({ response: tradingLedgers, isList: true })) {

                            let res = parseArray(tradingLedgers.Response);

                            //for add status static
                            for (var keyData in res) {
                                let item = res[keyData];

                                if (item.StatusCode == 1)
                                    item.statusStatic = R.strings.Success
                                else if (item.StatusCode == 2)
                                    item.statusStatic = R.strings.Cancelled
                                else if (item.StatusCode == 3)
                                    item.statusStatic = R.strings.SystemFail
                                else if (item.StatusCode == 4)
                                    item.statusStatic = R.strings.active
                            }

                            return { ...state, tradingLedgersState: tradingLedgers, response: res, row: addPages(tradingLedgers.TotalCount), refreshing: false };
                        } else {
                            return { ...state, tradingLedgersState: tradingLedgers, response: [], refreshing: false, row: [] };
                        }
                    }
                } catch (e) {
                    return { ...state, response: [], refreshing: false, row: [] };
                }
            }

            if (pairList) {
                try {
                    //if local pairList state is null or its not null and also different then new response then and only then validate response.
                    if (state.pairListState == null || (state.pairListState != null && pairList !== state.pairListState)) {

                        //if tradingLedgers response is success then store array list else store empty list
                        if (validateResponseNew({ response: pairList, isList: true })) {
                            let res = parseArray(pairList.Response);

                            for (var pairListKey in res) {
                                let item = res[pairListKey]
                                item.value = item.PairName
                            }

                            let currencyPairs = [
                                { value: R.strings.all },
                                ...res
                            ];

                            return { ...state, pairListState: pairList, currencyPairs };
                        } else {
                            return { ...state, pairListState: pairList, currencyPairs: [{ value: R.strings.all }] };
                        }
                    }
                } catch (e) {
                    return { ...state, currencyPairs: [{ value: R.strings.all }] };
                }
            }

            if (pairCurrencyList) {
                try {
                    //if local currencyList state is null or its not null and also different then new response then and only then validate response.
                    if (state.pairCurrencyListState == null || (state.pairCurrencyListState != null && pairCurrencyList !== state.pairCurrencyListState)) {

                        //if currencyList response is success then store array list else store empty list
                        if (validateResponseNew({ response: pairCurrencyList, isList: true })) {
                            let res = parseArray(pairCurrencyList.Response);

                            for (var currencyKey in res) {
                                let item = res[currencyKey]
                                item.value = item.SMSCode
                            }

                            let currencies = [
                                { value: R.strings.selectCurrency },
                                ...res
                            ];

                            return { ...state, currencies, pairCurrencyListState: pairCurrencyList };
                        } else {
                            return { ...state, currencies: [{ value: R.strings.selectCurrency }], pairCurrencyListState: pairCurrencyList };
                        }
                    }
                } catch (e) {
                    return { ...state, currencies: [{ value: R.strings.selectCurrency }] };
                }
            }

        }
        return null;
    }

    // if press on complete button then check validation and api calling
    onComplete = async () => {

        //Check All From Date and To Date Validation
        if (DateValidation(this.state.fromDate, this.state.toDate, true)) {
            this.toast.Show(DateValidation(this.state.fromDate, this.state.toDate, true));
            return;
        }

        // check internet connection
        if (await isInternet()) {

            let request = {
                TrnNo: this.state.transactionNo,
                MemberID: this.state.userid,
                Status: this.state.selectedStatus !== R.strings.select_status ? this.state.selectedStatusId : '',
                SMSCode: this.state.selectedCurrency !== R.strings.selectCurrency ? this.state.selectedCurrency : '',
                Trade: this.state.selectedType !== R.strings.select_type ? this.state.selectedTypeId : '',
                Pair: this.state.selectedCurrencyPair == R.strings.all ? '' : this.state.selectedCurrencyPair,
                PageNo: 0,
                FromDate: this.state.fromDate,
                ToDate: this.state.toDate,
                MarketType: this.state.selectedOrderType !== R.strings.selectOrderType ? this.state.selectedOrderTypeId : '',
                IsMargin: this.state.IsMargin,
                PageSize: AppConfig.pageSize,
            }

            //To getTradingLedgers list
            this.props.getTradingLedgers(request);
        }

        /* Close Drawer user press on Complete button bcoz display flatlist item on Screen */
        this.drawer.closeDrawer();
        this.setState({ selectedPage: 1 })
    }

    /* this method is called when page change and also api call */
    onPageChange = async (pageNo) => {

        if (pageNo != this.state.selectedPage) {

            //Check NetWork is Available or not
            if (await isInternet()) {
                this.setState({ selectedPage: pageNo });

                let request = {
                    SMSCode: this.state.selectedCurrency !== R.strings.selectCurrency ? this.state.selectedCurrency : '',
                    Trade: this.state.selectedType !== R.strings.select_type ? this.state.selectedTypeId : '',
                    ToDate: this.state.toDate,
                    IsMargin: this.state.IsMargin,
                    MemberID: this.state.userid,
                    Status: this.state.selectedStatus !== R.strings.select_status ? this.state.selectedStatusId : '',
                    Pair: this.state.selectedCurrencyPair == R.strings.all ? '' : this.state.selectedCurrencyPair,
                    MarketType: this.state.selectedOrderType !== R.strings.selectOrderType ? this.state.selectedOrderTypeId : '',
                    PageNo: pageNo - 1,
                    PageSize: AppConfig.pageSize,
                    TrnNo: this.state.transactionNo,
                    FromDate: this.state.fromDate,
                }

                //To get the trading ledgers
                this.props.getTradingLedgers(request);
            } else {
                this.setState({ refreshing: false })
            }
        }
    }

    onRefresh = async () => {
        this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (await isInternet()) {

            let request = {
                MarketType: this.state.selectedOrderType !== R.strings.selectOrderType ? this.state.selectedOrderTypeId : '',
                PageNo: this.state.selectedPage - 1,
                SMSCode: this.state.selectedCurrency !== R.strings.selectCurrency ? this.state.selectedCurrency : '',
                PageSize: AppConfig.pageSize,
                FromDate: this.state.fromDate,
                ToDate: this.state.toDate,
                MemberID: this.state.userid,
                Status: this.state.selectedStatus !== R.strings.select_status ? this.state.selectedStatusId : '',
                Trade: this.state.selectedType !== R.strings.select_type ? this.state.selectedTypeId : '',
                Pair: this.state.selectedCurrencyPair == R.strings.all ? '' : this.state.selectedCurrencyPair,
                TrnNo: this.state.transactionNo,
                IsMargin: this.state.IsMargin,
            }

            //To get the trading ledgers
            this.props.getTradingLedgers(request);
        } else {
            this.setState({ refreshing: false });
        }
    }

    /* Drawer Navigation */
    navigationDrawer() {
        let pickers = [
            {
                title: R.strings.type,
                array: this.state.type,
                selectedValue: this.state.selectedType,
                onPickerSelect: (index, object) => this.setState({ selectedType: index, slectedTypeId: object.code })
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
                onPickerSelect: (index, object) => this.setState({ selectedStatus: index, selectedStatusId: object.code })
            },
        ]
        if (this.state.screenType == 1) {
            pickers = [
                ...pickers,
                {
                    title: R.strings.selectCurrency,
                    array: this.state.currencies,
                    selectedValue: this.state.selectedCurrency,
                    onPickerSelect: (item) => this.setState({ selectedCurrency: item })
                },
            ]
        }
        pickers = [
            ...pickers,
            {
                title: R.strings.selectOrderType,
                array: this.state.orderTypes,
                selectedValue: this.state.selectedOrderType,
                onPickerSelect: (index, object) => this.setState({ selectedOrderType: index, selectedOrderTypeId: object.code })
            }
        ]

        return (
            <FilterWidget
                FromDatePickerCall={(date) => this.setState({ fromDate: date })}
                ToDatePickerCall={(date) => this.setState({ toDate: date })}
                sub_container={{ paddingBottom: 0, }}
                toastRef={component => this.toast = component}
                FromDate={this.state.fromDate}
                ToDate={this.state.toDate}
                textInputStyle={{ marginTop: 0, marginBottom: 0, }}
                textInputs={[
                    {
                        header: R.strings.userid,
                        placeholder: R.strings.userid,
                        multiline: false,
                        keyboardType: 'default',
                        returnKeyType: "done",
                        maxLength: 50,
                        onChangeText: (text) => { this.setState({ userid: text }) },
                        value: this.state.userid,
                    },
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
                comboPickerStyle={{ marginTop: 0, marginBottom: R.dimens.margin_between_dtpicker_header }}
                pickers={pickers}
                onResetPress={this.callTradingLedgerApi}
                onCompletePress={this.onComplete}
            />
        )
    }

    componentWillUnmount = () => {
        this.props.clearTradingLedgersData();
    };

    render() {

        let filteredList = [];
        if (this.state.response.length) {
            filteredList = this.state.response.filter(item => (
                item.PairName.replace(/[-_]/g, '/').toLowerCase().includes(this.state.search.toLowerCase()) ||
                item.Type.toLowerCase().includes(this.state.search.toLowerCase()) ||
                item.OrderType.toLowerCase().includes(this.state.search.toLowerCase()) ||
                item.TrnNo.toString().includes(this.state.search) ||
                item.MemberID.toString().includes(this.state.search) ||
                item.statusStatic.toString().includes(this.state.search)
            ));
        }

        return (
            <Drawer
                ref={component => this.drawer = component}
                drawerWidth={R.dimens.FilterDrawarWidth}
                drawerPosition={Drawer.positions.Right}
                drawerContent={this.navigationDrawer()}
                onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
                onDrawerClose={() => this.setState({ isDrawerOpen: false })}
                type={Drawer.types.Overlay}
                easingFunc={Easing.ease}>

                <SafeView style={{ flex: 1, backgroundColor: R.colors.background, }}>

                    {/* To set status bar as per our theme */}
                    <CommonStatusBar />

                    {/* To set toolbar as per our theme */}
                    <CustomToolbar
                        title={this.state.titleScreen}
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
                        {(this.props.data.isLoadingLedger && !this.state.refreshing)
                            ?
                            <ListLoader />
                            :
                            filteredList.length > 0 ?
                                <FlatList
                                    data={filteredList}
                                    extraData={this.state}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={({ item, index }) =>
                                        <TradingLedgerItem
                                            index={index}
                                            item={item}
                                            size={this.state.response.length} />
                                    }
                                    /* assign index as key value list item */
                                    keyExtractor={(_item, index) => index.toString()}
                                    /* For Refresh Functionality FlatList Item */
                                    refreshControl={<RefreshControl
                                        colors={[R.colors.accent]}
                                        progressBackgroundColor={R.colors.background}
                                        refreshing={this.state.refreshing}
                                        onRefresh={this.onRefresh}
                                    />}

                                /> :
                                // Displayed empty component when no record found 
                                <ListEmptyComponent />
                        }

                        {/*To Set Pagination View  */}
                        <View>
                            {filteredList.length > 0 && <PaginationWidget row={this.state.row} selectedPage={this.state.selectedPage} onPageChange={(item) => { this.onPageChange(item) }} />}
                        </View>
                    </View>
                </SafeView>
            </Drawer>
        );
    }
}

// This Class is used for display record in list
class TradingLedgerItem extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        //if records are same then no need to update component
        if (this.props.item === nextProps.item) {
            return false
        }
        return true
    }

    render() {
        let { item: { TrnNo, MemberID, Type, PairName, DateTime, Amount, Total, OrderType, Price, StatusCode, statusStatic }, index, size, } = this.props;

        //set typeColor color
        let typeColor = R.colors.accent;

        if (Type === "BUY") {
            typeColor = R.colors.successGreen;
        } else {
            typeColor = R.colors.failRed;
        }

        //set status color
        let statusColor = R.colors.accent

        if (StatusCode == 1)
            statusColor = R.colors.successGreen
        else if (StatusCode == 2 || StatusCode == 3)
            statusColor = R.colors.failRed
        else if (StatusCode == 4)
            statusColor = R.colors.Success

        return (
            // Flatlist item animation
            <AnimatableItem>
                <View style={{
                    flex: 1,
                    marginRight: R.dimens.widget_left_right_margin,
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginLeft: R.dimens.widget_left_right_margin,
                }}>

                    <CardView style={{
                        flex: 1,
                        borderRadius: 0,
                        borderBottomLeftRadius: R.dimens.margin,
                        elevation: R.dimens.listCardElevation,
                        borderTopRightRadius: R.dimens.margin,
                    }} >

                        {/* for show PairName, OrderType and userid */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', alignContent: 'center' }}>
                                <TextViewMR style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText }}>{!isEmpty(PairName) ? PairName.replace(/[-_]/g, '/') + ' ' : ''}</TextViewMR>
                                <TextViewMR style={{ color: typeColor, fontSize: R.dimens.smallText }}>{!isEmpty(Type) ? Type + '-' : ''}</TextViewMR>
                                <TextViewMR style={{ fontSize: R.dimens.smallestText, color: typeColor }}>{!isEmpty(OrderType) ? OrderType.toUpperCase() : '-'}</TextViewMR>
                            </View>
                            <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                                <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.userid + ': '}</TextViewHML>
                                <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{validateValue(MemberID)}</TextViewHML>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row' }}>
                            {/* for show Price, Amount and Total */}
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.Price}</TextViewHML>
                                <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, }}>
                                    {(parseFloatVal(Price).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(Price).toFixed(8)) : '-')}
                                </TextViewHML>
                            </View>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.Amount}</TextViewHML>
                                <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, }}>
                                    {(parseFloatVal(Amount).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(Amount).toFixed(8)) : '-')}
                                </TextViewHML>
                            </View>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.total}</TextViewHML>
                                <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, }}>
                                    {(parseFloatVal(Total).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(Total).toFixed(8)) : '-')}
                                </TextViewHML>
                            </View>
                        </View>

                        {/* for show Trn_No, Amount and Total */}
                        <View style={{ marginTop: R.dimens.widgetMargin }}>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textSecondary, }}>{R.strings.Trn_No.toUpperCase()}</TextViewHML>
                                <Separator style={{ flex: 1, justifyContent: 'center', }} />
                            </View>
                            <TextViewHML style={{ flex: 1, marginLeft: R.dimens.widget_left_right_margin, fontSize: R.dimens.smallText, color: R.colors.yellow, }}>{validateValue(TrnNo)}</TextViewHML>
                        </View>

                        {/* for show status , date */}
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: R.dimens.widgetMargin, }}>
                            <StatusChip
                                color={statusColor}
                                value={statusStatic}></StatusChip>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <ImageTextButton
                                    style={{ margin: 0, paddingRight: R.dimens.LineHeight, }}
                                    icon={R.images.IC_TIMER}
                                    iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
                                />
                                <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{convertDateTime(DateTime, 'YYYY-MM-DD HH:mm:ss', false)}</TextViewHML>
                            </View>
                        </View>
                    </CardView>
                </View>
            </AnimatableItem>
        )
    }
}

function mapStatToProps(state) {
    //Updated Data For tradingLedgerBOReducer,pairListReducer Data 
    let data = {
        ...state.tradingLedgerBOReducer,
        ...state.pairListReducer
    }
    return { data }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform getTradingLedgers List Action 
        getTradingLedgers: (payload) => dispatch(getTradingLedgersBO(payload)),
        //Perform getCurrencyPairs List Action 
        getCurrencyPairs: (payload) => dispatch(getPairList(payload)),
        //Perform getCurrencyList List Action 
        getCurrencyList: () => dispatch(getCurrencyList()),
        //Perform clearTradingLedgersData List Action 
        clearTradingLedgersData: () => dispatch(clearTradingLedgersData())
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(TradingLedgerScreen);