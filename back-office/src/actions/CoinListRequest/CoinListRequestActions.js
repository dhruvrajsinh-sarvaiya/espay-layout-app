/* 
    Createdby :DHara gajera
    CreatedDate : 9-01-2019
    Description : Function for get coin list fields Data Action
*/
import {
    GET_COINLIST_REQUEST,
    GET_COINLIST_REQUEST_SUCCESS,
    GET_COINLIST_REQUEST_FAILURE,

    GET_COINLIST_FIELDS,
    GET_COINLIST_FIELDS_SUCCESS,
    GET_COINLIST_FIELDS_FAILURE,

    UPDATE_COINLIST_FIELDS,
    UPDATE_COINLIST_FIELDS_SUCCESS,
    UPDATE_COINLIST_FIELDS_FAILURE,
} from 'Actions/types';

/**
 * Function for Get user coin list request Data Action
 */
export const getCoinListRequests = () => ({
    type: GET_COINLIST_REQUEST,
    payload:{}
});

/* 
* Function for Get user coin list request Data Success Action
*/
export const getCoinListRequestSuccess = (response) => ({
    type: GET_COINLIST_REQUEST_SUCCESS,
    payload: response
});

/* 
*  Function for Get user coin list request Data Failure Action
*/
export const getCoinListRequestFailure = (error) => ({
    type: GET_COINLIST_REQUEST_FAILURE,
    payload: error
});


/**
 * Function for Get coin list fields Data Action
 */
export const getCoinListFields = () => ({
    type: GET_COINLIST_FIELDS,
    payload:{}
});

/* 
* Function for Get coin list fields Success Action
*/
export const getCoinListFieldsSuccess = (response) => ({
    type: GET_COINLIST_FIELDS_SUCCESS,
    payload: response
});

/* 
*  Function for Get coin list fields Failure Action
*/
export const getCoinListFieldsFailure = (error) => ({
    type: GET_COINLIST_FIELDS_FAILURE,
    payload: error
});

/**
 * Update  coin list fields
 */
export const updateCoinListFields = (data) => ({
    type: UPDATE_COINLIST_FIELDS,
    payload: data
});

/**
 * update  coin list fields Success
 */
export const updateCoinListFieldsSuccess = (response) => ({
    type: UPDATE_COINLIST_FIELDS_SUCCESS,
    payload:response
});

/**
 * Update  coin list fields Failure
 */
export const updateCoinListFieldsFailure = (error) => ({
    type: UPDATE_COINLIST_FIELDS_FAILURE,
    payload: error
});