import React, { Component } from 'react'
import { View, ScrollView, Linking } from 'react-native'
import { changeTheme, parseFloatVal, convertDateTime, showAlert, parseIntVal } from '../../../controllers/CommonUtils';
import { isCurrentScreen } from '../../Navigation';
import SafeView from '../../../native_theme/components/SafeView';
import R from '../../../native_theme/R';
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar';
import CustomToolbar from '../../../native_theme/components/CustomToolbar';
import IndicatorViewPager from '../../../native_theme/components/IndicatorViewPager';
import RowItem from '../../../native_theme/components/RowItem';
import { validateValue, isEmpty, validateResponseNew } from '../../../validations/CommonValidation';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import EditText from '../../../native_theme/components/EditText';
import Button from '../../../native_theme/components/Button';
import CommonToast from '../../../native_theme/components/CommonToast';
import LostGoogleAuthWidget from '../../widget/LostGoogleAuthWidget';
import { clearWithdrawReportData } from '../../../actions/Wallet/WithdrawReportActions';
import { connect } from 'react-redux';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import RadioButton from '../../../native_theme/components/RadioButton';

export class WithdrawReconScreen extends Component {
	constructor(props) {
		super(props);

		//Define all initial state
		this.state = {
			tabNames: [R.strings.Info, R.strings.recon],
			item: props.navigation.state.params && props.navigation.state.params.item,
			ReconcilationAction: 1,
			Remarks: '',
			askTwoFA: false,
			request: {}
		}

		// create reference
		this.toast = React.createRef();
	}

	componentDidMount = async () => {

		//Add this method to change theme based on stored theme name.
		changeTheme();
	}

	shouldComponentUpdate = (nextProps, _nextState) => {
		//stop twice api call
		return isCurrentScreen(nextProps);
	}

	onTrnIdLinkPress = () => {
		let { item } = this.state
		try {
			let res = (item.hasOwnProperty('ExplorerLink')) ? JSON.parse(item.ExplorerLink) : '';
			Linking.openURL((res.length) ? res[0].Data + '/' + item.TrnID : item.TrnID);
		} catch (error) {
			//handle catch block here
		}
	}

	// when user press on reconcile button
	onReconcilePress = () => {
		// check all validation
		if (isEmpty(this.state.Remarks))
			this.toast.Show(R.strings.enterRemarks)
		else {
			let req = {
				TrnNo: parseIntVal(this.state.item.TrnNo),
				ActionMessage: this.state.Remarks,
				ActionType: parseIntVal(this.state.ReconcilationAction),
				TrnID: this.state.item.TrnID
			}
			this.setState({ askTwoFA: true, request: req })
		}
	}

	componentDidUpdate(prevProps, _prevState) {

		//Get All Updated field of Particular actions
		const { WithdrawRecon } = this.props.WithdrawReconResult

		if (WithdrawRecon !== prevProps.WithdrawReconResult.WithdrawRecon) {
			// WithdrawRecon is not null
			if (WithdrawRecon) {

				try {
					if (this.state.WithdrawRecon == null || (this.state.WithdrawRecon != null && WithdrawRecon !== this.state.WithdrawRecon)) {

						// Handle Response
						if (validateResponseNew({ response: WithdrawRecon, })) {
							// Show success dialog
							showAlert(R.strings.status, WithdrawRecon.ReturnMsg, 0, () => {
								this.props.clearWithdrawReportData()
								this.props.navigation.state.params.onRefresh(true)
								this.props.navigation.goBack()
							})
							this.setState({ WithdrawRecon })
						} else {
							// Show success dialog
							showAlert(R.strings.status, WithdrawRecon.ReturnMsg, 0, () => {
								this.props.clearWithdrawReportData()
							})
							this.setState({ WithdrawRecon: null })
						}
					}
				} catch (error) {
					// clear reducer data
					this.props.clearWithdrawReportData()
					this.setState({ WithdrawRecon: null })
				}
			}
		}
	}

	render() {
		// Loading status for Progress bar which is fetching from reducer
		let { WithdrawReconLoading, } = this.props.WithdrawReconResult

		let { item } = this.state

		let color = R.colors.yellow

		//set status color based on status code
		if (item.Status == 1)
			color = R.colors.successGreen
		else if (item.Status == 2 || item.Status == 3)
			color = R.colors.failRed
		else if (item.Status == 5 || item.Status == 999 || item.Status == 4)
			color = R.colors.cardBalanceBlue

		return (
			<SafeView style={{ flex: 1, backgroundColor: R.colors.background }}>
				{/* To set status bar as per our theme */}
				<CommonStatusBar />

				{/* To Set ToolBar as per out theme */}
				<CustomToolbar
					title={R.strings.withdrawalRecon}
					isBack={true}
					nav={this.props.navigation} />

				{/* for Toast */}
				<CommonToast ref={cmp => this.toast = cmp} />

				{/* Progressbar */}
				<ProgressDialog isShow={WithdrawReconLoading} />

				{/* View Pager Indicator (Tab) */}
				<IndicatorViewPager
					ref='WithdrawalReconTab'
					titles={this.state.tabNames}
					numOfItems={2}
					horizontalScroll={false}
					isGradient={true}
					style={{ marginLeft: R.dimens.activity_margin, marginRight: R.dimens.activity_margin, }}>
					{/* First Tab */}
					<View>
						<View style={this.styles().mainView}>
							<ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='always'>

								<RowItem style={{ paddingLeft: 0, paddingRight: 0 }} title={R.strings.Trn_No} value={validateValue(item.TrnNo)} />
								<RowItem style={{ paddingLeft: 0, paddingRight: 0 }} title={R.strings.Currency} value={validateValue(item.CoinName)} />
								<RowItem style={{ paddingLeft: 0, paddingRight: 0 }} title={R.strings.Amount} value={validateValue(parseFloatVal(item.Amount).toFixed(8))} />
								<RowItem style={{ paddingLeft: 0, paddingRight: 0 }} title={R.strings.Status} value={validateValue(item.statusStatic)} status={true} color={color} />
								<RowItem style={{ paddingLeft: 0, paddingRight: 0 }} title={R.strings.Date} value={convertDateTime(item.Date, 'YYYY-MM-DD HH:mm:ss', false)} />

								{/* Transaction Id */}
								<View style={{ flex: 1, marginTop: R.dimens.widgetMargin }}>
									<TextViewHML style={this.styles().titleStyle}>{R.strings.transactionId}: </TextViewHML>
									<TextViewHML style={[this.styles().valueStyle, { color: R.colors.accent }]} onPress={() => this.onTrnIdLinkPress()}>{validateValue(item.TrnID)}</TextViewHML>
								</View>

								{/* User Name */}
								<View style={{ flex: 1, marginTop: R.dimens.widgetMargin }}>
									<TextViewHML style={this.styles().titleStyle}>{R.strings.Username}: </TextViewHML>
									<TextViewHML style={this.styles().valueStyle}>{validateValue(item.UserName)}</TextViewHML>
								</View>

								{/* From Address */}
								<View style={{ flex: 1, marginTop: R.dimens.widgetMargin }}>
									<TextViewHML style={this.styles().titleStyle}>{R.strings.From_Address}: </TextViewHML>
									<TextViewHML style={this.styles().valueStyle}>{validateValue(item.FromAddress)}</TextViewHML>
								</View>

								{/* To Address */}
								<View style={{ flex: 1, marginTop: R.dimens.widgetMargin }}>
									<TextViewHML style={this.styles().titleStyle}>{R.strings.toAddress}: </TextViewHML>
									<TextViewHML style={this.styles().valueStyle}>{validateValue(item.ToAddress)}</TextViewHML>
								</View>

								{/* Organization Name */}
								<View style={{ flex: 1, marginTop: R.dimens.widgetMargin }}>
									<TextViewHML style={this.styles().titleStyle}>{R.strings.Organization}: </TextViewHML>
									<TextViewHML style={this.styles().valueStyle}>{validateValue(item.OrganizationName)}</TextViewHML>
								</View>
							</ScrollView>
						</View>
					</View>

					{/* second Tab */}
					<View>
						<View style={this.styles().mainView}>
							<ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='always'>
								<TextViewHML style={this.styles().titleStyle}>{R.strings.selectActionForReconcileTrans}</TextViewHML>

								<RadioButton
									item={{ title: R.strings.refund, selected: this.state.ReconcilationAction == 1 }}
									onPress={() => this.setState({ ReconcilationAction: 1 })}
								/>

								<RadioButton
									item={{ title: R.strings.successDebit, selected: this.state.ReconcilationAction == 2 }}
									onPress={() => this.setState({ ReconcilationAction: 2 })}
								/>

								<RadioButton
									item={{ title: R.strings.Success, selected: this.state.ReconcilationAction == 4 }}
									onPress={() => this.setState({ ReconcilationAction: 4 })}
								/>

								<RadioButton
									item={{ title: R.strings.markAsFail, selected: this.state.ReconcilationAction == 5 }}
									onPress={() => this.setState({ ReconcilationAction: 5 })}
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
								/>

								<View style={{ marginTop: R.dimens.widgetMargin }}>
									<TextViewHML style={{ flex: 1, color: R.colors.failRed, fontSize: R.dimens.smallestText }}>{R.strings.reconcileMessage}</TextViewHML>
								</View>
							</ScrollView>
						</View>

						<View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
							{/* To Set Submit Button */}
							<Button title={R.strings.reconcileNow} onPress={this.onReconcilePress}></Button>
						</View>
					</View>
				</IndicatorViewPager>

				<LostGoogleAuthWidget
					generateTokenApi={3}
					navigation={this.props.navigation}
					ApiRequest={this.state.request}
					isShow={this.state.askTwoFA}
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
				paddingRight: R.dimens.activity_margin,
				paddingLeft: R.dimens.activity_margin,
				paddingTop: R.dimens.padding_top_bottom_margin,
				paddingBottom: R.dimens.padding_top_bottom_margin,
				justifyContent: 'space-between'
			},
			titleStyle: {
				fontSize: R.dimens.smallText,
				color: R.colors.textSecondary,
			},
			valueStyle: {
				flex: 1,
				fontSize: R.dimens.smallText,
				color: R.colors.textPrimary,
			}
		}
	}
}


const mapStateToProps = (state) => {
	return {
		// withdraw recon data from reducer
		WithdrawReconResult: state.WithdrawReportReducer,
	}
};

const mapDispatchToProps = (dispatch) => ({
	// To Perform Clear Withdraw Report
	clearWithdrawReportData: () => dispatch(clearWithdrawReportData()),
});

export default connect(mapStateToProps, mapDispatchToProps)(WithdrawReconScreen);