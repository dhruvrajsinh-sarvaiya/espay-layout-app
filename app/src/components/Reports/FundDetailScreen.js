import React, { Component } from 'react';
import { View, FlatList, Image, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';
import { getWalletsBalance } from '../../actions/Wallet/FundViewAction'
import CommonStatusBar from '../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../native_theme/components/CustomToolbar'
import { isCurrentScreen } from '../Navigation';
import { changeTheme } from '../../controllers/CommonUtils';
import { isInternet, validateValue, validateResponseNew } from '../../validations/CommonValidation';
import Separator from '../../native_theme/components/Separator';
import { ListEmptyComponent } from '../../native_theme/components/FlatListWidgets';
import ListLoader from '../../native_theme/components/ListLoader';
import Picker from '../../native_theme/components/Picker';
import R from '../../native_theme/R';
import ImageViewWidget from '../Widget/ImageViewWidget';
import TextViewMR from '../../native_theme/components/TextViewMR';
import TextViewHML from '../../native_theme/components/TextViewHML';
import AnimatableItem from '../../native_theme/components/AnimatableItem';
import SafeView from '../../native_theme/components/SafeView';

class FundDetailScreen extends Component {

    constructor(props) {
        super(props);

        //Get Resposne From Funds Main Screen.
        const WalletDetailResponse = this.props.navigation.state.params && this.props.navigation.state.params.WalletBalanceData;
        const BalanceDetailResponse = this.props.navigation.state.params && this.props.navigation.state.params.AllBalanceData;
        this.selectedCurrency = this.props.navigation.state.params && this.props.navigation.state.params.selectedCurrency;

        //Check If Response is an Array Or Not.
        //If Response is Array then Direct set in state otherwise conver response to Array form then set state.
        var walletRes = WalletDetailResponse.Wallets;
        var WalletResArr = [];
        if (!Array.isArray(walletRes)) {
            WalletResArr.push(walletRes);
        }

        var BalanceRes = BalanceDetailResponse;
        var BalanceResArr = [];
        if (!Array.isArray(BalanceRes)) {
            BalanceResArr.push(BalanceRes);
        }

        //Define All initial State
        this.state = {
            walletResponse: (Array.isArray(walletRes)) ? walletRes : WalletResArr,
            balanceResponse: (Array.isArray(BalanceRes)) ? BalanceRes : BalanceResArr,
            searchInput: '',
            symbol: '',
            isFirstTime: true,
        };

        this.symbols = [];
        this.balanceItems = [];

        //To Bind All Method
        this.RedirectDetailScreen = this.RedirectDetailScreen.bind(this);
    }

    componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        try {
            //Store Api Response Field and display in Screen.
            let symbols = [];
            for (var i = 0; i < this.state.balanceResponse.length; i++) {
                let item = this.state.balanceResponse[i].WalletType;
                symbols[i] = this.state.balanceResponse[i].WalletType;
                this.balanceItems[i] = { 'value': item }
            }

            this.symbols = symbols;
            this.setState({ symbol: symbols[0] })

        } catch (e) {
            //Handle Catch and Notify User to Exception.
            //Alert.alert('Status', e);
        }
    }

    //Redirect User To fund Details sub Screen
    RedirectDetailScreen(WalletName, TypeName, UnSettledBalance, UnClearedBalance, AvailableBalance, ShadowBalance, StackingBalance, PublicAddress) {
        var { navigate } = this.props.navigation;
        navigate('FundDetailSubScreen',
            {
                WalletName: WalletName,
                TypeName: TypeName,
                UnSettledBalance: UnSettledBalance,
                UnClearedBalance: UnClearedBalance,
                AvailableBalance: AvailableBalance,
                ShadowBalance: ShadowBalance,
                StackingBalance: StackingBalance,
                PublicAddress: PublicAddress,
            });
        //----------
    }

    shouldComponentUpdate = (nextProps, _nextState) => {
        return isCurrentScreen(nextProps);
    };

    static getDerivedStateFromProps(props, state) {

        //To Skip Render First Time for available reducer data if exists
        if (state.isFirstTime) {
            return {
                ...state,
                isFirstTime: false,
            };
        }

        if (isCurrentScreen(props)) {
            //Get All Updated Feild of Particular actions
            const { WalletBalanceFetchData, WalletBalanceData } = props;

            //To Check Wallet Balance Api Data Fetch Or Not
            if (!WalletBalanceFetchData) {
                try {
                    if (validateResponseNew({ response: WalletBalanceData.BizResponseObj, statusCode: WalletBalanceData.statusCode, isList: true })) {
                        return Object.assign({}, state, {
                            walletResponse: WalletBalanceData.Wallets
                        })
                    }
                    else {
                        return Object.assign({}, state, {
                            walletResponse: []
                        })
                    }
                }
                catch (error) {
                    return Object.assign({}, state, {
                        walletResponse: []
                    })
                }
            }
        }
        return null;
    }

    //on Selection of Coin From Drop Down
    onCoinChange = async (index) => {
        try {
            if (this.refs.spSelectCoin != null) {

                if (this.selectedCurrency != index) {

                    this.selectedCurrency = index;
                    //Check NetWork is Available or not
                    if (await isInternet()) {

                        //Bind Request
                        let walletBalanceRequest = {
                            WalletType: index
                        }
                        //Call Get Wallet Balance from API
                        this.props.getWalletsBalance(walletBalanceRequest, index);
                        //----------
                    }
                }
            }
        }
        catch (e) {
            //Catch Code here
        }
    }

    render() {

        //Get is Fetching value For All APIs to handle Progress bar in All Activity
        const { WalletBalanceIsFetching } = this.props;
        //----------

        //for final items from search input (validate on Available Balance and Wallet Name)
        //default searchInput is empty so it will display all records.
        let finalItems = this.state.walletResponse.filter(item => (('' + item.Wallet.Balance.AvailableBalance).includes(this.state.searchInput) || item.Wallet.WalletName.toLowerCase().includes(this.state.searchInput.toLowerCase())));

        return (
            <SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* To set toolbar as per our theme */}
                <CustomToolbar title={R.strings.Funds}
                    isBack={true}
                    nav={this.props.navigation}
                    searchable={true}
                    onSearchText={(text) => this.setState({ searchInput: text })}
                />

                {/* Picker For Coin List */}
                <View style={{ justifyContent: 'center', alignItems: 'center', marginLeft: R.dimens.padding_left_right_margin, marginRight: R.dimens.padding_left_right_margin }}>
                    <Picker
                        ref='spSelectCoin'
                        title={R.strings.selectCurrency}
                        searchable={true}
                        withIcon={true}
                        data={this.balanceItems}
                        value={this.selectedCurrency ? this.selectedCurrency : ''}
                        onPickerSelect={(index) => this.onCoinChange(index)}
                        displayArrow={'true'}
                        width={'100%'}
                    />
                </View>

                {/* Display Data in CardView */}
                <View style={{ height: '100%', flex: 1, justifyContent: 'center', alignContent: 'center' }}>
                    {/* To Check Response fetch or not if WalletBalanceIsFetching = true then display progress bar else display List*/}
                    {WalletBalanceIsFetching ?
                        <ListLoader />
                        :
                        <View style={{ flex: 1 }}>
                            {finalItems.length ?
                                <View style={{ flex: 1 }}>
                                    {/* Title Header For List Item */}
                                    <View style={[this.styles().headerContainer]}>
                                        <View style={{ flex: 1 }}>
                                            <TextViewMR style={this.styles().contentItem}>{R.strings.appIntroTitle2}</TextViewMR>
                                        </View>

                                        <View style={{ marginRight: R.dimens.activity_margin }}>
                                            <TextViewMR style={this.styles().contentItem}>{R.strings.Balance}</TextViewMR>
                                        </View>
                                    </View>
                                    {/* for display horizontal line */}
                                    <Separator />

                                    <FlatList
                                        data={finalItems}
                                        showsVerticalScrollIndicator={false}
                                        /* render all item in list */
                                        renderItem={({ item }) => <FlatListItem
                                            WalletName={item.Wallet.WalletName}
                                            TypeName={item.Wallet.TypeName}
                                            AvailableBalance={item.Wallet.Balance.AvailableBalance}
                                            onPress={() => {
                                                this.RedirectDetailScreen(
                                                    item.Wallet.WalletName,
                                                    item.Wallet.TypeName,
                                                    item.Wallet.Balance.UnSettledBalance,
                                                    item.Wallet.Balance.UnClearedBalance,
                                                    item.Wallet.Balance.AvailableBalance,
                                                    item.Wallet.Balance.ShadowBalance,
                                                    item.Wallet.Balance.StackingBalance,
                                                    item.Wallet.PublicAddress)
                                            }}></FlatListItem>}
                                        /* assign index as key valye to Funds Detial list item */
                                        keyExtractor={(item, index) => index.toString()}
                                        /* for item seprator on Funds Detial list item */
                                        ItemSeparatorComponent={() => <Separator />}
                                    />
                                </View>
                                :
                                !WalletBalanceIsFetching && <ListEmptyComponent />
                            }
                        </View>
                    }
                </View>
            </SafeView>
        );
    }

    // styles for this class
    styles = () => {
        return {
            headerContainer: {
                justifyContent: 'space-between',
                flexDirection: "row",
                backgroundColor: R.colors.background,
                paddingTop: R.dimens.widgetMargin,
                paddingLeft: R.dimens.WidgetPadding,
                paddingRight: R.dimens.WidgetPadding,
                paddingBottom: R.dimens.widgetMargin
            },
            contentItem: {
                fontSize: R.dimens.smallestText,
                color: R.colors.textPrimary,
                paddingLeft: R.dimens.widgetMargin,
            }
        }
    }
}

// This Class is used for display record in list
class FlatListItem extends Component {

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        //Check If Old Props and New Props are Equal then Return False
        if (this.props.WalletName === nextProps.WalletName &&
            this.props.TypeName === nextProps.TypeName &&
            this.props.AvailableBalance === nextProps.AvailableBalance) {
            return false
        }
        return true
    }

    render() {

        return (
            <AnimatableItem>
                <TouchableWithoutFeedback onPress={this.props.onPress}>
                    <View style={this.styles().simpleItem}>

                        {/* image icon for all coin */}
                        <ImageViewWidget style={{ alignSelf: 'center', marginRight: R.dimens.margin }} url={this.props.TypeName ? this.props.TypeName : ''} width={R.dimens.dashboardMenuIcon} height={R.dimens.dashboardMenuIcon} />
                        {/* Coin Name and Code */}
                        <View style={{ flex: 1, flexDirection: 'column' }}>
                            <TextViewMR style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary }}>{this.props.WalletName ? this.props.WalletName : '-'}</TextViewMR>
                            <TextViewHML style={{ fontSize: R.dimens.dashboardTabText, color: R.colors.textSecondary }}>{this.props.TypeName ? this.props.TypeName : '-'}</TextViewHML>
                        </View>

                        {/* More Item Icon */}
                        <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                            <TextViewHML style={{ fontSize: R.dimens.listItemText, color: R.colors.textPrimary, marginLeft: R.dimens.widgetMargin }}>{validateValue(this.props.AvailableBalance)}</TextViewHML>
                            <Image source={R.images.RIGHT_ARROW_DOUBLE} style={{
                                marginLeft: R.dimens.WidgetPadding,
                                marginRight: R.dimens.widgetMargin,
                                marginTop: R.dimens.widgetMargin,
                                marginBottom: R.dimens.widgetMargin,
                                tintColor: R.colors.textPrimary,
                                height: R.dimens.SMALL_MENU_ICON_SIZE,
                                width: R.dimens.SMALL_MENU_ICON_SIZE,
                                alignSelf: 'center',
                            }} />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </AnimatableItem>
        )
    };

    styles = () => {
        return {
            simpleItem: {
                flexDirection: "row",
                marginTop: R.dimens.widgetMargin,
                marginBottom: R.dimens.widgetMargin,
                marginLeft: R.dimens.widget_left_right_margin,
                marginRight: R.dimens.widget_left_right_margin,
            },
        }
    }
}

const mapStateToProps = (state) => {
    return {
        //updated data for Wallet Balance
        WalletBalanceFetchData: state.FundViewReducer.WalletBalanceFetchData,
        WalletBalanceIsFetching: state.FundViewReducer.WalletBalanceIsFetching,
        WalletBalanceData: state.FundViewReducer.WalletBalanceData,
    }
};

const mapDispatchToProps = (dispatch) => ({
    // Perform wallet Balance Action
    getWalletsBalance: (walletBalanceRequest, WalletType) => dispatch(getWalletsBalance(walletBalanceRequest, WalletType)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FundDetailScreen);