import {
  // Disable Google Auth
  DISABLE_GOOGLE_AUTH,
  DISABLE_GOOGLE_AUTH_SUCCESS,
  DISABLE_GOOGLE_AUTH_FAILURE,

  // Clear data on logout
  ACTION_LOGOUT
} from "../../actions/ActionTypes";

// Initial state for Google Auth
const initialState = {

  //For Disable Google Auth
  DisableGoogleAuthFetchData: true,
  DisableGoogleAuthData: '',
  DisableGoogleAuthIsFetching: false
};

export default (state, action) => {

  //If state is undefine then return with initial state		
  if (typeof state === 'undefined')
    return initialState;

  switch (action.type) {

    // To reset initial state on logout
    case ACTION_LOGOUT: 
      return initialState;
    
    // Handle Disable Google Auth method data
    case DISABLE_GOOGLE_AUTH:
      return Object.assign({}, state, { DisableGoogleAuthIsFetching: true, DisableGoogleAuthData: '', DisableGoogleAuthFetchData: true })

    // Set Disable Google Auth success data
    case DISABLE_GOOGLE_AUTH_SUCCESS:
      return Object.assign({}, state, { DisableGoogleAuthIsFetching: false, DisableGoogleAuthData: action.payload, DisableGoogleAuthFetchData: false })

    // Set Disable Google Auth failure data
    case DISABLE_GOOGLE_AUTH_FAILURE:
      return Object.assign({}, state, { DisableGoogleAuthIsFetching: false, DisableGoogleAuthData: action.payload, DisableGoogleAuthFetchData: false })

    // If no actions were found from reducer than return default [existing] state value
    default:
      return state
  }
};