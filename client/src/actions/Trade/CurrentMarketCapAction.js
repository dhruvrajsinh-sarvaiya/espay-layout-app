// Actions For Current Market Cap List By Tejas Date :14/9/2018

// import types
import {
  GET_MARKET_CAP_LIST,
  GET_MARKET_CAP_LIST_SUCCESS,
  GET_MARKET_CAP_LIST_FAILURE
} from "Actions/types";

//action for get Market Cap  list and set type for reducers
export const getMarketCapList = Pair => ({
  type: GET_MARKET_CAP_LIST,
  payload: Pair
});

//action for set Success and data to  Market Cap  list and set type for reducers
export const getMarketCapListSuccess = response => ({
  type: GET_MARKET_CAP_LIST_SUCCESS,
  payload: response.response
});

//action for set failure and error to  Market Cap  list and set type for reducers
export const getMarketCapListFailure = error => ({
  type: GET_MARKET_CAP_LIST_FAILURE,
  payload: error
});
