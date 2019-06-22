import React, { Component } from 'react';
import {
    View,
    FlatList,
    RefreshControl,
    Easing,
    Image,
    Text
} from 'react-native';
import { connect } from 'react-redux';
import { onDepositHistory } from '../../actions/Wallet/DepositAction'
import CommonStatusBar from '../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../native_theme/components/CustomToolbar'
import { isCurrentScreen, addRouteToBackPress } from '../Navigation';
import FilterWidget from '../Widget/FilterWidget';
import { getCurrentDate, changeTheme, parseFloatVal, convertDateTime } from '../../controllers/CommonUtils';
import { DateValidation } from '../../validations/DateValidation';
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

class DepositHistory extends Component {

    constructor(props) {
        super(props);

        //Get Data From Previous Screen
        this.CurrencyData = this.props.navigation.state.params && this.props.navigation.state.params.data;

        //Define All initial State
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
        }

        //Add Current Screen to Manual Handling BackPress Events
        addRouteToBackPress(props);

        // create reference
        this.drawer = React.createRef();
        this.toast = React.createRef();

        //To Bind All Method
        this.onRefresh = this.onRefresh.bind(this);
        this.onResetPress = this.onResetPress.bind(this);
        this.onCompletePress = this.onCompletePress.bind(this);
        this.onTrnLinkPress = this.onTrnLinkPress.bind(this);
        this.onBackPress = this.onBackPress.bind(this);
        this.props.navigation.setParams({ onBackPress: this.onBackPress });
        //---------------
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

            //Bind Request For Deposit History
            let depositHistoryRequest = {
                FromDate: this.state.FromDate,
                ToDate: this.state.ToDate,
                Coin: this.state.symbol === R.strings.Please_Select ? '' : this.state.symbol,
            }

            //Call Get Deposit History API
            this.props.onDepositHistory(depositHistoryRequest);
            //----------

            if (this.CurrencyData) {
                try {
                    //Store Api Response Felid and display in Screen.
                    let WalletIems = [{ value: R.strings.Please_Select }];
                    for (var i = 0; i < this.CurrencyData.length; i++) {
                        let item = this.CurrencyData[i].SMSCode;
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

    // Reset FromDate and ToDate
    onResetPress = async () => {
        this.drawer.closeDrawer();
        this.setState({ FromDate: getCurrentDate(), ToDate: getCurrentDate(), searchInput: '', symbol: R.strings.Please_Select })

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Bind Request For Deposit History
            let depositHistoryRequest = {
                FromDate: getCurrentDate(),
                ToDate: getCurrentDate(),
                Coin: '',
            }

            //Call Get Deposit History API
            this.props.onDepositHistory(depositHistoryRequest);
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

                //Bind Request For Deposit History
                let depositHistoryRequest = {
                    FromDate: this.state.FromDate,
                    ToDate: this.state.ToDate,
                    Coin: this.state.symbol === R.strings.Please_Select ? '' : this.state.symbol,
                }

                //Call Get Deposit History API
                this.props.onDepositHistory(depositHistoryRequest);
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
            <SafeView style={{
                flex: 1,
                backgroundColor: R.colors.background
            }}>
                {/* For Toast */}
                <CommonToast ref={cmp => this.toast = cmp} styles={{ width: R.dimens.FilterDrawarWidth }} />

                {/* FilterWidget For From Date , To Date and Coin  */}
                <FilterWidget
                    FromDatePickerCall={(FromDate) => this.setState({ FromDate })}
                    ToDatePickerCall={(ToDate) => this.setState({ ToDate })}
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

    //For Swipe to referesh Functionality
    onRefresh = async () => {
        this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Bind Request For Deposit History
            let depositHistoryRequest = {
                FromDate: this.state.FromDate,
                ToDate: this.state.ToDate,
                Coin: this.state.symbol === R.strings.Please_Select ? '' : this.state.symbol,
            }

            //Call Get Deposit History API
            this.props.onDepositHistory(depositHistoryRequest);
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
        if (DepositHistory.oldProps !== props) {
            DepositHistory.oldProps = props;
        } else {
            return null;
        }

        // check for current screen
        if (isCurrentScreen(props)) {

            //Get All Updated Feild of Particular actions
            const { DepositHistorydata, DepositHistoryFetchData,
                Balancedata, BalanceFetchData } = props;

            //To Check CoinList Api Data Fetch Or Not
            if (!BalanceFetchData) {
                try {
                    if (validateResponseNew({ response: Balancedata, isList: true })) {

                        //Store Api Response Field and display in Screen.
                        let WalletIems = [{ value: R.strings.Please_Select }];
                        for (var i = 0; i < Balancedata.Response.length; i++) {

                            //Check IsWithdraw Bit 1 From response then Store All Coin in state
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
                    //Handle Catch and Notify User to Exception.
                }
            }

            //To Check Deposit History Data Fetch or Not
            if (!DepositHistoryFetchData) {
                try {
                    if (validateResponseNew({ response: DepositHistorydata, isList: true })) {

                        //check Deposit History Response is an Array Or not
                        //If Response is Array then Direct set in state otherwise conver response to Array form then set state.
                        var res = DepositHistorydata.Histories;
                        var resArr = [];
                        if (!Array.isArray(res)) {
                            resArr.push(res);
                        }
                        return {
                            ...state,
                            response: (Array.isArray(res)) ? res : resArr,
                            refreshing: false
                        };
                    }
                    else {
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

    //This Method Is used to open Address in Browser With Specific Link
    onTrnLinkPress = (item) => {
        try {
            let res = (item.hasOwnProperty('ExplorerLink')) ? JSON.parse(item.ExplorerLink) : '';
            Linking.openURL((res.length) ? res[0].Data + '/' + item.TrnID : item.TrnID);
        } catch (error) {
            //handle catch block here
        }
    }

    render() {

        //Get is Fetching value For All APIs to handle Progress bar in All Activity
        const { DepositIsFetching } = this.props;
        //----------

        //for final items from search input (validate on Amount and StatusStr)
        //default searchInput is empty so it will display all records.
        let finalItems = this.state.response.filter(item => (item.Amount.toString().includes(this.state.searchInput) || item.StatusStr.toLowerCase().includes(this.state.searchInput.toLowerCase())));

        return (
            //DrawerLayout for Deposit History Filteration
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
                        rightIcon={R.images.FILTER}
                        onRightMenuPress={() => this.drawer.openDrawer()}
                        title={R.strings.DepositHistory}
                        isBack={true}
                        onBackPress={this.onBackPress}
                        nav={this.props.navigation}
                        searchable={true}
                        onSearchText={(text) => this.setState({ searchInput: text })}
                    />

                    <View style={{ flex: 1 }}>
                        {/* To Check Response fetch or not if DepositIsFetching = true then display progress bar else display List*/}
                        {DepositIsFetching && !this.state.refreshing ?
                            <ListLoader />
                            :
                            <View style={{ flex: 1 }}>

                                {finalItems.length ?
                                    <View style={{ flex: 1 }}>

                                        <FlatList
                                            showsVerticalScrollIndicator={false}
                                            data={finalItems}
                                            /* render all item in list */
                                            renderItem={({ item, index }) => <FlatListItem
                                                item={item}
                                                index={index}
                                                size={this.state.response.length}
                                                onTrnIdPress={() => this.onTrnLinkPress(item)}
                                                onPress={() => {
                                                    this.props.navigation.navigate('DepositHistoryDetail', { item })
                                                }} ></FlatListItem>}
                                            /* assign index as key value to Deposit History list item */
                                            keyExtractor={(item, index) => index.toString()}
                                            /* For Refresh Functionality In Deposit History FlatList Item */
                                            refreshControl={
                                                <RefreshControl
                                                    colors={[R.colors.accent]}
                                                    progressBackgroundColor={R.colors.background}
                                                    refreshing={this.state.refreshing}
                                                    onRefresh={this.onRefresh}
                                                />
                                            } />
                                    </View>
                                    : !DepositIsFetching && <ListEmptyComponent module={R.strings.Deposit} onPress={() => this.props.navigation.navigate('CoinSelectScreen', { isAction: ServiceUtilConstant.From_Deposit })} />
                                }
                            </View>
                        }
                    </View>
                </SafeView>
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
        if (this.props.item === nextProps.item) {
            return false
        }
        return true
    }

    render() {

        // Get required field from props
        let item = this.props.item;
        let { index, size, } = this.props;

        let color = R.colors.accent;
        //To Display various Status Color in ListView
        if (item.Status == 0) {
            color = R.colors.textSecondary
        }
        if (item.Status == 1) {
            color = R.colors.successGreen
        }
        if (item.Status == 2) {
            color = R.colors.failRed
        }
        if (item.Status == 3) {
            color = R.colors.failRed
        }
        if (item.Status == 4) {
            color = R.colors.accent
        }
        if (item.Status == 5) {
            color = R.colors.sellerPink
        }
        if (item.Status == 6) {
            color = R.colors.accent
        }

        return (
            <AnimatableItem>
                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginLeft: R.dimens.widget_left_right_margin,
                    marginRight: R.dimens.widget_left_right_margin
                }
                }>
                    <CardView style={{
                        elevation: R.dimens.listCardElevation,
                        flex: 1,
                        borderRadius: 0,
                        flexDirection: 'column',
                        borderBottomLeftRadius: R.dimens.margin,
                        borderTopRightRadius: R.dimens.margin,
                    }}
                        onPress={this.props.onPress}>

                        <View style={{ flex: 1, flexDirection: 'row' }}>

                            {/* Currency Image */}
                            <ImageViewWidget url={item.CoinName ? item.CoinName : ''} width={R.dimens.IconWidthHeight} height={R.dimens.IconWidthHeight} />

                            <View style={{ flex: 1, marginLeft: R.dimens.widgetMargin, }}>

                                {/* Amount , Currecncy Name and Confirmation */}
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                                    <Text style={{ color: R.colors.listSeprator, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>{(parseFloatVal(item.Amount).toFixed(8).toString()) !== 'NaN' ? parseFloatVal(item.Amount).toFixed(8).toString() : '-'} {item.CoinName ? item.CoinName : '-'}</Text>
                                    <View style={{ flexDirection: 'row', }}>
                                        {item.Confirmations ?
                                            <View style={{ flexDirection: 'row', }}>
                                                <TextViewMR style={{ color: R.colors.yellow, fontSize: R.dimens.smallestText, }}>{validateValue(item.Confirmations)} </TextViewMR>
                                                <TextViewMR style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{R.strings.Conf}</TextViewMR>
                                            </View>
                                            : null
                                        }
                                        <Image
                                            source={R.images.RIGHT_ARROW_DOUBLE}
                                            style={{ marginLeft: R.dimens.widgetMargin, width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.textPrimary }}
                                        />
                                    </View>
                                </View>

                                {/* To Address */}
                                <View style={{ flexDirection: 'row', marginTop: R.dimens.widgetMargin }}>
                                    <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallText, }}>{R.strings.to} : </TextViewHML>
                                    <TextViewHML numberOfLines={1} ellipsizeMode="tail"
                                        style={{ flex: 1, alignSelf: 'center', color: R.colors.textPrimary, fontSize: R.dimens.smallestText, }}>{item.Address ? item.Address : '-'}</TextViewHML>
                                </View>

                                {/* Information */}
                                <View style={{ flexDirection: 'row', }}>
                                    <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallText, }}>{R.strings.Info} : </TextViewHML>
                                    <TextViewHML numberOfLines={1} ellipsizeMode="tail"
                                        style={{ flex: 1, alignSelf: 'center', color: R.colors.textPrimary, fontSize: R.dimens.smallestText, }}>{item.Information ? item.Information : '-'}</TextViewHML>
                                </View>
                            </View>
                        </View >

                        {/* Transaction Id */}
                        {item.TrnId ?
                            <View style={{ flex: 1, marginTop: R.dimens.widgetMargin, }}>
                                <View style={{ flexDirection: 'row', }}>
                                    <Text style={{ color: R.colors.listSeprator, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>{R.strings.txnid.toUpperCase()}</Text>
                                    <Separator style={{ flex: 1, justifyContent: 'center', }} />
                                </View>
                                <TextViewHML style={{ marginLeft: R.dimens.widget_left_right_margin, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{item.TrnId ? item.TrnId : '-'}</TextViewHML>
                            </View> : null
                        }

                        {/* Status and DateTime */}
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: R.dimens.widget_top_bottom_margin, marginLeft: R.dimens.widget_left_right_margin }}>
                            <StatusChip
                                color={color}
                                value={item.StatusStr ? item.StatusStr : '-'}></StatusChip>
                            <TextViewHML style={{ alignSelf: 'center', color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{convertDateTime(item.Date, 'YYYY-MM-DD HH:mm:ss', false)}</TextViewHML>
                        </View>
                    </CardView>
                </View>
            </AnimatableItem>
        )
    };
}

const mapStateToProps = (state) => {
    return {
        //Updated Data For Deposit History Action
        DepositHistorydata: state.DepositReducer.DepositHistorydata,
        DepositHistoryFetchData: state.DepositReducer.DepositHistoryFetchData,
        DepositIsFetching: state.DepositReducer.DepositIsFetching,
        
        //Updated Data For Get Balance Action
        Balancedata: state.DepositReducer.Balancedata,
        BalanceFetchData: state.DepositReducer.BalanceFetchData,
    }
};

const mapDispatchToProps = (dispatch) => ({
    //Perform Deposit History Action
    onDepositHistory: (depositHistoryRequest) => dispatch(onDepositHistory(depositHistoryRequest)),
    
    //Perform Get Coin List Action
    GetBalance: () => dispatch(GetBalance()),
});

export default connect(mapStateToProps, mapDispatchToProps)(DepositHistory);