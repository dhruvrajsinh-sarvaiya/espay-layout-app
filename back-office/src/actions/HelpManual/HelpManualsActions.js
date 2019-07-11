/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 09-01-2019
    UpdatedDate : 09-01-2019
    Description : Function for Get HelpManual Data Action
*/
import {
    GET_HELPMANUALS,
    GET_HELPMANUALS_SUCCESS,
    GET_HELPMANUALS_FAILURE,
    ADD_HELPMANUAL,
    ADD_HELPMANUAL_SUCCESS,
    ADD_HELPMANUAL_FAILURE,
    UPDATE_HELPMANUAL,
    UPDATE_HELPMANUAL_SUCCESS,
    UPDATE_HELPMANUAL_FAILURE,
    DELETE_HELPMANUAL,
    DELETE_HELPMANUAL_SUCCESS,
    DELETE_HELPMANUAL_FAILURE,
    GET_HELPMANUAL_BY_ID,
    GET_HELPMANUAL_BY_ID_SUCCESS,
    GET_HELPMANUAL_BY_ID_FAILURE,
} from 'Actions/types';

/**
 * Function for Get Help Manuals Data Action
 */
export const getHelpmanuals = () => ({
    type: GET_HELPMANUALS,
    payload:{}
});

/* 
* Function for Get Help Manuals Data Success Action
*/
export const getHelpmanualsSuccess = (response) => ({
    type: GET_HELPMANUALS_SUCCESS,
    payload: response
});

/* 
*  Function for Get Help Manuals Data Failure Action
*/
export const getHelpmanualsFailure = (error) => ({
    type: GET_HELPMANUALS_FAILURE,
    payload: error
});


/**
 * Add Help Manual
 */
export const addHelpmanual = (data) => ({
    type: ADD_HELPMANUAL,
    payload: data
});

/**
 * Redux Action To Help Manual Success
 */
export const addHelpmanualSuccess = (response) => ({
    type: ADD_HELPMANUAL_SUCCESS,
    payload: response
});

/**
 * Redux Action To Help Manual Failure
 */
export const addHelpmanualFailure = (error) => ({
    type: ADD_HELPMANUAL_FAILURE,
    payload: error
});

/**
 * Add Help Manual
 */
export const updateHelpmanual = (data) => ({
    type: UPDATE_HELPMANUAL,
    payload: data
});

/**
 * Redux Action To Help Manual Success
 */
export const updateHelpmanualSuccess = (response) => ({
    type: UPDATE_HELPMANUAL_SUCCESS,
    payload: response
});

/**
 * Redux Action To Help Manual Failure
 */
export const updateHelpmanualFailure = (error) => ({
    type: UPDATE_HELPMANUAL_FAILURE,
    payload: error
});


/**
 * Redux Action To Help Manual By Id
 */
export const getHelpmanualById = (helpmanual_id) => ({
    type: GET_HELPMANUAL_BY_ID,
    payload : helpmanual_id
});

/**
 * Redux Action To Get Help Manual By Id Success
 */
export const getHelpmanualByIdSuccess = (data) => ({
    type: GET_HELPMANUAL_BY_ID_SUCCESS,
    payload: data
});

/**
 * Redux Action To Get Help Manual By Id Failure
 */
export const getHelpmanualByIdFailure = (error) => ({
    type: GET_HELPMANUAL_BY_ID_FAILURE,
    payload: error
});

/**
 * Redux Action To Delete Help Manual
 */
export const deleteHelpmanual = (helpmanual_id) => ({
    type: DELETE_HELPMANUAL,
    payload : helpmanual_id
});

/**
 * Redux Action To Delete Help Manual Success
 */
export const deleteHelpmanualSuccess = (data) => ({
    type: DELETE_HELPMANUAL_SUCCESS,
    payload: data
});

/**
 * Redux Action To Delete Help Manual Failure
 */
export const deleteHelpmanualFailure = (error) => ({
    type: DELETE_HELPMANUAL_FAILURE,
    payload: error
});