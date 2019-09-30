import { USERS_ROLE_ASSIGN_HISTORY, USERS_ROLE_ASSIGN_HISTORY_SUCCESS, USERS_ROLE_ASSIGN_HISTORY_FAILURE, CLEAR_USERS_ROLE_ASSIGN_HISTORY } from "../ActionTypes";

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

export const clearRoleAssignHistory = () => ({
    type: CLEAR_USERS_ROLE_ASSIGN_HISTORY,
});


