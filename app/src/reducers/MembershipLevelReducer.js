// Action types for Membership Level Module
import {
	// Memebership level
	GET_MEMBERSHIP_LEVEL,
	GET_MEMBERSHIP_LEVEL_SUCCESS,
	GET_MEMBERSHIP_LEVEL_FAILURE,

	// Action Logout
	ACTION_LOGOUT,
} from "../actions/ActionTypes";

// Initial State For Membership Level
const INITIAL_STATE = {
	// Membership Level
	MembershipLevelFetchData: true,
	MembershipLevelData: '',
	Loading: false,
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {

		// To reset initial state on logout
		case ACTION_LOGOUT:
			return INITIAL_STATE;

		// Handle membership level method data
		case GET_MEMBERSHIP_LEVEL:
			return {
				...state,
				Loading: true,
				MembershipLevelData: '',
				MembershipLevelFetchData: true
			};
		// Set membership level success data
		case GET_MEMBERSHIP_LEVEL_SUCCESS:
			return {
				...state,
				Loading: false,
				MembershipLevelData: action.payload,
				MembershipLevelFetchData: false
			};
		// Set membership level failure data
		case GET_MEMBERSHIP_LEVEL_FAILURE:
			return {
				...state,
				Loading: false,
				MembershipLevelData: action.error,
				MembershipLevelFetchData: false
			};

		// If no actions were found from reducer than return default [existing] state value
		default:
			return state;
	}
};
