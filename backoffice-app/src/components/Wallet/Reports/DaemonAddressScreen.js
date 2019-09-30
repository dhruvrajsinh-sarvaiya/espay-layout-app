import React, { Component } from 'react';
import { View, FlatList, Easing, RefreshControl, Text } from 'react-native';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import ListLoader from '../../../native_theme/components/ListLoader';
import { ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { changeTheme, parseArray, addPages } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew, isEmpty } from '../../../validations/CommonValidation';
import { isCurrentScreen, addRouteToBackPress } from '../../Navigation';
import { connect } from 'react-redux';
import Drawer from 'react-native-drawer-menu';
import { AppConfig } from '../../../controllers/AppConfig';
import PaginationWidget from '../../widget/PaginationWidget'
import R from '../../../native_theme/R';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import FilterWidget from '../../widget/FilterWidget';
import CardView from '../../../native_theme/components/CardView';
import SafeView from '../../../native_theme/components/SafeView';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import { Fonts } from '../../../controllers/Constants';
import { getUserDataList, getWalletType, getProviderList } from '../../../actions/PairListAction';
import ImageViewWidget from '../../widget/ImageViewWidget';
import { getDaemonAddresses, clearDaemonAddress } from '../../../actions/Wallet/DaemonAddressAction';
import TextViewMR from '../../../native_theme/components/TextViewMR';

class DaemonAddressScreen extends Component {

    constructor(props) {
        super(props);

        //Create reference
        this.drawer = React.createRef();

        //Define all initial state
        this.state = {
            refreshing: false,
            search: '',
            response: [],
            isFirstTime: true,

            providers: [{ value: R.strings.Please_Select }],
            selectedProviders: R.strings.Please_Select,
            selectedProvidersCode: '',

            userNames: [{ value: R.strings.Please_Select }],
            selectedUserName: R.strings.Please_Select,
            selectedUserNameCode: '',

            currency: [{ value: R.strings.Please_Select }],
            selectedCurrency: R.strings.Please_Select,
            selectedCurrencyCode: '',

            address: '',

            //For pagination
            row: [],
            selectedPage: 1,

            //For Drawer First Time Close
            isDrawerOpen: false,
            daemonAddressData: null,
            walletData: null,
            userData: null,
            providerData: null,
        };

        //Bind all methods
        this.onBackPress = this.onBackPress.bind(this);

        //add current route for backpress handle
        addRouteToBackPress(props, this.onBackPress);

        this.props.navigation.setParams({
            onBackPress: this.onBackPress
        });
    }

    // If drawer is open then first, it will close the drawer and after it will return to previous screen
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

    componentDidMount = async () => {

        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {

            //to getProviderList
            this.props.getProviderList();

            //to getUserDataList list
            this.props.getUserDataList();

            //get walletlist

            this.props.getWalletType();

            let request = {
                PageNo: 0,
                PageSize: AppConfig.pageSize,
                ServiceProviderID: this.state.selectedProviders === R.strings.Please_Select ? '' : this.state.selectedProvidersCode,
                UserID: this.state.selectedUserName === R.strings.Please_Select ? '' : this.state.selectedUserNameCode,
                WalletTypeID: this.state.selectedCurrency === R.strings.Please_Select ? '' : this.state.selectedCurrencyCode,
                Address: this.state.address
            }

            //To get getDaemonAddresses list
            this.props.getDaemonAddresses(request);
        }
    };

    shouldComponentUpdate = (nextProps, nextState) => {
        //For stop twice api call
        return isCurrentScreen(nextProps);
    };

    componentWillUnmount = () => {
        //for Data clear on Backpress
        this.props.clearDaemonAddress();
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
        if (DaemonAddressScreen.oldProps !== props) {
            DaemonAddressScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            const { daemonAddressData, userData, walletData, providerData } = props.data;

            if (daemonAddressData) {
                try {
                    //if local daemonAddressData state is null or its not null and also different then new response then and only then validate response.
                    if (state.daemonAddressData == null || (state.daemonAddressData != null && daemonAddressData !== state.daemonAddressData)) {

                        //if  response is success then store array list else store empty list
                        if (validateResponseNew({ response: daemonAddressData, isList: true })) {

                            let res = parseArray(daemonAddressData.Data);

                            //for add isDefault for search
                            for (var daemonAddressDataKey in res) {
                                let item = res[daemonAddressDataKey];
                                item.IsDefault = item.IsDefaultAddress === 0 ? R.strings.no : R.strings.yes_text;
                            }

                            return { ...state, daemonAddressData, response: res, refreshing: false, row: addPages(daemonAddressData.TotalCount) };
                        } else {
                            return { ...state, daemonAddressData, response: [], refreshing: false, row: [] };
                        }
                    }
                } catch (e) {
                    return {
                        ...state,
                        response: [], refreshing: false, row: []
                    };
                }
            }

            if (userData) {
                try {
                    //if local userData state is null or its not null and also different then new response then and only then validate response.
                    if (state.userData == null || (state.userData != null && userData !== state.userData)) {

                        //if  response is success then store array list else store empty list
                        if (validateResponseNew({ response: userData, isList: true })) {

                            let res = parseArray(
                                userData.GetUserData);

                            //for add userData
                            for (var userDatakey in res) {
                                let item = res[userDatakey];
                                item.value = item.UserName;
                            }

                            let userNames = [
                                {
                                    value: R.strings.Please_Select
                                },
                                ...res
                            ];

                            return {
                                ...state,
                                userData, userNames
                            };
                        }
                        else {
                            return {
                                ...state, userData,
                                userNames: [{ value: R.strings.Please_Select }]
                            };
                        }
                    }
                }
                catch (e) {
                    return {
                        ...state, userNames: [
                            { value: R.strings.Please_Select }]
                    };
                }

            }

            if (walletData) {
                try {
                    //if local walletData state is null or its not null and also different then new response then and only then validate response.

                    if (state.walletData == null || (state.walletData != null && walletData !== state.walletData)) {

                        //if  response is success then store array list else store empty list

                        if (validateResponseNew({ response: walletData, isList: true })) {
                            let res = parseArray(walletData.Types);

                            //for add walletData
                            for (var walletDatakey in res) {

                                let item = res[walletDatakey];
                                item.value = item.TypeName;
                            }

                            let currency = [
                                {
                                    value: R.strings.Please_Select
                                },
                                ...res
                            ];

                            return {
                                ...state,
                                walletData, currency
                            };
                        } else {
                            return {
                                ...state, walletData, currency: [
                                    { value: R.strings.Please_Select }]
                            };
                        }
                    }
                }
                catch (e) {
                    return {
                        ...state, currency: [{
                            value: R.strings.Please_Select
                        }]
                    };
                }
            }

            if (providerData) {
                try {
                    //if local providerData state is null or its not null and also different then new response then and only then validate response.
                    if (state.providerData == null || (state.providerData != null && providerData !== state.providerData)) {

                        //if  response is success then store array list else store empty list
                        if (validateResponseNew({ response: providerData, isList: true })) {
                            let res = parseArray(providerData.Response);

                            //for add walletData
                            for (var providerDatakey in res) {
                                let item = res[providerDatakey];
                                item.value = item.ProviderName;
                            }

                            let providers = [
                                { value: R.strings.Please_Select },
                                ...res
                            ];

                            return { ...state, walletData, providers };
                        } else {
                            return { ...state, walletData, providers: [{ value: R.strings.Please_Select }] };
                        }
                    }
                } catch (e) {
                    return { ...state, providers: [{ value: R.strings.Please_Select }] };
                }
            }
        }
        return null;
    }

    // if press on complete button api calling
    onComplete = async () => {

        let request = {
            PageNo: 0,
            PageSize: AppConfig.pageSize,
            ServiceProviderID: this.state.selectedProviders === R.strings.Please_Select ? '' : this.state.selectedProvidersCode,
            UserID: this.state.selectedUserName === R.strings.Please_Select ? '' : this.state.selectedUserNameCode,
            WalletTypeID: this.state.selectedCurrency === R.strings.Please_Select ? '' : this.state.selectedCurrencyCode,
            Address: this.state.address
        }

        //Check NetWork is Available or not
        if (await isInternet()) {

            //To get getDaemonAddresses list
            this.props.getDaemonAddresses(request);
        } else {
            this.setState({ refreshing: false });
        }

        // Close Drawer user press on Complete button bcoz display flatlist item on Screen
        this.drawer.closeDrawer();
        this.setState({ selectedPage: 1, })
    }

    // When user press on reset button then all values are reset
    onReset = async () => {

        // Set state to original value
        this.setState({
            selectedPage: 1,
            selectedUserName: R.strings.Please_Select,
            selectedUserNameCode: '',
            selectedProviders: R.strings.Please_Select,
            selectedProvidersCode: '',
            selectedCurrency: R.strings.Please_Select,
            selectedCurrencyCode: '',
            address: '',
        })

        let request = {
            PageNo: 0,
            PageSize: AppConfig.pageSize,
        };

        // Close Drawer user press on Complete button bcoz display flatlist item on Screen
        this.drawer.closeDrawer();

        //Check NetWork is Available or not
        if (await isInternet()) {

            //To get getDaemonAddresses list
            this.props.getDaemonAddresses(request);
        } else {
            this.setState({ refreshing: false })
        }
    }

    onRefresh = async () => {

        this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (await isInternet()) {

            let request = {
                PageNo: this.state.selectedPage - 1,
                PageSize: AppConfig.pageSize,
                ServiceProviderID: this.state.selectedProviders === R.strings.Please_Select ? '' : this.state.selectedProvidersCode,
                UserID: this.state.selectedUserName === R.strings.Please_Select ? '' : this.state.selectedUserNameCode,
                WalletTypeID: this.state.selectedCurrency === R.strings.Please_Select ? '' : this.state.selectedCurrencyCode,
                Address: this.state.address
            }

            //To get getDaemonAddresses list
            this.props.getDaemonAddresses(request);

        } else {
            this.setState({ refreshing: false });
        }
    }

    // this method is called when page change and also api call
    onPageChange = async (pageNo) => {

        //if selected page is diffrent than call api
        if (pageNo != this.state.selectedPage) {

            //Check NetWork is Available or not
            if (await isInternet()) {
                this.setState({ selectedPage: pageNo });

                let request = {
                    PageNo: pageNo - 1,
                    PageSize: AppConfig.pageSize,
                    ServiceProviderID: this.state.selectedProviders === R.strings.Please_Select ? '' : this.state.selectedProvidersCode,
                    UserID: this.state.selectedUserName === R.strings.Please_Select ? '' : this.state.selectedUserNameCode,
                    WalletTypeID: this.state.selectedCurrency === R.strings.Please_Select ? '' : this.state.selectedCurrencyCode,
                    Address: this.state.address
                }

                //To get getDaemonAddresses list
                this.props.getDaemonAddresses(request);
            } else {
                this.setState({ refreshing: false })
            }
        }
    }

    navigationDrawer() {

        return (
            <FilterWidget
                comboPickerStyle={{ marginTop: 0, }}
                pickers={[
                    {
                        title: R.strings.ServiceProvider,
                        array: this.state.providers,
                        selectedValue: this.state.selectedProviders,
                        onPickerSelect: (index, object) => this.setState({ selectedProviders: index, selectedProvidersCode: object.Id })
                    },
                    {
                        title: R.strings.User,
                        array: this.state.userNames,
                        selectedValue: this.state.selectedUserName,
                        onPickerSelect: (index, object) => this.setState({ selectedUserName: index, selectedUserNameCode: object.Id })
                    },
                    {
                        title: R.strings.WalletType,
                        array: this.state.currency,
                        selectedValue: this.state.selectedCurrency,
                        onPickerSelect: (index, object) => this.setState({ selectedCurrency: index, selectedCurrencyCode: object.ID })
                    }
                ]}
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
                onResetPress={this.onReset}
                onCompletePress={this.onComplete}
            />
        )
    }

    render() {

        let filteredList = [];

        //for search all fields if response length > 0
        if (this.state.response.length) {
            filteredList = this.state.response.filter(item => (
                item.AddressLable.toLowerCase().includes(this.state.search.toLowerCase()) ||
                item.Address.toLowerCase().includes(this.state.search.toLowerCase()) ||
                item.WalletTypeName.toLowerCase().includes(this.state.search.toLowerCase()) ||
                item.ServiceProviderName.toLowerCase().includes(this.state.search.toLowerCase()) ||
                item.Email.toLowerCase().includes(this.state.search.toLowerCase())
            ));
        }

        return (
            <Drawer
                onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
                onDrawerClose={() => this.setState({ isDrawerOpen: false })}
                drawerContent={this.navigationDrawer()}
                type={Drawer.types.Overlay}
                easingFunc={Easing.ease}
                ref={component => this.drawer = component}
                drawerPosition={Drawer.positions.Right}
                drawerWidth={R.dimens.FilterDrawarWidth}
            >

                <SafeView style={
                    this.styles().container}>

                    {/* To set status bar as per our theme */}
                    <CommonStatusBar />

                    {/* To set Progress bar as per our theme */}

                    <ProgressDialog
                        ref={component => this.progressDialog = component} />

                    {/* To set toolbar as per our theme */}
                    <CustomToolbar
                        title={R.strings.daemonAddresses}
                        isBack={true}
                        nav={this.props.navigation}
                        searchable={true}
                        onSearchText={(input) => this.setState({ search: input })}
                        onBackPress={this.onBackPress}
                        rightIcon={R.images.FILTER}
                        onRightMenuPress={() => this.drawer.openDrawer()}
                    />

                    <View style={{ flex: 1, justifyContent: 'space-between' }}>

                        {(this.props.data.daemonAddressLoading && !this.state.refreshing)
                            ?
                            <ListLoader />
                            :
                            filteredList.length > 0 ?
                                <FlatList
                                    data={filteredList}
                                    extraData={this.state}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={({ item, index }) =>
                                        <DaemonAddressItem
                                            item={item}
                                            index={index}
                                            size={this.state.response.length} />
                                    }
                                    keyExtractor={(_item, index) => index.toString()}
                                    refreshControl={<RefreshControl
                                        refreshing={this.state.refreshing}
                                        onRefresh={this.onRefresh}
                                        colors={[R.colors.accent]}
                                        progressBackgroundColor={R.colors.background}
                                    />}
                                /> : <ListEmptyComponent />
                        }
                        {/*To Set Pagination View  */}
                        <View>
                            {filteredList.length > 0 && <PaginationWidget row={this.state.row} selectedPage={this.state.selectedPage} onPageChange={(item) => { this.onPageChange(item) }} />}
                        </View>
                    </View>

                </SafeView>

            </Drawer>

        );
    }

    styles = () => {
        return {
           
            container: {
                backgroundColor: R.colors.background,
                flex: 1,
            },
        }
    }
}

// This Class is used for display record in list
class DaemonAddressItem extends Component {
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

        let { index, size, item } = this.props;

        return (
            <AnimatableItem>
                <View style={{

                    flexDirection: 'column',
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginLeft: R.dimens.widget_left_right_margin,
                    flex: 1,
                    marginRight: R.dimens.widget_left_right_margin
                }}>
                    <CardView style={{
                        elevation: R.dimens.listCardElevation,
                        borderRadius: 0,
                        flex: 1,
                        borderBottomLeftRadius: R.dimens.margin,
                        flexDirection: 'column',
                        borderTopRightRadius: R.dimens.margin,
                    }}>
                        <View>
                            <View style={{ flex: 1, flexDirection: 'row' }}>

                                {/* WalletTypeName Image */}
                                <ImageViewWidget url={item.WalletTypeName ? item.WalletTypeName : ''} width={R.dimens.drawerMenuIconWidthHeight} height={R.dimens.drawerMenuIconWidthHeight} />

                                <View style={{ flex: 1, }}>

                                    {/* for show WalletTypeName  and  ServiceProviderName */}
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <TextViewMR style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>{item.WalletTypeName ? item.WalletTypeName : ' - '}</TextViewMR>
                                            <Text style={{ color: R.colors.accent, fontSize: R.dimens.smallestText, fontFamily: Fonts.MontserratSemiBold, }}>{item.IsDefaultAddress ? ' ' + R.strings.default : ''}</Text>
                                        </View>
                                        <TextViewMR style={{ color: R.colors.yellow, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>{!isEmpty(item.ServiceProviderName) ? item.ServiceProviderName : ' - '}</TextViewMR>
                                    </View>

                                    {/* for show AddressLable */}
                                    <View style={{ flex: 1, flexDirection: 'row' }}>
                                        <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText, fontFamily: Fonts.MontserratSemiBold, }}>{R.strings.addressLabel + ': '}</TextViewHML>
                                        <TextViewHML style={{ flex: 1, color: R.colors.textSecondary, fontSize: R.dimens.smallestText, fontFamily: Fonts.MontserratSemiBold, }}>{!isEmpty(item.AddressLable) ? item.AddressLable : ' - '}</TextViewHML>
                                    </View>

                                    {/* for show email */}
                                    <View style={{ flex: 1, flexDirection: 'row' }}>
                                        <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText, fontFamily: Fonts.MontserratSemiBold, }}>{R.strings.email + ': '}</TextViewHML>
                                        <TextViewHML style={{ flex: 1, color: R.colors.textSecondary, fontSize: R.dimens.smallestText, fontFamily: Fonts.MontserratSemiBold, }}>{!isEmpty(item.Email) ? item.Email : ' - '}</TextViewHML>
                                    </View>

                                    {/* for show Address  */}
                                    <View style={{ flex: 1, flexDirection: 'row' }}>
                                        <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText, fontFamily: Fonts.MontserratSemiBold, }}>{R.strings.Address + ': '}</TextViewHML>
                                        <TextViewHML style={{ flex: 1, color: R.colors.textSecondary, fontSize: R.dimens.smallestText, fontFamily: Fonts.MontserratSemiBold, }}>{!isEmpty(item.Address) ? item.Address : ' - '}</TextViewHML>
                                    </View>
                                </View>
                            </View >
                        </View>
                    </CardView>
                </View >
            </AnimatableItem >
        )
    }
}

function mapStatToProps(state) {
    //Updated Data For DaemonAddressReducer Data 
    let data = {
        ...state.DaemonAddressReducer,
    }
    return { data }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform getWalletType Action 
        getWalletType: () => dispatch(getWalletType()),
        //Perform getUserDataList Action 
        getUserDataList: () => dispatch(getUserDataList()),
        //Perform getProviderList Action 
        getProviderList: () => dispatch(getProviderList()),
        //Perform getDaemonAddresses List Action 
        getDaemonAddresses: (payload) => dispatch(getDaemonAddresses(payload)),
        //Perform clearDaemonAddress Action 
        clearDaemonAddress: () => dispatch(clearDaemonAddress())
    }
}

export default connect(mapStatToProps, mapDispatchToProps)(DaemonAddressScreen);