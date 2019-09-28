import React, { Component } from 'react'
import { Text, View, RefreshControl, FlatList, Easing } from 'react-native'
import { addRouteToBackPress, isCurrentScreen } from '../../Navigation';
import FilterWidget from '../../widget/FilterWidget';
import SafeView from '../../../native_theme/components/SafeView';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { contentContainerStyle, ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import CardView from '../../../native_theme/components/CardView';
import R from '../../../native_theme/R';
import { changeTheme, parseArray, parseIntVal, convertDateTime } from '../../../controllers/CommonUtils';
import Drawer from 'react-native-drawer-menu';
import { getTransferFeeList } from '../../../actions/Wallet/ERC223DashboardActions';
import ListLoader from '../../../native_theme/components/ListLoader';
import { connect } from 'react-redux';
import { isInternet, validateResponseNew, validateValue } from '../../../validations/CommonValidation';
import ImageViewWidget from '../../widget/ImageViewWidget';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import { Fonts } from '../../../controllers/Constants';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import { DateValidation } from '../../../validations/DateValidation';
import { getWalletType } from '../../../actions/PairListAction';

export class SetTransferFeeListScreen extends Component {
    constructor(props) {
        super(props);
        //To Bind All Method
        this.onBackPress = this.onBackPress.bind(this);


        //Define all initial state
        this.state = {
            Currency: [],
            SetTransferFeeResponse: [],

            searchInput: '',
            WalletTypeId: 0,
            refreshing: false,
            isFirstTime: true,
            isDrawerOpen: false,

            FromDate: '',
            ToDate: '',
            selectedCurrency: R.strings.selectCurrency,

        }

        //Add Current Screen to Manual Handling BackPress Events
        addRouteToBackPress(props, this.onBackPress);
        this.props.navigation.setParams(
            { onBackPress: this.onBackPress });
    }


    componentDidMount = async () => {

        //Add this method to change theme based on stored theme name.
        changeTheme();

        // check internet connection
        if (await isInternet()) {
            // Transfer Fee List Api
            //this.props.getTransferFeeList()
            this.props.getTransferFeeList()
            // Call Get Wallet List Api
            this.props.getWalletType()
        }
    }

    shouldComponentUpdate = (nextProps, _nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps);
    }
    //for BackPress if Drawer is Open Than First Close The Drawer else Back to Previous Screen
    onBackPress() {
        if (this.state.isDrawerOpen) {
            this.drawer.closeDrawer();
            this.setState({ isDrawerOpen: false })
        }
        else {
            //going back screen
            this.props.navigation.goBack();
        }
    }

    // Reset Filter
    onResetPress = async () => {
        this.drawer.closeDrawer();

        // set Initial State
        this.setState({
            selectedCurrency: R.strings.selectCurrency,
            FromDate: '',
            ToDate: '',
            searchInput: '',
            WalletTypeId: 0,
        })

        // Check NetWork is Available or not
        if (await isInternet()) {

            // Bind request for Transfer Fee
            let req = {
                FromDate: '',
                ToDate: '',
                WalletTypeId: '',
            }

            // Call Transfer Fee List API
            this.props.getTransferFeeList(req);

        } else {
            this.setState({ refreshing: false });
        }
    }

    // Api Call when press on complete button
    onCompletePress = async () => {

        // Both date required
        if (this.state.FromDate === "" && this.state.ToDate !== "" || this.state.FromDate !== "" && this.state.ToDate === "") {
            this.toast.Show(R.strings.bothDateRequired);
            return
        }
        //Check All From Date Validation
        if (DateValidation(this.state.FromDate, this.state.ToDate, true)) {
            this.toast.Show(DateValidation(this.state.FromDate, this.state.ToDate, true));
        }
        else {
            // Close Drawer user press on Complete button bcoz display flatlist item on Screen
            this.drawer.closeDrawer();

            //Check NetWork is Available or not
            if (await isInternet()) {

                // Bind request for Transfer Fee List
                let req = {
                    FromDate: this.state.FromDate,
                    ToDate: this.state.ToDate,
                    WalletTypeId: this.state.selectedCurrency !== R.strings.selectCurrency ? this.state.WalletTypeId : '',
                }

                // Call Transfer Fee List API
                this.props.getTransferFeeList(req);

            } else {
                this.setState({ refreshing: false });
            }
            //If Filter from Complete Button Click then empty searchInput
            this.setState({ searchInput: '' })
        }
    }

    //For Swipe to referesh Functionality
    onRefresh = async (needUpdate, fromRefreshControl = false) => {
        if (fromRefreshControl)
            this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (needUpdate && await isInternet()) {

            // Bind request for Transfer Fee
            let req = {
                FromDate: this.state.FromDate,
                ToDate: this.state.ToDate,
                WalletTypeId: this.state.selectedCurrency !== R.strings.selectCurrency ? this.state.WalletTypeId : '',
            }

            //Call Get Transfer Fee API
            this.props.getTransferFeeList(req);

        } else {
            this.setState({ refreshing: false });
        }
    }

    static oldProps = {};

    static getDerivedStateFromProps(props, state) {

        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return { ...state, isFirstTime: false, };
        }

        // To Skip Render if old and new props are equal
        if (SetTransferFeeListScreen.oldProps !== props) {
            SetTransferFeeListScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //Get All Updated Feild of Particular actions
            const { TransferFeeList, WalletDataList } = props.TransferFeeListResult;

            // TransferFeeList is not null
            if (TransferFeeList) {
                try {
                    if (state.TransferFeeList == null || (state.TransferFeeList != null && TransferFeeList !== state.TransferFeeList)) {

                        //succcess response fill the list 
                        if (validateResponseNew({ response: TransferFeeList, isList: true })) {
                            // Parse Transfer Fee object to array
                            let res = parseArray(TransferFeeList.Data)

                            return Object.assign({}, state, {
                                TransferFeeList,
                                SetTransferFeeResponse: res,
                                refreshing: false,
                            })
                        } else {
                            //if response is not validate than list is empty
                            return Object.assign({}, state, {
                                TransferFeeList: null,
                                SetTransferFeeResponse: [],
                                refreshing: false,
                            })
                        }
                    }
                } catch (e) {
                    return Object.assign({}, state, {
                        TransferFeeList: null,
                        SetTransferFeeResponse: [],
                        refreshing: false,
                    })
                    //Handle Catch and Notify User to Exception.
                    //Alert.alert('Status', e);
                }
            }

            // WalletDataList is not null
            if (WalletDataList) {
                try {
                    //if local WalletDataList state is null or its not null and also different then new response then and only then validate response.
                    if (state.WalletDataList == null || (state.WalletDataList != null && WalletDataList !== state.WalletDataList)) {

                        //if  response is success then store array list else store empty list
                        if (validateResponseNew({
                            response: WalletDataList, isList: true
                        })) {
                            let res = parseArray(WalletDataList.Types);

                            for (var dataItem in res) {
                                let item = res[dataItem]
                                item.value = item.TypeName
                            }

                            let walletNames = [
                                { value: R.strings.selectCurrency },
                                ...res
                            ];

                            return {
                                ...state, WalletDataList,
                                Currency: walletNames
                            };
                        }
                        else {
                            return {
                                ...state,
                                WalletDataList, Currency: [{ value: R.strings.selectCurrency }]
                            };
                        }
                    }
                } catch (e) {
                    return {
                        ...state,
                        Currency: [{
                            value: R.strings.selectCurrency
                        }]
                    };
                }
            }
        }
        return null
    }

    // Render Right Side Menu For Add New Pattern , Filters , etc Functionality in history of Fee And Limit Pattern 
    rightMenuRender = () => {
        return (
            <View style={{ flexDirection: 'row' }}>
                <ImageTextButton
                    icon={R.images.IC_PLUS}
                    style={{ margin: 0, paddingTop: R.dimens.WidgetPadding, paddingBottom: R.dimens.WidgetPadding, paddingLeft: R.dimens.widgetMargin, paddingRight: R.dimens.widgetMargin, }}
                    iconStyle={[{ height: R.dimens.SMALL_MENU_ICON_SIZE, width: R.dimens.SMALL_MENU_ICON_SIZE, tintColor: R.colors.textSecondary }]}
                    onPress={() => this.props.navigation.navigate('AddTransferFeeScreen', { onRefresh: this.onRefresh, })} />
                <ImageTextButton
                    icon={R.images.FILTER}
                    style={{ margin: 0, paddingTop: R.dimens.WidgetPadding, paddingBottom: R.dimens.WidgetPadding, paddingLeft: R.dimens.widgetMargin, paddingRight: R.dimens.widgetMargin, }}
                    iconStyle={[{ height: R.dimens.SMALL_MENU_ICON_SIZE, width: R.dimens.SMALL_MENU_ICON_SIZE, tintColor: R.colors.textSecondary }]}
                    onPress={() => this.drawer.openDrawer()} />
            </View>
        )
    }

    // Drawer Navigation
    navigationDrawer() {

        return (
            // for show filter of fromdate, todate,currency and status data
            <FilterWidget
                isCancellable={true}
                FromDatePickerCall={(FromDate) => this.setState({ FromDate })}
                ToDatePickerCall={(ToDate) => this.setState({ ToDate })}
                FromDate={this.state.FromDate}
                ToDate={this.state.ToDate}
                onResetPress={this.onResetPress}
                onCompletePress={this.onCompletePress}
                toastRef={component => this.toast = component}
                comboPickerStyle={{ marginTop: 0 }}
                pickers={[
                    {
                        title: R.strings.Currency,
                        array: this.state.Currency,
                        selectedValue: this.state.selectedCurrency,
                        onPickerSelect: (index, object) => this.setState({ selectedCurrency: index, WalletTypeId: object.ID })
                    },
                ]}
            />
        )
    }

    render() {

        // Loading status for Progress bar which is fetching from reducer
        const { TransferFeeLoading, } = this.props.TransferFeeListResult;

        // For searching
        let finalItems = this.state.SetTransferFeeResponse.filter(item => (
            item.ActionByUserName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
            item.BasePoint.toString().includes(this.state.searchInput) ||
            item.Minfee.toString().includes(this.state.searchInput) ||
            item.Maxfee.toString().includes(this.state.searchInput)
        ))

        return (
            //DrawerLayout for Set Transfer Fee Filteration

            <Drawer
                drawerContent={this.navigationDrawer()}
                type={Drawer.types.Overlay}
                onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
                ref={cmpDrawer => this.drawer = cmpDrawer}
                onDrawerClose={() => this.setState({ isDrawerOpen: false })}
                drawerPosition={Drawer.positions.Right}
                drawerWidth={R.dimens.FilterDrawarWidth}
                easingFunc={Easing.ease}>

                <SafeView style={{
                    flex: 1, backgroundColor: R.colors.background
                }}>

                    {/* To set status bar as per our theme */}

                    <CommonStatusBar />

                    {/* To set toolbar as per our theme */}

                    <CustomToolbar
                        rightMenuRenderChilds={this.rightMenuRender()}
                        title={R.strings.setTransferFee}
                        isBack={true}
                        onBackPress={this.onBackPress}
                        nav={this.props.navigation}
                        searchable={true}
                        onSearchText={(text) => this.setState({ searchInput: text })} />

                    {
                        (TransferFeeLoading && !this.state.refreshing) ?
                            <ListLoader />
                            :
                            <FlatList
                                data={finalItems}
                                showsVerticalScrollIndicator={false}
                                // render all item in list
                                renderItem={({ item, index }) => <SetTransferFeeListItem
                                    index={index}
                                    item={item}
                                    size={finalItems.length}
                                    onPress={() => this.props.navigation.navigate('SetTransferFeeDetailScreen', { item })} />
                                }
                                // assign index as key valye to Transfer Fee list item
                                keyExtractor={(item, index) => index.toString()}
                                // For Refresh Functionality In Transfer Fee FlatList Item
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
                                ListEmptyComponent={
                                    <ListEmptyComponent
                                        module={R.strings.addSetTransferFee}
                                        onPress={() =>
                                            this.props.navigation.navigate('AddTransferFeeScreen', { onRefresh: this.onRefresh, })
                                        }
                                    />}
                            />
                    }
                </SafeView>
            </Drawer>
        )
    }
}

// This Class is used for display record in list
class SetTransferFeeListItem extends Component {

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
        let { size, index, item, onPress } = this.props

        return (
            // flatlist item animation
            <AnimatableItem>
                <View
                    style={
                        {
                            marginLeft: R.dimens.widget_left_right_margin,
                            marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                            marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                            flex: 1,
                            marginRight: R.dimens.widget_left_right_margin
                        }
                    }>
                    <CardView style={{
                        elevation: R.dimens.listCardElevation,
                        borderBottomLeftRadius: R.dimens.margin,
                        borderTopRightRadius: R.dimens.margin,
                        flex: 1,
                        borderRadius: 0,
                    }}
                        onPress={onPress}
                    >

                        <View style={{ flex: 1, flexDirection: 'row' }}>

                            {/* Currency Image */}
                            <ImageViewWidget url={item.WalletTypeName ? item.WalletTypeName : ''} width={R.dimens.drawerMenuIconWidthHeight} height={R.dimens.drawerMenuIconWidthHeight} />

                            <View style={{ flex: 1, marginLeft: R.dimens.widgetMargin, }}>

                                {/* for show username and wallet type name */}
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                                    <Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>{item.ActionByUserName}</Text>

                                    <View style={{ flexDirection: 'row', }}>
                                        <Text style={{ color: R.colors.yellow, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>
                                            {item.WalletTypeName}
                                        </Text>
                                        <ImageTextButton
                                            icon={R.images.RIGHT_ARROW_DOUBLE}
                                            style={{ padding: 0, margin: 0, }}
                                            iconStyle={{ marginLeft: R.dimens.widgetMargin, width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.textPrimary }}
                                        />
                                    </View>
                                </View>

                                <View style={{ flexDirection: 'row' }}>
                                    <TextViewHML style={{ fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.Address + ': '}</TextViewHML>
                                    <TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>
                                        {validateValue(item.ContractAddress)}
                                    </TextViewHML>
                                </View>

                            </View>
                        </View>

                        {/* for show BasePoint, Max Fee and Min Fee */}
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>

                            <View style={{ width: '30%', alignItems: 'center', }}>
                                <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{R.strings.basePoint}</TextViewHML>
                                <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText, }}>
                                    {(parseIntVal(item.BasePoint) !== 'NaN' ? validateValue(parseIntVal(item.BasePoint)) : '-')}
                                </TextViewHML>
                            </View>

                            <View style={{ width: '40%', alignItems: 'center', }}>
                                <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.maxFee}</TextViewHML>
                                <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>
                                    {(parseIntVal(item.Maxfee) !== 'NaN' ? validateValue(parseIntVal(item.Maxfee)) : '-')}
                                </TextViewHML>
                            </View>

                            <View style={{ width: '30%', alignItems: 'center', }}>
                                <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.minFee}</TextViewHML>
                                <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>
                                    {(parseIntVal(item.Minfee) !== 'NaN' ? validateValue(parseIntVal(item.Minfee)) : '-')}
                                </TextViewHML>

                            </View>

                        </View>

                        <View
                            style={{
                                flexDirection: 'row', alignItems: 'center',
                                justifyContent: 'flex-end'
                            }}>
                            <ImageTextButton
                                iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
                                style={{
                                    margin: 0,
                                    paddingRight: R.dimens.LineHeight,
                                }}
                                icon={R.images.IC_TIMER}
                            />
                            <TextViewHML style={{
                                color: R.colors.textSecondary,
                                fontSize: R.dimens.smallestText,
                            }}>{convertDateTime(item.ActionDate, 'YYYY-MM-DD HH:mm:ss', false)}</TextViewHML>
                        </View>
                    </CardView>

                </View>
            </AnimatableItem>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        // get transfer fee data from reducer
        TransferFeeListResult: state.ERC223DashboardReducer,
    }
};

const mapDispatchToProps = (dispatch) => ({
    // To Perform Transfer Fee List Action
    getTransferFeeList: (payload) => dispatch(getTransferFeeList(payload)),
    // To Perform Wallet Data Action
    getWalletType: () => dispatch(getWalletType()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SetTransferFeeListScreen);