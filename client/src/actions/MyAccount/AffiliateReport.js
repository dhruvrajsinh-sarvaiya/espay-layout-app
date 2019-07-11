/**
 * Author : Saloni Rathod
 * Created : 08/03/2019
 *  Update by : Bharat Jograna, 04 March 2019 
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
    AFFILIATE_COMMISSION_REPORT_FAILURE,

    //to display email sent report
    AFFILIATE_EMAIL_SENT_REPORT,
    AFFILIATE_EMAIL_SENT_REPORT_SUCCESS,
    AFFILIATE_EMAIL_SENT_REPORT_FAILURE,

    //TO display sms sent report
    AFFILIATE_SMS_SENT_REPORT,
    AFFILIATE_SMS_SENT_REPORT_SUCCESS,
    AFFILIATE_SMS_SENT_REPORT_FAILURE,

    //TO display affiliate all user report
    AFFILIATE_ALL_USER,
    AFFILIATE_ALL_USER_SUCCESS,
    AFFILIATE_ALL_USER_FAILURE,

    //TO display affiliate SCHEME TYPE report
    AFFILIATE_SCHEME_TYPE,
    AFFILIATE_SCHEME_TYPE_SUCCESS,
    AFFILIATE_SCHEME_TYPE_FAILURE,

    // Added By Bharat Jograna 
    // For Display Affiliate Facebook Share Report
    AFFILIATE_SHARE_ON_FACEBOOK_REPORT,
    AFFILIATE_SHARE_ON_FACEBOOK_REPORT_SUCCESS,
    AFFILIATE_SHARE_ON_FACEBOOK_REPORT_FAILURE,

    // For Display Affiliate Twitter Share Report 
    AFFILIATE_SHARE_ON_TWITTER_REPORT,
    AFFILIATE_SHARE_ON_TWITTER_REPORT_SUCCESS,
    AFFILIATE_SHARE_ON_TWITTER_REPORT_FAILURE,

    // For Display Affiliate Click On link Report 
    AFFILIATE_CLICK_ON_LINK_REPORT,
    AFFILIATE_CLICK_ON_LINK_REPORT_SUCCESS,
    AFFILIATE_CLICK_ON_LINK_REPORT_FAILURE,

    // For Display Affiliate Twitter Share Report 
    AFFILIATE_ALL_COUNT,
    AFFILIATE_ALL_COUNT_SUCCESS,
    AFFILIATE_ALL_COUNT_FAILURE,

    //For Affiliate Invite Friend Chart
    AFFILIATE_INVITE_FRIEND_CHART,
    AFFILIATE_INVITE_FRIEND_CHART_SUCCESS,
    AFFILIATE_INVITE_FRIEND_CHART_FAILURE,

    //for affiliate Monthly average chart
    AFFILIATE_MONTHLY_AVERAGE_COMMISSION_CHART,
    AFFILIATE_MONTHLY_AVERAGE_COMMISSION_CHART_SUCCESS,
    AFFILIATE_MONTHLY_AVERAGE_COMMISSION_CHART_FAILURE,


} from "../types";
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
export const affiliateSignupReportSuccess = (response) => ({
    type: AFFILIATE_SIGNUP_REPORT_SUCCESS,
    payload: response
});

/**
 * Redux Action To Display Affiliate Report Failure
 */
export const affiliateSignupReportFailure = (error) => ({
    type: AFFILIATE_SIGNUP_REPORT_FAILURE,
    payload: error
});

//For Display affiliate Report
/**
 * Redux Action To Display Affiliate Report
 */

export const affiliateCommissionReport = (data) => ({
    type: AFFILIATE_COMMISSION_REPORT,
    payload: data
});

/**
 * Redux Action To Display Affiliate Report Success
 */
export const affiliateCommissionReportSuccess = (response) => ({
    type: AFFILIATE_COMMISSION_REPORT_SUCCESS,
    payload: response
});

/**
 * Redux Action To Display Affiliate Report Failure
 */
export const affiliateCommissionReportFailure = (error) => ({
    type: AFFILIATE_COMMISSION_REPORT_FAILURE,
    payload: error
});

//For Display affiliate Email Sent Report
/**
 * Redux Action To Display Affiliate Email Sent Report
 */
export const affiliateEmailSentReport = (data) => ({
    type: AFFILIATE_EMAIL_SENT_REPORT,
    payload: data
});

/**
 * Redux Action To Display Affiliate Email Sent Report Success
 */
export const affiliateEmailSentReportSuccess = (response) => ({
    type: AFFILIATE_EMAIL_SENT_REPORT_SUCCESS,
    payload: response
});

/**
 * Redux Action To Display Affiliate Email Sent Report Failure
 */
export const affiliateEmailSentReportFailure = (error) => ({
    type: AFFILIATE_EMAIL_SENT_REPORT_FAILURE,
    payload: error
});
//For Display affiliate Sms Sent Report
/**
 * Redux Action To Display Affiliate Sms Sent Report
 */
export const affiliateSmsSentReport = (data) => ({
    type: AFFILIATE_SMS_SENT_REPORT,
    payload: data
});

/**
 * Redux Action To Display Affiliate Sms Sent Report Success
 */
export const affiliateSmsSentReportSuccess = (response) => ({
    type: AFFILIATE_SMS_SENT_REPORT_SUCCESS,
    payload: response
});

/**
 * Redux Action To Display Affiliate Sms Sent Report Failure
 */
export const affiliateSmsSentReportFailure = (error) => ({
    type: AFFILIATE_SMS_SENT_REPORT_FAILURE,
    payload: error
});

//For Display affiliate all user 
/**
 * Redux Action To Display Affiliate all user 
 */
export const affiliateAllUser = (data) => ({
    type: AFFILIATE_ALL_USER,
    payload: data
});

/**
 * Redux Action To Display Affiliate all user  Success
 */
export const affiliateAllUserSuccess = (response) => ({
    type: AFFILIATE_ALL_USER_SUCCESS,
    payload: response
});

/**
 * Redux Action To Display Affiliate all user  Failure
 */
export const affiliateAllUserFailure = (error) => ({
    type: AFFILIATE_ALL_USER_FAILURE,
    payload: error
});


//For Display affiliate Scheme type 
/**
 * Redux Action To Display Affiliate Scheme type 
 */
export const affiliateSchemeType = (data) => ({
    type: AFFILIATE_SCHEME_TYPE,
    payload: data
});

/**
 * Redux Action To Display Affiliate Scheme type  Success
 */
export const affiliateSchemeTypeSuccess = (response) => ({
    type: AFFILIATE_SCHEME_TYPE_SUCCESS,
    payload: response
});

/**
 * Redux Action To Display Affiliate Scheme type  Failure
 */
export const affiliateSchemeTypeFailure = error => ({
    type: AFFILIATE_SCHEME_TYPE_FAILURE,
    payload: error
});
// Added By Bharat Jograna
//For Display affiliate Share On Facebook Report
/**
 * Redux Action To Display Affiliate Share On Facebook Report
 */
export const affiliateShareOnFacebookReport = (data) => ({
    type: AFFILIATE_SHARE_ON_FACEBOOK_REPORT,
    payload: data
});

/**
 * Redux Action To Display Affiliate Share On Facebook Report Success
 */
export const affiliateShareOnFacebookReportSuccess = (response) => ({
    type: AFFILIATE_SHARE_ON_FACEBOOK_REPORT_SUCCESS,
    payload: response
});

/**
 * Redux Action To Display Affiliate Share On Facebook Report Failure
 */
export const affiliateShareOnFacebookReportFailure = (error) => ({
    type: AFFILIATE_SHARE_ON_FACEBOOK_REPORT_FAILURE,
    payload: error
});

//For Display affiliate Share On Twitter Report
/**
 * Redux Action To Display Affiliate Share On Twitter Report
 */
export const affiliateShareOnTwitterReport = (data) => ({
    type: AFFILIATE_SHARE_ON_TWITTER_REPORT,
    payload: data
});

/**
 * Redux Action To Display Affiliate Share On Twitter Report Success
 */
export const affiliateShareOnTwitterReportSuccess = (response) => ({
    type: AFFILIATE_SHARE_ON_TWITTER_REPORT_SUCCESS,
    payload: response
});

/**
 * Redux Action To Display Affiliate Share On Twitter Report Failure
 */
export const affiliateShareOnTwitterReportFailure = (error) => ({
    type: AFFILIATE_SHARE_ON_TWITTER_REPORT_FAILURE,
    payload: error
});

//For Display affiliate Click On Link Report
/**
 * Redux Action To Display Affiliate Click On Link Report
 */
export const affiliateClickOnLinkReport = (data) => ({
    type: AFFILIATE_CLICK_ON_LINK_REPORT,
    payload: data
});

/**
 * Redux Action To Display Affiliate Click On Link Report Success
 */
export const affiliateClickOnLinkReportSuccess = (response) => ({
    type: AFFILIATE_CLICK_ON_LINK_REPORT_SUCCESS,
    payload: response
});

/**
 * Redux Action To Display Affiliate Click On Link Report Failure
 */
export const affiliateClickOnLinkReportFailure = (error) => ({
    type: AFFILIATE_CLICK_ON_LINK_REPORT_FAILURE,
    payload: error
});

//For Display affiliate All Count Report
/**
 * Redux Action To Display Affiliate All Count Report
 */
export const affiliateAllCount = (data) => ({
    type: AFFILIATE_ALL_COUNT,
    payload: data
});

/**
 * Redux Action To Display Affiliate All Count Report Success
 */
export const affiliateAllCountSuccess = (response) => ({
    type: AFFILIATE_ALL_COUNT_SUCCESS,
    payload: response
});

/**
 * Redux Action To Display Affiliate All Count Report Failure
 */
export const affiliateAllCountFailure = (error) => ({
    type: AFFILIATE_ALL_COUNT_FAILURE,
    payload: error
});
//For Display affiliate Invite Friend Chart
/**
 * Redux Action To Display Affiliate Invite Friend Chart
 */
export const affiliateInviteFriendChart = (data) => ({
    type: AFFILIATE_INVITE_FRIEND_CHART,
    payload: data
});

/**
 * Redux Action To Display Affiliate Invite Friend Chart Success
 */
export const affiliateInviteFriendChartSuccess = (response) => ({
    type: AFFILIATE_INVITE_FRIEND_CHART_SUCCESS,
    payload: response
});

/**
 * Redux Action To Display Affiliate Invite Friend Chart Failure
 */
export const affiliateInviteFriendChartFailure = (error) => ({
    type: AFFILIATE_INVITE_FRIEND_CHART_FAILURE,
    payload: error
});
//For Display affiliate Monthly Average chart
/**
 * Redux Action To Display Affiliate Monthly Average chart
 */
export const affiliateMonthlyAverageCommissionChart = (data) => ({
    type: AFFILIATE_MONTHLY_AVERAGE_COMMISSION_CHART,
    payload: data
});

/**
 * Redux Action To Display Affiliate Monthly Average chart Success
 */
export const affiliateMonthlyAverageCommissionChartSuccess = (response) => ({
    type: AFFILIATE_MONTHLY_AVERAGE_COMMISSION_CHART_SUCCESS,
    payload: response
});

/**
 * Redux Action To Display Affiliate Monthly Average chart Failure
 */
export const affiliateMonthlyAverageCommissionChartFailure = (error) => ({
    type: AFFILIATE_MONTHLY_AVERAGE_COMMISSION_CHART_FAILURE,
    payload: error
});