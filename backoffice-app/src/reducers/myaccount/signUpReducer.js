import {
	// Email SignUp
	EMAIL_SIGNUP,
	EMAIL_SIGNUP_SUCCESS,
	EMAIL_SIGNUP_FAILURE,

	// Verify SignUp
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

	//Signup With Mobile
	SIGNUP_WITH_MOBILE,
	SIGNUP_WITH_MOBILE_SUCCESS,
	SIGNUP_WITH_MOBILE_FAILURE,

	//Resend OTP to Mobile
	SIGNUP_MOBILE_RESEND_OTP,
	SIGNUP_MOBILE_RESEND_OTP_SUCCESS,
	SIGNUP_MOBILE_RESEND_OTP_FAILURE,

	//Verify OTP Mobile
	SIGNUP_MOBILE_VERIFY_OTP,
	SIGNUP_MOBILE_VERIFY_OTP_SUCCESS,
	SIGNUP_MOBILE_VERIFY_OTP_FAILURE,

	//Resend Confirm Email
	SIGNUP_RESEND_CONFIRM_EMAIL,
	SIGNUP_RESEND_CONFIRM_EMAIL_SUCCESS,
	SIGNUP_RESEND_CONFIRM_EMAIL_FAILURE,

	// Clear data
	ACTION_LOGOUT,
	SIGNUP_WITH_MOBILE_EMAIL_CLEAR

} from '../../actions/ActionTypes';

const initialState = {
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

export default function SignUpReducer(state, action) {

	// If state is undefine then return with initial state		
	if (typeof state === 'undefined')
		return initialState

	switch (action.type) {

		// To reset initial state on logout
		case ACTION_LOGOUT:
			return initialState;

		// Handle Email Signup method data
		case EMAIL_SIGNUP:
			return Object.assign({}, state, {
				emaildata: null,
				emailisfatching: true,
				emailfatchdata: true,
			})
		// Set Email Signup success data
		case EMAIL_SIGNUP_SUCCESS:
			return Object.assign({}, state, {
				emaildata: action.data,
				emailisfatching: false,
				emailfatchdata: false,
			})
		// Set Email Signup failure data
		case EMAIL_SIGNUP_FAILURE:
			return Object.assign({}, state, {
				emaildata: action.e,
				emailisfatching: false,
				emailfatchdata: false,
			})

		// Handle Verify Signup OTP method data
		case VERIFY_SIGNUP_OTP:
			return Object.assign({}, state, {
				VerifyOtpisFetching: true,
				VerifyOtpFetchData: true,
				VerifyOtpdata: '',
				ResendOtpFetchData: true,
			});
		// Set Verify Signup OTP success data
		case VERIFY_SIGNUP_OTP_SUCCESS:
			return Object.assign({}, state, {
				VerifyOtpFetchData: false,
				VerifyOtpisFetching: false,
				VerifyOtpdata: action.data,
				ResendOtpFetchData: true,
			});
		// Set Verify Signup OTP failure data
		case VERIFY_SIGNUP_OTP_FAILURE:
			return Object.assign({}, state, {
				VerifyOtpFetchData: false,
				VerifyOtpisFetching: false,
				VerifyOtpdata: action.e,
				ResendOtpFetchData: true,
			});

		// Handle Resend OTP method data
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
		// Set Resend OTP success data
		case RESEND_OTP_SUCCESS:
			return Object.assign({}, state, {
				ResendOtpFetchData: false,
				ResendOtpisFetching: false,
				ResendOtpdata: action.data,
				VerifyOtpFetchData: true,
			})
		// Set Resend OTP failure data
		case RESEND_OTP_FAILURE:
			return Object.assign({}, state, {
				ResendOtpFetchData: false,
				ResendOtpisFetching: false,
				ResendOtpdata: action.e,
				VerifyOtpFetchData: true,
			});

		// Handle Normal Register method data
		case NORMAL_REGISTER:
			return Object.assign({}, state, { NormalSignUpIsFetching: true, NormalSignUpFetchData: true, NormalSignUpData: '' })
		// Set Normal Register success data
		case NORMAL_REGISTER_SUCCESS:
			return Object.assign({}, state, { NormalSignUpIsFetching: false, NormalSignUpData: action.payload, NormalSignUpFetchData: false })
		// Set Normal Register failure data
		case NORMAL_REGISTER_FAILURE:
			return Object.assign({}, state, { NormalSignUpIsFetching: false, NormalSignUpData: action.payload, NormalSignUpFetchData: false })

		// Handle Signup With Mobile method data
		case SIGNUP_WITH_MOBILE:
			return Object.assign({}, state, { SignUpMobileFetchData: true, SignUpMobileIsFetching: true, SignUpMobileData: null })
		// Set Signup With Mobile success data
		case SIGNUP_WITH_MOBILE_SUCCESS:
			return Object.assign({}, state, { SignUpMobileFetchData: false, SignUpMobileIsFetching: false, SignUpMobileData: action.payload })
		// Set Signup With Mobile failure data
		case SIGNUP_WITH_MOBILE_FAILURE:
			//var error = action.payload.returnCode === 1 ? action.payload.returnMsg : error;
			return Object.assign({}, state, { SignUpMobileFetchData: false, SignUpMobileIsFetching: false, SignUpMobileData: action.payload })

		// Handle Resend OTP to Mobile method data
		case SIGNUP_MOBILE_RESEND_OTP:
			return Object.assign({}, state, {
				ResendMobileOtpFetchData: true,
				ResendMobileOtpisFetching: true,
				ResendMobileOtpdata: '',
				VerifyMobileOtpFetchData: true,
				VerifyMobileOtpisFetching: false,
				// stop displaying dialog repeatdly when user getting invalid response from Verify Mobile OTP after clcik on resend otp button
				VerifyMobileOtpdata: '',
			})
		// Set Resend OTP to Mobile success data
		case SIGNUP_MOBILE_RESEND_OTP_SUCCESS:
			return Object.assign({}, state, { ResendMobileOtpFetchData: false, ResendMobileOtpisFetching: false, ResendMobileOtpdata: action.payload, VerifyMobileOtpFetchData: true })
		// Set Resend OTP to Mobile failure data
		case SIGNUP_MOBILE_RESEND_OTP_FAILURE:
			//var error = action.payload.returnCode === 1 ? action.payload.returnMsg : error;
			return Object.assign({}, state, { ResendMobileOtpFetchData: false, ResendMobileOtpisFetching: false, ResendMobileOtpdata: action.payload, VerifyMobileOtpFetchData: true })


		// Handle Verify OTP Mobile method data
		case SIGNUP_MOBILE_VERIFY_OTP:
			return Object.assign({}, state, { VerifyMobileOtpFetchData: true, VerifyMobileOtpisFetching: true, VerifyMobileOtpdata: '', ResendMobileOtpFetchData: true })
		// Handle Verify OTP Mobile success data
		case SIGNUP_MOBILE_VERIFY_OTP_SUCCESS:
			return Object.assign({}, state, { VerifyMobileOtpFetchData: false, VerifyMobileOtpisFetching: false, VerifyMobileOtpdata: action.payload, ResendMobileOtpFetchData: true })
		// Handle Verify OTP Mobile failure data
		case SIGNUP_MOBILE_VERIFY_OTP_FAILURE:
			//var error = action.payload.returnCode === 1 ? action.payload.returnMsg : error;
			return Object.assign({}, state, { VerifyMobileOtpFetchData: false, VerifyMobileOtpisFetching: false, VerifyMobileOtpdata: action.payload, ResendMobileOtpFetchData: true })

		// Handle Resend Confirm Email method data
		case SIGNUP_RESEND_CONFIRM_EMAIL:
			return Object.assign({}, state, { ResendConfirmEmailisFetchData: true, ResendConfirmEmailData: '' })
		// Set Resend Confirm Email success data
		case SIGNUP_RESEND_CONFIRM_EMAIL_SUCCESS:
			return Object.assign({}, state, { ResendConfirmEmailisFetchData: false, ResendConfirmEmailData: action.payload })
		// Set Resend Confirm Email failure data
		case SIGNUP_RESEND_CONFIRM_EMAIL_FAILURE:
			//var error = action.payload.returnCode === 1 ? action.payload.returnMsg : error;
			return Object.assign({}, state, { ResendConfirmEmailisFetchData: false, ResendConfirmEmailData: action.payload })

		// Clear Signup With Mobile Email
		case SIGNUP_WITH_MOBILE_EMAIL_CLEAR:
			return Object.assign({}, state, {
				SignUpMobileFetchData: false,
				SignUpMobileIsFetching: false,
				SignUpMobileData: null,
				emaildata: null,
				emailisfatching: false,
				emailfatchdata: false,
			})

		// If no actions were found from reducer than return default [existing] state value
		default:
			return state
	}
}
