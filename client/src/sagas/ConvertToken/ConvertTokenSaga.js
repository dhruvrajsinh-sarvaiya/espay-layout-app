/* 
    Developer : Nishant Vadgama
    Date : 24-09-2018
    File Comment : Convert Token saga implementation
*/
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

//import api from 'Api';
import api from 'Api';

import {
    GET_CTINFO,
    SUBMIT_CTREQUEST
} from 'Actions/types';

// import functions from action
import {
    getConvertTokenInfoSuccess,
    getConvertTokenInfoFailure,
    submitConvertTokenRequestSuccess,
    submitConvertTokenRequestFailure
} from 'Actions/ConvertToken';

const getConvertTokenInfoRequest = async () =>
    await api.get('convertTokenInfo.js')
        .then(response => response)
        .catch(error => error)

function* getConvertTokenInfoData() {
    try {
        const response = yield call(getConvertTokenInfoRequest);
        yield put(getConvertTokenInfoSuccess(response))
    } catch (error) {
        yield put(getConvertTokenInfoFailure(error))
    }
}

function* getConvertTokenInfo() {
    yield takeEvery(GET_CTINFO, getConvertTokenInfoData)
}

const submitConvertTokenServer = async (payload) =>
    await api.post('convertTokenRequest.js', {payload})
        .then(response => response)
        .catch(error => error)

function* submitConvertTokenData(payload) {
    try {
        const response = yield call(submitConvertTokenServer, payload);
        yield put(submitConvertTokenRequestSuccess(response))
    } catch (error) {
        yield put(submitConvertTokenRequestFailure(error))
    }
}

function* submitConvertTokenRequest() {
    yield takeEvery(SUBMIT_CTREQUEST, submitConvertTokenData)
}

export default function* rootSaga() {
    yield all([
        fork(getConvertTokenInfo),
        fork(submitConvertTokenRequest)
    ]);
}