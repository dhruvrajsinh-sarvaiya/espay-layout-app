import {
  GET_DEAMONBALANCE_REPORT,
  GET_DEAMONBALANCE_REPORT_SUCCESS,
  GET_DEAMONBALANCE_REPORT_FAILURE
} from "Actions/types";

const INITIAL_STATE = {
  deamonBalanceReportData: [],
  Loading: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_DEAMONBALANCE_REPORT:
      return {
        ...state,
        Loading: true
      };

    case GET_DEAMONBALANCE_REPORT_SUCCESS:
      return {
        ...state,
        Loading: false,
        deamonBalanceReportData: action.payload
      };

    case GET_DEAMONBALANCE_REPORT_FAILURE:
      return { ...state, Loading: false };

    default:
      return { ...state };
  }
};
