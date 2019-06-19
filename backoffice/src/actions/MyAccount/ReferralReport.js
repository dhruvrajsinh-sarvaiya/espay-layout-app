/* 
    Developer : Bharat Jograna
    Date : 11-02-2019
    File Comment : MyAccount ReferralReport Dashboard Actions
*/
import {
    REFERRAL_SIGNUP_REPORT,
    REFERRAL_SIGNUP_REPORT_SUCCESS,
    REFERRAL_SIGNUP_REPORT_FAILURE,

    REFERRAL_BUY_TRADE_REPORT,
    REFERRAL_BUY_TRADE_REPORT_SUCCESS,
    REFERRAL_BUY_TRADE_REPORT_FAILURE,

    REFERRAL_SELL_TRADE_REPORT,
    REFERRAL_SELL_TRADE_REPORT_SUCCESS,
    REFERRAL_SELL_TRADE_REPORT_FAILURE,

    REFERRAL_DEPOSIT_REPORT,
    REFERRAL_DEPOSIT_REPORT_SUCCESS,
    REFERRAL_DEPOSIT_REPORT_FAILURE,

    REFERRAL_SEND_EMAIL_REPORT,
    REFERRAL_SEND_EMAIL_REPORT_SUCCESS,
    REFERRAL_SEND_EMAIL_REPORT_FAILURE,

    REFERRAL_SEND_SMS_REPORT,
    REFERRAL_SEND_SMS_REPORT_SUCCESS,
    REFERRAL_SEND_SMS_REPORT_FAILURE,

    REFERRAL_SHARE_ON_FACEBOOK_REPORT,
    REFERRAL_SHARE_ON_FACEBOOK_REPORT_SUCCESS,
    REFERRAL_SHARE_ON_FACEBOOK_REPORT_FAILURE,

    REFERRAL_SHARE_ON_TWITTER_REPORT,
    REFERRAL_SHARE_ON_TWITTER_REPORT_SUCCESS,
    REFERRAL_SHARE_ON_TWITTER_REPORT_FAILURE,

    REFERRAL_CLICK_ON_REFERRAL_LINK_REPORT,
    REFERRAL_CLICK_ON_REFERRAL_LINK_REPORT_SUCCESS,
    REFERRAL_CLICK_ON_REFERRAL_LINK_REPORT_FAILURE,

} from "../types";

//For ReferralReport Data

/**
 * Redux Action To Referral Signup Report Data
 */
export const signupReport = data => ({
    type: REFERRAL_SIGNUP_REPORT,
    payload: data
});

/**
 * Redux Action To Referral Report Signup Data Success
 */
export const signupReportSuccess = data => ({
    type: REFERRAL_SIGNUP_REPORT_SUCCESS,
    payload: data
});

/**
 * Redux Action To Referral Report Signup Data Failure
 */
export const signupReportFailure = error => ({
    type: REFERRAL_SIGNUP_REPORT_FAILURE,
    payload: error
});

/**
 * Redux Action To Referral Buy Trade Report Data
 */
export const buyTradeReport = data => ({
    type: REFERRAL_BUY_TRADE_REPORT,
    payload: data
});

/**
 * Redux Action To Referral Buy Trade Report Data Success
 */
export const buyTradeReportSuccess = data => ({
    type: REFERRAL_BUY_TRADE_REPORT_SUCCESS,
    payload: data
});

/**
 * Redux Action To Referral Buy Trade Report Data Failure
 */
export const buyTradeReportFailure = error => ({
    type: REFERRAL_BUY_TRADE_REPORT_FAILURE,
    payload: error
});

/**
 * Redux Action To Referral Sell Trade Report Data
 */
export const sellTradeReport = data => ({
    type: REFERRAL_SELL_TRADE_REPORT,
    payload: data
});

/**
 * Redux Action To Referral Sell Trade Report Data Success
 */
export const sellTradeReportSuccess = data => ({
    type: REFERRAL_SELL_TRADE_REPORT_SUCCESS,
    payload: data
});

/**
 * Redux Action To Referral Sell Trade Report Data Failure
 */
export const sellTradeReportFailure = error => ({
    type: REFERRAL_SELL_TRADE_REPORT_FAILURE,
    payload: error
});

/**
 * Redux Action To Referral Deposit Report Data
 */
export const depositReport = data => ({
    type: REFERRAL_DEPOSIT_REPORT,
    payload: data
});

/**
 * Redux Action To Referral Deposit Report Data Success
 */
export const depositReportSuccess = data => ({
    type: REFERRAL_DEPOSIT_REPORT_SUCCESS,
    payload: data
});

/**
 * Redux Action To Referral Deposit Report Data Failure
 */
export const depositReportFailure = error => ({
    type: REFERRAL_DEPOSIT_REPORT_FAILURE,
    payload: error
});

/**
 * Redux Action To Referral Send Email Report Data
 */
export const sendEmailReport = data => ({
    type: REFERRAL_SEND_EMAIL_REPORT,
    payload: data
});

/**
 * Redux Action To Referral Send Email Report Data Success
 */
export const sendEmailReportSuccess = data => ({
    type: REFERRAL_SEND_EMAIL_REPORT_SUCCESS,
    payload: data
});

/**
 * Redux Action To Referral Send Email Report Data Failure
 */
export const sendEmailReportFailure = error => ({
    type: REFERRAL_SEND_EMAIL_REPORT_FAILURE,
    payload: error
});

/**
 * Redux Action To Referral Send SMS Report Data
 */
export const sendSMSReport = data => ({
    type: REFERRAL_SEND_SMS_REPORT,
    payload: data
});

/**
 * Redux Action To Referral Send SMS Report Data Success
 */
export const sendSMSReportSuccess = data => ({
    type: REFERRAL_SEND_SMS_REPORT_SUCCESS,
    payload: data
});

/**
 * Redux Action To Referral Send SMS Report Data Failure
 */
export const sendSMSReportFailure = error => ({
    type: REFERRAL_SEND_SMS_REPORT_FAILURE,
    payload: error
});

/**
 * Redux Action To Referral Share On Facebook Report Data
 */
export const shareOnFacebookReport = data => ({
    type: REFERRAL_SHARE_ON_FACEBOOK_REPORT,
    payload: data
});

/**
 * Redux Action To Referral Share On Facebook Report Data Success
 */
export const shareOnFacebookReportSuccess = data => ({
    type: REFERRAL_SHARE_ON_FACEBOOK_REPORT_SUCCESS,
    payload: data
});

/**
 * Redux Action To Referral Share On Facebook Report Data Failure
 */
export const shareOnFacebookReportFailure = error => ({
    type: REFERRAL_SHARE_ON_FACEBOOK_REPORT_FAILURE,
    payload: error
});

/**
 * Redux Action To Referral Share On Tweitter Report Data
 */
export const shareOnTwitterReport = data => ({
    type: REFERRAL_SHARE_ON_TWITTER_REPORT,
    payload: data
});

/**
 * Redux Action To Referral Share On Tweitter Report Data Success
 */
export const shareOnTwitterReportSuccess = data => ({
    type: REFERRAL_SHARE_ON_TWITTER_REPORT_SUCCESS,
    payload: data
});

/**
 * Redux Action To Referral Share On Tweitter Report Data Failure
 */
export const shareOnTwitterReportFailure = error => ({
    type: REFERRAL_SHARE_ON_TWITTER_REPORT_FAILURE,
    payload: error
});

/**
 * Redux Action To Referral Click On Referral Link Report Data
 */
export const clickOnReferralLinkReport = data => ({
    type: REFERRAL_CLICK_ON_REFERRAL_LINK_REPORT,
    payload: data
});

/**
 * Redux Action To Referral Click On Referral Link Report Data Success
 */
export const clickOnReferralLinkReportSuccess = data => ({
    type: REFERRAL_CLICK_ON_REFERRAL_LINK_REPORT_SUCCESS,
    payload: data
});

/**
 * Redux Action To Referral Click On Referral Link Report Data Failure
 */
export const clickOnReferralLinkReportFailure = error => ({
    type: REFERRAL_CLICK_ON_REFERRAL_LINK_REPORT_FAILURE,
    payload: error
});
