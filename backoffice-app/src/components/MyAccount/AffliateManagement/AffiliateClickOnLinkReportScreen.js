// AffiliateClickOnLinkReportScreen.js
import React, { Component } from 'react';
import { View, FlatList, RefreshControl, Easing, Text } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CardView from '../../../native_theme/components/CardView';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { changeTheme, parseArray, getCurrentDate, addPages, convertDateTime } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew, } from '../../../validations/CommonValidation'
import { isCurrentScreen, addRouteToBackPress } from '../../../components/Navigation';
import ListLoader from '../../../native_theme/components/ListLoader';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import Drawer from 'react-native-drawer-menu';
import FilterWidget from '../../../components/widget/FilterWidget';
import { DateValidation } from '../../../validations/DateValidation';
import PaginationWidget from '../../../components/widget/PaginationWidget';
import R from '../../../native_theme/R';
import { connect } from 'react-redux';
import { AppConfig } from '../../../controllers/AppConfig';

import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import { Fonts } from '../../../controllers/Constants';
import { affiliateClickOnLinkReport, affiliateClickOnLinkReportClear } from '../../../actions/account/AffiliateClickOnLinkReportAction';
import { affiliateUserData } from '../../../actions/PairListAction';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import SafeView from '../../../native_theme/components/SafeView';

class AffiliateClickOnLinkReportScreen extends Component {

    constructor(props) {
        super(props);

        //Define All initial State
        this.state = {
            // for pagination
            selectedPage: 1,
            data: [],//for store data from the responce
            search: '',//for search value for data
            refreshing: false,//for refresh data
            FromDate: getCurrentDate(),//for display Current Date
            ToDate: getCurrentDate(),//for display Current Date
            PageSize: AppConfig.pageSize,
            userList: [],
            selectedUser: R.strings.Please_Select,
            UserId: 0,
            isFirstTime: true,
            isDrawerOpen: false, // First Time Drawer is Closed
            row: [],
        }

        //Add Current Screen to Manual Handling BackPress Events
        addRouteToBackPress(props);

        // Bind All Method
        this.onBackPress = this.onBackPress.bind(this);
        this.props.navigation.setParams({ onBackPress: this.onBackPress });

        // create reference
        this.drawer = React.createRef();
        this.toast = React.createRef();
    }

    //for BackPress if Drawer is Open Than First Close The Drawer else Back to Previous Screen
    onBackPress() {
        if (this.state.isDrawerOpen) {
            this.setState({ isDrawerOpen: false })
            this.drawer.closeDrawer();
        }
        else {
            //going back screen
            this.props.navigation.goBack();
        }
    }

  
    shouldComponentUpdate = (nextProps, _nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps);
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {

            // call api for get AffiliateUserList data 
            this.props.affiliateUserData();

            //Bind Request For get ClickOnLinkReport data
            let requestClickOnLinkReport = {
                FromDate: this.state.FromDate,
                ToDate: this.state.ToDate,
                PageNo: 0,
                PageSize: this.state.PageSize
            }

            //Call Get clickLink report from API
            this.props.affiliateClickOnLinkReport(requestClickOnLinkReport)
        } else {
            this.setState({ refreshing: false });
        }
    }

    //For Swipe to referesh Functionality
    onRefresh = async () => {
        this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Bind Request For get ClickOnLinkReport data
            let requestClickOnLinkReport = {
                FromDate: this.state.FromDate,
                ToDate: this.state.ToDate,
                UserId: this.state.UserId,
                PageNo: this.state.selectedPage - 1,
                PageSize: this.state.PageSize
            }

            //Call Get clickLink report from API
            this.props.affiliateClickOnLinkReport(requestClickOnLinkReport)
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

                //Bind Request For get ClickOnLinkReport data
                let requestClickOnLinkReport = {
                    FromDate: this.state.FromDate,
                    ToDate: this.state.ToDate,
                    UserId: this.state.UserId,
                    PageNo: this.state.selectedPage - 1,
                    PageSize: this.state.PageSize
                }

                //Call Get clickLink report from API
                this.props.affiliateClickOnLinkReport(requestClickOnLinkReport)
            }
        }
    }

    // Drawer Navigation
    navigationDrawer() {
        return (
            // filterwidget for display fromdate, todate,parentuser data
            <FilterWidget
                FromDate={this.state.FromDate}
                ToDatePickerCall={(date) => this.setState({ ToDate: date })}
                toastRef={component => this.toast = component}
                ToDate={this.state.ToDate}
                onResetPress={this.onResetPress}
                FromDatePickerCall={(date) => this.setState({ FromDate: date })}
                onCompletePress={this.onCompletePress}
                firstPicker={{
                    title: R.strings.UserName,
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
            ToDate: getCurrentDate(),
            FromDate: getCurrentDate(),
            selectedUser: R.strings.Please_Select,
            selectedPage: 1,
            search: '',
            UserId: 0,
        })

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Bind Request For get ClickOnLinkReport data
            let requestClickOnLinkReport = {
                FromDate: getCurrentDate(),
                ToDate: getCurrentDate(),
                PageNo: 0,
                PageSize: this.state.PageSize
            }

            //Call Get clickLink report from API
            this.props.affiliateClickOnLinkReport(requestClickOnLinkReport)
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
                //Bind Request For get ClickOnLinkReport data
                let requestClickOnLinkReport = {
                    FromDate: this.state.FromDate,
                    ToDate: this.state.ToDate,
                    UserId: this.state.UserId,
                    PageNo: 0,
                    PageSize: this.state.PageSize
                }

                //Call Get clickLink report from API
                this.props.affiliateClickOnLinkReport(requestClickOnLinkReport)
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
        if (AffiliateClickOnLinkReportScreen.oldProps !== props) {
            AffiliateClickOnLinkReportScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //Get All Updated Field of Particular actions
            const { clickLinkReportData, clickLinkReportDataFetch, affiliateUserDataFetch, affiliateAllUserData } = props;

             //To Check affiliateUser Data Fetch or Not
             if (!affiliateUserDataFetch) {
                try {
                    if (validateResponseNew({ response: affiliateAllUserData, isList: true })) {
                        //Store Api Response Field and display in Screen.
                        var newRes = parseArray(affiliateAllUserData.Response);
                        newRes.map((item, index) => {
                            newRes[index].value = newRes[index].UserName
                            newRes[index].Id = newRes[index].Id
                        })
                        //----
                        let res = [{ value: R.strings.Please_Select, Id: 0 }, ...newRes]

                        return { ...state, userList: res };
                    }
                    else {
                        return { ...state,UserId: 0, userList: [], selectedUser: R.strings.Please_Select,  };
                    }
                } catch (e) {
                    return { ...state, userList: [],selectedUser: R.strings.Please_Select,  UserId: 0,  };
                }
            }
            //To Check clickLink Data Fetch or Not
            if (!clickLinkReportDataFetch) {
                try {
                    if (validateResponseNew({ response: clickLinkReportData, isList: true })) {
                        //Store Api Response Field and display in Screen.
                        return { ...state, clickLinkReportData,refreshing: false, data: parseArray(clickLinkReportData.Response),  row: addPages(clickLinkReportData.TotalCount) };
                    }
                    else {
                        return { ...state, refreshing: false, row: [] , data: [],};
                    }
                } catch (e) {
                    //Handle Catch and Notify User to Exception.
                    return { ...state, data: [], row: [], refreshing: false, };
                }
            }
        }
        return null;
    }

    componentWillUnmount() {
        // call action for clear Reducer value 
        this.props.affiliateClickOnLinkReportClear()
    }

    render() {
        // loading bit for display listloader
        const { isClickLinkReportFetch } = this.props;

        let list = this.state.data;

        //for final items from search input (validate on UserEmail , FirstName and LastName)
        let finalItems = list.filter(item =>
            (item.UserEmail.toLowerCase().includes(this.state.search.toLowerCase())) ||
            (item.FirstName.toLowerCase().includes(this.state.search.toLowerCase())) ||
            (item.LastName.toLowerCase().includes(this.state.search.toLowerCase()))
        );

        return (
            // for apply filter for clickLink report
            <Drawer
                drawerWidth={R.dimens.FilterDrawarWidth} ref={cmp => this.drawer = cmp}
                onDrawerClose={() => this.setState({ isDrawerOpen: false })}
                drawerContent={this.navigationDrawer()}
                onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
                drawerPosition={Drawer.positions.Right}
                type={Drawer.types.Overlay}
                easingFunc={Easing.ease}>

                <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                    {/* To set status bar as per our theme */}
                    <CommonStatusBar />

                    {/* To set toolbar as per our theme */}
                    <CustomToolbar
                        onBackPress={this.onBackPress}
                        title={R.strings.clickOnLinkReport} isBack={true}
                        onSearchText={(input) => this.setState({ search: input })}
                        nav={this.props.navigation} searchable={true}
                        rightIcon={R.images.FILTER}
                        onRightMenuPress={() => this.drawer.openDrawer()}
                    />
                    <View style={{ flex: 1, justifyContent: 'space-between' }}>
                        {/* To Check Response fetch or not if isClickLinkReportFetch = true then display progress bar else display List*/}
                        {
                            isClickLinkReportFetch && !this.state.refreshing ?
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
                                                    <AffiliateClickOnLinkReportItem
                                                        index={index}
                                                        item={item}
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
                                                        colors={[R.colors.accent]}
                                                        refreshing={this.state.refreshing} onRefresh={this.onRefresh}
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
                                <PaginationWidget  selectedPage={this.state.selectedPage} row={this.state.row} onPageChange={(item) => { this.onPageChange(item) }} />}
                        </View>
                    </View>
                </SafeView>
            </Drawer >
        )
    }
}

// This Class is used for display record in list
class AffiliateClickOnLinkReportItem extends Component {

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
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    flex: 1,
                    marginLeft: R.dimens.widget_left_right_margin, marginRight: R.dimens.widget_left_right_margin
                }}>
                    <CardView style={{
                        borderBottomLeftRadius: R.dimens.margin,
                        elevation: R.dimens.listCardElevation,
                        flex: 1,
                        borderRadius: 0,
                        borderTopRightRadius: R.dimens.margin,
                    }}>

                        <View style={{ flexDirection: 'row', }}>
                            {/* for show Image */}
                            <View>
                                <ImageTextButton
                                    icon={R.images.IC_CLICK}
                                    style={{ justifyContent: 'center', alignSelf: 'center', width: R.dimens.ButtonHeight, height: R.dimens.ButtonHeight, margin: 0, backgroundColor: R.colors.accent, borderRadius: R.dimens.ButtonHeight }}
                                    iconStyle={{ width: R.dimens.drawerMenuIconWidthHeight, height: R.dimens.drawerMenuIconWidthHeight, tintColor: R.colors.white }}
                                />
                            </View>

                            {/* for Display usename,email and ipaddress */}
                            <View style={{  paddingLeft: R.dimens.margin, flex: 1, paddingRight: R.dimens.margin }}>
                                <Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold }}>{R.strings.affiliateLinkInvite}</Text>
                                <TextViewHML style={{  fontSize: R.dimens.smallestText, color: R.colors.textSecondary }}>{R.strings.UserName} : <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>{item.FirstName ? item.FirstName + ' ' + item.LastName : '-'}</TextViewHML></TextViewHML>
                                <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.from} : <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>{item.UserEmail ? item.UserEmail : '-'}</TextViewHML></TextViewHML>
                                <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.to} {R.strings.IPAddress} : <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>{item.IpAddress ? item.IpAddress : '-'}</TextViewHML></TextViewHML>
                            </View>
                        </View>

                        {/* for show DateTime */}
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <ImageTextButton
                                icon={R.images.IC_TIMER}
                                style={{ paddingRight: R.dimens.LineHeight, margin: 0 }}
                                iconStyle={{  height: R.dimens.smallestText,width: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
                            />
                            <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, textAlign: 'center' }}>{item.ClickTime ? convertDateTime(item.ClickTime) : '-'}</TextViewHML>
                        </View>
                    </CardView>
                </View>
            </AnimatableItem>
        )
    }
}

function mapStateToProps(state) {
    return {
        // Updated Data for clickLink
        isClickLinkReportFetch: state.AffiliateClickOnLinkReportReducer.isClickLinkReportFetch,
        clickLinkReportData: state.AffiliateClickOnLinkReportReducer.clickLinkReportData,
        clickLinkReportDataFetch: state.AffiliateClickOnLinkReportReducer.clickLinkReportDataFetch,

        // updated data for userdata
        isAffiliateUser: state.AffiliateClickOnLinkReportReducer.isAffiliateUser,
        affiliateAllUserData: state.AffiliateClickOnLinkReportReducer.affiliateUserData,
        affiliateUserDataFetch: state.AffiliateClickOnLinkReportReducer.affiliateUserDataFetch,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        // perform clickLink Report Action
        affiliateClickOnLinkReport: (requestClickOnLinkReport) => dispatch(affiliateClickOnLinkReport(requestClickOnLinkReport)),
        // perform action for affiliate userlist
        affiliateUserData: () => dispatch(affiliateUserData()),
        // perform action to clear reducer data
        affiliateClickOnLinkReportClear: () => dispatch(affiliateClickOnLinkReportClear()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AffiliateClickOnLinkReportScreen)