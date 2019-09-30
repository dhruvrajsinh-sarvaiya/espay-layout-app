import React, { Component } from 'react';
import { View, Text, FlatList, RefreshControl, Easing, Image } from 'react-native';
import { connect } from 'react-redux';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { changeTheme, convertDate, addPages, convertTime } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../Navigation';
import { isInternet, validateResponseNew, isEmpty } from '../../../validations/CommonValidation';
import ListLoader from '../../../native_theme/components/ListLoader';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import R from '../../../native_theme/R';
import Drawer from 'react-native-drawer-menu';
import PaginationWidget from '../../widget/PaginationWidget';
import StatusChip from '../../widget/StatusChip';
import CardView from '../../../native_theme/components/CardView';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import { Fonts } from '../../../controllers/Constants';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import FilterWidget from '../../widget/FilterWidget';
import { clearAffiliateSignUpReport, affiliateSignupReport } from '../../../actions/account/AffiliateSignUpReeportAction';
import { AppConfig } from '../../../controllers/AppConfig';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import SafeView from '../../../native_theme/components/SafeView';

class AffliateSignUpReportListScreen extends Component {
    constructor(props) {
        super(props);

        this.drawer = React.createRef();
        //Define initial state
        this.state = {
            searchInput: '',
            refreshing: false,
            response: [],
            FromDate: '',
            ToDate: '',
            isFirstTime: true,
            isDrawerOpen: false, // First Time Drawer is Closed
            isFilter: false,
            AffliateReportData: null,
            selectedPage: 1,
            row: [],
            PageSize: AppConfig.pageSize,
        };

        //Bind all Methods
        this.onBackPress = this.onBackPress.bind(this);
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check intenet connectivity
        if (await isInternet()) {

            //Bind request affliate sign up  report list api
            let request = {
                PageNo: 0,
                PageSize: this.state.PageSize,
                FromDate: this.state.FromDate,
                ToDate: this.state.ToDate,
            }

            //Call affiliateSignupReport List api  
            this.props.affiliateSignupReport(request)
        }
    }

    // Pagination Method Called When User Change Page  
    onPageChange = async (pageNo) => {

        //if user select other page number then and only then API Call else no need to call API
        if ((pageNo) !== (this.state.selectedPage)) {
            this.setState({ selectedPage: pageNo });

            //Check NetWork is Available or not
            if (await isInternet()) {
                //Bind request 
                this.Request = {
                    PageNo: pageNo - 1,
                    PageSize: this.state.PageSize,
                    FromDate: this.state.FromDate,
                    ToDate: this.state.ToDate,
                }

                //call affliate Scheme list Api 
                this.props.affiliateSignupReport(this.Request)
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
            //goging back screen
            this.props.navigation.goBack();
        }
    }

    componentWillUnmount() {
        //Clear data on Backpress
        this.props.clearAffiliateSignUpReport();
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps);
    };

    /* Set state to original value */
    onResetPress = async () => {
        this.setState({
            searchInput: '', selectedPage: 1,
            FromDate: '', ToDate: '', isFilter: false
        })

        this.drawer.closeDrawer();

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Bind request Customer list api
            let customerList = {
                PageNo: 0,
                PageSize: this.state.PageSize,
                FromDate: this.state.FromDate,
                ToDate: this.state.ToDate,
            }

            //Call affiliateSignupReport List api  
            this.props.affiliateSignupReport(customerList)
        }
    }

    /* if press on complete button then check validation and api calling */
    onCompletePress = async () => {

        // Validation for from date and to date Filter
        if (this.state.FromDate == "" && this.state.ToDate !== "" || this.state.FromDate !== "" && this.state.ToDate == "") {
            this.toast.Show(R.strings.bothDateRequired);
            return
        }

        /* Close Drawer user press on Complete button bcoz display flatlist item on Screen */
        this.drawer.closeDrawer();

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Bind request Customer list api
            let customerList = {
                PageNo: 0,
                PageSize: this.state.PageSize,
                FromDate: this.state.FromDate,
                ToDate: this.state.ToDate,
            }

            //Call affiliateSignupReport List api  
            this.props.affiliateSignupReport(customerList)
        }

        this.setState({ searchInput: '', isFilter: true, selectedPage: 1 })
    }

    navigationDrawer() {
        return (
            // For fromdate , todate , status filter 
            <FilterWidget
                FromDatePickerCall={(date) => this.setState({ FromDate: date })}
                ToDatePickerCall={(date) => this.setState({ ToDate: date })}
                FromDate={this.state.FromDate}
                ToDate={this.state.ToDate}
                toastRef={component => this.toast = component}
                onResetPress={this.onResetPress}
                onCompletePress={this.onCompletePress}
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
        if (AffliateSignUpReportListScreen.oldProps !== props) {
            AffliateSignUpReportListScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //Get All Updated Feild of Particular actions
            const { AffliateReportData } = props.Listdata;
            if (AffliateReportData) {
                try {
                    if (state.AffliateReportData == null || (state.AffliateReportData != null && AffliateReportData !== state.AffliateReportData)) {
                        if (validateResponseNew({
                            response: AffliateReportData,
                            isList: true,
                        })) {
                            var res = AffliateReportData.Response;

                            return {
                                ...state,
                                response: res, refreshing: false, AffliateReportData, row: addPages(AffliateReportData.TotalCount)
                            }

                        } else {
                            return {
                                ...state,
                                response: [], refreshing: false, AffliateReportData, row: []
                            }
                        }
                    }
                } catch (e) {
                    //Set State For Api response 
                    return {
                        ...state,
                        response: [], refreshing: false, row: []
                    }
                }
            }
        }
        return null;
    }

    onViewPress = (item) => {
        //redirect to AffliateSignUpReportDetailScreen 
        this.props.navigation.navigate('AffliateSignUpReportDetailScreen', { item })
    }

    //For Swipe to referesh Functionality
    onRefresh = async () => {
        this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Bind request Customer list api
            let customerList = {
                PageNo: this.state.selectedPage - 1,
                PageSize: this.state.PageSize,
                FromDate: this.state.FromDate,
                ToDate: this.state.ToDate,
            }

            //Call affiliateSignupReport List api  
            this.props.affiliateSignupReport(customerList)
        } else this.setState({ refreshing: false })
    }

    render() {
        //Get is Fetching value For All APIs to handle Progress bar in All Activity
        const { loading } = this.props.Listdata;

        //Display based on filter if aplied filter or display all records
        let finalItems = this.state.response;
        if
            (finalItems.length > 0) {
            finalItems = this.state.response.filter(item => !isEmpty(item.UserName) && item.UserName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
                !isEmpty(item.Email) && item.Email.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
                !isEmpty(item.Mobile) && item.Mobile.toLowerCase().includes(this.state.searchInput.toLowerCase())
            )
        }

        return (
            /* DrawerLayout for user sign up report list  Filteration */
            <Drawer
                ref={component => this.drawer = component}
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
                        title={R.strings.affliateSignUpReport}
                        rightIcon={R.images.FILTER}
                        onRightMenuPress={() => this.drawer.openDrawer()}
                        searchable={true}
                        isBack={true}
                        nav={this.props.navigation}
                        onSearchText={(text) => this.setState({ searchInput: text })}
                    />

                    <View style={{ flex: 1, justifyContent: 'space-between' }}>

                        {/* To show progressbar on api call */}
                        {loading && !this.state.refreshing ?
                            <ListLoader />
                            :
                            <View style={{ flex: 1 }}>
                                {finalItems.length ?

                                    <FlatList
                                        data={finalItems}
                                        showsVerticalScrollIndicator={false}
                                        /* render all item in list */
                                        renderItem={({ item, index }) =>
                                            <AffliateSignUpReportListItem
                                                item={item}
                                                onPress={() => this.onViewPress(item)}
                                                size={this.state.response.length}
                                                index={index}
                                            ></AffliateSignUpReportListItem>}
                                        /* assign index as key valye to Withdraw History list item */
                                        keyExtractor={(item, index) => index.toString()}
                                        /* For Refresh Functionality In Withdraw History FlatList Item */
                                        refreshControl={
                                            <RefreshControl
                                                colors={[R.colors.accent]}
                                                progressBackgroundColor={R.colors.background}
                                                onRefresh={this.onRefresh}
                                                refreshing={this.state.refreshing}
                                            />
                                        }
                                    />
                                    : <ListEmptyComponent />
                                }
                            </View>
                        }
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
class AffliateSignUpReportListItem extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        //if records are same then no need to update component
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
                    marginLeft: R.dimens.widget_left_right_margin,
                    flex: 1,
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginRight: R.dimens.widget_left_right_margin
                }}>
                    <CardView style={{
                        elevation: R.dimens.listCardElevation,
                        borderTopRightRadius: R.dimens.margin,
                        borderRadius: 0,
                        margin: 0,
                        borderBottomLeftRadius: R.dimens.margin,
                        flex: 1,
                    }} onPress={this.props.onPress}>

                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>

                            {/* for show user icon */}
                            <ImageTextButton
                                icon={R.images.IC_OUTLINE_USER}
                                iconStyle={{ width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.white }}
                                style={{
                                    justifyContent: 'center', alignSelf: 'flex-start', width: R.dimens.SignUpButtonHeight,
                                    height: R.dimens.SignUpButtonHeight, margin: 0, backgroundColor: R.colors.accent, borderRadius: R.dimens.ButtonHeight
                                }}
                            />

                            <View style={{ flex: 1, paddingLeft: R.dimens.margin, }}>

                                {/* for show UserName, detail icon */}
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', alignContent: 'flex-start' }}>
                                    <Text style={{
                                        flex: 1, color: R.colors.textPrimary, fontSize: R.dimens.smallText,
                                        fontFamily: Fonts.MontserratSemiBold, paddingRight: R.dimens.widgetMargin
                                    }}>{item.UserName ? item.UserName : ' - '}</Text>
                                    <Image
                                        source={R.images.RIGHT_ARROW_DOUBLE}
                                        style={{
                                            width: R.dimens.dashboardMenuIcon,
                                            height: R.dimens.dashboardMenuIcon,
                                            tintColor: R.colors.textPrimary,
                                        }} />
                                </View>

                                {/* for show Email, Mobile*/}
                                <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{item.Email ? item.Email : '-'}</TextViewHML>
                                <TextViewHML style={{ color: R.colors.yellow, fontSize: R.dimens.smallestText }}>{item.Mobile ? item.Mobile : '-'}</TextViewHML>
                            </View>
                        </View>

                        {/* for show time and status */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: R.dimens.widgetMargin, justifyContent: 'space-between' }}>
                            <View>
                                <StatusChip
                                    color={item.Status == 1 ? R.colors.successGreen : R.colors.failRed}
                                    value={item.Status == 1 ? R.strings.active : R.strings.inActive}></StatusChip>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <ImageTextButton
                                    style={{ margin: 0, paddingRight: R.dimens.widgetMargin, }}
                                    icon={R.images.IC_TIMER}
                                    iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
                                />
                                <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{convertDate(item.JoinDate) + ' ' + convertTime(item.JoinDate)}</TextViewHML>
                            </View>
                        </View>
                    </CardView>
                </View>
            </AnimatableItem>
        )
    };
}

function mapStatToProps(state) {
    //Updated data for Affiliate Sign Up Report List action
    return { Listdata: state.AffliateSignUpReportReducer }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform Affiliate Sign Up Report List action
        affiliateSignupReport: (request) => dispatch(affiliateSignupReport(request)),
        //Perfrom Clear Data Affiliate Sign Up Report List action
        clearAffiliateSignUpReport: () => dispatch(clearAffiliateSignUpReport()),
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(AffliateSignUpReportListScreen);

