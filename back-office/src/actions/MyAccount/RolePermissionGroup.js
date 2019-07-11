/**
 * Auther : Salim Deraiya
 * Created : 22/02/2019
 * Role Permission Group Actions
 */

//Import action types form type.js
import {
    //Add Role Permission Group
    ADD_ROLE_PERMISSION_GROUP,
    ADD_ROLE_PERMISSION_GROUP_SUCCESS,
    ADD_ROLE_PERMISSION_GROUP_FAILURE,

    //Edit Role Permission Group
    EDIT_ROLE_PERMISSION_GROUP,
    EDIT_ROLE_PERMISSION_GROUP_SUCCESS,
    EDIT_ROLE_PERMISSION_GROUP_FAILURE,

    //Change Role Permission Group Status
    CHANGE_ROLE_PERMISSION_GROUP_STATUS,
    CHANGE_ROLE_PERMISSION_GROUP_STATUS_SUCCESS,
    CHANGE_ROLE_PERMISSION_GROUP_STATUS_FAILURE,

    //List Role Permission Group
    LIST_ROLE_PERMISSION_GROUP,
    LIST_ROLE_PERMISSION_GROUP_SUCCESS,
    LIST_ROLE_PERMISSION_GROUP_FAILURE,

    //Get By Id Role Permission Group    
    GET_BY_ID_ROLE_PERMISSION_GROUP,
    GET_BY_ID_ROLE_PERMISSION_GROUP_SUCCESS,
    GET_BY_ID_ROLE_PERMISSION_GROUP_FAILURE,

    //Get Configuration Role Permission Group
    GET_CONFIGURATION_ROLE_PERMISSION_GROUP,
    GET_CONFIGURATION_ROLE_PERMISSION_GROUP_SUCCESS,
    GET_CONFIGURATION_ROLE_PERMISSION_GROUP_FAILURE,

    //Get Configuration Role Permission Group By Id
    GET_CONFIGURATION_ROLE_PERMISSION_GROUP_BY_ID,
    GET_CONFIGURATION_ROLE_PERMISSION_GROUP_BY_ID_SUCCESS,
    GET_CONFIGURATION_ROLE_PERMISSION_GROUP_BY_ID_FAILURE,

} from '../types';

// Redux Action To Add Role Permission Group
export const addRolePermissionGroup = (data) => ({
    type: ADD_ROLE_PERMISSION_GROUP,
    payload: data
})

// Redux Action Add Role Permission Group Success
export const addRolePermissionGroupSuccess = (data) => ({
    type: ADD_ROLE_PERMISSION_GROUP_SUCCESS,
    payload: data
});

// Redux Action Add Role Permission Group Failure
export const addRolePermissionGroupFailure = (error) => ({
    type: ADD_ROLE_PERMISSION_GROUP_FAILURE,
    payload: error
});

// Redux Action To Edit Role Permission Group
export const editRolePermissionGroup = (data) => ({
    type: EDIT_ROLE_PERMISSION_GROUP,
    payload: data
})

// Redux Action Edit Role Permission Group Success
export const editRolePermissionGroupSuccess = (data) => ({
    type: EDIT_ROLE_PERMISSION_GROUP_SUCCESS,
    payload: data
});

// Redux Action Edit Role Permission Group Failure
export const editRolePermissionGroupFailure = (error) => ({
    type: EDIT_ROLE_PERMISSION_GROUP_FAILURE,
    payload: error
});

// Redux Action To Change Status Role Permission Group
export const changeStatusRolePermissionGroup = (data) => ({
    type: CHANGE_ROLE_PERMISSION_GROUP_STATUS,
    payload: data
})

// Redux Action Change Status Role Permission Group Success
export const changeStatusRolePermissionGroupSuccess = (data) => ({
    type: CHANGE_ROLE_PERMISSION_GROUP_STATUS_SUCCESS,
    payload: data
});

// Redux Action Change Status Role Permission Group Failure
export const changeStatusRolePermissionGroupFailure = (error) => ({
    type: CHANGE_ROLE_PERMISSION_GROUP_STATUS_FAILURE,
    payload: error
});

// Redux Action To List Role Permission Group
export const getRolePermissionGroupList = (data) => ({
    type: LIST_ROLE_PERMISSION_GROUP,
    payload: data
})

// Redux Action List Role Permission Group Success
export const getRolePermissionGroupListSuccess = (data) => ({
    type: LIST_ROLE_PERMISSION_GROUP_SUCCESS,
    payload: data
});

// Redux Action List Role Permission Group Failure
export const getRolePermissionGroupListFailure = (error) => ({
    type: LIST_ROLE_PERMISSION_GROUP_FAILURE,
    payload: error
});

// Redux Action To Get By ID Role Permission Group
export const getRolePermissionGroupById = (data) => ({
    type: GET_BY_ID_ROLE_PERMISSION_GROUP,
    payload: data
})

// Redux Action Get By ID Role Permission Group Success
export const getRolePermissionGroupByIdSuccess = (data) => ({
    type: GET_BY_ID_ROLE_PERMISSION_GROUP_SUCCESS,
    payload: data
});

// Redux Action Get By ID Role Permission Group Failure
export const getRolePermissionGroupByIdFailure = (error) => ({
    type: GET_BY_ID_ROLE_PERMISSION_GROUP_FAILURE,
    payload: error
});

//Redux Action To Get Configuration Role Permission Group
export const getConfigurationRolePermissionGroup = () => ({
    type: GET_CONFIGURATION_ROLE_PERMISSION_GROUP
})

// Redux Action Get Configuration Role Permission Group Success
export const getConfigurationRolePermissionGroupSuccess = (data) => ({
    type: GET_CONFIGURATION_ROLE_PERMISSION_GROUP_SUCCESS,
    payload: data
});

// Redux Action Get Configuration Role Permission Group Failure
export const getConfigurationRolePermissionGroupFailure = (error) => ({
    type: GET_CONFIGURATION_ROLE_PERMISSION_GROUP_FAILURE,
    payload: error
});

//Redux Action To Get Configuration Role Permission Group By ID
export const getConfigurationRolePermissionGroupById = (data) => ({
    type: GET_CONFIGURATION_ROLE_PERMISSION_GROUP_BY_ID,
    payload : data
})

// Redux Action Get Configuration Role Permission Group By ID Success
export const getConfigurationRolePermissionGroupByIdSuccess = (data) => ({
    type: GET_CONFIGURATION_ROLE_PERMISSION_GROUP_BY_ID_SUCCESS,
    payload: data
});

// Redux Action Get Configuration Role Permission Group By ID Failure
export const getConfigurationRolePermissionGroupByIdFailure = (error) => ({
    type: GET_CONFIGURATION_ROLE_PERMISSION_GROUP_BY_ID_FAILURE,
    payload: error
});