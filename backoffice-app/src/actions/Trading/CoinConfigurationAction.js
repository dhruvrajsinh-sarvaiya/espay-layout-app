// Actions For Coin Configuration List
import { action } from '../GlobalActions';
// import types
import {
  //Coin Configuration List 
  GET_COIN_CONFIGURATION_LIST,
  GET_COIN_CONFIGURATION_LIST_SUCCESS,
  GET_COIN_CONFIGURATION_LIST_FAILURE,

  //Coin Configuration add 
  ADD_COIN_CONFIGURATION_LIST,
  ADD_COIN_CONFIGURATION_LIST_SUCCESS,
  ADD_COIN_CONFIGURATION_LIST_FAILURE,

  //Coin Configuration update 
  UPDATE_COIN_CONFIGURATION_LIST,
  UPDATE_COIN_CONFIGURATION_LIST_SUCCESS,
  UPDATE_COIN_CONFIGURATION_LIST_FAILURE,

  //clear data
  CLEAR_ADD_UPDATE_COIN_CONFIG_DATA,
  CLEAR_COIN_CONFIGURATION
} from "../ActionTypes";

//Redux action for Coin Configuration List 
export function getCoinConfigurationList(payload = {}) {
  return action(GET_COIN_CONFIGURATION_LIST, { payload });
}
//Redux action for Coin Configuration List success
export function getCoinConfigurationListSuccess(payload) {
  return action(GET_COIN_CONFIGURATION_LIST_SUCCESS, { payload });
}
//Redux action for Coin Configuration List failure
export function getCoinConfigurationListFailure(error) {
  return action(GET_COIN_CONFIGURATION_LIST_FAILURE, { payload: error.message })
}

//Redux action for add Coin Configuration 
export function addCoinConfigurationList(payload) {
  return action(ADD_COIN_CONFIGURATION_LIST, { payload });
}
//Redux action for add Coin Configuration success
export function addCoinConfigurationListSuccess(payload) {
  return action(ADD_COIN_CONFIGURATION_LIST_SUCCESS, { payload });
}
//Redux action for add Coin Configuration failure
export function addCoinConfigurationListFailure(payload) {
  return action(ADD_COIN_CONFIGURATION_LIST_FAILURE, { payload });
}

//Redux action for update Coin Configuration
export function updateCoinConfigurationList(payload) {
  return action(UPDATE_COIN_CONFIGURATION_LIST, { payload });
}
//Redux action for update Coin Configuration success
export function updateCoinConfigurationListSuccess(payload) {
  return action(UPDATE_COIN_CONFIGURATION_LIST_SUCCESS, { payload });
}
//Redux action for update Coin Configuration failure
export function updateCoinConfigurationListFailure(payload) {
  return action(UPDATE_COIN_CONFIGURATION_LIST_FAILURE, { payload });
}

//action for clear add update
export function clearAddUpdateCoinConfig() {
  return action(CLEAR_ADD_UPDATE_COIN_CONFIG_DATA)
}

//action for clear coin configuration
export function clearCoinConfig() {
  return action(CLEAR_COIN_CONFIGURATION)
}