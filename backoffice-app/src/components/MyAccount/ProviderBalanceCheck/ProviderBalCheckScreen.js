import React, { Component } from 'react'
import { Text, View, ScrollView } from 'react-native'
import SafeView from '../../../native_theme/components/SafeView';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import CommonToast from '../../../native_theme/components/CommonToast';
import { TitlePicker } from '../../widget/ComboPickerWidget';
import { isCurrentScreen } from '../../Navigation';
import { changeTheme, parseArray } from '../../../controllers/CommonUtils';
import { connect } from 'react-redux';
import { getProviderList, getWalletType } from '../../../actions/PairListAction';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import R from '../../../native_theme/R';
import { isInternet, validateResponseNew } from '../../../validations/CommonValidation';
import Button from '../../../native_theme/components/Button';
import { getProviderBalList, clearProviderBalData } from '../../../actions/account/ProviderBalCheckAction';
import { FeatureSwitch } from '../../../native_theme/components/FeatureSwitch';

export class ProviderBalCheckScreen extends Component {
	constructor(props) {
		super(props)

		// Define all state initial state
		this.state = {
			Currency: [],
			selectedCurrency: R.strings.selectCurrency,

			ServiceProvider: [],
			selectedServiceProvider: R.strings.select_serivce_provider,
			ServiceProviderId: '',

			isFirstTime: true,

			// For genrate mismatch functionality
			resolveBalanceMismatchStatus: false,
		}

		// Create reference
		this.toast = React.createRef();
	}

	shouldComponentUpdate = (nextProps, _nextState) => {

		//stop twice api call
		return isCurrentScreen(nextProps);
	}

	componentDidMount = async () => {
		//Add this method to change theme based on stored theme name.
		changeTheme();

		// check internet connection
		if (await isInternet()) {
			// Call Service Provider List Api 
			this.props.getProviderList()
			// Call Wallet Type Api
			this.props.getWalletType()
		}
	}

	// After check all validation, call service provider balance api
	onSubmitPress = async () => {
		// display toast
		if (this.state.selectedCurrency === R.strings.selectCurrency) {
			this.toast.Show(R.strings.selectCurrency)
			return
		}

		// check internet connection
		if (await isInternet()) {
			let req = {
				SMSCode: this.state.selectedCurrency,
				ServiceProviderId: this.state.selectedServiceProvider !== R.strings.select_service_provider ? this.state.ServiceProviderId : '',
				GenerateMismatch: (this.state.resolveBalanceMismatchStatus == true &&
					(this.state.selectedCurrency != R.strings.selectCurrency && this.state.selectedServiceProvider != R.strings.select_serivce_provider)) ? 1 : '', // For genrate mismatch functionality
			}

			// Call Provider Balance Check List Api
			this.props.getProviderBalList(req)
		}
	}

	componentWillUnmount() {
		// clear reducer data
		this.props.clearProviderBalData()
	}

	static oldProps = {};

	static getDerivedStateFromProps(props, state) {

		//To Skip Render First Time for available reducer data if exists
		if (state.isFirstTime) {
			return { ...state, isFirstTime: false, }
		}

		// To Skip Render if old and new props are equal
		if (ProviderBalCheckScreen.oldProps !== props) {
			ProviderBalCheckScreen.oldProps = props;
		} else {
			return null;
		}

		if (isCurrentScreen(props)) {

			//Get All Updated Feild of Particular actions
			const { SerProvList, WalletDataList } = props.ProviderBalCheckResult;

			// SerProvList is not null
			if (SerProvList) {
				try {
					//if local SerProvList state is null or its not null and also different then new response then and only then validate response.
					if (state.SerProvList == null || (state.SerProvList != null && SerProvList !== state.SerProvList)) {

						//if  response is success then store array list else store empty list
						if (validateResponseNew({ response: SerProvList, isList: true })) {
							let res = parseArray(SerProvList.Response);

							for (var dataProviderItem in res) {
								let item = res[dataProviderItem]
								item.value = item.ProviderName
							}

							let serviceProviderName = [
								{ value: R.strings.select_serivce_provider },
								...res
							];

							return { ...state, SerProvList, ServiceProvider: serviceProviderName };
						} else {
							return { ...state, SerProvList, ServiceProvider: [{ value: R.strings.select_serivce_provider }] };
						}
					}
				} catch (e) {
					return { ...state, ServiceProvider: [{ value: R.strings.select_serivce_provider }] };
				}
			}

			// WalletDataList is not null
			if (WalletDataList) {
				try {
					//if local WalletDataList state is null or its not null and also different then new response then and only then validate response.
					if (state.WalletDataList == null || (state.WalletDataList != null && WalletDataList !== state.WalletDataList)) {

						//if  response is success then store array list else store empty list
						if (validateResponseNew({ response: WalletDataList, isList: true })) {
							let res = parseArray(WalletDataList.Types);

							for (var walletBalKey in res) {
								let item = res[walletBalKey]
								item.value = item.TypeName
							}

							let walletName = [
								{ value: R.strings.selectCurrency },
								...res
							];

							return { ...state, WalletDataList, Currency: walletName };
						} else {
							return { ...state, WalletDataList, Currency: [{ value: R.strings.selectCurrency }] };
						}
					}
				} catch (e) {
					return { ...state, Currency: [{ value: R.strings.selectCurrency }] };
				}
			}
		}
		return null
	}

	componentDidUpdate(prevProps, prevState) {
		const { ProviderBalCheckList, } = this.props.ProviderBalCheckResult;

		// compare response with previous response
		if (ProviderBalCheckList !== prevProps.ProviderBalCheckResult.ProviderBalCheckList) {

			// ProviderBalCheckList is not null
			if (ProviderBalCheckList) {
				try {
					// if local ProviderBalCheckList state is null or its not null and also different then new response then and only then validate response.
					if (this.state.ProviderBalCheckList == null || (this.state.ProviderBalCheckList != null && ProviderBalCheckList !== this.state.ProviderBalCheckList)) {
						//handle response of API
						if (validateResponseNew({ response: ProviderBalCheckList })) {
							let res = parseArray(ProviderBalCheckList.Data)
							// navigate Provider Balance Check List Screen
							this.props.navigation.navigate('ProviderBalCheckListScreen', {
								item: res,
								Currency: this.state.Currency,
								currencyName: this.state.selectedCurrency,

								ServiceProvider: this.state.ServiceProvider,
								selectedServiceProvider: this.state.selectedServiceProvider,
								ServiceProviderId: this.state.selectedServiceProvider == R.strings.select_serivce_provider ? '' : this.state.ServiceProviderId,

								GenerateMismatch: this.state.resolveBalanceMismatchStatus // For genrate mismatch functionality
							})
						}
					}
				} catch (error) {
					this.setState({ ProviderBalCheckList: null })
				}
			}
		}
	}

	render() {
		// Loading status for Progress bar which is fetching from reducer
		let { ProviderBalCheckLoading, WalletDataLaoding, SerProvLoading } = this.props.ProviderBalCheckResult

		return (
			<SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
				{/* To set status bar as per our theme */}
				<CommonStatusBar />

				{/* To set toolbar as per our theme */}
				<CustomToolbar
					title={R.strings.providerBalanceCheck}
					isBack={true}
					nav={this.props.navigation} />

				{/* Common Toast */}
				<CommonToast ref={cmp => this.toast = cmp} />

				{/* Progress bar */}
				<ProgressDialog isShow={ProviderBalCheckLoading || SerProvLoading || WalletDataLaoding} />

				<View style={{ flex: 1, justifyContent: 'space-between' }}>
					<ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='always'>
						<View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>

							{/* To Set Service Provider List in Dropdown */}
							<TitlePicker
								style={{ marginTop: R.dimens.margin }}
								title={R.strings.ServiceProvider}
								array={this.state.ServiceProvider}
								selectedValue={this.state.selectedServiceProvider}
								onPickerSelect={(item, object) => this.setState({ selectedServiceProvider: item, ServiceProviderId: object.Id })} />

							{/* To Set Currency List in Dropdown */}
							<TitlePicker
								isRequired={true}
								style={{ marginTop: R.dimens.margin }}
								title={R.strings.Currency}
								array={this.state.Currency}
								selectedValue={this.state.selectedCurrency}
								onPickerSelect={(item) => this.setState({ selectedCurrency: item })} />

							{
								(this.state.selectedCurrency != R.strings.selectCurrency && this.state.selectedServiceProvider != R.strings.select_serivce_provider) &&
								<FeatureSwitch
									backgroundColor={'transparent'}
									title={R.strings.resolveBalanceMismatch}
									style={{ paddingLeft: R.dimens.LineHeight, paddingRight: R.dimens.widgetMargin }}
									isToggle={this.state.resolveBalanceMismatchStatus}
									textStyle={{ color: R.colors.textPrimary }}
									onValueChange={() => {
										this.setState({ resolveBalanceMismatchStatus: !this.state.resolveBalanceMismatchStatus })
									}}
								/>}
						</View>
					</ScrollView>

					{/* To Set Submit Button */}
					<View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
						<Button title={R.strings.submit} onPress={this.onSubmitPress}></Button>
					</View>
				</View>
			</SafeView>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		// get provider balance check data from reducer
		ProviderBalCheckResult: state.ProviderBalCheckReducer,
	}
};

const mapDispatchToProps = (dispatch) => ({
	// To Perform Get Provider List Action
	getProviderList: () => dispatch(getProviderList()),
	// To Get Currency List Action
	getWalletType: (payload) => dispatch(getWalletType(payload)),
	// Perform Provider Balance Check Action
	getProviderBalList: (payload) => dispatch(getProviderBalList(payload)),
	// Clear Provider Balance Check Action
	clearProviderBalData: () => dispatch(clearProviderBalData()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProviderBalCheckScreen)