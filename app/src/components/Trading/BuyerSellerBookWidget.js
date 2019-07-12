import React, { Component } from 'react';
import { View, FlatList, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';
import { fetchBuyerBookList } from '../../actions/Trade/BuyerBookActions';
import { isCurrentScreen } from '../Navigation';
import { changeTheme, parseArray, addListener, sendEvent, parseFloatVal } from '../../controllers/CommonUtils';
import { contentContainerStyle, ListEmptyComponent } from '../../native_theme/components/FlatListWidgets';
import { validateResponseNew, isInternet } from '../../validations/CommonValidation';
import { Method, Constants, Events } from '../../controllers/Constants';
import { fetchSellerBookList } from '../../actions/Trade/SellerBookActions';
import R from '../../native_theme/R';
import arraySort from 'array-sort';
import ImageButton from '../../native_theme/components/ImageTextButton';
import ListLoader from '../../native_theme/components/ListLoader';
import TextViewHML from '../../native_theme/components/TextViewHML';
import { AppConfig } from '../../controllers/AppConfig';
import SafeView from '../../native_theme/components/SafeView';
import AnimatableItem from '../../native_theme/components/AnimatableItem';

class BuyerSellerBookWidget extends Component {

	//Define All initial State
	state = {
		lastPrice: 0,
		buyerbookdata: null,
		sellerbookdata: null,
		isDetail: false,
		buyerBookList: [],
		sellerBookList: [],
		buyerBookMerge: [],
		sellerBookMerge: [],
		LPSellerBook: [],
		socketLastPriceData: [],
		stopLimitBuyerBook: [],
		socketBuyData: [],
		socketSellData: [],
		socketLPSellData: [],
		stopLimitSellerBook: [],
		side: R.strings.sides[0].value,
		sides: R.strings.sides,
		decimalPoint: 8,
	}

	constructor(props) {
		super(props);

		// Bind All Methods
		this.onPressDecimalIncrese = this.onPressDecimalIncrese.bind(this);
		this.onPressDecimalDecrese = this.onPressDecimalDecrese.bind(this);
		this.onPressSetSellData = this.onPressSetSellData.bind(this);
		this.onPressSetBuyData = this.onPressSetBuyData.bind(this);
	}

	shouldComponentUpdate(nextProps, nextState) {
		//If theme or locale is changed then update componenet
		if (this.props.preference.theme !== nextProps.preference.theme ||
			this.props.preference.locale !== nextProps.preference.locale) {
			return true;
		} else {

			if (this.state.buyerBookList !== nextState.buyerBookList || this.state.sellerBookList !== nextState.sellerBookList) {
				return true;
			}
			// stop twice api call 
			else if (this.props.marketCapData.marketCap !== nextProps.marketCapData.marketCap ||
				this.props.buyerBook.buyerBookData !== nextProps.buyerBook.buyerBookData ||
				this.props.buyerBook.isFetchingBuyerBook !== nextProps.buyerBook.isFetchingBuyerBook ||
				this.props.sellerBook.isFetchingSellerBook !== nextProps.sellerBook.isFetchingSellerBook ||
				this.state.decimalPoint !== nextState.decimalPoint ||
				this.props.sellerBook.sellerBookData !== nextProps.sellerBook.sellerBookData ||
				this.state.sellerBookList !== nextState.sellerBookList ||
				this.state.buyerBookList !== nextState.buyerBookList ||
				this.state.lastPrice !== nextState.lastPrice) {
				return isCurrentScreen(nextProps);
			} else {
				return false;
			}
		}
	};

	async componentDidMount() {
		//Add this method to change theme based on stored theme name.
		changeTheme();

		//Check NetWork is Available or not
		if (this.state.isDetail && await isInternet()) {

			var { buyerBook: { isFetchingBuyerBook }, sellerBook: { isFetchingSellerBook }, } = this.props;

			if (!isFetchingBuyerBook) {
				// Call BuyerBooklist api
				this.props.fetchBuyerBookList({ Pair: this.props.PairName ? this.props.PairName : AppConfig.initialPair });
			}

			if (!isFetchingSellerBook) {
				// Call SellerBooklist api
				this.props.fetchSellerBookList({ Pair: this.props.PairName ? this.props.PairName : AppConfig.initialPair });
			}
		}

		// Handle Signal-R response for RecieveLastPrice
		this.listenerRecieveLastPrice = addListener(Method.RecieveLastPrice, (receivedMessage) => {

			try {
				let response = JSON.parse(receivedMessage);

				if ((response.EventTime && this.state.socketLastPriceData.length === 0) || (this.state.socketLastPriceData.length > 0 && response.EventTime > this.state.socketLastPriceData.EventTime)) {
					if (this.props.PairName === response.Parameter && typeof response.IsMargin !== 'undefined' && response.IsMargin === 0) {
						this.setState({ lastPrice: response.Data.LastPrice, socketLastPriceData: response, });
					}
				}
			} catch (_error) {
				// logger(Method.RecieveLastPrice + _error.message);
			}
		})

		// Handle Signal-R response for BuyerBook
		this.listenerRecieveBuyerBook = addListener(Method.RecieveBuyerBook, (receivedMessage) => {

			try {
				let response = JSON.parse(receivedMessage);

				if ((response.EventTime && this.state.socketBuyData.length == 0) || (this.state.socketBuyData.length !== 0 && response.EventTime >= this.state.socketBuyData.EventTime)) {

					if (this.props.PairName === response.Parameter && typeof response.IsMargin !== 'undefined' && response.IsMargin === 0) {
						this.setState({ ...this.amountValidation(true, response), socketBuyData: response, });
					}
				}
			} catch (_error) {
				//parsing error
				// logger('RecieveBuyerBook Error : ' + _error.message);
			}
		})

		// Handle Signal-R response for StopLimitBuyerBook
		this.listenerRecieveStopLimitBuyerBook = addListener(Method.RecieveStopLimitBuyerBook, (receivedMessage) => {

			try {
				let response = JSON.parse(receivedMessage);

				if ((response.EventTime && this.state.stopLimitBuyerBook.length === 0) || (this.state.stopLimitBuyerBook.length !== 0 && response.EventTime > this.state.stopLimitBuyerBook.EventTime)) {
					if (this.props.PairName === response.Parameter && typeof response.IsMargin !== 'undefined' && response.IsMargin === 0) {

						//Stop Limit Add/Remove validation of response array
						this.setState({ ...this.stopLimitValidation(true, response), stopLimitBuyerBook: response, });
					}
				}

			} catch (_error) {
				//parsing error
				// logger('RecieveStopLimitBuyerBook Error : ' + _error.message);
			}
		})

		// Handle Signal-R response for SellerBook
		this.listenerRecieveSellerBook = addListener(Method.RecieveSellerBook, (receivedMessage) => {

			try {
				let response = JSON.parse(receivedMessage);

				if ((response.EventTime && this.state.socketSellData.length == 0) || (this.state.socketSellData.length !== 0 && response.EventTime >= this.state.socketSellData.EventTime)) {
					if (this.props.PairName === response.Parameter && typeof response.IsMargin !== 'undefined' && response.IsMargin === 0) {
						this.setState({ ...this.amountValidation(false, response), socketSellData: response, });
					}
				}

			} catch (_error) {
				//parsing error
				// logger('RecieveSellerBook Error : ' + _error.message);
			}
		})

		// Handle Signal-R response for StopLimitSellerBook
		this.listenerRecieveStopLimitSellerBook = addListener(Method.RecieveStopLimitSellerBook, (receivedMessage) => {

			try {
				let response = JSON.parse(receivedMessage);

				if ((response.EventTime && this.state.stopLimitSellerBook.length === 0) || (this.state.stopLimitSellerBook.length !== 0 && response.EventTime > this.state.stopLimitSellerBook.EventTime)) {
					if (this.props.PairName === response.Parameter && typeof response.IsMargin !== 'undefined' && response.IsMargin === 0) {
						//Stop Limit Add/Remove validation of response array
						this.setState({ ...this.stopLimitValidation(false, response), stopLimitSellerBook: response, });
					}
				}
			} catch (_error) {
				//parsing error
				// logger('RecieveStopLimitSellerBook Error : ' + _error.message);
			}
		})

		// Handle Signal-R response for BulkSellerBook
		this.listenerReceiveBulkSellerBook = addListener(Method.ReceiveBulkSellerBook, (receivedMessage) => {

			try {
				let response = JSON.parse(receivedMessage);
				if ((response.EventTime && this.state.socketLPSellData.length == 0) || (this.state.socketLPSellData.length !== 0 && response.EventTime >= this.state.socketLPSellData.EventTime)) {
					if (this.props.PairName === response.Parameter && typeof response.IsMargin !== 'undefined' && response.IsMargin === 0) {
						let LPSellerBook = this.state.LPSellerBook;
						LPSellerBook[response.LP] = response.Data;

						let sellerBookList = this.state.sellerBookList;

						if (LPSellerBook.length > 0) {
							LPSellerBook.forEach((item) => {
								let findLPIndex = sellerBookList.findIndex(sellerOrder => parseFloatVal(sellerOrder.Price) === parseFloatVal(item.Price));

								if (findLPIndex === -1) {
									sellerBookList.push(item);
								} else {
									sellerBookList[findLPIndex].Amount = sellerBookList[findLPIndex].Amount + item.Amount;
								}
							})
						}
						//Sorting array based on Price
						let res = arraySort(parseArray(sellerBookList), 'Price', { reverse: true });

						this.setState({ LPSellerBook, socketLPSellData: response, sellerBookList: res })
					}
				}

			} catch (error) {
				//parsing error
				// logger('ReceiveBulkSellerBook Error : ' + _error.message)
			}
		})

	};

	componentWillUnmount() {

		// Remove Listener

		if (this.listenerRecieveBuyerBook) {
			this.listenerRecieveBuyerBook.remove();
		}
		if (this.listenerRecieveLastPrice) {
			this.listenerRecieveLastPrice.remove();
		}
		if (this.listenerRecieveStopLimitBuyerBook) {
			this.listenerRecieveStopLimitBuyerBook.remove();
		}

		if (this.listenerRecieveStopLimitSellerBook) {
			this.listenerRecieveStopLimitSellerBook.remove();
		}
		if (this.listenerRecieveSellerBook) {
			this.listenerRecieveSellerBook.remove();
		}
		if (this.listenerReceiveBulkSellerBook) {
			this.listenerReceiveBulkSellerBook.remove();
		}
	}

	static getDerivedStateFromProps(props, state) {

		if ((props.shouldDisplay && isCurrentScreen(props)) || isCurrentScreen(props)) {

			if (props.isDetail && (props.isDetail !== state.isDetail)) {
				return Object.assign({}, state, {
					isDetail: props.isDetail,
				});
			}

			try {
				//Get All Updated field of Particular actions
				const { marketCapData: { marketCap }, buyerBook: { buyerBookData }, sellerBook: { sellerBookData }, } = props

				// To check marketCap is null or not
				if (marketCap) {

					//if marketCap is null or old and new data of tradeHistory  and response is different then validate it
					if (state.marketCap == null || (state.marketCap != null && marketCap !== state.marketCap)) {
						validateResponseNew({ response: marketCap, isList: true })

						if (marketCap.response != null) {
							return Object.assign({}, state, {
								marketCap,
								lastPrice: parseFloatVal(marketCap.response.LastPrice).toFixed(8),
							})
						} else {
							return Object.assign({}, state, {
								marketCap,
							})
						}
					}
				}

				// To check buyerbookdata is null or not
				if (buyerBookData) {

					//if local buyerbookdata state is null or its not null and also different then new response then and only then validate response.
					if (state.buyerBookData == null || (state.buyerBookData != null && buyerBookData !== state.buyerBookData)) {

						if (validateResponseNew({ response: buyerBookData, isList: true })) {

							let stopLimitOrders = [];

							//Check for all records for IsStopLimit 1
							buyerBookData.response.map((buyerSellerItem) => {
								//If item is regular than add in buyerSellerList
								if (buyerSellerItem.IsStopLimit == 1) {
									stopLimitOrders.push(buyerSellerItem);
								}
							});

							return Object.assign({}, state, {
								buyerBookData,
								buyerBookMerge: stopLimitOrders,
								...priceValidation(true, buyerBookData.response, {}, state.lastPrice)
							});
						} else {
							return Object.assign({}, state, {
								buyerBookData,
								buyerBookList: []
							})
						}
					}
				}

				// To check sellerbookdata is null or not
				if (sellerBookData) {

					//if local sellerbookdata state is null or its not null and also different then new response then and only then validate response.
					if (state.sellerBookData == null || (state.sellerBookData != null && sellerBookData !== state.sellerBookData)) {

						if (validateResponseNew({ response: sellerBookData, isList: true })) {

							let stopLimitOrders = [];

							//Check for all records for IsStopLimit 1
							sellerBookData.response.map((buyerSellerItem) => {
								//If item is regular than add in buyerSellerList
								if (buyerSellerItem.IsStopLimit == 1) {
									stopLimitOrders.push(buyerSellerItem);
								}
							});

							return Object.assign({}, state, {
								sellerBookData,
								sellerBookMerge: stopLimitOrders,
								...priceValidation(false, sellerBookData.response, {}, state.lastPrice)
							})
						} else {
							return Object.assign({}, state, {
								sellerBookData,
								sellerBookList: []
							})
						}
					}
				}
			} catch (error) {
				return null;
			}
		}
		return null;
	}

	stopLimitValidation(isBuyer, receivedMessage) {

		//if connection has data
		if (receivedMessage.Data) {

			let newData = receivedMessage.Data;

			//if data array is not empty
			if (newData.length > 0) {

				//get latest list of buyer/seller book list
				let latestOrderList = this.state[isBuyer ? 'buyerBookList' : 'sellerBookList'];

				//Iterate through all received items
				newData.map(stopLimitItem => {

					//find index of same price record
					var findIndexPrice = latestOrderList.findIndex(order => parseFloatVal(order.Price) === parseFloatVal(stopLimitItem.Price));

					//if found index than proceed with plus/minus operation
					if (findIndexPrice > -1) {

						//if isAdd bit is 1 then add amount in existing amount
						if (stopLimitItem.IsAdd == 1) {
							latestOrderList[findIndexPrice].Amount += stopLimitItem.Amount;
						}

						//if isAdd bit is 0 then minus amount in existing amount
						if (stopLimitItem.IsAdd == 0) {
							latestOrderList[findIndexPrice].Amount -= stopLimitItem.Amount;
						}
					} else {

						if (stopLimitItem.IsAdd == 1) {
							//If record is not found then add item in list
							latestOrderList.push(stopLimitItem);
						}
					}
				});

				//verify through price validations
				return priceValidation(isBuyer, latestOrderList, {}, this.state.lastPrice);
			}
		}
		return {};
	}

	amountValidation(isBuyer, receivedMessage) {

		//if connection has data
		if (receivedMessage.Data) {

			let newData = receivedMessage.Data;

			if (parseFloatVal(newData.Price) !== 0) {

				//get latest list
				let latestOrderList = this.state[isBuyer ? 'buyerBookList' : 'sellerBookList'];

				//find index of same price record
				var findIndexPrice = latestOrderList.findIndex(order => parseFloatVal(order.Price) === parseFloatVal(newData.Price));

				//if same price record is not found then check for amount validation
				if (findIndexPrice === -1) {
					//if amount of new record is greater then 0 then add to list
					if (parseFloatVal(newData.Amount) > 0) {

						latestOrderList.push(newData)
					}

				} else {

					//if amount of new record is greater then 0 then update amount in existing record
					if (parseFloatVal(newData.Amount) > 0) {

						//Get StopLimit and Limit Merged Records
						let mergedList = this.state[isBuyer ? 'buyerBookMerge' : 'sellerBookMerge'];

						//Find index of Stoplimit Price record for new record
						let stopLimitPriceMergedIndex = mergedList.findIndex(el => el.Price == newData.Price);

						//If record found than add amount in existing amount otherwise replace amount
						if (stopLimitPriceMergedIndex > -1) {
							latestOrderList[findIndexPrice].Amount = latestOrderList[findIndexPrice].Amount + newData.Amount;
						} else {
							latestOrderList[findIndexPrice].Amount = newData.Amount;
						}

					} else {

						//remove record if its amount is not greater than 0
						latestOrderList.splice(findIndexPrice, 1);
					}
				}

				return priceValidation(isBuyer, latestOrderList, {}, this.state.lastPrice);
			} else if (parseFloatVal(newData.Price) === 0 && newData.Amount >= 0) {

				//get latest list
				let latestOrderList = this.state[isBuyer ? 'buyerBookList' : 'sellerBookList'];

				//as we got 0 price record from signalR so we are passing third argument
				return priceValidation(isBuyer, latestOrderList, newData, this.state.lastPrice)
			}
		}

		return {};
	}

	// Decrese decimal point
	onPressDecimalDecrese() {
		let decimalPoint = this.state.decimalPoint - 1;
		if (decimalPoint > 0) {
			this.setState({ decimalPoint })
		}
	}

	// Increase decimal point
	onPressDecimalIncrese() {
		let decimalPoint = this.state.decimalPoint + 1;
		if (decimalPoint <= 8) {
			this.setState({ decimalPoint })
		}
	}

	//To set data in Sell Widget
	onPressSetSellData(item) {
		try {
			sendEvent(Events.BuySellInput, { module: Constants.TradeTypes.Sell, ...item });
		} catch (e) {
			//handle catch
		}
	}

	//To set data in Buy Widget
	onPressSetBuyData(item) {
		try {
			sendEvent(Events.BuySellInput, { module: Constants.TradeTypes.Buy, ...item });
		} catch (e) {
			//handle catch
		}
	}

	render() {
		// updated data get from props 
		var { buyerBook: { isFetchingBuyerBook }, sellerBook: { isFetchingSellerBook } } = this.props;

		let isSellerBook = false;
		let isBuyerBook = false;

		//if seller or default is selected then it will be true otherwise false
		isSellerBook = (this.state.side === this.state.sides[0].value || this.state.side === this.state.sides[1].value);

		//if buyer or default is selected then it will be true otherwise false
		isBuyerBook = (this.state.side === this.state.sides[0].value || this.state.side === this.state.sides[2].value);

		let pair = this.props.PairName ? this.props.PairName : AppConfig.initialPair;
		let firstCur = pair.split('_')[0];
		let secondCur = pair.split('_')[1];

		return (
			<SafeView style={{ flex: 1 }}>

				{!this.state.isDetail &&
					<View style={{
						flexDirection: 'row',
						alignItems: 'flex-end',
						padding: R.dimens.widgetMargin,
					}}>
						<View style={{
							flex: 1,
							flexDirection: 'row',
							alignItems: 'flex-end',
						}}>
							<TextViewHML style={{
								color: parseFloatVal(this.state.lastPrice) >= 0 ? R.colors.buyerGreen : R.colors.sellerPink,
								fontSize: R.dimens.mediumText,
								paddingLeft: R.dimens.widgetMargin,
								paddingRight: R.dimens.widgetMargin,
							}}>{parseFloatVal(this.state.lastPrice).toFixed(6)}</TextViewHML>

							{/* DO NOT DELETE
							 <TextViewHML style={{
								color: R.colors.textPrimary,
								fontSize: R.dimens.smallText,
							}}>{'=' + parseFloatVal(this.state.lastPrice).toFixed(6) + ' USD'}</TextViewHML> */}
						</View>
						<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
							<ImageButton
								icon={R.images.IC_MINUS}
								iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textPrimary }}
								onPress={this.onPressDecimalDecrese}
								style={{ margin: R.dimens.widgetMargin }} />
							<TextViewHML style={{
								color: R.colors.textPrimary,
								fontSize: R.dimens.smallText,
							}}>{this.state.decimalPoint}</TextViewHML>
							<ImageButton
								icon={R.images.IC_PLUS}
								iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textPrimary }}
								onPress={this.onPressDecimalIncrese}
								style={{ margin: R.dimens.widgetMargin }} />

							<ImageButton
								icon={R.images.IC_PULSE}
								iconStyle={{ tintColor: R.colors.textPrimary, width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon }}
								style={{ margin: R.dimens.widgetMargin }} />
						</View>
					</View>}


				{/* Headers */}
				<View style={{
					flexDirection: "row",
					padding: R.dimens.margin,
					paddingTop: R.dimens.widgetMargin,
					paddingBottom: R.dimens.widgetMargin,
				}}>
					<TextViewHML style={{ flex: 1, color: R.colors.textSecondary, fontSize: R.dimens.smallestText }}>{R.strings.Amount + '(' + firstCur + ')'}</TextViewHML>
					<TextViewHML style={{ flex: 1, color: R.colors.textSecondary, textAlign: 'center', fontSize: R.dimens.smallestText }}>{R.strings.price + '(' + secondCur + ')'}</TextViewHML>
					<TextViewHML style={{ flex: 1, color: R.colors.textSecondary, textAlign: 'right', fontSize: R.dimens.smallestText }}>{R.strings.Amount + '(' + firstCur + ')'}</TextViewHML>
				</View>

				<View style={{ flex: 1, flexDirection: 'row' }}>

					<View style={{ flex: 1 }}>

						{/* Buyer Book */}
						{isBuyerBook &&
							<View style={{ flex: 1 }}>
								{
									isFetchingBuyerBook ?
										<View style={{ flex: 1 }}>
											<ListLoader />
										</View>
										:
										<FlatList
											extraData={this.state}
											showsVerticalScrollIndicator={false}
											data={this.state.buyerBookList}
											renderItem={({ item, index }) => {

												if (index > 9) {
													return null;
												}

												return <OrderBookItem
													item={item}
													decimals={this.state.decimalPoint}
													orderType={R.strings.buy}
													size={this.state.buyerBookList.size}
													theme={this.props.preference.theme}
													onPress={() => this.onPressSetSellData(item)}
												/>
											}}
											keyExtractor={(item, index) => index.toString()}
											contentContainerStyle={contentContainerStyle(this.state.buyerBookList)}
											ListEmptyComponent={<ListEmptyComponent />}
										/>
								}
							</View>
						}
					</View>
					<View style={{ flex: 1 }}>

						{/* Seller Book */}
						{isSellerBook &&
							<View style={{ flex: 1 }}>
								{isFetchingSellerBook ?
									<View style={{ flex: 1 }}>
										<ListLoader />
									</View>
									:
									<FlatList
										extraData={this.state}
										showsVerticalScrollIndicator={false}
										data={this.state.sellerBookList}
										renderItem={({ item, index }) => {

											if (index > 9) {
												return null;
											}
											return <OrderBookItem
												item={item}
												decimals={this.state.decimalPoint}
												orderType={R.strings.sell}
												size={this.state.sellerBookList.size}
												reverse={true}
												theme={this.props.preference.theme}
												onPress={() => this.onPressSetBuyData(item)}
											/>
										}}
										keyExtractor={(item, index) => index.toString()}
										contentContainerStyle={contentContainerStyle(this.state.sellerBookList)}
										ListEmptyComponent={<ListEmptyComponent />}
									/>
								}
							</View>
						}
					</View>
				</View>
			</SafeView>);
	}

	// styles for this class
	styles = () => {
		return {
			bid_ask_header: {
				flex: 1,
				flexDirection: 'row',
				marginTop: R.dimens.widgetMargin,
			},
		}
	}
}

class OrderBookItem extends Component {

	shouldComponentUpdate = (nextProps, nextState) => {
		//Check If Old Props and New Props are Equal then Return False
		if (this.props.item !== nextProps.item || this.props.decimals !== nextProps.decimals || this.props.theme !== nextProps.theme) {
			return true;
		}
		return false;
	};

	render() {
		let props = this.props;
		let { item: { Price, Amount }, orderType, decimals = 3, reverse, onPress } = props;
		let color = orderType === R.strings.buy ? R.colors.buyerGreen : R.colors.sellerPink;

		let price = parseFloatVal(Price).toFixed(decimals);
		let amount = parseFloatVal(Amount).toFixed(2);

		let rev = reverse !== undefined && reverse == true;

		//For Buy Sell Trade Book
		const totalOrders = 1000

		let buysellOrderDepth = totalOrders;
		const highDepth = price !== '-' ? parseFloatVal(amount * 100 / buysellOrderDepth).toFixed(3) : 0;

		return (
			<AnimatableItem>
				<TouchableWithoutFeedback onPress={onPress}>
					<View>
						<View ref={view => { this.myComponent = view; }} style={{
							flex: 1,
							flexDirection: 'row',
							marginLeft: rev ? R.dimens.widgetMargin / 2 : R.dimens.widget_top_bottom_margin,
							marginRight: rev ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin / 2,
							marginTop: R.dimens.widgetMargin,
							marginBottom: R.dimens.widgetMargin,
						}}>
							<TextViewHML style={{ flex: 1, color: rev ? color : R.colors.textPrimary, fontSize: R.dimens.smallestText }} >{rev ? price : amount}</TextViewHML>
							<TextViewHML style={{ flex: 1, textAlign: 'right', color: rev ? R.colors.textPrimary : color, fontSize: R.dimens.smallestText }} >{rev ? amount : price}</TextViewHML>
						</View>
						<View style={[{
							position: 'absolute',
							flexDirection: 'row',
							justifyContent: 'center',
							width: highDepth >= 100 ? '100%' : highDepth + "%",
							height: R.dimens.mediumText,
							marginLeft: rev ? R.dimens.widgetMargin / 2 : R.dimens.widget_top_bottom_margin,
							marginRight: rev ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin / 2,
							marginTop: R.dimens.widgetMargin,
							marginBottom: R.dimens.widgetMargin,
							alignSelf: orderType === R.strings.buy ? 'flex-end' : 'flex-start',
							backgroundColor: orderType === R.strings.buy ? R.colors.greenShadow : R.colors.redShadow,
						}, rev ? { left: 0 } : { right: 0 }]} />
					</View>
				</TouchableWithoutFeedback>
			</AnimatableItem>
		)
	}
}

const mapStateToProps = (state) => {
	// Updated Data of BuyerBook, Sellerbook, MarketCapData, preference
	return {
		buyerBook: state.buyerBookReducer,
		sellerBook: state.sellerBookReducer,
		marketCapData: state.marketCapReducer,
		preference: state.preference
	}
}

const mapDispatchToProps = (dispatch) => ({
	// Perform BuyerBook Action
	fetchBuyerBookList: (Pair) => dispatch(fetchBuyerBookList(Pair)),

	// Perform SellerBook Action
	fetchSellerBookList: (Pair) => dispatch(fetchSellerBookList(Pair)),
})

export default connect(mapStateToProps, mapDispatchToProps)(BuyerSellerBookWidget);

function priceValidation(isBuyer, response, lastPriceRecord, lastPrice) {

	let buyerSellerList = [];

	let stopLimitOrders = [];

	for (var buyerSellerkey in response) {
		let buyerSellerItem = response[buyerSellerkey];

		//If item is regular than add in buyerSellerList
		if (buyerSellerItem.IsStopLimit == 0) {

			//if current record price is 0 and amount is greater than 0 then add to lastPriceRecord
			if (parseFloatVal(buyerSellerItem.Price) == 0 && parseFloatVal(buyerSellerItem.Amount) > 0) {

				// if lastPriceRecord is empty
				if (Object.keys(lastPriceRecord).length === 0) {

					//price is 0 and amount is greater then 0 so adding record to lastPriceRecord
					lastPriceRecord = buyerSellerItem;
				}

			} else {

				//Add to list
				buyerSellerList.push(buyerSellerItem);
			}
		} else {
			stopLimitOrders.push(buyerSellerItem);
		}

	}

	//if lastPrice is greater then 0 and lastPriceRecord has data with Amount greater then 0 then perform action
	if (lastPrice > 0 && Object.keys(lastPriceRecord).length !== 0 && lastPriceRecord.Amount > 0) {

		//finding index of existing lastPrice record in existing list
		let findLastPriceIndex = buyerSellerList.findIndex(buyerOrder => parseFloatVal(buyerOrder.Price) === parseFloatVal(lastPrice));

		if (findLastPriceIndex === -1) {

			//LastPrice is not found in list so adding lastPrice to 0 price record and adding it to List
			lastPriceRecord.Price = lastPrice;
			buyerSellerList.push(lastPriceRecord);
		} else {

			//If record is exist then sum amount of that record
			buyerSellerList[findLastPriceIndex].Amount = buyerSellerList[findLastPriceIndex].Amount + lastPriceRecord.Amount;
		}
	}

	if (stopLimitOrders.length !== 0) {

		for (var stopLimitOrderKey in stopLimitOrders) {

			console.log("Bhavesh")
			let stopLimitOrder = stopLimitOrders[stopLimitOrderKey];

			//finding index of price record in existing list
			let findStopLimitPrice = buyerSellerList.findIndex(buyerOrder => parseFloatVal(buyerOrder.Price) === parseFloatVal(stopLimitOrder.Price));

			if (findStopLimitPrice === -1) {
				buyerSellerList.push(stopLimitOrder);
			} else {
				//If record is exist then sum amount of that record
				buyerSellerList[findStopLimitPrice].Amount = buyerSellerList[findStopLimitPrice].Amount + stopLimitOrder.Amount;
			}
		}
	}

	//Sorting array based on Price
	let res = arraySort(parseArray(buyerSellerList), 'Price', { reverse: true });

	return {
		[isBuyer ? 'buyerBookList' : 'sellerBookList']: res
	}
}