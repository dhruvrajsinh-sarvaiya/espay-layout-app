// Actions For Open Order list By Tejas Date :14/9/2018

// import types
import {
  GET_ACTIVE_OPEN_ORDER_LIST,
  GET_ACTIVE_OPEN_ORDER_LIST_SUCCESS,
  GET_ACTIVE_OPEN_ORDER_LIST_FAILURE,
  DO_CANCEL_ORDER,
  DO_CANCEL_ORDER_SUCCESS,
  DO_CANCEL_ORDER_FAILURE
} from "Actions/types";

//action for get Open Order  and set type for reducers
export const getActiveOpenOrderList = Pair => ({
  type: GET_ACTIVE_OPEN_ORDER_LIST,
  payload: { Pair }
});

//action for set Success and data to Open Order  and set type for reducers
export const getActiveOpenOrderListSuccess = response => ({
  type: GET_ACTIVE_OPEN_ORDER_LIST_SUCCESS,
  payload: response.response
});

//action for set failure and error to Open Order  and set type for reducers
export const getActiveOpenOrderListFailure = error => ({
  type: GET_ACTIVE_OPEN_ORDER_LIST_FAILURE,
  payload: error
});

//action for do Cancel Order and set type for reducers
export const doCancelOrder = Order => ({
  type: DO_CANCEL_ORDER,
  payload: { Order }
});

//action for set Success and data for do Cancel Order  and set type for reducers
export const doCancelOrderSuccess = response => ({
  type: DO_CANCEL_ORDER_SUCCESS,
  payload: response.data
});

//action for set failure and error to do Cancel Order  and set type for reducers
export const doCancelOrderFailure = error => ({
  type: DO_CANCEL_ORDER_FAILURE,
  payload: error
});
