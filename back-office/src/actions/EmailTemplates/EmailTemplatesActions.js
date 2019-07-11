/* 
    Createdby : Jayesh Pathak
    Updateby : Jayesh Pathak
    CreatedDate : 29-12-2018
    UpdatedDate : 29-12-2018
    Description : Email Templates Actions
*/
import {
    GET_EMAILTEMPLATES,
    GET_EMAILTEMPLATES_SUCCESS,
    GET_EMAILTEMPLATES_FAILURE,
    GET_LISTTEMPLATES,
    GET_LISTTEMPLATES_SUCCESS,
    GET_LISTTEMPLATES_FAILURE,
    ADD_NEW_EMAILTEMPLATE,
    ADD_NEW_EMAILTEMPLATE_SUCCESS,
    ADD_NEW_EMAILTEMPLATE_FAILURE,
    UPDATE_EMAILTEMPLATE,
    UPDATE_EMAILTEMPLATE_SUCCESS,
    UPDATE_EMAILTEMPLATE_FAILURE,
    GET_EMAILTEMPLATE_BY_ID,
    GET_EMAILTEMPLATE_BY_ID_SUCCESS,
    GET_EMAILTEMPLATE_BY_ID_FAILURE,
    UPDATE_TEMPLATE_STATUS,
    UPDATE_TEMPLATE_STATUS_SUCCESS,
    UPDATE_TEMPLATE_STATUS_FAILURE,
    GET_EMAILTEMPLATES_BY_CATEGORY,
    GET_EMAILTEMPLATES_BY_CATEGORY_SUCCESS,
    GET_EMAILTEMPLATES_BY_CATEGORY_FAILURE,
    GET_EMAILTEMPLATES_PARAMETERS,
    GET_EMAILTEMPLATES_PARAMETERS_SUCCESS,
    GET_EMAILTEMPLATES_PARAMETERS_FAILURE,
    UPDATE_EMAILTEMPLATECONFIG,
    UPDATE_EMAILTEMPLATECONFIG_SUCCESS,
    UPDATE_EMAILTEMPLATECONFIG_FAILURE,
    GET_LISTTEMPLATES_BYSERVICETYPE
} from 'Actions/types';

/**
 * Function for Get EmailTemplates Data Action
 */
export const getEmailTemplates = () => ({
    type: GET_EMAILTEMPLATES,
    payload:{}
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
 * Function for Get EmailTemplates Parameters Data Action
 */
export const getEmailTemplatesParameters = () => ({
    type: GET_EMAILTEMPLATES_PARAMETERS,
    payload:{}
});

/* 
* Function for Get EmailTemplates Parameters Data Success Action
*/
export const getEmailTemplatesParametersSuccess = (response) => ({
    type: GET_EMAILTEMPLATES_PARAMETERS_SUCCESS,
    payload: response
});

/* 
*  Function for Get EmailTemplates Parameters Data Failure Action
*/
export const getEmailTemplatesParametersFailure = (error) => ({
    type: GET_EMAILTEMPLATES_PARAMETERS_FAILURE,
    payload: error
});

/**
 * Function for Get List EmailTemplates Data Action
 */
export const getListTemplates = () => ({
    type: GET_LISTTEMPLATES,
    payload:{}
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
export const addNewEmailTemplate = (data) => ({
    type: ADD_NEW_EMAILTEMPLATE,
    payload: data
});

/**
 * Add New EmailTemplate Success
 */
export const addNewEmailTemplateSuccess = (response) => ({
    type: ADD_NEW_EMAILTEMPLATE_SUCCESS,
    payload:response
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
export const updateEmailTemplate = (data) => ({
    type: UPDATE_EMAILTEMPLATE,
    payload: data
});

/**
 * update EmailTemplate Success
 */
export const updateEmailTemplateSuccess = (response) => ({
    type: UPDATE_EMAILTEMPLATE_SUCCESS,
    payload:response
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
    payload : template_id
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
 * Redux Action To Get EmailTemplate By Category
 */
export const getEmailTemplateByCategory = (category_id) => ({
    type: GET_EMAILTEMPLATES_BY_CATEGORY,
    payload : category_id
});

/**
 * Redux Action To Get EmailTemplate By Category Success
 */
export const getEmailTemplateByCategorySuccess = (data) => ({
    type: GET_EMAILTEMPLATES_BY_CATEGORY_SUCCESS,
    payload: data
});

/**
 * Redux Action To Get EmailTemplate By Category Failure
 */
export const getEmailTemplateByCategoryFailure = (error) => ({
    type: GET_EMAILTEMPLATES_BY_CATEGORY_FAILURE,
    payload: error
});

// Added by dharaben
export const updateTemplateStatus = (data) => ({
    type: UPDATE_TEMPLATE_STATUS,
    payload: data
});

export const updateTemplateStatusSuccess = (data) => ({
    type: UPDATE_TEMPLATE_STATUS_SUCCESS,
    payload: data
});

export const updateTemplateStatusFailure = (error) => ({
    type: UPDATE_TEMPLATE_STATUS_FAILURE,
    payload: error
});

export const updateTemplateConfiguration = (data) => ({
    type: UPDATE_EMAILTEMPLATECONFIG,
    payload: data
});

export const updateTemplateConfigurationSuccess = (response) => ({
    type: UPDATE_EMAILTEMPLATECONFIG_SUCCESS,
    payload: response
});

export const updateTemplateConfigurationFailure = (error) => ({
    type: UPDATE_EMAILTEMPLATECONFIG_FAILURE,
    payload: error
});

// Filter SrviceTypWise Templates
export const getListTemplatesbyServiceType = (servicetype) => ({
    type: GET_LISTTEMPLATES_BYSERVICETYPE,
    payload: servicetype
});
