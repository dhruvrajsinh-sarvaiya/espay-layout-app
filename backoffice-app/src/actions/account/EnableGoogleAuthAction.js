import {

	//For Enable Google Auth
	ENABLE_GOOGLE_AUTH,
	ENABLE_GOOGLE_AUTH_SUCCESS,
	ENABLE_GOOGLE_AUTH_FAILURE,

	//Get Google Auth Info
	GET_GOOGLE_AUTH_INFO,
	GET_GOOGLE_AUTH_INFO_SUCCESS,
	GET_GOOGLE_AUTH_INFO_FAILURE

} from "../ActionTypes";

//For Enable Google Auth
/**
 * Redux Action To Enable Google Auth
 */
export const enableGoogleAuth = (enableGoogleAuthRequest) => ({
	type: ENABLE_GOOGLE_AUTH,
	enableGoogleAuthRequest: enableGoogleAuthRequest,
});

/**
 * Redux Action To Enable Google Auth
 */
export const enableGoogleAuthSuccess = (data) => ({
	type: ENABLE_GOOGLE_AUTH_SUCCESS,
	payload: data
});

/**
 * Redux Action To Enable Google Auth
 */
export const enableGoogleAuthFailure = (error) => ({
	type: ENABLE_GOOGLE_AUTH_FAILURE,
	payload: error
});

//Added by salim dt:22/10/2018...
//For Get Google Auth Info
/**
 * Redux Action To Get Google Auth Info
 */
export const getGoogleAuthInfo = () => ({
	type: GET_GOOGLE_AUTH_INFO,
});

/**
 * Redux Action To Get Google Auth Info Success
 */
export const getGoogleAuthInfoSuccess = (data) => ({
	type: GET_GOOGLE_AUTH_INFO_SUCCESS,
	payload: data
});

/**
 * Redux Action To Get Google Auth Info Failure 
 */
export const getGoogleAuthInfoFailure = (error) => ({
	type: GET_GOOGLE_AUTH_INFO_FAILURE,
	payload: error
});