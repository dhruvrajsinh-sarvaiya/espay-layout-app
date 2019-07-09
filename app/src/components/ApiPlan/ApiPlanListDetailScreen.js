// ApiPlanListDetailScreen
import React, { Component } from 'react';
import { View, Text, ScrollView, } from 'react-native';
import { connect } from 'react-redux';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../native_theme/components/CustomToolbar'
import { isCurrentScreen } from '../Navigation';
import { changeTheme, showAlert, sendEvent, parseIntVal } from '../../controllers/CommonUtils';
import { isInternet, validateResponseNew, validateValue, } from '../../validations/CommonValidation';
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import R from '../../native_theme/R';
import Button from '../../native_theme/components/Button'
import { getSubscribePlanDetails, getApiPlanListData, getUserActivePlan, clearApiPlanData } from '../../actions/ApiPlan/ApiPlanListAction';
import { Fonts, Events, ServiceUtilConstant } from '../../controllers/Constants';
import TextViewHML from '../../native_theme/components/TextViewHML';
import TextViewMR from '../../native_theme/components/TextViewMR';
import IndicatorViewPager from '../../native_theme/components/IndicatorViewPager';
import ImageTextButton from '../../native_theme/components/ImageTextButton';
import Separator from '../../native_theme/components/Separator';
import { ListEmptyComponent } from '../../native_theme/components/FlatListWidgets';
import { setData, getData } from '../../App';
import CommonToast from '../../native_theme/components/CommonToast';
import PlanSubItem from './PlanSubItem';
import SafeView from '../../native_theme/components/SafeView';

class ApiPlanListDetailScreen extends Component {
	constructor(props) {
		super(props);

		//Data from previous screen
		const { params } = this.props.navigation.state;

		let currentBal = 0, currentCoin = ''

		// Get current coin and their balance
		params.walletList != undefined && params.walletList.map((item) => {
			if (params.item !== undefined) {
				if (item.CoinName === params.item.Coin && item.IsDefaultWallet == 1) {
					currentBal = item.Balance
					currentCoin = item.CoinName
				}
			}
		})

		//Define All State initial state
		this.state = {
			data: params.item != undefined ? params.item : [],
			subscribeId: params.subscribeId != undefined ? params.subscribeId : 0,
			type: params.type != undefined ? params.type : '',
			tabsName: [R.strings.Info, R.strings.apiMethods, R.strings.subscription],
			currentBal: currentBal,
			currentCoin: currentCoin,
		};

		// Create Toast Reference
		this.toast = React.createRef()
	}

	componentDidMount = async () => {
		//Add this method to change theme based on stored theme name.
		changeTheme();
	}

	shouldComponentUpdate = (nextProps, nextState) => {
		/* stop twice api call  */
		return isCurrentScreen(nextProps);
	};

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

	componentDidUpdate = (prevProps, prevState) => {

		//Get All Updated field of Particular actions
		let { subscribeData } = this.props.ApiPlanResult;

		if (subscribeData !== prevProps.ApiPlanResult.subscribeData) {
			if (subscribeData) {
				try {
					// Handle Response subscribeData from Api
					if (validateResponseNew({ response: subscribeData, })) {

						setData({ [ServiceUtilConstant.KEY_IsPlanChange]: getData(ServiceUtilConstant.KEY_IsPlanChange) + 1 });

						// if type is upgrade/downgrade
						if (this.state.type === 'upgrade' || this.state.type === 'downgrade') {
							showAlert(R.strings.Success + '!', this.state.type === 'upgrade' ? R.strings.upgradedSuccessfully : R.strings.downgradSuccessfully, 0, () => {
								this.props.clearApiPlanData();
								let { navigate } = this.props.navigation
								sendEvent(Events.ApiPlanList)
								navigate('ApiPlanListScreen')
							});
						} else if (this.state.type == '') {
							showAlert(R.strings.Success + '!', R.strings.subscribedSuccessfully, 0, () => {
								this.props.clearApiPlanData();
								this.props.navigation.state.params.onRefresh()
								this.props.navigation.goBack()
							});
						}
					} else {
						//Clear data
						this.props.clearApiPlanData();
					}
				} catch (error) {
					//Clear data
					this.props.clearApiPlanData();
				}
			}
		}
	}

	submitData = async () => {

		// subscribe id is 0 means no plan subscribed yet
		if (this.state.subscribeId == 0) {

			// Available balance is not less than your selected plan's price otherwise it will show message on your screen
			if (this.state.currentBal < this.state.data.Price) {
				this.toast.Show(R.strings.Balance_Validation)
				return
			}

			showAlert(R.strings.Subscribe + '!', R.strings.areYouSureToSubscribe, 3, async () => {
				if (await isInternet()) {
					let requestSubscription = {
						SubscribePlanID: this.state.data.ID,
						ChannelID: 31
					}
					this.props.getSubscribePlanDetails(requestSubscription)
				}
			}, R.strings.cancel, () => { });
		}

		if (this.state.subscribeId != 0) {
			// Available balance is not less than your selected plan's price otherwise it will show message on your screen
			if (this.state.currentBal < this.state.data.Price) {
				this.toast.Show(R.strings.Balance_Validation)
				return
			}

			showAlert(this.state.type === 'upgrade' ? R.strings.upgrade + '!' : R.strings.downgrade + '!', this.state.type === 'upgrade' ? R.strings.areYouSureToUpgrade : R.strings.areYouSureToDowngrade, 3, async () => {
				if (await isInternet()) {
					let requestSubscription = {
						SubscribePlanID: this.state.data.ID,
						OldPlanID: this.state.subscribeId,
						ChannelID: 31
					}
					this.props.getSubscribePlanDetails(requestSubscription)
				}
			}, R.strings.cancel, () => { });
		}
	}

	render() {
		let btnText = '', bgColor = R.colors.accent
		// Define button text on their type
		if (this.state.type === 'upgrade') {
			btnText = R.strings.upgrade
		} else if (this.state.type === 'downgrade') {
			btnText = R.strings.downgrade
			bgColor = R.colors.failRed
		} else {
			btnText = R.strings.SubscribeNow
		}
		let item = this.state.data;

		// Get Plan Validity in Year/Month/Days
		let planValidity = this.getPlanValidity(item.PlanValidityType)
		let { subscribing, loading, UserActivePlanLoading } = this.props.ApiPlanResult;

		return (
			<SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

				{/* To set status bar as per our theme */}
				<CommonStatusBar />

				{/* To set toolbar as per our theme */}
				<CustomToolbar
					title={R.strings.planDetail}
					isBack={true}
					nav={this.props.navigation} />

				{/* Progress Dialog */}
				<ProgressDialog isShow={subscribing || UserActivePlanLoading || loading} />

				{/* Common Toast */}
				<CommonToast ref={cmp => this.toast = cmp} />

				<View style={this.styles().container}>
					<IndicatorViewPager
						isGradient={true}
						titles={this.state.tabsName}
						numOfItems={3}
						scrollEnabled={false}
						horizontalScroll={false}
						style={{ marginLeft: R.dimens.margin_left_right, marginRight: R.dimens.margin_left_right }}>

						{/* Info Tab */}
						<View>
							<ScrollView showsVerticalScrollIndicator={false}>
								<View style={{ flex: 1, padding: R.dimens.margin_left_right }}>

									{/* Get Current Coin and their balance */}
									<CurrentCoinAndBal currentCoin={this.state.currentCoin} currentBal={this.state.currentBal} />

									{/* PlanName and Active/Inactive Status */}
									<View style={{ flexDirection: 'row', alignItems: 'center' }}>
										<TextViewMR style={{ flex: 1, color: R.colors.textPrimary, fontSize: R.dimens.mediumText, }}>{item.PlanName}</TextViewMR>
									</View>

									{/* Price and PlanValidity */}
									<View style={{ flexDirection: 'row', marginTop: R.dimens.margin, alignItems: 'center', }}>
										<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
											<TextViewMR style={{ color: R.colors.textPrimary, fontSize: R.dimens.mediumText, }}>{parseIntVal(item.Price)}</TextViewMR>
											<TextViewMR style={{ marginLeft: R.dimens.widgetMargin, color: R.colors.textSecondary, fontSize: R.dimens.mediumText, }}>USD</TextViewMR>
											<TextViewHML style={{ marginLeft: R.dimens.widgetMargin, color: R.colors.textSecondary, fontSize: R.dimens.smallestText, bottom: 0, right: 0, paddingTop: R.dimens.widgetMargin }}>/ {item.PlanValidity + ' ' + planValidity.toLowerCase()}</TextViewHML>
										</View>
									</View>

									{/* Plan Description */}
									<View style={{ marginTop: R.dimens.margin, }}>
										<TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>{item.PlanDesc}</TextViewHML>
									</View>

									<ScrollView showsVerticalScrollIndicator={false}>
										<View style={{ marginTop: R.dimens.margin, justifyContent: 'center' }}>

											<PlanSubItem title={R.strings.maxCallDay} value={item.MaxPerDay} />
											<PlanSubItem title={R.strings.maxCallMin} value={item.MaxPerMinute} />
											<PlanSubItem title={R.strings.maxCallMonth} value={item.MaxPerMonth} />
											<PlanSubItem title={R.strings.maxOrderPlacedSec} value={item.MaxOrderPerSec} />
											<PlanSubItem title={R.strings.whiteListIpAddressLimit} value={item.WhitelistEndPoints} />
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
							<View style={{ flex: 1, padding: R.dimens.margin_left_right, }}>

								{/* Get Current Coin and their balance */}
								<CurrentCoinAndBal currentCoin={this.state.currentCoin} currentBal={this.state.currentBal} />

								{/* PlanName and Active/Inactive Status */}
								<View style={{ flexDirection: 'row', alignItems: 'center' }}>
									<TextViewMR style={{ flex: 1, color: R.colors.textPrimary, fontSize: R.dimens.mediumText, }}>{item.PlanName}</TextViewMR>
								</View>

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
														item.ReadOnlyAPI != null && Object.values(item.ReadOnlyAPI).map((itemReadOnly, index) =>
															<View style={{ flexDirection: 'row' }} key={index.toString()}>
																<TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textSecondary }}>{itemReadOnly}</TextViewHML>
																<ImageTextButton
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
														item.FullAccessAPI != null && Object.values(item.FullAccessAPI).map((itemFullAccess, index) =>
															<View style={{ flexDirection: 'row' }} key={index.toString()}>
																<TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textSecondary }}>{itemFullAccess}</TextViewHML>
																<ImageTextButton
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
									<CurrentCoinAndBal currentCoin={this.state.currentCoin} currentBal={this.state.currentBal} />

									{/* PlanName */}
									<View style={{ flexDirection: 'row', alignItems: 'center' }}>
										<TextViewMR style={{ flex: 1, color: R.colors.textPrimary, fontSize: R.dimens.mediumText, }}>{item.PlanName}</TextViewMR>
									</View>

									{/* Price and PlanValidity */}
									<View style={{ flexDirection: 'row', marginTop: R.dimens.margin, alignItems: 'center', }}>
										<TextViewMR style={{ color: R.colors.textPrimary, fontSize: R.dimens.mediumText, }}>{parseIntVal(item.Price)}</TextViewMR>
										<TextViewMR style={{ marginLeft: R.dimens.widgetMargin, color: R.colors.textSecondary, fontSize: R.dimens.mediumText, }}>USD</TextViewMR>
										<TextViewHML style={{ marginLeft: R.dimens.widgetMargin, color: R.colors.textSecondary, fontSize: R.dimens.smallestText, bottom: 0, right: 0, paddingTop: R.dimens.widgetMargin }}>/ {item.PlanValidity + ' ' + planValidity.toLowerCase()}</TextViewHML>
									</View>

									{/* Validity/ Subscribe Status */}
									<View style={{ marginTop: R.dimens.widgetMargin, alignItems: 'center', }}>

										<PlanSubItem title={R.strings.validityPeriod} value={item.PlanValidity + ' ' + planValidity} />
										<PlanSubItem title={R.strings.subscriptionStatus} value={R.strings.notSubscribed} />

										<View style={{ flex: 1, flexDirection: 'row', }}>
											<TextViewHML style={{ flex: 1, fontSize: R.dimens.smallestText, color: R.colors.textSecondary, }}>{R.strings.recursive}</TextViewHML>
											<ImageTextButton
												style={{ margin: 0, flex: 1, }}
												icon={item.IsPlanRecursive == 1 ? R.images.IC_CHECKMARK : R.images.IC_CANCEL}
												iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: item.IsPlanRecursive == 1 ? R.colors.successGreen : R.colors.failRed }}
											/>
										</View>
									</View>

									{/* Price,Amount and Total Amount */}
									<View style={{ marginTop: R.dimens.margin }}>

										<PlanSubItem title={R.strings.Amount} value={item.Price + ' USD'} />
										<PlanSubItem title={R.strings.fee} value={item.Charge + ' USD'} />

										<View style={{ flexDirection: 'row', alignItems: 'center', }}>
											<Text style={[{ flex: 1, fontFamily: Fonts.MontserratSemiBold, fontSize: R.dimens.firstCurrencyText, color: R.colors.textSecondary, }]}>{R.strings.TotalAmount}</Text>
											<Text style={[{ flex: 1, fontFamily: Fonts.MontserratSemiBold, fontSize: R.dimens.firstCurrencyText, color: R.colors.accent }]}>{validateValue(item.Price + item.Charge) + ' USD'}</Text>
										</View>
									</View>

									{/* SubscribeNow/Upgrade/Downgrade Button */}
									{
										this.state.type !== 'cantDowngrade' &&
										<Button
											isRound={true}
											textStyle={{ fontSize: R.dimens.smallestText }}
											style={{ marginTop: R.dimens.margin_top_bottom, marginBottom: R.dimens.widgetMargin, height: R.dimens.SignUpButtonHeight, backgroundColor: bgColor }}
											title={btnText}
											onPress={() => this.submitData(item)} />
									}

								</View>
							</ScrollView>
						</View>
					</IndicatorViewPager>
				</View>
			</SafeView >
		);
	}

	// styles for this class
	styles = () => {
		return {
			container: {
				flex: 1,
				justifyContent: 'space-between',
				overflow: 'hidden'
			},
		}
	}
}

export class CurrentCoinAndBal extends Component {
	constructor(props) {
		super(props)
	}

	shouldComponentUpdate(nextProps, _nextState) {
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

function mapStateToProps(state) {
	return {
		//Updated data api plan list action
		ApiPlanResult: state.ApiPlanListReducer,
	}
}

function mapDispatchToProps(dispatch) {
	return {
		//Perform subscribe plan action
		getSubscribePlanDetails: (requestSubscription) => dispatch(getSubscribePlanDetails(requestSubscription)),
		//Perform clear api plan data action
		clearApiPlanData: () => dispatch(clearApiPlanData()),
		//Perform Api Plan list Data action
		getApiPlanListData: () => dispatch(getApiPlanListData()),
		//Perform User Active Plan Data action
		getUserActivePlan: () => dispatch(getUserActivePlan()),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ApiPlanListDetailScreen)
