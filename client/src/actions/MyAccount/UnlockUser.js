/**
 * Auther : Salim Deraiya
 * Created : 01/11/2018
 * Unlock User Actions
 */

 //Import action types form type.js
 import {
    UNLOCK_USER,
    UNLOCK_USER_SUCCESS,
    UNLOCK_USER_FAILURE
} from '../types';

/**
 * Redux Action To Unlock User
 */
export const unlockUser = (data) => ({
    type: UNLOCK_USER,
    payload: data
})

/**
 * Redux Action Unlock User Success
 */
export const unlockUserSuccess = (data) => ({
    type: UNLOCK_USER_SUCCESS,
    payload: data
});

/**
 * Redux Action Unlock User Failure
 */
export const unlockUserFailure = (error) => ({
    type: UNLOCK_USER_FAILURE,
    payload: error
});