import React, { Component } from 'react';
import { View, Text, FlatList, RefreshControl, Easing } from 'react-native';
import { isCurrentScreen } from '../../Navigation';
import { changeTheme, convertDate, parseArray, convertTime } from '../../../controllers/CommonUtils';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import R from '../../../native_theme/R';
import { contentContainerStyle, ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import { getReferralPaytype, getReferralService } from '../../../actions/PairListAction';
import { connect } from 'react-redux';
import { AppConfig } from '../../../controllers/AppConfig';
import { isInternet, validateResponseNew } from '../../../validations/CommonValidation';
import { DateValidation } from '../../../validations/DateValidation';
import Drawer from 'react-native-drawer-menu';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import ListLoader from '../../../native_theme/components/ListLoader';
import { getAdminRefChannelList } from '../../../actions/account/ReferralSystemAction';
import FilterWidget from '../../widget/FilterWidget';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import CardView from '../../../native_theme/components/CardView';
import { Fonts } from '../../../controllers/Constants';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import SafeView from '../../../native_theme/components/SafeView';

class SocialMediaShareScreen extends Component {
    constructor(props) {
        super(props);
        let referralChannelTypeId = props.navigation.state.params ? props.navigation.state.params.ReferralChannelTypeId : 0
        this.state = {
            SocialMediaShareResponse: [],
            flag: true,
            row: [],
            selectedPage: 1,
            refreshing: false,
            searchInput: '',
            FromDate: '',
            ToDate: '',
            UserName: '',
            selectedPayType: R.strings.Please_Select,
            selectedPayTypeId: 0,
            selectedServiceSlab: R.strings.Please_Select,
            selectedServiceSlabId: 0,
            referralChannelTypeId: referralChannelTypeId,
            isFirstTime: true,
            payTypes: [{ value: R.strings.Please_Select }],
            serviceSlabTypes: [{ value: R.strings.Please_Select }],
        };

        //initial request
        this.Request = {
            ReferralChannelTypeId: referralChannelTypeId,
            PageIndex: 1,
            Page_Size: AppConfig.pageSize,
        }

        //create reference
        this.drawer = React.createRef();
        this.toast = React.createRef();
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        // Stop twice api calling
        return isCurrentScreen(nextProps);
    };

    onRefresh = async () => {
        this.setState({ refreshing: true });
        // Check internet connection
        if (await isInternet()) {
            // Call SMS Invite Api
            this.props.getAdminRefChannelList(this.Request)
        } else {
            this.setState({ refreshing: false })
        }
    }

    componentDidMount = async () => {
        // Change theme as per night or light theme which is stored by user
        changeTheme()

        // Check internet connection
        if (await isInternet()) {

            // Call SMS Invite List Api
            this.props.getAdminRefChannelList(this.Request)
            // Call Referral PayType Api
            this.props.getReferralPaytype()
            // Call Service Slab Type Api
            this.props.getReferralService({ PayTypeId: 0 })
        }
    };

    // Reset value of drawer widget
    onResetPress = async () => {
        // Close Drawer
        this.drawer.closeDrawer();

        // change state to empty
        this.setState({
            selectedPayType: R.strings.Please_Select,
            UserName: '',
            selectedPayTypeId: 0,
            selectedServiceSlab: R.strings.Please_Select,
            selectedServiceSlabId: 0,
            ToDate: '',
            FromDate: '',
        })

        //Check NetWork is Available or not
        if (await isInternet()) {

            this.Request = {
                ...this.Request,
                UserName: '',
                ReferralServiceId: 0,
                ToDate: '',
                ReferralPayTypeId: 0,
                FromDate: '',
            }

            //Call Get SMS Invite API
            this.props.getAdminRefChannelList(this.Request);

        } else {
            this.setState({ refreshing: false });
        }
    }

    onPayTypeChange = async (item, object) => {
        try {

            if (object.Id != this.state.selectedPayTypeId) {

                //Check NetWork is Available or not
                if (await isInternet()) {

                    // Referral Service Slab Api Call
                    this.props.getReferralService({ PayTypeId: object.Id })

                    this.setState({ flag: false, selectedPayType: item, selectedPayTypeId: object.Id, selectedServiceSlab: R.strings.Please_Select })
                }
            }
        } catch (error) {

        }
    }

    // Called when user press on complete button from drawer
    onCompletePress = async () => 
    {
        //Check All From Date Validation
        if (this.state.FromDate == "" && 
        this.state.ToDate !== "" || 
        this.state.FromDate !== "" && 
        this.state.ToDate == "") {
            this.toast.Show(R.strings.bothDateRequired);
            return
        }

        if (DateValidation(this.state.FromDate, this.state.ToDate, true)) 
        {
            this.toast.Show(DateValidation(this.state.FromDate, this.state.ToDate, true));
        } 
        else 
        {
            // Close Drawer
            this.drawer.closeDrawer();

            this.Request = 
            {
                ...this.Request,
                UserName: this.state.UserName,
                ToDate: this.state.ToDate,
                FromDate: this.state.FromDate,
                ReferralServiceId: R.strings.Please_Select === this.state.selectedServiceSlab ? 0 : this.state.selectedServiceSlabId,
                ReferralPayTypeId: R.strings.Please_Select === this.state.selectedPayType ? 0 : this.state.selectedPayTypeId,
            }

            // Check internet connection
            if (await isInternet()) {

                // Call SMS Invite Api with filteration
                this.props.getAdminRefChannelList(this.Request)
            }
        }
    }

    // Get Toolbar Title
    getToolbarTitle = (title) => {

        //set screen title
        let toolbarTitle

        if (title == 3)
            toolbarTitle = R.strings.facebookShare
        else if (title == 4)
            toolbarTitle = R.strings.twitterShare
        else if (title == 5)
            toolbarTitle = R.strings.linkedinShare
        else if (title == 6)
            toolbarTitle = R.strings.googlePlusShare
        else if (title == 7)
            toolbarTitle = R.strings.instagramShare
        else if (title == 8)
            toolbarTitle = R.strings.pinterest
        else if (title == 9)
            toolbarTitle = R.strings.telegram

        return toolbarTitle
    }

    // Get Icon of Social Media
    getIcon = (id) => {
        let icon

        if (id == 3)
            icon = R.images.IC_FACEBOOK_LOGO
        else if (id == 4)
            icon = R.images.IC_TWITTER
        else if (id == 5)
            icon = R.images.IC_LINKEDIN_LOGO
        else if (id == 6)
            icon = R.images.IC_GPLUS_LOGO
        else if (id == 7)
            icon = R.images.IC_INSTAGRAM_LOGO
        else if (id == 8)
            icon = R.images.IC_PINTEREST_LOGO
        else if (id == 9)
            icon = R.images.IC_TELEGRAM_LOGO

        return icon
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
        if (SocialMediaShareScreen.oldProps !== props) {

            SocialMediaShareScreen.oldProps = props;

        } else {

            return null;
        }

        if (isCurrentScreen(props)) {
            //Get All Updated field of Particular actions
            const { AdminRefChannelData, } = props.AdminReferralList
            const { referralServiceData,
                referralPaytypeData } = props.PairListData

            // AdminRefChannelData is not null
            if (AdminRefChannelData) {
                try {
                    if (state.AdminRefChannelData == null || (state.AdminRefChannelData != null && AdminRefChannelData !== state.AdminRefChannelData)) {

                        if (validateResponseNew({ response: AdminRefChannelData, isList: true })) {
                            //check Admin Referral Channel List is an Array Or not
                            //If Response is Array then Direct set in state otherwise conver response to Array form then set state.
                            let res = parseArray(AdminRefChannelData.ReferralChannelList)

                            return Object.assign({}, state, {
                                AdminRefChannelData,
                                SocialMediaShareResponse: res,
                                refreshing: false
                            })
                        } else {
                            return Object.assign({}, state, {
                                AdminRefChannelData: null,
                                SocialMediaShareResponse: [],
                                refreshing: false
                            })
                        }
                    }
                } catch (error) {
                    return Object.assign({}, state, {
                        AdminRefChannelData: null,
                        refreshing: false,
                        SocialMediaShareResponse: [],
                    })
                }
            }

            // referralPaytypeData
            if (referralPaytypeData) 
            {
                try {
                    if (state.referralPaytypeData == null || 
                        (state.referralPaytypeData != null && 
                            referralPaytypeData !== state.referralPaytypeData)) 
                            {
                        // Handle response
                        if (validateResponseNew({ response: referralPaytypeData, isList: true })) {
                            // Fill dropdown data
                            let res = parseArray(referralPaytypeData.ReferralPayTypeDropDownList)
                            res.map((item, index) => 
                            {
                                res[index].value = item.PayTypeName;
                                res[index].Id = item.Id;
                            })

                            let payTypes = 
                            [
                                { value: R.strings.Please_Select },
                                ...res
                            ];

                            return Object.assign({}, state, 
                                {
                                referralPaytypeData,  payTypes,
                            })

                        } else {
                            return Object.assign({}, state, {
                                referralPaytypeData: null,  payTypes: [{ value: R.strings.Please_Select }],
                            })
                        }
                    }
                } catch (error) 
                {
                    return Object.assign({}, state, 
                        {
                        referralPaytypeData: null,
                        payTypes: [{ value: R.strings.Please_Select }],
                    })
                }
            }

            // referralServiceData is not null
            if (referralServiceData) {
                try {
                    if (state.referralServiceData == null || 
                        (state.referralServiceData != null && 
                            referralServiceData !== state.referralServiceData)) 
                            {
                        // Handle response
                        if (validateResponseNew({ response: referralServiceData, isList: true })) {
                            // Fill dropdown data

                            let res = parseArray(referralServiceData.ReferralServiceDropDownList)
                            res.map((item, index) => {
                                res[index].value = item.ServiceSlab;
                                res[index].Id = item.Id;
                            })

                            let serviceSlabTypes = 
                            [
                                { value: R.strings.Please_Select },
                                ...res
                            ]

                            return Object.assign({}, state, 
                                {
                                    serviceSlabTypes,
                                    referralServiceData,
                            })
                        } else {
                            return Object.assign({}, state, {
                                serviceSlabTypes: [],
                                referralServiceData: null,
                            })
                        }
                    }
                } catch (error) {
                    return Object.assign({}, state, {
                        serviceSlabTypes: [],
                        referralServiceData: null,
                    })
                }
            }
        }

        return null
    }

    navigationDrawer = () => {
        return (
            <FilterWidget
                onCompletePress={this.onCompletePress}
                ToDatePickerCall={(ToDate) => this.setState({ ToDate })}
                FromDate={this.state.FromDate}
                textInputs={[
                    {
                        returnKeyType: "done",
                        header: R.strings.UserName,
                        placeholder: R.strings.UserName,
                        multiline: false,
                        onChangeText: (text) => { this.setState({ UserName: text }) },
                        value: this.state.UserName,
                        keyboardType: 'default',
                    },
                ]}
                ToDate={this.state.ToDate}
                toastRef={component => this.toast = component}
                FromDatePickerCall={(FromDate) => this.setState({ FromDate })}
                onResetPress={this.onResetPress}
                firstPicker={{
                    title: R.strings.PayType,
                    array: this.state.payTypes,
                    selectedValue: this.state.selectedPayType,
                    onPickerSelect: (item, object) => { this.onPayTypeChange(item, object) }
                }}
                secondPicker={{
                    title: R.strings.ServiceSlab,
                    array: this.state.serviceSlabTypes,
                    selectedValue: this.state.selectedServiceSlab,
                    onPickerSelect: (item, object) => this.setState({ selectedServiceSlab: item, selectedServiceSlabId: object.Id })
                }}
                comboPickerStyle={{ marginTop: R.dimens.LineHeight, }}
            />
        )
    }

    render() {
        // get toolbar bar title
        let { isLoadingReferralService } = this.props.PairListData
        let icon = this.getIcon(this.state.referralChannelTypeId)
        let { AdminRefChannelLoading } = this.props.AdminReferralList
        let toolbarTitle = this.getToolbarTitle(this.state.referralChannelTypeId)
        // for searching
        let finalItems = this.state.SocialMediaShareResponse.filter(item => (
            item.UserName.toString().toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
            item.PayTypeName.toString().toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
            item.ChannelTypeName.toString().toLowerCase().includes(this.state.searchInput.toLowerCase())
        ))

        return (
            //DrawerLayout for Facebook History Filteration
            <Drawer
                ref={cmpDrawer => this.drawer = cmpDrawer}
                drawerWidth={R.dimens.FilterDrawarWidth}
                drawerContent={this.navigationDrawer()}
                type={Drawer.types.Overlay}
                drawerPosition={Drawer.positions.Right}
                easingFunc={Easing.ease}>

                <SafeView style={this.styles().container}>
                    {/* Statusbar for Facebook Share  */}
                    <CommonStatusBar />

                    {/* CustomToolbar for Facebook Share */}
                    <CustomToolbar
                        title={toolbarTitle}
                        isBack={true}
                        nav={this.props.navigation}
                        searchable={true}
                        onSearchText={(text) => this.setState({ searchInput: text })}
                        rightIcon={R.images.FILTER}
                        onRightMenuPress={() => this.drawer.openDrawer()} />

                    {/* Progress bar for Referral Service Slab Dropdown */}
                    {
                        (!this.state.flag) &&
                        <ProgressDialog isShow={isLoadingReferralService} />
                    }

                    <View style={{ flex: 1, paddingBottom: R.dimens.WidgetPadding }}>
                        {
                            (AdminRefChannelLoading && !this.state.refreshing) ?
                                <ListLoader />
                                :
                                <FlatList
                                    data={finalItems}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={({ item, index }) => {
                                        return <SocialMediaShareItem
                                            item={item}
                                            size={finalItems.length}
                                            index={index}
                                            icon={icon}
                                        />
                                    }}
                                    keyExtractor={(item, index) => index.toString()}
                                    refreshControl={
                                        <RefreshControl
                                            colors={[R.colors.accent]}
                                            progressBackgroundColor={R.colors.background}
                                            refreshing={this.state.refreshing}
                                            onRefresh={this.onRefresh}
                                        />
                                    }
                                    contentContainerStyle={contentContainerStyle(finalItems)}
                                    ListEmptyComponent={<ListEmptyComponent />}
                                />
                        }
                    </View>

                </SafeView>
            </Drawer>
        );
    }

    styles = () => {
        return {
            container: {
                flex: 1,
                backgroundColor: R.colors.background,
            },
        }
    }
}

export class SocialMediaShareItem extends Component {
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
        let { item, size, index, icon } = this.props
        return (
            // Flatlist item animation
            <AnimatableItem>
                <View style={{
                    flex: 1, marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin, marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginLeft: R.dimens.widget_left_right_margin,
                    marginRight: R.dimens.widget_left_right_margin
                }}>

                    <CardView style={{
                        elevation: R.dimens.listCardElevation,
                        borderBottomLeftRadius: R.dimens.margin,
                        flex: 1, borderRadius: 0, borderTopRightRadius: R.dimens.margin,
                    }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
                            <ImageTextButton
                                icon={icon}
                                style={{ justifyContent: 'center', alignSelf: 'center', width: R.dimens.ButtonHeight, height: R.dimens.ButtonHeight, margin: 0, backgroundColor: R.colors.accent, borderRadius: R.dimens.ButtonHeight }}
                                iconStyle={{ width: R.dimens.drawerMenuIconWidthHeight, height: R.dimens.drawerMenuIconWidthHeight, tintColor: R.colors.white }}
                            />
                            <View style={{ flex: 1, paddingLeft: R.dimens.margin, paddingRight: R.dimens.margin }}>
                                <Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold }}>{R.strings.invited} {item.ReferralReceiverAddress ? item.ReferralReceiverAddress : ''} {R.strings.via} {item.ChannelTypeName ? item.ChannelTypeName : '-'}</Text>
                                <TextViewHML style={this.styles().titleStyle}>{R.strings.PayType + ': '}<TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText, }}>{item.PayTypeName ? item.PayTypeName : '-'}</TextViewHML></TextViewHML>
                                <TextViewHML style={this.styles().valueStyle}>{item.Description ? item.Description : '-'}</TextViewHML>
                            </View>
                        </View>

                        {/* for show time */}
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <ImageTextButton
                                style={{ margin: 0, paddingRight: R.dimens.LineHeight, }}
                                icon={R.images.IC_TIMER}
                                iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
                            />
                            <TextViewHML style={this.styles().titleStyle}>{item.CreatedDate ? convertDate(item.CreatedDate) + ' ' + convertTime(item.CreatedDate) : '-'}</TextViewHML>
                        </View>
                    </CardView>
                </View>
            </AnimatableItem>
        )
    }

    styles = () => {
        return {
            titleStyle: {
                fontSize: R.dimens.smallestText,
                color: R.colors.textSecondary,
            },
            valueStyle: {
                fontSize: R.dimens.smallestText,
                color: R.colors.textPrimary,
            }
        }
    }
}

function mapStateToProps(state) {
    
    //updated data for reducer
    return {
        AdminReferralList: state.ReferralSystemReducer,
        PairListData: state.pairListReducer,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        
        // Facebook share Invite List
        getAdminRefChannelList: (payload) => dispatch(getAdminRefChannelList(payload)),
        
        // Pay Type
        getReferralPaytype: () => dispatch(getReferralPaytype()),
        
        // Service Slab Type
        getReferralService: (payload) => dispatch(getReferralService(payload)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SocialMediaShareScreen)
