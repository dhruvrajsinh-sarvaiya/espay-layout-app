import {
    //share on facebook list
    AFFILIATE_SHARE_ON_FACEBOOK_REPORT,
    AFFILIATE_SHARE_ON_FACEBOOK_REPORT_SUCCESS,
    AFFILIATE_SHARE_ON_FACEBOOK_REPORT_FAILURE,

    //clear reducer data
    AFFILIATE_FACEBOOK_REPORT_CLEAR
} from '../ActionTypes'
import { action } from '../GlobalActions';

// Redux action for share on facebook list 
export function affiliateShareOnFacebookReport(data) {
    return action(AFFILIATE_SHARE_ON_FACEBOOK_REPORT, { data })
}
// Redux action for share on facebook list succeess
export function affiliateShareOnFacebookReportSuccess(data) {
    return action(AFFILIATE_SHARE_ON_FACEBOOK_REPORT_SUCCESS, { data })
}
// Redux action for share on facebook list failure
export function affiliateShareOnFacebookReportFailure() {
    return action(AFFILIATE_SHARE_ON_FACEBOOK_REPORT_FAILURE)
}

//Clear reducer data
export function affiliateShareOnFacebookReportClear() {
    return action(AFFILIATE_FACEBOOK_REPORT_CLEAR)
}