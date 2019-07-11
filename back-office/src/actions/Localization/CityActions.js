/* 
    Createdby : Jayesh Pathak
    Updateby : Jayesh Pathak
    CreatedDate : 10-10-2018
    UpdatedDate : 10-10-2018
    Description : Function for Get City Data Action
*/
import {
    GET_CITY,
    GET_CITY_SUCCESS,
    GET_CITY_FAILURE,
    ADD_NEW_CITY,
    ADD_NEW_CITY_SUCCESS,
    ADD_NEW_CITY_FAILURE,
    UPDATE_CITY,
    UPDATE_CITY_SUCCESS,
    UPDATE_CITY_FAILURE,
	//For Get Edit State By Id
    GET_CITY_BY_ID,
    GET_CITY_BY_ID_SUCCESS,
    GET_CITY_BY_ID_FAILURE,

    //Added by dhara gajera 11/2/2019
    GET_CITY_BY_STATE_ID,
    GET_CITY_BY_STATE_ID_SUCCESS,
    GET_CITY_BY_STATE_ID_FAILURE,
} from 'Actions/types';

/**
 * Function for Get City Data Action
 */
export const getCity = (data) => ({
    type: GET_CITY,
    payload: data
});

/* 
* Function for Get City Data Success Action
*/
export const getCitySuccess = (response) => ({
    type: GET_CITY_SUCCESS,
    payload: response
});

/* 
*  Function for Get City Data Failure Action
*/
export const getCityFailure = (error) => ({
    type: GET_CITY_FAILURE,
    payload: error
});


/**
 * Add New City
 */
export const addNewCity = (data) => ({
    type: ADD_NEW_CITY,
    payload: data
});

/**
 * Add City Success
 */
export const addNewCitySuccess = (response) => ({
    type: ADD_NEW_CITY_SUCCESS,
    payload: response
});

/**
 * Add City Failure
 */
export const addNewCityFailure = (error) => ({
    type: ADD_NEW_CITY_FAILURE,
    payload: error
});

/**
 * Update City
 */
export const updateCity = (data) => ({
    type: UPDATE_CITY,
    payload: data
});

/**
 * update City Success
 */
export const updateCitySuccess = (response) => ({
    type: UPDATE_CITY_SUCCESS,
    payload: response
});

/**
 * Update City Failure
 */
export const updateCityFailure = (error) => ({
    type: UPDATE_CITY_FAILURE,
    payload: error
});

/**
 * Redux Action To Get City By Id
 */
export const getCityById = (cityid) => ({
    type: GET_CITY_BY_ID,
    payload : cityid
});

/**
 * Redux Action To Get City By Id Success
 */
export const getCityByIdSuccess = (data) => ({
    type: GET_CITY_BY_ID_SUCCESS,
    payload: data
});

/**
 * Redux Action To Get City By Id Failure
 */
export const getCityByIdFailure = (error) => ({
    type: GET_CITY_BY_ID_FAILURE,
    payload: error
});

//Added by dhara gajera 11/2/2019

/**
 * Redux Action To Get Cities By state Id
 */
export const getCitiesByStateId = (cityid) => ({
    type: GET_CITY_BY_STATE_ID,
    payload : cityid
});

/**
 * Redux Action To Get City By Id Success
 */
export const getCitiesByStateIdSuccess = (data) => ({
    type: GET_CITY_BY_STATE_ID_SUCCESS,
    payload: data
});

/**
 * Redux Action To Get City By Id Failure
 */
export const getCitiesByStateIdFailure = (error) => ({
    type: GET_CITY_BY_STATE_ID_FAILURE,
    payload: error
});
/**
 * delete City
 */
/* export const deleteCity = (cityid) => ({
    type: DELETE_CITY
}); */