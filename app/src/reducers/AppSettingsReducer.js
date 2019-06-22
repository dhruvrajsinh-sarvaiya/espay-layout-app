// Action types for App Setting
import {
	// Get Languages
	GET_LANGUAGES,
	GET_LANGUAGES_SUCCESS,
	GET_LANGUAGES_FAILURE,

	// Set Languages
	SET_LANGUAGES,
	SET_LANGUAGES_SUCCESS,
	SET_LANGUAGES_FAILURE
} from "../actions/ActionTypes";

// initial state app settings
const INTIAL_STATE = {
	// Language
	loading: false,
	languages: null,

	// Set Language
	isSettingLanguage: false,
	languageSet: null,
	languageSetup: true

};

export default (state = INTIAL_STATE, action) => {
	switch (action.type) {

		// Handle Get Language method data
		case GET_LANGUAGES:
			return { ...state, loading: true, languageSetup: true };

		// Set Get Language success data
		case GET_LANGUAGES_SUCCESS:
			return { ...state, languages: action.payload, loading: false, languageSetup: true };

		// Set Get Language failure data
		case GET_LANGUAGES_FAILURE:
			return { ...state, loading: false, languageSetup: true }

		// Handle Set Language method data
		case SET_LANGUAGES:
			return {
				...state,
				isSettingLanguage: true,
				languageSet: null,
				languageSetup: true
			};

		// Set Language success data
		case SET_LANGUAGES_SUCCESS:
			return {
				...state,
				isSettingLanguage: false,
				languageSet: action.payload,
				languageSetup: false
			};

		// Set Language failure data
		case SET_LANGUAGES_FAILURE:
			return {
				...state,
				isSettingLanguage: false,
				languageSet: null,
				languageSetup: false
			}

		// If no actions were found from reducer than return default [existing] state value
		default:
			return state;
	}
};
