import {
  GET_INCOMINGTRANSACTONS_REPORT,
  GET_INCOMINGTRANSACTONS_REPORT_SUCCESS,
  GET_INCOMINGTRANSACTONS_REPORT_FAILURE
} from "Actions/types";

const INITIAL_STATE = {
  incomingTransactionsData: [],
  Loading: false
};

export default (state, action) => {
  if (typeof state === 'undefined') {
    return INITIAL_STATE
  }

  switch (action.type) {
    case GET_INCOMINGTRANSACTONS_REPORT:
      return { ...state, Loading: true };

    case GET_INCOMINGTRANSACTONS_REPORT_SUCCESS:
      return {
        ...state,
        Loading: false,
        incomingTransactionsData: action.payload
      };

    case GET_INCOMINGTRANSACTONS_REPORT_FAILURE:
      return { ...state, Loading: false };

    default:
      return { ...state };
  }
};
