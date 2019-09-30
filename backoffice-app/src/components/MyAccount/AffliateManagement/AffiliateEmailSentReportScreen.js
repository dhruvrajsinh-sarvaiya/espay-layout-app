// AffiliateEmailSentReportScreen.js
import React, { Component } from 'react';
import { View, FlatList, RefreshControl, Easing, Text } from 'react-native';
import { DateValidation } from '../../../validations/DateValidation';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { changeTheme, parseArray, getCurrentDate, addPages, convertDateTime } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew, } from '../../../validations/CommonValidation'
import { isCurrentScreen, addRouteToBackPress } from '../../../components/Navigation';
import { connect } from 'react-redux';
import { Fonts } from '../../../controllers/Constants';
import ListLoader from '../../../native_theme/components/ListLoader';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import Drawer from 'react-native-drawer-menu';
import FilterWidget from '../../../components/widget/FilterWidget';

import PaginationWidget from '../../../components/widget/PaginationWidget';
import R from '../../../native_theme/R';
import { AppConfig } from '../../../controllers/AppConfig';
import CardView from '../../../native_theme/components/CardView';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import TextViewHML from '../../../native_theme/components/TextViewHML';

import { affiliateEmailSentReport, affiliateEmailSentReportClear } from '../../../actions/account/AffiliateEmailSentReportAction';
import { affiliateUserData } from '../../../actions/PairListAction';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import SafeView from '../../../native_theme/components/SafeView';

class AffiliateEmailSentReportScreen extends Component {

    constructor(props) {
        super(props);

        //Define All initial State
        this.state = {
            // for pagination
            FromDate: getCurrentDate(),//for display Current Date
            row: [],
            selectedPage: 1,
            data: [],//for store data from the responce
            search: '',//for search value for data
            refreshing: false,//for refresh data
            ToDate: getCurrentDate(),//for display Current Date
            PageSize: AppConfig.pageSize,
            userList: [],
            selectedUser: R.strings.Please_Select,
            isFirstTime: true,
            UserId: 0,
            isDrawerOpen: false, // First Time Drawer is Closed
        }

        //Add Current Screen to Manual Handling BackPress Events
        addRouteToBackPress(props);

        // Bind All Method
        this.props.navigation.setParams({ onBackPress: this.onBackPress });
        this.onBackPress = this.onBackPress.bind(this);

        // create reference
        this.drawer = React.createRef();
        this.toast = React.createRef();
    }

    //for BackPress if Drawer is Open Than First Close The Drawer else Back to Previous Screen
    onBackPress() {
        if (this.state.isDrawerOpen) {
            this.drawer.closeDrawer();
            this.setState({ isDrawerOpen: false })
        }
        else {
            //going back screen
            this.props.navigation.goBack();
        }
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {

            // call api for get AffiliateUserList data 
            this.props.affiliateUserData();

            //Bind Request For get EmailSentReport data
            let requestEmailSentReport = {
                FromDate: this.state.FromDate,
                ToDate: this.state.ToDate,
                PageNo: 0,
                PageSize: this.state.PageSize
            }

            //Call Get EmailSent report from API
            this.props.affiliateEmailSentReport(requestEmailSentReport)
        }
    }

    shouldComponentUpdate = (nextProps, _nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps);
    };

    //For Swipe to referesh Functionality
    onRefresh = async () => {
        this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Bind Request For get EmailSentReport data
            let requestEmailSentReport = {
                FromDate: this.state.FromDate,
                ToDate: this.state.ToDate,
                UserId: this.state.UserId,
                PageNo: this.state.selectedPage - 1,
                PageSize: this.state.PageSize
            }

            //Call Get EmailSent report from API
            this.props.affiliateEmailSentReport(requestEmailSentReport)
            //----------
        } else {
            this.setState({ refreshing: false });
        }
    }

    onPageChange = async (pNo) => {
        if ((pNo) !== (this.state.selectedPage)) {
            this.setState({ selectedPage: pNo });

            //Check NetWork is Available or not
            if (await isInternet()) {

                //Bind Request For get EmailSentReport data
                let requestEmailSentReport = {
                    FromDate: this.state.FromDate,
                    ToDate: this.state.ToDate,
                    UserId: this.state.UserId,
                    PageNo: this.state.selectedPage - 1,
                    PageSize: this.state.PageSize
                }

                //Call Get EmailSent report from API
                this.props.affiliateEmailSentReport(requestEmailSentReport)
            }
        }
    }

    // Drawer Navigation
    navigationDrawer() {
        return (
            // filterwidget for display fromdate, todate,parentuser data 
            <FilterWidget
                FromDatePickerCall={(date) => this.setState({ FromDate: date })}
                FromDate={this.state.FromDate}
                ToDatePickerCall={(date) => this.setState({ ToDate: date })}
                ToDate={this.state.ToDate}
                toastRef={component => this.toast = component}
                onResetPress={this.onResetPress}
                onCompletePress={this.onCompletePress}
                firstPicker={{
                    title: R.strings.userId,
                    selectedValue: this.state.selectedUser,
                    array: this.state.userList,
                    onPickerSelect: (index, object) => { this.setState({ selectedUser: index, UserId: object.Id }) }
                }}
            />
        )
    }

    onResetPress = async () => {
        this.drawer.closeDrawer();

        // setstate as initial value
        this.setState({
            FromDate: getCurrentDate(),
            ToDate: getCurrentDate(),
            selectedUser: R.strings.Please_Select,
            selectedPage: 1,
            UserId: 0,
            search: '',
         
        })

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Bind Request For get EmailSentReport data
            let requestEmailSentReport = {
                FromDate: getCurrentDate(),
                ToDate: getCurrentDate(),
                PageNo: 0,
                PageSize: this.state.PageSize
            }

            //Call Get EmailSent report from API
            this.props.affiliateEmailSentReport(requestEmailSentReport)
        }
    }

    // if press on complete button then check validation and api calling
    onCompletePress = async () => {

        // for check date validation
        if (DateValidation(this.state.FromDate, this.state.ToDate)) {
            this.toast.Show(DateValidation(this.state.FromDate, this.state.ToDate));
            return;
        } else {
            this.drawer.closeDrawer();
            this.setState({ selectedPage: 1 })

            //Check NetWork is Available or not
            if (await isInternet()) {
                //Bind Request For get EmailSentReport data
                let requestEmailSentReport = {
                    FromDate: this.state.FromDate,
                    ToDate: this.state.ToDate,
                    UserId: this.state.UserId,
                    PageNo: 0,
                    PageSize: this.state.PageSize
                }
                //Call Get EmailSent report from API
                this.props.affiliateEmailSentReport(requestEmailSentReport)
            }
        }
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
        if (AffiliateEmailSentReportScreen.oldProps !== props) {
            AffiliateEmailSentReportScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //Get All Updated Field of Particular actions
            const { emailSentReportData, emailSentReportDataFetch, affiliateUserDataFetch, affiliateAllUserData } = props;

            //To Check affiliateUser Data Fetch or Not
            if (!affiliateUserDataFetch) {
                try {
                    if (validateResponseNew({ response: affiliateAllUserData, isList: true })) {
                        //Store Api Response Field and display in Screen.
                        var newRes = parseArray(affiliateAllUserData.Response);
                        newRes.map((item, index) => {
                            newRes[index].Id = newRes[index].Id
                            newRes[index].value = newRes[index].UserName
                        })
                        //----
                        let res = [{ value: R.strings.Please_Select, Id: 0 }, ...newRes]

                        return { ...state, userList: res };
                    }
                    else {
                        return { ...state, userList: [], selectedUser: R.strings.Please_Select, UserId: 0 };
                    }
                } catch (e) {
                    return { ...state, userList: [], selectedUser: R.strings.Please_Select, UserId: 0 };
                }
            }

            //To Check EmailSent Data Fetch or Not
            if (!emailSentReportDataFetch) {
                try {
                    if (validateResponseNew({ response: emailSentReportData, isList: true })) {
                        //Store Api Response Field and display in Screen.
                        return { ...state, emailSentReportData, data: parseArray(emailSentReportData.Response), refreshing: false, row: addPages(emailSentReportData.TotalCount) };
                    }
                    else {
                        return { ...state, refreshing: false, data: [], row: [] };
                    }
                } catch (e) {
                    //Handle Catch and Notify User to Exception.
                    return { ...state, refreshing: false, data: [], row: [] };
                }
            }
        }
        return null;
    }

    componentWillUnmount() {
        // call action for clear Reducer value 
        this.props.affiliateEmailSentReportClear()
    }

    render() {
        // loading bit for display listloader
        const { isEmailSentReportFetch } = this.props;

        let list = this.state.data;

        //for final items from search input (validate on Email , FirstName and LastName)
        let finalItems = list.filter(item =>
            (item.Email.toLowerCase().includes(this.state.search.toLowerCase())) ||
            (item.FirstName.toLowerCase().includes(this.state.search.toLowerCase())) ||
            (item.LastName.toLowerCase().includes(this.state.search.toLowerCase()))
        );

        return (
            // for apply filter for EmailSent report
            <Drawer
                type={Drawer.types.Overlay} ref={cmp => this.drawer = cmp}
                drawerWidth={R.dimens.FilterDrawarWidth}
                drawerContent={this.navigationDrawer()}
                onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
                onDrawerClose={() => this.setState({ isDrawerOpen: false })}
                drawerPosition={Drawer.positions.Right}
                easingFunc={Easing.ease}>

                <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                    {/* To set status bar as per our theme */}
                    <CommonStatusBar />

                    {/* To set toolbar as per our theme */}
                    <CustomToolbar
                        isBack={true} title={R.strings.emailSentReport}
                        onBackPress={this.onBackPress}
                        nav={this.props.navigation}
                        onSearchText={(input) => this.setState({ search: input })}
                        rightIcon={R.images.FILTER} searchable={true}
                        onRightMenuPress={() => this.drawer.openDrawer()}
                    />
                    <View style={{ flex: 1, justifyContent: 'space-between' }}>
                        {/* To Check Response fetch or not if isEmailSentReportFetch = true then display progress bar else display List*/}
                        {
                            isEmailSentReportFetch && !this.state.refreshing ?
                                <ListLoader />
                                :
                                <View style={{ flex: 1 }}>
                                    {/* for display Headers for list  */}
                                    {finalItems.length > 0 ?
                                        <View style={{ flex: 1 }}>
                                            <FlatList
                                                data={finalItems}
                                                showsVerticalScrollIndicator={false}
                                                renderItem={({ item, index }) =>
                                                    <AffiliateEmailSentReportItem
                                                        item={item}  index={index}
                                                        size={this.state.data.length}
                                                    />
                                                }
                                                keyExtractor={(item, index) => index.toString()}
                                                contentContainerStyle={[
                                                    { flexGrow: 1 },
                                                    this.state.data.length ? null : { justifyContent: 'center' }
                                                ]}
                                                /* for refreshing data of flatlist */
                                                refreshControl={
                                                    <RefreshControl
                                                        progressBackgroundColor={R.colors.background}
                                                        refreshing={this.state.refreshing}
                                                        onRefresh={this.onRefresh}
                                                        colors={[R.colors.accent]}
                                                    />}
                                            />
                                        </View>
                                        :
                                        <ListEmptyComponent />}
                                </View>
                        }
                        <View>
                            {/* show pagination if response contains more data  */}
                            {finalItems.length > 0 &&
                                <PaginationWidget row={this.state.row} onPageChange={(item) => { this.onPageChange(item) }} selectedPage={this.state.selectedPage}  />}
                        </View>
                    </View>
                </SafeView>
            </Drawer >
        )
    }
}

// This Class is used for display record in list
class AffiliateEmailSentReportItem extends Component {

    shouldComponentUpdate(nextProps) {
        //Check If Old Props and New Props are Equal then Return False
        if (this.props.item === nextProps.item) {
            return false
        }
        return true
    }

    render() {

        let { index, size, } = this.props; let item = this.props.item;

        return (
            // Flatlist item animation
            <AnimatableItem>
                <View style={{
                    marginLeft: R.dimens.widget_left_right_margin, flex: 1,
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginRight: R.dimens.widget_left_right_margin,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                }}>
                    <CardView style={{
                        borderRadius: 0,
                        flex: 1,
                        borderBottomLeftRadius: R.dimens.margin,
                        borderTopRightRadius: R.dimens.margin,
                        elevation: R.dimens.listCardElevation,
                    }}>

                        <View style={{ flexDirection: 'row', }}>

                            {/* for display Email icon  */}
                            <View>
                                <ImageTextButton
                                    icon={R.images.IC_EMAIL_FILLED}
                                    style={{ justifyContent: 'center', alignSelf: 'center', width: R.dimens.ButtonHeight, height: R.dimens.ButtonHeight, margin: 0, backgroundColor: R.colors.accent, borderRadius: R.dimens.ButtonHeight }}
                                    iconStyle={{ width: R.dimens.drawerMenuIconWidthHeight, height: R.dimens.drawerMenuIconWidthHeight, tintColor: R.colors.white }}
                                />
                            </View>

                            {/* for display username and email and ip */}
                            <View style={{ flex: 1, paddingLeft: R.dimens.margin, paddingRight: R.dimens.margin }}>
                                <Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold }}>{R.strings.emailLinkInvite}</Text>
                                <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.UserName} : <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>{item.FirstName ? item.FirstName + ' ' + item.LastName : '-'}</TextViewHML></TextViewHML>
                                <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.from} : <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>{item.UserEmail ? item.UserEmail : '-'}</TextViewHML></TextViewHML>
                                <TextViewHML style={{fontSize: R.dimens.smallestText, color: R.colors.textSecondary,  }}>{R.strings.to} : <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>{item.Email ? item.Email : '-'}</TextViewHML></TextViewHML>
                            </View>
                        </View>

                        {/* for show time and status */}
                        <View style={{ justifyContent: 'flex-end', flex: 1, flexDirection: 'row', alignItems: 'center',  }}>
                            <ImageTextButton
                                style={{ margin: 0, paddingRight: R.dimens.LineHeight, }} icon={R.images.IC_TIMER}
                                iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
                            />
                            <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, textAlign: 'center' }}>{item.SentTime ? convertDateTime(item.SentTime) : '-'}</TextViewHML>
                        </View>
                    </CardView>
                </View>
            </AnimatableItem>
        )
    }
}

function mapStateToProps(state) {
    return {
        // Updated Data for EmailSent
        isEmailSentReportFetch: state.AffiliateEmailSentReportReducer.isEmailSentReportFetch,
        emailSentReportData: state.AffiliateEmailSentReportReducer.emailSentReportData,
        emailSentReportDataFetch: state.AffiliateEmailSentReportReducer.emailSentReportDataFetch,

        // updated data for userdata
        isAffiliateUser: state.AffiliateEmailSentReportReducer.isAffiliateUser,
        affiliateAllUserData: state.AffiliateEmailSentReportReducer.affiliateUserData,
        affiliateUserDataFetch: state.AffiliateEmailSentReportReducer.affiliateUserDataFetch,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        // perform EmailSent Report Action
        affiliateEmailSentReport: (requestEmailSentReport) => dispatch(affiliateEmailSentReport(requestEmailSentReport)),
        // perform action for affiliate userlist
        affiliateUserData: () => dispatch(affiliateUserData()),
        // perform action to clear reducer data
        affiliateEmailSentReportClear: () => dispatch(affiliateEmailSentReportClear()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AffiliateEmailSentReportScreen)