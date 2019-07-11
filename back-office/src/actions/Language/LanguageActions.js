/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 10-10-2018
    UpdatedDate : 10-10-2018
    Description : Function for Get Language List
	Updated by Jayesh Pathak 26-10-2018 for adding language module listing/add/edit
*/
import {
    GET_LANGUAGE,
    GET_LANGUAGE_SUCCESS,
    GET_LANGUAGE_FAILURE,
	GET_ALL_LANGUAGE,
	GET_ALL_LANGUAGE_SUCCESS,
	GET_ALL_LANGUAGE_FAILURE,
	ADD_NEW_LANGUAGE,
	ADD_NEW_LANGUAGE_SUCCESS,
	ADD_NEW_LANGUAGE_FAILURE,
	UPDATE_LANGUAGE,
	UPDATE_LANGUAGE_SUCCESS,
	UPDATE_LANGUAGE_FAILURE,
	GET_LANGUAGE_BY_ID,
	GET_LANGUAGE_BY_ID_SUCCESS,
    GET_LANGUAGE_BY_ID_FAILURE,
    GET_LANGUAGE_CONFIG,
    GET_LANGUAGE_CONFIG_SUCCESS,
    GET_LANGUAGE_CONFIG_FAILURE,
    UPDATE_LANGUAGE_CONFIG,
    UPDATE_LANGUAGE_CONFIG_SUCCESS,
    UPDATE_LANGUAGE_CONFIG_FAILURE,
} from 'Actions/types';


/**
 * Redux Action To Language
 */
export const getLanguage = () => ({
    type: GET_LANGUAGE,
    payload:{}
});

/**
 * Redux Action To Language Success
 */
export const getLanguageSuccess = (response) => ({
    type: GET_LANGUAGE_SUCCESS,
    payload: response
});

/**
 * Redux Action To Language Failure
 */
export const getLanguageFailure = (error) => ({
    type: GET_LANGUAGE_FAILURE,
    payload: error
});

/**
 * Function for Get AllLanguage Data Action
 */
export const getAllLanguage = () => ({
    type: GET_ALL_LANGUAGE,
    payload: {}
});

/* 
* Function for Get AllLanguage Data Success Action
*/
export const getAllLanguageSuccess = (response) => ({
    type: GET_ALL_LANGUAGE_SUCCESS,
    payload: response
});

/* 
*  Function for Get AllLanguage Data Failure Action
*/
export const getAllLanguageFailure = (error) => ({
    type: GET_ALL_LANGUAGE_FAILURE,
    payload: error
});


/**
 * Add New Language
 */
export const addNewLanguage = (data) => ({
    type: ADD_NEW_LANGUAGE,
    payload: data
});

/**
 * Add Language Success
 */
export const addNewLanguageSuccess = (response) => ({
    type: ADD_NEW_LANGUAGE_SUCCESS,
    payload: response
});

/**
 * Add Language Failure
 */
export const addNewLanguageFailure = (error) => ({
    type: ADD_NEW_LANGUAGE_FAILURE,
    payload: error
});

/**
 * Update Language
 */
export const updateLanguage = (data) => ({
    type: UPDATE_LANGUAGE,
    payload: data
});

/**
 * update Language Success
 */
export const updateLanguageSuccess = (response) => ({
    type: UPDATE_LANGUAGE_SUCCESS,
	payload:response
});

/**
 * Update Language Failure
 */
export const updateLanguageFailure = (error) => ({
    type: UPDATE_LANGUAGE_FAILURE,
    payload: error
});


/**
 * Redux Action To Get Language By Id
 */
export const getLanguageById = (languageid) => ({
    type: GET_LANGUAGE_BY_ID,
    payload : languageid
});

/**
 * Redux Action To Get Language By Id Success
 */
export const getLanguageByIdSuccess = (data) => ({
    type: GET_LANGUAGE_BY_ID_SUCCESS,
    payload: data
});

/**
 * Redux Action To Get Language By Id Failure
 */
export const getLanguageByIdFailure = (error) => ({
    type: GET_LANGUAGE_BY_ID_FAILURE,
    payload: error
});

/**
 * Redux Action To Language Config
 */
export const getLanguageConfig = () => ({
    type: GET_LANGUAGE_CONFIG,
    payload:{}
});

/**
 * Redux Action To Language Config Success
 */
export const getLanguageConfigSuccess = (response) => ({
    type: GET_LANGUAGE_CONFIG_SUCCESS,
    payload: response
});

/**
 * Redux Action To Language Config Failure
 */
export const getLanguageConfigFailure = (error) => ({
    type: GET_LANGUAGE_CONFIG_FAILURE,
    payload: error
});

/**
 * Update Language
 */
export const updateLanguageConfig = (data) => ({
    type: UPDATE_LANGUAGE_CONFIG,
    payload: data
});

/**
 * update Language Success
 */
export const updateLanguageConfigSuccess = (response) => ({
    type: UPDATE_LANGUAGE_CONFIG_SUCCESS,
	payload:response
});

/**
 * Update Language Failure
 */
export const updateLanguageConfigFailure = (error) => ({
    type: UPDATE_LANGUAGE_CONFIG_FAILURE,
    payload: error
});
