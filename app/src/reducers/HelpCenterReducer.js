// Action types for Help Center
import {
    // Get Help Manual Module
    GET_HELPMANUALMODUALS,
    GET_HELPMANUALMODUALS_SUCCESS,
    GET_HELPMANUALMODUALS_FAILURE,

    // Get Help Manual By Id
    GET_HELPMANUALS_BY_ID,
    GET_HELPMANUALS_BY_ID_SUCCESS,
    GET_HELPMANUALS_BY_ID_FAILURE,

    // Action Logout
    ACTION_LOGOUT
} from '../actions/ActionTypes';

// initial state for Help Center
const INTIAL_STATE = {
    moduleList: null,
    data: null,
    loading: false,
    helpmanualdetails: null,
};

export default function HelpCenterReducer(state, action) {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined') {
        return INTIAL_STATE;
    }

    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT: {
            return INTIAL_STATE;
        }

        // Handle Help Manual Module method data
        case GET_HELPMANUALMODUALS:
            return { ...state, loading: true, data: null, moduleList: null };

        // Set Help Manual Module success data
        case GET_HELPMANUALMODUALS_SUCCESS:
            return { ...state, loading: false, moduleList: action.payload };

        // Set Help Manual Module failure data
        case GET_HELPMANUALMODUALS_FAILURE:
            return { ...state, loading: false, data: action.payload, moduleList: null };

        // Handle Help Manual Module By Id method data
        case GET_HELPMANUALS_BY_ID:
            return { ...state, loading: true, data: null, helpmanualdetails: null };

        // Set Help Manual Module By Id success data
        case GET_HELPMANUALS_BY_ID_SUCCESS:
            return { ...state, loading: false, data: null, helpmanualdetails: action.payload };

        // Set Help Manual Module By Id failure data
        case GET_HELPMANUALS_BY_ID_FAILURE:
            return { ...state, loading: false, data: action.payload, helpmanualdetails: null };

        // If no actions were found from reducer than return default [existing] state value
        default: return state;
    }
}