// Actions For Active Open My Order list By Tejas Date :14/9/2018

// import types
import {
  GET_ACTIVE_OPEN_MY_ORDER_LIST,
  GET_ACTIVE_OPEN_MY_ORDER_LIST_SUCCESS,
  GET_ACTIVE_OPEN_MY_ORDER_LIST_FAILURE
} from "Actions/types";

//action for get Active Open  My Order and set type for reducers
export const getOpenOrderList = payload => ({
  type: GET_ACTIVE_OPEN_MY_ORDER_LIST,
  payload: payload
});

//action for set Success and data to Active Open  My Order and set type for reducers
export const getOpenOrderListSuccess = response => ({
  type: GET_ACTIVE_OPEN_MY_ORDER_LIST_SUCCESS,
  payload: response.response
});

//action for set failure and error to Active Open My Order and set type for reducers
export const getOpenOrderListFailure = error => ({
  type: GET_ACTIVE_OPEN_MY_ORDER_LIST_FAILURE,
  payload: error
});
