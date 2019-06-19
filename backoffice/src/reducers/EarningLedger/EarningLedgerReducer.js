import {
  GET_EARNINGLEDGER_REPORT,
  GET_EARNINGLEDGER_REPORT_SUCCESS,
  GET_EARNINGLEDGER_REPORT_FAILURE
} from "Actions/types";

const INITIAL_STATE = {
  earningLedgerReportData: [],
  Loading: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_EARNINGLEDGER_REPORT:
      return { ...state, Loading: true };

    case GET_EARNINGLEDGER_REPORT_SUCCESS:
      return {
        ...state,
        Loading: false,
        earningLedgerReportData: action.payload
      };

    case GET_EARNINGLEDGER_REPORT_FAILURE:
      return { ...state, Loading: false };

    default:
      return { ...state };
  }
};
