import React, { Component } from 'react'
import { Text, View, FlatList, RefreshControl, Easing } from 'react-native'
import { changeTheme, addPages, parseArray, convertDateTime, parseIntVal, showAlert } from '../../../controllers/CommonUtils';
import { isCurrentScreen, addRouteToBackPress } from '../../Navigation';
import SafeView from '../../../native_theme/components/SafeView';
import R from '../../../native_theme/R';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { contentContainerStyle, ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import CardView from '../../../native_theme/components/CardView';
import Drawer from 'react-native-drawer-menu';
import FilterWidget from '../../widget/FilterWidget';
import { getDepositRouteList, deleteDepositRouteData, clearDepositRouteData } from '../../../actions/Wallet/DepositRouteActions';
import { getWalletType, getProviderList } from '../../../actions/PairListAction';
import { connect } from 'react-redux';
import { isInternet, validateValue, validateResponseNew } from '../../../validations/CommonValidation';
import ListLoader from '../../../native_theme/components/ListLoader';
import { AppConfig } from '../../../controllers/AppConfig';
import ImageViewWidget from '../../widget/ImageViewWidget';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import { Fonts } from '../../../controllers/Constants';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import StatusChip from '../../widget/StatusChip';
import PaginationWidget from '../../widget/PaginationWidget';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';

export class DepositRouteListScreen extends Component {
    constructor(props) {
        super(props);

        //Define all initial state
        this.state = {
            row: [],
            Currency: [],
            Provider: [],
            DepositRouteResponse: [],
            DeleteDepositRouteState: null,

            selectedPage: 1,
            ProviderId: 0,
            WalletTypeId: 0,
            isDrawerOpen: false,
            refreshing: false,
            isFirstTime: true,

            searchInput: '',
            selectedCurrency: R.strings.selectCurrency,
            selectedProvider: R.strings.selectProvider,
        }

        this.request = {
            PageNo: 0,
            PageSize: AppConfig.pageSize
        }

        //Bind all methods
        this.onBackPress = this.onBackPress.bind(this);

        //add current route for backpress handle
        addRouteToBackPress(props, this.onBackPress);
        this.props.navigation.setParams({ onBackPress: this.onBackPress });

        // Create Reference
        this.drawer = React.createRef()
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

        // check internet connection
        if (await isInternet()) {
            // Call Deposit Route List Api
            this.props.getDepositRouteList(this.request)
            // Call Wallet Data Api
            this.props.getWalletType()
            // Call Service Provider List Api
            this.props.getProviderList()
        }
    }

    shouldComponentUpdate = (nextProps, _nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps);
    }

    // for swipe to refresh functionality
    onRefresh = async (needUpdate, fromRefreshControl = false) => {
        if (fromRefreshControl)
            this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (needUpdate && await isInternet()) {

            this.request = {
                ...this.request,
                PageNo: this.state.selectedPage - 1,
                WalletTypeId: this.state.selectedCurrency !== R.strings.selectCurrency ? this.state.WalletTypeId : '',
                ProviderId: this.state.selectedProvider !== R.strings.selectProvider ? this.state.ProviderId : '',
            }

            // Call Deposit Route List Api
            this.props.getDepositRouteList(this.request)
        }
        else {
            this.setState({ refreshing: false });
        }
    }

    // Reset Filter
    onResetPress = async () => {
        // Close drawer
        this.drawer.closeDrawer();

        // set Initial State
        this.setState({
            searchInput: '',
            selectedPage: 1,
            WalletTypeId: 0,
            ProviderId: 0,
            PageSize: AppConfig.pageSize,
            selectedCurrency: R.strings.selectCurrency,
            selectedProvider: R.strings.selectProvider,
        })

        // Check NetWork is Available or not
        if (await isInternet()) {

            // Bind request for Deposit Route
            this.request = {
                ...this.request,
                PageNo: 0,
                WalletTypeId: '',
                ProviderId: '',
            }

            // Call Deposit Route List API
            this.props.getDepositRouteList(this.request);

        } else {
            this.setState({ refreshing: false });
        }
    }

    // Call api when user pressed on complete button
    onCompletePress = async () => {
        // Close Drawer user press on Complete button bcoz display flatlist item on Screen
        this.drawer.closeDrawer();

        this.setState({
            PageNo: 0,
            PageSize: AppConfig.pageSize,
        })

        //Check NetWork is Available or not
        if (await isInternet()) {

            // Bind request for Deposit Route
            this.request = {
                ...this.request,
                PageNo: 0,
                WalletTypeId: this.state.selectedCurrency !== R.strings.selectCurrency ? this.state.WalletTypeId : '',
                ProviderId: this.state.selectedProvider !== R.strings.selectProvider ? this.state.ProviderId : '',
            }

            //Call Get Deposit Route API
            this.props.getDepositRouteList(this.request);

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

                // Bind request for Deposit Route
                this.request = {
                    ...this.request,
                    PageNo: pageNo - 1,
                    WalletTypeId: this.state.selectedCurrency !== R.strings.selectCurrency ? this.state.WalletTypeId : '',
                    ProviderId: this.state.selectedProvider !== R.strings.selectProvider ? this.state.ProviderId : '',
                }
                //Call Get Deposit Route API
                this.props.getDepositRouteList(this.request);

            } else {
                this.setState({ refreshing: false });
            }
        }
    }

    // Show alert dialog when user press on delete button
    onDeletePress = (Id) => {
        showAlert(R.strings.alert, R.strings.delete_message, 3, async () => {

            // check internet connection
            if (await isInternet()) {
                // Delete Deposit Route Data Api Call
                this.props.deleteDepositRouteData({ Id: Id, Status: 9 })
            }
        }, R.strings.cancel, () => { })
    }

    static oldProps = {};

    static getDerivedStateFromProps(props, state) {

        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return { ...state, isFirstTime: false, };
        }

        // To Skip Render if old and new props are equal
        if (DepositRouteListScreen.oldProps !== props) {
            DepositRouteListScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //Get All Updated Feild of Particular actions
            const { DepositRouteList, WalletDataList, ServiceProviderList } = props.DepositRouteResult;

            // DepositRouteList is not null
            if (DepositRouteList) {
                try {
                    if (state.DepositRouteList == null || (state.DepositRouteList != null && DepositRouteList !== state.DepositRouteList)) {
                        //succcess response fill the list 
                        if (validateResponseNew({ response: DepositRouteList, isList: true })) {

                            return Object.assign({}, state, {
                                DepositRouteList,
                                DepositRouteResponse: parseArray(DepositRouteList.Data),
                                refreshing: false,
                                row: addPages(DepositRouteList.TotalCount)
                            })
                        } else {
                            //if response is not validate than list is empty
                            return Object.assign({}, state, {
                                DepositRouteList: null,
                                DepositRouteResponse: [],
                                refreshing: false,
                                row: []
                            })
                        }
                    }
                } catch (e) {
                    return Object.assign({}, state, {
                        DepositRouteList: null,
                        DepositRouteResponse: [],
                        refreshing: false,
                        row: [],
                    })
                    //Handle Catch and Notify User to Exception.
                    //Alert.alert('Status', e);
                }
            }

            // WalletDataList is not null
            if (WalletDataList) 
             {
                try 
                {
                    //if local WalletDataList state is null or its not null and also different then new response then and only then validate response.
                    if (state.WalletDataList == null 
                        || (state.WalletDataList != null 
                            && WalletDataList !== state.WalletDataList)) {

                        //if  response is success then store array list else store empty list
                        if (validateResponseNew(
                            { response: WalletDataList, isList: true }
                            )) 
                        {
                            let res = parseArray(WalletDataList.Types);

                            for (var dataItem in res) 
                            {
                                let item = res[dataItem];
                                item.value = item.TypeName;
                            }

                            let walletNames = 
                            [
                                { value: R.strings.selectCurrency },
                                ...res
                            ];

                            return { ...state,
                                 WalletDataList, 
                                 Currency: walletNames 
                                };
                        } 
                        else {
                            return { ...state, WalletDataList, 
                                Currency: [{ value: R.strings.selectCurrency }] };
                        }
                    }
                }
                 catch (e) {
                    return { ...state, Currency: [{ value: R.strings.selectCurrency }] };
                }
            }

            // ServiceProviderList is not null
            if (ServiceProviderList) {
                try {
                    //if local ServiceProviderList state is null or its not null and also different then new response then and only then validate response. 

                    if (state.ServiceProviderList == null || (state.ServiceProviderList != null 
                        && ServiceProviderList !== state.ServiceProviderList)) {

                        //if  response is success then store array list else store empty list
                        if (validateResponseNew({ response: ServiceProviderList, isList: true })) {
                          
                            let res = parseArray(ServiceProviderList.Response);

                            for (var serviceListKey in res) 
                            {
                                let item = res[serviceListKey]
                                item.value = item.ProviderName
                            }

                            let providerNames =
                             [
                                { value: R.strings.selectProvider },
                                ...res
                            ];

                            return { ...state, 
                                ServiceProviderList, 
                                Provider: providerNames 
                            };
                        } else
                        {
                            return { ...state, ServiceProviderList, Provider: [{ value: R.strings.selectProvider }] };
                        }
                    }
                } catch (e) {
                    return { ...state, 
                        Provider: [{ value: R.strings.selectProvider }] };
                }
            }
        }
        return null
    }

    componentDidUpdate(prevProps, _prevState) {
        const { DeleteDepositRoute, } = this.props.DepositRouteResult;

        // compare response with previous response
        if (DeleteDepositRoute !== prevProps.DepositRouteResult.DeleteDepositRoute) {

            // DeleteDepositRoute is not null
            if (DeleteDepositRoute) {
                try {
                    // if local DeleteDepositRoute state is null or its not null and also different then new response then and only then validate response.
                    if (this.state.DeleteDepositRouteState == null || (this.state.DeleteDepositRouteState != null && DeleteDepositRoute !== this.state.DeleteDepositRouteState)) {
                        //handle response of API
                        if (validateResponseNew({ response: DeleteDepositRoute })) {
                            this.setState({ DeleteDepositRouteState: DeleteDepositRoute })

                            //Display Success Message and Refresh Deposit Route List
                            showAlert(R.strings.Success + '!', R.strings.recordDeletedSuccessfully, 0, async () => {

                                // Clear Deposit Route Data 
                                this.props.clearDepositRouteData();

                                // Call Deposit Route List Api 
                                this.props.getDepositRouteList(this.request)

                            });
                        } else {
                            this.setState({ DeleteDepositRouteState: null })
                            // Clear Deposit Route Data 
                            this.props.clearDepositRouteData()
                        }
                    }
                } catch (error) {
                    this.setState({ DeleteDepositRouteState: null })
                    // Clear Deposit Route Data   
                    this.props.clearDepositRouteData();
                }
            }
        }
    }

    // Drawer Navigation
    navigationDrawer() {

        return (
            // for show filter of fromdate, todate,currency and provider data
            <FilterWidget
                onResetPress={this.onResetPress}
                onCompletePress={this.onCompletePress}
                toastRef={component => this.toast = component}
                pickers={[
                    {
                        title: R.strings.Currency,
                        array: this.state.Currency,
                        selectedValue: this.state.selectedCurrency,
                        onPickerSelect: (index, object) => this.setState({ selectedCurrency: index, WalletTypeId: object.ID })
                    },
                    {
                        title: R.strings.ServiceProvider,
                        array: this.state.Provider,
                        selectedValue: this.state.selectedProvider,
                        onPickerSelect: (index, object) => this.setState({ selectedProvider: index, ProviderId: object.Id })
                    },
                ]}
            />
        )
    }

    // Render Right Side Menu For Add Staking Configuration , Filters for Staking list  

    rightMenuRender = () => {
        return (
            <View style={{ flexDirection: 'row' }}>
                <ImageTextButton
                    style={{ margin: 0, paddingTop: R.dimens.WidgetPadding, paddingBottom: R.dimens.WidgetPadding, paddingLeft: R.dimens.widgetMargin, paddingRight: R.dimens.widgetMargin, }}
                    iconStyle={[{ 
                        height: R.dimens.SMALL_MENU_ICON_SIZE, width: 
                        R.dimens.SMALL_MENU_ICON_SIZE, tintColor: R.colors.textSecondary }]}
                    icon={R.images.IC_PLUS}
                    onPress={() => this.props.navigation.navigate('AddEditDepositRouteScreen', { onRefresh: this.onRefresh, item: undefined, Currency: this.state.Currency, Provider: this.state.Provider })} />
                <ImageTextButton
                    icon={R.images.FILTER}
                    style={{ margin: 0, paddingTop: R.dimens.WidgetPadding, paddingBottom: R.dimens.WidgetPadding, paddingLeft: R.dimens.widgetMargin, paddingRight: R.dimens.widgetMargin, }}
                    iconStyle={[{ height: R.dimens.SMALL_MENU_ICON_SIZE, width: R.dimens.SMALL_MENU_ICON_SIZE, tintColor: R.colors.textSecondary }]}
                    onPress={() => this.drawer.openDrawer()} />
            </View>
        )
    }

    render() {

        // Loading status for Progress bar which is fetching from reducer
        let { DepositRouteLoading, DeleteDepositRouteLoading } = this.props.DepositRouteResult

        // searching functionality
        let finalItems = this.state.DepositRouteResponse.filter(item => (
            item.WalletTypeName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
            item.SerProName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
            item.StrStatus.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
            item.RecordCount.toString().includes(this.state.searchInput) ||
            item.Limit.toString().includes(this.state.searchInput) ||
            item.MaxLimit.toString().includes(this.state.searchInput)
        ))

        return (
            //DrawerLayout for Deposit Route Filteration
            <Drawer
            type={Drawer.types.Overlay}
            drawerWidth={R.dimens.FilterDrawarWidth}
            onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
            onDrawerClose={() => this.setState({ isDrawerOpen: false })}
            ref={cmpDrawer => this.drawer = cmpDrawer}
            drawerPosition={Drawer.positions.Right}
            drawerContent={this.navigationDrawer()}
                easingFunc={Easing.ease}>

                <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                    {/* To set status bar as per our theme */}
                    <CommonStatusBar />

                    {/* To set toolbar as per our theme */}
                    <CustomToolbar
                        isBack={true}
                        title={R.strings.deposit_route}
                        onBackPress={this.onBackPress}
                        nav={this.props.navigation}
                        rightMenuRenderChilds={this.rightMenuRender()}
                        searchable={true}
                        onSearchText={(text) => this.setState({ searchInput: text })} />

                    {/* Progressbar */}
                    <ProgressDialog isShow={DeleteDepositRouteLoading} />

                    <View style={{ flex: 1, justifyContent: 'space-between' }}>
                        {
                            (DepositRouteLoading && !this.state.refreshing) ?
                                <ListLoader />
                                :
                                <FlatList
                                    data={finalItems}
                                    showsVerticalScrollIndicator={false}
                                    // render all item in list
                                    renderItem={({ item, index }) => <DepositRouteListItem
                                        index={index}
                                        item={item}
                                        size={finalItems.length}
                                        onEdit={() => this.props.navigation.navigate('AddEditDepositRouteScreen', { item, onRefresh: this.onRefresh, Currency: this.state.Currency, Provider: this.state.Provider })}
                                        onDelete={() => this.onDeletePress(item.Id)} />
                                    }
                                    // assign index as key value to Deposit Route list item
                                    keyExtractor={(_item, index) => index.toString()}
                                    // For Refresh Functionality In Deposit Route FlatList Item
                                    refreshControl={
                                        <RefreshControl
                                            colors={[R.colors.accent]}
                                            progressBackgroundColor={R.colors.background}
                                            refreshing={this.state.refreshing}
                                            onRefresh={() => this.onRefresh(true, true)}
                                        />
                                    }
                                    contentContainerStyle={contentContainerStyle(finalItems)}
                                    // Displayed empty component when no record found 
                                    ListEmptyComponent={<ListEmptyComponent module={R.strings.addRoute} onPress={() =>
                                        this.props.navigation.navigate('AddEditDepositRouteScreen', { onRefresh: this.onRefresh, item: undefined, Currency: this.state.Currency, Provider: this.state.Provider })
                                    } />}
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
class DepositRouteListItem extends Component {

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
        let { size, index, item, onEdit, onDelete } = this.props

        return (
            // flatlist item animation
            <AnimatableItem>
                <View style={{
                    marginRight: R.dimens.widget_left_right_margin,  flex: 1,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginLeft: R.dimens.widget_left_right_margin, marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                }}>
                    <CardView style={{
                        borderRadius: 0,
                        borderTopRightRadius: R.dimens.margin,
                        elevation: R.dimens.listCardElevation,  borderBottomLeftRadius: R.dimens.margin,
                        flex: 1,
                    }}>

                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            {/* Currency Image */}
                            <ImageViewWidget url={item.WalletTypeName ? item.WalletTypeName : ''} width={R.dimens.drawerMenuIconWidthHeight} height={R.dimens.drawerMenuIconWidthHeight} />

                            <View style={{ flex: 1, marginLeft: R.dimens.widgetMargin, }}>

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                                    {/* Currency Name */}
                                    <Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>{validateValue(item.WalletTypeName)}</Text>

                                    {/* Date */}
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                                        <ImageTextButton
                                            style={{ margin: 0, paddingRight: R.dimens.LineHeight, }}
                                            icon={R.images.IC_TIMER}
                                            iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
                                        />
                                        <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{convertDateTime(item.UpdatedDate, 'YYYY-MM-DD HH:mm:ss', false)}</TextViewHML>
                                    </View>
                                </View>

                                {/* Provider Name */}
                                <View style={{ flexDirection: 'row' }}>
                                    <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.Provider}: </TextViewHML>
                                    <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{validateValue(item.SerProName)}</TextViewHML>
                                </View>

                            </View>
                        </View>

                        {/* for show Amount, charge and leverage amount */}
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>

                            <View style={{ width: '40%', alignItems: 'center', justifyContent: 'center' }}>
                                <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, textAlign: 'center' }}>{R.strings.recordCount}</TextViewHML>
                                <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText, }}>
                                    {validateValue(parseIntVal(item.RecordCount))}
                                </TextViewHML>
                            </View>

                            <View style={{ width: '30%', alignItems: 'center', }}>
                                <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.Limit}</TextViewHML>
                                <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>
                                    {validateValue(parseIntVal(item.Limit))}
                                </TextViewHML>
                            </View>

                            <View style={{ width: '30%', alignItems: 'center', }}>
                                <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.maxLimit}</TextViewHML>
                                <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>
                                    {validateValue(parseIntVal(item.MaxLimit))}
                                </TextViewHML>
                            </View>
                        </View>

                        {/* for show status and button for edit,status,delete */}
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: R.dimens.widgetMargin, }}>
                            <StatusChip
                                color={item.Status == 1 ? R.colors.successGreen : R.colors.failRed}
                                value={item.StrStatus}></StatusChip>
                            <View>
                                <View style={{ flexDirection: 'row' }}>
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
                                        onPress={onEdit} />

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
                                        onPress={onDelete} />
                                </View>
                            </View>
                        </View>

                    </CardView>
                </View>
            </AnimatableItem>
        )
    }

    styles = () => {
        return {
            iconStyle: {
                tintColor: R.colors.white,
                width: R.dimens.titleIconHeightWidth,
                height: R.dimens.titleIconHeightWidth,
            },
            imageButtonStyle: {
                margin: 0,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: R.colors.accent,
                borderRadius: R.dimens.titleIconHeightWidth,
                padding: R.dimens.CardViewElivation,
                marginRight: R.dimens.padding_left_right_margin,
            }
        }
    }
}

const mapStateToProps = (state) => {
    return {
        // get transfer fee data from reducer
        DepositRouteResult: state.DepositRouteReducer,
    }
};

const mapDispatchToProps = (dispatch) => ({
    // To Perform Transfer Fee List Action
    getDepositRouteList: (payload) => dispatch(getDepositRouteList(payload)),
    // To Perform Wallet Data Action
    getWalletType: () => dispatch(getWalletType()),
    // To Perform Provider List Action
    getProviderList: () => dispatch(getProviderList()),
    // To Perform Delete Deposit Route Action
    deleteDepositRouteData: (payload) => dispatch(deleteDepositRouteData(payload)),
    // To Clear Deposit Route Data Action
    clearDepositRouteData: () => dispatch(clearDepositRouteData()),
});

export default connect(mapStateToProps, mapDispatchToProps)(DepositRouteListScreen);