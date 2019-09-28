import React, { Component } from 'react';
import { View, Text, FlatList, RefreshControl, Easing, Image } from 'react-native';
import { connect } from 'react-redux';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { changeTheme, convertDate, addPages, convertTime, getCurrentDate } from '../../../controllers/CommonUtils';
import { isCurrentScreen, addRouteToBackPress } from '../../Navigation';
import { isInternet, validateResponseNew, isEmpty, validateValue } from '../../../validations/CommonValidation';
import ListLoader from '../../../native_theme/components/ListLoader';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import R from '../../../native_theme/R';
import Drawer from 'react-native-drawer-menu';
import PaginationWidget from '../../widget/PaginationWidget';
import { getUserSignupRptData, clearUserSignUpReport } from '../../../actions/account/UsersSignupReportAction';
import { DateValidation } from '../../../validations/DateValidation';
import { AppConfig } from '../../../controllers/AppConfig';
import { CheckEmailValidation } from '../../../validations/EmailValidation';
import StatusChip from '../../widget/StatusChip';
import CardView from '../../../native_theme/components/CardView';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import { Fonts } from '../../../controllers/Constants';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import FilterWidget from '../../widget/FilterWidget';
import SafeView from '../../../native_theme/components/SafeView';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';

class UserSignUpReportList extends Component {
    constructor(props) {
        super(props);

        //Add Current Screen to Manual Handling BackPress Events
        addRouteToBackPress(props);

        //item status previus page eg.daily ,weekly 
        let itemStatus = props.navigation.state.params && props.navigation.state.params.itemStatus
        let statusId = props.navigation.state.params && props.navigation.state.params.statusId
        this.inputs = {};
        this.state = {
            searchInput: '',
            Page: 1,
            PageSize: AppConfig.pageSize,
            totalCount: 0,
            refreshing: false,
            row: [],
            response: [],

            status: [
                { value: R.strings.select_status },
                { ID: 1, value: R.strings.today },
                { ID: 2, value: R.strings.weekly },
                { ID: 3, value: R.strings.monthly },
            ],
            selectedStatus: itemStatus,
            statusId: statusId,

            email: '',
            userName: '',
            mobileNumber: '',
            FromDate: getCurrentDate(),
            ToDate: getCurrentDate(),
            isFirstTime: true,
            isDrawerOpen: false, // First Time Drawer is Closed
        };

        // create reference
        this.drawer = React.createRef();
        this.onBackPress = this.onBackPress.bind(this);
        this.props.navigation.setParams({ onBackPress: this.onBackPress });
    }

    async componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        // Check NetWork is Available or not
        if (await isInternet()) {
            //Bind request user sign up report
            let userSignUpList = {
                PageIndex: 1,
                Page_Size: this.state.PageSize,
                Filtration: this.state.selectedStatus === R.strings.select_status ? '' : this.state.statusId,
                FromDate: getCurrentDate(),
                ToDate: getCurrentDate(),
            }

            //call getUserSignupRptData api
            this.props.getUserSignupRptData(userSignUpList)
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
        //for Data clear on Backpress
        this.props.clearUserSignUpReport();
    }

    shouldComponentUpdate(nextProps, nextState) {
        //For stop twice api call
        return isCurrentScreen(nextProps);
    }

    /* Set state to original value */
    onResetPress = async () => {
        this.setState({
            selectedStatus: R.strings.select_status, email: '', userName: '', mobileNumber: '', searchInput: '',
            Page: 1, totalCount: 0, FromDate: getCurrentDate(), ToDate: getCurrentDate(),
        })

        // Close Drawer
        this.drawer.closeDrawer();

        // Check NetWork is Available or not
        if (await isInternet()) {
            //Bind request user sign up report
            let userSignUpList = {
                PageIndex: 1,
                Page_Size: this.state.PageSize,
                EmailAddress: '',
                Username: '',
                Mobile: '',
                Filtration: '',
                FromDate: getCurrentDate(),
                ToDate: getCurrentDate(),
            }
            //call getUserSignupRptData api
            this.props.getUserSignupRptData(userSignUpList)
        }
    }

    // if press on complete button then check validation and api calling
    onCompletePress = async () => {

        //validations for inputs drawer
        if (DateValidation(this.state.FromDate, this.state.ToDate, true)) {
            this.toast.Show(DateValidation(this.state.FromDate, this.state.ToDate));
            return;
        }
        if (CheckEmailValidation(this.state.email)) {
            this.toast.Show(R.strings.Enter_Valid_Email);
            return;
        }

        // Close Drawer
        this.drawer.closeDrawer();

        this.setState({ Page: 1 })

        // Check NetWork is Available or not
        if (await isInternet()) {
            //Bind request user sign up report
            let userSignUpList = {
                PageIndex: 1,
                Page_Size: this.state.PageSize,
                EmailAddress: this.state.email,
                Username: this.state.userName,
                Mobile: this.state.mobileNumber,
                Filtration: this.state.selectedStatus === R.strings.select_status ? '' : this.state.statusId,
                FromDate: this.state.FromDate,
                ToDate: this.state.ToDate,
            }
            //call getUserSignupRptData api
            this.props.getUserSignupRptData(userSignUpList)
        }
        this.setState({ searchInput: '' })
    }

    navigationDrawer() {
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
                        header: R.strings.EmailAddrees,
                        placeholder: R.strings.EmailAddrees,
                        multiline: false,
                        keyboardType: 'default',
                        returnKeyType: "next",
                        blurOnSubmit: false,
                        value: this.state.email,
                        onChangeText: (text) => { this.setState({ email: text }) },
                        reference: input => { this.inputs['EmailAddrees'] = input; },
                        onSubmitEditing: () => { this.focusNextField('userName') }
                    },
                    {
                        header: R.strings.userName,
                        placeholder: R.strings.userName,
                        multiline: false,
                        blurOnSubmit: false,
                        keyboardType: 'default',
                        returnKeyType: "next",
                        onChangeText: (text) => { this.setState({ userName: text }) },
                        value: this.state.userName,
                        reference: input => { this.inputs['userName'] = input; },
                        onSubmitEditing: () => { this.focusNextField('Mobile') }
                    },
                    {
                        header: R.strings.MobileNo,
                        placeholder: R.strings.MobileNo,
                        multiline: false,
                        keyboardType: 'numeric',
                        returnKeyType: "done",
                        onChangeText: (text) => { this.setState({ mobileNumber: text }) },
                        value: this.state.mobileNumber,
                        reference: input => { this.inputs['Mobile'] = input; },
                        onlyDigit: true,
                        validate: true,
                        maxLength: 10
                    },
                ]}
                comboPickerStyle={{ marginTop: 0, }}
                pickers={[
                    {
                        title: R.strings.status,
                        selectedValue: this.state.selectedStatus,
                        array: this.state.status,
                        onPickerSelect: (item, object) => this.setState({ selectedStatus: item, statusId: object.Id })
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
        if (UserSignUpReportList.oldProps !== props) {
            UserSignUpReportList.oldProps = props;
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
                        if (validateResponseNew({ response: UserRptData, isList: true, })) {
                            var res = UserRptData.SignReportViewmodes.SignReportList;
                            return {
                                ...state,
                                response: res,
                                refreshing: false,
                                totalCount: UserRptData.SignReportViewmodes.Total,
                                UserRptData,
                                row: addPages(UserRptData.SignReportViewmodes.Total)
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
        this.setState({ Page: pageNo, });

        // Check NetWork is Available or not
        if (await isInternet()) {
            //Bind request user sign up report
            let userSignUpList = {
                PageIndex: pageNo,
                Page_Size: this.state.PageSize,
                EmailAddress: this.state.email,
                Username: this.state.userName,
                Mobile: this.state.mobileNumber,
                Filtration: this.state.selectedStatus === R.strings.select_status ? '' : this.state.statusId,
                FromDate: this.state.FromDate,
                ToDate: this.state.ToDate,
            }
            //call getUserSignupRptData api
            this.props.getUserSignupRptData(userSignUpList)
        }
    }

    onViewPress = (item) => {
        //redirect to detail screen
        this.props.navigation.navigate('UserSignUpReportDetail', { item })
    }

    //For Swipe to referesh Functionality
    onRefresh = async () => {

        this.setState({ refreshing: true });

        // Check NetWork is Available or not
        if (await isInternet()) {
            //Bind request user sign up report
            let userSignUpList = {
                PageIndex: this.state.Page,
                Page_Size: this.state.PageSize,
                EmailAddress: this.state.email,
                Username: this.state.userName,
                Mobile: this.state.mobileNumber,
                Filtration: this.state.selectedStatus === R.strings.select_status ? '' : this.state.statusId,
                FromDate: this.state.FromDate,
                ToDate: this.state.ToDate,
            }
            //call getUserSignupRptData api
            this.props.getUserSignupRptData(userSignUpList)
        }
        else this.setState({ refreshing: false })
    }

    render() {

        //Get is Fetching value For All APIs to handle Progress bar in All Activity
        const { loading } = this.props.Listdata;

        //Display based on filter if aplied filter or display all records
        let finalItems = this.state.response;
        if (finalItems.length > 0) {
            finalItems = this.state.response.filter(item =>
                !isEmpty(item.Email) && item.Email.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
                !isEmpty(item.UserName) && item.UserName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
                !isEmpty(item.Mobile) && item.Mobile.toLowerCase().includes(this.state.searchInput.toLowerCase())
            )
        }

        //set screen title based on status
        let screenTitle = ''
        if (this.state.statusId == 0) {
            screenTitle = R.strings.userSignUpTotalReport
        }
        else if (this.state.statusId == 1) {
            screenTitle = R.strings.userSignUpTodayReport
        }
        else if (this.state.statusId == 2) {
            screenTitle = R.strings.userSignUpweeklyReport
        }
        else if (this.state.statusId == 3) {
            screenTitle = R.strings.userSignUpMonthlyReport
        }

        return (
            /* DrawerLayout for user sign up report list  Filteration */
            <Drawer
                ref={cmpDrawer => this.drawer = cmpDrawer}
                drawerWidth={R.dimens.FilterDrawarWidth}
                drawerContent={this.navigationDrawer()}
                drawerPosition={Drawer.positions.Right}
                onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
                onDrawerClose={() => this.setState({ isDrawerOpen: false })}
                type={Drawer.types.Overlay}
                easingFunc={Easing.ease}>
                <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                    {/* To Set Status Bas as per out theme */}
                    <CommonStatusBar />

                    {/* To Set ToolBar as per out theme */}
                    <CustomToolbar
                        title={screenTitle}
                        isBack={true}
                        rightIcon={R.images.FILTER}
                        searchable={true}
                        nav={this.props.navigation}
                        onSearchText={(text) => this.setState({ searchInput: text })}
                        onRightMenuPress={() => this.drawer.openDrawer()}
                    />

                    <View style={{ flex: 1, justifyContent: 'space-between' }}>
                        {loading && !this.state.refreshing ?
                            <ListLoader />
                            :
                            <View style={{ flex: 1 }}>
                                {finalItems.length ?
                                    <View style={{ flex: 1 }}>

                                        <FlatList
                                            showsVerticalScrollIndicator={false}
                                            data={finalItems}
                                            // render all item in list
                                            renderItem={({ item, index }) =>
                                                <UserSignUpReportListItem
                                                    item={item}
                                                    size={this.state.response.length}
                                                    onPress={() => this.onViewPress(item)}
                                                    index={index}
                                                />}
                                            // assign index as key value list item
                                            keyExtractor={(item, index) => index.toString()}
                                            // For Refresh Functionality FlatList Item 
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
class UserSignUpReportListItem extends Component {
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
        let { index, size, item } = this.props;

        return (
            // Flatlist item animation
            <AnimatableItem>
                <View style={{
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginLeft: R.dimens.widget_left_right_margin,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginRight: R.dimens.widget_left_right_margin,
                    flex: 1,
                }}>
                    <CardView style={{
                        margin: 0,
                        flex: 1,
                        borderRadius: 0,
                        borderBottomLeftRadius: R.dimens.margin,
                        borderTopRightRadius: R.dimens.margin,
                        elevation: R.dimens.listCardElevation,
                    }} onPress={this.props.onPress}>

                        {/* for show UserName and Email and mobile */}
                        <View style={{ flexDirection: 'row', }}>
                            <ImageTextButton
                                icon={R.images.IC_OUTLINE_USER}
                                style={{ justifyContent: 'center', width: R.dimens.ButtonHeight, height: R.dimens.ButtonHeight, margin: 0, backgroundColor: R.colors.accent, borderRadius: R.dimens.ButtonHeight }}
                                iconStyle={{ width: R.dimens.drawerMenuIconWidthHeight, height: R.dimens.drawerMenuIconWidthHeight, tintColor: R.colors.white }}
                            />
                            <View style={{ flex: 1, paddingLeft: R.dimens.margin, }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', alignContent: 'flex-start' }}>
                                    <Text style={{ flex: 1, color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, paddingRight: R.dimens.widgetMargin }}>{item.UserName ? item.UserName : ' - '}</Text>
                                    <Image
                                        style={{
                                            tintColor: R.colors.textPrimary,
                                            width: R.dimens.dashboardMenuIcon,
                                            height: R.dimens.dashboardMenuIcon,
                                        }}
                                        source={R.images.RIGHT_ARROW_DOUBLE} />
                                </View>
                                <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{validateValue(item.Email)}</TextViewHML>
                                <TextViewHML style={{ color: R.colors.yellow, fontSize: R.dimens.smallestText }}>{validateValue(item.Mobile)}</TextViewHML>
                            </View>
                        </View>

                        {/* for show time and status */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: R.dimens.widgetMargin, justifyContent: 'space-between' }}>
                            <View>
                                <StatusChip
                                    value={item.Status == 1 ? R.strings.active : R.strings.inActive}
                                    color={item.Status == 1 ? R.colors.successGreen : R.colors.failRed} />
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <ImageTextButton
                                    icon={R.images.IC_TIMER}
                                    style={{ margin: 0, paddingRight: R.dimens.widgetMargin, }}
                                    iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
                                />
                                <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{convertDate(item.CreatedDate) + ' ' + convertTime(item.CreatedDate)}</TextViewHML>
                            </View>
                        </View>
                        
                    </CardView>
                </View>
            </AnimatableItem>
        )
    };
}

function mapStatToProps(state) {
    //Updated Data For UsersSignupReportReducer Data 
    return { Listdata: state.UsersSignupReportReducer }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform getUserSignupRptData List Action 
        getUserSignupRptData: (TransferOutRequest) => dispatch(getUserSignupRptData(TransferOutRequest)),
        //Perform clearUserSignUpReport Action 
        clearUserSignUpReport: () => dispatch(clearUserSignUpReport()),
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(UserSignUpReportList);

