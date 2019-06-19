/**
 * Author : Tejas
 * Created : 27/05/2019
 *  Arbitrage Buy & Sell order book component..
*/

import React from "react";

// used fro connect store
import { connect } from "react-redux";
// components for display 
import BuyTrade from "./BuyTrade";
import SellTrade from "./SellTrade";
import BuySellForm from "../BuySellForm";

//actions 
import { atbitrageBuyerBook, atbitrageSellerBook } from 'Actions/Arbitrage';

// used for jquery
import $ from 'jquery';

// class for handle components 
class BuySellTrade extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			sellerOrder: [],
			buyerOrder: [],
			socketBuyData: [],
			socketSellData: [],
			socketLastPriceData: [],
			lastPrice: 0,
			UpDown: 1,
			//isComponentActive:1,
			loadInterval: '',
			tempBuyOrders: [],
			tempSellOrders: [],
			buyOrderBit: 0,
			sellOrderBit: 0,
			lastPriceBuyRecord: [],
			lastPriceSellRecord: [],
			stopLimitBuyerBook: [],
			stopLimitSellerBook: [],
			LPSellerBook: [],
			socketLPSellData: [],
		};

	}

	// This will invoke After component render
	componentDidMount() {
		const pair = this.props.currencyPair;
		// code changed by devang parekh 22-2-2019
		if (this.props.hasOwnProperty('marginTrading') && this.props.marginTrading === 1) {
			this.props.atbitrageBuyerBook({ Pair: pair, marginTrading: 1 });
			this.props.atbitrageSellerBook({ Pair: pair, marginTrading: 1 });
		} else {
			this.props.atbitrageBuyerBook({ Pair: pair });
			this.props.atbitrageSellerBook({ Pair: pair });
		}
		//end
	}

	componentWillMount() {

		this.processForNormalTrading();

	}

	processForNormalTrading() {

		// code added and change by devang parekh for handling Signalr listners
		this.isComponentActive = 1;
		var self = this;
		// ========== process for buyer book order updation from signalr ===========
		// RecieveBuyerBook and store into state and update
		self.props.hubConnection.on('RecieveBuyerBookArbitrage', (receivedMessage) => {

			//console.log("RecieveBuyerBookArbitrage", receivedMessage)
			if (self.isComponentActive === 1 && receivedMessage !== null) {
				try {
					const receivedMessageData = JSON.parse(receivedMessage);

					if ((receivedMessageData.EventTime && self.state.socketBuyData.length === 0) ||
						(self.state.socketBuyData.length !== 0 && receivedMessageData.EventTime >= self.state.socketBuyData.EventTime)) {

						if (self.props.currencyPair === receivedMessageData.Parameter && typeof receivedMessageData.IsMargin !== 'undefined' && receivedMessageData.IsMargin === 0) {
							const newData = receivedMessageData.Data;

							if (parseFloat(newData.LTP) !== 0) {

								var latestBuyOrders = $.extend(true, [], self.state.buyerOrder);
								latestBuyOrders.forEach(function (buyOrder, index) { latestBuyOrders[index].UpDownBit = 0 });
								var findIndexPrice = latestBuyOrders.findIndex(buyerOrder => parseFloat(buyerOrder.LPType) === parseFloat(newData.LPType));

								if (findIndexPrice === -1) {
									//to do if want to add new exchange into it 
								} else {

									if (latestBuyOrders[findIndexPrice].LTP !== newData.LTP) {

										latestBuyOrders[findIndexPrice].LTP = newData.LTP;
										latestBuyOrders[findIndexPrice].UpDownBit = 1;
										self.setState({ buyerOrder: latestBuyOrders, socketBuyData: receivedMessageData })

									}

								}

							}

						}
					}

				} catch (error) {
					// console.log(error);
				}
			}
		});

		// ============== start code for recieve seller book from signalr ===============
		// get seller book on transaction update and store into state
		self.props.hubConnection.on('RecieveSellerBookArbitrage', (receivedMessage) => {

			//console.log("RecieveSellerBookArbitrage", receivedMessage)
			if (self.isComponentActive === 1 && receivedMessage !== null) {

				try {

					const receivedMessageData = JSON.parse(receivedMessage);
					if ((receivedMessageData.EventTime && self.state.socketSellData.length === 0) ||
						(self.state.socketSellData.length !== 0 && receivedMessageData.EventTime >= self.state.socketSellData.EventTime)) {

						if (self.props.currencyPair === receivedMessageData.Parameter && typeof receivedMessageData.IsMargin !== 'undefined' && receivedMessageData.IsMargin === 0) {

							const newData = receivedMessageData.Data;
							if (parseFloat(newData.LTP) !== 0) {
								//var latestSellOrders = self.state.sellerOrder;
								var latestSellOrders = $.extend(true, [], self.state.sellerOrder);
								var findIndexPrice = latestSellOrders.findIndex(sellerOrder => parseFloat(sellerOrder.LPType) === parseFloat(newData.LPType));

								if (findIndexPrice === -1) {
									//to do if want to add new exchange into it 
								} else {

									if (latestSellOrders[findIndexPrice].LTP !== newData.LTP) {

										latestSellOrders[findIndexPrice].LTP = newData.LTP;
										latestSellOrders[findIndexPrice].UpDownBit = 1;
										self.setState({ sellerOrder: latestSellOrders, socketSellData: receivedMessageData });

									}

								}

							}

						}

					}

				} catch (error) {
					//console.log("sell section error",error)
				}

			}

		});
		// ================ end code for seller order book process ==============================

	}

	componentWillUnmount() {
		this.isComponentActive = 0;
	}

	componentWillReceiveProps(nextprops) {

		if (nextprops.arbitrageBuyerOrder && nextprops.arbitrageBuyerOrder !== null && this.state.buyOrderBit !== nextprops.arbitrageBuyerOrderBit) {
			var lastPriceBuyRecord = {};
			var newBuyerOrderDetail = [];
			var stopLimitBuyerBook = [];
			stopLimitBuyerBook.Data = [];

			nextprops.arbitrageBuyerOrder.map(function (buyOrderDetail, buyOrderIndex) {
				if (parseFloat(buyOrderDetail.Price) === 0 && parseFloat(buyOrderDetail.Amount) > 0) {
					lastPriceBuyRecord = buyOrderDetail;
				} else if (buyOrderDetail.IsStopLimit === 1) {
					buyOrderDetail.IsAdd = 1;
					stopLimitBuyerBook.Data.push(buyOrderDetail)
				} else {
					buyOrderDetail.UpDownBit = 0;
					newBuyerOrderDetail.push(buyOrderDetail);
				}
				//return null
			});

			this.setState({
				buyerOrder: newBuyerOrderDetail,
				buyOrderBit: nextprops.arbitrageBuyerOrderBit,
				lastPriceBuyRecord: lastPriceBuyRecord,
				stopLimitBuyerBook: stopLimitBuyerBook
			});
		} else if (nextprops.arbitrageBuyerOrder && nextprops.arbitrageBuyerOrder.length === 0 && this.state.buyOrderBit !== nextprops.arbitrageBuyerOrderBit) {
			this.setState({
				buyerOrder: [],
				buyOrderBit: nextprops.arbitrageBuyerOrderBit,
				lastPriceBuyRecord: {},
				stopLimitBuyerBook: []
			});
		} else if ((nextprops.arbitrageBuyerOrder === null || typeof nextprops.arbitrageBuyerOrder === undefined) && this.state.buyOrderBit !== nextprops.arbitrageBuyerOrderBit) {

			this.setState({
				buyerOrder: [],
				buyOrderBit: nextprops.arbitrageBuyerOrderBit,
				lastPriceBuyRecord: {},
				stopLimitBuyerBook: []
			});
		}

		if (nextprops.arbitrageSellerOrder && nextprops.arbitrageSellerOrder !== null && this.state.sellOrderBit !== nextprops.arbitrageSellerOrderBit) {
			var sellerData = [];
			var lastPriceSellRecord = {};
			var stopLimitSellerBook = [];
			stopLimitSellerBook.Data = [];

			nextprops.arbitrageSellerOrder.map((newData, key) => {
				if (parseFloat(newData.Price) === 0 && parseFloat(newData.Amount) > 0) {
					lastPriceSellRecord = newData;
				} else if (newData.IsStopLimit === 1) {
					newData.IsAdd = 1;
					stopLimitSellerBook.Data.push(newData)
				} else {
					newData.UpDownBit = 0;
					sellerData.push(newData);
				}
				//return null
			});

			sellerData.sort(function (a, b) {
				return parseFloat(b.Price) - parseFloat(a.Price)
			});

			this.setState({
				sellerOrder: sellerData,
				sellOrderBit: nextprops.arbitrageSellerOrderBit,
				lastPriceSellRecord: lastPriceSellRecord,
				stopLimitSellerBook: stopLimitSellerBook,
				LPSellerBook: [],
				socketLPSellData: []
			});
		} else if (nextprops.arbitrageSellerOrder && nextprops.arbitrageSellerOrder.length === 0 && this.state.sellOrderBit !== nextprops.arbitrageSellerOrderBit) {
			this.setState({
				sellerOrder: [],
				sellOrderBit: nextprops.arbitrageSellerOrderBit,
				lastPriceSellRecord: {},
				stopLimitSellerBook: [],
				LPSellerBook: [],
				socketLPSellData: []
			});
		} else if ((nextprops.arbitrageSellerOrder === null || typeof nextprops.arbitrageSellerOrder === undefined) && this.state.sellOrderBit !== nextprops.arbitrageSellerOrderBit) {

			this.setState({
				sellerOrder: [],
				sellOrderBit: nextprops.arbitrageSellerOrderBit,
				lastPriceSellRecord: {},
				stopLimitSellerBook: [],
				LPSellerBook: [],
				socketLPSellData: []
			});
		}

		if (nextprops.currentMarketCap && nextprops.currentMarketCap.LastPrice && nextprops.currentMarketCap.LastPrice > 0) {
			this.setState({ lastPrice: nextprops.currentMarketCap.LastPrice });
		}
	}

	// set sell order 
	setSellOrders = (price, amount, isMultiple, OrderId, total, selectedValue) => {

		if (total !== "" && total !== undefined) {
			if (isMultiple === true) {

				if (this.state.sellerOrder && this.state.sellerOrder.length) {

					let sellOrderData = [];

					this.state.sellerOrder.map((sellOrder, index) => {

						sellOrder.isMultiSelect !== undefined ? sellOrder.isMultiSelect = false : sellOrder.isMultiSelect = undefined
						sellOrderData.push(sellOrder);
						//	return null
					})
				}

				if (this.state.buyerOrder && this.state.buyerOrder.length) {

					let buyOrderData = [];

					this.state.buyerOrder.map((buyOrder, index) => {

						buyOrderData.push(buyOrder)
						if (buyOrder.LPType == OrderId
							&& (buyOrder.isMultiSelect === undefined ||
								buyOrder.isMultiSelect === false)) {

							buyOrderData[index].isMultiSelect = true
							buyOrderData[index].checkedBtn = selectedValue

						} else if (buyOrder.LPType == OrderId
							&& buyOrder.isMultiSelect !== undefined &&
							buyOrder.isMultiSelect === true) {

							buyOrderData[index].checkedBtn = selectedValue
							//buyOrderData[index].isMultiSelect = false
						}
						//	return null
					})

					this.setState({ buyerOrder: buyOrderData })
				}

				this.props.setSellOrders(price, amount, isMultiple, total, OrderId)
			} else if (isMultiple === false) {

				if (this.state.sellerOrder && this.state.sellerOrder.length) {

					let sellOrderData = [];

					this.state.sellerOrder.map((sellOrder, index) => {

						sellOrder.isMultiSelect !== undefined ? sellOrder.isMultiSelect = false : sellOrder.isMultiSelect = undefined
						sellOrderData.push(sellOrder);
						//return null
					})
				}

				if (this.state.buyerOrder && this.state.buyerOrder.length) {

					let buyOrderData = [];

					this.state.buyerOrder.map((buyOrder, index) => {

						buyOrderData.push(buyOrder)
						if (buyOrder.LPType == OrderId
							&& (buyOrder.isMultiSelect === undefined ||
								buyOrder.isMultiSelect === false)) {

							buyOrderData[index].isMultiSelect = true
							buyOrderData[index].checkedBtn = 25

						} else if (buyOrder.LPType == OrderId
							&& buyOrder.isMultiSelect !== undefined &&
							buyOrder.isMultiSelect === true) {

							buyOrderData[index].isMultiSelect = false
							buyOrderData[index].checkedBtn = 25
						}
						//return null
					})

					this.setState({ buyerOrder: buyOrderData })
				}

				this.props.setSellOrders(price, amount, isMultiple, total, OrderId)
			}

			if (isMultiple === undefined) {

				let buyOrderData = [];
				let sellOrderData = [];

				if (this.state.buyerOrder && this.state.buyerOrder.length) {
					this.state.buyerOrder.map((buyOrder, index) => {

						buyOrder.isMultiSelect !== undefined ? buyOrder.isMultiSelect = false : buyOrder.isMultiSelect = undefined

						buyOrderData.push(buyOrder);
						//return null
					})
				}

				if (this.state.sellerOrder && this.state.sellerOrder.length) {
					this.state.sellerOrder.map((sellOrder, index) => {

						sellOrder.isMultiSelect !== undefined ? sellOrder.isMultiSelect = false : sellOrder.isMultiSelect = undefined
						sellOrderData.push(sellOrder);
						//return null
					})
				}

				this.setState({
					buyerOrder: buyOrderData,
					sellerOrder: sellOrderData
				})

				this.props.setSellOrders(price, amount, isMultiple, total, OrderId)
			}

		} else {

			if (isMultiple === true) {

				if (this.state.sellerOrder && this.state.sellerOrder.length) {

					let sellOrderData = [];

					this.state.sellerOrder.map((sellOrder, index) => {

						sellOrder.isMultiSelect !== undefined ? sellOrder.isMultiSelect = false : sellOrder.isMultiSelect = undefined
						sellOrderData.push(sellOrder);
						//return null
					})
				}

				if (this.state.buyerOrder && this.state.buyerOrder.length) {

					let buyOrderData = [];

					this.state.buyerOrder.map((buyOrder, index) => {

						buyOrderData.push(buyOrder)
						if (buyOrder.LPType == OrderId
							&& (buyOrder.isMultiSelect === undefined ||
								buyOrder.isMultiSelect === false)) {

							buyOrderData[index].isMultiSelect = true
							buyOrderData[index].checkedBtn = 25

						} else if (buyOrder.LPType == OrderId
							&& buyOrder.isMultiSelect !== undefined &&
							buyOrder.isMultiSelect === true) {

							buyOrderData[index].isMultiSelect = false
							buyOrderData[index].checkedBtn = 25
						}
						//return null
					})

					this.setState({ buyerOrder: buyOrderData })
				}

				this.props.setSellOrders(price, amount, isMultiple, total, OrderId)
			} else if (isMultiple === false) {

				if (this.state.sellerOrder && this.state.sellerOrder.length) {

					let sellOrderData = [];

					this.state.sellerOrder.map((sellOrder, index) => {

						sellOrder.isMultiSelect !== undefined ? sellOrder.isMultiSelect = false : sellOrder.isMultiSelect = undefined
						sellOrderData.push(sellOrder);
						//return null
					})
				}

				if (this.state.buyerOrder && this.state.buyerOrder.length) {

					let buyOrderData = [];

					this.state.buyerOrder.map((buyOrder, index) => {

						buyOrderData.push(buyOrder)
						if (buyOrder.LPType == OrderId
							&& (buyOrder.isMultiSelect === undefined ||
								buyOrder.isMultiSelect === false)) {

							buyOrderData[index].isMultiSelect = true
							buyOrderData[index].checkedBtn = 25

						} else if (buyOrder.LPType == OrderId
							&& buyOrder.isMultiSelect !== undefined &&
							buyOrder.isMultiSelect === true) {

							buyOrderData[index].isMultiSelect = false
							buyOrderData[index].checkedBtn = 25
						}
						//return null
					})

					this.setState({ buyerOrder: buyOrderData })
				}

				this.props.setSellOrders(price, amount, isMultiple, total, OrderId)
			}

			if (isMultiple === undefined) {

				let buyOrderData = [];
				let sellOrderData = [];

				if (this.state.buyerOrder && this.state.buyerOrder.length) {
					this.state.buyerOrder.map((buyOrder, index) => {

						buyOrder.isMultiSelect !== undefined ? buyOrder.isMultiSelect = false : buyOrder.isMultiSelect = undefined

						buyOrderData.push(buyOrder);
						//	return null
					})
				}

				if (this.state.sellerOrder && this.state.sellerOrder.length) {
					this.state.sellerOrder.map((sellOrder, index) => {

						sellOrder.isMultiSelect !== undefined ? sellOrder.isMultiSelect = false : sellOrder.isMultiSelect = undefined
						sellOrderData.push(sellOrder);
						//	return null
					})
				}

				this.setState({
					buyerOrder: buyOrderData,
					sellerOrder: sellOrderData
				})

				this.props.setSellOrders(price, amount, isMultiple, total, OrderId)
			}
		}

	}

	//set buy orders
	setBuyOrders = (price, amount, isMultiple, OrderId, total, selectedValue) => {

		if (total !== "" && total !== undefined) {
			if (isMultiple === true) {

				if (this.state.buyerOrder && this.state.buyerOrder.length) {

					let buyOrderData = [];

					this.state.buyerOrder.map((buyOrder, index) => {

						buyOrder.isMultiSelect !== undefined ? buyOrder.isMultiSelect = false : buyOrder.isMultiSelect = undefined
						buyOrderData.push(buyOrder);
						//return null
					})
				}

				if (this.state.sellerOrder && this.state.sellerOrder.length) {

					let sellOrderData = [];

					this.state.sellerOrder.map((sellOrder, index) => {

						sellOrderData.push(sellOrder)
						if (sellOrder.LPType == OrderId
							&& (sellOrder.isMultiSelect === undefined ||
								sellOrder.isMultiSelect === false)) {

							sellOrderData[index].isMultiSelect = true
							sellOrderData[index].checkedBtn = selectedValue

						} else if (sellOrder.LPType == OrderId
							&& sellOrder.isMultiSelect !== undefined &&
							sellOrder.isMultiSelect === true) {

							sellOrderData[index].checkedBtn = selectedValue
							//sellOrderData[index].isMultiSelect = false
						}
						//return null
					})

					this.setState({ sellerOrder: sellOrderData })
				}

				this.props.setBuyOrders(price, amount, isMultiple, total, OrderId)
			} else if (isMultiple === false) {

				if (this.state.buyerOrder && this.state.buyerOrder.length) {

					let buyOrderData = [];

					this.state.buyerOrder.map((buyOrder, index) => {

						buyOrder.isMultiSelect !== undefined ? buyOrder.isMultiSelect = false : buyOrder.isMultiSelect = undefined
						buyOrderData.push(buyOrder);
						//return null
					})
				}

				if (this.state.sellerOrder && this.state.sellerOrder.length) {

					let sellOrderData = [];

					this.state.sellerOrder.map((sellOrder, index) => {

						sellOrderData.push(sellOrder)
						if (sellOrder.LPType == OrderId
							&& (sellOrder.isMultiSelect === undefined ||
								sellOrder.isMultiSelect === false)) {

							sellOrderData[index].isMultiSelect = true
							sellOrderData[index].checkedBtn = 25

						} else if (sellOrder.LPType == OrderId
							&& sellOrder.isMultiSelect !== undefined &&
							sellOrder.isMultiSelect === true) {

							sellOrderData[index].isMultiSelect = false
							sellOrderData[index].checkedBtn = 25
						}
						//return null
					})

					this.setState({ sellerOrder: sellOrderData })
				}

				this.props.setBuyOrders(price, amount, isMultiple, total, OrderId)
			}


			if (isMultiple === undefined) {

				let buyOrderData = [];
				let sellOrderData = [];

				if (this.state.buyerOrder && this.state.buyerOrder.length) {
					this.state.buyerOrder.map((buyOrder, index) => {

						buyOrder.isMultiSelect !== undefined ? buyOrder.isMultiSelect = false : buyOrder.isMultiSelect = undefined

						buyOrderData.push(buyOrder);
						//return null
					})
				}

				if (this.state.sellerOrder && this.state.sellerOrder.length) {
					this.state.sellerOrder.map((buyOrder, index) => {

						buyOrder.isMultiSelect !== undefined ? buyOrder.isMultiSelect = false : buyOrder.isMultiSelect = undefined
						sellOrderData.push(buyOrder);
						//return null
					})
				}

				this.setState({
					buyerOrder: buyOrderData,
					sellerOrder: sellOrderData
				})

				this.props.setBuyOrders(price, amount, isMultiple, total, OrderId)
			}
		} else {
			if (isMultiple === true) {
				if (this.state.buyerOrder && this.state.buyerOrder.length) {

					let buyOrderData = [];

					this.state.buyerOrder.map((buyOrder, index) => {

						buyOrder.isMultiSelect !== undefined ? buyOrder.isMultiSelect = false : buyOrder.isMultiSelect = undefined
						buyOrderData.push(buyOrder);
						//	return null
					})
				}

				if (this.state.sellerOrder && this.state.sellerOrder.length) {

					let sellOrderData = [];

					this.state.sellerOrder.map((sellOrder, index) => {

						sellOrderData.push(sellOrder)
						if (sellOrder.LPType == OrderId
							&& (sellOrder.isMultiSelect === undefined ||
								sellOrder.isMultiSelect === false)) {

							sellOrderData[index].isMultiSelect = true
							sellOrderData[index].checkedBtn = 25

						} else if (sellOrder.LPType == OrderId
							&& sellOrder.isMultiSelect !== undefined &&
							sellOrder.isMultiSelect === true) {

							sellOrderData[index].isMultiSelect = false
							sellOrderData[index].checkedBtn = 25
						}
						//return null
					})

					this.setState({ sellerOrder: sellOrderData })
				}

				this.props.setBuyOrders(price, amount, isMultiple, total, OrderId)

			} else if (isMultiple === false) {

				if (this.state.buyerOrder && this.state.buyerOrder.length) {

					let buyOrderData = [];

					this.state.buyerOrder.map((buyOrder, index) => {

						buyOrder.isMultiSelect !== undefined ? buyOrder.isMultiSelect = false : buyOrder.isMultiSelect = undefined
						buyOrderData.push(buyOrder);
						//	return null
					})
				}

				if (this.state.sellerOrder && this.state.sellerOrder.length) {

					let sellOrderData = [];

					this.state.sellerOrder.map((sellOrder, index) => {

						sellOrderData.push(sellOrder)
						if (sellOrder.LPType == OrderId
							&& (sellOrder.isMultiSelect === undefined ||
								sellOrder.isMultiSelect === false)) {

							sellOrderData[index].isMultiSelect = true
							sellOrderData[index].checkedBtn = 25

						} else if (sellOrder.LPType == OrderId
							&& sellOrder.isMultiSelect !== undefined &&
							sellOrder.isMultiSelect === true) {

							sellOrderData[index].isMultiSelect = false
							sellOrderData[index].checkedBtn = 25
						}
						//	return null
					})

					this.setState({ sellerOrder: sellOrderData })
				}

				this.props.setBuyOrders(price, amount, isMultiple, total, OrderId)
			}


			if (isMultiple === undefined) {

				let buyOrderData = [];
				let sellOrderData = [];

				if (this.state.buyerOrder && this.state.buyerOrder.length) {
					this.state.buyerOrder.map((buyOrder, index) => {

						buyOrder.isMultiSelect !== undefined ? buyOrder.isMultiSelect = false : buyOrder.isMultiSelect = undefined

						buyOrderData.push(buyOrder);
						//return null
					})
				}

				if (this.state.sellerOrder && this.state.sellerOrder.length) {
					this.state.sellerOrder.map((buyOrder, index) => {

						buyOrder.isMultiSelect !== undefined ? buyOrder.isMultiSelect = false : buyOrder.isMultiSelect = undefined
						sellOrderData.push(buyOrder);
						//return null
					})
				}

				this.setState({
					buyerOrder: buyOrderData,
					sellerOrder: sellOrderData
				})

				this.props.setBuyOrders(price, amount, isMultiple, total, OrderId)
			}
		}



	}

	ClearAllFields = () => {

		let buyOrderData = [];
		let sellOrderData = [];

		if (this.state.buyerOrder && this.state.buyerOrder.length) {
			this.state.buyerOrder.map((buyOrder, index) => {

				buyOrder.isMultiSelect !== undefined ? buyOrder.isMultiSelect = false : buyOrder.isMultiSelect = undefined

				buyOrderData.push(buyOrder);
			})
		}

		if (this.state.sellerOrder && this.state.sellerOrder.length) {
			this.state.sellerOrder.map((buyOrder, index) => {

				buyOrder.isMultiSelect !== undefined ? buyOrder.isMultiSelect = false : buyOrder.isMultiSelect = undefined
				sellOrderData.push(buyOrder);
			})
		}

		this.setState({
			buyerOrder: buyOrderData,
			sellerOrder: sellOrderData,

		})

		this.props.ClearAllFields()
	}

	// Render Component for Buy Sell Tables
	render() {

		return (
			<div className="row buy_sell_area_inner align-items-start">
				<div className="w-40 sell_book pr-0 pl-0">
					<SellTrade
						{...this.props}
						firstCurrency={this.props.firstCurrency}
						secondCurrency={this.props.secondCurrency}
						currencyPair={this.props.currencyPair}
						firstCurrencyBalance={this.props.firstCurrencyBalance}
						secondCurrencyBalance={this.props.secondCurrencyBalance}
						autoHeightMin={340}
						autoHeightMax={340}
						setBuyOrders={this.setBuyOrders}
						setSellOrders={this.setSellOrders}
						hubConnection={this.props.hubConnection}
						sellerOrder={this.state.sellerOrder}
						bulkOrder={this.props.bulkOrder}
						sellerOrderList={this.state.sellerOrder}
					/>
				</div>
				<div className="w-20 buy_sell_form pr-0 pl-0">
					<BuySellForm
						{...this.props}
						info={this.props}
						firstCurrency={this.props.firstCurrency}
						secondCurrency={this.props.secondCurrency}
						currencyPair={this.props.currencyPair}
						currencyPairID={this.props.currencyPairID}
						state={this.props.state}
						buyPrice={this.props.currentBuyPrice}
						sellPrice={this.props.currentSellPrice}
						firstCurrencyBalance={this.props.firstCurrencyBalance}
						secondCurrencyBalance={this.props.secondCurrencyBalance}
						bulkBuyOrder={this.props.bulkBuyOrder}
						bulkSellOrder={this.props.bulkSellOrder}
						isBulkSellOrder={this.props.isBulkSellOrder}
						isBulkBuyOrder={this.props.isBulkBuyOrder}
						hubConnection={this.props.hubConnection}
						firstCurrencyWalletId={this.props.firstCurrencyWalletId}
						secondCurrencyWalletId={this.props.secondCurrencyWalletId}
						takers={this.props.takersValue}
						makers={this.props.makersValue}
						isBothOrder={this.props.isBothOrder}
						ClearAllFields={this.ClearAllFields}
					/>
				</div>
				<div className="w-40 buy_book pr-0 pl-0">
					<BuyTrade
						{...this.props}
						firstCurrency={this.props.firstCurrency}
						UpDownBit={this.props.UpDownBit}
						secondCurrency={this.props.secondCurrency}
						currencyPair={this.props.currencyPair}
						firstCurrencyBalance={this.props.firstCurrencyBalance}
						secondCurrencyBalance={this.props.secondCurrencyBalance}
						hubConnection={this.props.hubConnection}
						autoHeightMin={340}
						autoHeightMax={340}
						setSellOrders={this.setSellOrders}
						buyerOrder={this.state.buyerOrder}
						buyerOrderList={this.state.buyerOrder}
					/>
				</div>

			</div>
		);
	}
}

// Set Props when actions are dispatch
const mapStateToProps = ({ buyerOrder, sellerOrder, arbitrageOrderBook, settings, currentMarketCap }) => {
	return {
		arbitrageBuyerOrder: arbitrageOrderBook.arbitrageBuyerOrder,
		arbitrageSellerOrder: arbitrageOrderBook.arbitrageSellerOrder,
		arbitrageBuyerOrderBit: arbitrageOrderBook.arbitrageBuyerOrderBit,
		arbitrageSellerOrderBit: arbitrageOrderBook.arbitrageSellerOrderBit,

		sellerBookLoader: arbitrageOrderBook.sellerOrderLoading,
		darkMode: settings.darkMode,
		currentMarketCap: currentMarketCap.currentMarketCap,

		buyerOrder: buyerOrder.buyerOrder,
		sellerOrder: sellerOrder.sellerOrder,
		buyerOrderBit: buyerOrder.buyerOrderBit,
		sellerOrderBit: sellerOrder.sellerOrderBit,
	};

}

export default connect(mapStateToProps, {
	atbitrageSellerBook,
	atbitrageBuyerBook,
})(BuySellTrade);