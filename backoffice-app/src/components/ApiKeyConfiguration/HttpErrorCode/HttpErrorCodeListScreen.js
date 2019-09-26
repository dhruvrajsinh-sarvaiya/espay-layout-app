// HttpErrorCodeListScreen.js
import React, { Component } from 'react'
import { View, FlatList, RefreshControl, Easing } from 'react-native'
import { changeTheme, parseArray, addPages, convertDate, convertTime, getCurrentDate, parseIntVal, } from '../../../controllers/CommonUtils';
import { isCurrentScreen, addRouteToBackPress } from '../../Navigation';
import SafeView from '../../../native_theme/components/SafeView';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import R from '../../../native_theme/R';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import CardView from '../../../native_theme/components/CardView';
import PaginationWidget from '../../widget/PaginationWidget';
import { connect } from 'react-redux';
import ListLoader from '../../../native_theme/components/ListLoader';
import { isInternet, validateResponseNew, validateValue, isEmpty, } from '../../../validations/CommonValidation';
import Drawer from 'react-native-drawer-menu';
import { AppConfig } from '../../../controllers/AppConfig';
import FilterWidget from '../../widget/FilterWidget';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import { getHttpErrorCodeList, clearHttpErrorCodeList } from '../../../actions/ApiKeyConfiguration/HttpErrorCodeAction';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import { DateValidation } from '../../../validations/DateValidation';
import StatusChip from '../../widget/StatusChip';

export class HttpErrorCodeListScreen extends Component {

    constructor(props) {
        super(props);

        //Define all initial state
        this.state = {
            row: [],

            fromDate: getCurrentDate(),
            toDate: getCurrentDate(),

            // for Http Error Code List
            HttpErrorCodeListResponse: [],
            HttpErrorCodeListState: null,

            searchInput: '',
            errorCode: '',
            selectedPage: 1,

            isFirstTime: true,
            isDrawerOpen: false,
            refreshing: false,
        }

        // Create Reference
        this.drawer = React.createRef()

        //add current route for backpress handle
        addRouteToBackPress(props, this.onBackPress);
        this.props.navigation.setParams(
            { onBackPress: this.onBackPress }
            );
    }

    // If drawer is open then first, it will close the drawer and after it will return to previous screen
    onBackPress = () => 
    {
        if (this.state.isDrawerOpen) 
        {
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
        // call api
        this.calIpWiseReport()
    }

    shouldComponentUpdate(nextProps, _nextState) {
        //stop twice api call
        return isCurrentScreen(nextProps)
    }

    componentWillUnmount() {
        // clear reducer data
        this.props.clearHttpErrorCodeList()
    }

    // for swipe to refresh functionality
    onRefresh = async () => {
        this.setState({ refreshing: true });

        // Check NetWork is Available or not
        if (await isInternet()) {

            // Bind request for Http Error Code List
            let request = {
                ErrorCode: isEmpty(this.state.errorCode) ? '' : parseIntVal(this.state.errorCode),
                FromDate: this.state.fromDate,
                ToDate: this.state.toDate,
                Pagesize: AppConfig.pageSize,
                PageNo: this.state.selectedPage - 1,
            }
            // Call Http Error Code API
            this.props.getHttpErrorCodeList(request);

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
            fromDate: getCurrentDate(),
            toDate: getCurrentDate(),
            searchInput: '',
            selectedPage: 1,
            errorCode: '',
        })

        // Check NetWork is Available or not
        if (await isInternet()) {

            // Bind request for Http Error Code List
            let request = {
                FromDate: getCurrentDate(),
                ToDate: getCurrentDate(),
                Pagesize: AppConfig.pageSize,
                PageNo: 0,
            }
            //Call Http Error Code API
            this.props.getHttpErrorCodeList(request);

        } else {
            this.setState({ refreshing: false });
        }
    }

    // Call api when user pressed on complete button
    onCompletePress = async () => {
        // Check validation

        if (DateValidation(this.state.fromDate, this.state.toDate, true)) {
            this.toast.Show(DateValidation(this.state.fromDate, this.state.toDate, true))
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

                // Bind request for Http Error Code List
                let request = {
                    ErrorCode: isEmpty(this.state.errorCode) ? '' : parseIntVal(this.state.errorCode),
                    FromDate: this.state.fromDate,
                    ToDate: this.state.toDate,
                    Pagesize: AppConfig.pageSize,
                    PageNo: 0,
                }
                //Call Http Error Code API
                this.props.getHttpErrorCodeList(request);

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
                // Bind request for Http Error Code List
                let request = {
                    ErrorCode: isEmpty(this.state.errorCode) ? '' : parseIntVal(this.state.errorCode),
                    FromDate: this.state.fromDate,
                    ToDate: this.state.toDate,
                    Pagesize: AppConfig.pageSize,
                    PageNo: pageNo - 1,
                }
                //Call Http Error Code API
                this.props.getHttpErrorCodeList(request);
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
                fromDate: getCurrentDate(),
                toDate: getCurrentDate(),
                searchInput: '',
                selectedPage: 1,
                errorCode: '',
            })
            // Bind request for Http Error Code List
            let request = {
                FromDate: getCurrentDate(),
                ToDate: getCurrentDate(),
                PageNo: 0,
                PageSize: AppConfig.pageSize,
            }
            // Call Http Error Code List Api
            this.props.getHttpErrorCodeList(request)
        }
    }

    static oldProps = {};

    static getDerivedStateFromProps(props, state) {

        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return { ...state, isFirstTime: false, };
        }

        // To Skip Render if old and new props are equal
        if (HttpErrorCodeListScreen.oldProps !== props) {
            HttpErrorCodeListScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //Get All Updated Feild of Particular actions
            const { HttpErrorCodeList } = props.HttpErrorCodeResult

            // HttpErrorCodeList is not null
            if (HttpErrorCodeList) {
                try {
                    if (state.HttpErrorCodeListState == null || (state.HttpErrorCodeListState !== null && HttpErrorCodeList !== state.HttpErrorCodeListState)) {
                        //succcess response fill the list 
                        if (validateResponseNew({ response: HttpErrorCodeList, isList: true, })) {

                            return Object.assign({}, state, {
                                HttpErrorCodeListState: HttpErrorCodeList,
                                HttpErrorCodeListResponse: parseArray(HttpErrorCodeList.Response),
                                refreshing: false,
                                row: addPages(HttpErrorCodeList.TotalCount)
                            })
                        } else {
                            //if response is not validate than list is empty
                            return Object.assign({}, state, {
                                HttpErrorCodeListState: null,
                                HttpErrorCodeListResponse: [],
                                refreshing: false,
                                row: []
                            })
                        }
                    }
                } catch (e) {
                    return Object.assign({}, state, {
                        refreshing: false,
                        row: [],
                        HttpErrorCodeListState: null,
                        HttpErrorCodeListResponse: [],
                    })
                }
            }
        }
        return null
    }

    // Drawer Navigation
    navigationDrawer() {

        return (
            // for show filter of fromdate, todate and Error Code
            <FilterWidget
                onResetPress={this.onResetPress}
                FromDatePickerCall={(date) => this.setState({ fromDate: date })}  ToDatePickerCall={(date) => this.setState({ toDate: date })}
                FromDate={this.state.fromDate}
                ToDate={this.state.toDate}
                onCompletePress={this.onCompletePress} toastRef={component => this.toast = component}
                textInputStyle={{ marginTop: 0, marginBottom: 0, }}
                textInputs={[
                    {
                        header: R.strings.errorCode,
                        placeholder: R.strings.errorCode,
                        multiline: false,
                        keyboardType: 'numeric',
                        returnKeyType: "done",
                        maxLength: 4,
                        onChangeText: (errorCode) => { this.setState({ errorCode: errorCode }) },
                        value: this.state.errorCode,
                    }
                ]}
            />
        )
    }

    render() {
        
        // Loading status for Progress bar which is fetching from reducer
        let { HttpErrorCodeListLoading, } = this.props.HttpErrorCodeResult

        // For searching
        let finalItems = this.state.HttpErrorCodeListResponse.filter(item => (
            item.Path.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
            item.MethodType.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
            item.HTTPErrorCode.toString().includes(this.state.searchInput)
        ))

        return (
            //DrawerLayout for Http Error Code Filteration
            <Drawer
            type={Drawer.types.Overlay}   drawerPosition={Drawer.positions.Right}
                ref={cmpDrawer => this.drawer = cmpDrawer}
                drawerWidth={R.dimens.FilterDrawarWidth}
                drawerContent={this.navigationDrawer()} onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
                onDrawerClose={() => this.setState({ isDrawerOpen: false })}
                easingFunc={Easing.ease}>

                <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                    {/* To set status bar as per our theme */}
                    <CommonStatusBar />

                    {/* To set toolbar as per our theme */}
                    <CustomToolbar
                        isBack={true}
                        title={R.strings.httpStatusCode}
                        onBackPress={() => this.onBackPress()}
                        nav={this.props.navigation}
                        rightIcon={R.images.FILTER}
                        onRightMenuPress={() => this.drawer.openDrawer()}
                        searchable={true}
                        onSearchText={(text) => this.setState({ searchInput: text })} />

                    <View style={{ flex: 1, justifyContent: 'space-between' }}>
                        {
                            (HttpErrorCodeListLoading && !this.state.refreshing) ?
                                <ListLoader />
                                :
                                finalItems.length > 0 ?
                                    <FlatList
                                        data={finalItems}
                                        showsVerticalScrollIndicator={false}
                                        // render all item in list
                                        renderItem={({ item, index }) =>
                                            <HttpErrorCodeItem
                                                index={index}
                                                item={item}
                                                size={finalItems.length}
                                            />
                                        }
                                        // assign index as key value to Http Error Code list item
                                        keyExtractor={(_item, index) => index.toString()}
                                        // For Refresh Functionality In Http Error Code FlatList Item
                                        refreshControl={
                                            <RefreshControl
                                                colors={[R.colors.accent]}
                                                progressBackgroundColor={R.colors.background}
                                                refreshing={this.state.refreshing}
                                                onRefresh={this.onRefresh}
                                            />
                                        }
                                    /> :
                                    // Displayed empty component when no record found 
                                    <ListEmptyComponent />
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
class HttpErrorCodeItem extends Component {

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
        let statusColor = R.colors.failRed

        //Set status color based on HTTPErrorCode
        if (item.HTTPErrorCode == 200) statusColor = R.colors.successGreen
        else if (item.HTTPErrorCode == 400) statusColor = R.colors.yellow
        else statusColor = R.colors.failRed

        return (
            // flatlist item animation
            <AnimatableItem>
                <View style={{
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    flex: 1,
                    marginLeft: R.dimens.widget_left_right_margin,  marginRight: R.dimens.widget_left_right_margin,
                }}>
                    <CardView 
                    style={{
                        borderBottomLeftRadius: R.dimens.margin,
                        borderRadius: 0,
                        elevation: R.dimens.listCardElevation,
                        flex: 1,
                        borderTopRightRadius: R.dimens.margin,
                    }}>

                        {/* for show MethodType and Path */}
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TextViewMR style={{ flex: 1, fontSize: R.dimens.smallText, color: R.colors.textPrimary }}>
                                {validateValue(item.MethodType)}</TextViewMR>
                        </View>

                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <TextViewHML style={{ flex: 1, fontSize: R.dimens.smallText, color: R.colors.textSecondary }}>
                                {validateValue(item.Path)}</TextViewHML>
                        </View>

                        {/* for show status and recon icon */}
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: R.dimens.widgetMargin }}>
                            <StatusChip
                                color={statusColor}
                                value={item.HTTPErrorCode + ''} />

                            <View style={{ flexDirection: 'row', }}>
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
        // get Http Error Code data from reducer
        HttpErrorCodeResult: state.HttpErrorCodeReducer,
    }
}

const mapDispatchToProps = (dispatch) => ({
    // Http Error Code Action
    getHttpErrorCodeList: (payload) => dispatch(getHttpErrorCodeList(payload)),

    // Clear Http Error Code Data Action
    clearHttpErrorCodeList: () => dispatch(clearHttpErrorCodeList()),
})

export default connect(mapStateToProps, mapDispatchToProps)(HttpErrorCodeListScreen)