import {
    //liquidity api manager list
    GET_LIQUIDITY_API_MANAGER_LIST,
    GET_LIQUIDITY_API_MANAGER_LIST_SUCCESS,
    GET_LIQUIDITY_API_MANAGER_LIST_FAILURE,

    //liquidity api manager add
    ADD_LIQUIDITY_API_MANAGER_LIST,
    ADD_LIQUIDITY_API_MANAGER_LIST_SUCCESS,
    ADD_LIQUIDITY_API_MANAGER_LIST_FAILURE,
    ADD_LIQUIDITY_API_MANAGER_LIST_CLEAR,

    //liquidity api manager update
    UPDATE_LIQUIDITY_API_MANAGER_LIST,
    UPDATE_LIQUIDITY_API_MANAGER_LIST_SUCCESS,
    UPDATE_LIQUIDITY_API_MANAGER_LIST_FAILURE,
    UPDATE_LIQUIDITY_API_MANAGER_LIST_CLEAR,

    //provider list
    GET_PROVIDERS_LIST,
    GET_PROVIDERS_LIST_SUCCESS,
    GET_PROVIDERS_LIST_FAILURE,

    //limit data
    GET_LIMIT_DATA,
    GET_LIMIT_DATA_SUCCESS,
    GET_LIMIT_DATA_FAILURE,

    //service provider
    GET_SERVICE_PROVIDER,
    GET_SERVICE_PROVIDER_SUCCESS,
    GET_SERVICE_PROVIDER_FAILURE,

    //daemon config
    GET_DAEMON_CONFIG,
    GET_DAEMON_CONFIG_SUCCESS,
    GET_DAEMON_CONFIG_FAILURE,

    //service config
    GET_SERVICE_CONFIG,
    GET_SERVICE_CONFIG_SUCCESS,
    GET_SERVICE_CONFIG_FAILURE,

    //provider type
    GET_PROVIDER_TYPE,
    GET_PROVIDER_TYPE_SUCCESS,
    GET_PROVIDER_TYPE_FAILURE,

    //transaction type
    GET_TRANSACTION_TYPE,
    GET_TRANSACTION_TYPE_SUCCESS,
    GET_TRANSACTION_TYPE_FAILURE,
} from '../ActionTypes'
import { action } from '../GlobalActions';

// --------------- for LiquidityAPIManager list--------------
//To fetch data
export function GetLiquidityAPIManagerList() {
    return action(GET_LIQUIDITY_API_MANAGER_LIST)
}
//On success result
export function GetLiquidityAPIManagerListSuccess(data) {
    return action(GET_LIQUIDITY_API_MANAGER_LIST_SUCCESS, { data })
}
//On Failure
export function GetLiquidityAPIManagerListFailure() {
    return action(GET_LIQUIDITY_API_MANAGER_LIST_FAILURE)
}
// --------------------------------

// ------------------ for add LiquidityAPIManager Data ------------------
//To Add LiquidityAPIManager 
export function AddLiquidityAPIManagerData(data) {
    return action(ADD_LIQUIDITY_API_MANAGER_LIST, { data })
}
//On Add LiquidityAPIManager  success result
export function AddLiquidityAPIManagerDataSuccess(data) {
    return action(ADD_LIQUIDITY_API_MANAGER_LIST_SUCCESS, { data })
}
//On Add LiquidityAPIManager Failure
export function AddLiquidityAPIManagerDataFailure() {
    return action(ADD_LIQUIDITY_API_MANAGER_LIST_FAILURE)
}
// clear LiquidityAPIManager 
export function AddLiquidityAPIManagerDataClear() {
    return action(ADD_LIQUIDITY_API_MANAGER_LIST_CLEAR)
}
// ---------------------------------------------------

// ------------------------- for edit LiquidityAPIManager------------
//To Edit LiquidityAPIManager  
export function EditLiquidityAPIManagerData(data) {
    return action(UPDATE_LIQUIDITY_API_MANAGER_LIST, { data })
}
//On Edit LiquidityAPIManager success result
export function EditLiquidityAPIManagerDataSuccess(data) {
    return action(UPDATE_LIQUIDITY_API_MANAGER_LIST_SUCCESS, { data })
}
//On Edit LiquidityAPIManager Failure
export function EditLiquidityAPIManagerDataFailure() {
    return action(UPDATE_LIQUIDITY_API_MANAGER_LIST_FAILURE)
}
// clear LiquidityAPIManager 
export function EditLiquidityAPIManagerDataClear() {
    return action(UPDATE_LIQUIDITY_API_MANAGER_LIST_CLEAR)
}
// ---------------------------------------------------------------------------

// --------------- for ApiProviderLList --------------
//To fetch data
export function GetApiProviderList() {
    return action(GET_PROVIDERS_LIST)
}
//On success result
export function GetApiProviderListSuccess(data) {
    return action(GET_PROVIDERS_LIST_SUCCESS, { data })
}
//On Failure
export function GetApiProviderListFailure() {
    return action(GET_PROVIDERS_LIST_FAILURE)
}
// --------------------------------

// --------------- for Limitdata --------------
//To fetch data
export function GetLimitdataList() {
    return action(GET_LIMIT_DATA)
}
//On success result
export function GetLimitdataListSuccess(data) {
    return action(GET_LIMIT_DATA_SUCCESS, { data })
}
//On Failure
export function GetLimitdataListFailure() {
    return action(GET_LIMIT_DATA_FAILURE)
}
// --------------------------------

// --------------- for ServiceProvider --------------
//To fetch data
export function GetServiceProviderList() {
    return action(GET_SERVICE_PROVIDER)
}
//On success result
export function GetServiceProviderListSuccess(data) {
    return action(GET_SERVICE_PROVIDER_SUCCESS, { data })
}
//On Failure
export function GetServiceProviderListFailure() {
    return action(GET_SERVICE_PROVIDER_FAILURE)
}
// --------------------------------

// --------------- for Daemon Configuration --------------
//To fetch data
export function GetDaemonConfigList() {
    return action(GET_DAEMON_CONFIG)
}
//On success result
export function GetDaemonConfigListSuccess(data) {
    return action(GET_DAEMON_CONFIG_SUCCESS, { data })
}
//On Failure
export function GetDaemonConfigListFailure() {
    return action(GET_DAEMON_CONFIG_FAILURE)
}
// --------------------------------

// --------------- for provider Configuration --------------
//To fetch data
export function GetproviderConfigList() {
    return action(GET_SERVICE_CONFIG)
}
//On success result
export function GetproviderConfigListSuccess(data) {
    return action(GET_SERVICE_CONFIG_SUCCESS, { data })
}
//On Failure
export function GetproviderConfigListFailure() {
    return action(GET_SERVICE_CONFIG_FAILURE)
}
// --------------------------------

// --------------- for ProviderType --------------
//To fetch data
export function GetProviderTypeList() {
    return action(GET_PROVIDER_TYPE)
}
//On success result
export function GetProviderTypeListSuccess(data) {
    return action(GET_PROVIDER_TYPE_SUCCESS, { data })
}
//On Failure
export function GetProviderTypeListFailure() {
    return action(GET_PROVIDER_TYPE_FAILURE)
}
// --------------------------------

// --------------- for TransactionType --------------
//To fetch data
export function GetTransactionTypeList() {
    return action(GET_TRANSACTION_TYPE)
}
//On success result
export function GetTransactionTypeListSuccess(data) {
    return action(GET_TRANSACTION_TYPE_SUCCESS, { data })
}
//On Failure
export function GeTransactionTypeListFailure() {
    return action(GET_TRANSACTION_TYPE_FAILURE)
}
// --------------------------------
