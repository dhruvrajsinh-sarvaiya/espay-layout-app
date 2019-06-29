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

		// code changed by devang parekh 22-2-2019
		if (this.props.hasOwnProperty('marginTrading') && this.props.marginTrading === 1) {
			this.processForMarginTrading();
		} else {
			this.processForNormalTrading();
		}
		//end
	}

	// code for normal trading of binding buy/sell orders records
	processForNormalTrading() {
		// code added and change by devang parekh for handling Signalr listners
		this.isComponentActive = 1;

		// ========== process for buyer book order updation from signalr ===========
		// RecieveBuyerBook and store into state and update
		this.props.hubConnection.on('RecieveBuyerBookArbitrage', (receivedMessage) => {

			if (this.isComponentActive === 1 && receivedMessage !== null) {
				try {
					const receivedMessageData = JSON.parse(receivedMessage);

					if ((receivedMessageData.EventTime && this.state.socketBuyData.length === 0) ||
						(this.state.socketBuyData.length !== 0 && receivedMessageData.EventTime >= this.state.socketBuyData.EventTime)) {

						if (this.props.currencyPair === receivedMessageData.Parameter && typeof receivedMessageData.IsMargin !== 'undefined' && receivedMessageData.IsMargin === 0) {
							const newData = receivedMessageData.Data;

							if (parseFloat(newData.LTP) !== 0) {

								var latestBuyOrders = $.extend(true, [], this.state.buyerOrder);
								latestBuyOrders.forEach(function (buyOrder, index) { latestBuyOrders[index].UpDownBit = 0 });
								var findIndexPrice = latestBuyOrders.findIndex(buyerOrder => parseFloat(buyerOrder.LPType) === parseFloat(newData.LPType));

								if (findIndexPrice === -1) {
									//to do if want to add new exchange into it 
								} else {

									if (latestBuyOrders[findIndexPrice].LTP !== newData.LTP) {
										latestBuyOrders[findIndexPrice].OldLTP = latestBuyOrders[findIndexPrice].LTP;
										latestBuyOrders[findIndexPrice].LTP = newData.LTP;
										this.setState({ buyerOrder: latestBuyOrders, socketBuyData: receivedMessageData });
									}

								}

							}

						}
					}

				} catch (error) {
				}
			}
		});

		// ============== start code for recieve seller book from signalr ===============
		// get seller book on transaction update and store into state
		this.props.hubConnection.on('RecieveSellerBookArbitrage', (receivedMessage) => {

			if (this.isComponentActive === 1 && receivedMessage !== null) {

				try {

					const receivedMessageData = JSON.parse(receivedMessage);
					if ((receivedMessageData.EventTime && this.state.socketSellData.length === 0) ||
						(this.state.socketSellData.length !== 0 && receivedMessageData.EventTime >= this.state.socketSellData.EventTime)) {

						if (this.props.currencyPair === receivedMessageData.Parameter && typeof receivedMessageData.IsMargin !== 'undefined' && receivedMessageData.IsMargin === 0) {

							const newData = receivedMessageData.Data;
							if (parseFloat(newData.LTP) !== 0) {
								var latestSellOrders = $.extend(true, [], this.state.sellerOrder);
								var findIndexPrice = latestSellOrders.findIndex(sellerOrder => parseFloat(sellerOrder.LPType) === parseFloat(newData.LPType));

								if (findIndexPrice === -1) {
									//to do if want to add new exchange into it 
								} else {

									if (latestSellOrders[findIndexPrice].LTP !== newData.LTP) {
										latestSellOrders[findIndexPrice].OldLTP = latestSellOrders[findIndexPrice].LTP;
										latestSellOrders[findIndexPrice].LTP = newData.LTP;
										this.setState({ sellerOrder: latestSellOrders, socketBuyData: receivedMessageData });
									}

								}

							}

						}

					}

				} catch (error) {
				}

			}

		});

		// ================ end code for seller order book process ==============================
	}

	// code for process of margin trading records buy/sell orders bind based on dashboard
	processForMarginTrading() {
		// code added and change by devang parekh for handling Signalr listners
		this.isComponentActive = 1;

		// handling and store last price data
		this.props.hubConnection.on('RecieveLastPriceArbitrage', (receivedMessage) => {
			if (this.isComponentActive === 1 && receivedMessage !== null) {
				try {
					const marketCap = JSON.parse(receivedMessage);
					if ((marketCap.EventTime && this.state.socketLastPriceData.length === 0) ||
						(this.state.socketLastPriceData.length > 0 && marketCap.EventTime > this.state.socketLastPriceData.EventTime)) {

						if (this.props.currencyPair === marketCap.Parameter && typeof marketCap.IsMargin !== 'undefined' && marketCap.IsMargin === 1) {
							this.setState({
								lastPrice: marketCap.Data.LastPrice,
								upDownBit: marketCap.Data.UpDownBit,
								socketLastPriceData: marketCap
							});
						}
					}
				} catch (error) {
				}
			}
		});
		// ========== process for buyer book order updation from signalr ===========
		// RecieveBuyerBook and store into state and update
		this.props.hubConnection.on('RecieveSellerBookArbitrage', (receivedMessage) => {
			if (this.isComponentActive === 1 && receivedMessage !== null) {
				try {
					const receivedMessageData = JSON.parse(receivedMessage);
					if ((receivedMessageData.EventTime && this.state.socketBuyData.length === 0) ||
						(this.state.socketBuyData.length !== 0 && receivedMessageData.EventTime >= this.state.socketBuyData.EventTime)) {
						if (this.props.currencyPair === receivedMessageData.Parameter && typeof receivedMessageData.IsMargin !== 'undefined' && receivedMessageData.IsMargin === 1) {
							const newData = receivedMessageData.Data;
							if (parseFloat(newData.Price) !== 0) {
								var latestBuyOrders = $.extend(true, [], this.state.buyerOrder);
								latestBuyOrders.forEach(function (buyOrder, index) { latestBuyOrders[index].UpDownBit = 0 });
								var findIndexPrice = latestBuyOrders.findIndex(buyerOrder => parseFloat(buyerOrder.Price) === parseFloat(newData.Price));
								if (findIndexPrice === -1) {
									if (parseFloat(newData.Amount) > 0) {
										newData.UpDownBit = 1
										latestBuyOrders.push(newData)
									}
								} else {
									if (parseFloat(newData.Amount) > 0) {
										latestBuyOrders[findIndexPrice].UpDownBit = 1
										latestBuyOrders[findIndexPrice].Amount = newData.Amount
									} else {
										latestBuyOrders.splice(findIndexPrice, 1)
									}
								}
								this.setState({ buyerOrder: latestBuyOrders, socketBuyData: receivedMessageData });
							} else if (parseFloat(newData.Price) === 0 && newData.Amount >= 0) {
								this.setState({ lastPriceBuyRecord: newData, socketBuyData: receivedMessageData });
							}
						}
					}
				} catch (error) {
				}
			}
		});

		// RecieveStopLimitBuyerBook data store into state and process
		this.props.hubConnection.on('RecieveStopLimitSellerBookArbitrage', (receivedMessage) => {
			if (this.isComponentActive === 1 && receivedMessage !== null) {
				try {
					const stopLimitBuyerBook = JSON.parse(receivedMessage);
					if ((stopLimitBuyerBook.EventTime && this.state.stopLimitBuyerBook.length === 0) ||
						(this.state.stopLimitBuyerBook.length !== 0 && stopLimitBuyerBook.EventTime > this.state.stopLimitBuyerBook.EventTime)) {

						if (this.props.currencyPair === stopLimitBuyerBook.Parameter && typeof stopLimitBuyerBook.IsMargin !== 'undefined' && stopLimitBuyerBook.IsMargin === 1) {
							this.setState({ stopLimitBuyerBook: stopLimitBuyerBook });
						}
					}
				} catch (error) {
				}
			}
		});
		// ====================== end code ================================

		// ============== start code for recieve seller book from signalr ===============
		// get seller book on transaction update and store into state
		this.props.hubConnection.on('RecieveSellerBookArbitrage', (receivedMessage) => {

			if (this.isComponentActive === 1 && receivedMessage !== null) {
				try {
					const receivedMessageData = JSON.parse(receivedMessage);
					if ((receivedMessageData.EventTime && this.state.socketSellData.length === 0) ||
						(this.state.socketSellData.length !== 0 && receivedMessageData.EventTime >= this.state.socketSellData.EventTime)) {

						if (this.props.currencyPair === receivedMessageData.Parameter && typeof receivedMessageData.IsMargin !== 'undefined' && receivedMessageData.IsMargin === 1) {
							const newData = receivedMessageData.Data;
							if (parseFloat(newData.Price) !== 0) {
								var latestSellOrders = $.extend(true, [], this.state.sellerOrder);
								var findIndexPrice = latestSellOrders.findIndex(sellerOrder => parseFloat(sellerOrder.Price) === parseFloat(newData.Price));
								if (findIndexPrice === -1) {
									if (parseFloat(newData.Amount) > 0) {
										latestSellOrders.push(newData)
									}
								} else {
									if (parseFloat(newData.Amount) > 0) {
										latestSellOrders[findIndexPrice].Amount = newData.Amount
									} else {
										latestSellOrders.splice(findIndexPrice, 1)
									}
								}
								this.setState({ sellerOrder: latestSellOrders, socketSellData: receivedMessageData });
							} else if (parseFloat(newData.Price) === 0 && newData.Amount >= 0) {
								this.setState({ lastPriceSellRecord: newData, socketSellData: receivedMessageData });
							}
						}
					}
				} catch (error) {
				}
			}
		});

		// get RecieveStopLimitSellerBook and store into state and process
		this.props.hubConnection.on('RecieveStopLimitSellerBookArbitrage', (receivedMessage) => {
			if (this.isComponentActive === 1 && receivedMessage !== null) {
				try {
					const stopLimitSellerBook = JSON.parse(receivedMessage);

					if ((stopLimitSellerBook.EventTime && this.state.stopLimitSellerBook.length === 0) ||
						(this.state.stopLimitSellerBook.length !== 0 && stopLimitSellerBook.EventTime > this.state.stopLimitSellerBook.EventTime)) {

						if (this.props.currencyPair === stopLimitSellerBook.Parameter && typeof stopLimitSellerBook.IsMargin !== 'undefined' && stopLimitSellerBook.IsMargin === 1) {
							this.setState({ stopLimitSellerBook: stopLimitSellerBook });
						}
					}
				} catch (error) {
				}
			}
		});

		// get lp seller book and store into state and process
		this.props.hubConnection.on('ReceiveBulkSellerBook', (receivedMessage) => {

			if (this.isComponentActive === 1 && receivedMessage !== null) {
				try {
					const receivedMessageData = JSON.parse(receivedMessage);

					if ((receivedMessageData.EventTime && this.state.socketLPSellData.length === 0) ||
						(this.state.socketLPSellData.length !== 0 && receivedMessageData.EventTime >= this.state.socketLPSellData.EventTime)) {

						if (this.props.currencyPair === receivedMessageData.Parameter && typeof receivedMessageData.IsMargin !== 'undefined' && receivedMessageData.IsMargin === 1) {
							var LPSellerBook = $.extend(true, [], this.state.LPSellerBook);
							LPSellerBook[receivedMessageData.LP] = receivedMessageData.Data
							this.setState({ LPSellerBook: LPSellerBook, socketLPSellData: receivedMessageData });
						}
					}
				} catch (error) {
				}
			}
		});
		// ================ end code for seller order book process ==============================
	}
	// code end

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
			});

			this.setState({
				buyerOrder: newBuyerOrderDetail,
				buyOrderBit: nextprops.arbitrageBuyerOrderBit,
				lastPriceBuyRecord: lastPriceBuyRecord,
				stopLimitBuyerBook: stopLimitBuyerBook
			});
		} else if (((nextprops.arbitrageBuyerOrder === null || typeof nextprops.arbitrageBuyerOrder === 'undefined')||(nextprops.arbitrageBuyerOrder && nextprops.arbitrageBuyerOrder.length === 0)) && this.state.buyOrderBit !== nextprops.arbitrageBuyerOrderBit) {
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
		} else if (((nextprops.arbitrageSellerOrder === null || typeof nextprops.arbitrageSellerOrder === 'undefined')||(nextprops.arbitrageSellerOrder && nextprops.arbitrageSellerOrder.length === 0)) && this.state.sellOrderBit !== nextprops.arbitrageSellerOrderBit) {
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

				if (this.state.buyerOrder && this.state.buyerOrder.length) {

					let buyOrderData = [];

					this.state.buyerOrder.map((buyOrder, index) => {

						buyOrderData.push(buyOrder)
						if (buyOrder.LPType == OrderId
							&& (buyOrder.isMultiSelect === 'undefined' ||
								buyOrder.isMultiSelect === false)) {

							buyOrderData[index].isMultiSelect = true
							buyOrderData[index].checkedBtn = selectedValue

						} else if (buyOrder.LPType == OrderId
							&& buyOrder.isMultiSelect !== undefined &&
							buyOrder.isMultiSelect === true) {

							buyOrderData[index].checkedBtn = selectedValue
						}
					})

					this.setState({ buyerOrder: buyOrderData })
				}

				this.props.setSellOrders(price, amount, isMultiple, total, OrderId)
			} else if (isMultiple === false) {

				if (this.state.buyerOrder && this.state.buyerOrder.length) {

					let buyOrderData = [];

					this.state.buyerOrder.map((buyOrder, index) => {

						buyOrderData.push(buyOrder)
						if (buyOrder.LPType == OrderId
							&& (buyOrder.isMultiSelect === 'undefined' ||
								buyOrder.isMultiSelect === false)) {

							buyOrderData[index].isMultiSelect = true
							buyOrderData[index].checkedBtn = 25

						} else if (buyOrder.LPType == OrderId
							&& buyOrder.isMultiSelect !== undefined &&
							buyOrder.isMultiSelect === true) {

							buyOrderData[index].isMultiSelect = false
							buyOrderData[index].checkedBtn = 25
						}
					})

					this.setState({ buyerOrder: buyOrderData })
				}

				this.props.setSellOrders(price, amount, isMultiple, total, OrderId)
			}

			if (isMultiple === 'undefined') {

				let buyOrderData = [];
				let sellOrderData = [];

				if (this.state.buyerOrder && this.state.buyerOrder.length) {
					this.state.buyerOrder.map((buyOrder, index) => {

						buyOrder.isMultiSelect !== undefined ? buyOrder.isMultiSelect = false : buyOrder.isMultiSelect = undefined

						buyOrderData.push(buyOrder);
					})
				}

				if (this.state.sellerOrder && this.state.sellerOrder.length) {
					this.state.sellerOrder.map((sellOrder, index) => {

						sellOrder.isMultiSelect !== undefined ? sellOrder.isMultiSelect = false : sellOrder.isMultiSelect = undefined
						sellOrderData.push(sellOrder);
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

				if (this.state.buyerOrder && this.state.buyerOrder.length) {

					let buyOrderData = [];

					this.state.buyerOrder.map((buyOrder, index) => {

						buyOrderData.push(buyOrder)
						if (buyOrder.LPType == OrderId
							&& (buyOrder.isMultiSelect === 'undefined' ||
								buyOrder.isMultiSelect === false)) {

							buyOrderData[index].isMultiSelect = true
							buyOrderData[index].checkedBtn = 25

						} else if (buyOrder.LPType == OrderId
							&& buyOrder.isMultiSelect !== undefined &&
							buyOrder.isMultiSelect === true) {

							buyOrderData[index].isMultiSelect = false
							buyOrderData[index].checkedBtn = 25
						}
					})

					this.setState({ buyerOrder: buyOrderData })
				}

				this.props.setSellOrders(price, amount, isMultiple, total, OrderId)
			} else if (isMultiple === false) {

				if (this.state.buyerOrder && this.state.buyerOrder.length) {

					let buyOrderData = [];

					this.state.buyerOrder.map((buyOrder, index) => {

						buyOrderData.push(buyOrder)
						if (buyOrder.LPType == OrderId
							&& (buyOrder.isMultiSelect === 'undefined' ||
								buyOrder.isMultiSelect === false)) {

							buyOrderData[index].isMultiSelect = true
							buyOrderData[index].checkedBtn = 25

						} else if (buyOrder.LPType == OrderId
							&& buyOrder.isMultiSelect !== undefined &&
							buyOrder.isMultiSelect === true) {

							buyOrderData[index].isMultiSelect = false
							buyOrderData[index].checkedBtn = 25
						}
					})

					this.setState({ buyerOrder: buyOrderData })
				}

				this.props.setSellOrders(price, amount, isMultiple, total, OrderId)
			}

			if (isMultiple === 'undefined') {

				let buyOrderData = [];
				let sellOrderData = [];

				if (this.state.buyerOrder && this.state.buyerOrder.length) {
					this.state.buyerOrder.map((buyOrder, index) => {

						buyOrder.isMultiSelect !== undefined ? buyOrder.isMultiSelect = false : buyOrder.isMultiSelect = undefined

						buyOrderData.push(buyOrder);
					})
				}

				if (this.state.sellerOrder && this.state.sellerOrder.length) {
					this.state.sellerOrder.map((sellOrder, index) => {

						sellOrder.isMultiSelect !== undefined ? sellOrder.isMultiSelect = false : sellOrder.isMultiSelect = undefined
						sellOrderData.push(sellOrder);
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

				if (this.state.sellerOrder && this.state.sellerOrder.length) {

					let sellOrderData = [];

					this.state.sellerOrder.map((sellOrder, index) => {

						sellOrderData.push(sellOrder)
						if (sellOrder.LPType == OrderId
							&& (sellOrder.isMultiSelect === 'undefined' ||
								sellOrder.isMultiSelect === false)) {

							sellOrderData[index].isMultiSelect = true
							sellOrderData[index].checkedBtn = selectedValue

						} else if (sellOrder.LPType == OrderId
							&& sellOrder.isMultiSelect !== undefined &&
							sellOrder.isMultiSelect === true) {

							sellOrderData[index].checkedBtn = selectedValue
						}
					})

					this.setState({ sellerOrder: sellOrderData })
				}

				this.props.setBuyOrders(price, amount, isMultiple, total, OrderId)
			} else if (isMultiple === false) {

				if (this.state.sellerOrder && this.state.sellerOrder.length) {

					let sellOrderData = [];

					this.state.sellerOrder.map((sellOrder, index) => {

						sellOrderData.push(sellOrder)
						if (sellOrder.LPType == OrderId
							&& (sellOrder.isMultiSelect === 'undefined' ||
								sellOrder.isMultiSelect === false)) {

							sellOrderData[index].isMultiSelect = true
							sellOrderData[index].checkedBtn = 25

						} else if (sellOrder.LPType == OrderId
							&& sellOrder.isMultiSelect !== undefined &&
							sellOrder.isMultiSelect === true) {

							sellOrderData[index].isMultiSelect = false
							sellOrderData[index].checkedBtn = 25
						}
					})

					this.setState({ sellerOrder: sellOrderData })
				}

				this.props.setBuyOrders(price, amount, isMultiple, total, OrderId)
			}


			if (isMultiple === 'undefined') {

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
					sellerOrder: sellOrderData
				})

				this.props.setBuyOrders(price, amount, isMultiple, total, OrderId)
			}
		} else {
			if (isMultiple === true) {

				if (this.state.sellerOrder && this.state.sellerOrder.length) {

					let sellOrderData = [];

					this.state.sellerOrder.map((sellOrder, index) => {

						sellOrderData.push(sellOrder)
						if (sellOrder.LPType == OrderId
							&& (sellOrder.isMultiSelect === 'undefined' ||
								sellOrder.isMultiSelect === false)) {

							sellOrderData[index].isMultiSelect = true
							sellOrderData[index].checkedBtn = 25

						} else if (sellOrder.LPType == OrderId
							&& sellOrder.isMultiSelect !== undefined &&
							sellOrder.isMultiSelect === true) {

							sellOrderData[index].isMultiSelect = false
							sellOrderData[index].checkedBtn = 25
						}
					})

					this.setState({ sellerOrder: sellOrderData })
				}

				this.props.setBuyOrders(price, amount, isMultiple, total, OrderId)

			} else if (isMultiple === false) {

				if (this.state.sellerOrder && this.state.sellerOrder.length) {

					let sellOrderData = [];

					this.state.sellerOrder.map((sellOrder, index) => {

						sellOrderData.push(sellOrder)
						if (sellOrder.LPType == OrderId
							&& (sellOrder.isMultiSelect === 'undefined' ||
								sellOrder.isMultiSelect === false)) {

							sellOrderData[index].isMultiSelect = true
							sellOrderData[index].checkedBtn = 25

						} else if (sellOrder.LPType == OrderId
							&& sellOrder.isMultiSelect !== undefined &&
							sellOrder.isMultiSelect === true) {

							sellOrderData[index].isMultiSelect = false
							sellOrderData[index].checkedBtn = 25
						}
					})

					this.setState({ sellerOrder: sellOrderData })
				}

				this.props.setBuyOrders(price, amount, isMultiple, total, OrderId)
			}


			if (isMultiple === 'undefined') {

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

		const { buyerOrder, sellerOrder, lastPriceBuyRecord, lastPriceSellRecord, lastPrice, stopLimitBuyerBook, stopLimitSellerBook, LPSellerBook } = this.state;
		var buyOrderDetail = $.extend(true, [], buyerOrder);
		var lastPriceBuyRecordDetail = $.extend(true, [], lastPriceBuyRecord);
		var stopLimitBuyerBookList = $.extend(true, [], stopLimitBuyerBook.Data);

		if (lastPrice > 0 && lastPriceBuyRecordDetail && lastPriceBuyRecordDetail.Amount > 0) {
			var findLastPriceIndex = buyOrderDetail.findIndex(buyerOrder => parseFloat(buyerOrder.Price) === parseFloat(lastPrice));

			if (findLastPriceIndex === -1) {
				lastPriceBuyRecordDetail.UpDownBit = 1;
				lastPriceBuyRecordDetail.Price = lastPrice;
				buyOrderDetail.push(lastPriceBuyRecordDetail)
			} else {
				buyOrderDetail[findLastPriceIndex].UpDownBit = 1
				buyOrderDetail[findLastPriceIndex].Amount = buyOrderDetail[findLastPriceIndex].Amount + lastPriceBuyRecordDetail.Amount;
			}
		}

		if (stopLimitBuyerBookList && stopLimitBuyerBookList.length > 0) {
			stopLimitBuyerBookList.map((stopLimitOrder, indexValue) => {
				if (stopLimitOrder.IsAdd && stopLimitOrder.IsAdd === 1) {
					var findStopLimitIndex = buyOrderDetail.findIndex(buyerOrder => parseFloat(buyerOrder.Price) === parseFloat(stopLimitOrder.Price));

					if (findStopLimitIndex === -1) {
						stopLimitOrder.UpDownBit = 1;
						buyOrderDetail.push(stopLimitOrder)
					} else {
						buyOrderDetail[findStopLimitIndex].UpDownBit = 1
						buyOrderDetail[findStopLimitIndex].Amount = buyOrderDetail[findStopLimitIndex].Amount + stopLimitOrder.Amount;
					}
				}
			});
		}

		this.state.tempBuyOrders = buyOrderDetail

		var lastPriceSellRecordDetail = $.extend(true, [], lastPriceSellRecord);
		var sellOrderDetail = $.extend(true, [], sellerOrder);
		var stopLimitSellerBookList = $.extend(true, [], stopLimitSellerBook.Data);
		var LPSellerBookList = $.extend(true, [], LPSellerBook);

		if (lastPrice > 0 && lastPriceSellRecordDetail && lastPriceSellRecordDetail.Amount > 0) {
			var findLastPriceIndex = sellOrderDetail.findIndex(sellerOrder => parseFloat(sellerOrder.Price) === parseFloat(lastPrice));
			if (findLastPriceIndex === -1) {
				lastPriceSellRecordDetail.UpDownBit = 1;
				lastPriceSellRecordDetail.Price = lastPrice;
				sellOrderDetail.push(lastPriceSellRecordDetail)
			} else {
				sellOrderDetail[findLastPriceIndex].UpDownBit = 1
				sellOrderDetail[findLastPriceIndex].Amount = sellOrderDetail[findLastPriceIndex].Amount + lastPriceSellRecordDetail.Amount;
			}
		}

		if (stopLimitSellerBookList && stopLimitSellerBookList.length > 0) {
			stopLimitSellerBookList.map((stopLimitOrder, indexValue) => {
				if (stopLimitOrder.IsAdd && stopLimitOrder.IsAdd === 1) {
					var findStopLimitIndex = sellOrderDetail.findIndex(sellerOrder => parseFloat(sellerOrder.Price) === parseFloat(stopLimitOrder.Price));
					if (findStopLimitIndex === -1) {
						stopLimitOrder.UpDownBit = 1;
						sellOrderDetail.push(stopLimitOrder)
					} else {
						sellOrderDetail[findStopLimitIndex].UpDownBit = 1
						sellOrderDetail[findStopLimitIndex].Amount = sellOrderDetail[findStopLimitIndex].Amount + stopLimitOrder.Amount;
					}

				}
			});
		}

		if (LPSellerBookList && LPSellerBookList.length > 0) {
			LPSellerBookList.forEach(function (LPSellerBook, index) {
				LPSellerBook.map((LPSellOrder, indexValue) => {
					var findLPIndex = sellOrderDetail.findIndex(sellerOrder => parseFloat(sellerOrder.Price) === parseFloat(LPSellOrder.Price));
					if (findLPIndex === -1) {
						LPSellOrder.UpDownBit = 1;
						sellOrderDetail.push(LPSellOrder)
					} else {
						sellOrderDetail[findLPIndex].UpDownBit = 1
						sellOrderDetail[findLPIndex].Amount = sellOrderDetail[findLPIndex].Amount + LPSellOrder.Amount;
					}
				});
			});
		}
		this.state.tempSellOrders = sellOrderDetail;

		if (this.state.lastPrice !== 'undefined' && this.state.lastPrice !== 0) {
			var firstPrice = parseFloat(this.state.lastPrice).toFixed(8);
		} else {
			var firstPrice = parseFloat(0).toFixed(8);
		}

		return (
			<div className="buy_sell_area_inner align-items-start">
				<div className="w-40 sell_book pr-0 pl-0">
					<SellTrade
						{...this.props}
						firstCurrency={this.props.firstCurrency}
						secondCurrency={this.props.secondCurrency}
						currencyPair={this.props.currencyPair}
						firstCurrencyBalance={this.props.firstCurrencyBalance}
						secondCurrencyBalance={this.props.secondCurrencyBalance}
						autoHeightMin={350}
						autoHeightMax={350}
						setBuyOrders={this.setBuyOrders}
						setSellOrders={this.setSellOrders}
						hubConnection={this.props.hubConnection}
						sellerOrder={this.state.sellerOrder}
						bulkOrder={this.props.bulkOrder}
						sellerOrderList={this.state.tempSellOrders}
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
						autoHeightMin={350}
						autoHeightMax={350}
						setSellOrders={this.setSellOrders}
						buyerOrder={this.state.buyerOrder}
						buyerOrderList={this.state.tempBuyOrders}
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