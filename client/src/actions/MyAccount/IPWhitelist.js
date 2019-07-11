/**
 * Auther : Kevin Ladani
 * Created : 11/10/2018
 * Updated : 23/10/2018 (Salim Deraiya)
 * IP Whitelisting Actions
 */

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

	//For Disable IP to WhiteList
	DISABLE_IP_TO_WHITELIST,
	DISABLE_IP_TO_WHITELIST_SUCCESS,
	DISABLE_IP_TO_WHITELIST_FAILURE,

	//For Enable IP to WhiteList
	ENABLE_IP_TO_WHITELIST,
	ENABLE_IP_TO_WHITELIST_SUCCESS,
	ENABLE_IP_TO_WHITELIST_FAILURE
} from "../types";

//For IP WhiteList
/**
 * Redux Action To IP WhiteList
 */
export const listIPWhitelist = (data) => ({
	type: LIST_IP_WHITELIST,
	payload : data
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

//For Disable IP To WhiteList
/**
 * Redux Action To Disable IP To WhiteList
 */
export const disableIPWhitelist = (data) => ({
	type: DISABLE_IP_TO_WHITELIST,
	payload: data
});

/**
 * Redux Action To Disable IP To WhiteList Success
 */
export const disableIPWhitelistSuccess = (data) => ({
	type: DISABLE_IP_TO_WHITELIST_SUCCESS,
	payload: data
});

/**
 * Redux Action To Disable IP To WhiteList Failure
 */
export const disableIPWhitelistFailure = (error) => ({
	type: DISABLE_IP_TO_WHITELIST_FAILURE,
	payload: error
});

//For Enable IP To WhiteList
/**
 * Redux Action To Enable IP To WhiteList
 */
export const enableIPWhitelist = (data) => ({
	type: ENABLE_IP_TO_WHITELIST,
	payload: data
});

/**
 * Redux Action To Enable IP To WhiteList Success
 */
export const enableIPWhitelistSuccess = (data) => ({
	type: ENABLE_IP_TO_WHITELIST_SUCCESS,
	payload: data
});

/**
 * Redux Action To Enable IP To WhiteList Failure
 */
export const enableIPWhitelistFailure = (error) => ({
	type: ENABLE_IP_TO_WHITELIST_FAILURE,
	payload: error
});