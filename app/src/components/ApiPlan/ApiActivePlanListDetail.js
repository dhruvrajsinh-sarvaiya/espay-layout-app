import React, { Component } from 'react';
import { View, Text, ScrollView } from 'react-native';
import R from '../../native_theme/R';
import ImageButton from '../../native_theme/components/ImageTextButton';
import Button from '../../native_theme/components/Button';
import { isCurrentScreen } from '../Navigation';
import { changeTheme, convertDate, showAlert, parseArray, parseIntVal, convertDateTime } from '../../controllers/CommonUtils';
import AlertDialog from '../../native_theme/components/AlertDialog';
import { validateValue, validateResponseNew, isInternet } from '../../validations/CommonValidation';
import { connect } from 'react-redux';
import { getApiPlanListData, getUserActivePlan } from '../../actions/ApiPlan/ApiPlanListAction';
import { Fonts } from '../../controllers/Constants';
import TextViewHML from '../../native_theme/components/TextViewHML';
import TextViewMR from '../../native_theme/components/TextViewMR';
import IndicatorViewPager from '../../native_theme/components/IndicatorViewPager';
import { FeatureSwitch } from '../../native_theme/components/FeatureSwitch';
import Separator from '../../native_theme/components/Separator';
import ImageTextButton from '../../native_theme/components/ImageTextButton';
import { ListEmptyComponent } from '../../native_theme/components/FlatListWidgets';
import PlanSubItem from './PlanSubItem';
import SafeView from '../../native_theme/components/SafeView';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

class ApiActivePlanListDetail extends Component {
	constructor(props) {
		super(props);

		let currentCoin = '', currentBalance = 0

		// Get Current Coin and Current Balance
		props.WalletList.map((item) => {
			if (item.CoinName === props.UserActivePlanResponse.Coin && item.IsDefaultWallet == 1) {
				currentCoin = item.CoinName
				currentBalance = item.Balance
			}
		})

		//Define initial state
		this.state = {
			// From Props
			ApiPlanListResponse: props.ApiPlanListResponse ? props.ApiPlanListResponse : [],
			UserActivePlanResponse: props.UserActivePlanResponse ? props.UserActivePlanResponse : [],
			SubscribeId: props.SubscribeId ? props.SubscribeId : 0,
			CurrentBal: currentBalance,
			CurrentCoin: currentCoin,
			WalletList: props.WalletList,
			isFirstTime: true,
			isUpgradeAlert: false,
			tabsName: [R.strings.Info, R.strings.apiMethods, R.strings.subscription],
			isToggle: true,
		};
	}

	componentDidMount = async () => {
		//Add this method to change theme based on stored theme name.
		changeTheme();
	}

	shouldComponentUpdate = (nextProps, _nextState) => {
		return isCurrentScreen(nextProps);
	};

	onRefresh = async () => {
		// Check internet connection
		if (await isInternet()) {

			// API Plan List Data Api Call
			this.props.getApiPlanListData()

			// Uset API Active Plan Api Call
			this.props.getUserActivePlan()
		}
	}

	// User Click on Set Auto Renew Api Button
	onAutoRenewPlan = (item) => {
		let { navigate } = this.props.navigation
		navigate('SetAutoRenewApiPlan', { UserActivePlan: item, ApiPlanList: this.state.ApiPlanListResponse, onRefresh: this.onRefresh })
	}

	// User Click on Renew Now Plan Button
	onManualRenewPlan = (item) => {
		let { navigate } = this.props.navigation

		// If already set auto renew plan then display confirmation dialog
		if (item && item.IsAutoRenew == 1) {

			// Show Confirmation Dialog
			showAlert(R.strings.warning + '!', R.strings.alreadySetAutoPlan + ' ' + (item.ExpiryDate ? convertDate(item.ExpiryDate) : '') + ', ' + R.strings.areYouSureToRenewPlan, 3, () => {
				navigate('ManualRenewPlan', { WalletList: this.state.WalletList, UserActivePlan: item, ApiPlanList: this.state.ApiPlanListResponse, onRefresh: this.onRefresh })
			}, R.strings.cancel, () => { });
		} else {
			navigate('ManualRenewPlan', { WalletList: this.state.WalletList, UserActivePlan: item, ApiPlanList: this.state.ApiPlanListResponse, onRefresh: this.onRefresh })
		}
	}

	// Navigate to ApiUpgradeDowngrade Screen when user press on change plan button
	onChangePlan = () => {
		this.setState({ isUpgradeAlert: false, })

		// wait for setState
		setTimeout(() => {
			let { navigate } = this.props.navigation
			navigate('ApiUpgradeDowngradeScreen', { WalletList: this.state.WalletList, ApiPlanListResponse: this.state.ApiPlanListResponse, UserActivePlanResponse: this.state.UserActivePlanResponse })
		}, 30)
	}

	// Navigate to SetCustomLimitsForKeys Screen when user press on Custom Limits Button
	onCustomLimitPress = () => {
		let { navigate } = this.props.navigation
		navigate('SetCustomLimitsForKeys', { UserActivePlan: this.state.UserActivePlanResponse })
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

	// Get Subscribe Status
	getSubscribeStatus = (statusType) => {
		let statusText = ''
		if (statusType == 1)
			statusText = R.strings.subscribed
		else if (statusType == 9)
			statusText = R.strings.expire
		else if (statusType == 6)
			statusText = R.strings.Pending
		else if (statusType == 0)
			statusText = R.strings.inProcess
		else
			statusText = '-'
		return statusText
	}

	// Get Subscribe Status Color
	getSubscribeStatusColor = (statusType) => {
		let statusColor = ''
		if (statusType == 1)
			statusColor = R.colors.successGreen
		else if (statusType == 9)
			statusColor = R.colors.failRed
		else if (statusType == 6)
			statusColor = R.colors.yellow
		else if (statusType == 0)
			statusColor = R.colors.accent
		else
			statusColor = R.colors.textPrimary
		return statusColor
	}

	// return renewal status
	getRenewalStatus = (statusType) => {
		let statusText = ''
		if (statusType == 1)
			statusText = R.strings.Success
		else if (statusType == 3)
			statusText = R.strings.Failed
		else if (statusType == 6)
			statusText = R.strings.Pending
		else if (statusType == 4)
			statusText = R.strings.Hold
		else
			statusText = '-'
		return statusText
	}

	// return renewal status color
	getRenewalStatusColor = (statusType) => {
		let statusColor = ''
		if (statusType == 1)
			statusColor = R.colors.successGreen
		else if (statusType == 3)
			statusColor = R.colors.failRed
		else if (statusType == 6)
			statusColor = R.colors.yellow
		else if (statusType == 4)
			statusColor = R.colors.accent
		else
			statusColor = R.colors.textPrimary
		return statusColor
	}

	// return plan description
	getPlanDesc = (priority) => {
		let desc = ''
		this.state.ApiPlanListResponse.map((item) => {
			if (priority == item.Priority)
				desc = item.PlanDesc
		})
		return desc
	}

	// Navigate to StopAutoRenewApiPlan when user togglling of switch
	onSwitchToggle = () => {
		let { navigate } = this.props.navigation
		if (this.state.isToggle) {
			navigate('StopAutoRenewApiPlan', { onRefresh: this.onRefresh })
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
			const { apiPlanlist, UserActivePlanData } = props.ApiPlanResult

			// apiPlanlist is not null
			if (apiPlanlist) {
				try {
					if (state.apiPlanlist == null || (state.apiPlanlist != null && apiPlanlist !== state.apiPlanlist)) {

						// Handle Response active plan list 
						if (validateResponseNew({ response: apiPlanlist, isList: true })) {
							let res = parseArray(apiPlanlist.Response);
							let subScribeId = 0
							res.map((item, index) => {
								if (item.IsSubscribePlan == 1)
									subScribeId = item.ID
							})
							return {
								...state,
								apiPlanlist,
								SubscribeId: subScribeId,
								ApiPlanListResponse: res
							}
						} else {
							//api active plan list empty
							return {
								...state,
								ApiPlanListResponse: [],
								apiPlanlist: null
							}
						}
					}
				} catch (error) {
					return {
						...state,
						ApiPlanListResponse: [],
						apiPlanlist: null
					}
				}
			}

			// UserActivePlanData is not null
			if (UserActivePlanData) {
				try {
					if (state.UserActivePlanData == null || (state.UserActivePlanData != null && UserActivePlanData !== state.UserActivePlanData)) {

						// Handle Response User active plan 
						if (validateResponseNew({ response: UserActivePlanData, isList: true })) {
							let res = parseArray(UserActivePlanData.Response);
							return {
								...state,
								UserActivePlanResponse: res,
								UserActivePlanData,
								isToggle: !state.isToggle
							}
						} else {
							//User active plan fill empty 
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
		}
		return null
	}

	render() {
		let item = this.state.UserActivePlanResponse[0]

		// get plan validity in day/month/year
		let planValidity = this.getPlanValidity(item.PlanValidityType)
		// get subscribe status in subscribed/expire/pending/inprocess
		let subscribeStatus = this.getSubscribeStatus(item.SubScribeStatus)
		// get subscribe status color
		let subscribeStatusColor = this.getSubscribeStatusColor(item.SubScribeStatus)
		// get renewal status in success/hold/pending/failed
		let renewStatus = this.getRenewalStatus(item.RenewStatus)
		// get renewStatus color
		let renewStatusColor = this.getRenewalStatusColor(item.RenewStatus)
		// get Plan Description
		let planDesc = this.getPlanDesc(item.Priority)

		return (
			<SafeView style={{ flex: 1, }}>

				<View style={{ flex: 1, overflow: 'hidden' }}>
					<IndicatorViewPager
						isGradient={true}
						titles={this.state.tabsName}
						numOfItems={3}
						style={{ marginLeft: R.dimens.margin_left_right, marginRight: R.dimens.margin_left_right }}>

						{/* Info Tab */}
						<View>
							<ScrollView showsVerticalScrollIndicator={false}>
								<View style={{ flex: 1, padding: R.dimens.margin_left_right }}>

									{/* Get Current Coin and their balance */}
									<CurrentCoinAndBal currentCoin={this.state.CurrentCoin} currentBal={this.state.CurrentBal} />

									{/* PlanName and Active/Inactive Status */}
									<PlanNameAndStatus subscribeStatusColor={subscribeStatusColor} subscribeStatus={subscribeStatus} PlanName={item.PlanName} />

									{/* Price and PlanValidity */}
									<View style={{ flexDirection: 'row', marginTop: R.dimens.margin, alignItems: 'center', }}>
										<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
											<TextViewMR style={{ color: R.colors.textPrimary, fontSize: R.dimens.mediumText, }}>{parseIntVal(item.Price)}</TextViewMR>
											<TextViewMR style={{ marginLeft: R.dimens.widgetMargin, color: R.colors.textSecondary, fontSize: R.dimens.mediumText, }}>USD</TextViewMR>
											<TextViewHML style={{ marginLeft: R.dimens.widgetMargin, color: R.colors.textSecondary, fontSize: R.dimens.smallestText, bottom: 0, right: 0, paddingTop: R.dimens.widgetMargin }}>/ {item.PlanValidity + ' ' + planValidity.toLowerCase()}</TextViewHML>
										</View>
										<Button
											isRound={true}
											textStyle={{ fontSize: R.dimens.secondCurrencyText }}
											style={{ height: R.dimens.apiPlanButtonHeight, paddingLeft: R.dimens.margin, paddingRight: R.dimens.margin, marginTop: R.dimens.widgetMargin, marginBottom: R.dimens.widgetMargin, padding: 0, }}
											title={R.strings.changePlan.toUpperCase()}
											onPress={() => this.setState({ isUpgradeAlert: true })} />
									</View>

									{/* Plan Description */}
									<View style={{ marginTop: R.dimens.margin, }}>
										<TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>{planDesc}</TextViewHML>
									</View>

									{/* Custom Limits */}
									<View style={{ marginTop: R.dimens.margin, flexDirection: 'row', alignItems: 'center', }}>
										<TextViewMR style={{ flex: 1, color: R.colors.textSecondary, fontSize: R.dimens.smallText }}>{R.strings.apiLimits}</TextViewMR>
										<Button
											isRound={true}
											textStyle={{ fontSize: R.dimens.secondCurrencyText }}
											style={{
												height: R.dimens.apiPlanButtonHeight,
												paddingLeft: R.dimens.margin,
												paddingRight: R.dimens.margin,
												padding: 0,
												marginTop: R.dimens.widgetMargin,
												marginBottom: R.dimens.widgetMargin,
											}}
											title={R.strings.customLimits.toUpperCase()}
											onPress={this.onCustomLimitPress} />
									</View>

									<Separator style={{ marginTop: R.dimens.margin, marginLeft: 0, marginRight: 0 }} />

									<ScrollView showsVerticalScrollIndicator={false}>
										<View style={{ marginTop: R.dimens.margin, justifyContent: 'center' }}>

											<PlanSubItem title={R.strings.maxCallDay} value={item.MaxPerDay} />
											<PlanSubItem title={R.strings.maxCallMin} value={item.MaxPerMinute} />
											<PlanSubItem title={R.strings.maxCallMonth} value={item.MaxPerMonth} />
											<PlanSubItem title={R.strings.maxOrderPlacedSec} value={item.MaxOrderPerSec} />
											<PlanSubItem title={R.strings.whiteListIpAddressLimit} value={item.WhitelistedEndPoints} />
											<PlanSubItem title={R.strings.concurrentIpAddressLimit} value={item.ConcurrentEndPoints} />
											<PlanSubItem title={R.strings.maxRequestSize} value={item.MaxReqSize} />
											<PlanSubItem title={R.strings.maxResponseSize} value={item.MaxResSize} />
											<PlanSubItem title={R.strings.historicalData} value={item.HistoricalDataMonth} />

											<View style={{ flex: 1, flexDirection: 'row', }}>
												<TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.recursive}</TextViewHML>
												<ImageTextButton
													style={{ margin: 0, flex: 1, }}
													icon={item.IsPlanRecursive == 1 ? R.images.IC_CHECKMARK : R.images.IC_CANCEL}
													iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: item.IsPlanRecursive == 1 ? R.colors.successGreen : R.colors.failRed }}
												/>
											</View>

										</View>
									</ScrollView>
								</View>
							</ScrollView>
						</View>

						{/* API Methods Tab */}
						<View>
							<View style={{ flex: 1, padding: R.dimens.margin_left_right }}>

								{/* Get Current Coin and their balance */}
								<CurrentCoinAndBal currentCoin={this.state.CurrentCoin} currentBal={this.state.CurrentBal} />

								{/* PlanName and Active/Inactive Status */}
								<PlanNameAndStatus subscribeStatusColor={subscribeStatusColor} subscribeStatus={subscribeStatus} PlanName={item.PlanName} />

								{/* Price and PlanValidity */}
								<View style={{ flexDirection: 'row', marginTop: R.dimens.margin, alignItems: 'center', }}>
									<TextViewMR style={{ color: R.colors.textPrimary, fontSize: R.dimens.mediumText, }}>{parseIntVal(item.Price)}</TextViewMR>
									<TextViewMR style={{ marginLeft: R.dimens.widgetMargin, color: R.colors.textSecondary, fontSize: R.dimens.mediumText, }}>USD</TextViewMR>
									<TextViewHML style={{ marginLeft: R.dimens.widgetMargin, color: R.colors.textSecondary, fontSize: R.dimens.smallestText, bottom: 0, right: 0, paddingTop: R.dimens.widgetMargin }}>/ {item.PlanValidity + ' ' + planValidity.toLowerCase()}</TextViewHML>
								</View>


								{
									(item.ReadOnlyAPI != null && Object.values(item.ReadOnlyAPI).length > 0 || item.FullAccessAPI != null && Object.values(item.FullAccessAPI).length > 0) ?
										<View style={{ flex: 1 }}>
											<ScrollView showsVerticalScrollIndicator={false}>

												{/* Read Only Method List Title */}
												{
													item.ReadOnlyAPI != null && Object.values(item.ReadOnlyAPI).length > 0 &&
													<View style={{ marginTop: R.dimens.margin, }}>
														<Text style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold }}>{R.strings.readOnly}</Text>
														<Separator style={{ marginTop: R.dimens.widgetMargin, marginBottom: R.dimens.widgetMargin, marginLeft: 0, marginRight: 0 }} />
													</View>
												}

												{/* Read Only Method List Detail */}
												<View>
													{
														item.ReadOnlyAPI != null && Object.values(item.ReadOnlyAPI).map((item, index) =>
															<View style={{ flexDirection: 'row' }} key={index.toString()}>
																<TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textSecondary }}>{item}</TextViewHML>
																<ImageButton
																	style={{ margin: 0, }}
																	icon={R.images.IC_CHECK_CIRCLE}
																	iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: R.colors.successGreen }}
																/>
															</View>
														)
													}
												</View>

												{/* Full Access Method List Title */}
												{
													item.FullAccessAPI != null && Object.values(item.FullAccessAPI).length > 0 &&
													<View style={{ marginTop: R.dimens.margin_top_bottom, }}>
														<Text style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold }}>{R.strings.fullAccess}</Text>
														<Separator style={{ marginTop: R.dimens.widgetMargin, marginBottom: R.dimens.widgetMargin, marginLeft: 0, marginRight: 0 }} />
													</View>
												}

												{/* Full Access Method List Title */}
												<View>
													{
														item.FullAccessAPI != null && Object.values(item.FullAccessAPI).map((item, index) =>
															<View style={{ flexDirection: 'row' }} key={index.toString()}>
																<TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textSecondary }}>{item}</TextViewHML>
																<ImageButton
																	style={{ margin: 0, }}
																	icon={R.images.IC_CHECK_CIRCLE}
																	iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: R.colors.successGreen }}
																/>
															</View>
														)
													}
												</View>
											</ScrollView>
										</View>
										:
										<ListEmptyComponent message={R.strings.noApiMethodRequested} />
								}
							</View>
						</View>

						{/* Subscription Tab */}
						<View>
							<ScrollView showsVerticalScrollIndicator={false}>
								<View style={{ flex: 1, padding: R.dimens.margin_left_right }}>

									{/* Get Current Coin and their balance */}
									<CurrentCoinAndBal currentCoin={this.state.CurrentCoin} currentBal={this.state.CurrentBal} />

									{/* PlanName and Active/Inactive Status */}
									<PlanNameAndStatus subscribeStatusColor={subscribeStatusColor} subscribeStatus={subscribeStatus} PlanName={item.PlanName} />

									{/* Price and PlanValidity */}
									<View style={{ flexDirection: 'row', marginTop: R.dimens.margin, alignItems: 'center', }}>
										<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
											<TextViewMR style={{ color: R.colors.textPrimary, fontSize: R.dimens.mediumText, }}>{parseIntVal(item.Price)}</TextViewMR>
											<TextViewMR style={{ marginLeft: R.dimens.widgetMargin, color: R.colors.textSecondary, fontSize: R.dimens.mediumText, }}>USD</TextViewMR>
											<TextViewHML style={{ marginLeft: R.dimens.widgetMargin, color: R.colors.textSecondary, fontSize: R.dimens.smallestText, bottom: 0, right: 0, paddingTop: R.dimens.widgetMargin }}>/ {item.PlanValidity + ' ' + planValidity.toLowerCase()}</TextViewHML>
										</View>
										{
											(item.IsPlanRecursive == 1 && item.IsAutoRenew == 1) &&
											<Button
												isRound={true}
												textStyle={{ fontSize: R.dimens.secondCurrencyText }}
												style={{ marginTop: R.dimens.widgetMargin, marginBottom: R.dimens.widgetMargin, height: R.dimens.apiPlanButtonHeight, paddingLeft: R.dimens.margin, paddingRight: R.dimens.margin, padding: 0, }}
												title={R.strings.renew.toUpperCase()}
												onPress={() => this.onManualRenewPlan(item)} />
										}
									</View>

									{/* Plan Detail */}
									<View style={{ marginTop: R.dimens.margin }}>

										<PlanSubItem title={R.strings.subscriptionStatus} value={subscribeStatus} isBold={true} leftAlign={true} />
										<PlanSubItem title={R.strings.requestedON} value={item.RequestedDate ? convertDateTime(item.RequestedDate) : '-'} />
										<PlanSubItem title={R.strings.activatedON} value={item.ActivationDate ? convertDateTime(item.ActivationDate) : '-'} />
										<PlanSubItem title={R.strings.expireOn} value={item.ExpiryDate ? convertDateTime(item.ExpiryDate) : '-'} />
										<PlanSubItem title={R.strings.paymentStatus} value={item.PaymentStatus == 1 ? R.strings.Success : R.strings.notDone} leftAlign={true} isBold={true} styles={{ color: item.PaymentStatus == 1 ? R.colors.successGreen : R.colors.failRed }} />

									</View>

									{/* Renewal Detail */}
									{
										(item.IsPlanRecursive == 1 && item.IsAutoRenew == 1) &&
										<View style={{ marginTop: R.dimens.margin, }}>
											<View style={{ flexDirection: 'row', alignItems: 'center' }}>
												<TextViewMR style={{ width: wp('70%'), color: R.colors.textSecondary, fontSize: R.dimens.smallText }}>{R.strings.autoRenew}</TextViewMR>
												<FeatureSwitch
													reverse={true}
													title={this.state.isToggle ? R.strings.on : R.strings.off}
													textStyle={{ marginLeft: R.dimens.widgetMargin }}
													isToggle={this.state.isToggle}
													onValueChange={this.onSwitchToggle}
													style={{ backgroundColor: 'transparent', paddingTop: 0, paddingBottom: 0, }}
												/>
											</View>

											<Separator style={{ marginTop: R.dimens.widgetMargin, marginBottom: R.dimens.widgetMargin, marginLeft: 0, marginRight: 0 }} />

											<PlanSubItem title={R.strings.validityPeriod} value={item.PlanValidity + ' ' + planValidity} />
											<PlanSubItem title={R.strings.nextRenewalOn} value={item.RenewDate ? convertDateTime(item.RenewDate) : '-'} />
											<PlanSubItem title={R.strings.renewCycle} value={item.RenewDays + ' ' + R.strings.day} />
											<PlanSubItem title={R.strings.renewalStatus} value={renewStatus} styles={{ color: renewStatusColor }} />
										</View>
									}

									{/* Price,Amount and Total Amount */}
									<View style={{ marginTop: R.dimens.margin }}>
										<PlanSubItem title={R.strings.Amount} value={item.Price + ' USD'} />
										<PlanSubItem title={R.strings.fee} value={item.Charge + ' USD'} />

										<View style={{ flexDirection: 'row', alignItems: 'center', }}>
											<Text style={[this.styles().itemTitle, { fontFamily: Fonts.MontserratSemiBold, fontSize: R.dimens.firstCurrencyText, }]}>{R.strings.TotalAmount}</Text>
											<Text style={[this.styles().itemValue, { fontFamily: Fonts.MontserratSemiBold, fontSize: R.dimens.firstCurrencyText, color: R.colors.accent }]}>{validateValue(item.TotalAmt + ' USD')}</Text>
										</View>

									</View>

									{/* RenewNow and SetAuto Renew Button */}
									{
										(item.IsPlanRecursive == 1 && item.IsAutoRenew == 0) &&
										<View style={{ flex: 1, marginTop: R.dimens.margin, flexDirection: 'row', }}>


											<View style={{ flex: 1, marginRight: R.dimens.margin, }}>
												<Button
													isRound={true}
													textStyle={{ fontSize: R.dimens.smallestText }}
													style={{ margin: R.dimens.widgetMargin, height: R.dimens.SignUpButtonHeight, paddingLeft: R.dimens.margin, paddingRight: R.dimens.margin, padding: 0, }}
													title={R.strings.renewNow.toUpperCase()}
													onPress={() => this.onManualRenewPlan(item)} />
											</View>

											<View style={{ flex: 1, }}>
												<Button
													isRound={true}
													textStyle={{ fontSize: R.dimens.smallestText }}
													style={this.styles().autoRenewButton}
													title={R.strings.autoRenew.toUpperCase()}
													onPress={() => this.onAutoRenewPlan(item)}
													disabled={item.IsAutoRenew == 0 ? false : true} />
											</View>

										</View>
									}
								</View>
							</ScrollView>
						</View>
					</IndicatorViewPager>
				</View >

				{/* Alert for Upgarde */}
				< AlertDialog
					visible={this.state.isUpgradeAlert}
					title={R.strings.warning + '!'}
					negativeButton={{
						title: R.strings.cancel,
						onPress: () => this.setState({ isUpgradeAlert: !this.state.isUpgradeAlert, })
					}
					}
					positiveButton={{
						title: R.strings.confirm,
						onPress: () => this.onChangePlan(),
					}}
					requestClose={() => null}
					toastRef={component => this.toastDialog = component} >
					{/* Description */}
					< TextViewHML style={{
						paddingTop: R.dimens.WidgetPadding,
						paddingBottom: R.dimens.WidgetPadding,
						color: R.colors.textPrimary,
						fontSize: R.dimens.smallText,
						textAlign: 'center'
					}}> {R.strings.upgradeWarning}</TextViewHML >
				</AlertDialog >
			</SafeView >
		);
	}

	// styles for this class
	styles = () => {
		return {
			itemTitle: {
				flex: 1,
				fontSize: R.dimens.smallestText,
				color: R.colors.textSecondary,
			},
			itemValue: {
				flex: 1,
				fontSize: R.dimens.smallestText,
				color: R.colors.textPrimary,
			},
			autoRenewButton: {
				margin: R.dimens.widgetMargin,
				marginLeft: R.dimens.widgetMargin,
				backgroundColor: R.colors.successGreen,
				height: R.dimens.SignUpButtonHeight,
				paddingLeft: R.dimens.margin,
				paddingRight: R.dimens.margin,
				padding: 0,
			}
		}
	}
}

export class PlanNameAndStatus extends Component {
	constructor(props) {
		super(props)
	}

	shouldComponentUpdate(nextProps, _nextState) {

		//Check If Old Props and New Props are Equal then Return False
		if (this.props.PlanName !== nextProps.PlanName || this.props.subscribeStatusColor !== nextProps.subscribeStatusColor || this.props.subscribeStatus !== nextProps.subscribeStatus)
			return true
		return false
	}

	render() {
		return (
			<View style={{ flexDirection: 'row', alignItems: 'center', }}>
				<TextViewMR style={{ flex: 1, color: R.colors.textPrimary, fontSize: R.dimens.mediumText, }}>{this.props.PlanName}</TextViewMR>
				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					<View style={this.styles(this.props.subscribeStatusColor).statusDot}></View>
					<Text style={{ color: this.props.subscribeStatusColor, fontSize: R.dimens.smallestText, fontFamily: Fonts.MontserratSemiBold }}>{this.props.subscribeStatus}</Text>
				</View>
			</View>
		)
	}

	// styles for this class
	styles = (subscribeStatusColor) => {
		return {
			statusDot: {
				width: R.dimens.widgetMargin,
				height: R.dimens.widgetMargin,
				marginRight: R.dimens.widgetMargin,
				borderRadius: R.dimens.LoginButtonBorderRadius,
				backgroundColor: subscribeStatusColor
			}
		}
	}
}

export class CurrentCoinAndBal extends Component {
	constructor(props) {
		super(props)
	}

	shouldComponentUpdate(nextProps, nextState) {

		//Check If Old Props and New Props are Equal then Return False
		if (this.props.currentCoin !== nextProps.currentCoin || this.props.currentBal !== nextProps.currentBal)
			return true
		return false
	}

	render() {
		let { currentCoin, currentBal } = this.props
		return (
			<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
				<TextViewHML style={{ color: R.colors.textSecondary, fontSize: R.dimens.smallestText, }}>{R.strings.Ava_Bal}</TextViewHML>
				<Text style={{ marginLeft: R.dimens.widgetMargin, color: R.colors.textPrimary, fontSize: R.dimens.smallestText, fontFamily: Fonts.MontserratSemiBold }}>{currentBal.toFixed(8) + ' ' + currentCoin}</Text>
			</View>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		//For Update isPortrait true or false
        preference: state.preference.dimensions.isPortrait,
		//updated data for active api plan action
		ApiPlanResult: state.ApiPlanListReducer,
	}
}

const mapDispatchToProps = (dispatch) => ({
	//Perform Api Plan list Data action
	getApiPlanListData: () => dispatch(getApiPlanListData()),
	//Perform  User Active Plan Data action
	getUserActivePlan: () => dispatch(getUserActivePlan()),
})

export default connect(mapStateToProps, mapDispatchToProps)(ApiActivePlanListDetail)