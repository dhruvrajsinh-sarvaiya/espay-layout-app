/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 19-09-2018
    UpdatedDate : 19-09-2018
    Description : Function for Get FAQ Data Action
*/
import {
    GET_FAQ,
    GET_FAQ_SUCCESS,
    GET_FAQ_FAILURE,
    GET_FAQ_CATEGORIES,
    GET_FAQ_CATEGORIES_SUCCESS,
    GET_FAQ_CATEGORIES_FAILURE,
    GET_FAQ_QUESTIONS,
    GET_FAQ_QUESTIONS_SUCCESS,
    GET_FAQ_QUESTIONS_FAILURE,

    UPDATE_SEARCH_FAQ,
    ON_SEARCH_FAQ,
    SHOW_FAQ_LOADING_INDICATOR
} from 'Actions/types';


/**
 * Function for Get FAQ Categories Data Action
 */
export const getFaqcategories = () => ({
    type: GET_FAQ_CATEGORIES,
    payload:{}
});

/* 
* Function for Get FAQ Categories Data Success Action
*/
export const getFaqcategoriesSuccess = (response) => ({
    type: GET_FAQ_CATEGORIES_SUCCESS,
    payload: response
});

/* 
*  Function for Get FAQ Categories Data Failure Action
*/
export const getFaqcategoriesFailure = (error) => ({
    type: GET_FAQ_CATEGORIES_FAILURE,
    payload: error
});


/**
 * Function for Get FAQ Questions Data Action
 */
export const getFaqquestions = () => ({
    type: GET_FAQ_QUESTIONS,
    payload:{}
});

/* 
* Function for Get FAQ Questions Data Success Action
*/
export const getFaqquestionsSuccess = (response) => ({
    type: GET_FAQ_QUESTIONS_SUCCESS,
    payload: response
});

/* 
*  Function for Get FAQ Questions Data Failure Action
*/
export const getFaqquestionsFailure = (error) => ({
    type: GET_FAQ_QUESTIONS_FAILURE,
    payload: error
});


/**
 * Function for Get FAQ Data Action
 */
export const getFaq = () => ({
    type: GET_FAQ,
    payload:{}
});

/* 
* Function for Get FAQ Data Success Action
*/
export const getFaqSuccess = (response) => ({
    type: GET_FAQ_SUCCESS,
    payload: response
});

/* 
*  Function for Get FAQ Data Failure Action
*/
export const getFaqFailure = (error) => ({
    type: GET_FAQ_FAILURE,
    payload: error
});


/**
 * Show Faq Loading Indicator
 */
export const showFaqLoadingIndicator = () => ({
    type: SHOW_FAQ_LOADING_INDICATOR
});

/**
 * Update Search Ideas
 */
export const updateSearchFaq = (value) => ({
    type: UPDATE_SEARCH_FAQ,
    payload: value
});

/**
 * On Search Idea
 */
export const onSearchFaq = (value) => ({
    type: ON_SEARCH_FAQ,
    payload: value
});