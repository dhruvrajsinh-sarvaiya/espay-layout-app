/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 17-12-2018
    UpdatedDate : 17-12-2018
    Description : Survey Saga Action from Fetch data from API 
*/
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

// api
import api from 'Api';

//import action types
import {
    GET_SURVEY,
    ADD_SURVEYRESULT,
    GET_SURVEY_RESULTS_BY_ID
} from 'Actions/types';

//import function from action
import {
    getSurveySuccess,
    getSurveyFailure,
    addSurveyResultSuccess,
    addSurveyResultFailure,
    getSurveyResultsByIdSuccess,
    getSurveyResultsByIdFailure,
} from 'Actions/Survey';

//Function check API call for Survey Form Data..
const getSurveyRequest = async (categoryId) =>
    await api.get('/api/private/v1/surveys/getSurvey/'+categoryId)
        .then(response => response)
        .catch(error => error);

//Function check API call for Survey Result Add..
const addSurveyResultRequest = async (surveyansdata) =>
    await api.post('/api/private/v1/surveys/addSurveyResult', {surveyansdata})
        .then(response => response)
        .catch(error => JSON.parse(JSON.stringify(error.response)));

const getSurveyResultsRequest = async (surveydata) =>
        await api.post('/api/private/v1/surveys/getSurveyResultsBySurveyId',{surveydata})
            .then(response => response)
            .catch(error => JSON.parse(JSON.stringify(error.response))); 

//Function for Get Survey Data API
function* getSurveyAPI({ payload }) {
    try 
    {
        const response = yield call(getSurveyRequest, payload);
        
        if (typeof response.data != 'undefined' && response.data.responseCode==0)
        {
            yield put(getSurveySuccess(response.data.data));
        }else{
            yield put(getSurveyFailure('Unable to Fetch Data.'));
        }
    } catch (error) {
        yield put(getSurveyFailure(error));
    }
}

//Function for Add Survey Result API
function* addSurveyResultAPI({payload}) {
    try 
    {
        const response = yield call(addSurveyResultRequest, payload);
        if (response.data != 'undefined' && response.data.responseCode==0)
        {
            yield put(addSurveyResultSuccess(response.data));
        }
        else
        {
            //let errorObject=JSON.parse(JSON.stringify(response));
            yield put(addSurveyResultFailure(response.data));
        }
    } catch (error) {
        yield put(addSurveyResultFailure(error));
    }
}

//Function for Get Survey By ID API
function* getSurveyResultsByIdAPI({payload}) {
    try {
        const response = yield call(getSurveyResultsRequest, payload);
        
        if (response.data != undefined && response.data.responseCode==0)
        {
            yield put(getSurveyResultsByIdSuccess(response.data));
        }else {
            yield put(getSurveyResultsByIdFailure(response.data));
        }
    } catch (error) {
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
        fork(getSurvey),
        fork(addSurveyResult),
        fork(getSurveyResultsById)
    ]);
}