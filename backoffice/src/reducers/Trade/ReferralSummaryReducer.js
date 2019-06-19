// Reducer for Referral Summary Detail Data By Tejas

import { NotificationManager } from "react-notifications";

import {
  GET_REFERRAL_SUMMARY_DATA,
  GET_REFERRAL_SUMMARY_DATA_SUCCESS,
  GET_REFERRAL_SUMMARY_DATA_FAILURE
} from "Actions/types";

// Set Initial State
const INITIAL_STATE = {
  referralSummary: [],
  loading: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    // get Referral Summary Detail
    case GET_REFERRAL_SUMMARY_DATA:
      return { ...state, loading: true };

    // set Data Of  Referral Summary Detail
    case GET_REFERRAL_SUMMARY_DATA_SUCCESS:
      return { ...state, referralSummary: action.payload, loading: false };

    // Display Error for Referral Summary Detail failure
    case GET_REFERRAL_SUMMARY_DATA_FAILURE:
      NotificationManager.error("Top Losers Data Not Found");
      return { ...state, loading: false, referralSummary: [] };

    default:
      return { ...state };
  }
};
