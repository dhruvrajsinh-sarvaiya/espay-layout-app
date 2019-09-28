import {
	NORMAL_LOGIN,
	NORMAL_LOGIN_SUCCESS,
	NORMAL_LOGIN_FAILURE,

	//SignIn With Email
	SIGNIN_WITH_EMAIL,
	SIGNIN_WITH_EMAIL_SUCCESS,
	SIGNIN_WITH_EMAIL_FAILURE,

	//Resend OTP to Email
	SIGNIN_EMAIL_RESEND_OTP,
	SIGNIN_EMAIL_RESEND_OTP_SUCCESS,
	SIGNIN_EMAIL_RESEND_OTP_FAILURE,

	//Verify OTP Email
	SIGNIN_EMAIL_VERIFY_OTP,
	SIGNIN_EMAIL_VERIFY_OTP_SUCCESS,
	SIGNIN_EMAIL_VERIFY_OTP_FAILURE,

	//SignIn With Mobile
	SIGNIN_WITH_MOBILE,
	SIGNIN_WITH_MOBILE_SUCCESS,
	SIGNIN_WITH_MOBILE_FAILURE,

	//Resend OTP to Mobile
	SIGNIN_MOBILE_RESEND_OTP,
	SIGNIN_MOBILE_RESEND_OTP_SUCCESS,
	SIGNIN_MOBILE_RESEND_OTP_FAILURE,

	//Verify OTP Mobile
	SIGNIN_MOBILE_VERIFY_OTP,
	SIGNIN_MOBILE_VERIFY_OTP_SUCCESS,
	SIGNIN_MOBILE_VERIFY_OTP_FAILURE,

	//For Google 2FA Authenticator
	TWO_FA_GOOGLE_AUTHENTICATION,
	TWO_FA_GOOGLE_AUTHENTICATION_SUCCESS,
	TWO_FA_GOOGLE_AUTHENTICATION_FAILURE,

	//For Google 2FA Authenticator
	REMOVE_LOGIN_DATA,

	// Social Login
	SOCIAL_LOGIN,
	SOCIAL_LOGIN_SUCCESS,
	SOCIAL_LOGIN_FAILURE,

	// Clear data on logout
	ACTION_LOGOUT,

	// Social Facebool Login
	SOCIAL_FACEBOOK_LOGIN,
	SOCIAL_FACEBOOK_LOGIN_SUCCESS,
	SOCIAL_FACEBOOK_LOGIN_FAILURE

} from '../../actions/ActionTypes'

const initialState = {
	isLightMode: true,
	loginData: null,
	isProcessing: false,
	error: false,

	// for 2FA SMS Auth Verify and Send SMS
	VerifySMSIsFetching: false,
	VerifySMSData: '',
	VerifySMSFetchData: true,
	SendSMSData: null,
	SendSMSFetchData: true,
	SendSMSIsFetching: false,

	// for 2FA Google Auth Verify
	VerifyGoogleAuthData: null,
	VerifyGoogleAuthIsFetching: false,

	//for login with otp
	isdatafetch: false,
	loginDataOTP: null,
	loginfatchdata: true,

	isdatafetchBlockchain: false,
	loginDataBlockchain: null,

	//For Normal Login
	NormalLoginData: null,
	NormalLoginIsFetching: false,

	//Initial State For Sign In with Email
	SignInEmailFetchData: true,
	SignInEmailData: '',
	SignInEmailIsFetching: false,

	//Initial State For SignIn Email Resend Otp Request Data
	ResendEmailOtpisFetching: false,
	ResendEmailOtpdata: null,

	//Initial State For SignIn Verify Email Otp Request Data
	VerifyEmailOtpisFetching: false,
	VerifyEmailOtpdata: '',

	//Initial State For Sign In with mobile
	SignInMobileFetchData: true,
	SignInMobileData: '',
	SignInMobileIsFetching: false,

	//Initial State For Sign In Mobile Resend Otp Request Data
	ResendMobileOtpisFetching: false,
	ResendMobileOtpdata: null,

	//Initial State For Sign In Mobile Verify Otp Request Data
	VerifyMobileOtpisFetching: false,
	VerifyMobileOtpdata: null,

	// Initial State for Social Login 
	SocialLoginData: null,
	SocialLoginFetching: false,
	SocialLoginError: false,

	// Initial State for Social Facebook Login
	SocialFacebookLoginData: null,
	SocialFacebookLoginFetching: false,
	SocialFacebookLoginError: false,
}

export default function loginReducer(state, action) {

	// If state is undefine then return with initial state		
	if (typeof state === 'undefined')
		return initialState

	switch (action.type) {

		// To reset initial state on logout
		case ACTION_LOGOUT: {
			return initialState;
		}

		// Handle Remove Login Data method data
		case REMOVE_LOGIN_DATA:
			return Object.assign({}, state, {
				NormalLoginData: null,
				NormalLoginIsFetching: false,
				VerifyMobileOtpdata: null,
				VerifyMobileOtpisFetching: false,
				VerifyEmailOtpdata: null,
				VerifyEmailOtpisFetching: false,
				VerifyGoogleAuthData: null,
				VerifyGoogleAuthIsFetching: false,
				SocialLoginData: null,
				SocialLoginFetching: false,
			})
		// for send sms login with 2FA
		case TWO_FA_GOOGLE_AUTHENTICATION:
			return Object.assign({}, state, { VerifyGoogleAuthIsFetching: true, VerifyGoogleAuthData: null });

		// set send sms login with 2FA success data
		case TWO_FA_GOOGLE_AUTHENTICATION_SUCCESS:
		// set send sms login with 2FA failure data
		case TWO_FA_GOOGLE_AUTHENTICATION_FAILURE:
			return Object.assign({}, state, { VerifyGoogleAuthIsFetching: false, VerifyGoogleAuthData: action.payload });
		// set send sms login with 2FA failure data


		// Handle Normal Login method data
		case NORMAL_LOGIN:
			return Object.assign({}, state, { NormalLoginIsFetching: true, NormalLoginData: null });
		// Set Normal Login success data
		case NORMAL_LOGIN_SUCCESS:
			return Object.assign({}, state, { NormalLoginIsFetching: false, NormalLoginData: action.payload });
		// Set Normal Login failure data
		case NORMAL_LOGIN_FAILURE:
			return Object.assign({}, state, { NormalLoginIsFetching: false, NormalLoginData: null });

		// Handle SignIn With Email method data
		case SIGNIN_WITH_EMAIL:
			return Object.assign({}, state, { SignInEmailFetchData: true, SignInEmailIsFetching: true, SignInEmailData: '', SignInMobileFetchData: true, SignInMobileData: '' });
		// Set SignIn With Email success data
		case SIGNIN_WITH_EMAIL_SUCCESS:
		// Set SignIn With Email failure data
		case SIGNIN_WITH_EMAIL_FAILURE:
			return Object.assign({}, state, { SignInEmailFetchData: false, SignInEmailIsFetching: false, SignInEmailData: action.payload });


		// Handle Resend OTP to Email method data
		case SIGNIN_EMAIL_RESEND_OTP:
			return Object.assign({}, state, {
				ResendEmailOtpisFetching: true,
				ResendEmailOtpdata: null,
				VerifyEmailOtpdata: null,
				VerifyEmailOtpisFetching: false,
			});
		// Set Resend OTP to Email success data
		case SIGNIN_EMAIL_RESEND_OTP_SUCCESS:
			return Object.assign({}, state, { ResendEmailOtpisFetching: false, ResendEmailOtpdata: action.payload });
		// Set Resend OTP to Email failure data
		case SIGNIN_EMAIL_RESEND_OTP_FAILURE:
			return Object.assign({}, state, { ResendEmailOtpisFetching: false, ResendEmailOtpdata: null });

		// Handle Verify OTP Email method data
		case SIGNIN_EMAIL_VERIFY_OTP:
			return Object.assign({}, state, { VerifyEmailOtpisFetching: true, VerifyEmailOtpdata: '' });
		// Set Verify OTP Email success data
		case SIGNIN_EMAIL_VERIFY_OTP_SUCCESS:
			return Object.assign({}, state, { VerifyEmailOtpisFetching: false, VerifyEmailOtpdata: action.payload });
		// Set Verify OTP Email failure data
		case SIGNIN_EMAIL_VERIFY_OTP_FAILURE:
			return Object.assign({}, state, { VerifyEmailOtpisFetching: false, VerifyEmailOtpdata: null });

		// Handle SignIn With Mobile method data
		case SIGNIN_WITH_MOBILE:
			return Object.assign({}, state, { SignInMobileFetchData: true, SignInMobileIsFetching: true, SignInMobileData: '', SignInEmailFetchData: true, SignInEmailData: '' });

		// Set SignIn With Mobile success data
		case SIGNIN_WITH_MOBILE_SUCCESS:
		// Set SignIn With Mobile failure data
		case SIGNIN_WITH_MOBILE_FAILURE:
			return Object.assign({}, state, { SignInMobileFetchData: false, SignInMobileIsFetching: false, SignInMobileData: action.payload });

		// Handle Resend OTP to Mobile method data
		case SIGNIN_MOBILE_RESEND_OTP:
			return Object.assign({}, state, {
				ResendMobileOtpisFetching: true,
				ResendMobileOtpdata: null,
				VerifyMobileOtpdata: null,
				VerifyMobileOtpisFetching: false,
			});
		// Set Resend OTP to Mobile success data
		case SIGNIN_MOBILE_RESEND_OTP_SUCCESS:
			return Object.assign({}, state, { ResendMobileOtpisFetching: false, ResendMobileOtpdata: action.payload });
		// Set Resend OTP to Mobile failure data
		case SIGNIN_MOBILE_RESEND_OTP_FAILURE:
			return Object.assign({}, state, { ResendMobileOtpisFetching: false, ResendMobileOtpdata: null });

		// Handle Verify OTP Mobile method data
		case SIGNIN_MOBILE_VERIFY_OTP:
			return Object.assign({}, state, { VerifyMobileOtpisFetching: true, VerifyMobileOtpdata: null });
		// Set Verify OTP Mobile success data
		case SIGNIN_MOBILE_VERIFY_OTP_SUCCESS:
			return Object.assign({}, state, { VerifyMobileOtpisFetching: false, VerifyMobileOtpdata: action.payload });
		// Set Verify OTP Mobile failure data
		case SIGNIN_MOBILE_VERIFY_OTP_FAILURE:
			return Object.assign({}, state, { VerifyMobileOtpisFetching: false, VerifyMobileOtpdata: null });

		// Handle Social login method data
		case SOCIAL_LOGIN:
			return Object.assign({}, state, {
				SocialLoginFetching: true,
				SocialLoginData: null,
			})
		// Set Social login success data
		case SOCIAL_LOGIN_SUCCESS:
			return Object.assign({}, state, {
				SocialLoginFetching: false,
				SocialLoginData: action.data
			})
		// Set Social login failure data
		case SOCIAL_LOGIN_FAILURE:
			return Object.assign({}, state, {
				SocialLoginFetching: false,
				SocialLoginData: null,
				SocialLoginError: true
			})

		// Handle Social facebook login method data
		case SOCIAL_FACEBOOK_LOGIN:
			return Object.assign({}, state, {
				SocialFacebookLoginFetching: true,
				SocialFacebookLoginData: null,
			})
		// Set Social facebook Login success data
		case SOCIAL_FACEBOOK_LOGIN_SUCCESS:
			return Object.assign({}, state, {
				SocialFacebookLoginFetching: false,
				SocialFacebookLoginData: action.data
			})
		// Set Social facebook Login failure data
		case SOCIAL_FACEBOOK_LOGIN_FAILURE:
			return Object.assign({}, state, {
				SocialFacebookLoginFetching: false,
				SocialFacebookLoginData: null,
				SocialFacebookLoginError: true
			})

		// If no actions were found from reducer than return default [existing] state value
		default:
			return state
	}
}