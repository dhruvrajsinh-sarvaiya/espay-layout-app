import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { changeTheme, convertDate, showAlert } from '../../controllers/CommonUtils';
import { isCurrentScreen } from '../Navigation';
import R from '../../native_theme/R';
import CustomToolbar from '../../native_theme/components/CustomToolbar';
import CardView from '../../native_theme/components/CardView';
import Button from '../../native_theme/components/Button';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import { isInternet, validateResponseNew } from '../../validations/CommonValidation';
import AlertDialog from '../../native_theme/components/AlertDialog';
import { manualRenewApiPlan, clearApiPlanData } from '../../actions/ApiPlan/ApiPlanListAction';
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import { connect } from 'react-redux';
import TextViewHML from '../../native_theme/components/TextViewHML';
import CommonToast from '../../native_theme/components/CommonToast';
import PlanSubItem from './PlanSubItem';
import SafeView from '../../native_theme/components/SafeView';

class ManualRenewPlan extends Component {
	constructor(props) {
		super(props);

		//Data from Previous Screen 
		let { params } = this.props.navigation.state
		let selectedPlan = {}
		let activePlan = params.UserActivePlan != undefined ? params.UserActivePlan : []
		let apiPlanList = params.ApiPlanList != undefined ? params.ApiPlanList : []
		let walletList = params.WalletList != undefined ? params.WalletList : []

		// Get Plan Detail from ApiPlanList 
		for (var apiPlanKey in apiPlanList) {
			let apiPlanitem = apiPlanList[apiPlanKey];
			if (apiPlanitem.SubscribeID == activePlan.SubscribeID)
				selectedPlan = apiPlanitem
		}

		// Get Current Balance 
		let currentBal = 0
		if (walletList.length > 0) {
			for (var walletKey in walletList) {
				let apiPlanitem = walletList[walletKey];
				if (apiPlanitem.CoinName === selectedPlan.Coin && apiPlanitem.IsDefaultWallet == 1) {
					currentBal = apiPlanitem.Balance
				}
			}
		}

		//Define initial state
		this.state = {
			UserActivePlan: activePlan,
			ApiPlanList: apiPlanList,
			CurrentBal: currentBal,
			isRenewAlert: false
		};

		// Create Reference for Toast
		this.toast = React.createRef()
	}

	componentDidMount = async () => {
		//Add this method to change theme based on stored theme name.
		changeTheme();
	}

	shouldComponentUpdate = (nextProps, _nextState) => {
		return isCurrentScreen(nextProps);
	};

	// Get Status - Active/Inactive/Requested
	getStatus = (planStatus) => {
		let status = '-'
		if (planStatus == 1)
			status = R.strings.Active
		else if (planStatus == 2)
			status = R.strings.requested
		else if (planStatus == 9)
			status = R.strings.Inactive
		return status
	}

	// Get Status Color
	getStatusColor = (planStatus) => {
		let statusColor = R.colors.textPrimary
		if (planStatus == 1)
			statusColor = R.colors.successGreen
		else if (planStatus == 2)
			statusColor = R.colors.yellow
		else if (planStatus == 9)
			statusColor = R.colors.failRed
		return statusColor
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

	// Get Api Plan List Item
	getSingleItem = (ApiPlanList) => {
		let apiPlanList = null
		if (ApiPlanList.length > 0) {
			ApiPlanList.map((item) => {

				// If same priority exist then and only then retun apilist
				if (item.Priority == this.state.UserActivePlan.Priority)
					apiPlanList = item
			})
		}
		return apiPlanList
	}

	componentDidUpdate = (prevProps, _prevState) => {

		//Get All Updated field of Particular actions
		const { ManualRenewPlanData, } = this.props.ApiPlanResult

		if (ManualRenewPlanData !== prevProps.ApiPlanResult.ManualRenewPlanData) {

			// ManualRenewPlanData is not null
			if (ManualRenewPlanData) {
				try {
					// Handle success Response ManualRenewPlanData 
					if (validateResponseNew({ response: ManualRenewPlanData })) {

						// Show success dialog
						showAlert(R.strings.Success + '!', R.strings.renewApiSuccessfully, 0, () => {
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

	onRenewPlan = async () => {

		this.setState({ isRenewAlert: false })

		// Available balance is not less than your selected plan's price otherwise it will show message on your screen
		if (this.state.CurrentBal < this.state.UserActivePlan.Price) {
			this.toast.Show(R.strings.Balance_Validation)
			return
		}

		// Check internet connection
		if (await isInternet()) {

			//Bind request for manual renewplan api
			let Req = {
				SubscribePlanID: this.state.UserActivePlan.SubscribeID,
				ChannelID: 31,
			}

			// Manual Renew Plan Api Call
			this.props.manualRenewApiPlan(Req)
		}
	}

	render() {
		let { UserActivePlan, ApiPlanList } = this.state

		//Get is Fetching value For All APIs to handle Progress bar in All Activity
		let { ManualRenewPlanLoading } = this.props.ApiPlanResult

		let status = this.getStatus(UserActivePlan.PlanStatus)
		let statusColor = this.getStatusColor(UserActivePlan.PlanStatus)
		let planValidity = this.getPlanValidity(UserActivePlan.PlanValidityType)
		let apiPlanList = this.getSingleItem(ApiPlanList)

		return (
			<SafeView style={this.styles().container}>

				{/* To set status bar as per our theme */}
				<CommonStatusBar />

				{/* To set toolbar as per our theme */}
				<CustomToolbar
					title={R.strings.renewApiPlanSubscription}
					isBack={true}
					nav={this.props.navigation} />

				{/* Progressbar */}
				<ProgressDialog isShow={ManualRenewPlanLoading} />

				{/* Custom Toast */}
				<CommonToast ref={cmpToast => this.toast = cmpToast} />

				<View style={{ flex: 1, justifyContent: 'space-between' }}>
					{/* Renew Plan Detail*/}
					<ScrollView showsVerticalScrollIndicator={false}>
						{/* Card for display item */}
						<CardView style={{ marginLeft: R.dimens.activity_margin, marginRight: R.dimens.activity_margin, marginTop: R.dimens.margin, marginBottom: R.dimens.margin, }} >

							<PlanSubItem
								title={R.strings.apiPlanName}
								value={UserActivePlan.PlanName}
								isBold={true}
							/>
							<PlanSubItem
								title={R.strings.status}
								value={status}
								styles={{ color: statusColor, }}
								viewStyle={{ marginTop: R.dimens.margin, }}
								isBold={true} />
							<PlanSubItem
								title={R.strings.validityPeriod}
								value={UserActivePlan.PlanValidity + ' ' + planValidity}
								viewStyle={{ marginTop: R.dimens.margin, }}
								isBold={true}
							/>
							<PlanSubItem
								title={R.strings.ExpiryDate}
								value={convertDate(UserActivePlan.ExpiryDate)}
								viewStyle={{ marginTop: R.dimens.margin, }}
								isBold={true}
							/>
							<PlanSubItem
								title={R.strings.subscriptionAmount}
								value={apiPlanList ? apiPlanList.Price + ' USD' : 0}
								viewStyle={{ marginTop: R.dimens.margin, }}
								styles={{ textAlign: 'right' }}
							/>
							<PlanSubItem
								title={R.strings.fee}
								value={apiPlanList ? apiPlanList.Charge + ' USD' : 0}
								viewStyle={{ marginTop: R.dimens.margin, }}
								styles={{ textAlign: 'right' }}
							/>
							<PlanSubItem
								title={R.strings.NetTotal}
								value={apiPlanList != null ? (apiPlanList.Price + apiPlanList.Charge) + ' USD' : 0}
								viewStyle={{ marginTop: R.dimens.margin, }}
								styles={{ textAlign: 'right' }}
							/>

						</CardView>
					</ScrollView>

					<View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
						{/* To Set Renew Button */}
						<Button title={R.strings.renewNow} onPress={() => this.setState({ isRenewAlert: true })}></Button>
					</View>
				</View>

				{/* Alert for Renew Api Plan */}
				<AlertDialog
					visible={this.state.isRenewAlert}
					title={R.strings.warning + '!'}
					negativeButton={{
						title: R.strings.cancel,
						onPress: () => this.setState({ isRenewAlert: !this.state.isRenewAlert, })
					}}
					positiveButton={{
						title: R.strings.renewNow,
						onPress: () => this.onRenewPlan(),
						disabled: ManualRenewPlanLoading,
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
						textAlign: 'center'
					}}>{R.strings.formatString(R.strings.areYouSureToRenewPlanWorth, { PlanName: UserActivePlan.PlanName, NetTotal: apiPlanList ? (apiPlanList.Price + apiPlanList.Charge) + ' USD' : 0 })}</TextViewHML>
				</AlertDialog>
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
		}
	}
}

const mapStateToProps = (state) => {
	return {
		//Updated data for manual renew plan action
		ApiPlanResult: state.ApiPlanListReducer,
	}
}

const mapDispatchToProps = (dispatch) => ({
	//Perfrom Manual Renew Api Plan action
	manualRenewApiPlan: (payload) => dispatch(manualRenewApiPlan(payload)),
	//Perfrom Clear Api Plan Data action
	clearApiPlanData: () => dispatch(clearApiPlanData()),
})

export default connect(mapStateToProps, mapDispatchToProps)(ManualRenewPlan)