import React, { Component } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { changeTheme, showAlert } from '../../controllers/CommonUtils';
import { isCurrentScreen } from '../Navigation';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../native_theme/components/CustomToolbar';
import R from '../../native_theme/R';
import EditText from '../../native_theme/components/EditText';
import ImageTextButton from '../../native_theme/components/ImageTextButton';
import Button from '../../native_theme/components/Button';
import { editCustomLimits, clearApiPlanData } from '../../actions/ApiPlan/ApiPlanListAction';
import { connect } from 'react-redux';
import CommonToast from '../../native_theme/components/CommonToast';
import { isEmpty, isInternet, validateResponseNew } from '../../validations/CommonValidation';
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import { Fonts } from '../../controllers/Constants';
import TextViewHML from '../../native_theme/components/TextViewHML';
import SafeView from '../../native_theme/components/SafeView';

class EditCustomLimitsForKeys extends Component {
	constructor(props) {
		super(props);

		//Data from previous screen 
		const { params } = this.props.navigation.state;

		//Define initial state
		this.state = {
			LimitId: params.CustomLimits != undefined ? params.CustomLimits.LimitID : 0,
			MaxCallPerDay: params.CustomLimits != undefined ? params.CustomLimits.MaxPerDay : '',
			MaxCallPerMin: params.CustomLimits != undefined ? params.CustomLimits.MaxPerMinute : '',
			MaxCallPerMonth: params.CustomLimits != undefined ? params.CustomLimits.MaxPerMonth : '',
			MaxOrderPerSec: params.CustomLimits != undefined ? params.CustomLimits.MaxOrderPerSec : '',
			MaxRecordReq: params.CustomLimits != undefined ? params.CustomLimits.MaxRecPerRequest : '',
			WhiteListIpLimit: params.CustomLimits != undefined ? params.CustomLimits.WhitelistedEndPoints : '',
			ConcurrentIpAddressAllow: params.CustomLimits != undefined ? params.CustomLimits.ConcurrentEndPoints : '',
			MaxRequestSize: params.CustomLimits != undefined ? params.CustomLimits.MaxReqSize : '',
			MaxResponseSize: params.CustomLimits != undefined ? params.CustomLimits.MaxResSize : '',
			HistoricalData: params.CustomLimits != undefined ? params.CustomLimits.HistoricalDataMonth : '',
			ReadOnlyMethod: params.CustomLimits != undefined ? params.CustomLimits.ReadOnlyAPI : [],
			FullAccessMethod: params.CustomLimits != undefined ? params.CustomLimits.FullAccessAPI : [],
			SubscribeID: params.SubscribeID != undefined ? params.SubscribeID : 0,
			OldReadOnlyAPI: params.UserActivePlan != undefined ? params.UserActivePlan.ReadOnlyAPI : 0,
			OldFullAccessAPI: params.UserActivePlan != undefined ? params.UserActivePlan.FullAccessAPI : 0,
		};

		//Create reference
		this.inputs = {};
		this.toast = React.createRef();
	}

	componentDidMount = () => {

		//Add this method to change theme based on stored theme name.
		changeTheme();

		let newReadOnlyData = [], newAccessData = []

		// Display all read only method and selected method will be checked
		let keyPairOldReadOnlyAPI = Object.keys(this.state.OldReadOnlyAPI);
		for (var keyReadOnly in keyPairOldReadOnlyAPI) {
			let itemKeyReadOnly = keyPairOldReadOnlyAPI[keyReadOnly];
			let findIndex = Object.keys(this.state.ReadOnlyMethod).findIndex(method => method == itemKeyReadOnly)

			// if index > -1 then selected status true otherwise false
			if (findIndex > -1) {
				newReadOnlyData.push({
					id: itemKeyReadOnly,
					title: this.state.OldReadOnlyAPI[itemKeyReadOnly],
					isSelected: true
				})
			} else {

				newReadOnlyData.push({
					id: itemKeyReadOnly,
					title: this.state.OldReadOnlyAPI[itemKeyReadOnly],
					isSelected: false
				})
			}
		}

		// Display all full access method and selected method will be checked
		let keyPairOldFullAccessAPI = Object.keys(this.state.OldFullAccessAPI);
		for (var keyFullAccess in keyPairOldFullAccessAPI) {
			let itemkeyFullAccess = keyPairOldFullAccessAPI[keyFullAccess];
			let findIndex = Object.keys(this.state.FullAccessMethod).findIndex(method => method == itemkeyFullAccess)

			// if index > -1 then selected status true otherwise false
			if (findIndex > -1) {
				newAccessData.push({
					id: itemkeyFullAccess,
					title: this.state.OldFullAccessAPI[itemkeyFullAccess],
					isSelected: true
				})
			} else {

				newAccessData.push({
					id: itemkeyFullAccess,
					title: this.state.OldFullAccessAPI[itemkeyFullAccess],
					isSelected: false
				})
			}
		}

		this.setState({ ReadOnlyMethod: newReadOnlyData, FullAccessMethod: newAccessData })
	};


	shouldComponentUpdate = (nextProps, nextState) => {
		/* stop twice api call  */
		return isCurrentScreen(nextProps);
	};

	//this Method is used to focus on next feild 
	focusNextField(id) {
		this.inputs[id].focus();
	}

	// User checked full read only method item
	onReadOnlyChecked = (title) => {
		let newArray = this.state.ReadOnlyMethod
		newArray.map((item, index) => {
			if (item.title === title) {
				item.isSelected = !item.isSelected
			}
		})
		this.setState({ ReadOnlyMethod: newArray })
	}

	// User checked full access method item
	onFullAccessChecked = (title) => {
		let newArray = this.state.FullAccessMethod
		newArray.map((item, index) => {
			if (item.title === title) {
				item.isSelected = !item.isSelected
			}
		})
		this.setState({ FullAccessMethod: newArray })
	}

	// User click on custom limits button
	onSetCustomLimits = async () => {

		//Validations for inputs
		if (isEmpty(this.state.MaxCallPerDay))
			this.toast.Show(R.strings.enterMaxCallPerDay)

		else if (isEmpty(this.state.MaxCallPerMin))
			this.toast.Show(R.strings.enterMaxCallPerMin)

		else if (isEmpty(this.state.MaxCallPerMonth))
			this.toast.Show(R.strings.enterMaxCallPerMonth)

		else if (isEmpty(this.state.MaxOrderPerSec))
			this.toast.Show(R.strings.enterMaxOrderPerSecond)

		else if (isEmpty(this.state.MaxRecordReq))
			this.toast.Show(R.strings.enterMaxRecInRequest)

		else if (isEmpty(this.state.WhiteListIpLimit))
			this.toast.Show(R.strings.enterWhiteListIpAddressLimit)

		else if (isEmpty(this.state.ConcurrentIpAddressAllow))
			this.toast.Show(R.strings.enterConcurrentIpAddressAllow)

		else if (isEmpty(this.state.MaxRequestSize))
			this.toast.Show(R.strings.enterMaxRequestSize)

		else if (isEmpty(this.state.MaxResponseSize))
			this.toast.Show(R.strings.enterMaxResponseSize)

		else if (isEmpty(this.state.HistoricalData))
			this.toast.Show(R.strings.enterHistoricalData)
		else {
			let readOnlyId = [], fullAccessId = [];
			let i = 0, j = 0;

			// Create array for selected value of checkbox
			this.state.ReadOnlyMethod.map((item, index) => {
				if (item.isSelected) {
					readOnlyId[i] = item.id;
					i = i + 1;
				}
			})

			// Create array for selected value of checkbox
			this.state.FullAccessMethod.map((item, index) => {
				if (item.isSelected) {
					fullAccessId[j] = item.id;
					j = j + 1;
				}
			})

			//Bind request for edit customlimits APi 
			let req = {
				SubscribeID: this.state.SubscribeID,
				LimitID: this.state.LimitId,
				MaxPerMinute: this.state.MaxCallPerMin,
				MaxPerDay: this.state.MaxCallPerDay,
				MaxPerMonth: this.state.MaxCallPerMonth,
				MaxOrderPerSec: this.state.MaxOrderPerSec,
				MaxRecPerRequest: this.state.MaxRecordReq,
				MaxReqSize: this.state.MaxRequestSize,
				MaxResSize: this.state.MaxResponseSize,
				WhitelistedEndPoints: this.state.WhiteListIpLimit,
				ConcurrentEndPoints: this.state.ConcurrentIpAddressAllow,
				HistoricalDataMonth: this.state.HistoricalData,
				ReadonlyAPI: readOnlyId,
				FullAccessAPI: fullAccessId
			}

			// Check internet connection
			if (await isInternet()) {

				// Edit Custom Limit
				this.props.editCustomLimits(req)
			}
		}
	}

	componentDidUpdate = (prevProps, _prevState) => {

		//Get All Updated field of Particular actions
		const { EditCustomLimitsData } = this.props.ApiPlanResult

		if (EditCustomLimitsData !== prevProps.ApiPlanResult.EditCustomLimitsData) {

			// SetCustomLimitsData is not null
			if (EditCustomLimitsData) {
				try {
					// Handle success Response EditCustomLimitsData
					if (validateResponseNew({ response: EditCustomLimitsData })) {

						// Show success dialog
						showAlert(R.strings.Success + '!', R.strings.customLimitUpdatedSuccessfully, 0, () => {
							this.props.clearApiPlanData();
							this.props.navigation.state.params.onRefresh()
							this.props.navigation.goBack()
						});
					} else {
						// clear data
						this.props.clearApiPlanData();
					}
				} catch (error) {
					// clear data
					this.props.clearApiPlanData();
				}
			}
		}
	}

	render() {
		let { EditCustomLimitsLoading } = this.props.ApiPlanResult
		return (
			<SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

				{/* To set status bar as per our theme */}
				<CommonStatusBar />

				{/* To set toolbar as per our theme */}
				<CustomToolbar
					title={R.strings.editCustomLimits}
					isBack={true}
					nav={this.props.navigation} />

				<ProgressDialog isShow={EditCustomLimitsLoading} />

				{/* Common Toast */}
				<CommonToast ref={component => this.toast = component} />

				<View style={{ flex: 1, justifyContent: 'space-between' }}>
					<ScrollView showsVerticalScrollIndicator={false}>
						<View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.padding_top_bottom_margin, paddingTop: R.dimens.padding_top_bottom_margin }}>

							{/* Input for Max. calls per day */}
							<EditText
								header={R.strings.maxCallDay}
								placeholder={R.strings.maxCallDay}
								multiline={false}
								keyboardType='numeric'
								returnKeyType={"next"}
								blurOnSubmit={false}
								validate={true}
								onlyDigit={true}
								onChangeText={(item) => this.setState({ MaxCallPerDay: item })}
								value={this.state.MaxCallPerDay.toString()}
								reference={input => { this.inputs['etMaxCallPerDay'] = input; }}
								onSubmitEditing={() => { this.focusNextField('etMaxCallPerMin') }}
							/>

							{/* Input for Max. calls per minute */}
							<EditText
								header={R.strings.maxCallMin}
								placeholder={R.strings.maxCallMin}
								multiline={false}
								keyboardType='numeric'
								returnKeyType={"next"}
								blurOnSubmit={false}
								validate={true}
								onlyDigit={true}
								onChangeText={(item) => this.setState({ MaxCallPerMin: item })}
								value={this.state.MaxCallPerMin.toString()}
								reference={input => { this.inputs['etMaxCallPerMin'] = input; }}
								onSubmitEditing={() => { this.focusNextField('etMaxCallPerMonth') }}
							/>

							{/* Input for Max. calls per month */}
							<EditText
								header={R.strings.maxCallMonth}
								placeholder={R.strings.maxCallMonth}
								multiline={false}
								keyboardType='numeric'
								returnKeyType={"next"}
								blurOnSubmit={false}
								validate={true}
								onlyDigit={true}
								onChangeText={(item) => this.setState({ MaxCallPerMonth: item })}
								value={this.state.MaxCallPerMonth.toString()}
								reference={input => { this.inputs['etMaxCallPerMonth'] = input; }}
								onSubmitEditing={() => { this.focusNextField('etMaxOrderPerSec') }}
							/>

							{/* Input for Max. order per second */}
							<EditText
								header={R.strings.maxOrderPlacedSec}
								placeholder={R.strings.maxOrderPlacedSec}
								multiline={false}
								keyboardType='numeric'
								returnKeyType={"next"}
								blurOnSubmit={false}
								validate={true}
								onlyDigit={true}
								onChangeText={(item) => this.setState({ MaxOrderPerSec: item })}
								value={this.state.MaxOrderPerSec.toString()}
								reference={input => { this.inputs['etMaxOrderPerSec'] = input; }}
								onSubmitEditing={() => { this.focusNextField('etMaxRecordReq') }}
							/>

							{/* Input for Max. Records in Request */}
							<EditText
								header={R.strings.maxRecInRequest}
								placeholder={R.strings.maxRecInRequest}
								multiline={false}
								keyboardType='numeric'
								returnKeyType={"next"}
								blurOnSubmit={false}
								validate={true}
								onlyDigit={true}
								onChangeText={(item) => this.setState({ MaxRecordReq: item })}
								value={this.state.MaxRecordReq.toString()}
								reference={input => { this.inputs['etMaxRecordReq'] = input; }}
								onSubmitEditing={() => { this.focusNextField('etWhiteListIpLimit') }}
							/>

							{/* Input for White list Ip Limit */}
							<EditText
								header={R.strings.whiteListIpAddressLimit}
								placeholder={R.strings.whiteListIpAddressLimit}
								multiline={false}
								keyboardType='numeric'
								returnKeyType={"next"}
								blurOnSubmit={false}
								validate={true}
								onlyDigit={true}
								onChangeText={(item) => this.setState({ WhiteListIpLimit: item })}
								value={this.state.WhiteListIpLimit.toString()}
								reference={input => { this.inputs['etWhiteListIpLimit'] = input; }}
								onSubmitEditing={() => { this.focusNextField('etConcurrentIpAddressAllow') }}
							/>

							{/* Input for Concurrent IpAddress Allow */}
							<EditText
								header={R.strings.concurrentIpAddressAllow}
								placeholder={R.strings.concurrentIpAddressAllow}
								multiline={false}
								keyboardType='numeric'
								returnKeyType={"next"}
								blurOnSubmit={false}
								validate={true}
								onlyDigit={true}
								onChangeText={(item) => this.setState({ ConcurrentIpAddressAllow: item })}
								value={this.state.ConcurrentIpAddressAllow.toString()}
								reference={input => { this.inputs['etConcurrentIpAddressAllow'] = input; }}
								onSubmitEditing={() => { this.focusNextField('etMaxRequestSize') }}
							/>

							{/* Input for Max Request Size */}
							<EditText
								header={R.strings.maxRequestSize}
								placeholder={R.strings.maxRequestSize}
								multiline={false}
								keyboardType='numeric'
								returnKeyType={"next"}
								blurOnSubmit={false}
								validate={true}
								onlyDigit={true}
								onChangeText={(item) => this.setState({ MaxRequestSize: item })}
								value={this.state.MaxRequestSize.toString()}
								reference={input => { this.inputs['etMaxRequestSize'] = input; }}
								onSubmitEditing={() => { this.focusNextField('etMaxResponseSize') }}
							/>

							{/* Input for Max Response Size */}
							<EditText
								header={R.strings.maxResponseSize}
								placeholder={R.strings.maxResponseSize}
								multiline={false}
								keyboardType='numeric'
								returnKeyType={"next"}
								blurOnSubmit={false}
								validate={true}
								onlyDigit={true}
								onChangeText={(item) => this.setState({ MaxResponseSize: item })}
								value={this.state.MaxResponseSize.toString()}
								reference={input => { this.inputs['etMaxResponseSize'] = input; }}
								onSubmitEditing={() => { this.focusNextField('etHistoricalData') }}
							/>

							{/* Input for Historical Data */}
							<EditText
								header={R.strings.historicalData}
								placeholder={R.strings.historicalData}
								multiline={false}
								keyboardType='numeric'
								validate={true}
								onlyDigit={true}
								returnKeyType={"done"}
								onChangeText={(item) => this.setState({ HistoricalData: item })}
								value={this.state.HistoricalData.toString()}
								reference={input => { this.inputs['etHistoricalData'] = input; }}
							/>

							{/* Read Only Method List */}
							{
								Object.values(this.state.ReadOnlyMethod).length > 0 &&
								<View style={{ marginTop: R.dimens.margin }}>
									<Text style={{ flex: 1, textAlign: 'center', color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, marginLeft: R.dimens.LineHeight }}>{R.strings.readOnlyApiMethods}</Text>
									{
										Object.values(this.state.ReadOnlyMethod).map((item, index) => {
											return (
												<View key={index} style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginTop: R.dimens.widgetMargin, marginLeft: R.dimens.LineHeight, marginRight: R.dimens.LineHeight }}>
													<TextViewHML style={{ flex: 1, color: R.colors.textPrimary, fontSize: R.dimens.smallText }}>{item.title}</TextViewHML>
													<ImageTextButton
														icon={item.isSelected ? R.images.FILL_CHECKBOX : R.images.EMPTY_CHECKBOX}
														onPress={() => this.onReadOnlyChecked(item.title)}
														style={{ margin: 0, flexDirection: 'row-reverse', }}
														iconStyle={{ tintColor: item.isSelected ? R.colors.accent : R.colors.textPrimary, width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon }}
													/>
												</View>
											)
										})
									}
								</View>
							}

							{/* Full Access Method List */}
							{
								Object.values(this.state.FullAccessMethod).length > 0 &&
								<View style={{ marginTop: R.dimens.margin }}>
									<Text style={{ flex: 1, textAlign: 'center', color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold, marginLeft: R.dimens.LineHeight }}>{R.strings.fullAccessApiMethods}</Text>
									{
										Object.values(this.state.FullAccessMethod).map((item, index) => {
											return (
												<View key={index} style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginTop: R.dimens.widgetMargin, marginLeft: R.dimens.LineHeight, marginRight: R.dimens.LineHeight }}>
													<TextViewHML style={{ flex: 1, color: R.colors.textPrimary, fontSize: R.dimens.smallText }}>{item.title}</TextViewHML>
													<ImageTextButton
														icon={item.isSelected ? R.images.FILL_CHECKBOX : R.images.EMPTY_CHECKBOX}
														onPress={() => this.onFullAccessChecked(item.title)}
														iconStyle={{ tintColor: item.isSelected ? R.colors.accent : R.colors.textPrimary, height: R.dimens.dashboardMenuIcon, width: R.dimens.dashboardMenuIcon }}
														style={{ margin: 0, flexDirection: 'row-reverse', }}
													/>
												</View>
											)
										})
									}
								</View>
							}
						</View>
					</ScrollView>

					<View style={{ paddingTop: R.dimens.widget_top_bottom_margin, paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, }}>
						{/* To Set Renew Button */}
						<Button title={R.strings.edit} onPress={this.onSetCustomLimits}></Button>
					</View>
				</View>
			</SafeView>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		//Updated data for edit customlimits action
		ApiPlanResult: state.ApiPlanListReducer,
	}
}

const mapDispatchToProps = (dispatch) => ({
	//Perform Edit Custom Limits action
	editCustomLimits: (payload) => dispatch(editCustomLimits(payload)),
	//Perform Clear Api Plan Data action
	clearApiPlanData: () => dispatch(clearApiPlanData()),
})

export default connect(mapStateToProps, mapDispatchToProps)(EditCustomLimitsForKeys)