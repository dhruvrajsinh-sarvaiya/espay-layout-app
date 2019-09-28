// AffiliateTwitterShareReportScreen.js
import React, { Component } from 'react';
import { View, FlatList, RefreshControl, Easing, Text } from 'react-native';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import SafeView from '../../../native_theme/components/SafeView';
import { changeTheme, parseArray, getCurrentDate, addPages, convertDateTime } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew, } from '../../../validations/CommonValidation'
import { isCurrentScreen, addRouteToBackPress } from '../../../components/Navigation';
import { connect } from 'react-redux';

import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import Drawer from 'react-native-drawer-menu';
import FilterWidget from '../../../components/widget/FilterWidget';
import { DateValidation } from '../../../validations/DateValidation';
import PaginationWidget from '../../../components/widget/PaginationWidget';
import R from '../../../native_theme/R';
import { AppConfig } from '../../../controllers/AppConfig';
import CardView from '../../../native_theme/components/CardView';
import ListLoader from '../../../native_theme/components/ListLoader';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import { Fonts } from '../../../controllers/Constants';
import { affiliateShareOnTwitterReport, affiliateShareOnTwitterReportClear } from '../../../actions/account/AffiliateTwitterShareReportAction';
import { affiliateUserData } from '../../../actions/PairListAction';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';

class AffiliateTwitterShareReportScreen extends Component {

    constructor(props) {
        super(props);

        //Define All initial State
        this.state = {
            // for pagination
            row: [],
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
        }

        //Add Current Screen to Manual Handling BackPress Events
        addRouteToBackPress(props);

          // create reference
          this.drawer = React.createRef();
          this.toast = React.createRef();
        
        // Bind All Method
        this.onBackPress = this.onBackPress.bind(this);
        this.props.navigation.setParams({ onBackPress: this.onBackPress });

      
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

    async componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {

            // call api for get AffiliateUserList data 
            this.props.affiliateUserData();

            //Bind Request For get twitterReport data
            let requestTwitterReport = {
                FromDate: this.state.FromDate,
                ToDate: this.state.ToDate,
                PageNo: 0,
                PageSize: this.state.PageSize
            }

            //Call Get twitter Share report from API
            this.props.affiliateShareOnTwitterReport(requestTwitterReport)
        }
    }

    shouldComponentUpdate(nextProps, _nextState) {
        //stop twice api call 
        return isCurrentScreen(nextProps);
    }

    //For Swipe to referesh Functionality
    onRefresh = async () => {
        this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Bind Request For get twitterReport data
            let requestTwitterReport = {
                FromDate: this.state.FromDate,
                ToDate: this.state.ToDate,
                UserId: this.state.UserId,
                PageNo: this.state.selectedPage - 1,
                PageSize: this.state.PageSize
            }

            //Call Get twitter Share report from API
            this.props.affiliateShareOnTwitterReport(requestTwitterReport)
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

                //Bind Request For get twitterReport data
                let requestTwitterReport = {
                    FromDate: this.state.FromDate,
                    ToDate: this.state.ToDate,
                    UserId: this.state.UserId,
                    PageNo: this.state.selectedPage - 1,
                    PageSize: this.state.PageSize
                }

                //Call Get twitter Share report from API
                this.props.affiliateShareOnTwitterReport(requestTwitterReport)
            }
        }
    }

    // Drawer Navigation
    navigationDrawer() {
        return (
            //    filterwidget for display fromdate, todate,parentuser data
            <FilterWidget
                FromDatePickerCall={(date) => this.setState({ FromDate: date })}
                FromDate={this.state.FromDate}
                ToDatePickerCall={(date) => this.setState({ ToDate: date })}
                ToDate={this.state.ToDate}   onResetPress={this.onResetPress}
                toastRef={component => this.toast = component}
                onCompletePress={this.onCompletePress}
                firstPicker={{
                    array: this.state.userList,
                    title: R.strings.UserName,
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
            FromDate: getCurrentDate(),ToDate: getCurrentDate(),
            selectedUser: R.strings.Please_Select,
            selectedPage: 1, search: '',
            UserId: 0,
        })

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Bind Request For get twitterReport data
            let requestTwitterReport = {
                FromDate: getCurrentDate(),
                ToDate: getCurrentDate(),
                PageNo: 0,
                PageSize: this.state.PageSize
            }

            //Call Get twitter Share report from API
            this.props.affiliateShareOnTwitterReport(requestTwitterReport)
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
                //Bind Request For get twitterReport data
                let requestTwitterReport = {
                    FromDate: this.state.FromDate,
                    ToDate: this.state.ToDate,
                    UserId: this.state.UserId,
                    PageNo: 0,
                    PageSize: this.state.PageSize
                }

                //Call Get twitter Share report from API
                this.props.affiliateShareOnTwitterReport(requestTwitterReport)
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
        if (AffiliateTwitterShareReportScreen.oldProps !== props) {
            AffiliateTwitterShareReportScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //Get All Updated Field of Particular actions
            const { twitterReportData, twitterReportDataFetch, affiliateUserDataFetch, affiliateAllUserData } = props;

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
                        let res = [{ Id: 0,value: R.strings.Please_Select,  }, ...newRes]

                        return { ...state, userList: res };
                    }
                    else {
                        return { ...state, userList: [], UserId: 0, selectedUser: R.strings.Please_Select,  };
                    }
                } catch (e) {
                    return { ...state,UserId: 0, userList: [], selectedUser: R.strings.Please_Select,  };
                }
            }

            //To Check twitterShare Data Fetch or Not
            if (!twitterReportDataFetch) {
                try {
                    if (validateResponseNew({ response: twitterReportData, isList: true })) {
                        //Store Api Response Field and display in Screen.
                        return { ...state, twitterReportData, data: parseArray(twitterReportData.Response), refreshing: false, row: addPages(twitterReportData.TotalCount) };
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
        this.props.affiliateShareOnTwitterReportClear()
    }

    render() {
        // loading bit for display listloader
        const { isTwitterReportFetch } = this.props;

        let list = this.state.data;

        //for final items from search input (validate on UserEmail , FirstName and LastName)
        let finalItems = list.filter(item =>
            (item.UserEmail.toLowerCase().includes(this.state.search.toLowerCase())) ||
            (item.FirstName.toLowerCase().includes(this.state.search.toLowerCase())) ||
            (item.LastName.toLowerCase().includes(this.state.search.toLowerCase()))
        );

        return (
            // for apply filter for twitterSharereport
            <Drawer
                drawerWidth={R.dimens.FilterDrawarWidth}
                drawerContent={this.navigationDrawer()}
                onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
                onDrawerClose={() => this.setState({ isDrawerOpen: false })}
                type={Drawer.types.Overlay}
                drawerPosition={Drawer.positions.Right} easingFunc={Easing.ease}
                ref={cmp => this.drawer = cmp}>

                <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                    {/* To set status bar as per our theme */}
                    <CommonStatusBar />

                    {/* To set toolbar as per our theme */}
                    <CustomToolbar
                        title={R.strings.twitterShareReport}
                        isBack={true}
                        onBackPress={this.onBackPress}
                        nav={this.props.navigation}
                        searchable={true}
                        onSearchText={(input) => this.setState({ search: input })}
                        rightIcon={R.images.FILTER}
                        onRightMenuPress={() => this.drawer.openDrawer()}
                    />
                    <View style={{ flex: 1, justifyContent: 'space-between' }}>
                        {/* To Check Response fetch or not if isTwitterReportFetch = true then display progress bar else display List*/}
                        {
                            isTwitterReportFetch && !this.state.refreshing ?
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
                                                    <AffiliateTwitterShareReportItem
                                                        item={item}
                                                        index={index}
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
                                                        colors={[R.colors.accent]} progressBackgroundColor={R.colors.background}
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
                                <PaginationWidget row={this.state.row} selectedPage={this.state.selectedPage} onPageChange={(item) => { this.onPageChange(item) }} />}
                        </View>
                    </View>
                </SafeView>
            </Drawer >
        )
    }
}

// This Class is used for display record in list
class AffiliateTwitterShareReportItem extends Component {

    constructor(props) {
        super(props)
    }
    
    shouldComponentUpdate(nextProps) {
        //Check If Old Props and New Props are Equal then Return False
        if (this.props.item === nextProps.item)
            return false
        return true
    }

    render() {

        let item = this.props.item;
        let {  size,index } = this.props;

        return (
            // Flatlist item animation
            <AnimatableItem>
                <View style={{
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    flex: 1,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginRight: R.dimens.widget_left_right_margin,
                    marginLeft: R.dimens.widget_left_right_margin
                }}>
                    <CardView style={{
                        borderRadius: 0,
                        elevation: R.dimens.listCardElevation,
                        flex: 1,
                        borderTopRightRadius: R.dimens.margin,
                        borderBottomLeftRadius: R.dimens.margin,
                    }}>

                        <View style={{ flexDirection: 'row', /* justifyContent: 'center', alignItems: 'center', */ }}>
                            {/* for display twitter icon  */}
                            <View>
                                <ImageTextButton
                                    icon={R.images.IC_TWITTER}
                                    style={{ justifyContent: 'center', alignSelf: 'center', width: R.dimens.ButtonHeight, height: R.dimens.ButtonHeight, margin: 0, backgroundColor: R.colors.accent, borderRadius: R.dimens.ButtonHeight }}
                                    iconStyle={{ width: R.dimens.drawerMenuIconWidthHeight, height: R.dimens.drawerMenuIconWidthHeight, tintColor: R.colors.white }}
                                />
                            </View>

                            {/* for display username and email and ip */}
                            <View style={{ flex: 1, paddingLeft: R.dimens.margin, paddingRight: R.dimens.margin }}>
                                <Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold }}>{R.strings.twitterLinkInvite}</Text>
                                <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.UserName} : <TextViewHML style={{fontSize: R.dimens.smallestText, color: R.colors.textPrimary,  }}>{item.FirstName ? item.FirstName + ' ' + item.LastName : '-'}</TextViewHML></TextViewHML>
                                <TextViewHML style={{  fontSize: R.dimens.smallestText ,color: R.colors.textSecondary,}}>{R.strings.from} : <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>{item.UserEmail ? item.UserEmail : '-'}</TextViewHML></TextViewHML>
                                <TextViewHML style={{fontSize: R.dimens.smallestText , color: R.colors.textSecondary, }}>{R.strings.to} {R.strings.IPAddress} : <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>{item.IpAddress ? item.IpAddress : '-'}</TextViewHML></TextViewHML>
                            </View>
                        </View>

                        {/* for show DateTime*/}
                        <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'center',  }}>
                            <ImageTextButton
                                style={{ paddingRight: R.dimens.LineHeight, margin: 0, }}
                                icon={R.images.IC_TIMER}
                                iconStyle={{ height: R.dimens.smallestText, width: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
                            />
                            <TextViewHML style={{ textAlign: 'center', color: R.colors.textSecondary, fontSize: R.dimens.smallestText,  }}>{item.ClickTime ? convertDateTime(item.ClickTime) : '-'}</TextViewHML>
                        </View>
                    </CardView>
                </View>
            </AnimatableItem>
        )
    }
}

function mapStateToProps(state) {
    return {
        // Updated Data for twitterShare
        isTwitterReportFetch: state.AffiliateTwitterShareReportReducer.isTwitterReportFetch,
        twitterReportData: state.AffiliateTwitterShareReportReducer.twitterReportData,
        twitterReportDataFetch: state.AffiliateTwitterShareReportReducer.twitterReportDataFetch,

        // updated data for userdata
        isAffiliateUser: state.AffiliateTwitterShareReportReducer.isAffiliateUser,
        affiliateAllUserData: state.AffiliateTwitterShareReportReducer.affiliateUserData,
        affiliateUserDataFetch: state.AffiliateTwitterShareReportReducer.affiliateUserDataFetch,

    }
}

function mapDispatchToProps(dispatch) {
    return {
        // // perform twitter Share Report Action
        affiliateShareOnTwitterReport: (requestTwitterReport) => dispatch(affiliateShareOnTwitterReport(requestTwitterReport)),
        // perform action for affiliate userlist
        affiliateUserData: () => dispatch(affiliateUserData()),
        // perform action to clear reducer data
        affiliateShareOnTwitterReportClear: () => dispatch(affiliateShareOnTwitterReportClear()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AffiliateTwitterShareReportScreen)