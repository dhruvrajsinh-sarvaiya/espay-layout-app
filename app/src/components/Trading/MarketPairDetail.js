import React, { Component } from 'react';
import {
	View,
	ScrollView,
	Linking,
	TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import { isCurrentScreen } from '../Navigation';
import CustomToolbar from '../../native_theme/components/CustomToolbar';
import { fetchMarketCap } from '../../actions/Trade/MarketCapActions';
import { sendEvent, changeTheme, addListener, convertDate, parseFloatVal } from '../../controllers/CommonUtils';
import { isInternet, validateResponseNew } from '../../validations/CommonValidation'
import { addFavourite as addFavouriteApi, removeFavourite as removeFavouriteApi, getFavourites } from '../../actions/Trade/FavouriteActions';
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import { Method, Events } from '../../controllers/Constants';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import TradeChartWidget from './TradeChartWidget';
import R from '../../native_theme/R';
import MarketDepthChart from './MarketDepthChart';
import BuyerSellerBookWidget from './BuyerSellerBookWidget';
import { TitleItem } from '../../native_theme/components/IndicatorViewPager';
import GlobalMarketTradeWidget from './GlobalMarketTradeWidget';
import CommonToast from '../../native_theme/components/CommonToast';
import TextViewHML from '../../native_theme/components/TextViewHML';
import TextViewMR from '../../native_theme/components/TextViewMR';
import { clearMarketDepthData } from '../../actions/Trade/MarketDepthActions';
import { clearMarketTradeList } from '../../actions/Trade/GlobalMarketTradeAction';
import SafeView from '../../native_theme/components/SafeView';
import Button from '../../native_theme/components/Button';

class MarketPairDetailNew extends Component {
	constructor(props) {
		super(props);

		// create reference
		this.toast = React.createRef();

		// Get params from previous screen
		let { params } = this.props.navigation.state;

		// Bind all methods
		this.onWebLinkPress = this.onWebLinkPress.bind(this);
		this.addToFavourite = this.addToFavourite.bind(this);
		this.redirectToBuySell = this.redirectToBuySell.bind(this);

		//Define All initial State
		this.state = {
			result: params.item,
			lastPrice: '',
			changePer: '',
			change24: '',
			low24: '',
			isFavorite: params.item.isFavorite,
			coin: null,
			volume24: '',
			high24: '',
			selectedTab: 0,
			tabsName: [{ name: R.strings.depth, isSelected: true }, { name: R.strings.marketTrades, isSelected: false }, { name: R.strings.Information, isSelected: false }],
		};
	}

	async componentDidMount() {

		//Add this method to change theme based on stored theme name.
		changeTheme();

		//To check internet connection
		if (await isInternet()) {

			// Call CurrencyPair Detail api
			this.props.fetchMarketCap({ Pair: this.state.result.PairName, });
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
							high24: response.Data.High24.toFixed(2),
							lastPrice: response.Data.LastPrice.toFixed(6),
							changePer: response.Data.ChangePer.toFixed(6),
							low24: response.Data.Low24.toFixed(2),
							volume24: response.Data.Volume24.toFixed(2),
							change24: response.Data.Change24.toFixed(6),
						})
					}
				} catch (error) {
					// Error in parsing
				}
			}
		})
	};

	shouldComponentUpdate = (nextProps, nextState) => {
		if (this.props.favourites.isAdding !== nextProps.favourites.isAdding ||
			this.props.favourites.addFavourite !== nextProps.favourites.addFavourite ||
			this.props.favourites.isRemoving !== nextProps.favourites.isRemoving ||
			this.props.favourites.removeFavourite !== nextProps.favourites.removeFavourite ||
			this.state.coin !== nextState.coin ||
			this.state.lastPrice !== nextState.lastPrice ||
			this.state.volume24 !== nextState.volume24 ||
			this.state.change24 !== nextState.change24 ||
			this.state.changePer !== nextState.changePer ||
			this.props.result.marketCap !== nextProps.result.marketCap ||
			this.state.high24 !== nextState.high24 ||
			this.state.low24 !== nextState.low24 ||
			this.state.selectedTab !== nextState.selectedTab) {

			// stop twice api call
			return isCurrentScreen(nextProps);
		} else {
			return false;
		}
	};

	componentWillUnmount() {
		// remove Listener
		if (this.listenerRecieveMarketData) {
			this.listenerRecieveMarketData.remove();
		}
		// for clear reducer
		this.props.clearMarketTradeList();
		this.props.clearMarketDepthData();
	}

	static getDerivedStateFromProps(props, state) {

		// check for current screen
		if (isCurrentScreen(props)) {

			//Get All Updated field of Particular actions
			const { result: { marketCap }, coinList: { CoinData }, favourites: { addFavourite, removeFavourite }, } = props;

			try {
				// To check marketCap is null or not
				if (marketCap) {

					//if tradeHistory is null or old and new data of tradeHistory  and response is different then validate it
					if (state.marketCap == null || (state.marketCap != null && marketCap !== state.marketCap)) {

						validateResponseNew({ response: marketCap, isList: true })

						if (marketCap.response != null) {
							return Object.assign({}, state, {
								marketCap,
								change24: marketCap.response.Change24.toFixed(8),
								lastPrice: parseFloatVal(marketCap.response.LastPrice).toFixed(8),
								volume24: parseFloatVal(marketCap.response.Volume24).toFixed(2),
								changePer: marketCap.response.ChangePer.toFixed(8),
								low24: parseFloatVal(marketCap.response.Low24).toFixed(2),
								high24: parseFloatVal(marketCap.response.High24).toFixed(2),
							})
						} else {
							return Object.assign({}, state, { marketCap })
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
								CoinData, coin: coinIndex > -1 ? CoinData.Response[coinIndex] : null
							})
						} else {
							return Object.assign({}, state, {
								CoinData, coin: null
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
								addFavourite, removeFavourite: null, isFavorite: !state.isFavorite,
							})
						} else {
							return Object.assign({}, state, {
								addFavourite, removeFavourite: null,
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
								removeFavourite, addFavourite: null, isFavorite: !state.isFavorite
							})
						} else {
							return Object.assign({}, state, {
								removeFavourite, addFavourite: null,
							})
						}
					}
				}
			} catch (error) { return null; }
		}
		return null;
	}

	componentDidUpdate = async (prevProps, prevState) => {

		//Get All Updated field of Particular actions
		let { favourites: { addFavourite, removeFavourite }, } = this.props;

		//To check if both current and previous addFavourite are different
		if (addFavourite !== prevProps.favourites.addFavourite) {

			//If addFavourite is not null
			if (addFavourite) {
				this.toast.Show(addFavourite.ReturnMsg);

				// check for internet connection
				if (await isInternet()) {

					//To get the favourites list
					this.props.getFavourites({});
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
					this.props.getFavourites({});
				}
			}
		}
	};

	// for add/remove pair to/from favorite
	async addToFavourite() {

		//check for intetnet connection
		if (await isInternet()) {

			// check for pair is alerady selected for favorite then remove from favorite otherwise add to favorite
			if (this.state.isFavorite)
				this.props.removeFavourite({ PairId: this.state.result.PairId });
			else
				this.props.addFavourite({ PairId: this.state.result.PairId });
		}
	}

	// for open URL to borwer
	onWebLinkPress(url) {
		try {
			if (url) Linking.openURL(url);
		} catch (error) {
			//handle catch block here..
		}
	}

	redirectToBuySell() {

		// Move Tab to Trade in Main Screen
		sendEvent(Events.MoveToMainScreen, 2);

		// Passing Buy Sell Data to Buy Sell Screen
		sendEvent(Events.BuySellPairData, this.state.result)

		// To Clear Market Depth Chart & Global Market Trades Data
		this.props.clearMarketTradeList();
		this.props.clearMarketDepthData();

		// Navigate to MainScreen as Trade Screen is there.
		this.props.navigation.navigate('MainScreen')
	}


	// for get color based on value
	getColor = (value) => {
		if (value == 0)
			return R.colors.textPrimary;
		else if (value > 0)
			return R.colors.buyerGreen;
		else if (value < 0)
			return R.colors.sellerPink;
		else
			return R.colors.textPrimary
	}

	render() {

		let lastPrice = '0.00000000', changePer = '0.00000000', change24 = '0.00000000', low24 = '0.00', high24 = '0.00', volume24 = '0.00';
		if (this.props.result.marketCap != null) {
			change24 = this.state.change24
			changePer = this.state.change24
			lastPrice = this.state.lastPrice
			high24 = this.state.high24
			low24 = this.state.low24
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
					onRightMenuPress={this.addToFavourite}
					rightIcon={this.state.isFavorite ? R.images.FAVORITE : R.images.SIMPLE_FAVORITE}
					rightIconStyle={{ tintColor: this.state.isFavorite ? null : R.colors.textPrimary }}
					title={this.state.result.PairName.replace('_', '/')}
					nav={this.props.navigation}
					isBack={true}
				/>

				<View style={{ flex: 1, justifyContent: 'space-between', }}>

					<View style={{ flex: 1, }}>
						<ScrollView nestedScrollEnabled={true} stickyHeaderIndices={[2]} showsVerticalScrollIndicator={false}>

							{/* Detail of Amount */}
							<View style={{ flexDirection: 'row', flex: 1, margin: R.dimens.widget_left_right_margin, }}>

								{/* for show last price and change per. */}
								<View style={{ width: '75%', }}>
									<TextViewHML style={{ color: this.getColor(lastPrice), fontSize: R.dimens.largeText, }}>{lastPrice}</TextViewHML>
									<View style={{ flexDirection: 'row', flex: 1, }}>
										<TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, }}>{change24}</TextViewHML>
										<TextViewHML style={{ color: this.getColor(changePer), fontSize: R.dimens.smallText, }}> {(parseFloatVal(changePer).toFixed(2) !== 'NaN' ? parseFloatVal(changePer).toFixed(2) : '0.00')}%</TextViewHML>
									</View>
								</View>

								{/* for show high24, low24 and volume24 value */}
								<View style={{ width: '25%', alignItems: 'flex-end', }}>
									<View style={{ flexDirection: 'row', }}>
										<TextViewHML style={{ color: R.colors.textSecondary, flex: 1, fontSize: R.dimens.smallText, textAlign: 'left' }}>{'H'}</TextViewHML>
										<TextViewHML style={{ fontSize: R.dimens.smallText, flex: 1, color: R.colors.textPrimary, textAlign: 'right' }}>{high24}</TextViewHML>
									</View>

									<View style={{ flexDirection: 'row', }}>
										<TextViewHML style={{ fontSize: R.dimens.smallText, flex: 1, color: R.colors.textSecondary, textAlign: 'left' }}>{'L'}</TextViewHML>
										<TextViewHML style={{ fontSize: R.dimens.smallText, flex: 1, color: R.colors.textPrimary, textAlign: 'right' }}>{low24}</TextViewHML>
									</View>

									<View style={{ flexDirection: 'row', }}>
										<TextViewHML style={{ fontSize: R.dimens.smallText, flex: 1, color: R.colors.textSecondary, textAlign: 'left' }}>{'24H'}</TextViewHML>
										<TextViewHML style={{ fontSize: R.dimens.smallText, flex: 1, color: R.colors.textPrimary, textAlign: 'right' }}>{volume24}</TextViewHML>
									</View>
								</View>
							</View>

							{/* for show Margin Trade Chart Widget */}
							<View style={{ height: R.dimens.chartHeightMedium, }}>
								<TradeChartWidget pairName={this.state.result.PairName} navigation={this.props.navigation} />
							</View>

							<View>
								<View style={{
									backgroundColor: R.colors.background,
									flexDirection: 'row',
									height: R.dimens.ButtonHeight,
									marginLeft: R.dimens.margin, marginRight: R.dimens.margin,
								}}>
									{this.state.tabsName.map((item, index) => <TitleItem
										isSelected={item.isSelected}
										title={item.name}
										onPress={(title) => {
											let tabsName = this.state.tabsName;
											this.state.tabsName.map((el, indexSub) => {
												tabsName[indexSub].isSelected = el.name === title;
											})
											this.setState({ tabsName, selectedTab: index });
										}}
										color={item.isSelected ? R.colors.accent : R.colors.textSecondary}
										key={item.name}
										width={(R.screen().width - (R.dimens.margin * 2)) / this.state.tabsName.length} />)
									}
								</View>
							</View>

							<View style={{ marginBottom: R.dimens.widget_top_bottom_margin, }}>

								{this.state.selectedTab == 0 && <View>
									<View style={{ height: R.dimens.chartHeightMedium, }}>
										<MarketDepthChart PairName={this.state.result.PairName} navigation={this.props.navigation} shouldDisplay={true} />
									</View>

									<View style={{ marginTop: R.dimens.widget_top_bottom_margin, }}>
										<BuyerSellerBookWidget
											isDetail={true}
											navigation={this.props.navigation}
											PairName={this.state.result.PairName}
										/>
									</View>
								</View>}

								{this.state.selectedTab == 1 && <View style={{ flex: 1, }}>
									<GlobalMarketTradeWidget
										PairName={this.state.result.PairName}
										navigation={this.props.navigation}
										shouldDisplay={true}
									/>
								</View>}

								{this.state.selectedTab == 2 && <View style={{ flex: 1, padding: R.dimens.widget_left_right_margin, }}>
									{
										this.state.coin !== null &&
										<View style={{ flex: 1, }}>

											{/* for show Coin name and introduction */}
											<TextViewMR style={{ color: R.colors.textPrimary, fontSize: R.dimens.mediumText, }}>{this.state.coin.Name}</TextViewMR>
											<TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, marginTop: R.dimens.widget_top_bottom_margin }}>{this.state.coin.Introduction}</TextViewHML>

											{/* for show issue Date */}
											<View style={{ marginTop: R.dimens.widget_top_bottom_margin, flexDirection: 'row', }}>
												<TextViewHML style={{ fontSize: R.dimens.smallestText, flex: 1, color: R.colors.textPrimary }}>{R.strings.issue_date}</TextViewHML>
												<TextViewHML style={{ fontSize: R.dimens.smallText, flex: 1, textAlign: 'right', color: R.colors.textSecondary }} ellipsizeMode={'tail'} numberOfLines={1}>{convertDate(this.state.coin.IssueDate)}</TextViewHML>
											</View>

											{/* for show Total Supply */}
											<View style={{ flexDirection: 'row', marginTop: R.dimens.widget_top_bottom_margin, }}>
												<TextViewHML style={{ flex: 1, color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>{R.strings.total_supply}</TextViewHML>
												<TextViewHML style={{ textAlign: 'right', flex: 1, fontSize: R.dimens.smallText, color: R.colors.textSecondary }} ellipsizeMode={'tail'} numberOfLines={1}>{this.state.coin.TotalSupply}</TextViewHML>
											</View>

											{/* for show Issue Price */}
											<View style={{ marginTop: R.dimens.widget_top_bottom_margin, flexDirection: 'row', }}>
												<TextViewHML style={{ fontSize: R.dimens.smallestText, flex: 1, color: R.colors.textPrimary }}>{R.strings.issue_price}</TextViewHML>
												<TextViewHML style={{ textAlign: 'right', flex: 1, fontSize: R.dimens.smallText, color: R.colors.textSecondary }} ellipsizeMode={'tail'} numberOfLines={1}>{this.state.coin.IssuePrice}</TextViewHML>
											</View>

											{/* for show circulating supply */}
											<View style={{ marginTop: R.dimens.widget_top_bottom_margin, flexDirection: 'row', }}>
												<TextViewHML style={{ flex: 1, color: R.colors.textPrimary, fontSize: R.dimens.smallestText, }}>{R.strings.circulating_supply}</TextViewHML>
												<TextViewHML style={{ flex: 1, fontSize: R.dimens.smallText, textAlign: 'right', color: R.colors.textSecondary }} ellipsizeMode={'tail'} numberOfLines={1}>{this.state.coin.CirculatingSupply}</TextViewHML>
											</View>

											{/* for show website Url */}
											<View style={{ flexDirection: 'row', marginTop: R.dimens.widget_top_bottom_margin, }}>
												<TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textPrimary, }}>{R.strings.website}</TextViewHML>
												<TouchableOpacity onPress={() => this.onWebLinkPress(this.state.coin.WebsiteUrl)}>
													<TextViewHML style={{ textAlign: 'right', flex: 1, fontSize: R.dimens.smallText, color: R.colors.textSecondary }} ellipsizeMode={'tail'} numberOfLines={1}>{this.state.coin.WebsiteUrl}</TextViewHML>
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
						<View style={{ flex: 1, }}>
							<Button
								onPress={this.redirectToBuySell}
								title={R.strings.buy.toUpperCase()}
								style={{ marginRight: R.dimens.widgetMargin, backgroundColor: R.colors.buyerGreen }}
								textStyle={{ fontSize: R.dimens.smallText, }}
							/>
						</View>
						<View style={{ flex: 1, }}>
							<Button
								onPress={this.redirectToBuySell}
								title={R.strings.sell.toUpperCase()}
								textStyle={{ fontSize: R.dimens.smallText, }}
								style={{ marginLeft: R.dimens.widgetMargin, backgroundColor: R.colors.sellerPink }}
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
				flex: 1, backgroundColor: R.colors.background
			},
		}
	}
}

const mapStateToProps = (state) => {
	// Updated Data of Market, marketCap, Favourite and coinList
	return {
		result: state.marketCapReducer,
		marketData: state.tradeData,
		coinList: state.FetchCoinReducer,
		favourites: state.favouriteReducer,
	}
}

const mapDispatchToProps = (dispatch) => ({

	// Perform Favourite Action
	getFavourites: (payload) => dispatch(getFavourites(payload)),

	// Perform MarketCap Action
	fetchMarketCap: (payload) => dispatch(fetchMarketCap(payload)),

	// Perform Remove Favorite Action
	removeFavourite: (payload) => dispatch(removeFavouriteApi(payload)),

	// Perform Add Favorite Action
	addFavourite: (payload) => dispatch(addFavouriteApi(payload)),

	// Perform Market Depth Action
	clearMarketDepthData: () => dispatch(clearMarketDepthData()),

	// Perform Market Trade Action
	clearMarketTradeList: () => dispatch(clearMarketTradeList())
})

export default connect(mapStateToProps, mapDispatchToProps)(MarketPairDetailNew);