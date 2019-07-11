/**
 * Added By Devang Parekh
 * action is used to handle events and methods from component
 * used to pass data between component to saga and saga to component
 * handle add, delete and multi delete, edit options in this component
 */

import {
  GET_PAIR_CONFIGURATION_LIST,
  GET_PAIR_CONFIGURATION_LIST_SUCCESS,
  GET_PAIR_CONFIGURATION_LIST_FAILURE,
  GET_MARKET_CURRENCY,
  GET_MARKET_CURRENCY_SUCCESS,
  GET_MARKET_CURRENCY_FAILURE,
  GET_PAIR_CURRENCY,
  GET_PAIR_CURRENCY_SUCCESS,
  GET_PAIR_CURRENCY_FAILURE,
  GET_EXCHANGE_LIST,
  GET_EXCHANGE_LIST_SUCCESS,
  GET_EXCHANGE_LIST_FAILURE,
  ADD_PAIR_CONFIGURATION,
  ADD_PAIR_CONFIGURATION_SUCCESS,
  ADD_PAIR_CONFIGURATION_FAILURE,
  EDIT_PAIR_CONFIGURATION,
  EDIT_PAIR_CONFIGURATION_SUCCESS,
  EDIT_PAIR_CONFIGURATION_FAILURE,
  DELETE_PAIR_CONFIGURATION,
  DELETE_PAIR_CONFIGURATION_SUCCESS,
  DELETE_PAIR_CONFIGURATION_FAILURE
} from "../types";

export const getPairConfigurationList = pairRequest => ({
  type: GET_PAIR_CONFIGURATION_LIST,
  payload: pairRequest
});

export const getPairConfigurationListSucess = response => ({
  type: GET_PAIR_CONFIGURATION_LIST_SUCCESS,
  payload: response.Response
});

export const getPairConfigurationListFailure = error => ({
  type: GET_PAIR_CONFIGURATION_LIST_FAILURE,
  payload: error
});

export const getMarketCurrencyList = marketCurrencyRequest => ({
  type: GET_MARKET_CURRENCY,
  payload: marketCurrencyRequest
});

export const getMarketCurrencyListSuccess = response => ({
  type: GET_MARKET_CURRENCY_SUCCESS,
  payload: response.Response
});

export const getMarketCurrencyListFailure = error => ({
  type: GET_MARKET_CURRENCY_FAILURE,
  payload: error
});

export const getPairCurrencyList = pairRequest => ({
  type: GET_PAIR_CURRENCY,
  payload: pairRequest
});

export const getPairCurrencyListSuccess = response => ({
  type: GET_PAIR_CURRENCY_SUCCESS,
  payload: response.Response
});

export const getPairCurrencyListFailure = error => ({
  type: GET_PAIR_CURRENCY_FAILURE,
  payload: error
});

export const getExchangeList = exchangeRequest => ({
  type: GET_EXCHANGE_LIST,
  payload: exchangeRequest
});

export const getExchangeListSuccess = exchangeList => ({
  type: GET_EXCHANGE_LIST_SUCCESS,
  payload: exchangeList
});

export const getExchangeListFailure = error => ({
  type: GET_EXCHANGE_LIST_FAILURE,
  payload: error
});

export const submitPairConfigurationForm = addPairRequest => ({
  type: ADD_PAIR_CONFIGURATION,
  payload: addPairRequest
});

export const submitPairConfigurationFormSuccess = response => ({
  type: ADD_PAIR_CONFIGURATION_SUCCESS,
  payload: response.Response
});

export const submitPairConfigurationFormFailure = error => ({
  type: ADD_PAIR_CONFIGURATION_FAILURE,
  payload: error
});

export const editPairConfigurationForm = editPairRequest => ({
  type: EDIT_PAIR_CONFIGURATION,
  payload: editPairRequest
});

export const editPairConfigurationFormSuccess = response => ({
  type: EDIT_PAIR_CONFIGURATION_SUCCESS,
  payload: response.Response
});

export const editPairConfigurationFormFailure = error => ({
  type: EDIT_PAIR_CONFIGURATION_FAILURE,
  payload: error
});

export const deletePairConfigurationForm = deletePairRequest => ({
  type: DELETE_PAIR_CONFIGURATION,
  payload: deletePairRequest
});

export const deletePairConfigurationFormSuccess = deletePairRequestSuccess => ({
  type: DELETE_PAIR_CONFIGURATION_SUCCESS,
  payload: deletePairRequestSuccess
});

export const deletePairConfigurationFormFailure = deletePairRequestFailure => ({
  type: DELETE_PAIR_CONFIGURATION_FAILURE,
  payload: deletePairRequestFailure
});
