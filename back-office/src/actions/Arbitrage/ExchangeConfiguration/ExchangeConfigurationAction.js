// Actions For arbitrage configuration List By Devang Parekh (11-3-2019)

// import types
import {
  GET_ARBITRAGE_EXCHANGE_CONFIGURATION_LIST,
  GET_ARBITRAGE_EXCHANGE_CONFIGURATION_SUCCESS,
  GET_ARBITRAGE_EXCHANGE_CONFIGURATION_FAILURE,
  ADD_ARBITRAGE_EXCHANGE_CONFIGURATION_LIST,
  ADD_ARBITRAGE_EXCHANGE_CONFIGURATION_SUCCESS,
  ADD_ARBITRAGE_EXCHANGE_CONFIGURATION_FAILURE,
  UPDATE_ARBITRAGE_EXCHANGE_CONFIGURATION_LIST,
  UPDATE_ARBITRAGE_EXCHANGE_CONFIGURATION_SUCCESS,
  UPDATE_ARBITRAGE_EXCHANGE_CONFIGURATION_FAILURE,
  GET_ARBITRAGE_EXCHANGE_PROVIDER_LIST,
  GET_ARBITRAGE_EXCHANGE_PROVIDER_SUCCESS,
  GET_ARBITRAGE_EXCHANGE_PROVIDER_FAILURE,
  ADD_ARBITRAGE_EXCHANGE_PROVIDER_LIST,
  ADD_ARBITRAGE_EXCHANGE_PROVIDER_SUCCESS,
  ADD_ARBITRAGE_EXCHANGE_PROVIDER_FAILURE,
  UPDATE_ARBITRAGE_EXCHANGE_PROVIDER_LIST,
  UPDATE_ARBITRAGE_EXCHANGE_PROVIDER_SUCCESS,
  UPDATE_ARBITRAGE_EXCHANGE_PROVIDER_FAILURE,
  DELETE_ARBITRAGE_EXCHANGE_PROVIDER_LIST,
  DELETE_ARBITRAGE_EXCHANGE_PROVIDER_SUCCESS,
  DELETE_ARBITRAGE_EXCHANGE_PROVIDER_FAILURE,
  GET_ARBITRAGE_SERVICE_PROVIDER,
  GET_ARBITRAGE_SERVICE_PROVIDER_SUCCESS,
  GET_ARBITRAGE_SERVICE_PROVIDER_FAILURE,
  GET_ARBITRAGE_PROVIDERS_LIST,
  GET_ARBITRAGE_PROVIDERS_LIST_SUCCESS,
  GET_ARBITRAGE_PROVIDERS_LIST_FAILURE,
  GET_ARBITRAGE_SERVICE_CONFIG,
  GET_ARBITRAGE_SERVICE_CONFIG_SUCCESS,
  GET_ARBITRAGE_SERVICE_CONFIG_FAILURE,
  GET_ARBITRAGE_PROVIDER_TYPE,
  GET_ARBITRAGE_PROVIDER_TYPE_SUCCESS,
  GET_ARBITRAGE_PROVIDER_TYPE_FAILURE,
  GET_ARBITRAGE_TRANSACTION_TYPE,
  GET_ARBITRAGE_TRANSACTION_TYPE_SUCCESS,
  GET_ARBITRAGE_TRANSACTION_TYPE_FAILURE,

  CHANGE_ARBITRAGE_EXCHANGE_ORDER_TYPE,
  CHANGE_ARBITRAGE_EXCHANGE_ORDER_TYPE_SUCCESS,
  CHANGE_ARBITRAGE_EXCHANGE_ORDER_TYPE_FAILURE,
} from "Actions/types";

//action for arbitrage configuration List and set type for reducers
export const getExchangeConfigurationList = Data => ({
  type: GET_ARBITRAGE_EXCHANGE_CONFIGURATION_LIST,
  payload: Data
});

//action for set Success and arbitrage configuration List and set type for reducers
export const getExchangeConfigurationListSuccess = response => ({
  type: GET_ARBITRAGE_EXCHANGE_CONFIGURATION_SUCCESS,
  payload: response.Response
});

//action for set failure and error to arbitrage configuration List and set type for reducers
export const getExchangeConfigurationListFailure = error => ({
  type: GET_ARBITRAGE_EXCHANGE_CONFIGURATION_FAILURE,
  payload: error
});

//action for add arbitrage configuration List and set type for reducers
export const addExchangeConfigurationList = Data => ({
  type: ADD_ARBITRAGE_EXCHANGE_CONFIGURATION_LIST,
  payload: Data
});

//action for set Success and add arbitrage configuration List and set type for reducers
export const addExchangeConfigurationListSuccess = response => ({
  type: ADD_ARBITRAGE_EXCHANGE_CONFIGURATION_SUCCESS,
  payload: response
});

//action for set failure and error to add arbitrage configuration List and set type for reducers
export const addExchangeConfigurationListFailure = error => ({
  type: ADD_ARBITRAGE_EXCHANGE_CONFIGURATION_FAILURE,
  payload: error
});

//action for UPDATE arbitrage configuration List and set type for reducers
export const updateExchangeConfigurationList = Data => ({
  type: UPDATE_ARBITRAGE_EXCHANGE_CONFIGURATION_LIST,
  payload: Data
});

//action for set Success and UPDATE arbitrage configuration List and set type for reducers
export const updateExchangeConfigurationListSuccess = response => ({
  type: UPDATE_ARBITRAGE_EXCHANGE_CONFIGURATION_SUCCESS,
  payload: response
});

//action for set failure and error to UPDATE arbitrage configuration List and set type for reducers
export const updateExchangeConfigurationListFailure = error => ({
  type: UPDATE_ARBITRAGE_EXCHANGE_CONFIGURATION_FAILURE,
  payload: error
});

//action for exchange configuration List and set type for reducers
export const getArbitrageExchangeProviderList = Data => ({
  type: GET_ARBITRAGE_EXCHANGE_PROVIDER_LIST,
  payload: Data
});

//action for set Success and exchange configuration List and set type for reducers
export const getArbitrageExchangeProviderListSuccess = response => ({
  type: GET_ARBITRAGE_EXCHANGE_PROVIDER_SUCCESS,
  payload: response.data
});

//action for set failure and error to exchange configuration List and set type for reducers
export const getArbitrageExchangeProviderListFailure = error => ({
  type: GET_ARBITRAGE_EXCHANGE_PROVIDER_FAILURE,
  payload: error.message
});

//action for ADD ArbitrageExchange Provider List and set type for reducers
export const addArbitrageExchangeProviderList = Data => ({
  type: ADD_ARBITRAGE_EXCHANGE_PROVIDER_LIST,
  payload: Data
});

//action for set Success and ADD ArbitrageExchange Provider List and set type for reducers
export const addArbitrageExchangeProviderListSuccess = response => ({
  type: ADD_ARBITRAGE_EXCHANGE_PROVIDER_SUCCESS,
  payload: response.data
});

//action for set failure and error to ADD ArbitrageExchange Provider List and set type for reducers
export const addArbitrageExchangeProviderListFailure = error => ({
  type: ADD_ARBITRAGE_EXCHANGE_PROVIDER_FAILURE,
  payload: error.message
});

//action for update ArbitrageExchange Provider List and set type for reducers
export const updateArbitrageExchangeProviderList = Data => ({
  type: UPDATE_ARBITRAGE_EXCHANGE_PROVIDER_LIST,
  payload: Data
});

//action for set Success and update ArbitrageExchange Provider List and set type for reducers
export const updateArbitrageExchangeProviderListSuccess = response => ({
  type: UPDATE_ARBITRAGE_EXCHANGE_PROVIDER_SUCCESS,
  payload: response.data
});

//action for set failure and error to update ArbitrageExchange Provider List and set type for reducers
export const updateArbitrageExchangeProviderListFailure = error => ({
  type: UPDATE_ARBITRAGE_EXCHANGE_PROVIDER_FAILURE,
  payload: error.message
});

//action for delete ArbitrageExchange Provider List and set type for reducers
export const deleteArbitrageExchangeProviderList = Data => ({
  type: DELETE_ARBITRAGE_EXCHANGE_PROVIDER_LIST,
  payload: Data
});

//action for set Success and delete ArbitrageExchange Provider List and set type for reducers
export const deleteArbitrageExchangeProviderListSuccess = response => ({
  type: DELETE_ARBITRAGE_EXCHANGE_PROVIDER_SUCCESS,
  payload: response.data
});

//action for set failure and error to delete ArbitrageExchange Provider List and set type for reducers
export const deleteArbitrageExchangeProviderListFailure = error => ({
  type: DELETE_ARBITRAGE_EXCHANGE_PROVIDER_FAILURE,
  payload: error.message
});

//action for Providers List and set type for reducers
export const getArbitrageProvidersList = Data => ({
  type: GET_ARBITRAGE_PROVIDERS_LIST,
  payload: Data
});

//action for set Success and Providers List and set type for reducers
export const getArbitrageProvidersListSuccess = response => ({
  type: GET_ARBITRAGE_PROVIDERS_LIST_SUCCESS,
  payload: response.Response
});

//action for set failure and error to Providers List and set type for reducers
export const getArbitrageProvidersListFailure = error => ({
  type: GET_ARBITRAGE_PROVIDERS_LIST_FAILURE,
  payload: error
});

//action for Service Provider List and set type for reducers
export const getArbitrageServiceProviderList = Data => ({
  type: GET_ARBITRAGE_SERVICE_PROVIDER,
  payload: Data
});

//action for set Success and Service Provider List and set type for reducers
export const getArbitrageServiceProviderListSuccess = response => ({
  type: GET_ARBITRAGE_SERVICE_PROVIDER_SUCCESS,
  payload: response.Response
});

//action for set failure and error to Service Provider List and set type for reducers
export const getArbitrageServiceProviderListFailure = error => ({
  type: GET_ARBITRAGE_SERVICE_PROVIDER_FAILURE,
  payload: error
});

//action for Service Configuration List and set type for reducers
export const getArbitrageServiceConfigurationList = Data => ({
  type: GET_ARBITRAGE_SERVICE_CONFIG,
  payload: Data
});

//action for set Success and Service Configuration List and set type for reducers
export const getArbitrageServiceConfigurationListSuccess = response => ({
  type: GET_ARBITRAGE_SERVICE_CONFIG_SUCCESS,
  payload: response.Response
});

//action for set failure and error to Service Configuration List and set type for reducers
export const getArbitrageServiceConfigurationListFailure = error => ({
  type: GET_ARBITRAGE_SERVICE_CONFIG_FAILURE,
  payload: error
});

//action for Provider Type  List and set type for reducers
export const getArbitrageProviderTypeList = Data => ({
  type: GET_ARBITRAGE_PROVIDER_TYPE,
  payload: Data
});

//action for set Success and Provider Type  List and set type for reducers
export const getArbitrageProviderTypeListSuccess = response => ({
  type: GET_ARBITRAGE_PROVIDER_TYPE_SUCCESS,
  payload: response.Response
});

//action for set failure and error to Provider Type  List and set type for reducers
export const getArbitrageProviderTypeListFailure = error => ({
  type: GET_ARBITRAGE_PROVIDER_TYPE_FAILURE,
  payload: error
});

//action for Transaction Type List  List and set type for reducers
export const getArbitrageTransactionTypeList = Data => ({
  type: GET_ARBITRAGE_TRANSACTION_TYPE,
  payload: Data
});

//action for set Success and Transaction Type List  List and set type for reducers
export const getArbitrageTransactionTypeListSuccess = response => ({
  type: GET_ARBITRAGE_TRANSACTION_TYPE_SUCCESS,
  payload: response.Response
});

//action for set failure and error to Transaction Type List  List and set type for reducers
export const getArbitrageTransactionTypeListFailure = error => ({
  type: GET_ARBITRAGE_TRANSACTION_TYPE_FAILURE,
  payload: error
});

//action for change order type  List and set type for reducers
export const changeArbitrageOrderType = Data => ({
  type: CHANGE_ARBITRAGE_EXCHANGE_ORDER_TYPE,
  payload: Data
});

//action for set Success and change order type  List and set type for reducers
export const changeArbitrageOrderTypeSuccess = response => ({
  type: CHANGE_ARBITRAGE_EXCHANGE_ORDER_TYPE_SUCCESS,
  payload: response
});

//action for set failure and error to change order type  List and set type for reducers
export const changeArbitrageOrderTypeFailure = error => ({
  type: CHANGE_ARBITRAGE_EXCHANGE_ORDER_TYPE_FAILURE,
  payload: error
});