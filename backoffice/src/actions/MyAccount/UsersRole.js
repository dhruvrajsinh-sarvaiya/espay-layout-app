/**
 * Users Role Actions
 */
import {
  LIST_USER_ROLES,
  LIST_USER_ROLES_SUCCESS,
  LIST_USER_ROLES_FAILURE
} from "../types";

/**
 * Redux Action To Get User Roles
 */
export const userRoles = role_id => ({
  type: LIST_USER_ROLES,
  payload: role_id
});

/**
 * Redux Action To Get User Roles Success
 */
export const userRolesSuccess = list => ({
  type: LIST_USER_ROLES_SUCCESS,
  payload: list
});

/**
 * Redux Action To Get User Roles Failure
 */
export const userRolesFailure = error => ({
  type: LIST_USER_ROLES_FAILURE,
  payload: error
});
