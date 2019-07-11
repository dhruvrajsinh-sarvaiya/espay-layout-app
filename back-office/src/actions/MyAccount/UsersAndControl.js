/*
    Developer : Bharat Jograna
    Date : 18-02-2019
    update by :
    File Comment : Users and Control Action
*/
import {
    USERS_ADD_ROLE,
    USERS_ADD_ROLE_SUCCESS,
    USERS_ADD_ROLE_FAILURE,

    USERS_LIST_ROLE,
    USERS_LIST_ROLE_SUCCESS,
    USERS_LIST_ROLE_FAILURE,
} from "../types";

/**
 * Redux Action To Users Role Add Report Data
 */
export const addRole = data => ({
    type: USERS_ADD_ROLE,
    payload: data
});

/**
 * Redux Action To Users Role Add Report Data Success
 */
export const addRoleSuccess = data => ({
    type: USERS_ADD_ROLE_SUCCESS,
    payload: data
});

/**
 * Redux Action To Users Role Add Report Data Failure
 */
export const addRoleFailure = error => ({
    type: USERS_ADD_ROLE_FAILURE,
    payload: error
});

/**
 * Redux Action To Users Role Add Report Data
 */
export const listRole = data => ({
    type: USERS_LIST_ROLE,
    payload: data
});

/**
 * Redux Action To Users Role Add Report Data Success
 */
export const listRoleSuccess = data => ({
    type: USERS_LIST_ROLE_SUCCESS,
    payload: data
});

/**
 * Redux Action To Users Role Add Report Data Failure
 */
export const listRoleFailure = error => ({
    type: USERS_LIST_ROLE_FAILURE,
    payload: error
});
