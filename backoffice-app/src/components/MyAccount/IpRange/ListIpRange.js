import React, { Component } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import { connect } from 'react-redux';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { changeTheme, parseArray, showAlert, getDeviceID, getIPAddress, addPages, convertDateTime } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../Navigation';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { isInternet, validateResponseNew, validateValue } from '../../../validations/CommonValidation';
import ListLoader from '../../../native_theme/components/ListLoader';
import { contentContainerStyle, ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import PaginationWidget from '../../widget/PaginationWidget';
import { ServiceUtilConstant } from '../../../controllers/Constants';
import R from '../../../native_theme/R';
import { AppConfig } from '../../../controllers/AppConfig';
import { ipRangeList, deleteIpRange, clearIpRange } from '../../../actions/account/IpRangeAction';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import CardView from '../../../native_theme/components/CardView';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import StatusChip from '../../widget/StatusChip';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import SafeView from '../../../native_theme/components/SafeView';

class ListIpRange extends Component {
    constructor(props) {
        super(props);
        this.swipeable = [];
        this.state = {
            response: [],
            searchInput: '',
            refreshing: false,
            ipRangeListData: null,
            PageSize: AppConfig.pageSize,
            selectedPage: 1,
            totalCount: 0,
            row: [],
            isFirstTime: true,
        };
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {
            this.Request = {
                PageIndex: 1,
                Page_Size: this.state.PageSize,
            }

            //call ipRangeList api 
            this.props.ipRangeList(this.Request)
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
            this.Request = {
                PageIndex: this.state.selectedPage,
                Page_Size: this.state.PageSize,
            }

            //call ipRangeList api 
            this.props.ipRangeList(this.Request)
        } else {
            this.setState({ refreshing: false });
        }
    }

    //this method is call when user add or update success from the add or update screen 
    onSuccessAddEdit = async () => {
        this.setState({ selectedPage: 1 })
        //Check NetWork is Available or not
        if (await isInternet()) {
            this.Request = {
                PageIndex: 1,
                Page_Size: this.state.PageSize,
            }

            //call ipRangeList api
            this.props.ipRangeList(this.Request)
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
        if (ListIpRange.oldProps !== props) {
            ListIpRange.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //Get All Updated Feild of Particular actions
            const { ipRangeListData } = props.Listdata;
            if (ipRangeListData) {
                try {
                    if (state.ipRangeListData == null || (state.ipRangeListData != null && ipRangeListData !== state.ipRangeListData)) {
                        if (validateResponseNew({
                            response: ipRangeListData,
                            isList: true,
                        })) {
                            //Get array from response
                            var res = parseArray(ipRangeListData.IPRangeGet);
                            return {
                                ...state,
                                ipRangeListData,
                                response: res,
                                refreshing: false,
                                row: addPages(ipRangeListData.TotalCount)
                            }
                        } else {
                            return {
                                ...state,
                                ipRangeListData,
                                response: [],
                                refreshing: false,
                                row: []
                            }
                        }
                    }
                } catch (e) {
                    //Set State For Api response 
                    return {
                        ...state,
                        response: [],
                        refreshing: false,
                        row: []
                    }
                }
            }
        }
        return null;
    }

    componentWillUnmount() {
        this.props.clearIpRange();
    }

    componentDidUpdate = async (prevProps, prevState) => {
        const { deleteIpRangeData } = this.props.Listdata;
        if (deleteIpRangeData !== prevProps.Listdata.deleteIpRangeData) {
            //Check delete Response 
            if (deleteIpRangeData) {
                try {
                    //Get Api response
                    if (validateResponseNew({
                        response: deleteIpRangeData,
                    })) {
                        showAlert(R.strings.Success, deleteIpRangeData.ReturnMsg + '\n' + ' ', 0, () => {
                            this.setState({ selectedPage: 1 })
                            //clear data
                            this.props.clearIpRange();
                            this.Request = {
                                PageIndex: 1,
                                Page_Size: this.state.PageSize,
                            }

                            //call ipRangeList api
                            this.props.ipRangeList(this.Request)
                        });
                    }
                    else {
                        //clear data
                        this.props.clearIpRange();
                    }
                } catch (e) {

                    //clear data
                    this.props.clearIpRange();
                    //Handle Catch and Notify User to Exception.
                    //Alert.alert('Status', e);
                }
            }
        }
    }

    deleteIpRange = async (item) => {

        //Check NetWork is Available or not
        if (await isInternet()) {
            let DeviceId = await getDeviceID()
            let IPAddress = await getIPAddress()
            showAlert(R.strings.Delete, R.strings.delete_message, 3, () => {
                //To delete request */ 
                let deleteIpRangeRequest = {
                    Id: item.Id,
                    DeviceId: DeviceId,
                    Mode: ServiceUtilConstant.Mode,
                    IPAddress: IPAddress,
                    HostName: ServiceUtilConstant.hostName,
                }

                //call DeleteIpRange api
                this.props.DeleteIpRange(deleteIpRangeRequest);

            }, R.strings.cancel, async () => { })
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
                    PageIndex: pageNo,
                    Page_Size: this.state.PageSize,
                }

                //call ipRangeList api
                this.props.ipRangeList(this.Request)
            }
        }

    }

    render() {
        let finalItems = [];
        const { Loading, isDelete } = this.props.Listdata;

        //search if response length > 0
        if (this.state.response) {
            finalItems = this.state.response.filter(item =>
                item.StartIp.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
                item.EndIp.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
                item.CreatedDate.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
                (R.strings.Active).includes(this.state.searchInput) && item.Status ||
                (R.strings.Inactive).includes(this.state.searchInput) && !item.status
            )
        }

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar
                    searchable={true}
                    onSearchText={(input) => this.setState({ searchInput: input })}
                    rightIcon={R.images.IC_PLUS}
                    title={R.strings.listIpRange} isBack={true} nav={this.props.navigation}
                    onRightMenuPress={() => {
                        this.props.navigation.navigate('AddEditAllowIp', { edit: false, onSuccess: this.onSuccessAddEdit })
                    }}
                />

                {/* ProgressDialog */}
                <ProgressDialog isShow={isDelete} />

                <View style={{ justifyContent: 'space-between', flex: 1, }}>

                    {
                        (Loading && !this.state.refreshing) ?
                            <ListLoader />
                            :
                            <View style={{ flex: 1 }}>
                                {finalItems.length ?
                                    <View style={{ flex: 1 }}>

                                        <FlatList
                                            showsVerticalScrollIndicator={false}
                                            data={finalItems}
                                            renderItem={({ item, index }) => <ListIpRangeItem
                                                item={item}
                                                index={index}
                                                size={this.state.response.length}
                                                ctx={this}
                                                onDelete={() => this.deleteIpRange(item)}
                                            ></ListIpRangeItem>
                                            }
                                            keyExtractor={(item, index) => index.toString()}
                                            contentContainerStyle={contentContainerStyle(finalItems)}
                                            /* For Refresh Functionality FlatList Item */
                                            refreshControl={
                                                <RefreshControl
                                                    colors={[R.colors.accent]}
                                                    progressBackgroundColor={R.colors.background}
                                                    refreshing={this.state.refreshing}
                                                    onRefresh={this.onRefresh}
                                                />
                                            }
                                        />
                                    </View>
                                    :
                                    // Displayed empty component when no record found 
                                    <ListEmptyComponent module={R.strings.allowIp} onPress={() => this.props.navigation.navigate('AddEditAllowIp', { edit: false, onSuccess: this.onSuccessAddEdit })} />
                                }
                            </View>
                    }

                    {/*To Set Pagination View  */}
                    <View>
                        {finalItems.length > 0 &&
                            <PaginationWidget row={this.state.row} selectedPage={this.state.selectedPage} onPageChange={(item) => { this.onPageChange(item) }} />
                        }
                    </View>
                </View>
            </SafeView>
        )
    }
}

// This Class is used for display record in list
class ListIpRangeItem extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        //if old item and new item are different than only render list itemv
        if (this.props.item === nextProps.item) {
            return false
        }
        return true
    }

    render() {
        let props = this.props;
        let item = props.item;
        let size = props.size;
        let index = props.index;

        return (
            <AnimatableItem>
                <View
                    style={{
                        flex: 1, marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                        marginLeft: R.dimens.widget_left_right_margin, marginRight: R.dimens.widget_left_right_margin,
                        marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    }}
                >
                    <CardView
                        style={{
                            elevation: R.dimens.listCardElevation, flex: 1,
                            borderRadius: 0, borderBottomLeftRadius: R.dimens.margin, borderTopRightRadius: R.dimens.margin,
                        }}>

                        <View style={{ flexDirection: 'row', flex: 1 }}>
                            {/* for show ip icon */}
                            <ImageTextButton
                                icon={R.images.IC_IP_LIST}
                                style={{ margin: 0, padding: 0, justifyContent: 'center', width: R.dimens.SignUpButtonHeight, height: R.dimens.SignUpButtonHeight, backgroundColor: R.colors.accent, borderRadius: R.dimens.ButtonHeight }}
                                iconStyle={{ width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.white }}
                            />

                            <View style={{ flex: 1, paddingLeft: R.dimens.widgetMargin, }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                                    {/* for show startIp */}
                                    <View style={{ flexDirection: 'row', flex: 1 }}>
                                        <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>
                                            {R.strings.startIp + ': '}</TextViewHML>
                                        <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{item.StartIp ? item.StartIp : '-'}</TextViewHML>
                                    </View>

                                    {/* for show date */}
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <ImageTextButton
                                            style={{ margin: 0, padding: 0, paddingRight: R.dimens.widgetMargin, }}
                                            icon={R.images.IC_TIMER}
                                            iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
                                        />
                                        <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{validateValue(convertDateTime(item.CreatedDate))}</TextViewHML>
                                    </View>
                                </View>
                                {/* for show endip */}
                                <View style={{ flexDirection: 'row' }}>
                                    <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.endIp + ': '}</TextViewHML>
                                    <TextViewHML style={{ flex: 1, color: R.colors.textPrimary, fontSize: R.dimens.smallestText, marginLeft: R.dimens.widgetMargin }}>{item.EndIp ? item.EndIp : '-'}</TextViewHML>
                                </View>

                            </View>
                        </View>

                        {/* for show delete icon and status */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: R.dimens.widgetMargin, justifyContent: 'space-between' }}>
                            <StatusChip
                                color={item.Status == true ? R.colors.successGreen : R.colors.failRed}
                                value={item.Status == true ? R.strings.active : R.strings.inActive}></StatusChip>
                            <View style={{ flexDirection: 'row' }}>
                                <ImageTextButton
                                    style={
                                        {
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            backgroundColor: R.colors.failRed,
                                            borderRadius: R.dimens.titleIconHeightWidth,
                                            margin: 0,
                                            padding: R.dimens.CardViewElivation,
                                        }}
                                    icon={R.images.IC_DELETE}
                                    iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
                                    onPress={this.props.onDelete} />
                            </View>
                        </View>

                    </CardView>
                </View>
            </AnimatableItem>
        )
    }
}

function mapStatToProps(state) {
    return {
        //Updated IpRangeReducer Data 
        Listdata: state.IpRangeReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //list data
        ipRangeList: (ipRangeListRequest) => dispatch(ipRangeList(ipRangeListRequest)),
        //delete 
        DeleteIpRange: (deleteIpRangeRequest) => dispatch(deleteIpRange(deleteIpRangeRequest)),
        //clear 
        clearIpRange: () => dispatch(clearIpRange()),
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(ListIpRange);


