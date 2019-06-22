import React, { Component } from 'react';
import { View, FlatList, Easing, RefreshControl, Text } from 'react-native';
import { connect } from 'react-redux'
import { isCurrentScreen, addRouteToBackPress } from '../Navigation'
import CommonStatusBar from '../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../native_theme/components/CustomToolbar'
import ListLoader from '../../native_theme/components/ListLoader';
import { contentContainerStyle, ListEmptyComponent } from '../../native_theme/components/FlatListWidgets';
import Separator from '../../native_theme/components/Separator';
import { fetchUserLedgerList } from '../../actions/Reports/UserLedgerAction';
import { getWallets } from '../../actions/PairListAction';
import { isInternet, validateResponseNew, isEmpty } from '../../validations/CommonValidation';
import { parseArray, changeTheme, addPages, getCurrentDate, parseFloatVal, convertDateTime } from '../../controllers/CommonUtils';
import { DateValidation } from '../../validations/DateValidation';
import CommonToast from '../../native_theme/components/CommonToast';
import Drawer from 'react-native-drawer-menu';
import FilterWidget from '../Widget/FilterWidget';
import PaginationWidget from '../Widget/PaginationWidget';
import R from '../../native_theme/R';
import { AppConfig } from '../../controllers/AppConfig';
import CardView from '../../native_theme/components/CardView';
import StatusChip from '../Widget/StatusChip';
import TextViewMR from '../../native_theme/components/TextViewMR';
import TextViewHML from '../../native_theme/components/TextViewHML';
import { Fonts } from '../../controllers/Constants';
import AnimatableItem from '../../native_theme/components/AnimatableItem';
import SafeView from '../../native_theme/components/SafeView';

class UserLedgerHistoryResult extends Component {

    constructor(props) {
        super(props);

        // get data from Previous Screen
        var { params } = props.navigation.state

        //Define All initial State
        this.state = {
            response: [],
            refreshing: false,
            searchInput: '',
            stFromDate: params.FromDate,
            stToDate: params.ToDate,
            WalletListData: params.WalletListData,
            WalletList: params.WalletList,
            coinname: params.coinname,
            AccWalletId: params.AccWalletId,
            PageNo: 0,
            row: [],
        };

        //Add Current Screen to Manual Handling BackPress Events
        addRouteToBackPress(props);

        //Bind all Method
        this.onRefresh = this.onRefresh.bind(this);
        this.onPageChange = this.onPageChange.bind(this);
        this.onCompletePress = this.onCompletePress.bind(this);
        this.onResetPress = this.onResetPress.bind(this);
        this.onBackPress = this.onBackPress.bind(this);

        this.props.navigation.setParams({ onBackPress: this.onBackPress });

        // create reference
        this.drawer = React.createRef();
        this.toast = React.createRef();
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

    //For Swipe to referesh Functionality
    async onRefresh() {

        this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Call Get User Ledger History API
            const requestUserLedger = {
                FromDate: this.state.stFromDate,
                ToDate: this.state.stToDate,
                WalletId: this.state.AccWalletId,
                PageNo: this.state.PageNo,
                PageSize: AppConfig.pageSize
            }
            // call user ledger API
            this.props.fetchUserLedgerList(requestUserLedger)
            //----------
        } else {
            this.setState({ refreshing: false });
        }
    }

    // Pagination Method Called When User Change Page  
    async onPageChange(pageNo) {

        //if user selecte other page number then and only then API Call else no need to call API
        if ((pageNo - 1) !== this.state.PageNo) {
            this.setState({ PageNo: (pageNo - 1), });

            //Check NetWork is Available or not
            if (await isInternet()) {

                //Call Get User Ledger History API
                const requestUserLedger = {
                    FromDate: this.state.stFromDate,
                    ToDate: this.state.stToDate,
                    WalletId: this.state.AccWalletId,
                    PageNo: this.state.PageNo,
                    PageSize: AppConfig.pageSize
                }
                // call user ledger API
                this.props.fetchUserLedgerList(requestUserLedger)
            } else {
                this.setState({ refreshing: false });
            }
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        // stop twice api call
        return isCurrentScreen(nextProps);
    };

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        if (this.props.userLedgerResult.WalletList === null) {

            // Check internet connection or not
            if (await isInternet()) {

                // Call Wallet List Api
                this.props.getWallets()
            }
        }
    };

    static oldProps = {};

    static getDerivedStateFromProps(props, state) {

        // To Skip Render if old and new props are equal
        if (UserLedgerHistoryResult.oldProps !== props) {
            UserLedgerHistoryResult.oldProps = props;
        } else {
            return null;
        }

        // check for current screen
        if (isCurrentScreen(props)) {

            // Fetch Data from Reducer
            const { UserLedgerData, WalletList } = props.userLedgerResult

            // To check UserLedgerData is null or not
            if (UserLedgerData) {

                try {
                    if (state.userLedger == null || (state.userLedger != null && UserLedgerData !== state.userLedger)) {
                        if (validateResponseNew({ response: UserLedgerData, isList: true })) {

                            //check User Ledger Response is an Array Or not
                            //If Response is Array then Direct set in state otherwise conver response to Array form then set state.
                            let res = parseArray(UserLedgerData.WalletLedgers);
                            return Object.assign({}, state, {
                                response: res, refreshing: false, row: addPages(UserLedgerData.TotalCount), userLedger: UserLedgerData
                            });
                        } else {
                            return Object.assign({}, state, {
                                refreshing: false, response: [], userLedger: UserLedgerData
                            })
                        }
                    }
                } catch (error) {
                    return Object.assign({}, state, {
                        refreshing: false, response: [], userLedger: UserLedgerData
                    })
                }
            }

            // To check WalletList is null or not
            if (WalletList) {
                try {
                    if (state.WalletListData == null || (state.WalletListData != null && WalletList !== state.WalletListData)) {
                        if (validateResponseNew({ response: WalletList, isList: true })) {

                            let tempList = WalletList.Wallets;
                            tempList.map((el, index) => {
                                tempList[index].value = el.WalletName;
                            })

                            return Object.assign({}, state, {
                                WalletList: tempList,
                                WalletListData: WalletList,
                                coinname: tempList[0].WalletName,
                            })
                        } else {
                            return Object.assign({}, state, {
                                WalletList: [],
                                WalletListData: WalletList,
                                coinname: ''
                            })
                        }
                    }
                } catch (error) {
                    return Object.assign({}, state, {
                        WalletList: [],
                        WalletListData: WalletList,
                        coinname: ''
                    })
                }
            }
        }
        return null;
    }

    async onCompletePress() {

        //Check All From Date and To Date Validation
        if (DateValidation(this.state.stFromDate, this.state.stToDate)) {
            this.refs.Toast.Show(DateValidation(this.state.stFromDate, this.state.stToDate));
            return;
        }
        if (isEmpty(this.state.coinname)) {
            this.refs.Toast.Show(R.strings.Select_Wallet)
            return;
        } else {

            //Check NetWork is Available or not
            if (await isInternet()) {

                //Call Get User Ledger History API
                const requestUserLedger = {
                    FromDate: this.state.stFromDate,
                    ToDate: this.state.stToDate,
                    WalletId: this.state.AccWalletId,
                    PageNo: this.state.PageNo,
                    PageSize: AppConfig.pageSize
                }
                // call user ledger API
                this.props.fetchUserLedgerList(requestUserLedger)
                //----------
            } else {
                this.setState({ refreshing: false });
            }

            // Close Drawer user press on Complete button bcoz display flatlist item on Screen
            this.drawer.closeDrawer();
        }
    }

    // Reset Filter
    async onResetPress() {

        // set initial state
        this.setState({
            stFromDate: getCurrentDate(),
            stToDate: getCurrentDate(),
            coinname: this.state.WalletList[0].WalletName,
            PageNo: 0,
            AccWalletId: this.state.WalletList[0].AccWalletID
        })

        // Close Drawer user press on Complete button bcoz display flatlist item on Screen
        this.drawer.closeDrawer();

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Call Get User Ledger History API
            const requestUserLedger = {
                FromDate: this.state.stFromDate,
                ToDate: this.state.stToDate,
                WalletId: this.state.AccWalletId,
                PageNo: this.state.PageNo,
                PageSize: AppConfig.pageSize
            }
            // call user ledger API
            this.props.fetchUserLedgerList(requestUserLedger)
            //----------
        } else {
            this.setState({ refreshing: false });
        }
    }

    //Navigation Drawer Functionality
    navigationDrawer = () => {
        return (
            <SafeView style={this.styles().container}>

                {/* for display Toast */}
                <CommonToast ref="Toast" styles={{ width: R.dimens.FilterDrawarWidth }} />

                {/* for display fromdate todate and wallet list */}
                <FilterWidget
                    FromDatePickerCall={(date) => this.setState({ stFromDate: date })}
                    FromDate={this.state.stFromDate}
                    ToDatePickerCall={(date) => this.setState({ stToDate: date })}
                    ToDate={this.state.stToDate}
                    onResetPress={this.onResetPress}
                    onCompletePress={this.onCompletePress}
                    firstPicker={{
                        title: R.strings.Select_Wallet,
                        array: this.state.WalletList,
                        selectedValue: this.state.coinname,
                        onPickerSelect: (item, object) => {
                            if (item !== this.state.coinname) {
                                this.setState({ coinname: item, AccWalletId: object.AccWalletID })
                            }
                        }
                    }}
                />
            </SafeView>
        )
    }

    render() {

        //Get is Fetching value For All APIs to handle Progress bar in Activity
        var { isFetchingUserLedger } = this.props.userLedgerResult

        //for final items from search input (validate on CrAmount, DrAmount)
		//default searchInput is empty so it will display all records.
        let finalItems
        if (this.state.response != undefined) {
            finalItems = this.state.response.filter(item => ('' + item.CrAmount).includes(this.state.searchInput) || ('' + item.DrAmount).includes(this.state.searchInput))
        }

        return (
            // DrawerLayout for Order History Filteration
            <Drawer
                ref={cmp => this.drawer = cmp}
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
                        title={R.strings.UserLedger}
                        isBack={true}
                        onBackPress={this.onBackPress}
                        rightIcon={R.images.FILTER}
                        onRightMenuPress={() => this.drawer.openDrawer()}
                        nav={this.props.navigation}
                        searchable={true}
                        onSearchText={(text) => this.setState({ searchInput: text })}
                    />

                    <View style={{ flex: 1, justifyContent: 'space-between' }}>

                        {/* To Check Response fetch or not if isFetchingUserLedger = true then display progress bar else display List*/}
                        {
                            (isFetchingUserLedger && !this.state.refreshing)
                                ?
                                <ListLoader />
                                :
                                <View style={{ flex: 1 }}>

                                    {finalItems.length ?
                                        <View style={{ flex: 1 }}>
                                            <FlatList
                                                showsVerticalScrollIndicator={false}
                                                data={finalItems}
                                                /* render all item in list */
                                                renderItem={({ item, index }) => <FlatListItem item={item}
                                                    index={index}
                                                    size={this.state.response.length}
                                                ></FlatListItem>}
                                                keyExtractor={(item, index) => index.toString()}
                                                /* For Refresh Functionality In User Ledger FlatList Item */
                                                refreshControl={
                                                    <RefreshControl
                                                        colors={[R.colors.accent]}
                                                        progressBackgroundColor={R.colors.background}
                                                        refreshing={this.state.refreshing}
                                                        onRefresh={this.onRefresh}
                                                    />
                                                }
                                                contentContainerStyle={contentContainerStyle(finalItems ? finalItems : [])}
                                            />
                                        </View>
                                        :
                                        <ListEmptyComponent />
                                    }
                                </View>
                        }

                        {/*To Set Pagination View  */}
                        <View>
                            {finalItems.length > 0 &&
                                <PaginationWidget row={this.state.row} selectedPage={this.state.PageNo + 1} onPageChange={(item) => { this.onPageChange(item) }} />
                            }
                        </View>
                    </View>
                </SafeView>
            </Drawer>
        );
    }

    styles = () => {
        return {
            container: {
                flex: 1,
                backgroundColor: R.colors.background,
            },
        }
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

        // Get required fields from props
        let item = this.props.item
        let { index, size } = this.props;

        let crColor = ''
        let drColor = ''

        // for credit amount
        if (item.CrAmount != 0)
            crColor = R.colors.successGreen
        else
            crColor = R.colors.textSecondary

        // for debit amount
        if (item.DrAmount != 0)
            drColor = R.colors.failRed
        else
            drColor = R.colors.textSecondary

        return (
            <AnimatableItem>
                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginLeft: R.dimens.widget_left_right_margin,
                    marginRight: R.dimens.widget_left_right_margin
                }}>
                    <CardView style={{
                        elevation: R.dimens.listCardElevation,
                        flex: 1,
                        borderRadius: 0,
                        flexDirection: 'column',
                        borderBottomLeftRadius: R.dimens.margin,
                        borderTopRightRadius: R.dimens.margin,
                    }}>
                        <View>

                            {/*for show transaction Id  */}
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ flex: 1, fontSize: R.dimens.smallText, color: R.colors.textPrimary, fontFamily: Fonts.MontserratSemiBold, }}>
                                    {R.strings.TrnId + " : " + item.LedgerId}
                                </Text>
                                <TextViewMR style={{ flex: 1, fontSize: R.dimens.smallText, color: R.colors.yellow, textAlign: 'right' }}>
                                    {parseFloatVal(item.Amount).toFixed(8).toString()}
                                </TextViewMR>
                            </View>

                            {/* for Show Remarks */}
                            <TextViewHML style={{ flex: 1, color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{item.Remarks}</TextViewHML>

                            {/* for show pre and post balance */}
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.Pre_Bal}</TextViewHML>
                                    <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, }}>{item.PreBal.toFixed(8)}</TextViewHML>
                                </View>
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.Post_Bal}</TextViewHML>
                                    <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, }}>{item.PostBal.toFixed(8)}</TextViewHML>
                                </View>
                            </View>

                            {/* for show horizontal line */}
                            <Separator style={{ marginTop: R.dimens.widgetMargin, marginLeft: 0, marginRight: 0 }} />

                            {/* for show Cr amount */}
                            <View style={{ flexDirection: 'row', marginTop: R.dimens.widgetMargin }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignContent: 'center', }}>
                                    <StatusChip
                                        color={crColor}
                                        value={R.strings.Cr}></StatusChip>

                                    <TextViewHML style={{ marginLeft: R.dimens.widgetMargin, color: crColor, fontSize: R.dimens.smallText }}>{parseFloatVal(item.CrAmount).toFixed(8).toString()}</TextViewHML>
                                </View>
                            </View>

                            {/* for show Dr. Amount */}
                            <View style={{ flexDirection: 'row', marginTop: R.dimens.widgetMargin, alignItems: 'center' }}>
                                <View style={{ width: '50%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                    <StatusChip
                                        color={drColor}
                                        value={R.strings.Dr}></StatusChip>

                                    <TextViewHML style={{ marginLeft: R.dimens.widgetMargin, color: drColor, fontSize: R.dimens.smallText }}>{parseFloatVal(item.DrAmount).toFixed(8).toString()}</TextViewHML>
                                </View>
                                <View style={{ justifyContent: 'flex-end', width: '50%' }}>
                                    <TextViewHML style={{ textAlign: 'right', color: R.colors.textSecondary, fontSize: R.dimens.secondCurrencyText, textAlign: 'right' }}>{convertDateTime(item.TrnDate, 'YYYY-MM-DD HH:mm:ss A', false)}</TextViewHML>
                                </View>
                            </View>
                        </View>
                    </CardView>
                </View>
            </AnimatableItem>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        // Updated Data for User ledger 
        userLedgerResult: state.UserLedgerReducer,
        // Updated Data for Coin List
        coinResult: state.CoinReducer,
    }
}

const mapDispatchToProps = (dispatch) => ({
    // perform user ledger list Action
    fetchUserLedgerList: (requestUserLedger) => dispatch(fetchUserLedgerList(requestUserLedger)),
    
    // perform get Wallet Action
    getWallets: () => dispatch(getWallets()),
})

export default connect(mapStateToProps, mapDispatchToProps)(UserLedgerHistoryResult);