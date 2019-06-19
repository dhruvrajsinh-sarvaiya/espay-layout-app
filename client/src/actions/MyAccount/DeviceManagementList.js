/**
 * Auther : Salim Deraiya
 * Created : 14/09/2018
 * Device Management List Actions
 */

 //Import action types form type.js
 import {
    DEVICE_MANAGEMENT_LIST,
    DEVICE_MANAGEMENT_LIST_SUCCESS,
    DEVICE_MANAGEMENT_LIST_FAILURE
} from '../types';

/**
 * Redux Action Device Management List Success
 */
export const deviceManagementListSuccess = (list) => ({
    type: DEVICE_MANAGEMENT_LIST_SUCCESS,
    payload: list
});

/**
 * Redux Action Device Management List Failure
 */
export const deviceManagementListFailure = (error) => ({
    type: DEVICE_MANAGEMENT_LIST_FAILURE,
    payload: error
})

/**
 * Redux Action To Device Management List
 */
export const deviceManagementList = () => ({
    type: DEVICE_MANAGEMENT_LIST
})
