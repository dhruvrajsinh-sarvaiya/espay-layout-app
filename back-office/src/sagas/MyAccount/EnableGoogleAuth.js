/**
 * Auther : Kevin Ladani
 * Created : 08/10/2018
 * Updated : 22/10/2018 (Salim Deraiya)
 * Enable Google Auth Sagas
 */

//Sagas Effects..
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';

import { ENABLE_GOOGLE_AUTH, GET_GOOGLE_AUTH_INFO } from "Actions/types";

import {
	getGoogleAuthInfoSuccess,
	getGoogleAuthInfoFailure,
	enableGoogleAuthSuccess,
	enableGoogleAuthFailure
} from "Actions/MyAccount";

import AppConfig from 'Constants/AppConfig';
import { swaggerPostAPI, swaggerGetAPI, redirectToLogin, loginErrCode, staticResponse, statusErrCodeList } from 'Helpers/helpers';
const lgnErrCode = loginErrCode();
const statusErrCode = statusErrCodeList();

//Function for Enable Google Auth API
function* enableGooogleAuthApi({ payload }) {
	var headers = { 'Authorization': AppConfig.authorizationToken }
	const response = yield call(swaggerPostAPI, 'api/TwoFASetting/Enableauthenticator', payload, headers);

	try {
		if (lgnErrCode.includes(response.statusCode)) {
			redirectToLogin();
		} else if (statusErrCode.includes(response.statusCode)) {
			let staticRes = staticResponse(response.statusCode);
			yield put(enableGoogleAuthFailure(staticRes));
		} else if (response.statusCode === 200) {
			yield put(enableGoogleAuthSuccess(response));
		} else {
			yield put(enableGoogleAuthFailure(response));
		}
	} catch (error) {
		yield put(enableGoogleAuthFailure(error));
	}
}

//Function for Get Google Auth Info API
function* getGooogleAuthApi({ payload }) {
	var headers = { 'Authorization': AppConfig.authorizationToken }
	const response = yield call(swaggerGetAPI, 'api/TwoFASetting/Enableauthenticator', payload, headers);

	try {
		if (lgnErrCode.includes(response.statusCode)) {
			redirectToLogin();
		} else if (statusErrCode.includes(response.statusCode)) {
			let staticRes = staticResponse(response.statusCode);
			yield put(getGoogleAuthInfoFailure(staticRes));
		} else if (response.statusCode === 200) {
			yield put(getGoogleAuthInfoSuccess(response));
		} else {
			yield put(getGoogleAuthInfoFailure(response));
		}
	} catch (error) {
		yield put(getGoogleAuthInfoFailure(error));
	}
}

// Enable Google Auth Sagas Method
export function* enableGooogleAuthSagas() {
	yield takeEvery(ENABLE_GOOGLE_AUTH, enableGooogleAuthApi);
}

// Get Google Auth Sagas Method
export function* getGooogleAuthSagas() {
	yield takeEvery(GET_GOOGLE_AUTH_INFO, getGooogleAuthApi);
}

/**
 * Auth Root Saga
 */
export default function* rootSaga() {
	yield all([
		fork(enableGooogleAuthSagas),
		fork(getGooogleAuthSagas)
	]);
}