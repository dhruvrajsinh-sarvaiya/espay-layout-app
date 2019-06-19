/**
 * Auther : Salim Deraiya
 * Created : 29/12/2018
 * Activity History List Actions
 */

//Import action types form type.js
import {
    GET_USER_DATA,
    GET_USER_DATA_SUCCESS,
    GET_USER_DATA_FAILURE,

    GET_MODULE_TYPE,
    GET_MODULE_TYPE_SUCCESS,
    GET_MODULE_TYPE_FAILURE,

    ACTIVITY_HISTORY_LIST,
    ACTIVITY_HISTORY_LIST_SUCCESS,
    ACTIVITY_HISTORY_LIST_FAILURE
} from '../types';

// Redux Action To Activity History List
export const activityHistoryList = (data) => ({
    type: ACTIVITY_HISTORY_LIST,
    payload: data
})

// Redux Action Activity History List Success
export const activityHistoryListSuccess = (list) => ({
    type: ACTIVITY_HISTORY_LIST_SUCCESS,
    payload: list
});

// Redux Action Activity History List Failure
export const activityHistoryListFailure = (error) => ({
    type: ACTIVITY_HISTORY_LIST_FAILURE,
    payload: error
});


// Redux Action To Activity History Get Module Type
export const getModuleType = () => ({
    type: GET_MODULE_TYPE
})

// Redux Action Activity History Get Module Type Success
export const getModuleTypeSuccess = (data) => ({
    type: GET_MODULE_TYPE_SUCCESS,
    payload: data
});

// Redux Action Activity History Get Module Type Failure
export const getModuleTypeFailure = (error) => ({
    type: GET_MODULE_TYPE_FAILURE,
    payload: error
});

// Redux Action To Activity History Get User Data
export const getUserDataList = () => ({
    type: GET_USER_DATA
})

// Redux Action Activity History Get User Data Success
export const getUserDataListSuccess = (data) => ({
    type: GET_USER_DATA_SUCCESS,
    payload: data
});

// Redux Action Activity History Get User Data Failure
export const getUserDataListFailure = (error) => ({
    type: GET_USER_DATA_FAILURE,
    payload: error
});