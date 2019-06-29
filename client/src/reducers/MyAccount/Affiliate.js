/**
 * Auther : Salim Deraiya
 * Created : 11/02/2019
 * Affiliate Program Reducers
 */

import {

    //Signup
    AFFILIATE_SIGNUP,
    AFFILIATE_SIGNUP_SUCCESS,
    AFFILIATE_SIGNUP_FAILURE,

    //Resend Confirmation Link
    AFFILIATE_RESEND_CONFIRMATION_LINK,
    AFFILIATE_RESEND_CONFIRMATION_LINK_SUCCESS,
    AFFILIATE_RESEND_CONFIRMATION_LINK_FAILURE,

    //Confirmation Link
    AFFILIATE_CONFIRMATION_LINK,
    AFFILIATE_CONFIRMATION_LINK_SUCCESS,
    AFFILIATE_CONFIRMATION_LINK_FAILURE,

    //Get Affiliate Commission Pattern
    GET_AFFILIATE_COMMISSION_PATTERN,
    GET_AFFILIATE_COMMISSION_PATTERN_SUCCESS,
    GET_AFFILIATE_COMMISSION_PATTERN_FAILURE,

} from "Actions/types";

/**
 * initial State for Affiliate
 */
const INIT_STATE = {
    loading: false,
    data: [],
    getPlan : [],
    confirm_link : false
};

export default (state, action) => {
    if (typeof state === 'undefined') {
        return INIT_STATE;
    }
    switch (action.type) {
        //For Signup
        case AFFILIATE_SIGNUP:
            return { ...state, loading: true, data: '' };

        case AFFILIATE_SIGNUP_SUCCESS:
            return { ...state, loading: false, data: action.payload };

        case AFFILIATE_SIGNUP_FAILURE:
            return { ...state, loading: false, data: action.payload };

        //For Resend Confirmation Link
        case AFFILIATE_RESEND_CONFIRMATION_LINK:
            return { ...state, loading : true, data : '', confirm_link : false };

        case AFFILIATE_RESEND_CONFIRMATION_LINK_SUCCESS:
            return { ...state, loading : false, data : action.payload, confirm_link : true };

        case AFFILIATE_RESEND_CONFIRMATION_LINK_FAILURE:
            return { ...state, loading : false, data : action.payload };

        //For Confirmation Link
        case AFFILIATE_CONFIRMATION_LINK:
            return { ...state, loading : true, data : '' };

        case AFFILIATE_CONFIRMATION_LINK_SUCCESS:
            return { ...state, loading : false, data : action.payload };

        case AFFILIATE_CONFIRMATION_LINK_FAILURE:
            return { ...state, loading : false, data : action.payload };

        //For Commision Pattern
        case GET_AFFILIATE_COMMISSION_PATTERN:
            return { ...state, loading: true, getPlan: '' };

        case GET_AFFILIATE_COMMISSION_PATTERN_SUCCESS:
            return { ...state, loading: false, getPlan: action.payload };

        case GET_AFFILIATE_COMMISSION_PATTERN_FAILURE:
            return { ...state, loading: false, getPlan: action.payload };

        default:
            return { ...state };
    }
};