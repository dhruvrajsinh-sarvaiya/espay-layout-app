/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 01-10-2018
    UpdatedDate : 01-10-2018
    Description : For Get Faq Question  Data through api action saga method 
*/
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

// api
import api from 'Api';

//import action types
import {
    GET_FAQ_QUESTIONS,
    ADD_FAQ_QUESTION,
    UPDATE_FAQ_QUESTION,
    DELETE_FAQ_QUESTION,
    GET_FAQ_QUESTION_BY_ID
} from 'Actions/types';

//import function from action
import {
    getFaqquestionsSuccess,
    getFaqquestionsFailure,
    addFaqQuestionSuccess,
    addFaqQuestionFailure,
    updateFaqQuestionSuccess,
    updateFaqQuestionFailure,
    getFaqQuestionByIdSuccess,
    getFaqQuestionByIdFailure,
    deleteFaqQuestionSuccess,
    deleteFaqQuestionFailure
} from 'Actions/Faq';

//Function check API call for Faq Question List..
const getFaqQuestionRequest = async () =>
    await api.get('/api/private/v1/faqquestion')
        .then(response => response)
        .catch(error => JSON.parse(JSON.stringify(error.response)));

//Function check API call for Faq Question Add..
const addFaqQuestionRequest = async (faqquestiondata) =>
    await api.post('/api/private/v1/faqquestion/addFaqQuestion', { faqquestiondata })
        .then(response => response)
        .catch(error => JSON.parse(JSON.stringify(error.response)));

//Function check API call for Faq Question Edit..
const editFaqQuestionRequest = async (faqquestiondata) =>
    await api.put('/api/private/v1/faqquestion/editFaqQuestion', { faqquestiondata })
        .then(response => response)
        .catch(error => JSON.parse(JSON.stringify(error.response)));

// Function check API call for Get Faq Question By Id..
const getFaqQuestionByIdRequest = async (faqquestionid) =>
    await api.get('/api/private/v1/faqquestion/getFaqQuestionById/' + faqquestionid)
        .then(response => response)
        .catch(error => error);

// Function check API call for Delete Faq Question By Id..
const deleteFaqQuestionRequest = async (faqquestionid) =>
    await api.delete('/api/private/v1/faqquestion/deleteFaqQuestion/' + faqquestionid)
        .then(response => response)
        .catch(error => error);

//Function for Get Faq Question List API
function* getFaqQuestionsAPI() {
    try {
        const response = yield call(getFaqQuestionRequest);

        if (typeof response.data != 'undefined' && response.data.responseCode == 0) {
            yield put(getFaqquestionsSuccess(response.data.data));
        } else {
            yield put(getFaqquestionsFailure(response.data));
        }
    } catch (error) {
        yield put(getFaqquestionsFailure(error));
    }
}

//Function for Add Faq Question API
function* addFaqQuestionAPI({ payload }) {
    try {
        const response = yield call(addFaqQuestionRequest, payload);
        if (response.data != undefined && response.data.responseCode == 0) {
            yield put(addFaqQuestionSuccess(response.data));
        }
        else {
            yield put(addFaqQuestionFailure(response.data));
        }
    } catch (error) {
        yield put(addFaqQuestionFailure(error));
    }
}

//Function for Update Faq Question API
function* updateFaqQuestionAPI({ payload }) {
    try {
        const response = yield call(editFaqQuestionRequest, payload);
        //validate if data found in response 
        if (typeof response.data != 'undefined' && response.data.responseCode == 0) {
            yield put(updateFaqQuestionSuccess(response.data));
        } else {
            yield put(updateFaqQuestionFailure(response.data));
        }
    } catch (error) {
        yield put(updateFaqQuestionFailure(error));
    }
}

//Function for Get Faq Question By ID API
function* getFaqQuestionByIdAPI({ payload }) {
    try {
        const response = yield call(getFaqQuestionByIdRequest, payload);
        //validate if data found in response 
        if (response.data != undefined && response.data.responseCode == 0) {
            yield put(getFaqQuestionByIdSuccess(response.data.data));
        } else {
            let errorObject = JSON.parse(JSON.stringify(response));
            yield put(getFaqQuestionByIdFailure(errorObject.response.data));
        }
    } catch (error) {
        yield put(getFaqQuestionByIdFailure(error));
    }
}


//Function for Delete Faq Question API
function* deleteFaqQuestionAPI({ payload }) {
    try {
        const response = yield call(deleteFaqQuestionRequest, payload);
        //validate if data found in response 
        if (response.data != 'undefined' && response.data.responseCode == 0) {
            yield put(deleteFaqQuestionSuccess(response.data));
        } else {
            let errorObject = JSON.parse(JSON.stringify(response));
            yield put(deleteFaqQuestionFailure(errorObject.response.data));
        }
    } catch (error) {
        yield put(deleteFaqQuestionFailure(error));
    }
}


// Get Faq Questions
export function* getFaqquestions() {
    yield takeEvery(GET_FAQ_QUESTIONS, getFaqQuestionsAPI);
}

// add Faq Question
export function* addFaqQuestion() {
    yield takeEvery(ADD_FAQ_QUESTION, addFaqQuestionAPI);
}

// Edit add Faq Question
export function* updateFaqQuestion() {
    yield takeEvery(UPDATE_FAQ_QUESTION, updateFaqQuestionAPI);
}

// Edit Faq Question by Id
export function* getFaqQuestionById() {
    yield takeEvery(GET_FAQ_QUESTION_BY_ID, getFaqQuestionByIdAPI);
}

// Delete Faq Question by Id
export function* deleteFaqQuestion() {
    yield takeEvery(DELETE_FAQ_QUESTION, deleteFaqQuestionAPI);
}

// Faq Root Saga
export default function* rootSaga() {
    yield all([
        fork(getFaqquestions),
        fork(addFaqQuestion),
        fork(updateFaqQuestion),
        fork(getFaqQuestionById),
        fork(deleteFaqQuestion)
    ]);
}