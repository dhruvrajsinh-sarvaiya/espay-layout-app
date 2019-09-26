import React, { Component } from 'react'
import { Text, View, ScrollView } from 'react-native'
import { changeTheme, parseArray, showAlert, parseIntVal } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../Navigation';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import R from '../../../native_theme/R';
import CommonToast from '../../../native_theme/components/CommonToast';
import { TitlePicker } from '../../widget/ComboPickerWidget';
import { getWalletType } from '../../../actions/PairListAction';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { connect } from 'react-redux';
import SafeView from '../../../native_theme/components/SafeView';
import { isInternet, validateResponseNew, isEmpty } from '../../../validations/CommonValidation';
import EditText from '../../../native_theme/components/EditText';
import Button from '../../../native_theme/components/Button';
import { addTransferFee, clearTransferFeeData } from '../../../actions/Wallet/ERC223DashboardActions';

export class AddTransferFeeScreen extends Component {

	constructor(props) {
		super(props)

		// Define all initial state
		this.state = {
			isFirstTime: true,
			Currency: [],
			WalletDataListState: null,
			AddTransferFeeState: null,

			selectedCurrency: R.strings.selectCurrency,

			MaxFee: '',
			MinFee: '',
			BasePoint: '',
			Remarks: '',
			WalletTypeId: 0,
		}

		this.inputs = {}
		// Create reference
		this.toast = React.createRef();
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
		this.inputs[id].focus();
	}

	// Call api after check all validation
	onSubmitPress = async () => {

		if (this.state.selectedCurrency === R.strings.selectCurrency)
			this.toast.Show(R.strings.selectCurrency)

		else if (isEmpty(this.state.MaxFee))
			this.toast.Show(R.strings.enterMaxFee)
		else if (parseIntVal(this.state.MaxFee) < 5)
			this.toast.Show(R.strings.maxFeeValidation)
		else if (parseIntVal(this.state.MaxFee) > 100)
			this.toast.Show(R.strings.maxFeeValidation)

		else if (isEmpty(this.state.MinFee))
			this.toast.Show(R.strings.enterMinFee)
		else if (parseIntVal(this.state.MinFee) < 0)
			this.toast.Show(R.strings.minFeeValidation)
		else if (parseIntVal(this.state.MinFee) > 4)
			this.toast.Show(R.strings.minFeeValidation)

		else if (isEmpty(this.state.BasePoint))
			this.toast.Show(R.strings.enterBasePoint)
		else if (parseIntVal(this.state.BasePoint) < 0)
			this.toast.Show(R.strings.basePointValidation)
		else if (parseIntVal(this.state.BasePoint) > 9)
			this.toast.Show(R.strings.basePointValidation)

		else if (isEmpty(this.state.Remarks))
			this.toast.Show(R.strings.enterRemarks)
		else {

			// check internet connection
			if (await isInternet()) {

				let req = {
					WalletTypeId: this.state.WalletTypeId,
					BasePoint: parseIntVal(this.state.BasePoint),
					Maxfee: parseIntVal(this.state.MaxFee),
					Minfee: parseIntVal(this.state.MinFee),
					Remarks: this.state.Remarks
				}

				// Call Transfer Fee Api
				this.props.addTransferFee(req)
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
		if (AddTransferFeeScreen.oldProps !== props) {
			AddTransferFeeScreen.oldProps = props;
		} else {
			return null;
		}

		if (isCurrentScreen(props)) {
			//Get All Updated Feild of Particular actions
			const { WalletDataList } = props.TransferFeeListResult;

			// WalletDataList is not null
			if (WalletDataList) {
				try {
					//if local WalletDataList state is null or its not null and also different then new response then and only then validate response.
					if (state.WalletDataListState == null || (state.WalletDataListState != null && WalletDataList !== state.WalletDataListState)) {

						//if  response is success then store array list else store empty list
						if (validateResponseNew({ response: WalletDataList, isList: true })) {
							let res = parseArray(WalletDataList.Types);

							for (var walletTypeData in res) {
								let item = res[walletTypeData]
								item.value = item.TypeName
							}

							let walletNames = [{ value: R.strings.selectCurrency }, ...res]
							
							return { ...state, WalletDataListState: WalletDataList, Currency: walletNames };
						} else {
							return { ...state, WalletDataListState: WalletDataList, Currency: [{ value: R.strings.selectCurrency }] };
						}
					}
				} catch (e) {
					return { ...state, WalletDataListState: WalletDataList, Currency: [{ value: R.strings.selectCurrency }] };
				}
			}
		}
		return null
	}

	componentDidUpdate(prevProps, _prevState) {

		//Get All Updated field of Particular actions
		const { AddTransferFee } = this.props.TransferFeeListResult

		if (AddTransferFee !== prevProps.TransferFeeListResult.AddTransferFee) {
			// AddTransferFee is not null
			if (AddTransferFee) {
				try {
					if (this.state.AddTransferFeeState == null || (this.state.AddTransferFeeState != null && AddTransferFee !== this.state.AddTransferFeeState)) {
						// Handle Response
						if (validateResponseNew({ response: AddTransferFee })) {
							showAlert(R.strings.status, AddTransferFee.ReturnMsg, 0, () => {
								this.props.clearTransferFeeData()
								this.props.navigation.state.params.onRefresh(true)
								this.props.navigation.goBack()
							})
							this.setState({ AddTransferFeeState: AddTransferFee })
						} else {
							this.props.clearTransferFeeData()
							this.setState({ AddTransferFeeState: AddTransferFee })
						}
					}
				} catch (error) {
					this.props.clearTransferFeeData()
					this.setState({ AddTransferFeeState: AddTransferFee })
				}
			}
		}
	}

	render() {
		// Loading status for Progress bar which is fetching from reducer
		const { WalletDataListLoading, AddTransferFeeLoading } = this.props.TransferFeeListResult;

		return (
			<SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>

				{/* To set status bar as per our theme */}
				<CommonStatusBar />

				{/* To set toolbar as per our theme */}
				<CustomToolbar
					title={R.strings.addSetTransferFee}
					isBack={true}
					nav={this.props.navigation} />

				{/* For Toast */}
				<CommonToast ref={component => this.toast = component} />

				{/* Progress bar */}
				<ProgressDialog isShow={WalletDataListLoading || AddTransferFeeLoading} />

				<View style={{ flex: 1, justifyContent: 'space-between' }}>
					<ScrollView showsVerticalScrollIndicator={false}>
						<View style={this.styles().mainView}>
							{/* Picker for Currency */}
							<TitlePicker
								isRequired={true}
								title={R.strings.Currency}
								array={this.state.Currency}
								selectedValue={this.state.selectedCurrency}
								onPickerSelect={(item, object) => this.setState({ selectedCurrency: item, WalletTypeId: object.ID })} />

							{/* To Set Max Fee in EditText */}
							<EditText
								header={R.strings.maxFee}
								reference={input => { this.inputs['etMaxFee'] = input; }}
								placeholder={R.strings.maxFee}
								multiline={false}
								maxLength={3}
								keyboardType='numeric'
								returnKeyType={"next"}
								blurOnSubmit={false}
								onSubmitEditing={() => { this.focusNextField('etMinFee') }}
								onChangeText={(MaxFee) => this.setState({ MaxFee })}
								value={this.state.MaxFee}
								validate={true}
								onlyDigit={true}
								isRequired={true}
							/>

							{/* To Set Min Fee in EditText */}
							<EditText
								header={R.strings.minFee}
								reference={input => { this.inputs['etMinFee'] = input; }}
								placeholder={R.strings.minFee}
								multiline={false}
								maxLength={1}
								keyboardType='numeric'
								returnKeyType={"next"}
								blurOnSubmit={false}
								onSubmitEditing={() => { this.focusNextField('etBasePoint') }}
								onChangeText={(MinFee) => this.setState({ MinFee })}
								value={this.state.MinFee}
								validate={true}
								onlyDigit={true}
								isRequired={true}
							/>

							{/* To Set Base Point in EditText */}
							<EditText
								header={R.strings.basePoint}
								reference={input => { this.inputs['etBasePoint'] = input; }}
								placeholder={R.strings.basePoint}
								multiline={false}
								maxLength={1}
								keyboardType='numeric'
								returnKeyType={"next"}
								blurOnSubmit={false}
								onSubmitEditing={() => { this.focusNextField('etRemarks') }}
								onChangeText={(BasePoint) => this.setState({ BasePoint })}
								value={this.state.BasePoint}
								validate={true}
								onlyDigit={true}
								isRequired={true}
							/>

							{/* To Set Remarks in EditText */}
							<EditText
								header={R.strings.remarks}
								reference={input => { this.inputs['etRemarks'] = input; }}
								placeholder={R.strings.remarks}
								multiline={false}
								maxLength={150}
								keyboardType='default'
								returnKeyType={"done"}
								onChangeText={(Remarks) => this.setState({ Remarks })}
								value={this.state.Remarks}
								isRequired={true}
							/>

						</View>
					</ScrollView>

					<View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
						{/* To Set Submit Button */}
						<Button title={R.strings.add} onPress={this.onSubmitPress}></Button>
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
		// get transfer fee data from reducer
		TransferFeeListResult: state.ERC223DashboardReducer,
	}
};

const mapDispatchToProps = (dispatch) => ({
	// To Perform Wallet Data Action
	getWalletType: () => dispatch(getWalletType()),
	// To Perform Transfer Fee Action
	addTransferFee: (payload) => dispatch(addTransferFee(payload)),
	// To Perform Clear Transfer Fee Action
	clearTransferFeeData: () => dispatch(clearTransferFeeData()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddTransferFeeScreen);