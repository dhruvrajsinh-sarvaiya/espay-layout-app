import {
  //list password policy 
  PASSWORD_POLICY_LIST,
  PASSWORD_POLICY_LIST_SUCCESS,
  PASSWORD_POLICY_LIST_FAILURE,

  //Edit password policy
  PASSWORD_POLICY_UPDATE,
  PASSWORD_POLICY_UPDATE_SUCCESS,
  PASSWORD_POLICY_UPDATE_FAILURE,

  //Add password policy
  PASSWORD_POLICY_ADD,
  PASSWORD_POLICY_ADD_SUCCESS,
  PASSWORD_POLICY_ADD_FAILURE,

  //Delete password policy
  PASSWORD_POLICY_DELETE,
  PASSWORD_POLICY_DELETE_SUCCESS,
  PASSWORD_POLICY_DELETE_FAILURE,

  //clear data
  PASSWORD_POLICY_CLEAR,
} from '../ActionTypes';

/**
 * Redux Action To List password policy
 */
export const passwordPolicyList = (data) => ({
  type: PASSWORD_POLICY_LIST,
  payload: data
});
/**
 * Redux Action List password policy Success
 */
export const passwordPolicyListSuccess = list => ({
  type: PASSWORD_POLICY_LIST_SUCCESS,
  payload: list
});
/**
 * Redux Action List password policy Failure
 */
export const passwordPolicyListFailure = error => ({
  type: PASSWORD_POLICY_LIST_FAILURE,
  payload: error
});
/**
 * Redux Action To edit password policy
 */
export const updatePasswordPolicy = data => ({
  type: PASSWORD_POLICY_UPDATE,
  payload: data
});
/**
 * Redux Action Edit password policy Success
 */
export const updatePasswordPolicySuccess = data => ({
  type: PASSWORD_POLICY_UPDATE_SUCCESS,
  payload: data
});
/**
 * Redux Action Edit password policy Failure
 */
export const updatePasswordPolicyFailure = error => ({
  type: PASSWORD_POLICY_UPDATE_FAILURE,
  payload: error
});
/**
 * Redux Action To Add password policy
 */
export const addPasswordPolicy = data => ({
  type: PASSWORD_POLICY_ADD,
  payload: data
});
/**
 * Redux Action Add password policy Success
 */
export const addPasswordPolicySuccess = data => ({
  type: PASSWORD_POLICY_ADD_SUCCESS,
  payload: data
});
/**
 * Redux Action Add password policy Failure
 */
export const addPasswordPolicyFailure = error => ({
  type: PASSWORD_POLICY_ADD_FAILURE,
  payload: error
});
/**
 * Redux Action To Delete password policy
 */
export const deletePasswordPolicy = (data) => ({
  type: PASSWORD_POLICY_DELETE,
  payload: data
});
/**
 * Redux Action Delete password policy Success
 */
export const deletePasswordPolicySuccess = data => ({
  type: PASSWORD_POLICY_DELETE_SUCCESS,
  payload: data
});
/**
 * Redux Action Delete password policy Failure
 */
export const deletePasswordPolicyFailure = error => ({
  type: PASSWORD_POLICY_DELETE_FAILURE,
  payload: error
});
//for clear data
export const clearPasswordPolicy = () => ({
  type: PASSWORD_POLICY_CLEAR,
});

