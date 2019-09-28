import React, { Component } from 'react'
import { Text, View, ScrollView } from 'react-native'
import { changeTheme, parseFloatVal, showAlert, parseIntVal } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../Navigation';
import { connect } from 'react-redux';
import { updateApiPlanConfig, clearApiPlanConfigData } from '../../../actions/ApiKeyConfiguration/ApiPlanConfigActions';
import { isInternet, validateResponseNew, isEmpty } from '../../../validations/CommonValidation';
import SafeView from '../../../native_theme/components/SafeView';
import R from '../../../native_theme/R';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import IndicatorViewPager from '../../../native_theme/components/IndicatorViewPager';
import EditText from '../../../native_theme/components/EditText';
import { TitlePicker } from '../../widget/ComboPickerWidget';
import ImageTextButton from '../../../native_theme/components/ImageTextButton';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import { Fonts } from '../../../controllers/Constants';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import CommonToast from '../../../native_theme/components/CommonToast';
import BottomButton from '../../../native_theme/components/BottomButton';

export class EditApiPlanConfigScreen extends Component {
	constructor(props) {
		super(props);

		// Get Item from previous screen
		let item = props.navigation.state.params && props.navigation.state.params.item

		// Get Read Only Method from previous screen
		let ReadOnlyAPI = props.navigation.state.params && props.navigation.state.params.ReadOnlyAPI

		// Get Full Access Method from previous screen
		let FullAccessAPI = props.navigation.state.params && props.navigation.state.params.FullAccessAPI

		// Get Currency List from previous screen
		let Currency = props.navigation.state.params && props.navigation.state.params.Currency

		// Define all initial state
		this.state = {

			tabPosition: 0,
			tabsName: [R.strings.apiDetail, R.strings.planValidity, R.strings.apiSelections],

			CurrencyListDataState: null,
			UpdateApiPlanConfigDataState: null,

			Currency: item ? Currency : [],
			PlanValidityType: [
				{ value: R.strings.Please_Select },
				{ value: R.strings.day, ID: 1 },
				{ value: R.strings.month, ID: 2 },
				{ value: R.strings.Year, ID: 3 },
			],

			selectedCurrency: R.strings.selectCurrency,
			selectedPlanValType: R.strings.Please_Select,

			ID: item ? item.ID : 0,
			PlanName: item ? item.PlanName : '',
			PlanValidity: item ? item.PlanValidity.toString() : '',
			Price: item ? item.Price.toString() : '',
			Charge: item ? item.Charge.toString() : '',
			Priority: item ? item.Priority.toString() : '',
			MaxPerMinute: item ? item.MaxPerMinute.toString() : '',
			MaxPerDay: item ? item.MaxPerDay.toString() : '',
			MaxPerMonth: item ? item.MaxPerMonth.toString() : '',
			MaxOrderPerSec: item ? item.MaxOrderPerSec.toString() : '',
			MaxRecordPerReq: item ? item.MaxRecPerRequest.toString() : '',
			MaxReqSize: item ? item.MaxReqSize.toString() : '',
			MaxResSize: item ? item.MaxResSize.toString() : '',
			WhitelistEndPoint: item ? item.Whitelistendpoints.toString() : '',
			ConcurrenctEndPoint: item ? item.ConcurrentEndPoints.toString() : '',
			HistoricalMonth: item ? item.HistoricalDataMonth.toString() : '',
			PlanDesc: item ? item.PlanDesc : '',
			PlanValTypeId: item ? item.PlanValidityType : 0,
			WalletTypeId: item ? item.ServiceID : 0,

			IsPlanRecursive: item ? (item.IsPlanRecursive == 1 ? true : false) : false,
			isFirstTime: true,

			OldReadOnlyAPI: ReadOnlyAPI ? ReadOnlyAPI : [],
			OldFullAccessAPI: FullAccessAPI ? FullAccessAPI : [],

			ReadOnlyAPI: item ? item.ReadOnlyAPI : [],
			FullAccessAPI: FullAccessAPI ? item.FullAccessAPI : [],
		}

		this.inputs = {}

		// create reference
		this.toast = React.createRef()
	}

	async componentDidMount() {

		//Add this method to change theme based on stored theme name.
		changeTheme()

		let newReadOnlyData = [], newAccessData = []

		// Display all read only method and selected method will be checked
		let keyPairOldReadOnlyAPI = this.state.OldReadOnlyAPI;
		for (var itemKeyReadOnly of keyPairOldReadOnlyAPI) {
			let item = itemKeyReadOnly
			let findIndex = Object.keys(this.state.ReadOnlyAPI).findIndex(ID => ID === item.ID.toString())

			// if index > -1 then selected status true otherwise false
			if (findIndex > -1) {
				newReadOnlyData.push({
					id: item.ID,
					title: item.MethodName,
					isSelected: true
				})
			} else {
				newReadOnlyData.push({
					id: item.ID,
					title: item.MethodName,
					isSelected: false
				})
			}
		}

		// Display all full access method and selected method will be checked
		let keyPairOldFullAccessAPI = this.state.OldFullAccessAPI;
		for (var itemkeyFullAccess of keyPairOldFullAccessAPI) {
			let item = itemkeyFullAccess

			let findIndex = Object.keys(this.state.FullAccessAPI).findIndex(ID => ID === item.ID.toString())

			// if index > -1 then selected status true otherwise false
			if (findIndex > -1) {
				newAccessData.push({
					id: item.ID,
					title: item.MethodName,
					isSelected: true
				})
			} else {
				newAccessData.push({
					id: item.ID,
					title: item.MethodName,
					isSelected: false
				})
			}
		}

		let currencyName = ''
		let currency = this.state.Currency
		for (var itemCurrency of currency) {
			let item = itemCurrency

			if (item.ServiceId == this.state.WalletTypeId)
				currencyName = item.SMSCode
		}

		let planValidateType = ''
		for (var itemPlan of this.state.PlanValidityType) {
			if (itemPlan.ID == this.state.PlanValTypeId)
				planValidateType = itemPlan.value
		}

		this.setState({
			ReadOnlyAPI: newReadOnlyData,
			FullAccessAPI: newAccessData,
			selectedCurrency: currencyName,
			selectedPlanValType: planValidateType
		})
	}

	shouldComponentUpdate(nextProps, _nextState) {
		return isCurrentScreen(nextProps)
	}

	// this Method is used to focus on next feild
	focusNextField(id) {
		this.inputs[id].focus();
	}

	// Called when onPage Scrolling
	onPageScroll = (scrollData) => {
		let { position } = scrollData
		if (position != this.state.tabPosition) {
			this.setState({ tabPosition: position, })
		}
	}

	// user press on next page button
	onNextPagePress = () => 
	{
		if (this.state.tabPosition < this.state.tabsName.length - 1) 
		{
			let pos = this.state.tabPosition + 1

			if (this.refs['ApiPlanConfigTab']) 
			{
				this.refs['ApiPlanConfigTab'].setPage(pos)
			}
		}
	}

	// user press on prev page button
	onPrevPagePress = () => 
	{
		if (this.state.tabPosition > 0) 
		{
			let pos = this.state.tabPosition - 1

			if (this.refs['ApiPlanConfigTab']) 
			{
				this.refs['ApiPlanConfigTab'].setPage(pos)
			}
		}
	}

	// User checked full read only method item
	onReadOnlyChecked = (title) => {
		let newArray = this.state.ReadOnlyAPI
		newArray.map((item, index) => {
			if (item.title === title) {
				item.isSelected = !item.isSelected
			}
		})
		this.setState({ ReadOnlyAPI: newArray })
	}

	// User checked full access method item
	onFullAccessChecked = (title) => {
		let newArray = this.state.FullAccessAPI
		newArray.map((item, index) => {
			if (item.title === title) {
				item.isSelected = !item.isSelected
			}
		})
		this.setState({ FullAccessAPI: newArray })
	}

	onSubmitPress = async () => {

		//Check all validations
		if (isEmpty(this.state.PlanName))
			{this.toast.Show(R.strings.enterPlanName)}
		else if (this.state.selectedPlanValType === R.strings.Please_Select)
			{this.toast.Show(R.strings.selectPlanValidityType)}
		else if (isEmpty(this.state.PlanValidity))
			{this.toast.Show(R.strings.enterPlanValidity)}
		else if (this.state.selectedCurrency === R.strings.selectCurrency)
			{this.toast.Show(R.strings.selectCurrency)}
		else if (isEmpty(this.state.Priority))
			{this.toast.Show(R.strings.enterPriority)}
		else {

			let readOnlyId = [], 
			fullAccessId = []
			if (this.state.ReadOnlyAPI.length > 0) {
				for (var readOnlyApiKey in this.state.ReadOnlyAPI) {
					let item = this.state.ReadOnlyAPI[readOnlyApiKey]
					if (item.isSelected)
						readOnlyId.push(item.id)
				}
			}

			if (this.state.FullAccessAPI.length > 0) {
				for (var fullAccessApiKey in this.state.FullAccessAPI) {
					let item = this.state.FullAccessAPI[fullAccessApiKey]
					if (item.isSelected)
						fullAccessId.push(item.id)
				}
			}

			// check internet connection
			if (await isInternet()) {

				let req = {
					ID: this.state.ID,
					PlanName: this.state.PlanName,
					Price: isEmpty(this.state.Price) ? 0 : parseFloatVal(this.state.Price),
					Charge: isEmpty(this.state.Charge) ? 0 : parseFloatVal(this.state.Charge),
					PlanDesc: this.state.PlanDesc,
					Priority: isEmpty(this.state.Priority) ? 0 : parseIntVal(this.state.Priority),
					MaxPerMinute: isEmpty(this.state.MaxPerMinute) ? 0 : parseIntVal(this.state.MaxPerMinute),
					MaxPerDay: isEmpty(this.state.MaxPerDay) ? 0 : parseIntVal(this.state.MaxPerDay),
					MaxPerMonth: isEmpty(this.state.MaxPerMonth) ? 0 : parseIntVal(this.state.MaxPerMonth),
					MaxOrderPerSec: isEmpty(this.state.MaxOrderPerSec) ? 0 : parseIntVal(this.state.MaxOrderPerSec),
					MaxRecPerRequest: isEmpty(this.state.MaxRecordPerReq) ? 0 : parseIntVal(this.state.MaxRecordPerReq),
					MaxReqSize: isEmpty(this.state.MaxReqSize) ? 0 : parseIntVal(this.state.MaxReqSize),
					MaxResSize: isEmpty(this.state.MaxResSize) ? 0 : parseIntVal(this.state.MaxResSize),
					WhitelistedEndPoints: isEmpty(this.state.WhitelistEndPoint) ? 0 : parseIntVal(this.state.WhitelistEndPoint),
					ConcurrentEndPoints: isEmpty(this.state.ConcurrenctEndPoint) ? 0 : parseIntVal(this.state.ConcurrenctEndPoint),
					HistoricalDataMonth: isEmpty(this.state.HistoricalMonth) ? 0 : parseIntVal(this.state.HistoricalMonth),
					IsPlanRecursive: this.state.IsPlanRecursive ? 1 : 0,
					PlanValidity: isEmpty(this.state.PlanValidity) ? 0 : parseIntVal(this.state.PlanValidity),
					PlanValidityType: this.state.PlanValTypeId,
					ReadonlyAPI: readOnlyId.length > 0 ? readOnlyId : [],
					FullAccessAPI: fullAccessId.length > 0 ? fullAccessId : [],
					CreatedIPAddress: '',
					ServiceID: this.state.WalletTypeId
				}

				// Call edit api plan configuration api
				this.props.updateApiPlanConfig(req)
			}
		}
	}

	componentDidUpdate(prevProps, _prevState) {
		//Get All Updated field of Particular actions
		const { UpdateApiPlanConfigData } = this.props.ApiPlanConfigResult

		// check previous props and existing props
		if (UpdateApiPlanConfigData !== prevProps.ApiPlanConfigResult.UpdateApiPlanConfigData) {
			// UpdateApiPlanConfigData is not null
			if (UpdateApiPlanConfigData) {
				try {
					if (this.state.UpdateApiPlanConfigDataState == null || (this.state.UpdateApiPlanConfigDataState != null && UpdateApiPlanConfigData !== this.state.UpdateApiPlanConfigDataState)) {
						// Handle Response
						if (validateResponseNew({ response: UpdateApiPlanConfigData })) {

							this.setState({ UpdateApiPlanConfigDataState: UpdateApiPlanConfigData })

							showAlert(R.strings.Success + '!', R.strings.updatedSuccessFully, 0, () => {
								// Clear api plan configuration data
								this.props.clearApiPlanConfigData()
								// Navigate to Api Plan Configuration List Screen
								this.props.navigation.state.params.onRefresh(true)
								this.props.navigation.goBack()
							})
						} else {
							// Clear api plan configuration data
							this.props.clearApiPlanConfigData()
						}
					}
				} catch (error) {
					// Clear api plan configuration data
					this.props.clearApiPlanConfigData()
					this.setState({ UpdateApiPlanConfigDataState: null })
				}
			}
		}
	}

	render() {

		// Loading status for Progress bar which is fetching from reducer
		let { CurrencyListLoading, UpdateApiPlanConfigLoading } = this.props.ApiPlanConfigResult

		let { IsPlanRecursive } = this.state
		return (
			<SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
				{/* To set status bar as per our theme */}
				<CommonStatusBar />

				{/* To set toolbar as per our theme */}
				<CustomToolbar
					title={R.strings.updateApiPlanConfig}
					isBack={true}
					nav={this.props.navigation}
				/>

				{/* Progressbar */}
				<ProgressDialog isShow={CurrencyListLoading || UpdateApiPlanConfigLoading} />

				{/* Custom Toast for displaying message */}
				<CommonToast ref={cmpToast => this.toast = cmpToast} />

				<View style={{ flex: 1, justifyContent: 'space-between' }}>

					<IndicatorViewPager
						ref={'ApiPlanConfigTab'}
						isGradient={true}
						titles={this.state.tabsName}
						numOfItems={3}
						horizontalScroll={false}
						onPageScroll={this.onPageScroll}
						style={{ marginLeft: R.dimens.activity_margin, marginRight: R.dimens.activity_margin }}>

						{/* Api Detail Tab */}
						<View>
							<ScrollView showsVerticalScrollIndicator={false}>
								<View style={{ flex: 1, paddingBottom: R.dimens.padding_top_bottom_margin, paddingTop: R.dimens.padding_top_bottom_margin, paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin }}>

									{/* To Set Plan Name in EditText */}
									<EditText
										style={{ marginTop: 0 }}
										isRequired={true}
										reference={input => { this.inputs['etPlanName'] = input; }}
										header={R.strings.plan_name}
										placeholder={R.strings.plan_name}
										multiline={false}
										maxLength={50}
										keyboardType='default'
										returnKeyType={"next"}
										blurOnSubmit={false}
										onSubmitEditing={() => { this.focusNextField('etEditPlanValidaity') }}
										onChangeText={(PlanName) => this.setState({ PlanName })}
										value={this.state.PlanName}
									/>

									{/* Picker for Plan Validity Type */}
									<TitlePicker
										style={{ marginTop: R.dimens.margin }}
										isRequired={true}
										title={R.strings.planValidityType}
										array={this.state.PlanValidityType}
										selectedValue={this.state.selectedPlanValType}
										onPickerSelect={(item, object) => this.setState({ selectedPlanValType: item, PlanValTypeId: object.ID })} />


									{/* To Set Plan Validity in EditText */}
									<EditText
										isRequired={true}
										reference={input => { this.inputs['etEditPlanValidaity'] = input; }}
										header={R.strings.planValidity}
										placeholder={R.strings.planValidity}
										multiline={false}
										maxLength={10}
										keyboardType='numeric'
										returnKeyType={"next"}
										blurOnSubmit={false}
										onSubmitEditing={() => { this.focusNextField('etEditPrice') }}
										onChangeText={(PlanValidity) => this.setState({ PlanValidity })}
										value={this.state.PlanValidity}
										validate={true}
										onlyDigit={true}
									/>

									{/* Picker for Currency */}
									<TitlePicker
										style={{ marginTop: R.dimens.margin }}
										isRequired={true}
										title={R.strings.Currency}
										array={this.state.Currency}
										selectedValue={this.state.selectedCurrency}
										onPickerSelect={(item, object) => this.setState({ selectedCurrency: item, WalletTypeId: object.ServiceId })} />

									{/* To Set Price in EditText */}
									<EditText
										reference={input => { this.inputs['etEditPrice'] = input; }}
										header={R.strings.price}
										placeholder={R.strings.price}
										multiline={false}
										maxLength={10}
										keyboardType='numeric'
										returnKeyType={"next"}
										blurOnSubmit={false}
										onSubmitEditing={() => { this.focusNextField('etEditCharge') }}
										onChangeText={(Price) => this.setState({ Price })}
										value={this.state.Price}
										validate={true}
									/>

									{/* To Set Charge in EditText */}
									<EditText
										reference={input => { this.inputs['etEditCharge'] = input; }}
										header={R.strings.Charge}
										placeholder={R.strings.Charge}
										multiline={false}
										maxLength={10}
										keyboardType='numeric'
										returnKeyType={"next"}
										blurOnSubmit={false}
										onSubmitEditing={() => { this.focusNextField('etEditPriority') }}
										onChangeText={(Charge) => this.setState({ Charge })}
										value={this.state.Charge}
										validate={true}
									/>

									{/* To Set Priority in EditText */}
									<EditText
										isRequired={true}
										reference={input => { this.inputs['etEditPriority'] = input; }}
										header={R.strings.priority}
										placeholder={R.strings.priority}
										multiline={false}
										maxLength={10}
										keyboardType='numeric'
										returnKeyType={"next"}
										onSubmitEditing={() => { this.focusNextField('etPlanDesc') }}
										onChangeText={(Priority) => this.setState({ Priority })}
										value={this.state.Priority}
										blurOnSubmit={false}
										validate={true}
									/>

									{/* To Set Plan Description in EditText */}
									<EditText
										reference={input => { this.inputs['etPlanDesc'] = input; }}
										header={R.strings.planDesc}
										placeholder={R.strings.planDesc}
										multiline={true}
										numberOfLines={4}
										maxLength={300}
										style={{marginBottom: R.dimens.widgetMargin,}}
										textAlignVertical={'top'}
										keyboardType='default'
										returnKeyType={"done"}
										onChangeText={(PlanDesc) => this.setState({ PlanDesc })}
										value={this.state.PlanDesc}
										blurOnSubmit={true}
									/>
								</View>
							</ScrollView>
						</View>

						{/* Plan Validity Tab */}
						<View>
							<ScrollView showsVerticalScrollIndicator={false}>
								<View style={{ flex: 1, paddingBottom: R.dimens.padding_top_bottom_margin, paddingTop: R.dimens.padding_top_bottom_margin, paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin }}>

									{/* To Set Max.Per Minute in EditText */}
									<EditText
										style={{ marginTop: 0 }}
										reference={input => { this.inputs['etMaxPerMin'] = input; }}
										header={R.strings.maxPerMin}
										placeholder={R.strings.maxPerMin}
										multiline={false}
										keyboardType='numeric'
										returnKeyType={"next"}
										onSubmitEditing={() => { this.focusNextField('etEditMaxPerDay') }}
										onChangeText={(MaxPerMinute) => this.setState({ MaxPerMinute })}
										value={this.state.MaxPerMinute}
										validate={true}
										onlyDigit={true}
										blurOnSubmit={false}
									/>

									{/* To Set Max.Per Day in EditText */}
									<EditText
										reference={input => { this.inputs['etEditMaxPerDay'] = input; }}
										header={R.strings.maxPerDay}
										placeholder={R.strings.maxPerDay}
										multiline={false}
										keyboardType='numeric'
										returnKeyType={"next"}
										onSubmitEditing={() => { this.focusNextField('etEditMaxPerMonth') }}
										onChangeText={(MaxPerDay) => this.setState({ MaxPerDay })}
										value={this.state.MaxPerDay}
										validate={true}
										onlyDigit={true}
										blurOnSubmit={false}
									/>

									{/* To Set Max.Per Month in EditText */}
									<EditText
										reference={input => { this.inputs['etEditMaxPerMonth'] = input; }}
										header={R.strings.maxPerMonth}
										placeholder={R.strings.maxPerMonth}
										multiline={false}
										keyboardType='numeric'
										returnKeyType={"next"}
										onSubmitEditing={() => { this.focusNextField('etEditMaxOrderPerSec') }}
										onChangeText={(MaxPerMonth) => this.setState({ MaxPerMonth })}
										value={this.state.MaxPerMonth}
										validate={true}
										onlyDigit={true}
										blurOnSubmit={false}
									/>

									{/* To Set Max.Order Per Second in EditText */}
									<EditText
										reference={input => { this.inputs['etEditMaxOrderPerSec'] = input; }}
										header={R.strings.maxOrderPerSec}
										placeholder={R.strings.maxOrderPerSec}
										multiline={false}
										keyboardType='numeric'
										returnKeyType={"next"}
										onSubmitEditing={() => { this.focusNextField('etEditMaxRecordPerReq') }}
										onChangeText={(MaxOrderPerSec) => this.setState({ MaxOrderPerSec })}
										value={this.state.MaxOrderPerSec}
										validate={true}
										onlyDigit={true}
										blurOnSubmit={false}
									/>

									{/* To Set Max.Record Per Request in EditText */}
									<EditText
										reference={input => { this.inputs['etEditMaxRecordPerReq'] = input; }}
										header={R.strings.maxRecPerRequest}
										placeholder={R.strings.maxRecPerRequest}
										multiline={false}
										keyboardType='numeric'
										returnKeyType={"next"}
										onSubmitEditing={() => { this.focusNextField('etEditMaxReqSize') }}
										onChangeText={(MaxRecordPerReq) => this.setState({ MaxRecordPerReq })}
										value={this.state.MaxRecordPerReq}
										validate={true}
										onlyDigit={true}
										blurOnSubmit={false}
									/>

									{/* To Set Max. Request Size in EditText */}
									<EditText
										reference={input => { this.inputs['etEditMaxReqSize'] = input; }}
										header={R.strings.maxRequestSize}
										placeholder={R.strings.maxRequestSize}
										multiline={false}
										keyboardType='numeric'
										returnKeyType={"next"}
										onSubmitEditing={() => { this.focusNextField('etEditMaxResSize') }}
										onChangeText={(MaxReqSize) => this.setState({ MaxReqSize })}
										value={this.state.MaxReqSize}
										validate={true}
										onlyDigit={true}
										blurOnSubmit={false}
									/>

									{/* To Set Max. Response Size in EditText */}
									<EditText
										reference={input => { this.inputs['etEditMaxResSize'] = input; }}
										header={R.strings.maxResponseSize}
										placeholder={R.strings.maxResponseSize}
										multiline={false}
										keyboardType='numeric'
										returnKeyType={"next"}
										onSubmitEditing={() => { this.focusNextField('etWhitelstEndPoint') }}
										onChangeText={(MaxResSize) => this.setState({ MaxResSize })}
										value={this.state.MaxResSize}
										validate={true}
										onlyDigit={true}
										blurOnSubmit={false}
									/>

									{/* To Set Whitelist End Point in EditText */}
									<EditText
										reference={input => { this.inputs['etWhitelstEndPoint'] = input; }}
										header={R.strings.whitelistEndPoint}
										placeholder={R.strings.whitelistEndPoint}
										multiline={false}
										maxLength={10}
										keyboardType='numeric'
										returnKeyType={"next"}
										onSubmitEditing={() => { this.focusNextField('etConcurEndPoint') }}
										onChangeText={(WhitelistEndPoint) => this.setState({ WhitelistEndPoint })}
										value={this.state.WhitelistEndPoint}
										validate={true}
										onlyDigit={true}
										blurOnSubmit={false}
									/>

									{/* To Set Concurrent End Point in EditText */}
									<EditText
										reference={input => { this.inputs['etConcurEndPoint'] = input; }}
										header={R.strings.concurrenctEndPoint}
										placeholder={R.strings.concurrenctEndPoint}
										multiline={false}
										maxLength={10}
										keyboardType='numeric'
										returnKeyType={"next"}
										onSubmitEditing={() => { this.focusNextField('etEditHistoricalData') }}
										onChangeText={(ConcurrenctEndPoint) => this.setState({ ConcurrenctEndPoint })}
										value={this.state.ConcurrenctEndPoint}
										validate={true}
										onlyDigit={true}
										blurOnSubmit={false}
									/>

									{/* To Set Historical Data in EditText */}
									<EditText
										reference={input => { this.inputs['etEditHistoricalData'] = input; }}
										header={R.strings.historicalDataMonth}
										placeholder={R.strings.historicalDataMonth}
										multiline={false}
										maxLength={10}
										keyboardType='numeric'
										returnKeyType={"done"}
										onChangeText={(ConcurrenctEndPoint) => this.setState({ ConcurrenctEndPoint })}
										value={this.state.ConcurrenctEndPoint}
										validate={true}
										onlyDigit={true}
									/>
								</View>
							</ScrollView>
						</View>

						{/* API Selections Tab */}
						<View>
							<ScrollView showsVerticalScrollIndicator={false}>
								<View style={{ flex: 1, paddingBottom: R.dimens.padding_top_bottom_margin, paddingTop: R.dimens.padding_top_bottom_margin, paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin }}>

									{/* Selection for Plan Recursive */}
									<View style={{ flex: 1, marginTop: R.dimens.margin, flexDirection: 'row', alignItems: 'center', }}>
										<TextViewHML style={{ color: R.colors.textPrimary, flex: 1, fontSize: R.dimens.smallText }}>{R.strings.planRecursive}</TextViewHML>
										<ImageTextButton
											icon={IsPlanRecursive ? R.images.FILL_CHECKBOX : R.images.EMPTY_CHECKBOX}
											onPress={() => this.setState({ IsPlanRecursive: !IsPlanRecursive })}
											style={{ margin: 0, flexDirection: 'row-reverse' }}
											iconStyle={{ tintColor: IsPlanRecursive ? R.colors.accent : R.colors.textPrimary, width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon }}
										/>
									</View>

									{/* Read Only Method List */}
									{
										Object.values(this.state.ReadOnlyAPI).length > 0 &&
										<View style={{ marginTop: R.dimens.margin, }}>
											<Text style={{ color: R.colors.textPrimary, fontFamily: Fonts.HindmaduraiBold, fontSize: R.dimens.smallText, marginLeft: R.dimens.LineHeight }}>{R.strings.readOnlyApiMethods}</Text>
											{
												Object.values(this.state.ReadOnlyAPI).map((item, index) => {
													return (
														<View key={index} style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginTop: R.dimens.widgetMargin, marginLeft: R.dimens.LineHeight, marginRight: R.dimens.LineHeight }}>
															<TextViewHML style={{ flex: 1, color: R.colors.textPrimary, fontSize: R.dimens.smallText }}>{item.title}</TextViewHML>
															<ImageTextButton
																style={{ margin: 0, flexDirection: 'row-reverse', }}
																onPress={() => this.onReadOnlyChecked(item.title)}
																iconStyle={{ tintColor: item.isSelected ? R.colors.accent : R.colors.textPrimary, width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon }}
																icon={item.isSelected ? R.images.FILL_CHECKBOX : R.images.EMPTY_CHECKBOX}
															/>
														</View>
													)
												})
											}
										</View>
									}

									{/* Full Access Method List */}
									{
										Object.values(this.state.FullAccessAPI).length > 0 &&
										<View style={{ marginTop: R.dimens.margin }}>
											<Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.HindmaduraiBold, marginLeft: R.dimens.LineHeight }}>{R.strings.fullAccessApiMethods}</Text>
											{
												Object.values(this.state.FullAccessAPI).map((item, index) => {
													return (
														<View key={index} style={{ flex: 1, marginTop: R.dimens.widgetMargin, marginLeft: R.dimens.LineHeight, flexDirection: 'row', alignItems: 'center', marginRight: R.dimens.LineHeight }}>
															<TextViewHML style={{ color: R.colors.textPrimary, flex: 1, fontSize: R.dimens.smallText }}>{item.title}</TextViewHML>
															<ImageTextButton
																icon={item.isSelected ? R.images.FILL_CHECKBOX : R.images.EMPTY_CHECKBOX}
																onPress={() => this.onFullAccessChecked(item.title)}
																style={{ margin: 0, flexDirection: 'row-reverse' }}
																iconStyle={{ tintColor: item.isSelected ? R.colors.accent : R.colors.textPrimary, width: R.dimens.dashboardMenuIcon, height: R.dimens.dashboardMenuIcon }}
															/>
														</View>
													)
												})
											}
										</View>
									}

								</View>
							</ScrollView>
						</View>
					</IndicatorViewPager>

					<View style={{ alignItems: 'center', flexDirection: 'row', margin: R.dimens.margin }}>
						{
							this.state.tabPosition > 0 ?
								<BottomButton title={R.strings.Prev} onPress={() => this.onPrevPagePress()} />
								:
								null
						}
						<View style={{ flex: 1 }} />
						{
							(this.state.tabPosition < this.state.tabsName.length - 1) ?
								<BottomButton title={R.strings.next} onPress={() => this.onNextPagePress()} />
								:
								<BottomButton title={R.strings.update} onPress={() => this.onSubmitPress()} />
						}
					</View>
				</View>
			</SafeView>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		// get api plan configuration data from reducer
		ApiPlanConfigResult: state.ApiPlanConfigReducer,
	}
}

const mapDispatchToProps = (dispatch) => ({
	// Clear Api Plan Configuration
	clearApiPlanConfigData: () => dispatch(clearApiPlanConfigData()),
	// Perform Update Api Plan Configuration Action
	updateApiPlanConfig: (payload) => dispatch(updateApiPlanConfig(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(EditApiPlanConfigScreen)