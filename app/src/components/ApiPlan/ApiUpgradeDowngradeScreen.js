import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import R from '../../native_theme/R';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../native_theme/components/CustomToolbar';
import { changeTheme, windowPercentage, showAlert, parseIntVal, convertDateTime, addListener } from '../../controllers/CommonUtils';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { isCurrentScreen } from '../Navigation';
import { getApiPlanListData, getUserActivePlan } from '../../actions/ApiPlan/ApiPlanListAction';
import { connect } from 'react-redux';
import CardView from '../../native_theme/components/CardView';
import TextViewMR from '../../native_theme/components/TextViewMR';
import { Fonts, Events } from '../../controllers/Constants';
import TextViewHML from '../../native_theme/components/TextViewHML';
import Button from '../../native_theme/components/Button';
import ImageTextButton from '../../native_theme/components/ImageTextButton';
import PlanSubItem from './PlanSubItem';
import SafeView from '../../native_theme/components/SafeView';

class ApiUpgradeDowngradeScreen extends Component {
	constructor(props) {
		super(props);

		//Data from Previous screen
		let { ApiPlanListResponse, UserActivePlanResponse, WalletList } = props.navigation.state.params;

		let { width, height } = Dimensions.get('window');
		let contentPercentage = width * 65 / 100;

		//Define initial state
		this.state = {
			ApiPlanListResponse: ApiPlanListResponse,
			UserActivePlanResponse: UserActivePlanResponse,
			WalletList: WalletList,
			activeSlide: 0,
			onlyOnePlanDowngrade: [],
			isPortrait: width < height,
			itemWidth: windowPercentage(85, width < height ? width : contentPercentage),
		};
	}

	shouldComponentUpdate = (nextProps, _nextState) => {
		/* stop twice api call  */
		return isCurrentScreen(nextProps);
	};

	componentDidMount = () => {
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

		let onlyOnePlanDowngrade = []

		// find index of downgrage api option
		var isAvailable = this.state.ApiPlanListResponse.findIndex(item => item.Priority == this.state.UserActivePlanResponse[0].Priority)
		if (isAvailable !== -1) {
			onlyOnePlanDowngrade = this.state.ApiPlanListResponse[isAvailable - 1]
		}
		this.setState({ onlyOnePlanDowngrade: onlyOnePlanDowngrade })
	};

	// User Press on upgrade/downgrade button
	onUpgradeDowngrade = (item) => {
		let type = ''
		// If Plan is already subscribed
		if (item.Priority == this.state.UserActivePlanResponse[0].Priority) {
			showAlert(R.strings.Info + '!', R.strings.yourPlanAlreadySubscribe)
		} else {

			// Downgrade Plan
			if (item.Priority < this.state.UserActivePlanResponse[0].Priority) {
				// After Subscribed PLan, Only one plan you can downgrade
				if (this.state.onlyOnePlanDowngrade.Priority == item.Priority)
					type = 'downgrade'
				else
					type = 'cantDowngrade'
			} else {
				// Upgrade Plan
				type = 'upgrade'
			}
			let { navigate } = this.props.navigation
			navigate('ApiPlanListDetailScreen', {
				item,
				type: type,
				apiPlanResponse: this.state.ApiPlanListResponse,
				subscribeId: this.state.UserActivePlanResponse[0].PlanID,
				onRefresh: this.onRefresh,
				onSubmit: this.onSubmit,
				walletList: this.state.WalletList
			})
		}
	}

	componentWillUnmount() {
		if (this.dimensionListener) {

			// remove listener of dimensions
			this.dimensionListener.remove();
		}
	}

	render() {

		return (
			<SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

				{/* To set status bar as per our theme */}
				<CommonStatusBar />

				{/* To set toolbar as per our theme */}
				<CustomToolbar
					title={R.strings.apiPlan}
					isBack={true}
					nav={this.props.navigation} />

				<View style={{ flex: 1, }}>
					{(this.state.ApiPlanListResponse.length > 0 && this.state.UserActivePlanResponse.length > 0) ?
						<View style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center', flex: 1, paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.padding_top_bottom_margin, paddingTop: R.dimens.padding_top_bottom_margin }} >

							{/* for slider */}
							<Carousel
								extraData={this.state}
								ref={c => this._slider1Ref = c}
								data={this.state.ApiPlanListResponse}
								renderItem={({ item }) => {
									return <FlatListItem
										item={item}
										onPress={() => this.onUpgradeDowngrade(item)}
										isPortrait={this.state.isPortrait}
										itemWidth={this.state.itemWidth}
										activePlan={this.state.UserActivePlanResponse[0]}
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
								removeClippedSubviews={false}
								onSnapToItem={(index) => this.setState({ activeSlide: index })}
							/>

							{/* for pagination */}
							<Pagination
								dotsLength={this.state.ApiPlanListResponse.length}
								activeDotIndex={this.state.activeSlide}
								dotColor={R.colors.accent}
								inactiveDotColor={R.colors.textSecondary}
								inactiveDotOpacity={R.dimens.Carousel.pagination.inactiveDotOpacity}
								inactiveDotScale={R.dimens.Carousel.pagination.inactiveDotScale}
							/>
						</View>
						:
						<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
							<TextViewMR style={{ textAlign: 'center', color: R.colors.textPrimary, fontSize: R.dimens.largeText }}>{R.strings.noApiPlanAvailable}</TextViewMR>
						</View>
					}
				</View>
			</SafeView>
		);
	}
}

export class FlatListItem extends Component {
	constructor(props) {
		super(props)
	}

	shouldComponentUpdate(nextProps, _nextState) {
		//Check If Old Props and New Props are Equal then Return False
		if (this.props.item !== nextProps.item || this.props.isPortrait != nextProps.isPortrait)
			return true
		return false
	}

	// Get Plan validity
	getPlanValidity = (planValidityType) => {
		let validity = ''
		if (planValidityType == 1)
			validity = R.strings.day
		else if (planValidityType == 2)
			validity = R.strings.month
		else if (planValidityType == 3)
			validity = R.strings.Year
		return validity
	}

	render() {
		let item = this.props.item

		// User Active Plan Detail
		let activePlan = this.props.activePlan

		// Get Plan Validity
		let planValidity = this.getPlanValidity(item.PlanValidityType)

		let btnText = R.strings.SubscribeNow, btnColor = R.colors.loginButtonBackground

		// Already Subscribed Plan Button Text and Button BGColor
		if (activePlan.Priority == item.Priority) {
			btnText = R.strings.subscribed
			btnColor = R.colors.successGreen
		}

		return (
			<CardView style={this.styles().container}>
				{this.props.isPortrait ?
					<View style={{ flex: 1, justifyContent: 'space-between' }}>
						<View style={{ flex: 1, }}>

							{/* Plan Name */}
							<View style={{ justifyContent: 'center', alignItems: 'center' }}>
								<TextViewMR style={{ color: R.colors.accent, fontSize: R.dimens.mediumText, }}>{item.PlanName.toString().toUpperCase()}</TextViewMR>
							</View>

							{/* Price and PlanValidity */}
							<View style={{ flexDirection: 'row', marginTop: R.dimens.margin, justifyContent: 'center' }}>
								<TextViewMR style={{ color: R.colors.textPrimary, fontSize: R.dimens.apiPlanPriceFontSize, }}>{parseIntVal(item.Price)} USD</TextViewMR>
								<TextViewHML style={{ marginLeft: R.dimens.widgetMargin, color: R.colors.textSecondary, fontSize: R.dimens.mediumText, bottom: 0, right: 0, paddingTop: R.dimens.WidgetPadding }}>/ {item.PlanValidity + ' ' + planValidity.toLowerCase()}</TextViewHML>
							</View>

							{/* Display expiry date when already subscribed plan */}
							{
								(activePlan.Priority == item.Priority) &&
								<View style={{ marginBottom: R.dimens.widgetMargin, marginTop: R.dimens.widgetMargin, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
									<Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText, fontFamily: Fonts.MontserratSemiBold }}>{R.strings.expireOn}</Text>
									<TextViewMR style={{ marginLeft: R.dimens.widgetMargin, color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{activePlan.ExpiryDate ? convertDateTime(activePlan.ExpiryDate) : '-'}</TextViewMR>
								</View>
							}

							{/* To subscribe */}
							<Button
								isRound={true}
								textStyle={{ color: R.colors.white, fontSize: R.dimens.smallestText }}
								title={btnText.toUpperCase()}
								onPress={this.props.onPress}
								style={{
									height: R.dimens.SignUpButtonHeight,
									marginTop: activePlan.Priority == item.Priority ? 0 : R.dimens.margin_top_bottom,
									marginBottom: R.dimens.widgetMargin,
									width: this.props.itemWidth / 2,
									paddingLeft: R.dimens.margin_left_right,
									paddingRight: R.dimens.margin_left_right,
									borderColor: 'transparent',
									backgroundColor: btnColor
								}}
							/>

							{/* Plan Detail */}
							<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ marginBottom: R.dimens.widgetMargin, }}>
								<View onStartShouldSetResponder={() => true}>
									<PlanSubItem title={R.strings.maxCallDay} value={item.MaxPerDay} isWidth={true} />
									<PlanSubItem title={R.strings.maxCallMin} value={item.MaxPerMinute} isWidth={true} />
									<PlanSubItem title={R.strings.maxCallMonth} value={item.MaxPerMonth} isWidth={true} />
									<PlanSubItem title={R.strings.maxOrderPlacedSec} value={item.MaxOrderPerSec} isWidth={true} />
									<PlanSubItem title={R.strings.whiteListIpAddressLimit} value={item.WhitelistEndPoints} isWidth={true} />
									<PlanSubItem title={R.strings.concurrentIpAddressLimit} value={item.ConcurrentEndPoints} isWidth={true} />
									<PlanSubItem title={R.strings.maxRequestSize} value={item.MaxReqSize} isWidth={true} />
									<PlanSubItem title={R.strings.maxResponseSize} value={item.MaxResSize} isWidth={true} />
									<PlanSubItem title={R.strings.historicalData} value={item.HistoricalDataMonth} isWidth={true} />

									<View style={{ flexDirection: 'row', alignItems: 'center', }}>
										<TextViewHML style={{ width: '60%', fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.recursive}</TextViewHML>
										<ImageTextButton
											style={{ margin: 0, width: '40%', justifyContent: 'flex-end' }}
											icon={item.IsPlanRecursive == 1 ? R.images.IC_CHECKMARK : R.images.IC_CANCEL}
											iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: item.IsPlanRecursive == 1 ? R.colors.successGreen : R.colors.failRed }}
										/>
									</View>
								</View>
							</ScrollView>
						</View>

						{/* View More */}
						<ImageTextButton
							name={R.strings.viewMore}
							textStyle={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText, }}
							style={[this.styles().buttonStyle]}
							onPress={this.props.onPress}
							isRightIcon
							icon={R.images.IC_EXPAND_ARROW}
							iconStyle={{ width: R.dimens.iconheight, height: R.dimens.iconheight, tintColor: R.colors.textPrimary, alignSelf: 'flex-start' }}
							isHML
						/>

					</View>
					:
					<View style={{ flex: 1, justifyContent: 'space-between' }}>


						{/* Plan Name */}
						<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
							<TextViewMR style={{ color: R.colors.accent, fontSize: R.dimens.mediumText, }}>{item.PlanName.toString().toUpperCase()}</TextViewMR>
						</View>

						{/* Price and PlanValidity */}
						<View style={{ flex: 1, flexDirection: 'row', marginTop: R.dimens.margin, justifyContent: 'center' }}>
							<TextViewMR style={{ color: R.colors.textPrimary, fontSize: R.dimens.apiPlanPriceFontSize, }}>{parseIntVal(item.Price)} USD</TextViewMR>
							<TextViewHML style={{ marginLeft: R.dimens.widgetMargin, color: R.colors.textSecondary, fontSize: R.dimens.mediumText, bottom: 0, right: 0, paddingTop: R.dimens.WidgetPadding }}>/ {item.PlanValidity + ' ' + planValidity.toLowerCase()}</TextViewHML>
						</View>

						{/* Display expiry date when already subscribed plan */}
						{
							(activePlan.Priority == item.Priority) &&
							<View style={{ marginBottom: R.dimens.widgetMargin, marginTop: R.dimens.widgetMargin, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
								<Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText, fontFamily: Fonts.MontserratSemiBold }}>{R.strings.expireOn}</Text>
								<TextViewMR style={{ marginLeft: R.dimens.widgetMargin, color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{activePlan.ExpiryDate ? convertDateTime(activePlan.ExpiryDate) : '-'}</TextViewMR>
							</View>
						}

						{/* To subscribe */}
						<Button
							title={btnText.toUpperCase()}
							onPress={this.props.onPress}
							isRound={true}
							textStyle={{ color: R.colors.white, fontSize: R.dimens.smallestText }}
							style={{
								marginTop: activePlan.Priority == item.Priority ? 0 : R.dimens.margin_top_bottom,
								height: R.dimens.SignUpButtonHeight,
								width: this.props.itemWidth / 2,
								marginBottom: R.dimens.widgetMargin,
								paddingRight: R.dimens.margin_left_right,
								borderColor: 'transparent',
								paddingLeft: R.dimens.margin_left_right,
								backgroundColor: btnColor
							}}
						/>

						{/* View More */}
						<ImageTextButton
							name={R.strings.viewMore}
							isHML
							style={[this.styles().buttonStyle]}
							textStyle={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText, }}
							isRightIcon
							onPress={this.props.onPress}
							iconStyle={{ width: R.dimens.iconheight, height: R.dimens.iconheight, tintColor: R.colors.textPrimary, alignSelf: 'flex-start' }}
							icon={R.images.IC_EXPAND_ARROW}
						/>

					</View>
				}
			</CardView>
		)
	}

	// styles for this class
	styles = () => {
		return {
			container: {
				flex: 1,
				padding: R.dimens.margin,
				margin: R.dimens.CardViewElivation,
			},
			buttonStyle: {
				justifyContent: 'center',
				alignItems: 'center',
				margin: 0
			},
		}
	}
}

const mapStateToProps = (state) => {
	return {
		//For Update isPortrait true or false
		preference: state.preference.dimensions.isPortrait,
		//updated data for api plan list data and user active plan action
		ApiPlanResult: state.ApiPlanListReducer,
	}
}

const mapDispatchToProps = (dispatch) => ({
	//Perform Api Plan list Data action
	getApiPlanListData: () => dispatch(getApiPlanListData()),
	//Perform User Active Plan Data action
	getUserActivePlan: () => dispatch(getUserActivePlan()),
})

export default connect(mapStateToProps, mapDispatchToProps)(ApiUpgradeDowngradeScreen)