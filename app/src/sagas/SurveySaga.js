import { all, call, fork, put, takeEvery, select } from 'redux-saga/effects';
//import action types
import {
    GET_SURVEY,
    ADD_SURVEYRESULT,
    GET_SURVEY_RESULTS_BY_ID
} from '../actions/ActionTypes';

import { Method } from '../controllers/Constants';
import { userAccessToken } from '../selector';
import { WebPageUrlGetApi, WebPageUrlPostAPI } from '../api/helper';

//import function from action
import {
    getSurveySuccess,
    getSurveyFailure,
    addSurveyResultSuccess,
    addSurveyResultFailure,
    getSurveyResultsByIdSuccess,
    getSurveyResultsByIdFailure,
} from '../actions/CMS/SurveyAction';

//Function for Get Survey Data API
function* getSurveyAPI({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': 'JWT ' + token.replace('Bearer ', '') };

        // To call Survey API api
        const response = yield call(WebPageUrlGetApi, Method.getSurvey + '/' + payload, {}, headers);

        // To set Survey success response to reducer
        yield put(getSurveySuccess(response));
    } catch (error) {
        // To set Survey failure response to reducer
        yield put(getSurveyFailure(error));
    }
}

//Function for Add Survey Result API
function* addSurveyResultAPI({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': 'JWT ' + token.replace('Bearer ', '') };
        
        // To call Survey Result api
        const response = yield call(WebPageUrlPostAPI, Method.addSurveyResult, { surveyansdata: payload }, headers);
        
        // To set Add Survey Result success response to reducer
        yield put(addSurveyResultSuccess(response));
    } catch (error) {
        // To set Add Survey Result failure response to reducer
        yield put(addSurveyResultFailure(error));
    }
}

//Function for Get Survey By ID API
function* getSurveyResultsByIdAPI({ payload }) {
    try {
        // To get tokenID of currently logged in user.
        let token = yield select(userAccessToken);
        var headers = { 'Authorization': 'JWT ' + token.replace('Bearer ', '') };
        
        // To call Survey Result By Id api
        const response = yield call(WebPageUrlPostAPI, Method.getSurveyResultsBySurveyId, { surveydata: payload }, headers);
        
        // To set Survey Result By Id success response to reducer
        yield put(getSurveyResultsByIdSuccess(response));
    } catch (error) {
        // To set Survey Result By Id failure response to reducer
        yield put(getSurveyResultsByIdFailure(error));
    }
}

//Get Survey
export function* getSurvey() {
    yield takeEvery(GET_SURVEY, getSurveyAPI);
}

// add Survey Result
export function* addSurveyResult() {
    yield takeEvery(ADD_SURVEYRESULT, addSurveyResultAPI);
}

//Get Survey Result by Id
export function* getSurveyResultsById() {
    yield takeEvery(GET_SURVEY_RESULTS_BY_ID, getSurveyResultsByIdAPI);
}

//Survey Root Saga
export default function* rootSaga() {
    yield all([
        // To register getSurvey method
        fork(getSurvey),
        // To register addSurveyResult method
        fork(addSurveyResult),
        // To register getSurveyResultsById method
        fork(getSurveyResultsById)
    ]);
}