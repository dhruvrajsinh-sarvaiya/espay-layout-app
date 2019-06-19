// Actions For Liquidity manager List By Tejas

// import types
import {
  GET_LIQUIDITY_API_MANAGER_LIST,
  GET_LIQUIDITY_API_MANAGER_SUCCESS,
  GET_LIQUIDITY_API_MANAGER_FAILURE,
  ADD_LIQUIDITY_API_MANAGER_LIST,
  ADD_LIQUIDITY_API_MANAGER_SUCCESS,
  ADD_LIQUIDITY_API_MANAGER_FAILURE,
  UPDATE_LIQUIDITY_API_MANAGER_LIST,
  UPDATE_LIQUIDITY_API_MANAGER_SUCCESS,
  UPDATE_LIQUIDITY_API_MANAGER_FAILURE,
  GET_LIQUIDITY_PROVIDER_LIST,
  GET_LIQUIDITY_PROVIDER_SUCCESS,
  GET_LIQUIDITY_PROVIDER_FAILURE,
  ADD_LIQUIDITY_PROVIDER_LIST,
  ADD_LIQUIDITY_PROVIDER_SUCCESS,
  ADD_LIQUIDITY_PROVIDER_FAILURE,
  UPDATE_LIQUIDITY_PROVIDER_LIST,
  UPDATE_LIQUIDITY_PROVIDER_SUCCESS,
  UPDATE_LIQUIDITY_PROVIDER_FAILURE,
  DELETE_LIQUIDITY_PROVIDER_LIST,
  DELETE_LIQUIDITY_PROVIDER_SUCCESS,
  DELETE_LIQUIDITY_PROVIDER_FAILURE,
  GET_LIMIT_DATA,
  GET_LIMIT_DATA_SUCCESS,
  GET_LIMIT_DATA_FAILURE,
  GET_SERVICE_PROVIDER,
  GET_SERVICE_PROVIDER_SUCCESS,
  GET_SERVICE_PROVIDER_FAILURE,
  GET_PROVIDERS_LIST,
  GET_PROVIDERS_LIST_SUCCESS,
  GET_PROVIDERS_LIST_FAILURE,
  GET_SERVICE_CONFIG,
  GET_SERVICE_CONFIG_SUCCESS,
  GET_SERVICE_CONFIG_FAILURE,
  GET_PROVIDER_TYPE,
  GET_PROVIDER_TYPE_SUCCESS,
  GET_PROVIDER_TYPE_FAILURE,
  GET_DAEMON_CONFIG,
  GET_DAEMON_CONFIG_SUCCESS,
  GET_DAEMON_CONFIG_FAILURE,
  GET_TRANSACTION_TYPE,
  GET_TRANSACTION_TYPE_SUCCESS,
  GET_TRANSACTION_TYPE_FAILURE,
} from "Actions/types";

//action for Liquidity manager List and set type for reducers
export const getLiquidityManagerList = Data => ({
  type: GET_LIQUIDITY_API_MANAGER_LIST,
  payload: { Data }
});

//action for set Success and Liquidity manager List and set type for reducers
export const getLiquidityManagerListSuccess = response => ({
  type: GET_LIQUIDITY_API_MANAGER_SUCCESS,
  payload: response.Response
});

//action for set failure and error to Liquidity manager List and set type for reducers
export const getLiquidityManagerListFailure = error => ({
  type: GET_LIQUIDITY_API_MANAGER_FAILURE,
  payload: error
});

//action for add Liquidity manager List and set type for reducers
export const addLiquidityManagerList = Data => ({
  type: ADD_LIQUIDITY_API_MANAGER_LIST,
  payload: { Data }
});

//action for set Success and add Liquidity manager List and set type for reducers
export const addLiquidityManagerListSuccess = response => ({
  type: ADD_LIQUIDITY_API_MANAGER_SUCCESS,
  payload: response
});

//action for set failure and error to add Liquidity manager List and set type for reducers
export const addLiquidityManagerListFailure = error => ({
  type: ADD_LIQUIDITY_API_MANAGER_FAILURE,
  payload: error
});

//action for UPDATE Liquidity manager List and set type for reducers
export const updateLiquidityManagerList = Data => ({
  type: UPDATE_LIQUIDITY_API_MANAGER_LIST,
  payload: { Data }
});

//action for set Success and UPDATE Liquidity manager List and set type for reducers
export const updateLiquidityManagerListSuccess = response => ({
  type: UPDATE_LIQUIDITY_API_MANAGER_SUCCESS,
  payload: response
});

//action for set failure and error to UPDATE Liquidity manager List and set type for reducers
export const updateLiquidityManagerListFailure = error => ({
  type: UPDATE_LIQUIDITY_API_MANAGER_FAILURE,
  payload: error
});

//action for Liquidity Provider List and set type for reducers
export const getLiquidityProviderList = Data => ({
  type: GET_LIQUIDITY_PROVIDER_LIST,
  payload: { Data }
});

//action for set Success and Liquidity Provider List and set type for reducers
export const getLiquidityProviderListSuccess = response => ({
  type: GET_LIQUIDITY_PROVIDER_SUCCESS,
  payload: response.data
});

//action for set failure and error to Liquidity Provider List and set type for reducers
export const getLiquidityProviderListFailure = error => ({
  type: GET_LIQUIDITY_PROVIDER_FAILURE,
  payload: error.message
});

//action for ADD Liquidity Provider List and set type for reducers
export const addLiquidityProviderList = Data => ({
  type: ADD_LIQUIDITY_PROVIDER_LIST,
  payload: { Data }
});

//action for set Success and ADD Liquidity Provider List and set type for reducers
export const addLiquidityProviderListSuccess = response => ({
  type: ADD_LIQUIDITY_PROVIDER_SUCCESS,
  payload: response.data
});

//action for set failure and error to ADD Liquidity Provider List and set type for reducers
export const addLiquidityProviderListFailure = error => ({
  type: ADD_LIQUIDITY_PROVIDER_FAILURE,
  payload: error.message
});

//action for update Liquidity Provider List and set type for reducers
export const updateLiquidityProviderList = Data => ({
  type: UPDATE_LIQUIDITY_PROVIDER_LIST,
  payload: { Data }
});

//action for set Success and update Liquidity Provider List and set type for reducers
export const updateLiquidityProviderListSuccess = response => ({
  type: UPDATE_LIQUIDITY_PROVIDER_SUCCESS,
  payload: response.data
});

//action for set failure and error to update Liquidity Provider List and set type for reducers
export const updateLiquidityProviderListFailure = error => ({
  type: UPDATE_LIQUIDITY_PROVIDER_FAILURE,
  payload: error.message
});

//action for delete Liquidity Provider List and set type for reducers
export const deleteLiquidityProviderList = Data => ({
  type: DELETE_LIQUIDITY_PROVIDER_LIST,
  payload: { Data }
});

//action for set Success and delete Liquidity Provider List and set type for reducers
export const deleteLiquidityProviderListSuccess = response => ({
  type: DELETE_LIQUIDITY_PROVIDER_SUCCESS,
  payload: response.data
});

//action for set failure and error to delete Liquidity Provider List and set type for reducers
export const deleteLiquidityProviderListFailure = error => ({
  type: DELETE_LIQUIDITY_PROVIDER_FAILURE,
  payload: error.message
});

//action for Providers List and set type for reducers
export const getProvidersList = Data => ({
  type: GET_PROVIDERS_LIST,
  payload: { Data }
});

//action for set Success and Providers List and set type for reducers
export const getProvidersListSuccess = response => ({
  type: GET_PROVIDERS_LIST_SUCCESS,
  payload: response.Response
});

//action for set failure and error to Providers List and set type for reducers
export const getProvidersListFailure = error => ({
  type: GET_PROVIDERS_LIST_FAILURE,
  payload: error
});

//action for Limit Data List and set type for reducers
export const getLimitDataList = Data => ({
  type: GET_LIMIT_DATA,
  payload: { Data }
});

//action for set Success and Limit Data List and set type for reducers
export const getLimitDataListSuccess = response => ({
  type: GET_LIMIT_DATA_SUCCESS,
  payload: response.Response
});

//action for set failure and error to Limit Data List and set type for reducers
export const getLimitDataListFailure = error => ({
  type: GET_LIMIT_DATA_FAILURE,
  payload: error
});

//action for Service Provider List and set type for reducers
export const getServiceProviderList = Data => ({
  type: GET_SERVICE_PROVIDER,
  payload: { Data }
});

//action for set Success and Service Provider List and set type for reducers
export const getServiceProviderListSuccess = response => ({
  type: GET_SERVICE_PROVIDER_SUCCESS,
  payload: response.Response
});

//action for set failure and error to Service Provider List and set type for reducers
export const getServiceProviderListFailure = error => ({
  type: GET_SERVICE_PROVIDER_FAILURE,
  payload: error
});

//action for Service Configuration List and set type for reducers
export const getServiceConfigurationList = Data => ({
  type: GET_SERVICE_CONFIG,
  payload: { Data }
});

//action for set Success and Service Configuration List and set type for reducers
export const getServiceConfigurationListSuccess = response => ({
  type: GET_SERVICE_CONFIG_SUCCESS,
  payload: response.Response
});

//action for set failure and error to Service Configuration List and set type for reducers
export const getServiceConfigurationListFailure = error => ({
  type: GET_SERVICE_CONFIG_FAILURE,
  payload: error
});

//action for Provider Type  List and set type for reducers
export const getProviderTypeList = Data => ({
  type: GET_PROVIDER_TYPE,
  payload: { Data }
});

//action for set Success and Provider Type  List and set type for reducers
export const getProviderTypeListSuccess = response => ({
  type: GET_PROVIDER_TYPE_SUCCESS,
  payload: response.Response
});

//action for set failure and error to Provider Type  List and set type for reducers
export const getProviderTypeListFailure = error => ({
  type: GET_PROVIDER_TYPE_FAILURE,
  payload: error
});

//action for Daemon Config List  List and set type for reducers
export const getDaemonConfigList = Data => ({
  type: GET_DAEMON_CONFIG,
  payload: { Data }
});

//action for set Success and Daemon Config List  List and set type for reducers
export const getDaemonConfigListSuccess = response => ({
  type: GET_DAEMON_CONFIG_SUCCESS,
  payload: response.Response
});

//action for set failure and error to Daemon Config List  List and set type for reducers
export const getDaemonConfigListFailure = error => ({
  type: GET_DAEMON_CONFIG_FAILURE,
  payload: error
});

//action for Transaction Type List  List and set type for reducers
export const getTransactionTypeList = Data => ({
  type: GET_TRANSACTION_TYPE,
  payload: { Data }
});

//action for set Success and Transaction Type List  List and set type for reducers
export const getTransactionTypeListSuccess = response => ({
  type: GET_TRANSACTION_TYPE_SUCCESS,
  payload: response.Response
});

//action for set failure and error to Transaction Type List  List and set type for reducers
export const getTransactionTypeListFailure = error => ({
  type: GET_TRANSACTION_TYPE_FAILURE,
  payload: error
});
