import {
  GET_TRANSACTIONRETRY_REPORT,
  GET_TRANSACTIONRETRY_REPORT_SUCCESS,
  GET_TRANSACTIONRETRY_REPORT_FAILURE
} from "Actions/types";

const INITIAL_STATE = {
  transactionRetryData: [],
  Loading: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_TRANSACTIONRETRY_REPORT:
      return { ...state, Loading: true };

    case GET_TRANSACTIONRETRY_REPORT_SUCCESS:
      return {
        ...state,
        Loading: false,
        transactionRetryData: action.payload
      };

    case GET_TRANSACTIONRETRY_REPORT_FAILURE:
      return { ...state, Loading: false };

    default:
      return { ...state };
  }
};
