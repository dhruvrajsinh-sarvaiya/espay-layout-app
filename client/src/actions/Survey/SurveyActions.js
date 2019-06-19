/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 17-12-2018
    UpdatedDate : 17-12-2018
    Description : Survey Action 
*/
import {
    GET_SURVEY,
    GET_SURVEY_SUCCESS,
    GET_SURVEY_FAILURE,
    ADD_SURVEYRESULT,
    ADD_SURVEYRESULT_SUCCESS,
    ADD_SURVEYRESULT_FAILURE,
    GET_SURVEY_RESULTS_BY_ID,
    GET_SURVEY_RESULTS_BY_ID_SUCCESS,
    GET_SURVEY_RESULTS_BY_ID_FAILURE
} from 'Actions/types';

/**
 * Redux Action Get Survey
 */
export const getSurvey = (categoryId) => ({
    type: GET_SURVEY,
    payload:categoryId
});

/**
 * Redux Action Get Survey Success
 */
export const getSurveySuccess = (response) => ({
    type: GET_SURVEY_SUCCESS,
    payload: response
});

/**
 * Redux Action Get Survey Failure
 */
export const getSurveyFailure = (error) => ({
    type: GET_SURVEY_FAILURE,
    payload: error
});

/**
 * Add Survey Result
 */
export const addSurveyResult = (data) => ({
    type: ADD_SURVEYRESULT,
    payload: data
});

/**
 * Redux Action To Survey Result Success
 */
export const addSurveyResultSuccess = (response) => ({
    type: ADD_SURVEYRESULT_SUCCESS,
    payload: response
});

/**
 * Redux Action To Survey Result Failure
 */
export const addSurveyResultFailure = (error) => ({
    type: ADD_SURVEYRESULT_FAILURE,
    payload: error
});

/**
 * Redux Action To Get Survey Results By Id
 */
export const getSurveyResultsById = (data) => ({
    type: GET_SURVEY_RESULTS_BY_ID,
    payload : data
});

/**
 * Redux Action To Get Survey Results By Id Success
 */
export const getSurveyResultsByIdSuccess = (data) => ({
    type: GET_SURVEY_RESULTS_BY_ID_SUCCESS,
    payload: data
});

/**
 * Redux Action To Get Survey Results By Id Failure
 */
export const getSurveyResultsByIdFailure = (error) => ({
    type: GET_SURVEY_RESULTS_BY_ID_FAILURE,
    payload: error
});