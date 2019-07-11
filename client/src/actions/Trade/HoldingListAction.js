// Actions For Holding Action list By Tejas Date :14/9/2018

// import types
import {
  GET_HOLDING_LIST,
  GET_HOLDING_LIST_SUCCESS,
  GET_HOLDING_LIST_FAILURE
} from "Actions/types";

//action for get Holding list and set type for reducers
export const getHoldingList = Pair => ({
  type: GET_HOLDING_LIST,
  payload: { Pair }
});

//action for set Success and data to  Holding list and set type for reducers
export const getHoldingListSuccess = response => ({
  type: GET_HOLDING_LIST_SUCCESS,
  payload: response.data
});

//action for set failure and error to  Holding list and set type for reducers
export const getHoldingListFailure = error => ({
  type: GET_HOLDING_LIST_FAILURE,
  payload: error
});
