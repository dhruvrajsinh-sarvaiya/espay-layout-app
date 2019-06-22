import {
	// GET GLOBAL PREFERENCE
	GET_PREFERENCE,
	GET_PREFERENCE_SUCCESS,
	GET_PREFERENCE_FAILURE,

	// SET GLOBAL PREFERENCE
	SET_PREFERENCE,
	SET_PREFERENCE_SUCCESS,
	SET_PREFERENCE_FAILURE,

	//add block
	SUBMIT_WITHDRAWALADDRESSES,
	SUBMIT_WITHDRAWALADDRESSES_SUCCESS,
	SUBMIT_WITHDRAWALADDRESSES_FAIL,

	//list
	FETCH_WITHDRAWALADDRESS,
	FETCH_WITHDRAWALADDRESS_SUCCESS,
	FETCH_WITHDRAWALADDRESS_FAIL,

	// add to whitelist
	ADDTO_WHITELIST,
	ADDTO_WHITELIST_SUCCESS,
	ADDTO_WHITELIST_FAILURE,

	// remove form whitelist
	REMOVE_WHITELIST,
	REMOVE_WHITELIST_SUCCESS,
	REMOVE_WHITELIST_FAILURE,

	// delete from whitelist
	DELETE_ADDRESSES,
	DELETE_ADDRESSES_SUCCESS,
	DELETE_ADDRESSES_FAILURE,

	//For veriofy 2FA
	VERIFY_2FA,
	VERIFY_2FA_FAILURE,
	VERIFY_2FA_SUCCESS,

} from '../ActionTypes';

// Redux action to GET PREFERENCE
export const getPreference = () => ({
	type: GET_PREFERENCE
});

// Redux action to GET PREFERENCE Success
export const getPreferenceSuccess = (response) => ({
	type: GET_PREFERENCE_SUCCESS,
	payload: response
});

// Redux action to GET PREFERENCE Failure
export const getPreferenceFailure = (error) => ({
	type: GET_PREFERENCE_FAILURE,
	payload: error
});

// Redux action to SET PREFERENCE
export const setPreference = (setPrefRequest) => ({
	type: SET_PREFERENCE,
	payload: setPrefRequest
});

// Redux action to SET PREFERENCE Success
export const setPreferenceSuccess = (response) => ({
	type: SET_PREFERENCE_SUCCESS,
	payload: response
});

// Redux action to SET PREFERENCE Failure
export const setPreferenceFailure = (error) => ({
	type: SET_PREFERENCE_FAILURE,
	payload: error
});

// Redux action to Submit Withdrawal Address
export const onSubmitWhithdrawalAddress = (addBeneRequest) => ({
	type: SUBMIT_WITHDRAWALADDRESSES,
	payload: addBeneRequest
});

// Redux action to Submit Withdrawal Address Success
export const onSubmitWhithdrawalAddressSuccess = (response) => ({
	type: SUBMIT_WITHDRAWALADDRESSES_SUCCESS,
	payload: response
});
// Redux action to Submit Withdrawal Address Failure
export const onSubmitWhithdrawalAddressFail = (error) => ({
	type: SUBMIT_WITHDRAWALADDRESSES_FAIL,
	payload: error
});

// Redux action to Get All Withdrawal Address
export const getAllWhithdrawalAddress = () => ({
	type: FETCH_WITHDRAWALADDRESS
});

// Redux action to Get All Withdrawal Address Success
export const getAllWhithdrawalAddressSuccess = (response) => ({
	type: FETCH_WITHDRAWALADDRESS_SUCCESS,
	payload: response
});

// Redux action to Get All Withdrawal Address Failure
export const getAllWhithdrawalAddressFail = (error) => ({
	type: FETCH_WITHDRAWALADDRESS_FAIL,
	payload: error
});

// Redux action to Add To Whitelist
export const addToWhitelist = (addWhiteListRequest) => ({
	type: ADDTO_WHITELIST,
	payload: addWhiteListRequest
});

// Redux action to Add To Whitelist Success
export const addToWhitelistSuccess = (response) => ({
	type: ADDTO_WHITELIST_SUCCESS,
	payload: response
});

// Redux action to Add To Whitelist Failure
export const addToWhitelistFailure = (error) => ({
	type: ADDTO_WHITELIST_FAILURE,
	payload: error
});

// Redux action to Remove from Whitelist 
export const removeWhitelist = (removeWhiteListRequest) => ({
	type: REMOVE_WHITELIST,
	payload: removeWhiteListRequest
});

// Redux action to Remove from Whitelist Success
export const removeWhitelistSuccess = (response) => ({
	type: REMOVE_WHITELIST_SUCCESS,
	payload: response
});

// Redux action to Remove from Whitelist failure
export const removeWhitelistFailure = (error) => ({
	type: REMOVE_WHITELIST_FAILURE,
	payload: error
});

// Redux action to Delete Address
export const deleteAddress = (deleteWhiteListRequest) => ({
	type: DELETE_ADDRESSES,
	payload: deleteWhiteListRequest
});

// Redux action to Delete Address Success
export const deleteAddressSuccess = (response) => ({
	type: DELETE_ADDRESSES_SUCCESS,
	payload: response
});

// Redux action to Delete Address Failure
export const deleteAddressFailure = (error) => ({
	type: DELETE_ADDRESSES_FAILURE,
	payload: error
});

/**
 * Redux Action 2FA Google Authentication Success
 */
export const twoFAGoogleAuthenticationSuccess = data => ({
	type: VERIFY_2FA_SUCCESS,
	payload: data
});

/**
 * Redux Action 2FA Google Authentication Failure
 */
export const twoFAGoogleAuthenticationFailure = error => ({
	type: VERIFY_2FA_FAILURE,
	payload: error
});

/**
 * Redux Action To 2FA Google Authentication
 */
export const twoFAGoogleAuthentication = (verifyCodeRequest) => ({
	type: VERIFY_2FA,
	verifyCodeRequest: verifyCodeRequest,
});