// Actions for Trade Route LIst,add and update

import {
  //list
  GET_TRADE_ROUTE_LIST,
  GET_TRADE_ROUTE_LIST_SUCCESS,
  GET_TRADE_ROUTE_LIST_FAILURE,

  ADD_TRADE_ROUTE_LIST,
  ADD_TRADE_ROUTE_LIST_SUCCESS,
  ADD_TRADE_ROUTE_LIST_FAILURE,

  UPDATE_TRADE_ROUTE_LIST,
  UPDATE_TRADE_ROUTE_LIST_SUCCESS,
  UPDATE_TRADE_ROUTE_LIST_FAILURE,

  GET_ORDER_TYPE_LIST,
  GET_ORDER_TYPE_LIST_SUCCESS,
  GET_ORDER_TYPE_LIST_FAILURE,

  GET_AVAILABLE_ROUTES_LIST,
  GET_AVAILABLE_ROUTES_LIST_SUCCESS,
  GET_AVAILABLE_ROUTES_LIST_FAILURE,

} from "../types";

//LIST METHODS
export const getTradeRouteList = (Data) => ({
  type: GET_TRADE_ROUTE_LIST,
  payload: { Data }
});
export const getTradeRouteListSuccess = response => ({
  type: GET_TRADE_ROUTE_LIST_SUCCESS,
  payload: response.Response
});
export const getTradeRouteListFailure = error => ({
  type: GET_TRADE_ROUTE_LIST_FAILURE,
  payload: error
});

//Add METHODS
export const addTradeRouteList = (Data) => ({
  type: ADD_TRADE_ROUTE_LIST,
  payload: { Data }
});
export const addTradeRouteListSuccess = response => ({
  type: ADD_TRADE_ROUTE_LIST_SUCCESS,
  payload: response
});
export const addTradeRouteListFailure = error => ({
  type: ADD_TRADE_ROUTE_LIST_FAILURE,
  payload: error
});


//Update METHODS
export const updateTradeRouteList = (Data) => ({
  type: UPDATE_TRADE_ROUTE_LIST,
  payload: { Data }
});
export const updateTradeRouteListSuccess = response => ({
  type: UPDATE_TRADE_ROUTE_LIST_SUCCESS,
  payload: response.Response
});
export const updateTradeRouteListFailure = error => ({
  type: UPDATE_TRADE_ROUTE_LIST_FAILURE,
  payload: error
});


//Update METHODS
export const getOrderTypeList = (Data) => ({
  type: GET_ORDER_TYPE_LIST,
  payload: { Data }
});
export const getOrderTypeListSuccess = response => ({
  type: GET_ORDER_TYPE_LIST_SUCCESS,
  payload: response.Response
});
export const getOrderTypeListFailure = error => ({
  type: GET_ORDER_TYPE_LIST_FAILURE,
  payload: error
});


//Update METHODS
export const getAvailableRoutes = (Data) => ({
  type: GET_AVAILABLE_ROUTES_LIST,
  payload: { Data }
});
export const getAvailableRoutesSuccess = response => ({
  type: GET_AVAILABLE_ROUTES_LIST_SUCCESS,
  payload: response.Response
});
export const getAvailableRoutesFailure = error => ({
  type: GET_AVAILABLE_ROUTES_LIST_FAILURE,
  payload: error
});

