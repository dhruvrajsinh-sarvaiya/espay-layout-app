/**
 * Created By Dipesh
 * Created Date 01/03/19
 * Screen for Referral participant
 */

import React, { Component } from 'react';
import {
    View,
    FlatList,
    RefreshControl,
    Easing,
} from 'react-native';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { connect } from 'react-redux';
import { getReferralParticipate, clearParticipantData } from '../../../actions/account/ReferralParticipantAction';
import { getReferralChannelType, getReferralService } from '../../../actions/PairListAction'
import { changeTheme, parseArray, addPages, convertDate, convertTime, getCurrentDate } from '../../../controllers/CommonUtils';
import { isCurrentScreen, addRouteToBackPress } from '../../Navigation';
import PaginationWidget from '../../widget/PaginationWidget';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import { isInternet, validateResponseNew, isEmpty } from '../../../validations/CommonValidation';
import ListLoader from '../../../native_theme/components/ListLoader';
import Drawer from 'react-native-drawer-menu';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import R from '../../../native_theme/R';
import FilterWidget from '../../widget/FilterWidget';
import { DateValidation } from '../../../validations/DateValidation';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import CardView from '../../../native_theme/components/CardView';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import SafeView from '../../../native_theme/components/SafeView';
import { AppConfig } from '../../../controllers/AppConfig';

class ReferralParticipantScreen extends Component {

    constructor(props) {
        super(props);

        this.drawer = React.createRef();

        //Add Current Screen to Manual Handling BackPress Events
        addRouteToBackPress(props);

        //Define All State initial state
        this.state = {
            refreshing: false,
            searchInput: '',
            response: [],
            fromDate: getCurrentDate(),
            toDate: getCurrentDate(),
            userName: '',
            referUserName: '',
            spinnerChannelTypeData: [],
            selectedChannelType: '',
            selectedChanelId: '',
            spinnerServiceSlabData: [],
            selectedServicelab: '',
            selectedServicelabId: '',
            selectedPage: 0,
            row: [],
            isFirstTime: true,
            referralServiceData: null,
        };
        //----------

        //To Bind All Method
        this.onBackPress = this.onBackPress.bind(this);
        this.props.navigation.setParams({ onBackPress: this.onBackPress });
    }

    async componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {

            let request = {
                PageIndex: this.state.selectedPage,
                Page_Size: AppConfig.pageSize,
                FromDate: this.state.fromDate,
                ToDate: this.state.toDate
            }

            //Call Fetch referral participant api
            this.props.getReferralParticipate(request);
            //----------

            //api call for channel type spinner
            this.props.getReferralChannelType();
            //----

            //api call for service slab spinner
            this.props.getReferralService({ PayTypeId: 0 });
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
            //for fetch API
            const { listReferralParticipateData, listChannelTypeData, listServiceData } = props.appData;
            //check fetch Question API response.
            if (listReferralParticipateData) {
                try {
                    if (state.listReferralParticipateData == null || (state.listReferralParticipateData != null && listReferralParticipateData !== state.listReferralParticipateData)) {
                        //handle response of API
                        if (validateResponseNew({ response: listReferralParticipateData, isList: true })) {
                            //check News Response is an Array Or not
                            //If Response is Array then Direct set in state otherwise conver response to Array form then set state.
                            var res = parseArray(listReferralParticipateData.ReferralUserList)
                            return {
                                ...state, response: res, refreshing: false, row: addPages(listReferralParticipateData.TotalCount),
                                listReferralParticipateData
                            }
                        }
                        else {
                            return {
                                ...state,
                                listReferralParticipateData,
                                response: [],
                                refreshing: false,
                                row: []
                            }
                        }
                    }
                } catch (e) {
                    return {
                        ...state,
                        response: [],
                        refreshing: false,
                        row: []
                    }
                }
            }

            if (listChannelTypeData) {
                try {
                    if (state.listChannelTypeData == null || (state.listChannelTypeData != null && listChannelTypeData !== state.listChannelTypeData)) {
                        //handle response of API
                        if (validateResponseNew({ response: listChannelTypeData, isList: true })) {
                            //If Response is Array then Direct set in state otherwise conver response to Array form then set state.
                            var data = parseArray(listChannelTypeData.ReferralChannelTypeDropDownList)
                            data.map((item, index) => {
                                data[index].value = data[index].ChannelTypeName
                            })
                            var spinnerDataFilled = [{ value: R.strings.select + ' ' + R.strings.channel_type }, ...data]
                            return {
                                ...state, spinnerChannelTypeData: spinnerDataFilled, selectedChannelType: R.strings.select + ' ' + R.strings.channel_type, listChannelTypeData
                            }

                        }
                    }
                } catch (e) {
                    return {
                        ...state, selectedChannelType: R.strings.select + ' ' + R.strings.channel_type
                    }
                }
            }

            if (listServiceData) {
                try {
                    if (state.listServiceData == null || (state.listServiceData != null && listServiceData !== state.listServiceData)) {
                        //handle response of API
                        if (validateResponseNew({ response: listServiceData, isList: true })) {

                            //If Response is Array then Direct set in state otherwise conver response to Array form then set state.
                            var serviceData = parseArray(listServiceData.ReferralServiceDropDownList)
                            serviceData.map((item, index) => {
                                serviceData[index].value = serviceData[index].ServiceSlab
                            })
                            var resSpinnerServiceSlabData = [{ value: R.strings.select + ' ' + R.strings.service_slab }, ...serviceData]
                            return {
                                ...state, spinnerServiceSlabData: resSpinnerServiceSlabData, selectedServicelab: R.strings.select + ' ' + R.strings.service_slab, listServiceData
                            }
                        }
                    }
                } catch (e) {
                    return {
                        ...state, selectedServicelab: R.strings.select + ' ' + R.strings.service_slab
                    }
                }
            }
        }
        return null;
    }

    //For Swipe to referesh Functionality
    onRefresh = async (needUpdate, fromRefreshControl = false) => {
        if (fromRefreshControl)
            this.setState({ refreshing: true });
        //Check NetWork is Available or not
        if (needUpdate && await isInternet()) {

            let referralServiceId = this.state.selectedServicelab === this.state.spinnerServiceSlabData[0].value ? '' : this.state.selectedServicelabId
            let referralChannelId = this.state.selectedChannelType === this.state.spinnerChannelTypeData[0].value ? '' : this.state.selectedChanelId

            let request = {
                ReferralServiceId: referralServiceId, UserName: this.state.userName,
                PageIndex: this.state.selectedPage, Page_Size: 10,
                FromDate: this.state.fromDate, ToDate: this.state.toDate,
                ReferralChannelTypeId: referralChannelId,
                ReferUserName: this.state.referUserName,
            }

            //Call Fetch referral participant api
            this.props.getReferralParticipate(request);
        }
        else {
            this.setState({ refreshing: false });
        }
        //--------------
    }
    //-----------

    // Pagination Method Called When User Change Page  
    onPageChange = async (pageNo) => {

        if (!(pageNo - 1) == this.state.selectedPage) {

            //Check NetWork is Available or not
            if (await isInternet()) {
                this.setState({ selectedPage: pageNo - 1 });

                let referralChannelId = this.state.selectedChannelType === this.state.spinnerChannelTypeData[0].value ? '' : this.state.selectedChanelId
                let referralServiceId = this.state.selectedServicelab === this.state.spinnerServiceSlabData[0].value ? '' : this.state.selectedServicelabId

                let request = {
                    PageIndex: pageNo - 1,
                    Page_Size: 10,
                    ReferralServiceId: referralServiceId,
                    UserName: this.state.userName,
                    ReferUserName: this.state.referUserName,
                    FromDate: this.state.fromDate,
                    ToDate: this.state.toDate,
                    ReferralChannelTypeId: referralChannelId,
                }

                //Call Fetch referral participant data api
                this.props.getReferralParticipate(request);
                //----------
            }
        }
        //--------------
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps);
    };

    componentWillUnmount() {
        this.props.clearParticipantData();
    }

    /* Reset Filter */
    _onResetPress = async () => {
        this.setState({
            searchInput: '',
            selectedServicelab: this.state.spinnerServiceSlabData[0].value,
            selectedChannelType: this.state.spinnerChannelTypeData[0].value,
            userName: '',
            referUserName: '',
            selectedPage: 0,
            fromDate: '',
            toDate: ''
        })

        /* Close Drawer user press on Complete button bcoz display flatlist item on Screen */
        this.drawer.closeDrawer();

        //Check NetWork is Available or not
        if (await isInternet()) {
            //Call Fetch referral participant api
            this.request = {
                //...this.request,
                PageIndex: 0,
                Page_Size: 10,
            }

            //Call Fetch referral participant api
            this.props.getReferralParticipate(this.request);
            //----------
        }
        //--------------
    }

    /* Api Call when press on complete button */
    _onCompletePress = async () => {

        //Check All From Date and To Date Validation
        if (DateValidation(this.state.fromDate, this.state.toDate, true)) {
            this.toast.Show(DateValidation(this.state.fromDate, this.state.toDate));
            return;
        }
        else {
            /* Close Drawer user press on Complete button bcoz display flatlist item on Screen */
            this.drawer.closeDrawer();

            // call API For filteration
            //Check NetWork is Available or not
            if (await isInternet()) {

                //Call Fetch referral participant api

                let referralChannelId = this.state.selectedChannelType === this.state.spinnerChannelTypeData[0].value ? '' : this.state.selectedChanelId
                let referralServiceId = this.state.selectedServicelab === this.state.spinnerServiceSlabData[0].value ? '' : this.state.selectedServicelabId

                let request = {
                    PageIndex: this.state.selectedPage,
                    Page_Size: 10,
                    ReferralServiceId: referralServiceId,
                    UserName: this.state.userName,
                    ReferUserName: this.state.referUserName,
                    FromDate: this.state.fromDate,
                    ToDate: this.state.toDate,
                    ReferralChannelTypeId: referralChannelId,
                }

                //Call Fetch referral participant api
                this.props.getReferralParticipate(request);
                //----------
            }
            //--------------
            //If Filter from Complete Button make search imput empty
            this.setState({ searchInput: '' })
        }
    }

    /* Drawer Navigation */
    navigationDrawer() {
        return (
            <FilterWidget
                FromDatePickerCall={(date) => this.setState({ fromDate: date })}
                ToDatePickerCall={(date) => this.setState({ toDate: date })}
                FromDate={this.state.fromDate}
                ToDate={this.state.toDate}
                toastRef={component => this.toast = component}
                onResetPress={this._onResetPress}
                onCompletePress={this._onCompletePress}
                comboPickerStyle={{ marginTop: 0, }}
                textInputs={[
                    {
                        header: R.strings.Username,
                        placeholder: R.strings.Username,
                        multiline: false,
                        keyboardType: 'default',
                        returnKeyType: "next",
                        onChangeText: (text) => { this.setState({ userName: text }) },
                        value: this.state.userName,
                    },
                    {
                        header: R.strings.refer_username,
                        placeholder: R.strings.refer_username,
                        multiline: false,
                        keyboardType: 'default',
                        returnKeyType: "done",
                        onChangeText: (text) => { this.setState({ referUserName: text }) },
                        value: this.state.referUserName,
                    },
                ]}
                pickers={[
                    {
                        title: R.strings.channel_type,
                        array: this.state.spinnerChannelTypeData,
                        selectedValue: isEmpty(this.state.selectedChannelType) ? R.strings.select + ' ' + R.strings.channel_type : this.state.selectedChannelType,
                        onPickerSelect: (value, object) => this.setState({ selectedChannelType: value, selectedChanelId: object.Id })
                    },
                    {
                        title: R.strings.service_slab,
                        selectedValue: isEmpty(this.state.selectedServicelab) ? R.strings.select + ' ' + R.strings.service_slab : this.state.selectedServicelab,
                        array: this.state.spinnerServiceSlabData,
                        onPickerSelect: (value, object) => this.setState({ selectedServicelab: value, selectedServicelabId: object.Id })
                    },
                ]}
            ></FilterWidget>
        );
    }

    render() {
        let { loading } = this.props.appData

        let finalItems = this.state.response
        //for search
        if (finalItems.length > 0) {
            finalItems = finalItems.filter(item =>
                item.UserName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
                item.ReferUserName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
                item.ReferralChanneTypeName.toLowerCase().includes(this.state.searchInput.toLowerCase())
            )
        }

        return (
            //DrawerLayout for API Screen
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

                    {/* To set status bar as per our theme */}
                    <CommonStatusBar />

                    {/* To set toolbar as per our theme */}
                    <CustomToolbar
                        title={R.strings.participant}
                        isBack={true}
                        searchable={true}
                        rightIcon={R.images.FILTER}
                        onRightMenuPress={() => this.drawer.openDrawer()}
                        onSearchText={(input) => this.setState({ searchInput: input })}
                        nav={this.props.navigation}
                    />
                    <View style={{ flex: 1, justifyContent: 'space-between' }}>

                        {(loading && !this.state.refreshing) ?
                            <ListLoader />
                            :
                            <View style={{ flex: 1 }}>

                                {finalItems.length ?
                                    <View style={{ flex: 1 }}>

                                        <FlatList
                                            //data={this.state.data}
                                            data={finalItems}
                                            showsVerticalScrollIndicator={false}
                                            renderItem={({ index, item }) => <ReferralParticipantItem
                                                id={item.Id}
                                                UserName={item.UserName}
                                                ReferUserName={item.ReferUserName}
                                                ReferralChanneTypeName={item.ReferralChanneTypeName}
                                                CreatedDate={item.CreatedDate}
                                                ReferralServiceDescription={item.ReferralServiceDescription}
                                                item={item}
                                                index={index}
                                                size={this.state.response.length}
                                            />
                                            }
                                            /* For Refresh Functionality In FlatList */
                                            refreshControl={
                                                <RefreshControl
                                                    colors={[R.colors.accent]}
                                                    progressBackgroundColor={R.colors.background}
                                                    refreshing={this.state.refreshing}
                                                    onRefresh={() => this.onRefresh(true, true)}
                                                />
                                            }
                                            keyExtractor={item => item.Id.toString()}
                                        />
                                    </View> : <ListEmptyComponent />
                                }
                            </View>
                        }
                        <View>
                            {finalItems.length > 0 &&
                                <PaginationWidget row={this.state.row} selectedPage={this.state.selectedPage + 1} onPageChange={(item) => { this.onPageChange(item) }} />
                            }
                        </View>
                    </View>
                </SafeView>
            </Drawer>
        );
    };
}

class ReferralParticipantItem extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        //if old item and new item are different than only render list item
        if (this.props.item !== nextProps.item) {
            return true
        }
        return false
    }

    render() {
        let { item, size, index } = this.props;
        return (
            // Flatlist item animation
            <AnimatableItem>
                <View style={{
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    flex: 1, marginLeft: R.dimens.widget_left_right_margin, marginRight: R.dimens.widget_left_right_margin,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                }}>
                    <CardView style={{
                        flex: 1, borderRadius: 0, borderBottomLeftRadius: R.dimens.margin,
                        borderTopRightRadius: R.dimens.margin,
                        elevation: R.dimens.listCardElevation,
                    }}>

                        <View style={{ flexDirection: 'row' }}>

                            {/* for show  user icon  */}
                            <View
                                style={{
                                    justifyContent: 'flex-start',
                                    alignSelf: 'flex-start',
                                    alignItems: 'flex-start',
                                    alignContent: 'flex-start'
                                }}
                            >
                                <ImageTextButton
                                    icon={R.images.IC_FILL_USER}
                                    style={{ margin: 0, padding: 0, justifyContent: 'center', alignSelf: 'center', width: R.dimens.SignUpButtonHeight, height: R.dimens.SignUpButtonHeight, backgroundColor: R.colors.accent, borderRadius: R.dimens.ButtonHeight }}
                                    iconStyle={{ width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.white }}
                                />
                            </View>

                            {/* for show UserName,ReferUserName,ReferralChanneType,description */}
                            <View style={{ flex: 1, paddingLeft: R.dimens.widgetMargin }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, }}>{item.UserName ? item.UserName : ' - '}</TextViewHML>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.refer_username + ': '}</TextViewHML>
                                    <TextViewHML style={{
                                        flex: 1, color: R.colors.textPrimary, fontSize: R.dimens.smallestText,
                                        marginLeft: R.dimens.widgetMargin
                                    }}>{item.ReferUserName ? item.ReferUserName : ' - '}</TextViewHML>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.referral_channel_type + ': '}</TextViewHML>
                                    <TextViewHML style={{
                                        flex: 1, color: R.colors.textPrimary, fontSize: R.dimens.smallestText,
                                        marginLeft: R.dimens.widgetMargin
                                    }}>{item.ReferralChanneTypeName ? item.ReferralChanneTypeName : '-'}</TextViewHML>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.description + ': '}</TextViewHML>
                                    <TextViewHML style={{
                                        flex: 1, color: R.colors.textPrimary, fontSize: R.dimens.smallestText,
                                        marginLeft: R.dimens.widgetMargin
                                    }}>{item.ReferralServiceDescription ? item.ReferralServiceDescription : '-'}</TextViewHML>
                                </View>
                            </View>
                        </View>

                        {/* for show time */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <ImageTextButton
                                icon={R.images.IC_TIMER}
                                style={{
                                    margin: 0,
                                    paddingRight: R.dimens.widgetMargin,
                                }}
                                iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
                            />
                            <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{convertDate(item.CreatedDate) + ' ' + convertTime(item.CreatedDate)}</TextViewHML>
                        </View>
                    </CardView>
                </View>
            </AnimatableItem>
        )
    };
}

function mapStateToProps(state) {
    return {
        //data get from the reducer and set to appData
        appData: state.ReferralParticipantReducer,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform getReferralChannelType Action 
        getReferralChannelType: () => dispatch(getReferralChannelType()),
        //Perform getReferralParticipate List Action 
        getReferralParticipate: (request) => dispatch(getReferralParticipate(request)),
        //Perform getReferralService Action 
        getReferralService: (request) => dispatch(getReferralService(request)),
        //Perform clearParticipantData Action 
        clearParticipantData: () => dispatch(clearParticipantData()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReferralParticipantScreen)