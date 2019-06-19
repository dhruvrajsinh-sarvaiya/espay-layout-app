/**
 * Trading Dashboard
 */
import React, { Component, Fragment } from 'react';
import { Row, Col, Card } from 'reactstrap';

import {
    //getCurrencyList,
    getCurrentPrice,
    getMarketCapList,
    //getActiveMyOpenOrderList,
    //getActiveOpenOrderList,
    getBuyerOrderList,
    getSellerOrderList,
    getChartData,
    //getHoldingList,
    getMarketTradeHistory,
    //CHANGE_MARKET_TRADE_HISTORY_SOCKET,
    getTickersList,
    getPairList,
    //changeBuyPairSocket,
    //changeSellPairSocket,
    //changeMarketTradeSocketConnection,
    getVolumeData,
    getMarketDepth
} from 'Actions/Trade';

//import { getWallets } from 'Actions/Withdraw';

// import connect for redux store
import { connect } from 'react-redux';

// import components for trading dashboard
import {
    CurrentMarket,
    PairList,
    PlaceOrder,
    MarketTrade,
    //ActiveOrders,
    BuySellTrade,
    TradingChart,
    //CoinBasicList,  
    //MarketDepth,
    //NewsList,
    //InviteList,
    //TokenValue,
    //TopGainer,
    //TopLoser
} from "Components/CooldexTrading";

import {
    MarginAccountDetail,
    MarginActiveOrders
} from "Components/MarginTrading";

// import components for trading dashboard
import {
    MobileCurrentMarket,
    MobilePairList,
    MobilePlaceOrder,
    MobileMarketTrade,
    MobileBuySellTrade,
    MobileTradingChart,
    MobileActiveOrders,

} from "Components/MobileCooldexTrading";

// import {
//     MarginAccountDetail,
//     MarginActiveOrders
// } from "Components/MarginTrading";


import AppConfig from 'Constants/AppConfig';

//Tabmenu Start 
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

//Material Dialogs
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';

import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}


function TabContainer({ children }) {
    return (
        <Typography component="div" style={{ padding: 8 * 3 }}>
            {children}
        </Typography>
    );
}
//   TabContainer.propTypes = {
//     children: PropTypes.node.isRequired,
//   };

const styles = theme => ({
    root: {
        flexGrow: 1,
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
});
//Tabmenu End   


import $ from 'jquery';

import {
    getMaringWalletList
} from 'Actions/MarginTrading';

import {
    getLeverageDetail
} from "Actions/MarginTrading";


// Component for margin trading dashboard
class MarginTrading extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currency: [],
            firstCurrency: AppConfig.defaultChildCurrency,
            firstCurrencyBalance: 0,
            firstCurrencyWalletId: 0,
            takersValue: 0,
            makersValue: 0,
            secondCurrencyBalance: 0,
            secondCurrencyWalletId: 0,
            secondCurrency: AppConfig.defaultBasedCurrency,
            currencyPair: AppConfig.defaultPair,
            currentMarket: [],
            oldMarketCapData: [],
            displayFavourite: false,
            currentBuyPrice: 0,
            currentSellPrice: 0,
            showLoader: true,
            pairList: [],
            pairData: [],
            pairDetail: [],
            Wallet: [],
            UpDownBit: 0,
            bulkBuyOrder: [],
            bulkSellOrder: [],
            currencyPairID: 10021001,
            socketBuyData: [],
            socketSellData: [],
            hubConnection: this.props.location.state.hubConnection,
            isComponentActive: 1,
            firstCurrencyMarginDetail: {},
            secondCurrencyMarginDetail: {},
            //pairsInfo:[],
            width: window.innerWidth, //Added by salim dt:15/05/2019,
            activeIndex: 0,
        }
        this.changeCurrencyPair = this.changeCurrencyPair.bind(this)
        this.changeSecondCurrency = this.changeSecondCurrency.bind(this)
        this.setBuyOrders = this.setBuyOrders.bind(this)
        this.setSellOrders = this.setSellOrders.bind(this)
        // this.openFavourite = this.openFavourite.bind(this)
    }


    // invoke before Compoent render
    componentWillMount() {
        window.addEventListener('resize', this.handleWindowSizeChange); //Added by salim dt:15/05/2019
        const self = this;
        //load Currency List
        this.props.getPairList({ marginTrading: 1 });

        self.state.hubConnection.on("RecieveTradeHistory", (tradeHistoryDetail) => {
            //console.log("Get Data from signalR RecieveTradeHistory", tradeHistoryDetail);

        });

        self.state.hubConnection.onclose(e => {
            //console.log('disconnected server');
            //console.log(window.JbsHorizontalLayout);
            setTimeout(function () {
                //console.log(window.JbsHorizontalLayout)
                //console.log(self.state);
                window.JbsHorizontalLayout.props.location.state.connectSignalR(self.state.currencyPair, self.state.secondCurrency);
            }, 1000);
        });

        self.state.hubConnection.on('RecieveWalletBal', (walletBalance) => {

            //console.log("response from signalr RecieveWalletBal",walletBalance); 
            try {

                walletBalance = JSON.parse(walletBalance);
                if (self.state.isComponentActive === 1 && typeof walletBalance.Data !== 'undefined' && walletBalance.Data !== '') {

                    if ((walletBalance.EventTime && self.state.socketBuyData.length == 0) ||
                        (self.state.socketBuyData.length !== 0 && walletBalance.EventTime >= self.state.socketBuyData.EventTime)) {

                        if (typeof walletBalance.IsMargin !== 'undefined' && walletBalance.IsMargin === 1) {

                            const walletCoinDetail = walletBalance.Data;
                            if (walletCoinDetail.CoinName !== '') {
                                //var walletList = self.state.Wallet;
                                var walletList = $.extend(true, [], self.state.Wallet);
                                var latestStateDetail = {}; // handle multiple state echange evnet into single

                                walletList.map((value, key) => {

                                    //if (self.state.secondCurrency === walletCoinDetail.CoinName && value.AccWalletID === walletCoinDetail.AccWalletID ) {
                                    if (value.CoinName === walletCoinDetail.CoinName && value.AccWalletID === walletCoinDetail.AccWalletID) {
                                        walletList[key].Balance = walletCoinDetail.Balance

                                        // code for save first and second currency detail 
                                        /*  if(self.state.firstCurrency === walletCoinDetail.CoinName && self.state.firstCurrencyWalletId === walletCoinDetail.AccWalletID) {
                                             console.log("innn1")
                                             latestStateDetail.firstCurrencyMarginDetail = walletCoinDetail;
                                         }
                                         if(self.state.secondCurrency === walletCoinDetail.CoinName && self.state.secondCurrencyWalletId === walletCoinDetail.AccWalletID) {
                                             console.log("first 2")
                                             latestStateDetail.secondCurrencyMarginDetail = walletCoinDetail;
                                         } */
                                        // end

                                    }

                                    //if (self.state.firstCurrency === walletCoinDetail.CoinName && value.AccWalletID === walletCoinDetail.AccWalletID ) {
                                    // comment code by devang parekh 
                                    // no need to check again same condition because bal only come with singl coin information
                                    /* if (value.CoinName === walletCoinDetail.CoinName && value.AccWalletID === walletCoinDetail.AccWalletID ) {
                                        walletList[key].Balance = walletCoinDetail.Balance
                                    } */

                                });

                                latestStateDetail.Wallet = walletList;
                                latestStateDetail.socketBuyData = walletBalance;

                                //self.setState({Wallet : walletList,socketBuyData:walletBalance})
                                self.setState(latestStateDetail); // handle multiple change for state
                            }

                        } else {
                            //console.log(walletBalance)
                        }

                    }

                }

            } catch (error) {
                console.log("error", error)
            }

        });

    }

    // invoke After Compoent render
    componentDidMount() {
        //load Currency List        
        //this.props.getCurrencyList();
        this.props.getMaringWalletList({});

    }

    componentWillUnmount() {
        this.setState({ isComponentActive: 0 });
        window.removeEventListener('resize', this.handleWindowSizeChange); //Added by salim dt:15/04/2019
    }

    handleWindowSizeChange = () => {
        this.setState({ width: window.innerWidth });
    };

    // invoke when component recive props
    componentWillReceiveProps(nextprops) {
        //console.log("marginWalletList",nextprops.marginWalletList)
        if (nextprops.pairList.length && nextprops.pairList !== null && nextprops.pairList !== this.state.pairList) {
            // set Currency list if gets from API only          
            this.setState({
                pairList: nextprops.pairList,
                showLoader: false,
                secondCurrency: nextprops.pairList[0].Abbrevation,
                firstCurrency: nextprops.pairList[0].PairList[0].Abbrevation,
                currencyPair: nextprops.pairList[0].PairList[0].PairName,
                currencyPairID: nextprops.pairList[0].PairList[0].PairId,
                UpDownBit: nextprops.pairList[0].PairList[0].UpDownBit,
                takersValue: nextprops.pairList[0].PairList[0].SellFees,
                makersValue: nextprops.pairList[0].PairList[0].BuyFees,
            });


        } else {
            this.setState({
                showLoader: false
            })
        }

        /* if (nextprops.wallet && nextprops.wallet !== null) {
            
            //console.log("wallet ",nextprops.wallet);
            if (nextprops.wallet.length !== 0) {
                nextprops.wallet.map(value => {
                    if (this.state.secondCurrency === value.CoinName) {
                        this.setState({secondCurrencyBalance : value.Balance,
                                       secondCurrencyWalletId : value.AccWalletID});
                    }
    
                    if (this.state.firstCurrency === value.CoinName) {
                        this.setState({firstCurrencyBalance : value.Balance,
                                       firstCurrencyWalletId : value.AccWalletID});
                    }
                })
            }

            this.setState({
                Wallet: nextprops.wallet
            })
            //console.log("inde first",this.state.firstCurrencyBalance);
            //console.log("inde first",this.state.secondCurrencyBalance);
        } */

        if (nextprops.marginWalletList && nextprops.marginWalletList !== null && nextprops.marginWalletList.length !== 0) {

            // code change by devang parekh for handle margin trading wallet changes
            // initialize default params
            var firstCurrencyMarginDetail = {}, secondCurrencyMarginDetail = {}, secondCurrencyBalance = 0, secondCurrencyWalletId = 0, firstCurrencyBalance = 0, firstCurrencyWalletId = 0;

            nextprops.marginWalletList.map(value => {
                if (this.state.secondCurrency === value.CoinName && value.WalletUsageType === AppConfig.marginTradingWalletId) {
                    /* this.setState({secondCurrencyBalance : value.Balance,
                                    secondCurrencyWalletId : value.AccWalletID,
                                    secondCurrencyMarginDetail:value}); */
                    secondCurrencyBalance = value.Balance;
                    secondCurrencyWalletId = value.AccWalletID;
                    secondCurrencyMarginDetail = value;
                }

                if (this.state.firstCurrency === value.CoinName && value.WalletUsageType === AppConfig.marginTradingWalletId) {
                    /* this.setState({firstCurrencyBalance : value.Balance,
                                    firstCurrencyWalletId : value.AccWalletID,
                                    firstCurrencyMarginDetail:value}); */
                    firstCurrencyBalance = value.Balance;
                    firstCurrencyWalletId = value.AccWalletID;
                    firstCurrencyMarginDetail = value;
                }
            })

            this.setState({
                Wallet: nextprops.marginWalletList,
                firstCurrencyBalance: firstCurrencyBalance,
                firstCurrencyWalletId: firstCurrencyWalletId,
                //firstCurrencyMarginDetail : firstCurrencyMarginDetail,
                secondCurrencyBalance: secondCurrencyBalance,
                secondCurrencyWalletId: secondCurrencyWalletId,
                //secondCurrencyMarginDetail : secondCurrencyMarginDetail,
            })

        }

    }

    // Function for OPen favourite pair list
    openFavourite = (event) => {
        this.setState({ displayFavourite: !this.state.displayFavourite })
    }

    setBuyOrders = (price, amount) => {
        var bulkBuyOrder = []
        if ((price && price !== 0) && (amount && amount !== 0)) {
            var total = parseFloat(parseFloat(price) * parseFloat(amount)).toFixed(8)
            // bulkBuyOrder.push({"Price":price,"Amount":amount,"Total":total})    
            bulkBuyOrder.Price = price;
            bulkBuyOrder.Amount = amount;
            bulkBuyOrder.Total = total;
        }

        this.setState({
            bulkBuyOrder: bulkBuyOrder
        })
    }

    setSellOrders = (price, amount) => {
        var bulkSellOrder = []
        if ((price && price !== 0) && (amount && amount !== 0)) {
            var total = parseFloat(parseFloat(price) * parseFloat(amount)).toFixed(8)
            bulkSellOrder.Price = price;
            bulkSellOrder.Amount = amount;
            bulkSellOrder.Total = total;
        }

        this.setState({
            bulkSellOrder: bulkSellOrder
        })
    }

    // function for change second currency 
    changeSecondCurrency(value) {

        //if(this.state.currencyPair !== value.PairName) {

        if (this.state.secondCurrency !== value.Abbrevation || (this.state.displayFavourite && this.state.secondCurrency === value.Abbrevation)) {

            const pair = value.PairList[0].PairName
            const pairID = value.PairList[0].PairId
            const firstCurrency = value.PairList[0].Abbrevation
            const UpDownBit = value.PairList[0].UpDownBit
            const takers = value.PairList[0].SellFees
            const makers = value.PairList[0].BuyFees
            var pairs = '';

            const OldBaseCurrency = this.state.secondCurrency;
            const oldPair = this.state.currencyPair;
            this.setState({
                displayFavourite: false,
                secondCurrency: value.Abbrevation,
                currencyPair: pair,
                currencyPairID: pairID,
                firstCurrency: firstCurrency,
                UpDownBit: UpDownBit,
                takersValue: takers,
                makersValue: makers,
                bulkSellOrder: [],
                bulkBuyOrder: []
            })
            //console.log("AddPairSubscription",(new Date()));
            this.state.hubConnection.invoke('AddPairSubscription', pair, oldPair).catch(err => console.error("AddPairSubscription", err));
            //console.log("AddMarketSubscription",(new Date()));
            this.state.hubConnection.invoke('AddMarketSubscription', value.Abbrevation, OldBaseCurrency).catch(err => console.error("AddMarketSubscription", err))

            // call All methods that are use in child components
            this.props.getMarketCapList({ Pair: pair, marginTrading: 1 });
            //this.props.getActiveMyOpenOrderList({ Pair: pair, page: 1 });
            //this.props.getActiveOpenOrderList({ Pair: pair });
            //this.props.changeBuyPairSocket({ Pair: pair });
            // this.props.changeSellPairSocket({ Pair: pair });
            this.props.getBuyerOrderList({ Pair: pair, marginTrading: 1 });
            this.props.getSellerOrderList({ Pair: pair, marginTrading: 1 });
            this.props.getChartData({ Pair: pair, Interval: '1m', marginTrading: 1 });
            //this.props.getHoldingList({ Pair: pair });
            this.props.getMarketTradeHistory({ Pair: pair, marginTrading: 1 });
            this.props.getMarketDepth({ Pair: pair, marginTrading: 1 })
            this.props.getLeverageDetail({ firstCurrency: firstCurrency, secondCurrency: value.Abbrevation });
            //this.props.getCurrentPrice({Pair: pair});
            // this.props.changeMarketTradeSocketConnection({ Pair: pair });
            //this.props.getTickersList({ Pair: pair })
            //this.props.getVolumeData(this.state.secondCurrency)
            //this.props.getPairList({ Pair: pair })

        }

        //}

    }

    // function for change selected currency pair 
    changeCurrencyPair(value) {
        var pairs = '';
        if (value) {

            const oldPair = this.state.currencyPair;
            const pair = value.PairName
            const pairId = value.PairId
            //const currencies = pair.split('_');
            const firstCurrency = value.Abbrevation
            pairs = value.PairName
            this.setState({
                firstCurrency: firstCurrency,
                currencyPair: pair,
                currencyPairID: pairId,
                UpDownBit: value.UpDownBit,
                takersValue: value.SellFees,
                makersValue: value.BuyFees,
                bulkSellOrder: [],
                bulkBuyOrder: [],
            })
            //console.log("AddPairSubscription",(new Date()));
            this.state.hubConnection.invoke('AddPairSubscription', pair, oldPair).catch(err => console.error("AddPairSubscription", err));

            const tempSecondCurrency = value.PairName.split('_')[1];
            if (this.state.displayFavourite && this.state.secondCurrency !== tempSecondCurrency) {
                this.state.hubConnection.invoke('AddMarketSubscription', tempSecondCurrency, this.state.secondCurrency).catch(err => console.error("AddMarketSubscription", err))
                this.setState({
                    secondCurrency: tempSecondCurrency
                });
            }

            this.props.getLeverageDetail({ firstCurrency: firstCurrency, secondCurrency: this.state.secondCurrency });

        } else {
            //const pair = this.state.firstCurrency + '/' + this.state.secondCurrency;
            this.setState({ currencyPair: pair })
        }

        // call All methods that are use in child components
        this.props.getMarketCapList({ Pair: pairs, marginTrading: 1 });
        // this.props.getActiveMyOpenOrderList({ Pair: pairs, page: 1 });
        //  this.props.getActiveOpenOrderList({ Pair: pairs });
        //this.props.changeBuyPairSocket({ Pair: pairs });
        //this.props.changeSellPairSocket({ Pair: pairs });
        this.props.getBuyerOrderList({ Pair: pairs, marginTrading: 1 });
        this.props.getSellerOrderList({ Pair: pairs, marginTrading: 1 });
        this.props.getChartData({ Pair: pairs, Interval: '1m', marginTrading: 1 });
        //this.props.getHoldingList({ Pair: pairs });
        this.props.getMarketTradeHistory({ Pair: pairs, marginTrading: 1 });
        this.props.getMarketDepth({ Pair: pairs, marginTrading: 1 })

        //this.props.getCurrentPrice({Pair: pairs});
        //this.props.changeMarketTradeSocketConnection({ Pair: pairs }),
        //this.props.getTickersList({ Pair: pairs })
        //  this.props.getVolumeData(this.state.secondCurrency)
        // this.props.getPairList({ Pair: pairs })

    }

    //Tabmenu Start    
    handleChange(e, value) {
        this.setState({ activeIndex: value });
    }
    //Tabmenu End 

    state = {
        open: false,
    };

    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };



    render() {
        const { activeIndex } = this.state;
        //Added by salim dt:15/04/2019
        const { width } = this.state;
        const isMobile = width < 768;

        var secondCurrencyBalance = 0;
        var firstCurrencyBalance = 0;
        var firstCurrencyWalletId = 0;
        var secondCurrencyWalletId = 0;

        if (this.state.Wallet.length !== 0) {
            var secondCurrencyBal = this.state.Wallet.findIndex(wallet => wallet.CoinName === this.state.secondCurrency && wallet.IsDefaultWallet == 1 && wallet.WalletUsageType === AppConfig.marginTradingWalletId);
            var firstCurrencyBal = this.state.Wallet.findIndex(wallet => wallet.CoinName === this.state.firstCurrency && wallet.IsDefaultWallet == 1 && wallet.WalletUsageType === AppConfig.marginTradingWalletId);

            if (secondCurrencyBal !== -1) {
                this.state.secondCurrencyBalance = this.state.Wallet[secondCurrencyBal].Balance
                secondCurrencyWalletId = this.state.Wallet[secondCurrencyBal].AccWalletID;
            } else {
                this.state.secondCurrencyBalance = 0
                secondCurrencyWalletId = 0;
            }

            if (firstCurrencyBal !== -1) {
                this.state.firstCurrencyBalance = this.state.Wallet[firstCurrencyBal].Balance
                firstCurrencyWalletId = this.state.Wallet[firstCurrencyBal].AccWalletID
            } else {
                this.state.firstCurrencyBalance = 0;
                firstCurrencyWalletId = 0;
            }

            // code added by devang parekh for fetching only pair wallets detail like margin safety and profit
            this.state.firstCurrencyMarginDetail = [];
            this.state.secondCurrencyMarginDetail = [];
            this.state.Wallet.map(value => {
                if (this.state.firstCurrency === value.CoinName) {
                    this.state.firstCurrencyMarginDetail.push(value);
                }

                if (this.state.secondCurrency === value.CoinName) {
                    this.state.secondCurrencyMarginDetail.push(value);
                }
            })
            // end

        }

        const { match } = this.props;
        var currentBuyPrice = 0
        var currentSellPrice = 0
        if (this.state.currentMarket) {
            this.state.currentMarket.map(value => {
                if (value.firstCurrency == this.state.firstCurrency) {
                    this.state.currentBuyPrice = value.BuyPrice,
                        this.state.currentSellPrice = value.SellPrice
                }
            })
        }

        return (
            <Fragment>
                {
                    isMobile
                        ?
                        <div className="cardboxmobile">
                            <AppBar position="static" color="default">
                                <Tabs
                                    value={activeIndex}
                                    onChange={(e, value) => this.handleChange(e, value)}
                                    textColor="primary"
                                    indicatorColor="primary"
                                    className="mobiletabmenu"
                                    scrollable
                                    scrollButtons="auto">
                                    <Tab className="col-4" label="Charts" />
                                    <Tab className="col-4" label="Trade" />
                                    <Tab className="col-4" label="Open Orders" />
                                </Tabs>
                            </AppBar>
                            {activeIndex === 0 && <TabContainer>
                                <div className="mb-15">
                                    <Card>
                                        <div class="selectcoin">
                                            <Row>
                                                <Col xs={6}>
                                                    <h3 onClick={this.handleClickOpen}>{this.state.firstCurrency + "/" + this.state.secondCurrency}
                                                        <i class="fa fa-caret-down" aria-hidden="true"></i>
                                                    </h3>
                                                </Col>
                                                <Col xs={6} className="text-right">
                                                    <div className="favoritesbtn">
                                                        <a href="#" onClick={this.handleClickOpen}><i class="fa fa-star" aria-hidden="true"></i> Favorites</a>
                                                    </div>
                                                </Col>
                                            </Row>

                                            <MobileCurrentMarket
                                                {...this.props}
                                                firstCurrency={this.state.firstCurrency}
                                                secondCurrency={this.state.secondCurrency}
                                                currencyPair={this.state.currencyPair}
                                                hubConnection={this.state.hubConnection}
                                                marginTrading={1}
                                            />
                                        </div>
                                    </Card>
                                    {/* <div class="selectcoin" onClick={this.handleClickOpen}>Demo</div> */}
                                    <Dialog fullScreen
                                        open={this.state.open}
                                        onClose={this.handleClose}
                                        TransitionComponent={Transition}>
                                        <AppBar className="dialogheader">
                                            <Toolbar>
                                                <IconButton color="inherit" onClick={this.handleClose} aria-label="Close">
                                                    <CloseIcon />
                                                </IconButton>
                                                <h3>Markets</h3>
                                                {/* <Button color="inherit" onClick={this.handleClose}>save</Button> */}
                                            </Toolbar>
                                        </AppBar>
                                        <div className="mt-70">
                                            <MobilePairList
                                                {...this.props}
                                                state={this.state}
                                                pairData={this.state.pairList}
                                                firstCurrency={this.state.firstCurrency}
                                                secondCurrency={this.state.secondCurrency}
                                                currencyPair={this.state.currencyPair}
                                                displayFavouritePair={this.openFavourite}
                                                displayFavourite={this.state.displayFavourite}
                                                changePairs={this.changeCurrencyPair}
                                                changeSecondCurrency={this.changeSecondCurrency}
                                                hubConnection={this.state.hubConnection}
                                                marginTrading={1}
                                                autoHeightMin={218}
                                                autoHeightMax={218}
                                            />
                                        </div>
                                    </Dialog>

                                </div>
                                <Card className="">
                                    <MobileTradingChart
                                        {...this.props} state={this.state}
                                        firstCurrency={this.state.firstCurrency}
                                        secondCurrency={this.state.secondCurrency}
                                        currencyPair={this.state.currencyPair}
                                        hubConnection={this.state.hubConnection}
                                        marginTrading={1}
                                    />
                                </Card>
                                <div className="mt-15">
                                    <Card className="MobileMarketTrade">
                                        <MobileMarketTrade
                                            {...this.props}
                                            firstCurrency={this.state.firstCurrency}
                                            secondCurrency={this.state.secondCurrency}
                                            currencyPair={this.state.currencyPair}
                                            hubConnection={this.state.hubConnection}
                                            marginTrading={1}
                                            isShowHeader={1}
                                            autoHeightMin={215}
                                            autoHeightMax={215}
                                        />
                                    </Card>
                                </div>
                            </TabContainer>}
                            {activeIndex === 1 && <TabContainer>
                                <Card className="">
                                    <MobilePlaceOrder
                                        {...this.props}
                                        firstCurrency={this.state.firstCurrency}
                                        secondCurrency={this.state.secondCurrency}
                                        currencyPair={this.state.currencyPair}
                                        firstCurrencyBalance={this.state.firstCurrencyBalance}
                                        secondCurrencyBalance={this.state.secondCurrencyBalance}
                                        autoHeightMin={150}
                                        autoHeightMax={150}
                                        UpDownBit={this.state.UpDownBit}
                                        hubConnection={this.state.hubConnection}
                                        setBuyOrders={this.setBuyOrders}
                                        setSellOrders={this.setSellOrders}
                                        marginTrading={1}
                                    />
                                </Card>
                                <Card className="mt-15">
                                    <MobileBuySellTrade
                                        {...this.props}
                                        firstCurrency={this.state.firstCurrency}
                                        secondCurrency={this.state.secondCurrency}
                                        currencyPair={this.state.currencyPair}
                                        firstCurrencyBalance={this.state.firstCurrencyBalance}
                                        secondCurrencyBalance={this.state.secondCurrencyBalance}
                                        autoHeightMin={150}
                                        autoHeightMax={150}
                                        UpDownBit={this.state.UpDownBit}
                                        hubConnection={this.state.hubConnection}
                                        setBuyOrders={this.setBuyOrders}
                                        setSellOrders={this.setSellOrders}
                                        marginTrading={1}
                                    />
                                </Card>
                            </TabContainer>}
                            {activeIndex === 2 && <TabContainer>
                                <div className="mobileActiveOrders">
                                    <MobileActiveOrders
                                        {...this.props}
                                        firstCurrency={this.state.firstCurrency}
                                        secondCurrency={this.state.secondCurrency}
                                        currencyPair={this.state.currencyPair}
                                        hubConnection={this.state.hubConnection}
                                        marginTrading={1} />
                                </div>
                                {/* <Card className="">
                            <MobilePairList
                                {...this.props} 
                                    state={this.state}
                                    pairData={this.state.pairList}
                                    firstCurrency={this.state.firstCurrency}
                                    secondCurrency={this.state.secondCurrency}
                                    currencyPair={this.state.currencyPair}
                                    displayFavouritePair={this.openFavourite} 
                                    displayFavourite={this.state.displayFavourite} 
                                    changePairs={this.changeCurrencyPair}
                                    changeSecondCurrency={this.changeSecondCurrency}
                                    hubConnection={this.state.hubConnection}
                                    marginTrading={1}
                                    autoHeightMin={218}
                                    autoHeightMax={218}
                                />
                            </Card> */}

                            </TabContainer>}
                        </div>

                        :
                        <div className="ecom-dashboard-wrapper">
                            <Row>
                                <Col sm={3} md={3} lg={3}>
                                    <div className="d-sm-full">
                                        <Card className="cooldexmarkettrade">
                                            <MarginAccountDetail
                                                autoHeightMin={279}
                                                autoHeightMax={279}
                                                firstCurrency={this.state.firstCurrency}
                                                secondCurrency={this.state.secondCurrency}
                                                currencyPair={this.state.currencyPair}
                                                hubConnection={this.state.hubConnection}
                                                takers={this.state.takersValue}
                                                makers={this.state.makersValue}
                                                firstCurrencyMarginDetail={this.state.firstCurrencyMarginDetail}
                                                secondCurrencyMarginDetail={this.state.secondCurrencyMarginDetail}
                                                marginTrading={1}
                                            />
                                        </Card>
                                        <Card className="coinbasicmain">
                                            <MarketTrade
                                                {...this.props}
                                                firstCurrency={this.state.firstCurrency}
                                                secondCurrency={this.state.secondCurrency}
                                                currencyPair={this.state.currencyPair}
                                                hubConnection={this.state.hubConnection}
                                                marginTrading={1}
                                                isShowHeader={1}
                                                autoHeightMin={315}
                                                autoHeightMax={315}
                                            />
                                        </Card>
                                    </div>
                                </Col>
                                <Col sm={6} md={6} lg={6} className="cooldexgraphpadding">
                                    <Card className="cooldexgraph">
                                        <CurrentMarket
                                            {...this.props}
                                            firstCurrency={this.state.firstCurrency}
                                            secondCurrency={this.state.secondCurrency}
                                            currencyPair={this.state.currencyPair}
                                            hubConnection={this.state.hubConnection}
                                            marginTrading={1}
                                        />

                                        <TradingChart
                                            {...this.props} state={this.state}
                                            firstCurrency={this.state.firstCurrency}
                                            secondCurrency={this.state.secondCurrency}
                                            currencyPair={this.state.currencyPair}
                                            hubConnection={this.state.hubConnection}
                                            marginTrading={1}
                                        />
                                    </Card>
                                    <Card className="cooldexbuysellmain">
                                        <PlaceOrder
                                            {...this.props}
                                            firstCurrency={this.state.firstCurrency}
                                            secondCurrency={this.state.secondCurrency}
                                            currencyPair={this.state.currencyPair}
                                            currencyPairID={this.state.currencyPairID}
                                            state={this.state}
                                            buyPrice={this.state.currentBuyPrice}
                                            sellPrice={this.state.currentSellPrice}
                                            firstCurrencyBalance={this.state.firstCurrencyBalance}
                                            secondCurrencyBalance={this.state.secondCurrencyBalance}
                                            bulkBuyOrder={this.state.bulkBuyOrder}
                                            bulkSellOrder={this.state.bulkSellOrder}
                                            hubConnection={this.state.hubConnection}
                                            firstCurrencyWalletId={firstCurrencyWalletId}
                                            secondCurrencyWalletId={secondCurrencyWalletId}
                                            takers={this.state.takersValue}
                                            makers={this.state.makersValue}
                                            marginTrading={1}
                                        />
                                    </Card>
                                </Col>
                                <Col sm={3} md={3} lg={3}>
                                    <div className="d-sm-full">
                                        <Card className="cooldexmarkettrade">
                                            <PairList
                                                {...this.props}
                                                state={this.state}
                                                pairData={this.state.pairList}
                                                firstCurrency={this.state.firstCurrency}
                                                secondCurrency={this.state.secondCurrency}
                                                currencyPair={this.state.currencyPair}
                                                displayFavouritePair={this.openFavourite}
                                                displayFavourite={this.state.displayFavourite}
                                                changePairs={this.changeCurrencyPair}
                                                changeSecondCurrency={this.changeSecondCurrency}
                                                hubConnection={this.state.hubConnection}
                                                marginTrading={1}
                                                autoHeightMin={218}
                                                autoHeightMax={218}
                                            />
                                        </Card>
                                        <Card className="activetrades">

                                            <BuySellTrade
                                                {...this.props}
                                                firstCurrency={this.state.firstCurrency}
                                                secondCurrency={this.state.secondCurrency}
                                                currencyPair={this.state.currencyPair}
                                                firstCurrencyBalance={this.state.firstCurrencyBalance}
                                                secondCurrencyBalance={this.state.secondCurrencyBalance}
                                                autoHeightMin={150}
                                                autoHeightMax={150}
                                                UpDownBit={this.state.UpDownBit}
                                                hubConnection={this.state.hubConnection}
                                                setBuyOrders={this.setBuyOrders}
                                                setSellOrders={this.setSellOrders}
                                                marginTrading={1}
                                            />
                                        </Card>
                                    </div>
                                </Col>
                            </Row>

                            <Card className="m-0 mt-10 marginorderactiveorders">
                                <Row className="m-0">

                                    <Col sm={12} md={12} lg={12}>
                                        <MarginActiveOrders
                                            {...this.props}
                                            firstCurrency={this.state.firstCurrency}
                                            secondCurrency={this.state.secondCurrency}
                                            currencyPair={this.state.currencyPair}
                                            hubConnection={this.state.hubConnection}
                                            marginTrading={1} />
                                    </Col>
                                </Row>
                            </Card>
                        </div>
                }
            </Fragment>

        )
    }
}

const mapStateToProps = state => ({
    pairList: state.tradePairList.pairList,
    wallet: state.currency.wallets,
    loading: state.tradePairList.loading,
    error: state.tradePairList.error,
    darkMode: state.settings.darkMode,
    marginWalletList: state.WalletManagementReducer.walletList
});


export default connect(mapStateToProps, {
    //getCurrencyList,
    getMarketCapList,
    //getActiveMyOpenOrderList,
    //getActiveOpenOrderList,
    getBuyerOrderList,
    getSellerOrderList,
    getChartData,
    //getHoldingList,
    //CHANGE_MARKET_TRADE_HISTORY_SOCKET,
    getTickersList,
    getMarketTradeHistory,
    getPairList,
    //changeBuyPairSocket,
    //changeSellPairSocket,
    //changeMarketTradeSocketConnection,
    getVolumeData,
    //getWallets,
    getCurrentPrice,
    getMarketDepth,
    getMaringWalletList,
    getLeverageDetail
})(MarginTrading);
