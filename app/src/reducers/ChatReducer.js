// Action types for chat module
import {
    //Get Profile By ID
    GET_PROFILE_BY_ID,
    GET_PROFILE_BY_ID_SUCCESS,
    GET_PROFILE_BY_ID_FAILURE,
    ACTION_LOGOUT,
} from '../actions/ActionTypes';

// Initial state for Chat Module
const INITIAL_STATE = {
    // Chat screen data
    data: '',
    loading: false,
    dataFetch: true
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INITIAL_STATE;
        }

        // Handle Profile By ID method data
        case GET_PROFILE_BY_ID:
            return { ...state, loading: true, data: '', dataFetch: true };
        // Set Profile By ID success data
        case GET_PROFILE_BY_ID_SUCCESS:
            return { ...state, loading: false, data: action.payload, dataFetch: false };
        // Set Profile By ID failure data
        case GET_PROFILE_BY_ID_FAILURE:
            return { ...state, loading: false, data: action.payload, dataFetch: false };

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
}
