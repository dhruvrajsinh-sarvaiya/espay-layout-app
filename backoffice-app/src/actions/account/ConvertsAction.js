import { REFERRAL_REWARD_REPORT, REFERRAL_REWARD_REPORT_SUCCESS, REFERRAL_REWARD_REPORT_FAILURE, CLEAR_REFERRAL_REWARD_REPORT } from "../ActionTypes";

// Redux action For referral Reward Report
export const referralRewardReport = (request) => ({
  type: REFERRAL_REWARD_REPORT,
  payload: request
})
// Redux action For referral Reward Report success
export const referralRewardReportSuccess = (responce) => ({
  type: REFERRAL_REWARD_REPORT_SUCCESS,
  payload: responce
})
// Redux action For referral Reward Report failure
export const referralRewardReportFailure = (error) => ({
  type: REFERRAL_REWARD_REPORT_FAILURE,
  payload: error
})

//clear reducer data
export const clearConvertsData = () => ({
  type: CLEAR_REFERRAL_REWARD_REPORT,
})