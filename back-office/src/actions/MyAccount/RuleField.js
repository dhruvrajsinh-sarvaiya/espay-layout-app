/**
 * Auther : Saloni Rathod
 * Created : 25/02/2019
 * Rule Field Actions
 */

//Import action types form type.js
import {
    //Add Rule Field
    ADD_RULE_FIELD,
    ADD_RULE_FIELD_SUCCESS,
    ADD_RULE_FIELD_FAILURE,

    //Edit Rule Field
    EDIT_RULE_FIELD,
    EDIT_RULE_FIELD_SUCCESS,
    EDIT_RULE_FIELD_FAILURE,

    //Change Rule Field Status
    CHANGE_RULE_FIELD_STATUS,
    CHANGE_RULE_FIELD_STATUS_SUCCESS,
    CHANGE_RULE_FIELD_STATUS_FAILURE,

    //List Rule Field
    LIST_RULE_FIELD,
    LIST_RULE_FIELD_SUCCESS,
    LIST_RULE_FIELD_FAILURE,

    //Get By Id Rule Field    
    GET_BY_ID_RULE_FIELD,
    GET_BY_ID_RULE_FIELD_SUCCESS,
    GET_BY_ID_RULE_FIELD_FAILURE,

} from '../types';

// Redux Action To Add Rule Field
export const addRuleField = (data) => ({
    type: ADD_RULE_FIELD,
    payload: data
})

// Redux Action Add Rule Field Success
export const addRuleFieldSuccess = (data) => ({
    type: ADD_RULE_FIELD_SUCCESS,
    payload: data
});

// Redux Action Add Rule Field Failure
export const addRuleFieldFailure = (error) => ({
    type: ADD_RULE_FIELD_FAILURE,
    payload: error
});

// Redux Action To Edit Rule Field
export const editRuleField = (data) => ({
    type: EDIT_RULE_FIELD,
    payload: data
})

// Redux Action Edit Rule Field Success
export const editRuleFieldSuccess = (data) => ({
    type: EDIT_RULE_FIELD_SUCCESS,
    payload: data
});

// Redux Action Edit Rule Field Failure
export const editRuleFieldFailure = (error) => ({
    type: EDIT_RULE_FIELD_FAILURE,
    payload: error
});

// Redux Action To Change Status Rule Field
export const changeStatusRuleField = (data) => ({
    type: CHANGE_RULE_FIELD_STATUS,
    payload: data
})

// Redux Action Change Status Rule Field Success
export const changeStatusRuleFieldSuccess = (data) => ({
    type: CHANGE_RULE_FIELD_STATUS_SUCCESS,
    payload: data
});

// Redux Action Change Status Rule Field Failure
export const changeStatusRuleFieldFailure = (error) => ({
    type: CHANGE_RULE_FIELD_STATUS_FAILURE,
    payload: error
});

// Redux Action To List Rule Field
export const getRuleFieldList = (data) => ({
    type: LIST_RULE_FIELD,
    payload: data
})

// Redux Action List Rule Field Success
export const getRuleFieldListSuccess = (data) => ({
    type: LIST_RULE_FIELD_SUCCESS,
    payload: data
});

// Redux Action List Rule Field Failure
export const getRuleFieldListFailure = (error) => ({
    type: LIST_RULE_FIELD_FAILURE,
    payload: error
});

// Redux Action To Get By ID Rule Field
export const getRuleFieldById = (data) => ({
    type: GET_BY_ID_RULE_FIELD,
    payload: data
})

// Redux Action Get By ID Rule Field Success
export const getRuleFieldByIdSuccess = (data) => ({
    type: GET_BY_ID_RULE_FIELD_SUCCESS,
    payload: data
});

// Redux Action Get By ID Rule Field Failure
export const getRuleFieldByIdFailure = (error) => ({
    type: GET_BY_ID_RULE_FIELD_FAILURE,
    payload: error
});