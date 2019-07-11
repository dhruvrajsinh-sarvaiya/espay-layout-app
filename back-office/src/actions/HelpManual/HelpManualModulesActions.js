/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 09-01-2019
    UpdatedDate : 09-01-2019
    Description : Function for Get Help Manual Module Action
*/
import {
    GET_HELPMANUAL_MODULES,
    GET_HELPMANUAL_MODULES_SUCCESS,
    GET_HELPMANUAL_MODULES_FAILURE,
    ADD_HELPMANUAL_MODULES,
    ADD_HELPMANUAL_MODULES_SUCCESS,
    ADD_HELPMANUAL_MODULES_FAILURE,
    UPDATE_HELPMANUAL_MODULES,
    UPDATE_HELPMANUAL_MODULES_SUCCESS,
    UPDATE_HELPMANUAL_MODULES_FAILURE,
    DELETE_HELPMANUAL_MODULES,
    DELETE_HELPMANUAL_MODULES_SUCCESS,
    DELETE_HELPMANUAL_MODULES_FAILURE,
    GET_HELPMANUAL_MODULES_BY_ID,
    GET_HELPMANUAL_MODULES_BY_ID_SUCCESS,
    GET_HELPMANUAL_MODULES_BY_ID_FAILURE,
} from 'Actions/types';

/**
 * Function for Get Help Manual Modules Data Action
 */
export const getHelpmanualmodules = () => ({
    type: GET_HELPMANUAL_MODULES,
    payload:{}
});

/* 
* Function for Get Help Manual Modules Data Success Action
*/
export const getHelpmanualmodulesSuccess = (response) => ({
    type: GET_HELPMANUAL_MODULES_SUCCESS,
    payload: response
});

/* 
*  Function for Get Help Manual Modules Data Failure Action
*/
export const getHelpmanualmodulesFailure = (error) => ({
    type: GET_HELPMANUAL_MODULES_FAILURE,
    payload: error
});


/**
 * Add Help Manual Module
 */
export const addHelpmanualmodule = (data) => ({
    type: ADD_HELPMANUAL_MODULES,
    payload: data
});

/**
 * Redux Action To Help Manual Module Success
 */
export const addHelpmanualmoduleSuccess = (response) => ({
    type: ADD_HELPMANUAL_MODULES_SUCCESS,
    payload: response
});

/**
 * Redux Action To Help Manual Module Failure
 */
export const addHelpmanualmoduleFailure = (error) => ({
    type: ADD_HELPMANUAL_MODULES_FAILURE,
    payload: error
});

/**
 * Update Help Manual Module
 */
export const updateHelpmanualmodule = (data) => ({
    type: UPDATE_HELPMANUAL_MODULES,
    payload: data
});

/**
 * Redux Action To Help Manual Module Success
 */
export const updateHelpmanualmoduleSuccess = (response) => ({
    type: UPDATE_HELPMANUAL_MODULES_SUCCESS,
    payload: response
});

/**
 * Redux Action To Help Manual Module Failure
 */
export const updateHelpmanualmoduleFailure = (error) => ({
    type: UPDATE_HELPMANUAL_MODULES_FAILURE,
    payload: error
});


/**
 * Redux Action To Help Manual Module By Id
 */
export const getHelpmanualmoduleById = (module_id) => ({
    type: GET_HELPMANUAL_MODULES_BY_ID,
    payload : module_id
});

/**
 * Redux Action To Get Help Manual Module By Id Success
 */
export const getHelpmanualmoduleByIdSuccess = (data) => ({
    type: GET_HELPMANUAL_MODULES_BY_ID_SUCCESS,
    payload: data
});

/**
 * Redux Action To Get Help Manual Module By Id Failure
 */
export const getHelpmanualmoduleByIdFailure = (error) => ({
    type: GET_HELPMANUAL_MODULES_BY_ID_FAILURE,
    payload: error
});

/**
 * Redux Action To Delete Help Manual Module
 */
export const deleteHelpmanualmodule = (module_id) => ({
    type: DELETE_HELPMANUAL_MODULES,
    payload : module_id
});

/**
 * Redux Action To Delete Help Manual Module Success
 */
export const deleteHelpmanualmoduleSuccess = (data) => ({
    type: DELETE_HELPMANUAL_MODULES_SUCCESS,
    payload: data
});

/**
 * Redux Action To Delete Help Manual Module Failure
 */
export const deleteHelpmanualmoduleFailure = (error) => ({
    type: DELETE_HELPMANUAL_MODULES_FAILURE,
    payload: error
});