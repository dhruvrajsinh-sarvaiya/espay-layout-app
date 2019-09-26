// Reducer For Handle Site Token
// import types
import {
    // Get Site Token List
    GET_SITE_TOKEN_LIST,
    GET_SITE_TOKEN_LIST_SUCCESS,
    GET_SITE_TOKEN_LIST_FAILURE,

    // Add Site Token List
    ADD_SITE_TOKEN_LIST,
    ADD_SITE_TOKEN_LIST_SUCCESS,
    ADD_SITE_TOKEN_LIST_FAILURE,

    // Update Site Token List
    UPDATE_SITE_TOKEN_LIST,
    UPDATE_SITE_TOKEN_LIST_SUCCESS,
    UPDATE_SITE_TOKEN_LIST_FAILURE,

    // Get Rate Type
    GET_RATE_TYPE,
    GET_RATE_TYPE_SUCCESS,
    GET_RATE_TYPE_FAILURE,

    // Clear Data
    ACTION_LOGOUT
} from "../../actions/ActionTypes";

// Set Initial State
const INITIAL_STATE = {

    // for site token list
    siteTokenList: null,
    loading: false,
    error: null,

    // for add site token
    addSiteTokenData: null,
    addLoading: false,
    addError: null,

    // for update site token
    updateSiteTokenData: null,
    updateLoading: false,
    updateError: null,

    // rate type list
    rateTypeList: null,
    rateLoading: false,
    rateError: null
};

export default (state, action) => {

    //If state is undefine then return with initial state
    if (typeof state === 'undefined')
        return INITIAL_STATE

    switch (action.type) {

        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INITIAL_STATE

        // get Site Token
        case GET_SITE_TOKEN_LIST:
            return Object.assign({}, state, { loading: true })

        // set Data Of Site Token
        case GET_SITE_TOKEN_LIST_SUCCESS:
            return Object.assign({}, state, { siteTokenList: action.payload, loading: false, error: null })

        // Display Error for Site Token failure
        case GET_SITE_TOKEN_LIST_FAILURE:
            return Object.assign({}, state, { loading: false, siteTokenList: null, error: action.payload })

        // Add Site Token
        case ADD_SITE_TOKEN_LIST:
            return Object.assign({}, state, { addLoading: true })

        // set Data Of Add Site Token
        case ADD_SITE_TOKEN_LIST_SUCCESS:
            return Object.assign({}, state, { addSiteTokenData: action.payload, addLoading: false, addError: null })

        // Display Error for Add Site Token failure
        case ADD_SITE_TOKEN_LIST_FAILURE:
            return Object.assign({}, state, { addLoading: false, addSiteTokenData: null, addError: action.payload })

        // update Site Token
        case UPDATE_SITE_TOKEN_LIST:
            return Object.assign({}, state, { updateLoading: true })

        // set Data Of update Site Token
        case UPDATE_SITE_TOKEN_LIST_SUCCESS:
            return Object.assign({}, state, { updateSiteTokenData: action.payload, updateLoading: false, updateError: null })

        // Display Error for update Site Token failure
        case UPDATE_SITE_TOKEN_LIST_FAILURE:
            return Object.assign({}, state, { updateLoading: false, updateSiteTokenData: null, updateError: action.payload })

        // rate type list
        case GET_RATE_TYPE:
            return Object.assign({}, state, { rateLoading: true })

        // set Data Of rate type list
        case GET_RATE_TYPE_SUCCESS:
            return Object.assign({}, state, { rateTypeList: action.payload, rateLoading: false, rateError: null })

        // Display Error for rate type list failure
        case GET_RATE_TYPE_FAILURE:
            return Object.assign({}, state, { rateLoading: false, rateTypeList: null, rateError: action.payload })

        // for Clear site token data
        case GET_RATE_TYPE_FAILURE:
            return Object.assign({}, state, { siteTokenList: null, addSiteTokenData: null, updateSiteTokenData: null, rateError: action.payload })

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state
    }
};
