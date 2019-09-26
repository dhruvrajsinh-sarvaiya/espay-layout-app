import React, { Component } from 'react'
import { View, ScrollView } from 'react-native'
import { changeTheme, getCurrentDate, parseArray } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../Navigation';
import SafeView from '../../../native_theme/components/SafeView';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import R from '../../../native_theme/R';
import DatePickerWidget from '../../widget/DatePickerWidget';
import { TitlePicker } from '../../widget/ComboPickerWidget';
import Button from '../../../native_theme/components/Button';
import CommonToast from '../../../native_theme/components/CommonToast';
import { DateValidation } from '../../../validations/DateValidation';
import { isInternet, validateResponseNew } from '../../../validations/CommonValidation';
import { getArbitrageCurrencyList, getProviderWalletList } from '../../../actions/PairListAction';
import { getProviderLedger } from '../../../actions/Arbitrage/ProviderLedgerActions';
import { AppConfig } from '../../../controllers/AppConfig';
import { connect } from 'react-redux';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';

export class ProviderLedgerScreen extends Component {
	constructor(props) {
		super(props);

		//Define all initial state
		this.state = {
			Currency: [],
			Wallet: [],

			ProviderLedgerListState: null,
			ArbitrageCurrencyListState: null,
			ProviderWalletListState: null,

			selectedCurrency: R.strings.selectCurrency,
			selectedWallet: R.strings.selectWalletType,

			CurrencyId: 0,
			WalletTypeId: 0,
			AccWalletId: '',

			FromDate: getCurrentDate(),
			ToDate: getCurrentDate(),
		}
	}

	async componentDidMount() {
		//Add this method to change theme based on stored theme name.
		changeTheme()

		// check internet connection
		if (await isInternet()) {
			// Call Arbitrage Currency List Api
			this.props.getArbitrageCurrencyList()
		}
	}

	shouldComponentUpdate(nextProps, _nextState) {
		//stop twice api call
		return isCurrentScreen(nextProps)
	}

	// After check all validation, call arbitrage exchange balance api
	onSubmitPress = async () => {
		// Check validation
		if (DateValidation(this.state.FromDate, this.state.ToDate, true))
			this.toast.Show(DateValidation(this.state.FromDate, this.state.ToDate, true))
		else if (this.state.selectedCurrency === R.strings.selectCurrency)
			this.toast.Show(R.strings.selectCurrency)
		else if (this.state.selectedWallet === R.strings.selectWalletType)
			this.toast.Show(R.strings.selectWalletType)
		else {
			// check internet connection
			if (await isInternet()) {
				// create request
				let req = {
					Page: 0,
					PageSize: AppConfig.pageSize,
					FromDate: this.state.FromDate,
					ToDate: this.state.ToDate,
					AccWalletId: this.state.AccWalletId,
				}

				// Call Provider Ledger 
				this.props.getProviderLedger(req)
			}
		}
	}

	// Called when user change currency from Currency Dropdown
	onCurrencyChange = async (item, object) => {
		try {
			// To Check Currencyname is Selected or Not
			if (item !== R.strings.selectCurrency) {

				if (item !== this.state.selectedCurrency) {

					this.setState({ selectedCurrency: item, CurrencyId: object.Id, selectedWallet: R.strings.selectWalletType, WalletTypeId: 0, })
					// Check internet connection
					if (await isInternet()) {
						// Call Provider Ledger List Api
						this.props.getProviderWalletList({ SMSCode: item })
					}
				}

			} else {
				this.setState({
					selectedCurrency: R.strings.selectCurrency, selectedWallet: R.strings.selectWalletType,
					CurrencyId: 0, WalletTypeId: 0, Wallet: []
				})
			}
		} catch (error) {
			this.setState({
				selectedCurrency: R.strings.selectCurrency, selectedWallet: R.strings.selectWalletType,
				CurrencyId: 0, WalletTypeId: 0,
			})
		}
	}

	static oldProps = {};

	static getDerivedStateFromProps(props, state) {

		//To Skip Render First Time for available reducer data if exists
		if (state.isFirstTime) {
			return { ...state, isFirstTime: false, };
		}

		// To Skip Render if old and new props are equal
		if (ProviderLedgerScreen.oldProps !== props) {
			ProviderLedgerScreen.oldProps = props;
		} else {
			return null;
		}

		if (isCurrentScreen(props)) {
			
			//Get All Updated Feild of Particular actions
			const { ArbitrageCurrencyList, ProviderWalletList } = props.ProviderLedgerResult

			// ArbitrageCurrencyList is not null
			if (ArbitrageCurrencyList) {
				try {
					//if local ArbitrageCurrencyList state is null or its not null and also different then new response then and only then validate response.
					if (state.ArbitrageCurrencyListState == null || (state.ArbitrageCurrencyListState !== null && ArbitrageCurrencyList !== state.ArbitrageCurrencyListState)) {

						//if  response is success then store array list else store empty list
						if (validateResponseNew({ response: ArbitrageCurrencyList, isList: true })) {
							let res = parseArray(ArbitrageCurrencyList.ArbitrageWalletTypeMasters);
							for (var walletTypeMaster in res) {
								let item = res[walletTypeMaster]
								item.value = item.CoinName
							}

							let currency = [
								{ value: R.strings.selectCurrency },
								...res
							]

							return { ...state, ArbitrageCurrencyListState: ArbitrageCurrencyList, Currency: currency };
						} else {
							return { ...state, ArbitrageCurrencyListState: ArbitrageCurrencyList, Currency: [{ value: R.strings.selectCurrency }] };
						}
					}
				} catch (e) {
					return { ...state, Currency: [{ value: R.strings.selectCurrency }] };
				}
			}

			// ProviderWalletList is not null
			if (ProviderWalletList) {
				try {
					//if local ProviderWalletList state is null or its not null and also different then new response then and only then validate response.
					if (state.ProviderWalletListState == null || (state.ProviderWalletListState !== null && ProviderWalletList !== state.ProviderWalletListState)) {

						//if  response is success then store array list else store empty list
						if (validateResponseNew({ response: ProviderWalletList, isList: true })) {
							let res = parseArray(ProviderWalletList.Data);

							for (var keyCurrency in res) {
								 let item = res[keyCurrency];
								 item.value = item.WalletName;
							}

							let currency = [
								{ value: R.strings.selectWalletType },
								...res
							]

							return { ...state, ProviderWalletListState: ProviderWalletList,  Wallet: currency, };
						} else {
							return { ...state,  Wallet: [{ value: R.strings.selectWalletType }], ProviderWalletListState: ProviderWalletList, };
						}
					}
				} catch (e) {
					return { ...state, Wallet: [{ value: R.strings.selectWalletType }] };
				}
			}
		}
		return null
	}

	componentDidUpdate(prevProps, _prevState) {
		
		//Get All Updated field of Particular actions
		const { ProviderLedgerList, } = this.props.ProviderLedgerResult;

		// compare response with previous response
		if (ProviderLedgerList !== prevProps.ProviderLedgerResult.ProviderLedgerList) {

			// ProviderLedgerList is not null
			if (ProviderLedgerList) {
				try {
					// if local ProviderLedgerList state is null or its not null and also different then new response then and only then validate response.
					if (this.state.ProviderLedgerListState == null || (this.state.ProviderLedgerListState != null && ProviderLedgerList !== this.state.ProviderLedgerListState)) {
						// handle response of API
						if (validateResponseNew({ response: ProviderLedgerList })) {

							this.setState({ ProviderLedgerListState: ProviderLedgerList })

							let res = parseArray(ProviderLedgerList.ProviderWalletLedgers)
							// navigate Arbitrage Exchange Bal List Screen
							this.props.navigation.navigate('ProviderLedgerListScreen', {
								item: res,
								Currency: this.state.Currency,
								Wallet: this.state.Wallet,

								WalletTypeId: this.state.WalletTypeId,
								CurrencyId: this.state.CurrencyId,
								AccWalletId: this.state.AccWalletId,

								SelectedCurrency: this.state.selectedCurrency,
								SelectedWallet: this.state.selectedWallet,

								FromDate: this.state.FromDate,
								ToDate: this.state.ToDate,
								TotalCount: ProviderLedgerList.TotalCount,
							})
						} else {
							this.setState({ ProviderLedgerListState: null })
						}
					}
				} catch (error) {
					this.setState({ ProviderLedgerListState: null })
				}
			}
		}
	}

	render() {

		// Loading status for Progress bar which is fetching from reducer
		let { ArbitrageCurrencyLoading, ProviderLedgerLoading, ProviderWalletLoading } = this.props.ProviderLedgerResult

		return (
			<SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
				{/* To set status bar as per our theme */}
				<CommonStatusBar />

				{/* To set toolbar as per our theme */}
				<CustomToolbar
					isBack={true}
					title={R.strings.providerLedger}
					nav={this.props.navigation}
				/>

				{/* Common Toast */}
				<CommonToast ref={cmp => this.toast = cmp} />

				{/* Progressbar */}
				<ProgressDialog isShow={ArbitrageCurrencyLoading || ProviderLedgerLoading || ProviderWalletLoading} />

				<View style={{ flex: 1, justifyContent: 'space-between' }}>
					<ScrollView showsVerticalScrollIndicator={false}>
						<View style={this.styles().mainView}>
							{/* For FromDate and ToDate Picker and Its View */}
							<DatePickerWidget
								FromDatePickerCall={(FromDate) => this.setState({ FromDate })}
								ToDatePickerCall={(ToDate) => this.setState({ ToDate })}
								FromDate={this.state.FromDate}
								ToDate={this.state.ToDate} />

							{/* To Set Currency List in Dropdown */}
							<TitlePicker
								style={{ marginTop: R.dimens.margin }}
								title={R.strings.Currency}
								array={this.state.Currency}
								selectedValue={this.state.selectedCurrency}
								onPickerSelect={(item, object) => this.onCurrencyChange(item, object)} />

							{/* To Set Wallet List in Dropdown */}
							{
								this.state.Wallet.length > 0 &&
								<TitlePicker
									style={{ marginTop: R.dimens.margin }}
									searchable={true}
									title={R.strings.wallet}
									array={this.state.Wallet}
									selectedValue={this.state.selectedWallet}
									onPickerSelect={(item, object) => this.setState({ selectedWallet: item, AccWalletId: object.AccWalletID })} />
							}

						</View>
					</ScrollView>

					<View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
						{/* To Set Submit Button */}
						<Button title={R.strings.submit} onPress={this.onSubmitPress}></Button>
					</View>
				</View>
			</SafeView>
		)
	}

	styles = () => {
		return {
			mainView: {
				flex: 1,
				paddingLeft: R.dimens.activity_margin,
				paddingRight: R.dimens.activity_margin,
				paddingBottom: R.dimens.padding_top_bottom_margin,
				paddingTop: R.dimens.padding_top_bottom_margin,
			},
		}
	}
}

const mapStateToProps = (state) => {
	return {
		// get provider ledger data from reducer
		ProviderLedgerResult: state.ProviderLedgerReducer,
	}
}

const mapDispatchToProps = (dispatch) => ({
	// Perform Provider Ledger Action
	getProviderLedger: (payload) => dispatch(getProviderLedger(payload)),
	// Arbitrage Currency List Action
	getArbitrageCurrencyList: () => dispatch(getArbitrageCurrencyList()),
	// Perform Provider Wallet Action
	getProviderWalletList: (payload) => dispatch(getProviderWalletList(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ProviderLedgerScreen)