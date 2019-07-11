/* 
    Createdby : DHARA GAJERA
    CreatedDate : 9/1/2019
    Description : COIN LIST request Action Method
*/
import {
    GET_COINLIST_REQUEST,
    GET_COINLIST_REQUEST_SUCCESS,
    GET_COINLIST_REQUEST_FAILURE,

    ADD_COINLIST_REQUEST,
    ADD_COINLIST_REQUEST_SUCCESS,
    ADD_COINLIST_REQUEST_FAILURE,

    GET_COUNTRY,
    GET_COUNTRY_SUCCESS,
    GET_COUNTRY_FAILURE,
} from 'Actions/types';

/**
 * Redux Action for Get Coinlist request
 */
export const getCoinlistRequest = () => ({
    type: GET_COINLIST_REQUEST
});

/**
 * Redux Action Get Coinlist request Success
 */
export const getCoinlistRequestSuccess = (response) => ({
    type: GET_COINLIST_REQUEST_SUCCESS,
    payload: response
});

/**
 * Redux Action Get Coinlist request Failure
 */
export const getCoinlistRequestFailure = (error) => ({
    type: GET_COINLIST_REQUEST_FAILURE,
    payload: error
});

/**
 * Add coin list request form
 */
export const addCoinListRequest = (data) => ({
    type: ADD_COINLIST_REQUEST,
    payload: data
});

/**
 * Add coin list request form Success
 */
export const addCoinListRequestSuccess = (response) => ({
    type: ADD_COINLIST_REQUEST_SUCCESS,
    payload: response
});

/**
 * Add coin list request form Failure
 */
export const addCoinListRequestFailure = (error) => ({
    type: ADD_COINLIST_REQUEST_FAILURE,
    payload: error
});

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