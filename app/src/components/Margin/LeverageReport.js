import React, { Component } from 'react';
import { View, FlatList, RefreshControl, Image, Easing, Text } from 'react-native';
import { connect } from 'react-redux';
import { getLeverageReportList } from '../../actions/Margin/LeverageReportAction'
import CommonStatusBar from '../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../native_theme/components/CustomToolbar'
import { isCurrentScreen, addRouteToBackPress } from '../Navigation';
import PaginationWidget from '../Widget/PaginationWidget'
import { changeTheme, parseArray, addPages, parseFloatVal, convertDateTime } from '../../controllers/CommonUtils';
import { isInternet, validateResponseNew, validateValue } from '../../validations/CommonValidation';
import ListLoader from '../../native_theme/components/ListLoader';
import { ListEmptyComponent } from '../../native_theme/components/FlatListWidgets';
import R from '../../native_theme/R';
import Drawer from 'react-native-drawer-menu';
import CommonToast from '../../native_theme/components/CommonToast';
import FilterWidget from '../Widget/FilterWidget';
import ImageViewWidget from '../Widget/ImageViewWidget';
import { GetBalance } from '../../actions/PairListAction';
import { DateValidation } from '../../validations/DateValidation';
import CardView from '../../native_theme/components/CardView';
import StatusChip from '../Widget/StatusChip';
import TextViewHML from '../../native_theme/components/TextViewHML';
import { Fonts } from '../../controllers/Constants';
import { AppConfig } from '../../controllers/AppConfig';
import AnimatableItem from '../../native_theme/components/AnimatableItem';
import SafeView from '../../native_theme/components/SafeView';
import ImageTextButton from '../../native_theme/components/ImageTextButton';

class LeverageReport extends Component {

    _isMounted = false;

    constructor(props) {
        super(props);

        //Define All State initial state
        this.state = {
            FromDate: '',
            ToDate: '',
            row: [],
            Page: 0,
            PageSize: AppConfig.pageSize,
            response: [],
            searchInput: '',
            refreshing: false,
            WalletTypeId: '',
            selectedCurrency: R.strings.Please_Select,
            statusList: R.strings.historyStatusList,
            selectedStatus: R.strings.historyStatusList[0].code,
            selectedStatusValue: R.strings.Please_Select,
            isFirstTime: true,
            currencyItem: [],
            isDrawerOpen: false, // First Time Drawer is Closed
        };

        //Add Current Screen to Manual Handling BackPress Events
        addRouteToBackPress(props);

        //To Bind All Method
        this.onPageChange = this.onPageChange.bind(this);
        this.onRefresh = this.onRefresh.bind(this);
        this.onResetPress = this.onResetPress.bind(this);
        this.onCompletePress = this.onCompletePress.bind(this);
        this.onBackPress = this.onBackPress.bind(this);

        // for call previous screen method
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

    componentDidMount = async () => {
        this._isMounted = true;

        //Add this method to change theme based on stored theme name.
        changeTheme();

        if (this._isMounted) {

            //Check NetWork is Available or not
            if (await isInternet()) {

                // Bind request for Leverage Report
                const request = {
                    FromDate: this.state.FromDate,
                    ToDate: this.state.ToDate,
                    Page: this.state.Page,
                    PageSize: AppConfig.pageSize,
                    WalletTypeId: this.state.WalletTypeId,
                    Status: this.state.selectedStatus === this.state.statusList[0].code ? '' : this.state.selectedStatus,
                }

                //Call Get Leverage Report API
                this.props.getLeverageReportList(request);
                //----------

                //Call API to get Wallet Type List
                this.props.GetBalance();
            }
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    //For Swipe to referesh Functionality
    onRefresh = async (refreshing = true) => {
        this.setState({ refreshing: refreshing });

        //Check NetWork is Available or not
        if (await isInternet()) {

            // Bind request for Leverage Report
            const request = {
                FromDate: this.state.FromDate,
                ToDate: this.state.ToDate,
                Page: this.state.Page,
                PageSize: AppConfig.pageSize,
                WalletTypeId: this.state.WalletTypeId,
                Status: this.state.selectedStatus === this.state.statusList[0].code ? '' : this.state.selectedStatus,
            }
            //Call Get Leverage Report API
            this.props.getLeverageReportList(request);
            //----------
        } else {
            this.setState({ refreshing: false });
        }
    }

    // Pagination Method Called When User Change Page  
    onPageChange = async (pageNo) => {

        //if user selecte other page number then and only then API Call elase no need to call API
        this.setState({ Page: (pageNo - 1), });

        //Check NetWork is Available or not
        if (await isInternet()) {

            // Bind request for Leverage Report
            const request = {
                FromDate: this.state.FromDate,
                ToDate: this.state.ToDate,
                Page: this.state.Page,
                PageSize: AppConfig.pageSize,
                WalletTypeId: this.state.WalletTypeId,
                Status: this.state.selectedStatus === this.state.statusList[0].code ? '' : this.state.selectedStatus,
            }
            //Call Get Leverage Report API
            this.props.getLeverageReportList(request);
            //----------
        } else {
            this.setState({ refreshing: false });
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        return isCurrentScreen(nextProps);
    };

    static oldProps = {};

    static getDerivedStateFromProps(props, state) {

        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return { ...state, isFirstTime: false, };
        }

        // To Skip Render if old and new props are equal
        if (LeverageReport.oldProps !== props) {
            LeverageReport.oldProps = props;
        } else {
            return null;
        }

        // check for current screen
        if (isCurrentScreen(props)) {

            //Get All Updated Feild of Particular actions
            const { LeverageReportdata, LeverageReportFetchData,
                WalletTypeFetchData, WalletTypedata } = props;

            //To Check Currency List Api Data Fetch Or Not
            if (!WalletTypeFetchData) {
                try {
                    if (validateResponseNew({ response: WalletTypedata, isList: true })) {

                        //Store Api Response Felid and display in Screen.
                        let res = parseArray(WalletTypedata.Response);
                        res.map((item, index) => {
                            res[index].value = item.SMSCode;
                        })

                        let currencyItem = [{ value: R.strings.Please_Select }, ...res];
                        return { ...state, currencyItem, }
                    }
                    else {
                        return { ...state, currencyItem: [{ value: R.strings.Please_Select }], }
                    }
                } catch (e) {
                    return { ...state, currencyItem: [{ value: R.strings.Please_Select }], }
                }
            }

            //To Check Leverage Report Data Fetch or Not
            if (!LeverageReportFetchData) {
                try {

                    //if balance has records and Leverage Report has success response then get arrays.
                    if (validateResponseNew({ response: LeverageReportdata, isList: true })) {
                        //Get array from response
                        let response = parseArray(LeverageReportdata.Data)
                        //Set State For Api response 
                        return {
                            ...state,
                            response: response,
                            refreshing: false,
                            row: addPages(LeverageReportdata.TotalCount)
                        }
                    } else {
                        return {
                            ...state,
                            response: [],
                            refreshing: false,
                            row: [],
                        }
                    }
                } catch (e) {
                    return {
                        ...state,
                        response: [],
                        refreshing: false,
                        row: [],
                    }
                }
            }

        }
        return null;
    }

    // Drawer Navigation
    navigationDrawer() {
        return (
            <SafeView style={{
                flex: 1,
                backgroundColor: R.colors.background
            }}>

                {/* For Display Toast Message */}
                <CommonToast ref={cmp => this.toast = cmp} styles={{ width: R.dimens.FilterDrawarWidth }} />

                {/* for show filter of fromdate, todate,currency and status data */}
                <FilterWidget
                    isCancellable
                    FromDatePickerCall={(FromDate) => this.setState({ FromDate })}
                    ToDatePickerCall={(ToDate) => this.setState({ ToDate })}
                    FromDate={this.state.FromDate}
                    ToDate={this.state.ToDate}
                    onResetPress={this.onResetPress}
                    onCompletePress={this.onCompletePress}
                    comboPickerStyle={{ marginTop: 0 }}
                    pickers={[
                        {
                            title: R.strings.Currency,
                            array: this.state.currencyItem,
                            selectedValue: this.state.selectedCurrency,
                            onPickerSelect: (index, object) => this.setState({ selectedCurrency: index, WalletTypeId: object.WalletTypeID })
                        },
                        {
                            title: R.strings.Status,
                            array: this.state.statusList,
                            selectedValue: this.state.selectedStatusValue,
                            onPickerSelect: (index, object) => this.setState({ selectedStatusValue: index, selectedStatus: object.code })
                        }
                    ]}
                ></FilterWidget>
            </SafeView>
        )
    }

    // Reset Filter
    onResetPress = async () => {
        this._isMounted = true;

        if (this._isMounted) {
            this.drawer.closeDrawer();

            // set Initial State
            this.setState({
                Page: 0,
                PageSize: AppConfig.pageSize,
                selectedStatusValue: R.strings.Please_Select,
                selectedStatus: this.state.statusList[0].code,
                FromDate: '',
                ToDate: '',
                searchInput: '',
                WalletTypeId: '',
                selectedCurrency: R.strings.Please_Select,
                selectedUsageType: R.strings.Please_Select,
                WalletUsageType: '',
            })

            //Check NetWork is Available or not
            if (await isInternet()) {

                // Bind request for Leverage Report
                const request = {
                    FromDate: '',
                    ToDate: '',
                    Page: 0,
                    PageSize: AppConfig.pageSize,
                    WalletTypeId: '',
                    Status: '',
                }

                //Call Get Leverage Report API
                this.props.getLeverageReportList(request);
                //----------
            } else {
                this.setState({ refreshing: false });
            }
        }
    }

    // Api Call when press on complete button
    onCompletePress = async () => {

        // check from date and to date validation
        if (this.state.FromDate == "" && this.state.ToDate !== "" || this.state.FromDate !== "" && this.state.ToDate == "") {
            this.toast.Show(R.strings.bothDateRequired);
            return
        }

        //Check All From Date Validation
        if (DateValidation(this.state.FromDate, this.state.ToDate, true)) {
            this.toast.Show(DateValidation(this.state.FromDate, this.state.ToDate, true));
            return;
        }
        else {
            this._isMounted = true;

            if (this._isMounted) {
                // Close Drawer user press on Complete button bcoz display flatlist item on Screen
                this.drawer.closeDrawer();

                this.setState({
                    Page: 0,
                    PageSize: AppConfig.pageSize,
                })

                //Check NetWork is Available or not
                if (await isInternet()) {

                    // Bind request for Leverage Report
                    const request = {
                        FromDate: this.state.FromDate,
                        ToDate: this.state.ToDate,
                        Page: 0,
                        PageSize: AppConfig.pageSize,
                        WalletTypeId: this.state.WalletTypeId,
                        Status: this.state.selectedStatus === this.state.statusList[0].code ? '' : this.state.selectedStatus,
                    }

                    //Call Get Leverage Report API
                    this.props.getLeverageReportList(request);
                    //----------
                } else {
                    this.setState({ refreshing: false });
                }
                //If Filter from Complete Button Click then empty searchInput
                this.setState({ searchInput: '' })
            }
        }
    }

    render() {

        //Get is Fetching value For All APIs to handle Progress bar in All Activity
        const { LeverageReportisFetching } = this.props;

        //for final items from search input (validate on Amount, WalletTypeName, UserName, SystemRemarks)
        //default searchInput is empty so it will display all records.
        let finalItems = this.state.response.filter(item => ((('' + item.Amount).includes(this.state.searchInput) ||
            item.WalletTypeName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
            item.UserName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
            item.SystemRemarks.toLowerCase().includes(this.state.searchInput.toLowerCase()))));

        return (

            //DrawerLayout for Withdraw History Filteration
            <Drawer
                ref={cmpDrawer => this.drawer = cmpDrawer}
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
                        title={R.strings.LeverageReport}
                        isBack={true}
                        onBackPress={this.onBackPress}
                        nav={this.props.navigation}
                        searchable={true}
                        onSearchText={(text) => this.setState({ searchInput: text })} />

                    {/* Display Data in CardView */}
                    <View style={{ flex: 1, justifyContent: 'space-between' }}>

                        {/* To Check Response fetch or not if LeverageReportisFetching = true then display progress bar else display List*/}
                        {LeverageReportisFetching && !this.state.refreshing ?
                            <ListLoader />
                            :
                            <View style={{ flex: 1 }}>

                                {finalItems.length > 0 ?
                                    <View style={{ flex: 1 }}>

                                        <FlatList
                                            data={finalItems}
                                            showsVerticalScrollIndicator={false}
                                            /* render all item in list */
                                            renderItem={({ index, item }) => <FlatListItem
                                                index={index}
                                                item={item}
                                                size={this.state.response.length}
                                                onPress={() => {
                                                    this.props.navigation.navigate('LeverageReportDetail', { item })
                                                }}
                                            ></FlatListItem>}
                                            /* assign index as key valye to Withdrawal list item */
                                            keyExtractor={(item, index) => index.toString()}
                                            /* For Refresh Functionality In Withdrawal FlatList Item */
                                            refreshControl={
                                                <RefreshControl
                                                    colors={[R.colors.accent]}
                                                    progressBackgroundColor={R.colors.background}
                                                    refreshing={this.state.refreshing}
                                                    onRefresh={this.onRefresh}
                                                />
                                            } />
                                    </View>
                                    : <ListEmptyComponent />
                                }
                            </View>
                        }
                        <View>

                            {/*To Set Pagination View  */}
                            {finalItems.length > 0 &&
                                <PaginationWidget row={this.state.row} selectedPage={this.state.Page + 1} onPageChange={(item) => { this.onPageChange(item) }} />
                            }
                        </View>
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

        // Get required fields from props
        let { index, size, item, onPress } = this.props;

        //To Display various Status Color in ListView
        let color = R.colors.accent;

        if (item.Status === 0) {
            color = R.colors.textSecondary
        }
        if (item.Status === 1) {
            color = R.colors.successGreen
        }
        if (item.Status === 3) {
            color = R.colors.failRed
        }
        if (item.Status === 6) {
            color = R.colors.accent
        }
        if (item.Status === 9) {
            color = R.colors.failRed
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
                }}>
                    <CardView style={{
                        elevation: R.dimens.listCardElevation,
                        flex: 1,
                        borderRadius: 0,
                        flexDirection: 'column',
                        borderBottomLeftRadius: R.dimens.margin,
                        borderTopRightRadius: R.dimens.margin,
                    }} onPress={onPress}>

                        <View>
                            <View style={{ flex: 1, flexDirection: 'row' }}>

                                {/* Currency Image */}
                                <ImageViewWidget url={item.WalletTypeName ? item.WalletTypeName : ''} width={R.dimens.drawerMenuIconWidthHeight} height={R.dimens.drawerMenuIconWidthHeight} />

                                <View style={{ flex: 1, marginLeft: R.dimens.widgetMargin, }}>

                                    {/* for show username and  creadit amount */}
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                                        <Text style={{ color: R.colors.listSeprator, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>{item.UserName}</Text>

                                        <View style={{ flexDirection: 'row', }}>
                                            <Text style={{ color: R.colors.yellow, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>
                                                {(parseFloatVal(item.CreditAmount).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(item.CreditAmount).toFixed(8)) : '-') + " " + item.WalletTypeName}
                                            </Text>
                                            <Image
                                                source={R.images.RIGHT_ARROW_DOUBLE}
                                                style={{ marginLeft: R.dimens.widgetMargin, width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.textPrimary }}
                                            />
                                        </View>
                                    </View>

                                    {/* for show fromwallte and toWallte name */}
                                    <View style={{ flexDirection: 'row', flex: 1 }}>
                                        <Text style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, fontFamily: Fonts.MontserratSemiBold, }}>{R.strings.wallet + " : "}</Text>
                                        <Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText, fontFamily: Fonts.MontserratSemiBold, }}>{item.FromWalletName}</Text>
                                        <Image
                                            source={R.images.IC_RIGHT_LONG_ARROW}
                                            style={{ marginLeft: R.dimens.widgetMargin, marginRight: R.dimens.widgetMargin, width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.textPrimary }}
                                        />
                                        <Text style={{ flex: 1, color: R.colors.textPrimary, fontSize: R.dimens.smallestText, fontFamily: Fonts.MontserratSemiBold, }}>{item.ToWalletName}</Text>
                                    </View>

                                </View>
                            </View >

                            {/* for show Amount, charge and leverage amount */}
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>

                                <View style={{ width: '30%', alignItems: 'center', }}>
                                    <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, fontFamily: Fonts.MontserratSemiBold, }}>{R.strings.Amount}</TextViewHML>
                                    <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText, fontFamily: Fonts.MontserratSemiBold, }}>
                                        {(parseFloatVal(item.Amount).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(item.Amount).toFixed(8)) : '-')}
                                    </TextViewHML>
                                </View>

                                <View style={{ width: '40%', alignItems: 'center', }}>
                                    <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.Charge}</TextViewHML>
                                    <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>
                                        {(parseFloatVal(item.ChargeAmount).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(item.ChargeAmount).toFixed(8)) : '-')}
                                    </TextViewHML>
                                </View>

                                <View style={{ width: '30%', alignItems: 'center', }}>
                                    <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.levAmount}</TextViewHML>
                                    <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>
                                        {(parseFloatVal(item.LeverageAmount).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(item.LeverageAmount).toFixed(8)) : '-')}
                                    </TextViewHML>
                                    <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>   {item.LeveragePer + " % " + R.strings.lev}
                                    </TextViewHML>
                                </View>
                            </View>

                            {/* for show status and DateTime */}
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <StatusChip
                                    color={color}
                                    value={item.StrStatus ? item.StrStatus : '-'}></StatusChip>

                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                    <ImageTextButton
                                        style={{ margin: 0, paddingRight: R.dimens.LineHeight, }}
                                        icon={R.images.IC_TIMER}
                                        iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
                                    />
                                    <TextViewHML style={{ alignSelf: 'center', color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{convertDateTime(item.TrnDate, 'YYYY-MM-DD HH:mm:ss', false)}</TextViewHML>
                                </View>
                            </View>
                        </View>
                    </CardView>
                </View>
            </AnimatableItem>
        )
    };
}

function mapStateToProps(state) {
    return {
        //Updates Data For Leverage Report Action
        LeverageReportFetchData: state.LeverageReportReducer.LeverageReportFetchData,
        LeverageReportdata: state.LeverageReportReducer.LeverageReportdata,
        LeverageReportisFetching: state.LeverageReportReducer.LeverageReportisFetching,

        //Updates Data For Wallet Type Data
        WalletTypeFetchData: state.LeverageReportReducer.WalletTypeFetchData,
        WalletTypedata: state.LeverageReportReducer.WalletTypedata,

    }
}

function mapDispatchToProps(dispatch) {

    return {
        //Perform Leverage Report Api Data 
        getLeverageReportList: (request) => dispatch(getLeverageReportList(request)),

        // Perform get Balance Action
        GetBalance: () => dispatch(GetBalance()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LeverageReport)