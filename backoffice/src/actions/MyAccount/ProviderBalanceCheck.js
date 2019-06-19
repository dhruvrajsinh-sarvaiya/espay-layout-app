/* 
    Developer : Salim Deraiya
    Date : 17-06-2019
    File Comment : Provider Balance Check Actions
*/
import {
    // Get Provider Balance Check list...
    GET_PROVIDER_BALANCE_CHECK_LIST,
    GET_PROVIDER_BALANCE_CHECK_LIST_SUCCESS,
    GET_PROVIDER_BALANCE_CHECK_LIST_FAILURE,
} from "Actions/types";

/* Get Provider Balance Check list... */
export const getProviderBalanceCheckList = (request) => ({
    type: GET_PROVIDER_BALANCE_CHECK_LIST,
    payload: request
});
export const getProviderBalanceCheckListSuccess = (response) => ({
    type: GET_PROVIDER_BALANCE_CHECK_LIST_SUCCESS,
    payload: response
});
export const getProviderBalanceCheckListFailure = (error) => ({
    type: GET_PROVIDER_BALANCE_CHECK_LIST_FAILURE,
    payload: error
});