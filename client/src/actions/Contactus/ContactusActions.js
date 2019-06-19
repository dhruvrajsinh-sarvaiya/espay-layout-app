/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 29-09-2018
    UpdatedDate : 29-09-2018
    Description : ContactUs Dispach Action
  	Changed by Jayesh on 29-10-2018 Complete Contact Module
*/
import {
  ADD_NEW_CONTACTUS,
  ADD_CONTACTUS_SUCCESS,
  ADD_CONTACTUS_FAILURE
} from "Actions/types";

/**
 * Add New Contact
 */
export const addNewContactUs = data => ({
  type: ADD_NEW_CONTACTUS,
  payload: data
});

/**
 * Redux Action To Contact Us Success
 */
export const addContactusSuccess = (response) => ({
  type: ADD_CONTACTUS_SUCCESS,
  payload: response
});

/**
 * Redux Action To Contact Us Failure
 */
export const addContactusFailure = (error) => ({
  type: ADD_CONTACTUS_FAILURE,
  payload: error
});

