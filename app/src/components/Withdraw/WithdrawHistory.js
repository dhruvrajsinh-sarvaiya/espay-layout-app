import React, { Component } from 'react';
import {
    View,
    FlatList,
    RefreshControl,
    Easing,
    Image,
    Text
} from 'react-native';
import { getCurrentDate, changeTheme, parseFloatVal, convertDateTime } from '../../controllers/CommonUtils';
import { connect } from 'react-redux';
import { OnWithdrawHistory } from '../../actions/Wallet/WithdrawAction'
import CommonStatusBar from '../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../native_theme/components/CustomToolbar'
import { isCurrentScreen, addRouteToBackPress } from '../Navigation';
import { DateValidation } from '../../validations/DateValidation';
import FilterWidget from '../Widget/FilterWidget';
import { isInternet, validateResponseNew, validateValue } from '../../validations/CommonValidation';
import Separator from '../../native_theme/components/Separator';
import { ListEmptyComponent } from '../../native_theme/components/FlatListWidgets';
import ListLoader from '../../native_theme/components/ListLoader';
import CommonToast from '../../native_theme/components/CommonToast';
import Drawer from 'react-native-drawer-menu';
import R from '../../native_theme/R';
import { ServiceUtilConstant, Fonts } from '../../controllers/Constants';
import ImageViewWidget from '../Widget/ImageViewWidget';
import { GetBalance } from '../../actions/PairListAction';
import CardView from '../../native_theme/components/CardView';
import StatusChip from '../Widget/StatusChip';
import TextViewMR from '../../native_theme/components/TextViewMR';
import TextViewHML from '../../native_theme/components/TextViewHML';
import AnimatableItem from '../../native_theme/components/AnimatableItem';
import SafeView from '../../native_theme/components/SafeView';

class WithdrawHistory extends Component {

    constructor(props) {
        super(props);

        this.coinData = this.props.navigation.state.params && this.props.navigation.state.params.data;

        //Define All State initial state
        this.state = {
            symbol: R.strings.Please_Select,
            response: [],
            searchInput: '',
            refreshing: false,
            FromDate: getCurrentDate(),
            ToDate: getCurrentDate(),
            walletItems: [],
            isFirstTime: true,
            isDrawerOpen: false, // First Time Drawer is Closed
        };
        //Add Current Screen to Manual Handling BackPress Events
        addRouteToBackPress(props);

        //To Bind All Method
        this.onBackPress = this.onBackPress.bind(this);
        this.props.navigation.setParams({ onBackPress: this.onBackPress });

        // create reference
        this.toast = React.createRef();
        this.drawer = React.createRef();
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

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Bind Request For Withdraw History
            let withdrawHistoryRequest = {
                FromDate: this.state.FromDate,
                ToDate: this.state.ToDate,
                Coin: this.state.symbol === R.strings.Please_Select ? '' : this.state.symbol,
            }
            //Call Get Withdraw History API
            this.props.onWithdrawHistory(withdrawHistoryRequest);
            //----------

            if (this.coinData) {
                try {
                    //Store Api Response Felid and display in Screen.
                    let WalletIems = [{ value: R.strings.Please_Select }];
                    for (var i = 0; i < this.coinData.length; i++) {
                        let item = this.coinData[i].SMSCode;
                        WalletIems.push({ value: item });
                    }
                    this.setState({ walletItems: WalletIems })
                } catch (e) {
                    //Handle Catch and Notify User to Exception.
                }
            } else {
                //Check NetWork is Available or not
                if (await isInternet()) {

                    //Call Get CoinList API
                    this.props.GetBalance();
                    //----------
                }
            }
        } else {
            this.setState({ refreshing: false });
        }
    }

    //For Swipe to referesh Functionality
    onRefresh = async () => {
        this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Bind Request For Withdraw History
            let withdrawHistoryRequest = {
                FromDate: this.state.FromDate,
                ToDate: this.state.ToDate,
                Coin: this.state.symbol === R.strings.Please_Select ? '' : this.state.symbol,
            }

            //Call Get Withdraw History API
            this.props.onWithdrawHistory(withdrawHistoryRequest);
            //----------
        } else {
            this.setState({ refreshing: false });
        }
    }
    //-----------

    shouldComponentUpdate = (nextProps, nextState) => {
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
        if (WithdrawHistory.oldProps !== props) {
            WithdrawHistory.oldProps = props;
        } else {
            return null;
        }

        // check for current screen
        if (isCurrentScreen(props)) {

            //Get All Updated Feild of Particular actions
            const { WithdrawHistorydata, WithdrawHistoryFetchData, Balancedata, BalanceFetchData, } = props;

            //To Check CoinList Api Data Fetch Or Not
            if (!BalanceFetchData) {
                try {
                    if (validateResponseNew({ response: Balancedata, isList: true })) {

                        //Store Api Response Felid and display in Screen.
                        let CurrencytIems = [{ value: R.strings.Please_Select }];
                        for (var i = 0; i < Balancedata.Response.length; i++) {
                            if (Balancedata.Response[i].IsWithdraw == 1) {
                                let item = Balancedata.Response[i].SMSCode;
                                CurrencytIems.push({ value: item });
                            }
                        }
                        return {
                            ...state,
                            walletItems: CurrencytIems,
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

            //To Check Withdraw History Data Fetch or Not
            if (!WithdrawHistoryFetchData) {

                try {
                    if (validateResponseNew({ response: WithdrawHistorydata, isList: true })) {

                        //check Withdraw History Response is an Array Or not
                        //If Response is Array then Direct set in state otherwise conver response to Array form then set state.
                        var res = WithdrawHistorydata.Histories;
                        var resArr = [];
                        if (!Array.isArray(res)) {
                            resArr.push(res);
                        }
                        return {
                            ...state,
                            response: (Array.isArray(res)) ? res : resArr,
                            refreshing: false
                        };
                    } else {
                        return {
                            ...state,
                            response: [],
                            refreshing: false
                        };
                    }
                } catch (e) {
                    return {
                        ...state,
                        response: [],
                        refreshing: false
                    };
                    //Handle Catch and Notify User to Exception.
                }
            }
        }
        return null;
    }

    // Reset FromDate and ToDate
    onResetPress = async () => {
        this.drawer.closeDrawer();
        this.setState({ FromDate: getCurrentDate(), ToDate: getCurrentDate(), searchInput: '', symbol: R.strings.Please_Select })

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Bind Request For Withdraw History
            let withdrawHistoryRequest = {
                FromDate: getCurrentDate(),
                ToDate: getCurrentDate(),
                Coin: '',
            }

            //Call Get Withdraw History API
            this.props.onWithdrawHistory(withdrawHistoryRequest);
            //----------
        } else {
            this.setState({ refreshing: false });
        }
    }

    // Api Call when press on complete button
    onCompletePress = async () => {

        //Check All From Date Validation
        if (DateValidation(this.state.FromDate, this.state.ToDate)) {
            this.toast.Show(DateValidation(this.state.FromDate, this.state.ToDate));
            return;
        }
        else {
            // Close Drawer user press on Complete button bcoz display flatlist item on Screen
            this.drawer.closeDrawer();

            //Check NetWork is Available or not
            if (await isInternet()) {

                //Bind Request For Withdraw History
                let withdrawHistoryRequest = {
                    FromDate: this.state.FromDate,
                    ToDate: this.state.ToDate,
                    Coin: this.state.symbol === R.strings.Please_Select ? '' : this.state.symbol,
                }

                //Call Get Withdraw History API
                this.props.onWithdrawHistory(withdrawHistoryRequest);
                //----------
            } else {
                this.setState({ refreshing: false });
            }

            //If Filter from Complete Button Click then empty searchInput
            this.setState({ searchInput: '' })
        }
    }

    // Drawer Navigation
    navigationDrawer() {
        return (

            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* For Dsiplaying Toast */}
                <CommonToast ref={cmpToast => this.toast = cmpToast} styles={{ width: R.dimens.FilterDrawarWidth }} />

                {/* For Filter Widget for display withdraw history data */}
                <FilterWidget
                    FromDatePickerCall={(date) => this.setState({ FromDate: date })}
                    ToDatePickerCall={(date) => this.setState({ ToDate: date })}
                    FromDate={this.state.FromDate}
                    ToDate={this.state.ToDate}
                    onResetPress={this.onResetPress}
                    onCompletePress={this.onCompletePress}
                    firstPicker={{
                        title: R.strings.Currency,
                        array: this.state.walletItems,
                        selectedValue: this.state.symbol,
                        onPickerSelect: (index) => { this.setState({ symbol: index }) }
                    }}
                ></FilterWidget>
            </SafeView>
        )
    }

    render() {

        //Get is Fetching value For All APIs to handle Progress bar in All Activity
        const { WithdrawHistoryisFetching } = this.props;
        //----------

        //for final items from search input (validate on Amount and StatusStr)
        //default searchInput is empty so it will display all records.
        let finalItems = this.state.response.filter(item => (('' + item.Amount).includes(this.state.searchInput) || item.StatusStr.toLowerCase().includes(this.state.searchInput.toLowerCase())));

        return (

            //DrawerLayout for Withdraw History Filteration
            <Drawer
                ref={cmp => this.drawer = cmp}
                drawerWidth={R.dimens.FilterDrawarWidth}
                type={Drawer.types.Overlay}
                drawerPosition={Drawer.positions.Right}
                easingFunc={Easing.ease}
                drawerContent={this.navigationDrawer()}
                onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
                onDrawerClose={() => this.setState({ isDrawerOpen: false })}>

                <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                    {/* To set status bar as per our theme */}
                    <CommonStatusBar />

                    {/* To set toolbar as per our theme */}
                    <CustomToolbar
                        rightIcon={R.images.FILTER}
                        onRightMenuPress={() => this.drawer.openDrawer()}
                        title={R.strings.Withdraw_History}
                        searchable={true}
                        onSearchText={(text) => this.setState({ searchInput: text })}
                        isBack={true}
                        onBackPress={this.onBackPress}
                        nav={this.props.navigation} />

                    <View style={{ flex: 1 }}>
                        {/* To Check Response fetch or not if WithdrawHistoryisFetching = true then display progress bar else display List*/}
                        {(WithdrawHistoryisFetching && !this.state.refreshing) ?
                            <ListLoader />
                            :
                            <View style={{ flex: 1 }}>

                                {finalItems.length ?
                                    <View style={{ flex: 1 }}>
                                        <FlatList
                                            data={finalItems}
                                            showsVerticalScrollIndicator={false}
                                            /* render all item in list */
                                            renderItem={({ item, index }) => <FlatListItem
                                                item={item}
                                                index={index}
                                                size={this.state.response.length}
                                                onPress={() => {
                                                    this.props.navigation.navigate('WithdrawHistoryDetail', { item })
                                                }} ></FlatListItem>}
                                            /* assign index as key valye to Withdraw History list item */
                                            keyExtractor={(item, index) => index.toString()}
                                            /* For Refresh Functionality In Withdraw History FlatList Item */
                                            refreshControl={
                                                <RefreshControl
                                                    colors={[R.colors.accent]}
                                                    progressBackgroundColor={R.colors.background}
                                                    refreshing={this.state.refreshing}
                                                    onRefresh={this.onRefresh}
                                                />
                                            } />
                                    </View>
                                    : !WithdrawHistoryisFetching && <ListEmptyComponent module={R.strings.withdrawal} onPress={() => this.props.navigation.navigate('CoinSelectScreen', { isAction: ServiceUtilConstant.From_Withdraw })} />
                                }
                            </View>
                        }
                    </View>
                </SafeView>
            </Drawer >
        );
    }
}

// This Class is used for display record in list
class FlatListItem extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        //Check If Old Props and New Props are Equal then do not render component
        if (this.props.item === nextProps.item) {
            return false
        }
        return true
    }

    render() {

        // Get required field from props
        let item = this.props.item
        let { index, size, } = this.props;

        let color;
        //To Display various Status Color in ListView
        if (item.Status == 0) {
            color = R.colors.textSecondary
        } else if (item.Status == 1) {
            color = R.colors.successGreen
        } else if (item.Status == 2) {
            color = R.colors.failRed
        } else if (item.Status == 3) {
            color = R.colors.failRed
        } else if (item.Status == 4 || item.Status == 6) {
            color = R.colors.accent
        } else if (item.Status == 5) {
            color = R.colors.sellerPink
        } else {
            color = R.colors.accent
        }

        return (
            <AnimatableItem>
                <View style={{
                    flex: 1,
                    marginLeft: R.dimens.widget_left_right_margin,
                    marginRight: R.dimens.widget_left_right_margin,
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    flexDirection: 'column'
                }}>
                    <CardView
                        style={{
                            borderRadius: 0,
                            flexDirection: 'column',
                            elevation: R.dimens.listCardElevation,
                            borderTopRightRadius: R.dimens.margin,
                            flex: 1,
                            borderBottomLeftRadius: R.dimens.margin
                        }}
                        onPress={this.props.onPress}>

                        <View style={{ flexDirection: 'row', flex: 1 }}>

                            {/* Currency Image */}
                            <ImageViewWidget width={R.dimens.IconWidthHeight} url={item.CoinName ? item.CoinName : ''} height={R.dimens.IconWidthHeight} />

                            <View style={{ marginLeft: R.dimens.widgetMargin, flex: 1 }}>

                                {/* Amount , Currecncy Name and Confirmation */}
                                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                                    <Text style={{ fontSize: R.dimens.smallText, color: R.colors.listSeprator, fontFamily: Fonts.MontserratSemiBold, }}>{(parseFloatVal(item.Amount).toFixed(8).toString()) !== 'NaN' ? parseFloatVal(item.Amount).toFixed(8).toString() : '-'} {item.CoinName ? item.CoinName : '-'}</Text>
                                    <View style={{ flexDirection: 'row' }}>
                                        {item.Confirmations ?
                                            <View style={{ flexDirection: 'row' }}>
                                                <TextViewMR style={{ fontSize: R.dimens.smallestText, color: R.colors.yellow }}>{validateValue(item.Confirmations)} </TextViewMR>
                                                <TextViewMR style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary }}>{R.strings.Conf}</TextViewMR>
                                            </View>
                                            : null
                                        }
                                        <Image
                                            style={{ marginLeft: R.dimens.widgetMargin, width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.textPrimary }}
                                            source={R.images.RIGHT_ARROW_DOUBLE}
                                        />
                                    </View>
                                </View>

                                {/* To Address */}
                                <View style={{ flexDirection: 'row', marginTop: R.dimens.widgetMargin }}>
                                    <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallText, }}>{R.strings.from} : </TextViewHML>
                                    <TextViewHML ellipsizeMode="tail" numberOfLines={1}
                                        style={{ alignSelf: 'center', flex: 1, color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>{item.Address ? item.Address : '-'}</TextViewHML>
                                </View>

                                {/* Information */}
                                <View style={{ flexDirection: 'row', }}>
                                    <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallText, }}>{R.strings.Info} : </TextViewHML>
                                    <TextViewHML numberOfLines={1} ellipsizeMode="tail"
                                        style={{ alignSelf: 'center', flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary }}>{item.Information ? item.Information : '-'}</TextViewHML>
                                </View>
                            </View>
                        </View >

                        {/* Transaction Id */}
                        {item.TrnId ?
                            <View style={{ flex: 1, marginTop: R.dimens.widgetMargin }}>
                                <View style={{ flexDirection: 'row', }}>
                                    <Text style={{ color: R.colors.listSeprator, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>{R.strings.txnid.toUpperCase()}</Text>
                                    <Separator style={{ flex: 1, justifyContent: 'center', }} />
                                </View>
                                <TextViewHML style={{ marginLeft: R.dimens.widget_left_right_margin, color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>{item.TrnId}</TextViewHML>
                            </View> : null
                        }

                        {/* Status and DateTime */}
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: R.dimens.widget_top_bottom_margin, marginLeft: R.dimens.widget_left_right_margin }}>
                            <StatusChip
                                value={item.StatusStr ? item.StatusStr : '-'}
                                color={color}></StatusChip>
                            <TextViewHML style={{ alignSelf: 'center', color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{convertDateTime(item.Date, 'YYYY-MM-DD HH:mm:ss', false)}</TextViewHML>
                        </View>
                    </CardView>
                </View>
            </AnimatableItem>
        )
    };
}

function mapStateToProps(state) {
    return {
        //Updates Data For Withdraw History Action
        WithdrawHistoryFetchData: state.WithdrawReducer.WithdrawHistoryFetchData,
        WithdrawHistorydata: state.WithdrawReducer.WithdrawHistorydata,
        WithdrawHistoryisFetching: state.WithdrawReducer.WithdrawHistoryisFetching,

        //Updated Data For Get Balance Action
        Balancedata: state.WithdrawReducer.Balancedata,
        BalanceFetchData: state.WithdrawReducer.BalanceFetchData,
    }
}

function mapDispatchToProps(dispatch) {

    return {
        //Perform Withdraw History Api Data 
        onWithdrawHistory: (withdrawHistoryRequest) => dispatch(OnWithdrawHistory(withdrawHistoryRequest)),

        //Perform Get Coin List Action
        GetBalance: () => dispatch(GetBalance()),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(WithdrawHistory)