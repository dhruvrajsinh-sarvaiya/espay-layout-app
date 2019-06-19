/* 
    Developer : Nishant Vadgama
    Date : 22-09-2018
    File Comment : Convet Token History Saga
*/

import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

//import api from 'Api';
import api from 'Api';

import {
    GET_CTHISTORY
} from 'Actions/types';

// import functions from action
import {
    getConvertHistorySuccess,
    getConvertHistoryFailure
} from 'Actions/ConvertToken';

const getConvertHistoryRequest = async () =>
    await api.get('convertHistory.js')
        .then(response => response)
        .catch(error => error)

function* getConvertHistoryData() {
    try {
        const response = yield call(getConvertHistoryRequest);
        yield put(getConvertHistorySuccess(response))
    } catch (error) {
        yield put(getConvertHistoryFailure(error))
    }
}

function* getConvertHistory() {
    yield takeEvery(GET_CTHISTORY, getConvertHistoryData)
}

export default function* rootSaga() {
    yield all([
        fork(getConvertHistory)
    ]);
}

