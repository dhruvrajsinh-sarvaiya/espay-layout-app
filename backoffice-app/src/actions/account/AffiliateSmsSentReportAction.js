import {
    //for affiliate sms sent report list 
    AFFILIATE_SMS_SENT_REPORT,
    AFFILIATE_SMS_SENT_REPORT_SUCCESS,
    AFFILIATE_SMS_SENT_REPORT_FAILURE,

    //clear reducer data
    AFFILIATE_SMS_SENT_REPORT_CLEAR,
} from '../ActionTypes'
import { action } from '../GlobalActions';

// Redux action for affiliate sms sent report list 
export function affiliateSmsSentReport(data) {
    return action(AFFILIATE_SMS_SENT_REPORT, { data })
}
// Redux action for affiliate sms sent report list success
export function affiliateSmsSentReportSuccess(data) {
    return action(AFFILIATE_SMS_SENT_REPORT_SUCCESS, { data })
}
// Redux action for affiliate sms sent report list failure
export function affiliateSmsSentReportFailure() {
    return action(AFFILIATE_SMS_SENT_REPORT_FAILURE)
}

//clear reducer data
export function affiliateSmsSentReportClear() {
    return action(AFFILIATE_SMS_SENT_REPORT_CLEAR)
}