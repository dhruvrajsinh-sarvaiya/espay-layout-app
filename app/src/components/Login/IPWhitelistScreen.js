import React, { Component } from 'react';
import { View, FlatList, Keyboard, RefreshControl, Text, Easing } from 'react-native';
import { connect } from 'react-redux';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../native_theme/components/CustomToolbar';
import { isCurrentScreen, addRouteToBackPress } from '../Navigation';
import { listIPWhitelist, AddIPToWhitelist, DeleteIPToWhitelist, disableIPWhitelist, enableIPWhitelist, UpdateIPToWhitelist, clearIpWhiteList } from '../../actions/Login/IPWhiteListActions';
import EditText from '../../native_theme/components/EditText';
import { isEmpty, isInternet, validateResponseNew } from '../../validations/CommonValidation';
import { changeTheme, showAlert, getIPAddress, getDeviceID, parseArray, addPages, getCurrentDate, convertDateTime } from '../../controllers/CommonUtils';
import { ListEmptyComponent, contentContainerStyle } from '../../native_theme/components/FlatListWidgets';
import ListLoader from '../../native_theme/components/ListLoader';
import AlertDialog from '../../native_theme/components/AlertDialog';
import { ServiceUtilConstant, Fonts } from '../../controllers/Constants';
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import { FeatureSwitch } from '../../native_theme/components/FeatureSwitch';
import CommonToast from '../../native_theme/components/CommonToast';
import PaginationWidget from '../Widget/PaginationWidget';
import R from '../../native_theme/R';
import { AppConfig } from '../../controllers/AppConfig';
import ImageTextButton from '../../native_theme/components/ImageTextButton';
import CardView from '../../native_theme/components/CardView';
import TextViewHML from '../../native_theme/components/TextViewHML';
import FilterWidget from '../Widget/FilterWidget';
import { DateValidation } from '../../validations/DateValidation';
import Drawer from 'react-native-drawer-menu';
import AnimatableItem from '../../native_theme/components/AnimatableItem';
import SafeView from '../../native_theme/components/SafeView';

class IPWhitelistScreen extends Component {
    constructor(props) {
        super(props);
        this.progressDialog = null;
        //Define All initial State
        this.state = {
            ipWhiteList: [],
            add: false,
            Update: false,
            search: '',
            PageIndex: 1,
            Page_Size: AppConfig.pageSize,
            IpAddress: '',
            MobileIp: '',
            aliasName: '',
            Selected: '',
            refreshing: false,
            row: [],
            isFirstTime: true,
            delete: false,
            update: false,
            Add: false,
            updatedIpAddress: '',
            updatedAliasName: '',
            FromDate: getCurrentDate(),
            ToDate: getCurrentDate(),
            count: true,
            isDrawerOpen: false, // First Time Drawer is Closed
        }

        //Add Current Screen to Manual Handling BackPress Events
        addRouteToBackPress(props);

        // Create Reference
        this.toastDialog = React.createRef();
        this.toastAdd = React.createRef()
        this.toastUpdate = React.createRef()
        this.drawer = React.createRef();

        //To Bind All Method
        this.onRefresh = this.onRefresh.bind(this);
        this.onBackPress = this.onBackPress.bind(this);
        this.props.navigation.setParams({ onBackPress: this.onBackPress });
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

    async componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        // get IP Address
        let Ip = await getIPAddress();
        this.setState({ IpAddress: Ip, MobileIp: Ip })

        //Call List of  Ip WhiteList API 
        this.FetchIpWhiteList();
    };

    async onRefresh() {
        this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Bind Request For Ip Whitelist
            const IpWhitelistReqObj = {
                PageIndex: this.state.PageIndex,
                Page_Size: this.state.Page_Size,
                FromDate: this.state.FromDate,
                ToDate: this.state.ToDate,
            }

            //To fetch IP whitelist
            this.props.onFetchIPWhiteList(IpWhitelistReqObj);
        } else {
            this.setState({ refreshing: false });
        }
    }

    //Call List of  Ip WhiteList API 
    async FetchIpWhiteList() {
        //Bind Request For Ip Whitelist
        const IpWhitelistReqObj = {
            PageIndex: 1,
            Page_Size: this.state.Page_Size,
            FromDate: this.state.FromDate,
            ToDate: this.state.ToDate,
        }
        //Check NetWork is Available or not
        if (await isInternet()) {
            //To fetch IP whitelist4
            this.props.onFetchIPWhiteList(IpWhitelistReqObj);
        }
    }

    //Call List of  Ip WhiteList API On Add Edit Delete Success 
    async  onAddEditDeleteSuccess(Edit) {

        this.setState({
            delete: false,
            Add: false,
            update: false,
            // if edit bit is true than selected page is as it is else redirect to page no 1
            PageIndex: Edit ? this.state.PageIndex : 1,
        })

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Bind Request For Ip Whitelist
            const IpWhitelistReqObj = {
                PageIndex: Edit ? this.state.PageIndex : 1,  // if edit bit is true than selected page is as it is else redirect to page no 1
                Page_Size: this.state.Page_Size,
                FromDate: this.state.FromDate,
                ToDate: this.state.ToDate,
            }

            //To fetch IP whitelist
            this.props.onFetchIPWhiteList(IpWhitelistReqObj);
        }
    }

    shouldComponentUpdate(nextProps, _nextState) {
        /* stop twice api call */
        return isCurrentScreen(nextProps);
    };

    static oldProps = {};

    static getDerivedStateFromProps(props, state) {

        // To Skip Render if old and new props are equal
        if (IPWhitelistScreen.oldProps !== props) {
            IPWhitelistScreen.oldProps = props;
        } else {
            return null;
        }

        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return {
                ...state,
                isFirstTime: false,
            };
        }

        if (isCurrentScreen(props)) {

            //Get All Updated Feild of Particular actions
            const { IpWhitelistFetchData, IpWhitelistdata, AddIpToWhitelistFetchData, AddIpToWhitelistdata,
                DeleteIpWhitelistFetchData, DeleteIpWhitelistdata, DisableIpWhitelistFetchData, DisableIpWhitelistdata,
                EnableIpWhitelistFetchData, EnableIpWhitelistdata, UpdateIpWhitelistFetchData, UpdateIpWhitelistdata } = props;

            //Check Ip Whitelist Api Response 
            if (!IpWhitelistFetchData) {
                try {
                    if (validateResponseNew({ response: IpWhitelistdata, isList: true })) {
                        return Object.assign({}, state, {
                            ipWhiteList: parseArray(IpWhitelistdata.IpList),
                            refreshing: false,
                            row: addPages(IpWhitelistdata.TotalRow)
                        });
                    } else {
                        return Object.assign({}, state, {
                            ipWhiteList: [],
                            refreshing: false,
                            row: []
                        })
                    }
                } catch (e) {
                    return Object.assign({}, state, {
                        ipWhiteList: [],
                        refreshing: false,
                        row: []
                    })
                    //Handle Catch and Notify User to Exception.
                    //Alert.alert('Status', e);
                }
            }

            //Check Delete Ip Address to  Whitelist Api Response 
            if (!DeleteIpWhitelistFetchData) {
                try {
                    if (validateResponseNew({ response: DeleteIpWhitelistdata })) {
                        return Object.assign({}, state, {
                            PageIndex: 1,
                            delete: true
                        })
                    }
                } catch (e) {
                    //Handle Catch and Notify User to Exception.
                    //Alert.alert('Status', e);
                }
            }

            //Check Add Ip Address to  Whitelist Api Response 
            if (!AddIpToWhitelistFetchData) {
                try {
                    if (validateResponseNew({ response: AddIpToWhitelistdata })) {
                        return Object.assign({}, state, {
                            Add: true,
                            aliasName: '',
                            IpAddress: state.MobileIp,
                            PageIndex: 1,
                        })
                    } else {
                        return Object.assign({}, state, {
                            aliasName: '',
                        })
                    }
                } catch (e) {
                    //Handle Catch and Notify User to Exception.
                    //Alert.alert('Status', e);
                }
            }

            //Check Update Ip Address to  Whitelist Api Response 
            if (!UpdateIpWhitelistFetchData) {
                try {
                    if (validateResponseNew({ response: UpdateIpWhitelistdata })) {
                        return Object.assign({}, state, {
                            update: true,
                            aliasName: '',
                            IpAddress: state.MobileIp
                        })
                    }
                } catch (e) {
                    //Handle Catch and Notify User to Exception.
                    //Alert.alert('Status', e);
                }
            }

            //Check Disable Ip Address to  Whitelist Api Response 
            if (!DisableIpWhitelistFetchData) {
                try {
                    if (validateResponseNew({ response: DisableIpWhitelistdata })) {
                        let res = state.ipWhiteList;
                        let findIndexOfChangeID = state.Selected == null ? -1 : res.findIndex(el => el.IpAddress === state.Selected);

                        //if index is >-1 then record is found
                        if (findIndexOfChangeID > -1) {
                            res[findIndexOfChangeID].IsEnable = res[findIndexOfChangeID].IsEnable == true ? false : true;
                        }
                        return Object.assign({}, state, {
                            ipWhiteList: res
                        })
                    }
                } catch (e) {
                    //Handle Catch and Notify User to Exception.
                    //Alert.alert('Status', e);
                }
            }

            //Check Enable Ip Address to  Whitelist Api Response 
            if (!EnableIpWhitelistFetchData) {
                try {
                    if (validateResponseNew({ response: EnableIpWhitelistdata })) {
                        let res = state.ipWhiteList;
                        let findIndexOfChangeID = state.Selected == null ? -1 : res.findIndex(el => el.IpAddress === state.Selected);

                        //if index is >-1 then record is found
                        if (findIndexOfChangeID > -1) {
                            res[findIndexOfChangeID].IsEnable = res[findIndexOfChangeID].IsEnable == true ? false : true;
                        }
                        return Object.assign({}, state, {
                            ipWhiteList: res
                        })
                    }
                } catch (e) {
                    //Handle Catch and Notify User to Exception.
                    //Alert.alert('Status', e);
                }
            }
        }
        return null
    };

    componentDidUpdate = (prevProps, _prevState) => {
        //Get All Updated Feild of Particular actions
        const { AddIpToWhitelistFetchData, AddIpToWhitelistdata,
            DeleteIpWhitelistFetchData, DeleteIpWhitelistdata,
            UpdateIpWhitelistFetchData, UpdateIpWhitelistdata } = this.props;

        if (DeleteIpWhitelistdata !== prevProps.DeleteIpWhitelistdata) {
            if (!DeleteIpWhitelistFetchData) {
                if (this.state.delete) {
                    showAlert(R.strings.Success + '!', DeleteIpWhitelistdata.ReturnMsg, 0, () => this.onAddEditDeleteSuccess())
                }
            }
        }

        if (AddIpToWhitelistdata !== prevProps.AddIpToWhitelistdata) {
            if (!AddIpToWhitelistFetchData) {
                if (this.state.Add) {
                    showAlert(R.strings.Success + '!', AddIpToWhitelistdata.ReturnMsg, 0, () => this.onAddEditDeleteSuccess())
                }
            }
        }

        if (UpdateIpWhitelistdata !== prevProps.UpdateIpWhitelistdata) {
            if (!UpdateIpWhitelistFetchData) {
                if (this.state.update) {
                    showAlert(R.strings.Success + '!', UpdateIpWhitelistdata.ReturnMsg, 0, () => this.onAddEditDeleteSuccess(true))
                }
            }
        }
    };

    // Call Api when user changed page no 
    async onPageChange(pageNo) {
        //if selected Page is Not Same as Previous Selected Then Api Call
        if (this.state.PageIndex !== pageNo) {

            this.setState({ PageIndex: pageNo });
            //Bind Request For Ip Whitelist
            const IpWhitelistReqObj = {
                PageIndex: pageNo,
                Page_Size: this.state.Page_Size,
                FromDate: this.state.FromDate,
                ToDate: this.state.ToDate,
            }
            //Check NetWork is Available or not
            if (await isInternet()) {
                //To fetch IP whitelist
                this.props.onFetchIPWhiteList(IpWhitelistReqObj);
            }
        }
    }

    //This Method Call Add Ip to WhiteList
    async addIPtoWhiteList() {
        //validations for inputs
        if (isEmpty(this.state.aliasName)) {
            this.toastAdd.Show(R.strings.aliasNameValidation);
            return;
        }

        if (isEmpty(this.state.IpAddress)) {
            this.toastAdd.Show(R.strings.Please_Enter_IpAddress);
            return;
        }

        Keyboard.dismiss();

        if (await isInternet()) {

            try {
                //Bind Request For Add Ip To Whitelist
                let AddIpToWhitelistRequest = {
                    SelectedIPAddress: this.state.IpAddress,
                    IpAliasName: this.state.aliasName,
                    deviceId: await getDeviceID(),
                    mode: ServiceUtilConstant.Mode,
                    hostName: ServiceUtilConstant.hostName
                    //Note : ipAddress parameter is passed in its saga.
                }
                //call api for Add Ip Address to Whitelist
                this.props.AddIPToWhitelist(AddIpToWhitelistRequest)
                this.setState({ add: !this.state.add })
            } catch (error) {
                this.progressDialog.dismiss();
                showAlert(R.strings.NetworkError, R.strings.SLOW_INTERNET, 5);
            }
        }
    }

    //This Method Call Delete Ip Address From Ip Whitelist
    async removeItemFromList(IpAddress) {
        if (await isInternet()) {
            try {
                //Bind Request For Delete Ip From Whitelist
                let DeleteIpFromWhitelistRequest = {
                    SelectedIPAddress: IpAddress,
                    deviceId: await getDeviceID(),
                    mode: ServiceUtilConstant.Mode,
                    hostName: ServiceUtilConstant.hostName
                    //Note : ipAddress parameter is passed in its saga.
                }
                //call api for Delete Ip Address From Whitelist
                this.props.DeleteIPToWhitelist(DeleteIpFromWhitelistRequest)
            } catch (error) {
                this.progressDialog.dismiss();
                showAlert(R.strings.NetworkError, R.strings.SLOW_INTERNET, 5);
            }
        }
    }

    updateFeature(item, index) {
        //To update feature state value
        if (!item.IsEnable) {
            this.EnableItemFromList(item.IpAddress);
        }
        else {
            this.disableItemFromList(item.IpAddress);
        }
    }

    //This Method Call Disable Ip Address From Ip Whitelist
    async disableItemFromList(IpAddress) {
        if (await isInternet()) {
            try {
                this.setState({ Selected: IpAddress });

                //Bind Request For Disable Ip From Whitelist
                let DisableIpFromWhitelistRequest = {
                    SelectedIPAddress: IpAddress,
                    deviceId: await getDeviceID(),
                    mode: ServiceUtilConstant.Mode,
                    hostName: ServiceUtilConstant.hostName
                    //Note : ipAddress parameter is passed in its saga.
                }

                //call api for Disable Ip Address From Whitelist
                this.props.disableIPWhitelist(DisableIpFromWhitelistRequest)
            } catch (error) {
                this.progressDialog.dismiss();
                showAlert(R.strings.NetworkError, R.strings.SLOW_INTERNET, 5);
            }

        }
    }

    //This Method Call Enable Ip Address From Ip Whitelist
    async  EnableItemFromList(IpAddress) {
        if (await isInternet()) {
            try {
                this.setState({ Selected: IpAddress });
                //Bind Request For Enable Ip From Whitelist
                let EnableIpFromWhitelistRequest = {
                    SelectedIPAddress: IpAddress,
                    deviceId: await getDeviceID(),
                    mode: ServiceUtilConstant.Mode,
                    hostName: ServiceUtilConstant.hostName
                    //Note : ipAddress parameter is passed in its saga.
                }
                //call api for Enable Ip Address From Whitelist
                this.props.enableIPWhitelist(EnableIpFromWhitelistRequest)
            } catch (error) {
                this.progressDialog.dismiss();
                showAlert(R.strings.NetworkError, R.strings.SLOW_INTERNET, 5);
            }
        }
    }

    //This Method Call Update Ip to WhiteList
    async  updateIPtoWhiteList(IpAddress) {
        //validations for Input Fields 
        if (isEmpty(this.state.aliasName)) {
            this.toastUpdate.Show(R.strings.aliasNameValidation);
            return;
        }

        if (isEmpty(IpAddress)) {
            this.toastUpdate.Show(R.strings.Please_Enter_IpAddress);
            return;
        }

        if (this.state.IpAddress === this.state.updatedIpAddress && this.state.aliasName === this.state.updatedAliasName) {
            this.toastUpdate.Show(R.strings.update_info_validate);
            return;
        }

        Keyboard.dismiss();

        if (await isInternet()) {

            try {
                //Bind Request For Update Ip To Whitelist
                let UpdateIpToWhitelistRequest = {
                    SelectedIPAddress: IpAddress,
                    IpAliasName: this.state.aliasName,
                    deviceId: await getDeviceID(),
                    mode: ServiceUtilConstant.Mode,
                    hostName: ServiceUtilConstant.hostName
                    //Note : ipAddress parameter is passed in its saga.
                }
                //call api for Update Ip Address to Whitelist
                this.props.UpdateIPToWhitelist(UpdateIpToWhitelistRequest)
                this.setState({ Update: !this.state.Update })
            } catch (error) {
                this.progressDialog.dismiss();
                showAlert(R.strings.NetworkError, R.strings.SLOW_INTERNET, 5);
            }
        }
    }

    // Render Right Side Menu 
    rightMenuRender = () => {
        return (
            <View style={{ flexDirection: 'row' }}>
                <ImageTextButton
                    icon={R.images.IC_PLUS}
                    style={{ margin: 0, paddingTop: R.dimens.WidgetPadding, paddingBottom: R.dimens.WidgetPadding, paddingLeft: R.dimens.widgetMargin, paddingRight: R.dimens.widgetMargin, }}
                    iconStyle={[{ height: R.dimens.SMALL_MENU_ICON_SIZE, width: R.dimens.SMALL_MENU_ICON_SIZE, tintColor: R.colors.textSecondary }]}
                    onPress={() => this.setState({ add: !this.state.add })} />

                <ImageTextButton
                    icon={R.images.FILTER}
                    style={{ margin: 0, paddingTop: R.dimens.WidgetPadding, paddingBottom: R.dimens.WidgetPadding, paddingLeft: R.dimens.widgetMargin, paddingRight: R.dimens.widgetMargin, }}
                    iconStyle={[{ height: R.dimens.SMALL_MENU_ICON_SIZE, width: R.dimens.SMALL_MENU_ICON_SIZE, tintColor: R.colors.textSecondary }]}
                    onPress={() => this.drawer.openDrawer()} />
            </View>
        )
    }

    /* Drawer Navigation */
    navigationDrawer() {
        return (
            <SafeView style={{
                flex: 1,
                backgroundColor: R.colors.background
            }}>
                {/* For Toast */}
                <CommonToast ref={cmp => this.toastDialog = cmp} styles={{ width: R.dimens.FilterDrawarWidth }} />

                {/* For FIlter Fromdate and Todate */}
                <FilterWidget
                    FromDatePickerCall={(date) => this.setState({ FromDate: date })}
                    ToDatePickerCall={(date) => this.setState({ ToDate: date })}
                    FromDate={this.state.FromDate}
                    ToDate={this.state.ToDate}
                    onResetPress={this.onResetPress}
                    onCompletePress={this.onCompletePress}
                ></FilterWidget>
            </SafeView>
        )
    }

    // reset all state and call api
    onResetPress = async () => {
        this.drawer.closeDrawer();
        this.setState({ FromDate: getCurrentDate(), ToDate: getCurrentDate(), search: '', PageIndex: 1 })

        //Check NetWork is Available or not
        if (await isInternet()) {
            //Bind Request For Ip To Whitelist
            let request = {
                PageIndex: 1,
                Page_Size: this.state.Page_Size,
                FromDate: getCurrentDate(),
                ToDate: getCurrentDate()
            }
            this.props.onFetchIPWhiteList(request);
        } else {
            this.setState({ refreshing: false });
        }
    }

    /* Api Call when press on complete button */
    onCompletePress = async () => {

        //Check All From Date Validation
        if (DateValidation(this.state.FromDate, this.state.ToDate)) {
            this.toastDialog.Show(DateValidation(this.state.FromDate, this.state.ToDate));
            return;
        }
        else {
            /* Close Drawer user press on Complete button bcoz display flatlist item on Screen */
            this.drawer.closeDrawer();

            //Check NetWork is Available or not
            if (await isInternet()) {
                //Bind Request For Update Ip To Whitelist
                let request = {
                    PageIndex: 1,
                    Page_Size: this.state.Page_Size,
                    FromDate: this.state.FromDate,
                    ToDate: this.state.ToDate,
                }
                this.props.onFetchIPWhiteList(request);
            } else {
                this.setState({ refreshing: false });
            }

            //If Filter from Complete Button Click then empty searchInput
            this.setState({ search: '', PageIndex: 1 })
        }
    }

    componentWillUnmount() {
        //clear data on Backpress
        this.props.clearIpWhiteList()
    }

    render() {
        //Get is Fetching value For All APIs to handle Progress bar in All Activity
        const { IpWhitelistisFetching, AddIpToWhitelistisFetching, DeleteIpWhitelistisFetching, DisableIpWhitelistisFetching, EnableIpWhitelistisFetching, UpdateIpWhitelistisFetching } = this.props;
        //----------

        //for final items from search input (validate on Device)
        //default searchInput is empty so it will display all records.
        let finalList = this.state.ipWhiteList.filter((item) => (item.IpAddress.includes(this.state.search) || item.IpAliasName && item.IpAliasName.toLowerCase().includes(this.state.search.toLowerCase())))

        return (
            <Drawer
                ref={cmp => this.drawer = cmp}
                drawerWidth={R.dimens.FilterDrawarWidth}
                drawerContent={this.navigationDrawer()}
                type={Drawer.types.Overlay}
                drawerPosition={Drawer.positions.Right}
                onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
                onDrawerClose={() => this.setState({ isDrawerOpen: false })}
                easingFunc={Easing.ease}>
                <SafeView style={{ flex: 1, backgroundColor: R.colors.background, }}>

                    {/* To set status bar as per our theme */}
                    <CommonStatusBar />

                    {/* To set toolbar as per our theme */}
                    <CustomToolbar
                        title={R.strings.ipWhitelisting}
                        isBack={true}
                        nav={this.props.navigation}
                        searchable={true}
                        onSearchText={(text) => this.setState({ search: text })}
                        rightMenuRenderChilds={this.rightMenuRender()}
                        onBackPress={this.onBackPress}
                    />

                    {/* Progress Dialog */}
                    <ProgressDialog
                        ref={component => this.progressDialog = component}
                        isShow={AddIpToWhitelistisFetching || DeleteIpWhitelistisFetching || DisableIpWhitelistisFetching || EnableIpWhitelistisFetching || UpdateIpWhitelistisFetching} />

                    <View style={{ flexDirection: 'row', paddingLeft: R.dimens.widget_left_right_margin, paddingBottom: R.dimens.widgetMargin }}>

                        <View style={{ flex: 1, justifyContent: 'center', marginLeft: R.dimens.widgetMargin }}>
                            <TextViewHML style={{
                                color: R.colors.textSecondary,
                                fontSize: R.dimens.smallestText,
                            }}>
                                {R.strings.currentIp}
                            </TextViewHML>
                            <Text style={{
                                color: R.colors.textPrimary,
                                fontSize: R.dimens.smallText,
                                fontFamily: Fonts.MontserratSemiBold,
                            }}>
                                {this.state.MobileIp}
                            </Text>
                        </View>
                    </View>

                    {/* Dialog to display Add Ip To Whitelisting */}

                    <AlertDialog
                        visible={this.state.add}
                        title={R.strings.addIpToWhiteListTitle}
                        negativeButton={{
                            title: R.strings.cancel,
                            onPress: () => this.setState({ add: !this.state.add, IpAddress: this.state.MobileIp, aliasName: '' })
                        }}
                        positiveButton={{
                            title: R.strings.add,
                            onPress: () => this.addIPtoWhiteList(),
                            disabled: AddIpToWhitelistisFetching,
                            progressive: false
                        }}
                        requestClose={() => null}
                        toastRef={component => this.toastAdd = component}>

                        {/* Existing IP Address */}
                        <TextViewHML style={{
                            color: R.colors.textPrimary,
                            paddingTop: R.dimens.WidgetPadding,
                            paddingBottom: R.dimens.WidgetPadding,
                            fontSize: R.dimens.smallText,
                        }}> {R.strings.ipAddress} : {this.state.MobileIp}
                        </TextViewHML>

                        {/* Input of Alias Name */}
                        <EditText
                            placeholder={R.strings.aliasName}
                            keyboardType='default'
                            returnKeyType={"done"}
                            multiline={false}
                            onChangeText={(item) => this.setState({ aliasName: item })}
                            value={this.state.aliasName}
                            style={{ marginTop: 0, width: '100%' }} />

                        {/* Input of Alias Name */}
                        <EditText
                            placeholder={R.strings.IpAddress}
                            keyboardType='default'
                            returnKeyType={"done"}
                            multiline={false}
                            onChangeText={(item) => this.setState({ IpAddress: item })}
                            value={this.state.IpAddress}
                            style={{ marginTop: 0, width: '100%' }} />
                    </AlertDialog>

                    {/* Dialog to display Update Ip To Whitelisting */}

                    <AlertDialog
                        visible={this.state.Update}
                        title={R.strings.updateIpToWhiteListTitle}
                        negativeButton={{
                            title: R.strings.cancel,
                            onPress: () => this.setState({ Update: !this.state.Update, IpAddress: this.state.MobileIp, aliasName: '' })
                        }}
                        positiveButton={{
                            title: R.strings.update,
                            onPress: () => this.updateIPtoWhiteList(this.state.IpAddress),
                            disabled: UpdateIpWhitelistisFetching,
                            progressive: false
                        }}
                        requestClose={() => null}
                        toastRef={component => this.toastUpdate = component}
                    >
                        {/* Existing IP Address */}
                        <TextViewHML style={{
                            paddingTop: R.dimens.WidgetPadding,
                            paddingBottom: R.dimens.WidgetPadding,
                            color: R.colors.textPrimary,
                            fontSize: R.dimens.smallText
                        }}> {R.strings.ipAddress} : {this.state.MobileIp}
                        </TextViewHML>

                        {/* Input of Alias Name */}
                        <EditText
                            multiline={false}
                            placeholder={R.strings.aliasName}
                            keyboardType='default'
                            returnKeyType={"done"}
                            onChangeText={(item) => this.setState({ aliasName: item })}
                            value={this.state.aliasName}
                            style={{ marginTop: 0, width: '100%' }} />

                        {/* Input of Alias Name */}
                        <EditText
                            multiline={false}
                            placeholder={R.strings.IpAddress}
                            keyboardType='default'
                            returnKeyType={"done"}
                            onChangeText={(item) => this.setState({ IpAddress: item })}
                            value={this.state.IpAddress}
                            style={{ marginTop: 0, width: '100%' }} />
                    </AlertDialog>

                    {/* Headers */}
                    <View style={{ flex: 1, justifyContent: 'space-between' }}>
                        {/* Progress */}
                        {(IpWhitelistisFetching && !this.state.refreshing) ?
                            < ListLoader />
                            :
                            <View style={{ flex: 1 }}>
                                {/* List Items */}
                                {finalList.length ?
                                    <View style={{ flex: 1, }}>
                                        <FlatList
                                            showsVerticalScrollIndicator={false}
                                            data={finalList}
                                            renderItem={({ item, index }) => <FlatListItem
                                                item={item}
                                                onRemove={() => {
                                                    if (this.state.count) {
                                                        this.setState({ count: false });
                                                        // for show selected Record in Dialog
                                                        let selectedRecord = R.strings.aliasName + " : " + (item.IpAliasName ? item.IpAliasName : '-') + "\n" + R.strings.ipTitle + " : " + (item.IpAddress ? item.IpAddress : '-') + "\n\n";
                                                        showAlert(R.strings.Delete + '!', selectedRecord + R.strings.delete_message, 6, () => {
                                                            this.setState({ count: true });
                                                            this.removeItemFromList(item.IpAddress)
                                                        }, R.strings.no_text, () => { this.setState({ count: true }); }, R.strings.yes_text)
                                                    }
                                                }}
                                                onUpdate={() => this.setState({ Update: !this.state.Update, IpAddress: item.IpAddress, updatedIpAddress: item.IpAddress, aliasName: item.IpAliasName, updatedAliasName: item.IpAliasName })}
                                                onUpdateFeature={() => this.updateFeature(item, index)}
                                                index={index}
                                                size={this.state.ipWhiteList.length}
                                            >
                                            </FlatListItem>}
                                            /* assign index as key value to list item */
                                            keyExtractor={(item, index) => index.toString()}
                                            contentContainerStyle={contentContainerStyle(finalList)}
                                            /* For Refresh Functionality In  FlatList Item */
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
                                    <ListEmptyComponent module={R.strings.whitelist_ip} onPress={() => this.setState({ add: !this.state.add })} />
                                }
                            </View>
                        }

                        {/*To Set Pagination View  */}
                        <View>
                            {
                                finalList.length > 0 &&
                                <PaginationWidget row={this.state.row} selectedPage={this.state.PageIndex} onPageChange={(item) => { this.onPageChange(item) }} />
                            }
                        </View>
                    </View>
                </SafeView >
            </Drawer>
        );
    }
}

// This Class is used for display record in list
class FlatListItem extends Component {
    constructor(props) {
        super(props)
    }

    //Check If Old Props and New Props are Equal then Return False
    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.item !== nextProps.item || this.props.onUpdateFeature !== nextProps.onUpdateFeature)
            return true
        return false
    }

    render() {
        let item = this.props.item;
        let DateTime = convertDateTime(item.CreatedDate);

        return (
            <AnimatableItem>
                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    marginLeft: R.dimens.widget_left_right_margin,
                    marginRight: R.dimens.widget_left_right_margin,
                    marginTop: R.dimens.widgetMargin,
                    marginBottom: (this.props.index == this.props.size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                }}>
                    <CardView style={{
                        elevation: R.dimens.listCardElevation,
                        flex: 1,
                        borderRadius: 0,
                        flexDirection: 'column',
                        borderBottomLeftRadius: R.dimens.margin,
                        borderTopRightRadius: R.dimens.margin,
                        paddingBottom: 0
                    }}>
                        <View style={{ flexDirection: 'row', flex: 1 }}>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                {/* Location Image */}
                                <ImageTextButton
                                    icon={R.images.IC_LOCATION}
                                    style={{ justifyContent: 'center', alignSelf: 'center', width: R.dimens.IconWidthHeight, height: R.dimens.IconWidthHeight, margin: 0, backgroundColor: R.colors.accent, borderRadius: R.dimens.ButtonHeight }}
                                    iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: R.colors.white }}
                                />
                                <View style={{ flex: 1, paddingLeft: R.dimens.margin, paddingRight: R.dimens.margin, }}>
                                    {/* for Alias Name */}
                                    <Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>{item.IpAliasName ? item.IpAliasName : '-'}</Text>
                                    {/* for IP Addres */}
                                    <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.ipTitle + ': '}<TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>{item.IpAddress ? item.IpAddress : '-'}</TextViewHML></TextViewHML>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                                {/* for Edit icon */}
                                <ImageTextButton
                                    style={{ margin: 0, paddingRight: R.dimens.WidgetPadding, }}
                                    onPress={this.props.onUpdate}
                                    icon={R.images.IC_EDIT}
                                    iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: R.colors.textPrimary }}
                                />
                                {/* for Delete icon */}
                                <ImageTextButton
                                    style={{ margin: 0, paddingRight: 0 }}
                                    onPress={this.props.onRemove}
                                    icon={R.images.IC_DELETE}
                                    iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: R.colors.textPrimary }}
                                />
                            </View>
                        </View>
                        {/* for show time and status */}
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row' }}>
                                <FeatureSwitch
                                    title={item.IsEnable ? R.strings.enabled : R.strings.disabled}
                                    reverse={true}
                                    isToggle={item.IsEnable}
                                    onValueChange={this.props.onUpdateFeature}
                                    textStyle={{
                                        color: R.colors.textSecondary,
                                        marginLeft: R.dimens.widget_left_right_margin,
                                        fontSize: R.dimens.smallestText
                                    }}
                                    style={{
                                        backgroundColor: 'transparent',
                                        paddingLeft: R.dimens.WidgetPadding,
                                        paddingRight: R.dimens.WidgetPadding,
                                    }} />
                            </View>
                            <ImageTextButton
                                style={{ margin: 0, paddingRight: R.dimens.widgetMargin, }}
                                icon={R.images.IC_TIMER}
                                iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
                            />
                            <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{DateTime}</TextViewHML>
                        </View>
                    </CardView>
                </View>
            </AnimatableItem>
        )
    }
}

function mapStatToProps(state) {
    return {
        //For Get Ip Whitelist Address Data
        IpWhitelistFetchData: state.ipWhiteListReducer.IpWhitelistFetchData,
        IpWhitelistisFetching: state.ipWhiteListReducer.IpWhitelistisFetching,
        IpWhitelistdata: state.ipWhiteListReducer.IpWhitelistdata,

        //For Add Ip To Whitelist Data
        AddIpToWhitelistFetchData: state.ipWhiteListReducer.AddIpToWhitelistFetchData,
        AddIpToWhitelistisFetching: state.ipWhiteListReducer.AddIpToWhitelistisFetching,
        AddIpToWhitelistdata: state.ipWhiteListReducer.AddIpToWhitelistdata,

        //For Delete Ip To Whitelist Data
        DeleteIpWhitelistFetchData: state.ipWhiteListReducer.DeleteIpWhitelistFetchData,
        DeleteIpWhitelistisFetching: state.ipWhiteListReducer.DeleteIpWhitelistisFetching,
        DeleteIpWhitelistdata: state.ipWhiteListReducer.DeleteIpWhitelistdata,

        //For Disable Ip To Whitelist Data 
        DisableIpWhitelistFetchData: state.ipWhiteListReducer.DisableIpWhitelistFetchData,
        DisableIpWhitelistisFetching: state.ipWhiteListReducer.DisableIpWhitelistisFetching,
        DisableIpWhitelistdata: state.ipWhiteListReducer.DisableIpWhitelistdata,

        //For Enable Ip To Whitelist Data 
        EnableIpWhitelistFetchData: state.ipWhiteListReducer.EnableIpWhitelistFetchData,
        EnableIpWhitelistisFetching: state.ipWhiteListReducer.EnableIpWhitelistisFetching,
        EnableIpWhitelistdata: state.ipWhiteListReducer.EnableIpWhitelistdata,

        //For Update Ip To Whitelist Data 
        UpdateIpWhitelistFetchData: state.ipWhiteListReducer.UpdateIpWhitelistFetchData,
        UpdateIpWhitelistisFetching: state.ipWhiteListReducer.UpdateIpWhitelistisFetching,
        UpdateIpWhitelistdata: state.ipWhiteListReducer.UpdateIpWhitelistdata,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform Get Ip Whitelist Api
        onFetchIPWhiteList: (IpWhitelistReqObj) => dispatch(listIPWhitelist(IpWhitelistReqObj)),
        //Perform Add Ip To Whitelist Api
        AddIPToWhitelist: (AddIpToWhitelistRequest) => dispatch(AddIPToWhitelist(AddIpToWhitelistRequest)),
        //Perform Delete Ip To Whitelist Api
        DeleteIPToWhitelist: (DeleteIpFromWhitelistRequest) => dispatch(DeleteIPToWhitelist(DeleteIpFromWhitelistRequest)),
        //Perform Disable Ip To Whitelist Api
        disableIPWhitelist: (DisableIpFromWhitelistRequest) => dispatch(disableIPWhitelist(DisableIpFromWhitelistRequest)),
        //Perform Enable Ip To Whitelist Api
        enableIPWhitelist: (EnableIpFromWhitelistRequest) => dispatch(enableIPWhitelist(EnableIpFromWhitelistRequest)),
        //Perform Update Ip To Whitelist Api
        UpdateIPToWhitelist: (UpdateIpToWhitelistRequest) => dispatch(UpdateIPToWhitelist(UpdateIpToWhitelistRequest)),
        //for clear all data from reducer
        clearIpWhiteList: () => dispatch(clearIpWhiteList()),
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(IPWhitelistScreen);