/* 
    Developer : Kevin Ladani
    Date : 16-01-2019
    File Comment : MyAccount List IP Range Dashboard Actions
*/
import {
    LIST_IPRANGE_DASHBOARD,
    LIST_IPRANGE_DASHBOARD_SUCCESS,
    LIST_IPRANGE_DASHBOARD_FAILURE,

    ADD_IPRANGE_DASHBOARD,
    ADD_IPRANGE_DASHBOARD_SUCCESS,
    ADD_IPRANGE_DASHBOARD_FAILURE,

    DELETE_IPRANGE_DASHBOARD,
    DELETE_IPRANGE_DASHBOARD_SUCCESS,
    DELETE_IPRANGE_DASHBOARD_FAILURE,

} from "../types";

//For Display IPWhitelist Data

//Redux Action To Display IPRange Data
export const getIPRangeData = data => ({
    type: LIST_IPRANGE_DASHBOARD,
    payload: data
});

//Redux Action To Display IPRange Data Success
export const getIPRangeDataSuccess = response => ({
    type: LIST_IPRANGE_DASHBOARD_SUCCESS,
    payload: response
});

//Redux Action To Display IPRange Data Failure
export const getIPRangeDataFailure = error => ({
    type: LIST_IPRANGE_DASHBOARD_FAILURE,
    payload: error
});


//For Add IPRange Data

//Redux Action To Add IPRange Data
export const addIPRangeData = data => ({
    type: ADD_IPRANGE_DASHBOARD,
    payload: data
});

//Redux Action To Add IPRange Data Success
export const addIPRangeDataSuccess = data => ({
    type: ADD_IPRANGE_DASHBOARD_SUCCESS,
    payload: data
});

//Redux Action To Add IPRange Data Failure
export const addIPRangeDataFailure = error => ({
    type: ADD_IPRANGE_DASHBOARD_FAILURE,
    payload: error
});

//For Delete IPRange Data

//Redux Action To Delete IPRange Data
export const deleteIPRangeData = data => ({
    type: DELETE_IPRANGE_DASHBOARD,
    payload: data
});

//Redux Action To Delete IPRange Data Success
export const deleteIPRangeDataSuccess = data => ({
    type: DELETE_IPRANGE_DASHBOARD_SUCCESS,
    payload: data
});

//Redux Action To Delete IPRange Data Failure
export const deleteIPRangeDataFailure = error => ({
    type: DELETE_IPRANGE_DASHBOARD_FAILURE,
    payload: error
});