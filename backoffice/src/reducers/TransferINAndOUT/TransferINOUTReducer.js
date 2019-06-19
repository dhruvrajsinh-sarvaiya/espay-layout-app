import {
  GET_TRANSFERINOUT_REPORT,
  GET_TRANSFERINOUT_REPORT_SUCCESS,
  GET_TRANSFERINOUT_REPORT_FAILURE
} from "Actions/types";

const INITIAL_STATE = {
  transferInOutData: [],
  Loading: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_TRANSFERINOUT_REPORT:
      return { ...state, Loading: true };

    case GET_TRANSFERINOUT_REPORT_SUCCESS:
      return {
        ...state,
        Loading: false,
        transferInOutData: action.payload
      };

    case GET_TRANSFERINOUT_REPORT_FAILURE:
      return { ...state, Loading: false };

    default:
      return { ...state };
  }
};
