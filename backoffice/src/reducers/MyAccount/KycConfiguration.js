/**
 * Auther : Salim Deraiya
 * Created : 27/12/2018
 * KYC Configuration Reducers Method
 */

import {
	//For Add KYC Document Config
	KYC_ADD_DOCUMENT_CONFIG,
	KYC_ADD_DOCUMENT_CONFIG_SUCCESS,
	KYC_ADD_DOCUMENT_CONFIG_FAILURE,

	//For Edit KYC Document Config
	KYC_EDIT_DOCUMENT_CONFIG,
	KYC_EDIT_DOCUMENT_CONFIG_SUCCESS,
	KYC_EDIT_DOCUMENT_CONFIG_FAILURE,

	//For Add User KYC Document Config
	USER_ADD_KYC_DOCUMENT_CONFIG,
	USER_ADD_KYC_DOCUMENT_CONFIG_SUCCESS,
	USER_ADD_KYC_DOCUMENT_CONFIG_FAILURE,

	//For Edit User KYC Document Config
	USER_EDIT_KYC_DOCUMENT_CONFIG,
	USER_EDIT_KYC_DOCUMENT_CONFIG_SUCCESS,
	USER_EDIT_KYC_DOCUMENT_CONFIG_FAILURE,

	//For List KYC Config
	KYC_LIST_CONFIG,
	KYC_LIST_CONFIG_SUCCESS,
	KYC_LIST_CONFIG_FAILURE,
} from "Actions/types";

/**
 * initial auth Kyc Verify
 */
const INIT_STATE = {
	docData: [],
	userDocData: [],
	listKyc: [],
	loading: false
};

export default (state = INIT_STATE, action) => {
	switch (action.type) {
		//Add KYC Document Config
		case KYC_ADD_DOCUMENT_CONFIG:
			return { ...state, loading: true, docData: '' };

		case KYC_ADD_DOCUMENT_CONFIG_SUCCESS:
			return { ...state, loading: false, docData: action.payload };

		case KYC_ADD_DOCUMENT_CONFIG_FAILURE:
			return { ...state, loading: false, docData: action.payload };

		//For Edit KYC Document Config
		case KYC_EDIT_DOCUMENT_CONFIG:
			return { ...state, loading: true, docData: '' };

		case KYC_EDIT_DOCUMENT_CONFIG_SUCCESS:
			return { ...state, loading: false, docData: action.payload };

		case KYC_EDIT_DOCUMENT_CONFIG_FAILURE:
			return { ...state, loading: false, docData: action.payload };

		//For Add User KYC Document Config
		case USER_ADD_KYC_DOCUMENT_CONFIG:
			return { ...state, loading: true, userDocData: '' };

		case USER_ADD_KYC_DOCUMENT_CONFIG_SUCCESS:
			return { ...state, loading: false, userDocData: action.payload };

		case USER_ADD_KYC_DOCUMENT_CONFIG_FAILURE:
			return { ...state, loading: false, userDocData: action.payload };

		//For Edit User KYC Document Config
		case USER_EDIT_KYC_DOCUMENT_CONFIG:
			return { ...state, loading: true, userDocData: '' };

		case USER_EDIT_KYC_DOCUMENT_CONFIG_SUCCESS:
			return { ...state, loading: false, userDocData: action.payload };

		case USER_EDIT_KYC_DOCUMENT_CONFIG_FAILURE:
			return { ...state, loading: false, userDocData: action.payload };

		//For List KYC Config
		case KYC_LIST_CONFIG:
			return { ...state, loading: true, listKyc: '' };

		case KYC_LIST_CONFIG_SUCCESS:
			return { ...state, loading: false, listKyc: action.payload };

		case KYC_LIST_CONFIG_FAILURE:
			return { ...state, loading: false, listKyc: action.payload };

		default:
			return { ...state };
	}
};