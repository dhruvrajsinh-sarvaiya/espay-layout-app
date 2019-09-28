// AffiliateSmsSentReportScreen.js
import React, { Component } from 'react';
import { View, FlatList, RefreshControl, Easing, Text } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { changeTheme, parseArray, getCurrentDate, addPages, convertDateTime } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew, } from '../../../validations/CommonValidation'
import { isCurrentScreen, addRouteToBackPress } from '../../../components/Navigation';
import { connect } from 'react-redux';
import ListLoader from '../../../native_theme/components/ListLoader';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import FilterWidget from '../../../components/widget/FilterWidget';
import { DateValidation } from '../../../validations/DateValidation';
import PaginationWidget from '../../../components/widget/PaginationWidget';
import R from '../../../native_theme/R';
import { AppConfig } from '../../../controllers/AppConfig';
import CardView from '../../../native_theme/components/CardView';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import { Fonts } from '../../../controllers/Constants';
import { affiliateSmsSentReport, affiliateSmsSentReportClear } from '../../../actions/account/AffiliateSmsSentReportAction';
import { affiliateUserData } from '../../../actions/PairListAction';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import SafeView from '../../../native_theme/components/SafeView';
import Drawer from 'react-native-drawer-menu';

class AffiliateSmsSentReportScreen extends Component {

    constructor(props) {
        super(props);

        //Define All initial State
        this.state = {
            // for pagination
            row: [],
            data: [],//for store data from the responce
            selectedPage: 1,
            search: '',//for search value for data
            refreshing: false,//for refresh data
            FromDate: getCurrentDate(),//for display Current Date
            ToDate: getCurrentDate(),//for display Current Date
            PageSize: AppConfig.pageSize,
            selectedUser: R.strings.Please_Select,
            UserId: 0,
            isFirstTime: true,
            isDrawerOpen: false, // First Time Drawer is Closed
            userList: [],
        }

        //Add Current Screen to Manual Handling BackPress Events
        addRouteToBackPress(props);

        // Bind All Method
        this.onBackPress = this.onBackPress.bind(this);
        this.props.navigation.setParams({ onBackPress: this.onBackPress });

        // create reference
        this.toast = React.createRef();
        this.drawer = React.createRef();

    }


    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {

            // call api for get AffiliateUserList data 
            this.props.affiliateUserData();

            //Bind Request For get SmsSentReport data
            let requestSmsSentReport = {
                ToDate: this.state.ToDate,
                PageNo: 0,
                FromDate: this.state.FromDate,
                PageSize: this.state.PageSize
            }

            //Call Get SmsSent report from API
            this.props.affiliateSmsSentReport(requestSmsSentReport)
        }
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

    shouldComponentUpdate = (nextProps, _nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps);
    };

    //For Swipe to referesh Functionality
    onRefresh = async () => {
        this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Bind Request For get SmsSentReport data
            let requestSmsSentReport = {
                FromDate: this.state.FromDate,
                ToDate: this.state.ToDate,
                UserId: this.state.UserId,
                PageNo: this.state.selectedPage - 1,
                PageSize: this.state.PageSize
            }

            //Call Get SmsSent report from API
            this.props.affiliateSmsSentReport(requestSmsSentReport)
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

                //Bind Request For get SmsSentReport data
                let requestSmsSentReport = {
                    FromDate: this.state.FromDate,
                    ToDate: this.state.ToDate,
                    UserId: this.state.UserId,
                    PageNo: this.state.selectedPage - 1,
                    PageSize: this.state.PageSize
                }

                //Call Get SmsSent report from API
                this.props.affiliateSmsSentReport(requestSmsSentReport)
            }
        }
    }

    // Drawer Navigation
    navigationDrawer() {
        return (
            // filterwidget for display fromdate, todate,parentuser data
            <FilterWidget
                FromDate={this.state.FromDate} ToDate={this.state.ToDate}
                onResetPress={this.onResetPress}
                ToDatePickerCall={(date) => this.setState({ ToDate: date })}
                FromDatePickerCall={(date) => this.setState({ FromDate: date })}
                toastRef={component => this.toast = component}
                onCompletePress={this.onCompletePress}
                firstPicker={{
                    title: R.strings.userId,
                    array: this.state.userList,
                    selectedValue: this.state.selectedUser,
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
            search: '',
            UserId: 0,
        })

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Bind Request For get SmsSentReport data
            let requestSmsSentReport = {
                FromDate: getCurrentDate(),
                ToDate: getCurrentDate(),
                PageNo: 0,
                PageSize: this.state.PageSize
            }

            //Call Get SmsSent report from API
            this.props.affiliateSmsSentReport(requestSmsSentReport)
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
                //Bind Request For get SmsSentReport data
                let requestSmsSentReport = {
                    FromDate: this.state.FromDate,
                    ToDate: this.state.ToDate,
                    UserId: this.state.UserId,
                    PageNo: 0,
                    PageSize: this.state.PageSize
                }
                //Call Get SmsSent report from API
                this.props.affiliateSmsSentReport(requestSmsSentReport)
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
        if (AffiliateSmsSentReportScreen.oldProps !== props) {
            AffiliateSmsSentReportScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //Get All Updated Field of Particular actions
            const { smsSentReportData, smsSentReportDataFetch, affiliateUserDataFetch, affiliateAllUserData } = props;

            //To Check affiliateUser Data Fetch or Not
            if (!affiliateUserDataFetch) {
                try {
                    if (validateResponseNew({ isList: true, response: affiliateAllUserData })) {
                        //Store Api Response Field and display in Screen.
                        var newRes = parseArray(affiliateAllUserData.Response);
                        newRes.map((item, index) => {
                            newRes[index].value = newRes[index].UserName
                            newRes[index].Id = newRes[index].Id
                        })
                        //----
                        let res = [{ Id: 0, value: R.strings.Please_Select,  }, ...newRes]

                        return { ...state, userList: res };
                    }
                    else {
                        return { ...state, UserId: 0, userList: [], selectedUser: R.strings.Please_Select,  };
                    }
                } catch (e) {
                    return { ...state, selectedUser: R.strings.Please_Select, UserId: 0, userList: [] };
                }
            }

            //To Check SmsSent Data Fetch or Not
            if (!smsSentReportDataFetch) {
                try {
                    if (validateResponseNew({ response: smsSentReportData, isList: true })) {
                        //Store Api Response Field and display in Screen.
                        return { ...state, smsSentReportData, data: parseArray(smsSentReportData.Response), refreshing: false, row: addPages(smsSentReportData.TotalCount) };
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
        this.props.affiliateSmsSentReportClear()
    }

    render() {
        // loading bit for display listloader
        const { isSmsSentReportFetch } = this.props;

        let list = this.state.data;

        //for final items from search input (validate on Sms , FirstName and LastName)
        let finalItems = list.filter(item =>
            (item.Mobile.toLowerCase().includes(this.state.search.toLowerCase())) ||
            (item.FirstName.toLowerCase().includes(this.state.search.toLowerCase())) ||
            (item.LastName.toLowerCase().includes(this.state.search.toLowerCase()))
        );

        return (
            // for apply filter for SmsSent report
            <Drawer
                drawerWidth={R.dimens.FilterDrawarWidth}
                ref={cmp => this.drawer = cmp}
                drawerContent={this.navigationDrawer()}
                onDrawerOpen={() => this.setState({ isDrawerOpen: true })} onDrawerClose={() => this.setState({ isDrawerOpen: false })}
                type={Drawer.types.Overlay}
                drawerPosition={Drawer.positions.Right}
                easingFunc={Easing.ease}>

                <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                    {/* To set status bar as per our theme */}
                    <CommonStatusBar />

                    {/* To set toolbar as per our theme */}
                    <CustomToolbar
                        title={R.strings.smsSentReport}
                        isBack={true}
                        onBackPress={this.onBackPress}
                        nav={this.props.navigation}
                        searchable={true}
                        onSearchText={(input) => this.setState({ search: input })}
                        rightIcon={R.images.FILTER} onRightMenuPress={() => this.drawer.openDrawer()}
                    />
                    <View style={{ flex: 1, justifyContent: 'space-between' }}>
                        {/* To Check Response fetch or not if isSmsSentReportFetch = true then display progress bar else display List*/}
                        {
                            isSmsSentReportFetch && !this.state.refreshing ?
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
                                                    <AffiliateSmsSentReportItem
                                                        item={item}
                                                        index={index} size={this.state.data.length}
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
                                                        colors={[R.colors.accent]} progressBackgroundColor={R.colors.background}
                                                        refreshing={this.state.refreshing}
                                                        onRefresh={this.onRefresh}
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
                                <PaginationWidget selectedPage={this.state.selectedPage} onPageChange={(item) => { this.onPageChange(item) }} row={this.state.row} />}
                        </View>
                    </View>
                </SafeView>
            </Drawer >
        )
    }
}

// This Class is used for display record in list
class AffiliateSmsSentReportItem extends Component {

    shouldComponentUpdate(nextProps) {
        //Check If Old Props and New Props are Equal then Return False
        if (this.props.item === nextProps.item) {
            return false
        }
        return true
    }

    render() {

        let { index, size, } = this.props;
        let item = this.props.item;


        return (
            // Flatlist item animation
            <AnimatableItem>
                <View style={{
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginLeft: R.dimens.widget_left_right_margin,
                    flex: 1, marginRight: R.dimens.widget_left_right_margin
                }}>
                    <CardView style={{
                        elevation: R.dimens.listCardElevation,
                        borderRadius: 0,
                        flex: 1,
                        borderBottomLeftRadius: R.dimens.margin,
                        borderTopRightRadius: R.dimens.margin,
                    }}>

                        <View style={{ flexDirection: 'row', }}>
                            {/* for show complain icon */}
                            <View>
                                <ImageTextButton
                                    icon={R.images.IC_COMPLAINT}
                                    style={{ justifyContent: 'center', alignSelf: 'center', width: R.dimens.ButtonHeight, height: R.dimens.ButtonHeight, margin: 0, backgroundColor: R.colors.accent, borderRadius: R.dimens.ButtonHeight }}
                                    iconStyle={{ width: R.dimens.drawerMenuIconWidthHeight, height: R.dimens.drawerMenuIconWidthHeight, tintColor: R.colors.white }}
                                />
                            </View>

                            {/* for Display message with username and from and to mobile no */}
                            <View style={{ flex: 1, paddingLeft: R.dimens.margin, paddingRight: R.dimens.margin }}>
                                <Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold }}>{R.strings.smsLinkInvite}</Text>
                                <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.UserName} : <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>{item.FirstName ? item.FirstName + ' ' + item.LastName : '-'}</TextViewHML></TextViewHML>
                                <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.from} : <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>{item.UserEmail ? item.UserEmail : '-'}</TextViewHML></TextViewHML>
                                <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.to} : <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>{item.Mobile ? item.Mobile : '-'}</TextViewHML></TextViewHML>
                            </View>
                        </View>

                        {/* for show DateTime*/}
                        <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <ImageTextButton
                                style={{ margin: 0, paddingRight: R.dimens.LineHeight, }}
                                icon={R.images.IC_TIMER}
                                iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
                            />
                            <TextViewHML style={{ color: R.colors.textSecondary, textAlign: 'center', fontSize: R.dimens.smallestText, }}>{item.SentTime ? convertDateTime(item.SentTime) : '-'}</TextViewHML>
                        </View>
                    </CardView>
                </View>
            </AnimatableItem>
        )
    }
}

function mapStateToProps(state) {
    return {
        // Updated Data for SmsSent
        isSmsSentReportFetch: state.AffiliateSmsSentReportReducer.isSmsSentReportFetch,
        smsSentReportData: state.AffiliateSmsSentReportReducer.smsSentReportData,
        smsSentReportDataFetch: state.AffiliateSmsSentReportReducer.smsSentReportDataFetch,

        // updated data for userdata
        isAffiliateUser: state.AffiliateSmsSentReportReducer.isAffiliateUser,
        affiliateAllUserData: state.AffiliateSmsSentReportReducer.affiliateUserData,
        affiliateUserDataFetch: state.AffiliateSmsSentReportReducer.affiliateUserDataFetch,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        // perform SmsSent Report Action
        affiliateSmsSentReport: (requestSmsSentReport) => dispatch(affiliateSmsSentReport(requestSmsSentReport)),
        // perform action for affiliate userlist
        affiliateUserData: () => dispatch(affiliateUserData()),
        // perform action to clear reducer data
        affiliateSmsSentReportClear: () => dispatch(affiliateSmsSentReportClear()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AffiliateSmsSentReportScreen)