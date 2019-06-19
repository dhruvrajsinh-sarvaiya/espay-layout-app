/**
 * Author : Salim Deraiya
 * Created : 04/03/2019
 * Affiliate Configuration
*/
import {
    //For Save Affilaite Setup Configuration
    SAVE_AFFILIATE_SETUP_CONFIGURATION,
    SAVE_AFFILIATE_SETUP_CONFIGURATION_SUCCESS,
    SAVE_AFFILIATE_SETUP_CONFIGURATION_FAILURE,

    //For Get Affilaite Setup Configuration
    GET_AFFILIATE_SETUP_CONFIGURATION,
    GET_AFFILIATE_SETUP_CONFIGURATION_SUCCESS,
    GET_AFFILIATE_SETUP_CONFIGURATION_FAILURE,

    //For Save Affiliate Commission Pattern
    SAVE_AFFILIATE_COMMISSION_PATTERN,
    SAVE_AFFILIATE_COMMISSION_PATTERN_SUCCESS,
    SAVE_AFFILIATE_COMMISSION_PATTERN_FAILURE,

    //For Get Affiliate Commission Pattern
    GET_AFFILIATE_COMMISSION_PATTERN,
    GET_AFFILIATE_COMMISSION_PATTERN_SUCCESS,
    GET_AFFILIATE_COMMISSION_PATTERN_FAILURE

} from "../types";

//For Save Affilaite Setup Configuration
/**
 * Redux Action To Save Affilaite Setup Configuration
 */
export const saveAffiliateSetupConfigure = (data) => ({
    type: SAVE_AFFILIATE_SETUP_CONFIGURATION,
    payload: data
});

/**
 * Redux Action To Save Affilaite Setup Configuration Success
 */
export const saveAffiliateSetupConfigureSuccess = response => ({
    type: SAVE_AFFILIATE_SETUP_CONFIGURATION_SUCCESS,
    payload: response
});

/**
 * Redux Action To Save Affilaite Setup Configuration Failure
 */
export const saveAffiliateSetupConfigureFailure = error => ({
    type: SAVE_AFFILIATE_SETUP_CONFIGURATION_FAILURE,
    payload: error
});

//For Get Affilaite Setup Configuration
/**
 * Redux Action To Affilaite Setup Configuration
 */
export const getAffiliateSetupConfigure = (data) => ({
    type: GET_AFFILIATE_SETUP_CONFIGURATION,
    payload: data
});

/**
 * Redux Action To Affilaite Setup Configuration Success
 */
export const getAffiliateSetupConfigureSuccess = response => ({
    type: GET_AFFILIATE_SETUP_CONFIGURATION_SUCCESS,
    payload: response
});

/**
 * Redux Action To Affilaite Setup Configuration Failure
 */
export const getAffiliateSetupConfigureFailure = error => ({
    type: GET_AFFILIATE_SETUP_CONFIGURATION_FAILURE,
    payload: error
});

//For Save Affiliate Commission Pattern
/**
 * Redux Action To Save Affiliate Commission Pattern
 */

export const saveAffiliateCommissionPattern = (data) => ({
    type: SAVE_AFFILIATE_COMMISSION_PATTERN,
    payload: data
});

/**
 * Redux Action To Save Affiliate Commission Pattern Success
 */
export const saveAffiliateCommissionPatternSuccess = response => ({
    type: SAVE_AFFILIATE_COMMISSION_PATTERN_SUCCESS,
    payload: response
});

/**
 * Redux Action To Save Affiliate Commission Pattern Failure
 */
export const saveAffiliateCommissionPatternFailure = error => ({
    type: SAVE_AFFILIATE_COMMISSION_PATTERN_FAILURE,
    payload: error
});

//For Get Affiliate Commission Pattern
/**
 * Redux Action To Affiliate Commission Pattern
 */

export const getAffiliateCommissionPattern = (data) => ({
    type: GET_AFFILIATE_COMMISSION_PATTERN,
    payload: data
});

/**
 * Redux Action To Affiliate Commission Pattern Success
 */
export const getAffiliateCommissionPatternSuccess = response => ({
    type: GET_AFFILIATE_COMMISSION_PATTERN_SUCCESS,
    payload: response
});

/**
 * Redux Action To Affiliate Commission Pattern Failure
 */
export const getAffiliateCommissionPatternFailure = error => ({
    type: GET_AFFILIATE_COMMISSION_PATTERN_FAILURE,
    payload: error
});