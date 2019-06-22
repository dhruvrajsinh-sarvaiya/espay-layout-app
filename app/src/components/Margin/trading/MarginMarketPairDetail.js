import React, { Component } from 'react';
import { View, ScrollView, Linking, TouchableOpacity, } from 'react-native';
import { connect } from 'react-redux';
import { isCurrentScreen } from '../../Navigation';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import { fetchMarketCap } from '../../../actions/Trade/MarketCapActions';
import { sendEvent, changeTheme, addListener, convertDate, parseFloatVal } from '../../../controllers/CommonUtils';
import { isInternet, validateResponseNew } from '../../../validations/CommonValidation'
import { addFavourite, removeFavourite, getFavourites } from '../../../actions/Trade/FavouriteActions';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { Method, Events } from '../../../controllers/Constants';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import MarginTradeChartWidget from './MarginTradeChartWidget';
import R from '../../../native_theme/R';
import MarginMarketDepthChart from './MarginMarketDepthChart';
import MarginBuyerSellerBookWidget from './MarginBuyerSellerBookWidget';
import { TitleItem } from '../../../native_theme/components/IndicatorViewPager';
import MarginGlobalMarketTradeWidget from './MarginGlobalMarketTradeWidget';
import CommonToast from '../../../native_theme/components/CommonToast';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import { clearMarketDepthData } from '../../../actions/Trade/MarketDepthActions';
import { clearMarketTradeList } from '../../../actions/Trade/GlobalMarketTradeAction';
import SafeView from '../../../native_theme/components/SafeView';
import Button from '../../../native_theme/components/Button';

class MarginMarketPairDetail extends Component {

	constructor(props) {
		super(props);

		// Create Reference
		this.toast = React.createRef();

		// Data Get from Previous Screen
		let { params } = this.props.navigation.state;

		// Bind All Method
		this.addToFavourite = this.addToFavourite.bind(this);
		this.redirectToBuySell = this.redirectToBuySell.bind(this);
		this.onWebLinkPress = this.onWebLinkPress.bind(this);

		//Define All initial State
		this.state = {
			result: params.item,
			isFavorite: params.item.isFavorite,
			lastPrice: '',
			change24: '',
			changePer: '',
			low24: '',
			high24: '',
			volume24: '',
			coin: null,
			tabsName: [{ name: R.strings.depth, isSelected: true }, { name: R.strings.marketTrades, isSelected: false }, { name: R.strings.Information, isSelected: false }],
			selectedTab: 0,
		};
	}

	async componentDidMount() {

		//Add this method to change theme based on stored theme name.
		changeTheme();

		//To check internet connection
		if (await isInternet()) {

			// Call CurrencyPair Detail api
			this.props.fetchMarketCap({
				Pair: this.state.result.PairName,
				IsMargin: 1
			});
		}

		// Handle Signal-R response for Market Data
		this.listenerRecieveMarketData = addListener(Method.RecieveMarketData, (receivedMessage) => {

			// check for current screen
			if (isCurrentScreen(this.props)) {
				try {
					let response = JSON.parse(receivedMessage);

					// if receiveMesaage is not null
					if (receivedMessage != null) {
						this.setState({
							lastPrice: response.Data.LastPrice.toFixed(6),
							change24: response.Data.Change24.toFixed(6),
							changePer: response.Data.ChangePer.toFixed(6),
							low24: response.Data.Low24.toFixed(2),
							high24: response.Data.High24.toFixed(2),
							volume24: response.Data.Volume24.toFixed(2),
						})
					}
				} catch (error) {
					// Error in parsing
				}
			}
		})
	};

	componentWillUnmount() {

		// for clear reducer
		this.props.clearMarketDepthData();
		this.props.clearMarketTradeList();

		// remove Listener
		if (this.listenerRecieveMarketData) {
			this.listenerRecieveMarketData.remove();
		}
	}

	shouldComponentUpdate = (nextProps, nextState) => {
		if (this.props.favourites.isAdding !== nextProps.favourites.isAdding ||
			this.props.favourites.isRemoving !== nextProps.favourites.isRemoving ||
			this.props.favourites.addFavourite !== nextProps.favourites.addFavourite ||
			this.props.favourites.removeFavourite !== nextProps.favourites.removeFavourite ||
			this.props.result.marketCap !== nextProps.result.marketCap ||
			this.state.coin !== nextState.coin ||
			this.state.lastPrice !== nextState.lastPrice ||
			this.state.change24 !== nextState.change24 ||
			this.state.changePer !== nextState.changePer ||
			this.state.low24 !== nextState.low24 ||
			this.state.high24 !== nextState.high24 ||
			this.state.volume24 !== nextState.volume24 ||
			this.state.selectedTab !== nextState.selectedTab) {

			// stop twice api call
			return isCurrentScreen(nextProps);
		} else {
			return false;
		}
	};

	static getDerivedStateFromProps(props, state) {

		// check for current screen
		if (isCurrentScreen(props)) {

			//Get All Updated field of Particular actions
			const { result: { marketCap }, coinList: { CoinData }, favourites: { addFavourite, removeFavourite } } = props;

			try {
				// To check marketCap is null or not
				if (marketCap) {

					//if tradeHistory is null or old and new data of tradeHistory  and response is different then validate it
					if (state.marketCap == null || (state.marketCap != null && marketCap !== state.marketCap)) {

						validateResponseNew({ response: marketCap, isList: true })

						if (marketCap.response != null) {
							return Object.assign({}, state, {
								marketCap,
								lastPrice: parseFloatVal(marketCap.response.LastPrice).toFixed(8),
								change24: marketCap.response.Change24.toFixed(8),
								changePer: marketCap.response.ChangePer.toFixed(8),
								low24: parseFloatVal(marketCap.response.Low24).toFixed(2),
								high24: parseFloatVal(marketCap.response.High24).toFixed(2),
								volume24: parseFloatVal(marketCap.response.Volume24).toFixed(2),
							})
						} else {
							return Object.assign({}, state, {
								marketCap
							})
						}
					}
				}

				//check list coin data is null or not
				if (CoinData) {

					// this condition execute either one time for getting data than check if data is same than not execute othrewise execute this condition
					if (state.CoinData == null || (state.CoinData != null && CoinData !== state.CoinData)) {

						if (validateResponseNew({ response: CoinData, isList: true })) {

							let baseCurrency = state.result.PairName.split('_')[0];

							let coinIndex = CoinData.Response.findIndex(el => el.SMSCode.toUpperCase() === baseCurrency.toUpperCase());

							//handle success response
							return Object.assign({}, state, {
								CoinData,
								coin: coinIndex > -1 ? CoinData.Response[coinIndex] : null
							})
						} else {
							return Object.assign({}, state, {
								CoinData,
								coin: null
							})
						}
					}
				}

				//if addFavourite response is not null then handle resposne
				if (addFavourite) {

					//if local favouritesData state is null or its not null and also different then new response then and only then validate response.
					if (state.addFavourite == null || (state.addFavourite != null && addFavourite !== state.addFavourite)) {

						//if favouriteList response is success then store array list else store empty list
						if (validateResponseNew({ response: addFavourite, isList: true }) || addFavourite.ErrorCode == 4620) {
							return Object.assign({}, state, {
								addFavourite,
								removeFavourite: null,
								isFavorite: !state.isFavorite
							})
						} else {
							return Object.assign({}, state, {
								addFavourite,
								removeFavourite: null,
							})
						}
					}
				}

				//if removeFavourite response is not null then handle resposne
				if (removeFavourite) {

					//if local favouritesData state is null or its not null and also different then new response then and only then validate response.
					if (state.removeFavourite == null || (state.removeFavourite != null && removeFavourite !== state.removeFavourite)) {

						//if favouriteList response is success then store array list else store empty list
						if (validateResponseNew({ response: removeFavourite, isList: true })) {
							return Object.assign({}, state, {
								removeFavourite,
								addFavourite: null,
								isFavorite: !state.isFavorite
							})
						} else {
							return Object.assign({}, state, {
								removeFavourite,
								addFavourite: null,
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

	componentDidUpdate = async (prevProps, prevState) => {

		//Get All Updated field of Particular actions
		let { favourites: { addFavourite, removeFavourite } } = this.props;

		//To check if both current and previous addFavourite are different
		if (addFavourite !== prevProps.favourites.addFavourite) {

			//If addFavourite is not null
			if (addFavourite) {
				this.toast.Show(addFavourite.ReturnMsg);

				// check for internet connection
				if (await isInternet()) {

					//To get the favourites list
					this.props.getFavourites({ IsMargin: 1 });
				}
			}
		}

		//To check if both current and previous removeFavourite are different
		if (removeFavourite !== prevProps.favourites.removeFavourite) {

			//If removeFavourite is not null
			if (removeFavourite) {
				this.toast.Show(removeFavourite.ReturnMsg);

				// check for internet connetion
				if (await isInternet()) {

					//To get the favourites list
					this.props.getFavourites({ IsMargin: 1 });
				}
			}
		}
	};

	// for add/remove pair to/from favorite
	async addToFavourite() {

		//check for intetnet connection
		if (await isInternet()) {

			// check for pair is alerady selected for favorite then remove from favorite otherwise add to favorite
			if (this.state.isFavorite) {
				this.props.removeFavourite({ PairId: this.state.result.PairId, IsMargin: 1 });
			} else {
				this.props.addFavourite({ PairId: this.state.result.PairId, IsMargin: 1 });
			}
		}
	}

	redirectToBuySell() {

		// Move Tab to Trade in Main Screen
		sendEvent(Events.MoveToMainScreen, 2);

		// Passing Buy Sell Data to Buy Sell Screen
		sendEvent(Events.BuySellPairDataMargin, this.state.result)

		// To Clear Market Depth Chart & Global Market Trades Data
		this.props.clearMarketDepthData();
		this.props.clearMarketTradeList();

		// Navigate to MainScreen as Trade Screen is there.
		this.props.navigation.navigate('MainScreen')
	}

	// for get color based on value
	getColor = (value) => {
		if (value == 0) {
			return R.colors.textPrimary;
		} else if (value > 0) {
			return R.colors.buyerGreen;
		} else if (value < 0) {
			return R.colors.sellerPink;
		} else {
			return R.colors.textPrimary
		}
	}

	// for open URL to borwer
	onWebLinkPress(url) {
		try {
			if (url)
				Linking.openURL(url);
		} catch (error) {
			//handle catch block here
		}
	}

	render() {

		let lastPrice = '0.00000000', change24 = '0.00000000', changePer = '0.00000000', low24 = '0.00', high24 = '0.00', volume24 = '0.00';
		if (this.props.result.marketCap != null) {
			lastPrice = this.state.lastPrice
			change24 = this.state.change24
			changePer = this.state.change24
			low24 = this.state.low24
			high24 = this.state.high24
			volume24 = this.state.volume24
		}

		return (
			<SafeView style={this.styles().container}>

				{/* To set status bar as per our theme */}
				<CommonStatusBar />

				{/* Custom Toast */}
				<CommonToast ref={(cmp) => this.toast = cmp} />

				{/* Progress Dialog */}
				<ProgressDialog isShow={this.props.favourites.isAdding || this.props.favourites.isRemoving} />

				{/* To set toolbar as per our theme */}
				<CustomToolbar
					title={this.state.result.PairName.replace('_', '/')}
					rightIcon={this.state.isFavorite ? R.images.FAVORITE : R.images.SIMPLE_FAVORITE}
					rightIconStyle={{ tintColor: this.state.isFavorite ? null : R.colors.textPrimary }}
					isBack={true}
					nav={this.props.navigation}
					onRightMenuPress={this.addToFavourite}
				/>

				<View style={{ flex: 1, justifyContent: 'space-between' }}>

					<View style={{ flex: 1 }}>
						<ScrollView stickyHeaderIndices={[2]} nestedScrollEnabled={true} showsVerticalScrollIndicator={false}>

							{/* Detail of Amount */}
							<View style={{ flex: 1, margin: R.dimens.widget_left_right_margin, flexDirection: 'row' }}>

								{/* for show last price and change per. */}
								<View style={{ width: '75%' }}>
									<TextViewHML style={{ fontSize: R.dimens.largeText, color: this.getColor(lastPrice) }}>{lastPrice}</TextViewHML>
									<View style={{ flex: 1, flexDirection: 'row' }}>
										<TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary }}>{change24}</TextViewHML>
										<TextViewHML style={{ fontSize: R.dimens.smallText, color: this.getColor(changePer) }}> {(parseFloatVal(changePer).toFixed(2) !== 'NaN' ? parseFloatVal(changePer).toFixed(2) : '0.00')}%</TextViewHML>
									</View>
								</View>

								{/* for show high24, low24 and volume24 value */}
								<View style={{ width: '25%', alignItems: 'flex-end' }}>
									<View style={{ flexDirection: 'row' }}>
										<TextViewHML style={{ flex: 1, fontSize: R.dimens.smallText, color: R.colors.textSecondary, textAlign: 'left' }}>{'H'}</TextViewHML>
										<TextViewHML style={{ flex: 1, fontSize: R.dimens.smallText, color: R.colors.textPrimary, textAlign: 'right' }}>{high24}</TextViewHML>
									</View>

									<View style={{ flexDirection: 'row' }}>
										<TextViewHML style={{ flex: 1, fontSize: R.dimens.smallText, color: R.colors.textSecondary, textAlign: 'left' }}>{'L'}</TextViewHML>
										<TextViewHML style={{ flex: 1, fontSize: R.dimens.smallText, color: R.colors.textPrimary, textAlign: 'right' }}>{low24}</TextViewHML>
									</View>

									<View style={{ flexDirection: 'row' }}>
										<TextViewHML style={{ flex: 1, fontSize: R.dimens.smallText, color: R.colors.textSecondary, textAlign: 'left' }}>{'24H'}</TextViewHML>
										<TextViewHML style={{ flex: 1, fontSize: R.dimens.smallText, color: R.colors.textPrimary, textAlign: 'right' }}>{volume24}</TextViewHML>
									</View>
								</View>
							</View>

							{/* for show Margin Trade Chart Widget */}
							<View style={{ height: R.dimens.chartHeightMedium }}>
								<MarginTradeChartWidget navigation={this.props.navigation} pairName={this.state.result.PairName} />
							</View>

							<View>
								<View style={{
									backgroundColor: R.colors.background,
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
											this.setState({ tabsName, selectedTab: index });
										}}
										color={item.isSelected ? R.colors.accent : R.colors.textSecondary}
										width={(R.screen().width - (R.dimens.margin * 2)) / this.state.tabsName.length} />)}
								</View>
							</View>

							<View style={{ marginBottom: R.dimens.widget_top_bottom_margin }}>

								{this.state.selectedTab == 0 && <View>
									<View style={{ height: R.dimens.chartHeightMedium }}>
										<MarginMarketDepthChart navigation={this.props.navigation} PairName={this.state.result.PairName} shouldDisplay={true} />
									</View>

									<View style={{ marginTop: R.dimens.widget_top_bottom_margin }}>
										<MarginBuyerSellerBookWidget
											navigation={this.props.navigation}
											PairName={this.state.result.PairName}
											isDetail={true} />
									</View>
								</View>}

								{this.state.selectedTab == 1 && <View style={{ flex: 1 }}>
									<MarginGlobalMarketTradeWidget
										navigation={this.props.navigation}
										shouldDisplay={true}
										PairName={this.state.result.PairName} />
								</View>}

								{this.state.selectedTab == 2 && <View style={{ flex: 1, padding: R.dimens.widget_left_right_margin }}>
									{
										this.state.coin !== null &&
										<View style={{ flex: 1 }}>

											{/* for show Coin name and introduction */}
											<TextViewMR style={{ fontSize: R.dimens.mediumText, color: R.colors.textPrimary }}>{this.state.coin.Name}</TextViewMR>
											<TextViewHML style={{ fontSize: R.dimens.smallText, color: R.colors.textPrimary, marginTop: R.dimens.widget_top_bottom_margin }}>{this.state.coin.Introduction}</TextViewHML>

											{/* for show issue Date */}
											<View style={{ flexDirection: 'row', marginTop: R.dimens.widget_top_bottom_margin }}>
												<TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary }}>{R.strings.issue_date}</TextViewHML>
												<TextViewHML style={{ flex: 1, textAlign: 'right', fontSize: R.dimens.smallText, color: R.colors.textSecondary }} ellipsizeMode={'tail'} numberOfLines={1}>{convertDate(this.state.coin.IssueDate)}</TextViewHML>
											</View>

											{/* for show Total Supply */}
											<View style={{ flexDirection: 'row', marginTop: R.dimens.widget_top_bottom_margin }}>
												<TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary }}>{R.strings.total_supply}</TextViewHML>
												<TextViewHML style={{ flex: 1, textAlign: 'right', fontSize: R.dimens.smallText, color: R.colors.textSecondary }} ellipsizeMode={'tail'} numberOfLines={1}>{this.state.coin.TotalSupply}</TextViewHML>
											</View>

											{/* for show Issue Price */}
											<View style={{ flexDirection: 'row', marginTop: R.dimens.widget_top_bottom_margin }}>
												<TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary }}>{R.strings.issue_price}</TextViewHML>
												<TextViewHML style={{ flex: 1, textAlign: 'right', fontSize: R.dimens.smallText, color: R.colors.textSecondary }} ellipsizeMode={'tail'} numberOfLines={1}>{this.state.coin.IssuePrice}</TextViewHML>
											</View>

											{/* for show circulating supply */}
											<View style={{ flexDirection: 'row', marginTop: R.dimens.widget_top_bottom_margin }}>
												<TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary }}>{R.strings.circulating_supply}</TextViewHML>
												<TextViewHML style={{ flex: 1, textAlign: 'right', fontSize: R.dimens.smallText, color: R.colors.textSecondary }} ellipsizeMode={'tail'} numberOfLines={1}>{this.state.coin.CirculatingSupply}</TextViewHML>
											</View>

											{/* for show website Url */}
											<View style={{ flexDirection: 'row', marginTop: R.dimens.widget_top_bottom_margin }}>
												<TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary }}>{R.strings.website}</TextViewHML>
												<TouchableOpacity onPress={() => this.onWebLinkPress(this.state.coin.WebsiteUrl)}>
													<TextViewHML style={{ flex: 1, textAlign: 'right', fontSize: R.dimens.smallText, color: R.colors.textSecondary }} ellipsizeMode={'tail'} numberOfLines={1}>{this.state.coin.WebsiteUrl}</TextViewHML>
												</TouchableOpacity>
											</View>
										</View>
									}
								</View>}
							</View>
						</ScrollView>
					</View>

					{/* Button of Buy and Sell */}
					<View style={{ flexDirection: 'row', padding: R.dimens.WidgetPadding }}>
						<View style={{ flex: 1 }}>
							<Button
								title={R.strings.buy.toUpperCase()}
								onPress={this.redirectToBuySell}
								style={{ marginRight: R.dimens.widgetMargin, backgroundColor: R.colors.buyerGreen }}
								textStyle={{ fontSize: R.dimens.smallText, }}
							/>
						</View>
						<View style={{ flex: 1 }}>
							<Button
								title={R.strings.sell.toUpperCase()}
								onPress={this.redirectToBuySell}
								style={{ marginLeft: R.dimens.widgetMargin, backgroundColor: R.colors.sellerPink }}
								textStyle={{ fontSize: R.dimens.smallText, }}
							/>
						</View>
					</View>
				</View>
			</SafeView>
		);
	}

	styles = () => {
		return {
			container: {
				flex: 1,
				backgroundColor: R.colors.background,
			},
		}
	}
}

const mapStateToProps = (state) => {
	// Updated Data of Market, marketCap, Favourite and coinList
	return {
		marketData: state.tradeData,
		result: state.marketCapReducer,
		favourites: state.favouriteReducer,
		coinList: state.CoinReducer,
	}
}

const mapDispatchToProps = (dispatch) => ({

	// Perform MarketCap Action
	fetchMarketCap: (payload) => dispatch(fetchMarketCap(payload)),

	// Perform Favourite Action
	getFavourites: (payload) => dispatch(getFavourites(payload)),

	// Perform Add Favorite Action
	addFavourite: (payload) => dispatch(addFavourite(payload)),

	// Perform Remove Favorite Action
	removeFavourite: (payload) => dispatch(removeFavourite(payload)),

	// Perform Market Depth Action
	clearMarketDepthData: () => dispatch(clearMarketDepthData()),

	// Perform Market Trade Action
	clearMarketTradeList: () => dispatch(clearMarketTradeList())
})

export default connect(mapStateToProps, mapDispatchToProps)(MarginMarketPairDetail);
