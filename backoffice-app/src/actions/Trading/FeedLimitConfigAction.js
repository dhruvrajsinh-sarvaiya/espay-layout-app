// Actions For Exchange Feed Configuration List
import { action } from '../GlobalActions';
// import types
import {
  //Feed limit list
  GET_FEED_LIMIT_LIST,
  GET_FEED_LIMIT_LIST_SUCCESS,
  GET_FEED_LIMIT_LIST_FAILURE,

  //Feed limit add
  ADD_FEED_LIMIT_CONFIGURATION,
  ADD_FEED_LIMIT_CONFIGURATION_SUCCESS,
  ADD_FEED_LIMIT_CONFIGURATION_FAILURE,

  //Feed limit update
  UPDATE_FEED_LIMIT_CONFIGURATION,
  UPDATE_FEED_LIMIT_CONFIGURATION_SUCCESS,
  UPDATE_FEED_LIMIT_CONFIGURATION_FAILURE,

  //Feed limit type
  GET_FEED_LIMIT_TYPE,
  GET_FEED_LIMIT_TYPE_SUCCESS,
  GET_FEED_LIMIT_TYPE_FAILURE,

  //clear data
  CLEAR_ADD_UPDATE_FEED_LIMIT_DATA,
  CLEAR_FEED_LIMIT_DATA
} from "../ActionTypes";

//Redux action for Feed Limit Configuration List 
export function getFeedLimitList(payload) {
  return action(GET_FEED_LIMIT_LIST, { payload });
}
//Redux action for Feed Limit Configuration List success
export function getFeedLimitListSuccess(payload) {
  return action(GET_FEED_LIMIT_LIST_SUCCESS, { payload });
}
//Redux action for Feed Limit Configuration List failure
export function getFeedLimitListFailure(error) {
  return action(GET_FEED_LIMIT_LIST_FAILURE, { payload: error.message })
}

//Redux action for add Feed Limit Configuration 
export function addFeedLimitList(payload) {
  return action(ADD_FEED_LIMIT_CONFIGURATION, { payload });
}
//Redux action for add Feed Limit Configuration success
export function addFeedLimitListSuccess(payload) {
  return action(ADD_FEED_LIMIT_CONFIGURATION_SUCCESS, { payload });
}
//Redux action for add Feed Limit Configuration failure
export function addFeedLimitListFailure(payload) {
  return action(ADD_FEED_LIMIT_CONFIGURATION_FAILURE, { payload });
}

//Redux action for update Feed Limit Configuration 
export function updateFeedLimitList(payload) {
  return action(UPDATE_FEED_LIMIT_CONFIGURATION, { payload });
}
//Redux action for update Feed Limit Configuration success
export function updateFeedLimitListSuccess(payload) {
  return action(UPDATE_FEED_LIMIT_CONFIGURATION_SUCCESS, { payload });
}
//Redux action for update Feed Limit Configuration failure
export function updateFeedLimitListFailure(payload) {
  return action(UPDATE_FEED_LIMIT_CONFIGURATION_FAILURE, { payload });
}

//Redux action for getting exchange feed limit types
export function getExchangeFeedLimit(payload) {
  return action(GET_FEED_LIMIT_TYPE, { payload });
}
//Redux action for getting exchange feed limit types success
export function getExchangeFeedLimitSuccess(payload) {
  return action(GET_FEED_LIMIT_TYPE_SUCCESS, { payload });
}
//Redux action for getting exchange feed limit types failure
export function getExchangeFeedLimitFailure(payload) {
  return action(GET_FEED_LIMIT_TYPE_FAILURE, { payload })
}

//Redux action for clear add update
export function clearAddUpdateFeedLimitConfig() {
  return action(CLEAR_ADD_UPDATE_FEED_LIMIT_DATA)
}

//Redux action for clear feed limit
export function clearFeedLimitData() {
  return action(CLEAR_FEED_LIMIT_DATA)
}