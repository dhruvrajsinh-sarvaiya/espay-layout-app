// App Settings Reducers
import {
  // Get Languages
  GET_LANGUAGES,
  GET_LANGUAGES_SUCCESS,
  GET_LANGUAGES_FAILURE,

  // Set Languages
  SET_LANGUAGES,
  SET_LANGUAGES_SUCCESS,
  SET_LANGUAGES_FAILURE,

  // Clear logout
  ACTION_LOGOUT
} from "../../actions/ActionTypes";

// initial app settings
const initialState = {
  loading: false,
  languages: null,

  isSettingLanguage: false,
  languageSet: null,
  languageSetup: true
};

export default (state, action) => {

  // If state is undefine then return with initial state
  if (typeof state === 'undefined')
    return initialState

  switch (action.type) {

    // To reset initial state on logout
    case ACTION_LOGOUT:
      return initialState;

    //for get languages
    case GET_LANGUAGES:
      return Object.assign({}, state, { loading: true, languageSetup: true })

    // get languages success
    case GET_LANGUAGES_SUCCESS:
      return Object.assign({}, state, { languages: action.payload, loading: false, languageSetup: true })

    // get languages failure
    case GET_LANGUAGES_FAILURE:
      return Object.assign({}, state, { loading: false, languageSetup: true })

    //for set languages
    case SET_LANGUAGES:
      return Object.assign({}, state, {
        isSettingLanguage: true,
        languageSet: null,
        languageSetup: true
      })

    // set languages success
    case SET_LANGUAGES_SUCCESS:
      return Object.assign({}, state, {
        isSettingLanguage: false,
        languageSet: action.payload,
        languageSetup: false
      })

    // set languages failure
    case SET_LANGUAGES_FAILURE:
      return Object.assign({}, state, {
        isSettingLanguage: false,
        languageSet: null,
        languageSetup: false
      })

    // If no actions were found from reducer than return default [existing] state value
    default:
      return state
  }
};
