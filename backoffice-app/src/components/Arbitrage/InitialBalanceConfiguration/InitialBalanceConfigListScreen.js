// InitialBalanceConfigListScreen
import React, { Component } from 'react'
import { Text, View, FlatList, RefreshControl, Easing } from 'react-native'
import { changeTheme, parseArray, addPages, convertDateTime, getCurrentDate, parseFloatVal, } from '../../../controllers/CommonUtils';
import { isCurrentScreen, addRouteToBackPress } from '../../Navigation';
import SafeView from '../../../native_theme/components/SafeView';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import R from '../../../native_theme/R';
import { contentContainerStyle, ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import CardView from '../../../native_theme/components/CardView';
import PaginationWidget from '../../widget/PaginationWidget';
import { connect } from 'react-redux';
import ListLoader from '../../../native_theme/components/ListLoader';
import { isInternet, validateResponseNew, validateValue, } from '../../../validations/CommonValidation';
import Drawer from 'react-native-drawer-menu';
import { AppConfig } from '../../../controllers/AppConfig';
import { getArbitrageCurrencyList, getArbitrageProviderList } from '../../../actions/PairListAction';
import FilterWidget from '../../widget/FilterWidget';
import ImageViewWidget from '../../widget/ImageViewWidget';
import { Fonts } from '../../../controllers/Constants';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import { getInitialBalanceConfigurationList, clearInitialBalanceConfigurationData } from '../../../actions/Arbitrage/InitialBalanceConfigurationActions';
import StatusChip from '../../widget/StatusChip';
import { DateValidation } from '../../../validations/DateValidation';

export class InitialBalanceConfigListScreen extends Component {
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
            InitialBalanceConfigResponse: [],
            InitialBalanceConfigListState: null,

            FromDate: getCurrentDate(),
            ToDate: getCurrentDate(),
            selectedPage: 1, searchInput: '',

            refreshing: false,
            isDrawerOpen: false,
            isFirstTime: true,
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

        this.callInitialBalanceApi()
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
        this.props.clearInitialBalanceConfigurationData()
    }

    // for swipe to refresh functionality
    onRefresh = async () => {
        this.setState({ refreshing: true });

        // Check NetWork is Available or not
        if (await isInternet()) {

            // Bind request for Initial Balance Configuration List
            let request = {
                FromDate: this.state.FromDate, ToDate: this.state.ToDate,
                PageSize: AppConfig.pageSize,
                Page: this.state.selectedPage - 1,
                CurrencyName: this.state.selectedCurrency !== R.strings.selectCurrency ? this.state.selectedCurrency : '',
                ProviderID: this.state.selectedProvider !== R.strings.selectProvider ? this.state.ServiceProviderId : '',
            }
            // Call Get Initial Balance Configuration List API
            this.props.getInitialBalanceConfigurationList(request);

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
            selectedCurrency: R.strings.selectCurrency,
            selectedProvider: R.strings.selectProvider,
            FromDate: getCurrentDate(),
            ToDate: getCurrentDate(),
        })

        // Check NetWork is Available or not
        if (await isInternet()) {

            // Bind request for Initial Balance Configuration List
            let request = {
                FromDate: getCurrentDate(),
                ToDate: getCurrentDate(),
                Page: 0,
                PageSize: AppConfig.pageSize,
                CurrencyName: '',
                ProviderID: '',
            }
            //Call Get Initial Balance Configuration List API
            this.props.getInitialBalanceConfigurationList(request);

        } else {
            this.setState({ refreshing: false });
        }
    }

    // Call api when user pressed on complete button
    onCompletePress = async () => {

        if (DateValidation(this.state.FromDate, this.state.ToDate, true))
            this.toast.Show(DateValidation(this.state.FromDate, this.state.ToDate, true))
        else {
            this.setState({
                searchInput: '',
                selectedPage: 1,
                PageSize: AppConfig.pageSize,
            })

            // Close Drawer user press on Complete button bcoz display flatlist item on Screen
            this.drawer.closeDrawer();

            // Check NetWork is Available or not
            if (await isInternet()) {

                // Bind request for Initial Balance Configuration List
                let request = {
                    FromDate: this.state.FromDate,
                    ToDate: this.state.ToDate, Page: this.state.selectedPage - 1,
                    PageSize: AppConfig.pageSize,
                    ProviderID: this.state.selectedProvider !== R.strings.selectProvider ? this.state.ServiceProviderId : '',
                    CurrencyName: this.state.selectedCurrency !== R.strings.selectCurrency ? this.state.selectedCurrency : '',
                }
                //Call Get Initial Balance Configuration List API
                this.props.getInitialBalanceConfigurationList(request);

            } else {
                this.setState({ refreshing: false });
            }
        }
    }

    // Pagination Method Called When User Change Page 
    onPageChange = async (pageNo) => {

        //if selected page is diffrent than call api
        if (pageNo != this.state.selectedPage) {
            //if user selecte other page number then and only then API Call elase no need to call API
            this.setState({ selectedPage: pageNo });

            // Check NetWork is Available or not
            if (await isInternet()) {
                // Bind request for Initial Balance Configuration List
                let request = {
                    FromDate: this.state.FromDate,
                    ToDate: this.state.ToDate,
                    Page: pageNo - 1,
                    PageSize: AppConfig.pageSize,
                    CurrencyName: this.state.selectedCurrency !== R.strings.selectCurrency ? this.state.selectedCurrency : '',
                    ProviderID: this.state.selectedProvider !== R.strings.selectProvider ? this.state.ServiceProviderId : '',
                }
                //Call Get Initial Balance Configuration List API
                this.props.getInitialBalanceConfigurationList(request);
            } else {
                this.setState({ refreshing: false });
            }
        }
    }


    //api call
    callInitialBalanceApi = async () => {

        //Check NetWork is Available or not
        if (await isInternet()) {
            this.setState({ selectedPage: 1, })
            let request = {
                FromDate: getCurrentDate(),
                ToDate: getCurrentDate(),
                Page: 0,
                PageSize: AppConfig.pageSize,
            }
            // Call Initial Balance Configuration List Api
            this.props.getInitialBalanceConfigurationList(request)

        }
    }

    static oldProps = {};

    static getDerivedStateFromProps(props, state) {

        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return { ...state, isFirstTime: false, };
        }

        // To Skip Render if old and new props are equal
        if (InitialBalanceConfigListScreen.oldProps !== props) {
            InitialBalanceConfigListScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //Get All Updated Feild of Particular actions
            const { InitialBalanceConfigList, ArbitrageProviderList, ArbitrageCurrencyList } = props.InitialBalanceConfigResult

            // ArbitrageProviderList is not null
            if (ArbitrageProviderList) {
                try {
                    //if local ArbitrageProviderList state is null or its not null and also different then new response then and only then validate response.
                    if (state.ArbitrageProviderListState == null || (state.ArbitrageProviderListState !== null && ArbitrageProviderList !== state.ArbitrageProviderListState)) {

                        //if  response is success then store array list else store empty list
                        if (validateResponseNew({ response: ArbitrageProviderList, isList: true })) {
                            let res = parseArray(ArbitrageProviderList.Response);

                            for (var providerKey in res) {
                                let item = res[providerKey]
                                item.value = item.ProviderName
                            }

                            let providerNames = [
                                { value: R.strings.selectProvider },
                                ...res
                            ];

                            return { ...state,ArbitrageProviderListState: ArbitrageProviderList,  
                                 Provider: providerNames,  };
                        } else {
                            return { ...state,
                                 ArbitrageProviderListState: ArbitrageProviderList, Provider: [{ value: R.strings.selectProvider }] };
                        }
                    }
                } catch (e) {
                    return { ...state,
                         Provider: [{ value: R.strings.selectProvider }] };
                }
            }

            // ArbitrageCurrencyList is not null
            if (ArbitrageCurrencyList) {
                try {
                    //if local ArbitrageCurrencyList state is null or its not null and also different then new response then and only then validate response.
                    if (state.ArbitrageCurrencyListState == null || (state.ArbitrageCurrencyListState !== null && ArbitrageCurrencyList !== state.ArbitrageCurrencyListState)) {

                        //if  response is success then store array list else store empty list
                        if (validateResponseNew({isList: true,
                             response: ArbitrageCurrencyList,  })) {
                            let res = parseArray(ArbitrageCurrencyList.ArbitrageWalletTypeMasters);

                            for (var arbiCurrKey in res) {
                                let item = res[arbiCurrKey]
                                item.value = item.CoinName
                            }

                            let providerNames = [
                                { value: R.strings.selectCurrency },
                                ...res
                            ];

                            return { ...state, ArbitrageCurrencyListState: ArbitrageCurrencyList, Currency: providerNames };
                        } else {
                            return { ...state, Currency: [{ value: R.strings.selectCurrency }], ArbitrageCurrencyListState: ArbitrageCurrencyList, };
                        }
                    }
                } catch (e) {
                    return { ...state, Currency: [{ value: R.strings.selectCurrency }] };
                }
            }

            // InitialBalanceConfigList is not null
            if (InitialBalanceConfigList) {
                try {
                    if (state.InitialBalanceConfigListState == null || (state.InitialBalanceConfigListState !== null && InitialBalanceConfigList !== state.InitialBalanceConfigListState)) {
                        //succcess response fill the list 
                        if (validateResponseNew({ response: InitialBalanceConfigList, isList: true, })) {

                            return Object.assign({}, state, {
                                InitialBalanceConfigListState: InitialBalanceConfigList,
                                InitialBalanceConfigResponse: parseArray(InitialBalanceConfigList.Data),
                                refreshing: false,
                                row: addPages(InitialBalanceConfigList.TotalCount)
                            })
                        } else {
                            //if response is not validate than list is empty
                            return Object.assign({}, state, {
                                InitialBalanceConfigListState: null,
                                InitialBalanceConfigResponse: [],
                                refreshing: false,
                                row: []
                            })
                        }
                    }
                } catch (e) {
                    return Object.assign({}, state, {
                        InitialBalanceConfigResponse: [],
                        InitialBalanceConfigListState: null,
                        refreshing: false, row: [],
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
                ToDatePickerCall={(ToDate) => this.setState({ ToDate })}
                FromDatePickerCall={(FromDate) => this.setState({ FromDate })}
                toastRef={component => this.toast = component}
                FromDate={this.state.FromDate} ToDate={this.state.ToDate}
                onResetPress={this.onResetPress}
                comboPickerStyle={{ marginTop: 0 }}
                onCompletePress={this.onCompletePress}
                pickers={[
                    {
                        selectedValue: this.state.selectedProvider,
                        title: R.strings.Provider,
                        array: this.state.Provider,
                        onPickerSelect: (index, object) => this.setState({ selectedProvider: index, ServiceProviderId: object.Id })
                    },
                    {
                        title: R.strings.Currency, array: this.state.Currency,
                        selectedValue: this.state.selectedCurrency,
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
                    style={{ margin: 0, paddingTop: R.dimens.WidgetPadding, paddingBottom: R.dimens.WidgetPadding, paddingLeft: R.dimens.widgetMargin, paddingRight: R.dimens.widgetMargin, }}
                    iconStyle={[{ height: R.dimens.SMALL_MENU_ICON_SIZE, width: R.dimens.SMALL_MENU_ICON_SIZE, tintColor: R.colors.textSecondary }]}
                    icon={R.images.IC_PLUS}
                    onPress={() => { this.props.navigation.navigate('AddInitialBalanceScreen', { onSuccess: this.callInitialBalanceApi }) }} />
                <ImageTextButton
                    iconStyle={[{ height: R.dimens.SMALL_MENU_ICON_SIZE, width: R.dimens.SMALL_MENU_ICON_SIZE, tintColor: R.colors.textSecondary }]}
                    icon={R.images.FILTER}
                    style={{ margin: 0, paddingTop: R.dimens.WidgetPadding, paddingBottom: R.dimens.WidgetPadding, paddingLeft: R.dimens.widgetMargin, paddingRight: R.dimens.widgetMargin, }}
                    onPress={() => this.drawer.openDrawer()} />
            </View>
        )
    }

    render() {

        // Loading status for Progress bar which is fetching from reducer
        let { InitialBalanceConfigLoading, } = this.props.InitialBalanceConfigResult

        // For searching functionality
        let finalItems = this.state.InitialBalanceConfigResponse.filter(item => (
            item.Currency.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
            item.ProviderName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
            parseFloatVal(item.Amount).toFixed(8).toString().includes(this.state.searchInput)
        ))

        return (
            //DrawerLayout for Initial Balance Configuration Filteration
            <Drawer
                drawerWidth={R.dimens.FilterDrawarWidth} drawerContent={this.navigationDrawer()}
                onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
                onDrawerClose={() => this.setState({ isDrawerOpen: false })}
                ref={cmpDrawer => this.drawer = cmpDrawer}
                type={Drawer.types.Overlay}
                drawerPosition={Drawer.positions.Right}
                easingFunc={Easing.ease}>

                <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
                    {/* To set status bar as per our theme */}
                    <CommonStatusBar />

                    {/* To set toolbar as per our theme */}
                    <CustomToolbar
                        rightMenuRenderChilds={this.rightMenuRender()}
                        isBack={true}
                        onBackPress={() => this.onBackPress()}
                        title={R.strings.initialBalanceConfiguration}
                        nav={this.props.navigation}
                        searchable={true}
                        onSearchText={(text) => this.setState({ searchInput: text })} />

                    <View style={{ flex: 1, justifyContent: 'space-between' }}>
                        {
                            (InitialBalanceConfigLoading && !this.state.refreshing) ?
                                <ListLoader />
                                :
                                <FlatList
                                    data={finalItems}
                                    showsVerticalScrollIndicator={false}
                                    // render all item in list
                                    renderItem={({ item, index }) =>
                                        <InitialBalanceConfigListItem
                                            index={index}
                                            item={item}
                                            size={finalItems.length}
                                        />
                                    }
                                    // assign index as key value to Initial Balance Configuration list item
                                    keyExtractor={(_item, index) => index.toString()}
                                    // For Refresh Functionality In Initial Balance Configuration FlatList Item
                                    refreshControl={
                                        <RefreshControl
                                            progressBackgroundColor={R.colors.background}
                                            colors={[R.colors.accent]}
                                            refreshing={this.state.refreshing} onRefresh={this.onRefresh}
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
class InitialBalanceConfigListItem extends Component {


    shouldComponentUpdate(nextProps) {
        //Check If Old Props and New Props are Equal then Return False
        if (this.props.item === nextProps.item)
            return false
        return true
    }

    constructor(props) {
        super(props);
    }

    render() {
        let { size, index, item } =
         this.props
        return (
            // flatlist item animation
            <AnimatableItem>
                <View style={{
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,  marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginLeft: R.dimens.widget_left_right_margin,
                    marginRight: R.dimens.widget_left_right_margin,
                    flex: 1,
                }}>
                    <CardView style={{
                        borderRadius: 0,
                        elevation: R.dimens.listCardElevation,  borderBottomLeftRadius: R.dimens.margin,   borderTopRightRadius: R.dimens.margin,
                        flex: 1,
                    }} >

                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            {/* Currency Image */}
                            <ImageViewWidget url={item.Currency ? item.Currency : ''} width={R.dimens.drawerMenuIconWidthHeight} height={R.dimens.drawerMenuIconWidthHeight} />

                            <View style={{ flex: 1, marginLeft: R.dimens.widgetMargin, }}>
                                {/* for display currency and provider name and Amount*/}
                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>{item.Amount ? parseFloatVal((item.Amount)).toFixed(8) + ' ' : '-'}{validateValue(item.Currency)}</Text>
                                </View>
                                {/* for Provider Name */}
                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
                                    <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.provider + ': '}</TextViewHML>
                                    <TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{item.ProviderName ? item.ProviderName : ''}</TextViewHML>
                                </View>

                            </View>
                        </View>

                        {/* for show status and transaction date */}
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: R.dimens.widgetMargin }}>
                            <StatusChip
                                color={item.Status == 1 ? R.colors.successGreen : R.colors.failRed}
                                value={item.StrStatus ? item.StrStatus : '-'} />
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <ImageTextButton
                                    style={{ margin: 0, paddingRight: R.dimens.LineHeight, }}
                                    icon={R.images.IC_TIMER}
                                    iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
                                />
                                <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{item.TrnDate ? convertDateTime(item.TrnDate) : '-'}</TextViewHML>
                            </View>
                        </View>
                    </CardView>
                </View>
            </AnimatableItem>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        // get Initial Balance Configuration data from reducer
        InitialBalanceConfigResult: state.InitialBalanceConfigurationReducer,
    }
}

const mapDispatchToProps = (dispatch) => ({
    // Perform Initial Balance Configuration Action
    getInitialBalanceConfigurationList: (payload) => dispatch(getInitialBalanceConfigurationList(payload)),
    // Clear Initial Balance Configuration Data Action
    clearInitialBalanceConfigurationData: () => dispatch(clearInitialBalanceConfigurationData()),
    // Arbitrage Currency List Action
    getArbitrageCurrencyList: () => dispatch(getArbitrageCurrencyList()),
    // Arbitrage Provider List Action
    getArbitrageProviderList: () => dispatch(getArbitrageProviderList()),
})

export default connect(mapStateToProps, mapDispatchToProps)(InitialBalanceConfigListScreen)