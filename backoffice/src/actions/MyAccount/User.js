/**
 * Auther : Saloni Rathod
 * Created : 26/02/2019
 * User Actions
 */

//Import action types form type.js
import {
    //Add User
    ADD_USER,
    ADD_USER_SUCCESS,
    ADD_USER_FAILURE,

    //search user
    SEARCH_USER,
    SEARCH_USER_SUCCESS,
    SEARCH_USER_FAILURE,

    //Edit User
    EDIT_USER,
    EDIT_USER_SUCCESS,
    EDIT_USER_FAILURE,

    //Change User Status
    CHANGE_USER_STATUS,
    CHANGE_USER_STATUS_SUCCESS,
    CHANGE_USER_STATUS_FAILURE,

    //List User
    LIST_USER,
    LIST_USER_SUCCESS,
    LIST_USER_FAILURE,

    //Get By Id User   
    GET_USER_BY_ID,
    GET_USER_BY_ID_SUCCESS,
    GET_USER_BY_ID_FAILURE,

    //To Reinvite User  
    REINVITE_USER,
    REINVITE_USER_SUCCESS,
    REINVITE_USER_FAILURE,
} from '../types';

// Redux Action To Add User
export const addUser = (data) => ({
    type: ADD_USER,
    payload: data
})

// Redux Action Add User Success
export const addUserSuccess = (data) => ({
    type: ADD_USER_SUCCESS,
    payload: data
});

// Redux Action Add User Failure
export const addUserFailure = (error) => ({
    type: ADD_USER_FAILURE,
    payload: error
});

// Redux Action To Edit User
export const editUser = (data) => ({
    type: EDIT_USER,
    payload: data
})

// Redux Action Edit User Success
export const editUserSuccess = (data) => ({
    type: EDIT_USER_SUCCESS,
    payload: data
});

// Redux Action Edit User Failure
export const editUserFailure = (error) => ({
    type: EDIT_USER_FAILURE,
    payload: error
});

// Redux Action To Change Status User
export const changeUserStatus = (data) => ({
    type: CHANGE_USER_STATUS,
    payload: data
})

// Redux Action Change Status User Success
export const changeUserStatusSuccess = (data) => ({
    type: CHANGE_USER_STATUS_SUCCESS,
    payload: data
});

// Redux Action Change Status User Failure
export const changeUserStatusFailure = (error) => ({
    type: CHANGE_USER_STATUS_FAILURE,
    payload: error
});

// Redux Action To List User
export const listUser = (data) => ({
    type: LIST_USER,
    payload: data
})

// Redux Action List User Success
export const listUserSuccess = (data) => ({
    type: LIST_USER_SUCCESS,
    payload: data
});

// Redux Action List User Failure
export const listUserFailure = (error) => ({
    type: LIST_USER_FAILURE,
    payload: error
});

// Redux Action To Get By ID User
export const getUserById = (data) => ({
    type: GET_USER_BY_ID,
    payload: data
})

// Redux Action Get By ID User Success
export const getUserByIdSuccess = (data) => ({
    type: GET_USER_BY_ID_SUCCESS,
    payload: data
});

// Redux Action Get By ID User Failure
export const getUserByIdFailure = (error) => ({
    type: GET_USER_BY_ID_FAILURE,
    payload: error
});
// Redux Action To Get By ID User
export const searchUser = (data) => ({
    type: SEARCH_USER,
    payload: data
})

// Redux Action Get By ID User Success
export const searchUserSuccess = (data) => ({
    type: SEARCH_USER_SUCCESS,
    payload: data
});

// Redux Action Get By ID User Failure
export const searchUserFailure = (error) => ({
    type: SEARCH_USER_FAILURE,
    payload: error
});

// Redux Action To Get By ID User
export const reInviteUser = (data) => ({
    type: REINVITE_USER,
    payload: data
})

// Redux Action Get By ID User Success
export const reInviteUserSuccess = (data) => ({
    type: REINVITE_USER_SUCCESS,
    payload: data
});

// Redux Action Get By ID User Failure
export const reInviteUserFailure = (error) => ({
    type: REINVITE_USER_FAILURE,
    payload: error
});