// Actions For Exchange Feed Configuration List By Tejas

// import types
import {
  GET_EXCHANGE_FEED_CONFIGURATION_LIST,
  GET_EXCHANGE_FEED_CONFIGURATION_LIST_SUCCESS,
  GET_EXCHANGE_FEED_CONFIGURATION_LIST_FAILURE,
  ADD_EXCHANGE_FEED_CONFIGURATION_LIST,
  ADD_EXCHANGE_FEED_CONFIGURATION_LIST_SUCCESS,
  ADD_EXCHANGE_FEED_CONFIGURATION_LIST_FAILURE,
  UPDATE_EXCHANGE_FEED_CONFIGURATION_LIST,
  UPDATE_EXCHANGE_FEED_CONFIGURATION_LIST_SUCCESS,
  UPDATE_EXCHANGE_FEED_CONFIGURATION_LIST_FAILURE,
  GET_EXCHANGE_FEED_CONFIGURATION_METHOD_LIST,
  GET_EXCHANGE_FEED_CONFIGURATION_METHOD_LIST_SUCCESS,
  GET_EXCHANGE_FEED_CONFIGURATION_METHOD_LIST_FAILURE,
  GET_EXCHANGE_FEED_CONFIGURATION_LIMIT_LIST,
  GET_EXCHANGE_FEED_CONFIGURATION_LIMIT_LIST_SUCCESS,
  GET_EXCHANGE_FEED_CONFIGURATION_LIMIT_LIST_FAILURE
} from "Actions/types";

//action for Exchange Feed Configuration List and set type for reducers
export const getExchangeFeedConfigList = Data => ({
  type: GET_EXCHANGE_FEED_CONFIGURATION_LIST,
  payload: { Data }
});

//action for set Success and Exchange Feed Configuration List and set type for reducers
export const getExchangeFeedListSuccess = response => ({
  type: GET_EXCHANGE_FEED_CONFIGURATION_LIST_SUCCESS,
  payload: response.Response
});

//action for set failure and error to Exchange Feed Configuration List and set type for reducers
export const getExchangeFeedListFailure = error => ({
  type: GET_EXCHANGE_FEED_CONFIGURATION_LIST_FAILURE,
  payload: error
});

//action for add Exchange Feed Configuration List and set type for reducers
export const addExchangeConfigurationList = Data => ({
  type: ADD_EXCHANGE_FEED_CONFIGURATION_LIST,
  payload: { Data }
});

//action for set Success and add Exchange Feed Configuration List and set type for reducers
export const addExchangeConfigurationListSuccess = response => ({
  type: ADD_EXCHANGE_FEED_CONFIGURATION_LIST_SUCCESS,
  payload: response
});

//action for set failure and error to add Exchange Feed Configuration List and set type for reducers
export const addExchangeConfigurationListFailure = error => ({
  type: ADD_EXCHANGE_FEED_CONFIGURATION_LIST_FAILURE,
  payload: error
});

//action for update Exchange Feed Configuration List and set type for reducers
export const updateExchangeConfigurationList = Data => ({
  type: UPDATE_EXCHANGE_FEED_CONFIGURATION_LIST,
  payload: { Data }
});

//action for set Success and update Exchange Feed Configuration List and set type for reducers
export const updateExchangeConfigurationListSuccess = response => ({
  type: UPDATE_EXCHANGE_FEED_CONFIGURATION_LIST_SUCCESS,
  payload: response
});

//action for set failure and error to update Exchange Feed Configuration List and set type for reducers
export const updateExchangeConfigurationListFailure = error => ({
  type: UPDATE_EXCHANGE_FEED_CONFIGURATION_LIST_FAILURE,
  payload: error
});


//action for Get exchange feed configuration sockets method and set type for reducers
export const getExchangeFeedConfigSocket = Data => ({
  type: GET_EXCHANGE_FEED_CONFIGURATION_METHOD_LIST,
  payload: { Data }
});

//action for set Success and Get exchange feed configuration sockets method and set type for reducers
export const getExchangeFeedConfigSocketSuccess = response => ({
  type: GET_EXCHANGE_FEED_CONFIGURATION_METHOD_LIST_SUCCESS,
  payload: response.Response
});

//action for set failure and error to Get exchange feed configuration sockets method and set type for reducers
export const getExchangeFeedConfigSocketFailure = error => ({
  type: GET_EXCHANGE_FEED_CONFIGURATION_METHOD_LIST_FAILURE,
  payload: error
});


//action for Get exchange feed configuration limit types and set type for reducers
export const getExchangeFeedConfigLimits = Data => ({
  type: GET_EXCHANGE_FEED_CONFIGURATION_LIMIT_LIST,
  payload: { Data }
});

//action for set Success and Get exchange feed configuration limit types and set type for reducers
export const getExchangeFeedConfigLimitsSuccess = response => ({
  type: GET_EXCHANGE_FEED_CONFIGURATION_LIMIT_LIST_SUCCESS,
  payload: response.Response
});

//action for set failure and error to Get exchange feed configuration limit types and set type for reducers
export const getExchangeFeedConfigLimitsFailure = error => ({
  type: GET_EXCHANGE_FEED_CONFIGURATION_LIMIT_LIST_FAILURE,
  payload: error
});

