/* 
    Createdby : Jayesh Pathak
    Updateby : Jayesh Pathak
    CreatedDate : 10-10-2018
    UpdatedDate : 10-10-2018
    Description : Function for Get State Data Action
*/
import {
    GET_STATE,
    GET_STATE_SUCCESS,
    GET_STATE_FAILURE,
    ADD_NEW_STATE,
    ADD_NEW_STATE_SUCCESS,
    ADD_NEW_STATE_FAILURE,
    UPDATE_STATE,
    UPDATE_STATE_SUCCESS,
    UPDATE_STATE_FAILURE,
	//For Get Edit State By Id
    GET_STATE_BY_ID,
    GET_STATE_BY_ID_SUCCESS,
    GET_STATE_BY_ID_FAILURE,
    GET_STATE_BY_COUNTRY_ID,
    GET_STATE_BY_COUNTRY_ID_SUCCESS,
    GET_STATE_BY_COUNTRY_ID_FAILURE
} from 'Actions/types';

/**
 * Function for Get State Data Action
 */
export const getState = (data) => ({
    type: GET_STATE,
    payload: data
});

/* 
* Function for Get State Data Success Action
*/
export const getStateSuccess = (response) => ({
    type: GET_STATE_SUCCESS,
    payload: response
});

/* 
*  Function for Get State Data Failure Action
*/
export const getStateFailure = (error) => ({
    type: GET_STATE_FAILURE,
    payload: error
});


/**
 * Add New State
 */
export const addNewState = (data) => ({
    type: ADD_NEW_STATE,
    payload: data
});

/**
 * Add State Success
 */
export const addNewStateSuccess = (response) => ({
    type: ADD_NEW_STATE_SUCCESS,
    payload: response
});

/**
 * Add State Failure
 */
export const addNewStateFailure = (error) => ({
    type: ADD_NEW_STATE_FAILURE,
    payload: error
});

/**
 * Update State
 */
export const updateState = (data) => ({
    type: UPDATE_STATE,
    payload: data
});

/**
 * update State Success
 */
export const updateStateSuccess = (response) => ({
    type: UPDATE_STATE_SUCCESS,
    payload: response
});

/**
 * Update State Failure
 */
export const updateStateFailure = (error) => ({
    type: UPDATE_STATE_FAILURE,
    payload: error
});

/**
 * Redux Action To Get State By Id
 */
export const getStateById = (stateid) => ({
    type: GET_STATE_BY_ID,
    payload : stateid
});

/**
 * Redux Action To Get State By Id Success
 */
export const getStateByIdSuccess = (data) => ({
    type: GET_STATE_BY_ID_SUCCESS,
    payload: data
});

/**
 * Redux Action To Get State By Id Failure
 */
export const getStateByIdFailure = (error) => ({
    type: GET_STATE_BY_ID_FAILURE,
    payload: error
});

/**
 * Redux Action To Get State By CountryId
 */
export const getStateByCountryId = (data) => ({
    type: GET_STATE_BY_COUNTRY_ID,
    payload : data
});

/**
 * Redux Action To Get State By CountryId Success
 */
export const getStateByCountryIdSuccess = (response) => ({
    type: GET_STATE_BY_COUNTRY_ID_SUCCESS,
    payload: response
});

/**
 * Redux Action To Get State By CountryId Failure
 */
export const getStateByCountryIdFailure = (error) => ({
    type: GET_STATE_BY_COUNTRY_ID_FAILURE,
    payload: error
});