import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux'
import CommonStatusBar from '../../native_theme/components/CommonStatusBar'
import { changeTheme, showAlert, getDeviceID, addListener, sendEvent } from '../../controllers/CommonUtils';
import { isInternet, getRemainingSeconds, validateResponseNew, isEmpty } from '../../validations/CommonValidation';
import { signInEmailResendOTP, signInEmailVerifyOTP } from '../../actions/Login/loginAction';
import { isCurrentScreen } from '../Navigation';
import { ServiceUtilConstant, timerScreen, Events } from '../../controllers/Constants';
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import OTPScreenWidget from '../widget/OTPScreenWidget';
import { generateToken, clearGenerateTokenData } from '../../actions/Login/AuthorizeToken';
import { removeLoginData } from '../../actions/SignUpProcess/signUpAction';
import { setData } from '../../App';
import { AppConfig } from '../../controllers/AppConfig';
import R from '../../native_theme/R';
import LostGoogleAuthWidget from '../widget/LostGoogleAuthWidget';
import { languages } from '../../localization/strings';

class SignInEmailWithOtp extends Component {

	constructor(props) {
		super(props);

		this.inputs = {};

		let { params } = this.props.navigation.state;

		//To Bind All Method
		this.progressDialog = React.createRef();
		this.onVerifyOTP = this.onVerifyOTP.bind(this);
		this.onResendOTP = this.onResendOTP.bind(this);

		//Define All State initial state
		this.state = {

			// Inputs & Request Fields of Email Sign In
			EmailAddress: params.Email,
			OTP: '',
			appkey: params.appkey,

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
		//----------
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
			this.eventListener = addListener(Events.CounterListener, (left, screen) => {
				//if both screen are same then update state
				if (screen == timerScreen.signInEmailWithOTP) {
					this.setState({ isShowTimer: left != 0, until: left })
				}
			})
		}
	};

	componentWillUnmount = () => {
		if (this.eventListener) {
			this.eventListener.remove();
		}
	};

	//Resend Otp Api calling
	onResendOTP = async () => {

		//Check NetWork is Available or not
		if (await isInternet()) {
			//Call SignIn Email Resend Otp Method 
			try {

				let emailOtpResendRequest = {
					email: this.state.EmailAddress,
					deviceId: await getDeviceID(),
					mode: ServiceUtilConstant.Mode,
					hostName: ServiceUtilConstant.hostName
				}
				//Note : ipAddress parameter is passed in its saga.

				//call api for SignIn Email Resend Otp
				this.props.signInEmailResendOTP(emailOtpResendRequest)
			} catch (error) {
				showAlert(R.strings.status, R.strings.SLOW_INTERNET, 3);
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
					//Appkey: this.state.appkey
				}
				//Note : ipAddress parameter is passed in its saga.

				//call api for SignIn Email Verify Otp
				this.props.signInEmailVerifyOTP(emailOtpVerifyRequest)
			} catch (error) {
				showAlert(R.strings.status, R.strings.SLOW_INTERNET, 3);
			}
		}
	}

	shouldComponentUpdate = (nextProps, nextState) => {
		return isCurrentScreen(nextProps);
	};

	componentDidUpdate = async (prevProps, prevState) => {
		let { login: { ResendEmailOtpdata, VerifyEmailOtpdata }, token: { generateTokenData } } = this.props

		// Response handling of Resend Mobile OTP
		if (ResendEmailOtpdata !== prevProps.login.ResendEmailOtpdata) {

			if (ResendEmailOtpdata) {
				if (validateResponseNew({ response: ResendEmailOtpdata })) {
					showAlert(R.strings.Success, ResendEmailOtpdata.ReturnMsg, 0, () => {
						//this.props.removeLoginData();
						this.setState({ isShowTimer: true, appkey: ResendEmailOtpdata.Appkey, OTP: '' })
						this.refs.etOTP.clear();
						sendEvent(Events.Timer, ServiceUtilConstant.timer_time_seconds, timerScreen.signInEmailWithOTP);
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
					} else if (VerifyEmailOtpdata.ErrorCode == 4137) {
						showAlert(R.strings.Status, VerifyEmailOtpdata.ReturnMsg, 1, () => {
							this.props.removeLoginData();
							this.refs.etOTP.clear();
							this.setState({ OTP: '' })
						});
					} else {
						// Because SLOW_INTERNET dialog alreday displayed by ValidateResponseNew method
						if (VerifyEmailOtpdata.ReturnMsg !== R.strings.SLOW_INTERNET) {
							// If google authentictor is start then it will not display any dialog
							if (VerifyEmailOtpdata.ErrorCode !== 4060) {
								showAlert(R.strings.Status, VerifyEmailOtpdata.ReturnMsg, 1, () => {
									this.props.removeLoginData();
									this.refs.etOTP.clear();
									this.setState({ OTP: '' })
								});
							}
						}
					}
				} catch (error) {

				}
			}
		}

		// Response handling of generateTokenData
		if (generateTokenData !== prevProps.token.generateTokenData) {

			if (generateTokenData) {
				// Token is not null
				if (generateTokenData.access_token && generateTokenData.refresh_token && generateTokenData.id_token) {
					this.props.removeLoginData();
					this.props.navigation.navigate(AppConfig.initialHomeRoute);
				} else {
					showAlert(R.strings.Status, R.strings.pleaseTryAfterSometime, 1, () => {
						//to clear token data
						this.props.clearGenerateTokenData();
						this.props.removeLoginData();
						this.setState({ VerifyMobileOtpdata: null, ResendMobileOtpdata: null, generateTokenData: null })
					});
				}
			}
		}
	}

	static oldProps = {};

	static getDerivedStateFromProps(props, state) {
		//To Skip Render First Time for available reducer data if exists
		if (state.isFirstTime) {
			return Object.assign({}, state, { isFirstTime: false });
		}

		// To Skip Render if old and new props are equal
		if (SignInEmailWithOtp.oldProps !== props) {
			SignInEmailWithOtp.oldProps = props;
		} else {
			return null;
		}

		if (isCurrentScreen(props)) {
			//Get All Updated Feild of Particular actions
			const { login: { VerifyEmailOtpdata }, token: { generateTokenData } } = props;

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
									askTwoFA: false,
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

			// generateTokenData is not null
			if (generateTokenData) {
				try {
					//if local generateTokenData state is null or its not null and also different then new response then and only then validate response.
					if (state.generateTokenData == null || (state.generateTokenData != null && generateTokenData !== state.generateTokenData)) {
						if (validateResponseNew({ response: generateTokenData })) {
							if (generateTokenData.access_token && generateTokenData.refresh_token && generateTokenData.id_token) {
								//store tokenId & Email into preference
								setData({
									[ServiceUtilConstant.KEY_GoogleAuth]: state.isGoogleAuth,
									[ServiceUtilConstant.ACCESS_TOKEN]: 'Bearer ' + generateTokenData.access_token,
									[ServiceUtilConstant.REFRESH_TOKEN]: generateTokenData.refresh_token,
									[ServiceUtilConstant.ID_TOKEN]: generateTokenData.id_token,
									[ServiceUtilConstant.Email]: state.EmailAddress
								});

								return Object.assign({}, state, {
									generateTokenData,
									askTwoFA: false,
									VerifyEmailOtpdata: null,
									ResendEmailOtpdata: null,
								})
							} else {
								return Object.assign({}, state, {
									askTwoFA: false,
									VerifyEmailOtpdata: null,
									ResendEmailOtpdata: null,
									generateTokenData: null,
								})
							}
						}
					}
				} catch (error) {
					return Object.assign({}, state, {
						askTwoFA: false,
						VerifyEmailOtpdata: null,
						ResendEmailOtpdata: null,
						generateTokenData: null,
					})
				}
			}

		}
		return null;
	}

	render() {
		let { login: { ResendEmailOtpisFetching, VerifyEmailOtpisFetching }, token: { isGenerating } } = this.props;

		return (
			<View style={{ flex: 1, backgroundColor: R.colors.background }}>

				{/* To Set Status Bas as per out theme */}
				<CommonStatusBar />

				{/* Progress Dialog */}
				<ProgressDialog ref={component => this.progressDialog = component} isShow={ResendEmailOtpisFetching || VerifyEmailOtpisFetching || isGenerating} />

				<OTPScreenWidget ref='etOTP' ctx={this} />

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

			</View >
		);
	}
}

function mapStateToProps(state) {
	return {
		//for login and token
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

		//generate Token
		generateToken: (payload) => dispatch(generateToken(payload)),

		//to clear all type of login data
		removeLoginData: () => dispatch(removeLoginData()),

		//to clear token data
		clearGenerateTokenData: () => dispatch(clearGenerateTokenData()),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(SignInEmailWithOtp)