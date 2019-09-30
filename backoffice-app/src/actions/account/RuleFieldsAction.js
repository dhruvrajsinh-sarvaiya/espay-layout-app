//Import action types 
import {
    //Add Rule Field
    ADD_RULE_FIELD,
    ADD_RULE_FIELD_SUCCESS,
    ADD_RULE_FIELD_FAILURE,

    //Edit Rule Field
    EDIT_RULE_FIELD,
    EDIT_RULE_FIELD_SUCCESS,
    EDIT_RULE_FIELD_FAILURE,

    //List Rule Field
    LIST_RULE_FIELD,
    LIST_RULE_FIELD_SUCCESS,
    LIST_RULE_FIELD_FAILURE,

    //clear data
    CLEAR_RULE_FIELD_DATA,

} from '../ActionTypes';

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

//for  Reducer Data Clear
export const clearRuleFieldData = () => ({
    type: CLEAR_RULE_FIELD_DATA,
});
