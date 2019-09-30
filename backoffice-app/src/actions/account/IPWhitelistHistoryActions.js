import {
	//For IP WhiteList
	LIST_IP_WHITELIST,
	LIST_IP_WHITELIST_SUCCESS,
	LIST_IP_WHITELIST_FAILURE,

	//For Add IP to WhiteList
	ADD_IP_TO_WHITELIST,
	ADD_IP_TO_WHITELIST_SUCCESS,
	ADD_IP_TO_WHITELIST_FAILURE,

	//For Delete IP to WhiteList
	DELETE_IP_TO_WHITELIST,
	DELETE_IP_TO_WHITELIST_SUCCESS,
	DELETE_IP_TO_WHITELIST_FAILURE,

	//For Update IP To Whitelist
	UPDATE_IP_TO_WHITELIST,
	UPDATE_IP_TO_WHITELIST_SUCCESS,
	UPDATE_IP_TO_WHITELIST_FAILURE,
	DISABLE_IP_TO_WHITELIST,
	DISABLE_IP_TO_WHITELIST_SUCCESS,
	DISABLE_IP_TO_WHITELIST_FAILURE,
	ENABLE_IP_TO_WHITELIST,
	ENABLE_IP_TO_WHITELIST_FAILURE,
	ENABLE_IP_TO_WHITELIST_SUCCESS,
	CLEAR_IP_WHITELIST_DATA

} from '../ActionTypes';

//For IP WhiteList
/**
 * Redux Action To IP WhiteList
 */
export const listIPWhitelist = (data) => ({
	type: LIST_IP_WHITELIST,
	payload: data
});

/**
 * Redux Action To IP WhiteList Success
 */
export const listIPWhitelistSuccess = (data) => ({
	type: LIST_IP_WHITELIST_SUCCESS,
	payload: data
});

/**
 * Redux Action To IP WhiteList Failure
 */
export const listIPWhitelistFailure = (error) => ({
	type: LIST_IP_WHITELIST_FAILURE,
	payload: error
});

//For Add IP To WhiteList
/**
 * Redux Action To Add IP To WhiteList
 */
export const AddIPToWhitelist = (data) => ({
	type: ADD_IP_TO_WHITELIST,
	payload: data
});

/**
 * Redux Action To Add IP To WhiteList Success
 */
export const AddIPToWhitelistSuccess = (data) => ({
	type: ADD_IP_TO_WHITELIST_SUCCESS,
	payload: data
});

/**
 * Redux Action To Add IP To WhiteList Failure
 */
export const AddIPToWhitelistFailure = (error) => ({
	type: ADD_IP_TO_WHITELIST_FAILURE,
	payload: error
});


//For Delete IP To WhiteList
/**
 * Redux Action To Delete IP To WhiteList
 */
export const DeleteIPToWhitelist = (data) => ({
	type: DELETE_IP_TO_WHITELIST,
	payload: data
});

/**
 * Redux Action To Delete IP To WhiteList Success
 */
export const DeleteIPToWhitelistSuccess = (data) => ({
	type: DELETE_IP_TO_WHITELIST_SUCCESS,
	payload: data
});

/**
 * Redux Action To Delete IP To WhiteList Failure
 */
export const DeleteIPToWhitelistFailure = (error) => ({
	type: DELETE_IP_TO_WHITELIST_FAILURE,
	payload: error
});

//For Update IP To WhiteList
/**
 * Redux Action To Update IP To WhiteList
 */
export const UpdateIPToWhitelist = (data) => ({
	type: UPDATE_IP_TO_WHITELIST,
	payload: data
});

/**
 * Redux Action To Update IP To WhiteList Success
 */
export const UpdateIPToWhitelistSuccess = (data) => ({
	type: UPDATE_IP_TO_WHITELIST_SUCCESS,
	payload: data
});

/**
 * Redux Action To Update IP To WhiteList Failure
 */
export const UpdateIPToWhitelistFailure = (error) => ({
	type: UPDATE_IP_TO_WHITELIST_FAILURE,
	payload: error
});

/**
 * Redux Action To Update IP To WhiteList
 */
export const disableIptoWhitelist = (data) => ({
	type: DISABLE_IP_TO_WHITELIST,
	payload: data
});

/**
 * Redux Action To Update IP To WhiteList Success
 */
export const disableIptoWhitelistSuccess = (data) => ({
	type: DISABLE_IP_TO_WHITELIST_SUCCESS,
	payload: data
});

/**
 * Redux Action To Update IP To WhiteList Failure
 */
export const disableIptoWhitelistFailure = (error) => ({
	type: DISABLE_IP_TO_WHITELIST_FAILURE,
	payload: error
});

/**
 * Redux Action To Update IP To WhiteList
 */
export const enableIptoWhitelist = (data) => ({
	type: ENABLE_IP_TO_WHITELIST,
	payload: data
});

/**
 * Redux Action To Update IP To WhiteList Success
 */
export const enableIptoWhitelistSuccess = (data) => ({
	type: ENABLE_IP_TO_WHITELIST_SUCCESS,
	payload: data
});

/**
 * Redux Action To Update IP To WhiteList Failure
 */
export const enableIptoWhitelistFailure = (error) => ({
	type: ENABLE_IP_TO_WHITELIST_FAILURE,
	payload: error
});

/**
 * Redux Action To Clear IP To WhiteList 
 */
export const clearIpToWhitelist = () => ({
	type: CLEAR_IP_WHITELIST_DATA,
});