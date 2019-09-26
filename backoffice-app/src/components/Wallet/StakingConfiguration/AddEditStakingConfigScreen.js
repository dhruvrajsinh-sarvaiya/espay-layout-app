import React, { Component } from 'react'
import { View, ScrollView } from 'react-native'
import { changeTheme, parseArray, showAlert, } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../Navigation';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import R from '../../../native_theme/R';
import CommonToast from '../../../native_theme/components/CommonToast';
import { TitlePicker } from '../../widget/ComboPickerWidget';
import { clearStakingConfig, addMasterStaking, } from '../../../actions/Wallet/StakingConfigurationAction';
import { getWalletType } from '../../../actions/PairListAction';
import { connect } from 'react-redux';
import { validateResponseNew, isInternet } from '../../../validations/CommonValidation';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import { FeatureSwitch } from '../../../native_theme/components/FeatureSwitch';
import Button from '../../../native_theme/components/Button';
import SafeView from '../../../native_theme/components/SafeView';
import TextCard from '../../../native_theme/components/TextCard';
import RadioButton from '../../../native_theme/components/RadioButton';

export class AddEditStakingConfigScreen extends Component {
	constructor(props) {
		super(props)
		let { item } = this.props.navigation.state.params

		// Define all initial state
		this.state = {
			Currency: [],
			isEdit: item !== undefined ? true : false,
			selectedCurrency: item !== undefined ? item.WalletTypeName : R.strings.selectCurrency,
			WalletTypeId: item !== undefined ? item.WalletTypeId : '',
			StakingType: item !== undefined ? item.StakingType : 1,
			SlabType: item !== undefined ? item.SlabType : 1,
			Status: item !== undefined ? (item.Status == 1 ? true : false) : false,
			Id: item !== undefined ? item.Id : 0,
			isFirstTime: true,
		}

		// create reference
		this.toast = React.createRef();
	}

	componentDidMount = async () => {
		//Add this method to change theme based on stored theme name.
		changeTheme();

		if (!this.state.isEdit) {
			// check internet connection
			if (await isInternet()) {
				// Call Wallet Type Api
				this.props.getWalletType()
			}
		}
	}

	shouldComponentUpdate = (nextProps, _nextState) => {
		// stop twice api call
		return isCurrentScreen(nextProps);
	};

	onSubmitPress = async () => {
		// check validation
		if (this.state.selectedCurrency === R.strings.selectCurrency)
			this.toast.Show(R.strings.selectCurrency)
		else {
			// check internet connection
			if (await isInternet()) {
				let req = {
					Id: this.state.Id,
					WalletTypeID: this.state.WalletTypeId,
					SlabType: this.state.SlabType,
					StakingType: this.state.StakingType,
					Status: this.state.Status ? 1 : 0
				}

				// Add Master Staking Api Call
				this.props.addMasterStaking(req)
			}
		}
	}

	componentDidUpdate(prevProps, _prevState) {

		//Get All Updated field of Particular actions
		const { addMasterStakingData, } = this.props.StakingConfigResult

		if (addMasterStakingData !== prevProps.StakingConfigResult.addMasterStakingData) {
			// addMasterStakingData is not null
			if (addMasterStakingData) {
				try {
					if (this.state.addMasterStakingData == null || (this.state.addMasterStakingData != null && addMasterStakingData !== this.state.addMasterStakingData)) {

						// Handle Response
						if (validateResponseNew({ response: addMasterStakingData })) {
							showAlert(R.strings.status, addMasterStakingData.ReturnMsg, 0, () => {
								this.props.clearStakingConfig()
								this.props.navigation.state.params.onRefresh(true)
								this.props.navigation.goBack()
							})
							this.setState({ addMasterStakingData })
						} else {
							this.props.clearStakingConfig()
							this.setState({ addMasterStakingData: null })
						}
					}
				} catch (error) {
					this.props.clearStakingConfig()
					this.setState({ addMasterStakingData: null })
				}
			}
		}

	}

	static oldProps = {};

	static getDerivedStateFromProps(props, state) {

		//To Skip Render First Time for available reducer data if exists
		if (state.isFirstTime) {
			return { ...state, isFirstTime: false, };
		}

		// To Skip Render if old and new props are equal
		if (AddEditStakingConfigScreen.oldProps !== props) {
			AddEditStakingConfigScreen.oldProps = props;
		} else {
			return null;
		}

		if (isCurrentScreen(props)) {
			//Get All Updated Feild of Particular actions
			const { walletData, } = props.StakingConfigResult;

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

							return { ...state, walletData, Currency: currency };
						} else {
							return { ...state, walletData, Currency: [{ value: R.strings.selectCurrency }] };
						}
					}
				} catch (e) {
					return { ...state, Currency: [{ value: R.strings.selectCurrency }] };
				}
			}
		}
		return null
	}

	render() {
		let { isEdit } = this.state
		// Loading status for Progress bar which is fetching from reducer
		let { walletDataFetching, addMasterStakingLoading, } = this.props.StakingConfigResult

		return (
			<SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

				{/* To set status bar as per our theme */}
				<CommonStatusBar />

				{/* To set toolbar as per our theme */}
				<CustomToolbar
					isBack={true}
					nav={this.props.navigation}
					title={this.state.isEdit ? R.strings.updateStakingPlan : R.strings.addStakingPlan}
				/>

				{/* For Toast */}
				<CommonToast ref={component => this.toast = component} />

				{/* Progress bar */}
				<ProgressDialog isShow={walletDataFetching || addMasterStakingLoading} />

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

							{/* Picker for Sub Module */}
							{
								!isEdit ?
									<TitlePicker
										title={R.strings.Currency}
										array={this.state.Currency}
										selectedValue={this.state.selectedCurrency}
										onPickerSelect={(item, object) => this.setState({ selectedCurrency: item, WalletTypeId: object.ID })} />
									:
									<TextCard title={R.strings.Currency} value={this.state.selectedCurrency} />
							}

							{/* To Set Staking Type */}
							<TextViewMR style={{ marginLeft: R.dimens.LineHeight, fontSize: R.dimens.smallText, marginTop: R.dimens.widget_top_bottom_margin, color: R.colors.textPrimary }}>{R.strings.Staking_Type}</TextViewMR>
							<View style={{ marginLeft: R.dimens.LineHeight, flexDirection: 'row', marginTop: R.dimens.widgetMargin }}>

								<RadioButton
									item={{ title: R.strings.Charge, selected: this.state.StakingType == 2 }}
									onPress={() => {
										if (!this.state.isEdit)
											this.setState({ StakingType: 2 });
									}}
								/>

								<RadioButton
									item={{ title: R.strings.Fixed_Deposit, selected: this.state.StakingType == 1 }}
									onPress={() => {
										if (!this.state.isEdit)
											this.setState({ StakingType: 1 });
									}}
								/>

							</View>

							{/* To Set Slab Type */}
							<TextViewMR style={{ marginLeft: R.dimens.LineHeight, fontSize: R.dimens.smallText, marginTop: R.dimens.widget_top_bottom_margin, color: R.colors.textPrimary }}>{R.strings.Slab_Type}</TextViewMR>
							<View style={{ marginLeft: R.dimens.LineHeight, flexDirection: 'row', marginTop: R.dimens.widgetMargin }}>
								<RadioButton
									item={{ title: R.strings.Range, selected: this.state.SlabType == 2 }}
									onPress={() => this.setState({ SlabType: 2 })}
								/>

								<RadioButton
									item={{ title: R.strings.Fixed, selected: this.state.SlabType == 1 }}
									onPress={() => this.setState({ SlabType: 1 })}
								/>
							</View>
						</View>
					</ScrollView>

					<View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
						{/* To Set Submit Button */}
						<Button title={this.state.isEdit ? R.strings.update : R.strings.add} onPress={this.onSubmitPress}></Button>
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

function mapStatToProps(state) {
	return {
		// get updated data from reducer
		StakingConfigResult: state.StakingConfigurationReducer,
	}
}

function mapDispatchToProps(dispatch) {
	return {
		//Perform getWalletType Action 
		getWalletType: () => dispatch(getWalletType()),
		//Perform clearStakingConfig Action 
		clearStakingConfig: () => dispatch(clearStakingConfig()),
		//Perform addMasterStaking Action
		addMasterStaking: (payload) => dispatch(addMasterStaking(payload)),
	}
}

export default connect(mapStatToProps, mapDispatchToProps)(AddEditStakingConfigScreen);