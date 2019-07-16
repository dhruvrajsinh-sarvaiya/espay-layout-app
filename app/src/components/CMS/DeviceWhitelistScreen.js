import React, { Component } from 'react';
import { View, FlatList, RefreshControl, Text, Easing } from 'react-native';
import { connect } from 'react-redux';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../native_theme/components/CustomToolbar';
import { FeatureSwitch } from '../../native_theme/components/FeatureSwitch';
import { showAlert, getDeviceID, addPages, getDeviceName, getCurrentDate, convertDateTime } from '../../controllers/CommonUtils';
import { DeviceHistoryFatchData, deleteDeviceWhiteList, disableDeviceWhiteList, enableDeviceWhiteList, clearDeviceWhitelistData } from '../../actions/CMS/deviceWhitelistAction';
import { changeTheme, parseArray } from '../../controllers/CommonUtils';
import { isCurrentScreen, addRouteToBackPress } from '../Navigation';
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import { isInternet, validateResponseNew } from '../../validations/CommonValidation';
import ListLoader from '../../native_theme/components/ListLoader';
import { ServiceUtilConstant, Fonts } from '../../controllers/Constants';
import { contentContainerStyle, ListEmptyComponent } from '../../native_theme/components/FlatListWidgets';
import PaginationWidget from '../Widget/PaginationWidget';
import R from '../../native_theme/R';
import CardView from '../../native_theme/components/CardView';
import { AppConfig } from '../../controllers/AppConfig';
import ImageTextButton from '../../native_theme/components/ImageTextButton';
import TextViewMR from '../../native_theme/components/TextViewMR';
import TextViewHML from '../../native_theme/components/TextViewHML';
import Drawer from 'react-native-drawer-menu';
import CommonToast from '../../native_theme/components/CommonToast';
import FilterWidget from '../Widget/FilterWidget';
import { DateValidation } from '../../validations/DateValidation';
import SafeView from '../../native_theme/components/SafeView';
import AnimatableItem from '../../native_theme/components/AnimatableItem';

class DeviceWhitelistScreen extends Component {
    constructor(props) {
        super(props);

        //Define All initial State
        this.state = {
            isFeatureEnable: true,
            Devicedata: [],
            search: '',
            refreshing: false,
            SelectedDeviceId: '',
            row: [],
            selectedPage: 0,
            PAGE_SIZE: AppConfig.pageSize,
            isFirstTime: true,
            currentDeviceName: '',
            FromDate: getCurrentDate(),
            ToDate: getCurrentDate(),
            count: true,
            isDrawerOpen: false, // First Time Drawer is Closed
        }

        //intial Request for DeviceWhitelist Api
        this.Request = {
            PageIndex: 0,
            PAGE_SIZE: AppConfig.pageSize,
            FromDate: getCurrentDate(),
            ToDate: getCurrentDate(),
        }

        //Add Current Screen to Manual Handling BackPress Events
        addRouteToBackPress(props);

        //To Bind All Method
        this.onRefresh = this.onRefresh.bind(this);
        this.onPageChange = this.onPageChange.bind(this);
        this.onBackPress = this.onBackPress.bind(this);
        this.props.navigation.setParams({ onBackPress: this.onBackPress });

        // create reference
        this.drawer = React.createRef();
        this.toastDialog = React.createRef();
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

        //check for internet connection
        if (await isInternet()) {

            //call api to fetch whitelisted device list
            this.props.DeviceHistoryFetchData(this.Request)
        }
        this.setState({ currentDeviceName: await getDeviceName() })
    }

    componentWillUnmount() {
        //clear Data On backPress
        this.props.clearDeviceWhitelistData();
    }

    shouldComponentUpdate(nextProps, _nextState) {
        return isCurrentScreen(nextProps)
    };

    //For Swipe to referesh Functionality
    async onRefresh() {
        this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Bind Request For DeviceWhitelist
            this.Request = {
                PageIndex: this.state.selectedPage,
                PAGE_SIZE: AppConfig.pageSize,
                FromDate: this.state.FromDate,
                ToDate: this.state.ToDate,
            }

            //call api to fetch whitelisted device list
            this.props.DeviceHistoryFetchData(this.Request)
            //----------
        } else {
            this.setState({ refreshing: false });
        }
    }

    // this method is called when page change and also api call
    async  onPageChange(pageNo) {
        // if Selected page is Not Same Then Call Api 
        if (this.state.selectedPage !== pageNo - 1) {
            this.setState({ selectedPage: pageNo - 1 });

            //Check NetWork is Available or not
            if (await isInternet()) {

                //Bind Request For DeviceWhitelist 
                this.Request = {
                    PageIndex: pageNo - 1,
                    PAGE_SIZE: this.state.PAGE_SIZE,
                    FromDate: this.state.FromDate,
                    ToDate: this.state.ToDate,
                }

                //call api to fetch whitelisted device list
                this.props.DeviceHistoryFetchData(this.Request)
            } else {
                this.setState({ refreshing: false })
            }
        }
    }

    componentDidUpdate = (prevProps, _prevState) => {
        const { deleteHistory } = this.props.Listdata;

        //for the response of Delete Success Dialog 
        if (deleteHistory !== prevProps.Listdata.deleteHistory) {
            if (deleteHistory) {
                try {
                    if (validateResponseNew({ response: deleteHistory })) {
                        showAlert(R.strings.Success + '!', deleteHistory.ReturnMsg + '\n' + ' ', 0, () => {
                            this.setState({ selectedPage: 0 })
                            this.Request = {
                                PageIndex: 0,
                                PAGE_SIZE: AppConfig.pageSize,
                            }
                            this.props.DeviceHistoryFetchData(this.Request)
                        });
                    }
                } catch (e) { }
            }
        }
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
        if (DeviceWhitelistScreen.oldProps !== props) {
            DeviceWhitelistScreen.oldProps = props;
        } else {
            return null;
        }

        //check for current screen
        if (isCurrentScreen(props)) {
            const {
                deviceHistory,
                DisableDeviceWhitelistdata,
                EnableDeviceWhitelistdata,
            } = props.Listdata;

            // To check deviceHistory is null or not
            if (deviceHistory) {
                try {
                    //if deviceHistory is null or old and new data of deviceHistory  and response is different then validate it
                    if (state.deviceHistory == null || (state.deviceHistory != null && deviceHistory !== state.deviceHistory)) {
                        if (validateResponseNew({ response: deviceHistory, isList: true })) {
                            //Set State For Api response 
                            return Object.assign({}, state, {
                                deviceHistory,
                                Devicedata: parseArray(deviceHistory.DeviceList),
                                refreshing: false,
                                row: addPages(deviceHistory.TotalCount)
                            });
                        } else {
                            //Set State For Api response 
                            return Object.assign({}, state, {
                                deviceHistory,
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

            // To check DisableDeviceWhitelistdata is null or not
            if (DisableDeviceWhitelistdata) {
                try {
                    //if DisableDeviceWhitelistdata is null or old and new data of DisableDeviceWhitelistdata  and response is different then validate it
                    if (state.DisableDeviceWhitelistdata == null || (state.DisableDeviceWhitelistdata != null && DisableDeviceWhitelistdata !== state.DisableDeviceWhitelistdata)) {
                        if (validateResponseNew({ response: DisableDeviceWhitelistdata })) {
                            let res = state.Devicedata;
                            let findIndexOfChangeID = state.SelectedDeviceId == null ? -1 : res.findIndex(el => el.Id === state.SelectedDeviceId);

                            //if index is >-1 then record is found
                            if (findIndexOfChangeID > -1) {
                                res[findIndexOfChangeID].IsEnable = res[findIndexOfChangeID].IsEnable == true ? false : true;
                            }

                            return Object.assign({}, state, {
                                Devicedata: res,
                                DisableDeviceWhitelistdata
                            });
                        } else {
                            //Set State For Api response 
                            return Object.assign({}, state, {
                                DisableDeviceWhitelistdata
                            });
                        }
                    }
                } catch (e) {
                    //Set State For Api response 
                    return null;
                }
            }

            // To check EnableDeviceWhitelistdata is null or not
            if (EnableDeviceWhitelistdata) {
                try {
                    //if EnableDeviceWhitelistdata is null or old and new data of EnableDeviceWhitelistdata  and response is different then validate it
                    if (state.EnableDeviceWhitelistdata == null || (state.EnableDeviceWhitelistdata != null && EnableDeviceWhitelistdata !== state.EnableDeviceWhitelistdata)) {
                        if (validateResponseNew({ response: EnableDeviceWhitelistdata })) {
                            let res = state.Devicedata;
                            let findIndexOfChangeID = state.SelectedDeviceId == null ? -1 : res.findIndex(el => el.Id === state.SelectedDeviceId);

                            //if index is >-1 then record is found
                            if (findIndexOfChangeID > -1) {
                                res[findIndexOfChangeID].IsEnable = res[findIndexOfChangeID].IsEnable == true ? false : true;
                            }

                            return Object.assign({}, state, {
                                Devicedata: res,
                                EnableDeviceWhitelistdata
                            });
                        } else {
                            //Set State For Api response 
                            return Object.assign({}, state, {
                                EnableDeviceWhitelistdata
                            });
                        }
                    }
                } catch (e) {
                    //Set State For Api response 
                    return null;
                }
            }
        }
        return null;
    }

    // for remove whitelisted device from the list
    removeItemFromList = async (item) => {

        //check for internet connection
        if (await isInternet()) {
            let request = {
                SelectedDeviceId: item.Id,
                DeviceId: await getDeviceID(),
                Mode: ServiceUtilConstant.Mode,
                HostName: ServiceUtilConstant.hostName,
                //Note : ipAddress parameter is passed in its saga.
            }

            //check count bit is true or not
            if (this.state.count) {
                this.setState({ count: false });

                // for show selected Record in Dialog
                let selectedRecord = R.strings.deviceTitle + " : " + (item.Device ? item.Device : '-') + "\n" + R.strings.deviceOs + " : " + (item.DeviceOS ? item.DeviceOS : '-') + "\n\n"
                showAlert(R.strings.Delete + '!', selectedRecord + R.strings.delete_message, 6, () => {
                    this.setState({ count: true });
                    this.props.deleteDeviceWhiteList(request);
                }, R.strings.no_text, () => { this.setState({ count: true }); }, R.strings.yes_text)
            }
        }
    }

    // for update status of whitelisted device
    updateFeature = async (item) => {

        //chek internet connectivity
        if (await isInternet()) {
            //To update feature state value */
            this.setState({ SelectedDeviceId: item.Id })

            //bind Request For Update The Status
            let request = {
                SelectedDeviceId: item.Id,
                DeviceId: await getDeviceID(),
                Mode: ServiceUtilConstant.Mode,
                HostName: ServiceUtilConstant.hostName,
                //Note : ipAddress parameter is passed in its saga.
            }

            //if Selected Item For Status Change IS Disabled Then Call EnbaleDeviceWhitelistApi Else DisableDeviceWhitelistApi 
            if (!item.IsEnable) {
                this.props.enableDeviceWhiteList(request);
            } else {
                this.props.disableDeviceWhiteList(request);
            }
        }
    }

    // Drawer Navigation
    navigationDrawer() {
        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                {/* For Toast */}
                <CommonToast ref={component => this.toastDialog = component} styles={{ width: R.dimens.FilterDrawarWidth }} />

                {/* For From and Todate Filter */}
                <FilterWidget
                    FromDatePickerCall={(date) => this.setState({ FromDate: date })}
                    ToDatePickerCall={(date) => this.setState({ ToDate: date })}
                    FromDate={this.state.FromDate}
                    ToDate={this.state.ToDate}
                    onResetPress={this.onResetPress}
                    onCompletePress={this.onCompletePress}
                />
            </SafeView>
        )
    }

    // Reset FromDate and ToDate
    onResetPress = async () => {
        this.drawer.closeDrawer();
        this.setState({ FromDate: getCurrentDate(), ToDate: getCurrentDate(), search: '', selectedPage: 0 })

        //Check NetWork is Available or not
        if (await isInternet()) {

            //bind Request For DeviceHistoryApi
            let request = {
                PageIndex: 0,
                PAGE_SIZE: this.state.PAGE_SIZE,
                FromDate: getCurrentDate(),
                ToDate: getCurrentDate()
            }

            //call DeviceHistoryApi
            this.props.DeviceHistoryFetchData(request);
        } else {
            this.setState({ refreshing: false });
        }
    }

    // Api Call when press on complete button
    onCompletePress = async () => {

        //Check All From Date Validation
        if (DateValidation(this.state.FromDate, this.state.ToDate)) {
            this.toastDialog.Show(DateValidation(this.state.FromDate, this.state.ToDate));
            return;
        }
        else {
            this.setState({ selectedPage: 0 })

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

                //call DeviceHistoryApi
                this.props.DeviceHistoryFetchData(request);
            } else {
                this.setState({ refreshing: false });
            }

            //If Filter from Complete Button Click then empty searchInput
            this.setState({ search: '', selectedPage: 0 })
        }
    }

    render() {
        let devicelist = null;

        //Get is Fetching value For All APIs to handle Progress bar in All Activity
        const { isLoadingDeviceHistory, isDeletingDevice, isEnablingDevice, isDesablingDevice } = this.props.Listdata;

        //for final items from search input (validate on Device)
        //default searchInput is empty so it will display all records.
        if (this.state.Devicedata != undefined) {
            devicelist = this.state.Devicedata.filter((item) => (item.Device.toLowerCase().includes(this.state.search.toLowerCase())))
        }
        return (
            <Drawer
                ref={cmpDrawer => this.drawer = cmpDrawer}
                drawerContent={this.navigationDrawer()}
                drawerPosition={Drawer.positions.Right}
                drawerWidth={R.dimens.FilterDrawarWidth}
                type={Drawer.types.Overlay}
                onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
                onDrawerClose={() => this.setState({ isDrawerOpen: false })}
                easingFunc={Easing.ease}>

                <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

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

                    {/* To Show Progress Dialog Based On Delete , enable status , disable status*/}
                    <ProgressDialog isShow={isDeletingDevice || isEnablingDevice || isDesablingDevice} />

                    <View style={{ flex: 1, justifyContent: 'space-between' }}>

                        <View style={{ flexDirection: 'row', paddingLeft: R.dimens.widget_left_right_margin, paddingBottom: R.dimens.widgetMargin }}>
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
                                    {/* Current Device Name */}
                                    {this.state.currentDeviceName}
                                </Text>
                            </View>
                        </View>

                        {/* List Items */}
                        {
                            (isLoadingDeviceHistory && !this.state.refreshing) ?
                                <ListLoader />
                                :
                                <View style={{ flex: 1 }}>
                                    <FlatList
                                        showsVerticalScrollIndicator={false}
                                        data={devicelist}
                                        /* render all item in list */
                                        renderItem={({ item, index }) => {
                                            return <FlatListItem
                                                item={item}
                                                onRemove={() => this.removeItemFromList(item)}
                                                onUpdateFeature={() => this.updateFeature(item, index)}
                                                index={index}
                                                size={this.state.Devicedata.length}
                                            />
                                        }}
                                        /* assign index as key value to list item */
                                        keyExtractor={(item, index) => index.toString()}
                                        contentContainerStyle={contentContainerStyle(devicelist)}
                                        ListEmptyComponent={<ListEmptyComponent />}
                                        /* For Refresh Functionality In  FlatList Item */
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
                            {devicelist.length > 0 &&
                                <PaginationWidget row={this.state.row} selectedPage={this.state.selectedPage + 1} onPageChange={(item) => { this.onPageChange(item) }} />
                            }
                        </View>
                    </View>
                </SafeView>
            </Drawer>
        )
    }
}

// This Class is used for display record in list
class FlatListItem extends Component {
    constructor(props) {
        super(props)
    }

    shouldComponentUpdate(nextProps, _nextState) {
        //Check If Old Props and New Props are Equal then Return False
        if (this.props.item !== nextProps.item || this.props.onUpdateFeature !== nextProps.onUpdateFeature)
            return true
        return false
    }

    render() {
        let { item } = this.props;
        return (
            <AnimatableItem>
                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    marginTop: R.dimens.widgetMargin,
                    marginLeft: R.dimens.widget_left_right_margin,
                    marginRight: R.dimens.widget_left_right_margin,
                    marginBottom: (this.props.index == this.props.size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                }}>
                    <CardView
                        style={{
                            flex: 1,
                            elevation: R.dimens.listCardElevation,
                            borderRadius: 0,
                            flexDirection: 'column',
                            borderTopRightRadius: R.dimens.margin,
                            borderBottomLeftRadius: R.dimens.margin,
                            paddingBottom: 0,
                        }}>
                        <View style={{ flexDirection: 'row', flex: 1 }}>

                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>

                                {/* Logo Image For Mobile Or Web */}
                                <ImageTextButton
                                    icon={R.images.IC_MOBILE}
                                    style={{ justifyContent: 'center', alignSelf: 'center', width: R.dimens.IconWidthHeight, height: R.dimens.IconWidthHeight, margin: 0, backgroundColor: R.colors.accent, borderRadius: R.dimens.ButtonHeight }}
                                    iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: R.colors.white }}
                                />
                                <View style={{ flex: 1, paddingLeft: R.dimens.margin, paddingRight: R.dimens.margin, }}>

                                    {/* DeviceOS */}
                                    <Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold }}>{item.DeviceOS ? item.DeviceOS : '-'}</Text>

                                    {/* Device Name */}
                                    <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{item.Device ? item.Device : '-'}</TextViewHML>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>

                                {/* Device Remove */}
                                <ImageTextButton
                                    style={{ margin: 0, paddingRight: R.dimens.LineHeight, }}
                                    onPress={this.props.onRemove}
                                    icon={R.images.IC_CANCEL}
                                    iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: R.colors.textPrimary }}
                                />
                            </View>
                        </View>

                        {/* for show date time and status */}
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row' }}>
                                <FeatureSwitch
                                    title={item.IsEnable ? R.strings.enabled : R.strings.disabled}
                                    reverse={true}
                                    isToggle={item.IsEnable}
                                    onValueChange={this.props.onUpdateFeature}
                                    textStyle={{
                                        color: R.colors.textSecondary,
                                        fontSize: R.dimens.smallestText,
                                        marginLeft: R.dimens.widget_left_right_margin,
                                    }}
                                    style={{
                                        backgroundColor: 'transparent',
                                        paddingRight: R.dimens.WidgetPadding,
                                        paddingLeft: R.dimens.WidgetPadding,
                                    }} />
                            </View>
                            <ImageTextButton
                                icon={R.images.IC_TIMER}
                                style={{ margin: 0, paddingRight: R.dimens.widgetMargin, }}
                                iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary, }}
                            />
                            <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{convertDateTime(item.CreatedDate)}</TextViewHML>
                        </View>
                    </CardView>
                </View>
            </AnimatableItem>
        )
    }
}

function mapStatToProps(state) {
    return {
        //Updated Data device whitelist 
        Listdata: state.DeviceHistoryReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //action for fetch device whitelist
        DeviceHistoryFetchData: (payload) => dispatch(DeviceHistoryFatchData(payload)),

        //action for Delete device whitelist
        deleteDeviceWhiteList: (payload) => dispatch(deleteDeviceWhiteList(payload)),

        //action for Enable device whitelist Status
        enableDeviceWhiteList: (payload) => dispatch(enableDeviceWhiteList(payload)),

        //action for Disbale device whitelist Status
        disableDeviceWhiteList: (payload) => dispatch(disableDeviceWhiteList(payload)),

        //action for Clear device whitelist Data
        clearDeviceWhitelistData: () => dispatch(clearDeviceWhitelistData())
    }
}
export default connect(mapStatToProps, mapDispatchToProps)(DeviceWhitelistScreen);

