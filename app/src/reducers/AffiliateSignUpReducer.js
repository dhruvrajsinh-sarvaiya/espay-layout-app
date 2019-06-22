// Action types for Affiliate Signup
import {

    // Affiliate Signup
    AFFILIATE_SIGNUP,
    AFFILIATE_SIGNUP_SUCCESS,
    AFFILIATE_SIGNUP_FAILURE,

    // Affiliate Clear
    AFFILIATE_CLEAR,

    // Get Affiliate Commission Pattern
    GET_AFFILIATE_COMMISSION_PATTERN,
    GET_AFFILIATE_COMMISSION_PATTERN_SUCCESS,
    GET_AFFILIATE_COMMISSION_PATTERN_FAILURE,
    ACTION_LOGOUT,

} from "../actions/ActionTypes";

// Initial State for Affiliate Signup
const INIT_STATE = {
    // for Affiliate Signup
    loading: false,
    affiliateSignUpData: null,

    // for Commision Pattern
    getPlan: null,
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        // To reset initial state on logout
        case ACTION_LOGOUT:
            return INIT_STATE

        // Handle affiliate signup method data
        case AFFILIATE_SIGNUP:
            return { ...state, loading: true, affiliateSignUpData: null };
        // Set affiliate signup success data
        case AFFILIATE_SIGNUP_SUCCESS:
            return { ...state, loading: false, affiliateSignUpData: action.payload };
        // Set affiliate signup failure data
        case AFFILIATE_SIGNUP_FAILURE:
            return { ...state, loading: false, affiliateSignUpData: action.payload };

        // Handle affiliate commision pattern method data
        case GET_AFFILIATE_COMMISSION_PATTERN:
            return { ...state, loading: true, getPlan: null };
        // Set affiliate commision pattern success data
        case GET_AFFILIATE_COMMISSION_PATTERN_SUCCESS:
            return { ...state, loading: false, getPlan: action.payload };
        // Set affiliate commision pattern failure data
        case GET_AFFILIATE_COMMISSION_PATTERN_FAILURE:
            return { ...state, loading: false, getPlan: action.payload };

        // Clear affiliate data
        case AFFILIATE_CLEAR:
            return { ...state, loading: false, affiliateSignUpData: null, getPlan: null };

        // If no actions were found from reducer than return default [existing] state value
        default:
            return state;
    }
};