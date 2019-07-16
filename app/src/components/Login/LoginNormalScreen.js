import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { normalLogin } from '../../actions/Login/loginAction'
import Button from '../../native_theme/components/Button';
import { isEmpty, isInternet, validatePassword, validateResponseNew } from '../../validations/CommonValidation';
import CommonStatusBar from '../../native_theme/components/CommonStatusBar';
import { ServiceUtilConstant } from '../../controllers/Constants'
import { changeTheme, getDeviceID, showAlert, changeFocus } from '../../controllers/CommonUtils';
import ProgressDialog from '../../native_theme/components/ProgressDialog';
import { isCurrentScreen, navigateReset } from '../Navigation'
import EditText from '../../native_theme/components/EditText'
import { generateToken as generateTokenApi, clearGenerateTokenData } from '../../actions/Login/AuthorizeToken';
import { removeLoginData } from '../../actions/SignUpProcess/signUpAction';
import { setData, getData } from '../../App';
import CommonToast from '../../native_theme/components/CommonToast';
import { AppConfig } from '../../controllers/AppConfig';
import R from '../../native_theme/R';
import BackgroundImageHeaderWidget from '../../native_theme/components/BackgroundImageHeaderWidget';
import ImageButton from '../../native_theme/components/ImageTextButton';
import LostGoogleAuthWidget from '../Widget/LostGoogleAuthWidget';
import InputScrollView from 'react-native-input-scroll-view';
import { languages } from '../../localization/strings';
import SafeView from '../../native_theme/components/SafeView';

class LoginNormalScreen extends Component {

	constructor(props) {
		super(props)

		//Create reference
		this.toast = React.createRef();
		this.mainInputTexts = {};
		this.inputs = {};

		//To Bind All Method
		this.focusNextField = this.focusNextField.bind(this);

		//Define All initial State
		this.state = {
			// Normal Login Fields
			UserName: 'DhruvitK94',
			Password: 'Kdk15@045',

			// Social Login Fields
			socialLogin: false,
			Email: '',

			// Two Factor Authentication
			askTwoFA: false,//for show modal for googleAuthenticator
			TwoFAToken: '',//for store 2faToken
			isGoogleAuth: false, // for GoogleAuth is true or not

			// To show hide password
			isVisiblePassword: false,

			// To skip first Render
			isFirstTime: true,
		}
	}

	componentDidMount = () => {
		//Add this method to change theme based on stored theme name.
		changeTheme();
	}

	//this Method is used to focus on next feild
	focusNextField(id) {
		this.inputs[id].focus();
	}

	resetDialogCounts() {
		if (getData(ServiceUtilConstant.KEY_DialogCount) > 0) {
			//To reset dialog show count for session expire causing
			//Set dialog show count to 0
			setData({ [ServiceUtilConstant.KEY_DialogCount]: 0 });
		}
	}

	onLoginButtonPress = async () => {
		this.resetDialogCounts();

		//Validations for inputs
		//Check UserName is Empty Or Not
		if (isEmpty(this.state.UserName)) {
			this.toast.Show(R.strings.username_validate);
			return;
		}
		//Check Password is Empty Or Not
		if (isEmpty(this.state.Password)) {
			this.toast.Show(R.strings.password_validate);
			return;
		}
		//To Check Password length is 10 or not
		if (this.state.Password.length < 6) {
			this.toast.Show(R.strings.password_length_validate);
			return;
		}
		//To Check Password Validation
		if (!validatePassword(this.state.Password)) {
			this.toast.Show(R.strings.Strong_Password_Validation);
			return;
		}
		else {
			changeFocus(this.mainInputTexts);
			//Check NetWork is Available or not
			if (await isInternet()) {
				try {
					//Bind Request For Normal Login
					let loginRequest = {
						username: this.state.UserName,
						password: this.state.Password,
						deviceId: await getDeviceID(),
						mode: ServiceUtilConstant.Mode,
						hostName: ServiceUtilConstant.hostName
						//Note : ipAddress parameter is passed in its saga.
					}
					//Call Normal Login API
					this.props.normalLogin(loginRequest)
					//----------
				} catch (error) {
					showAlert(R.strings.NetworkError, R.strings.SLOW_INTERNET, 5);
				}
			}
		}
	}

	shouldComponentUpdate = (nextProps, _nextState) => {
		if (this.props.preference.dimensions.isPortrait !== nextProps.preference.dimensions.isPortrait) {
			return true;
		}
		//stop twice api call 
		return isCurrentScreen(nextProps);
	};

	componentDidUpdate = async (prevProps, _prevState) => {
		// Response handling of Normal Login
		if (this.props.login.NormalLoginData !== prevProps.login.NormalLoginData) {
			// NormalLoginData is not null
			if (this.props.login.NormalLoginData) {

				let loginData = this.props.login.NormalLoginData
				//if ErrorCode is also 0 and generate token is not called yet then call generateToken method
				if (loginData.ErrorCode == 0) {
					if (await isInternet()) {
						// for check Preferedlanguage is get from responce or not
						if (loginData.PreferedLanguage !== undefined && !isEmpty(loginData.PreferedLanguage)) {
							let lang = loginData.PreferedLanguage;
							// if language is get from response than check get language is available in our languages than set Preferedlanguage else set default en.
							if (languages.findIndex(item => item.value === lang) > -1) {
								//Prefered Language is get from the successful Login, and set it to Language 
								setData({ [ServiceUtilConstant.KEY_Locale]: lang });
								R.strings.setLanguage(lang);
							}
						}
						//Call generate token method
						this.props.generateToken({ username: this.state.UserName, password: this.state.Password });
					}
				} else if (loginData.ErrorCode == 4137) {
					showAlert(R.strings.Info + '!', loginData.ReturnMsg, 3, () => {
						this.props.removeLoginData();
					});
				} else {
					// if other dialog display with different ReturnCode or Status Code then remove login data
					// example - Please try after sometime response display or uplaoding time
					this.props.removeLoginData()
				}
			}
		}

		// Response handling of generateToken
		if (this.props.token.generateToken !== prevProps.token.generateToken) {
			if (this.props.token.generateToken) {
				let tokenData = this.props.token.generateToken
				// Token is not null
				if (tokenData.access_token && tokenData.refresh_token && tokenData.id_token) {
					this.props.removeLoginData();
					navigateReset(AppConfig.initialHomeRoute);
				} else {
					showAlert(R.strings.failure + '!', R.strings.pleaseTryAfterSometime, 1, () => {
						//to clear token data
						this.props.clearGenerateTokenData();
						this.props.removeLoginData();
						this.setState({ NormalLoginData: null, generateToken: null })
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
			//Get All Updated Feild of Particular actions
			const { login: { NormalLoginData }, token: { generateToken } } = props;

			try {
				//If data is not null then continue
				if (NormalLoginData) {
					//if local NormalLoginData state is null or its not null and also different then new response then and only then validate response.
					if (state.NormalLoginData == null || (state.NormalLoginData != null && NormalLoginData !== state.NormalLoginData)) {
						//Validate Response for success response
						if (validateResponseNew({ response: NormalLoginData })) {
							//if login success but enabled 2fa then redirect user to LoginWith2FA
							if (NormalLoginData.ErrorCode == 4060) {
								//To update UserName and Password in preference
								setData({
									[ServiceUtilConstant.LOGINUSERNAME]: state.UserName,
									[ServiceUtilConstant.LOGINPASSWORD]: state.password,
									[ServiceUtilConstant.ALLOWTOKEN]: NormalLoginData.AllowToken
								});
								return Object.assign({}, state, {
									NormalLoginData,
									isGoogleAuth: true,
									askTwoFA: true,
									TwoFAToken: NormalLoginData.TwoFAToken
								});
							} else {
								return Object.assign({}, state, {
									NormalLoginData,
									isGoogleAuth: false,
									askTwoFA: false,
								})
							}
						} else {
							return Object.assign({}, state, {
								isGoogleAuth: false,
								askTwoFA: false,
							})
						}
					}
				}

				//if response is not null then store
				if (generateToken) {
					//if local generateToken state is null or its not null and also different then new response then and only then validate response.
					if (state.generateToken == null || (state.generateToken != null && generateToken !== state.generateToken)) {
						if (validateResponseNew({ response: generateToken })) {
							if (generateToken.access_token && generateToken.refresh_token && generateToken.id_token) {
								//to store token and credential in redux persist
								let data = {
									[ServiceUtilConstant.KEY_GoogleAuth]: state.isGoogleAuth,
									[ServiceUtilConstant.ACCESS_TOKEN]: 'Bearer ' + generateToken.access_token,
									[ServiceUtilConstant.REFRESH_TOKEN]: generateToken.refresh_token,
									[ServiceUtilConstant.ID_TOKEN]: generateToken.id_token,
								}
								if (state.socialLogin) {
									data = Object.assign({}, data, {
										[ServiceUtilConstant.EMAIL]: state.Email,
									});
								} else {
									data = Object.assign({}, data, {
										[ServiceUtilConstant.LOGINUSERNAME]: state.UserName,
										[ServiceUtilConstant.LOGINPASSWORD]: state.Password,
									})
								}
								setData(data);
								return Object.assign({}, state, {
									generateToken,
									askTwoFA: false,
									NormalLoginData: null,
									socialLogin: !state.socialLogin
								})
							} else {
								return Object.assign({}, state, {
									generateToken: null,
									askTwoFA: false,
									NormalLoginData: null,
								})
							}
						} else {
							return Object.assign({}, state, {
								generateToken,
								askTwoFA: false
							})
						}
					}
				}
			} catch (error) {
				return null
			}
		}
		return null
	}

	render() {
		let { NormalLoginIsFetching } = this.props.login
		let { isGenerating } = this.props.token
		return (

			<View style={{ flex: 1, backgroundColor: R.colors.background }}>

				{/* To set status bar as per our theme */}
				<CommonStatusBar translucent />

				{/* Progress Dialog */}
				<ProgressDialog isShow={NormalLoginIsFetching || isGenerating} ref={component => this.progressDialog = component} translucent={true} />

				{/* For Toast */}
				<CommonToast ref={comp => this.toast = comp} />

				{/* To Set All View in ScrollView */}
				<InputScrollView keyboardShouldPersistTaps='always' showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>

					<View style={[R.screen().isPortrait ? { height: R.screen().height } : { flex: 1 }]}>
						{/* Background Image Header */}
						<BackgroundImageHeaderWidget />

						<SafeView style={{ flex: 1, justifyContent: 'space-between' }}>
							<View style={this.styles().input_container}>

								{/* To Set UserName in EditText */}
								<EditText
									ref={input => { this.mainInputTexts['etUsername'] = input; }}
									reference={input => { this.inputs['etUsername'] = input; }}
									placeholder={R.strings.Username}
									multiline={false}
									keyboardType='default'
									returnKeyType={"next"}
									onChangeText={(UserName) => this.setState({ UserName })}
									onSubmitEditing={() => { this.focusNextField('etPassword') }}
									value={this.state.UserName}
									isRound={true}
									focusable={true}
									onFocus={() => changeFocus(this.mainInputTexts, 'etUsername')}
								/>

								{/* To Set Password in EditText */}
								<EditText
									ref={input => { this.mainInputTexts['etPassword'] = input; }}
									reference={input => { this.inputs['etPassword'] = input; }}
									placeholder={R.strings.Password}
									keyboardType='default'
									returnKeyType={"done"}
									maxLength={30}
									secureTextEntry={!this.state.isVisiblePassword}
									onChangeText={(Password) => this.setState({ Password })}
									value={this.state.Password}
									isRound={true}
									focusable={true}
									rightImage={this.state.isVisiblePassword ? R.images.IC_EYE_FILLED : R.images.IC_EYE_FILLED_DISABLE}
									onPressRight={() => {
										this.setState({ isVisiblePassword: !this.state.isVisiblePassword })
									}}
									onFocus={() => changeFocus(this.mainInputTexts, 'etPassword')}
								/>

								{/* For Login button */}
								<Button
									isRound={true}
									title={R.strings.Login}
									onPress={this.onLoginButtonPress}
									style={{ marginTop: R.dimens.padding_top_bottom_margin, marginBottom: R.dimens.widgetMargin, width: R.screen().width / 2, }} />

								{/* For Forgot Your Password */}
								<View>
									<ImageButton
										isMR
										onPress={() => {
											this.resetDialogCounts();
											this.props.navigation.navigate('ForgotPasswordComponent')
										}}
										name={R.strings.Forgot_your_password}
										textStyle={this.styles().forgot_pswd_style}
										style={{ alignSelf: 'center', margin: 0, marginTop: R.dimens.widgetMargin, marginBottom: R.dimens.margin }}
									/>
								</View>

								<View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
									<View>
										{<ImageButton
											icon={R.images.IC_QUICK_LOGIN}
											onPress={() => {
												this.resetDialogCounts();
												this.props.navigation.navigate('QuickLogin')
											}}
											iconStyle={{
												width: R.dimens.IconWidthHeight,
												height: R.dimens.IconWidthHeight,
												tintColor: R.colors.buttonBackground
											}}
											style={{ margin: 0 }} />}
									</View>
								</View>
							</View>

							{/* For Join CoolDex */}
							<View style={{ justifyContent: 'flex-start', }}>
								<ImageButton
									isMR
									onPress={() => {
										this.resetDialogCounts();
										this.props.navigation.navigate('SignUpNormal')
									}}
									name={R.strings.joinCooldex}
									textStyle={this.styles().forgot_pswd_style}
								/>
							</View>
						</SafeView>
					</View>

				</InputScrollView>

				<LostGoogleAuthWidget
					navigation={this.props.navigation}
					isShow={this.state.askTwoFA}
					TwoFAToken={this.state.TwoFAToken}
					UserName={this.state.UserName}
					onShow={() => this.setState({ askTwoFA: true })}
					onCancel={() => this.setState({ askTwoFA: false })}
					Password={this.state.Password} />
			</View >
		);
	}

	styles = () => {
		return {
			input_container: {
				paddingLeft: R.dimens.activity_margin,
				paddingRight: R.dimens.activity_margin,
				paddingTop: R.dimens.margin_top_bottom,
			},
			forgot_pswd_style: {
				color: R.colors.textSecondary,
				fontSize: R.dimens.smallText
			}
		}
	}
}

function mapStateToProps(state) {
	return {
		//Updated Data For Normal Login Api Action
		login: state.loginReducer,
		token: state.AuthorizeTokenReducer,
		preference: state.preference,
		isPortrait: state.preference.dimensions.isPortrait
	}
}

function mapDispatchToProps(dispatch) {
	return {
		//Perform normal login action
		normalLogin: (loginRequest) => dispatch(normalLogin(loginRequest)),
		//Perform genrate token action
		generateToken: (payload) => dispatch(generateTokenApi(payload)),
		//Perform remove login data action
		removeLoginData: () => dispatch(removeLoginData()),
		//Perform clear genrate token data action
		clearGenerateTokenData: () => dispatch(clearGenerateTokenData()),
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(LoginNormalScreen)