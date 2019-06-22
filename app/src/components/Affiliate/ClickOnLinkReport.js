import React, { Component } from 'react';
import { View, Easing, FlatList, RefreshControl, Text } from 'react-native';
import R from '../../native_theme/R';
import CommonToast from '../../native_theme/components/CommonToast';
import FilterWidget from '../Widget/FilterWidget';
import Drawer from 'react-native-drawer-menu';
import { ListEmptyComponent, contentContainerStyle } from '../../native_theme/components/FlatListWidgets';
import { connect } from 'react-redux';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../native_theme/components/CustomToolbar';
import ListLoader from '../../native_theme/components/ListLoader';
import { changeTheme, parseArray, addPages, getCurrentDate, convertDateTime } from '../../controllers/CommonUtils';
import { isInternet, validateResponseNew } from '../../validations/CommonValidation';
import { isCurrentScreen, addRouteToBackPress } from '../Navigation';
import { DateValidation } from '../../validations/DateValidation';
import { getClikOnLinkReport, getAffiliateUserList, clearAffiliateData } from '../../actions/Affiliate/AffiliateAction';
import PaginationWidget from '../Widget/PaginationWidget';
import { AppConfig } from '../../controllers/AppConfig';
import CardView from '../../native_theme/components/CardView';
import ImageTextButton from '../../native_theme/components/ImageTextButton';
import TextViewHML from '../../native_theme/components/TextViewHML';
import { Fonts } from '../../controllers/Constants';
import AnimatableItem from '../../native_theme/components/AnimatableItem';
import SafeView from '../../native_theme/components/SafeView';

class ClickOnLinkReport extends Component {

    constructor(props) {
        super(props);

        //Define All initial State
        this.state = {
            row: [],
            response: [],
            searchInput: '',
            refreshing: false,
            clickOnLinkListData: null,
            FromDate: getCurrentDate(),
            ToDate: getCurrentDate(),
            email: '',
            selectedPage: 1,
            PageSize: AppConfig.pageSize,
            userList: [],
            selectedUser: R.strings.Please_Select,
            UserId: 0,
            isFirstTime: true,
            isDrawerOpen: false, // First Time Drawer is Closed
        };

        //Add Current Screen to Manual Handling BackPress Events
        addRouteToBackPress(props);

        //To Bind All Method
        this.onRefresh = this.onRefresh.bind(this);
        this.onResetPress = this.onResetPress.bind(this);
        this.onCompletePress = this.onCompletePress.bind(this);
        this.onPageChange = this.onPageChange.bind(this);
        this.onBackPress = this.onBackPress.bind(this);
        this.props.navigation.setParams({ onBackPress: this.onBackPress });

        // create reference
        this.drawer = React.createRef();
        this.toast = React.createRef();
    }

    shouldComponentUpdate(nextProps, _nextState) {
        return isCurrentScreen(nextProps)
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
            this.props.getAffiliateUserList();

            //Bind Request For get ClikOnLinkReport data
            let requestReport = {
                FromDate: getCurrentDate(),
                ToDate: getCurrentDate(),
                PageNo: 0,
                PageSize: this.state.PageSize
            }
            //Call Get clicked link report from API
            this.props.getClikOnLinkReport(requestReport);
        } else {
            this.setState({ refreshing: false });
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
        if (ClickOnLinkItem.oldProps !== props) {
            ClickOnLinkItem.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {

            //Get All Updated Field of Particular actions
            const { affiliateUserDataFetch, affiliateUserData } = props;
            const { clickOnLinkListData } = props.Listdata;

            //To Check affiliateUser Data Fetch or Not
            if (!affiliateUserDataFetch) {
                try {
                    if (validateResponseNew({ response: affiliateUserData, isList: true })) {
                        //Store Api Response Field and display in Screen.
                        var newRes = parseArray(affiliateUserData.Response);
                        newRes.map((item, index) => {
                            newRes[index].value = newRes[index].UserName
                            newRes[index].Id = newRes[index].Id
                        })
                        //----
                        let res = [{ value: R.strings.Please_Select, Id: 0 }, ...newRes]

                        return { ...state, userList: res };
                    }
                    else {
                        return { ...state, userList: [], selectedUser: R.strings.Please_Select, };
                    }
                } catch (e) {
                    return { ...state, userList: [], selectedUser: R.strings.Please_Select, };
                }
            }

            //To Check click OnLink Report Data Data Fetch or Not
            if (clickOnLinkListData) {
                try {
                    if (state.clickOnLinkListData == null || (state.clickOnLinkListData != null && clickOnLinkListData !== state.clickOnLinkListData)) {
                        if (validateResponseNew({ response: clickOnLinkListData, isList: true })) {
                            //Store Api Response Field and display in Screen.
                            return { ...state, clickOnLinkListData, response: parseArray(clickOnLinkListData.Response), refreshing: false, row: addPages(clickOnLinkListData.TotalCount) };
                        }
                        else {
                            return { ...state, refreshing: false, response: [], row: [] };
                        }
                    }
                } catch (e) {
                    return { ...state, refreshing: false, response: [], row: [] };
                }
            }
        }
        return null;
    }

    componentWillUnmount() {
        // call action for clear Reducer value 
        this.props.clearAffiliateData()
    }

    async onResetPress() {

        // set initial value to state
        this.setState({
            FromDate: getCurrentDate(),
            ToDate: getCurrentDate(),
            selectedUser: R.strings.Please_Select,
            searchInput: '',
            selectedPage: 1,
            UserId: 0,
        })

        // Close Drawer user press on Complete button bcoz display flatlist item on Screen
        this.drawer.closeDrawer();

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Bind Request For get ClikOnLinkReport data
            let requestReport = {
                FromDate: this.state.FromDate,
                ToDate: this.state.ToDate,
                PageNo: 0,
                PageSize: this.state.PageSize
            }
            //Call Get clicked link report from API
            this.props.getClikOnLinkReport(requestReport);
            //----------
        } else {
            this.setState({ refreshing: false });
        }
    }

    // Api Call when press on complete button
    async  onCompletePress() {
        //Check All From Date Validation
        if (DateValidation(this.state.FromDate, this.state.ToDate, true)) {
            this.toast.Show(DateValidation(this.state.FromDate, this.state.ToDate, true));
            return;
        }
        else {
            // Close Drawer user press on Complete button bcoz display flatlist item on Screen
            this.drawer.closeDrawer();
            this.setState({ selectedPage: 1 })

            //Check NetWork is Available or not
            if (await isInternet()) {

                //Bind Request For get ClikOnLinkReport data
                let requestReport = {
                    FromDate: getCurrentDate(),
                    ToDate: getCurrentDate(),
                    UserId: this.state.UserId,
                    PageNo: 0,
                    PageSize: this.state.PageSize
                }
                //Call Get clicked link report from API
                this.props.getClikOnLinkReport(requestReport);
                //----------
            } else {
                this.setState({ refreshing: false });
            }
            //If Filter from Complete Button Click then empty searchInput
            this.setState({ searchInput: '' })
        }
    }

    //For Swipe to referesh Functionality
    async onRefresh() {
        this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Bind Request For get ClikOnLinkReport data
            let requestReport = {
                FromDate: getCurrentDate(),
                ToDate: getCurrentDate(),
                UserId: this.state.UserId,
                PageNo: this.state.selectedPage - 1,
                PageSize: this.state.PageSize
            }
            //Call Get clicked link report from API
            this.props.getClikOnLinkReport(requestReport);
        } else {
            this.setState({ refreshing: false });
        }
    }

    // Drawer Navigation
    navigationDrawer() {
        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* for display Toast */}
                <CommonToast ref={cmp => this.toast = cmp} styles={{ width: R.dimens.FilterDrawarWidth }} />

                {/* filterwidget for display fromdate, todate,userlist data */}
                <FilterWidget
                    FromDatePickerCall={(date) => this.setState({ FromDate: date })}
                    ToDatePickerCall={(date) => this.setState({ ToDate: date })}
                    FromDate={this.state.FromDate}
                    ToDate={this.state.ToDate}
                    onResetPress={this.onResetPress}
                    onCompletePress={this.onCompletePress}
                    comboPickerStyle={{ marginTop: 0, }}
                    pickers={[
                        {
                            title: R.strings.parentUser,
                            array: this.state.userList,
                            selectedValue: this.state.selectedUser,
                            onPickerSelect: (index, object) => { this.setState({ selectedUser: index, UserId: object.Id }) }
                        },
                    ]}
                />
            </SafeView>
        )
    }

    // Pagination Method Called When User Change Page  
    async onPageChange(pageNo) {

        //if user select other page number then and only then API Call else no need to call API
        if ((pageNo) !== (this.state.selectedPage)) {
            this.setState({ selectedPage: pageNo });

            //Check NetWork is Available or not
            if (await isInternet()) {

                //Bind Request For get ClikOnLinkReport data
                let requestReport = {
                    FromDate: getCurrentDate(),
                    ToDate: getCurrentDate(),
                    UserId: this.state.UserId,
                    PageNo: this.state.selectedPage - 1,
                    PageSize: this.state.PageSize
                }
                //Call Get clicked link report from API
                this.props.getClikOnLinkReport(requestReport)
            } else {
                this.setState({ refreshing: false });
            }
        }
    }

    render() {
        const { clickOnLinkLoading } = this.props.Listdata;
        let finalItems = this.state.response
        if (finalItems.length > 0) {
            finalItems = finalItems.filter(item =>
                (item.UserEmail.toLowerCase().includes(this.state.searchInput.toLowerCase())) ||
                (item.FirstName.toLowerCase().includes(this.state.searchInput.toLowerCase())) ||
                (item.LastName.toLowerCase().includes(this.state.searchInput.toLowerCase()))
            )
        }

        return (
            //apply filter for clickonlink report 
            <Drawer
                ref={cmpDrawer => this.drawer = cmpDrawer}
                drawerWidth={R.dimens.FilterDrawarWidth}
                drawerContent={this.navigationDrawer()}
                onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
                onDrawerClose={() => this.setState({ isDrawerOpen: false })}
                type={Drawer.types.Overlay}
                drawerPosition={Drawer.positions.Right}
                easingFunc={Easing.ease}>

                <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                    {/* To set status bar as per our theme */}
                    <CommonStatusBar />

                    {/* To set toolbar as per our theme */}
                    <CustomToolbar
                        title={R.strings.clickOnLinkReport}
                        isBack={true}
                        onBackPress={this.onBackPress}
                        nav={this.props.navigation}
                        rightIcon={R.images.FILTER}
                        searchable={true}
                        onSearchText={(text) => this.setState({ searchInput: text })}
                        onRightMenuPress={() => this.drawer.openDrawer()}
                    />
                    <View style={{ flex: 1, justifyContent: 'space-between' }}>
                        {/* To Check Response fetch or not if clickOnLinkLoading = true then display progress bar else display List*/}
                        {
                            (clickOnLinkLoading && !this.state.refreshing) ?
                                <ListLoader />
                                :
                                <View style={{ flex: 1 }}>
                                    {finalItems.length ?
                                        <View style={{ flex: 1 }}>
                                            <FlatList
                                                showsVerticalScrollIndicator={false}
                                                data={finalItems}
                                                renderItem={({ item, index }) =>
                                                    <ClickOnLinkItem
                                                        item={item}
                                                        index={index}
                                                        size={this.state.response.length}
                                                    />
                                                }
                                                keyExtractor={(item, index) => index.toString()}
                                                contentContainerStyle={contentContainerStyle(finalItems)}
                                                ListEmptyComponent={<ListEmptyComponent />}
                                                /* for refreshing data of flatlist */
                                                refreshControl={
                                                    <RefreshControl
                                                        colors={[R.colors.accent]}
                                                        progressBackgroundColor={R.colors.background}
                                                        refreshing={this.state.refreshing}
                                                        onRefresh={this.onRefresh}
                                                    />
                                                }
                                            />
                                        </View> : <ListEmptyComponent />}
                                </View>
                        }
                        <View>
                            {/* show pagination if response contains more data  */}
                            {finalItems.length > 0 &&
                                <PaginationWidget row={this.state.row} selectedPage={this.state.selectedPage} onPageChange={(item) => { this.onPageChange(item) }} />
                            }
                        </View>
                    </View>
                </SafeView>
            </Drawer>
        );
    }
}

// This Class is used for display record in list
class ClickOnLinkItem extends Component {

    constructor(props) {
        super(props);

    }

    shouldComponentUpdate(nextProps) {
        //Check If Old Props and New Props are Equal then Return False
        if (this.props.item === nextProps.item) {
            return false
        }
        return true
    }

    render() {
        let item = this.props.item;
        let { index, size, } = this.props;

        return (
            <AnimatableItem>
                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginLeft: R.dimens.widget_left_right_margin,
                    marginRight: R.dimens.widget_left_right_margin
                }}>
                    <CardView style={{
                        elevation: R.dimens.listCardElevation,
                        flex: 1,
                        borderRadius: 0,
                        flexDirection: 'column',
                        borderBottomLeftRadius: R.dimens.margin,
                        borderTopRightRadius: R.dimens.margin,
                    }}>

                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
                            {/* for show Image */}
                            <ImageTextButton
                                icon={R.images.IC_CLICK}
                                style={{ justifyContent: 'center', alignSelf: 'center', width: R.dimens.ButtonHeight, height: R.dimens.ButtonHeight, margin: 0, backgroundColor: R.colors.accent, borderRadius: R.dimens.ButtonHeight }}
                                iconStyle={{ width: R.dimens.drawerMenuIconWidthHeight, height: R.dimens.drawerMenuIconWidthHeight, tintColor: R.colors.white }}
                            />
                            {/* for Display usename,email and ipaddress */}
                            <View style={{ flex: 1, paddingLeft: R.dimens.margin, paddingRight: R.dimens.margin }}>
                                <Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold }}>{R.strings.affiliateLinkInvite}</Text>
                                <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.UserName} : <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>{item.FirstName ? item.FirstName + ' ' + item.LastName : '-'}</TextViewHML></TextViewHML>
                                <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.from} : <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>{item.UserEmail ? item.UserEmail : '-'}</TextViewHML></TextViewHML>
                                <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.to} {R.strings.IPAddress} : <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>{item.IpAddress ? item.IpAddress : '-'}</TextViewHML></TextViewHML>
                            </View>
                        </View>

                        {/* for show DateTime */}
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <ImageTextButton
                                style={{ margin: 0, paddingRight: R.dimens.LineHeight, }}
                                icon={R.images.IC_TIMER}
                                iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
                            />
                            <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, textAlign: 'center' }}>{item.ClickTime ? convertDateTime(item.ClickTime) : '-'}</TextViewHML>
                        </View>
                    </CardView>
                </View >
            </AnimatableItem>
        )
    }
}

function mapStateToProps(state) {
    return {
        // updated data for list data
        Listdata: state.AffiliateReducer,
        // update data for Userlist
        isAffiliateUser: state.AffiliateReducer.isAffiliateUser,
        affiliateUserData: state.AffiliateReducer.affiliateUserData,
        affiliateUserDataFetch: state.AffiliateReducer.affiliateUserDataFetch,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //perform clecked link report action
        getClikOnLinkReport: (Request) => dispatch(getClikOnLinkReport(Request)),
        //perform affiliate user list Action
        getAffiliateUserList: () => dispatch(getAffiliateUserList()),
        //Performs action for clear data from reducer
        clearAffiliateData: () => dispatch(clearAffiliateData()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ClickOnLinkReport)