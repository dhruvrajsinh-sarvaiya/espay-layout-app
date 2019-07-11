/**
 * Auther : Salim Deraiya
 * Created : 11/10/2018
 * Authorization Token Sagas
 */

//Sagas Effects..
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
//Action Types..
import {
    GENERATE_TOKEN,
    REFRESH_TOKEN
} from 'Actions/types';
//Action methods..
import {
    gerenateTokenSuccess,
    gerenateTokenFailure,
    refreshTokenSuccess,
    refreshTokenFailure
} from 'Actions/MyAccount';
//Call redirectToLogin to helper
import { generateLocalStorageVariable } from 'Helpers/helpers';
//Get function form helper for Swagger API Call
import { swaggerPostHeaderFormAPI } from 'Helpers/helpers';
import AppConfig from 'Constants/AppConfig';

//Function for Generate Token API
function* gerenateTokenAPI({ payload }) {
    var swaggerUrl = typeof payload.appkey !== 'undefined' && payload.appkey !== '' ? 'connect/token?appkey=' + payload.appkey : 'connect/token';
    let request = {
        'grant_type': AppConfig.grantTypeForToken,
        'username': payload.username,
        'password': payload.password,
        'client_id': AppConfig.clientIDForToken,
        'scope': AppConfig.scopeForToken,
    }
    const response = yield call(swaggerPostHeaderFormAPI, swaggerUrl, request);
    try {
        if (response.ReturnCode === 0 && typeof response.access_token === 'undefined') {
            yield put(gerenateTokenFailure(response));
        } else if (response.ReturnCode === 0 && response.access_token !== '') {
            generateLocalStorageVariable(response.access_token, response.id_token, response.refresh_token);
            yield put(gerenateTokenSuccess(response));
        } else {
            yield put(gerenateTokenFailure(response));
        }
    } catch (error) {
        yield put(gerenateTokenFailure(error));
    }
}

//Function for Refresh Token API
function* refreshTokenAPI() {
    let request = {
        refresh_token: localStorage.getItem('gen_refresh_token'),
        grant_type: AppConfig.grantTypeForRefreshToken
    }
    const response = yield call(swaggerPostHeaderFormAPI, 'connect/token', request);
    try {
        if (response.ReturnCode === 0) {
            generateLocalStorageVariable(response.access_token, response.id_token, localStorage.getItem('gen_refresh_token'));
            yield call(window.JbsHorizontalLayout.reRefreshTokenSignalR);
            yield put(refreshTokenSuccess(response));
        } else {
            yield put(refreshTokenFailure(response));
        }
    } catch (error) {
        yield put(refreshTokenFailure(error));
    }
}

/* Create Sagas method for Generate Token */
export function* gerenateTokenSagas() {
    yield takeEvery(GENERATE_TOKEN, gerenateTokenAPI);
}

/* Create Sagas method for Refresh Token */
export function* refreshTokenSagas() {
    yield takeEvery(REFRESH_TOKEN, refreshTokenAPI);
}

/* Export methods to rootSagas */
export default function* rootSaga() {
    yield all([
        fork(gerenateTokenSagas),
        fork(refreshTokenSagas)
    ]);
}