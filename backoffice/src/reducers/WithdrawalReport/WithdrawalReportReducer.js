import {
  GET_WITHDRAWAL_REPORT,
  GET_WITHDRAWAL_REPORT_SUCCESS,
  GET_WITHDRAWAL_REPORT_FAILURE,
  UPDATE_WITHDRAWAL_REPORT,
  UPDATE_WITHDRAWAL_REPORT_SUCCESS,
  UPDATE_WITHDRAWAL_REPORT_FAILURE
} from "Actions/types";

// initial state
const INITIAL_STATE = {
  withdrawalReportData: [],
  Loading: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_WITHDRAWAL_REPORT:
      return { ...state, Loading: true };

    case GET_WITHDRAWAL_REPORT_SUCCESS:
      return {
        ...state,
        Loading: false,
        withdrawalReportData: action.payload
      };

    case GET_WITHDRAWAL_REPORT_FAILURE:
      return { ...state, Loading: false };

    case UPDATE_WITHDRAWAL_REPORT:
      return { ...state, loading: true, success: action.payload };

    case UPDATE_WITHDRAWAL_REPORT_SUCCESS:
      return { ...state, loading: false, success: action.payload };

    case UPDATE_WITHDRAWAL_REPORT_FAILURE:
      return { ...state, loading: false };

    default:
      return { ...state };
  }
};
