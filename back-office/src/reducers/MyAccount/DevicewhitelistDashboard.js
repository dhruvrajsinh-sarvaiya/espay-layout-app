/**
 * Auther : Kevin Ladani
 * Created : 11/10/2018
 * Updated : 23/10/2018 (Salim Deraiya)
 * Device Whitelist Reducers
 */

import {

	//For Device Whitelist
	LIST_DEVICE_WHITELIST,
	LIST_DEVICE_WHITELIST_SUCCESS,
	LIST_DEVICE_WHITELIST_FAILURE,

	//For Delete Device Whitelist
	DELETE_DEVICE_WHITELIST,
	DELETE_DEVICE_WHITELIST_SUCCESS,
	DELETE_DEVICE_WHITELIST_FAILURE,

	//For Disable Device Whitelist
	DISABLE_DEVICE_WHITELIST,
	DISABLE_DEVICE_WHITELIST_SUCCESS,
	DISABLE_DEVICE_WHITELIST_FAILURE,

	//For Enable Device Whitelist
	ENABLE_DEVICE_WHITELIST,
	ENABLE_DEVICE_WHITELIST_SUCCESS,
	ENABLE_DEVICE_WHITELIST_FAILURE

} from "Actions/types";

/**
 * initial Device Whitelist
 */
const INITIAL_STATE = {
	data: [],
	loading: false,
	ext_flag: false
};

export default (state, action) => {
	if (typeof state === 'undefined') {
		return INITIAL_STATE
	}
	switch (action.type) {
		//For Device Whitelist
		case LIST_DEVICE_WHITELIST:
			return { ...state, loading: true, ext_flag: false, data: '' };

		case LIST_DEVICE_WHITELIST_SUCCESS:
		case LIST_DEVICE_WHITELIST_FAILURE:
			return { ...state, loading: false, data: action.payload };

		//For Delete Device Whitelist
		case DELETE_DEVICE_WHITELIST:
		case ENABLE_DEVICE_WHITELIST:
		case DISABLE_DEVICE_WHITELIST:
			return { ...state, loading: true, data: '' };

		case DELETE_DEVICE_WHITELIST_SUCCESS:
		case DELETE_DEVICE_WHITELIST_FAILURE:
		case DISABLE_DEVICE_WHITELIST_SUCCESS:
		case DISABLE_DEVICE_WHITELIST_FAILURE:
		case ENABLE_DEVICE_WHITELIST_SUCCESS:
		case ENABLE_DEVICE_WHITELIST_FAILURE:
			return { ...state, loading: false, data: action.payload, ext_flag: true };

		default:
			return { ...state };
	}
};