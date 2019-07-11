// Actions For Get Currency List And Balance Action list By Tejas Date : 17/9/2018

// import types
import {
  GET_CURRENCY_LIST,
  GET_CURRENCY_LIST_SUCCESS,
  GET_CURRENCY_LIST_FAILURE,
  GET_CURRENT_PRICE,
  GET_CURRENT_PRICELIST_SUCCESS,
  GET_CURRENT_PRICE_FAILURE,
  UPDATE_BALANCE,
  UPDATE_BALANCE_SUCCESS,
  UPDATE_BALANCE_FAILURE,
  GET_CURRENCY_DATA,
  GET_CURRENCY_DATA_SUCCESS,
  GET_CURRENCY_DATA_FAILURE,
} from "Actions/types";

//action for get Currency List And Balance and set type for reducers
export const getCurrencyList = Pair => ({
  type: GET_CURRENCY_LIST,
  payload: { Pair }
});

//action for set Success and data to  Currency List And Balance and set type for reducers
export const getCurrencyListSuccess = response => ({
  type: GET_CURRENCY_LIST_SUCCESS,
  payload: response
});

//action for set failure and error to  Currency List And Balance and set type for reducers
export const getCurrencyListFailure = error => ({
  type: GET_CURRENCY_LIST_FAILURE,
  payload: error
});

//action for get Current Price and set type for reducers
export const getCurrentPrice = Pair => ({
  type: GET_CURRENT_PRICE,
  payload:  Pair 
});

//action for set Success and data to  Current Price And Balance and set type for reducers
export const getCurrentPriceSuccess = response => ({
  type: GET_CURRENT_PRICELIST_SUCCESS,
  payload: response.response
});

//action for set failure and error to Current Price And Balance and set type for reducers
export const getCurrentPriceFailure = error => ({
  type: GET_CURRENT_PRICE_FAILURE,
  payload: error
});

//action for Update balance and set type for reducers
export const updateBalance = Balance => ({
  type: UPDATE_BALANCE,
  payload: { Balance }
});

//action for set Success and data to  Update balance And Balance and set type for reducers
export const updateBalanceSuccess = response => ({
  type: UPDATE_BALANCE_SUCCESS,
  payload: response.data
});

//action for set failure and error to Update balance And Balance and set type for reducers
export const updateBalanceFailure = error => ({
  type: UPDATE_BALANCE_FAILURE,
  payload: error
});

//action for get Currency List and set type for reducers
export const getCurrencyData = Pair => ({
  type: GET_CURRENCY_DATA,
  payload: { Pair }
});

//action for set Success and data to  Currency List and set type for reducers
export const getCurrencyDataSuccess = response => ({
  type: GET_CURRENCY_DATA_SUCCESS,
  payload: response.Response
});

//action for set failure and error to  Currency List and set type for reducers
export const getCurrencyDataFailure = error => ({
  type: GET_CURRENCY_DATA_FAILURE,
  payload: error
});
