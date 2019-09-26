// ApiPlanConfigurationHistoryScreen.js
import React, { Component } from 'react'
import { View, FlatList, RefreshControl, Easing } from 'react-native'
import { changeTheme, parseArray, addPages, getCurrentDate, parseFloatVal, convertDate, convertTime, getPlanValidity, } from '../../../controllers/CommonUtils';
import { isCurrentScreen, addRouteToBackPress } from '../../Navigation';
import SafeView from '../../../native_theme/components/SafeView';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import R from '../../../native_theme/R';
import { contentContainerStyle, ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import CardView from '../../../native_theme/components/CardView';
import PaginationWidget from '../../widget/PaginationWidget';
import { connect } from 'react-redux';
import ListLoader from '../../../native_theme/components/ListLoader';
import { isInternet, validateResponseNew, validateValue, } from '../../../validations/CommonValidation';
import Drawer from 'react-native-drawer-menu';
import { AppConfig } from '../../../controllers/AppConfig';
import FilterWidget from '../../widget/FilterWidget';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import { getUserDataList, getApiPlanConfigList } from '../../../actions/PairListAction';
import { getApiPlanConfigurationHistory, clearApiPlanConfigurationHistory } from '../../../actions/ApiKeyConfiguration/ApiPlanConfigHistoryAction';
import StatusChip from '../../widget/StatusChip';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import { DateValidation } from '../../../validations/DateValidation';

export class ApiPlanConfigurationHistoryScreen extends Component {
    constructor(props) {
        super(props);

        //Define all initial state
        this.state = {
            row: [],

            fromDate: getCurrentDate(),
            toDate: getCurrentDate(),

            // for Api Plan Config History List
            ApiPlanConfigHistoryResponse: [],
            ApiPlanConfigHistoryListState: null,

            UserDataListState: null,
            userName: [],
            selectedUserName: R.strings.Please_Select,
            userId: 0,

            ApiPlanConfigListState: null,
            selectedPlan: R.strings.Please_Select,
            PlanList: [],
            planId: 0,

            searchInput: '',
            selectedPage: 1,

            isFirstTime: true,
            refreshing: false,
            isDrawerOpen: false,
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
        changeTheme()

        this.callApiPlanConfigHistory()
        // Call User Data List Api
        this.props.getUserDataList()
        // Call Api Plan Config List Api
        this.props.getApiPlanConfigList()
    }

    shouldComponentUpdate(nextProps, _nextState) {
        //stop twice api call
        return isCurrentScreen(nextProps)
    }

    componentWillUnmount() {
        // clear reducer data
        this.props.clearApiPlanConfigurationHistory()
    }

    // for swipe to refresh functionality
    onRefresh = async () => {
        this.setState({ refreshing: true });

        // Check NetWork is Available or not
        if (await isInternet()) {

            // Bind request for  Api Plan Configuration History List
            let request = {
                UserID: this.state.selectedUserName === R.strings.Please_Select ? 0 : this.state.userId,
                PlanID: this.state.selectedPlan === R.strings.Please_Select ? 0 : this.state.planId,
                FromDate: this.state.fromDate,
                ToDate: this.state.toDate,
                Pagesize: AppConfig.pageSize,
                PageNo: this.state.selectedPage - 1,
            }
            // Call Api Plan Configuration History API
            this.props.getApiPlanConfigurationHistory(request);

        } else {
            this.setState({ refreshing: false });
        }
    }

    // Reset Filter
    onResetPress = async () => {
        // Close drawer
        this.drawer.closeDrawer()

        // set Initial State
        this.setState({
            selectedUserName: R.strings.Please_Select,
            userId: 0,
            selectedPlan: R.strings.Please_Select,
            planId: 0,
            fromDate: getCurrentDate(),
            toDate: getCurrentDate(),
            searchInput: '',
            selectedPage: 1
        })

        // Check NetWork is Available or not
        if (await isInternet()) {

            // Bind request for  Api Plan Configuration History List
            let request = {
                FromDate: getCurrentDate(),
                ToDate: getCurrentDate(),
                Pagesize: AppConfig.pageSize,
                PageNo: 0,
            }
            //Call Api Plan Configuration History API
            this.props.getApiPlanConfigurationHistory(request);

        } else {
            this.setState({ refreshing: false });
        }
    }

    // Call api when user pressed on complete button
    onCompletePress = async () => {
        // Check validation
        if (DateValidation(this.state.fromDate, this.state.toDate, true))
            this.toast.Show(DateValidation(this.state.fromDate, this.state.toDate, true))
        else {
            this.setState({
                selectedPage: 1,
                searchInput: ''
            })

            // Close Drawer user press on Complete button bcoz display flatlist item on Screen
            this.drawer.closeDrawer();

            // Check NetWork is Available or not
            if (await isInternet()) {

                // Bind request for  Api Plan Configuration History List
                let request = {
                    UserID: this.state.selectedUserName === R.strings.Please_Select ? 0 : this.state.userId,
                    PlanID: this.state.selectedPlan === R.strings.Please_Select ? 0 : this.state.planId,
                    FromDate: this.state.fromDate,
                    ToDate: this.state.toDate,
                    Pagesize: AppConfig.pageSize,
                    PageNo: 0,
                }
                //Call Api Plan Configuration History API
                this.props.getApiPlanConfigurationHistory(request);

            } else {
                this.setState({ refreshing: false });
            }
        }
    }

    // Pagination Method Called When User Change Page 
    onPageChange = async (pageNo) => {

        //if selected page is diffrent than call api
        if (pageNo != this.state.selectedPage) {
            //if user selecte other page number then and only then API Call elase no need to call API
            this.setState({ selectedPage: pageNo });

            // Check NetWork is Available or not
            if (await isInternet()) {
                // Bind request for  Api Plan Configuration History List
                let request = {
                    UserID: this.state.selectedUserName === R.strings.Please_Select ? 0 : this.state.userId,
                    PlanID: this.state.selectedPlan === R.strings.Please_Select ? 0 : this.state.planId,
                    FromDate: this.state.fromDate,
                    ToDate: this.state.toDate,
                    Pagesize: AppConfig.pageSize,
                    PageNo: pageNo - 1,
                }
                //Call Api Plan Configuration History API
                this.props.getApiPlanConfigurationHistory(request);
            } else {
                this.setState({ refreshing: false });
            }
        }
    }

    //api call
    callApiPlanConfigHistory = async () => {

        //Check NetWork is Available or not
        if (await isInternet()) {
            this.setState({
                selectedUserName: R.strings.Please_Select,
                userId: 0,
                selectedPlan: R.strings.Please_Select,
                planId: 0,
                fromDate: getCurrentDate(),
                toDate: getCurrentDate(),
                searchInput: '',
                selectedPage: 1
            })

            let request = {
                FromDate: getCurrentDate(),
                ToDate: getCurrentDate(),
                PageNo: 0,
                PageSize: AppConfig.pageSize,
            }
            // Call  Api Plan Configuration History List Api
            this.props.getApiPlanConfigurationHistory(request)
        }
    }

    static oldProps = {};

    static getDerivedStateFromProps(props, state) {

        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return { ...state, isFirstTime: false, };
        }

        // To Skip Render if old and new props are equal
        if (ApiPlanConfigurationHistoryScreen.oldProps !== props) {
            ApiPlanConfigurationHistoryScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //Get All Updated Feild of Particular actions
            const { ApiPlanConfigHistoryList, UserDataList, ApiPlanConfigList } = props.ApiPlanconfigHistoryResult

            if (UserDataList) {
                try {
                    if (state.UserDataListState == null || (state.UserDataListState !== null && UserDataList !== state.UserDataListState)) {
                        //succcess response fill the list 
                        if (validateResponseNew({ response: UserDataList, isList: true, })) {

                            let res = parseArray(UserDataList.GetUserData);

                            for (var userDataKey in res) {
                                let item = res[userDataKey]
                                item.value = item.UserName
                            }

                            let userNames = [
                                { value: R.strings.Please_Select },
                                ...res
                            ];

                            return Object.assign({}, state, {
                                UserDataListState: UserDataList,
                                userName: userNames
                            })
                        } else {
                            //if response is not validate than list is empty
                            return Object.assign({}, state, {
                                UserDataListState: null,
                                userName: [{ value: R.strings.Please_Select }],
                            })
                        }
                    }
                } catch (e) {
                    return Object.assign({}, state, {
                        userName: [{ value: R.strings.Please_Select }],
                    })
                }
            }

            if (ApiPlanConfigList) {
                try {
                    if (state.ApiPlanConfigListState == null || (state.ApiPlanConfigListState !== null && ApiPlanConfigList !== state.ApiPlanConfigListState)) {
                        //succcess response fill the list 
                        if (validateResponseNew({ response: ApiPlanConfigList, isList: true, })) {

                            let res = parseArray(ApiPlanConfigList.Response);

                            for (var apiPlanConfigKey in res) {
                                let item = res[apiPlanConfigKey]
                                item.value = item.PlanName
                            }

                            let planNames = [
                                { value: R.strings.Please_Select },
                                ...res
                            ];

                            return Object.assign({}, state, {
                                ApiPlanConfigListState: ApiPlanConfigList,
                                PlanList: planNames
                            })
                        } else {
                            //if response is not validate than list is empty
                            return Object.assign({}, state, {
                                ApiPlanConfigListState: null,
                                PlanList: [{ value: R.strings.Please_Select }],
                            })
                        }
                    }
                } catch (e) {
                    return Object.assign({}, state, {
                        PlanList: [{ value: R.strings.Please_Select }],
                    })
                }
            }

            // ApiPlanConfigHistoryList is not null
            if (ApiPlanConfigHistoryList) {
                try {
                    if (state.ApiPlanConfigHistoryListState == null || (state.ApiPlanConfigHistoryListState !== null && ApiPlanConfigHistoryList !== state.ApiPlanConfigHistoryListState)) {
                        //succcess response fill the list 
                        if (validateResponseNew({ response: ApiPlanConfigHistoryList, isList: true, })) {

                            return Object.assign({}, state, {
                                ApiPlanConfigHistoryListState: ApiPlanConfigHistoryList,
                                ApiPlanConfigHistoryResponse: parseArray(ApiPlanConfigHistoryList.Response),
                                refreshing: false,
                                row: addPages(ApiPlanConfigHistoryList.TotalCount)
                            })
                        } else {
                            //if response is not validate than list is empty
                            return Object.assign({}, state, {
                                ApiPlanConfigHistoryListState: null,
                                ApiPlanConfigHistoryResponse: [],
                                refreshing: false,
                                row: []
                            })
                        }
                    }
                } catch (e) {
                    return Object.assign({}, state, {
                        ApiPlanConfigHistoryListState: null,
                        ApiPlanConfigHistoryResponse: [],
                        refreshing: false,
                        row: [],
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
                onResetPress={this.onResetPress}
                onCompletePress={this.onCompletePress}
                toastRef={component => this.toast = component}
                FromDatePickerCall={(date) => this.setState({ fromDate: date })}
                ToDatePickerCall={(date) => this.setState({ toDate: date })}
                FromDate={this.state.fromDate}
                ToDate={this.state.toDate}
                comboPickerStyle={{ marginTop: 0 }}
                pickers={[
                    {
                        title: R.strings.UserName,
                        array: this.state.userName,
                        selectedValue: this.state.selectedUserName,
                        onPickerSelect: (index, object) => this.setState({ selectedUserName: index, userId: object.Id })
                    },
                    {
                        title: R.strings.planID,
                        array: this.state.PlanList,
                        selectedValue: this.state.selectedPlan,
                        onPickerSelect: (index, object) => this.setState({ selectedPlan: index, planId: object.ID })
                    },
                ]}
            />
        )
    }

    render() {
        
        // Loading status for Progress bar which is fetching from reducer
        let { ApiPlanConfigHistoryListLoading, } = this.props.ApiPlanconfigHistoryResult

        // For searching functionality
        let finalItems = this.state.ApiPlanConfigHistoryResponse.filter(item => (
            item.PlanName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
            item.Price.toFixed(8).toString().includes(this.state.searchInput) ||
            item.Charge.toFixed(8).toString().includes(this.state.searchInput) ||
            item.Priority.toFixed(8).toString().includes(this.state.searchInput)
        ))

        return (
            //DrawerLayout for  Api Plan Configuration History Filteration
            <Drawer
            drawerContent={this.navigationDrawer()}  onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
            onDrawerClose={() => this.setState({ isDrawerOpen: false })}
            type={Drawer.types.Overlay}
            drawerPosition={Drawer.positions.Right}
            ref={cmpDrawer => this.drawer = cmpDrawer}  drawerWidth={R.dimens.FilterDrawarWidth}
                easingFunc={Easing.ease}>

                <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                    {/* To set status bar as per our theme */}
                    <CommonStatusBar />

                    {/* To set toolbar as per our theme */}
                    <CustomToolbar
                        isBack={true}
                        title={R.strings.apiPlanConfigurationHistory}
                        onBackPress={() => this.onBackPress()}
                        nav={this.props.navigation}
                        rightIcon={R.images.FILTER}
                        onRightMenuPress={() => this.drawer.openDrawer()}
                        searchable={true}
                        onSearchText={(text) => this.setState({ searchInput: text })} />

                    <View style={{ flex: 1, justifyContent: 'space-between' }}>
                        {
                            (ApiPlanConfigHistoryListLoading && !this.state.refreshing) ?
                                <ListLoader />
                                :
                                <FlatList
                                    data={finalItems}
                                    showsVerticalScrollIndicator={false}
                                    // render all item in list
                                    renderItem={({ item, index }) => <ApiPlanConfigHistoryItem
                                        index={index}
                                        item={item}
                                        size={finalItems.length}
                                        onPress={() => { this.props.navigation.navigate('ApiPlanConfigurationHistoryDetailScreen', { item }) }}
                                    />
                                    }
                                    // assign index as key value to  Api Plan Configuration History list item
                                    keyExtractor={(_item, index) => index.toString()}
                                    // For Refresh Functionality In  Api Plan Configuration History FlatList Item
                                    refreshControl={
                                        <RefreshControl
                                            colors={[R.colors.accent]}
                                            progressBackgroundColor={R.colors.background}
                                            refreshing={this.state.refreshing}
                                            onRefresh={this.onRefresh}
                                        />
                                    }
                                    contentContainerStyle={contentContainerStyle(finalItems)}
                                    // Displayed empty component when no record found 
                                    ListEmptyComponent={<ListEmptyComponent />}
                                />
                        }

                        {/*To Set Pagination View  */}
                        <View>
                            {
                                finalItems.length > 0 &&
                                <PaginationWidget row={this.state.row} selectedPage={this.state.selectedPage} onPageChange={(item) => { this.onPageChange(item) }} />
                            }
                        </View>
                    </View>
                </SafeView>
            </Drawer>
        )
    }
}

// This Class is used for display record in list
class ApiPlanConfigHistoryItem extends Component {

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        //Check If Old Props and New Props are Equal then Return False
        if (this.props.item === nextProps.item)
            return false
        return true
    }

    render() {
        let { size, index, item, onPress } = this.props

        // Get Plan Validity in Year/Month/Days
        let planValidity = getPlanValidity(item.PlanValidityType)

        return (
            // flatlist item animation
            <AnimatableItem>
                <View style={{
                    flex: 1,
                    marginLeft: R.dimens.widget_left_right_margin,
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginRight: R.dimens.widget_left_right_margin,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                }}>
                    <CardView style={{  borderRadius: 0,
                        flex: 1,
                        borderBottomLeftRadius: R.dimens.margin,
                        borderTopRightRadius: R.dimens.margin,
                        elevation: R.dimens.listCardElevation,
                    }} onPress={onPress}>

                        <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', }}>
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
                                {/* Api Plan Name and Recursive */}
                                <TextViewMR style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary }}>{validateValue(item.PlanName)}</TextViewMR>
                                <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.accent }}>{item.IsPlanRecursive == 1 ? ' - ' + R.strings.recursive : ''}</TextViewHML>
                            </View>

                            {/* Year and Detail Button */}
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.yellow }}>{validateValue(item.PlanValidity + ' ' + planValidity)}</TextViewHML>
                                <ImageTextButton
                                    icon={R.images.RIGHT_ARROW_DOUBLE}
                                    style={{ margin: 0 }}
                                    iconStyle={{
                                        width: R.dimens.dashboardMenuIcon,
                                        height: R.dimens.dashboardMenuIcon,
                                        tintColor: R.colors.textPrimary
                                    }}
                                    onPress={onPress} />
                            </View>
                        </View>

                        {/* Priority, Price and Charge */}
                        <View style={{ flex: 1, flexDirection: 'row', }}>

                            <View style={{ flex: 1, alignItems: 'center', }}>
                                <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.priority}</TextViewHML>
                                <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText, }}>
                                    {validateValue(item.Priority)}
                                </TextViewHML>
                            </View>

                            <View style={{ flex: 1, alignItems: 'center', }}>
                                <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.Price}</TextViewHML>
                                <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>
                                    {(parseFloatVal(item.Price).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(item.Price).toFixed(8)) : '-')}
                                </TextViewHML>
                            </View>

                            <View style={{ flex: 1, alignItems: 'center', }}>
                                <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.Charge}</TextViewHML>
                                <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>
                                    {(parseFloatVal(item.Charge).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(item.Charge).toFixed(8)) : '-')}
                                </TextViewHML>
                            </View>

                        </View>

                        {/* for show status and recon icon */}
                        <View style={{ flex: 1, flexDirection: 'row', marginTop: R.dimens.widgetMargin, alignItems: 'center', justifyContent: 'space-between' }}>
                            <StatusChip
                                color={item.Status == 1 ? R.colors.successGreen : R.colors.failRed}
                                value={item.Status == 1 ? R.strings.active : R.strings.inActive}
                            />
                            <View style={{ flexDirection: 'row' }}>
                                <ImageTextButton
                                    style={{ margin: 0, paddingRight: R.dimens.LineHeight, }}
                                    icon={R.images.IC_TIMER}
                                    iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
                                />
                                <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{item.CreatedDate ? convertDate(item.CreatedDate) + ' ' + convertTime(item.CreatedDate) : '-'}</TextViewHML>
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
        // get Api Plan Configuration History data from reducer
        ApiPlanconfigHistoryResult: state.ApiPlanConfigHistoryReducer,
    }
}

const mapDispatchToProps = (dispatch) => ({
    // Api Plan Configuration History Action
    getApiPlanConfigurationHistory: (payload) => dispatch(getApiPlanConfigurationHistory(payload)),

    // Clear  Api Plan Configuration History Data Action
    clearApiPlanConfigurationHistory: () => dispatch(clearApiPlanConfigurationHistory()),

    // User Data List Action
    getUserDataList: () => dispatch(getUserDataList()),

    // Api Plan Config List Action
    getApiPlanConfigList: () => dispatch(getApiPlanConfigList()),
})

export default connect(mapStateToProps, mapDispatchToProps)(ApiPlanConfigurationHistoryScreen)