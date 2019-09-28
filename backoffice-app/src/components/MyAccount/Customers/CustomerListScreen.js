import React, { Component } from 'react';
import { View, Text, FlatList, RefreshControl, Easing, Image } from 'react-native';
import { connect } from 'react-redux';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { changeTheme, addPages, getCurrentDate, convertDateTime } from '../../../controllers/CommonUtils';
import { isCurrentScreen, addRouteToBackPress } from '../../Navigation';
import { isInternet, validateResponseNew, isEmpty, validateValue } from '../../../validations/CommonValidation';
import ListLoader from '../../../native_theme/components/ListLoader';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import R from '../../../native_theme/R';
import Drawer from 'react-native-drawer-menu';
import PaginationWidget from '../../widget/PaginationWidget';
import { getUserSignupRptData, clearUserSignUpReport } from '../../../actions/account/UsersSignupReportAction';
import { AppConfig } from '../../../controllers/AppConfig';
import StatusChip from '../../widget/StatusChip';
import CardView from '../../../native_theme/components/CardView';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import { Fonts } from '../../../controllers/Constants';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import FilterWidget from '../../widget/FilterWidget';
import { DateValidation } from '../../../validations/DateValidation';
import { CheckEmailValidation } from '../../../validations/EmailValidation';
import SafeView from '../../../native_theme/components/SafeView';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';

class CustomerListScreen extends Component {
    constructor(props) {
        super(props);

        //Define initial state
        this.state = {
            searchInput: '',
            selectedPage: 1,
            PageSize: AppConfig.pageSize,
            refreshing: false,
            row: [],
            response: [],
            email: '',
            userName: '',
            mobileNumber: '',
            status: [
                { value: R.strings.select_status },
                { ID: 1, value: R.strings.today },
                { ID: 2, value: R.strings.weekly },
            ],
            statusId: 0,
            selectedStatus: R.strings.select_status,
            FromDate: getCurrentDate(),
            ToDate: getCurrentDate(),
            isFirstTime: true,
            isDrawerOpen: false, // First Time Drawer is Closed
            isFilter: false
        };

        this.inputs = {};

        // create reference
        this.drawer = React.createRef()

        //Bind all Methods
        this.onBackPress = this.onBackPress.bind(this);

        //add current route for backpress handle
        addRouteToBackPress(props, this.onBackPress);
        this.props.navigation.setParams({ onBackPress: this.onBackPress });
    }

    async componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check intenet connectivity
        if (await isInternet()) {

            //Bind request Customer list api
            let customerList = {
                PageIndex: 1,
                Page_Size: this.state.PageSize,
                Filtration: '',
                FromDate: getCurrentDate(),
                ToDate: getCurrentDate(),
            }

            //Call Customer List api  
            this.props.getCustomerList(customerList)
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

    componentWillUnmount() {
        //Clear data on Backpress
        this.props.clearCustomerList();
    }

    shouldComponentUpdate(nextProps, nextState) {
        //stop twice api call
        return isCurrentScreen(nextProps);
    }

    //this Method is used to focus on next feild
    focusNextField = (id) => {
        this.inputs[id].focus();
    }

    // Set state to original value
    onResetPress = async () => {
        this.setState({
            selectedStatus: R.strings.select_status, searchInput: '', email: '',
            userName: '',
            mobileNumber: '',
            selectedPage: 1, FromDate: getCurrentDate(), ToDate: getCurrentDate(),
        })

        // Close Drawer
        this.drawer.closeDrawer();

        //Check intenet connectivity
        if (await isInternet()) {

            //Bind request Customer list api
            let customerList = {
                PageIndex: 1,
                Page_Size: this.state.PageSize,
                Filtration: '',
                FromDate: getCurrentDate(),
                ToDate: getCurrentDate(),
                EmailAddress: '',
                Username: '',
                Mobile: '',
            }

            //Call Customer List api  
            this.props.getCustomerList(customerList)
        }
    }

    /* if press on complete button then check validation and api calling */
    onCompletePress = async () => {

        // Check validation
        if (DateValidation(this.state.FromDate, this.state.ToDate, true))
            this.toast.Show(DateValidation(this.state.FromDate, this.state.ToDate, true))
        else if (CheckEmailValidation(this.state.email)) {
            this.toast.Show(R.strings.Enter_Valid_Email);
        }
        else {

            this.setState({ searchInput: '', selectedPage: 1, })

            // Close Drawer user press on Complete button bcoz display flatlist item on Screen
            this.drawer.closeDrawer();

            //Check intenet connectivity
            if (await isInternet()) {

                //Bind request Customer list api
                let customerList = {
                    PageIndex: 1,
                    Page_Size: this.state.PageSize,
                    EmailAddress: this.state.email,
                    Username: this.state.userName,
                    Mobile: this.state.mobileNumber,
                    Filtration: this.state.selectedStatus === R.strings.select_status ? '' : this.state.statusId,
                    FromDate: this.state.FromDate,
                    ToDate: this.state.ToDate,
                }

                //Call Customer List api
                this.props.getCustomerList(customerList)
            }

        }
    }

    // Drawer Navigation
    navigationDrawer() {

        return (
            // for show filter of fromdate, todate,currency and status data
            <FilterWidget
                onResetPress={this.onResetPress}
                onCompletePress={this.onCompletePress}
                toastRef={component => this.toast = component}
                FromDatePickerCall={(date) => this.setState({ FromDate: date })}
                ToDatePickerCall={(date) => this.setState({ ToDate: date })}
                FromDate={this.state.FromDate}
                ToDate={this.state.ToDate}
                textInputStyle={{ marginTop: 0, marginBottom: 0, }}
                textInputs={[
                    {
                        header: R.strings.EmailAddrees,
                        placeholder: R.strings.EmailAddrees,
                        multiline: false,
                        keyboardType: 'default',
                        returnKeyType: "next",
                        blurOnSubmit: false,
                        onChangeText: (text) => { this.setState({ email: text }) },
                        value: this.state.email,
                        reference: input => { this.inputs['EmailAddrees'] = input; },
                        onSubmitEditing: () => { this.focusNextField('userName') }
                    },
                    {
                        onChangeText: (text) => { this.setState({ userName: text }) },
                        placeholder: R.strings.userName,
                        multiline: false,
                        keyboardType: 'default',
                        header: R.strings.userName,
                        blurOnSubmit: false,
                        onSubmitEditing: () => { this.focusNextField('Mobile') },
                        value: this.state.userName,
                        reference: input => { this.inputs['userName'] = input; },
                        returnKeyType: "next",
                    },
                    {
                        onChangeText: (text) => { this.setState({ mobileNumber: text }) },
                        value: this.state.mobileNumber,
                        multiline: false,
                        keyboardType: 'numeric',
                        placeholder: R.strings.MobileNo,
                        returnKeyType: "done",
                        reference: input => { this.inputs['Mobile'] = input; },
                        validate: true,
                        maxLength: 10,
                        onlyDigit: true,
                        header: R.strings.MobileNo,
                    },
                ]}
                comboPickerStyle={{ marginTop: 0, }}
                pickers={[
                    {
                        title: R.strings.status,
                        selectedValue: this.state.selectedStatus,
                        array: this.state.status,
                        onPickerSelect: (item, object) => this.setState({ selectedStatus: item, statusId: object.ID })
                    },
                ]}
            />
        )
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
        if (CustomerListScreen.oldProps !== props) {
            CustomerListScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //Get All Updated Feild of Particular actions
            const { UserRptData } = props.Listdata;
            if (UserRptData) {
                try {
                    if (state.UserRptData == null || (state.UserRptData != null && UserRptData !== state.UserRptData)) {
                        //succcess response fill the list 
                        if (validateResponseNew({
                            response: UserRptData,
                            isList: true,
                        })) {
                            var res = UserRptData.SignReportViewmodes.SignReportList;
                            return {
                                ...state,
                                response: res, refreshing: false, totalCount: UserRptData.SignReportViewmodes.Total, UserRptData, row: addPages(UserRptData.SignReportViewmodes.Total)
                            }

                        } else {
                            //if response is not validate than list is empty
                            return {
                                ...state,
                                response: [], refreshing: false, UserRptData, row: []
                            }
                        }
                    }
                } catch (e) {
                    return {
                        ...state,
                        response: [], refreshing: false, row: []
                    }
                }
            }
        }
        return null;
    }

    // Pagination Method Called When User Change Page  
    onPageChange = async (pageNo) => {

        //if selected page is same than no need to call api from pagination
        if (pageNo != this.state.selectedPage) {

            //Check intenet connectivity
            if (await isInternet()) {
                this.setState({ selectedPage: pageNo });

                //Bind request Customer list api
                let customerList = {
                    PageIndex: pageNo,
                    Page_Size: this.state.PageSize,
                    FromDate: this.state.FromDate,
                    ToDate: this.state.ToDate,
                    EmailAddress: this.state.email,
                    Username: this.state.userName,
                    Mobile: this.state.mobileNumber,
                    Filtration: this.state.selectedStatus === R.strings.select_status ? '' : this.state.statusId,
                }

                //Call Customer List api
                this.props.getCustomerList(customerList)
            }
        }
    }

    onViewPress = (item) => {

        //redirect screen detail screen
        this.props.navigation.navigate('CustomerListDetailScreen', { item })
    }

    //For Swipe to referesh Functionality
    onRefresh = async () => {
        this.setState({ refreshing: true });

        //Check intenet connectivity
        if (await isInternet()) {

            //Bind request Customer list api
            let customerList = {
                PageIndex: this.state.selectedPage,
                Page_Size: this.state.PageSize,
                FromDate: this.state.FromDate,
                ToDate: this.state.ToDate,
                EmailAddress: this.state.email,
                Username: this.state.userName,
                Mobile: this.state.mobileNumber,
                Filtration: this.state.selectedStatus === R.strings.select_status ? '' : this.state.statusId,
            }

            //Call Customer List api
            this.props.getCustomerList(customerList)
        }
        else { this.setState({ refreshing: false }) }
    }

    render() {

        //Get is Fetching value For All APIs to handle Progress bar in All Activity
        const { loading } = this.props.Listdata;

        //Display based on filter if aplied filter or display all records
        let finalItems = this.state.response;
        if (finalItems.length > 0) {
            finalItems = this.state.response.filter(item =>
                !isEmpty(item.UserName) && item.UserName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
                !isEmpty(item.Email) && item.Email.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
                !isEmpty(item.Mobile) && item.Mobile.toLowerCase().includes(this.state.searchInput.toLowerCase())
            )
        }

        return (
            /* DrawerLayout for customer list  Filteration */
            <Drawer
                ref={cmpDrawer => this.drawer = cmpDrawer}
                drawerWidth={R.dimens.FilterDrawarWidth}
                drawerContent={this.navigationDrawer()}
                type={Drawer.types.Overlay}
                drawerPosition={Drawer.positions.Right}
                onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
                onDrawerClose={() => this.setState({ isDrawerOpen: false })}
                easingFunc={Easing.ease}>
                <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                    {/* To Set Status Bas as per out theme */}
                    <CommonStatusBar />

                    {/* To Set ToolBar as per out theme */}
                    <CustomToolbar
                        nav={this.props.navigation}
                        title={R.strings.listCustomers}
                        isBack={true}
                        onRightMenuPress={() => this.drawer.openDrawer()}
                        rightIcon={R.images.FILTER}
                        searchable={true}
                        onSearchText={(text) => this.setState({ searchInput: text })}
                    />

                    <View
                        style={{
                            justifyContent: 'space-between',
                            flex: 1,
                        }}>

                        {/* To show progressbar on api call */}
                        {loading
                            && !this.state.refreshing ?
                            <ListLoader />
                            :

                            <View style={{ flex: 1 }}>

                                {finalItems.length ?
                                    <View
                                        style={{ flex: 1 }}>

                                        <FlatList
                                            showsVerticalScrollIndicator={false}
                                            data={finalItems}
                                            /* render all item in list */
                                            renderItem={({ item, index }) =>
                                                <CustomerListItem
                                                    onPress={() => this.onViewPress(item)}
                                                    item={item}
                                                    index={index}
                                                    size={this.state.response.length}
                                                />}
                                            /* assign index as key value list item */
                                            keyExtractor={(item, index) => index.toString()}
                                            /* For Refresh Functionality FlatList Item */
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
                                    // Displayed empty component when no record found 
                                    : <ListEmptyComponent />
                                }
                            </View>
                        }

                        {/*To Set Pagination View  */}
                        <View>
                            {finalItems.length > 0 &&
                                <PaginationWidget row={this.state.row} selectedPage={this.state.selectedPage} onPageChange={(item) => { this.onPageChange(item) }} />
                            }
                        </View>
                    </View>
                </SafeView>
            </Drawer >
        );
    }
}

// This Class is used for display record in list
class CustomerListItem extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        //if records are same then no need to update component
        if (this.props.item === nextProps.item) {
            return false
        }
        return true
    }

    render() {
        let { index, size, item } = this.props;

        return (


            // Flatlist item animation
            <AnimatableItem>
                <View style={{
                    flex: 1,
                    marginLeft: R.dimens.widget_left_right_margin,
                    marginRight: R.dimens.widget_left_right_margin,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                }}>

                    <CardView style={{
                        elevation: R.dimens.listCardElevation,
                        flex: 1,
                        borderTopRightRadius: R.dimens.margin,
                        borderRadius: 0,
                        borderBottomLeftRadius: R.dimens.margin,
                        margin: 0
                    }} onPress={this.props.onPress}>

                        {/* for show user icon detail icon,Email,Mobile */}
                        <View
                            style={{ flexDirection: 'row', }}>
                            <ImageTextButton
                                iconStyle={{ width: R.dimens.drawerMenuIconWidthHeight, height: R.dimens.drawerMenuIconWidthHeight, tintColor: R.colors.white }}
                                style={{ justifyContent: 'center', width: R.dimens.ButtonHeight, height: R.dimens.ButtonHeight, margin: 0, backgroundColor: R.colors.accent, borderRadius: R.dimens.ButtonHeight }}
                                icon={R.images.IC_OUTLINE_USER}
                            />
                            <View style={{
                                flex: 1,
                                paddingLeft: R.dimens.margin,
                            }}>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'flex-start', alignContent: 'flex-start',
                                    justifyContent: 'space-between',
                                }}>
                                    <Text
                                        style={{ flex: 1, color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, paddingRight: R.dimens.widgetMargin }}>{item.UserName ? item.UserName : ' - '}</Text>
                                    <Image
                                        source={R.images.RIGHT_ARROW_DOUBLE}
                                        style={{
                                            height: R.dimens.dashboardMenuIcon,
                                            tintColor: R.colors.textPrimary,
                                            width: R.dimens.dashboardMenuIcon,
                                        }} />
                                </View>

                                <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{validateValue(item.Email)}</TextViewHML>
                                <TextViewHML style={{ color: R.colors.yellow, fontSize: R.dimens.smallestText }}>{validateValue(item.Mobile)}</TextViewHML>
                            </View>
                        </View>

                        {/* for show date and status */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: R.dimens.widgetMargin, justifyContent: 'space-between' }}>

                            <StatusChip
                                color={item.Status == 1 ? R.colors.successGreen : R.colors.failRed}
                                value={item.Status == 1 ? R.strings.active : R.strings.inActive}></StatusChip>

                            <View style={{ flexDirection: 'row' }}>
                                <ImageTextButton
                                    style={{ margin: 0, paddingRight: R.dimens.widgetMargin, }}
                                    icon={R.images.IC_TIMER}
                                    iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
                                />
                                <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{convertDateTime(item.CreatedDate, 'YYYY-MM-DD HH:mm:ss', false)}</TextViewHML>
                            </View>
                        </View>
                    </CardView>
                </View>
            </AnimatableItem>
        )
    };
}

function mapStatToProps(state) {
    //Updated data for Customer List action
    return { Listdata: state.UsersSignupReportReducer }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform Customer List action
        getCustomerList: (request) => dispatch(getUserSignupRptData(request)),
        //Perfrom Clear Data Customer List action
        clearCustomerList: () => dispatch(clearUserSignUpReport()),
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(CustomerListScreen);

