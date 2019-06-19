/**
 * Auther : Kevin Ladani
 * Created : 11/10/2018
 * Updated : 23/10/2018 (Salim Deraiya)
 * IP Whitelisting Reducers
 */

import {

	//For IP Whitelist
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

} from "Actions/types";

/**
 * initial IP Whitelist
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
		//For IP Whitelist
		case LIST_IP_WHITELIST:
			return { ...state, loading: true, ext_flag : false, data: '' };

		case LIST_IP_WHITELIST_SUCCESS:
			return { ...state, loading: false, data: action.payload };

		case LIST_IP_WHITELIST_FAILURE:
			return { ...state, loading: false, data: action.payload };

		//For Add IP to Whitelist
		case ADD_IP_TO_WHITELIST:
			return { ...state, add_loading: true, addData : '' };

		case ADD_IP_TO_WHITELIST_SUCCESS:
			return { ...state, add_loading: false, addData: action.payload };

		case ADD_IP_TO_WHITELIST_FAILURE:
			return { ...state, add_loading: false, addData: action.payload };

		//For Delete IP to Whitelist
		case DELETE_IP_TO_WHITELIST:
			return { ...state, loading: true, data : '' };

		case DELETE_IP_TO_WHITELIST_SUCCESS:
			return { ...state, loading: false, data: action.payload, ext_flag : true };

		case DELETE_IP_TO_WHITELIST_FAILURE:
			return { ...state, loading: false, data: action.payload, ext_flag : true };

		//For Disable IP to Whitelist
		case DISABLE_IP_TO_WHITELIST:
			return { ...state, loading: true, data : '' };

		case DISABLE_IP_TO_WHITELIST_SUCCESS:
			return { ...state, loading: false, data: action.payload, ext_flag : true };

		case DISABLE_IP_TO_WHITELIST_FAILURE:
			return { ...state, loading: false, data: action.payload, ext_flag : true };

		//For Enable IP to Whitelist
		case ENABLE_IP_TO_WHITELIST:
			return { ...state, loading: true, data : '' };

		case ENABLE_IP_TO_WHITELIST_SUCCESS:
			return { ...state, loading: false, data: action.payload, ext_flag : true };

		case ENABLE_IP_TO_WHITELIST_FAILURE:
			return { ...state, loading: false, data: action.payload, ext_flag : true };

		default:
			return { ...state };
	}
};