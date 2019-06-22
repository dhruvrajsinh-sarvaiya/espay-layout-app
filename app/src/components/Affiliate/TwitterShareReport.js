import React, { Component } from 'react';
import { View, FlatList, RefreshControl, Easing, Text } from 'react-native';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../native_theme/components/CustomToolbar';
import { changeTheme, parseArray, getCurrentDate, convertDateTime, addPages, } from '../../controllers/CommonUtils';
import { isInternet, validateResponseNew, } from '../../validations/CommonValidation'
import { isCurrentScreen, addRouteToBackPress } from '../../components/Navigation';
import { connect } from 'react-redux';
import ListLoader from '../../native_theme/components/ListLoader';
import { ListEmptyComponent } from '../../native_theme/components/FlatListWidgets';
import { GetTwitterShareData, getAffiliateUserList, clearAffiliateData } from '../../actions/Affiliate/AffiliateAction';
import Drawer from 'react-native-drawer-menu';
import FilterWidget from '../../components/Widget/FilterWidget';
import { DateValidation } from '../../validations/DateValidation';
import CommonToast from '../../native_theme/components/CommonToast';
import PaginationWidget from '../../components/Widget/PaginationWidget';
import R from '../../native_theme/R';
import { AppConfig } from '../../controllers/AppConfig';
import CardView from '../../native_theme/components/CardView';
import ImageTextButton from '../../native_theme/components/ImageTextButton';
import TextViewHML from '../../native_theme/components/TextViewHML';
import { Fonts } from '../../controllers/Constants';
import AnimatableItem from '../../native_theme/components/AnimatableItem';
import SafeView from '../../native_theme/components/SafeView';

class TwitterShareReport extends Component {

    constructor(props) {
        super(props);

        //Define All initial State
        this.state = {
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

        // Bind All Method
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
            this.props.getAffiliateUserList();

            //Bind Request For get Twitter Share Report
            let requestTwitterReport = {
                FromDate: this.state.FromDate,
                ToDate: this.state.ToDate,
                PageNo: 0,
                PageSize: this.state.PageSize
            }
            //Call Api for get TwitterShareReport
            this.props.GetTwitterShareData(requestTwitterReport)
        } else {
            this.setState({ refreshing: false });
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        return isCurrentScreen(nextProps);
    };

    //For Swipe to referesh Functionality
    onRefresh = async () => {
        this.setState({ refreshing: true });

        // Check NetWork is Available or not
        if (await isInternet()) {

            //Bind Request For get Twitter Share Report
            let requestTwitterReport = {
                FromDate: this.state.FromDate,
                ToDate: this.state.ToDate,
                UserId: this.state.UserId,
                PageNo: this.state.selectedPage - 1,
                PageSize: this.state.PageSize
            }
            //Call Api for get TwitterShareReport
            this.props.GetTwitterShareData(requestTwitterReport)
            //----------
        } else {
            this.setState({ refreshing: false });
        }
    }

    //call items
    onPageChange = async (pNo) => {
        if ((pNo) !== (this.state.selectedPage)) {
            this.setState({ selectedPage: pNo });

            //Check NetWork is Available or not
            if (await isInternet()) {

                //Bind Request For get Twitter Share Report
                let requestTwitterReport = {
                    FromDate: this.state.FromDate,
                    ToDate: this.state.ToDate,
                    UserId: this.state.UserId,
                    PageNo: this.state.selectedPage - 1,
                    PageSize: this.state.PageSize
                }
                //Call Api for get TwitterShareReport
                this.props.GetTwitterShareData(requestTwitterReport)
            } else {
                this.setState({ refreshing: false });
            }
        }
    }

    // Drawer Navigation
    navigationDrawer() {
        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* for display Toast */}
                <CommonToast ref={cmp => this.toast = cmp} styles={{ width: R.dimens.FilterDrawarWidth }} />

                {/* filterwidget for display fromdate, todate,Parentuser data */}
                <FilterWidget
                    FromDatePickerCall={(date) => this.setState({ FromDate: date })}
                    FromDate={this.state.FromDate}
                    ToDatePickerCall={(date) => this.setState({ ToDate: date })}
                    ToDate={this.state.ToDate}
                    onResetPress={this.onResetPress}
                    onCompletePress={this.onCompletePress}
                    firstPicker={{
                        title: R.strings.parentUser,
                        array: this.state.userList,
                        selectedValue: this.state.selectedUser,
                        onPickerSelect: (index, object) => { this.setState({ selectedUser: index, UserId: object.Id }) }
                    }}
                />
            </SafeView>
        )
    }

    onResetPress = async () => {
        this.drawer.closeDrawer();

        // setstate data as initial value
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

            //Bind Request For get Twitter Share Report
            let requestTwitterReport = {
                FromDate: getCurrentDate(),
                ToDate: getCurrentDate(),
                PageNo: 0,
                PageSize: this.state.PageSize
            }
            //Call Api for get TwitterShareReport
            this.props.GetTwitterShareData(requestTwitterReport)
        } else {
            this.setState({ refreshing: false });
        }
    }

    // if press on complete button then check validation and api calling
    onCompletePress = async () => {
        if (DateValidation(this.state.FromDate, this.state.ToDate)) {
            this.toast.Show(DateValidation(this.state.FromDate, this.state.ToDate));
            return;
        }
        else {
            this.drawer.closeDrawer();
            this.setState({ selectedPage: 1 })

            //Check NetWork is Available or not
            if (await isInternet()) {

                //Bind Request For get Twitter Share Report
                let requestTwitterReport = {
                    FromDate: this.state.FromDate,
                    ToDate: this.state.ToDate,
                    UserId: this.state.UserId,
                    PageNo: 0,
                    PageSize: this.state.PageSize
                }
                //Call Api for get TwitterShareReport
                this.props.GetTwitterShareData(requestTwitterReport)
            }
            else {
                this.setState({ refreshing: false });
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
        if (TwitterShareReport.oldProps !== props) {
            TwitterShareReport.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {

            //Get All Updated Field of Particular actions
            const { twitterShareData, twitterShareDataFetch, affiliateUserDataFetch, affiliateUserData } = props;

            //To Check affiliateUser Data Fetch or Not
            if (!affiliateUserDataFetch) {
                try {
                    if (validateResponseNew({ response: affiliateUserData, isList: true })) {
                        //Get array from response
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
                        return { ...state, userList: [], selectedUser: R.strings.Please_Select, UserId: 0 };
                    }
                } catch (e) {
                    return { ...state, userList: [], selectedUser: R.strings.Please_Select, UserId: 0 };
                }
            }

            //To Check Twitter Share Report Data Fetch or Not
            if (!twitterShareDataFetch) {
                try {
                    if (validateResponseNew({ response: twitterShareData, isList: true })) {
                        // handle responce and parse to araay
                        return { ...state, twitterShareData, data: parseArray(twitterShareData.Response), refreshing: false, row: addPages(twitterShareData.TotalCount) };
                    }
                    else {
                        return { ...state, refreshing: false, data: [], row: [] };
                    }
                } catch (e) {
                    return { ...state, refreshing: false, data: [], row: [] };
                }
            }

        }
        return null;
    }

    componentWillUnmount() {
        // call action for clear Reducer value 
        this.props.clearAffiliateData()
    }

    render() {

        // loading bit for display listloader
        const { isTwitterDataFetch } = this.props;

        let list = this.state.data;

        //for final items from search input (validate on UserEmail , FirstName and LastName)
        //default searchInput is empty so it will display all records.
        let finalItems = list.filter(item =>
            (item.UserEmail.toLowerCase().includes(this.state.search.toLowerCase())) ||
            (item.FirstName.toLowerCase().includes(this.state.search.toLowerCase())) ||
            (item.LastName.toLowerCase().includes(this.state.search.toLowerCase()))
        );

        return (
            //apply filter for Twitter report 
            <Drawer
                ref={cmp => this.drawer = cmp}
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
                        {/* To Check Response fetch or not if isTwitterDataFetch = true then display progress bar else display List*/}
                        {
                            isTwitterDataFetch && !this.state.refreshing ?
                                <ListLoader />
                                :
                                <View style={{ flex: 1 }}>
                                    {finalItems.length > 0 ?
                                        <View style={{ flex: 1 }}>
                                            <FlatList
                                                data={finalItems}
                                                showsVerticalScrollIndicator={false}
                                                renderItem={({ item, index }) =>
                                                    <FlatlistItem
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
                                                        colors={[R.colors.accent]}
                                                        progressBackgroundColor={R.colors.background}
                                                        refreshing={this.state.refreshing}
                                                        onRefresh={this.onRefresh}
                                                    />}
                                            />
                                        </View>
                                        :
                                        <ListEmptyComponent />}
                                </View>
                        }

                        {/* to show Pagination */}
                        <View>
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
class FlatlistItem extends Component {

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

                        {/* for show twitter icon and username and Address */}
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
                            <ImageTextButton
                                icon={R.images.IC_TWITTER}
                                style={{ justifyContent: 'center', alignSelf: 'center', width: R.dimens.ButtonHeight, height: R.dimens.ButtonHeight, margin: 0, backgroundColor: R.colors.accent, borderRadius: R.dimens.ButtonHeight }}
                                iconStyle={{ width: R.dimens.drawerMenuIconWidthHeight, height: R.dimens.drawerMenuIconWidthHeight, tintColor: R.colors.white }}
                            />
                            <View style={{ flex: 1, paddingLeft: R.dimens.margin, paddingRight: R.dimens.margin }}>
                                <Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold }}>{R.strings.twitterLinkInvite}</Text>
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
        // Updated Data for Twitter report
        isTwitterDataFetch: state.AffiliateReducer.isTwitterDataFetch,
        twitterShareData: state.AffiliateReducer.twitterShareData,
        twitterShareDataFetch: state.AffiliateReducer.twitterShareDataFetch,

        // Updated Data for affiliate user
        isAffiliateUser: state.AffiliateReducer.isAffiliateUser,
        affiliateUserData: state.AffiliateReducer.affiliateUserData,
        affiliateUserDataFetch: state.AffiliateReducer.affiliateUserDataFetch,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        // call action for getting TwitterShareReport
        GetTwitterShareData: (requestTwitterReport) => dispatch(GetTwitterShareData(requestTwitterReport)),
        //perform affiliate user list Action
        getAffiliateUserList: () => dispatch(getAffiliateUserList()),
        //Perform action for clear data from reducer
        clearAffiliateData: () => dispatch(clearAffiliateData()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TwitterShareReport)