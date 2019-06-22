import React, { Component } from 'react';
import { View, FlatList, RefreshControl, Text, Easing } from 'react-native';
import { connect } from 'react-redux';
import { getMarginProfitLossData } from '../../actions/Reports/MarginProfitLossAction'
import CommonStatusBar from '../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../native_theme/components/CustomToolbar'
import { isCurrentScreen, addRouteToBackPress } from '../Navigation';
import { changeTheme, parseArray, addPages, parseFloatVal, convertDateTime } from '../../controllers/CommonUtils';
import { isInternet, validateResponseNew, validateValue } from '../../validations/CommonValidation';
import { ListEmptyComponent, contentContainerStyle, } from '../../native_theme/components/FlatListWidgets';
import ListLoader from '../../native_theme/components/ListLoader';
import PaginationWidget from '../Widget/PaginationWidget';
import R from '../../native_theme/R';
import { AppConfig } from '../../controllers/AppConfig';
import TextViewHML from '../../native_theme/components/TextViewHML';
import { Fonts } from '../../controllers/Constants';
import Drawer from 'react-native-drawer-menu';
import FilterWidget from '../Widget/FilterWidget';
import CardView from '../../native_theme/components/CardView';
import ImageTextButton from '../../native_theme/components/ImageTextButton';
import { getPairList } from '../../actions/PairListAction';
import { GetBalance } from '../../actions/PairListAction';
import AnimatableItem from '../../native_theme/components/AnimatableItem';
import SafeView from '../../native_theme/components/SafeView';

class MarginProfitLossReportScreen extends Component {

    constructor(props) {
        super(props);

        //Define All initial State
        this.state = {
            row: [],
            selectedPage: 1,
            response: [],
            searchInput: '',
            refreshing: false,
            isFirstTime: true,

            currencyPairs: [{ value: R.strings.all, PairId: 0 }],
            selectedCurrencyPair: R.strings.all,
            currencyPairId: 0,

            walletItems: [{ value: R.strings.Please_Select }],
            symbol: R.strings.Please_Select,
            isDrawerOpen: false, // First Time Drawer is Closed
        };

        // create refrence
        this.drawer = React.createRef()

        //Add Current Screen to Manual Handling BackPress Events
        addRouteToBackPress(props);

        this.onBackPress = this.onBackPress.bind(this);
        this.props.navigation.setParams({ onBackPress: this.onBackPress });

        //Initial Request Parameter
        this.Request = {
            PageNo: 0,
            PageSize: AppConfig.pageSize,
            PairId: '',
            CurrencyName: ''
        }
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

            //to get pair list
            this.props.getCurrencyPairs();

            //Call Get CoinList API
            this.props.GetBalance();
            //----------

            //Call Margin Profit loss API
            this.props.getMarginProfitLossData(this.Request);
            //----------
        }
    }

    //For Swipe to referesh Functionality
    onRefresh = async () => {
        this.setState({
            refreshing: true
        })

        //Check NetWork is Available or not
        if (await isInternet()) {

            // bind request for margin profit loss data
            this.Request = {
                PageNo: this.state.selectedPage - 1,
                PageSize: AppConfig.pageSize,
                PairId: this.state.currencyPairId != 0 ? this.state.currencyPairId : '',
                CurrencyName: this.state.symbol === R.strings.Please_Select ? '' : this.state.symbol
            }
            //Call Margin Profit loss API
            this.props.getMarginProfitLossData(this.Request);
            //----------
        } else {
            this.setState({ refreshing: false })
        }
    }

    shouldComponentUpdate(nextProps, _nextState) {
        return isCurrentScreen(nextProps);
    };

    // Called when user press on Reset Button from Drawer
    onResetPress = async () => {
        this.drawer.closeDrawer();

        // set initial state
        this.setState({
            searchInput: '',
            refreshing: false,

            selectedCurrencyPair: R.strings.all,
            currencyPairId: 0,

            symbol: R.strings.Please_Select,
            selectedPage: 1,
        })

        //Check NetWork is Available or not
        if (await isInternet()) {

            // bind request for margin profit loss data
            this.Request = {
                PageNo: 0,
                PageSize: AppConfig.pageSize,
                PairId: this.state.currencyPairId != 0 ? this.state.currencyPairId : '',
                CurrencyName: this.state.symbol === R.strings.Please_Select ? '' : this.state.symbol
            }
            //Call Margin Profit loss API
            this.props.getMarginProfitLossData(this.Request)
        }
    }

    // Called when user press on Complete Button from Drawer
    onCompletePress = async () => {

        this.setState({
            selectedPage: 1,
        })

        // Close Drawer user press on Complete button bcoz display flatlist item on Screen */
        this.drawer.closeDrawer();

        //Check NetWork is Available or not
        if (await isInternet()) {

            // bind request for margin profit loss data
            this.Request = {
                PageNo: 0,
                PageSize: AppConfig.pageSize,
                PairId: this.state.currencyPairId != 0 ? this.state.currencyPairId : '',
                CurrencyName: this.state.symbol === R.strings.Please_Select ? '' : this.state.symbol
            }
            //Call Margin Profit loss API
            this.props.getMarginProfitLossData(this.Request)
        } else {
            this.setState({ refreshing: false });
        }

        // searchInput empty when user click on Complete button from Drawer
        this.setState({ searchInput: '' })
    }

    // this method is called when page change and also api call
    async onPageChange(pageNo) {
        if (this.state.selectedPage !== pageNo) {

            this.setState({ selectedPage: pageNo });

            //Check NetWork is Available or not
            if (await isInternet()) {

                // bind request for margin profit loss data
                this.Request = {
                    PageNo: pageNo - 1,
                    PageSize: AppConfig.pageSize,
                    PairId: this.state.currencyPairId != 0 ? this.state.currencyPairId : '',
                    CurrencyName: this.state.symbol === R.strings.Please_Select ? '' : this.state.symbol
                }
                //Call Margin Profit loss API
                this.props.getMarginProfitLossData(this.Request)
            } else {
                this.setState({ refreshing: false })
            }
        }
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
        if (MarginProfitLossReportScreen.oldProps !== props) {
            MarginProfitLossReportScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {

            //Get All Updated Feild of Particular actions
            const { profitLossDataFetch, profitLossData, pairList, pairListDataFetch, Balancedata, BalanceFetchData, } = props;

            //if pairList response is not null then handle resposne
            if (!pairListDataFetch) {
                try {

                    if (validateResponseNew({ response: pairList, isList: true })) {
                        //Store Api Response Field and display in Screen.
                        let res = parseArray(pairList.Response);

                        res.map((item, index) => {
                            res[index].value = item.PairName;
                        })

                        let currencyPairs = [
                            { value: R.strings.all, PairId: 0 },
                            ...res
                        ];

                        return Object.assign({}, state, {
                            pairList,
                            currencyPairs
                        })
                    } else {
                        return Object.assign({}, state, {
                            pairList,
                            currencyPairs: [{ value: R.strings.all, PairId: 0 }]
                        })
                    }
                } catch (e) {
                    return Object.assign({}, state, {
                        refreshing: false,
                    });
                }
            }

            //To Check CoinList Api Data Fetch Or Not
            if (!BalanceFetchData) {
                try {
                    if (validateResponseNew({ response: Balancedata, isList: true })) {

                        let WalletIems = [{ value: R.strings.Please_Select }];

                        for (var i = 0; i < Balancedata.Response.length; i++) {
                            if (Balancedata.Response[i].IsWithdraw == 1) {
                                let item = Balancedata.Response[i].SMSCode;
                                WalletIems.push({ value: item });
                            }
                        }
                        return {
                            ...state,
                            walletItems: WalletIems,
                        };
                    } else {
                        return {
                            ...state,
                            walletItems: [{ value: R.strings.Please_Select }],
                        };
                    }
                } catch (e) {
                    return {
                        ...state,
                        walletItems: [{ value: R.strings.Please_Select }],
                    };
                }
            }

            //To Check profit loss Data Fetch or Not
            if (!profitLossDataFetch) {
                try {
                    if (validateResponseNew({ response: profitLossData, isList: true })) {
                        return {
                            ...state,
                            response: parseArray(profitLossData.Data[0].DetailedData),
                            row: addPages(profitLossData.TotalCount),
                            refreshing: false
                        }
                    } else {
                        return {
                            ...state,
                            refreshing: false,
                            response: [],
                            row: []
                        }
                    }
                } catch (e) {
                    return {
                        ...state,
                        refreshing: false,
                        response: [],
                        row: []
                    }
                }
            }
        }
        return null;
    }

    //Navigation Drawer Functionality
    navigationDrawer = () => {
        return (

            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* filterwidget for display currencypair and walletitem data */}
                <FilterWidget
                    comboPickerStyle={{ marginTop: 0, }}
                    pickers={[
                        {
                            title: R.strings.selectPair,
                            array: this.state.currencyPairs,
                            selectedValue: this.state.selectedCurrencyPair,
                            onPickerSelect: (item, object) => { this.setState({ selectedCurrencyPair: item, currencyPairId: object.PairId }) }
                        },
                        {
                            title: R.strings.selectCurrency,
                            array: this.state.walletItems,
                            selectedValue: this.state.symbol,
                            onPickerSelect: (index) => { this.setState({ symbol: index }) }
                        }
                    ]}
                    onResetPress={this.onResetPress}
                    onCompletePress={this.onCompletePress}

                ></FilterWidget>
            </SafeView>
        )
    }

    render() {

        //Get is Fetching value For All APIs to handle Progress bar in All Activity
        const { loading } = this.props;
        //----------

        //for final items from search input on pairname, trnno, and ordertype
        let finalItems = this.state.response.filter(item =>
            item.PairName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
            ("" + item.TrnNo).includes(this.state.searchInput) ||
            item.OrderType.toLowerCase().includes(this.state.searchInput.toLowerCase()));

        return (
            //DrawerLayout for Withdraw History Filteration
            <Drawer
                ref={cmp => this.drawer = cmp}
                drawerWidth={R.dimens.FilterDrawarWidth}
                drawerContent={this.navigationDrawer()}
                onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
                onDrawerClose={() => this.setState({ isDrawerOpen: false })}
                type={Drawer.types.Overlay}
                drawerPosition={Drawer.positions.Right}
                easingFunc={Easing.ease}>

                <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                     {/* To set status bar as per our theme */}
                    <CommonStatusBar />

                     {/* To set toolbar as per our theme */}
                    <CustomToolbar
                        title={R.strings.marginProfitLossReport}
                        isBack={true}
                        nav={this.props.navigation}
                        searchable={true}
                        onSearchText={(text) => this.setState({ searchInput: text })}
                        rightIcon={R.images.FILTER}
                        onRightMenuPress={() => this.drawer.openDrawer()}
                    />

                    <View style={{ flex: 1, justifyContent: 'space-between' }}>
                        {/* To Check Response fetch or not if loading = true then display progress bar else display List*/}
                        {
                            (loading && !this.state.refreshing) ?
                                <ListLoader />
                                :
                                <FlatList
                                    showsVerticalScrollIndicator={false}
                                    data={finalItems}
                                    renderItem={({ item, index }) =>
                                        <FlatListItem
                                            item={item}
                                            index={index}
                                            size={this.state.response.length}
                                        />
                                    }
                                    keyExtractor={(item, index) => index.toString()}
                                    contentContainerStyle={contentContainerStyle(finalItems)}
                                    ListEmptyComponent={<ListEmptyComponent />}
                                    /* for refreshing data of flatlist */
                                    refreshControl={
                                        <RefreshControl
                                            colors={[R.colors.accent]}
                                            progressBackgroundColor={R.colors.background}
                                            refreshing={this.state.refreshing}
                                            onRefresh={this.onRefresh}
                                        />
                                    }
                                />
                        }

                        {/* To Set Pagination View */}
                        <View>
                            {finalItems.length > 0 &&
                                <PaginationWidget row={this.state.row} selectedPage={this.state.selectedPage} onPageChange={(item) => { this.onPageChange(item) }} />
                            }
                        </View>
                    </View>
                </SafeView >
            </Drawer>
        );
    }
}

// This Class is used for display record in list
class FlatListItem extends Component {

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        //Check If Old Props and New Props are Equal then Return False
        if (this.props.item !== nextProps.item) {
            return true;
        } else {
            return false;
        }
    }

    render() {

        // Get required fields from props
        let { item, index, size } = this.props;

        // set color based on status
        let statusColor = item.OrderType === 'Buy' ? R.colors.successGreen : R.colors.failRed

        return (
            <AnimatableItem>
                <View style={{ flexDirection: 'row', marginLeft: R.dimens.WidgetPadding, marginRight: R.dimens.WidgetPadding, marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin, marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin, }}>

                    <CardView style={{
                        elevation: R.dimens.listCardElevation,
                        flex: 1,
                        borderRadius: 0,
                        flexDirection: 'column',
                        borderBottomLeftRadius: R.dimens.margin,
                        borderTopRightRadius: R.dimens.margin,
                    }}>

                        {/* for Show pairName and trnNo */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                            <Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.mediumText, fontFamily: Fonts.MontserratSemiBold }}>{item.PairName}  <Text style={{ color: statusColor, fontSize: R.dimens.mediumText, fontFamily: Fonts.MontserratSemiBold }}>{item.OrderType}</Text></Text>
                            <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallText, textAlign: 'right' }}>{R.strings.Trn_No} : <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold }}>{item.TrnNo}</TextViewHML></TextViewHML>
                        </View>

                        {/* for show qty,bid price and landing price  */}
                        <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row', marginBottom: R.dimens.widgetMargin }}>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <TextViewHML style={[this.styles().headerItem]}>{R.strings.Qty}</TextViewHML>
                                <TextViewHML style={[this.styles().detailItem]}>{(parseFloatVal(item.Qty).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(item.Qty).toFixed(8)) : '-')}</TextViewHML>
                            </View>

                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <TextViewHML style={[this.styles().headerItem]}>{R.strings.bidPrice}</TextViewHML>
                                <TextViewHML style={[this.styles().detailItem]}>{(parseFloatVal(item.BidPrice).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(item.BidPrice).toFixed(8)) : '-')}</TextViewHML>
                            </View>

                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <TextViewHML style={[this.styles().headerItem]}>{R.strings.landingPrice}</TextViewHML>
                                <TextViewHML style={[this.styles().detailItem]}>{(parseFloatVal(item.LandingPrice).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(item.LandingPrice).toFixed(8)) : '-')}</TextViewHML>
                            </View>
                        </View>

                        {/* for show DateTime */}
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <ImageTextButton
                                style={{ margin: 0, paddingRight: R.dimens.LineHeight, }}
                                icon={R.images.IC_TIMER}
                                iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
                            />
                            <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, textAlign: 'center' }}>{item.TrnDate ? convertDateTime(item.TrnDate, 'YYYY-MM-DD HH:mm:ss', false) : '-'}</TextViewHML>
                        </View>
                    </CardView>
                </View>
            </AnimatableItem>
        )
    };

    styles = () => {
        return {
            headerItem: {
                color: R.colors.textSecondary,
                fontSize: R.dimens.smallText,
                textAlign: 'center'
            },
            detailItem: {
                color: R.colors.textPrimary,
                fontSize: R.dimens.smallText,
                textAlign: 'center'
            }
        }
    }
}

function mapStateToProps(state) {
    return {
        // Updated Data for PairList
        pairList: state.MarginProfitLossReportReducer.pairList,
        pairListDataFetch: state.MarginProfitLossReportReducer.pairListDataFetch,

        // Updated Balance Data
        Balancedata: state.MarginProfitLossReportReducer.Balancedata,
        BalanceFetchData: state.MarginProfitLossReportReducer.BalanceFetchData,

        //Updated data for Profit Loss
        loading: state.MarginProfitLossReportReducer.loading,
        profitLossData: state.MarginProfitLossReportReducer.profitLossData,
        profitLossDataFetch: state.MarginProfitLossReportReducer.profitLossDataFetch,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        // Perform margin profit loss Action
        getMarginProfitLossData: (ReqObj) => dispatch(getMarginProfitLossData(ReqObj)),
        
        // Perform currency pair Action
        getCurrencyPairs: () => dispatch(getPairList()),
        
        // Perform Get Balance Action
        GetBalance: () => dispatch(GetBalance()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MarginProfitLossReportScreen)