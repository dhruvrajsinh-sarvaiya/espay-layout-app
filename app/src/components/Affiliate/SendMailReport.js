import React, { Component } from 'react';
import { View, FlatList, RefreshControl, Easing, Text } from 'react-native';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../native_theme/components/CustomToolbar';
import { changeTheme, parseArray, getCurrentDate, addPages, convertDateTime } from '../../controllers/CommonUtils';
import { isInternet, validateResponseNew, } from '../../validations/CommonValidation'
import { isCurrentScreen, addRouteToBackPress } from '../../components/Navigation';
import { connect } from 'react-redux';
import ListLoader from '../../native_theme/components/ListLoader';
import { ListEmptyComponent } from '../../native_theme/components/FlatListWidgets';
import { GetEmailSendData, getAffiliateUserList, clearAffiliateData } from '../../actions/Affiliate/AffiliateAction';
import Drawer from 'react-native-drawer-menu';
import FilterWidget from '../../components/Widget/FilterWidget';
import { DateValidation } from '../../validations/DateValidation';
import CommonToast from '../../native_theme/components/CommonToast';
import PaginationWidget from '../../components/Widget/PaginationWidget';
import R from '../../native_theme/R';
import { AppConfig } from '../../controllers/AppConfig';
import ImageTextButton from '../../native_theme/components/ImageTextButton';
import CardView from '../../native_theme/components/CardView';
import TextViewHML from '../../native_theme/components/TextViewHML';
import { Fonts } from '../../controllers/Constants';
import AnimatableItem from '../../native_theme/components/AnimatableItem';
import SafeView from '../../native_theme/components/SafeView';

class SendMailReport extends Component {

    constructor(props) {
        super(props);

        // create reference
        this.drawer = React.createRef();
        this.toast = React.createRef();

        //Define All initial State
        this.state = {
            // for pagination
            data: [],//for store data from the responce
            selectedPage: 1,
            row: [],
            refreshing: false,//for refresh data
            search: '',//for search value for data
            isDrawerOpen: false, // First Time Drawer is Closed
            isFirstTime: true,
            ToDate: getCurrentDate(),//for display Current Date
            FromDate: getCurrentDate(),//for display Current Date
            userList: [],
            PageSize: AppConfig.pageSize,
            UserId: 0,
            selectedUser: R.strings.Please_Select,
        }

        // bind all Method
        this.onBackPress = this.onBackPress.bind(this);
        this.props.navigation.setParams({ onBackPress: this.onBackPress });

        //Add Current Screen to Manual Handling BackPress Events
        addRouteToBackPress(props);
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not.
        if (await isInternet()) {

            // call api for get AffiliateUserList data
            this.props.getAffiliateUserList();

            // Bind Request For get EmailReport data
            let requestEmailReport = {
                FromDate: this.state.FromDate,
                ToDate: this.state.ToDate,
                PageNo: 0,
                PageSize: this.state.PageSize
            }
            //Call Get EmailSendReport 
            this.props.GetEmailSendData(requestEmailReport)
        } else {
            this.setState({ refreshing: false });
        }
    }

    shouldComponentUpdate = (nextProps, _nextState) => {
        return isCurrentScreen(nextProps);
    };

    //For Swipe to referesh Functionality
    onRefresh = async () => {
        this.setState({ refreshing: true });

        // Check NetWork is Available or not
        if (await isInternet()) {

            //Bind Request For get EmailReport data
            let requestEmailReport = {
                FromDate: this.state.FromDate,
                ToDate: this.state.ToDate,
                UserId: this.state.UserId,
                PageNo: this.state.selectedPage - 1,
                PageSize: this.state.PageSize
            }
            //Call Get EmailSendReport 
            this.props.GetEmailSendData(requestEmailReport)
            //----------
        } else {
            this.setState({ refreshing: false });
        }
    }
    //-----------

    //call items
    onPageChange = async (pNo) => {
        if ((pNo) !== (this.state.selectedPage)) {
            this.setState({ selectedPage: pNo });

            //Check NetWork is Available or not
            if (await isInternet()) {

                //Bind Request For get EmailReport data
                let requestEmailReport = {
                    FromDate: this.state.FromDate,
                    ToDate: this.state.ToDate,
                    UserId: this.state.UserId,
                    PageNo: this.state.selectedPage - 1,
                    PageSize: this.state.PageSize
                }
                //Call Get EmailSendReport 
                this.props.GetEmailSendData(requestEmailReport)
            }
            else {
                this.setState({ refreshing: false });
            }
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

    // Drawer Navigation
    navigationDrawer() {
        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* for display Toast */}
                <CommonToast
                    ref={cmp => this.toast = cmp}
                    styles={{ width: R.dimens.FilterDrawarWidth, }} />

                {/* filter on fromdate,todate and parent user */}
                <FilterWidget
                    FromDatePickerCall={(date) => this.setState({ FromDate: date })}
                    FromDate={this.state.FromDate}
                    ToDatePickerCall={(date) => this.setState({ ToDate: date })}
                    ToDate={this.state.ToDate}
                    onCompletePress={this.onCompletePress}
                    firstPicker={{
                        title: R.strings.parentUser,
                        selectedValue: this.state.selectedUser,
                        array: this.state.userList,
                        onPickerSelect: (index, object) => { this.setState({ selectedUser: index, UserId: object.Id }) }
                    }}
                    onResetPress={this.onResetPress}
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

            //Bind Request For get EmailReport data
            let requestEmailReport = {
                FromDate: getCurrentDate(),
                ToDate: getCurrentDate(),
                PageNo: 0,
                PageSize: this.state.PageSize
            }
            //Call Get EmailSendReport 
            this.props.GetEmailSendData(requestEmailReport)
            //----------
        } else {
            this.setState({ refreshing: false });
        }
    }

    // if press on complete button then check validation and api calling
    onCompletePress = async () => {

        // check date validation
        if (DateValidation(this.state.FromDate, this.state.ToDate)) {
            this.toast.Show(DateValidation(this.state.FromDate, this.state.ToDate));
            return;
        } else {
            this.drawer.closeDrawer();

            this.setState({ selectedPage: 1 })

            //Check NetWork is Available or not
            if (await isInternet()) {

                //Bind Request For get EmailReport data
                let requestEmailReport = {
                    FromDate: this.state.FromDate,
                    ToDate: this.state.ToDate,
                    UserId: this.state.UserId,
                    PageNo: 0,
                    PageSize: this.state.PageSize
                }
                //Call Get EmailSendReport 
                this.props.GetEmailSendData(requestEmailReport)
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
        if (SendMailReport.oldProps !== props) {
            SendMailReport.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {

            //Get All Updated Field of Particular actions
            const { sendEmailData, sendEmailDataFetch, affiliateUserDataFetch, affiliateUserData } = props;

            //To Check affiliateUser Data Fetch or Not
            if (!affiliateUserDataFetch) {
                try {
                    if (validateResponseNew({ response: affiliateUserData, isList: true })) {
                        //Store Api Response Field and display in Screen.
                        var userDataForMailReport = parseArray(affiliateUserData.Response);
                        userDataForMailReport.map((item, index) => {
                            userDataForMailReport[index].value = userDataForMailReport[index].UserName
                            userDataForMailReport[index].Id = userDataForMailReport[index].Id
                        })
                        //----
                        let res = [{ value: R.strings.Please_Select, Id: 0 }, ...userDataForMailReport]

                        return { ...state, userList: res };
                    }
                    else {
                        return { ...state, userList: [], selectedUser: R.strings.Please_Select, UserId: 0 };
                    }
                } catch (e) {
                    return { ...state, userList: [], selectedUser: R.strings.Please_Select, UserId: 0 };
                }
            }

            //To Check sendEmail Data Fetch or Not
            if (!sendEmailDataFetch) {
                try {
                    if (validateResponseNew({ response: sendEmailData, isList: true })) {
                        //Store Api Response Field and display in Screen.
                        return { ...state, data: parseArray(sendEmailData.Response), refreshing: false, row: addPages(sendEmailData.TotalCount) };
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
        const { isEmailFetch } = this.props;

        let list = this.state.data;

        // for search record using Email,firstname lastname
        //for final items from search input (validate on Email , firstname and lastname)
        //default searchInput is empty so it will display all records.
        let finalItems = list.filter(mailReportItem =>
            (mailReportItem.Email.toLowerCase().includes(this.state.search.toLowerCase())) ||
            (mailReportItem.FirstName.toLowerCase().includes(this.state.search.toLowerCase())) ||
            (mailReportItem.LastName.toLowerCase().includes(this.state.search.toLowerCase()))
        );

        return (
            // for apply filter for sendmail report
            <Drawer
                ref={cmp => this.drawer = cmp}
                drawerContent={this.navigationDrawer()}
                drawerWidth={R.dimens.FilterDrawarWidth}
                onDrawerClose={() => this.setState({ isDrawerOpen: false })}
                onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
                drawerPosition={Drawer.positions.Right}
                easingFunc={Easing.ease}
                type={Drawer.types.Overlay}
            >

                <SafeView style={{ backgroundColor: R.colors.background, flex: 1 }}>

                    {/* To set status bar as per our theme */}
                    <CommonStatusBar />

                    {/* To set toolbar as per our theme */}
                    <CustomToolbar
                        title={R.strings.sendMailReport}
                        isBack={true}
                        onBackPress={this.onBackPress}
                        nav={this.props.navigation}
                        searchable={true}
                        onSearchText={(input) => this.setState({ search: input })}
                        rightIcon={R.images.FILTER}
                        onRightMenuPress={() => this.drawer.openDrawer()}
                    />

                    <View style={{ flex: 1, justifyContent: 'space-between' }}>
                        {/* To Check Response fetch or not if isEmailFetch = true then display progress bar else display List*/}
                        {
                            isEmailFetch && !this.state.refreshing ?
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
                                                    <MailReportList
                                                        mailReportItem={item}
                                                        index={index}
                                                        size={this.state.data.length}
                                                    />
                                                }
                                                contentContainerStyle={[
                                                    { flexGrow: 1 },
                                                    this.state.data.length ? null : { justifyContent: 'center' }
                                                ]}
                                                keyExtractor={(item, index) => index.toString()}
                                                /* for refreshing data of flatlist */
                                                refreshControl={
                                                    <RefreshControl
                                                        colors={[R.colors.accent]}
                                                        refreshing={this.state.refreshing}
                                                        onRefresh={this.onRefresh}
                                                        progressBackgroundColor={R.colors.background}
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
class MailReportList extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        //Check If Old Props and New Props are Equal then Return False
        if (this.props.mailReportItem === nextProps.mailReportItem) {
            return false
        }
        return true
    }

    render() {

        let mailReportItem = this.props.mailReportItem;
        let { index, size, } = this.props;

        return (
            <AnimatableItem>
                <View style={{
                    flex: 1,
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    flexDirection: 'column',
                    marginLeft: R.dimens.widget_left_right_margin,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginRight: R.dimens.widget_left_right_margin,
                }}>
                    <CardView style={{
                        flex: 1, flexDirection: 'column',
                        elevation: R.dimens.listCardElevation,
                        borderRadius: 0,
                        borderBottomLeftRadius: R.dimens.margin,
                        borderTopRightRadius: R.dimens.margin,
                    }}>

                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
                            {/* for display Email icon  */}
                            <ImageTextButton
                                icon={R.images.IC_EMAIL_FILLED}
                                style={{ justifyContent: 'center', alignSelf: 'center', width: R.dimens.ButtonHeight, height: R.dimens.ButtonHeight, margin: 0, backgroundColor: R.colors.accent, borderRadius: R.dimens.ButtonHeight }}
                                iconStyle={{ width: R.dimens.drawerMenuIconWidthHeight, height: R.dimens.drawerMenuIconWidthHeight, tintColor: R.colors.white }}
                            />
                            {/* for display username and email and ip */}
                            <View style={{ flex: 1, paddingLeft: R.dimens.margin, paddingRight: R.dimens.margin }}>
                                <Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold }}>{R.strings.emailLinkInvite}</Text>
                                <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.UserName} : <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>{mailReportItem.FirstName ? mailReportItem.FirstName + ' ' + mailReportItem.LastName : '-'}</TextViewHML></TextViewHML>
                                <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.from} : <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>{mailReportItem.UserEmail ? mailReportItem.UserEmail : '-'}</TextViewHML></TextViewHML>
                                <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.to} : <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>{mailReportItem.Email ? mailReportItem.Email : '-'}</TextViewHML></TextViewHML>
                            </View>
                        </View>

                        {/* for show time and status */}
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <ImageTextButton
                                style={{ margin: 0, paddingRight: R.dimens.LineHeight, }}
                                icon={R.images.IC_TIMER}
                                iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
                            />
                            <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, textAlign: 'center' }}>{mailReportItem.SentTime ? convertDateTime(mailReportItem.SentTime) : '-'}</TextViewHML>
                        </View>
                    </CardView>
                </View >
            </AnimatableItem>
        )
    }
}

function mapStateToProps(state) {
    return {
        // Updated Data for sendmail
        isEmailFetch: state.AffiliateReducer.isEmailFetch,
        sendEmailData: state.AffiliateReducer.sendEmailData,
        sendEmailDataFetch: state.AffiliateReducer.sendEmailDataFetch,

        // updated data for userdata
        isAffiliateUser: state.AffiliateReducer.isAffiliateUser,
        affiliateUserData: state.AffiliateReducer.affiliateUserData,
        affiliateUserDataFetch: state.AffiliateReducer.affiliateUserDataFetch,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        // perform Action for emailReport
        GetEmailSendData: (requestEmailReport) => dispatch(GetEmailSendData(requestEmailReport)),
        // perform action for affiliate userlist
        getAffiliateUserList: () => dispatch(getAffiliateUserList()),
        // perform Action for clear data from reducer
        clearAffiliateData: () => dispatch(clearAffiliateData()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SendMailReport)