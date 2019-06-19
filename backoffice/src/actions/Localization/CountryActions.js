/* 
    Createdby : Jayesh Pathak
    Updateby : Jayesh Pathak
    CreatedDate : 10-10-2018
    UpdatedDate : 10-10-2018
    Description : Function for Get Country Data Action
*/
import {
    GET_COUNTRY,
    GET_COUNTRY_SUCCESS,
    GET_COUNTRY_FAILURE,
    ADD_NEW_COUNTRY,
    ADD_NEW_COUNTRY_SUCCESS,
    ADD_NEW_COUNTRY_FAILURE,
    UPDATE_COUNTRY,
    UPDATE_COUNTRY_SUCCESS,
    UPDATE_COUNTRY_FAILURE,
    DELETE_COUNTRY,
	//For Get Edit Country By Id
    GET_COUNTRY_BY_ID,
    GET_COUNTRY_BY_ID_SUCCESS,
    GET_COUNTRY_BY_ID_FAILURE
} from 'Actions/types';

/**
 * Function for Get Country Data Action
 */
export const getCountry = (data) => ({
    type: GET_COUNTRY,
    payload: data
});

/* 
* Function for Get Country Data Success Action
*/
export const getCountrySuccess = (response) => ({
    type: GET_COUNTRY_SUCCESS,
    payload: response
});

/* 
*  Function for Get Country Data Failure Action
*/
export const getCountryFailure = (error) => ({
    type: GET_COUNTRY_FAILURE,
    payload: error
});


/**
 * Add New Country
 */
export const addNewCountry = (data) => ({
    type: ADD_NEW_COUNTRY,
    payload: data
});

/**
 * Add Country Success
 */
export const addNewCountrySuccess = (response) => ({
    type: ADD_NEW_COUNTRY_SUCCESS,
    payload: response
});

/**
 * Add Country Failure
 */
export const addNewCountryFailure = (error) => ({
    type: ADD_NEW_COUNTRY_FAILURE,
    payload: error
});

/**
 * Update Country
 */
export const updateCountry = (data) => ({
    type: UPDATE_COUNTRY,
    payload: data
});

/**
 * update Country Success
 */
export const updateCountrySuccess = (response) => ({
    type: UPDATE_COUNTRY_SUCCESS,
	payload:response
});

/**
 * Update Country Failure
 */
export const updateCountryFailure = (error) => ({
    type: UPDATE_COUNTRY_FAILURE,
    payload: error
});


/**
 * Redux Action To Get Country By Id
 */
export const getCountryById = (countryid) => ({
    type: GET_COUNTRY_BY_ID,
    payload : countryid
});

/**
 * Redux Action To Get Country By Id Success
 */
export const getCountryByIdSuccess = (data) => ({
    type: GET_COUNTRY_BY_ID_SUCCESS,
    payload: data
});

/**
 * Redux Action To Get Country By Id Failure
 */
export const getCountryByIdFailure = (error) => ({
    type: GET_COUNTRY_BY_ID_FAILURE,
    payload: error
});

/**
 * delete Country
 */
/* export const deleteCountry = (countryId) => ({
    type: DELETE_COUNTRY,
    payload : countryId
}); */