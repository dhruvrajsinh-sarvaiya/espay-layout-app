/**
 * Create By Sanjay 
 * Created Date 19/03/2019
 * Actions For Rest API Method 
 */

import {
    LIST_API_METHOD,
    LIST_API_METHOD_SUCCESS,
    LIST_API_METHOD_FAILURE,

    ADD_API_METHOD,
    ADD_API_METHOD_SUCCESS,
    ADD_API_METHOD_FAILURE,

    UPDATE_API_METHOD,
    UPDATE_API_METHOD_SUCCESS,
    UPDATE_API_METHOD_FAILURE,

    LIST_SYSTEM_RESET_METHOD,
    LIST_SYSTEM_RESET_METHOD_SUCCESS,
    LIST_SYSTEM_RESET_METHOD_FAILURE,

    LIST_SOCKET_METHOD,
    LIST_SOCKET_METHOD_SUCCESS,
    LIST_SOCKET_METHOD_FAILURE
} from "../types";

//For Display API Method List

export const getApiMethodData = () => ({
    type: LIST_API_METHOD
});

export const getApiMethodDataSuccess = (response) => ({
    type: LIST_API_METHOD_SUCCESS,
    payload: response
});

export const getApiMethodDataFailure = (error) => ({
    type: LIST_API_METHOD_FAILURE,
    payload: error
});

//For Add Api Method

export const addApiMethod = (request) => ({
    type: ADD_API_METHOD,
    payload: request
});

export const addApiMethodSuccess = (response) => ({
    type: ADD_API_METHOD_SUCCESS,
    payload: response
});

export const addApiMethodFailure = (error) => ({
    type: ADD_API_METHOD_FAILURE,
    payload: error
});

//For Edit Api Method 

export const updateApiMethod = (request) => ({
    type: UPDATE_API_METHOD,
    payload: request
});

export const updateApiMethodSuccess = (response) => ({
    type: UPDATE_API_METHOD_SUCCESS,
    payload: response
});

export const updateApiMethodFailure = (error) => ({
    type: UPDATE_API_METHOD_FAILURE,
    payload: error
});

export const getSystemResetMethodData = () => ({
    type: LIST_SYSTEM_RESET_METHOD
});

export const getSystemResetMethodDataSuccess = (response) => ({
    type: LIST_SYSTEM_RESET_METHOD_SUCCESS,
    payload: response
});

export const getSystemResetMethodDataFailure = (error) => ({
    type: LIST_SYSTEM_RESET_METHOD_FAILURE,
    payload: error
});

export const getSocketMethodData = () => ({
    type: LIST_SOCKET_METHOD
});

export const getSocketMethodDataSuccess = (response) => ({
    type: LIST_SOCKET_METHOD_SUCCESS,
    payload: response
});

export const getSocketMethodDataFailure = (error) => ({
    type: LIST_SOCKET_METHOD_FAILURE,
    payload: error
});