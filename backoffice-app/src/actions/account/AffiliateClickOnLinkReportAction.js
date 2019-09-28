import {
    //for affliate click on link list
    AFFILIATE_CLICK_ON_LINK_REPORT,
    AFFILIATE_CLICK_ON_LINK_REPORT_SUCCESS,
    AFFILIATE_CLICK_ON_LINK_REPORT_FAILURE,

    //clear reducer data
    AFFILIATE_CLICK_ON_LINK_REPORT_CLEAR,
} from '../ActionTypes'
import { action } from '../GlobalActions';

// Redux action for affliate click on link list 
export function affiliateClickOnLinkReport(data) {
    return action(AFFILIATE_CLICK_ON_LINK_REPORT, { data })
}
// Redux action for affliate click on link list 
export function affiliateClickOnLinkReportSuccess(data) {
    return action(AFFILIATE_CLICK_ON_LINK_REPORT_SUCCESS, { data })
}
// Redux action for affliate click on link list 
export function affiliateClickOnLinkReportFailure() {
    return action(AFFILIATE_CLICK_ON_LINK_REPORT_FAILURE)
}

//clear reducer data
export function affiliateClickOnLinkReportClear() {
    return action(AFFILIATE_CLICK_ON_LINK_REPORT_CLEAR)
}