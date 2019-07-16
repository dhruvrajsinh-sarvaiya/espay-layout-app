import {
	// Device History
	DEVICEHISTORY_FETCH,
	DEVICEHISTORY_SUCCESS,
	DEVICEHISTORY_FAILURE,

	// Delete Device Whitelist
	DELETE_DEVICE_WHITELIST,
	DELETE_DEVICE_WHITELIST_SUCCESS,
	DELETE_DEVICE_WHITELIST_FAILURE,

	// Disable Device Whitelist
	DISABLE_DEVICE_WHITELIST,
	DISABLE_DEVICE_WHITELIST_SUCCESS,
	DISABLE_DEVICE_WHITELIST_FAILURE,

	// Enable Device Whitelist
	ENABLE_DEVICE_WHITELIST,
	ENABLE_DEVICE_WHITELIST_SUCCESS,
	ENABLE_DEVICE_WHITELIST_FAILURE,

	// Clear Device Whitelist Data
	CLEAR_DEVICE_WHITELIST_DATA,
} from '../ActionTypes'
import { action } from '../GlobalActions';

// Redux action to Device Whitelist
export function DeviceHistoryFatchData(payload) {
	return action(DEVICEHISTORY_FETCH, { payload });
}
// Redux action to Device Whitelist Success
export function deviceWhiteListSuccess(data) {
	return action(DEVICEHISTORY_SUCCESS, { data });
}
// Redux action to Device Whitelist Failure
export function deviceWhiteListFailure(error) {
	return action(DEVICEHISTORY_FAILURE, { error });
}

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

// Clear Device whitelist data
export function clearDeviceWhitelistData() {
	return action(CLEAR_DEVICE_WHITELIST_DATA)
}