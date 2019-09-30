import { LIST_UNASSIGN_USER_ROLE, LIST_UNASSIGN_USER_ROLE_SUCCESS, LIST_UNASSIGN_USER_ROLE_FAILURE, CLEAR_LIST_UNASSIGN_USER_ROLE } from "../ActionTypes";

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

/**
 * Redux Action To clear List Unassign User Role Data
 */
export const clearUnassignUserRole = () => ({
    type: CLEAR_LIST_UNASSIGN_USER_ROLE,
});