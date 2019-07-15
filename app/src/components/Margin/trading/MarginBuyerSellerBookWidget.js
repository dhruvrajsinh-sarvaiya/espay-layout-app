import React, { Component } from 'react';
import { View, FlatList, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';
import { isCurrentScreen } from '../../Navigation';
import { changeTheme, parseArray, addListener, sendEvent, parseFloatVal, stopLimitValidation, amountValidation, priceValidation } from '../../../controllers/CommonUtils';
import { contentContainerStyle, ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import { fetchBuyerBookList } from '../../../actions/Trade/BuyerBookActions';
import { fetchSellerBookList } from '../../../actions/Trade/SellerBookActions';
import { validateResponseNew, isInternet } from '../../../validations/CommonValidation';
import arraySort from 'array-sort';
import { Method, Constants, Events } from '../../../controllers/Constants';
import R from '../../../native_theme/R';
import ListLoader from '../../../native_theme/components/ListLoader';
import ImageButton from '../../../native_theme/components/ImageTextButton';
import { AppConfig } from '../../../controllers/AppConfig';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import SafeView from '../../../native_theme/components/SafeView';

class MarginBuyerSellerBookWidget extends Component {

	//Define All initial State
	state = {
		isDetail: false,
		marginBuyerBookData: null,
		marginSellerBookData: null,
		buyerBookList: [],
		sellerBookList: [],
		lastPrice: 0,
		buyerBookMerge: [],
		sellerBookMerge: [],
		LPMarginSellerBook: [],

		socketLastPriceData: [],
		socketBuyData: [],
		stopLimitBuyerBook: [],
		socketSellData: [],
		stopLimitSellerBook: [],
		socketLPSellData: [],

		sides: R.strings.sides,
		side: R.strings.sides[0].value,

		decimalPoint: 8,
	}

	constructor(props) {
		super(props);

		// Bind All Method
		this.onPressDecimalDecrese = this.onPressDecimalDecrese.bind(this);
		this.onPressDecimalIncrese = this.onPressDecimalIncrese.bind(this);
		this.onPressSetBuyData = this.onPressSetBuyData.bind(this);
		this.onPressSetSellData = this.onPressSetSellData.bind(this);
	}

	shouldComponentUpdate(nextProps, nextState) {
		//If theme or locale is changed then update componenet
		if (this.props.preference.theme !== nextProps.preference.theme || this.props.preference.locale !== nextProps.preference.locale) {
			return true;
		} else {

			if (this.state.buyerBookList !== nextState.buyerBookList ||
				this.state.sellerBookList !== nextState.sellerBookList) {
				return true;
			}
			// stop twice api call 
			else if (this.props.marketCapData.marketCap !== nextProps.marketCapData.marketCap ||
				this.props.buyerBook.buyerBookData !== nextProps.buyerBook.buyerBookData ||
				this.props.buyerBook.isFetchingBuyerBook !== nextProps.buyerBook.isFetchingBuyerBook ||
				this.props.sellerBook.sellerBookData !== nextProps.sellerBook.sellerBookData ||
				this.props.sellerBook.isFetchingSellerBook !== nextProps.sellerBook.isFetchingSellerBook ||
				this.state.decimalPoint !== nextState.decimalPoint ||
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

			var { buyerBook: { isFetchingBuyerBook }, sellerBook: { isFetchingSellerBook } } = this.props;

			if (!isFetchingBuyerBook) {
				// Call BuyerBooklist api
				this.props.fetchBuyerBookList({ Pair: this.props.PairName ? this.props.PairName : AppConfig.initialPair, IsMargin: 1 });
			}

			if (!isFetchingSellerBook) {
				// Call SellerBooklist api
				this.props.fetchSellerBookList({ Pair: this.props.PairName ? this.props.PairName : AppConfig.initialPair, IsMargin: 1 });
			}
		}

		// Handle Signal-R response for RecieveLastPrice
		this.listenerRecieveLastPrice = addListener(Method.RecieveLastPrice, (receivedMessage) => {

			try {
				let response = JSON.parse(receivedMessage);

				if ((response.EventTime && this.state.socketLastPriceData.length === 0) || (this.state.socketLastPriceData.length > 0 && response.EventTime > this.state.socketLastPriceData.EventTime)) {
					if (this.props.PairName === response.Parameter && typeof response.IsMargin !== 'undefined' && response.IsMargin === 1) {
						this.setState({ lastPrice: response.Data.LastPrice, socketLastPriceData: response });
					}
				}
			} catch (_error) {
				//parsing error
				// logger(Method.RecieveLastPrice + _error.message);
			}
		})

		// Handle Signal-R response for BuyerBook
		this.listenerRecieveBuyerBook = addListener(Method.RecieveBuyerBook, (receivedMessage) => {

			try {
				let response = JSON.parse(receivedMessage);

				if ((response.EventTime && this.state.socketBuyData.length == 0) || (this.state.socketBuyData.length !== 0 && response.EventTime >= this.state.socketBuyData.EventTime)) {

					if (this.props.PairName === response.Parameter && typeof response.IsMargin !== 'undefined' && response.IsMargin === 1) {
						this.setState({ ...amountValidation(true, response), socketBuyData: response });
					}
				}
			} catch (_error) {
				//parsing error
				// logger('RecieveBuyerBook Error : ' + _error.message)
			}
		})

		// Handle Signal-R response for StopLimitBuyerBook
		this.listenerRecieveStopLimitBuyerBook = addListener(Method.RecieveStopLimitBuyerBook, (receivedMessage) => {

			try {
				let response = JSON.parse(receivedMessage);

				if ((response.EventTime && this.state.stopLimitBuyerBook.length === 0) || (this.state.stopLimitBuyerBook.length !== 0 && response.EventTime > this.state.stopLimitBuyerBook.EventTime)) {
					if (this.props.PairName === response.Parameter && typeof response.IsMargin !== 'undefined' && response.IsMargin === 1) {

						//Stop Limit Add/Remove validation of response array
						this.setState({ ...stopLimitValidation(true, response), stopLimitBuyerBook: response });
					}
				}

			} catch (_error) {
				//parsing error
				// logger('RecieveStopLimitBuyerBook Error : ' + _error.message)
			}
		})

		// Handle Signal-R response for SellerBook
		this.listenerRecieveSellerBook = addListener(Method.RecieveSellerBook, (receivedMessage) => {

			try {
				let response = JSON.parse(receivedMessage);

				if ((response.EventTime && this.state.socketSellData.length == 0) || (this.state.socketSellData.length !== 0 && response.EventTime >= this.state.socketSellData.EventTime)) {
					if (this.props.PairName === response.Parameter && typeof response.IsMargin !== 'undefined' && response.IsMargin === 1) {
						this.setState({ ...amountValidation(false, response), socketSellData: response });
					}
				}

			} catch (_error) {
				//parsing error
				// logger('RecieveSellerBook Error : ' + _error.message)
			}
		})

		// Handle Signal-R response for StopLimitSellerBook
		this.listenerRecieveStopLimitSellerBook = addListener(Method.RecieveStopLimitSellerBook, (receivedMessage) => {

			try {
				let response = JSON.parse(receivedMessage);

				if ((response.EventTime && this.state.stopLimitSellerBook.length === 0) || (this.state.stopLimitSellerBook.length !== 0 && response.EventTime > this.state.stopLimitSellerBook.EventTime)) {
					if (this.props.PairName === response.Parameter && typeof response.IsMargin !== 'undefined' && response.IsMargin === 1) {
						//Stop Limit Add/Remove validation of response array
						this.setState({ ...stopLimitValidation(false, response), stopLimitSellerBook: response });
					}
				}
			} catch (_error) {
				//parsing error
				// logger('RecieveStopLimitSellerBook Error : ' + _error.message)
			}
		})

		// Handle Signal-R response for BulkSellerBook
		this.listenerReceiveBulkSellerBook = addListener(Method.ReceiveBulkSellerBook, (receivedMessage) => {

			try {
				let response = JSON.parse(receivedMessage);
				if ((response.EventTime && this.state.socketLPSellData.length == 0) || (this.state.socketLPSellData.length !== 0 && response.EventTime >= this.state.socketLPSellData.EventTime)) {
					if (this.props.PairName === response.Parameter && typeof response.IsMargin !== 'undefined' && response.IsMargin === 1) {
						let LPMarginSellerBook = this.state.LPMarginSellerBook;
						LPMarginSellerBook[response.LP] = response.Data;

						let sellerBookList = this.state.sellerBookList;

						if (LPMarginSellerBook.length > 0) {
							LPMarginSellerBook.forEach((item) => {
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

						this.setState({ LPMarginSellerBook, socketLPSellData: response, sellerBookList: res })
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
		if (this.listenerRecieveLastPrice) {
			this.listenerRecieveLastPrice.remove();
		}
		if (this.listenerRecieveBuyerBook) {
			this.listenerRecieveBuyerBook.remove();
		}
		if (this.listenerRecieveStopLimitBuyerBook) {
			this.listenerRecieveStopLimitBuyerBook.remove();
		}
		if (this.listenerRecieveSellerBook) {
			this.listenerRecieveSellerBook.remove();
		}
		if (this.listenerRecieveStopLimitSellerBook) {
			this.listenerRecieveStopLimitSellerBook.remove();
		}
		if (this.listenerReceiveBulkSellerBook) {
			this.listenerReceiveBulkSellerBook.remove();
		}
	}

	static getDerivedStateFromProps(props, state) {
		if ((props.shouldDisplay && isCurrentScreen(props)) || isCurrentScreen(props)) {

			if (props.isDetail && (props.isDetail !== state.isDetail)) {
				return Object.assign({}, state, {
					isDetail: props.isDetail
				});
			}

			try {
				//Get All Updated field of Particular actions
				const { marketCapData: { marketCap }, buyerBook: { buyerBookData }, sellerBook: { sellerBookData } } = props

				// To check Margin marketCap is null or not
				if (marketCap) {

					//if Margin marketCap is null or old and new data of tradeHistory  and response is different then validate it
					if (state.marginMarketCap == null || (state.marginMarketCap != null && marketCap !== state.marginMarketCap)) {
						validateResponseNew({ response: marketCap, isList: true })

						if (marketCap.response != null) {
							return Object.assign({}, state, {
								marginMarketCap: marketCap,
								lastPrice: parseFloatVal(marketCap.response.LastPrice).toFixed(8),
							})
						} else {
							return Object.assign({}, state, {
								marginMarketCap: marketCap,
							})
						}
					}
				}

				// To check buyerbookdata is null or not
				if (buyerBookData) {

					//if local buyerbookdata state is null or its not null and also different then new response then and only then validate response.
					if (state.marginBuyerBookData == null || (state.marginBuyerBookData != null && buyerBookData !== state.marginBuyerBookData)) {

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
								marginBuyerBookData: buyerBookData,
								buyerBookMerge: stopLimitOrders,
								...priceValidation(true, buyerBookData.response, {}, state.lastPrice)
							});
						} else {
							return Object.assign({}, state, {
								marginBuyerBookData: buyerBookData,
								buyerBookList: []
							})
						}
					}
				}

				// To check sellerbookdata is null or not
				if (sellerBookData) {

					//if local sellerbookdata state is null or its not null and also different then new response then and only then validate response.
					if (state.marginSellerBookData == null || (state.marginSellerBookData != null && sellerBookData !== state.marginSellerBookData)) {

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
								marginSellerBookData: sellerBookData,
								sellerBookMerge: stopLimitOrders,
								...priceValidation(false, sellerBookData.response, {}, state.lastPrice)
							})
						} else {
							return Object.assign({}, state, {
								marginSellerBookData: sellerBookData,
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
			sendEvent(Events.BuySellInputMargin, { module: Constants.TradeTypes.Sell, ...item });
		} catch (e) {
			//handle catch
		}
	}

	//To set data in Buy Widget
	onPressSetBuyData(item) {
		try {
			sendEvent(Events.BuySellInputMargin, { module: Constants.TradeTypes.Buy, ...item });
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
}

class OrderBookItem extends Component {

	shouldComponentUpdate = (nextProps, _nextState) => {
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

export default connect(mapStateToProps, mapDispatchToProps)(MarginBuyerSellerBookWidget);

