import React, { Component } from 'react';
import { View, Text, ScrollView } from 'react-native';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../native_theme/components/CustomToolbar';
import { changeTheme, parseArray, showAlert } from '../../controllers/CommonUtils';
import { isCurrentScreen } from '../Navigation';
import R from '../../native_theme/R';
import { getCustomLimits, setDefaultCustomLimits, clearApiPlanData } from '../../actions/ApiPlan/ApiPlanListAction';
import { connect } from 'react-redux';
import { isInternet, validateResponseNew } from '../../validations/CommonValidation';
import ImageButton from '../../native_theme/components/ImageTextButton';
import ListLoader from '../../native_theme/components/ListLoader';
import CardView from '../../native_theme/components/CardView';
import ImageTextButton from '../../native_theme/components/ImageTextButton';
import Button from '../../native_theme/components/Button';
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import AlertDialog from '../../native_theme/components/AlertDialog';
import TextViewMR from '../../native_theme/components/TextViewMR';
import TextViewHML from '../../native_theme/components/TextViewHML';
import { Fonts } from '../../controllers/Constants';
import PlanSubItem from './PlanSubItem';
import SafeView from '../../native_theme/components/SafeView';

class SetCustomLimitsForKeys extends Component {
	constructor(props) {
		super(props);

		//Data from previous screen 
		let { params } = this.props.navigation.state

		//Define initial state
		this.state = {
			UserActivePlan: params.UserActivePlan[0] != undefined ? params.UserActivePlan[0] : [],
			CustomLimitsResponse: [],
			isShowAlert: false,
			isFirstTime: true,
			setDefaultSuccessAlert: false,
		};
	}

	componentDidMount = async () => {
		//Add this method to change theme based on stored theme name.
		changeTheme();

		//get custom limit api call
		this.onRefresh()
	}

	shouldComponentUpdate = (nextProps, _nextState) => {
		return isCurrentScreen(nextProps);
	};

	onRefresh = async () => {

		// Check internet connection
		if (await isInternet()) {

			//Bind request for get custom limit api 
			let req = {
				SubscribeId: this.state.UserActivePlan.SubscribeID ? this.state.UserActivePlan.SubscribeID : 0
			}

			// Custom Limits Api Call
			this.props.getCustomLimits(req)
		}
	}

	// User Press on add button
	onAddPress = () => {

		// Navigate to AddCustomLimitsForKeys Screen
		let { navigate } = this.props.navigation
		navigate('AddCustomLimitsForKeys', { UserActivePlan: this.state.UserActivePlan, onRefresh: this.onRefresh })
	}

	// User press on edit button from Toolbar
	onEditPress = () => {

		// Navigate to EditCustomLimitsForKeys Screen
		let { navigate } = this.props.navigation
		navigate('EditCustomLimitsForKeys', { UserActivePlan: this.state.UserActivePlan, CustomLimits: this.state.CustomLimitsResponse[0], SubscribeID: this.state.UserActivePlan.SubscribeID, onRefresh: this.onRefresh })
	}

	// User set default value from Custom Limit
	onSetDafaultValue = async () => {
		this.setState({ isShowAlert: false })

		// Check interner connection
		if (await isInternet()) {
			let req = {
				LimitID: this.state.CustomLimitsResponse[0].LimitID
			}

			// Set Default Custom Limits Api Call
			this.props.setDefaultCustomLimits(req)
		}
	}

	componentDidUpdate = (prevProps, prevState) => {
		const { SetDefCustomLimitsData } = this.props.ApiPlanResult

		if (SetDefCustomLimitsData !== prevProps.ApiPlanResult.SetDefCustomLimitsData) {

			// SetDefCustomLimitsData is not null
			if (SetDefCustomLimitsData) {
				if (this.state.setDefaultSuccessAlert) {

					// Show success dialog
					showAlert(R.strings.Success + '!', R.strings.setDefaultSuccessfully, 0, () => {
						this.props.clearApiPlanData();
						this.onRefresh()
					});
				}
			}
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
			const { CustomLimitsData, SetDefCustomLimitsData } = props.ApiPlanResult

			// CustomLimitsData is not null
			if (CustomLimitsData) {
				try {
					if (state.CustomLimitsData == null || (state.CustomLimitsData != null && CustomLimitsData !== state.CustomLimitsData)) {
						// Handle CustomLimitsData  success Response
						if (validateResponseNew({ response: CustomLimitsData, isList: true })) {
							let res = parseArray(CustomLimitsData.Response);
							return {
								...state,
								CustomLimitsResponse: res,
								CustomLimitsData
							}
						} else {
							//set empty custom limits
							return {
								...state,
								CustomLimitsResponse: [],
								CustomLimitsData: null
							}
						}
					}
				} catch (error) {
					return {
						...state,
						CustomLimitsResponse: [],
						CustomLimitsData: null
					}
				}
			}

			// SetDefCustomLimitsData is not null
			if (SetDefCustomLimitsData) {
				try {
					if (state.SetDefCustomLimitsData == null || (state.SetDefCustomLimitsData != null && SetDefCustomLimitsData !== state.SetDefCustomLimitsData)) {

						// Handle Response
						if (validateResponseNew({ response: SetDefCustomLimitsData })) {
							return {
								...state,
								SetDefCustomLimitsData,
								setDefaultSuccessAlert: true
							}
						} else {
							this.props.clearApiPlanData();
							return {
								...state,
								SetDefCustomLimitsData: null,
								setDefaultSuccessAlert: false
							}
						}
					}
				} catch (error) {
					return {
						...state,
						SetDefCustomLimitsData: null,
						setDefaultSuccessAlert: false
					}
				}
			}
		}
		return null
	}

	render() {

		let userActivePlan = this.state.UserActivePlan
		let item = this.state.CustomLimitsResponse

		//Get is Fetching value For All APIs to handle Progress bar in All Activity 
		let { CustomLimitsLoading, SetDefCustomLimitsLoading } = this.props.ApiPlanResult
		return (
			<SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

				{/* To set status bar as per our theme */}
				<CommonStatusBar />

				{/* To Set ToolBar as per out theme */}
				<CustomToolbar
					title={R.strings.customLimits}
					isBack={true}
					nav={this.props.navigation}
					rightIcon={this.state.CustomLimitsResponse.length > 0 && R.images.IC_EDIT}
					onRightMenuPress={this.onEditPress} />

				{/* Progressbar for Set Default Custom Limit */}
				<ProgressDialog isShow={SetDefCustomLimitsLoading} />

				{
					CustomLimitsLoading ?
						<ListLoader />
						:
						<View style={{ flex: 1, margin: R.dimens.margin }}>
							{
								// No custom limit exist
								this.state.CustomLimitsResponse.length == 0 &&
								<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginLeft: R.dimens.margin, marginRight: R.dimens.margin, }}>
									<ImageButton
										style={{ backgroundColor: R.colors.textSecondary }}
										icon={R.images.IC_PLUS}
										iconStyle={{ resizeMode: 'stretch', width: R.dimens.QRcode_height_width, height: R.dimens.QRcode_height_width, tintColor: R.colors.textPrimary }}
										onPress={this.onAddPress}
									/>
									<TextViewMR style={{ color: R.colors.textPrimary, fontSize: R.dimens.mediumText, textAlign: 'center' }}>{R.strings.setCustomLimits.toUpperCase()}</TextViewMR>
									<TextViewHML style={{ marginTop: R.dimens.widgetMargin, color: R.colors.textPrimary, fontSize: R.dimens.smallestText }}>{R.strings.customLimitsDesc}</TextViewHML>
								</View>
							}
							{
								// User custom limits available
								this.state.CustomLimitsResponse.length > 0 &&
								<View style={{ flex: 1, justifyContent: 'space-between' }}>

									<ScrollView showsVerticalScrollIndicator={false}>
										<CardView style={this.styles().cardviewStyle}>
											{/* Header */}
											<View style={{ justifyContent: 'center', alignItems: 'center' }}>
												<TextViewMR style={{ color: R.colors.accent, fontSize: R.dimens.mediumText }}>{userActivePlan.PlanName}</TextViewMR>
											</View>

											<PlanSubItem title={R.strings.maxCallMin} value={item[0].MaxPerMinute} styles={{ textAlign: 'right', }} />
											<PlanSubItem title={R.strings.maxCallDay} value={item[0].MaxPerDay} styles={{ textAlign: 'right', }} />
											<PlanSubItem title={R.strings.maxCallMonth} value={item[0].MaxPerMonth} styles={{ textAlign: 'right', }} />
											<PlanSubItem title={R.strings.maxOrderPlacedSec} value={item[0].MaxOrderPerSec} styles={{ textAlign: 'right', }} />
											<PlanSubItem title={R.strings.maxOrderPlacedSec} value={item[0].MaxRecPerRequest} styles={{ textAlign: 'right', }} />
											<PlanSubItem title={R.strings.maxRequestSize} value={item[0].MaxReqSize} styles={{ textAlign: 'right', }} />
											<PlanSubItem title={R.strings.maxResponseSize} value={item[0].MaxResSize} styles={{ textAlign: 'right', }} />
											<PlanSubItem title={R.strings.whiteListIpAddressLimit} value={item[0].WhitelistedEndPoints} styles={{ textAlign: 'right', }} />
											<PlanSubItem title={R.strings.concurrentIpAddressLimit} value={item[0].ConcurrentEndPoints} styles={{ textAlign: 'right', }} />
											<PlanSubItem title={R.strings.historicalData} value={item[0].HistoricalDataMonth} styles={{ textAlign: 'right', }} />

											{
												Object.values(item[0].ReadOnlyAPI).length > 0 &&
												<View style={{ marginTop: R.dimens.margin }}>
													<Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>{R.strings.readOnlyApiMethods}</Text>
													{
														item[0].ReadOnlyAPI != null && Object.values(item[0].ReadOnlyAPI).map((itemReadOnly, index) =>
															<View style={{ flexDirection: 'row', marginTop: R.dimens.widgetMargin }} key={index.toString()}>
																<TextViewHML style={this.styles().itemTitle}>{itemReadOnly}</TextViewHML>
																<ImageTextButton
																	style={{ margin: 0, }}
																	icon={R.images.IC_CHECK_CIRCLE}
																	iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: R.colors.successGreen }}
																/>
															</View>
														)
													}
												</View>
											}

											{
												Object.values(item[0].FullAccessAPI).length > 0 &&
												<View style={{ marginTop: R.dimens.margin }}>
													<Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, }}>{R.strings.fullAccessApiMethods}</Text>
													{
														item[0].FullAccessAPI != null && Object.values(item[0].FullAccessAPI).map((itemFullAccess, index) =>
															<View style={{ flexDirection: 'row', marginTop: R.dimens.widgetMargin }} key={index.toString()}>
																<TextViewHML style={this.styles().itemTitle}>{itemFullAccess}</TextViewHML>
																<ImageTextButton
																	style={{ margin: 0, }}
																	icon={R.images.IC_CHECK_CIRCLE}
																	iconStyle={{ width: R.dimens.titleIconHeightWidth, height: R.dimens.titleIconHeightWidth, tintColor: R.colors.successGreen }}
																/>
															</View>
														)
													}
												</View>
											}
										</CardView>
									</ScrollView>

									<View style={{ paddingLeft: R.dimens.margin_left_right, paddingRight: R.dimens.margin_left_right, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
										{/* To Set Default Value Button */}
										<Button title={R.strings.setAsDefault} onPress={() => this.setState({ isShowAlert: true })}></Button>
									</View>
								</View>
							}
						</View>
				}

				{/* Alert for Upgarde */}
				<AlertDialog
					visible={this.state.isShowAlert}
					title={R.strings.warning + '!'}
					negativeButton={{
						title: R.strings.cancel,
						onPress: () => this.setState({ isShowAlert: !this.state.isShowAlert, })
					}}
					positiveButton={{
						title: R.strings.confirm,
						onPress: () => this.onSetDafaultValue(),
						disabled: SetDefCustomLimitsLoading,
						progressive: false
					}}
					requestClose={() => null}
					toastRef={component => this.toastDialog = component}>
					{/* Description */}
					<TextViewHML style={{
						paddingTop: R.dimens.WidgetPadding,
						paddingBottom: R.dimens.WidgetPadding,
						color: R.colors.textPrimary,
						fontSize: R.dimens.smallText,
					}}>{R.strings.customLimitAlert}</TextViewHML>
				</AlertDialog>
			</SafeView>
		);
	}

	// styles for this class
	styles = () => {
		return {
			cardviewStyle: {
				flex: 1,
				justifyContent: 'center',
				marginTop: R.dimens.margin,
				marginBottom: R.dimens.margin,
				marginLeft: R.dimens.margin_left_right,
				marginRight: R.dimens.margin_left_right
			},
			itemTitle: {
				flex: 1,
				fontSize: R.dimens.smallestText,
				color: R.colors.textSecondary,
			},
		}
	}
}

const mapStateToProps = (state) => {
	return {
		//Updated data for get and set custom limit action 
		ApiPlanResult: state.ApiPlanListReducer,
	}
}

const mapDispatchToProps = (dispatch) => ({
	//Perform Custom Limit Api Plan action
	getCustomLimits: (payload) => dispatch(getCustomLimits(payload)),
	//Perform Set Default Custom Limits Api Plan action
	setDefaultCustomLimits: (payload) => dispatch(setDefaultCustomLimits(payload)),
	//Perform Clear Api Plan Data action
	clearApiPlanData: () => dispatch(clearApiPlanData()),
})

export default connect(mapStateToProps, mapDispatchToProps)(SetCustomLimitsForKeys)