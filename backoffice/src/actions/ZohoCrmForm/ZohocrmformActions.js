/* 
    Createdby : Jayesh Pathak
    Updateby : Jayesh Pathak
    CreatedDate : 27-12-2018
    UpdatedDate : 27-12-2018
    Description : Zoho CRM Form Actions
*/
import {
    ADD_NEW_CRMFORM,
    ADD_NEW_CRMFORM_SUCCESS,
    ADD_NEW_CRMFORM_FAILURE,
} from 'Actions/types';

/**
 * Add New CRM Form
 */
export const addNewCrmForm = (data) => ({
    type: ADD_NEW_CRMFORM,
    payload: data
});

/**
 * Add New CRM Form Success
 */
export const addNewCrmFormSuccess = (response) => ({
    type: ADD_NEW_CRMFORM_SUCCESS,
    payload:response
});

/**
 * Add New CRM Form Failure
 */
export const addNewCrmFormFailure = (error) => ({
    type: ADD_NEW_CRMFORM_FAILURE,
    payload: error
});
