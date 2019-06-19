/* 
    Developer : Nishant Vadgama,
    Date : 24-09-2018
    FIle Comment : convert token action saga
*/
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
//import api from 'Api';
import api from 'Api';

// import types for dispatch puropse
import {
    GET_CURRENCY,
    DECENT_ADDRESS_GENERATION
} from 'Actions/types';

// import functions from action
import {
    getCurrencySuccess,
    getCurrencyFailure,
} from 'Actions/DecentAddressGen';

// function is used for call api 
const getCurrencyRequest = async () =>
    await api.get('getCurrency')
        .then(response => response)
        .catch(error => error)

function* getCurrencyData() {
    try {
        const response = yield call(getCurrencyRequest)
        yield put(getCurrencySuccess(response))
    } catch (error) {
        yield put(getCurrencyFailure(error))
    }
}

function* getCurrency() {
    yield takeEvery(GET_CURRENCY, getCurrencyData);
}

const genAddressRequestServer = async (payload) =>
    await api.post('generateDecentAddress', { payload })
        .then(response => response)
        .catch(error => error);

function* genAddressRequestData(payload) {
    try {
        const response = yield call(genAddressRequestServer, payload)
        yield put(getCurrencySuccess(response))
    } catch (error) {
        yield put(getCurrencyFailure(error))
    }
}

function* genAddressRequest() {
    yield takeEvery(DECENT_ADDRESS_GENERATION, genAddressRequestData);
}

// used for run multiple effect in parellel
export default function* rootSaga() {
    yield all([
        fork(getCurrency),
        fork(genAddressRequest)
    ]);
}
