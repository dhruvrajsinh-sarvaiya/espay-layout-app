// Action type for Eanble Google Authentication
import {
	//For Enable Google Auth
	ENABLE_GOOGLE_AUTH,
	ENABLE_GOOGLE_AUTH_SUCCESS,
	ENABLE_GOOGLE_AUTH_FAILURE,

	//Get Google Auth Info
	GET_GOOGLE_AUTH_INFO,
	GET_GOOGLE_AUTH_INFO_SUCCESS,
	GET_GOOGLE_AUTH_INFO_FAILURE,
	ACTION_LOGOUT
} from "../actions/ActionTypes";

// Initial state for Enable Google Authentication
const INITIAL_STATE = {

	//For Get Auth Key
	GetAuthKeyFetchData: true,
	GetAuthKeyData: '',
	GetAuthKeyIsFetching: false,

	//For Enable Google Auth
	EnableGoogleAuthFetchData: true,
	EnableGoogleAuthData: '',
	EnableGoogleAuthIsFetching: false
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		// To reset initial state on logout
		case ACTION_LOGOUT:
			return INITIAL_STATE;

		// Handle enable google auth method data
		case ENABLE_GOOGLE_AUTH:
			return { ...state, EnableGoogleAuthIsFetching: true, EnableGoogleAuthData: '', EnableGoogleAuthFetchData: true };
		// Set enable google auth success data
		case ENABLE_GOOGLE_AUTH_SUCCESS:
			return { ...state, EnableGoogleAuthIsFetching: false, EnableGoogleAuthData: action.payload, EnableGoogleAuthFetchData: false };
		// Set enable google auth failure data
		case ENABLE_GOOGLE_AUTH_FAILURE:
			return { ...state, EnableGoogleAuthIsFetching: false, EnableGoogleAuthData: action.payload, EnableGoogleAuthFetchData: false };

		// Handle google auth info method data
		case GET_GOOGLE_AUTH_INFO:
			return { ...state, GetAuthKeyIsFetching: true, GetAuthKeyData: '', GetAuthKeyFetchData: true };
		// Set google auth info success data
		case GET_GOOGLE_AUTH_INFO_SUCCESS:
			return { ...state, GetAuthKeyIsFetching: false, GetAuthKeyData: action.payload, GetAuthKeyFetchData: false };
		// Set google auth info failure data
		case GET_GOOGLE_AUTH_INFO_FAILURE:
			return { ...state, GetAuthKeyIsFetching: false, GetAuthKeyData: action.payload, GetAuthKeyFetchData: false };

		// If no actions were found from reducer than return default [existing] state value
		default:
			return state;
	}
};  