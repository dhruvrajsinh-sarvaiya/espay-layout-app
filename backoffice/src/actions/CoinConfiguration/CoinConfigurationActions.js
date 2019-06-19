// create action files for get,update and add coin configuration list By Tejas Date:7/1/2019

// import types
import {
  GET_COIN_CONFIGURATION_LIST,
  GET_COIN_CONFIGURATION_LIST_SUCCESS,
  GET_COIN_CONFIGURATION_LIST_FAILURE,
  ADD_COIN_CONFIGURATION_LIST,
  ADD_COIN_CONFIGURATION_LIST_SUCCESS,
  ADD_COIN_CONFIGURATION_LIST_FAILURE,
  UPDATE_COIN_CONFIGURATION_LIST,
  UPDATE_COIN_CONFIGURATION_LIST_SUCCESS,
  UPDATE_COIN_CONFIGURATION_LIST_FAILURE,
  //added by parth andhariya
  ADD_CURRENCY_LOGO,
  ADD_CURRENCY_LOGO_SUCCESS,
  ADD_CURRENCY_LOGO_FAILURE,
} from "Actions/types";

//action for Get coin configuration list and set type for reducers
export const getCoinConfigurationList = Data => ({
  type: GET_COIN_CONFIGURATION_LIST,
  payload: { Data }
});

//action for set Success and Get coin configuration list and set type for reducers
export const getCoinConfigurationListSuccess = response => ({
  type: GET_COIN_CONFIGURATION_LIST_SUCCESS,
  payload: response.Response
});

//action for set failure and error to Get coin configuration list and set type for reducers
export const getCoinConfigurationListFailure = error => ({
  type: GET_COIN_CONFIGURATION_LIST_FAILURE,
  payload: error
});

//action for add Coin Data and set type for reducers
export const addCoinConfigurationList = Data => ({
  type: ADD_COIN_CONFIGURATION_LIST,
  payload: { Data }
});

//action for set Success and add Coin Data and set type for reducers
export const addCoinConfigurationListSuccess = response => ({
  type: ADD_COIN_CONFIGURATION_LIST_SUCCESS,
  payload: response
});

//action for set failure and error to add Coin Data and set type for reducers
export const addCoinConfigurationListFailure = error => ({
  type: ADD_COIN_CONFIGURATION_LIST_FAILURE,
  payload: error
});

//action for update Coin Data and set type for reducers
export const updateCoinConfigurationList = Data => ({
  type: UPDATE_COIN_CONFIGURATION_LIST,
  payload: { Data }
});

//action for set Success and update Coin Data and set type for reducers
export const updateCoinConfigurationListSuccess = response => ({
  type: UPDATE_COIN_CONFIGURATION_LIST_SUCCESS,
  payload: response
});

//action for set failure and error to update Coin Data and set type for reducers
export const updateCoinConfigurationListFailure = error => ({
  type: UPDATE_COIN_CONFIGURATION_LIST_FAILURE,
  payload: error
});

//added by parth andhariya
//action for Image Upload request
export const AddCurrencyLogo = Data => ({
  type: ADD_CURRENCY_LOGO,
  payload: Data
});
//action for set Success and update Coin Data and set type for reducers
export const AddCurrencyLogoSuccess = response => ({
  type: ADD_CURRENCY_LOGO_SUCCESS,
  payload: response
});
//action for set failure and error to update Coin Data and set type for reducers
export const AddCurrencyLogoFailure = error => ({
  type: ADD_CURRENCY_LOGO_FAILURE,
  payload: error
});

