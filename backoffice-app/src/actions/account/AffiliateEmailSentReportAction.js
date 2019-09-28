import {
    //for affiliate email sent report list  
    AFFILIATE_EMAIL_SENT_REPORT,
    AFFILIATE_EMAIL_SENT_REPORT_SUCCESS,
    AFFILIATE_EMAIL_SENT_REPORT_FAILURE,

    //clear data reducer
    AFFILIATE_EMAIL_SENT_REPORT_CLEAR,
} from '../ActionTypes'
import { action } from '../GlobalActions';

// Redux action for affiliate email sent report list 
export function affiliateEmailSentReport(data) {
    return action(AFFILIATE_EMAIL_SENT_REPORT, { data })
}
// Redux action for affiliate email sent report list success
export function affiliateEmailSentReportSuccess(data) {
    return action(AFFILIATE_EMAIL_SENT_REPORT_SUCCESS, { data })
}
// Redux action for affiliate email sent report list failure
export function affiliateEmailSentReportFailure() {
    return action(AFFILIATE_EMAIL_SENT_REPORT_FAILURE)
}

//clear data reducer
export function affiliateEmailSentReportClear() {
    return action(AFFILIATE_EMAIL_SENT_REPORT_CLEAR)
}