/* 
    Createdby : Kushal parekh
    Updateby : Kushal parekh
    CreatedDate : 03-10-2018
    UpdatedDate : 17-10-2018
    Description : For Pages Data through api action saga method 
*/
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

// api
import api from 'Api';

//import action types
import {
    GET_NEWS,
    ADD_NEWS,
    UPDATE_NEWS,
    GET_NEWS_BY_ID,
    DELETE_NEWS,
} from 'Actions/types';

//import function from action
import {
    getNewsSuccess,
    getNewsFailure,
    addNewsSuccess,
    addNewsFailure,
    updateNewsSuccess,
    updateNewsFailure,
    getNewsByIdSuccess,
    getNewsByIdFailure,
    deleteNewsByIdSuccess,
    deleteNewsByIdFailure
} from 'Actions/News';

//Function check API call for News List..
const getNewsRequest = async () =>
    await api.get('/api/private/v1/news')
        .then(response => response)
        .catch(error => JSON.parse(JSON.stringify(error.response)));

//Function check API call for News Add..
const addNewsRequest = async (newsdata) =>
    await api.post('/api/private/v1/news/addNews', { newsdata })
        .then(response => response)
        .catch(error => JSON.parse(JSON.stringify(error.response)));

//Function check API call for News Edit..
const editNewsRequest = async (newsdata) =>
    await api.put('/api/private/v1/news/editNews', { newsdata })
        .then(response => response)
        .catch(error => JSON.parse(JSON.stringify(error.response)));

// Function check API call for Get News By Id..
const getNewsByIdRequest = async (newsId) =>
    await api.get('/api/private/v1/news/getNewsById/' + newsId)
        .then(response => response)
        .catch(error => error);

// Function check API call for Delete News By Id..
const deleteNewsByIdRequest = async (newsId) =>
    await api.delete('/api/private/v1/news/deleteNews/' + newsId)
        .then(response => response)
        .catch(error => error);


//Function for Get News List API
function* getNewsAPI() {
    try {
        const response = yield call(getNewsRequest);
        if (typeof response.data != 'undefined' && response.data.responseCode == 0) {
            yield put(getNewsSuccess(response.data.data));
        } else {
            yield put(getNewsFailure(response.data));
        }
    } catch (error) {
        yield put(getNewsFailure(error));
    }
}

//Function for Add News API
function* addNewsAPI({ payload }) {
    try {
        const response = yield call(addNewsRequest, payload);
        if (response.data != undefined && response.data.responseCode == 0) {
            yield put(addNewsSuccess(response.data));
        }
        else {
            yield put(addNewsFailure(response.data));
        }
    } catch (error) {
        yield put(addNewsFailure(error));
    }
}

//Function for Update News API
function* updateNewsAPI({ payload }) {
    try {
        const response = yield call(editNewsRequest, payload);
        //validate if data found in response 
        if (response.data != 'undefined' && response.data.responseCode == 0) {
            yield put(updateNewsSuccess(response.data));
        } else {
            yield put(updateNewsFailure(response.data));
        }
    } catch (error) {
        yield put(updateNewsFailure(error));
    }
}

//Function for Get News By ID API
function* getNewsByIdAPI({ payload }) {
    try {
        const response = yield call(getNewsByIdRequest, payload);
        //validate if data found in response 
        if (response.data != undefined && response.data.responseCode == 0) {
            yield put(getNewsByIdSuccess(response.data.data));
        } else {
            let errorObject = JSON.parse(JSON.stringify(response));
            yield put(getNewsByIdFailure(errorObject.response.data));
        }
    } catch (error) {
        yield put(getNewsByIdFailure(error));
    }
}

//Function for Delete News By ID API
function* deleteNewsByIdAPI({ payload }) {
    try {
        const response = yield call(deleteNewsByIdRequest, payload);
        //validate if data found in response 
        if (response.data != 'undefined' && response.data.responseCode == 0) {
            yield put(deleteNewsByIdSuccess(response.data));
        } else {
            let errorObject = JSON.parse(JSON.stringify(response));
            yield put(deleteNewsByIdFailure(errorObject.response.data));
        }
    } catch (error) {
        yield put(deleteNewsByIdFailure(error));
    }
}

//Get News
export function* getNews() {
    yield takeEvery(GET_NEWS, getNewsAPI);
}

// add News
export function* addNews() {
    yield takeEvery(ADD_NEWS, addNewsAPI);
}

// Edit News
export function* updateNews() {
    yield takeEvery(UPDATE_NEWS, updateNewsAPI);
}

//Edit News by Id
export function* getNewsById() {
    yield takeEvery(GET_NEWS_BY_ID, getNewsByIdAPI);
}

//Delete News by Id
export function* deleteNewsById() {
    yield takeEvery(DELETE_NEWS, deleteNewsByIdAPI);
}

//News Root Saga
export default function* rootSaga() {
    yield all([
        fork(getNews),
        fork(addNews),
        fork(updateNews),
        fork(getNewsById),
        fork(deleteNewsById)
    ]);
}