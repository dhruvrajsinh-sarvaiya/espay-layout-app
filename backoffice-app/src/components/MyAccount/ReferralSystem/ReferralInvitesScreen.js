// InvitesScreen
import React, { Component } from 'react';
import { View, Text, FlatList, Easing, RefreshControl, } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { changeTheme, parseArray, convertDate, getCurrentDate, addPages, convertTime } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew, } from '../../../validations/CommonValidation'
import { connect } from 'react-redux';
import ListLoader from '../../../native_theme/components/ListLoader';
import Drawer from 'react-native-drawer-menu';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import { isCurrentScreen, addRouteToBackPress } from '../../../components/Navigation';
import FilterWidget from '../../../components/widget/FilterWidget';
import R from '../../../native_theme/R';
import { getReferralChannelType, getReferralPaytype, getReferralService } from '../../../actions/PairListAction';
import { getReferralInvitesData } from '../../../actions/account/ReferralInvitesAction';
import PaginationWidget from '../../../components/widget/PaginationWidget';
import { AppConfig } from '../../../controllers/AppConfig';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import CardView from '../../../native_theme/components/CardView';
import StatusChip from '../../widget/StatusChip';
import { Fonts } from '../../../controllers/Constants';
import { DateValidation } from '../../../validations/DateValidation';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import SafeView from '../../../native_theme/components/SafeView';

class ReferralInvitesScreen extends Component {
    constructor(props) {
        super(props);

        //create reference
        this.drawer = React.createRef();

        this.state = {
            data: [],
            search: '',
            row: [],
            PageSize: AppConfig.pageSize,
            selectedPage: 1,
            FromDate: getCurrentDate(),
            ToDate: getCurrentDate(),
            userName: '',
            // for ChannelType
            channelType: [{ value: R.strings.Please_Select }],
            selectedChannelType: R.strings.Please_Select,
            // for payType 
            payType: [{ value: R.strings.Please_Select }],
            selectedPayType: R.strings.Please_Select,
            // for service slab
            serviceSlab: [{ value: R.strings.Please_Select }],
            selectedServiceSlab: R.strings.Please_Select,
            // for refreshing
            refreshing: false,
            isFirstTime: true,
            isDrawerOpen: false,
        }

        //bind methods
        this.onBackPress = this.onBackPress.bind(this);

        addRouteToBackPress(props, this.onBackPress);
        this.props.navigation.setParams({ onBackPress: this.onBackPress });
    }

    componentDidMount = async () => {

        //Add this method to change theme based on stored theme name. 
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {
            // for Channel Type data 
            this.props.getReferralChannelType();

            // for Paytype data 
            this.props.getReferralPaytype();

            // for Service Slab data 
            this.props.getReferralService({ PayTypeId: 0 });

            // for Referral invite data equest
            let requestInviteData = {
                PageIndex: 1,
                Page_Size: this.state.PageSize,
                ReferralChannelTypeId: this.getChannelTypeID(''),
                ReferralPayTypeId: this.getPayTypeId(''),
                ReferralServiceId: this.getServiceId(''),
                UserName: '',
                FromDate: this.state.FromDate,
                ToDate: this.state.ToDate,
            }

            //call getReferralInvitesData api
            this.props.getReferralInvitesData(requestInviteData);
        }
    }

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

    shouldComponentUpdate = (nextProps, nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps);
    };

    //For Swipe to referesh Functionality
    onRefresh = async () => {
        this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (await isInternet()) {
            // for Referral invite data
            let requestInviteData = {
                PageIndex: this.state.selectedPage,
                Page_Size: this.state.PageSize,
                ReferralChannelTypeId: this.getChannelTypeID(this.state.selectedChannelType),
                ReferralPayTypeId: this.getPayTypeId(this.state.selectedPayType),
                ReferralServiceId: this.getServiceId(this.state.selectedServiceSlab),
                UserName: this.state.userName != '' ? this.state.userName : '',
                FromDate: this.state.FromDate,
                ToDate: this.state.ToDate,
            }

            //call getReferralInvitesData api
            this.props.getReferralInvitesData(requestInviteData);
        } else {
            this.setState({ refreshing: false });
        }
    }
    //-----------

    /* When user press on reset button then all values are reset */
    /* Set state to original value */
    onResetPress = async () => {
        this.drawer.closeDrawer();

        this.setState({
            FromDate: getCurrentDate(),
            ToDate: getCurrentDate(),
            userName: '',
            selectedChannelType: R.strings.Please_Select,
            selectedPayType: R.strings.Please_Select,
            selectedServiceSlab: R.strings.Please_Select,
            selectedPage: 1,
        })

        //Check NetWork is Available or not
        if (await isInternet()) {
            // for Referral invite data
            let requestInviteData = {
                PageIndex: 1,
                Page_Size: this.state.PageSize,
                ReferralChannelTypeId: this.getChannelTypeID(''),
                ReferralPayTypeId: this.getPayTypeId(''),
                ReferralServiceId: this.getServiceId(''),
                UserName: '',
                FromDate: getCurrentDate(),
                ToDate: getCurrentDate(),
            }

            //call getReferralInvitesData api
            this.props.getReferralInvitesData(requestInviteData);
        }
    }

    /* if press on complete button then check validation and api calling */
    onCompletePress = async () => {
        // Date Validation
        if (DateValidation(this.state.FromDate, this.state.ToDate)) {
            this.toast.Show(DateValidation(this.state.FromDate, this.state.ToDate, true));
            return;
        }
        else {
            this.drawer.closeDrawer();
            this.setState({ selectedPage: 1 })

            //Check NetWork is Available or not
            if (await isInternet()) {
                // for Referral invite data
                let requestInviteData = {
                    PageIndex: 1,
                    Page_Size: this.state.PageSize,
                    ReferralChannelTypeId: this.getChannelTypeID(this.state.selectedChannelType),
                    ReferralPayTypeId: this.getPayTypeId(this.state.selectedPayType),
                    ReferralServiceId: this.getServiceId(this.state.selectedServiceSlab),
                    UserName: this.state.userName != '' ? this.state.userName : '',
                    FromDate: this.state.FromDate,
                    ToDate: this.state.ToDate,
                }

                //call getReferralInvitesData api
                this.props.getReferralInvitesData(requestInviteData);
            }
        }
    }

    // for get ChannelType id 
    getChannelTypeID(type) {
        if (type === R.strings.Please_Select || type === '') {
            return 0
        } else {
            var index = this.state.channelType.findIndex(item => item.value === this.state.selectedChannelType);
            var channelTypeId = this.state.channelType[index].Id;
            return channelTypeId
        }
    }

    // for get Paytype id 
    getPayTypeId(type) {
        if (type === R.strings.Please_Select || type === '') {
            return 0
        } else {
            var index = this.state.payType.findIndex(item => item.value === this.state.selectedPayType);
            var payTypeId = this.state.payType[index].Id;
            return payTypeId
        }
    }

    // for get Service id
    getServiceId(type) {
        if (type === R.strings.Please_Select || type === '') {
            return 0
        } else {
            var index = this.state.serviceSlab.findIndex(item => item.value === this.state.selectedServiceSlab);
            var serviceId = this.state.serviceSlab[index].Id;
            return serviceId
        }
    }

    // Pagination Method Called When User Change Page  
    onPageChange = async (pageNo) => {
        //if user select other page number then and only then API Call else no need to call API
        if ((pageNo) !== (this.state.selectedPage)) {
            this.setState({ selectedPage: pageNo, });

            //Check NetWork is Available or not
            if (await isInternet()) {
                let requestInviteData = {
                    PageIndex: pageNo,
                    Page_Size: this.state.PageSize,
                    ReferralChannelTypeId: this.getChannelTypeID(this.state.selectedChannelType),
                    ReferralPayTypeId: this.getPayTypeId(this.state.selectedPayType),
                    ReferralServiceId: this.getServiceId(this.state.selectedServiceSlab),
                    UserName: this.state.userName != '' ? this.state.userName : '',
                    FromDate: this.state.FromDate,
                    ToDate: this.state.ToDate,
                }

                //call getReferralInvitesData api
                this.props.getReferralInvitesData(requestInviteData);
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
        if (ReferralInvitesScreen.oldProps !== props) {
            ReferralInvitesScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //for fetch News API
            const { referralChannelTypeData, referralPaytypeData, referralServiceData, invitesData } = props;

            //To Check Channel Type Data Fetch or Not
            if (referralChannelTypeData) {
                try {
                    if (state.referralChannelTypeData == null || (state.referralChannelTypeData != null && referralChannelTypeData !== state.referralChannelTypeData)) {
                        if (validateResponseNew({ response: referralChannelTypeData, isList: true })) {

                            let res = parseArray(referralChannelTypeData.ReferralChannelTypeDropDownList);
                            res.map((item, index) => {
                                res[index].Id = item.Id;
                                res[index].value = item.ChannelTypeName;
                            })
                            let currencyItem = [
                                ...state.channelType,
                                ...res
                            ];
                            return { ...state, channelType: currencyItem, referralChannelTypeData, refreshing: false };
                        }
                        else {
                            return { ...state, channelType: [{ value: R.strings.Please_Select }], selectedChannelType: R.strings.Please_Select, referralChannelTypeData, refreshing: false };
                        }
                    }
                } catch (e) {
                    return { ...state, channelType: [{ value: R.strings.Please_Select }], selectedChannelType: R.strings.Please_Select, };
                }
            }

            //To Check Pay Type Data Fetch or Not
            if (referralPaytypeData) {
                try {
                    if (state.referralPaytypeData == null || (state.referralPaytypeData != null && referralPaytypeData !== state.referralPaytypeData)) {
                        if (validateResponseNew({ response: referralPaytypeData, isList: true })) {

                            let res = parseArray(referralPaytypeData.ReferralPayTypeDropDownList);
                            res.map((item, index) => {
                                res[index].Id = item.Id;
                                res[index].value = item.PayTypeName;
                            })
                            let currencyItem = [
                                ...state.payType,
                                ...res
                            ];
                            return { ...state, payType: currencyItem, referralPaytypeData };
                        }
                        else {
                            return { ...state, payType: [{ value: R.strings.Please_Select }], selectedPayType: R.strings.Please_Select, referralPaytypeData };
                        }
                    }
                } catch (e) {
                    return { ...state, payType: [{ value: R.strings.Please_Select }], selectedPayType: R.strings.Please_Select, };
                }
            }

            //To Check Referral Service Data Fetch or Not
            if (referralServiceData) {
                try {
                    if (state.referralServiceData == null || (state.referralServiceData != null && referralServiceData !== state.referralServiceData)) {
                        if (validateResponseNew({ response: referralServiceData, isList: true })) {

                            let res = parseArray(referralServiceData.ReferralServiceDropDownList);
                            res.map((item, index) => {
                                res[index].Id = item.Id;
                                res[index].value = item.ServiceSlab;
                            })
                            let currencyItem = [
                                ...state.serviceSlab,
                                ...res
                            ];
                            return { ...state, serviceSlab: currencyItem, referralServiceData };
                        }
                        else {
                            return { ...state, serviceSlab: [{ value: R.strings.Please_Select }], selectedServiceSlab: R.strings.Please_Select, referralServiceData };
                        }
                    }
                } catch (e) {
                    return { ...state, serviceSlab: [{ value: R.strings.Please_Select }], selectedServiceSlab: R.strings.Please_Select, };
                }
            }

            //To Check Referral Service Data Fetch or Not
            if (invitesData) {
                try {
                    if (state.invitesData == null || (state.invitesData != null && invitesData !== state.invitesData)) {
                        if (validateResponseNew({ response: invitesData, isList: true })) {

                            let res = parseArray(invitesData.ReferralChannelList);

                            return { ...state, data: res, invitesData, row: addPages(invitesData.TotalCount), refreshing: false };
                        }
                        else {
                            return { ...state, data: [], refreshing: false, row: [] };
                        }
                    }
                } catch (e) {
                    return { ...state, data: [], row: [], refreshing: false };
                }
            }

        }
        return null;
    }

    /* Drawer Navigation */
    navigationDrawer() {
        return (
            <FilterWidget
                FromDatePickerCall={(date) => this.setState({ FromDate: date })}
                FromDate={this.state.FromDate}
                ToDatePickerCall={(date) => this.setState({ ToDate: date })}
                ToDate={this.state.ToDate}
                toastRef={component => this.toast = component}
                textInputStyle={{ marginTop: 0, }}
                textInputs={[
                    {
                        header: R.strings.userName,
                        placeholder: R.strings.userName,
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
                        onPickerSelect: (index) => { this.setState({ selectedChannelType: index }) }
                    },
                    {
                        title: R.strings.ServiceSlab,
                        array: this.state.serviceSlab,
                        selectedValue: this.state.selectedServiceSlab,
                        onPickerSelect: (index) => { this.setState({ selectedServiceSlab: index }) }
                    },
                    {
                        title: R.strings.PayType,
                        array: this.state.payType,
                        selectedValue: this.state.selectedPayType,
                        onPickerSelect: (index) => { this.setState({ selectedPayType: index }) }
                    },

                ]}
                onResetPress={this.onResetPress}
                onCompletePress={this.onCompletePress}
            />
        )
    }


    render() {
        const { loadingInvitesData } = this.props;

        let list = this.state.data;
        //apply filter on User name, ChannelType and Paytype 
        let finalItems = list.filter(item => (item.UserName.toLowerCase().includes(this.state.search.toLowerCase())) ||
            item.ChannelTypeName.toLowerCase().includes(this.state.search.toLowerCase()) ||
            item.PayTypeName.toLowerCase().includes(this.state.search.toLowerCase())
        );

        return (
            <Drawer ref={cmp => this.drawer = cmp} drawerWidth={R.dimens.FilterDrawarWidth}
                onDrawerClose={() => this.setState({ isDrawerOpen: false })}
                type={Drawer.types.Overlay}
                drawerContent={this.navigationDrawer()} onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
                drawerPosition={Drawer.positions.Right}
                easingFunc={Easing.ease}>

                <SafeView
                    style={{ flex: 1, backgroundColor: R.colors.background }}
                >

                    {/* To set status bar as per our theme */}
                    <CommonStatusBar />

                    {/* To set toolbar as per our theme */}
                    <CustomToolbar
                        title={R.strings.invites}
                        isBack={true}
                        nav={this.props.navigation}
                        searchable={true}
                        onSearchText={(input) => this.setState({ search: input })}
                        rightIcon={R.images.FILTER}
                        onRightMenuPress={() => { this.drawer.openDrawer() }}
                    />

                    <View style={{ flex: 1, justifyContent: 'space-between' }}>
                        {
                            loadingInvitesData && !this.state.refreshing ?
                                <ListLoader />
                                :
                                <View style={{ flex: 1 }}>
                                    {finalItems.length > 0 ?
                                        <View style={{ flex: 1 }}>
                                            <FlatList
                                                data={finalItems}
                                                showsVerticalScrollIndicator={false}
                                                renderItem={({ item, index }) =>
                                                    <ReferralInvitesItem
                                                        item={item}
                                                        index={index}
                                                        size={this.state.data.length}
                                                    />
                                                }
                                                keyExtractor={(item, index) => index.toString()}
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
                            {finalItems.length > 0 &&
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
class ReferralInvitesItem extends Component {
    constructor(props) {
        super(props);

    }

    shouldComponentUpdate(nextProps) {
        //if old item and new item are different than only render list item
        if (this.props.item === nextProps.item) {
            return false
        }
        return true
    }

    render() {
        let item = this.props.item;
        let { index, size, } = this.props;
        let color = item.Status == 1 ? R.colors.successGreen : R.colors.failRed;
        let paytype = item.PayTypeName ? item.PayTypeName : '-';
        let imageType = R.images.IC_EMAIL_FILLED;

        // for channel Type
        if (item.ChannelTypeName === 'SMS') imageType = R.images.IC_COMPLAINT;
        if (item.ChannelTypeName === 'Email') imageType = R.images.IC_EMAIL_FILLED;
        if (item.ChannelTypeName === 'Twitter') imageType = R.images.IC_TWITTER;
        if (item.ChannelTypeName === 'Linkedin') imageType = R.images.IC_LINKEDIN_LOGO;
        if (item.ChannelTypeName === 'Insta') imageType = R.images.IC_INSTAGRAM_LOGO;
        if (item.ChannelTypeName === 'Facebook') imageType = R.images.IC_FACEBOOK_LOGO;

        // for paytype
        if (paytype === "Percentage on maker/taker charges") paytype = paytype.replace("Percentage", "%")

        return (
            // Flatlist item animation
            <AnimatableItem>
                <View
                    style={{
                        marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                        flex: 1, marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                        marginLeft: R.dimens.widget_left_right_margin, marginRight: R.dimens.widget_left_right_margin,
                    }}>
                    <CardView
                        style={{
                            elevation: R.dimens.listCardElevation,
                            flex: 1,
                            borderRadius: 0, borderBottomLeftRadius: R.dimens.margin, borderTopRightRadius: R.dimens.margin,
                        }}>

                        {/* for show icon and ChannelType , PayType ,referralMessage */}
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
                            <ImageTextButton
                                icon={imageType}
                                style={{ justifyContent: 'center', alignSelf: 'center', width: R.dimens.ButtonHeight, height: R.dimens.ButtonHeight, margin: 0, backgroundColor: R.colors.accent, borderRadius: R.dimens.ButtonHeight }}
                                iconStyle={{ width: R.dimens.drawerMenuIconWidthHeight, height: R.dimens.drawerMenuIconWidthHeight, tintColor: R.colors.white }}
                            />
                            <View style={{ flex: 1, paddingLeft: R.dimens.margin, paddingRight: R.dimens.margin }}>
                                <Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold }}>
                                    {R.strings.invited} {item.ReferralReceiverAddress ? item.ReferralReceiverAddress : ''} {R.strings.via} {item.ChannelTypeName ? item.ChannelTypeName : '-'}</Text>
                                <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>
                                    {R.strings.PayType + ' :'}<TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText, }}> {paytype}</TextViewHML></TextViewHML>
                                <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>{R.strings.referralMessage} {item.Description ? item.Description : '-'}</TextViewHML>
                            </View>
                        </View>

                        {/* for show time and status */}
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row' }}>
                                <StatusChip
                                    color={color}
                                    value={item.Status == 1 ? 'Success' : 'Failed'}></StatusChip>
                            </View>
                            <ImageTextButton
                                style={{ margin: 0, paddingRight: R.dimens.LineHeight, }}
                                icon={R.images.IC_TIMER}
                                iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
                            />
                            <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{item.CreatedDate ? convertDate(item.CreatedDate) + ' ' + convertTime(item.CreatedDate) : '-'}</TextViewHML>
                        </View>
                    </CardView>
                </View>
            </AnimatableItem>
        )
    }
}

function mapStateToProps(state) {

    //updated data of reducer
    return {
        referralChannelTypeData: state.pairListReducer.referralChannelTypeData,
        isLoadingReferralChannelType: state.pairListReducer.isLoadingReferralChannelType,

        referralPaytypeData: state.pairListReducer.referralPaytypeData,
        isLoadingReferralPaytype: state.pairListReducer.isLoadingReferralPaytype,

        referralServiceData: state.pairListReducer.referralServiceData,
        isLoadingReferralService: state.pairListReducer.isLoadingReferralService,

        invitesData: state.ReferralInvitesReducer.invitesData,
        loadingInvitesData: state.ReferralInvitesReducer.loadingInvitesData,

    }
}
function mapDispatchToProps(dispatch) {
    return {
        //Perform getReferralChannelType Action 
        getReferralChannelType: () => dispatch(getReferralChannelType()),
        //Perform getReferralPaytype Action 
        getReferralPaytype: () => dispatch(getReferralPaytype()),
        //Perform getReferralService Action 
        getReferralService: (requestService) => dispatch(getReferralService(requestService)),
        //Perform getReferralInvitesData List Action 
        getReferralInvitesData: (requestInviteData) => dispatch(getReferralInvitesData(requestInviteData)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReferralInvitesScreen)