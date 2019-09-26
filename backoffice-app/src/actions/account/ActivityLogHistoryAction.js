
//Import action types 
import {

    //Activity Log List
    ACTIVITY_LOG_LIST,
    ACTIVITY_LOG_LIST_SUCCESS,
    ACTIVITY_LOG_LIST_FAILURE,

    //Get Module Type
    GET_MODULE_TYPE,
    GET_MODULE_TYPE_SUCCESS,
    GET_MODULE_TYPE_FAILURE,

    //clear data
    CLEAR_ACTIVITY_LOG,
} from '../ActionTypes';

/**
 * Redux Action To Activity Log List
 */
export const activityLogList = (data) => ({
    type: ACTIVITY_LOG_LIST,
    payload: data
})

/**
 * Redux Action Activity Log List Success
 */
export const activityLogListSuccess = (list) => ({
    type: ACTIVITY_LOG_LIST_SUCCESS,
    payload: list
});

/**
 * Redux Action Activity Log List Failure
 */
export const activityLogListFailure = (error) => ({
    type: ACTIVITY_LOG_LIST_FAILURE,
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

// Redux Action clear data
export const clearActivityLog = () => ({
    type: CLEAR_ACTIVITY_LOG,
});

