// AffiliateTwitterShareReportAction.js
import {

    //share on twitter list
    AFFILIATE_SHARE_ON_TWITTER_REPORT,
    AFFILIATE_SHARE_ON_TWITTER_REPORT_SUCCESS,
    AFFILIATE_SHARE_ON_TWITTER_REPORT_FAILURE,

    //clear data for reducer
    AFFILIATE_TWITTER_REPORT_CLEAR
} from '../ActionTypes'
import { action } from '../GlobalActions';

// Redux action for share on twitter list
export function affiliateShareOnTwitterReport(data) {
    return action(AFFILIATE_SHARE_ON_TWITTER_REPORT, { data })
}
// Redux action for share on twitter list success
export function affiliateShareOnTwitterReportSuccess(data) {
    return action(AFFILIATE_SHARE_ON_TWITTER_REPORT_SUCCESS, { data })
}
// Redux action for share on twitter list failure
export function affiliateShareOnTwitterReportFailure() {
    return action(AFFILIATE_SHARE_ON_TWITTER_REPORT_FAILURE)
}

//clear data for reducer
export function affiliateShareOnTwitterReportClear() {
    return action(AFFILIATE_TWITTER_REPORT_CLEAR)
}