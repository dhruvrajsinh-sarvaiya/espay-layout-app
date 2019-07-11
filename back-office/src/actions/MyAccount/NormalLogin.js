/**
 * Auther : Salim Deraiya
 * Created : 11/10/2018
 * Normal Login Actions
 */

import {
    NORMAL_LOGIN,
    NORMAL_LOGIN_SUCCESS,
    NORMAL_LOGIN_FAILURE,
} from "../types";


/**
 * Redux Action To Normal Login
 */
export const normalLogin = (data) => ({
    type: NORMAL_LOGIN,
    payload: data
});

/**
 * Redux Action To Normal Login Success
 */
export const normalLoginSuccess = (data) => ({
    type: NORMAL_LOGIN_SUCCESS,
    payload: data
});

/**
 * Redux Action To Normal Login Failure
 */
export const normalLoginFailure = (error) => ({
    type: NORMAL_LOGIN_FAILURE,
    payload: error
});