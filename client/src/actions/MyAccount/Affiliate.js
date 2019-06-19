/**
 * Auther : Salim Deraiya
 * Created : 11/02/2019
 * Affiliate Program Actions
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

} from "../types";

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


/**
 * Redux Action To Affiliate Resend Confirmation Link
 */
export const affiliateResendConfirmationLink = (data) => ({
    type: AFFILIATE_RESEND_CONFIRMATION_LINK,
    payload: data
});

/**
 * Redux Action To Affiliate Resend Confirmation Link Success
 */
export const affiliateResendConfirmationLinkSuccess = (data) => ({
    type: AFFILIATE_RESEND_CONFIRMATION_LINK_SUCCESS,
    payload: data
});

/**
 * Redux Action To Affiliate Resend Confirmation Link Failure
 */
export const affiliateResendConfirmationLinkFailure = (error) => ({
    type: AFFILIATE_RESEND_CONFIRMATION_LINK_FAILURE,
    payload: error
});

/**
 * Redux Action To Affiliate Confirmation Link
 */
export const affiliateConfirmationLink = (data) => ({
    type: AFFILIATE_CONFIRMATION_LINK,
    payload: data
});

/**
 * Redux Action To Affiliate Confirmation Link Success
 */
export const affiliateConfirmationLinkSuccess = (data) => ({
    type: AFFILIATE_CONFIRMATION_LINK_SUCCESS,
    payload: data
});

/**
 * Redux Action To Affiliate Confirmation Link Failure
 */
export const affiliateConfirmationLinkFailure = (error) => ({
    type: AFFILIATE_CONFIRMATION_LINK_FAILURE,
    payload: error
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