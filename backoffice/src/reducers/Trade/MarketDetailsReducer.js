// Reducer for Market Detail Data By Tejas

import {
  GET_MARKET_DETAIL_DATA,
  GET_MARKET_DETAIL_DATA_SUCCESS,
  GET_MARKET_DETAIL_DATA_FAILURE
} from "Actions/types";

// Set Initial State
const INITIAL_STATE = {
  marketDetails: [],
  loading: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    // get Chart Detail
    case GET_MARKET_DETAIL_DATA:
      return { ...state, loading: true };

    // set Data Of  Chart Detail
    case GET_MARKET_DETAIL_DATA_SUCCESS:
      
      return { ...state, marketDetails: action.payload, loading: false };

    // Display Error for Chart Detail failure
    case GET_MARKET_DETAIL_DATA_FAILURE:
      
      return { ...state, loading: false, marketDetails: [] };

    default:
      return { ...state };
  }
};
