// Actions For Referral Summary Data By Tejas

// import types
import {
  GET_REFERRAL_SUMMARY_DATA,
  GET_REFERRAL_SUMMARY_DATA_SUCCESS,
  GET_REFERRAL_SUMMARY_DATA_FAILURE
} from "Actions/types";

//action for ge Referral Summary and set type for reducers
export const getReferralSummaryData = Pair => ({
  type: GET_REFERRAL_SUMMARY_DATA,
  payload: { Pair }
});

//action for set Success and Referral Summary and set type for reducers
export const getReferralSummarySuccess = response => ({
  type: GET_REFERRAL_SUMMARY_DATA_SUCCESS,
  payload: response.data
});

//action for set failure and error to Referral Summary and set type for reducers
export const getReferralSummaryFailure = error => ({
  type: GET_REFERRAL_SUMMARY_DATA_FAILURE,
  payload: error
});
