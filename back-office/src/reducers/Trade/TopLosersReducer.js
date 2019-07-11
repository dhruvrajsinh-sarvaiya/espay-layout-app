// Reducer for Top Gainers Detail Data By Tejas

import {
  GET_TOP_LOSERS_DATA,
  GET_TOP_LOSERS_DATA_SUCCESS,
  GET_TOP_LOSERS_DATA_FAILURE
} from "Actions/types";

// Set Initial State
const INITIAL_STATE = {
  topLosers: [],
  loading: false,
  error: []
};

export default (state, action) => {
  if (typeof state === 'undefined') {
    return INITIAL_STATE
  }
  switch (action.type) {
    // get losers Detail
    case GET_TOP_LOSERS_DATA:
      return { ...state, loading: true };

    // set Data Of  losers Detail
    case GET_TOP_LOSERS_DATA_SUCCESS:
      return { ...state, topLosers: action.payload, loading: false, error: [] };

    // Display Error for losers Detail failure
    case GET_TOP_LOSERS_DATA_FAILURE:

      return { ...state, loading: false, topLosers: [], error: action.payload };

    default:
      return { ...state };
  }
};
