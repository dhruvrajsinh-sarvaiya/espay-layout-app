// Actions For currency List Data By Tejas

// import types
import {
  GET_CURRENCY_LIST,
  GET_CURRENCY_LIST_SUCCESS,
  GET_CURRENCY_LIST_FAILURE,
  // GET_PROVIDERS_LIST,
  // GET_PROVIDERS_LIST_SUCCESS,
  // GET_PROVIDERS_LIST_FAILURE
} from "Actions/types";

//action for Currency List and set type for reducers
export const getCurrencyList = Data => ({
  type: GET_CURRENCY_LIST,
  payload: { Data }
});

//action for set Success and Currency List and set type for reducers
export const getCurrencyListSuccess = response => ({
  type: GET_CURRENCY_LIST_SUCCESS,
  payload: response.response
});

//action for set failure and error to Currency List and set type for reducers
export const getCurrencyListFailure = error => ({
  type: GET_CURRENCY_LIST_FAILURE,
  payload: error
});

// //action for Providers List and set type for reducers
// export const getProvidersList = Data => ({
//   type: GET_PROVIDERS_LIST,
//   payload: { Data }
// });

// //action for set Success and Providers List and set type for reducers
// export const getProvidersListSuccess = response => ({
//   type: GET_PROVIDERS_LIST_SUCCESS,
//   payload: response.response
// });

// //action for set failure and error to Providers List and set type for reducers
// export const getProvidersListFailure = error => ({
//   type: GET_PROVIDERS_LIST_FAILURE,
//   payload: error
// });
