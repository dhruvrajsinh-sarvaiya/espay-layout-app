/**
 * Author : Saloni Rathod
 * Created : 12/2/2019
 * Display Affiliate Actions
*/
import {
    //For Display Affiliate Report
    AFFILIATE_SIGNUP_REPORT,
    AFFILIATE_SIGNUP_REPORT_SUCCESS,
    AFFILIATE_SIGNUP_REPORT_FAILURE,

    //For Display Affiliate Commission Report
    AFFILIATE_COMMISSION_REPORT,
    AFFILIATE_COMMISSION_REPORT_SUCCESS,
    AFFILIATE_COMMISSION_REPORT_FAILURE

} from "../types";

//For Display affiliate Report
/**
 * Redux Action To Display Affiliate Report
 */

export const AffiliateSignupReport = (data) => ({
    type: AFFILIATE_SIGNUP_REPORT,
    payload: data
});

/**
 * Redux Action To Display Affiliate Report Success
 */
export const AffiliateSignupReportSuccess = response => ({
    type: AFFILIATE_SIGNUP_REPORT_SUCCESS,
    payload: response
});

/**
 * Redux Action To Display Affiliate Report Failure
 */
export const AffiliateSignupReportFailure = error => ({
    type: AFFILIATE_SIGNUP_REPORT_FAILURE,
    payload: error
});

//For Display affiliate Report
/**
 * Redux Action To Display Affiliate Report
 */

export const AffiliateCommissionReport = (data) => ({
    type: AFFILIATE_COMMISSION_REPORT,
    payload: data
});

/**
 * Redux Action To Display Affiliate Report Success
 */
export const AffiliateCommissionReportSuccess = response => ({
    type: AFFILIATE_COMMISSION_REPORT_SUCCESS,
    payload: response
});

/**
 * Redux Action To Display Affiliate Report Failure
 */
export const AffiliateCommissionReportFailure = error => ({
    type: AFFILIATE_COMMISSION_REPORT_FAILURE,
    payload: error
});