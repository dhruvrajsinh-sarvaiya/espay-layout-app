// Reducer For Handle Revenue List  By Tejas
// import types
import {
  GET_REVENUE_DATA,
  GET_REVENUE_DATA_SUCCESS,
  GET_REVENUE_DATA_FAILURE
} from "Actions/types";

// Set Initial State
const INITIAL_STATE = {
  revenueList: [],
  loading: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {

    // get Revenue List
    case GET_REVENUE_DATA:
      return { ...state, loading: true };

    // set Data Of Revenue List
    case GET_REVENUE_DATA_SUCCESS:
      return { ...state, revenueList: action.payload, loading: false };

    // Display Error for Revenue List failure
    case GET_REVENUE_DATA_FAILURE:

      return { ...state, loading: false, revenueList: [] };

    default:
      return { ...state };
  }
};
