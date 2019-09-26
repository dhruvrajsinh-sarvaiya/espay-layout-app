import React, { Component } from 'react';
import { View, Text, FlatList, RefreshControl, Easing, Image } from 'react-native';
import { connect } from 'react-redux';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { changeTheme, addPages, parseArray, convertDateTime } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../Navigation';
import { isInternet, validateResponseNew, isEmpty } from '../../../validations/CommonValidation';
import ListLoader from '../../../native_theme/components/ListLoader';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import R from '../../../native_theme/R';
import Drawer from 'react-native-drawer-menu';
import PaginationWidget from '../../widget/PaginationWidget';
import { AppConfig } from '../../../controllers/AppConfig';
import CardView from '../../../native_theme/components/CardView';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import { Fonts } from '../../../controllers/Constants';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import FilterWidget from '../../widget/FilterWidget';
import { referralRewardReport, clearConvertsData } from '../../../actions/account/ConvertsAction';
import { getReferralService, getUserDataList } from '../../../actions/PairListAction';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import SafeView from '../../../native_theme/components/SafeView';

class ConvetsListScreen extends Component {
    constructor(props) {
        super(props);

        this.drawer = React.createRef();

        //Define initial state
        this.state = {
            searchInput: '',
            selectedPage: 1,
            PageSize: AppConfig.pageSize,
            refreshing: false,
            row: [],
            response: [],
            trnUsername: [{ value: R.strings.all }],
            selectedTrnUsername: R.strings.all,
            selectedTrnUserId: '',
            serviceSlab: [{ value: R.strings.all }],
            selectedServiceSlab: R.strings.all,
            selectedServiceSlabId: '',
            FromDate: '',
            ToDate: '',
            isFirstTime: true,
            isDrawerOpen: false, // First Time Drawer is Closed
            isFilter: false,
            listReferralRewardData: null,
            listServiceData: null,
            userData: null,
        };

        //Bind all Methods
        this.onBackPress = this.onBackPress.bind(this);
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check intenet connectivity
        if (await isInternet()) {

            //Bind request Customer list api
            let customerList = {
                PageIndex: 1,
                Page_Size: this.state.PageSize,
                FromDate: '',
                ToDate: '',
                ReferralServiceId: '',
                TrnUserId: '',
            }

            //call referralRewardReport api
            this.props.referralRewardReport(customerList)

            //call user data api
            this.props.getUserDataList()

            //call service data api
            this.props.getReferralService({ PayTypeId: 0 })
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
        this.props.clearConvertsData();
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps);
    };

    /* Set state to original value */
    onResetPress = async () => {
        this.setState({
            selectedServiceSlab: R.strings.all, selectedTrnUsername: R.strings.all, searchInput: '',
            selectedPage: 1, FromDate: '', ToDate: '', isFilter: false, selectedServiceSlabId: '', selectedTrnUserId: '',
        })

        this.drawer.closeDrawer();

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Bind request Customer list api
            let customerList = {
                PageIndex: 1,
                Page_Size: this.state.PageSize,
                FromDate: '',
                ToDate: '',
                ReferralServiceId: '',
                TrnUserId: '',
            }

            //call referralRewardReport api
            this.props.referralRewardReport(customerList)
        }
    }

    /* if press on complete button then check validation and api calling */
    onCompletePress = async () => {

        //Validation for from date and to date Filter
        if (this.state.FromDate == "" && this.state.ToDate !== "" || this.state.FromDate !== "" && this.state.ToDate == "") {
            this.toast.Show(R.strings.bothDateRequired);
            return
        }

        /* Close Drawer user press on Complete button bcoz display flatlist item on Screen */
        this.drawer.closeDrawer();

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Bind request api
            let customerList = {
                PageIndex: 1,
                Page_Size: this.state.PageSize,
                FromDate: this.state.FromDate,
                ToDate: this.state.ToDate,
                ReferralServiceId: (this.state.selectedServiceSlabId == '' || this.state.selectedServiceSlab == R.strings.all) ? '' : this.state.selectedServiceSlabId,
                TrnUserId: (this.state.selectedTrnUserId == '' || this.state.selectedTrnUsername == R.strings.all) ? '' : this.state.selectedTrnUserId,
            }

            //call referralRewardReport api
            this.props.referralRewardReport(customerList)
        }

        this.setState({ searchInput: '', selectedPage: 1, isFilter: true })
    }


    navigationDrawer() {

        return (
            //  For fromdate , todate , status filter 
            <FilterWidget
                FromDatePickerCall={(date) => this.setState({ FromDate: date })}
                ToDatePickerCall={(date) => this.setState({ ToDate: date })}
                FromDate={this.state.FromDate}
                ToDate={this.state.ToDate}
                toastRef={component => this.toast = component}
                comboPickerStyle={{ marginTop: 0, }}
                pickers={[
                    {
                        title: R.strings.transaction + ' ' + R.strings.Username,
                        selectedValue: this.state.selectedTrnUsername,
                        array: this.state.trnUsername,
                        onPickerSelect: (item, object) => this.setState({ selectedTrnUsername: item, selectedTrnUserId: object.Id })
                    },
                    {
                        title: R.strings.Slab_Type,
                        selectedValue: this.state.selectedServiceSlab,
                        array: this.state.serviceSlab,
                        onPickerSelect: (item, object) => this.setState({ selectedServiceSlab: item, selectedServiceSlabId: object.Id })
                    },
                ]}
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
        if (ConvetsListScreen.oldProps !== props) {
            ConvetsListScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //Get All Updated Feild of Particular actions
            const { listReferralRewardData, listServiceData, userData } = props.Listdata;
            if (listReferralRewardData) {
                try {
                    if (state.listReferralRewardData == null || (state.listReferralRewardData != null && listReferralRewardData !== state.listReferralRewardData)) {
                        if (validateResponseNew({
                            response: listReferralRewardData,
                            isList: true,
                        })) {
                            var res = listReferralRewardData.ReferralRewardsList;
                            return {
                                ...state,
                                response: res, refreshing: false, listReferralRewardData, row: addPages(listReferralRewardData.TotalCount)
                            }

                        } else {
                            return {
                                ...state,
                                response: [], refreshing: false, listReferralRewardData, row: []
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

            //if userData response is not null then handle resposne
            if (userData) {
                try {
                    //if local userData state is null or its not null and also different then new response then and only then validate response.
                    if (state.userData == null || (state.userData != null && userData !== state.userData)) {
                        if (validateResponseNew({ response: userData, isList: true })) {

                            let userRes = parseArray(userData.GetUserData);

                            for (var listUser in userRes) {
                                let item = userRes[listUser]
                                item.value = item.UserName
                            }

                            let trnUsername = [
                                ...state.trnUsername,
                                ...userRes
                            ];
                            return { ...state, trnUsername: trnUsername, userData };
                        } else {
                            return { ...state, trnUsername: [{ value: R.strings.all }], selectedTrnUsername: R.strings.all, userData };
                        }
                    }
                } catch (e) {
                    return { ...state, trnUsername: [{ value: R.strings.all }], selectedTrnUsername: R.strings.all };
                }
            }

            //if listServiceData response is not null then handle resposne
            if (listServiceData) {
                try {
                    //if local listServiceData state is null or its not null and also different then new response then and only then validate response.
                    if (state.listServiceData == null || (state.listServiceData != null && listServiceData !== state.listServiceData)) {
                        if (validateResponseNew({ response: listServiceData, isList: true })) {

                            let serviceRes = parseArray(listServiceData.ReferralServiceDropDownList);

                            for (var serviceKey in serviceRes) {
                                let item = serviceRes[serviceKey]
                                item.value = item.ServiceSlab
                            }
                            let serviceSlab = [
                                ...state.serviceSlab,
                                ...serviceRes
                            ];
                            return { ...state, serviceSlab: serviceSlab, listServiceData };
                        } else {
                            return { ...state, serviceSlab: [{ value: R.strings.all }], selectedServiceSlab: R.strings.all, listServiceData };
                        }
                    }
                } catch (e) {
                    return { ...state, serviceSlab: [{ value: R.strings.all }], selectedServiceSlab: R.strings.all };
                }
            }
        }
        return null;
    }

    // Pagination Method Called When User Change Page  
    onPageChange = async (pageNo) => {

        //if selected page is same than no need to call api from pagination
        if (pageNo != this.state.selectedPage) {

            //Check NetWork is Available or not
            if (await isInternet()) {
                this.setState({ selectedPage: pageNo });

                //Bind request  api
                let customerList = {
                    PageIndex: pageNo,
                    Page_Size: this.state.PageSize,
                    FromDate: this.state.FromDate,
                    ToDate: this.state.ToDate,
                    ReferralServiceId: (this.state.selectedServiceSlabId == '' || this.state.selectedServiceSlab == R.strings.all) ? '' : this.state.selectedServiceSlabId,
                    TrnUserId: (this.state.selectedTrnUserId == '' || this.state.selectedTrnUsername == R.strings.all) ? '' : this.state.selectedTrnUserId,
                }

                //call referralRewardReport api
                this.props.referralRewardReport(customerList)
            }
        }
    }

    onViewPress = (item) => {

        //redirect ConvertsListDetailScreen
        this.props.navigation.navigate('ConvertsListDetailScreen', { item })
    }

    //For Swipe to referesh Functionality
    onRefresh = async () => {
        this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Bind request api
            let customerList = {
                PageIndex: this.state.selectedPage,
                Page_Size: this.state.PageSize,
                FromDate: this.state.FromDate,
                ToDate: this.state.ToDate,
                ReferralServiceId: (this.state.selectedServiceSlabId == '' || this.state.selectedServiceSlab == R.strings.all) ? '' : this.state.selectedServiceSlabId,
                TrnUserId: (this.state.selectedTrnUserId == '' || this.state.selectedTrnUsername == R.strings.all) ? '' : this.state.selectedTrnUserId,
            }

            //call referralRewardReport api
            this.props.referralRewardReport(customerList)
        }
        else { this.setState({ refreshing: false }) }
    }

    render() {

        //Get is Fetching value For All APIs to handle Progress bar in All Activity
        const { loading } = this.props.Listdata;

        //Display based on filter if aplied filter or display all records
        let finalItems = this.state.response;
        if (finalItems.length > 0) {
            finalItems = this.state.response.filter(item =>
                !isEmpty(item.UserName) && item.UserName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
                !isEmpty(item.TrnUserName) && item.TrnUserName.toLowerCase().includes(this.state.searchInput.toLowerCase())
            )
        }

        return (
            /* DrawerLayout for user sign up report list  Filteration */
            <Drawer
                ref={component => this.drawer = component}
                type={Drawer.types.Overlay}
                drawerWidth={R.dimens.FilterDrawarWidth}
                drawerContent={this.navigationDrawer()}
                drawerPosition={Drawer.positions.Right}
                onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
                onDrawerClose={() => this.setState({ isDrawerOpen: false })}
                easingFunc={Easing.ease}>

                <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                    {/* To Set Status Bas as per out theme */}
                    <CommonStatusBar />

                    {/* To Set ToolBar as per out theme */}
                    <CustomToolbar
                        title={R.strings.converts}
                        isBack={true}
                        nav={this.props.navigation}
                        searchable={true}
                        onSearchText={(text) => this.setState({ searchInput: text })}
                        rightIcon={R.images.FILTER}
                        onRightMenuPress={() => this.drawer.openDrawer()}
                    />

                    <View style={{ flex: 1, justifyContent: 'space-between' }}>

                        {/* To show progressbar on api call */}
                        {loading && !this.state.refreshing ?
                            <ListLoader />
                            :
                            <View style={{ flex: 1 }}>
                                {finalItems.length ?
                                    <View style={{ flex: 1 }}>

                                        <FlatList
                                            data={finalItems}
                                            showsVerticalScrollIndicator={false}
                                            // render all item in list
                                            renderItem={({ item, index }) =>
                                                <ConvetsListItem
                                                    item={item}
                                                    index={index}
                                                    onPress={() => this.onViewPress(item)}
                                                    size={this.state.response.length}
                                                />}
                                            /* assign index as key valye to Withdraw History list item */
                                            keyExtractor={(item, index) => index.toString()}
                                            /* For Refresh Functionality In Withdraw History FlatList Item */
                                            refreshControl={
                                                <RefreshControl
                                                    progressBackgroundColor={R.colors.background}
                                                    colors={[R.colors.accent]}
                                                    refreshing={this.state.refreshing}
                                                    onRefresh={this.onRefresh}
                                                />
                                            }
                                        />
                                    </View>
                                    : <ListEmptyComponent />
                                }
                            </View>
                        }
                        <View>
                            {
                                finalItems.length > 0 &&
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
class ConvetsListItem extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        //if records are same then no need to update component
        if (this.props.item === nextProps.item) {
            return false
        }
        return true
    }

    render() {
        let { index, size, item } = this.props;

        return (
            // Flatlist item animation
            <AnimatableItem>
                <View style={{
                    flex: 1,
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginLeft: R.dimens.widget_left_right_margin,
                    marginRight: R.dimens.widget_left_right_margin
                }}>
                    <CardView style={{
                        flex: 1,
                        borderRadius: 0,
                        borderBottomLeftRadius: R.dimens.margin,
                        borderTopRightRadius: R.dimens.margin,
                        elevation: R.dimens.listCardElevation,
                        margin: 0
                    }} onPress={this.props.onPress}>

                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>

                            {/* for show user icon */}
                            <ImageTextButton
                                style={{ justifyContent: 'center', alignSelf: 'center', width: R.dimens.ButtonHeight, height: R.dimens.ButtonHeight, margin: 0, backgroundColor: R.colors.accent, borderRadius: R.dimens.ButtonHeight }}
                                icon={R.images.IC_OUTLINE_USER}
                                iconStyle={{ width: R.dimens.drawerMenuIconWidthHeight, height: R.dimens.drawerMenuIconWidthHeight, tintColor: R.colors.white }}
                            />
                            <View style={{ flex: 1, paddingLeft: R.dimens.margin, }}>

                                {/* for show UserName and detail icon */}
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', alignContent: 'flex-start' }}>
                                    <Text style={{
                                        fontFamily: Fonts.MontserratSemiBold, paddingRight: R.dimens.widgetMargin,
                                        flex: 1, color: R.colors.textPrimary, fontSize: R.dimens.smallText,
                                    }}>{item.UserName ? item.UserName : ' - '}</Text>
                                    <Image
                                        source={R.images.RIGHT_ARROW_DOUBLE}
                                        style={{
                                            tintColor: R.colors.textPrimary,
                                            width: R.dimens.dashboardMenuIcon,
                                            height: R.dimens.dashboardMenuIcon,
                                        }} />
                                </View>

                                {/* for show transaction username */}
                                <View style={{ flexDirection: 'row', }}>
                                    <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.transaction + ' ' + R.strings.Username + ': '}</TextViewHML>
                                    <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>{item.TrnUserName ? item.TrnUserName : '-'}</TextViewHML>
                                </View>

                                {/* for show reward */}
                                <View style={{ flexDirection: 'row', }}>
                                    <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.reward + ': '}</TextViewHML>
                                    <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>{item.ReferralPayRewards + ' ' + item.CommissionCurrecyName}</TextViewHML>
                                </View>
                            </View>
                        </View>

                        {/* for show time */}
                        <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end', marginTop: R.dimens.widgetMargin, }}>
                            <View style={{ flexDirection: 'row' }}>
                                <ImageTextButton
                                    icon={R.images.IC_TIMER}
                                    iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
                                    style={{ margin: 0, paddingRight: R.dimens.widgetMargin, }}
                                />
                                <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{convertDateTime(item.CreatedDate)}</TextViewHML>
                            </View>
                        </View>
                    </CardView>
                </View>
            </AnimatableItem>
        )
    };
}

function mapStatToProps(state) {
    //updated ConvertsReducer data
    return { Listdata: state.ConvertsReducer }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform referralRewardReport List Action 
        referralRewardReport: (request) => dispatch(referralRewardReport(request)),
        //Perform user data Action 
        getUserDataList: () => dispatch(getUserDataList()),
        //Perform getReferralService data Action 
        getReferralService: (request) => dispatch(getReferralService(request)),
        //Perform clearConvertsData data Action 
        clearConvertsData: () => dispatch(clearConvertsData()),
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(ConvetsListScreen);

