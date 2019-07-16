// Action types for SignUp Module
import {
	// Email SignUp
	EMAIL_SIGNUP,
	EMAIL_SIGNUP_SUCCESS,
	EMAIL_SIGNUP_FAILURE,

	// Verify SignUp OTP
	VERIFY_SIGNUP_OTP,
	VERIFY_SIGNUP_OTP_SUCCESS,
	VERIFY_SIGNUP_OTP_FAILURE,

	// Resend OTP
	RESEND_OTP,
	RESEND_OTP_SUCCESS,
	RESEND_OTP_FAILURE,

	// Normal Register
	NORMAL_REGISTER,
	NORMAL_REGISTER_SUCCESS,
	NORMAL_REGISTER_FAILURE,

	// Signup With Mobile
	SIGNUP_WITH_MOBILE,
	SIGNUP_WITH_MOBILE_SUCCESS,
	SIGNUP_WITH_MOBILE_FAILURE,

	// Resend OTP to Mobile
	SIGNUP_MOBILE_RESEND_OTP,
	SIGNUP_MOBILE_RESEND_OTP_SUCCESS,
	SIGNUP_MOBILE_RESEND_OTP_FAILURE,

	// Verify OTP Mobile
	SIGNUP_MOBILE_VERIFY_OTP,
	SIGNUP_MOBILE_VERIFY_OTP_SUCCESS,
	SIGNUP_MOBILE_VERIFY_OTP_FAILURE,

	// Resend Confirm Email
	SIGNUP_RESEND_CONFIRM_EMAIL,
	SIGNUP_RESEND_CONFIRM_EMAIL_SUCCESS,
	SIGNUP_RESEND_CONFIRM_EMAIL_FAILURE,
	ACTION_LOGOUT,

	// Clear signup with mobile/email data
	SIGNUP_WITH_MOBILE_EMAIL_CLEAR

} from '../actions/ActionTypes';

// Initial state for SignUp Module
const initialState = {
	// Signup
	signUpData: null,
	isProcessing: false,
	isFetchkey: false,
	blockchainKey: null,

	// for handling emailSignupscreen process
	emaildata: null,
	emailisfatching: false,
	emailfatchdata: true,

	//Initial State For VerifyOtp Request Data
	VerifyOtpFetchData: true,
	VerifyOtpisFetching: false,
	VerifyOtpdata: '',

	//Initial State For Resend Otp Request Data
	ResendOtpFetchData: true,
	ResendOtpisFetching: false,
	ResendOtpdata: '',

	//Initial State For Normal Sign Up
	NormalSignUpFetchData: true,
	NormalSignUpData: '',
	NormalSignUpIsFetching: false,

	//Initial State For Sign Up with mobile
	SignUpMobileFetchData: true,
	SignUpMobileData: null,
	SignUpMobileIsFetching: false,

	//Initial State For SignUp Mobile Resend Otp Request Data
	ResendMobileOtpFetchData: true,
	ResendMobileOtpisFetching: false,
	ResendMobileOtpdata: '',

	//Initial State For SignUp Mobile Verify Otp Request Data
	VerifyMobileOtpFetchData: true,
	VerifyMobileOtpisFetching: false,
	VerifyMobileOtpdata: '',

	//Initial State For SignUp Mobile Verify Otp Request Data
	ResendConfirmEmailisFetchData: false,
	ResendConfirmEmailData: '',
}

export default function signUpReducer(state, action) {

	//If state is undefine then return with initial state
	if (typeof state === 'undefined') {
		return initialState;
	}

	switch (action.type) {

		// To reset initial state on logout
		case ACTION_LOGOUT: {
			return initialState;
		}

		// Handle email signup method data
		case EMAIL_SIGNUP:
			return {
				...state,
				emaildata: null,
				emailisfatching: true,
				emailfatchdata: true,
			}
		// Handle email signup success data
		case EMAIL_SIGNUP_SUCCESS:
			return {
				...state,
				emaildata: action.data,
				emailisfatching: false,
				emailfatchdata: false,
			}
		// Set email signup failure data
		case EMAIL_SIGNUP_FAILURE:
			return {
				...state,
				emaildata: action.e,
				emailisfatching: false,
				emailfatchdata: false,
			}

		// Handle verify signup otp method data
		case VERIFY_SIGNUP_OTP:
			return Object.assign({}, state, {
				VerifyOtpisFetching: true,
				VerifyOtpFetchData: true,
				VerifyOtpdata: '',
				ResendOtpFetchData: true,
			});
		// Set verify signup otp success data
		case VERIFY_SIGNUP_OTP_SUCCESS:
			return Object.assign({}, state, {
				VerifyOtpFetchData: false,
				VerifyOtpisFetching: false,
				VerifyOtpdata: action.data,
				ResendOtpFetchData: true,
			});
		// Set verify signup otp failure data
		case VERIFY_SIGNUP_OTP_FAILURE:
			return Object.assign({}, state, {
				VerifyOtpFetchData: false,
				VerifyOtpisFetching: false,
				VerifyOtpdata: action.e,
				ResendOtpFetchData: true,
			});

		// Handle resend signup otp method data
		case RESEND_OTP:
			return Object.assign({}, state, {
				ResendOtpFetchData: true,
				ResendOtpisFetching: true,
				ResendOtpdata: '',
				VerifyOtpFetchData: true,
				// stop displaying dialog repeatdly when user getting invalid response from Verify Email OTP after clcik on resend otp button
				VerifyOtpdata: '',
				VerifyOtpisFetching: false,
			});
		// Set resend signup otp success data
		case RESEND_OTP_SUCCESS:
			return Object.assign({}, state, {
				ResendOtpFetchData: false,
				ResendOtpisFetching: false,
				ResendOtpdata: action.data,
				VerifyOtpFetchData: true,
			});
		// Set resend signup otp failure data
		case RESEND_OTP_FAILURE:
			return Object.assign({}, state, {
				ResendOtpFetchData: false,
				ResendOtpisFetching: false,
				ResendOtpdata: action.e,
				VerifyOtpFetchData: true,
			});

		// Handle normal signup method data
		case NORMAL_REGISTER:
			return {
				...state,
				NormalSignUpIsFetching: true,
				NormalSignUpFetchData: true,
				NormalSignUpData: ''
			};
		// Set normal signup success data
		case NORMAL_REGISTER_SUCCESS:
		case NORMAL_REGISTER_FAILURE:
			return {
				...state,
				NormalSignUpIsFetching: false,
				NormalSignUpData: action.payload,
				NormalSignUpFetchData: false
			};

		// Handle Signup With Mobile
		case SIGNUP_WITH_MOBILE:
			return {
				...state,
				SignUpMobileFetchData: true,
				SignUpMobileIsFetching: true,
				SignUpMobileData: null
			};

		// Set signup with mobile success failure data
		case SIGNUP_WITH_MOBILE_SUCCESS:
		case SIGNUP_WITH_MOBILE_FAILURE:
			//var error = action.payload.returnCode === 1 ? action.payload.returnMsg : error;
			return {
				...state,
				SignUpMobileFetchData: false,
				SignUpMobileIsFetching: false,
				SignUpMobileData: action.payload
			};


		// Handle signup mobile with resend method data
		case SIGNUP_MOBILE_RESEND_OTP:
			return {
				...state,
				ResendMobileOtpFetchData: true,
				ResendMobileOtpisFetching: true,
				ResendMobileOtpdata: '',
				VerifyMobileOtpFetchData: true,
				VerifyMobileOtpisFetching: false,
				// stop displaying dialog repeatdly when user getting invalid response from Verify Mobile OTP after clcik on resend otp button
				VerifyMobileOtpdata: '',
			};
		// Set signup mobile with resend success and failure data
		case SIGNUP_MOBILE_RESEND_OTP_SUCCESS:
		case SIGNUP_MOBILE_RESEND_OTP_FAILURE:
			//var error = action.payload.returnCode === 1 ? action.payload.returnMsg : error;
			return {
				...state,
				ResendMobileOtpFetchData: false,
				ResendMobileOtpisFetching: false,
				ResendMobileOtpdata: action.payload,
				VerifyMobileOtpFetchData: true
			};


		// Handle signup mobile with otp method data
		case SIGNUP_MOBILE_VERIFY_OTP:
			return {
				...state,
				VerifyMobileOtpFetchData: true,
				VerifyMobileOtpisFetching: true,
				VerifyMobileOtpdata: '',
				ResendMobileOtpFetchData: true
			};
		// Set signup mobile with otp success and failure data
		case SIGNUP_MOBILE_VERIFY_OTP_SUCCESS:
		case SIGNUP_MOBILE_VERIFY_OTP_FAILURE:
			return {
				...state,
				VerifyMobileOtpFetchData: false,
				VerifyMobileOtpisFetching: false,
				VerifyMobileOtpdata: action.payload,
				ResendMobileOtpFetchData: true
			};

		// Handle signup resend confirm mail method data
		case SIGNUP_RESEND_CONFIRM_EMAIL:
			return {
				...state,
				ResendConfirmEmailisFetchData: true,
				ResendConfirmEmailData: ''
			};
		// Set signup resend confirm mail success and failure data
		case SIGNUP_RESEND_CONFIRM_EMAIL_SUCCESS:
		case SIGNUP_RESEND_CONFIRM_EMAIL_FAILURE:
			return {
				...state,
				ResendConfirmEmailisFetchData: false,
				ResendConfirmEmailData: action.payload
			};
		// Clear signup with mobile email data
		case SIGNUP_WITH_MOBILE_EMAIL_CLEAR:
			return {
				...state,
				SignUpMobileFetchData: false,
				SignUpMobileIsFetching: false,
				SignUpMobileData: null,
				emaildata: null,
				emailisfatching: false,
				emailfatchdata: false,
			};
		// If no actions were found from reducer than return default [existing] state value
		default:
			return state
	}
}
