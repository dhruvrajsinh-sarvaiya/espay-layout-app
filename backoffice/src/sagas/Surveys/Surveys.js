/* 
    Createdby : Jayesh Pathak
    Updateby : Jayesh Pathak
    CreatedDate : 17-12-2018
    UpdatedDate : 17-12-2018
    Description : For Surveys Data through api action saga method 
*/
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

// api
import api from 'Api';

//import action types
import {
    GET_SURVEYS,
    ADD_NEW_SURVEY,
    UPDATE_SURVEY,
    GET_SURVEY_BY_ID,
    GET_SURVEY_RESULTS_BY_ID
} from 'Actions/types';

//import function from action
import {
    getSurveysSuccess,
    getSurveysFailure,
    addNewSurveySuccess,
    addNewSurveyFailure,
    updateSurveySuccess,
    updateSurveyFailure,
    getSurveyByIdSuccess,
    getSurveyByIdFailure,
    getSurveyResultsByIdSuccess,
    getSurveyResultsByIdFailure,
} from 'Actions/Surveys';


//Function check API call for Survey List..
const getSurveysRequest = async () =>
    await api.get('/api/private/v1/surveys/listSurveys')
        .then(response => response)
        .catch(error => JSON.parse(JSON.stringify(error.response)));

const getSurveyResultsRequest = async (surveyId) =>
        await api.get('/api/private/v1/surveys/getSurveyResultsById/'+surveyId)
            .then(response => response)
            .catch(error => JSON.parse(JSON.stringify(error.response)));        

//Function check API call for Survey Add..
const addNewSurveyRequest = async (surveydata) =>
    await api.post('/api/private/v1/surveys/addSurvey', {surveydata})
        .then(response => response)
        .catch(error => JSON.parse(JSON.stringify(error.response)));

//Function check API call for Survey Edit..
const editSurveyRequest = async (surveydata) =>
    await api.put('/api/private/v1/surveys/updateSurvey', {surveydata})
        .then(response => response)
        .catch(error => JSON.parse(JSON.stringify(error.response)));

// Function check API call for Get Survey By Id..
const getSurveyByIdRequest = async (surveyId) =>
await api.get('/api/private/v1/surveys/getSurveybyid/'+surveyId)
    .then(response => response)
    .catch(error => error);
        
//Function for Survey List API
function* getSurveysAPI() {
    try {
        const response = yield call(getSurveysRequest);
        if (typeof response.data != 'undefined' && response.data.responseCode==0)
        {
            yield put(getSurveysSuccess(response.data.data));
        }else{
            //let errorObject=JSON.parse(JSON.stringify(response));
            yield put(getSurveysFailure(response.data));
        }
    } catch (error) {
        yield put(getSurveysFailure(error));
    }
}

//Function for Add Survey API
function* addNewSurveyAPI({payload}) {
    try {
        const response = yield call(addNewSurveyRequest, payload);
        if (response.data != undefined && response.data.responseCode==0)
        {
            yield put(addNewSurveySuccess(response.data));
        }else{
            //let errorObject=JSON.parse(JSON.stringify(response));
            yield put(addNewSurveyFailure(response.data));
        }
    } catch (error) {
        yield put(addNewSurveyFailure(error));
    }
}

//Function for Update Survey API
function* updateSurveyAPI({payload}) {
    try {
        const response = yield call(editSurveyRequest, payload); 
        if (response.data != 'undefined' && response.data.responseCode==0)
        {
            yield put(updateSurveySuccess(response.data));
        }else {
            //let errorObject=JSON.parse(JSON.stringify(response));
            yield put(updateSurveyFailure(response.data));
        }
    } catch (error) {
        yield put(updateSurveyFailure(error));
    }
}

//Function for Get Survey By ID API
function* getSurveyByIdAPI({ payload }) {
    try {
        const response = yield call(getSurveyByIdRequest, payload);
        if (response.data != undefined && response.data.responseCode==0)
        {
            yield put(getSurveyByIdSuccess(response.data.data));
        }else {
            let errorObject=JSON.parse(JSON.stringify(response));
            yield put(getSurveyByIdFailure(errorObject.response.data));
        }
    } catch (error) {
        yield put(getSurveyByIdFailure(error));
    }
}

//Function for Get Survey By ID API
function* getSurveyResultsByIdAPI({ payload }) {
    try {
        const response = yield call(getSurveyResultsRequest, payload);
        
        if (response.data != undefined && response.data.responseCode==0)
        {
            yield put(getSurveyResultsByIdSuccess(response.data));
        }else {
            let errorObject=JSON.parse(JSON.stringify(response));
            yield put(getSurveyResultsByIdFailure(errorObject.response.data));
        }
    } catch (error) {
        yield put(getSurveyResultsByIdFailure(error));
    }
}

// Get Surveys
export function* getSurveys() {
    yield takeEvery(GET_SURVEYS, getSurveysAPI);
}

// add New Survey 
export function* addNewSurvey() {
    yield takeEvery(ADD_NEW_SURVEY, addNewSurveyAPI);
}

// Edit Survey
export function* updateSurvey() {
    yield takeEvery(UPDATE_SURVEY, updateSurveyAPI);
}

//Edit Survey by Id
export function* getSurveyById() {
    yield takeEvery(GET_SURVEY_BY_ID, getSurveyByIdAPI);
}

//Edit Survey by Id
export function* getSurveyResultsById() {
    yield takeEvery(GET_SURVEY_RESULTS_BY_ID, getSurveyResultsByIdAPI);
}

export default function* rootSaga() {
    yield all([
        fork(getSurveys),
        fork(addNewSurvey),
        fork(updateSurvey),
        fork(getSurveyById),
        fork(getSurveyResultsById),
    ]);
}