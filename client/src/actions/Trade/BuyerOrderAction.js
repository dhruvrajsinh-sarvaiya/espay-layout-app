// Actions For Buyer Order Data list By Tejas Date :14/9/2018

// import types
import {
  GET_BUYER_ORDER_LIST,
  GET_BUYER_ORDER_LIST_SUCCESS,
  GET_BUYER_ORDER_LIST_FAILURE,
  CLOSE_SOCKET_CONNECTION,
  CHANGE_BUY_PAIR_SOCKET
} from "Actions/types";

//action for get Buyer Order list and set type for reducers
export const getBuyerOrderList = buyerOrderRequest => ({
  type: GET_BUYER_ORDER_LIST,
  payload: buyerOrderRequest
});

//action for set Success and data to  Buyer Order list and set type for reducers
export const getBuyerOrderListSuccess = response => ({
  type: GET_BUYER_ORDER_LIST_SUCCESS,
  payload: response.response
});

//action for set failure and error to  Buyer Order list and set type for reducers
export const getBuyerOrderListFailure = error => ({
  type: GET_BUYER_ORDER_LIST_FAILURE,
  payload: error
});

// action for close buy socket connection
export const closeBuySocketConnection = closeConnectionRequest => ({
  type: CLOSE_SOCKET_CONNECTION,
  payload: closeConnectionRequest
});

// action for change buy socket connection when pair changed
export const changeBuyPairSocket = changeBuyPairSocketRequest => ({
  type: CHANGE_BUY_PAIR_SOCKET,
  payload: changeBuyPairSocketRequest
});
