import React, { Component } from 'react';
import { View, ScrollView, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import { isCurrentScreen } from '../../Navigation';
import { getMarginWalletList } from '../../../actions/PairListAction'
import { validateResponseNew, isInternet } from '../../../validations/CommonValidation';
import { changeTheme, addListener, createOptions, createActions, windowPercentage } from '../../../controllers/CommonUtils';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import CommonToast from '../../../native_theme/components/CommonToast';
import { fetchBuyerBookList } from '../../../actions/Trade/BuyerBookActions';
import { fetchSellerBookList } from '../../../actions/Trade/SellerBookActions';
import { fetchOpenOrders } from '../../../actions/Trade/OpenOrderActions';
import { AppConfig } from '../../../controllers/AppConfig';
import R from '../../../native_theme/R';
import { TitleItem } from '../../../native_theme/components/IndicatorViewPager';
import ImageButton from '../../../native_theme/components/ImageTextButton';
import MarginBuySellWidget from './MarginBuySellWidget';
import MarginBuyerSellerBookWidget from './MarginBuyerSellerBookWidget';
import OptionsMenu from "react-native-options-menu";
import { ServiceUtilConstant, Constants, Events } from '../../../controllers/Constants';
import MarginOpenOrder from './MarginOpenOrder';
import { fetchMarketCap } from '../../../actions/Trade/MarketCapActions';
import { getPairRates } from '../../../actions/Trade/PairRatesActions';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import { setData } from '../../../App';
import { clearBuySellTrade } from '../../../actions/Trade/BuySellTradeActions';
import SafeView from '../../../native_theme/components/SafeView';

class MarginBuySellTradeScreen extends Component {

    constructor(props) {
        super(props);

        // Create Reference
        this.displayToast = React.createRef();

        this.paramsBuy = {};
        this.paramsSell = {};

        // Bind All Method
        this.onToastPress = this.onToastPress.bind(this);
        this.handleOptionMenu = this.handleOptionMenu.bind(this);

        let { width, height } = Dimensions.get('window');

        let contentPercentage = windowPercentage(65, width);

        //Define All initial State
        this.state = {
            marketList: null,
            selectedMenu: 0,
            tabsName: [
                { name: R.strings.limit, isSelected: true, orderType: 1 },
                { name: R.strings.market, isSelected: false, orderType: 2 },
                { name: R.strings.spot, isSelected: false, orderType: 3 },
                { name: R.strings.stopLimit, isSelected: false, orderType: 4 }
            ],
            position: 1,
            callAPIs: true,
            callDependencyAPI: false,
            redirectToSuccess: false,
            charges: {
                takers: 0,
                makers: 0
            },
            locale: props.preference.locale,
            width: width < height ? width : contentPercentage
        };
    }

    async componentDidMount() {
        //Add this method to change theme based on stored theme name.
        changeTheme();

        //To listen for buy / sell type and its result from Trade Detail Screen
        this.listenerBuySellPairDataMargin = addListener(Events.BuySellPairDataMargin, async (result) => {

            setData({ [ServiceUtilConstant.KEY_CurrencyPair]: result });

            this.setState({ result });

            //To get the current price details, buyerbook, sellerbook, market trades of selected currency
            //Check NetWork is Available or not
            if (await isInternet()) {

                // Don't Delete These Code it will be use in future if condition needed with minPrice and maxPrice
                // Call Pair Rates API
                // this.props.getPairRates({ PairName: result.PairName, IsMargin: 1 });

                //To get balances
                this.props.getMarginWalletList();

                // Call BuyerBooklist api
                this.props.fetchBuyerBookList({ Pair: result.PairName, IsMargin: 1 });

                // Call SellerBooklist api
                this.props.fetchSellerBookList({ Pair: result.PairName, IsMargin: 1 });

                //Call Open Orders api
                this.props.getOpenOrder({
                    page: this.state.selectedPage,
                    IsMargin: 1
                });
            }
        });

        // add listener for update Dimensions
        this.dimensionListener = addListener(Events.Dimensions, (data) => {

            let { width, height } = data;

            let contentPercentage = windowPercentage(65, width);

            this.setState({
                // as tablet will consider 35% of screen so display content in rest 65%	
                width: width < height ? width : contentPercentage,
            })
        });
    };

    componentWillUnmount() {
        // remove Listener
        if (this.listenerBuySellPairDataMargin) {
            this.listenerBuySellPairDataMargin.remove();
        }

        if (this.dimensionListener) {

            // remove listener of dimensions
            this.dimensionListener.remove();
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        //If theme or locale is changed then update componenet
        if (this.props.preference.theme !== nextProps.preference.theme || this.props.preference.locale !== nextProps.preference.locale || this.state.width !== nextState.width) {
            return true;
        } else {
            if (nextProps.shouldDisplay) {
                // stop twice api call 
                return isCurrentScreen(nextProps);
            } else {
                return false;
            }
        }
    };

    static getDerivedStateFromProps(props, state) {

        if (props.preference.locale !== state.locale) {

            return Object.assign({}, state, {
                tabsName: [
                    { name: R.strings.limit, isSelected: state.position == 1, orderType: 1 },
                    { name: R.strings.market, isSelected: state.position == 2, orderType: 2 },
                    { name: R.strings.spot, isSelected: state.position == 3, orderType: 3 },
                    { name: R.strings.stopLimit, isSelected: state.position == 4, orderType: 4 }
                ],
            })
        }

        // if previous currency pair and new currency pair is differnt than set new currency pair in result,
        // also set wallets to null so it can be updated again.
        if (JSON.stringify(props.preference[ServiceUtilConstant.KEY_CurrencyPair]) !== JSON.stringify(state.result)) {
            return Object.assign({}, state, {
                result: props.preference[ServiceUtilConstant.KEY_CurrencyPair],
                callAPIs: true,
                callDependencyAPI: true,
            });
        }

        if (props.shouldDisplay && isCurrentScreen(props)) {

            try {
                //Get All Updated field of Particular actions
                const { marketData: { marketList }, buySellTradeData: { buySellTrade } } = props;

                //if response is success then store array in list
                if (marketList) {

                    //if local marketList state is null or its not null and also different then new response then and only then validate response.
                    if (state.marketList == null || (state.marketList != null && marketList !== state.marketList)) {

                        if (validateResponseNew({ response: marketList, isList: true })) {

                            //get first record of first base pair
                            let pairRecord = marketList.response[0].PairList[0];

                            //if status of result is null than store new result & call APIs
                            if (state.result == null) {

                                //Store list
                                return Object.assign({}, state, {
                                    result: pairRecord,
                                    marketList: marketList,
                                    callDependencyAPI: true
                                })
                            }
                        } else {
                            return Object.assign({}, state, {
                                marketList
                            })
                        }
                    }
                }

                //if buy sell response is success then handle resposne
                if (buySellTrade) {
                    //if local buySellTrade state is null or its not null and also different then new response then and only then validate response.
                    if (state.buySellTrade == null || (state.buySellTrade != null && buySellTrade !== state.buySellTrade)) {

                        try {
                            return Object.assign({}, state, {
                                buySellTrade,
                                redirectToSuccess: true,
                            })
                        } catch (error) {
                            return Object.assign({}, state, {
                                buySellTrade
                            })
                        }
                    }
                }
            } catch (error) {
                return null
            }
        }
        return null;
    }

    componentDidUpdate = async (prevProps, prevState) => {

        // if current page is visible from main viewpager than call API
        if (prevProps.shouldDisplay !== this.props.shouldDisplay) {
            if (prevState.callAPIs) {
                this.callAPIs();
                this.setState({ callAPIs: false })
            }

            if (this.state.callDependencyAPI) {
                this.callDependencyAPIS();
                this.setState({ callDependencyAPI: false })
            }
        }

        // if previous result (CurrencyPair) is not null and previous PairName and new PairName is different than call APIs
        if (prevState.result && (prevState.result.PairName !== this.state.result.PairName)) {
            if (prevState.callAPIs) {
                this.callAPIs();
                this.setState({ callAPIs: false })
            }

            if (this.state.callDependencyAPI) {
                this.callDependencyAPIS();
                this.setState({ callDependencyAPI: false })
            }
        }

        if (this.state.buySellTrade && this.state.redirectToSuccess) {
            let params = {};

            if (Object.keys(this.paramsBuy).length !== 0) {
                params = this.paramsBuy;
                this.paramsBuy = {};
            }

            if (Object.keys(this.paramsSell).length !== 0) {
                params = this.paramsSell;
                this.paramsSell = {};
            }

            params = Object.assign({}, params, {
                trnID: this.props.buySellTradeData.buySellTrade.ReturnCode == 0 ? this.props.buySellTradeData.buySellTrade.response.TrnID : 0,
                status: this.props.buySellTradeData.buySellTrade.ReturnCode,
                message: this.props.buySellTradeData.buySellTrade.ReturnMsg
            })

            this.props.clearBuySellTrade();

            //redirect to buy sell trade success
            this.props.navigation.navigate('BuySellTradeSuccess', { item: params, isMargin: true });

            this.setState({ redirectToSuccess: false })
        }
    };

    async callAPIs() {

        //Check NetWork is Available or not
        if (await isInternet()) {

            //To get balances
            this.props.getMarginWalletList();

            // Call BuyerBooklist api
            this.props.fetchBuyerBookList({ Pair: this.state.result ? this.state.result.PairName : AppConfig.initialPair, IsMargin: 1 });

            // Call SellerBooklist api
            this.props.fetchSellerBookList({ Pair: this.state.result ? this.state.result.PairName : AppConfig.initialPair, IsMargin: 1 });

            //Call Open Orders
            this.props.getOpenOrder({
                page: this.state.selectedPage,
                pairName: this.state.result ? this.state.result.PairName : AppConfig.initialPair,
                IsMargin: 1,
            })
        }
    }

    async callDependencyAPIS() {

        //Check NetWork is Available or not
        if (await isInternet()) {
            let pairRecord = this.state.result;

            // Don't Delete These Code it will be use in future if condition needed with minPrice and maxPrice
            // Call Pair Rates API
            // this.props.getPairRates({ PairName: pairRecord.PairName, IsMargin: 1 });

            // Call Market Cap Detail API
            this.props.fetchMarketCap({
                Pair: pairRecord.PairName ? pairRecord.PairName : AppConfig.initialPair,
                IsMargin: 1
            });
        }
    }

    // for display toast
    onToastPress(str) {
        this.displayToast.Show(str)
    }

    // for display optionmenu and on selection of item redirect to related screen
    handleOptionMenu(i) {

        let screenName = '';
        let option = {};
        switch (i) {
            case 0: {
                screenName = 'CoinSelectScreen';
                option = { isAction: ServiceUtilConstant.From_Deposit };
                break;
            }
            case 1: screenName = 'EditFavorite'; break;
            case 2: screenName = 'FeesScreen'; break;
        }

        screenName !== '' && this.props.navigation.navigate(screenName, option);
    }

    render() {

        //Change Language Forcefully if not changed
        if (R.strings.getLanguage() !== this.props.preference.locale) {
            R.strings.setLanguage(this.props.preference.locale);
        }

        let pairName = this.state.result ? this.state.result.PairName : AppConfig.initialPair;
        var activityTitle = pairName.replace('_', '/');

        return (
            <SafeView style={{
                flex: 1,
                backgroundColor: R.colors.background
            }}>

                {/* To set status bar as per our theme */}
                <CommonStatusBar />

                {/* Progress Dialog */}
                <ProgressDialog isShow={this.props.buySellTradeData.isBuySell || this.props.openOrderData.isFetchingCancelOpenOrder} />

                {/* Custom Toast */}
                <CommonToast ref={(cmp) => this.displayToast = cmp} />

                <View style={{ height: R.dimens.ButtonHeight, width: '100%', flexDirection: 'row', paddingRight: R.dimens.widget_left_right_margin, paddingLeft: R.dimens.widget_left_right_margin }}>
                    <View style={{ flex: 1 }} />
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                        <TextViewMR style={{ fontSize: R.dimens.mediumText, color: R.colors.listSeprator }}>{activityTitle}</TextViewMR>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row' }}>
                        <OptionsMenu
                            ref={component => {
                                this.optionMargin = component;
                            }}
                            customButton={
                                <ImageButton
                                    icon={R.images.IC_ADJUST_FILLED}
                                    onPress={() => {
                                        this.optionMargin.handlePress();
                                    }}
                                    style={{ margin: R.dimens.widgetMargin }}
                                    iconStyle={{ tintColor: R.colors.textPrimary, width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon }}
                                />}
                            options={createOptions([R.strings.deposit, R.strings.favorite, R.strings.fees])}
                            actions={createActions([() => this.handleOptionMenu(0), () => this.handleOptionMenu(1), () => this.handleOptionMenu(2)])}
                        />
                    </View>
                </View>

                <View style={{
                    height: R.dimens.ButtonHeight,
                    marginLeft: R.dimens.margin, marginRight: R.dimens.margin,
                    flexDirection: 'row'
                }}>
                    {this.state.tabsName.map((item, index) => <TitleItem
                        key={item.name}
                        title={item.name}
                        isSelected={item.isSelected}
                        onPress={(title) => {
                            let tabsName = this.state.tabsName;
                            this.state.tabsName.map((el, indexSub) => {
                                tabsName[indexSub].isSelected = el.name === title;
                            })
                            this.setState({ tabsName, position: this.state.tabsName[tabsName.findIndex(el => el.isSelected)].orderType });
                        }}
                        color={item.isSelected ? R.colors.accent : R.colors.textSecondary}
                        width={((this.state.width) - (R.dimens.margin * 2)) / this.state.tabsName.length}
                        isGradient={item.isSelected} />)}

                </View>

                <ScrollView keyboardShouldPersistTaps={'always'} showsVerticalScrollIndicator={false}>
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', paddingTop: R.dimens.widget_top_bottom_margin }}>
                            {/* Buy Widget */}
                            <MarginBuySellWidget
                                navigation={this.props.navigation}
                                module={Constants.TradeTypes.Buy}
                                orderType={this.state.tabsName[this.state.tabsName.findIndex(el => el.isSelected)].orderType}
                                Toast={this.onToastPress}
                                pairRecord={this.state.result}
                                shouldDisplay={this.props.shouldDisplay}
                                updateBuyParams={(params) => this.paramsBuy = params} />

                            {/* Sell Widget */}
                            <MarginBuySellWidget
                                navigation={this.props.navigation}
                                module={Constants.TradeTypes.Sell}
                                orderType={this.state.tabsName[this.state.tabsName.findIndex(el => el.isSelected)].orderType}
                                Toast={this.onToastPress}
                                pairRecord={this.state.result}
                                shouldDisplay={this.props.shouldDisplay}
                                updateSellParams={(params) => this.paramsSell = params} />
                        </View>

                        <View style={{ marginTop: R.dimens.widget_top_bottom_margin }}>
                            {/* buyer seller book Widget */}
                            <MarginBuyerSellerBookWidget
                                shouldDisplay={this.props.shouldDisplay}
                                navigation={this.props.navigation}
                                PairName={pairName} />
                        </View>

                        {/* margin open order widget */}
                        <MarginOpenOrder
                            isWidget={true}
                            navigation={this.props.navigation}
                            shouldDisplay={this.props.shouldDisplay}
                            pairName={pairName} />
                    </View>
                </ScrollView>
            </SafeView >
        );
    }
}

function mapStatToProps(state) {
    // Updated Data of Market, buterseller trade, preference, chargeList and open order
    return {
        marketData: state.tradeData,
        buySellTradeData: state.buySellTradeReducer,
        preference: state.preference,
        chargeListData: state.chargeListReducer,
        openOrderData: state.openOrderReducer,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        // Perform PairRates Action
        getPairRates: (payload) => dispatch(getPairRates(payload)),

        // Perform MarketCap Action
        fetchMarketCap: (payload) => dispatch(fetchMarketCap(payload)),

        // Perform MarginWalletList Action
        getMarginWalletList: () => dispatch(getMarginWalletList()),

        // Perform BuyerBookList Action
        fetchBuyerBookList: (Pair) => dispatch(fetchBuyerBookList(Pair)),

        // Perform SellerBookList Action
        fetchSellerBookList: (Pair) => dispatch(fetchSellerBookList(Pair)),

        // Perform OpenOrder Action
        getOpenOrder: (params) => dispatch(fetchOpenOrders(params)),

        // Perform BuySellTrade Action
        clearBuySellTrade: () => dispatch(clearBuySellTrade())
    }
}
export default connect(mapStatToProps, mapDispatchToProps)(MarginBuySellTradeScreen);