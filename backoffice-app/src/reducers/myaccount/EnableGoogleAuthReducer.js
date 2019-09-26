import {
	//For Enable Google Auth
	ENABLE_GOOGLE_AUTH,
	ENABLE_GOOGLE_AUTH_SUCCESS,
	ENABLE_GOOGLE_AUTH_FAILURE,

	//Get Google Auth Info
	GET_GOOGLE_AUTH_INFO,
	GET_GOOGLE_AUTH_INFO_SUCCESS,
	GET_GOOGLE_AUTH_INFO_FAILURE,

	// Clear data 
	ACTION_LOGOUT
} from "../../actions/ActionTypes";

// Initial state for Enable google auth
const initialState = {

	//For Get Auth Key
	GetAuthKeyFetchData: true,
	GetAuthKeyData: '',
	GetAuthKeyIsFetching: false,

	//For Enable Google Auth
	EnableGoogleAuthFetchData: true,
	EnableGoogleAuthData: '',
	EnableGoogleAuthIsFetching: false
}

export default (state, action) => {

	// If state is undefine then return with initial state		
	if (typeof state === 'undefined')
		return initialState

	switch (action.type) {

		// To reset initial state on logout
		case ACTION_LOGOUT:
			return initialState;

		// Handle Enable Google Auth method data
		case ENABLE_GOOGLE_AUTH:
			return Object.assign({}, state, { EnableGoogleAuthIsFetching: true, EnableGoogleAuthData: '', EnableGoogleAuthFetchData: true })
		// Set Enable Google Auth success data
		case ENABLE_GOOGLE_AUTH_SUCCESS:
			return Object.assign({}, state, { EnableGoogleAuthIsFetching: false, EnableGoogleAuthData: action.payload, EnableGoogleAuthFetchData: false })
		// Set Enable Google Auth failure data
		case ENABLE_GOOGLE_AUTH_FAILURE:
			return Object.assign({}, state, { EnableGoogleAuthIsFetching: false, EnableGoogleAuthData: action.payload, EnableGoogleAuthFetchData: false })

		// Handle Get Google Auth method data
		case GET_GOOGLE_AUTH_INFO:
			return Object.assign({}, state, { GetAuthKeyIsFetching: true, GetAuthKeyData: '', GetAuthKeyFetchData: true })
		// Set Google Auth Info success data
		case GET_GOOGLE_AUTH_INFO_SUCCESS:
			return Object.assign({}, state, { GetAuthKeyIsFetching: false, GetAuthKeyData: action.payload, GetAuthKeyFetchData: false })
		// Set Google Auth Info failure data
		case GET_GOOGLE_AUTH_INFO_FAILURE:
			return Object.assign({}, state, { GetAuthKeyIsFetching: false, GetAuthKeyData: action.payload, GetAuthKeyFetchData: false })

		// If no actions were found from reducer than return default [existing] state value
		default:
			return state
	}
}  