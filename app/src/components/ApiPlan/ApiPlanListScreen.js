// ApiPlanListScreen
import React, { Component } from 'react';
import { View, ScrollView, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../native_theme/components/CustomToolbar'
import { isCurrentScreen } from '../Navigation';
import { changeTheme, parseArray, addListener, windowPercentage, parseIntVal } from '../../controllers/CommonUtils';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { isInternet, validateResponseNew, } from '../../validations/CommonValidation';
import R from '../../native_theme/R';
import { getApiPlanListData, getUserActivePlan } from '../../actions/ApiPlan/ApiPlanListAction';
import ApiActivePlanListDetail from './ApiActivePlanListDetail';
import ListLoader from '../../native_theme/components/ListLoader';
import ImageTextButton from '../../native_theme/components/ImageTextButton';
import CardView from '../../native_theme/components/CardView';
import { ListEmptyComponent } from '../../native_theme/components/FlatListWidgets';
import TextViewHML from '../../native_theme/components/TextViewHML';
import { Fonts, Events } from '../../controllers/Constants';
import Button from '../../native_theme/components/Button';
import TextViewMR from '../../native_theme/components/TextViewMR';
import { getWallets } from '../../actions/PairListAction';
import PlanSubItem from './PlanSubItem';
import SafeView from '../../native_theme/components/SafeView';

class ApiPlanListScreen extends Component {
	constructor(props) {
		super(props);

		let { width, height } = Dimensions.get('window');
		let contentPercentage = width * 65 / 100;

		//Define All State initial state
		this.state = {
			activeSlide: 0,
			ApiPlanListResponse: [],
			UserActivePlanResponse: [],
			WalletListResponse: [],
			SubscribeID: 0,
			isFirstTime: true,
			isPortrait: width < height,
			itemWidth: windowPercentage(85, width < height ? width : contentPercentage),
		};
	}

	componentDidMount = async () => {

		// Call Listener from ApiPlanDetailScreen
		this.eventListener = addListener(Events.ApiPlanList, () => {
			this.onSubmit()
		})

		//Add this method to change theme based on stored theme name.
		changeTheme();

		// add listener for update Dimensions
		this.dimensionListener = addListener(Events.Dimensions, ({ width, height }) => {
			let contentPercentage = width * 65 / 100;
			this.setState({
				isPortrait: width < height,
				itemWidth: windowPercentage(85, width < height ? width : contentPercentage),
			})
		});

		// Check internet connection
		if (await isInternet()) {

			// API Plan List Data Api Call
			this.props.getApiPlanListData()

			if (this.props.ApiPlanResult.UserActivePlanData === null) {

				// Uset API Active Plan Api Call
				this.props.getUserActivePlan()
			}

			// Wallet Api Call
			this.props.getWallets()
		}
	};

	componentWillUnmount() {
		if (this.eventListener) {
			this.eventListener.remove();
		}
		if (this.dimensionListener) {
			// remove listener of dimensions
			this.dimensionListener.remove();
		}
	}

	shouldComponentUpdate = (nextProps, _nextState) => {
		return isCurrentScreen(nextProps);
	};

	// User press on subscribe button
	onSubscribePress = (item) => {

		// navigate to ApiPlan Detail Screen
		this.props.navigation.navigate('ApiPlanListDetailScreen', {
			onRefresh: this.onSubmit,
			item: item,
			subscribeId: item.SubscribeID,
			walletList: this.state.WalletListResponse
		})
	}

	onSubmit = async () => {
		this.setState({ ApiPlanListResponse: [], UserActivePlanResponse: [] })

		// Check internet connection
		if (await isInternet()) {

			// API Plan List Data Api Call
			this.props.getApiPlanListData()

			// Uset API Active Plan Api Call
			this.props.getUserActivePlan()
		}
	}

	static getDerivedStateFromProps(props, state) {

		//To Skip Render First Time for available reducer data if exists
		if (state.isFirstTime) {
			return {
				...state,
				isFirstTime: false,
			};
		}

		if (isCurrentScreen(props)) {

			//Get All Updated field of Particular actions
			const { apiPlanlist, UserActivePlanData, WalletListData } = props.ApiPlanResult

			// apiPlanlist is not null
			if (apiPlanlist) {
				try {
					if (state.apiPlanlist == null || (state.apiPlanlist != null && apiPlanlist !== state.apiPlanlist)) {

						// Handle Response apiPlanlist and fill in list
						if (validateResponseNew({ response: apiPlanlist, isList: true })) {

							let res = parseArray(apiPlanlist.Response);
							let subScribeId = 0
							res.map((item, index) => {
								if (item.IsSubscribePlan == 1) {
									subScribeId = item.ID
								}
							})
							return {
								...state,
								apiPlanlist,
								SubscribeID: subScribeId,
								ApiPlanListResponse: res,
							}
						} else {
							// Response apiPlanlist and fill in empty
							return {
								...state,
								apiPlanlist: null,
								ApiPlanListResponse: [],
							}
						}
					}
				} catch (error) {
					return {
						...state,
						apiPlanlist: null,
						ApiPlanListResponse: [],
					}
				}
			}

			// UserActivePlanData is not null
			if (UserActivePlanData) {
				try {
					if (state.UserActivePlanData == null || (state.UserActivePlanData != null && UserActivePlanData !== state.UserActivePlanData)) {

						// Handle Response UserActivePlanData 
						if (validateResponseNew({ response: UserActivePlanData, isList: true })) {
							let res = parseArray(UserActivePlanData.Response);
							return {
								...state,
								UserActivePlanResponse: res,
								UserActivePlanData,
							}
						} else {
							//for set no records reponse empty  
							return {
								...state,
								UserActivePlanResponse: [],
								UserActivePlanData: null,
							}
						}
					}
				} catch (error) {
					return {
						...state,
						UserActivePlanResponse: [],
						UserActivePlanData: null,
					}
				}
			}

			// WalletListData is not null
			if (WalletListData) {
				try {
					if (state.WalletListData == null || (state.WalletListData != null && WalletListData !== state.WalletListData)) {

						// Handle Response WalletListData 
						if (validateResponseNew({ response: WalletListData, isList: true })) {

							let res = parseArray(WalletListData.Wallets);
							return {
								...state,
								WalletListData,
								WalletListResponse: res,
							}
						} else {
							// set WalletListData Empty 
							return {
								...state,
								WalletListData: null,
								WalletListResponse: [],
							}
						}
					}
				} catch (error) {
				}
			}
		}
		return null
	}

	render() {

		//default active slide
		const { activeSlide } = this.state;

		//Get is Fetching value For All APIs to handle Progress bar in All Activity
		const { loading, UserActivePlanLoading, WalletListLoading } = this.props.ApiPlanResult;

		return (
			<SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

				{/* To set status bar as per our theme */}
				<CommonStatusBar />

				{/* To set toolbar as per our theme */}
				<CustomToolbar
					title={(this.state.ApiPlanListResponse.length > 0 && this.state.UserActivePlanResponse.length > 0) ? R.strings.planDetail : R.strings.apiPlan}
					isBack={true}
					nav={this.props.navigation} />

				{
					(loading || UserActivePlanLoading || WalletListLoading) ?
						<ListLoader />
						:
						(this.state.ApiPlanListResponse.length > 0) ?
							<View style={{ flex: 1 }}>
								{
									(this.state.UserActivePlanResponse.length == 0) &&
									<View style={{ flex: 1 }}>

										<View style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center', flex: 1, paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.padding_top_bottom_margin, paddingTop: R.dimens.padding_top_bottom_margin }} >

											{/* for slider */}
											<Carousel
												extraData={this.state}
												ref={c => this._slider1Ref = c}
												data={this.state.ApiPlanListResponse}
												renderItem={({ item }) => {
													return <PlanListItem
														item={item}
														onPress={() => this.onSubscribePress(item)}
														isPortrait={this.state.isPortrait}
														itemWidth={this.state.itemWidth}
													/>
												}}
												sliderWidth={Dimensions.get('window').width}
												itemWidth={this.state.itemWidth}
												hasParallaxImages={true}
												firstItem={0}
												inactiveSlideScale={0.94}
												inactiveSlideOpacity={0.7}
												inactiveSlideShift={20}
												loop={false}
												onSnapToItem={(index) => this.setState({ activeSlide: index })}
											/>
											{/* for pagination */}
											<Pagination
												dotsLength={this.state.ApiPlanListResponse.length}
												activeDotIndex={activeSlide}
												dotColor={R.colors.accent}
												inactiveDotColor={R.colors.textSecondary}
												inactiveDotOpacity={R.dimens.Carousel.pagination.inactiveDotOpacity}
												inactiveDotScale={R.dimens.Carousel.pagination.inactiveDotScale}
											/>
										</View>
									</View>
								}

								{(this.state.ApiPlanListResponse.length > 0 && this.state.UserActivePlanResponse.length > 0) &&
									<ApiActivePlanListDetail
										ApiPlanListResponse={this.state.ApiPlanListResponse}
										UserActivePlanResponse={this.state.UserActivePlanResponse}
										SubscribeId={this.state.SubscribeID}
										navigation={this.props.navigation}
										WalletList={this.state.WalletListResponse}
									/>
								}
							</View>
							:
							<ListEmptyComponent message={R.strings.noApiPlanAvailable} />
				}
			</SafeView>
		);
	}
}

export class PlanListItem extends Component {

	constructor(props) {
		super(props)
	}

	shouldComponentUpdate(nextProps, _nextState) {
		//Check If Old Props and New Props are Equal then Return False
		if (this.props.item !== nextProps.item || this.props.isPortrait != nextProps.isPortrait) { return true }
		return false
	}

	// Get Plan validity
	getPlanValidity = (planValidity) => {
		let validity = ''
		if (planValidity == 1)
			validity = R.strings.day
		else if (planValidity == 2)
			validity = R.strings.month
		else if (planValidity == 3)
			validity = R.strings.Year
		return validity
	}

	render() {
		let item = this.props.item
		let planValidity = this.getPlanValidity(item.PlanValidityType)
		return (
			<CardView style={this.styles().container}>
				{this.props.isPortrait ?
					<View style={{ flex: 1, justifyContent: 'space-between' }}>
						<View style={{ flex: 1, }}>

							{/* Plan Name */}
							<View style={{ justifyContent: 'center', alignItems: 'center' }}>
								<TextViewMR style={{ color: R.colors.accent, fontSize: R.dimens.mediumText, fontFamily: Fonts.MontserratBold }}>{item.PlanName.toString().toUpperCase()}</TextViewMR>
							</View>

							{/* Price and PlanValidity */}
							<View style={{ flexDirection: 'row', marginTop: R.dimens.margin, justifyContent: 'center' }}>
								<TextViewMR style={{ color: R.colors.textPrimary, fontSize: R.dimens.apiPlanPriceFontSize, }}>{parseIntVal(item.Price)} USD</TextViewMR>
								<TextViewHML style={{ marginLeft: R.dimens.widgetMargin, color: R.colors.textSecondary, fontSize: R.dimens.mediumText, bottom: 0, right: 0, paddingTop: R.dimens.WidgetPadding }}>/ {item.PlanValidity + ' ' + planValidity.toLowerCase()}</TextViewHML>
							</View>

							{/* To subscribe */}
							<Button
								title={R.strings.SubscribeNow.toUpperCase()}
								textStyle={{ color: R.colors.white, fontSize: R.dimens.smallestText }}
								onPress={this.props.onPress}
								isRound={true}
								style={{
									height: R.dimens.SignUpButtonHeight,
									marginTop: R.dimens.padding_top_bottom_margin,
									borderColor: 'transparent',
									width: this.props.itemWidth / 2,
									paddingLeft: R.dimens.margin_left_right,
									marginBottom: R.dimens.widgetMargin,
									paddingRight: R.dimens.margin_left_right,
									backgroundColor: R.colors.accent,
								}}
							/>

							{/* Plan Detail */}
							<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ marginBottom: R.dimens.widgetMargin, }}>

								<PlanSubItem title={R.strings.maxCallDay} value={item.MaxPerDay} isWidth={true} />
								<PlanSubItem title={R.strings.maxCallMin} value={item.MaxPerMinute} isWidth={true} />
								<PlanSubItem title={R.strings.maxCallMonth} value={item.MaxPerMonth} isWidth={true} />
								<PlanSubItem title={R.strings.maxOrderPlacedSec} value={item.MaxOrderPerSec} isWidth={true} />
								<PlanSubItem title={R.strings.whiteListIpAddressLimit} value={item.WhitelistEndPoints} isWidth={true} />
								<PlanSubItem title={R.strings.concurrentIpAddressLimit} value={item.ConcurrentEndPoints} isWidth={true} />
								<PlanSubItem title={R.strings.maxRequestSize} value={item.MaxReqSize} isWidth={true} />
								<PlanSubItem title={R.strings.maxResponseSize} value={item.MaxResSize} isWidth={true} />
								<PlanSubItem title={R.strings.historicalData} value={item.HistoricalDataMonth} isWidth={true} />

								<View style={{ flexDirection: 'row', }}>
									<TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.recursive}</TextViewHML>
									<ImageTextButton
										style={{ margin: 0, flex: 1, justifyContent: 'flex-end' }}
										icon={item.IsPlanRecursive == 1 ? R.images.IC_CHECKMARK : R.images.IC_CANCEL}
										iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: item.IsPlanRecursive == 1 ? R.colors.successGreen : R.colors.failRed }}
									/>
								</View>

							</ScrollView>
						</View>

						{/* View More */}
						<ImageTextButton
							isHML
							isRightIcon
							name={R.strings.viewMore}
							textStyle={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText, }}
							onPress={this.props.onPress}
							style={[this.styles().buttonStyle]}
							icon={R.images.IC_EXPAND_ARROW}
							iconStyle={{ width: R.dimens.iconheight, height: R.dimens.iconheight, tintColor: R.colors.textPrimary, }}
						/>
					</View>
					:
					<View style={{ flex: 1, justifyContent: 'space-between' }}>

						{/* Plan Name */}
						<View style={{ justifyContent: 'center', alignItems: 'center' }}>
							<TextViewMR style={{ color: R.colors.accent, fontSize: R.dimens.mediumText, fontFamily: Fonts.MontserratBold }}>{item.PlanName.toString().toUpperCase()}</TextViewMR>
						</View>

						{/* Price and PlanValidity */}
						<View style={{ flexDirection: 'row', marginTop: R.dimens.margin, justifyContent: 'center' }}>
							<TextViewMR style={{ color: R.colors.textPrimary, fontSize: R.dimens.apiPlanPriceFontSize, }}>{parseIntVal(item.Price)} USD</TextViewMR>
							<TextViewHML style={{ marginLeft: R.dimens.widgetMargin, color: R.colors.textSecondary, fontSize: R.dimens.mediumText, bottom: 0, right: 0, paddingTop: R.dimens.WidgetPadding }}>/ {item.PlanValidity + ' ' + planValidity.toLowerCase()}</TextViewHML>
						</View>

						{/* To subscribe */}
						<Button
							isRound={true}
							textStyle={{ color: R.colors.white, fontSize: R.dimens.smallestText }}
							title={R.strings.SubscribeNow.toUpperCase()}
							onPress={this.props.onPress}
							style={{
								height: R.dimens.SignUpButtonHeight,
								marginTop: R.dimens.padding_top_bottom_margin,
								marginBottom: R.dimens.widgetMargin,
								width: this.props.itemWidth / 2,
								paddingLeft: R.dimens.margin_left_right,
								paddingRight: R.dimens.margin_left_right,
								borderColor: 'transparent',
								backgroundColor: R.colors.accent
							}}
						/>

						{/* View More */}
						<ImageTextButton
							name={R.strings.viewMore}
							textStyle={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText, }}
							style={[this.styles().buttonStyle]}
							onPress={this.props.onPress}
							isRightIcon
							icon={R.images.IC_EXPAND_ARROW}
							iconStyle={{ width: R.dimens.iconheight, height: R.dimens.iconheight, tintColor: R.colors.textPrimary, }}
							isHML
						/>
					</View>
				}
			</CardView>
		)
	}

	// styles for this class
	styles = () => {
		return {
			buttonStyle: {
				justifyContent: 'center',
				alignItems: 'center',
				margin: 0
			},
			container: {
				flex: 1,
				padding: R.dimens.margin,
				margin: R.dimens.CardViewElivation,
			},
		}
	}
}

// return state from saga or reducer
const mapStateToProps = (state) => {
	return {
		//Updated data for api plan list detail action
		ApiPlanResult: state.ApiPlanListReducer,
	}
}

const mapDispatchToProps = (dispatch) => ({
	//Perform Api Plan list Data action
	getApiPlanListData: () => dispatch(getApiPlanListData()),
	//Perform User Active Plan Data action
	getUserActivePlan: () => dispatch(getUserActivePlan()),
	//Perform Get Wallet List Data action
	getWallets: () => dispatch(getWallets()),

})

export default connect(mapStateToProps, mapDispatchToProps)(ApiPlanListScreen) 