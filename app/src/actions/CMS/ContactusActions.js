import {
  // Add New Contact Us
  ADD_NEW_CONTACTUS,
  ADD_CONTACTUS_SUCCESS,
  ADD_CONTACTUS_FAILURE,
  CONTACTUS_CLEARDATA
} from "../ActionTypes";

/**
 * Add New Contact
 */
export const addNewContactUs = (request) => ({
  type: ADD_NEW_CONTACTUS,
  payload: request
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
export const addContactusFailure = error => ({
  type: ADD_CONTACTUS_FAILURE,
  payload: error
});

/**
 * Redux Action To Clear
 */
export const ContactUsCleardata = () => ({
  type: CONTACTUS_CLEARDATA,
});