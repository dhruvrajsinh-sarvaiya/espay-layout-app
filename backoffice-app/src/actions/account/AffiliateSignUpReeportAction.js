import {
    //For Display Affiliate Report
    AFFILIATE_SIGNUP_REPORT,
    AFFILIATE_SIGNUP_REPORT_SUCCESS,
    AFFILIATE_SIGNUP_REPORT_FAILURE,

    //clear reducer data
    CLEAR_AFFILIATE_SIGNUP_REPORT,
} from '../../actions/ActionTypes'

//For Display affiliate Report
/**
 * Redux Action To Display Affiliate Report
 */

export const affiliateSignupReport = (data) => ({
    type: AFFILIATE_SIGNUP_REPORT,
    payload: data
});

/**
 * Redux Action To Display Affiliate Report Success
 */
export const affiliateSignupReportSuccess = response => ({
    type: AFFILIATE_SIGNUP_REPORT_SUCCESS,
    payload: response
});

/**
 * Redux Action To Display Affiliate Report Failure
 */
export const affiliateSignupReportFailure = error => ({
    type: AFFILIATE_SIGNUP_REPORT_FAILURE,
    payload: error
});

/**
 * Redux Action clear affliate report
 */
export const clearAffiliateSignUpReport = () => ({
    type: CLEAR_AFFILIATE_SIGNUP_REPORT,
});
