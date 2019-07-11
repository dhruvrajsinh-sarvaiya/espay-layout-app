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

    // MENU PERSMISSION BY ID - added by nishant on 29-04-2019
    GET_MENU_ACCESS_BY_ID,
    GET_MENU_ACCESS_BY_ID_SUCCESS,
    GET_MENU_ACCESS_BY_ID_FAILURE,
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

/* 
    GET MENU PERMISSION BY ID - added by nishant (29-04-2019)
*/
export const getMenuPermissionByID = (parentId) => ({
    type: GET_MENU_ACCESS_BY_ID,
    parentId: parentId
});
/* 
GET MENU PERMISSION BY ID success - added by nishant (29-04-2019)
*/
export const getMenuPermissionByIDSuccess = (response) => ({
    type: GET_MENU_ACCESS_BY_ID_SUCCESS,
    payload: response
});
/* 
GET MENU PERMISSION BY ID failure - added by nishant (29-04-2019)
*/
export const getMenuPermissionByIDFailure = (error) => ({
    type: GET_MENU_ACCESS_BY_ID_FAILURE,
    payload: error
});