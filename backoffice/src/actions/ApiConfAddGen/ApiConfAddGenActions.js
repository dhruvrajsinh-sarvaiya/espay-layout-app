
/**
 * Added By Devang Parekh
 * action is used to handle events and methods from component 
 * used to pass data between component to saga and saga to component
 * handle add, delete and multi delete, edit options in this component for api configuration of address generation
 */

import {
  GET_API_CONF_ADD_GEN_LIST,
  GET_API_CONF_ADD_GEN_LIST_SUCCESS,
  GET_API_CONF_ADD_GEN_LIST_FAILURE,
  GET_API_PROVIDER,
  GET_API_PROVIDER_SUCCESS,
  GET_API_PROVIDER_FAILURE,
  GET_CURRENCY,
  GET_CURRENCY_SUCCESS,
  GET_CURRENCY_FAILURE,
  GET_CALLBACK_LIST,
  GET_CALLBACK_LIST_SUCCESS,
  GET_CALLBACK_LIST_FAILURE,
  ADD_API_CONF_ADD_GEN,
  ADD_API_CONF_ADD_GEN_SUCCESS,
  ADD_API_CONF_ADD_GEN_FAILURE,
  EDIT_API_CONF_ADD_GEN,
  EDIT_API_CONF_ADD_GEN_SUCCESS,
  EDIT_API_CONF_ADD_GEN_FAILURE,
  DELETE_API_CONF_ADD_GEN,
  DELETE_API_CONF_ADD_GEN_SUCCESS,
  DELETE_API_CONF_ADD_GEN_FAILURE,
} from "../types";

export const getApiConfAddGenList = apiConfRequest => ({
  type: GET_API_CONF_ADD_GEN_LIST,
  payload: apiConfRequest
});

export const getApiConfAddGenListSucess = apiConfList => ({
  type: GET_API_CONF_ADD_GEN_LIST_SUCCESS,
  payload: apiConfList
});

export const getApiConfAddGenListFailure = error => ({
  type: GET_API_CONF_ADD_GEN_LIST_FAILURE,
  payload: error
});

export const getApiProviderList = apiProviderRequest => ({
  type: GET_API_PROVIDER,
  payload: apiProviderRequest
});

export const getApiProviderListSuccess = apiProviderList => ({
  type: GET_API_PROVIDER_SUCCESS,
  payload: apiProviderList
});

export const getApiProviderListFailure = error => ({
  type: GET_API_PROVIDER_FAILURE,
  payload: error
});

export const getCurrencyList = currencyRequest => ({
  type: GET_CURRENCY,
  payload: currencyRequest
});

export const getCurrencyListSuccess = currencyList => ({
  type: GET_CURRENCY_SUCCESS,
  payload: currencyList
});

export const getCurrencyListFailure = error => ({
  type: GET_CURRENCY_FAILURE,
  payload: error
});

export const getCallbackList = callbackRequest => ({
  type: GET_CALLBACK_LIST,
  payload: callbackRequest
});

export const getCallbackListSuccess = callbackList => ({
  type: GET_CALLBACK_LIST_SUCCESS,
  payload: callbackList
});

export const getCallbackListFailure = error => ({
  type: GET_CALLBACK_LIST_FAILURE,
  payload: error
});

export const submitApiConfAddGenForm = addApiConfRequest => ({
  type: ADD_API_CONF_ADD_GEN,
  payload: addApiConfRequest
});

export const submitApiConfAddGenFormSuccess = apiConfRequestSuccess => ({
  type: ADD_API_CONF_ADD_GEN_SUCCESS,
  payload: apiConfRequestSuccess
});

export const submitApiConfAddGenFormFailure = apiConfRequestFailure => ({
  type: ADD_API_CONF_ADD_GEN_FAILURE,
  payload: apiConfRequestFailure
});

export const editApiConfAddGenForm = editApiConfRequest => ({
  type: EDIT_API_CONF_ADD_GEN,
  payload: editApiConfRequest
});

export const editApiConfAddGenFormSuccess = editApiConfRequestSuccess => ({
  type: EDIT_API_CONF_ADD_GEN_SUCCESS,
  payload: editApiConfRequestSuccess
});

export const editApiConfAddGenFormFailure = editApiConfRequestFailure => ({
  type: EDIT_API_CONF_ADD_GEN_FAILURE,
  payload: editApiConfRequestFailure
});

export const deleteApiConfAddGenForm = deleteApiConfRequest => ({
  type: DELETE_API_CONF_ADD_GEN,
  payload: deleteApiConfRequest
});

export const deleteApiConfAddGenFormSuccess = deleteApiConfRequestSuccess => ({
  type: DELETE_API_CONF_ADD_GEN_SUCCESS,
  payload: deleteApiConfRequestSuccess
});

export const deleteApiConfAddGenFormFailure = deleteApiConfRequestFailure => ({
  type: DELETE_API_CONF_ADD_GEN_FAILURE,
  payload: deleteApiConfRequestFailure
});