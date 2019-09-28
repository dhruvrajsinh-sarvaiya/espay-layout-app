import { CLICK_REFERRAL_LINK_REPORT, CLICK_REFERRAL_LINK_REPORT_SUCCESS, CLICK_REFERRAL_LINK_REPORT_FAILURE, CLEAR_CLICK_REFERRAL_LINK_REPORT } from "../ActionTypes";

// Redux action for Get clickReferralLinkReport list
export const clickReferralLinkReport = (request) => ({
    type: CLICK_REFERRAL_LINK_REPORT,
    payload: request
})
// Redux action for Get clickReferralLinkReport list success
export const clickReferralLinkReportSuccess = (responce) => ({
    type: CLICK_REFERRAL_LINK_REPORT_SUCCESS,
    payload: responce
})
// Redux action for Get clickReferralLinkReport list failure
export const clickReferralLinkReportFailure = (error) => ({
    type: CLICK_REFERRAL_LINK_REPORT_FAILURE,
    payload: error
})

//for clear reducer data
export const clearReferalClickLinkData = () => ({
    type: CLEAR_CLICK_REFERRAL_LINK_REPORT,
})

