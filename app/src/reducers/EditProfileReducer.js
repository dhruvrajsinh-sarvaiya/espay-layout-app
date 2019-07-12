// Action types for Edit Profile
import {
    //Edit Profile
    EDIT_PROFILE,
    EDIT_PROFILE_SUCCESS,
    EDIT_PROFILE_FAILURE,

    //Get Profile By ID
    GET_PROFILE_BY_ID,
    GET_PROFILE_BY_ID_SUCCESS,
    GET_PROFILE_BY_ID_FAILURE,

    //to clear reducer
    CLEAR_THINGS,
    ACTION_LOGOUT
} from '../actions/ActionTypes';

// Initial state for Edit Profile Module
const INITIAL_STATE = {
    // Profile by Id
    data: null,
    loading: false,

    // Edit Profile Data
    dataUpdateProfile: null,
    loadingUpdateProfile: false
};

export default (state, action) => {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined') {
        return INITIAL_STATE;
    }

    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INITIAL_STATE;
        }

        // Handle edit profile method data
        case EDIT_PROFILE:
            return { ...state, loadingUpdateProfile: true, dataUpdateProfile: null };
        // Set edit profile success data
        case EDIT_PROFILE_SUCCESS:
            return { ...state, loadingUpdateProfile: false, dataUpdateProfile: action.payload };
        // Set edit profile failure data
        case EDIT_PROFILE_FAILURE:
            return { ...state, loadingUpdateProfile: false, error: action.payload, dataUpdateProfile: null };

        // Handle Profile By ID method data
        case GET_PROFILE_BY_ID:
            return { ...state, loading: true, data: null };
        // Set Profile By ID success data
        case GET_PROFILE_BY_ID_SUCCESS:
            return { ...state, loading: false, data: action.payload };
        // Set Profile By ID failure data
        case GET_PROFILE_BY_ID_FAILURE:
            return { ...state, loading: false, error: action.payload };

        // Clear edit profile data
        case CLEAR_THINGS:
            return { ...state, data: null, dataUpdateProfile: null };

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}
