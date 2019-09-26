import React, { Component } from 'react';
import { View, FlatList, RefreshControl, Text, Easing } from 'react-native';
import { connect } from 'react-redux';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { getIPAddress, addPages, getDeviceName, getCurrentDate, convertDateTime } from '../../../controllers/CommonUtils';
import { changeTheme, parseArray } from '../../../controllers/CommonUtils';
import { isCurrentScreen, addRouteToBackPress } from '../../Navigation';
import { isInternet, validateResponseNew } from '../../../validations/CommonValidation';
import ListLoader from '../../../native_theme/components/ListLoader';
import { Fonts } from '../../../controllers/Constants';
import { contentContainerStyle, ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import PaginationWidget from '../../widget/PaginationWidget';
import R from '../../../native_theme/R';
import CardView from '../../../native_theme/components/CardView';
import { AppConfig } from '../../../controllers/AppConfig';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import Drawer from 'react-native-drawer-menu';
import FilterWidget from '../../widget/FilterWidget';
import { DateValidation } from '../../../validations/DateValidation';
import { deviceWhiteList, clearDeviceWhitelistData } from '../../../actions/account/DeviceWhitelistAction';
import StatusChip from '../../widget/StatusChip';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import SafeView from '../../../native_theme/components/SafeView';

class DeviceWhitelistScreen extends Component {
    constructor(props) {
        super(props);

        //define all initial state
        this.state = {
            isFeatureEnable: true,
            Devicedata: [],
            search: '',
            refreshing: false,
            row: [],
            selectedPage: 1,
            PAGE_SIZE: AppConfig.pageSize,
            isFirstTime: true,
            currentDeviceName: '',
            FromDate: getCurrentDate(),
            ToDate: getCurrentDate(),
            isDrawerOpen: false, // First Time Drawer is Closed
            deviceWhitelistListData: null,
        }

        //initial request
        this.Request = {
            PageIndex: 0,
            PAGE_SIZE: AppConfig.pageSize,
            FromDate: getCurrentDate(),
            ToDate: getCurrentDate(),
        }

        //Add Current Screen to Manual Handling BackPress Events
        addRouteToBackPress(props);

        //To Bind All Method
        this.onBackPress = this.onBackPress.bind(this);
        this.props.navigation.setParams({ onBackPress: this.onBackPress });

        // create reference
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

    async componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {

            //call api to fetch whitelisted device list
            this.props.deviceWhiteList(this.Request)
        }

        let IpAddress = await getIPAddress();
        this.setState({ IpAddress: IpAddress, currentDeviceName: await getDeviceName() })
    }

    componentWillUnmount() {
        //for clear data on back
        this.props.clearDeviceWhitelistData();
    }

    shouldComponentUpdate(nextProps, _nextState) {
        //stop twice api call
        return isCurrentScreen(nextProps)
    };

    //For Swipe to referesh Functionality
    async onRefresh() {
        this.setState({ refreshing: true });
        //Check NetWork is Available or not
        if (await isInternet()) {

            this.Request = {
                PageIndex: this.state.selectedPage - 1,
                PAGE_SIZE: AppConfig.pageSize,
                FromDate: this.state.FromDate,
                ToDate: this.state.ToDate,
            }

            //call api to fetch whitelisted device list
            this.props.deviceWhiteList(this.Request)
        } else {
            this.setState({ refreshing: false });
        }
    }

    /* this method is called when page change and also api call */
    async onPageChange(pageNo) {
        if (this.state.selectedPage !== pageNo) {
            this.setState({ selectedPage: pageNo });

            //Check NetWork is Available or not
            if (await isInternet()) {
                this.Request = {
                    PageIndex: pageNo - 1,
                    PAGE_SIZE: this.state.PAGE_SIZE,
                    FromDate: this.state.FromDate,
                    ToDate: this.state.ToDate,
                }

                //call api to fetch whitelisted device list
                this.props.deviceWhiteList(this.Request)
            }
        }
    }

    static oldProps = {};

    static getDerivedStateFromProps(props, state) {
        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return Object.assign({}, state, {
                isFirstTime: false,
            });
        }

        // To Skip Render if old and new props are equal
        if (DeviceWhitelistScreen.oldProps !== props) {
            DeviceWhitelistScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            const {
                deviceWhitelistListData,
            } = props.Listdata;

            // To check deviceHistory is null or not
            if (deviceWhitelistListData) {
                try {
                    //if deviceHistory is null or old and new data of deviceHistory  and response is different then validate it
                    if (state.deviceWhitelistListData == null || (state.deviceWhitelistListData != null && deviceWhitelistListData !== state.deviceWhitelistListData)) {
                        if (validateResponseNew({ response: deviceWhitelistListData, isList: true })) {
                            //Set State For Api response 
                            let res = parseArray(deviceWhitelistListData.DeviceList);
                            res.map((item, index) => {
                                res[index].status = item.IsEnable === true ? R.strings.active : R.strings.inActive; // for search show hide string response has 0 or  1
                            })
                            return Object.assign({}, state, {
                                deviceWhitelistListData,
                                Devicedata: res,
                                refreshing: false,
                                row: addPages(deviceWhitelistListData.TotalCount)
                            });
                        } else {
                            //Set State For Api response 
                            return Object.assign({}, state, {
                                deviceWhitelistListData,
                                Devicedata: [],
                                refreshing: false,
                                row: []
                            });
                        }
                    }

                } catch (e) {
                    //Set State For Api response 
                    return Object.assign({}, state, {
                        Devicedata: [],
                        refreshing: false,
                        row: []
                    });
                }
            }
        }
        return null;
    }

    /* Drawer Navigation */
    navigationDrawer() {
        return (
            <FilterWidget
                FromDatePickerCall={(date) => this.setState({ FromDate: date })}
                ToDatePickerCall={(date) => this.setState({ ToDate: date })}
                FromDate={this.state.FromDate}
                ToDate={this.state.ToDate}
                toastRef={component => this.toast = component}
                onResetPress={this.onResetPress}
                onCompletePress={this.onCompletePress}
            />
        )
    }

    /* Reset FromDate and ToDate */
    onResetPress = async () => {
        this.drawer.closeDrawer();
        this.setState({ FromDate: getCurrentDate(), ToDate: getCurrentDate(), search: '', selectedPage: 1 })

        //Check NetWork is Available or not
        if (await isInternet()) {

            let request = {
                PageIndex: 0,
                PAGE_SIZE: this.state.PAGE_SIZE,
                FromDate: getCurrentDate(),
                ToDate: getCurrentDate(),
            }

            //call api to fetch whitelisted device list
            this.props.deviceWhiteList(request);
        }
    }

    /* Api Call when press on complete button */
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
                let request = {
                    PageIndex: 0,
                    PAGE_SIZE: this.state.PAGE_SIZE,
                    FromDate: this.state.FromDate,
                    ToDate: this.state.ToDate,
                }

                //call api to fetch whitelisted device list
                this.props.deviceWhiteList(request);
            }

            //If Filter from Complete Button Click then empty searchInput
            this.setState({ search: '', selectedPage: 1 })
        }
    }

    render() {
        let devicelist = null;
        const { deviceWhitelistListLoading } = this.props.Listdata;

        //for search
        if (this.state.Devicedata != undefined) {
            devicelist = this.state.Devicedata.filter((item) => (
                item.Device.toLowerCase().includes(this.state.search.toLowerCase()) ||
                item.UserName.toLowerCase().includes(this.state.search.toLowerCase()) ||
                item.DeviceOS.toLowerCase().includes(this.state.search.toLowerCase()) ||
                item.CreatedDate.toLowerCase().includes(this.state.search.toLowerCase()) ||
                item.status.toLowerCase().includes(this.state.search.toLowerCase())
            ))
        }
        return (
            <Drawer
                ref={cmpDrawer => this.drawer = cmpDrawer}
                drawerWidth={R.dimens.FilterDrawarWidth}
                drawerContent={this.navigationDrawer()}
                type={Drawer.types.Overlay}
                drawerPosition={Drawer.positions.Right}
                onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
                onDrawerClose={() => this.setState({ isDrawerOpen: false })}
                easingFunc={Easing.ease}>

                <SafeView style={{ flex: 1, backgroundColor: R.colors.background, }}>

                    {/* To set status bar as per our theme */}
                    <CommonStatusBar />

                    {/* To set toolbar as per our theme */}
                    <CustomToolbar
                        title={R.strings.DeviceWhitelist}
                        isBack={true}
                        nav={this.props.navigation}
                        onBackPress={this.onBackPress}
                        searchable={this.state.isFeatureEnable}
                        onSearchText={(input) => this.setState({ search: input })}
                        rightIcon={R.images.FILTER}
                        onRightMenuPress={() => this.drawer.openDrawer()}
                    />

                    <View style={{ flex: 1, justifyContent: 'space-between' }}>

                        <View style={{ flexDirection: 'row', paddingLeft: R.dimens.widget_left_right_margin, paddingBottom: R.dimens.widgetMargin }}>

                            {/* To Show currentDeviceName */}
                            <View style={{ flex: 1, justifyContent: 'center', marginLeft: R.dimens.widgetMargin }}>
                                <TextViewMR style={{
                                    color: R.colors.textSecondary,
                                    fontSize: R.dimens.smallestText,
                                }}>
                                    {R.strings.current_device.toUpperCase()}
                                </TextViewMR>
                                <Text style={{
                                    color: R.colors.textPrimary,
                                    fontSize: R.dimens.smallText,
                                    fontFamily: Fonts.MontserratSemiBold
                                }}>
                                    {this.state.currentDeviceName}
                                </Text>
                            </View>
                        </View>

                        {/* List Items */}
                        {
                            (deviceWhitelistListLoading && !this.state.refreshing) ?
                                <ListLoader />
                                :
                                <View style={{ flex: 1 }}>
                                    <FlatList
                                        showsVerticalScrollIndicator={false}
                                        data={devicelist}
                                        renderItem={({ item, index }) => {
                                            return <DeviceWhitelistItem
                                                item={item}
                                                index={index}
                                                size={this.state.Devicedata.length}
                                            />
                                        }}
                                        keyExtractor={(item, index) => index.toString()}
                                        contentContainerStyle={contentContainerStyle(devicelist)}
                                        ListEmptyComponent={<ListEmptyComponent />}
                                        /* For Refresh Functionality In Withdrawal FlatList Item */
                                        refreshControl={
                                            <RefreshControl
                                                colors={[R.colors.accent]}
                                                progressBackgroundColor={R.colors.background}
                                                refreshing={this.state.refreshing}
                                                onRefresh={this.onRefresh}
                                            />
                                        }
                                    />
                                </View>
                        }

                        {/*To Set Pagination View  */}
                        <View>
                            {
                                devicelist.length > 0 &&
                                <PaginationWidget row={this.state.row} selectedPage={this.state.selectedPage} onPageChange={(item) => { this.onPageChange(item) }} />
                            }
                        </View>
                    </View>
                </SafeView>
            </Drawer>
        )
    }


    styles = () => {
        return {
            headerContainer: {
                flexDirection: "row",
                paddingTop: R.dimens.widgetMargin,
                paddingLeft: R.dimens.WidgetPadding,
                paddingRight: R.dimens.WidgetPadding,
                paddingBottom: R.dimens.widgetMargin
            },
            simpleText: {
                color: R.colors.textPrimary,
                fontSize: R.dimens.smallText,
            },
        }
    }
}

// This Class is used for display record in list
class DeviceWhitelistItem extends Component {
    constructor(props) {
        super(props)
    }

    shouldComponentUpdate(nextProps, _nextState) {
        //Check If Old Props and New Props are Equal then do not render component
        if (this.props.item !== nextProps.item)
            return true
        return false
    }

    render() {
        let { item } = this.props;

        return (
            // Flatlist item animation
            <AnimatableItem>
                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    marginLeft: R.dimens.widget_left_right_margin,
                    marginRight: R.dimens.widget_left_right_margin,
                    marginTop: (this.props.index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginBottom: (this.props.index == this.props.size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                }}>
                    <CardView style={{
                        elevation: R.dimens.listCardElevation,
                        flex: 1,
                        borderRadius: 0,
                        borderBottomLeftRadius: R.dimens.margin,
                        borderTopRightRadius: R.dimens.margin,
                    }}>

                        <View style={{ flexDirection: 'row', flex: 1 }}>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                {/* To Show mobile icon */}
                                <ImageTextButton
                                    icon={R.images.IC_MOBILE}
                                    style={{ justifyContent: 'center', alignSelf: 'center', width: R.dimens.IconWidthHeight, height: R.dimens.IconWidthHeight, margin: 0, backgroundColor: R.colors.accent, borderRadius: R.dimens.ButtonHeight }}
                                    iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: R.colors.white }}
                                />
                                {/* To Show DeviceOS, Device, UserName */}
                                <View style={{ flex: 1, paddingLeft: R.dimens.margin, paddingRight: R.dimens.margin, }}>
                                    <Text style={{
                                        color: R.colors.textPrimary, fontSize: R.dimens.smallText,
                                        fontFamily: Fonts.MontserratSemiBold
                                    }}>{item.DeviceOS ? item.DeviceOS : '-'}</Text>
                                    <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{item.Device ? item.Device : '-'}</TextViewHML>
                                    <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{item.UserName ? item.UserName : '-'}</TextViewHML>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>

                            </View>
                        </View>
                        {/* for show datetime and status */}
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginTop: R.dimens.widgetMargin }}>
                            <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row' }}>
                                <StatusChip
                                    color={item.IsEnable == true ? R.colors.successGreen : R.colors.failRed}
                                    value={item.IsEnable == true ? R.strings.active : R.strings.inActive}></StatusChip>
                            </View>
                            <ImageTextButton
                                style={{ margin: 0, paddingRight: R.dimens.widgetMargin, }}
                                icon={R.images.IC_TIMER}
                                iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
                            />
                            <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{convertDateTime(item.CreatedDate)}</TextViewHML>
                        </View>
                    </CardView>

                </View>
            </AnimatableItem>
        )
    }

    styles = () => {
        return {
            headerContainer: {
                flexDirection: "row",
                paddingTop: R.dimens.widgetMargin,
                paddingLeft: R.dimens.WidgetPadding,
                paddingRight: R.dimens.WidgetPadding,
                paddingBottom: R.dimens.widgetMargin
            },
            simpleText: {
                color: R.colors.textPrimary,
                fontSize: R.dimens.smallText,
            },
        }
    }

}

function mapStatToProps(state) {
    return {
        //Updated Data device whitelist 
        Listdata: state.DeviceWhitelistReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform deviceWhiteList action
        deviceWhiteList: (payload) => dispatch(deviceWhiteList(payload)),
        //Perform clear data
        clearDeviceWhitelistData: () => dispatch(clearDeviceWhitelistData())
    }
}
export default connect(mapStatToProps, mapDispatchToProps)(DeviceWhitelistScreen);