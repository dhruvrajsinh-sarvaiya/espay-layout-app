// Reducer for Chart Detail Data By Tejas Date: 7/1/2019

import {
  GET_CHART_DATA,
  GET_CHART_DATA_SUCCESS,
  GET_CHART_DATA_FAILURE
} from "Actions/types";

// Set Initial State
const INITIAL_STATE = {
  chartData: [],
  loading: false,
  error: []
};

export default (state, action) => {
  if (typeof state === 'undefined') {
    return INITIAL_STATE
  }
  switch (action.type) {

    case GET_CHART_DATA:
      return { ...state, loading: true };
    // set Data Of  Chart Detail
    case GET_CHART_DATA_SUCCESS:

      return { ...state, chartData: action.payload, loading: false, error: [] };
    // Display Error for Chart Detail failure
    case GET_CHART_DATA_FAILURE:

      return { ...state, loading: false, chartData: [], error: action.payload };
    default:
      return { ...state };
  }
};
