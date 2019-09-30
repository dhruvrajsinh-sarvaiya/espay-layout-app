import React, { Component } from 'react';
import { View, FlatList, Easing, RefreshControl, Text, Image } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import ListLoader from '../../../native_theme/components/ListLoader';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { changeTheme, parseArray, getCurrentDate, addPages, parseFloatVal, convertDateTime } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew, validateValue } from '../../../validations/CommonValidation';
import { isCurrentScreen, addRouteToBackPress } from '../../Navigation';
import { connect } from 'react-redux';
import Drawer from 'react-native-drawer-menu';
import { DateValidation } from '../../../validations/DateValidation';
import { AppConfig } from '../../../controllers/AppConfig';
import PaginationWidget from '../../widget/PaginationWidget'
import R from '../../../native_theme/R';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import FilterWidget from '../../widget/FilterWidget';
import CardView from '../../../native_theme/components/CardView';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import SafeView from '../../../native_theme/components/SafeView';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import StatusChip from '../../widget/StatusChip';
import { Fonts } from '../../../controllers/Constants';
import { getLeverageReport, clearLeverageReport } from '../../../actions/Margin/LeverageReportAction';
import { getUserDataList, getWalletType } from '../../../actions/PairListAction';
import ImageViewWidget from '../../widget/ImageViewWidget';

class LevarageReportScreen extends Component {

    constructor(props) {
        super(props);

        //Create reference
        this.drawer = React.createRef();
        this.toast = React.createRef();

        //Define all initial state
        this.state = {
            refreshing: false,
            search: '',
            response: [],
            isFirstTime: true,

            //Filter
            fromDate: getCurrentDate(),
            toDate: getCurrentDate(),

            currency: [{ value: R.strings.Please_Select }],
            selectedCurrency: R.strings.Please_Select,
            selectedCurrencyCode: '',

            userNames: [{ value: R.strings.Please_Select }],
            selectedUserName: R.strings.Please_Select,
            selectedUserNameCode: '',

            status: [
                { value: R.strings.Please_Select, code: '' },
                { value: R.strings.Initialize, code: '0' },
                { value: R.strings.open, code: '1' },
                { value: R.strings.Failed, code: '3' },
                { value: R.strings.withdraw, code: '5' },
                { value: R.strings.waitingForAdminApprove, code: '6' },
                { value: R.strings.Rejected, code: '9' },
            ],
            selectedStatus: R.strings.Please_Select,
            selectedStatusCode: '',

            //For pagination
            row: [],
            selectedPage: 1,

            //For Drawer First Time Close
            isDrawerOpen: false,
            leverageList: null,
            walletData: null,
            userData: null,
        };

        //Bind methods

        this.onBackPress = this.onBackPress.bind(this);

        //add current route for backpress handle
        addRouteToBackPress(props, this.onBackPress);
        this.props.navigation.setParams({ onBackPress: this.onBackPress });
    }

    componentWillUnmount = () => {
        //for Data clear on Backpress
        this.props.clearLeverageReport();
    }
    componentDidMount = async () => {

        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {

            //to getUserDataList list
            this.props.getUserDataList();

            //get walletlist
            this.props.getWalletType();

            let request = {
                FromDate: getCurrentDate(),
                ToDate: getCurrentDate(),
                PageNo: 0,
                PageSize: AppConfig.pageSize,
            }

            //To get getLeverageReport list
            this.props.getLeverageReport(request);
        }
    };

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

    shouldComponentUpdate = (nextProps, _nextState) => {
        //For stop twice api call
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
        if (LevarageReportScreen.oldProps !== props) {
            LevarageReportScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            const { leverageList, userData, walletData } = props.data;

            if (leverageList) {
                try {
                    //if local socialTradingData state is null or its not null and also different then new response then and only then validate response.
                    if (state.leverageList == null || (state.leverageList != null && leverageList !== state.leverageList)) {

                        //if  response is success then store array list else store empty list
                        if (validateResponseNew({ response: leverageList, isList: true })) {

                            // Parsing data
                            let res = parseArray(leverageList.Data);

                            return { ...state, leverageList, response: res, refreshing: false, row: addPages(leverageList.TotalCount) };
                        } else {
                            return { ...state, leverageList, response: [], refreshing: false, row: [] };
                        }
                    }
                } catch (e) {
                    return { ...state, response: [], refreshing: false, row: [] };
                }
            }

            if (userData) {
                try {
                    //if local userData state is null or its not null and also different then new response then and only then validate response.
                    if (state.userData == null || (state.userData != null && userData !== state.userData)) {

                        //if  response is success then store array list else store empty list
                        if (validateResponseNew({ response: userData, isList: true })) {

                            // Parsing data
                            let res = parseArray(userData.GetUserData);

                            // fetching only UserName from whole data
                            for (var userDataItem in res) {
                                let item = res[userDataItem]

                                item.value = item.UserName
                            }

                            let userNames = [
                                { value: R.strings.Please_Select },
                                ...res
                            ];

                            return {
                                ...state, userData,
                                userNames
                            };
                        } else {
                            return {
                                ...state, userData,
                                userNames: [{
                                    value: R.strings.Please_Select
                                }]
                            };
                        }
                    }
                } catch (e) {
                    return {
                        ...state, userNames: [
                            { value: R.strings.Please_Select }]
                    };
                }
            }

            if (walletData) {
                try {
                    //if local userData state is null or its not null and also different then new response then and only then validate response.
                    if (state.walletData == null || (state.walletData != null && walletData !== state.walletData)) {

                        //if  response is success then store array list else store empty list
                        if (validateResponseNew({ response: walletData, isList: true })) {
                            // Parsing data
                            let res = parseArray(walletData.Types);

                            // fetching only TypeName from data
                            for (var walletDataKey in res) {

                                let item = res[walletDataKey]
                                item.value = item.TypeName
                            }

                            let currency = [
                                { value: R.strings.Please_Select },
                                ...res
                            ];

                            return {
                                ...state,
                                walletData, currency
                            };
                        } else {
                            return {
                                ...state, walletData,
                                currency: [{ value: R.strings.Please_Select }]
                            };
                        }
                    }
                } catch (e) {
                    return {
                        ...state,
                        currency: [{ value: R.strings.all }]
                    };
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
            PageNo: 0,
            PageSize: AppConfig.pageSize,
            UserId: this.state.selectedUserName === R.strings.Please_Select ? '' : this.state.selectedUserNameCode,
            WalletTypeId: this.state.selectedCurrency === R.strings.Please_Select ? '' : this.state.selectedCurrencyCode,
            Status: this.state.selectedStatusCode,
        }

        //Check NetWork is Available or not
        if (await isInternet()) {

            //To get getLeverageReport list
            this.props.getLeverageReport(request);
        } else {
            this.setState({ refreshing: false });
        }

        // Close Drawer user press on Complete button bcoz display flatlist item on Screen
        this.drawer.closeDrawer();
        this.setState({ selectedPage: 1, })
    }

    // When user press on reset button then all values are reset
    onReset = async () => {

        let request = {
            FromDate: getCurrentDate(),
            ToDate: getCurrentDate(),
            PageNo: 0,
            PageSize: AppConfig.pageSize,
        };

        // Set state to original value
        this.setState({
            fromDate: getCurrentDate(),
            toDate: getCurrentDate(),
            selectedPage: 1,
            selectedUserName: R.strings.Please_Select,
            selectedUserNameCode: '',
            selectedCurrency: R.strings.Please_Select,
            selectedCurrencyCode: '',
            selectedStatus: R.strings.Please_Select,
            selectedStatusCode: '',
        })

        // Close Drawer user press on Complete button bcoz display flatlist item on Screen
        this.drawer.closeDrawer();

        //Check NetWork is Available or not
        if (await isInternet()) {

            //To get getLeverageReport list
            this.props.getLeverageReport(request);
        } else {
            this.setState({ refreshing: false })
        }
    }

    // for swipe to referesh functionality
    onRefresh = async () => {

        this.setState(
            { refreshing: true }
        );

        //Check NetWork is Available or not
        if (await isInternet()) {

            let request = {
                PageSize: AppConfig.pageSize,
                UserId: this.state.selectedUserName === R.strings.Please_Select ? '' : this.state.selectedUserNameCode,
                WalletTypeId: this.state.selectedCurrency === R.strings.Please_Select ? '' : this.state.selectedCurrencyCode,
                ToDate: this.state.toDate,
                PageNo: this.state.selectedPage - 1,
                Status: this.state.selectedStatusCode,
                FromDate: this.state.fromDate,
            }

            //To get getLeverageReport list
            this.props.getLeverageReport(request);
        } else {
            this.setState({ refreshing: false });
        }
    }

    // this method is called when page change and also api call
    onPageChange = async (pageNo) => {

        //if selected page is diffrent than call api
        if (pageNo != this.state.selectedPage) {

            //Check NetWork is Available or not
            if (await isInternet()) {
                this.setState({ selectedPage: pageNo });

                let request = {
                    FromDate: this.state.fromDate,
                    ToDate: this.state.toDate,
                    PageNo: pageNo - 1,
                    PageSize: AppConfig.pageSize,
                    UserId: this.state.selectedUserName === R.strings.Please_Select ? '' : this.state.selectedUserNameCode,
                    WalletTypeId: this.state.selectedCurrency === R.strings.Please_Select ? '' : this.state.selectedCurrencyCode,
                    Status: this.state.selectedStatusCode,
                }

                //To get getLeverageReport list
                this.props.getLeverageReport(request);
            } else {
                this.setState({ refreshing: false })
            }
        }
    }

    // for navigation drawer ui
    navigationDrawer() {

        return (
            <FilterWidget
                FromDatePickerCall={(date) => this.setState({ fromDate: date })}
                ToDatePickerCall={(date) => this.setState({ toDate: date })}
                toastRef={component => this.toast = component}
                FromDate={this.state.fromDate}
                ToDate={this.state.toDate}
                comboPickerStyle={{ marginTop: 0, }}
                pickers={[

                    {
                        title: R.strings.Currency,
                        array: this.state.currency,
                        selectedValue: this.state.selectedCurrency,
                        onPickerSelect: (index, object) => this.setState({ selectedCurrency: index, selectedCurrencyCode: object.ID })
                    },
                    {
                        title: R.strings.User,
                        array: this.state.userNames,
                        selectedValue: this.state.selectedUserName,
                        onPickerSelect: (index, object) => this.setState({ selectedUserName: index, selectedUserNameCode: object.Id })
                    },
                    {
                        title: R.strings.status, array: this.state.status, selectedValue: this.state.selectedStatus,
                        onPickerSelect: (index, object) => this.setState({
                            selectedStatus: index,
                            selectedStatusCode: object.code
                        })
                    }
                ]}
                onResetPress={this.onReset}

                onCompletePress={this.onComplete}
            />
        )
    }

    render() {

        let filteredList = [];
        // for searching functionality

        if (this.state.response.length) {

            filteredList = this.state.response.filter(item =>
                (
                    item.UserName.toLowerCase().includes(this.state.search.toLowerCase()) ||
                    item.FromWalletName.toLowerCase().includes(this.state.search.toLowerCase()) ||
                    item.ToWalletName.toLowerCase().includes(this.state.search) ||
                    item.WalletTypeName.toLowerCase().includes(this.state.search) ||
                    item.Amount.toFixed(8).toString().toLowerCase().includes(this.state.search) ||
                    item.ChargeAmount.toFixed(8).toString().toLowerCase().includes(this.state.search) ||
                    item.LeverageAmount.toFixed(8).toString().toLowerCase().includes(this.state.search) ||
                    item.LeveragePer.toString().toLowerCase().includes(this.state.search) ||
                    item.StrStatus.toLowerCase().includes(this.state.search) ||
                    item.TrnDate.toLowerCase().includes(this.state.search)
                ));
        }

        return (
            // DrawerLayout for  Leverage Report Filteration
            <Drawer
                onDrawerClose={() => this.setState({ isDrawerOpen: false })}
                drawerContent={this.navigationDrawer()}
                type={Drawer.types.Overlay}
                easingFunc={Easing.ease}
                ref={component => this.drawer = component}
                drawerWidth={R.dimens.FilterDrawarWidth}
                drawerPosition={Drawer.positions.Right}
                onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
            >

                <SafeView style=
                    {this.styles().container}
                >

                    {/* To set status bar as per our theme */}
                    <CommonStatusBar />

                    {/* To set Progress bar as per our theme */}
                    <ProgressDialog ref={component => this.progressDialog = component} />

                    {/* To set toolbar as per our theme */}
                    <CustomToolbar
                        onSearchText={(input) => this.setState({ search: input })}
                        rightIcon={R.images.FILTER}
                        onRightMenuPress={() => this.drawer.openDrawer()}
                        onBackPress={this.onBackPress}
                        title={R.strings.LeverageReport}
                        isBack={true}
                        nav={this.props.navigation}
                        searchable={true}
                    />

                    <View style={{
                        flex: 1, justifyContent: 'space-between'
                    }}>

                        {(this.props.data.loading
                            && !this.state.refreshing)
                            ?
                            <ListLoader />
                            :
                            filteredList.length > 0 ?
                                <FlatList
                                    extraData={this.state}
                                    data={filteredList}
                                    // render all item in list
                                    renderItem={({ item, index }) =>
                                        <LevarageReportItem
                                            onPress={() => this.props.navigation.navigate('LevarageReportDetailScreen', { item })}
                                            index={index}
                                            item={item}
                                            size={this.state.response.length} />
                                    }
                                    showsVerticalScrollIndicator={false}
                                    // assign index as key value to list item
                                    keyExtractor={(_item, index) => index.toString()}
                                    // Refresh functionality in list
                                    refreshControl={<RefreshControl
                                        colors={[R.colors.accent]}
                                        progressBackgroundColor={R.colors.background}
                                        refreshing={this.state.refreshing}
                                        onRefresh={this.onRefresh}
                                    />}
                                />
                                :

                                // Displayed empty component when no record found 
                                <ListEmptyComponent />
                        }

                        {/*To Set Pagination View  */}

                        <View>
                            {filteredList.length > 0 && <PaginationWidget
                                row={this.state.row} selectedPage={this.state.selectedPage} onPageChange={(item) => { this.onPageChange(item) }} />}
                        </View>
                    </View>

                </SafeView>

            </Drawer>
        );
    }

    // common style
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
class LevarageReportItem extends Component {
    constructor(props) {
        super(props)
    }

    shouldComponentUpdate(nextProps) {
        //if old item and new item are different than only render list item
        if (this.props.item === nextProps.item)
            return false
        return true
    }

    render() {

        // Get required fields from props
        let { index, size, item, onPress } = this.props;

        //To Display various Status Color in ListView
        let color = R.colors.accent;
        let statusText = 'N/A';

        //initialize 
        if (item.Status === 0) {
            statusText = R.strings.Initialize
        }

        //open 
        else if (item.Status === 1) {
            color = R.colors.successGreen
            statusText = R.strings.open
        }

        //failed 
        else if (item.Status === 3) {
            color = R.colors.failRed
            statusText = R.strings.Failed
        }

        //withdraw 
        else if (item.Status === 5) {
            statusText = R.strings.withdraw
        }

        //Rejected 
        else if (item.Status === 9) {
            color = R.colors.failRed
            statusText = R.strings.Rejected
        }

        return (
            // Flatlist item animation
            <AnimatableItem>
                <View style={{
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginLeft: R.dimens.widget_left_right_margin,
                    marginRight: R.dimens.widget_left_right_margin,
                    flex: 1,
                }}>
                    <CardView style={{
                        borderBottomLeftRadius: R.dimens.margin,
                        borderTopRightRadius: R.dimens.margin,
                        elevation: R.dimens.listCardElevation,
                        flex: 1,
                        borderRadius: 0,
                    }} onPress={onPress}>

                        <View style={{ flex: 1, flexDirection: 'row' }}>

                            {/* Currency Image */}
                            <ImageViewWidget url={item.WalletTypeName ? item.WalletTypeName : ''} width={R.dimens.drawerMenuIconWidthHeight} height={R.dimens.drawerMenuIconWidthHeight} />

                            <View style={{ flex: 1, marginLeft: R.dimens.widgetMargin, }}>

                                {/* for show username and  creadit amount */}
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>

                                    <View style={{ flex: 1 }}>
                                        <Text style={{ color: R.colors.listSeprator, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>{item.UserName ? item.UserName : ' - '}</Text>
                                    </View>
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
                                    <Text style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, fontFamily: Fonts.MontserratSemiBold, }}>{R.strings.wallet + ': '}</Text>
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
                                value={statusText}></StatusChip>

                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <ImageTextButton
                                    style={{ margin: 0, paddingRight: R.dimens.LineHeight, }}
                                    icon={R.images.IC_TIMER}
                                    iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
                                />
                                <TextViewHML style={{ alignSelf: 'center', color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{convertDateTime(item.TrnDate, 'YYYY-MM-DD HH:mm:ss', false)}</TextViewHML>
                            </View>
                        </View>
                    </CardView>
                </View>
            </AnimatableItem>
        )
    }
}

function mapStatToProps(state) {
    //Updated Data For LeverageReportReducer Data 
    let data = {
        ...state.LeverageReportReducer,
    }
    return { data }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform getLeverageReport Action 
        getLeverageReport: (payload) => dispatch(getLeverageReport(payload)),
        //Perform getUserDataList Action 
        getUserDataList: () => dispatch(getUserDataList()),
        //Perform getWalletType Action 
        getWalletType: () => dispatch(getWalletType()),
        //Perform cleargetLeverageReport Action 
        clearLeverageReport: () => dispatch(clearLeverageReport())
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(LevarageReportScreen);