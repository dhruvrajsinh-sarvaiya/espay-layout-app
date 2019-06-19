/**
 * Auther : Salim Deraiya
 * Created : 20/02/2019
 * Updated by:Saloni Rathod(API Integration)(11/03/2019)
 * Rule Module Actions
 */

//Import action types form type.js
import {
    //Add Module
    ADD_RULE_MODULE,
    ADD_RULE_MODULE_SUCCESS,
    ADD_RULE_MODULE_FAILURE,

    //Edit Module
    EDIT_RULE_MODULE,
    EDIT_RULE_MODULE_SUCCESS,
    EDIT_RULE_MODULE_FAILURE,

    //Change Module Status
    CHANGE_RULE_MODULE_STATUS,
    CHANGE_RULE_MODULE_STATUS_SUCCESS,
    CHANGE_RULE_MODULE_STATUS_FAILURE,

    //List Module
    LIST_RULE_MODULE,
    LIST_RULE_MODULE_SUCCESS,
    LIST_RULE_MODULE_FAILURE,

    //Get By Id Module    
    GET_BY_ID_RULE_MODULE,
    GET_BY_ID_RULE_MODULE_SUCCESS,
    GET_BY_ID_RULE_MODULE_FAILURE,

    //List Parent Module added by Saloni Rathod
    LIST_RULE_MODULE_FOR_PARENTID,
    LIST_RULE_MODULE_FOR_PARENTID_SUCCESS,
    LIST_RULE_MODULE_FOR_PARENTID_FAILURE,

} from '../types';

// Redux Action To Add Rule Module
export const addRuleModule = (data) => ({
    type: ADD_RULE_MODULE,
    payload: data
})

// Redux Action Add Rule Module Success
export const addRuleModuleSuccess = (data) => ({
    type: ADD_RULE_MODULE_SUCCESS,
    payload: data
});

// Redux Action Add Rule Module Failure
export const addRuleModuleFailure = (error) => ({
    type: ADD_RULE_MODULE_FAILURE,
    payload: error
});

// Redux Action To Edit Rule Module
export const editRuleModule = (data) => ({
    type: EDIT_RULE_MODULE,
    payload: data
})

// Redux Action Edit Rule Module Success
export const editRuleModuleSuccess = (data) => ({
    type: EDIT_RULE_MODULE_SUCCESS,
    payload: data
});

// Redux Action Edit Rule Module Failure
export const editRuleModuleFailure = (error) => ({
    type: EDIT_RULE_MODULE_FAILURE,
    payload: error
});

// Redux Action To Change Status Rule Module
export const changeStatusRuleModule = (data) => ({
    type: CHANGE_RULE_MODULE_STATUS,
    payload: data
})

// Redux Action Change Status Rule Module Success
export const changeStatusRuleModuleSuccess = (data) => ({
    type: CHANGE_RULE_MODULE_STATUS_SUCCESS,
    payload: data
});

// Redux Action Change Status Rule Module Failure
export const changeStatusRuleModuleFailure = (error) => ({
    type: CHANGE_RULE_MODULE_STATUS_FAILURE,
    payload: error
});

// Redux Action To List Rule Module
export const getRuleModuleList = (data) => ({
    type: LIST_RULE_MODULE,
    payload: data
})

// Redux Action List Rule Module Success
export const getRuleModuleListSuccess = (data) => ({
    type: LIST_RULE_MODULE_SUCCESS,
    payload: data
});

// Redux Action List Rule Module Failure
export const getRuleModuleListFailure = (error) => ({
    type: LIST_RULE_MODULE_FAILURE,
    payload: error
});

// Redux Action To Get By ID Rule Module
export const getRuleModuleById = (data) => ({
    type: GET_BY_ID_RULE_MODULE,
    payload: data
})

// Redux Action Get By ID Rule Module Success
export const getRuleModuleByIdSuccess = (data) => ({
    type: GET_BY_ID_RULE_MODULE_SUCCESS,
    payload: data
});

// Redux Action Get By ID Rule Module Failure
export const getRuleModuleByIdFailure = (error) => ({
    type: GET_BY_ID_RULE_MODULE_FAILURE,
    payload: error
});

//Added by Saloni dt:11/03/2019
// Redux Action To List Rule Module for ParentID
export const getRuleModuleListForParentId = (data) => ({
    type: LIST_RULE_MODULE_FOR_PARENTID,
    payload: data
})

// Redux Action List Rule Module Success for ParentID
export const getRuleModuleListForParentIdSuccess = (data) => ({
    type: LIST_RULE_MODULE_FOR_PARENTID_SUCCESS,
    payload: data
});

// Redux Action List Rule Module Failure for ParentID
export const getRuleModuleListForParentIdFailure = (error) => ({
    type: LIST_RULE_MODULE_FOR_PARENTID_FAILURE,
    payload: error
});