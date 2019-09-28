// AffiliateFacebookShareReportScreen.js
import React, { Component } from 'react';
import { View, FlatList, RefreshControl, Easing, Text } from 'react-native';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { changeTheme, parseArray, getCurrentDate, addPages, convertDateTime } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew, } from '../../../validations/CommonValidation'
import { isCurrentScreen, addRouteToBackPress } from '../../../components/Navigation';
import { connect } from 'react-redux';
import SafeView from '../../../native_theme/components/SafeView';
import ListLoader from '../../../native_theme/components/ListLoader';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import Drawer from 'react-native-drawer-menu';
import FilterWidget from '../../../components/widget/FilterWidget';
import { DateValidation } from '../../../validations/DateValidation';
import R from '../../../native_theme/R';
import { AppConfig } from '../../../controllers/AppConfig';
import CardView from '../../../native_theme/components/CardView';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import { Fonts } from '../../../controllers/Constants';
import PaginationWidget from '../../../components/widget/PaginationWidget';
import { affiliateShareOnFacebookReport, affiliateShareOnFacebookReportClear } from '../../../actions/account/AffiliateFacebookShareReportAction';
import { affiliateUserData } from '../../../actions/PairListAction';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';

class AffiliateFacebookShareReportScreen extends Component {

    constructor(props) {
        super(props);

        //Define All initial State
        this.state = {
            // for pagination
            row: [], selectedPage: 1,
            data: [],//for store data from the responce
            search: '',//for search value for data
            refreshing: false,//for refresh data
            FromDate: getCurrentDate(),//for display Current Date
            ToDate: getCurrentDate(),//for display Current Date
            PageSize: AppConfig.pageSize, userList: [],
            selectedUser: R.strings.Please_Select,
            UserId: 0, isFirstTime: true,
            isDrawerOpen: false, // First Time Drawer is Closed
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

            //Bind Request For get FacebookReport data
            let requestFacebookReport = {
                FromDate: this.state.FromDate, ToDate: this.state.ToDate,
                PageNo: 0,
                PageSize: this.state.PageSize
            }

            //Call Get Facebook Share report from API
            this.props.affiliateShareOnFacebookReport(requestFacebookReport)
        } else {
            this.setState({ refreshing: false });
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

            //Bind Request For get FacebookReport data
            let requestFacebookReport = {
                FromDate: this.state.FromDate,
                UserId: this.state.UserId,
                ToDate: this.state.ToDate,
                PageSize: this.state.PageSize,
                PageNo: this.state.selectedPage - 1,
            }

            //Call Get Facebook Share report from API
            this.props.affiliateShareOnFacebookReport(requestFacebookReport)
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

                //Bind Request For get FacebookReport data
                let requestFacebookReport = {
                    FromDate: this.state.FromDate,
                    ToDate: this.state.ToDate,
                    UserId: this.state.UserId,
                    PageNo: this.state.selectedPage - 1,
                    PageSize: this.state.PageSize
                }

                //Call Get Facebook Share report from API
                this.props.affiliateShareOnFacebookReport(requestFacebookReport)
            } else {
                this.setState({ refreshing: false });
            }
        }
    }

    // Drawer Navigation
    navigationDrawer() {
        return (
            // filterwidget for display fromdate, todate,parentuser data
            <FilterWidget
                FromDatePickerCall={(date) => this.setState({ FromDate: date })}
                ToDate={this.state.ToDate}
                ToDatePickerCall={(date) => this.setState({ ToDate: date })}
                FromDate={this.state.FromDate}
                toastRef={component => this.toast = component}
                onResetPress={this.onResetPress}
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
            FromDate: getCurrentDate(), ToDate: getCurrentDate(),
            selectedUser: R.strings.Please_Select,
            selectedPage: 1,
            search: '', UserId: 0,
        })

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Bind Request For get FacebookReport data
            let requestFacebookReport = {
                FromDate: getCurrentDate(),
                ToDate: getCurrentDate(),
                PageNo: 0,
                PageSize: this.state.PageSize
            }

            //Call Get Facebook Share report from API
            this.props.affiliateShareOnFacebookReport(requestFacebookReport)
        } else {
            this.setState({ refreshing: false });
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
                //Bind Request For get FacebookReport data
                let requestFacebookReport = {
                    FromDate: this.state.FromDate,
                    ToDate: this.state.ToDate,
                    UserId: this.state.UserId,
                    PageNo: 0,
                    PageSize: this.state.PageSize
                }

                //Call Get Facebook Share report from API
                this.props.affiliateShareOnFacebookReport(requestFacebookReport)
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
        if (AffiliateFacebookShareReportScreen.oldProps !== props) {
            AffiliateFacebookShareReportScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //Get All Updated Field of Particular actions
            const { facebookShareData, facebookShareDataFetch, affiliateUserDataFetch, affiliateAllUserData } = props;

            //To Check affiliateUser Data Fetch or Not
            if (!affiliateUserDataFetch) {
                try {
                    if (validateResponseNew({ isList: true, response: affiliateAllUserData, })) {
                        //Store Api Response Field and display in Screen.
                        var newRes = parseArray(affiliateAllUserData.Response);
                        newRes.map((item, index) => {
                            newRes[index].Id = newRes[index].Id
                            newRes[index].value = newRes[index].UserName
                        })
                        //----
                        let res = [{ Id: 0, value: R.strings.Please_Select, }, ...newRes]

                        return { ...state, userList: res };
                    }
                    else {
                        return { ...state, userList: [], selectedUser: R.strings.Please_Select, UserId: 0 };
                    }
                } catch (e) {
                    return { ...state, userList: [], selectedUser: R.strings.Please_Select, UserId: 0 };
                }
            }

            //To Check facebookShare Data Fetch or Not
            if (!facebookShareDataFetch) {
                try {
                    if (validateResponseNew({ response: facebookShareData, isList: true })) {
                        //Store Api Response Field and display in Screen.
                        return { ...state, facebookShareData, data: parseArray(facebookShareData.Response), refreshing: false, row: addPages(facebookShareData.TotalCount) };
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
        this.props.affiliateShareOnFacebookReportClear()
    }

    render() {
        // loading bit for display listloader
        const { isFacebookDataFetch } = this.props;

        let list = this.state.data;

        //for final items from search input (validate on UserEmail , FirstName and LastName)
        let finalItems = list.filter(item =>
            (item.UserEmail.toLowerCase().includes(this.state.search.toLowerCase())) ||
            (item.FirstName.toLowerCase().includes(this.state.search.toLowerCase())) ||
            (item.LastName.toLowerCase().includes(this.state.search.toLowerCase()))
        );

        return (
            // for apply filter for facebookSharereport
            <Drawer
                drawerWidth={R.dimens.FilterDrawarWidth} drawerContent={this.navigationDrawer()}
                onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
                onDrawerClose={() => this.setState({ isDrawerOpen: false })} type={Drawer.types.Overlay}
                ref={cmp => this.drawer = cmp}
                drawerPosition={Drawer.positions.Right}
                easingFunc={Easing.ease}>

                <SafeView style={{ backgroundColor: R.colors.background,  flex: 1, }}>

                    {/* To set status bar as per our theme */}
                    <CommonStatusBar />

                    {/* To set toolbar as per our theme */}
                    <CustomToolbar
                        onBackPress={this.onBackPress} isBack={true}
                        title={R.strings.facebookShareReport}
                        nav={this.props.navigation}
                        searchable={true}
                        rightIcon={R.images.FILTER}
                        onSearchText={(input) => this.setState({ search: input })}
                        onRightMenuPress={() => this.drawer.openDrawer()}
                    />
                    <View style={{ flex: 1, justifyContent: 'space-between' }}>
                        {/* To Check Response fetch or not if isFacebookDataFetch = true then display progress bar else display List*/}
                        {
                            isFacebookDataFetch && !this.state.refreshing ?
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
                                                    <AffiliateFBShareReportItem
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
class AffiliateFBShareReportItem extends Component {

    constructor(props) {
        super(props)
    }

    shouldComponentUpdate(nextProps) {
        //Check If Old Props and New Props are Equal then Return False
        if (this.props.item === nextProps.item) {
            return false
        }
        return true
    }

    render() {

        let { index, size, } = this.props;  let item = this.props.item;

        return (
            // Flatlist item animation
            <AnimatableItem>
                <View style={{
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginLeft: R.dimens.widget_left_right_margin, marginRight: R.dimens.widget_left_right_margin,
                    flex: 1,
                }}>
                    <CardView style={{
                        borderRadius: 0,
                        elevation: R.dimens.listCardElevation,
                        borderBottomLeftRadius: R.dimens.margin, borderTopRightRadius: R.dimens.margin,
                        flex: 1,
                    }}>

                        <View style={{ flexDirection: 'row', /* justifyContent: 'center', alignItems: 'center', */ }}>
                            {/* for display facebook icon  */}
                            <View>
                                <ImageTextButton
                                    style={{  width: R.dimens.ButtonHeight,alignSelf: 'center', height: R.dimens.ButtonHeight, margin: 0, justifyContent: 'center', backgroundColor: R.colors.accent, borderRadius: R.dimens.ButtonHeight }}
                                    icon={R.images.IC_FACEBOOK_LOGO}
                                    iconStyle={{ width: R.dimens.drawerMenuIconWidthHeight, height: R.dimens.drawerMenuIconWidthHeight, tintColor: R.colors.white }}
                                />
                            </View>

                            {/* for display username and email and ip */}
                            <View style={{ flex: 1, paddingLeft: R.dimens.margin, paddingRight: R.dimens.margin }}>
                                <Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold }}>{R.strings.facebookLinkInvite}</Text>
                                <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.UserName} : <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>{item.FirstName ? item.FirstName + ' ' + item.LastName : '-'}</TextViewHML></TextViewHML>
                                <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.from} : <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>{item.UserEmail ? item.UserEmail : '-'}</TextViewHML></TextViewHML>
                                <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.to} {R.strings.IPAddress} : <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>{item.IpAddress ? item.IpAddress : '-'}</TextViewHML></TextViewHML>
                            </View>
                        </View>

                        {/* for show DateTime*/}
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <ImageTextButton
                                style={{  paddingRight: R.dimens.LineHeight, margin: 0,}}
                                icon={R.images.IC_TIMER}
                                iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
                            />
                            <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, textAlign: 'center' }}>{item.ClickTime ? convertDateTime(item.ClickTime) : '-'}</TextViewHML>
                        </View>
                    </CardView>
                </View>
            </AnimatableItem>
        )
    }
}

function mapStateToProps(state) {
    return {
        // Updated Data for FacebookShare
        isFacebookDataFetch: state.AffiliateFacebookShareReportReducer.isFacebookReportFetch,
        facebookShareData: state.AffiliateFacebookShareReportReducer.facebookReportData,
        facebookShareDataFetch: state.AffiliateFacebookShareReportReducer.facebookReportDataFetch,

        // updated data for userdata
        isAffiliateUser: state.AffiliateFacebookShareReportReducer.isAffiliateUser,
        affiliateAllUserData: state.AffiliateFacebookShareReportReducer.affiliateUserData,
        affiliateUserDataFetch: state.AffiliateFacebookShareReportReducer.affiliateUserDataFetch,

    }
}

function mapDispatchToProps(dispatch) {
    return {
        // // perform facebook Share Report Action
        affiliateShareOnFacebookReport: (requestFacebookReport) => dispatch(affiliateShareOnFacebookReport(requestFacebookReport)),
        // perform action for affiliate userlist
        affiliateUserData: () => dispatch(affiliateUserData()),
        // perform action to clear reducer data
        affiliateShareOnFacebookReportClear: () => dispatch(affiliateShareOnFacebookReportClear()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AffiliateFacebookShareReportScreen)