/**
 * Author : Salim Deraiya
 * Created : 27/05/2019
 *  Arbitrage Dashboard
 * changed by Tejas 
*/
import React, { Component, Fragment } from 'react';

// used for connect to store
import { connect } from "react-redux";

// import components
import {
    BuySellTrade,
    ExchangeList,    
    OrderTabList,
    PairSelection,
} from "Components/Arbitrage";

//import actions
import {
    getArbitragePairList,
    getArbitrageChartData,
    atbitrageBuyerBook,
    atbitrageSellerBook,
    getArbitrageWalletList,
    arbitrageMarketTradeHistory,
    arbitrageGetExchangeList
} from "Actions/Arbitrage";

// used for constants
import AppConfig from 'Constants/AppConfig';

// import for used jquery
import $ from 'jquery';

import {
    getCurrencyList,    
} from 'Actions/Trade';

// intl messages
import IntlMessages from "Util/IntlMessages";

// email promotion class
class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstCurrency: AppConfig.defaultArbitrageChildCurrency,
            secondCurrency: AppConfig.defaultArbitrageBasedCurrency,
            currencyPair: AppConfig.defaultArbitragePair,
            firstCurrencyBalance: 0,
            firstCurrencyWalletId: 0,
            secondCurrencyBalance: 0,
            secondCurrencyWalletId: 0,
            UpDownBit: 0,
            hubConnection: this.props.location.state.hubConnection,
            Wallet: [],
            isComponentActive: 1,
            showLoader: true,
            socketBuyData: [],
            pairList: [],
            bulkBuyOrder: [],
            bulkSellOrder: [],
            currencyPairID: 10021001,
            takersValue: 0,
            makersValue: 0,
            pairId: '',
            isBulkBuyOrder: false,
            isBulkSellOrder: false,
            isBothOrder:false
        };
    }

    // invoke After Compoent render
    componentDidMount() {
        //load Currency List        
        this.props.getCurrencyList();

        this.props.getArbitrageWalletList({});
    }

    // invoke before Compoent render
    componentWillMount() {
        const self = this;
        //load Currency List
        this.props.getArbitragePairList({});

        self.state.hubConnection.onclose(e => {
            setTimeout(function () {
                window.JbsHorizontalLayout.props.location.state.connectSignalR(self.state.currencyPair, self.state.secondCurrency);
            }, 1000);
        });

        self.state.hubConnection.on('RecieveWalletBal', (walletBalance) => {
            //console.log("'RecieveWalletBal", walletBalance);
            try {
                walletBalance = JSON.parse(walletBalance);
                if (self.state.isComponentActive === 1 && typeof walletBalance.Data !== 'undefined' && walletBalance.Data !== '') {
                    if ((walletBalance.EventTime && self.state.socketBuyData.length === 0) ||
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
                                //return null
                            });
                            self.setState({ Wallet: walletList, socketBuyData: walletBalance })
                        }
                    }
                }
            } catch (error) {
            }
        });
    }

    componentWillUnmount() {
        this.setState({ isComponentActive: 0 });
    }

    // invoke when component recive props
    componentWillReceiveProps(nextprops) {
        if (nextprops.pairList.length && nextprops.pairList !== null && nextprops.pairList !== this.state.pairList) {

            // set Currency list if gets from API only     
            nextprops.pairList.map((item) => {
                item.PairList.map((pairItem) => {
                    if (AppConfig.defaultArbitragePair === pairItem.PairName) {
                        this.setState({
                            pairList: nextprops.pairList,
                            showLoader: false,
                            secondCurrency: item.Abbrevation,
                            firstCurrency: pairItem.Abbrevation,
                            currencyPair: AppConfig.defaultArbitragePair,
                            currencyPairID: pairItem.PairId,
                            UpDownBit: pairItem.UpDownBit,
                            takersValue: pairItem.SellFees,
                            makersValue: pairItem.BuyFees,
                        });

                    }
                   // return null
                })
             //   return null
            });

        } else {
            this.setState({ showLoader: false });
        }

        if (nextprops.wallet && nextprops.wallet !== null) {
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
                  //  return null
                });
            }

            this.setState({ Wallet: nextprops.wallet });
        }
    }

    // set buy orders for multiple or single record
    setBuyOrders = (price, amount, isMultiple, totalData, LpType) => {

        var bulkBuyOrder = []
        if (isMultiple === true) {

            bulkBuyOrder = this.state.bulkBuyOrder;
            if (price && price !== 0) {

                if (totalData !== "" && totalData !== undefined && bulkBuyOrder && bulkBuyOrder.length) {

                    bulkBuyOrder = this.state.bulkBuyOrder;
                    var isAvailable = bulkBuyOrder.findIndex(fav => fav.LpType === LpType);

                    if (isAvailable !== -1) {
                        let total = parseFloat(parseFloat(price) * parseFloat(amount)).toFixed(8);
                        bulkBuyOrder[isAvailable].rate = price;
                        bulkBuyOrder[isAvailable].quantity = parseFloat(amount);
                        bulkBuyOrder[isAvailable].total = totalData !== "" ? totalData : total;
                        bulkBuyOrder[isAvailable].LpType = bulkBuyOrder[isAvailable].LpType
                    } else {
                        let total = parseFloat(parseFloat(price) * parseFloat(amount)).toFixed(8);
                        bulkBuyOrder.push({
                            "rate": price,
                            "quantity": parseFloat(amount),
                            "total": (totalData !== "" && totalData !== undefined) ? totalData : total,
                            "LpType": LpType
                        })
                        bulkBuyOrder.formType = 1
                    }

                    bulkBuyOrder.bulkPercentage = (totalData !== "" && totalData !== undefined) ? true : false

                } else {
                    let total = parseFloat(parseFloat(price) * parseFloat(amount)).toFixed(8);
                    bulkBuyOrder.push({
                        "rate": price,
                        "quantity": amount,
                        "total": (totalData !== "" && totalData !== undefined) ? totalData : total,
                        "LpType": LpType
                    })
                    bulkBuyOrder.formType = 1
                    bulkBuyOrder.bulkPercentage = (totalData !== "" && totalData !== undefined) ? true : false
                }

            }
            bulkBuyOrder.formType = 1
            this.setState({
                isBulkBuyOrder: true,
                bulkBuyOrder: bulkBuyOrder,
                isBulkSellOrder: false,
                isBothOrder:false,
                bulkSellOrder: []
            })
        } else if (isMultiple === false) {
            if (this.state.bulkBuyOrder && this.state.bulkBuyOrder.length) {
                if (price && price !== 0) {

                    this.state.bulkBuyOrder.map((item, index) => {
                        if (item.LpType === LpType) {
                            if(this.state.bulkBuyOrder.length === 1){
                                bulkBuyOrder=[]
                            }
                        } else {
                            item.formType = 1
                            bulkBuyOrder.push(item)
                        }
                        //return null
                    })

                    if (bulkBuyOrder && bulkBuyOrder.length) {
                        bulkBuyOrder.formType = 1
                        this.setState({
                            isBulkBuyOrder: true,
                            bulkBuyOrder: bulkBuyOrder,
                            isBulkSellOrder: false,
                            bulkSellOrder: [],
                            isBothOrder:false,
                        });
                    } else {

                        this.setState({
                            isBulkBuyOrder: false,
                            bulkBuyOrder: bulkBuyOrder,
                            isBothOrder:true,
                            isBulkSellOrder: false,
                            bulkSellOrder: []
                        });
                    }

                }
            } else {

                this.setState({
                    isBulkBuyOrder: false,
                    bulkBuyOrder: bulkBuyOrder,
                    isBulkSellOrder: false,
                    bulkSellOrder: [],
                    isBothOrder:false,
                });
            }
        }

        if (isMultiple === undefined) {
            if (price && price !== 0) {
               bulkBuyOrder.rate = price;
                bulkBuyOrder.quantity = "";//amount;
                bulkBuyOrder.total = ""//(totalData !== "" && totalData !== undefined) ? totalData : total;
                bulkBuyOrder.formType = 1
                bulkBuyOrder.LpType = LpType
            }
            this.setState({
                isBulkBuyOrder: false,
                bulkBuyOrder: bulkBuyOrder,
                isBulkSellOrder: false,
                bulkSellOrder: [],
                isBothOrder:false,
            });
        }

    }

    // set Sell orders for multiple or single record
    setSellOrders = (price, amount, isMultiple, totalData, LpType) => {

        var bulkSellOrder = []

        if (isMultiple === true) {

            bulkSellOrder = this.state.bulkSellOrder;

            if (price && price !== 0) {

                if (totalData !== "" && totalData !== undefined && bulkSellOrder && bulkSellOrder.length) {

                    bulkSellOrder = this.state.bulkSellOrder;
                    var isAvailable = bulkSellOrder.findIndex(fav => fav.LpType === LpType);

                    if (isAvailable !== -1) {
                        let total = parseFloat(parseFloat(price) * parseFloat(amount)).toFixed(8);
                        bulkSellOrder[isAvailable].rate = price;
                        bulkSellOrder[isAvailable].quantity = parseFloat(amount);
                        bulkSellOrder[isAvailable].total = totalData !== "" ? totalData : total;
                        bulkSellOrder[isAvailable].LpType = bulkSellOrder[isAvailable].LpType
                    } else {
                        let total = parseFloat(parseFloat(price) * parseFloat(amount)).toFixed(8);
                        bulkSellOrder.push({
                            "rate": price,
                            "quantity": parseFloat(amount),
                            "total": (totalData !== "" && totalData !== undefined) ? totalData : total,
                            "LpType": LpType
                        })
                        bulkSellOrder.formType = 2
                    }

                    bulkSellOrder.bulkPercentage = (totalData !== "" && totalData !== undefined) ? true : false

                } else {
                    let total = parseFloat(parseFloat(price) * parseFloat(amount)).toFixed(8);
                    bulkSellOrder.push({
                        "rate": price,
                        "quantity": parseFloat(amount),
                        "total": total,
                        "LpType": LpType
                    })
                    bulkSellOrder.formType = 2
                    bulkSellOrder.bulkPercentage = (totalData !== "" && totalData !== undefined) ? true : false
                }

            }

            this.setState({
                isBulkSellOrder: true,
                bulkSellOrder: bulkSellOrder,
                isBulkBuyOrder: false,
                bulkBuyOrder: [],
                isBothOrder:false,
            })

        } else if (isMultiple === false) {

            if (this.state.bulkSellOrder && this.state.bulkSellOrder.length) {
                if (price && price !== 0) {

                    this.state.bulkSellOrder.map((item, index) => {

                        if (item.LpType === LpType) {
                            if(this.state.bulkSellOrder.length === 1){
                                bulkSellOrder=[]
                            }
                        } else {
                            item.formType = 2;
                            bulkSellOrder.push(item)                            
                        }
                     //   return null
                    })
                }

                if (bulkSellOrder && bulkSellOrder.length) {
                    bulkSellOrder.formType = 2
                    this.setState({
                        isBulkBuyOrder: false,
                        bulkSellOrder: bulkSellOrder,
                        isBulkSellOrder: true,
                        bulkBuyOrder: [],
                        isBothOrder:false,
                        
                    });
                } else {

                    bulkSellOrder.formType = 2
                    this.setState({
                        isBulkBuyOrder: false,
                        bulkBuyOrder: [],
                        isBothOrder:true,
                        isBulkSellOrder: false,
                        bulkSellOrder: bulkSellOrder
                    });
                }

            } else {
                bulkSellOrder.formType = 2
                this.setState({
                    isBulkSellOrder: false,
                    bulkSellOrder: bulkSellOrder,
                    isBulkBuyOrder: false,
                    bulkBuyOrder: [],
                    isBothOrder:false,
                });
            }
        }
        if (isMultiple === undefined) {
            if (price && price !== 0) {
                let total = parseFloat(parseFloat(price) * parseFloat(amount)).toFixed(8);
                   bulkSellOrder.rate = price;
                bulkSellOrder.quantity = amount;
                bulkSellOrder.total = total;
                bulkSellOrder.formType = 2
                bulkSellOrder.LpType = LpType
                
            }
            
            this.setState({
                isBulkSellOrder: false,
                bulkSellOrder: bulkSellOrder,
                isBulkBuyOrder: false,
                bulkBuyOrder: [],
                isBothOrder:false,
            });
        }

    }

    ClearAllFields = () => {

        this.setState({
            bulkBuyOrder:[],
            bulkSellOrder:[],
            isBulkBuyOrder:false,
            isBulkSellOrder:false,
            isBothOrder:false
        })
    }

    // function for change selected currency pair
    changeCurrencyPair = (value) => {

        var pairs = "";
        if (value) {
            const oldPair = this.state.currencyPair;
            const pair = value.PairName;
            const pairId = value.PairId;
            const firstCurrency = value.Abbrevation;
            pairs = value.PairName;
            this.setState({
                firstCurrency: firstCurrency,
                currencyPair: pair,
                currencyPairID: pairId,
                UpDownBit: value.UpDownBit,
                takersValue: value.SellFees,
                makersValue: value.BuyFees,
                langDropdownOpen: !this.state.langDropdownOpen,
                bulkSellOrder: [],
                bulkBuyOrder: [],
            });
            this.state.hubConnection.invoke("AddArbitragePairSubscription", pair, oldPair)
                .catch((err) => console.error("AddArbitragePairSubscription", err));

            const tempSecondCurrency = value.PairName.split("_")[1];
            if (this.state.secondCurrency !== tempSecondCurrency) {

                this.state.hubConnection.invoke("AddArbitrageMarketSubscription", tempSecondCurrency, this.state.secondCurrency)
                    .catch((err) =>
                        console.error("AddArbitrageMarketSubscription", err)
                    );
                this.setState({
                    secondCurrency: tempSecondCurrency,
                });
            }

        } else {

        }

        // call All methods that are use in child components
        this.props.getArbitrageChartData({ Pair: pairs, Interval: '1m' });
        this.props.atbitrageBuyerBook({ Pair: pairs });
        this.props.atbitrageSellerBook({ Pair: pairs });
        this.props.arbitrageMarketTradeHistory({ Pair: pairs });
        this.props.arbitrageGetExchangeList({ Pair: pairs });

    }


    render() {
        var firstCurrencyWalletId = 0;
        var secondCurrencyWalletId = 0;

        if (this.state.Wallet.length !== 0) {
            var secondCurrencyBal = this.state.Wallet.findIndex(wallet => wallet.CoinName === this.state.secondCurrency && wallet.IsDefaultWallet === 1);
            var firstCurrencyBal = this.state.Wallet.findIndex(wallet => wallet.CoinName === this.state.firstCurrency && wallet.IsDefaultWallet === 1);

            if (secondCurrencyBal !== -1) {
                this.state.secondCurrencyBalance = this.state.Wallet[secondCurrencyBal].Balance
                secondCurrencyWalletId = this.state.Wallet[secondCurrencyBal].AccWalletID
            } else {
                this.state.secondCurrencyBalance = 0
                secondCurrencyWalletId = 0
            }

            if (firstCurrencyBal !== -1) {
                this.state.firstCurrencyBalance = this.state.Wallet[firstCurrencyBal].Balance
                firstCurrencyWalletId = this.state.Wallet[firstCurrencyBal].AccWalletID

            } else {
                this.state.firstCurrencyBalance = 0
                firstCurrencyWalletId = 0

            }
        }

        if (this.state.currentMarket) {
            this.state.currentMarket.map(value => {
                if (value.firstCurrency === this.state.firstCurrency) {
                    this.state.currentBuyPrice = value.BuyPrice,
                    this.state.currentSellPrice = value.SellPrice

                }
               // return null
            });
        }

        return (
            <Fragment>
                <div className="d-flex arbitrage_area">
                    <div className="col-md-2 col-sm-3 col-xs-12 exchange_area">
                        <PairSelection
                            {...this.props}
                            state={this.state}
                            pairData={this.state.pairList}
                            firstCurrency={this.state.firstCurrency}
                            secondCurrency={this.state.secondCurrency}
                            currencyPair={this.state.currencyPair}
                            displayFavouritePair={this.openFavourite}
                            changePairs={this.changeCurrencyPair}
                            hubConnection={this.state.hubConnection}
                        />
                        <ExchangeList
                            currencyPair={this.state.currencyPair}                            
                            autoHeightMin={370}
                            autoHeightMax={370}
                            hubConnection={this.state.hubConnection}
                            {...this.props}
                        />
                    </div>
                    <div className="col-md-10 col-sm-9 col-xs-12 buy_sell_area">
                        <div className="row">
                            <div className="col-sm-12 col-md-6 col-lg-6">
                                <h2 className="text-left">                                    
                                    <IntlMessages id="sidebar.arbitrageOrderBook" />
                                </h2>
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-6">
                                <span className="text-right">
                                <IntlMessages id="trading.holdingorder.label.balance" />
                                {": "}
                                    {this.state.secondCurrencyBalance.toFixed(8)} {" "} {this.state.secondCurrency} -- {this.state.firstCurrencyBalance.toFixed(8)} {" "} {this.state.firstCurrency}
                                </span>
                            </div>

                        </div>
                        <BuySellTrade
                            {...this.props}
                            firstCurrency={this.state.firstCurrency}
                            secondCurrency={this.state.secondCurrency}
                            currencyPair={this.state.currencyPair}
                            firstCurrencyBalance={this.state.firstCurrencyBalance}
                            secondCurrencyBalance={this.state.secondCurrencyBalance}
                            autoHeightMin={160}
                            autoHeightMax={160}
                            UpDownBit={this.state.UpDownBit}
                            hubConnection={this.state.hubConnection}
                            currencyPairID={this.state.currencyPairID}
                            state={this.state}
                            buyPrice={this.state.currentBuyPrice}
                            sellPrice={this.state.currentSellPrice}
                            bulkBuyOrder={this.state.bulkBuyOrder}
                            bulkSellOrder={this.state.bulkSellOrder}
                            isBulkBuyOrder={this.state.isBulkBuyOrder}
                            isBulkSellOrder={this.state.isBulkSellOrder}
                            firstCurrencyWalletId={firstCurrencyWalletId}
                            secondCurrencyWalletId={secondCurrencyWalletId}
                            takers={this.state.takersValue}
                            makers={this.state.makersValue}

                            setBuyOrders={this.setBuyOrders}
                            setSellOrders={this.setSellOrders}
                            isBothOrder={this.state.isBothOrder}
                            ClearAllFields={this.ClearAllFields}
                        />
                    </div>
                </div>
                <div className="col-12 mt-25">
                    <OrderTabList
                        currencyPair={this.state.currencyPair}
                        defaultTab="open_order" {...this.props}
                        hubConnection={this.state.hubConnection}
                        Wallet={this.state.Wallet}
                    />
                </div>
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    wallet: state.ArbitrageWalletReducer.walletList,
    pairList: state.arbitrageOrderBook.arbitragePairList
});

export default connect(mapStateToProps, {
    getArbitragePairList,
    getArbitrageChartData,
    atbitrageBuyerBook,
    atbitrageSellerBook,    
    getCurrencyList,    
    getArbitrageWalletList,
    arbitrageMarketTradeHistory,
    arbitrageGetExchangeList,
})(Dashboard);