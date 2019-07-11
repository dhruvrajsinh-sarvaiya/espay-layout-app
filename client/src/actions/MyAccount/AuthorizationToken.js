/**
 * Auther : Salim Deraiya
 * Created : 11/10/2018
 * Authorization Token Actions
 */

import {
    
    //Generate Token
    GENERATE_TOKEN,
    GENERATE_TOKEN_SUCCESS,
    GENERATE_TOKEN_FAILURE,

    //Refersh Token
    REFRESH_TOKEN,
    REFRESH_TOKEN_SUCCESS,
    REFRESH_TOKEN_FAILURE,

    //Check Token
    CHECK_TOKEN,
    CHECK_TOKEN_SUCCESS,
    CHECK_TOKEN_FAILURE,

} from "../types";


/**
 * Redux Action To Generate Token
 */
export const gerenateToken = (data) => ({
    type: GENERATE_TOKEN,
    payload: data
});

/**
 * Redux Action To Generate Token Success
 */
export const gerenateTokenSuccess = (data) => ({
    type: GENERATE_TOKEN_SUCCESS,
    payload: data
});

/**
 * Redux Action To Generate Token Failure
 */
export const gerenateTokenFailure = (error) => ({
    type: GENERATE_TOKEN_FAILURE,
    payload: error
});

/**
 * Redux Action To Refresh Token
 */
export const refreshToken = (data) => ({
    type: REFRESH_TOKEN,
    payload: data
});

/**
 * Redux Action To Refresh Token Success
 */
export const refreshTokenSuccess = (data) => ({
    type: REFRESH_TOKEN_SUCCESS,
    payload: data
});

/**
 * Redux Action To Refresh Token Failure
 */
export const refreshTokenFailure = (error) => ({
    type: REFRESH_TOKEN_FAILURE,
    payload: error
});

/**
 * Redux Action To Check Token
 */
export const checkToken = (data) => ({
    type: CHECK_TOKEN,
    payload: data
});

/**
 * Redux Action To Check Token Success
 */
export const checkTokenSuccess = (data) => ({
    type: CHECK_TOKEN_SUCCESS,
    payload: data
});

/**
 * Redux Action To Check Token Failure
 */
export const checkTokenFailure = (error) => ({
    type: CHECK_TOKEN_FAILURE,
    payload: error
});