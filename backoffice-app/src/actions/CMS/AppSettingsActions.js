/**
 * Redux App Settings Actions
 */
import {
    //Added For Get language Action type
    GET_LANGUAGES,
    GET_LANGUAGES_SUCCESS,
    GET_LANGUAGES_FAILURE,
    SET_LANGUAGES,
    SET_LANGUAGES_SUCCESS,
    SET_LANGUAGES_FAILURE
} from '../ActionTypes';

// Redux Action To Get Languages 
export const getLanguages = () => ({
    type: GET_LANGUAGES
});

// Redux Action To Get Languages Success
export const getLanguagesSuccess = (response) => ({
    type: GET_LANGUAGES_SUCCESS,
    payload: response
});

// Redux Action To Get Languages Failure
export const getLanguagesFailure = (error) => ({
    type: GET_LANGUAGES_FAILURE,
    payload: error
});

// Redux Action To Set Languages 
export const setLanguages = (request) => ({
    type: SET_LANGUAGES,
    payload:request
});

// Redux Action To Set Languages Success
export const setLanguagesSuccess = (response) => ({
    type: SET_LANGUAGES_SUCCESS,
    payload: response
});

// Redux Action To Set Languages Failure
export const setLanguagesFailure = (error) => ({
    type: SET_LANGUAGES_FAILURE,
    payload: error
});