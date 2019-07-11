/**
 * Trading Dashboard
 */
import React, { Component } from 'react';
import { Row, Col, Card } from 'reactstrap';
import {
    getCurrencyList,
    getCurrentPrice,
    getMarketCapList,
    getActiveMyOpenOrderList,
    getBuyerOrderList,
    getSellerOrderList,
    getChartData,
    getHoldingList,
    getMarketTradeHistory,
    getTickersList,
    getPairList,
    changeBuyPairSocket,
    changeSellPairSocket,
    changeMarketTradeSocketConnection,
    getVolumeData,
    getMarketDepth
} from 'Actions/Trade';
import { getWallets } from 'Actions/Withdraw';
// import connect for redux store
import { connect } from 'react-redux';
// import components for trading dashboard
import {
    CurrentMarket,
    PairList,
    PlaceOrder,
    MarketTrade,
    ActiveOrders,
    BuySellTrade,
    TradingChart,
    CoinBasicList,
    MarketDepth,
    NewsList,
    InviteList,
    TokenValue,
} from "Components/CooldexTrading";
import AppConfig from 'Constants/AppConfig';
import $ from 'jquery';

// Component for trading dashboard
class cooldextradingDashbaord extends Component {
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
            isComponentActive: 1
        }
        this.changeCurrencyPair = this.changeCurrencyPair.bind(this)
        this.changeSecondCurrency = this.changeSecondCurrency.bind(this)
    }

    // invoke before Compoent render
    componentWillMount() {
        const self = this;
        self.isComponentActive = 1;
        //load Currency List
        this.props.getPairList({});
        self.state.hubConnection.on("RecieveTradeHistory", (tradeHistoryDetail) => {});

        self.state.hubConnection.onclose(e => {
            setTimeout(function () {
                window.JbsHorizontalLayout.props.location.state.connectSignalR(self.state.currencyPair, self.state.secondCurrency);
            }, 1000);
        });

        self.state.hubConnection.on('RecieveWalletBal', (walletBalance) => {
            try {
                walletBalance = JSON.parse(walletBalance);
                if (self.isComponentActive === 1 && typeof walletBalance.Data !== 'undefined' && walletBalance.Data !== '') {
                    if ((walletBalance.EventTime && self.state.socketBuyData.length == 0) ||
                        (self.state.socketBuyData.length !== 0 && walletBalance.EventTime >= self.state.socketBuyData.EventTime)) {
                        const walletCoinDetail = walletBalance.Data;
                        if (walletCoinDetail.CoinName !== '') {
                            var walletList = $.extend(true, [], self.state.Wallet);
                            walletList.map((value, key) => {
                                if (value.CoinName === walletCoinDetail.CoinName && value.AccWalletID === walletCoinDetail.AccWalletID) {
                                    walletList[key].Balance = walletCoinDetail.Balance
                                }

                                if (value.CoinName === walletCoinDetail.CoinName && value.AccWalletID === walletCoinDetail.AccWalletID) {
                                    walletList[key].Balance = walletCoinDetail.Balance
                                }
                            });
                            self.setState({ Wallet: walletList, socketBuyData: walletBalance })
                        }
                    }
                }
                this.updateStateForDynamicData();
            } catch (error) {}
        });
    }

    // invoke After Compoent render
    componentDidMount() {
        //load Currency List        
        this.props.getCurrencyList();
    }

    componentWillUnmount() {
        this.isComponentActive = 0;
    }

    // invoke when component recive props
    componentWillReceiveProps(nextprops) {
        if (nextprops.pairList !== null && nextprops.pairList.length && nextprops.pairList !== this.state.pairList) {
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
            this.updateStateForDynamicData();
        } else {
            this.setState({ showLoader: false });
        }

        if (nextprops.hasOwnProperty('wallet')) {
            if (nextprops.wallet.length !== 0) {
                nextprops.wallet.map(value => {
                    if (this.state.secondCurrency === value.CoinName) {
                        this.setState({
                            secondCurrencyBalance: value.Balance,
                            secondCurrencyWalletId: value.AccWalletID
                        });
                    }

                    if (this.state.firstCurrency === value.CoinName) {
                        this.setState({
                            firstCurrencyBalance: value.Balance,
                            firstCurrencyWalletId: value.AccWalletID
                        });
                    }
                })
            }
            this.setState({ Wallet: nextprops.wallet });
            this.updateStateForDynamicData();
        }
    }

    // Function for OPen favourite pair list
    openFavourite = (event) => {
        this.setState({ displayFavourite: !this.state.displayFavourite })
    }

    setBuyOrders = (price, amount) => {
        var bulkBuyOrder = []
        if ((price && price != 0) && (amount && amount != 0)) {
            var total = parseFloat(parseFloat(price) * parseFloat(amount)).toFixed(8)
            bulkBuyOrder.Price = price;
            bulkBuyOrder.Amount = amount;
            bulkBuyOrder.Total = total;
        }

        this.setState({ bulkBuyOrder: bulkBuyOrder });
    }

    setSellOrders = (price, amount) => {
        var bulkSellOrder = []
        if ((price && price != 0) && (amount && amount != 0)) {
            var total = parseFloat(parseFloat(price) * parseFloat(amount)).toFixed(8)
            bulkSellOrder.Price = price;
            bulkSellOrder.Amount = amount;
            bulkSellOrder.Total = total;
        }

        this.setState({ bulkSellOrder: bulkSellOrder });
    }

    // function for change second currency 
    changeSecondCurrency(value) {
        if (this.state.secondCurrency !== value.Abbrevation || (this.state.displayFavourite && this.state.secondCurrency === value.Abbrevation)) {
            const pair = value.PairList[0].PairName
            const pairID = value.PairList[0].PairId
            const firstCurrency = value.PairList[0].Abbrevation
            const UpDownBit = value.PairList[0].UpDownBit
            const takers = value.PairList[0].SellFees
            const makers = value.PairList[0].BuyFees
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
            this.state.hubConnection.invoke('AddPairSubscription', pair, oldPair).catch(err => console.error("AddPairSubscription", err));
            this.state.hubConnection.invoke('AddMarketSubscription', value.Abbrevation, OldBaseCurrency).catch(err => console.error("AddMarketSubscription", err))

            // call All methods that are use in child components
            this.props.getMarketCapList({ Pair: pair });
            this.props.getBuyerOrderList({ Pair: pair });
            this.props.getSellerOrderList({ Pair: pair });
            this.props.getChartData({ Pair: pair, Interval: '1m' });
            this.props.getMarketTradeHistory({ Pair: pair });
            this.props.getMarketDepth({ Pair: pair })
        }
    }

    // function for change selected currency pair 
    changeCurrencyPair(value) {
        var pairs = '';
        if (value) {
            const oldPair = this.state.currencyPair;
            const pair = value.PairName
            const pairId = value.PairId
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
                bulkBuyOrder: []
            })
            this.state.hubConnection.invoke('AddPairSubscription', pair, oldPair).catch(err => console.error("AddPairSubscription", err));
            const tempSecondCurrency = value.PairName.split('_')[1];
            if (this.state.displayFavourite && this.state.secondCurrency !== tempSecondCurrency) {
                this.state.hubConnection.invoke('AddMarketSubscription', tempSecondCurrency, this.state.secondCurrency).catch(err => console.error("AddMarketSubscription", err))
                this.setState({ secondCurrency: tempSecondCurrency });
            }
        } else {
            this.setState({ currencyPair: pairs })
        }

        // call All methods that are use in child components
        this.props.getMarketCapList({ Pair: pairs });
        this.props.getBuyerOrderList({ Pair: pairs });
        this.props.getSellerOrderList({ Pair: pairs });
        this.props.getChartData({ Pair: pairs, Interval: '1m' });
        this.props.getMarketTradeHistory({ Pair: pairs });
        this.props.getMarketDepth({ Pair: pairs })
    }

    updateStateForDynamicData = () => {
        let firstCurrencyWalletId = 0;
        let secondCurrencyWalletId = 0;
        let firstCurrencyBalance = 0;
        let secondCurrencyBalance = 0;
        let currentBuyPrice = this.state.currentBuyPrice;
        let currentSellPrice = this.state.currentSellPrice;

        if (this.state.Wallet.length !== 0) {
            var secondCurrencyBal = this.state.Wallet.findIndex(wallet => wallet.CoinName === this.state.secondCurrency && wallet.IsDefaultWallet == 1);
            var firstCurrencyBal = this.state.Wallet.findIndex(wallet => wallet.CoinName === this.state.firstCurrency && wallet.IsDefaultWallet == 1);
            if (secondCurrencyBal !== -1) {
                secondCurrencyBalance = this.state.Wallet[secondCurrencyBal].Balance
                secondCurrencyWalletId = this.state.Wallet[secondCurrencyBal].AccWalletID
            }

            if (firstCurrencyBal !== -1) {
                firstCurrencyBalance = this.state.Wallet[firstCurrencyBal].Balance
                firstCurrencyWalletId = this.state.Wallet[firstCurrencyBal].AccWalletID
            }
        }

        if (this.state.currentMarket) {
            this.state.currentMarket.map(value => {
                if (value.firstCurrency == this.state.firstCurrency) {
                    currentBuyPrice = value.BuyPrice
                    currentSellPrice = value.SellPrice
                }
            })
        }

        //setTimeout( () => {
            this.setState({ 
                firstCurrencyWalletId : firstCurrencyWalletId,
                secondCurrencyWalletId : secondCurrencyWalletId,
                secondCurrencyBalance : secondCurrencyBalance,
                firstCurrencyBalance : firstCurrencyBalance,
                currentBuyPrice : currentBuyPrice,
                currentSellPrice : currentSellPrice
            });
        //},200);
    }

    render() {
        return (
            <div className="ecom-dashboard-wrapper">
                <Row>
                    <Col sm={3} md={3} lg={3}>
                        <div className="d-sm-full">
                            <Card className="invitelistmain">
                                <InviteList
                                    {...this.props}
                                />
                            </Card>
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
                                    autoHeightMin={330}
                                    autoHeightMax={330}
                                />
                            </Card>
                            <Card className="tokenvaluemain">
                                <TokenValue />
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
                            />
                            <TradingChart
                                {...this.props} state={this.state}
                                firstCurrency={this.state.firstCurrency}
                                secondCurrency={this.state.secondCurrency}
                                currencyPair={this.state.currencyPair}
                                hubConnection={this.state.hubConnection}
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
                                firstCurrencyWalletId={this.state.firstCurrencyWalletId}
                                secondCurrencyWalletId={this.state.secondCurrencyWalletId}
                                takers={this.state.takersValue}
                                makers={this.state.makersValue}
                            />
                        </Card>
                    </Col>
                    <Col sm={3} md={3} lg={3}>
                        <div className="d-sm-full">
                            <Card className="newslistmain">
                                <NewsList
                                    {...this.props}
                                    autoHeightMin={300}
                                    autoHeightMax={300}
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
                                />
                            </Card>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col sm={12} md={12} lg={12}>
                        <ActiveOrders
                            {...this.props}
                            firstCurrency={this.state.firstCurrency}
                            secondCurrency={this.state.secondCurrency}
                            currencyPair={this.state.currencyPair}
                            hubConnection={this.state.hubConnection}
                            isShowHeader={1} />
                    </Col>
                </Row>
                <Row>
                    <Col sm={4}>
                        <div className="coinbasicmain">
                            <CoinBasicList
                                {...this.props}
                                autoHeightMin={180}
                                autoHeightMax={180}
                            />
                        </div>
                    </Col>
                    <Col sm={4} className="p-0">
                        <div className="coinbasicmain marketdepthgraph">
                            <MarketDepth
                                {...this.props}
                                autoHeightMin={150}
                                autoHeightMax={150}
                                currencyPair={this.state.currencyPair}
                            />
                        </div>
                    </Col>
                    <Col sm={4}>
                        <div className="coinbasicmain">
                            <MarketTrade
                                {...this.props}
                                firstCurrency={this.state.firstCurrency}
                                secondCurrency={this.state.secondCurrency}
                                currencyPair={this.state.currencyPair}
                                autoHeightMin={160}
                                autoHeightMax={160}
                                hubConnection={this.state.hubConnection}
                            />
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    pairList: state.tradePairList.pairList,
    wallet: state.currency.wallets,
    loading: state.tradePairList.loading,
    error: state.tradePairList.error,
    darkMode: state.settings.darkMode
});

export default connect(mapStateToProps, {
    getCurrencyList,
    getMarketCapList,
    getActiveMyOpenOrderList,
    getBuyerOrderList,
    getSellerOrderList,
    getChartData,
    getHoldingList,
    getTickersList,
    getMarketTradeHistory,
    getPairList,
    changeBuyPairSocket,
    changeSellPairSocket,
    changeMarketTradeSocketConnection,
    getVolumeData,
    getWallets,
    getCurrentPrice,
    getMarketDepth
})(cooldextradingDashbaord);