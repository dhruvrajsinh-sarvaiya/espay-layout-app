import {
    // Affiliate Signup
    AFFILIATE_SIGNUP,
    AFFILIATE_SIGNUP_SUCCESS,
    AFFILIATE_SIGNUP_FAILURE,

    // Affiliate Clear
    AFFILIATE_CLEAR,

    //Get Affiliate Commission Pattern
    GET_AFFILIATE_COMMISSION_PATTERN,
    GET_AFFILIATE_COMMISSION_PATTERN_SUCCESS,
    GET_AFFILIATE_COMMISSION_PATTERN_FAILURE,

} from "../ActionTypes";

/**
 * Redux Action To Affiliate Signup
 */
export const affiliateSignup = (data) => ({
    type: AFFILIATE_SIGNUP,
    payload: data
});

/**
 * Redux Action To Affiliate Signup Success
 */
export const affiliateSignupSuccess = (data) => ({
    type: AFFILIATE_SIGNUP_SUCCESS,
    payload: data
});

/**
 * Redux Action To Affiliate Signup Failure
 */
export const affiliateSignupFailure = (error) => ({
    type: AFFILIATE_SIGNUP_FAILURE,
    payload: error
});

//clear affiliate
export const clearAffiliate = () => ({
    type: AFFILIATE_CLEAR,
});

/**
 * Redux Action To Get Affiliate Commission Pattern
 */
export const getAffiliateCommissionPattern = (data) => ({
    type: GET_AFFILIATE_COMMISSION_PATTERN,
    payload: data
});

/**
 * Redux Action To Get Affiliate Commission Pattern Success
 */
export const getAffiliateCommissionPatternSuccess = (data) => ({
    type: GET_AFFILIATE_COMMISSION_PATTERN_SUCCESS,
    payload: data
});

/**
 * Redux Action To Get Affiliate Commission Pattern Failure
 */
export const getAffiliateCommissionPatternFailure = (error) => ({
    type: GET_AFFILIATE_COMMISSION_PATTERN_FAILURE,
    payload: error
});