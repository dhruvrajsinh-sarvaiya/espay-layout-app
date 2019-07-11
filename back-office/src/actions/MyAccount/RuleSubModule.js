/**
 * Auther : Salim Deraiya
 * Created : 20/02/2019
 * Updated by : Saloni Rathod(13/03/2019)
 * Rule Sub Module Actions
 */

//Import action types form type.js
import {
    //Add Sub Module
    ADD_RULE_SUB_MODULE,
    ADD_RULE_SUB_MODULE_SUCCESS,
    ADD_RULE_SUB_MODULE_FAILURE,

    //Edit Sub Module
    EDIT_RULE_SUB_MODULE,
    EDIT_RULE_SUB_MODULE_SUCCESS,
    EDIT_RULE_SUB_MODULE_FAILURE,

    //Change Sub Module Status
    CHANGE_RULE_SUB_MODULE_STATUS,
    CHANGE_RULE_SUB_MODULE_STATUS_SUCCESS,
    CHANGE_RULE_SUB_MODULE_STATUS_FAILURE,

    //List Sub Module
    LIST_RULE_SUB_MODULE,
    LIST_RULE_SUB_MODULE_SUCCESS,
    LIST_RULE_SUB_MODULE_FAILURE,

    //Get By Id Sub Module    
    GET_BY_ID_RULE_SUB_MODULE,
    GET_BY_ID_RULE_SUB_MODULE_SUCCESS,
    GET_BY_ID_RULE_SUB_MODULE_FAILURE,

    //List Parent Sub Module
    LIST_RULE_SUB_MODULE_FOR_PARENTID,
    LIST_RULE_SUB_MODULE_FOR_PARENTID_SUCCESS,
    LIST_RULE_SUB_MODULE_FOR_PARENTID_FAILURE,

} from '../types';

// Redux Action To Add Rule Sub Module
export const addRuleSubModule = (data) => ({
    type: ADD_RULE_SUB_MODULE,
    payload: data
})

// Redux Action Add Rule Sub Module Success
export const addRuleSubModuleSuccess = (data) => ({
    type: ADD_RULE_SUB_MODULE_SUCCESS,
    payload: data
});

// Redux Action Add Rule Sub Module Failure
export const addRuleSubModuleFailure = (error) => ({
    type: ADD_RULE_SUB_MODULE_FAILURE,
    payload: error
});

// Redux Action To Edit Rule Sub Module
export const editRuleSubModule = (data) => ({
    type: EDIT_RULE_SUB_MODULE,
    payload: data
})

// Redux Action Edit Rule Sub Module Success
export const editRuleSubModuleSuccess = (data) => ({
    type: EDIT_RULE_SUB_MODULE_SUCCESS,
    payload: data
});

// Redux Action Edit Rule Sub Module Failure
export const editRuleSubModuleFailure = (error) => ({
    type: EDIT_RULE_SUB_MODULE_FAILURE,
    payload: error
});

// Redux Action To Change Status Rule Sub Module
export const changeStatusRuleSubModule = (data) => ({
    type: CHANGE_RULE_SUB_MODULE_STATUS,
    payload: data
})

// Redux Action Change Status Rule Sub Module Success
export const changeStatusRuleSubModuleSuccess = (data) => ({
    type: CHANGE_RULE_SUB_MODULE_STATUS_SUCCESS,
    payload: data
});

// Redux Action Change Status Rule Sub Module Failure
export const changeStatusRuleSubModuleFailure = (error) => ({
    type: CHANGE_RULE_SUB_MODULE_STATUS_FAILURE,
    payload: error
});

// Redux Action To List Rule Sub Module
export const getRuleSubModuleList = (data) => ({
    type: LIST_RULE_SUB_MODULE,
    payload: data
})

// Redux Action List Rule Sub Module Success
export const getRuleSubModuleListSuccess = (data) => ({
    type: LIST_RULE_SUB_MODULE_SUCCESS,
    payload: data
});

// Redux Action List Rule Sub Module Failure
export const getRuleSubModuleListFailure = (error) => ({
    type: LIST_RULE_SUB_MODULE_FAILURE,
    payload: error
});

// Redux Action To Get By ID Rule Sub Module
export const getRuleSubModuleById = (data) => ({
    type: GET_BY_ID_RULE_SUB_MODULE,
    payload: data
})

// Redux Action Get By ID Rule Sub Module Success
export const getRuleSubModuleByIdSuccess = (data) => ({
    type: GET_BY_ID_RULE_SUB_MODULE_SUCCESS,
    payload: data
});

// Redux Action Get By ID Rule Sub Module Failure
export const getRuleSubModuleByIdFailure = (error) => ({
    type: GET_BY_ID_RULE_SUB_MODULE_FAILURE,
    payload: error
});

//Added by Saloni Rathod Dt: 11/03/2019
// Redux Action To List Rule Module For ParentId
export const getRuleSubModuleListForParentId = (data) => ({
    type: LIST_RULE_SUB_MODULE_FOR_PARENTID,
    payload: data
})

// Redux Action List Rule Module Success For ParentId
export const getRuleSubModuleListForParentIdSuccess = (data) => ({
    type: LIST_RULE_SUB_MODULE_FOR_PARENTID_SUCCESS,
    payload: data
});

// Redux Action List Rule Module Failure For ParentId
export const getRuleSubModuleListForParentIdFailure = (error) => ({
    type: LIST_RULE_SUB_MODULE_FOR_PARENTID_FAILURE,
    payload: error
});