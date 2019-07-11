/**
 * Auther : Salim Deraiya
 * Created : 22/02/2019
 * Updated By : Bharat Jograna 01/03/2019
 * Role Management Actions
 */

//Import action types form type.js
import {
    //Add Role Management
    ADD_ROLE_MANAGEMENT,
    ADD_ROLE_MANAGEMENT_SUCCESS,
    ADD_ROLE_MANAGEMENT_FAILURE,

    //Edit Role Management
    EDIT_ROLE_MANAGEMENT,
    EDIT_ROLE_MANAGEMENT_SUCCESS,
    EDIT_ROLE_MANAGEMENT_FAILURE,

    //Change Role Management Status
    CHANGE_ROLE_MANAGEMENT_STATUS,
    CHANGE_ROLE_MANAGEMENT_STATUS_SUCCESS,
    CHANGE_ROLE_MANAGEMENT_STATUS_FAILURE,

    //List Role Management
    LIST_ROLE_MANAGEMENT,
    LIST_ROLE_MANAGEMENT_SUCCESS,
    LIST_ROLE_MANAGEMENT_FAILURE,

    //Get By Id Role Management    
    GET_BY_ID_ROLE_MANAGEMENT,
    GET_BY_ID_ROLE_MANAGEMENT_SUCCESS,
    GET_BY_ID_ROLE_MANAGEMENT_FAILURE,

    //Assign Role Management
    ASSIGN_ROLE_MANAGEMENT,
    ASSIGN_ROLE_MANAGEMENT_SUCCESS,
    ASSIGN_ROLE_MANAGEMENT_FAILURE,

    // Role Assign Hestory  (Added By Bharat Jograna)
    USERS_ROLE_ASSIGN_HISTORY,
    USERS_ROLE_ASSIGN_HISTORY_SUCCESS,
    USERS_ROLE_ASSIGN_HISTORY_FAILURE,

    // List User Role Assign (Added By Bharat Jograna)
    LIST_USER_ROLE_ASSIGN_BY_ROLE_ID,
    LIST_USER_ROLE_ASSIGN_BY_ROLE_ID_SUCCESS,
    LIST_USER_ROLE_ASSIGN_BY_ROLE_ID_FAILURE,

    // For User Managemanet Remove And Assign Role (Added By Bharat Jograna)
    REMOVE_AND_ASSIGN_ROLE,
    REMOVE_AND_ASSIGN_ROLE_SUCCESS,
    REMOVE_AND_ASSIGN_ROLE_FAILURE,

    // For List Unassign User Role (Added By Bharat Jograna) 
    LIST_UNASSIGN_USER_ROLE,
    LIST_UNASSIGN_USER_ROLE_SUCCESS,
    LIST_UNASSIGN_USER_ROLE_FAILURE,

} from '../types';

// Redux Action To Add Role Management
export const addRoleManagement = (data) => ({
    type: ADD_ROLE_MANAGEMENT,
    payload: data
})

// Redux Action Add Role Management Success
export const addRoleManagementSuccess = (data) => ({
    type: ADD_ROLE_MANAGEMENT_SUCCESS,
    payload: data
});

// Redux Action Add Role Management Failure
export const addRoleManagementFailure = (error) => ({
    type: ADD_ROLE_MANAGEMENT_FAILURE,
    payload: error
});

// Redux Action To Edit Role Management
export const editRoleManagement = (data) => ({
    type: EDIT_ROLE_MANAGEMENT,
    payload: data
})

// Redux Action Edit Role Management Success
export const editRoleManagementSuccess = (data) => ({
    type: EDIT_ROLE_MANAGEMENT_SUCCESS,
    payload: data
});

// Redux Action Edit Role Management Failure
export const editRoleManagementFailure = (error) => ({
    type: EDIT_ROLE_MANAGEMENT_FAILURE,
    payload: error
});

// Redux Action To Change Status Role Management
export const changeStatusRoleManagement = (data) => ({
    type: CHANGE_ROLE_MANAGEMENT_STATUS,
    payload: data
})

// Redux Action Change Status Role Management Success
export const changeStatusRoleManagementSuccess = (data) => ({
    type: CHANGE_ROLE_MANAGEMENT_STATUS_SUCCESS,
    payload: data
});

// Redux Action Change Status Role Management Failure
export const changeStatusRoleManagementFailure = (error) => ({
    type: CHANGE_ROLE_MANAGEMENT_STATUS_FAILURE,
    payload: error
});

// Redux Action To List Role Management
export const getRoleManagementList = (data) => ({
    type: LIST_ROLE_MANAGEMENT,
    payload: data
})

// Redux Action List Role Management Success
export const getRoleManagementListSuccess = (data) => ({
    type: LIST_ROLE_MANAGEMENT_SUCCESS,
    payload: data
});

// Redux Action List Role Management Failure
export const getRoleManagementListFailure = (error) => ({
    type: LIST_ROLE_MANAGEMENT_FAILURE,
    payload: error
});

// Redux Action To Get By ID Role Management
export const getRoleManagementById = (data) => ({
    type: GET_BY_ID_ROLE_MANAGEMENT,
    payload: data
})

// Redux Action Get By ID Role Management Success
export const getRoleManagementByIdSuccess = (data) => ({
    type: GET_BY_ID_ROLE_MANAGEMENT_SUCCESS,
    payload: data
});

// Redux Action Get By ID Role Management Failure
export const getRoleManagementByIdFailure = (error) => ({
    type: GET_BY_ID_ROLE_MANAGEMENT_FAILURE,
    payload: error
});

// Redux Action To Assign Role Management
export const assignRoleManagement = (data) => ({
    type: ASSIGN_ROLE_MANAGEMENT,
    payload: data
})

// Redux Action Assign Role Management Success
export const assignRoleManagementSuccess = (data) => ({
    type: ASSIGN_ROLE_MANAGEMENT_SUCCESS,
    payload: data
});

// Redux Action Assign Role Management Failure
export const assignRoleManagementFailure = (error) => ({
    type: ASSIGN_ROLE_MANAGEMENT_FAILURE,
    payload: error
});

// Added By Bharat Jograna
/**
 * Redux Action To Users Role Assign History Report Data
 */
export const roleAssignHistory = (data) => ({
    type: USERS_ROLE_ASSIGN_HISTORY,
    payload: data
});

/**
 * Redux Action To Users Role Assign History Report Data Success
 */
export const roleAssignHistorySuccess = (data) => ({
    type: USERS_ROLE_ASSIGN_HISTORY_SUCCESS,
    payload: data
});

/**
 * Redux Action To Users Role Assign History Report Data Failure
 */
export const roleAssignHistoryFailure = (error) => ({
    type: USERS_ROLE_ASSIGN_HISTORY_FAILURE,
    payload: error
});

/**
 * Redux Action To List User Role Assign Data
 */
export const listUserRoleAssignByRoleId = (data) => ({
    type: LIST_USER_ROLE_ASSIGN_BY_ROLE_ID,
    payload: data
});

/**
 * Redux Action To List User Role Assign Data Success
 */
export const listUserRoleAssignByRoleIdSuccess = (data) => ({
    type: LIST_USER_ROLE_ASSIGN_BY_ROLE_ID_SUCCESS,
    payload: data
});

/**
 * Redux Action To List User Role Assign Data Failure
 */
export const listUserRoleAssignByRoleIdFailure = (error) => ({
    type: LIST_USER_ROLE_ASSIGN_BY_ROLE_ID_FAILURE,
    payload: error
});

/**
 * Redux Action To Remove And Assign Role Data
 */
export const removeAndAssignRole = (data) => ({
    type: REMOVE_AND_ASSIGN_ROLE,
    payload: data
});

/**
 * Redux Action To Remove And Assign Role Data Success
 */
export const removeAndAssignRoleSuccess = (data) => ({
    type: REMOVE_AND_ASSIGN_ROLE_SUCCESS,
    payload: data
});

/**
 * Redux Action To Remove And Assign Role Data Failure
 */
export const removeAndAssignRoleFailure = (error) => ({
    type: REMOVE_AND_ASSIGN_ROLE_FAILURE,
    payload: error
});

/**
 * Redux Action To List Unassign User Role Data
 */
export const listUnassignUserRole = (data) => ({
    type: LIST_UNASSIGN_USER_ROLE,
    payload: data
});

/**
 * Redux Action To List Unassign User Role Data Success
 */
export const listUnassignUserRoleSuccess = (data) => ({
    type: LIST_UNASSIGN_USER_ROLE_SUCCESS,
    payload: data
});

/**
 * Redux Action To List Unassign User Role Data Failure
 */
export const listUnassignUserRoleFailure = (error) => ({
    type: LIST_UNASSIGN_USER_ROLE_FAILURE,
    payload: error
});