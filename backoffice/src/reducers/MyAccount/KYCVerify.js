/**
 * Auther : Salim Deraiya
 * Created : 02/10/2018
 * UpdatedBy : Salim Deraiya 29/12/2018
 * Kyc Verify Reducer
 */

import {
	//For List Kyc Verify
	LIST_KYC_VERIFY,
	LIST_KYC_VERIFY_SUCCESS,
	LIST_KYC_VERIFY_FAILURE,

	//For Edit Kyc Verify
	EDIT_KYC_VERIFY,
	EDIT_KYC_VERIFY_SUCCESS,
	EDIT_KYC_VERIFY_FAILURE,

	//For Get Edit Kyc Verify By Id
	GET_KYC_VERIFY_BY_ID,
	GET_KYC_VERIFY_BY_ID_SUCCESS,
	GET_KYC_VERIFY_BY_ID_FAILURE
} from "Actions/types";

/**
 * initial auth Kyc Verify
 */
const INIT_STATE = {
	data: [],
	list: [],
	Loading: false
};

export default (state = INIT_STATE, action) => {
	switch (action.type) {
		//For List Kyc Verify
		case LIST_KYC_VERIFY:
			return { ...state, loading: true, list: [] };

		case LIST_KYC_VERIFY_SUCCESS:
			return { ...state, loading: false, list: action.payload };

		case LIST_KYC_VERIFY_FAILURE:
			return { ...state, loading: false, list: action.payload };

		//For Edit Kyc Verify
		case EDIT_KYC_VERIFY:
			return { ...state, loading: true };

		case EDIT_KYC_VERIFY_SUCCESS:
			return { ...state, loading: false, data: action.payload };

		case EDIT_KYC_VERIFY_FAILURE:
			return { ...state, loading: false, data: action.payload };

		//For Get Kyc Verify By Id
		case GET_KYC_VERIFY_BY_ID:
			return { ...state, loading: true };

		case GET_KYC_VERIFY_BY_ID_SUCCESS:
			return { ...state, loading: false, data: action.payload };

		case GET_KYC_VERIFY_BY_ID_FAILURE:
			return { ...state, loading: false, data: action.payload };

		default:
			return { ...state };
	}
};