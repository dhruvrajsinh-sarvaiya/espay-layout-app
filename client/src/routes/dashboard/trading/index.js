/**
 * Trading Dashboard
 */
import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
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
    getVolumeData
} from 'Actions/Trade';
import { getWallets } from 'Actions/Withdraw';
// import connect for redux store
import { connect } from 'react-redux';
import {
    CurrentMarket,
    PairList,
    PlaceOrder,
    MarketTrade,
    ActiveOrders,
    BuySellTrade,
    TradingChart,
} from "Components/TradeWidgets3";

// Component for trading dashboard
class tradingDashbaord extends Component {
    constructor() {
        super()
        this.state = {
            currency: [],
            firstCurrency: "INR",
            firstCurrencyBalance: 0,
            takersValue: 0,
            makersValue: 0,
            secondCurrencyBalance: 0,
            secondCurrency: 'BTC',
            currencyPair: 'INR_BTC',
            currentMarket: [],
            oldMarketCapData: [],
            displayFavourite: false,
            currentBuyPrice: 0,
            currentSellPrice: 0,
            showLoader: true,
            pairList: [],
            pairData: [],
            Wallet: [],
            UpDownBit: 0

        }
        this.changeCurrencyPair = this.changeCurrencyPair.bind(this)
        this.changeSecondCurrency = this.changeSecondCurrency.bind(this)
    }

    // invoke before Compoent render
    componentWillMount() {
        //load Currency List
        this.props.getPairList({});
    }

    // invoke After Compoent render
    componentDidMount() {
        //load Currency List        
        this.props.getCurrencyList();
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
                UpDownBit: nextprops.pairList[0].PairList[0].UpDownBit
            });
        } else {
            this.setState({ showLoader: false });
        }

        if (nextprops.hasOwnProperty('wallet')) {
            this.setState({ Wallet: nextprops.wallet });
        }
    }

    // function for change second currency 
    changeSecondCurrency(value) {
        const pair = value.PairList[0].PairName
        const pairID = value.PairList[0].PairId
        const firstCurrency = value.PairList[0].Abbrevation
        const UpDownBit = value.PairList[0].UpDownBit
        this.setState({
            secondCurrency: value.Abbrevation,
            currencyPair: pair,
            currencyPairID: pairID,
            firstCurrency: firstCurrency,
            UpDownBit: UpDownBit,
        })

        // call All methods that are use in child components
        this.props.getMarketCapList({ Pair: pair })
        this.props.getActiveMyOpenOrderList({ Pair: pair, page: 1 })
        this.props.getBuyerOrderList({ Pair: pair })
        this.props.getSellerOrderList({ Pair: pair })
        this.props.getChartData({ Pair: pair })
        this.props.getHoldingList({ Pair: pair })
        this.props.getMarketTradeHistory({ Pair: pair })
        this.props.getCurrentPrice({ Pair: pair });
        this.props.getTickersList({ Pair: pair })
        this.props.getVolumeData(value.Abbrevation)
    }

    // function for change selected currency pair 
    changeCurrencyPair(value) {
        var pairs = '';
        if (value) {
            const pair = value.PairName
            const pairId = value.PairId
            const firstCurrency = value.Abbrevation
            pairs = value.PairName

            this.setState({
                firstCurrency: firstCurrency,
                currencyPair: pair,
                currencyPairID: pairId
            })
        } else {
            this.setState({ currencyPair: pairs });
        }

        // call All methods that are use in child components
        this.props.getMarketCapList({ Pair: pairs })
        this.props.getActiveMyOpenOrderList({ Pair: pairs, page: 1 })
        this.props.getBuyerOrderList({ Pair: pairs })
        this.props.getSellerOrderList({ Pair: pairs })
        this.props.getChartData({ Pair: pairs })
        this.props.getHoldingList({ Pair: pairs })
        this.props.getCurrentPrice({ Pair: pairs });
        this.props.getMarketTradeHistory({ Pair: pairs })
        this.props.getTickersList({ Pair: pairs })
    }

    render() {
        var secondCurrencyBalance = 0;
        var firstCurrencyBalance = 0;
        if (this.state.Wallet.length !== 0) {
            this.state.Wallet.map(value => {
                if (this.state.secondCurrency === value.CoinName) {
                    secondCurrencyBalance = value.Balance
                }

                if (this.state.firstCurrency === value.CoinName) {
                    firstCurrencyBalance = value.Balance
                }
            })
        }

        if (this.state.currentMarket) {
            this.state.currentMarket.map(value => {
                if (value.firstCurrency == this.state.firstCurrency) {
                    this.state.currentBuyPrice = value.BuyPrice
                    this.state.currentSellPrice = value.SellPrice
                }
            })
        }

        return (
            <div className="ecom-dashboard-wrapper">
                {this.state.currencyPair !== '' &&
                    <Row>
                        <Col sm={12} md={12} lg={12}>
                            <CurrentMarket firstCurrency={this.state.firstCurrency}
                                secondCurrency={this.state.secondCurrency}
                                currencyPair={this.state.currencyPair}
                            />
                        </Col>
                    </Row>}
                {this.state.currencyPair !== '' &&
                    <Row>
                        <Col sm={8} md={8} lg={8}>
                            <Row>
                                <Col sm={12} md={12} lg={12}>
                                    <div className="d-sm-full  TradingChartBox">
                                        <TradingChart state={this.state} />
                                    </div>
                                </Col>
                                <Col sm={12} md={12} lg={12}>
                                    <div className="d-sm-full p-0 placeordermiddle">
                                        <PlaceOrder
                                            firstCurrency={this.state.firstCurrency}
                                            secondCurrency={this.state.secondCurrency}
                                            currencyPair={this.state.currencyPair}
                                            currencyPairID={this.state.currencyPairID}
                                            state={this.state}
                                            buyPrice={this.state.currentBuyPrice}
                                            sellPrice={this.state.currentSellPrice}
                                            firstCurrencyBalance={firstCurrencyBalance}
                                            secondCurrencyBalance={secondCurrencyBalance}
                                        />
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                        <Col sm={4} md={4} lg={4}>
                            <div className="d-sm-full">
                                <PairList state={this.state}
                                    pairData={this.state.pairList}
                                    firstCurrency={this.state.firstCurrency}
                                    secondCurrency={this.state.secondCurrency}
                                    currencyPair={this.state.currencyPair}
                                    changePairs={this.changeCurrencyPair}
                                    changeSecondCurrency={this.changeSecondCurrency} />
                            </div>
                            <div className="d-sm-full mt-10">
                                <BuySellTrade
                                    firstCurrency={this.state.firstCurrency}
                                    secondCurrency={this.state.secondCurrency}
                                    currencyPair={this.state.currencyPair}
                                    firstCurrencyBalance={firstCurrencyBalance}
                                    secondCurrencyBalance={secondCurrencyBalance}
                                    autoHeightMin={465}
                                    autoHeightMax={270}
                                    UpDownBit={this.state.UpDownBit}
                                />
                            </div>
                        </Col>
                    </Row>
                }
                {this.state.currencyPair !== '' &&
                    <Row>
                        <Col sm={8} md={8} lg={8}>
                            <div className="d-sm-full placeordermiddle">
                                <ActiveOrders firstCurrency={this.state.firstCurrency}
                                    secondCurrency={this.state.secondCurrency}
                                    currencyPair={this.state.currencyPair} />
                            </div>
                        </Col>
                        <Col sm={4} md={4} lg={4}>
                            <MarketTrade firstCurrency={this.state.firstCurrency}
                                secondCurrency={this.state.secondCurrency}
                                currencyPair={this.state.currencyPair}
                                autoHeightMin={250}
                                autoHeightMax={300}
                            />
                        </Col>
                    </Row>
                }
            </div>
        )
    }
}

const mapStateToProps = state => ({
    pairList: state.tradePairList.pairList,
    wallet: state.currency.wallets,
    loading: state.tradePairList.loading,
    error: state.tradePairList.error
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
    getCurrentPrice
})(tradingDashbaord);