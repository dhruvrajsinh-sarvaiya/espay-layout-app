import React, { Component } from 'react'
import { View, ScrollView, } from 'react-native'
import { changeTheme, showAlert } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../Navigation';
import SafeView from '../../../native_theme/components/SafeView';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import R from '../../../native_theme/R';
import EditText from '../../../native_theme/components/EditText';
import Button from '../../../native_theme/components/Button';
import { isEmpty, validateResponseNew } from '../../../validations/CommonValidation';
import LostGoogleAuthWidget from '../../widget/LostGoogleAuthWidget';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import CommonToast from '../../../native_theme/components/CommonToast';
import { clearConflictHistory } from '../../../actions/Arbitrage/ConflictHistoryActions';
import { connect } from 'react-redux';
import { FeatureSwitch } from '../../../native_theme/components/FeatureSwitch';

export class ConflictReconScreen extends Component {
	constructor(props) {
		super(props);

		// 1 for conflict Recon , 2 for arbitrage conflict Recon
		let screenType = props.navigation.state.params && props.navigation.state.params.screenType

		// data from previous screen
		let item = props.navigation.state.params && props.navigation.state.params.item

		//Define all initial state
		this.state = {
			Id: item.Id,
			screenType: screenType,
			amount: (item && screenType == 2) ? item.TPBalance.toString() : '',
			remarks: '',
			request: {},
			askTwoFA: false,
			isAccept: false,
		}

		this.inputs = {}
	}

	componentDidMount() {
		//Add this method to change theme based on stored theme name.
		changeTheme()
	}

	shouldComponentUpdate(nextProps, _nextState) {
		//stop twice api call
		return isCurrentScreen(nextProps)
	}

	//this Method is used to focus on next feild
	focusNextField(id) {
		this.inputs[id].focus()
	}

	// when user press on reconcile button
	onReconcilePress = () => {

		// check all validation
		if (isEmpty(this.state.amount))
			this.toast.Show(R.strings.Enter_Amount)
		else if (isEmpty(this.state.remarks))
			this.toast.Show(R.strings.enterRemarks)
		else {
			this.setState({
				askTwoFA: true,
				request: {
					RequestId: this.state.Id,
					Amount: this.state.amount,
					Remarks: this.state.remarks,
					IsAccept: this.state.isAccept == true ? 1 : 0,
					screenType: this.state.screenType
				}
			})
		}
	}


	componentDidUpdate(prevProps, _prevState) {

		//Get All Updated field of Particular actions
		const { ConflictReconProcess } = this.props.ConflictHistoryResult

		// check previous props and existing props
		if (ConflictReconProcess !== prevProps.ConflictHistoryResult.ConflictReconProcess) {
			// ConflictReconProcess is not null
			if (ConflictReconProcess) {
				try {
					// Handle Response
					if (validateResponseNew({ response: ConflictReconProcess })) {
						// Show success dialog
						showAlert(R.strings.status, R.strings.depositReconSuccess, 0, () => {
							this.props.clearConflictHistory()
							// Navigate to Conflict History Screen
							this.props.navigation.state.params.onRefresh(true)
							this.props.navigation.goBack()
						})

					} else {
						this.props.clearConflictHistory()
					}

				} catch (error) {
					// clear reducer data
					this.props.clearConflictHistory()
				}
			}
		}
	}

	render() {

		// Loading status for Progress bar which is fetching from reducer
		let { ConflictReconLoading } = this.props.ConflictHistoryResult

		return (
			<SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
				{/* To set status bar as per our theme */}
				<CommonStatusBar />

				{/* To Set ToolBar as per out theme */}
				<CustomToolbar
					title={R.strings.conflictRecon}
					isBack={true}
					nav={this.props.navigation} />

				{/* for Toast */}
				<CommonToast ref={cmp => this.toast = cmp} />

				{/* Progress bar */}
				<ProgressDialog isShow={ConflictReconLoading} />

				<View style={{ flex: 1, justifyContent: 'space-between' }}>
					<ScrollView showsVerticalScrollIndicator={false}>
						<View style={this.styles().mainView}>

							{/* To Set Provider Balance in EditText */}
							<EditText
								isRequired={true}
								reference={input => { this.inputs['etamount'] = input; }}
								header={R.strings.Amount}
								placeholder={R.strings.provideExactAmount}
								multiline={false}
								maxLength={12}
								keyboardType='numeric'
								returnKeyType={"next"}
								blurOnSubmit={false}
								onSubmitEditing={() => { this.focusNextField('etremarks') }}
								onChangeText={(amount) => this.setState({ amount })}
								value={this.state.amount}
								validate={true}
							/>

							{/* To Set remarks in EditText */}
							<EditText
								isRequired={true}
								reference={input => { this.inputs['etremarks'] = input; }}
								header={R.strings.remarks}
								placeholder={R.strings.remarks}
								multiline={true}
								numberOfLines={4}
								maxLength={300}
								textAlignVertical={'top'}
								keyboardType='default'
								returnKeyType={"done"}
								onChangeText={(remarks) => this.setState({ remarks })}
								value={this.state.remarks}
								blurOnSubmit={true}
							/>

							{/* toggle for switch accept or not */}
							<FeatureSwitch
								backgroundColor={'transparent'}
								title={R.strings.isAccept}
								style={{ paddingLeft: R.dimens.LineHeight, paddingRight: R.dimens.widgetMargin }}
								isToggle={this.state.isAccept}
								textStyle={{ color: R.colors.textPrimary }}
								onValueChange={() => {
									this.setState({ isAccept: !this.state.isAccept })
								}}
							/>

						</View>
					</ScrollView>

					<View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
						{/* To Set Submit Button */}
						<Button title={R.strings.reconcileNow} onPress={this.onReconcilePress}></Button>
					</View>
				</View>

				{/* To show 2fa */}
				<LostGoogleAuthWidget
					isShow={this.state.askTwoFA} ApiRequest={this.state.request}
					onShow={() => this.setState({ askTwoFA: true })}
					generateTokenApi={8} navigation={this.props.navigation}
					onCancel={() => this.setState({ askTwoFA: false })}
				/>
			</SafeView>
		)
	}

	styles = () => {
		return {
			mainView: {
				paddingLeft: R.dimens.activity_margin,
				paddingTop: R.dimens.padding_top_bottom_margin, paddingRight: R.dimens.activity_margin,
				paddingBottom: R.dimens.padding_top_bottom_margin,
				flex: 1,
			},
		}
	}
}

const mapStateToProps = (state) => {
	return {
		// get conflict history data from reducer
		ConflictHistoryResult: state.ConflictHistoryReducer,
	}
}

const mapDispatchToProps = (dispatch) => ({
	// To Perform Clear Conflict History Data
	clearConflictHistory: () => dispatch(clearConflictHistory()),
})

export default connect(mapStateToProps, mapDispatchToProps)(ConflictReconScreen)