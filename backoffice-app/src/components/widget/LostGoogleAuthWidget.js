// LostGoogleAuthWidget
import React, { Component } from 'react';
import { Text, View, Modal, TextInput, Clipboard } from 'react-native';
import { connect } from 'react-redux';
import { twoFAGoogleAuthentication } from '../../actions/Login/loginAction'
import { changeTheme, showAlert, } from '../../controllers/CommonUtils';
import R from '../../native_theme/R';
import Separator from '../../native_theme/components/Separator';
import Button from '../../native_theme/components/Button';
import { ServiceUtilConstant, Fonts } from '../../controllers/Constants';
import { validateGoogleAuthCode, isEmpty, isInternet } from '../../validations/CommonValidation';
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import { generateToken, clearGenerateTokenData } from '../../actions/Login/AuthorizeToken';
import { removeLoginData } from '../../actions/SignUpProcess/signUpAction';
import { isCurrentScreen } from '../Navigation';
import CommonToast from '../../native_theme/components/CommonToast';
import ImageButton from '../../native_theme/components/ImageTextButton';
import TextViewHML from '../../native_theme/components/TextViewHML';
import { setData } from '../../App';
import { addIncreaseToken, addDecreaseToken } from '../../actions/Wallet/ERC223DashboardActions';
import { withdrawReconProcess } from '../../actions/Wallet/WithdrawReportActions';
import { acceptRejectWithdrawalReq } from '../../actions/Wallet/WithdrawalApprovalActions';
import { getBlockUnblockUserAddress } from '../../actions/Wallet/UserAddressAction';
import { depositReconProcess } from '../../actions/Wallet/DepositReportAction';
import { getTokenTransfer } from '../../actions/Wallet/TokenTransferAction';
import { conflictReconProcess } from '../../actions/Arbitrage/ConflictHistoryActions';
import { AddTopupRequest } from '../../actions/Arbitrage/TopupHistoryActions';
import DeviceInfo from 'react-native-device-info';
import { getBottomSpace } from '../../controllers/iPhoneXHelper';
import KeyboardAvoidingView from '../../native_theme/components/KeyboardAvoidingView';

class LostGoogleAuthWidget extends Component {
	constructor(props) {
		super(props)

		// Create Reference
		this.toast = React.createRef();

		// Define initial state
		this.state = {
			generateTokenApi: props.generateTokenApi ? props.generateTokenApi : 0,
			isShow: props.isShow ? props.isShow : false,
			TwoFAToken: props.TwoFAToken ? props.TwoFAToken : '',

			UserName: props.UserName ? props.UserName : '',
			Password: props.Password ? props.Password : '',

			WalletTypeId: props.WalletTypeId ? props.WalletTypeId : '',
			Amount: props.Amount ? props.Amount : '',
			Remarks: props.Remarks ? props.Remarks : '',

			ApiRequest: props.ApiRequest ? props.ApiRequest : {},

			googleAuthCode: '',
			appKey: props.appKey ? props.appKey : undefined,
			isFirstTime: true,

			isTablet: DeviceInfo.isTablet(),
		}
	}

	componentDidMount = () => {
		//Add this method to change theme based on stored theme name.
		changeTheme();
	}

	shouldComponentUpdate = (nextProps, nextState) => {
		// stop twice api call
		return isCurrentScreen(nextProps)
	}

	componentDidUpdate = async (prevProps, prevState) => {
		let { VerifyGoogleAuthData } = this.props.login
		// Response handling of Verify Google Auth
		if (VerifyGoogleAuthData !== prevProps.login.VerifyGoogleAuthData) {
			if (VerifyGoogleAuthData) {

				//if ErrorCode is also 0 and generate token is not called yet then call generateToken method
				if (VerifyGoogleAuthData.ErrorCode == 0) {

					// check internet connection
					if (await isInternet()) {
						// for check Preferedlanguage is get from responce or not
						if (VerifyGoogleAuthData.PreferedLanguage !== undefined && !isEmpty(VerifyGoogleAuthData.PreferedLanguage)) {
							let lang = VerifyGoogleAuthData.PreferedLanguage;
							// if language is get from responce than check get language is en,es,nl,pt than nd than set Preferedlanguage else set default en.
							if (lang === 'en' || lang === 'es' || lang === 'nl' || lang === 'pt') {
								//Prefered Language is get from the successful Login, and set it to Language 
								setData({ [ServiceUtilConstant.KEY_Locale]: lang });
							}
						}

						if (this.state.generateTokenApi == 1) {
							// Call increase supply token
							this.props.addIncreaseToken(this.state.ApiRequest)
						} else if (this.state.generateTokenApi == 2) {
							// Call decrease supply token
							this.props.addDecreaseToken(this.state.ApiRequest)
						} else if (this.state.generateTokenApi == 3) {
							// Call withdraw recon api
							this.props.withdrawReconProcess(this.state.ApiRequest)
						} else if (this.state.generateTokenApi == 4) {
							// Call accept reject withdrawal api
							this.props.acceptRejectWithdrawalReq(this.state.ApiRequest)
						} else if (this.state.generateTokenApi == 5) {
							// Call getBlockUnblockUserAddress api
							this.props.getBlockUnblockUserAddress(this.state.ApiRequest)
						} else if (this.state.generateTokenApi == 6) {
							// Call withdraw recon api
							this.props.depositReconProcess(this.state.ApiRequest)
						} else if (this.state.generateTokenApi == 7) {
							// Call withdraw recon api
							this.props.getTokenTransfer(this.state.ApiRequest)
						} else if (this.state.generateTokenApi == 8) {
							// Call conflict recon api
							this.props.conflictReconProcess(this.state.ApiRequest)
						} else if (this.state.generateTokenApi == 9) {
							// Call conflict recon api
							this.props.AddTopupRequest(this.state.ApiRequest)
						} else {
							//Call generate token method
							this.props.generateToken({ username: this.state.UserName, password: this.state.Password, appkey: this.state.appKey });
						}
					}
				}
				else if (VerifyGoogleAuthData.ErrorCode == 4137) {
					showAlert(R.strings.Info + '!', VerifyGoogleAuthData.ReturnMsg, 3, () => {
						this.props.onShow();
						this.props.removeLoginData();
					});
				} else {
					showAlert(R.strings.failure + '!', VerifyGoogleAuthData.ReturnMsg, 1, () => {
						this.props.onShow();
						this.props.removeLoginData();
						this.setState({ googleAuthCode: '' })
					});
				}
			}
		}
	}

	static getDerivedStateFromProps(props, state) {
		//To Skip Render First Time for available reducer data if exists
		if (state.isFirstTime) {
			return Object.assign({}, state, {
				isFirstTime: false,
			});
		}

		if (isCurrentScreen(props)) {

			// Get all updated field 
			const { isShow, TwoFAToken, UserName, Password, Amount, WalletTypeId, Remarks, ApiRequest } = props;

			if (state.isShow != isShow) {
				return Object.assign({}, state, {
					isShow, TwoFAToken,
					UserName, Password,
					Amount, WalletTypeId, Remarks,
					ApiRequest,
				})
			}
		}
		return null
	}

	validateGoogleCode = (text) => {
		//Validate Google Auth Code for 6 digits.
		if (validateGoogleAuthCode(text)) {
			this.setState({ googleAuthCode: text })
		}
	}

	// Call api, after check all validation
	onVerifyGoogleAuth = async () => {

		if (isEmpty(this.state.googleAuthCode)) {
			this.toast.Show(R.strings.authentication_code_validate);
			return;
		}
		else if (this.state.googleAuthCode.length != 6) {
			this.toast.Show(R.strings.Enter_valid_Code);
			return;
		}
		else {
			// Close Modal when api call
			this.props.onCancel()
			//Check NetWork is Available or not
			if (await isInternet()) {
				try {

					//Bind VerifyCode API Request
					let verifyCodeRequest = {
						Code: this.state.googleAuthCode,
						// TwoFAKey: this.state.TwoFAToken,
						// DeviceId: await getDeviceID(),
						// Mode: ServiceUtilConstant.Mode,
						// HostName: ServiceUtilConstant.hostName,

						//Note : ipAddress parameter is passed in its saga.
					}

					//to clear token data
					this.props.clearGenerateTokenData();

					//call api for verify 2FA Google Auth
					this.props.twoFAGoogleAuthentication(verifyCodeRequest);
				} catch (error) {
					//logger('GOOGLE AUTH', error.message)
					showAlert(R.strings.NetworkError, R.strings.SLOW_INTERNET, 5);
				}
			}

			this.setState({ googleAuthCode: '' })
		}
	}

	render() {

		//Get is Fetching value For All APIs to handle Progress bar in widget
		let { login: { VerifyGoogleAuthIsFetching }, isPortrait } = this.props

		//To check landscape mode true or false
		let isLandscape = (this.state.isTablet && !isPortrait);

		return (
			<View>

				{/* Progress Dialog */}
				<ProgressDialog isShow={VerifyGoogleAuthIsFetching} />

				{/* Google Auth Widget modal */}
				<Modal
					supportedOrientations={['portrait', 'landscape']}
					animationType="slide"
					transparent={true}
					visible={this.state.isShow}
					onRequestClose={() => {
						this.setState({ isShow: !this.state.isShow, googleAuthCode: '' })
						this.props.onCancel();
					}}>

					<View style={[{
						flex: 1,
						backgroundColor: 'rgba(0,0,0, 0.3)',
					}]}>
						<KeyboardAvoidingView
							behavior="padding"
							keyboardVerticalOffset={0}
							styles={{
								width: '100%',
								position: 'absolute',
								bottom: 0,
							}}>

							{/* common toast*/}
							<CommonToast ref={comp => this.toast = comp} />

							<View style={{
								width: isLandscape ? '75%' : '100%',
								alignSelf: 'center',
								backgroundColor: R.colors.background,
								borderTopLeftRadius: R.dimens.activity_margin,
								borderTopRightRadius: R.dimens.activity_margin,
							}}>
								<View style={{ marginTop: R.dimens.padding_top_bottom_margin, marginBottom: R.dimens.padding_top_bottom_margin, marginLeft: R.dimens.activity_margin, marginRight: R.dimens.activity_margin }}>

									<Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.mediumText, fontFamily: Fonts.MontserratBold }}>{R.strings.lostYourAuthenticator}</Text>
									<TextViewHML style={{ color: R.colors.textPrimary, fontSize: R.dimens.secondCurrencyText }}>{R.strings.contactToSupport}</TextViewHML>
									<Separator style={{ marginLeft: 0, marginRight: 0, marginTop: R.dimens.widgetMargin, }} />

									<View style={{ marginTop: R.dimens.margin }}>

										<View style={{ flexDirection: 'row', alignItems: 'center' }}>
											<Text style={{ flex: 1, color: R.colors.textPrimary, fontSize: R.dimens.mediumText, fontFamily: Fonts.MontserratBold }}>{R.strings.Verification}</Text>

											{/* cancel modal google authentication*/}
											<ImageButton
												onPress={() => {
													this.props.onCancel()
													this.setState({ googleAuthCode: '' })
												}}
												name={R.strings.cancel}
												textStyle={{ color: R.colors.buttonBackground, fontSize: R.dimens.smallText, textAlign: 'center' }}
												style={{ margin: R.dimens.widgetMargin }}
												isHML={true} />

										</View>

										<Separator style={{ marginLeft: 0, marginRight: 0, marginTop: R.dimens.margin, }} />

									</View>

									<View style={{ marginTop: R.dimens.margin }}>
										<Text style={{ color: R.colors.textPrimary, fontSize: R.dimens.smallText, fontFamily: Fonts.MontserratSemiBold }}>{R.strings.googleAuthenticationCode}</Text>

										<View style={{ flexDirection: 'row', alignItems: 'center' }}>

											{/* input for google authentication key */}
											<TextInput
												style={{
													flex: 1,
													fontSize: R.dimens.smallText,
													color: R.colors.textSecondary,
													paddingTop: R.dimens.widgetMargin,
													paddingBottom: R.dimens.widgetMargin,
													textAlign: 'left',
													fontFamily: Fonts.HindmaduraiLight,
												}}
												placeholder={R.strings.code}
												keyboardType={'numeric'}
												returnKeyType={'done'}
												maxLength={6}
												secureTextEntry={true}
												placeholderTextColor={R.colors.textSecondary}
												onChangeText={(code) => this.validateGoogleCode(code)}
												underlineColorAndroid='transparent'
												value={this.state.googleAuthCode}
											/>

											{/* for copy auth code to clipboard */}
											<ImageButton
												onPress={async () => {
													var content = await Clipboard.getString();
													this.setState({ googleAuthCode: content })
												}}
												name={R.strings.paste}
												textStyle={{ color: R.colors.buttonBackground, fontSize: R.dimens.smallText }}
												style={{ margin: R.dimens.widgetMargin, }}
												isHML={true} />

										</View>
										<Separator style={{ marginLeft: 0, marginRight: 0, }} color={R.colors.buttonBackground} />

									</View>

								</View>

								{/* For Confirm button */}
								<Button
									isRound={true}
									title={R.strings.confirm}
									onPress={this.onVerifyGoogleAuth}
									style={{ marginTop: R.dimens.padding_top_bottom_margin, marginBottom: R.dimens.padding_top_bottom_margin + (getBottomSpace() / 2), }} />
							</View>
						</KeyboardAvoidingView>
					</View>
				</Modal>
			</View>
		);
	}
}

function mapStateToProps(state) {
	return {
		//For Verify 2FA Google Auth Code
		login: state.loginReducer,
		token: state.tokenReducer,
		isPortrait: state.preference.dimensions.isPortrait
	}
}

function mapDispatchToProps(dispatch) {
	return {
		//to google authentication action
		twoFAGoogleAuthentication: (verifyCodeRequest) => dispatch(twoFAGoogleAuthentication(verifyCodeRequest)),

		//to generate token
		generateToken: (payload) => dispatch(generateToken(payload)),

		//to clear all type of login data
		removeLoginData: () => dispatch(removeLoginData()),

		//to clear token data
		clearGenerateTokenData: () => dispatch(clearGenerateTokenData()),

		//to increase token supply
		addIncreaseToken: (payload) => dispatch(addIncreaseToken(payload)),

		//to decrease token supply
		addDecreaseToken: (payload) => dispatch(addDecreaseToken(payload)),

		// to withdraw recon
		withdrawReconProcess: (payload) => dispatch(withdrawReconProcess(payload)),

		// to accept reject withdrawal approval 
		acceptRejectWithdrawalReq: (payload) => dispatch(acceptRejectWithdrawalReq(payload)),

		// to getBlockUnblockUserAddress
		getBlockUnblockUserAddress: (payload) => dispatch(getBlockUnblockUserAddress(payload)),

		// to DepositRecon Action
		depositReconProcess: (payload) => dispatch(depositReconProcess(payload)),

		//for add  api data
		getTokenTransfer: (add) => dispatch(getTokenTransfer(add)),

		// to Conflict Recon Action
		conflictReconProcess: (payload) => dispatch(conflictReconProcess(payload)),

		// AddTopupRequest
		AddTopupRequest: (payload) => dispatch(AddTopupRequest(payload)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(LostGoogleAuthWidget)
