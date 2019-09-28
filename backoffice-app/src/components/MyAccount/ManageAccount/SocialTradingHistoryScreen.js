import React, { Component } from 'react';
import { View, FlatList, Easing, RefreshControl } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import ListLoader from '../../../native_theme/components/ListLoader';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { changeTheme, parseArray, getCurrentDate, convertDate, addPages, convertTime } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew } from '../../../validations/CommonValidation';
import { isCurrentScreen, addRouteToBackPress } from '../../Navigation';
import { connect } from 'react-redux';
import Drawer from 'react-native-drawer-menu';
import { DateValidation } from '../../../validations/DateValidation';
import { getPairList } from '../../../actions/PairListAction';
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
import { clearSocialTradingHistory, socialTradingHistoryList } from '../../../actions/account/SocialTradingHistoryAction';
import StatusChip from '../../widget/StatusChip';

class SocialTradingHistoryScreen extends Component {

    constructor(props) {
        super(props);

        //Create reference
        this.drawer = React.createRef();

        //Bind all methods
        this.onBackPress = this.onBackPress.bind(this);

        //Define all initial state
        this.state = {
            refreshing: false,
            search: '',
            response: [],
            isFirstTime: true,

            //Filter
            fromDate: getCurrentDate(),
            toDate: getCurrentDate(),

            tradeType: [{ value: R.strings.Please_Select, code: '' }, { value: R.strings.copy, code: 'CAN_COPY_TRADE' }, { value: R.strings.mirror, code: 'CAN_MIRROR_TRADE' }],
            selectedTradeType: R.strings.Please_Select,
            selectedTradeTypeCode: '',

            trnType: [{ value: R.strings.Please_Select, code: '' }, { value: R.strings.buy, code: 'BUY' }, { value: R.strings.sell, code: 'SELL' }],
            selectedTrnType: R.strings.Please_Select,
            selectedTrnTypeCode: '',

            currencyPairs: [{ value: R.strings.all }],
            selectedCurrencyPair: R.strings.all,

            //For pagination
            row: [],
            selectedPage: 1,
            PageSize: AppConfig.pageSize,

            //For Drawer First Time Close
            isDrawerOpen: false,
            socialTradingData: null,

        };

        //add current route for backpress handle

        addRouteToBackPress(props,
            this.onBackPress);
        this.props.navigation.setParams({ onBackPress: this.onBackPress });
    }

    onBackPress() {
        if (this.state.isDrawerOpen) {
            this.drawer.closeDrawer();
            this.setState(
                { isDrawerOpen: false })
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

            let request = {
                FromDate: getCurrentDate(),
                ToDate: getCurrentDate(),
                PageNo: 0,
                PageSize: this.state.PageSize,
                FollowingTo: '0',
                UserID: '0',
            }

            //To get social trading history list
            this.props.socialTradingHistoryList(request);
        }
    };

    shouldComponentUpdate = (nextProps, nextState) => {
        //For stop twice api call
        return isCurrentScreen(nextProps);
    };

    componentWillUnmount = () => {
        //for Data clear on Backpress
        this.props.clearSocialTradingHistory();
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
        if (SocialTradingHistoryScreen.oldProps !== props) {
            SocialTradingHistoryScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            const { socialTradingData, pairList } = props.data;

            if (socialTradingData) {
                try {
                    //if local socialTradingData state is null or its not null and also different then new response then and only then validate response.
                    if (state.socialTradingData == null || (state.socialTradingData != null && socialTradingData !== state.socialTradingData)) {

                        //if  response is success then store array list else store empty list
                        if (validateResponseNew({ response: socialTradingData, isList: true })) {
                            let res = parseArray(socialTradingData.Response);
                            return { ...state, socialTradingData, response: res, refreshing: false, row: addPages(socialTradingData.TotalCount) };
                        } else {
                            return { ...state, socialTradingData, response: [], refreshing: false, row: [] };
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

                            for (var pairListItem in res) {
                                let item = res[pairListItem]
                                item.value = item.PairName
                            }

                            let currencyPairs = [{ value: R.strings.all },
                            ...res];

                            return {
                                ...state,
                                pairList, currencyPairs
                            };
                        } else {
                            return {
                                ...state,
                                pairList, currencyPairs: [{ value: R.strings.all }]
                            };
                        }
                    }
                } catch (e) {
                    return {
                        ...state, currencyPairs: [
                            { value: R.strings.all }]
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
            TrnType: this.state.selectedTrnTypeCode,
            Pair: this.state.selectedCurrencyPair == R.strings.all ? '' : this.state.selectedCurrencyPair,
            FollowTradeType: this.state.selectedTradeTypeCode,
            PageNo: 0,
            PageSize: this.state.PageSize,
            UserID: '0',
            FollowingTo: '0',
        }

        //Check NetWork is Available or not
        if (await isInternet()) {

            //To get social trading history list
            this.props.socialTradingHistoryList(request);
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
            FollowingTo: '0',
            UserID: '0',
        };

        // Set state to original value
        this.setState({
            fromDate: getCurrentDate(),
            toDate: getCurrentDate(),
            selectedPage: 1,
            selectedCurrencyPair: R.strings.all,
            selectedTrnType: R.strings.Please_Select,
            selectedTrnTypeCode: '',
            selectedTradeType: R.strings.Please_Select,
            selectedTradeTypeCode: '',
        })

        // Close Drawer user press on Complete button bcoz display flatlist item on Screen
        this.drawer.closeDrawer();

        //Check NetWork is Available or not
        if (await isInternet()) {

            //To get social trading history list
            this.props.socialTradingHistoryList(request);
        }
    }

    onRefresh = async () => {

        this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (await isInternet()) {

            let request = {
                FromDate: this.state.fromDate,
                ToDate: this.state.toDate,
                TrnType: this.state.selectedTrnTypeCode,
                Pair: this.state.selectedCurrencyPair == R.strings.all ? '' : this.state.selectedCurrencyPair,
                FollowTradeType: this.state.selectedTradeTypeCode,
                PageNo: this.state.selectedPage - 1,
                PageSize: this.state.PageSize,
                UserID: '0',
                FollowingTo: '0',
            }

            //To get social trading history list
            this.props.socialTradingHistoryList(request);

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
                    TrnType: this.state.selectedTrnTypeCode,
                    Pair: this.state.selectedCurrencyPair == R.strings.all ? '' : this.state.selectedCurrencyPair,
                    FollowTradeType: this.state.selectedTradeTypeCode,
                    PageNo: pageNo - 1,
                    PageSize: this.state.PageSize,
                    UserID: '0',
                    FollowingTo: '0',
                }

                //To get trading summary lp wise list
                this.props.socialTradingHistoryList(request);
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
                comboPickerStyle={{ marginTop: 0, }}
                pickers={[

                    {
                        title: R.strings.socialTradeType,
                        array: this.state.tradeType,
                        selectedValue: this.state.selectedTradeType,
                        onPickerSelect: (index, object) => this.setState({ selectedTradeType: index, selectedTradeTypeCode: object.code })
                    },
                    {
                        title: R.strings.transactionType,
                        array: this.state.trnType,
                        selectedValue: this.state.selectedTrnType,
                        onPickerSelect: (index, object) => this.setState({ selectedTrnType: index, selectedTrnTypeCode: object.code })
                    },
                    {
                        title: R.strings.pair,
                        array: this.state.currencyPairs,
                        selectedValue: this.state.selectedCurrencyPair,
                        onPickerSelect: (index, object) => this.setState({ selectedCurrencyPair: index, selectedOrderTypeCode: object.code })
                    }
                ]}
                onResetPress={this.onReset}
                onCompletePress={this.onComplete}
            />
        )
    }

    render() {

        let filteredList = [];

        if (this.state.response.length) { //for search
            filteredList = this.state.response.filter(item => (
                item.PairName.replace('_', '/').toLowerCase().includes(this.state.search.toLowerCase()) ||
                item.Type.toLowerCase().includes(this.state.search.toLowerCase()) ||
                item.OrderType.toLowerCase().includes(this.state.search.toLowerCase()) ||
                item.TrnNo.toString().includes(this.state.search)
            ));
        }

        return (
            <Drawer
                onDrawerClose={() => this.setState({ isDrawerOpen: false })}
                drawerWidth={R.dimens.FilterDrawarWidth}
                drawerPosition={Drawer.positions.Right}
                onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
                drawerContent={this.navigationDrawer()}
                type={Drawer.types.Overlay}
                ref={component => this.drawer = component}
                easingFunc={Easing.ease}>

                <SafeView style={this.styles().container}
                >

                    {/* StatusBar as per our theme */}
                    <CommonStatusBar />

                    {/* Progress Dialog as per our theme */}
                    <ProgressDialog ref={component => this.progressDialog = component} />

                    {/* Toolbar as per our theme */}
                    <CustomToolbar
                        rightIcon={R.images.FILTER}
                        title={R.strings.socialTradingHistory}
                        isBack={true}
                        nav={this.props.navigation}
                        searchable={true}
                        onSearchText={(input) => this.setState({ search: input })}
                        onRightMenuPress={() => this.drawer.openDrawer()}
                        onBackPress={this.onBackPress} />

                    <View style={{ flex: 1, justifyContent: 'space-between' }}>

                        {(this.props.data.socialTradingLoading && !this.state.refreshing)
                            ?
                            <ListLoader />
                            :
                            filteredList.length > 0 ?
                                <FlatList
                                    data={filteredList}
                                    extraData={this.state}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={({ item, index }) =>
                                        <SocialTradingHistoryItem
                                            item={item}
                                            index={index}
                                            size={this.state.response.length}
                                            onPress={() => this.props.navigation.navigate('SocialTradingHistoryDetailScreen', { item })}
                                        />
                                    }
                                    keyExtractor={(_item, index) => index.toString()}
                                    refreshControl={<RefreshControl
                                        colors={[R.colors.accent]}
                                        onRefresh={this.onRefresh}
                                        progressBackgroundColor={R.colors.background}
                                        refreshing={this.state.refreshing}
                                    />
                                    }
                                />
                                : <ListEmptyComponent />}
                       
                        {/*To Set Pagination View  */}
                        <View>
                            {filteredList.length > 0 
                                && <PaginationWidget 
                                selectedPage={this.state.selectedPage} 
                                row={this.state.row} 
                                onPageChange={(item) => { this.onPageChange(item) }} />}
                        </View>
                    </View>
                </SafeView>
            </Drawer>);
    }
    styles = () => {
        return {
            container: { flex: 1, backgroundColor: R.colors.background, },
        }
    }
}

// This Class is used for display record in list
class SocialTradingHistoryItem extends Component {
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
        let { item: { TrnNo, Type, PairName, DateTime, Price, Amount, OrderType, Status, StatusText }, onPress, index, size } = this.props;
        let statusColor = R.colors.accent;

        //set status background color as per type
        if (Type === 'BUY') {
            statusColor = R.colors.successGreen;
        } else {
            statusColor = R.colors.failRed;
        }

        return (
            // Flatlist item animation
            <AnimatableItem>
                <View style={{
                    marginLeft: R.dimens.widget_left_right_margin,
                    flex: 1,
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginRight: R.dimens.widget_left_right_margin
                }}>

                    <CardView style={{
                        borderTopRightRadius: R.dimens.margin,
                        elevation: R.dimens.listCardElevation,
                        flex: 1,
                        borderRadius: 0,
                        borderBottomLeftRadius: R.dimens.margin,
                    }} onPress={onPress}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                            {/* for show PairName , Type , OrderType */}
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

                        {/* for show TrnNo , Price , Amount */}
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.TrnId}</TextViewHML>
                                <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, }}>{TrnNo ? TrnNo : '-'}</TextViewHML>
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

                        {/* for show status and date */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: R.dimens.widgetMargin, justifyContent: 'space-between' }}>
                            <StatusChip
                                color={Status == 1 ? R.colors.successGreen : R.colors.failRed}
                                value={StatusText}></StatusChip>
                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                <ImageTextButton
                                    style={{ margin: 0, paddingRight: R.dimens.widgetMargin, }}
                                    icon={R.images.IC_TIMER}
                                    iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
                                />
                                <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{convertDate(DateTime) + ' ' + convertTime(DateTime)}</TextViewHML>
                            </View>
                        </View>
                    </CardView>
                </View>
            </AnimatableItem>
        )
    }
}

function mapStatToProps(state) {
    //Updated Data For SocialTradingHistoryReducer Data 
    let data = {
        ...state.SocialTradingHistoryReducer,
    }
    return { data }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform socialTradingHistoryList Action 
        socialTradingHistoryList: (payload) => dispatch(socialTradingHistoryList(payload)),
        //Perform getCurrencyPairs Action 
        getCurrencyPairs: (payload) => dispatch(getPairList(payload)),
        //Perform clearSocialTradingHistory Action 
        clearSocialTradingHistory: () => dispatch(clearSocialTradingHistory())
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(SocialTradingHistoryScreen);