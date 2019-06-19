/**
 * Auther : Kevin Ladani
 * Created : 08/10/2018
 * Updated : 22/10/2018 (Salim Deraiya)
 * Disable SMS Auth Sagas
 */

import {
	//For Enable Google Auth
	ENABLE_GOOGLE_AUTH,
	ENABLE_GOOGLE_AUTH_SUCCESS,
	ENABLE_GOOGLE_AUTH_FAILURE,

	//Get Google Auth Info
	GET_GOOGLE_AUTH_INFO,
	GET_GOOGLE_AUTH_INFO_SUCCESS,
	GET_GOOGLE_AUTH_INFO_FAILURE
} from "Actions/types";

/**
 * initial auth user
 */
const INIT_STATE = {
	data: [],
	loading: false
};

export default (state = INIT_STATE, action) => {
	switch (action.type) {
		//For Enable Google Auth
		case ENABLE_GOOGLE_AUTH:
			return { ...state, loading: true, data : '' };

		case ENABLE_GOOGLE_AUTH_SUCCESS:
			return { ...state, loading: false, data: action.payload };

		case ENABLE_GOOGLE_AUTH_FAILURE:
			return { ...state, loading: false, data : action.payload };

		//For Get Google Auth
		case GET_GOOGLE_AUTH_INFO:
			return { ...state, loading: true, data : '' };

		case GET_GOOGLE_AUTH_INFO_SUCCESS:
			return { ...state, loading: false, data: action.payload };

		case GET_GOOGLE_AUTH_INFO_FAILURE:
			return { ...state, loading: false, data : action.payload };

		default:
			return { ...state };
	}
};  