import {
	// Normal Login
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

	//SignIn Resend OTP to Mobile
	SIGNIN_MOBILE_RESEND_OTP,
	SIGNIN_MOBILE_RESEND_OTP_SUCCESS,
	SIGNIN_MOBILE_RESEND_OTP_FAILURE,

	//SignIn Verify OTP Mobile
	SIGNIN_MOBILE_VERIFY_OTP,
	SIGNIN_MOBILE_VERIFY_OTP_SUCCESS,
	SIGNIN_MOBILE_VERIFY_OTP_FAILURE,

	//For Google 2FA Authenticator
	TWO_FA_GOOGLE_AUTHENTICATION,
	TWO_FA_GOOGLE_AUTHENTICATION_SUCCESS,
	TWO_FA_GOOGLE_AUTHENTICATION_FAILURE,

	/* For Social Login */
	SOCIAL_LOGIN,
	SOCIAL_LOGIN_SUCCESS,
	SOCIAL_LOGIN_FAILURE,

	// For Social Profile Login
	SOCIAL_FACEBOOK_LOGIN,
	SOCIAL_FACEBOOK_LOGIN_SUCCESS,
	SOCIAL_FACEBOOK_LOGIN_FAILURE,

} from '../ActionTypes'
import { action } from '../GlobalActions';

/**
 * Redux Action for Social Login
 */
export function socialLogin(payload) {
	return action(SOCIAL_LOGIN, { payload })
}
/**
 * Redux Action for Social Login Success
 */
export function socialLoginSuccess(data) {
	return action(SOCIAL_LOGIN_SUCCESS, { data })
}
/**
 * Redux Action for Social Login Failure
 */ 
export function socialLoginFailure() {
	return action(SOCIAL_LOGIN_FAILURE)
}

/**
 * Redux Action for Social Facebook Login
 */
export function socialFacebookLogin(payload) {
	return action(SOCIAL_FACEBOOK_LOGIN, { payload })
}
/**
 * Redux Action for Social Facebook Login Success
 */
export function socialFacebookLoginSuccess(data) {
	return action(SOCIAL_FACEBOOK_LOGIN_SUCCESS, { data })
}
/**
 * Redux Action for Social Facebook Login Failure
 */
export function socialFacebookLoginFailure() {
	return action(SOCIAL_FACEBOOK_LOGIN_FAILURE)
}

/**
 * Redux Action To Normal Login
 */
export const normalLogin = (data) => ({
	type: NORMAL_LOGIN,
	payload: data
});

/**
* Redux Action To Normal Login Success
*/
export const normalLoginSuccess = (data) => ({
	type: NORMAL_LOGIN_SUCCESS,
	payload: data
});

/**
* Redux Action To Normal Login Failure
*/
export const normalLoginFailure = (error) => ({
	type: NORMAL_LOGIN_FAILURE,
	payload: error
});


/**
 * Redux Action To SignIn with Email
 */
export const signInWithEmail = (data) => ({
	type: SIGNIN_WITH_EMAIL,
	payload: data
});

/**
* Redux Action To SignIn with Email Success
*/
export const signInWithEmailSuccess = (data) => ({
	type: SIGNIN_WITH_EMAIL_SUCCESS,
	payload: data
});

/**
* Redux Action To SignIn with Email Failure
*/
export const signInWithEmailFailure = (error) => ({
	type: SIGNIN_WITH_EMAIL_FAILURE,
	payload: error
});

/**
* Redux Action To SignIn Email Resend OTP
*/
export const signInEmailResendOTP = (data) => ({
	type: SIGNIN_EMAIL_RESEND_OTP,
	payload: data
});

/**
* Redux Action To SignIn Email Resend OTP Success
*/
export const signInEmailResendSuccess = (data) => ({
	type: SIGNIN_EMAIL_RESEND_OTP_SUCCESS,
	payload: data
});

/**
* Redux Action To SignIn Email Resend OTP Failure
*/
export const signInEmailResendFailure = (error) => ({
	type: SIGNIN_EMAIL_RESEND_OTP_FAILURE,
	payload: error
});

/**
* Redux Action To SignIn Email Verify OTP
*/
export const signInEmailVerifyOTP = (data) => ({
	type: SIGNIN_EMAIL_VERIFY_OTP,
	payload: data
});

/**
* Redux Action To SignIn Email Verify OTP Success
*/
export const signInEmailVerifySuccess = (data) => ({
	type: SIGNIN_EMAIL_VERIFY_OTP_SUCCESS,
	payload: data
});

/**
* Redux Action To SignIn Email Verify OTP Failure
*/
export const signInEmailVerifyFailure = (error) => ({
	type: SIGNIN_EMAIL_VERIFY_OTP_FAILURE,
	payload: error
});


/**
 * Redux Action To SignIn with Mobile
 */
export const signInWithMobile = (data) => ({
	type: SIGNIN_WITH_MOBILE,
	payload: data
});

/**
* Redux Action To SignIn with Mobile Success
*/
export const signInWithMobileSuccess = (data) => ({
	type: SIGNIN_WITH_MOBILE_SUCCESS,
	payload: data
});

/**
* Redux Action To SignIn with Mobile Failure
*/
export const signInWithMobileFailure = (error) => ({
	type: SIGNIN_WITH_MOBILE_FAILURE,
	payload: error
});

/**
* Redux Action To SignIn Mobile Resend OTP
*/
export const signInMobileResendOTP = (data) => ({
	type: SIGNIN_MOBILE_RESEND_OTP,
	payload: data
});

/**
* Redux Action To SignIn Mobile Resend OTP Success
*/
export const signInMobileResendSuccess = (data) => ({
	type: SIGNIN_MOBILE_RESEND_OTP_SUCCESS,
	payload: data
});

/**
* Redux Action To SignIn Mobile Resend OTP Failure
*/
export const signInMobileResendFailure = (error) => ({
	type: SIGNIN_MOBILE_RESEND_OTP_FAILURE,
	payload: error
});

/**
* Redux Action To SignIn Mobile Verify OTP
*/
export const signInMobileVerifyOTP = (data) => ({
	type: SIGNIN_MOBILE_VERIFY_OTP,
	payload: data
});

/**
* Redux Action To SignIn Mobile Verify OTP Success
*/
export const signInMobileVerifySuccess = (data) => ({
	type: SIGNIN_MOBILE_VERIFY_OTP_SUCCESS,
	payload: data
});

/**
* Redux Action To SignIn Mobile Verify OTP Failure
*/
export const signInMobileVerifyFailure = (error) => ({
	type: SIGNIN_MOBILE_VERIFY_OTP_FAILURE,
	payload: error
});

/**
 * Redux Action 2FA Google Authentication Success
 */
export const twoFAGoogleAuthenticationSuccess = data => ({
	type: TWO_FA_GOOGLE_AUTHENTICATION_SUCCESS,
	payload: data
});

/**
 * Redux Action 2FA Google Authentication Failure
 */
export const twoFAGoogleAuthenticationFailure = error => ({
	type: TWO_FA_GOOGLE_AUTHENTICATION_FAILURE,
	payload: error
});

/**
 * Redux Action To 2FA Google Authentication
 */
export const twoFAGoogleAuthentication = (verifyCodeRequest) => ({
	type: TWO_FA_GOOGLE_AUTHENTICATION,
	verifyCodeRequest: verifyCodeRequest,
});