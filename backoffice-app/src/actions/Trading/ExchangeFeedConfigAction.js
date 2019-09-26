// Actions For Exchange Feed Configuration List
import { action } from '../GlobalActions';
// import types
import {
  //Exchange Feed Configuration List
  GET_EXCHANGE_FEED_CONFIGURATION_LIST,
  GET_EXCHANGE_FEED_CONFIGURATION_LIST_SUCCESS,
  GET_EXCHANGE_FEED_CONFIGURATION_LIST_FAILURE,

  //Exchange Feed Configuration add
  ADD_EXCHANGE_FEED_CONFIGURATION_LIST,
  ADD_EXCHANGE_FEED_CONFIGURATION_LIST_SUCCESS,
  ADD_EXCHANGE_FEED_CONFIGURATION_LIST_FAILURE,

  //Exchange Feed Configuration edit
  UPDATE_EXCHANGE_FEED_CONFIGURATION_LIST,
  UPDATE_EXCHANGE_FEED_CONFIGURATION_LIST_SUCCESS,
  UPDATE_EXCHANGE_FEED_CONFIGURATION_LIST_FAILURE,

  //Exchange Feed Configuration method List
  GET_EXCHANGE_FEED_CONFIGURATION_METHOD_LIST,
  GET_EXCHANGE_FEED_CONFIGURATION_METHOD_LIST_SUCCESS,
  GET_EXCHANGE_FEED_CONFIGURATION_METHOD_LIST_FAILURE,

//Exchange Feed Configuration method List
  GET_EXCHANGE_FEED_CONFIGURATION_LIMIT_LIST,
  GET_EXCHANGE_FEED_CONFIGURATION_LIMIT_LIST_SUCCESS,
  GET_EXCHANGE_FEED_CONFIGURATION_LIMIT_LIST_FAILURE,

  //clear data
  ADD_EXCHANGE_FEED_CONFIGURATION_LIST_CLEAR,
  UPDATE_EXCHANGE_FEED_CONFIGURATION_LIST_CLEAR,
  CLEAR_EXCHANGE_FEED_CONFIGURATION,
} from "../ActionTypes";

//action for Exchange Feed Configuration List and set type for reducers
export function getExchangeFeedConfigList(payload) {
  return action(GET_EXCHANGE_FEED_CONFIGURATION_LIST, { payload });
}

//action for set Success and Exchange Feed Configuration List and set type for reducers
export function getExchangeFeedListSuccess(payload) {
  return action(GET_EXCHANGE_FEED_CONFIGURATION_LIST_SUCCESS, { payload });
}

//action for set failure and error to Exchange Feed Configuration List and set type for reducers
export function getExchangeFeedListFailure(error) {
  return action(GET_EXCHANGE_FEED_CONFIGURATION_LIST_FAILURE, { payload: error.message })
}

//action for add Exchange Feed Configuration List and set type for reducers
export function addExchangeConfigurationList(payload) {
  return action(ADD_EXCHANGE_FEED_CONFIGURATION_LIST, { payload });
}

//action for set Success and add Exchange Feed Configuration List and set type for reducers
export function addExchangeConfigurationListSuccess(payload) {
  return action(ADD_EXCHANGE_FEED_CONFIGURATION_LIST_SUCCESS, { payload });
}

//action for set failure and error to add Exchange Feed Configuration List and set type for reducers
export function addExchangeConfigurationListFailure(payload) {
  return action(ADD_EXCHANGE_FEED_CONFIGURATION_LIST_FAILURE, { payload });
}

//action for update Exchange Feed Configuration List and set type for reducers
export function updateExchangeConfigurationList(payload) {
  return action(UPDATE_EXCHANGE_FEED_CONFIGURATION_LIST, { payload });
}

//action for set Success and update Exchange Feed Configuration List and set type for reducers
export function updateExchangeConfigurationListSuccess(payload) {
  return action(UPDATE_EXCHANGE_FEED_CONFIGURATION_LIST_SUCCESS, { payload });
}

//action for set failure and error to update Exchange Feed Configuration List and set type for reducers
export function updateExchangeConfigurationListFailure(payload) {
  return action(UPDATE_EXCHANGE_FEED_CONFIGURATION_LIST_FAILURE, { payload });
}

//action for Get exchange feed configuration sockets method and set type for reducers
export function getExchangeFeedConfigSocket(payload) {
  return action(GET_EXCHANGE_FEED_CONFIGURATION_METHOD_LIST, { payload });
}

//action for set Success and Get exchange feed configuration sockets method and set type for reducers
export function getExchangeFeedConfigSocketSuccess(payload) {
  return action(GET_EXCHANGE_FEED_CONFIGURATION_METHOD_LIST_SUCCESS, { payload });
}

//action for set failure and error to Get exchange feed configuration sockets method and set type for reducers
export function getExchangeFeedConfigSocketFailure(payload) {
  return action(GET_EXCHANGE_FEED_CONFIGURATION_METHOD_LIST_FAILURE, { payload });
}

//action for Get exchange feed configuration limit types and set type for reducers
export function getExchangeFeedConfigLimits(payload) {
  return action(GET_EXCHANGE_FEED_CONFIGURATION_LIMIT_LIST, { payload })
}

//action for set Success and Get exchange feed configuration limit types and set type for reducers
export function getExchangeFeedConfigLimitsSuccess(payload) {
  return action(GET_EXCHANGE_FEED_CONFIGURATION_LIMIT_LIST_SUCCESS, { payload })
}

//action for set failure and error to Get exchange feed configuration limit types and set type for reducers
export function getExchangeFeedConfigLimitsFailure(payload) {
  return action(GET_EXCHANGE_FEED_CONFIGURATION_LIMIT_LIST_FAILURE, { payload })
}

//action for clear add
export function clearAdd() {
  return action(ADD_EXCHANGE_FEED_CONFIGURATION_LIST_CLEAR)
}

//action for clear Update
export function clearUpdate() {
  return action(UPDATE_EXCHANGE_FEED_CONFIGURATION_LIST_CLEAR)
}

//action for clear exchange feed
export function clearExchangeFeed() {
  return action(CLEAR_EXCHANGE_FEED_CONFIGURATION)
}
