import {
    // Get Survey
    GET_SURVEY,
    GET_SURVEY_SUCCESS,
    GET_SURVEY_FAILURE,

    // Add Survey Result
    ADD_SURVEYRESULT,
    ADD_SURVEYRESULT_SUCCESS,
    ADD_SURVEYRESULT_FAILURE,

    // Get Survey Result By Id
    GET_SURVEY_RESULTS_BY_ID,
    GET_SURVEY_RESULTS_BY_ID_SUCCESS,
    GET_SURVEY_RESULTS_BY_ID_FAILURE,

    // Get Survey Result By Id Clear
    GET_SURVEY_RESULTS_BY_ID_CLEAR
} from '../ActionTypes';

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

/**
 * Redux Action To Get Survey Results By Id clear
 */
export const getSurveyResultsByIdClear = () => ({
    type: GET_SURVEY_RESULTS_BY_ID_CLEAR
});
