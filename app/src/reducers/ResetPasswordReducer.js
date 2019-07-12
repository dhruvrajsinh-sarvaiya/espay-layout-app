// Action types for Reset Password 
import {

	//For Change Password
	CHANGE_PASSWORD,
	CHANGE_PASSWORD_SUCCESS,
	CHANGE_PASSWORD_FAILURE,
	// Action Logout
	ACTION_LOGOUT

} from '../actions/ActionTypes'

// Initial state for Reset Password
const initialState = {
	// Change Password
	changepassword: [],
	loading: false
};

export default (state, action) => {

	//If state is undefine then return with initial state
	if (typeof state === 'undefined') {
		return initialState;
	}

	switch (action.type) {

		// To reset initial state on logout
		case ACTION_LOGOUT: {
			return initialState;
		}

		// Handle change password method data
		case CHANGE_PASSWORD:
			return { ...state, loading: true };
		// Set change password success data
		case CHANGE_PASSWORD_SUCCESS:
			return { ...state, loading: false, changepassword: action.payload };
		// Set change password failure data
		case CHANGE_PASSWORD_FAILURE:
			return { ...state, loading: false };

		// If no actions were found from reducer than return default [existing] state value
		default:
			return state;
	}
};