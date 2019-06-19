/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 01-10-2018
    UpdatedDate : 01-10-2018
    Description : Function for Get FAQ Question Data Action
*/
import {
    GET_FAQ_QUESTIONS,
    GET_FAQ_QUESTIONS_SUCCESS,
    GET_FAQ_QUESTIONS_FAILURE,
    ADD_FAQ_QUESTION,
    ADD_FAQ_QUESTION_SUCCESS,
    ADD_FAQ_QUESTION_FAILURE,
    UPDATE_FAQ_QUESTION,
    UPDATE_FAQ_QUESTION_SUCCESS,
    UPDATE_FAQ_QUESTION_FAILURE,
    DELETE_FAQ_QUESTION,
    DELETE_FAQ_QUESTION_SUCCESS,
    DELETE_FAQ_QUESTION_FAILURE,
    GET_FAQ_QUESTION_BY_ID,
    GET_FAQ_QUESTION_BY_ID_SUCCESS,
    GET_FAQ_QUESTION_BY_ID_FAILURE,
} from 'Actions/types';

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
 * Add Faq Question
 */
export const addFaqQuestion = (data) => ({
    type: ADD_FAQ_QUESTION,
    payload: data
});

/**
 * Redux Action To Faq Question Success
 */
export const addFaqQuestionSuccess = (response) => ({
    type: ADD_FAQ_QUESTION_SUCCESS,
    payload: response
});

/**
 * Redux Action To Faq Question Failure
 */
export const addFaqQuestionFailure = (error) => ({
    type: ADD_FAQ_QUESTION_FAILURE,
    payload: error
});

/**
 * Add Faq Question
 */
export const updateFaqQuestion = (data) => ({
    type: UPDATE_FAQ_QUESTION,
    payload: data
});

/**
 * Redux Action To Faq Question Success
 */
export const updateFaqQuestionSuccess = (response) => ({
    type: UPDATE_FAQ_QUESTION_SUCCESS,
    payload: response
});

/**
 * Redux Action To Faq Question Failure
 */
export const updateFaqQuestionFailure = (error) => ({
    type: UPDATE_FAQ_QUESTION_FAILURE,
    payload: error
});


/**
 * Redux Action To Faq Question By Id
 */
export const getFaqQuestionById = (faq_question_id) => ({
    type: GET_FAQ_QUESTION_BY_ID,
    payload : faq_question_id
});

/**
 * Redux Action To Get Faq Question By Id Success
 */
export const getFaqQuestionByIdSuccess = (data) => ({
    type: GET_FAQ_QUESTION_BY_ID_SUCCESS,
    payload: data
});

/**
 * Redux Action To Get Faq Question By Id Failure
 */
export const getFaqQuestionByIdFailure = (error) => ({
    type: GET_FAQ_QUESTION_BY_ID_FAILURE,
    payload: error
});

/**
 * Redux Action To Delete Faq Question
 */
export const deleteFaqQuestion = (faq_question_id) => ({
    type: DELETE_FAQ_QUESTION,
    payload : faq_question_id
});

/**
 * Redux Action To Delete Faq Question Success
 */
export const deleteFaqQuestionSuccess = (data) => ({
    type: DELETE_FAQ_QUESTION_SUCCESS,
    payload: data
});

/**
 * Redux Action To Delete Faq Question Failure
 */
export const deleteFaqQuestionFailure = (error) => ({
    type: DELETE_FAQ_QUESTION_FAILURE,
    payload: error
});