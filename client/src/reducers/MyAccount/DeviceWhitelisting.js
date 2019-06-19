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

	//For Add Device Whitelist
	ADD_DEVICE_WHITELIST,
	ADD_DEVICE_WHITELIST_SUCCESS,
	ADD_DEVICE_WHITELIST_FAILURE,

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
const INIT_STATE = {
	data: [],
	addData:[],
	loading: false,
	add_loading : false,
	ext_flag: false
};

export default (state = INIT_STATE, action) => {
	switch (action.type) {
		//For Device Whitelist
		case LIST_DEVICE_WHITELIST:
			return { ...state, loading: true, ext_flag : false, data: '' };

		case LIST_DEVICE_WHITELIST_SUCCESS:
			return { ...state, loading: false, data: action.payload };

		case LIST_DEVICE_WHITELIST_FAILURE:
			return { ...state, loading: false, data: action.payload };

		//For Add Device Whitelist
		case ADD_DEVICE_WHITELIST:
			return { ...state, add_loading: true, addData : '' };

		case ADD_DEVICE_WHITELIST_SUCCESS:
			return { ...state, add_loading: false, addData: action.payload };

		case ADD_DEVICE_WHITELIST_FAILURE:
			return { ...state, add_loading: false, addData: action.payload };

		//For Delete Device Whitelist
		case DELETE_DEVICE_WHITELIST:
			return { ...state, loading: true, data : '' };

		case DELETE_DEVICE_WHITELIST_SUCCESS:
			return { ...state, loading: false, data: action.payload, ext_flag : true };

		case DELETE_DEVICE_WHITELIST_FAILURE:
			return { ...state, loading: false, data: action.payload, ext_flag : true };

		//For Disable Device Whitelist
		case DISABLE_DEVICE_WHITELIST:
			return { ...state, loading: true, data : '' };

		case DISABLE_DEVICE_WHITELIST_SUCCESS:
			return { ...state, loading: false, data: action.payload, ext_flag : true };

		case DISABLE_DEVICE_WHITELIST_FAILURE:
			return { ...state, loading: false, data: action.payload, ext_flag : true };

		//For Enable Device Whitelist
		case ENABLE_DEVICE_WHITELIST:
			return { ...state, loading: true, data : '' };

		case ENABLE_DEVICE_WHITELIST_SUCCESS:
			return { ...state, loading: false, data: action.payload, ext_flag : true };

		case ENABLE_DEVICE_WHITELIST_FAILURE:
			return { ...state, loading: false, data: action.payload, ext_flag : true };

		default:
			return { ...state };
	}
};