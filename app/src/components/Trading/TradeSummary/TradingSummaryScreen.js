import React, { Component } from 'react';
import { View, FlatList, Easing, RefreshControl, Keyboard } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import ListLoader from '../../../native_theme/components/ListLoader';
import { ListEmptyComponent, contentContainerStyle } from '../../../native_theme/components/FlatListWidgets';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { changeTheme, parseArray, getCurrentDate, addPages, convertDateTime } from '../../../controllers/CommonUtils';
import CommonToast from '../../../native_theme/components/CommonToast';
import { isInternet, validateResponseNew, isEmpty, validateValue } from '../../../validations/CommonValidation';
import { isCurrentScreen, addRouteToBackPress } from '../../../components/Navigation';
import { connect } from 'react-redux';
import Drawer from 'react-native-drawer-menu';
import { DateValidation } from '../../../validations/DateValidation';
import { getPairList, clearPairList } from '../../../actions/PairListAction';
import { getTradeSettledData, clearTradeSettled } from '../../../actions/Trade/TradeSettledActions';
import R from '../../../native_theme/R';
import { AppConfig } from '../../../controllers/AppConfig';
import PaginationWidget from '../../Widget/PaginationWidget';
import CardView from '../../../native_theme/components/CardView';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import FilterWidget from '../../Widget/FilterWidget';
import SafeView from '../../../native_theme/components/SafeView';
import { getData } from '../../../App';
import { ServiceUtilConstant } from '../../../controllers/Constants';

class TradingSummaryScreen extends Component {

    constructor(props) {
        super(props);

        //Add Current Screen to Manual Handling BackPress Events
        addRouteToBackPress(props);

        // create reference
        this.drawer = React.createRef();
        this.progressDialog = React.createRef();
        this.toast = React.createRef();

        // Bind all methods
        this.onComplete = this.onComplete.bind(this);
        this.onReset = this.onReset.bind(this);
        this.onRefresh = this.onRefresh.bind(this);
        this.onPageChange = this.onPageChange.bind(this);
        this.onBackPress = this.onBackPress.bind(this);
        this.props.navigation.setParams({ onBackPress: this.onBackPress });
        this.isMargin = getData(ServiceUtilConstant.KEY_IsMargin);

        this.request = {
            PageNo: 0,
            PageSize: AppConfig.pageSize,
            FromDate: getCurrentDate(),
            ToDate: getCurrentDate(),
        };

        // if Margin is on then add IsMargin : 1 bit
        if (this.isMargin) {
            this.request = Object.assign({}, this.request, { IsMargin: 1 });
        }

        //Define All initial State
        this.state = {
            title: R.strings.TradeSummary,
            //Filter
            fromDate: getCurrentDate(),
            toDate: getCurrentDate(),
            transactionNo: '',
            refreshing: false,
            search: '',
            response: [],

            //pickers
            type: [{ value: R.strings.select_type }, { value: R.strings.buy, code: 'buy' }, { value: R.strings.sell, code: 'sell' }],
            selectedType: R.strings.select_type,
            TrnType: 0,

            currencyPairs: [{ value: R.strings.all }],
            selectedCurrencyPair: R.strings.all,

            orderTypes: [{ value: R.strings.selectOrderType, code: '' }, { value: R.strings.limit, code: 'LIMIT' }, { value: R.strings.market, code: 'MARKET' }, { value: R.strings.stopLimit, code: 'STOP_Limit' }, { value: R.strings.spot, code: 'SPOT' }],
            selectedOrderType: R.strings.selectOrderType,
            OrderTypeId: 0,

            row: [],
            selectedPage: 0,
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
            //goging back screen
            this.props.navigation.goBack();
        }
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //check for internet connection
        if (await isInternet()) {

            //to get pair list
            this.props.getCurrencyPairs();

            //To get trading settled list
            this.props.getTradingSettledList(this.request);
        }
    };

    componentWillUnmount = () => {

        //clear reducer 
        this.props.clearTradeSettled();
        this.props.clearPairList();
    }

    shouldComponentUpdate = (nextProps, _nextState) => {
        return isCurrentScreen(nextProps);
    };

    static oldProps = {};

    static getDerivedStateFromProps(props, state) {

        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return Object.assign({}, state, {
                isFirstTime: false,
            });
        }

        // To Skip Render if old and new props are equal
        if (TradingSummaryScreen.oldProps !== props) {
            TradingSummaryScreen.oldProps = props;
        } else {
            return null;
        }

        // check for current screen
        if (isCurrentScreen(props)) {
            try {
                //Get All Updated field of Particular actions 
                let { tradeSettledData, pairList } = props.data;

                //if tradeSettledData response is not null then handle resposne
                if (tradeSettledData) {

                    //if local tradeSettledData state is null or its not null and also different then new response then and only then validate response.
                    if (state.tradeSettledData == null || (state.tradeSettledData != null && tradeSettledData !== state.tradeSettledData)) {

                        //if tradeSettledData response is success then store array list else store empty list
                        if (validateResponseNew({ response: tradeSettledData, isList: true })) {
                            let res = parseArray(tradeSettledData.Response);

                            return Object.assign({}, state, {
                                tradeSettledData,
                                response: res,
                                refreshing: false,
                                row: addPages(tradeSettledData.TotalCount)
                            })
                        } else {
                            return Object.assign({}, state, {
                                tradeSettledData,
                                response: [],
                                refreshing: false,
                                row: []
                            })
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

                            res.map((item, index) => {
                                res[index].value = item.PairName;
                            })

                            let currencyPairs = [
                                { value: R.strings.all },
                                ...res
                            ];

                            return Object.assign({}, state, {
                                pairList,
                                currencyPairs
                            })
                        } else {
                            return Object.assign({}, state, {
                                pairList,
                                currencyPairs: [{ value: R.strings.all }]
                            })
                        }
                    }
                }
            } catch (error) {
                return Object.assign({}, state, {
                    refreshing: false,
                });
            }
        }
        return null;
    }

    // if press on complete button then check validation and api calling
    async onComplete() {

        //Check All From Date and To Date Validation
        if (DateValidation(this.state.fromDate, this.state.toDate)) {
            this.toast.Show(DateValidation(this.state.fromDate, this.state.toDate));
            return;
        }

        // Close Drawer user press on Complete button bcoz display flatlist item on Screen
        this.drawer.closeDrawer();
        this.setState({ selectedPage: 0 })

        // check validations and bind request for getting list
        this.request = {
            ...this.request,
            FromDate: this.state.fromDate,
            ToDate: this.state.toDate,
            PageNo: 0,
        };

        if (!isEmpty(this.state.transactionNo)) {
            this.request = {
                ...this.request,
                TrnNo: this.state.transactionNo
            }
        }

        if (this.state.selectedType !== R.strings.select_type) {
            this.request = {
                ...this.request,
                TrnType: this.state.TrnType
            }
        } else {
            delete this.request['TrnType'];
        }

        if (this.state.selectedCurrencyPair !== R.strings.all) {
            this.request = {
                ...this.request,
                PairName: this.state.selectedCurrencyPair
            }
        } else {
            delete this.request['PairName'];
        }

        if (this.state.selectedOrderType !== R.strings.selectOrderType) {
            this.request = {
                ...this.request,
                OrderType: this.state.OrderTypeId
            }
        } else {
            delete this.request['OrderType'];
        }

        // check for internet connection
        if (await isInternet()) {

            //To get trading settled list
            this.props.getTradingSettledList(this.request);
        }
        else {
            this.setState({ refreshing: false })
        }

    }

    // When user press on reset button then all values are reset
    async onReset() {

        Keyboard.dismiss();

        this.request = {
            PageNo: 0,
            FromDate: getCurrentDate(),
            ToDate: getCurrentDate(),
            PageSize: AppConfig.pageSize
        };

        // if Margin is on then add IsMargin : 1 bit
        if (this.isMargin) {
            this.request = Object.assign({}, this.request, { IsMargin: 1 });
        }

        // Set state to original value
        this.setState({
            fromDate: getCurrentDate(),
            toDate: getCurrentDate(),
            transactionNo: '',
            selectedType: R.strings.select_type,
            selectedCurrencyPair: R.strings.all,
            selectedOrderType: R.strings.selectOrderType,
            selectedPage: 0,
            TrnType: 0,
            OrderTypeId: 0
        })

        // Close Drawer user press on Complete button bcoz display flatlist item on Screen
        this.drawer.closeDrawer();

        //check for internet connection
        if (await isInternet()) {

            //To get trading settled list
            this.props.getTradingSettledList(this.request);
        }
        else {
            this.setState({ refreshing: false })
        }
    }

    async onRefresh() {
        this.setState({ refreshing: true });

        // check for internet connection
        if (await isInternet()) {

            this.setState({ tradeSettledData: null });

            //To get trading settled list
            this.props.getTradingSettledList(this.request);

        } else {
            this.setState({ refreshing: false });
        }
    }

    // this method is called when page change and also api call
    async onPageChange(pageNo) {

        if (!(pageNo - 1) == this.state.selectedPage) {

            // check for internet connection
            if (await isInternet()) {
                this.setState({ selectedPage: pageNo - 1 });

                // // Bind Request for treding settled list
                this.request = Object.assign({}, this.request, {
                    PageNo: pageNo - 1
                });

                // if Margin is on then add IsMargin : 1 bit
                if (this.isMargin) {
                    this.request = Object.assign({}, this.request, { IsMargin: 1 });
                }

                //To get trading settled list
                this.props.getTradingSettledList(this.request);
            } else {
                this.setState({ refreshing: false })
            }
        }
    }

    // Drawer Navigation
    navigationDrawer() {
        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* For Display Toast */}
                <CommonToast ref={cmpToast => this.toast = cmpToast} styles={{ width: R.dimens.FilterDrawarWidth }} />

                {/* filterwidget for fromdate,todate ,type ,currency pair, order type  data and transaction no */}
                <FilterWidget
                    FromDatePickerCall={(date) => this.setState({ fromDate: date })}
                    FromDate={this.state.fromDate}
                    ToDatePickerCall={(date) => this.setState({ toDate: date })}
                    ToDate={this.state.toDate}
                    pickers={[
                        {
                            title: R.strings.type,
                            array: this.state.type,
                            selectedValue: this.state.selectedType,
                            onPickerSelect: (item, object) => this.setState({ selectedType: item, TrnType: object.code })
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
                            onPickerSelect: (item, object) => this.setState({ selectedOrderType: item, OrderTypeId: object.code })
                        }
                    ]}
                    textInputStyle={{ marginTop: 0, marginBottom: 0, }}
                    textInputs={[
                        {
                            header: R.strings.transactionNo,
                            placeholder: R.strings.transactionNo,
                            multiline: false,
                            keyboardType: 'numeric',
                            validate: true,
                            validateNumeric: true,
                            maxLength: 35,
                            returnKeyType: "done",
                            onChangeText: (text) => { this.setState({ transactionNo: text }) },
                            value: this.state.transactionNo,
                        },
                    ]}
                    comboPickerStyle={{ marginTop: 0, }}
                    onResetPress={this.onReset}
                    onCompletePress={this.onComplete}
                />
            </SafeView>
        )
    }

    render() {

        //for final items from search input (validate on PairName, TrnType, OrderType, TrnNo)
        //default searchInput is empty so it will display all records.
        let filteredList = this.state.response.filter(item => (
            item.PairName.toLowerCase().includes(this.state.search.toLowerCase()) ||
            item.TrnType.toLowerCase().includes(this.state.search.toLowerCase()) ||
            item.OrderType.toLowerCase().includes(this.state.search.toLowerCase()) ||
            item.TrnNo.toString().includes(this.state.search)
        ));

        return (
            // show drawer for filter
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

                    {/* Progress Dialog*/}
                    <ProgressDialog ref={component => this.progressDialog = component} />

                    {/* To set toolbar as per our theme */}
                    <CustomToolbar
                        title={this.state.title}
                        isBack={true}
                        onBackPress={this.onBackPress}
                        nav={this.props.navigation}
                        searchable={true}
                        onSearchText={(input) => this.setState({ search: input })}
                        rightIcon={R.images.FILTER}
                        onRightMenuPress={() => this.drawer.openDrawer()}
                    />

                    <View style={{ flex: 1, justifyContent: 'space-between' }}>

                        {/* To Check Response fetch or not if isLoading = true then display progress bar else display List*/}
                        {(this.props.data.isLoading && !this.state.refreshing)
                            ?
                            <ListLoader />
                            :
                            <FlatList
                                data={filteredList}
                                extraData={this.state}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item, index }) => {
                                    return <FlatListItem
                                        index={index}
                                        item={item}
                                        size={filteredList.length}
                                        onPress={() => this.props.navigation.navigate('TradingSummaryDetail', { item })} />
                                }}
                                keyExtractor={(_item, index) => index.toString()}
                                contentContainerStyle={contentContainerStyle(filteredList)}
                                ListEmptyComponent={() => <ListEmptyComponent />}
                                /* for refreshing data of flatlist */
                                refreshControl={<RefreshControl
                                    colors={[R.colors.accent]}
                                    progressBackgroundColor={R.colors.background}
                                    refreshing={this.state.refreshing}
                                    onRefresh={this.onRefresh}
                                />}
                            />
                        }

                        {/*To Set Pagination View  */}
                        <View>
                            <PaginationWidget row={this.state.row} selectedPage={this.state.selectedPage + 1} onPageChange={(item) => { this.onPageChange(item) }} />
                        </View>
                    </View>
                </SafeView>
            </Drawer>
        );
    }
}

// This Class is used for display record in list
export class FlatListItem extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        //Check If Old Props and New Props are Equal then Return False
        if (this.props.item !== nextProps.item) {
            return true
        }
        return false
    }

    render() {

        // Get required fields from props
        let item = this.props.item;
        let { index, size } = this.props;

        // apply color as per transaction type "buy" or "sell"
        let color;
        if ((item.TrnType).toLowerCase() === "buy") {
            color = R.colors.successGreen
        }
        else {
            color = R.colors.sellerPink
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
                    }} onPress={this.props.onPress}>

                        {/* for show pairname order type and icon */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', alignContent: 'center' }}>
                                <TextViewMR style={{ color: R.colors.listSeprator, fontSize: R.dimens.smallText }}>{item.PairName.replace('_', '/')}</TextViewMR>
                                <TextViewMR style={{ marginLeft: R.dimens.widgetMargin, fontSize: R.dimens.smallestText, color: color }}>{item.TrnType ? item.TrnType.toUpperCase() : '-'}</TextViewMR>
                                <TextViewMR style={{ fontSize: R.dimens.smallestText, color: color }}>{' - '}{item.OrderType ? item.OrderType.toUpperCase() : '-'}</TextViewMR>
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

                        {/* for show Qty and Price */}
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.Qty}</TextViewHML>
                                <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, }}>{item.Qty.toFixed(8)}</TextViewHML>
                            </View>

                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.Price}</TextViewHML>
                                <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, }}>{item.Price.toFixed(8)}</TextViewHML>
                            </View>
                        </View>

                        {/* for show trn no and DateTime */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', alignContent: 'center', justifyContent: 'center', marginTop: R.dimens.widgetMargin }}>

                            <View style={{ flexDirection: 'row' }}>
                                <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textSecondary, }}>{R.strings.TrnId}</TextViewHML>
                                <TextViewHML style={{ marginLeft: R.dimens.widgetMargin, fontSize: R.dimens.smallText, color: R.colors.yellow, }}>{validateValue(item.TrnNo)}</TextViewHML>
                            </View>

                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                                <ImageTextButton
                                    style={{ margin: 0, paddingRight: R.dimens.LineHeight, }}
                                    icon={R.images.IC_TIMER}
                                    iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
                                />
                                <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{item.TrnDate ? convertDateTime(item.TrnDate) : '-'}</TextViewHML>
                            </View>
                        </View>

                    </CardView>
                </View >
            </AnimatableItem>
        )
    }
}

function mapStatToProps(state) {
    // Updated data of pairlist and tradesettled
    let data = {
        ...state.tradeSettledReducer,
        ...state.pairListReducer
    }
    return { data }
}

function mapDispatchToProps(dispatch) {
    return {
        // Perform Trading settled Action
        getTradingSettledList: (payload) => dispatch(getTradeSettledData(payload)),
        // Clear tradesettled reducer data
        clearTradeSettled: () => dispatch(clearTradeSettled()),
        // Perform pairList Action
        getCurrencyPairs: () => dispatch(getPairList()),
        // clear PairList reducer Data
        clearPairList: () => dispatch(clearPairList()),
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(TradingSummaryScreen);