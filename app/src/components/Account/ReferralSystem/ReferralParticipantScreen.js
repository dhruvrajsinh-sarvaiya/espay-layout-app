import React, { Component } from 'react';
import { View, FlatList, Easing, RefreshControl, Text } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { changeTheme, parseArray, getCurrentDate, addPages, convertDateTime } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew, } from '../../../validations/CommonValidation'
import { connect } from 'react-redux';
import ListLoader from '../../../native_theme/components/ListLoader';
import CommonToast from '../../../native_theme/components/CommonToast';
import Drawer from 'react-native-drawer-menu';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import { isCurrentScreen, addRouteToBackPress } from '../../../components/Navigation';
import FilterWidget from '../../../components/Widget/FilterWidget';
import R from '../../../native_theme/R';
import { getReferralChannelType, getReferralService } from '../../../actions/PairListAction';
import { getReferralParticipantList, clearAllData } from '../../../actions/account/ReferralSytem/ReferralSystemCountAction';
import PaginationWidget from '../../../components/Widget/PaginationWidget';
import { AppConfig } from '../../../controllers/AppConfig';
import { DateValidation } from '../../../validations/DateValidation';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import CardView from '../../../native_theme/components/CardView';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import { Fonts } from '../../../controllers/Constants';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import SafeView from '../../../native_theme/components/SafeView';

class ReferralParticipantScreen extends Component {

    constructor(props) {
        super(props);

        //Define All initial State
        this.state = {
            data: [],
            search: '',
            row: [],
            PageSize: AppConfig.pageSize,
            selectedPage: 1,
            FromDate: getCurrentDate(),//for get Current Date
            ToDate: getCurrentDate(),//for get Current Date
            userName: '',
            // for ChannelType
            channelType: [],
            selectedChannelType: R.strings.Please_Select,
            ReferralChannelTypeId: 0,
            // for service slab
            serviceSlab: [],
            selectedServiceSlab: R.strings.Please_Select,
            ReferralServiceId: 0,
            // for refreshing
            refreshing: false,
            isFirstTime: true,
            isDrawerOpen: false, // First Time Drawer is Closed
        }

        //Add Current Screen to Manual Handling BackPress Events
        addRouteToBackPress(props);

        // Bind Method
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

            // call api for get channelType data 
            this.props.getReferralChannelType();

            // call api for get Service Slab data 
            this.props.getReferralService({ PayTypeId: 0 });

            //Bind Request For get ReferralParticipant data
            let requestParticipantData = {
                PageIndex: 1,
                Page_Size: this.state.PageSize,
                ReferUserName: this.state.userName != '' ? this.state.userName : '',
                ReferralChannelTypeId: this.state.ReferralChannelTypeId,
                ReferralServiceId: this.state.ReferralServiceId,
                FromDate: this.state.FromDate,
                ToDate: this.state.ToDate,
            }
            // call ReferralParticipant api 
            this.props.getReferralParticipantList(requestParticipantData);
        }
    }

    shouldComponentUpdate = (nextProps, _nextState) => {
        return isCurrentScreen(nextProps);
    };

    //For Swipe to referesh Functionality
    onRefresh = async () => {
        this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Bind Request For get ReferralParticipant data
            let requestParticipantData = {
                PageIndex: this.state.selectedPage,
                Page_Size: this.state.PageSize,
                ReferUserName: this.state.userName != '' ? this.state.userName : '',
                ReferralChannelTypeId: this.state.ReferralChannelTypeId,
                ReferralServiceId: this.state.ReferralServiceId,
                FromDate: this.state.FromDate,
                ToDate: this.state.ToDate,
            }
            // call ReferralParticipant api 
            this.props.getReferralParticipantList(requestParticipantData);
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
            userName: '',
            selectedChannelType: R.strings.Please_Select,
            selectedPayType: R.strings.Please_Select,
            selectedServiceSlab: R.strings.Please_Select,
            selectedPage: 1,
            ReferralChannelTypeId: 0,
            ReferralServiceId: 0
        })

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Bind Request For get ReferralParticipant data
            let requestParticipantData = {
                PageIndex: 1,
                Page_Size: this.state.PageSize,
                ReferUserName: this.state.userName != '' ? this.state.userName : '',
                ReferralChannelTypeId: this.state.ReferralChannelTypeId,
                ReferralServiceId: this.state.ReferralServiceId,
                FromDate: getCurrentDate(),
                ToDate: getCurrentDate(),
            }
            // call ReferralParticipant api 
            this.props.getReferralParticipantList(requestParticipantData);
        }
    }

    // if press on complete button then check validation and api calling
    onCompletePress = async () => {

        //Check All From Date Validation
        if (DateValidation(this.state.FromDate, this.state.ToDate, true)) {
            this.toast.Show(DateValidation(this.state.FromDate, this.state.ToDate, true));
            return;
        } else {
            this.drawer.closeDrawer();
            this.setState({ selectedPage: 1 })
            //Check NetWork is Available or not
            if (await isInternet()) {

                //Bind Request For get ReferralParticipant data
                let requestParticipantData = {
                    PageIndex: 1,
                    Page_Size: this.state.PageSize,
                    ReferUserName: this.state.userName != '' ? this.state.userName : '',
                    ReferralChannelTypeId: this.state.ReferralChannelTypeId,
                    ReferralServiceId: this.state.ReferralServiceId,
                    FromDate: this.state.FromDate,
                    ToDate: this.state.ToDate,
                }
                // call ReferralParticipant api 
                this.props.getReferralParticipantList(requestParticipantData);
            }
        }
    }

    // Pagination Method Called When User Change Page  
    onPageChange = async (pageNo) => {

        //if user select other page number then and only then API Call else no need to call API
        if ((pageNo) !== (this.state.selectedPage)) {
            this.setState({ selectedPage: pageNo, });

            //Check NetWork is Available or not
            if (await isInternet()) {

                //Bind Request For get ReferralParticipant data
                let requestParticipantData = {
                    PageIndex: pageNo,
                    Page_Size: this.state.PageSize,
                    ReferUserName: this.state.userName != '' ? this.state.userName : '',
                    ReferralChannelTypeId: this.state.ReferralChannelTypeId,
                    ReferralServiceId: this.state.ReferralServiceId,
                    FromDate: this.state.FromDate,
                    ToDate: this.state.ToDate,
                }
                // call ReferralParticipant api 
                this.props.getReferralParticipantList(requestParticipantData);
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
        if (ReferralParticipantScreen.oldProps !== props) {
            ReferralParticipantScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //Get All Updated Field of Particular actions
            const { referralChannelTypeData, referralServiceData, referralParticipantData } = props;

            //To Check Referral Participant Data Fetch or Not
            if (referralParticipantData) {
                try {
                    // check old and new response and if same than display old state data else display new response data
                    if (state.referralParticipantData == null || (state.referralParticipantData != null && referralParticipantData !== state.referralParticipantData)) {
                        if (validateResponseNew({ response: referralParticipantData, isList: true })) {
                            //Store Api Response Field and display in Screen.
                            let res = parseArray(referralParticipantData.ReferralUserList);
                            return { ...state, data: res, referralParticipantData, row: addPages(referralParticipantData.TotalCount), refreshing: false };
                        }
                        else {
                            return { ...state, data: [], refreshing: false, row: [] };
                        }
                    }
                } catch (e) {
                    return { ...state, data: [], row: [], refreshing: false };
                }
            }

            //To Check Channel Type Data Fetch or Not
            if (referralChannelTypeData) {
                try {
                    // check old and new response and if same than display old state data else display new response data
                    if (state.referralChannelTypeData == null || (state.referralChannelTypeData != null && referralChannelTypeData !== state.referralChannelTypeData)) {
                        if (validateResponseNew({ response: referralChannelTypeData, isList: true })) {
                            //Store Api Response Field and display in Screen.
                            let res = parseArray(referralChannelTypeData.ReferralChannelTypeDropDownList);
                            res.map((item, index) => {
                                res[index].Id = item.Id;
                                res[index].value = item.ChannelTypeName;
                            })
                            let currencyItem = [
                                { value: R.strings.Please_Select },
                                ...res
                            ];
                            return { ...state, channelType: currencyItem, referralChannelTypeData, refreshing: false };
                        }
                        else {
                            return { ...state, channelType: [{ value: R.strings.Please_Select }], selectedChannelType: R.strings.Please_Select, refreshing: false };
                        }
                    }
                } catch (e) {
                    return { ...state, channelType: [{ value: R.strings.Please_Select }], selectedChannelType: R.strings.Please_Select, };
                }
            }

            //To Check Referral Service Data Fetch or Not
            if (referralServiceData) {
                try {
                    // check old and new response and if same than display old state data else display new response data
                    if (state.referralServiceData == null || (state.referralServiceData != null && referralServiceData !== state.referralServiceData)) {
                        if (validateResponseNew({ response: referralServiceData, isList: true })) {
                            //Store Api Response Field and display in Screen.
                            let res = parseArray(referralServiceData.ReferralServiceDropDownList);
                            res.map((item, index) => {
                                res[index].Id = item.Id;
                                res[index].value = item.ServiceSlab;
                            })
                            let currencyItem = [
                                { value: R.strings.Please_Select },
                                ...res
                            ];
                            return { ...state, serviceSlab: currencyItem, referralServiceData };
                        }
                        else {
                            return { ...state, serviceSlab: [{ value: R.strings.Please_Select }], selectedServiceSlab: R.strings.Please_Select, };
                        }
                    }
                } catch (e) {
                    return { ...state, serviceSlab: [{ value: R.strings.Please_Select }], selectedServiceSlab: R.strings.Please_Select, };
                }
            }
        }
        return null;
    }

    // Drawer Navigation
    navigationDrawer() {
        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                {/* for display Toast */}
                <CommonToast ref={cmp => this.toast = cmp} styles={{ width: R.dimens.FilterDrawarWidth }} />

                {/* filterwidget for display fromdate, todate,username, channeltype and serviceslab data */}
                <FilterWidget
                    FromDatePickerCall={(date) => this.setState({ FromDate: date })}
                    FromDate={this.state.FromDate}
                    ToDatePickerCall={(date) => this.setState({ ToDate: date })}
                    ToDate={this.state.ToDate}
                    textInputStyle={{ marginTop: 0, marginBottom: 0, }}
                    textInputs={[
                        {
                            header: R.strings.referUserName,
                            placeholder: R.strings.referUserName,
                            multiline: false,
                            keyboardType: 'default',
                            maxLength: 50,
                            returnKeyType: "done",
                            onChangeText: (text) => { this.setState({ userName: text }) },
                            value: this.state.userName,
                        },
                    ]}
                    comboPickerStyle={{ marginTop: 0, }}
                    pickers={[
                        {
                            title: R.strings.ChannelType,
                            array: this.state.channelType,
                            selectedValue: this.state.selectedChannelType,
                            onPickerSelect: (index, object) => { this.setState({ selectedChannelType: index, ReferralChannelTypeId: object.Id }) }
                        },
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
        const { isParticipantdata } = this.props;

        let list = this.state.data;

        //for final items from search input (validate on ReferUserName and ReferralChanneTypeName)
        let finalItems = list.filter(item =>
            item.ReferUserName.toLowerCase().includes(this.state.search.toLowerCase()) ||
            item.ReferralChanneTypeName.toLowerCase().includes(this.state.search.toLowerCase())
        );

        return (
            //Drawer for apply filter on referralParticipants data
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
                        title={R.strings.referralParticipant}
                        isBack={true}
                        nav={this.props.navigation}
                        onBackPress={this.onBackPress}
                        searchable={true}
                        onSearchText={(input) => this.setState({ search: input })}
                        rightIcon={R.images.FILTER}
                        onRightMenuPress={() => { this.drawer.openDrawer() }}
                    />

                    <View style={{ flex: 1, justifyContent: 'space-between' }}>
                        {/* To Check Response fetch or not if isParticipantdata = true then display progress bar else display List*/}
                        {
                            isParticipantdata && !this.state.refreshing ?
                                <ListLoader />
                                :
                                <View style={{ flex: 1 }}>
                                    {finalItems.length > 0 ?
                                        <View style={{ flex: 1 }}>
                                            <FlatList
                                                data={finalItems}
                                                showsVerticalScrollIndicator={false}
                                                renderItem={({ item, index }) => <FlatListItem
                                                    item={item}
                                                    index={index}
                                                    size={this.state.data.length}
                                                />}
                                                keyExtractor={(item, index) => index.toString()}
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
                        < View >
                            {/* show pagination if response contains more data  */}
                            {
                                finalItems.length > 0 &&
                                <PaginationWidget row={this.state.row} selectedPage={this.state.selectedPage} onPageChange={(item) => { this.onPageChange(item) }} />
                            }
                        </View>
                    </View>
                </SafeView>
            </Drawer>
        )
    }
}

// This Class is used for display record in list
class FlatListItem extends Component {

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
        let imageType = R.images.IC_EMAIL_FILLED;

        // based on ReferralChanneTypeName set image
        if (item.ReferralChanneTypeName === 'SMS') imageType = R.images.IC_COMPLAINT;
        if (item.ReferralChanneTypeName === 'Email') imageType = R.images.IC_EMAIL_FILLED;
        if (item.ReferralChanneTypeName === 'Twitter') imageType = R.images.IC_TWITTER;
        if (item.ReferralChanneTypeName === 'Linkedin') imageType = R.images.IC_LINKEDIN_LOGO;
        if (item.ReferralChanneTypeName === 'Insta') imageType = R.images.IC_INSTAGRAM_LOGO;
        if (item.ReferralChanneTypeName === 'Facebook') imageType = R.images.IC_FACEBOOK_LOGO;

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

                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            {/* for show Image */}
                            <ImageTextButton
                                icon={imageType}
                                style={{ justifyContent: 'center', alignSelf: 'center', width: R.dimens.ButtonHeight, height: R.dimens.ButtonHeight, margin: 0, backgroundColor: R.colors.accent, borderRadius: R.dimens.ButtonHeight }}
                                iconStyle={{ width: R.dimens.drawerMenuIconWidthHeight, height: R.dimens.drawerMenuIconWidthHeight, tintColor: R.colors.white }}
                            />
                            {/* for Display Message */}
                            <View style={{ flex: 1, paddingLeft: R.dimens.margin, paddingRight: R.dimens.margin }}>
                                <Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold }}>{R.strings.invited} {item.ReferUserName ? item.ReferUserName : ''} {R.strings.via} {item.ReferralChanneTypeName ? item.ReferralChanneTypeName : '-'}</Text>
                                <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>{R.strings.referralMessage} {item.ReferralServiceDescription ? item.ReferralServiceDescription : '-'}</TextViewHML>
                            </View>
                        </View>

                        {/* for show DateTime */}
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <ImageTextButton
                                style={{ margin: 0, paddingRight: R.dimens.LineHeight, }}
                                icon={R.images.IC_TIMER}
                                iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
                            />
                            <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{item.CreatedDate ? convertDateTime(item.CreatedDate) : '-'}</TextViewHML>
                        </View>
                    </CardView>
                </View >
            </AnimatableItem>
        )
    }
}

function mapStateToProps(state) {
    return {
        //Updated Data For ChannelType
        referralChannelTypeData: state.pairListReducer.referralChannelTypeData,
        isLoadingReferralChannelType: state.pairListReducer.isLoadingReferralChannelType,

        //Updated Data For serviceSlab
        referralServiceData: state.pairListReducer.referralServiceData,
        isLoadingReferralService: state.pairListReducer.isLoadingReferralService,

        //Updated Data For referralParticipant
        referralParticipantData: state.ReferralSystemCountReducer.referralParticipantData,
        isParticipantdata: state.ReferralSystemCountReducer.isParticipantdata,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform channelType Action
        getReferralChannelType: () => dispatch(getReferralChannelType()),
        //Perform serviceSlab Action
        getReferralService: (requestService) => dispatch(getReferralService(requestService)),
        //Perform referralParticipant Action
        getReferralParticipantList: (requestParticipantData) => dispatch(getReferralParticipantList(requestParticipantData)),
        //Perform Action for clear reducer
        clearAllData: () => dispatch(clearAllData()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReferralParticipantScreen)