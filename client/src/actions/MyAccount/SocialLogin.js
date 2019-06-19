/**
 * Auther : Salim Deraiya
 * Created : 26/09/2018
 * Social Login Actions
 */

 //Import action types form type.js
 import {
    SOCIAL_LOGIN,
    SOCIAL_LOGIN_SUCCESS,
    SOCIAL_LOGIN_FAILURE
} from '../types';

/**
 * Redux Action To Social Login
 */
export const socialLogin = (data) => ({
    type: SOCIAL_LOGIN,
    payload: data
})

/**
 * Redux Action Social Login Success
 */
export const socialLoginSuccess = (data) => ({
    type: SOCIAL_LOGIN_SUCCESS,
    payload: data
});

/**
 * Redux Action Social Login Failure
 */
export const socialLoginFailure = (error) => ({
    type: SOCIAL_LOGIN_FAILURE,
    payload: error
});