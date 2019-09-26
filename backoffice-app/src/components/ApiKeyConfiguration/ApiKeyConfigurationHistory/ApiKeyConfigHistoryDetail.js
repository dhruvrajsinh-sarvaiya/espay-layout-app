import React, { Component } from 'react'
import { Text, View, FlatList, RefreshControl, Easing } from 'react-native'
import { changeTheme, getCurrentDate, parseArray, addPages, convertDateTime } from '../../../controllers/CommonUtils';
import { isCurrentScreen, addRouteToBackPress } from '../../Navigation';
import SafeView from '../../../native_theme/components/SafeView';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import R from '../../../native_theme/R';
import { contentContainerStyle, ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import CardView from '../../../native_theme/components/CardView';
import FilterWidget from '../../widget/FilterWidget';
import Drawer from 'react-native-drawer-menu';
import { getApiKeyConfigHistory, clearApiKeyConfigHistory } from '../../../actions/ApiKeyConfiguration/ApiKeyConfigHistoryAction';
import { validateResponseNew, isInternet } from '../../../validations/CommonValidation';
import { connect } from 'react-redux';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import StatusChip from '../../widget/StatusChip';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import { AppConfig } from '../../../controllers/AppConfig';
import { DateValidation } from '../../../validations/DateValidation';
import PaginationWidget from '../../widget/PaginationWidget';
import ListLoader from '../../../native_theme/components/ListLoader';

export class ApiKeyConfigHistoryDetail extends Component {
    constructor(props) {
        super(props);

        // get data from previous screen
        let { item,
            ApiPlan, Status, UserNames,
            StatusId, UserId, ApiPlanId,
            SelectedApiPlan, SelectedUser, SelectedStatus,
            FromDate, ToDate, TotalCount
        } = props.navigation.state.params

        // Define all initial state
        this.state = {
            row: TotalCount ? addPages(TotalCount) : [],
            Status: Status ? Status : [],
            ApiPlan: ApiPlan ? ApiPlan : [],
            UserNames: UserNames ? UserNames : [],
            ApiKeyConfigHistoryRes: item ? item : [],

            selectedApiPlan: SelectedApiPlan ? SelectedApiPlan : R.strings.Select_Plan,
            selectedStatus: SelectedStatus ? SelectedStatus : R.strings.select_status,
            selectedUser: SelectedUser ? SelectedUser : R.strings.selectUser,

            StatusId: StatusId ? StatusId : 0,
            UserId: UserId ? UserId : 0,
            ApiPlanId: ApiPlanId ? ApiPlanId : 0,

            FromDate: FromDate ? FromDate : getCurrentDate(),
            ToDate: ToDate ? ToDate : getCurrentDate(),

            oldStatus: Status ? Status : [],
            oldApiPlan: ApiPlan ? ApiPlan : [],
            oldUserNames: UserNames ? UserNames : [],

            oldSelectedApiPlan: SelectedApiPlan ? SelectedApiPlan : R.strings.Select_Plan,
            oldSelectedStatus: SelectedStatus ? SelectedStatus : R.strings.select_status,
            oldSelectedUser: SelectedUser ? SelectedUser : R.strings.selectUser,

            oldStatusId: StatusId ? StatusId : 0,
            oldUserId: UserId ? UserId : 0,
            oldApiPlanId: ApiPlanId ? ApiPlanId : 0,

            oldFromDate: FromDate ? FromDate : getCurrentDate(),
            oldToDate: ToDate ? ToDate : getCurrentDate(),

            selectedPage: 1,
            searchInput: '',
            refreshing: false,
            isDrawerOpen: false,
            isFirstTime: true,
        }

        //Initial request
        this.request = {
            PageNo: 0,
            PageSize: AppConfig.pageSize,
            FromDate: FromDate ? FromDate : getCurrentDate(),
            ToDate: ToDate ? ToDate : getCurrentDate(),
            UserId: UserId ? UserId : ''
        }
        // Create Reference
        this.drawer = React.createRef()

        //add current route for backpress handle
        addRouteToBackPress(props, this.onBackPress);
        this.props.navigation.setParams({ onBackPress: this.onBackPress });
    }
    // If drawer is open then first, it will close the drawer and after it will return to previous screen
    onBackPress = () => {
        if (this.state.isDrawerOpen) {
            this.setState({ isDrawerOpen: false })
            this.drawer.closeDrawer();
        }
        else {
            //goging back screen
            this.props.navigation.goBack();
        }
    }

    shouldComponentUpdate(nextProps, _nextState) {
        //stop twice api call
        return isCurrentScreen(nextProps)
    }
    async componentDidMount() {
        // Add this method to change theme based on stored theme name.
        changeTheme()
    }


    // Pagination Method Called When User Change Page 
    onPageChange = async (pageNo) => {

        //if selected page is diffrent than call api
        if (pageNo != this.state.selectedPage) {
            //if user selecte other page number then and only then API Call elase no need to call API
            this.setState({ selectedPage: pageNo });

            // Check NetWork is Available or not
            if (await isInternet()) {
                // Bind request for Api Key Configuration History List
                this.request = {
                    ...this.request,
                    PageNo: pageNo - 1,
                }
                //Call Get Api Key Configuration History List API
                this.props.getApiKeyConfigHistory(this.request);
            } else {
                this.setState({ refreshing: false });
            }
        }
    }

    // for swipe to refresh functionality
    onRefresh = async () => {
        this.setState({ refreshing: true });

        // Check NetWork is Available or not
        if (await isInternet()) {

            // Bind request for Api Key Configuration History List
            this.request = {
                ...this.request,
                PageNo: this.state.selectedPage - 1,
            }
            // Call Get Api Key Configuration History List API
            this.props.getApiKeyConfigHistory(this.request);

        } else {
            this.setState({ refreshing: false });
        }
    }

    // Reset Filter
    onResetPress = async () => {
        // Close Drawer 
        this.drawer.closeDrawer();

        this.setState({
            FromDate: this.state.oldFromDate,
            ToDate: this.state.oldToDate,

            UserId: this.state.oldUserId,
            ApiPlanId: this.state.oldApiPlanId,
            StatusId: this.state.oldStatusId,

            selectedApiPlan: this.state.oldSelectedApiPlan,
            selectedStatus: this.state.oldSelectedStatus,
            selectedUser: this.state.oldSelectedUser
        })

        // Check NetWork is Available or not
        if (await isInternet()) {

            this.request = {
                ...this.request,
                FromDate: this.state.oldFromDate,
                ToDate: this.state.oldToDate,
                UserId: this.state.oldUserId,
            }

            // Call Get Api Key Configuration History
            this.props.getApiKeyConfigHistory(this.request);

        } else {
            this.setState({ refreshing: false });
        }
    }

    // Api Call when press on complete button
    onCompletePress = async () => {

        if (DateValidation(this.state.FromDate, this.state.ToDate, true))
            this.toast.Show(DateValidation(this.state.FromDate, this.state.ToDate, true))
        else if (this.state.selectedUser === R.strings.selectUser)
            this.toast.Show(R.strings.selectUser)
        else {

            this.setState({
                searchInput: '',
                selectedPage: 1,
            })

            // Close Drawer user press on Complete button because display flatlist item on Screen
            this.drawer.closeDrawer();

            // Check NetWork is Available or not
            if (await isInternet()) {

                // Bind request for Api Key Configuration History
                this.request = {
                    ...this.request,
                    PageNo: 0,
                    FromDate: this.state.FromDate,
                    ToDate: this.state.ToDate,
                    UserId: this.state.selectedUser !== R.strings.selectUser ? this.state.UserId : '',
                    Status: this.state.selectedStatus !== R.strings.select_status ? this.state.StatusId : '',
                    PlanId: this.state.selectedApiPlan !== R.strings.Select_Plan ? this.state.ApiPlanId : '',
                }

                // Call Get Api Key Configuration History API
                this.props.getApiKeyConfigHistory(this.request);

            } else {
                this.setState({ refreshing: false });
            }
        }
    }

    static oldProps = {};

    static getDerivedStateFromProps(props, state) {

        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return { ...state, isFirstTime: false, };
        }

        // To Skip Render if old and new props are equal
        if (ApiKeyConfigHistoryDetail.oldProps !== props) {
            ApiKeyConfigHistoryDetail.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            // Get all upadated field of particular actions
            const { ApiKeyConfigHistory, } = props.ApiKeyConfigHistoryResult

            // ApiKeyConfigHistory is not null
            if (ApiKeyConfigHistory) {
                try {
                    if (state.ApiKeyConfigHistoryState == null ||
                        (state.ApiKeyConfigHistoryState !== null &&
                            ApiKeyConfigHistory !== state.ApiKeyConfigHistoryState)) {
                        //succcess response fill the list 
                        if (validateResponseNew({ response: ApiKeyConfigHistory, isList: true, })) {
                            let res = parseArray(ApiKeyConfigHistory.Response)
                            for (var itemData in res) {
                                let permission = R.strings.view_rights
                                let item = res[itemData]
                                let status = R.strings.Disable
                                let ipAccess = R.strings.unRestricted
                                if (item.APIPermission == 1) {
                                    permission = R.strings.admin_rights
                                }
                                if (item.IPAccess == 1) {
                                    ipAccess = R.strings.restricted
                                }
                                if (item.Status == 1)
                                    status = R.strings.active
                                else if (item.Status == 0)
                                    status = R.strings.inActive

                                item.ApiPermissionText = permission
                                item.IpAccessText = ipAccess
                                item.StatusText = status
                            }

                            return Object.assign({}, state, {
                                ApiKeyConfigHistoryState: ApiKeyConfigHistory,
                                ApiKeyConfigHistoryRes: res,
                                refreshing: false,
                                row: addPages(ApiKeyConfigHistory.TotalCount)
                            })
                        } else {
                            //if response is not validate than list is empty
                            return Object.assign({}, state, {
                                ApiKeyConfigHistoryState: null,
                                row: [],
                                ApiKeyConfigHistoryRes: [],
                                refreshing: false,
                            })
                        }
                    }
                } catch (e) {
                    return Object.assign({}, state, {
                        row: [],
                        ApiKeyConfigHistoryState: null,
                        ApiKeyConfigHistoryRes: [],
                        refreshing: false,
                    })
                }
            }
        }
        return null
    }

    // Drawer Navigation
    navigationDrawer() {

        return (
            // for show filter of fromdate, todate,currency and user data etc
            <FilterWidget
                FromDatePickerCall={(FromDate) => this.setState({ FromDate })}
                ToDatePickerCall={(ToDate) => this.setState({ ToDate })}
                toastRef={component => this.toast = component}
                ToDate={this.state.ToDate}
                onResetPress={this.onResetPress}
                FromDate={this.state.FromDate}
                onCompletePress={this.onCompletePress}
                comboPickerStyle={{ marginTop: 0 }}
                pickers={[
                    {
                        title: R.strings.userName,
                        selectedValue: this.state.selectedUser,
                        array: this.state.UserNames,
                        onPickerSelect: (index, object) => this.setState({ selectedUser: index, UserId: object.Id })
                    },
                    {
                        array: this.state.ApiPlan,
                        title: R.strings.planID,
                        selectedValue: this.state.selectedApiPlan,
                        onPickerSelect: (index, object) => this.setState({ selectedApiPlan: index, ApiPlanId: object.ID })
                    },
                    {
                        array: this.state.Status,
                        title: R.strings.status,
                        onPickerSelect: (index, object) => this.setState({ selectedStatus: index, StatusId: object.Id }),
                        selectedValue: this.state.selectedStatus,
                    },
                ]}
            />
        )
    }

    render() {

        // Loading status for Progress bar which is fetching from reducer
        let { ApiKeyConfigHistoryLoading } = this.props.ApiKeyConfigHistoryResult

        // For searching functionality
        let finalItems = this.state.ApiKeyConfigHistoryRes.filter(item => (
            item.AliasName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
            item.PlanName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
            item.IpAccessText.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
            item.ApiPermissionText.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
            item.StatusText.toLowerCase().includes(this.state.searchInput.toLowerCase())
        ))

        return (
            // DrawerLayout for Api Key Configuration History Filteration
            <Drawer
                drawerWidth={R.dimens.FilterDrawarWidth}
                ref={cmpDrawer => this.drawer = cmpDrawer}
                onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
                onDrawerClose={() => this.setState({ isDrawerOpen: false })}
                type={Drawer.types.Overlay}
                drawerPosition={Drawer.positions.Right}
                drawerContent={this.navigationDrawer()}
                easingFunc={Easing.ease}>

                <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                    {/* To set status bar as per our theme */}
                    <CommonStatusBar />

                    {/* To setToolbar as per our theme */}
                    <CustomToolbar
                        isBack={true}
                        title={R.strings.apiKeyConfigurationHistory}
                        rightIcon={R.images.FILTER}
                        nav={this.props.navigation}
                        onRightMenuPress={() => this.drawer.openDrawer()}
                        searchable={true}
                        onSearchText={(text) => this.setState({ searchInput: text })}
                    />

                    <View style={{ flex: 1, justifyContent: 'space-between' }}>
                        {
                            (ApiKeyConfigHistoryLoading && !this.state.refreshing) ?
                                <ListLoader />
                                :
                                <FlatList
                                    data={finalItems}
                                    showsVerticalScrollIndicator={false}
                                    // render all item in list
                                    renderItem={({ item, index }) =>
                                        <ApiKeyConfigHistoryDetailItem
                                            index={index}
                                            size={finalItems.length}
                                            item={item}
                                            onPress={() => this.props.navigation.navigate('ApiKeyConfigHistoryDetail', { item })}
                                        />}
                                    // assign index as key value to Withdraw Report list item
                                    keyExtractor={(_item, index) => index.toString()}
                                    // Refresh functionality in api plan configuration
                                    refreshControl={
                                        <RefreshControl
                                            colors={[R.colors.accent]}
                                            refreshing={this.state.refreshing}
                                            onRefresh={this.onRefresh}
                                            progressBackgroundColor={R.colors.background}
                                        />
                                    }
                                    contentContainerStyle={contentContainerStyle(finalItems)}
                                    // Displayed empty component when no record found 
                                    ListEmptyComponent={<ListEmptyComponent />}
                                />
                        }

                        {/* To Set Pagination View  */}
                        <View>
                            {
                                finalItems.length > 0 &&
                                <PaginationWidget row={this.state.row} 
                                onPageChange={(item) => { this.onPageChange(item) }}
                                selectedPage={this.state.selectedPage} 
                                 />
                            }
                        </View>
                    </View>
                </SafeView>
            </Drawer>
        )
    }
}

// This Class is used for display record in list
class ApiKeyConfigHistoryDetailItem extends Component {

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        // If new props and old props are equal then it will return false otherwise it will return true
        if (this.props.item === nextProps.item)
            return false
        return true
    }

    render() {
        let { size, index, item, onPress, } = this.props

        // Default for Disable
        let statusColor = R.colors.textSecondary
        let statusText = R.strings.Disable
        // InActive
        if (item.Status == 0) {
            statusText = R.strings.inActive
            statusColor = R.colors.failRed
        }
        // Active
        else if (item.Status == 1) {
            statusText = R.strings.active
            statusColor = R.colors.successGreen
        }

        return (
            // flatlist item animation
            <AnimatableItem>
                <View style={{
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginLeft: R.dimens.widget_left_right_margin,
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    flex: 1,
                    marginRight: R.dimens.widget_left_right_margin,
                }}>
                    <CardView style={{
                        elevation: R.dimens.listCardElevation,
                        borderTopRightRadius: R.dimens.margin,
                        borderRadius: 0,
                        flex: 1,
                        borderBottomLeftRadius: R.dimens.margin,
                    }} onPress={onPress}>

                        <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', }}>

                            {/* Alias Name */}
                            <TextViewMR style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary }}>{item.AliasName}</TextViewMR>
                            <TextViewMR style={{ fontSize: R.dimens.smallText, color: R.colors.yellow }}>{item.PlanName}</TextViewMR>
                        </View>

                        {/* API Permission */}
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.api_permission + ': '}</TextViewHML>
                            <TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{item.APIPermission == 1 ? R.strings.admin_rights : R.strings.view_rights}</TextViewHML>
                        </View>

                        {/* IP Access */}
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.ipAccess + ': '}</TextViewHML>
                            <TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{item.IPAccess == 1 ? R.strings.restricted : R.strings.unRestricted}</TextViewHML>
                        </View>

                        {/* IP Access */}
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.updatedDate + ': '}</TextViewHML>
                            <TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{convertDateTime(item.UpdatedDate, 'YYYY-MM-DD HH:mm:ss', false)}</TextViewHML>
                        </View>

                        {/* for show status and date */}
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: R.dimens.widgetMargin, }}>
                            <StatusChip
                                color={statusColor}
                                value={statusText}></StatusChip>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                
                                <ImageTextButton
                                    icon={R.images.IC_TIMER}
                                    style={{ margin: 0, paddingRight: R.dimens.LineHeight, }}
                                    iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}/>
                                <TextViewHML 
                                style={{ alignSelf: 'center', color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{convertDateTime(item.CreatedDate, 'YYYY-MM-DD HH:mm:ss', false)}</TextViewHML>
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
        // get api key configuration history data from reducer
        ApiKeyConfigHistoryResult: state.ApiKeyConfigHistoryReducer,
    }
}

const mapDispatchToProps = (dispatch) => ({
    // Perform Api Key Configuration History Action
    getApiKeyConfigHistory: (payload) => dispatch(getApiKeyConfigHistory(payload)),
    // Perform Clear Api Key Configuration History Action
    clearApiKeyConfigHistory: () => dispatch(clearApiKeyConfigHistory()),
})

export default connect(mapStateToProps, mapDispatchToProps)(ApiKeyConfigHistoryDetail)