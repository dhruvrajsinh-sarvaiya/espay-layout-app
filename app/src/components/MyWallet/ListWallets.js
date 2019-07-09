import React, { Component } from 'react';
import { View, FlatList, RefreshControl, Easing, Image, Text } from 'react-native';
import { connect } from 'react-redux';
import { getAllWallets } from '../../actions/Wallet/MyWalletAction';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../native_theme/components/CustomToolbar'
import { isCurrentScreen, addRouteToBackPress } from '../Navigation';
import { changeTheme, parseArray, parseFloatVal, } from '../../controllers/CommonUtils';
import { isInternet, validateResponseNew, validateValue } from '../../validations/CommonValidation';
import ListLoader from '../../native_theme/components/ListLoader';
import { ListEmptyComponent, contentContainerStyle } from '../../native_theme/components/FlatListWidgets';
import Drawer from 'react-native-drawer-menu';
import R from '../../native_theme/R';
import FilterWidget from '../Widget/FilterWidget';
import { GetBalance } from '../../actions/PairListAction';
import CardView from '../../native_theme/components/CardView';
import TextViewMR from '../../native_theme/components/TextViewMR';
import TextViewHML from '../../native_theme/components/TextViewHML';
import { Fonts } from '../../controllers/Constants';
import AnimatableItem from '../../native_theme/components/AnimatableItem';
import SafeView from '../../native_theme/components/SafeView';

class ListWallets extends Component {

    constructor(props) {
        super(props);

        //Define All State initial state
        this.state = {
            response: [],
            refreshing: false,
            CurrencyItems: [{ value: R.strings.selectCurrency }],
            selectedCurrency: R.strings.selectCurrency,
            searchInput: '',
            isFirstTime: true,
            isDrawerOpen: false, // First Time Drawer is Closed
        }

        //Add Current Screen to Manual Handling BackPress Events
        addRouteToBackPress(props);

        // create reference
        this.drawer = React.createRef();

        //To Bind All Method
        this.onBackPress = this.onBackPress.bind(this);
        this.props.navigation.setParams({ onBackPress: this.onBackPress });
        this.onRefresh = this.onRefresh.bind(this);

    }

    componentDidMount = async () => {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Call Get All Wallet From API
            this.props.getAllWallets();

            //Call Get CoinList API
            this.props.GetBalance();
            //----------
        } else {
            this.setState({ refreshing: false });
        }
    }

    //for BackPress if Drawer is Open Than First Close The Drawer else Back to Previous Screen
    onBackPress() {
        // close the drawer if drawer is open
        if (this.state.isDrawerOpen) {
            this.drawer.closeDrawer();
            this.setState({ isDrawerOpen: false })
        }
        else {
            //goging back screen
            this.props.navigation.goBack();
        }
    }

    //For Swipe to referesh Functionality
    onRefresh = async () => {
        this.setState({ refreshing: true });

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Call Get All Wallet From API
            this.props.getAllWallets({
                coin: this.state.selectedCurrency === R.strings.selectCurrency ? '' : this.state.selectedCurrency
            });
        } else {
            this.setState({ refreshing: false });
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        return isCurrentScreen(nextProps);
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
        if (ListWallets.oldProps !== props) {
            ListWallets.oldProps = props;
        } else {
            return null;
        }

        // check for current screen
        if (isCurrentScreen(props)) {

            //Get All Updated Feild of Particular actions
            const { GetAllWalletListFetchData, GetAllWalletListdata, Balancedata, BalanceFetchData } = props;

            //To Check List All Wallet
            if (!GetAllWalletListFetchData) {

                try {
                    if (validateResponseNew({ response: GetAllWalletListdata, isList: true, })) {

                        //Check Wallet List Response is Array Or Not.
                        //If response is Not in array then parse into array and store in state
                        var resData = parseArray(GetAllWalletListdata.Data);
                        return Object.assign({}, state, {
                            response: resData,
                            refreshing: false
                        })
                    } else {
                        return Object.assign({}, state, {
                            refreshing: false,
                            response: []
                        })
                    }
                } catch (e) {
                    return Object.assign({}, state, {
                        refreshing: false,
                        response: []
                    })
                    //Handle Catch and Notify User to Exception.
                }
            }

            //To Check CoinList Api Data Fetch Or Not
            if (!BalanceFetchData) {
                try {
                    if (validateResponseNew({ response: Balancedata })) {

                        //Check Response is array or not
                        let CurrencyRes = parseArray(Balancedata.Response);

                        //Store Coin Name Array in State
                        CurrencyRes.map((item, index) => {
                            CurrencyRes[index].value = item.SMSCode;
                        })

                        //Concat Select String With Coin Name
                        let currencyItem = [
                            ...state.CurrencyItems,
                            ...CurrencyRes
                        ];
                        return {
                            CurrencyItems: currencyItem
                        }
                    } else {
                        return {
                            CurrencyItems: [{ value: R.strings.selectCurrency }]
                        }
                    }
                } catch (e) {
                    return {
                        CurrencyItems: [{ value: R.strings.selectCurrency }]
                    }
                    //Handle Catch and Notify User to Exception.
                }
            }
        }
        return null;
    }

    // Drawer Navigation
    navigationDrawer() {
        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background, }}>

                {/* Coin List in Filter Functionality */}
                <FilterWidget
                    onResetPress={this.onResetPress}
                    onCompletePress={this.onCompletePress}
                    firstPicker={{
                        title: R.strings.Currency,
                        selectedValue: this.state.selectedCurrency,
                        array: this.state.CurrencyItems,
                        onPickerSelect: (item) => this.setState({ selectedCurrency: item })
                    }}
                />
            </SafeView>
        );
    }

    // When user press on reset button then all values are reset 
    // Set state to original value
    onResetPress = async () => {

        // Close Drawer user press on Complete button bcoz display flatlist item on Screen
        this.drawer.closeDrawer();

        this.setState({ selectedCurrency: R.strings.selectCurrency, });

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Call Get All Wallet From API
            this.props.getAllWallets();
            //----------
        } else {
            this.setState({ refreshing: false });
        }

    }

    // if press on complete button then check validation and api calling
    onCompletePress = async () => {

        // Close Drawer user press on Complete button bcoz display flatlist item on Screen
        this.drawer.closeDrawer();

        //Check NetWork is Available or not
        if (await isInternet()) {

            //Call Get All Wallet From API
            this.props.getAllWallets({
                coin: this.state.selectedCurrency === R.strings.selectCurrency ? '' : this.state.selectedCurrency
            });
        } else {
            this.setState({ refreshing: false });
        }
    }


    render() {
        //Get is Fetching value For All APIs to handle Progress bar in All Activity
        const { GetAllWalletListIsFetching, } = this.props;

        //final items from search input (validate on WalletName and Balance)
        //default searchInput is empty so it will display all records.
        let finalItems = this.state.response.filter(item => item.WalletName.toLowerCase().includes(this.state.searchInput.toLowerCase()) || ('' + item.Balance).includes(this.state.searchInput));

        return (
            <Drawer
                ref={cmp => this.drawer = cmp}
                drawerWidth={R.dimens.FilterDrawarWidth}
                onDrawerOpen={() => this.setState({ isDrawerOpen: true })}
                onDrawerClose={() => this.setState({ isDrawerOpen: false })}
                type={Drawer.types.Overlay}
                drawerContent={this.navigationDrawer()}
                drawerPosition={Drawer.positions.Right}
                easingFunc={Easing.ease}>

                <SafeView style={{ flex: 1, backgroundColor: R.colors.background, }}>

                    {/* To set status bar as per our theme */}
                    <CommonStatusBar />

                    {/* To set toolbar as per our theme */}
                    <CustomToolbar
                        title={R.strings.MyWallets}
                        isBack={true}
                        onBackPress={this.onBackPress}
                        nav={this.props.navigation}
                        searchable={true}
                        onSearchText={(text) => this.setState({ searchInput: text })}
                        rightIcon={R.images.FILTER}
                        onRightMenuPress={() => this.drawer.openDrawer()}
                    />

                    {/* To Check Response fetch or not if GetAllWalletListIsFetching = true then display progress bar else display List*/}
                    {GetAllWalletListIsFetching && !this.state.refreshing ?
                        <ListLoader />
                        :
                        <View style={{ flex: 1 }}>

                            {finalItems.length ?

                                <View style={{ flex: 1 }}>

                                    <FlatList
                                        showsVerticalScrollIndicator={false}
                                        data={finalItems}
                                        /* render all item in list */
                                        renderItem={({ item, index }) => {
                                            return <ListOfWallets
                                                walletIndex={index}
                                                item={item}
                                                onListWalletUser={() => {
                                                    this.props.navigation.navigate('ListWalletUser', { WalletId: item.AccWalletID })
                                                }}
                                                walletSize={this.state.response.length} />
                                        }}
                                        /* assign index as key valye to List Wallet Item */
                                        keyExtractor={(item, index) => index.toString()}
                                        contentContainerStyle={contentContainerStyle(finalItems)}
                                        /* For Refresh Functionality In List Wallet FlatList Item */
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
                                <ListEmptyComponent />
                            }
                        </View>
                    }
                </SafeView>
            </Drawer>
        );
    }
}

// This Class is used for display record in list
export class ListOfWallets extends Component {
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

        // Get required fields from params
        let item = this.props.item;
        let { walletIndex, walletSize, onListWalletUser } = this.props;

        // apply color based on role id
        let color = R.colors.accent;
        if (item.RoleId == 1) {
            color = R.colors.orange
        } else if (item.RoleId == 2) {
            color = R.colors.yellow
        } else if (item.RoleId == 3) {
            color = R.colors.successGreen
        } else {
            color = R.colors.accent
        }
        return (
            <AnimatableItem>
                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    marginTop: (walletIndex == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginBottom: (walletIndex == walletSize - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
                    marginLeft: R.dimens.widget_left_right_margin,
                    marginRight: R.dimens.widget_left_right_margin
                }
                }>
                    <CardView style={{
                        elevation: R.dimens.listCardElevation,
                        borderRadius: 0,
                        flex: 1,
                        flexDirection: 'column',
                        borderBottomLeftRadius: R.dimens.margin,
                        borderTopRightRadius: R.dimens.margin,
                    }}
                        onPress={onListWalletUser}>

                        <View style={{ flex: 1, flexDirection: 'row' }}>

                            <View style={{ flex: 1, marginLeft: R.dimens.widgetMargin, }}>

                                {/* WalletName , Default Wallet */}
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                                    <View style={{ flexDirection: 'row', }}>
                                        <Text style={{ color: R.colors.listSeprator, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>{item.CoinName ? item.CoinName : '-'}</Text>
                                        {item.IsDefaultWallet == 1 ?
                                            <TextViewMR style={{ marginLeft: R.dimens.widgetMargin, color: R.colors.successGreen, fontSize: R.dimens.smallText, }}>- {R.strings.sides[0].value} </TextViewMR>
                                            : null
                                        }
                                    </View>
                                    <Image
                                        source={R.images.RIGHT_ARROW_DOUBLE}
                                        style={{ width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon, tintColor: R.colors.textPrimary }}
                                    />
                                </View>

                                {/* Default Wallet Name */}
                                <View style={{ flexDirection: 'row', }}>
                                    <TextViewMR style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, }}>{item.WalletName ? item.WalletName : '-'}</TextViewMR>
                                    <TextViewMR style={{ marginLeft: R.dimens.widgetMargin, alignSelf: 'center', color: color, fontSize: R.dimens.smallText, }}>- {item.RoleName ? item.RoleName : '-'}</TextViewMR>
                                </View>

                                {/* Avaliable Balance , OutBounded and InBounded Balance */}
                                <View style={{ flex: 1, flexDirection: 'row', marginTop: R.dimens.widget_top_bottom_margin }}>
                                    <View style={{ flex: 1, alignItems: 'center', }}>
                                        <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{R.strings.Available}</TextViewHML>
                                        <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText, }}>
                                            {(parseFloatVal(item.Balance).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(item.Balance).toFixed(8)) : '-')}
                                        </TextViewHML>
                                    </View>

                                    <View style={{ flex: 1, alignItems: 'center', }}>
                                        <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{R.strings.OutBounded}</TextViewHML>
                                        <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText, }}>
                                            {(parseFloatVal(item.OutBoundBalance).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(item.OutBoundBalance).toFixed(8)) : '-')}
                                        </TextViewHML>
                                    </View>

                                    <View style={{ flex: 1, alignItems: 'center', }}>
                                        <TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{R.strings.InBound}</TextViewHML>
                                        <TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText, }}>
                                            {(parseFloatVal(item.InBoundBalance).toFixed(8) !== 'NaN' ? validateValue(parseFloatVal(item.InBoundBalance).toFixed(8)) : '-')}
                                        </TextViewHML>
                                    </View>
                                </View>
                            </View>
                        </View >
                    </CardView>
                </View>
            </AnimatableItem>
        )
    };
}

function mapStateToProps(state) {
    return {
        //Update Get All Wallet List 
        GetAllWalletListFetchData: state.MyWalletReducer.GetAllWalletListFetchData,
        GetAllWalletListdata: state.MyWalletReducer.GetAllWalletListdata,
        GetAllWalletListIsFetching: state.MyWalletReducer.GetAllWalletListIsFetching,

        //Updated Data For Get Balance Action
        Balancedata: state.MyWalletReducer.Balancedata,
        BalanceFetchData: state.MyWalletReducer.BalanceFetchData,
        BalanceIsFetching: state.MyWalletReducer.BalanceIsFetching,

    }
}

function mapDispatchToProps(dispatch) {

    return {

        //Perform List All Wallets
        getAllWallets: (getWalletRequest) => dispatch(getAllWallets(getWalletRequest)),

        //Perform Get Coin List Action
        GetBalance: () => dispatch(GetBalance()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListWallets)