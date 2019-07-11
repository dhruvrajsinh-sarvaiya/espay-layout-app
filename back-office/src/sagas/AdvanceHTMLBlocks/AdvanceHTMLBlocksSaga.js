/**
 * Create By Sanjay 
 * Created Date 05-06-2019
 * Saga file for Advance HTML Blocks 
 */

import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

import api from "Api";//Import Api for call node api from saga 

import {

    GET_ADVANCE_HTML_BLOCKS_LIST,//Action Type for Get List of Advance HTML Block List
    ADD_ADVANCE_HTML_BLOCK,//Action Type For Add Advance HTML Block 
    EDIT_ADVANCE_HTML_BLOCK//Action Type for Edit Advance HTML Block 

} from "Actions/types";

import {

    //Actions For Get List of Acvance HTML Blocks
    getAdvanceHTMLBlocksListSuccess,
    getAdvanceHTMLBlocksListFailure,
    //Actions for Add Advance HTML Block
    addAdvanceHTMLBlockSuccess,
    addAdvanceHTMLBlockFailure,
    //Actions for Edit Advance HTML Block
    editAdvanceHTMLBlockSuccess,
    editAdvanceHTMLBlockFailure

} from "Actions/AdvanceHTMLBlocks";

//Function API call for Advance HTMLBlocks List..
const getAdvanceHTMLBlocksListRequest = async () =>
    await api.get('/api/private/v1/advancehtmlblocks')
        .then(response => response)
        .catch(error => JSON.parse(JSON.stringify(error.response)));

//Function API call for Add Advance HTMLBlock ..
const addAdvanceHTMLBlockAPIRequest = async (advancehtmlBlocksdata) =>
    await api.post('/api/private/v1/advancehtmlblocks/addAdvanceHtmlBlock', { advancehtmlBlocksdata })
        .then(response => response)
        .catch(error => JSON.parse(JSON.stringify(error.response)));

//Function API call for Edit Advance HTMLBlock ..
const editAdvanceHTMLBlockAPIRequest = async (advancehtmlBlocksdata) =>
    await api.put('/api/private/v1/advancehtmlblocks/editAdvanceHtmlBlock', { advancehtmlBlocksdata })    
        .then(response => response)
        .catch(error => JSON.parse(JSON.stringify(error.response)));

//Function for Get List Of Advance HTMLBlocks List API
function* getAdvanceHTMLBlocksListAPI() {
    try {
        const response = yield call(getAdvanceHTMLBlocksListRequest);
        if (typeof response.data !== 'undefined' && response.data.responseCode === 0) {
            yield put(getAdvanceHTMLBlocksListSuccess(response.data));
        } else {
            yield put(getAdvanceHTMLBlocksListFailure(response.data));
        }
    } catch (error) {
        yield put(getAdvanceHTMLBlocksListFailure(error));
    }
}

//Function for Add Advance HTMLBlock API
function* addAdvanceHTMLBlockAPI({ payload }) {
    try {
        const response = yield call(addAdvanceHTMLBlockAPIRequest, payload);
        if (typeof response.data !== 'undefined' && response.data.responseCode === 0) {
            yield put(addAdvanceHTMLBlockSuccess(response.data));
        } else {
            yield put(addAdvanceHTMLBlockFailure(response.data));
        }
    } catch (error) {
        yield put(addAdvanceHTMLBlockFailure(error));
    }
}

//Function for Edit Advance HTMLBlock API
function* editAdvanceHTMLBlockAPI({ payload }) {    
    try {
        const response = yield call(editAdvanceHTMLBlockAPIRequest, payload);        
        if (typeof response.data !== 'undefined' && response.data.responseCode === 0) {
            yield put(editAdvanceHTMLBlockSuccess(response.data));
        } else {
            yield put(editAdvanceHTMLBlockFailure(response.data));
        }
    } catch (error) {
        yield put(editAdvanceHTMLBlockFailure(error));
    }
}

export function* getAdvanceHTMLBlocksList() {
    yield takeEvery(GET_ADVANCE_HTML_BLOCKS_LIST, getAdvanceHTMLBlocksListAPI);
}

export function* addAdvanceHTMLBlock() {
    yield takeEvery(ADD_ADVANCE_HTML_BLOCK, addAdvanceHTMLBlockAPI);
}

export function* editAdvanceHTMLBlock() {
    yield takeEvery(EDIT_ADVANCE_HTML_BLOCK, editAdvanceHTMLBlockAPI);
}

//Advance HTMLBlocks Root Saga
export default function* rootSaga() {
    yield all([
        fork(getAdvanceHTMLBlocksList),
        fork(addAdvanceHTMLBlock),
        fork(editAdvanceHTMLBlock)
    ]);
}
