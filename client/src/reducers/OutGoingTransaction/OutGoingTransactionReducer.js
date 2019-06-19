import {
  GET_OUTGOINGTRANSACTION_REPORT,
  GET_OUTGOINGTRANSACTION_REPORT_SUCCESS,
  GET_OUTGOINGTRANSACTION_REPORT_FAILURE
} from "Actions/types";

const INITIAL_STATE = {
  outGoingTransactionsData: [],
  Loading: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_OUTGOINGTRANSACTION_REPORT:
      return { ...state, Loading: true };

    case GET_OUTGOINGTRANSACTION_REPORT_SUCCESS:
      return {
        ...state,
        Loading: false,
        outGoingTransactionsData: action.payload
      };

    case GET_OUTGOINGTRANSACTION_REPORT_FAILURE:
      return { ...state, Loading: false };

    default:
      return { ...state };
  }
};
