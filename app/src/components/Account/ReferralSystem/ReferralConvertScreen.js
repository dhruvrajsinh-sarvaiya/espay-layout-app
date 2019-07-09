import React, { Component } from 'react';
import { View, FlatList, Easing, RefreshControl, Text } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { changeTheme, parseArray, getCurrentDate, addPages, convertDateTime } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew, } from '../../../validations/CommonValidation'
import { connect } from 'react-redux';
import { Fonts } from '../../../controllers/Constants';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import SafeView from '../../../native_theme/components/SafeView';
import ListLoader from '../../../native_theme/components/ListLoader';
import CommonToast from '../../../native_theme/components/CommonToast';
import Drawer from 'react-native-drawer-menu';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import { isCurrentScreen, addRouteToBackPress } from '../../../components/Navigation';
import FilterWidget from '../../../components/Widget/FilterWidget';
import R from '../../../native_theme/R';
import { getReferralService } from '../../../actions/PairListAction';
import { getReferralConvertList, clearAllData } from '../../../actions/account/ReferralSytem/ReferralSystemCountAction';
import PaginationWidget from '../../../components/Widget/PaginationWidget';
import { AppConfig } from '../../../controllers/AppConfig';
import { DateValidation } from '../../../validations/DateValidation';
import CardView from '../../../native_theme/components/CardView';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import TextViewHML from '../../../native_theme/components/TextViewHML';

class ReferralConvertScreen extends Component {
    constructor(props) {
        super(props);

        // create reference
        this.drawer = React.createRef();
        this.toast = React.createRef();

        //Define All initial State
        this.state = {
            data: [],
            search: '',
            row: [],
            PageSize: AppConfig.pageSize,
            selectedPage: 1,

            // for service slab
            serviceSlab: [],
            selectedServiceSlab: R.strings.Please_Select,
            ReferralServiceId: 0,

            FromDate: getCurrentDate(),//for get Current Date
            ToDate: getCurrentDate(),//for get Current Date

            // for refreshing
            refreshing: false,
            isFirstTime: true,
            isDrawerOpen: false, // First Time Drawer is Closed
        }

        //Add Current Screen to Manual Handling BackPress Events
        addRouteToBackPress(props);

        // Bind Method
        this.onBackPress = this.onBackPress.bind(this);
        this.props.navigation.setParams({ onBackPress: this.onBackPress });
        this.onResetPress = this.onResetPress.bind(this);
        this.onCompletePress = this.onCompletePress.bind(this);
        this.onPageChange = this.onPageChange.bind(this);
        this.onRefresh = this.onRefresh.bind(this);
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {

            // call api for get Service Slab data 
            this.props.getReferralService({ PayTypeId: 0 });

            //Bind Request For get ReferralConvert data
            let requestConvertData = {
                PageIndex: 1,
                Page_Size: this.state.PageSize,
                ReferralServiceId: this.state.ReferralServiceId,
                FromDate: this.state.FromDate,
                ToDate: this.state.ToDate,
            }
            // call ReferralConverts api 
            this.props.getReferralConvertList(requestConvertData);
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        return isCurrentScreen(nextProps);
    };

    //For Swipe to referesh Functionality
    onRefresh = async () => {

        this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Bind Request For get ReferralConvert data
            let requestConvertData = {
                PageIndex: this.state.selectedPage,
                Page_Size: this.state.PageSize,
                ReferralServiceId: this.state.ReferralServiceId,
                FromDate: this.state.FromDate,
                ToDate: this.state.ToDate,
            }
            // call ReferralConverts api 
            this.props.getReferralConvertList(requestConvertData);
        } else {
            this.setState({ refreshing: false });
        }
    }

    // When user press on reset button then all values are reset
    onResetPress = async () => {
        this.drawer.closeDrawer();

        // set initial state value 
        this.setState({
            FromDate: getCurrentDate(),
            ToDate: getCurrentDate(),
            selectedServiceSlab: R.strings.Please_Select,
            ReferralServiceId: 0,
            selectedPage: 1,
        })

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Bind Request For get ReferralConvert data
            let requestConvertData = {
                PageIndex: 1,
                Page_Size: this.state.PageSize,
                ReferralServiceId: this.state.ReferralServiceId,
                FromDate: getCurrentDate(),
                ToDate: getCurrentDate(),
            }
            // call ReferralConverts api 
            this.props.getReferralConvertList(requestConvertData);
        }
    }

    // if press on complete button then check validation and api calling
    onCompletePress = async () => {

        //Check Validation of FromDate and TODate
        if (DateValidation(this.state.FromDate, this.state.ToDate, true)) {
            this.toast.Show(DateValidation(this.state.FromDate, this.state.ToDate, true));
            return;
        } else {
            this.drawer.closeDrawer();

            this.setState({ selectedPage: 1 })

            //Check NetWork is Available or not
            if (await isInternet()) {

                //Bind Request For get ReferralConvert data
                let requestConvertData = {
                    PageIndex: 1,
                    Page_Size: this.state.PageSize,
                    ReferralServiceId: this.state.ReferralServiceId,
                    FromDate: this.state.FromDate,
                    ToDate: this.state.ToDate,
                }
                // call ReferralConverts api 
                this.props.getReferralConvertList(requestConvertData);
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

    // Pagination Method Called When User Change Page  
    onPageChange = async (pageNo) => {

        //if user select other page number then and only then API Call else no need to call API
        if ((pageNo) !== (this.state.selectedPage)) {

            this.setState({ selectedPage: pageNo, });

            //Check NetWork is Available or not
            if (await isInternet()) {

                //Bind Request For get ReferralConvert data
                let requestConvertData = {
                    PageIndex: pageNo,
                    Page_Size: this.state.PageSize,
                    ReferralServiceId: this.state.ReferralServiceId,
                    FromDate: this.state.FromDate,
                    ToDate: this.state.ToDate,
                }
                // call ReferralConverts api 
                this.props.getReferralConvertList(requestConvertData);
            } else {
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
        if (ReferralConvertScreen.oldProps !== props) {
            ReferralConvertScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //Get All Updated FIEld of Particular actions
            const { referralServiceData, referralConvertsData } = props;

            //To Check Referral converts Data Fetch or Not
            if (referralConvertsData) {
                try {
                    // check old and new response and if same than display old state data else display new response data
                    if (state.referralConvertsData == null || (state.referralConvertsData != null && referralConvertsData !== state.referralConvertsData)) {
                        if (validateResponseNew({ response: referralConvertsData, isList: true })) {
                            //Store Api Response Field and display in Screen.
                            let res = parseArray(referralConvertsData.ReferralRewardsList);
                            return { ...state, data: res, referralConvertsData, row: addPages(referralConvertsData.TotalCount), refreshing: false };
                        }
                        else {
                            return { ...state, data: [], refreshing: false, row: [] };
                        }
                    }
                } catch (e) {
                    return { ...state, data: [], row: [], refreshing: false };
                }
            }

            //To Check Referral Service Data Fetch or Not
            if (referralServiceData) {
                try {
                    // check old and new response and if same than display old state data else display new response data
                    if (state.referralServiceData == null || (state.referralServiceData != null && referralServiceData !== state.referralServiceData)) {
                        if (validateResponseNew({ response: referralServiceData, isList: true })) {
                            //Store Api Response Field and display in Screen.
                            let serviceDataForRefConvert = parseArray(referralServiceData.ReferralServiceDropDownList);
                            serviceDataForRefConvert.map((item, index) => {
                                serviceDataForRefConvert[index].Id = item.Id;
                                serviceDataForRefConvert[index].value = item.ServiceSlab;
                            })
                            let currencyItem = [
                                { value: R.strings.Please_Select }, ...serviceDataForRefConvert
                            ];
                            return {
                                ...state, serviceSlab: currencyItem,
                                referralServiceData
                            };
                        }
                        else {
                            return {
                                ...state, serviceSlab: [{ value: R.strings.Please_Select }],
                                selectedServiceSlab: R.strings.Please_Select, ReferralServiceId: 0
                            };
                        }
                    }
                } catch (e) {
                    return {
                        ...state, serviceSlab: [{ value: R.strings.Please_Select }],
                        selectedServiceSlab: R.strings.Please_Select, ReferralServiceId: 0
                    };
                }
            }
        }
        return null;
    }

    // Drawer Navigation
    navigationDrawer() {
        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background, }}>

                {/* for display Toast */}
                <CommonToast
                    ref={cmp => this.toast = cmp}
                    styles={{ width: R.dimens.FilterDrawarWidth }} />

                {/* filterwidget for display fromdate, todate and serviceslab data */}
                <FilterWidget
                    FromDatePickerCall={(date) => this.setState({ FromDate: date })}
                    FromDate={this.state.FromDate}
                    ToDatePickerCall={(date) => this.setState({ ToDate: date })}
                    ToDate={this.state.ToDate}
                    comboPickerStyle={{ marginTop: 0 }}
                    pickers={[
                        {
                            title: R.strings.ServiceSlab,
                            array: this.state.serviceSlab,
                            selectedValue: this.state.selectedServiceSlab,
                            onPickerSelect: (index, object) => { this.setState({ selectedServiceSlab: index, ReferralServiceId: object.Id }) }
                        },
                    ]}
                    onResetPress={this.onResetPress}
                    onCompletePress={this.onCompletePress}
                />
            </SafeView>
        )
    }

    componentWillUnmount() {
        // call action for clear Reducer value 
        this.props.clearAllData()
    }

    render() {

        const { isConvertsdata } = this.props;

        let list = this.state.data;
        //apply filter on User name, currencyName 
        let finalItems = list.filter(refConvertItem =>
            refConvertItem.UserName.toLowerCase().includes(this.state.search.toLowerCase()) ||
            refConvertItem.CurrencyName.toLowerCase().includes(this.state.search.toLowerCase()) ||
            refConvertItem.ReferralPayTypeName.toLowerCase().includes(this.state.search.toLowerCase())
        );

        return (
            //Drawer for apply filter on referralConverts data
            <Drawer
                ref={cmpDrawer => this.drawer = cmpDrawer}
                onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
                onDrawerClose={() => this.setState({ isDrawerOpen: false })}
                type={Drawer.types.Overlay}
                drawerWidth={R.dimens.FilterDrawarWidth}
                drawerPosition={Drawer.positions.Right}
                drawerContent={this.navigationDrawer()}
                easingFunc={Easing.ease}>

                <SafeView style={{ flex: 1, backgroundColor: R.colors.background, }}>

                    {/* To set status bar as per our theme */}
                    <CommonStatusBar />

                    {/* To set toolbar as per our theme */}
                    <CustomToolbar
                        title={R.strings.converts}
                        isBack={true}
                        nav={this.props.navigation}
                        onBackPress={this.onBackPress}
                        searchable={true}
                        onSearchText={(input) => this.setState({ search: input })}
                        rightIcon={R.images.FILTER}
                        onRightMenuPress={() => { this.drawer.openDrawer() }}
                    />

                    <View style={{ flex: 1, justifyContent: 'space-between' }}>
                        {/* To Check Response fetch or not if isConvertsdata = true then display progress bar else display List*/}
                        {
                            isConvertsdata && !this.state.refreshing ?
                                <ListLoader />
                                :
                                <View style={{ flex: 1 }}>
                                    {finalItems.length > 0 ?
                                        <View style={{ flex: 1 }}>
                                            <FlatList
                                                data={finalItems}
                                                showsVerticalScrollIndicator={false}
                                                /* render all item in list */
                                                renderItem={({ item, index }) =>
                                                    <ReferralConvertList
                                                        refConvertItem={item}
                                                        index={index}
                                                        size={this.state.data.length}
                                                    />}
                                                keyExtractor={(item, index) => index.toString()}
                                                /* for refreshing data of flatlist */
                                                refreshControl={
                                                    <RefreshControl
                                                        onRefresh={this.onRefresh}
                                                        colors={[R.colors.accent]}
                                                        progressBackgroundColor={R.colors.background}
                                                        refreshing={this.state.refreshing}
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
                                <PaginationWidget
                                    row={this.state.row}
                                    selectedPage={this.state.selectedPage}
                                    onPageChange={(item) => { this.onPageChange(item) }} />
                            }
                        </View>

                    </View>
                </SafeView>
            </Drawer>
        )
    }
}

// This Class is used for display record in list
class ReferralConvertList extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        //Check If Old Props and New Props are Equal then Return False
        if (this.props.refConvertItem === nextProps.refConvertItem) {
            return false
        }
        return true
    }

    render() {
        let refConvertItem = this.props.refConvertItem;
        let { index, size, } = this.props;
        let paytype = refConvertItem.ReferralPayTypeName ? refConvertItem.ReferralPayTypeName : '-';

        // for paytype and replace percentage text with % sign
        if (paytype === "Percentage on maker/taker charges") paytype = paytype.replace("Percentage", "%")

        return (
            <AnimatableItem>
                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginLeft: R.dimens.widget_left_right_margin,
                    marginRight: R.dimens.widget_left_right_margin,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                }}>
                    <CardView style={{
                        elevation: R.dimens.listCardElevation,
                        flex: 1,
                        borderRadius: 0,
                        flexDirection: 'column',
                        borderTopRightRadius: R.dimens.margin,
                        borderBottomLeftRadius: R.dimens.margin,
                    }}>

                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            {/* for show image  */}
                            <ImageTextButton
                                icon={R.images.IC_GRADIANT_GIFT}
                                style={{ justifyContent: 'center', alignSelf: 'center', width: R.dimens.ButtonHeight, height: R.dimens.ButtonHeight, margin: 0, backgroundColor: R.colors.accent, borderRadius: R.dimens.ButtonHeight }}
                                iconStyle={{ width: R.dimens.drawerMenuIconWidthHeight, height: R.dimens.drawerMenuIconWidthHeight, tintColor: R.colors.white }}
                            />
                            {/* for show Message */}
                            <View style={{ flex: 1, paddingLeft: R.dimens.margin, paddingRight: R.dimens.margin }}>
                                <Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold }}>{refConvertItem.ReferralPayRewards ? refConvertItem.ReferralPayRewards : '-'} {refConvertItem.CurrencyName ? refConvertItem.CurrencyName : '-'} {R.strings.earnedBy} {refConvertItem.UserName ? refConvertItem.UserName : '-'}</Text>
                                <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{R.strings.PayType + ' :'}<TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText, }}> {paytype}</TextViewHML></TextViewHML>
                            </View>
                        </View>

                        {/* for show Date and Time */}
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <ImageTextButton
                                style={{ margin: 0, paddingRight: R.dimens.LineHeight, }}
                                icon={R.images.IC_TIMER}
                                iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
                            />
                            <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{refConvertItem.CreatedDate ? convertDateTime(refConvertItem.CreatedDate) : '-'}</TextViewHML>
                        </View>
                    </CardView>
                </View>
            </AnimatableItem>
        )
    }
}

function mapStateToProps(state) {
    return {
        //Updated Data For serviceSlab
        referralServiceData: state.pairListReducer.referralServiceData,
        isLoadingReferralService: state.pairListReducer.isLoadingReferralService,

        //Updated Data For referralConverts
        referralConvertsData: state.ReferralSystemCountReducer.referralConvertsData,
        isConvertsdata: state.ReferralSystemCountReducer.isConvertsdata,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform serviceSlab Action
        getReferralService: (requestService) => dispatch(getReferralService(requestService)),
        //Perform referralConvert Action
        getReferralConvertList: (requestConvertData) => dispatch(getReferralConvertList(requestConvertData)),
        //Perform Action for clear reducer
        clearAllData: () => dispatch(clearAllData()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReferralConvertScreen)