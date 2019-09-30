import React, { Component } from 'react'
import { Text, View, FlatList, RefreshControl, Easing } from 'react-native'
import { isCurrentScreen, addRouteToBackPress } from '../../Navigation';
import { changeTheme, parseArray, getCurrentDate, parseFloatVal, convertDateTime, } from '../../../controllers/CommonUtils';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import R from '../../../native_theme/R';
import SafeView from '../../../native_theme/components/SafeView';
import { contentContainerStyle, ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import CardView from '../../../native_theme/components/CardView';
import { getIncreDecreTokenSupplyList } from '../../../actions/Wallet/ERC223DashboardActions';
import { isInternet, validateResponseNew, validateValue } from '../../../validations/CommonValidation';
import { connect } from 'react-redux';
import Drawer from 'react-native-drawer-menu';
import FilterWidget from '../../widget/FilterWidget';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import ListLoader from '../../../native_theme/components/ListLoader';
import { getWalletType } from '../../../actions/PairListAction';
import ImageViewWidget from '../../widget/ImageViewWidget';
import { Fonts } from '../../../controllers/Constants';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import StatusChip from '../../widget/StatusChip';
import { DateValidation } from '../../../validations/DateValidation';

export class IncreaseTokenSupplyListScreen extends Component {
    constructor(props) {
        super(props);

        let { isIncrease } = props.navigation.state.params

        //Define all initial state
        this.state = {
            Currency: [],
            selectedCurrency: R.strings.selectCurrency,
            IncreTokenSupplyResponse: [],

            refreshing: false,
            searchInput: '',
            FromDate: getCurrentDate(),
            ToDate: getCurrentDate(),
            isDrawerOpen: false,
            WalletTypeId: 0,
            isIncrease: isIncrease,
        };

        //To Bind All Method
        this.onBackPress = this.onBackPress.bind(this);

        //Add Current Screen to Manual Handling BackPress Events
        addRouteToBackPress(props, this.onBackPress);
        this.props.navigation.setParams({ onBackPress: this.onBackPress });

        // create reference
        this.drawer = React.createRef();
        this.toast = React.createRef();
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

    shouldComponentUpdate = (nextProps, _nextState) => {
        //stop twice api call
        return isCurrentScreen(nextProps);
    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        // check internet validation
        if (await isInternet()) {
            // Increase Decrease Token Supply List Api
            this.props.getIncreDecreTokenSupplyList()
            // Call Get Wallet List Api
            this.props.getWalletType()
        }
    }

    // Reset Filter
    onResetPress = async () => {
        // Close drawer
        this.drawer.closeDrawer();

        this.setState({
            FromDate: getCurrentDate(),
            ToDate: getCurrentDate(),
            WalletTypeId: 0,
            selectedCurrency: R.strings.selectCurrency
        })

        // check internet connection
        if (await isInternet()) {

            // Increase Decrease Token Supply List Api
            this.props.getIncreDecreTokenSupplyList()
        }
    }

    // Call api after check all validation when user click on complete button from Drawer
    onCompletePress = async () => {

        //Check Validation of FromDate and ToDate
        if (DateValidation(this.state.FromDate, this.state.ToDate, true)) {
            this.toast.Show(DateValidation(this.state.FromDate, this.state.ToDate, true));
            return;
        }

        // close drawer
        this.drawer.closeDrawer();

        // check internet connection
        if (await isInternet()) {
            let req = {
                FromDate: this.state.FromDate,
                ToDate: this.state.ToDate,
                WalletTypeId: this.state.selectedCurrency !== R.strings.selectCurrency ? this.state.WalletTypeId : ''
            }

            // Increase Decrease Token Supply List Api
            this.props.getIncreDecreTokenSupplyList(req)
        }
    }

    //For Swipe to referesh Functionality
    async onRefresh(needUpdate, fromRefreshControl = false) {
        if (fromRefreshControl)
            this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (needUpdate && await isInternet()) {
            // Increase Decrease Token Supply List Api
            this.props.getIncreDecreTokenSupplyList()
        }
    }

    static oldProps = {};

    static getDerivedStateFromProps(props, state) {

        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return { ...state, isFirstTime: false, };
        }

        // To Skip Render if old and new props are equal
        if (IncreaseTokenSupplyListScreen.oldProps !== props) {
            IncreaseTokenSupplyListScreen.oldProps = props;
        } else {
            return null;
        }

        if (isCurrentScreen(props)) {
            //Get All Updated Feild of Particular actions
            const { IncreDecreTokenSupply, WalletDataList } = props.IncreaseTokenSupplyResult;

            // IncreDecreTokenSupply is not null
            if (IncreDecreTokenSupply) {
                try {
                    if (state.IncreDecreTokenSupply == null || (state.IncreDecreTokenSupply != null && IncreDecreTokenSupply !== state.IncreDecreTokenSupply)) {

                        //succcess response fill the list 
                        if (validateResponseNew({ response: IncreDecreTokenSupply, isList: true })) {
                            // Parse Increase Token Supply Array
                            let res = parseArray(IncreDecreTokenSupply.Data)

                            return Object.assign({}, state, {
                                IncreDecreTokenSupply,
                                IncreTokenSupplyResponse: res,
                                refreshing: false,
                            })
                        } else {
                            //if response is not validate than list is empty
                            return Object.assign({}, state, {
                                IncreDecreTokenSupply: null,
                                IncreTokenSupplyResponse: [],
                                refreshing: false,
                            })
                        }
                    }
                } catch (e) {
                    return Object.assign({}, state, {
                        IncreDecreTokenSupply: null,
                        IncreTokenSupplyResponse: [],
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
                        if (validateResponseNew({ response: WalletDataList, isList: true })) {
                            let res = parseArray(WalletDataList.Types);

                            for (var dataItem in res) {
                                let item = res[dataItem]
                                item.value = item.TypeName
                            }

                            let walletNames = [
                                {
                                    value: R.strings.selectCurrency
                                },
                                ...res
                            ];

                            return {
                                ...state, WalletDataList,
                                Currency: walletNames
                            };
                        } else {
                            return {
                                ...state,
                                WalletDataList: null, Currency: [{ value: R.strings.selectCurrency }]
                            };
                        }
                    }
                } catch (e) {
                    return {
                        ...state, WalletDataList: null, Currency:
                            [{ value: R.strings.selectCurrency }]
                    };
                }
            }
        }
        return null
    }

    // Drawer Navigation

    navigationDrawer() {

        return (

            // for show filter of fromdate, todate,currency and status data

            <FilterWidget
                onCompletePress={this.onCompletePress}
                comboPickerStyle={{ marginTop: 0 }}
                FromDatePickerCall={(FromDate) => this.setState({ FromDate })}
                toastRef={component => this.toast = component}
                ToDatePickerCall={(ToDate) => this.setState({ ToDate })}
                FromDate={this.state.FromDate}
                ToDate={this.state.ToDate}
                onResetPress={this.onResetPress}
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

    // Render Right Side Menu For Add New Pattern , Filters , etc Functionality in history of Fee And Limit Pattern 
    rightMenuRender = () => {
        return (
            <View
                style={{ flexDirection: 'row' }}>
                <ImageTextButton
                    style={{ margin: 0, paddingTop: R.dimens.WidgetPadding, paddingBottom: R.dimens.WidgetPadding, paddingLeft: R.dimens.widgetMargin, paddingRight: R.dimens.widgetMargin, }}
                    iconStyle={[{ height: R.dimens.SMALL_MENU_ICON_SIZE, width: R.dimens.SMALL_MENU_ICON_SIZE, tintColor: R.colors.textSecondary }]}
                    icon={R.images.IC_PLUS}
                    onPress={() => this.props.navigation.navigate('AddIncreTokenSupplyScreen', { onRefresh: this.onRefresh, Currency: this.state.Currency.length > 0 ? this.state.Currency : [], isIncrease: this.state.isIncrease })} />
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
        const { IncreDecreTokenSupplyLoading } = this.props.IncreaseTokenSupplyResult;

        // For searching
        let finalItems = this.state.IncreTokenSupplyResponse.filter(item => (
            item.ActionByUserName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
            item.WalletTypeName.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
            item.ContractAddress.toLowerCase().includes(this.state.searchInput.toLowerCase()) ||
            item.Amount.toString().includes(this.state.searchInput)
        ))

        return (
            //DrawerLayout for Increase Token Supply List
            <Drawer
                drawerPosition={Drawer.positions.Right}
                drawerWidth={R.dimens.FilterDrawarWidth}
                drawerContent={this.navigationDrawer()}
                onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
                ref={cmpDrawer => this.drawer = cmpDrawer}
                type={Drawer.types.Overlay}
                easingFunc={Easing.ease}
                onDrawerClose={() => this.setState({ isDrawerOpen: false })}   >

                <SafeView
                    style={{ flex: 1, backgroundColor: R.colors.background }}>
                    {/* To set status bar as per our theme */}

                    <CommonStatusBar />


                    {/* To set toolbar as per our theme */}
                    <CustomToolbar
                        isBack={true}
                        nav={this.props.navigation}
                        onBackPress={this.onBackPress}
                        title={this.state.isIncrease ? R.strings.increaseTokenSupply : R.strings.decreaseTokenSupply}
                        rightMenuRenderChilds={this.rightMenuRender()}
                        searchable={true}
                        onSearchText={(text) => this.setState({ searchInput: text })} />

                    <View style={{ flex: 1 }}>
                        {
                            (IncreDecreTokenSupplyLoading && !this.state.refreshing) ?
                                <ListLoader />
                                :
                                <FlatList
                                    data={finalItems}
                                    showsVerticalScrollIndicator={false}
                                    // render all item in list
                                    renderItem={({ item, index }) => {
                                        if (this.state.isIncrease) {
                                            if (item.ActionType == 1)
                                                return <IncreaseTokenSupplyListItem
                                                    index={index}
                                                    item={item}
                                                    size={finalItems.length}
                                                />
                                            return null
                                        } else {
                                            if (item.ActionType == 2)
                                                return <IncreaseTokenSupplyListItem
                                                    index={index}
                                                    item={item}
                                                    size={finalItems.length}
                                                />
                                            return null
                                        }
                                    }}
                                    // assign index as key valye to Withdrawal list item
                                    keyExtractor={(_item, index) => index.toString()}
                                    // For Refresh Functionality In Withdrawal FlatList Item
                                    refreshControl={
                                        <RefreshControl
                                            colors={[R.colors.accent]}
                                            progressBackgroundColor={R.colors.background}
                                            refreshing={this.state.refreshing}
                                            onRefresh={() => this.onRefresh(true, true)}
                                        />
                                    }
                                    contentContainerStyle={contentContainerStyle(finalItems)}
                                    // Displayed Empty Component when no record found 
                                    ListEmptyComponent={<ListEmptyComponent />}
                                />
                        }
                    </View>
                </SafeView>
            </Drawer>
        )
    }
}

// This Class is used for display record in list
class IncreaseTokenSupplyListItem extends Component {

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
        let { size, index, item, } = this.props

        return (
            <AnimatableItem>
                <View style={{
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginRight: R.dimens.widget_left_right_margin,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    flex: 1, marginLeft: R.dimens.widget_left_right_margin,
                }}>
                    <CardView style={{
                        borderBottomLeftRadius: R.dimens.margin,
                        flex: 1, borderRadius: 0,
                        borderTopRightRadius: R.dimens.margin, elevation: R.dimens.listCardElevation,
                    }} >
                        <View style={{ flex: 1, flexDirection: 'row', }}>

                            {/* Currency Image */}
                            <ImageViewWidget url={item.WalletTypeName ? item.WalletTypeName : ''} width={R.dimens.drawerMenuIconWidthHeight} height={R.dimens.drawerMenuIconWidthHeight} />

                            <View style={{ flex: 1, }}>
                                {/* for show username, amount and currency name */}
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                                    <Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>{validateValue(item.ActionByUserName)}</Text>

                                    <View style={{ flexDirection: 'row', }}>
                                        <Text style={{ color: R.colors.yellow, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>
                                            {(parseFloatVal(item.Amount) !== 'NaN' ? validateValue(parseFloatVal(item.Amount)) : '-') + " " + item.WalletTypeName}
                                        </Text>
                                    </View>
                                </View>

                                {/* Transction Hash */}
                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingRight: R.dimens.margin }}>
                                    <TextViewHML style={this.styles().titleStyle}>{R.strings.trnHash + ': '}</TextViewHML>
                                    <View style={{ flex: 1, }}>
                                        <TextViewHML style={this.styles().itemStyle}>{validateValue(item.TrnHash)}</TextViewHML>
                                    </View>
                                </View>

                                {/* Address */}
                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
                                    <TextViewHML style={this.styles().titleStyle}>{R.strings.Address + ': '}</TextViewHML>
                                    <View style={{ flex: 1, }}>
                                        <TextViewHML style={this.styles().itemStyle}>{validateValue(item.ContractAddress)}</TextViewHML>
                                    </View>
                                </View>

                                {/* Remarks */}
                                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                    <TextViewHML style={this.styles().titleStyle}>{R.strings.remarks + ': '}</TextViewHML>
                                    <View style={{ flex: 1 }}>
                                        <TextViewHML style={this.styles().itemStyle}>{validateValue(item.Remarks)}</TextViewHML>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* for show status and DateTime */}
                        <View style={{ flex: 1, flexDirection: 'row', marginTop: R.dimens.widgetMargin, alignItems: 'center', justifyContent: 'space-between' }}>
                            <StatusChip
                                color={item.ActionType == 1 ? R.colors.successGreen : R.colors.failRed}
                                value={item.ActionTypeName}></StatusChip>

                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <ImageTextButton
                                    style={{ margin: 0, paddingRight: R.dimens.LineHeight, }}
                                    icon={R.images.IC_TIMER}
                                    iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
                                />
                                <TextViewHML style={{ alignSelf: 'center', color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{convertDateTime(item.ActionDate, 'YYYY-MM-DD HH:mm:ss', false)}</TextViewHML>
                            </View>
                        </View>
                    </CardView>
                </View>
            </AnimatableItem>
        )
    }

    styles = () => {
        return {
            titleStyle: {
                color: R.colors.textSecondary,
                fontSize: R.dimens.smallestText,
            },
            itemStyle: {
                color: R.colors.textPrimary,
                fontSize: R.dimens.smallestText,
            }
        }
    }
}

const mapStateToProps = (state) => {
    return {
        // get increase token supply data from reducer
        IncreaseTokenSupplyResult: state.ERC223DashboardReducer,
    }
};

const mapDispatchToProps = (dispatch) => ({
    // To Perform Increase Decrease Token Supply List Action
    getIncreDecreTokenSupplyList: (payload) => dispatch(getIncreDecreTokenSupplyList(payload)),
    // To Perform Wallet Data Action
    getWalletType: () => dispatch(getWalletType()),
});

export default connect(mapStateToProps, mapDispatchToProps)(IncreaseTokenSupplyListScreen);