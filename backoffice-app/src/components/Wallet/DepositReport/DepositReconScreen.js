import React, { Component } from 'react'
import { Text, View, ScrollView } from 'react-native'
import SafeView from '../../../native_theme/components/SafeView';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import CommonToast from '../../../native_theme/components/CommonToast';
import R from '../../../native_theme/R';
import { changeTheme, showAlert, sendEvent } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../Navigation';
import EditText from '../../../native_theme/components/EditText';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import Button from '../../../native_theme/components/Button';
import { isEmpty, validateResponseNew } from '../../../validations/CommonValidation';
import { clearDepositReportData } from '../../../actions/Wallet/DepositReportAction';
import { connect } from 'react-redux';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import { Events } from '../../../controllers/Constants';
import LostGoogleAuthWidget from '../../widget/LostGoogleAuthWidget';
import RadioButton from '../../../native_theme/components/RadioButton';

export class DepositReconScreen extends Component {
	constructor(props) {
		super(props);

		//Define all initial state
		this.state = {
			IDS: props.navigation.state.params && props.navigation.state.params.IDS,
			ReconcilationAction: 1,

			Remarks: '',
			askTwoFA: false,
			request: {},
		}

		// create reference
		this.toast = React.createRef();
	}

	componentDidMount = async () => {

		//Add this method to change theme based on stored theme name.
		changeTheme();
	}

	shouldComponentUpdate = (nextProps, _nextState) => {
		// stop twice api call
		return isCurrentScreen(nextProps)
	}

	// when user press on reconcile button
	onReconcilePress = () => {
		// check all validation
		if (isEmpty(this.state.Remarks))
			this.toast.Show(R.strings.enterRemarks)
		else {
			let req = {
				TrnNo: this.state.IDS,
				ActionType: this.state.ReconcilationAction,
				ActionRemarks: this.state.Remarks
			}
			this.setState({ askTwoFA: true, request: req })
		}
	}

	componentDidUpdate(prevProps, _prevState) {

		//Get All Updated field of Particular actions
		const { DepositRecon } = this.props.DepositReportResult

		if (DepositRecon !== prevProps.DepositReportResult.DepositRecon) {
			// DepositRecon is not null
			if (DepositRecon) {
				try {
					if (this.state.DepositRecon == null || (this.state.DepositRecon != null && DepositRecon !== this.state.DepositRecon)) {

						// Handle Response
						if (validateResponseNew({ response: DepositRecon, isList: true })) {
							// Show success dialog
							showAlert(R.strings.status, R.strings.depositReconSuccess, 0, () => {
								this.props.clearDepositReportData()
								sendEvent(Events.DepositReconEvent)
								this.props.navigation.navigate('DepositReportScreen')
							})
							this.setState({ DepositRecon })
						} else {
							// Show failure dialog
							showAlert(R.strings.status, DepositRecon.ReturnMsg, 1, () => {
								this.props.clearDepositReportData()
							})
							this.setState({ DepositRecon: null })
						}
					}
				} catch (error) {
					// clear reducer data
					this.props.clearDepositReportData()
					this.setState({ DepositRecon: null })
				}
			}
		}
	}

	render() {
		// Loading status for Progress bar which is fetching from reducer
		let { DepositReconLoading, } = this.props.DepositReportResult

		return (
			<SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
				{/* To set status bar as per our theme */}
				<CommonStatusBar />

				{/* To Set ToolBar as per out theme */}
				<CustomToolbar
					title={R.strings.depositReconcilation}
					isBack={true}
					nav={this.props.navigation} />

				{/* for Toast */}
				<CommonToast ref={cmp => this.toast = cmp} />

				{/* Progressbar */}
				<ProgressDialog isShow={DepositReconLoading} />

				<View style={{ flex: 1, justifyContent: 'space-between' }}>
					<ScrollView showsVerticalScrollIndicator={false}>
						<View style={this.styles().mainView}>
							<TextViewHML style={this.styles().titleStyle}>{R.strings.selectActionForReconcileTrans}</TextViewHML>

							<RadioButton
								item={{ title: R.strings.successDebit, selected: this.state.ReconcilationAction == 1 }}
								onPress={() => this.setState({ ReconcilationAction: 1 })}
							/>

							<RadioButton
								item={{ title: R.strings.markAsFail, selected: this.state.ReconcilationAction == 9 }}
								onPress={() => this.setState({ ReconcilationAction: 9 })}
							/>

							{/* To Set Record Count in EditText */}
							<EditText
								header={R.strings.remarks}
								placeholder={R.strings.remarks}
								multiline={true}
								numberOfLines={4}
								maxLength={300}
								textAlignVertical={'top'}
								keyboardType='default'
								returnKeyType={"done"}
								onChangeText={(Remarks) => this.setState({ Remarks })}
								value={this.state.Remarks}
								blurOnSubmit={true}
							/>

							<View style={{ marginTop: R.dimens.widgetMargin, }}>
								<TextViewHML style={{ flex: 1, color: R.colors.failRed, fontSize: R.dimens.smallestText, marginLeft: R.dimens.LineHeight, marginRight: R.dimens.LineHeight }}>{R.strings.reconcileMessage}</TextViewHML>
							</View>
						</View>
					</ScrollView>

					<View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
						{/* To Set Submit Button */}
						<Button title={R.strings.reconcileNow} onPress={this.onReconcilePress}></Button>
					</View>
				</View>

				<LostGoogleAuthWidget
					generateTokenApi={6}
					navigation={this.props.navigation}
					isShow={this.state.askTwoFA}
					ApiRequest={this.state.request}
					onShow={() => this.setState({ askTwoFA: true })}
					onCancel={() => this.setState({ askTwoFA: false })}
				/>
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
			titleStyle: {
				fontSize: R.dimens.smallText,
				color: R.colors.textSecondary,
			},
		}
	}
}

const mapStateToProps = (state) => {
	return {
		// get deposit report data from reducer
		DepositReportResult: state.DepositReportReducer,
	}
}

const mapDispatchToProps = (dispatch) => ({
	// To Perform Clear Deposit Report
	clearDepositReportData: () => dispatch(clearDepositReportData()),
})

export default connect(mapStateToProps, mapDispatchToProps)(DepositReconScreen)