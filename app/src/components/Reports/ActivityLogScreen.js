import React, { Component } from 'react';
import { View, RefreshControl, FlatList, Easing, Text } from 'react-native';
import { connect } from 'react-redux';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../native_theme/components/CustomToolbar'
import { changeTheme, parseArray, addPages, convertDateTime } from '../../controllers/CommonUtils';
import { isInternet, validateResponseNew, } from '../../validations/CommonValidation';
import { isCurrentScreen, addRouteToBackPress } from '../Navigation';
import { getActivityLogList, getModuleType } from '../../actions/Reports/ActivityLogActions';
import { contentContainerStyle, ListEmptyComponent } from '../../native_theme/components/FlatListWidgets';
import ListLoader from '../../native_theme/components/ListLoader';
import Drawer from 'react-native-drawer-menu';
import CommonToast from '../../native_theme/components/CommonToast';
import PaginationWidget from '../Widget/PaginationWidget';
import { DateValidation } from '../../validations/DateValidation';
import R from '../../native_theme/R';
import { AppConfig } from '../../controllers/AppConfig';
import ImageTextButton from '../../native_theme/components/ImageTextButton';
import CardView from '../../native_theme/components/CardView';
import TextViewHML from '../../native_theme/components/TextViewHML';
import { Fonts } from '../../controllers/Constants';
import FilterWidget from '../Widget/FilterWidget';
import AnimatableItem from '../../native_theme/components/AnimatableItem';
import SafeView from '../../native_theme/components/SafeView';

class ActivityLogScreen extends Component {
    constructor(props) {
        super(props);

        //Define All initial State
        this.state = {
            ActivityLogResponse: [],
            row: [],
            PageSize: AppConfig.pageSize,
            selectedPage: 0,
            refreshing: false,
            searchInput: '',
            DeviceId: '',
            location: '',
            FromDate: '',
            ToDate: '',
            isFirstTime: true,
            isDrawerOpen: false, // First Time Drawer is Closed
        };

        //Initial Request Parameter
        this.Request = {
            PageIndex: 0,
            Page_Size: AppConfig.pageSize,
            FromDate: '',
            ToDate: '',
        }

        //Add Current Screen to Manual Handling BackPress Events
        addRouteToBackPress(props);

        this.drawer = React.createRef();
        this.toast = React.createRef();
        this.inputs = {};

        //To Bind All Method
        this.onBackPress = this.onBackPress.bind(this);
        this.props.navigation.setParams({ onBackPress: this.onBackPress });
        this.onRefresh = this.onRefresh.bind(this);
        this.onPageChange = this.onPageChange.bind(this);
        this.onCompletePress = this.onCompletePress.bind(this);
        this.onResetPress = this.onResetPress.bind(this);
    }

    async componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        // Check internet connection
        if (await isInternet()) {
            // Called Activity Log List Api
            this.props.getActivityLogList(this.Request)
        }
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

    //this Method is used to focus on next feild 
    focusNextField(id) {
        this.inputs[id].focus();
    }

    //this Method is used when User Refresh Page
    async onRefresh() {
        this.setState({ refreshing: true })
        /* check internet connection */
        if (await isInternet()) {
            //bind Request for Activtylog List Api
            this.Request = {
                PageIndex: this.state.selectedPage,
                Page_Size: this.state.PageSize,
                FromDate: this.state.FromDate,
                ToDate: this.state.ToDate,
                Location: this.state.location,
                Device: this.state.DeviceId,
            }
            /* Called Activity List Api */
            this.props.getActivityLogList(this.Request)
        } else {
            this.setState({ refreshing: false })
        }
    }

    /* this method is called when page change and also api call */
    async onPageChange(pageNo) {
        //if selceted page is not same as Previous Selected page Then Call Api
        if (this.state.selectedPage !== pageNo - 1) {

            this.setState({ selectedPage: pageNo - 1 });
            //Check NetWork is Available or not
            if (await isInternet()) {
                //bind Request for Activtylog List Api
                this.Request = {
                    PageIndex: pageNo - 1,
                    Page_Size: this.state.PageSize,
                    FromDate: this.state.FromDate,
                    ToDate: this.state.ToDate,
                    Location: this.state.location,
                    Device: this.state.DeviceId,
                }
                /* Called Activity Log List Api */
                this.props.getActivityLogList(this.Request)
            } else {
                this.setState({ refreshing: false })
            }
        }
    }

    async onResetPress() {
        //clear filter on Reset Press
        this.setState({
            searchInput: '',
            selectedPage: 0,
            FromDate: '',
            ToDate: '',
            DeviceId: '',
            location: '',
        })
        this.drawer.closeDrawer();
        if (await isInternet()) {
            //bind Request for Activtylog List Api
            let activityLogListRequest = {
                PageIndex: 0,
                Page_Size: this.state.PageSize,
                FromDate: '',
                ToDate: '',
            }
            this.props.getActivityLogList(activityLogListRequest)
        }
        else {
            this.setState({ refreshing: false })
        }
    }

    async  onCompletePress() {
        //date validations for filter
        if (this.state.FromDate == "" && this.state.ToDate !== "" || this.state.FromDate !== "" && this.state.ToDate == "") {
            this.toast.Show(R.strings.bothDateRequired);
            return
        }

        this.setState({ searchInput: '' })

        if (DateValidation(this.state.FromDate, this.state.ToDate, true)) {
            this.toast.Show(DateValidation(this.state.FromDate, this.state.ToDate, true))
        } else {

            /* Close Drawer user press on Complete button bcoz display flatlist item on Screen */
            this.drawer.closeDrawer();
            this.setState({ selectedPage: 0 })

            if (await isInternet()) {
                this.Request = {
                    PageIndex: 0,
                    Page_Size: this.state.PageSize,
                    FromDate: this.state.FromDate,
                    ToDate: this.state.ToDate,
                    Location: this.state.location,
                    Device: this.state.DeviceId,
                }
                // Called Activity Log list Api
                this.props.getActivityLogList(this.Request)
            }
        }
    }

    shouldComponentUpdate(nextProps, _nextState) {
        /* stop twice api call */
        return isCurrentScreen(nextProps)
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
        if (ActivityLogScreen.oldProps !== props) {
            ActivityLogScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {

            //Get All Updated Feild of Particular actions
            const { ActivityLogData } = props.ActivityLogResult;

            //  ActivityLogData is not null
            if (ActivityLogData) {
                try {
                    if (state.ActivityLogData == null || (state.ActivityLogData != null && ActivityLogData !== state.ActivityLogData)) {
                        if (validateResponseNew({ response: ActivityLogData, isList: true })) {
                            //Set State For Api response , Selected Item and Refershing Bit
                            return Object.assign({}, state, {
                                ActivityLogResponse: parseArray(ActivityLogData.ActivityLogHistoryList),
                                row: addPages(ActivityLogData.TotalRow),
                                refreshing: false,
                                ActivityLogData
                            })
                        } else {
                            return Object.assign({}, state, {
                                ActivityLogResponse: [], refreshing: false, ActivityLogData
                            })
                        }
                    }
                } catch (error) {
                    return Object.assign({}, state, {
                        ActivityLogResponse: [], refreshing: false, ActivityLogData
                    })
                }
            }
        }
        return null;
    };

    /* Drawer Navigation */
    navigationDrawer() {
        return (
            <SafeView style={this.styles().container}>

                {/* For Toast */}
                <CommonToast ref={component => this.toast = component} styles={{ width: R.dimens.FilterDrawarWidth }} />

                <FilterWidget
                    FromDatePickerCall={(date) => this.setState({ FromDate: date })}
                    FromDate={this.state.FromDate}
                    ToDatePickerCall={(date) => this.setState({ ToDate: date })}
                    ToDate={this.state.ToDate}
                    textInputStyle={{ marginTop: 0, marginBottom: 0, }}
                    textInputs={[
                        {
                            header: R.strings.deviceTitle,
                            placeholder: R.strings.deviceTitle,
                            multiline: false,
                            keyboardType: 'default',
                            returnKeyType: "next",
                            onChangeText: (text) => { this.setState({ DeviceId: text }) },
                            value: this.state.DeviceId,
                        },
                        {
                            header: R.strings.Location,
                            placeholder: R.strings.Location,
                            multiline: false,
                            keyboardType: 'default',
                            returnKeyType: "done",
                            onChangeText: (text) => { this.setState({ location: text }) },
                            value: this.state.location,
                        },
                    ]}
                    onResetPress={this.onResetPress}
                    onCompletePress={this.onCompletePress}
                />
            </SafeView>
        )
    }

    render() {

        //Get is Fetching value For All APIs to handle Progress bar in All Activity
        let { ActivityLogLoading } = this.props.ActivityLogResult

        //for final items from search input (validate on Device,IpAddress, Location and Date)
        //default searchInput is empty so it will display all records.
        let finalItems = this.state.ActivityLogResponse.filter(item =>
            item.Device.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
            item.IpAddress.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
            item.Location.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
            item.Date.toLowerCase().includes(this.state.searchInput.toLowerCase())
        )

        return (
            // Drawer for Activity Log Filteration
            <Drawer
                ref={component => this.drawer = component}
                drawerPosition={Drawer.positions.Right}
                drawerWidth={R.dimens.FilterDrawarWidth}
                drawerContent={this.navigationDrawer()}
                type={Drawer.types.Overlay}
                easingFunc={Easing.ease}
                onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
                onDrawerClose={() => this.setState({ isDrawerOpen: false })}>

                <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                    {/* To set status bar as per our theme */}
                    <CommonStatusBar />

                    {/* To set toolbar as per our theme */}
                    <CustomToolbar
                        title={R.strings.activityLogHistory}
                        isBack={true}
                        nav={this.props.navigation}
                        onBackPress={this.onBackPress}
                        searchable={true}
                        onSearchText={(text) => this.setState({ searchInput: text })}
                        rightIcon={R.images.FILTER}
                        onRightMenuPress={() => this.drawer.openDrawer()}
                    />

                    <View style={{ flex: 1, justifyContent: 'space-between' }}>
                        {/* To Check Response fetch or not if ActivityLogLoading = true then display progress bar else display List*/}
                        {
                            (ActivityLogLoading && !this.state.refreshing) ?
                                <ListLoader />
                                :
                                <FlatList
                                    style={{ marginTop: R.dimens.widgetMargin, marginBottom: R.dimens.widgetMargin }}
                                    data={finalItems}
                                    showsVerticalScrollIndicator={false}
                                    /* render all item in list */
                                    renderItem={({ item, index }) => {
                                        return <FlatListItem
                                            index={index}
                                            item={item}
                                            size={this.state.ActivityLogResponse.length}
                                        />
                                    }}
                                    /* assign index as key valye to  list item */
                                    keyExtractor={(_item, index) => index.toString()}
                                    /* For Refresh Functionality In  FlatList Item */
                                    refreshControl={
                                        <RefreshControl
                                            colors={[R.colors.accent]}
                                            progressBackgroundColor={R.colors.background}
                                            refreshing={this.state.refreshing}
                                            onRefresh={this.onRefresh}
                                        />}
                                    contentContainerStyle={contentContainerStyle(finalItems)}
                                    ListEmptyComponent={<ListEmptyComponent />}
                                />
                        }
                        {/*To Set Pagination View  */}
                        {
                            finalItems.length > 0 &&
                            <View>
                                <PaginationWidget row={this.state.row} selectedPage={this.state.selectedPage + 1} onPageChange={(item) => { this.onPageChange(item) }} />
                            </View>
                        }
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
export class FlatListItem extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps, _nextState) {
        //Check If Old Props and New Props are Equal then Return False
        if (this.props.item !== nextProps.item) {
            return true;
        }
        return false;
    }
    render() {
        let { item } = this.props
        return (
            <AnimatableItem>
                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    marginLeft: R.dimens.widget_left_right_margin,
                    marginRight: R.dimens.widget_left_right_margin,
                    marginTop: R.dimens.widgetMargin,
                    marginBottom: (this.props.index == this.props.size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                }}>
                    <CardView style={{
                        flex: 1,
                        borderRadius: 0,
                        elevation: R.dimens.listCardElevation,
                        borderBottomLeftRadius: R.dimens.margin,
                        borderTopRightRadius: R.dimens.margin,
                    }}>
                        <View style={{ flexDirection: 'row', flex: 1 }}>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', }}>
                                {/* Image Icon History */}
                                <ImageTextButton
                                    icon={R.images.ic_history}
                                    style={{ justifyContent: 'center', width: R.dimens.IconWidthHeight, height: R.dimens.IconWidthHeight, margin: 0, backgroundColor: R.colors.accent, borderRadius: R.dimens.ButtonHeight }}
                                    iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: R.colors.white }}
                                />
                                <View style={{ flex: 1, marginLeft: R.dimens.widget_left_right_margin, }}>
                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', }}>
                                        {/* Ip Address */}
                                        <TextViewHML style={{ flex: 1, marginTop: R.dimens.LineHeight, color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.ipTitle + ' : '}<TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>{item.IpAddress ? item.IpAddress : '-'}</TextViewHML></TextViewHML>
                                        {/* Location */}
                                        <Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>{item.Location ? item.Location : '-'}</Text>
                                    </View>
                                    {/* Device */}
                                    <TextViewHML numberOfLines={1} style={{ marginTop: R.dimens.LineHeight, color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.deviceTitle + ' : '}<TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>{item.Device ? item.Device : '-'}</TextViewHML></TextViewHML>
                                </View>
                            </View>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row', marginTop: R.dimens.widgetMargin, alignItems: 'center', justifyContent: 'flex-end', }}>
                            {/* Created Date and Time */}
                            <ImageTextButton
                                style={{ margin: 0, paddingRight: R.dimens.widgetMargin, }}
                                icon={R.images.IC_TIMER}
                                iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
                            />
                            <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{item.Date ? convertDateTime(item.Date) : '-'}</TextViewHML>
                        </View>
                    </CardView>
                </View>
            </AnimatableItem>
        )
    }
}

/* return state from saga or reducer */
const mapStateToProps = (state) => {
    return {
        //Updated Data For Activity Log History Action
        ActivityLogResult: state.ActivityLogReducer,
    }
}

const mapDispatchToProps = (dispatch) => ({
    //Perform Activity log History Action
    getActivityLogList: (payload) => dispatch(getActivityLogList(payload)),
    //Perform getModuleType Action
    getModuleType: () => dispatch(getModuleType()),
})

export default connect(mapStateToProps, mapDispatchToProps)(ActivityLogScreen);
