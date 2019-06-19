/**
 * Auther : Salim Deraiya
 * Created : 14/09/2018
 * Activity List Actions
 */

//Import action types form type.js
import {
    ACTIVITY_LIST,
    ACTIVITY_LIST_SUCCESS,
    ACTIVITY_LIST_FAILURE
} from '../types';

/**
 * Redux Action To Activity List
 */
export const activityList = (data) => ({
    type: ACTIVITY_LIST,
    payload: data
})

/**
 * Redux Action Activity List Success
 */
export const activityListSuccess = (list) => ({
    type: ACTIVITY_LIST_SUCCESS,
    payload: list
});

/**
 * Redux Action Activity List Failure
 */
export const activityListFailure = (error) => ({
    type: ACTIVITY_LIST_FAILURE,
    payload: error
})