/**
 * Auther : Salim Deraiya
 * Created : 20/02/2019
 * Rule Tool Actions
 */

//Import action types form type.js
import {
    //Add Rule Tool
    ADD_RULE_TOOL,
    ADD_RULE_TOOL_SUCCESS,
    ADD_RULE_TOOL_FAILURE,

    //Edit Rule Tool
    EDIT_RULE_TOOL,
    EDIT_RULE_TOOL_SUCCESS,
    EDIT_RULE_TOOL_FAILURE,

    //Change Rule Tool Status
    CHANGE_RULE_TOOL_STATUS,
    CHANGE_RULE_TOOL_STATUS_SUCCESS,
    CHANGE_RULE_TOOL_STATUS_FAILURE,

    //List Rule Tool
    LIST_RULE_TOOL,
    LIST_RULE_TOOL_SUCCESS,
    LIST_RULE_TOOL_FAILURE,

    //Get By Id Rule Tool    
    GET_BY_ID_RULE_TOOL,
    GET_BY_ID_RULE_TOOL_SUCCESS,
    GET_BY_ID_RULE_TOOL_FAILURE,

} from '../types';

// Redux Action To Add Rule Tool
export const addRuleTool = (data) => ({
    type: ADD_RULE_TOOL,
    payload: data
})

// Redux Action Add Rule Tool Success
export const addRuleToolSuccess = (data) => ({
    type: ADD_RULE_TOOL_SUCCESS,
    payload: data
});

// Redux Action Add Rule Tool Failure
export const addRuleToolFailure = (error) => ({
    type: ADD_RULE_TOOL_FAILURE,
    payload: error
});

// Redux Action To Edit Rule Tool
export const editRuleTool = (data) => ({
    type: EDIT_RULE_TOOL,
    payload: data
})

// Redux Action Edit Rule Tool Success
export const editRuleToolSuccess = (data) => ({
    type: EDIT_RULE_TOOL_SUCCESS,
    payload: data
});

// Redux Action Edit Rule Tool Failure
export const editRuleToolFailure = (error) => ({
    type: EDIT_RULE_TOOL_FAILURE,
    payload: error
});

// Redux Action To Change Status Rule Tool
export const changeStatusRuleTool = (data) => ({
    type: CHANGE_RULE_TOOL_STATUS,
    payload: data
})

// Redux Action Change Status Rule Tool Success
export const changeStatusRuleToolSuccess = (data) => ({
    type: CHANGE_RULE_TOOL_STATUS_SUCCESS,
    payload: data
});

// Redux Action Change Status Rule Tool Failure
export const changeStatusRuleToolFailure = (error) => ({
    type: CHANGE_RULE_TOOL_STATUS_FAILURE,
    payload: error
});

// Redux Action To List Rule Tool
export const getRuleToolList = (data) => ({
    type: LIST_RULE_TOOL,
    payload: data
})

// Redux Action List Rule Tool Success
export const getRuleToolListSuccess = (data) => ({
    type: LIST_RULE_TOOL_SUCCESS,
    payload: data
});

// Redux Action List Rule Tool Failure
export const getRuleToolListFailure = (error) => ({
    type: LIST_RULE_TOOL_FAILURE,
    payload: error
});

// Redux Action To Get By ID Rule Tool
export const getRuleToolById = (data) => ({
    type: GET_BY_ID_RULE_TOOL,
    payload: data
})

// Redux Action Get By ID Rule Tool Success
export const getRuleToolByIdSuccess = (data) => ({
    type: GET_BY_ID_RULE_TOOL_SUCCESS,
    payload: data
});

// Redux Action Get By ID Rule Tool Failure
export const getRuleToolByIdFailure = (error) => ({
    type: GET_BY_ID_RULE_TOOL_FAILURE,
    payload: error
});