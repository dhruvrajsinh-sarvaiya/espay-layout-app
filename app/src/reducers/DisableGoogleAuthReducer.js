// Action type for Disable Google Authentication
import {
	DISABLE_GOOGLE_AUTH,
	DISABLE_GOOGLE_AUTH_SUCCESS,
	DISABLE_GOOGLE_AUTH_FAILURE,
	ACTION_LOGOUT
} from "../actions/ActionTypes";

// Initial state for Disable Google Authentication
const INITIAL_STATE = {
	//For Disable Google Auth
	DisableGoogleAuthFetchData: true,
	DisableGoogleAuthData: '',
	DisableGoogleAuthIsFetching: false
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		// To reset initial state on logout
		case ACTION_LOGOUT:
			return INITIAL_STATE;

		// Handle disable google auth method data
		case DISABLE_GOOGLE_AUTH:
			return { ...state, DisableGoogleAuthIsFetching: true, DisableGoogleAuthData: '', DisableGoogleAuthFetchData: true };
		// Set disable google auth success data
		case DISABLE_GOOGLE_AUTH_SUCCESS:
			return { ...state, DisableGoogleAuthIsFetching: false, DisableGoogleAuthData: action.payload, DisableGoogleAuthFetchData: false };
		// Set disable google auth failure data
		case DISABLE_GOOGLE_AUTH_FAILURE:
			return { ...state, DisableGoogleAuthIsFetching: false, DisableGoogleAuthData: action.payload, DisableGoogleAuthFetchData: false };

		// If no actions were found from reducer than return default [existing] state value
		default:
			return { ...state };
	}
};