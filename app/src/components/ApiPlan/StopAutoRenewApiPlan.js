import React, { Component } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { changeTheme, convertDate, showAlert } from '../../controllers/CommonUtils';
import { isCurrentScreen } from '../Navigation';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../native_theme/components/CustomToolbar';
import R from '../../native_theme/R';
import CardView from '../../native_theme/components/CardView';
import { isInternet, validateResponseNew } from '../../validations/CommonValidation';
import Button from '../../native_theme/components/Button';
import { getAutoRenewApiPlan, stopAutoRenewApiPlan, clearApiPlanData } from '../../actions/ApiPlan/ApiPlanListAction';
import { connect } from 'react-redux';
import ListLoader from '../../native_theme/components/ListLoader';
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import { Fonts } from '../../controllers/Constants';
import PlanSubItem from './PlanSubItem';
import SafeView from '../../native_theme/components/SafeView';
import TextViewHML from '../../native_theme/components/TextViewHML';

class StopAutoRenewApiPlan extends Component {
	constructor(props) {
		super(props);

		//Define initial state
		this.state = {
			RenewApiPlanResponse: null,
			isFirstTime: true,
			stopRenewApiAlert: false,
		};
	}

	componentDidMount = async () => {

		//Add this method to change theme based on stored theme name.
		changeTheme();

		// Check internet connection
		if (await isInternet()) {

			// Auto Renew API Plan Api Call
			this.props.getAutoRenewApiPlan()
		}
	}

	shouldComponentUpdate = (nextProps, _nextState) => {
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

	onStopAutoRenew = async () => {

		if (this.state.RenewApiPlanResponse != null) {

			// Check internet connection
			if (await isInternet()) {

				//Bind request for stop auto renew api plan Api
				let req = {
					AutoRenewID: this.state.RenewApiPlanResponse.RenewID,
					SubscribeID: this.state.RenewApiPlanResponse.SubscribeID
				}

				// Stop Auto Renew API Plan Api Call
				this.props.stopAutoRenewApiPlan(req)
			}
		}
	}

	componentDidUpdate = (prevProps, _prevState) => {
		const { StopRenewPlanData } = this.props.ApiPlanResult

		if (StopRenewPlanData !== prevProps.ApiPlanResult.StopRenewPlanData) {
			if (StopRenewPlanData) {
				if (this.state.stopRenewApiAlert) {

					// Show success dialog of Stop Renew Api Plan
					showAlert(R.strings.Success + '!', R.strings.stopApiSuccessfully, 0, () => {
						this.props.clearApiPlanData();
						this.props.navigation.state.params.onRefresh()
						this.props.navigation.goBack()
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
			const { AutoRenewPlanData, StopRenewPlanData } = props.ApiPlanResult

			// AutoRenewPlanData is not null
			if (AutoRenewPlanData) {
				try {
					if (state.AutoRenewPlanData == null || (state.AutoRenewPlanData != null && AutoRenewPlanData !== state.AutoRenewPlanData)) {

						// Handle AutoRenewPlanData success Response
						if (validateResponseNew({ response: AutoRenewPlanData })) {

							return {
								...state,
								AutoRenewPlanData,
								RenewApiPlanResponse: AutoRenewPlanData.Response
							}
						} else {
							//set auto renew data null
							return {
								...state,
								AutoRenewPlanData: null,
								RenewApiPlanResponse: null
							}
						}
					}
				} catch (error) {
					return {
						...state,
						AutoRenewPlanData: null,
						RenewApiPlanResponse: null
					}
				}
			}

			// StopRenewPlanData is not null
			if (StopRenewPlanData) {
				try {
					if (state.StopRenewPlanData == null || (state.StopRenewPlanData != null && StopRenewPlanData !== state.StopRenewPlanData)) {

						// Handle StopRenewPlanData success Response 
						if (validateResponseNew({ response: StopRenewPlanData })) {
							return {
								...state,
								StopRenewPlanData,
								stopRenewApiAlert: true,
							}
						} else {
							//clear data and set stoprenewplan empty
							this.props.clearApiPlanData();
							return {
								...state,
								StopRenewPlanData: null,
								stopRenewApiAlert: false,
							}
						}
					}
				} catch (error) {
					return {
						...state,
						StopRenewPlanData: null,
						stopRenewApiAlert: false,
					}
				}
			}
		}
		return null
	}

	render() {
		let { AutoRenewPlanLoading, StopRenewPlanLoading } = this.props.ApiPlanResult
		let item = this.state.RenewApiPlanResponse ? this.state.RenewApiPlanResponse : ''

		// get plan validity
		let planValidity = this.getPlanValidity(item.PlanValidityType)
		return (
			<SafeView style={this.styles().container}>

				{/* To set status bar as per our theme */}
				<CommonStatusBar />

				{/* To set toolbar as per our theme */}
				<CustomToolbar
					title={R.strings.stopAutoRenew}
					isBack={true}
					nav={this.props.navigation} />

				{/* Progressbar */}
				<ProgressDialog isShow={StopRenewPlanLoading} />

				{
					AutoRenewPlanLoading ?
						<ListLoader />
						:
						<View style={{ flex: 1, justifyContent: 'space-between' }}>
							{/* Stop Renew Plan Detail*/}
							<ScrollView showsVerticalScrollIndicator={false}>
								{/* Stop Api Plan subtitle */}
								<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginLeft: R.dimens.activity_margin, marginRight: R.dimens.activity_margin, marginTop: R.dimens.margin, }}>
									<TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, textAlign: 'center' }}>{R.strings.stopAutoRenewSubtitle}</TextViewHML>
								</View>
								
								{/* Card for display item */}
								<CardView style={{ marginLeft: R.dimens.activity_margin, marginRight: R.dimens.activity_margin, marginTop: R.dimens.margin, marginBottom: R.dimens.margin, }} >

									<PlanSubItem
										title={R.strings.apiPlanName}
										value={item.PlanName}
										isBold={true} />
									<PlanSubItem
										title={R.strings.status}
										value={item.Status == 1 ? R.strings.Active : R.strings.Inactive}
										isBold={true}
										styles={{ color: item.Status == 1 ? R.colors.successGreen : R.colors.failRed, }}
										viewStyle={{ marginTop: R.dimens.widgetMargin, }} />
									<PlanSubItem
										title={R.strings.validityPeriod}
										value={item.Validity + ' ' + planValidity}
										viewStyle={{ marginTop: R.dimens.widgetMargin, }}
										isBold={true} />
									<PlanSubItem
										title={R.strings.ExpiryDate}
										value={convertDate(item.ExpiryDate)}
										viewStyle={{ marginTop: R.dimens.widgetMargin, }}
										isBold={true}
									/>
									<PlanSubItem
										title={R.strings.subscriptionAmount}
										value={item.Amount + ' USD'}
										viewStyle={{ marginTop: R.dimens.widgetMargin, }}
										isBold={true} />
									<PlanSubItem
										title={R.strings.fee}
										value={item.Fees + ' USD'}
										viewStyle={{ marginTop: R.dimens.widgetMargin, }}
										isBold={true}
									/>
									<PlanSubItem
										title={R.strings.NetTotal}
										value={item.TotalAmt + ' USD'}
										isBold={true}
										viewStyle={{ marginTop: R.dimens.widgetMargin, }} />

									<PlanSubItem
										title={R.strings.autoRenewBeforeExpiry}
										value={item.Days + ' ' + R.strings.day}
										isBold={true}
										viewStyle={{ marginTop: R.dimens.widgetMargin, }} />
									<PlanSubItem
										title={R.strings.nextRenewalDate}
										value={convertDate(item.NextRenewDate)}
										isBold={true}
										viewStyle={{ marginTop: R.dimens.widgetMargin, }} />

									{/* Note */}
									<View style={{ flex: 1, marginTop: R.dimens.margin }}>
										<Text style={[this.styles().itemTitle, { fontFamily: Fonts.MontserratSemiBold, color: R.colors.textPrimary }]}>{R.strings.note_text}:</Text>
										<Text style={this.styles().textStyle}>{R.strings.formatString(R.strings.areYouSureToStopApiPlan, { PlanName: item.PlanName, RenewalDate: convertDate(item.NextRenewDate) })}</Text>
									</View>

								</CardView>
							</ScrollView>

							<View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
								{/* To Set Submit Button */}
								<Button title={R.strings.stopAutoRenew} onPress={this.onStopAutoRenew}></Button>
							</View>
						</View>
				}
			</SafeView>
		);
	}

	styles = () => {
		return {
			container: {
				flex: 1,
				backgroundColor: R.colors.background
			},
			itemTitle: {
				flex: 1,
				color: R.colors.textSecondary,
				fontSize: R.dimens.smallestText,
				marginLeft: R.dimens.LineHeight,
			},
			textStyle: {
				color: R.colors.failRed,
				fontSize: R.dimens.smallestText,
				fontFamily: Fonts.MontserratSemiBold
			}
		}
	}
}

const mapStateToProps = (state) => {
	return {
		//updated data for stop auto renew api plan action
		ApiPlanResult: state.ApiPlanListReducer,
	}
}

const mapDispatchToProps = (dispatch) => ({
	//Perform Get Auto Renew Api Plan action
	getAutoRenewApiPlan: () => dispatch(getAutoRenewApiPlan()),
	//Perform Stop Auto Renew Api Plan Data action
	stopAutoRenewApiPlan: (payload) => dispatch(stopAutoRenewApiPlan(payload)),
	//Perform Clear Api Plan Data action
	clearApiPlanData: () => dispatch(clearApiPlanData()),
})

export default connect(mapStateToProps, mapDispatchToProps)(StopAutoRenewApiPlan)