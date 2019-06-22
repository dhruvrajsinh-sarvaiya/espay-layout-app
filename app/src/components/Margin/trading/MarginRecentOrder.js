import React, { Component } from 'react';
import { View, FlatList, TouchableWithoutFeedback, RefreshControl } from 'react-native';
import { connect } from 'react-redux';
import { isCurrentScreen } from '../../Navigation';
import { changeTheme, parseArray, addListener, parseFloatVal, convertDateTime } from '../../../controllers/CommonUtils';
import ListLoader from '../../../native_theme/components/ListLoader';
import { contentContainerStyle, ListEmptyComponent } from '../../../native_theme/components/FlatListWidgets';
import { validateResponseNew, isInternet, validateValue } from '../../../validations/CommonValidation';
import arraySort from 'array-sort'
import { Method, ServiceUtilConstant } from '../../../controllers/Constants';
import R from '../../../native_theme/R';
import Separator from '../../../native_theme/components/Separator';
import { fetchRecentOrder, } from '../../../actions/Trade/RecentOrderAction';
import CardView from '../../../native_theme/components/CardView';
import StatusChip from '../../Widget/StatusChip';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import { getData } from '../../../App';
import AnimatableItem from '../../../native_theme/components/AnimatableItem';
import SafeView from '../../../native_theme/components/SafeView';

class MarginRecentOrder extends Component {
	constructor(props) {
		super(props);

		// data get from previous screen
		let { params } = props.navigation.state

		let ScreenName = '';

		if (props.ScreenName !== undefined) {
			ScreenName = props.ScreenName;
		} else if (params !== undefined && (params.ScreenName !== undefined)) {
			ScreenName = params.ScreenName;
		}

		// Bind All Method
		this.onRefresh = this.onRefresh.bind(this);
		this.onBottomMorePress = this.onBottomMorePress.bind(this);

		//Define All initial State
		this.state = {
			search: '',
			recentOrderResponse: [],
			refreshing: false,
			PairName: getData(ServiceUtilConstant.KEY_CurrencyPair).PairName,
			ScreenName,
		};
	}

	shouldComponentUpdate = (nextProps, nextState) => {

		//If theme or locale is changed then update componenet
		if (this.props.preference.theme !== nextProps.preference.theme || this.props.preference.locale !== nextProps.preference.locale) {
			R.colors.setTheme(nextProps.preference.theme);
			R.strings.setLanguage(nextProps.preference.locale);
			return true;
		} else {
			if (this.props.result.recentorderdata !== nextProps.result.recentorderdata ||
				this.props.result.isFetchingRecentOrder !== nextProps.result.isFetchingRecentOrder ||
				this.state.recentOrderResponse !== nextState.recentOrderResponse ||
				this.state.refreshing !== nextState.refreshing ||
				this.state.search !== nextState.search) {

				// stop twice api call
				return isCurrentScreen(nextProps);
			} else {
				return false;
			}
		}
	};

	async componentDidMount() {

		//Add this method to change theme based on stored theme name.
		changeTheme();
		this.mounted = true;

		// check for recent order data is available or not
		if (this.props.result.recentorderdata == null) {

			//Check NetWork is Available or not
			if (await isInternet()) {

				// Call Recent Order api
				this.props.fetchRecentOrder({ PairName: this.props.PairName, IsMargin: 1 });
			}
		}

		// Handle Signal-R response for Recent Order
		this.listenerRecieveRecentOrder = addListener(Method.RecieveRecentOrder, (receivedMessage) => {
			try {
				
				// check for current screen
				if (isCurrentScreen(this.props)) {

					const newData = JSON.parse(receivedMessage).Data;

					if (newData) {

						let recentOrders = this.state.recentOrderResponse;
						let recentData = [];

						var findIndexOrderId = recentOrders.findIndex(recentOrders => parseFloatVal(recentOrders.TrnNo) === parseFloatVal(newData.TrnNo));

						if (parseFloatVal(newData.Qty) > 0) {

							if (findIndexOrderId === -1) {

								recentData.push(newData)
								recentOrders.map((value) => {
									recentData.push(value);
								})
							} else {

								recentOrders[findIndexOrderId] = newData;
								recentData = recentOrders;
							}

							//Sort array based on Price in decending
							let sortedArray = arraySort(recentData, 'DateTime', { reverse: true });

							if (this.mounted) {
								this.setState({ recentOrderResponse: sortedArray });
							}
						}
					}
				}
			} catch (error) {
				// logger('Recent Orders ' + error.message)
			}
		})
	};

	componentWillUnmount = () => {
		this.mounted = false;

		// Remove Listener
		if (this.listenerRecieveRecentOrder) {
			this.listenerRecieveRecentOrder.remove();
		}
	}

	//For Swipe to referesh Functionality
	async onRefresh() {
		this.setState({ refreshing: true });

		//Check NetWork is Available or not
		if (await isInternet()) {

			//Call RecentOrder API
			this.props.fetchRecentOrder({ PairName: this.state.PairName, IsMargin: 1 })
			//----------
		} else {
			this.setState({ refreshing: false });
		}
	}

	static oldProps = {};

	static getDerivedStateFromProps(props, state) {

		// To Skip Render if old and new props are equal
		if (MarginRecentOrder.oldProps !== props) {
			MarginRecentOrder.oldProps = props;
		} else {
			return null;
		}

		// check for current screen
		if (isCurrentScreen(props)) {

			if (state.search !== props.search) {
				return Object.assign({}, state, {
					search: props.search
				})
			}

			//Get All Updated field of Particular actions
			const { recentorderdata } = props.result

			// To check recent order data is null or not
			if (recentorderdata) {
				try {
					if (state.recentOrder == null || (state.recentOrder != null && recentorderdata !== state.recentOrder)) {

						//If response is success then handle array
						if (validateResponseNew({ response: recentorderdata, isList: true })) {
							let res = parseArray(recentorderdata.response);
							return Object.assign({}, state, {
								recentOrder: recentorderdata,
								recentOrderResponse: res,
								refreshing: false
							})
						} else {
							return Object.assign({}, state, {
								recentOrder: recentorderdata,
								recentOrderResponse: [],
								refreshing: false
							})
						}
					}
				} catch (error) {
					return Object.assign({}, state, {
						recentOrderResponse: [],
						refreshing: false
					})
				}
			}
		}
		return null;
	}

	// redirect to details screen
	onBottomMorePress() {
		this.props.navigation.navigate('MarginRecentOrder', { PairName: this.state.PairName, ScreenName: 'MarginRecentOrder' })
	}

	render() {
		
		//loading bit for handling progress dialog
		var { result: { isFetchingRecentOrder } } = this.props;

		//for final items from search input (validate on TrnNo, OrderType, Status, Type, PairName)
		//default searchInput is empty so it will display all records.
		let finalItems = null;
		if (this.state.recentOrderResponse) {
			finalItems = this.state.recentOrderResponse.filter((item) =>
				('' + item.TrnNo).includes(this.state.search) ||
				item.OrderType.toLowerCase().includes(this.state.search.toLowerCase()) ||
				item.Status.toLowerCase().includes(this.state.search.toLowerCase()) ||
				item.Type.toLowerCase().includes(this.state.search.toLowerCase()) ||
				item.PairName.replace('_', '/').toLowerCase().includes(this.state.search.toLowerCase())
			)
		}

		if (this.props.isWidget !== undefined && this.props.isWidget) {
			return (
				<SafeView>
					<View style={{ marginTop: R.dimens.widgetMargin }}>
						<TextViewMR style={{
							fontSize: R.dimens.mediumText,
							color: R.colors.textPrimary,
							paddingLeft: R.dimens.margin_left_right,
							paddingRight: R.dimens.margin_left_right
						}}>{R.strings.RecentOrder}</TextViewMR>
					</View>

					{/* display title  */}
					<View style={this.styles().pairwiseflatlisttitle}>
						<TextViewHML style={{ color: R.colors.textPrimary, flex: 1, fontSize: R.dimens.smallestText }}>{R.strings.pair}</TextViewHML>
						<TextViewHML style={{ color: R.colors.textPrimary, textAlign: 'center', flex: 1, fontSize: R.dimens.smallestText }}>{R.strings.lastPrice}</TextViewHML>
						<TextViewHML style={{ color: R.colors.textPrimary, textAlign: 'right', flex: 1, fontSize: R.dimens.smallestText }}>{R.strings.Status}</TextViewHML>
					</View>

					<View style={{ marginTop: R.dimens.widgetMargin }}>
						{/* To Check Response fetch or not if isFetchingRecentOrder = true then display progress bar else display List*/}
						{
							isFetchingRecentOrder ?
								<View style={{ height: R.dimens.emptyListWidgetHeight }}>
									<ListLoader />
								</View>
								:
								<FlatList
									showsVerticalScrollIndicator={false}
									data={finalItems}
									extraData={this.state}
									ListFooterComponent={() => {
										if (finalItems.length > 0) {
											return <View>
												<ImageTextButton
													onPress={this.onBottomMorePress}
													name={R.strings.more}
													style={{ alignSelf: 'center', }}
													icon={R.images.RIGHT_ARROW_DOUBLE}
													isRightIcon
													isMR
													iconStyle={{ height: R.dimens.dashboardMenuIcon, width: R.dimens.dashboardMenuIcon, tintColor: R.colors.textSecondary }}
													textStyle={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText }} />
											</View>
										} else return null;
									}}
									renderItem={({ item, index }) => {
										if (index <= 2) {
											return <RecentOrderWidgetItem
												key={item.TrnNo.toString()}
												item={item}
												onPress={() => { this.props.navigation.navigate('RecentOrder', { PairName: 'BTC_INR', ScreenName: 'RecentOrder' }) }} />
										} else {
											return null
										}
									}}
									keyExtractor={item => item.TrnNo.toString()}
									contentContainerStyle={contentContainerStyle(this.state.recentOrderResponse)}
									ListEmptyComponent={<View style={{ height: R.dimens.emptyListWidgetHeight }}>
										<ListEmptyComponent />
									</View>}
								/>
						}
					</View>
				</SafeView>
			);
		} else {
			return (
				<SafeView style={this.styles().container}>
					{/* To Check Response fetch or not if isFetchingRecentOrder = true then display progress bar else display List*/}
					{
						(isFetchingRecentOrder && !this.state.refreshing) ?
							<ListLoader />
							:
							<FlatList
								showsVerticalScrollIndicator={false}
								data={finalItems}
								renderItem={({ item, index }) => <RecentOrderItem
									key={item.TrnNo.toString()}
									item={item}
									index={index}
									size={this.state.recentOrderResponse.length}
								/>}
								keyExtractor={item => item.TrnNo.toString()}
								contentContainerStyle={contentContainerStyle(finalItems)}
								ListEmptyComponent={<ListEmptyComponent />}
								/* for refreshing data of flatlist */
								refreshControl={
									<RefreshControl
										colors={[R.colors.accent]}
										progressBackgroundColor={R.colors.background}
										refreshing={this.state.refreshing}
										onRefresh={this.onRefresh}
									/>}
							/>
					}
				</SafeView>
			);
		}
	}

	// styles for this class
	styles = () => {
		return {
			container: {
				flex: 1,
				backgroundColor: R.colors.background,
			},
			pairwiseflatlisttitle: {
				flexDirection: "row",
				paddingTop: R.dimens.widgetMargin,
				paddingLeft: R.dimens.widget_left_right_margin,
				paddingRight: R.dimens.widget_left_right_margin,
			}
		}
	}
}

class RecentOrderWidgetItem extends Component {

	shouldComponentUpdate = (nextProps) => {
		
		//Check If Old Props and New Props are Equal then Return False
		if (this.props.item !== nextProps.item) {
			return true;
		} else {
			return false;
		}
	}

	render() {

		// Get required fields from props
		let item = this.props.item
		let price = parseFloatVal(item.Price) == 0 ? R.strings.market : parseFloatVal(item.Price).toFixed(8);

		//if colors are available in item then use it otherwise display default colors.
		let typeColor = item.Type.toUpperCase() === R.strings.buy.toUpperCase() ? R.colors.buyerGreen : R.colors.sellerPink;
		let currentRateColor = item.currentRateColor ? item.currentRateColor : R.colors.textPrimary;
		let type = item.Type.toUpperCase()
		return (
			<AnimatableItem>
				<TouchableWithoutFeedback onPress={this.props.onPress}>
					<View>
						{/* to show Pair name and type, price and Status */}
						<View style={{ flexDirection: 'row', margin: R.dimens.widget_left_right_margin, }}>
							<View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
								<TextViewMR style={{ color: R.colors.textPrimary, fontSize: R.dimens.firstCurrencyText }}>{item.PairName.split('_')[0]} </TextViewMR>
								<TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.widget_left_right_margin }}>/ {item.PairName.split('_')[1]}</TextViewHML>
								<TextViewHML style={{ color: typeColor, fontSize: R.dimens.smallestText }}> {type}</TextViewHML>
							</View>
							<TextViewHML style={{ flex: 1, textAlign: 'center', color: currentRateColor, fontSize: R.dimens.firstCurrencyText }}>{price}</TextViewHML>
							<TextViewHML style={{ flex: 1, textAlign: 'right', color: R.colors.textPrimary, fontSize: R.dimens.firstCurrencyText }}>{item.Status}</TextViewHML>
						</View>
						<Separator />
					</View>
				</TouchableWithoutFeedback>
			</AnimatableItem>
		)
	}
}

class RecentOrderItem extends Component {

	shouldComponentUpdate = (nextProps) => {
		
		//Check If Old Props and New Props are Equal then Return False
		if (this.props.item !== nextProps.item) {
			return true;
		} else {
			return false;
		}
	}

	render() {

		// Get Required field from props
		let { item, onPress, index, size } = this.props

		// set color based on status value
		let color = R.colors.textSecondary;
		if (item.Status === 'Success')
			color = R.colors.successGreen;
		else if (item.Status === 'Hold')
			color = R.colors.accent;
		else
			color = R.colors.failRed;

		let timeDate = item.DateTime ? convertDateTime(item.DateTime, 'YYYY-MM-DD HH:mm:ss A', false) : '-';

		return (
			<AnimatableItem>
				<View style={{
					flex: 1,
					marginTop: (index == 0) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
					marginBottom: (index == size - 1) ? R.dimens.widget_top_bottom_margin : R.dimens.widgetMargin,
					marginLeft: R.dimens.widget_left_right_margin,
					marginRight: R.dimens.widget_left_right_margin
				}}>
					<CardView style={{
						elevation: R.dimens.listCardElevation,
						flex: 1,
						borderRadius: 0,
						borderBottomLeftRadius: R.dimens.margin,
						borderTopRightRadius: R.dimens.margin,
					}} onPress={onPress}>
						<View style={{ flex: 1 }}>
							{/* for display pairname, ordertype and trn no */}
							<View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row' }}>
								<View>
									<View style={{ flexDirection: 'row', }}>
										<TextViewMR style={{
											color: R.colors.textPrimary,
											fontSize: R.dimens.smallText,
										}}>
											{item.PairName.replace('_', '/')}
										</TextViewMR>
										<TextViewHML style={{
											color: item.Type.toLowerCase().includes('buy') ? R.colors.buyerGreen : R.colors.sellerPink,
											fontSize: R.dimens.volumeText, marginLeft: R.dimens.widgetMargin
										}}>
											{item.Type + ' - ' + item.OrderType}
										</TextViewHML>
									</View>
									<View style={{ flexDirection: 'row', marginLeft: R.dimens.widgetMargin }}>
										<TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{R.strings.TxnID} : </TextViewHML>
										<TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}> {validateValue(item.TrnNo)}  </TextViewHML>
									</View>
								</View>
								<View>
									<StatusChip
										color={color}
										value={item.Status ? item.Status : '-'}></StatusChip>
								</View>
							</View>

							{/* for show qty,price and settleqty */}
							<View style={{ flexDirection: 'row' }}>
								<View style={{ flex: 1, alignItems: 'center' }}>
									<TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.volumeText }}>{R.strings.Qty}</TextViewHML>
									<TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.volumeText }}>{item.Qty ? parseFloatVal(item.Qty).toFixed(8) : '-'}</TextViewHML>
								</View>
								<View style={{ flex: 1, alignItems: 'center' }}>
									<TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.volumeText }}>{R.strings.Price}</TextViewHML>
									<TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.volumeText }}>{item.Price ? parseFloatVal(item.Price).toFixed(8) : '-'}</TextViewHML>
								</View>
								<View style={{ flex: 1, alignItems: 'center' }}>
									<TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.volumeText, }}>{R.strings.stl_qty}</TextViewHML>
									<TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.volumeText }}>{item.SettledQty ? parseFloatVal(item.SettledQty).toFixed(8) : '-'}</TextViewHML>
								</View>
							</View>

							{/* for show Datetime */}
							{timeDate !== '-' && <ImageTextButton
								icon={R.images.IC_TIMER}
								isHML
								name={timeDate}
								style={{ margin: 0, marginTop: R.dimens.widgetMargin, flexDirection: 'row-reverse' }}
								textStyle={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, marginLeft: R.dimens.widgetMargin }}
								iconStyle={{ width: R.dimens.smallestText, height: R.dimens.smallestText, tintColor: R.colors.textSecondary }}
							/>}
						</View>
					</CardView>
				</View>
			</AnimatableItem>
		)
	}
}

function mapStatToProps(state) {
	// Updated Data of RecentOrder adn Preference
	return {
		result: state.recentOrderReducer,
		preference: state.preference
	}
}

function mapDispatchToProps(dispatch) {
	return {
		// Perform RecentOrder Action
		fetchRecentOrder: (parmas) => dispatch(fetchRecentOrder(parmas)),
	}
}

export default connect(mapStatToProps, mapDispatchToProps)(MarginRecentOrder);