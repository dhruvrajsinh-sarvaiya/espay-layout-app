// Action types for Login Module
import {
	// Normal login
	NORMAL_LOGIN,
	NORMAL_LOGIN_SUCCESS,
	NORMAL_LOGIN_FAILURE,

	// SignIn With Email
	SIGNIN_WITH_EMAIL,
	SIGNIN_WITH_EMAIL_SUCCESS,
	SIGNIN_WITH_EMAIL_FAILURE,

	// Resend OTP to Email
	SIGNIN_EMAIL_RESEND_OTP,
	SIGNIN_EMAIL_RESEND_OTP_SUCCESS,
	SIGNIN_EMAIL_RESEND_OTP_FAILURE,

	// Verify OTP Email
	SIGNIN_EMAIL_VERIFY_OTP,
	SIGNIN_EMAIL_VERIFY_OTP_SUCCESS,
	SIGNIN_EMAIL_VERIFY_OTP_FAILURE,

	// SignIn With Mobile
	SIGNIN_WITH_MOBILE,
	SIGNIN_WITH_MOBILE_SUCCESS,
	SIGNIN_WITH_MOBILE_FAILURE,

	// Resend OTP to Mobile
	SIGNIN_MOBILE_RESEND_OTP,
	SIGNIN_MOBILE_RESEND_OTP_SUCCESS,
	SIGNIN_MOBILE_RESEND_OTP_FAILURE,

	// Verify OTP Mobile
	SIGNIN_MOBILE_VERIFY_OTP,
	SIGNIN_MOBILE_VERIFY_OTP_SUCCESS,
	SIGNIN_MOBILE_VERIFY_OTP_FAILURE,

	// For Google 2FA Authenticator
	TWO_FA_GOOGLE_AUTHENTICATION,
	TWO_FA_GOOGLE_AUTHENTICATION_SUCCESS,
	TWO_FA_GOOGLE_AUTHENTICATION_FAILURE,

	// Remove login data
	REMOVE_LOGIN_DATA,

	// Social Login
	SOCIAL_LOGIN,
	SOCIAL_LOGIN_SUCCESS,
	SOCIAL_LOGIN_FAILURE,

	// Action Logout
	ACTION_LOGOUT,

	// Social Facebook Login
	SOCIAL_FACEBOOK_LOGIN,
	SOCIAL_FACEBOOK_LOGIN_SUCCESS,
	SOCIAL_FACEBOOK_LOGIN_FAILURE

} from '../actions/ActionTypes'

// Initial State For Login Module
const INITIAL_STATE = {

	// 2FA Google Auth Verify
	VerifyGoogleAuthData: null,
	VerifyGoogleAuthIsFetching: false,

	// Normal Login
	NormalLoginData: null,
	NormalLoginIsFetching: false,

	// Sign In with Email
	SignInEmailFetchData: true,
	SignInEmailData: '',
	SignInEmailIsFetching: false,

	// SignIn Email Resend Otp Request Data
	ResendEmailOtpisFetching: false,
	ResendEmailOtpdata: null,

	// SignIn Verify Email Otp Request Data
	VerifyEmailOtpisFetching: false,
	VerifyEmailOtpdata: '',

	// Sign In with mobile
	SignInMobileFetchData: true,
	SignInMobileData: '',
	SignInMobileIsFetching: false,

	// Sign In Mobile Resend Otp Request Data
	ResendMobileOtpisFetching: false,
	ResendMobileOtpdata: null,

	// Sign In Mobile Verify Otp Request Data
	VerifyMobileOtpisFetching: false,
	VerifyMobileOtpdata: null,

	// Social Login 
	SocialLoginData: null,
	SocialLoginFetching: false,
	SocialLoginError: false,

	// Social Facebook Login
	SocialFacebookLoginData: null,
	SocialFacebookLoginFetching: false,
	SocialFacebookLoginError: false,
}

export default function loginReducer(state, action) {

	//If state is undefine then return with initial state
	if (typeof state === 'undefined') {
		return INITIAL_STATE;
	}

	switch (action.type) {

		// To reset initial state on logout
		case ACTION_LOGOUT:
			return INITIAL_STATE;

		//To Remove Login Data
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

		// Handle 2FA google authentication method data
		case TWO_FA_GOOGLE_AUTHENTICATION:
			return Object.assign({}, state, {
				VerifyGoogleAuthIsFetching: true,
				VerifyGoogleAuthData: null
			});
		// Set 2FA google authentication success and failure data
		case TWO_FA_GOOGLE_AUTHENTICATION_SUCCESS:
		case TWO_FA_GOOGLE_AUTHENTICATION_FAILURE:
			return Object.assign({}, state, {
				VerifyGoogleAuthIsFetching: false,
				VerifyGoogleAuthData: action.payload
			});

		// Handle normal login method data
		case NORMAL_LOGIN:
			return Object.assign({}, state, {
				NormalLoginIsFetching: true,
				NormalLoginData: null
			});
		// Set normal login success data
		case NORMAL_LOGIN_SUCCESS:
			return Object.assign({}, state, {
				NormalLoginIsFetching: false,
				NormalLoginData: action.payload
			});
		// Set normal login failure data
		case NORMAL_LOGIN_FAILURE:
			return Object.assign({}, state, {
				NormalLoginIsFetching: false,
				NormalLoginData: null
			});

		// Handle signin with email method data
		case SIGNIN_WITH_EMAIL:
			return Object.assign({}, state, {
				SignInEmailFetchData: true,
				SignInEmailIsFetching: true,
				SignInEmailData: '',
				SignInMobileFetchData: true,
				SignInMobileData: ''
			});
		// Set signin with email success and failure data
		case SIGNIN_WITH_EMAIL_SUCCESS:
		case SIGNIN_WITH_EMAIL_FAILURE:
			return Object.assign({}, state, {
				SignInEmailFetchData: false,
				SignInEmailIsFetching: false,
				SignInEmailData: action.payload
			});

		// Handle signin email with resend otp method data
		case SIGNIN_EMAIL_RESEND_OTP:
			return Object.assign({}, state, {
				ResendEmailOtpisFetching: true,
				ResendEmailOtpdata: null,
				VerifyEmailOtpdata: null,
				VerifyEmailOtpisFetching: false,
			});
		// Set signin email with resend otp success data
		case SIGNIN_EMAIL_RESEND_OTP_SUCCESS:
			return Object.assign({}, state, {
				ResendEmailOtpisFetching: false,
				ResendEmailOtpdata: action.payload
			});
		// Set signin email with resend otp failure data
		case SIGNIN_EMAIL_RESEND_OTP_FAILURE:
			return Object.assign({}, state, {
				ResendEmailOtpisFetching: false,
				ResendEmailOtpdata: null
			});

		// Handle signin email verify otp method data
		case SIGNIN_EMAIL_VERIFY_OTP:
			return Object.assign({}, state, {
				VerifyEmailOtpisFetching: true,
				VerifyEmailOtpdata: ''
			});
		// Set signin email verify otp success data
		case SIGNIN_EMAIL_VERIFY_OTP_SUCCESS:
			return Object.assign({}, state, {
				VerifyEmailOtpisFetching: false,
				VerifyEmailOtpdata: action.payload
			});
		// Set signin email verify otp failure data
		case SIGNIN_EMAIL_VERIFY_OTP_FAILURE:
			return Object.assign({}, state, {
				VerifyEmailOtpisFetching: false,
				VerifyEmailOtpdata: null
			});

		// Handle signin with mobile method data
		case SIGNIN_WITH_MOBILE:
			return Object.assign({}, state, {
				SignInMobileFetchData: true,
				SignInMobileIsFetching: true,
				SignInMobileData: '',
				SignInEmailFetchData: true,
				SignInEmailData: ''
			});
		// Set signin with mobile success and failure data
		case SIGNIN_WITH_MOBILE_SUCCESS:
		case SIGNIN_WITH_MOBILE_FAILURE:
			return Object.assign({}, state, {
				SignInMobileFetchData: false,
				SignInMobileIsFetching: false,
				SignInMobileData: action.payload
			});

		// Handle signin mobile with resend otp method data
		case SIGNIN_MOBILE_RESEND_OTP:
			return Object.assign({}, state, {
				ResendMobileOtpisFetching: true,
				ResendMobileOtpdata: null,
				VerifyMobileOtpdata: null,
				VerifyMobileOtpisFetching: false,
			});
		// Set signin mobile with resend otp success data
		case SIGNIN_MOBILE_RESEND_OTP_SUCCESS:
			return Object.assign({}, state, {
				ResendMobileOtpisFetching: false,
				ResendMobileOtpdata: action.payload
			});
		// Set signin mobile with resend otp failure data
		case SIGNIN_MOBILE_RESEND_OTP_FAILURE:
			return Object.assign({}, state, {
				ResendMobileOtpisFetching: false,
				ResendMobileOtpdata: null
			});

		// Handle signin mobile verify otp method data
		case SIGNIN_MOBILE_VERIFY_OTP:
			return Object.assign({}, state, {
				VerifyMobileOtpisFetching: true,
				VerifyMobileOtpdata: null
			});
		// Set signin mobile verify otp success data
		case SIGNIN_MOBILE_VERIFY_OTP_SUCCESS:
			return Object.assign({}, state, {
				VerifyMobileOtpisFetching: false,
				VerifyMobileOtpdata: action.payload
			});
		// Set signin mobile verify otp failure data
		case SIGNIN_MOBILE_VERIFY_OTP_FAILURE:
			return Object.assign({}, state, {
				VerifyMobileOtpisFetching: false,
				VerifyMobileOtpdata: null
			});

		// Handle social google login method data
		case SOCIAL_LOGIN:
			return Object.assign({}, state, {
				SocialLoginFetching: true,
				SocialLoginData: null,
			})
		// Set social login google success data
		case SOCIAL_LOGIN_SUCCESS:
			return Object.assign({}, state, {
				SocialLoginFetching: false,
				SocialLoginData: action.data
			})
		// Set social login google failure data
		case SOCIAL_LOGIN_FAILURE:
			return Object.assign({}, state, {
				SocialLoginFetching: false,
				SocialLoginData: null,
				SocialLoginError: true
			})

		// Handle social facebook login method data
		case SOCIAL_FACEBOOK_LOGIN:
			return Object.assign({}, state, {
				SocialFacebookLoginFetching: true,
				SocialFacebookLoginData: null,
			})
		// Set social login facebook success data
		case SOCIAL_FACEBOOK_LOGIN_SUCCESS:
			return Object.assign({}, state, {
				SocialFacebookLoginFetching: false,
				SocialFacebookLoginData: action.data
			})
		// Set social login facebook failure data
		case SOCIAL_FACEBOOK_LOGIN_FAILURE:
			return Object.assign({}, state, {
				...state,
				SocialFacebookLoginFetching: false,
				SocialFacebookLoginData: null,
				SocialFacebookLoginError: true
			})

		// If no actions were found from reducer than return default [existing] state value
		default:
			return state
	}
}