/* 
    Createdby : Jayesh Pathak
    Updateby : Jayesh Pathak
    CreatedDate : 17-12-2018
    UpdatedDate : 17-12-2018
    Description : Function for Get Surveys Data Action
*/
import {
    GET_SURVEYS,
    GET_SURVEYS_SUCCESS,
    GET_SURVEYS_FAILURE,
    ADD_NEW_SURVEY,
    ADD_NEW_SURVEY_SUCCESS,
    ADD_NEW_SURVEY_FAILURE,
    UPDATE_SURVEY,
    UPDATE_SURVEY_SUCCESS,
    UPDATE_SURVEY_FAILURE,
    DELETE_SURVEY,
    //For Get Edit Survey By Id
    GET_SURVEY_BY_ID,
    GET_SURVEY_BY_ID_SUCCESS,
    GET_SURVEY_BY_ID_FAILURE,
    GET_SURVEY_RESULTS_BY_ID,
    GET_SURVEY_RESULTS_BY_ID_SUCCESS,
    GET_SURVEY_RESULTS_BY_ID_FAILURE
} from 'Actions/types';

/**
 * Function for Get Surveys Data Action
 */
export const getSurveys = () => ({
    type: GET_SURVEYS,
    payload:{}
});

/* 
* Function for Get Surveys Data Success Action
*/
export const getSurveysSuccess = (response) => ({
    type: GET_SURVEYS_SUCCESS,
    payload: response
});

/* 
*  Function for Get Surveys Data Failure Action
*/
export const getSurveysFailure = (error) => ({
    type: GET_SURVEYS_FAILURE,
    payload: error
});


/**
 * Add New survey
 */
export const addNewSurvey = (data) => ({
    type: ADD_NEW_SURVEY,
    payload: data
});

/**
 * Add New survey Success
 */
export const addNewSurveySuccess = (response) => ({
    type: ADD_NEW_SURVEY_SUCCESS,
    payload:response
});

/**
 * Add New survey Failure
 */
export const addNewSurveyFailure = (error) => ({
    type: ADD_NEW_SURVEY_FAILURE,
    payload: error
});

/**
 * Update survey
 */
export const updateSurvey = (data) => ({
    type: UPDATE_SURVEY,
    payload: data
});

/**
 * update survey Success
 */
export const updateSurveySuccess = (response) => ({
    type: UPDATE_SURVEY_SUCCESS,
    payload:response
});

/**
 * Update survey Failure
 */
export const updateSurveyFailure = (error) => ({
    type: UPDATE_SURVEY_FAILURE,
    payload: error
});


/**
 * Redux Action To Get Survey By Id
 */
export const getSurveyById = (surveys_id) => ({
    type: GET_SURVEY_BY_ID,
    payload : surveys_id
});

/**
 * Redux Action To Get Survey By Id Success
 */
export const getSurveyByIdSuccess = (data) => ({
    type: GET_SURVEY_BY_ID_SUCCESS,
    payload: data
});

/**
 * Redux Action To Get Survey By Id Failure
 */
export const getSurveyByIdFailure = (error) => ({
    type: GET_SURVEY_BY_ID_FAILURE,
    payload: error
});


/**
 * Redux Action To Get Survey Results By Id
 */
export const getSurveyResultsById = (surveys_id) => ({
    type: GET_SURVEY_RESULTS_BY_ID,
    payload : surveys_id
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
 * delete Survey
 */
export const deleteSurvey = (surveysid) => ({
    type: DELETE_SURVEY
});