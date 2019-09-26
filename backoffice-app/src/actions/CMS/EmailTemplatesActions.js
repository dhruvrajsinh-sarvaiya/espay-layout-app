/* 
   Email Templates Actions
*/
import {
    //get email templates 
    GET_EMAILTEMPLATES,
    GET_EMAILTEMPLATES_SUCCESS,
    GET_EMAILTEMPLATES_FAILURE,

    //get templates list
    GET_LISTTEMPLATES,
    GET_LISTTEMPLATES_SUCCESS,
    GET_LISTTEMPLATES_FAILURE,

    //add email template
    ADD_NEW_EMAILTEMPLATE,
    ADD_NEW_EMAILTEMPLATE_SUCCESS,
    ADD_NEW_EMAILTEMPLATE_FAILURE,

    //update email template
    UPDATE_EMAILTEMPLATE,
    UPDATE_EMAILTEMPLATE_SUCCESS,
    UPDATE_EMAILTEMPLATE_FAILURE,

    //get email template by id
    GET_EMAILTEMPLATE_BY_ID,
    GET_EMAILTEMPLATE_BY_ID_SUCCESS,
    GET_EMAILTEMPLATE_BY_ID_FAILURE,

    //update template status
    UPDATE_TEMPLATE_STATUS,
    UPDATE_TEMPLATE_STATUS_SUCCESS,
    UPDATE_TEMPLATE_STATUS_FAILURE,

    //clear data
    CLEAR_TEMPLATE_STATUS,
    CLEAR_TEMPLATE_ADD_UPDATE,
    CLEAR_TEMPLATE,
} from '../ActionTypes';

/**
 * Function for Get EmailTemplates Data Action
 */
export const getEmailTemplates = () => ({
    type: GET_EMAILTEMPLATES,
    payload: {}
});

/* 
* Function for Get EmailTemplates Data Success Action
*/
export const getEmailTemplatesSuccess = (response) => ({
    type: GET_EMAILTEMPLATES_SUCCESS,
    payload: response
});

/* 
*  Function for Get EmailTemplates Data Failure Action
*/
export const getEmailTemplatesFailure = (error) => ({
    type: GET_EMAILTEMPLATES_FAILURE,
    payload: error
});


/**
 * Function for Get List EmailTemplates Data Action
 */
export const getListTemplates = () => ({
    type: GET_LISTTEMPLATES,
    payload: {}
});

/* 
* Function for Get List EmailTemplates Data Success Action
*/
export const getListTemplatesSuccess = (response) => ({
    type: GET_LISTTEMPLATES_SUCCESS,
    payload: response
});

/* 
*  Function for Get List EmailTemplates Data Failure Action
*/
export const getListTemplatesFailure = (error) => ({
    type: GET_LISTTEMPLATES_FAILURE,
    payload: error
});


/**
 * Add New EmailTemplate
 */
export const addNewEmailTemplate = (request) => ({
    type: ADD_NEW_EMAILTEMPLATE,
    payload: { request }
});

/**
 * Add New EmailTemplate Success
 */
export const addNewEmailTemplateSuccess = (response) => ({
    type: ADD_NEW_EMAILTEMPLATE_SUCCESS,
    payload: response
});

/**
 * Add New EmailTemplate Failure
 */
export const addNewEmailTemplateFailure = (error) => ({
    type: ADD_NEW_EMAILTEMPLATE_FAILURE,
    payload: error
});

/**
 * Update EmailTemplate
 */
export const updateEmailTemplate = (request) => ({
    type: UPDATE_EMAILTEMPLATE,
    payload: { request }
});

/**
 * update EmailTemplate Success
 */
export const updateEmailTemplateSuccess = (response) => ({
    type: UPDATE_EMAILTEMPLATE_SUCCESS,
    payload: response
});

/**
 * Update EmailTemplate Failure
 */
export const updateEmailTemplateFailure = (error) => ({
    type: UPDATE_EMAILTEMPLATE_FAILURE,
    payload: error
});


/**
 * Redux Action To Get EmailTemplate By Id
 */
export const getEmailTemplateById = (template_id) => ({
    type: GET_EMAILTEMPLATE_BY_ID,
    payload: template_id
});

/**
 * Redux Action To Get EmailTemplate By Id Success
 */
export const getEmailTemplateByIdSuccess = (data) => ({
    type: GET_EMAILTEMPLATE_BY_ID_SUCCESS,
    payload: data
});

/**
 * Redux Action To Get EmailTemplate By Id Failure
 */
export const getEmailTemplateByIdFailure = (error) => ({
    type: GET_EMAILTEMPLATE_BY_ID_FAILURE,
    payload: error
});

/**
 * Redux Action To updateTemplateStatus 
 */
export const updateTemplateStatus = (data) => ({
    type: UPDATE_TEMPLATE_STATUS,
    payload: data
});
/**
 * Redux Action To updateTemplateStatus success
 */
export const updateTemplateStatusSuccess = (data) => ({
    type: UPDATE_TEMPLATE_STATUS_SUCCESS,
    payload: data
});
/**
 * Redux Action To updateTemplateStatus failure
 */
export const updateTemplateStatusFailure = (error) => ({
    type: UPDATE_TEMPLATE_STATUS_FAILURE,
    payload: error
});

// clear record 
export const clearTemplateStatusChange = () => ({
    type: CLEAR_TEMPLATE_STATUS,
});

// clear all template
export const clearTemplate = () => ({
    type: CLEAR_TEMPLATE,
});

// clear Add Update data
export const clearAddUpdate = () => ({
    type: CLEAR_TEMPLATE_ADD_UPDATE,
});