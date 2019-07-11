/**
 * Auther : Kevin Ladani
 * Created : 03/10/2018
 * Device WhiteListing Actions
 */

 //Import action types form type.js
 import {
    //For Device WhiteListing
    LIST_DEVICE_WHITELIST,
    LIST_DEVICE_WHITELIST_SUCCESS,
    LIST_DEVICE_WHITELIST_FAILURE,

	//For Add Device WhiteList
	ADD_DEVICE_WHITELIST,
	ADD_DEVICE_WHITELIST_SUCCESS,
	ADD_DEVICE_WHITELIST_FAILURE,

	//For Delete Device WhiteList
	DELETE_DEVICE_WHITELIST,
	DELETE_DEVICE_WHITELIST_SUCCESS,
	DELETE_DEVICE_WHITELIST_FAILURE,

	//For Disable Device WhiteList
	DISABLE_DEVICE_WHITELIST,
	DISABLE_DEVICE_WHITELIST_SUCCESS,
	DISABLE_DEVICE_WHITELIST_FAILURE,

	//For Enable Device WhiteList
	ENABLE_DEVICE_WHITELIST,
	ENABLE_DEVICE_WHITELIST_SUCCESS,
	ENABLE_DEVICE_WHITELIST_FAILURE
   
} from '../types';



/**
 * Redux Action To Device List
 */
export const deviceWhiteList = (data) => ({
    type: LIST_DEVICE_WHITELIST,
	payload : data
});

/**
 * Redux Action Device List Success
 */
export const deviceWhiteListSuccess = (list) => ({
    type: LIST_DEVICE_WHITELIST_SUCCESS,
    payload: list
});

/**
 * Redux Action Device List Failure
 */
export const deviceWhiteListFailure = (error) => ({
    type: LIST_DEVICE_WHITELIST_FAILURE,
    payload: error
});

//For Add Device List
/**
 * Redux Action To Add Device List
 */
export const addDeviceWhiteList = (data) => ({
	type: ADD_DEVICE_WHITELIST,
	payload: data
});

/**
 * Redux Action To Add Device List Success
 */
export const addDeviceWhiteListSuccess = (data) => ({
	type: ADD_DEVICE_WHITELIST_SUCCESS,
	payload: data
});

/**
 * Redux Action To Add Device List Failure
 */
export const addDeviceWhiteListFailure = (error) => ({
	type: ADD_DEVICE_WHITELIST_FAILURE,
	payload: error
});


//For Delete Device List
/**
 * Redux Action To Delete Device List
 */
export const deleteDeviceWhiteList = (data) => ({
	type: DELETE_DEVICE_WHITELIST,
	payload: data
});

/**
 * Redux Action To Delete Device List Success
 */
export const deleteDeviceWhiteListSuccess = (data) => ({
	type: DELETE_DEVICE_WHITELIST_SUCCESS,
	payload: data
});

/**
 * Redux Action To Delete Device List Failure
 */
export const deleteDeviceWhiteListFailure = (error) => ({
	type: DELETE_DEVICE_WHITELIST_FAILURE,
	payload: error
});

//For Disable Device List
/**
 * Redux Action To Disable Device List
 */
export const disableDeviceWhiteList = (data) => ({
	type: DISABLE_DEVICE_WHITELIST,
	payload: data
});

/**
 * Redux Action To Disable Device List Success
 */
export const disableDeviceWhiteListSuccess = (data) => ({
	type: DISABLE_DEVICE_WHITELIST_SUCCESS,
	payload: data
});

/**
 * Redux Action To Disable Device List Failure
 */
export const disableDeviceWhiteListFailure = (error) => ({
	type: DISABLE_DEVICE_WHITELIST_FAILURE,
	payload: error
});

//For Enable Device List
/**
 * Redux Action To Enable Device List
 */
export const enableDeviceWhiteList = (data) => ({
	type: ENABLE_DEVICE_WHITELIST,
	payload: data
});

/**
 * Redux Action To Enable Device List Success
 */
export const enableDeviceWhiteListSuccess = (data) => ({
	type: ENABLE_DEVICE_WHITELIST_SUCCESS,
	payload: data
});

/**
 * Redux Action To Enable Device List Failure
 */
export const enableDeviceWhiteListFailure = (error) => ({
	type: ENABLE_DEVICE_WHITELIST_FAILURE,
	payload: error
});