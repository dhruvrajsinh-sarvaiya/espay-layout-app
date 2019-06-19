/**
 * Auther : Kevin Ladani
 * Created : 14/09/2018
 * Membership Level Reducer
 */

import {

	//For Membership Level
	MEMBERSHIP_LEVEL,
	MEMBERSHIP_LEVEL_SUCCESS,
	MEMBERSHIP_LEVEL_FAILURE,

} from "Actions/types";

/**
 * initial Membership Level
 */
const INIT_STATE = {
	data: [],
	loading: false
};

export default (state = INIT_STATE, action) => {
	switch (action.type) {
		//For Membership Level
		case MEMBERSHIP_LEVEL:
			return { ...state, loading: true };

		case MEMBERSHIP_LEVEL_SUCCESS:
			return { ...state, loading: false, data: action.payload };

		case MEMBERSHIP_LEVEL_FAILURE:
			return { ...state, loading: false, data: action.payload };

		default:
			return { ...state };
	}
};