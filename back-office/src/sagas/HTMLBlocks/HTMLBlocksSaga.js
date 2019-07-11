/**
 * Create By Sanjay 
 * Created Date 27-05-2019
 * Saga File For HTML Blocks CRUD Operation
 */

import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

import api from "Api";

import {

    GET_HTMLBLOCKS,
    ADD_HTMLBLOCK_DETAILS,
    EDIT_HTMLBLOCK

} from "Actions/types";

import {
    getHTMLBlocksSuccess,
    getHTMLBlocksFailure,
    addHTMLBlockDetailsSuccess,
    addHTMLBlockDetailsFailure,
    editHTMLBlockSuccess,
    editHTMLBlockFailure
} from "Actions/HTMLBlocks";

//Function check API call for HTMLBlocks List..
const getHTMLBlocksRequest = async () =>
    await api.get('/api/private/v1/htmlblocks')
        .then(response => response)
        .catch(error => JSON.parse(JSON.stringify(error.response)));

//Function check API call for HTML Block Add..
const addHTMLBlockRequest = async (htmlBlocksdata) =>
    await api.post('/api/private/v1/htmlblocks/addHTMLBlocks', { htmlBlocksdata })
        .then(response => response)
        .catch(error => JSON.parse(JSON.stringify(error.response)));

//Function check API call for HTMLBlock Edit..
const editHTMLBlockRequest = async (htmlBlocksdata) =>
    await api.put('/api/private/v1/htmlblocks/editHTMLBlock', { htmlBlocksdata })
        .then(response => response)
        .catch(error => JSON.parse(JSON.stringify(error.response)));


//Function for Get HTMLBlocks List API
function* getHTMLBlocksAPI() {
    try {
        const response = yield call(getHTMLBlocksRequest);
        if (typeof response.data !== 'undefined' && response.data.responseCode === 0) {
            yield put(getHTMLBlocksSuccess(response.data));
        } else {
            yield put(getHTMLBlocksFailure(response.data));
        }
    } catch (error) {
        yield put(getHTMLBlocksFailure(error));
    }
}

//Function for Add News API
function* addHTMLBlockAPI({ payload }) {
    try {        
        const response = yield call(addHTMLBlockRequest, payload);
        if (response.data !== undefined && response.data.responseCode === 0) {
            yield put(addHTMLBlockDetailsSuccess(response.data));
        }
        else {
            yield put(addHTMLBlockDetailsFailure(response.data));
        }
    } catch (error) {
        yield put(addHTMLBlockDetailsFailure(error));
    }
}

//Function for Update News API
function* updateHTMLBlockAPI({ payload }) {
    try {
        const response = yield call(editHTMLBlockRequest, payload);
        if (response.data !== 'undefined' && response.data.responseCode === 0) {
            yield put(editHTMLBlockSuccess(response.data));
        } else {
            yield put(editHTMLBlockFailure(response.data));
        }
    } catch (error) {
        yield put(editHTMLBlockFailure(error));
    }
}

export function* getHTMLBlocks() {
    yield takeEvery(GET_HTMLBLOCKS, getHTMLBlocksAPI);
}

export function* addHTMLBlock() {    
    yield takeEvery(ADD_HTMLBLOCK_DETAILS, addHTMLBlockAPI);
}

export function* updateHTMLBlock() {
    yield takeEvery(EDIT_HTMLBLOCK, updateHTMLBlockAPI);
}

//HTMLBlocks Root Saga
export default function* rootSaga() {
    yield all([
        fork(getHTMLBlocks),
        fork(addHTMLBlock),
        fork(updateHTMLBlock)
    ]);
}