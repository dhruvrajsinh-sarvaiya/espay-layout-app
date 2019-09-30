import React, { Component } from 'react'
import { View, ScrollView } from 'react-native'
import SafeView from '../../../native_theme/components/SafeView';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import R from '../../../native_theme/R';
import CommonToast from '../../../native_theme/components/CommonToast';
import Button from '../../../native_theme/components/Button';
import { connect } from 'react-redux';
import { changeTheme, parseArray, parseFloatVal, showAlert } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../Navigation';
import { addStakingPolicy, clearStakingConfig } from '../../../actions/Wallet/StakingConfigurationAction';
import { TitlePicker } from '../../widget/ComboPickerWidget';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import EditText from '../../../native_theme/components/EditText';
import { FeatureSwitch } from '../../../native_theme/components/FeatureSwitch';
import { getWalletType } from '../../../actions/PairListAction';
import { validateResponseNew, isInternet, isEmpty } from '../../../validations/CommonValidation';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import TextCard from '../../../native_theme/components/TextCard';
import RadioButton from '../../../native_theme/components/RadioButton';

export class AddEditStakingPolicyScreen extends Component {
	constructor(props) {
		super(props)

		// get data from previous screen
		let { item, masterItem } = props.navigation.state.params

		let etMinAmount = '';
		let etMaxAmount = '';
		let etAmount = '';
		if (item !== undefined) {
			if (item.SlabType == 1) {
				etAmount = (parseFloatVal(item.AvailableAmount).toFixed(8) !== 'NaN' ? parseFloatVal(item.AvailableAmount).toFixed(8).toString() : '')
			} else {
				etMinAmount = (parseFloatVal((item.AvailableAmount).split('-')[0]).toFixed(8) !== 'NaN' ? parseFloatVal((item.AvailableAmount).split('-')[0]).toFixed(8).toString() : '')
				etMaxAmount = (parseFloatVal((item.AvailableAmount).split('-')[1]).toFixed(8) !== 'NaN' ? parseFloatVal((item.AvailableAmount).split('-')[1]).toFixed(8).toString() : '')
			}
		}

		// Define all initial state
		this.state = {
			MasterId: masterItem.Id,
			SlabType: item !== undefined ? item.SlabType : masterItem.SlabType,
			StakingType: item !== undefined ? item.StakingType : masterItem.StakingType,
			selectedCurrency: item !== undefined ? item.StakingCurrency : masterItem.WalletTypeName,

			PolicyDetailId: item !== undefined ? item.PolicyDetailID : 0,
			isEdit: item !== undefined ? true : false,
			selectedMaturityCurrency: item !== undefined ? item.MaturityCurrencyName : '',

			Currency: [],
			MaturityCurrency: [],
			Months: item !== undefined ? item.DurationMonth.toString() : '',
			Weeks: item !== undefined ? item.DurationWeek.toString() : '',
			MinAmount: item !== undefined ? etMinAmount : '',
			MaxAmount: item !== undefined ? etMaxAmount : '',

			isAutoUnstaking: item !== undefined ? (item.EnableAutoUnstaking == 1 ? true : false) : false,
			isStakingBeforeMaturity: item !== undefined ? ((item.EnableStakingBeforeMaturity) == 1 ? true : false) : false,
			isRenewUnstaking: item !== undefined ? ((item.RenewUnstakingEnable) == 1 ? true : false) : false,
			MakerCharges: item !== undefined ? (item.MakerCharges).toString() : '',
			TakerCharges: item !== undefined ? (item.TakerCharges).toString() : '',
			InterestAmount: item !== undefined ? (item.InterestValue).toString() : '',
			RenewUnstakingPeriod: item !== undefined ? (item.RenewUnstakingPeriod).toString() : '',
			StakingBeforeMaturity: item !== undefined ? (item.EnableStakingBeforeMaturityCharge).toString() : '',
			Amount: item !== undefined ? etAmount : '',
			Status: item !== undefined ? (item.Status == 1 ? true : false) : false,
			InterestType: item !== undefined ? (item.InterestType) : 1,
			isFirstTime: true,

			MaturityCurrencyTypeId: item !== undefined ? item.MaturityCurrencyID : 0,
		}

		this.inputs = {};
	}

	componentDidMount = async () => {
		//Add this method to change theme based on stored theme name.
		changeTheme();

		// check internet connection
		if (await isInternet()) {
			// Call Get Wallet List Api
			this.props.getWalletType()
		}
	}

	shouldComponentUpdate = (nextProps, _nextState) => {
		// stop twice api call
		return isCurrentScreen(nextProps);
	}

	//this Method is used to focus on next feild
	focusNextField(id) {
		//To handle Edit Text Focus Condition based on reference value
		if (id === 'etMinAmount') {
			if (this.state.SlabType == 2) {
				if (this.state.StakingType == 1) {
					this.inputs['etInterestAmount'].focus();
				} else {
					this.inputs[id].focus();
				}
			} else {
				if (this.state.StakingType == 1) {
					this.inputs['etInterestAmount'].focus();
				} else {
					this.inputs['etAmount'].focus();
				}
			}
		} else if (id === 'etAmount') {
			if (this.state.SlabType == 2) {
				this.inputs['etMinAmount'].focus();
			} else {
				this.inputs[id].focus();
			}
		} else if (id === 'etMakerCharges') {
			if (this.state.StakingType == 1) {
				this.inputs['etRenewUnstakingPeriod'].focus();
			} else {
				this.inputs[id].focus();
			}
		}
		else {
			this.inputs[id].focus();
		}
	}

	// Call api after check all validation
	onSubmitPress = async () => {
		if (isEmpty(this.state.selectedCurrency)) {
			this.toast.Show(R.strings.selectCurrency);
			return;
		}
		if (isEmpty(this.state.Months)) {
			this.toast.Show(R.strings.Month_Validation);
			return;
		}
		if (isEmpty(this.state.Weeks)) {
			this.toast.Show(R.strings.Week_Validation);
			return;
		}
		if (this.state.SlabType == 2) {
			if (this.state.StakingType == 1) {
				if (isEmpty(this.state.InterestAmount)) {
					this.toast.Show(R.strings.Interest_Amount_Validation);
					return;
				}
			}
			if (isEmpty(this.state.MinAmount)) {
				this.toast.Show(R.strings.MinAmount_Validation);
				return;
			}
			if (isEmpty(this.state.MaxAmount)) {
				this.toast.Show(R.strings.MaxAmount_Validation);
				return;
			}
		}
		if (this.state.StakingType == 1) {
			if (isEmpty(this.state.InterestAmount)) {
				this.toast.Show(R.strings.Interest_Amount_Validation);
				return;
			}
		}
		if (this.state.SlabType == 1) {
			if (isEmpty(this.state.Amount)) {
				this.toast.Show(R.strings.Enter_Amount);
				return;
			}
		}
		if (this.state.StakingType == 2) {
			if (isEmpty(this.state.MakerCharges)) {
				this.toast.Show(R.strings.MakerCharge_Validation);
				return;
			}
			if (isEmpty(this.state.TakerCharges)) {
				this.toast.Show(R.strings.TakerCharge_Validation);
				return;
			}
		}
		if (this.state.StakingType == 1) {
			if (isEmpty(this.state.RenewUnstakingPeriod)) {
				this.toast.Show(R.strings.Renew_Unstacking_Period_Validation);
				return;
			}
			if (isEmpty(this.state.selectedMaturityCurrency)) {
				this.toast.Show(R.strings.Select_Maturity_Currency);
				return;
			}
			if (isEmpty(this.state.StakingBeforeMaturity)) {
				this.toast.Show(R.strings.Staking_Before_Maturity_Charge_Validation);
				return;
			}
		}
		let Amount = 0;
		let MaxAmount = 0;
		let MinAmount = 0;
		//For Min. Amount is Not Greater then Max. Amount Validation
		if (this.state.SlabType == 2) {
			MaxAmount = this.state.MaxAmount;
			MinAmount = this.state.MinAmount;
			if (parseFloatVal(this.state.MinAmount) > parseFloatVal(this.state.MaxAmount)) {
				this.toast.Show(R.strings.MinMaxAmount_Validation);
				return;
			}
		} else {
			Amount = this.state.Amount;
		}

		let InterestType = '';
		let EnableStakingBeforeMaturityCharge = '';
		let RenewUnstakingPeriod = '';
		let InterestAmount = '';
		let MaturityCurrencyTypeID = '';
		let isRenewUnstaking = '';
		let isStakingBeforeMaturity = '';
		if (this.state.StakingType == 1) {
			InterestType = this.state.InterestType;
			EnableStakingBeforeMaturityCharge = this.state.StakingBeforeMaturity;
			InterestAmount = this.state.InterestAmount;
			RenewUnstakingPeriod = this.state.RenewUnstakingPeriod;
			MaturityCurrencyTypeID = this.state.MaturityCurrencyTypeId;
			isRenewUnstaking = this.state.isRenewUnstaking ? 1 : 0;
			isStakingBeforeMaturity = this.state.isStakingBeforeMaturity ? 1 : 0;
		}

		let MakerCharges = '';
		let TakerCharges = '';
		if (this.state.StakingType == 2) {
			MakerCharges = this.state.MakerCharges;
			TakerCharges = this.state.TakerCharges;
		}

		// check internet connection
		if (await isInternet()) {
			// To bind add staking policy request
			let request = {
				PolicyDetailId: this.state.PolicyDetailId,
				StakingPolicyID: this.state.MasterId,
				DurationWeek: this.state.Weeks,
				DurationMonth: this.state.Months,
				AutoUnstakingEnable: this.state.isAutoUnstaking ? 1 : 0,
				InterestType: InterestType,
				InterestValue: InterestAmount,
				Amount: Amount,
				MinAmount: MinAmount,
				MaxAmount: MaxAmount,
				RenewUnstakingEnable: isRenewUnstaking,
				RenewUnstakingPeriod: RenewUnstakingPeriod,
				EnableStakingBeforeMaturity: isStakingBeforeMaturity,
				EnableStakingBeforeMaturityCharge: EnableStakingBeforeMaturityCharge,
				MaturityCurrency: MaturityCurrencyTypeID,
				MakerCharges: MakerCharges,
				TakerCharges: TakerCharges,
				Status: this.state.Status == true ? 1 : 0,
			}
			//call Add Payment Method API
			this.props.addStakingPolicy(request);
		}
	}

	static oldProps = {};

	static getDerivedStateFromProps(props, state) {

		//To Skip Render First Time for available reducer data if exists
		if (state.isFirstTime) {
			return { ...state, isFirstTime: false, };
		}

		// To Skip Render if old and new props are equal
		if (AddEditStakingPolicyScreen.oldProps !== props) {
			AddEditStakingPolicyScreen.oldProps = props;
		} else {
			return null;
		}

		if (isCurrentScreen(props)) {
			//Get All Updated Feild of Particular actions
			const { walletData, } = props.StakingPolicyResult;

			if (walletData) {
				try {
					//if local walletData state is null or its not null and also different then new response then and only then validate response.
					if (state.walletData == null || (state.walletData != null && walletData !== state.walletData)) {

						//if  response is success then store array list else store empty list
						if (validateResponseNew({ response: walletData, isList: true })) {
							let res = parseArray(walletData.Types);

							for (var dataItem in res) {
								let item = res[dataItem]
								item.value = item.TypeName
							}

							let currency = [
								{ value: R.strings.selectCurrency },
								...res
							];

							return { ...state, walletData, MaturityCurrency: currency };
						} else {
							return { ...state, walletData, MaturityCurrency: [{ value: R.strings.selectCurrency }] };
						}
					}
				} catch (e) {
					return { ...state, MaturityCurrency: [{ value: R.strings.selectCurrency }] };
				}
			}
		}
		return null
	}

	componentDidUpdate(prevProps, _prevState) {

		//Get All Updated field of Particular actions
		const { addStakingPolicyData, } = this.props.StakingPolicyResult

		if (addStakingPolicyData !== prevProps.StakingPolicyResult.addStakingPolicyData) {
			// addStakingPolicyData is not null
			if (addStakingPolicyData) {
				try {
					if (this.state.addStakingPolicyData == null || (this.state.addStakingPolicyData != null && addStakingPolicyData !== this.state.addStakingPolicyData)) {

						// Handle Response
						if (validateResponseNew({ response: addStakingPolicyData, })) {
							showAlert(R.strings.status, addStakingPolicyData.ReturnMsg, 0, () => {
								this.props.clearStakingConfig()
								this.props.navigation.state.params.onRefresh(true)
								this.props.navigation.goBack()
							})
							this.setState({ addStakingPolicyData })
						} else {
							this.props.clearStakingConfig()
							this.setState({ addStakingPolicyData: null })
						}
					}
				} catch (error) {
					this.props.clearStakingConfig()
					this.setState({ addStakingPolicyData: null })
				}
			}
		}
	}

	render() {

		let { isEdit } = this.state
		// Loading status for Progress bar which is fetching from reducer
		const { addStakingPolicyLoading, } = this.props.StakingPolicyResult;

		return (
			<SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
				{/* To set status bar as per our theme */}
				<CommonStatusBar />

				{/* To set toolbar as per our theme */}
				<CustomToolbar
					title={isEdit ? R.strings.updateStakingPlan : R.strings.addStakingPlan}
					isBack={true}
					onBackPress={this.onBackPress}
					nav={this.props.navigation}
				/>

				{/* Progressbar */}
				<ProgressDialog isShow={addStakingPolicyLoading} />

				{/* For Toast */}
				<CommonToast ref={component => this.toast = component} />

				{/* Toggle Button For Status Enable/Disable Functionality */}
				<FeatureSwitch
					isGradient={true}
					title={this.state.Status ? R.strings.Enable : R.strings.Disable}
					isToggle={this.state.Status}
					onValueChange={() => this.setState({ Status: !this.state.Status })}
				/>

				<View style={{ flex: 1, justifyContent: 'space-between' }}>
					<ScrollView showsVerticalScrollIndicator={false}>

						<View style={this.styles().mainView}>

							{/* Text for Currency */}
							<TextCard title={R.strings.Currency} value={this.state.selectedCurrency} />

							{/* To Set Staking Type */}
							<TextViewMR style={{ marginLeft: R.dimens.LineHeight, fontSize: R.dimens.smallText, marginTop: R.dimens.widget_top_bottom_margin, color: R.colors.textPrimary }}>{R.strings.Staking_Type}</TextViewMR>
							<View style={{ marginLeft: R.dimens.LineHeight, flexDirection: 'row', marginTop: R.dimens.widgetMargin }}>

								<RadioButton
									item={{ title: R.strings.Charge, selected: this.state.StakingType == 2 }}
									onPress={() => { }}
								/>

								<RadioButton
									item={{ title: R.strings.Fixed_Deposit, selected: this.state.StakingType == 1 }}
									onPress={() => { }}
								/>

							</View>

							{/* To Set Slab Type */}
							<TextViewMR style={{ marginLeft: R.dimens.LineHeight, fontSize: R.dimens.smallText, marginTop: R.dimens.widget_top_bottom_margin, color: R.colors.textPrimary }}>{R.strings.Slab_Type}</TextViewMR>
							<View style={{ marginLeft: R.dimens.LineHeight, flexDirection: 'row', marginTop: R.dimens.widgetMargin }}>

								<RadioButton
									item={{ title: R.strings.Range, selected: this.state.SlabType == 2 }}
									onPress={() => { }}
								/>
								<RadioButton
									item={{ title: R.strings.Fixed, selected: this.state.SlabType == 1 }}
									onPress={() => { }}
								/>

							</View>

							{/* For Duration */}
							<TextViewMR style={{ marginLeft: R.dimens.LineHeight, fontSize: R.dimens.smallText, marginTop: R.dimens.widget_top_bottom_margin, color: R.colors.textPrimary }}>{R.strings.duration}</TextViewMR>
							<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
								{/* To Set Months in EditText */}
								<EditText
									style={{ flex: 1, marginTop: 0, marginRight: R.dimens.widgetMargin, }}
									reference={input => { this.inputs['etMonths'] = input; }}
									placeholder={R.strings.month}
									multiline={false}
									keyboardType='numeric'
									returnKeyType={"next"}
									blurOnSubmit={false}
									onSubmitEditing={() => { this.focusNextField('etWeeks') }}
									onChangeText={(Months) => this.setState({ Months })}
									value={this.state.Months}
									validate={true}
									onlyDigit={true}
								/>

								{/* To Set Weeks in EditText */}
								<EditText
									style={{ flex: 1, marginTop: 0, marginLeft: R.dimens.widgetMargin, }}
									reference={input => { this.inputs['etWeeks'] = input; }}
									placeholder={R.strings.week0To4}
									multiline={false}
									keyboardType='numeric'
									returnKeyType={"next"}
									blurOnSubmit={false}
									maxLength={1}
									onSubmitEditing={() => { this.focusNextField('etMinAmount') }}
									onChangeText={(Weeks) => this.setState({ Weeks })}
									value={this.state.Weeks}
									validate={true}
									validWeek={true}
								/>
							</View>

							{this.state.StakingType == 1 &&
								<View>
									{/* To Set Interest Type */}
									<TextViewMR style={{ marginLeft: R.dimens.LineHeight, fontSize: R.dimens.smallText, marginTop: R.dimens.widget_top_bottom_margin, color: R.colors.textPrimary }}>{R.strings.Interest_Type}</TextViewMR>
									<View style={{ marginLeft: R.dimens.LineHeight, flexDirection: 'row', marginTop: R.dimens.widgetMargin }}>

										<RadioButton
											item={{ title: R.strings.Percentage, selected: this.state.InterestType == 2 }}
											onPress={() => this.setState({ InterestType: 2 })}
										/>
										<RadioButton
											item={{ title: R.strings.Fixed, selected: this.state.InterestType == 1 }}
											onPress={() => this.setState({ InterestType: 1 })}
										/>

									</View>

									{/* To Set Interest Amount in EditText */}
									<EditText
										reference={input => { this.inputs['etInterestAmount'] = input; }}
										header={R.strings.Interest_Amount}
										placeholder={R.strings.Interest_Amount}
										multiline={false}
										keyboardType='numeric'
										returnKeyType={"next"}
										onChangeText={(InterestAmount) => this.setState({ InterestAmount })}
										onSubmitEditing={() => { this.focusNextField('etAmount') }}
										blurOnSubmit={false}
										value={this.state.InterestAmount}
										validate={true}
										validPercentage={this.state.InterestType == 2 ? true : false}
									/>
								</View>
							}

							{this.state.SlabType == 2 ?
								<View>
									{/* For Amount Range */}
									<TextViewMR style={{ marginLeft: R.dimens.LineHeight, fontSize: R.dimens.smallText, marginTop: R.dimens.widget_top_bottom_margin, color: R.colors.textPrimary }}>{R.strings.Amount}</TextViewMR>
									<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
										{/* To Set Min. Amount in EditText */}
										<EditText
											style={{ flex: 1, marginTop: 0, marginRight: R.dimens.widgetMargin, }}
											reference={input => { this.inputs['etMinAmount'] = input; }}
											placeholder={R.strings.minAmount}
											multiline={false}
											keyboardType='numeric'
											returnKeyType={"next"}
											blurOnSubmit={false}
											onSubmitEditing={() => { this.focusNextField('etMaxAmount') }}
											onChangeText={(MinAmount) => this.setState({ MinAmount })}
											value={this.state.MinAmount}
											validate={true}
										/>

										{/* To Set Max. Amount in EditText */}
										<EditText
											style={{ flex: 1, marginTop: 0, marginLeft: R.dimens.widgetMargin, }}
											reference={input => { this.inputs['etMaxAmount'] = input; }}
											placeholder={R.strings.maxAmount}
											multiline={false}
											keyboardType='numeric'
											returnKeyType={"next"}
											blurOnSubmit={false}
											onSubmitEditing={() => { this.focusNextField('etMakerCharges') }}
											onChangeText={(MaxAmount) => this.setState({ MaxAmount })}
											value={this.state.MaxAmount}
											validate={true}
										/>
									</View>
								</View>
								:
								<View>
									{/* To Set Amount in EditText */}
									<EditText
										header={R.strings.Amount}
										reference={input => { this.inputs['etAmount'] = input; }}
										placeholder={R.strings.Amount}
										returnKeyType={"next"}
										keyboardType='numeric'
										multiline={false}
										blurOnSubmit={false}
										onChangeText={(Amount) => this.setState({ Amount })}
										onSubmitEditing={() => { this.focusNextField('etMakerCharges') }}
										value={this.state.Amount}
										validate={true}
									/>
								</View>
							}

							<View style={{ marginLeft: R.dimens.LineHeight, flex: 1, justifyContent: 'center', marginTop: R.dimens.widget_top_bottom_margin }}>
								<FeatureSwitch
									style={{
										paddingLeft: 0,
										paddingRight: R.dimens.widgetMargin,
										paddingBottom: 0,
										paddingTop: 0,
										justifyContent: 'center',
										alignItems: 'center',
										backgroundColor: R.colors.background,
									}}
									title={this.state.isAutoUnstaking ? R.strings.autoUnstakingEnable : R.strings.autoUnstakingDisable}
									isToggle={this.state.isAutoUnstaking}
									onValueChange={() => this.setState({ isAutoUnstaking: !this.state.isAutoUnstaking })}
									textStyle={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText }}
								/>
							</View>

							{this.state.StakingType == 1 ?
								<View>
									<View style={{ marginLeft: R.dimens.LineHeight, flex: 1, justifyContent: 'center', marginTop: R.dimens.widget_top_bottom_margin }}>
										<FeatureSwitch
											style={{
												paddingLeft: 0,
												paddingRight: R.dimens.widgetMargin,
												paddingBottom: 0,
												paddingTop: 0,
												justifyContent: 'center',
												alignItems: 'center',
												backgroundColor: R.colors.background,
											}}
											title={this.state.isRenewUnstaking ? R.strings.renewUnstakingEnable : R.strings.renewUnstakingDisable}
											isToggle={this.state.isRenewUnstaking}
											onValueChange={() => this.setState({ isRenewUnstaking: !this.state.isRenewUnstaking })}
											textStyle={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText }}
										/>
									</View>
									{/* To Set Interest Amount in EditText */}
									<EditText
										reference={input => { this.inputs['etRenewUnstakingPeriod'] = input; }}
										header={R.strings.Renew_Unstaking_Period}
										placeholder={R.strings.week0To4}
										maxLength={1}
										multiline={false}
										blurOnSubmit={false}
										keyboardType='numeric'
										returnKeyType={"next"}
										onChangeText={(RenewUnstakingPeriod) => this.setState({ RenewUnstakingPeriod })}
										onSubmitEditing={() => { this.focusNextField('etStakingBeforeMaturity') }}
										value={this.state.RenewUnstakingPeriod}
										validate={true}
										validWeek={true}
									/>

									{/* To Set Maturity Currency List in Dropdown */}
									<TitlePicker
										style={{ marginTop: R.dimens.margin }}
										title={R.strings.Maturity_Currency}
										array={this.state.MaturityCurrency}
										selectedValue={this.state.selectedMaturityCurrency}
										onPickerSelect={(item, object) => this.setState({ selectedMaturityCurrency: item, MaturityCurrencyTypeId: object.ID })} />

									<View style={{ marginLeft: R.dimens.LineHeight, flex: 1, justifyContent: 'center', marginTop: R.dimens.widget_top_bottom_margin }}>
										<FeatureSwitch
											style={{
												paddingLeft: 0,
												paddingRight: R.dimens.widgetMargin,
												paddingBottom: 0,
												paddingTop: 0,
												justifyContent: 'center',
												alignItems: 'center',
												backgroundColor: R.colors.background,
											}}
											title={this.state.isStakingBeforeMaturity ? R.strings.enableStakingBeforeMaturiry : R.strings.disableStakingBeforeMaturiry}
											isToggle={this.state.isStakingBeforeMaturity}
											onValueChange={() => this.setState({ isStakingBeforeMaturity: !this.state.isStakingBeforeMaturity })}
											textStyle={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText }}
										/>
									</View>

									{/* To Set Staking Before Maturity Charge in EditText */}
									<EditText
										header={R.strings.Staking_Before_Maturity_Charge}
										reference={input => { this.inputs['etStakingBeforeMaturity'] = input; }}
										placeholder={R.strings.Charge}
										multiline={false}
										keyboardType='numeric'
										returnKeyType={"done"}
										onChangeText={(StakingBeforeMaturity) => this.setState({ StakingBeforeMaturity })}
										value={this.state.StakingBeforeMaturity}
										validate={true}
										onlyDigit={true}
									/>
								</View>
								:
								<View>
									<TextViewMR style={{ marginLeft: R.dimens.LineHeight, fontSize: R.dimens.smallText, marginTop: R.dimens.widget_top_bottom_margin, color: R.colors.textPrimary }}>{R.strings.Charges}</TextViewMR>
									<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
										{/* To Set Maker Charges in EditText */}
										<EditText
											style={{ flex: 1, marginTop: 0, marginRight: R.dimens.widgetMargin, }}
											reference={input => { this.inputs['etMakerCharges'] = input; }}
											placeholder={R.strings.MakerCharge}
											multiline={false}
											keyboardType='numeric'
											returnKeyType={"next"}
											blurOnSubmit={false}
											onSubmitEditing={() => { this.focusNextField('etTakerCharges') }}
											onChangeText={(MakerCharges) => this.setState({ MakerCharges })}
											value={this.state.MakerCharges}
											validate={true}
											onlyDigit={true}
										/>

										{/* To Set Tacker Charges in EditText */}
										<EditText
											style={{ flex: 1, marginTop: 0, marginLeft: R.dimens.widgetMargin, }}
											reference={input => { this.inputs['etTakerCharges'] = input; }}
											placeholder={R.strings.TakerCharge}
											multiline={false}
											keyboardType='numeric'
											returnKeyType={"done"}
											onChangeText={(TakerCharges) => this.setState({ TakerCharges })}
											value={this.state.TakerCharges}
											validate={true}
											onlyDigit={true}
										/>
									</View>
								</View>
							}
						</View>
					</ScrollView>

					<View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
						{/* To Set Submit Button */}
						<Button title={isEdit ? R.strings.update : R.strings.add} onPress={this.onSubmitPress}></Button>
					</View>
				</View>
			</SafeView>
		)
	}

	styles = () => {
		return {
			mainView: {
				paddingLeft: R.dimens.activity_margin,
				paddingRight: R.dimens.activity_margin,
				paddingTop: R.dimens.padding_top_bottom_margin,
				paddingBottom: R.dimens.padding_top_bottom_margin,
			}
		}
	}
}

const mapStateToProps = (state) => {
	return {
		// get position report data from reducer
		StakingPolicyResult: state.StakingConfigurationReducer,
	}
};

const mapDispatchToProps = (dispatch) => ({
	// To Perform Staking Policy List Action
	addStakingPolicy: (payload) => dispatch(addStakingPolicy(payload)),
	// To Perform Wallet Data Action
	getWalletType: () => dispatch(getWalletType()),
	// To clear Staking
	clearStakingConfig: () => dispatch(clearStakingConfig()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddEditStakingPolicyScreen);