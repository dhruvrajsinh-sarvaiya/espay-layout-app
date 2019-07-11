/* 
    Developer : Vishva shah
    Date : 15-04-2019
    File Comment : Service provider Balance Actions
*/
import {
    // list...
   GET_SERVICEPROVIDER_LIST,
   GET_SERVICEPROVIDERLIST_SUCCESS,
   GET_SERVICEPROVIDERLIST_FAILURE,
   
} from "../types";

/* List methods.. */
export const getServiceProviderBalanceList = (request) => ({
    type: GET_SERVICEPROVIDER_LIST,
    request: request
});
export const getServiceProviderBalanceListSuccess = (response) => ({
    type: GET_SERVICEPROVIDERLIST_SUCCESS,
    payload: response
});
export const getServiceProviderBalanceListFailure = (error) => ({
    type: GET_SERVICEPROVIDERLIST_FAILURE,
    payload: error
});