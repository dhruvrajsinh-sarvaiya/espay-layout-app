// Reducer for Header Detail Data By Tejas

import { NotificationManager } from "react-notifications";

import {
  GET_HEADER_INFO,
  GET_HEADER_INFO_SUCCESS,
  GET_HEADER_INFO_FAILURE
} from "Actions/types";

// Set Initial State
const INITIAL_STATE = {
  HeaderData: [],
  loading: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    // get Chart Detail
    case GET_HEADER_INFO:
      return { ...state, loading: true };

    // set Data Of  Chart Detail
    case GET_HEADER_INFO_SUCCESS:
      return { ...state, HeaderData: action.payload, loading: false };

    // Display Error for Chart Detail failure
    case GET_HEADER_INFO_FAILURE:
      NotificationManager.error("Header Data Not Found");
      return { ...state, loading: false, HeaderData: [] };

    default:
      return { ...state };
  }
};
