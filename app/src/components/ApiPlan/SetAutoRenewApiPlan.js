import React, { Component } from 'react';
import { View, Text, ScrollView } from 'react-native';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../native_theme/components/CustomToolbar';
import R from '../../native_theme/R';
import { isEmpty, isInternet, validateResponseNew } from '../../validations/CommonValidation';
import { changeTheme, formatedDate, convertDate, showAlert, parseIntVal } from '../../controllers/CommonUtils';
import { isCurrentScreen } from '../Navigation';
import EditText from '../../native_theme/components/EditText';
import CommonToast from '../../native_theme/components/CommonToast';
import Button from '../../native_theme/components/Button';
import { connect } from 'react-redux';
import { setAutoRenewApiPlan, clearApiPlanData } from '../../actions/ApiPlan/ApiPlanListAction';
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import { Fonts } from '../../controllers/Constants';
import { PlanSubItem } from './PlanSubItem';
import SafeView from '../../native_theme/components/SafeView';
import TextViewHML from '../../native_theme/components/TextViewHML';

class SetAutoRenewApiPlan extends Component {
	constructor(props) {
		super(props);

		//Data from previous screen
		let { params } = this.props.navigation.state

		//Define initial state
		this.state = {
			UserActivePlan: params.UserActivePlan != undefined ? params.UserActivePlan : [],
			RenewalDate: params.UserActivePlan != undefined ? params.UserActivePlan.ExpiryDate : '0000-00-00',
			Days: '',
		};

		//Create reference
		this.toast = React.createRef();
	}

	componentDidMount = async () => {
		//Add this method to change theme based on stored theme name.
		changeTheme();
	}

	shouldComponentUpdate = (nextProps, nextState) => {
		return isCurrentScreen(nextProps);
	};

	// It will check validation while user enter digit or string into Days Edittext
	validateDigit = (item) => {
		const regexNumeric = /^[0-9]+$/;
		if (isEmpty(item)) {

			// If Edit Text value is empty then set defaul state
			this.setState({ Days: '', RenewalDate: convertDate(this.state.UserActivePlan.ExpiryDate) })
		} else if (regexNumeric.test(item)) {

			// Don't allow more than 10 days
			if (item > 10)
				this.toast.Show(R.strings.renewPlanBefore10Day)
			else {

				// Convert string to date object
				let convertedDate = formatedDate(this.state.UserActivePlan.ExpiryDate)

				// Minus item from Expiry Date
				let minusDate = convertedDate.setDate(convertedDate.getDate() - item)

				// Convert date object to string
				let renewalDate = convertDate(new Date(minusDate))

				this.setState({ Days: item, RenewalDate: renewalDate })
			}
		}
	}

	onSubmitPress = async () => {

		// Check validations
		if (isEmpty(this.state.Days))
			this.toast.Show(R.strings.enterDays)

		else if (parseIntVal(this.state.Days) < 1)
			this.toast.Show(R.strings.renewPlanBefore1Day)

		else if (parseIntVal(this.state.Days > 10))
			this.toast.Show(R.strings.renewPlanBefore10Day)
		else {

			// Check internet connection
			if (await isInternet()) {

				//Bind Request set auto renew api
				let req = {
					SubscribePlanID: this.state.UserActivePlan.SubscribeID,
					DaysBeforeExpiry: this.state.Days
				}

				// Set Auto Renew API Plan Api calling
				this.props.setAutoRenewApiPlan(req)
			}
		}
	}

	componentDidUpdate = (prevProps, _prevState) => {

		//Get All Updated field of Particular actions
		const { SetAutoRenewPlanData, } = this.props.ApiPlanResult
		if (SetAutoRenewPlanData !== prevProps.ApiPlanResult.SetAutoRenewPlanData) {

			// SetAutoRenewPlanData is not null
			if (SetAutoRenewPlanData) {
				try {

					// Handle Success Response SetAutoRenewPlanData
					if (validateResponseNew({ response: SetAutoRenewPlanData })) {

						// Show success dialog
						showAlert(R.strings.Success + '!', R.strings.autoRenewApiSuccessfully, 0, () => {
							this.props.clearApiPlanData();
							this.props.navigation.state.params.onRefresh()
							this.props.navigation.goBack()
						});
					} else {
						//clear data
						this.props.clearApiPlanData();
					}
				} catch (error) {
					//clear data 
					this.props.clearApiPlanData();
				}
			}
		}
	}

	render() {

		//Get is Fetching value For All APIs to handle Progress bar in All Activity
		let { SetAutoRenewPlanLoading } = this.props.ApiPlanResult

		let item = this.state.UserActivePlan

		return (
			<SafeView style={this.styles().container}>

				{/* To set status bar as per our theme */}
				<CommonStatusBar />

				{/* To Set ToolBar as per out theme */}
				<CustomToolbar
					title={R.strings.autoRenew}
					isBack={true}
					nav={this.props.navigation} />

				{/* Progressbar */}
				<ProgressDialog isShow={SetAutoRenewPlanLoading} />

				{/* For Toast */}
				<CommonToast ref={component => this.toast = component} />

				<View style={{ flex: 1, justifyContent: 'space-between' }}>
					{/* Auto Renew Plan Detail*/}
					<ScrollView showsVerticalScrollIndicator={false}>
						{/* Set Auto Renew Api Plan subtitle */}
						<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginLeft: R.dimens.activity_margin, marginRight: R.dimens.activity_margin, marginTop: R.dimens.padding_top_bottom_margin, }}>
							<TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, textAlign: 'center' }}>{R.strings.autoRenewSubtitle}</TextViewHML>
						</View>

						<View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, }}>

							{/* Input of Days */}
							<EditText
								header={R.strings.autoRenewBeforeExpiry}
								placeholder={R.strings.enterDays}
								multiline={false}
								keyboardType={'numeric'}
								returnKeyType={"done"}
								onChangeText={(item) => this.validateDigit(item)}
								value={this.state.Days}
								validate={true}
								onlyDigit={true} />

							<PlanSubItem title={R.strings.renewalDate} value={convertDate(this.state.RenewalDate)} titleStyle={this.styles().itemTitle} styles={this.styles().itemValue} />
							<PlanSubItem title={R.strings.apiPlanName} value={item.PlanName} titleStyle={this.styles().itemTitle} styles={this.styles().itemValue} />
							<PlanSubItem title={R.strings.ExpiryDate} value={convertDate(item.ExpiryDate)} titleStyle={this.styles().itemTitle} styles={this.styles().itemValue} />

							<Text style={this.styles().textStyle}>{R.strings.formatString(R.strings.areYouSureToAutoRenewalApi, { PlanName: item.PlanName, Days: this.state.Days, ExpiryDate: convertDate(item.ExpiryDate) })}</Text>
						</View>
					</ScrollView>
					<View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
						{/* To Set Submit Button */}
						<Button title={R.strings.confirm} onPress={this.onSubmitPress}></Button>
					</View>
				</View>
			</SafeView>
		);
	}

	// styles for this class
	styles = () => {
		return {
			container: {
				flex: 1,
				backgroundColor: R.colors.background
			},
			itemTitle: {
				fontSize: R.dimens.smallText,
				marginLeft: R.dimens.LineHeight,
			},
			itemValue: {
				fontSize: R.dimens.smallText,
				textAlign: 'right',
				marginRight: R.dimens.LineHeight,
				fontFamily: Fonts.MontserratSemiBold
			},
			textStyle: {
				color: R.colors.textPrimary,
				fontSize: R.dimens.smallText,
				marginTop: R.dimens.margin_top_bottom,
				fontFamily: Fonts.MontserratSemiBold,
				marginLeft: R.dimens.LineHeight,
				marginRight: R.dimens.LineHeight
			}
		}
	}
}

const mapStateToProps = (state) => {
	return {
		//Updated data for set auto renew api plan action
		ApiPlanResult: state.ApiPlanListReducer,
	}
}

const mapDispatchToProps = (dispatch) => ({
	//Perform Set Auto Renew Api Plan action
	setAutoRenewApiPlan: (payload) => dispatch(setAutoRenewApiPlan(payload)),
	//Perform Clear Api Plan Data action
	clearApiPlanData: () => dispatch(clearApiPlanData()),
})

export default connect(mapStateToProps, mapDispatchToProps)(SetAutoRenewApiPlan)