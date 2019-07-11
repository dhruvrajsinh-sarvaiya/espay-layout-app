/**
 * Roles Actions
 */
import {
    //For List Roles
    LIST_ROLES,
    LIST_ROLES_SUCCESS,
    LIST_ROLES_FAILURE,

    //For Delete Roles
    DELETE_ROLES,
    DELETE_ROLES_SUCCESS,
    DELETE_ROLES_FAILURE,

    //For Edit Roles
    EDIT_ROLES,
    EDIT_ROLES_SUCCESS,
    EDIT_ROLES_FAILURE,

    //For Add Roles
    ADD_ROLES,
    ADD_ROLES_SUCCESS,
    ADD_ROLES_FAILURE,    

    //For Get Edit Roles By Id
    GET_ROLES_BY_ID,
    GET_ROLES_BY_ID_SUCCESS,
    GET_ROLES_BY_ID_FAILURE,
    
} from "../types";

/**
 * Redux Action To Roles
 */
export const roles = () => ({
    type: LIST_ROLES
});

/**
 * Redux Action To Roles Success
 */
export const rolesSuccess = (list) => ({
    type: LIST_ROLES_SUCCESS,
    payload: list
});

/**
 * Redux Action To Roles Failure
 */
export const rolesFailure = (error) => ({
    type: LIST_ROLES_FAILURE,
    payload: error
});

/**
 * Redux Action To Delete Roles
 */
export const deleteRoles = (data) => ({
    type: DELETE_ROLES,
    payload: data
});

/**
 * Redux Action To Delete Roles Success
 */
export const deleteRolesSuccess = (response) => ({
    type: DELETE_ROLES_SUCCESS,
    payload: response.data
});

/**
 * Redux Action To Delete Roles Failure
 */
export const deleteRolesFailure = (error) => ({
    type: DELETE_ROLES_FAILURE,
    payload: error
});


//For Add Roles
/**
 * Redux Action To Add Roles
 */
export const addRoles = (data) => ({
    type: ADD_ROLES,
    payload: data
});

/**
 * Redux Action To Add Roles Success
 */
export const addRolesSuccess = (data) => ({
    type: ADD_ROLES_SUCCESS,
    payload: data
});

/**
 * Redux Action To Add Roles Failure
 */
export const addRolesFailure = (error) => ({
    type: ADD_ROLES_FAILURE,
    payload: error
});

//For Edit Roles
/**
 * Redux Action To Edit Roles
 */
export const editRoles = (data) => ({
    type: EDIT_ROLES,
    payload: data
});

/**
 * Redux Action To Edit Roles Success
 */
export const editRolesSuccess = (data) => ({
    type: EDIT_ROLES_SUCCESS,
    payload: data
});

/**
 * Redux Action To Edit Roles Failure
 */
export const editRolesFailure = (error) => ({
    type: EDIT_ROLES_FAILURE,
    payload: error
});

/**
 * Redux Action To Get Roles By Id
 */
export const getRolesById = (role_id) => ({
    type: GET_ROLES_BY_ID,
    payload : role_id
});

/**
 * Redux Action To Get Roles By Id Success
 */
export const getRolesByIdSuccess = (data) => ({
    type: GET_ROLES_BY_ID_SUCCESS,
    payload: data
});

/**
 * Redux Action To Get Roles By Id Failure
 */
export const getRolesByIdFailure = (error) => ({
    type: GET_ROLES_BY_ID_FAILURE,
    payload: error
});