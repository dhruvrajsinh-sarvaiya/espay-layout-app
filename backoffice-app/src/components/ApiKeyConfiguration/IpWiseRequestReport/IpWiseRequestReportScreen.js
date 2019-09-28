// IpWiseRequestReportScreen.js
import React, { Component } from 'react'
import { View, FlatList, RefreshControl, Easing } from 'react-native'
import { changeTheme, parseArray, addPages, convertDate, convertTime, } from '../../../controllers/CommonUtils';
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
import { isInternet, validateResponseNew, validateValue, isEmpty, validateIPaddress, } from '../../../validations/CommonValidation';
import Drawer from 'react-native-drawer-menu';
import { AppConfig } from '../../../controllers/AppConfig';
import FilterWidget from '../../widget/FilterWidget';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import { getIpWiseReport, clearIpWiseReport } from '../../../actions/ApiKeyConfiguration/IpWiseRequestReportAction';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import { DateValidation } from '../../../validations/DateValidation';

export class IpWiseRequestReportScreen extends Component {
    constructor(props) {
        super(props);

        //Define all initial state
        this.state = {
            row: [],

            fromDate: '',
            toDate: '',

            // for Ip Wise Request Report List
            IpWiseReportListResponse: [],
            IpWiseReportListState: null,

            isDrawerOpen: false,
            isFirstTime: true,
            refreshing: false,

            ipAddress: '',
            searchInput: '',
            selectedPage: 1,

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


    shouldComponentUpdate(nextProps, _nextState) {
        //stop twice api call
        return isCurrentScreen(nextProps)
    }
    async componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme()
        // call api
        this.calIpWiseReport()
    }

    componentWillUnmount() {
        // clear reducer data
        this.props.clearIpWiseReport()
    }

    // for swipe to refresh functionality
    onRefresh = async () => {
        this.setState({ refreshing: true });

        // Check NetWork is Available or not
        if (await isInternet()) {

            // Bind request for Ip Wise Request Report List
            let request = {
                IPAddress: this.state.ipAddress,
                FromDate: this.state.fromDate,
                ToDate: this.state.toDate,
                Pagesize: AppConfig.pageSize,
                PageNo: this.state.selectedPage - 1,
            }
            // Call Ip Wise Request Report API
            this.props.getIpWiseReport(request);

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
            fromDate: '',
            toDate: '',
            searchInput: '',
            selectedPage: 1,
            ipAddress: '',
        })

        // Check NetWork is Available or not
        if (await isInternet()) {

            // Bind request for Ip Wise Request Report List
            let request = {
                FromDate: '',
                ToDate: '',
                Pagesize: AppConfig.pageSize,
                PageNo: 0,
            }
            //Call Ip Wise Request Report API
            this.props.getIpWiseReport(request);

        } else {
            this.setState({ refreshing: false });
        }
    }

    // Call api when user pressed on complete button
    onCompletePress = async () => {
        // Check validation
        if (isEmpty(this.state.fromDate) && this.state.toDate != '') {
            this.toast.Show(R.strings.selectFromDate)
            return
        }
        else if (isEmpty(this.state.toDate) && this.state.fromDate != '') {
            this.toast.Show(R.strings.selectToDate)
            return
        }
        else if (DateValidation(this.state.fromDate, this.state.toDate, true)) {
            this.toast.Show(DateValidation(this.state.fromDate, this.state.toDate, true))
            return
        }
        else if (this.state.ipAddress != '' && validateIPaddress(this.state.ipAddress)) {
            this.toast.Show(R.strings.enterValidIpAddress)
            return
        }
        else {
            this.setState({
                selectedPage: 1,
                searchInput: ''
            })

            // Close Drawer user press on Complete button bcoz display flatlist item on Screen
            this.drawer.closeDrawer();

            // Check NetWork is Available or not
            if (await isInternet()) {

                // Bind request for Ip Wise Request Report List
                let request = {
                    IPAddress: this.state.ipAddress,
                    FromDate: this.state.fromDate,
                    ToDate: this.state.toDate,
                    Pagesize: AppConfig.pageSize,
                    PageNo: 0,
                }
                //Call Ip Wise Request Report API
                this.props.getIpWiseReport(request);

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
                // Bind request for Ip Wise Request Report List
                let request = {
                    IPAddress: this.state.ipAddress,
                    FromDate: this.state.fromDate,
                    ToDate: this.state.toDate,
                    Pagesize: AppConfig.pageSize,
                    PageNo: pageNo - 1,
                }
                //Call Ip Wise Request Report API
                this.props.getIpWiseReport(request);
            } else {
                this.setState({ refreshing: false });
            }
        }
    }

    //api call
    calIpWiseReport = async () => {

        //Check NetWork is Available or not
        if (await isInternet()) {
            this.setState({
                fromDate: '',
                toDate: '',
                searchInput: '',
                selectedPage: 1,
                ipAddress: '',
            })

            let request = {
                FromDate: '',
                ToDate: '',
                PageNo: 0,
                PageSize: AppConfig.pageSize,
            }
            // Call Ip Wise Request Report List Api
            this.props.getIpWiseReport(request)
        }
    }

    static oldProps = {};

    static getDerivedStateFromProps(props, state) {

        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return { ...state, isFirstTime: false, };
        }

        // To Skip Render if old and new props are equal
        if (IpWiseRequestReportScreen.oldProps !== props) {
            IpWiseRequestReportScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //Get All Updated Feild of Particular actions
            const { IpWiseReportList } = props.IpWiseReportResult

            // IpWiseReportList is not null
            if (IpWiseReportList) {
                try {
                    if (state.IpWiseReportListState == null || (IpWiseReportList !== state.IpWiseReportListState)) {
                        //succcess response fill the list 
                        if (validateResponseNew({ response: IpWiseReportList, isList: true, })) {

                            return Object.assign({}, state, {
                                IpWiseReportListState: IpWiseReportList,
                                IpWiseReportListResponse: parseArray(IpWiseReportList.Response),
                                refreshing: false,
                                row: addPages(IpWiseReportList.TotalCount)
                            })
                        } else {
                            //if response is not validate than list is empty
                            return Object.assign({}, state, {
                                IpWiseReportListState: null,
                                IpWiseReportListResponse: [],
                                refreshing: false,
                                row: []
                            })
                        }
                    }
                } catch (e) {
                    return Object.assign({}, state, {
                        IpWiseReportListState: null,
                        IpWiseReportListResponse: [],
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
            // for show filter of fromdate, todate an Ip Adddress
            <FilterWidget
                textInputStyle={{ marginTop: 0, marginBottom: 0, }}
                ToDatePickerCall={(date) => this.setState({ toDate: date })}
                FromDate={this.state.fromDate}
                ToDate={this.state.toDate}
                onResetPress={this.onResetPress}
                onCompletePress={this.onCompletePress}
                toastRef={component => this.toast = component}
                FromDatePickerCall={(date) => this.setState({ fromDate: date })}
                textInputs={[{
                    returnKeyType: "done",
                    maxLength: 15,
                    header: R.strings.IPAddress,
                    placeholder: R.strings.IPAddress,
                    onChangeText: (ipAddress) => { this.setState({ ipAddress: ipAddress }) },
                    keyboardType: 'numeric',
                    value: this.state.ipAddress,
                    multiline: false,
                }
                ]}
            />
        )
    }

    render() {

        // Loading status for Progress bar which is fetching from reducer
        let { IpWiseReportListLoading, } = this.props.IpWiseReportResult

        // For searching functionality
        let finalItems = this.state.IpWiseReportListResponse.filter(item => (
            item.UserName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
            item.EmailID.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
            item.Path.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
            item.IPAddress.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
            item.Host.toLowerCase().includes(this.state.searchInput.toLowerCase())))

        return (
            //DrawerLayout for Ip Wise Request Report Filteration
            <Drawer
                onDrawerClose={() => this.setState({ isDrawerOpen: false })}
                type={Drawer.types.Overlay}
                drawerPosition={Drawer.positions.Right}
                easingFunc={Easing.ease}
                ref={cmpDrawer => this.drawer = cmpDrawer}
                drawerWidth={R.dimens.FilterDrawarWidth}
                drawerContent={this.navigationDrawer()}
                onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
            >

                <SafeView
                    style={{ flex: 1, backgroundColor: R.colors.background }}
                >
                    {/* To set status bar as per our theme */}
                    <CommonStatusBar />

                    {/* To set toolbar as per our theme */}
                    <CustomToolbar
                        nav={this.props.navigation}
                        rightIcon={R.images.FILTER}
                        onRightMenuPress={() => this.drawer.openDrawer()}
                        isBack={true}
                        title={R.strings.ipwiseReqReport}
                        onBackPress={() => this.onBackPress()}
                        onSearchText={(text) => this.setState({ searchInput: text })}
                        searchable={true}
                    />

                    <View style={{ flex: 1, justifyContent: 'space-between' }}>
                        {
                            (IpWiseReportListLoading && !this.state.refreshing) ?
                                <ListLoader />
                                :
                                <FlatList
                                    data={finalItems}
                                    showsVerticalScrollIndicator={false}
                                    // render all item in list
                                    renderItem={({ item, index }) =>
                                        <ApiPlanConfigHistoryItem
                                            size={finalItems.length}
                                            index={index}
                                            item={item} />}
                                    // For Refresh Functionality In Ip Wise Request Report FlatList Item
                                    refreshControl={
                                        <RefreshControl
                                            colors={[R.colors.accent]}
                                            progressBackgroundColor={R.colors.background}
                                            refreshing={this.state.refreshing}
                                            onRefresh={this.onRefresh}
                                        />
                                    }
                                    // assign index as key value to Ip Wise Request Report list item
                                    keyExtractor={(_item, index) => index.toString()}
                                    // Displayed empty component when no record found 
                                    ListEmptyComponent={<ListEmptyComponent />}
                                    contentContainerStyle={contentContainerStyle(finalItems)}
                                />
                        }

                        {/*To Set Pagination View  */}
                        <View>
                            {
                                finalItems.length > 0 && <PaginationWidget
                                    row={this.state.row}
                                    selectedPage={this.state.selectedPage} onPageChange={(item) => { this.onPageChange(item) }} />
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

        let { size, index, item } = this.props

        return (

            // flatlist item animation
            <AnimatableItem>
                <View style={{
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginLeft: R.dimens.widget_left_right_margin, flex: 1, marginRight: R.dimens.widget_left_right_margin
                }}>
                    <CardView style={{
                        borderBottomLeftRadius: R.dimens.margin,
                        flex: 1, borderTopRightRadius: R.dimens.margin,
                        borderRadius: 0, elevation: R.dimens.listCardElevation,

                    }}>

                        {/*For show UserName and IPAddress */}
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TextViewMR style={{
                                flex: 1,
                                fontSize: R.dimens.smallText, color: R.colors.textPrimary
                            }}>
                                {validateValue(item.UserName)}</TextViewMR>
                            <TextViewMR style={{ fontSize: R.dimens.smallText, color: R.colors.yellow }}>
                                {validateValue(item.IPAddress)}</TextViewMR>
                        </View>

                        {/*For show EmailID */}
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <TextViewHML style={{ flex: 1, fontSize: R.dimens.smallText, color: R.colors.textSecondary }}>
                                {validateValue(item.EmailID)}</TextViewHML>
                        </View>

                        {/*For show path */}
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary }}>{R.strings.path + ': '}</TextViewHML>
                            <TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary }}>{validateValue(item.Path)}</TextViewHML>
                        </View>

                        {/*For show host */}
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary }}>{R.strings.host + ': '}</TextViewHML>
                            <TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary }}>{validateValue(item.Host)}</TextViewHML>
                        </View>

                        {/* for show CreatedDate */}
                        <View style={{
                            flexDirection: 'row',
                            marginTop: R.dimens.widgetMargin, alignItems: 'center', justifyContent: 'flex-end'
                        }}>
                            <View style={{ flexDirection: 'row' }}>
                                <ImageTextButton
                                    style={{
                                        margin: 0,
                                        paddingRight: R.dimens.LineHeight,
                                    }}
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
        // get Ip Wise Request Report data from reducer
        IpWiseReportResult: state.IpWiseRequestReportReducer,
    }
}

const mapDispatchToProps = (dispatch) => ({
    // Ip Wise Request Report Action
    getIpWiseReport: (payload) => dispatch(getIpWiseReport(payload)),

    // Clear Ip Wise Request Report Data Action
    clearIpWiseReport: () => dispatch(clearIpWiseReport()),
})

export default connect(mapStateToProps, mapDispatchToProps)(IpWiseRequestReportScreen)