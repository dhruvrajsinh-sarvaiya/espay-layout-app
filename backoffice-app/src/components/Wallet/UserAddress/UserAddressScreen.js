import React, { Component } from 'react';
import { View, FlatList, Easing, RefreshControl } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import ListLoader from '../../../native_theme/components/ListLoader';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { changeTheme, parseArray, convertDateTime, showAlert } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew, validateValue, isEmpty } from '../../../validations/CommonValidation';
import { isCurrentScreen, addRouteToBackPress } from '../../Navigation';
import { connect } from 'react-redux';
import Drawer from 'react-native-drawer-menu';
import R from '../../../native_theme/R';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import FilterWidget from '../../widget/FilterWidget';
import CardView from '../../../native_theme/components/CardView';
import SafeView from '../../../native_theme/components/SafeView';
import AnimatableItem from '../../../native_theme/components/AnimatableItem'; import { Fonts } from '../../../controllers/Constants';
import ImageViewWidget from '../../widget/ImageViewWidget';
import { getListBlockUnblockUserAddress, clearUserAddressData, destroyBlackfund } from '../../../actions/Wallet/UserAddressAction';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import StatusChip from '../../widget/StatusChip';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import { DateValidation } from '../../../validations/DateValidation';
import LostGoogleAuthWidget from '../../widget/LostGoogleAuthWidget';
import AlertDialog from '../../../native_theme/components/AlertDialog';
import EditText from '../../../native_theme/components/EditText';


class UserAddressScreen extends Component {

    constructor(props) {
        super(props);

        //Create reference
        this.drawer = React.createRef();
        this.toast = React.createRef();

        //Define all initial state
        this.state = {
            refreshing: false,
            search: '',
            response: [],

            fromDate: '',
            toDate: '',

            address: '',

            statuses: [
                { value: R.strings.Please_Select, code: '' },
                { value: R.strings.Block, code: '1' },
                { value: R.strings.UnBlock, code: '2' },
            ],
            selectedStatus: R.strings.Please_Select,
            selectedStatusCode: '',

            userAddressListData: null,
            blockUnblockData: null,
            blackFundData: null,

            isFirstTime: true,

            askTwoFA: false,
            isAlertShow: false,

            //lock unlock
            lockUnblockRequest: {},

            //for destroy
            Remarks: '',
            Id: '',
            Address: '',

            //For Drawer First Time Close
            isDrawerOpen: false,

        };

        //Bind all methods
        this.onBackPress = this.onBackPress.bind(this);

        //add current route for backpress handle  
        addRouteToBackPress(props, this.onBackPress);
        this.props.navigation.setParams({ onBackPress: this.onBackPress });
    }

    // If drawer is open then first, it will close the drawer and after it will return to previous screen
    onBackPress() {
        if (this.state.isDrawerOpen) {
            this.drawer.closeDrawer();
            this.setState({ isDrawerOpen: false })
        } else {
            //goging back screen
            this.props.navigation.goBack();
        }
    }

    componentDidMount = async () => { 

        //Add this method to change theme based on stored theme name.
        changeTheme();

        this.callGetListBlockUnblockUserAddress()
    };

    //api call
    callGetListBlockUnblockUserAddress = async () => {
        //Check NetWork is Available or not
        if (await isInternet()) {

            let request = {
                FromDate: this.state.fromDate,
                ToDate: this.state.toDate,
                Address: this.state.address,
                Status: this.state.selectedStatusCode === '' ? '' : this.state.selectedStatusCode,
            }

            //To get getListBlockUnblockUserAddress list
            this.props.getListBlockUnblockUserAddress(request);
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        //For stop twice api call
        return isCurrentScreen(nextProps);
    };

    componentWillUnmount = () => {
        //for Data clear on Backpress
        this.props.clearUserAddressData();
    };

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
        if (UserAddressScreen.oldProps !== props) {
            UserAddressScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            const { userAddressListData } = props.data;

            if (userAddressListData) {
                try {
                    //if local userAddressListData state is null or its not null and also different then new response then and only then validate response.
                    if (state.userAddressListData == null || (state.userAddressListData != null && userAddressListData !== state.userAddressListData)) {

                        //if  response is success then store array list else store empty list
                        if (validateResponseNew({ response: userAddressListData, isList: true })) {

                            let res = parseArray(userAddressListData.Data);
                            return { ...state, userAddressListData, response: res, refreshing: false };
                        } else {
                            return { ...state, userAddressListData, response: [], refreshing: false };
                        }
                    }
                } catch (e) {
                    return { ...state, response: [], refreshing: false };
                }
            }
        }
        return null;
    }


    // if press on complete button api calling
    onComplete = async () => {

        //Check Validation of FromDate and ToDate
        if (DateValidation(this.state.fromDate, this.state.toDate, true)) {
            this.toast.Show(DateValidation(this.state.fromDate, this.state.toDate, true));
            return;
        }

        let request = {
            FromDate: this.state.fromDate,
            ToDate: this.state.toDate,
            Address: this.state.address,
            Status: this.state.selectedStatusCode === '' ? '' : this.state.selectedStatusCode,
        }

        //Check NetWork is Available or not
        if (await isInternet()) {

            //To get getListBlockUnblockUserAddress list
            this.props.getListBlockUnblockUserAddress(request);
        } else {
            this.setState({ refreshing: false });
        }

        // Close Drawer user press on Complete button bcoz display flatlist item on Screen
        this.drawer.closeDrawer();

    }

    // When user press on reset button then all values are reset
    onReset = async () => {

        // Set state to original value
        this.setState({
            address: '',
            selectedStatus: R.strings.Please_Select,
            selectedStatusCode: '',
            fromDate: '',
            toDate: '',
        })

        let request = {};

        // Close Drawer user press on Complete button bcoz display flatlist item on Screen
        this.drawer.closeDrawer();

        //Check NetWork is Available or not
        if (await isInternet()) {

            //To get getListBlockUnblockUserAddress list
            this.props.getListBlockUnblockUserAddress(request);
        } else {
            this.setState({ refreshing: false })
        }
    }

    onRefresh = async () => {

        this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (await isInternet()) {

            let request = {
                FromDate: this.state.fromDate,
                ToDate: this.state.toDate,
                Address: this.state.address,
                Status: this.state.selectedStatusCode === '' ? '' : this.state.selectedStatusCode,
            }

            //To get getListBlockUnblockUserAddress list
            this.props.getListBlockUnblockUserAddress(request);
        } else {
            this.setState({ refreshing: false });
        }
    }

    componentDidUpdate(prevProps, _prevState) {
        //Get All Updated field of Particular actions
        const { blackFundData, blockUnblockData } = this.props.data

        if (blackFundData !== prevProps.data.blackFundData) {
            // AcceptRejWithdrawReq is not null
            if (blackFundData) {

                try {
                    if (this.state.blackFundData == null || (this.state.blackFundData != null && blackFundData !== this.state.blackFundData)) {

                        // Handle Response
                        if (validateResponseNew({ response: blackFundData, isList: true })) {
                            // Show success dialog
                            showAlert(R.strings.status, blackFundData.ReturnMsg, 0, async () => {

                                this.props.clearUserAddressData()

                                //call User Address list
                                this.callGetListBlockUnblockUserAddress()
                            })
                            this.setState({ blackFundData })
                        } else {
                            // Show success dialog
                            showAlert(R.strings.status, R.strings[`apiDestroyErrorCode.${blackFundData.ErrorCode}`], 1, () => {
                                this.props.clearUserAddressData()
                            })
                            this.setState({ blackFundData: null })
                        }
                    }
                } catch (error) {
                    // clear reducer data
                    this.props.clearUserAddressData()
                    this.setState({ blackFundData: null })
                }
            }
        }

        if (blockUnblockData !== prevProps.data.blockUnblockData) {
            // blockUnblockData is not null
            if (blockUnblockData) {

                try {
                    if (this.state.blockUnblockData == null || (this.state.blockUnblockData != null && blockUnblockData !== this.state.blockUnblockData)) {

                        // Handle Response
                        if (validateResponseNew({ response: blockUnblockData, isList: true })) {
                            // Show success dialog
                            showAlert(R.strings.status, blockUnblockData.ReturnMsg, 0, async () => {

                                this.props.clearUserAddressData()

                                //call User Address list
                                this.callGetListBlockUnblockUserAddress()
                            })
                            this.setState({ blockUnblockData })
                        }
                        else {
                            // Show success dialog
                            showAlert(R.strings.status, R.strings[`apiDestroyErrorCode.${blockUnblockData.ErrorCode}`], 1, () => {
                                this.props.clearUserAddressData()
                            })
                            this.setState(
                                { blockUnblockData: null }
                            )
                        }
                    }
                }
                catch (error) {
                    // clear reducer data
                    this.props.clearUserAddressData()
                    this.setState({ blockUnblockData: null })
                }
            }
        }
    }

    navigationDrawer() {

        return (
            <FilterWidget
                FromDatePickerCall={(date) => this.setState({ fromDate: date })}
                ToDatePickerCall={(date) => this.setState({ toDate: date })}
                FromDate={this.state.fromDate}
                ToDate={this.state.toDate}
                toastRef={component => this.toast = component}
                comboPickerStyle={{ marginTop: 0, marginBottom: R.dimens.margin_between_dtpicker_header }}
                sub_container={{ paddingBottom: 0, }}
                textInputStyle={{ marginTop: 0, marginBottom: 0, }}
                textInputs={[
                    {
                        header: R.strings.Address,
                        placeholder: R.strings.Address,
                        multiline: false,
                        keyboardType: 'default',
                        returnKeyType: "done",
                        onChangeText: (text) => { this.setState({ address: text }) },
                        value: this.state.address,
                    }
                ]}
                pickers={[
                    {
                        title: R.strings.Status,
                        array: this.state.statuses,
                        selectedValue: this.state.selectedStatus,
                        onPickerSelect: (index, object) => this.setState({ selectedStatus: index, selectedStatusCode: object.code })
                    },
                ]}
                onResetPress={this.onReset}
                onCompletePress={this.onComplete}
            />
        )
    }

    onDestroy = async () => {
        if (isEmpty(this.state.Remarks))
            this.toastUpdate.Show(R.strings.enterRemarks)
        else {
            this.setState({ isAlertShow: false })
            if (await isInternet()) {

                let request = {
                    Id: this.state.Id,
                    Address: this.state.Address,
                    Remarks: this.state.Remarks
                }

                //To get destroyBlackfund 
                this.props.destroyBlackfund(request);
            }
        }
    }

    onLockUnlock(item) {

        this.request = {
            ID: item.Id,
            Address: item.Address,
            WalletTypeId: item.WalletTypeId,
            Status: item.Status === 1 ? 2 : 1,
            Remarks: item.Remarks,
        }

        /*   if (item.Status === 1) {
              this.request = {
                  ...this.request,
                  ID: item.Id
              }
          } */

        this.setState(
            { lockUnblockRequest: this.request, isAlertShow: false, askTwoFA: true, })
    }

    // Render Right Side Menu For Add New Pattern , Filters , etc Functionality in history of Fee And Limit Pattern 
    rightMenuRender = () => {
        return (
            <View style={{ flexDirection: 'row' }}>
                <ImageTextButton
                    style={{
                        margin: 0,
                        paddingTop: R.dimens.WidgetPadding,
                        paddingBottom: R.dimens.WidgetPadding,
                        paddingLeft: R.dimens.widgetMargin, paddingRight: R.dimens.widgetMargin,
                    }}
                    icon={R.images.IC_PLUS}
                    iconStyle={[{ height: R.dimens.SMALL_MENU_ICON_SIZE, width: R.dimens.SMALL_MENU_ICON_SIZE, tintColor: R.colors.textSecondary }]}
                    onPress={() => this.props.navigation.navigate('UserAddressAddScreen', { onSuccess: this.callGetListBlockUnblockUserAddress })} />
                <ImageTextButton
                    iconStyle={[{
                        height: R.dimens.SMALL_MENU_ICON_SIZE,
                        width: R.dimens.SMALL_MENU_ICON_SIZE, tintColor: R.colors.textSecondary
                    }]}
                    style={{ margin: 0, paddingTop: R.dimens.WidgetPadding, paddingBottom: R.dimens.WidgetPadding, paddingLeft: R.dimens.widgetMargin, paddingRight: R.dimens.widgetMargin, }}
                    onPress={() => this.drawer.openDrawer()}
                    icon={R.images.FILTER}
                />
            </View>
        )

    }

    render() {
        let filteredList = [];

        //for search all fields if response length > 0
        if (this.state.response.length) {
            filteredList = this.state.response.filter(item => (
                item.Address.toLowerCase().includes(this.state.search.toLowerCase()) ||
                item.BlockedByUserName.toLowerCase().includes(this.state.search.toLowerCase()) ||
                item.CreatedDate.toLowerCase().includes(this.state.search.toLowerCase()) ||
                item.WalletTypeName.toLowerCase().includes(this.state.search.toLowerCase()) ||
                item.StrStatus.toLowerCase().includes(this.state.search.toLowerCase()) ||
                !isEmpty(item.Remarks) && item.Remarks.toLowerCase().includes(this.state.search.toLowerCase())
            ));
        }

        return (
            <Drawer
                drawerWidth={R.dimens.FilterDrawarWidth}
                onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
                ref={component => this.drawer = component}
                onDrawerClose={() => this.setState({ isDrawerOpen: false })}
                drawerContent={this.navigationDrawer()}
                type={Drawer.types.Overlay}
                drawerPosition={Drawer.positions.Right}
                easingFunc={Easing.ease}>

                <SafeView style={this.styles().container}>

                    {/* To set status bar as per our theme */}
                    <CommonStatusBar />

                    {/* To set Progress bar as per our theme */}
                    <ProgressDialog ref={component => this.progressDialog = component} isShow={this.props.data.blockUnblockLoading || this.props.data.blackFundLoading} />

                    {/* To set toolbar as per our theme */}
                    <CustomToolbar
                        title={R.strings.userAddressList}
                        isBack={true}
                        nav={this.props.navigation}
                        searchable={true}
                        onSearchText={(input) => this.setState({ search: input })}
                        rightMenuRenderChilds={this.rightMenuRender()}
                        onBackPress={this.onBackPress} />


                    {(this.props.data.loading && !this.state.refreshing)
                        ?
                        <ListLoader />
                        :
                        filteredList.length > 0 ?
                            <FlatList
                                data={filteredList}
                                extraData={this.state}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item, index }) =>
                                    <UserAddressItem
                                        index={index}
                                        item={item}
                                        size={this.state.response.length}
                                        onLockUnlock={() => this.onLockUnlock(item)}
                                        onDestroy={() => this.setState({ isAlertShow: true, Id: item.Id, Address: item.Address, Remarks: '' })}
                                    />
                                }
                                keyExtractor={(_item, index) => index.toString()}
                                refreshControl={<RefreshControl
                                    colors={[R.colors.accent]}
                                    progressBackgroundColor={R.colors.background}
                                    refreshing={this.state.refreshing}
                                    onRefresh={this.onRefresh}
                                />}
                            />
                            :
                            <ListEmptyComponent module={R.strings.addUserAddress} onPress={() => this.props.navigation.navigate('UserAddressAddScreen', { onSuccess: this.callGetListBlockUnblockUserAddress })} />
                    }

                    <AlertDialog
                        visible={this.state.isAlertShow}
                        title={R.strings.areYouSureYouWantToProceed}
                        negativeButton={{
                            title: R.strings.no,
                            onPress: () => this.setState({ isAlertShow: !this.state.isAlertShow, Remarks: '' })
                        }}
                        positiveButton={{
                            title: R.strings.yes_text,
                            onPress: () => this.onDestroy(),
                            //disabled: UpdateIpWhitelistisFetching,
                            progressive: false
                        }}
                        requestClose={() => null}
                        toastRef={component => this.toastUpdate = component}>

                        {/* Input of Remarks */}
                        <EditText
                            isRequired={true}
                            header={R.strings.remarks}
                            placeholder={R.strings.remarks}
                            multiline={false}
                            keyboardType='default'
                            returnKeyType={"done"}
                            onChangeText={(item) => this.setState({ Remarks: item })}
                            value={this.state.Remarks}
                        />

                    </AlertDialog>

                    <LostGoogleAuthWidget
                        generateTokenApi={5}
                        navigation={this.props.navigation}
                        isShow={this.state.askTwoFA}
                        ApiRequest={this.state.lockUnblockRequest}
                        onShow={() => this.setState({ askTwoFA: true })}
                        onCancel={() => this.setState({ askTwoFA: false })}
                    />

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

// This Class is used for display record in list
class UserAddressItem extends Component {
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

        // Get required fields from props
        let { index, size, item, onLockUnlock, onDestroy } = this.props;

        //To Display various Status Color in ListView
        let color = R.colors.accent;

        //blocked
        if (item.Status === 1) {
            color = R.colors.failRed
        }
        //unblocked 
        else if (item.Status === 2) {
            color = R.colors.successGreen
        } 

        return (
            <AnimatableItem>
                <View style={{
                    flex: 1, marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginLeft: R.dimens.widget_left_right_margin,
                    marginRight: R.dimens.widget_left_right_margin,
                }}>
                    <CardView
                        style={{
                            elevation: R.dimens.listCardElevation, flex: 1,
                            borderBottomLeftRadius: R.dimens.margin,
                            borderRadius: 0,
                            borderTopRightRadius: R.dimens.margin,
                        }}>

                        <View>
                            <View style={{ flex: 1, flexDirection: 'row' }}>

                                {/* WalletType Image */}
                                <ImageViewWidget url={item.WalletTypeName ? item.WalletTypeName : ''} width={R.dimens.drawerMenuIconWidthHeight} height={R.dimens.drawerMenuIconWidthHeight} />

                                <View style={{ flex: 1, }}>

                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                                        {/* for show WalletType,CreatedDate */}
                                        <TextViewMR style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>{item.WalletTypeName ? item.WalletTypeName : ' - '}</TextViewMR>

                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                            <ImageTextButton
                                                style={{ margin: 0, paddingRight: R.dimens.LineHeight, }}
                                                icon={R.images.IC_TIMER}
                                                iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
                                            />
                                            <TextViewHML style={{ alignSelf: 'center', color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{convertDateTime(item.CreatedDate, 'YYYY-MM-DD HH:mm:ss', false)}</TextViewHML>
                                        </View>
                                    </View>

                                    {/* for show blockby */}
                                    <View style={{ flex: 1, flexDirection: 'row' }}>
                                        <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, fontFamily: Fonts.MontserratSemiBold, }}>{R.strings.blockby + ': '}</TextViewHML>
                                        <TextViewHML style={{ flex: 1, color: R.colors.textPrimary, fontSize: R.dimens.smallestText, fontFamily: Fonts.MontserratSemiBold, }}>{validateValue(item.BlockedByUserName)}</TextViewHML>
                                    </View>

                                    {/* for show Address */}
                                    <View style={{ flex: 1, flexDirection: 'row', }}>
                                        <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, fontFamily: Fonts.MontserratSemiBold, }}>{R.strings.Address + ': '}</TextViewHML>
                                        <TextViewHML style={{ flex: 1, color: R.colors.textPrimary, fontSize: R.dimens.smallestText, fontFamily: Fonts.MontserratSemiBold, }}>{validateValue(item.Address)}</TextViewHML>
                                    </View>

                                    {/* for show Remarks */}
                                    <View style={{ flex: 1, flexDirection: 'row', }}>
                                        <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, fontFamily: Fonts.MontserratSemiBold, }}>{R.strings.remarks + ': '}</TextViewHML>
                                        <TextViewHML style={{ flex: 1, color: R.colors.textPrimary, fontSize: R.dimens.smallestText, fontFamily: Fonts.MontserratSemiBold, }}>{validateValue(item.Remarks)}</TextViewHML>
                                    </View>
                                </View>
                            </View >

                            {/* for show status and DateTime */}
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: R.dimens.widgetMargin }}>
                                <StatusChip
                                    color={color}
                                    value={item.StrStatus}></StatusChip>

                                <View style={{ flexDirection: 'row' }}>
                                    <ImageTextButton
                                        style={
                                            {
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                backgroundColor: R.colors.successGreen,
                                                borderRadius: R.dimens.titleIconHeightWidth,
                                                margin: 0,
                                                padding: R.dimens.CardViewElivation,
                                                marginRight: R.dimens.widgetMargin,
                                            }}
                                        icon={item.Status === 1 ? R.images.ic_unlock : R.images.IC_LOCK}
                                        iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
                                        onPress={onLockUnlock} />

                                    {item.Status === 1 &&
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
                                            icon={R.images.IC_CANCEL}
                                            iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
                                            onPress={onDestroy} />}

                                </View>
                            </View>
                        </View>
                    </CardView>
                </View>
            </AnimatableItem >
        )
    }
}

function mapStatToProps(state) {
    //Updated Data For UserAddressReducer Data 
    let data = {
        ...state.UserAddressReducer,
    }
    return { data }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform getListBlockUnblockUserAddress List Action 
        getListBlockUnblockUserAddress: (payload) => dispatch(getListBlockUnblockUserAddress(payload)),
        //Perform destroyBlackfund List Action 
        destroyBlackfund: (payload) => dispatch(destroyBlackfund(payload)),
        //Perform clearUserAddressData Action 
        clearUserAddressData: () => dispatch(clearUserAddressData())
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(UserAddressScreen);