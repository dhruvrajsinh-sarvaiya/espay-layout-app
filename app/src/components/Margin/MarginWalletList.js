import React, { Component } from 'react';
import { View, FlatList, RefreshControl, Easing, Image, Text } from 'react-native';
import { connect } from 'react-redux';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../native_theme/components/CustomToolbar'
import { isCurrentScreen, addRouteToBackPress } from '../Navigation';
import { changeTheme, parseArray, parseFloatVal, parseIntVal, convertDateTime } from '../../controllers/CommonUtils';
import ListLoader from '../../native_theme/components/ListLoader';
import { isInternet, validateResponseNew, } from '../../validations/CommonValidation';
import { ListEmptyComponent, } from '../../native_theme/components/FlatListWidgets';
import { getMarginWalletList } from '../../actions/PairListAction';
import { getLeverageBaseCurrency, clearReducer } from '../../actions/Margin/MarginWalletListAction';
import Drawer from 'react-native-drawer-menu';
import R from '../../native_theme/R';
import ImageViewWidget from '../Widget/ImageViewWidget';
import FilterWidget from '../Widget/FilterWidget';
import ImageButton from '../../native_theme/components/ImageTextButton';
import StatusChip from '../Widget/StatusChip';
import CardView from '../../native_theme/components/CardView';
import TextViewMR from '../../native_theme/components/TextViewMR';
import TextViewHML from '../../native_theme/components/TextViewHML';
import { Fonts } from '../../controllers/Constants';
import AnimatableItem from '../../native_theme/components/AnimatableItem';
import SafeView from '../../native_theme/components/SafeView';

class MarginWalletList extends Component {

    constructor(props) {
        super(props);

        //for focus on next field
        this.inputs = {};

        //Define All initial State
        this.state = {
            response: [],
            searchInput: '',
            refreshing: false,

            // Currency Array
            CurrencyItems: [{ value: R.strings.selectCurrency }],
            selectedCurrency: R.strings.selectCurrency,

            // Wallet types Array
            walletTypeItems: [{ value: R.strings.Select_Wallet }, { value: R.strings.MarginWallets }, { value: R.strings.SafetyWallets }, { value: R.strings.ProfitWallets },],
            selectedWalletType: R.strings.Select_Wallet,
            WalletTypeId: '',

            // Status Array
            statusItems: [{ value: R.strings.select_status }, { value: R.strings.Active }, { value: R.strings.Inactive },],
            selectedStatus: R.strings.select_status,

            isFirstTime: true,
            isDrawerOpen: false, // First Time Drawer is Closed
        };

        //Add Current Screen to Manual Handling BackPress Events
        addRouteToBackPress(props);

        //To Bind All Method
        this.onRefresh = this.onRefresh.bind(this);
        this._onResetPress = this._onResetPress.bind(this);
        this._onCompletePress = this._onCompletePress.bind(this);
        this.onBackPress = this.onBackPress.bind(this);
        this.props.navigation.setParams({ onBackPress: this.onBackPress });

        // create reference
        this.drawer = React.createRef();
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

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {

            //for Get Margin Wallet List Api
            this.GetMarginWalletListApi();

            //Call Get Leverage Base Currency API
            this.props.getLeverageBaseCurrency();
        }
    }

    GetMarginWalletListApi = async () => {

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Call Margin Wallet List Api
            this.props.getMarginWalletList();
        } else {
            this.setState({ refreshing: false });
        }
    }

    //For Swipe to referesh Functionality
    onRefresh = async () => {
        this.setState({ refreshing: true, });

        //Check NetWork is Available or not
        if (await isInternet()) {

            let walletUsageType = ''
            if (this.state.selectedWalletType === this.state.walletTypeItems[1].value) {
                walletUsageType = 5
            } else if (this.state.selectedWalletType === this.state.walletTypeItems[2].value) {
                walletUsageType = 6
            } else if (this.state.selectedWalletType === this.state.walletTypeItems[3].value) {
                walletUsageType = 7
            }

            let status = ''
            if (this.state.selectedStatus === this.state.statusItems[1].value) {
                status = 1
            } else if (this.state.selectedStatus === this.state.statusItems[2].value) {
                status = 0
            }

            // Bind Request for Get Margin Wallet List 
            const MarginWalletListRequest = {
                WalletTypeId: this.state.selectedCurrency === R.strings.selectCurrency ? '' : this.state.WalletTypeId,
                WalletUsageType: this.state.selectedWalletType === R.strings.Select_Wallet ? '' : parseIntVal(walletUsageType),
                Status: this.state.selectedStatus === R.strings.select_status ? '' : parseIntVal(status),
            };

            //Call API For Get Margin Wallet List 
            this.props.getMarginWalletList(MarginWalletListRequest);
            //----------
        } else {
            this.setState({ refreshing: false });
        }
    }

    //this Method is used to focus on next feild
    focusNextField(id) {
        this.inputs[id].focus();
    }

    shouldComponentUpdate = (nextProps, _nextState) => {
        // stop twice api call 
        return isCurrentScreen(nextProps);
    };

    componentWillUnmount = () => {
        this.props.clearReducer();
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
        if (MarginWalletList.oldProps !== props) {
            MarginWalletList.oldProps = props;
        } else {
            return null;
        }

        // check for current screen
        if (isCurrentScreen(props)) {
            
            //Get All Updated Feild of Particular actions
            const { MarginWalletListFetchData, MarginWalletListdata, leverageBaseCoinData, leverageBaseCoinFetchData } = props;

            //To Check Get Margin Wallet List Data Fetch Or Not
            if (!MarginWalletListFetchData) {
                try {
                    if (validateResponseNew({ response: MarginWalletListdata, isList: true })) {

                        //check Margin Wallet List Response is an Array Or not
                        //If Response is Array then Direct set in state otherwise conver response to Array form then set state.
                        var resData = parseArray(MarginWalletListdata.Data);
                        return Object.assign({}, state, {
                            response: resData,
                            refreshing: false,
                        })
                    } else {
                        return Object.assign({}, state, {
                            response: [],
                            refreshing: false,
                        })
                    }
                } catch (e) {
                    return Object.assign({}, state, {
                        response: [],
                        refreshing: false,
                    })
                }
            }

            //To Check leverage Base Coin Data Fetch Or Not
            if (!leverageBaseCoinFetchData) {
                try {
                    if (validateResponseNew({ response: leverageBaseCoinData, isList: true })) {

                        //If Response is Array then Direct set in state otherwise conver response to Array form then set state.
                        let CurrencyRes = parseArray(leverageBaseCoinData.Data);

                        CurrencyRes.map((item, index) => {
                            CurrencyRes[index].value = item.WalletTypeName;
                        })
                        let currencyItem = [
                            ...state.CurrencyItems,
                            ...CurrencyRes
                        ];
                        return Object.assign({}, state, {
                            CurrencyItems: currencyItem,
                        })
                    } else {
                        return Object.assign({}, state, {
                            CurrencyItems: [],
                            selectedCurrency: R.strings.selectCurrency,
                        })
                    }
                } catch (e) {
                    return Object.assign({}, state, {
                        CurrencyItems: [],
                        selectedCurrency: R.strings.selectCurrency,
                    })
                    //Handle Catch and Notify User to Exception.
                }
            }
        }
        return null;
    }

    // Reset Filter
    _onResetPress = async () => {

        // set initial state value
        this.setState({
            searchInput: '',
            selectedCurrency: R.strings.selectCurrency,
            selectedWalletType: R.strings.Select_Wallet,
            selectedStatus: R.strings.select_status,
            WalletTypeId: '',
        })

        // Close Drawer user press on Complete button bcoz display flatlist item on Screen
        this.drawer.closeDrawer();

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Call Margin Wallet List Api
            this.props.getMarginWalletList();

        } else {
            this.setState({ refreshing: false });
        }

    }

    // Api Call when press on complete button
    _onCompletePress = async () => {

        // Close Drawer user press on Complete button bcoz display flatlist item on Screen
        this.drawer.closeDrawer();

        //Check NetWork is Available or not
        if (await isInternet()) {

            let walletUsageType = ''
            if (this.state.selectedWalletType === this.state.walletTypeItems[1].value) {
                walletUsageType = 5
            } else if (this.state.selectedWalletType === this.state.walletTypeItems[2].value) {
                walletUsageType = 6
            } else if (this.state.selectedWalletType === this.state.walletTypeItems[3].value) {
                walletUsageType = 7
            }

            let status = ''
            if (this.state.selectedStatus === this.state.statusItems[1].value) {
                status = 1
            } else if (this.state.selectedStatus === this.state.statusItems[2].value) {
                status = 0
            }

            //Bind Request For Get Margin Wallet List 
            const MarginWalletListRequest = {
                WalletTypeId: this.state.selectedCurrency === R.strings.selectCurrency ? '' : this.state.WalletTypeId,
                WalletUsageType: this.state.selectedWalletType === R.strings.Select_Wallet ? '' : parseIntVal(walletUsageType),
                Status: this.state.selectedStatus === R.strings.select_status ? '' : parseIntVal(status),
            };

            //Call Fetch API For Get Margin Wallet List 
            this.props.getMarginWalletList(MarginWalletListRequest);
            //----------
        }

        //If Filter from Complete Button make search imput empty
        this.setState({ searchInput: '' })
    }

    // Drawer Navigation
    navigationDrawer() {
        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background, }}>

                {/* filterwidget for currency list,wallettype and status data */}
                <FilterWidget
                    onResetPress={this._onResetPress}
                    onCompletePress={this._onCompletePress}
                    comboPickerStyle={{ marginTop: 0 }}
                    pickers={[
                        {
                            title: R.strings.Currency,
                            selectedValue: this.state.selectedCurrency,
                            array: this.state.CurrencyItems,
                            onPickerSelect: (item, object) => this.setState({ selectedCurrency: item, WalletTypeId: object.WalletTypeId })
                        },
                        {
                            title: R.strings.wallet,
                            selectedValue: this.state.selectedWalletType,
                            array: this.state.walletTypeItems,
                            onPickerSelect: (item) => this.setState({ selectedWalletType: item })
                        },
                        {
                            title: R.strings.Status,
                            selectedValue: this.state.selectedStatus,
                            array: this.state.statusItems,
                            onPickerSelect: (value) => this.setState({ selectedStatus: value }),
                        }
                    ]}
                />
            </SafeView >
        );
    }

    render() {

        //Get is Fetching value For All APIs to handle Progress bar in All Activity
        const { MarginWalletListisFetching, } = this.props;
        //----------

        //for final items from search input (validate on coin)
        //default searchInput is empty so it will display all records.
        let finalItems = this.state.response.filter(item => item.CoinName.toLowerCase().includes(this.state.searchInput.toLowerCase()) || item.WalletName.toLowerCase().includes(this.state.searchInput.toLowerCase()));

        return (
            //DrawerLayout for Fee And Limit Pattern History Filteration
            <Drawer
                ref={cmp => this.drawer = cmp}
                drawerWidth={R.dimens.FilterDrawarWidth}
                drawerContent={this.navigationDrawer()}
                onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
                onDrawerClose={() => this.setState({ isDrawerOpen: false })}
                type={Drawer.types.Overlay}
                drawerPosition={Drawer.positions.Right}
                easingFunc={Easing.ease}>

                <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                    {/* To set status bar as per our theme */}
                    <CommonStatusBar />

                    {/* To set toolbar as per our theme */}
                    <CustomToolbar
                        title={R.strings.MarginWallets}
                        isBack={true}
                        onBackPress={this.onBackPress}
                        nav={this.props.navigation}
                        searchable={true}
                        onSearchText={(text) => this.setState({ searchInput: text })}
                        rightMenuRenderChilds={
                            <View style={{ flexDirection: 'row' }}>
                                <ImageButton
                                    icon={R.images.FILTER}
                                    style={{ margin: 0, padding: R.dimens.widgetMargin }}
                                    iconStyle={[{ height: R.dimens.SMALL_MENU_ICON_SIZE, width: R.dimens.SMALL_MENU_ICON_SIZE, tintColor: R.colors.textSecondary }]}
                                    onPress={() => this.drawer.openDrawer()} />

                                <ImageButton
                                    icon={R.images.IC_PLUS}
                                    style={{ margin: 0, padding: R.dimens.widgetMargin }}
                                    iconStyle={[{ height: R.dimens.SMALL_MENU_ICON_SIZE, width: R.dimens.SMALL_MENU_ICON_SIZE, tintColor: R.colors.textSecondary }]}
                                    onPress={() => {
                                        this.props.navigation.navigate('CreateMarginWallet', { isCreateWallet: true })
                                    }} />
                            </View>
                        }
                    />

                    {/* To Check Response fetch or not if MarginWalletListisFetching = true then display progress bar else display List*/}
                    {
                        MarginWalletListisFetching && !this.state.refreshing
                            ?
                            <ListLoader />
                            :
                            <View style={{ flex: 1 }}>
                                {finalItems.length ?
                                    <View style={{ flex: 1 }}>
                                        <FlatList
                                            data={finalItems}
                                            showsVerticalScrollIndicator={false}
                                            /* render all item in list */
                                            renderItem={({ item, index }) =>
                                                <FlatListItem
                                                    item={item}
                                                    index={index}
                                                    size={this.state.response.length}
                                                    onPress={() => this.props.navigation.navigate('MarginWalletListDetail', { MarginWalletInfo: item })}
                                                >
                                                </FlatListItem>}
                                            /* assign index as key valye to Transfer In History list item */
                                            keyExtractor={(item, index) => index.toString()}
                                            /* For Refresh Functionality In Transfer In History FlatList Item */
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
                                    !MarginWalletListisFetching && <ListEmptyComponent />
                                }
                            </View>
                    }
                </SafeView>
            </ Drawer>
        );
    }
}

// This Class is used for display record in list
class FlatListItem extends Component {

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        //Check If Old Props and New Props are Equal then Return False
        if (this.props.item === nextProps.item) {
            return false
        }
        return true
    }

    render() {

        // Get required fields from props
        let item = this.props.item
        let { index, size, } = this.props;

        // set color based on item status
        let color = this.props.item.Status == 1 ? R.colors.successGreen : R.colors.failRed;

        return (
            <AnimatableItem>
                <View style={{
                    flex: 1,
                    marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginLeft: R.dimens.widget_left_right_margin,
                    marginRight: R.dimens.widget_left_right_margin
                }
                }>
                    <CardView style={{
                        elevation: R.dimens.listCardElevation,
                        flex: 1,
                        borderRadius: 0,
                        borderBottomLeftRadius: R.dimens.margin,
                        borderTopRightRadius: R.dimens.margin,
                    }}
                        onPress={this.props.onPress}>

                        <View style={{ flex: 1, flexDirection: 'row' }}>

                            {/* Currency Image */}
                            <ImageViewWidget url={item.CoinName ? item.CoinName : ''} width={R.dimens.IconWidthHeight} height={R.dimens.IconWidthHeight} />

                            <View style={{ flex: 1, marginLeft: R.dimens.widgetMargin, }}>

                                {/* WalletName , Default Wallet */}
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                                    <View style={{ flexDirection: 'row', }}>
                                        <Text style={{ color: R.colors.listSeprator, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>{item.WalletName ? item.WalletName : '-'}</Text>
                                        {item.IsDefaultWallet == 1 ?
                                            <TextViewMR style={{ marginLeft: R.dimens.widgetMargin, color: R.colors.successGreen, fontSize: R.dimens.smallestText, }}>- {R.strings.sides[0].value} </TextViewMR>
                                            : null
                                        }
                                    </View>
                                    <Image
                                        source={R.images.RIGHT_ARROW_DOUBLE}
                                        style={{ width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.textPrimary }}
                                    />
                                </View>

                                {/* Balance */}
                                <View style={{ flexDirection: 'row', marginTop: R.dimens.widgetMargin }}>
                                    <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{R.strings.Balance} : </TextViewHML>
                                    <TextViewHML style={{ flex: 1, alignSelf: 'center', color: R.colors.textPrimary, fontSize: R.dimens.smallText, }}>{(parseFloatVal(item.Balance).toFixed(8).toString()) !== 'NaN' ? parseFloatVal(item.Balance).toFixed(8).toString() : '-'} {item.CoinName ? item.CoinName : '-'}</TextViewHML>
                                </View>

                                {/* RoleName */}
                                <View style={{ flexDirection: 'row', }}>
                                    <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{R.strings.Role} : </TextViewHML>
                                    <TextViewHML style={{ flex: 1, alignSelf: 'center', color: R.colors.textPrimary, fontSize: R.dimens.smallText, }}>{item.RoleName ? item.RoleName : '-'}</TextViewHML>
                                </View>
                            </View>
                        </View >

                        {/* Status and Expire DateTime */}
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: R.dimens.widget_top_bottom_margin, marginLeft: R.dimens.widget_left_right_margin }}>
                            <StatusChip
                                color={color}
                                value={item.StrStatus ? item.StrStatus : '-'}></StatusChip>
                            <View style={{ flexDirection: 'row', alignSelf: 'center', }}>
                                <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{R.strings.ExpiryOn} : </TextViewHML>
                                <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText, }}>{convertDateTime(item.ExpiryDate)}</TextViewHML>
                            </View>
                        </View>
                    </CardView>
                </View>
            </AnimatableItem>
        )
    };
}

function mapStateToProps(state) {
    return {
        //For Get Margin Wallet list Data
        MarginWalletListFetchData: state.MarginWalletListReducer.MarginWalletListFetchData,
        MarginWalletListisFetching: state.MarginWalletListReducer.MarginWalletListisFetching,
        MarginWalletListdata: state.MarginWalletListReducer.MarginWalletListdata,

        //Updated Data For Get Balance Action
        leverageBaseCoinData: state.MarginWalletListReducer.leverageBaseCoinData,
        leverageBaseCoinFetchData: state.MarginWalletListReducer.leverageBaseCoinFetchData,
        leverageBaseCoinIsFetching: state.MarginWalletListReducer.leverageBaseCoinIsFetching,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //Perform Margin Wallet List Action
        getMarginWalletList: (MarginWalletListRequest) => dispatch(getMarginWalletList(MarginWalletListRequest)),
        
        //Perform Get Coin List Action
        getLeverageBaseCurrency: () => dispatch(getLeverageBaseCurrency()),
        
        //To clear Reducer
        clearReducer: () => dispatch(clearReducer()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MarginWalletList)