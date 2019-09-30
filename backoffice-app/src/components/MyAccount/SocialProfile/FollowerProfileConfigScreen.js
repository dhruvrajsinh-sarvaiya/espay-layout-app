import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import EditText from '../../../native_theme/components/EditText';
import { changeTheme, getDeviceID, getIPAddress, showAlert, parseIntVal } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../Navigation';
import { isEmpty, isInternet, validateResponseNew } from '../../../validations/CommonValidation';
import CommonToast from '../../../native_theme/components/CommonToast';
import { CheckAmountValidation } from '../../../validations/AmountValidation';
import { getFollowerTradingPolicy, editFollowerTradingPolicy, clearLedgerFollowerData } from '../../../actions/account/SocialTradingPolicyActions';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { ServiceUtilConstant } from '../../../controllers/Constants';
import R from '../../../native_theme/R';
import ComboPickerWidget, { TitlePicker } from '../../widget/ComboPickerWidget';
import Button from '../../../native_theme/components/Button';
import SafeView from '../../../native_theme/components/SafeView';

class FollowerProfileConfigScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			// Follower
			CopyTrade: [{ value: R.strings.Please_Select }, { value: R.strings.yes_text }, { value: R.strings.no_text }],
			selectedCopyTrade: R.strings.Please_Select,
			selectedMirrorTrade: R.strings.Please_Select,
			MaxNoLeaderAllow: '',
			MaxNoofPairtoAllow: '',
			selectedPairWatchlist: R.strings.Please_Select,
			isFirstTime: true,
		};


		this.inputs = {}
		//create reference
		this.toast = React.createRef()
	}

	componentDidMount = async () => {
		changeTheme();

		// Check internet connection is avaialable or not
		if (await isInternet()) {

			// Called Follower Trading Policy Api
			this.props.getFollowerTradingPolicy()
		}
	}

	componentWillUnmount() {
		// clear reducer data
		this.props.clearLedgerFollowerData()
	}

	shouldComponentUpdate = (nextProps, nextState) => {
		// stop twice api call
		return isCurrentScreen(nextProps);
	};

	//this Method is used to focus on next feild 
	focusNextField(id) {
		this.inputs[id].focus();
	}

	// Allow (10,8) digit eg: 1234567890.12345678
	isValidInput = (key, value) => {
		if (value !== '') {
			if (CheckAmountValidation(value)) {
				this.setState({ [key]: value })
			}
		} else {
			this.setState({ [key]: value })
		}
	}

	// when user press on edit button of Follower Tab
	onFollowerChange = async () => {

		// Check validation
		if (this.state.selectedCopyTrade === R.strings.Please_Select)
			this.toast.Show(R.strings.PleaseSelectCopyTrade)
		else if (this.state.selectedMirrorTrade === R.strings.Please_Select)
			this.toast.Show(R.strings.PleaseSelectMirrorTrade)
		else if (isEmpty(this.state.MaxNoLeaderAllow))
			this.toast.Show(R.strings.EnterMaxFollowerAllow)
		else if (this.state.selectedPairWatchlist === R.strings.Please_Select)
			this.toast.Show(R.strings.Please_Select + ' ' + R.strings.CanAddPairWatchlist)
		else {

			// Check internet connection
			if (await isInternet()) {

				let req = {
					Can_Copy_Trade: this.state.selectedCopyTrade === R.strings.yes_text ? 1 : 2,
					Can_Mirror_Trade: this.state.selectedMirrorTrade === R.strings.yes_text ? 1 : 2,
					Maximum_Number_of_Leaders_to_Allow_Follow: parseIntVal(this.state.MaxNoLeaderAllow),
					Can_Add_Leader_to_Watchlist: this.state.selectedPairWatchlist === R.strings.yes_text ? 1 : 2,
					Max_Number_of_Leader_to_Allow_in_Watchlist: isEmpty(this.state.MaxNoofPairtoAllow) ? 0 : parseIntVal(this.state.MaxNoofPairtoAllow),
					DeviceId: await getDeviceID(),
					Mode: ServiceUtilConstant.Mode,
					IPAddress: await getIPAddress(),
					HostName: ServiceUtilConstant.hostName
				}

				// Called Set Follower Trading Policy Api
				this.props.editFollowerTradingPolicy(req)
			}
		}
	}

	onEditFollowerSuccess = async () => {
		// Check internet connection
		if (await isInternet()) {
			// Clear Follower Follower Data
			this.props.clearLedgerFollowerData()
			// Called Follower Trading Policy Api
			this.props.getFollowerTradingPolicy()
		}
	}

	componentDidUpdate(prevProps, prevState) {
		const { EditFollowerTradingData } = this.props.SocialTradingPolicyResult

		if (EditFollowerTradingData !== prevProps.SocialTradingPolicyResult.EditFollowerTradingData) {
			// EditFollowerTradingData is not null
			if (EditFollowerTradingData) {
				try {
					if (this.state.EditFollowerTradingData == null || (this.state.EditFollowerTradingData != null && EditFollowerTradingData !== this.state.EditFollowerTradingData)) {

						if (validateResponseNew({ response: EditFollowerTradingData })) {
							// on success response 
							showAlert(R.strings.status, EditFollowerTradingData.ReturnMsg, 0, () => this.onEditFollowerSuccess())
						} else {
							// Clear Follower Follower Data
							this.props.clearLedgerFollowerData()
							this.setState({ EditFollowerTradingData: null })
						}
					}
				} catch (error) {
					// Clear Follower Follower Data
					this.props.clearLedgerFollowerData()
					this.setState({ EditFollowerTradingData: null })
				}
			}
		}
	}

	static oldProps = {};

	static getDerivedStateFromProps(props, state) {
		//To Skip Render First Time for available reducer data if exists
		if (state.isFirstTime)
			return { ...state, isFirstTime: false, };

		// To Skip Render if old and new props are equal
		if (FollowerProfileConfigScreen.oldProps !== props) {
			FollowerProfileConfigScreen.oldProps = props;
		} else {
			return null;
		}

		if (isCurrentScreen(props)) {

			//Get All Updated field of Particular actions
			const { FollowerTradingData } = props.SocialTradingPolicyResult

			// FollowerTradingData is not null
			if (FollowerTradingData) {
				try {
					if (state.FollowerTradingData == null || (state.FollowerTradingData != null && FollowerTradingData !== state.FollowerTradingData)) {
						if (validateResponseNew({ response: FollowerTradingData })) {

							let response = FollowerTradingData.FollowerAdminPolicy

							// Can_Copy_Trade return 1 for Yes and 2 for No
							let canCopy = R.strings.Please_Select
							if (response.Can_Copy_Trade == 1)
								canCopy = R.strings.yes_text
							else if (response.Can_Copy_Trade == 2)
								canCopy = R.strings.no_text

							// Can_Mirror_Trade return 1 for Yes and 2 for No
							let canMirror = R.strings.Please_Select
							if (response.Can_Mirror_Trade == 1)
								canMirror = R.strings.yes_text
							else if (response.Can_Mirror_Trade == 2)
								canMirror = R.strings.no_text

							// Can_Add_Leader_to_Watchlist return 1 for Yes and 2 for No
							let canAddPair = R.strings.Please_Select
							if (response.Can_Add_Leader_to_Watchlist == 1)
								canAddPair = R.strings.yes_text
							else if (response.Can_Add_Leader_to_Watchlist == 2)
								canAddPair = R.strings.no_text

							return Object.assign({}, state, {
								selectedCopyTrade: canCopy,
								selectedMirrorTrade: canMirror,
								selectedPairWatchlist: canAddPair,
								FollowerTradingData
							})

						} else {
							return Object.assign({}, state, {
								selectedCopyTrade: R.strings.Please_Select,
								selectedMirrorTrade: R.strings.Please_Select,
								selectedPairWatchlist: R.strings.Please_Select,
								FollowerTradingData: null,
							})
						}
					}
				} catch (error) {
					return Object.assign({}, state, {
						selectedCopyTrade: R.strings.Please_Select,
						selectedMirrorTrade: R.strings.Please_Select,
						MaxNoLeaderAllow: '',
						MaxNoofPairtoAllow: '',
						selectedPairWatchlist: R.strings.Please_Select,
						FollowerTradingData: null,
					})
				}
			}

		}
		return null
	}

	render() {
		// Loading status for Progress bar which is fetching from reducer
		let { FollowerTradingLoading, EditFollowerTradingLoading } = this.props.SocialTradingPolicyResult
		return (
			<SafeView style={{ flex: 1, backgroundColor: R.colors.background, }}>

				{/* To set status bar as per our theme */}
				<CommonStatusBar />

				{/* To set toolbar as per our theme */}
				<CustomToolbar
					title={R.strings.followerProfileConfig}
					isBack={true}
					nav={this.props.navigation}
				/>

				{/* For Toast */}
				<CommonToast ref={component => this.toast = component} />

				{/* For ProgressDialog */}
				<ProgressDialog isShow={FollowerTradingLoading || EditFollowerTradingLoading} />

				{/* Follower Tab */}
				<View style={{ flex: 1, justifyContent: 'space-between', }}>
					<View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingTop: R.dimens.padding_top_bottom_margin }}>
						<ScrollView showsVerticalScrollIndicator={false}>

							<ComboPickerWidget
								style={{ paddingLeft: 0, paddingRight: 0 }}
								pickers={[
									{
										title: R.strings.CanCopyTrade,
										array: this.state.CopyTrade,
										selectedValue: this.state.selectedCopyTrade,
										onPickerSelect: (item) => this.setState({ selectedCopyTrade: item })
									},
									{
										title: R.strings.CanMirrorTrade,
										array: this.state.CopyTrade,
										selectedValue: this.state.selectedMirrorTrade,
										onPickerSelect: (item) => this.setState({ selectedMirrorTrade: item })
									},
								]}
							/>

							{/* To set Maximum No of Leader to Allow follow in EditText */}
							<EditText
								header={R.strings.MaxNoLeaderAllow}
								reference={input => { this.inputs['etMaxNoLeaderAllow'] = input; }}
								placeholder={R.strings.MaxNoLeaderAllow}
								multiline={false}
								keyboardType='numeric'
								returnKeyType={"next"}
								onChangeText={(Text) => this.isValidInput('MaxNoLeaderAllow', Text)}
								onSubmitEditing={() => { this.focusNextField('etMaxNoofPairtoAllow') }}
								value={this.state.MaxNoLeaderAllow}
							/>

							{/* Picker for Profile Visibilty */}
							<TitlePicker
								style={{ marginTop: R.dimens.margin }}
								title={R.strings.CanAddPairWatchlist}
								array={this.state.CopyTrade}
								selectedValue={this.state.selectedPairWatchlist}
								onPickerSelect={(item) => this.setState({ selectedPairWatchlist: item })} />

							{/* To set Maximum Number of Pairs to Allow in Watchlist in EditText */}
							<EditText
								header={R.strings.MaxNoofPairtoAllow}
								reference={input => { this.inputs['etMaxNoofPairtoAllow'] = input; }}
								placeholder={R.strings.MaxNoofPairtoAllow}
								multiline={false}
								keyboardType='numeric'
								returnKeyType={"done"}
								onChangeText={(Text) => this.isValidInput('MaxNoofPairtoAllow', Text)}
								value={this.state.MaxNoofPairtoAllow}
							/>

						</ScrollView>
					</View>
					<View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
						{/* To Set Submit Button */}
						<Button title={R.strings.update} onPress={this.onFollowerChange}></Button>
					</View>
				</View>
			</SafeView>
		)
	}
}

// return state from saga or resucer
const mapStateToProps = (state) => {
	return {
		SocialTradingPolicyResult: state.SocialTradingPolicyReducer,
	}
}

const mapDispatchToProps = (dispatch) => ({
	// Follower Trading Policy
	getFollowerTradingPolicy: () => dispatch(getFollowerTradingPolicy()),
	// Edit Follower Trading Policy
	editFollowerTradingPolicy: (payload) => dispatch(editFollowerTradingPolicy(payload)),
	// Clear Ledger Follower Trading Data
	clearLedgerFollowerData: () => dispatch(clearLedgerFollowerData()),
})

export default connect(mapStateToProps, mapDispatchToProps)(FollowerProfileConfigScreen);
