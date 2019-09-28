// ProviderAddressListScreen
import React, { Component } from 'react'
import { Text, View, FlatList, RefreshControl, Easing } from 'react-native'
import { changeTheme, parseArray, addPages, } from '../../../controllers/CommonUtils';
import { isCurrentScreen, addRouteToBackPress } from '../../Navigation';
import SafeView from '../../../native_theme/components/SafeView';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import R from '../../../native_theme/R';
import { contentContainerStyle, ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import CardView from '../../../native_theme/components/CardView';
import PaginationWidget from '../../widget/PaginationWidget';
import { clearProviderAddressData } from '../../../actions/Arbitrage/ProviderAddressAction';
import { connect } from 'react-redux';
import ListLoader from '../../../native_theme/components/ListLoader';
import { isInternet, validateResponseNew, } from '../../../validations/CommonValidation';
import Drawer from 'react-native-drawer-menu';
import { AppConfig } from '../../../controllers/AppConfig';
import { getArbitrageCurrencyList, getArbitrageProviderList, getProviderAddressList } from '../../../actions/PairListAction';
import FilterWidget from '../../widget/FilterWidget';
import ImageViewWidget from '../../widget/ImageViewWidget';
import { Fonts } from '../../../controllers/Constants';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';

export class ProviderAddressListScreen extends Component {
    constructor(props) {
        super(props);

        //Define all initial state
        this.state = {
            row: [],

            // for provider List
            Provider: [],
            ArbitrageProviderListState: null,
            selectedProvider: R.strings.selectProvider,
            ServiceProviderId: 0,

            // For Currency List
            Currency: [],
            ArbitrageCurrencyListState: null,
            selectedCurrency: R.strings.selectCurrency,
            WalletTypeId: 0,

            // for provider List
            ProviderAddressResponse: [],
            ProviderAddressListState: null,

            refreshing: false,
            isFirstTime: true,
            isDrawerOpen: false,

            Address: '',
            selectedPage: 1,
            searchInput: '',
        }

        //Initial request
        this.request = {
            PageSize: AppConfig.pageSize,
            PageNo: 1,
        }

        // Create Reference
        this.drawer = React.createRef()

        //add current route for backpress handle
        addRouteToBackPress(props, this.onBackPress);
        this.props.navigation.setParams({ onBackPress: this.onBackPress });
    }

    // If drawer is open then first, it will close the drawer and after it will return to previous screen
    onBackPress = () => {
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
        changeTheme()

        this.callProviderAddressApi()
        // Call Arbitrage Currency List Api
        this.props.getArbitrageCurrencyList()
        // Call Arbitrage Provider List Api
        this.props.getArbitrageProviderList()
    }

    shouldComponentUpdate(nextProps, _nextState) {
        //stop twice api call
        return isCurrentScreen(nextProps)
    }

    componentWillUnmount() {
        // clear reducer data
        this.props.clearProviderAddressData()
    }

    // for swipe to refresh functionality
    onRefresh = async () => {
        this.setState({ refreshing: true });

        // Check NetWork is Available or not
        if (await isInternet()) {

            // Bind request for Provider Address List
            this.request = {
                ...this.request,
                PageNo: this.state.selectedPage,
                ServiceProviderId: this.state.selectedProvider !== R.strings.selectProvider ? this.state.ServiceProviderId : '',
                WalletTypeId: this.state.selectedCurrency !== R.strings.selectCurrency ? this.state.WalletTypeId : '',
                Address: this.state.Address
            }
            // Call Get Provider Address List API
            this.props.getProviderAddressList(this.request);

        } else {
            this.setState({ refreshing: false });
        }
    }

    // Reset Filter
    onResetPress = async () => {
        // Close drawer
        this.drawer.closeDrawer()

        // set Initial State
        this.setState({
            searchInput: '',
            selectedPage: 1,
            ServiceProviderId: 0,
            WalletTypeId: 0,
            selectedCurrency: R.strings.selectCurrency,
            selectedProvider: R.strings.selectProvider,
            Address: ''
        })

        // Check NetWork is Available or not
        if (await isInternet()) {

            // Bind request for Provider Address List
            this.request = {
                ...this.request,
                PageNo: 1,
                ServiceProviderId: '',
                WalletTypeId: '',
                Address: ''
            }
            //Call Get Provider Address List API
            this.props.getProviderAddressList(this.request);

        } else {
            this.setState({ refreshing: false });
        }
    }

    // Call api when user pressed on complete button
    onCompletePress = async () => {

        this.setState({
            selectedPage: 1,
            PageSize: AppConfig.pageSize,
        })

        // Close Drawer user press on Complete button bcoz display flatlist item on Screen
        this.drawer.closeDrawer();

        // Check NetWork is Available or not
        if (await isInternet()) {

            // Bind request for Provider Address List
            this.request = {
                ...this.request,
                PageNo: 1,
                WalletTypeId: this.state.selectedCurrency !== R.strings.selectCurrency ? this.state.WalletTypeId : '',
                ServiceProviderId: this.state.selectedProvider !== R.strings.selectProvider ? this.state.ServiceProviderId : '',
                Address: this.state.Address
            }
            //Call Get Provider Address List API
            this.props.getProviderAddressList(this.request);

        } else {
            this.setState({ refreshing: false });
        }

        //If Filter from Complete Button Click then empty searchInput
        this.setState({ searchInput: '' })

    }

    // Pagination Method Called When User Change Page 
    onPageChange = async (pageNo) => {

        //if selected page is diffrent than call api
        if (pageNo != this.state.selectedPage) {
            //if user selecte other page number then and only then API Call elase no need to call API
            this.setState({ selectedPage: pageNo });

            // Check NetWork is Available or not
            if (await isInternet()) {
                // Bind request for Provider Address List
                this.request = {
                    ...this.request,
                    PageNo: pageNo,
                    WalletTypeId: this.state.selectedCurrency !== R.strings.selectCurrency ? this.state.WalletTypeId : '',
                    ServiceProviderId: this.state.selectedProvider !== R.strings.selectProvider ? this.state.ServiceProviderId : '',
                    Address: this.state.Address
                }
                //Call Get Provider Address List API
                this.props.getProviderAddressList(this.request);
            } else {
                this.setState({ refreshing: false });
            }
        }
    }

    //api call
    callProviderAddressApi = async () => {

        //Check NetWork is Available or not
        if (await isInternet()) {
            this.setState({ selectedPage: 1 })
            this.request = {
                PageNo: 1,
                PageSize: AppConfig.pageSize,
            }
            // Call Provider Address List Api
            this.props.getProviderAddressList(this.request)

        }
    }

    static oldProps = {};

    static getDerivedStateFromProps(props, state) {

        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return { ...state, isFirstTime: false, };
        }

        // To Skip Render if old and new props are equal
        if (ProviderAddressListScreen.oldProps !== props) {
            ProviderAddressListScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //Get All Updated Feild of Particular actions
            const { ProviderAddressList, ArbitrageProviderList, ArbitrageCurrencyList } = props.ProviderAddressResult

            // ArbitrageProviderList is not null
            if (ArbitrageProviderList) {
                try {
                    //if local ArbitrageProviderList state is null or its not null and also different then new response then and only then validate response.
                    if (state.ArbitrageProviderListState == null || (ArbitrageProviderList !== state.ArbitrageProviderListState)) {

                        //if  response is success then store array list else store empty list
                        if (validateResponseNew({ response: ArbitrageProviderList, isList: true })) {
                            let res = parseArray(ArbitrageProviderList.Response);

                            for (var providerKey in res) {
                                let item = res[providerKey]; item.value = item.ProviderName
                            }

                            let providerNames = [
                                { value: R.strings.selectProvider }, ...res
                            ];

                            return { ...state, ArbitrageProviderListState: ArbitrageProviderList, Provider: providerNames, };
                        } else {
                            return { ...state, ArbitrageProviderListState: ArbitrageProviderList, Provider: [{ value: R.strings.selectProvider }] };
                        }
                    }
                }
                catch (e) {
                    return { ...state, Provider: [{ value: R.strings.selectProvider }] };
                }
            }

            // ArbitrageCurrencyList is not null
            if (ArbitrageCurrencyList) {
                try {
                    //if local ArbitrageCurrencyList state is null or its not null and also different then new response then and only then validate response.
                    if (state.ArbitrageCurrencyListState == null ||
                        (ArbitrageCurrencyList !== state.ArbitrageCurrencyListState)) {

                        //if  response is success then store array list else store empty list
                        if (validateResponseNew({ response: ArbitrageCurrencyList, isList: true })) {
                            let res = parseArray(ArbitrageCurrencyList.ArbitrageWalletTypeMasters);

                            for (var walletArbiKey in res) {
                                let item = res[walletArbiKey]
                                item.value = item.CoinName
                            }

                            let providerNames = [
                                { value: R.strings.selectCurrency },
                                ...res
                            ];

                            return { ...state, ArbitrageCurrencyListState: ArbitrageCurrencyList, Currency: providerNames };
                        } else {
                            return { ...state, ArbitrageCurrencyListState: ArbitrageCurrencyList, Currency: [{ value: R.strings.selectCurrency }] };
                        }
                    }
                } catch (e) {
                    return { ...state, Currency: [{ value: R.strings.selectCurrency }] };
                }
            }

            // ProviderAddressList is not null
            if (ProviderAddressList) {
                try {
                    if (state.ProviderAddressListState == null || (ProviderAddressList !== state.ProviderAddressListState)) {
                        //succcess response fill the list 
                        if (validateResponseNew({ response: ProviderAddressList, isList: true, })) {

                            return Object.assign({}, state, {
                                ProviderAddressListState: ProviderAddressList,
                                ProviderAddressResponse: parseArray(ProviderAddressList.Data),
                                refreshing: false,
                                row: addPages(ProviderAddressList.TotalCount)
                            })
                        } else {
                            //if response is not validate than list is empty
                            return Object.assign({}, state, {
                                ProviderAddressListState: null,
                                ProviderAddressResponse: [],
                                refreshing: false,
                                row: []
                            })
                        }
                    }
                } catch (e) {
                    return Object.assign({}, state, {
                        ProviderAddressListState: null,
                        ProviderAddressResponse: [],
                        refreshing: false,
                        row: [],
                    })
                }
            }
        }
        return null
    }

    // Drawer Navigation
    navigationDrawer() {

        return (
            // for show filter of fromdate, todate,currency and user data etc
            <FilterWidget
                onResetPress={this.onResetPress}
                onCompletePress={this.onCompletePress}
                toastRef={component => this.toast = component}
                textInputStyle={{ marginTop: 0, marginBottom: 0, }}
                textInputs={[
                    {
                        header: R.strings.Address,
                        placeholder: R.strings.Address,
                        multiline: false,
                        keyboardType: 'default',
                        returnKeyType: "done",
                        onChangeText: (Address) => { this.setState({ Address: Address }) },
                        value: this.state.Address,
                    }
                ]}
                comboPickerStyle={{ marginTop: 0 }}
                pickers={[
                    {
                        array: this.state.Provider, selectedValue: this.state.selectedProvider,
                        title: R.strings.Provider,
                        onPickerSelect: (index, object) => this.setState({ selectedProvider: index, ServiceProviderId: object.Id })
                    },
                    {
                        selectedValue: this.state.selectedCurrency,
                        title: R.strings.Currency, array: this.state.Currency,
                        onPickerSelect: (index, object) => this.setState({ selectedCurrency: index, WalletTypeId: object.Id })
                    },
                ]}
            />
        )
    }

    // Render Right Side Menu For Add , Filters , 
    rightMenuRender = () => {
        return (
            <View style={{ flexDirection: 'row' }}>
                <ImageTextButton
                    iconStyle={[{ height: R.dimens.SMALL_MENU_ICON_SIZE, width: R.dimens.SMALL_MENU_ICON_SIZE, tintColor: R.colors.textSecondary }]}
                    style={{ margin: 0, paddingTop: R.dimens.WidgetPadding, paddingBottom: R.dimens.WidgetPadding, paddingLeft: R.dimens.widgetMargin, paddingRight: R.dimens.widgetMargin, }}
                    icon={R.images.IC_PLUS}
                    onPress={() => { this.props.navigation.navigate('AddEditProviderAddressScreen', { onSuccess: this.callProviderAddressApi }) }} />
                <ImageTextButton
                    icon={R.images.FILTER}
                    iconStyle={[{ height: R.dimens.SMALL_MENU_ICON_SIZE, width: R.dimens.SMALL_MENU_ICON_SIZE, tintColor: R.colors.textSecondary }]}
                    style={{ margin: 0, paddingTop: R.dimens.WidgetPadding, paddingBottom: R.dimens.WidgetPadding, paddingLeft: R.dimens.widgetMargin, paddingRight: R.dimens.widgetMargin, }}
                    onPress={() => this.drawer.openDrawer()} />
            </View>
        )
    }

    render() {

        // Loading status for Progress bar which is fetching from reducer
        let { ProviderAddressLoading, } = this.props.ProviderAddressResult

        // For searching functionality
        let finalItems = this.state.ProviderAddressResponse.filter(item => (
            item.WalletTypeName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
            item.ServiceProviderName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
            item.Address.toLowerCase().includes(this.state.searchInput.toLowerCase())
        ))

        return (
            //DrawerLayout for Provider Address Filteration
            <Drawer
                drawerWidth={R.dimens.FilterDrawarWidth}
                ref={cmpDrawer => this.drawer = cmpDrawer}
                onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
                drawerContent={this.navigationDrawer()}
                type={Drawer.types.Overlay}
                onDrawerClose={() => this.setState({ isDrawerOpen: false })}
                drawerPosition={Drawer.positions.Right}
                easingFunc={Easing.ease}>

                <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                    {/* To set status bar as per our theme */}
                    <CommonStatusBar />

                    {/* To set toolbar as per our theme */}
                    <CustomToolbar
                        title={R.strings.providerAddress}
                        onBackPress={() => this.onBackPress()} isBack={true}
                        nav={this.props.navigation}
                        rightMenuRenderChilds={this.rightMenuRender()}
                        searchable={true}
                        onSearchText={(text) => this.setState({ searchInput: text })} />

                    <View style={{ flex: 1, justifyContent: 'space-between' }}>
                        {
                            (ProviderAddressLoading && !this.state.refreshing) ?
                                <ListLoader />
                                :
                                <FlatList
                                    data={finalItems}
                                    showsVerticalScrollIndicator={false}
                                    // render all item in list
                                    renderItem={({ item, index }) => <ProviderAddressListItem
                                        index={index}
                                        item={item}
                                        size={finalItems.length}
                                        onPress={() => { this.props.navigation.navigate('AddEditProviderAddressScreen', { item, onSuccess: this.callProviderAddressApi, edit: true }) }}
                                    />
                                    }
                                    // assign index as key value to Provider Address list item
                                    keyExtractor={(_item, index) => index.toString()}
                                    // For Refresh Functionality In Provider Address FlatList Item
                                    refreshControl={
                                        <RefreshControl
                                            refreshing={this.state.refreshing}
                                            onRefresh={this.onRefresh}
                                            colors={[R.colors.accent]} progressBackgroundColor={R.colors.background}
                                        />
                                    }
                                    contentContainerStyle={contentContainerStyle(finalItems)}
                                    // Displayed empty component when no record found 
                                    ListEmptyComponent={<ListEmptyComponent />}
                                />
                        }

                        {/*To Set Pagination View  */}
                        <View>
                            {
                                finalItems.length > 0 &&
                                <PaginationWidget selectedPage={this.state.selectedPage} onPageChange={(item) => { this.onPageChange(item) }} row={this.state.row} />
                            }
                        </View>
                    </View>
                </SafeView>
            </Drawer>
        )
    }
}

// This Class is used for display record in list
class ProviderAddressListItem extends Component {

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        //Check If Old Props and New Props are Equal then Return False
        if (this.props.item === nextProps.item)
            return false
        return true
    }

    render() {
        let { size, index, item, onPress } = this.props
        return (
            // flatlist item animation
            <AnimatableItem>
                <View style={{
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin, marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    flex: 1,
                    marginLeft: R.dimens.widget_left_right_margin,
                    marginRight: R.dimens.widget_left_right_margin
                }}>
                    <CardView style={{
                        flex: 1,
                        elevation: R.dimens.listCardElevation, borderBottomLeftRadius: R.dimens.margin,
                        borderTopRightRadius: R.dimens.margin,
                        borderRadius: 0,
                    }} >

                        <View style={{ flexDirection: 'row', flex: 1, }}>
                            {/* Currency Image */}
                            <ImageViewWidget url={item.WalletTypeName ? item.WalletTypeName : ''} width={R.dimens.drawerMenuIconWidthHeight} height={R.dimens.drawerMenuIconWidthHeight} />

                            <View style={{ flex: 1, marginLeft: R.dimens.widgetMargin, }}>
                                {/* for  Wallet Type Name and Dfault Address and ServiceProvider name*/}
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>{item.WalletTypeName}</Text>
                                        <Text style={{ color: R.colors.accent, fontSize: R.dimens.smallestText, fontFamily: Fonts.MontserratSemiBold, }}>{item.IsDefaultAddress ? ' - ' + R.strings.default : ''}</Text>
                                    </View>
                                    <Text style={{ flex: 1, textAlign: 'right', color: R.colors.yellow, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>{item.ServiceProviderName ? item.ServiceProviderName : ''}</Text>
                                </View>
                                {/* for Address */}
                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
                                    <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.Address + ': '}</TextViewHML>
                                    <TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{item.Address ? item.Address : ''}</TextViewHML>
                                </View>

                            </View>
                        </View>

                        {/* for show edit icon */}
                        <View style={{ flex: 1, alignSelf: 'flex-end', justifyContent: 'flex-end' }}>
                            <ImageTextButton
                                style={
                                    {
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: R.colors.accent,
                                        borderRadius: R.dimens.titleIconHeightWidth,
                                        margin: 0,
                                        padding: R.dimens.CardViewElivation,
                                        marginRight: R.dimens.widgetMargin,
                                    }}
                                icon={R.images.IC_EDIT}
                                iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: 'white' }}
                                onPress={onPress} />
                        </View>
                    </CardView>
                </View>
            </AnimatableItem>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        // get provider Address data from reducer
        ProviderAddressResult: state.ProviderAddressReducer,
    }
}

const mapDispatchToProps = (dispatch) => ({
    // Perform Provider Address Action
    getProviderAddressList: (payload) => dispatch(getProviderAddressList(payload)),
    // Clear Provider Address Data Action
    clearProviderAddressData: () => dispatch(clearProviderAddressData()),
    // Arbitrage Currency List Action
    getArbitrageCurrencyList: () => dispatch(getArbitrageCurrencyList()),
    // Arbitrage Provider List Action
    getArbitrageProviderList: () => dispatch(getArbitrageProviderList()),
})

export default connect(mapStateToProps, mapDispatchToProps)(ProviderAddressListScreen)