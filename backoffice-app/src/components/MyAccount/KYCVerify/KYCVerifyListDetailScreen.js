import React, { Component } from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { connect } from 'react-redux'
import CommonStatusBar from '../../../native_theme/components/CommonStatusBar'
import CustomToolbar from '../../../native_theme/components/CustomToolbar'
import { changeTheme, showAlert, convertDateTime } from '../../../controllers/CommonUtils';
import { TitlePicker } from '../../../components/widget/ComboPickerWidget';
import Button from '../../../native_theme/components/Button';
import { isInternet, validateResponseNew, isEmpty } from '../../../validations/CommonValidation';
import EditText from '../../../native_theme/components/EditText';
import { editKycStatus, clearKycStatus } from '../../../actions/account/KYCVerifyActions';
import CommonToast from '../../../native_theme/components/CommonToast';
import { isCurrentScreen } from '../../../components/Navigation';
import R from '../../../native_theme/R';
import SafeView from '../../../native_theme/components/SafeView';
import ProgressDialog from '../../../native_theme/components/ProgressDialog';
import TextViewMR from '../../../native_theme/components/TextViewMR';
import TextViewHML from '../../../native_theme/components/TextViewHML';
import { AppConfig } from '../../../controllers/AppConfig';

class KYCVerifyListDetailScreen extends Component {
	constructor(props) {
		super(props);

		// Getting data from previous screen
		let item = props.navigation.state.params && props.navigation.state.params.ITEM

		let oldStatus
		if (item) {
			if (item.VerifyStatus == 1)
				oldStatus = R.strings.Approval
			else if (item.VerifyStatus == 2)
				oldStatus = R.strings.Reject
			else if (item.VerifyStatus == 4)
				oldStatus = R.strings.Pending
		}

		// Define initial state
		this.state = {
			Response: item,
			Remarks: '',
			KYCStatus: [
				{ value: R.strings.select_status },
				{ value: R.strings.Approval, code: 1 },
				{ value: R.strings.Reject, code: 2 },
				{ value: R.strings.Pending, code: 4 },
			],
			selectedKYCStatus: oldStatus,
			statusId: item.VerifyStatus
		}

		// create reference
		this.toast = React.createRef();
	}

	componentDidMount = () => {

		//Add this method to change theme based on stored theme name.
		changeTheme()
	}

	shouldComponentUpdate = (nextProps, _nextState) => {
		// stop twice api call
		return isCurrentScreen(nextProps)
	}

	// Call api after check all validation
	onSubmitPress = async () => {

		if (this.state.selectedKYCStatus === R.strings.select_status)
			this.toast.Show(R.strings.PleaseSelectStatus)
		else if (isEmpty(this.state.Remarks))
			this.toast.Show(R.strings.enterRemarks)
		else {
			// Check internet connection
			if (await isInternet()) {

				let req = {
					id: this.state.Response.Id,
					VerifyStatus: this.state.statusId,
					Remarks: this.state.Remarks
				}

				// Called Edit KYC Status Api
				this.props.editKycStatus(req)
			}
		}
	}

	componentDidUpdate(prevProps, prevState) {
		//Get All Updated field of Particular actions
		const { EditKYCStatusData } = this.props.KYCVerifyResult

		if (EditKYCStatusData !== prevProps.KYCVerifyResult.EditKYCStatusData) {
			// EditKYCStatusData is not null
			if (EditKYCStatusData) {
				try {
					if (this.state.EditKYCStatusData == null || (this.state.EditKYCStatusData != null && EditKYCStatusData !== this.state.EditKYCStatusData)) {

						this.setState({ EditKYCStatusData })

						// Handle response and get success/failure response
						if (validateResponseNew({ response: EditKYCStatusData })) {
							showAlert(R.strings.Status, EditKYCStatusData.ReturnMsg, 0, () => {
								this.props.clearKycStatus()
								this.props.navigation.state.params.onRefresh()
								this.props.navigation.goBack()
							})
						} else {
							this.setState({ EditKYCStatusData: null })
							this.props.clearKycStatus()
						}
					}
				} catch (error) {
					this.setState({ EditKYCStatusData: null })
					this.props.clearKycStatus()
				}
			}
		}
	}

	render() {
		// Loading status for Progress bar which is fetching from reducer
		const { EditKYCStatusLoading, } = this.props.KYCVerifyResult;

		return (
			<SafeView style={this.styles().container}>
				{/* To set status bar as per our theme */}
				<CommonStatusBar />

				{/* To set toolbar as per our theme */}
				<CustomToolbar
					title={R.strings.UpdateKYC}
					isBack={true}
					nav={this.props.navigation}
				/>

				{/* For Common Toast */}
				<CommonToast ref={component => this.toast = component} />

				{/* Progressbar */}
				<ProgressDialog isShow={EditKYCStatusLoading} />

				<View style={{ flex: 1, justifyContent: 'space-between' }}>
					{/* Display Data in scrollview */}
					<ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='always'>

						<View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.padding_top_bottom_margin, paddingTop: R.dimens.padding_top_bottom_margin }}>

							{/* To Set First Name in EditText */}
							<EditText
								value={this.state.Response.FirstName}
								header={R.strings.firstName}
								placeholder={R.strings.firstName}
								placeholderTextColor={R.colors.textPrimary}
								keyboardType={'default'}
								editable={false}
								multiline={false}
							/>

							{/* To Set Last Name in EditText */}
							<EditText
								value={this.state.Response.LastName}
								header={R.strings.lastName}
								placeholder={R.strings.lastName}
								placeholderTextColor={R.colors.textPrimary}
								keyboardType={'default'}
								editable={false}
								multiline={false}
							/>

							{/* To Set User Name in EditText */}
							<EditText
								value={this.state.Response.UserName}
								header={R.strings.Username}
								placeholder={R.strings.Username}
								placeholderTextColor={R.colors.textPrimary}
								keyboardType={'default'}
								editable={false}
								multiline={false}
							/>

							{/* To Set Created Date in EditText */}
							<EditText
								value={convertDateTime(this.state.Response.Createddate)}
								header={R.strings.VerificationUpdatedAt}
								placeholder={R.strings.VerificationUpdatedAt}
								placeholderTextColor={R.colors.textPrimary}
								keyboardType={'default'}
								editable={false}
								multiline={false}
							/>

							<TextViewMR style={{ textDecorationLine: 'underline', color: R.colors.textPrimary, fontSize: R.dimens.smallText, marginTop: R.dimens.widget_top_bottom_margin }}>{R.strings.Documents}</TextViewMR>

							<ScrollView style={{ marginTop: R.dimens.widget_left_right_margin }} horizontal={true} showsHorizontalScrollIndicator={false}>
								{/* Front Image */}
								<View style={{ marginRight: R.dimens.margin }}>
									<TextViewHML style={[this.styles().simpleText, { marginBottom: R.dimens.widget_left_right_margin }]}>{R.strings.FrontImage}</TextViewHML>
									<Image
										style={{ width: R.dimens.GridImage, height: R.dimens.GridImage, }}
										source={{ uri: AppConfig.baseURL + this.state.Response.FrontImage }}
										resizeMode={"stretch"}
										resizeMethod={"auto"}
										borderWidth={R.dimens.LineHeight} />
								</View>

								{/* Back Image */}
								<View style={{ marginRight: R.dimens.margin }}>
									<TextViewHML style={[this.styles().simpleText, { marginBottom: R.dimens.widget_left_right_margin }]}>{R.strings.BackImage}</TextViewHML>
									<Image
										style={{ width: R.dimens.GridImage, height: R.dimens.GridImage }}
										source={{ uri: AppConfig.baseURL + this.state.Response.BackImage }}
										resizeMode={"stretch"}
										resizeMethod={"auto"}
										borderWidth={R.dimens.LineHeight} />
								</View>

								{/* Selfie Image */}
								<View style={{ marginRight: R.dimens.margin }}>
									<TextViewHML style={[this.styles().simpleText, { marginBottom: R.dimens.widget_left_right_margin }]}>{R.strings.SelfieImage}</TextViewHML>
									<Image
										style={{ width: R.dimens.GridImage, height: R.dimens.GridImage }}
										source={{ uri: AppConfig.baseURL + this.state.Response.SelfieImage }}
										resizeMode={"stretch"}
										resizeMethod={"auto"}
										borderWidth={R.dimens.LineHeight} />
								</View>
							</ScrollView>

							<TitlePicker
								style={{ marginTop: R.dimens.margin }}
								title={R.strings.DocVerifyStatus}
								array={this.state.KYCStatus}
								selectedValue={this.state.selectedKYCStatus}
								onPickerSelect={(item, object) => this.setState({ selectedKYCStatus: item, statusId: object.code })} />

							<EditText
								value={this.state.Remarks}
								header={R.strings.remarks}
								placeholder={R.strings.remarks}
								placeholderTextColor={R.colors.textPrimary}
								keyboardType={'default'}
								multiline={true}
								numberOfLines={4}
								onChangeText={(item) => this.setState({ Remarks: item })}
								blurOnSubmit={true}
								textAlignVertical={'top'} />
						</View>

					</ScrollView>

				</View>

				<View style={{ paddingLeft: R.dimens.activity_margin, paddingRight: R.dimens.activity_margin, paddingBottom: R.dimens.widget_top_bottom_margin, paddingTop: R.dimens.widget_top_bottom_margin }}>
					<Button title={R.strings.update} onPress={this.onSubmitPress}></Button>
				</View>

			</SafeView>
		);
	}

	styles = () => {
		return {
			container: {
				flex: 1,
				backgroundColor: R.colors.background,
			},
			simpleText: {
				color: R.colors.textPrimary,
				fontSize: R.dimens.smallText,
			},
		}
	}
}

/* return state from saga or reducer */
const mapStateToProps = (state) => {
	return {
		KYCVerifyResult: state.KYCVerifyReducer,
	}
}

const mapDispatchToProps = (dispatch) => ({
	editKycStatus: (payload) => dispatch(editKycStatus(payload)),
	clearKycStatus: () => dispatch(clearKycStatus()),
})

export default connect(mapStateToProps, mapDispatchToProps)(KYCVerifyListDetailScreen);