import {
  GET_DEPOSIT_REPORT,
  GET_DEPOSIT_REPORT_SUCCESS,
  GET_DEPOSIT_REPORT_FAILURE,
  UPDATE_DEPOSIT_REPORT,
  UPDATE_DEPOSIT_REPORT_SUCCESS,
  UPDATE_DEPOSIT_REPORT_FAILURE
} from "Actions/types";

const INITIAL_STATE = {
  depositReportData: [],
  Loading: false
};

export default (state, action) => {
  if (typeof state === 'undefined') {
    return INITIAL_STATE
  }
  switch (action.type) {
    case GET_DEPOSIT_REPORT:
      return { ...state, Loading: true };

    case GET_DEPOSIT_REPORT_SUCCESS:
      return {
        ...state,
        Loading: false,
        depositReportData: action.payload
      };

    case GET_DEPOSIT_REPORT_FAILURE:
      return { ...state, Loading: false };

    case UPDATE_DEPOSIT_REPORT:
      return { ...state, loading: true };

    case UPDATE_DEPOSIT_REPORT_SUCCESS:
    case UPDATE_DEPOSIT_REPORT_FAILURE:
      return { ...state, loading: false, success: action.payload };

    default:
      return { ...state };
  }
};
