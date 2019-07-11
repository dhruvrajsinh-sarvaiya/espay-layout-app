/* 
    Createdby : Jayesh Pathak
    Updateby : Jayesh Pathak
    CreatedDate : 29-10-2018
    UpdatedDate : 29-10-2018
    Description : Function for Get Contacts Data Action
*/
import {
	GET_CONTACTUS,
    GET_CONTACTUS_SUCCESS,
    GET_CONTACTUS_FAILURE
} from 'Actions/types';

/**
 * Function for Get Contact List Data Action  Added by Jayesh 29-10-2018
 */
export const getContactUs = (data) => ({
    type: GET_CONTACTUS,
    payload:data
});

/* 
* Function for Get Contacts Data Success Action
*/
export const getContactUsSuccess = (response) => ({
    type: GET_CONTACTUS_SUCCESS,
    payload: response
});

/* 
*  Function for Get Contacts Data Failure Action
*/
export const getContactUsFailure = (error) => ({
    type: GET_CONTACTUS_FAILURE,
    payload: error
});