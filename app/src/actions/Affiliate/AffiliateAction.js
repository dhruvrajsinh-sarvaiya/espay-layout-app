import {
    // Get Affiliate Data
    GET_AFFILIATE_DATA,
    GET_AFFILIATE_DATA_SUCCESS,
    GET_AFFILIATE_DATA_FAILURE,

    // Get Email Send Report
    GET_EMAIL_SEND_REPORT,
    GET_EMAIL_SEND_REPORT_SUCCESS,
    GET_EMAIL_SEND_REPORT_FAILURE,

    // Get Click On Link Report
    GET_CLICK_ON_LINK_REPORT,
    GET_CLICK_ON_LINK_REPORT_SUCCESS,
    GET_CLICK_ON_LINK_REPORT_FAILURE,

    // Get Commission Report
    GET_COMMISSION_REPORT,
    GET_COMMISSION_REPORT_SUCCESS,
    GET_COMMISSION_REPORT_FAILURE,

    // Get SMS Send Report
    GET_SMS_SEND_REPORT,
    GET_SMS_SEND_REPORT_SUCCESS,
    GET_SMS_SEND_REPORT_FAILURE,

    // Get Facebook Share Report
    GET_FACEBOOK_SHARE_REPORT,
    GET_FACEBOOK_SHARE_REPORT_SUCCESS,
    GET_FACEBOOK_SHARE_REPORT_FAILURE,

    // Get Twitter Share Report
    GET_TWITTER_SHARE_REPORT,
    GET_TWITTER_SHARE_REPORT_SUCCESS,
    GET_TWITTER_SHARE_REPORT_FAILURE,

    // Get Affiliate Signup Report
    GET_AFFILIATE_SIGNUP_REPORT,
    GET_AFFILIATE_SIGNUP_REPORT_SUCCESS,
    GET_AFFILIATE_SIGNUP_REPORT_FAILURE,

    // Get Affiliate User List
    GET_AFFILIATE_USER_LIST,
    GET_AFFILIATE_USER_LIST_SUCCESS,
    GET_AFFILIATE_USER_LIST_FAILURE,

    // Clear Affiliate Data
    CLEAR_AFFILIATE_DATA,

    // Get Scheme Mapping Ids
    GET_SCHEME_MAPPING_IDS,
    GET_SCHEME_MAPPING_IDS_SUCCESS,
    GET_SCHEME_MAPPING_IDS_FAILURE,

    // Get Affiliate Pie Chart Data
    GET_AFFILIATE_PIE_CHART_DATA,
    GET_AFFILIATE_PIE_CHART_DATA_SUCCESS,
    GET_AFFILIATE_PIE_CHART_DATA_FAILURE,

    // Get Affiliate Line Chart Data
    GET_AFFILIATE_LINE_CHART_DATA,
    GET_AFFILIATE_LINE_CHART_DATA_SUCCESS,
    GET_AFFILIATE_LINE_CHART_DATA_FAILURE

} from '../ActionTypes'
import { action } from '../GlobalActions';

// Redux action to Get Affiliate Data
export function GetAffiliatedata() {
    return action(GET_AFFILIATE_DATA)
}
// Redux action to Get Affiliate Data Success
export function AffiliatedataSuccess(data) {
    return action(GET_AFFILIATE_DATA_SUCCESS, { data })
}
// Redux action to Get Affiliate Data Failure
export function AffiliatedataFailure() {
    return action(GET_AFFILIATE_DATA_FAILURE)
}

// Redux action to Get Email Send Data
export function GetEmailSendData(payload) {
    return action(GET_EMAIL_SEND_REPORT, { payload })
}
// Redux action to Get Email Send Data Success
export function EmailSendDataSuccess(data) {
    return action(GET_EMAIL_SEND_REPORT_SUCCESS, { data })
}
// Redux action to Get Email Send Data Failure
export function EmailSendDataFailure() {
    return action(GET_EMAIL_SEND_REPORT_FAILURE)
}

// Redux action to Get Click On Link Report
export function getClikOnLinkReport(payload) {
    return action(GET_CLICK_ON_LINK_REPORT, { payload })
}
// Redux action to Get Click On Link Report Success
export function getClikOnLinkReportSuccess(data) {
    return action(GET_CLICK_ON_LINK_REPORT_SUCCESS, { data })
}
// Redux action to Get Click On Link Report Failure
export function getClikOnLinkReportFailure() {
    return action(GET_CLICK_ON_LINK_REPORT_FAILURE)
}

// Redux action to Get Commission Report
export function getCommissionReport(payload) {
    return action(GET_COMMISSION_REPORT, { payload })
}
// Redux action to Get Commission Report Success
export function getCommissionReportSuccess(data) {
    return action(GET_COMMISSION_REPORT_SUCCESS, { data })
}
// Redux action to Get Commission Report Failure
export function getCommissionReportFailure() {
    return action(GET_COMMISSION_REPORT_FAILURE)
}

// Redux action to Get Sms Data
export function GetSmsSendData(payload) {
    return action(GET_SMS_SEND_REPORT, { payload })
}
// Redux action to Get Sms Data Success
export function SmsSendDataSuccess(data) {
    return action(GET_SMS_SEND_REPORT_SUCCESS, { data })
}
// Redux action to Get Sms Data Failure
export function SmsSendDataFailure() {
    return action(GET_SMS_SEND_REPORT_FAILURE)
}

// Redux action to Get Facebook Share Data
export function GetFacebookShareData(payload) {
    return action(GET_FACEBOOK_SHARE_REPORT, { payload })
}
// Redux action to Get Facebook Share Data Success
export function FacebookShareDataSuccess(data) {
    return action(GET_FACEBOOK_SHARE_REPORT_SUCCESS, { data })
}
// Redux action to Get Facebook Share Data Failure
export function FacebookShareDataFailure() {
    return action(GET_FACEBOOK_SHARE_REPORT_FAILURE)
}

// Redux action to Get Twitter Share Data
export function GetTwitterShareData(payload) {
    return action(GET_TWITTER_SHARE_REPORT, { payload })
}
// Redux action to Get Twitter Share Data Success
export function TwitterShareDataSuccess(data) {
    return action(GET_TWITTER_SHARE_REPORT_SUCCESS, { data })
}
// Redux action to Get Twitter Share Data Failure
export function TwitterShareDataFailure() {
    return action(GET_TWITTER_SHARE_REPORT_FAILURE)
}

// Redux action to Get Affiliate Signup Data
export function GetAffiliateSignupData(payload) {
    return action(GET_AFFILIATE_SIGNUP_REPORT, { payload })
}
// Redux action to Get Affiliate Signup Data Success
export function AffiliateSignupDataSuccess(data) {
    return action(GET_AFFILIATE_SIGNUP_REPORT_SUCCESS, { data })
}
// Redux action to Get Affiliate Signup Data
export function AffiliateSignupDataFailure() {
    return action(GET_AFFILIATE_SIGNUP_REPORT_FAILURE)
}

// Redux action to Get Affiliate User List
export function getAffiliateUserList() {
    return action(GET_AFFILIATE_USER_LIST)
}
// Redux action to Get Affiliate User List Success
export function getAffiliateUserListSuccess(data) {
    return action(GET_AFFILIATE_USER_LIST_SUCCESS, { data })
}
// Redux action to Get Affiliate User List Failure
export function getAffiliateUserListFailure() {
    return action(GET_AFFILIATE_USER_LIST_FAILURE)
}

// Redux action to Get Scheme Mapping Ids
export function getSchemeMappigIds(payload) {
    return action(GET_SCHEME_MAPPING_IDS, { payload })
}
// Redux action to Get Scheme Mapping Ids Success
export function getSchemeMappigIdsSuccess(payload) {
    return action(GET_SCHEME_MAPPING_IDS_SUCCESS, { payload })
}
// Redux action to Get Scheme Mapping Ids Failure
export function getSchemeMappigIdsFailure() {
    return action(GET_SCHEME_MAPPING_IDS_FAILURE)
}

// Redux action to Get Pie Chart Data
export function getPieChartData() {
    return action(GET_AFFILIATE_PIE_CHART_DATA)
}
// Redux action to Get Pie Chart Data Success
export function getPieChartDataSuccess(data) {
    return action(GET_AFFILIATE_PIE_CHART_DATA_SUCCESS, { data })
}
// Redux action to Get Pie Chart Data Failure
export function getPieChartDataFailure() {
    return action(GET_AFFILIATE_PIE_CHART_DATA_FAILURE)
}

// Redux action to Get Line Chart Data
export function getLineChartData(payload) {
    return action(GET_AFFILIATE_LINE_CHART_DATA,{ payload })
}
// Redux action to Get Line Chart Data Success
export function getLineChartDataSuccess(data) {
    return action(GET_AFFILIATE_LINE_CHART_DATA_SUCCESS, { data })
}
// Redux action to Get Line Chart Data Failure
export function getLineChartDataFailure() {
    return action(GET_AFFILIATE_LINE_CHART_DATA_FAILURE)
}

//for clear data
export function clearAffiliateData() {
    return action(CLEAR_AFFILIATE_DATA)
}