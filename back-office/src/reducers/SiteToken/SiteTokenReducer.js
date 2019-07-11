// Reducer For Handle Site Token By Tejas 8/2/2019
// import types
import {
    GET_SITE_TOKEN_LIST,
    GET_SITE_TOKEN_LIST_SUCCESS,
    GET_SITE_TOKEN_LIST_FAILURE,
    ADD_SITE_TOKEN_LIST,
    ADD_SITE_TOKEN_LIST_SUCCESS,
    ADD_SITE_TOKEN_LIST_FAILURE,
    UPDATE_SITE_TOKEN_LIST,
    UPDATE_SITE_TOKEN_LIST_SUCCESS,
    UPDATE_SITE_TOKEN_LIST_FAILURE,
    GET_RATE_TYPE,
    GET_RATE_TYPE_SUCCESS,
    GET_RATE_TYPE_FAILURE
} from "Actions/types";

// Set Initial State
const INITIAL_STATE = {
    siteTokenList: [],
    addSiteToken: [],
    updateSiteToken: [],
    loading: false,
    error: [],
    addError: [],
    updateError: [],
    updateLoading: false,
    addLoading: false,
    rateTypeList: [],
    rateLoading: false,
    rateError: []
};

export default (state , action) => {
    if (typeof state === 'undefined') {
        return INITIAL_STATE
    }
    switch (action.type) {
        // get Site Token
        case GET_SITE_TOKEN_LIST:
            return { ...state, loading: true };

        // set Data Of Site Token
        case GET_SITE_TOKEN_LIST_SUCCESS:
            return { ...state, siteTokenList: action.payload, loading: false, error: [] };

        // Display Error for Site Token failure
        case GET_SITE_TOKEN_LIST_FAILURE:

            return { ...state, loading: false, siteTokenList: [], error: action.payload };

        // Add Site Token
        case ADD_SITE_TOKEN_LIST:
            return { ...state, addLoading: true };

        // set Data Of Add Site Token
        case ADD_SITE_TOKEN_LIST_SUCCESS:
            return { ...state, addSiteToken: action.payload, addLoading: false, addError: [] };

        // Display Error for Add Site Token failure
        case ADD_SITE_TOKEN_LIST_FAILURE:
            return { ...state, addLoading: false, addSiteToken: [], addError: action.payload };

        // update Site Token
        case UPDATE_SITE_TOKEN_LIST:
            return { ...state, updateLoading: true };

        // set Data Of update Site Token
        case UPDATE_SITE_TOKEN_LIST_SUCCESS:
            return { ...state, updateSiteToken: action.payload, updateLoading: false, updateError: [] };

        // Display Error for update Site Token failure
        case UPDATE_SITE_TOKEN_LIST_FAILURE:
            return { ...state, updateLoading: false, updateSiteToken: [], updateError: action.payload };

        // rate type list
        case GET_RATE_TYPE:
            return { ...state, rateLoading: true };

        // set Data Of rate type list
        case GET_RATE_TYPE_SUCCESS:
            return { ...state, rateTypeList: action.payload, rateLoading: false, rateError: [] };

        // Display Error for rate type list failure
        case GET_RATE_TYPE_FAILURE:
            return { ...state, rateLoading: false, rateTypeList: [], rateError: action.payload };

        default:
            return { ...state };
    }
};
