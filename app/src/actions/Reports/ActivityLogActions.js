import { action } from '../GlobalActions';
import {
    // Get Activity Log List
    GET_ACTIVITY_LOG_LIST,
    GET_ACTIVITY_LOG_LIST_SUCCESS,
    GET_ACTIVITY_LOG_LIST_FAILURE,

    // Get Module Type
    GET_MODULE_TYPE,
    GET_MODULE_TYPE_SUCCESS,
    GET_MODULE_TYPE_FAILURE,
} from '../ActionTypes';

// Redux Action for Activity Log List
export function getActivityLogList(payload) {
    return action(GET_ACTIVITY_LOG_LIST, { payload })
};
// Redux Action for Activity Log List Success
export function getActivityLogListSuccess(data) {
    return action(GET_ACTIVITY_LOG_LIST_SUCCESS, { data })
};
// Redux Action for Activity Log List Failure
export function getActivityLogListFailure() {
    return action(GET_ACTIVITY_LOG_LIST_FAILURE)
};

// Redux Action To Get Module Type
export function getModuleType() {
    return action(GET_MODULE_TYPE)
};
// Redux Action Get Module Type Success
export function getModuleTypeSuccess(data) {
    return action(GET_MODULE_TYPE_SUCCESS, { data })
};
// Redux Action  Get Module Type Failure
export function getModuleTypeFailure() {
    return action(GET_MODULE_TYPE_FAILURE)
};