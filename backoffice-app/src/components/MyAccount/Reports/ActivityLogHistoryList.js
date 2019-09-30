import React, { Component } from 'react';
import { View, FlatList, RefreshControl, Easing } from 'react-native';
import { connect } from 'react-redux';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { changeTheme, getCurrentDate, parseArray, addPages, convertDateTime } from '../../../controllers/CommonUtils';
import { isCurrentScreen, addRouteToBackPress } from '../../Navigation';
import { isInternet, validateResponseNew, validateIPaddress } from '../../../validations/CommonValidation';
import ListLoader from '../../../native_theme/components/ListLoader';
import { ListEmptyComponent, contentContainerStyle } from '../../../native_theme/components/FlatListWidgets';
import Drawer from 'react-native-drawer-menu';
import PaginationWidget from '../../widget/PaginationWidget';
import { activityLogList, clearActivityLog } from '../../../actions/account/ActivityLogHistoryAction';
import { DateValidation } from '../../../validations/DateValidation';
import R from '../../../native_theme/R';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import CardView from '../../../native_theme/components/CardView';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import { AppConfig } from '../../../controllers/AppConfig';
import SafeView from '../../../native_theme/components/SafeView';
import FilterWidget from '../../widget/FilterWidget';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';

class ActivityLogHistoryList extends Component {
    constructor(props) {
        super(props);

        this.inputs = {};
        this.state = {
            searchInput: '',
            Page: 1,
            PageSize: AppConfig.pageSize,
            refreshing: false,
            row: [],
            response: [],
            LogHistoryDataState: null,
            FromDate: getCurrentDate(),
            ToDate: getCurrentDate(),
            userName: '',
            ipAddress: '',
            deviceId: '',
            aliasName: '',
            mode: [
                { value: R.strings.Please_Select },
                { value: 'Web' },
                { value: 'Mobile' },
            ],
            selectedMode: R.strings.Please_Select,

            isFirstTime: true,
            isDrawerOpen: false, // First Time Drawer is Closed
        };
        //To Bind Method
        this.onBackPress = this.onBackPress.bind(this);

        //Add Current Screen to Manual Handling BackPress Events
        addRouteToBackPress(props);
        this.props.navigation.setParams({ onBackPress: this.onBackPress });

        // create reference
        this.drawer = React.createRef();
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        // Check NetWork is Available or not
        if (await isInternet()) {
            //Bind request user sign up report
            let req = {
                PageIndex: 1,
                Page_Size: this.state.PageSize,
               /*  FromDate: this.state.FromDate,
                ToDate: this.state.ToDate, */
            }

            //call activityLogList api
            this.props.activityLogList(req)
        }
        else {
            this.setState({ refreshing: false })
        }
    }

    //for BackPress if Drawer is Open Than First Close The Drawer else Back to Previous Screen
    onBackPress() {
        if (this.state.isDrawerOpen) {
            // Close Drawer
            this.drawer.closeDrawer();
            this.setState({ isDrawerOpen: false })
        }
        else {
            //goging back screen
            this.props.navigation.goBack();
        }
    }

    shouldComponentUpdate(nextProps, _nextState) {
        //stop twice api call
        return isCurrentScreen(nextProps);
    }

    // Set state to original value
    onResetPress = async () => {
        this.setState({
            selectedMode: R.strings.Please_Select, userName: '', ipAddress: '', searchInput: '',
            FromDate: getCurrentDate(), ToDate: getCurrentDate(), Page: 1
        })

        // Close Drawer
        this.drawer.closeDrawer();

        // Check NetWork is Available or not
        if (await isInternet()) {
            //Bind request 
            let activityLogListRequest = {
                PageIndex: 1,
                Page_Size: this.state.PageSize,
                FromDate: getCurrentDate(),
                ToDate: getCurrentDate(),
                UserName: '',
                IpAddress: '',
                Mode: '',
            }

            //call activityLogList api
            this.props.activityLogList(activityLogListRequest)
        }
        else {
            this.setState({ refreshing: false })
        }
    }

    /* if press on complete button then check validation and api calling */
    onCompletePress = async () => {
        //If Filter from Complete Button Click then empty searchInput
        this.setState({ searchInput: '', Page: 1 })
        //Check All From Date Validation
        if (DateValidation(this.state.FromDate, this.state.ToDate)) {
            this.toast.Show(DateValidation(this.state.FromDate, this.state.ToDate));
            return;
        }
        if (validateIPaddress(this.state.ipAddress)) {
            this.toast.Show(R.strings.enterValidIpAddress)
            return;
        }

        try {
            //If Filter from Complete Button Click then empty searchInputs
            let req = {
                PageIndex: 1,
                Page_Size: this.state.PageSize,
                FromDate: this.state.FromDate,
                ToDate: this.state.ToDate,
                UserName: this.state.userName,
                IpAddress: (this.state.ipAddress).toString(),
                Mode: R.strings.Please_Select !== this.state.selectedMode ? this.state.selectedMode : '',
            }

            // Check NetWork is Available or not
            if (await isInternet()) {
                //call activityLogList api
                this.props.activityLogList(req);
            }
        } catch (error) {

        }

        // Close Drawer
        this.drawer.closeDrawer();
    }

    navigationDrawer = () => {
        return (
            <FilterWidget
                FromDatePickerCall={(date) => this.setState({ FromDate: date })}
                ToDatePickerCall={(date) => this.setState({ ToDate: date })}
                toastRef={component => this.toast = component}
                FromDate={this.state.FromDate}
                ToDate={this.state.ToDate}
                textInputStyle={{ marginTop: 0, marginBottom: 0, }}
                textInputs={[
                    {
                        header: R.strings.userName,
                        reference: input => { this.inputs['userName'] = input; },
                        placeholder: R.strings.userName,
                        multiline: false,
                        keyboardType: 'default',
                        returnKeyType: "next",
                        blurOnSubmit: false,
                        onChangeText: (item) => this.setState({ userName: item }),
                        onSubmitEditing: () => this.focusNextField('ipAddress'),
                        value: this.state.userName,
                    },
                    {
                        header: R.strings.ipAddressTitle,
                        reference: input => { this.inputs['ipAddress'] = input; },
                        placeholder: R.strings.ipAddressTitle,
                        multiline: false,
                        keyboardType: 'numeric',
                        returnKeyType: "done",
                        onChangeText: (item) => this.setState({ ipAddress: item }),
                        onSubmitEditing: () => this.focusNextField('deviceId'),
                        value: this.state.ipAddress,
                    },
                ]}
                comboPickerStyle={{ marginTop: 0, }}
                pickers={[
                    {
                        title: R.strings.mode,
                        array: this.state.mode,
                        selectedValue: this.state.selectedMode,
                        onPickerSelect: (item) => this.setState({ selectedMode: item })
                    },
                ]}
                onResetPress={this.onResetPress}
                onCompletePress={this.onCompletePress}
            />
        )
    }

    //this Method is used to focus on next feild
    focusNextField(id) {
        this.inputs[id].focus();
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
        if (ActivityLogHistoryList.oldProps !== props) {
            ActivityLogHistoryList.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //Get All Updated Feild of Particular actions
            const { LogHistoryListData } = props.Listdata;

            if (LogHistoryListData) {
                try {
                    if (state.LogHistoryDataState == null || (state.LogHistoryDataState != null && LogHistoryListData !== state.LogHistoryDataState)) {
                        //succcess response fill the list 
                        if (validateResponseNew({ response: LogHistoryListData, isList: true, })) {
                            var res = parseArray(LogHistoryListData.ActivityLogHistoryList);
                            return {
                                ...state,
                                LogHistoryDataState: LogHistoryListData,
                                response: res,
                                refreshing: false,
                                row: addPages(LogHistoryListData.TotalRow)
                            }
                        } else {
                            //if response is not validate than list is empty
                            return {
                                ...state,
                                LogHistoryListData: null,
                                response: [],
                                refreshing: false,
                                row: []
                            }
                        }
                    }
                } catch (e) {
                    return {
                        ...state,
                        response: [],
                        refreshing: false,
                        row: []
                    }
                }
            }
        }
        return null;
    }

    // Pagination Method Called When User Change Page  
    onPageChange = async (pageNo) => {

        //if user selecte other page number then and only then API Call else no need to call API
        if ((pageNo) !== (this.state.Page)) {
            this.setState({ Page: pageNo });

            // Check NetWork is Available or not
            if (await isInternet()) {
                //Bind request 
                let activityLogListRequest = {
                    PageIndex: pageNo,
                    Page_Size: this.state.PageSize,
                    FromDate: this.state.FromDate,
                    ToDate: this.state.ToDate,
                    UserName: this.state.userName,
                    IpAddress: (this.state.ipAddress).toString(),
                    Mode: R.strings.Please_Select !== this.state.selectedMode ? this.state.selectedMode : '',
                }

                //call activityLogList api
                this.props.activityLogList(activityLogListRequest)

            } else {
                this.setState({ refreshing: false });
            }
        }

    }

    onViewPress = (item) => {
        //redirect to detail screen
        this.props.navigation.navigate('ActivityLogHistoryDetail', { item })
    }

    //For Swipe to referesh Functionality
    onRefresh = async () => {
        this.setState({ refreshing: true });

        // Check NetWork is Available or not
        if (await isInternet()) {
            //Bind request 
            let activityLogListRequest = {
                PageIndex: this.state.Page,
                Page_Size: this.state.PageSize,
                FromDate: this.state.FromDate,
                ToDate: this.state.ToDate,
                UserName: this.state.userName,
                IpAddress: (this.state.ipAddress).toString(),
                Mode: R.strings.Please_Select !== this.state.selectedMode ? this.state.selectedMode : '',
            }

            //call activityLogList api
            this.props.activityLogList(activityLogListRequest)
        }
        else { this.setState({ refreshing: false }) }
    }

    componentWillUnmount() {

        //clear data on backpress
        this.props.clearActivityLog()
    }

    render() {

        //Get is Fetching value For All APIs to handle Progress bar in All Activity
        const { loading } = this.props.Listdata;

        //Display based on filter if aplied filter or display all records
        let finalItems = this.state.response;
        if (finalItems.length > 0) {
            finalItems = this.state.response.filter(item =>
                item.UserName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
                item.IPAddress.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
                item.DeviceId.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
                item.AliasName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
                item.ModuleTypeName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
                item.ActivityType.toLowerCase().includes(this.state.searchInput.toLowerCase())
            )
        }

        return (
            // DrawerLayout for user sign up report list  Filteration
            <Drawer
                easingFunc={Easing.ease} ref={cmpDrawer => this.drawer = cmpDrawer}
                drawerContent={this.navigationDrawer()}
                onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
                onDrawerClose={() => this.setState({ isDrawerOpen: false })}
                drawerWidth={R.dimens.FilterDrawarWidth}
                drawerPosition={Drawer.positions.Right}
                type={Drawer.types.Overlay}
            >

                <SafeView
                    style={{ flex: 1, backgroundColor: R.colors.background }}
                >
                    {/* To Set Status Bas as per out theme */}
                    <CommonStatusBar />

                    {/* To Set ToolBar as per out theme */}
                    <CustomToolbar
                        title={R.strings.activityLogHistory}
                        isBack={true}
                        rightIcon={R.images.FILTER}
                        searchable={true}
                        nav={this.props.navigation}
                        onSearchText={(text) => this.setState({ searchInput: text })}
                        onRightMenuPress={() => this.drawer.openDrawer()}
                    />

                    <View style={{ flex: 1, justifyContent: 'space-between' }}>
                        {/* Progress */}
                        {(loading && !this.state.refreshing)
                            ?
                            <ListLoader />
                            :
                            <FlatList
                                data={finalItems}
                                extraData={this.state}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item, index }) => {
                                    return <ActivityLogHistoryListItem
                                        item={item}
                                        index={index}
                                        size={this.state.response.length}
                                        onPress={() => this.onViewPress(item)}
                                    />
                                }}
                                keyExtractor={(_item, index) => index.toString()}
                                contentContainerStyle={contentContainerStyle(finalItems)}
                                ListEmptyComponent={() => <ListEmptyComponent />}
                                refreshControl={<RefreshControl
                                    colors={[R.colors.accent]}
                                    progressBackgroundColor={R.colors.background}
                                    refreshing={this.state.refreshing}
                                    onRefresh={this.onRefresh}
                                />}
                            />
                        }
                        <View>
                            {/*To Set Pagination View  */}
                            {finalItems.length > 0 &&
                                <PaginationWidget row={this.state.row} selectedPage={this.state.Page} onPageChange={(item) => { this.onPageChange(item) }} />
                            }
                        </View>
                    </View>
                </SafeView>
            </Drawer >
        );
    }
}

// This Class is used for display record in list
class ActivityLogHistoryListItem extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        let { index, size, item } = this.props;

        return (
            // Flatlist item animation
            <AnimatableItem>
                <View style={{
                    marginLeft: R.dimens.widget_left_right_margin,  marginRight: R.dimens.widget_left_right_margin,
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    flex: 1,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                }}>

                    <CardView 
                    onPress={this.props.onPress}
                    style={{
                        margin: 0,
                        elevation: R.dimens.listCardElevation,
                        flex: 1,
                        borderBottomLeftRadius: R.dimens.margin,
                        borderTopRightRadius: R.dimens.margin,
                        borderRadius: 0,
                    }} >

                        <View style={{ flexDirection: 'row', flex: 1 }}>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', }}>
                                <ImageTextButton
                                    icon={R.images.ic_history}
                                    style={{ justifyContent: 'center', width: R.dimens.IconWidthHeight, height: R.dimens.IconWidthHeight, margin: 0, backgroundColor: R.colors.accent, borderRadius: R.dimens.ButtonHeight }}
                                    iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: R.colors.white }}
                                />
                                <View style={{ flex: 1, marginLeft: R.dimens.widget_left_right_margin, }}>
                                    <TextViewHML style={{ flex: 1, marginTop: R.dimens.LineHeight, color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.ipTitle + ': '}<TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>{item.IPAddress ? item.IPAddress : '-'}</TextViewHML></TextViewHML>
                                    <TextViewHML style={{ flex: 1, marginTop: R.dimens.LineHeight, color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.moduleType + ': '}<TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>{item.ModuleTypeName ? item.ModuleTypeName : '-'}</TextViewHML></TextViewHML>
                                    <TextViewHML style={{ flex: 1, marginTop: R.dimens.LineHeight, color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.aliasName + ': '}<TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>{item.AliasName ? item.AliasName : '-'}</TextViewHML></TextViewHML>
                                    <TextViewHML style={{ flex: 1, marginTop: R.dimens.LineHeight, color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.activityType + ': '}<TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>{item.ActivityType ? item.ActivityType : '-'}</TextViewHML></TextViewHML>
                                    <TextViewHML numberOfLines={1} style={{ marginTop: R.dimens.LineHeight, color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.deviceTitle + ': '}<TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>{item.DeviceId ? item.DeviceId : '-'}</TextViewHML></TextViewHML>
                                </View>
                            </View>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row', marginTop: R.dimens.widgetMargin, alignItems: 'center', justifyContent: 'flex-end', }}>
                            <ImageTextButton
                                style={{ margin: 0, paddingRight: R.dimens.widgetMargin, }}
                                icon={R.images.IC_TIMER}
                                iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
                            />
                            <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{convertDateTime(item.CreatedDate, 'YYYY-MM-DD HH:mm:ss', false)}</TextViewHML>
                        </View>
                    </CardView>
                </View>
            </AnimatableItem>
        )
    };
}

function mapStatToProps(state) {
    //Updated Data For ActivityLogHistoryReducer Data 
    return { Listdata: state.ActivityLogHistoryReducer }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform activityLogList List Action 
        activityLogList: (activityLogListRequest) => dispatch(activityLogList(activityLogListRequest)),
        //Perform clearActivityLog Action 
        clearActivityLog: () => dispatch(clearActivityLog()),
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(ActivityLogHistoryList);

