/*
Action : TrnTypeRoleWise Action For Create Read Update Delete
Created By : Sanjay Rathod
Date : 02/01/2019
*/

import {
    GET_TRNTYPE_ROLEWISE,
    GET_TRNTYPE_ROLEWISE_SUCCESS,
    GET_TRNTYPE_ROLEWISE_FAILURE,

    UPDATE_TRNTYPE_ROLEWISE_STATUS,
    UPDATE_TRNTYPE_ROLEWISE_STATUS_SUCCESS,
    UPDATE_TRNTYPE_ROLEWISE_STATUS_FAILURE,

    ADD_TRNTYPE_ROLEWISE,
    ADD_TRNTYPE_ROLEWISE_SUCCESS,
    ADD_TRNTYPE_ROLEWISE_FAILURE

} from "../types";

//Get Transaction Type Role Wise Action
export const getTrnTypeRoleWise = (request) => ({
    type: GET_TRNTYPE_ROLEWISE,
    request: request
});
export const getTrnTypeRoleWiseSuccess = (response) => ({
    type: GET_TRNTYPE_ROLEWISE_SUCCESS,
    payload: response
});
export const getTrnTypeRoleWiseFailure = (error) => ({
    type: GET_TRNTYPE_ROLEWISE_FAILURE,
    payload: error
});

//Update Transaction Type Role Wise Status Action
export const updateTrnTypeRoleWiseStatus = (request) => ({
    type: UPDATE_TRNTYPE_ROLEWISE_STATUS,
    payload: request
});
export const updateTrnTypeRoleWiseStatusSuccess = (response) => ({
    type: UPDATE_TRNTYPE_ROLEWISE_STATUS_SUCCESS,
    payload: response
});
export const updateTrnTypeRoleWiseStatusFailure = (error) => ({
    type: UPDATE_TRNTYPE_ROLEWISE_STATUS_FAILURE,
    payload: error
});


//Add TrnTypeRoleWise Actions
export const addTrnTypeRoleWise = request => ({
    type: ADD_TRNTYPE_ROLEWISE,
    payload: request
});
export const addTrnTypeRoleWiseSuccess = response => ({
    type: ADD_TRNTYPE_ROLEWISE_SUCCESS,
    payload: response
});
export const addTrnTypeRoleWiseFailure = error => ({
    type: ADD_TRNTYPE_ROLEWISE_FAILURE,
    payload: error
});

