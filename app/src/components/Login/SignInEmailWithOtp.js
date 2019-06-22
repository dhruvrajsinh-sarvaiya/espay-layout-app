import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux'
import CommonStatusBar from '../../native_theme/components/CommonStatusBar'
import { changeTheme, showAlert, getDeviceID } from '../../controllers/CommonUtils';
import { isInternet, getRemainingSeconds, validateResponseNew, isEmpty } from '../../validations/CommonValidation';
import { signInEmailResendOTP, signInEmailVerifyOTP } from '../../actions/Login/loginAction';
import { isCurrentScreen } from '../Navigation';
import { ServiceUtilConstant, timerScreen } from '../../controllers/Constants';
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import OTPScreenWidget from '../Widget/OTPScreenWidget';
import { generateToken, clearGenerateTokenData } from '../../actions/Login/AuthorizeToken';
import { removeLoginData } from '../../actions/SignUpProcess/signUpAction';
import { setData } from '../../App';
import { AppConfig } from '../../controllers/AppConfig';
import R from '../../native_theme/R';
import LostGoogleAuthWidget from '../Widget/LostGoogleAuthWidget';
import { languages } from '../../localization/strings';
import SafeView from '../../native_theme/components/SafeView';
import BackgroundImageHeaderWidget from '../../native_theme/components/BackgroundImageHeaderWidget';
import moment from 'moment'

class SignInEmailWithOtp extends Component {

	constructor(props) {
		super(props);

		//Create reference
		this.inputs = {};

		//Data from previous screen 
		let { params } = this.props.navigation.state;

		//To Bind All Method
		this.progressDialog = React.createRef();
		this.onVerifyOTP = this.onVerifyOTP.bind(this);
		this.onResendOTP = this.onResendOTP.bind(this);

		//Define All State initial state
		this.state = {
			// Inputs & Request Fields of Email Sign In
			EmailAddress: params && params.Email,
			OTP: '',
			appkey: params && params.appkey,

			// Resend OTP Timer
			isShowTimer: false,
			until: ServiceUtilConstant.timer_time_seconds,

			// Two Factor Authentication
			askTwoFA: false,//for show modal for googleAuthenticator
			isGoogleAuth: false, // for GoogleAuth is true or not
			TwoFAToken: null,

			// To skip first Render
			isFirstTime: true,
		}
	}

	componentDidMount = () => {
		//Add this method to change theme based on stored theme name.
		changeTheme();

		if (isCurrentScreen(this.props)) {

			//get remaining seconds from data
			let remainingSeconds = getRemainingSeconds(timerScreen.signInEmailWithOTP);
			if (remainingSeconds > 0) {
				this.setState({ isShowTimer: true, until: remainingSeconds })
			}
		}
	};

	//Resend Otp Api calling
	onResendOTP = async () => {

		//Check NetWork is Available or not
		if (await isInternet()) {

			//Call SignIn Email Resend Otp Method 
			try {
				//Bind request for sign in email otp
				let emailOtpResendRequest = {
					email: this.state.EmailAddress,
					deviceId: await getDeviceID(),
					mode: ServiceUtilConstant.Mode,
					hostName: ServiceUtilConstant.hostName
					//Note : ipAddress parameter is passed in its saga.
				}

				//call api for SignIn Email Resend Otp
				this.props.signInEmailResendOTP(emailOtpResendRequest)
			} catch (error) {
				showAlert(R.strings.NetworkError, R.strings.SLOW_INTERNET, 5);
			}
		}
	}

	//Verify Otp Api Calling
	onVerifyOTP = async () => {

		//Check NetWork is Available or not
		if (await isInternet()) {
			try {

				//Call SignIn Email Verify Otp Method 
				let emailOtpVerifyRequest = {
					OTP: this.state.OTP,
					Email: this.state.EmailAddress,
					DeviceId: await getDeviceID(),
					Mode: ServiceUtilConstant.Mode,
					HostName: ServiceUtilConstant.hostName,
					//Note : ipAddress parameter is passed in its saga.
				}

				//call api for SignIn Email Verify Otp
				this.props.signInEmailVerifyOTP(emailOtpVerifyRequest)
			} catch (error) {
				showAlert(R.strings.NetworkError, R.strings.SLOW_INTERNET, 5);
			}
		}
	}

	shouldComponentUpdate = (nextProps, _nextState) => {
		//Stop twice api call 
		return isCurrentScreen(nextProps);
	};

	componentDidUpdate = async (prevProps, _prevState) => {
		try {
			let { login: { ResendEmailOtpdata, VerifyEmailOtpdata }, token: { generateToken } } = this.props
			// Response handling of Resend Mobile OTP
			if (ResendEmailOtpdata !== prevProps.login.ResendEmailOtpdata) {
				if (ResendEmailOtpdata) {
					if (validateResponseNew({ response: ResendEmailOtpdata })) {
						// Show success dialog of resend otp
						showAlert(R.strings.Success + '!', ResendEmailOtpdata.ReturnMsg, 0, () => {
							this.setState({ isShowTimer: true, appkey: ResendEmailOtpdata.Appkey, OTP: '' })
							this.forceUpdate();
							this.refs.etOTP.clear();

							//store ending time in redux persist
							let afterSeconds = moment().add(ServiceUtilConstant.timer_time_seconds, 'seconds').format('HH:mm:ss');
							setData({
								timerScreen: timerScreen.signInEmailWithOTP,
								[ServiceUtilConstant.timerEndTime]: afterSeconds
							});
						})
					}
				}
			}

			// Response handling of Verify OTP
			if (VerifyEmailOtpdata !== prevProps.login.VerifyEmailOtpdata) {
				if (VerifyEmailOtpdata) {
					try {
						//if ErrorCode is also 0 then call generateToken method
						if (VerifyEmailOtpdata.ErrorCode == 0) {
							if (await isInternet()) {

								// for check Preferedlanguage is get from responce or not
								if (VerifyEmailOtpdata.PreferedLanguage !== undefined && !isEmpty(VerifyEmailOtpdata.PreferedLanguage)) {
									let lang = VerifyEmailOtpdata.PreferedLanguage;

									// if language is get from response than check get language is available in our languages than set Preferedlanguage else set default en.
									if (languages.findIndex(item => item.value === lang) > -1) {

										//Prefered Language is get from the successful Login, and set it to Language 
										setData({ [ServiceUtilConstant.KEY_Locale]: lang });
									}
								}

								//Call generate token method
								this.props.generateToken({ username: this.state.EmailAddress, password: this.state.OTP, appkey: this.state.appkey });
							}
						} else if (VerifyEmailOtpdata.ErrorCode == 4137) { // 4137 means device authorization
							showAlert(R.strings.Info + '!', VerifyEmailOtpdata.ReturnMsg, 3, () => {
								this.props.removeLoginData();
								this.refs.etOTP.clear();
								this.setState({ OTP: '' })
								this.forceUpdate();
								this.props.navigation.goBack()
							});
						} else {

							// Because SLOW_INTERNET dialog alreday displayed by ValidateResponseNew method
							if (VerifyEmailOtpdata.ReturnMsg !== R.strings.SLOW_INTERNET) {

								// If google authentictor is running then it will not display any dialog
								if (VerifyEmailOtpdata.ErrorCode !== 4060) {
									showAlert(R.strings.failure + '!', VerifyEmailOtpdata.ReturnMsg, 1, () => {
										this.props.removeLoginData();
										this.refs.etOTP.clear();
										this.forceUpdate();
										this.setState({ OTP: '' })
									});
								}
							}
						}
					} catch (error) {
					}
				}
			}

			// Response handling of generateToken
			if (generateToken !== prevProps.token.generateToken) {
				if (generateToken) {

					// Token is not null
					if (generateToken.access_token && generateToken.refresh_token && generateToken.id_token) {
						this.props.removeLoginData();
						this.props.navigation.navigate(AppConfig.initialHomeRoute);
					} else {
						showAlert(R.strings.failure + '!', R.strings.pleaseTryAfterSometime, 1, () => {
							//to clear token data
							this.props.clearGenerateTokenData();
							this.props.removeLoginData();
							this.setState({ VerifyMobileOtpdata: null, ResendMobileOtpdata: null, generateToken: null })
							this.forceUpdate();
						});
					}
				}
			}
		} catch (e) {
			//console.warn('catch: ' + e.message);
		}
	}

	static getDerivedStateFromProps(props, state) {
		//To Skip Render First Time for available reducer data if exists
		if (state.isFirstTime) {
			return Object.assign({}, state, { isFirstTime: false });
		}

		if (isCurrentScreen(props)) {

			//Get All Updated Feild of Particular actions
			const { login: { VerifyEmailOtpdata }, token: { generateToken } } = props;

			//To Check SignIn Email Verify Otp Response Data is not null
			if (VerifyEmailOtpdata) {
				try {

					//if local VerifyEmailOtpdata state is null or its not null and also different then new response then and only then validate response.
					if (state.VerifyEmailOtpdata == null || (state.VerifyEmailOtpdata != null && VerifyEmailOtpdata !== state.VerifyEmailOtpdata)) {
						if (validateResponseNew({ response: VerifyEmailOtpdata, isList: true })) {

							//if login success but enabled 2fa then redirect user to LoginWith2FA 
							if (VerifyEmailOtpdata.ErrorCode == 4060) {

								//redirect to login with 2FA screen
								return Object.assign({}, state, {
									VerifyEmailOtpdata: VerifyEmailOtpdata,
									isGoogleAuth: true,
									askTwoFA: true,
									TwoFAToken: VerifyEmailOtpdata.TwoFAToken,
								});
							} else {
								return Object.assign({}, state, {
									VerifyEmailOtpdata,
									isGoogleAuth: false,
									askTwoFA: false,
								})
							}
						} else {
							return Object.assign({}, state, {
								VerifyEmailOtpdata,
								isGoogleAuth: false,
								askTwoFA: false,
							})
						}
					}
				} catch (error) {
					return Object.assign({}, state, {
						VerifyEmailOtpdata: null,
						isGoogleAuth: false,
						askTwoFA: false,
					})
				}
			}

			// generateToken is not null
			if (generateToken) {
				try {

					//if local generateToken state is null or its not null and also different then new response then and only then validate response.
					if (state.generateToken == null || (state.generateToken != null && generateToken !== state.generateToken)) {

						if (validateResponseNew({ response: generateToken })) {

							if (generateToken.access_token && generateToken.refresh_token && generateToken.id_token) {

								//store tokenId & Email into preference
								setData({
									[ServiceUtilConstant.KEY_GoogleAuth]: state.isGoogleAuth,
									[ServiceUtilConstant.ACCESS_TOKEN]: 'Bearer ' + generateToken.access_token,
									[ServiceUtilConstant.REFRESH_TOKEN]: generateToken.refresh_token,
									[ServiceUtilConstant.ID_TOKEN]: generateToken.id_token,
									[ServiceUtilConstant.Email]: state.EmailAddress
								});
								return Object.assign({}, state, {
									generateToken,
									askTwoFA: false,
									VerifyEmailOtpdata: null,
									ResendEmailOtpdata: null,
								})
							} else {
								return Object.assign({}, state, {
									askTwoFA: false,
									VerifyEmailOtpdata: null,
									ResendEmailOtpdata: null,
									generateToken: null,
								})
							}
						}
					}
				} catch (error) {
					return Object.assign({}, state, {
						askTwoFA: false,
						VerifyEmailOtpdata: null,
						ResendEmailOtpdata: null,
						generateToken: null,
					})
				}
			}
		}
		return null;
	}

	render() {
		//Get is Fetching value For All APIs to handle Progress bar in All Activity
		let { login: { ResendEmailOtpisFetching, VerifyEmailOtpisFetching }, token: { isGenerating } } = this.props;

		return (
			<View style={{ flex: 1, backgroundColor: R.colors.background }}>

				{/* To set status bar as per our theme */}
				<CommonStatusBar translucent />

				{/* Background Image Header */}
				<BackgroundImageHeaderWidget navigation={this.props.navigation} />

				{/* Progress Dialog */}
				<ProgressDialog ref={component => this.progressDialog = component} isShow={ResendEmailOtpisFetching || VerifyEmailOtpisFetching || isGenerating} translucent={true} />

				<SafeView style={{ flex: 1 }}>

					{/*Otp screen widget */}
					<OTPScreenWidget ref='etOTP' ctx={this} navigation={this.props.navigation} />

					{/* Model for Google Authentication */}
					<LostGoogleAuthWidget
						navigation={this.props.navigation}
						isShow={this.state.askTwoFA}
						TwoFAToken={this.state.TwoFAToken}
						UserName={this.state.EmailAddress}
						onShow={() => this.setState({ askTwoFA: true })}
						onCancel={() => this.setState({ askTwoFA: false })}
						Password={this.state.OTP}
						appKey={this.state.appkey} />
				</SafeView >
			</View>
		);
	}
}

function mapStateToProps(state) {
	return {
		// Updated Data for login and token action
		login: state.loginReducer,
		token: state.tokenReducer,
	}
}

function mapDispatchToProps(dispatch) {
	return {
		//Perform SignIn Email Resend Otp Action 
		signInEmailResendOTP: (emailOtpResendRequest) => dispatch(signInEmailResendOTP(emailOtpResendRequest)),
		//Perform Verify Otp Action
		signInEmailVerifyOTP: (emailOtpVerifyRequest) => dispatch(signInEmailVerifyOTP(emailOtpVerifyRequest)),
		// Perform generate Token Action
		generateToken: (payload) => dispatch(generateToken(payload)),
		//Perform clear all type of login data Action
		removeLoginData: () => dispatch(removeLoginData()),
		// Perform to clear token data Action
		clearGenerateTokenData: () => dispatch(clearGenerateTokenData()),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(SignInEmailWithOtp)