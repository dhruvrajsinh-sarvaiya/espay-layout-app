// Reducer for Top Gainers Detail Data By Tejas

import {
  GET_TOP_GAINERS_DATA,
  GET_TOP_GAINERS_DATA_SUCCESS,
  GET_TOP_GAINERS_DATA_FAILURE,
  GET_TOP_GAINERS_LOSERS_DATA,
  GET_TOP_GAINERS_LOSERS_DATA_SUCCESS,
  GET_TOP_GAINERS_LOSERS_DATA_FAILURE
} from "Actions/types";

// Set Initial State
const INITIAL_STATE = {
  topGainers: [],
  topGainersLosers: [],
  loading: false,
  error: [],
  errorGainers: []
};

export default (state, action) => {
  if (typeof state === 'undefined') {
    return INITIAL_STATE
  }
  switch (action.type) {
    // get gainers Detail
    case GET_TOP_GAINERS_DATA:
        case GET_TOP_GAINERS_LOSERS_DATA:
      return { ...state, loading: true };

    // set Data Of  gainers Detail
    case GET_TOP_GAINERS_DATA_SUCCESS:
      return { ...state, topGainers: action.payload, loading: false, error: [] };

    // Display Error for gainers Detail failure
    case GET_TOP_GAINERS_DATA_FAILURE:

      return { ...state, loading: false, topGainers: [], error: action.payload };
    // get gainers and losers Detail 

    // set Data Of  gainers and losers Detail 
    case GET_TOP_GAINERS_LOSERS_DATA_SUCCESS:
      return { ...state, topGainersLosers: action.payload, loading: false, errorGainers: [] };

    // Display Error for gainers and losers Detail  failure
    case GET_TOP_GAINERS_LOSERS_DATA_FAILURE:

      return { ...state, loading: false, topGainersLosers: [], errorGainers: action.payload };

    default:
      return { ...state };
  }
};
