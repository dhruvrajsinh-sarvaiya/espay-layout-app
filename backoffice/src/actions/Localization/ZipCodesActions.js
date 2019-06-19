/* 
    Createdby : Dhara gajera 
    CreatedDate : 8/2/2019
    Description : Function for Get Zip codes Data Action
*/
import {
    GET_ZIPCODES,
    GET_ZIPCODES_SUCCESS,
    GET_ZIPCODES_FAILURE,
    ADD_NEW_ZIPCODES,
    ADD_NEW_ZIPCODES_SUCCESS,
    ADD_NEW_ZIPCODES_FAILURE,
    GET_ZIPCODES_BY_ID,
    GET_ZIPCODES_BY_ID_SUCCESS,
    GET_ZIPCODES_BY_ID_FAILURE,
    UPDATE_ZIPCODES,
    UPDATE_ZIPCODES_SUCCESS,
    UPDATE_ZIPCODES_FAILURE,
} from 'Actions/types';

/**
 * Function for Get ZIP CODES Data Action
 */
export const getZipCodes = (data) => ({
    type: GET_ZIPCODES,
    payload: data
});

/* 
* Function for Get ZIP CODES Data Success Action
*/
export const getZipCodesSuccess = (response) => ({
    type: GET_ZIPCODES_SUCCESS,
    payload: response
});

/* 
*  Function for Get ZIP CODES Data Failure Action
*/
export const getZipCodesFailure = (error) => ({
    type: GET_ZIPCODES_FAILURE,
    payload: error
});


/**
 * Add New zip code
 */
export const addNewZipcode = (data) => ({
    type: ADD_NEW_ZIPCODES,
    payload: data
});

/**
 * Add zip code Success
 */
export const addNewZipcodeSuccess = (response) => ({
    type: ADD_NEW_ZIPCODES_SUCCESS,
    payload: response
});

/**
 * Add zip code Failure
 */
export const addNewZipcodeFailure = (error) => ({
    type: ADD_NEW_ZIPCODES_FAILURE,
    payload: error
});

/**
 * get zipcode by Id
 */
export const getZipCodeById = (data) => ({
    type: GET_ZIPCODES_BY_ID,
    payload: data
});

/**
 * get zipcode by Id Success
 */
export const getZipCodeByIdSuccess = (response) => ({
    type: GET_ZIPCODES_BY_ID_SUCCESS,
    payload: response
});

/**
 *  get zipcode by Id Failure
 */
export const getZipCodeByIdFailure = (error) => ({
    type: GET_ZIPCODES_BY_ID_FAILURE,
    payload: error
});
/**
 * Update zipcode
 */
export const updateZipcode = (data) => ({
    type: UPDATE_ZIPCODES,
    payload: data
});

/**
 * update zipcode Success
 */
export const updateZipcodeSuccess = (response) => ({
    type: UPDATE_ZIPCODES_SUCCESS,
    payload: response
});

/**
 * Update zipcode Failure
 */
export const updateZipcodeFailure = (error) => ({
    type: UPDATE_ZIPCODES_FAILURE,
    payload: error
});
