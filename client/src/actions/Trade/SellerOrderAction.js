// Actions For Seller Order Action list By Tejas Date :14/9/2018

// import types
import {
  GET_SELLER_ORDER_LIST,
  GET_SELLER_ORDER_LIST_SUCCESS,
  GET_SELLER_ORDER_LIST_FAILURE,
  CHANGE_SELL_PAIR_SOCKET,
  CLOSE_SOCKET_CONNECTION
} from "Actions/types";

//action for get Seller Order list and set type for reducers
export const getSellerOrderList = sellerOrderListRequest => ({
  type: GET_SELLER_ORDER_LIST,
  payload: sellerOrderListRequest
});

//action for set Success and data to  Seller Order list and set type for reducers
export const getSellerOrderListSuccess = response => ({
  type: GET_SELLER_ORDER_LIST_SUCCESS,
  payload: response.response
});

//action for set failure and error to  Seller Order list and set type for reducers
export const getSellerOrderListFailure = error => ({
  type: GET_SELLER_ORDER_LIST_FAILURE,
  payload: error
});

// action for close socket connection
export const closeSellSocketConnection = closeConnectionRequest => ({
  type: CLOSE_SOCKET_CONNECTION,
  payload: closeConnectionRequest
});

// action for change socket connection when pair change
export const changeSellPairSocket = changeSellPairSocketRequest => ({
  type: CHANGE_SELL_PAIR_SOCKET,
  payload: changeSellPairSocketRequest
});
