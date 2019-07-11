/* 
    Developer : Kevin Ladani
    Date : 17-01-2019
    File Comment : MyAccount Password Policy Dashboard Actions
*/
import {
    LIST_PASSWORD_POLICY_DASHBOARD,
    LIST_PASSWORD_POLICY_DASHBOARD_SUCCESS,
    LIST_PASSWORD_POLICY_DASHBOARD_FAILURE,

    ADD_PASSWORD_POLICY_DASHBOARD,
    ADD_PASSWORD_POLICY_DASHBOARD_SUCCESS,
    ADD_PASSWORD_POLICY_DASHBOARD_FAILURE,

    DELETE_PASSWORD_POLICY_DASHBOARD,
    DELETE_PASSWORD_POLICY_DASHBOARD_SUCCESS,
    DELETE_PASSWORD_POLICY_DASHBOARD_FAILURE,

    UPDATE_PASSWORD_POLICY_DASHBOARD,
    UPDATE_PASSWORD_POLICY_DASHBOARD_SUCCESS,
    UPDATE_PASSWORD_POLICY_DASHBOARD_FAILURE,

} from "../types";

//For Display List Password Policy Data

//Redux Action To Display Password Policy Data
export const getPasswordPolicyData = data => ({
    type: LIST_PASSWORD_POLICY_DASHBOARD,
    payload: data
});

//Redux Action To Display Password Policy Data Success
export const getPasswordPolicyDataSuccess = response => ({
    type: LIST_PASSWORD_POLICY_DASHBOARD_SUCCESS,
    payload: response
});

//Redux Action To Display Password Policy Data Failure
export const getPasswordPolicyDataFailure = error => ({
    type: LIST_PASSWORD_POLICY_DASHBOARD_FAILURE,
    payload: error
});


//For Add Password Policy Data

//Redux Action To Add Password Policy Data
export const addPasswordPolicyData = data => ({
    type: ADD_PASSWORD_POLICY_DASHBOARD,
    payload: data
});

//Redux Action To Add Password Policy Data Success
export const addPasswordPolicyDataSuccess = data => ({
    type: ADD_PASSWORD_POLICY_DASHBOARD_SUCCESS,
    payload: data
});

//Redux Action To Add Password Policy Data Failure
export const addPasswordPolicyDataFailure = data => ({
    type: ADD_PASSWORD_POLICY_DASHBOARD_FAILURE,
    payload: data
});

//For Delete Password Policy Data

//Redux Action To Delete Password Policy Data
export const deletePasswordPolicyData = data => ({
    type: DELETE_PASSWORD_POLICY_DASHBOARD,
    payload: data
});

//Redux Action To Delete Password Policy Data Success
export const deletePasswordPolicyDataSuccess = data => ({
    type: DELETE_PASSWORD_POLICY_DASHBOARD_SUCCESS,
    payload: data
});

//Redux Action To Delete Password Policy Data Failure
export const deletePasswordPolicyDataFailure = error => ({
    type: DELETE_PASSWORD_POLICY_DASHBOARD_FAILURE,
    payload: error
});

//For Edit Password Policy Data

//Redux Action To Edit Password Policy Data
export const updatePasswordPolicyData = data => ({
    type: UPDATE_PASSWORD_POLICY_DASHBOARD,
    payload: data
});

//Redux Action To Edit Password Policy Data Success
export const updatePasswordPolicyDataSuccess = data => ({
    type: UPDATE_PASSWORD_POLICY_DASHBOARD_SUCCESS,
    payload: data
});

//Redux Action To Edit Password Policy Data Failure
export const updatePasswordPolicyDataFailure = error => ({
    type: UPDATE_PASSWORD_POLICY_DASHBOARD_FAILURE,
    payload: error
});
